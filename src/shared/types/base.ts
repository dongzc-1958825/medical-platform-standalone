// src/shared/types/base.ts
// 基础类型定义 - 被所有其他类型文件使用

/**
 * 可识别接口 - 所有实体都应该有ID
 */
export interface Identifiable {
  id: string;
}

/**
 * 时间戳接口 - 所有实体都应该有时间信息
 */
export interface Timestamped {
  createdAt: string;
  updatedAt?: string;
}

/**
 * 软删除接口
 */
export interface SoftDeletable {
  deletedAt?: string;
  isDeleted: boolean;
}

/**
 * 数据可见性枚举
 */
export enum DataVisibility {
  PUBLIC = 'public',
  PROTECTED = 'protected', // 需要登录
  PRIVATE = 'private',     // 仅自己可见
  SYSTEM = 'system'        // 系统内部
}

/**
 * 作者信息接口
 */
export interface AuthorInfo {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  credentials?: string;
  institution?: string;
}

/**
 * 分页查询参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 分页结果
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * 查询选项
 */
export interface QueryOptions extends Partial<PaginationParams> {
  filters?: Record<string, any>;
  search?: string;
  includeDeleted?: boolean;
}

/**
 * API响应
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

/**
 * 错误详情
 */
export interface ErrorDetail {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}
