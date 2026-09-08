import React from 'react';
import { Layers, Code, BrainCircuit, Cloud, Smartphone } from 'lucide-react';

const ICON_MAP = {
  Code,
  BrainCircuit,
  Cloud,
  Smartphone
};

/**
 * ── AdminDomainsTab ─────────────────────────────────────────────────
 * Engineering specializations, learning tracks, and student quotas.
 */
export default function AdminDomainsTab({
  domains = [],
  isDark = true
}) {
  const borderColor = isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9';
  const cardBg = isDark ? '#0E2740' : '#FFFFFF';
  const textColor = isDark ? '#F3F7FB' : '#0D1B2A';
  const mutedColor = isDark ? '#8EA6BC' : '#64748B';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: textColor }}>
          Engineering Domains & Specialization Tracks
        </h3>
        <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: mutedColor }}>
          Active student learning pathways and technical specialization sectors.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {domains.map(d => {
          const Icon = ICON_MAP[d.icon] || Layers;
          return (
            <div
              key={d.id}
              style={{
                padding: '20px',
                borderRadius: '16px',
                backgroundColor: cardBg,
                border: `1px solid ${borderColor}`,
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(40, 114, 161, 0.15)',
                  color: '#2872A1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Icon size={22} />
              </div>

              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: textColor }}>{d.name}</h4>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: mutedColor }}>{d.count || 0} Registered Students</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
