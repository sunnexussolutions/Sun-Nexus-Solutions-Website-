import React from 'react';
import {
  CheckCircle2, CircleDot, ExternalLink, Video, BookOpen,
  StickyNote, Star, Code2, Tag, Building2, Check, ArrowRight
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DsaProblemRow({
  problem,
  status = 'UNSOLVED',
  isBookmarked = false,
  isRevision = false,
  hasNote = false,
  onToggleBookmark,
  onToggleRevision,
  onOpenNotes,
  onToggleStatus,
  onOpenDetails,
  onPractice
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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

  const handleStatusClick = (e) => {
    e.stopPropagation();
    if (onToggleStatus) {
      const nextStatus = isSolved ? 'UNSOLVED' : 'SOLVED';
      onToggleStatus(problem.id, nextStatus);
    }
  };

  const handleRevisionClick = (e) => {
    e.stopPropagation();
    if (onToggleRevision) {
      onToggleRevision(problem.id, isRevision);
    } else if (onToggleBookmark) {
      onToggleBookmark(problem.id);
    }
  };

  const handleNotesClick = (e) => {
    e.stopPropagation();
    if (onOpenNotes) {
      onOpenNotes(problem);
    }
  };

  const handleRowClick = () => {
    if (onOpenDetails) {
      onOpenDetails(problem);
    }
  };

  return (
    <div
      onClick={handleRowClick}
      className="dsa-problem-row"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(240px, 1fr) auto',
        alignItems: 'center',
        padding: '12px 18px',
        borderRadius: '14px',
        backgroundColor: isDark ? '#0B1F33' : '#FFFFFF',
        border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#CBDDE9'}`,
        boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 4px rgba(13, 27, 42, 0.02)',
        gap: '16px',
        width: '100%',
        boxSizing: 'border-box',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#2872A1';
        e.currentTarget.style.boxShadow = isDark
          ? '0 4px 16px rgba(40, 114, 161, 0.2)'
          : '0 4px 14px rgba(40, 114, 161, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isDark ? 'rgba(203, 221, 233, 0.12)' : '#CBDDE9';
        e.currentTarget.style.boxShadow = isDark
          ? '0 2px 8px rgba(0,0,0,0.2)'
          : '0 1px 4px rgba(13, 27, 42, 0.02)';
      }}
    >
      {/* ── Left Column: Status Checkbox + Problem Title + Pattern/Tags ── */}
      <div className="dsa-problem-left" style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {/* Status Checkbox Button */}
        <button
          onClick={handleStatusClick}
          className="dsa-problem-check-btn"
          title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: isSolved
              ? '#10B981'
              : (isDark ? 'rgba(203, 221, 233, 0.08)' : '#EFF6FB'),
            border: isSolved
              ? '1.5px solid #10B981'
              : `1.5px solid ${isDark ? 'rgba(203, 221, 233, 0.3)' : '#CBDDE9'}`,
            color: isSolved ? '#FFFFFF' : (isDark ? '#8EA6BC' : '#CBDDE9'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.15s ease'
          }}
        >
          {isSolved ? <Check size={16} strokeWidth={2.5} /> : <CircleDot size={13} />}
        </button>

        {/* Title and Metadata */}
        <div className="dsa-problem-title-box" style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              className="dsa-problem-title"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: isSolved
                  ? (isDark ? '#8EA6BC' : '#64748B')
                  : (isDark ? '#F3F7FB' : '#0D1B2A'),
                textDecoration: isSolved ? 'line-through' : 'none',
                fontFamily: "'Poppins', sans-serif",
                lineHeight: 1.3
              }}
            >
              {problem.number ? `${problem.number}. ` : ''}{problem.title}
            </span>
          </div>

          {/* Pattern and Tags */}
          <div className="dsa-problem-tags-row" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {problem.pattern && (
              <span
                style={{
                  fontSize: '11px',
                  color: isDark ? '#4A90C2' : '#2872A1',
                  backgroundColor: isDark ? 'rgba(40, 114, 161, 0.15)' : '#EFF6FB',
                  padding: '1px 7px',
                  borderRadius: '6px',
                  border: `1px solid ${isDark ? 'rgba(74, 144, 194, 0.25)' : '#CBDDE9'}`,
                  fontWeight: 500
                }}
              >
                {problem.pattern}
              </span>
            )}

            {Array.isArray(problem.tags) && problem.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '10.5px',
                  color: isDark ? '#8EA6BC' : '#64748B',
                  backgroundColor: isDark ? 'rgba(203, 221, 233, 0.06)' : '#F8FAFC',
                  padding: '1px 6px',
                  borderRadius: '5px'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Column: Resource | Practice | Note | Revision | Difficulty ── */}
      <div
        className="dsa-problem-right"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Sub-group: Resources & Note & Revision Star */}
        <div className="dsa-problem-icons-group" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {problem.videoUrl && (
            <a
              href={problem.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Watch Video Solution"
              style={{
                padding: '6px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2',
                color: '#EF4444',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none'
              }}
            >
              <Video size={14} />
            </a>
          )}

          {(problem.articleUrl || problem.editorialUrl) && (
            <a
              href={problem.articleUrl || problem.editorialUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Read Editorial Notes"
              style={{
                padding: '6px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : '#EFF6FF',
                color: '#3B82F6',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none'
              }}
            >
              <BookOpen size={14} />
            </a>
          )}

          {/* Note Button */}
          <button
            onClick={handleNotesClick}
            title={hasNote || problem.note ? 'Edit Personal Note' : 'Add Personal Note'}
            style={{
              padding: '6px',
              borderRadius: '8px',
              backgroundColor: (hasNote || problem.note)
                ? (isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7')
                : (isDark ? 'rgba(203, 221, 233, 0.08)' : '#EFF6FB'),
              color: (hasNote || problem.note) ? '#D97706' : (isDark ? '#8EA6BC' : '#64748B'),
              border: (hasNote || problem.note)
                ? '1px solid rgba(245, 158, 11, 0.35)'
                : `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <StickyNote size={14} />
            {(hasNote || problem.note) && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#F59E0B'
                }}
              />
            )}
          </button>

          {/* Revision Star Toggle */}
          <button
            onClick={handleRevisionClick}
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
              justifyContent: 'center',
              transition: 'color 0.15s ease'
            }}
          >
            <Star size={16} fill={isRevision ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Right Sub-group: Difficulty Badge + Practice Button */}
        <div className="dsa-problem-actions-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Difficulty Badge */}
          <span
            className="dsa-problem-diff-badge"
            style={{
              padding: '3px 8px',
              borderRadius: '999px',
              backgroundColor: diffBg,
              color: diffColor,
              fontSize: '11px',
              fontWeight: 700,
              border: `1px solid ${diffColor}30`,
              minWidth: '50px',
              textAlign: 'center'
            }}
          >
            {problem.difficulty}
          </span>

          {/* Practice External Link Button */}
          {problem.practiceUrl ? (
            <a
              href={problem.practiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dsa-problem-practice-btn"
              title="Open Practice Problem (LeetCode/Platform)"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: isDark ? '#0E2740' : '#EFF6FB',
                color: '#2872A1',
                border: `1px solid ${isDark ? 'rgba(74, 144, 194, 0.3)' : '#CBDDE9'}`,
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>Practice</span>
              <ExternalLink size={12} />
            </a>
          ) : (
            <button
              onClick={() => onOpenDetails && onOpenDetails(problem)}
              className="dsa-problem-practice-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '8px',
                backgroundColor: isDark ? '#0B1F33' : '#EFF6FB',
                color: isDark ? '#8EA6BC' : '#64748B',
                border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
                fontSize: '11.5px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              <span>Details</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
