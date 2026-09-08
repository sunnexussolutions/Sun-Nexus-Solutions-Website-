import { query } from '../lib/neon';
import { storage } from './storage/storageAdapter';
import { STORAGE_KEYS } from './storage/storageKeys';

export const getNotifications = async (userId = null) => {
  const local = storage.get(STORAGE_KEYS.NOTIFICATIONS, []);
  try {
    const sql = userId
      ? 'SELECT * FROM notifications WHERE user_id = $1 OR user_id IS NULL ORDER BY created_at DESC'
      : 'SELECT * FROM notifications ORDER BY created_at DESC';
    const params = userId ? [userId] : [];
    const cloud = await query(sql, params);
    if (cloud && cloud.length > 0) {
      storage.set(STORAGE_KEYS.NOTIFICATIONS, cloud, true);
      return cloud;
    }
  } catch (err) {
    console.warn('[NotificationStore] Cloud fetch fallback:', err.message);
  }
  return local;
};

export const addNotification = async (notif) => {
  const id = notif.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `notif_${Date.now()}`);
  const newNotif = {
    ...notif,
    id,
    read: false,
    createdAt: new Date().toISOString()
  };

  const current = storage.get(STORAGE_KEYS.NOTIFICATIONS, []);
  storage.set(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...current]);

  try {
    await query(`
      INSERT INTO notifications (id, user_id, title, message, type, read, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      id,
      newNotif.userId || null,
      newNotif.title,
      newNotif.message || newNotif.body,
      newNotif.type || 'info',
      false,
      newNotif.createdAt
    ]);
  } catch (err) {
    console.warn('[NotificationStore] Cloud add fallback:', err.message);
  }

  return newNotif;
};

export const deleteNotification = async (id) => {
  const current = storage.get(STORAGE_KEYS.NOTIFICATIONS, []);
  storage.set(STORAGE_KEYS.NOTIFICATIONS, current.filter(n => n.id !== id));

  try {
    await query('DELETE FROM notifications WHERE id = $1', [id]);
  } catch (err) {
    console.warn('[NotificationStore] Cloud delete fallback:', err.message);
  }
};

export const markNotificationRead = async (id) => {
  const current = storage.get(STORAGE_KEYS.NOTIFICATIONS, []);
  storage.set(STORAGE_KEYS.NOTIFICATIONS, current.map(n => n.id === id ? { ...n, read: true } : n));

  try {
    await query('UPDATE notifications SET read = true WHERE id = $1', [id]);
  } catch (err) {
    console.warn('[NotificationStore] Cloud mark read fallback:', err.message);
  }
};
