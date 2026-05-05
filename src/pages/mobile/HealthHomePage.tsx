import React from 'react';
import { Link } from 'react-router-dom';

const HealthHomePage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">健康管理中心</h1>
      
      <div className="grid grid-cols-2 gap-4">
        {/* 实际功能卡片 */}
        <Link to="/mobile/health/overview" className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">健康概览</h3>
          <p className="text-sm text-gray-600">查看健康数据</p>
        </Link>
        
        <Link to="/mobile/health/critical-info" className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">关键信息</h3>
          <p className="text-sm text-gray-600">完善健康档案</p>
        </Link>
        
        {/* 添加其他实际功能链接 */}
      </div>
    </div>
  );
};

export default HealthHomePage;
