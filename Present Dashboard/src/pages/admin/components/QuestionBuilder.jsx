import React from 'react';
import { Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { emptyQuestion } from '../../../utils/questionValidation';

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * ── QuestionBuilder ─────────────────────────────────────────────────
 * Reusable question builder for Aptitude assessments, Mock Tests,
 * and future technical exams.
 */
export default function QuestionBuilder({
  questions = [],
  setQuestions,
  attempted = false,
  isDark = true
}) {
  const add = () => {
    setQuestions(prev => [...prev, emptyQuestion()]);
  };

  const remove = (index) => {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const update = (index, field, val) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, [field]: val } : q));
  };

  const updateOption = (qIdx, optIdx, val) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q;
      const opts = [...(q.options || ['', '', '', ''])];
      opts[optIdx] = val;
      return { ...q, options: opts };
    }));
  };

  const borderColor = isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9';
  const cardBg = isDark ? '#0B1F33' : '#FFFFFF';
  const inputBg = isDark ? 'rgba(14, 39, 64, 0.6)' : '#F8FAFC';
  const textColor = isDark ? '#F3F7FB' : '#0D1B2A';
  const mutedColor = isDark ? '#8EA6BC' : '#64748B';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: textColor }}>
          Questions ({questions.length})
        </span>

        <button
          type="button"
          onClick={add}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '8px',
            backgroundColor: isDark ? 'rgba(40, 114, 161, 0.2)' : '#EFF6FB',
            color: '#2872A1',
            border: `1px solid ${isDark ? 'rgba(40, 114, 161, 0.3)' : '#CBDDE9'}`,
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Plus size={14} /> Add Question
        </button>
      </div>

      {questions.map((q, qIdx) => {
        const questionText = q.question || q.text || '';
        const isQuestionEmpty = attempted && !questionText.trim();
        const options = q.options || ['', '', '', ''];

        return (
          <div
            key={q.id || qIdx}
            style={{
              padding: '18px 20px',
              borderRadius: '14px',
              backgroundColor: cardBg,
              border: `1.5px solid ${isQuestionEmpty ? '#EF4444' : borderColor}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              transition: 'border-color 0.2s ease'
            }}
          >
            {/* Header: Question Number & Delete */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#2872A1' }}>
                Question {qIdx + 1}
              </span>

              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(qIdx)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EF4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  <Trash2 size={13} /> Remove
                </button>
              )}
            </div>

            {/* Question Text */}
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: mutedColor, marginBottom: '4px' }}>
                Question Statement *
              </label>
              <textarea
                value={questionText}
                onChange={(e) => update(qIdx, 'question', e.target.value)}
                placeholder="Enter the question text here..."
                rows={2}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${isQuestionEmpty ? '#EF4444' : borderColor}`,
                  backgroundColor: inputBg,
                  color: textColor,
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Options */}
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: mutedColor, marginBottom: '6px' }}>
                Answer Options & Correct Answer Selection *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                {options.map((opt, optIdx) => {
                  const isCorrect = Number(q.answer) === optIdx;
                  return (
                    <div
                      key={optIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: `1px solid ${isCorrect ? '#10B981' : borderColor}`,
                        backgroundColor: isCorrect ? (isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.06)') : inputBg
                      }}
                    >
                      <input
                        type="radio"
                        name={`correct-${qIdx}`}
                        checked={isCorrect}
                        onChange={() => update(qIdx, 'answer', optIdx)}
                        style={{ accentColor: '#10B981', cursor: 'pointer' }}
                        title="Mark as correct answer"
                      />
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: isCorrect ? '#10B981' : mutedColor }}>
                        {OPTION_LABELS[optIdx]}
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                        placeholder={`Option ${OPTION_LABELS[optIdx]}`}
                        style={{
                          flex: 1,
                          border: 'none',
                          background: 'transparent',
                          color: textColor,
                          fontSize: '12.5px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: mutedColor, marginBottom: '4px' }}>
                Explanation / Solution Step (Optional)
              </label>
              <input
                type="text"
                value={q.explanation || ''}
                onChange={(e) => update(qIdx, 'explanation', e.target.value)}
                placeholder="Explain why the selected option is correct..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${borderColor}`,
                  backgroundColor: inputBg,
                  color: textColor,
                  fontSize: '12.5px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
