import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Bell, 
  Clipboard, 
  AlertTriangle, 
  Users, 
  Watch,
  BarChart,
  Heart
} from 'lucide-react';

const HealthOnboardingPage: React.FC = () => {
  const healthFeatures = [
    {
      id: 'overview',
      title: '健康概览',
      description: '查看您的综合健康数据',
      icon: <BarChart className="w-8 h-8" />,
      path: '/mobile/health/overview',
      color: 'bg-blue-500'
    },
    {
      id: 'reminder',
      title: '健康提醒',
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
      path: '/mobile/health/questionnaire',
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
      title: '家庭成员',
      description: '管理家人健康档案',
      icon: <Users className="w-8 h-8" />,
      path: '/mobile/health/family',
      color: 'bg-orange-500'
    },
    {
      id: 'wearable',
      title: '穿戴设备',
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

      {/* 快速入口 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">快速入口</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link 
            to="/mobile/health/critical-info"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <Heart className="w-6 h-6 mb-2" />
            <div className="font-semibold">关键信息</div>
            <div className="text-sm opacity-90">完善基础健康档案</div>
          </Link>
          
          <Link 
            to="/mobile/health/overview"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <Activity className="w-6 h-6 mb-2" />
            <div className="font-semibold">健康概览</div>
            <div className="text-sm opacity-90">查看健康数据</div>
          </Link>
        </div>
      </div>

      {/* 六大功能模块 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">健康功能</h2>
        <div className="grid grid-cols-2 gap-3">
          {healthFeatures.map((feature) => (
            <Link
              key={feature.id}
              to={feature.path}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 最近活动/通知 */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-semibold text-blue-800 mb-2">?? 待办事项</h3>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span>请完善关键健康信息</span>
            <Link to="/mobile/health/critical-info" className="ml-auto text-blue-600 text-xs font-medium">
              去完善 →
            </Link>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span>有1份待完成的健康问卷</span>
            <Link to="/mobile/health/questionnaire" className="ml-auto text-blue-600 text-xs font-medium">
              去填写 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthOnboardingPage;
