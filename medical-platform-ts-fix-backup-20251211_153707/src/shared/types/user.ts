// src/shared/types/user.ts
export interface User {
  id: string;
  email: string;
  phone?: string;
  
  // 基本信息
  name: string;
  avatar?: string;
  bio?: string;
  
  // 医疗专业信息
  role: 'doctor' | 'patient' | 'researcher' | 'student' | 'other';
  title?: string; // 职称
  hospital?: string;
  department?: string; // 科室
  specialties?: string[]; // 专业领域
  qualification?: string; // 资质证书
  yearsOfExperience?: number;
  
  // 社交信息
  followersCount: number;
  followingCount: number;
  casesCount: number;
  contributions?: number; // 贡献度评分
  
  // 状态
  isVerified: boolean;
  isActive: boolean;
  
  // 时间戳
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  
  // 设置
  settings?: UserSettings;
}

export interface UserSettings {
  // 通知设置
  notifications: {
    email: boolean;
    push: boolean;
    comments: boolean;
    likes: boolean;
    collections: boolean;
  };
  
  // 隐私设置
  privacy: {
    showRealName: boolean;
    showContactInfo: boolean;
    allowPrivateMessages: boolean;
    showOnlineStatus: boolean;
  };
  
  // 显示设置
  display: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
    language: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: User['role'];
  title?: string;
  hospital?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
  bio?: string;
  title?: string;
  hospital?: string;
  department?: string;
  specialties?: string[];
  qualification?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}