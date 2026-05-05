import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Users,
  ChevronLeft,
  Heart,
  MessageCircle,
  Send,
  X,
  Plus,
  Tag,
  Trash2,
  AlertCircle,
  Search,
  User,
  Stethoscope,
  Heart as HeartIcon,
  UserPlus
} from 'lucide-react';
import CollectButton from '../../components/collection/CollectButton';

// ========== 身份类型定义 ==========
const IDENTITY_TYPES = {
  specialist: { label: '专科医生', icon: Stethoscope, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  general: { label: '非专科医生', icon: User, color: 'text-green-600', bgColor: 'bg-green-50' },
  patient: { label: '病友', icon: HeartIcon, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  other: { label: '非病友', icon: UserPlus, color: 'text-gray-600', bgColor: 'bg-gray-50' }
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

// ========== 数据持久化 ==========
const loadAllForumPosts = () => {
  try {
    const saved = localStorage.getItem('medical_forum_posts');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveAllForumPosts = (posts: any[]) => {
  try {
    localStorage.setItem('medical_forum_posts', JSON.stringify(posts));
  } catch (error) {
    console.error("保存失败:", error);
  }
};

// ========== 发布帖子弹窗 ==========
const PublishModal: React.FC<{
  diseaseName: string;
  onPublish: (post: any) => void;
  onClose: () => void;
}> = ({ diseaseName, onPublish, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [identity, setIdentity] = useState<keyof typeof IDENTITY_TYPES>('patient');
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

    const newPost = {
      id: `forum_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      title: title.trim(),
      content: content.trim(),
      author: user.username || '用户',
      authorId: user.id,
      identity: identity,
      date: new Date().toLocaleDateString('zh-CN', { 
        month: 'numeric', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      tags: tags,
      stats: { likes: 0, comments: 0 },
      comments: [],
      disease: diseaseName
    };

    const allPosts = loadAllForumPosts();
    saveAllForumPosts([newPost, ...allPosts]);
    onPublish(newPost);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl">
        <div className="p-4 border-b flex justify-between">
          <h2 className="text-lg font-semibold">发布帖子</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="帖子标题"
            className="w-full p-3 border rounded-lg"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="帖子内容"
            rows={4}
            className="w-full p-3 border rounded-lg"
            required
          />

          {/* 身份选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">您的身份</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(IDENTITY_TYPES).map(([key, value]) => {
                const Icon = value.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIdentity(key as keyof typeof IDENTITY_TYPES)}
                    className={`p-3 rounded-lg border flex items-center gap-2 ${
                      identity === key
                        ? `${value.bgColor} border-blue-500`
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${value.color}`} />
                    <span className="text-sm">{value.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

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
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
  post: any;
  onClose: () => void;
  onAddComment: (postId: string, content: string, identity: string) => void;
}> = ({ post, onClose, onAddComment }) => {
  const [newComment, setNewComment] = useState("");
  const [commentIdentity, setCommentIdentity] = useState<keyof typeof IDENTITY_TYPES>('patient');
  const user = getCurrentUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(post.id, newComment.trim(), commentIdentity);
      setNewComment("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-2xl">
        <div className="p-4 border-b flex justify-between">
          <h3 className="font-semibold">评论 ({post.comments?.length || 0})</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        {/* 评论列表 */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {post.comments?.map((c: any) => {
            const identity = IDENTITY_TYPES[c.identity as keyof typeof IDENTITY_TYPES] || IDENTITY_TYPES.other;
            const Icon = identity.icon;
            return (
              <div key={c.id} className="mb-4 pb-2 border-b">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-6 h-6 rounded-full ${identity.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-3 h-3 ${identity.color}`} />
                  </div>
                  <span className="font-medium text-sm">{c.user}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${identity.bgColor} ${identity.color}`}>
                    {identity.label}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">{c.time}</span>
                </div>
                <p className="text-sm text-gray-700 ml-8">{c.content}</p>
              </div>
            );
          })}
        </div>

        {/* 评论输入 */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="mb-3">
            <select
              value={commentIdentity}
              onChange={(e) => setCommentIdentity(e.target.value as keyof typeof IDENTITY_TYPES)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              {Object.entries(IDENTITY_TYPES).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="写评论..."
              className="flex-1 p-2 border rounded-full"
            />
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-full">
              <Send className="w-4 h-4" />
            </button>
          </div>
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
const MobileDiseaseForumPage: React.FC = () => {
  const navigate = useNavigate();
  const { diseaseId } = useParams();
  const location = useLocation();
  const [showPublish, setShowPublish] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');

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

  useEffect(() => {
    const allPosts = loadAllForumPosts();
    const filtered = allPosts.filter((p: any) => p.disease === diseaseName);
    setPosts(filtered);
  }, [diseaseName]);

  const handlePublish = (newPost: any) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const allPosts = loadAllForumPosts();
        const updated = allPosts.map((p: any) => 
          p.id === postId ? { ...p, stats: { ...p.stats, likes: (p.stats.likes || 0) + 1 } } : p
        );
        saveAllForumPosts(updated);
        return { ...post, stats: { ...post.stats, likes: (post.stats.likes || 0) + 1 } };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string, content: string, identity: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: `c_${Date.now()}`,
          user: user.username,
          identity,
          content,
          time: new Date().toLocaleDateString('zh-CN', { 
            month: 'numeric', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };
        const allPosts = loadAllForumPosts();
        const updated = allPosts.map((p: any) => 
          p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p
        );
        saveAllForumPosts(updated);
        return { ...post, comments: [...(post.comments || []), newComment] };
      }
      return post;
    }));
  };

  const handleDelete = (post: any) => {
    const allPosts = loadAllForumPosts();
    saveAllForumPosts(allPosts.filter((p: any) => p.id !== post.id));
    setPosts(prev => prev.filter(p => p.id !== post.id));
    setDeleteTarget(null);
  };

  const filtered = posts.filter(post =>
    post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    post.content.toLowerCase().includes(searchKeyword.toLowerCase())
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
          post={posts.find(p => p.id === showComments)}
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
          <h1 className="flex-1 text-center font-semibold">{diseaseName}病友之家</h1>
        </div>
      </div>

      {/* 搜索 */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜索帖子..."
            className="w-full pl-10 pr-4 py-3 border rounded-xl"
          />
        </div>
      </div>

      {/* 帖子列表 */}
      <div className="px-4 pb-20 space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">
              {searchKeyword ? '没有找到相关帖子' : '暂无帖子'}
            </p>
            <button
              onClick={() => setShowPublish(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg"
            >
              发布第一条帖子
            </button>
          </div>
        ) : (
          filtered.map(post => {
            const canDelete = user && post.authorId === user.id;

            return (
              <div key={post.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  {canDelete && (
                    <button onClick={() => setDeleteTarget(post)}>
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  )}
                </div>

                <p className="text-gray-600 mb-3">{post.content}</p>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <span>{post.author}</span>
                  <span>·</span>
                  <span>{post.date}</span>
                </div>

                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-xs">
                        <Tag className="w-3 h-3 inline mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm border-t pt-3">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1 hover:text-red-500"
                  >
                    <Heart className="w-4 h-4" />
                    {post.stats?.likes || 0}
                  </button>

                  <button
                    onClick={() => setShowComments(post.id)}
                    className="flex items-center gap-1 hover:text-purple-600"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {post.comments?.length || 0}
                  </button>

                  <CollectButton
                    itemId={post.id}
                    itemType="forum"
                    itemData={{
                      title: post.title,
                      description: post.content,
                      date: post.date,
                      tags: post.tags,
                      disease: post.disease || diseaseName,
                      diseaseId: diseaseId,
                      author: post.author,
                      identity: post.identity
                    }}
                    initialCollected={false}
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
        className="fixed bottom-20 right-4 p-4 bg-purple-600 text-white rounded-full shadow-lg"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MobileDiseaseForumPage;