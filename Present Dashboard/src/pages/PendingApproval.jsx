import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Clock, LogOut, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PendingApproval = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0b0c10] overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-[#16181f] border border-[#232733] rounded-[2.5rem] p-10 flex flex-col items-center text-center shadow-2xl">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-amber-500/20 blur-[30px] rounded-full" />
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center relative">
              <ShieldAlert size={40} className="text-amber-500" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-white mb-4 tracking-tight">Access Pending</h1>
          <p className="text-white/50 text-[15px] leading-relaxed mb-8">
            Welcome, <span className="text-white font-bold">{user?.firstName || 'Nexus Member'}</span>! Your account has been created successfully but requires manual approval from our administration team before you can access the dashboard.
          </p>

          <div className="w-full space-y-4 mb-8">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Clock size={20} />
              </div>
              <div className="text-left">
                <p className="text-[13px] font-bold text-white/90">Verification Status</p>
                <p className="text-[11px] text-white/40 uppercase font-bold tracking-widest mt-0.5">In Progress</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <MessageCircle size={20} />
              </div>
              <div className="text-left">
                <p className="text-[13px] font-bold text-white/90">Help Desk</p>
                <p className="text-[11px] text-white/40 font-bold mt-0.5">support@nexuscareers.com</p>
              </div>
            </div>
          </div>

          <div className="w-full flex gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-[13px] hover:bg-white/10 transition-colors"
            >
              Check Status
            </button>
            <button 
              onClick={logout}
              className="flex-1 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-white/20 text-[11px] font-bold uppercase tracking-[0.2em]">
          Powered by Nexus Careers Security Protocol
        </p>
      </motion.div>
    </div>
  );
};

export default PendingApproval;
