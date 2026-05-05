// src/pages/mobile/MobileCommunityDetailPage.tsx
import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  Bell,
  BookOpen,
  Users,
  TrendingUp,
  MessageCircle
} from 'lucide-react';

const MobileCommunityDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const categoryName = location.state?.categoryName || '社区';
  const type = location.state?.type || 'disease';

  // 根据类型确定颜色主题
  const themeColor = type === 'disease' ? 'red' : 'teal';
  const gradientFrom = type === 'disease' ? 'from-red-600' : 'from-teal-600';
  const gradientTo = type === 'disease' ? 'to-red-400' : 'to-teal-400';

  const features = [
    {
      id: 'announcement',
      title: '社区公告',
      description: '查看社区最新公告',
      icon: Bell,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: `announcement`
    },
    {
      id: 'lecture',
      title: type === 'disease' ? '专病讲座' : '讲座',
      description: type === 'disease' ? '学习专病知识' : '学习交流',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      path: `lecture`
    },
    {
      id: 'forum',
      title: type === 'disease' ? '病友之家' : '社群之家',
      description: type === 'disease' ? '病友交流分享' : '成员交流互动',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: `forum`
    },
    {
      id: 'development',
      title: '社区发展',
      description: '社区数据和发展建议',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      path: `development`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部渐变区域 */}
      <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} px-5 pt-8 pb-12`}>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-white">{categoryName}</h1>
          <div className="w-5"></div>
        </div>
        <p className="text-white/90 text-sm">
          {type === 'disease' ? '病友互助，共同成长' : '兴趣社群，交流分享'}
        </p>
      </div>

      {/* 功能卡片网格 */}
      <div className="px-4 -mt-8">
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => navigate(`/mobile/community/${type}/${id}/${feature.path}`, {
                  state: { categoryName, type }
                })}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer active:bg-gray-50"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-500">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 社区简介 */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-2">社区简介</h3>
          <p className="text-sm text-gray-600">
            {categoryName}社区是一个专注于
            {type === 'disease' ? `${categoryName}患者和医疗工作者` : `${categoryName}兴趣爱好者`}
            的交流平台。在这里，您可以分享经验、学习知识、找到志同道合的伙伴。
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileCommunityDetailPage;
