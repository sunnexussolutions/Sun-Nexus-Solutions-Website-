import React, { useState } from 'react';
import {
  X, ExternalLink, Bookmark, CheckCircle2, CircleDot, Star, StickyNote,
  Clock, Database, Lightbulb, Code2, Video, BookOpen, Layers, Check, ArrowRight
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DsaProblemDetailsModal({
  isOpen,
  onClose,
  problem,
  status = 'UNSOLVED',
  isBookmarked = false,
  isRevision = false,
  hasNote = false,
  onToggleStatus,
  onToggleBookmark,
  onToggleRevision,
  onOpenNotes
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('problem'); // 'problem' | 'hints' | 'solution'

  if (!isOpen || !problem) return null;

  const isSolved = status === 'SOLVED' || status === 'COMPLETED';

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

  return (
    <div
      className="dsa-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(13, 27, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="dsa-modal-dialog"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '92vh',
          backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
          borderRadius: '20px',
          border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
          boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.6)' : '0 16px 40px rgba(13, 27, 42, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxSizing: 'border-box',
          fontFamily: "'Poppins', sans-serif"
        }}
      >
        {/* Modal Header */}
        <div
          className="dsa-modal-header"
          style={{
            padding: '20px 24px',
            borderBottom: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#EFF6FB'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isDark ? 'rgba(203, 221, 233, 0.02)' : '#F8FAFC',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
            {/* Status toggle button */}
            <button
              onClick={() => onToggleStatus && onToggleStatus(problem.id, isSolved ? 'UNSOLVED' : 'SOLVED')}
              title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: isSolved ? '#10B981' : (isDark ? 'rgba(203, 221, 233, 0.08)' : '#EFF6FB'),
                border: isSolved ? '1.5px solid #10B981' : `1.5px solid ${isDark ? 'rgba(203, 221, 233, 0.3)' : '#CBDDE9'}`,
                color: isSolved ? '#FFFFFF' : (isDark ? '#8EA6BC' : '#CBDDE9'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              {isSolved ? <CheckCircle2 size={20} /> : <CircleDot size={18} />}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3
                  className="dsa-modal-title"
                  style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: 800,
                    color: isDark ? '#F3F7FB' : '#0D1B2A',
                    wordBreak: 'break-word',
                    lineHeight: 1.3
                  }}
                >
                  {problem.number ? `${problem.number}. ` : ''}{problem.title}
                </h3>

                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '999px',
                    backgroundColor: diffBg,
                    color: diffColor,
                    fontSize: '11px',
                    fontWeight: 700,
                    border: `1px solid ${diffColor}35`
                  }}
                >
                  {problem.difficulty}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', fontSize: '11.5px', color: isDark ? '#8EA6BC' : '#64748B' }}>
                {problem.topic && <span>{problem.topic}</span>}
                {problem.subtopic && <span>• {problem.subtopic}</span>}
                {problem.pattern && <span>• Pattern: <strong>{problem.pattern}</strong></span>}
              </div>
            </div>
          </div>

          {/* Quick Action Icons & Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Revision Toggle */}
            <button
              onClick={() => onToggleRevision && onToggleRevision(problem.id, isRevision)}
              title={isRevision ? 'Remove from Revision' : 'Add to Revision'}
              style={{
                background: 'none',
                border: 'none',
                color: isRevision ? '#F59E0B' : (isDark ? '#8EA6BC' : '#CBDDE9'),
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Star size={18} fill={isRevision ? 'currentColor' : 'none'} />
            </button>

            {/* Bookmark Toggle */}
            <button
              onClick={() => onToggleBookmark && onToggleBookmark(problem.id)}
              title={isBookmarked ? 'Remove Bookmark' : 'Save Problem'}
              style={{
                background: 'none',
                border: 'none',
                color: isBookmarked ? '#F59E0B' : (isDark ? '#8EA6BC' : '#CBDDE9'),
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>

            {/* Note Button */}
            <button
              onClick={() => onOpenNotes && onOpenNotes(problem)}
              title="Personal Notes"
              style={{
                padding: '6px',
                borderRadius: '8px',
                backgroundColor: hasNote ? (isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7') : (isDark ? 'rgba(203, 221, 233, 0.08)' : '#EFF6FB'),
                color: hasNote ? '#D97706' : (isDark ? '#8EA6BC' : '#64748B'),
                border: hasNote ? '1px solid rgba(245, 158, 11, 0.35)' : `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <StickyNote size={16} />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: isDark ? '#8EA6BC' : '#64748B',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Sub-tabs Bar */}
        <div
          className="dsa-modal-tabs-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 24px',
            borderBottom: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.1)' : '#EFF6FB'}`,
            backgroundColor: isDark ? '#0B1F33' : '#EFF6FB'
          }}
        >
          <button
            onClick={() => setActiveTab('problem')}
            className="dsa-modal-tab-btn"
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: activeTab === 'problem' ? 700 : 500,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'problem' ? (isDark ? '#2872A1' : '#FFFFFF') : 'transparent',
              color: activeTab === 'problem' ? (isDark ? '#FFFFFF' : '#2872A1') : (isDark ? '#8EA6BC' : '#64748B'),
              boxShadow: activeTab === 'problem' ? '0 1px 4px rgba(13, 27, 42, 0.06)' : 'none'
            }}
          >
            Problem Statement
          </button>

          {normalizedHints.length > 0 && (
            <button
              onClick={() => setActiveTab('hints')}
              className="dsa-modal-tab-btn"
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
              Hints ({normalizedHints.length})
            </button>
          )}

          {(problem.videoUrl || problem.articleUrl || problem.editorialUrl) && (
            <button
              onClick={() => setActiveTab('solution')}
              className="dsa-modal-tab-btn"
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: activeTab === 'solution' ? 700 : 500,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'solution' ? (isDark ? '#2872A1' : '#FFFFFF') : 'transparent',
                color: activeTab === 'solution' ? (isDark ? '#FFFFFF' : '#2872A1') : (isDark ? '#8EA6BC' : '#64748B'),
                boxShadow: activeTab === 'solution' ? '0 1px 4px rgba(13, 27, 42, 0.06)' : 'none'
              }}
            >
              Resources & Editorial
            </button>
          )}
        </div>

        {/* Modal Scrollable Content Pane */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          {activeTab === 'problem' && (
            <>
              {/* Description */}
              <div
                style={{
                  fontSize: '14px',
                  lineHeight: 1.65,
                  color: isDark ? '#CBDDE9' : '#334155',
                  whiteSpace: 'pre-line'
                }}
              >
                {problem.description || 'Solve this Data Structures & Algorithms challenge by designing an optimal time & space solution.'}
              </div>

              {/* Input / Output Formats if provided */}
              {(problem.inputFormat || problem.input_format || problem.outputFormat || problem.output_format) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  {(problem.inputFormat || problem.input_format) && (
                    <div style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: isDark ? '#0B1F33' : '#F8FAFC', border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.1)' : '#CBDDE9'}` }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#2872A1', textTransform: 'uppercase' }}>Input Format</span>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: isDark ? '#CBDDE9' : '#334155' }}>
                        {problem.inputFormat || problem.input_format}
                      </p>
                    </div>
                  )}
                  {(problem.outputFormat || problem.output_format) && (
                    <div style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: isDark ? '#0B1F33' : '#F8FAFC', border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.1)' : '#CBDDE9'}` }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#10B981', textTransform: 'uppercase' }}>Output Format</span>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: isDark ? '#CBDDE9' : '#334155' }}>
                        {problem.outputFormat || problem.output_format}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Examples */}
              {normalizedExamples.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: isDark ? '#F3F7FB' : '#0D1B2A' }}>
                    Examples
                  </h4>
                  {normalizedExamples.map((ex, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '12px',
                        backgroundColor: isDark ? '#0B1F33' : '#F8FAFC',
                        border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#CBDDE9'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        fontSize: '13px'
                      }}
                    >
                      <div style={{ fontWeight: 700, color: isDark ? '#4A90C2' : '#2872A1' }}>
                        Example {idx + 1}:
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: isDark ? '#F3F7FB' : '#0D1B2A' }}>
                    Constraints
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {normalizedConstraints.map((c, idx) => (
                      <li key={idx} style={{ fontSize: '13px', color: isDark ? '#8EA6BC' : '#475569' }}>
                        <code style={{ color: isDark ? '#CBDDE9' : '#0D1B2A', fontFamily: 'monospace' }}>{c}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Complexity Badges */}
              {(problem.timeComplexity || problem.spaceComplexity) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '6px' }}>
                  {problem.timeComplexity && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '8px', backgroundColor: isDark ? 'rgba(40, 114, 161, 0.15)' : '#EFF6FB', border: `1px solid ${isDark ? 'rgba(74, 144, 194, 0.3)' : '#CBDDE9'}`, color: isDark ? '#4A90C2' : '#2872A1', fontSize: '12px', fontWeight: 600 }}>
                      <Clock size={13} />
                      <span>Time: {problem.timeComplexity}</span>
                    </div>
                  )}
                  {problem.spaceComplexity && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '8px', backgroundColor: isDark ? 'rgba(40, 114, 161, 0.15)' : '#EFF6FB', border: `1px solid ${isDark ? 'rgba(74, 144, 194, 0.3)' : '#CBDDE9'}`, color: isDark ? '#4A90C2' : '#2872A1', fontSize: '12px', fontWeight: 600 }}>
                      <Database size={13} />
                      <span>Space: {problem.spaceComplexity}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'hints' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {normalizedHints.map((hint, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    backgroundColor: isDark ? '#0B1F33' : '#FFFBEB',
                    border: `1px solid ${isDark ? 'rgba(245, 158, 11, 0.25)' : '#FDE68A'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D97706', fontWeight: 700, fontSize: '13px' }}>
                    <Lightbulb size={16} />
                    <span>Hint {idx + 1}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#CBDDE9' : '#475569', lineHeight: 1.5 }}>
                    {hint}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'solution' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {problem.videoUrl && (
                <a
                  href={problem.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 18px',
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
                  <span>Watch Video Solution Walkthrough</span>
                  <ExternalLink size={13} />
                </a>
              )}

              {(problem.articleUrl || problem.editorialUrl) && (
                <a
                  href={problem.articleUrl || problem.editorialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 18px',
                    borderRadius: '10px',
                    backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#3B82F6',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    width: 'fit-content'
                  }}
                >
                  <BookOpen size={16} />
                  <span>Read Detailed Editorial Article</span>
                  <ExternalLink size={13} />
                </a>
              )}

              {problem.solutionUrl && (
                <a
                  href={problem.solutionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 18px',
                    borderRadius: '10px',
                    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#10B981',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    width: 'fit-content'
                  }}
                >
                  <Code2 size={16} />
                  <span>View Official Reference Code</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className="dsa-modal-footer"
          style={{
            padding: '16px 24px',
            borderTop: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#EFF6FB'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isDark ? 'rgba(203, 221, 233, 0.02)' : '#F8FAFC',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 auto' }}>
            <button
              onClick={() => onToggleStatus && onToggleStatus(problem.id, isSolved ? 'UNSOLVED' : 'SOLVED')}
              className="dsa-modal-footer-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '8px',
                backgroundColor: isSolved ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5') : (isDark ? '#0B1F33' : '#EFF6FB'),
                color: isSolved ? '#10B981' : (isDark ? '#CBDDE9' : '#334155'),
                border: `1px solid ${isSolved ? '#10B981' : (isDark ? 'rgba(203, 221, 233, 0.2)' : '#CBDDE9')}`,
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isSolved ? <Check size={14} /> : <CircleDot size={14} />}
              <span>{isSolved ? 'Solved' : 'Mark as Solved'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 auto' }}>
            {problem.practiceUrl ? (
              <a
                href={problem.practiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="dsa-modal-footer-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#2872A1',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  boxShadow: '0 2px 10px rgba(40, 114, 161, 0.25)'
                }}
              >
                <span>Practice Problem</span>
                <ExternalLink size={14} />
              </a>
            ) : (
              <span style={{ fontSize: '12px', color: isDark ? '#8EA6BC' : '#64748B', fontStyle: 'italic' }}>
                Practice link unavailable
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
