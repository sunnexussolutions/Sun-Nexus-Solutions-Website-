import { useState, useCallback } from 'react';
import { calculateAssessmentScore } from '../utils/scoringEngine';

/**
 * ── useAssessment ───────────────────────────────────────────────────
 * Generic Assessment State Machine managing active quiz questions,
 * selected answers, navigation, submission, scoring, and review phases.
 */
export const useAssessment = ({
  assessment,
  previousResult = null,
  onSubmit = null
}) => {
  const questions = assessment?.questions || [];
  const total = questions.length;

  const [phase, setPhase] = useState(previousResult ? 'result' : 'quiz'); // 'quiz' | 'result'
  const [resultTab, setResultTab] = useState(previousResult ? 'review' : 'summary'); // 'summary' | 'review'
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(previousResult?.answers || {});
  const [selected, setSelected] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(!!previousResult);
  const [scoreData, setScoreData] = useState(() => {
    if (previousResult) {
      return calculateAssessmentScore({
        questions,
        answers: previousResult.answers || {},
        timeLimit: assessment?.timeLimit || 20,
        timeLeft: 0
      });
    }
    return null;
  });

  const selectOption = useCallback((optIdx) => {
    if (isSubmitted) return;
    setSelected(optIdx);
    setAnswers(prev => ({ ...prev, [current]: optIdx }));
  }, [current, isSubmitted]);

  const jumpToQuestion = useCallback((idx) => {
    if (idx >= 0 && idx < total) {
      setCurrent(idx);
      setSelected(answers[idx] !== undefined ? answers[idx] : null);
    }
  }, [total, answers]);

  const nextQuestion = useCallback(() => {
    if (current < total - 1) {
      const nextIdx = current + 1;
      setCurrent(nextIdx);
      setSelected(answers[nextIdx] !== undefined ? answers[nextIdx] : null);
    }
  }, [current, total, answers]);

  const prevQuestion = useCallback(() => {
    if (current > 0) {
      const prevIdx = current - 1;
      setCurrent(prevIdx);
      setSelected(answers[prevIdx] !== undefined ? answers[prevIdx] : null);
    }
  }, [current, answers]);

  const submitAssessment = useCallback((finalAnswers = null, remainingSeconds = 0) => {
    if (isSubmitted) return;
    const finalAnswerMap = finalAnswers || answers;
    const calculated = calculateAssessmentScore({
      questions,
      answers: finalAnswerMap,
      timeLimit: assessment?.timeLimit || 20,
      timeLeft: remainingSeconds
    });

    setScoreData(calculated);
    setIsSubmitted(true);
    setPhase('result');
    setResultTab('summary');

    if (onSubmit) {
      onSubmit(calculated);
    }

    return calculated;
  }, [isSubmitted, answers, questions, assessment, onSubmit]);

  const retakeAssessment = useCallback(() => {
    setPhase('quiz');
    setResultTab('summary');
    setCurrent(0);
    setAnswers({});
    setSelected(null);
    setIsSubmitted(false);
    setScoreData(null);
  }, []);

  return {
    phase,
    setPhase,
    resultTab,
    setResultTab,
    current,
    currentQuestion: questions[current] || null,
    total,
    answers,
    selected: answers[current] !== undefined ? answers[current] : selected,
    isSubmitted,
    scoreData,
    selectOption,
    jumpToQuestion,
    nextQuestion,
    prevQuestion,
    submitAssessment,
    retakeAssessment
  };
};
