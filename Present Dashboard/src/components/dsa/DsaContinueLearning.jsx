import React from 'react';
import { PlayCircle, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DsaContinueLearning({
  lastActive = null,
  onContinue
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const hasActivity = Boolean(lastActive && (lastActive.problemTitle || lastActive.topicTitle));

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '18px 24px',
        borderRadius: '18px',
        background: isDark
          ? 'linear-gradient(135deg, rgba(40, 114, 161, 0.25) 0%, rgba(14, 39, 64, 0.8) 100%)'
          : 'linear-gradient(135deg, #EFF6FB 0%, #FFFFFF 100%)',
        border: `1.5px solid ${isDark ? 'rgba(74, 144, 194, 0.35)' : '#CBDDE9'}`,
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.25)' : '0 2px 12px rgba(40, 114, 161, 0.06)',
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
            backgroundColor: isDark ? '#2872A1' : '#2872A1',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(40, 114, 161, 0.25)',
            flexShrink: 0
          }}
        >
          {hasActivity ? <PlayCircle size={22} /> : <BookOpen size={22} />}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
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
            {hasActivity ? 'Continue Learning' : 'Start Your Journey'}
          </span>
          <span
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: isDark ? '#F3F7FB' : '#0D1B2A',
              fontFamily: "'Poppins', sans-serif",
              marginTop: '2px'
            }}
          >
            {hasActivity
              ? `${lastActive.topicTitle} → ${lastActive.problemTitle}`
              : 'Master Fundamentals: Chapter 01 — Basics & Logic Building'}
          </span>
        </div>
      </div>

      <button
        onClick={() => onContinue(lastActive?.problemId || 'prob-count-digits')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 22px',
          borderRadius: '10px',
          backgroundColor: '#2872A1',
          color: '#FFFFFF',
          fontSize: '13px',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(40, 114, 161, 0.25)',
          transition: 'all 0.2s ease',
          fontFamily: "'Poppins', sans-serif"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#205E86';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#2872A1';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span>{hasActivity ? 'Continue Solving' : 'Start Solving'}</span>
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
