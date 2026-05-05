// src/components/layout/WelcomePage.tsx
import React from 'react';

interface WelcomePageProps {
  onLoginClick: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">欢迎使用众创医案平台</h1>
        <p className="text-gray-600 mb-8 text-lg">
          专业的医疗健康服务平台，为您提供全方位的健康管理解决方案
        </p>
        <div className="space-y-4">
          <button
            onClick={onLoginClick}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            立即登录 / 注册
          </button>
          <p className="text-gray-500 text-sm">
            登录后即可使用平台全部功能
          </p>
        </div>
        
        {/* 功能预览 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-semibold text-gray-800 mb-2">医案分享</h3>
            <p className="text-gray-600 text-sm">分享和学习医疗案例经验</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">❓</div>
            <h3 className="font-semibold text-gray-800 mb-2">寻医问药</h3>
            <p className="text-gray-600 text-sm">专业的医疗咨询和建议</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">👤</div>
            <h3 className="font-semibold text-gray-800 mb-2">健康管理</h3>
            <p className="text-gray-600 text-sm">个人健康档案和追踪</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;