import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Edit3, Camera, Save, X, Zap, Star, Award, MapPin, Calendar,
  Layers, ChevronRight, Code2, Trophy, ArrowRight, ShieldCheck,
  CheckCircle2, Sparkles, Plus, Trash2, Loader2, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getProjects } from '../store/dataStore';

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

export default function Profile() {
  const { theme } = useTheme();
  const { user, updateProfile } = useAuth();
  const isDark = theme === 'dark';

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTechStackModalOpen, setIsTechStackModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState('completed');

  // Profile local data
  const [profileData, setProfileData] = useState({
    name: user?.name || user?.username || 'Nexus_Operator',
    headline: user?.headline || user?.role || 'Nexus Admin',
    location: user?.location || 'Global',
    joined: user?.joinedAt
      ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : 'May 2026',
    avatar: user?.avatar || '',
    banner: user?.banner || '',
    skills: user?.skills ? (typeof user.skills === 'string' ? JSON.parse(user.skills) : user.skills) : DEFAULT_TECH_STACK,
    projects: user?.projects ? (typeof user.projects === 'string' ? JSON.parse(user.projects) : user.projects) : []
  });

  const [draftProfile, setDraftProfile] = useState({ ...profileData });
  const [uploading, setUploading] = useState({ avatar: false, banner: false });
  const [newSkillName, setNewSkillName] = useState('');

  useEffect(() => {
    let savedLocal = {};
    try {
      const raw = localStorage.getItem('nexus_user');
      if (raw) savedLocal = JSON.parse(raw);
    } catch (e) {}

    const curr = user || savedLocal;

    if (curr) {
      setProfileData({
        name: curr.name || curr.username || savedLocal.name || 'Nexus_Operator',
        headline: curr.headline || curr.role || savedLocal.headline || 'Nexus Admin',
        location: curr.location || savedLocal.location || 'Global',
        joined: curr.joinedAt
          ? new Date(curr.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          : 'May 2026',
        avatar: curr.avatar || savedLocal.avatar || '',
        banner: curr.banner || savedLocal.banner || '',
        skills: curr.skills ? (typeof curr.skills === 'string' ? JSON.parse(curr.skills) : curr.skills) : (savedLocal.skills || DEFAULT_TECH_STACK),
        projects: curr.projects ? (typeof curr.projects === 'string' ? JSON.parse(curr.projects) : curr.projects) : (savedLocal.projects || [])
      });
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

  return (
    <div style={{ width: '100%', maxWidth: '1080px', margin: '0 auto', paddingBottom: '40px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* 1. MAIN PROFILE CARD (COVER BANNER + IDENTITY + 4 METRIC STATS)           */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <div style={cardStyle}>
        
        {/* Cover Banner */}
        <div style={{
          height: '190px',
          position: 'relative',
          background: profileData.banner
            ? `url(${profileData.banner}) center/cover no-repeat`
            : 'linear-gradient(135deg, #7b5cff 0%, #4f46e5 50%, #3730a3 100%)',
          overflow: 'hidden'
        }}>
          {/* Subtle grid pattern overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.6
          }} />

          {/* Banner Edit Button (Bottom Right) */}
          <label style={{
            position: 'absolute',
            bottom: '16px',
            right: '24px',
            padding: '6px 14px',
            borderRadius: '999px',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
            color: '#ffffff',
            fontSize: '11.5px',
            fontWeight: 700,
            border: '1px solid rgba(255, 255, 255, 0.25)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}>
            {uploading.banner ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} />}
            <span>Change Cover</span>
            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} />
          </label>

          {/* Edit Profile Pill Button (Top Right) */}
          <button
            onClick={() => { setDraftProfile({ ...profileData }); setIsEditModalOpen(true); }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              padding: '8px 20px',
              borderRadius: '999px',
              border: '1.5px solid rgba(255, 255, 255, 0.85)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Edit3 size={15} />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Identity & Details Section */}
        <div style={{ padding: '0 28px 24px 28px', position: 'relative' }}>
          
          {/* Avatar & Elite Member Badge Row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            
            {/* Avatar Circle */}
            <div style={{ position: 'relative', marginTop: '-60px' }}>
              <div style={{
                width: '124px',
                height: '124px',
                borderRadius: '50%',
                border: `4px solid ${isDark ? '#0d0f1a' : '#ffffff'}`,
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                background: 'linear-gradient(135deg, #7b5cff 0%, #a78bfa 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '48px',
                fontWeight: 900,
                overflow: 'hidden'
              }}>
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  (profileData.name || 'N').charAt(0).toUpperCase()
                )}
              </div>

              {/* Avatar Camera Button */}
              <label style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#7b5cff',
                color: '#ffffff',
                border: `2.5px solid ${isDark ? '#121625' : '#ffffff'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                {uploading.avatar ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
              </label>
            </div>

            {/* Elite Member Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              backgroundColor: isDark ? 'rgba(123, 92, 255, 0.18)' : '#f3e8ff',
              border: `1px solid ${isDark ? 'rgba(123, 92, 255, 0.3)' : '#e9d5ff'}`,
              color: '#7b5cff',
              fontSize: '11px',
              fontWeight: 900,
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}>
              <Star size={13} fill="#f59e0b" color="#f59e0b" />
              <span>ELITE MEMBER</span>
            </div>

          </div>

          {/* User Name & Metadata */}
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h1 style={{
              fontSize: '26px',
              fontWeight: 900,
              color: isDark ? '#f8fafc' : '#0f172a',
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              {profileData.name}
            </h1>
            <p style={{
              fontSize: '13.5px',
              fontWeight: 600,
              color: isDark ? '#94a3b8' : '#64748b',
              margin: 0
            }}>
              {profileData.headline}
            </p>

            {/* Location & Joined Date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', fontSize: '12px', fontWeight: 600, color: isDark ? '#64748b' : '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} />
                <span>{profileData.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} />
                <span>Joined {profileData.joined}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Metric Stats Grid Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          borderTop: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#f1f5f9'}`,
          backgroundColor: isDark ? '#0d0f1a' : '#fafafa'
        }}>
          {stats.map((st, idx) => (
            <div key={st.label} style={{
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: idx < stats.length - 1 ? `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#f1f5f9'}` : 'none',
              textAlign: 'center'
            }}>
              <div style={{
                color: '#7b5cff',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <st.icon size={22} />
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: 900,
                color: isDark ? '#f8fafc' : '#0f172a',
                lineHeight: 1
              }}>
                {st.value}
              </div>
              <div style={{
                fontSize: '11px',
                fontWeight: 800,
                color: isDark ? '#64748b' : '#94a3b8',
                letterSpacing: '0.08em',
                marginTop: '6px'
              }}>
                {st.label}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* 2. PROJECT HUB SECTION (MIDDLE CARD)                                     */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <div style={{ ...cardStyle, padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            backgroundColor: isDark ? 'rgba(123, 92, 255, 0.2)' : '#ede9fe',
            color: '#7b5cff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={18} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
            Project Hub
          </h3>
        </div>

        {/* 2 Sub-cards Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Sub-card 1: Completed Projects */}
          <div
            onClick={() => { setSelectedProjectType('completed'); setIsProjectsModalOpen(true); }}
            style={{
              padding: '16px 20px',
              borderRadius: '18px',
              backgroundColor: isDark ? '#0d0f1a' : '#f8fafc',
              border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
              borderLeft: '4px solid #7b5cff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? '#181d2f' : '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = isDark ? '#0d0f1a' : '#f8fafc'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                backgroundColor: '#fff7ed',
                color: '#f97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Trophy size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                  Completed Projects
                </h4>
                <p style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', margin: '2px 0 0 0' }}>
                  Projects you have successfully completed.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7b5cff', fontSize: '13px', fontWeight: 800 }}>
              <span>{completedProjects.length} Items</span>
              <ChevronRight size={16} />
            </div>
          </div>

          {/* Sub-card 2: Ongoing Developments */}
          <div
            onClick={() => { setSelectedProjectType('ongoing'); setIsProjectsModalOpen(true); }}
            style={{
              padding: '16px 20px',
              borderRadius: '18px',
              backgroundColor: isDark ? '#0d0f1a' : '#f8fafc',
              border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
              borderLeft: '4px solid #7b5cff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? '#181d2f' : '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = isDark ? '#0d0f1a' : '#f8fafc'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                backgroundColor: '#fff7ed',
                color: '#f97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Zap size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                  Ongoing Developments
                </h4>
                <p style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', margin: '2px 0 0 0' }}>
                  Projects currently in progress.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7b5cff', fontSize: '13px', fontWeight: 800 }}>
              <span>{ongoingProjects.length} Items</span>
              <ChevronRight size={16} />
            </div>
          </div>

        </div>

      </div>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* 3. BOTTOM ROW: TECH STACK & RECENT ACTIVITY (2-COLUMNS)                  */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left Card: Tech Stack */}
        <div style={{ ...cardStyle, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(123, 92, 255, 0.2)' : '#ede9fe',
                color: '#7b5cff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Code2 size={18} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                Tech Stack
              </h3>
            </div>

            {/* Badges list */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {profileData.skills.map((sk, idx) => {
                const name = typeof sk === 'string' ? sk : sk.name;
                return (
                  <div key={idx} style={{
                    padding: '7px 16px',
                    borderRadius: '999px',
                    backgroundColor: isDark ? '#0d0f1a' : '#f1f5f9',
                    border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: isDark ? '#e2e8f0' : '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}>
                    <TechLogo name={name} />
                    <span>{name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Manage Button */}
          <button
            onClick={() => setIsTechStackModalOpen(true)}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '14px',
              border: '1.5px solid #7b5cff',
              backgroundColor: 'transparent',
              color: '#7b5cff',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(123, 92, 255, 0.15)' : '#f5f3ff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Code2 size={16} />
            <span>Manage Tech Stack</span>
          </button>
        </div>

        {/* Right Card: Recent Activity */}
        <div style={{ ...cardStyle, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: '#fff7ed',
                color: '#f97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Zap size={18} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                Recent Activity
              </h3>
            </div>

            {/* Activity Item */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: '#fef3c7',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Star size={20} fill="#f59e0b" />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 2px 0' }}>
                  Welcome to Sun Nexus!
                </h4>
                <p style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', margin: '0 0 4px 0' }}>
                  Your profile has been created successfully.
                </p>
                <span style={{ fontSize: '11px', fontWeight: 600, color: isDark ? '#64748b' : '#94a3b8' }}>
                  Now
                </span>
              </div>
            </div>
          </div>

          {/* View All Button */}
          <button
            onClick={() => setIsActivityModalOpen(true)}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '14px',
              border: '1.5px solid #7b5cff',
              backgroundColor: 'transparent',
              color: '#7b5cff',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(123, 92, 255, 0.15)' : '#f5f3ff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span>View All Activity</span>
            <ArrowRight size={16} />
          </button>
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

      {/* Recent Activity Modal */}
      {isActivityModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '24px', maxWidth: '520px', width: '100%', padding: '28px', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.2)' : '#e2e8f0'}`, boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>Activity Log</h3>
              <button onClick={() => setIsActivityModalOpen(false)} style={{ border: 'none', background: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', borderRadius: '16px', backgroundColor: isDark ? '#0d0f1a' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}` }}>
              <Star size={20} fill="#f59e0b" color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 4px 0' }}>Welcome to Sun Nexus!</h4>
                <p style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>Your profile has been created successfully.</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
