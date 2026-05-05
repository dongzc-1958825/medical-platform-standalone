// src/pages/mobile/HealthOnboardingPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Bell, 
  Clipboard, 
  AlertTriangle, 
  Users, 
  Watch,
  BarChart,
  ChevronRight
} from 'lucide-react';

const HealthOnboardingPage: React.FC = () => {
  const [hasQuestionnaireResult, setHasQuestionnaireResult] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(2);

  useEffect(() => {
    // 检查是否有问卷结果
    const result = localStorage.getItem('latest_questionnaire_result');
    setHasQuestionnaireResult(!!result);
  }, []);

  // 六大核心功能模块 - 移动端列表布局
  const healthFeatures = [
    {
      id: 'overview',
      title: '健康概览及预警',
      description: '查看健康数据与风险预警',
      icon: BarChart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: '/mobile/health/overview',
      badge: hasQuestionnaireResult ? '有新报告' : null
    },
    {
      id: 'reminder',
      title: '健康管理提醒',
      description: '用药、复诊、检查提醒',
      icon: Bell,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      path: '/mobile/health/reminder',
      badge: unreadAlerts > 0 ? `${unreadAlerts}条` : null
    },
    {
      id: 'questionnaire',
      title: '健康问卷',
      description: '完成健康评估问卷',
      icon: Clipboard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/mobile/health/questionnaire/adult',
      badge: '待完成'
    },
    {
      id: 'emergency',
      title: '紧急呼叫',
      description: '紧急情况一键呼叫',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      path: '/mobile/health/emergency',
      badge: null
    },
    {
      id: 'family',
      title: '家庭成员',
      description: '管理家人健康档案',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      path: '/mobile/family',  // ✅ 修改为正确的路径
      badge: null
    },
    {
      id: 'wearable',
      title: '穿戴设备',
      description: '连接健康监测设备',
      icon: Watch,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      path: '/mobile/health/wearable',
      badge: '未连接'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部渐变区域 - 移除了多余的用户头像 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 pt-8 pb-12">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">健康管理</h1>
          <p className="text-blue-100 text-sm">你好，{localStorage.getItem('user_name') || '用户'}！</p>
        </div>
        
        {/* 健康评分快捷卡片 - 仅在问卷完成时显示 */}
        {hasQuestionnaireResult && (
          <Link 
            to="/mobile/health/questionnaire/adult/result"
            className="block bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mt-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center mr-3">
                  <Activity className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <p className="text-xs text-blue-100">最新健康评分</p>
                  <p className="text-lg font-semibold text-white">85分 · 良好</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/80" />
            </div>
          </Link>
        )}
      </div>

      {/* 主要内容区域 - 负margin制造重叠效果 */}
      <div className="px-4 -mt-8">
        {/* 功能模块列表 - 类似"我的"页面风格 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
          <div className="divide-y divide-gray-100">
            {healthFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.id}
                  to={feature.path}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center flex-1">
                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mr-4`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-0.5">
                        <span className="font-medium text-gray-900">{feature.title}</span>
                        {feature.badge && (
                          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                            feature.badge === '未连接' ? 'bg-gray-100 text-gray-600' :
                            feature.badge === '待完成' ? 'bg-blue-100 text-blue-600' :
                            feature.badge === '有新报告' ? 'bg-green-100 text-green-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {feature.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* 待办事项卡片 */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            今日待办
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                  <Clipboard className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700">完成健康问卷</span>
              </div>
              <Link 
                to="/mobile/health/questionnaire/adult" 
                className="text-xs text-blue-600 font-medium"
              >
                去填写
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center mr-3">
                  <Bell className="w-4 h-4 text-yellow-600" />
                </div>
                <span className="text-sm text-gray-700">查看健康预警</span>
              </div>
              <Link 
                to="/mobile/health/overview" 
                className="text-xs text-blue-600 font-medium"
              >
                查看
              </Link>
            </div>
          </div>
        </div>

        {/* 健康贴士卡片 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-blue-100">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">今日健康贴士</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                保持规律作息，每天保证7-8小时睡眠。适量运动，每周进行150分钟中等强度有氧运动。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthOnboardingPage;