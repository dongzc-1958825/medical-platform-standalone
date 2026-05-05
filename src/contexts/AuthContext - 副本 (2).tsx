// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  username: string;      // 真实姓名
  idCard?: string;        // 身份证号
  email: string;
  phone?: string;         // 手机号
  role: "patient" | "doctor" | "admin";
  avatar?: string;
  specialties?: string[];
  remark?: string;        // 备注
  createdAt?: string;     // 注册时间
  updatedAt?: string;     // 更新时间
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => void;
  register: (userData: {
    username: string;
    idCard?: string;
    email: string;
    phone?: string;
    password: string;
    remark?: string;
    role: "patient" | "doctor";
    specialties?: string[];
  }) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (userData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// MOCK_USERS作为初始注册用户
const MOCK_USERS = [
  {
    id: "1",
    username: "测试用户",
    email: "test@example.com",
    role: "patient" as const,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=test"
  },
  {
    id: "2",
    username: "张医生",
    email: "doctor@example.com",
    role: "doctor" as const,
    specialties: ["内科", "中医"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor"
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化：加载当前登录用户
  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log("🔄 AuthContext - 初始化，尝试恢复登录状态");

        const currentUser = localStorage.getItem("current-user");
        console.log("📦 current-user:", currentUser);

        if (currentUser) {
          const parsedUser = JSON.parse(currentUser);
          console.log("✅ 恢复当前用户:", parsedUser.username);
          setUser(parsedUser);
        } else {
          console.log("ℹ️ 没有保存的登录状态");
        }
      } catch (error) {
        console.error("❌ 加载用户信息失败:", error);
        localStorage.removeItem("current-user");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log("🔐 === LOGIN START ===");
      console.log("👤 登录姓名:", username);
      console.log("🔑 登录密码:", password);

      await new Promise(resolve => setTimeout(resolve, 800));

      // 1. 获取注册用户列表
      const registeredUsersJson = localStorage.getItem("medical-registered-users");
      const registeredUsers = registeredUsersJson ? JSON.parse(registeredUsersJson) : [];

      console.log(`📈 已注册用户数: ${registeredUsers.length}`);

      // 2. 按姓名查找用户
      const foundUser = registeredUsers.find((u: User) => u.username === username || u.email === username);
      
      // 如果在注册用户中没找到，检查MOCK_USERS
      const mockUser = !foundUser ? MOCK_USERS.find(u => u.username === username) : null;
      
      const userToLogin = foundUser || mockUser;

      if (userToLogin) {
        
          // 设置超级管理员角色
          if (userToLogin.email === 'admin@medical.com' || userToLogin.email === 'dongzc@263.net') {
            userToLogin.role = 'super_admin';
            console.log('👑 设置超级管理员角色');
          }
        console.log("📧 用户邮箱:", userToLogin.email);
        
        // 3. 获取存储的密码（用邮箱作为key）
        const storedPassword = localStorage.getItem(`password_${userToLogin.email}`);
        console.log("🔑 存储的密码:", storedPassword);
        console.log("🔑 存储的密码长度:", storedPassword?.length);
        console.log("🔑 输入的密码长度:", password.length);
        
        // 4. 验证密码
        // 对于MOCK_USERS，使用默认密码 '123456'
        if (mockUser) {
          if (password === '123456') {
            console.log("✅ 默认密码验证通过");
            setUser(userToLogin);
                    
        // 检查并设置管理员权限
        const admins = JSON.parse(localStorage.getItem('medical_admins') || '[]');
        if (!admins.some(a => a.userId === userToLogin.id)) {
          // 检查是否是管理员邮箱
          const adminEmails = ['admin@medical.com', 'super@medical.com', 'dongzc@263.net'];
          if (adminEmails.includes(userToLogin.email) || userToLogin.role === 'admin') {
            admins.push({
              id: `admin_${Date.now()}`,
              userId: userToLogin.id,
              role: 'super',
              permissions: [],
              createdAt: new Date().toISOString(),
              lastActive: new Date().toISOString()
            });
            localStorage.setItem('medical_admins', JSON.stringify(admins));
            console.log('✅ 已设置管理员权限');
          }
        }
            return { success: true, user: userToLogin };
          } else {
            console.log("❌ 默认密码错误");
            return { success: false, message: "密码错误" };
          }
        }
        
        // 对于注册用户，验证存储的密码
        if (storedPassword === password) {
          console.log("✅ 密码验证通过");
          setUser(userToLogin);
                  
        // 检查并设置管理员权限
        const admins = JSON.parse(localStorage.getItem('medical_admins') || '[]');
        if (!admins.some(a => a.userId === userToLogin.id)) {
          // 检查是否是管理员邮箱
          const adminEmails = ['admin@medical.com', 'super@medical.com', 'dongzc@263.net'];
          if (adminEmails.includes(userToLogin.email) || userToLogin.role === 'admin') {
            admins.push({
              id: `admin_${Date.now()}`,
              userId: userToLogin.id,
              role: 'super',
              permissions: [],
              createdAt: new Date().toISOString(),
              lastActive: new Date().toISOString()
            });
            localStorage.setItem('medical_admins', JSON.stringify(admins));
            console.log('✅ 已设置管理员权限');
          }
        }
          return { success: true, user: userToLogin };
        } else {
          console.log("❌ 密码错误 - 存储的密码与输入不匹配");
          console.log("   存储的密码:", storedPassword);
          console.log("   输入的密码:", password);
          return { success: false, message: "密码错误" };
        }
      }

      console.log("❌ 用户不存在");
      return { success: false, message: "用户不存在" };
    } catch (error) {
      console.error("❌ 登录失败:", error);
      return { success: false, message: "登录失败，请重试" };
    }
  };

    const logout = () => {
    console.log("🚪 === LOGOUT START ===");
    console.log("👤 退出用户:", user?.username);
    setUser(null);
    localStorage.removeItem("current-user");
    console.log("✅ 当前登录状态已清理");
    // 跳转到登录页
    window.location.hash = '#/login';
  };

  const register = async (userData: {
    username: string;
    idCard?: string;
    email: string;
    phone?: string;
    password: string;
    remark?: string;
    role: "patient" | "doctor";
    specialties?: string[];
  }) => {
    try {
      console.log("🚀 === REGISTER START ===");
      console.log("📧 注册邮箱:", userData.email);
      console.log("👤 注册姓名:", userData.username);
      console.log("🔑 注册密码:", userData.password);

      await new Promise(resolve => setTimeout(resolve, 500));
      const ADMIN_EMAILS = ['admin@medical.com', 'super@medical.com', 'dongzc@263.net'];
      const registeredUsersJson = localStorage.getItem("medical-registered-users");
      const registeredUsers = registeredUsersJson ? JSON.parse(registeredUsersJson) : [];

      console.log("📊 当前注册用户数:", registeredUsers.length);
      console.log("📋 现有用户邮箱:", registeredUsers.map((u: User) => u.email));

      // 检查邮箱是否已被注册
      const existingUser = registeredUsers.find((u: User) => u.email === userData.email);
      const mockUser = MOCK_USERS.find(u => u.email === userData.email);

      if (existingUser) {
        console.log("📧 邮箱已存在，用户信息:", existingUser);
        
        // ✅ 重要：始终允许用户更新信息，不检查信息完整性
        console.log('📝 允许用户更新信息，更新密码');
        
        const updatedUser: User = {
          ...existingUser,
          username: userData.username || existingUser.username,
          idCard: userData.idCard || existingUser.idCard,
          phone: userData.phone || existingUser.phone,
          remark: userData.remark || existingUser.remark,
          specialties: userData.specialties || existingUser.specialties || [],
          avatar: existingUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
          updatedAt: new Date().toISOString()
        };

        console.log("✅ 更新用户信息:", updatedUser);

        const updatedUsers = registeredUsers.map((u: User) =>
          u.email === userData.email ? updatedUser : u
        );
        localStorage.setItem("medical-registered-users", JSON.stringify(updatedUsers));
        
        // ✅ 关键：无论信息是否完整，都更新密码！
        localStorage.setItem(`password_${userData.email}`, userData.password);
        console.log("🔑 密码已更新为新密码:", userData.password);
        
        // 验证密码是否保存成功
        const savedPassword = localStorage.getItem(`password_${userData.email}`);
        console.log("✅ 验证保存的密码:", savedPassword);
        
        setUser(updatedUser);
        localStorage.setItem("current-user", JSON.stringify(updatedUser));
        
        console.log("🎉 用户信息更新成功，新密码已保存");
        return { success: true, message: "信息更新成功" };
      }

      if (mockUser) {
        console.log("❌ 邮箱是测试账号");
        return { success: false, message: "该邮箱是测试账号，请使用其他邮箱" };
      }

      // 创建新用户

      const isAdminEmail = ADMIN_EMAILS.includes(userData.email) || 
                           userData.email.endsWith('@admin.medical');

      const newUser: User = {
        id: "user-" + Date.now(),
        username: userData.username,
        idCard: userData.idCard || '',
        email: userData.email,
        phone: userData.phone || '',
        role: isAdminEmail ? 'admin' : userData.role,
        specialties: userData.specialties || [],
        remark: userData.remark || '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
        createdAt: new Date().toISOString()
      };

      if (isAdminEmail) {
        console.log('👑 管理员账号创建成功:', userData.email);
      }

      console.log("✅ 创建新用户:", newUser);

      const updatedUsers = [...registeredUsers, newUser];
      localStorage.setItem("medical-registered-users", JSON.stringify(updatedUsers));
      
      // 保存密码
      localStorage.setItem(`password_${userData.email}`, userData.password);
      console.log("🔑 新用户密码已保存:", userData.password);
      
      // 验证密码是否保存成功
      const savedPassword = localStorage.getItem(`password_${userData.email}`);
      console.log("✅ 验证保存的密码:", savedPassword);
      
      setUser(newUser);
      localStorage.setItem("current-user", JSON.stringify(newUser));

      console.log("🎉 === REGISTER SUCCESS ===");
      return { success: true };
    } catch (error) {
      console.error("❌ 注册失败:", error);
      return { success: false, message: "注册失败，请重试" };
    }
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData, updatedAt: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem("current-user", JSON.stringify(updatedUser));

      const registeredUsersJson = localStorage.getItem("medical-registered-users");
      if (registeredUsersJson) {
        const registeredUsers = JSON.parse(registeredUsersJson);
        const updatedUsers = registeredUsers.map((u: User) =>
          u.email === updatedUser.email ? updatedUser : u
        );
        localStorage.setItem("medical-registered-users", JSON.stringify(updatedUsers));
      }
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    register,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



