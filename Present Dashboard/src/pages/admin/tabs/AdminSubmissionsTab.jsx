import React, { useState } from 'react';
import { Search, Trash2, CheckCircle2, XCircle, Award, Clock, FileText } from 'lucide-react';

/**
 * ── AdminSubmissionsTab ─────────────────────────────────────────────
 * Review student test attempts, score percentages, and submission history.
 */
export default function AdminSubmissionsTab({
  results = [],
  onDeleteResult,
  isDark = true
}) {
  const [search, setSearch] = useState('');

  const filtered = results.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    const matchUser = (r.userName || r.user_name || '').toLowerCase().includes(q);
    const matchEmail = (r.userEmail || r.user_email || '').toLowerCase().includes(q);
    const matchTopic = (r.topic || '').toLowerCase().includes(q);
    return matchUser || matchEmail || matchTopic;
  });

  const borderColor = isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9';
  const cardBg = isDark ? '#0E2740' : '#FFFFFF';
  const inputBg = isDark ? '#0B1F33' : '#F8FAFC';
  const textColor = isDark ? '#F3F7FB' : '#0D1B2A';
  const mutedColor = isDark ? '#8EA6BC' : '#64748B';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: textColor }}>
            Test Submissions & Performance Records
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: mutedColor }}>
            Monitor student attempt scores, accuracy benchmarks, and timestamps.
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: mutedColor }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student or topic..."
            style={{
              padding: '8px 12px 8px 32px',
              borderRadius: '8px',
              border: `1px solid ${borderColor}`,
              backgroundColor: inputBg,
              color: textColor,
              fontSize: '12.5px',
              outline: 'none',
              width: '240px'
            }}
          />
        </div>
      </div>

      <div
        style={{
          borderRadius: '18px',
          backgroundColor: cardBg,
          border: `1px solid ${borderColor}`,
          overflow: 'hidden'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: isDark ? 'rgba(14, 39, 64, 0.5)' : '#F8FAFC', borderBottom: `1px solid ${borderColor}` }}>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700 }}>Student</th>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700 }}>Assessment Topic</th>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700 }}>Category</th>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700 }}>Score</th>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700 }}>Percentage</th>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700 }}>Submitted At</th>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => {
                const percentage = r.percentage || (r.total > 0 ? Math.round((r.score / r.total) * 100) : 0);
                const isPassed = percentage >= 60;

                return (
                  <tr
                    key={r.id || idx}
                    style={{
                      borderBottom: `1px solid ${borderColor}`,
                      backgroundColor: idx % 2 === 0 ? 'transparent' : (isDark ? 'rgba(203, 221, 233, 0.02)' : 'rgba(0,0,0,0.01)')
                    }}
                  >
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: textColor }}>
                      <div>{r.userName || r.user_name || 'Anonymous Student'}</div>
                      <div style={{ fontSize: '11px', color: mutedColor, fontWeight: 400 }}>{r.userEmail || r.user_email}</div>
                    </td>

                    <td style={{ padding: '14px 18px', color: textColor, fontWeight: 600 }}>
                      {r.topic}
                    </td>

                    <td style={{ padding: '14px 18px', color: '#2872A1' }}>
                      {r.category || 'General'}
                    </td>

                    <td style={{ padding: '14px 18px', color: textColor, fontWeight: 700 }}>
                      {r.score} / {r.total}
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          color: isPassed ? '#10B981' : '#EF4444',
                          backgroundColor: isPassed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)'
                        }}
                      >
                        {percentage}%
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px', color: mutedColor, fontSize: '12px' }}>
                      {r.submittedAt ? new Date(r.submittedAt).toLocaleString() : 'Recent'}
                    </td>

                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Delete this submission record?')) {
                            onDeleteResult(r.id, r.assessmentId, r.topic, r.userId, r.userEmail);
                          }
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        title="Delete Submission"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
