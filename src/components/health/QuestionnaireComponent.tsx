import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  QuestionnaireSection, 
  HealthQuestion, 
  QuestionnaireAnswer 
} from '../../shared/types/health';
import { healthQuestionnaire } from '../../shared/data/questionnaireData';
import { QuestionnaireScoringService } from '../../shared/services/questionnaireScoringService';

interface QuestionnaireProps {
  onComplete?: (result: any) => void;
}

const QuestionnaireComponent: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const scoringService = new QuestionnaireScoringService();
  
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionnaireAnswer>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestionnaire = healthQuestionnaire[currentSection];

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        questionId,
        answer: value
      }
    }));
  };

  const handleNext = () => {
    if (currentSection < healthQuestionnaire.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // 计算每个部分的分数
      const sections: Record<string, any> = {};
      
      healthQuestionnaire.forEach(section => {
        let sectionScore = 0;
        let maxSectionScore = 0;
        const sectionAnswers: QuestionnaireAnswer[] = [];

        section.questions.forEach(question => {
          const answer = answers[question.id];
          if (answer) {
            // 计算单个问题的分数
            let score = 0;
            
            if (question.type === 'multiple' && Array.isArray(answer.answer)) {
              // 多选题：累加所有选项分数
              question.options?.forEach(option => {
                if (answer.answer.includes(option.value)) {
                  score += option.score;
                }
              });
            } else if (question.type === 'single') {
              // 单选题：找到对应选项的分数
              const selectedOption = question.options?.find(
                opt => opt.value === answer.answer
              );
              score = selectedOption?.score || 0;
            } else if (question.type === 'scale' && question.scale?.scoreMapping) {
              // 量表题：使用映射分数
              score = question.scale.scoreMapping[Number(answer.answer)] || 0;
            }
            
            answer.score = score;
            sectionAnswers.push(answer);
            sectionScore += score;
            
            // 计算最大可能分数
            if (question.type === 'multiple') {
              // 多选题：正分选项之和
              const positiveScores = question.options
                ?.filter(opt => opt.score > 0)
                .reduce((sum, opt) => sum + opt.score, 0) || 0;
              maxSectionScore += positiveScores;
            } else {
              // 单选和量表：最高分选项
              const maxScore = Math.max(...(question.options?.map(o => o.score) || [0]));
              maxSectionScore += maxScore;
            }
          }
        });

        sections[section.id] = {
          score: sectionScore,
          maxScore: maxSectionScore,
          answers: sectionAnswers
        };
      });

      // 计算最终结果
      const result = scoringService.calculateResult(sections);
      
      // 存储结果到本地存储
      localStorage.setItem('lastQuestionnaireResult', JSON.stringify(result));
      
      // 回调处理完成事件
      if (onComplete) {
        onComplete(result);
      }
      
      // 导航到结果页面
      navigate('/mobile/health/questionnaire/result', { state: { result } });
      
    } catch (error) {
      console.error('提交问卷失败:', error);
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: HealthQuestion) => {
    const currentAnswer = answers[question.id]?.answer;

    switch (question.type) {
      case 'single':
        return (
          <div className="space-y-2">
            {question.options?.map(option => (
              <label
                key={option.value}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                  currentAnswer === option.value
                    ? 'bg-blue-50 border-blue-500'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={currentAnswer === option.value}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  className="h-4 w-4 text-blue-600"
                  required={question.required}
                />
                <span className="ml-3">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'multiple':
        return (
          <div className="space-y-2">
            {question.options?.map(option => (
              <label
                key={option.value}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                  Array.isArray(currentAnswer) && currentAnswer.includes(option.value)
                    ? 'bg-blue-50 border-blue-500'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  name={question.id}
                  value={option.value}
                  checked={Array.isArray(currentAnswer) && currentAnswer.includes(option.value)}
                  onChange={(e) => {
                    const newValue = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
                    if (e.target.checked) {
                      newValue.push(option.value);
                    } else {
                      const index = newValue.indexOf(option.value);
                      if (index > -1) newValue.splice(index, 1);
                    }
                    handleAnswer(question.id, newValue);
                  }}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-3">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'scale':
        if (!question.scale) return null;
        
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{question.scale.labels?.[question.scale.min]}</span>
              <span>{question.scale.labels?.[question.scale.max]}</span>
            </div>
            <input
              type="range"
              min={question.scale.min}
              max={question.scale.max}
              step={question.scale.step}
              value={currentAnswer || question.scale.min}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              required={question.required}
            />
            <div className="text-center">
              <span className="text-lg font-semibold text-blue-600">
                {currentAnswer || question.scale.min}
              </span>
              {question.scale.labels?.[Number(currentAnswer)] && (
                <p className="text-sm text-gray-600 mt-1">
                  {question.scale.labels[Number(currentAnswer)]}
                </p>
              )}
            </div>
          </div>
        );

      case 'input':
        return (
          <input
            type={question.id === 'age' ? 'number' : 'text'}
            value={currentAnswer || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`请输入${question.question}`}
            required={question.required}
          />
        );

      default:
        return null;
    }
  };

  const getProgress = () => {
    const totalQuestions = healthQuestionnaire.flatMap(s => s.questions).length;
    const answeredQuestions = Object.keys(answers).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>问卷进度</span>
          <span>{getProgress()}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      </div>

      {/* 当前部分 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="mb-4">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            第 {currentSection + 1} 部分 / {healthQuestionnaire.length}
          </span>
          <h2 className="text-xl font-bold text-gray-800 mt-2">
            {currentQuestionnaire.title}
          </h2>
          {currentQuestionnaire.description && (
            <p className="text-gray-600 mt-1">{currentQuestionnaire.description}</p>
          )}
        </div>

        <div className="space-y-6">
          {currentQuestionnaire.questions.map((question) => (
            <div key={question.id} className="border-b pb-6 last:border-0">
              <label className="block text-lg font-medium text-gray-700 mb-3">
                {question.question}
                {question.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              {renderQuestion(question)}
            </div>
          ))}
        </div>
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between sticky bottom-4 bg-white p-4 rounded-xl shadow-lg">
        <button
          onClick={handlePrevious}
          disabled={currentSection === 0}
          className={`px-6 py-3 rounded-lg font-medium ${
            currentSection === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          上一部分
        </button>

        {currentSection < healthQuestionnaire.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            下一部分
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? '提交中...' : '提交问卷'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireComponent;