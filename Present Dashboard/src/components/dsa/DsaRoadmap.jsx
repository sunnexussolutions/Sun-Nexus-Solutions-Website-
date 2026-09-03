import React from 'react';
import DsaChapterCard from './DsaChapterCard';
import DsaEmptyState from './DsaEmptyState';

export default function DsaRoadmap({
  chapters = [],
  problems = [],
  statusMap = {},
  bookmarks = [],
  revisions = [],
  notesMap = {},
  searchQuery = '',
  difficultyFilter = 'ALL',
  statusFilter = 'ALL',
  selectedTopicId = 'ALL',
  bookmarkOnly = false,
  revisionOnly = false,
  onToggleBookmark,
  onToggleRevision,
  onOpenNotes,
  onToggleStatus,
  onSolve,
  onResetFilters
}) {
  // Apply multi-criteria filtering
  const query = searchQuery.trim().toLowerCase();

  const filteredProblems = problems.filter((p) => {
    // Search query
    if (query) {
      const matchTitle = (p.title || '').toLowerCase().includes(query);
      const matchTags = Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(query));
      const matchComp = Array.isArray(p.companies) && p.companies.some(c => c.toLowerCase().includes(query));
      const matchId = String(p.id || '').toLowerCase().includes(query);
      const matchNumber = String(p.number || '') === query;
      if (!matchTitle && !matchTags && !matchComp && !matchId && !matchNumber) return false;
    }

    // Difficulty filter
    if (difficultyFilter !== 'ALL' && (p.difficulty || '').toUpperCase() !== difficultyFilter.toUpperCase()) {
      return false;
    }

    // Status filter
    const status = statusMap[p.id] || p.status || 'UNSOLVED';
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'REVISION') {
        if (!revisions.includes(p.id) && !p.isRevision) return false;
      } else if (statusFilter === 'SOLVED' || statusFilter === 'COMPLETED') {
        if (status !== 'SOLVED' && status !== 'COMPLETED') return false;
      } else if (statusFilter === 'ATTEMPTED' || statusFilter === 'IN_PROGRESS') {
        if (status !== 'ATTEMPTED' && status !== 'IN_PROGRESS') return false;
      } else if (statusFilter === 'UNSOLVED' || statusFilter === 'NOT_STARTED') {
        if (status !== 'UNSOLVED' && status !== 'NOT_STARTED') return false;
      }
    }

    // Topic selector
    if (selectedTopicId !== 'ALL' && p.topicId !== selectedTopicId) {
      return false;
    }

    // Bookmarked filter
    if (bookmarkOnly && !bookmarks.includes(p.id)) {
      return false;
    }

    // Revision filter
    if (revisionOnly && !revisions.includes(p.id) && !p.isRevision) {
      return false;
    }

    return true;
  });

  // Filter chapters: keep chapters that match topic selector and contain matching problems
  const visibleChapters = chapters.filter((ch) => {
    if (selectedTopicId !== 'ALL' && ch.id !== selectedTopicId) {
      return false;
    }
    const hasFilter = query || difficultyFilter !== 'ALL' || statusFilter !== 'ALL' || bookmarkOnly || revisionOnly;
    if (hasFilter) {
      return filteredProblems.some(p => p.topicId === ch.id);
    }
    return true;
  });

  if (visibleChapters.length === 0 || (filteredProblems.length === 0 && (query || difficultyFilter !== 'ALL' || statusFilter !== 'ALL' || bookmarkOnly || revisionOnly))) {
    return (
      <DsaEmptyState
        title="No problems match your filters"
        description="Try clearing your search or switching filter categories to explore more DSA problems."
        actionLabel="Reset All Filters"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {visibleChapters.map((ch, idx) => (
        <DsaChapterCard
          key={ch.id}
          chapter={ch}
          problems={filteredProblems}
          statusMap={statusMap}
          bookmarks={bookmarks}
          revisions={revisions}
          notesMap={notesMap}
          onToggleBookmark={onToggleBookmark}
          onToggleRevision={onToggleRevision}
          onOpenNotes={onOpenNotes}
          onToggleStatus={onToggleStatus}
          onSolve={onSolve}
          isInitiallyExpanded={idx === 0 || visibleChapters.length <= 2}
        />
      ))}
    </div>
  );
}
