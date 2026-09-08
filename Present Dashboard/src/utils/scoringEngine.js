/**
 * ── Generic Scoring Engine ──────────────────────────────────────────
 * Computes performance analytics, accuracy ratios, question breakdowns,
 * and scorecard statistics for Aptitude, DSA, Mock Tests, and Technical exams.
 */

/**
 * Evaluates an assessment attempt against question answers.
 * @param {Object} params
 * @param {Array<Object>} params.questions - List of assessment questions
 * @param {Object} params.answers - Key-value map of question index to selected option index
 * @param {number} [params.timeLimit=20] - Total time limit in minutes
 * @param {number} [params.timeLeft=0] - Remaining seconds on timer
 * @returns {Object} Scorecard analysis
 */
export const calculateAssessmentScore = ({
  questions = [],
  answers = {},
  timeLimit = 20,
  timeLeft = 0
}) => {
  const total = questions.length;
  let correct = 0;
  let incorrect = 0;
  let attempted = 0;

  const reviewList = questions.map((q, idx) => {
    const userAnswer = answers[idx] !== undefined && answers[idx] !== null ? answers[idx] : null;
    const isAttempted = userAnswer !== null;
    if (isAttempted) attempted++;

    const isCorrect = isAttempted && Number(userAnswer) === Number(q.answer);
    if (isCorrect) correct++;
    else if (isAttempted) incorrect++;

    return {
      index: idx,
      questionId: q.id || idx + 1,
      questionText: q.question || q.text || '',
      options: q.options || [],
      userAnswer,
      correctAnswer: q.answer,
      isCorrect,
      isAttempted,
      explanation: q.explanation || ''
    };
  });

  const skipped = Math.max(0, total - attempted);
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const totalSeconds = (Number(timeLimit) || 20) * 60;
  const timeSpent = Math.max(0, totalSeconds - Math.max(0, Number(timeLeft) || 0));

  let statusBadge = 'Needs Practice';
  let gradeColor = '#EF4444';
  if (percentage >= 80) {
    statusBadge = 'Outstanding';
    gradeColor = '#10B981';
  } else if (percentage >= 60) {
    statusBadge = 'Proficient';
    gradeColor = '#2872A1';
  } else if (percentage >= 40) {
    statusBadge = 'Average';
    gradeColor = '#F59E0B';
  }

  return {
    total,
    attempted,
    correct,
    incorrect,
    skipped,
    score: correct,
    percentage,
    accuracy,
    timeSpent,
    timeSpentFormatted: `${Math.floor(timeSpent / 60)}m ${timeSpent % 60}s`,
    statusBadge,
    gradeColor,
    reviewList,
    answers
  };
};
