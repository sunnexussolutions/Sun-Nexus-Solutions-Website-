import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAssessmentScore } from '../Present Dashboard/src/utils/scoringEngine.js';

test('Assessment Engine - Status Badges across score thresholds', () => {
  const mkQuestions = (count) => Array.from({ length: count }, (_, i) => ({ id: i, answer: 0 }));
  const q10 = mkQuestions(10);

  // 90% -> Outstanding
  const r90 = calculateAssessmentScore({
    questions: q10,
    answers: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
    timeLimit: 10,
    timeLeft: 300
  });
  assert.equal(r90.statusBadge, 'Outstanding');

  // 70% -> Proficient
  const r70 = calculateAssessmentScore({
    questions: q10,
    answers: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    timeLimit: 10,
    timeLeft: 300
  });
  assert.equal(r70.statusBadge, 'Proficient');

  // 50% -> Average
  const r50 = calculateAssessmentScore({
    questions: q10,
    answers: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
    timeLimit: 10,
    timeLeft: 300
  });
  assert.equal(r50.statusBadge, 'Average');

  // 30% -> Needs Practice
  const r30 = calculateAssessmentScore({
    questions: q10,
    answers: { 0: 0, 1: 0, 2: 0 },
    timeLimit: 10,
    timeLeft: 300
  });
  assert.equal(r30.statusBadge, 'Needs Practice');

  // 10% -> Needs Practice
  const r10 = calculateAssessmentScore({
    questions: q10,
    answers: { 0: 0 },
    timeLimit: 10,
    timeLeft: 300
  });
  assert.equal(r10.statusBadge, 'Needs Practice');
});

test('Assessment Engine - Review list maps question details correctly', () => {
  const questions = [
    {
      id: 101,
      question: 'Capital of France?',
      options: ['Paris', 'London', 'Berlin', 'Rome'],
      answer: 0,
      explanation: 'Paris is the capital of France.'
    },
    {
      id: 102,
      question: 'Which is an even prime?',
      options: ['1', '2', '3', '5'],
      answer: 1,
      explanation: '2 is the only even prime.'
    }
  ];

  const answers = { 0: 0, 1: 2 }; // Q0 correct (Paris), Q1 wrong (selected '3')

  const result = calculateAssessmentScore({
    questions,
    answers,
    timeLimit: 5,
    timeLeft: 200
  });

  assert.equal(result.reviewList.length, 2);
  assert.equal(result.reviewList[0].isCorrect, true);
  assert.equal(result.reviewList[0].userAnswer, 0);
  assert.equal(result.reviewList[0].correctAnswer, 0);

  assert.equal(result.reviewList[1].isCorrect, false);
  assert.equal(result.reviewList[1].userAnswer, 2);
  assert.equal(result.reviewList[1].correctAnswer, 1);
});
