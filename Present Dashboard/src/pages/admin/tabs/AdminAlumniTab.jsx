import React, { useState } from 'react';
import { Plus, Trash2, Edit3, GraduationCap, Building2, Linkedin, ExternalLink } from 'lucide-react';

/**
 * ── AdminAlumniTab ──────────────────────────────────────────────────
 * Alumni directory, placed students, hiring companies, and LinkedIn profiles.
 */
export default function AdminAlumniTab({
  alumni = [],
  onSaveAlumnus,
  onDeleteAlumnus,
  isDark = true
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', company: '', role: '', batch: '2024', linkedinUrl: '', imageUrl: '' });

  const resetForm = () => {
    setForm({ name: '', company: '', role: '', batch: '2024', linkedinUrl: '', imageUrl: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleOpenEdit = (a) => {
    setEditingId(a.id);
    setForm({
      name: a.name || '',
      company: a.company || '',
      role: a.role || '',
      batch: a.batch || '2024',
      linkedinUrl: a.linkedinUrl || a.linkedin_url || '',
      imageUrl: a.imageUrl || a.image_url || ''
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.company.trim()) return alert('Name and Company are required.');
    onSaveAlumnus({ ...form, id: editingId });
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
            Alumni & Placement Network
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: mutedColor }}>
            Highlight placed students, alumni mentors, and corporate hiring destinations.
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
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          <span>{showForm ? 'Close Form' : 'Add Alumnus'}</span>
        </button>
      </div>

      {showForm && (
        <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: cardBg, border: `1.5px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: textColor }}>
            {editingId ? 'Edit Alumnus Profile' : 'New Alumnus Entry'}
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '4px' }}>Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '4px' }}>Company *</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Google / Microsoft"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '4px' }}>Designation / Role</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Software Engineer"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '4px' }}>Batch Year</label>
              <input
                type="text"
                value={form.batch}
                onChange={(e) => setForm({ ...form, batch: e.target.value })}
                placeholder="2024"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '4px' }}>LinkedIn Profile URL</label>
              <input
                type="url"
                value={form.linkedinUrl}
                onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={resetForm} style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: isDark ? '#0B1F33' : '#EFF6FB', color: textColor, border: `1px solid ${borderColor}`, fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            <button type="button" onClick={handleSave} style={{ padding: '8px 22px', borderRadius: '8px', backgroundColor: '#2872A1', color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>{editingId ? 'Update Alumnus' : 'Save Alumnus'}</button>
          </div>
        </div>
      )}

      {/* Alumni Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        {alumni.map(a => (
          <div
            key={a.id}
            style={{
              padding: '18px',
              borderRadius: '14px',
              backgroundColor: cardBg,
              border: `1px solid ${borderColor}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#2872A1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>
                  {a.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: textColor }}>{a.name}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#2872A1', fontWeight: 600 }}>{a.role || 'Alumnus'} @ {a.company}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button type="button" onClick={() => handleOpenEdit(a)} style={{ background: 'none', border: 'none', color: '#2872A1', cursor: 'pointer', padding: '2px' }}><Edit3 size={15} /></button>
                <button type="button" onClick={() => { if (confirm(`Delete alumnus "${a.name}"?`)) onDeleteAlumnus(a.id); }} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '2px' }}><Trash2 size={15} /></button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: mutedColor, borderTop: `1px solid ${borderColor}`, paddingTop: '8px' }}>
              <span>Batch {a.batch || '2024'}</span>
              {(a.linkedinUrl || a.linkedin_url) && (
                <a href={a.linkedinUrl || a.linkedin_url} target="_blank" rel="noreferrer" style={{ color: '#0A66C2', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none', fontWeight: 600 }}>
                  <Linkedin size={13} /> LinkedIn
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
