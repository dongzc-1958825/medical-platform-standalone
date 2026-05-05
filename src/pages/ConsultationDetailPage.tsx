import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ConsultationDetail } from '../types/consultation';
import { consultationService } from '../services/consultationService';

const ConsultationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ConsultationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    if (id) {
      loadConsultationDetail();
    }
  }, [id]);

  const loadConsultationDetail = async () => {
    setLoading(true);
    if (id) {
      const result = await consultationService.getConsultationDetail(id);
      setDetail(result);
    }
    setLoading(false);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !id) return;

    setReplying(true);
    
    // 模拟医生信息 - 实际项目中从认证信息获取
    const doctorInfo = {
      id: 'current-doctor',
      name: '张医生'
    };

    const result = await consultationService.addReply(id, replyContent, doctorInfo);
    if (result) {
      setReplyContent('');
      // 重新加载详情
      await loadConsultationDetail();
    }
    setReplying(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">咨询不存在</h2>
          <button
            onClick={() => navigate('/help')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            返回咨询列表
          </button>
        </div>
      </div>
    );
  }

  const { consultation, replies } = detail;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 头部导航 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/help')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <span className="mr-2">←</span>
            返回咨询列表
          </button>
          <h1 className="text-2xl font-bold text-gray-800">咨询详情</h1>
          <div className="w-20"></div> {/* 占位保持对称 */}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* 咨询内容 */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {consultation.mainSymptoms}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>用户：{consultation.userName || '匿名用户'}</span>
                  <span>发布时间：{formatDate(consultation.createdAt)}</span>
                  {consultation.urgency && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      consultation.urgency === 'high' 
                        ? 'bg-red-100 text-red-800'
                        : consultation.urgency === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {consultation.urgency === 'high' ? '紧急' : 
                       consultation.urgency === 'medium' ? '中等' : '一般'}
                    </span>
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                consultation.status === 'answered' 
                  ? 'bg-green-100 text-green-800'
                  : consultation.status === 'closed'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {consultation.status === 'answered' ? '已回复' : 
                 consultation.status === 'closed' ? '已关闭' : '待回复'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-1">主要诉求：</h3>
                <p className="text-gray-800">{consultation.mainRequests}</p>
              </div>

              {consultation.description && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">详细描述：</h3>
                  <p className="text-gray-800 whitespace-pre-wrap">{consultation.description}</p>
                </div>
              )}

              {consultation.category && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">咨询类别：</h3>
                  <p className="text-gray-800">{consultation.category}</p>
                </div>
              )}
            </div>
          </div>

          {/* 回复区域 */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                医生回复 {replies.length > 0 && `(${replies.length})`}
              </h3>
            </div>

            {replies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">💬</div>
                <p>暂无医生回复</p>
              </div>
            ) : (
              <div className="space-y-6">
                {replies.map((reply) => (
                  <div key={reply.id} className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">医</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{reply.doctorName}</h4>
                          <p className="text-sm text-gray-500">
                            {reply.isProfessional ? '专业医生' : '医生助理'}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(reply.createdAt)}
                      </span>
                    </div>
                    <div className="pl-13">
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 回复表单 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4">添加回复</h4>
              <form onSubmit={handleReply}>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="请输入专业的医疗建议和回复..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  required
                />
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={replying || !replyContent.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {replying ? '回复中...' : '发布回复'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetailPage;