import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Bell, 
  Clipboard, 
  AlertTriangle, 
  Users, 
  Watch,
  BarChart
} from 'lucide-react';

const HealthOnboardingPage: React.FC = () => {
  // 六大核心功能模块 - 按需求顺序排列
  const healthFeatures = [
    {
      id: 'overview',
      title: '健康概览及预警',
      description: '查看健康数据与风险预警',
      icon: <BarChart className="w-8 h-8" />,
      path: '/mobile/health/overview',
      color: 'bg-blue-500'
    },
    {
      id: 'reminder',
      title: '健康管理提醒',
      description: '用药、复诊、检查提醒',
      icon: <Bell className="w-8 h-8" />,
      path: '/mobile/health/reminder',
      color: 'bg-green-500'
    },
    {
      id: 'questionnaire',
      title: '健康问卷',
      description: '完成健康评估问卷',
      icon: <Clipboard className="w-8 h-8" />,
      path: '/mobile/health/questionnaire/adult',
      color: 'bg-purple-500'
    },
    {
      id: 'emergency',
      title: '紧急呼叫',
      description: '紧急情况一键呼叫',
      icon: <AlertTriangle className="w-8 h-8" />,
      path: '/mobile/health/emergency',
      color: 'bg-red-500'
    },
    {
      id: 'family',
      title: '家庭成员健康管理',
      description: '管理家人健康档案',
      icon: <Users className="w-8 h-8" />,
      path: '/mobile/health/family',
      color: 'bg-orange-500'
    },
    {
      id: 'wearable',
      title: '连接穿戴设备',
      description: '连接健康监测设备',
      icon: <Watch className="w-8 h-8" />,
      path: '/mobile/health/wearable',
      color: 'bg-cyan-500'
    }
  ];

  return (
    <div className="p-4">
      {/* 顶部标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">健康管理</h1>
        <p className="text-gray-600 mt-2">全面管理您的个人与家庭健康</p>
      </div>

      {/* 🗑️ 已删除：快速入口区域 - 内容与健康概览及预警重复 */}

      {/* 六大功能模块网格 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">健康功能</h2>
        <div className="grid grid-cols-2 gap-4">
          {healthFeatures.map((feature) => (
            <Link
              key={feature.id}
              to={feature.path}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
                <div className="text-white transform scale-110">
                  {feature.icon}
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 text-base mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-tight">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 待办事项 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          📋 今日待办
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white/80 rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">完成今日健康问卷</span>
            </div>
            <Link 
              to="/mobile/health/questionnaire/adult" 
              className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 transition-colors"
            >
              去填写
            </Link>
          </div>
          <div className="flex items-center justify-between bg-white/80 rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">查看健康预警提醒</span>
            </div>
            <Link 
              to="/mobile/health/overview" 
              className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 transition-colors"
            >
              查看
            </Link>
          </div>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
          基于WHO健康标准评估，为您提供科学的健康管理方案
        </p>
      </div>
    </div>
  );
};

export default HealthOnboardingPage;