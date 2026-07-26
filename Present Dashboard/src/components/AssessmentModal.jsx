import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Timer, CheckCircle, XCircle, ChevronRight, BookOpen, BarChart2, ArrowRight, FileText } from 'lucide-react';
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

const AssessmentModal = ({ assessment, onClose, previousResult = null }) => {
  const { user } = useAuth();
  const [phase, setPhase] = useState(previousResult ? 'result' : 'quiz');
  const [resultTab, setResultTab] = useState('summary');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(previousResult?.answers || {});
  const [selected, setSelected] = useState(null);

  const initialSeconds = (assessment?.timeLimit && typeof assessment.timeLimit === 'number' && assessment.timeLimit > 0)
    ? assessment.timeLimit * 60
    : 20 * 60;

  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [submitted, setSubmitted] = useState(!!previousResult);

  const questions = assessment?.questions || [];
  const total = questions.length || 20;

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
  };

  const handleNext = () => {
    if (selected === null) return;
    setAnswers(prev => ({ ...prev, [current]: selected }));
    setSelected(null);
    if (current < total - 1) setCurrent(c => c + 1);
    else handleSubmit({ ...answers, [current]: selected });
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
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

              <div style={{ height: '5px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${((current + 1) / total) * 100}%` }} style={{ height: '100%', background: '#6366f1', borderRadius: '999px' }} />
              </div>

              <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.875rem', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.5 }}>{q.question || q.text}</p>
              </div>

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

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={selected === null}
                style={{
                  width: '100%', padding: '12px', borderRadius: '12px', fontWeight: 800,
                  fontSize: '13px', color: 'white', border: 'none', cursor: selected !== null ? 'pointer' : 'not-allowed',
                  background: selected !== null ? '#5b46e0' : '#cbd5e1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                {current < total - 1 ? 'Next Question' : 'Submit Assessment'}
                <ChevronRight size={15} />
              </motion.button>
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
                    const userAns = answers[i];
                    const correct = userAns === q.answer;
                    return (
                      <div
                        key={i}
                        style={{
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
                              {q.question || q.text}
                            </p>
                          </div>
                        </div>

                        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', background: '#f8fafc' }}>
                          {q.options.map((opt, oi) => {
                            const isCorrect = oi === q.answer;
                            const isUserWrong = oi === userAns && !correct;
                            const bg = isCorrect ? '#dcfce7' : isUserWrong ? '#fee2e2' : '#ffffff';
                            const border = isCorrect ? '1px solid #86efac' : isUserWrong ? '1px solid #fca5a5' : '1px solid #e2e8f0';
                            const color = isCorrect ? '#15803d' : isUserWrong ? '#b91c1c' : '#334155';

                            return (
                              <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: bg, border, transition: 'all 0.15s' }}>
                                <span style={{ fontSize: '12px', fontWeight: 800, color, minWidth: '20px' }}>{String.fromCharCode(65 + oi)}.</span>
                                <span style={{ fontSize: '13px', fontWeight: isCorrect || isUserWrong ? 700 : 500, color }}>{opt}</span>
                                {isCorrect && <CheckCircle size={14} style={{ color: '#16a34a', marginLeft: 'auto', flexShrink: 0 }} />}
                                {isUserWrong && <XCircle size={14} style={{ color: '#dc2626', marginLeft: 'auto', flexShrink: 0 }} />}
                              </div>
                            );
                          })}
                        </div>

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
    </AnimatePresence>,
    document.body
  );
};

export default AssessmentModal;
