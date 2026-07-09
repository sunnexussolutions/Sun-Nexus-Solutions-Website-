"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import toast, { Toaster } from "react-hot-toast";
import {
  User,
  Lock,
  Mail,
  Calendar,
  Eye,
  EyeOff,
  Sun,
  Moon,
  ArrowRight,
  Brain,
  Zap,
  Users,
  ShieldCheck,
} from "lucide-react";

/* ============================================================================
 * ZOD VALIDATION SCHEMAS
 * ============================================================================ */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    dob: z.string().optional(),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Master password must be at least 8 characters" }),
    confirmPassword: z.string().min(1, { message: "Please confirm password" }),
  })
  .refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

/* ============================================================================
 * FEATURE CARDS DATA
 * ============================================================================ */
const featureCards = [
  {
    title: "Aptitude Hub",
    subtitle: "Advanced Cognitive Assessments",
    icon: Brain,
    iconColor: "text-purple-400",
    bgBadge: "bg-purple-500/15 border-purple-500/30",
    hoverBorder: "hover:border-purple-500/40",
    hoverShadow: "hover:shadow-[0_10px_25px_-5px_rgba(168,85,247,0.2)]",
  },
  {
    title: "Mastery Tracks",
    subtitle: "Curated Learning Architecture",
    icon: Zap,
    iconColor: "text-cyan-400",
    bgBadge: "bg-cyan-500/15 border-cyan-500/30",
    hoverBorder: "hover:border-cyan-400/40",
    hoverShadow: "hover:shadow-[0_10px_25px_-5px_rgba(0,242,254,0.2)]",
  },
  {
    title: "Elite Network",
    subtitle: "Collaborative Community Hub",
    icon: Users,
    iconColor: "text-amber-400",
    bgBadge: "bg-amber-500/15 border-amber-500/30",
    hoverBorder: "hover:border-amber-500/40",
    hoverShadow: "hover:shadow-[0_10px_25px_-5px_rgba(245,158,11,0.2)]",
  },
  {
    title: "Admin Command",
    subtitle: "Strategic Platform Control",
    icon: ShieldCheck,
    iconColor: "text-emerald-400",
    bgBadge: "bg-emerald-500/15 border-emerald-500/30",
    hoverBorder: "hover:border-emerald-500/40",
    hoverShadow: "hover:shadow-[0_10px_25px_-5px_rgba(16,185,129,0.2)]",
  },
];

/* ============================================================================
 * 3D CYBER WAVE BACKGROUND CANVAS COMPONENT
 * ============================================================================ */
const CyberWaveCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let time = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const numPoints = 60;
    const waveRows = 12;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      for (let row = 0; row < waveRows; row++) {
        ctx.beginPath();
        const progress = row / waveRows;
        const yOffset = height * 0.6 + progress * (height * 0.4);

        for (let i = 0; i <= numPoints; i++) {
          const x = (i / numPoints) * width;
          const wave1 =
            Math.sin(i * 0.2 + time + row * 0.4) * 18 * (1 - progress * 0.3);
          const wave2 = Math.cos(i * 0.15 - time * 0.8 + row * 0.2) * 12;
          const y = yOffset + wave1 + wave2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        const alpha = (1 - progress * 0.7) * 0.35;
        const gradient = ctx.createLinearGradient(
          0,
          yOffset - 20,
          width,
          yOffset + 20
        );
        gradient.addColorStop(0, `rgba(0, 242, 254, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(79, 172, 254, ${alpha * 1.2})`);
        gradient.addColorStop(1, `rgba(142, 45, 226, ${alpha})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

/* ============================================================================
 * MAIN EXECUTIVE PORTAL PAGE COMPONENT
 * ============================================================================ */
export default function ExecutivePortalPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // React Hook Form — Login
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // React Hook Form — Sign Up
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    toast.success("Session authorized successfully. Welcome to Executive Portal!");
  };

  const onSignupSubmit = (data: SignupFormValues) => {
    toast.success("Operator identity created successfully! Welcome to Sun Nexus.");
  };

  return (
    <div className="min-h-screen bg-[#030712] dark:bg-[#030712] text-slate-100 dark:text-slate-100 antialiased relative overflow-x-hidden">
      <Toaster position="bottom-right" />
      <CyberWaveCanvas />

      {/* Ambient Glowing Orbs */}
      <div className="fixed -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 -right-40 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Theme Switcher Bar */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700/60 backdrop-blur-md shadow-lg transition-all text-xs font-medium"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-cyan-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-amber-500" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Layout */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 xl:px-20 py-12">
        <div className="w-full max-w-[1520px] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-center">
          
          {/* ================= LEFT COLUMN: HERO ECOSYSTEM ================= */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 xl:pr-6">
            
            {/* Logo Row */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-slate-900/90 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.25)] p-1">
                <img
                  src="https://res.cloudinary.com/dseg9nty3/image/upload/v1772331731/file_0000000032f07208a59ae376aacc1d36_fra0s4.png"
                  alt="Sun Nexus Solutions Logo"
                  className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]"
                />
              </div>
              <span className="font-extrabold tracking-[0.18em] text-sm md:text-[15px] uppercase text-white">
                SUN NEXUS SOLUTIONS
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08]">
                <span className="text-white">Think.</span>
                <span className="bg-gradient-to-r from-[#00f2fe] to-[#38bdf8] bg-clip-text text-transparent ml-1 sm:ml-2">
                  Innovate.
                </span>
                <span className="bg-gradient-to-r from-[#8e2de2] to-[#c084fc] bg-clip-text text-transparent ml-1 sm:ml-2">
                  Master.
                </span>
              </h1>
              <div className="w-20 h-1 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent" />
            </div>

            {/* Subtitles */}
            <div className="space-y-1.5 max-w-2xl">
              <p className="text-base sm:text-lg font-medium text-slate-300">
                The definitive ecosystem for future-ready engineers.
              </p>
              <p className="text-sm sm:text-base text-slate-400">
                Elevate your cognitive potential with the Sun Nexus flagship platform.
              </p>
            </div>

            {/* 4 Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-4">
              {featureCards.map((card, idx) => {
                const IconComponent = card.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className={`group relative rounded-2xl bg-slate-900/65 backdrop-blur-xl border border-cyan-500/20 p-5 transition-all duration-300 ${card.hoverBorder} ${card.hoverShadow}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform ${card.bgBadge}`}
                    >
                      <IconComponent className={`w-5 h-5 ${card.iconColor}`} />
                    </div>
                    <h3 className="text-[15px] font-bold text-white mb-1">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {card.subtitle}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: GLASSMORPHIC AUTH CARD ================= */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[460px] rounded-[28px] bg-slate-900/80 backdrop-blur-2xl border border-cyan-400/30 shadow-[0_0_50px_-10px_rgba(0,242,254,0.25),0_0_50px_-10px_rgba(142,45,226,0.25)] p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
              
              {/* Inner ambient glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Tab Switcher */}
              <div className="relative z-10 w-full p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 grid grid-cols-2 mb-7">
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className={`w-full py-2.5 rounded-xl text-sm transition-all duration-300 ${
                    activeTab === "login"
                      ? "font-semibold bg-gradient-to-r from-[#00c6ff] via-[#0072ff] to-[#8e2de2] text-white shadow-[0_4px_15px_rgba(0,168,255,0.35)]"
                      : "font-medium text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className={`w-full py-2.5 rounded-xl text-sm transition-all duration-300 ${
                    activeTab === "signup"
                      ? "font-semibold bg-gradient-to-r from-[#00c6ff] via-[#0072ff] to-[#8e2de2] text-white shadow-[0_4px_15px_rgba(0,168,255,0.35)]"
                      : "font-medium text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form Content */}
              <AnimatePresence mode="wait">
                {activeTab === "login" ? (
                  <motion.div
                    key="login-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white tracking-tight">
                        Executive Portal
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">
                        Authorize your session to continue.
                      </p>
                    </div>

                    <form
                      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                      className="space-y-4"
                    >
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                          <Mail className="w-5 h-5" />
                        </div>
                        <input
                          type="email"
                          placeholder="Email Address"
                          {...loginForm.register("email")}
                          className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-900/70 border border-cyan-400/25 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                          <Lock className="w-5 h-5" />
                        </div>
                        <input
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="Password"
                          {...loginForm.register("password")}
                          className="w-full h-12 pl-12 pr-12 rounded-xl bg-slate-900/70 border border-cyan-400/25 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300"
                        >
                          {showLoginPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      <div className="flex justify-end pt-0.5">
                        <a
                          href="#"
                          className="text-xs sm:text-[13px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          Forgot Password?
                        </a>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#00A8FF] via-[#4D5BFF] to-[#8E2DE2] hover:opacity-95 text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(0,168,255,0.38)] transition-all duration-300 active:scale-[0.98]"
                        >
                          <span>Login</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <div className="mb-5">
                      <h2 className="text-2xl font-bold text-white tracking-tight">
                        Join the Nexus
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">
                        Create your operator identity.
                      </p>
                    </div>

                    <form
                      onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                      className="space-y-3"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            placeholder="First"
                            {...signupForm.register("firstName")}
                            className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900/70 border border-cyan-400/25 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                          />
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            placeholder="Last"
                            {...signupForm.register("lastName")}
                            className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900/70 border border-cyan-400/25 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <input
                          type="date"
                          placeholder="Date of Birth"
                          {...signupForm.register("dob")}
                          className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/70 border border-cyan-400/25 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          placeholder="Username"
                          {...signupForm.register("username")}
                          className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/70 border border-cyan-400/25 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          placeholder="Email Address"
                          {...signupForm.register("email")}
                          className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/70 border border-cyan-400/25 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="Master Password"
                          {...signupForm.register("password")}
                          className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-900/70 border border-cyan-400/25 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowSignupPassword(!showSignupPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                        >
                          {showSignupPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          {...signupForm.register("confirmPassword")}
                          className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-900/70 border border-cyan-400/25 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#00A8FF] via-[#4D5BFF] to-[#8E2DE2] hover:opacity-95 text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(0,168,255,0.38)] transition-all duration-300 active:scale-[0.98]"
                        >
                          <span>Sign Up</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
