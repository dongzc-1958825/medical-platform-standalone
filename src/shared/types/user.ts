// src/shared/types/user.ts
// 统一用户类型定义

export interface User {
  // 基本身份信息
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  username?: string;
  
  // 医疗专业信息
  isDoctor?: boolean;
  medicalLicense?: string;
  specialty?: string;
  
  // 个人资料
  avatar?: string;
  bio?: string;
  location?: string;
  
  // 时间戳
  createdAt?: string;
  updatedAt?: string;
  
  // 统计信息
  medicalCases?: number;
  consultations?: number;
  
  // 其他可能存在的属性
  [key: string]: any;
}

// 导出默认
export default User;
