import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCcw, Award, Clock, Target, Check } from 'lucide-react';

const TrophyGraphic = () => (
  <div style={{ position: 'relative', width: '100px', height: '70px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg viewBox="0 0 160 120" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="goldCupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="goldStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <rect x="52" y="98" width="56" height="12" rx="4" fill="url(#goldStemGrad)" />
      <path d="M 68 82 L 92 82 L 88 98 L 72 98 Z" fill="url(#goldStemGrad)" />
      <path d="M 45 42 C 30 42, 30 70, 52 72 L 52 64 C 40 64, 40 48, 48 48 Z" fill="#d97706" />
      <path d="M 115 42 C 130 42, 130 70, 108 72 L 108 64 C 120 64, 120 48, 112 48 Z" fill="#d97706" />
      <path d="M 46 36 L 114 36 Q 112 78 80 80 Q 48 78 46 36 Z" fill="url(#goldCupGrad)" />
      <ellipse cx="80" cy="36" rx="34" ry="6" fill="#fef3c7" opacity="0.6" />
      <polygon points="80,48 83,56 92,56 85,61 87,70 80,64 73,70 75,61 68,56 77,56" fill="#ffffff" />
    </svg>
  </div>
);

/**
 * ── ResultReview ────────────────────────────────────────────────────
 * Renders assessment summary scorecards, accuracy breakdowns,
 * and question-by-question review with explanations.
 */
export default function ResultReview({
  scoreData,
  activeTab = 'summary',
  onTabChange,
  onRetake,
  onClose,
  topic = '',
  isDark = true
}) {
  if (!scoreData) return null;

  const borderColor = isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9';
  const textColor = isDark ? '#F3F7FB' : '#0D1B2A';
  const mutedColor = isDark ? '#8EA6BC' : '#64748B';
  const cardBg = isDark ? '#0B1F33' : '#FFFFFF';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Tab Switcher: Summary | Review Questions */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${borderColor}`, gap: '8px' }}>
        {[
          { id: 'summary', label: 'Scorecard Summary' },
          { id: 'review', label: `Question Review (${scoreData.total})` }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange && onTabChange(tab.id)}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderBottom: isActive ? '2px solid #2872A1' : '2px solid transparent',
                backgroundColor: 'transparent',
                color: isActive ? '#2872A1' : mutedColor,
                fontSize: '13.5px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          {/* Trophy & Main Score */}
          <div
            style={{
              width: '100%',
              padding: '24px',
              borderRadius: '16px',
              backgroundColor: isDark ? 'rgba(14, 39, 64, 0.6)' : '#F8FAFC',
              border: `1px solid ${borderColor}`,
              textAlign: 'center',
              boxSizing: 'border-box'
            }}
          >
            <TrophyGraphic />
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor }}>
              Assessment Completed!
            </h3>
            <p style={{ margin: '4px 0 14px', fontSize: '13px', color: mutedColor }}>
              {topic ? `${topic} • ` : ''}Proficiency: <strong style={{ color: scoreData.gradeColor }}>{scoreData.statusBadge}</strong>
            </p>

            <div style={{ fontSize: '38px', fontWeight: 900, color: '#2872A1' }}>
              {scoreData.score} / {scoreData.total}
              <span style={{ fontSize: '18px', fontWeight: 700, color: mutedColor, marginLeft: '8px' }}>
                ({scoreData.percentage}%)
              </span>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px'
            }}
          >
            <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: cardBg, border: `1px solid ${borderColor}`, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#10B981', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                <CheckCircle2 size={13} /> Correct
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: textColor, marginTop: '4px' }}>
                {scoreData.correct}
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: cardBg, border: `1px solid ${borderColor}`, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#EF4444', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                <XCircle size={13} /> Incorrect
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: textColor, marginTop: '4px' }}>
                {scoreData.incorrect}
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: cardBg, border: `1px solid ${borderColor}`, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#F59E0B', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                <Target size={13} /> Accuracy
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: textColor, marginTop: '4px' }}>
                {scoreData.accuracy}%
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: cardBg, border: `1px solid ${borderColor}`, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#4A90C2', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                <Clock size={13} /> Time Spent
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: textColor, marginTop: '7px' }}>
                {scoreData.timeSpentFormatted}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'review' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {scoreData.reviewList?.map((rev, idx) => (
            <div
              key={idx}
              style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: cardBg,
                border: `1.5px solid ${rev.isCorrect ? 'rgba(16, 185, 129, 0.35)' : rev.isAttempted ? 'rgba(239, 68, 68, 0.35)' : borderColor}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: textColor }}>
                  Question {idx + 1}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    color: rev.isCorrect ? '#10B981' : rev.isAttempted ? '#EF4444' : '#F59E0B',
                    backgroundColor: rev.isCorrect ? 'rgba(16, 185, 129, 0.1)' : rev.isAttempted ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'
                  }}
                >
                  {rev.isCorrect ? '✓ Correct' : rev.isAttempted ? '✗ Incorrect' : 'Skipped'}
                </span>
              </div>

              <div style={{ fontSize: '14px', fontWeight: 600, color: textColor }}>
                {rev.questionText}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {rev.options.map((opt, optIdx) => {
                  const isUserPick = Number(rev.userAnswer) === optIdx;
                  const isCorrectPick = Number(rev.correctAnswer) === optIdx;
                  let optBg = 'transparent';
                  let optBorder = borderColor;
                  if (isCorrectPick) {
                    optBg = 'rgba(16, 185, 129, 0.12)';
                    optBorder = '#10B981';
                  } else if (isUserPick && !rev.isCorrect) {
                    optBg = 'rgba(239, 68, 68, 0.12)';
                    optBorder = '#EF4444';
                  }

                  return (
                    <div
                      key={optIdx}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        backgroundColor: optBg,
                        border: `1px solid ${optBorder}`,
                        fontSize: '13px',
                        color: textColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{opt}</span>
                      {isCorrectPick && <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981' }}>Correct Answer</span>}
                      {isUserPick && !rev.isCorrect && <span style={{ fontSize: '11px', fontWeight: 700, color: '#EF4444' }}>Your Choice</span>}
                    </div>
                  );
                })}
              </div>

              {rev.explanation && (
                <div style={{ marginTop: '4px', padding: '10px 12px', borderRadius: '8px', backgroundColor: isDark ? 'rgba(40, 114, 161, 0.12)' : '#EFF6FB', fontSize: '12.5px', color: textColor }}>
                  <strong style={{ color: '#2872A1' }}>Explanation: </strong> {rev.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
