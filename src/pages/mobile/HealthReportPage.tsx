import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  FileText, 
  Upload, 
  Calendar, 
  Building2, 
  Download,
  Trash2,
  Plus,
  Search,
  AlertCircle,
  Eye
} from 'lucide-react';
import { reportStorageService, HealthReport } from '../../shared/services/reportStorageService';
import ReportUploader from '../../components/reports/ReportUploader';

// 辅助函数：将 data URL 转换为 Blob
const dataURLtoBlob = (dataURL: string) => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/pdf';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

const HealthReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await reportStorageService.getReports();
      setReports(data);
    } catch (error) {
      console.error('加载报告失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (reportId: string) => {
    loadReports();
    setShowUploader(false);
  };

  const handleDeleteReport = async (id: string) => {
    if (window.confirm('确定要删除这份报告吗？')) {
      const success = await reportStorageService.deleteReport(id);
      if (success) {
        loadReports();
      }
    }
  };

  const handleDownload = (report: HealthReport) => {
    const link = document.createElement('a');
    link.href = report.fileData;
    link.download = report.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

        const handlePreview = (report: HealthReport) => {
    let fileData = report.fileData;
    
    // 确保数据格式正确
    if (!fileData.startsWith('data:application/pdf')) {
      let base64Data = fileData;
      if (fileData.includes(',')) {
        base64Data = fileData.split(',')[1];
      }
      fileData = `data:application/pdf;base64,${base64Data}`;
    }
    
    // 检测运行环境
    const isWechat = /MicroMessenger/i.test(navigator.userAgent);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isWechat) {
      // 微信内：只能下载
      const link = document.createElement('a');
      link.href = fileData;
      link.download = report.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert('文件开始下载，请在下载完成后使用 PDF 阅读器打开');
    } else if (isMobile) {
      // 非微信移动端：尝试跳转预览
      const blob = dataURLtoBlob(fileData);
      const url = URL.createObjectURL(blob);
      window.location.href = url;
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } else {
      // 桌面端：新窗口预览
      const blob = dataURLtoBlob(fileData);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    } catch {
      return dateString;
    }
  };

  const filteredReports = reports.filter(report =>
    report.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.hospital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 计算总文件大小
  const totalSize = reports.reduce((sum, r) => sum + r.fileSize, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载报告中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate('/mobile/profile')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>返回</span>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">体检报告</h1>
          <button
            onClick={() => setShowUploader(true)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* 使用提示 */}
                {/* 使用提示 */}
        

        {/* 搜索框 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索报告或医院..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 统计卡片 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm p-5 text-white mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              <div>
                <p className="text-sm text-blue-100">总报告数</p>
                <p className="text-2xl font-bold">{reports.length}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">占用空间</p>
              <p className="text-lg font-semibold">
                {reportStorageService.formatFileSize(totalSize)}
              </p>
            </div>
          </div>
        </div>

        {/* 报告列表 */}
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无体检报告</h3>
            <p className="text-sm text-gray-500 mb-6">
              {searchTerm ? '没有找到匹配的报告' : '点击右上角上传您的第一份体检报告'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowUploader(true)}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                上传报告
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center flex-1">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                        {report.fileName}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 space-x-3">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(report.reportDate)}
                        </span>
                        <span className="flex items-center">
                          <Building2 className="w-3 h-3 mr-1" />
                          {report.hospital}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {reportStorageService.formatFileSize(report.fileSize)}
                  </span>
                </div>
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(report);
                    }}
                    className="flex items-center px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    查看
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(report);
                    }}
                    className="flex items-center px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    下载
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteReport(report.id);
                    }}
                    className="flex items-center px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 上传弹窗 */}
      {showUploader && (
        <ReportUploader
          onUploadSuccess={handleUploadSuccess}
          onClose={() => setShowUploader(false)}
        />
      )}
    </div>
  );
};

export default HealthReportPage;



