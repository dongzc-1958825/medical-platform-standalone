// src/pages/mobile/MobileFavoritesPage.tsx
import React from 'react';
import MobileLayout from '../../components/MobileLayout';

const MobileFavoritesPage: React.FC = () => {
  return (
    <MobileLayout title="我的收藏" showBack>
      <div className="p-4">
        <div className="text-center py-8 text-gray-500">
          收藏页面 - 开发中
        </div>
      </div>
    </MobileLayout>
  );
};

export default MobileFavoritesPage;