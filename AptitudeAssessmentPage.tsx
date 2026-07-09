"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  TrendingUp,
  X,
  LayoutGrid,
  BookOpen,
  Layers,
  FolderGit2,
  Code2,
  Users,
  User,
  Shield,
  LogOut,
  Target,
  Brain,
  MessageSquare,
  ArrowRight,
  Menu,
} from "lucide-react";

/* ============================================================================
 * INTERFACES & TYPES
 * ============================================================================ */
interface AssessmentCategory {
  id: string;
  title: string;
  code: string;
  icon: React.ElementType;
  topicCount: number;
  themeColor: string;
  badgeBg: string;
  borderClass: string;
  hoverBorderClass: string;
  shadowClass: string;
  iconBgClass: string;
  buttonBgClass: string;
}

const CATEGORIES: AssessmentCategory[] = [
  {
    id: "quantitative",
    title: "Quantitative",
    code: "Q A",
    icon: Target,
    topicCount: 0,
    themeColor: "#a855f7",
    badgeBg: "bg-purple-950/70 border-purple-500/40 text-purple-400",
    borderClass: "border-purple-500/40",
    hoverBorderClass: "hover:border-purple-500/80",
    shadowClass: "shadow-[0_0_30px_rgba(147,51,234,0.15)]",
    iconBgClass: "bg-purple-950/60 border-purple-500/40 text-purple-400",
    buttonBgClass:
      "border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/60 text-purple-300",
  },
  {
    id: "logical",
    title: "Logical Reasoning",
    code: "L R",
    icon: Brain,
    topicCount: 0,
    themeColor: "#06b6d4",
    badgeBg: "bg-cyan-950/70 border-cyan-500/40 text-cyan-400",
    borderClass: "border-cyan-500/40",
    hoverBorderClass: "hover:border-cyan-500/80",
    shadowClass: "shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    iconBgClass: "bg-cyan-950/60 border-cyan-500/40 text-cyan-400",
    buttonBgClass:
      "border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300",
  },
  {
    id: "verbal",
    title: "Verbal Ability",
    code: "V A",
    icon: MessageSquare,
    topicCount: 0,
    themeColor: "#f59e0b",
    badgeBg: "bg-amber-950/70 border-amber-500/40 text-amber-400",
    borderClass: "border-amber-500/40",
    hoverBorderClass: "hover:border-amber-500/80",
    shadowClass: "shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    iconBgClass: "bg-amber-950/60 border-amber-500/40 text-amber-400",
    buttonBgClass:
      "border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300",
  },
];

/* ============================================================================
 * MAIN COMPONENT
 * ============================================================================ */
export default function AptitudeAssessmentPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalCategory, setActiveModalCategory] =
    useState<AssessmentCategory | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex antialiased overflow-x-hidden selection:bg-blue-500/30">
      {/* Background Cyber Glow Orbs */}
      <div className="fixed top-24 right-1/4 w-[500px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-10 left-1/3 w-[600px] h-[500px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* ================= LEFT SIDEBAR NAVIGATION ================= */}
      <aside
        className={`w-[260px] flex-shrink-0 bg-[#040914]/95 backdrop-blur-2xl border-r border-slate-800/60 flex flex-col justify-between z-40 fixed lg:relative inset-y-0 left-0 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 flex flex-col h-full">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3.5 px-2 py-1">
            <div className="w-11 h-11 rounded-xl bg-slate-900 border border-blue-500/40 flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <img
                src="https://res.cloudinary.com/dseg9nty3/image/upload/v1772331731/file_0000000032f07208a59ae376aacc1d36_fra0s4.png"
                alt="Sun Nexus Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-[19px] tracking-tight text-white">
                Sun Nexus
              </span>
              <span className="font-extrabold text-[15px] tracking-wide text-cyan-400">
                Solutions
              </span>
            </div>
          </div>

          <div className="h-px w-full bg-slate-800/80 my-4" />

          {/* Navigation Items */}
          <nav className="space-y-1.5 flex-1 overflow-y-auto pr-1">
            <a
              href="/dashboard"
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all font-medium text-sm"
            >
              <LayoutGrid className="w-5 h-5 text-slate-400" />
              <span>Dashboard</span>
            </a>

            <a
              href="/learning"
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all font-medium text-sm"
            >
              <BookOpen className="w-5 h-5 text-slate-400" />
              <span>My Learning</span>
            </a>

            <a
              href="/domains"
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all font-medium text-sm"
            >
              <Layers className="w-5 h-5 text-slate-400" />
              <span>Domains</span>
            </a>

            <a
              href="/projects"
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all font-medium text-sm"
            >
              <FolderGit2 className="w-5 h-5 text-slate-400" />
              <span>Projects</span>
            </a>

            <a
              href="/challenges"
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all font-medium text-sm"
            >
              <Code2 className="w-5 h-5 text-slate-400" />
              <span>Challenges</span>
            </a>

            {/* ACTIVE: Aptitude */}
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(79,70,229,0.35)] cursor-pointer">
              <div className="flex items-center gap-3.5">
                <Brain className="w-5 h-5 text-white" />
                <span>Aptitude</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/80" />
            </div>

            <a
              href="/council"
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all font-medium text-sm"
            >
              <Users className="w-5 h-5 text-slate-400" />
              <span>Council</span>
            </a>

            <a
              href="/profile"
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all font-medium text-sm"
            >
              <User className="w-5 h-5 text-slate-400" />
              <span>Profile</span>
            </a>
          </nav>

          {/* Sidebar Footer Section */}
          <div className="pt-4 space-y-4">
            <a
              href="/admin"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 text-amber-500 hover:text-amber-400 font-semibold text-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-amber-500" />
                <span>Admin Panel</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold text-amber-400 tracking-wider">
                ADMIN
              </span>
            </a>

            <div className="h-px w-full bg-slate-800/80" />

            {/* User Profile Footer Card */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-600 font-bold text-white flex items-center justify-center text-sm shadow-[0_0_12px_rgba(79,70,229,0.4)]">
                  N
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white leading-tight">
                    Nexus Admin
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    NEXUS ADMIN
                  </span>
                </div>
              </div>
              <button
                title="Logout"
                className="p-2 rounded-lg border border-slate-700/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= RIGHT WRAPPER (HEADER + CONTENT) ================= */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10 overflow-hidden">
        {/* HEADER BAR */}
        <header className="h-[72px] px-6 md:px-10 flex items-center justify-between border-b border-slate-800/60 bg-[#030712]/80 backdrop-blur-xl relative z-20">
          {/* Mobile Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2.5 rounded-xl border border-slate-700/60 bg-slate-900/80 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Input Box */}
          <div className="relative w-full max-w-[360px] hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for courses, projects..."
              className="w-full bg-[#070e1e]/80 border border-slate-700/70 rounded-full pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Theme Switcher Pill */}
            <div className="flex items-center p-1 rounded-full bg-slate-800/80 border border-slate-700/70">
              <button
                onClick={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
                aria-label="Toggle Theme"
                className="p-1.5 rounded-full bg-amber-500 text-white shadow-md transition-all"
              >
                {mounted && theme === "light" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Notification Bell */}
            <button className="w-9 h-9 rounded-full border border-slate-700/60 bg-slate-900/60 flex items-center justify-center text-slate-300 hover:text-white transition-colors relative">
              <Bell className="w-4 h-4" />
            </button>

            {/* Profile Dropdown Trigger */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800/80">
              <div className="text-right hidden md:block">
                <div className="text-sm font-semibold text-white leading-tight">
                  Nexus Admin
                </div>
                <div className="text-[10px] font-bold text-blue-400 tracking-wider">
                  PLATFORM ADMIN
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-[0_0_12px_rgba(37,99,235,0.4)]">
                N
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 px-6 md:px-12 lg:px-16 py-10 max-w-7xl w-full mx-auto relative z-10 flex flex-col justify-center">
          {/* Decorative Flowing Neon Mesh Waves Background matching reference image */}
          <div className="absolute right-0 top-2 w-[650px] h-[360px] pointer-events-none opacity-90 hidden lg:block z-0">
            <svg viewBox="0 0 700 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
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
              <path d="M0 250 C 150 150, 250 320, 420 180 C 550 70, 600 200, 700 120" stroke="url(#waveGrad1)" strokeWidth={1.5} fill="none" />
              <path d="M20 270 C 170 170, 270 340, 440 200 C 570 90, 620 220, 700 140" stroke="url(#waveGrad1)" strokeWidth={1} strokeDasharray="4 4" fill="none" />
              <path d="M40 290 C 190 190, 290 360, 460 220 C 590 110, 640 240, 700 160" stroke="url(#waveGrad2)" strokeWidth={2} fill="none" />
              <path d="M60 310 C 210 210, 310 380, 480 240 C 610 130, 660 260, 700 180" stroke="url(#waveGrad2)" strokeWidth={1} fill="none" />
              <path d="M80 330 C 230 230, 330 400, 500 260 C 630 150, 680 280, 700 200" stroke="url(#waveGrad1)" strokeWidth={1.5} fill="none" />
              <path d="M100 350 C 250 250, 350 420, 520 280 C 650 170, 690 300, 700 220" stroke="url(#waveGrad2)" strokeWidth={1} fill="none" />
              <circle cx={430} cy={160} r={2.5} fill="#a855f7" />
              <circle cx={510} cy={110} r={2} fill="#38bdf8" />
              <circle cx={580} cy={190} r={3} fill="#ec4899" />
              <circle cx={640} cy={140} r={2} fill="#c084fc" />
              <circle cx={370} cy={230} r={2} fill="#06b6d4" />
            </svg>
          </div>

          {/* Skill Assessment Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>SKILL ASSESSMENT</span>
            </div>
          </motion.div>

          {/* Headline & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10 space-y-3 relative z-10"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08]">
              <span className="text-white">Aptitude & </span>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Reasoning
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-normal">
              Master the logic behind every challenge.
            </p>
          </motion.div>

          {/* ================= 3 ASSESSMENT CATEGORY CARDS GRID ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {CATEGORIES.map((category, idx) => {
              const IconComp = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className={`border ${category.borderClass} ${category.hoverBorderClass} ${category.shadowClass} rounded-2xl bg-slate-900/65 backdrop-blur-xl p-7 flex flex-col justify-between min-h-[360px] group transition-all duration-300`}
                >
                  {/* Top Row: Icon Box & Tag Badge */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl ${category.iconBgClass} border flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}
                    >
                      <IconComp className="w-7 h-7" />
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-xs font-bold text-slate-200 tracking-wider">
                      {category.code}
                    </span>
                  </div>

                  {/* Middle Section: Title & Topic Count */}
                  <div className="mt-6">
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                      {category.title}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      {category.topicCount} TOPICS
                    </p>
                    <div className="h-px w-full bg-slate-800/80 my-6" />
                  </div>

                  {/* Bottom Explore Topics Button */}
                  <button
                    onClick={() => setActiveModalCategory(category)}
                    className={`w-full py-3.5 px-6 rounded-full border ${category.buttonBgClass} hover:text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all`}
                  >
                    <span>EXPLORE TOPICS</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>

      {/* FLOATING CHAT BUTTON (Bottom Right) */}
      <button
        aria-label="Support Chat"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_25px_rgba(37,99,235,0.55)] flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* EXPLORE TOPICS MODAL */}
      <AnimatePresence>
        {activeModalCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setActiveModalCategory(null)}
                className="absolute top-5 right-5 p-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-400 text-xs font-bold">
                  {activeModalCategory.code}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  SKILL MODULES
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-6">
                {activeModalCategory.title} Topics
              </h3>

              <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <p className="text-slate-400 font-medium">
                  Curated skill modules will be available soon for this section.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
