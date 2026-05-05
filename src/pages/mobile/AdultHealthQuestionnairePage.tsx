import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { adultHealthQuestionnaire } from '../../shared/data/adultHealthQuestionnaire';
import { ComprehensiveHealthScoringService } from '../../shared/services/comprehensiveHealthScoringService';
import { questionnaireStorageService } from '../../shared/services/questionnaireStorageService';
import type { 
  AdultHealthQuestionnaire, 
  QuestionnaireSection 
} from '../../shared/types/health';

const AdultHealthQuestionnairePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bmi, setBmi] = useState<{ value: number; category: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = adultHealthQuestionnaire.sections;
  const currentSection = sections[currentSectionIndex];
  const progress = ((currentSectionIndex + 1) / sections.length) * 100;

  // 初始化：加载已保存的答案
  useEffect(() => {
    const savedData = localStorage.getItem('adult_questionnaire_temp');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setAnswers(parsed.answers || {});
        setCurrentSectionIndex(parsed.currentSection || 0);
      } catch (error) {
        console.error('加载暂存数据失败:', error);
      }
    }
  }, []);

  // 自动保存答案
  useEffect(() => {
    localStorage.setItem('adult_questionnaire_temp', JSON.stringify({
      answers,
      currentSection: currentSectionIndex
    }));
  }, [answers, currentSectionIndex]);

  // 计算BMI
  useEffect(() => {
    const height = answers['height'];
    const weight = answers['weight'];
    
    if (height && weight && height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      
      let category = '';
      if (bmiValue < 18.5) category = '体重不足';
      else if (bmiValue < 24) category = '正常体重';
      else if (bmiValue < 28) category = '超重';
      else category = '肥胖';
      
      setBmi({ value: bmiValue, category });
    } else {
      setBmi(null);
    }
  }, [answers['height'], answers['weight']]);

  // 验证当前部分
  const validateSection = (section: QuestionnaireSection): boolean => {
    const sectionErrors: Record<string, string> = {};
    let isValid = true;

    section.questions.forEach(question => {
      if (question.required) {
        const value = answers[question.id];
        
        if (value === undefined || value === null || value === '') {
          sectionErrors[question.id] = `${question.text}是必填项`;
          isValid = false;
        } else if (question.type === 'number' && question.validation) {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            sectionErrors[question.id] = `${question.text}必须是有效的数字`;
            isValid = false;
          } else {
            if (question.validation.min !== undefined && numValue < question.validation.min) {
              sectionErrors[question.id] = `${question.text}不能小于${question.validation.min}`;
              isValid = false;
            }
            if (question.validation.max !== undefined && numValue > question.validation.max) {
              sectionErrors[question.id] = `${question.text}不能大于${question.validation.max}`;
              isValid = false;
            }
          }
        } else if (Array.isArray(value) && value.length === 0) {
          sectionErrors[question.id] = `请至少选择一项`;
          isValid = false;
        }
      }
    });

    setErrors(sectionErrors);
    return isValid;
  };

  // 处理答案变更
  const handleAnswerChange = (questionId: string, value: any) => {
    if (questionId === 'height' || questionId === 'weight' || questionId === 'waistline' || questionId === 'age') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && value !== '') {
        setAnswers(prev => ({ ...prev, [questionId]: numValue }));
      } else {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
      }
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: value }));
    }

    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  // 处理下一步
  const handleNext = () => {
    console.log('========== handleNext 被调用 ==========');
    console.log('当前部分索引:', currentSectionIndex);
    console.log('总部分数:', sections.length);
    console.log('是否最后一部分:', currentSectionIndex === sections.length - 1);
    console.log('当前部分ID:', currentSection?.id);
    
    const isValid = validateSection(currentSection);
    console.log('验证结果:', isValid);
    console.log('当前错误:', errors);
    
    if (isValid) {
      if (currentSectionIndex < sections.length - 1) {
        console.log('👉 进入下一部分');
        setCurrentSectionIndex(prev => prev + 1);
        window.scrollTo(0, 0);
      } else {
        console.log('👉 最后一部分，准备提交');
        handleSubmit();
      }
    } else {
      console.log('❌ 验证失败，请填写必填项');
    }
  };

  // 处理上一步
  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // 处理提交 - 完整版本
  const handleSubmit = async () => {
    console.log('========== handleSubmit 被调用 ==========');
    console.log('提交时间:', new Date().toISOString());
    
    // 防止重复提交
    if (isSubmitting) {
      console.log('❌ 正在提交中，请勿重复点击');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('1. 开始提交问卷，答案数量:', Object.keys(answers).length);
      
      // 验证最后一部分
      const isValid = validateSection(currentSection);
      console.log('2. 验证结果:', isValid);
      
      if (!isValid) {
        console.log('❌ 验证失败，无法提交');
        setIsSubmitting(false);
        return;
      }

      // 获取用户ID
      console.log('3. 获取用户信息...');
      let userId = 'anonymous';
      try {
        const userStr = localStorage.getItem('current-user');
        if (userStr) {
          const user = JSON.parse(userStr);
          userId = user.id || user.userId || 'anonymous';
          console.log('   ✅ 用户ID:', userId);
        }
      } catch (e) {
        console.error('   ❌ 解析用户信息失败:', e);
      }

      // 构建问卷数据
console.log('4. 构建问卷数据...');
const questionnaireData: AdultHealthQuestionnaire = {
  id: `adult_${Date.now()}`,
  userId: userId,
  assessmentDate: new Date().toISOString(), // ✅ ISO 8601 标准格式，保证有效
  sections: sections.map(section => ({
    sectionId: section.id,
    sectionTitle: section.title,
    answers: section.questions.map(q => ({
      questionId: q.id,
      questionText: q.text,
      answer: answers[q.id] || null
    }))
  }))
};
      console.log('   ✅ 问卷数据构建完成');

      // 计算评分
      console.log('5. 初始化评分服务...');
      const scoringService = new ComprehensiveHealthScoringService();
      console.log('6. 开始计算评分...');
      const result = scoringService.calculateScore(questionnaireData);
      console.log('   ✅ 评分结果:', {
        totalScore: result.totalScore,
        healthLevel: result.healthLevel,
        bmi: result.bmi,
        bmiCategory: result.bmiCategory
      });
      
      // 存储结果 - 这是关键步骤！
      console.log('7. 存储结果到 localStorage...');
      questionnaireStorageService.saveQuestionnaireResult({
        ...result,
        id: questionnaireData.id,
        userId: questionnaireData.userId,
        assessmentDate: questionnaireData.assessmentDate
      });
      console.log('   ✅ 结果存储完成');
      
      // 验证存储是否成功
      const savedResult = localStorage.getItem('latest_questionnaire_result');
      console.log('8. 验证存储:', savedResult ? '✅ 数据已保存' : '❌ 数据保存失败');
      
      // 清理暂存数据
      console.log('9. 清理暂存数据...');
      localStorage.removeItem('adult_questionnaire_temp');
      console.log('   ✅ 暂存数据已清理');
      
      // 跳转到结果页面
      console.log('10. 跳转到结果页面...');
      navigate('/mobile/health/questionnaire/adult/result');
      console.log('========== 提交成功 ==========');
      
    } catch (error) {
      console.error('========== 提交失败 ==========');
      console.error('错误详情:', error);
      alert('提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 渲染问题输入控件
  const renderQuestionInput = (question: any) => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`请输入${question.text}`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            min={question.validation?.min}
            max={question.validation?.max}
            step={question.validation?.step || '1'}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`请输入${question.text}`}
          />
        );

      case 'select':
        return (
          <select
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">请选择</option>
            {question.options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map((option: string) => (
              <label key={option} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option: string) => (
              <label key={option} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(answers[question.id]) && answers[question.id]?.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(answers[question.id]) ? answers[question.id] : [];
                    if (e.target.checked) {
                      handleAnswerChange(question.id, [...currentValues, option]);
                    } else {
                      handleAnswerChange(question.id, currentValues.filter((v: string) => v !== option));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div className="grid grid-cols-5 gap-2">
            {question.options?.map((option: string) => (
              <button
                key={option}
                type="button"
                onClick={() => handleAnswerChange(question.id, option)}
                className={`p-3 rounded-lg border transition-all ${
                  answers[question.id] === option
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => {
              if (window.confirm('确定退出问卷？已填写的数据将自动保存。')) {
                navigate('/mobile/health');
              }
            }}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>退出</span>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{adultHealthQuestionnaire.title}</h1>
          <div className="w-20"></div>
        </div>
        
        {/* 进度条 */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              第 {currentSectionIndex + 1}/{sections.length} 部分
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 问卷内容 */}
      <div className="p-4">
        {/* 部分标题 */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {currentSection.title}
          </h2>
          <p className="text-gray-600 text-sm">
            {currentSection.description}
          </p>
        </div>

        {/* BMI显示卡片 */}
        {bmi && currentSection.id === 'basic-info' && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">您的BMI指数</p>
                <p className="text-2xl font-bold text-gray-900">{bmi.value.toFixed(1)}</p>
                <p className={`text-sm font-medium ${
                  bmi.category === '正常体重' ? 'text-green-600' : 
                  bmi.category === '体重不足' ? 'text-blue-600' : 'text-yellow-600'
                }`}>
                  {bmi.category}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">健康体重范围</p>
                <p className="text-sm font-medium text-gray-700">18.5 - 24.0</p>
              </div>
            </div>
          </div>
        )}

        {/* 问题列表 */}
        <div className="space-y-6">
          {currentSection.questions.map((question) => (
            <div key={question.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="mb-3">
                <label className="flex items-start">
                  <span className="text-base font-medium text-gray-900">
                    {question.text}
                  </span>
                  {question.required && (
                    <span className="ml-1 text-red-500 text-sm">*</span>
                  )}
                </label>
                {question.description && (
                  <p className="text-sm text-gray-500 mt-1">{question.description}</p>
                )}
              </div>
              
              {renderQuestionInput(question)}
              
              {errors[question.id] && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>{errors[question.id]}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 导航按钮 */}
        <div className="flex space-x-3 mt-8 mb-12">
          {currentSectionIndex > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              上一步
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`flex-1 flex items-center justify-center px-4 py-3 font-medium rounded-lg transition-colors ${
              isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                提交中...
              </>
            ) : (
              <>
                {currentSectionIndex === sections.length - 1 ? '提交' : '下一步'}
                {currentSectionIndex < sections.length - 1 && (
                  <ChevronRight className="w-5 h-5 ml-1" />
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdultHealthQuestionnairePage;