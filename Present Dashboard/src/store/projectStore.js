import { storage } from './storage/storageAdapter';
import { STORAGE_KEYS } from './storage/storageKeys';
import { parseTeamMembers, safeJsonParse } from '../utils/projectsData';
import { isUserAdmin } from './userStore';
import { query } from '../lib/neon';

const getBaseUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:3000';
  if (import.meta.env?.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:';
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

const parseArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

const mapProjectRecord = (p) => {
  const techStack = parseArray(p.tech_stack || p.techStack || p.tech);
  const teamMembers = parseTeamMembers(p.team_members || p.teamMembers || p.team);
  const summary = p.summary || p.card_summary || p.cardSummary || p.description || p.desc || '';
  const desc = p.description || p.desc || summary || '';

  return {
    id: String(p.id || `proj_${Date.now()}`),
    ownerId: p.owner_id || p.ownerId || 'user_anon',
    ownerName: p.owner_name || p.ownerName || 'Member',
    ownerAvatar: p.owner_avatar || p.ownerAvatar || '',
    title: p.title || 'Untitled Project',
    summary,
    cardSummary: summary,
    card_description: p.card_description || summary,
    description: desc,
    desc,
    status: p.status || 'in_progress',
    priority: p.priority || 'medium',
    domain: p.domain || 'Engineering',
    category: p.category || 'Advanced',
    visibility: p.visibility || 'public',
    completion: Number(p.completion || p.completion_percentage || 0),
    completion_percentage: Number(p.completion_percentage || p.completion || 0),
    techStack,
    tech_stack: techStack,
    teamMembers,
    team_members: teamMembers,
    tags: parseArray(p.tags || techStack),
    coverImage: p.thumbnail || p.cover_image || p.coverImage || '',
    thumbnail: p.thumbnail || p.cover_image || p.coverImage || '',
    demoUrl: p.live_demo_url || p.live_demo || p.demoUrl || p.live || '',
    liveDemo: p.live_demo_url || p.live_demo || p.liveDemo || p.live || '',
    liveDemoUrl: p.live_demo_url || p.live_demo || p.liveDemoUrl || p.live || '',
    githubUrl: p.github_url || p.github || p.githubUrl || '',
    github: p.github_url || p.github || p.githubUrl || '',
    apkUrl: p.apk_url || p.apk || '',
    apk: p.apk_url || p.apk || '',
    screenshots: parseArray(p.screenshots),
    documents: parseArray(p.documents),
    features: parseArray(p.features),
    likes: Number(p.likes || 0),
    views: Number(p.views || 0),
    displayOrder: Number(p.display_order || p.displayOrder || 0),
    display_order: Number(p.display_order || p.displayOrder || 0),
    createdAt: p.created_at || p.createdAt || new Date().toISOString()
  };
};

export const getProjects = async (user = null) => {
  const local = storage.get(STORAGE_KEYS.PROJECTS, []);

  // 1. Try Backend REST API first
  try {
    const res = await fetchApi('/api/projects', 'GET', null, user);
    const projectsArray = res?.projects || res?.data;
    if (res && res.success && Array.isArray(projectsArray)) {
      const mapped = projectsArray.map(mapProjectRecord);
      storage.set(STORAGE_KEYS.PROJECTS, mapped, true);
      return mapped;
    }
  } catch (err) {
    console.warn('[ProjectStore] Backend API offline or 404, falling back to direct Neon DB query:', err.message);
  }

  // 2. Direct Cloud Neon Database fallback (Crucial for deployed Vercel frontend)
  try {
    const cloudRows = await query(`
      SELECT * FROM projects 
      WHERE deleted_at IS NULL 
      ORDER BY display_order ASC, created_at DESC
    `);
    if (cloudRows && cloudRows.length > 0) {
      const mapped = cloudRows.map(mapProjectRecord);
      storage.set(STORAGE_KEYS.PROJECTS, mapped, true);
      return mapped;
    }
  } catch (dbErr) {
    console.warn('[ProjectStore] Direct Neon query fallback notice:', dbErr.message);
  }

  return Array.isArray(local) ? local.map(mapProjectRecord) : [];
};

export const addProject = async (project, user = null) => {
  const id = project.id || `proj_${Date.now()}`;
  const newProj = mapProjectRecord({ ...project, id, createdAt: new Date().toISOString() });
  const current = storage.get(STORAGE_KEYS.PROJECTS, []);
  storage.set(STORAGE_KEYS.PROJECTS, [newProj, ...current]);

  // 1. Try Backend API
  try {
    await fetchApi('/api/projects', 'POST', newProj, user);
    return newProj;
  } catch (err) {
    console.warn('[ProjectStore] API add project failed, using direct Neon insert:', err.message);
  }

  // 2. Direct Neon Fallback
  try {
    await query(`
      INSERT INTO projects (
        id, title, description, status, domain, category, completion,
        tech_stack, team_members, github_url, live_demo_url, summary,
        display_order, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `, [
      newProj.id,
      newProj.title,
      newProj.description || newProj.summary,
      newProj.status,
      newProj.domain,
      newProj.category,
      newProj.completion,
      JSON.stringify(newProj.techStack || []),
      JSON.stringify(newProj.teamMembers || []),
      newProj.githubUrl,
      newProj.liveDemoUrl,
      newProj.summary,
      newProj.displayOrder || 0,
      newProj.createdAt
    ]);
  } catch (dbErr) {
    console.warn('[ProjectStore] Neon insert error:', dbErr.message);
  }

  return newProj;
};

export const updateProject = async (p) => {
  const current = storage.get(STORAGE_KEYS.PROJECTS, []);
  const updated = current.map(item => item.id === p.id ? mapProjectRecord({ ...item, ...p }) : item);
  storage.set(STORAGE_KEYS.PROJECTS, updated);

  // 1. Try Backend API
  try {
    await fetchApi(`/api/projects/${p.id}`, 'PATCH', p);
    return;
  } catch (err) {
    console.warn('[ProjectStore] API update failed, using direct Neon update:', err.message);
  }

  // 2. Direct Neon Fallback
  try {
    await query(`
      UPDATE projects SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        domain = COALESCE($4, domain),
        category = COALESCE($5, category),
        completion = COALESCE($6, completion),
        summary = COALESCE($7, summary),
        github_url = COALESCE($8, github_url),
        live_demo_url = COALESCE($9, live_demo_url)
      WHERE id = $10
    `, [
      p.title || null,
      p.description || p.desc || null,
      p.status || null,
      p.domain || null,
      p.category || null,
      p.completion !== undefined ? Number(p.completion) : null,
      p.summary || p.cardSummary || null,
      p.githubUrl || p.github || null,
      p.liveDemoUrl || p.liveDemo || null,
      p.id
    ]);
  } catch (dbErr) {
    console.warn('[ProjectStore] Neon update error:', dbErr.message);
  }
};

export const deleteProject = async (id) => {
  const current = storage.get(STORAGE_KEYS.PROJECTS, []);
  storage.set(STORAGE_KEYS.PROJECTS, current.filter(p => p.id !== id));
  addDeletedId(id);

  // 1. Try Backend API
  try {
    await fetchApi(`/api/projects/${id}?hard=true`, 'DELETE');
    return;
  } catch (err) {
    console.warn('[ProjectStore] API delete failed, using direct Neon soft/hard delete:', err.message);
  }

  // 2. Direct Neon Fallback
  try {
    await query(`UPDATE projects SET deleted_at = NOW() WHERE id = $1`, [id]);
  } catch (dbErr) {
    console.warn('[ProjectStore] Neon delete error:', dbErr.message);
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
    try {
      await query(`UPDATE projects SET status = $1 WHERE id = $2`, [newStatus, id]);
    } catch {}
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
