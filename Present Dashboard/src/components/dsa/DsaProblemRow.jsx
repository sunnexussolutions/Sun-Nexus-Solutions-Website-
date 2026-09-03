import React from 'react';
import {
  CheckCircle2, CircleDot, Clock, Bookmark, ArrowRight,
  ExternalLink, Video, FileText, BookOpen, Code2, StickyNote,
  Building2, Tag, Star
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
  onSolve
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const isSolved = status === 'SOLVED' || status === 'COMPLETED';
  const isAttempted = status === 'ATTEMPTED' || status === 'IN_PROGRESS';

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

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 1fr) auto',
        alignItems: 'center',
        padding: '12px 16px',
        borderRadius: '14px',
        backgroundColor: isDark ? '#0B1F33' : '#FFFFFF',
        border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#CBDDE9'}`,
        boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 4px rgba(13, 27, 42, 0.02)',
        gap: '16px',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
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
      {/* ── Left Column: Checkbox + Title + Meta Badges ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {/* Status Checkbox / Quick Toggle */}
        <button
          onClick={handleStatusClick}
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
              : isAttempted
              ? '1.5px solid #F59E0B'
              : `1.5px solid ${isDark ? 'rgba(203, 221, 233, 0.3)' : '#CBDDE9'}`,
            color: isSolved
              ? '#FFFFFF'
              : isAttempted
              ? '#F59E0B'
              : (isDark ? '#8EA6BC' : '#CBDDE9'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.15s ease'
          }}
        >
          {isSolved ? (
            <CheckCircle2 size={16} />
          ) : isAttempted ? (
            <Clock size={14} />
          ) : (
            <CircleDot size={13} />
          )}
        </button>

        {/* Title and Tags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              onClick={() => onSolve(problem.id)}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: isSolved
                  ? (isDark ? '#8EA6BC' : '#64748B')
                  : (isDark ? '#F3F7FB' : '#0D1B2A'),
                textDecoration: isSolved ? 'line-through' : 'none',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                lineHeight: 1.3
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#2872A1'; }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isSolved
                  ? (isDark ? '#8EA6BC' : '#64748B')
                  : (isDark ? '#F3F7FB' : '#0D1B2A');
              }}
            >
              {problem.number ? `${problem.number}. ` : ''}{problem.title}
            </span>

            {/* Difficulty Badge */}
            <span
              style={{
                padding: '2px 7px',
                borderRadius: '999px',
                backgroundColor: diffBg,
                color: diffColor,
                fontSize: '11px',
                fontWeight: 700,
                border: `1px solid ${diffColor}30`,
                flexShrink: 0
              }}
            >
              {problem.difficulty}
            </span>
          </div>

          {/* Tags & Companies sub-row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {Array.isArray(problem.tags) && problem.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '10.5px',
                  color: isDark ? '#8EA6BC' : '#64748B',
                  backgroundColor: isDark ? 'rgba(203, 221, 233, 0.06)' : '#EFF6FB',
                  padding: '1px 6px',
                  borderRadius: '5px',
                  border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.1)' : '#CBDDE9'}`
                }}
              >
                {tag}
              </span>
            ))}

            {Array.isArray(problem.companies) && problem.companies.slice(0, 2).map((comp) => (
              <span
                key={comp}
                style={{
                  fontSize: '10.5px',
                  fontWeight: 600,
                  color: isDark ? '#4A90C2' : '#2872A1',
                  backgroundColor: isDark ? 'rgba(40, 114, 161, 0.12)' : '#EFF6FB',
                  padding: '1px 6px',
                  borderRadius: '5px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <Building2 size={9} />
                <span>{comp}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Column: Practice, Resources, Notes, Revision & Solve Action ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Practice External Link (LeetCode / Codeforces / Custom) */}
        {problem.practiceUrl && (
          <a
            href={problem.practiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Practice URL (LeetCode/Platform)"
            style={{
              padding: '6px',
              borderRadius: '8px',
              backgroundColor: isDark ? 'rgba(203, 221, 233, 0.08)' : '#EFF6FB',
              color: isDark ? '#4A90C2' : '#2872A1',
              border: `1px solid ${isDark ? 'rgba(74, 144, 194, 0.25)' : '#CBDDE9'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none'
            }}
          >
            <ExternalLink size={14} />
          </a>
        )}

        {/* Video Tutorial Link */}
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

        {/* Article / Editorial Link */}
        {(problem.articleUrl || problem.editorialUrl) && (
          <a
            href={problem.articleUrl || problem.editorialUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Read Article / Editorial Notes"
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

        {/* Personal Notes Button */}
        <button
          onClick={handleNotesClick}
          title={hasNote || problem.note ? 'View / Edit Personal Note' : 'Add Personal Note'}
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

        {/* Revision Toggle (Star / Bookmark) */}
        <button
          onClick={handleRevisionClick}
          title={isRevision || isBookmarked ? 'Marked for Revision' : 'Add to Revision List'}
          style={{
            background: 'none',
            border: 'none',
            color: (isRevision || isBookmarked) ? '#F59E0B' : (isDark ? '#8EA6BC' : '#CBDDE9'),
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease'
          }}
        >
          <Star size={16} fill={(isRevision || isBookmarked) ? 'currentColor' : 'none'} />
        </button>

        {/* Solve / Workspace Button */}
        <button
          onClick={() => onSolve(problem.id)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '7px 14px',
            borderRadius: '8px',
            backgroundColor: isSolved
              ? (isDark ? 'rgba(40, 114, 161, 0.2)' : '#EFF6FB')
              : '#2872A1',
            color: isSolved
              ? (isDark ? '#CBDDE9' : '#2872A1')
              : '#FFFFFF',
            border: isSolved
              ? `1px solid ${isDark ? '#4A90C2' : '#CBDDE9'}`
              : 'none',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: isSolved ? 'none' : '0 2px 8px rgba(40, 114, 161, 0.2)',
            transition: 'all 0.2s ease',
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          <span>{isSolved ? 'Review' : 'Solve'}</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
