// src/shared/types/admin.ts

// 管理员角色定义
export type AdminRole = 'super' | 'community' | 'moderator';

// 管理员权限定义
export interface AdminPermission {
  resource: string;      // 资源类型: 'user', 'case', 'consult', 'community', 'announcement', 'forum', 'lecture', 'suggestion'
  actions: string[];     // 操作: 'create', 'read', 'update', 'delete', 'approve', 'reject', 'ban'
}

// 管理员用户扩展
export interface AdminUser {
  id: string;
  userId: string;        // 关联的用户ID
  role: AdminRole;
  permissions: AdminPermission[];
  communities?: string[]; // 管理的社区ID（社区管理员专用）
  createdAt: string;
  lastActive: string;
  createdBy?: string;    // 创建者ID
}

// 待审核内容
export interface PendingContent {
  id: string;
  type: 'case' | 'consult' | 'announcement' | 'forum' | 'lecture' | 'suggestion';
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reportReason?: string;
  reportedBy?: string[];
  reportCount?: number;
}

// 审计日志
export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  targetTitle?: string;
  reason?: string;
  createdAt: string;
  ipAddress?: string;
}

// 用户举报
export interface UserReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'user' | 'case' | 'consult' | 'announcement' | 'forum' | 'lecture' | 'suggestion' | 'comment';
  targetId: string;
  targetTitle?: string;
  reason: string;
  details?: string;
  status: 'pending' | 'processed' | 'dismissed';
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
  processResult?: string;
}

// 系统公告
export interface SystemAnnouncement {
  id: string;
  title: string;
  content: string;
  level: 'info' | 'warning' | 'important';
  targetUsers?: 'all' | 'doctors' | 'patients' | 'admins';
  createdAt: string;
  createdBy: string;
  expiresAt?: string;
  isActive: boolean;
}
