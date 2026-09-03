import React, { useState, useEffect } from 'react';
import {
  FileText, X, Save, Trash2, CheckCircle2, Clock,
  Sparkles, Lock, AlertCircle
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getDsaNote, saveDsaNote, deleteDsaNote } from '../../services/dsaService';

export default function DsaNotesModal({
  isOpen,
  onClose,
  problem,
  onNoteSaved
}) {
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isOpen && problem?.id) {
      setLoading(true);
      setSavedSuccess(false);
      getDsaNote(problem.id)
        .then((text) => {
          setNoteText(text || '');
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, problem?.id]);

  if (!isOpen || !problem) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveDsaNote(problem.id, noteText);
      setSavedSuccess(true);
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      if (onNoteSaved) onNoteSaved(problem.id, noteText);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error('Save note error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to clear your notes for this problem?')) {
      setSaving(true);
      try {
        await deleteDsaNote(problem.id);
        setNoteText('');
        if (onNoteSaved) onNoteSaved(problem.id, '');
        onClose();
      } catch (err) {
        console.error('Delete note error:', err);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(13, 27, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
          borderRadius: '20px',
          border: `1.5px solid ${isDark ? 'rgba(74, 144, 194, 0.35)' : '#CBDDE9'}`,
          boxShadow: isDark
            ? '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(40, 114, 161, 0.2)'
            : '0 16px 40px rgba(40, 114, 161, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          animation: 'fadeInScale 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#EFF6FB'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isDark ? 'rgba(203, 221, 233, 0.03)' : '#F8FAFC'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(40, 114, 161, 0.2)' : '#EFF6FB',
                color: isDark ? '#4A90C2' : '#2872A1',
                border: `1px solid ${isDark ? 'rgba(74, 144, 194, 0.3)' : '#CBDDE9'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <FileText size={19} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: isDark ? '#F3F7FB' : '#0D1B2A' }}>
                  Personal Problem Notes
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    color: '#10B981',
                    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontWeight: 600
                  }}
                >
                  <Lock size={10} /> Private
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: isDark ? '#8EA6BC' : '#64748B' }}>
                {problem.title}
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
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#CBDDE9' : '#334155' }}>
              Your Key Takeaways, Edge Cases & Approach:
            </label>
            <span style={{ fontSize: '12px', color: isDark ? '#8EA6BC' : '#94A3B8' }}>
              {noteText.length} characters
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: isDark ? '#8EA6BC' : '#64748B', fontSize: '13.5px' }}>
              Loading your private notes...
            </div>
          ) : (
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write down your thought process, time complexity nuances, tricky edge cases, or revision formulas here..."
              rows={8}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#0B1F33' : '#F8FAFC',
                border: `1.5px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
                color: isDark ? '#F3F7FB' : '#0D1B2A',
                fontSize: '13.5px',
                lineHeight: 1.6,
                fontFamily: "'Poppins', sans-serif",
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#2872A1'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'; }}
            />
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: isDark ? '#8EA6BC' : '#64748B' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={13} style={{ color: '#2872A1' }} />
              <span>Notes are encrypted & strictly visible only to your account.</span>
            </div>

            {savedSuccess && (
              <span style={{ color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> Saved at {lastSavedTime}
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.1)' : '#EFF6FB'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isDark ? 'rgba(203, 221, 233, 0.02)' : '#FAFCFF'
          }}
        >
          {noteText.trim() ? (
            <button
              onClick={handleDelete}
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'none',
                border: 'none',
                color: '#EF4444',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Trash2 size={15} /> Clear Note
            </button>
          ) : <div />}

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '9px 18px',
                borderRadius: '10px',
                backgroundColor: isDark ? '#0B1F33' : '#EFF6FB',
                color: isDark ? '#CBDDE9' : '#334155',
                border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Close
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 20px',
                borderRadius: '10px',
                backgroundColor: '#2872A1',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(40, 114, 161, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              <Save size={15} />
              <span>{saving ? 'Saving...' : 'Save Note'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
