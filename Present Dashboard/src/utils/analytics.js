/**
 * Analytics utility for preparing data for Recharts.
 */

/**
 * Prepares data for an individual user's performance graph.
 * Returns the last 7 assessment attempts.
 */
export const prepareUserChartData = (userResults = []) => {
  if (!userResults || userResults.length === 0) return [];
  
  const points = [...userResults]
    .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))
    .slice(-7)
    .map(r => ({
      date: new Date(r.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
            new Date(r.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: Math.round(r.percentage || 0),
      fullDate: new Date(r.submittedAt).toLocaleString(),
      topic: r.topic
    }));

  // If only one point, add a zero base-line at a slightly earlier time to draw a line
  if (points.length === 1) {
    const firstPointDate = new Date(userResults[0].submittedAt);
    const baselineDate = new Date(firstPointDate.getTime() - 1000 * 60 * 60); // 1 hour earlier
    const baseline = {
      date: 'Origin',
      score: 0,
      fullDate: baselineDate.toLocaleString(),
      topic: 'Baseline'
    };
    return [baseline, ...points];
  }

  return points;
};

/**
 * Prepares collective platform data by averaging scores across topics.
 */
export const prepareCollectiveChartData = (allResults = [], activeAssessments = []) => {
  if (!activeAssessments || activeAssessments.length === 0) return [];

  const topicMap = {};

  // Initialize map with all active assessment topics to ensure they all appear
  activeAssessments.forEach(a => {
    if (!topicMap[a.topic]) {
      topicMap[a.topic] = { sum: 0, count: 0, topic: a.topic };
    }
  });

  // Aggregate results into the topics
  const activeIds = new Set(activeAssessments.map(a => a.id));
  allResults.forEach(res => {
    if (activeIds.has(res.assessmentId) && topicMap[res.topic]) {
      topicMap[res.topic].sum += (res.percentage || 0);
      topicMap[res.topic].count += 1;
    }
  });

  return Object.values(topicMap)
    .map(t => ({
      topic: t.topic,
      avg: t.count > 0 ? Math.round(t.sum / t.count) : 0
    }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 10);
};

/**
 * Calculates basic stats from results.
 */
export const calculateUserStats = (userResults = []) => {
  if (userResults.length === 0) return { avg: 0, best: 0, count: 0 };
  const scores = userResults.map(r => r.percentage || 0);
  return {
    avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    best: Math.round(Math.max(...scores)),
    count: scores.length
  };
};
