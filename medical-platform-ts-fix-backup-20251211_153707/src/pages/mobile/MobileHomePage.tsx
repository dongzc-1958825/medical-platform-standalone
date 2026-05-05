// src/pages/mobile/MobileHomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../../components/MobileLayout';

const MobileHomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout title="众创医案">
      <div className="p-4 space-y-4">
        {/* 搜索栏 */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div 
            className="flex items-center bg-gray-100 rounded-lg px-3 py-2"
            onClick={() => navigate('/mobile/cases')}
          >
            <span className="text-gray-400 mr-2">🔍</span>
            <span className="text-gray-500">搜索医案...</span>
          </div>
        </div>

        {/* 快速入口 */}
        <div className="grid grid-cols-2 gap-3">
          <div 
            className="bg-white rounded-lg p-4 shadow-sm flex flex-col items-center touch-feedback"
            onClick={() => navigate('/mobile/cases')}
          >
            <span className="text-2xl mb-2">📋</span>
            <span className="text-sm font-medium">全部医案</span>
          </div>
          
          <div 
            className="bg-white rounded-lg p-4 shadow-sm flex flex-col items-center touch-feedback"
            onClick={() => navigate('/mobile/favorites')}
          >
            <span className="text-2xl mb-2">⭐</span>
            <span className="text-sm font-medium">我的收藏</span>
          </div>
        </div>

        {/* 最近浏览 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="font-medium mb-3">最近浏览</h2>
          <div className="space-y-2">
            <div className="text-sm text-gray-500 text-center py-4">
              暂无浏览记录
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default MobileHomePage;