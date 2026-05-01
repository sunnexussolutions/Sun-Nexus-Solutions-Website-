import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  HelpCircle, ChevronLeft, Timer, Award, Trophy,
  Target, Zap, Brain, MessageSquare, ArrowRight,
  TrendingUp, X, PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssessments, getResults } from '../store/dataStore';
import AssessmentModal from '../components/AssessmentModal';
import { useAuth } from '../contexts/AuthContext';

const CATEGORY_META = [
  { title: 'Quantitative',      code: 'QA', icon: Target,        color: '#4f46e5' },
  { title: 'Logical Reasoning', code: 'LR', icon: Brain,         color: '#06b6d4' },
  { title: 'Verbal Ability',    code: 'VA', icon: MessageSquare, color: '#f59e0b' },
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
  
  const assessments = getAssessments();

  const refreshResults = () => {
    setAllResults(getResults());
  };

  useEffect(() => {
    refreshResults();
  }, []);

  const getTopicResult = (topicId) => 
    allResults.find(r => r.assessmentId === topicId && r.userEmail === user?.email);

  const topicsForCategory = (category) =>
    assessments.filter(a => a.category === category);

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
        <div className="flex flex-col gap-12">
          <div className="flex flex-col md-flex-row items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)' }}>
                  <TrendingUp size={20} />
                </div>
                <span className="font-bold uppercase tracking-[0.2em] text-xs" style={{ color: 'var(--text-muted)' }}>Skill Assessment</span>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight">
                Aptitude & <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reasoning</span>
              </h1>
              <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>Master the logic behind every challenge.</p>
            </div>
          </div>

          <div className="grid cols-1 md-cols-2 lg-cols-3 gap-12 mt-10">
            {CATEGORY_META.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => setSelectedCategory(cat.title)}
                className="nx-card p-10 flex flex-col gap-8 cursor-pointer relative group overflow-hidden"
                style={{ borderRadius: '2rem' }}
              >
                {/* Individually Spread Shade */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ 
                    background: `linear-gradient(135deg, ${cat.color}10 0%, ${cat.color}05 100%)`,
                    borderRadius: 'inherit'
                  }}
                />
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" style={{ background: `${cat.color}08` }} />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center justify-center p-5 rounded-3xl shadow-xl" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                    {React.createElement(cat.icon, { size: 32 })}
                  </div>
                  <span className="font-black text-xs tracking-ultra px-3 py-1 rounded-lg uppercase" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                    {cat.code}
                  </span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-2 tracking-tight">{cat.title}</h3>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-40">
                    {topicsForCategory(cat.title).length} Topics
                  </p>
                </div>
                <button 
                  className="relative overflow-hidden px-6 py-4 font-black text-[9px] uppercase tracking-ultra outline-none duration-300 group active:opacity-75 mt-auto self-start"
                  style={{ 
                    background: `${cat.color}10`, 
                    color: cat.color, 
                    border: `1px solid ${cat.color}40`,
                    borderBottom: `4px solid ${cat.color}`,
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    zIndex: 20
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
                      background: cat.color, 
                      boxShadow: `0 0 10px 10px ${cat.color}40`,
                      borderRadius: '999px'
                    }}
                  />
                  Explore Topics <ArrowRight size={14} className="transition-transform" />
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

          <div className="grid cols-1 md-cols-2 lg-cols-3 gap-12 pt-10 pb-16">
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
