import React, { useState } from 'react';
import { Save, TrendingUp, Plus, Trash2 } from 'lucide-react';

/**
 * ── AdminStatCardsTab ───────────────────────────────────────────────
 * Landing page statistical showcase counters editor.
 */
export default function AdminStatCardsTab({
  statCards = [],
  onSaveStatCards,
  isDark = true
}) {
  const [cards, setCards] = useState(() =>
    statCards.length > 0 ? statCards : [
      { id: 'stat_1', label: 'Active Learners', value: '1,250+', color: '#2872A1' },
      { id: 'stat_2', label: 'Problems Solved', value: '45,000+', color: '#4A90C2' },
      { id: 'stat_3', label: 'Mock Assessments', value: '3,800+', color: '#10B981' },
      { id: 'stat_4', label: 'Placement Offers', value: '180+', color: '#F59E0B' }
    ]
  );
  const [savedMessage, setSavedMessage] = useState('');

  const updateCard = (index, field, value) => {
    setCards(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };

  const handleSave = () => {
    onSaveStatCards(cards);
    setSavedMessage('Stat cards updated successfully.');
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
          Platform Stat Cards Customizer
        </h3>
        <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: mutedColor }}>
          Modify public statistics numbers and metrics badges.
        </p>
      </div>

      {savedMessage && (
        <div style={{ padding: '10px 16px', borderRadius: '8px', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}>
          {savedMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {cards.map((card, idx) => (
          <div
            key={card.id || idx}
            style={{
              padding: '18px',
              borderRadius: '16px',
              backgroundColor: cardBg,
              border: `1.5px solid ${borderColor}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: mutedColor, marginBottom: '4px' }}>Metric Label</label>
              <input
                type="text"
                value={card.label}
                onChange={(e) => updateCard(idx, 'label', e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '12.5px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: mutedColor, marginBottom: '4px' }}>Value / Counter</label>
              <input
                type="text"
                value={card.value}
                onChange={(e) => updateCard(idx, 'value', e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
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
          <Save size={15} /> Save All Cards
        </button>
      </div>
    </div>
  );
}
