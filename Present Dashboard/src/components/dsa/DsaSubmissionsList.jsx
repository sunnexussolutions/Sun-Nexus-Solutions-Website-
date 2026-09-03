import React from 'react';
import { FileText, CheckCircle2, XCircle, Clock, Database, ArrowRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import DsaEmptyState from './DsaEmptyState';

export default function DsaSubmissionsList({
  submissions = [],
  onSolve,
  onExplore
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!submissions || submissions.length === 0) {
    return (
      <DsaEmptyState
        title="No submissions yet"
        description="You haven't submitted any solutions yet. Open any problem from the roadmap and click 'Submit Solution' to start tracking your attempts."
        actionLabel="Explore Roadmap"
        onAction={onExplore}
        icon={FileText}
      />
    );
  }

  const formatTime = (ts) => {
    try {
      const d = new Date(ts);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return ts || 'Recently';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Submissions Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderRadius: '16px',
          backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
          border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={20} style={{ color: '#2872A1' }} />
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: isDark ? '#F3F7FB' : '#0D1B2A',
              margin: 0,
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            Submission History ({submissions.length})
          </h3>
        </div>
      </div>

      {/* Submissions Table / Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {submissions.map((sub) => {
          const isAccepted = (sub.verdict || sub.status) === 'Accepted';
          return (
            <div
              key={sub.id}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: '14px',
                backgroundColor: isDark ? '#0B1F33' : '#FFFFFF',
                border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#CBDDE9'}`,
                boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 4px rgba(13, 27, 42, 0.02)',
                gap: '14px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {/* Problem & Verdict */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '220px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: isAccepted
                      ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5')
                      : (isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEF2F2'),
                    color: isAccepted ? '#10B981' : '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isAccepted ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '14.5px',
                        fontWeight: 700,
                        color: isDark ? '#F3F7FB' : '#0D1B2A',
                        fontFamily: "'Poppins', sans-serif"
                      }}
                    >
                      {sub.problemTitle || 'Problem Submission'}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        backgroundColor: isAccepted ? '#ECFDF5' : '#FEF2F2',
                        color: isAccepted ? '#10B981' : '#EF4444',
                        border: `1px solid ${isAccepted ? '#10B98130' : '#EF444430'}`
                      }}
                    >
                      {sub.verdict || sub.status || 'Accepted'}
                    </span>
                  </div>

                  <span style={{ fontSize: '11.5px', color: isDark ? '#8EA6BC' : '#64748B' }}>
                    Submitted on {formatTime(sub.submittedAt || sub.submitted_at)}
                  </span>
                </div>
              </div>

              {/* Language & Runtime & Memory Metrics */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: isDark ? 'rgba(40, 114, 161, 0.15)' : '#EFF6FB',
                    color: isDark ? '#4A90C2' : '#2872A1',
                    border: `1px solid ${isDark ? 'rgba(74, 144, 194, 0.25)' : '#CBDDE9'}`,
                    textTransform: 'uppercase'
                  }}
                >
                  {sub.language || 'JS'}
                </span>

                {sub.runtime && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: isDark ? '#CBDDE9' : '#475569' }}>
                    <Clock size={13} style={{ color: '#2872A1' }} />
                    <span>{sub.runtime}</span>
                  </div>
                )}

                {sub.memory && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: isDark ? '#CBDDE9' : '#475569' }}>
                    <Database size={13} style={{ color: '#2872A1' }} />
                    <span>{sub.memory}</span>
                  </div>
                )}

                {sub.problemId && (
                  <button
                    onClick={() => onSolve(sub.problemId)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      backgroundColor: isDark ? '#1E3A5F' : '#EFF6FB',
                      color: isDark ? '#CBDDE9' : '#2872A1',
                      border: `1px solid ${isDark ? '#4A90C2' : '#CBDDE9'}`,
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <span>View</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
