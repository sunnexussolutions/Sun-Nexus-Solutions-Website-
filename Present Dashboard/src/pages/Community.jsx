import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Plus, TrendingUp, Image as ImageIcon,
  Link as LinkIcon, CheckCircle2, Send, Trash2, X, Trophy, 
  Users, Award, Shield, Sparkles, Zap, ExternalLink, Activity,
  Globe, Layout, Cpu, Bell, Search, Filter, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

/* ─── UI Constancy Factory ─── */
const makeCompose = () => ({
  text: '',
  mediaFile: null,
  mediaPreview: null,
  resourceUrl: '',
  showResourceInput: false,
});

const REACTIONS = [
  { id: 'zap',   icon: Zap,    label: 'Genius', color: '#00f2fe' },
  { id: 'fire',  icon: Sparkles, label: 'Insight', color: '#4facfe' },
  { id: 'check', icon: CheckCircle2, label: 'Solved', color: '#34d399' },
  { id: 'idea',  icon: MessageSquare, label: 'Idea', color: '#ffa500' },
];

const Community = () => {
  const { user } = useAuth();
  const currentUserName = user?.name || user?.username || 'Guest';
  const currentUserInitial = currentUserName.charAt(0).toUpperCase();

  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('nexus-community-posts');
    return saved ? JSON.parse(saved) : [];
  });

  const [compose, setCompose] = useState(makeCompose());
  const [modalCompose, setModalCompose] = useState(makeCompose());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('nexus-community-posts', JSON.stringify(posts));
  }, [posts]);

  const handleMediaSelect = async (file, setter) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setter(prev => ({ ...prev, mediaFile: file, mediaPreview: e.target.result }));
    reader.readAsDataURL(file);
  };

  const submitPost = (c, resetFn) => {
    if (!c.text.trim() && !c.mediaPreview) return;
    const newPost = {
      id: Date.now(),
      user: currentUserName,
      role: user?.headline || 'Nexus Peer',
      avatar: user?.avatar || currentUserInitial,
      content: c.text,
      mediaPreview: c.mediaPreview || null,
      resourceUrl: c.resourceUrl.trim() || null,
      reactions: { zap: 0, fire: 0, check: 0, idea: 0 },
      userReactions: [],
      time: 'Just now',
      verified: user?.isAdmin || false,
      comments: [],
    };
    setPosts(prev => [newPost, ...prev]);
    resetFn(makeCompose());
    setIsModalOpen(false);
  };

  const addReaction = (postId, type) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const alreadyHas = p.userReactions?.includes(type);
      const newReactions = { ...p.reactions };
      const newUserReactions = alreadyHas ? p.userReactions.filter(r => r !== type) : [...(p.userReactions || []), type];
      newReactions[type] = alreadyHas ? Math.max(0, newReactions[type] - 1) : (newReactions[type] + 1);
      return { ...p, reactions: newReactions, userReactions: newUserReactions };
    }));
  };

  const handleDelete = (id) => setPosts(prev => prev.filter(p => p.id !== id));
  const toggleComments = (id) => setOpenComments(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAddComment = (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;
    setPosts(prev => prev.map(p =>
      p.id !== postId ? p : { ...p, comments: [...p.comments, { id: Date.now(), user: currentUserName, text, time: 'Just now' }] }
    ));
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const filteredPosts = posts.filter(p => 
    p.content?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 md:gap-10 animate-slide-up relative z-10 w-full px-4 md:px-0">
      <div className="aurora-accent" style={{ top: '-10%', right: '-10%' }} />
      <div className="aurora-accent" style={{ bottom: '10%', left: '-10%', opacity: 0.1 }} />

      {/* --- REFINED HEADER --- */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-primary)' }}>
              <Users size={20} />
            </div>
            <span className="font-black uppercase tracking-[0.2em] text-[10px]" style={{ color: 'var(--text-muted)' }}>Sovereign Hub</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter leading-none" style={{ color: 'var(--text-primary)' }}>
            The <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Council</span>
          </h1>
          <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>Collaborate with the elite global network.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} style={{ color: 'var(--text-muted)' }} />
            </div>
            <input 
              type="text" 
              placeholder="Search protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nx-input-modern pl-12 pr-6 py-4 w-full md:w-[280px] text-sm"
              style={{ borderRadius: '1.25rem' }}
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="nx-btn-primary px-8 py-4 rounded-2xl flex items-center gap-3 shadow-glow"
          >
            <Plus size={20} strokeWidth={3} />
            <span className="font-black tracking-ultra text-[10px] uppercase">New Post</span>
          </motion.button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* --- FEED SECTION --- */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Executive Suite: Imperial Glass Composer */}
          <div 
            style={{ 
              background: 'rgba(10, 14, 28, 0.4)',
              backdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '2rem',
              boxShadow: 'var(--depth-shadow)'
            }}
            className="relative overflow-hidden group mb-8 md:mb-12 px-5 py-6 md:p-10"
          >
            {/* Architectural Light Refraction */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 10% 10%, rgba(0, 242, 254, 0.04) 0%, transparent 40%)' }} />

            <div className="flex gap-6 relative z-10">
              <div className="flex flex-col items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#050a18] border border-white/5 relative z-10 transition-transform group-focus-within:border-accent-primary/30 shadow-2xl"
                >
                  <img 
                    src="https://raw.githubusercontent.com/Anantm007/Nexus-membership-/main/sun%20nexus%20logo.png" 
                    alt="Nexus" 
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div className="w-[1px] flex-1 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <textarea 
                  value={compose.text}
                  onChange={e => setCompose(p => ({ ...p, text: e.target.value.slice(0, 500) }))}
                  placeholder={`Establish protocol, ${currentUserName.split(' ')[0]}...`}
                  className="w-full bg-transparent border-none outline-none text-xl font-medium resize-none h-32 transition-all placeholder:text-muted/20"
                  style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}
                />

                <AnimatePresence>
                  {compose.mediaPreview && (
                    <motion.div initial={{ opacity:0, scale:0.98 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.98 }} className="relative rounded-2xl overflow-hidden border border-white/5 bg-black/40">
                      <img src={compose.mediaPreview} alt="Preview" className="w-full h-auto max-h-72 object-contain" />
                      <button onClick={() => setCompose(p => ({ ...p, mediaPreview: null, mediaFile: null }))} className="absolute top-4 right-4 p-2 bg-black/60 rounded-full hover:bg-red-500/80 transition-colors backdrop-blur-md"><X size={14} /></button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
                  <div className="flex gap-2">
                    <button onClick={() => fileRef.current?.click()} className="p-3 rounded-lg text-muted hover:text-accent-primary bg-white/5 hover:bg-accent-primary/10 transition-all"><ImageIcon size={20} /></button>
                    <button onClick={() => setCompose(p => ({ ...p, showResourceInput: !p.showResourceInput }))} className="p-3 rounded-lg text-muted hover:text-accent-primary bg-white/5 hover:bg-accent-primary/10 transition-all"><LinkIcon size={20} /></button>
                    <button className="p-3 rounded-lg text-muted hover:text-accent-primary bg-white/5 hover:bg-accent-primary/10 transition-all"><Cpu size={20} /></button>
                  </div>

                  <div className="flex items-center gap-6">
                    <AnimatePresence>
                      {compose.text.length > 0 && (
                        <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-[9px] font-black uppercase tracking-[0.2em] text-muted opacity-30">
                          {compose.text.length} / 500
                        </motion.span>
                      )}
                    </AnimatePresence>
                    
                    <motion.button 
                      animate={isSyncing ? { scale: [1, 0.98, 1], borderColor: 'rgba(0, 242, 254, 0.6)' } : {}}
                      whileHover={(!compose.text.trim() && !compose.mediaPreview) ? {} : { scale: 1.05, boxShadow: '0 0 30px rgba(0, 242, 254, 0.1)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (!compose.text.trim() && !compose.mediaPreview) return;
                        setIsSyncing(true);
                        setTimeout(() => {
                          submitPost(compose, setCompose);
                          setIsSyncing(false);
                        }, 1200);
                      }} 
                      className="relative px-8 py-3 rounded-xl border-[1.5px] text-accent-primary bg-transparent flex items-center gap-3 transition-all duration-300 overflow-hidden"
                      style={{ 
                        borderColor: (!compose.text.trim() && !compose.mediaPreview) ? 'rgba(255,255,255,0.05)' : 'rgba(0, 242, 254, 0.2)',
                        opacity: (!compose.text.trim() && !compose.mediaPreview) ? 0.3 : 1,
                        cursor: (!compose.text.trim() && !compose.mediaPreview) ? 'default' : 'pointer'
                      }}
                    >
                      <Activity size={14} className={isSyncing ? "animate-spin" : "animate-pulse"} />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                        {isSyncing ? 'Syncing' : 'Sync Pulse'}
                      </span>

                      {/* Perimeter sweep */}
                      {!isSyncing && !(!compose.text.trim() && !compose.mediaPreview) && (
                        <motion.div 
                          animate={{ left: ['-100%', '200%'] }} 
                          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-primary/10 to-transparent pointer-events-none"
                        />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
            <input ref={fileRef} type="file" className="hidden" onChange={e => handleMediaSelect(e.target.files?.[0], setCompose)} />
          </div>

          {/* Feed List */}
          <div className="flex flex-col gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPosts.length === 0 ? (
                <div className="nx-card p-20 text-center flex flex-col items-center gap-6" style={{ borderRadius: '2rem' }}>
                  <div className="p-6 rounded-3xl" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                    <Search size={40} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black">No protocols found</h3>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Adjust your search or be the first to post.</p>
                  </div>
                </div>
              ) : (
                filteredPosts.map((post, idx) => (
                  <motion.div key={post.id} layout initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
                    className="nx-card p-5 md:p-10 flex flex-col gap-6 md:gap-8 relative group"
                    style={{ borderRadius: '2rem' }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 font-black text-xl shadow-inner overflow-hidden relative group/avatar">
                          {post.avatar || post.user[0]}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{post.user}</h4>
                            {post.verified && <CheckCircle2 size={14} className="text-accent-primary" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md" style={{ background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-primary)' }}>{post.role}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>· {post.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDelete(post.id)} className="p-2.5 rounded-xl hover:bg-red-500/10 text-muted hover:text-red-400 transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      {post.content && <p className="text-lg md:text-xl font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>{post.content}</p>}
                      
                      {post.mediaPreview && (
                        <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group/media">
                          <img src={post.mediaPreview} alt="media" className="w-full object-cover max-h-[500px] transition-transform duration-700 group-hover/media:scale-[1.02]" />
                        </div>
                      )}

                      {post.resourceUrl && (
                        <motion.a 
                          whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.02)' }}
                          href={post.resourceUrl} target="_blank" rel="noreferrer" 
                          className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.01] border border-white/5 group/link"
                        >
                          <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary group-hover/link:scale-110 transition-transform"><LinkIcon size={20} /></div>
                          <div className="flex-1 truncate">
                             <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-0.5">Attached Resource</p>
                             <p className="font-bold text-sm text-accent-primary truncate">{post.resourceUrl.replace(/^https?:\/\//,'')}</p>
                          </div>
                          <ExternalLink size={14} className="text-muted group-hover/link:text-accent-primary" />
                        </motion.a>
                      )}

                      {/* --- ACTIONS --- */}
                      <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/5">
                        <div className="flex flex-wrap items-center gap-3">
                          {REACTIONS.map(re => {
                            const isActive = post.userReactions?.includes(re.id);
                            return (
                              <motion.button 
                                key={re.id} 
                                whileHover={{ scale: 1.05, y: -2 }}
                                onClick={() => addReaction(post.id, re.id)} 
                                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all ${isActive ? 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary' : 'bg-transparent border-transparent text-muted hover:text-primary hover:border-white/10'}`}
                              >
                                <re.icon size={14} fill={isActive ? 'currentColor' : 'none'} />
                                {post.reactions[re.id] || 0}
                              </motion.button>
                            );
                          })}
                        </div>
                        
                        <button 
                          onClick={() => toggleComments(post.id)} 
                          className={`flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${openComments[post.id] ? 'bg-accent-primary/10 text-accent-primary' : 'text-muted hover:text-primary'}`}
                        >
                          <MessageSquare size={16} /> {post.comments.length} Comments
                        </button>
                      </div>
                    </div>

                    {/* --- COMMENTS --- */}
                    <AnimatePresence>
                      {openComments[post.id] && (
                        <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} className="overflow-hidden">
                          <div className="flex flex-col gap-6 pt-6 border-t border-white/5">
                            {post.comments.map(c => (
                              <div key={c.id} className="flex gap-4 group/comment">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-muted font-black text-xs flex-shrink-0 group-hover/comment:bg-accent-gradient group-hover/comment:text-[#050a18] transition-all">{c.user[0]}</div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-black" style={{ color: 'var(--text-primary)' }}>{c.user}</span>
                                    <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest">{c.time}</span>
                                  </div>
                                  <p className="text-[14px] font-medium" style={{ color: 'var(--text-secondary)' }}>{c.text}</p>
                                </div>
                              </div>
                            ))}
                            
                            <div className="flex gap-4 pt-4">
                               <div className="w-10 h-10 rounded-xl bg-accent-gradient flex items-center justify-center text-[#050a18] font-black text-sm flex-shrink-0 shadow-lg">{currentUserInitial}</div>
                               <div className="relative flex-1">
                                 <input 
                                    type="text" 
                                    value={commentInputs[post.id] || ''} 
                                    onChange={e => setCommentInputs(p => ({ ...p, [post.id]: e.target.value }))} 
                                    onKeyPress={e => e.key === 'Enter' && handleAddComment(post.id)} 
                                    placeholder="Write a comment..." 
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-5 pr-14 text-sm outline-none focus:border-accent-primary/40 focus:bg-white/10 transition-all font-medium" 
                                  />
                                  <button onClick={() => handleAddComment(post.id)} className="absolute right-1.5 top-1.5 p-2 bg-accent-gradient text-[#050a18] rounded-xl shadow-lg">
                                    <Send size={16} />
                                  </button>
                               </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- SIDEBAR --- */}
        <div className="lg-col-span-4 flex flex-col gap-8">
          {/* Diagnostic Sidebar Panels */}
          <div className="nx-card p-8 flex flex-col gap-8 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-black flex items-center gap-3 mb-2 tracking-tight">
                <Layout size={20} className="text-accent-primary" />
                SYSTEM STATUS
              </h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Real-time engagement telemetry</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {[
                { label: 'Active Nodes', value: '14.2k', icon: Activity, color: 'var(--accent-primary)' },
                { label: 'Uptime', value: '99.9%', icon: Cpu,      color: 'var(--accent-secondary)' },
                { label: 'Global Hubs', value: '428',   icon: Globe,    color: '#34d399' },
                { label: 'Rank', value: '#12',   icon: Trophy,   color: '#ffa500' },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1 transition-all group/stat hover:border-accent-primary/20">
                   <stat.icon size={16} style={{ color: stat.color }} className="mb-1 opacity-50 group-hover/stat:opacity-100 transition-opacity" />
                   <span className="text-2xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>{stat.value}</span>
                   <span className="text-[9px] font-black uppercase tracking-widest opacity-30">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 relative z-10 pt-4 border-t border-white/5">
              <div className="flex justify-between items-end">
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Protocol Sync</span>
                 <span className="text-sm font-black text-accent-primary">84.2%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: '84.2%' }} transition={{ duration: 2 }} className="h-full bg-accent-gradient" />
              </div>
            </div>
          </div>

          {/* Trending Tags */}
          <div className="nx-card p-8 flex flex-col gap-6 relative overflow-hidden group">
            <h3 className="text-xl font-black flex items-center gap-3 tracking-tight">
              <TrendingUp size={20} className="text-accent-primary" />
              TRENDING TOPICS
            </h3>
            <div className="flex flex-wrap gap-2">
              {['SovereignUI', 'NexusCore', 'SolarGrid', 'Aptitude', 'ExecutiveCore', 'AI_Mentor'].map((tag, i) => (
                <button key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-accent-primary hover:border-accent-primary/30 hover:bg-accent-primary/5 transition-all">
                  #{tag}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* --- ADD POST MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={()=>setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
            <motion.div 
              initial={{ opacity:0, scale:0.95, y:40 }} 
              animate={{ opacity:1, scale:1, y:0 }} 
              exit={{ opacity:0, scale:0.95, y:40 }}
              className="relative w-full max-w-2xl bg-secondary border border-white/10 rounded-3xl md:rounded-[3rem] p-6 md:p-10 overflow-hidden shadow-2xl"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-strong)' }}
            >
               <div className="flex items-start justify-between mb-10">
                 <div className="space-y-1">
                    <h2 className="text-3xl font-black uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>New <span className="text-gradient-nexus">Protocol</span></h2>
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest">Share with the global council</p>
                 </div>
                 <button onClick={()=>setIsModalOpen(false)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"><X size={24} /></button>
               </div>

               <div className="flex gap-6 mb-8 items-start">
                 <div className="w-16 h-16 rounded-2xl bg-accent-gradient flex items-center justify-center text-[#050a18] font-black text-2xl flex-shrink-0 shadow-lg">{currentUserInitial}</div>
                 <div className="flex-1 space-y-6">
                    <textarea 
                      autoFocus 
                      value={modalCompose.text} 
                      onChange={e => setModalCompose(p => ({ ...p, text: e.target.value }))} 
                      placeholder="What protocol are you establishing today?" 
                      className="w-full h-44 bg-white/5 border border-white/5 rounded-2xl p-6 outline-none text-xl font-medium focus:border-accent-primary/20 transition-all text-white placeholder:opacity-20 resize-none" 
                    />
                    
                    {modalCompose.showResourceInput && (
                      <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} className="overflow-hidden">
                        <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4">
                          <LinkIcon size={18} style={{ color: 'var(--accent-primary)' }} />
                          <input 
                            type="text" 
                            value={modalCompose.resourceUrl} 
                            onChange={e => setModalCompose(p=>({...p, resourceUrl: e.target.value}))} 
                            placeholder="Resource URI (https://...)" 
                            className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-accent-primary" 
                          />
                        </div>
                      </motion.div>
                    )}
                 </div>
               </div>

               <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex gap-3">
                    <button className="p-4 rounded-xl bg-white/5 text-muted hover:text-accent-primary transition-all"><ImageIcon size={22} /></button>
                    <button 
                      onClick={() => setModalCompose(p => ({ ...p, showResourceInput: !p.showResourceInput }))} 
                      className={`p-4 rounded-xl bg-white/5 text-muted hover:text-accent-primary transition-all ${modalCompose.showResourceInput ? 'text-accent-primary bg-accent-primary/10' : ''}`}
                    >
                      <LinkIcon size={22} />
                    </button>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={()=>submitPost(modalCompose, setModalCompose)} 
                    className="nx-btn-primary px-10 py-4 rounded-2xl font-black uppercase tracking-ultra text-[10px]"
                  >
                    Sync to Council
                  </motion.button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;
