import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../../shared/hooks/useAuth';
import { consultService, Consultation } from '../../shared/services/consultService';
// 移除旧的 FormData 和 UploadedFile 类型定义
// 导入新的表单组件
import CompleteConsultForm from '../../components/consult/CompleteConsultForm';

const MobileConsultPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  // 移除旧的表单状态: formData, isSubmitting, submitSuccess, errors, uploadedFiles, uploadError

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = () => {
    const data = consultService.getAllConsultations();
    setConsultations(data);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString();
  };

  const getStatusStyle = (status: string) => {
    const styles = {
      pending: 'bg-blue-100 text-blue-700',
      answered: 'bg-purple-100 text-purple-700',
      resolved: 'bg-gray-100 text-gray-700'
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getUrgencyStyle = (urgency: string) => {
    const styles = {
      normal: 'bg-green-100 text-green-700',
      urgent: 'bg-yellow-100 text-yellow-700',
      critical: 'bg-red-100 text-red-700'
    };
    return styles[urgency as keyof typeof styles] || styles.normal;
  };

  // 处理咨询提交成功后的回调
  const handleConsultSuccess = () => {
    setActiveTab('list');
    loadConsultations();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">寻医问药</h1>

      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-2 rounded-md text-center ${
            activeTab === 'list' ? 'bg-white shadow' : ''
          }`}
        >
          咨询列表 ({consultations.length})
        </button>
        <button
          onClick={() => setActiveTab('form')}
          className={`flex-1 py-2 rounded-md text-center ${
            activeTab === 'form' ? 'bg-white shadow' : ''
          }`}
        >
          发起咨询
        </button>
      </div>

      {activeTab === 'list' ? (
        <div className="space-y-4">
          {consultations.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500 mb-4">暂无咨询记录</p>
              <button
                onClick={() => setActiveTab('form')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                发起第一条咨询
              </button>
            </div>
          ) : (
            consultations.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow relative group"
              >
                <div 
                  onClick={() => navigate(`/mobile/consult/${item.id}`)}
                  className="cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{item.symptoms}</h3>
                    <div className="flex gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyStyle(item.urgency)}`}>
                        {item.urgency === 'normal' ? '普通' : item.urgency === 'urgent' ? '紧急' : '危急'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(item.status)}`}>
                        {item.status === 'pending' ? '待回复' : item.status === 'answered' ? '已回复' : '已解决'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.replyCount} 条回复</span>
                    <span>{formatTime(item.createdAt)}</span>
                  </div>
                </div>
                
                {/* 删除按钮 - 只有自己的咨询才显示 */}
                {user && item.authorId === user.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('确定要删除这条咨询吗？')) {
                        consultService.deleteConsultation(item.id, user.id);
                        loadConsultations();
                      }
                    }}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    title="删除咨询"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        // 替换为新的 CompleteConsultForm
        <CompleteConsultForm 
          user={user}
          onSuccess={handleConsultSuccess}
          onCancel={() => setActiveTab('list')}
        />
      )}
    </div>
  );
};

export default MobileConsultPage;
