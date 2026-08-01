import React, { createContext, useContext, useState, useEffect } from 'react';
import { query } from '../lib/neon';

const AuthContext = createContext();

// ── Helper to calculate ISO Year-Week string (e.g. "2026-W30") ──────────
export const getYearWeek = (d = new Date()) => {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

// ── Helper to calculate week difference between two Year-Week strings ───
export const getWeekDiff = (w1, w2) => {
  if (!w1 || !w2) return 0;
  const [y1, wk1] = w1.split('-W').map(Number);
  const [y2, wk2] = w2.split('-W').map(Number);
  return ((y2 - y1) * 52) + (wk2 - wk1);
};

// ── Weekly Streak Calculation Utility ──────────────────────────────────
export const processUserStreak = (u) => {
  if (!u || u.status === 'pending') return { updatedUser: u, streakIncreased: false, freezeUsed: false, newStreak: u?.streak || 0 };

  const now = new Date();
  const currentWeekStr = getYearWeek(now);
  const lastActiveWeek = u.lastActiveWeek || u.last_active_week || (u.lastActiveDate ? getYearWeek(new Date(u.lastActiveDate)) : null);

  let currentStreak = Number(u.streak ?? 0);
  let streakFreezeActive = !!(u.streakFreezeActive || u.streak_freeze_active);
  let newStreak = currentStreak;
  let streakIncreased = false;
  let freezeUsed = false;

  if (!lastActiveWeek) {
    newStreak = currentStreak;
  } else {
    const diff = getWeekDiff(lastActiveWeek, currentWeekStr);
    if (diff === 0 || diff === 1) {
      newStreak = currentStreak;
    } else if (diff > 1) {
      const missedWeeks = diff - 1;
      if (streakFreezeActive && missedWeeks === 1) {
        freezeUsed = true;
        streakFreezeActive = false;
        newStreak = currentStreak;
      } else {
        newStreak = Math.max(0, currentStreak - missedWeeks);
      }
    }
  }

  const updatedUser = {
    ...u,
    streak: newStreak,
    streakFreezeActive,
    streak_freeze_active: streakFreezeActive
  };

  return { updatedUser, streakIncreased, freezeUsed, newStreak };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper to persist streak changes
  const applyStreakToUser = async (rawUser) => {
    if (!rawUser || rawUser.status === 'pending') return rawUser;

    const { updatedUser, streakIncreased, freezeUsed, newStreak } = processUserStreak(rawUser);

    localStorage.setItem('nexus_user', JSON.stringify(updatedUser));

    // Update local users array
    try {
      const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
      const idx = localUsers.findIndex(usr => usr.id === updatedUser.id || usr.email === updatedUser.email);
      if (idx !== -1) {
        localUsers[idx] = { ...localUsers[idx], ...updatedUser };
        localStorage.setItem('nexus_users', JSON.stringify(localUsers));
      }
    } catch {}

    // Async cloud sync to Neon DB
    try {
      await query(
        'UPDATE profiles SET streak = $1, last_active_date = $2 WHERE id = $3',
        [newStreak, updatedUser.lastActiveDate, updatedUser.id]
      );
    } catch (e) {
      console.warn("Streak cloud update fallback:", e.message);
    }

    return updatedUser;
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        const u = JSON.parse(savedUser);
        applyStreakToUser(u).then(processed => {
          setUser(processed);
          setIsAuthenticated(true);
          refreshProfile(processed.id).finally(() => setLoading(false));
        });
      } catch (err) {
        console.error("Failed to parse nexus_user from localStorage:", err);
        localStorage.removeItem('nexus_user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Re-sync user state when admin approves on same browser session
  useEffect(() => {
    const onUpdate = () => {
      const raw = localStorage.getItem('nexus_user');
      if (!raw) return;
      try {
        const u = JSON.parse(raw);
        setUser(u);
      } catch {}
    };
    window.addEventListener('nexus-data-updated', onUpdate);
    return () => window.removeEventListener('nexus-data-updated', onUpdate);
  }, []);

  const refreshProfile = async (id) => {
    try {
      const cloud = await query('SELECT * FROM profiles WHERE id = $1', [id]);
      if (cloud && cloud.length > 0) {
        const u = cloud[0];
        let currentSaved = {};
        try {
          const raw = localStorage.getItem('nexus_user');
          if (raw) currentSaved = JSON.parse(raw);
        } catch (e) {}

        const updated = { 
          ...currentSaved,
          ...u, 
          firstName:       u.first_name       || currentSaved.firstName,
          lastName:        u.last_name        || currentSaved.lastName,
          name:            u.name             || currentSaved.name,
          avatar:          u.avatar           || currentSaved.avatar,
          banner:          u.banner           || currentSaved.banner,
          skills:          u.skills           || currentSaved.skills,
          projects:        u.projects         || currentSaved.projects,
          isAdmin:         u.is_admin,
          status:          u.status           || 'active',
          joinedAt:        u.joined_at        || currentSaved.joinedAt,
          // Extended profile fields
          phone:           u.phone            || currentSaved.phone,
          mobileNumber:    u.phone            || currentSaved.mobileNumber,
          dob:             u.dob              || currentSaved.dob,
          gender:          u.gender           || currentSaved.gender,
          university:      u.university       || currentSaved.university,
          branch:          u.branch           || currentSaved.branch,
          specialization:  u.specialization   || currentSaved.specialization,
          year:            u.year             || currentSaved.year,
          division:        u.division         || currentSaved.division,
          prnNumber:       u.prn_number       || currentSaved.prnNumber,
          selectedDomain:  u.selected_domain  || currentSaved.selectedDomain,
          experienceLevel: u.experience_level || currentSaved.experienceLevel,
          bio:             u.bio              || currentSaved.bio,
          githubUrl:       u.github_url       || currentSaved.githubUrl,
          linkedinUrl:     u.linkedin_url     || currentSaved.linkedinUrl,
          portfolioUrl:    u.portfolio_url    || currentSaved.portfolioUrl,
          username:        u.username         || currentSaved.username,
          location:        u.location         || currentSaved.location,
          headline:        u.headline         || currentSaved.headline,
          graduationYear:  u.graduation_year  || currentSaved.graduationYear,
          cgpa:            u.cgpa             || currentSaved.cgpa,
        };
        setUser(updated);
        localStorage.setItem('nexus_user', JSON.stringify(updated));
      }
    } catch (err) {
      console.warn("Profile refresh failed or offline:", err.message);
    }
  };

  // Called by PendingApproval to check if admin approved without a full re-login
  const checkApprovalStatus = async () => {
    if (!user?.id) return false;
    try {
      const rows = await query('SELECT status FROM profiles WHERE id = $1', [user.id]);
      if (rows?.[0]?.status === 'active') {
        const updated = { ...user, status: 'active' };
        setUser(updated);
        localStorage.setItem('nexus_user', JSON.stringify(updated));
        return true;
      }
      // Also check by email in case id format differs
      if (user.email) {
        const byEmail = await query('SELECT status FROM profiles WHERE LOWER(email) = $1', [user.email.toLowerCase()]);
        if (byEmail?.[0]?.status === 'active') {
          const updated = { ...user, status: 'active' };
          setUser(updated);
          localStorage.setItem('nexus_user', JSON.stringify(updated));
          return true;
        }
      }
    } catch {
      try {
        const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
        const found = localUsers.find(u => u.id === user.id || u.email === user.email);
        if (found?.status === 'active') {
          const updated = { ...user, status: 'active' };
          setUser(updated);
          localStorage.setItem('nexus_user', JSON.stringify(updated));
          return true;
        }
      } catch {}
    }
    return false;
  };

  const login = async (identifier, password) => {
    setLoading(true);
    const cleanId = (identifier || '').trim().toLowerCase();

    try {
      // 1. Admin Master Bypass
      if ((cleanId === 'admin@nexus.com' || cleanId === 'admin') && (password === 'admin123' || password === 'admin')) {
        let savedAdmin = {};
        try {
          const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
          const match = localUsers.find(u => u.id === 'admin_master' || (u.email && u.email.toLowerCase() === 'admin@nexus.com'));
          if (match) savedAdmin = match;
        } catch (e) {}

        const adminUser = {
          id: 'admin_master',
          email: 'admin@nexus.com',
          username: 'admin',
          firstName: 'Nexus',
          lastName: 'Admin',
          name: 'Nexus Admin',
          isAdmin: true,
          status: 'active',
          headline: 'Platform Administrator',
          joinedAt: new Date().toISOString(),
          avatar: savedAdmin.avatar || '',
          banner: savedAdmin.banner || '',
          ...savedAdmin
        };

        setUser(adminUser);
        setIsAuthenticated(true);
        localStorage.setItem('nexus_user', JSON.stringify(adminUser));

        try {
          const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
          const idx = localUsers.findIndex(u => u.id === 'admin_master' || u.email === 'admin@nexus.com');
          if (idx !== -1) localUsers[idx] = { ...localUsers[idx], ...adminUser };
          else localUsers.push(adminUser);
          localStorage.setItem('nexus_users', JSON.stringify(localUsers));
        } catch (e) {}

        setLoading(false);
        return { success: true };
      }

      // 2. Try Cloud Hub Database (Neon PostgreSQL)
      let found = null;
      try {
        const cloud = await query('SELECT * FROM profiles WHERE LOWER(email) = $1 OR LOWER(username) = $2', [cleanId, cleanId]);
        if (cloud && cloud.length > 0) {
          found = cloud[0];
        }
      } catch (cloudErr) {
        console.warn("Cloud login check failed:", cloudErr.message);
      }

      // Local storage fallback for local users
      if (!found) {
        try {
          const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
          found = localUsers.find(u => 
            (u.email && u.email.toLowerCase() === cleanId) || 
            (u.username && u.username.toLowerCase() === cleanId)
          );
        } catch (e) {}
      }

      if (found) {
        // Always use the DB status (most up-to-date), fall back to found.status
        const currentStatus = found.status || 'active';

        if (currentStatus === 'pending') {
          const pendingUser = {
            ...found,
            firstName: found.first_name || found.firstName || found.name?.split(' ')[0],
            lastName: found.last_name || found.lastName,
            isAdmin: false,
            status: 'pending'
          };
          setUser(pendingUser);
          setIsAuthenticated(true);
          localStorage.setItem('nexus_user', JSON.stringify(pendingUser));
          setLoading(false);
          return { success: false, pending: true, error: 'You are registered and waiting for Admin approval...' };
        }

        if (found.password === password || !found.password) {
          if (currentStatus === 'suspended' || currentStatus === 'banned') {
            setLoading(false);
            return { success: false, error: 'Account has been suspended. Please contact support.' };
          }

          let localMatch = {};
          try {
            const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
            const m = localUsers.find(u => u.id === found.id || (u.email && found.email && u.email.toLowerCase() === found.email.toLowerCase()));
            if (m) localMatch = m;
          } catch (e) {}

          const u = {
            ...found,
            ...localMatch,
            firstName: found.first_name || found.firstName || localMatch.firstName || found.name?.split(' ')[0],
            lastName: found.last_name || found.lastName || localMatch.lastName,
            avatar: localMatch.avatar || found.avatar || '',
            banner: localMatch.banner || found.banner || '',
            skills: localMatch.skills || found.skills,
            projects: localMatch.projects || found.projects,
            isAdmin: !!(found.is_admin || found.isAdmin || localMatch.isAdmin),
            status: 'active',
            joinedAt: found.joined_at || found.joinedAt || localMatch.joinedAt
          };

          const processed = await applyStreakToUser(u);
          setUser(processed);
          setIsAuthenticated(true);
          localStorage.setItem('nexus_user', JSON.stringify(processed));

          try {
            const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
            const idx = localUsers.findIndex(usr => usr.id === processed.id || usr.email === processed.email);
            if (idx !== -1) localUsers[idx] = { ...localUsers[idx], ...processed };
            else localUsers.push(processed);
            localStorage.setItem('nexus_users', JSON.stringify(localUsers));
          } catch (e) {}

          setLoading(false);
          return { success: true };
        }
      }

      setLoading(false);
      return { success: false, error: 'Identity check failed. Please verify your email/username and password.' };
    } catch (err) {
      console.error("LOGIN_ERROR:", err);
      setLoading(false);
      return { success: false, error: 'Authentication error occurred. Please try again.' };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    const id = `user_${Date.now()}`;
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    const cleanUsername = (userData.username || cleanEmail.split('@')[0]).trim().toLowerCase();
    const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || cleanUsername;

    const newUser = {
      id,
      email: cleanEmail,
      username: cleanUsername,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      name: fullName,
      password: userData.password,
      isAdmin: false,
      status: 'pending',
      joinedAt: new Date().toISOString(),
      xp: 0,
      streak: 1
    };

    // Save to local storage users list as well for fallback
    try {
      const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
      const updatedLocal = [...localUsers.filter(u => u.email !== cleanEmail && u.username !== cleanUsername), newUser];
      localStorage.setItem('nexus_users', JSON.stringify(updatedLocal));
    } catch (e) {}

    // 1. Check if user already exists in cloud
    try {
      const existing = await query('SELECT id FROM profiles WHERE LOWER(email) = $1 OR LOWER(username) = $2', [cleanEmail, cleanUsername]);
      if (existing && existing.length > 0) {
        setLoading(false);
        return { success: false, error: 'An account with this email or username already exists.' };
      }
    } catch (err) {
      console.warn("Cloud check failed during registration:", err.message);
    }

    // 2. Insert into cloud database directly
    try {
      await query(`
        INSERT INTO profiles (id, email, first_name, last_name, name, username, password, is_admin, status, joined_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [id, cleanEmail, userData.firstName, userData.lastName, fullName, cleanUsername, userData.password, false, 'pending', newUser.joinedAt]);

      // Add registration pending notification for the user
      await query(`
        INSERT INTO notifications (id, user_id, title, message, type)
        VALUES ($1, $2, $3, $4, $5)
      `, [crypto.randomUUID(), id, 'Registration Pending', 'You are registered and waiting for Admin approval...', 'info']);
    } catch (cloudErr) {
      console.warn("Cloud signup sync error (saved locally):", cloudErr.message);
    }

    // Do NOT set session — user must wait for admin approval before logging in
    setLoading(false);
    return { success: true, pending: true };
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('nexus_user', JSON.stringify(updated));

    // Update or Insert in local users array for persistent local storage across logouts
    try {
      const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
      const targetId = updated.id;
      const targetEmail = updated.email?.toLowerCase();
      const idx = localUsers.findIndex(usr => 
        (targetId && usr.id === targetId) || 
        (targetEmail && usr.email && usr.email.toLowerCase() === targetEmail)
      );
      if (idx !== -1) {
        localUsers[idx] = { ...localUsers[idx], ...updated };
      } else {
        localUsers.push(updated);
      }
      localStorage.setItem('nexus_users', JSON.stringify(localUsers));
    } catch (e) {}

    window.dispatchEvent(new Event('nexus-data-updated'));

    // Sync ALL profile fields to DB using COALESCE so we only overwrite what's provided
    try {
      await query(`
        UPDATE profiles 
        SET 
          first_name        = COALESCE($1,  first_name),
          last_name         = COALESCE($2,  last_name),
          headline          = COALESCE($3,  headline),
          avatar            = COALESCE($4,  avatar),
          location          = COALESCE($5,  location),
          banner            = COALESCE($6,  banner),
          skills            = COALESCE($7,  skills),
          projects          = COALESCE($8,  projects),
          name              = COALESCE($9,  name),
          phone             = COALESCE($10, phone),
          dob               = COALESCE($11, dob),
          gender            = COALESCE($12, gender),
          university        = COALESCE($13, university),
          branch            = COALESCE($14, branch),
          specialization    = COALESCE($15, specialization),
          year              = COALESCE($16, year),
          division          = COALESCE($17, division),
          prn_number        = COALESCE($18, prn_number),
          selected_domain   = COALESCE($19, selected_domain),
          experience_level  = COALESCE($20, experience_level),
          bio               = COALESCE($21, bio),
          github_url        = COALESCE($22, github_url),
          linkedin_url      = COALESCE($23, linkedin_url),
          portfolio_url     = COALESCE($24, portfolio_url),
          username          = COALESCE($25, username),
          graduation_year   = COALESCE($26, graduation_year),
          cgpa              = COALESCE($27, cgpa)
        WHERE id = $28
      `, [
        updates.firstName || null,
        updates.lastName  || null,
        updates.headline  || null,
        updates.avatar    || null,
        updates.location  || null,
        updates.banner    || null,
        updates.skills    ? JSON.stringify(updates.skills)   : null,
        updates.projects  ? JSON.stringify(updates.projects) : null,
        updates.name      || null,
        updates.phone     || updates.mobileNumber || null,
        updates.dob       || null,
        updates.gender    || null,
        updates.university       || null,
        updates.branch           || null,
        updates.specialization   || null,
        updates.year             || null,
        updates.division         || null,
        updates.prnNumber        || null,
        updates.selectedDomain   || null,
        updates.experienceLevel  || null,
        updates.bio              || null,
        updates.githubUrl        || null,
        updates.linkedinUrl      || null,
        updates.portfolioUrl     || null,
        updates.username         || null,
        updates.graduationYear   || null,
        updates.cgpa             || null,
        user.id
      ]);
    } catch (err) {
      // DB columns may not all exist yet — this is a graceful fallback
      console.warn("DB_SYNC partial error (some columns may not exist yet):", err.message);
    }

    window.dispatchEvent(new Event('nexus-data-updated'));
    return { success: true };
  };

  const loginWithGoogle = async (googleData) => {
    setLoading(true);
    const email = (googleData.email || '').trim().toLowerCase();
    const googleId = googleData.sub || googleData.id || `google_${Date.now()}`;
    const firstName = googleData.given_name || googleData.firstName || googleData.name?.split(' ')[0] || 'User';
    const lastName = googleData.family_name || googleData.lastName || googleData.name?.split(' ').slice(1).join(' ') || '';
    const fullName = googleData.name || `${firstName} ${lastName}`.trim();
    const avatar = googleData.picture || googleData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`;

    try {
      // 1. Check Cloud Database (Neon PostgreSQL)
      let found = null;
      try {
        const cloud = await query('SELECT * FROM profiles WHERE LOWER(email) = $1', [email]);
        if (cloud && cloud.length > 0) {
          found = cloud[0];
        }
      } catch (cloudErr) {
        console.warn("Cloud Google check fallback:", cloudErr.message);
      }

      // Local storage fallback
      if (!found) {
        try {
          const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
          found = localUsers.find(u => u.email && u.email.toLowerCase() === email);
        } catch (e) {}
      }

      if (found) {
        let localMatch = {};
        try {
          const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
          const m = localUsers.find(u => u.id === found.id || (u.email && email && u.email.toLowerCase() === email));
          if (m) localMatch = m;
        } catch (e) {}

        const u = {
          ...found,
          ...localMatch,
          firstName: found.first_name || found.firstName || firstName,
          lastName: found.last_name || found.lastName || lastName,
          name: found.name || fullName,
          avatar: localMatch.avatar || found.avatar || avatar,
          banner: localMatch.banner || found.banner || '',
          skills: localMatch.skills || found.skills,
          projects: localMatch.projects || found.projects,
          isAdmin: !!(found.is_admin || found.isAdmin || localMatch.isAdmin),
          status: 'active',
          joinedAt: found.joined_at || found.joinedAt || new Date().toISOString()
        };

        const processed = await applyStreakToUser(u);
        setUser(processed);
        setIsAuthenticated(true);
        localStorage.setItem('nexus_user', JSON.stringify(processed));

        try {
          const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
          const idx = localUsers.findIndex(usr => usr.id === processed.id || usr.email === processed.email);
          if (idx !== -1) localUsers[idx] = { ...localUsers[idx], ...processed };
          else localUsers.push(processed);
          localStorage.setItem('nexus_users', JSON.stringify(localUsers));
        } catch (e) {}

        setLoading(false);
        return { success: true, user: processed };
      }

      // 2. If new user, create account via Google OAuth
      const newUser = {
        id: `usr_${googleId.slice(0, 16)}`,
        email,
        username: email.split('@')[0],
        firstName,
        lastName,
        name: fullName,
        avatar,
        isAdmin: email === 'admin@nexus.com' || email === 'admin@sunnexus.com',
        status: 'active',
        joinedAt: new Date().toISOString(),
        xp: 100,
        streak: 1,
        headline: 'Google Verified Member'
      };

      // Save locally
      try {
        const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
        const updatedLocal = [...localUsers.filter(u => u.email !== email), newUser];
        localStorage.setItem('nexus_users', JSON.stringify(updatedLocal));
      } catch (e) {}

      // Sync to cloud database
      try {
        await query(`
          INSERT INTO profiles (id, email, first_name, last_name, name, username, is_admin, status, avatar, headline, joined_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (email) DO UPDATE SET status = 'active'
        `, [
          newUser.id, newUser.email, newUser.firstName, newUser.lastName, 
          newUser.name, newUser.username, newUser.isAdmin, 'active', 
          newUser.avatar, newUser.headline, newUser.joinedAt
        ]);
      } catch (cloudErr) {
        console.warn("Cloud Google profile insert fallback:", cloudErr.message);
      }

      const processed = await applyStreakToUser(newUser);
      setUser(processed);
      setIsAuthenticated(true);
      localStorage.setItem('nexus_user', JSON.stringify(processed));
      setLoading(false);
      return { success: true, user: processed };
    } catch (err) {
      console.error("GOOGLE_AUTH_ERROR:", err);
      setLoading(false);
      return { success: false, error: 'Google Authentication failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('nexus_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, loginWithGoogle, logout, register, updateProfile, checkApprovalStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
