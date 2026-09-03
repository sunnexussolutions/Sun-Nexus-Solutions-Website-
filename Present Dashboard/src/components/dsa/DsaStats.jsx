import React from 'react';
import {
  Layers, Code2, CheckCircle2, CircleDot, TrendingUp, Flame
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DsaStats({
  totalTopics = 18,
  totalProblems = 0,
  solvedCount = 0,
  remainingCount = 0,
  progressPct = 0,
  currentStreak = 0
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const STATS_CARDS = [
    {
      id: 'topics',
      label: 'Total Topics',
      value: totalTopics,
      icon: Layers,
      color: '#2872A1',
      bgLight: '#EFF6FB',
      bgDark: 'rgba(40, 114, 161, 0.15)'
    },
    {
      id: 'problems',
      label: 'Total Problems',
      value: totalProblems,
      icon: Code2,
      color: '#4A90C2',
      bgLight: '#EFF6FB',
      bgDark: 'rgba(74, 144, 194, 0.15)'
    },
    {
      id: 'solved',
      label: 'Problems Solved',
      value: solvedCount,
      icon: CheckCircle2,
      color: '#10B981',
      bgLight: '#ECFDF5',
      bgDark: 'rgba(16, 185, 129, 0.15)'
    },
    {
      id: 'remaining',
      label: 'Remaining',
      value: remainingCount,
      icon: CircleDot,
      color: '#F59E0B',
      bgLight: '#FFFBEB',
      bgDark: 'rgba(245, 158, 11, 0.15)'
    },
    {
      id: 'progress',
      label: 'Overall Progress',
      value: `${progressPct}%`,
      icon: TrendingUp,
      color: '#8B5CF6',
      bgLight: '#F5F3FF',
      bgDark: 'rgba(139, 92, 246, 0.15)'
    },
    {
      id: 'streak',
      label: 'Current Streak',
      value: `${currentStreak} Days`,
      icon: Flame,
      color: '#EF4444',
      bgLight: '#FEF2F2',
      bgDark: 'rgba(239, 68, 68, 0.15)'
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {STATS_CARDS.map((st) => {
        const IconComp = st.icon;
        return (
          <div
            key={st.id}
            style={{
              padding: '18px 20px',
              borderRadius: '16px',
              backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
              border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
              boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.25)' : '0 2px 10px rgba(13, 27, 42, 0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxSizing: 'border-box',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = isDark ? '0 8px 24px rgba(0,0,0,0.35)' : '0 6px 20px rgba(40, 114, 161, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isDark ? '0 4px 16px rgba(0,0,0,0.25)' : '0 2px 10px rgba(13, 27, 42, 0.03)';
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: isDark ? '#8EA6BC' : '#64748B',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                {st.label}
              </span>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: isDark ? '#F3F7FB' : '#0D1B2A',
                  fontFamily: "'Poppins', sans-serif",
                  lineHeight: 1.2
                }}
              >
                {st.value}
              </span>
            </div>

            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: isDark ? st.bgDark : st.bgLight,
                color: st.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <IconComp size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
