import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface ReportUploaderProps {
  onUploadSuccess?: (reportId: string) => void;
  onClose?: () => void;
}

const ReportUploader: React.FC<ReportUploaderProps> = ({ onUploadSuccess, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 表单字段
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [hospital, setHospital] = useState('');
  const [reportType, setReportType] = useState('年度体检');

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);
    
    // 检查文件类型
    if (selectedFile.type !== 'application/pdf') {
      setError('只支持PDF格式文件');
      return;
    }

    // 检查文件大小（50MB）
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('文件大小不能超过50MB');
      return;
    }

    setFile(selectedFile);
    console.log('文件已选择:', selectedFile.name, '大小:', (selectedFile.size / 1024 / 1024).toFixed(2), 'MB');
  };

  // 触发文件选择
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // 处理拖拽
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    setError(null);
    
    // 检查文件类型
    if (droppedFile.type !== 'application/pdf') {
      setError('只支持PDF格式文件');
      return;
    }

    // 检查文件大小（50MB）
    if (droppedFile.size > 50 * 1024 * 1024) {
      setError('文件大小不能超过50MB');
      return;
    }

    setFile(droppedFile);
    console.log('文件已拖拽:', droppedFile.name, '大小:', (droppedFile.size / 1024 / 1024).toFixed(2), 'MB');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = async () => {
    if (!file) {
      setError('请选择要上传的文件');
      return;
    }

    if (!hospital.trim()) {
      setError('请输入体检医院');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 动态导入服务
      const { reportStorageService } = await import('../../shared/services/reportStorageService');
      
      const result = await reportStorageService.uploadReport(file, {
        reportDate,
        hospital,
        reportType
      });

      if (result) {
        setSuccess(true);
        setTimeout(() => {
          onUploadSuccess?.(result.id);
          onClose?.();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || '上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">上传体检报告</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-4 space-y-4">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">上传成功！</h3>
              <p className="text-sm text-gray-500">正在跳转...</p>
            </div>
          ) : (
            <>
              {/* 隐藏的文件输入 */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {/* 文件选择区域 */}
              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'
                }`}
                onClick={triggerFileSelect}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {file ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-green-600 flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 break-all">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      点击选择PDF文件，或拖拽到这里
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      支持50MB以内的PDF文件
                    </p>
                  </div>
                )}
              </div>

              {/* 表单字段 */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    体检日期
                  </label>
                  <input
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    体检医院 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="例如：市中心医院"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    报告类型
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="年度体检">年度体检</option>
                    <option value="入职体检">入职体检</option>
                    <option value="专项检查">专项检查</option>
                    <option value="健康证">健康证</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="flex items-center text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* 底部按钮 */}
        {!success && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors ${
                uploading || !file
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {uploading ? '上传中...' : '上传'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportUploader;