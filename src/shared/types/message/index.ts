// src/shared/types/message/index.ts
// 消息类型统一导出入口 - 为五大功能提供完整类型支持

// ==================== 基础类型 ====================
export * from './base';

// ==================== 核心业务类型 ====================
export * from './core';

// ==================== 具体消息类型（五大分类） ====================
export * from './article';
export * from './announcement';
export * from './lesson';
export * from './new-drug';
export * from './special-effect';

// ==================== 重新导出关键类型（方便使用） ====================

// 从 base.ts 导出
export type { 
  MessageBase,
  MessageCategory,
  MessageStatus,
  MessageQueryOptions,
  MessageStats
} from './base';

// 从 core.ts 导出（五大功能支持）
export type {
  MedicalPost,          // 医案分享功能
  MessagePost,          // 消息功能  
  MedicalCasePost,      // 病例展示
  ConsultationPost,     // 寻医问药功能
  CommunityPost,        // 专病社区功能
  DataStatus,
  StorageTier,
  AuthorRole,
  MedicalDataStats,
  ValueMetrics,
  WeChatImportOptions,
  CreatePostData,
  UpdatePostData
} from './core';

// 从具体分类导出
export type { ArticleMessage } from './article';
export type { AnnouncementMessage } from './announcement';
export type { LessonMessage } from './lesson';
export type { NewDrugMessage } from './new-drug';
export type { SpecialEffectMessage } from './special-effect';
