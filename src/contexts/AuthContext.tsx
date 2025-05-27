import React, { createContext, useContext, useState, useEffect } from 'react';
import { Admin } from '../types';
import { admins } from '../data/mockData';

interface AuthContextType {
  currentAdmin: Admin | null;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved admin in localStorage
    const savedAdmin = localStorage.getItem('currentAdmin');
    if (savedAdmin) {
      setCurrentAdmin(JSON.parse(savedAdmin));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (pin: string): Promise<boolean> => {
    try {
      setError(null);
      
      // Validate PIN format (6-7 digits)
      if (!/^\d{6,7}$/.test(pin)) {
        setError('PIN must be 6 or 7 digits');
        return false;
      }
      
      // Find admin with matching PIN
      const admin = admins.find(a => a.pin === pin);
      
      if (admin) {
        // Update admin with current login time
        const updatedAdmin = {
          ...admin,
          lastLogin: new Date().toISOString()
        };
        
        setCurrentAdmin(updatedAdmin);
        setIsAuthenticated(true);
        
        // Save to localStorage for persistence
        localStorage.setItem('currentAdmin', JSON.stringify(updatedAdmin));
        
        return true;
      } else {
        setError('Invalid PIN');
        return false;
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setCurrentAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentAdmin');
  };

  return (
    <AuthContext.Provider value={{ currentAdmin, login, logout, isAuthenticated, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};