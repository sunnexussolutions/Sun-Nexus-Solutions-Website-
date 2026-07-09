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
    try {
      // SENIOR DEV TIP: Search by Email OR Username to make it user-friendly.
      const cloud = await query('SELECT * FROM profiles WHERE email = $1 OR username = $2', [identifier, identifier]);
      
      if (cloud && cloud.length > 0) {
        const found = cloud[0];
        // Professional Check: Allow Admin master bypass OR saved password
        if (
          (identifier === 'admin@nexus.com' && password === 'admin123') || 
          (found.password === password)
        ) {
          const u = { 
            ...found, 
            firstName: found.first_name, 
            lastName: found.last_name, 
            isAdmin: found.is_admin,
            joinedAt: found.joined_at
          };
          setUser(u);
          setIsAuthenticated(true);
          localStorage.setItem('nexus_user', JSON.stringify(u));
          setLoading(false);
          return { success: true };
        }
      }
      
      setLoading(false);
      return { success: false, error: 'Identity check failed. Verify your password.' };
    } catch (err) {
      console.error("LOGIN_ERROR:", err);
      setLoading(false);
      return { success: false, error: 'Connection to Cloud Hub interrupted.' };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    const id = `user_${Date.now()}`;
    
    const fullName = `${userData.firstName} ${userData.lastName}`;
    
    try {
      const res = await query(`
        INSERT INTO profiles (id, email, first_name, last_name, name, username, password, is_admin, status, joined_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [id, userData.email, userData.firstName, userData.lastName, fullName, userData.username, userData.password, false, 'active', new Date().toISOString()]);

      if (res) {
        // Also save locally for Admin Panel visibility (until it's fully cloud-migrated)
        const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
        localStorage.setItem('nexus_users', JSON.stringify([...localUsers, { ...userData, id, isAdmin: false, status: 'pending' }]));
        
        setLoading(false);
        return { success: true };
      }
      
      setLoading(false);
      return { success: false, error: 'Database rejected signup. Email might already exist.' };
    } catch (err) {
      setLoading(false);
      return { success: false, error: `Critical Failure: ${err.message}` };
    }
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
