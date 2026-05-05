// ============================
// 健康问卷核心类型定义
// ============================

/**
 * 健康问卷答案接口
 */
export interface QuestionnaireAnswer {
  questionId: string;
  answer: string | number | string[];
  score?: number;
  comment?: string; // 用户可选填写的备注
}

/**
 * 健康问题接口
 */
export interface HealthQuestion {
  id: string;
  type: 'single' | 'multiple' | 'scale' | 'input' | 'textarea';
  question: string;
  description?: string; // 问题说明
  options?: {
    value: string | number;
    label: string;
    score: number;
    description?: string; // 选项说明
  }[];
  scale?: {
    min: number;
    max: number;
    step: number;
    labels?: {
      [key: number]: string;
    };
    scoreMapping?: {
      [key: number]: number;
    };
  };
  placeholder?: string; // 输入框占位符
  required: boolean;
  category: 'physical' | 'mental' | 'lifestyle' | 'medical' | 'social' | 'behavioral';
  validation?: {
    type?: 'number' | 'text' | 'email';
    min?: number;
    max?: number;
    pattern?: RegExp;
    errorMessage?: string;
  };
}

/**
 * 问卷部分接口
 */
export interface QuestionnaireSection {
  id: string;
  title: string;
  description?: string;
  questions: HealthQuestion[];
  scoringRules?: ScoringRule[];
}

/**
 * 综合健康问卷接口（扩展版）
 */
export interface ComprehensiveHealthQuestionnaire extends QuestionnaireSection {
  scoringRules: ScoringRule[];
}

/**
 * 评分规则接口
 */
export interface ScoringRule {
  questionId: string;
  type: 'single' | 'multiple' | 'scale' | 'composite';
  scoring: {
    [key: string]: number;
  };
  weight: number;
  category: 'physical' | 'mental' | 'social' | 'behavioral';
  formula?: (answers: QuestionnaireAnswer[]) => number; // 自定义计算公式
}

/**
 * 问卷结果接口
 */
export interface QuestionnaireResult {
  id: string;
  userId: string;
  completedAt: Date;
  sections: {
    [sectionId: string]: {
      score: number;
      maxScore: number;
      answers: QuestionnaireAnswer[];
      percentage: number; // 得分百分比
    };
  };
  totalScore: number;
  maxTotalScore: number;
  overallPercentage: number; // 总体得分百分比
  healthLevel: HealthLevel;
  healthInfo: HealthLevelInfo;
  recommendations: string[];
  warning: boolean;
  warningAreas: string[]; // 警告的具体领域
  improvementSuggestions: ImprovementSuggestion[];
  additionalData?: {
    bmi?: BMIAnalysis;
    riskFactors?: RiskFactor[];
    strengths?: string[];
  };
}

// ============================
// 健康等级定义
// ============================

/**
 * 五级健康等级
 */
export type HealthLevel = 
  | 'excellent'      // 优秀：85-100分
  | 'good'           // 良好：70-84分
  | 'moderate'       // 中等：55-69分
  | 'poor'           // 较差：40-54分
  | 'critical';      // 危险：<40分

/**
 * 健康等级详细信息
 */
export interface HealthLevelInfo {
  level: HealthLevel;
  name: string;
  scoreRange: [number, number];
  description: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  iconColor: string;
  recommendations: string[];
  actionRequired: boolean;
  urgency: 'low' | 'medium' | 'high';
}

/**
 * 五级健康标准常量
 */
export const HEALTH_LEVELS: Record<HealthLevel, HealthLevelInfo> = {
  excellent: {
    level: 'excellent',
    name: '健康优秀',
    scoreRange: [85, 100],
    description: '健康状况优秀，身体、心理、社会适应良好。各项指标均在理想范围，继续保持当前健康生活方式。',
    color: '#10B981', // 绿色
    textColor: 'text-green-800',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: '💚',
    iconColor: 'text-green-500',
    recommendations: [
      '继续保持良好的生活习惯和健康饮食',
      '维持规律的运动和充足的睡眠',
      '定期进行健康体检，预防为主',
      '保持积极乐观的心态和社交活动'
    ],
    actionRequired: false,
    urgency: 'low'
  },
  good: {
    level: 'good',
    name: '健康良好',
    scoreRange: [70, 84],
    description: '健康状况良好，部分方面有提升空间。整体状态不错，但某些生活习惯可进一步优化。',
    color: '#3B82F6', // 蓝色
    textColor: 'text-blue-800',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: '💙',
    iconColor: 'text-blue-500',
    recommendations: [
      '关注并改善发现的健康风险点',
      '加强健康知识学习和应用',
      '建立更规律的生活作息',
      '适当增加有氧运动频率'
    ],
    actionRequired: false,
    urgency: 'low'
  },
  moderate: {
    level: 'moderate',
    name: '健康中等',
    scoreRange: [55, 69],
    description: '健康状况一般，存在需要关注和改善的健康问题。建议进行针对性调整和干预。',
    color: '#F59E0B', // 黄色
    textColor: 'text-yellow-800',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: '💛',
    iconColor: 'text-yellow-500',
    recommendations: [
      '建议进行专业健康评估',
      '制定针对性的健康改善计划',
      '加强健康指标的监测和记录',
      '咨询医生或健康管理师'
    ],
    actionRequired: true,
    urgency: 'medium'
  },
  poor: {
    level: 'poor',
    name: '健康较差',
    scoreRange: [40, 54],
    description: '健康状况较差，存在明显的健康风险。建议及时就医咨询并进行系统管理。',
    color: '#F97316', // 橙色
    textColor: 'text-orange-800',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: '🧡',
    iconColor: 'text-orange-500',
    recommendations: [
      '立即预约全科医生进行全面评估',
      '进行必要的医疗检查和诊断',
      '遵医嘱制定并执行健康干预计划',
      '建立健康监测档案并定期复诊'
    ],
    actionRequired: true,
    urgency: 'high'
  },
  critical: {
    level: 'critical',
    name: '健康危险',
    scoreRange: [0, 39],
    description: '健康状况存在较高风险，需要立即关注和干预。请尽快就医并采取必要措施。',
    color: '#EF4444', // 红色
    textColor: 'text-red-800',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: '❤️',
    iconColor: 'text-red-500',
    recommendations: [
      '立即就医进行全面检查和评估',
      '启动健康紧急管理方案',
      '保持紧急联系人信息准确有效',
      '避免高风险活动和剧烈运动',
      '密切监测关键健康指标'
    ],
    actionRequired: true,
    urgency: 'high'
  }
} as const;

// ============================
// BMI相关类型
// ============================

/**
 * BMI分类
 */
export type BMICategory = 
  | 'underweight'   // 体重过轻
  | 'normal'        // 正常体重
  | 'overweight'    // 超重
  | 'obesity';      // 肥胖

/**
 * BMI分析结果
 */
export interface BMIAnalysis {
  value: number;
  category: BMICategory;
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: string;
  standardRange: {
    min: number;
    max: number;
  };
  color: string;
  icon: string;
}

/**
 * BMI标准（根据中国卫健委标准）
 */
export const BMI_STANDARDS = {
  underweight: { min: 0, max: 18.4, name: '体重过轻' },
  normal: { min: 18.5, max: 23.9, name: '正常体重' },
  overweight: { min: 24, max: 27.9, name: '超重' },
  obesity: { min: 28, max: 100, name: '肥胖' }
} as const;

// ============================
// 健康改善建议类型
// ============================

/**
 * 改善建议接口
 */
export interface ImprovementSuggestion {
  id: string;
  category: 'diet' | 'exercise' | 'sleep' | 'mental' | 'medical' | 'lifestyle';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actions: string[];
  resources?: {
    type: 'article' | 'video' | 'course' | 'tool';
    title: string;
    url: string;
  }[];
  timeline?: {
    shortTerm: string[];  // 短期目标（1-2周）
    mediumTerm: string[]; // 中期目标（1-3月）
    longTerm: string[];   // 长期目标（3-12月）
  };
}

/**
 * 风险因素
 */
export interface RiskFactor {
  id: string;
  name: string;
  category: 'lifestyle' | 'genetic' | 'environmental' | 'psychological';
  level: 'low' | 'medium' | 'high';
  description: string;
  recommendations: string[];
  references?: {
    source: string;
    url: string;
  }[];
}

// ============================
// 健康数据追踪类型
// ============================

/**
 * 健康指标记录
 */
export interface HealthMetricRecord {
  id: string;
  userId: string;
  type: HealthMetricType;
  value: number;
  unit: string;
  measuredAt: Date;
  source: 'manual' | 'device' | 'imported';
  deviceId?: string;
  notes?: string;
}

/**
 * 健康指标类型
 */
export type HealthMetricType = 
  | 'blood_pressure_systolic'  // 收缩压
  | 'blood_pressure_diastolic' // 舒张压
  | 'heart_rate'               // 心率
  | 'blood_glucose'            // 血糖
  | 'cholesterol_total'        // 总胆固醇
  | 'cholesterol_hdl'          // HDL胆固醇
  | 'cholesterol_ldl'          // LDL胆固醇
  | 'triglycerides'            // 甘油三酯
  | 'weight'                   // 体重
  | 'height'                   // 身高
  | 'bmi'                      // BMI
  | 'waist_circumference'      // 腰围
  | 'body_fat_percentage'      // 体脂率
  | 'steps'                    // 步数
  | 'sleep_duration'           // 睡眠时长
  | 'sleep_quality'            // 睡眠质量
  | 'stress_level';            // 压力水平

/**
 * 健康指标标准范围
 */
export interface HealthMetricStandard {
  type: HealthMetricType;
  name: string;
  unit: string;
  normalRange: {
    min: number;
    max: number;
  };
  optimalRange: {
    min: number;
    max: number;
  };
  criticalThresholds: {
    low: number;
    high: number;
  };
  description: string;
}

// ============================
// 健康预警系统类型
// ============================

/**
 * 健康预警
 */
export interface HealthAlert {
  id: string;
  userId: string;
  type: 'risk' | 'trend' | 'anomaly' | 'reminder';
  level: 'info' | 'warning' | 'danger';
  title: string;
  message: string;
  metricType?: HealthMetricType;
  currentValue?: number;
  expectedRange?: {
    min: number;
    max: number;
  };
  timestamp: Date;
  read: boolean;
  actionRequired: boolean;
  actions?: {
    label: string;
    type: 'consult' | 'measure' | 'medication' | 'lifestyle';
    url?: string;
  }[];
}

/**
 * 健康趋势
 */
export interface HealthTrend {
  metricType: HealthMetricType;
  period: 'day' | 'week' | 'month' | 'year';
  data: {
    date: Date;
    value: number;
  }[];
  trend: 'improving' | 'stable' | 'declining';
  confidence: number;
  insights: string[];
}

// ============================
// 健康目标类型
// ============================

/**
 * 健康目标
 */
export interface HealthGoal {
  id: string;
  userId: string;
  type: HealthGoalType;
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline?: Date;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  milestones: HealthGoalMilestone[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 健康目标类型
 */
export type HealthGoalType = 
  | 'weight_loss'
  | 'fitness_improvement'
  | 'blood_pressure_control'
  | 'blood_glucose_control'
  | 'cholesterol_improvement'
  | 'stress_reduction'
  | 'sleep_improvement'
  | 'habit_formation';

/**
 * 目标里程碑
 */
export interface HealthGoalMilestone {
  id: string;
  goalId: string;
  title: string;
  targetValue: number;
  achievedValue?: number;
  achievedAt?: Date;
  status: 'pending' | 'achieved' | 'missed';
}

// ============================
// 健康教育资源类型
// ============================

/**
 * 健康知识文章
 */
export interface HealthArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  category: HealthArticleCategory;
  tags: string[];
  readingTime: number; // 分钟
  publishedAt: Date;
  updatedAt: Date;
  viewCount: number;
  likeCount: number;
  featured: boolean;
  references?: {
    title: string;
    url: string;
  }[];
  relatedArticles?: string[]; // 相关文章ID
}

/**
 * 文章分类
 */
export type HealthArticleCategory = 
  | 'nutrition'      // 营养
  | 'exercise'       // 运动
  | 'mental_health'  // 心理健康
  | 'chronic_disease' // 慢性病
  | 'prevention'     // 疾病预防
  | 'lifestyle'      // 生活方式
  | 'aging'          // 老年健康
  | 'children_health' // 儿童健康
  | 'first_aid'      // 急救知识
  | 'traditional_medicine'; // 中医养生

// ============================
// 健康活动与事件类型
// ============================

/**
 * 健康活动
 */
export interface HealthActivity {
  id: string;
  userId: string;
  type: 'exercise' | 'meal' | 'medication' | 'measurement' | 'appointment';
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // 分钟
  data?: Record<string, any>;
  notes?: string;
  completed: boolean;
  createdAt: Date;
}

/**
 * 医疗预约
 */
export interface MedicalAppointment {
  id: string;
  userId: string;
  type: 'consultation' | 'checkup' | 'vaccination' | 'screening';
  doctorName: string;
  hospital: string;
  department: string;
  appointmentTime: Date;
  reason: string;
  preparation?: string[];
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  reminder?: {
    enabled: boolean;
    advanceTime: number; // 提前分钟数
    sent: boolean;
  };
}

// ============================
// 健康设备连接类型
// ============================

/**
 * 健康设备
 */
export interface HealthDevice {
  id: string;
  userId: string;
  name: string;
  type: HealthDeviceType;
  brand: string;
  model: string;
  macAddress?: string;
  lastSyncAt?: Date;
  batteryLevel?: number;
  connectionStatus: 'connected' | 'disconnected' | 'error';
  supportedMetrics: HealthMetricType[];
  syncFrequency: number; // 同步频率（分钟）
  settings?: Record<string, any>;
}

/**
 * 设备类型
 */
export type HealthDeviceType = 
  | 'smart_scale'      // 智能体重秤
  | 'blood_pressure_monitor' // 血压计
  | 'glucometer'       // 血糖仪
  | 'fitness_tracker'  // 运动手环
  | 'smart_watch'      // 智能手表
  | 'sleep_monitor'    // 睡眠监测仪
  | 'ecg_monitor'      // 心电图仪
  | 'oximeter'         // 血氧仪
  | 'thermometer';     // 体温计

// ============================
// 健康提醒类型
// ============================

/**
 * 健康提醒
 */
export interface HealthReminder {
  id: string;
  userId: string;
  type: HealthReminderType;
  title: string;
  message: string;
  schedule: ReminderSchedule;
  enabled: boolean;
  lastTriggered?: Date;
  nextTrigger?: Date;
  actions?: {
    label: string;
    type: 'confirm' | 'snooze' | 'skip';
  }[];
}

/**
 * 提醒类型
 */
export type HealthReminderType = 
  | 'medication'       // 用药提醒
  | 'measurement'      // 测量提醒
  | 'exercise'         // 运动提醒
  | 'hydration'        // 喝水提醒
  | 'meal'             // 用餐提醒
  | 'sleep'            // 睡眠提醒
  | 'appointment'      // 预约提醒
  | 'health_check'     // 健康检查提醒
  | 'posture'          // 姿势提醒
  | 'eye_rest';        // 眼保健操提醒

/**
 * 提醒计划
 */
export interface ReminderSchedule {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  timeOfDay?: string; // HH:mm
  daysOfWeek?: number[]; // 0-6，0=周日
  startDate: Date;
  endDate?: Date;
  interval?: number; // 间隔天数
}

// ============================
// 家庭健康管理类型
// ============================

/**
 * 家庭成员
 */
export interface FamilyMember {
  id: string;
  userId: string; // 关联的用户ID
  name: string;
  relationship: FamilyRelationship;
  age?: number;
  gender: 'male' | 'female';
  healthProfile?: {
    bloodType?: string;
    allergies?: string[];
    chronicConditions?: string[];
    medications?: string[];
    emergencyContact?: string;
  };
  avatarUrl?: string;
  sharingEnabled: boolean;
  createdAt: Date;
}

/**
 * 家庭关系
 */
export type FamilyRelationship = 
  | 'self'        // 本人
  | 'spouse'      // 配偶
  | 'child'       // 子女
  | 'parent'      // 父母
  | 'sibling'     // 兄弟姐妹
  | 'grandparent' // 祖父母
  | 'grandchild'  // 孙辈
  | 'other';      // 其他

// ============================
// 健康报告类型
// ============================

/**
 * 健康报告
 */
export interface HealthReport {
  id: string;
  userId: string;
  type: 'questionnaire' | 'checkup' | 'trend' | 'comprehensive';
  title: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  sections: HealthReportSection[];
  summary: string;
  recommendations: string[];
  nextSteps: string[];
  doctorNotes?: string;
  attachments?: {
    name: string;
    type: string;
    url: string;
  }[];
  shareable: boolean;
}

/**
 * 报告部分
 */
export interface HealthReportSection {
  id: string;
  title: string;
  type: 'metrics' | 'trends' | 'risks' | 'goals' | 'comparison';
  data: any;
  insights: string[];
  recommendations: string[];
}

// ============================
// 导出类型工具
// ============================

/**
 * 通用的健康响应类型
 */
export interface HealthResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
  timestamp: Date;
}

/**
 * 分页响应
 */
export interface PaginatedHealthResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ============================
// 常量定义
// ============================

/**
 * 健康问卷最大分数
 */
export const QUESTIONNAIRE_MAX_SCORE = 100;

/**
 * 健康预警等级颜色
 */
export const ALERT_LEVEL_COLORS = {
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: 'ℹ️'
  },
  warning: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: '⚠️'
  },
  danger: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: '🚨'
  }
} as const;

/**
 * 健康指标单位
 */
export const HEALTH_METRIC_UNITS: Record<HealthMetricType, string> = {
  blood_pressure_systolic: 'mmHg',
  blood_pressure_diastolic: 'mmHg',
  heart_rate: '次/分',
  blood_glucose: 'mmol/L',
  cholesterol_total: 'mmol/L',
  cholesterol_hdl: 'mmol/L',
  cholesterol_ldl: 'mmol/L',
  triglycerides: 'mmol/L',
  weight: 'kg',
  height: 'cm',
  bmi: 'kg/m²',
  waist_circumference: 'cm',
  body_fat_percentage: '%',
  steps: '步',
  sleep_duration: '小时',
  sleep_quality: '分',
  stress_level: '分'
};

/**
 * 默认的健康指标标准范围（中国标准）
 */
export const DEFAULT_HEALTH_METRIC_STANDARDS: HealthMetricStandard[] = [
  {
    type: 'blood_pressure_systolic',
    name: '收缩压',
    unit: 'mmHg',
    normalRange: { min: 90, max: 119 },
    optimalRange: { min: 100, max: 110 },
    criticalThresholds: { low: 90, high: 140 },
    description: '正常血压范围为90-119mmHg，高血压定义为≥140mmHg'
  },
  {
    type: 'blood_pressure_diastolic',
    name: '舒张压',
    unit: 'mmHg',
    normalRange: { min: 60, max: 79 },
    optimalRange: { min: 65, max: 75 },
    criticalThresholds: { low: 60, high: 90 },
    description: '正常血压范围为60-79mmHg，高血压定义为≥90mmHg'
  },
  {
    type: 'blood_glucose',
    name: '空腹血糖',
    unit: 'mmol/L',
    normalRange: { min: 3.9, max: 6.1 },
    optimalRange: { min: 4.4, max: 5.6 },
    criticalThresholds: { low: 3.9, high: 7.0 },
    description: '正常空腹血糖范围为3.9-6.1mmol/L，糖尿病前期≥6.1mmol/L'
  },
  {
    type: 'bmi',
    name: '身体质量指数',
    unit: 'kg/m²',
    normalRange: { min: 18.5, max: 23.9 },
    optimalRange: { min: 20, max: 22 },
    criticalThresholds: { low: 18.5, high: 24 },
    description: '正常BMI范围为18.5-23.9，超重≥24，肥胖≥28'
  }
];

// ============================
// 类型工具函数
// ============================

/**
 * 根据得分获取健康等级
 */
export function getHealthLevelByScore(score: number): HealthLevelInfo {
  if (score >= 85) return HEALTH_LEVELS.excellent;
  if (score >= 70) return HEALTH_LEVELS.good;
  if (score >= 55) return HEALTH_LEVELS.moderate;
  if (score >= 40) return HEALTH_LEVELS.poor;
  return HEALTH_LEVELS.critical;
}

/**
 * 根据BMI值获取BMI分析
 */
export function getBMIAnalysis(bmiValue: number): BMIAnalysis {
  let category: BMICategory = 'normal';
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  let recommendation = '';
  let color = '';
  let icon = '⚖️';

  if (bmiValue < 18.5) {
    category = 'underweight';
    riskLevel = 'medium';
    recommendation = '体重过轻，建议增加营养摄入，咨询营养师制定增重计划';
    color = '#F59E0B';
    icon = '📉';
  } else if (bmiValue >= 18.5 && bmiValue < 24) {
    category = 'normal';
    riskLevel = 'low';
    recommendation = '体重正常，请继续保持健康的饮食习惯和适量运动';
    color = '#10B981';
    icon = '✅';
  } else if (bmiValue >= 24 && bmiValue < 28) {
    category = 'overweight';
    riskLevel = 'medium';
    recommendation = '超重，建议控制饮食热量，增加有氧运动，每周减重0.5-1kg';
    color = '#F97316';
    icon = '⚠️';
  } else {
    category = 'obesity';
    riskLevel = 'high';
    recommendation = '肥胖，建议尽快咨询医生或营养师，制定科学的减重计划';
    color = '#EF4444';
    icon = '🚨';
  }

  return {
    value: parseFloat(bmiValue.toFixed(1)),
    category,
    riskLevel,
    recommendation,
    standardRange: {
      min: 18.5,
      max: 23.9
    },
    color,
    icon
  };
}

/**
 * 计算BMI
 */
export function calculateBMI(height: number, weight: number): number {
  if (!height || !weight || height <= 0 || weight <= 0) {
    return 0;
  }
  const heightM = height / 100;
  return weight / (heightM * heightM);
}

/**
 * 格式化健康指标值
 */
export function formatHealthMetric(
  type: HealthMetricType,
  value: number
): string {
  const unit = HEALTH_METRIC_UNITS[type] || '';
  return `${value} ${unit}`;
}

/**
 * 检查健康指标是否在正常范围内
 */
export function isMetricInNormalRange(
  type: HealthMetricType,
  value: number
): boolean {
  const standard = DEFAULT_HEALTH_METRIC_STANDARDS.find(s => s.type === type);
  if (!standard) return true;
  
  return value >= standard.normalRange.min && value <= standard.normalRange.max;
}

// ============================
// 导出所有类型
// ============================

export type {
  // 基础类型
  HealthQuestion,
  QuestionnaireSection,
  ComprehensiveHealthQuestionnaire,
  ScoringRule,
  QuestionnaireAnswer,
  QuestionnaireResult,
  
  // BMI相关
  BMICategory,
  BMIAnalysis,
  
  // 健康改善
  ImprovementSuggestion,
  RiskFactor,
  
  // 健康数据
  HealthMetricRecord,
  HealthMetricType,
  HealthMetricStandard,
  
  // 预警系统
  HealthAlert,
  HealthTrend,
  
  // 健康目标
  HealthGoal,
  HealthGoalType,
  HealthGoalMilestone,
  
  // 健康教育
  HealthArticle,
  HealthArticleCategory,
  
  // 健康活动
  HealthActivity,
  MedicalAppointment,
  
  // 健康设备
  HealthDevice,
  HealthDeviceType,
  
  // 健康提醒
  HealthReminder,
  HealthReminderType,
  ReminderSchedule,
  
  // 家庭健康
  FamilyMember,
  FamilyRelationship,
  
  // 健康报告
  HealthReport,
  HealthReportSection,
  
  // 响应类型
  HealthResponse,
  PaginatedHealthResponse
};

export {
  // 常量
  HEALTH_LEVELS,
  BMI_STANDARDS,
  QUESTIONNAIRE_MAX_SCORE,
  ALERT_LEVEL_COLORS,
  HEALTH_METRIC_UNITS,
  DEFAULT_HEALTH_METRIC_STANDARDS,
  
  // 工具函数
  getHealthLevelByScore,
  getBMIAnalysis,
  calculateBMI,
  formatHealthMetric,
  isMetricInNormalRange
};