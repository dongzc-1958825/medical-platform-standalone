// src/shared/types/personal/base.ts - 私有数据基类
import { Identifiable, Timestamped, DataVisibility } from '../base';

/**
 * 私有数据基类 - 用于"我的"功能
 * 健康管理、诊疗记录、体检报告、关键信息
 */
export interface PrivateData extends Identifiable, Timestamped {
  // 所有者
  ownerId: string;
  
  // 数据分类
  dataType: 'health' | 'medical_record' | 'examination' | 'critical_info' | 'collection';
  
  // 内容（根据类型不同）
  content: any;
  
  // 严格的隐私控制
  visibility: DataVisibility.PRIVATE | DataVisibility.ENCRYPTED;
  
  // 访问权限
  accessPermissions: {
    canView: string[];    // 可以查看的用户ID列表
    canEdit: string[];    // 可以编辑的用户ID列表
    emergencyAccess: string[]; // 紧急情况下可访问
  };
  
  // 加密信息（如果加密存储）
  encryptionInfo?: {
    algorithm: string;
    encryptedAt: string;
    keyId?: string;
  };
  
  // 数据敏感度
  sensitivityLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // 保留期限
  retentionPeriod?: number; // 保留天数
  autoDeleteDate?: string;  // 自动删除日期
}