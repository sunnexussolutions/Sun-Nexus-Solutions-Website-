/**
 * ── Nexus Hub Date & Streak Utilities ────────────────────────────────
 * Pure functions for ISO Year-Week calculations, streak processing,
 * and date difference arithmetic without React Context coupling.
 */

/**
 * Calculates ISO Year-Week string (e.g. "2026-W36")
 * @param {Date} [d=new Date()]
 * @returns {string} ISO Year-Week string
 */
export const getYearWeek = (d = new Date()) => {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

/**
 * Calculates week difference between two Year-Week strings
 * @param {string} w1 - Earlier week (e.g. "2026-W30")
 * @param {string} w2 - Later week (e.g. "2026-W32")
 * @returns {number} Difference in weeks
 */
export const getWeekDiff = (w1, w2) => {
  if (!w1 || !w2) return 0;
  try {
    const [y1, wk1] = w1.split('-W').map(Number);
    const [y2, wk2] = w2.split('-W').map(Number);
    return ((y2 - y1) * 52) + (wk2 - wk1);
  } catch {
    return 0;
  }
};

/**
 * Evaluates weekly streak state and streak freeze usage for a user.
 * @param {Object} u - User profile object
 * @returns {{ updatedUser: Object, streakIncreased: boolean, freezeUsed: boolean, newStreak: number }}
 */
export const processUserStreak = (u) => {
  if (!u || u.status === 'pending') {
    return { updatedUser: u, streakIncreased: false, freezeUsed: false, newStreak: u?.streak || 0 };
  }

  const now = new Date();
  const currentWeekStr = getYearWeek(now);
  const lastActiveWeek = u.lastActiveWeek || u.last_active_week || (u.lastActiveDate ? getYearWeek(new Date(u.lastActiveDate)) : null);

  let currentStreak = Number(u.streak ?? 0);
  let streakFreezeActive = !!(u.streakFreezeActive || u.streak_freeze_active);
  let newStreak = currentStreak;
  let streakIncreased = false;
  let freezeUsed = false;

  if (!lastActiveWeek) {
    newStreak = currentStreak;
  } else {
    const diff = getWeekDiff(lastActiveWeek, currentWeekStr);
    if (diff === 0 || diff === 1) {
      newStreak = currentStreak;
    } else if (diff > 1) {
      const missedWeeks = diff - 1;
      if (streakFreezeActive && missedWeeks === 1) {
        freezeUsed = true;
        streakFreezeActive = false;
        newStreak = currentStreak;
      } else {
        newStreak = Math.max(0, currentStreak - missedWeeks);
      }
    }
  }

  const updatedUser = {
    ...u,
    streak: newStreak,
    streakFreezeActive,
    streak_freeze_active: streakFreezeActive,
    lastActiveDate: u.lastActiveDate || now.toISOString(),
    last_active_date: u.last_active_date || now.toISOString(),
    lastActiveWeek: currentWeekStr,
    last_active_week: currentWeekStr
  };

  return { updatedUser, streakIncreased, freezeUsed, newStreak };
};

/**
 * Formats a duration in seconds to MM:SS string
 * @param {number} seconds
 * @returns {string}
 */
export const formatDurationMMSS = (seconds) => {
  const s = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
