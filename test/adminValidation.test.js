import test from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyQuestion,
  validateQuestion,
  validateAssessmentForm
} from '../Present Dashboard/src/utils/questionValidation.js';

test('Question Validation - Blank question creation', () => {
  const q = emptyQuestion();
  assert.ok(q.id);
  assert.equal(q.question, '');
  assert.equal(q.options.length, 4);
  assert.equal(q.answer, 0);
});

test('Question Validation - Missing question text and options', () => {
  const invalidQuestion = {
    question: '   ',
    options: ['Option A', ''],
    answer: 0
  };
  const { isValid, errors } = validateQuestion(invalidQuestion);
  assert.equal(isValid, false);
  assert.ok(errors.question);
  assert.ok(errors.options);
});

test('Question Validation - Valid question passes', () => {
  const validQuestion = {
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    answer: 1
  };
  const { isValid, errors } = validateQuestion(validQuestion);
  assert.equal(isValid, true);
  assert.equal(Object.keys(errors).length, 0);
});

test('Assessment Form Validation - Missing topic and questions', () => {
  const form = {
    topic: '',
    category: 'Quantitative',
    week: 'Week 1',
    timeLimit: 0
  };
  const { isValid, errors } = validateAssessmentForm(form, []);
  assert.equal(isValid, false);
  assert.ok(errors.topic);
  assert.ok(errors.timeLimit);
  assert.ok(errors.questions);
});

test('Assessment Form Validation - Valid assessment passes', () => {
  const form = {
    topic: 'Number Systems',
    category: 'Quantitative',
    week: 'Week 1',
    timeLimit: 25
  };
  const questions = [
    {
      question: 'Which of the following is prime?',
      options: ['4', '6', '7', '9'],
      answer: 2
    }
  ];
  const { isValid, errors } = validateAssessmentForm(form, questions);
  assert.equal(isValid, true);
  assert.equal(Object.keys(errors).length, 0);
});
