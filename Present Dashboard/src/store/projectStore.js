import { storage } from './storage/storageAdapter';
import { STORAGE_KEYS } from './storage/storageKeys';
import { parseTeamMembers, safeJsonParse } from '../utils/projectsData';
import { isUserAdmin } from './userStore';

const getBaseUrl = () => {
  const isLocal = typeof window !== 'undefined' &&
    (['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:');
  return isLocal ? 'http://localhost:3000' : '';
};

const getAuthHeaders = (overrideUser = null) => {
  try {
    const raw = storage.get(STORAGE_KEYS.SESSION);
    const u = overrideUser || raw;

    if (!u) {
      return {
        'x-user-id': 'user_anon',
        'x-user-email': 'member@nexus.com',
        'x-user-name': 'Nexus Member',
        'x-user-role': 'member'
      };
    }

    const isAdmin = isUserAdmin(u);
    return {
      'x-user-id': String(u.id || u.email || 'user_anon'),
      'x-user-email': String(u.email || 'member@nexus.com').toLowerCase(),
      'x-user-name': String(u.name || u.username || 'Member').toLowerCase(),
      'x-user-role': isAdmin ? 'admin' : 'member'
    };
  } catch {
    return {
      'x-user-id': 'user_anon',
      'x-user-email': 'member@nexus.com',
      'x-user-name': 'Nexus Member',
      'x-user-role': 'member'
    };
  }
};

const fetchApi = async (endpoint, method = 'GET', body = null, overrideUser = null) => {
  const url = `${getBaseUrl()}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(overrideUser)
    }
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return await response.json();
};

export const getProjects = async (user = null) => {
  const local = storage.get(STORAGE_KEYS.PROJECTS, []);
  try {
    const res = await fetchApi('/api/projects', 'GET', null, user);
    const projectsArray = res?.projects || res?.data;
    if (res && res.success && Array.isArray(projectsArray)) {
      const mapped = projectsArray.map(p => ({
        id: p.id,
        ownerId: p.owner_id || p.ownerId || 'user_anon',
        ownerName: p.owner_name || p.ownerName || 'Member',
        title: p.title || 'Untitled Project',
        summary: p.summary || p.card_summary || p.cardSummary || '',
        cardSummary: p.summary || p.card_summary || p.cardSummary || '',
        description: p.description || p.desc || '',
        desc: p.description || p.desc || '',
        status: p.status || 'in_progress',
        techStack: p.techStack || p.tech_stack || [],
        tech_stack: p.techStack || p.tech_stack || [],
        tags: p.tags || [],
        coverImage: p.cover_image || p.coverImage || '',
        demoUrl: p.demo_url || p.demoUrl || '',
        githubUrl: p.github_url || p.githubUrl || '',
        teamMembers: p.team_members || p.teamMembers || [],
        createdAt: p.created_at || p.createdAt || new Date().toISOString()
      }));

      storage.set(STORAGE_KEYS.PROJECTS, mapped, true);
      return mapped;
    }
  } catch (err) {
    console.warn('[ProjectStore] Using local projects fallback:', err.message);
  }
  return local;
};

export const addProject = async (project, user = null) => {
  const id = project.id || `proj_${Date.now()}`;
  const newProj = { ...project, id, createdAt: new Date().toISOString() };
  const current = storage.get(STORAGE_KEYS.PROJECTS, []);
  storage.set(STORAGE_KEYS.PROJECTS, [newProj, ...current]);

  try {
    await fetchApi('/api/projects', 'POST', newProj, user);
  } catch (err) {
    console.warn('[ProjectStore] Cloud add project fallback:', err.message);
  }
  return newProj;
};

export const updateProject = async (p) => {
  const current = storage.get(STORAGE_KEYS.PROJECTS, []);
  const updated = current.map(item => item.id === p.id ? { ...item, ...p } : item);
  storage.set(STORAGE_KEYS.PROJECTS, updated);

  try {
    await fetchApi(`/api/projects/${p.id}`, 'PATCH', p);
  } catch (err) {
    console.warn('[ProjectStore] Cloud update project fallback:', err.message);
  }
};

export const deleteProject = async (id) => {
  const current = storage.get(STORAGE_KEYS.PROJECTS, []);
  storage.set(STORAGE_KEYS.PROJECTS, current.filter(p => p.id !== id));

  try {
    await fetchApi(`/api/projects/${id}?hard=true`, 'DELETE');
  } catch (err) {
    console.warn('[ProjectStore] Cloud delete project fallback:', err.message);
  }
};

export const archiveProject = async (id, isArchived = true) => {
  const newStatus = isArchived ? 'archived' : 'in_progress';
  const current = storage.get(STORAGE_KEYS.PROJECTS, []);
  const updated = current.map(p => String(p.id) === String(id) ? { ...p, status: newStatus } : p);
  storage.set(STORAGE_KEYS.PROJECTS, updated);

  try {
    await fetchApi(`/api/projects/${id}`, 'PATCH', { status: newStatus });
  } catch (err) {
    console.warn('[ProjectStore] Cloud archive project fallback:', err.message);
  }
};

export const getDeletedIds = () => {
  return new Set(storage.get('deleted_project_ids', []));
};

export const addDeletedId = (id) => {
  const current = Array.from(getDeletedIds());
  if (id && !current.includes(id)) {
    current.push(id);
    storage.set('deleted_project_ids', current, true);
  }
};

export const logProjectAction = async (action, projectId, details = '') => {
  try {
    await fetchApi('/api/audit-logs', 'POST', { action, projectId, details });
  } catch {}
};

export const getHiringSubmissions = async () => {
  try {
    const res = await fetchApi('/api/hiring-inquiries', 'GET');
    return res?.data || res || [];
  } catch {
    return storage.get(STORAGE_KEYS.HIRING_SUBMISSIONS, []);
  }
};

export const deleteHiringSubmission = async (id) => {
  try {
    await fetchApi(`/api/hiring-inquiries/${id}`, 'DELETE');
  } catch {}
  const current = storage.get(STORAGE_KEYS.HIRING_SUBMISSIONS, []);
  storage.set(STORAGE_KEYS.HIRING_SUBMISSIONS, current.filter(h => h.id !== id));
};

export const updateHiringSubmission = async (id, status) => {
  try {
    await fetchApi(`/api/hiring-inquiries/${id}`, 'PATCH', { status });
  } catch {}
  const current = storage.get(STORAGE_KEYS.HIRING_SUBMISSIONS, []);
  storage.set(STORAGE_KEYS.HIRING_SUBMISSIONS, current.map(h => h.id === id ? { ...h, status } : h));
};

export const getDomains = async () => {
  return storage.get(STORAGE_KEYS.DOMAINS, [
    { id: 'web_dev', name: 'Full-Stack Web Development', icon: 'Code', count: 12 },
    { id: 'ai_ml', name: 'AI & Machine Learning', icon: 'BrainCircuit', count: 8 },
    { id: 'cloud_devops', name: 'Cloud & DevOps', icon: 'Cloud', count: 6 },
    { id: 'app_dev', name: 'Mobile App Development', icon: 'Smartphone', count: 5 }
  ]);
};
