// src/services/collectionService.ts
// 统一收藏管理服务 - 支持多模块收藏

export interface UnifiedCollectionItem {
  id: string;                    // 收藏项唯一ID
  module: string;                // 所属模块：message|medical_case|qa|community|wechat
  moduleItemId: string;          // 模块内项目ID
  itemType: string;              // 项目类型
  title: string;                 // 标题
  content: string;               // 内容（摘要）
  thumbnail?: string;            // 缩略图
  collectedAt: string;           // 收藏时间
  tags: string[];                // 标签
  metadata: Record<string, any>; // 模块特定元数据
  status: 'active' | 'archived' | 'deleted'; // 状态
}

class CollectionService {
  private readonly STORAGE_KEY = 'medical_collections';
  private readonly EVENT_NAME = 'medical-collections-changed';

  // 获取所有收藏
  getAllCollections(): UnifiedCollectionItem[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    
    try {
      const parsed = JSON.parse(data);
      return parsed.items || [];
    } catch (error) {
      console.error('读取收藏数据失败:', error);
      return [];
    }
  }

  // 获取活跃的收藏（排除已删除的）
  getActiveCollections(): UnifiedCollectionItem[] {
    return this.getAllCollections().filter(item => item.status === 'active');
  }

  // 按模块获取收藏
  getCollectionsByModule(module: string): UnifiedCollectionItem[] {
    const allCollections = this.getAllCollections();
    return allCollections.filter(item => 
      item.module === module && item.status === 'active'
    );
  }

  // 检查是否已收藏
  isCollected(module: string, moduleItemId: string): boolean {
    const collections = this.getAllCollections();
    return collections.some(item => 
      item.module === module && 
      item.moduleItemId === moduleItemId && 
      item.status === 'active'
    );
  }

  // 添加收藏
  addCollection(item: Omit<UnifiedCollectionItem, 'id' | 'collectedAt' | 'status'>): UnifiedCollectionItem {
    const collections = this.getAllCollections();
    
    // 检查是否已存在
    const existingIndex = collections.findIndex(c => 
      c.module === item.module && c.moduleItemId === item.moduleItemId && c.status === 'active'
    );
    
    let updatedItem: UnifiedCollectionItem;
    
    if (existingIndex >= 0) {
      // 已存在，更新
      updatedItem = {
        ...collections[existingIndex],
        ...item,
        collectedAt: new Date().toISOString()
      };
      collections[existingIndex] = updatedItem;
    } else {
      // 新增
      updatedItem = {
        ...item,
        id: this.generateId(),
        collectedAt: new Date().toISOString(),
        status: 'active'
      };
      collections.push(updatedItem);
    }
    
    this.saveCollections(collections);
    this.notifyChange();
    
    return updatedItem;
  }

  // 取消收藏（软删除）
  removeCollection(module: string, moduleItemId: string): boolean {
    const collections = this.getAllCollections();
    const index = collections.findIndex(item => 
      item.module === module && item.moduleItemId === moduleItemId && item.status === 'active'
    );
    
    if (index >= 0) {
      // 软删除：标记为删除状态，保留历史数据
      collections[index] = {
        ...collections[index],
        status: 'deleted'
      };
      
      this.saveCollections(collections);
      this.notifyChange();
      return true;
    }
    
    return false;
  }

  // 搜索收藏
  searchCollections(query: string, module?: string): UnifiedCollectionItem[] {
    const collections = this.getActiveCollections();
    
    let filtered = collections;
    if (module && module !== 'all') {
      filtered = filtered.filter(item => item.module === module);
    }
    
    if (!query) return filtered;
    
    const lowerQuery = query.toLowerCase();
    return filtered.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.content.toLowerCase().includes(lowerQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // 获取收藏统计信息
  getCollectionStats(): {
    total: number;
    active: number;
    archived: number;
    byModule: Record<string, number>;
    recentCount: number;
    lastUpdated: string;
  } {
    const collections = this.getActiveCollections();
    const allCollections = this.getAllCollections();
    
    // 按模块统计
    const byModule: Record<string, number> = {};
    collections.forEach(item => {
      byModule[item.module] = (byModule[item.module] || 0) + 1;
    });
    
    // 计算最近7天新增
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentCount = collections.filter(item => {
      const itemDate = new Date(item.collectedAt);
      return itemDate >= oneWeekAgo;
    }).length;
    
    // 统计归档和已删除数量
    const archived = allCollections.filter(item => item.status === 'archived').length;
    const deleted = allCollections.filter(item => item.status === 'deleted').length;
    
    return {
      total: collections.length,
      active: collections.length,
      archived,
      byModule,
      recentCount,
      lastUpdated: new Date().toISOString()
    };
  }

  // 批量删除收藏
  batchRemoveCollections(ids: string[]): number {
    const collections = this.getAllCollections();
    let removedCount = 0;
    
    collections.forEach((item, index) => {
      if (ids.includes(item.id) && item.status === 'active') {
        collections[index] = {
          ...item,
          status: 'deleted'
        };
        removedCount++;
      }
    });
    
    if (removedCount > 0) {
      this.saveCollections(collections);
      this.notifyChange();
    }
    
    return removedCount;
  }

  // 获取模块配置
  getModuleConfig(): Record<string, {
    module: string;
    label: string;
    icon: string;
    color: string;
    description?: string;
  }> {
    return {
      message: { 
        module: 'message', 
        label: '消息通知', 
        icon: '📨', 
        color: '#1890ff',
        description: '系统消息和通知'
      },
      medical_case: { 
        module: 'medical_case', 
        label: '医案分享', 
        icon: '📋', 
        color: '#52c41a',
        description: '经典医案和诊疗记录'
      },
      qa: { 
        module: 'qa', 
        label: '寻医问药', 
        icon: '❓', 
        color: '#722ed1',
        description: '医疗问答和咨询'
      },
      community: { 
        module: 'community', 
        label: '专病社区', 
        icon: '👥', 
        color: '#fa8c16',
        description: '病友交流和专病讨论'
      },
      wechat: { 
        module: 'wechat', 
        label: '微信文章', 
        icon: '💬', 
        color: '#13c2c2',
        description: '微信公众号文章和外部内容'
      },
      suggestion: { 
      module: 'suggestion', 
      label: '发展建议', 
      icon: '💡', 
      color: '#F97316',  // 橙色
      description: '社区发展建议和反馈'
      }
    };
  }

  // 导出收藏数据
  exportCollections(): string {
    const collections = this.getActiveCollections();
    return JSON.stringify(collections, null, 2);
  }

  // 获取收藏详情
  getCollectionDetail(id: string): UnifiedCollectionItem | null {
    const collections = this.getActiveCollections();
    return collections.find(item => item.id === id) || null;
  }

  // 切换收藏状态（收藏/取消收藏）
  toggleCollection(item: Omit<UnifiedCollectionItem, 'id' | 'collectedAt' | 'status'>): boolean {
    const isCollected = this.isCollected(item.module, item.moduleItemId);
    
    if (isCollected) {
      // 已收藏，执行取消收藏
      return this.removeCollection(item.module, item.moduleItemId);
    } else {
      // 未收藏，执行收藏
      this.addCollection(item);
      return true;
    }
  }

  // 根据ID删除收藏
  removeCollectionById(id: string): boolean {
    const collections = this.getAllCollections();
    const index = collections.findIndex(item => item.id === id && item.status === 'active');
    
    if (index >= 0) {
      collections[index] = {
        ...collections[index],
        status: 'deleted'
      };
      
      this.saveCollections(collections);
      this.notifyChange();
      return true;
    }
    
    return false;
  }

  // 清空所有收藏（开发用）
  clearAllCollections(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.notifyChange();
  }

  // 私有方法
  private saveCollections(collections: UnifiedCollectionItem[]): void {
    const data = {
      items: collections,
      version: '1.0.0',
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private notifyChange(): void {
    window.dispatchEvent(new CustomEvent(this.EVENT_NAME, {
      detail: { timestamp: Date.now() }
    }));
  }

  private generateId(): string {
    return `col_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 导出单例实例
export const collectionService = new CollectionService();