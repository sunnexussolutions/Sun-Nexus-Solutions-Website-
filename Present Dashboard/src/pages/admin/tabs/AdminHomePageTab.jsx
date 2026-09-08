import React, { useState } from 'react';
import { Save, Palette, Globe } from 'lucide-react';

/**
 * ── AdminHomePageTab ────────────────────────────────────────────────
 * Home page headline, hero copy, and platform banner announcements.
 */
export default function AdminHomePageTab({
  homeContent = {},
  onSaveHomeContent,
  isDark = true
}) {
  const [form, setForm] = useState({
    heroTitle: homeContent.heroTitle || 'Nexus Hub',
    heroSubtitle: homeContent.heroSubtitle || 'Engineered for excellence in DSA, Aptitude, Projects & Career Placements.',
    ctaText: homeContent.ctaText || 'Explore Platform',
    bannerNotice: homeContent.bannerNotice || 'Live Placement Accelerator batch active. Check out DSA sheets!'
  });
  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = () => {
    onSaveHomeContent(form);
    setSavedMessage('Home page content updated successfully.');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const borderColor = isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9';
  const cardBg = isDark ? '#0E2740' : '#FFFFFF';
  const inputBg = isDark ? '#0B1F33' : '#F8FAFC';
  const textColor = isDark ? '#F3F7FB' : '#0D1B2A';
  const mutedColor = isDark ? '#8EA6BC' : '#64748B';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: textColor }}>
          Home Page & Hero Content Customizer
        </h3>
        <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: mutedColor }}>
          Modify public landing copy, hero headlines, and broadcast alert banners.
        </p>
      </div>

      {savedMessage && (
        <div style={{ padding: '10px 16px', borderRadius: '8px', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}>
          {savedMessage}
        </div>
      )}

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
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '5px' }}>Hero Main Title</label>
          <input
            type="text"
            value={form.heroTitle}
            onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '5px' }}>Hero Subtitle</label>
          <textarea
            value={form.heroSubtitle}
            onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
            rows={2}
            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '5px' }}>CTA Button Label</label>
            <input
              type="text"
              value={form.ctaText}
              onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '5px' }}>Top Banner Notice</label>
            <input
              type="text"
              value={form.bannerNotice}
              onChange={(e) => setForm({ ...form, bannerNotice: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            type="button"
            onClick={handleSave}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 24px',
              borderRadius: '8px',
              backgroundColor: '#2872A1',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
