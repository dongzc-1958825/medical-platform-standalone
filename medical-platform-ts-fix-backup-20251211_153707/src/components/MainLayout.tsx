import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { User } from '../types';
import Logo from './Logo/Logo'; // 修改1: 导入Logo组件

interface MainLayoutProps {
  user: User | null;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const getDisplayName = () => {
    return user?.name || user?.username || '用户';
  };

  // 修复：使用正确的active状态检查（针对HashRouter）
  const isActive = (path: string) => {
    // HashRouter的location.hash包含#号
    return location.hash === `#${path}` || 
           (path === '/' && (location.hash === '#/' || location.hash === ''));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 左侧logo和标题 - 修改2: 使用Logo组件替换emoji和标题 */}
            <div className="flex items-center">
              <Logo size="medium" />
              
              {/* 欢迎文本 */}
              {user && (
                <div className="ml-6 text-sm text-gray-600">
                  欢迎，{getDisplayName()}
                </div>
              )}
            </div>

            {/* 右侧导航菜单 - 使用Link组件 */}
            <div className="flex items-center space-x-1">
              {/* 首页链接 */}
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                🏠 首页
              </Link>
              
              {/* 医案分享链接 */}
              <Link
                to="/cases"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/cases') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                📋 医案分享
              </Link>
              
              {/* 专病社区链接 */}
              <Link
                to="/community"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/community') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                👥 专病社区
              </Link>
              
              {/* 寻医问药链接 */}
              <Link
                to="/help"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/help') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                ❓ 寻医问药
              </Link>
              
              {/* 消息链接 */}
              <Link
                to="/messages"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/messages') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                📢 消息
              </Link>
              
              {/* 我的链接 */}
              <Link
                to="/profile"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/profile') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                👤 我的
              </Link>

              {/* 用户相关操作 */}
              <div className="ml-4 flex items-center space-x-2">
                {user ? (
                  <>
                    <span className="text-sm text-gray-600">{getDisplayName()}</span>
                    <button
                      onClick={onLogout}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
                    >
                      退出
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    登录/注册
                  </Link>
                )}
                
                {/* 语言切换 */}
                <button className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1">
                  中/EN
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;