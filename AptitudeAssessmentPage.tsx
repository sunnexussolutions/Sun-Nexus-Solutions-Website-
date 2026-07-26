"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

const icons: any = LucideIcons;

const Search: any = icons.Search;
const Bell: any = icons.Bell;
const Sun: any = icons.Sun;
const Moon: any = icons.Moon;
const ChevronDown: any = icons.ChevronDown;
const LayoutGrid: any = icons.LayoutGrid;
const Home: any = icons.Home;
const CheckSquare: any = icons.CheckSquare;
const Layers: any = icons.Layers;
const FolderGit2: any = icons.FolderGit2;
const Users: any = icons.Users;
const MessageSquare: any = icons.MessageSquare;
const Briefcase: any = icons.Briefcase;
const Clock: any = icons.Clock;
const HelpCircle: any = icons.HelpCircle;
const Lock: any = icons.Lock;
const ArrowLeft: any = icons.ArrowLeft;
const LogOut: any = icons.LogOut;
const Zap: any = icons.Zap;
const Menu: any = icons.Menu;
const X: any = icons.X;

/* ============================================================================
 * 3D ISOMETRIC PUZZLE ILLUSTRATIONS (Matching Reference Image 100%)
 * ============================================================================ */

/** 3D Puzzle Illustration for Purple Card */
const Purple3DPuzzleSvg = () => (
  <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0 pointer-events-none">
    <svg viewBox="0 0 200 180" className="w-full h-full drop-shadow-md overflow-visible">
      <defs>
        <linearGradient id="purpleTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5f3ff" />
          <stop offset="100%" stopColor="#e9d5ff" />
        </linearGradient>
        <linearGradient id="purpleSideGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d8b4fe" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <linearGradient id="purpleFrontGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e9d5ff" />
          <stop offset="100%" stopColor="#d8b4fe" />
        </linearGradient>
        <filter id="shadowPurp" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#7c3aed" floodOpacity="0.12" />
        </filter>
      </defs>
      
      <g filter="url(#shadowPurp)" transform="translate(10, 10)">
        <path d="M 110 110 L 160 85 L 175 110 L 125 135 Z" fill="url(#purpleTopGrad)" stroke="#d8b4fe" strokeWidth="1" />
        <path d="M 125 135 L 175 110 L 175 125 L 125 150 Z" fill="url(#purpleSideGrad)" />
        <path d="M 110 110 L 125 135 L 125 150 L 110 125 Z" fill="url(#purpleFrontGrad)" />

        <path d="M 75 70 L 125 45 L 140 70 L 90 95 Z" fill="url(#purpleTopGrad)" stroke="#f5f3ff" strokeWidth="1" />
        <path d="M 90 95 L 140 70 L 140 85 L 90 110 Z" fill="url(#purpleSideGrad)" />
        <path d="M 75 70 L 90 95 L 90 110 L 75 85 Z" fill="url(#purpleFrontGrad)" />
        <ellipse cx="108" cy="58" rx="10" ry="6" fill="url(#purpleTopGrad)" stroke="#d8b4fe" strokeWidth="1" />

        <path d="M 40 110 L 90 85 L 105 110 L 55 135 Z" fill="url(#purpleTopGrad)" stroke="#e9d5ff" strokeWidth="1" />
        <path d="M 55 135 L 105 110 L 105 125 L 55 150 Z" fill="url(#purpleSideGrad)" />
        <path d="M 40 110 L 55 135 L 55 150 L 40 125 Z" fill="url(#purpleFrontGrad)" />
        <ellipse cx="72" cy="98" rx="10" ry="6" fill="url(#purpleTopGrad)" stroke="#d8b4fe" strokeWidth="1" />
      </g>
    </svg>
  </div>
);

/** 3D Puzzle Illustration for Green Card */
const Green3DPuzzleSvg = () => (
  <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0 pointer-events-none">
    <svg viewBox="0 0 200 180" className="w-full h-full drop-shadow-md overflow-visible">
      <defs>
        <linearGradient id="greenTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0fdf4" />
          <stop offset="100%" stopColor="#d1fae5" />
        </linearGradient>
        <linearGradient id="greenSideGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>
        <linearGradient id="greenFrontGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d1fae5" />
          <stop offset="100%" stopColor="#a7f3d0" />
        </linearGradient>
        <filter id="shadowGreen" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#10b981" floodOpacity="0.12" />
        </filter>
      </defs>
      
      <g filter="url(#shadowGreen)" transform="translate(10, 10)">
        <path d="M 110 110 L 160 85 L 175 110 L 125 135 Z" fill="url(#greenTopGrad)" stroke="#a7f3d0" strokeWidth="1" />
        <path d="M 125 135 L 175 110 L 175 125 L 125 150 Z" fill="url(#greenSideGrad)" />
        <path d="M 110 110 L 125 135 L 125 150 L 110 125 Z" fill="url(#greenFrontGrad)" />

        <path d="M 75 70 L 125 45 L 140 70 L 90 95 Z" fill="url(#greenTopGrad)" stroke="#f0fdf4" strokeWidth="1" />
        <path d="M 90 95 L 140 70 L 140 85 L 90 110 Z" fill="url(#greenSideGrad)" />
        <path d="M 75 70 L 90 95 L 90 110 L 75 85 Z" fill="url(#greenFrontGrad)" />
        <ellipse cx="108" cy="58" rx="10" ry="6" fill="url(#greenTopGrad)" stroke="#a7f3d0" strokeWidth="1" />

        <path d="M 40 110 L 90 85 L 105 110 L 55 135 Z" fill="url(#greenTopGrad)" stroke="#d1fae5" strokeWidth="1" />
        <path d="M 55 135 L 105 110 L 105 125 L 55 150 Z" fill="url(#greenSideGrad)" />
        <path d="M 40 110 L 55 135 L 55 150 L 40 125 Z" fill="url(#greenFrontGrad)" />
        <ellipse cx="72" cy="98" rx="10" ry="6" fill="url(#greenTopGrad)" stroke="#a7f3d0" strokeWidth="1" />
      </g>
    </svg>
  </div>
);

/** Golden 3D Trophy Graphic matching Reference Image */
const GoldenTrophyGraphic = () => (
  <div className="relative w-36 h-28 mx-auto mb-2 flex items-center justify-center pointer-events-none">
    <svg viewBox="0 0 160 120" className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="goldCupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="goldStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fef3c7" />
        </linearGradient>
      </defs>

      {/* Floating Particles */}
      <circle cx="25" cy="40" r="2.5" fill="#38bdf8" />
      <rect x="50" y="20" width="4" height="4" rx="1" fill="#f59e0b" transform="rotate(25 50 20)" />
      <circle cx="55" cy="55" r="3" fill="#a855f7" />
      <circle cx="100" cy="22" r="3" fill="#fb923c" />
      <circle cx="140" cy="40" r="2.5" fill="#a855f7" />
      <rect x="135" y="70" width="4" height="4" rx="1" fill="#818cf8" transform="rotate(45 135 70)" />
      <circle cx="125" cy="90" r="2" fill="#38bdf8" opacity="0.8" />
      <circle cx="35" cy="85" r="3" fill="#c084fc" opacity="0.8" />

      {/* Base */}
      <rect x="52" y="98" width="56" height="12" rx="4" fill="url(#goldStemGrad)" />
      <path d="M 68 82 L 92 82 L 88 98 L 72 98 Z" fill="url(#goldStemGrad)" />

      {/* Cup Handles */}
      <path d="M 45 42 C 30 42, 30 70, 52 72 L 52 64 C 40 64, 40 48, 48 48 Z" fill="#d97706" />
      <path d="M 115 42 C 130 42, 130 70, 108 72 L 108 64 C 120 64, 120 48, 112 48 Z" fill="#d97706" />

      {/* Main Cup */}
      <path d="M 46 36 L 114 36 Q 112 78 80 80 Q 48 78 46 36 Z" fill="url(#goldCupGrad)" />
      <ellipse cx="80" cy="36" rx="34" ry="6" fill="#fef3c7" opacity="0.6" />

      {/* White Star on Cup */}
      <polygon
        points="80,48 83,56 92,56 85,61 87,70 80,64 73,70 75,61 68,56 77,56"
        fill="url(#starGrad)"
      />
    </svg>
  </div>
);

/* ============================================================================
 * MAIN APTITUDE ASSESSMENT PAGE COMPONENT
 * ============================================================================ */
export default function AptitudeAssessmentPage(): any {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("aptitude");
  const [showResultsModal, setShowResultsModal] = useState<boolean>(true);
  const [modalTab, setModalTab] = useState<"summary" | "review">("summary");

  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${themeMode === "dark" ? "bg-slate-950 text-slate-100" : "bg-[#f8fafc] text-slate-800"}`}>
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 transition-transform duration-300 flex flex-col border-r ${
          themeMode === "dark" ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-200/80 text-slate-700"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-0 flex items-center justify-center overflow-hidden">
              <img
                src="https://res.cloudinary.com/dseg9nty3/image/upload/v1784890597/7975077779d60f44fd5ccc4a43a38b32c8a7693eb2b3aeb58b2e475a8cf2279b_d1te0e.png"
                alt="Sun Nexus Logo"
                className="w-full h-full object-contain scale-[2.15]"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">Sun Nexus</span>
              <span className="font-extrabold text-sm tracking-wide text-amber-500">Solutions</span>
            </div>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setSidebarOpen(false)}>
            {X ? <X className="w-5 h-5" /> : null}
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { id: "overview", label: "Overview", icon: LayoutGrid },
            { id: "homepage", label: "Home Page", icon: Home },
            { id: "aptitude", label: "Assessments", icon: CheckSquare },
            { id: "domains", label: "Domains", icon: Layers },
            { id: "projects", label: "Projects", icon: FolderGit2 },
            { id: "users", label: "Users", icon: Users },
            { id: "discussions", label: "Discussions", icon: MessageSquare },
            { id: "notifications", label: "Notifications", icon: Bell, badge: 12 },
            { id: "hiring", label: "Hiring", icon: Briefcase },
          ].map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-slate-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {IconComponent ? (
                    <IconComponent
                      className={`w-4 h-4 ${
                        isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"
                      }`}
                    />
                  ) : null}
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 space-y-3">
          {/* Admin User Badge */}
          <div className="p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                N
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Nexus Admin</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  PLATFORM ADMIN
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') window.location.href = '/login';
              }}
              title="Log Out"
              className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors flex-shrink-0"
            >
              {LogOut ? <LogOut className="w-4 h-4" /> : null}
            </button>
          </div>

          {/* Theme Switcher Widget */}
          <div className="p-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex items-center gap-1">
            <button
              onClick={() => setThemeMode("light")}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                themeMode === "light"
                  ? "bg-white text-purple-600 shadow-xs border border-slate-200/60"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
            >
              {Sun ? <Sun className="w-3.5 h-3.5 text-purple-600" /> : null}
              <span>Light</span>
            </button>
            <button
              onClick={() => setThemeMode("dark")}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                themeMode === "dark"
                  ? "bg-slate-800 text-purple-400 shadow-xs border border-slate-700"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
            >
              {Moon ? <Moon className="w-3.5 h-3.5" /> : null}
              <span>Dark</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <header
          className={`h-16 px-4 lg:px-8 flex items-center justify-between border-b sticky top-0 z-40 backdrop-blur-md ${
            themeMode === "dark" ? "bg-slate-950/80 border-slate-800/80" : "bg-white/80 border-slate-200/80"
          }`}
        >
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-500" onClick={() => setSidebarOpen(true)}>
              {Menu ? <Menu className="w-6 h-6" /> : null}
            </button>

            {/* Global Search Bar */}
            <div className="relative w-64 md:w-96">
              {Search ? <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /> : null}
              <input
                type="text"
                placeholder="Search for courses, projects..."
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-medium border outline-none transition-all ${
                  themeMode === "dark"
                    ? "bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-purple-500"
                    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-purple-500"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button
              className={`p-2 rounded-xl border relative transition-colors ${
                themeMode === "dark"
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              {Bell ? <Bell className="w-4 h-4" /> : null}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white dark:ring-slate-950" />
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                N
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Nexus Admin</span>
                <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  PLATFORM ADMIN
                </span>
              </div>
              {ChevronDown ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : null}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER — MATCHING REFERENCE IMAGE 100% */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto space-y-6">
          {/* Breadcrumb Back Link */}
          <div>
            <button className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline">
              {ArrowLeft ? <ArrowLeft className="w-4 h-4" /> : null}
              <span>Back to Categories</span>
            </button>
          </div>

          {/* Header Section */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Logical Reasoning Topics
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Select a module to sharpen your skills.
            </p>
          </div>

          {/* TWO MAIN TOPIC CARDS GRID (Side-by-Side) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 pt-4">
            {/* CARD 1: PURPLE MODULE CARD */}
            <div
              className={`rounded-[28px] border p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                themeMode === "dark"
                  ? "bg-slate-900/90 border-purple-900/50 shadow-purple-950/20"
                  : "bg-[#f0ebff] border-[#d8cefe] shadow-[0_8px_30px_rgba(124,58,237,0.05)]"
              }`}
            >
              {/* Top Badges Row */}
              <div className="flex items-center justify-between gap-2 mb-6">
                <span className="px-3.5 py-1.5 rounded-full bg-[#e4dcff] text-[#6d28d9] font-bold text-xs tracking-wide">
                  WEEK 1
                </span>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ddd3fe] text-[#6d28d9] font-bold text-xs">
                  {Lock ? <Lock className="w-3.5 h-3.5" /> : null}
                  <span>UNLOCKS: 23 JUL, 11:23 AM</span>
                </div>
              </div>

              {/* Main Content & 3D Puzzle Illustration Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-2">
                {/* Left Side Info */}
                <div className="flex-1 space-y-4 text-left">
                  {/* Stat Indicators */}
                  <div className="flex items-center gap-4 text-xs font-bold text-[#6d28d9]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-[#6d28d9]">
                        {HelpCircle ? <HelpCircle className="w-3.5 h-3.5" /> : null}
                      </div>
                      <span className="text-slate-800 dark:text-slate-200">20 QNS</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-[#6d28d9]">
                        {Clock ? <Clock className="w-3.5 h-3.5" /> : null}
                      </div>
                      <span className="text-slate-800 dark:text-slate-200">20 MIN</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Puzzles(Mixed Logic)
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-[280px]">
                      Focused practice module covering core concepts for puzzles(mixed logic).
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => setShowResultsModal(true)}
                      className="px-6 py-2.5 rounded-xl border-2 border-[#a78bfa] bg-white/60 hover:bg-white text-[#6d28d9] font-extrabold text-xs tracking-wider uppercase inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      <span>REVIEW</span>
                      {Lock ? <Lock className="w-3.5 h-3.5" /> : null}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: MINT/GREEN MODULE CARD */}
            <div
              className={`rounded-[28px] border p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                themeMode === "dark"
                  ? "bg-slate-900/90 border-emerald-900/50 shadow-emerald-950/20"
                  : "bg-[#e6f4f1] border-[#b2e5d9] shadow-[0_8px_30px_rgba(16,185,129,0.05)]"
              }`}
            >
              {/* Top Badges Row */}
              <div className="flex items-center justify-between gap-2 mb-6">
                <span className="px-3.5 py-1.5 rounded-full bg-[#d1f2e9] text-[#047857] font-bold text-xs tracking-wide">
                  WEEK 1
                </span>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#c2eee1] text-[#047857] font-bold text-xs">
                  {Lock ? <Lock className="w-3.5 h-3.5" /> : null}
                  <span>UNLOCKS: 23 JUL, 11:30 AM</span>
                </div>
              </div>

              {/* Main Content Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-2">
                {/* Left Side Info */}
                <div className="flex-1 space-y-4 text-left">
                  {/* Stat Indicators */}
                  <div className="flex items-center gap-4 text-xs font-bold text-[#059669]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-[#059669]">
                        {HelpCircle ? <HelpCircle className="w-3.5 h-3.5" /> : null}
                      </div>
                      <span className="text-slate-800 dark:text-slate-200">20 QNS</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-[#059669]">
                        {Clock ? <Clock className="w-3.5 h-3.5" /> : null}
                      </div>
                      <span className="text-slate-800 dark:text-slate-200">20 MIN</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Puzzles(Mixed Logic)
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-[280px]">
                      Focused practice module covering core concepts for puzzles(mixed logic).
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => setShowResultsModal(true)}
                      className="px-6 py-2.5 rounded-xl border-2 border-[#34d399] bg-white/60 hover:bg-white text-[#059669] font-extrabold text-xs tracking-wider uppercase inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      <span>START</span>
                      {Zap ? <Zap className="w-3.5 h-3.5" /> : null}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ============================================================================
       * ASSESSMENT RESULTS MODAL OVERLAY (100% PIXEL PERFECT TO REFERENCE IMAGE)
       * ============================================================================ */}
      {showResultsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            className="w-full max-w-[440px] bg-white rounded-[24px] p-5 sm:p-6 shadow-2xl text-slate-900 overflow-hidden relative"
          >
            {/* Top Navigation Tabs Bar */}
            <div className="flex items-center gap-5 border-b border-slate-100 pb-2.5 mb-4">
              <button
                onClick={() => setModalTab("summary")}
                className={`flex items-center gap-1.5 text-sm font-extrabold pb-2 relative transition-colors ${
                  modalTab === "summary" ? "text-[#5b46e0]" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <span>📊 Summary</span>
                {modalTab === "summary" && (
                  <motion.div
                    layoutId="modalTabUnderline"
                    className="absolute bottom-[-11px] left-0 right-0 h-[3px] bg-[#5b46e0] rounded-t-full"
                  />
                )}
              </button>

              <button
                onClick={() => setModalTab("review")}
                className={`flex items-center gap-1.5 text-sm font-extrabold pb-2 relative transition-colors ${
                  modalTab === "review" ? "text-[#5b46e0]" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <span>📖 Review Mistakes</span>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-black text-[10px]">
                  14
                </span>
                {modalTab === "review" && (
                  <motion.div
                    layoutId="modalTabUnderline"
                    className="absolute bottom-[-11px] left-0 right-0 h-[3px] bg-[#5b46e0] rounded-t-full"
                  />
                )}
              </button>
            </div>

            {/* TAB CONTENT */}
            {modalTab === "summary" ? (
              <div className="flex flex-col items-center text-center space-y-3.5">
                {/* Hero Golden Trophy Graphic */}
                <GoldenTrophyGraphic />

                {/* Heading & Subtitle */}
                <div className="space-y-0.5">
                  <h2 className="text-2xl font-black text-[#2e1065] tracking-tight">
                    Keep Practicing!
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">
                    Puzzles (Mixed Logic) • Logical Reasoning
                  </p>
                </div>

                {/* Circular Donut Progress Ring */}
                <div className="relative w-28 h-28 flex items-center justify-center my-0.5">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="42" fill="none" stroke="#f3e8ff" strokeWidth="9" />
                    <motion.circle
                      cx="56"
                      cy="56"
                      r="42"
                      fill="none"
                      stroke="#5b46e0"
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.3) }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900 leading-none">30%</span>
                    <span className="text-[9px] font-extrabold text-slate-400 tracking-widest uppercase mt-0.5">
                      SCORE
                    </span>
                  </div>
                </div>

                {/* 2 Metric Cards Grid (Correct vs Wrong) */}
                <div className="grid grid-cols-2 gap-3 w-full">
                  {/* Correct Metric Card */}
                  <div className="p-3.5 rounded-xl bg-[#f0fdf4] border border-[#dcfce7] flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-[#d1fae5] text-emerald-600 flex items-center justify-center mb-1.5">
                      <span className="font-black text-base">✓</span>
                    </div>
                    <span className="text-2xl font-black text-emerald-600 leading-none mb-1">
                      6
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-600 tracking-wider uppercase mb-0.5">
                      CORRECT
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      Good job! Keep it up.
                    </span>
                  </div>

                  {/* Wrong Metric Card */}
                  <div className="p-3.5 rounded-xl bg-[#fef2f2] border border-[#fee2e2] flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-[#fee2e2] text-red-600 flex items-center justify-center mb-1.5">
                      <span className="font-black text-base">✕</span>
                    </div>
                    <span className="text-2xl font-black text-red-600 leading-none mb-1">
                      14
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-600 tracking-wider uppercase mb-0.5">
                      WRONG
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      Review to improve score.
                    </span>
                  </div>
                </div>

                {/* Middle Action Banner */}
                <button
                  onClick={() => setModalTab("review")}
                  className="w-full py-3 px-4 rounded-xl bg-[#f3e8ff] border border-[#e9d5ff] text-[#5b46e0] font-extrabold text-[11px] tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#ede9fe] transition-all cursor-pointer"
                >
                  <span>📖 REVIEW 14 MISTAKES & EXPLANATIONS</span>
                  <span>➔</span>
                </button>

                {/* Bottom Action Bar */}
                <div className="grid grid-cols-2 gap-3 w-full pt-0.5">
                  <button
                    onClick={() => setShowResultsModal(false)}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-extrabold text-xs hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => setModalTab("review")}
                    className="py-2.5 px-3 rounded-xl bg-[#5b46e0] text-white font-extrabold text-[11px] tracking-wider uppercase flex items-center justify-center gap-1.5 hover:bg-[#4c38ce] transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
                  >
                    <span>📑 REVIEW ANSWERS</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-left">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="font-bold text-sm text-slate-900 mb-1">Question 1 Review</h3>
                  <p className="text-xs text-slate-600">
                    Five people A, B, C, D, and E are sitting in a row facing North...
                  </p>
                  <div className="mt-2 text-xs font-bold text-red-600">
                    Your Answer: Person A (Incorrect)
                  </div>
                  <div className="mt-0.5 text-xs font-bold text-emerald-600">
                    Correct Answer: Person B
                  </div>
                </div>

                <button
                  onClick={() => setModalTab("summary")}
                  className="w-full py-3 rounded-xl bg-[#5b46e0] text-white font-bold text-sm"
                >
                  Back to Summary
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
