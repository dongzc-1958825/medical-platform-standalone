import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  BookOpen,
  ChevronLeft,
  Heart,
  MessageCircle,
  Eye,
  Download,
  Trash2,
  AlertCircle,
  Search,
  Video,
  FileText,
  User,
  Stethoscope,
  Building2,
  X,
  Plus,
  Link as LinkIcon,
  Upload,
  Send
} from 'lucide-react';
import CollectButton from '../../components/collection/CollectButton';
import { documentParser } from '../../shared/services/documentParser';

// ========== 身份类型定义 ==========
const IDENTITY_TYPES = {
  specialist: { label: '专科医生', icon: Stethoscope, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  general: { label: '非专科医生', icon: User, color: 'text-green-600', bgColor: 'bg-green-50' },
  patient: { label: '病友', icon: Heart, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  other: { label: '非病友', icon: User, color: 'text-gray-600', bgColor: 'bg-gray-50' }
};

// ========== 讲座类型定义 ==========
const LECTURE_TYPES = {
  video: { icon: Video, label: '视频讲座', color: 'text-red-600', bgColor: 'bg-red-50' },
  article: { icon: FileText, label: '文章讲座', color: 'text-blue-600', bgColor: 'bg-blue-50' }
};

// ========== 获取当前用户 ==========
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('current-user');
    return userStr ? JSON.parse(userStr) : { id: 'default-user', username: '用户' };
  } catch {
    return { id: 'default-user', username: '用户' };
  }
};

// ========== 复用消息系统的数据加载函数 ==========
const loadAllMessages = () => {
  try {
    const saved = localStorage.getItem('medical_all_messages');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveAllMessages = (messages: any[]) => {
  try {
    localStorage.setItem('medical_all_messages', JSON.stringify(messages));
  } catch (error) {
    console.error("保存失败:", error);
  }
};

const loadInteractionData = () => {
  try {
    const saved = localStorage.getItem('medical_message_interactions');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const saveInteractionData = (data: any) => {
  try {
    localStorage.setItem('medical_message_interactions', JSON.stringify(data));
  } catch (error) {
    console.error("保存失败:", error);
  }
};

// ========== 评论面板组件 ==========
const CommentsPanel: React.FC<{
  lecture: any;
  onClose: () => void;
  onAddComment: (lectureId: string, content: string) => void;
}> = ({ lecture, onClose, onAddComment }) => {
  const [newComment, setNewComment] = useState("");
  const user = getCurrentUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(lecture.id, newComment.trim());
      setNewComment("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-2xl max-h-[80vh] flex flex-col">
        {/* 头部 */}
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">评论 ({lecture.comments?.length || 0})</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 评论列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {lecture.comments && lecture.comments.length > 0 ? (
            lecture.comments.map((comment: any) => {
              const identity = comment.identity ? 
                IDENTITY_TYPES[comment.identity as keyof typeof IDENTITY_TYPES] : 
                IDENTITY_TYPES.other;
              const IdentityIcon = identity.icon;

              return (
                <div key={comment.id} className="border-b pb-3 last:border-0">
                  <div className="flex items-start gap-2">
                    <div className={`w-6 h-6 rounded-full ${identity.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <IdentityIcon className={`w-3 h-3 ${identity.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{comment.user}</span>
                        {comment.identity && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${identity.bgColor} ${identity.color}`}>
                            {identity.label}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">{comment.time}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-400">
              暂无评论，来说两句吧~
            </div>
          )}
        </div>

        {/* 评论输入框 */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="写下你的评论..."
              className="flex-1 p-3 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ========== 发布讲座弹窗 ==========
const PublishLectureModal: React.FC<{
  diseaseName: string;
  onPublish: (lecture: any) => void;
  onClose: () => void;
}> = ({ diseaseName, onPublish, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lectureType, setLectureType] = useState<'video' | 'article'>('article');
  const [speakerName, setSpeakerName] = useState("");
  const [speakerIdentity, setSpeakerIdentity] = useState<keyof typeof IDENTITY_TYPES>('specialist');
  const [speakerOrg, setSpeakerOrg] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [tags, setTags] = useState<string[]>([diseaseName]);
  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 视频相关状态
  const [shareUrl, setShareUrl] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  
  // 文章相关状态
  const [isDraggingArticle, setIsDraggingArticle] = useState(false);
  
  const user = getCurrentUser();

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  // ========== 视频相关函数 ==========
  const parseShareUrl = async () => {
    if (!shareUrl.trim()) return alert('请输入分享链接');
    
    setIsParsing(true);
    
    try {
      if (shareUrl.includes('bilibili.com') || shareUrl.includes('b23.tv')) {
        setTitle('【B站视频】');
        setVideoUrl(shareUrl);
        setSpeakerName('B站UP主');
        setSpeakerIdentity('other');
        setSpeakerOrg('Bilibili');
      } else if (shareUrl.includes('youtube.com') || shareUrl.includes('youtu.be')) {
        setTitle('【YouTube视频】');
        setVideoUrl(shareUrl);
        setSpeakerName('YouTube博主');
        setSpeakerIdentity('other');
        setSpeakerOrg('YouTube');
      } else if (shareUrl.includes('douyin.com') || shareUrl.includes('tiktok.com')) {
        setTitle('【抖音视频】');
        setVideoUrl(shareUrl);
        setSpeakerName('抖音创作者');
        setSpeakerIdentity('other');
        setSpeakerOrg('抖音');
      } else {
        setTitle('【视频分享】');
        setVideoUrl(shareUrl);
        setSpeakerName('分享者');
        setSpeakerIdentity('other');
      }
      
      alert('✅ 链接解析成功！请补充其他信息后发布。');
    } catch (error) {
      console.error('解析失败:', error);
      alert('❌ 解析失败，请手动填写信息');
    } finally {
      setIsParsing(false);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert('视频文件大小不能超过100MB');
      return;
    }

    if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
      alert(`✅ 视频已加载: ${file.name}\n大小: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    } else {
      alert('❌ 请选择视频文件');
    }
  };

  const handleVideoDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingVideo(true);
  };

  const handleVideoDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingVideo(false);
  };

  const handleVideoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingVideo(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        setVideoUrl(url);
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
        alert(`✅ 视频已加载: ${file.name}`);
      } else {
        alert('❌ 请拖拽视频文件');
      }
    }
  };

  // ========== 文章相关函数（支持Word/PDF） ==========
  const handleArticleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingArticle(true);
  };

  const handleArticleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingArticle(false);
  };

  const handleArticleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleArticleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingArticle(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      // 检查文件是否支持
      if (!documentParser.isSupported(file)) {
        alert('❌ 不支持的文件格式，请上传 Word(.docx)、PDF 或文本文件');
        return;
      }
      
      try {
        alert('🔄 正在解析文档，请稍候...');
        
        // 使用文档解析器自动识别并解析
        const content = await documentParser.parseDocument(file);
        
        setContent(content);
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
        alert(`✅ 文档已加载: ${file.name}\n字数: ${content.length}`);
        
      } catch (error: any) {
        alert(`❌ 解析失败: ${error.message}`);
      }
    }
  };

  // 处理文章文件上传
  const handleArticleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      alert('🔄 正在解析文档，请稍候...');
      const content = await documentParser.parseDocument(file);
      setContent(content);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    } catch (error: any) {
      alert(`❌ 解析失败: ${error.message}`);
    }
  };

  // 通用粘贴处理
  const handlePaste = (e: React.ClipboardEvent) => {
    if (lectureType === 'video') {
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file' && item.type.startsWith('video/')) {
          const file = item.getAsFile();
          if (file) {
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
            setTitle(file.name.replace(/\.[^/.]+$/, ""));
            alert(`✅ 视频已加载: ${file.name}`);
            break;
          }
        }
      }
    } else {
      // 文章粘贴处理
      const text = e.clipboardData?.getData('text/plain');
      if (text) {
        setContent(text);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return alert('请输入讲座标题');
    if (!speakerName.trim()) return alert('请输入讲师姓名');
    
    if (lectureType === 'video' && !videoUrl.trim()) {
      return alert('请输入视频链接或上传视频');
    }
    
    if (lectureType === 'article' && !content.trim()) {
      return alert('请输入文章内容');
    }

    setIsSubmitting(true);

    const newLecture = {
      id: `lecture_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type: 'lecture',
      lectureType: lectureType,
      title: title.trim(),
      content: lectureType === 'article' ? content.trim() : videoUrl.trim(),
      videoUrl: lectureType === 'video' ? videoUrl.trim() : undefined,
      speakerName: speakerName.trim(),
      speakerIdentity: speakerIdentity,
      speakerOrg: speakerOrg.trim(),
      disease: diseaseName,
      author: user.username || '用户',
      publisherId: user.id,
      date: new Date().toLocaleDateString('zh-CN', { 
        month: 'numeric', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      tags: tags,
      stats: { likes: 0, comments: 0, views: 0 },
      isCollected: false,
      comments: []
    };

    const allMessages = loadAllMessages();
    saveAllMessages([newLecture, ...allMessages]);
    
    onPublish(newLecture);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">发布讲座</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="p-4 space-y-4"
          onPaste={handlePaste}
        >
          {/* 讲座类型选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">讲座类型</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setLectureType('article');
                  setVideoUrl("");
                  setShareUrl("");
                }}
                className={`flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 ${
                  lectureType === 'article'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>文章讲座</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLectureType('video');
                  setContent("");
                }}
                className={`flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 ${
                  lectureType === 'video'
                    ? 'bg-red-50 border-red-500 text-red-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Video className="w-5 h-5" />
                <span>视频讲座</span>
              </button>
            </div>
          </div>

          {/* 视频上传区域 - 只在视频类型时显示 */}
          {lectureType === 'video' && (
            <>
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  isDraggingVideo 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                onClick={() => document.getElementById('video-upload')?.click()}
                onDragEnter={handleVideoDragEnter}
                onDragLeave={handleVideoDragLeave}
                onDragOver={handleVideoDragOver}
                onDrop={handleVideoDrop}
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {isDraggingVideo ? '松开鼠标上传视频' : '点击或拖拽视频文件到这里'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  支持MP4、MOV等视频格式，或直接粘贴 (Ctrl+V)
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-800 mb-2">📱 手机视频号上传方法</p>
                <ol className="text-xs text-blue-700 list-decimal ml-4 space-y-1">
                  <li>打开视频号视频，点击右下角「分享」按钮</li>
                  <li>选择「保存到相册」将视频下载到手机</li>
                  <li>在电脑上打开文件管理器，找到保存的视频</li>
                  <li>拖拽到上面的区域，或复制后粘贴 (Ctrl+V)</li>
                </ol>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">或者粘贴视频链接</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={shareUrl}
                    onChange={(e) => setShareUrl(e.target.value)}
                    placeholder="B站/YouTube/抖音等链接"
                    className="flex-1 p-3 border rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={parseShareUrl}
                    disabled={isParsing}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
                  >
                    {isParsing ? '解析中...' : '解析'}
                  </button>
                </div>
              </div>

              <input
                type="file"
                id="video-upload"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </>
          )}

          {/* 文章上传区域 - 只在文章类型时显示（支持Word/PDF） */}
          {lectureType === 'article' && (
            <>
              <div 
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                  isDraggingArticle 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                onClick={() => document.getElementById('article-upload')?.click()}
                onDragEnter={handleArticleDragEnter}
                onDragLeave={handleArticleDragLeave}
                onDragOver={handleArticleDragOver}
                onDrop={handleArticleDrop}
              >
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-600">
                  {isDraggingArticle ? '松开鼠标上传文章' : '点击或拖拽文档到这里'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  支持 Word(.docx)、PDF、文本文件，自动提取文字
                </p>
              </div>

              <input
                type="file"
                id="article-upload"
                accept=".doc,.docx,.pdf,.txt,.md,application/msword,application/pdf,text/plain"
                onChange={handleArticleUpload}
                className="hidden"
              />

              <div className="bg-amber-50 rounded-lg p-2">
                <p className="text-xs text-amber-700">
                  📌 提示：Word和PDF文件将自动提取文字内容，扫描件可能无法识别。
                </p>
              </div>
            </>
          )}

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">讲座标题</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lectureType === 'video' ? "例如：风湿病日常护理指南" : "请输入文章标题"}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          {/* 讲师信息 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">讲师姓名</label>
              <input
                value={speakerName}
                onChange={(e) => setSpeakerName(e.target.value)}
                placeholder="张建国"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">讲师身份</label>
              <select
                value={speakerIdentity}
                onChange={(e) => setSpeakerIdentity(e.target.value as keyof typeof IDENTITY_TYPES)}
                className="w-full p-3 border rounded-lg bg-white"
              >
                <option value="specialist">专科医生</option>
                <option value="general">非专科医生</option>
                <option value="patient">病友</option>
                <option value="other">非病友</option>
              </select>
            </div>
          </div>

          {/* 单位名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">单位名称</label>
            <input
              value={speakerOrg}
              onChange={(e) => setSpeakerOrg(e.target.value)}
              placeholder="例如：北京协和医院"
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* 视频链接 或 文章内容 */}
          {lectureType === 'video' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">视频链接</label>
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://... 或已上传的视频"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">文章内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onPaste={(e) => {
                  const text = e.clipboardData?.getData('text/plain');
                  if (text) {
                    setContent(text);
                  }
                }}
                placeholder="请输入文章内容，或从其他平台复制后直接粘贴 (Ctrl+V)"
                rows={10}
                className="w-full p-3 border rounded-lg resize-none font-mono"
                required
              />
              <div className="mt-1 space-y-1">
                <p className="text-xs text-gray-400">
                  ✨ 已输入 {content.length} 字
                </p>
                <p className="text-xs text-green-600">
                  📄 支持拖拽 Word、PDF 文件，自动提取文字
                </p>
              </div>
            </div>
          )}

          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
            <div className="flex gap-2 mb-2">
              <input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="添加标签"
                className="flex-1 p-2 border rounded-lg"
              />
              <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-gray-100 rounded-lg">
                添加
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? '发布中...' : '发布讲座'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ========== 讲座列表页 ==========
const MobileDiseaseLecturePage: React.FC = () => {
  const navigate = useNavigate();
  const { diseaseId } = useParams();
  const location = useLocation();
  const [lectures, setLectures] = useState<any[]>([]);
  const [interactionData, setInteractionData] = useState({});
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'video' | 'article'>('all');
  const [showPublish, setShowPublish] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);

  const diseaseName = location.state?.diseaseName || 
    (diseaseId === 'fxm' ? '风湿病' : 
     diseaseId === 'gxy' ? '高血压' :
     diseaseId === 'tnb' ? '糖尿病' :
     diseaseId === 'gxb' ? '冠心病' :
     diseaseId === 'gjy' ? '关节炎' :
     diseaseId === 'copf' ? '慢阻肺' :
     diseaseId === 'pjs' ? '偏头痛' :
     diseaseId === 'qgy' ? '青光眼' :
     diseaseId === 'sxeb' ? '神经性耳聋' :
     diseaseId === 'ylxgb' ? '乙型肝炎' :
     diseaseId === 'yxj' ? '抑郁症' :
     diseaseId === 'gm' ? '感冒' : '专病');
  const user = getCurrentUser();

  // 加载当前病种的讲座
  useEffect(() => {
    const allMessages = loadAllMessages();
    const interactions = loadInteractionData();
    setInteractionData(interactions);

    const lecturesList = allMessages.filter((msg: any) => {
      const isLecture = msg.type === 'lecture' || msg.lectureType !== undefined;
      const matchesDisease = msg.disease === diseaseName;
      return isLecture && matchesDisease;
    });
    
    lecturesList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setLectures(lecturesList);
  }, [diseaseName]);

  const getUserInteraction = (lectureId: string) => {
    if (!user) return { liked: false };
    return interactionData[`${user.id}_${lectureId}`] || { liked: false };
  };

  const handlePublish = (newLecture: any) => {
    setLectures(prev => [newLecture, ...prev]);
  };

  const handleLike = (lectureId: string) => {
    if (!user) return alert('请先登录');

    setLectures(prev => prev.map(lecture => {
      if (lecture.id === lectureId) {
        const liked = !getUserInteraction(lectureId).liked;
        const newInteraction = { ...interactionData, [`${user.id}_${lectureId}`]: { liked } };
        setInteractionData(newInteraction);
        saveInteractionData(newInteraction);

        const allMessages = loadAllMessages();
        const updated = allMessages.map((msg: any) =>
          msg.id === lectureId
            ? { ...msg, stats: { ...msg.stats, likes: (msg.stats.likes || 0) + (liked ? 1 : -1) } }
            : msg
        );
        saveAllMessages(updated);

        return {
          ...lecture,
          stats: { ...lecture.stats, likes: (lecture.stats.likes || 0) + (liked ? 1 : -1) }
        };
      }
      return lecture;
    }));
  };

  const handleAddComment = (lectureId: string, content: string) => {
    if (!user) return alert('请先登录');

    setLectures(prev => prev.map(lecture => {
      if (lecture.id === lectureId) {
        const newComment = {
          id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          user: user.username || '用户',
          identity: 'other',
          content,
          time: new Date().toLocaleDateString('zh-CN', { 
            month: 'numeric', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };

        const allMessages = loadAllMessages();
        const updatedMessages = allMessages.map((msg: any) =>
          msg.id === lectureId
            ? { 
                ...msg, 
                comments: [...(msg.comments || []), newComment],
                stats: { ...msg.stats, comments: (msg.stats.comments || 0) + 1 }
              }
            : msg
        );
        saveAllMessages(updatedMessages);

        return {
          ...lecture,
          comments: [...(lecture.comments || []), newComment],
          stats: { ...lecture.stats, comments: (lecture.stats.comments || 0) + 1 }
        };
      }
      return lecture;
    }));

    setShowComments(null);
  };

  const handleDelete = (lectureId: string) => {
    if (!window.confirm('确定要删除这个讲座吗？')) return;
    
    const allMessages = loadAllMessages();
    const updated = allMessages.filter((msg: any) => msg.id !== lectureId);
    saveAllMessages(updated);
    setLectures(prev => prev.filter(l => l.id !== lectureId));
  };

  const handleDownload = (lecture: any) => {
    const lectureType = lecture.lectureType || lecture.type;
    if (lectureType === 'video') {
      window.open(lecture.videoUrl || lecture.content, '_blank');
    } else {
      const content = lecture.content || '无内容';
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${lecture.title}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const filteredLectures = lectures.filter(lecture => {
    const matchesSearch = lecture.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         lecture.speakerName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         lecture.speakerOrg?.toLowerCase().includes(searchKeyword.toLowerCase());
    const lectureType = lecture.lectureType || lecture.type;
    const matchesType = selectedType === 'all' || lectureType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="flex items-center p-4">
          <button onClick={() => navigate(`/mobile/community/${diseaseId}`)}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold">{diseaseName}专病讲座</h1>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜索讲座标题、讲师..."
            className="w-full pl-10 pr-4 py-3 border rounded-xl"
          />
        </div>
      </div>

      {/* 类型筛选 */}
      <div className="px-4 pb-2 flex gap-2">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedType === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          全部
        </button>
        <button
          onClick={() => setSelectedType('video')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
            selectedType === 'video'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Video className="w-4 h-4" />
          视频讲座
        </button>
        <button
          onClick={() => setSelectedType('article')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
            selectedType === 'article'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          文章讲座
        </button>
      </div>

      {/* 讲座列表 */}
      <div className="px-4 pb-20 space-y-4">
        {filteredLectures.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">
              {searchKeyword ? '没有找到相关讲座' : '暂无讲座'}
            </p>
            <button
              onClick={() => setShowPublish(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              发布讲座
            </button>
          </div>
        ) : (
          filteredLectures.map((lecture, index) => {
            const lectureType = lecture.lectureType || lecture.type || 'article';
            const LectureIcon = LECTURE_TYPES[lectureType as keyof typeof LECTURE_TYPES]?.icon || FileText;
            const lectureColor = LECTURE_TYPES[lectureType as keyof typeof LECTURE_TYPES]?.color || 'text-blue-600';
            const lectureBg = LECTURE_TYPES[lectureType as keyof typeof LECTURE_TYPES]?.bgColor || 'bg-blue-50';
            
            const speakerIdentity = lecture.speakerIdentity ? 
              IDENTITY_TYPES[lecture.speakerIdentity as keyof typeof IDENTITY_TYPES] : 
              IDENTITY_TYPES.other;
            const IdentityIcon = speakerIdentity.icon;

            const userInteraction = getUserInteraction(lecture.id);
            const canDelete = user && lecture.publisherId === user.id;

            return (
              <div key={lecture.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-medium text-gray-400 w-6">
                      #{index + 1}
                    </span>
                    <h3 className="font-semibold text-gray-900 flex-1">{lecture.title}</h3>
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(lecture.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="ml-9 mb-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">{lecture.speakerName || '匿名讲师'}</span>
                    {lecture.speakerIdentity && (
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${speakerIdentity.bgColor}`}>
                        <IdentityIcon className={`w-3 h-3 ${speakerIdentity.color}`} />
                        <span className={`text-xs ${speakerIdentity.color}`}>{speakerIdentity.label}</span>
                      </div>
                    )}
                  </div>
                  {lecture.speakerOrg && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Building2 className="w-3 h-3" />
                      <span>{lecture.speakerOrg}</span>
                    </div>
                  )}
                </div>

                <div className="ml-9 flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (lectureType === 'video') {
                        window.open(lecture.videoUrl || lecture.content, '_blank');
                      } else {
                        alert(`文章内容：\n\n${lecture.content || '无内容'}`);
                      }
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${lectureBg} ${lectureColor} hover:opacity-80 transition-opacity`}
                  >
                    <LectureIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {lectureType === 'video' ? '观看视频' : '阅读文章'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleDownload(lecture)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                    title="下载"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <CollectButton
                    itemId={lecture.id}
                    itemType="lecture"
                    itemData={{
                      title: lecture.title,
                      description: lecture.content?.substring(0, 200),
                      date: lecture.date,
                      tags: lecture.tags,
                      disease: lecture.disease || diseaseName,
                      diseaseId: diseaseId,
                      speakerName: lecture.speakerName,
                      speakerIdentity: lecture.speakerIdentity,
                      speakerOrg: lecture.speakerOrg,
                      lectureType: lectureType
                    }}
                    initialCollected={lecture.isCollected || false}
                    size="sm"
                  />
                </div>

                <div className="ml-9 mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <button
                    onClick={() => handleLike(lecture.id)}
                    className={`flex items-center gap-1 ${userInteraction.liked ? 'text-red-500' : 'hover:text-red-500'}`}
                  >
                    <Heart className={`w-3 h-3 ${userInteraction.liked ? 'fill-red-500' : ''}`} />
                    {lecture.stats?.likes || 0}
                  </button>
                  <button
                    onClick={() => setShowComments(lecture.id)}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <MessageCircle className="w-3 h-3" />
                    {lecture.stats?.comments || 0}
                  </button>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {lecture.stats?.views || 0}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 浮动发布按钮 */}
      <button
        onClick={() => setShowPublish(true)}
        className="fixed bottom-20 right-4 p-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* 发布弹窗 */}
      {showPublish && (
        <PublishLectureModal
          diseaseName={diseaseName}
          onPublish={handlePublish}
          onClose={() => setShowPublish(false)}
        />
      )}

      {/* 评论面板 */}
      {showComments && (
        <CommentsPanel
          lecture={lectures.find(l => l.id === showComments)}
          onClose={() => setShowComments(null)}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
};

export default MobileDiseaseLecturePage;