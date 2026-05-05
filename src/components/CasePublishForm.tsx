// src/components/CasePublishForm.tsx
import React, { useState, useEffect, useCallback } from 'react';
// 导入共享类型
import { MedicalCase } from '../shared/types/case';
// 导入服务
import { caseService } from '../shared/services/caseService';

interface CasePublishFormProps {
  onClose: () => void;
  onPublish?: (caseData: Omit<MedicalCase, 'id' | 'createdAt' | 'isFavorite'>) => void;
  // 新增：发布成功回调
  onSuccess?: (savedCase: MedicalCase) => void;
  // 新增：初始数据（用于编辑）
  initialData?: Partial<Omit<MedicalCase, 'id' | 'createdAt' | 'isFavorite'>>;
  // 新增：是否为编辑模式
  isEditMode?: boolean;
  // 新增：要编辑的医案ID
  caseId?: string;
}

const CasePublishForm: React.FC<CasePublishFormProps> = ({ 
  onClose, 
  onPublish,
  onSuccess,
  initialData = {},
  isEditMode = false,
  caseId
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 确保模态框正确显示
  useEffect(() => {
    console.log('CasePublishForm 组件已加载，模态框应该显示');
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
      console.log('CasePublishForm 组件已卸载');
    };
  }, []);

  // ESC 键关闭
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

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

    setIsSubmitting(true);

    try {
      // 准备提交数据
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

      // 如果有外部onPublish，使用外部方法
      if (onPublish) {
        await onPublish(caseData);
      } else {
        // 否则直接使用服务保存
        let savedCase: MedicalCase;
        
        if (isEditMode && caseId) {
          // 编辑模式：更新现有医案
          const existingCase = caseService.getCaseById(caseId);
          if (existingCase) {
            savedCase = caseService.updateCase(caseId, caseData) as MedicalCase;
            alert('医案更新成功！');
          } else {
            throw new Error('未找到要编辑的医案');
          }
        } else {
          // 创建模式：新建医案
          savedCase = caseService.createCase(caseData);
          alert('医案发布成功！');
        }
        
        // 调用成功回调
        if (onSuccess) {
          onSuccess(savedCase);
        }
      }
      
      // 成功发布后关闭模态框
      onClose();
    } catch (error) {
      console.error('发布医案失败:', error);
      alert(isEditMode ? '更新失败，请重试' : '发布失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
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
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          maxWidth: '42rem',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          zIndex: 10000
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditMode ? '编辑医案' : '创建新医案'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl transition-colors p-2"
              type="button"
              disabled={isSubmitting}
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                取消
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (isEditMode ? '更新中...' : '发布中...') 
                  : (isEditMode ? '更新医案' : '发布医案')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CasePublishForm;