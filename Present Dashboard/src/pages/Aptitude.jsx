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
        <div className="flex flex-col gap-10">
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

          <div className="grid cols-1 sm-cols-3 gap-12">
            {CATEGORY_META.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => setSelectedCategory(cat.title)}
                className="nx-card p-10 flex flex-col gap-8 cursor-pointer relative group overflow-hidden"
                style={{ borderRadius: '2.5rem' }}
              >
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
                <button className="flex items-center gap-3 font-black text-xs uppercase tracking-ultra transition-all group relative z-10" style={{ color: 'var(--accent-primary)' }}>
                  Explore Topics <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
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

          <div className="grid grid-cols-1 gap-6">
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="nx-card p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden group"
                  style={{ 
                    borderRadius: '2.5rem', 
                    background: isLocked 
                      ? 'rgba(10, 14, 28, 0.6)' 
                      : `linear-gradient(135deg, var(--bg-secondary) 0%, ${catColor}05 100%)`,
                    backdropFilter: isLocked ? 'blur(10px)' : 'none',
                    opacity: 1,
                    pointerEvents: isLocked ? 'none' : 'auto',
                    border: isLocked ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid var(--border-subtle)'
                  }}
                >
                  {/* High-Fidelity Lock Indicator */}
                  {isLocked && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#f59e0b] opacity-[0.03] blur-3xl pointer-events-none" />
                  )}

                  {!isLocked ? (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: catColor }} />
                  ) : (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: '#f59e0b' }} />
                  )}

                  <div className="flex flex-col gap-5 flex-1 relative z-10">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-ultra px-3 py-1 rounded-lg" style={{ backgroundColor: isLocked ? 'rgba(245,158,11,0.1)' : `${catColor}15`, color: isLocked ? '#f59e0b' : catColor }}>
                        {topic.week}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        <HelpCircle size={12} style={{ opacity: 0.5 }} /> {topic.questions?.length || 0} Qns
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        <Timer size={12} style={{ opacity: 0.5 }} /> {topic.timeLimit} min
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                       <h4 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        {topic.topic}
                        {isLocked && (
                          <span className="ml-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b10] border border-[#f59e0b20] text-[#f59e0b] text-[9px] font-black uppercase tracking-widest">
                            <Target size={10} /> Protocol Lockdown
                          </span>
                        )}
                      </h4>
                      <p className="text-xs font-medium max-w-md" style={{ color: 'var(--text-muted)' }}>
                        {isLocked 
                          ? `Protocol sequence scheduled to initialize on ${new Date(topic.unlockTime).toLocaleDateString()} at ${new Date(topic.unlockTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
                          : `Focused practice module covering core concepts for ${topic.topic.toLowerCase()}.`
                        }
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', alignSelf: 'flex-start', flexShrink: 0 }}>
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
                       <div className="px-8 py-3.5 rounded-2xl bg-[#f59e0b08] border border-[#f59e0b30] text-[#f59e0b] font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.05)]">
                         <Timer size={16} className="animate-pulse" />
                         Scheduled
                       </div>
                    ) : result ? (
                      <button
                        onClick={() => setActiveAssessment({ ...topic, previousResult: result })}
                        className="nx-btn-primary px-8 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 transition-all hover:scale-[1.03] active:scale-95"
                        style={{ 
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                          color: 'white', 
                          minWidth: '130px', 
                          justifyContent: 'center',
                          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
                          border: 'none'
                        }}
                      >
                        <span className="font-black uppercase tracking-widest text-xs">Review</span>
                        <Award size={16} fill="white" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveAssessment(topic)}
                        className="nx-btn-primary px-8 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 transition-all hover:scale-[1.03] active:scale-95"
                        style={{ 
                          background: 'var(--accent-gradient)', 
                          color: 'white',
                          minWidth: '130px', 
                          justifyContent: 'center',
                          boxShadow: '0 10px 25px -5px rgba(0, 242, 254, 0.4)',
                          border: 'none'
                        }}
                      >
                        <span className="font-black uppercase tracking-widest text-xs">Start</span>
                        <Zap size={16} fill="white" />
                      </button>
                    )}
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
