import React, { useState } from 'react';

const advancedProjects = [
  {
    title: "Sun Nexus Solutions Website",
    summary: "A responsive website for Sun Nexus Solutions, showcasing their services and projects.",
    color: "box-cyan",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: "Lab Manage System",
    summary: "AI-based lab management and resource optimization.",
    color: "box-green",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    title: "Whatsapp Chatbot",
    summary: "An AI-powered chatbot integrated with WhatsApp for instant customer support and automation.",
    color: "box-purple",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "Exam invigilation management system",
    summary: "An AI-based exam invigilation system to ensure academic integrity.",
    color: "box-purple",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    title: "AI assignment evaluator",
    summary: "An AI-based system to evaluate student assignments automatically.",
    color: "box-cyan",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
      </svg>
    ),
  },
  {
    title: "Startup Management System",
    summary: "A comprehensive management system for startups to track projects, tasks, and team collaboration.",
    color: "box-orange",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      </svg>
    ),
  },
  {
    title: "Meeting Summarizer",
    summary: "AI-powered meeting summarization tool.",
    color: "box-cyan",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Smart Attendance System",
    summary: "An AI-powered system to tracking student assignments recognition for accurate and automated record-keeping.",
    color: "box-cyan",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Automated Timetable Management System",
    summary: "A smart scheduling system that generates optimized timetables for educational institutions based on faculty and student availability.",
    color: "box-purple",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    title: "Crowd-Shield",
    summary: "AI-powered crowd monitoring system.",
    color: "box-cyan",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "AI-Powered Resume Analyzer",
    summary: "AI evaluates resumes for job suitability and provides insights.",
    color: "box-orange",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      </svg>
    ),
  },
];

const beginnerProjects = [
  { title: "AI Push-Up Trainer", summary: "An AI-powered push-up trainer that provides real-time feedback and coaching." },
  { title: "Amazon Sales Dashboard", summary: "A comprehensive sales dashboard for Amazon sellers to track performance and analyze sales data." },
  { title: "Cricket Performance Analysis(Virat Kohli)", summary: "An AI-driven performance analysis tool for cricket players, with a focus on Virat Kohli's career statistics." },
  { title: "Majhali Restaurant Kitchen", summary: "Restaurant kitchen management system for efficient operations and inventory control." },
];

const ongoingProjects = [
  { title: "Swarna", summary: "A comprehensive platform for gold price tracking, investment insights, and market analysis." },
  { title: "Time Table Project", summary: "An AI-based time table management system for educational institutions." },
];

const Projects = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="w-full min-h-screen pb-16">
      {/* Banner Section */}
      <div className="text-center pt-12 pb-8 border-b border-white/10 relative overflow-hidden">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          <span className="text-[#00f2fe] drop-shadow-[0_0_20px_rgba(0,242,254,0.6)]">COMPLETED</span>{" "}
          <span className="bg-gradient-to-r from-[#00f2fe] to-[#a855f7] bg-clip-text text-transparent">
            PROJECTS
          </span>
        </h1>
        <div className="flex items-center justify-center gap-4 mt-6">
          <span className="w-32 h-[1px] bg-gradient-to-r from-transparent to-[#00f2fe]/70" />
          <div className="flex items-center justify-center drop-shadow-[0_0_12px_rgba(0,242,254,0.8)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <span className="w-32 h-[1px] bg-gradient-to-r from-[#00f2fe]/70 to-transparent" />
        </div>
      </div>

      {/* Advanced Level Title */}
      <div className="flex items-center justify-center gap-6 my-12">
        <span className="w-40 h-[2px] bg-gradient-to-r from-transparent to-[#00f2fe]/60" />
        <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#00f2fe] to-[#a855f7] bg-clip-text text-transparent">
          Advanced Level
        </h2>
        <span className="w-40 h-[2px] bg-gradient-to-r from-[#00f2fe]/60 to-transparent" />
      </div>

      {/* Advanced Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {advancedProjects.map((proj, idx) => {
          // Center last 2 cards in 4th row on large screen
          const isRow4First = idx === 9;
          const isRow4Second = idx === 10;
          return (
            <div
              key={proj.title}
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101a34]/90 to-[#0a1226]/95 border border-[#00f2fe]/30 p-8 flex flex-col justify-between shadow-[0_16px_40px_rgba(0,0,0,0.5)] hover:border-[#00f2fe] transition-all duration-300 hover:-translate-y-2 ${
                isRow4First ? "lg:col-start-1 lg:ml-[50%]" : ""
              } ${isRow4Second ? "lg:col-start-2 lg:ml-[50%]" : ""}`}
            >
              {/* Corner Ribbon */}
              <div className="absolute top-4 -right-8 bg-gradient-to-r from-[#00f2fe] to-[#0072ff] text-white text-[10px] font-black px-10 py-1 rotate-45 tracking-widest shadow-md">
                ADVANCED
              </div>

              <div>
                <div className="flex flex-col items-center text-center gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                      proj.color === "box-cyan"
                        ? "bg-[#00f2fe]/10 border-[#00f2fe]/40 text-[#00f2fe]"
                        : proj.color === "box-green"
                        ? "bg-[#10b981]/10 border-[#10b981]/40 text-[#10b981]"
                        : proj.color === "box-purple"
                        ? "bg-[#a855f7]/10 border-[#a855f7]/40 text-[#a855f7]"
                        : "bg-[#f97316]/10 border-[#f97316]/40 text-[#f97316]"
                    }`}
                  >
                    {proj.icon}
                  </div>
                  <h3 className="text-xl font-extrabold text-white leading-snug">{proj.title}</h3>
                </div>
                <p className="text-sm text-slate-300 text-center leading-relaxed mb-6">{proj.summary}</p>
              </div>

              <div className="flex justify-center">
                <button className="px-6 py-2.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/40 text-[#00f2fe] text-xs font-extrabold tracking-wider hover:bg-gradient-to-r hover:from-[#00f2fe] hover:to-[#0072ff] hover:text-white transition-all shadow-[0_0_15px_rgba(0,242,254,0.15)]">
                  VIEW DETAILS →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accordions */}
      <div className="max-w-7xl mx-auto px-4 mt-14 space-y-6">
        {/* Beginner Accordion */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
          <button
            onClick={() => toggleSection("beginner")}
            className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">☆</span>
              <h3 className="text-2xl font-extrabold text-white">Beginner Level</h3>
            </div>
            <span className="text-slate-400">{openSection === "beginner" ? "▲" : "▼"}</span>
          </button>
          {openSection === "beginner" && (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-white/10">
              {beginnerProjects.map((p) => (
                <div key={p.title} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-white mb-2">{p.title}</h4>
                  <p className="text-sm text-slate-300">{p.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ongoing Accordion */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
          <button
            onClick={() => toggleSection("ongoing")}
            className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🗂️</span>
              <h3 className="text-2xl font-extrabold text-white">Ongoing Projects</h3>
            </div>
            <span className="text-slate-400">{openSection === "ongoing" ? "▲" : "▼"}</span>
          </button>
          {openSection === "ongoing" && (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/10">
              {ongoingProjects.map((p) => (
                <div key={p.title} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-white mb-2">{p.title}</h4>
                  <p className="text-sm text-slate-300">{p.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Need a Project Matrix Section */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="rounded-3xl border border-[#00f2fe]/30 bg-gradient-to-br from-[#0d162d]/90 to-[#080e1e]/95 p-8 md:p-14 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Need a Project? Let's Build<br />Something Amazing!
            </h2>
            <p className="text-slate-300 text-sm md:text-base">
              Turn your ideas into reality with Sun Nexus Solutions. Whether it's AI, IoT, automation, or web apps, we've got you covered!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="p-8 rounded-2xl bg-white/[0.025] border border-white/10 text-center hover:border-[#00f2fe]/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#a855f7]/10 border border-[#a855f7]/40 text-[#a855f7] inline-flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 2a8 8 0 0 0-8 8c0 3.2 1.8 5.9 4.5 7.2V19a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-1.8c2.7-1.3 4.5-4 4.5-7.2a8 8 0 0 0-8-8z" /></svg>
              </div>
              <h3 className="font-extrabold text-white text-lg mb-2">AI & Machine Learning</h3>
              <p className="text-xs text-slate-300">Predictive models, deep learning, NLP & more.</p>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.025] border border-white/10 text-center hover:border-[#00f2fe]/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#00f2fe]/10 border border-[#00f2fe]/40 text-[#00f2fe] inline-flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
              </div>
              <h3 className="font-extrabold text-white text-lg mb-2">Web & App Development</h3>
              <p className="text-xs text-slate-300">Full-stack websites & mobile apps.</p>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.025] border border-white/10 text-center hover:border-[#00f2fe]/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/40 text-[#10b981] inline-flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
              </div>
              <h3 className="font-extrabold text-white text-lg mb-2">Data Science & Analytics</h3>
              <p className="text-xs text-slate-300">Data processing, analytics & insights.</p>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.025] border border-white/10 text-center hover:border-[#00f2fe]/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#f97316]/10 border border-[#f97316]/40 text-[#f97316] inline-flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <h3 className="font-extrabold text-white text-lg mb-2">Cyber Security & Cloud</h3>
              <p className="text-xs text-slate-300">Secure systems & scalable cloud architecture.</p>
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="border-t border-white/10 pt-10">
            <h3 className="text-center font-extrabold text-xl text-white mb-8">How It Works:</h3>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full bg-white/[0.025] border border-white/10 rounded-2xl p-6 text-center hover:border-[#00f2fe] hover:shadow-[0_20px_45px_rgba(0,0,0,0.5),0_0_28px_rgba(0,242,254,0.22)] hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="w-11 h-11 rounded-full bg-[#00f2fe]/15 border-2 border-[#00f2fe] text-[#00f2fe] font-extrabold inline-flex items-center justify-center mb-3">
                  1
                </div>
                <h4 className="font-extrabold text-white mb-1">Step 1</h4>
                <p className="text-xs text-slate-300">Share your idea or problem statement</p>
              </div>
              <div className="hidden lg:block w-8 h-[2px] bg-gradient-to-r from-[#00f2fe] to-[#a855f7]" />

              <div className="flex-1 w-full bg-white/[0.025] border border-white/10 rounded-2xl p-6 text-center hover:border-[#00f2fe] hover:shadow-[0_20px_45px_rgba(0,0,0,0.5),0_0_28px_rgba(0,242,254,0.22)] hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="w-11 h-11 rounded-full bg-[#a855f7]/15 border-2 border-[#a855f7] text-[#a855f7] font-extrabold inline-flex items-center justify-center mb-3">
                  2
                </div>
                <h4 className="font-extrabold text-white mb-1">Step 2</h4>
                <p className="text-xs text-slate-300">We analyze feasibility & provide a project plan</p>
              </div>
              <div className="hidden lg:block w-8 h-[2px] bg-gradient-to-r from-[#00f2fe] to-[#a855f7]" />

              <div className="flex-1 w-full bg-white/[0.025] border border-white/10 rounded-2xl p-6 text-center hover:border-[#00f2fe] hover:shadow-[0_20px_45px_rgba(0,0,0,0.5),0_0_28px_rgba(0,242,254,0.22)] hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="w-11 h-11 rounded-full bg-[#00f2fe]/15 border-2 border-[#00f2fe] text-[#00f2fe] font-extrabold inline-flex items-center justify-center mb-3">
                  3
                </div>
                <h4 className="font-extrabold text-white mb-1">Step 3</h4>
                <p className="text-xs text-slate-300">Development with regular updates & feedback</p>
              </div>
              <div className="hidden lg:block w-8 h-[2px] bg-gradient-to-r from-[#00f2fe] to-[#a855f7]" />

              <div className="flex-1 w-full bg-white/[0.025] border border-white/10 rounded-2xl p-6 text-center hover:border-[#00f2fe] hover:shadow-[0_20px_45px_rgba(0,0,0,0.5),0_0_28px_rgba(0,242,254,0.22)] hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="w-11 h-11 rounded-full bg-[#a855f7]/15 border-2 border-[#a855f7] text-[#a855f7] font-extrabold inline-flex items-center justify-center mb-3">
                  4
                </div>
                <h4 className="font-extrabold text-white mb-1">Step 4</h4>
                <p className="text-xs text-slate-300">Project completion with deployment & documentation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
