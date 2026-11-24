import React, { createContext, useContext, useState } from 'react';
import { DEMO_USER } from '../data/sampleUserData';
import { UserProfile } from '../types';
import {
  getInitialSessionUserId,
  getStoredUsers,
  saveStoredUsers,
  setSessionUserId,
} from '../utils/storage';

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  login: (email: string, password: string) => AuthResult;
  loginDemo: () => void;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    major?: string;
    university?: string;
  }) => AuthResult;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>(() => getStoredUsers());
  const [activeUserId, setActiveUserId] = useState<string | null>(() =>
    getInitialSessionUserId()
  );

  const user = users.find((u) => u.id === activeUserId) ?? null;

  const login = (email: string, password: string): AuthResult => {
    const normalizedEmail = email.trim().toLowerCase();
    const found = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );
    if (!found) {
      return {
        success: false,
        error: 'No demo account found with this email address.',
      };
    }
    if (found.passwordHash !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please try again.',
      };
    }
    setSessionUserId(found.id);
    setActiveUserId(found.id);
    return { success: true };
  };

  const loginDemo = () => {
    const freshUsers = getStoredUsers();
    setUsers(freshUsers);
    setSessionUserId(DEMO_USER.id);
    setActiveUserId(DEMO_USER.id);
  };

  const register = (payload: {
    name: string;
    email: string;
    password: string;
    major?: string;
    university?: string;
  }): AuthResult => {
    const normalizedEmail = payload.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return {
        success: false,
        error: 'An account with this email already exists.',
      };
    }

    const newUser: UserProfile = {
      id: `student-${Date.now()}`,
      name: payload.name.trim(),
      email: normalizedEmail,
      passwordHash: payload.password,
      avatarUrl: '',
      joinedDate: new Date().toISOString().split('T')[0],
      bio: 'Passionate college learner building practical software engineering skills.',
      major: payload.major?.trim() || 'B.Tech Computer Science',
      university:
        payload.university?.trim() || 'Medi-Caps University, Indore',
      isDemo: false,
    };

    const updated = [...users, newUser];
    saveStoredUsers(updated);
    setUsers(updated);
    setSessionUserId(newUser.id);
    setActiveUserId(newUser.id);
    return { success: true };
  };

  const logout = () => {
    setSessionUserId(null);
    setActiveUserId(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!activeUserId) return;
    const updated = users.map((u) =>
      u.id === activeUserId ? { ...u, ...updates } : u
    );
    saveStoredUsers(updated);
    setUsers(updated);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, loginDemo, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
