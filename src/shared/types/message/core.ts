// src/shared/types/message/core.ts
// 核心业务类型定义 - 为五大功能提供统一类型支持

import { MessageBase } from './base';

/**
 * 医疗帖子基类 - 用于医案分享功能
 */
export interface MedicalPost extends MessageBase {
  // 医案特定字段
  patientInfo?: {
    age?: number;
    gender?: 'male' | 'female' | 'other';
    medicalHistory?: string;
    allergies?: string[];
  };
  
  diagnosis?: string;
  treatmentPlan?: string;
  outcome?: string;
  
  // 医案分类
  caseType?: 'typical' | 'atypical' | 'complex' | 'rare';
  difficultyLevel?: 'easy' | 'medium' | 'hard' | 'expert';
  
  // 教学价值
  teachingPoints?: string[];
  medicalReferences?: string[]; // 医案专用引用（如PMID、DOI等）
}

/**
 * 消息帖子基类 - 用于消息功能
 */
export interface MessagePost extends MessageBase {
  // 消息特定字段
  urgencyLevel?: 'normal' | 'urgent' | 'emergency';
  requiresResponse?: boolean;
  responseDeadline?: string;
  
  // 互动增强
  isPinned?: boolean;
  isAnnouncement?: boolean;
  
  // 微信互通增强
  wechatPreviewImage?: string;
  wechatShareTitle?: string;
}

/**
 * 医疗案例帖子 - 用于病例展示
 */
export interface MedicalCasePost extends MedicalPost {
  // 案例特定字段
  caseImages?: string[];
  labResults?: string[];
  timeline?: Array<{
    date: string;
    event: string;
    description: string;
  }>;
  
  // 多学科协作
  involvedDepartments?: string[];
  teamMembers?: Array<{
    name: string;
    role: string;
    department: string;
  }>;
}

/**
 * 咨询帖子 - 用于寻医问药功能
 */
export interface ConsultationPost extends MessageBase {
  // 咨询特定字段
  questionType?: 'diagnosis' | 'treatment' | 'medication' | 'second-opinion' | 'other';
  symptoms?: string[];
  duration?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  
  // 咨询状态
  consultationStatus?: 'open' | 'answered' | 'closed' | 'escalated';
  preferredResponseType?: 'text' | 'voice' | 'video';
  
  // 隐私设置
  isAnonymous?: boolean;
  allowPublicDiscussion?: boolean;
}

/**
 * 社区帖子 - 用于专病社区功能
 */
export interface CommunityPost extends MessageBase {
  // 社区特定字段
  communityId: string;
  topicTags?: string[];
  
  // 互动增强
  pollQuestion?: string;
  pollOptions?: string[];
  pollResults?: Record<string, number>;
  
  // 社区管理
  isFeatured?: boolean;
  featuredReason?: string;
  featuredUntil?: string;
}

/**
 * 数据状态枚举
 */
export enum DataStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  PUBLISHED = 'published'
}

/**
 * 存储层级枚举
 */
export enum StorageTier {
  HOT = 'hot',        // 高频访问数据
  WARM = 'warm',      // 中频访问数据  
  COLD = 'cold',      // 低频访问数据
  ARCHIVE = 'archive' // 归档数据
}

/**
 * 作者角色枚举
 */
export enum AuthorRole {
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  PHARMACIST = 'pharmacist',
  MEDICAL_STUDENT = 'medical_student',
  PATIENT = 'patient',
  FAMILY_MEMBER = 'family_member',
  RESEARCHER = 'researcher',
  ADMIN = 'admin'
}

/**
 * 医疗数据统计
 */
export interface MedicalDataStats {
  totalPosts: number;
  postsByCategory: Record<string, number>;
  postsByStatus: Record<DataStatus, number>;
  postsByAuthorRole: Record<AuthorRole, number>;
  
  // 时间统计
  dailyAverage: number;
  monthlyGrowth: number;
  
  // 质量统计
  verifiedCount: number;
  featuredCount: number;
  averageQualityScore: number;
}

/**
 * 价值评估指标
 */
export interface ValueMetrics {
  clinicalValue: number;      // 临床价值 (0-100)
  educationalValue: number;   // 教学价值 (0-100)
  researchValue: number;      // 研究价值 (0-100)
  communityValue: number;     // 社区价值 (0-100)
  overallScore: number;       // 综合评分 (0-100)
  
  // 详细评估
  assessments: Array<{
    dimension: string;
    score: number;
    reason: string;
    assessedBy?: string;
    assessedAt: string;
  }>;
}

/**
 * 微信导入选项
 */
export interface WeChatImportOptions {
  preserveFormatting?: boolean;
  extractImages?: boolean;
  categorizeAutomatically?: boolean;
  assignTags?: string[];
  defaultCategory?: string;
  
  // 处理选项
  mergeStrategy?: 'create_new' | 'update_existing' | 'skip';
  notificationSettings?: {
    notifyAuthor: boolean;
    notifyFollowers: boolean;
    postToTimeline: boolean;
  };
}

/**
 * 创建帖子数据
 */
export interface CreatePostData {
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: AuthorRole;
  entityType: string;
  category?: string;
  
  // 可选字段
  summary?: string;
  tags?: string[];
  keywords?: string[];
  attachments?: Array<{
    name: string;
    type: string;
    url: string;
  }>;
  
  // 医疗特定
  medicalField?: string;
  evidenceLevel?: 'A' | 'B' | 'C' | 'D';
  
  // 微信相关
  wechatContent?: string;
  importOptions?: WeChatImportOptions;
}

/**
 * 更新帖子数据
 */
export interface UpdatePostData {
  title?: string;
  content?: string;
  summary?: string;
  tags?: string[];
  status?: DataStatus;
  
  // 医疗更新
  diagnosis?: string;
  treatmentPlan?: string;
  outcome?: string;
  
  // 元数据更新
  isVerified?: boolean;
  isFeatured?: boolean;
  featuredReason?: string;
  
  // 版本信息
  updateReason?: string;
  versionNotes?: string;
}


