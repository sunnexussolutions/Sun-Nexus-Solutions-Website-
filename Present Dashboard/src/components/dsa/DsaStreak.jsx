import React from 'react';
import { Flame, Check, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DsaStreak({
  currentStreak = 0,
  longestStreak = 0,
  weekHistory = [false, false, false, false, false, false, false]
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
        gap: '20px',
        marginBottom: '24px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Left: Streak count badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEF2F2',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
            flexShrink: 0
          }}
        >
          <Flame size={24} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: isDark ? '#F3F7FB' : '#0D1B2A',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              {currentStreak} Day Streak
            </span>
            <span style={{ fontSize: '18px' }}>🔥</span>
          </div>
          <span
            style={{
              fontSize: '12px',
              color: isDark ? '#8EA6BC' : '#64748B',
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            Personal Best: {longestStreak} days
          </span>
        </div>
      </div>

      {/* Right: 7-day Weekly Grid */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {DAYS.map((day, idx) => {
          const isDone = weekHistory[idx] || false;
          return (
            <div
              key={day}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: isDark ? '#8EA6BC' : '#64748B',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                {day}
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isDone
                    ? '#10B981'
                    : isDark
                    ? 'rgba(203, 221, 233, 0.1)'
                    : '#EFF6FB',
                  color: isDone ? '#FFFFFF' : isDark ? '#8EA6BC' : '#CBDDE9',
                  border: isDone
                    ? '1.5px solid #10B981'
                    : `1px solid ${isDark ? 'rgba(203, 221, 233, 0.2)' : '#CBDDE9'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  boxShadow: isDone ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none'
                }}
              >
                {isDone ? <Check size={14} strokeWidth={3} /> : '·'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
