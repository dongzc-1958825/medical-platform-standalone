/**
 * 社区发展统计数据服务
 * 负责所有专病社区的统计数据计算和存储
 */

import { communityLevelService } from './communityLevelService';

export interface CommunityStats {
  diseaseId: string;           // 专病ID
  diseaseName: string;         // 专病名称
  establishmentDate: string;   // 设立时间
  
  // 参与人数
  totalParticipants: number;   // 总参与人数
  newParticipants: {           // 新增参与人数（按季度）- 独立用户数
    q1: number;
    q2: number;
    q3: number;
    q4: number;
  };
  
  // 活跃度
  dailyActive: number;         // 日活跃用户
  weeklyActive: number;        // 周活跃用户
  monthlyActive: number;       // 月活跃用户
  activeTrend: {               // 活跃度趋势（按季度）- 独立用户数
    q1: number;
    q2: number;
    q3: number;
    q4: number;
  };
  
  // 满意度（基于多维度计算）
  totalLikes: number;          // 总点赞数
  totalPosts: number;          // 总帖子数（公告+论坛+讲座）
  totalComments: number;       // 总评论数
  satisfactionScore: number;   // 满意度评分 (0-100)
  satisfactionTrend: {         // 满意度趋势（按季度）
    q1: number;
    q2: number;
    q3: number;
    q4: number;
  };
  
  // 社区发展建议统计
  suggestionCount: number;     // 建议总数
  suggestionLikes: number;     // 建议点赞总数
  
  // 社区等级
  level: string;               // A/B/C/D/E
  levelInfo: any;              // 等级详细信息
  
  // 更新时间
  lastUpdated: string;
}

export interface AllCommunitiesStats {
  communities: CommunityStats[];
  lastUpdated: string;
  // 横向对比
  rankings: {
    byParticipants: CommunityStats[];
    byActive: CommunityStats[];
    bySatisfaction: CommunityStats[];
  };
}

/**
 * 多维度满意度评分计算器
 */
class SatisfactionScoreCalculator {
  /**
   * 计算满意度评分 (0-100)
   * @param totalLikes 总点赞数
   * @param totalPosts 总帖子数
   * @param totalParticipants 参与人数
   * @param totalComments 总评论数（可选）
   */
  static calculate(
    totalLikes: number,
    totalPosts: number,
    totalParticipants: number,
    totalComments: number = 0
  ): number {
    if (totalPosts === 0) return 0;
    
    // 1. 基础点赞率 (权重 40%)
    const avgLikesPerPost = totalLikes / totalPosts;
    const likeScore = this.calculateLikeScore(avgLikesPerPost);
    
    // 2. 互动深度 - 评论数 (权重 30%)
    const avgCommentsPerPost = totalPosts > 0 ? totalComments / totalPosts : 0;
    const commentScore = this.calculateCommentScore(avgCommentsPerPost);
    
    // 3. 参与密度 - 人均发帖 (权重 30%)
    const postsPerParticipant = totalPosts / Math.max(totalParticipants, 1);
    const densityScore = this.calculateDensityScore(postsPerParticipant);
    
    // 加权总分
    const totalScore = 
      likeScore * 0.4 + 
      commentScore * 0.3 + 
      densityScore * 0.3;
    
    const finalScore = Math.min(100, Math.round(totalScore));
    
    console.log(`📊 满意度计算:`, {
      avgLikes: avgLikesPerPost.toFixed(2),
      likeScore,
      avgComments: avgCommentsPerPost.toFixed(2),
      commentScore,
      postsPerPerson: postsPerParticipant.toFixed(2),
      densityScore,
      finalScore
    });
    
    return finalScore;
  }
  
  /**
   * 点赞率评分 (0-100)
   * 使用对数函数，让高分更难达到
   */
  private static calculateLikeScore(avgLikes: number): number {
    // 对数函数：30 * log(avgLikes + 1)
    // avgLikes=1 -> 21分
    // avgLikes=3 -> 36分
    // avgLikes=5 -> 48分
    // avgLikes=10 -> 72分
    // avgLikes=20 -> 92分
    // avgLikes=30 -> 100分
    const baseScore = 30;
    const score = baseScore * Math.log(avgLikes + 1);
    return Math.min(100, Math.round(score));
  }
  
  /**
   * 评论率评分 (0-100)
   */
  private static calculateCommentScore(avgComments: number): number {
    // 25 * log(avgComments + 1)
    // avgComments=0.5 -> 10分
    // avgComments=1 -> 17分
    // avgComments=2 -> 27分
    // avgComments=5 -> 44分
    // avgComments=10 -> 60分
    // avgComments=20 -> 76分
    const baseScore = 25;
    const score = baseScore * Math.log(avgComments + 1);
    return Math.min(100, Math.round(score));
  }
  
  /**
   * 参与密度评分 (0-100)
   * 人均发帖数反映社区活跃度
   */
  private static calculateDensityScore(postsPerPerson: number): number {
    // 人均发帖 0.5 -> 25分
    // 人均发帖 1.0 -> 50分
    // 人均发帖 2.0 -> 75分
    // 人均发帖 3.0 -> 90分
    // 人均发帖 4.0 -> 100分
    const score = Math.min(100, Math.round(postsPerPerson * 50));
    return score;
  }
}

class CommunityStatsService {
  private readonly STORAGE_KEY = 'community_stats';

  /**
   * 初始化默认统计数据
   */
  private getDefaultStats(diseaseId: string, diseaseName: string): CommunityStats {
    const now = new Date();
    const levelInfo = communityLevelService.getLevel(0);
    
    return {
      diseaseId,
      diseaseName,
      establishmentDate: '2026-01-01', // 默认设立时间
      
      totalParticipants: 0,
      newParticipants: { q1: 0, q2: 0, q3: 0, q4: 0 },
      
      dailyActive: 0,
      weeklyActive: 0,
      monthlyActive: 0,
      activeTrend: { q1: 0, q2: 0, q3: 0, q4: 0 },
      
      totalLikes: 0,
      totalPosts: 0,
      totalComments: 0,
      satisfactionScore: 0,
      satisfactionTrend: { q1: 0, q2: 0, q3: 0, q4: 0 },
      
      suggestionCount: 0,
      suggestionLikes: 0,
      
      level: levelInfo.level,
      levelInfo,
      
      lastUpdated: now.toISOString()
    };
  }

  /**
   * 获取所有社区的统计数据
   */
  getAllStats(): AllCommunitiesStats {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
    
    // 返回默认数据
    return {
      communities: [],
      lastUpdated: new Date().toISOString(),
      rankings: {
        byParticipants: [],
        byActive: [],
        bySatisfaction: []
      }
    };
  }

  /**
   * 获取指定社区的统计数据
   */
  getCommunityStats(diseaseId: string, diseaseName: string): CommunityStats {
    const allStats = this.getAllStats();
    const existing = allStats.communities.find(c => c.diseaseId === diseaseId);
    
    if (existing) {
      return existing;
    }
    
    // 如果不存在，创建默认数据
    const newStats = this.getDefaultStats(diseaseId, diseaseName);
    allStats.communities.push(newStats);
    this.saveAllStats(allStats);
    
    return newStats;
  }

  /**
   * 保存所有统计数据
   */
  private saveAllStats(allStats: AllCommunitiesStats): void {
    try {
      allStats.lastUpdated = new Date().toISOString();
      // 更新排名
      allStats.rankings = this.calculateRankings(allStats.communities);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allStats));
    } catch (error) {
      console.error('保存统计数据失败:', error);
    }
  }

  /**
   * 计算排名
   */
  private calculateRankings(communities: CommunityStats[]): AllCommunitiesStats['rankings'] {
    // 只保留有数据的社区（参与人数>0或帖子数>0）
    const activeCommunities = communities.filter(c => 
      c.totalParticipants > 0 || c.totalPosts > 0 || c.suggestionCount > 0
    );
    
    return {
      byParticipants: [...activeCommunities].sort((a, b) => b.totalParticipants - a.totalParticipants),
      byActive: [...activeCommunities].sort((a, b) => b.monthlyActive - a.monthlyActive),
      bySatisfaction: [...activeCommunities].sort((a, b) => b.satisfactionScore - a.satisfactionScore)
    };
  }

  /**
   * 从 localStorage 加载所有消息数据
   */
  private loadAllMessages(): any[] {
    try {
      const saved = localStorage.getItem('medical_all_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  /**
   * 从 localStorage 加载论坛帖子数据
   */
  private loadAllForumPosts(): any[] {
    try {
      const saved = localStorage.getItem('medical_forum_posts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  /**
   * 从 localStorage 加载发展建议数据
   */
  private loadAllSuggestions(): any[] {
    try {
      const saved = localStorage.getItem('community_suggestions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  /**
   * 计算总评论数
   */
  private calculateTotalComments(
    messages: any[],
    forumPosts: any[],
    suggestions: any[]
  ): number {
    let total = 0;
    
    const countComments = (items: any[]) => {
      items.forEach(item => {
        if (item.comments && Array.isArray(item.comments)) {
          total += item.comments.length;
        }
      });
    };
    
    countComments(messages);
    countComments(forumPosts);
    countComments(suggestions);
    
    return total;
  }

  /**
   * 解析相对时间
   */
  private parseRelativeTime(relativeStr: string): Date | null {
    const now = new Date();
    
    if (relativeStr === '刚刚') {
      return now;
    }
    
    const minutesMatch = relativeStr.match(/^(\d+)分钟前$/);
    if (minutesMatch) {
      const minutes = parseInt(minutesMatch[1]);
      return new Date(now.getTime() - minutes * 60 * 1000);
    }
    
    const hoursMatch = relativeStr.match(/^(\d+)小时前$/);
    if (hoursMatch) {
      const hours = parseInt(hoursMatch[1]);
      return new Date(now.getTime() - hours * 60 * 60 * 1000);
    }
    
    const daysMatch = relativeStr.match(/^(\d+)天前$/);
    if (daysMatch) {
      const days = parseInt(daysMatch[1]);
      return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }
    
    return null;
  }

  /**
   * 解析各种日期格式
   */
  private parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    
    try {
      const relativeDate = this.parseRelativeTime(dateStr);
      if (relativeDate) return relativeDate;
      
      let date = new Date(dateStr);
      if (!isNaN(date.getTime())) return date;
      
      const shortFormat = dateStr.match(/^(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2})$/);
      if (shortFormat) {
        const month = parseInt(shortFormat[1]);
        const day = parseInt(shortFormat[2]);
        const hour = parseInt(shortFormat[3]);
        const minute = parseInt(shortFormat[4]);
        const currentYear = new Date().getFullYear();
        date = new Date(currentYear, month - 1, day, hour, minute);
        if (!isNaN(date.getTime())) return date;
      }
      
      const shortYearFormat = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2})$/);
      if (shortYearFormat) {
        const year = parseInt(shortYearFormat[1]);
        const month = parseInt(shortYearFormat[2]);
        const day = parseInt(shortYearFormat[3]);
        const hour = parseInt(shortYearFormat[4]);
        const minute = parseInt(shortYearFormat[5]);
        date = new Date(year, month - 1, day, hour, minute);
        if (!isNaN(date.getTime())) return date;
      }
      
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * 获取当前季度
   */
  private getCurrentQuarter(date: Date): number {
    const month = date.getMonth() + 1;
    return Math.floor((month - 1) / 3) + 1;
  }

  /**
   * 更新社区统计数据
   */
  async updateCommunityStats(diseaseId: string, diseaseName: string): Promise<CommunityStats> {
    console.log(`📊 开始更新 ${diseaseName} 社区统计数据`);
    
    const allStats = this.getAllStats();
    let stats = allStats.communities.find(c => c.diseaseId === diseaseId);
    
    if (!stats) {
      stats = this.getDefaultStats(diseaseId, diseaseName);
      allStats.communities.push(stats);
    }

    const now = new Date();
    
    // 获取各类数据
    const messages = this.loadAllMessages();
    const forumPosts = this.loadAllForumPosts();
    const suggestions = this.loadAllSuggestions();
    
    // 过滤出当前社区的数据
    const communityMessages = [
      ...messages.filter((msg: any) => 
        (msg.type === 'announcement' || msg.type === 'lecture') && 
        (msg.disease === diseaseName || msg.tags?.includes(diseaseName))
      ),
      ...forumPosts.filter((post: any) => 
        post.disease === diseaseName || post.tags?.includes(diseaseName)
      )
    ];

    const communitySuggestions = suggestions.filter((s: any) => 
      s.diseaseId === diseaseId || s.diseaseName === diseaseName
    );

    // ========== 参与人数统计 ==========
    const participants = new Set<string>();
    
    const addParticipants = (items: any[]) => {
      items.forEach(item => {
        if (item.publisherId) participants.add(item.publisherId);
        if (item.authorId) participants.add(item.authorId);
        if (item.author) participants.add(item.author);
        
        if (item.comments) {
          item.comments.forEach((c: any) => {
            if (c.userId) participants.add(c.userId);
            if (c.user) participants.add(c.user);
          });
        }
      });
    };

    addParticipants(communityMessages);
    addParticipants(forumPosts);
    addParticipants(communitySuggestions);

    stats.totalParticipants = participants.size;

    // ========== 季度参与人数统计（按独立用户） ==========
    const quarterParticipants = {
      q1: new Set<string>(),
      q2: new Set<string>(),
      q3: new Set<string>(),
      q4: new Set<string>()
    };

    const addToQuarter = (item: any) => {
      if (!item.date) return;
      const itemDate = this.parseDate(item.date);
      if (!itemDate) return;
      
      const quarter = this.getCurrentQuarter(itemDate);
      const quarterKey = `q${quarter}` as keyof typeof quarterParticipants;
      
      // 添加发布者
      const publisherId = item.publisherId || item.authorId || item.author;
      if (publisherId) quarterParticipants[quarterKey].add(publisherId);
      
      // 添加评论者
      if (item.comments) {
        item.comments.forEach((c: any) => {
          const commentUserId = c.userId || c.user;
          if (commentUserId) quarterParticipants[quarterKey].add(commentUserId);
        });
      }
    };

    communityMessages.forEach(addToQuarter);
    forumPosts.forEach(addToQuarter);
    communitySuggestions.forEach(addToQuarter);

    stats.newParticipants = {
      q1: quarterParticipants.q1.size,
      q2: quarterParticipants.q2.size,
      q3: quarterParticipants.q3.size,
      q4: quarterParticipants.q4.size
    };

    // 活跃度趋势（复用季度参与人数）
    stats.activeTrend = { ...stats.newParticipants };

    // ========== 活跃度计算 ==========
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const dailyUsers = new Set<string>();
    const weeklyUsers = new Set<string>();
    const monthlyUsers = new Set<string>();

    const checkActive = (item: any) => {
      if (!item.date) return;
      const itemDate = this.parseDate(item.date);
      if (!itemDate) return;
      
      const userId = item.publisherId || item.authorId || item.author;
      if (!userId) return;
      
      if (itemDate > oneDayAgo) dailyUsers.add(userId);
      if (itemDate > sevenDaysAgo) weeklyUsers.add(userId);
      if (itemDate > thirtyDaysAgo) monthlyUsers.add(userId);
    };

    communityMessages.forEach(checkActive);
    forumPosts.forEach(checkActive);
    communitySuggestions.forEach(checkActive);

    stats.dailyActive = dailyUsers.size;
    stats.weeklyActive = weeklyUsers.size;
    stats.monthlyActive = monthlyUsers.size;

    // ========== 点赞和评论统计 ==========
    const allItems = [...communityMessages, ...communitySuggestions];
    stats.totalPosts = allItems.length;
    
    let totalLikes = 0;
    allItems.forEach(item => {
      totalLikes += item.stats?.likes || item.likes || 0;
    });
    stats.totalLikes = totalLikes;

    // 计算总评论数
    stats.totalComments = this.calculateTotalComments(communityMessages, forumPosts, communitySuggestions);

    // ========== 多维度满意度计算 ==========
    stats.satisfactionScore = SatisfactionScoreCalculator.calculate(
      totalLikes,
      stats.totalPosts,
      stats.totalParticipants,
      stats.totalComments
    );

  // ========== 季度满意度计算 ==========
const quarterPosts = { q1: 0, q2: 0, q3: 0, q4: 0 };
const quarterLikes = { q1: 0, q2: 0, q3: 0, q4: 0 };
const quarterComments = { q1: 0, q2: 0, q3: 0, q4: 0 };
// 修改变量名，避免与前面的 Set 变量冲突
const quarterParticipantsCount = { q1: 0, q2: 0, q3: 0, q4: 0 };

allItems.forEach(item => {
  if (!item.date) return;
  const itemDate = this.parseDate(item.date);
  if (!itemDate) return;
  
  const quarter = this.getCurrentQuarter(itemDate);
  const quarterKey = `q${quarter}` as keyof typeof quarterPosts;
  
  quarterPosts[quarterKey]++;
  quarterLikes[quarterKey] += item.stats?.likes || item.likes || 0;
});

// 计算季度满意度 - 使用新的变量名
stats.satisfactionTrend = {
  q1: quarterPosts.q1 > 0 ? 
    SatisfactionScoreCalculator.calculate(
      quarterLikes.q1, 
      quarterPosts.q1, 
      quarterParticipantsCount.q1, 
      quarterComments.q1
    ) : 0,
  q2: quarterPosts.q2 > 0 ? 
    SatisfactionScoreCalculator.calculate(
      quarterLikes.q2, 
      quarterPosts.q2, 
      quarterParticipantsCount.q2, 
      quarterComments.q2
    ) : 0,
  q3: quarterPosts.q3 > 0 ? 
    SatisfactionScoreCalculator.calculate(
      quarterLikes.q3, 
      quarterPosts.q3, 
      quarterParticipantsCount.q3, 
      quarterComments.q3
    ) : 0,
  q4: quarterPosts.q4 > 0 ? 
    SatisfactionScoreCalculator.calculate(
      quarterLikes.q4, 
      quarterPosts.q4, 
      quarterParticipantsCount.q4, 
      quarterComments.q4
    ) : 0
};

    // ========== 发展建议统计 ==========
    stats.suggestionCount = communitySuggestions.length;
    stats.suggestionLikes = communitySuggestions.reduce((sum, s) => sum + (s.likes || 0), 0);

    // ========== 社区等级计算 ==========
    const levelInfo = communityLevelService.getLevel(stats.satisfactionScore);
    stats.level = levelInfo.level;
    stats.levelInfo = levelInfo;

    stats.lastUpdated = new Date().toISOString();
    
    this.saveAllStats(allStats);
    
    console.log(`📊 ${diseaseName} 社区统计完成:`, {
      参与人数: stats.totalParticipants,
      季度参与: stats.newParticipants,
      活跃度: {日: stats.dailyActive, 周: stats.weeklyActive, 月: stats.monthlyActive},
      满意度: stats.satisfactionScore,
      等级: `${levelInfo.icon} ${levelInfo.name}`,
      建议数: stats.suggestionCount
    });
    
    return stats;
  }

  /**
   * 获取季度数据
   */
  getQuarterlyData(stats: CommunityStats): {
    participants: { q1: number; q2: number; q3: number; q4: number };
    active: { q1: number; q2: number; q3: number; q4: number };
    satisfaction: { q1: number; q2: number; q3: number; q4: number };
  } {
    return {
      participants: stats.newParticipants,
      active: stats.activeTrend,
      satisfaction: stats.satisfactionTrend
    };
  }

  /**
   * 获取横向对比数据
   */
  getComparisonData(): AllCommunitiesStats['rankings'] {
    const allStats = this.getAllStats();
    return allStats.rankings;
  }
}

export const communityStatsService = new CommunityStatsService();