import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { User as UserIcon } from 'lucide-react';
import MobileBottomNav from './MobileBottomNav';
import Logo from '../Logo/Logo';

const MobileLayout = () => {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();
  
  const shouldShowLogo = location.pathname === '/mobile/home';
  
  console.log('📍 MobileLayout - 当前路径:', location.pathname);
  console.log('🎨 是否显示Logo:', shouldShowLogo);

  const handleLogout = async () => {
    console.log('🚨 [原子化退出] 开始');
    
    // 立即禁用按钮，防止重复点击
    const logoutBtn = document.querySelector('button[onClick*="handleLogout"]');
    if (logoutBtn) logoutBtn.setAttribute('disabled', 'true');
    
    try {
      // 同步清理认证状态
      console.log('⚡ [原子化退出] 步骤1: 同步清除AuthContext');
      localStorage.removeItem('current-user');
      
      // 跳转到登录页
      console.log('⚡ [原子化退出] 步骤2: 强制哈希跳转到 #/login?from=/mobile/home');
      window.location.hash = '#/login?from=/mobile/home';
      
      // 短暂延迟，确保浏览器已处理哈希跳转
      setTimeout(async () => {
        try {
          console.log('⚡ [原子化退出] 步骤3: 调用React Context的logout');
          await logout();
          
          // 最终安全跳转
          setTimeout(() => {
            const currentHash = window.location.hash;
            if (!currentHash.includes('#/login')) {
              console.warn('⚠️ 哈希未稳定在#/login，执行最终修正');
              window.location.hash = '#/login?from=/mobile/home';
            }
            console.log('✅ [原子化退出] 序列完成');
          }, 50);
        } catch (innerError) {
          console.error('❌ React状态更新失败:', innerError);
        }
      }, 100);
      
    } catch (outerError) {
      console.error('❌ [原子化退出] 主流程失败:', outerError);
      const baseUrl = window.location.origin + window.location.pathname;
      window.location.href = baseUrl + '#/login?from=/mobile/home';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部固定：众创医案平台 + 登录/注册 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-lg font-bold text-blue-600">
            众创医案平台
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-500 hover:text-red-600 px-1"
                >
                  退出
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink
                  to="/login"
                  className="text-sm text-blue-600 hover:text-blue-700 px-2"
                >
                  登录
                </NavLink>
                <span className="text-gray-300">|</span>
                <NavLink
                  to="#/login?form=register"
                  className="text-sm text-blue-600 hover:text-blue-700 px-2"
                >
                  注册
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 中部：Logo和"分享案例，健康管理" - 只在首页显示 */}
      {shouldShowLogo && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-12">
          <div className="mb-6">
            <Logo size="large" mobileSize="large" />
          </div>
          <div className="text-xl font-bold text-blue-600 text-center">
            分享案例，健康管理
          </div>
        </div>
      )}

      {/* 页面内容区域 */}
      <div className={`flex-1 relative min-h-screen px-4 ${shouldShowLogo ? 'pb-24' : 'pt-4 pb-24'}`}>
        <Outlet />
      </div>

      {/* 底部导航 */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileLayout;