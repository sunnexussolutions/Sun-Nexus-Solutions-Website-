import { storage } from '../store/storage/storageAdapter';
import { STORAGE_KEYS } from '../store/storage/storageKeys';

const getApiBaseUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:3000';
  if (import.meta.env?.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:';
  return isLocal ? 'http://localhost:3000' : '';
};

const getHeaders = () => {
  const token = storage.get(STORAGE_KEYS.AUTH_TOKEN);
  const session = storage.get(STORAGE_KEYS.SESSION);

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (session) {
    headers['x-user-id'] = String(session.id || session.email || 'user_anon');
    headers['x-user-email'] = String(session.email || '').toLowerCase();
    headers['x-user-role'] = session.isAdmin || session.is_admin ? 'admin' : 'member';
  }

  return headers;
};

/**
 * Standardized HTTP fetch wrapper.
 */
export const request = async (method, path, body = null) => {
  const url = `${getApiBaseUrl()}${path}`;
  const options = {
    method,
    headers: getHeaders()
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const errMsg = (typeof data === 'object' && (data.error || data.message)) || `HTTP ${res.status}: ${res.statusText}`;
      const err = new Error(errMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    if (err.status === 401) {
      console.warn('[API] Unauthorized 401 response on path:', path);
    }
    throw err;
  }
};

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  patch: (path, body) => request('PATCH', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: (path) => request('DELETE', path)
};

// ── Auth Service ─────────────────────────────────────────────────────────────
export const apiLogin = (username, password) => api.post('/api/login', { username, password });
export const apiRegister = (userData) => api.post('/api/auth/register', userData);
export const apiGetMe = () => api.get('/api/auth/me');

// ── Users Service ────────────────────────────────────────────────────────────
export const apiGetUsers = () => api.get('/api/users');
export const apiGetUser = (id) => api.get(`/api/users/${id}`);
export const apiUpdateUserStatus = (id, status) => api.patch(`/api/users/${id}/status`, { status });
export const apiDeleteUser = (id) => api.delete(`/api/users/${id}`);

// ── Assessments Service ──────────────────────────────────────────────────────
export const apiGetAssessments = () => api.get('/api/assessments');
export const apiAddAssessment = (data) => api.post('/api/assessments', data);
export const apiUpdateAssessment = (id, data) => api.patch(`/api/assessments/${id}`, data);
export const apiDeleteAssessment = (id) => api.delete(`/api/assessments/${id}`);

// ── Results Service ──────────────────────────────────────────────────────────
export const apiGetResults = () => api.get('/api/results');
export const apiGetMyResults = () => api.get('/api/results/me');
export const apiSaveResult = (data) => api.post('/api/results', data);
export const apiDeleteResult = (id) => api.delete(`/api/results/${id}`);

// ── Discussions Service ──────────────────────────────────────────────────────
export const apiGetDiscussions = () => api.get('/api/discussions');
export const apiAddDiscussion = (data) => api.post('/api/discussions', data);
export const apiDeleteDiscussion = (id) => api.delete(`/api/discussions/${id}`);

// ── Notifications Service ────────────────────────────────────────────────────
export const apiGetNotifications = () => api.get('/api/notifications');
export const apiMarkNotificationRead = (id) => api.patch(`/api/notifications/${id}/read`);
export const apiAddNotification = (data) => api.post('/api/notifications', data);
export const apiDeleteNotification = (id) => api.delete(`/api/notifications/${id}`);

export default api;
