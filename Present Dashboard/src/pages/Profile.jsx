import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Edit3, Camera, Save, CheckCircle2, X, Briefcase, User,
  Code2, Zap, Star, Award, GitBranch, BookOpen, TrendingUp, MapPin, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_SKILLS = ['Python', 'React', 'Node.js', 'TensorFlow', 'FastAPI', 'PostgreSQL', 'Docker', 'TypeScript'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } },
};

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || user?.username || 'Nexus Member',
    headline: user?.headline || 'Member of Sun Nexus Solutions',
    location: user?.location || 'Global',
    joined: user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024',
    avatar: user?.avatar || (user?.name || user?.username || 'N')[0].toUpperCase(),
    skills: user?.skills || [...DEFAULT_SKILLS],
  });
  
  const [newSkill, setNewSkill] = useState('');
  
  const [draftData, setDraftData] = useState({ ...profileData });

  // Sync state if user changes (e.g. after update)
  React.useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || user.username,
        headline: user.headline || 'Member of Sun Nexus Solutions',
        location: user.location || 'Global',
        joined: new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        avatar: user.avatar || (user.name || user.username)[0].toUpperCase(),
        skills: user.skills || [...DEFAULT_SKILLS],
      });
    }
  }, [user]);

  const STATS = [
    { label: 'Total XP', value: user?.xp || 0, icon: GitBranch },
    { label: 'Accuracy', value: user?.results?.length ? Math.round(user.results.reduce((a, r) => a + (r.percentage || 0), 0) / user.results.length) + '%' : 'N/A', icon: Code2 },
    { label: 'Streak', value: (user?.streak || 0) + 'd', icon: Zap },
    { label: 'Submissions', value: user?.results?.length || 0, icon: Award },
  ];

  const ACTIVITY = (user?.results || []).slice(-4).reverse().map(r => ({
    icon: TrendingUp,
    color: '#10b981',
    text: `Completed ${r.topic}`,
    time: new Date(r.submittedAt).toLocaleDateString()
  }));

  if (ACTIVITY.length === 0) {
    ACTIVITY.push({ icon: Star, color: '#f59e0b', text: 'Welcome to Sun Nexus!', time: 'Now' });
  }

  const openModal = () => { setDraftData({ ...profileData }); setIsModalOpen(true); };
  const handleSave = async () => { 
    try {
      const res = await updateProfile({ 
        name: draftData.name, 
        headline: draftData.headline, 
        location: draftData.location,
        skills: draftData.skills
      });
      if (res.success) setIsModalOpen(false);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !draftData.skills.includes(newSkill.trim())) {
      setDraftData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setDraftData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show"
      className="flex flex-col gap-8 pb-12 animate-slide-up" style={{ maxWidth: '860px', margin: '0 auto', width: '100%' }}>

      {/* ── Identity Card ── */}
      <motion.div variants={itemVariants} className="nx-card relative overflow-hidden"
        style={{ borderRadius: '2rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)' }}>

        {/* Banner */}
        <div style={{ height: '200px', position: 'relative', overflow: 'hidden', background: '#0d0d14' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.45) 0%, rgba(34,211,238,0.3) 60%, transparent 100%)',
          }} />
          {/* Decorative orbs */}
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', filter: 'blur(30px)' }} />
          <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)', filter: 'blur(24px)' }} />
          {/* Edit banner hint */}
            {/* Edit Profile Action */}
            <button 
              onClick={openModal} 
              className="md:absolute md:top-4 md:right-4 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-black/45 backdrop-blur-md border border-white/10 text-white/90 text-xs font-bold cursor-pointer transition-all hover:bg-indigo-500/50"
              style={{
                zIndex: 20,
                position: window.innerWidth < 768 ? 'fixed' : 'absolute',
                bottom: window.innerWidth < 768 ? '24px' : 'auto',
                right: window.innerWidth < 768 ? '24px' : '16px',
                top: window.innerWidth < 768 ? 'auto' : '16px',
                boxShadow: window.innerWidth < 768 ? '0 10px 25px rgba(0,0,0,0.4)' : 'none'
              }}
            >
              <Edit3 size={14} /> 
              <span className="hidden sm:inline">Edit Profile</span>
            </button>
        </div>

        {/* Avatar + Info */}
        <div style={{ padding: '0 2rem 2rem', position: 'relative' }}>
          <div className="flex flex-col md:flex-row md:items-end justify-between items-center gap-4">
            {/* Avatar */}
            <div className="relative -mt-16 md:-mt-20">
              <div style={{
                width: '120px', height: '120px', borderRadius: '50%',
                border: '5px solid var(--bg-secondary)', boxShadow: 'var(--shadow-lg)',
                background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'white', fontSize: '3rem', fontWeight: 900,
              }}>
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <div style={{
                position: 'absolute', bottom: '4px', right: '4px', width: '28px', height: '28px',
                borderRadius: '50%', background: '#22c55e', border: '3px solid var(--bg-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircle2 size={14} color="white" />
              </div>
            </div>

            {/* Badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px',
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '999px', marginBottom: '0.5rem',
            }}>
              <Star size={13} style={{ color: '#f59e0b' }} fill="#f59e0b" />
              <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Elite Member</span>
            </div>
          </div>

          {/* Name & meta */}
          <div className="mt-4 flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              {profileData.name}
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.5 }}>
              {profileData.headline}
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                <MapPin size={12} /> {profileData.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                <Calendar size={12} /> Joined {profileData.joined}
              </span>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-white/5">
          {STATS.map(({ label, value, icon: Icon }, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.25rem 1rem',
              borderRight: i < 3 ? '1px solid var(--border-subtle)' : 'none',
              transition: 'background 0.2s', cursor: 'default',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Icon size={16} style={{ color: 'var(--accent-primary)', marginBottom: '6px' }} />
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Skills & Activity row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Skills */}
        <motion.div variants={itemVariants} className="nx-card p-6 flex flex-col gap-5">
          <h3 style={{ fontSize: '1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <Code2 size={18} style={{ color: 'var(--accent-primary)' }} /> Tech Stack
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {profileData.skills.map((skill, i) => (
              <motion.span key={i} whileHover={{ scale: 1.06, y: -2 }} style={{
                padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)', cursor: 'default', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="nx-card p-6 flex flex-col gap-5">
          <h3 style={{ fontSize: '1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <Zap size={18} style={{ color: '#f59e0b' }} /> Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {ACTIVITY.map(({ icon: Icon, color, text, time }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                  background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={15} style={{ color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</p>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Edit Modal ── */}
      {createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div role="dialog" style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(16px)', cursor: 'pointer' }} />

              <motion.div key="modal" initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                style={{
                  width: '100%', maxWidth: '520px', background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-strong)', borderRadius: '2rem',
                  boxShadow: '0 40px 80px rgba(0,0,0,0.6)', overflow: 'hidden', position: 'relative', zIndex: 10,
                }}>
                <div style={{ height: '6px', background: 'var(--accent-gradient)' }} />

                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(99,102,241,0.12)', color: 'var(--accent-primary)' }}>
                        <Edit3 size={18} />
                      </div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>Edit Profile</h2>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} style={{ padding: '6px', borderRadius: '8px', color: 'var(--text-muted)', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <X size={20} />
                    </button>
                  </div>

                  {/* Avatar row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'var(--bg-tertiary)', borderRadius: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.75rem', fontWeight: 900, flexShrink: 0, cursor: 'pointer', overflow: 'hidden' }}>
                      {draftData.name.charAt(0).toUpperCase()}
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', borderRadius: '50%' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                        <Camera size={18} color="white" />
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Profile Photo</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Click to upload a new avatar</p>
                    </div>
                  </div>

                  {/* Fields */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {[
                      { label: 'Display Name', name: 'name', icon: User, type: 'input' },
                      { label: 'Professional Headline', name: 'headline', icon: Briefcase, type: 'textarea' },
                      { label: 'Location', name: 'location', icon: MapPin, type: 'input' },
                    ].map(({ label, name, icon: Icon, type }) => (
                      <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', paddingLeft: '4px' }}>
                          <Icon size={11} /> {label}
                        </label>
                        {type === 'textarea' ? (
                          <textarea name={name} value={draftData[name]} onChange={e => setDraftData(p => ({ ...p, [name]: e.target.value }))}
                            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '1rem', padding: '0.875rem 1.25rem', color: 'var(--text-primary)', fontWeight: 500, outline: 'none', resize: 'none', minHeight: '90px', lineHeight: 1.6, fontSize: '14px', transition: 'border 0.2s', fontFamily: 'inherit' }}
                            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'} />
                        ) : (
                          <input type="text" name={name} value={draftData[name]} onChange={e => setDraftData(p => ({ ...p, [name]: e.target.value }))}
                            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '1rem', padding: '0.875rem 1.25rem', color: 'var(--text-primary)', fontWeight: 600, outline: 'none', fontSize: '14px', transition: 'border 0.2s' }}
                            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'} />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Skills Section */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', paddingLeft: '4px' }}>
                      <Code2 size={11} /> Proficiency Stack
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      {draftData.skills.map((skill, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: '10px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          {skill}
                          <button onClick={() => removeSkill(skill)} style={{ color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        placeholder="Add professional skill..." 
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && addSkill()}
                        style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '1rem', padding: '0.875rem 1.25rem', color: 'var(--text-primary)', outline: 'none', fontSize: '14px', transition: 'border 0.2s' }}
                        onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                      />
                      <button onClick={addSkill} style={{ padding: '0 1.25rem', borderRadius: '1rem', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>Add</button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)} 
                      style={{ flex: 1, padding: '1rem', borderRadius: '1rem', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', transition: 'all 0.2s', border: '1px solid var(--border-subtle)', background: 'transparent' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                      Cancel
                    </button>
                    <button 
                      type="button"
                      onClick={handleSave} 
                      className="nx-btn-primary" 
                      style={{ flex: 2, padding: '1rem', borderRadius: '1rem', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <Save size={16} /> Save Changes
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};

export default Profile;
