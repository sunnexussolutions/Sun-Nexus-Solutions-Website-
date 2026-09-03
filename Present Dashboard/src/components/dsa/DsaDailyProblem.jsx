import React from 'react';
import { Calendar, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DsaDailyProblem({
  dailyProblem = null,
  isSolved = false,
  onSolve
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!dailyProblem) return null;

  const diffColor =
    dailyProblem.difficulty === 'Easy'
      ? '#10B981'
      : dailyProblem.difficulty === 'Medium'
      ? '#F59E0B'
      : '#EF4444';

  const diffBg =
    dailyProblem.difficulty === 'Easy'
      ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5')
      : dailyProblem.difficulty === 'Medium'
      ? (isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB')
      : (isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2');

  return (
    <div
      style={{
        padding: '20px 24px',
        borderRadius: '18px',
        backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
        border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.25)' : '0 2px 12px rgba(13, 27, 42, 0.04)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '24px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(40, 114, 161, 0.2)' : '#EFF6FB',
            color: isDark ? '#4A90C2' : '#2872A1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Calendar size={22} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: isDark ? '#4A90C2' : '#2872A1',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              Daily Problem Challenge
            </span>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: diffBg,
                color: diffColor,
                fontSize: '11px',
                fontWeight: 700,
                border: `1px solid ${diffColor}40`
              }}
            >
              {dailyProblem.difficulty}
            </span>
            {isSolved && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5',
                  color: '#10B981',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                <CheckCircle2 size={12} />
                <span>Solved Today</span>
              </span>
            )}
          </div>

          <h3
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: isDark ? '#F3F7FB' : '#0D1B2A',
              margin: 0,
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            {dailyProblem.title}
          </h3>
        </div>
      </div>

      <button
        onClick={() => onSolve(dailyProblem.id)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '9px 20px',
          borderRadius: '10px',
          backgroundColor: isSolved ? (isDark ? '#1E3A5F' : '#EFF6FB') : '#2872A1',
          color: isSolved ? (isDark ? '#CBDDE9' : '#2872A1') : '#FFFFFF',
          fontSize: '13px',
          fontWeight: 600,
          border: isSolved ? `1px solid ${isDark ? '#4A90C2' : '#CBDDE9'}` : 'none',
          cursor: 'pointer',
          boxShadow: isSolved ? 'none' : '0 2px 10px rgba(40, 114, 161, 0.25)',
          transition: 'all 0.2s ease',
          fontFamily: "'Poppins', sans-serif"
        }}
        onMouseEnter={(e) => {
          if (!isSolved) e.currentTarget.style.backgroundColor = '#205E86';
        }}
        onMouseLeave={(e) => {
          if (!isSolved) e.currentTarget.style.backgroundColor = '#2872A1';
        }}
      >
        <span>{isSolved ? 'Review Solution' : 'Solve Daily Problem'}</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
