// src/components/collection/CollectionsManager.tsx
import React, { useState, useEffect } from 'react';
import { 
  X, Heart, MessageCircle, Calendar, User, FileText, Star, 
  Bell, Users, BookOpen, TrendingUp 
} from 'lucide-react';

interface CollectionItem {
  id: string;
  itemId: string;
  itemType: string;  // case, consult, message, announcement, forum, lecture, suggestion
  itemData: {
    title: string;
    description?: string;
    date?: string;
    imageUrl?: string;
    patientName?: string;
    diagnosis?: string;
    symptoms?: string[];
    type?: string; // 消息类型：drug/article/announcement等
    disease?: string;  // 专病名称
    diseaseId?: string;  // 专病ID
    author?: string;
    tags?: string[];
  };
  collectedAt: string;
}

interface CollectionsManagerProps {
  mode?: 'mobile' | 'desktop';
  user: any;
  onClose?: () => void;
}

const CollectionsManager: React.FC<CollectionsManagerProps> = ({
  mode = 'mobile',
  user,
  onClose
}) => {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'case' | 'consult' | 'message' | 'announcement' | 'forum' | 'lecture' | 'suggestion'>('all');
  const [loading, setLoading] = useState(true);

  // 加载收藏数据
  useEffect(() => {
    loadCollections();
    
    // 监听收藏变化
    const handleCollectionChange = () => {
      loadCollections();
    };
    
    window.addEventListener('collection-change', handleCollectionChange);
    return () => {
      window.removeEventListener('collection-change', handleCollectionChange);
    };
  }, []);

  const loadCollections = () => {
    try {
      const saved = localStorage.getItem('medical_collections');
      if (saved) {
        const items = JSON.parse(saved);
        // 按收藏时间倒序排列
        items.sort((a: CollectionItem, b: CollectionItem) => 
          new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime()
        );
        setCollections(items);
      }
    } catch (error) {
      console.error('加载收藏失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id: string) => {
    const updated = collections.filter(item => item.id !== id);
    localStorage.setItem('medical_collections', JSON.stringify(updated));
    setCollections(updated);
    
    // 触发收藏变更事件
    window.dispatchEvent(new CustomEvent('collection-change'));
  };

  const filteredCollections = collections.filter(item => 
    filter === 'all' ? true : item.itemType === filter
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'case': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'consult': return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'message': return <Star className="w-5 h-5 text-purple-500" />;
      case 'announcement': return <Bell className="w-5 h-5 text-orange-500" />;
      case 'forum': return <Users className="w-5 h-5 text-indigo-500" />;
      case 'lecture': return <BookOpen className="w-5 h-5 text-red-500" />;
      case 'suggestion': return <TrendingUp className="w-5 h-5 text-yellow-500" />;
      default: return <Star className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getTypeText = (type: string) => {
    switch(type) {
      case 'case': return '医案';
      case 'consult': return '咨询';
      case 'message': return '消息';
      case 'announcement': return '社区公告';
      case 'forum': return '病友之家';
      case 'lecture': return '专病讲座';
      case 'suggestion': return '发展建议';
      default: return '收藏';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'case': return 'bg-blue-50 text-blue-600';
      case 'consult': return 'bg-green-50 text-green-600';
      case 'message': return 'bg-purple-50 text-purple-600';
      case 'announcement': return 'bg-orange-50 text-orange-600';
      case 'forum': return 'bg-indigo-50 text-indigo-600';
      case 'lecture': return 'bg-red-50 text-red-600';
      case 'suggestion': return 'bg-yellow-50 text-yellow-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  // 获取消息类型的中文名称
  const getMessageTypeLabel = (type?: string) => {
    const typeMap: Record<string, string> = {
      'drug': '新药信息',
      'article': '专业文章',
      'announcement': '公告发布',
      'effect': '特效分享',
      'warning': '前车之鉴',
      'wechat': '微信内容'
    };
    return type ? typeMap[type] || '消息' : '消息';
  };

  // 处理跳转
  const handleNavigate = (item: CollectionItem) => {
    let path = '';
    console.log('点击查看详情:', item.itemType, item.itemData);
    
    if (item.itemType === 'case') {
      path = `/mobile/cases/${item.itemId}`;
    } else if (item.itemType === 'consult') {
      path = `/mobile/consult/${item.itemId}`;
    } else if (item.itemType === 'message') {
      // 消息没有独立详情页，跳转到消息列表的对应分类
      path = `/mobile/messages`;
      sessionStorage.setItem('highlightMessageId', item.itemId);
      sessionStorage.setItem('highlightMessageType', item.itemData?.type || 'all');
    } else if (item.itemType === 'announcement') {
      // 社区公告
      if (item.itemData?.diseaseId) {
        path = `/mobile/community/${item.itemData.diseaseId}/announcement`;
        sessionStorage.setItem('highlightAnnouncementId', item.itemId);
        sessionStorage.setItem('highlightDiseaseName', item.itemData.disease || '');
      }
    } else if (item.itemType === 'forum') {
      // 病友之家
      if (item.itemData?.diseaseId) {
        path = `/mobile/community/${item.itemData.diseaseId}/forum`;
        sessionStorage.setItem('highlightForumId', item.itemId);
        sessionStorage.setItem('highlightDiseaseName', item.itemData.disease || '');
      }
    } else if (item.itemType === 'lecture') {
      // 专病讲座
      if (item.itemData?.diseaseId) {
        path = `/mobile/community/${item.itemData.diseaseId}/lecture`;
        sessionStorage.setItem('highlightLectureId', item.itemId);
        sessionStorage.setItem('highlightDiseaseName', item.itemData.disease || '');
      }
    } else if (item.itemType === 'suggestion') {
      // 社区发展
      if (item.itemData?.diseaseId) {
        path = `/mobile/community/${item.itemData.diseaseId}/development`;
        sessionStorage.setItem('highlightSuggestionId', item.itemId);
        sessionStorage.setItem('highlightDiseaseName', item.itemData.disease || '');
      }
    }
    
    if (path) {
      console.log('跳转到:', path);
      window.location.hash = path;
    } else {
      console.error('无法跳转: 缺少必要参数', item);
      alert('无法跳转到原文，可能缺少必要参数');
    }
  };

  if (mode === 'mobile') {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        {/* 头部 */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">我的收藏</h2>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* 分类筛选 */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部 ({collections.length})
            </button>
            <button
              onClick={() => setFilter('case')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === 'case'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              医案 ({collections.filter(c => c.itemType === 'case').length})
            </button>
            <button
              onClick={() => setFilter('consult')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === 'consult'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              咨询 ({collections.filter(c => c.itemType === 'consult').length})
            </button>
            <button
              onClick={() => setFilter('message')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === 'message'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              消息 ({collections.filter(c => c.itemType === 'message').length})
            </button>
            <button
              onClick={() => setFilter('announcement')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === 'announcement'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              公告 ({collections.filter(c => c.itemType === 'announcement').length})
            </button>
            <button
              onClick={() => setFilter('forum')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === 'forum'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              论坛 ({collections.filter(c => c.itemType === 'forum').length})
            </button>
            <button
              onClick={() => setFilter('lecture')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === 'lecture'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              讲座 ({collections.filter(c => c.itemType === 'lecture').length})
            </button>
            <button
              onClick={() => setFilter('suggestion')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === 'suggestion'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              建议 ({collections.filter(c => c.itemType === 'suggestion').length})
            </button>
          </div>
        </div>

        {/* 收藏列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredCollections.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">暂无收藏</p>
              <p className="text-sm text-gray-400">
                {filter === 'all' ? '点击❤️收藏你感兴趣的内容' : `还没有${getTypeText(filter)}收藏`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCollections.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* 头部：类型图标和标题 */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.itemType)}
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(item.itemType)}`}>
                        {item.itemType === 'message' 
                          ? getMessageTypeLabel(item.itemData?.type)
                          : getTypeText(item.itemType)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-gray-400 hover:text-red-500"
                      title="取消收藏"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 收藏内容 - 根据类型显示不同内容 */}
                  {item.itemType === 'case' ? (
                    // 医案收藏
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {item.itemData?.title || '未命名医案'}
                      </h3>
                      {item.itemData?.patientName && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                          <User className="w-3 h-3" />
                          <span>{item.itemData.patientName}</span>
                        </div>
                      )}
                      {item.itemData?.diagnosis && (
                        <div className="text-sm text-gray-700 mb-1">
                          诊断：{item.itemData.diagnosis}
                        </div>
                      )}
                      {item.itemData?.symptoms && item.itemData.symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.itemData.symptoms.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full text-xs">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : item.itemType === 'consult' ? (
                    // 咨询收藏
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {item.itemData?.title || '未命名咨询'}
                      </h3>
                      {item.itemData?.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {item.itemData.description}
                        </p>
                      )}
                    </div>
                  ) : item.itemType === 'message' ? (
                    // 消息收藏
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {item.itemData?.title || '未命名消息'}
                      </h3>
                      {item.itemData?.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {item.itemData.description}
                        </p>
                      )}
                      {item.itemData?.tags && item.itemData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.itemData.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : ['announcement', 'forum', 'lecture', 'suggestion'].includes(item.itemType) ? (
                    // 专病社区收藏
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {item.itemData?.title || '未命名'}
                      </h3>
                      {item.itemData?.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {item.itemData.description}
                        </p>
                      )}
                      {item.itemData?.disease && (
                        <div className="text-xs text-gray-500 mb-1">
                          所属社区：{item.itemData.disease}
                        </div>
                      )}
                      {item.itemData?.tags && item.itemData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.itemData.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // 默认
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {item.itemData?.title || '未知项目'}
                      </h3>
                    </div>
                  )}

                  {/* 底部：收藏时间和查看按钮 */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(item.collectedAt)}</span>
                    </div>
                    <button
                      onClick={() => handleNavigate(item)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      查看详情 →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 桌面端模式
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">我的收藏</h2>
      
      {/* 桌面端分类筛选 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          全部 ({collections.length})
        </button>
        <button
          onClick={() => setFilter('case')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'case'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          医案 ({collections.filter(c => c.itemType === 'case').length})
        </button>
        <button
          onClick={() => setFilter('consult')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'consult'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          咨询 ({collections.filter(c => c.itemType === 'consult').length})
        </button>
        <button
          onClick={() => setFilter('message')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'message'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          消息 ({collections.filter(c => c.itemType === 'message').length})
        </button>
        <button
          onClick={() => setFilter('announcement')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'announcement'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          公告 ({collections.filter(c => c.itemType === 'announcement').length})
        </button>
        <button
          onClick={() => setFilter('forum')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'forum'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          论坛 ({collections.filter(c => c.itemType === 'forum').length})
        </button>
        <button
          onClick={() => setFilter('lecture')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'lecture'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          讲座 ({collections.filter(c => c.itemType === 'lecture').length})
        </button>
        <button
          onClick={() => setFilter('suggestion')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'suggestion'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          建议 ({collections.filter(c => c.itemType === 'suggestion').length})
        </button>
      </div>

      {/* 桌面端收藏列表 - 网格布局 */}
      <div className="grid grid-cols-2 gap-4">
        {filteredCollections.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getTypeIcon(item.itemType)}
                <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(item.itemType)}`}>
                  {item.itemType === 'message' 
                    ? getMessageTypeLabel(item.itemData?.type)
                    : getTypeText(item.itemType)}
                </span>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-medium text-gray-900 mb-2">
              {item.itemData?.title || '未命名'}
            </h3>

            {item.itemType === 'case' && item.itemData?.diagnosis && (
              <p className="text-sm text-gray-600 mb-2">
                诊断：{item.itemData.diagnosis}
              </p>
            )}

            {(item.itemType === 'consult' || item.itemType === 'message') && item.itemData?.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {item.itemData.description}
              </p>
            )}

            {['announcement', 'forum', 'lecture', 'suggestion'].includes(item.itemType) && item.itemData?.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {item.itemData.description}
              </p>
            )}

            <div className="flex items-center justify-between mt-3 pt-2 border-t">
              <span className="text-xs text-gray-400">
                {new Date(item.collectedAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleNavigate(item)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                查看详情 →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionsManager;