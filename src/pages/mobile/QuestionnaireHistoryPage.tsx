import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  FileText, 
  Calendar, 
  Activity, 
  Heart, 
  ChevronRight,
  TrendingUp,
  Scale,
  Clock,
  Award,
  AlertCircle
} from 'lucide-react';
import { questionnaireStorageService } from '../../shared/services/questionnaireStorageService';

interface HistoryItem {
  id: string;
  totalScore: number;
  healthLevel: string;
  assessmentTime: string;
  bmi?: number;
  bmiCategory?: string;
}

const QuestionnaireHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const historyData = questionnaireStorageService.getHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('加载历史记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (id: string) => {
  console.log('查看报告，ID:', id);
  localStorage.setItem('selected_report_id', id);
  navigate('/mobile/health/questionnaire/adult/result');
};

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这份评估报告吗？')) {
      questionnaireStorageService.deleteHistoryItem(id);
      loadHistory(); // 重新加载列表
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

 // 完善日期格式化函数 - 处理各种异常情况
const formatDate = (dateString: string) => {
  // 处理空值
  if (!dateString) {
    return '未知时间';
  }
  
  try {
    const date = new Date(dateString);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      console.warn('无效日期格式:', dateString);
      return '日期无效';
    }
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // 格式化日期时间
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    // 今天显示"今天 HH:MM"
    if (diffDays === 0) {
      return `今天 ${hours}:${minutes}`;
    }
    // 昨天显示"昨天 HH:MM"
    else if (diffDays === 1) {
      return `昨天 ${hours}:${minutes}`;
    }
    // 一周内显示"X天前"
    else if (diffDays < 7) {
      return `${diffDays}天前`;
    }
    // 今年显示"MM-DD HH:MM"
    else if (year === now.getFullYear()) {
      return `${month}-${day} ${hours}:${minutes}`;
    }
    // 往年显示"YYYY-MM-DD HH:MM"
    else {
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
  } catch (error) {
    console.error('日期格式化错误:', error, dateString);
    return '日期错误';
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载历史记录...</p>
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
          <h1 className="text-lg font-semibold text-gray-900">历史评估报告</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="p-4">
        {/* 统计卡片 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-5 text-white mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              <span className="text-sm text-blue-100">总评估次数</span>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-200" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold">{history.length}</span>
              <span className="text-sm ml-1 text-blue-100">次</span>
            </div>
            {history.length > 0 && (
              <div className="text-right">
                <p className="text-xs text-blue-100">最近评估</p>
                <p className="text-sm font-medium">{formatDate(history[0]?.assessmentTime)}</p>
              </div>
            )}
          </div>
        </div>

        {/* 历史记录列表 */}
        {history.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无历史报告</h3>
            <p className="text-sm text-gray-500 mb-6">完成健康问卷评估，您的报告将显示在这里</p>
            <button
              onClick={() => navigate('/mobile/health/questionnaire/adult')}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              立即评估
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => handleViewReport(item.id)}
                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all cursor-pointer active:bg-gray-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="text-lg font-bold text-gray-900 mr-2">{item.totalScore}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getHealthLevelColor(item.healthLevel)}`}>
                          {item.healthLevel}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{formatDate(item.assessmentTime)}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                
                {item.bmi && (
                  <div className="flex items-center pt-2 border-t border-gray-100">
                    <Scale className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                    <span className="text-xs text-gray-600 mr-2">BMI</span>
                    <span className="text-xs font-medium text-gray-900 mr-1">{item.bmi.toFixed(1)}</span>
                    <span className={`text-xs ${item.bmiCategory === '正常体重' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {item.bmiCategory}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireHistoryPage;