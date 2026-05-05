// src/pages/HomePage.tsx（最简最终版）
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, 
  MessageSquare, 
  Users, 
  Bell, 
  User,
  Shield
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  // 五大核心功能
  const mainFeatures = [
    { id: 'cases', title: '医案分享', icon: FileText, path: '/desktop/cases', desc: '查看和分享临床医案' },
    { id: 'consult', title: '寻医问药', icon: MessageSquare, path: '/desktop/consult', desc: '获取专业医疗建议' },
    { id: 'community', title: '专病社区', icon: Users, path: '/desktop/community', desc: '加入专科讨论社区' },
    { id: 'messages', title: '消息', icon: Bell, path: '/desktop/messages', desc: '查看通知和消息' },
    { id: 'profile', title: '我的', icon: User, path: '/desktop/profile', desc: '个人设置和资料' }
  ];

  return (
    <div className="home-page-content min-h-[calc(100vh-180px)]">
      <div className="container mx-auto px-4 py-4">
        {/* 欢迎语 - 最简洁 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {user ? `欢迎，${user.username}` : '众创医案平台'}
          </h1>
          <p className="text-gray-600 text-sm">
            {user ? '请选择功能' : '共享医学智慧，共创医案知识'}
          </p>
        </div>

        {/* 五大功能网格 - 最紧凑 */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {mainFeatures.map(feature => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.id}
                  to={feature.path}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:shadow-sm hover:border-blue-300 transition-all h-full">
                    <div className="w-10 h-10 mx-auto mb-2 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="font-semibold text-gray-900 text-sm mb-1">
                      {feature.title}
                    </div>
                    <p className="text-xs text-gray-500 leading-tight">
                      {feature.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 平台核心价值 - 最简 */}
        <div className="max-w-xl mx-auto">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-base font-semibold text-gray-900">平台核心</h2>
            </div>
            <div className="space-y-2 text-xs text-gray-700">
              <p className="flex items-start">
                <span className="text-blue-600 mr-1">•</span>
                打破医疗信息壁垒，构建医患共享的医案知识库
              </p>
              <p className="flex items-start">
                <span className="text-blue-600 mr-1">•</span>
                安全可靠，严格保护用户隐私和医案数据
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 固定在右下角的知识产权标识 */}
      <div className="fixed bottom-3 right-3 z-40">
        <div className="flex items-center space-x-1 text-[10px] text-gray-500 bg-white/90 backdrop-blur-sm px-2 py-1 rounded border border-gray-200 shadow-sm">
          <Shield className="w-2.5 h-2.5" />
          <span>© 2025 众创医案平台 · 知识产权所有</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;