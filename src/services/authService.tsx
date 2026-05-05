import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { User } from '../shared/types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, _password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    // 返回默认实现，避免崩溃
    return {
      user: null,
      login: async () => {
        console.warn('AuthProvider未包裹应用');
      },
      logout: () => {},
      updateUser: () => {},
      isAuthenticated: false,
    };
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(() => {
    // 从 localStorage 恢复用户状态
    try {
      const stored = localStorage.getItem('medical_user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('恢复用户状态失败:', error);
      return null;
    }
  });

  const login = async (email: string, _password: string): Promise<void> => {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 创建模拟用户
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0] || '用户',
      isDoctor: email.includes('doctor') || email.includes('医院'),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=random`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setUser(mockUser);
    localStorage.setItem('medical_user', JSON.stringify(mockUser));
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('medical_user');
  };

  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      const updatedUser = { ...user, ...userData, updatedAt: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('medical_user', JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = !!user;

  const value = useMemo(() => ({
    user,
    login,
    logout,
    updateUser,
    isAuthenticated,
  }), [user, isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

