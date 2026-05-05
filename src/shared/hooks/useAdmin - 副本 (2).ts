import { useEffect, useState } from 'react';
import { adminService } from '../services/admin/adminService';
import { AdminUser } from '../types/admin';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = () => {
      const userStr = localStorage.getItem('current-user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      // 检查用户角色是否为管理员
      const isAdminByRole = user?.role === 'super_admin' || user?.role === 'admin';
      
      // 兼容旧的管理员列表
      const admins = JSON.parse(localStorage.getItem('medical_admins') || '[]');
      const isAdminByList = admins.some(a => a.userId === user?.id);
      
      const isAdminResult = isAdminByRole || isAdminByList;
      
      console.log('[useAdmin] 检查结果:', { 
        isAdmin: isAdminResult, 
        userRole: user?.role,
        userId: user?.id
      });
      
      setIsAdmin(isAdminResult);
      setAdminInfo(isAdminResult ? { userId: user?.id, role: 'super' } as any : null);
      setLoading(false);
    };

    checkAdmin();
    
    window.addEventListener('storage', checkAdmin);
    return () => window.removeEventListener('storage', checkAdmin);
  }, []);

  const hasPermission = (resource: string, action: string): boolean => {
    const userStr = localStorage.getItem('current-user');
    if (!userStr) return false;
    try {
      const user = JSON.parse(userStr);
      return user?.role === 'super_admin' || user?.role === 'admin';
    } catch {
      return false;
    }
  };

  return {
    isAdmin,
    adminInfo,
    loading,
    hasPermission
  };
};