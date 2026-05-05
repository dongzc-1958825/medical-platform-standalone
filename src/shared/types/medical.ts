// src/shared/types/medical.ts
export interface MedicalCase {
  id: string;
  title: string;
  content: string;
  summary?: string; // 摘要，用于列表展示
  
  // 作者信息
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorTitle?: string; // 职称
  authorRole?: 'doctor' | 'patient' | 'researcher' | 'student';
  hospital?: string;
  department?: string; // 科室
  
  // 医学信息
  patientAge?: number;
  patientGender?: 'male' | 'female' | 'other';
  diagnosis?: string; // 诊断
  treatment?: string; // 治疗方案
  outcome?: string; // 治疗效果
  followUp?: string; // 随访情况
  
  // 分类标签
  tags: string[];
  category?: string; // 主分类
  subCategory?: string; // 子分类
  
  // 多媒体
  images: string[];
  videos?: string[];
  documents?: string[]; // 相关文档
  
  // 互动数据
  likeCount: number;
  commentCount: number;
  collectCount: number;
  shareCount: number;
  viewCount: number;
  
  // 用户互动状态（需要在UI层处理）
  isLiked?: boolean;
  isCollected?: boolean;
  isFollowingAuthor?: boolean;
  
  // 元数据
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  
  // 状态
  status: 'draft' | 'published' | 'reviewing' | 'rejected' | 'archived';
  isAnonymous: boolean;
  isFeatured?: boolean; // 是否精选
  
  // 权限控制
  canEdit?: boolean;
  canDelete?: boolean;
  canComment?: boolean;
}

export interface CreateCaseRequest {
  title: string;
  content: string;
  tags: string[];
  images?: string[];
  isAnonymous?: boolean;
  category?: string;
  patientAge?: number;
  patientGender?: 'male' | 'female' | 'other';
  diagnosis?: string;
  treatment?: string;
}

export interface UpdateCaseRequest extends Partial<CreateCaseRequest> {
  id: string;
}

export interface CaseFilter {
  page?: number;
  limit?: number;
  category?: string;
  subCategory?: string;
  tags?: string[];
  authorId?: string;
  keyword?: string;
  sortBy?: 'latest' | 'popular' | 'featured';
  startDate?: string;
  endDate?: string;
}

export interface CaseListResponse {
  cases: MedicalCase[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 医案评论相关
export interface CaseComment {
  id: string;
  caseId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userTitle?: string;
  content: string;
  parentId?: string; // 回复的评论ID
  likeCount: number;
  isLiked?: boolean;
  createdAt: string;
  replies?: CaseComment[];
}

export interface CreateCommentRequest {
  caseId: string;
  content: string;
  parentId?: string;
}

// 医案收藏相关
export interface UserCollection {
  id: string;
  userId: string;
  caseId: string;
  case?: MedicalCase; // 关联的医案信息
  createdAt: string;
}