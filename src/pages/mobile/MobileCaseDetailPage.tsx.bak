// src/pages/mobile/MobileCaseDetailPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Heart,
  MessageCircle,
  Send,
  Trash2,
  Clock,
  User,
  Stethoscope,
  Award,
  FileText,
  Image,
  X,
  Download,
  Eye,
  Edit
} from 'lucide-react';
import { useAuth } from '../../shared/hooks/useAuth';
import CollectButton from '../../components/collection/CollectButton';

// 类型定义
interface Comment {
  id: string;
  caseId: string;
  authorId: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy?: string[];
  identity?: 'specialist' | 'general' | 'patient' | 'other';
}

interface UploadedFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileData: string;
}

// ========== 身份选择器组件 ==========
const IdentitySelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const identities = [
    { value: 'patient', label: '病友', icon: User, color: 'text-green-600' },
    { value: 'specialist', label: '专科医生', icon: Stethoscope, color: 'text-blue-600' },
    { value: 'general', label: '非专科医生', icon: Award, color: 'text-purple-600' },
    { value: 'other', label: '其他', icon: User, color: 'text-gray-600' }
  ];

  return (
    <div className="flex gap-2 mb-3">
      {identities.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-1 text-sm ${
              value === item.value
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className={`w-4 h-4 ${value === item.value ? 'text-blue-600' : item.color}`} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ========== 文件预览组件 ==========
const FilePreview: React.FC<{ 
  file: UploadedFile;
  onDelete?: (id: string) => void;
}> = ({ file, onDelete }) => {
  const getFileIcon = () => {
    if (file.fileType?.startsWith('image/')) return <Image className="w-5 h-5 text-purple-500" />;
    if (file.fileType?.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '未知大小';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handlePreview = () => {
    if (!file.fileData) {
      alert('文件数据不存在');
      return;
    }

    if (file.fileType.startsWith('image/')) {
      try {
        const base64Data = file.fileData.split(',')[1] || file.fileData;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: file.fileType });
        const blobUrl = URL.createObjectURL(blob);
        
        const previewWindow = window.open('', '_blank');
        if (previewWindow) {
          previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>${file.fileName}</title>
                <style>
                  body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f5f5f5; }
                  img { max-width: 100%; max-height: 90vh; object-fit: contain; }
                  .close-btn { position: fixed; top: 16px; right: 16px; padding: 8px 16px; background: white; border: none; border-radius: 20px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
                </style>
              </head>
              <body>
                <button class="close-btn" onclick="window.close()">关闭</button>
                <img src="${blobUrl}" alt="${file.fileName}" />
              </body>
            </html>
          `);
          previewWindow.document.close();
          
          previewWindow.onunload = () => {
            URL.revokeObjectURL(blobUrl);
          };
        }
      } catch (error) {
        console.error('图片预览失败:', error);
        alert('图片预览失败，请尝试下载后查看');
      }
    } else {
      try {
        const base64Data = file.fileData.split(',')[1] || file.fileData;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        
        const previewWindow = window.open('', '_blank');
        if (previewWindow) {
          previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>${file.fileName}</title>
                <style>
                  body { margin: 0; display: flex; flex-direction: column; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                  .toolbar { padding: 12px 16px; background: white; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
                  .close-btn { padding: 6px 12px; background: #f3f4f6; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
                  .close-btn:hover { background: #e5e7eb; }
                  iframe { flex: 1; width: 100%; border: none; background: white; }
                </style>
              </head>
              <body>
                <div class="toolbar">
                  <span style="font-weight: 500;">${file.fileName}</span>
                  <button class="close-btn" onclick="window.close()">关闭</button>
                </div>
                <iframe src="${blobUrl}" type="application/pdf"></iframe>
              </body>
            </html>
          `);
          previewWindow.document.close();
          
          previewWindow.onunload = () => {
            URL.revokeObjectURL(blobUrl);
          };
        }
      } catch (error) {
        console.error('PDF预览失败:', error);
        alert('PDF预览失败，请尝试下载后查看');
      }
    }
  };

  const handleDownload = () => {
    if (!file.fileData) {
      alert('文件数据不存在');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = file.fileData;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请重试');
    }
  };

  const handleDelete = () => {
    if (window.confirm('确定要删除这个文件吗？')) {
      onDelete?.(file.id);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {getFileIcon()}
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-700 truncate">{file.fileName}</p>
          <p className="text-xs text-gray-400">{formatFileSize(file.fileSize)}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={handlePreview}
          className="p-2 hover:bg-white rounded-lg transition-colors"
          title="预览"
        >
          <Eye className="w-4 h-4 text-gray-500 hover:text-blue-600" />
        </button>
        <button
          onClick={handleDownload}
          className="p-2 hover:bg-white rounded-lg transition-colors"
          title="下载"
        >
          <Download className="w-4 h-4 text-gray-500 hover:text-green-600" />
        </button>
        {onDelete && (
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
};

// ========== 评论项组件 ==========
const CommentItem: React.FC<{
  comment: Comment;
  currentUserId: string;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ comment, currentUserId, onLike, onDelete }) => {
  const canDelete = currentUserId === comment.authorId;
  const liked = comment.likedBy?.includes(currentUserId);

  const getIdentityIcon = () => {
    switch(comment.identity) {
      case 'specialist': return <Stethoscope className="w-4 h-4 text-blue-600" />;
      case 'general': return <Award className="w-4 h-4 text-purple-600" />;
      case 'patient': return <User className="w-4 h-4 text-green-600" />;
      default: return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getIdentityText = () => {
    switch(comment.identity) {
      case 'specialist': return '专科医生';
      case 'general': return '非专科医生';
      case 'patient': return '病友';
      default: return '其他';
    }
  };

  const getIdentityColor = () => {
    switch(comment.identity) {
      case 'specialist': return 'bg-blue-50 text-blue-600';
      case 'general': return 'bg-purple-50 text-purple-600';
      case 'patient': return 'bg-green-50 text-green-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            {getIdentityIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{comment.author}</span>
              {comment.identity && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${getIdentityColor()}`}>
                  {getIdentityText()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <Clock className="w-3 h-3" />
              <span>{formatDate(comment.createdAt)}</span>
            </div>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={() => onDelete(comment.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">{comment.content}</p>

      <div className="flex items-center gap-4 pt-2 border-t">
        <button
          onClick={() => onLike(comment.id)}
          className={`flex items-center gap-1 text-sm ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />
          <span>{comment.likes || 0}</span>
        </button>
      </div>
    </div>
  );
};

// ========== 医案详情页主组件 ==========
const MobileCaseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [caseItem, setCaseItem] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [identity, setIdentity] = useState<'specialist' | 'general' | 'patient' | 'other'>('patient');
  const [contact, setContact] = useState('');
  const [showContact, setShowContact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    diagnosis: '',
    symptoms: [] as string[],
    description: '',
    treatment: '',
    outcome: '',
    tags: [] as string[]
  });
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) {
      navigate('/mobile/cases');
      return;
    }
    loadData();
  }, [id]);

  useEffect(() => {
    if (comments.length > 0) {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments.length]);

  useEffect(() => {
    if (caseItem && isEditing) {
      setEditFormData({
        title: caseItem.title || '',
        diagnosis: caseItem.diagnosis || '',
        symptoms: caseItem.symptoms || [],
        description: caseItem.description || '',
        treatment: caseItem.treatment || '',
        outcome: caseItem.outcome || '',
        tags: caseItem.tags || []
      });
    }
  }, [caseItem, isEditing]);

  const loadData = () => {
    setLoading(true);
    try {
      const savedCases = localStorage.getItem('medical_cases');
      if (savedCases) {
        const cases = JSON.parse(savedCases);
        const found = cases.find((c: any) => c.id === id);
        setCaseItem(found);
        
        if (found?.uploadedFiles?.length > 0) {
          const files: UploadedFile[] = found.uploadedFiles.map((f: any, index: number) => ({
            id: `file-${index}-${Date.now()}`,
            fileName: f.name || '未命名文件',
            fileType: f.type || 'application/octet-stream',
            fileSize: f.size || 0,
            fileData: f.url || f.fileData || ''
          }));
          setUploadedFiles(files);
        }
      }

      const savedComments = localStorage.getItem(`case_comments_${id}`);
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    const fileToDelete = uploadedFiles.find(f => f.id === fileId);
    if (!fileToDelete) return;

    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    
    if (caseItem) {
      const updatedUploadedFiles = caseItem.uploadedFiles.filter((f: any) => 
        f.name !== fileToDelete.fileName
      );
      
      const updatedCase = {
        ...caseItem,
        uploadedFiles: updatedUploadedFiles
      };
      
      const savedCases = localStorage.getItem('medical_cases');
      if (savedCases) {
        const cases = JSON.parse(savedCases);
        const index = cases.findIndex((c: any) => c.id === id);
        if (index !== -1) {
          cases[index] = updatedCase;
          localStorage.setItem('medical_cases', JSON.stringify(cases));
        }
      }
    }
  };

  const handleAddComment = () => {
    if (!user) {
      alert('请先登录');
      return;
    }
    if (!commentContent.trim()) return;
    if (!id) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      caseId: id,
      authorId: user.id,
      author: user.username || '用户',
      content: commentContent.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      identity: identity
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`case_comments_${id}`, JSON.stringify(updatedComments));
    setCommentContent('');
    setContact('');
    setShowContact(false);
  };

  const handleLikeComment = (commentId: string) => {
    if (!user) return;

    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        const liked = comment.likedBy?.includes(user.id);
        const likedBy = comment.likedBy || [];
        
        return {
          ...comment,
          likedBy: liked 
            ? likedBy.filter(id => id !== user.id)
            : [...likedBy, user.id],
          likes: liked ? comment.likes - 1 : comment.likes + 1
        };
      }
      return comment;
    }));

    setTimeout(() => {
      localStorage.setItem(`case_comments_${id}`, JSON.stringify(comments));
    }, 0);
  };

  const handleDeleteComment = (commentId: string) => {
    if (!user) return;
    if (!window.confirm('确定要删除这条评论吗？')) return;

    const updatedComments = comments.filter(c => c.id !== commentId);
    setComments(updatedComments);
    localStorage.setItem(`case_comments_${id}`, JSON.stringify(updatedComments));
  };

  const handleSaveEdit = () => {
    if (!caseItem || !user) return;
    
    const updatedCase = {
      ...caseItem,
      title: editFormData.title,
      diagnosis: editFormData.diagnosis,
      symptoms: editFormData.symptoms,
      description: editFormData.description,
      treatment: editFormData.treatment,
      outcome: editFormData.outcome,
      tags: editFormData.tags,
      updatedAt: new Date().toISOString()
    };
    
    const savedCases = localStorage.getItem('medical_cases');
    if (savedCases) {
      const cases = JSON.parse(savedCases);
      const index = cases.findIndex((c: any) => c.id === caseItem.id);
      if (index !== -1) {
        cases[index] = updatedCase;
        localStorage.setItem('medical_cases', JSON.stringify(cases));
      }
    }
    
    setCaseItem(updatedCase);
    setIsEditing(false);
    alert('医案已更新');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!caseItem) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500 mb-4">医案不存在</p>
          <button
            onClick={() => navigate('/mobile/cases')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="flex items-center p-4">
          <button onClick={() => navigate('/mobile/cases')} className="text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold">医案详情</h1>
          <div className="flex items-center gap-2">
            {(user?.id === caseItem.authorId || user?.role === 'admin') && (
  <button
    onClick={() => setIsEditing(true)}
    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
    title="编辑"
  >
    <Edit className="w-5 h-5 text-gray-600" />
  </button>
)}
            <CollectButton
              itemId={caseItem.id}
              itemType="case"
              itemData={{
                title: caseItem.title,
                description: caseItem.description || caseItem.diagnosis,
                date: caseItem.createdAt
              }}
              initialCollected={caseItem.isFavorite || false}
            />
          </div>
        </div>
      </div>

      <div className="p-4 pb-36">
        {isEditing ? (
          // 编辑表单
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-bold mb-4">编辑医案</h2>
            
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700 block mb-1">标题</label>
              <input
                type="text"
                value={editFormData.title}
                onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700 block mb-1">诊断</label>
              <input
                type="text"
                value={editFormData.diagnosis}
                onChange={(e) => setEditFormData({...editFormData, diagnosis: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700 block mb-1">症状（用逗号分隔）</label>
              <input
                type="text"
                value={editFormData.symptoms.join(', ')}
                onChange={(e) => setEditFormData({
                  ...editFormData, 
                  symptoms: e.target.value.split(/[,，]+/).map(s => s.trim()).filter(s => s)
                })}
                placeholder="例如：头痛, 发热, 咳嗽"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700 block mb-1">详细描述</label>
              <textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                rows={4}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700 block mb-1">治疗方案</label>
              <textarea
                value={editFormData.treatment}
                onChange={(e) => setEditFormData({...editFormData, treatment: e.target.value})}
                rows={3}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700 block mb-1">治疗效果</label>
              <textarea
                value={editFormData.outcome}
                onChange={(e) => setEditFormData({...editFormData, outcome: e.target.value})}
                rows={2}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1">标签（用逗号分隔）</label>
              <input
                type="text"
                value={editFormData.tags.join(', ')}
                onChange={(e) => setEditFormData({
                  ...editFormData, 
                  tags: e.target.value.split(/[,，]+/).map(s => s.trim()).filter(s => s)
                })}
                placeholder="例如：感冒, 呼吸道"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                保存修改
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{caseItem.title}</h2>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <User className="w-3 h-3" />
                <span>{caseItem.patientName}</span>
                <Clock className="w-3 h-3 ml-2" />
                <span>{new Date(caseItem.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="mb-3">
                <span className="text-xs text-gray-500 block mb-1">诊断</span>
                <span className="text-sm font-medium text-gray-900 bg-blue-50 px-3 py-1.5 rounded-lg">
                  {caseItem.diagnosis}
                </span>
              </div>

              {caseItem.symptoms?.length > 0 && (
                <div className="mb-3">
                  <span className="text-xs text-gray-500 block mb-1">症状</span>
                  <div className="flex flex-wrap gap-1">
                    {caseItem.symptoms.map((symptom: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {caseItem.description && (
                <div className="mb-3">
                  <span className="text-xs text-gray-500 block mb-1">详细描述</span>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {caseItem.description}
                  </p>
                </div>
              )}

              {caseItem.treatment && (
                <div className="mb-3">
                  <span className="text-xs text-gray-500 block mb-1">治疗方案</span>
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                    {caseItem.treatment}
                  </p>
                </div>
              )}

              {caseItem.outcome && (
                <div className="mb-3">
                  <span className="text-xs text-gray-500 block mb-1">治疗效果</span>
                  <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                    {caseItem.outcome}
                  </p>
                </div>
              )}

              {caseItem.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {caseItem.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {caseItem.imageUrls?.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs text-gray-500 block mb-2">相关图片</span>
                  <div className="grid grid-cols-3 gap-2">
                    {caseItem.imageUrls.map((url: string, idx: number) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`图片${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(url, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs text-gray-500 block mb-2">相关文件</span>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <FilePreview 
                        key={file.id} 
                        file={file} 
                        onDelete={handleDeleteFile}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                评论 ({comments.length})
              </h3>
              
              <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                <h4 className="font-medium mb-3 text-sm text-gray-700">写评论</h4>
                
                <IdentitySelector value={identity} onChange={(val) => setIdentity(val as any)} />
                
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="写下你的评论..."
                  rows={3}
                  className="w-full p-3 border rounded-lg resize-none text-sm mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <div className="mb-3">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={showContact}
                      onChange={(e) => setShowContact(e.target.checked)}
                      className="w-4 h-4"
                    />
                    留下联系方式（选填）
                  </label>
                  {showContact && (
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="微信号/手机号/邮箱"
                      className="w-full p-2 border rounded-lg mt-2 text-sm"
                    />
                  )}
                </div>
                
                <button
                  onClick={handleAddComment}
                  disabled={!commentContent.trim()}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  发布评论
                </button>
              </div>
              
              {comments.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center text-gray-400">
                  暂无评论，来说两句吧~
                </div>
              ) : (
                <>
                  {comments.map(comment => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      currentUserId={user?.id || ''}
                      onLike={handleLikeComment}
                      onDelete={handleDeleteComment}
                    />
                  ))}
                  <div ref={commentsEndRef} />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileCaseDetailPage;