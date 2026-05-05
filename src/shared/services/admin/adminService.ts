// src/shared/services/admin/adminService.ts
import { AdminUser, AdminRole, AdminPermission, AdminAuditLog, PendingContent, UserReport, SystemAnnouncement } from '../../types/admin';

class AdminService {
  private readonly ADMIN_STORAGE_KEY = 'medical_admins';
  private readonly PENDING_STORAGE_KEY = 'medical_pending_content';
  private readonly REPORTS_STORAGE_KEY = 'medical_reports';
  private readonly AUDIT_LOG_KEY = 'medical_audit_log';
  private readonly ANNOUNCEMENT_KEY = 'medical_system_announcements';

  constructor() {
    this.initAdminData();
  }

  /**
   * 初始化管理员数据
   */
  private initAdminData() {
    // 检查是否已有管理员
    const admins = this.getAllAdmins();
    if (admins.length === 0) {
      // 创建默认超级管理员
      this.createDefaultAdmin();
    }
  }

  /**
   * 创建默认超级管理员（仅用于初始化）
   */
  private createDefaultAdmin() {
    // 注意：这里不自动创建，需要在注册时通过特殊流程创建
    console.log('系统初始化：无管理员，请通过注册流程创建');
  }

  /**
   * 获取所有管理员
   */
  getAllAdmins(): AdminUser[] {
    try {
      const stored = localStorage.getItem(this.ADMIN_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('获取管理员列表失败:', error);
      return [];
    }
  }

  /**
   * 检查用户是否为管理员
   */
  isAdmin(userId: string): boolean {
    const admins = this.getAllAdmins();
    return admins.some(admin => admin.userId === userId);
  }

  /**
   * 获取管理员信息
   */
  getAdminByUserId(userId: string): AdminUser | null {
    const admins = this.getAllAdmins();
    return admins.find(admin => admin.userId === userId) || null;
  }

  /**
   * 检查权限
   */
  hasPermission(userId: string, resource: string, action: string): boolean {
    const admin = this.getAdminByUserId(userId);
    if (!admin) return false;

    // 超级管理员拥有所有权限
    if (admin.role === 'super') return true;

    // 检查具体权限
    return admin.permissions.some(p => 
      p.resource === resource && p.actions.includes(action)
    );
  }

  /**
   * 创建管理员（仅超级管理员可操作）
   */
  createAdmin(creatorId: string, newAdmin: Omit<AdminUser, 'id' | 'createdAt' | 'lastActive'>): AdminUser | null {
    // 检查创建者是否为超级管理员
    if (!this.hasPermission(creatorId, 'admin', 'create')) {
      console.error('无权创建管理员');
      return null;
    }

    const admins = this.getAllAdmins();
    
    // 检查用户是否已经是管理员
    if (admins.some(a => a.userId === newAdmin.userId)) {
      console.error('用户已经是管理员');
      return null;
    }

    const admin: AdminUser = {
      ...newAdmin,
      id: `admin_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    admins.push(admin);
    localStorage.setItem(this.ADMIN_STORAGE_KEY, JSON.stringify(admins));

    // 记录审计日志
    this.logAudit(creatorId, 'create_admin', 'admin', admin.id, `创建管理员: ${admin.userId}`);

    return admin;
  }

  /**
   * 更新管理员权限
   */
  updateAdmin(updaterId: string, adminId: string, updates: Partial<AdminUser>): AdminUser | null {
    if (!this.hasPermission(updaterId, 'admin', 'update')) {
      console.error('无权更新管理员');
      return null;
    }

    const admins = this.getAllAdmins();
    const index = admins.findIndex(a => a.id === adminId);
    if (index === -1) return null;

    const updatedAdmin = { ...admins[index], ...updates, lastActive: new Date().toISOString() };
    admins[index] = updatedAdmin;
    localStorage.setItem(this.ADMIN_STORAGE_KEY, JSON.stringify(admins));

    this.logAudit(updaterId, 'update_admin', 'admin', adminId, '更新管理员权限');

    return updatedAdmin;
  }

  /**
   * 删除管理员
   */
  deleteAdmin(deleterId: string, adminId: string): boolean {
    if (!this.hasPermission(deleterId, 'admin', 'delete')) {
      console.error('无权删除管理员');
      return false;
    }

    const admins = this.getAllAdmins();
    const filtered = admins.filter(a => a.id !== adminId);
    
    if (filtered.length === admins.length) return false;

    localStorage.setItem(this.ADMIN_STORAGE_KEY, JSON.stringify(filtered));
    this.logAudit(deleterId, 'delete_admin', 'admin', adminId, '删除管理员');

    return true;
  }

  /**
   * 获取待审核内容
   */
  getPendingContent(type?: PendingContent['type']): PendingContent[] {
    try {
      const stored = localStorage.getItem(this.PENDING_STORAGE_KEY);
      const all = stored ? JSON.parse(stored) : [];
      
      if (type) {
        return all.filter((item: PendingContent) => item.type === type && item.status === 'pending');
      }
      return all.filter((item: PendingContent) => item.status === 'pending');
    } catch (error) {
      console.error('获取待审核内容失败:', error);
      return [];
    }
  }

  /**
   * 审核内容
   */
  reviewContent(adminId: string, contentId: string, decision: 'approve' | 'reject', reason?: string): boolean {
    if (!this.hasPermission(adminId, 'content', 'approve')) {
      console.error('无权审核内容');
      return false;
    }

    try {
      const stored = localStorage.getItem(this.PENDING_STORAGE_KEY);
      if (!stored) return false;

      const contents = JSON.parse(stored);
      const index = contents.findIndex((c: PendingContent) => c.id === contentId);
      
      if (index === -1) return false;

      contents[index].status = decision === 'approve' ? 'approved' : 'rejected';
      localStorage.setItem(this.PENDING_STORAGE_KEY, JSON.stringify(contents));

      this.logAudit(adminId, decision === 'approve' ? 'approve_content' : 'reject_content', 'content', contentId, reason);

      return true;
    } catch (error) {
      console.error('审核失败:', error);
      return false;
    }
  }

  /**
   * 获取举报列表
   */
  getReports(status?: 'pending' | 'processed' | 'dismissed'): UserReport[] {
    try {
      const stored = localStorage.getItem(this.REPORTS_STORAGE_KEY);
      const all = stored ? JSON.parse(stored) : [];
      
      if (status) {
        return all.filter((r: UserReport) => r.status === status);
      }
      return all;
    } catch (error) {
      console.error('获取举报列表失败:', error);
      return [];
    }
  }

  /**
   * 处理举报
   */
  processReport(adminId: string, reportId: string, action: 'approve' | 'dismiss', result?: string): boolean {
    if (!this.hasPermission(adminId, 'report', 'process')) {
      console.error('无权处理举报');
      return false;
    }

    try {
      const stored = localStorage.getItem(this.REPORTS_STORAGE_KEY);
      if (!stored) return false;

      const reports = JSON.parse(stored);
      const index = reports.findIndex((r: UserReport) => r.id === reportId);
      
      if (index === -1) return false;

      reports[index].status = action === 'approve' ? 'processed' : 'dismissed';
      reports[index].processedAt = new Date().toISOString();
      reports[index].processedBy = adminId;
      reports[index].processResult = result;

      localStorage.setItem(this.REPORTS_STORAGE_KEY, JSON.stringify(reports));

      this.logAudit(adminId, 'process_report', 'report', reportId, result);

      return true;
    } catch (error) {
      console.error('处理举报失败:', error);
      return false;
    }
  }

  /**
   * 获取审计日志
   */
  getAuditLogs(limit: number = 100): AdminAuditLog[] {
    try {
      const stored = localStorage.getItem(this.AUDIT_LOG_KEY);
      const logs = stored ? JSON.parse(stored) : [];
      return logs.slice(0, limit);
    } catch (error) {
      console.error('获取审计日志失败:', error);
      return [];
    }
  }

  /**
   * 记录审计日志
   */
  private logAudit(adminId: string, action: string, targetType: string, targetId: string, reason?: string) {
    try {
      const logs = this.getAuditLogs(1000);
      
      // 获取管理员名称
      let adminName = '未知';
      const admins = this.getAllAdmins();
      const admin = admins.find(a => a.userId === adminId);
      
      const log: AdminAuditLog = {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        adminId,
        adminName: adminName,
        action,
        targetType,
        targetId,
        reason,
        createdAt: new Date().toISOString()
      };

      logs.unshift(log);
      localStorage.setItem(this.AUDIT_LOG_KEY, JSON.stringify(logs.slice(0, 1000)));
    } catch (error) {
      console.error('记录审计日志失败:', error);
    }
  }

  /**
   * 发布系统公告
   */
  publishAnnouncement(adminId: string, announcement: Omit<SystemAnnouncement, 'id' | 'createdAt' | 'createdBy'>): SystemAnnouncement | null {
    if (!this.hasPermission(adminId, 'announcement', 'create')) {
      console.error('无权发布公告');
      return null;
    }

    try {
      const stored = localStorage.getItem(this.ANNOUNCEMENT_KEY);
      const announcements = stored ? JSON.parse(stored) : [];

      const newAnnouncement: SystemAnnouncement = {
        ...announcement,
        id: `ann_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        createdAt: new Date().toISOString(),
        createdBy: adminId,
        isActive: true
      };

      announcements.push(newAnnouncement);
      localStorage.setItem(this.ANNOUNCEMENT_KEY, JSON.stringify(announcements));

      this.logAudit(adminId, 'create_announcement', 'announcement', newAnnouncement.id, announcement.title);

      return newAnnouncement;
    } catch (error) {
      console.error('发布公告失败:', error);
      return null;
    }
  }

  /**
   * 获取系统公告
   */
  getActiveAnnouncements(): SystemAnnouncement[] {
    try {
      const stored = localStorage.getItem(this.ANNOUNCEMENT_KEY);
      if (!stored) return [];

      const all = JSON.parse(stored);
      const now = new Date().toISOString();

      return all.filter((a: SystemAnnouncement) => 
        a.isActive && 
        (!a.expiresAt || a.expiresAt > now)
      );
    } catch (error) {
      console.error('获取公告失败:', error);
      return [];
    }
  }
}

export const adminService = new AdminService();
