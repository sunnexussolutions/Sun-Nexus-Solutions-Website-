import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Timer, CheckCircle, XCircle, Trophy, ChevronRight, RotateCcw, BookOpen, BarChart2 } from 'lucide-react';
import { saveResult } from '../store/dataStore';
import { useAuth } from '../contexts/AuthContext';

const AssessmentModal = ({ assessment, onClose, previousResult = null }) => {
  const { user } = useAuth();
  const [phase, setPhase] = useState(previousResult ? 'result' : 'quiz'); // 'quiz' | 'result'
  const [resultTab, setResultTab] = useState(previousResult ? 'review' : 'summary'); // 'summary' | 'review'
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(previousResult?.answers || {});
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(assessment.timeLimit * 60);
  const [submitted, setSubmitted] = useState(!!previousResult);

  const questions = assessment.questions || [];
  const total = questions.length;

  // Timer
  useEffect(() => {
    if (phase !== 'quiz' || submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase, submitted]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const timerColor = timeLeft < 60 ? '#ef4444' : timeLeft < 180 ? '#f59e0b' : '#22d3ee';

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

  const handleSubmit = useCallback((finalAnswers) => {
    if (submitted) return;
    setSubmitted(true);
    const ans = finalAnswers || { ...answers, ...(selected !== null ? { [current]: selected } : {}) };
    const score = questions.reduce((acc, q, i) => acc + (ans[i] === q.answer ? 1 : 0), 0);
    const result = {
      assessmentId: assessment.id,
      topic: assessment.topic,
      category: assessment.category,
      score,
      total,
      percentage: Math.round((score / total) * 100),
      answers: ans,
      userEmail: user?.email || 'guest',
      userName: user?.name || 'Guest',
    };
    saveResult(result);
    setAnswers(ans);
    setPhase('result');
  }, [answers, selected, current, questions, assessment, user, submitted, total]);

  const q = questions[current];
  const finalScore = questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);
  const pct = Math.round((finalScore / total) * 100);
  const grade = pct >= 80 ? { label: 'Excellent!', color: '#22c55e' } : pct >= 60 ? { label: 'Good Job!', color: '#f59e0b' } : { label: 'Keep Practicing', color: '#ef4444' };

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={phase === 'result' ? onClose : undefined}
        style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(14px)' }}
      />
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', pointerEvents: 'none' }}>
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 24 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          style={{
            pointerEvents: 'auto', width: '100%', maxWidth: '560px',
            background: 'var(--bg-secondary)', border: '1px solid var(--border-strong)',
            borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
          }}
        >
          {/* Top accent */}
          <div style={{ height: '4px', background: 'var(--accent-gradient)' }} />

          {phase === 'quiz' && q && (
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    {assessment.category} · {assessment.topic}
                  </p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Question {current + 1} of {total}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '999px', background: `${timerColor}15`, border: `1px solid ${timerColor}40` }}>
                    <Timer size={14} style={{ color: timerColor }} />
                    <span style={{ fontSize: '14px', fontWeight: 800, color: timerColor, fontVariantNumeric: 'tabular-nums' }}>{formatTime(timeLeft)}</span>
                  </div>
                  <button onClick={onClose} style={{ padding: '6px', borderRadius: '8px', color: 'var(--text-muted)', background: 'transparent', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${((current + 1) / total) * 100}%` }} style={{ height: '100%', background: 'var(--accent-gradient)', borderRadius: '999px' }} />
              </div>

              {/* Question */}
              <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.6 }}>{q.text}</p>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {q.options.map((opt, i) => {
                  const isSelected = selected === i;
                  return (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(i)}
                      style={{
                        width: '100%', padding: '14px 18px', borderRadius: '14px', textAlign: 'left',
                        fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
                        background: isSelected ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                        border: isSelected ? '1.5px solid #6366f1' : '1.5px solid rgba(255,255,255,0.07)',
                        color: isSelected ? '#a5b4fc' : 'var(--text-secondary)',
                        boxShadow: isSelected ? '0 0 20px rgba(99,102,241,0.15)' : 'none',
                      }}
                    >
                      <span style={{ marginRight: '12px', fontWeight: 800, color: isSelected ? '#6366f1' : 'var(--text-muted)' }}>
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>

              {/* Next / Submit */}
              <motion.button
                whileHover={{ scale: selected !== null ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={selected === null}
                style={{
                  width: '100%', padding: '14px', borderRadius: '14px', fontWeight: 800,
                  fontSize: '14px', color: 'white', border: 'none', cursor: selected !== null ? 'pointer' : 'not-allowed',
                  background: selected !== null ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.06)',
                  opacity: selected !== null ? 1 : 0.5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                {current < total - 1 ? 'Next Question' : 'Submit Assessment'}
                <ChevronRight size={16} />
              </motion.button>
            </div>
          )}

          {phase === 'result' && (
            <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
              {/* Result tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 2rem' }}>
                {[{ id: 'summary', label: 'Summary', icon: BarChart2 }, { id: 'review', label: 'Review Mistakes', icon: BookOpen }].map(t => (
                  <button key={t.id} onClick={() => setResultTab(t.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '14px 16px', fontSize: '13px', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', borderBottom: `2px solid ${resultTab === t.id ? 'var(--accent-primary)' : 'transparent'}`, color: resultTab === t.id ? 'var(--accent-primary)' : 'var(--text-muted)', transition: 'all 0.2s' }}>
                    <t.icon size={14} /> {t.label}
                    {t.id === 'review' && (total - finalScore) > 0 && (
                      <span style={{ fontSize: '10px', fontWeight: 800, padding: '1px 6px', borderRadius: '999px', background: '#ef444420', color: '#ef4444' }}>{total - finalScore}</span>
                    )}
                  </button>
                ))}
              </div>

              <div style={{ overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: resultTab === 'summary' ? 'center' : 'stretch', textAlign: resultTab === 'summary' ? 'center' : 'left' }}>

                {/* ── SUMMARY TAB ── */}
                {resultTab === 'summary' && (
                  <>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}>
                      <Trophy size={56} style={{ color: grade.color }} />
                    </motion.div>
                    <div>
                      <h2 style={{ fontSize: '2rem', fontWeight: 900, color: grade.color, marginBottom: '6px' }}>{grade.label}</h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{assessment.topic} · {assessment.category}</p>
                    </div>

                    {/* Score ring */}
                    <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                      <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                        <motion.circle cx="60" cy="60" r="50" fill="none" stroke={grade.color} strokeWidth="10"
                          strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 50}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - pct / 100) }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                        />
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)' }}>{pct}%</span>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Score</span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
                      {[
                        { label: 'Correct', value: finalScore,         icon: CheckCircle, color: '#22c55e' },
                        { label: 'Wrong',   value: total - finalScore, icon: XCircle,     color: '#ef4444' },
                      ].map((s, i) => (
                        <div key={i} style={{ padding: '16px', borderRadius: '14px', background: `${s.color}10`, border: `1px solid ${s.color}25`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                          <s.icon size={20} style={{ color: s.color }} />
                          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: s.color }}>{s.value}</span>
                          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{s.label}</span>
                        </div>
                      ))}
                    </div>

                    <button onClick={() => setResultTab('review')}
                      style={{ 
                        width: '100%', padding: '12px', borderRadius: '14px', fontWeight: 700, fontSize: '13px', 
                        color: 'var(--accent-primary)', border: '1px solid rgba(99,102,241,0.25)', 
                        background: 'rgba(99,102,241,0.07)', cursor: 'pointer', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', gap: '8px' 
                      }}>
                      <BookOpen size={15} /> 
                      {finalScore === total ? 'Review All Questions & Explanations' : `Review ${total - finalScore} Mistake${total - finalScore > 1 ? 's' : ''} & Explanations`}
                    </button>

                    <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                      <button onClick={onClose} style={{ flex: 1, padding: '13px', borderRadius: '14px', fontWeight: 700, fontSize: '14px', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', cursor: 'pointer' }}>
                        Close
                      </button>
                      <button onClick={() => { setPhase('result'); setResultTab('review'); }}
                        style={{ flex: 1, padding: '13px', borderRadius: '14px', fontWeight: 800, fontSize: '14px', color: 'white', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
                        <BookOpen size={14} /> Review Answers
                      </button>
                    </div>
                  </>
                )}

                {/* ── REVIEW TAB ── */}
                {resultTab === 'review' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {questions.map((q, i) => {
                        const userAns = answers[i];
                        const correct = userAns === q.answer;
                        return (
                          <motion.div key={i}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            style={{ borderRadius: '16px', overflow: 'hidden', border: `1px solid ${correct ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.25)'}` }}
                          >
                            {/* Question header */}
                            <div style={{ padding: '14px 16px', background: correct ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                              {correct
                                ? <CheckCircle size={16} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
                                : <XCircle size={16} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />}
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                                  <span style={{ fontSize: '10px', fontWeight: 800, color: correct ? '#22c55e' : '#ef4444', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '8px' }}>Q{i + 1}</span>
                                  {q.text}
                                </p>
                              </div>
                            </div>

                            {/* Options */}
                            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', background: 'var(--bg-tertiary)' }}>
                              {q.options.map((opt, oi) => {
                                const isCorrect = oi === q.answer;
                                const isUserWrong = oi === userAns && !correct;
                                const bg = isCorrect ? 'rgba(34,197,94,0.12)' : isUserWrong ? 'rgba(239,68,68,0.1)' : 'transparent';
                                const border = isCorrect ? '1px solid rgba(34,197,94,0.35)' : isUserWrong ? '1px solid rgba(239,68,68,0.3)' : '1px solid transparent';
                                const color = isCorrect ? '#22c55e' : isUserWrong ? '#ef4444' : 'var(--text-secondary)';
                                return (
                                  <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '10px', background: bg, border, transition: 'all 0.15s' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 800, color, minWidth: '18px' }}>{String.fromCharCode(65 + oi)}.</span>
                                    <span style={{ fontSize: '13px', fontWeight: isCorrect || isUserWrong ? 700 : 500, color }}>{opt}</span>
                                    {isCorrect && <CheckCircle size={13} style={{ color: '#22c55e', marginLeft: 'auto', flexShrink: 0 }} />}
                                    {isUserWrong && <XCircle size={13} style={{ color: '#ef4444', marginLeft: 'auto', flexShrink: 0 }} />}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Explanation — always shown */}
                            {q.explanation && (
                              <div style={{ padding: '12px 16px', background: 'rgba(99,102,241,0.06)', borderTop: '1px solid rgba(99,102,241,0.12)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <BookOpen size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                                <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                  <span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>Explanation: </span>
                                  {q.explanation}
                                </p>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => setResultTab('summary')} style={{ flex: 1, padding: '13px', borderRadius: '14px', fontWeight: 700, fontSize: '14px', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', cursor: 'pointer' }}>
                        Back to Summary
                      </button>
                      <button onClick={() => setResultTab('summary')}
                        style={{ flex: 1, padding: '13px', borderRadius: '14px', fontWeight: 800, fontSize: '14px', color: 'white', background: 'var(--accent-gradient)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Trophy size={14} /> Back to Summary
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default AssessmentModal;
