import React from 'react';
import { SearchX, Sparkles, RefreshCw } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DsaEmptyState({
  title = 'No problems found',
  description = 'Try adjusting your search query, filter criteria, or selected topic to find matching problems.',
  actionLabel = 'Reset Filters',
  onAction = null,
  icon: Icon = SearchX
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        borderRadius: '20px',
        backgroundColor: isDark ? '#0E2740' : '#FFFFFF',
        border: `1.5px dashed ${isDark ? 'rgba(203, 221, 233, 0.2)' : '#CBDDE9'}`,
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: isDark ? 'rgba(40, 114, 161, 0.2)' : '#EFF6FB',
          color: isDark ? '#4A90C2' : '#2872A1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}
      >
        <Icon size={26} />
      </div>

      <h3
        style={{
          fontSize: '17px',
          fontWeight: 700,
          color: isDark ? '#F3F7FB' : '#0D1B2A',
          margin: '0 0 6px 0',
          fontFamily: "'Poppins', sans-serif"
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: '13.5px',
          color: isDark ? '#8EA6BC' : '#475569',
          maxWidth: '420px',
          lineHeight: 1.55,
          margin: '0 0 20px 0',
          fontFamily: "'Poppins', sans-serif"
        }}
      >
        {description}
      </p>

      {onAction && (
        <button
          onClick={onAction}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 20px',
            borderRadius: '10px',
            backgroundColor: isDark ? '#2872A1' : '#2872A1',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(40, 114, 161, 0.25)',
            transition: 'all 0.2s ease',
            fontFamily: "'Poppins', sans-serif"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#205E86';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2872A1';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <RefreshCw size={14} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
