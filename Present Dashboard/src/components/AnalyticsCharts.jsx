import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

/**
 * A premium AreaChart for individual performance tracking.
 */
export const UserPerformanceGraph = ({ data, height = 300, color = '#6366f1' }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        height, display: 'flex', flexDirection: 'column', alignItems: 'center', 
        justifyContent: 'center', color: 'var(--text-muted)', gap: '12px',
        background: 'rgba(255,255,255,0.02)', borderRadius: '1.5rem', border: '1px dashed var(--border-subtle)' 
      }}>
        <p style={{ fontSize: '13px', fontWeight: 600 }}>Insufficient assessment data.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height, minHeight: height, position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 35 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
            dy={20}
          />
          <YAxis 
            domain={[0, 100]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
            width={40}
          />
          <Tooltip 
            cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1 }}
            contentStyle={{ 
              background: 'rgba(25, 25, 35, 0.98)', 
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border-strong)', 
              borderRadius: '16px',
              padding: '12px 16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              zIndex: 1000
            }}
            itemStyle={{ color: '#ffffff', fontWeight: 800, fontSize: '14px' }}
            labelStyle={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}
            formatter={(value) => [`${value}%`, 'Score']}
          />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke={color} 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorScore)" 
            animationDuration={1500}
            dot={{ r: 6, fill: color, strokeWidth: 2, stroke: 'var(--bg-primary)' }}
            activeDot={{ r: 8, strokeWidth: 0, fill: '#ffffff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * A premium BarChart for platform-wide metrics.
 */
export const CollectivePerformanceGraph = ({ data, height = 350 }) => {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 30, right: 30, left: 0, bottom: 40 }}>
          <XAxis 
            dataKey="topic" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
            dy={15}
          />
          <YAxis 
            domain={[0, 100]}
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
            width={35}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            contentStyle={{ 
              background: 'rgba(25, 25, 35, 0.95)', 
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-strong)', 
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              zIndex: 1000
            }}
            itemStyle={{ color: '#ffffff', fontWeight: 800, fontSize: '14px' }}
            labelStyle={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}
            formatter={(value) => [`${value}%`, 'Average Score']}
          />
          <Bar dataKey="avg" radius={[8, 8, 0, 0]} barSize={40} animationDuration={1500}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#a855f7'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
