import React, { createContext, useContext, useState, useEffect } from 'react';
import { query } from '../lib/neon';
import { getYearWeek, getWeekDiff, processUserStreak } from '../utils/dateUtils';
import { storage } from '../store/storage/storageAdapter';
import { STORAGE_KEYS } from '../store/storage/storageKeys';

// Re-export date/streak utilities for backward compatibility
export { getYearWeek, getWeekDiff, processUserStreak };

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper to persist streak changes
  const applyStreakToUser = async (rawUser) => {
    if (!rawUser || rawUser.status === 'pending') return rawUser;

    const { updatedUser, newStreak } = processUserStreak(rawUser);

    storage.set(STORAGE_KEYS.SESSION, updatedUser);

    // Update local users array
    try {
      const localUsers = storage.get(STORAGE_KEYS.USERS, []);
      const idx = localUsers.findIndex(usr => usr.id === updatedUser.id || usr.email === updatedUser.email);
      if (idx !== -1) {
        localUsers[idx] = { ...localUsers[idx], ...updatedUser };
        storage.set(STORAGE_KEYS.USERS, localUsers, true);
      }
    } catch {}

    // Async cloud sync to Neon DB
    try {
      await query(
        'UPDATE profiles SET streak = $1, last_active_date = $2 WHERE id = $3',
        [newStreak, updatedUser.lastActiveDate, updatedUser.id]
      );
    } catch (e) {
      console.warn('[Auth] Streak cloud sync warning:', e.message);
    }

    return updatedUser;
  };

  useEffect(() => {
    const savedUser = storage.get(STORAGE_KEYS.SESSION);
    if (savedUser) {
      try {
        applyStreakToUser(savedUser).then(processed => {
          setUser(processed);
          setIsAuthenticated(true);
          refreshProfile(processed.id).finally(() => setLoading(false));
        });
      } catch (err) {
        console.error('[Auth] Failed to restore user session:', err);
        storage.remove(STORAGE_KEYS.SESSION);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Re-sync user state when data updates on same browser session
  useEffect(() => {
    const onUpdate = () => {
      const raw = storage.get(STORAGE_KEYS.SESSION);
      if (raw) {
        setUser(raw);
      }
    };
    window.addEventListener('nexus-data-updated', onUpdate);
    window.addEventListener('nexus-user-updated', onUpdate);
    return () => {
      window.removeEventListener('nexus-data-updated', onUpdate);
      window.removeEventListener('nexus-user-updated', onUpdate);
    };
  }, []);

  const refreshProfile = async (id) => {
    if (!id) return;
    try {
      const cloud = await query('SELECT * FROM profiles WHERE id = $1', [id]);
      if (cloud && cloud.length > 0) {
        const u = cloud[0];
        const currentSaved = storage.get(STORAGE_KEYS.SESSION, {});

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
          isAdmin:         !!u.is_admin,
          status:          u.status           || 'active',
          joinedAt:        u.joined_at        || currentSaved.joinedAt,
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
        storage.set(STORAGE_KEYS.SESSION, updated, true);
      }
    } catch (err) {
      console.warn('[Auth] Profile refresh fallback:', err.message);
    }
  };

  const checkApprovalStatus = async () => {
    if (!user?.id) return false;
    try {
      const rows = await query('SELECT status FROM profiles WHERE id = $1', [user.id]);
      if (rows?.[0]?.status === 'active') {
        const updated = { ...user, status: 'active' };
        setUser(updated);
        storage.set(STORAGE_KEYS.SESSION, updated);
        return true;
      }
      if (user.email) {
        const byEmail = await query('SELECT status FROM profiles WHERE LOWER(email) = $1', [user.email.toLowerCase()]);
        if (byEmail?.[0]?.status === 'active') {
          const updated = { ...user, status: 'active' };
          setUser(updated);
          storage.set(STORAGE_KEYS.SESSION, updated);
          return true;
        }
      }
    } catch {
      try {
        const localUsers = storage.get(STORAGE_KEYS.USERS, []);
        const found = localUsers.find(u => u.id === user.id || u.email === user.email);
        if (found?.status === 'active') {
          const updated = { ...user, status: 'active' };
          setUser(updated);
          storage.set(STORAGE_KEYS.SESSION, updated);
          return true;
        }
      } catch {}
    }
    return false;
  };

  const login = async (identifier, password) => {
    setLoading(true);
    const cleanId = (identifier || '').trim().toLowerCase();
    const getApiBaseUrl = () =>
      (['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:')
        ? 'http://localhost:3000'
        : '';

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanId, password })
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        const localUsers = storage.get(STORAGE_KEYS.USERS, []);
        const localMatch = localUsers.find(u => u.id === data.user.id || (u.email && data.user.email && u.email.toLowerCase() === data.user.email.toLowerCase())) || {};

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
        storage.set(STORAGE_KEYS.SESSION, processed);

        const idx = localUsers.findIndex(usr => usr.id === processed.id || usr.email === processed.email);
        if (idx !== -1) localUsers[idx] = { ...localUsers[idx], ...processed };
        else localUsers.push(processed);
        storage.set(STORAGE_KEYS.USERS, localUsers, true);

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
      console.warn('[Auth] REST login endpoint unreachable, verifying via database/local fallback:', err.message);

      // Secure Database/Local Fallback
      try {
        let found = null;
        try {
          const cloud = await query('SELECT * FROM profiles WHERE LOWER(email) = $1 OR LOWER(username) = $2', [cleanId, cleanId]);
          if (cloud && cloud.length > 0) found = cloud[0];
        } catch (e) {}

        if (!found) {
          const localUsers = storage.get(STORAGE_KEYS.USERS, []);
          found = localUsers.find(u =>
            (u.email && u.email.toLowerCase() === cleanId) ||
            (u.username && u.username.toLowerCase() === cleanId)
          );
        }

        if (found) {
          const currentStatus = found.status || 'active';
          if (currentStatus === 'pending') {
            setLoading(false);
            return { success: false, pending: true, error: 'You are registered and waiting for Admin approval...' };
          }

          // Check password without hardcoded bypass
          if (found.password === password) {
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
            storage.set(STORAGE_KEYS.SESSION, processed);
            setLoading(false);
            return { success: true, user: processed };
          }
        }
      } catch (fbErr) {
        console.error('[Auth] Fallback auth error:', fbErr);
      }

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

    // Save locally
    const localUsers = storage.get(STORAGE_KEYS.USERS, []);
    const updatedLocal = [...localUsers.filter(u => u.email !== cleanEmail && u.username !== cleanUsername), newUser];
    storage.set(STORAGE_KEYS.USERS, updatedLocal, true);

    // Check Cloud Database
    try {
      const existing = await query('SELECT id FROM profiles WHERE LOWER(email) = $1 OR LOWER(username) = $2', [cleanEmail, cleanUsername]);
      if (existing && existing.length > 0) {
        setLoading(false);
        return { success: false, error: 'An account with this email or username already exists.' };
      }
    } catch (err) {
      console.warn('[Auth] Cloud check failed during registration:', err.message);
    }

    // Insert into cloud database
    try {
      await query(`
        INSERT INTO profiles (id, email, first_name, last_name, name, username, password, is_admin, status, joined_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [id, cleanEmail, userData.firstName, userData.lastName, fullName, cleanUsername, userData.password, false, 'pending', newUser.joinedAt]);

      await query(`
        INSERT INTO notifications (id, user_id, title, message, type)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `notif_${Date.now()}`,
        id,
        'Registration Pending',
        'You are registered and waiting for Admin approval...',
        'info'
      ]);
    } catch (cloudErr) {
      console.warn('[Auth] Cloud signup sync warning:', cloudErr.message);
    }

    setLoading(false);
    return { success: true, pending: true };
  };

  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'No user session' };

    const getApiBaseUrl = () =>
      (['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:')
        ? 'http://localhost:3000'
        : '';

    const targetName = updates.name || updates.fullName || (updates.firstName ? `${updates.firstName} ${updates.lastName || ''}`.trim() : user.name);

    const updated = {
      ...user,
      ...updates,
      name: targetName,
      fullName: targetName,
      firstName: updates.firstName || user.firstName || (targetName ? targetName.split(' ')[0] : ''),
      lastName: updates.lastName || user.lastName || (targetName ? targetName.split(' ').slice(1).join(' ') : ''),
    };

    setUser(updated);
    storage.set(STORAGE_KEYS.SESSION, updated);

    // Update local users
    try {
      const localUsers = storage.get(STORAGE_KEYS.USERS, []);
      const idx = localUsers.findIndex(usr => usr.id === updated.id || (usr.email && usr.email.toLowerCase() === updated.email?.toLowerCase()));
      if (idx !== -1) {
        localUsers[idx] = { ...localUsers[idx], ...updated };
      } else {
        localUsers.push(updated);
      }
      storage.set(STORAGE_KEYS.USERS, localUsers, true);
    } catch (e) {}

    window.dispatchEvent(new Event('nexus-user-updated'));
    window.dispatchEvent(new Event('nexus-data-updated'));

    // Cloud Database update
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
          storage.set(STORAGE_KEYS.SESSION, cloudUpdated, true);
        }
      }
    } catch (err) {
      console.warn('[Auth] DB profile sync fallback:', err.message);
    }

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
      let found = null;
      try {
        const cloud = await query('SELECT * FROM profiles WHERE LOWER(email) = $1', [email]);
        if (cloud && cloud.length > 0) found = cloud[0];
      } catch (cloudErr) {
        console.warn('[Auth] Cloud Google check fallback:', cloudErr.message);
      }

      if (!found) {
        const localUsers = storage.get(STORAGE_KEYS.USERS, []);
        found = localUsers.find(u => u.email && u.email.toLowerCase() === email);
      }

      if (found) {
        const u = {
          ...found,
          firstName: found.first_name || found.firstName || firstName,
          lastName: found.last_name || found.lastName || lastName,
          name: found.name || fullName,
          avatar: found.avatar || avatar,
          banner: found.banner || '',
          skills: found.skills,
          projects: found.projects,
          isAdmin: !!(found.is_admin || found.isAdmin),
          status: 'active',
          joinedAt: found.joined_at || found.joinedAt || new Date().toISOString()
        };

        const processed = await applyStreakToUser(u);
        setUser(processed);
        setIsAuthenticated(true);
        storage.set(STORAGE_KEYS.SESSION, processed);
        setLoading(false);
        return { success: true, user: processed };
      }

      const newUser = {
        id: `usr_${googleId.slice(0, 16)}`,
        email,
        username: email.split('@')[0],
        firstName,
        lastName,
        name: fullName,
        avatar,
        isAdmin: false,
        status: 'active',
        joinedAt: new Date().toISOString(),
        xp: 100,
        streak: 1,
        headline: 'Google Verified Member'
      };

      const localUsers = storage.get(STORAGE_KEYS.USERS, []);
      storage.set(STORAGE_KEYS.USERS, [...localUsers.filter(u => u.email !== email), newUser], true);

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
        console.warn('[Auth] Cloud Google profile insert warning:', cloudErr.message);
      }

      const processed = await applyStreakToUser(newUser);
      setUser(processed);
      setIsAuthenticated(true);
      storage.set(STORAGE_KEYS.SESSION, processed);
      setLoading(false);
      return { success: true, user: processed };
    } catch (err) {
      console.error('[Auth] Google Auth Error:', err);
      setLoading(false);
      return { success: false, error: 'Google Authentication failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    storage.remove(STORAGE_KEYS.SESSION);
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
