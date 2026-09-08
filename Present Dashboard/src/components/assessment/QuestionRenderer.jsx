import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * ── QuestionRenderer ────────────────────────────────────────────────
 * Displays the current assessment question with options, selections,
 * and quick access to reference notes.
 */
export default function QuestionRenderer({
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  onSelectOption,
  isSubmitted = false,
  onOpenReferenceNotes = null,
  topic = '',
  isDark = true
}) {
  if (!question) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No question data available.
      </div>
    );
  }

  const questionText = question.question || question.text || '';
  const options = question.options || [];

  const borderColor = isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9';
  const textColor = isDark ? '#F3F7FB' : '#0D1B2A';
  const mutedColor = isDark ? '#8EA6BC' : '#64748B';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Question Header & Cheatsheet trigger */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#2872A1',
              backgroundColor: isDark ? 'rgba(40, 114, 161, 0.15)' : '#EFF6FB',
              padding: '4px 10px',
              borderRadius: '8px',
              border: `1px solid ${isDark ? 'rgba(40, 114, 161, 0.3)' : '#CBDDE9'}`
            }}
          >
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          {topic && (
            <span style={{ fontSize: '12px', color: mutedColor, fontWeight: 500 }}>
              • {topic}
            </span>
          )}
        </div>

        {onOpenReferenceNotes && (
          <button
            type="button"
            onClick={onOpenReferenceNotes}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '8px',
              backgroundColor: isDark ? 'rgba(40, 114, 161, 0.15)' : '#EFF6FB',
              border: `1px solid ${isDark ? 'rgba(40, 114, 161, 0.3)' : '#CBDDE9'}`,
              color: '#2872A1',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <BookOpen size={14} />
            <span>Formula Cheatsheet</span>
          </button>
        )}
      </div>

      {/* Question Body */}
      <div
        style={{
          fontSize: '15.5px',
          fontWeight: 600,
          lineHeight: 1.6,
          color: textColor,
          padding: '16px 20px',
          borderRadius: '14px',
          backgroundColor: isDark ? 'rgba(14, 39, 64, 0.5)' : '#F8FAFC',
          border: `1px solid ${borderColor}`
        }}
      >
        {questionText}
      </div>

      {/* Options Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((opt, optIdx) => {
          const isSelected = Number(selectedOption) === optIdx;
          return (
            <motion.div
              key={optIdx}
              whileHover={{ scale: isSubmitted ? 1 : 1.005 }}
              whileTap={{ scale: isSubmitted ? 1 : 0.995 }}
              onClick={() => {
                if (!isSubmitted && onSelectOption) {
                  onSelectOption(optIdx);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 18px',
                borderRadius: '12px',
                backgroundColor: isSelected
                  ? (isDark ? 'rgba(40, 114, 161, 0.25)' : '#EFF6FB')
                  : (isDark ? '#0B1F33' : '#FFFFFF'),
                border: `1.5px solid ${
                  isSelected ? '#2872A1' : borderColor
                }`,
                cursor: isSubmitted ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 4px 14px rgba(40, 114, 161, 0.15)' : 'none'
              }}
            >
              {/* Option Badge A, B, C, D */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? '#2872A1' : (isDark ? 'rgba(203, 221, 233, 0.1)' : '#F1F5F9'),
                  color: isSelected ? '#FFFFFF' : textColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  flexShrink: 0
                }}
              >
                {OPTION_LABELS[optIdx] || optIdx + 1}
              </div>

              {/* Option Text */}
              <span
                style={{
                  fontSize: '14px',
                  color: textColor,
                  fontWeight: isSelected ? 600 : 400,
                  lineHeight: 1.5
                }}
              >
                {opt}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
