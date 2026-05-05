// src/shared/services/communityLifeService.ts
import { CommunityCategory, CommunityActivity, CommunityStats, CommunityType } from '../types/community';

class CommunityLifeService {
  private readonly CATEGORIES_KEY = 'community_categories';
  private readonly ACTIVITIES_KEY = 'community_activities';

  constructor() {
    this.initCategories();
  }

  /**
   * 初始化社区分类数据
   */
  private initCategories() {
    const categories = this.getCategories();
    if (categories.length === 0) {
      // 专病社区
      const diseaseCategories: CommunityCategory[] = [
        { id: 'fxm', name: '风湿病', pinyin: 'F', description: '风湿病友互助社区', type: 'disease', memberCount: 156, postCount: 89 },
        { id: 'gxy', name: '高血压', pinyin: 'G', description: '高血压患者交流社区', type: 'disease', memberCount: 234, postCount: 156 },
        { id: 'tnb', name: '糖尿病', pinyin: 'T', description: '糖尿病患者互助社区', type: 'disease', memberCount: 312, postCount: 203 },
        { id: 'gxb', name: '冠心病', pinyin: 'G', description: '冠心病患者交流社区', type: 'disease', memberCount: 178, postCount: 97 },
        { id: 'gjy', name: '关节炎', pinyin: 'G', description: '关节炎病友互助社区', type: 'disease', memberCount: 145, postCount: 78 },
        { id: 'copf', name: '慢阻肺', pinyin: 'M', description: '慢阻肺患者交流社区', type: 'disease', memberCount: 98, postCount: 56 },
        { id: 'pjs', name: '偏头痛', pinyin: 'P', description: '偏头痛患者互助社区', type: 'disease', memberCount: 167, postCount: 92 },
        { id: 'qgy', name: '青光眼', pinyin: 'Q', description: '青光眼患者交流社区', type: 'disease', memberCount: 76, postCount: 43 },
        { id: 'sxeb', name: '神经性耳聋', pinyin: 'S', description: '耳聋患者互助社区', type: 'disease', memberCount: 54, postCount: 31 },
        { id: 'ylxgb', name: '乙型肝炎', pinyin: 'Y', description: '乙肝患者交流社区', type: 'disease', memberCount: 189, postCount: 112 },
        { id: 'yxj', name: '抑郁症', pinyin: 'Y', description: '抑郁症患者互助社区', type: 'disease', memberCount: 278, postCount: 187 },
        { id: 'gm', name: '感冒', pinyin: 'G', description: '感冒病友交流社区', type: 'disease', memberCount: 423, postCount: 301 }
      ];

      // 其他社区
      const otherCategories: CommunityCategory[] = [
        { id: 'xljk', name: '心理健康', pinyin: 'X', description: '心理健康交流社区', type: 'other', memberCount: 567, postCount: 432 },
        { id: 'zyyx', name: '中药研学', pinyin: 'Z', description: '中药学习交流社区', type: 'other', memberCount: 345, postCount: 278 },
        { id: 'zjxx', name: '针灸学习', pinyin: 'Z', description: '针灸学习交流社区', type: 'other', memberCount: 234, postCount: 167 },
        { id: 'tjys', name: '太极养生', pinyin: 'T', description: '太极养生交流社区', type: 'other', memberCount: 189, postCount: 134 },
        { id: 'yyys', name: '营养饮食', pinyin: 'Y', description: '营养饮食交流社区', type: 'other', memberCount: 456, postCount: 321 },
        { id: 'ydjk', name: '运动健康', pinyin: 'Y', description: '运动健康交流社区', type: 'other', memberCount: 398, postCount: 276 }
      ];

      const allCategories = [...diseaseCategories, ...otherCategories];
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(allCategories));
    }
  }

  /**
   * 获取所有社区分类
   */
  getCategories(): CommunityCategory[] {
    const stored = localStorage.getItem(this.CATEGORIES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * 根据类型获取社区分类（合并预定义和用户创建的社区）
   */
    getCategoriesByType(type: CommunityType): CommunityCategory[] {
    // 获取预定义的社区
    const predefined = this.getCategories();
    const filteredPredefined = predefined.filter(c => c.type === type);
    
    // 从 medical_communities 获取用户创建的社区（只获取指定类型的）
    const userCommunities = JSON.parse(localStorage.getItem('medical_communities') || '[]');
    const userCategories = userCommunities
      .filter((c: any) => c.isActive === true && c.type === type)
      .map((c: any) => ({
        id: c.id,
        name: c.name,
        pinyin: c.pinyin || c.name.charAt(0).toUpperCase(),
        description: c.description || `${c.name}交流社区`,
        type: type,
        memberCount: 0,
        postCount: 0,
        icon: c.icon || '🏥',
        isUserCreated: true
      }));
    
    // 合并并去重
    const all = [...filteredPredefined, ...userCategories];
    const unique = all.filter((c, index, self) => 
      index === self.findIndex((t) => t.id === c.id)
    );
    
    return unique;
  }

  /**
   * 获取社区详情
   */
  getCategoryById(id: string): CommunityCategory | null {
    const all = this.getCategories();
    return all.find(c => c.id === id) || null;
  }

  /**
   * 搜索社区
   */
  searchCategories(keyword: string, type?: CommunityType): CommunityCategory[] {
    const all = type ? this.getCategoriesByType(type) : this.getCategories();
    const lowerKeyword = keyword.toLowerCase();

    return all.filter(c =>
      c.name.toLowerCase().includes(lowerKeyword) ||
      c.description.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * 获取社区动态
   */
  getActivities(limit: number = 20): CommunityActivity[] {
    const stored = localStorage.getItem(this.ACTIVITIES_KEY);
    const activities = stored ? JSON.parse(stored) : this.generateMockActivities();

    return activities.slice(0, limit);
  }

  /**
   * 获取社区统计
   */
  getStats(): CommunityStats {
    const categories = this.getCategories();
    const diseaseCount = categories.filter(c => c.type === 'disease').length;
    const otherCount = categories.filter(c => c.type === 'other').length;
    const totalMembers = categories.reduce((sum, c) => sum + (c.memberCount || 0), 0);
    const totalPosts = categories.reduce((sum, c) => sum + (c.postCount || 0), 0);

    return {
      diseaseCount,
      otherCount,
      totalCommunities: diseaseCount + otherCount,
      totalMembers,
      totalPosts,
      activeToday: 128
    };
  }

  /**
   * 生成模拟动态数据
   */
  private generateMockActivities(): CommunityActivity[] {
    return [
      {
        id: 'act_1',
        communityId: 'gxy',
        communityName: '高血压',
        type: 'new_post',
        title: '新帖子：降压药使用心得',
        content: '分享我的降压药使用经验...',
        author: '李医生',
        createdAt: new Date().toISOString()
      },
      {
        id: 'act_2',
        communityId: 'tnb',
        communityName: '糖尿病',
        type: 'new_member',
        title: '新成员加入',
        content: '欢迎新成员加入社区',
        author: '系统',
        createdAt: new Date().toISOString()
      },
      {
        id: 'act_3',
        communityId: 'zjxx',
        communityName: '针灸学习',
        type: 'new_lecture',
        title: '新讲座：针灸入门',
        content: '针灸基础知识讲座',
        author: '王教授',
        createdAt: new Date().toISOString()
      }
    ];
  }
}

export const communityLifeService = new CommunityLifeService();
