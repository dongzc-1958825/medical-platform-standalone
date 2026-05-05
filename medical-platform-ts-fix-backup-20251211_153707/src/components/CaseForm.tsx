// src/components/CaseForm.tsx
import React, { useState } from 'react';

interface MedicalCase {
  id: string;
  title: string;
  patientName: string;
  diagnosis: string;
  symptoms: string[];
  createdAt: string;
  tags: string[];
  description?: string;
  treatment?: string;
  outcome?: string;
  imageUrls?: string[];
  isFavorite?: boolean;
}

interface CaseFormProps {
  onSubmit: (caseData: Omit<MedicalCase, 'id' | 'createdAt' | 'isFavorite'>) => void;
  onCancel?: () => void;
  initialData?: Partial<Omit<MedicalCase, 'id' | 'createdAt' | 'isFavorite'>>;
  isSubmitting?: boolean;
}

const CaseForm: React.FC<CaseFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData = {}, 
  isSubmitting = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    patientName: '',
    description: '',
    symptoms: [] as string[],
    diagnosis: '',
    treatment: '',
    outcome: '',
    tags: [] as string[],
    imageUrls: [] as string[],
    ...initialData
  });

  const [currentSymptom, setCurrentSymptom] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '病例标题不能为空';
    }

    if (!formData.patientName.trim()) {
      newErrors.patientName = '患者姓名不能为空';
    }

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = '诊断结果不能为空';
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
      // 清除症状错误
      if (errors.symptoms) {
        setErrors(prev => ({ ...prev, symptoms: '' }));
      }
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // 准备提交数据，确保与 MedicalCase 接口匹配
    const caseData = {
      title: formData.title.trim(),
      patientName: formData.patientName.trim(),
      description: formData.description.trim(),
      symptoms: formData.symptoms,
      diagnosis: formData.diagnosis.trim(),
      treatment: formData.treatment.trim(),
      outcome: formData.outcome.trim(),
      tags: formData.tags,
      imageUrls: formData.imageUrls
    };

    console.log('提交医案数据:', caseData);
    await onSubmit(caseData);
  };

  const removeSymptom = (symptomToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter(symptom => symptom !== symptomToRemove)
    }));
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 模拟图片上传功能
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // 在实际项目中，这里应该调用图片上传服务
      const newImageUrls = Array.from(files).map(file => 
        URL.createObjectURL(file)
      );
      
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...newImageUrls]
      }));
    }
  };

  const removeImage = (imageUrlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter(url => url !== imageUrlToRemove)
    }));
    // 释放 blob URL
    URL.revokeObjectURL(imageUrlToRemove);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 患者姓名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            患者姓名 *
          </label>
          <input
            type="text"
            required
            value={formData.patientName}
            onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.patientName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="输入患者姓名"
            disabled={isSubmitting}
          />
          {errors.patientName && (
            <p className="text-red-500 text-sm mt-1">{errors.patientName}</p>
          )}
        </div>

        {/* 病例标题 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            病例标题 *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="输入病例标题"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* 病例描述 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            病例描述
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="详细描述患者情况、病史等..."
            disabled={isSubmitting}
          />
        </div>

        {/* 症状 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            症状 *
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={currentSymptom}
              onChange={(e) => setCurrentSymptom(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSymptom())}
              className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.symptoms ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="输入症状，按Enter添加"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={handleAddSymptom}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              disabled={isSubmitting || !currentSymptom.trim()}
            >
              添加
            </button>
          </div>
          {errors.symptoms && (
            <p className="text-red-500 text-sm mt-1">{errors.symptoms}</p>
          )}
          {formData.symptoms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.symptoms.map((symptom, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {symptom}
                  <button
                    type="button"
                    onClick={() => removeSymptom(symptom)}
                    className="ml-2 text-blue-600 hover:text-blue-800 text-lg"
                    disabled={isSubmitting}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 诊断 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            诊断 *
          </label>
          <input
            type="text"
            required
            value={formData.diagnosis}
            onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.diagnosis ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="输入诊断结果"
            disabled={isSubmitting}
          />
          {errors.diagnosis && (
            <p className="text-red-500 text-sm mt-1">{errors.diagnosis}</p>
          )}
        </div>

        {/* 治疗方案 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            治疗方案
          </label>
          <textarea
            value={formData.treatment}
            onChange={(e) => setFormData(prev => ({ ...prev, treatment: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="描述具体的治疗方案..."
            disabled={isSubmitting}
          />
        </div>

        {/* 治疗效果 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            治疗效果
          </label>
          <textarea
            value={formData.outcome}
            onChange={(e) => setFormData(prev => ({ ...prev, outcome: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="描述治疗后的效果..."
            disabled={isSubmitting}
          />
        </div>

        {/* 标签 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            标签
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入标签，按Enter添加"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-300"
              disabled={isSubmitting || !currentTag.trim()}
            >
              添加
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-gray-500 hover:text-gray-700 text-lg"
                    disabled={isSubmitting}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 图片上传 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            病例图片
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {formData.imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img 
                    src={url} 
                    alt={`病例图片 ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    disabled={isSubmitting}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              取消
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? '发布中...' : '发布医案'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaseForm;