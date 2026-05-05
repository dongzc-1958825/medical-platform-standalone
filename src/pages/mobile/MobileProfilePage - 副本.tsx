// src/pages/mobile/MobileProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../shared/hooks/useAdmin';
import { 
  Heart, FileText, Stethoscope, Key, Star, 
  ChevronRight, User, Settings, X, Shield,
  Flag, Users, BarChart, Bell, AlertTriangle
} from 'lucide-react';
import CollectionsManager from '../../components/collection/CollectionsManager';

export default function MobileProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isAdmin, adminInfo, loading: adminLoading } = useAdmin();
  const [showCollections, setShowCollections] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  
  // 加载待处理数量
  useEffect(() => {
    if (isAdmin) {
      // 这里可以调用 adminService 获取待处理数量
      // 简化处理，实际应该从服务获取
      setPendingCount(3);
      setReportCount(2);
    }
  }, [isAdmin]);

  // 核心功能
  const coreFeatures = [
    { 
      icon: Heart, 
      label: '健康管理', 
      description: '管理您的健康数据',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      path: '/mobile/health',
      onClick: () => navigate('/mobile/health')
    },
    { 
      icon: FileText, 
      label: '诊疗记录', 
      description: '查看和管理就诊记录',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      path: '/mobile/records',
      onClick: () => navigate('/mobile/records')
    },
    { 
      icon: Stethoscope, 
      label: '体检报告', 
      description: '上传和查看体检报告',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      path: '/mobile/profile/reports',
      onClick: () => navigate('/mobile/profile/reports')
    },
    { 
      icon: Key, 
      label: '关键信息', 
      description: '重要医疗信息和联系人',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      path: '/mobile/profile/critical-info',
      onClick: () => navigate('/mobile/profile/critical-info')
    },
    {
      icon: Shield,
      label: '社区管理',
      description: '管理专病社区',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      path: '/mobile/community/admin',
      onClick: () => navigate('/mobile/community/admin')
    },
    { 
      icon: Star, 
      label: '我的收藏', 
      description: '收藏的医案和文章',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      path: '/mobile/favorites',
      onClick: () => setShowCollections(true)
    },
  ];

  // 管理员功能（只在用户是管理员时显示）
  const adminFeatures = isAdmin ? [
    {
      icon: Flag,
      label: '待审核内容',
      description: `有 ${pendingCount} 条内容待审核`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      path: '#/admin/pending',
      badge: pendingCount > 0 ? pendingCount : null
    },
    {
      icon: AlertTriangle,
      label: '用户举报',
      description: `有 ${reportCount} 条举报待处理`,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      path: '#/admin/reports',
      badge: reportCount > 0 ? reportCount : null
    },
    {
      icon: Users,
      label: '用户管理',
      description: '管理平台用户',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      path: '#/admin/users'
    },
    {
      icon: BarChart,
      label: '数据统计',
      description: '查看平台运营数据',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      path: '#/admin/statistics'
    },
    {
      icon: Bell,
      label: '系统公告',
      description: '发布平台公告',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      path: '#/admin/announcements'
    }
  ] : [];

  const settingsFeatures = [
    { icon: User, label: '个人信息', path: '/mobile/profile/info' },
    { icon: Settings, label: '账户设置', path: '/mobile/settings' },
  ];

  const getDisplayName = () => {
    if (!user) return '用户';
    return user.username || user.email?.split('@')[0] || '用户';
  };

  const getInitial = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const getRoleBadge = () => {
    if (!isAdmin) return null;
    
    const roleMap = {
      super: { label: '超级管理员', color: 'bg-red-100 text-red-700' },
      community: { label: '社区管理员', color: 'bg-blue-100 text-blue-700' },
      moderator: { label: '审核员', color: 'bg-green-100 text-green-700' }
    };
    
    const role = adminInfo?.role || 'community';
    return roleMap[role] || roleMap.community;
  };

  return (
    <div className="p-4">
      {showCollections && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setShowCollections(false)}
                className="mr-3 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">我的收藏</h2>
            </div>
          </div>
          <div className="h-[calc(100vh-64px)] overflow-auto">
            <CollectionsManager 
              mode="mobile"
              user={user}
              onClose={() => setShowCollections(false)}
            />
          </div>
        </div>
      )}
      
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
            {getInitial()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-white">
                {getDisplayName()}
              </h2>
              {isAdmin && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge()?.color}`}>
                  {getRoleBadge()?.label}
                </span>
              )}
            </div>
            <p className="text-sm text-white/80">
              {user?.email ? user.email : '欢迎使用众创医案'}
            </p>
          </div>
          <button
            onClick={() => navigate('/mobile/profile/edit')}
            className="px-3 py-1.5 bg-white/20 text-white text-sm rounded-lg hover:bg-white/30 transition-colors"
          >
            编辑
          </button>
        </div>
      </div>

      {/* 管理员功能区域 */}
      {adminFeatures.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">管理功能</h3>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {adminFeatures.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors active:bg-gray-100 cursor-pointer"
                >
                  <div className="flex items-center flex-1">
                    <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center mr-3`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 flex items-center gap-2">
                        {item.label}
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">我的功能</h3>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {coreFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                onClick={item.onClick}
                className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors active:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center mr-3`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">账户设置</h3>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {settingsFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors active:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center">
                  <Icon className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-gray-800">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
      >
        退出登录
      </button>

      <div className="text-center text-xs text-gray-400 mt-8 pt-4 border-t">
        <p>众创医案平台 v2.6.0</p>
        <p className="mt-1">数据安全加密存储</p>
      </div>
    </div>
  );
}


