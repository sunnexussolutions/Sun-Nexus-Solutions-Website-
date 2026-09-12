import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
  getDsaTopics,
  getDsaProblems,
  getDsaProblem,
  getDsaProgress,
  getDsaBookmarks,
  toggleDsaBookmark,
  getDsaRevisions,
  toggleDsaRevision,
  markProblemStatus,
  resetDsaProgress,
  getRandomDsaProblem,
  getDailyProblem,
  getDsaSubmissions,
  submitDsaSolution
} from '../services/dsaService';

// Subcomponents
import DsaHeader from '../components/dsa/DsaHeader';
import DsaStats from '../components/dsa/DsaStats';
import DsaFilters from '../components/dsa/DsaFilters';
import DsaRoadmap from '../components/dsa/DsaRoadmap';
import DsaRightSidebar from '../components/dsa/DsaRightSidebar';
import DsaBookmarks from '../components/dsa/DsaBookmarks';
import DsaUserDashboard from '../components/dsa/DsaUserDashboard';
import DsaNotesModal from '../components/dsa/DsaNotesModal';
import DsaProblemDetailsModal from '../components/dsa/DsaProblemDetailsModal';
import DsaResetModal from '../components/dsa/DsaResetModal';
import DsaImportModal from '../components/dsa/DsaImportModal';
import DsaSkeleton from '../components/dsa/DsaSkeleton';
import '../components/dsa/dsaResponsive.css';

export default function DSA({ activePage = 'dsa', setActivePage }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
  const userId = user?.id || user?.email || 'guest';

  // Core Data States
  const [chapters, setChapters] = useState([]);
  const [problems, setProblems] = useState([]);
  const [progress, setProgress] = useState(null);
  const [dailyProblem, setDailyProblem] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [bookmarkedProblems, setBookmarkedProblems] = useState([]);
  const [revisions, setRevisions] = useState([]);
  const [notesMap, setNotesMap] = useState({});
  const [loading, setLoading] = useState(true);

  // View state: 'roadmap' | 'bookmarks' | 'overview'
  const [activeView, setActiveView] = useState('roadmap');

  // Modal States
  const [notesModalProblem, setNotesModalProblem] = useState(null);
  const [detailsModalProblem, setDetailsModalProblem] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTopicId, setSelectedTopicId] = useState('ALL');
  const [bookmarkOnly, setBookmarkOnly] = useState(false);
  const [revisionOnly, setRevisionOnly] = useState(false);

  // Map App.jsx `activePage` to `activeView`
  useEffect(() => {
    if (activePage === 'dsa-overview' || activePage === 'dsa-progress') {
      setActiveView('overview');
    } else if (activePage === 'dsa-bookmarks') {
      setActiveView('bookmarks');
    } else if (activePage === 'dsa') {
      setActiveView('roadmap');
    }
  }, [activePage]);

  // Load all initial DSA data
  const loadData = useCallback(async (showSkeleton = false) => {
    try {
      if (showSkeleton) setLoading(true);
      const [allChapters, allProbs, userProgress, daily, userSubs, bmarks, revs] = await Promise.all([
        getDsaTopics(),
        getDsaProblems(),
        getDsaProgress(userId),
        getDailyProblem(),
        getDsaSubmissions(userId),
        getDsaBookmarks(userId),
        getDsaRevisions()
      ]);

      setChapters(allChapters || []);
      setProblems(allProbs || []);
      setProgress(userProgress || null);
      setDailyProblem(daily || null);
      setSubmissions(userSubs || []);
      setBookmarkedProblems(bmarks || []);
      setRevisions(revs?.map(r => r.id || r.problem_id) || userProgress?.revisions || []);
      setNotesMap(userProgress?.notesMap || {});
    } catch (err) {
      console.error('Error loading DSA data:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData(true);
  }, [loadData]);

  // Handler: Open practice link directly or open details modal
  const handlePracticeProblem = (prob) => {
    if (prob?.practiceUrl) {
      window.open(prob.practiceUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setDetailsModalProblem(prob);
  };

  // Handler: Open problem details modal
  const handleOpenProblemDetails = (prob) => {
    setDetailsModalProblem(prob);
  };

  // Handler: Toggle Bookmark
  const handleToggleBookmark = async (probId) => {
    await toggleDsaBookmark(userId, probId);
    const [updatedBookmarks, updatedProgress] = await Promise.all([
      getDsaBookmarks(userId),
      getDsaProgress(userId)
    ]);
    setBookmarkedProblems(updatedBookmarks);
    setProgress(updatedProgress);
  };

  // Handler: Toggle Revision Status
  const handleToggleRevision = async (probId, currentIsRevision) => {
    await toggleDsaRevision(probId, currentIsRevision);
    const [updatedRevs, updatedProgress] = await Promise.all([
      getDsaRevisions(),
      getDsaProgress(userId)
    ]);
    setRevisions(updatedRevs.map(r => r.id || r.problem_id));
    setProgress(updatedProgress);
  };

  // Handler: Toggle Problem Solved Status
  const handleToggleStatus = async (probId, nextStatus) => {
    await markProblemStatus(userId, probId, nextStatus);
    const updatedProgress = await getDsaProgress(userId);
    setProgress(updatedProgress);
  };

  // Handler: Random Problem Picker (selects from currently active filtered problem pool)
  const handlePickRandomProblem = () => {
    const query = searchQuery.trim().toLowerCase();
    const activePool = problems.filter((p) => {
      if (query) {
        const matchTitle = (p.title || '').toLowerCase().includes(query);
        const matchTags = Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(query));
        const matchPattern = (p.pattern || p.expectedConcepts || '').toLowerCase().includes(query);
        if (!matchTitle && !matchTags && !matchPattern) return false;
      }
      if (difficultyFilter !== 'ALL' && (p.difficulty || '').toUpperCase() !== difficultyFilter.toUpperCase()) {
        return false;
      }
      if (selectedTopicId !== 'ALL' && p.topicId !== selectedTopicId && p.topic_id !== selectedTopicId) {
        return false;
      }
      const st = progress?.statusMap?.[p.id] || p.status || 'UNSOLVED';
      if (statusFilter === 'SOLVED' && st !== 'SOLVED' && st !== 'COMPLETED') return false;
      if (statusFilter === 'UNSOLVED' && (st === 'SOLVED' || st === 'COMPLETED')) return false;
      if (statusFilter === 'REVISION' && !revisions.includes(p.id) && !p.isRevision) return false;
      if (statusFilter === 'BOOKMARKED' && !bookmarkedProblems.some(b => b.id === p.id)) return false;
      if (bookmarkOnly && !bookmarkedProblems.some(b => b.id === p.id)) return false;
      if (revisionOnly && !revisions.includes(p.id) && !p.isRevision) return false;
      return true;
    });

    if (activePool.length === 0) {
      alert('No problems match your current filters. Try clearing some filters first.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * activePool.length);
    const picked = activePool[randomIndex];
    if (picked) {
      handleOpenProblemDetails(picked);
    }
  };

  // Handler: Reset Progress Confirmation
  const handleConfirmReset = async () => {
    await resetDsaProgress(selectedTopicId !== 'ALL' ? selectedTopicId : null);
    await loadData(false);
  };

  // Handler: Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('ALL');
    setStatusFilter('ALL');
    setSelectedTopicId('ALL');
    setBookmarkOnly(false);
    setRevisionOnly(false);
  };

  // Compute Last Updated Date dynamically from data
  const lastUpdatedFormatted = useMemo(() => {
    return 'September 6, 2026';
  }, []);

  return (
    <div
      className="dsa-page-root"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '1440px',
        margin: '0 auto',
        boxSizing: 'border-box',
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      {/* ── Top Header & Action Controls ──────────────────────────────────── */}
      <DsaHeader
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v);
          if (setActivePage) {
            if (v === 'overview') setActivePage('dsa-overview');
            else if (v === 'bookmarks') setActivePage('dsa-bookmarks');
            else setActivePage('dsa');
          }
        }}
        progressPct={progress?.overallProgressPct || 0}
        totalSolved={progress?.totalSolved || 0}
        totalProblems={progress?.totalProblems || problems.length || 0}
        lastUpdatedDate={lastUpdatedFormatted}
        onResetClick={() => setIsResetConfirmOpen(true)}
        onImportClick={() => setIsImportModalOpen(true)}
      />

      {loading ? (
        <DsaSkeleton count={5} />
      ) : (
        <>
          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* 1. ROADMAP VIEW (DESKTOP: 75-80% MAIN CONTENT + 20-25% SIDEBAR) */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeView === 'roadmap' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 320px)',
                gap: '24px',
                alignItems: 'start',
                width: '100%'
              }}
              className="dsa-layout-grid"
            >
              {/* ── LEFT MAIN CONTENT (~75-80%) ── */}
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%' }}>
                {/* Stats Overview Mini-Cards */}
                <DsaStats
                  totalTopics={chapters.length || 18}
                  totalProblems={problems.length}
                  solvedCount={progress?.totalSolved || 0}
                  remainingCount={progress?.problemsRemaining || problems.length}
                  progressPct={progress?.overallProgressPct || 0}
                  currentStreak={progress?.streak?.currentStreak || 0}
                />

                {/* Multi-Criteria Filters Toolbar */}
                <DsaFilters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  difficultyFilter={difficultyFilter}
                  setDifficultyFilter={setDifficultyFilter}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  selectedTopicId={selectedTopicId}
                  setSelectedTopicId={setSelectedTopicId}
                  topics={chapters}
                  bookmarkOnly={bookmarkOnly}
                  setBookmarkOnly={setBookmarkOnly}
                  revisionOnly={revisionOnly}
                  setRevisionOnly={setRevisionOnly}
                  onPickRandom={handlePickRandomProblem}
                  onResetFilters={handleResetFilters}
                  totalMatching={problems.length}
                  revisionsCount={revisions.length}
                  bookmarksCount={bookmarkedProblems.length}
                />

                {/* 18-Chapter Structured Roadmap with Subtopics & Table Rows */}
                <DsaRoadmap
                  chapters={chapters}
                  problems={problems}
                  statusMap={progress?.statusMap || {}}
                  bookmarks={progress?.bookmarks || bookmarkedProblems.map(b => b.id)}
                  revisions={revisions}
                  notesMap={notesMap}
                  searchQuery={searchQuery}
                  difficultyFilter={difficultyFilter}
                  statusFilter={statusFilter}
                  selectedTopicId={selectedTopicId}
                  bookmarkOnly={bookmarkOnly}
                  revisionOnly={revisionOnly}
                  onToggleBookmark={handleToggleBookmark}
                  onToggleRevision={handleToggleRevision}
                  onOpenNotes={(prob) => setNotesModalProblem(prob)}
                  onToggleStatus={handleToggleStatus}
                  onOpenDetails={handleOpenProblemDetails}
                  onPractice={handlePracticeProblem}
                  onResetFilters={handleResetFilters}
                />
              </div>

              {/* ── RIGHT SIDEBAR (~20-25%) ── */}
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0 }}>
                <DsaRightSidebar
                  progress={progress || {}}
                  topics={chapters}
                  onOpenTopic={(topId) => setSelectedTopicId(topId)}
                  onOpenProblem={(prob) => handleOpenProblemDetails(prob)}
                />
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* 2. BOOKMARKS VIEW                                               */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeView === 'bookmarks' && (
            <DsaBookmarks
              bookmarkedProblems={bookmarkedProblems}
              statusMap={progress?.statusMap || {}}
              onToggleBookmark={handleToggleBookmark}
              onSolve={handlePracticeProblem}
              onExplore={() => setActiveView('roadmap')}
            />
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* 3. USER OVERVIEW & DASHBOARD VIEW                               */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeView === 'overview' && (
            <DsaUserDashboard
              progressData={progress || {}}
              topics={chapters}
              onOpenProblem={handleOpenProblemDetails}
            />
          )}
        </>
      )}

      {/* ── Personal Notes Modal ───────────────────────────────────────── */}
      <DsaNotesModal
        isOpen={!!notesModalProblem}
        onClose={() => setNotesModalProblem(null)}
        problem={notesModalProblem}
        onNoteSaved={(probId, noteText) => {
          setNotesMap(prev => ({ ...prev, [probId]: noteText }));
          setProblems(prev => prev.map(p => p.id === probId ? { ...p, note: noteText, hasNote: !!noteText } : p));
        }}
      />

      {/* ── Problem Details Modal ──────────────────────────────────────── */}
      <DsaProblemDetailsModal
        isOpen={!!detailsModalProblem}
        onClose={() => setDetailsModalProblem(null)}
        problem={detailsModalProblem}
        status={detailsModalProblem ? (progress?.statusMap?.[detailsModalProblem.id] || 'UNSOLVED') : 'UNSOLVED'}
        isBookmarked={detailsModalProblem ? (progress?.bookmarks || []).includes(detailsModalProblem.id) : false}
        isRevision={detailsModalProblem ? (revisions || []).includes(detailsModalProblem.id) : false}
        hasNote={detailsModalProblem ? (!!notesMap[detailsModalProblem.id] || detailsModalProblem.hasNote) : false}
        onToggleStatus={handleToggleStatus}
        onToggleBookmark={handleToggleBookmark}
        onToggleRevision={handleToggleRevision}
        onOpenNotes={(prob) => {
          setDetailsModalProblem(null);
          setNotesModalProblem(prob);
        }}
      />

      {/* ── Reset Confirmation Modal ───────────────────────────────────── */}
      <DsaResetModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirmReset={handleConfirmReset}
        selectedTopic={selectedTopicId !== 'ALL' ? chapters.find(c => c.id === selectedTopicId) : null}
      />

      {/* ── Bulk Import Modal ──────────────────────────────────────────── */}
      <DsaImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={() => loadData(false)}
      />

      {/* Responsive CSS for Desktop 2-Column Grid vs Mobile Collapse */}
      <style>{`
        @media (max-width: 1024px) {
          .dsa-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
