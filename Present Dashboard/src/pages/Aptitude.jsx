import React, { useState, useEffect } from 'react';
import {
  Clock, Calendar, Trophy, Target, Award, BarChart3,
  ArrowRight, ArrowLeft, Lock, MessageSquare, Brain,
  TrendingUp, PlayCircle, HelpCircle, Zap, RotateCcw, BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getAssessments, getResults } from '../store/dataStore';
import AssessmentModal from '../components/AssessmentModal';
import ReferenceNotesModal from '../components/ReferenceNotesModal';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const CATEGORY_META = [
  { title: 'Quantitative',      code: 'QA', icon: Target,        color: '#2872A1' },
  { title: 'Logical Reasoning', code: 'LR', icon: Brain,         color: '#4A90C2' },
  { title: 'Verbal Ability',    code: 'VA', icon: MessageSquare, color: '#10B981' },
];

const YOUTUBE_LINKS = {
  'Fractions and Decimals':    'https://www.youtube.com/watch?v=tnc9ojITRg4',
  'Simplification':            'https://www.youtube.com/watch?v=ZuMJFleXmiw',
  'Surds and Indices':         'https://www.youtube.com/watch?v=jAbpPTpz2bQ',
  'Permutation & Combination': 'https://www.youtube.com/watch?v=ETiRE7N7pEI',
  'Syllogisms':                'https://www.youtube.com/results?search_query=syllogisms+logical+reasoning',
  'Blood Relations':           'https://www.youtube.com/results?search_query=blood+relations+logical+reasoning',
  'Seating Arrangement':       'https://www.youtube.com/results?search_query=seating+arrangement+reasoning',
  'Coding-Decoding':           'https://www.youtube.com/results?search_query=coding+decoding+reasoning',
  'Direction Sense':           'https://www.youtube.com/results?search_query=direction+sense+reasoning',
  'Synonyms & Antonyms':       'https://www.youtube.com/results?search_query=synonyms+antonyms+verbal+ability',
  'Sentence Correction':       'https://www.youtube.com/results?search_query=sentence+correction+verbal+ability',
  'Reading Comprehension':     'https://www.youtube.com/results?search_query=reading+comprehension+verbal+ability',
  'Cloze Test':                'https://www.youtube.com/results?search_query=cloze+test+verbal+ability',
};

/** Imperial Blue 3D Brain Illustration for Card 1 */
const Purple3DBrainSvg = () => (
  <div style={{ width: '180px', height: '140px', margin: '12px auto', position: 'relative', display: 'flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}>
    <svg viewBox="0 0 200 160" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="purpleBrainGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A90C2" />
          <stop offset="50%" stopColor="#2872A1" />
          <stop offset="100%" stopColor="#143555" />
        </linearGradient>
        <linearGradient id="purpleBrainGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CBDDE9" />
          <stop offset="100%" stopColor="#4A90C2" />
        </linearGradient>
        <linearGradient id="puzzleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#EFF6FB" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="142" rx="55" ry="10" fill="#143555" opacity="0.15" />

      {/* Left Hemisphere */}
      <path
        d="M 60 70 C 45 45, 75 25, 95 38 C 98 45, 95 65, 80 75 C 70 80, 55 90, 60 70 Z"
        fill="url(#purpleBrainGrad1)"
      />
      {/* Right Hemisphere */}
      <path
        d="M 140 70 C 155 45, 125 25, 105 38 C 102 45, 105 65, 120 75 C 130 80, 145 90, 140 70 Z"
        fill="url(#purpleBrainGrad1)"
      />

      {/* Brain Folds */}
      <path d="M 50 85 C 40 60, 70 45, 88 55 C 92 70, 75 95, 50 85 Z" fill="url(#purpleBrainGrad2)" />
      <path d="M 62 105 C 45 90, 60 70, 82 78 C 88 95, 75 115, 62 105 Z" fill="url(#purpleBrainGrad1)" />
      <path d="M 80 120 C 65 115, 70 95, 90 92 C 95 105, 90 125, 80 120 Z" fill="url(#purpleBrainGrad2)" />

      <path d="M 150 85 C 160 60, 130 45, 112 55 C 108 70, 125 95, 150 85 Z" fill="url(#purpleBrainGrad2)" />
      <path d="M 138 105 C 155 90, 140 70, 118 78 C 112 95, 125 115, 138 105 Z" fill="url(#purpleBrainGrad1)" />
      <path d="M 120 120 C 135 115, 130 95, 110 92 C 105 105, 110 125, 120 120 Z" fill="url(#purpleBrainGrad2)" />

      <path d="M 98 42 C 96 70, 97 100, 99 125" stroke="#CBDDE9" strokeWidth="3" strokeLinecap="round" opacity="0.7" />

      {/* Floating 3D Puzzle Piece */}
      <g transform="translate(86, 22) scale(0.9)">
        <path
          d="M 10 10 L 22 10 C 22 5, 27 5, 27 10 L 38 10 L 38 22 C 43 22, 43 27, 38 27 L 38 38 L 27 38 C 27 43, 22 43, 22 38 L 10 38 L 10 27 C 5 27, 5 22, 10 22 Z"
          fill="url(#puzzleGrad)"
          stroke="#4A90C2"
          strokeWidth="2"
        />
      </g>

      <circle cx="35" cy="50" r="3" fill="#CBDDE9" opacity="0.8" />
      <circle cx="165" cy="45" r="4" fill="#4A90C2" opacity="0.7" />
      <circle cx="160" cy="110" r="3.5" fill="#EFF6FB" opacity="0.9" />
    </svg>
  </div>
);

/** Green/Teal 3D Brain Illustration for Card 2 */
const Green3DBrainSvg = () => (
  <div style={{ width: '180px', height: '140px', margin: '12px auto', position: 'relative', display: 'flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}>
    <svg viewBox="0 0 200 160" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="greenBrainGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="greenBrainGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="142" rx="55" ry="10" fill="#065f46" opacity="0.15" />
      <ellipse cx="100" cy="85" rx="75" ry="25" fill="none" stroke="#6ee7b7" strokeWidth="2" strokeDasharray="6 6" opacity="0.6" transform="rotate(-12 100 85)" />

      <path
        d="M 60 70 C 45 45, 75 25, 95 38 C 98 45, 95 65, 80 75 C 70 80, 55 90, 60 70 Z"
        fill="url(#greenBrainGrad1)"
      />
      <path
        d="M 140 70 C 155 45, 125 25, 105 38 C 102 45, 105 65, 120 75 C 130 80, 145 90, 140 70 Z"
        fill="url(#greenBrainGrad1)"
      />

      <path d="M 50 85 C 40 60, 70 45, 88 55 C 92 70, 75 95, 50 85 Z" fill="url(#greenBrainGrad2)" />
      <path d="M 62 105 C 45 90, 60 70, 82 78 C 88 95, 75 115, 62 105 Z" fill="url(#greenBrainGrad1)" />
      <path d="M 80 120 C 65 115, 70 95, 90 92 C 95 105, 90 125, 80 120 Z" fill="url(#greenBrainGrad2)" />

      <path d="M 150 85 C 160 60, 130 45, 112 55 C 108 70, 125 95, 150 85 Z" fill="url(#greenBrainGrad2)" />
      <path d="M 138 105 C 155 90, 140 70, 118 78 C 112 95, 125 115, 138 105 Z" fill="url(#greenBrainGrad1)" />
      <path d="M 120 120 C 135 115, 130 95, 110 92 C 105 105, 110 125, 120 120 Z" fill="url(#greenBrainGrad2)" />

      <path d="M 98 42 C 96 70, 97 100, 99 125" stroke="#a7f3d0" strokeWidth="3" strokeLinecap="round" opacity="0.7" />

      <g transform="translate(86, 60) scale(0.7)">
        <path
          d="M 10 10 L 22 10 C 22 5, 27 5, 27 10 L 38 10 L 38 22 C 43 22, 43 27, 38 27 L 38 38 L 27 38 C 27 43, 22 43, 22 38 L 10 38 L 10 27 C 5 27, 5 22, 10 22 Z"
          fill="#ecfdf5"
          stroke="#059669"
          strokeWidth="2"
        />
      </g>

      <circle cx="28" cy="78" r="4" fill="#6ee7b7" opacity="0.9" />
      <circle cx="172" cy="92" r="5" fill="#34d399" opacity="0.8" />
    </svg>
  </div>
);

const Aptitude = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [notesTopic, setNotesTopic] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [assessments, setAssessments] = useState([]);

  const refreshResults = async () => {
    const res = await getResults();
    setAllResults(res);
  };

  const loadAssessments = async () => {
    const data = await getAssessments();
    setAssessments(data);
  };

  useEffect(() => {
    loadAssessments();
    refreshResults();

    const handleUpdate = () => {
      loadAssessments();
      refreshResults();
    };

    window.addEventListener('nexus-data-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('nexus-data-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const getTopicResult = (topicParam) => {
    if (!allResults || !allResults.length || !topicParam) return null;
    const targetId = typeof topicParam === 'object' ? String(topicParam.id || '').toLowerCase().trim() : String(topicParam || '').toLowerCase().trim();
    const targetTopic = typeof topicParam === 'object' ? String(topicParam.topic || topicParam.title || '').toLowerCase().trim() : String(topicParam || '').toLowerCase().trim();

    // 1. Filter all results matching this assessment topic ID or title
    const topicMatches = allResults.filter(r => {
      const rAssessmentId = String(r.assessmentId || r.assessment_id || '').toLowerCase().trim();
      const rTopic = String(r.topic || r.topicName || '').toLowerCase().trim();

      return (targetId && rAssessmentId === targetId) ||
             (targetTopic && rTopic === targetTopic) ||
             (targetTopic && rAssessmentId === targetTopic) ||
             (targetId && rTopic === targetId);
    });

    if (!topicMatches || topicMatches.length === 0) return null;

    // 2. If user exists, find exact user match
    if (user) {
      const uId = String(user.id || '').toLowerCase().trim();
      const uEmail = String(user.email || '').toLowerCase().trim();

      const userMatch = topicMatches.find(r => {
        const rUid = String(r.userId || r.user_id || '').toLowerCase().trim();
        const rEmail = String(r.userEmail || r.user_email || '').toLowerCase().trim();
        return (uId && rUid && uId === rUid) ||
               (uEmail && rEmail && uEmail === rEmail) ||
               (uId && rEmail && uId === rEmail);
      });

      // If user's submission was deleted, return null to immediately display "START TEST"
      return userMatch || null;
    }

    // 3. Guest / Anonymous fallback
    return topicMatches[0] || null;
  };

  const topicsForCategory = (category) => {
    if (!assessments || !category) return [];
    const searchCat = category.toLowerCase().trim();
    return assessments.filter(a => {
      const aCat = (a.category || '').toLowerCase().trim();
      return aCat === searchCat;
    });
  };

  const currentCategoryTopics = selectedCategory ? topicsForCategory(selectedCategory) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem', boxSizing: 'border-box' }}>
      {/* Reference Notes Modal */}
      {notesTopic && (
        <ReferenceNotesModal
          topicItem={notesTopic}
          onClose={() => setNotesTopic(null)}
          onStartAssessment={() => {
            const topicToStart = notesTopic;
            setNotesTopic(null);
            if (topicToStart) {
              setActiveAssessment(topicToStart);
            }
          }}
        />
      )}

      {/* Assessment Modal Container */}
      {activeAssessment && (
        <AssessmentModal
          assessment={activeAssessment}
          previousResult={activeAssessment.previousResult}
          onClose={() => {
            setActiveAssessment(null);
            refreshResults();
          }}
        />
      )}

      {/* Main Categories Selection View */}
      {!selectedCategory && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: isDark ? 'rgba(40, 114, 161, 0.25)' : '#EFF6FB', color: isDark ? '#4A90C2' : '#2872A1' }}>
                  <TrendingUp size={18} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: isDark ? '#4A90C2' : '#2872A1' }}>
                  SKILL ASSESSMENT
                </span>
              </div>
              <h1 style={{ fontSize: '38px', fontWeight: 900, color: isDark ? '#F3F7FB' : '#0D1B2A', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                Aptitude & Logical Reasoning
              </h1>
              <p style={{ fontSize: '15px', color: isDark ? '#CBDDE9' : '#415A77', margin: 0, fontWeight: 500 }}>
                Select a category to explore topics and sharpen your skills.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {CATEGORY_META.map((cat, i) => {
              const topicCount = topicsForCategory(cat.title).length;

              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => setSelectedCategory(cat.title)}
                  style={{
                    borderRadius: '24px',
                    backgroundColor: isDark ? '#0E2740' : '#ffffff',
                    border: isDark ? '1px solid rgba(203, 221, 233, 0.15)' : '1px solid #CBDDE9',
                    boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.35)' : '0 4px 20px rgba(13, 27, 42, 0.04)',
                    padding: '28px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '24px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: isDark ? `${cat.color}25` : `${cat.color}15`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {React.createElement(cat.icon, { size: 24 })}
                    </div>
                    <span style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: isDark ? 'rgba(203,221,233,0.1)' : '#EFF6FB', color: isDark ? '#CBDDE9' : '#2872A1', fontSize: '11px', fontWeight: 800 }}>
                      {cat.code}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 900, color: isDark ? '#F3F7FB' : '#0D1B2A', margin: '0 0 6px 0' }}>
                      {cat.title}
                    </h3>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#8EA6BC' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                      {topicCount > 0 ? `${topicCount} Topics Available` : 'Modules Active'}
                    </p>
                  </div>

                  <button
                    style={{
                      padding: '10px 20px',
                      borderRadius: '9999px',
                      border: 'none',
                      backgroundColor: isDark ? `${cat.color}25` : `${cat.color}15`,
                      color: cat.color,
                      fontSize: '13px',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      alignSelf: 'flex-start'
                    }}
                  >
                    <span>Explore Category</span>
                    <ArrowRight size={14} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Category Topics View */}
      {selectedCategory && (
        <>
          {/* Top Navigation Link */}
          <div style={{ marginBottom: '12px' }}>
            <button
              onClick={() => setSelectedCategory(null)}
              style={{ background: 'none', border: 'none', color: isDark ? '#4A90C2' : '#2872A1', fontWeight: 700, fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Categories</span>
            </button>
          </div>

          {/* Top Header Row */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 900, color: isDark ? '#F3F7FB' : '#0D1B2A', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              {selectedCategory} Topics
            </h1>
            <p style={{ fontSize: '15px', color: isDark ? '#CBDDE9' : '#415A77', margin: 0, fontWeight: 500 }}>
              Select a module to explore your skills and unlock achievements.
            </p>
          </div>

          {/* Main Topic Module Cards Grid */}
          {currentCategoryTopics.length === 0 ? (
            <div style={{
              padding: '56px 32px',
              textAlign: 'center',
              backgroundColor: isDark ? '#0E2740' : '#ffffff',
              border: isDark ? '1px solid rgba(203, 221, 233, 0.15)' : '1px solid #CBDDE9',
              borderRadius: '28px',
              marginBottom: '36px',
              boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.2)' : '0 8px 30px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                backgroundColor: isDark ? 'rgba(40, 114, 161, 0.25)' : '#EFF6FB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                color: isDark ? '#4A90C2' : '#2872A1'
              }}>
                <HelpCircle size={32} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#F3F7FB' : '#0D1B2A', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>
                No Assessments Uploaded Yet
              </h3>
              <p style={{ fontSize: '14px', fontWeight: 500, color: isDark ? '#CBDDE9' : '#415A77', margin: 0, maxWidth: '420px', lineHeight: 1.6 }}>
                There are currently no active assessment modules for <strong>{selectedCategory}</strong>. New tests uploaded from the Admin Panel will automatically appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '36px' }}>
              {currentCategoryTopics.map((topicItem, idx) => {
                const res = getTopicResult(topicItem);
                const isCompleted = !!res;
                const qCount = topicItem.questions ? topicItem.questions.length : 20;
                const timeLimit = topicItem.timeLimit || 20;

                // Schedule Unlock Logic
                const unlockDate = topicItem.unlockTime ? new Date(topicItem.unlockTime) : null;
                const isScheduledLocked = unlockDate && !isNaN(unlockDate.getTime()) && unlockDate.getTime() > Date.now();

                const formattedUnlock = unlockDate && !isNaN(unlockDate.getTime())
                  ? unlockDate.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()
                  : null;

                return (
                  <div
                    key={topicItem.id || idx}
                    style={{
                      borderRadius: '28px',
                      backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
                      border: isDark 
                        ? '1px solid rgba(203, 221, 233, 0.15)'
                        : '1px solid #CBDDE9',
                      boxShadow: isDark 
                        ? '0 8px 30px rgba(0,0,0,0.35)'
                        : '0 6px 20px rgba(40, 114, 161, 0.08)',
                      padding: '32px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* Header Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <span style={{ padding: '6px 14px', borderRadius: '9999px', backgroundColor: isDark ? 'rgba(40, 114, 161, 0.25)' : '#EFF6FB', color: isDark ? '#4A90C2' : '#2872A1', fontSize: '12px', fontWeight: 800, letterSpacing: '0.05em' }}>
                        {topicItem.week || `WEEK ${Math.floor(idx / 2) + 1}`}
                      </span>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '9999px', backgroundColor: isScheduledLocked ? (isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2') : (isDark ? 'rgba(203,221,233,0.1)' : '#EFF6FB'), color: isScheduledLocked ? '#ef4444' : (isDark ? '#CBDDE9' : '#2872A1'), fontSize: '12px', fontWeight: 800 }}>
                        {isScheduledLocked ? <Lock size={14} /> : (isCompleted ? <Award size={14} /> : <Zap size={14} />)}
                        <span>
                          {isScheduledLocked 
                            ? `UNLOCKS: ${formattedUnlock}` 
                            : (isCompleted ? `PASSED: ${res.percentage}%` : 'AVAILABLE NOW')
                          }
                        </span>
                      </div>
                    </div>

                    {/* Main Content & Graphic Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', margin: '8px 0' }}>
                      <div style={{ flex: 1 }}>
                        {/* Stat Indicators */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontWeight: 800, color: isDark ? '#4A90C2' : '#2872A1', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: isDark ? 'rgba(40, 114, 161, 0.25)' : '#EFF6FB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#4A90C2' : '#2872A1' }}>
                              <HelpCircle size={14} />
                            </div>
                            <span style={{ color: isDark ? '#F3F7FB' : '#0D1B2A' }}>{qCount} QNS</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: isDark ? 'rgba(40, 114, 161, 0.25)' : '#EFF6FB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#4A90C2' : '#2872A1' }}>
                              <Clock size={14} />
                            </div>
                            <span style={{ color: isDark ? '#F3F7FB' : '#0D1B2A' }}>{timeLimit} MIN</span>
                          </div>
                        </div>

                        <h3 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#F3F7FB' : '#0D1B2A', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>
                          {topicItem.topic || topicItem.title}
                        </h3>
                        <p style={{ fontSize: '13px', color: isDark ? '#CBDDE9' : '#415A77', lineHeight: 1.5, margin: '0 0 20px 0', maxWidth: '280px', fontWeight: 500 }}>
                          Focused practice module covering core concepts for {topicItem.topic || topicItem.title}.
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
                          <button
                            onClick={() => {
                              setNotesTopic({ ...topicItem, timeLimit, previousResult: res });
                            }}
                            style={{
                              padding: '10px 18px',
                              borderRadius: '12px',
                              border: isDark ? '1.5px solid rgba(74, 144, 194, 0.45)' : '1.5px solid #2872A1',
                              backgroundColor: isDark ? 'rgba(40, 114, 161, 0.25)' : '#EFF6FB',
                              color: isDark ? '#4A90C2' : '#2872A1',
                              fontSize: '12px',
                              fontWeight: 900,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s',
                              letterSpacing: '0.05em'
                            }}
                          >
                            <BookOpen size={14} />
                            <span>NOTES</span>
                          </button>

                          <button
                            onClick={() => {
                              if (isScheduledLocked) {
                                alert(`🔒 This assessment is locked until ${formattedUnlock}. Please check back after the scheduled time!`);
                                return;
                              }
                              setActiveAssessment({ ...topicItem, timeLimit, previousResult: res });
                            }}
                            style={{
                              padding: '10px 24px',
                              borderRadius: '12px',
                              border: isScheduledLocked ? '1px solid #CBDDE9' : 'none',
                              background: isScheduledLocked 
                                ? (isDark ? '#143555' : '#E2ECF4') 
                                : 'linear-gradient(135deg, #2872A1 0%, #4A90C2 100%)',
                              color: '#FFFFFF',
                              fontSize: '12px',
                              fontWeight: 900,
                              cursor: isScheduledLocked ? 'not-allowed' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              boxShadow: isScheduledLocked ? 'none' : '0 4px 14px rgba(40, 114, 161, 0.35)',
                              transition: 'all 0.2s',
                              letterSpacing: '0.05em',
                              opacity: isScheduledLocked ? 0.8 : 1
                            }}
                          >
                            <span>{isScheduledLocked ? 'LOCKED' : (isCompleted ? 'REVIEW' : 'START TEST')}</span>
                            {isScheduledLocked || isCompleted ? <Lock size={14} /> : <Zap size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Feature Highlights Banner */}
          <div
            style={{
              backgroundColor: isDark ? '#0E2740' : '#ffffff',
              border: isDark ? '1px solid rgba(203, 221, 233, 0.15)' : '1px solid #CBDDE9',
              borderRadius: '20px',
              padding: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', minWidth: '40px', borderRadius: '12px', backgroundColor: isDark ? 'rgba(40, 114, 161, 0.25)' : '#EFF6FB', color: isDark ? '#4A90C2' : '#2872A1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: isDark ? '#F3F7FB' : '#0D1B2A', margin: '0 0 4px 0' }}>Sharpen Your Skills</h4>
                <p style={{ fontSize: '12px', color: isDark ? '#CBDDE9' : '#64748B', margin: 0, lineHeight: 1.4 }}>
                  Practice with curated topics and real-world questions.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', minWidth: '40px', borderRadius: '12px', backgroundColor: isDark ? 'rgba(74, 144, 194, 0.2)' : '#EFF6FB', color: isDark ? '#4A90C2' : '#2872A1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: isDark ? '#F3F7FB' : '#0D1B2A', margin: '0 0 4px 0' }}>Track Progress</h4>
                <p style={{ fontSize: '12px', color: isDark ? '#CBDDE9' : '#64748B', margin: 0, lineHeight: 1.4 }}>
                  Monitor your performance and stay consistent.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', minWidth: '40px', borderRadius: '12px', backgroundColor: isDark ? 'rgba(40, 114, 161, 0.25)' : '#EFF6FB', color: isDark ? '#4A90C2' : '#2872A1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: isDark ? '#F3F7FB' : '#0D1B2A', margin: '0 0 4px 0' }}>Beat Your Best</h4>
                <p style={{ fontSize: '12px', color: isDark ? '#CBDDE9' : '#64748B', margin: 0, lineHeight: 1.4 }}>
                  Improve accuracy and speed over time.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', minWidth: '40px', borderRadius: '12px', backgroundColor: isDark ? 'rgba(74, 144, 194, 0.2)' : '#EFF6FB', color: isDark ? '#4A90C2' : '#2872A1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: isDark ? '#F3F7FB' : '#0D1B2A', margin: '0 0 4px 0' }}>Unlock Achievements</h4>
                <p style={{ fontSize: '12px', color: isDark ? '#CBDDE9' : '#64748B', margin: 0, lineHeight: 1.4 }}>
                  Complete modules and earn badges.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Floating Support Chat Button (Temporarily Disabled) */}
      {/*
      <button
        aria-label="Support Chat"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#2872A1',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <MessageSquare size={22} fill="currentColor" />
      </button>
      */}
    </div>
  );
};

export default Aptitude;
