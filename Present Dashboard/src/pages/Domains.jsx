import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, Code2, BrainCircuit, ShieldCheck, 
  Database, Smartphone, Cloud, Palette,
  ArrowRight, ArrowLeft, Zap, Target, Users, Server
} from 'lucide-react';
import { getDomains } from '../store/dataStore';

const ICON_MAP = {
  Layers, Code2, BrainCircuit, ShieldCheck, 
  Database, Smartphone, Cloud, Palette, Server
};

const Domains = () => {
  const [domains, setDomains] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    setDomains(getDomains());
    const handleUpdate = () => setDomains(getDomains());
    window.addEventListener('nexus-data-updated', handleUpdate);
    return () => window.removeEventListener('nexus-data-updated', handleUpdate);
  }, []);

  const currentDomain = expandedId ? domains.find(d => d.id === expandedId) : null;
  const displayList = currentDomain ? currentDomain.subDomains : domains;

  const handleExplore = (id, hasSub) => {
    if (hasSub) setExpandedId(id);
    else alert("Exploring this domain... Roadmap coming soon!");
  };

  return (
    <div className="flex flex-col gap-10 animate-slide-up pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-accent-primary/10 text-accent-primary">
            <Layers size={32} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              {expandedId ? currentDomain.title : 'Nexus '}
              <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {expandedId ? ' Specializations' : 'Domains'}
              </span>
            </h1>
            <p className="text-secondary font-medium md:text-lg">
              {expandedId ? `Deep dive into the core pillars of ${currentDomain.title}.` : 'Select your path to expert-level specialization.'}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {expandedId && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex"
            >
              <button 
                onClick={() => setExpandedId(null)}
                className="relative overflow-hidden px-6 py-4 font-black text-[10px] uppercase tracking-ultra outline-none duration-300 group active:opacity-75"
                style={{ 
                  background: 'rgba(193, 220, 241, 0.97)', 
                  color: 'var(--text-primary)', 
                  border: '1px solid rgba(75, 170, 237, 1)',
                  borderBottom: '1px solid var(--accent-primary)',
                  borderRadius: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer' 
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(193, 220, 241, 0.97)';
                  e.currentTarget.style.borderTopWidth = '4px';
                  e.currentTarget.style.borderBottomWidth = '1px';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(164, 225, 252, 0.97)';
                  e.currentTarget.style.borderTopWidth = '1px';
                  e.currentTarget.style.borderBottomWidth = '4px';
                }}
              >
                <span 
                  className="absolute -top-[150%] left-0 inline-flex w-[400px] h-[5px] opacity-30 duration-500 group-hover:top-[150%]"
                  style={{ 
                    background: 'var(--accent-primary)', 
                    boxShadow: '0 0 10px 10px var(--accent-primary)',
                    borderRadius: '100px'
                  }}
                />
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> 
                Back to Domains
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Domains Grid - Scenes are now handled as unified transitions to prevent layout glitches */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={expandedId || 'main-grid'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid cols-1 md-cols-2 lg-cols-3 gap-12 pt-8 pb-16"
        >
          {displayList.map((domain, i) => (
            <motion.div
              key={domain.id}
              whileHover={{ y: -10, scale: 1.02 }}
              className="nx-card p-8 md:p-10 flex flex-col gap-8 group cursor-pointer relative overflow-hidden h-full"
              style={{ 
                borderRadius: '2rem',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Individually Spread Shade */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ 
                  background: `linear-gradient(135deg, ${domain.color}10 0%, ${domain.color}05 100%)`,
                  backdropFilter: 'blur(20px)',
                  borderRadius: 'inherit'
                }}
              />
              <div 
                className="absolute top-0 left-0 w-full h-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ 
                  background: domain.color,
                  borderTopLeftRadius: 'inherit',
                  borderTopRightRadius: 'inherit'
                }}
              />

              {/* Trending Badge Overlay */}
              {domain.trending && (
                <div className="absolute top-0 right-0 p-4 z-20">
                  <span className="flex items-center gap-1 px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-tighter border border-indigo-500/20">
                    <Zap size={10} fill="currentColor" /> Trending
                  </span>
                </div>
              )}

              <div className="flex items-start relative z-10">
                <div 
                  className="p-6 rounded-3xl transition-all group-hover:scale-110 shadow-lg border border-white/5" 
                  style={{ 
                    backgroundColor: `${domain.color}15`, 
                    color: domain.color,
                  }}
                >
                  {(() => {
                    const Icon = ICON_MAP[domain.icon] || Code2;
                    return <Icon size={40} />;
                  })()}
                </div>
              </div>
              
              <div className="flex-1 relative z-10">
                <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-accent-primary transition-colors">{domain.title}</h3>
                <p className="text-secondary font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{domain.desc}</p>
              </div>

              <div className="pt-8 border-t border-white/5 flex items-center justify-between mt-auto relative z-10">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-muted" />
                  <span className="text-xs font-bold text-muted">{domain.stats || 'Core Learning'}</span>
                </div>
                <button 
                  onClick={() => handleExplore(domain.id, !!domain.subDomains)}
                  className="relative overflow-hidden px-4 py-2 font-black text-[9px] uppercase tracking-ultra outline-none duration-300 group active:opacity-75"
                  style={{ 
                    background: `${domain.color}10`, 
                    color: domain.color, 
                    border: `1px solid ${domain.color}40`,
                    borderBottom: `4px solid ${domain.color}`,
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer' 
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
                      background: domain.color, 
                      boxShadow: `0 0 10px 10px ${domain.color}40`,
                      borderRadius: '999px'
                    }}
                  />
                  Explore {expandedId ? 'Module' : 'Domain'} <ArrowRight size={14} className="transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Under the Hood Section */}
      <AnimatePresence>
        {expandedId && currentDomain?.topics && currentDomain.topics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-12 pt-20"
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-black tracking-tight">
                Under the Hood <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Topics</span>
              </h2>
              <p className="text-secondary font-medium">Foundational concepts that power the entire {currentDomain.title} ecosystem.</p>
            </div>

            <div className="grid cols-1 md-cols-2 lg-cols-3 gap-12">
              {currentDomain.topics.map((topic, i) => (
                <motion.div
                  key={topic}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="nx-card p-8 md:p-10 flex flex-col gap-8 group cursor-pointer relative overflow-hidden h-full"
                  style={{ 
                    borderRadius: '2rem',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ 
                      background: `linear-gradient(135deg, ${currentDomain.color}10 0%, ${currentDomain.color}05 100%)`,
                      backdropFilter: 'blur(20px)',
                      borderRadius: 'inherit'
                    }}
                  />
                  <div 
                    className="absolute top-0 left-0 w-full h-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ 
                      background: currentDomain.color,
                      borderTopLeftRadius: 'inherit',
                      borderTopRightRadius: 'inherit'
                    }}
                  />

                  <div className="flex items-start relative z-10">
                    <div 
                      className="p-6 rounded-3xl transition-all group-hover:scale-110 shadow-lg border border-white/5" 
                      style={{ 
                        backgroundColor: `${currentDomain.color}15`, 
                        color: currentDomain.color,
                      }}
                    >
                      <BrainCircuit size={40} />
                    </div>
                  </div>
                  
                  <div className="flex-1 relative z-10">
                    <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-accent-primary transition-colors">{topic}</h3>
                    <p className="text-secondary font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                      Master the internal mechanics and architectural patterns of {topic} to build truly professional {currentDomain.title} applications.
                    </p>
                  </div>

                  <div className="pt-8 border-t border-white/5 flex items-center justify-between mt-auto relative z-10">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-indigo-400" />
                      <span className="text-xs font-bold text-muted">Foundational Module</span>
                    </div>
                    <button 
                      onClick={() => alert(`Opening ${topic} deep-dive...`)}
                      className="relative overflow-hidden px-4 py-2 font-black text-[9px] uppercase tracking-ultra outline-none duration-300 group active:opacity-75"
                      style={{ 
                        background: `${currentDomain.color}10`, 
                        color: currentDomain.color, 
                        border: `1px solid ${currentDomain.color}40`,
                        borderBottom: `4px solid ${currentDomain.color}`,
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer' 
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
                          background: currentDomain.color, 
                          boxShadow: `0 0 10px 10px ${currentDomain.color}40`,
                          borderRadius: '999px'
                        }}
                      />
                      Dive Deep <ArrowRight size={14} className="transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Domains;
