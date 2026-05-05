// src/shared/types/consultation.ts

// ========== 新增：咨询版本接口 ==========
export interface ConsultationVersion {
  id: string;
  version: number;
  createdAt: string;
  createdBy: string;
  changes: string[];  // 修改说明
  data: Partial<Consultation>;  // 该版本的完整数据
}

export interface Reply {
  id: string;
  consultationId: string;
  content: string;
  author: string;
  authorId: string;
  identity?: string;      // 身份：专科医生、病友等
  contact?: string;       // 联系方式（可选）
  createdAt: string;
  likes: number;
  likedBy: string[];
  isProfessional?: boolean;
  isFollowUp?: boolean;    // 新增：是否是追问
  inReplyTo?: string;      // 新增：针对哪个回复的追问
}

export interface Consultation {
  id: string;
  symptoms: string;        // 主诉/主要症状（简洁版）
  description: string;     // 详细描述
  request: string;         // 主要诉求
  urgency: 'normal' | 'urgent' | 'critical';
  status: 'pending' | 'answered' | 'resolved';
  author: string;
  authorId: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
  replyCount: number;
  replies?: Reply[];
  isCollected?: boolean;
  medicalRecords?: string[];  // 诊疗记录ID数组
  hasMedicalRecords?: boolean; // 是否有诊疗记录

  // 新增字段（来自新表单）
  patientInfo?: PatientBasicInfo;
  symptomDetails?: SymptomDetail[];
  medicalHistory?: MedicalHistory;
  diagnosis?: DiagnosisInfo;
  treatment?: TreatmentInfo;
  course?: CourseInfo;
  efficacy?: EfficacyInfo;
  uploadedFiles?: UploadedFile[];
  completeness?: number;
  referenceLevel?: string;
  additionalInfo?: string;
  
  // ========== 新增：版本控制字段 ==========
  versions?: ConsultationVersion[];  // 版本历史
  currentVersion: number;  // 当前版本号
  editable: boolean;  // 是否可编辑（比如已回复的咨询可能锁定）
  lastEditedAt?: string;  // 最后编辑时间
  lastEditedBy?: string;  // 最后编辑者
}

// ========== 其他原有类型定义保持不变 ==========
export interface PatientBasicInfo {
  name?: string;
  age?: number;
  gender?: 'male' | 'female';
  height?: number;
  weight?: number;
  location?: string;
  occupation?: string;
  workEnvironment?: string;
}

export interface SymptomDetail {
  name: string;
  location?: string;
  characteristic?: string[];
  timing?: string;
  frequency?: string;
  duration?: string;
  aggravating?: string[];
  relieving?: string[];
  severity?: 1|2|3|4|5;
  description?: string;
}

export interface MedicalHistory {
  baselineDiseases?: string[];
  allergies?: {
    drug?: string[];
    food?: string[];
  };
  surgeries?: Array<{ name: string; year: string }>;
  familyHistory?: string[];
}

export interface HospitalDiagnosis {
  name: string;
  department: string;
  doctor?: string;
  diagnosis: string;
  date: string;
  basis?: string;
}

export interface DiagnosisInfo {
  hospitals?: HospitalDiagnosis[];
  finalDiagnosis?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  efficacy: '有效' | '无效' | '部分有效' | '不良反应';
}

export interface TreatmentRecord {
  hospital: string;
  doctor?: string;
  medications: Medication[];
  otherTreatment?: string;
  startDate: string;
  endDate?: string;
}

export interface TreatmentInfo {
  records?: TreatmentRecord[];
  currentTreatment?: string;
}

export interface CourseInfo {
  startDate?: string;
  endDate?: string;
  currentStatus?: '急性期' | '缓解期' | '康复期' | '慢性期';
}

export interface EfficacyInfo {
  overall?: '治愈' | '好转' | '无效' | '加重' | '反复';
  description?: string;
  lastEvaluation?: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadTime: string;
  category: 'labReport' | 'prescription' | 'dischargeSummary' | 'image' | 'other';
  description?: string;
}