import { query } from '../lib/neon';
import { storage } from './storage/storageAdapter';
import { STORAGE_KEYS } from './storage/storageKeys';
import { getYearWeek, getWeekDiff } from '../utils/dateUtils';

export const getResults = async (userId = null) => {
  const local = storage.get(STORAGE_KEYS.RESULTS, []);
  try {
    const sql = userId
      ? 'SELECT * FROM results WHERE user_id = $1 ORDER BY submitted_at DESC'
      : 'SELECT * FROM results ORDER BY submitted_at DESC';
    const params = userId ? [userId] : [];
    const cloud = await query(sql, params);
    if (cloud) {
      const mapped = cloud.map(r => ({
        ...r,
        userId: r.user_id || r.userId || r.user_email || r.userEmail,
        userEmail: r.user_email || r.userEmail,
        assessmentId: r.assessment_id || r.assessmentId,
        submittedAt: r.submitted_at || r.submittedAt,
        proctorVideo: r.proctor_video || r.proctorVideo || null,
        answers: typeof r.answers === 'string' ? JSON.parse(r.answers) : (r.answers || {})
      }));

      const mergedMap = new Map();
      mapped.forEach(item => {
        const key = item.id || `${item.assessmentId || item.topic}_${item.userId || item.userEmail}`;
        mergedMap.set(key, item);
      });
      local.forEach(item => {
        const key = item.id || `${item.assessmentId || item.topic}_${item.userId || item.userEmail}`;
        if (!mergedMap.has(key)) {
          mergedMap.set(key, item);
        }
      });

      const merged = Array.from(mergedMap.values());
      storage.set(STORAGE_KEYS.RESULTS, merged, true);
      return merged;
    }
  } catch (err) {
    console.warn('[ResultStore] Using local results fallback:', err.message);
  }
  return local;
};

export const saveResult = async (res) => {
  const id = res.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `res_${Date.now()}`);
  const newRes = {
    ...res,
    id,
    submittedAt: res.submittedAt || new Date().toISOString()
  };

  const currentResults = storage.get(STORAGE_KEYS.RESULTS, []);
  storage.set(STORAGE_KEYS.RESULTS, [...currentResults, newRes]);

  try {
    await query(`
      INSERT INTO results (id, user_id, assessment_id, topic, score, total, percentage, category, user_name, user_email, answers, proctor_video)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [
      id,
      res.userId || res.user_id,
      res.assessmentId || res.assessment_id,
      res.topic,
      res.score,
      res.total,
      res.percentage,
      res.category,
      res.userName || 'Anonymous',
      res.userEmail,
      JSON.stringify(res.answers || {}),
      res.proctorVideo || null
    ]);
  } catch (err) {
    console.warn('[ResultStore] Cloud save result fallback:', err.message);
  }

  // Weekly streak update
  try {
    const rawUser = storage.get(STORAGE_KEYS.SESSION);
    if (rawUser) {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const currentWeek = getYearWeek(now);
      const lastActiveWeek = rawUser.lastActiveWeek || rawUser.last_active_week || (rawUser.lastActiveDate ? getYearWeek(new Date(rawUser.lastActiveDate)) : null);

      let currentStreak = Number(rawUser.streak) || 0;
      let newStreak = currentStreak;

      if (!lastActiveWeek) {
        newStreak = 1;
      } else {
        const diff = getWeekDiff(lastActiveWeek, currentWeek);
        if (diff === 0) {
          newStreak = currentStreak > 0 ? currentStreak : 1;
        } else if (diff === 1) {
          newStreak = (currentStreak > 0 ? currentStreak : 0) + 1;
        } else if (diff > 1) {
          const missedWeeks = diff - 1;
          const streakAfterLoss = Math.max(0, currentStreak - missedWeeks);
          newStreak = streakAfterLoss + 1;
        }
      }

      const updatedUser = {
        ...rawUser,
        streak: newStreak,
        lastActiveDate: todayStr,
        last_active_date: todayStr,
        lastActiveWeek: currentWeek,
        last_active_week: currentWeek
      };

      storage.set(STORAGE_KEYS.SESSION, updatedUser);

      // Update in local users array
      const localUsers = storage.get(STORAGE_KEYS.USERS, []);
      const updatedLocalUsers = localUsers.map(usr =>
        (usr.id === rawUser.id || usr.email === rawUser.email)
          ? { ...usr, streak: newStreak, lastActiveDate: todayStr, lastActiveWeek: currentWeek }
          : usr
      );
      storage.set(STORAGE_KEYS.USERS, updatedLocalUsers, true);

      // Cloud profile streak update
      if (rawUser.id || rawUser.email) {
        query(`
          UPDATE profiles 
          SET streak = $1, last_active_date = $2, last_active_week = $3
          WHERE id = $4 OR LOWER(email) = $5
        `, [newStreak, todayStr, currentWeek, rawUser.id || '', (rawUser.email || '').toLowerCase()]).catch(e => console.warn('[ResultStore] Cloud streak sync fallback:', e.message));
      }
    }
  } catch (err) {
    console.warn('[ResultStore] Streak calculation warning:', err.message);
  }

  return newRes;
};

export const deleteResult = async (id, assessmentId, topic, userId, userEmail) => {
  const normId = String(id || '').toLowerCase().trim();
  const targetAssId = String(assessmentId || '').toLowerCase().trim();
  const targetTopic = String(topic || '').toLowerCase().trim();
  const uId = String(userId || '').toLowerCase().trim();
  const uEmail = String(userEmail || '').toLowerCase().trim();

  const currentLocal = storage.get(STORAGE_KEYS.RESULTS, []);
  const updatedLocal = currentLocal.filter(r => {
    const rId = String(r.id || '').toLowerCase().trim();
    if (normId && rId && rId === normId) return false;

    const rAssId = String(r.assessmentId || r.assessment_id || '').toLowerCase().trim();
    const rTopic = String(r.topic || r.topicName || '').toLowerCase().trim();
    const rUid = String(r.userId || r.user_id || '').toLowerCase().trim();
    const rEmail = String(r.userEmail || r.user_email || '').toLowerCase().trim();

    const matchTopic = (targetAssId && rAssId === targetAssId) || (targetTopic && rTopic === targetTopic);
    const matchUser = (uId && rUid && uId === rUid) || (uEmail && rEmail && uEmail === rEmail);

    if (matchTopic && matchUser) return false;
    return true;
  });

  storage.set(STORAGE_KEYS.RESULTS, updatedLocal);

  try {
    await query('DELETE FROM results WHERE id = $1 OR (assessment_id = $2 AND (user_id = $3 OR user_email = $4))', [id, assessmentId || id, userId || '', userEmail || '']);
  } catch (err) {
    console.warn('[ResultStore] Cloud delete result fallback:', err.message);
  }
};
