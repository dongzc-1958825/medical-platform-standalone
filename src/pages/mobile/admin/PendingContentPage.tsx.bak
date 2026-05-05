// src/pages/mobile/admin/PendingContentPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Flag, 
  Check, 
  X, 
  Eye,
  MessageCircle,
  FileText,
  Users,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '../../../shared/hooks/useAdmin';
import { adminService } from '../../../shared/services/admin/adminService';
import { PendingContent } from '../../../shared/types/admin';

const PendingContentPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, hasPermission, loading } = useAdmin();
  const [contents, setContents] = useState<PendingContent[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedContent, setSelectedContent] = useState<PendingContent | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/mobile/profile');
      return;
    }
    loadContents();
  }, [isAdmin, navigate]);

  const loadContents = () => {
    const all = adminService.getPendingContent();
    setContents(all);
  };

  const handleApprove = (contentId: string) => {
    if (adminService.reviewContent('current-admin', contentId, 'approve')) {
      loadContents();
      setShowDetail(false);
    }
  };

  const handleReject = (contentId: string) => {
    if (adminService.reviewContent('current-admin', contentId, 'reject', rejectReason)) {
      loadContents();
      setShowDetail(false);
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  const filteredContents = selectedType === 'all' 
    ? contents 
    : contents.filter(c => c.type === selectedType);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'case': return <FileText className="w-4 h-4" />;
      case 'consult': return <MessageCircle className="w-4 h-4" />;
      case 'announcement': return <Flag className="w-4 h-4" />;
      case 'forum': return <Users className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeName = (type: string) => {
    const map: Record<string, string> = {
      'case': '医案',
      'consult': '咨询',
      'announcement': '公告',
      'forum': '帖子',
      'lecture': '讲座',
      'suggestion': '建议'
    };
    return map[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="flex items-center p-4">
          <button onClick={() => navigate('/mobile/profile')}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold">待审核内容</h1>
          <div className="w-5"></div>
        </div>
      </div>

      {/* 类型筛选 */}
      <div className="bg-white border-b px-4 py-2 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
            selectedType === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          全部 ({contents.length})
        </button>
        {['case', 'consult', 'announcement', 'forum', 'lecture'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
              selectedType === type 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {getTypeName(type)} ({contents.filter(c => c.type === type).length})
          </button>
        ))}
      </div>

      {/* 内容列表 */}
      <div className="p-4 space-y-3">
        {filteredContents.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Check className="w-12 h-12 text-green-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">暂无待审核内容</p>
            <p className="text-sm text-gray-400">所有内容都已处理</p>
          </div>
        ) : (
          filteredContents.map(content => (
            <div
              key={content.id}
              onClick={() => {
                setSelectedContent(content);
                setShowDetail(true);
              }}
              className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {getTypeIcon(content.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full">
                      {getTypeName(content.type)}
                    </span>
                    {content.reportCount && content.reportCount > 0 && (
                      <span className="text-xs px-2 py-0.5 bg-red-50 text-red-700 rounded-full">
                        被举报 {content.reportCount} 次
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{content.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{content.content}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{content.authorName}</span>
                    <span>·</span>
                    <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 详情弹窗 */}
      {showDetail && selectedContent && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b sticky top-0 bg-white flex justify-between items-center">
              <h2 className="text-lg font-semibold">内容详情</h2>
              <button onClick={() => setShowDetail(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {getTypeName(selectedContent.type)}
                </span>
                <span className="text-xs text-gray-400">
                  ID: {selectedContent.id}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{selectedContent.title}</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedContent.content}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">作者</span>
                  <span className="text-gray-900">{selectedContent.authorName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">发布时间</span>
                  <span className="text-gray-900">{new Date(selectedContent.createdAt).toLocaleString()}</span>
                </div>
                {selectedContent.reportCount && selectedContent.reportCount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">被举报次数</span>
                    <span className="text-red-600 font-medium">{selectedContent.reportCount}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleApprove(selectedContent.id)}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  通过
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  驳回
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 驳回原因弹窗 */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">填写驳回原因</h2>
            </div>
            <div className="p-4">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="请输入驳回原因..."
                rows={4}
                className="w-full p-3 border rounded-lg resize-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-3 border rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={() => handleReject(selectedContent!.id)}
                  disabled={!rejectReason.trim()}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  确认驳回
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingContentPage;
