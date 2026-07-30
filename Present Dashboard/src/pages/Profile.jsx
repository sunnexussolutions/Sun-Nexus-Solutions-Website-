import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Edit3, Camera, Save, CheckCircle2, X, Briefcase, User,
  Code2, Zap, Star, Award, GitBranch, BookOpen, TrendingUp, MapPin, Calendar,
  Layers, Rocket, ArrowRight, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjects } from '../store/dataStore';
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

const ResponsiveStyles = () => (
  <style>{`
    .profile-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding-bottom: 3rem;
      max-width: 860px;
      margin: 0 auto;
      width: 100%;
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .identity-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      text-align: center;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-secondary);
    }

    .project-grid, .activity-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 768px) {
      .identity-header {
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
        text-align: left;
      }
      .project-grid, .activity-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem 1rem;
      border-right: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
    }

    .stat-item:nth-child(even) { border-right: none; }

    @media (min-width: 1024px) {
      .stat-item { border-bottom: none; }
      .stat-item:nth-child(even) { border-right: 1px solid var(--border-subtle); }
      .stat-item:last-child { border-right: none; }
    }

    .banner-camera-btn {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(8px);
      padding: 8px;
      border-radius: 50%;
      color: white;
      border: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
      opacity: 0;
      transition: all 0.3s;
      z-index: 30;
    }

    .banner-container:hover .banner-camera-btn {
      opacity: 1;
    }

    .avatar-camera-btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #4f46e5;
      padding: 6px;
      border-radius: 50%;
      color: white;
      border: 2px solid var(--bg-secondary);
      cursor: pointer;
      z-index: 40;
    }

    @keyframes nexusGlow {
      0% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.3), 0 0 30px rgba(99, 102, 241, 0.1); }
      50% { box-shadow: 0 0 35px rgba(255, 255, 255, 0.6), 0 0 55px rgba(255, 255, 255, 0.2); }
      100% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.3), 0 0 30px rgba(99, 102, 241, 0.1); }
    }

    .nexus-modal {
      width: 100%;
      max-width: 520px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-strong);
      border-radius: 2rem;
      box-shadow: 0 40px 80px rgba(0,0,0,0.6);
      overflow: hidden;
      position: relative;
      z-index: 10;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    .modal-body {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      overflow-y: auto;
      flex: 1;
    }

    @media (max-width: 480px) {
      .nexus-modal {
        border-radius: 1.5rem;
      }
      .modal-body {
        padding: 1.25rem;
        gap: 1.5rem;
      }
    }
  `}</style>
);

const ProjectItem = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ 
      background: 'var(--bg-tertiary)', 
      border: '1px solid var(--border-subtle)', 
      borderRadius: '1.25rem', 
      overflow: 'hidden', 
      transition: 'all 0.3s' 
    }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: `${project.color || '#6366f1'}15`, color: project.color || '#6366f1' }}>
            <Rocket size={18} />
          </div>
          <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '14px' }}>{project.title}</span>
        </div>
        <ArrowRight size={16} style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.3s', color: 'var(--text-muted)' }} />
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--border-subtle)', marginTop: '4px', paddingTop: '1.25rem' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {project.desc}
              </p>
              
              {project.team && project.team.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h5 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '12px', letterSpacing: '0.1em' }}>Project Team</h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {project.team.map((member, mi) => (
                      <div key={mi} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px 12px 6px 6px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                        <img src={member.image} alt={member.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent-primary)' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/24'; }} />
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <a href={project.github || '#'} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)', textDecoration: 'none' }}>
                  <GitBranch size={14} /> Github
                </a>
                <a href={project.live || '#'} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', fontWeight: 800, color: 'white', textDecoration: 'none' }}>
                  <Rocket size={14} /> Live Demo
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState({ avatar: false, banner: false });
  
  const [profileData, setProfileData] = useState({
    name: user?.name || user?.username || 'Nexus Member',
    headline: user?.headline || 'Member of Sun Nexus Solutions',
    location: user?.location || 'Global',
    joined: user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024',
    avatar: user?.avatar || '',
    banner: user?.banner || '',
    skills: user?.skills ? (typeof user.skills === 'string' ? JSON.parse(user.skills) : user.skills) : [...DEFAULT_SKILLS],
    projects: user?.projects ? (typeof user.projects === 'string' ? JSON.parse(user.projects) : user.projects) : [
      { 
        status: 'completed', 
        title: 'Meeting Summarizer', 
        tech: ['AI', 'NLP', 'Python'], 
        desc: 'An AI-powered tool that automatically transcribes and summarizes meetings, extracting key points and decisions.', 
        github: 'https://github.com/Bareddycharitha/Meeting-summariser', 
        live: '#', 
        color: '#6366f1',
        team: [{ name: "B.Charitha Reddy", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg" }]
      },
      { 
        status: 'ongoing', 
        title: 'Lab Manage System', 
        tech: ['AI', 'Database'], 
        desc: 'AI-based lab management and resource optimization for scheduled experiments and equipment usage.', 
        github: '#', 
        live: '#', 
        color: '#22d3ee',
        team: [
          { name: "C.Mallikarjuna Rao", image: "https://ik.imagekit.io/kofq4cdghu/IMG_20241008_135227_1_.jpg?updatedAt=1759896755572" },
          { name: "N.Amrutha Varshini", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772639381/amrutha_varshini_mgyn9n.jpg" }
        ]
      }
    ],
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [draftData, setDraftData] = useState({ ...profileData });

  React.useEffect(() => {
    const fetchOfficialProjects = async () => {
      if (user?.id) {
        const official = await getProjects(user.id);
        if (official && official.length > 0) {
          setProfileData(prev => ({ ...prev, projects: official }));
        }
      }
    };
    fetchOfficialProjects();

    if (user) {
      setProfileData({
        name: user.name || user.username,
        headline: user.headline || 'Member of Sun Nexus Solutions',
        location: user.location || 'Global',
        joined: new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        avatar: user.avatar || '',
        banner: user.banner || '',
        skills: user.skills ? (typeof user.skills === 'string' ? JSON.parse(user.skills) : user.skills) : [...DEFAULT_SKILLS],
        projects: user.projects ? (typeof user.projects === 'string' ? JSON.parse(user.projects) : user.projects) : [],
      });
    }
  }, [user]);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [type]: true }));
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'nexus_uploads');

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.secure_url) {
        await updateProfile({ [type]: data.secure_url });
        setProfileData(prev => ({ ...prev, [type]: data.secure_url }));
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

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

  const openModal = () => { 
    if (profileData) {
      setDraftData({ ...profileData }); 
      setIsModalOpen(true); 
    }
  };

  const handleSave = async () => { 
    try {
      const res = await updateProfile({ 
        name: draftData.name, 
        headline: draftData.headline, 
        location: draftData.location,
        skills: draftData.skills,
        projects: draftData.projects
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
    <>
      <ResponsiveStyles />
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="profile-container animate-slide-up">
        
        {/* ── Identity Card ── */}
        <motion.div variants={itemVariants} className="nx-card relative overflow-hidden" style={{ borderRadius: '2rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)' }}>
          <div className="banner-container" style={{ height: '200px', position: 'relative', overflow: 'hidden', background: '#0d0d14' }}>
            {profileData.banner ? (
              <img src={profileData.banner} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Banner" />
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(99,102,241,0.45) 0%, rgba(34,211,238,0.3) 60%, transparent 100%)' }} />
            )}
            <label className="banner-camera-btn">
              {uploading.banner ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} />
            </label>
            <button 
              onClick={openModal} 
              className="flex items-center gap-4 px-4 py-2.5 transition-all cursor-pointer" 
              style={{ 
                zIndex: 20, 
                position: 'absolute', 
                top: '24px', 
                right: '24px',
                background: 'transparent',
                color: '#ffffff', 
                border: '2px solid #ffffff',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '16px',
                letterSpacing: '0.5rpx',
                textTransform: 'uppercase',
                backdropFilter: 'blur(4px)',
                animation: 'nexusGlow 3s infinite ease-in-out',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.1)'
              }}
              onMouseEnter={e => { 
                e.currentTarget.style.transform = 'scale(1.03) translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = '#ffffff';
                e.currentTarget.style.animation = 'none';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 255, 255, 0.5)';
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.animation = 'nexusGlow 3s infinite ease-in-out';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.1)';
              }}
            >
              <Edit3 size={18} strokeWidth={3} /> 
              <span>Edit Profile</span>
            </button>
          </div>

          <div style={{ padding: '0 2rem 2rem', position: 'relative' }}>
            <div className="identity-header">
              <div style={{ position: 'relative', marginTop: '-4rem' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '5px solid var(--bg-secondary)', boxShadow: 'var(--shadow-lg)', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem', fontWeight: 900, overflow: 'hidden' }}>
                  {profileData.avatar ? <img src={profileData.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : profileData.name.charAt(0).toUpperCase()}
                </div>
                <label className="avatar-camera-btn">
                  <Camera size={14} />
                  <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '999px', marginBottom: '0.5rem' }}>
                <Star size={13} style={{ color: '#f59e0b' }} fill="#f59e0b" />
                <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Elite Member</span>
              </div>
            </div>

            <div className="identity-header" style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{profileData.name}</h1>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.5 }}>{profileData.headline}</p>
              </div>
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}><MapPin size={12} /> {profileData.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}><Calendar size={12} /> Joined {profileData.joined}</span>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            {STATS.map(({ label, value, icon: Icon }, i) => (
              <div key={i} className="stat-item" onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Icon size={16} style={{ color: 'var(--accent-primary)', marginBottom: '6px' }} />
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Project Hub ── */}
        <motion.div variants={itemVariants} className="nx-card p-8 flex flex-col gap-6">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
              <Layers size={22} style={{ color: 'var(--accent-primary)' }} /> Project Hub
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['completed', 'ongoing'].map((status) => (
              <div key={status} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '12px 20px', background: 'rgba(99,102,241,0.1)', borderRadius: '14px', borderLeft: '4px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                    {status === 'completed' ? '🏆 Completed Projects' : '⚡ Ongoing Developments'}
                  </h4>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {profileData.projects.filter(p => p.status === status).length} Items
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.projects.filter(p => p.status === status).map((project, i) => (
                    <ProjectItem key={i} project={project} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skills & Activity row */}
        <div className="activity-grid">

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
              {ACTIVITY.map((act, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${act.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <act.icon size={15} style={{ color: act.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.text}</p>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{act.time}</span>
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
            <div role="dialog" style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <motion.div 
                key="backdrop" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsModalOpen(false)} 
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  background: 'rgba(0,0,0,0.4)', 
                  backdropFilter: 'blur(20px)', 
                  WebkitBackdropFilter: 'blur(20px)',
                  cursor: 'pointer' 
                }} 
              />
              <motion.div 
                key="modal" 
                initial={{ opacity: 0, scale: 0.92, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.92, y: 20 }} 
                transition={{ type: 'spring', stiffness: 300, damping: 26 }} 
                className="nexus-modal"
              >
                <div style={{ height: '6px', background: 'var(--accent-gradient)', flexShrink: 0 }} />
                <div className="modal-body">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(99,102,241,0.12)', color: 'var(--accent-primary)' }}><Edit3 size={18} /></div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>Edit Profile</h2>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'var(--bg-tertiary)', borderRadius: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.75rem', fontWeight: 900, flexShrink: 0, overflow: 'hidden' }}>
                      {draftData?.avatar ? <img src={draftData.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (draftData?.name || 'N').charAt(0).toUpperCase()}
                      <label style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                        {uploading?.avatar ? <Loader2 size={18} className="animate-spin text-white" /> : <Camera size={18} color="white" />}
                        <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
                      </label>
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Profile Photo</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Click icon to upload</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {[
                      { label: 'Display Name', name: 'name', icon: User, type: 'input' },
                      { label: 'Professional Headline', name: 'headline', icon: Briefcase, type: 'textarea' },
                      { label: 'Location', name: 'location', icon: MapPin, type: 'input' },
                    ].map(({ label, name, icon: Icon, type }) => (
                      <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}><Icon size={11} /> {label}</label>
                        {type === 'textarea' ? (
                          <textarea value={draftData[name]} onChange={e => setDraftData(p => ({ ...p, [name]: e.target.value }))} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '1rem', padding: '0.875rem 1.25rem', color: 'var(--text-primary)', outline: 'none', resize: 'none', minHeight: '90px', fontSize: '14px', fontFamily: 'inherit' }} />
                        ) : (
                          <input type="text" value={draftData[name]} onChange={e => setDraftData(p => ({ ...p, [name]: e.target.value }))} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '1rem', padding: '0.875rem 1.25rem', color: 'var(--text-primary)', outline: 'none', fontSize: '14px' }} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Skills Section Restoration */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', paddingLeft: '4px' }}>
                      <Code2 size={11} /> Proficiency Stack
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      {draftData?.skills?.map((skill, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: '10px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          {skill}
                          <button onClick={() => removeSkill(skill)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}><X size={12} /></button>
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
                        style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '1rem', padding: '0.875rem 1.25rem', color: 'var(--text-primary)', outline: 'none', fontSize: '14px' }}
                      />
                      <button onClick={addSkill} style={{ padding: '0 1.25rem', borderRadius: '1rem', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', cursor: 'pointer' }}>Add</button>
                    </div>
                  </div>

                  {/* Projects Editor Restored */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                    <h3 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers size={14} /> Project Portfolio
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {draftData?.projects?.map((proj, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                          <span style={{ flex: 1, fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{proj.title}</span>
                          <button onClick={() => {
                            const newProjs = [...draftData.projects];
                            newProjs.splice(idx, 1);
                            setDraftData({ ...draftData, projects: newProjs });
                          }} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button onClick={() => {
                      const title = prompt("Project Title?");
                      const desc = prompt("Detailed Report?");
                      const status = prompt("Status? (completed/ongoing)");
                      const github = prompt("Github Link?");
                      const live = prompt("Live Server Link?");
                      if (title && desc) {
                        const newProj = { 
                          title, 
                          desc, 
                          status: status || 'completed',
                          github: github || '#',
                          live: live || '#',
                          tech: ['New'], 
                          color: ['#6366f1', '#22d3ee', '#f59e0b', '#10b981'][Math.floor(Math.random() * 4)] 
                        };
                        setDraftData({ ...draftData, projects: [...(draftData.projects || []), newProj] });
                      }
                    }} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px dashed var(--accent-primary)', background: 'transparent', color: 'var(--accent-primary)', fontWeight: 800, fontSize: '11px', cursor: 'pointer' }}>
                      + ADD NEW PROJECT
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '1rem', borderRadius: '1rem', fontWeight: 800, fontSize: '12px', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleSave} style={{ flex: 2, padding: '1rem', borderRadius: '1rem', fontWeight: 900, fontSize: '12px', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}><Save size={16} /> Save Changes</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
      </motion.div>
    </>
  );
};

export default Profile;
