// src/components/auth/AuthGuard.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback,
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // 统一的未登录提示 - 两个终端都可以使用
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">需要登录</h2>
          <p className="text-gray-600 mb-6">
            此功能需要登录后才能使用
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate(redirectTo)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              前往登录
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              返回上一页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;