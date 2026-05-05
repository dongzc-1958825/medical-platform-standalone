// src/shared/types/family.ts
export interface FamilyMember {
  id: string;
  name: string;                    // 姓名
  birthDate: string;                // 出生年月日
  gender: '男' | '女' | '其他';     // 性别
  relationship: '本人' | '配偶' | '子女' | '父母' | '其他';  // 亲属关系
  
  // 身体指标
  height?: number;                  // 身高(cm)
  weight?: number;                  // 体重(kg)
  bloodType?: 'A' | 'B' | 'AB' | 'O' | '其他';  // 血型
  
  // 健康档案
  allergies?: string[];             // 过敏史
  chronicDiseases?: string[];       // 慢性病史
  surgicalHistory?: string[];       // 手术史
  otherConditions?: string[];       // 其他情况
  notes?: string;                   // 备注
  
  avatar?: string;                  // 头像
  createdAt: string;                // 创建时间
  updatedAt?: string;               // 更新时间
}

export interface FamilyHealthRecord {
  id: string;
  memberId: string;
  memberName: string;
  recordType: '门诊' | '住院' | '检查' | '手术' | '急诊';
  recordDate: string;
  hospital: string;
  department?: string;
  doctor?: string;
  diagnosis: string;
  symptoms?: string[];
  treatment?: string;
  outcome?: string;
  notes?: string;
  
  // 附件
  attachments?: {
    fileName: string;
    fileType: string;
    fileSize: number;
    fileData: string;
  }[];
  
  createdAt: string;
}

export interface HealthReminder {
  id: string;
  memberId: string;
  memberName: string;
  title: string;
  description?: string;
  type: 'medication' | 'checkup' | 'vaccine' | 'other';
  dueDate: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  completed: boolean;
  createdAt: string;
}