import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";
import { 
  Bell, Pin, Heart, MessageCircle, Eye, ChevronRight, Filter, 
  MessageSquare, Send, X, Plus, Trash2, Edit, AlertCircle 
} from "lucide-react";
import CollectButton from '../../components/collection/CollectButton';
import WechatImportPanel from '../../components/wechat/WechatImportPanel';
import MessageEditForm from '@/components/messages/MessageEditForm';
import { 
  canEditMessage, 
  validateEditData 
} from '@/services/messageEditService';

const MESSAGE_TYPES = {
  drug: { icon: "💊", label: "新药信息", color: "bg-blue-50 text-blue-600" },
  article: { icon: "📚", label: "专业文章", color: "bg-purple-50 text-purple-600" },
  announcement: { icon: "📢", label: "公告发布", color: "bg-green-50 text-green-600" },
  effect: { icon: "🌟", label: "特效分享", color: "bg-yellow-50 text-yellow-600" },
  warning: { icon: "⚠️", label: "前车之鉴", color: "bg-red-50 text-red-600" },
  wechat: { icon: "💬", label: "微信内容", color: "bg-cyan-50 text-cyan-600" }
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
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("加载消息数据失败:", error);
  }
  return null;
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

// ========== 初始消息数据 ==========
const getInitialMessages = () => {
  const savedMessages = loadAllMessages();
  if (savedMessages && savedMessages.length > 0) {
    return savedMessages;
  }

  return [
    {
      id: "1", type: "drug", title: "新型降糖药物XX正式上市",
      content: "经过三期临床试验，新型降糖药物XX已获得国家药监局批准上市。该药物在控制血糖的同时，对心血管具有保护作用，适用于2型糖尿病患者。",
      summary: "新型降糖药物XX获批上市，具有心血管保护作用",
      author: "国家药监局", date: "1月15日 09:00",
      isPinned: true, isRead: false, tags: ["新药", "糖尿病", "心血管"],
      stats: { likes: 45, comments: 12, views: 234 },
      isCollected: false,
      comments: [
        { id: "c1", user: "张医生", avatar: "👨‍⚕️", content: "这个药物对老年患者安全性如何？", time: "1月15日 10:30", likes: 5, liked: false },
        { id: "c2", user: "李药师", avatar: "👩‍🔬", content: "请问价格大概是多少？医保能报销吗？", time: "1月15日 11:15", likes: 3, liked: false },
        { id: "c3", user: "王主任", avatar: "👨‍⚕️", content: "我们医院已经引进，效果确实不错。", time: "1月15日 14:20", likes: 8, liked: false }
      ]
    },
    {
      id: "2", type: "article", title: "2024年高血压诊疗新进展",
      content: "本文综述了2024年国内外高血压诊疗的最新研究进展，包括新型降压药物的临床应用、血压监测技术的发展等。",
      author: "心内科张教授", date: "1月14日 14:30",
      isPinned: false, isRead: true,
      stats: { likes: 32, comments: 8, views: 156 },
      isCollected: true,
      comments: [
        { id: "c4", user: "刘医生", avatar: "👩‍⚕️", content: "文章中提到的动态血压监测很有参考价值。", time: "1月14日 16:45", likes: 2, liked: false }
      ]
    },
    {
      id: "3", type: "announcement", title: "平台维护通知",
      content: "为提升服务质量，平台将于1月20日 02:00-06:00进行系统维护，期间部分功能可能无法正常使用。",
      author: "系统管理员", date: "1月13日 16:45",
      isPinned: false, isRead: false,
      stats: { likes: 18, comments: 3, views: 89 },
      isCollected: false,
      comments: [
        { id: "c5", user: "用户A", avatar: "👤", content: "收到，会提前安排好工作。", time: "1月13日 17:30", likes: 1, liked: false }
      ]
    }
  ];
};

// ========== 发布表单组件 ==========
const MessagePublishForm: React.FC<{
  onPublish: (message: any) => void;
  onClose: () => void;
  user: any;
}> = ({ onPublish, onClose, user }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedType, setSelectedType] = useState<keyof typeof MESSAGE_TYPES>("drug");
  const [tags, setTags] = useState<string[]>([]);
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
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: selectedType,
      title: title.trim(),
      content: content.trim(),
      summary: content.trim().substring(0, 100) + (content.trim().length > 100 ? "..." : ""),
      author: user.username || user.email?.split('@')[0] || "用户",
      date: new Date().toLocaleDateString('zh-CN', { 
        month: 'numeric', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isPinned: false,
      isRead: false,
      tags: [...tags],
      stats: { likes: 0, comments: 0, views: 0 },
      isCollected: false,
      publisherId: user.id,
      source: "user",
      comments: []
    };

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
            <Plus className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">发布新消息</h2>
              <p className="text-sm text-gray-500">分享有价值的信息给医疗同仁</p>
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(MESSAGE_TYPES).map(([type, config]) => {
                  if (type === "wechat") return null;
                  
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type as keyof typeof MESSAGE_TYPES)}
                      className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                        selectedType === type
                          ? `${config.color} border-blue-500`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-2xl mb-2">{config.icon}</span>
                      <span className="font-medium text-sm">{config.label}</span>
                    </button>
                  );
                })}
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
                placeholder="请输入消息标题"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签（可选）
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="输入标签后按Enter添加"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  添加
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-900"
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
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            确定要删除消息：
          </p>
          <p className="font-medium text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg">
            "{messageTitle.length > 50 ? messageTitle.substring(0, 50) + "..." : messageTitle}"
          </p>
          <p className="text-sm text-red-600 mt-3">
            ⚠️ 删除后，该消息的所有点赞、评论和收藏数据将同时删除。
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
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-gray-900">评论 ({message.comments?.length || 0})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
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
                      {comment.avatar}
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || !user}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          {!user && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              请先登录后发表评论
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

// ========== 主组件 ==========
const MobileMessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [selectedType, setSelectedType] = useState("all");
  const [showWechatImport, setShowWechatImport] = useState(false);
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [showManageMenu, setShowManageMenu] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<any>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  
  const [allMessages, setAllMessages] = useState(() => {
    const messages = getInitialMessages();
    console.log("初始化消息数据:", messages.length, "条");
    return messages;
  });
  
  const [interactionData, setInteractionData] = useState(loadInteractionData());

  // 处理从收藏跳转过来的高亮消息
  useEffect(() => {
    // 检查是否有需要高亮显示的消息ID
    const highlightId = sessionStorage.getItem('highlightMessageId');
    const highlightType = sessionStorage.getItem('highlightMessageType');
    
    if (highlightId) {
      console.log('🎯 检测到高亮消息:', highlightId, '类型:', highlightType);
      
      // 先切换分类
      if (highlightType && highlightType !== 'all') {
        setSelectedType(highlightType);
      }
      
      // 延迟执行，等待DOM更新
      setTimeout(() => {
        // 尝试多种选择器找到目标消息
        const element = document.getElementById(`message-${highlightId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-2', 'ring-purple-500', 'shadow-lg');
          
          // 3秒后移除高亮效果
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-purple-500', 'shadow-lg');
          }, 3000);
          
          console.log('✅ 已高亮消息:', highlightId);
        } else {
          console.log('⚠️ 未找到消息元素，可能不在当前分类');
        }
        
        // 清理sessionStorage
        sessionStorage.removeItem('highlightMessageId');
        sessionStorage.removeItem('highlightMessageType');
      }, 500);
    }
  }, []); // 空依赖数组，只在组件挂载时执行

  useEffect(() => {
    saveAllMessages(allMessages);
  }, [allMessages]);

  useEffect(() => {
    saveInteractionData(interactionData);
  }, [interactionData]);

  const getUserInteraction = (messageId: string) => {
    if (!user) return { liked: false };
    return interactionData[`${user.id}_${messageId}`] || { liked: false };
  };

  const canManageMessage = (message: any) => {
    if (!user) return false;
    return message.publisherId === user.id || message.source === "wechat" || message.source === "user";
  };

  const handleEditMessage = (message: any) => {
    // 使用消息编辑服务进行权限检查
    if (canEditMessage(message, user)) {
      setEditingMessage(message);
      setIsEditFormOpen(true);
      setShowManageMenu(null); // 关闭管理菜单
      console.log("开始编辑消息:", message.id);
    } else {
      alert("您没有权限编辑此消息，或编辑时间已过期");
      setShowManageMenu(null);
    }
  };

  const handleSaveEdit = async (updatedData: any) => {
    if (!editingMessage || !user) {
      console.error("编辑数据或用户信息缺失");
      return;
    }

    try {
      console.log("📝 开始保存编辑:", { editingMessage, updatedData, user });

      // 准备更新数据
      const updateData = {
        title: updatedData.title || editingMessage.title,
        content: updatedData.content || editingMessage.content,
        type: updatedData.type || editingMessage.type,
        tags: updatedData.tags || editingMessage.tags || [],
        updatedAt: new Date().toISOString(),
        isEdited: true,
        editorId: user.id,
        editorName: user.username || user.email?.split('@')[0] || "用户"
      };

      console.log("🔍 准备验证的数据:", updateData);

      // 验证编辑数据 - 修复字段名
      const validationResult = validateEditData(updateData);
      console.log("✅ 验证结果:", validationResult);
      
      if (!validationResult.isValid) {
        alert(`编辑数据无效: ${validationResult.errors.join(', ')}`);
        return;
      }

      // 更新消息
      updateMessage(editingMessage.id, (msg: any) => {
        console.log("🔄 更新消息:", { 原始消息: msg, 更新数据: updateData });
        
        return {
          ...msg,
          title: updateData.title,
          content: updateData.content,
          type: updateData.type,
          tags: updateData.tags,
          updatedAt: updateData.updatedAt,
          isEdited: updateData.isEdited,
          editorId: updateData.editorId,
          editorName: updateData.editorName,
          // 确保summary也更新
          summary: updateData.content.substring(0, 100) + 
                  (updateData.content.length > 100 ? "..." : "")
        };
      });

      // 关闭编辑表单
      setIsEditFormOpen(false);
      setEditingMessage(null);
      
      console.log("🎉 消息编辑成功:", editingMessage.id);
      
      // 显示成功提示
      setTimeout(() => {
        alert("消息编辑成功！");
      }, 300);
      
    } catch (error) {
      console.error("❌ 编辑消息失败:", error);
      alert("编辑失败，请稍后重试");
    }
  };

  // 在 canManageMessage 函数后添加
  useEffect(() => {
    console.log("🔄 管理菜单状态更新:", {
      当前显示菜单: showManageMenu,
      消息总数: allMessages.length,
      用户消息: allMessages.filter(msg => canManageMessage(msg)).length
    });
  }, [showManageMenu, allMessages]);

  const updateMessage = (messageId: string, updater: (msg: any) => any) => {
    setAllMessages(prev => {
      const updated = prev.map(msg => {
        if (msg.id === messageId) {
          return updater(msg);
        }
        return msg;
      });
      return updated;
    });
  };

  const handlePublishMessage = (newMessage: any) => {
    setAllMessages(prev => [newMessage, ...prev]);
    setSelectedType(newMessage.type);
    console.log("新消息发布成功:", newMessage);
  };

  const handleDeleteMessage = (messageId: string) => {
    setAllMessages(prev => prev.filter(msg => msg.id !== messageId));
    setMessageToDelete(null);
    setShowManageMenu(null);
    console.log("消息删除成功:", messageId);
  };

  const handleLike = (messageId: string) => {
    if (!user) {
      alert("请先登录后再点赞");
      return;
    }

    updateMessage(messageId, (msg) => {
      const userInteraction = getUserInteraction(messageId);
      const liked = !userInteraction.liked;
      const likeChange = liked ? 1 : -1;
      
      setInteractionData(prevData => ({
        ...prevData,
        [`${user.id}_${messageId}`]: { liked }
      }));

      return {
        ...msg,
        stats: {
          ...msg.stats,
          likes: Math.max(0, (msg.stats.likes || 0) + likeChange)
        }
      };
    });
  };

  const handleAddComment = (messageId: string, content: string) => {
    if (!user) {
      alert("请先登录后再评论");
      return;
    }

    updateMessage(messageId, (msg) => {
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

      return {
        ...msg,
        stats: {
          ...msg.stats,
          comments: (msg.stats.comments || 0) + 1
        },
        comments: [...(msg.comments || []), newComment]
      };
    });
  };

  const handleLikeComment = (messageId: string, commentId: string) => {
    updateMessage(messageId, (msg) => {
      if (!msg.comments) return msg;

      return {
        ...msg,
        comments: msg.comments.map((comment: any) => {
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
        })
      };
    });
  };

  const handleWechatImport = (importedContent: { title: string; content: string; tags: string[] }) => {
    const newMessage = {
      id: `wechat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "wechat" as keyof typeof MESSAGE_TYPES,
      title: importedContent.title,
      content: importedContent.content,
      summary: importedContent.content.substring(0, 100) + (importedContent.content.length > 100 ? "..." : ""),
      author: "微信导入",
      date: new Date().toLocaleDateString('zh-CN', { 
        month: 'numeric', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isPinned: false,
      isRead: false,
      tags: [...importedContent.tags, "微信"],
      stats: { likes: 0, comments: 0, views: 1 },
      isCollected: false,
      publisherId: user.id,
      source: "wechat",
      comments: []
    };

    setAllMessages(prev => [newMessage, ...prev]);
    setSelectedType("wechat");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">请先登录</h3>
        <p className="text-gray-500 mb-4">登录后查看消息中心</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          前往登录
        </button>
      </div>
    );
  }

  const filteredMessages = allMessages.filter(msg => {
    if (selectedType === "all") return true;
    if (selectedType === "wechat") return msg.source === "wechat";
    if (selectedType === "my") return msg.publisherId === user.id;
    return msg.type === selectedType && msg.source !== "wechat";
  });

  const getMessageCount = (type: string) => {
    if (type === "all") return allMessages.length;
    if (type === "wechat") return allMessages.filter(msg => msg.source === "wechat").length;
    if (type === "my") return allMessages.filter(msg => msg.publisherId === user.id).length;
    return allMessages.filter(msg => msg.type === type && msg.source !== "wechat").length;
  };

  const wechatMessageCount = getMessageCount("wechat");
  const myMessageCount = getMessageCount("my");

  return (
    <div className="pb-20">
      {showWechatImport && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <WechatImportPanel 
            onImport={handleWechatImport}
            onClose={() => setShowWechatImport(false)}
          />
        </div>
      )}

      {showPublishForm && (
        <MessagePublishForm
          user={user}
          onPublish={handlePublishMessage}
          onClose={() => setShowPublishForm(false)}
        />
      )}

      {showComments && (
        <CommentsPanel
          message={allMessages.find(msg => msg.id === showComments)}
          onClose={() => setShowComments(null)}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
        />
      )}

      {messageToDelete && (
        <DeleteConfirmDialog
          messageTitle={allMessages.find(msg => msg.id === messageToDelete)?.title || ""}
          onConfirm={() => handleDeleteMessage(messageToDelete)}
          onCancel={() => setMessageToDelete(null)}
        />
      )}

      {isEditFormOpen && editingMessage && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <MessageEditForm
            message={editingMessage}
            onSave={handleSaveEdit}
            onCancel={() => {
              setIsEditFormOpen(false);
              setEditingMessage(null);
            }}
          />
        </div>
      )}

      <div className="px-4 pt-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">消息中心</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowPublishForm(true)}
              className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">发布</span>
            </button>
            
            <button 
              onClick={() => setShowWechatImport(true)}
              className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">导入</span>
              {wechatMessageCount > 0 && (
                <span className="text-xs bg-white/30 px-1.5 py-0.5 rounded-full">
                  {wechatMessageCount}
                </span>
              )}
            </button>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white px-4 py-3 border-y">
        <div className="space-y-2">
          <button
            className={`w-full px-4 py-3 rounded-lg flex items-center justify-between transition-colors hover:bg-gray-50 ${
              selectedType === "all"
                ? "bg-gray-100 border-l-4 border-l-gray-500 font-medium text-gray-800"
                : "bg-gray-50 text-gray-600"
            }`}
            onClick={() => setSelectedType("all")}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📨</span>
              <div className="text-left">
                <div className="font-medium">全部消息</div>
                <div className="text-xs text-gray-500">查看所有消息</div>
              </div>
            </div>
            <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
              {getMessageCount("all")}条
            </span>
          </button>

          <button
            className={`w-full px-4 py-3 rounded-lg flex items-center justify-between transition-colors hover:bg-gray-50 ${
              selectedType === "my"
                ? "bg-blue-50 border-l-4 border-l-blue-500 font-medium text-blue-800"
                : "bg-gray-50 text-gray-600"
            }`}
            onClick={() => setSelectedType("my")}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">👤</span>
              <div className="text-left">
                <div className="font-medium">我的消息</div>
                <div className="text-xs text-gray-500">查看我发布的消息</div>
              </div>
            </div>
            <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
              {myMessageCount}条
            </span>
          </button>
          
          {Object.entries(MESSAGE_TYPES).map(([type, config]) => (
            <button
              key={type}
              className={`w-full px-4 py-3 rounded-lg flex items-center justify-between transition-colors hover:bg-gray-50 ${
                selectedType === type
                  ? `${config.color} border-l-4 border-l-blue-500 font-medium`
                  : "bg-gray-50 text-gray-600"
              }`}
              onClick={() => setSelectedType(type)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{config.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{config.label}</div>
                  <div className="text-xs text-gray-500">
                    {type === "wechat" ? "查看导入的微信内容" : "点击查看详情"}
                  </div>
                </div>
              </div>
              <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                {getMessageCount(type)}条
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            {selectedType === "wechat" ? (
              <>
                <MessageSquare className="w-12 h-12 text-cyan-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">暂无微信内容</h3>
                <p className="text-gray-500 mb-4">您还没有导入任何微信内容</p>
                <button
                  onClick={() => setShowWechatImport(true)}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600"
                >
                  立即导入
                </button>
              </>
            ) : selectedType === "my" ? (
              <>
                <Plus className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">暂无发布的消息</h3>
                <p className="text-gray-500 mb-4">您还没有发布过任何消息</p>
                <button
                  onClick={() => setShowPublishForm(true)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600"
                >
                  立即发布
                </button>
              </>
            ) : (
              <>
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">暂无消息</h3>
                <p className="text-gray-500">当前分类下没有消息</p>
              </>
            )}
          </div>
        ) : (
          filteredMessages.map((message) => {
            const category = MESSAGE_TYPES[message.type] || MESSAGE_TYPES.article;
            const userInteraction = getUserInteraction(message.id);
            
            return (
              <div
                id={`message-${message.id}`}
                key={message.id}
                className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all ${
                  !message.isRead ? "border-l-4 border-l-blue-500" : "border-gray-200"
                } ${message.source === "wechat" ? "border-r-4 border-r-cyan-500" : ""}`}
                onClick={() => {
                  console.log("查看消息详情:", message.id);
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className={`text-xs px-2 py-1 rounded ${category.color}`}>
                      {category.label}
                    </span>
                    {message.isPinned && (
                      <span className="flex items-center gap-1 text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded">
                        <Pin className="w-3 h-3" />
                        置顶
                      </span>
                    )}
                    {message.source === "wechat" && (
                      <span className="flex items-center gap-1 text-cyan-600 text-xs bg-cyan-50 px-2 py-1 rounded">
                        <MessageSquare className="w-3 h-3" />
                        微信
                      </span>
                    )}
                    {message.source === "user" && (
                      <span className="flex items-center gap-1 text-green-600 text-xs bg-green-50 px-2 py-1 rounded">
                        <Edit className="w-3 h-3" />
                        我的
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                  {/* 管理菜单按钮 */}
{canManageMessage(message) && (
  <div className="relative">
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("🔼 点击管理按钮，消息ID:", message.id, "当前显示状态:", showManageMenu === message.id);
        const newState = showManageMenu === message.id ? null : message.id;
        setShowManageMenu(newState);
      }}
      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      title="管理选项"
      aria-label="打开管理菜单"
    >
      <span className="text-xl font-bold leading-none">⋯</span>
    </button>
  </div>
)}
                    
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

            {/* 管理菜单弹窗 */}
{showManageMenu === message.id && (
  <div 
    className="fixed inset-0 z-[9999]" 
    style={{ background: 'transparent' }}
    onClick={(e) => {
      console.log("🔽 点击背景关闭菜单");
      e.stopPropagation();
      setShowManageMenu(null);
    }}
  >
    <div 
      className="absolute"
      style={{
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        zIndex: 9998
      }}
    />
    
    <div 
      className="absolute bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-[140px] z-[10000] overflow-hidden"
      style={{
        right: '16px',
        top: '60px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="text-xs font-medium text-gray-500">消息管理</div>
      </div>
      
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("📝 点击编辑按钮，消息ID:", message.id);
          handleEditMessage(message);
        }}
        className="w-full px-4 py-3 text-left text-blue-600 hover:bg-blue-50 flex items-center gap-3 transition-colors"
      >
        <Edit className="w-4 h-4 flex-shrink-0" />
        <div className="flex-1">
          <div className="font-medium">编辑消息</div>
          <div className="text-xs text-blue-400">
            {canEditMessage(message, user) 
              ? "修改标题和内容" 
              : "编辑时间已过或无权编辑"}
          </div>
        </div>
      </button>
      
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("🗑️ 点击删除按钮，消息ID:", message.id);
          setMessageToDelete(message.id);
          setShowManageMenu(null);
        }}
        className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors border-t border-gray-100"
      >
        <Trash2 className="w-4 h-4 flex-shrink-0" />
        <div className="flex-1">
          <div className="font-medium">删除消息</div>
          <div className="text-xs text-red-400">永久删除此消息</div>
        </div>
      </button>
    </div>
  </div>
)}

                <h3 className="font-bold text-gray-900 mb-2 text-base">{message.title}</h3>
                
                {message.summary && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {message.summary}
                  </p>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                  <span className="font-medium">{message.author}</span>
                  <span className="text-xs">{message.date}</span>
                </div>

                {message.tags && message.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {message.tags.map(tag => (
                      <span key={tag} className={`px-2 py-1 text-xs rounded ${
                        tag === "微信" 
                          ? "bg-cyan-100 text-cyan-700" 
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
                  <div className="flex gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(message.id);
                      }}
                      className={`flex items-center gap-1 transition-colors ${
                        userInteraction.liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${userInteraction.liked ? "fill-red-500" : ""}`} />
                      <span>{message.stats.likes || 0}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowComments(message.id);
                      }}
                      className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{message.stats.comments || 0}</span>
                    </button>

                    <span className="flex items-center gap-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{message.stats.views || 0}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CollectButton 
                      itemId={message.id}
                      itemType="message"
                      itemData={{
                        title: message.title,
                        description: message.summary || message.content,
                        date: message.date,
                        tags: message.tags,
                        type: message.type
                      }}
                      initialCollected={message.isCollected || false}
                      size="sm"
                    />
                    
                    {!message.isRead && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded font-medium">
                        未读
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      

      <div className="p-4 text-center text-gray-400 text-sm">
        <p>向上滑动加载更多消息</p>
        {wechatMessageCount > 0 && (
          <p className="text-xs mt-1 text-cyan-600">
            您有 {wechatMessageCount} 条微信内容
          </p>
        )}
        {myMessageCount > 0 && (
          <p className="text-xs mt-1 text-blue-600">
            您已发布 {myMessageCount} 条消息
          </p>
        )}
      </div>
    </div>
  );
};

export default MobileMessagesPage;
