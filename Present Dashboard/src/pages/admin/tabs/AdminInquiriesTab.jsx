import React, { useState } from 'react';
import { Search, Trash2, Mail, Phone, Calendar, Briefcase, CheckCircle2, Clock } from 'lucide-react';

/**
 * ── AdminInquiriesTab ───────────────────────────────────────────────
 * Client project requirement forms, freelancing leads, and contact inquiries.
 */
export default function AdminInquiriesTab({
  inquiries = [],
  onUpdateStatus,
  onDeleteInquiry,
  isDark = true
}) {
  const [search, setSearch] = useState('');

  const filtered = inquiries.filter(inq => {
    if (!search) return true;
    const q = search.toLowerCase();
    const matchName = (inq.client_name || inq.contact_person || inq.name || '').toLowerCase().includes(q);
    const matchEmail = (inq.email || '').toLowerCase().includes(q);
    const matchTitle = (inq.project_title || inq.subject || '').toLowerCase().includes(q);
    return matchName || matchEmail || matchTitle;
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
            Client Project Requirements & Inquiries
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: mutedColor }}>
            Freelance project submissions, client leads, and requirement scopes.
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: mutedColor }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            style={{
              padding: '8px 12px 8px 32px',
              borderRadius: '8px',
              border: `1px solid ${borderColor}`,
              backgroundColor: inputBg,
              color: textColor,
              fontSize: '12.5px',
              outline: 'none',
              width: '220px'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, color: mutedColor }}>
            No inquiry leads found.
          </div>
        ) : (
          filtered.map((inq, idx) => (
            <div
              key={inq.id || idx}
              style={{
                padding: '20px',
                borderRadius: '16px',
                backgroundColor: cardBg,
                border: `1px solid ${borderColor}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', backgroundColor: inq.status === 'completed' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)', color: inq.status === 'completed' ? '#10B981' : '#F59E0B' }}>
                    {(inq.status || 'Pending').toUpperCase()}
                  </span>
                  <h4 style={{ margin: '6px 0 2px', fontSize: '16px', fontWeight: 800, color: textColor }}>
                    {inq.project_title || inq.subject || inq.business_name || 'Project Requirement'}
                  </h4>
                  <div style={{ fontSize: '12px', color: mutedColor }}>
                    From <strong>{inq.client_name || inq.contact_person || inq.name || 'Client'}</strong> • {inq.created_at ? new Date(inq.created_at).toLocaleDateString() : 'Recent'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select
                    value={inq.status || 'pending'}
                    onChange={(e) => onUpdateStatus(inq.id, e.target.value)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: `1px solid ${borderColor}`,
                      backgroundColor: inputBg,
                      color: textColor,
                      fontSize: '11.5px',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_review">In Review</option>
                    <option value="contacted">Contacted</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => { if (confirm('Delete inquiry?')) onDeleteInquiry(inq.id); }}
                    style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {inq.business_description || inq.message ? (
                <p style={{ margin: 0, fontSize: '13px', color: mutedColor, lineHeight: 1.5 }}>
                  {inq.business_description || inq.message}
                </p>
              ) : null}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: mutedColor, borderTop: `1px solid ${borderColor}`, paddingTop: '10px' }}>
                {inq.email && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={13} style={{ color: '#2872A1' }} /> {inq.email}</div>}
                {inq.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={13} style={{ color: '#10B981' }} /> {inq.phone}</div>}
                {inq.budget_range && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Briefcase size={13} style={{ color: '#F59E0B' }} /> Budget: {inq.budget_range}</div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
