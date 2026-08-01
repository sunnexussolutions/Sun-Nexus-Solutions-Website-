import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Edit3, Camera, Save, X, Zap, Star, Award, MapPin, Calendar,
  Layers, ChevronRight, ChevronDown, Code2, Trophy, ArrowRight, ShieldCheck,
  CheckCircle2, Sparkles, Plus, Trash2, Loader2, Target, ArrowLeft, User,
  AtSign, Phone, GraduationCap, Lock, Briefcase, BarChart2, Link as LinkIcon,
  Eye, EyeOff, Sun, Moon, Globe, Check, Building, Sliders, Bell,
  ThumbsUp, PieChart, Flame, ClipboardList, ExternalLink, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getProjects, getResults, getDSASolutions } from '../store/dataStore';
import { calculateUserStats } from '../utils/analytics';

// SVG Tech Logos renderer supporting extensive tech stack library + smart fallback
const TechLogo = ({ name }) => {
  const n = (name || '').toLowerCase().trim();

  // Python
  if (n.includes('python')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.753h5.822v.826H3.864S0 5.76 0 11.908c0 6.15 3.393 5.94 3.393 5.94h2.03v-2.868s-.11-3.42 3.37-3.42h5.782s3.23.05 3.23-3.15V3.39S18.3 0 11.914 0zM8.76 1.815a1.01 1.01 0 1 1 0 2.02 1.01 1.01 0 0 1 0-2.02z" fill="#3776AB"/>
        <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.753H11.97v-.826h8.165s3.864.475 3.864-5.673c0-6.15-3.393-5.94-3.393-5.94h-2.03v2.868s.11 3.42-3.37 3.42H9.424s-3.23-.05-3.23 3.15v5.044S5.7 24 12.086 24zm3.154-1.815a1.01 1.01 0 1 1 0-2.02 1.01 1.01 0 0 1 0 2.02z" fill="#FFD43B"/>
      </svg>
    );
  }

  // React / React Native
  if (n.includes('react')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.6" transform="rotate(0 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.6" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.6" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="2" fill="#61DAFB" />
      </svg>
    );
  }

  // Node.js
  if (n.includes('node')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2.5 7.5v9L12 22l9.5-5.5v-9L12 2z" fill="#5FA04E"/>
        <path d="M12 6.5v11M7.5 9.2l4.5 2.5 4.5-2.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  // TensorFlow
  if (n.includes('tensor')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M12 2L2 7.5V17l10 5 10-5V7.5L12 2zm0 3.5l6.5 3.3-6.5 3.3-6.5-3.3L12 5.5z" fill="#FF6F00"/>
      </svg>
    );
  }

  // FastAPI
  if (n.includes('fast')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#059669"/>
        <path d="M13 5L6 14h6l-1 5 7-9h-6l1-5z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // PostgreSQL / SQL
  if (n.includes('postgres') || n.includes('sql')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-1.5 0-3-1-3-2.5 0-1.5 1.5-2.5 3-2.5s3 1 3 2.5c0 1.5-1.5 2.5-3 2.5z" fill="#336791"/>
      </svg>
    );
  }

  // Docker
  if (n.includes('docker')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M13 3h2v2h-2V3zm-3 0h2v2h-2V3zM7 3h2v2H7V3zm6 3h2v2h-2V6zm-3 0h2v2h-2V6zM7 6h2v2H7V6zM4 6h2v2H4V6zm9 3h2v2h-2V9zm-3 0h2v2h-2V9zM7 9h2v2H7V9zM4 9h2v2H4V9zM1 9h2v2H1V9zm0 3.5C1 17.5 5 21 12 21s11-3.5 11-8.5H1v1z" fill="#2496ED"/>
      </svg>
    );
  }

  // TypeScript / TS
  if (n.includes('typescript') || n === 'ts') {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <rect width="24" height="24" rx="4" fill="#3178C6"/>
        <path d="M11.5 17h-2v-7.5H7V8h7v1.5h-2.5V17zm7-1.3c-.6.6-1.5.9-2.5.9-1.3 0-2.3-.4-3-1.1l1.1-1.3c.5.5 1.1.8 1.8.8.7 0 1.2-.3 1.2-.7 0-.4-.3-.6-1.2-.9l-.6-.2c-1.4-.5-2.1-1.2-2.1-2.4 0-1.4 1.1-2.4 2.8-2.4 1.1 0 2 .3 2.7.9l-1 1.3c-.5-.4-1.1-.6-1.7-.6-.6 0-1 .2-1 .6 0 .3.3.5 1.1.8l.6.2c1.6.5 2.2 1.3 2.2 2.5 0 1-.4 1.9-1.4 2.6z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // JavaScript / JS
  if (n.includes('javascript') || n === 'js') {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <rect width="24" height="24" rx="4" fill="#F7DF1E"/>
        <path d="M6.5 18.5l1.5-1c.4.7.8 1.2 1.6 1.2.8 0 1.3-.3 1.3-1 0-.6-.4-.9-1.4-1.3l-.5-.2c-1.4-.6-2.3-1.3-2.3-2.9 0-1.6 1.3-2.8 3.3-2.8 1.4 0 2.4.5 3.1 1.7l-1.4.9c-.4-.7-.9-1-1.7-1-.7 0-1.2.4-1.2.9 0 .6.4.8 1.3 1.2l.5.2c1.6.7 2.4 1.4 2.4 3 0 1.8-1.4 2.9-3.6 2.9-2 0-3.3-.9-3.9-2.5zm9 0l1.5-1c.4.7.9 1.2 1.8 1.2.9 0 1.4-.4 1.4-1.2v-7.1h2v7.2c0 1.9-1.2 2.9-3.4 2.9-2 0-3.1-.9-3.7-2z" fill="#000000"/>
      </svg>
    );
  }

  // Next.js
  if (n.includes('next')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#000000"/>
        <path d="M14.5 8.5v7m-5-7v7l7-7" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }

  // HTML / HTML5
  if (n.includes('html')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M3 2l1.6 18L12 22l7.4-2L21 2H3zm13.7 6h-7.6l.2 2h7.2l-.6 6.5L12 17.6l-3.9-1.1-.3-3h2l.1 1.4 2.1.6 2.1-.6.2-2.3H6.8L6.2 6h10.7l-.2 2z" fill="#E34F26"/>
      </svg>
    );
  }

  // CSS / CSS3
  if (n.includes('css')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M3 2l1.6 18L12 22l7.4-2L21 2H3zm13.7 6H6.8l.2 2.5h9.2l-.6 6.5L12 18.1l-3.6-1.1-.2-2.5h2l.1 1.1 1.7.5 1.7-.5.2-2.6H6.4l-.5-6h11.5l-.2 2.5z" fill="#1572B6"/>
      </svg>
    );
  }

  // Tailwind CSS
  if (n.includes('tailwind')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M12 6c-3.3 0-5.3 1.7-6 5 1.3-1.7 2.8-2.2 4.5-1.5 1 .4 1.7 1.2 2.5 2C14.3 12.8 16 14.5 20 14.5c3.3 0 5.3-1.7 6-5-1.3 1.7-2.8 2.2-4.5 1.5-1-.4-1.7-1.2-2.5-2C17.7 7.8 16 6.1 12 6zM6 14.5c-3.3 0-5.3 1.7-6 5 1.3-1.7 2.8-2.2 4.5-1.5 1 .4 1.7 1.2 2.5 2C8.3 21.3 10 23 14 23c3.3 0 5.3-1.7 6-5-1.3 1.7-2.8 2.2-4.5 1.5-1-.4-1.7-1.2-2.5-2C11.7 16.3 10 14.6 6 14.5z" fill="#06B6D4"/>
      </svg>
    );
  }

  // Vue.js
  if (n.includes('vue')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M2 3h3.5L12 15 18.5 3H22L12 21 2 3z" fill="#4FC08D"/>
        <path d="M6 3h3.5L12 9 14.5 3H18L12 13 6 3z" fill="#35495E"/>
      </svg>
    );
  }

  // Angular
  if (n.includes('angular')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M12 2.5L2 6l1.5 12L12 21.5l8.5-3.5L22 6 12 2.5zm0 3l5.5 11h-2l-1.1-2.5h-4.8L8.5 16.5h-2L12 5.5zm-1.6 6.8h3.2L12 8.5l-1.6 3.8z" fill="#DD0031"/>
      </svg>
    );
  }

  // C++ / C / C#
  if (n.includes('c++') || n.includes('cpp') || n.includes('c#')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm-1 13.5c-2.5 0-4-1.8-4-4.5s1.5-4.5 4-4.5c1.4 0 2.5.6 3.1 1.6l-1.4 1c-.4-.6-1-1-1.7-1-1.4 0-2.3 1.1-2.3 2.9s.9 2.9 2.3 2.9c.7 0 1.3-.4 1.7-1l1.4 1c-.6 1-1.7 1.6-3.1 1.6zm7.5-3.5h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1zm2.5 0h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1z" fill="#00599C"/>
      </svg>
    );
  }

  // Java
  if (n.includes('java') && !n.includes('script')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M8.8 19.5c0 0-1.2.3.8.4 2.4.2 4.9.2 7.3-.3 0 0 .7.2 1.4.4-2.8.8-8.5.8-9.5-.5zM8 17c0 0-1.4.4.9.5 2.8.2 6.1.1 8.8-.4 0 0 .5.3 1.2.4-3.4.8-10 .7-10.9-.5zM12 2C9 5 13 7 13 10c0 2-2 3-3 5 2-1 4-3 4-5 0-3-4-5-2-8z" fill="#5382A1"/>
      </svg>
    );
  }

  // Go / Golang
  if (n.includes('go') || n.includes('golang')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M1.8 10h5.4v1.5H1.8zm-1.8 3h4.5v1.5H0zm15.6-3c-2.4 0-4.2 1.6-4.2 3.8s1.8 3.8 4.2 3.8c2.2 0 3.7-1.4 4.1-2.9h-4.1v-1.4h5.8c.1.4.1.8.1 1.3 0 3.3-2.4 5.4-5.9 5.4-3.4 0-5.8-2.3-5.8-5.2s2.4-5.2 5.8-5.2c1.8 0 3.2.7 4.2 1.7l-1.3 1.3c-.7-.7-1.7-1.1-2.9-1.1z" fill="#00ADD8"/>
      </svg>
    );
  }

  // Rust
  if (n.includes('rust')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" fill="#000000"/>
      </svg>
    );
  }

  // MongoDB
  if (n.includes('mongo')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M12 2c-.3 0-.5.2-.6.4C10.5 5 5 11 5 15.5 5 19.1 8.1 22 12 22s7-2.9 7-6.5C19 11 13.5 5 12.6 2.4c-.1-.2-.3-.4-.6-.4zm.5 17.5v-12c2.8 3.5 4.5 7.1 4.5 9.5 0 2.5-2 4.5-4.5 4.5z" fill="#47A248"/>
      </svg>
    );
  }

  // Firebase / Supabase
  if (n.includes('firebase') || n.includes('supa')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M3.9 17.5L1.5 4.3c-.1-.6.5-1 1-.7l16.7 10.2-7.5 4.2-7.8-.5z" fill="#FFCA28"/>
        <path d="M19.2 13.8L12.5 2.3c-.3-.5-1-.5-1.3 0L8.7 7.1l10.5 6.7z" fill="#FFA000"/>
        <path d="M12.5 21.7c.4.2.9 0 1.1-.3l8.6-13.8c.3-.5-.1-1.1-.7-1L12.5 21.7z" fill="#F57C00"/>
      </svg>
    );
  }

  // AWS / Cloud
  if (n.includes('aws') || n.includes('cloud')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M12 4a7 7 0 0 0-6.9 6 4.5 4.5 0 0 0 1.4 8.8h11A4.5 4.5 0 0 0 22 14.5 7 7 0 0 0 12 4z" fill="#FF9900"/>
      </svg>
    );
  }

  // Git / GitHub
  if (n.includes('git')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M12 2A10 10 0 0 0 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.6.3-1.1.6-1.4-2.2-.2-4.5-1.1-4.5-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.9-2.3 4.8-4.5 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 22 12 10 10 0 0 0 12 2z" fill="#181717"/>
      </svg>
    );
  }

  // Smart Dynamic Fallback Badge for any other custom user-entered skill
  const firstLetter = (name || 'S').trim().charAt(0).toUpperCase();
  return (
    <div style={{
      width: '18px',
      height: '18px',
      borderRadius: '5px',
      background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      fontWeight: 900,
      boxShadow: '0 1px 4px rgba(123, 92, 255, 0.3)'
    }}>
      {firstLetter}
    </div>
  );
};

// Default tech stack matching exact items from reference screenshot
const DEFAULT_TECH_STACK = [
  { name: 'Python' },
  { name: 'React' },
  { name: 'Node.js' },
  { name: 'TensorFlow' },
  { name: 'FastAPI' },
  { name: 'PostgreSQL' },
  { name: 'Docker' },
  { name: 'TypeScript' }
];

// ── PIXEL PERFECT EDIT PROFILE VIEW ──────────────────────────────────────────
function EditProfileView({ isDark, user, profileData, onSave, onClose, toggleTheme, theme }) {
  const [formData, setFormData] = useState({
    avatar:          profileData.avatar            || '',
    fullName:        profileData.name              || user?.fullName       || '',
    username:        profileData.username          || user?.username       || '',
    email:           profileData.email             || user?.email          || '',
    countryCode:     '+91',
    mobileNumber:    profileData.phone?.replace(/^\+91\s?/, '') || user?.phone || user?.mobileNumber || '',
    dob:             profileData.dob               || user?.dob            || '',
    gender:          profileData.gender            || user?.gender         || 'Male',
    location:        profileData.location          || profileData.address  || user?.location || '',
    university:      profileData.university        || user?.university     || '',
    branch:          profileData.branch            || user?.branch         || '',
    specialization:  profileData.specialization    || user?.specialization || '',
    year:            profileData.year              || user?.year           || '',
    division:        profileData.division          || user?.division       || '',
    prnNumber:       profileData.prnNumber         || user?.prnNumber      || '',
    selectedDomain:  profileData.selectedDomain    || user?.selectedDomain || '',
    skills: profileData.skills
      ? profileData.skills.map(s => typeof s === 'string' ? s : s.name)
      : [],
    experienceLevel: profileData.experienceLevel   || user?.experienceLevel || '',
    bio:             profileData.bio               || user?.bio             || '',
    githubUrl:       profileData.githubUrl         || user?.githubUrl       || '',
    linkedinUrl:     profileData.linkedinUrl       || user?.linkedinUrl     || '',
    portfolioUrl:    profileData.portfolioUrl      || user?.portfolioUrl    || '',
    graduationYear:  profileData.graduationYear    || user?.graduationYear  || '',
    cgpa:            profileData.cgpa              || user?.cgpa            || '',
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
    theme:           theme || 'light',
    emailNotifications: true,
    appNotifications:   true,
    language:        'English'
  });

  const [newSkillInput, setNewSkillInput] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Accordion Section Toggle for Mobile
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    academic: true,
    professional: true,
    security: true,
    preferences: true
  });

  const toggleSection = (sec) => {
    setExpandedSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (formData.skills.includes(newSkillInput.trim())) return;
    setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkillInput.trim()] }));
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    // Call onSave IMMEDIATELY so the profile view updates in real-time
    // The success modal is shown for confirmation, but changes are already persisted
    onSave(formData);
    setShowSuccessModal(true);
  };

  const cardStyle = {
    backgroundColor: isDark ? '#121625' : '#ffffff',
    border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
    borderRadius: '24px',
    padding: '18px 20px',
    boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.35)' : '0 4px 20px rgba(0,0,0,0.03)',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '100%'
  };

  const inputContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px 10px 38px',
    borderRadius: '12px',
    border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.2)' : '#e2e8f0'}`,
    backgroundColor: isDark ? '#0d0f1a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: '13.5px',
    fontWeight: 600,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 700,
    color: isDark ? '#94a3b8' : '#475569',
    marginBottom: '6px'
  };

  const iconStyle = {
    position: 'absolute',
    left: '12px',
    color: isDark ? '#94a3b8' : '#64748b',
    pointerEvents: 'none'
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '16px 0 60px 0', boxSizing: 'border-box' }}>
      
      {/* ── TOP HEADER BAR ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', border: 'none', background: 'none',
              color: isDark ? '#94a3b8' : '#64748b', fontSize: '13px', fontWeight: 700, cursor: 'pointer', padding: 0, marginBottom: '4px'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Profile</span>
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0, lineHeight: 1.2 }}>
            Edit Profile
          </h1>
          <p style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>
            Manage your personal information and account preferences.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            padding: '12px 24px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)',
            color: '#ffffff', fontSize: '14px', fontWeight: 800, border: 'none',
            cursor: 'pointer', boxShadow: '0 4px 16px rgba(123, 92, 255, 0.35)'
          }}
        >
          Save Changes
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* CARD 1: PROFILE PHOTO */}
        <div style={{
          ...cardStyle,
          position: 'relative',
          background: isDark
            ? 'linear-gradient(135deg, #121625 0%, #0d0f1a 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #fcfaff 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Avatar circle with camera badge */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '84px', height: '84px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', fontSize: '32px', fontWeight: 900,
                  boxShadow: '0 8px 24px rgba(123, 92, 255, 0.3)',
                  overflow: 'hidden'
                }}>
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    (formData.fullName || 'N').charAt(0).toUpperCase()
                  )}
                </div>
                <label style={{
                  position: 'absolute', bottom: '2px', right: '2px',
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: '#ffffff', color: '#0f172a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer'
                }}>
                  <Camera size={14} />
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 4px 0' }}>
                  Profile Photo
                </h3>
                <p style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>
                  JPG, PNG or WEBP. Max size 5MB.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: 'auto' }}>
              <label style={{
                padding: '10px 20px', borderRadius: '12px',
                border: '1.5px solid #7b5cff', color: '#7b5cff',
                backgroundColor: 'transparent', fontSize: '13px', fontWeight: 800,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
              }}>
                Upload Photo
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, avatar: '' }))}
                style={{
                  padding: '10px 20px', borderRadius: '12px',
                  border: '1.5px solid #ef4444', color: '#ef4444',
                  backgroundColor: 'transparent', fontSize: '13px', fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Remove Photo
              </button>
            </div>
          </div>
        </div>

        {/* ── 2 COLUMN GRID FOR DESKTOP SECTIONS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: '24px', width: '100%' }}>
          
          {/* CARD 2: PERSONAL INFORMATION */}
          <div style={cardStyle}>
            <div
              onClick={() => toggleSection('personal')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: expandedSections.personal ? '18px' : '0' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={18} style={{ color: '#7b5cff' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                  Personal Information
                </h3>
              </div>
              <ChevronDown size={18} style={{ color: isDark ? '#94a3b8' : '#64748b', transform: expandedSections.personal ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {expandedSections.personal && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <div style={inputContainerStyle}>
                    <User size={16} style={iconStyle} />
                    <input
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Username</label>
                  <div style={inputContainerStyle}>
                    <AtSign size={16} style={iconStyle} />
                    <input
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Email Address</label>
                  <div style={inputContainerStyle}>
                    <AtSign size={16} style={iconStyle} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Mobile Number</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ position: 'relative', width: '85px', flexShrink: 0 }}>
                      <Phone size={15} style={{ ...iconStyle, left: '10px' }} />
                      <select
                        value={formData.countryCode}
                        onChange={e => setFormData({ ...formData, countryCode: e.target.value })}
                        style={{ ...inputStyle, paddingLeft: '28px', paddingRight: '8px' }}
                      >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                      </select>
                    </div>
                    <input
                      value={formData.mobileNumber}
                      onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
                      style={{ ...inputStyle, paddingLeft: '14px', flex: 1 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Date of Birth</label>
                  <div style={inputContainerStyle}>
                    <Calendar size={16} style={iconStyle} />
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={e => setFormData({ ...formData, dob: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Gender</label>
                  <div style={inputContainerStyle}>
                    <User size={16} style={iconStyle} />
                    <select
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Location / Address</label>
                  <div style={inputContainerStyle}>
                    <MapPin size={16} style={iconStyle} />
                    <input
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Mumbai, India"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CARD 3: ACADEMIC INFORMATION */}
          <div style={cardStyle}>
            <div
              onClick={() => toggleSection('academic')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: expandedSections.academic ? '18px' : '0' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={18} style={{ color: '#7b5cff' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                  Academic Information
                </h3>
              </div>
              <ChevronDown size={18} style={{ color: isDark ? '#94a3b8' : '#64748b', transform: expandedSections.academic ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {expandedSections.academic && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>University</label>
                  <div style={inputContainerStyle}>
                    <Building size={16} style={iconStyle} />
                    <input
                      value={formData.university}
                      onChange={e => setFormData({ ...formData, university: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Branch / Stream</label>
                  <div style={inputContainerStyle}>
                    <User size={16} style={iconStyle} />
                    <select
                      value={formData.branch}
                      onChange={e => setFormData({ ...formData, branch: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="Computer Science Engineering">Computer Science Engineering</option>
                      <option value="Computer Science (AI & ML)">Computer Science (AI & ML)</option>
                      <option value="Computer Science (Data Science)">Computer Science (Data Science)</option>
                      <option value="Computer Science (Cyber Security)">Computer Science (Cyber Security)</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                      <option value="Electronics & Telecommunication Engineering">Electronics & Telecommunication Engineering</option>
                      <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Mechatronics Engineering">Mechatronics Engineering</option>
                      <option value="Robotics & Automation">Robotics & Automation</option>
                      <option value="Aerospace Engineering">Aerospace Engineering</option>
                      <option value="Chemical Engineering">Chemical Engineering</option>
                      <option value="Biotechnology">Biotechnology</option>
                      <option value="Data Science & Analytics">Data Science & Analytics</option>
                      <option value="Other / Interdisciplinary">Other / Interdisciplinary</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Specialization</label>
                  <div style={inputContainerStyle}>
                    <AtSign size={16} style={iconStyle} />
                    <input
                      value={formData.specialization}
                      onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                      placeholder="e.g. Artificial Intelligence"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Year</label>
                  <div style={inputContainerStyle}>
                    <GraduationCap size={16} style={iconStyle} />
                    <select
                      value={formData.year}
                      onChange={e => setFormData({ ...formData, year: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="First Year">First Year</option>
                      <option value="Second Year">Second Year</option>
                      <option value="Third Year">Third Year</option>
                      <option value="Final Year">Final Year</option>
                      <option value="Graduated / Alumni">Graduated / Alumni</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Division</label>
                  <div style={inputContainerStyle}>
                    <Bell size={16} style={iconStyle} />
                    <input
                      value={formData.division}
                      onChange={e => setFormData({ ...formData, division: e.target.value })}
                      placeholder="e.g. A"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>PRN Number / Student ID</label>
                  <div style={inputContainerStyle}>
                    <Lock size={16} style={iconStyle} />
                    <input
                      value={formData.prnNumber}
                      onChange={e => setFormData({ ...formData, prnNumber: e.target.value })}
                      placeholder="e.g. SNXU202312345"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Graduation Year</label>
                  <div style={inputContainerStyle}>
                    <Calendar size={16} style={iconStyle} />
                    <input
                      value={formData.graduationYear}
                      onChange={e => setFormData({ ...formData, graduationYear: e.target.value })}
                      placeholder="e.g. 2027"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>CGPA / Percentage</label>
                  <div style={inputContainerStyle}>
                    <Award size={16} style={iconStyle} />
                    <input
                      value={formData.cgpa}
                      onChange={e => setFormData({ ...formData, cgpa: e.target.value })}
                      placeholder="e.g. 8.75 / 10"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* CARD 4: PROFESSIONAL INFORMATION */}
        <div style={cardStyle}>
          <div
            onClick={() => toggleSection('professional')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: expandedSections.professional ? '18px' : '0' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase size={18} style={{ color: '#7b5cff' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                Professional Information
              </h3>
            </div>
            <ChevronDown size={18} style={{ color: isDark ? '#94a3b8' : '#64748b', transform: expandedSections.professional ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </div>

          {expandedSections.professional && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Selected Domain</label>
                  <div style={inputContainerStyle}>
                    <Briefcase size={16} style={iconStyle} />
                    <select
                      value={formData.selectedDomain}
                      onChange={e => setFormData({ ...formData, selectedDomain: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                      <option value="Full Stack Web Development">Full Stack Web Development</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Skills (Add up to 10)</label>
                  <div style={{
                    ...inputStyle, padding: '6px 12px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', minHeight: '42px'
                  }}>
                    {formData.skills.map((sk, idx) => (
                      <span key={idx} style={{
                        padding: '4px 10px', borderRadius: '16px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
                        color: '#7b5cff', fontSize: '12px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px'
                      }}>
                        {sk}
                        <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleRemoveSkill(sk)} />
                      </span>
                    ))}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        value={newSkillInput}
                        onChange={e => setNewSkillInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                        placeholder="+ Add"
                        style={{ border: 'none', background: 'transparent', outline: 'none', color: isDark ? '#f8fafc' : '#0f172a', fontSize: '12px', fontWeight: 700, width: '70px' }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Experience Level</label>
                  <div style={inputContainerStyle}>
                    <BarChart2 size={16} style={iconStyle} />
                    <select
                      value={formData.experienceLevel}
                      onChange={e => setFormData({ ...formData, experienceLevel: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Short Bio</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  style={{
                    ...inputStyle, padding: '12px', height: 'auto', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>GitHub URL</label>
                  <div style={inputContainerStyle}>
                    <LinkIcon size={16} style={iconStyle} />
                    <input
                      value={formData.githubUrl}
                      onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                      style={inputStyle}
                    />
                    <LinkIcon size={14} style={{ position: 'absolute', right: '12px', color: isDark ? '#94a3b8' : '#64748b' }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>LinkedIn URL</label>
                  <div style={inputContainerStyle}>
                    <LinkIcon size={16} style={iconStyle} />
                    <input
                      value={formData.linkedinUrl}
                      onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      style={inputStyle}
                    />
                    <LinkIcon size={14} style={{ position: 'absolute', right: '12px', color: isDark ? '#94a3b8' : '#64748b' }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Portfolio URL</label>
                  <div style={inputContainerStyle}>
                    <LinkIcon size={16} style={iconStyle} />
                    <input
                      value={formData.portfolioUrl}
                      onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      style={inputStyle}
                    />
                    <LinkIcon size={14} style={{ position: 'absolute', right: '12px', color: isDark ? '#94a3b8' : '#64748b' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── 2 COLUMN GRID FOR SECURITY & PREFERENCES ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: '24px', width: '100%' }}>
          
          {/* CARD 5: SECURITY */}
          <div style={cardStyle}>
            <div
              onClick={() => toggleSection('security')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: expandedSections.security ? '18px' : '0' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Lock size={18} style={{ color: '#7b5cff' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                  Security
                </h3>
              </div>
              <ChevronDown size={18} style={{ color: isDark ? '#94a3b8' : '#64748b', transform: expandedSections.security ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {expandedSections.security && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Current Password</label>
                    <div style={inputContainerStyle}>
                      <Lock size={16} style={iconStyle} />
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={formData.currentPassword}
                        onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        style={inputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        style={{ position: 'absolute', right: '12px', border: 'none', background: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer' }}
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>New Password</label>
                    <div style={inputContainerStyle}>
                      <Lock size={16} style={iconStyle} />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        style={inputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{ position: 'absolute', right: '12px', border: 'none', background: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer' }}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Confirm Password</label>
                    <div style={inputContainerStyle}>
                      <Lock size={16} style={iconStyle} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        style={inputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ position: 'absolute', right: '12px', border: 'none', background: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer' }}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Password Strength</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                        <div style={{ height: '6px', borderRadius: '4px', backgroundColor: '#10b981', flex: 1 }} />
                        <div style={{ height: '6px', borderRadius: '4px', backgroundColor: '#10b981', flex: 1 }} />
                        <div style={{ height: '6px', borderRadius: '4px', backgroundColor: '#10b981', flex: 1 }} />
                        <div style={{ height: '6px', borderRadius: '4px', backgroundColor: isDark ? '#1e293b' : '#e2e8f0', flex: 1 }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981' }}>Strong</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert('Password update feature activated')}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)',
                    color: '#ffffff', fontSize: '13.5px', fontWeight: 800, border: 'none',
                    cursor: 'pointer', marginTop: '8px'
                  }}
                >
                  Change Password
                </button>
              </div>
            )}
          </div>

          {/* CARD 6: PREFERENCES */}
          <div style={cardStyle}>
            <div
              onClick={() => toggleSection('preferences')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: expandedSections.preferences ? '18px' : '0' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sliders size={18} style={{ color: '#7b5cff' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                  Preferences
                </h3>
              </div>
              <ChevronDown size={18} style={{ color: isDark ? '#94a3b8' : '#64748b', transform: expandedSections.preferences ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {expandedSections.preferences && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>Theme</span>
                  <div style={{ width: '130px', minWidth: '110px' }}>
                    <select
                      value={theme}
                      onChange={e => { if (toggleTheme) toggleTheme(e.target.value); }}
                      style={{ ...inputStyle, paddingLeft: '12px' }}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>Email Notifications</span>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, emailNotifications: !p.emailNotifications }))}
                    style={{
                      width: '44px', height: '24px', borderRadius: '12px', border: 'none',
                      backgroundColor: formData.emailNotifications ? '#7b5cff' : (isDark ? '#334155' : '#cbd5e1'),
                      position: 'relative', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                    }}
                  >
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#ffffff',
                      position: 'absolute', top: '3px', left: formData.emailNotifications ? '23px' : '3px', transition: 'all 0.2s'
                    }} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>App Notifications</span>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, appNotifications: !p.appNotifications }))}
                    style={{
                      width: '44px', height: '24px', borderRadius: '12px', border: 'none',
                      backgroundColor: formData.appNotifications ? '#7b5cff' : (isDark ? '#334155' : '#cbd5e1'),
                      position: 'relative', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                    }}
                  >
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#ffffff',
                      position: 'absolute', top: '3px', left: formData.appNotifications ? '23px' : '3px', transition: 'all 0.2s'
                    }} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>Language</span>
                  <div style={{ width: '130px', minWidth: '110px' }}>
                    <select
                      value={formData.language}
                      onChange={e => setFormData({ ...formData, language: e.target.value })}
                      style={{ ...inputStyle, paddingLeft: '12px' }}
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ── BOTTOM ACTION BAR ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '12px 24px', borderRadius: '14px',
              border: `1.5px solid ${isDark ? 'rgba(148, 163, 184, 0.2)' : '#e2e8f0'}`,
              backgroundColor: 'transparent', color: isDark ? '#cbd5e1' : '#475569',
              fontSize: '14px', fontWeight: 800, cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            style={{
              padding: '12px 28px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)',
              color: '#ffffff', fontSize: '14px', fontWeight: 800, border: 'none',
              cursor: 'pointer', boxShadow: '0 4px 16px rgba(123, 92, 255, 0.35)'
            }}
          >
            Save Changes
          </button>
        </div>

      </div>

      {/* ── PROFILE UPDATED SUCCESS MODAL (PIXEL PERFECT REFERENCE MATCH) ── */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999999,
          backgroundColor: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            maxWidth: '400px',
            width: '100%',
            padding: '32px 24px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            textAlign: 'center',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none',
                color: '#94a3b8', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center'
              }}
            >
              <X size={18} />
            </button>

            {/* Confetti & Checkmark Graphics */}
            <div style={{ position: 'relative', width: '100%', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              {/* Confetti Particles */}
              <div style={{ position: 'absolute', top: '10px', left: '22%', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ec4899' }} />
              <div style={{ position: 'absolute', top: '28%', left: '16%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#06b6d4' }} />
              <div style={{ position: 'absolute', top: '14%', left: '38%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#a855f7' }} />
              <div style={{ position: 'absolute', top: '12%', right: '38%', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
              <div style={{ position: 'absolute', top: '26%', right: '20%', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f97316' }} />
              <div style={{ position: 'absolute', top: '48%', right: '15%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#eab308' }} />
              <div style={{ position: 'absolute', top: '65%', right: '22%', width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#8b5cf6', transform: 'rotate(45deg)' }} />
              <div style={{ position: 'absolute', top: '62%', left: '18%', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
              <div style={{ position: 'absolute', top: '42%', left: '26%', width: '8px', height: '8px', backgroundColor: '#10b981', transform: 'rotate(45deg)' }} />

              {/* Green Circle Badge with Checkmark */}
              <div style={{
                width: '76px', height: '76px', borderRadius: '50%',
                backgroundColor: '#dcfce7', color: '#16a34a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(22, 163, 74, 0.15)'
              }}>
                <Check size={36} strokeWidth={3} />
              </div>
            </div>

            {/* Modal Title */}
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0', lineHeight: 1.2 }}>
              Profile Updated Successfully!
            </h3>

            {/* Modal Description */}
            <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#64748b', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Your changes have been saved successfully.<br />
              Your profile information is now up to date.
            </p>

            {/* Continue Button — closes success modal and returns to Profile view */}
            <button
              onClick={() => { setShowSuccessModal(false); onClose(); }}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(123, 92, 255, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const { user, updateProfile } = useAuth();
  const isDark = theme === 'dark';

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTechStackModalOpen, setIsTechStackModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState('completed');
  const [activeTab, setActiveTab] = useState('overview');

  // Profile local data — all fields synced from user / EditProfileView
  const buildProfileData = (src) => ({
    name: src?.name || src?.fullName || src?.username || 'Nexus_Operator',
    headline: src?.headline || src?.selectedDomain || src?.role || 'Nexus Admin',
    location: src?.location || src?.address || '',
    email: src?.email || '',
    phone: src?.phone || src?.mobileNumber || '',
    username: src?.username || '',
    dob: src?.dob || '',
    gender: src?.gender || '',
    address: src?.address || (src?.location || ''),
    university: src?.university || '',
    branch: src?.branch || '',
    specialization: src?.specialization || '',
    year: src?.year || '',
    division: src?.division || '',
    prnNumber: src?.prnNumber || '',
    selectedDomain: src?.selectedDomain || '',
    experienceLevel: src?.experienceLevel || '',
    bio: src?.bio || '',
    githubUrl: src?.githubUrl || '',
    linkedinUrl: src?.linkedinUrl || '',
    portfolioUrl: src?.portfolioUrl || '',
    resumeUrl: src?.resumeUrl || src?.resume_url || '',
    graduationYear: src?.graduationYear || src?.graduation_year || '',
    cgpa: src?.cgpa || '',
    joined: src?.joinedAt
      ? new Date(src.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : (src?.joined || 'May 2026'),
    lastUpdated: src?.lastUpdated || '',
    avatar: src?.avatar || '',
    banner: src?.banner || '',
    skills: src?.skills ? (typeof src.skills === 'string' ? JSON.parse(src.skills) : src.skills) : DEFAULT_TECH_STACK,
    projects: src?.projects ? (typeof src.projects === 'string' ? JSON.parse(src.projects) : src.projects) : []
  });

  const [profileData, setProfileData] = useState(() => buildProfileData(user));

  const [draftProfile, setDraftProfile] = useState({ ...profileData });
  const [uploading, setUploading] = useState({ avatar: false, banner: false });
  const [newSkillName, setNewSkillName] = useState('');

  // ── Dynamic Stat Cards Data ───────────────────────────────────────────────
  const [aptitudeResults, setAptitudeResults] = useState([]);
  const [dsaSolutions, setDsaSolutions] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const fetchStats = async () => {
      try {
        const [allResults, allDSA] = await Promise.all([getResults(), getDSASolutions()]);
        if (cancelled) return;
        // Filter results to this user only
        setAptitudeResults((allResults || []).filter(r => r.userId === user.id || r.user_id === user.id));
        // Filter DSA solutions to this user only (by email or member_id)
        setDsaSolutions((allDSA || []).filter(s =>
          s.memberEmail === user.email || s.memberId === user.id ||
          s.member_email === user.email || s.member_id === user.id
        ));
      } catch (e) {
        console.warn('Profile stats fetch error:', e.message);
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    };
    fetchStats();
    window.addEventListener('nexus-data-updated', fetchStats);
    return () => { cancelled = true; window.removeEventListener('nexus-data-updated', fetchStats); };
  }, [user]);

  // Computed stat values
  const aptitudeStats = useMemo(() => calculateUserStats(aptitudeResults), [aptitudeResults]);

  // Accuracy change this week
  const accuracyTrend = useMemo(() => {
    if (!aptitudeResults.length) return null;
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = aptitudeResults.filter(r => new Date(r.submitted_at) >= oneWeekAgo);
    const before   = aptitudeResults.filter(r => new Date(r.submitted_at) <  oneWeekAgo);
    if (!thisWeek.length || !before.length) return null;
    const avgThisWeek = Math.round(thisWeek.reduce((a, r) => a + (r.percentage || 0), 0) / thisWeek.length);
    const avgBefore   = Math.round(before.reduce((a, r)  => a + (r.percentage || 0), 0) / before.length);
    return avgThisWeek - avgBefore;
  }, [aptitudeResults]);

  // DSA: total approved submissions & how many this month
  const dsaApproved    = useMemo(() => dsaSolutions.filter(s => s.status === 'approved'), [dsaSolutions]);
  const dsaThisMonth   = useMemo(() => {
    const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0);
    return dsaApproved.filter(s => new Date(s.submittedAt || s.submitted_at) >= startOfMonth).length;
  }, [dsaApproved]);

  // Streak: from user object (weeks-based, but we display as "X Weeks")
  const currentStreak  = user?.streak || 0;
  const bestStreak     = user?.bestStreak || user?.best_streak || currentStreak;

  // Dynamic Activity Timeline constructed from real user actions
  const activityList = useMemo(() => {
    const list = [];

    // Profile updated event
    if (profileData.lastUpdated) {
      list.push({
        id: 'act-prof-update',
        title: 'Updated Profile Details',
        desc: 'Personal & Academic information updated',
        time: profileData.lastUpdated,
        icon: User,
        bg: '#dcfce7',
        color: '#16a34a'
      });
    }

    // DSA Submissions
    (dsaSolutions || []).forEach(s => {
      list.push({
        id: `act-dsa-${s.id || Math.random()}`,
        title: `Submitted DSA Solution`,
        desc: `${s.problemTitle || s.title || 'DSA Problem'} (${s.status || 'pending'})`,
        time: s.submittedAt || s.submitted_at ? new Date(s.submittedAt || s.submitted_at).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Recently',
        icon: ClipboardList,
        bg: '#eff6ff',
        color: '#3b82f6'
      });
    });

    // Aptitude Test attempts
    (aptitudeResults || []).forEach(r => {
      list.push({
        id: `act-apt-${r.id || Math.random()}`,
        title: `Submitted Aptitude Test`,
        desc: `${r.topic || 'Assessment'} (${Math.round(r.percentage || 0)}%)`,
        time: r.submitted_at ? new Date(r.submitted_at).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Recently',
        icon: FileText,
        bg: '#f0f9ff',
        color: '#0284c7'
      });
    });

    // Joined Platform
    list.push({
      id: 'act-joined',
      title: 'Joined Sun Nexus Platform',
      desc: 'Welcome to the platform!',
      time: profileData.joined || 'May 2026',
      icon: Sparkles,
      bg: '#f3e8ff',
      color: '#8b5cf6'
    });

    return list;
  }, [profileData.lastUpdated, profileData.joined, dsaSolutions, aptitudeResults]);

  // Dynamic Recent Achievements constructed from real user milestones
  const achievementsList = useMemo(() => {
    const list = [];

    // Milestone 1: Joined Platform
    list.push({
      id: 'ach-member',
      title: 'Platform Pioneer',
      desc: 'Joined Sun Nexus Community',
      date: profileData.joined || 'May 2026',
      icon: Sparkles,
      bg: '#7b5cff'
    });

    // Milestone 2: DSA Problems Solved
    if (dsaApproved.length > 0) {
      list.push({
        id: 'ach-dsa',
        title: 'DSA Problem Solver',
        desc: `Solved ${dsaApproved.length} DSA Problem${dsaApproved.length === 1 ? '' : 's'}`,
        date: 'Active',
        icon: Star,
        bg: '#16a34a'
      });
    }

    // Milestone 3: Aptitude Tests Completed
    if (aptitudeStats.count > 0) {
      list.push({
        id: 'ach-aptitude',
        title: 'Aptitude Challenger',
        desc: `Completed ${aptitudeStats.count} Test${aptitudeStats.count === 1 ? '' : 's'} (Best: ${aptitudeStats.best}%)`,
        date: 'Active',
        icon: ShieldCheck,
        bg: '#0284c7'
      });
    }

    // Milestone 4: Active Streak
    if (currentStreak > 0) {
      list.push({
        id: 'ach-streak',
        title: 'Consistent Learner',
        desc: `Maintained ${currentStreak} week streak`,
        date: 'Active',
        icon: Flame,
        bg: '#f97316'
      });
    }

    return list;
  }, [profileData.joined, dsaApproved.length, aptitudeStats, currentStreak]);

  // Save Full Edit Profile — Optimistic Update pattern:

  // 1. Update local profileData state IMMEDIATELY (instant UI update, no waiting for DB)
  // 2. Sync to DB + user context in the background via updateProfile
  const handleSaveFullProfile = (formData) => {
    // ── STEP 1: Immediate optimistic update ───────────────────────────────────
    // This runs synchronously. The profile view will show the new data the
    // instant the user clicks "Continue" in the success modal.
    const updatedProfile = {
      ...profileData,
      name:            formData.fullName            || profileData.name,
      username:        formData.username            || profileData.username,
      email:           formData.email               || profileData.email,
      phone:           `${formData.countryCode || '+91'} ${formData.mobileNumber}`.trim() || profileData.phone,
      dob:             formData.dob                 || profileData.dob,
      gender:          formData.gender              || profileData.gender,
      location:        formData.location            || profileData.location,
      address:         formData.location            || profileData.address,
      university:      formData.university          || profileData.university,
      branch:          formData.branch              || profileData.branch,
      specialization:  formData.specialization      || profileData.specialization,
      year:            formData.year                || profileData.year,
      division:        formData.division            || profileData.division,
      prnNumber:       formData.prnNumber           || profileData.prnNumber,
      selectedDomain:  formData.selectedDomain      || profileData.selectedDomain,
      experienceLevel: formData.experienceLevel     || profileData.experienceLevel,
      bio:             formData.bio                 || profileData.bio,
      githubUrl:       formData.githubUrl           || profileData.githubUrl,
      linkedinUrl:     formData.linkedinUrl         || profileData.linkedinUrl,
      portfolioUrl:    formData.portfolioUrl        || profileData.portfolioUrl,
      resumeUrl:       formData.resumeUrl           || profileData.resumeUrl,
      graduationYear:  formData.graduationYear      || profileData.graduationYear,
      cgpa:            formData.cgpa                || profileData.cgpa,
      headline:        formData.selectedDomain || formData.branch || profileData.headline,
      avatar:          formData.avatar              || profileData.avatar,
      skills:          formData.skills              || profileData.skills,
      lastUpdated:     'Just now'
    };

    // Apply to React state immediately — guarantees instant render
    setProfileData(updatedProfile);

    // Also persist to localStorage immediately so it survives a refresh
    try {
      const raw = localStorage.getItem('nexus_user');
      const saved = raw ? JSON.parse(raw) : {};
      localStorage.setItem('nexus_user', JSON.stringify({
        ...saved,
        name:            updatedProfile.name,
        fullName:        formData.fullName,
        username:        updatedProfile.username,
        email:           updatedProfile.email,
        phone:           formData.mobileNumber,
        mobileNumber:    formData.mobileNumber,
        dob:             updatedProfile.dob,
        gender:          updatedProfile.gender,
        location:        formData.location,
        address:         formData.location,
        university:      updatedProfile.university,
        branch:          updatedProfile.branch,
        specialization:  updatedProfile.specialization,
        year:            updatedProfile.year,
        division:        updatedProfile.division,
        prnNumber:       updatedProfile.prnNumber,
        selectedDomain:  updatedProfile.selectedDomain,
        experienceLevel: updatedProfile.experienceLevel,
        bio:             updatedProfile.bio,
        githubUrl:       updatedProfile.githubUrl,
        linkedinUrl:     updatedProfile.linkedinUrl,
        portfolioUrl:    updatedProfile.portfolioUrl,
        graduationYear:  updatedProfile.graduationYear,
        cgpa:            updatedProfile.cgpa,
        headline:        updatedProfile.headline,
        avatar:          updatedProfile.avatar,
        skills:          updatedProfile.skills,
      }));
    } catch (e) {}

    // ── STEP 2: Background DB + user-context sync (fire and forget) ───────────
    // Does NOT block the UI. Errors are caught silently since local state is
    // already updated and localStorage is already saved.
    updateProfile({
      name:            formData.fullName,
      fullName:        formData.fullName,
      username:        formData.username,
      email:           formData.email,
      phone:           formData.mobileNumber,
      mobileNumber:    formData.mobileNumber,
      dob:             formData.dob,
      gender:          formData.gender,
      location:        formData.location,
      address:         formData.location,
      university:      formData.university,
      branch:          formData.branch,
      specialization:  formData.specialization,
      year:            formData.year,
      division:        formData.division,
      prnNumber:       formData.prnNumber,
      selectedDomain:  formData.selectedDomain,
      skills:          formData.skills,
      experienceLevel: formData.experienceLevel,
      bio:             formData.bio,
      githubUrl:       formData.githubUrl,
      linkedinUrl:     formData.linkedinUrl,
      portfolioUrl:    formData.portfolioUrl,
      graduationYear:  formData.graduationYear,
      cgpa:            formData.cgpa,
      avatar:          formData.avatar || profileData.avatar,
      headline:        formData.selectedDomain || formData.branch || 'Full Stack Developer',
      lastUpdated:     'Just now'
    }).catch(err => console.warn('Background profile sync error (UI already updated):', err));
  };

  useEffect(() => {
    let savedLocal = {};
    try {
      const raw = localStorage.getItem('nexus_user');
      if (raw) savedLocal = JSON.parse(raw);
    } catch (e) {}

    const curr = user || savedLocal;
    if (curr) {
      setProfileData(buildProfileData({ ...savedLocal, ...curr }));
    }
  }, [user]);

  // Load official projects from dataStore
  useEffect(() => {
    if (user?.id) {
      getProjects(user.id).then(official => {
        if (official && official.length > 0) {
          setProfileData(prev => ({ ...prev, projects: official }));
        }
      });
    }
  }, [user?.id]);

  // Image Upload handler (Permanent Base64 Data URL)
  const handleImageUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [type]: true }));

    // Helper to read file as permanent Base64 Data URL
    const readAsBase64 = (fileObj) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(fileObj);
      });
    };

    try {
      const base64Data = await readAsBase64(file);

      // Attempt Cloudinary upload if available
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'nexus_uploads');
        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dseg9nty3'}/image/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.secure_url) {
          await updateProfile({ [type]: data.secure_url });
          setProfileData(prev => ({ ...prev, [type]: data.secure_url }));
          setDraftProfile(prev => ({ ...prev, [type]: data.secure_url }));
          return;
        }
      } catch (cloudErr) {
        console.info("Cloudinary upload fallback to permanent base64 data URL");
      }

      // Permanent local base64 fallback (never expires on refresh)
      await updateProfile({ [type]: base64Data });
      setProfileData(prev => ({ ...prev, [type]: base64Data }));
      setDraftProfile(prev => ({ ...prev, [type]: base64Data }));
    } catch (err) {
      console.error("Image upload error:", err);
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  // Save Edit Profile
  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name: draftProfile.name,
        headline: draftProfile.headline,
        location: draftProfile.location,
        skills: draftProfile.skills,
      });
      setProfileData({ ...draftProfile });
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Save profile error:", err);
    }
  };

  // Add Tech Skill
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const item = { name: newSkillName.trim(), icon: '⚡' };
    const updated = [...draftProfile.skills, item];
    setDraftProfile(prev => ({ ...prev, skills: updated }));
    setProfileData(prev => ({ ...prev, skills: updated }));
    updateProfile({ skills: updated });
    setNewSkillName('');
  };

  // Remove Tech Skill
  const handleRemoveSkill = (idx) => {
    const updated = draftProfile.skills.filter((_, i) => i !== idx);
    setDraftProfile(prev => ({ ...prev, skills: updated }));
    setProfileData(prev => ({ ...prev, skills: updated }));
    updateProfile({ skills: updated });
  };

  // Calculations
  const completedProjects = (profileData.projects || []).filter(p => p.status === 'completed');
  const ongoingProjects = (profileData.projects || []).filter(p => p.status === 'ongoing');

  const stats = [
    { label: 'TOTAL XP', value: user?.xp || 0, icon: Target },
    { label: 'ACCURACY', value: user?.results?.length ? Math.round(user.results.reduce((a, r) => a + (r.percentage || 0), 0) / user.results.length) + '%' : 'N/A', icon: Code2 },
    { label: 'STREAK', value: (user?.streak || 0) + 'd', icon: Zap },
    { label: 'SUBMISSIONS', value: user?.results?.length || 0, icon: Award }
  ];

  const cardStyle = {
    backgroundColor: isDark ? '#0d0f1a' : '#ffffff',
    border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
    borderRadius: '28px',
    boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.03)',
    boxSizing: 'border-box',
    overflow: 'hidden'
  };

  if (isEditModalOpen) {
    return (
      <EditProfileView
        isDark={isDark}
        user={user}
        profileData={profileData}
        onSave={handleSaveFullProfile}
        onClose={() => setIsEditModalOpen(false)}
        toggleTheme={toggleTheme}
        theme={theme}
      />
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '1240px', margin: '0 auto', padding: '0 16px 40px 16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* ── BREADCRUMB HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' }}>
        <span>Dashboard</span>
        <span>›</span>
        <span style={{ color: isDark ? '#f8fafc' : '#0f172a', fontWeight: 800 }}>Profile</span>
      </div>

      {/* ── TOP BANNER CARD ── */}
      <div style={{
        ...cardStyle,
        padding: '24px',
        position: 'relative',
        background: isDark
          ? 'linear-gradient(135deg, #121625 0%, #0d0f1a 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #fcfaff 100%)',
        border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {/* Subtle Isometric Hexagon SVG Background Overlay on Right */}
        <svg style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%', opacity: isDark ? 0.08 : 0.15, pointerEvents: 'none' }} viewBox="0 0 400 200">
          <polygon points="200,20 240,40 240,80 200,100 160,80 160,40" fill="none" stroke="#7b5cff" strokeWidth="1.5" />
          <polygon points="280,60 320,80 320,120 280,140 240,120 240,80" fill="none" stroke="#7b5cff" strokeWidth="1.5" />
          <polygon points="120,60 160,80 160,120 120,140 80,120 80,80" fill="none" stroke="#7b5cff" strokeWidth="1.5" />
          <polygon points="200,100 240,120 240,160 200,180 160,160 160,120" fill="none" stroke="#7b5cff" strokeWidth="1.5" />
          <polygon points="360,20 400,40 400,80 360,100 320,80 320,40" fill="none" stroke="#7b5cff" strokeWidth="1.5" />
        </svg>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', zIndex: 2 }}>
          {/* Avatar with Camera Icon Badge */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%',
              backgroundColor: '#7b5cff', color: '#ffffff', fontSize: '38px', fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(123, 92, 255, 0.25)',
              border: `3px solid ${isDark ? '#1e293b' : '#ffffff'}`
            }}>
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                (profileData.name || 'N').charAt(0).toUpperCase()
              )}
            </div>
            <label style={{
              position: 'absolute', bottom: '2px', right: '2px', width: '28px', height: '28px',
              borderRadius: '50%', backgroundColor: '#ffffff', color: '#0f172a',
              border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}>
              <Camera size={13} />
              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
            </label>
          </div>

          {/* User Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0, lineHeight: 1.1 }}>
                {profileData.name}
              </h2>
              <span style={{
                padding: '4px 10px', borderRadius: '999px',
                backgroundColor: isDark ? 'rgba(123, 92, 255, 0.2)' : '#f3e8ff',
                border: `1px solid ${isDark ? 'rgba(123, 92, 255, 0.3)' : '#e9d5ff'}`,
                color: '#7b5cff', fontSize: '10.5px', fontWeight: 900, letterSpacing: '0.05em'
              }}>
                {user?.isAdmin ? 'PLATFORM ADMIN' : (profileData.selectedDomain || profileData.branch || 'NEXUS MEMBER').toUpperCase()}
              </span>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#7b5cff', margin: 0 }}>
              {profileData.headline || profileData.selectedDomain || profileData.branch || 'Full Stack Developer'}
            </p>
            {profileData.bio && (
              <p style={{ fontSize: '13px', fontWeight: 500, color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>
                {profileData.bio}
              </p>
            )}

            {/* Contact Glass Badges Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', flexWrap: 'wrap', fontSize: '12px', fontWeight: 600 }}>
              {profileData.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '12px', backgroundColor: isDark ? 'rgba(123, 92, 255, 0.12)' : '#f3e8ff', border: `1px solid ${isDark ? 'rgba(123, 92, 255, 0.25)' : '#e9d5ff'}`, color: isDark ? '#c4b5fd' : '#6b21a8' }}>
                  <MapPin size={13} style={{ color: '#7b5cff' }} />
                  <span>{profileData.location}</span>
                </div>
              )}
              {profileData.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '12px', backgroundColor: isDark ? 'rgba(123, 92, 255, 0.12)' : '#f3e8ff', border: `1px solid ${isDark ? 'rgba(123, 92, 255, 0.25)' : '#e9d5ff'}`, color: isDark ? '#c4b5fd' : '#6b21a8' }}>
                  <AtSign size={13} style={{ color: '#7b5cff' }} />
                  <span>{profileData.email}</span>
                </div>
              )}
              {profileData.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '12px', backgroundColor: isDark ? 'rgba(123, 92, 255, 0.12)' : '#f3e8ff', border: `1px solid ${isDark ? 'rgba(123, 92, 255, 0.25)' : '#e9d5ff'}`, color: isDark ? '#c4b5fd' : '#6b21a8' }}>
                  <Phone size={13} style={{ color: '#7b5cff' }} />
                  <span>{profileData.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button
          onClick={() => { setDraftProfile({ ...profileData }); setIsEditModalOpen(true); }}
          style={{
            padding: '8px 18px', borderRadius: '12px',
            border: '1.5px solid #c084fc', backgroundColor: isDark ? 'rgba(192, 132, 252, 0.1)' : '#ffffff',
            color: '#7b5cff', fontSize: '13px', fontWeight: 800, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px', zIndex: 2
          }}
        >
          <Edit3 size={15} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* ── 5 METRIC STAT CARDS ROW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '16px', width: '100%' }}>

        {/* Stat 1: Total XP */}
        <div style={{ ...cardStyle, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ThumbsUp size={20} />
          </div>
          <div>
            <p style={{ fontSize: '10.5px', fontWeight: 800, color: isDark ? '#94a3b8' : '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total XP</p>
            <h4 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: '2px 0 0 0', lineHeight: 1 }}>
              {user?.xp ? user.xp.toLocaleString() : '0'}
            </h4>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', margin: '3px 0 0 0' }}>↑ Lifetime XP</p>
          </div>
        </div>

        {/* Stat 2: Avg Accuracy — from real aptitude results */}
        <div style={{ ...cardStyle, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#f3e8ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <PieChart size={20} />
          </div>
          <div>
            <p style={{ fontSize: '10.5px', fontWeight: 800, color: isDark ? '#94a3b8' : '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Accuracy</p>
            <h4 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: '2px 0 0 0', lineHeight: 1 }}>
              {statsLoading ? '—' : aptitudeStats.count > 0 ? `${aptitudeStats.avg}%` : 'N/A'}
            </h4>
            <p style={{ fontSize: '11px', fontWeight: 700, margin: '3px 0 0 0',
              color: accuracyTrend === null ? (isDark ? '#64748b' : '#94a3b8') : accuracyTrend >= 0 ? '#16a34a' : '#ef4444' }}>
              {accuracyTrend === null
                ? `Best: ${aptitudeStats.best}%`
                : `${accuracyTrend >= 0 ? '↑' : '↓'}${Math.abs(accuracyTrend)}% this week`}
            </p>
          </div>
        </div>

        {/* Stat 3: Current Streak — from user.streak (weeks) */}
        <div style={{ ...cardStyle, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#fff7ed', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Flame size={20} fill="#f97316" />
          </div>
          <div>
            <p style={{ fontSize: '10.5px', fontWeight: 800, color: isDark ? '#94a3b8' : '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Streak</p>
            <h4 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: '2px 0 0 0', lineHeight: 1 }}>
              {currentStreak} {currentStreak === 1 ? 'Week' : 'Weeks'}
            </h4>
            <p style={{ fontSize: '11px', fontWeight: 600, color: isDark ? '#64748b' : '#94a3b8', margin: '3px 0 0 0' }}>
              Best: {bestStreak} {bestStreak === 1 ? 'week' : 'weeks'}
            </p>
          </div>
        </div>

        {/* Stat 4: DSA Submissions (approved) — real data from DB */}
        <div style={{ ...cardStyle, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#f0fdf4', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ClipboardList size={20} />
          </div>
          <div>
            <p style={{ fontSize: '10.5px', fontWeight: 800, color: isDark ? '#94a3b8' : '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>DSA Solved</p>
            <h4 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: '2px 0 0 0', lineHeight: 1 }}>
              {statsLoading ? '—' : dsaApproved.length}
            </h4>
            <p style={{ fontSize: '11px', fontWeight: 700, color: dsaThisMonth > 0 ? '#16a34a' : (isDark ? '#64748b' : '#94a3b8'), margin: '3px 0 0 0' }}>
              {dsaThisMonth > 0 ? `↑${dsaThisMonth} this month` : `${dsaSolutions.length} total submitted`}
            </p>
          </div>
        </div>

        {/* Stat 5: Aptitude Tests — real count from results */}
        <div style={{ ...cardStyle, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#fdf2f8', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Award size={20} />
          </div>
          <div>
            <p style={{ fontSize: '10.5px', fontWeight: 800, color: isDark ? '#94a3b8' : '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aptitude Tests</p>
            <h4 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: '2px 0 0 0', lineHeight: 1 }}>
              {statsLoading ? '—' : aptitudeStats.count}
            </h4>
            <p style={{ fontSize: '11px', fontWeight: 700, color: aptitudeStats.best > 0 ? '#16a34a' : (isDark ? '#64748b' : '#94a3b8'), margin: '3px 0 0 0' }}>
              {aptitudeStats.best > 0 ? `Best: ${aptitudeStats.best}%` : '↑ Total Attempts'}
            </p>
          </div>
        </div>

      </div>

      {/* ── TABS BAR ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', borderBottom: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, paddingBottom: '8px', overflowX: 'auto' }}>
        {['Overview', 'Tech Stack', 'Activity', 'Achievements', 'Settings'].map((t) => {
          const key = t.toLowerCase().replace(' ', '');
          const isActive = activeTab === key;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(key)}
              style={{
                border: 'none', background: 'none', fontSize: '14px', fontWeight: isActive ? 800 : 600,
                color: isActive ? '#7b5cff' : (isDark ? '#94a3b8' : '#64748b'), cursor: 'pointer',
                paddingBottom: '8px', position: 'relative', whiteSpace: 'nowrap'
              }}
            >
              <span>{t}</span>
              {isActive && (
                <div style={{ position: 'absolute', bottom: '-9px', left: 0, right: 0, height: '3px', backgroundColor: '#7b5cff', borderRadius: '3px 3px 0 0' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ── 2 COLUMN MAIN CONTENT & RIGHT SIDEBAR GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px', width: '100%', alignItems: 'start' }}>
        
        {/* ── LEFT COLUMN (PERSONAL, ACADEMIC & PROFESSIONAL INFO CARDS) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minWidth: 0 }}>
          
          {/* Card 1: Personal Information */}
          <div style={{ ...cardStyle, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} style={{ color: '#7b5cff' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>Personal Information</h3>
              </div>
              <button onClick={() => { setDraftProfile({ ...profileData }); setIsEditModalOpen(true); }} style={{ padding: '6px 14px', borderRadius: '10px', border: '1px solid #c084fc', backgroundColor: 'transparent', color: '#7b5cff', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Edit3 size={13} />
                <span>Edit</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '18px 24px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>Full Name</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{profileData.name || '—'}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>Username</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{profileData.username || '—'}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>Email Address</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{profileData.email || '—'}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>Phone Number</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{profileData.phone || '—'}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>Date of Birth</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{profileData.dob || '—'}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>Gender</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{profileData.gender || '—'}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>Address</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{profileData.address || profileData.location || '—'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Academic Information */}
          <div style={{ ...cardStyle, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={18} style={{ color: '#7b5cff' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>Academic Information</h3>
              </div>
              <button onClick={() => { setDraftProfile({ ...profileData }); setIsEditModalOpen(true); }} style={{ padding: '6px 14px', borderRadius: '10px', border: '1px solid #c084fc', backgroundColor: 'transparent', color: '#7b5cff', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Edit3 size={13} />
                <span>Edit</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '18px 24px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>University</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{profileData.university || '—'}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>Branch</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{profileData.branch || '—'}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>Specialization</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{profileData.specialization || '—'}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>Year</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{profileData.year || '—'}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>Division</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{profileData.division || '—'}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>PRN Number</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{profileData.prnNumber || '—'}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>Graduation Year</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{profileData.graduationYear || '—'}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>CGPA</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{profileData.cgpa || '—'}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Professional Information */}
          <div style={{ ...cardStyle, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={18} style={{ color: '#7b5cff' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>Professional Information</h3>
              </div>
              <button onClick={() => { setDraftProfile({ ...profileData }); setIsEditModalOpen(true); }} style={{ padding: '6px 14px', borderRadius: '10px', border: '1px solid #c084fc', backgroundColor: 'transparent', color: '#7b5cff', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Edit3 size={13} />
                <span>Edit</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>Selected Domain</span>
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{profileData.selectedDomain || '—'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>Experience Level</span>
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{profileData.experienceLevel || '—'}</span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '8px' }}>Skills</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profileData.skills && profileData.skills.length > 0 ? (
                    profileData.skills.map(s => typeof s === 'string' ? s : s.name).map((sk) => (
                      <span key={sk} style={{ padding: '5px 12px', borderRadius: '10px', backgroundColor: isDark ? '#121625' : '#f1f5f9', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, fontSize: '12px', fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569' }}>
                        {sk}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '12.5px', color: isDark ? '#64748b' : '#94a3b8', fontStyle: 'italic' }}>No skills added yet</span>
                  )}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>Bio</span>
                <p style={{ fontSize: '13px', fontWeight: 500, color: isDark ? '#cbd5e1' : '#475569', margin: 0, lineHeight: 1.5 }}>
                  {profileData.bio || 'No bio provided yet.'}
                </p>
              </div>

              {/* Links Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '16px', paddingTop: '14px', borderTop: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#f1f5f9'}` }}>
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>GitHub</span>
                  {profileData.githubUrl ? (
                    <a href={profileData.githubUrl.startsWith('http') ? profileData.githubUrl : `https://${profileData.githubUrl}`} target="_blank" rel="noreferrer" style={{ fontSize: '12.5px', fontWeight: 700, color: '#7b5cff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', maxWidth: '100%' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', maxWidth: '160px' }}>
                        {profileData.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//, 'github.com/').replace(/^https?:\/\//, '')}
                      </span>
                      <ExternalLink size={12} style={{ flexShrink: 0 }} />
                    </a>
                  ) : <span style={{ fontSize: '12.5px', color: isDark ? '#64748b' : '#94a3b8' }}>Not set</span>}
                </div>

                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>LinkedIn</span>
                  {profileData.linkedinUrl ? (
                    <a href={profileData.linkedinUrl.startsWith('http') ? profileData.linkedinUrl : `https://${profileData.linkedinUrl}`} target="_blank" rel="noreferrer" style={{ fontSize: '12.5px', fontWeight: 700, color: '#7b5cff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', maxWidth: '100%' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', maxWidth: '160px' }}>
                        {profileData.linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/').replace(/^https?:\/\//, '')}
                      </span>
                      <ExternalLink size={12} style={{ flexShrink: 0 }} />
                    </a>
                  ) : <span style={{ fontSize: '12.5px', color: isDark ? '#64748b' : '#94a3b8' }}>Not set</span>}
                </div>

                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>Portfolio</span>
                  {profileData.portfolioUrl ? (
                    <a href={profileData.portfolioUrl.startsWith('http') ? profileData.portfolioUrl : `https://${profileData.portfolioUrl}`} target="_blank" rel="noreferrer" style={{ fontSize: '12.5px', fontWeight: 700, color: '#7b5cff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', maxWidth: '100%' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', maxWidth: '160px' }}>
                        {profileData.portfolioUrl.replace(/^https?:\/\//, '')}
                      </span>
                      <ExternalLink size={12} style={{ flexShrink: 0 }} />
                    </a>
                  ) : <span style={{ fontSize: '12.5px', color: isDark ? '#64748b' : '#94a3b8' }}>Not set</span>}
                </div>

                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px' }}>Resume / Website</span>
                  {profileData.resumeUrl || profileData.portfolioUrl ? (
                    <a href={(profileData.resumeUrl || profileData.portfolioUrl).startsWith('http') ? (profileData.resumeUrl || profileData.portfolioUrl) : `https://${profileData.resumeUrl || profileData.portfolioUrl}`} target="_blank" rel="noreferrer" style={{ fontSize: '12.5px', fontWeight: 700, color: '#7b5cff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', maxWidth: '100%' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', maxWidth: '160px' }}>
                        {profileData.resumeUrl ? 'View Resume' : 'View Portfolio'}
                      </span>
                      <ExternalLink size={12} style={{ flexShrink: 0 }} />
                    </a>
                  ) : <span style={{ fontSize: '12.5px', color: isDark ? '#64748b' : '#94a3b8' }}>Not set</span>}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN SIDEBAR STACK ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '340px' }}>
          
          {/* Card 1: Account Information */}
          <div style={{ ...cardStyle, padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 16px 0' }}>Account Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' }}>User ID</span>
                <span style={{ fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155' }}>{profileData.prnNumber || user?.id?.slice(0, 12).toUpperCase() || '—'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' }}>Member Since</span>
                <span style={{ fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155' }}>{profileData.joined || 'May 2026'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' }}>Last Updated</span>
                <span style={{ fontWeight: 800, color: profileData.lastUpdated ? '#16a34a' : (isDark ? '#94a3b8' : '#64748b') }}>
                  {profileData.lastUpdated || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Tech Stack */}
          <div style={{ ...cardStyle, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>Tech Stack</h3>
              <button onClick={() => setIsTechStackModalOpen(true)} style={{ padding: '5px 12px', borderRadius: '8px', border: '1px solid #c084fc', backgroundColor: 'transparent', color: '#7b5cff', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Edit3 size={12} />
                <span>Edit</span>
              </button>
            </div>

            {/* Dynamic Grid of Tech Icon Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
              {(() => {
                const rawSkills = profileData.skills && profileData.skills.length > 0
                  ? profileData.skills.map(s => typeof s === 'string' ? s : s.name)
                  : ['React', 'Node', 'Next.js', 'TypeScript', 'Tailwind'];
                const displaySkills = rawSkills.slice(0, 9);
                const hasMore = rawSkills.length > 9;
                return (
                  <>
                    {displaySkills.map((t, idx) => (
                      <div key={idx} title={t} style={{
                        height: '44px', borderRadius: '12px',
                        backgroundColor: isDark ? '#121625' : '#f8fafc',
                        border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}>
                        <TechLogo name={t} />
                      </div>
                    ))}
                    {hasMore && (
                      <div title={`${rawSkills.length - 9} more skills`} style={{
                        height: '44px', borderRadius: '12px',
                        backgroundColor: isDark ? '#121625' : '#f8fafc',
                        border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 900, color: '#7b5cff'
                      }}>
                        +{rawSkills.length - 9}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

        </div>

      </div>

      {/* ── PAGE FOOTER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '24px', borderTop: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, fontSize: '12px', color: isDark ? '#64748b' : '#94a3b8', fontWeight: 600 }}>
        <span>© 2026 Sun Nexus Solutions. All rights reserved.</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="#" style={{ color: isDark ? '#64748b' : '#94a3b8', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: isDark ? '#64748b' : '#94a3b8', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#" style={{ color: isDark ? '#64748b' : '#94a3b8', textDecoration: 'none' }}>Help & Support</a>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* 4. MODALS (EDIT PROFILE, TECH STACK, PROJECTS, ACTIVITY)                  */}
      {/* ════════════════════════════════════════════════════════════════════════ */}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '24px', maxWidth: '520px', width: '100%', padding: '28px', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.2)' : '#e2e8f0'}`, boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>Edit Profile Details</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ border: 'none', background: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', display: 'block', marginBottom: '6px' }}>Display Name</label>
                <input value={draftProfile.name} onChange={e => setDraftProfile({ ...draftProfile, name: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${isDark ? 'rgba(148,163,184,0.2)' : '#cbd5e1'}`, backgroundColor: isDark ? '#0d0f1a' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a', fontSize: '14px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', display: 'block', marginBottom: '6px' }}>Role / Headline</label>
                <input value={draftProfile.headline} onChange={e => setDraftProfile({ ...draftProfile, headline: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${isDark ? 'rgba(148,163,184,0.2)' : '#cbd5e1'}`, backgroundColor: isDark ? '#0d0f1a' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a', fontSize: '14px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', display: 'block', marginBottom: '6px' }}>Location</label>
                <input value={draftProfile.location} onChange={e => setDraftProfile({ ...draftProfile, location: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${isDark ? 'rgba(148,163,184,0.2)' : '#cbd5e1'}`, backgroundColor: isDark ? '#0d0f1a' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a', fontSize: '14px', outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button onClick={() => setIsEditModalOpen(false)} style={{ padding: '10px 18px', borderRadius: '12px', border: `1px solid ${isDark ? 'rgba(148,163,184,0.2)' : '#cbd5e1'}`, background: 'none', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSaveProfile} style={{ padding: '10px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)', color: '#ffffff', border: 'none', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Tech Stack Modal */}
      {isTechStackModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '24px', maxWidth: '520px', width: '100%', padding: '28px', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.2)' : '#e2e8f0'}`, boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>Manage Tech Stack</h3>
              <button onClick={() => setIsTechStackModalOpen(false)} style={{ border: 'none', background: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {/* Add new skill */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input value={newSkillName} onChange={e => setNewSkillName(e.target.value)} placeholder="e.g. Next.js, Rust, Go..." style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: `1px solid ${isDark ? 'rgba(148,163,184,0.2)' : '#cbd5e1'}`, backgroundColor: isDark ? '#0d0f1a' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a', fontSize: '13.5px', outline: 'none' }} />
              <button onClick={handleAddSkill} style={{ padding: '10px 16px', borderRadius: '10px', background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)', color: '#ffffff', border: 'none', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={16} /> Add
              </button>
            </div>

            {/* Skills Pills with Remove */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {draftProfile.skills.map((sk, idx) => {
                const name = typeof sk === 'string' ? sk : sk.name;
                return (
                  <div key={idx} style={{ padding: '6px 14px', borderRadius: '999px', backgroundColor: isDark ? '#0d0f1a' : '#f1f5f9', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, fontSize: '12.5px', fontWeight: 700, color: isDark ? '#e2e8f0' : '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TechLogo name={name} />
                    <span>{name}</span>
                    <button onClick={() => handleRemoveSkill(idx)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}><X size={14} /></button>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: 'right', marginTop: '10px' }}>
              <button onClick={() => setIsTechStackModalOpen(false)} style={{ padding: '10px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 100%)', color: '#ffffff', border: 'none', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Items Modal */}
      {isProjectsModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '24px', maxWidth: '600px', width: '100%', padding: '28px', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.2)' : '#e2e8f0'}`, boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '80vh', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0, textTransform: 'capitalize' }}>
                {selectedProjectType === 'completed' ? '🏆 Completed Projects' : '⚡ Ongoing Developments'}
              </h3>
              <button onClick={() => setIsProjectsModalOpen(false)} style={{ border: 'none', background: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
              {(selectedProjectType === 'completed' ? completedProjects : ongoingProjects).length === 0 ? (
                <p style={{ textAlign: 'center', color: isDark ? '#94a3b8' : '#64748b', padding: '20px', fontStyle: 'italic' }}>No projects found in this category.</p>
              ) : (
                (selectedProjectType === 'completed' ? completedProjects : ongoingProjects).map((p, i) => (
                  <div key={i} style={{ padding: '16px', borderRadius: '16px', backgroundColor: isDark ? '#0d0f1a' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}` }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 6px 0' }}>{p.title}</h4>
                    <p style={{ fontSize: '12.5px', color: isDark ? '#94a3b8' : '#64748b', margin: 0, lineHeight: 1.5 }}>{p.desc || p.description || 'Project details.'}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {isActivityModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '24px', maxWidth: '540px', width: '100%', padding: '28px', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.2)' : '#e2e8f0'}`, boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '80vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>⚡ Full Activity History</h3>
              <button onClick={() => setIsActivityModalOpen(false)} style={{ border: 'none', background: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '4px' }}>
              {activityList.map((act) => {
                const IconComp = act.icon;
                return (
                  <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', padding: '14px 16px', borderRadius: '16px', backgroundColor: isDark ? '#0d0f1a' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: act.bg, color: act.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <IconComp size={18} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>{act.title}</h4>
                        <p style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', margin: '2px 0 0 0' }}>{act.desc}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: act.color, whiteSpace: 'nowrap' }}>{act.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Modal */}
      {isAchievementsModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '24px', maxWidth: '540px', width: '100%', padding: '28px', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.2)' : '#e2e8f0'}`, boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '80vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>🏆 Earned Achievements & Badges</h3>
              <button onClick={() => setIsAchievementsModalOpen(false)} style={{ border: 'none', background: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '4px' }}>
              {achievementsList.map((ach) => {
                const IconComp = ach.icon;
                return (
                  <div key={ach.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '16px', backgroundColor: isDark ? '#0d0f1a' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: ach.bg, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <IconComp size={20} fill="#ffffff" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>{ach.title}</h4>
                        <p style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', margin: '2px 0 0 0' }}>{ach.desc}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#7b5cff', whiteSpace: 'nowrap' }}>{ach.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
