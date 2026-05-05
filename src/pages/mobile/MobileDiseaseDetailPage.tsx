import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Bell,
  BookOpen,
  Users,
  TrendingUp,
  ChevronLeft
} from 'lucide-react';

const MobileDiseaseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { diseaseId } = useParams<{ diseaseId: string }>();
  const location = useLocation();

  // 根据diseaseId获取病种名称
  const getDiseaseName = (id: string) => {
    const diseaseMap: Record<string, string> = {
      'gxy': '高血压',
      'tnb': '糖尿病',
      'gxb': '冠心病',
      'gjy': '关节炎',
      'copf': '慢阻肺',
      'pjs': '偏头痛',
      'qgy': '青光眼',
      'sxeb': '神经性耳聋',
      'fxm': '风湿病',
      'ylxgb': '乙型肝炎',
      'yxj': '抑郁症',
      'gm': '感冒'
    };
    return diseaseMap[id] || '专病';
  };

  const diseaseName = location.state?.diseaseName || getDiseaseName(diseaseId || '');

  const features = [
    {
      id: 'announcement',
      title: '社区公告',
      description: '最新通知、活动预告',
      icon: Bell,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: `/mobile/community/${diseaseId}/announcement`
    },
    {
      id: 'lecture',
      title: '专病讲座',
      description: '专家讲座、健康科普',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      path: `/mobile/community/${diseaseId}/lecture`
    },
    {
      id: 'forum',
      title: '病友之家',
      description: '经验分享、互帮互助',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: `/mobile/community/${diseaseId}/forum`
    },
    {
      id: 'development',
      title: '社区发展',
      description: '社区建设、意见反馈',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      path: `/mobile/community/${diseaseId}/development`
    }
  ];

  const handleFeatureClick = (feature: typeof features[0]) => {
    navigate(feature.path, { state: { diseaseName } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center p-4">
          <button 
            onClick={() => navigate('/mobile/community')} 
            className="text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">
            {diseaseName}社区
          </h1>
          <div className="w-5" /> {/* 占位，保持标题居中 */}
        </div>
      </div>

      {/* 欢迎语 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-6 text-white">
        <p className="text-sm leading-relaxed">
          祝愿大家在科学指导、共享经验、互帮互助下，<br />
          战胜疾病，重返健康，享受生活。
        </p>
      </div>

      {/* 功能卡片网格 */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => handleFeatureClick(feature)}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer active:bg-gray-50"
              >
                <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-500">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* 社区统计信息 */}
        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span>病友总数</span>
            </div>
            <span className="font-semibold text-gray-900">1,234人</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-500" />
              <span>今日动态</span>
            </div>
            <span className="font-semibold text-gray-900">15条</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDiseaseDetailPage;