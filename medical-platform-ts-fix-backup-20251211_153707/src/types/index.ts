// src/types/index.ts（完整更新版）
export interface User {
  id: string;
  name?: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  medicalHistory?: string;
  allergies?: string[];
  createdAt: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  icon: string;
  color: string;
}

export interface HealthRecord {
  id: string;
  title: string;
  date: string;
  type: 'examination' | 'treatment' | 'surgery' | 'medication';
  description: string;
  hospital?: string;
  doctor?: string;
}

// ================ 更新后的类型定义 ================

export interface MedicalCase {
  id: string;
  title: string;
  content: string;
  author: string;
  department: string;
  hospital: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  viewCount: number;
  favoriteCount: number;
  commentCount: number;
  isCollected: boolean;
  images?: string[];
  
  // 新增的医疗相关属性（基于错误信息）
  patientName?: string;
  patientGender?: string;
  patientAge?: number;
  patientIdCard?: string;
  visitTime?: string;
  underlyingDiseases?: string[];
  drugAllergies?: string[];
  isVerified?: boolean;
  disease?: string;
  symptoms?: string[];
  treatment?: string;
  medication?: string[];
  doctor?: string;
  outcome?: string;
  likes?: number;
  collects?: number;
  comments?: Comment[]; // 内嵌评论
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
  
  // 新增的属性（基于错误信息）
  name?: string; // author可能有name属性
  targetUser?: string; // 回复的目标用户
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
  verificationCode?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// 其他可能需要的类型
export interface Disease {
  id: string;
  name: string;
  description: string;
  caseCount: number;
  tags: string[];
}

export interface HelpGroup {
  id: string;
  title: string;
  questions: HelpQuestion[];
}

export interface HelpQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// 新增：案例过滤器类型
export interface CaseFilter {
  department?: string;
  hospital?: string;
  dateRange?: { start: string; end: string };
  tags?: string[];
  verifiedOnly?: boolean;
}

// 新增：用户认证响应
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

// 新增：API响应包装
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 新增：分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 新增：分页结果
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}