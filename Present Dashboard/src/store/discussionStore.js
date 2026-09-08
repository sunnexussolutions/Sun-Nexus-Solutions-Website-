import { query } from '../lib/neon';
import { storage } from './storage/storageAdapter';
import { STORAGE_KEYS } from './storage/storageKeys';

export const getDiscussions = async () => {
  const local = storage.get(STORAGE_KEYS.DISCUSSIONS, []);
  try {
    const cloud = await query('SELECT * FROM discussions ORDER BY created_at DESC');
    if (cloud && cloud.length > 0) {
      storage.set(STORAGE_KEYS.DISCUSSIONS, cloud, true);
      return cloud;
    }
  } catch (err) {
    console.warn('[DiscussionStore] Cloud fetch fallback:', err.message);
  }
  return local;
};

export const addDiscussion = async (post) => {
  const id = post.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `disc_${Date.now()}`);
  const newPost = {
    ...post,
    id,
    createdAt: new Date().toISOString()
  };

  const current = storage.get(STORAGE_KEYS.DISCUSSIONS, []);
  storage.set(STORAGE_KEYS.DISCUSSIONS, [newPost, ...current]);

  try {
    await query(`
      INSERT INTO discussions (id, title, body, author, author_id, tag, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      id,
      newPost.title,
      newPost.body || newPost.content,
      newPost.author || 'Nexus Member',
      newPost.authorId || null,
      newPost.tag || 'General',
      newPost.createdAt
    ]);
  } catch (err) {
    console.warn('[DiscussionStore] Cloud add fallback:', err.message);
  }

  return newPost;
};

export const deleteDiscussion = async (id) => {
  const current = storage.get(STORAGE_KEYS.DISCUSSIONS, []);
  storage.set(STORAGE_KEYS.DISCUSSIONS, current.filter(d => d.id !== id));

  try {
    await query('DELETE FROM discussions WHERE id = $1', [id]);
  } catch (err) {
    console.warn('[DiscussionStore] Cloud delete fallback:', err.message);
  }
};
