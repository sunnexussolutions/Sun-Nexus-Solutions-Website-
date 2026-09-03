import React, { useState } from 'react';
import {
  ChevronDown, ChevronUp, Layers, Hash, Code, Target, Link,
  RotateCcw, Cpu, Database, Zap, FolderTree, Sparkles, Network, Brain
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import DsaSectionCard from './DsaSectionCard';
import DsaProblemRow from './DsaProblemRow';

const ICON_MAP = {
  Layers, Hash, Code, Target, Link, RotateCcw,
  Cpu, Database, Zap, FolderTree, Sparkles, Network, Brain
};

export default function DsaChapterCard({
  chapter,
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
  isInitiallyExpanded = false
}) {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chapterProblems = problems.filter((p) => p.topicId === chapter.id);
  const totalInChapter = chapterProblems.length;
  const solvedInChapter = chapterProblems.filter((p) => statusMap[p.id] === 'SOLVED' || statusMap[p.id] === 'COMPLETED').length;
  const pct = totalInChapter > 0 ? Math.round((solvedInChapter / totalInChapter) * 100) : 0;

  const IconComp = ICON_MAP[chapter.icon] || Layers;
  const chapterColor = chapter.color || '#2872A1';

  // Format chapter index with leading zero (e.g. 01, 02)
  const chapterNumberStr = String(chapter.chapterNumber || chapter.order || 1).padStart(2, '0');

  return (
    <div
      style={{
        borderRadius: '18px',
        backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
        border: isExpanded
          ? `1.5px solid ${isDark ? 'rgba(74, 144, 194, 0.4)' : '#2872A1'}`
          : `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
        boxShadow: isExpanded
          ? (isDark ? '0 8px 30px rgba(0,0,0,0.35)' : '0 6px 20px rgba(40, 114, 161, 0.08)')
          : (isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 10px rgba(13, 27, 42, 0.03)'),
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Chapter Card Header / Accordion Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '20px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          boxSizing: 'border-box',
          textAlign: 'left'
        }}
      >
        {/* Left: Index + Icon + Title + Description */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '240px' }}>
          {/* Chapter Index Pill */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(40, 114, 161, 0.2)' : '#EFF6FB',
              color: isDark ? '#4A90C2' : '#2872A1',
              border: `1px solid ${isDark ? 'rgba(74, 144, 194, 0.3)' : '#CBDDE9'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '15px',
              fontFamily: "'Poppins', sans-serif",
              flexShrink: 0
            }}
          >
            {chapterNumberStr}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconComp size={17} style={{ color: chapterColor }} />
              <h3
                style={{
                  fontSize: '16.5px',
                  fontWeight: 700,
                  color: isDark ? '#F3F7FB' : '#0D1B2A',
                  margin: 0,
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                {chapter.title || chapter.name}
              </h3>
            </div>
            {chapter.subtitle && (
              <p
                style={{
                  fontSize: '12.5px',
                  color: isDark ? '#8EA6BC' : '#64748B',
                  margin: '3px 0 0 0',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                {chapter.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Progress Pill & Chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '130px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: isDark ? '#8EA6BC' : '#64748B',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                {solvedInChapter} / {totalInChapter}
              </span>
              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: 800,
                  color: '#2872A1',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                {pct}%
              </span>
            </div>

            {/* Chapter Progress Mini-bar */}
            <div
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '999px',
                backgroundColor: isDark ? 'rgba(203, 221, 233, 0.1)' : '#EFF6FB',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  borderRadius: '999px',
                  backgroundColor: chapterColor,
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: isDark ? 'rgba(203, 221, 233, 0.08)' : '#EFF6FB',
              color: isDark ? '#CBDDE9' : '#0D1B2A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </button>

      {/* Expanded Sections & Problem Rows Container */}
      {isExpanded && (
        <div
          style={{
            padding: '8px 24px 20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            borderTop: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.1)' : '#EFF6FB'}`
          }}
        >
          {/* Subtopic Sections (if defined) */}
          {Array.isArray(chapter.sections) && chapter.sections.length > 0 ? (
            chapter.sections.map((sec) => (
              <DsaSectionCard
                key={sec.id}
                section={sec}
                problems={chapterProblems}
                statusMap={statusMap}
                bookmarks={bookmarks}
                revisions={revisions}
                notesMap={notesMap}
                onToggleBookmark={onToggleBookmark}
                onToggleRevision={onToggleRevision}
                onOpenNotes={onOpenNotes}
                onToggleStatus={onToggleStatus}
                onSolve={onSolve}
              />
            ))
          ) : (
            /* Direct problem rows fallback if no sections */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chapterProblems.map((prob) => (
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

          {chapterProblems.length === 0 && (
            <div
              style={{
                padding: '16px',
                textAlign: 'center',
                color: isDark ? '#8EA6BC' : '#64748B',
                fontSize: '13px',
                fontStyle: 'italic'
              }}
            >
              Additional practice problems coming soon to this chapter!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
