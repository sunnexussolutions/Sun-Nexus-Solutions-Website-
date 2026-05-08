import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  User, Mail, MapPin, Globe, Award, Shield,
  Linkedin, Github, Twitter, Zap, Cpu, Layout, Brain,
  X, ArrowUpRight, Activity, Star, BarChart3, Fingerprint, Search, Bell, Menu,
  Clock, CheckCircle2, MessageSquare, Calendar, UserPlus, Briefcase, GraduationCap, Laptop, Settings, Target, Users,
  FileText, Share2, Eye, Download, Check, Camera, Upload, Loader2
} from 'lucide-react';
import { getResults } from '../store/dataStore';
import { uploadToCloudinary } from '../lib/cloudinary';

const StatCard = ({ icon: Icon, label, value, subtext, color, progress }) => (
  <div className="bg-[#16181f] border border-[#232733] rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-white/10 transition-colors">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${color}10, transparent 70%)` }} />
    
    <div className="flex items-center gap-3 relative z-10">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '15', color: color }}>
        <Icon size={16} strokeWidth={2.5} />
      </div>
      <span className="text-[11px] text-white/50 font-bold">{label}</span>
    </div>
    
    <div className="flex items-baseline gap-1.5 relative z-10">
      <span className="text-3xl font-black tracking-tight text-white">{value}</span>
      {subtext && <span className="text-[10px] text-white/40 font-medium">{subtext}</span>}
    </div>
    
    <div className="w-full h-1.5 rounded-full bg-[#232733] mt-2 overflow-hidden relative z-10">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: progress }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full rounded-full" 
        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}80` }} 
      />
    </div>
  </div>
);

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSkills, setTempSkills] = useState("");
  const [draftData, setDraftData] = useState({});
  const [profileData, setProfileData] = useState({
    name: '',
    headline: '',
    location: '',
    avatar: '',
    skills: [],
    score: 0,
    stats: {
      completion: '0%',
      applications: '0',
      interviews: '0',
      endorsed: '0',
      reviews: '0',
      growth: '0%'
    }
  });

  const [uploading, setUploading] = useState(false);
  const [userResults, setUserResults] = useState([]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const imageUrl = await uploadToCloudinary(file);
    if (imageUrl) {
      setDraftData({ ...draftData, avatar: imageUrl });
      // If we are not in the modal, we can update immediately
      if (!isModalOpen) {
        updateProfile({ avatar: imageUrl });
      }
    }
    setUploading(false);
  };

  const loadData = () => {
    if (user) {
      const nameStr = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Nexus Member';
      setProfileData({
        name: nameStr,
        headline: user.headline || 'Product Developer',
        location: user.location || 'Nexus Global',
        avatar: user.avatar || 'https://res.cloudinary.com/djw0g8duw/image/upload/v1763865310/link_img_rusktx.png',
        skills: user.skills?.length ? user.skills : ['Javascript', 'React', 'Node.js', 'UI/UX'],
        score: user.xp ? Math.min(100, Math.floor(user.xp / 100)) : 85,
        stats: {
          completion: user.profileCompletion || '100%',
          applications: user.applications || '0',
          interviews: user.interviews || '0',
          endorsed: user.skillsEndorsed || '0',
          reviews: user.projectReviews || '5.0/5',
          growth: user.networkGrowth || '+0%'
        }
      });
    }
  };

  useEffect(() => {
    loadData();
    const fetchUserResults = async () => {
      if (user?.id) {
        const results = await getResults(user.id);
        setUserResults(results);
        
        // Calculate Dynamic Score
        if (results.length > 0) {
          const avg = Math.round(results.reduce((a, r) => a + (r.percentage || 0), 0) / results.length);
          setProfileData(prev => ({ ...prev, score: avg }));
        } else {
          setProfileData(prev => ({ ...prev, score: 0 }));
        }
      }
    };
    fetchUserResults();
    
    window.addEventListener('nexus-data-updated', loadData);
    return () => window.removeEventListener('nexus-data-updated', loadData);
  }, [user]);

  const skillColors = {
    Python: '#a855f7', AWS: '#eab308', React: '#10b981', 'Data Science': '#6366f1',
    AI: '#a855f7', Docker: '#0ea5e9', SQL: '#eab308', Kubernetes: '#3b82f6', GraphQL: '#ec4899',
    Javascript: '#f7df1e', 'Node.js': '#339933', 'UI/UX': '#ff61f6'
  };

  const getSkillColor = (skill) => skillColors[skill] || '#6366f1';

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const idx = (currentMonthIdx - i + 12) % 12;
    last6Months.push(months[idx]);
  }

  const chartData = last6Months.map(month => ({
    m: month,
    p: Math.floor(Math.random() * 40) + 40,
    a: Math.floor(Math.random() * 40) + 30,
    mng: Math.floor(Math.random() * 40) + 20,
  }));

  return (
    <div className="flex min-h-screen bg-[#0b0c10] text-white font-sans overflow-hidden">
      
      {/* ── SIDEBAR ── */}
      <div className="w-[280px] bg-[#12141a] border-r border-[#1f222b] p-6 flex flex-col h-screen overflow-y-auto shrink-0 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-8 px-2 relative z-10">
          <div className="relative flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-[3px] border-cyan-400 absolute left-0" />
            <div className="w-6 h-6 rounded-full border-[3px] border-indigo-500 absolute left-3 mix-blend-screen" />
            <div className="w-9 h-6" />
          </div>
          <span className="text-base font-black tracking-tight text-white/90 uppercase tracking-widest">Nexus Careers</span>
        </div>

        <div 
          className="relative rounded-[20px] p-5 flex flex-col items-center bg-gradient-to-b from-[#1c202a] to-[#12141a] border border-[#232733] z-10 group shadow-lg"
        >
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-t-[20px] pointer-events-none" />
          
          <div className="relative group/avatar" style={{ position: 'relative' }}>
            <div 
              className="rounded-full border-[2px] border-[#2a2e3d] overflow-hidden mb-3 relative transition-all"
              style={{ 
                width: '48px', 
                height: '48px', 
                position: 'relative',
                border: '2px solid #2a2e3d'
              }}
            >
              <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Loader2 className="animate-spin text-white" size={14} />
                </div>
              )}
            </div>
            <label 
              className="absolute cursor-pointer shadow-xl transition-all border border-white/20"
              style={{ 
                position: 'absolute',
                bottom: '-8px',
                right: '-8px',
                padding: '10px',
                backgroundColor: '#4f46e5',
                borderRadius: '50%',
                boxShadow: '0 0 15px rgba(79,70,229,0.6)',
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Camera size={22} style={{ color: 'white' }} />
              <input type="file" className="hidden" style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
          
          <h2 className="text-[15px] font-bold text-white/90 text-center">{profileData.name}</h2>
          <div className="flex items-center gap-1.5 bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full mt-2 border border-teal-500/20 shadow-[0_0_10px_rgba(20,184,129,0.1)]">
            <div className="bg-teal-400 rounded-full p-[1px] text-[#12141a]">
              <Check size={8} strokeWidth={4} />
            </div>
            <span className="text-[9px] font-bold tracking-wide">Verified Identity</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-6 z-10">
          {[
            { icon: Layout, label: 'Dashboard', active: true },
            { icon: User, label: 'Profile' },
            { icon: FileText, label: 'Assessments' },
          ].map((item, i) => (
            <button key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${item.label === 'Profile' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={16} strokeWidth={item.label === 'Profile' ? 2.5 : 2} /> {item.label}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-8 border-t border-[#1f222b] z-10">
          <h3 className="text-[13px] font-bold text-white/90 mb-5 text-center">Skill Landscape</h3>
          <div className="flex flex-wrap gap-2.5 justify-center px-2">
            {profileData.skills.map((s, i) => {
              const color = getSkillColor(s);
              return (
                <span key={i} className="px-3 py-1.5 rounded-xl text-[11px] font-bold border" style={{ color: color, borderColor: color + '40', backgroundColor: color + '08' }}>
                  {s}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 lg:p-10 xl:p-12 h-screen overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[600px] h-[300px] bg-gradient-to-bl from-cyan-500/10 via-purple-500/5 to-transparent blur-[100px] pointer-events-none" />
        
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8 relative z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-[22px] font-bold text-white/90">Identity Vault</h1>
            <button 
              onClick={() => {
                setDraftData({ ...profileData });
                setTempSkills(profileData.skills.join(', '));
                setIsModalOpen(true);
              }}
              className="px-6 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold hover:bg-indigo-500/20 transition-all"
            >
              Update Credentials
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-1 gap-4">
               <StatCard icon={User} label="Vault Integrity" value={profileData.stats.completion} color="#a855f7" progress="100%" />
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-[#16181f] border border-[#232733] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden h-[240px]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none" />
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <path d="M 40 160 A 85 85 0 1 1 160 160" fill="none" stroke="#232733" strokeWidth="14" strokeLinecap="round" />
                    <motion.path d="M 40 160 A 85 85 0 1 1 160 160" fill="none" stroke="#8b5cf6" strokeWidth="14" strokeLinecap="round" strokeDasharray="400" initial={{ strokeDashoffset: 400 }} animate={{ strokeDashoffset: 400 - (400 * (profileData.score / 100)) }} transition={{ duration: 1.5 }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                    <span className="text-5xl font-black tracking-tighter text-white">{profileData.score}</span>
                    <span className="text-[11px] text-white/50 font-bold mt-1 uppercase tracking-widest">Nexus XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            <h3 className="text-[15px] font-bold text-white/90">Assessment Log</h3>
            <div className="bg-[#16181f] border border-[#232733] rounded-2xl p-5 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="text-[10px] text-white/40 font-bold uppercase tracking-widest border-b border-[#232733]">
                    <th className="pb-4 pl-2">Subject</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Score</th>
                    <th className="pb-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {userResults.length > 0 ? userResults.map((r, i) => (
                    <tr key={i} className="border-b border-[#232733]/50 hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pl-2 font-bold text-[13px]">{r.topic}</td>
                      <td className="py-4"><span className="px-3 py-1 rounded-lg text-[9px] font-black bg-teal-500/10 text-teal-400 border border-teal-500/20">COMPLETED</span></td>
                      <td className="py-4 text-[13px] font-bold">{r.percentage}%</td>
                      <td className="py-4 text-[12px] text-white/40">{new Date(r.submittedAt).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="py-8 text-center text-white/20 font-bold uppercase tracking-widest text-xs">No activity logged</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(14px)' }} />
              <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', pointerEvents: 'none' }}>
                <motion.div initial={{ opacity: 0, scale: 0.93, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93, y: 24 }} style={{ pointerEvents: 'auto', width: '100%', maxWidth: '560px', background: '#16181f', border: '1px solid #232733', borderRadius: '2rem', overflow: 'hidden' }}>
                  <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
                      <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.05em' }}>Modify Identity</h2>
                      <button onClick={() => setIsModalOpen(false)} style={{ color: 'white' }}><X size={24}/></button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                       <input className="nx-input-modern" placeholder="Full Name" value={draftData.name} onChange={e => setDraftData({ ...draftData, name: e.target.value })} />
                       <input className="nx-input-modern" placeholder="Headline" value={draftData.headline} onChange={e => setDraftData({ ...draftData, headline: e.target.value })} />
                       <input className="nx-input-modern" placeholder="Avatar URL" value={draftData.avatar} onChange={e => setDraftData({ ...draftData, avatar: e.target.value })} />
                       <input className="nx-input-modern" placeholder="Skills (Comma separated)" value={tempSkills} onChange={e => setTempSkills(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => setIsModalOpen(false)} className="flex-1 nx-btn-3d-muted">Cancel</button>
                      <button 
                        onClick={() => { 
                          const nameParts = draftData.name.trim().split(/\s+/);
                          const updated = { ...draftData, firstName: nameParts[0] || "", lastName: nameParts.slice(1).join(" ") || "", skills: tempSkills.split(',').map(s => s.trim()).filter(s => s !== "") };
                          updateProfile(updated);
                          setIsModalOpen(false); 
                        }} 
                        className="flex-[1.5] nx-btn-3d"
                      >Update Identity</button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default Profile;
