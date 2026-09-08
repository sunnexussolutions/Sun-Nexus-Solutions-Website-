import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Rocket, ExternalLink, Github, Folder } from 'lucide-react';

/**
 * ── AdminProjectsTab ────────────────────────────────────────────────
 * Project showcase management, team assignments, tech stack, and URLs.
 */
export default function AdminProjectsTab({
  projects = [],
  onSaveProject,
  onDeleteProject,
  onArchiveProject,
  isDark = true
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    summary: '',
    description: '',
    status: 'in_progress',
    techStack: '',
    tags: '',
    demoUrl: '',
    githubUrl: ''
  });

  const resetForm = () => {
    setForm({
      title: '',
      summary: '',
      description: '',
      status: 'in_progress',
      techStack: '',
      tags: '',
      demoUrl: '',
      githubUrl: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title || '',
      summary: p.summary || p.cardSummary || '',
      description: p.description || p.desc || '',
      status: p.status || 'in_progress',
      techStack: Array.isArray(p.techStack) ? p.techStack.join(', ') : (p.techStack || ''),
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
      demoUrl: p.demoUrl || p.demo_url || '',
      githubUrl: p.githubUrl || p.github_url || ''
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return alert('Project title is required.');

    const payload = {
      ...form,
      id: editingId,
      techStack: typeof form.techStack === 'string' ? form.techStack.split(',').map(s => s.trim()).filter(Boolean) : form.techStack,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : form.tags
    };

    onSaveProject(payload);
    resetForm();
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
            Project Showcase Control
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: mutedColor }}>
            Manage featured student engineering projects, repos, and live demos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
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
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(40, 114, 161, 0.3)'
          }}
        >
          <Plus size={16} />
          <span>{showForm ? 'Close Form' : 'Add New Project'}</span>
        </button>
      </div>

      {showForm && (
        <div
          style={{
            padding: '24px',
            borderRadius: '18px',
            backgroundColor: cardBg,
            border: `1.5px solid ${borderColor}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: textColor }}>
            {editingId ? 'Edit Project' : 'New Project'}
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '4px' }}>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Distributed Consensus Engine"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '4px' }}>Short Summary</label>
              <input
                type="text"
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="High-performance Raft algorithm in Rust..."
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '4px' }}>Tech Stack (Comma-separated)</label>
              <input
                type="text"
                value={form.techStack}
                onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                placeholder="Rust, Tokio, Docker"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '4px' }}>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              >
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="planning">Planning</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '4px' }}>GitHub Repo URL</label>
              <input
                type="url"
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '4px' }}>Live Demo URL</label>
              <input
                type="url"
                value={form.demoUrl}
                onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                placeholder="https://..."
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={resetForm}
              style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: isDark ? '#0B1F33' : '#EFF6FB', color: textColor, border: `1px solid ${borderColor}`, fontSize: '13px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={{ padding: '8px 22px', borderRadius: '8px', backgroundColor: '#2872A1', color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
            >
              {editingId ? 'Update Project' : 'Save Project'}
            </button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {projects.map(p => (
          <div
            key={p.id}
            style={{
              padding: '20px',
              borderRadius: '16px',
              backgroundColor: cardBg,
              border: `1px solid ${borderColor}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: p.status === 'completed' ? '#10B981' : '#F59E0B' }}>
                  {p.status || 'In Progress'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button type="button" onClick={() => handleOpenEdit(p)} style={{ background: 'none', border: 'none', color: '#2872A1', cursor: 'pointer', padding: '2px' }}><Edit3 size={15} /></button>
                  <button type="button" onClick={() => { if (confirm(`Delete project "${p.title}"?`)) onDeleteProject(p.id); }} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '2px' }}><Trash2 size={15} /></button>
                </div>
              </div>
              <h4 style={{ margin: '8px 0 4px', fontSize: '16px', fontWeight: 800, color: textColor }}>{p.title}</h4>
              <p style={{ margin: 0, fontSize: '12.5px', color: mutedColor, lineHeight: 1.5 }}>{p.summary || p.cardSummary || p.description || 'No description provided.'}</p>
            </div>

            {p.techStack && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(Array.isArray(p.techStack) ? p.techStack : String(p.techStack).split(',')).map((t, idx) => (
                  <span key={idx} style={{ fontSize: '10.5px', fontWeight: 600, padding: '2px 8px', borderRadius: '6px', backgroundColor: isDark ? 'rgba(203, 221, 233, 0.08)' : '#F1F5F9', color: textColor }}>{t.trim()}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
