import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LifeBuoy, Target, Users, ArrowRight, Video, FileText, 
  Code2, BrainCircuit, ShieldCheck, Database, Zap, Clock 
} from 'lucide-react';

const MENTOR_DOMAINS = [
  { 
    id: 'web-dev', 
    title: 'Web Architecture', 
    icon: Code2, 
    color: '#6366f1', 
    desc: 'Master full-stack engineering with modern frameworks.',
    stats: '150+ Participated'
  },
  { 
    id: 'ai-ml', 
    title: 'Intelligence Systems', 
    icon: BrainCircuit, 
    color: '#06b6d4', 
    desc: 'Deep dive into neural networks and predictive modeling.',
    stats: '80+ Participated'
  },
  { 
    id: 'cyber-security', 
    title: 'Digital Defense', 
    icon: ShieldCheck, 
    color: '#ef4444', 
    desc: 'Securing infrastructures and ethical exploration.',
    stats: '60+ Participated'
  },
  { 
    id: 'data-analytics', 
    title: 'Data Insights', 
    icon: Database, 
    color: '#f59e0b', 
    desc: 'Turning raw data into strategic operational intelligence.',
    stats: '95+ Participated'
  }
];

const Mentors = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);

  const clampNumber = (min, max) => `clamp(${min}px, 2vw + ${min}px, ${max}px)`;

  return (
    <div className="flex flex-col gap-10 animate-slide-up pb-20">
      {/* Hero Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-accent-primary/10 text-accent-primary">
            <LifeBuoy size={32} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              Nexus <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Council</span>
            </h1>
            <p className="text-secondary font-medium md:text-lg">Accelerate your journey with expert mentorship domains.</p>
          </div>
        </div>
      </div>

      {/* Interest Matcher (CTA Box) */}
      <motion.div 
        whileHover={{ y: -4 }}
        className="nx-card p-8 md:p-12 relative overflow-hidden group"
        style={{ borderRadius: '2.5rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(34,211,238,0.05) 100%)' }}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black mb-4 tracking-tight">Precision Potential Matcher</h2>
            <p className="text-secondary font-medium leading-relaxed mb-6">
              Not sure which sector to specialize in? Our neural analyzer matches your curiosity to the perfect mentorship domain in 30 seconds.
            </p>
            <button className="nx-btn-primary px-8 py-4 text-xs font-black uppercase tracking-ultra">
              🎯 Start Evaluation
            </button>
          </div>
          <div className="hidden lg-block p-6 rounded-full bg-accent-primary/10 border border-accent-primary/20 animate-pulse">
            <Target size={48} className="text-accent-primary" />
          </div>
        </div>
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 blur-[100px] rounded-full" />
      </motion.div>

      {/* Domains Grid */}
      <div className="grid cols-1 md-cols-2 gap-8">
        {MENTOR_DOMAINS.map((domain, i) => (
          <motion.div
            key={domain.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            className="nx-card p-8 flex flex-col gap-6 group cursor-pointer"
            onClick={() => setSelectedDomain(domain)}
          >
            <div className="flex items-start justify-between">
              <div className="p-4 rounded-2xl transition-all group-hover:scale-110" style={{ backgroundColor: `${domain.color}15`, color: domain.color }}>
                <domain.icon size={32} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-ultra text-muted mb-1">Status</span>
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase">Active</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">{domain.title}</h3>
              <p className="text-secondary font-medium line-clamp-2">{domain.desc}</p>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-muted" />
                <span className="text-xs font-bold text-muted">{domain.stats}</span>
              </div>
              <div className="flex items-center gap-2 text-accent-primary font-bold text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">
                Explore Curriculum <ArrowRight size={14} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Program Details Sidebar/Bottom Card */}
      <div className="nx-card p-6 md:p-10 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 w-full">
          <h3 className="text-xl font-black mb-6 tracking-tight">The Nexus Methodology</h3>
          <ul className="grid cols-1 sm-cols-2 gap-8">
            {[
              { icon: Zap, label: '9 Weeks Intensive', desc: 'Accelerated learning curve' },
              { icon: Video, label: 'Session Vault', desc: 'Access to all recordings' },
              { icon: FileText, label: 'Resource Library', desc: 'Notes and PDF blueprints' },
              { icon: Clock, label: 'Direct Access', desc: 'Weekly mentor Q&A' },
            ].map((feature, i) => (
              <li key={i} className="flex gap-4">
                <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary h-fit">
                  <feature.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">{feature.label}</p>
                  <p className="text-xs text-muted font-medium mt-0.5">{feature.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Mentors;
