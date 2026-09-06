import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Download, Code2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { bulkImportDsa } from '../../services/dsaService';

const SAMPLE_JSON = `[
  {
    "title": "Two Sum",
    "topic": "Arrays & Memory Layout",
    "subtopic": "Array Fundamentals & Traversal",
    "pattern": "Frequency / Hash Map",
    "difficulty": "Easy",
    "practiceUrl": "https://leetcode.com/problems/two-sum/",
    "articleUrl": "https://en.wikipedia.org/wiki/Subset_sum_problem",
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "tags": ["Array", "Hash Map"],
    "published": true
  }
]`;

const SAMPLE_CSV = `title,topic,subtopic,pattern,difficulty,practiceUrl,articleUrl,description,tags,published
Two Sum,Arrays & Memory Layout,Array Fundamentals & Traversal,Frequency Map,Easy,https://leetcode.com/problems/two-sum/,,Find indices adding up to target,Array;Hash Map,true
Valid Anagram,Strings & Character Encoding,Basic String Manipulations,Frequency Count,Easy,https://leetcode.com/problems/valid-anagram/,,Check if strings are anagrams,String;Hash Map,true`;

export default function DsaImportModal({
  isOpen,
  onClose,
  onImportSuccess
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [importMode, setImportMode] = useState('json'); // 'json' | 'csv'
  const [inputText, setInputText] = useState(SAMPLE_JSON);
  const [importing, setImporting] = useState(false);
  const [resultSummary, setResultSummary] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleModeChange = (mode) => {
    setImportMode(mode);
    setInputText(mode === 'json' ? SAMPLE_JSON : SAMPLE_CSV);
    setResultSummary(null);
    setErrorMsg('');
  };

  const handleImport = async () => {
    const text = inputText.trim();
    if (!text) {
      setErrorMsg('Please paste or upload JSON/CSV data first.');
      return;
    }

    setImporting(true);
    setErrorMsg('');
    setResultSummary(null);

    try {
      let payload = {};
      if (importMode === 'json') {
        payload.rawJson = text;
      } else {
        payload.rawCsv = text;
      }

      const res = await bulkImportDsa(payload);
      if (res.success && res.data) {
        setResultSummary(res.data);
        if (onImportSuccess) {
          onImportSuccess(res.data);
        }
      } else {
        setErrorMsg(res.error?.message || res.error || 'Failed to import problems.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Import error occurred.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(13, 27, 42, 0.75)',
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
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
          borderRadius: '20px',
          border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
          boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.5)' : '0 12px 36px rgba(13, 27, 42, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxSizing: 'border-box',
          fontFamily: "'Poppins', sans-serif"
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#EFF6FB'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isDark ? 'rgba(203, 221, 233, 0.02)' : '#F8FAFC'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2872A1 0%, #4A90C2 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Upload size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: isDark ? '#F3F7FB' : '#0D1B2A' }}>
                Bulk Import DSA Problems
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: isDark ? '#8EA6BC' : '#64748B' }}>
                Import questions into Nexus DSA sheet via structured JSON or CSV format
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

        {/* Modal Content Pane (Scrollable) */}
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto'
          }}
        >
          {/* Format Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleModeChange('json')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: importMode === 'json' ? 700 : 500,
                  border: `1px solid ${importMode === 'json' ? '#2872A1' : (isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9')}`,
                  backgroundColor: importMode === 'json' ? '#2872A1' : (isDark ? '#0B1F33' : '#EFF6FB'),
                  color: importMode === 'json' ? '#FFFFFF' : (isDark ? '#CBDDE9' : '#475569'),
                  cursor: 'pointer'
                }}
              >
                JSON Format
              </button>
              <button
                onClick={() => handleModeChange('csv')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: importMode === 'csv' ? 700 : 500,
                  border: `1px solid ${importMode === 'csv' ? '#2872A1' : (isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9')}`,
                  backgroundColor: importMode === 'csv' ? '#2872A1' : (isDark ? '#0B1F33' : '#EFF6FB'),
                  color: importMode === 'csv' ? '#FFFFFF' : (isDark ? '#CBDDE9' : '#475569'),
                  cursor: 'pointer'
                }}
              >
                CSV Format
              </button>
            </div>

            <button
              onClick={() => setInputText(importMode === 'json' ? SAMPLE_JSON : SAMPLE_CSV)}
              style={{
                background: 'none',
                border: 'none',
                color: isDark ? '#4A90C2' : '#2872A1',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Download size={13} />
              <span>Load Template</span>
            </button>
          </div>

          {/* Textarea for Data */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#8EA6BC' : '#64748B' }}>
              Paste {importMode.toUpperCase()} Data
            </label>
            <textarea
              rows={9}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Paste valid ${importMode.toUpperCase()} data here...`}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                fontFamily: 'monospace',
                fontSize: '12px',
                lineHeight: 1.45,
                border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
                backgroundColor: isDark ? '#0B1F33' : '#F8FAFC',
                color: isDark ? '#F3F7FB' : '#0D1B2A',
                outline: 'none',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Report */}
          {resultSummary && (
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : '#ECFDF5',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 700, fontSize: '13.5px' }}>
                <CheckCircle2 size={18} />
                <span>Import Batch Complete</span>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px', color: isDark ? '#CBDDE9' : '#334155' }}>
                <span>Total Received: <strong>{resultSummary.totalReceived}</strong></span>
                <span style={{ color: '#10B981' }}>Imported: <strong>{resultSummary.importedCount}</strong></span>
                {resultSummary.failedCount > 0 && (
                  <span style={{ color: '#EF4444' }}>Failed: <strong>{resultSummary.failedCount}</strong></span>
                )}
              </div>
              {Array.isArray(resultSummary.errors) && resultSummary.errors.length > 0 && (
                <div style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '4px' }}>
                  Errors in rows: {resultSummary.errors.map(e => `#${e.row}: ${e.error}`).join('; ')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#EFF6FB'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            backgroundColor: isDark ? 'rgba(203, 221, 233, 0.02)' : '#F8FAFC'
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
              backgroundColor: isDark ? '#0B1F33' : '#EFF6FB',
              color: isDark ? '#CBDDE9' : '#334155',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {resultSummary ? 'Done' : 'Cancel'}
          </button>

          <button
            onClick={handleImport}
            disabled={importing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 20px',
              borderRadius: '8px',
              backgroundColor: '#2872A1',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(40, 114, 161, 0.25)'
            }}
          >
            <Upload size={14} />
            <span>{importing ? 'Importing...' : 'Validate & Import'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
