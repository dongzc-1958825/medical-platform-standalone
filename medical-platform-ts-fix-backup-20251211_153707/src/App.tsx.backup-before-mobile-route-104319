// src/App.tsx
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import CasesPage from './pages/CasesPage';
import CreateCasePage from './pages/CreateCasePage';
import HelpPage from './pages/HelpPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import ConsultationDetailPage from './pages/ConsultationDetailPage';
import CommunityPage from './pages/CommunityPage';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 检查本地存储中的用户登录状态
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        console.log('检查认证状态:', { token, userData });
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          console.log('找到用户数据:', parsedUser);
          setUser(parsedUser);
        } else {
          console.log('未找到认证信息，用户未登录');
          setUser(null);
        }
      } catch (error) {
        console.error('检查认证状态时出错:', error);
        // 清除可能损坏的数据
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // 处理用户登录
  const handleLogin = (userData: User, token: string) => {
    console.log('用户登录:', userData);
    setUser(userData);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  // 处理用户退出
  const handleLogout = () => {
    console.log('用户退出');
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  // 更新用户信息
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  // 保护路由组件
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    return user ? <>{children}</> : <Navigate to="/login" replace />;
  };

  // 公共路由组件（已登录用户访问登录页时重定向）
  const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    return !user ? <>{children}</> : <Navigate to="/" replace />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 登录页面（公共路由） */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage onLogin={handleLogin} />
              </PublicRoute>
            } 
          />
          
          {/* 主布局路由 */}
          <Route 
            path="/*" 
            element={
              <MainLayout user={user} onLogout={handleLogout} />
            }
          >
            <Route index element={<HomePage user={user} />} />
            <Route path="cases" element={
              <ProtectedRoute>
                <CasesPage />
              </ProtectedRoute>
            } />
            {/* 新增：创建医案独立页面 */}
            <Route path="cases/create" element={
              <ProtectedRoute>
                <CreateCasePage />
              </ProtectedRoute>
            } />
            <Route path="community" element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            } />
            <Route path="help" element={
              <ProtectedRoute>
                <HelpPage />
              </ProtectedRoute>
            } />
            <Route path="messages" element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage user={user} onUpdateUser={updateUser} />
              </ProtectedRoute>
            } />
          </Route>

          {/* 咨询详情独立页面 */}
          <Route 
            path="/consultation/:id" 
            element={
              <ProtectedRoute>
                <ConsultationDetailPage />
              </ProtectedRoute>
            }
          />

          {/* 默认重定向 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;