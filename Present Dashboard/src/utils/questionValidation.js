/**
 * ── Question & Assessment Validation Utilities ──────────────────────
 * Factory and validation rules for questions across Aptitude, DSA, and Mock Tests.
 */

/**
 * Creates a blank multiple-choice question object.
 * @returns {Object}
 */
export const emptyQuestion = () => ({
  id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `q_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
  question: '',
  options: ['', '', '', ''],
  answer: 0,
  explanation: ''
});

/**
 * Validates a single question.
 * @param {Object} q
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateQuestion = (q) => {
  const errors = {};
  const text = (q.question || q.text || '').trim();
  if (!text) {
    errors.question = 'Question text is required.';
  }

  const options = q.options || [];
  if (options.length < 2) {
    errors.options = 'At least 2 options are required.';
  } else {
    const emptyOptions = options.some(opt => !(opt || '').trim());
    if (emptyOptions) {
      errors.options = 'All option choices must have text.';
    }
  }

  if (q.answer === undefined || q.answer === null || q.answer < 0 || q.answer >= options.length) {
    errors.answer = 'A valid correct answer option must be selected.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates an entire assessment form and its question list.
 * @param {Object} form
 * @param {Array<Object>} questions
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateAssessmentForm = (form, questions = []) => {
  const errors = {};

  if (!form.topic || !form.topic.trim()) {
    errors.topic = 'Assessment topic is required.';
  }

  if (!form.category || !form.category.trim()) {
    errors.category = 'Assessment category is required.';
  }

  if (!form.week || !form.week.trim()) {
    errors.week = 'Week assignment is required.';
  }

  if (!form.timeLimit || Number(form.timeLimit) <= 0) {
    errors.timeLimit = 'Time limit must be at least 1 minute.';
  }

  if (!questions || questions.length === 0) {
    errors.questions = 'At least 1 question is required in the assessment.';
  } else {
    const invalidQuestions = questions.some(q => !validateQuestion(q).isValid);
    if (invalidQuestions) {
      errors.questions = 'One or more questions have missing fields or unselected correct answers.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
