// src/pages/CreateCasePage/index.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { ChevronLeft, X, Upload, FileText, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CaseFormData {
  title: string;
  patientName: string;
  diagnosis: string;
  symptoms: string[];
  description: string;
  treatment: string;
  outcome: string;
  tags: string[];
  imageUrls: string[];
  fileInfos?: { name: string; type: string; size: number }[];
}

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
}

const CreateCasePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<CaseFormData>({
    title: '',
    patientName: '',
    diagnosis: '',
    symptoms: [],
    description: '',
    treatment: '',
    outcome: '',
    tags: [],
    imageUrls: []
  });
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 文件上传状态
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 只验证必填字段
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '请输入病例标题';
    }
    if (!formData.patientName.trim()) {
      newErrors.patientName = '请输入患者姓名';
    }
    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = '请输入诊断结果';
    }
    if (formData.symptoms.length === 0) {
      newErrors.symptoms = '请至少添加一个症状';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSymptom = () => {
    if (currentSymptom.trim() && !formData.symptoms.includes(currentSymptom.trim())) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, currentSymptom.trim()]
      }));
      setCurrentSymptom('');
      if (errors.symptoms) {
        setErrors(prev => ({ ...prev, symptoms: '' }));
      }
    }
  };

  const handleRemoveSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter(s => s !== symptom)
    }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // 处理文件上传 - 修复版本
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    const maxSize = 50 * 1024 * 1024;
    
    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        setUploadError(`文件 ${file.name} 超过50MB限制`);
        return;
      }

      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2),
        file,
        name: file.name,
        type: file.type,
        size: file.size,
        status: 'success',
        url: ''  // 先置空
      };

      // 先添加一个占位文件
      setUploadedFiles(prev => [...prev, newFile]);

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target?.result as string;
        console.log(`📸 文件 ${file.name} 读取完成，数据长度:`, fileData.length);
        
        // 更新文件的 url 数据
        setUploadedFiles(prev => 
          prev.map(f => f.id === newFile.id ? { ...f, url: fileData } : f)
        );
        
        // 如果是图片，同时保存到 imageUrls
        if (file.type.startsWith('image/')) {
          setFormData(prev => ({
            ...prev,
            imageUrls: [...prev.imageUrls, fileData]
          }));
        }
      };
      
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(prev => {
      const removed = prev.find(f => f.id === id);
      if (removed?.url) {
        // 如果是图片，同时从 imageUrls 中移除
        setFormData(prev => ({
          ...prev,
          imageUrls: prev.imageUrls.filter(url => url !== removed.url)
        }));
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-purple-500" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes('word') || type.includes('document')) return <FileText className="w-5 h-5 text-blue-500" />;
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // 确保每个文件都有 url 数据
      const filesWithData = uploadedFiles
        .filter(f => f.url)  // 只保存有数据的文件
        .map(f => ({
          name: f.name,
          type: f.type,
          size: f.size,
          url: f.url
        }));

      console.log('📤 准备保存的文件数据:', filesWithData);

      const caseData = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        authorId: user?.id,
        author: user?.username || '用户',
        likeCount: 0,
        commentCount: 0,
        isFavorite: false,
        uploadedFiles: filesWithData
      };

      // 保存到 localStorage
      const savedCases = localStorage.getItem('medical_cases');
      const cases = savedCases ? JSON.parse(savedCases) : [];
      cases.unshift(caseData);
      localStorage.setItem('medical_cases', JSON.stringify(cases));

      console.log('✅ 保存成功，跳转到医案列表');
      navigate('/mobile/cases');
    } catch (error) {
      console.error('发布失败:', error);
      alert('发布失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/mobile/cases')} className="text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">发布新医案</h1>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {isSubmitting ? '发布中...' : '发布'}
          </button>
        </div>
      </div>

      <div className="p-4 pb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          {/* 患者姓名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              患者姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.patientName}
              onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
              placeholder="输入患者姓名"
              className={`w-full p-3 border rounded-lg text-sm ${
                errors.patientName ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.patientName && (
              <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>
            )}
          </div>

          {/* 病例标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              病例标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="输入病例标题"
              className={`w-full p-3 border rounded-lg text-sm ${
                errors.title ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* 诊断 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              诊断 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.diagnosis}
              onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
              placeholder="输入诊断结果"
              className={`w-full p-3 border rounded-lg text-sm ${
                errors.diagnosis ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.diagnosis && (
              <p className="text-red-500 text-xs mt-1">{errors.diagnosis}</p>
            )}
          </div>

          {/* 症状 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              症状 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentSymptom}
                onChange={(e) => setCurrentSymptom(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSymptom())}
                placeholder="输入症状，按Enter添加"
                className="flex-1 p-3 border border-gray-200 rounded-lg text-sm"
              />
              <button
                onClick={handleAddSymptom}
                disabled={!currentSymptom.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
              >
                添加
              </button>
            </div>
            {errors.symptoms && (
              <p className="text-red-500 text-xs mt-1 mb-2">{errors.symptoms}</p>
            )}
            {formData.symptoms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm"
                  >
                    {symptom}
                    <button
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

          {/* 详细描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              详细描述 <span className="text-xs text-gray-400 font-normal">（选填）</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="详细描述患者情况、病史等..."
              rows={4}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none"
            />
          </div>

          {/* 治疗方案 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              治疗方案 <span className="text-xs text-gray-400 font-normal">（选填）</span>
            </label>
            <textarea
              value={formData.treatment}
              onChange={(e) => setFormData(prev => ({ ...prev, treatment: e.target.value }))}
              placeholder="描述具体的治疗方案..."
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none"
            />
          </div>

          {/* 治疗效果 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              治疗效果 <span className="text-xs text-gray-400 font-normal">（选填）</span>
            </label>
            <textarea
              value={formData.outcome}
              onChange={(e) => setFormData(prev => ({ ...prev, outcome: e.target.value }))}
              placeholder="描述治疗后的效果..."
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none"
            />
          </div>

          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标签 <span className="text-xs text-gray-400 font-normal">（选填）</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="输入标签，按Enter添加"
                className="flex-1 p-3 border border-gray-200 rounded-lg text-sm"
              />
              <button
                onClick={handleAddTag}
                disabled={!currentTag.trim()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm disabled:opacity-50"
              >
                添加
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-gray-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 文件上传 - 修复版本 */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                上传附件 <span className="text-xs text-gray-400 font-normal">（选填，支持图片、PDF、Word等）</span>
              </label>
              {uploadError && (
                <span className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {uploadError}
                </span>
              )}
            </div>
            
            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-1">点击或拖拽上传文件</p>
                <p className="text-xs text-gray-400">
                  支持图片、PDF、Word文档等，单个文件不超过50MB
                </p>
                <p className="text-xs text-blue-500 mt-2">不上传文件也可直接发布医案</p>
              </div>
            </label>

            {/* 已上传文件列表 */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-gray-700">已上传 {uploadedFiles.length} 个文件</p>
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {getFileIcon(file.type)}
                      <div className="min-w-0">
                        <p className="text-sm text-gray-700 truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                        {!file.url && (
                          <p className="text-xs text-yellow-500">数据加载中...</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 图片预览 */}
            {formData.imageUrls.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-700 mb-2">图片预览</p>
                <div className="grid grid-cols-3 gap-2">
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={url} alt={`图片${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => {
                          setUploadedFiles(prev => prev.filter(f => f.url !== url));
                          setFormData(prev => ({
                            ...prev,
                            imageUrls: prev.imageUrls.filter(u => u !== url)
                          }));
                        }}
                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCasePage;