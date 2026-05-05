/**
 * 社区管理服务
 * 负责专病社区的创建和删除
 */

export interface CommunityInfo {
  id: string;                 // 社区ID（如：gxy, tnb, fxm）
  name: string;               // 社区名称（如：高血压，糖尿病）
  pinyin: string;             // 拼音首字母
  icon?: string;              // 图标（可选）
  color?: string;             // 颜色（可选）
  description?: string;       // 描述（可选）
  createdAt: string;          // 创建时间
  createdBy: string;          // 创建者ID
  isActive: boolean;          // 是否激活
}

class CommunityAdminService {
  private readonly STORAGE_KEY = 'medical_communities';
  private readonly DEFAULT_COMMUNITIES: CommunityInfo[] = [
    { id: 'gxy', name: '高血压', pinyin: 'G', icon: '❤️', color: 'text-red-600', createdAt: '2026-01-01', createdBy: 'system', isActive: true },
    { id: 'tnb', name: '糖尿病', pinyin: 'T', icon: '💉', color: 'text-blue-600', createdAt: '2026-01-01', createdBy: 'system', isActive: true },
    { id: 'gxb', name: '冠心病', pinyin: 'G', icon: '💔', color: 'text-rose-600', createdAt: '2026-01-01', createdBy: 'system', isActive: true },
    { id: 'gjy', name: '关节炎', pinyin: 'G', icon: '🦴', color: 'text-amber-600', createdAt: '2026-01-01', createdBy: 'system', isActive: true },
    { id: 'copf', name: '慢阻肺', pinyin: 'M', icon: '🌬️', color: 'text-emerald-600', createdAt: '2026-01-01', createdBy: 'system', isActive: true },
    { id: 'pjs', name: '偏头痛', pinyin: 'P', icon: '🤕', color: 'text-purple-600', createdAt: '2026-01-01', createdBy: 'system', isActive: true },
    { id: 'qgy', name: '青光眼', pinyin: 'Q', icon: '👁️', color: 'text-indigo-600', createdAt: '2026-01-01', createdBy: 'system', isActive: true },
    { id: 'sxeb', name: '神经性耳聋', pinyin: 'S', icon: '👂', color: 'text-yellow-600', createdAt: '2026-01-01', createdBy: 'system', isActive: true },
    { id: 'fxm', name: '风湿病', pinyin: 'F', icon: '🦵', color: 'text-teal-600', createdAt: '2026-01-01', createdBy: 'system', isActive: true },
    { id: 'ylxgb', name: '乙型肝炎', pinyin: 'Y', icon: '🫁', color: 'text-lime-600', createdAt: '2026-01-01', createdBy: 'system', isActive: true },
    { id: 'yxj', name: '抑郁症', pinyin: 'Y', icon: '😔', color: 'text-violet-600', createdAt: '2026-01-01', createdBy: 'system', isActive: true },
    { id: 'gm', name: '感冒', pinyin: 'G', icon: '🤧', color: 'text-cyan-600', createdAt: '2026-01-01', createdBy: 'system', isActive: true }
  ];

  /**
   * 获取所有社区
   */
  getAllCommunities(): CommunityInfo[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('加载社区列表失败:', error);
    }
    
    // 返回默认社区
    return [...this.DEFAULT_COMMUNITIES];
  }

  /**
   * 保存社区列表
   */
  private saveCommunities(communities: CommunityInfo[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(communities));
  }

  /**
   * 创建新社区（支持恢复已删除的社区）
   */
    createCommunity(name: string, createdBy: string, communityType: 'disease' | 'other' = 'disease'): CommunityInfo {
    const communities = this.getAllCommunities();
    
    // 生成社区ID（拼音首字母+时间戳）
    const pinyin = name.charAt(0).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    const id = `${pinyin}_${timestamp}`.toLowerCase();
    
    // 检查激活的社区中是否已存在同名
    const existingActive = communities.find(c => c.name === name && c.isActive === true);
    if (existingActive) {
      throw new Error(`社区 ${name} 已存在`);
    }
    
    // 检查是否存在已删除的同名社区
    const existingDeleted = communities.find(c => c.name === name && c.isActive === false);
    if (existingDeleted) {
      // 恢复已删除的社区
      const index = communities.findIndex(c => c.id === existingDeleted.id);
      communities[index] = {
        ...existingDeleted,
        isActive: true,
        type: communityType,
        createdAt: new Date().toISOString(),
        createdBy
      };
      this.saveCommunities(communities);
      console.log(`✅ 恢复社区: ${name} (${existingDeleted.id})`);
      return communities[index];
    }
    
    // 创建全新社区
    const newCommunity: CommunityInfo = {
      id,
      name,
      pinyin,
      icon: '🆕',
      color: 'text-gray-600',
      description: `${name}病友社区`,
      type: communityType,
      createdAt: new Date().toISOString(),
      createdBy,
      isActive: true
    };
    
    communities.push(newCommunity);
    this.saveCommunities(communities);
    
    console.log(`✅ 创建新社区: ${name} (${id})`);
    return newCommunity;
  }

  /**
   * 删除社区（软删除）
   */
  deleteCommunity(id: string, userId: string): boolean {
    const communities = this.getAllCommunities();
    const index = communities.findIndex(c => c.id === id);
    
    if (index === -1) return false;
    
    // 检查是否是系统默认社区（不允许删除）
    if (this.DEFAULT_COMMUNITIES.some(c => c.id === id)) {
      throw new Error('系统默认社区不能删除');
    }
    
    // 软删除：标记为未激活
    communities[index] = {
      ...communities[index],
      isActive: false
    };
    
    this.saveCommunities(communities);
    
    // 同时删除该社区的所有相关数据
    this.deleteCommunityData(id, communities[index].name);
    
    console.log(`✅ 软删除社区: ${id}`);
    return true;
  }

  /**
   * 永久删除社区（管理员功能）
   */
  permanentDeleteCommunity(id: string, userId: string): boolean {
    const communities = this.getAllCommunities();
    const filtered = communities.filter(c => c.id !== id);
    
    if (filtered.length === communities.length) return false;
    
    this.saveCommunities(filtered);
    this.deleteCommunityData(id, '');
    
    return true;
  }

  /**
   * 删除社区相关数据
   */
  private deleteCommunityData(communityId: string, communityName: string): void {
    try {
      // 删除消息数据
      const messages = JSON.parse(localStorage.getItem('medical_all_messages') || '[]');
      const filteredMessages = messages.filter((msg: any) => 
        msg.disease !== communityName && !msg.tags?.includes(communityName)
      );
      localStorage.setItem('medical_all_messages', JSON.stringify(filteredMessages));
      
      // 删除论坛帖子
      const forumPosts = JSON.parse(localStorage.getItem('medical_forum_posts') || '[]');
      const filteredPosts = forumPosts.filter((post: any) => 
        post.disease !== communityName && !post.tags?.includes(communityName)
      );
      localStorage.setItem('medical_forum_posts', JSON.stringify(filteredPosts));
      
      // 删除发展建议
      const suggestions = JSON.parse(localStorage.getItem('community_suggestions') || '[]');
      const filteredSuggestions = suggestions.filter((s: any) => 
        s.diseaseId !== communityId && s.diseaseName !== communityName
      );
      localStorage.setItem('community_suggestions', JSON.stringify(filteredSuggestions));
      
      // 删除社区统计
      const stats = JSON.parse(localStorage.getItem('community_stats') || '{"communities":[]}');
      stats.communities = stats.communities.filter((c: any) => c.diseaseId !== communityId);
      localStorage.setItem('community_stats', JSON.stringify(stats));
      
      console.log(`✅ 已删除社区 ${communityName} 的所有相关数据`);
    } catch (error) {
      console.error('删除社区数据失败:', error);
    }
  }

  /**
   * 获取可显示的社区（只显示激活的）
   */
  getActiveCommunities(): CommunityInfo[] {
    return this.getAllCommunities().filter(c => c.isActive);
  }

  /**
   * 检查社区是否存在（包括已删除的）
   */
  communityExists(name: string): boolean {
    const communities = this.getAllCommunities();
    return communities.some(c => c.name === name);
  }

  /**
   * 获取已删除的社区列表
   */
  getDeletedCommunities(): CommunityInfo[] {
    return this.getAllCommunities().filter(c => !c.isActive);
  }
}

export const communityAdminService = new CommunityAdminService();
