import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRecord } from '../services/googleSheets';

interface AuthContextType {
  user: UserRecord | null;
  login: (user: UserRecord) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserRecord | null>(null);

  useEffect(() => {
    // Basic session persistence for prototype
    const storedUser = localStorage.getItem('bank_session_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: UserRecord) => {
    setUser(userData);
    localStorage.setItem('bank_session_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bank_session_user');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
