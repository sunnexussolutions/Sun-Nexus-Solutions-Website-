import React, { createContext, useContext, useState, useEffect } from 'react';
import { query } from '../lib/neon';

const AuthContext = createContext();

// ── Proper Dynamic Streak Calculation Utility ─────────────────────────
export const processUserStreak = (u) => {
  if (!u || u.status === 'pending') return { updatedUser: u, streakIncreased: false, freezeUsed: false, newStreak: u?.streak || 0 };

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  const lastActive = u.lastActiveDate || u.last_active_date || null;
  let currentStreak = Number(u.streak ?? 1);
  let streakFreezeActive = !!(u.streakFreezeActive || u.streak_freeze_active);
  let newStreak = currentStreak;
  let streakIncreased = false;
  let freezeUsed = false;

  if (!lastActive) {
    newStreak = 1;
    streakIncreased = false;
  } else if (lastActive === todayStr) {
    newStreak = currentStreak > 0 ? currentStreak : 1;
    streakIncreased = false;
  } else if (lastActive === yesterdayStr) {
    newStreak = (currentStreak > 0 ? currentStreak : 0) + 1;
    streakIncreased = true;
  } else {
    if (streakFreezeActive) {
      freezeUsed = true;
      streakFreezeActive = false;
      newStreak = currentStreak > 0 ? currentStreak : 1;
    } else {
      newStreak = 1;
    }
  }

  const updatedUser = {
    ...u,
    streak: newStreak,
    lastActiveDate: todayStr,
    last_active_date: todayStr,
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
        const updated = { 
          ...u, 
          firstName: u.first_name, 
          lastName: u.last_name, 
          isAdmin: u.is_admin,
          status: u.status || 'active',
          joinedAt: u.joined_at
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
          joinedAt: new Date().toISOString()
        };
        setUser(adminUser);
        setIsAuthenticated(true);
        localStorage.setItem('nexus_user', JSON.stringify(adminUser));
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

        if (found.password === password) {
          if (currentStatus === 'suspended' || currentStatus === 'banned') {
            setLoading(false);
            return { success: false, error: 'Account has been suspended. Please contact support.' };
          }
          const u = {
            ...found,
            firstName: found.first_name || found.firstName || found.name?.split(' ')[0],
            lastName: found.last_name || found.lastName,
            isAdmin: !!(found.is_admin || found.isAdmin),
            status: 'active',
            joinedAt: found.joined_at || found.joinedAt
          };

          const processed = await applyStreakToUser(u);
          setUser(processed);
          setIsAuthenticated(true);
          localStorage.setItem('nexus_user', JSON.stringify(processed));
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

    // SENIOR DEV TIP: Use a dynamic query or COALESCE to ensure we only update what's provided
    try {
      await query(`
        UPDATE profiles 
        SET 
          first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          headline = COALESCE($3, headline),
          avatar = COALESCE($4, avatar),
          location = COALESCE($5, location),
          banner = COALESCE($6, banner),
          skills = COALESCE($7, skills),
          projects = COALESCE($8, projects),
          name = COALESCE($9, name)
        WHERE id = $10
      `, [
        updates.firstName || null, 
        updates.lastName || null, 
        updates.headline || null, 
        updates.avatar || null, 
        updates.location || null,
        updates.banner || null,
        updates.skills ? JSON.stringify(updates.skills) : null,
        updates.projects ? JSON.stringify(updates.projects) : null,
        updates.name || null,
        user.id
      ]);
    } catch (err) {
      console.error("DB_SYNC_ERROR:", err);
    }

    window.dispatchEvent(new Event('nexus-data-updated'));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('nexus_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, register, updateProfile, checkApprovalStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
