import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DsaResetModal({
  isOpen,
  onClose,
  onConfirmReset,
  selectedTopic = null
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [resetting, setResetting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setResetting(true);
    try {
      await onConfirmReset();
      onClose();
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(13, 27, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
          borderRadius: '20px',
          border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
          boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.5)' : '0 12px 36px rgba(13, 27, 42, 0.12)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxSizing: 'border-box',
          fontFamily: "'Poppins', sans-serif"
        }}
      >
        {/* Header with warning icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: isDark ? '#F3F7FB' : '#0D1B2A' }}>
                Reset Progress
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: isDark ? '#8EA6BC' : '#64748B' }}>
                {selectedTopic ? `Reset progress for ${selectedTopic.title || 'selected chapter'}` : 'Reset all your problem completion statuses'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: isDark ? '#8EA6BC' : '#64748B',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Warning Body */}
        <div
          style={{
            padding: '14px 16px',
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.08)' : '#FEF2F2',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: '13px',
            lineHeight: 1.5,
            color: isDark ? '#FCA5A5' : '#B91C1C'
          }}
        >
          <strong>Warning:</strong> This will permanently clear your marked solved statuses {selectedTopic ? 'for this chapter' : 'across all DSA topics'}. Personal notes, revisions, and bookmarks will be kept intact.
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            disabled={resetting}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
              backgroundColor: isDark ? '#0B1F33' : '#EFF6FB',
              color: isDark ? '#CBDDE9' : '#334155',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={resetting}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 10px rgba(239, 68, 68, 0.3)'
            }}
          >
            <RotateCcw size={15} />
            <span>{resetting ? 'Resetting...' : 'Confirm Reset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
