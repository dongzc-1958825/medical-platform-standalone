// src/shared/types/health.ts - 修复版（只保留一个导出部分）

// ... 文件前面的所有定义保持不变 ...

// ============================
// 导出所有类型
// ============================

// 只保留这一个导出部分，删除其他重复的export语句
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

// 类型导出（单独导出）
export type {
  // 基础类型
  HealthQuestion,
  QuestionnaireSection,
  ComprehensiveHealthQuestionnaire,
  ScoringRule,
  QuestionnaireAnswer,
  QuestionnaireResult,
  HealthLevel,
  HealthLevelInfo,
  
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