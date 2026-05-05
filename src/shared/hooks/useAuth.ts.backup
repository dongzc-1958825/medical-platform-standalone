// src/shared/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext'; // 改为命名导入

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内使用');
  }
  
  return context;
};