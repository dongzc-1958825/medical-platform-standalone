import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Logo from '../Logo/Logo';

interface DesktopLayoutProps {
  children?: React.ReactNode;
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  const navigate = useNavigate();
  
  // 五大功能 - 使用 /desktop/ 前缀
  const navItems = [
    { path: '/desktop/cases', label: '医案分享' },
    { path: '/desktop/community', label: '专病社区' },
    { path: '/desktop/messages', label: '消息' },
    { path: '/desktop/profile', label: '我的' }
  ];

  return (
    <div className="desktop-layout min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo - 点击返回桌面端首页 */}
          <div 
            className="cursor-pointer flex items-center"
            onClick={() => navigate('/desktop/cases')}
          >
            <Logo size="medium" />
            <span className="ml-2 text-sm text-gray-500 hidden md:inline">
              众创医案平台
            </span>
          </div>
          
          {/* 主导航 - 四大功能（寻医问药可能在其他地方） */}
          <nav className="flex space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {children || <Outlet />}
      </main>
    </div>
  );
}