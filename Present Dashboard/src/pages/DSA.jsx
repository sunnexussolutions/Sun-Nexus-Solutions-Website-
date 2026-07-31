import React, { useState, useEffect } from 'react';
import {
  Brain, BookOpen, Lightbulb, CheckCircle2, Flame,
  Bookmark, Share2, ChevronDown, ChevronUp, UploadCloud,
  X, RotateCcw, ArrowRight, ArrowLeft, Shield, Layers,
  Code, Link, Database, FolderTree, Network, Cpu,
  HelpCircle, MessageSquare, Clock, Target, Check, Sparkles,
  ChevronRight, Home, GraduationCap, User, Eye, FileText, Edit3, Trash2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getDSATopics, getDSAProblems, DEFAULT_DSA_TOPICS, DEFAULT_DSA_PROBLEMS, addDSASolution, getDSASolutions, updateDSASolution, deleteDSASolution } from '../store/dataStore';

const formatInlineText = (str, isDark) => {
  if (!str) return '';
  const parts = str.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const codeVal = part.slice(1, -1);
      const isComplexity = /^O\([^\)]+\)$/i.test(codeVal);
      return (
        <code
          key={i}
          style={{
            padding: '2px 7px',
            borderRadius: '6px',
            backgroundColor: isComplexity
              ? (isDark ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7')
              : (isDark ? 'rgba(123, 92, 255, 0.2)' : '#e0e7ff'),
            color: isComplexity
              ? (isDark ? '#fcd34d' : '#b45309')
              : (isDark ? '#c084fc' : '#4f46e5'),
            fontFamily: 'monospace',
            fontSize: '12px',
            fontWeight: 800,
            border: `1px solid ${isComplexity ? (isDark ? 'rgba(245, 158, 11, 0.3)' : '#fde68a') : (isDark ? 'rgba(123, 92, 255, 0.3)' : '#c7d2fe')}`
          }}
        >
          {codeVal}
        </code>
      );
    }
    return part;
  });
};

const renderTutorialContent = (text, isDark) => {
  if (!text || !text.trim()) return null;

  const blocks = text.split(/\n\s*\n/).filter(b => b.trim().length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
      {blocks.map((block, bIdx) => {
        const lines = block.trim().split('\n');
        const firstLine = lines[0].trim();

        // 1. Code Block (```...```)
        if (block.includes('```')) {
          const cleanCode = block.replace(/```[a-z]*/g, '').trim();
          return (
            <div
              key={bIdx}
              style={{
                backgroundColor: isDark ? '#090b14' : '#1e1e2e',
                borderRadius: '16px',
                padding: '16px 20px',
                border: `1px solid ${isDark ? 'rgba(123, 92, 255, 0.25)' : '#313244'}`,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#cdd6f4',
                overflowX: 'auto',
                lineHeight: 1.65
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', fontWeight: 800, color: '#a6adc8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <span>Code Snippet</span>
                <span style={{ color: '#c084fc' }}>Optimal</span>
              </div>
              <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>{cleanCode}</pre>
            </div>
          );
        }

        // 2. Section Header or Step Block
        const isHeader = /^#+\s/.test(firstLine) || /^(step\s*\d+|approach|intuition|algorithm|complexity|key\s*takeaway):?/i.test(firstLine);
        if (isHeader) {
          const headerText = firstLine.replace(/^#+\s*/, '').replace(/:$/, '');
          const bodyLines = lines.slice(1);
          return (
            <div
              key={bIdx}
              style={{
                padding: '16px 20px',
                borderRadius: '18px',
                backgroundColor: isDark ? 'rgba(123, 92, 255, 0.08)' : '#f5f3ff',
                border: `1px solid ${isDark ? 'rgba(123, 92, 255, 0.2)' : '#ede9fe'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{
                fontSize: '14px',
                fontWeight: 900,
                color: isDark ? '#c084fc' : '#7b5cff',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '8px', backgroundColor: isDark ? 'rgba(123, 92, 255, 0.25)' : '#ede9fe', color: '#7b5cff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900 }}>
                  <Sparkles size={13} />
                </div>
                <span>{headerText}</span>
              </div>
              {bodyLines.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: isDark ? '#cbd5e1' : '#475569', lineHeight: 1.65 }}>
                  {bodyLines.map((line, lIdx) => (
                    <div key={lIdx}>{formatInlineText(line, isDark)}</div>
                  ))}
                </div>
              )}
            </div>
          );
        }

        // 3. Bullet/Numbered List Block
        const isList = lines.every(l => /^[\-\*\d\.]+\s/.test(l.trim()));
        if (isList) {
          return (
            <div key={bIdx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lines.map((line, lIdx) => {
                const cleanLine = line.replace(/^[\-\*\d\.]+\s*/, '');
                return (
                  <div
                    key={lIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      backgroundColor: isDark ? '#0d0f1a' : '#f8fafc',
                      border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`
                    }}
                  >
                    <div style={{
                      minWidth: '22px',
                      height: '22px',
                      borderRadius: '8px',
                      backgroundColor: isDark ? 'rgba(123, 92, 255, 0.2)' : '#ede9fe',
                      color: '#7b5cff',
                      fontSize: '11px',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '1px'
                    }}>
                      {lIdx + 1}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: isDark ? '#cbd5e1' : '#475569', lineHeight: 1.6 }}>
                      {formatInlineText(cleanLine, isDark)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        // 4. Standard Paragraph Block
        return (
          <div
            key={bIdx}
            style={{
              padding: '14px 18px',
              borderRadius: '14px',
              backgroundColor: isDark ? '#0d0f1a' : '#f8fafc',
              border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.12)' : '#e2e8f0'}`,
              fontSize: '13px',
              fontWeight: 500,
              color: isDark ? '#cbd5e1' : '#475569',
              lineHeight: 1.7
            }}
          >
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {formatInlineText(line, isDark)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default function DSA({ activePage = 'dsa', setActivePage }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  // Desktop/Mobile view modes: 'workspace' (3-column layout), 'overview', 'solve'
  const [viewMode, setViewMode] = useState(() => {
    if (activePage === 'dsa-overview') return 'overview';
    if (activePage === 'dsa-progress') return 'solve';
    return 'workspace';
  });

  useEffect(() => {
    if (activePage === 'dsa-overview') setViewMode('overview');
    else if (activePage === 'dsa-progress') setViewMode('solve');
    else if (activePage === 'dsa' || activePage === 'dsa-bookmarks') setViewMode('workspace');
  }, [activePage]);

  // Accordions & Tab States
  const [hintsExpanded, setHintsExpanded] = useState(false);
  const [complexityExpanded, setComplexityExpanded] = useState(false);
  const [activeTutorialTab, setActiveTutorialTab] = useState('tutorial');
  const [selectedTopic, setSelectedTopic] = useState(null);  // null = load from store default
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [submissionNotes, setSubmissionNotes] = useState('');

  // My Submissions State & Handlers
  const [submissionFilter, setSubmissionFilter] = useState('ALL');
  const [previewModalImage, setPreviewModalImage] = useState(null);
  const [mySubmissions, setMySubmissions] = useState([]);

  // Edit Submission State
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editImage, setEditImage] = useState(null);

  const handleStartEdit = (sub) => {
    setEditingSubmission(sub);
    setEditNotes(sub.notes || sub.solutionNotes || '');
    setEditImage(sub.imageData || null);
  };

  const handleSaveEditSubmission = async () => {
    if (!editingSubmission) return;
    await updateDSASolution(editingSubmission.id, {
      imageData: editImage,
      notes: editNotes,
      solutionNotes: editNotes,
      status: 'pending'
    });
    const all = await getDSASolutions() || [];
    const uEmail = user?.email?.toLowerCase();
    const uId = user?.id;
    const matched = all.filter(s =>
      (uEmail && s.memberEmail?.toLowerCase() === uEmail) || (uId && s.memberId === uId)
    );
    setMySubmissions(matched.length > 0 ? matched : all);
    setEditingSubmission(null);
    showToast('Submission updated successfully!', 'success');
  };

  const handleDeleteSubmission = async (subId) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      await deleteDSASolution(subId);
      const all = await getDSASolutions() || [];
      const uEmail = user?.email?.toLowerCase();
      const uId = user?.id;
      const matched = all.filter(s =>
        (uEmail && s.memberEmail?.toLowerCase() === uEmail) || (uId && s.memberId === uId)
      );
      setMySubmissions(matched.length > 0 ? matched : all);
      showToast('Submission deleted.', 'info');
    }
  };

  useEffect(() => {
    const loadSubmissions = async () => {
      const all = await getDSASolutions() || [];
      if (user?.email || user?.id) {
        const uEmail = user?.email?.toLowerCase();
        const uId = user?.id;
        const matched = all.filter(s =>
          (uEmail && s.memberEmail?.toLowerCase() === uEmail) ||
          (uId && s.memberId === uId)
        );
        setMySubmissions(matched.length > 0 ? matched : all);
      } else {
        setMySubmissions(all);
      }
    };
    loadSubmissions();
  }, [viewMode, isSubmitted, user]);

  const filteredMySubmissions = mySubmissions.filter(s =>
    submissionFilter === 'ALL' || s.status === submissionFilter
  );

  // Store-driven DSA data (100% Admin Panel controlled)
  const [dsaTopics, setDsaTopics] = useState([]);
  const [dsaProblems, setDsaProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  useEffect(() => {
    getDSATopics().then(topics => {
      const list = topics || [];
      setDsaTopics(list);
      if (list.length > 0) {
        setSelectedTopic(prev => prev || list[0]?.name || null);
      } else {
        setSelectedTopic(null);
      }
    });
    getDSAProblems().then(problems => {
      const list = problems || [];
      setDsaProblems(list);
      if (list.length > 0) {
        setSelectedProblemId(prev => prev || list[0]?.id || null);
      } else {
        setSelectedProblemId(null);
      }
    });

    // Re-sync when admin makes changes
    const onUpdate = () => {
      getDSATopics().then(t => {
        const list = t || [];
        setDsaTopics(list);
        if (list.length > 0) {
          setSelectedTopic(prev => list.some(x => x.name === prev) ? prev : list[0].name);
        } else {
          setSelectedTopic(null);
        }
      });
      getDSAProblems().then(p => {
        const list = p || [];
        setDsaProblems(list);
        if (list.length > 0) {
          setSelectedProblemId(prev => list.some(x => x.id === prev) ? prev : list[0].id);
        } else {
          setSelectedProblemId(null);
        }
      });
    };
    window.addEventListener('nexus-data-updated', onUpdate);
    return () => window.removeEventListener('nexus-data-updated', onUpdate);
  }, []);

  // ── Dynamic Solved & Progress Calculations ──────────────────────────────
  const solvedProblemKeys = new Set(
    (mySubmissions || []).map(s => String(s.problemId || s.problemTitle || s.id || '').trim().toLowerCase()).filter(Boolean)
  );

  const totalDsaProblems = dsaProblems.length || DEFAULT_DSA_PROBLEMS.length || 1;
  const overallSolvedCount = Math.min(
    dsaProblems.filter(p => solvedProblemKeys.has(String(p.id).toLowerCase()) || solvedProblemKeys.has(String(p.title || '').toLowerCase())).length || solvedProblemKeys.size,
    totalDsaProblems
  );
  const overallProgressPct = Math.min(100, Math.max(0, Math.round((overallSolvedCount / totalDsaProblems) * 100)));

  // DSA Overview Tab ONLY Streak Penalty (decreases by 1 for each rejected or deleted submission)
  const rejectedSubmissionsCount = (mySubmissions || []).filter(s => s.status === 'rejected').length;
  const getDeletedPenalty = () => {
    try {
      const uId = user?.id;
      const uEmail = user?.email;
      const p1 = uId ? Number(localStorage.getItem(`nexus_dsa_deleted_penalty_${uId}`) || 0) : 0;
      const p2 = uEmail ? Number(localStorage.getItem(`nexus_dsa_deleted_penalty_${uEmail}`) || 0) : 0;
      return Math.max(p1, p2);
    } catch {
      return 0;
    }
  };
  const deletedSubmissionsCount = getDeletedPenalty();
  const totalDsaPenalties = rejectedSubmissionsCount + deletedSubmissionsCount;
  const baseStreak = Number(user?.streak ?? 1);
  const dsaOverviewStreak = Math.max(0, baseStreak - totalDsaPenalties);
  const [toastMessage, setToastMessage] = useState(null);

  // Drag & drop / upload state
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('File too large! Max size is 10MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result);
        showToast('Solution image uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('File too large! Max size is 10MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result);
        showToast('Solution image dropped successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitSolution = () => {
    if (!uploadedImage && !submissionNotes.trim()) {
      showToast('Please upload a solution image or provide description notes before submitting.', 'error');
      return;
    }
    // Save to admin-visible submission store
    addDSASolution({
      memberId:    user?.id || 'unknown',
      memberName:  user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || user.email : 'Unknown Member',
      memberEmail: user?.email || '',
      problemId:   activeProblem?.id || null,
      problemTitle: activeProblem?.title || 'Unknown Problem',
      difficulty:  activeProblem?.difficulty || 'Easy',
      topicName:   selectedTopic || '',
      imageData:   uploadedImage,   // base64 data URL or path
      notes:       submissionNotes,
      solutionNotes: submissionNotes,
      description: submissionNotes,
    });
    setIsSubmitted(true);
    setSubmissionNotes('');
    showToast('🎉 Solution submitted successfully for evaluation!', 'success');
  };

  const showToast = (msg, type = 'info') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Derived: topics with solved/total counts from dsaProblems
  // Note: solved count is 0 by default unless per-user tracking is added
  const derivedTopics = dsaTopics.map(t => {
    const topicProblems = dsaProblems.filter(p => p.topicId === t.id);
    const total = topicProblems.length;
    return {
      ...t,
      solved: 0,   // TODO: per-user solve tracking
      total,
      pct: 0,
    };
  });

  // Active problem: first problem of selected topic, or manually selected
  const topicObj = dsaTopics.find(t => t.name === selectedTopic);
  const topicProblems = topicObj
    ? dsaProblems.filter(p => p.topicId === topicObj.id)
    : dsaProblems;
  const activeProblem = selectedProblemId
    ? dsaProblems.find(p => p.id === selectedProblemId)
    : topicProblems[0] || null;

  // When selected topic changes, auto-select first problem
  useEffect(() => {
    if (topicObj) {
      const probs = dsaProblems.filter(p => p.topicId === topicObj.id);
      if (probs.length > 0) setSelectedProblemId(probs[0].id);
    }
  }, [selectedTopic, dsaTopics, dsaProblems]);

  // Common card style helper
  const cardStyle = {
    backgroundColor: isDark ? '#121625' : '#ffffff',
    border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
    borderRadius: '24px',
    padding: '24px',
    boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.35)' : '0 4px 20px rgba(0,0,0,0.03)',
    boxSizing: 'border-box',
    width: '100%'
  };

  return (
    <div style={{ width: '100%', maxWidth: '1600px', margin: '0 auto', boxSizing: 'border-box' }}>
      
      <style>{`
        .dsa-workspace-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          width: 100%;
          box-sizing: border-box;
        }

        @media (min-width: 1024px) {
          .dsa-workspace-grid {
            grid-template-columns: 280px minmax(0, 1fr);
          }
          .mobile-bottom-nav {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 9999,
          padding: '14px 20px',
          borderRadius: '16px',
          backgroundColor: toastMessage.type === 'success' ? '#10b981' : toastMessage.type === 'error' ? '#ef4444' : '#7b5cff',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: 700,
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Sparkles size={16} />
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* TOP VIEW SWITCHER BAR */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '16px 20px',
        borderRadius: '20px',
        backgroundColor: isDark ? '#121625' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.02)',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Brain size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0, lineHeight: 1.2 }}>
              Sun Nexus DSA Platform
            </h1>
            <p style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', margin: '2px 0 0 0' }}>
              Master Data Structures & Algorithms
            </p>
          </div>
        </div>

        {/* View mode toggle pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px',
          borderRadius: '14px',
          backgroundColor: isDark ? '#0d0f1a' : '#f1f5f9',
          border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
          gap: '4px'
        }}>
          <button
            onClick={() => setViewMode('workspace')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: viewMode === 'workspace' ? 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)' : 'transparent',
              color: viewMode === 'workspace' ? '#ffffff' : (isDark ? '#94a3b8' : '#475569'),
              boxShadow: viewMode === 'workspace' ? '0 2px 10px rgba(123, 92, 255, 0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Eye size={14} />
            <span>Problem Workspace</span>
          </button>

          <button
            onClick={() => setViewMode('overview')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: viewMode === 'overview' ? 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)' : 'transparent',
              color: viewMode === 'overview' ? '#ffffff' : (isDark ? '#94a3b8' : '#475569'),
              boxShadow: viewMode === 'overview' ? '0 2px 10px rgba(123, 92, 255, 0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <BookOpen size={14} />
            <span>DSA Overview</span>
          </button>

          <button
            onClick={() => setViewMode('submissions')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: viewMode === 'submissions' ? 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)' : 'transparent',
              color: viewMode === 'submissions' ? '#ffffff' : (isDark ? '#94a3b8' : '#475569'),
              boxShadow: viewMode === 'submissions' ? '0 2px 10px rgba(123, 92, 255, 0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <FileText size={14} />
            <span>My Submissions</span>
          </button>

          <button
            onClick={() => { setIsUploadModalOpen(true); setUploadedImage(null); setIsSubmitted(false); }}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              border: isUploadModalOpen ? 'none' : `1px solid ${isDark ? 'rgba(148, 163, 184, 0.2)' : '#e2e8f0'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isUploadModalOpen
                ? 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)'
                : 'transparent',
              color: isUploadModalOpen
                ? '#ffffff'
                : (isDark ? '#94a3b8' : '#475569'),
              boxShadow: isUploadModalOpen ? '0 2px 10px rgba(123, 92, 255, 0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <UploadCloud size={14} />
            <span>Upload Solution</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: PROBLEM WORKSPACE (3-COLUMN DESKTOP WORKSPACE)                   */}
      {/* ========================================================================= */}
      {viewMode === 'workspace' && (
        <div className="dsa-workspace-grid" style={{ alignItems: 'start' }}>
          
          {/* ── COLUMN 1: TOPIC LIST & TOPIC PROGRESS & NEED HELP ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            
            {/* DSA Topics Card */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                  DSA Topics
                </h3>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' }}>
                  {derivedTopics.length} Topics
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '440px', overflowY: 'auto' }}>
                {derivedTopics.length === 0 ? (
                  <p style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b', textAlign: 'center', padding: '20px' }}>No topics yet. Ask your admin to add DSA topics.</p>
                ) : derivedTopics.map((t) => {
                  const isSelected = selectedTopic === t.name;
                  return (
                    <button
                      key={t.id || t.name}
                      onClick={() => setSelectedTopic(t.name)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', borderRadius: '14px', fontSize: '13px', fontWeight: 700,
                        border: 'none', cursor: 'pointer',
                        background: isSelected ? 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)' : 'transparent',
                        color: isSelected ? '#ffffff' : (isDark ? '#cbd5e1' : '#334155'),
                        boxShadow: isSelected ? '0 4px 12px rgba(123, 92, 255, 0.25)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, opacity: isSelected ? 0.9 : 0.6 }}>
                        {t.solved}/{t.total}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Topic Progress Card */}
            {(() => {
              const topicSolved = topicProblems.filter(p => 
                solvedProblemKeys.has(String(p.id).toLowerCase()) || solvedProblemKeys.has(String(p.title || '').toLowerCase())
              ).length;
              const topicTotal = topicProblems.length || 1;
              const topicPct = topicProblems.length > 0 ? Math.round((topicSolved / topicTotal) * 100) : 0;

              return (
                <div style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: isDark ? '#94a3b8' : '#64748b' }}>
                      Topic Progress
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 900, color: '#7b5cff' }}>
                      {topicPct}%
                    </span>
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 6px 0' }}>
                    {selectedTopic || 'Select a Topic'}
                  </h4>
                  <div style={{ width: '100%', height: '8px', borderRadius: '9999px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{ height: '100%', borderRadius: '9999px', background: 'linear-gradient(90deg, #7b5cff 0%, #6366f1 100%)', width: `${topicPct}%`, transition: 'width 0.5s ease' }} />
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', margin: '0 0 16px 0' }}>
                    {topicSolved} / {topicProblems.length} Problems Solved
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px', textAlign: 'center' }}>
                    {['Easy','Medium','Hard'].map(diff => {
                      const diffColor = diff === 'Easy' ? '#10b981' : diff === 'Medium' ? '#f59e0b' : '#f43f5e';
                      const diffBg   = diff === 'Easy' ? (isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5') : diff === 'Medium' ? (isDark ? 'rgba(245,158,11,0.15)' : '#fffbeb') : (isDark ? 'rgba(244,63,94,0.15)' : '#fff1f2');
                      const diffBorder = diff === 'Easy' ? (isDark ? 'rgba(16,185,129,0.3)' : '#a7f3d0') : diff === 'Medium' ? (isDark ? 'rgba(245,158,11,0.3)' : '#fde68a') : (isDark ? 'rgba(244,63,94,0.3)' : '#fecdd3');
                      const diffProbs = topicProblems.filter(p => p.difficulty === diff);
                      const diffTotal = diffProbs.length;
                      const diffSolved = diffProbs.filter(p => solvedProblemKeys.has(String(p.id).toLowerCase()) || solvedProblemKeys.has(String(p.title || '').toLowerCase())).length;
                      return (
                        <div key={diff} style={{ padding: '8px', borderRadius: '12px', backgroundColor: diffBg, border: `1px solid ${diffBorder}` }}>
                          <div style={{ fontSize: '10px', fontWeight: 800, color: diffColor }}>{diff}</div>
                          <div style={{ fontSize: '12px', fontWeight: 900, color: diffColor }}>{diffSolved}/{diffTotal}</div>
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    onClick={() => showToast(`View roadmap for ${selectedTopic || 'this topic'}`)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '12px',
                      border: `1px solid ${isDark ? '#4c1d95' : '#c084fc'}`,
                      fontSize: '12px',
                      fontWeight: 700,
                      color: isDark ? '#c084fc' : '#7b5cff',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>View Topic Roadmap</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })()}

          </div>

          {/* ── COLUMN 2: PROBLEM DETAILS & TUTORIAL ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', minWidth: 0 }}>
            
            {/* Breadcrumb Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>
                <span>DSA</span>
                <ChevronRight size={14} />
                <span>{selectedTopic || '—'}</span>
                <ChevronRight size={14} />
                <span style={{ color: isDark ? '#f8fafc' : '#0f172a', fontWeight: 800 }}>{activeProblem?.title || '—'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => {
                    if (!activeProblem || topicProblems.length === 0) return;
                    const idx = topicProblems.findIndex(p => p.id === activeProblem.id);
                    if (idx > 0) setSelectedProblemId(topicProblems[idx - 1].id);
                    else showToast('No previous problem', 'info');
                  }}
                  style={{ padding: '6px 12px', borderRadius: '10px', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, fontSize: '12px', fontWeight: 700, backgroundColor: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#cbd5e1' : '#334155', cursor: 'pointer' }}
                >
                  &lt; Prev
                </button>
                <button
                  onClick={() => {
                    if (!activeProblem || topicProblems.length === 0) return;
                    const idx = topicProblems.findIndex(p => p.id === activeProblem.id);
                    if (idx < topicProblems.length - 1) setSelectedProblemId(topicProblems[idx + 1].id);
                    else showToast('No next problem in this topic', 'info');
                  }}
                  style={{ padding: '6px 12px', borderRadius: '10px', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, fontSize: '12px', fontWeight: 700, backgroundColor: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#cbd5e1' : '#334155', cursor: 'pointer' }}
                >
                  Next &gt;
                </button>
              </div>
            </div>

            {/* Main Problem Card */}
            <div style={cardStyle}>
              
              {/* Header */}
              {!activeProblem ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 2rem', color: isDark ? '#94a3b8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '18px', backgroundColor: isDark ? 'rgba(123, 92, 255, 0.15)' : '#ede9fe', color: '#7b5cff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                    <BookOpen size={28} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>Select a Topic to View Problems</h3>
                  <p style={{ fontSize: '13px', margin: 0, maxWidth: '400px', lineHeight: 1.5 }}>Problems will appear here once topics and problems are added via the Admin Panel.</p>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    style={{
                      marginTop: '8px',
                      padding: '10px 20px',
                      borderRadius: '14px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(123, 92, 255, 0.3)'
                    }}
                  >
                    <UploadCloud size={16} />
                    <span>Upload Solution</span>
                  </button>
                </div>
              ) : (<>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '9999px', backgroundColor: activeProblem.difficulty === 'Easy' ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5') : activeProblem.difficulty === 'Hard' ? (isDark ? 'rgba(239,68,68,0.2)' : '#fee2e2') : (isDark ? 'rgba(245,158,11,0.2)' : '#fef3c7'), color: activeProblem.difficulty === 'Easy' ? (isDark ? '#6ee7b7' : '#047857') : activeProblem.difficulty === 'Hard' ? (isDark ? '#fca5a5' : '#b91c1c') : (isDark ? '#fcd34d' : '#92400e'), fontSize: '12px', fontWeight: 800 }}>
                    {activeProblem.difficulty || 'Easy'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => { setIsUploadModalOpen(true); setUploadedImage(null); setIsSubmitted(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)', color: '#ffffff', fontSize: '12px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 3px 12px rgba(123, 92, 255, 0.3)' }}
                    >
                      <UploadCloud size={14} />
                      <span>Upload Solution</span>
                    </button>
                  </div>
                </div>

                <h1 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                  {activeProblem.number ? `${String(activeProblem.number).padStart(2,'0')}. ` : ''}{activeProblem.title}
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {(activeProblem.tags || []).map(tag => (
                    <span key={tag} style={{ padding: '4px 12px', borderRadius: '9999px', backgroundColor: isDark ? 'rgba(123, 92, 255, 0.2)' : '#ede9fe', color: isDark ? '#c084fc' : '#6d28d9', fontSize: '12px', fontWeight: 700 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div style={{ fontSize: '13px', lineHeight: 1.6, color: isDark ? '#cbd5e1' : '#334155', fontWeight: 500, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <p style={{ margin: 0 }}>{activeProblem.description || 'No description provided.'}</p>
              </div>

              {/* Examples */}
              {(activeProblem.examples || []).length > 0 && (activeProblem.examples || []).map((ex, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Example {idx + 1}:</div>
                  <div style={{ padding: '14px 16px', borderRadius: '16px', backgroundColor: isDark ? '#0d0f1a' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, fontFamily: 'monospace', fontSize: '12px', color: isDark ? '#e2e8f0' : '#1e293b', display: 'flex', flexDirection: 'column', gap: '6px', overflowX: 'auto' }}>
                    {ex.input && <div><span style={{ fontWeight: 800, color: isDark ? '#94a3b8' : '#64748b' }}>Input:</span> {ex.input}</div>}
                    {ex.output && <div><span style={{ fontWeight: 800, color: isDark ? '#94a3b8' : '#64748b' }}>Output:</span> {ex.output}</div>}
                    {ex.explanation && <div><span style={{ fontWeight: 800, color: isDark ? '#94a3b8' : '#64748b' }}>Explanation:</span> {ex.explanation}</div>}
                  </div>
                </div>
              ))}

              {/* Constraints */}
              {(activeProblem.constraints || []).length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Constraints:</div>
                  <ul style={{ fontSize: '13px', fontWeight: 500, color: isDark ? '#cbd5e1' : '#334155', display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '20px', margin: 0 }}>
                    {activeProblem.constraints.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              )}

              {/* Expandable Hints Accordion */}
              <div style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, overflow: 'hidden', marginBottom: '12px' }}>
                <button
                  onClick={() => setHintsExpanded(!hintsExpanded)}
                  style={{ width: '100%', padding: '14px 16px', backgroundColor: isDark ? '#1e293b' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: isDark ? 'rgba(123, 92, 255, 0.2)' : '#ede9fe', color: '#7b5cff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Lightbulb size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Hints</div>
                      <div style={{ fontSize: '11px', fontWeight: 500, color: isDark ? '#94a3b8' : '#64748b' }}>Solve on your own to improve problem solving skills.</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: isDark ? '#4c1d95' : '#ddd6fe', color: isDark ? '#e9d5ff' : '#5b21b6', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{(activeProblem.hints || []).length || 0}</span>
                    {hintsExpanded ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
                  </div>
                </button>
                {hintsExpanded && (
                  <div style={{ padding: '16px', backgroundColor: isDark ? '#0d0f1a' : '#ffffff', borderTop: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, fontSize: '12px', fontWeight: 500, color: isDark ? '#cbd5e1' : '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(activeProblem.hints || []).length > 0
                      ? activeProblem.hints.map((h, i) => <p key={i} style={{ margin: 0 }}><strong>Hint {i + 1}:</strong> {h}</p>)
                      : <p style={{ margin: 0 }}>No hints available for this problem.</p>
                    }
                  </div>
                )}
              </div>

              {/* Expandable Expected Complexity Accordion */}
              <div style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, overflow: 'hidden', marginBottom: '20px' }}>
                <button
                  onClick={() => setComplexityExpanded(!complexityExpanded)}
                  style={{ width: '100%', padding: '14px 16px', backgroundColor: isDark ? '#1e293b' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#e0e7ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Clock size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Expected Complexity</div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' }}>
                        Time: <span style={{ fontFamily: 'monospace', color: '#7b5cff', fontWeight: 800 }}>{activeProblem.timeComplexity || 'O(n)'}</span> &nbsp; Space: <span style={{ fontFamily: 'monospace', color: '#7b5cff', fontWeight: 800 }}>{activeProblem.spaceComplexity || 'O(n)'}</span>
                      </div>
                    </div>
                  </div>
                  {complexityExpanded ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
                </button>
                {complexityExpanded && (
                  <div style={{ padding: '16px', backgroundColor: isDark ? '#0d0f1a' : '#ffffff', borderTop: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, fontSize: '12px', fontWeight: 500, color: isDark ? '#cbd5e1' : '#334155' }}>
                    {activeProblem.tutorial || 'No detailed explanation available for this problem yet.'}
                  </div>
                )}
              </div>

              {/* Start Problem Button */}
              <button
                onClick={() => showToast('Problem workspace initialized!')}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 900,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(123, 92, 255, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>Start Problem</span>
                <ArrowRight size={16} />
              </button>
            </>
              )}
            </div>

            {/* Educational Section Tabs */}
            <div style={cardStyle}>
              
              {/* Tabs Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderBottom: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, paddingBottom: '8px', fontSize: '13px', fontWeight: 800, overflowX: 'auto' }}>
                {['tutorial', 'approach', 'solutions', 'discuss', 'editorial'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTutorialTab(tab)}
                    style={{
                      paddingBottom: '8px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      whiteSpace: 'nowrap',
                      borderBottom: activeTutorialTab === tab ? '2px solid #7b5cff' : '2px solid transparent',
                      color: activeTutorialTab === tab ? '#7b5cff' : (isDark ? '#94a3b8' : '#64748b'),
                      fontWeight: activeTutorialTab === tab ? 900 : 600
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tutorial Content */}
              {activeTutorialTab === 'tutorial' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BookOpen size={18} style={{ color: '#7b5cff' }} />
                      <span>{activeProblem?.title ? `${activeProblem.title} Walkthrough` : 'Tutorial Walkthrough'}</span>
                    </h3>
                    {activeProblem && (
                      <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '9999px', backgroundColor: isDark ? 'rgba(123, 92, 255, 0.2)' : '#f5f3ff', color: '#7b5cff', border: '1px solid rgba(123, 92, 255, 0.3)' }}>
                        {activeProblem.difficulty}
                      </span>
                    )}
                  </div>

                  {activeProblem?.tutorial ? (
                    renderTutorialContent(activeProblem.tutorial, isDark)
                  ) : (
                    <div style={{ padding: '28px', textAlign: 'center', backgroundColor: isDark ? '#0d0f1a' : '#f8fafc', borderRadius: '16px', border: `1px dashed ${isDark ? 'rgba(148, 163, 184, 0.2)' : '#cbd5e1'}` }}>
                      <BookOpen size={32} style={{ color: isDark ? '#64748b' : '#94a3b8', marginBottom: '10px' }} />
                      <p style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569', margin: 0 }}>
                        No tutorial text provided for this problem yet.
                      </p>
                      <p style={{ fontSize: '12px', color: isDark ? '#64748b' : '#94a3b8', marginTop: '4px' }}>
                        Add step-by-step notes, algorithm steps, or code blocks in the Admin Panel → DSA tab.
                      </p>
                    </div>
                  )}

                  {/* Visual hint: first example as illustration */}
                  {activeProblem && (activeProblem.examples || []).length > 0 && (
                    <div style={{ padding: '16px 20px', borderRadius: '16px', backgroundColor: isDark ? '#0d0f1a' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sample Example Case</div>
                      {activeProblem.examples[0].input && <div style={{ fontFamily: 'monospace', fontSize: '12px', color: isDark ? '#e2e8f0' : '#1e293b' }}><strong>Input:</strong> {activeProblem.examples[0].input}</div>}
                      {activeProblem.examples[0].output && <div style={{ fontFamily: 'monospace', fontSize: '12px', color: isDark ? '#e2e8f0' : '#1e293b' }}><strong>Output:</strong> {activeProblem.examples[0].output}</div>}
                      {activeProblem.examples[0].explanation && <div style={{ fontSize: '12px', color: isDark ? '#cbd5e1' : '#475569', marginTop: '2px' }}><strong>Explanation:</strong> {activeProblem.examples[0].explanation}</div>}
                    </div>
                  )}
                </div>
              )}

              {activeTutorialTab === 'approach' && (
                <div style={{ paddingTop: '16px' }}>
                  {activeProblem?.tutorial ? (
                    renderTutorialContent(activeProblem.tutorial, isDark)
                  ) : activeProblem?.description ? (
                    renderTutorialContent(activeProblem.description, isDark)
                  ) : (
                    <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '13px' }}>No approach details provided.</p>
                  )}
                </div>
              )}

              {activeTutorialTab === 'solutions' && (
                <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {activeProblem?.timeComplexity || activeProblem?.spaceComplexity ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : '#ecfdf5', border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : '#a7f3d0'}` }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>Time Complexity</div>
                        <div style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#6ee7b7' : '#047857', marginTop: '4px', fontFamily: 'monospace' }}>{activeProblem.timeComplexity || 'O(N)'}</div>
                      </div>
                      <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : '#eff6ff', border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.3)' : '#bfdbfe'}` }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase' }}>Space Complexity</div>
                        <div style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#93c5fd' : '#1d4ed8', marginTop: '4px', fontFamily: 'monospace' }}>{activeProblem.spaceComplexity || 'O(1)'}</div>
                      </div>
                    </div>
                  ) : null}

                  {activeProblem?.tutorial && activeProblem.tutorial.includes('```') ? (
                    renderTutorialContent(activeProblem.tutorial, isDark)
                  ) : (
                    <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: isDark ? '#0d0f1a' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, fontSize: '13px', color: isDark ? '#cbd5e1' : '#475569' }}>
                      Optimal solution approach: {activeProblem?.title || 'Selected problem'}. Refer to the Tutorial tab for detailed walkthrough code.
                    </div>
                  )}
                </div>
              )}

              {activeTutorialTab !== 'tutorial' && activeTutorialTab !== 'approach' && activeTutorialTab !== 'solutions' && (
                <div style={{ padding: '24px 0', textAlign: 'center', fontSize: '13px', fontWeight: 500, color: isDark ? '#94a3b8' : '#64748b' }}>
                  Detailed {activeTutorialTab} notes and community discussion for {activeProblem?.title || 'this problem'}.
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: OVERVIEW SCREEN (MATCHING MOBILE SCREEN 1 SPECIFICATIONS)         */}
      {/* ========================================================================= */}
      {viewMode === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>DSA Overview</h1>
              <p style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', margin: '4px 0 0 0' }}>Master Data Structures & Algorithms</p>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(123, 92, 255, 0.3)' }}>
              <BookOpen size={24} />
            </div>
          </div>

          <div style={{ padding: '32px', borderRadius: '28px', background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)', color: '#ffffff', boxShadow: '0 10px 30px rgba(123, 92, 255, 0.3)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.9 }}>Overall Progress</div>
              <div style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.02em' }}>
                {overallProgressPct}%
              </div>
            </div>
            <div style={{ width: '100%', height: '10px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden', zIndex: 2 }}>
              <div style={{ height: '100%', backgroundColor: '#ffffff', borderRadius: '9999px', width: `${overallProgressPct}%`, transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, opacity: 0.9, zIndex: 2 }}>
              {overallSolvedCount} / {totalDsaProblems} Problems Solved
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={cardStyle}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: isDark ? 'rgba(123, 92, 255, 0.2)' : '#ede9fe', color: '#7b5cff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <BookOpen size={18} />
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>Topics</div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a' }}>{dsaTopics.length} Total</div>
            </div>

            <div style={cardStyle}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Lightbulb size={18} />
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>Problems</div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a' }}>{dsaProblems.length} Total</div>
            </div>

            <div style={cardStyle}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <CheckCircle2 size={18} />
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>Solved</div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a' }}>{overallSolvedCount} Problems</div>
            </div>

            <div style={cardStyle}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Flame size={18} />
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>Streak</div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a' }}>{dsaOverviewStreak} Days</div>
              {totalDsaPenalties > 0 && (
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#ef4444', marginTop: '2px' }}>
                  (-{totalDsaPenalties} for rejected/deleted)
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>DSA Domains</h3>
              <button onClick={() => showToast('Viewing all domains')} style={{ fontSize: '12px', fontWeight: 700, color: '#7b5cff', border: 'none', background: 'none', cursor: 'pointer' }}>View All</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {derivedTopics.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '2.5rem', textAlign: 'center', backgroundColor: isDark ? '#0d0f1a' : '#f8fafc', borderRadius: '20px', border: `1px dashed ${isDark ? 'rgba(148, 163, 184, 0.2)' : '#cbd5e1'}` }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>No DSA topics available.</p>
                  <p style={{ fontSize: '12px', color: isDark ? '#64748b' : '#94a3b8', marginTop: '6px' }}>Use the Admin Panel → DSA tab to add topics and problems.</p>
                </div>
              ) : derivedTopics.map((dom) => {
                const iconMap = { Layers, Code, Link, Database, Target, Shield, RotateCcw, FolderTree, Network, Cpu, Brain: Brain, BookOpen };
                const IconComp = iconMap[dom.icon] || Layers;
                return (
                  <div key={dom.id || dom.name} style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: `${dom.color || '#7b5cff'}20`, color: dom.color || '#7b5cff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconComp size={18} />
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{dom.name}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{dom.solved} / {dom.total}</div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>{dom.pct}%</div>
                      </div>
                    </div>
                    <div style={{ width: '100%', height: '6px', borderRadius: '9999px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: '9999px', backgroundColor: dom.color || '#7b5cff', width: `${dom.pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: SOLVE & UPLOAD WORKFLOW SCREEN                                   */}
      {/* ========================================================================= */}
      {viewMode === 'solve' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{
            padding: '24px',
            borderRadius: '24px',
            backgroundColor: isDark ? 'rgba(123, 92, 255, 0.12)' : '#f5f3ff',
            border: `1px solid ${isDark ? 'rgba(123, 92, 255, 0.3)' : '#ddd6fe'}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px'
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '14px', backgroundColor: isDark ? 'rgba(123, 92, 255, 0.25)' : '#ede9fe', color: '#7b5cff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Lightbulb size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 4px 0' }}>
                Solve It Yourself
              </h3>
              <p style={{ fontSize: '13px', fontWeight: 500, color: isDark ? '#cbd5e1' : '#475569', lineHeight: 1.5, margin: 0 }}>
                Solve the problem manually on paper first. Upload a clear photo or screenshot of your solution.
              </p>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 20px 0' }}>
              Upload Your Solution
            </h3>
            
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              style={{
                padding: '32px',
                borderRadius: '20px',
                border: isDragging ? '2px dashed #7b5cff' : `2px dashed ${isDark ? 'rgba(148, 163, 184, 0.25)' : '#cbd5e1'}`,
                backgroundColor: isDragging ? (isDark ? 'rgba(123, 92, 255, 0.15)' : '#f5f3ff') : (isDark ? '#0d0f1a' : '#f8fafc'),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '12px',
                position: 'relative',
                marginBottom: '20px',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
              />
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: isDark ? 'rgba(123, 92, 255, 0.2)' : '#ede9fe', color: '#7b5cff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UploadCloud size={24} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b' }}>
                Drag & drop your solution here or <span style={{ color: '#7b5cff', textDecoration: 'underline' }}>click to browse</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' }}>
                JPG, PNG, WEBP or PDF (Max 10MB)
              </div>
            </div>

            {uploadedImage && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, backgroundColor: isDark ? '#0d0f1a' : '#f8fafc' }}>
                  <img
                    src={uploadedImage}
                    alt="Uploaded Solution Preview"
                    style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                  />
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      showToast('Upload removed', 'info');
                    }}
                    style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Attempt 1</div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: isDark ? '#94a3b8' : '#64748b' }}>Today, 10:24 AM</div>
                  </div>
                  <label style={{ padding: '8px 16px', borderRadius: '12px', border: `1px solid ${isDark ? '#4c1d95' : '#c084fc'}`, fontSize: '12px', fontWeight: 700, color: isDark ? '#c084fc' : '#7b5cff', backgroundColor: 'transparent', cursor: 'pointer' }}>
                    <span>Replace</span>
                    <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmitSolution}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                background: isSubmitted ? '#10b981' : 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
                boxShadow: isSubmitted ? '0 4px 16px rgba(16, 185, 129, 0.3)' : '0 4px 16px rgba(123, 92, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSubmitted ? (
                <>
                  <Check size={18} />
                  <span>Submitted Successfully</span>
                </>
              ) : (
                <span>Submit Solution</span>
              )}
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: MY SUBMISSIONS (MEMBER SUBMITTED SOLUTIONS HISTORY)              */}
      {/* ========================================================================= */}
      {viewMode === 'submissions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Header Banner */}
          <div style={{
            ...cardStyle,
            background: isDark
              ? 'linear-gradient(135deg, rgba(123, 92, 255, 0.15) 0%, rgba(79, 70, 229, 0.08) 100%)'
              : 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)',
            border: `1px solid ${isDark ? 'rgba(123, 92, 255, 0.3)' : '#cbd5e1'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(123, 92, 255, 0.3)',
                flexShrink: 0
              }}>
                <FileText size={26} />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                  My DSA Submissions
                </h2>
                <p style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', margin: '4px 0 0 0' }}>
                  Track status and admin evaluations of your uploaded DSA solutions.
                </p>
              </div>
            </div>

            {/* Quick summary stats */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ padding: '10px 16px', borderRadius: '12px', backgroundColor: isDark ? '#0d0f1a' : '#ffffff', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#7b5cff' }}>{mySubmissions.length}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>Total</div>
              </div>
              <div style={{ padding: '10px 16px', borderRadius: '12px', backgroundColor: isDark ? '#0d0f1a' : '#ffffff', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#10b981' }}>{mySubmissions.filter(s => s.status === 'approved').length}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>Approved</div>
              </div>
              <div style={{ padding: '10px 16px', borderRadius: '12px', backgroundColor: isDark ? '#0d0f1a' : '#ffffff', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#f59e0b' }}>{mySubmissions.filter(s => s.status === 'pending').length}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>Pending</div>
              </div>
            </div>
          </div>

          {/* Status Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', marginRight: '4px' }}>Filter Status:</span>
            {['ALL', 'pending', 'approved', 'reviewed', 'rejected'].map(st => (
              <button
                key={st}
                onClick={() => setSubmissionFilter(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  background: submissionFilter === st ? 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)' : (isDark ? '#1e293b' : '#f1f5f9'),
                  color: submissionFilter === st ? '#ffffff' : (isDark ? '#94a3b8' : '#64748b'),
                  transition: 'all 0.15s ease'
                }}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Submissions List */}
          {filteredMySubmissions.length === 0 ? (
            <div style={{
              ...cardStyle,
              padding: '48px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '16px'
            }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: isDark ? 'rgba(123, 92, 255, 0.15)' : '#ede9fe', color: '#7b5cff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 6px 0' }}>
                  No Submissions Found
                </h3>
                <p style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b', maxWidth: '360px', margin: 0 }}>
                  You haven't submitted any solutions matching this filter yet. Go to the Problem Workspace to upload a solution!
                </p>
              </div>
              <button
                onClick={() => setViewMode('workspace')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(123, 92, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Eye size={16} />
                <span>Go to Problem Workspace</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {filteredMySubmissions.map(sub => {
                const statusBg = sub.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : sub.status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : sub.status === 'reviewed' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(245, 158, 11, 0.15)';
                const statusColor = sub.status === 'approved' ? '#10b981' : sub.status === 'rejected' ? '#ef4444' : sub.status === 'reviewed' ? '#6366f1' : '#f59e0b';
                const statusBorder = sub.status === 'approved' ? 'rgba(16, 185, 129, 0.3)' : sub.status === 'rejected' ? 'rgba(239, 68, 68, 0.3)' : sub.status === 'reviewed' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(245, 158, 11, 0.3)';
                const diffColor = sub.difficulty === 'Easy' ? '#10b981' : sub.difficulty === 'Hard' ? '#ef4444' : '#f59e0b';

                return (
                  <div key={sub.id} style={{
                    ...cardStyle,
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}>
                    {/* Header info */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', backgroundColor: `${diffColor}18`, color: diffColor }}>
                          {sub.difficulty || 'Easy'}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '8px', backgroundColor: statusBg, color: statusColor, border: `1px solid ${statusBorder}`, textTransform: 'capitalize' }}>
                          {sub.status || 'pending'}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 4px 0' }}>
                        {sub.problemTitle || 'DSA Problem'}
                      </h4>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>
                        Topic: <span style={{ color: '#7b5cff' }}>{sub.topicName || 'General'}</span>
                      </p>
                    </div>

                    {/* Image Thumbnail Preview */}
                    {sub.imageData && (
                      <div style={{
                        position: 'relative',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
                        backgroundColor: isDark ? '#0d0f1a' : '#f8fafc',
                        cursor: 'pointer'
                      }}
                      onClick={() => setPreviewModalImage(sub.imageData)}
                      >
                        <img
                          src={sub.imageData}
                          alt="Submitted Solution"
                          style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(0,0,0,0.3)',
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '12px'
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0}
                        >
                          <Eye size={16} style={{ marginRight: '6px' }} /> View Full Image
                        </div>
                      </div>
                    )}

                    {/* Admin Note if present */}
                    {sub.adminNote && (
                      <div style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        backgroundColor: isDark ? 'rgba(123, 92, 255, 0.1)' : '#f5f3ff',
                        border: `1px solid ${isDark ? 'rgba(123, 92, 255, 0.25)' : '#ddd6fe'}`
                      }}>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: '#7b5cff', textTransform: 'uppercase', marginBottom: '2px' }}>
                          💬 Admin Feedback
                        </div>
                        <div style={{ fontSize: '12px', color: isDark ? '#e2e8f0' : '#334155' }}>
                          {sub.adminNote}
                        </div>
                      </div>
                    )}

                    {/* Footer Date & Actions */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '10px',
                      borderTop: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : '#f1f5f9'}`,
                      fontSize: '11px',
                      color: isDark ? '#64748b' : '#94a3b8'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        <span>{new Date(sub.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => handleStartEdit(sub)}
                          title="Edit submission"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            backgroundColor: isDark ? 'rgba(123, 92, 255, 0.15)' : '#ede9fe',
                            color: '#7b5cff',
                            border: `1px solid ${isDark ? 'rgba(123, 92, 255, 0.3)' : '#ddd6fe'}`,
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <Edit3 size={12} /> <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSubmission(sub.id)}
                          title="Delete submission"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
                            color: '#ef4444',
                            border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : '#fca5a5'}`,
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={12} /> <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full Image Preview Modal */}
          {previewModalImage && (
            <div style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setPreviewModalImage(null)}
            >
              <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
                <img
                  src={previewModalImage}
                  alt="Solution Large Preview"
                  style={{ width: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
                />
                <button
                  onClick={() => setPreviewModalImage(null)}
                  style={{
                    position: 'absolute',
                    top: '-16px',
                    right: '-16px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    border: '2px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Edit Submission Modal */}
          {editingSubmission && (
            <div style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setEditingSubmission(null)}
            >
              <div 
                style={{
                  ...cardStyle,
                  width: '100%',
                  maxWidth: '520px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(123, 92, 255, 0.15)', color: '#7b5cff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Edit3 size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                        Edit Submission
                      </h3>
                      <p style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', margin: '2px 0 0 0' }}>
                        {editingSubmission.problemTitle || 'DSA Solution'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEditingSubmission(null)}
                    style={{ border: 'none', background: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer', padding: '4px' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Upload Image Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
                    Solution Image / Diagram
                  </label>
                  {editImage ? (
                    <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}` }}>
                      <img src={editImage} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                      <button 
                        onClick={() => setEditImage(null)}
                        style={{ position: 'absolute', top: '8px', right: '8px', padding: '6px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff', border: 'none', cursor: 'pointer' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label style={{
                      padding: '24px',
                      borderRadius: '14px',
                      border: `2px dashed ${isDark ? 'rgba(123, 92, 255, 0.4)' : '#c7d2fe'}`,
                      backgroundColor: isDark ? '#0d0f1a' : '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}>
                      <UploadCloud size={24} style={{ color: '#7b5cff' }} />
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#7b5cff' }}>Upload New Image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => setEditImage(reader.result);
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                    </label>
                  )}
                </div>

                {/* Solution Notes / Text */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
                    Solution Notes / Approach
                  </label>
                  <textarea 
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    placeholder="Describe your approach or complexities..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: isDark ? '#0d0f1a' : '#f8fafc',
                      border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
                      color: isDark ? '#f8fafc' : '#0f172a',
                      fontSize: '13px',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Modal Footer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button 
                    onClick={() => setEditingSubmission(null)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '12px',
                      border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      color: isDark ? '#cbd5e1' : '#475569',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveEditSubmission}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(123, 92, 255, 0.3)'
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Upload Solution Modal */}
      {isUploadModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '24px',
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.2)' : '#e2e8f0'}`,
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                  Upload Solution
                </h3>
                <p style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', margin: '4px 0 0 0' }}>
                  {activeProblem?.title || 'Selected Problem'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadedImage(null);
                  setIsSubmitted(false);
                }}
                style={{ width: '34px', height: '34px', borderRadius: '50%', border: 'none', backgroundColor: isDark ? '#0d0f1a' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              style={{
                padding: '32px',
                borderRadius: '18px',
                border: isDragging ? '2px dashed #7b5cff' : `2px dashed ${isDark ? 'rgba(148, 163, 184, 0.25)' : '#cbd5e1'}`,
                backgroundColor: isDragging ? (isDark ? 'rgba(123, 92, 255, 0.15)' : '#f5f3ff') : (isDark ? '#0d0f1a' : '#f8fafc'),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '10px',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
              />
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: isDark ? 'rgba(123, 92, 255, 0.2)' : '#ede9fe', color: '#7b5cff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UploadCloud size={24} />
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b' }}>
                Drag & drop your solution here or <span style={{ color: '#7b5cff', textDecoration: 'underline' }}>click to browse</span>
              </div>
              <div style={{ fontSize: '11.5px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' }}>
                {uploadedImage ? 'File selected & ready to submit' : 'No file chosen — JPG, PNG, WEBP or PDF (Max 10MB)'}
              </div>
            </div>

            {/* Preview if uploaded */}
            {uploadedImage && (
              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, backgroundColor: isDark ? '#0d0f1a' : '#f8fafc' }}>
                <img
                  src={uploadedImage}
                  alt="Uploaded Solution Preview"
                  style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                />
                <button
                  onClick={() => {
                    setUploadedImage(null);
                    showToast('Upload removed', 'info');
                  }}
                  style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Solution Description / Approach Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
                Solution Description / Approach Notes
              </label>
              <textarea 
                value={submissionNotes}
                onChange={e => setSubmissionNotes(e.target.value)}
                placeholder="Explain your approach, algorithm logic, or time/space complexities..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '14px',
                  backgroundColor: isDark ? '#0d0f1a' : '#f8fafc',
                  border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
                  color: isDark ? '#f8fafc' : '#0f172a',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={() => {
                handleSubmitSolution();
                setTimeout(() => setIsUploadModalOpen(false), 1200);
              }}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '16px',
                background: isSubmitted ? '#10b981' : 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
                boxShadow: isSubmitted ? '0 4px 16px rgba(16, 185, 129, 0.3)' : '0 4px 16px rgba(123, 92, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSubmitted ? (
                <>
                  <Check size={18} />
                  <span>Submitted Successfully</span>
                </>
              ) : (
                <span>Submit Solution</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION (Visible only on Mobile screens < 1024px) */}
      <div className="mobile-bottom-nav" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99,
        backgroundColor: isDark ? 'rgba(13, 15, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
      }}>
        <button onClick={() => setActivePage('dashboard')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', border: 'none', background: 'none', color: isDark ? '#94a3b8' : '#64748b', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>
          <Home size={20} />
          <span>Home</span>
        </button>
        <button onClick={() => setActivePage('learning')} style={{ display: 'flex', flexDirection: 'column', items: 'center', gap: '4px', border: 'none', background: 'none', color: isDark ? '#94a3b8' : '#64748b', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>
          <GraduationCap size={20} />
          <span>My Learning</span>
        </button>
        <button onClick={() => setActivePage('dsa')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', border: 'none', background: 'none', color: '#7b5cff', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#7b5cff', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(123, 92, 255, 0.4)' }}>
            <Brain size={16} />
          </div>
          <span>DSA</span>
        </button>
        <button onClick={() => setActivePage('aptitude')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', border: 'none', background: 'none', color: isDark ? '#94a3b8' : '#64748b', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>
          <Target size={20} />
          <span>Aptitude</span>
        </button>
        <button onClick={() => setActivePage('profile')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', border: 'none', background: 'none', color: isDark ? '#94a3b8' : '#64748b', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>
          <User size={20} />
          <span>Profile</span>
        </button>
      </div>

    </div>
  );
}
