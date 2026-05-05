// src/components/MobileLayout.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  title = '众创医案',
  showBack = false 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 safe-area-padding">
      {/* 移动端顶部导航 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center flex-1">
            {showBack && (
              <button 
                onClick={() => navigate(-1)}
                className="mr-3 text-gray-600 p-1"
              >
                ←
              </button>
            )}
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          </div>
          
          {/* 用户头像/登录状态 */}
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
            D
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="pb-16">
        {children}
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => navigate('/mobile')}
            className={`flex flex-col items-center p-2 ${
              location.pathname === '/mobile' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-xs mt-1">首页</span>
          </button>
          
          <button 
            onClick={() => navigate('/mobile/cases')}
            className={`flex flex-col items-center p-2 ${
              location.pathname.includes('/cases') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <span className="text-xl">📋</span>
            <span className="text-xs mt-1">医案</span>
          </button>
          
          <button 
            onClick={() => navigate('/mobile/favorites')}
            className={`flex flex-col items-center p-2 ${
              location.pathname === '/mobile/favorites' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <span className="text-xl">⭐</span>
            <span className="text-xs mt-1">收藏</span>
          </button>
          
          <button 
            onClick={() => navigate('/mobile/profile')}
            className={`flex flex-col items-center p-2 ${
              location.pathname === '/mobile/profile' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <span className="text-xl">👤</span>
            <span className="text-xs mt-1">我的</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout;