import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { 
  Bell, Pin, Heart, MessageCircle, Eye, ChevronRight, 
  Send, X, Plus, Users, Calendar, Clock, Tag, Edit,
  Trash2, AlertCircle, Star, Bookmark, BookmarkCheck
} from 'lucide-react';
import CollectButton from '../collection/CollectButton';

// ========== 消息类型定义 ==========
const MESSAGE_TYPES = {
  announcement: { icon: "📢", label: "社区公告", color: "bg-green-50 text-green-600" },
  activity: { icon: "🎉", label: "社区活动", color: "bg-purple-50 text-purple-600" },
  sharing: { icon: "💝", label: "病友分享", color: "bg-pink-50 text-pink-600" },
  question: { icon: "❓", label: "病友提问", color: "bg-orange-50 text-orange-600" }
};

// ========== 数据持久化函数 ==========
const saveAllMessages = (messages: any[]) => {
  try {
    localStorage.setItem('medical_all_messages', JSON.stringify(messages));
  } catch (error) {
    console.error("保存消息数据失败:", error);
  }
};

const loadAllMessages = () => {
  try {
    const saved = localStorage.getItem('medical_all_messages');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("加载消息数据失败:", error);
    return [];
  }
};

const saveInteractionData = (data: any) => {
  try {
    localStorage.setItem('medical_message_interactions', JSON.stringify(data));
  } catch (error) {
    console.error("保存互动数据失败:", error);
  }
};

const loadInteractionData = () => {
  try {
    const saved = localStorage.getItem('medical_message_interactions');
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("加载互动数据失败:", error);
    return {};
  }
};

// ========== 发布表单组件 ==========
const PublishForm: React.FC<{
  diseaseName: string;
  onPublish: (message: any) => void;
  onClose: () => void;
  user: any;
}> = ({ diseaseName, onPublish, onClose, user }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedType, setSelectedType] = useState<keyof typeof MESSAGE_TYPES>("announcement");
  const [tags, setTags] = useState<string[]>([diseaseName]);
  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("请输入标题");
      return;
    }
    
    if (!content.trim()) {
      alert("请输入内容");
      return;
    }

    setIsSubmitting(true);

    const newMessage = {
      id: `community_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: selectedType,
      title: title.trim(),
      content: content.trim(),
      summary: content.trim().substring(0, 100) + (content.trim().length > 100 ? "..." : ""),
      author: user.username || user.email?.split('@')[0] || "用户",
      authorAvatar: user.avatar || "👤",
      date: new Date().toLocaleDateString('zh-CN', { 
        month: 'numeric', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isPinned: false,
      isRead: false,
      tags: [...tags],
      stats: { likes: 0, comments: 0, views: 1 },
      isCollected: false,
      publisherId: user.id,
      source: "community",
      comments: [],
      disease: diseaseName
    };

    // 保存到全局消息系统
    const allMessages = loadAllMessages();
    const updatedMessages = [newMessage, ...allMessages];
    saveAllMessages(updatedMessages);

    setTimeout(() => {
      onPublish(newMessage);
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Plus className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">发布社区公告</h2>
              <p className="text-sm text-gray-500">{diseaseName}社区</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                消息类型
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(MESSAGE_TYPES).map(([type, config]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type as keyof typeof MESSAGE_TYPES)}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                      selectedType === type
                        ? `${config.color} border-green-500`
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl mb-2">{config.icon}</span>
                    <span className="font-medium text-sm">{config.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标题 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入公告标题"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                内容 *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请输入详细内容..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="输入标签后按Enter添加"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                >
                  添加
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-green-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 border-t flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                发布中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                立即发布
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== 删除确认对话框 ==========
const DeleteConfirmDialog: React.FC<{
  messageTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ messageTitle, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">确认删除</h3>
            <p className="text-sm text-gray-500">此操作不可恢复</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">
            确定要删除公告：
          </p>
          <p className="font-medium text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg">
            "{messageTitle.length > 50 ? messageTitle.substring(0, 50) + "..." : messageTitle}"
          </p>
          <p className="text-sm text-red-600 mt-3">
            ⚠️ 删除后，该公告的所有点赞、评论和收藏数据将同时删除。
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            确认删除
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== 评论面板组件 ==========
const CommentsPanel: React.FC<{
  message: any;
  onClose: () => void;
  onAddComment: (messageId: string, content: string) => void;
  onLikeComment: (messageId: string, commentId: string) => void;
}> = ({ message, onClose, onAddComment, onLikeComment }) => {
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(message.id, newComment.trim());
      setNewComment("");
    }
  };

  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full max-w-md max-h-[80vh] rounded-t-2xl md:rounded-2xl flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-green-500" />
            <h3 className="font-bold text-gray-900">评论 ({message.comments?.length || 0})</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {message.comments && message.comments.length > 0 ? (
            <div className="space-y-4">
              {message.comments.map((comment: any) => (
                <div key={comment.id} className="border-b pb-4 last:border-0">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                      {comment.avatar || "👤"}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">{comment.user}</div>
                          <div className="text-xs text-gray-500">{comment.time}</div>
                        </div>
                        <button
                          onClick={() => onLikeComment(message.id, comment.id)}
                          className="flex items-center gap-1 text-gray-500 hover:text-red-500"
                        >
                          <Heart className={`w-4 h-4 ${comment.liked ? "fill-red-500 text-red-500" : ""}`} />
                          <span className="text-xs">{comment.likes || 0}</span>
                        </button>
                      </div>
                      <p className="mt-2 text-gray-800">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">暂无评论，快来发表第一条评论吧</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user ? "写下你的评论..." : "请先登录后评论"}
              disabled={!user}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || !user}
              className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ========== 主组件 ==========
interface CommunityAnnouncementProps {
  diseaseId: string;
  diseaseName: string;
}

const CommunityAnnouncement: React.FC<CommunityAnnouncementProps> = ({ diseaseId, diseaseName }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [interactionData, setInteractionData] = useState({});
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [following, setFollowing] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  // 加载数据
  useEffect(() => {
    const messages = loadAllMessages();
    const interactions = loadInteractionData();
    setInteractionData(interactions);

    // 过滤出与本社区相关的公告
    const communityMessages = messages.filter((msg: any) => 
      msg.tags?.includes(diseaseName) || 
      msg.content?.includes(diseaseName) ||
      msg.title?.includes(diseaseName) ||
      msg.disease === diseaseName
    );
    setAnnouncements(communityMessages);
  }, [diseaseId, diseaseName]);

  // 获取用户互动状态
  const getUserInteraction = (messageId: string) => {
    if (!user) return { liked: false };
    return interactionData[`${user.id}_${messageId}`] || { liked: false };
  };

  // 处理发布
  const handlePublish = (newMessage: any) => {
    setAnnouncements(prev => [newMessage, ...prev]);
  };

  // 处理点赞
  const handleLike = (messageId: string) => {
    if (!user) {
      alert("请先登录后再点赞");
      return;
    }

    setAnnouncements(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const userInteraction = getUserInteraction(messageId);
        const liked = !userInteraction.liked;
        const likeChange = liked ? 1 : -1;
        
        const newInteractionData = {
          ...interactionData,
          [`${user.id}_${messageId}`]: { liked }
        };
        setInteractionData(newInteractionData);
        saveInteractionData(newInteractionData);

        return {
          ...msg,
          stats: {
            ...msg.stats,
            likes: Math.max(0, (msg.stats.likes || 0) + likeChange)
          }
        };
      }
      return msg;
    }));
  };

  // 处理评论
  const handleAddComment = (messageId: string, content: string) => {
    if (!user) {
      alert("请先登录后再评论");
      return;
    }

    setAnnouncements(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const newComment = {
          id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          user: user.username || user.email?.split('@')[0] || "用户",
          avatar: "👤",
          content,
          time: new Date().toLocaleDateString('zh-CN', { 
            month: 'numeric', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          likes: 0,
          liked: false
        };

        // 更新全局消息数据
        const allMessages = loadAllMessages();
        const updatedAllMessages = allMessages.map((m: any) => {
          if (m.id === messageId) {
            return {
              ...m,
              stats: {
                ...m.stats,
                comments: (m.stats.comments || 0) + 1
              },
              comments: [...(m.comments || []), newComment]
            };
          }
          return m;
        });
        saveAllMessages(updatedAllMessages);

        return {
          ...msg,
          stats: {
            ...msg.stats,
            comments: (msg.stats.comments || 0) + 1
          },
          comments: [...(msg.comments || []), newComment]
        };
      }
      return msg;
    }));
  };

  // 处理评论点赞
  const handleLikeComment = (messageId: string, commentId: string) => {
    setAnnouncements(prev => prev.map(msg => {
      if (msg.id === messageId && msg.comments) {
        const updatedComments = msg.comments.map((comment: any) => {
          if (comment.id === commentId) {
            const liked = !comment.liked;
            const likeChange = liked ? 1 : -1;
            return {
              ...comment,
              liked,
              likes: Math.max(0, (comment.likes || 0) + likeChange)
            };
          }
          return comment;
        });

        // 更新全局消息数据
        const allMessages = loadAllMessages();
        const updatedAllMessages = allMessages.map((m: any) => {
          if (m.id === messageId) {
            return { ...m, comments: updatedComments };
          }
          return m;
        });
        saveAllMessages(updatedAllMessages);

        return { ...msg, comments: updatedComments };
      }
      return msg;
    }));
  };

  // 处理删除
  const handleDelete = (messageId: string) => {
    setAnnouncements(prev => prev.filter(msg => msg.id !== messageId));
    
    // 更新全局消息数据
    const allMessages = loadAllMessages();
    const updatedAllMessages = allMessages.filter((m: any) => m.id !== messageId);
    saveAllMessages(updatedAllMessages);
    
    setMessageToDelete(null);
  };

  // 处理关注社区
  const handleFollow = () => {
    if (!user) {
      alert("请先登录后再关注社区");
      return;
    }
    setFollowing(!following);
    // 这里可以保存关注状态到 localStorage
  };

  // 获取分类统计
  const getTypeCount = (type: string) => {
    if (type === 'all') return announcements.length;
    return announcements.filter(msg => msg.type === type).length;
  };

  // 过滤显示的消息
  const displayedMessages = selectedType === 'all' 
    ? announcements 
    : announcements.filter(msg => msg.type === selectedType);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 发布表单 */}
      {showPublishForm && (
        <PublishForm
          diseaseName={diseaseName}
          user={user}
          onPublish={handlePublish}
          onClose={() => setShowPublishForm(false)}
        />
      )}

      {/* 评论面板 */}
      {showComments && (
        <CommentsPanel
          message={announcements.find(msg => msg.id === showComments)}
          onClose={() => setShowComments(null)}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
        />
      )}

      {/* 删除确认 */}
      {messageToDelete && (
        <DeleteConfirmDialog
          messageTitle={announcements.find(msg => msg.id === messageToDelete)?.title || ""}
          onConfirm={() => handleDelete(messageToDelete)}
          onCancel={() => setMessageToDelete(null)}
        />
      )}

      {/* 社区头部 */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-white/90" />
            <h2 className="text-lg font-medium text-white/90">{diseaseName}社区公告</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFollow}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors ${
                following 
                  ? 'bg-white text-green-600' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Star className={`w-4 h-4 ${following ? 'fill-green-600' : ''}`} />
              {following ? '已关注' : '关注社区'}
            </button>
            <button
              onClick={() => setShowPublishForm(true)}
              className="px-3 py-1.5 bg-white text-green-600 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              发布公告
            </button>
          </div>
        </div>
        <p className="text-white/80 text-sm">
          社区公告、活动通知、病友分享，欢迎大家积极参与
        </p>
      </div>

      {/* 分类标签 */}
      <div className="bg-white px-4 py-3 border-b overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部 ({getTypeCount('all')})
          </button>
          {Object.entries(MESSAGE_TYPES).map(([type, config]) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedType === type
                  ? config.color.replace('text-', 'bg-').replace('50', '600') + ' text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {config.label} ({getTypeCount(type)})
            </button>
          ))}
        </div>
      </div>

      {/* 公告列表 */}
      <div className="p-4 space-y-4">
        {displayedMessages.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">暂无公告</h3>
            <p className="text-gray-500 mb-4">
              {selectedType === 'all' ? '社区暂无公告' : '当前分类下暂无内容'}
            </p>
            <button
              onClick={() => setShowPublishForm(true)}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              发布第一条公告
            </button>
          </div>
        ) : (
          displayedMessages.map((message) => {
            const category = MESSAGE_TYPES[message.type] || MESSAGE_TYPES.announcement;
            const userInteraction = getUserInteraction(message.id);
            const canManage = user && (message.publisherId === user.id || user.role === 'admin');
            
            return (
              <div
                key={message.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                {/* 消息头部 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    <span className={`text-xs px-2 py-1 rounded ${category.color}`}>
                      {category.label}
                    </span>
                    {message.isPinned && (
                      <span className="flex items-center gap-1 text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded">
                        <Pin className="w-3 h-3" />
                        置顶
                      </span>
                    )}
                    {canManage && (
                      <span className="flex items-center gap-1 text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded">
                        <Edit className="w-3 h-3" />
                        我的发布
                      </span>
                    )}
                  </div>
                  
                  {canManage && (
                    <button
                      onClick={() => setMessageToDelete(message.id)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* 消息标题和内容 */}
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{message.title}</h3>
                <p className="text-gray-600 text-sm mb-4 whitespace-pre-wrap">
                  {message.content}
                </p>

                {/* 作者信息 */}
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                      {message.authorAvatar || "👤"}
                    </div>
                    <span className="font-medium">{message.author}</span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {message.date}
                  </span>
                </div>

                {/* 标签 */}
                {message.tags && message.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {message.tags.map((tag: string) => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 互动区域 */}
                <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleLike(message.id)}
                      className={`flex items-center gap-1 transition-colors ${
                        userInteraction.liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${userInteraction.liked ? "fill-red-500" : ""}`} />
                      <span>{message.stats?.likes || 0}</span>
                    </button>

                    <button
                      onClick={() => setShowComments(message.id)}
                      className="flex items-center gap-1 text-gray-500 hover:text-green-500"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{message.stats?.comments || 0}</span>
                    </button>

                    <span className="flex items-center gap-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{message.stats?.views || 0}</span>
                    </span>
                  </div>
                  
                  <CollectButton 
                    module="message"
                    itemId={message.id}
                    initialCollected={message.isCollected || false}
                    size="sm"
                    variant="ghost"
                    title={message.title}
                    content={message.summary || message.content}
                    tags={message.tags}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 快捷发布按钮（移动端） */}
      {announcements.length > 0 && (
        <div className="fixed bottom-20 right-4 z-40">
          <button
            onClick={() => setShowPublishForm(true)}
            className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg hover:from-green-600 hover:to-emerald-600 active:scale-95 transition-all"
            title="发布公告"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunityAnnouncement;