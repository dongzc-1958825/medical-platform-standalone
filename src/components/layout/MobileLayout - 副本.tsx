import React from 'react';
import Logo from '../Logo/Logo';
import { Outlet } from "react-router-dom";
import MobileBottomNav from "./MobileBottomNav";

// 定义组件属性类型
interface MobileLayoutProps {
  children?: React.ReactNode;
  hideHeader?: boolean; // 新增：是否隐藏头部
}

export default function MobileLayout({ children, hideHeader = false }: MobileLayoutProps) {
  return (
    <div className="mobile-layout min-h-screen bg-gray-50 safe-area">
      {/* 头部 - 根据hideHeader参数决定是否显示 */}
      {!hideHeader && (
        <header className="bg-white shadow-sm px-4 py-3 sticky top-0 z-40">
          {/* Logo */}
          <div className="flex justify-center">
            <Logo size="small" mobileSize="small" />
          </div>
          
          {/* 移动端额外提示 - 可选，根据设计需求 */}
          <div className="text-center text-xs text-gray-500 mt-1">
            共享医学智慧
          </div>
        </header>
      )}

      {/* 主要内容区域 */}
      <main className={`pb-16 min-h-[calc(100vh-4rem)] overflow-y-auto ${hideHeader ? 'pt-4' : ''}`}>
        {/* 优先渲染 children，如果没有则渲染 Outlet */}
        {children || <Outlet />}
      </main>

      {/* 底部导航 */}
      <MobileBottomNav />
    </div>
  );
}