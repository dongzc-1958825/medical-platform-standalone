// src/components/layout/DesktopLayout.tsx - 移除顶部导航链接版本
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { LogOut, User as UserIcon } from 'lucide-react'; // 移除了 Menu 图标，因为不再需要
import Logo from '../Logo/Logo';

const DesktopLayout: React.FC = () => {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.reload(); // 强制刷新页面
    } catch (error) {
      console.error('退出失败:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 桌面端顶部导航栏 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo 和品牌 */}
            <div className="flex items-center">
              <Link to="/desktop/home" className="flex items-center">
                <Logo size="small" />
                <span className="ml-3 text-xl font-bold text-gray-900">
                  众创医案平台
                </span>
              </Link>
            </div>

            {/* 桌面端主导航 - 已移除，因为首页已有功能网格 */}
            {/* 保留一个空的 nav 元素以保持布局平衡 */}
            <nav className="hidden md:flex space-x-8">
              {/* 导航链接已移除，因为首页已有功能网格 */}
            </nav>

            {/* 用户操作 */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/desktop/profile"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm">{user.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    登录
                  </Link>
                  <Link
                    to="/login?form=register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    注册
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* 桌面端页脚 */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 众创医案平台 · 知识产权所有</p>
            <p className="mt-1">共享医学智慧，共创医案知识</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DesktopLayout;