import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAssessmentScore } from '../Present Dashboard/src/utils/scoringEngine.js';

test('Scoring Engine - Perfect Score', () => {
  const questions = [
    { id: 1, question: 'Q1', options: ['A', 'B', 'C', 'D'], answer: 0 },
    { id: 2, question: 'Q2', options: ['A', 'B', 'C', 'D'], answer: 1 },
    { id: 3, question: 'Q3', options: ['A', 'B', 'C', 'D'], answer: 2 }
  ];
  const answers = { 0: 0, 1: 1, 2: 2 };

  const result = calculateAssessmentScore({
    questions,
    answers,
    timeLimit: 10,
    timeLeft: 300 // 5 minutes left
  });

  assert.equal(result.total, 3);
  assert.equal(result.attempted, 3);
  assert.equal(result.correct, 3);
  assert.equal(result.incorrect, 0);
  assert.equal(result.skipped, 0);
  assert.equal(result.percentage, 100);
  assert.equal(result.accuracy, 100);
  assert.equal(result.statusBadge, 'Outstanding');
  assert.equal(result.timeSpent, 300); // 10*60 - 300 = 300s
});

test('Scoring Engine - Partial Score & Skipped Questions', () => {
  const questions = [
    { id: 1, question: 'Q1', options: ['A', 'B'], answer: 0 },
    { id: 2, question: 'Q2', options: ['A', 'B'], answer: 1 },
    { id: 3, question: 'Q3', options: ['A', 'B'], answer: 0 },
    { id: 4, question: 'Q4', options: ['A', 'B'], answer: 1 }
  ];
  // Answered Q1 correctly, Q2 incorrectly, skipped Q3 and Q4
  const answers = { 0: 0, 1: 0 };

  const result = calculateAssessmentScore({
    questions,
    answers,
    timeLimit: 20,
    timeLeft: 600
  });

  assert.equal(result.total, 4);
  assert.equal(result.attempted, 2);
  assert.equal(result.correct, 1);
  assert.equal(result.incorrect, 1);
  assert.equal(result.skipped, 2);
  assert.equal(result.percentage, 25); // 1 / 4 = 25%
  assert.equal(result.accuracy, 50);   // 1 / 2 = 50%
});

test('Scoring Engine - Zero Attempted', () => {
  const questions = [
    { id: 1, question: 'Q1', options: ['A', 'B'], answer: 0 },
    { id: 2, question: 'Q2', options: ['A', 'B'], answer: 1 }
  ];
  const answers = {};

  const result = calculateAssessmentScore({
    questions,
    answers,
    timeLimit: 15,
    timeLeft: 0
  });

  assert.equal(result.total, 2);
  assert.equal(result.attempted, 0);
  assert.equal(result.correct, 0);
  assert.equal(result.incorrect, 0);
  assert.equal(result.skipped, 2);
  assert.equal(result.percentage, 0);
  assert.equal(result.accuracy, 0);
  assert.equal(result.statusBadge, 'Needs Practice');
});
