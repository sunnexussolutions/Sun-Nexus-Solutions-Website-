/**
 * System Data Storage Abstraction
 * Currently uses LocalStorage, designed to scale to IndexedDB/API.
 */

const STORAGE_KEYS = {
  USERS: 'nexus-users-db',
  SESSION: 'nexus-session',
  NOTIFICATIONS: 'nexus-notifications',
  RESULTS: 'nexus-results'
};

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(STORAGE_KEYS[key] || key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error(`Storage Retrieval Error [${key}]:`, e);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(STORAGE_KEYS[key] || key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Storage Persistence Error [${key}]:`, e);
      return false;
    }
  },

  remove: (key) => {
    localStorage.removeItem(STORAGE_KEYS[key] || key);
  },

  // Future IndexedDB Migration Hook
  migrateToIndexedDB: async () => {
    console.warn("Storage Migration Required: Targeted for Sector Stable-v2");
  }
};
