import React, { useState } from 'react';
import {
  Terminal, CheckCircle2, XCircle, Clock, Database, AlertTriangle, Sparkles
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DsaSubmissionPanel({
  testCases = [],
  executionResult = null,
  isExecuting = false
}) {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Safely parse and normalize testCases
  const parsedCases = React.useMemo(() => {
    if (Array.isArray(testCases)) {
      return testCases;
    }
    if (typeof testCases === 'string' && testCases.trim()) {
      try {
        const parsed = JSON.parse(testCases);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  }, [testCases]);

  const defaultCases = parsedCases.length > 0 ? parsedCases : [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
  ];

  const currentCase = defaultCases[activeCaseIdx] || defaultCases[0] || { input: '', output: '' };

  const isAccepted = executionResult?.verdict === 'Accepted';
  const isError = executionResult && !isAccepted;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isDark ? '#0B1F33' : '#FFFFFF',
        borderRadius: '16px',
        border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
        overflow: 'hidden',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {/* Header Tabs: Test Cases & Custom Input */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.1)' : '#EFF6FB'}`,
          backgroundColor: isDark ? '#0E2740' : '#F8FAFC'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '6px' }}>
            <Terminal size={14} style={{ color: '#2872A1' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#F3F7FB' : '#0D1B2A' }}>
              Test Console
            </span>
          </div>

          {defaultCases.map((tc, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveCaseIdx(idx);
                setIsCustomMode(false);
              }}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: !isCustomMode && activeCaseIdx === idx ? 700 : 500,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: !isCustomMode && activeCaseIdx === idx
                  ? (isDark ? '#2872A1' : '#FFFFFF')
                  : 'transparent',
                color: !isCustomMode && activeCaseIdx === idx
                  ? (isDark ? '#FFFFFF' : '#2872A1')
                  : (isDark ? '#8EA6BC' : '#64748B'),
                boxShadow: !isCustomMode && activeCaseIdx === idx ? '0 1px 3px rgba(13, 27, 42, 0.08)' : 'none'
              }}
            >
              Case {idx + 1}
            </button>
          ))}

          <button
            onClick={() => setIsCustomMode(true)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: isCustomMode ? 700 : 500,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: isCustomMode
                ? (isDark ? '#2872A1' : '#FFFFFF')
                : 'transparent',
              color: isCustomMode
                ? (isDark ? '#FFFFFF' : '#2872A1')
                : (isDark ? '#8EA6BC' : '#64748B'),
              boxShadow: isCustomMode ? '0 1px 3px rgba(13, 27, 42, 0.08)' : 'none'
            }}
          >
            Custom Input
          </button>
        </div>

        {/* Execution metrics info */}
        {executionResult && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: isAccepted ? '#10B981' : '#EF4444',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {isAccepted ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
              {executionResult.verdict}
            </span>
            {executionResult.runtime && (
              <span style={{ fontSize: '11px', color: isDark ? '#8EA6BC' : '#64748B' }}>
                {executionResult.runtime}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Execution Content Panel */}
      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {isCustomMode ? (
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: isDark ? '#8EA6BC' : '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
              Custom Test Input
            </label>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter your custom arguments or test payload..."
              style={{
                width: '100%',
                minHeight: '60px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
                backgroundColor: isDark ? '#081624' : '#F8FAFC',
                color: isDark ? '#F3F7FB' : '#0D1B2A',
                fontFamily: 'monospace',
                fontSize: '12.5px',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {/* Input snippet */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#8EA6BC' : '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                Input
              </div>
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? '#081624' : '#F8FAFC',
                  border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.1)' : '#EFF6FB'}`,
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: isDark ? '#CBDDE9' : '#0D1B2A'
                }}
              >
                {currentCase?.input || 'N/A'}
              </div>
            </div>

            {/* Expected Output snippet */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#8EA6BC' : '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                Expected Output
              </div>
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? '#081624' : '#F8FAFC',
                  border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.1)' : '#EFF6FB'}`,
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: '#10B981'
                }}
              >
                {currentCase?.output || 'N/A'}
              </div>
            </div>
          </div>
        )}

        {/* Results Banner if code was run */}
        {executionResult && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              backgroundColor: isAccepted
                ? (isDark ? 'rgba(16, 185, 129, 0.12)' : '#ECFDF5')
                : (isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2'),
              border: `1px solid ${isAccepted ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: isAccepted ? '#10B981' : '#EF4444',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isAccepted ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                <span>{executionResult.verdict}</span>
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11.5px', color: isDark ? '#CBDDE9' : '#475569' }}>
                {executionResult.runtime && <span>Runtime: <strong>{executionResult.runtime}</strong></span>}
                {executionResult.memory && <span>Memory: <strong>{executionResult.memory}</strong></span>}
              </div>
            </div>

            {executionResult.output && (
              <div style={{ fontSize: '12px', color: isDark ? '#CBDDE9' : '#334155', fontFamily: 'monospace' }}>
                {executionResult.output}
              </div>
            )}
            {executionResult.error && (
              <div style={{ fontSize: '12px', color: '#EF4444', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {executionResult.error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
