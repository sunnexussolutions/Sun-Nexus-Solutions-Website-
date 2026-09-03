import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import DsaProblemRow from './DsaProblemRow';

export default function DsaSectionCard({
  section,
  problems = [],
  statusMap = {},
  bookmarks = [],
  revisions = [],
  notesMap = {},
  onToggleBookmark,
  onToggleRevision,
  onOpenNotes,
  onToggleStatus,
  onSolve,
  defaultExpanded = true
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sectionProblems = problems.filter(
    (p) => !section.id || p.sectionId === section.id || (!p.sectionId && section.difficulty === p.difficulty)
  );

  if (sectionProblems.length === 0) return null;

  const solvedCount = sectionProblems.filter((p) => statusMap[p.id] === 'SOLVED' || statusMap[p.id] === 'COMPLETED').length;
  const isAllSolved = solvedCount === sectionProblems.length && sectionProblems.length > 0;

  return (
    <div
      style={{
        borderRadius: '14px',
        border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#CBDDE9'}`,
        backgroundColor: isDark ? '#0E2740' : '#F8FAFC',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Section Header Accordion Trigger */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          boxSizing: 'border-box',
          backgroundColor: isDark ? 'rgba(203, 221, 233, 0.04)' : '#EFF6FB'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isExpanded ? (
            <ChevronDown size={16} style={{ color: isDark ? '#8EA6BC' : '#64748B' }} />
          ) : (
            <ChevronRight size={16} style={{ color: isDark ? '#8EA6BC' : '#64748B' }} />
          )}

          <span
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: isDark ? '#F3F7FB' : '#0D1B2A',
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            {section.title}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: isDark ? '#8EA6BC' : '#64748B',
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            {solvedCount} / {sectionProblems.length} Solved
          </span>
          {isAllSolved && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5',
                color: '#10B981',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              <CheckCircle2 size={12} />
              <span>Complete</span>
            </span>
          )}
        </div>
      </button>

      {/* Expanded Problem Rows List */}
      {isExpanded && (
        <div
          style={{
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            backgroundColor: isDark ? '#0E2740' : '#FFFFFF'
          }}
        >
          {sectionProblems.map((prob) => (
            <DsaProblemRow
              key={prob.id}
              problem={prob}
              status={statusMap[prob.id] || 'UNSOLVED'}
              isBookmarked={(bookmarks || []).includes(prob.id)}
              isRevision={(revisions || []).includes(prob.id) || prob.isRevision}
              hasNote={!!notesMap[prob.id] || prob.hasNote}
              onToggleBookmark={onToggleBookmark}
              onToggleRevision={onToggleRevision}
              onOpenNotes={onOpenNotes}
              onToggleStatus={onToggleStatus}
              onSolve={onSolve}
            />
          ))}
        </div>
      )}
    </div>
  );
}
