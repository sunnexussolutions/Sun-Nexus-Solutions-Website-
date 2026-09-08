import test from 'node:test';
import assert from 'node:assert/strict';
import { getYearWeek, getWeekDiff, processUserStreak, formatDurationMMSS } from '../Present Dashboard/src/utils/dateUtils.js';

test('Date Utils - ISO Year-Week Generation', () => {
  const sampleDate = new Date('2026-09-08T12:00:00Z');
  const yearWeek = getYearWeek(sampleDate);
  assert.match(yearWeek, /^2026-W\d{2}$/);
});

test('Date Utils - Week Difference Calculation', () => {
  const w1 = '2026-W30';
  const w2 = '2026-W33';
  const diff = getWeekDiff(w1, w2);
  assert.equal(diff, 3);

  const sameDiff = getWeekDiff('2026-W30', '2026-W30');
  assert.equal(sameDiff, 0);
});

test('Streak Processing - Consecutive Week Activity Increases Streak', () => {
  const currentWeek = getYearWeek(new Date());
  const user = {
    streak: 3,
    lastActiveWeek: currentWeek,
    status: 'active'
  };

  const { newStreak } = processUserStreak(user);
  assert.equal(newStreak, 3);
});

test('Duration Formatter - MM:SS Output', () => {
  assert.equal(formatDurationMMSS(125), '02:05');
  assert.equal(formatDurationMMSS(0), '00:00');
  assert.equal(formatDurationMMSS(3600), '60:00');
});
