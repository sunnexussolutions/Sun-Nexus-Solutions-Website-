import React from 'react';
import {
  Brain, RotateCcw, Upload, Calendar, Clock, Map, Bookmark, BarChart3, Sparkles
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DsaHeader({
  activeView = 'roadmap',
  setActiveView,
  progressPct = 0,
  totalSolved = 0,
  totalProblems = 0,
  lastUpdatedDate = 'September 6, 2026',
  onResetClick,
  onImportClick
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const NAV_TABS = [
    { id: 'roadmap', label: 'DSA A2Z Sheet', icon: Map },
    { id: 'bookmarks', label: 'Saved Bookmarks', icon: Bookmark },
    { id: 'overview', label: 'Progress & Analytics', icon: BarChart3 }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* ── Main Banner Card ──────────────────────────────────────────────── */}
      <div
        className="dsa-header-card"
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
        {/* Left: Branding & Title & Subtitle */}
        <div className="dsa-header-branding" style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2 }}>
          <div
            className="dsa-header-icon-box"
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
                className="dsa-header-title"
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: isDark ? '#F3F7FB' : '#0D1B2A',
                  margin: 0,
                  letterSpacing: '-0.02em',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                DSA A2Z Sheet
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
                Nexus Hub
              </span>
            </div>
            <p
              className="dsa-header-subtitle"
              style={{
                fontSize: '13.5px',
                color: isDark ? '#8EA6BC' : '#475569',
                margin: '3px 0 0 0',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400
              }}
            >
              Learn Data Structures and Algorithms from A to Z in a structured manner.
            </p>
          </div>
        </div>

        {/* Right: Last Updated + Reset + Import Buttons */}
        <div
          className="dsa-header-actions"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            zIndex: 2
          }}
        >
          {/* Last Updated Badge */}
          <div
            className="dsa-header-updated-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: isDark ? 'rgba(203, 221, 233, 0.06)' : '#EFF6FB',
              border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#CBDDE9'}`,
              color: isDark ? '#8EA6BC' : '#64748B',
              fontSize: '12px',
              fontWeight: 500
            }}
          >
            <Clock size={13} />
            <span>Last updated: {lastUpdatedDate}</span>
          </div>

          {/* Import Button */}
          {onImportClick && (
            <button
              onClick={onImportClick}
              className="dsa-header-btn"
              title="Import DSA Sheet"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                backgroundColor: isDark ? '#0B1F33' : '#EFF6FB',
                color: isDark ? '#CBDDE9' : '#2872A1',
                border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.2)' : '#CBDDE9'}`,
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Upload size={14} />
              <span>Import</span>
            </button>
          )}

          {/* Reset Button */}
          {onResetClick && (
            <button
              onClick={onResetClick}
              className="dsa-header-btn"
              title="Reset progress"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2',
                color: '#EF4444',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation View Switcher Tabs */}
      <div
        className="dsa-nav-tabs-container"
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
              className="dsa-nav-tab-btn"
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
                  ? '#2872A1'
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
