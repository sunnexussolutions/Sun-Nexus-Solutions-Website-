import { query } from '../lib/neon';
import { storage } from './storage/storageAdapter';
import { STORAGE_KEYS } from './storage/storageKeys';

const getBaseUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:3000';
  if (import.meta.env?.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:';
  return isLocal ? 'http://localhost:3000' : '';
};

const normalizeAlumnus = (a) => {
  if (!a) return null;
  const role = a.current_role || a.role || a.leadership_role || 'Alumnus';
  const img = a.profile_image || a.image_url || a.imageUrl || '';
  const linkedin = a.linkedin_url || a.linkedinUrl || '';
  const github = a.github_url || a.githubUrl || '';
  const portfolio = a.portfolio_url || a.portfolioUrl || '';
  const isLeader = a.is_leader === true || a.is_leader === 'true' || a.isLeader === true;

  return {
    id: String(a.id || `alumni_${Date.now()}`),
    name: a.name || 'Alumnus',
    company: a.company || 'Tech Company',
    role,
    current_role: role,
    currentRole: role,
    batch: String(a.batch || '2024'),
    isLeader,
    is_leader: isLeader,
    leadershipRole: a.leadership_role || a.leadershipRole || '',
    leadership_role: a.leadership_role || a.leadershipRole || '',
    location: a.location || 'India',
    country: a.country || 'India',
    skills: a.skills || '',
    linkedinUrl: linkedin,
    linkedin_url: linkedin,
    githubUrl: github,
    github_url: github,
    portfolioUrl: portfolio,
    portfolio_url: portfolio,
    imageUrl: img,
    image_url: img,
    profileImage: img,
    profile_image: img,
    bio: a.bio || '',
    isActive: a.is_active !== false,
    is_active: a.is_active !== false,
    displayOrder: Number(a.display_order || a.displayOrder || 0),
    display_order: Number(a.display_order || a.displayOrder || 0),
    createdAt: a.created_at || a.createdAt || new Date().toISOString()
  };
};

export const getAlumni = async () => {
  const local = storage.get(STORAGE_KEYS.ALUMNI, []);

  // 1. Try Backend REST API first
  try {
    const res = await fetch(`${getBaseUrl()}/api/alumni?_t=${Date.now()}`);
    if (res.ok) {
      const json = await res.json();
      const list = json?.data || json?.alumni || (Array.isArray(json) ? json : null);
      if (Array.isArray(list) && list.length > 0) {
        const mapped = list.map(normalizeAlumnus).filter(Boolean);
        storage.set(STORAGE_KEYS.ALUMNI, mapped, true);
        return mapped;
      }
    }
  } catch (err) {
    // REST API offline or 404 on deployed SPA
  }

  // 2. Direct Cloud Neon Database fallback
  try {
    const cloud = await query('SELECT * FROM alumni WHERE is_active IS NOT FALSE ORDER BY display_order ASC, batch DESC, name ASC');
    if (cloud && cloud.length > 0) {
      const mapped = cloud.map(normalizeAlumnus).filter(Boolean);
      storage.set(STORAGE_KEYS.ALUMNI, mapped, true);
      return mapped;
    }
  } catch (err) {
    console.warn('[AlumniStore] Cloud fetch fallback:', err.message);
  }

  return Array.isArray(local) ? local.map(normalizeAlumnus).filter(Boolean) : [];
};

export const addAlumnus = async (alumnus) => {
  const id = alumnus.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `alumni_${Date.now()}`);
  const newAlumnus = normalizeAlumnus({
    ...alumnus,
    id,
    createdAt: new Date().toISOString()
  });

  const current = storage.get(STORAGE_KEYS.ALUMNI, []);
  storage.set(STORAGE_KEYS.ALUMNI, [newAlumnus, ...current]);

  // 1. Try API
  try {
    const res = await fetch(`${getBaseUrl()}/api/alumni`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAlumnus)
    });
    if (res.ok) return newAlumnus;
  } catch (err) {
    // Fallback to direct DB
  }

  // 2. Direct Cloud Neon Database
  try {
    await query(`
      INSERT INTO alumni (
        id, name, company, "current_role", batch, linkedin_url, profile_image, created_at, is_active, display_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      id,
      newAlumnus.name,
      newAlumnus.company,
      newAlumnus.role,
      newAlumnus.batch,
      newAlumnus.linkedinUrl,
      newAlumnus.imageUrl,
      newAlumnus.createdAt,
      true,
      newAlumnus.displayOrder || 0
    ]);
  } catch (err) {
    console.warn('[AlumniStore] Cloud add fallback:', err.message);
  }

  return newAlumnus;
};

export const updateAlumnus = async (alumnus) => {
  const current = storage.get(STORAGE_KEYS.ALUMNI, []);
  const updated = current.map(item => item.id === alumnus.id ? normalizeAlumnus({ ...item, ...alumnus }) : item);
  storage.set(STORAGE_KEYS.ALUMNI, updated);

  // 1. Try API
  try {
    const res = await fetch(`${getBaseUrl()}/api/alumni/${alumnus.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alumnus)
    });
    if (res.ok) return;
  } catch (err) {
    // Fallback to direct DB
  }

  // 2. Direct Cloud Neon Database
  try {
    await query(`
      UPDATE alumni
      SET name = $1, company = $2, "current_role" = $3, batch = $4, linkedin_url = $5, profile_image = $6
      WHERE id = $7
    `, [
      alumnus.name,
      alumnus.company,
      alumnus.role || alumnus.current_role,
      alumnus.batch,
      alumnus.linkedinUrl || alumnus.linkedin_url || '',
      alumnus.imageUrl || alumnus.image_url || alumnus.profile_image || '',
      alumnus.id
    ]);
  } catch (err) {
    console.warn('[AlumniStore] Cloud update fallback:', err.message);
  }
};

export const deleteAlumnus = async (id) => {
  const current = storage.get(STORAGE_KEYS.ALUMNI, []);
  storage.set(STORAGE_KEYS.ALUMNI, current.filter(a => a.id !== id));

  // 1. Try API
  try {
    const res = await fetch(`${getBaseUrl()}/api/alumni/${id}`, { method: 'DELETE' });
    if (res.ok) return;
  } catch (err) {
    // Fallback to direct DB
  }

  // 2. Direct Cloud Neon Database
  try {
    await query('DELETE FROM alumni WHERE id = $1', [id]);
  } catch (err) {
    console.warn('[AlumniStore] Cloud delete fallback:', err.message);
  }
};
