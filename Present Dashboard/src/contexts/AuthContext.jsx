import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const AuthContext = createContext();

const ADMIN_USERNAMES = ['admin', 'sunnexus_admin', 'admin@sunnexus.824'];

export const AuthProvider = ({ children }) => {
  const [user, setUser]                       = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading]                 = useState(true);

  // Restore session on mount
  useEffect(() => {
    const session = storage.get('SESSION');
    if (session) {
      const users = storage.get('USERS') || [];
      const found = users.find(u => u.username === session.username);
      if (found) {
        const { password: _, ...safe } = found;
        setUser(safe);
        setIsAuthenticated(true);
      } else {
        storage.remove('SESSION');
      }
    }
    setLoading(false);
  }, []);

  // Register new user
  const register = ({ firstName, lastName, dob, username, email, password }) => {
    const users = storage.get('USERS') || [];

    if (users.find(u => u.username.toLowerCase() === username.toLowerCase()))
      return { success: false, error: 'Username already taken.' };

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
      return { success: false, error: 'Email already registered.' };

    const isAdmin = ADMIN_USERNAMES.includes(username.toLowerCase());
    const status  = isAdmin ? 'active' : 'pending';
    const newUser = {
      id:        Date.now(),
      firstName,
      lastName,
      name:      `${firstName} ${lastName}`,
      dob,
      username,
      email:     email.toLowerCase(),
      password,  
      avatar:    firstName[0].toUpperCase(),
      level:     isAdmin ? 'Administrator' : 'Member',
      isAdmin,
      status,
      xp:        0,
      streak:    0,
      results:   [],
      joinedAt:  new Date().toISOString(),
    };

    storage.set('USERS', [...users, newUser]);

    if (status === 'pending') {
      return { success: true, pending: true };
    }

    const { password: _, ...safe } = newUser;
    storage.set('SESSION', safe);
    setUser(safe);
    setIsAuthenticated(true);
    return { success: true };
  };

  const login = (username, password) => {
    // --- TEMPORARY BYPASS START ---
    if (username.toLowerCase() === 'admin@sunnexus.824' && password === 'admin@sunnexus.824') {
      const adminSession = {
        id: 999,
        name: 'Sun Nexus Admin',
        username: 'admin@sunnexus.824',
        email: 'admin@sunnexus.824',
        level: 'Administrator',
        isAdmin: true,
        xp: 1000,
        streak: 1,
        joinedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      storage.set('SESSION', adminSession);
      setUser(adminSession);
      setIsAuthenticated(true);
      return { success: true };
    }
    // --- TEMPORARY BYPASS END ---

    const users = storage.get('USERS') || [];
    const foundIdx = users.findIndex(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (foundIdx === -1) return { success: false, error: 'Invalid username or password.' };
    const found = users[foundIdx];

    // --- CHECK STATUS ---
    if (found.status === 'suspended') {
      return { success: false, error: 'Your account has been suspended. Please contact support.' };
    }
    
    if (found.status === 'pending') {
      return { success: false, error: 'Account Pending. Your access requires administrator approval.' };
    }

    if (found.status === 'banned') {
      return { success: false, error: 'Account Banned. Global access revoked.' };
    }
    if (found.status === 'banned') {
      return { success: false, error: 'Your account has been permanently banned.' };
    }
    // --- END CHECK ---

    // Update lastLogin
    users[foundIdx].lastLogin = new Date().toISOString();
    storage.set('USERS', users);

    const { password: _, ...safe } = users[foundIdx];
    storage.set('SESSION', safe);
    setUser(safe);
    setIsAuthenticated(true);
    return { success: true };
  };

  // Update user profile
  const updateProfile = (updates) => {
    if (!user) return { success: false, error: 'Not logged in' };
    
    const users = storage.get('USERS') || [];
    const idx = users.findIndex(u => u.email === user.email);
    
    if (idx !== -1) {
      const updatedUser = { ...users[idx], ...updates };
      users[idx] = updatedUser;
      storage.set('USERS', users);
      
      const { password: _, ...safe } = updatedUser;
      storage.set('SESSION', safe);
      setUser(safe);
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    storage.remove('SESSION');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
