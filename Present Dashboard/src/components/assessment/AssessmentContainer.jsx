import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Timer, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useAssessment } from '../../hooks/useAssessment';
import { useAssessmentTimer } from '../../hooks/useAssessmentTimer';
import QuestionRenderer from './QuestionRenderer';
import ResultReview from './ResultReview';
import ReferenceNotesModal from '../ReferenceNotesModal';
import { saveResult } from '../../store/resultStore';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * ── AssessmentContainer ─────────────────────────────────────────────
 * Complete, reusable container orchestrating quiz timing, question rendering,
 * submission handling, scoring, and scorecard review.
 */
export default function AssessmentContainer({
  assessment,
  onClose,
  previousResult = null,
  onSaveResult = null
}) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [notesModalOpen, setNotesModalOpen] = useState(false);

  const {
    phase,
    setPhase,
    resultTab,
    setResultTab,
    current,
    currentQuestion,
    total,
    selected,
    isSubmitted,
    scoreData,
    selectOption,
    nextQuestion,
    prevQuestion,
    submitAssessment,
    retakeAssessment
  } = useAssessment({
    assessment,
    previousResult,
    onSubmit: async (calculated) => {
      const payload = {
        userId: user?.id || user?.email || 'user_anon',
        userEmail: user?.email || 'member@nexus.com',
        userName: user?.name || user?.username || 'Nexus Member',
        assessmentId: assessment?.id,
        topic: assessment?.topic || 'General Assessment',
        category: assessment?.category || 'Quantitative',
        score: calculated.score,
        total: calculated.total,
        percentage: calculated.percentage,
        answers: calculated.answers
      };

      if (onSaveResult) {
        await onSaveResult(payload);
      } else {
        await saveResult(payload);
      }
    }
  });

  const timer = useAssessmentTimer({
    initialMinutes: assessment?.timeLimit || 20,
    onTimeUp: () => {
      if (!isSubmitted && phase === 'quiz') {
        submitAssessment(null, 0);
      }
    },
    autoStart: !previousResult
  });

  const handleManualSubmit = () => {
    submitAssessment(null, timer.timeLeft);
  };

  const handleRetake = () => {
    retakeAssessment();
    timer.reset(assessment?.timeLimit || 20);
  };

  const borderColor = isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9';
  const modalBg = isDark ? '#0E2740' : '#FFFFFF';
  const textColor = isDark ? '#F3F7FB' : '#0D1B2A';
  const mutedColor = isDark ? '#8EA6BC' : '#64748B';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(13, 27, 42, 0.78)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(8px, 2vw, 16px)',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          width: 'min(920px, calc(100vw - 32px))',
          maxHeight: 'calc(100dvh - 32px)',
          backgroundColor: modalBg,
          borderRadius: '20px',
          border: `1px solid ${borderColor}`,
          boxShadow: isDark
            ? '0 24px 70px rgba(0, 0, 0, 0.65)'
            : '0 20px 60px rgba(13, 27, 42, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          boxSizing: 'border-box',
          fontFamily: "'Poppins', sans-serif"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 1. HEADER (Non-scrolling) ─────────────────────────────── */}
        <div
          style={{
            flexShrink: 0,
            padding: '16px 24px',
            borderBottom: `1px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: modalBg,
            gap: '12px'
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: textColor }}>
              {assessment?.topic || 'Assessment'}
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: mutedColor }}>
              {assessment?.category} • {total} Questions • {assessment?.timeLimit || 20} Mins
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {phase === 'quiz' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  backgroundColor: timer.isCritical
                    ? 'rgba(239, 68, 68, 0.15)'
                    : isDark ? 'rgba(40, 114, 161, 0.15)' : '#EFF6FB',
                  border: `1px solid ${timer.isCritical ? '#EF4444' : borderColor}`,
                  color: timer.isCritical ? '#EF4444' : textColor,
                  fontSize: '13px',
                  fontWeight: 700
                }}
              >
                <Timer size={15} />
                <span>{timer.formattedTime}</span>
              </div>
            )}

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                style={{
                  background: isDark ? 'rgba(203, 221, 233, 0.08)' : '#EFF6FB',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '10px',
                  padding: '7px',
                  color: mutedColor,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* ── 2. SCROLLABLE BODY ────────────────────────────────────── */}
        <div
          style={{
            flex: '1 1 auto',
            minHeight: 0,
            overflowY: 'auto',
            padding: '24px 24px 32px 24px',
            boxSizing: 'border-box'
          }}
        >
          {phase === 'quiz' && (
            <QuestionRenderer
              question={currentQuestion}
              questionIndex={current}
              totalQuestions={total}
              selectedOption={selected}
              onSelectOption={selectOption}
              isSubmitted={isSubmitted}
              topic={assessment?.topic}
              isDark={isDark}
              onOpenReferenceNotes={() => setNotesModalOpen(true)}
            />
          )}

          {phase === 'result' && (
            <ResultReview
              scoreData={scoreData}
              activeTab={resultTab}
              onTabChange={setResultTab}
              onRetake={handleRetake}
              onClose={onClose}
              topic={assessment?.topic}
              isDark={isDark}
            />
          )}
        </div>

        {/* ── 3. FOOTER (Non-scrolling) ─────────────────────────────── */}
        <div
          style={{
            flexShrink: 0,
            padding: '14px 24px',
            borderTop: `1px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: modalBg,
            gap: '12px'
          }}
        >
          {phase === 'quiz' ? (
            <>
              <button
                type="button"
                onClick={prevQuestion}
                disabled={current === 0}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  backgroundColor: isDark ? '#0B1F33' : '#EFF6FB',
                  color: current === 0 ? mutedColor : textColor,
                  border: `1px solid ${borderColor}`,
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: current === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {current < total - 1 ? (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 20px',
                      borderRadius: '10px',
                      backgroundColor: '#2872A1',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(40, 114, 161, 0.3)'
                    }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleManualSubmit}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 22px',
                      borderRadius: '10px',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    Submit Assessment
                  </button>
                )}
              </div>
            </>
          ) : (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={handleRetake}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  backgroundColor: isDark ? '#0B1F33' : '#EFF6FB',
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={15} /> Retake Assessment
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '8px 24px',
                  borderRadius: '10px',
                  backgroundColor: '#2872A1',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Finish & Close
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reference Notes / Formula Cheatsheet Modal */}
      {notesModalOpen && (
        <ReferenceNotesModal
          isOpen={notesModalOpen}
          onClose={() => setNotesModalOpen(false)}
          topic={assessment?.topic}
        />
      )}
    </div>
  );
}
