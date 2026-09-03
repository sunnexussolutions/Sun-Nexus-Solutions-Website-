import React, { useState, useEffect, useCallback } from 'react';
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
  submitDsaSolution,
  executeCode
} from '../services/dsaService';

// Subcomponents
import DsaHeader from '../components/dsa/DsaHeader';
import DsaStats from '../components/dsa/DsaStats';
import DsaContinueLearning from '../components/dsa/DsaContinueLearning';
import DsaDailyProblem from '../components/dsa/DsaDailyProblem';
import DsaStreak from '../components/dsa/DsaStreak';
import DsaFilters from '../components/dsa/DsaFilters';
import DsaRoadmap from '../components/dsa/DsaRoadmap';
import DsaProblemViewer from '../components/dsa/DsaProblemViewer';
import DsaCodeEditor from '../components/dsa/DsaCodeEditor';
import DsaSubmissionPanel from '../components/dsa/DsaSubmissionPanel';
import DsaBookmarks from '../components/dsa/DsaBookmarks';
import DsaSubmissionsList from '../components/dsa/DsaSubmissionsList';
import DsaUserDashboard from '../components/dsa/DsaUserDashboard';
import DsaNotesModal from '../components/dsa/DsaNotesModal';
import DsaSkeleton from '../components/dsa/DsaSkeleton';

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

  // View state: 'roadmap' | 'workspace' | 'bookmarks' | 'revisions' | 'submissions' | 'overview'
  const [activeView, setActiveView] = useState('roadmap');
  const [selectedProblemId, setSelectedProblemId] = useState('two-sum');

  // Modal States
  const [notesModalProblem, setNotesModalProblem] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTopicId, setSelectedTopicId] = useState('ALL');
  const [bookmarkOnly, setBookmarkOnly] = useState(false);
  const [revisionOnly, setRevisionOnly] = useState(false);

  // Code Workspace Runner States
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  // Map App.jsx `activePage` to `activeView`
  useEffect(() => {
    if (activePage === 'dsa-overview' || activePage === 'dsa-progress') {
      setActiveView('overview');
    } else if (activePage === 'dsa-bookmarks') {
      setActiveView('bookmarks');
    } else if (activePage === 'dsa-submissions') {
      setActiveView('submissions');
    } else if (activePage === 'dsa' && activeView !== 'workspace') {
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

  // Handler: Open practice link directly or open notes modal
  const handleSolveProblem = (probId) => {
    const prob = problems.find(p => p.id === probId);
    if (prob?.practiceUrl) {
      window.open(prob.practiceUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (prob) {
      setNotesModalProblem(prob);
    }
  };

  // Handler: Toggle Bookmark
  const handleToggleBookmark = async (probId) => {
    await toggleDsaBookmark(userId, probId);
    const updatedBookmarks = await getDsaBookmarks(userId);
    setBookmarkedProblems(updatedBookmarks);
    const updatedProgress = await getDsaProgress(userId);
    setProgress(updatedProgress);
  };

  // Handler: Toggle Revision Status
  const handleToggleRevision = async (probId, currentIsRevision) => {
    await toggleDsaRevision(probId, currentIsRevision);
    const updatedRevs = await getDsaRevisions();
    setRevisions(updatedRevs.map(r => r.id || r.problem_id));
    const updatedProgress = await getDsaProgress(userId);
    setProgress(updatedProgress);
  };

  // Handler: Toggle Direct Problem Solved Status
  const handleToggleStatus = async (probId, nextStatus) => {
    await markProblemStatus(userId, probId, nextStatus);
    const updatedProgress = await getDsaProgress(userId);
    setProgress(updatedProgress);
  };

  // Handler: Random Problem Picker
  const handlePickRandomProblem = async () => {
    const randomProb = await getRandomDsaProblem({
      difficulty: difficultyFilter !== 'ALL' ? difficultyFilter : null,
      topicId: selectedTopicId !== 'ALL' ? selectedTopicId : null,
      unsolvedOnly: true
    });
    if (randomProb?.id) {
      handleSolveProblem(randomProb.id);
    }
  };

  // Handler: Reset Progress
  const handleConfirmReset = async () => {
    await resetDsaProgress(selectedTopicId !== 'ALL' ? selectedTopicId : null);
    setIsResetConfirmOpen(false);
    loadData();
  };

  // Handler: Run Code in Workspace
  const handleRunCode = async (code, language) => {
    setIsRunningCode(true);
    setExecutionResult(null);
    try {
      const activeProb = problems.find(p => p.id === selectedProblemId);
      const firstExample = activeProb?.examples?.[0]?.input || '';
      const res = await executeCode(code, language, firstExample);
      setExecutionResult(res);
    } catch (err) {
      setExecutionResult({
        success: false,
        verdict: 'Runtime Error',
        error: err.message || 'Execution error occurred'
      });
    } finally {
      setIsRunningCode(false);
    }
  };

  // Handler: Submit Solution
  const handleSubmitCode = async (code, language) => {
    setIsSubmittingCode(true);
    setExecutionResult(null);
    try {
      const activeProb = problems.find(p => p.id === selectedProblemId);
      const activeChapter = chapters.find(c => c.id === activeProb?.topicId);

      const exec = await executeCode(code, language);
      setExecutionResult(exec);

      // Record solution submission
      await submitDsaSolution({
        userId,
        userName: user?.name || 'Nexus Member',
        userEmail: user?.email || '',
        problemId: selectedProblemId,
        problemTitle: activeProb?.title || 'Problem',
        difficulty: activeProb?.difficulty || 'Easy',
        topicTitle: activeChapter?.title || 'DSA',
        language,
        code,
        verdict: exec.verdict,
        runtime: exec.runtime,
        memory: exec.memory
      });

      // Reload fresh progress & submissions
      const [updatedProgress, updatedSubs] = await Promise.all([
        getDsaProgress(userId),
        getDsaSubmissions(userId)
      ]);
      setProgress(updatedProgress);
      setSubmissions(updatedSubs);
    } catch (err) {
      setExecutionResult({
        success: false,
        verdict: 'Runtime Error',
        error: err.message || 'Submission error occurred'
      });
    } finally {
      setIsSubmittingCode(false);
    }
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

  const [activeProblemDetail, setActiveProblemDetail] = useState(null);

  useEffect(() => {
    if (selectedProblemId) {
      getDsaProblem(selectedProblemId).then(detail => {
        if (detail) setActiveProblemDetail(detail);
      }).catch(() => {});
    }
  }, [selectedProblemId]);

  const baseProblem = problems.find(p => p.id === selectedProblemId) || problems[0];
  const activeProblem = activeProblemDetail && activeProblemDetail.id === selectedProblemId ? activeProblemDetail : (baseProblem || activeProblemDetail);
  const activeChapter = chapters.find(c => c.id === activeProblem?.topicId);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        boxSizing: 'border-box',
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      {/* ── Top Header & Tab Navigation ──────────────────────────────────── */}
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
      />

      {loading ? (
        <DsaSkeleton count={4} />
      ) : (
        <>
          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* 1. ROADMAP VIEW (DEFAULT)                                       */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeView === 'roadmap' && (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              {/* Learning Stats Cards */}
              <DsaStats
                totalTopics={chapters.length || 18}
                totalProblems={problems.length}
                solvedCount={progress?.totalSolved || 0}
                remainingCount={progress?.problemsRemaining || problems.length}
                progressPct={progress?.overallProgressPct || 0}
                currentStreak={progress?.streak?.currentStreak || 0}
              />

              {/* Continue Learning Banner */}
              <DsaContinueLearning
                lastActive={progress?.lastActive}
                onContinue={handleSolveProblem}
              />

              {/* Problem of the Day & Streak Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '16px'
                }}
              >
                <DsaDailyProblem
                  dailyProblem={dailyProblem}
                  isSolved={dailyProblem ? (progress?.statusMap?.[dailyProblem.id] === 'SOLVED' || progress?.statusMap?.[dailyProblem.id] === 'COMPLETED') : false}
                  onSolve={handleSolveProblem}
                />

                <DsaStreak
                  currentStreak={progress?.streak?.currentStreak || 0}
                  longestStreak={progress?.streak?.longestStreak || 0}
                  weekHistory={progress?.streak?.weekHistory || []}
                />
              </div>

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
                onResetFilters={handleResetFilters}
              />

              {/* 18-Chapter Structured Roadmap with Full Table Functionality */}
              <DsaRoadmap
                chapters={chapters}
                problems={problems}
                statusMap={progress?.statusMap || {}}
                bookmarks={progress?.bookmarks || []}
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
                onSolve={handleSolveProblem}
                onResetFilters={handleResetFilters}
              />
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
              onSolve={handleSolveProblem}
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
              onOpenProblem={handleSolveProblem}
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
    </div>
  );
}
