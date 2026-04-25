import React from 'react';
import { motion } from 'framer-motion';

const UnderProgress = ({ page = 'Coding' }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6" style={{ minHeight: '70vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="nx-card"
        style={{
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 40px',
          gap: '32px',
          textAlign: 'center',
          borderRadius: '2.5rem',
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* SN Logo */}
        <div style={{
          width: '72px',
          height: '80px',
          background: 'var(--accent-gradient)',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 900,
          color: 'white',
          letterSpacing: '-0.02em',
          boxShadow: '0 10px 20px -5px rgba(0, 242, 254, 0.3)',
        }}>
          SN
        </div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '560px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', margin: 0 }}>
            {page} <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Module</span> Offline
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
            The requested {page.toLowerCase()} section for <span style={{ color: 'var(--accent-primary)' }}>Sun Nexus Solutions</span> is undergoing maintenance or optimization.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: 'var(--accent-gradient)',
            color: 'white',
            border: 'none',
            borderRadius: '999px',
            padding: '14px 36px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 8px 24px -6px rgba(79,70,229,0.45)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Return to Command Center
        </button>
      </motion.div>
    </div>
  );
};

export default UnderProgress;
