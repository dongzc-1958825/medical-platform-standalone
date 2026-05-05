// src/shared/types/medicalRecord.ts
export interface MedicalRecord {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileData: string;
  thumbnail?: string;
  
  // 诊疗记录特有字段
  recordDate: string;           // 就诊日期
  hospital: string;             // 医院名称
  department?: string;          // 科室
  doctor?: string;              // 主治医生
  symptoms?: string[];          // 症状
  diagnosis: string;            // 诊断结果
  treatment?: string;           // 治疗方案
  outcome?: string;             // 治疗效果
  notes?: string;               // 备注
  
  uploadDate: string;
  recordType: '门诊' | '住院' | '检查' | '手术' | '急诊';
}