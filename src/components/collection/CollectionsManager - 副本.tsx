// src/components/collection/CollectionsManager.tsx
/**
 * 通用收藏管理器组件
 * 适用于桌面端和移动端，通过mode参数适配不同终端
 */

import React, { useState, useEffect } from 'react';
import { 
  getAllCollections, 
  searchCollections, 
  removeCollection,
  batchRemoveCollections,
  getCollectionStats,
  getModuleConfig
} from '../../services/collectionService';
import type { 
  UnifiedCollectionItem, 
  CollectionModule,
  CollectionStats,
  CollectionModuleConfig 
} from '../../types/collection';

// 组件模式：desktop（桌面端）或 mobile（移动端）
type CollectionsManagerMode = 'desktop' | 'mobile';

interface CollectionsManagerProps {
  mode?: CollectionsManagerMode;      // 显示模式
  onClose?: () => void;               // 关闭回调（移动端需要）
  initialModule?: CollectionModule;   // 初始筛选模块
  compact?: boolean;                  // 紧凑模式
}

const CollectionsManager: React.FC<CollectionsManagerProps> = ({
  mode = 'desktop',
  onClose,
  initialModule,
  compact = false
}) => {
  // 状态管理
  const [collections, setCollections] = useState<UnifiedCollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedModule, setSelectedModule] = useState<CollectionModule | 'all'>(
    initialModule || 'all'
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [moduleConfig, setModuleConfig] = useState<Record<string, CollectionModuleConfig>>({});

  // 初始化
  useEffect(() => {
    loadModuleConfig();
    loadCollections();
    loadStats();
    
    // 监听收藏变化事件
    const handleCollectionChange = () => {
      loadCollections();
      loadStats();
    };
    
    window.addEventListener('medical-collections-changed', handleCollectionChange);
    return () => {
      window.removeEventListener('medical-collections-changed', handleCollectionChange);
    };
  }, []);

  // 加载模块配置
  const loadModuleConfig = () => {
    try {
      const config = getModuleConfig();
      setModuleConfig(config);
    } catch (error) {
      console.error('加载模块配置失败:', error);
    }
  };

  // 加载收藏数据
  const loadCollections = () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchKeyword) params.keyword = searchKeyword;
      if (selectedModule !== 'all') params.module = selectedModule;
      
      const data = searchCollections(params);
      setCollections(data);
    } catch (error) {
      console.error('加载收藏失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载统计信息
  const loadStats = () => {
    try {
      const statsData = getCollectionStats();
      setStats(statsData);
    } catch (error) {
      console.error('加载统计信息失败:', error);
    }
  };

  // 搜索和筛选变化时重新加载
  useEffect(() => {
    loadCollections();
  }, [searchKeyword, selectedModule]);

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  // 处理删除单个收藏
  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个收藏吗？')) {
      removeCollection(id);
      // 事件监听器会自动触发重新加载
    }
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    
    if (window.confirm(`确定要删除选中的${selectedIds.length}个收藏吗？`)) {
      batchRemoveCollections(selectedIds);
      setSelectedIds([]);
      setIsBatchMode(false);
      // 事件监听器会自动触发重新加载
    }
  };

  // 进入/退出批量模式
  const toggleBatchMode = () => {
    if (isBatchMode) {
      setSelectedIds([]);
    }
    setIsBatchMode(!isBatchMode);
  };

  // 选择/取消选择单个项目
  const toggleSelectItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  // 模块筛选选项
  const moduleOptions = [
    { value: 'all', label: '全部内容' },
    { value: 'message', label: '消息通知' },
    { value: 'medical_case', label: '医案分享' },
    { value: 'qa', label: '寻医问药' },
    { value: 'community', label: '专病社区' },
    { value: 'wechat', label: '微信文章' },
  ];

  // 获取模块显示信息
  const getModuleInfo = (module: string) => {
    return moduleConfig[module] || { label: module, icon: '📌', color: '#ccc' };
  };

  // 渲染加载状态
  if (loading && collections.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  // 桌面端渲染
  if (mode === 'desktop') {
    return (
      <div className="collections-manager-desktop">
        {/* 头部 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">我的收藏</h2>
            {stats && (
              <div className="text-sm text-gray-600">
                共 {stats.total} 个收藏，最近7天新增 {stats.recentCount} 个
              </div>
            )}
          </div>

          {/* 搜索和筛选栏 */}
          <div className="bg-white p-4 rounded-lg border mb-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* 搜索框 */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索收藏内容..."
                    value={searchKeyword}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                </div>
              </div>

              {/* 模块筛选 */}
              <div className="flex gap-2 overflow-x-auto">
                {moduleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedModule(option.value as any)}
                    className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                      selectedModule === option.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <button
                  onClick={toggleBatchMode}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    isBatchMode
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isBatchMode ? '取消批量' : '批量操作'}
                </button>
                {isBatchMode && selectedIds.length > 0 && (
                  <button
                    onClick={handleBatchDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                  >
                    删除选中 ({selectedIds.length})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 收藏列表 */}
        <div className="bg-white rounded-lg border">
          {collections.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">
                {searchKeyword || selectedModule !== 'all' 
                  ? '没有找到相关的收藏内容' 
                  : '还没有任何收藏内容'}
              </div>
              <div className="text-sm text-gray-500">
                {searchKeyword || selectedModule !== 'all'
                  ? '尝试其他搜索条件'
                  : '去发现精彩内容并收藏吧'}
              </div>
            </div>
          ) : (
            <div className="divide-y">
              {collections.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const moduleInfo = getModuleInfo(item.module);
                
                return (
                  <div
                    key={item.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      if (isBatchMode) {
                        toggleSelectItem(item.id);
                      }
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* 选择框（批量模式显示） */}
                      {isBatchMode && (
                        <div className="pt-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleSelectItem(item.id);
                            }}
                            className="h-5 w-5"
                          />
                        </div>
                      )}

                      {/* 模块图标 */}
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${moduleInfo.color}20` }}
                      >
                        {moduleInfo.icon}
                      </div>

                      {/* 内容 */}
                      <div className="flex-1">
                        {/* 标题行 */}
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: `${moduleInfo.color}20`,
                                color: moduleInfo.color
                              }}
                            >
                              {moduleInfo.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* 摘要 */}
                        {item.excerpt && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {item.excerpt}
                          </p>
                        )}

                        {/* 操作按钮（非批量模式显示） */}
                        {!isBatchMode && (
                          <div className="flex items-center gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: 查看详情
                                alert('查看详情功能开发中...');
                              }}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              查看详情
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: 转发功能
                                alert('转发功能开发中...');
                              }}
                              className="text-sm text-green-600 hover:text-green-700"
                            >
                              转发
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              删除
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 统计信息（紧凑模式不显示） */}
        {!compact && stats && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">总收藏</div>
            </div>
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-gray-600">活跃收藏</div>
            </div>
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.recentCount}</div>
              <div className="text-sm text-gray-600">7天新增</div>
            </div>
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.archived}</div>
              <div className="text-sm text-gray-600">已归档</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 移动端渲染
  return (
    <div className="collections-manager-mobile min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white sticky top-0 z-10 border-b">
        <div className="flex items-center p-4">
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 -ml-2"
            >
              <span className="text-2xl">‹</span>
            </button>
          )}
          <h1 className="flex-1 text-center text-lg font-medium">我的收藏</h1>
          <div className="w-10"></div>
        </div>

        {/* 搜索和筛选 */}
        <div className="px-4 pb-4">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="搜索收藏内容..."
              value={searchKeyword}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-4 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {moduleOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedModule(option.value as any)}
                className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                  selectedModule === option.value
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 批量操作栏 */}
      {isBatchMode && selectedIds.length > 0 && (
        <div className="bg-white border-b sticky top-[140px] z-10">
          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-gray-600">
              已选择 {selectedIds.length} 项
            </div>
            <button
              onClick={handleBatchDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
            >
              删除选中
            </button>
          </div>
        </div>
      )}

      {/* 收藏列表 */}
      <div className="p-4">
        {collections.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">暂无收藏内容</div>
            <div className="text-sm text-gray-500">
              {searchKeyword || selectedModule !== 'all' ? '尝试其他搜索条件' : '快去发现精彩内容吧'}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {collections.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const moduleInfo = getModuleInfo(item.module);
              
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border p-4 ${
                    isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    if (isBatchMode) {
                      toggleSelectItem(item.id);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* 选择框（批量模式显示） */}
                    {isBatchMode && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelectItem(item.id);
                        }}
                        className="mt-1 h-5 w-5"
                      />
                    )}

                    {/* 模块图标 */}
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${moduleInfo.color}20` }}
                    >
                      {moduleInfo.icon}
                    </div>

                    <div className="flex-1">
                      {/* 标题和模块标签 */}
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 line-clamp-2">
                          {item.title}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          moduleInfo.color ? '' : 'bg-gray-100 text-gray-800'
                        }`} style={moduleInfo.color ? {
                          backgroundColor: `${moduleInfo.color}20`,
                          color: moduleInfo.color
                        } : {}}>
                          {moduleInfo.label}
                        </span>
                      </div>

                      {/* 内容摘要 */}
                      {item.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {item.excerpt}
                        </p>
                      )}

                      {/* 底部信息 */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        
                        {/* 操作按钮（非批量模式显示） */}
                        {!isBatchMode && (
                          <div className="flex items-center gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              删除
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 批量操作提示 */}
        {collections.length > 0 && !isBatchMode && (
          <div className="mt-6 text-center">
            <button
              onClick={toggleBatchMode}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              批量操作
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsManager;