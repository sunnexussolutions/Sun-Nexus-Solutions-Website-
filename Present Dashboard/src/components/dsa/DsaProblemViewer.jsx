import React, { useState } from 'react';
import {
  Brain, ChevronDown, ChevronRight, Lightbulb, Clock, Database,
  ExternalLink, Bookmark, CheckCircle2, ArrowLeft, Video, BookOpen
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DsaProblemViewer({
  problem,
  topicTitle = 'Data Structures & Algorithms',
  status = 'UNSOLVED',
  isBookmarked = false,
  onToggleBookmark,
  onBack
}) {
  const [hintsExpanded, setHintsExpanded] = useState({});
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'hints' | 'tutorial'
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!problem) return null;

  const isSolved = status === 'SOLVED';

  const diffColor =
    problem.difficulty === 'Easy'
      ? '#10B981'
      : problem.difficulty === 'Medium'
      ? '#F59E0B'
      : '#EF4444';

  const diffBg =
    problem.difficulty === 'Easy'
      ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5')
      : problem.difficulty === 'Medium'
      ? (isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB')
      : (isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2');

  const normalizedExamples = React.useMemo(() => {
    if (Array.isArray(problem.examples)) return problem.examples;
    if (typeof problem.examples === 'string' && problem.examples.trim()) {
      try {
        const p = JSON.parse(problem.examples);
        if (Array.isArray(p)) return p;
      } catch (e) {}
    }
    return [];
  }, [problem.examples]);

  const normalizedConstraints = React.useMemo(() => {
    if (Array.isArray(problem.constraints)) return problem.constraints;
    if (typeof problem.constraints === 'string' && problem.constraints.trim()) {
      try {
        const p = JSON.parse(problem.constraints);
        if (Array.isArray(p)) return p;
      } catch (e) {}
      return problem.constraints.split('\n').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }, [problem.constraints]);

  const normalizedHints = React.useMemo(() => {
    if (Array.isArray(problem.hints)) return problem.hints;
    if (typeof problem.hints === 'string' && problem.hints.trim()) {
      try {
        const p = JSON.parse(problem.hints);
        if (Array.isArray(p)) return p;
      } catch (e) {}
      return problem.hints.split('\n').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }, [problem.hints]);

  const toggleHint = (idx) => {
    setHintsExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
        borderRadius: '18px',
        border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Header & Breadcrumb Bar */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#EFF6FB'}`,
          backgroundColor: isDark ? 'rgba(203, 221, 233, 0.03)' : '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onBack && (
            <button
              onClick={onBack}
              title="Back to Roadmap"
              style={{
                background: 'none',
                border: 'none',
                color: isDark ? '#8EA6BC' : '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                borderRadius: '6px'
              }}
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#2872A1', textTransform: 'uppercase' }}>
              {topicTitle}
            </span>
            <h2
              style={{
                fontSize: '17px',
                fontWeight: 700,
                color: isDark ? '#F3F7FB' : '#0D1B2A',
                margin: 0,
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              {problem.number ? `${problem.number}. ` : ''}{problem.title}
            </h2>
          </div>
        </div>

        {/* Right: Difficulty + Bookmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: '999px',
              backgroundColor: diffBg,
              color: diffColor,
              fontSize: '11.5px',
              fontWeight: 700,
              border: `1px solid ${diffColor}35`
            }}
          >
            {problem.difficulty}
          </span>

          <button
            onClick={() => onToggleBookmark(problem.id)}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Problem'}
            style={{
              background: 'none',
              border: 'none',
              color: isBookmarked ? '#F59E0B' : (isDark ? '#8EA6BC' : '#CBDDE9'),
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Sub-tabs: Description / Hints / Notes */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          padding: '8px 16px',
          borderBottom: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.1)' : '#EFF6FB'}`,
          backgroundColor: isDark ? '#0B1F33' : '#EFF6FB'
        }}
      >
        <button
          onClick={() => setActiveTab('description')}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '12.5px',
            fontWeight: activeTab === 'description' ? 700 : 500,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'description' ? (isDark ? '#2872A1' : '#FFFFFF') : 'transparent',
            color: activeTab === 'description' ? (isDark ? '#FFFFFF' : '#2872A1') : (isDark ? '#8EA6BC' : '#64748B'),
            boxShadow: activeTab === 'description' ? '0 1px 4px rgba(13, 27, 42, 0.06)' : 'none'
          }}
        >
          Description
        </button>

        {Array.isArray(problem.hints) && problem.hints.length > 0 && (
          <button
            onClick={() => setActiveTab('hints')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: activeTab === 'hints' ? 700 : 500,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'hints' ? (isDark ? '#2872A1' : '#FFFFFF') : 'transparent',
              color: activeTab === 'hints' ? (isDark ? '#FFFFFF' : '#2872A1') : (isDark ? '#8EA6BC' : '#64748B'),
              boxShadow: activeTab === 'hints' ? '0 1px 4px rgba(13, 27, 42, 0.06)' : 'none'
            }}
          >
            Hints ({problem.hints.length})
          </button>
        )}

        {(problem.tutorial || problem.videoUrl) && (
          <button
            onClick={() => setActiveTab('tutorial')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: activeTab === 'tutorial' ? 700 : 500,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'tutorial' ? (isDark ? '#2872A1' : '#FFFFFF') : 'transparent',
              color: activeTab === 'tutorial' ? (isDark ? '#FFFFFF' : '#2872A1') : (isDark ? '#8EA6BC' : '#64748B'),
              boxShadow: activeTab === 'tutorial' ? '0 1px 4px rgba(13, 27, 42, 0.06)' : 'none'
            }}
          >
            Editorial & Notes
          </button>
        )}
      </div>

      {/* Main Content Pane (Scrollable) */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          fontFamily: "'Poppins', sans-serif"
        }}
      >
        {activeTab === 'description' && (
          <>
            {/* Description Text */}
            <div
              style={{
                fontSize: '14px',
                lineHeight: 1.65,
                color: isDark ? '#CBDDE9' : '#334155',
                whiteSpace: 'pre-line'
              }}
            >
              {problem.description}
            </div>

            {/* Examples Blocks */}
            {normalizedExamples.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: isDark ? '#F3F7FB' : '#0D1B2A' }}>
                  Examples
                </h4>
                {normalizedExamples.map((ex, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '12px',
                      backgroundColor: isDark ? '#0B1F33' : '#F8FAFC',
                      border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#CBDDE9'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '13px'
                    }}
                  >
                    <div style={{ fontWeight: 700, color: isDark ? '#4A90C2' : '#2872A1' }}>
                      Example {i + 1}:
                    </div>
                    <div>
                      <strong style={{ color: isDark ? '#F3F7FB' : '#0D1B2A' }}>Input: </strong>
                      <code style={{ color: isDark ? '#38BDF8' : '#0369A1', backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : '#EFF6FB', padding: '2px 6px', borderRadius: '4px' }}>
                        {ex.input}
                      </code>
                    </div>
                    <div>
                      <strong style={{ color: isDark ? '#F3F7FB' : '#0D1B2A' }}>Output: </strong>
                      <code style={{ color: isDark ? '#34D399' : '#059669', backgroundColor: isDark ? 'rgba(52, 211, 153, 0.1)' : '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>
                        {ex.output}
                      </code>
                    </div>
                    {ex.explanation && (
                      <div style={{ color: isDark ? '#8EA6BC' : '#64748B', fontStyle: 'italic', marginTop: '2px' }}>
                        <strong>Explanation: </strong>{ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Constraints */}
            {normalizedConstraints.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: isDark ? '#F3F7FB' : '#0D1B2A' }}>
                  Constraints
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {normalizedConstraints.map((c, i) => (
                    <li key={i} style={{ fontSize: '13px', color: isDark ? '#8EA6BC' : '#475569' }}>
                      <code style={{ fontFamily: 'monospace', color: isDark ? '#CBDDE9' : '#0D1B2A' }}>{c}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Complexity Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', paddingTop: '8px' }}>
              {problem.timeComplexity && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: isDark ? 'rgba(40, 114, 161, 0.15)' : '#EFF6FB',
                    border: `1px solid ${isDark ? 'rgba(74, 144, 194, 0.3)' : '#CBDDE9'}`,
                    color: isDark ? '#4A90C2' : '#2872A1',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  <Clock size={14} />
                  <span>Time: {problem.timeComplexity}</span>
                </div>
              )}

              {problem.spaceComplexity && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: isDark ? 'rgba(40, 114, 161, 0.15)' : '#EFF6FB',
                    border: `1px solid ${isDark ? 'rgba(74, 144, 194, 0.3)' : '#CBDDE9'}`,
                    color: isDark ? '#4A90C2' : '#2872A1',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  <Database size={14} />
                  <span>Space: {problem.spaceComplexity}</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Hints Tab */}
        {activeTab === 'hints' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {normalizedHints.map((hint, i) => {
              const isHintOpen = hintsExpanded[i] || false;
              return (
                <div
                  key={i}
                  style={{
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
                    backgroundColor: isDark ? '#0B1F33' : '#F8FAFC',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => toggleHint(i)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: isDark ? '#F3F7FB' : '#0D1B2A',
                      fontWeight: 600,
                      fontSize: '13px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lightbulb size={15} style={{ color: '#F59E0B' }} />
                      <span>Hint {i + 1}</span>
                    </div>
                    {isHintOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {isHintOpen && (
                    <div
                      style={{
                        padding: '12px 16px',
                        borderTop: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.1)' : '#EFF6FB'}`,
                        fontSize: '13px',
                        color: isDark ? '#CBDDE9' : '#334155',
                        lineHeight: 1.55,
                        backgroundColor: isDark ? '#0E2740' : '#FFFFFF'
                      }}
                    >
                      {hint}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tutorial Tab */}
        {activeTab === 'tutorial' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {problem.tutorial && (
              <div
                style={{
                  fontSize: '13.5px',
                  lineHeight: 1.65,
                  color: isDark ? '#CBDDE9' : '#334155',
                  whiteSpace: 'pre-line'
                }}
              >
                {problem.tutorial}
              </div>
            )}

            {problem.videoUrl && (
              <a
                href={problem.videoUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  width: 'fit-content'
                }}
              >
                <Video size={16} />
                <span>Watch Video Walkthrough</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
