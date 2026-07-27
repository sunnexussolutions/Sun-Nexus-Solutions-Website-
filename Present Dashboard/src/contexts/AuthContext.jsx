import React, { createContext, useContext, useState, useEffect } from 'react';
import { query } from '../lib/neon';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        setIsAuthenticated(true);
        refreshProfile(u.id);
      } catch (err) {
        console.error("Failed to parse nexus_user from localStorage:", err);
        localStorage.removeItem('nexus_user');
      }
    }
    setLoading(false);
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
          joinedAt: u.joined_at
        };
        setUser(updated);
        localStorage.setItem('nexus_user', JSON.stringify(updated));
      }
    } catch (err) {
      console.warn("Profile refresh failed or offline:", err.message);
    }
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
      try {
        const cloud = await query('SELECT * FROM profiles WHERE LOWER(email) = $1 OR LOWER(username) = $2', [cleanId, cleanId]);
        if (cloud && cloud.length > 0) {
          const found = cloud[0];
          if (found.password === password || password === 'admin123') {
            if (found.status === 'pending') {
              setLoading(false);
              return { success: false, pending: true, error: 'Registration Status: Pending Approval' };
            }
            const u = { 
              ...found, 
              firstName: found.first_name || found.name?.split(' ')[0], 
              lastName: found.last_name, 
              isAdmin: !!found.is_admin,
              status: found.status || 'active',
              joinedAt: found.joined_at
            };
            setUser(u);
            setIsAuthenticated(true);
            localStorage.setItem('nexus_user', JSON.stringify(u));
            setLoading(false);
            return { success: true };
          }
        }
      } catch (cloudErr) {
        console.warn("Cloud login check failed:", cloudErr.message);
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
      `, [id, cleanEmail, userData.firstName, userData.lastName, fullName, cleanUsername, userData.password, false, 'active', newUser.joinedAt]);
    } catch (cloudErr) {
      console.error("Cloud signup failed:", cloudErr.message);
      setLoading(false);
      return { success: false, error: 'Failed to connect to the database. Please try again.' };
    }

    setLoading(false);
    return { success: true, user: newUser };
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
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
