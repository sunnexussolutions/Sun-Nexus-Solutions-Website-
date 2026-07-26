import React from 'react';
import { motion } from 'framer-motion';

const UnderProgress = ({ page = 'Coding', onReturn }) => {
  const handleReturn = () => {
    if (onReturn) {
      onReturn();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="nx-card shadow-2xl"
        style={{
          width: '100%',
          maxWidth: '740px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 32px',
          gap: '28px',
          textAlign: 'center',
          borderRadius: '2.25rem',
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* SN Logo Badge */}
        <div style={{
          width: '72px',
          height: '72px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
          borderRadius: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          boxShadow: '0 12px 24px -6px rgba(6, 182, 212, 0.4)',
        }}>
          SN
        </div>

        {/* Text Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '540px' }}>
          <h2 style={{ fontSize: '34px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.2 }}>
            {page} <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Module</span> Offline
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
            The requested {page.toLowerCase()} section for <span style={{ color: '#6366f1', fontWeight: 700 }}>Sun Nexus Solutions</span> is undergoing maintenance or optimization.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleReturn}
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '999px',
            padding: '14px 38px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 8px 24px -6px rgba(79,70,229,0.45)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Return to Command Center
        </button>
      </motion.div>
    </div>
  );
};

export default UnderProgress;
