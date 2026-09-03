import React, { useState } from 'react';
import { Bookmark, Search, ArrowRight, Trash2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import DsaProblemRow from './DsaProblemRow';
import DsaEmptyState from './DsaEmptyState';

export default function DsaBookmarks({
  bookmarkedProblems = [],
  statusMap = {},
  onToggleBookmark,
  onSolve,
  onExplore
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const filtered = bookmarkedProblems.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.title || '').toLowerCase().includes(q) ||
      (p.difficulty || '').toLowerCase().includes(q) ||
      (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  });

  if (bookmarkedProblems.length === 0) {
    return (
      <DsaEmptyState
        title="No bookmarked problems yet"
        description="You haven't bookmarked any problems. Click the star/bookmark icon on any problem row to save it for quick revision."
        actionLabel="Explore Roadmap"
        onAction={onExplore}
        icon={Bookmark}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          padding: '16px 20px',
          borderRadius: '16px',
          backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
          border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bookmark size={20} fill="#F59E0B" color="#F59E0B" />
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: isDark ? '#F3F7FB' : '#0D1B2A',
              margin: 0,
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            Saved Bookmarks ({bookmarkedProblems.length})
          </h3>
        </div>

        {/* Search inside bookmarks */}
        <div style={{ position: 'relative', width: '260px' }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: isDark ? '#8EA6BC' : '#64748B'
            }}
          />
          <input
            type="text"
            placeholder="Search saved problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '8px',
              border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.2)' : '#CBDDE9'}`,
              backgroundColor: isDark ? '#0B1F33' : '#EFF6FB',
              color: isDark ? '#F3F7FB' : '#0D1B2A',
              fontSize: '12.5px',
              outline: 'none',
              fontFamily: "'Poppins', sans-serif",
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Bookmarked list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(p => (
          <DsaProblemRow
            key={p.id}
            problem={p}
            status={statusMap[p.id] || 'UNSOLVED'}
            isBookmarked={true}
            onToggleBookmark={onToggleBookmark}
            onSolve={onSolve}
          />
        ))}
        {filtered.length === 0 && (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              color: isDark ? '#8EA6BC' : '#64748B',
              fontSize: '13px'
            }}
          >
            No bookmarked problems match "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
}
