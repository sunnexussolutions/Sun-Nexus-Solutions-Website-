import { query } from '../lib/neon';

// Helper for local management
const getLocal = (key, fallback = []) => {
  const data = localStorage.getItem(`nexus_${key}`);
  return data ? JSON.parse(data) : fallback;
};

const setLocal = (key, data) => {
  localStorage.setItem(`nexus_${key}`, JSON.stringify(data));
  window.dispatchEvent(new Event('nexus-data-updated'));
};

// ── Assessments ───────────────────────────────────────────────────────────────
export const getAssessments = async () => {
  const local = getLocal('assessments');
  try {
    const cloud = await query('SELECT * FROM assessments ORDER BY created_at DESC');
    if (cloud) {
      const mapped = cloud.map(a => ({
        ...a,
        timeLimit: a.time_limit,
        videoUrl: a.video_url,
        unlockTime: a.unlock_time,
        createdAt: a.created_at
      }));
      setLocal('assessments', mapped);
      return mapped;
    }
  } catch (err) {
    console.warn("Using local assessments fallback");
  }
  return local;
};

export const addAssessment = async (a) => {
  const id = crypto.randomUUID();
  const newA = { ...a, id, created_at: new Date().toISOString() };
  
  // Optimistic Update
  setLocal('assessments', [...getLocal('assessments'), newA]);

  // Clean data for Neon
  const unlockTime = a.unlockTime && a.unlockTime.trim() !== "" ? a.unlockTime : null;
  const videoUrl = a.videoUrl && a.videoUrl.trim() !== "" ? a.videoUrl : null;

  await query(`
    INSERT INTO assessments (id, category, topic, week, time_limit, questions, video_url, unlock_time)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, [id, a.category, a.topic, a.week, a.timeLimit, JSON.stringify(a.questions), videoUrl, unlockTime]);
  
  return newA;
};

export const updateAssessment = async (a) => {
  setLocal('assessments', getLocal('assessments').map(item => item.id === a.id ? { ...item, ...a } : item));
  
  const unlockTime = a.unlockTime && a.unlockTime.trim() !== "" ? a.unlockTime : null;
  const videoUrl = a.videoUrl && a.videoUrl.trim() !== "" ? a.videoUrl : null;

  await query(`
    UPDATE assessments 
    SET category = $1, topic = $2, week = $3, time_limit = $4, questions = $5, video_url = $6, unlock_time = $7 
    WHERE id = $8
  `, [a.category, a.topic, a.week, a.timeLimit, JSON.stringify(a.questions), videoUrl, unlockTime, a.id]);
};

export const deleteAssessment = async (id) => {
  setLocal('assessments', getLocal('assessments').filter(a => a.id !== id));
  await query('DELETE FROM assessments WHERE id = $1', [id]);
};

// ── Results ───────────────────────────────────────────────────────────────────
export const getResults = async (userId) => {
  const local = getLocal('results');
  try {
    const sql = userId ? 'SELECT * FROM results WHERE user_id = $1' : 'SELECT * FROM results';
    const params = userId ? [userId] : [];
    
    const cloud = await query(sql, params);
    if (cloud) {
      const mapped = cloud.map(r => ({
        ...r,
        userId: r.user_id,
        assessmentId: r.assessment_id,
        submittedAt: r.submitted_at
      }));
      setLocal('results', mapped);
      return mapped;
    }
  } catch (err) {
    console.warn("Using local results fallback");
  }
  return local;
};

export const saveResult = async (res) => {
  const id = crypto.randomUUID();
  const newRes = { ...res, id, submittedAt: new Date().toISOString() };
  setLocal('results', [...getLocal('results'), newRes]);

  await query(`
    INSERT INTO results (id, user_id, assessment_id, topic, score, total, percentage, category)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, [id, res.userId, res.assessmentId, res.topic, res.score, res.total, res.percentage, res.category]);
  return newRes;
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const getUsers = async () => {
  try {
    const cloud = await query('SELECT * FROM profiles ORDER BY joined_at DESC');
    if (cloud) {
      const mapped = cloud.map(u => ({
        ...u,
        firstName: u.first_name,
        lastName: u.last_name,
        isAdmin: u.is_admin
      }));
      setLocal('users', mapped);
      return mapped;
    }
  } catch (err) {
    console.warn("Using local users fallback");
  }
  return getLocal('users');
};

export const deleteUser = async (id) => {
  setLocal('users', getLocal('users').filter(u => u.id !== id));
  await query('DELETE FROM profiles WHERE id = $1', [id]);
};

export const updateUserStatus = async (id, status) => {
  setLocal('users', getLocal('users').map(u => u.id === id ? { ...u, status } : u));
  await query('UPDATE profiles SET status = $1 WHERE id = $2', [status, id]);
};

export const getDomains = async () => {
  const local = getLocal('domains');
  try {
    const cloud = await query('SELECT * FROM domains ORDER BY created_at ASC');
    if (cloud) {
      const mapped = cloud.map(d => ({
        ...d,
        desc: d.description,
        subDomains: d.sub_domains,
        createdAt: d.created_at
      }));
      setLocal('domains', mapped);
      return mapped;
    }
  } catch (err) {
    console.warn("Using local domains fallback");
  }
  return local;
};

export const addDomain = async (d) => {
  if (!d.title.trim()) return alert("Domain Title is required.");
  if (!d.desc.trim()) return alert("Domain Description is required.");
  const id = crypto.randomUUID();
  const newD = { ...d, id, created_at: new Date().toISOString() };
  setLocal('domains', [...getLocal('domains'), newD]);

  await query(`
    INSERT INTO domains (id, title, icon, color, description, stats, trending, sub_domains, topics)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `, [id, d.title, d.icon, d.color, d.desc, d.stats, d.trending, JSON.stringify(d.subDomains || []), JSON.stringify(d.topics || [])]);
  
  return newD;
};

export const updateDomain = async (d) => {
  setLocal('domains', getLocal('domains').map(item => item.id === d.id ? { ...item, ...d } : item));
  
  await query(`
    UPDATE domains 
    SET title = $1, icon = $2, color = $3, description = $4, stats = $5, trending = $6, sub_domains = $7, topics = $8 
    WHERE id = $9
  `, [d.title, d.icon, d.color, d.desc, d.stats, d.trending, JSON.stringify(d.subDomains || []), JSON.stringify(d.topics || []), d.id]);
};

export const deleteDomain = async (id) => {
  setLocal('domains', getLocal('domains').filter(d => d.id !== id));
  await query('DELETE FROM domains WHERE id = $1', [id]);
};

// ── Notifications ──────────────────────────────────────────────────────────────
export const getNotifications = async (userId) => {
  const local = getLocal('notifications');
  try {
    // Fetch both personal AND global broadcasts
    const sql = userId 
      ? 'SELECT * FROM notifications WHERE user_id = $1 OR user_id IS NULL ORDER BY created_at DESC'
      : 'SELECT * FROM notifications WHERE user_id IS NULL ORDER BY created_at DESC';
    const params = userId ? [userId] : [];
    
    const cloud = await query(sql, params);
    if (cloud) {
      setLocal('notifications', cloud);
      return cloud;
    }
  } catch (err) {
    console.warn("Using local notifications fallback");
  }
  return local;
};

export const addNotification = async (n) => {
  const id = crypto.randomUUID();
  const newN = { ...n, id, created_at: new Date().toISOString() };
  setLocal('notifications', [...getLocal('notifications'), newN]);
  
  await query(`
    INSERT INTO notifications (id, user_id, title, message, type)
    VALUES ($1, $2, $3, $4, $5)
  `, [id, n.user_id || null, n.title, n.message, n.type]);
  return newN;
};

export const markNotificationRead = async (id) => {
  setLocal('notifications', getLocal('notifications').map(n => n.id === id ? { ...n, read: true } : n));
  await query('UPDATE notifications SET read = TRUE WHERE id = $1', [id]);
};

export const deleteNotification = async (id) => {
  setLocal('notifications', getLocal('notifications').filter(n => n.id !== id));
  await query('DELETE FROM notifications WHERE id = $1', [id]);
};

// ── Discussions ────────────────────────────────────────────────────────────────
export const getDiscussions = async () => getLocal('discussions');
export const addDiscussion = async (d) => {
  const newD = { ...d, id: crypto.randomUUID(), created_at: new Date().toISOString() };
  setLocal('discussions', [...getLocal('discussions'), newD]);
  return newD;
};
export const deleteDiscussion = async (id) => {
  setLocal('discussions', getLocal('discussions').filter(d => d.id !== id));
};
