import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, Code2, BrainCircuit, ShieldCheck, 
  Database, Smartphone, Cloud, Palette,
  ArrowRight, Zap, Target, Users
} from 'lucide-react';

const DOMAINS = [
  {
    id: 'full-stack',
    title: 'Full Stack Development',
    icon: Code2,
    color: '#6366f1',
    desc: 'Master frontend & backend engineering. Build complete, scalable web ecosystems from scratch.',
    stats: '150+ Enrolled',
    trending: true
  },
  {
    id: 'ai-ml',
    title: 'Artificial Intelligence',
    icon: BrainCircuit,
    color: '#06b6d4',
    desc: 'Neural networks, machine learning models, and predictive analytics driving the future.',
    stats: '95+ Enrolled'
  },
  {
    id: 'cybersecurity',
    title: 'Cyber Security',
    icon: ShieldCheck,
    color: '#ef4444',
    desc: 'Deep-dive into ethical hacking, infrastructure protection, and digital forensic defense.',
    stats: '60+ Enrolled'
  },
  {
    id: 'data-science',
    title: 'Data Science',
    icon: Database,
    color: '#f59e0b',
    desc: 'Transform raw data into strategic intelligence using advanced statistical modeling.',
    stats: '85+ Enrolled'
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    icon: Palette,
    color: '#ec4899',
    desc: 'Design pixel-perfect, user-centric interfaces that blend aesthetics with functionality.',
    stats: '70+ Enrolled'
  },
  {
    id: 'cloud',
    title: 'Cloud Computing',
    icon: Cloud,
    color: '#3b82f6',
    desc: 'Architecting resilient, distributed systems on AWS, Azure, and Google Cloud Platform.',
    stats: '45+ Enrolled'
  }
];

const Domains = () => {
  return (
    <div className="flex flex-col gap-10 animate-slide-up pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-accent-primary/10 text-accent-primary">
            <Layers size={32} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              Nexus <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Domains</span>
            </h1>
            <p className="text-secondary font-medium md:text-lg">Select your path to expert-level specialization.</p>
          </div>
        </div>
      </div>



      {/* Domains Grid - Using gap-12 for proper spacing between cards */}
      <div className="grid cols-1 md-cols-2 lg-cols-3 gap-12 pt-20 pb-16">
        {DOMAINS.map((domain, i) => (
          <motion.div
            key={domain.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="nx-card p-8 md:p-10 flex flex-col gap-8 group cursor-pointer relative overflow-hidden h-full"
            style={{ 
              borderRadius: '2rem',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Individually Spread Shade - Covers the whole card on hover */}
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
                <domain.icon size={40} />
              </div>
            </div>
            
            <div className="flex-1 relative z-10">
              <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-accent-primary transition-colors">{domain.title}</h3>
              <p className="text-secondary font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{domain.desc}</p>
            </div>

            <div className="pt-8 border-t border-white/5 flex items-center justify-between mt-auto relative z-10">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-muted" />
                <span className="text-xs font-bold text-muted">{domain.stats}</span>
              </div>
              <button 
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
                Explore Domain <ArrowRight size={14} className="transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Domains;
