// src/shared/types/case.ts
export interface MedicalCase {
  id: string;
  title: string;
  patientName: string;
  diagnosis: string;
  symptoms: string[];
  createdAt: string;
  tags: string[];
  description?: string;
  treatment?: string;
  outcome?: string;
  imageUrls?: string[];
  isFavorite?: boolean;
  // 新增字段
  userId?: string;           // 发布者ID
  likeCount?: number;        // 点赞数
  commentCount?: number;     // 评论数
  views?: number;            // 浏览次数
}

export interface CaseComment {
  id: string;
  caseId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  likes?: number;
}

export interface CaseFilter {
  keyword?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
}