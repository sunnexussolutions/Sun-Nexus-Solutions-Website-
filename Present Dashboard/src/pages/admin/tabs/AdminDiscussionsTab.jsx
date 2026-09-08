import React, { useState } from 'react';
import { Plus, Trash2, MessageSquare, Tag } from 'lucide-react';

/**
 * ── AdminDiscussionsTab ─────────────────────────────────────────────
 * Community board announcements, thread moderation, and posts.
 */
export default function AdminDiscussionsTab({
  discussions = [],
  onAddDiscussion,
  onDeleteDiscussion,
  isDark = true
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', tag: 'Announcement' });

  const handleAdd = () => {
    if (!form.title.trim() || !form.body.trim()) return alert('Title and content are required.');
    onAddDiscussion(form);
    setForm({ title: '', body: '', tag: 'Announcement' });
    setShowForm(false);
  };

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
            Community Discussions & Broadcasts
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: mutedColor }}>
            Post official announcements, moderation updates, and forum threads.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '10px',
            backgroundColor: '#2872A1',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          <span>{showForm ? 'Close Form' : 'Post Announcement'}</span>
        </button>
      </div>

      {showForm && (
        <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: cardBg, border: `1.5px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '4px' }}>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Broadcast title..."
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '4px' }}>Tag</label>
              <select
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              >
                <option value="Announcement">Announcement</option>
                <option value="DSA">DSA</option>
                <option value="Placement">Placement</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '4px' }}>Message Body *</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={3}
              placeholder="Write your broadcast message..."
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: isDark ? '#0B1F33' : '#EFF6FB', color: textColor, border: `1px solid ${borderColor}`, fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            <button type="button" onClick={handleAdd} style={{ padding: '8px 22px', borderRadius: '8px', backgroundColor: '#2872A1', color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Publish Thread</button>
          </div>
        </div>
      )}

      {/* Discussion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {discussions.map(d => (
          <div
            key={d.id}
            style={{
              padding: '16px 20px',
              borderRadius: '14px',
              backgroundColor: cardBg,
              border: `1px solid ${borderColor}`,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '14px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', backgroundColor: isDark ? 'rgba(40, 114, 161, 0.2)' : '#EFF6FB', color: '#2872A1' }}>
                  {d.tag || 'General'}
                </span>
                <span style={{ fontSize: '11.5px', color: mutedColor }}>
                  By {d.author || 'Admin'} • {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Recent'}
                </span>
              </div>
              <h4 style={{ margin: '4px 0 6px', fontSize: '15.5px', fontWeight: 800, color: textColor }}>{d.title}</h4>
              <p style={{ margin: 0, fontSize: '13px', color: mutedColor, lineHeight: 1.5 }}>{d.body || d.content}</p>
            </div>

            <button
              type="button"
              onClick={() => { if (confirm('Delete this discussion thread?')) onDeleteDiscussion(d.id); }}
              style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
              title="Delete Thread"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
