import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  HelpCircle, ChevronLeft, Timer, Award, Trophy,
  Target, Zap, Brain, MessageSquare, BookOpen, ArrowRight,
  TrendingUp, X, PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssessments, getResults } from '../store/dataStore';
import AssessmentModal from '../components/AssessmentModal';
import { useAuth } from '../contexts/AuthContext';

const CATEGORY_META = [
  { title: 'Quantitative',      code: 'QA', icon: Target,        color: '#7c3aed' },
  { title: 'Logical Reasoning', code: 'LR', icon: Brain,         color: '#06b6d4' },
  { title: 'Verbal Ability',    code: 'VA', icon: BookOpen,      color: '#f59e0b' },
];

const YOUTUBE_LINKS = {
  'Fractions and Decimals':    'https://www.youtube.com/watch?v=tnc9ojITRg4',
  'Simplification':            'https://www.youtube.com/watch?v=ZuMJFleXmiw',
  'Surds and Indices':         'https://www.youtube.com/watch?v=jAbpPTpz2bQ',
  'Permutation & Combination': 'https://www.youtube.com/watch?v=ETiRE7N7pEI',
  'Syllogisms':                'https://www.youtube.com/results?search_query=syllogisms+logical+reasoning',
  'Blood Relations':           'https://www.youtube.com/results?search_query=blood+relations+logical+reasoning',
  'Seating Arrangement':       'https://www.youtube.com/results?search_query=seating+arrangement+reasoning',
  'Coding-Decoding':           'https://www.youtube.com/results?search_query=coding+decoding+reasoning',
  'Direction Sense':           'https://www.youtube.com/results?search_query=direction+sense+reasoning',
  'Synonyms & Antonyms':       'https://www.youtube.com/results?search_query=synonyms+antonyms+verbal+ability',
  'Sentence Correction':       'https://www.youtube.com/results?search_query=sentence+correction+verbal+ability',
  'Reading Comprehension':     'https://www.youtube.com/results?search_query=reading+comprehension+verbal+ability',
  'Cloze Test':                'https://www.youtube.com/results?search_query=cloze+test+verbal+ability',
};

const Aptitude = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [assessments, setAssessments] = useState([]);
  
  const refreshResults = async () => {
    const res = await getResults();
    setAllResults(res);
  };

  const loadAssessments = async () => {
    const data = await getAssessments();
    setAssessments(data);
  };

  useEffect(() => {
    loadAssessments();
    refreshResults();

    const handleUpdate = () => {
      loadAssessments();
      refreshResults();
    };

    window.addEventListener('nexus-data-updated', handleUpdate);
    return () => window.removeEventListener('nexus-data-updated', handleUpdate);
  }, []);

  const getTopicResult = (topicId) => {
    if (!allResults || !user) return null;
    return allResults.find(r => r.assessmentId === topicId && r.userId === user.id);
  };

  const topicsForCategory = (category) => {
    if (!assessments || !category) return [];
    const searchCat = category.toLowerCase().trim();
    return assessments.filter(a => {
      const aCat = (a.category || '').toLowerCase().trim();
      return aCat === searchCat;
    });
  };

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
      <div className="aurora-accent" style={{ top: '-10%', right: '-10%' }} />
      <div className="aurora-accent" style={{ bottom: '10%', left: '-10%', opacity: 0.1 }} />

      {/* In-app Assessment Modal */}
      {activeAssessment && (
        <AssessmentModal
          assessment={activeAssessment}
          previousResult={activeAssessment.previousResult}
          onClose={() => {
            setActiveAssessment(null);
            refreshResults(); // Refresh list UI when modal closes
          }}
        />
      )}

      {/* Category list */}
      {!selectedCategory && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
          {/* Flowing Neon Soundwave Mesh Background matching reference image */}
          <div 
            style={{
              position: 'absolute',
              right: '-20px',
              top: '-40px',
              width: '680px',
              height: '380px',
              pointerEvents: 'none',
              zIndex: 0,
              opacity: 0.95
            }}
          >
            <svg viewBox="0 0 700 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="waveGrad1" x1="0" y1="0" x2="700" y2="400" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                  <stop offset="40%" stopColor="#818cf8" stopOpacity="0.85" />
                  <stop offset="80%" stopColor="#c084fc" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="waveGrad2" x1="100" y1="0" x2="600" y2="350" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                  <stop offset="50%" stopColor="#a855f7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <path d="M0 250 C 150 150, 250 320, 420 180 C 550 70, 600 200, 700 120" stroke="url(#waveGrad1)" strokeWidth="1.5" fill="none" />
              <path d="M20 270 C 170 170, 270 340, 440 200 C 570 90, 620 220, 700 140" stroke="url(#waveGrad1)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
              <path d="M40 290 C 190 190, 290 360, 460 220 C 590 110, 640 240, 700 160" stroke="url(#waveGrad2)" strokeWidth="2" fill="none" />
              <path d="M60 310 C 210 210, 310 380, 480 240 C 610 130, 660 260, 700 180" stroke="url(#waveGrad2)" strokeWidth="1" fill="none" />
              <path d="M80 330 C 230 230, 330 400, 500 260 C 630 150, 680 280, 700 200" stroke="url(#waveGrad1)" strokeWidth="1.5" fill="none" />
              <path d="M100 350 C 250 250, 350 420, 520 280 C 650 170, 690 300, 700 220" stroke="url(#waveGrad2)" strokeWidth="1" fill="none" />
              <path d="M120 370 C 270 270, 370 440, 540 300 C 670 190, 700 320, 700 240" stroke="url(#waveGrad1)" strokeWidth="0.8" fill="none" />
              <circle cx="430" cy="160" r="2.5" fill="#a855f7" />
              <circle cx="510" cy="110" r="2" fill="#38bdf8" />
              <circle cx="580" cy="190" r="3" fill="#ec4899" />
              <circle cx="640" cy="140" r="2" fill="#c084fc" />
              <circle cx="370" cy="230" r="2" fill="#06b6d4" />
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', zIndex: 10 }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  backgroundColor: '#1e3a8a',
                  border: '1px solid rgba(99, 102, 241, 0.6)',
                  color: '#e0e7ff',
                  boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)'
                }}
              >
                <TrendingUp size={15} />
                <span>SKILL ASSESSMENT</span>
              </div>
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '1.05', color: 'var(--text-primary)' }}>
              Aptitude &{' '}
              <span style={{ background: 'linear-gradient(135deg, #00f2fe 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Reasoning
              </span>
            </h1>
            <p style={{ fontSize: '1.15rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Master the logic behind every challenge.
            </p>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '2rem',
              marginTop: '1.25rem',
              width: '100%',
              position: 'relative',
              zIndex: 10
            }}
          >
            {CATEGORY_META.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedCategory(cat.title)}
                className="cursor-pointer relative group overflow-hidden transition-all duration-300"
                style={{
                  borderRadius: '1.75rem',
                  backgroundColor: 'var(--bg-secondary)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: `2px solid ${cat.color}65`,
                  boxShadow: `0 10px 40px -10px ${cat.color}35`,
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '380px'
                }}
              >
                {/* Ambient Corner Glow & Dot Pattern */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ 
                    background: `linear-gradient(135deg, ${cat.color}18 0%, ${cat.color}05 100%)`,
                    borderRadius: 'inherit'
                  }}
                />
                <div className="absolute top-0 right-0 w-36 h-36 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" style={{ background: `${cat.color}15` }} />

                {/* Top Row: Icon Box & Tag Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
                  <div 
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: `${cat.color}20`,
                      border: `1px solid ${cat.color}50`,
                      color: cat.color,
                      boxShadow: `0 4px 15px ${cat.color}35`
                    }}
                  >
                    {React.createElement(cat.icon, { size: 28 })}
                  </div>
                  <span 
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-strong)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {cat.code}
                  </span>
                </div>

                {/* Middle Section: Title & Topic Count */}
                <div style={{ marginTop: '1.75rem', position: 'relative', zIndex: 10 }}>
                  <h3 
                    style={{
                      fontSize: '1.85rem',
                      fontWeight: 900,
                      lineHeight: '1.15',
                      letterSpacing: '-0.03em',
                      color: 'var(--text-primary)',
                      marginBottom: '0.5rem'
                    }}
                  >
                    {cat.title}
                  </h3>
                  <p 
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {topicsForCategory(cat.title).length} TOPICS
                  </p>
                  <div 
                    style={{
                      height: '1px',
                      width: '100%',
                      margin: '1.5rem 0',
                      backgroundColor: 'var(--border-strong)'
                    }}
                  />
                </div>

                {/* Bottom Explore Topics Button */}
                <button 
                  style={{ 
                    width: '100%',
                    padding: '14px 24px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    backgroundColor: 'var(--explore-btn-bg)',
                    color: cat.color,
                    border: `1.5px solid ${cat.color}`,
                    boxShadow: `0 0 15px ${cat.color}35`,
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 10
                  }}
                >
                  <span>EXPLORE TOPICS</span>
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Topic list */}
      {selectedCategory && (
        <div className="flex flex-col gap-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 font-bold w-fit hover:translate-x-[-4px] transition-transform"
            style={{ color: 'var(--accent-primary)' }}
          >
            <ChevronLeft size={20} /> Back to Categories
          </button>

          <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-black">{selectedCategory} Topics</h2>
            <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Select a module to sharpen your skills.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pt-4 pb-12">
            {topicsForCategory(selectedCategory).length === 0 && (
              <div className="nx-card p-10 text-center" style={{ borderRadius: '2rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>No assessments posted yet for this category. Check back soon!</p>
              </div>
            )}
            {topicsForCategory(selectedCategory).map((topic, i) => {
              const catColor = CATEGORY_META.find(c => c.title === selectedCategory)?.color || 'var(--accent-primary)';
              const ytLink = YOUTUBE_LINKS[topic.topic];
              const isLocked = topic.unlockTime && new Date(topic.unlockTime) > new Date();
              const result = getTopicResult(topic.id);

              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="nx-card p-8 md:p-10 flex flex-col gap-8 relative overflow-hidden group h-full"
                  style={{ 
                    borderRadius: '2rem',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    background: isLocked 
                      ? 'rgba(10, 14, 28, 0.6)' 
                      : `linear-gradient(135deg, var(--bg-secondary) 0%, ${catColor}05 100%)`,
                    backdropFilter: isLocked ? 'blur(10px)' : 'none',
                    opacity: 1,
                    pointerEvents: isLocked ? 'none' : 'auto',
                    border: isLocked ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid var(--border-subtle)'
                  }}
                >
                  {/* Individually Spread Shade */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ 
                      background: `linear-gradient(135deg, ${catColor}10 0%, ${catColor}05 100%)`,
                      borderRadius: 'inherit'
                    }}
                  />
                  {/* High-Fidelity Lock Indicator */}
                  {isLocked && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#f59e0b] opacity-[0.03] blur-3xl pointer-events-none" />
                  )}

                  {!isLocked ? (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: catColor }} />
                  ) : (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: '#f59e0b' }} />
                  )}

                  <div className="flex flex-col gap-4 relative z-10 h-full">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-ultra px-3 py-1 rounded-lg" style={{ backgroundColor: isLocked ? 'rgba(245,158,11,0.1)' : `${catColor}15`, color: isLocked ? '#f59e0b' : catColor }}>
                        {topic.week}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted">
                        {topic.unlockTime 
                          ? `Unlocks: ${new Date(topic.unlockTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                          : `Published: ${new Date(topic.created_at).toLocaleDateString()}`
                        }
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                          <HelpCircle size={12} style={{ opacity: 0.5 }} /> {topic.questions?.length || 0} Qns
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                          <Timer size={12} style={{ opacity: 0.5 }} /> {topic.timeLimit} min
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                       <h4 className="text-2xl font-black tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                        {topic.topic}
                      </h4>
                      
                      {isLocked ? (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b10] border border-[#f59e0b20] text-[#f59e0b] text-[9px] font-black uppercase tracking-ultra self-start">
                          <Target size={10} /> Protocol Lockdown
                        </div>
                      ) : (
                        <p className="text-xs font-medium text-muted line-clamp-3 leading-relaxed">
                          Focused practice module covering core concepts for {topic.topic.toLowerCase()}.
                        </p>
                      )}

                      {isLocked && (
                         <p className="text-[10px] font-bold text-muted mt-2">
                           INITIALIZING ON {new Date(topic.unlockTime).toLocaleDateString()} AT {new Date(topic.unlockTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </p>
                      )}
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {!isLocked && ytLink && (
                          <button
                            onClick={() => window.open(ytLink, '_blank', 'noopener,noreferrer')}
                            title="Watch on YouTube"
                            style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,0,0,0.1)', color: '#ff4444', border: '1px solid rgba(255,0,0,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                          >
                            <PlayCircle size={16} />
                          </button>
                        )}
                        
                        {isLocked ? (
                           <div className="px-8 py-3.5 rounded-2xl bg-[#f59e0b08] border border-[#f59e0b30] text-[#f59e0b] font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.05)]">
                             <Timer size={14} className="animate-pulse" />
                             Scheduled
                           </div>
                        ) : result ? (
                          <button
                            onClick={() => setActiveAssessment({ ...topic, previousResult: result })}
                            className="relative overflow-hidden px-6 py-2 font-black text-[9px] uppercase tracking-ultra outline-none duration-300 group active:opacity-75"
                            style={{ 
                              background: '#10b98115', 
                              color: '#10b981', 
                              border: '1px solid #10b98140',
                              borderBottom: '4px solid #10b981',
                              borderRadius: '9999px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.filter = 'brightness(1.5)';
                              e.currentTarget.style.borderTopWidth = '4px';
                              e.currentTarget.style.borderBottomWidth = '1px';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.filter = 'none';
                              e.currentTarget.style.borderTopWidth = '1px';
                              e.currentTarget.style.borderBottomWidth = '4px';
                            }}
                          >
                            <span 
                              className="absolute -top-[150%] left-0 inline-flex w-[400px] h-[5px] opacity-50 duration-500 group-hover:top-[150%]"
                              style={{ 
                                background: '#10b981', 
                                boxShadow: '0 0 10px 10px #10b98140',
                                borderRadius: '999px'
                              }}
                            />
                            Review <Award size={14} className="transition-transform" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveAssessment(topic)}
                            className="relative overflow-hidden px-14 py-4 font-black text-[9px] uppercase tracking-ultra outline-none duration-300 group active:opacity-75"
                            style={{ 
                              background: `${catColor}10`, 
                              color: catColor, 
                              border: `1px solid ${catColor}40`,
                              borderBottom: `4px solid ${catColor}`,
                              borderRadius: '9999px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.filter = 'brightness(1.5)';
                              e.currentTarget.style.borderTopWidth = '4px';
                              e.currentTarget.style.borderBottomWidth = '1px';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.filter = 'none';
                              e.currentTarget.style.borderTopWidth = '1px';
                              e.currentTarget.style.borderBottomWidth = '4px';
                            }}
                          >
                            <span 
                              className="absolute -top-[150%] left-0 inline-flex w-[400px] h-[5px] opacity-50 duration-500 group-hover:top-[150%]"
                              style={{ 
                                background: catColor, 
                                boxShadow: `0 0 10px 10px ${catColor}40`,
                                borderRadius: '999px'
                              }}
                            />
                            Start <Zap size={14} className="transition-transform" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Aptitude;
