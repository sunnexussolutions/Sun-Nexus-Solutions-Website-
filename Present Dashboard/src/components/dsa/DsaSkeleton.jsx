import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DsaSkeleton({ type = 'card', count = 3 }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const baseStyle = {
    backgroundColor: isDark ? 'rgba(203, 221, 233, 0.06)' : '#EFF6FB',
    borderRadius: '12px',
    animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
            border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ ...baseStyle, width: '40%', height: '20px' }} />
            <div style={{ ...baseStyle, width: '60px', height: '24px', borderRadius: '999px' }} />
          </div>
          <div style={{ ...baseStyle, width: '80%', height: '14px' }} />
          <div style={{ ...baseStyle, width: '100%', height: '8px', borderRadius: '4px' }} />
        </div>
      ))}
    </div>
  );
}
