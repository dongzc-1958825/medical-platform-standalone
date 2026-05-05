// src/types/index.ts - 项目统一类型定义
// 修复编码问题，整理所有共享类型

// ==================== 用户相关类型 ====================

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
    password: string;
    joinTime: string;
    medicalCases: number;
    consultations: number;
    role: 'user' | 'doctor' | 'admin';
    isActive: boolean;
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

// ==================== 医案相关类型 ====================

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
  
  // 新增的医疗相关属性
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
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
  
  // 新增的属性
  name?: string;
  targetUser?: string;
}

// ==================== 认证相关类型 ====================

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

// ==================== 其他共享类型 ====================

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

// 医案过滤器类型
export interface CaseFilter {
  department?: string;
  hospital?: string;
  dateRange?: { start: string; end: string };
  tags?: string[];
  verifiedOnly?: boolean;
}

// 用户认证响应
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

// API响应包装
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页结果
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}