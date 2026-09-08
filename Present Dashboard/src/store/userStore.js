import { query } from '../lib/neon';
import { storage } from './storage/storageAdapter';
import { STORAGE_KEYS } from './storage/storageKeys';

export const isUserAdmin = (u) => {
  if (!u) return false;
  if (u.isAdmin === true || u.is_admin === true) return true;
  const role = String(u.role || u.user_role || '').toLowerCase();
  if (role === 'admin' || role === 'administrator') return true;
  const email = String(u.email || '').toLowerCase();
  if (email === 'admin@nexus.com' || email === 'admin@sunnexus.824') return true;
  return false;
};

export const getUsers = async () => {
  try {
    const cloud = await query('SELECT * FROM profiles ORDER BY joined_at DESC');
    if (cloud) {
      const mapped = cloud.map(u => ({
        ...u,
        name: u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username,
        firstName: u.first_name,
        lastName: u.last_name,
        isAdmin: u.is_admin,
        joinedAt: u.joined_at
      }));
      storage.set(STORAGE_KEYS.USERS, mapped, true);
      return mapped;
    }
  } catch (err) {
    console.warn('[UserStore] Using local users fallback:', err.message);
  }
  return storage.get(STORAGE_KEYS.USERS, []);
};

export const deleteUser = async (id) => {
  const current = storage.get(STORAGE_KEYS.USERS, []);
  storage.set(STORAGE_KEYS.USERS, current.filter(u => u.id !== id));
  try {
    await query('DELETE FROM profiles WHERE id = $1', [id]);
  } catch (err) {
    console.warn('[UserStore] Cloud delete user fallback:', err.message);
  }
};

export const updateUserStatus = async (id, status) => {
  const current = storage.get(STORAGE_KEYS.USERS, []);
  storage.set(STORAGE_KEYS.USERS, current.map(u => u.id === id ? { ...u, status } : u));

  // Update active session if the modified user is currently logged in
  try {
    const session = storage.get(STORAGE_KEYS.SESSION);
    if (session && session.id === id) {
      storage.set(STORAGE_KEYS.SESSION, { ...session, status });
    }
  } catch {}

  try {
    await query('UPDATE profiles SET status = $1 WHERE id = $2', [status, id]);
  } catch (err) {
    console.warn('[UserStore] Cloud user status update fallback:', err.message);
  }
};
