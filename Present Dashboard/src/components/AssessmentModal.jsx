import React from 'react';
import AssessmentContainer from './assessment/AssessmentContainer';

/**
 * ── AssessmentModal (Clean Wrapper) ─────────────────────────────────
 * Delegating modal shell mounting the modular AssessmentContainer engine.
 */
export default function AssessmentModal({ assessment, onClose, previousResult = null }) {
  if (!assessment) return null;

  return (
    <AssessmentContainer
      assessment={assessment}
      onClose={onClose}
      previousResult={previousResult}
    />
  );
}
