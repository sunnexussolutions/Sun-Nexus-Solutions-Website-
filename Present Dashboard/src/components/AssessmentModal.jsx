import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Timer, CheckCircle, XCircle, ChevronRight, ChevronLeft, BookOpen, BarChart2, ArrowRight, FileText, Lightbulb, Zap, PlayCircle } from 'lucide-react';
import { saveResult } from '../store/dataStore';
import { useAuth } from '../contexts/AuthContext';

/** Golden 3D Trophy with particles graphic matching the reference image */
const TrophyGraphic = () => (
  <div style={{ position: 'relative', width: '110px', height: '76px', margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg viewBox="0 0 160 120" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="goldCupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="goldStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fef3c7" />
        </linearGradient>
      </defs>

      {/* Floating Particles around Trophy */}
      <circle cx="25" cy="40" r="2.5" fill="#38bdf8" />
      <rect x="50" y="20" width="4" height="4" rx="1" fill="#f59e0b" transform="rotate(25 50 20)" />
      <circle cx="55" cy="55" r="3" fill="#a855f7" />
      <circle cx="100" cy="22" r="3" fill="#fb923c" />
      <circle cx="140" cy="40" r="2.5" fill="#a855f7" />
      <rect x="135" y="70" width="4" height="4" rx="1" fill="#818cf8" transform="rotate(45 135 70)" />
      <circle cx="125" cy="90" r="2" fill="#38bdf8" opacity="0.8" />
      <circle cx="35" cy="85" r="3" fill="#c084fc" opacity="0.8" />

      {/* Base */}
      <rect x="52" y="98" width="56" height="12" rx="4" fill="url(#goldStemGrad)" />
      <path d="M 68 82 L 92 82 L 88 98 L 72 98 Z" fill="url(#goldStemGrad)" />

      {/* Cup Handles */}
      <path d="M 45 42 C 30 42, 30 70, 52 72 L 52 64 C 40 64, 40 48, 48 48 Z" fill="#d97706" />
      <path d="M 115 42 C 130 42, 130 70, 108 72 L 108 64 C 120 64, 120 48, 112 48 Z" fill="#d97706" />

      {/* Main Cup */}
      <path d="M 46 36 L 114 36 Q 112 78 80 80 Q 48 78 46 36 Z" fill="url(#goldCupGrad)" />
      <ellipse cx="80" cy="36" rx="34" ry="6" fill="#fef3c7" opacity="0.6" />

      {/* White Star on Cup */}
      <polygon
        points="80,48 83,56 92,56 85,61 87,70 80,64 73,70 75,61 68,56 77,56"
        fill="url(#starGrad)"
      />
    </svg>
  </div>
);

// Comprehensive Reference Notes & Formula Cheatsheets for Aptitude topics
const REFERENCE_NOTES_DATA = {
  'Fractions and Decimals': {
    notes: [
      'Convert fraction to decimal by dividing numerator by denominator (e.g., 3/4 = 0.75).',
      'Cross-multiplication rule: To compare A/B and C/D, compare A×D and B×C.',
      'Recurring decimals: 0.333... = 1/3, 0.666... = 2/3, 0.111... = 1/9.',
      'Addition & Subtraction: Always find the Least Common Multiple (LCM) of denominators first.'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=tnc9ojITRg4',
    cheatsheet: 'A/B + C/D = (A×D + B×C) / (B×D)'
  },
  'Simplification': {
    notes: [
      'BODMAS Order: Brackets () [] {}, Orders/Exponents x², Division ÷, Multiplication ×, Addition +, Subtraction -.',
      'Key Algebraic Identities:',
      '  - (a + b)² = a² + 2ab + b²',
      '  - (a - b)² = a² - 2ab + b²',
      '  - a² - b² = (a - b)(a + b)',
      '  - (a + b)³ = a³ + b³ + 3ab(a + b)'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=ZuMJFleXmiw',
    cheatsheet: 'Follow BODMAS strictly left-to-right for operators with same priority.'
  },
  'Surds and Indices': {
    notes: [
      'Product Rule: aᵐ × aⁿ = aᵐ⁺ⁿ',
      'Quotient Rule: aᵐ ÷ aⁿ = aᵐ⁻ⁿ',
      'Power of Power Rule: (aᵐ)ⁿ = aᵐⁿ',
      'Zero Index: a⁰ = 1 (where a ≠ 0)',
      'Negative Exponent: a⁻ⁿ = 1 / aⁿ',
      'Radical Product: √(a × b) = √a × √b'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=jAbpPTpz2bQ',
    cheatsheet: 'If aᵐ = aⁿ, then m = n (for base a > 0 and a ≠ 1)'
  },
  'Permutation & Combination': {
    notes: [
      'Permutation (Order Matters): P(n, r) = n! / (n - r)!',
      'Combination (Selection Only): C(n, r) = n! / [r! (n - r)!]',
      'Circular Permutation: (n - 1)! for n distinct items in a circle.',
      'Handshakes/Matches Formula: C(n, 2) = n(n - 1) / 2'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=ETiRE7N7pEI',
    cheatsheet: 'P(n, r) = C(n, r) × r!'
  },
  'Syllogisms': {
    notes: [
      'All A are B: Set A is completely inside Set B.',
      'No A is B: Sets A and B have 0 intersection.',
      'Some A are B: Sets A and B overlap (at least 1 element in common).',
      'Some A are not B: At least 1 element of A is outside B.',
      'Either/Or Condition: Both individual conclusions must be uncertain, one positive and one negative.'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=syllogisms+logical+reasoning',
    cheatsheet: 'Draw minimum overlapping Venn diagrams for quick verification.'
  },
  'Blood Relations': {
    notes: [
      'Male (+), Female (-), Married couple (=), Siblings (-).',
      'Father/Mother = 1 generation above (+1).',
      'Grandfather/Grandmother = 2 generations above (+2).',
      'Brother/Sister/Cousin = Same generation (0).',
      'Son/Daughter = 1 generation below (-1).'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=blood+relations+logical+reasoning',
    cheatsheet: 'Replace names with family tree relations from self perspective.'
  },
  'Seating Arrangement': {
    notes: [
      'Facing Inside (Center): Clockwise = LEFT, Anti-clockwise = RIGHT.',
      'Facing Outside: Clockwise = RIGHT, Anti-clockwise = LEFT.',
      'Linear Row (Facing North): Left = West, Right = East.',
      'Tip: Always start with fixed, definite positions before relative clues.'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=seating+arrangement+reasoning',
    cheatsheet: 'Circle Center: Clockwise = Left | Circle Outside: Clockwise = Right'
  },
  'Coding-Decoding': {
    notes: [
      'Forward Letter Positions: A=1, B=2, C=3 ... Z=26',
      'EJOTY Shortcut: E=5, J=10, O=15, T=20, Y=25',
      'Reverse Position Formula: Reverse Rank = 27 - Forward Rank',
      'Opposite Pairs: A-Z, B-Y, C-X, D-W, E-V, F-U, G-T, H-S, I-R, J-Q, K-P, L-O, M-N'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=coding+decoding+reasoning',
    cheatsheet: 'Sum of forward rank and reverse rank of any letter = 27'
  },
  'Direction Sense': {
    notes: [
      'Cardinal Directions: North (Up), South (Down), East (Right), West (Left).',
      'Turns: Right Turn = 90° Clockwise | Left Turn = 90° Anti-clockwise.',
      'Shortest Distance: Use Pythagoras Theorem: Hypotenuse = √(Base² + Height²).',
      'Sun Shadow: Morning shadow is to the West; Evening shadow is to the East.'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=direction+sense+reasoning',
    cheatsheet: 'Right = 90° CW | Left = 90° CCW | Shortest Path = √(x² + y²)'
  },
  'Synonyms & Antonyms': {
    notes: [
      'Context Clues: Identify whether sentence tone is positive (+), negative (-), or neutral.',
      'Prefix Meanings: Un-, Dis-, In-, Im-, Non- mean NOT.',
      'Root Words: Bene- (Good), Mal- (Bad), Chrono- (Time), Tele- (Far), Dict- (Speak).'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=synonyms+antonyms+verbal+ability',
    cheatsheet: 'Eliminate options that have opposite connotation to the target word.'
  },
  'Sentence Correction': {
    notes: [
      'Subject-Verb Agreement: Singular subjects take singular verbs.',
      'Parallelism: Items in a series must share grammatical form (e.g. running, swimming, and biking).',
      'Pronoun Agreement: Pronouns must match their antecedents in number and gender.',
      'Modifiers: Place descriptive phrases next to the noun they modify.'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=sentence+correction+verbal+ability',
    cheatsheet: 'Identify subject & main verb first to test agreement.'
  },
  'Reading Comprehension': {
    notes: [
      'Skimming Strategy: Read first and last paragraphs + first sentence of middle paragraphs.',
      'Question Types: Main Idea, Author Tone, Fact-based, Inference, Vocabulary in Context.',
      'Elimination Tip: Beware of extreme words (Always, Never, Only, Must).'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=reading+comprehension+verbal+ability',
    cheatsheet: 'Passage Evidence > Personal Knowledge. Never assume outside facts.'
  },
  'Cloze Test': {
    notes: [
      'Read full passage once before filling blanks to grasp overall context.',
      'Check Grammar: Preposition collocations (e.g., Interested IN, Accused OF).',
      'Tense Continuity: Ensure verb tenses match surrounding sentences.'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=cloze+test+verbal+ability',
    cheatsheet: 'Identify required part of speech (noun/verb/adj) before choosing option.'
  }
};

const AssessmentModal = ({ assessment, onClose, previousResult = null }) => {
  const { user } = useAuth();
  const [phase, setPhase] = useState(previousResult ? 'result' : 'quiz');
  const [resultTab, setResultTab] = useState('summary');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(previousResult?.answers || {});
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showReferenceNotes, setShowReferenceNotes] = useState(false);

  const initialSeconds = (assessment?.timeLimit && typeof assessment.timeLimit === 'number' && assessment.timeLimit > 0)
    ? assessment.timeLimit * 60
    : 20 * 60;

  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [submitted, setSubmitted] = useState(!!previousResult);

  const questions = assessment?.questions || [];
  const total = questions.length || 20;

  // Sync selected option state when moving between questions
  useEffect(() => {
    setSelected(answers[current] !== undefined ? answers[current] : null);
  }, [current]);

  const handleSubmit = useCallback((finalAnswers) => {
    if (submitted) return;
    setSubmitted(true);
    const ans = finalAnswers || { ...answers, ...(selected !== null ? { [current]: selected } : {}) };
    const score = questions.reduce((acc, q, i) => acc + (ans[i] === q.answer ? 1 : 0), 0);
    const result = {
      assessmentId: assessment.id,
      topic: assessment.topic || assessment.title,
      category: assessment.category,
      score,
      total,
      percentage: Math.round((score / total) * 100),
      answers: ans,
      userEmail: user?.email || 'guest',
      userName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username || 'Guest',
      userId: user?.id,
    };
    saveResult(result);
    setAnswers(ans);
    setPhase('result');
  }, [submitted, answers, selected, current, questions, assessment, user, total]);

  useEffect(() => {
    if (phase !== 'quiz' || submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [phase, submitted, timeLeft, handleSubmit]);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const timerColor = timeLeft < 60 ? '#ef4444' : timeLeft < 300 ? '#f59e0b' : '#6366f1';

  const handleSelect = (optIdx) => {
    if (submitted) return;
    setSelected(optIdx);
    setAnswers(prev => ({ ...prev, [current]: optIdx }));
  };

  const handlePrev = () => {
    if (current > 0) {
      setShowHint(false);
      setCurrent(c => c - 1);
    }
  };

  const handleNext = () => {
    setShowHint(false);
    if (current < total - 1) {
      setCurrent(c => c + 1);
    } else {
      handleSubmit({ ...answers, ...(selected !== null ? { [current]: selected } : {}) });
    }
  };

  const q = questions[current];

  // Calculated Metrics
  const finalScore = previousResult ? previousResult.score : questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);
  const pct = previousResult ? previousResult.percentage : Math.round((finalScore / (total || 1)) * 100);
  const wrongCount = Math.max(0, total - finalScore);

  const gradeText = pct >= 80 ? 'Excellent Work!' : pct >= 60 ? 'Good Job!' : 'Keep Practicing!';

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
        }}
      />
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', pointerEvents: 'none' }}>
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          style={{
            pointerEvents: 'auto',
            width: '100%',
            maxWidth: '440px',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            color: '#0f172a',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {phase === 'quiz' && q && (
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#64748b', marginBottom: '2px' }}>
                    {assessment.category} · {assessment.topic || assessment.title}
                  </p>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    Question {current + 1} of {total}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => setShowReferenceNotes(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '4px 11px', borderRadius: '999px',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                      color: '#ffffff', border: 'none',
                      fontSize: '12px', fontWeight: 800, cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)',
                      transition: 'all 0.2s', flexShrink: 0
                    }}
                  >
                    <BookOpen size={13} />
                    <span>Reference Notes</span>
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', background: `${timerColor}15`, border: `1px solid ${timerColor}40` }}>
                    <Timer size={13} style={{ color: timerColor }} />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: timerColor }}>{formatTime(timeLeft)}</span>
                  </div>
                  <button
                    onClick={onClose}
                    style={{ padding: '6px 10px', borderRadius: '10px', color: '#ef4444', background: '#fee2e2', border: 'none', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Question Index Pills Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                {questions.map((_, idx) => {
                  const isCurrent = idx === current;
                  const isAnswered = answers[idx] !== undefined;
                  return (
                    <button
                      key={idx}
                      onClick={() => { setShowHint(false); setCurrent(idx); }}
                      style={{
                        width: '26px',
                        height: '26px',
                        minWidth: '26px',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        border: isCurrent ? '2px solid #5b46e0' : '1px solid #e2e8f0',
                        backgroundColor: isCurrent ? '#5b46e0' : (isAnswered ? '#eeeffe' : '#f8fafc'),
                        color: isCurrent ? '#ffffff' : (isAnswered ? '#5b46e0' : '#64748b'),
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        flexShrink: 0
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div style={{ height: '5px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${((current + 1) / total) * 100}%` }} style={{ height: '100%', background: '#6366f1', borderRadius: '999px' }} />
              </div>

              {/* Question Statement Container */}
              <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.875rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Question Statement</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => setShowReferenceNotes(true)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '4px 10px', borderRadius: '20px',
                        background: '#f3e8ff',
                        border: '1px solid #d8cefe',
                        color: '#6d28d9',
                        fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <BookOpen size={13} style={{ color: '#6d28d9' }} />
                      <span>Notes</span>
                    </button>
                    <button
                      onClick={() => setShowHint(prev => !prev)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '4px 10px', borderRadius: '20px',
                        background: showHint ? '#fef3c7' : '#ffffff',
                        border: showHint ? '1px solid #f59e0b' : '1px solid #cbd5e1',
                        color: showHint ? '#d97706' : '#475569',
                        fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Lightbulb size={13} style={{ color: showHint ? '#d97706' : '#64748b' }} />
                      <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.5, margin: 0 }}>{q.question || q.text}</p>
              </div>

              {/* Hint Box Container */}
              {showHint && (() => {
                const hintContent = q.hint && String(q.hint).trim() ? String(q.hint).trim() : '';
                const hasHint = Boolean(hintContent);

                return (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: hasHint ? 'rgba(254, 243, 199, 0.7)' : 'rgba(241, 245, 249, 0.9)',
                      border: hasHint ? '1px solid #fcd34d' : '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    <Lightbulb size={16} style={{ color: hasHint ? '#b45309' : '#64748b', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 800, color: hasHint ? '#92400e' : '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px 0' }}>
                        {hasHint ? 'Helpful Hint' : 'Notice'}
                      </p>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: hasHint ? '#78350f' : '#64748b', margin: 0, lineHeight: 1.4 }}>
                        {hasHint ? hintContent : 'There is no hint provided for this question.'}
                      </p>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options.map((opt, i) => {
                  const isSelected = selected === i;
                  return (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(i)}
                      style={{
                        width: '100%', padding: '12px 14px', borderRadius: '12px', textAlign: 'left',
                        fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
                        background: isSelected ? '#eeeffe' : '#ffffff',
                        border: isSelected ? '2px solid #5b46e0' : '1.5px solid #e2e8f0',
                        color: isSelected ? '#5b46e0' : '#334155',
                      }}
                    >
                      <span style={{ marginRight: '10px', fontWeight: 800, color: isSelected ? '#5b46e0' : '#94a3b8' }}>
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>

              {/* ── PREVIOUS & NEXT / SUBMIT BUTTONS ROW ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePrev}
                  disabled={current === 0}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '13px',
                    color: current === 0 ? '#94a3b8' : '#475569',
                    border: '1.5px solid #cbd5e1',
                    backgroundColor: current === 0 ? '#f1f5f9' : '#ffffff',
                    cursor: current === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  style={{
                    flex: 1.2,
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '13px',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: '#5b46e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(91, 70, 224, 0.3)',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{current < total - 1 ? 'Next Question' : 'Submit Assessment'}</span>
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            </div>
          )}

          {phase === 'result' && (
            <div style={{ display: 'flex', flexDirection: 'column', padding: '18px 22px 22px' }}>
              {/* ── TOP NAV TABS ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '18px' }}>
                <button
                  onClick={() => setResultTab('summary')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: 800,
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: resultTab === 'summary' ? '#5b46e0' : '#64748b',
                    position: 'relative',
                    paddingBottom: '6px',
                  }}
                >
                  <BarChart2 size={16} style={{ color: resultTab === 'summary' ? '#5b46e0' : '#64748b' }} />
                  <span>Summary</span>
                  {resultTab === 'summary' && (
                    <motion.div
                      layoutId="tabUnderline"
                      style={{
                        position: 'absolute',
                        bottom: '-11px',
                        left: 0,
                        right: 0,
                        height: '3px',
                        backgroundColor: '#5b46e0',
                        borderRadius: '3px 3px 0 0',
                      }}
                    />
                  )}
                </button>

                <button
                  onClick={() => setResultTab('review')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: 700,
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: resultTab === 'review' ? '#5b46e0' : '#64748b',
                    position: 'relative',
                    paddingBottom: '6px',
                  }}
                >
                  <BookOpen size={16} style={{ color: resultTab === 'review' ? '#5b46e0' : '#64748b' }} />
                  <span>Review Mistakes</span>
                  {wrongCount > 0 && (
                    <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '999px', backgroundColor: '#fee2e2', color: '#ef4444' }}>
                      {wrongCount}
                    </span>
                  )}
                  {resultTab === 'review' && (
                    <motion.div
                      layoutId="tabUnderline"
                      style={{
                        position: 'absolute',
                        bottom: '-11px',
                        left: 0,
                        right: 0,
                        height: '3px',
                        backgroundColor: '#5b46e0',
                        borderRadius: '3px 3px 0 0',
                      }}
                    />
                  )}
                </button>

                <button
                  onClick={() => setShowReferenceNotes(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: 800,
                    border: '1px solid #d8cefe',
                    background: '#f3e8ff',
                    cursor: 'pointer',
                    color: '#6d28d9',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    marginLeft: 'auto',
                    transition: 'all 0.2s'
                  }}
                >
                  <BookOpen size={14} style={{ color: '#6d28d9' }} />
                  <span>Reference Notes</span>
                </button>
              </div>

              {/* ── SUMMARY TAB CONTENT (Proportional & Compact) ── */}
              {resultTab === 'summary' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                  {/* Hero Trophy Illustration */}
                  <TrophyGraphic />

                  {/* Heading & Subtitle */}
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#3b0764', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
                      {gradeText}
                    </h2>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', margin: 0 }}>
                      {assessment?.topic || assessment?.title || 'Puzzles (Mixed Logic)'} · {assessment?.category || 'Logical Reasoning'}
                    </p>
                  </div>

                  {/* Circular Donut Score Chart (Scaled to 110px) */}
                  <div style={{ position: 'relative', width: '110px', height: '110px', margin: '2px 0' }}>
                    <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="55" cy="55" r="44" fill="none" stroke="#f3e8ff" strokeWidth="9" />
                      <motion.circle
                        cx="55"
                        cy="55"
                        r="44"
                        fill="none"
                        stroke="#5b46e0"
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 44}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - pct / 100) }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{pct}%</span>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>SCORE</span>
                    </div>
                  </div>

                  {/* 2 Metric Cards Grid (Correct vs Wrong) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
                    {/* Correct Card */}
                    <div style={{ padding: '14px 10px', borderRadius: '16px', backgroundColor: '#f0fdf4', border: '1.5px solid #dcfce7', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                        <CheckCircle size={16} />
                      </div>
                      <span style={{ fontSize: '24px', fontWeight: 900, color: '#059669', lineHeight: 1, marginBottom: '4px' }}>
                        {finalScore}
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#475569', marginBottom: '2px' }}>
                        CORRECT
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                        Good job! Keep it up.
                      </span>
                    </div>

                    {/* Wrong Card */}
                    <div style={{ padding: '14px 10px', borderRadius: '16px', backgroundColor: '#fef2f2', border: '1.5px solid #fee2e2', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                        <XCircle size={16} />
                      </div>
                      <span style={{ fontSize: '24px', fontWeight: 900, color: '#dc2626', lineHeight: 1, marginBottom: '4px' }}>
                        {wrongCount}
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#475569', marginBottom: '2px' }}>
                        WRONG
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                        Review to improve score.
                      </span>
                    </div>
                  </div>

                  {/* Middle Review Mistakes Banner */}
                  <button
                    onClick={() => setResultTab('review')}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      backgroundColor: '#f3e8ff',
                      border: '1px solid #e9d5ff',
                      color: '#5b46e0',
                      fontWeight: 800,
                      fontSize: '11px',
                      letterSpacing: '0.04em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <BookOpen size={15} />
                    <span>REVIEW {wrongCount} MISTAKES & EXPLANATIONS</span>
                    <ArrowRight size={14} />
                  </button>

                  {/* Bottom Action Bar (Close & Review Answers) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', marginTop: '2px' }}>
                    <button
                      onClick={onClose}
                      style={{
                        flex: 1,
                        padding: '11px',
                        borderRadius: '12px',
                        border: '1.5px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        color: '#334155',
                        fontWeight: 800,
                        fontSize: '13px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'background 0.2s',
                      }}
                    >
                      Close
                    </button>
                    <button
                      onClick={() => setResultTab('review')}
                      style={{
                        flex: 1.2,
                        padding: '11px',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: '#5b46e0',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '12px',
                        letterSpacing: '0.04em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(91, 70, 224, 0.3)',
                      }}
                    >
                      <FileText size={14} />
                      <span>REVIEW ANSWERS</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── REVIEW TAB CONTENT ── */}
              {resultTab === 'review' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '65vh', overflowY: 'auto', paddingRight: '4px' }}>
                  {questions.map((q, i) => {
                    const userAns = answers[i] !== undefined ? answers[i] : (answers[String(i)] !== undefined ? answers[String(i)] : undefined);
                    const correct = userAns !== undefined && Number(userAns) === Number(q.answer);
                    const qText = q.question || q.text || q.statement || q.title || `Question ${i + 1}`;
                    let rawOpts = q.options;
                    if (typeof rawOpts === 'string') {
                      try { rawOpts = JSON.parse(rawOpts); } catch(e) {}
                    }
                    const opts = Array.isArray(rawOpts) && rawOpts.length > 0 
                      ? rawOpts 
                      : [q.optionA || q.optA || 'Option A', q.optionB || q.optB || 'Option B', q.optionC || q.optC || 'Option C', q.optionD || q.optD || 'Option D'];

                    return (
                      <div
                        key={i}
                        style={{
                          flexShrink: 0,
                          borderRadius: '16px',
                          overflow: 'hidden',
                          border: `1.5px solid ${correct ? '#bbf7d0' : '#fecaca'}`,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <div style={{ padding: '14px 16px', background: correct ? '#f0fdf4' : '#fef2f2', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          {correct
                            ? <CheckCircle size={18} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                            : <XCircle size={18} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />}
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', lineHeight: 1.5, margin: 0 }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: correct ? '#059669' : '#dc2626', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: '8px' }}>Q{i + 1}</span>
                              {qText}
                            </p>
                          </div>
                        </div>

                        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', background: '#f8fafc' }}>
                          {opts.map((opt, oi) => {
                            const isCorrect = oi === Number(q.answer);
                            const isUserWrong = userAns !== undefined && oi === Number(userAns) && !correct;
                            const bg = isCorrect ? '#dcfce7' : isUserWrong ? '#fee2e2' : '#ffffff';
                            const border = isCorrect ? '1px solid #86efac' : isUserWrong ? '1px solid #fca5a5' : '1px solid #e2e8f0';
                            const color = isCorrect ? '#15803d' : isUserWrong ? '#b91c1c' : '#334155';

                            return (
                              <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: bg, border, transition: 'all 0.15s' }}>
                                <span style={{ fontSize: '12px', fontWeight: 800, color, minWidth: '20px' }}>{String.fromCharCode(65 + oi)}.</span>
                                <span style={{ fontSize: '13px', fontWeight: isCorrect || isUserWrong ? 700 : 500, color }}>{String(opt)}</span>
                                {isCorrect && <CheckCircle size={14} style={{ color: '#16a34a', marginLeft: 'auto', flexShrink: 0 }} />}
                                {isUserWrong && <XCircle size={14} style={{ color: '#dc2626', marginLeft: 'auto', flexShrink: 0 }} />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Hint Section in Review Mistakes */}
                        {(() => {
                          const hintContent = q.hint && String(q.hint).trim() ? String(q.hint).trim() : '';
                          return (
                            <div style={{ padding: '10px 16px', background: hintContent ? '#fffbeb' : '#f8fafc', borderTop: '1px solid #fde68a', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                              <Lightbulb size={16} style={{ color: hintContent ? '#d97706' : '#94a3b8', flexShrink: 0, marginTop: '2px' }} />
                              <p style={{ fontSize: '12px', fontWeight: 500, color: hintContent ? '#78350f' : '#64748b', lineHeight: 1.5, margin: 0 }}>
                                <span style={{ fontWeight: 800, color: hintContent ? '#d97706' : '#64748b' }}>Hint: </span>
                                {hintContent ? hintContent : 'No hint provided for this question.'}
                              </p>
                            </div>
                          );
                        })()}

                        {q.explanation && (
                          <div style={{ padding: '12px 16px', background: '#f5f3ff', borderTop: '1px solid #ddd6fe', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <BookOpen size={16} style={{ color: '#5b46e0', flexShrink: 0, marginTop: '2px' }} />
                            <p style={{ fontSize: '12px', fontWeight: 500, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                              <span style={{ fontWeight: 800, color: '#5b46e0' }}>Explanation: </span>
                              {q.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <button
                      onClick={() => setResultTab('summary')}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '14px',
                        fontWeight: 800,
                        fontSize: '14px',
                        color: '#ffffff',
                        background: '#5b46e0',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <BarChart2 size={16} /> Back to Summary
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Reference Notes Modal Overlay Popup */}
      {showReferenceNotes && (() => {
        const topicName = assessment?.topic || assessment?.title || '';
        const refData = REFERENCE_NOTES_DATA[topicName] || {
          notes: [
            `Review key fundamentals, rules, and formulas for ${topicName || assessment?.category || 'this module'}.`,
            'Pay close attention to problem statements and eliminate incorrect choices systematically.',
            'Double-check calculation steps before submitting final answer.'
          ],
          videoUrl: 'https://www.youtube.com/results?search_query=' + encodeURIComponent((topicName || 'aptitude') + ' reasoning tutorial'),
          cheatsheet: 'Key Formulas & Rules Cheatsheet for ' + (topicName || 'Assessment')
        };

        const customNotes = (q?.notes || q?.referenceNotes || assessment?.notes || assessment?.referenceNotes || '').trim();

        return (
          <>
            <motion.div
              key="refNotesBackdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReferenceNotes(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10005,
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(6px)',
              }}
            />
            <div style={{ position: 'fixed', inset: 0, zIndex: 10006, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', pointerEvents: 'none' }}>
              <motion.div
                key="refNotesModal"
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                style={{
                  pointerEvents: 'auto',
                  width: '100%',
                  maxWidth: '480px',
                  maxHeight: '85vh',
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 70px rgba(0, 0, 0, 0.35)',
                  color: '#0f172a',
                  fontFamily: "'Inter', sans-serif",
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Header */}
                <div style={{ padding: '18px 22px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={20} style={{ color: '#ffffff' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 900, margin: 0, letterSpacing: '-0.01em' }}>Reference Notes</h3>
                      <span style={{ fontSize: '11px', opacity: 0.9, fontWeight: 700 }}>
                        {assessment.category} · {topicName || 'Core Module'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReferenceNotes(false)}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Scrollable Notes Content */}
                <div style={{ padding: '20px 22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                  
                  {/* Custom Question/Admin Notes if available */}
                  {customNotes && (
                    <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                        <Lightbulb size={14} /> Question Specific Reference
                      </div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#166534', margin: 0, lineHeight: 1.5 }}>
                        {customNotes}
                      </p>
                    </div>
                  )}

                  {/* Core Concepts */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                      <FileText size={16} style={{ color: '#6d28d9' }} />
                      <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Core Concepts & Solving Rules</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {refData.notes.map((noteItem, idx) => (
                        <div key={idx} style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '12.5px', fontWeight: 600, color: '#334155', lineHeight: 1.5 }}>
                          {noteItem}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cheatsheet Banner */}
                  {refData.cheatsheet && (
                    <div style={{ padding: '14px 16px', borderRadius: '14px', background: 'linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%)', border: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Zap size={20} style={{ color: '#4f46e5', flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4338ca' }}>Quick Formula Cheatsheet</span>
                        <p style={{ fontSize: '13px', fontWeight: 800, color: '#1e1b4b', margin: '2px 0 0 0' }}>
                          {refData.cheatsheet}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Video Tutorial Option */}
                  {refData.videoUrl && (
                    <a
                      href={refData.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '12px 16px',
                        borderRadius: '14px',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        fontWeight: 800,
                        fontSize: '13px',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <PlayCircle size={20} style={{ color: '#dc2626' }} />
                        <span>Watch Video Explanation & Examples</span>
                      </div>
                      <ArrowRight size={16} />
                    </a>
                  )}
                </div>

                {/* Footer Action */}
                <div style={{ padding: '14px 22px', borderTop: '1px solid #f1f5f9', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowReferenceNotes(false)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: '#5b46e0',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(91, 70, 224, 0.25)'
                    }}
                  >
                    Back to Assessment
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        );
      })()}
    </AnimatePresence>,
    document.body
  );
};

export default AssessmentModal;
