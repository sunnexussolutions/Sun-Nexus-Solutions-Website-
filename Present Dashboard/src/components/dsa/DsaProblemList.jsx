import React from 'react';
import DsaProblemRow from './DsaProblemRow';
import DsaEmptyState from './DsaEmptyState';

export default function DsaProblemList({
  problems = [],
  statusMap = {},
  bookmarks = [],
  onToggleBookmark,
  onSolve,
  onResetFilters
}) {
  if (!problems || problems.length === 0) {
    return (
      <DsaEmptyState
        title="No problems found"
        description="Try adjusting your search query, filter criteria, or selected topic to find matching problems."
        actionLabel="Reset Filters"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      {problems.map((p) => (
        <DsaProblemRow
          key={p.id}
          problem={p}
          status={statusMap[p.id] || 'UNSOLVED'}
          isBookmarked={(bookmarks || []).includes(p.id)}
          onToggleBookmark={onToggleBookmark}
          onSolve={onSolve}
        />
      ))}
    </div>
  );
}
