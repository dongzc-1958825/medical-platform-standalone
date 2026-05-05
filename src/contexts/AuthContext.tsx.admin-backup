// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  avatar?: string;
  specialties?: string[];
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    role: "patient" | "doctor";
    specialties?: string[];
  }) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        
        // 关键：只恢复当前登录用户，不加载注册用户列表
        const currentUser = localStorage.getItem("medical-current-user");
        console.log("📦 current-user:", currentUser);
        
        if (currentUser) {
          const parsedUser = JSON.parse(currentUser);
          console.log("✅ 恢复当前用户:", parsedUser.email);
          setUser(parsedUser);
        } else {
          console.log("ℹ️ 没有保存的登录状态");
        }
      } catch (error) {
        console.error("❌ 加载用户信息失败:", error);
        localStorage.removeItem("medical-current-user");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("🔐 === LOGIN START ===");
      console.log("📧 登录邮箱:", email);
      console.log("🔑 密码:", password ? "已输入" : "未输入");

      await new Promise(resolve => setTimeout(resolve, 500));

      // 1. 首先检查注册用户数据库
      console.log("📊 检查注册用户数据库...");
      const registeredUsersJson = localStorage.getItem("medical-registered-users");
      const registeredUsers = registeredUsersJson ? JSON.parse(registeredUsersJson) : [];
      
      console.log(`📈 已注册用户数: ${registeredUsers.length}`);
      console.log("📋 注册用户列表:", registeredUsers.map((u: User) => u.email));
      
      // 添加MOCK_USERS到注册用户列表（如果不存在）
      MOCK_USERS.forEach(mockUser => {
        if (!registeredUsers.some((u: User) => u.email === mockUser.email)) {
          registeredUsers.push(mockUser);
        }
      });

      // 在注册用户中查找
      const foundRegisteredUser = registeredUsers.find((u: User) => u.email === email);
      
      if (foundRegisteredUser) {
        console.log("✅ 找到注册用户:", foundRegisteredUser.email);
        
        // 对于注册用户：接受任何非空密码
        if (password && password.trim() !== "") {
          console.log("✅ 密码验证通过");
          
          // 设为当前登录用户
          setUser(foundRegisteredUser);
          localStorage.setItem("medical-current-user", JSON.stringify(foundRegisteredUser));
          
          // 更新注册用户数据库（确保数据最新）
          const updatedUsers = registeredUsers.map((u: User) => 
            u.email === foundRegisteredUser.email ? foundRegisteredUser : u
          );
          localStorage.setItem("medical-registered-users", JSON.stringify(updatedUsers));
          
          console.log("🎉 登录成功");
          return { success: true };
        } else {
          console.log("❌ 密码为空");
          return { 
            success: false, 
            message: "密码不能为空"
          };
        }
      }

      console.log("❌ 未找到注册用户");
      console.log("🔍 搜索的邮箱:", email);
      
      return { 
        success: false, 
        message: "邮箱或密码错误，请先注册"
      };
      
    } catch (error) {
      console.error("💥 登录过程异常:", error);
      return { 
        success: false, 
        message: "登录失败，请检查网络连接"
      };
    } finally {
      setIsLoading(false);
      console.log("🔚 === LOGIN END ===");
    }
  };

  const logout = () => {
    console.log("🚪 === LOGOUT START ===");
    console.log("👤 退出用户:", user?.email);
    
    // 关键：只清理当前登录状态，保留注册信息
    setUser(null);
    localStorage.removeItem("medical-current-user");
    
    console.log("✅ 当前登录状态已清理");
    console.log("💾 注册用户数据库保留");
    console.log("📦 registered-users:", localStorage.getItem("medical-registered-users"));
    console.log("🔚 === LOGOUT END ===");
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    role: "patient" | "doctor";
    specialties?: string[];
  }) => {
    setIsLoading(true);
    try {
      console.log("🚀 === REGISTER START ===");
      console.log("📧 注册邮箱:", userData.email);
      
      await new Promise(resolve => setTimeout(resolve, 500));

      // 1. 获取当前注册用户列表
      const registeredUsersJson = localStorage.getItem("medical-registered-users");
      const registeredUsers = registeredUsersJson ? JSON.parse(registeredUsersJson) : [];
      
      console.log("📊 当前注册用户数:", registeredUsers.length);

      // 2. 检查邮箱是否已被注册
      const emailExists = registeredUsers.some((u: User) => u.email === userData.email);
      
      // 也检查MOCK_USERS
      const mockEmailExists = MOCK_USERS.some(u => u.email === userData.email);
      
      if (emailExists || mockEmailExists) {
        console.log("❌ 邮箱已被注册");
        return { success: false, message: "该邮箱已被注册" };
      }

      // 3. 创建新用户
      const newUser: User = {
        id: "user-" + Date.now(),
        username: userData.username,
        email: userData.email,
        role: userData.role,
        specialties: userData.specialties || [],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`
      };
      
      console.log("✅ 创建新用户:", newUser);

      // 4. 保存到注册用户数据库
      const updatedUsers = [...registeredUsers, newUser];
      localStorage.setItem("medical-registered-users", JSON.stringify(updatedUsers));
      console.log("💾 已保存到注册用户数据库");
      console.log("📈 更新后用户数:", updatedUsers.length);

      // 5. 同时设为当前登录用户
      setUser(newUser);
      localStorage.setItem("medical-current-user", JSON.stringify(newUser));
      console.log("👤 已设为当前登录用户");

      // 6. 验证保存
      const verifyRegistered = localStorage.getItem("medical-registered-users");
      const verifyCurrent = localStorage.getItem("medical-current-user");
      console.log("🔍 保存验证:");
      console.log("   registered-users:", verifyRegistered ? "✅ 成功" : "❌ 失败");
      console.log("   current-user:", verifyCurrent ? "✅ 成功" : "❌ 失败");

      console.log("🎉 === REGISTER SUCCESS ===");
      return { success: true };
      
    } catch (error) {
      console.error("💥 注册异常:", error);
      return { success: false, message: "注册失败，请稍后重试" };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("medical-current-user", JSON.stringify(updatedUser));
      
      // 同时更新注册用户数据库
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth必须在AuthProvider内部使用");
  }
  return context;
};

export { AuthContext };