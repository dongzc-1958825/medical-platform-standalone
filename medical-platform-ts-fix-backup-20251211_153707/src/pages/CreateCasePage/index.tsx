// src/pages/CreateCasePage/index.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CaseForm from '../../components/CaseForm';

const CreateCasePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublishSuccess = async (caseData: any) => {
    setIsSubmitting(true);
    try {
      console.log('医案发布成功:', caseData);
      // 这里调用实际的发布服务
      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 发布成功后返回医案列表
      navigate('/cases');
    } catch (error) {
      console.error('发布失败:', error);
      alert('发布失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    console.log('取消创建，返回列表页');
    navigate('/cases');
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

          {/* 使用新的普通表单组件 */}
          <CaseForm 
            onSubmit={handlePublishSuccess}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateCasePage;