import { query } from '../lib/neon';
import { storage } from './storage/storageAdapter';
import { STORAGE_KEYS } from './storage/storageKeys';

export const getProjectRequirements = async () => {
  const local = storage.get(STORAGE_KEYS.PROJECT_REQUIREMENTS, []);
  try {
    const cloud = await query('SELECT * FROM freelancing ORDER BY created_at DESC');
    if (cloud && cloud.length > 0) {
      storage.set(STORAGE_KEYS.PROJECT_REQUIREMENTS, cloud, true);
      return cloud;
    }
  } catch (err) {
    console.warn('[InquiryStore] Cloud fetch fallback:', err.message);
  }
  return local;
};

export const deleteProjectRequirement = async (id) => {
  const current = storage.get(STORAGE_KEYS.PROJECT_REQUIREMENTS, []);
  storage.set(STORAGE_KEYS.PROJECT_REQUIREMENTS, current.filter(r => r.id !== id));

  try {
    await query('DELETE FROM freelancing WHERE id = $1', [id]);
  } catch (err) {
    console.warn('[InquiryStore] Cloud delete fallback:', err.message);
  }
};

export const updateProjectRequirementStatus = async (id, status) => {
  const current = storage.get(STORAGE_KEYS.PROJECT_REQUIREMENTS, []);
  storage.set(STORAGE_KEYS.PROJECT_REQUIREMENTS, current.map(r => r.id === id ? { ...r, status } : r));

  try {
    await query('UPDATE freelancing SET status = $1 WHERE id = $2', [status, id]);
  } catch (err) {
    console.warn('[InquiryStore] Cloud status update fallback:', err.message);
  }
};
