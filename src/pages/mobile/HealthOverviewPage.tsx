import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Heart,
  Activity,
  Brain,
  Users,
  Apple,
  Scale,
  FileText,
  TrendingUp,
  Clock,
  Award,
  ChevronRight,
  AlertCircle,
  History
} from 'lucide-react';

interface HealthReport {
  totalScore: number;
  healthLevel: string;
  assessmentTime: string;
  bmi: number;
  bmiCategory: string;
}

const HealthOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [latestReport, setLatestReport] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportCount, setReportCount] = useState(0);

  useEffect(() => {
    loadLatestReport();
    loadReportCount();
  }, []);

  const loadLatestReport = () => {
    try {
      const storedResult = localStorage.getItem('latest_questionnaire_result');
      console.log('HealthOverview - 读取最新报告:', storedResult ? '✅ 有数据' : '❌ 无数据');
      
      if (storedResult) {
        const parsed = JSON.parse(storedResult);
        console.log('HealthOverview - 解析结果:', {
          totalScore: parsed.totalScore,
          healthLevel: parsed.healthLevel,
          assessmentTime: parsed.assessmentTime,
          bmi: parsed.bmi
        });
        
        // ✅ 确保 assessmentTime 存在
        if (!parsed.assessmentTime) {
          console.warn('HealthOverview - assessmentTime 缺失，使用当前时间');
          parsed.assessmentTime = new Date().toISOString();
        }
        
        setLatestReport({
          totalScore: parsed.totalScore,
          healthLevel: parsed.healthLevel,
          assessmentTime: parsed.assessmentTime,
          bmi: parsed.bmi,
          bmiCategory: parsed.bmiCategory
        });
      }
    } catch (error) {
      console.error('HealthOverview - 加载最新报告失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReportCount = () => {
    try {
      const history = localStorage.getItem('questionnaire_history');
      if (history) {
        const parsed = JSON.parse(history);
        setReportCount(Array.isArray(parsed) ? parsed.length : 0);
        console.log('HealthOverview - 历史记录数量:', parsed.length);
      }
    } catch (error) {
      console.error('HealthOverview - 加载报告数量失败:', error);
    }
  };

  // ✅ 根本性修复：完整的日期格式化函数
  const formatDate = (dateString: string | undefined): string => {
    // 1. 处理 undefined 或 null
    if (!dateString) {
      console.warn('HealthOverview - 日期字符串为空');
      return '未知时间';
    }
    
    try {
      // 2. 创建 Date 对象
      const date = new Date(dateString);
      
      // 3. 验证日期是否有效
      if (isNaN(date.getTime())) {
        console.error('HealthOverview - 无效日期字符串:', dateString);
        return '无效日期';
      }
      
      // 4. 格式化：YYYY年MM月DD日
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      
      return `${year}年${month}月${day}日`;
      
    } catch (error) {
      console.error('HealthOverview - 日期格式化异常:', error, dateString);
      return '日期错误';
    }
  };

  // ✅ 获取最近评估的相对时间（用于历史记录卡片）
  const getLatestAssessmentTime = (): string => {
    if (!latestReport?.assessmentTime) return '暂无';
    
    try {
      const date = new Date(latestReport.assessmentTime);
      if (isNaN(date.getTime())) return '日期无效';
      
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return '今天';
      if (diffDays === 1) return '昨天';
      if (diffDays < 7) return `${diffDays}天前`;
      
      return formatDate(latestReport.assessmentTime);
      
    } catch {
      return formatDate(latestReport.assessmentTime);
    }
  };

  const getHealthLevelColor = (level: string) => {
    const colors = {
      '优秀': 'bg-green-100 text-green-700',
      '良好': 'bg-blue-100 text-blue-700',
      '中等': 'bg-yellow-100 text-yellow-700',
      '较差': 'bg-orange-100 text-orange-700',
      '危险': 'bg-red-100 text-red-700'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getHealthLevelBg = (level: string) => {
    const colors = {
      '优秀': 'from-green-500 to-green-600',
      '良好': 'from-blue-500 to-blue-600',
      '中等': 'from-yellow-500 to-yellow-600',
      '较差': 'from-orange-500 to-orange-600',
      '危险': 'from-red-500 to-red-600'
    };
    return colors[level as keyof typeof colors] || 'from-blue-500 to-blue-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate('/mobile/health')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>返回</span>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">健康概览</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 最新报告卡片 */}
        {latestReport ? (
          <div 
            onClick={() => navigate('/mobile/health/questionnaire/adult/result')}
            className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all"
          >
            <div className={`bg-gradient-to-r ${getHealthLevelBg(latestReport.healthLevel)} px-5 py-4 text-white`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium text-white/90">最新健康报告</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm`}>
                  {latestReport.healthLevel}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-white/80 mb-1">综合健康评分</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{latestReport.totalScore}</span>
                    <span className="text-sm ml-1">分</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/80" />
              </div>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-2">
                    <Scale className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">BMI指数</p>
                    <div className="flex items-baseline">
                      <span className="text-sm font-semibold text-gray-900">{latestReport.bmi.toFixed(1)}</span>
                      <span className={`text-xs ml-1 ${
                        latestReport.bmiCategory === '正常体重' ? 'text-green-600' : 
                        latestReport.bmiCategory === '体重不足' ? 'text-blue-600' : 'text-yellow-600'
                      }`}>
                        {latestReport.bmiCategory}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">评估时间</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(latestReport.assessmentTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">暂无健康报告</h3>
            <p className="text-sm text-gray-500 mb-4">完成健康问卷，获取您的专属健康报告</p>
            <button
              onClick={() => navigate('/mobile/health/questionnaire/adult')}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              立即评估
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}

        {/* 历史记录入口卡片 */}
        <div 
          onClick={() => navigate('/mobile/health/questionnaire/history')}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-sm p-5 text-white cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <History className="w-6 h-6 mr-2" />
              <div>
                <h2 className="text-base font-semibold">历史评估记录</h2>
                <p className="text-xs text-purple-100 mt-0.5">查看您的健康评估历史</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold mr-2">{reportCount}</span>
              <span className="text-sm text-purple-100">份报告</span>
            </div>
          </div>
          
          {/* 最近评估预览 */}
          {reportCount > 0 && latestReport && (
            <div className="mt-2 pt-2 border-t border-purple-400/30">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-100">最近评估</span>
                <span className="text-white font-medium">
                  {getLatestAssessmentTime()}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-purple-100">综合评分</span>
                <span className="text-white font-semibold">{latestReport.totalScore}分</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-end mt-3 text-xs text-purple-100">
            <span>查看全部</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </div>
        </div>

        {/* 健康指标卡片 */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 text-blue-600 mr-2" />
            今日健康指标
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Heart className="w-5 h-5 text-blue-600" />
                <span className="text-xs text-gray-500">静息心率</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">72</p>
              <p className="text-xs text-gray-500 mt-1">次/分钟</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-5 h-5 text-green-600" />
                <span className="text-xs text-gray-500">血压</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">118/76</p>
              <p className="text-xs text-gray-500 mt-1">mmHg</p>
            </div>
          </div>
        </div>

        {/* 健康维度概览 */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">健康维度</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600">身体健康</span>
              </div>
              {latestReport ? (
                <span className="text-sm font-medium text-gray-900">良好</span>
              ) : (
                <span className="text-xs text-gray-400">暂无数据</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Brain className="w-4 h-4 text-purple-500 mr-2" />
                <span className="text-sm text-gray-600">心理健康</span>
              </div>
              {latestReport ? (
                <span className="text-sm font-medium text-gray-900">良好</span>
              ) : (
                <span className="text-xs text-gray-400">暂无数据</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-600">社会适应</span>
              </div>
              {latestReport ? (
                <span className="text-sm font-medium text-gray-900">良好</span>
              ) : (
                <span className="text-xs text-gray-400">暂无数据</span>
              )}
            </div>
          </div>
        </div>

        {/* 健康建议 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm p-5 text-white">
          <h2 className="text-base font-semibold mb-2 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            今日健康贴士
          </h2>
          <p className="text-sm text-blue-100">
            保持规律作息，每天保证7-8小时睡眠时间。
            适量运动，每周进行150分钟中等强度有氧运动。
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthOverviewPage;