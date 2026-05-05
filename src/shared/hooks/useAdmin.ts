import { useEffect, useState } from 'react';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = () => {
      const userStr = localStorage.getItem('current-user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      // 直接根据用户角色判断是否为管理员
      const isAdminByRole = user?.role === 'super_admin' || user?.role === 'admin';
      
      console.log('[useAdmin] 当前用户:', user?.username);
      console.log('[useAdmin] 用户角色:', user?.role);
      console.log('[useAdmin] 是否是管理员(根据角色):', isAdminByRole);
      
      setIsAdmin(isAdminByRole);
      setAdminInfo(isAdminByRole ? { userId: user?.id, role: user?.role } : null);
      setLoading(false);
    };

    checkAdmin();
    
    window.addEventListener('storage', checkAdmin);
    return () => window.removeEventListener('storage', checkAdmin);
  }, []);

  const hasPermission = () => {
    const userStr = localStorage.getItem('current-user');
    const user = userStr ? JSON.parse(userStr) : null;
    return user?.role === 'super_admin' || user?.role === 'admin';
  };

  return {
    isAdmin,
    adminInfo,
    loading,
    hasPermission
  };
};
