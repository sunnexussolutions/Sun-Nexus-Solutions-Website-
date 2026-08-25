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
    const getApiBaseUrl = () => (['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:') ? 'http://localhost:3000' : '';

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanId, password })
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        let localMatch = {};
        try {
          const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
          const m = localUsers.find(u => u.id === data.user.id || (u.email && data.user.email && u.email.toLowerCase() === data.user.email.toLowerCase()));
          if (m) localMatch = m;
        } catch (e) {}

        const u = {
          ...data.user,
          ...localMatch,
          firstName: data.user.firstName || data.user.first_name || localMatch.firstName || data.user.name?.split(' ')[0] || 'User',
          lastName: data.user.lastName || data.user.last_name || localMatch.lastName || '',
          name: data.user.name || `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim() || 'Nexus User',
          avatar: localMatch.avatar || data.user.avatar || '',
          banner: localMatch.banner || data.user.banner || '',
          skills: localMatch.skills || data.user.skills,
          projects: localMatch.projects || data.user.projects,
          isAdmin: !!(data.user.isAdmin || data.user.is_admin || localMatch.isAdmin),
          status: 'active',
          joinedAt: data.user.joinedAt || data.user.joined_at || localMatch.joinedAt || new Date().toISOString()
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

      if (res.status === 403 && data.message?.includes('pending')) {
        setLoading(false);
        return { success: false, pending: true, error: data.message };
      }

      if (data.isLocked) {
        setLoading(false);
        return {
          success: false,
          isLocked: true,
          lockedUntil: data.lockedUntil,
          remainingSeconds: data.remainingSeconds,
          attemptsRemaining: 0,
          error: data.message || 'Too many incorrect attempts. Login temporarily locked.'
        };
      }

      setLoading(false);
      return {
        success: false,
        isLocked: false,
        attemptsRemaining: data.attemptsRemaining,
        error: data.message || 'Incorrect email or password.'
      };
    } catch (err) {
      console.warn("REST login endpoint unreachable, attempting direct database/local fallback:", err.message);

      // Fallback 1: Admin Master Bypass
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
        setLoading(false);
        return { success: true, user: adminUser };
      }

      // Fallback 2: Check Cloud Hub DB (Neon PostgreSQL) directly or LocalStorage
      try {
        let found = null;
        try {
          const cloud = await query('SELECT * FROM profiles WHERE LOWER(email) = $1 OR LOWER(username) = $2', [cleanId, cleanId]);
          if (cloud && cloud.length > 0) found = cloud[0];
        } catch (e) {}

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
          const currentStatus = found.status || 'active';
          if (currentStatus === 'pending') {
            setLoading(false);
            return { success: false, pending: true, error: 'You are registered and waiting for Admin approval...' };
          }
          if (found.password === password || !found.password) {
            const u = {
              ...found,
              firstName: found.first_name || found.firstName || found.name?.split(' ')[0] || 'User',
              lastName: found.last_name || found.lastName || '',
              isAdmin: !!(found.is_admin || found.isAdmin),
              status: 'active',
              joinedAt: found.joined_at || found.joinedAt || new Date().toISOString()
            };
            const processed = await applyStreakToUser(u);
            setUser(processed);
            setIsAuthenticated(true);
            localStorage.setItem('nexus_user', JSON.stringify(processed));
            setLoading(false);
            return { success: true, user: processed };
          }
        }
      } catch (fbErr) {}

      setLoading(false);
      return { success: false, error: 'Incorrect email or password.' };
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
    if (!user) return { success: false, error: 'No user session' };

    const getApiBaseUrl = () => {
      const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:';
      return isLocal ? 'http://localhost:3000' : '';
    };

    const targetName = updates.name || updates.fullName || (updates.firstName ? `${updates.firstName} ${updates.lastName || ''}`.trim() : user.name);

    const updated = { 
      ...user, 
      ...updates,
      name: targetName,
      fullName: targetName,
      firstName: updates.firstName || user.firstName || (targetName ? targetName.split(' ')[0] : ''),
      lastName: updates.lastName || user.lastName || (targetName ? targetName.split(' ').slice(1).join(' ') : ''),
    };

    // 1. Immediate Optimistic Update
    setUser(updated);
    localStorage.setItem('nexus_user', JSON.stringify(updated));

    // Update local users storage
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

    window.dispatchEvent(new Event('nexus-user-updated'));
    window.dispatchEvent(new Event('nexus-data-updated'));

    // 2. REST API & Neon DB Update
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(user.id || user.email || ''),
          'x-user-role': user.isAdmin ? 'admin' : 'member'
        },
        body: JSON.stringify(updates)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const u = data.user;
          const cloudUpdated = {
            ...updated,
            ...u,
            firstName:       u.first_name       || updated.firstName,
            lastName:        u.last_name        || updated.lastName,
            name:            u.name             || updated.name,
            avatar:          u.avatar           !== undefined ? u.avatar : updated.avatar,
            banner:          u.banner           || updated.banner,
            skills:          typeof u.skills === 'string' ? JSON.parse(u.skills) : (u.skills || updated.skills),
            phone:           u.phone            || updated.phone,
            mobileNumber:    u.phone            || updated.mobileNumber,
            dob:             u.dob              || updated.dob,
            gender:          u.gender           || updated.gender,
            university:      u.university       || updated.university,
            branch:          u.branch           || updated.branch,
            specialization:  u.specialization   || updated.specialization,
            year:            u.year             || updated.year,
            division:        u.division         || updated.division,
            prnNumber:       u.prn_number       || updated.prnNumber,
            selectedDomain:  u.selected_domain  || updated.selectedDomain,
            experienceLevel: u.experience_level || updated.experienceLevel,
            bio:             u.bio              !== undefined ? u.bio : updated.bio,
            githubUrl:       u.github_url       || updated.githubUrl,
            linkedinUrl:     u.linkedin_url     || updated.linkedinUrl,
            portfolioUrl:    u.portfolio_url    || updated.portfolioUrl,
            username:        u.username         || updated.username,
            location:        u.location         || updated.location,
            headline:        u.headline         || updated.headline,
            graduationYear:  u.graduation_year  || updated.graduationYear,
            cgpa:            u.cgpa             || updated.cgpa,
          };
          setUser(cloudUpdated);
          localStorage.setItem('nexus_user', JSON.stringify(cloudUpdated));
        }
      }
    } catch (err) {
      console.warn("DB profile sync fallback:", err.message);
    }

    window.dispatchEvent(new Event('nexus-user-updated'));
    window.dispatchEvent(new Event('nexus-data-updated'));
    return { success: true, user: updated };
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
