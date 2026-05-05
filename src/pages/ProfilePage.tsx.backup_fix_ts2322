import React, { useState } from 'react';
import { User } from '../types';
import HealthManagement from '../components/profile/HealthManagement';
import MedicalRecords from '../components/profile/MedicalRecords';
import PhysicalExams from '../components/profile/PhysicalExams';
import KeyInformation from '../components/profile/KeyInformation';
import Collections from '../components/profile/Collections';

interface ProfilePageProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState('health');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">请先登录</h2>
          <p className="text-gray-600">登录后查看个人中心</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'health', name: '健康管理', icon: '❤️' },
    { id: 'records', name: '诊疗记录', icon: '📋' },
    { id: 'exams', name: '体检报告', icon: '🩺' },
    { id: 'info', name: '关键信息', icon: '🔑' },
    { id: 'collections', name: '我的收藏', icon: '⭐' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'health':
        return <HealthManagement user={user} />;
      case 'records':
        return <MedicalRecords />;
      case 'exams':
        return <PhysicalExams />;
      case 'info':
        return <KeyInformation user={user} onUpdateUser={onUpdateUser} />;
      case 'collections':
        return <Collections />;
      default:
        return <HealthManagement user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">
                {user.name || user.username}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              编辑资料
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 侧边栏导航 */}
          <div className="lg:w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* 主内容区域 */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;