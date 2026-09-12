import React from 'react';
import {
  Search, X, Filter, Bookmark, Star, Dices, RotateCcw, ListFilter, CheckCircle2, CircleDot
} from 'lucide-react';
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
  onPickRandom,
  onResetFilters,
  totalMatching = 0,
  revisionsCount = 0,
  bookmarksCount = 0
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const DIFFICULTIES = [
    { id: 'ALL', label: 'All Difficulties' },
    { id: 'Easy', label: 'Easy', color: '#10B981' },
    { id: 'Medium', label: 'Medium', color: '#F59E0B' },
    { id: 'Hard', label: 'Hard', color: '#EF4444' }
  ];

  const STATUS_OPTIONS = [
    { id: 'ALL', label: 'All Problems' },
    { id: 'SOLVED', label: 'Solved' },
    { id: 'UNSOLVED', label: 'Unsolved' },
    { id: 'REVISION', label: 'Revision' },
    { id: 'BOOKMARKED', label: 'Bookmarked' }
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
      className="dsa-filters-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        padding: '18px 22px',
        borderRadius: '18px',
        backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
        border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
        boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.25)' : '0 2px 10px rgba(13, 27, 42, 0.03)',
        marginBottom: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* ── Top Toolbar Row: All Problems | Revision | Bookmarked Pills + Random Problem ── */}
      <div
        className="dsa-filters-top-row"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        {/* Filter Pills */}
        <div className="dsa-filters-pills-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* All Problems Pill */}
          <button
            onClick={() => {
              setBookmarkOnly(false);
              setRevisionOnly(false);
              setStatusFilter('ALL');
            }}
            className="dsa-filters-pill-btn"
            style={{
              padding: '7px 16px',
              borderRadius: '999px',
              fontSize: '12.5px',
              fontWeight: (!bookmarkOnly && !revisionOnly && statusFilter === 'ALL') ? 700 : 500,
              backgroundColor: (!bookmarkOnly && !revisionOnly && statusFilter === 'ALL')
                ? '#2872A1'
                : (isDark ? '#0B1F33' : '#EFF6FB'),
              color: (!bookmarkOnly && !revisionOnly && statusFilter === 'ALL')
                ? '#FFFFFF'
                : (isDark ? '#CBDDE9' : '#475569'),
              border: `1px solid ${(!bookmarkOnly && !revisionOnly && statusFilter === 'ALL') ? '#2872A1' : (isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9')}`,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            All Problems
          </button>

          {/* Revision Pill */}
          <button
            onClick={() => {
              setBookmarkOnly(false);
              setRevisionOnly(!revisionOnly);
              if (!revisionOnly) setStatusFilter('ALL');
            }}
            className="dsa-filters-pill-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '999px',
              fontSize: '12.5px',
              fontWeight: (revisionOnly || statusFilter === 'REVISION') ? 700 : 500,
              backgroundColor: (revisionOnly || statusFilter === 'REVISION')
                ? (isDark ? 'rgba(245, 158, 11, 0.25)' : '#FEF3C7')
                : (isDark ? '#0B1F33' : '#EFF6FB'),
              color: (revisionOnly || statusFilter === 'REVISION')
                ? '#D97706'
                : (isDark ? '#CBDDE9' : '#475569'),
              border: `1px solid ${(revisionOnly || statusFilter === 'REVISION') ? '#F59E0B' : (isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9')}`,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Star size={13} fill={(revisionOnly || statusFilter === 'REVISION') ? 'currentColor' : 'none'} />
            <span>Revision</span>
            {revisionsCount > 0 && (
              <span
                style={{
                  padding: '1px 6px',
                  borderRadius: '999px',
                  backgroundColor: '#F59E0B',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 800
                }}
              >
                {revisionsCount}
              </span>
            )}
          </button>

          {/* Bookmarked Pill */}
          <button
            onClick={() => {
              setRevisionOnly(false);
              setBookmarkOnly(!bookmarkOnly);
              if (!bookmarkOnly) setStatusFilter('ALL');
            }}
            className="dsa-filters-pill-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '999px',
              fontSize: '12.5px',
              fontWeight: (bookmarkOnly || statusFilter === 'BOOKMARKED') ? 700 : 500,
              backgroundColor: (bookmarkOnly || statusFilter === 'BOOKMARKED')
                ? (isDark ? 'rgba(40, 114, 161, 0.25)' : '#EFF6FB')
                : (isDark ? '#0B1F33' : '#EFF6FB'),
              color: (bookmarkOnly || statusFilter === 'BOOKMARKED')
                ? '#2872A1'
                : (isDark ? '#CBDDE9' : '#475569'),
              border: `1px solid ${(bookmarkOnly || statusFilter === 'BOOKMARKED') ? '#2872A1' : (isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9')}`,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Bookmark size={13} fill={(bookmarkOnly || statusFilter === 'BOOKMARKED') ? 'currentColor' : 'none'} />
            <span>Bookmarked</span>
            {bookmarksCount > 0 && (
              <span
                style={{
                  padding: '1px 6px',
                  borderRadius: '999px',
                  backgroundColor: '#2872A1',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 800
                }}
              >
                {bookmarksCount}
              </span>
            )}
          </button>
        </div>

        {/* Random Problem Action Button */}
        {onPickRandom && (
          <button
            onClick={onPickRandom}
            className="dsa-random-prob-btn"
            title="Pick a random matching problem"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 16px',
              borderRadius: '10px',
              backgroundColor: isDark ? 'rgba(40, 114, 161, 0.2)' : '#EFF6FB',
              color: isDark ? '#4A90C2' : '#2872A1',
              border: `1px solid ${isDark ? 'rgba(74, 144, 194, 0.3)' : '#CBDDE9'}`,
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Dices size={15} />
            <span>Random Problem</span>
          </button>
        )}
      </div>

      {/* ── Search & Filter Selectors Row ── */}
      <div
        className="dsa-filters-dropdowns-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          alignItems: 'center',
          width: '100%'
        }}
      >
        {/* Search Box */}
        <div className="dsa-filters-search-col" style={{ position: 'relative', width: '100%' }}>
          <Search
            size={15}
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
            placeholder="Search problems, patterns, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 34px 9px 36px',
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

        {/* Problem Status Filter Dropdown */}
        <div className="dsa-filters-status-col" style={{ width: '100%' }}>
          <select
            value={statusFilter}
            onChange={(e) => {
              const val = e.target.value;
              setStatusFilter(val);
              if (val === 'REVISION') {
                setRevisionOnly(true);
                setBookmarkOnly(false);
              } else if (val === 'BOOKMARKED') {
                setBookmarkOnly(true);
                setRevisionOnly(false);
              } else {
                setBookmarkOnly(false);
                setRevisionOnly(false);
              }
            }}
            style={{
              width: '100%',
              padding: '9px 12px',
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
            {STATUS_OPTIONS.map((st) => (
              <option key={st.id} value={st.id}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter Dropdown */}
        <div className="dsa-filters-diff-col" style={{ width: '100%' }}>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
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
            {DIFFICULTIES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Topic Selector */}
        <div className="dsa-filters-topic-col" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
          <select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '10px',
              border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.2)' : '#CBDDE9'}`,
              backgroundColor: isDark ? '#0B1F33' : '#EFF6FB',
              color: isDark ? '#F3F7FB' : '#0D1B2A',
              fontSize: '13px',
              outline: 'none',
              fontFamily: "'Poppins', sans-serif",
              cursor: 'pointer',
              boxSizing: 'border-box',
              flex: 1
            }}
          >
            <option value="ALL">All 18 Topics</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.chapterNumber ? `${String(t.chapterNumber).padStart(2, '0')} - ` : ''}
                {t.title || t.name}
              </option>
            ))}
          </select>

          {/* Reset Filters Icon Button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              title="Clear all filters"
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
    </div>
  );
}
