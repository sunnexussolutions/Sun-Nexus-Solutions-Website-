import { query } from '../lib/neon';
import { storage } from './storage/storageAdapter';
import { STORAGE_KEYS } from './storage/storageKeys';

export const getAlumni = async () => {
  const local = storage.get(STORAGE_KEYS.ALUMNI, []);
  try {
    const cloud = await query('SELECT * FROM alumni ORDER BY created_at DESC');
    if (cloud && cloud.length > 0) {
      storage.set(STORAGE_KEYS.ALUMNI, cloud, true);
      return cloud;
    }
  } catch (err) {
    console.warn('[AlumniStore] Cloud fetch fallback:', err.message);
  }
  return local;
};

export const addAlumnus = async (alumnus) => {
  const id = alumnus.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `alumni_${Date.now()}`);
  const newAlumnus = {
    ...alumnus,
    id,
    createdAt: new Date().toISOString()
  };

  const current = storage.get(STORAGE_KEYS.ALUMNI, []);
  storage.set(STORAGE_KEYS.ALUMNI, [newAlumnus, ...current]);

  try {
    await query(`
      INSERT INTO alumni (id, name, company, role, batch, linkedin_url, image_url, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      id,
      newAlumnus.name,
      newAlumnus.company,
      newAlumnus.role,
      newAlumnus.batch,
      newAlumnus.linkedinUrl || newAlumnus.linkedin_url || '',
      newAlumnus.imageUrl || newAlumnus.image_url || '',
      newAlumnus.createdAt
    ]);
  } catch (err) {
    console.warn('[AlumniStore] Cloud add fallback:', err.message);
  }

  return newAlumnus;
};

export const updateAlumnus = async (alumnus) => {
  const current = storage.get(STORAGE_KEYS.ALUMNI, []);
  const updated = current.map(item => item.id === alumnus.id ? { ...item, ...alumnus } : item);
  storage.set(STORAGE_KEYS.ALUMNI, updated);

  try {
    await query(`
      UPDATE alumni
      SET name = $1, company = $2, role = $3, batch = $4, linkedin_url = $5, image_url = $6
      WHERE id = $7
    `, [
      alumnus.name,
      alumnus.company,
      alumnus.role,
      alumnus.batch,
      alumnus.linkedinUrl || alumnus.linkedin_url || '',
      alumnus.imageUrl || alumnus.image_url || '',
      alumnus.id
    ]);
  } catch (err) {
    console.warn('[AlumniStore] Cloud update fallback:', err.message);
  }
};

export const deleteAlumnus = async (id) => {
  const current = storage.get(STORAGE_KEYS.ALUMNI, []);
  storage.set(STORAGE_KEYS.ALUMNI, current.filter(a => a.id !== id));

  try {
    await query('DELETE FROM alumni WHERE id = $1', [id]);
  } catch (err) {
    console.warn('[AlumniStore] Cloud delete fallback:', err.message);
  }
};
