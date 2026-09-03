import React from 'react';
import { Search, X, Filter, Bookmark, CheckCircle2, RotateCcw, Star } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DsaFilters({
  searchQuery = '',
  setSearchQuery,
  difficultyFilter = 'ALL',
  setDifficultyFilter,
  statusFilter = 'ALL',
  setStatusFilter,
  selectedTopicId = 'ALL',
  setSelectedTopicId,
  topics = [],
  bookmarkOnly = false,
  setBookmarkOnly,
  revisionOnly = false,
  setRevisionOnly,
  onResetFilters
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const DIFFICULTIES = [
    { id: 'ALL', label: 'All Difficulties' },
    { id: 'Easy', label: 'Easy', color: '#10B981' },
    { id: 'Medium', label: 'Medium', color: '#F59E0B' },
    { id: 'Hard', label: 'Hard', color: '#EF4444' }
  ];

  const STATUSES = [
    { id: 'ALL', label: 'All Statuses' },
    { id: 'SOLVED', label: 'Solved' },
    { id: 'ATTEMPTED', label: 'Attempted' },
    { id: 'UNSOLVED', label: 'Unsolved' }
  ];

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    difficultyFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    selectedTopicId !== 'ALL' ||
    bookmarkOnly ||
    revisionOnly;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        padding: '20px 24px',
        borderRadius: '18px',
        backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
        border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
        boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.25)' : '0 2px 10px rgba(13, 27, 42, 0.03)',
        marginBottom: '24px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Row: Search Input + Topic Selector + Bookmark Toggle */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          alignItems: 'center',
          width: '100%'
        }}
      >
        {/* Search Box */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: isDark ? '#8EA6BC' : '#64748B'
            }}
          />
          <input
            type="text"
            placeholder="Search problems, topics, tags, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 36px 10px 38px',
              borderRadius: '10px',
              border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.2)' : '#CBDDE9'}`,
              backgroundColor: isDark ? '#0B1F33' : '#EFF6FB',
              color: isDark ? '#F3F7FB' : '#0D1B2A',
              fontSize: '13px',
              outline: 'none',
              fontFamily: "'Poppins', sans-serif",
              boxSizing: 'border-box'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: isDark ? '#8EA6BC' : '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Topic Selector */}
        <select
          value={selectedTopicId}
          onChange={(e) => setSelectedTopicId(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.2)' : '#CBDDE9'}`,
            backgroundColor: isDark ? '#0B1F33' : '#EFF6FB',
            color: isDark ? '#F3F7FB' : '#0D1B2A',
            fontSize: '13px',
            outline: 'none',
            fontFamily: "'Poppins', sans-serif",
            cursor: 'pointer',
            boxSizing: 'border-box'
          }}
        >
          <option value="ALL">All 18 Chapters</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.chapterNumber ? `${String(t.chapterNumber).padStart(2, '0')} - ` : ''}
              {t.title || t.name}
            </option>
          ))}
        </select>

        {/* Bookmark & Revision Quick Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              if (!bookmarkOnly && revisionOnly && setRevisionOnly) setRevisionOnly(false);
              setBookmarkOnly(!bookmarkOnly);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '10px',
              backgroundColor: bookmarkOnly
                ? (isDark ? 'rgba(245, 158, 11, 0.2)' : '#FFFBEB')
                : (isDark ? '#0B1F33' : '#EFF6FB'),
              border: `1px solid ${bookmarkOnly ? '#F59E0B' : (isDark ? 'rgba(203, 221, 233, 0.2)' : '#CBDDE9')}`,
              color: bookmarkOnly ? '#F59E0B' : (isDark ? '#8EA6BC' : '#475569'),
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: "'Poppins', sans-serif",
              flex: 1
            }}
          >
            <Bookmark size={14} fill={bookmarkOnly ? 'currentColor' : 'none'} />
            <span>Saved</span>
          </button>

          <button
            onClick={() => {
              if (!revisionOnly && bookmarkOnly) setBookmarkOnly(false);
              if (setRevisionOnly) setRevisionOnly(!revisionOnly);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '10px',
              backgroundColor: revisionOnly
                ? (isDark ? 'rgba(245, 158, 11, 0.2)' : '#FFFBEB')
                : (isDark ? '#0B1F33' : '#EFF6FB'),
              border: `1px solid ${revisionOnly ? '#F59E0B' : (isDark ? 'rgba(203, 221, 233, 0.2)' : '#CBDDE9')}`,
              color: revisionOnly ? '#F59E0B' : (isDark ? '#8EA6BC' : '#475569'),
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: "'Poppins', sans-serif",
              flex: 1
            }}
          >
            <Star size={14} fill={revisionOnly ? 'currentColor' : 'none'} />
            <span>Revision</span>
          </button>

          {/* Reset button if active */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              title="Reset all filters"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '9px 12px',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Difficulty & Status Quick Filter Pills */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          paddingTop: '8px',
          borderTop: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.1)' : '#EFF6FB'}`
        }}
      >
        {/* Difficulty Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#8EA6BC' : '#64748B', marginRight: '4px' }}>
            Difficulty:
          </span>
          {DIFFICULTIES.map((diff) => {
            const isSelected = difficultyFilter === diff.id;
            return (
              <button
                key={diff.id}
                onClick={() => setDifficultyFilter(diff.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: isSelected ? 700 : 500,
                  border: isSelected
                    ? `1.5px solid ${diff.color || '#2872A1'}`
                    : `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
                  backgroundColor: isSelected
                    ? (isDark ? 'rgba(40, 114, 161, 0.25)' : '#EFF6FB')
                    : 'transparent',
                  color: isSelected
                    ? (diff.color || '#2872A1')
                    : (isDark ? '#8EA6BC' : '#475569'),
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {diff.label}
              </button>
            );
          })}
        </div>

        {/* Status Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#8EA6BC' : '#64748B', marginRight: '4px' }}>
            Status:
          </span>
          {STATUSES.map((st) => {
            const isSelected = statusFilter === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: isSelected ? 700 : 500,
                  border: isSelected
                    ? '1.5px solid #2872A1'
                    : `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
                  backgroundColor: isSelected
                    ? (isDark ? 'rgba(40, 114, 161, 0.25)' : '#EFF6FB')
                    : 'transparent',
                  color: isSelected
                    ? '#2872A1'
                    : (isDark ? '#8EA6BC' : '#475569'),
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
