import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * Pure helper for computing analytics metrics from raw assessment results
 */
function computeUserAnalytics(results) {
  if (!results || results.length === 0) {
    return {
      totalAssessments: 0,
      averageScore: 0,
      highestScore: 0,
      totalQuestionsAnswered: 0,
      accuracyRate: 0,
      categoryPerformance: {}
    };
  }

  let totalPct = 0;
  let highest = 0;
  let totalAttempted = 0;
  let totalCorrect = 0;
  const categories = {};

  results.forEach(r => {
    const score = Number(r.percentage || r.score || 0);
    totalPct += score;
    if (score > highest) highest = score;

    const attempted = Number(r.attempted || 0);
    const correct = Number(r.correct || 0);
    totalAttempted += attempted;
    totalCorrect += correct;

    const cat = r.category || 'General';
    if (!categories[cat]) {
      categories[cat] = { count: 0, sumScore: 0 };
    }
    categories[cat].count += 1;
    categories[cat].sumScore += score;
  });

  const categoryPerformance = {};
  for (const [cat, data] of Object.entries(categories)) {
    categoryPerformance[cat] = Math.round(data.sumScore / data.count);
  }

  return {
    totalAssessments: results.length,
    averageScore: Math.round(totalPct / results.length),
    highestScore: highest,
    totalQuestionsAnswered: totalAttempted,
    accuracyRate: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0,
    categoryPerformance
  };
}

test('Analytics - Empty results returns baseline zero stats', () => {
  const stats = computeUserAnalytics([]);
  assert.equal(stats.totalAssessments, 0);
  assert.equal(stats.averageScore, 0);
  assert.equal(stats.highestScore, 0);
  assert.equal(stats.accuracyRate, 0);
  assert.deepEqual(stats.categoryPerformance, {});
});

test('Analytics - Aggregate multiple assessment results', () => {
  const mockResults = [
    { category: 'Quantitative', percentage: 80, attempted: 10, correct: 8 },
    { category: 'Quantitative', percentage: 90, attempted: 10, correct: 9 },
    { category: 'Verbal', percentage: 70, attempted: 10, correct: 7 }
  ];

  const stats = computeUserAnalytics(mockResults);
  assert.equal(stats.totalAssessments, 3);
  assert.equal(stats.averageScore, 80); // (80 + 90 + 70) / 3 = 80
  assert.equal(stats.highestScore, 90);
  assert.equal(stats.totalQuestionsAnswered, 30);
  assert.equal(stats.accuracyRate, 80); // 24 / 30 = 80%

  assert.equal(stats.categoryPerformance['Quantitative'], 85);
  assert.equal(stats.categoryPerformance['Verbal'], 70);
});
