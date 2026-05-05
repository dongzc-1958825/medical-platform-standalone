// src/shared/constants/index.ts
// 应用常量

// 医案状态
export const CASE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  REVIEWING: 'reviewing',
  REJECTED: 'rejected',
  ARCHIVED: 'archived',
} as const;

// 用户角色
export const USER_ROLES = {
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  RESEARCHER: 'researcher',
  STUDENT: 'student',
  OTHER: 'other',
} as const;

// 医案分类（示例）
export const MEDICAL_CATEGORIES = [
  { value: 'diabetes', label: '糖尿病', icon: '🩸' },
  { value: 'hypertension', label: '高血压', icon: '❤️' },
  { value: 'cardiovascular', label: '心血管疾病', icon: '🫀' },
  { value: 'respiratory', label: '呼吸系统疾病', icon: '🫁' },
  { value: 'digestive', label: '消化系统疾病', icon: '🧬' },
  { value: 'neurological', label: '神经系统疾病', icon: '🧠' },
  { value: 'orthopedic', label: '骨科疾病', icon: '🦴' },
  { value: 'dermatology', label: '皮肤科疾病', icon: '👨‍⚕️' },
  { value: 'pediatrics', label: '儿科疾病', icon: '👶' },
  { value: 'gynecology', label: '妇科疾病', icon: '👩' },
  { value: 'geriatrics', label: '老年病', icon: '👴' },
  { value: 'psychiatry', label: '精神心理', icon: '🧠' },
  { value: 'other', label: '其他', icon: '🏥' },
] as const;

// 热门标签（示例）
export const POPULAR_TAGS = [
  '糖尿病', '高血压', '冠心病', '脑卒中', '胃炎',
  '肺炎', '关节炎', '抑郁症', '癌症', '手术',
  '药物治疗', '饮食管理', '康复训练', '中医', '中西医结合',
  '病例讨论', '治疗心得', '医疗新技术'
];

// 分页设置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MOBILE_PAGE_SIZE: 8,
  DESKTOP_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
} as const;

// 图片上传限制
export const UPLOAD_LIMITS = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGES_PER_CASE: 6,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// 路由路径
export const ROUTE_PATHS = {
  HOME: '/',
  CASES: '/cases',
  CASE_DETAIL: '/cases/:id',
  CASE_NEW: '/cases/new',
  CASE_EDIT: '/cases/edit/:id',
  
  // 移动端
  MOBILE_HOME: '/mobile',
  MOBILE_CASES: '/mobile/cases',
  MOBILE_CASE_DETAIL: '/mobile/cases/detail/:id',
  MOBILE_CASE_NEW: '/mobile/cases/new',
  MOBILE_CASE_EDIT: '/mobile/cases/edit/:id',
  MOBILE_COMMUNITY: '/mobile/community',
  MOBILE_CONSULT: '/mobile/consult',
  MOBILE_MESSAGES: '/mobile/messages',
  MOBILE_PROFILE: '/mobile/profile',
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  CASE_DRAFT: 'case_draft',
  SEARCH_HISTORY: 'search_history',
  UI_SETTINGS: 'ui_settings',
} as const;