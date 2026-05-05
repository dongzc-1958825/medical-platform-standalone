// src/shared/types/message/base.ts
import { PublicContent } from '../content/base';
import { DataVisibility } from '../base';

/**
 * 消息分类 - 五大专业分类（专用于消息功能）
 * 这是消息功能内部的子类型分类，与其他四大功能是平行关系
 */
export enum MessageCategory {
  NEW_DRUG = 'new_drug',           // 新药信息：药品研发、临床试验、用药经验
  PROFESSIONAL_ARTICLE = 'professional_article', // 专业文章：医学论文、研究成果、学术观点
  ANNOUNCEMENT = 'announcement',   // 公告发布：平台通知、会议信息、政策解读
  SPECIAL_EFFECT = 'special_effect', // 特效分享：特效方案、成功案例、独特疗法
  LESSON_LEARNED = 'lesson_learned' // 前车之鉴：经验教训、诊疗误区、风险警示
}

/**
 * 消息状态 - 专用于消息的生命周期管理
 */
export enum MessageStatus {
  DRAFT = 'draft',          // 草稿
  PUBLISHED = 'published',  // 已发布
  REVIEWING = 'reviewing',  // 审核中
  CORRECTED = 'corrected',  // 已修正
  WITHDRAWN = 'withdrawn',  // 已撤回
  ARCHIVED = 'archived'     // 已归档
}

/**
 * 消息基类 - 继承自 PublicContent，添加消息特定字段
 * 用于消息功能的五个子类型（新药信息、专业文章等）
 */
export interface MessageBase extends PublicContent {
  // === 消息特定字段 ===
  
  // 消息分类（必须）
  category: MessageCategory;
  
  // 子分类（可选）
  subCategory?: string;
  
  // 消息状态
  status: MessageStatus;
  version: number; // 版本号（用于追踪修改）
  
  // === 微信互通增强字段 ===
  
  // 原始微信内容（如果从微信导入）
  originalWeChatContent?: string;
  
  // 优化后的微信分享内容
  wechatOptimizedContent?: string;
  
  // 微信分享统计数据
  wechatShareCount: number;
  
  // 微信阅读预估时长（分钟）
  estimatedReadTime?: number;
  
  // === 消息特定元数据 ===
  
  // 消息来源详细分类
  sourceDetails?: {
    type: 'original' | 'repost' | 'translation' | 'summary';
    originalUrl?: string;
    originalAuthor?: string;
    translationInfo?: {
      sourceLanguage: string;
      targetLanguage: string;
      translator?: string;
    };
  };
  
  // 引用信息
  references?: Array<{
    id: string;
    title: string;
    author: string;
    url?: string;
    type: 'article' | 'book' | 'website' | 'other';
  }>;
  
  // 附件列表
  attachments?: Array<{
    id: string;
    name: string;
    type: 'image' | 'pdf' | 'doc' | 'video' | 'audio';
    url: string;
    size?: number;
    description?: string;
  }>;
  
  // === 医疗专业字段 ===
  
  // 医学领域
  medicalField?: string;
  
  // 证据等级
  evidenceLevel?: 'A' | 'B' | 'C' | 'D'; // A:最高
  
  // 适用人群
  targetAudience?: string[];
  
  // 重要提示/警告
  importantNotes?: string[];
  
  // === 互动增强 ===
  
  // 收藏统计
  saveCount: number;
  
  // 举报次数
  reportCount: number;
  
  // 质量评分（用户评价）
  qualityScore?: number; // 0-5分
  
  // === 时效性管理 ===
  
  // 有效期（对于有时效性的消息）
  expirationDate?: string;
  
  // 紧急程度
  urgency?: 'high' | 'medium' | 'low' | 'none';
  
  // 是否需要定期更新
  requiresPeriodicReview?: boolean;
  lastReviewedAt?: string;
  nextReviewDue?: string;
}

/**
 * 消息查询选项 - 专用于消息功能的查询
 */
export interface MessageQueryOptions {
  // 基础筛选
  category?: MessageCategory | MessageCategory[];
  status?: MessageStatus | MessageStatus[];
  authorId?: string;
  
  // 时间范围
  startDate?: string;
  endDate?: string;
  timeFrame?: 'today' | 'this_week' | 'this_month' | 'this_year';
  
  // 内容筛选
  tags?: string[];
  keywords?: string[];
  medicalField?: string;
  
  // 质量筛选
  minQualityScore?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  
  // 时效性筛选
  includeExpired?: boolean;
  urgency?: string;
  
  // 排序选项
  sortBy?: 'createdAt' | 'publishedAt' | 'viewCount' | 'likeCount' | 'commentCount' | 'shareCount' | 'saveCount';
  sortOrder?: 'asc' | 'desc';
  
  // 分页
  page?: number;
  pageSize?: number;
  
  // 微信相关
  includeWechatContent?: boolean;
}

/**
 * 统一查询选项（类型别名）
 * 为五大功能提供统一的查询参数入口
 * 当前作为 MessageQueryOptions 的别名，保持向后兼容
 * 后续可根据需要扩展为独立接口
 */
export type QueryOptions = MessageQueryOptions;

/**
 * 消息统计数据
 */
export interface MessageStats {
  totalMessages: number;
  byCategory: Record<MessageCategory, number>;
  byStatus: Record<MessageStatus, number>;
  byMedicalField: Record<string, number>;
  
  // 时间分布
  dailyAverage: number;
  weeklyTrend: number; // 周增长率
  
  // 互动统计
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSaves: number;
  
  // 质量统计
  verifiedCount: number;
  featuredCount: number;
  averageQualityScore: number;
  
  // 作者统计
  activeAuthors: number;
  topAuthors: Array<{
    authorId: string;
    authorName: string;
    messageCount: number;
    totalViews: number;
  }>;
}

/**
 * 类型守卫 - 检查是否为消息内容
 */
export function isMessageContent(content: any): content is MessageBase {
  // 简化实现：检查是否为对象且有category字段
  return content && typeof content === 'object' && 'category' in content;
}

/**
 * 获取分类显示名称
 */
export function getCategoryDisplayName(category: MessageCategory): string {
  const names: Record<MessageCategory, string> = {
    [MessageCategory.NEW_DRUG]: '新药信息',
    [MessageCategory.PROFESSIONAL_ARTICLE]: '专业文章',
    [MessageCategory.ANNOUNCEMENT]: '公告发布',
    [MessageCategory.SPECIAL_EFFECT]: '特效分享',
    [MessageCategory.LESSON_LEARNED]: '前车之鉴'
  };
  return names[category];
}

/**
 * 获取状态显示名称
 */
export function getStatusDisplayName(status: MessageStatus): string {
  const names: Record<MessageStatus, string> = {
    [MessageStatus.DRAFT]: '草稿',
    [MessageStatus.PUBLISHED]: '已发布',
    [MessageStatus.REVIEWING]: '审核中',
    [MessageStatus.CORRECTED]: '已修正',
    [MessageStatus.WITHDRAWN]: '已撤回',
    [MessageStatus.ARCHIVED]: '已归档'
  };
  return names[status];
}

/**
 * 创建新消息的默认数据
 */
export function createDefaultMessage(
  authorInfo: {
    id: string;
    name: string;
    role: string;
  },
  category: MessageCategory
): Omit<MessageBase, 'id' | 'createdAt'> {
  return {
    // 从 PublicContent 继承的字段
    title: '',
    content: '',
    summary: '',
    authorId: authorInfo.id,
    authorName: authorInfo.name,
    authorRole: authorInfo.role,
    tags: [],
    keywords: [],
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    isVerified: false,
    isFeatured: false,
    visibility: DataVisibility.PUBLIC,
    
    // 消息特定字段
    category,
    status: MessageStatus.DRAFT, // MessageStatus枚举
    version: 1,
    wechatShareCount: 0,
    saveCount: 0,
    reportCount: 0,
  };
}