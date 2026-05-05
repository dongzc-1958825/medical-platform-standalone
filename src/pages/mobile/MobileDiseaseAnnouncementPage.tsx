import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Bell,
  ChevronLeft,
  Heart,
  MessageCircle,
  Send,
  X,
  Plus,
  Tag,
  Trash2,
  AlertCircle,
  Search
} from 'lucide-react';
import CollectButton from '../../components/collection/CollectButton';

// ========== 获取当前用户 ==========
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('current-user');
    return userStr ? JSON.parse(userStr) : { id: 'default-user', username: '用户' };
  } catch {
    return { id: 'default-user', username: '用户' };
  }
};

// ========== 数据持久化 ==========
const loadAllMessages = () => {
  try {
    const saved = localStorage.getItem('medical_all_messages');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // 忽略错误
  }
  
  // 返回初始化数据，包含公告和 isCollected 字段
  return [
    {
      id: 'ann-1',
      type: 'announcement',
      title: '风湿病社区公告',
      content: '欢迎加入风湿病社区！本社区旨在为风湿病患者提供交流平台，分享治疗经验，互相支持。',
      author: '管理员',
      date: new Date().toLocaleDateString('zh-CN', { 
        month: 'numeric', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      tags: ['风湿病', '公告'],
      stats: { likes: 0, comments: 0 },
      publisherId: 'system',
      comments: [],
      disease: '风湿病',
      isCollected: false
    },
    {
      id: 'ann-2',
      type: 'announcement',
      title: '社区规则',
      content: '请遵守社区规则，文明交流，禁止发布广告和不当内容。',
      author: '管理员',
      date: new Date().toLocaleDateString('zh-CN', { 
        month: 'numeric', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      tags: ['风湿病', '规则'],
      stats: { likes: 0, comments: 0 },
      publisherId: 'system',
      comments: [],
      disease: '风湿病',
      isCollected: false
    }
  ];
};

const saveAllMessages = (messages: any[]) => {
  try {
    localStorage.setItem('medical_all_messages', JSON.stringify(messages));
  } catch (error) {
    console.error("保存失败:", error);
  }
};

// ========== 发布弹窗 ==========
const PublishModal: React.FC<{
  diseaseName: string;
  onPublish: (message: any) => void;
  onClose: () => void;
}> = ({ diseaseName, onPublish, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([diseaseName]);
  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = getCurrentUser();

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);

    const newMessage = {
      id: `ann_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type: 'announcement',
      title: title.trim(),
      content: content.trim(),
      author: user.username || '用户',
      date: new Date().toLocaleDateString('zh-CN', { 
        month: 'numeric', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      tags: tags,
      stats: { likes: 0, comments: 0 },
      publisherId: user.id,
      comments: [],
      disease: diseaseName,
      isCollected: false
    };

    const allMessages = loadAllMessages();
    saveAllMessages([newMessage, ...allMessages]);
    onPublish(newMessage);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl">
        <div className="p-4 border-b flex justify-between">
          <h2 className="text-lg font-semibold">发布公告</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="公告标题"
            className="w-full p-3 border rounded-lg"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="公告内容"
            rows={4}
            className="w-full p-3 border rounded-lg"
            required
          />
          <div className="flex gap-2">
            <input
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
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
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isSubmitting ? '发布中...' : '发布'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ========== 评论面板 ==========
const CommentsPanel: React.FC<{
  message: any;
  onClose: () => void;
  onAddComment: (messageId: string, content: string) => void;
}> = ({ message, onClose, onAddComment }) => {
  const [newComment, setNewComment] = useState("");
  const user = getCurrentUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(message.id, newComment.trim());
      setNewComment("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-2xl">
        <div className="p-4 border-b flex justify-between">
          <h3 className="font-semibold">评论 ({message.comments?.length || 0})</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          {message.comments?.map((c: any) => (
            <div key={c.id} className="mb-4 pb-2 border-b">
              <div className="flex justify-between">
                <span className="font-medium">{c.user}</span>
                <span className="text-xs text-gray-500">{c.time}</span>
              </div>
              <p className="mt-1">{c.content}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写评论..."
            className="flex-1 p-2 border rounded-full"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-full">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

// ========== 删除确认 ==========
const DeleteConfirm: React.FC<{
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ title, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-sm rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">确认删除</h3>
      <p className="mb-6">确定删除"{title.length > 30 ? title.substring(0,30)+'...' : title}"？</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2 border rounded-lg">取消</button>
        <button onClick={onConfirm} className="flex-1 py-2 bg-red-600 text-white rounded-lg">删除</button>
      </div>
    </div>
  </div>
);

// ========== 主页面 ==========
const MobileDiseaseAnnouncementPage: React.FC = () => {
  const navigate = useNavigate();
  const { diseaseId } = useParams();
  const location = useLocation();
  const [showPublish, setShowPublish] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [interactionData, setInteractionData] = useState({});
  const [searchKeyword, setSearchKeyword] = useState('');

  const diseaseName = location.state?.diseaseName || '风湿病';
  const user = getCurrentUser();

  useEffect(() => {
    const messages = loadAllMessages();
    console.log('所有消息:', messages);
    const filtered = messages.filter((m: any) => 
      m.type === 'announcement' && m.disease === diseaseName
    );
    console.log('过滤后公告:', filtered);
    setAnnouncements(filtered);

    // 添加事件监听
    const handleTestPublish = () => {
      console.log('📢 收到测试事件，强制打开发布窗口');
      setShowPublish(true);
    };
    
    window.addEventListener('test-publish', handleTestPublish);
    
    // 清理事件监听
    return () => {
      window.removeEventListener('test-publish', handleTestPublish);
    };
  }, [diseaseName]);

  const getUserInteraction = (msgId: string) => 
    user ? interactionData[`${user.id}_${msgId}`] || { liked: false } : { liked: false };

  const handlePublish = (newMsg: any) => {
    setAnnouncements(prev => [newMsg, ...prev]);
  };

  const handleLike = (msgId: string) => {
    if (!user) return alert('请先登录');
    setAnnouncements(prev => prev.map(msg => {
      if (msg.id === msgId) {
        const liked = !getUserInteraction(msgId).liked;
        const newData = { ...interactionData, [`${user.id}_${msgId}`]: { liked } };
        setInteractionData(newData);
        return { ...msg, stats: { ...msg.stats, likes: (msg.stats.likes || 0) + (liked ? 1 : -1) } };
      }
      return msg;
    }));
  };

  const handleAddComment = (msgId: string, content: string) => {
    if (!user) return alert('请先登录');
    setAnnouncements(prev => prev.map(msg => {
      if (msg.id === msgId) {
        const newComment = {
          id: `c_${Date.now()}`,
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
        const updated = allMessages.map((m: any) => 
          m.id === msgId ? { ...m, comments: [...(m.comments || []), newComment] } : m
        );
        saveAllMessages(updated);
        return { ...msg, comments: [...(msg.comments || []), newComment] };
      }
      return msg;
    }));
  };

  const handleDelete = (msg: any) => {
    const allMessages = loadAllMessages();
    saveAllMessages(allMessages.filter((m: any) => m.id !== msg.id));
    setAnnouncements(prev => prev.filter(m => m.id !== msg.id));
    setDeleteTarget(null);
  };

  const filtered = announcements.filter(msg =>
    msg.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {showPublish && (
        <PublishModal
          diseaseName={diseaseName}
          onPublish={handlePublish}
          onClose={() => setShowPublish(false)}
        />
      )}

      {showComments && (
        <CommentsPanel
          message={announcements.find(m => m.id === showComments)}
          onClose={() => setShowComments(null)}
          onAddComment={handleAddComment}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          title={deleteTarget.title}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* 导航栏 */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="flex items-center p-4">
          <button onClick={() => navigate(`/mobile/community/${diseaseId}`, { state: { diseaseName } })}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold">{diseaseName}公告</h1>
        </div>
      </div>

      {/* 搜索 */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜索公告..."
            className="w-full pl-10 pr-4 py-3 border rounded-xl"
          />
        </div>
      </div>

      {/* 公告列表 */}
      <div className="px-4 pb-20 space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">
              {searchKeyword ? '没有找到相关公告' : '当前社区暂无公告'}
            </p>
            <button
              onClick={() => setShowPublish(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              发布第一条公告
            </button>
          </div>
        ) : (
          filtered.map(msg => {
            const userInteraction = getUserInteraction(msg.id);
            const canDelete = user && msg.publisherId === user.id;

            return (
              <div key={msg.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold">{msg.title}</h3>
                  {canDelete && (
                    <button onClick={() => setDeleteTarget(msg)}>
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-3">{msg.content}</p>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <span>{msg.author}</span>
                  <span>·</span>
                  <span>{msg.date}</span>
                </div>

                {msg.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {msg.tags.map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-xs">
                        <Tag className="w-3 h-3 inline mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm border-t pt-3">
                  <button
                    onClick={() => handleLike(msg.id)}
                    className={`flex items-center gap-1 ${userInteraction.liked ? 'text-red-500' : ''}`}
                  >
                    <Heart className={`w-4 h-4 ${userInteraction.liked ? 'fill-red-500' : ''}`} />
                    {msg.stats?.likes || 0}
                  </button>

                  <button
                    onClick={() => setShowComments(msg.id)}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {msg.comments?.length || 0}
                  </button>

                  <CollectButton
                    itemId={msg.id}
                    itemType="announcement"
                    itemData={{
                      title: msg.title || '未命名公告',
                      description: msg.content || '',
                      date: msg.date || '',
                      tags: msg.tags || [],
                      disease: msg.disease || diseaseName,
                      diseaseId: diseaseId,
                      author: msg.author || '',
                      type: 'announcement'
                    }}
                    initialCollected={msg.isCollected || false}
                    size="sm"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 浮动发布按钮 */}
      <button
        onClick={() => setShowPublish(true)}
        className="fixed bottom-20 right-4 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-50"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MobileDiseaseAnnouncementPage;