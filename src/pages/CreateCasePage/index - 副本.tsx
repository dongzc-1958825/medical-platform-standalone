// src/pages/CreateCasePage/index.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 导入共享类型
import { MedicalCase } from '../../shared/types/case';
// 导入服务
import { caseService } from '../../shared/services/caseService';
// 导入表单组件
import CaseForm from '../../components/CaseForm';

const CreateCasePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 处理发布成功
  const handlePublishSuccess = async (caseData: Omit<MedicalCase, 'id' | 'createdAt' | 'isFavorite'>) => {
    setIsSubmitting(true);
    try {
      console.log('医案发布成功:', caseData);
      
      // 使用服务保存医案
      const savedCase = caseService.createCase(caseData);
      console.log('保存的医案:', savedCase);
      
      // 显示成功消息
      alert('医案发布成功！');
      
      // 发布成功后返回医案列表
      navigate('/mobile/cases');
    } catch (error) {
      console.error('发布失败:', error);
      alert('发布失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理直接保存成功（通过CaseForm的内部保存）
  const handleFormSuccess = (savedCase: MedicalCase) => {
    console.log('表单直接保存成功:', savedCase);
    // 发布成功后返回医案列表
    navigate('/mobile/cases');
  };

  const handleCancel = () => {
    console.log('取消创建，返回列表页');
    navigate('/mobile/cases');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 页面头部 */}
          <div className="mb-8">
            <button
              onClick={handleCancel}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center text-lg font-medium"
            >
              ← 返回医案列表
            </button>
            <h1 className="text-3xl font-bold text-gray-900">创建新医案</h1>
            <p className="text-gray-600 mt-2">填写完整的医案信息，支持图片上传</p>
          </div>

          {/* 使用CaseForm组件 */}
          <CaseForm 
            onSubmit={handlePublishSuccess}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            autoNavigate={false} // 由页面控制导航
          />
        </div>
      </div>
    </div>
  );
};

export default CreateCasePage;