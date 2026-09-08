import { STORAGE_KEYS } from './storageKeys.js';

/**
 * ── Storage Adapter ─────────────────────────────────────────────────
 * Centralized interface for browser localStorage with type-safety,
 * error boundary fallback, and reactive synchronization events.
 */
class StorageAdapter {
  /**
   * Retrieves and parses an item from localStorage.
   * @template T
   * @param {string} key - Key or STORAGE_KEYS constant
   * @param {T} [fallback=null] - Default value if key is not found or corrupt
   * @returns {T}
   */
  get(key, fallback = null) {
    if (typeof window === 'undefined') return fallback;
    try {
      const resolvedKey = STORAGE_KEYS[key] || key;
      const raw = localStorage.getItem(resolvedKey);
      if (raw === null || raw === undefined || raw === 'undefined' || raw === 'null') {
        return fallback;
      }
      return JSON.parse(raw);
    } catch (err) {
      console.warn(`[StorageAdapter] Failed to parse key "${key}":`, err.message);
      return fallback;
    }
  }

  /**
   * Serializes and writes an item to localStorage.
   * @param {string} key - Key or STORAGE_KEYS constant
   * @param {*} value - Value to persist
   * @param {boolean} [silent=false] - Suppress 'nexus-data-updated' event
   * @returns {boolean} Success status
   */
  set(key, value, silent = false) {
    if (typeof window === 'undefined') return false;
    try {
      const resolvedKey = STORAGE_KEYS[key] || key;
      localStorage.setItem(resolvedKey, JSON.stringify(value));
      if (!silent) {
        window.dispatchEvent(new CustomEvent('nexus-data-updated', { detail: { key: resolvedKey } }));
      }
      return true;
    } catch (err) {
      console.error(`[StorageAdapter] Failed to set key "${key}":`, err.message);
      return false;
    }
  }

  /**
   * Removes an item from localStorage.
   * @param {string} key - Key or STORAGE_KEYS constant
   * @param {boolean} [silent=false]
   */
  remove(key, silent = false) {
    if (typeof window === 'undefined') return;
    try {
      const resolvedKey = STORAGE_KEYS[key] || key;
      localStorage.removeItem(resolvedKey);
      if (!silent) {
        window.dispatchEvent(new CustomEvent('nexus-data-updated', { detail: { key: resolvedKey } }));
      }
    } catch (err) {
      console.warn(`[StorageAdapter] Failed to remove key "${key}":`, err.message);
    }
  }

  /**
   * Clears all Nexus-related items from storage.
   */
  clearAll() {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });
    window.dispatchEvent(new Event('nexus-data-updated'));
  }
}

export const storage = new StorageAdapter();
export default storage;
