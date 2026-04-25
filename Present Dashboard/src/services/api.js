// Central API service — replaces localStorage dataStore
// All calls go to the Express server which talks to MySQL on Hostinger

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getToken = () => localStorage.getItem('nexus-token');

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const req = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const apiLogin    = (email, password)        => req('POST', '/api/auth/login',    { email, password });
export const apiRegister = (name, email, password)  => req('POST', '/api/auth/register', { name, email, password });
export const apiGetMe    = ()                        => req('GET',  '/api/auth/me');

// ── Users ─────────────────────────────────────────────────────────────────────
export const apiGetUsers = ()    => req('GET', '/api/users');
export const apiGetUser  = (id)  => req('GET', `/api/users/${id}`);

// ── Assessments ───────────────────────────────────────────────────────────────
export const apiGetAssessments   = ()     => req('GET',    '/api/assessments');
export const apiAddAssessment    = (data) => req('POST',   '/api/assessments', data);
export const apiDeleteAssessment = (id)   => req('DELETE', `/api/assessments/${id}`);

// ── Results ───────────────────────────────────────────────────────────────────
export const apiGetResults   = ()     => req('GET',  '/api/results');
export const apiGetMyResults = ()     => req('GET',  '/api/results/me');
export const apiSaveResult   = (data) => req('POST', '/api/results', data);

// ── Discussions ───────────────────────────────────────────────────────────────
export const apiGetDiscussions   = ()     => req('GET',    '/api/discussions');
export const apiAddDiscussion    = (data) => req('POST',   '/api/discussions', data);
export const apiDeleteDiscussion = (id)   => req('DELETE', `/api/discussions/${id}`);

// ── Notifications ─────────────────────────────────────────────────────────────
export const apiGetNotifications     = ()     => req('GET',   '/api/notifications');
export const apiMarkNotificationRead = (id)   => req('PATCH', `/api/notifications/${id}/read`);
export const apiAddNotification      = (data) => req('POST',  '/api/notifications', data);
export const apiDeleteNotification   = (id)   => req('DELETE', `/api/notifications/${id}`);
