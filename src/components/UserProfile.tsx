// File: src/components/UserProfile.tsx
import React from 'react';

// 定义属性的类型，这个组件需要从App.tsx接收用户信息和登录函数
interface UserProfileProps {
  currentUser: any; // 为了快速推进，暂时用any，后期可替换为具体的用户类型
  onLoginClick: () => void;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ currentUser, onLoginClick, onLogout }) => {
  // 未登录状态
  if (!currentUser) {
    return (
      <div className="user-profile guest-mode">
        <div className="login-prompt text-center py-12">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">您尚未登录</h2>
          <p className="text-gray-500 mb-6">登录后即可管理您的个人医案、收藏和设置</p>
          <button
            onClick={onLoginClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
          >
            立即登录
          </button>
        </div>
      </div>
    );
  }

  // 已登录状态
  return (
    <div className="user-profile logged-in">
      {/* 用户信息概览 */}
      <div className="user-overview bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {currentUser.username?.charAt(0) || 'User'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{currentUser.username}</h1>
            <p className="text-gray-500 text-sm mt-1">注册时间：{currentUser.registrationDate || '2024-01-01'}</p>
            <div className="flex space-x-4 mt-3 text-sm">
              <span className="text-gray-700">分享案例：<strong>{currentUser.sharedCases || 0}</strong> 个</span>
              <span className="text-gray-700">求助数量：<strong>{currentUser.helpRequests || 0}</strong> 次</span>
            </div>
          </div>
        </div>
      </div>

      {/* 功能菜单网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* 
          第二步中，我们将把每个菜单项都拆分为独立的子组件。
          现在先用占位符表示。
        */}
        <div className="menu-item bg-white rounded-lg shadow-sm p-5 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-2xl mb-2">📋</div>
          <div className="font-medium">我的医案分享</div>
        </div>
        
        <div className="menu-item bg-white rounded-lg shadow-sm p-5 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-2xl mb-2">❓</div>
          <div className="font-medium">我的求助记录</div>
        </div>
        
        <div className="menu-item bg-white rounded-lg shadow-sm p-5 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-2xl mb-2">🏥</div>
          <div className="font-medium">我的体检报告</div>
        </div>
        
        <div className="menu-item bg-white rounded-lg shadow-sm p-5 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-2xl mb-2">👨‍👩‍👧‍👦</div>
          <div className="font-medium">亲属病例管理</div>
        </div>
        
        <div className="menu-item bg-white rounded-lg shadow-sm p-5 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-2xl mb-2">⭐</div>
          <div className="font-medium">我的收藏</div>
        </div>
        
        <div className="menu-item bg-white rounded-lg shadow-sm p-5 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-2xl mb-2">⚙️</div>
          <div className="font-medium">账号设置</div>
        </div>
      </div>

      {/* 退出登录按钮 */}
      <div className="mt-8 text-center">
        <button
          onClick={onLogout}
          className="text-gray-500 hover:text-red-600 font-medium py-2 px-4 border border-gray-300 rounded-lg hover:border-red-300 transition-colors"
        >
          退出登录
        </button>
      </div>
    </div>
  );
};

export default UserProfile;