/**
 * 健康问卷类型定义
 * 基于WHO健康标准和五级健康评估系统
 */

// ==================== 枚举类型 ====================

/**
 * 健康评估等级
 */
export enum HealthAssessmentLevel {
  EXCELLENT = '优秀',
  GOOD = '良好',
  MODERATE = '中等',
  POOR = '较差',
  DANGER = '危险'
}

/**
 * 性别
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

/**
 * BMI分类
 */
export enum BMICategory {
  UNDERWEIGHT = '体重不足',
  NORMAL = '正常体重',
  OVERWEIGHT = '超重',
  OBESE = '肥胖'
}

/**
 * 慢性病类型
 */
export enum ChronicDisease {
  HYPERTENSION = '高血压',
  DIABETES = '糖尿病',
  CORONARY_HEART_DISEASE = '冠心病',
  STROKE = '脑卒中',
  COPD = '慢性阻塞性肺疾病',
  ASTHMA = '哮喘',
  ARTHRITIS = '关节炎',
  CANCER = '癌症',
  DEPRESSION = '抑郁症',
  OTHER = '其他'
}

/**
 * 症状类型
 */
export enum Symptom {
  HEADACHE = '头痛',
  DIZZINESS = '头晕',
  FATIGUE = '乏力',
  INSOMNIA = '失眠',
  PALPITATION = '心悸',
  CHEST_PAIN = '胸痛',
  ABDOMINAL_PAIN = '腹痛',
  NAUSEA = '恶心',
  VOMITING = '呕吐',
  DIARRHEA = '腹泻',
  CONSTIPATION = '便秘',
  BACK_PAIN = '背痛',
  JOINT_PAIN = '关节痛',
  MUSCLE_SORENESS = '肌肉酸痛',
  SKIN_RASH = '皮疹',
  COUGH = '咳嗽',
  EXPECTORATION = '咳痰',
  SHORTNESS_BREATH = '气短',
  OTHER = '其他'
}

/**
 * 睡眠质量
 */
export enum SleepQuality {
  VERY_GOOD = '很好',
  GOOD = '好',
  FAIR = '一般',
  POOR = '差',
  VERY_POOR = '很差'
}

/**
 * 运动频率
 */
export enum ExerciseFrequency {
  NEVER = '从不',
  OCCASIONALLY = '偶尔',
  WEEKLY_1_2 = '每周1-2次',
  WEEKLY_3_4 = '每周3-4次',
  DAILY = '每天'
}

/**
 * 吸烟状态
 */
export enum SmokingStatus {
  NEVER = '从不吸烟',
  QUIT = '已戒烟',
  OCCASIONAL = '偶尔吸烟',
  DAILY_LIGHT = '每天吸烟（≤10支）',
  DAILY_HEAVY = '每天吸烟（>10支）'
}

/**
 * 饮酒状态
 */
export enum DrinkingStatus {
  NEVER = '从不饮酒',
  QUIT = '已戒酒',
  OCCASIONAL = '偶尔饮酒',
  WEEKLY_LIGHT = '每周饮酒（≤3次）',
  WEEKLY_HEAVY = '每周饮酒（>3次）',
  DAILY = '每天饮酒'
}

/**
 * 压力水平
 */
export enum StressLevel {
  NONE = '无压力',
  MILD = '轻度压力',
  MODERATE = '中度压力',
  SEVERE = '重度压力',
  EXTREME = '极度压力'
}

/**
 * 焦虑频率
 */
export enum AnxietyFrequency {
  NEVER = '从不',
  RARELY = '很少',
  SOMETIMES = '有时',
  OFTEN = '经常',
  ALWAYS = '总是'
}

/**
 * 抑郁情绪
 */
export enum DepressionMood {
  NEVER = '从不',
  RARELY = '很少',
  SOMETIMES = '有时',
  OFTEN = '经常',
  ALWAYS = '总是'
}

/**
 * 社会支持程度
 */
export enum SocialSupportLevel {
  VERY_STRONG = '非常强',
  STRONG = '强',
  MODERATE = '一般',
  WEAK = '弱',
  VERY_WEAK = '非常弱'
}

/**
 * 家庭关系满意度
 */
export enum FamilyRelationshipSatisfaction {
  VERY_SATISFIED = '非常满意',
  SATISFIED = '满意',
  NEUTRAL = '一般',
  DISSATISFIED = '不满意',
  VERY_DISSATISFIED = '非常不满意'
}

/**
 * 工作压力
 */
export enum WorkStress {
  NONE = '无压力',
  MILD = '轻度压力',
  MODERATE = '中度压力',
  SEVERE = '重度压力',
  EXTREME = '极度压力'
}

/**
 * 社交频率
 */
export enum SocialFrequency {
  VERY_OFTEN = '非常频繁',
  OFTEN = '经常',
  SOMETIMES = '有时',
  RARELY = '很少',
  NEVER = '从不'
}

/**
 * 人际关系满意度
 */
export enum RelationshipSatisfaction {
  VERY_SATISFIED = '非常满意',
  SATISFIED = '满意',
  NEUTRAL = '一般',
  DISSATISFIED = '不满意',
  VERY_DISSATISFIED = '非常不满意'
}

/**
 * 饮食习惯
 */
export enum DietHabit {
  VERY_HEALTHY = '非常健康',
  HEALTHY = '健康',
  FAIR = '一般',
  UNHEALTHY = '不健康',
  VERY_UNHEALTHY = '非常不健康'
}

/**
 * 体检频率
 */
export enum CheckupFrequency {
  YEARLY = '每年1次',
  BIYEARLY = '每2年1次',
  REGULAR = '定期',
  IRREGULAR = '不定期',
  NEVER = '从未体检'
}

/**
 * 用药依从性
 */
export enum MedicationAdherence {
  ALWAYS = '总是遵医嘱',
  OFTEN = '经常遵医嘱',
  SOMETIMES = '有时遵医嘱',
  RARELY = '很少遵医嘱',
  NEVER = '从不遵医嘱'
}

/**
 * 健康知识了解程度
 */
export enum HealthKnowledgeLevel {
  VERY_GOOD = '非常了解',
  GOOD = '了解',
  FAIR = '一般',
  POOR = '不了解',
  VERY_POOR = '完全不了解'
}

/**
 * 预防措施
 */
export enum PreventiveMeasure {
  REGULAR_EXERCISE = '规律运动',
  BALANCED_DIET = '均衡饮食',
  ADEQUATE_SLEEP = '充足睡眠',
  STRESS_MANAGEMENT = '压力管理',
  SMOKING_CESSATION = '戒烟',
  ALCOHOL_LIMITATION = '限酒',
  REGULAR_CHECKUP = '定期体检',
  VACCINATION = '疫苗接种',
  WEIGHT_CONTROL = '体重控制',
  BLOOD_PRESSURE_MONITOR = '血压监测',
  BLOOD_SUGAR_MONITOR = '血糖监测',
  OTHER = '其他'
}

/**
 * 健康担忧
 */
export enum HealthConcern {
  CARDIOVASCULAR = '心血管疾病',
  DIABETES = '糖尿病',
  CANCER = '癌症',
  RESPIRATORY = '呼吸系统疾病',
  MENTAL_HEALTH = '心理健康',
  AGING = '衰老',
  WEIGHT = '体重问题',
  NONE = '无担忧',
  OTHER = '其他'
}

// ==================== 接口定义 ====================

/**
 * 问卷部分
 */
export interface QuestionnaireSection {
  id: string;
  title: string;
  description: string;
  order: number;
  questions: QuestionnaireQuestion[];
}

/**
 * 问卷问题
 */
export interface QuestionnaireQuestion {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'scale';
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    step?: number;
    pattern?: string;
  };
  description?: string;
  weight?: number;
  condition?: {
    dependsOn: string;
    value: any;
  };
}

/**
 * 成人健康问卷数据结构
 */
export interface AdultHealthQuestionnaire {
  id: string;
  userId: string;
  assessmentDate: string;
  sections: {
    sectionId: string;
    sectionTitle: string;
    answers: {
      questionId: string;
      questionText: string;
      answer: any;
    }[];
  }[];
}

/**
 * 各部分得分
 */
export interface SectionScores {
  basicInfo: {
    score: number;
    max: number;
    percentage: number;
  };
  physicalHealth: {
    score: number;
    max: number;
    percentage: number;
  };
  mentalHealth: {
    score: number;
    max: number;
    percentage: number;
  };
  socialAdaptation: {
    score: number;
    max: number;
    percentage: number;
  };
  healthBehavior: {
    score: number;
    max: number;
    percentage: number;
  };
  selfAssessment: {
    score: number;
    max: number;
    percentage: number;
  };
}

/**
 * 问卷结果
 */
export interface QuestionnaireResult {
  id: string;
  userId: string;
  assessmentDate: string;
  totalScore: number;
  healthLevel: HealthAssessmentLevel;
  sectionScores: SectionScores;
  recommendations: string[];
  bmi: number;
  bmiCategory: BMICategory;
  questionnaireData: AdultHealthQuestionnaire;
}

// ==================== 常量定义 ====================

/**
 * 健康等级阈值
 */
export const HEALTH_LEVEL_THRESHOLDS = {
  EXCELLENT: 85,
  GOOD: 70,
  MODERATE: 55,
  POOR: 40,
  DANGER: 0
} as const;

/**
 * BMI标准（中国标准）
 */
export const BMI_STANDARDS_CHINA = {
  UNDERWEIGHT: 18.5,
  NORMAL: 24,
  OVERWEIGHT: 28,
  OBESE: 28
} as const;

/**
 * 问卷总分
 */
export const QUESTIONNAIRE_TOTAL_SCORE = 100;

/**
 * 各部分满分分值
 */
export const SECTION_MAX_SCORES = {
  basicInfo: 10,
  physicalHealth: 30,
  mentalHealth: 20,
  socialAdaptation: 15,
  healthBehavior: 15,
  selfAssessment: 10
} as const;

/**
 * 健康等级颜色
 */
export const HEALTH_LEVEL_COLORS = {
  [HealthAssessmentLevel.EXCELLENT]: 'bg-green-100 text-green-700 border-green-200',
  [HealthAssessmentLevel.GOOD]: 'bg-blue-100 text-blue-700 border-blue-200',
  [HealthAssessmentLevel.MODERATE]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [HealthAssessmentLevel.POOR]: 'bg-orange-100 text-orange-700 border-orange-200',
  [HealthAssessmentLevel.DANGER]: 'bg-red-100 text-red-700 border-red-200'
} as const;

/**
 * BMI分类颜色
 */
export const BMI_CATEGORY_COLORS = {
  [BMICategory.UNDERWEIGHT]: 'text-blue-600',
  [BMICategory.NORMAL]: 'text-green-600',
  [BMICategory.OVERWEIGHT]: 'text-yellow-600',
  [BMICategory.OBESE]: 'text-red-600'
} as const;

/**
 * 健康指标单位
 */
export const HEALTH_METRIC_UNITS = {
  height: 'cm',
  weight: 'kg',
  waistline: 'cm',
  bmi: 'kg/m²',
  bloodPressure: 'mmHg',
  bloodSugar: 'mmol/L',
  heartRate: '次/分'
} as const;

// ✅ 移除重复导出！只保留一次导出