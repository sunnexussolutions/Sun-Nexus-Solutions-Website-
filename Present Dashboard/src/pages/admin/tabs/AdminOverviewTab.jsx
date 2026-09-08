import React from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, BrainCircuit, FileText, MessageSquare, Rocket, GraduationCap, BarChart3, TrendingUp } from 'lucide-react';
import { UserPerformanceGraph, CollectivePerformanceGraph } from '../../../components/AnalyticsCharts';

/**
 * ── AdminOverviewTab ────────────────────────────────────────────────
 * Summary analytics, key performance metrics, and activity charts.
 */
export default function AdminOverviewTab({
  stats,
  users = [],
  assessments = [],
  results = [],
  discussions = [],
  projects = [],
  alumni = [],
  inquiries = [],
  userChartData = [],
  collectiveChartData = [],
  onSelectMetric,
  activeMetric = null,
  isDark = true
}) {
  const statCards = [
    { id: 'users', label: 'Active Members', value: users.filter(u => u.status === 'active' || !u.status).length, icon: Users, color: '#2872A1' },
    { id: 'pending', label: 'Pending Approvals', value: users.filter(u => u.status === 'pending').length, icon: ShieldCheck, color: '#F59E0B' },
    { id: 'assessments', label: 'Assessments', value: assessments.length, icon: BrainCircuit, color: '#4A90C2' },
    { id: 'submissions', label: 'Test Submissions', value: results.length, icon: FileText, color: '#10B981' },
    { id: 'projects', label: 'Projects Built', value: projects.length, icon: Rocket, color: '#8B5CF6' },
    { id: 'discussions', label: 'Discussions', value: discussions.length, icon: MessageSquare, color: '#EC4899' },
    { id: 'alumni', label: 'Alumni Network', value: alumni.length, icon: GraduationCap, color: '#3B82F6' },
    { id: 'inquiries', label: 'Client Inquiries', value: inquiries.length, icon: TrendingUp, color: '#06B6D4' }
  ];

  const borderColor = isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9';
  const cardBg = isDark ? '#0E2740' : '#FFFFFF';
  const textColor = isDark ? '#F3F7FB' : '#0D1B2A';
  const mutedColor = isDark ? '#8EA6BC' : '#64748B';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stat Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px'
        }}
      >
        {statCards.map(st => {
          const Icon = st.icon;
          const isActive = activeMetric === st.id;
          return (
            <motion.div
              key={st.id}
              whileHover={{ translateY: -3, boxShadow: `0 10px 25px -5px ${st.color}30` }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMetric && onSelectMetric(isActive ? null : st.id)}
              style={{
                backgroundColor: cardBg,
                border: isActive ? `2px solid ${st.color}` : `1px solid ${borderColor}`,
                borderRadius: '16px',
                padding: '18px 20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: isDark ? '0 4px 14px rgba(0, 0, 0, 0.2)' : '0 2px 10px rgba(13, 27, 42, 0.04)'
              }}
            >
              <div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: mutedColor }}>
                  {st.label}
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '24px', fontWeight: 900, color: textColor }}>
                  {st.value}
                </h3>
              </div>

              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: `${st.color}15`,
                  color: st.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Icon size={20} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Charts Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px'
        }}
      >
        {/* Collective Performance Chart */}
        <div
          style={{
            padding: '22px',
            borderRadius: '18px',
            backgroundColor: cardBg,
            border: `1px solid ${borderColor}`,
            boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.2)' : '0 2px 10px rgba(13, 27, 42, 0.04)'
          }}
        >
          <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 800, color: textColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} style={{ color: '#2872A1' }} />
            Topic-Wise Collective Performance
          </h4>
          <CollectivePerformanceGraph data={collectiveChartData} height={280} />
        </div>

        {/* User Trend Chart */}
        <div
          style={{
            padding: '22px',
            borderRadius: '18px',
            backgroundColor: cardBg,
            border: `1px solid ${borderColor}`,
            boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.2)' : '0 2px 10px rgba(13, 27, 42, 0.04)'
          }}
        >
          <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 800, color: textColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: '#10B981' }} />
            Recent Assessment Score Trends
          </h4>
          <UserPerformanceGraph data={userChartData} height={280} color="#2872A1" />
        </div>
      </div>
    </div>
  );
}
