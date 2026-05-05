// src/pages/CreateCasePage/index.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { ChevronLeft, X, Image, FileText, CheckCircle2 } from 'lucide-react';
import RecordUploader from '../../components/records/RecordUploader';

interface CaseFormData {
  title: string;
  patientName: string;
  diagnosis: string;
  symptoms: string[];
  description: string;
  treatment: string;
  outcome: string;
  tags: string[];
  imageUrls: string[];
  recordIds?: string[];
}

const CreateCasePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<CaseFormData>({
    title: '',
    patientName: '',
    diagnosis: '',
    symptoms: [],
    description: '',
    treatment: '',
    outcome: '',
    tags: [],
    imageUrls: [],
    recordIds: []
  });
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '请输入病例标题';
    }
    if (!formData.patientName.trim()) {
      newErrors.patientName = '请输入患者姓名';
    }
    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = '请输入诊断结果';
    }
    if (formData.symptoms.length === 0) {
      newErrors.symptoms = '请至少添加一个症状';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSymptom = () => {
    if (currentSymptom.trim() && !formData.symptoms.includes(currentSymptom.trim())) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, currentSymptom.trim()]
      }));
      setCurrentSymptom('');
      if (errors.symptoms) {
        setErrors(prev => ({ ...prev, symptoms: '' }));
      }
    }
  };

  const handleRemoveSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter(s => s !== symptom)
    }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // 处理上传成功的回调
  const handleUploadSuccess = (record: any) => {
    setUploadStatus('success');
    setUploadError(null);
    
    // 如果是图片，提取图片URL
    if (record.fileType?.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), record.fileData],
        recordIds: [...(prev.recordIds || []), record.id]
      }));
    } else {
      // 非图片文件，只保存记录ID
      setFormData(prev => ({
        ...prev,
        recordIds: [...(prev.recordIds || []), record.id]
      }));
    }

    // 3秒后清除成功状态
    setTimeout(() => {
      setUploadStatus('idle');
    }, 3000);
  };

  const handleUploadStart = () => {
    setUploadStatus('uploading');
    setUploadError(null);
  };

  const handleUploadError = (error: string) => {
    setUploadStatus('error');
    setUploadError(error);
    console.error('上传失败:', error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // 构建医案数据
      const caseData = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        authorId: user?.id,
        author: user?.username || '用户',
        likeCount: 0,
        commentCount: 0,
        isFavorite: false
      };

      // 保存到 localStorage
      const savedCases = localStorage.getItem('medical_cases');
      const cases = savedCases ? JSON.parse(savedCases) : [];
      cases.unshift(caseData);
      localStorage.setItem('medical_cases', JSON.stringify(cases));

      // 跳转到医案列表
      navigate('/mobile/cases');
    } catch (error) {
      console.error('发布失败:', error);
      alert('发布失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/mobile/cases')} className="text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">发布新医案</h1>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {isSubmitting ? '发布中...' : '发布'}
          </button>
        </div>
      </div>

      <div className="p-4 pb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          {/* 患者姓名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              患者姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.patientName}
              onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
              placeholder="输入患者姓名"
              className={`w-full p-3 border rounded-lg text-sm ${
                errors.patientName ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.patientName && (
              <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>
            )}
          </div>

          {/* 病例标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              病例标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="输入病例标题"
              className={`w-full p-3 border rounded-lg text-sm ${
                errors.title ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* 诊断 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              诊断 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.diagnosis}
              onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
              placeholder="输入诊断结果"
              className={`w-full p-3 border rounded-lg text-sm ${
                errors.diagnosis ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.diagnosis && (
              <p className="text-red-500 text-xs mt-1">{errors.diagnosis}</p>
            )}
          </div>

          {/* 症状 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              症状 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentSymptom}
                onChange={(e) => setCurrentSymptom(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSymptom())}
                placeholder="输入症状，按Enter添加"
                className="flex-1 p-3 border border-gray-200 rounded-lg text-sm"
              />
              <button
                onClick={handleAddSymptom}
                disabled={!currentSymptom.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
              >
                添加
              </button>
            </div>
            {errors.symptoms && (
              <p className="text-red-500 text-xs mt-1 mb-2">{errors.symptoms}</p>
            )}
            {formData.symptoms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm"
                  >
                    {symptom}
                    <button
                      onClick={() => handleRemoveSymptom(symptom)}
                      className="hover:text-orange-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 详细描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              详细描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="详细描述患者情况、病史等..."
              rows={4}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none"
            />
          </div>

          {/* 治疗方案 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              治疗方案
            </label>
            <textarea
              value={formData.treatment}
              onChange={(e) => setFormData(prev => ({ ...prev, treatment: e.target.value }))}
              placeholder="描述具体的治疗方案..."
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none"
            />
          </div>

          {/* 治疗效果 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              治疗效果
            </label>
            <textarea
              value={formData.outcome}
              onChange={(e) => setFormData(prev => ({ ...prev, outcome: e.target.value }))}
              placeholder="描述治疗后的效果..."
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none"
            />
          </div>

          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标签
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="输入标签，按Enter添加"
                className="flex-1 p-3 border border-gray-200 rounded-lg text-sm"
              />
              <button
                onClick={handleAddTag}
                disabled={!currentTag.trim()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm disabled:opacity-50"
              >
                添加
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-gray-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 文件上传区域 - 改为可选项 */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                上传相关文件 <span className="text-xs text-gray-400 font-normal">（选填）</span>
              </label>
              
              {/* 上传状态提示 */}
              {uploadStatus === 'uploading' && (
                <span className="text-xs text-blue-600 flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  上传中...
                </span>
              )}
              {uploadStatus === 'success' && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  上传成功
                </span>
              )}
              {uploadStatus === 'error' && (
                <span className="text-xs text-red-600 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  上传失败
                </span>
              )}
            </div>

            <RecordUploader
              onSuccess={handleUploadSuccess}
              onError={(error) => handleUploadError(error)}
              onStart={handleUploadStart}
              maxSize={50}
              multiple={true}
            />
            
            <p className="text-xs text-gray-400 mt-2">
              支持图片、PDF、Word等格式，单个文件不超过50MB
            </p>

            {/* 上传错误提示 */}
            {uploadError && (
              <p className="text-xs text-red-500 mt-2">{uploadError}</p>
            )}
          </div>

          {/* 已上传图片预览 */}
          {formData.imageUrls.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                已上传图片
              </label>
              <div className="grid grid-cols-3 gap-2">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img src={url} alt={`图片${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCasePage;