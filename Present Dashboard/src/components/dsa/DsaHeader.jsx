import React from 'react';
import {
  Brain, Map, Code2, Bookmark, FileText, BarChart3, Sparkles
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DsaHeader({
  activeView = 'roadmap',
  setActiveView,
  progressPct = 0,
  totalSolved = 0,
  totalProblems = 0
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const NAV_TABS = [
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'overview', label: 'Overview & Stats', icon: BarChart3 }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        marginBottom: '24px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '18px',
          padding: '24px 28px',
          borderRadius: '20px',
          backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
          border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
          boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.35)' : '0 4px 20px rgba(13, 27, 42, 0.04)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Left: Branding & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2 }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #2872A1 0%, #4A90C2 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(40, 114, 161, 0.3)',
              flexShrink: 0
            }}
          >
            <Brain size={28} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: isDark ? '#F3F7FB' : '#0D1B2A',
                  margin: 0,
                  letterSpacing: '-0.02em',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                Nexus DSA
              </h1>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: isDark ? 'rgba(40, 114, 161, 0.25)' : '#EFF6FB',
                  border: `1px solid ${isDark ? 'rgba(74, 144, 194, 0.3)' : '#CBDDE9'}`,
                  color: isDark ? '#4A90C2' : '#2872A1',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                Structured Sheet
              </span>
            </div>
            <p
              style={{
                fontSize: '13.5px',
                color: isDark ? '#8EA6BC' : '#475569',
                margin: '3px 0 0 0',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400
              }}
            >
              Master Data Structures & Algorithms step by step.
            </p>
          </div>
        </div>

        {/* Right: Overall Progress Bar Widget */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            minWidth: '220px',
            zIndex: 2
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: isDark ? '#8EA6BC' : '#475569',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              Solved {totalSolved} of {totalProblems}
            </span>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 800,
                color: '#2872A1',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              {progressPct}%
            </span>
          </div>

          <div
            style={{
              width: '100%',
              maxWidth: '260px',
              height: '8px',
              borderRadius: '999px',
              backgroundColor: isDark ? 'rgba(203, 221, 233, 0.1)' : '#EFF6FB',
              border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${Math.min(100, Math.max(0, progressPct))}%`,
                height: '100%',
                borderRadius: '999px',
                background: 'linear-gradient(90deg, #2872A1, #4A90C2)',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Pills Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          padding: '6px',
          borderRadius: '14px',
          backgroundColor: isDark ? '#0B1F33' : '#EFF6FB',
          border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#CBDDE9'}`,
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {NAV_TABS.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive
                  ? (isDark ? '#2872A1' : '#2872A1')
                  : 'transparent',
                color: isActive
                  ? '#FFFFFF'
                  : (isDark ? '#8EA6BC' : '#475569'),
                boxShadow: isActive ? '0 2px 8px rgba(40, 114, 161, 0.25)' : 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                fontFamily: "'Poppins', sans-serif",
                flexShrink: 0
              }}
            >
              <IconComp size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
