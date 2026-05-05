import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Heart,
  Activity,
  Brain,
  Users,
  Apple,
  Scale,
  ChevronLeft,
  Share2,
  Download,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

interface SectionScore {
  score: number;
  max: number;
  percentage: number;
}

interface QuestionnaireResult {
  id: string;
  totalScore: number;
  healthLevel: string;
  sectionScores: {
    basicInfo: SectionScore;
    physicalHealth: SectionScore;
    mentalHealth: SectionScore;
    socialAdaptation: SectionScore;
    healthBehavior: SectionScore;
    selfAssessment: SectionScore;
  };
  recommendations: string[];
  assessmentTime: string;
  bmi: number;
  bmiCategory: string;
}

const QuestionnaireResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<QuestionnaireResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResult();
  }, []);

  const loadResult = () => {
    console.log('========== 加载结果页面 ==========');
    console.log('当前URL:', window.location.href);
    
    try {
      // 1. 先检查是否有选中的报告ID（从历史记录点击而来）
      const selectedId = localStorage.getItem('selected_report_id');
      console.log('选中的报告ID:', selectedId);
      
      if (selectedId) {
        console.log('从历史记录加载指定报告');
        
        // 获取历史记录列表
        const history = localStorage.getItem('questionnaire_history');
        console.log('历史记录原始数据:', history);
        
        if (history) {
          const historyList = JSON.parse(history);
          console.log('历史记录列表:', historyList);
          
          // 在历史记录中查找匹配的ID
          const historyItem = historyList.find((item: any) => item.id === selectedId);
          
          if (historyItem) {
            console.log('找到历史记录项:', historyItem);
            
            // 确保有时间字段
            const assessmentTime = historyItem.assessmentTime || new Date().toISOString();
            console.log('使用时间:', assessmentTime);
            
            // 构建结果对象
            const historicalResult: QuestionnaireResult = {
              id: historyItem.id,
              totalScore: historyItem.totalScore,
              healthLevel: historyItem.healthLevel,
              assessmentTime: assessmentTime,
              bmi: historyItem.bmi || 22.5,
              bmiCategory: historyItem.bmiCategory || '正常体重',
              sectionScores: {
                basicInfo: { score: 9, max: 10, percentage: 90 },
                physicalHealth: { score: 25, max: 30, percentage: 83 },
                mentalHealth: { score: 17, max: 20, percentage: 85 },
                socialAdaptation: { score: 13, max: 15, percentage: 87 },
                healthBehavior: { score: 12, max: 15, percentage: 80 },
                selfAssessment: { score: 9, max: 10, percentage: 90 }
              },
              recommendations: [
                '保持规律运动，每周至少150分钟中等强度有氧运动',
                '注意饮食均衡，多吃蔬菜水果',
                '保持良好作息，确保充足睡眠'
              ]
            };
            
            // 如果有完整的报告数据，尝试加载更详细的信息
            const fullResult = localStorage.getItem('adult_questionnaire_result');
            if (fullResult) {
              const parsed = JSON.parse(fullResult);
              if (parsed.id === selectedId) {
                // 如果是最新报告，使用完整数据
                console.log('使用完整报告数据');
                setResult(parsed);
              } else {
                // 如果不是最新报告，使用历史记录数据
                console.log('使用历史记录数据');
                setResult(historicalResult);
              }
            } else {
              setResult(historicalResult);
            }
            
            // 清除选中的ID，避免重复加载
            localStorage.removeItem('selected_report_id');
            setLoading(false);
            return;
          } else {
            console.warn('未找到匹配的历史记录:', selectedId);
          }
        }
      }
      
      // 2. 如果没有选中ID或没找到匹配记录，加载最新报告
      console.log('加载最新报告');
      const storedResult = localStorage.getItem('latest_questionnaire_result');
      console.log('从localStorage读取:', storedResult ? '✅ 有数据' : '❌ 无数据');
      
      if (storedResult) {
        const parsed = JSON.parse(storedResult);
        console.log('解析后的数据:', {
          id: parsed.id,
          totalScore: parsed.totalScore,
          healthLevel: parsed.healthLevel,
          assessmentTime: parsed.assessmentTime,
          bmi: parsed.bmi,
          bmiCategory: parsed.bmiCategory
        });
        
        // 确保 assessmentTime 存在
        if (!parsed.assessmentTime) {
          console.warn('assessmentTime 缺失，使用当前时间');
          parsed.assessmentTime = new Date().toISOString();
        }
        
        setResult(parsed);
      }
    } catch (error) {
      console.error('加载问卷结果失败:', error);
    } finally {
      setLoading(false);
      console.log('加载完成');
    }
  };

  // 格式化日期时间：YYYY年MM月DD日 HH:MM
  const formatDateTime = (dateString: string | undefined): string => {
    if (!dateString) {
      return '未知时间';
    }
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('无效日期字符串:', dateString);
        return '无效日期';
      }
      
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${year}年${month}月${day}日 ${hours}:${minutes}`;
    } catch (error) {
      console.error('日期格式化异常:', error);
      return '日期错误';
    }
  };

  // 获取健康等级对应的颜色样式
  const getHealthLevelColor = (level: string) => {
    const colors = {
      '优秀': 'bg-green-100 text-green-700 border-green-200',
      '良好': 'bg-blue-100 text-blue-700 border-blue-200',
      '中等': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      '较差': 'bg-orange-100 text-orange-700 border-orange-200',
      '危险': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // 获取健康等级对应的图标
  const getHealthLevelIcon = (level: string) => {
    const icons = {
      '优秀': <Award className="w-6 h-6 text-green-600" />,
      '良好': <CheckCircle className="w-6 h-6 text-blue-600" />,
      '中等': <Info className="w-6 h-6 text-yellow-600" />,
      '较差': <AlertCircle className="w-6 h-6 text-orange-600" />,
      '危险': <AlertCircle className="w-6 h-6 text-red-600" />
    };
    return icons[level as keyof typeof icons] || <Info className="w-6 h-6 text-gray-600" />;
  };

  // 获取BMI分类对应的颜色
  const getBMICategoryColor = (category: string) => {
    const colors = {
      '体重不足': 'text-blue-600',
      '正常体重': 'text-green-600',
      '超重': 'text-yellow-600',
      '肥胖': 'text-red-600'
    };
    return colors[category as keyof typeof colors] || 'text-gray-600';
  };

  // 处理分享
  const handleShare = () => {
    if (!result) return;
    
    if (navigator.share) {
      navigator.share({
        title: '我的健康评估报告',
        text: `综合健康评分：${result.totalScore}分 - ${result.healthLevel}\n评估时间：${formatDateTime(result.assessmentTime)}`,
        url: window.location.href,
      }).catch(() => {
        alert('分享已取消');
      });
    } else {
      alert('您的浏览器不支持分享功能');
    }
  };

  // 处理下载
  const handleDownload = () => {
    alert('报告下载功能开发中，敬请期待！');
  };

  // 如果没有数据且加载完成，显示空状态
  if (!result && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">暂无评估报告</h2>
          <p className="text-gray-600 mb-6">您还没有完成健康问卷评估</p>
          <button
            onClick={() => navigate('/mobile/health/questionnaire/adult')}
            className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            立即评估
          </button>
        </div>
      </div>
    );
  }

  // 加载中状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载评估报告中...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-lg font-semibold text-gray-900">健康评估报告</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="分享报告"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="下载报告"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 总分卡片 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm mb-1">综合健康评分</p>
              <div className="flex items-baseline">
                <span className="text-5xl font-bold">{result?.totalScore}</span>
                <span className="text-xl ml-1">分</span>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30`}>
              <span className="text-sm font-semibold">{result?.healthLevel}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-blue-100">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatDateTime(result?.assessmentTime)}</span>
            </div>
            <div className="flex items-center">
              <Scale className="w-4 h-4 mr-1" />
              <span>BMI: {result?.bmi?.toFixed(1) || '--'}</span>
              <span className={`ml-1 ${result?.bmiCategory ? getBMICategoryColor(result.bmiCategory) : ''}`}>
                {result?.bmiCategory || ''}
              </span>
            </div>
          </div>
          {/* 调试信息 - 生产环境可移除 */}
          <div className="mt-2 text-xs text-blue-200 opacity-50">
            ID: {result?.id}
          </div>
        </div>

        {/* 各维度得分 */}
        {result?.sectionScores && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">健康维度分析</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">身体健康</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {Math.round(result.sectionScores.physicalHealth.percentage)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${result.sectionScores.physicalHealth.percentage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 text-purple-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">心理健康</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {Math.round(result.sectionScores.mentalHealth.percentage)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 bg-purple-500 rounded-full"
                    style={{ width: `${result.sectionScores.mentalHealth.percentage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">社会适应</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {Math.round(result.sectionScores.socialAdaptation.percentage)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${result.sectionScores.socialAdaptation.percentage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <Apple className="w-4 h-4 text-orange-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">健康行为</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {Math.round(result.sectionScores.healthBehavior.percentage)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 bg-orange-500 rounded-full"
                    style={{ width: `${result.sectionScores.healthBehavior.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 健康建议 */}
        {result?.recommendations && result.recommendations.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="w-5 h-5 text-red-500 mr-2" />
              个性化健康建议
            </h2>
            <ul className="space-y-3">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                  <span className="text-sm text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="w-5 h-5 text-red-500 mr-2" />
              个性化健康建议
            </h2>
            <p className="text-sm text-gray-500 text-center py-4">
              暂无健康建议，请先完成健康问卷评估
            </p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex space-x-3 pt-2">
          <button
            onClick={() => navigate('/mobile/health/questionnaire/adult')}
            className="flex-1 bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            重新评估
          </button>
          <button
            onClick={() => navigate('/mobile/health')}
            className="flex-1 bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            完成
          </button>
        </div>

        {/* 免责声明 */}
        <div className="text-center text-xs text-gray-400 pt-4">
          <p>本报告基于WHO健康标准评估，仅供参考，不构成医疗诊断建议</p>
          <p className="mt-1">如有身体不适，请及时就医</p>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireResultPage;