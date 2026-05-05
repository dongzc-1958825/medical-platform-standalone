// src/shared/hooks/useAdmin.ts
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { adminService } from '../services/admin/adminService';
import { AdminUser } from '../types/admin';

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setAdminInfo(null);
      setLoading(false);
      return;
    }

    const checkAdmin = () => {
      const admin = adminService.getAdminByUserId(user.id);
      setIsAdmin(!!admin);
      setAdminInfo(admin || null);
      setLoading(false);
    };

    checkAdmin();
  }, [user]);

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    return adminService.hasPermission(user.id, resource, action);
  };

  return {
    isAdmin,
    adminInfo,
    loading,
    hasPermission
  };
};
