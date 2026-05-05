import React, { useState, useEffect } from 'react';
import { X, Download, Trash2, FileText, Calendar, Building2, Tag } from 'lucide-react';
import type { HealthReport } from '../../shared/services/reportStorageService';

interface ReportViewerProps {
  report: HealthReport;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report, onClose, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDownload = () => {
    // 从Base64创建下载链接
    const link = document.createElement('a');
    link.href = report.fileData;
    link.download = report.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    onDelete?.(report.id);
    onClose();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    } catch {
      return dateString;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 truncate flex-1">
            {report.fileName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full ml-2"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 报告信息 */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">体检日期：</span>
              <span className="text-gray-900 font-medium ml-1">
                {formatDate(report.reportDate)}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Building2 className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">医院：</span>
              <span className="text-gray-900 font-medium ml-1 truncate">
                {report.hospital}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Tag className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">类型：</span>
              <span className="text-gray-900 font-medium ml-1">
                {report.reportType}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <FileText className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">大小：</span>
              <span className="text-gray-900 font-medium ml-1">
                {formatFileSize(report.fileSize)}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            上传时间：{formatDate(report.uploadTime)}
          </div>
        </div>

        {/* PDF预览区域 */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          {report.fileData ? (
            <embed
              src={report.fileData}
              type="application/pdf"
              className="w-full h-full min-h-[500px] rounded-lg shadow-lg"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">无法加载PDF预览</p>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            删除报告
          </button>
          <div className="flex space-x-3">
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              下载PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>

        {/* 删除确认弹窗 */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
            <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">确认删除</h3>
              <p className="text-gray-600 mb-6">
                确定要删除这份体检报告吗？此操作无法撤销。
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportViewer;