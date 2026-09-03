import React from 'react';
import {
  TrendingUp, Award, Flame, CheckCircle2, Bookmark, ArrowRight, Layers
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DsaUserDashboard({
  progressData = {},
  topics = [],
  onOpenProblem
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const easy = progressData.easy || { solved: 0, total: 0, pct: 0 };
  const medium = progressData.medium || { solved: 0, total: 0, pct: 0 };
  const hard = progressData.hard || { solved: 0, total: 0, pct: 0 };
  const streak = progressData.streak || { currentStreak: 0, longestStreak: 0 };

  const DIFFICULTY_CARDS = [
    {
      label: 'Easy Problems',
      solved: easy.solved,
      total: easy.total,
      pct: easy.pct,
      color: '#10B981',
      bgLight: '#ECFDF5',
      bgDark: 'rgba(16, 185, 129, 0.12)'
    },
    {
      label: 'Medium Problems',
      solved: medium.solved,
      total: medium.total,
      pct: medium.pct,
      color: '#F59E0B',
      bgLight: '#FFFBEB',
      bgDark: 'rgba(245, 158, 11, 0.12)'
    },
    {
      label: 'Hard Problems',
      solved: hard.solved,
      total: hard.total,
      pct: hard.pct,
      color: '#EF4444',
      bgLight: '#FEF2F2',
      bgDark: 'rgba(239, 68, 68, 0.12)'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      {/* 3 Difficulty Progress Breakdown Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px'
        }}
      >
        {DIFFICULTY_CARDS.map((dc) => (
          <div
            key={dc.label}
            style={{
              padding: '20px',
              borderRadius: '16px',
              backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
              border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
              boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.25)' : '0 2px 10px rgba(13, 27, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: isDark ? '#F3F7FB' : '#0D1B2A',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                {dc.label}
              </span>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: isDark ? dc.bgDark : dc.bgLight,
                  color: dc.color,
                  fontSize: '12px',
                  fontWeight: 800
                }}
              >
                {dc.pct}%
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: dc.color }}>
                {dc.solved}
              </span>
              <span style={{ fontSize: '13px', color: isDark ? '#8EA6BC' : '#64748B' }}>
                / {dc.total} solved
              </span>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '999px',
                backgroundColor: isDark ? 'rgba(203, 221, 233, 0.1)' : '#EFF6FB',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${dc.pct}%`,
                  height: '100%',
                  borderRadius: '999px',
                  backgroundColor: dc.color,
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Highlights & Streak Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}
      >
        {/* Streak & Consistency Card */}
        <div
          style={{
            padding: '24px',
            borderRadius: '18px',
            backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
            border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Flame size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: isDark ? '#F3F7FB' : '#0D1B2A' }}>
              Consistency & Milestones
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div
              style={{
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#0B1F33' : '#EFF6FB',
                border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.1)' : '#CBDDE9'}`
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#8EA6BC' : '#64748B', textTransform: 'uppercase' }}>
                Current Streak
              </span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#EF4444', marginTop: '4px' }}>
                {streak.currentStreak} Days 🔥
              </div>
            </div>

            <div
              style={{
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#0B1F33' : '#EFF6FB',
                border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.1)' : '#CBDDE9'}`
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#8EA6BC' : '#64748B', textTransform: 'uppercase' }}>
                Longest Streak
              </span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#2872A1', marginTop: '4px' }}>
                {streak.longestStreak} Days 🏆
              </div>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: isDark ? '#8EA6BC' : '#64748B', margin: 0, lineHeight: 1.5 }}>
            Solve at least one problem every day to maintain your streak and accelerate your algorithmic intuition.
          </p>
        </div>

        {/* Roadmap Milestones */}
        <div
          style={{
            padding: '24px',
            borderRadius: '18px',
            backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
            border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(40, 114, 161, 0.15)' : '#EFF6FB',
                color: '#2872A1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Award size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: isDark ? '#F3F7FB' : '#0D1B2A' }}>
              Curriculum Progression
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div
              style={{
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#0B1F33' : '#EFF6FB',
                border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.1)' : '#CBDDE9'}`
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#8EA6BC' : '#64748B', textTransform: 'uppercase' }}>
                Total Chapters
              </span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#F3F7FB' : '#0D1B2A', marginTop: '4px' }}>
                18 Structured
              </div>
            </div>

            <div
              style={{
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#0B1F33' : '#EFF6FB',
                border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.1)' : '#CBDDE9'}`
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#8EA6BC' : '#64748B', textTransform: 'uppercase' }}>
                Bookmarks Saved
              </span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>
                {(progressData.bookmarks || []).length} Problems ⭐
              </div>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: isDark ? '#8EA6BC' : '#64748B', margin: 0, lineHeight: 1.5 }}>
            Each chapter covers foundational concepts to advanced patterns. Master them in sequence to build deep mastery.
          </p>
        </div>
      </div>
    </div>
  );
}
