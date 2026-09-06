import React, { useState } from 'react';
import {
  TrendingUp, Calendar as CalendarIcon, Video, CheckCircle2, Clock,
  ArrowRight, Flame, Target, BookOpen, Layers, Sparkles, ChevronRight, User
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DsaRightSidebar({
  progress = {},
  topics = [],
  onOpenTopic,
  onOpenProblem
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const totalSolved = progress?.totalSolved || 0;
  const totalProblems = progress?.totalProblems || 1;
  const overallPct = progress?.overallProgressPct || Math.round((totalSolved / (totalProblems || 1)) * 100) || 0;

  const easySolved = progress?.easy?.solved || 0;
  const easyTotal = progress?.easy?.total || 0;
  const easyPct = easyTotal > 0 ? Math.round((easySolved / easyTotal) * 100) : 0;

  const medSolved = progress?.medium?.solved || 0;
  const medTotal = progress?.medium?.total || 0;
  const medPct = medTotal > 0 ? Math.round((medSolved / medTotal) * 100) : 0;

  const hardSolved = progress?.hard?.solved || 0;
  const hardTotal = progress?.hard?.total || 0;
  const hardPct = hardTotal > 0 ? Math.round((hardSolved / hardTotal) * 100) : 0;

  // Streak days
  const streak = progress?.streak?.currentStreak || 0;
  const weekHistory = progress?.streak?.weekHistory || [false, false, false, false, false, false, false];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Sessions (mock upcoming or empty state)
  const UPCOMING_SESSIONS = [
    {
      id: 'sess-1',
      title: 'Graph Traversals & BFS/DFS Deep Dive',
      mentor: 'Nexus Lead Instructor',
      date: 'Sept 10, 2026',
      time: '6:30 PM IST',
      type: 'Live Masterclass'
    },
    {
      id: 'sess-2',
      title: 'Dynamic Programming: Knapsack & Grid Patterns',
      mentor: 'Competitive Programming Team',
      date: 'Sept 14, 2026',
      time: '7:00 PM IST',
      type: 'Problem Solving'
    }
  ];

  // Daily Planner items based on structured roadmap
  const activeChapter = topics[0] || { title: 'Basics & Foundations', sections: [] };

  // SVG Circular Gauge parameters
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPct / 100) * circumference;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      {/* ── 1. DSA PROGRESS CARD (MATCHING REFERENCE CIRCULAR GAUGE) ────────── */}
      <div
        style={{
          padding: '22px 20px',
          borderRadius: '18px',
          backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
          border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.25)' : '0 2px 10px rgba(13, 27, 42, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#F3F7FB' : '#0D1B2A' }}>
            DSA Progress
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: isDark ? 'rgba(40, 114, 161, 0.2)' : '#EFF6FB',
              color: '#2872A1',
              border: `1px solid ${isDark ? 'rgba(74, 144, 194, 0.3)' : '#CBDDE9'}`
            }}
          >
            A2Z Sheet
          </span>
        </div>

        {/* Circular Progress Gauge */}
        <div style={{ position: 'relative', width: '136px', height: '136px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="136" height="136" viewBox="0 0 136 136" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle
              cx="68"
              cy="68"
              r={radius}
              stroke={isDark ? 'rgba(203, 221, 233, 0.1)' : '#EFF6FB'}
              strokeWidth="10"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="68"
              cy="68"
              r={radius}
              stroke="#2872A1"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>

          {/* Central Label */}
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#F3F7FB' : '#0D1B2A', lineHeight: 1.1 }}>
              {totalSolved}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: isDark ? '#8EA6BC' : '#64748B' }}>
              / {totalProblems} Solved
            </span>
          </div>
        </div>

        {/* Difficulty Breakdown Progress Bars */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Easy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
              <span style={{ color: '#10B981' }}>Easy</span>
              <span style={{ color: isDark ? '#CBDDE9' : '#334155' }}>{easySolved} / {easyTotal}</span>
            </div>
            <div style={{ width: '100%', height: '6px', borderRadius: '999px', backgroundColor: isDark ? 'rgba(203, 221, 233, 0.08)' : '#EFF6FB', overflow: 'hidden' }}>
              <div style={{ width: `${easyPct}%`, height: '100%', borderRadius: '999px', backgroundColor: '#10B981', transition: 'width 0.3s ease' }} />
            </div>
          </div>

          {/* Medium */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
              <span style={{ color: '#F59E0B' }}>Medium</span>
              <span style={{ color: isDark ? '#CBDDE9' : '#334155' }}>{medSolved} / {medTotal}</span>
            </div>
            <div style={{ width: '100%', height: '6px', borderRadius: '999px', backgroundColor: isDark ? 'rgba(203, 221, 233, 0.08)' : '#EFF6FB', overflow: 'hidden' }}>
              <div style={{ width: `${medPct}%`, height: '100%', borderRadius: '999px', backgroundColor: '#F59E0B', transition: 'width 0.3s ease' }} />
            </div>
          </div>

          {/* Hard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
              <span style={{ color: '#EF4444' }}>Hard</span>
              <span style={{ color: isDark ? '#CBDDE9' : '#334155' }}>{hardSolved} / {hardTotal}</span>
            </div>
            <div style={{ width: '100%', height: '6px', borderRadius: '999px', backgroundColor: isDark ? 'rgba(203, 221, 233, 0.08)' : '#EFF6FB', overflow: 'hidden' }}>
              <div style={{ width: `${hardPct}%`, height: '100%', borderRadius: '999px', backgroundColor: '#EF4444', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. CALENDAR / ROADMAP ACTIVITY TRACKER ────────────────────────── */}
      <div
        style={{
          padding: '20px',
          borderRadius: '18px',
          backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
          border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.25)' : '0 2px 10px rgba(13, 27, 42, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarIcon size={16} style={{ color: '#2872A1' }} />
            <span style={{ fontSize: '14.5px', fontWeight: 700, color: isDark ? '#F3F7FB' : '#0D1B2A' }}>
              Activity Calendar
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#EF4444', fontSize: '12px', fontWeight: 700 }}>
            <Flame size={14} />
            <span>{streak} Day Streak</span>
          </div>
        </div>

        {/* 7-Day Micro Heatmap */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {dayNames.map((d, idx) => {
            const active = weekHistory[idx] || (streak > 0 && idx === 6);
            return (
              <div
                key={d}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: '8px',
                    backgroundColor: active
                      ? '#2872A1'
                      : (isDark ? 'rgba(203, 221, 233, 0.08)' : '#EFF6FB'),
                    border: active
                      ? '1px solid #4A90C2'
                      : `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#CBDDE9'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: active ? '#FFFFFF' : (isDark ? '#8EA6BC' : '#CBDDE9')
                  }}
                >
                  {active ? <CheckCircle2 size={12} /> : null}
                </div>
                <span style={{ fontSize: '10px', color: isDark ? '#8EA6BC' : '#64748B', fontWeight: 500 }}>
                  {d}
                </span>
              </div>
            );
          })}
        </div>

        {/* Learning Milestone Progress */}
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '10px',
            backgroundColor: isDark ? '#0B1F33' : '#F8FAFC',
            border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.1)' : '#EFF6FB'}`,
            fontSize: '12px',
            color: isDark ? '#8EA6BC' : '#64748B',
            lineHeight: 1.4
          }}
        >
          Active Milestone: <strong style={{ color: isDark ? '#F3F7FB' : '#0D1B2A' }}>{activeChapter.title}</strong>
        </div>
      </div>

      {/* ── 3. SESSIONS WIDGET ────────────────────────────────────────────── */}
      <div
        style={{
          padding: '20px',
          borderRadius: '18px',
          backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
          border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.25)' : '0 2px 10px rgba(13, 27, 42, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video size={16} style={{ color: '#2872A1' }} />
            <span style={{ fontSize: '14.5px', fontWeight: 700, color: isDark ? '#F3F7FB' : '#0D1B2A' }}>
              DSA Sessions
            </span>
          </div>

          <span style={{ fontSize: '11px', fontWeight: 600, color: '#2872A1' }}>
            Upcoming
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {UPCOMING_SESSIONS.map((sess) => (
            <div
              key={sess.id}
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#0B1F33' : '#F8FAFC',
                border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#CBDDE9'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: isDark ? '#F3F7FB' : '#0D1B2A' }}>
                {sess.title}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: isDark ? '#8EA6BC' : '#64748B' }}>
                <span>{sess.date} • {sess.time}</span>
                <span style={{ color: '#2872A1', fontWeight: 600 }}>{sess.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. DAILY PLANNER ──────────────────────────────────────────────── */}
      <div
        style={{
          padding: '20px',
          borderRadius: '18px',
          backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
          border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.25)' : '0 2px 10px rgba(13, 27, 42, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={16} style={{ color: '#2872A1' }} />
          <span style={{ fontSize: '14.5px', fontWeight: 700, color: isDark ? '#F3F7FB' : '#0D1B2A' }}>
            Daily Planner
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { task: 'Solve 2 Array fundamentals problems', done: totalSolved >= 2 },
            { task: 'Review personal notes on Sliding Window', done: false },
            { task: 'Attempt today’s Daily DSA problem', done: false }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '8px',
                backgroundColor: isDark ? '#0B1F33' : '#F8FAFC',
                border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.08)' : '#EFF6FB'}`
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '5px',
                  border: item.done ? '1.5px solid #10B981' : `1.5px solid ${isDark ? '#8EA6BC' : '#CBDDE9'}`,
                  backgroundColor: item.done ? '#10B981' : 'transparent',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {item.done && <CheckCircle2 size={12} />}
              </div>
              <span
                style={{
                  fontSize: '12px',
                  color: item.done ? (isDark ? '#8EA6BC' : '#64748B') : (isDark ? '#CBDDE9' : '#334155'),
                  textDecoration: item.done ? 'line-through' : 'none'
                }}
              >
                {item.task}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
