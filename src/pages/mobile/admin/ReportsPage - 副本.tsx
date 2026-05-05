// src/pages/mobile/admin/ReportsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  AlertTriangle, 
  Check, 
  X, 
  Eye,
  User,
  Flag,
  Clock
} from 'lucide-react';
import { useAdmin } from '../../../shared/hooks/useAdmin';
import { adminService } from '../../../shared/services/admin/adminService';
import { UserReport } from '../../../shared/types/admin';

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdmin();
  const [reports, setReports] = useState<UserReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [processResult, setProcessResult] = useState('');
  const [showProcessModal, setShowProcessModal] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/mobile/profile');
      return;
    }
    loadReports();
  }, [isAdmin, navigate]);

  const loadReports = () => {
    const all = adminService.getReports('pending');
    setReports(all);
  };

  const handleProcess = (reportId: string, action: 'approve' | 'dismiss') => {
    if (adminService.processReport('current-admin', reportId, action, processResult)) {
      loadReports();
      setShowDetail(false);
      setShowProcessModal(false);
      setProcessResult('');
    }
  };

  const getTargetTypeName = (type: string) => {
    const map: Record<string, string> = {
      'user': '用户',
      'case': '医案',
      'consult': '咨询',
      'announcement': '公告',
      'forum': '帖子',
      'comment': '评论'
    };
    return map[type] || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) return `${hours}小时前`;
    return date.toLocaleDateString();
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
          <h1 className="flex-1 text-center font-semibold">用户举报</h1>
          <div className="w-5"></div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="p-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{reports.length}</div>
          <div className="text-xs text-gray-500">待处理</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-green-600">
            {adminService.getReports('processed').length}
          </div>
          <div className="text-xs text-gray-500">已处理</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-gray-400">
            {adminService.getReports('dismissed').length}
          </div>
          <div className="text-xs text-gray-500">已驳回</div>
        </div>
      </div>

      {/* 举报列表 */}
      <div className="px-4 space-y-3">
        {reports.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Check className="w-12 h-12 text-green-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">暂无待处理举报</p>
            <p className="text-sm text-gray-400">一切都很和谐</p>
          </div>
        ) : (
          reports.map(report => (
            <div
              key={report.id}
              onClick={() => {
                setSelectedReport(report);
                setShowDetail(true);
              }}
              className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-red-50 text-red-700 rounded-full">
                      举报
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(report.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    举报 {getTargetTypeName(report.targetType)}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{report.reason}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <User className="w-3 h-3" />
                    <span>{report.reporterName}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 详情弹窗 */}
      {showDetail && selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl">
            <div className="p-4 border-b sticky top-0 bg-white flex justify-between items-center">
              <h2 className="text-lg font-semibold">举报详情</h2>
              <button onClick={() => setShowDetail(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 mb-1">举报原因</p>
                    <p className="text-gray-700">{selectedReport.reason}</p>
                    {selectedReport.details && (
                      <p className="text-sm text-gray-500 mt-2">{selectedReport.details}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">举报信息</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">举报人</span>
                    <span className="text-gray-900">{selectedReport.reporterName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">被举报类型</span>
                    <span className="text-gray-900">{getTargetTypeName(selectedReport.targetType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">举报时间</span>
                    <span className="text-gray-900">{new Date(selectedReport.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">目标ID</span>
                    <span className="text-gray-400 text-xs">{selectedReport.targetId}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowProcessModal(true);
                  }}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  处理举报
                </button>
                <button
                  onClick={() => handleProcess(selectedReport.id, 'dismiss')}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  驳回
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 处理结果弹窗 */}
      {showProcessModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">处理结果</h2>
            </div>
            <div className="p-4">
              <textarea
                value={processResult}
                onChange={(e) => setProcessResult(e.target.value)}
                placeholder="请输入处理结果（可选）..."
                rows={4}
                className="w-full p-3 border rounded-lg resize-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowProcessModal(false)}
                  className="flex-1 py-3 border rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={() => handleProcess(selectedReport!.id, 'approve')}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  确认处理
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
