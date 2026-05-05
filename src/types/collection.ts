// src/types/collection.ts
/**
 * 统一收藏类型定义
 * 用于整个平台的收藏系统
 */

// ==================== 基础类型 ====================

// 收藏模块类型
export type CollectionModule = 
  | 'message'      // 消息模块
  | 'medical_case' // 医案模块
  | 'qa'           // 问答模块
  | 'community'    // 社区模块
  | 'wechat'       // 微信模块
  | 'external';    // 外部内容

// 收藏状态类型
export type CollectionStatus = 
  | 'active'       // 活跃
  | 'archived'     // 归档
  | 'deleted';     // 软删除

// ==================== 核心接口 ====================

// 收藏项基础接口
export interface BaseCollectionItem {
  id: string;                   // 收藏项唯一ID
  title: string;                // 标题
  content?: string;            // 内容摘要
  excerpt?: string;            // 简短描述
  thumbnail?: string;          // 缩略图URL
  createdAt: string;           // 创建时间（ISO格式）
  updatedAt?: string;          // 更新时间
  isActive: boolean;           // 是否有效（软删除标志）
}

// 消息收藏项
export interface MessageCollectionItem extends BaseCollectionItem {
  module: 'message';           // 模块类型
  messageId: string;           // 消息ID
  sender?: string;             // 发送者
  messageType?: 'text' | 'image' | 'file' | 'system'; // 消息类型
  tags?: string[];             // 标签
}

// 医案收藏项
export interface MedicalCaseCollectionItem extends BaseCollectionItem {
  module: 'medical_case';      // 模块类型
  caseId: string;              // 医案ID
  patientAge?: number;         // 患者年龄
  patientGender?: string;      // 患者性别
  diagnosis?: string;          // 诊断
  treatment?: string;          // 治疗方案
  category?: string;           // 分类
}

// 问答收藏项
export interface QACollectionItem extends BaseCollectionItem {
  module: 'qa';                // 模块类型
  questionId: string;          // 问题ID
  answerId?: string;          // 回答ID
  questionContent: string;     // 问题内容
  answerContent?: string;      // 回答内容
  category?: string;          // 分类
  tags?: string[];            // 标签
}

// 社区收藏项
export interface CommunityCollectionItem extends BaseCollectionItem {
  module: 'community';         // 模块类型
  postId: string;              // 帖子ID
  author?: string;            // 作者
  likes?: number;             // 点赞数
  comments?: number;          // 评论数
  category?: string;          // 分类
}

// 微信收藏项
export interface WeChatCollectionItem extends BaseCollectionItem {
  module: 'wechat';           // 模块类型
  wechatId?: string;          // 微信内容ID
  source?: string;            // 来源（公众号/文章等）
  author?: string;            // 作者
  url?: string;              // 原文链接
  tags?: string[];           // 标签
}

// 外部内容收藏项
export interface ExternalCollectionItem extends BaseCollectionItem {
  module: 'external';         // 模块类型
  url: string;               // 外部链接
  source?: string;           // 来源网站
  author?: string;           // 作者
}

// ==================== 统一类型 ====================

// 统一收藏项类型（所有模块的联合类型）
export type UnifiedCollectionItem = 
  | MessageCollectionItem
  | MedicalCaseCollectionItem
  | QACollectionItem
  | CommunityCollectionItem
  | WeChatCollectionItem
  | ExternalCollectionItem;

// ==================== 工具类型 ====================

// 收藏搜索参数
export interface CollectionSearchParams {
  keyword?: string;           // 搜索关键词
  module?: CollectionModule;  // 按模块筛选
  dateRange?: [string, string]; // 日期范围 [开始, 结束]
  tags?: string[];           // 标签筛选
  status?: CollectionStatus;  // 状态筛选
  page?: number;             // 页码
  pageSize?: number;         // 每页数量
}

// 收藏统计信息
export interface CollectionStats {
  total: number;              // 总收藏数
  active: number;             // 活跃收藏数
  archived: number;           // 归档收藏数
  byModule: Record<string, number>; // 各模块数量
  recentCount: number;        // 最近7天新增
  lastUpdated: string;        // 最后更新时间
}

// 收藏按钮组件props
export interface CollectButtonProps {
  module: CollectionModule;   // 所属模块
  moduleItemId: string;       // 模块内项目ID
  itemType: string;          // 项目类型
  title: string;             // 标题
  content?: string;          // 内容
  excerpt?: string;          // 摘要
  thumbnail?: string;        // 缩略图
  tags?: string[];           // 标签
  metadata?: Record<string, any>; // 元数据
  initialCollected?: boolean; // 初始收藏状态
  size?: 'sm' | 'md' | 'lg'; // 按钮大小
  showCount?: boolean;       // 是否显示收藏数
  onToggle?: (collected: boolean) => void; // 切换回调
}

// ==================== 类型守卫 ====================

// 类型守卫函数
export function isMessageCollection(item: UnifiedCollectionItem): item is MessageCollectionItem {
  return item.module === 'message';
}

export function isMedicalCaseCollection(item: UnifiedCollectionItem): item is MedicalCaseCollectionItem {
  return item.module === 'medical_case';
}

export function isQACollection(item: UnifiedCollectionItem): item is QACollectionItem {
  return item.module === 'qa';
}

export function isCommunityCollection(item: UnifiedCollectionItem): item is CommunityCollectionItem {
  return item.module === 'community';
}

export function isWeChatCollection(item: UnifiedCollectionItem): item is WeChatCollectionItem {
  return item.module === 'wechat';
}

export function isExternalCollection(item: UnifiedCollectionItem): item is ExternalCollectionItem {
  return item.module === 'external';
}

// ==================== 模块配置 ====================

// 收藏模块配置
export interface CollectionModuleConfig {
  module: CollectionModule;   // 模块标识
  label: string;             // 显示名称
  icon: string;              // 图标
  color: string;             // 主题色
  description?: string;      // 描述
}

// 默认模块配置
export const DEFAULT_MODULE_CONFIG: Record<CollectionModule, CollectionModuleConfig> = {
  message: { 
    module: 'message', 
    label: '消息', 
    icon: '📨', 
    color: '#1890ff' 
  },
  medical_case: { 
    module: 'medical_case', 
    label: '医案', 
    icon: '📋', 
    color: '#52c41a' 
  },
  qa: { 
    module: 'qa', 
    label: '问答', 
    icon: '❓', 
    color: '#722ed1' 
  },
  community: { 
    module: 'community', 
    label: '社区', 
    icon: '👥', 
    color: '#fa8c16' 
  },
  wechat: { 
    module: 'wechat', 
    label: '微信', 
    icon: '💬', 
    color: '#13c2c2' 
  },
  external: { 
    module: 'external', 
    label: '外部内容', 
    icon: '🔗', 
    color: '#eb2f96' 
  }
};
