import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Flame, Target, Zap, TrendingUp, 
  ArrowUpRight, Award, Clock, Star, BrainCircuit 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getResults } from '../store/dataStore';
import { UserPerformanceGraph } from '../components/AnalyticsCharts';
import { prepareUserChartData, calculateUserStats } from '../utils/analytics';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="nx-card p-4 sm:p-6 flex items-center gap-3 sm:gap-5"
    style={{ borderRadius: '2rem' }}
  >
    <div className="flex items-center justify-center p-3 sm:p-4 rounded-2xl sm:rounded-3xl flex-shrink-0" style={{ backgroundColor: `${color}15`, color }}>
      <Icon size={clampNumber(18, 24)} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted mb-0.5 truncate">{label}</p>
      <p className="text-xl sm:text-2xl font-black tracking-tight">{value}</p>
    </div>
  </motion.div>
);

const clampNumber = (min, max) => `clamp(${min}px, 2vw + ${min}px, ${max}px)`;

const Dashboard = () => {
  const { user } = useAuth();
  const [results, setResults] = React.useState([]);
  
  const refreshData = React.useCallback(() => {
    const all = getResults();
    setResults(all.filter(r => r.userEmail === user?.email));
  }, [user]);

  React.useEffect(() => {
    refreshData();
    window.addEventListener('nexus-data-updated', refreshData);
    return () => window.removeEventListener('nexus-data-updated', refreshData);
  }, [refreshData]);

  const chartData = useMemo(() => prepareUserChartData(results), [results]);
  const stats = useMemo(() => calculateUserStats(results), [results]);

  const recentAssms = [...results]
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-8 animate-slide-up pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-ultra bg-accent-primary/10 text-accent-primary">
              {/* Operational Status: Optimal */}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
            Welcome back, <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.firstName || 'Operator'}</span>
          </h1>
          <p className="text-lg font-medium text-secondary mt-2">Here is your performance pulse for this week.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="nx-card px-6 py-4 flex items-center gap-4 border-accent-primary/20" style={{ borderRadius: '1.5rem' }}>
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
              <Flame size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Streak</p>
              <p className="text-xl font-black">{user?.streak || 0} Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid cols-1 sm-cols-2 lg-cols-4 gap-6">
        <StatCard icon={Star} label="Total XP" value={user?.xp || 0} color="#a855f7" delay={0.1} />
        <StatCard icon={TrendingUp} label="Avg Accuracy" value={`${stats.avg}%`} color="#22c55e" delay={0.2} />
        <StatCard icon={Target} label="Assessments" value={stats.count} color="#3b82f6" delay={0.3} />
        <StatCard icon={Award} label="Best Score" value={`${stats.best}%`} color="#f59e0b" delay={0.4} />
      </div>

      <div className="grid cols-1 lg-cols-12 gap-8">
        {/* Main Performance Graph */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="lg-col-span-8 nx-card p-6 sm:p-10 flex flex-col gap-6"
          style={{ borderRadius: '2rem' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black tracking-tight">Performance Pulse</h3>
              <p className="text-xs font-bold text-muted uppercase tracking-widest">Efficiency over time</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-subtle self-start sm:self-center">
              <Clock size={12} className="text-accent-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Updated Just Now</span>
            </div>
          </div>

          <div className="mt-4 overflow-hidden">
            <UserPerformanceGraph data={chartData} />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="lg-col-span-4 flex flex-col gap-6">
          <div className="nx-card p-8 h-full flex flex-col gap-6" style={{ borderRadius: '2rem' }}>
            <h3 className="text-xl font-black tracking-tight">Recent Sessions</h3>
            
            <div className="flex flex-col gap-4">
              {recentAssms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4 opacity-50">
                  <BrainCircuit size={48} strokeWidth={1} />
                  <p className="text-sm font-medium">No recent activity detected.</p>
                </div>
              ) : (
                recentAssms.map((res, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-white/[0.02] border border-subtle hover:bg-white/[0.04] transition-colors group">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-bold truncate max-w-[150px]">{res.topic}</p>
                      <p className="text-[10px] font-medium text-muted uppercase tracking-widest">
                        {new Date(res.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-black ${res.percentage >= 80 ? 'text-green-500' : res.percentage >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                        {res.percentage}%
                      </span>
                      <ArrowUpRight size={14} className="text-muted group-hover:text-accent-primary transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>

            {recentAssms.length > 0 && (
              <button 
                className="mt-auto w-full py-3 rounded-xl border border-dashed border-subtle text-xs font-black uppercase tracking-ultra text-muted hover:border-accent-primary hover:text-accent-primary transition-all"
              >
                View Analytics Vault
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
