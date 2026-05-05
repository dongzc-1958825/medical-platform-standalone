import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConsultationGroup, ConsultationFormData, ConsultationExample } from '../types/consultation';
import { consultationService } from '../services/consultationService';

const HelpPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'consultations' | 'new-consultation'>('consultations');
  const [consultationGroups, setConsultationGroups] = useState<ConsultationGroup[]>([]);
  const [examples, setExamples] = useState<ConsultationExample[]>([]);
  const [showExamples, setShowExamples] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ConsultationFormData>({
    mainSymptoms: '',
    mainRequests: '',
    description: '',
    category: '',
    urgency: 'medium'
  });

  useEffect(() => {
    if (activeTab === 'consultations') {
      loadConsultations();
    } else {
      loadExamples();
    }
  }, [activeTab]);

  const loadConsultations = async () => {
    setLoading(true);
    const groups = await consultationService.getGroupedConsultations();
    setConsultationGroups(groups);
    setLoading(false);
  };

  const loadExamples = async () => {
    const exampleData = await consultationService.getExamples();
    setExamples(exampleData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await consultationService.createConsultation(formData);
    if (result) {
      setFormData({
        mainSymptoms: '',
        mainRequests: '',
        description: '',
        category: '',
        urgency: 'medium'
      });
      setActiveTab('consultations');
      alert('咨询发布成功！');
    } else {
      alert('发布失败，请重试');
    }
    setLoading(false);
  };

  const handleInputChange = (field: keyof ConsultationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const useExample = (example: ConsultationExample) => {
    setFormData(prev => ({
      ...prev,
      mainSymptoms: example.mainSymptoms,
      mainRequests: example.mainRequests,
      description: example.description
    }));
    setShowExamples(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">寻医问药</h1>
          <p className="text-gray-600">获得专业的医疗建议和健康指导</p>
        </div>

        {/* 标签页导航 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'consultations'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('consultations')}
            >
              📋 咨询列表
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'new-consultation'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('new-consultation')}
            >
              ✏️ 发起咨询
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'consultations' ? (
              <ConsultationList 
                groups={consultationGroups} 
                loading={loading}
                onRefresh={loadConsultations}
              />
            ) : (
              <ConsultationForm
                formData={formData}
                examples={examples}
                showExamples={showExamples}
                loading={loading}
                onSubmit={handleSubmit}
                onInputChange={handleInputChange}
                onUseExample={useExample}
                onToggleExamples={() => setShowExamples(!showExamples)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 咨询列表组件
interface ConsultationListProps {
  groups: ConsultationGroup[];
  loading: boolean;
  onRefresh: () => void;
}

const ConsultationList: React.FC<ConsultationListProps> = ({ groups, loading, onRefresh }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无咨询</h3>
        <p className="text-gray-500 mb-4">还没有用户发起医疗咨询</p>
        <button
          onClick={onRefresh}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          刷新
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">医疗咨询</h2>
        <button
          onClick={onRefresh}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center"
        >
          🔄 刷新
        </button>
      </div>

      <div className="space-y-4">
        {groups.map((group, index) => (
          <div key={group.contentHash} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg mb-2">
                  {group.latestConsultation.mainSymptoms}
                </h3>
                
                <div className="space-y-2 mb-3">
                  <p className="text-gray-700">
                    <span className="font-medium text-gray-600">主要诉求：</span>
                    {group.latestConsultation.mainRequests}
                  </p>
                  
                  {group.latestConsultation.description && (
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-600">详细描述：</span>
                      {group.latestConsultation.description}
                    </p>
                  )}
                </div>
              </div>
              
              {group.count > 1 && (
                <div className="ml-4 flex-shrink-0">
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                    重复发布 {group.count} 次
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>
                  最新发布：{new Date(group.latestConsultation.createdAt).toLocaleString('zh-CN')}
                </span>
                {group.latestConsultation.urgency && (
                  <span className={`px-2 py-1 rounded ${
                    group.latestConsultation.urgency === 'high' 
                      ? 'bg-red-100 text-red-800'
                      : group.latestConsultation.urgency === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {group.latestConsultation.urgency === 'high' ? '紧急' : 
                     group.latestConsultation.urgency === 'medium' ? '中等' : '一般'}
                  </span>
                )}
                {/* 显示回复数量 */}
                {(group.latestConsultation.replyCount || 0) > 0 && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    💬 {group.latestConsultation.replyCount} 条回复
                  </span>
                )}
              </div>
              
              <button 
                onClick={() => navigate(`/consultation/${group.latestConsultation.id}`)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
              >
                查看详情 →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 咨询表单组件
interface ConsultationFormProps {
  formData: ConsultationFormData;
  examples: ConsultationExample[];
  showExamples: boolean;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (field: keyof ConsultationFormData, value: string) => void;
  onUseExample: (example: ConsultationExample) => void;
  onToggleExamples: () => void;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({
  formData,
  examples,
  showExamples,
  loading,
  onSubmit,
  onInputChange,
  onUseExample,
  onToggleExamples
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">发起医疗咨询</h2>
      
      <form onSubmit={onSubmit} className="space-y-6">
        {/* 范例提示区域 */}
        {showExamples && examples.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-blue-800 flex items-center">
                📋 填写范例参考
                <span className="ml-2 text-sm font-normal text-blue-600">(点击使用范例)</span>
              </h3>
              <button
                type="button"
                onClick={onToggleExamples}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                隐藏范例
              </button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 border border-blue-100 cursor-pointer hover:border-blue-300 transition-colors"
                  onClick={() => onUseExample(example)}
                >
                  <div className="mb-2">
                    <span className="font-medium text-blue-700">主要症状：</span>
                    <p className="text-blue-600 text-sm">{example.mainSymptoms}</p>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-blue-700">主要诉求：</span>
                    <p className="text-blue-600 text-sm">{example.mainRequests}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">详细描述：</span>
                    <p className="text-blue-600 text-sm line-clamp-2">{example.description}</p>
                  </div>
                  <div className="text-right mt-2">
                    <span className="text-xs text-blue-500">点击使用此范例</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 显示范例按钮 */}
        {!showExamples && (
          <button
            type="button"
            onClick={onToggleExamples}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-center text-gray-700">
              <span className="text-lg mr-2">📋</span>
              <span className="font-medium">显示填写范例参考</span>
            </div>
          </button>
        )}

        {/* 表单字段 */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              主要症状 *
            </label>
            <input
              type="text"
              required
              value={formData.mainSymptoms}
              onChange={(e) => onInputChange('mainSymptoms', e.target.value)}
              placeholder="例如：持续头痛3天，伴有恶心呕吐，体温38.5℃"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              请详细描述不适的具体表现、部位、持续时间等
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              主要诉求 *
            </label>
            <input
              type="text"
              required
              value={formData.mainRequests}
              onChange={(e) => onInputChange('mainRequests', e.target.value)}
              placeholder="例如：希望了解可能的病因和应急处理措施，是否需要立即就医"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              明确说明您希望获得的帮助或解答的问题
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              详细描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              placeholder="例如：3天前开始出现头痛，最初轻微后逐渐加重。今天早晨开始恶心，呕吐两次。无外伤史，有高血压家族史..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
            <p className="text-xs text-gray-500 mt-1">
              包括发病时间、症状变化、既往病史、用药情况等相关信息
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                紧急程度
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => onInputChange('urgency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">一般</option>
                <option value="medium">中等</option>
                <option value="high">紧急</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                咨询类别
              </label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => onInputChange('category', e.target.value)}
                placeholder="例如：内科、儿科、皮肤科等"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? '发布中...' : '发布咨询'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HelpPage;