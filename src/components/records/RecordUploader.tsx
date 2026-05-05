// src/components/records/RecordUploader.tsx
import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle, Image } from 'lucide-react';
import { clinicalRecordService } from '../../shared/services/clinicalRecordService';

interface RecordUploaderProps {
  onUploadSuccess?: (recordId: string) => void;
  onClose?: () => void;
}

const RecordUploader: React.FC<RecordUploaderProps> = ({ onUploadSuccess, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 表单字段
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [hospital, setHospital] = useState('');
  const [department, setDepartment] = useState('');
  const [doctor, setDoctor] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [summary, setSummary] = useState('');
  const [recordType, setRecordType] = useState('门诊');
  
  // 新增字段
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [treatment, setTreatment] = useState('');
  const [outcome, setOutcome] = useState('');

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    validateAndSetFile(selectedFile);
  };

  // 验证并设置文件
  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    
    // 检查文件类型
    if (!clinicalRecordService.isSupported(selectedFile)) {
      setError('只支持PDF和图片格式文件（JPG/PNG/GIF/WEBP）');
      return;
    }

    // 检查文件大小（50MB）
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError(`文件大小不能超过50MB（当前文件：${(selectedFile.size / 1024 / 1024).toFixed(2)}MB）`);
      return;
    }

    setFile(selectedFile);
    
    // 生成预览URL（用于图片）
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    
    console.log('文件已选择:', selectedFile.name, '类型:', selectedFile.type);
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

    validateAndSetFile(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 处理症状添加
  const handleAddSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom('');
    }
  };

  // 处理症状删除
  const handleRemoveSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const handleUpload = async () => {
    if (!file) {
      setError('请选择要上传的文件');
      return;
    }

    if (!hospital.trim()) {
      setError('请输入就诊医院');
      return;
    }

    if (summary.length > 300) {
      setError('摘要不能超过300字');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await clinicalRecordService.uploadRecord(file, {
        recordDate,
        hospital: hospital.trim(),
        department: department.trim(),
        doctor: doctor.trim(),
        diagnosis: diagnosis.trim(),
        symptoms,
        treatment: treatment.trim(),
        outcome: outcome.trim(),
        summary: summary.trim(),
        recordType
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
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 获取文件类型图标
  const getFileIcon = () => {
    if (!file) return null;
    
    if (file.type.startsWith('image/')) {
      return <Image className="w-8 h-8 text-green-600 flex-shrink-0" />;
    } else {
      return <FileText className="w-8 h-8 text-green-600 flex-shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">上传诊疗记录</h2>
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
                accept=".pdf,application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
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
                  <div className="flex items-center space-x-3">
                    {file.type.startsWith('image/') && previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="预览" 
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      getFileIcon()
                    )}
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 break-all">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {clinicalRecordService.getFileTypeName(file.type)} | {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
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
                      点击选择文件，或拖拽到这里
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      支持 PDF、JPG、PNG、GIF、WEBP 格式，最大50MB
                    </p>
                  </div>
                )}
              </div>

              {/* 表单字段 */}
              <div className="space-y-3">
                {/* 第一行：就诊日期和类型 */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      就诊日期
                    </label>
                    <input
                      type="date"
                      value={recordDate}
                      onChange={(e) => setRecordDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      记录类型
                    </label>
                    <select
                      value={recordType}
                      onChange={(e) => setRecordType(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="门诊">门诊</option>
                      <option value="住院">住院</option>
                      <option value="检查">检查</option>
                      <option value="手术">手术</option>
                      <option value="急诊">急诊</option>
                    </select>
                  </div>
                </div>

                {/* 医院 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    就诊医院 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="例如：市人民医院"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 科室和医生 */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      就诊科室
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="例如：心血管内科"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      医生姓名
                    </label>
                    <input
                      type="text"
                      value={doctor}
                      onChange={(e) => setDoctor(e.target.value)}
                      placeholder="例如：张医生"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* 诊断结果 */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    诊断结果
                  </label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="例如：高血压"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 症状 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    症状
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={currentSymptom}
                      onChange={(e) => setCurrentSymptom(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSymptom())}
                      placeholder="输入症状，按Enter添加"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddSymptom}
                      disabled={!currentSymptom.trim()}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 whitespace-nowrap"
                    >
                      添加
                    </button>
                  </div>
                  {symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {symptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
                        >
                          {symptom}
                          <button
                            type="button"
                            onClick={() => handleRemoveSymptom(symptom)}
                            className="hover:text-orange-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 治疗方案 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    治疗方案
                  </label>
                  <textarea
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    placeholder="描述治疗方案..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* 治疗效果 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    治疗效果
                  </label>
                  <textarea
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    placeholder="描述治疗效果..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* 摘要（300字） */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    诊疗摘要 <span className="text-gray-400 text-xs">({summary.length}/300字)</span>
                  </label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value.slice(0, 300))}
                    placeholder="请输入诊疗过程的简要描述，不超过300字..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
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
              disabled={uploading || !file || !hospital.trim()}
              className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors ${
                uploading || !file || !hospital.trim()
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

export default RecordUploader;