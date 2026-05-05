// src/shared/types/message/lesson.ts
import { MessageBase, MessageCategory } from './base';

/**
 * 教训类型 - 医疗错误和经验的分类
 */
export enum LessonType {
  MEDICATION_ERROR = 'medication_error',          // 用药错误：剂量、用法、选药错误
  DIAGNOSTIC_ERROR = 'diagnostic_error',         // 诊断错误：误诊、漏诊、延迟诊断
  TREATMENT_ERROR = 'treatment_error',           // 治疗错误：手术、操作、治疗方案错误
  COMMUNICATION_ERROR = 'communication_error',    // 沟通错误：医患、医护、科室间沟通
  EQUIPMENT_FAILURE = 'equipment_failure',       // 设备故障：医疗设备问题
  DOCUMENTATION_ERROR = 'documentation_error',    // 记录错误：病历、处方、报告错误
  INFECTION_CONTROL = 'infection_control',       // 感染控制：消毒、隔离、预防问题
  FALL_ACCIDENT = 'fall_accident',               // 跌倒意外：患者安全事件
  MEDICATION_ADVERSE = 'medication_adverse',     // 药物不良反应：预期外反应
  SYSTEM_FAILURE = 'system_failure'              // 系统问题：流程、制度、管理问题
}

/**
 * 事件严重程度
 */
export enum IncidentSeverity {
  NEAR_MISS = 'near_miss',        // 未遂事件：发现及时未造成伤害
  NO_HARM = 'no_harm',            // 无伤害：发生错误但未造成伤害
  MINOR_HARM = 'minor_harm',      // 轻度伤害：轻微、短暂伤害
  MODERATE_HARM = 'moderate_harm', // 中度伤害：需要治疗干预
  MAJOR_HARM = 'major_harm',      // 重度伤害：永久性伤害
  DEATH = 'death'                 // 死亡
}

/**
 * 发生环节
 */
export enum OccurrenceStage {
  OUTPATIENT = 'outpatient',          // 门诊
  EMERGENCY = 'emergency',            // 急诊
  INPATIENT = 'inpatient',            // 住院
  OPERATING_ROOM = 'operating_room',  // 手术室
  ICU = 'icu',                        // 重症监护室
  PHARMACY = 'pharmacy',              // 药房
  LABORATORY = 'laboratory',          // 检验科
  IMAGING = 'imaging',                // 影像科
  COMMUNITY = 'community',            // 社区医疗
  HOME_CARE = 'home_care'             // 家庭护理
}

/**
 * 参与人员角色
 */
export enum InvolvedRole {
  DOCTOR = 'doctor',                  // 医生
  NURSE = 'nurse',                    // 护士
  PHARMACIST = 'pharmacist',          // 药师
  PATIENT = 'patient',                // 患者
  FAMILY = 'family',                  // 家属
  ADMINISTRATOR = 'administrator',    // 行政人员
  TECHNICIAN = 'technician',          // 技术人员
  OTHER = 'other'                     // 其他
}

/**
 * 前车之鉴消息类型 - 专用于医疗教训经验分享
 */
export interface LessonMessage extends MessageBase {
  // 固定分类为前车之鉴
  category: MessageCategory.LESSON_LEARNED;
  
  // === 事件基本信息 ===
  lessonInfo: {
    // 教训类型
    lessonType: LessonType;
    
    // 事件严重程度
    severity: IncidentSeverity;
    
    // 发生环节
    occurrenceStage: OccurrenceStage;
    
    // 涉及人员
    involvedRoles: InvolvedRole[];
    involvedCount?: number;          // 涉及人员数量
    
    // 匿名化处理
    anonymityLevel: 'full' | 'partial' | 'none';
    deidentificationInfo?: string;   // 去标识化说明
    
    // === 事件描述 ===
    incidentDescription: {
      // 时间线
      timeline: Array<{
        time: string;               // 时间点或时间段
        event: string;              // 事件描述
        critical: boolean;          // 是否关键节点
      }>;
      
      // 发生背景
      background: string;
      
      // 直接原因
      immediateCauses: string[];
      
      // 关键决策点
      decisionPoints?: Array<{
        decision: string;           // 决策内容
        alternatives?: string[];    // 其他可选方案
        outcome: string;            // 决策结果
      }>;
      
      // 错误表现
      errorManifestations: string[];
      
      // 后果影响
      consequences: {
        patientImpact: string;      // 对患者的影响
        providerImpact?: string;    // 对医务人员的影响
        systemImpact?: string;      // 对系统的影响
        financialImpact?: string;   // 经济影响
      };
    };
    
    // === 根本原因分析 ===
    rootCauseAnalysis: {
      // 人为因素
      humanFactors?: Array<{
        factor: string;             // 因素描述
        type: 'knowledge' | 'skill' | 'attitude' | 'fatigue' | 'stress';
        contribution: 'primary' | 'secondary' | 'contributing'; // 贡献程度
      }>;
      
      // 系统因素
      systemFactors?: Array<{
        factor: string;
        area: 'process' | 'equipment' | 'environment' | 'communication' | 'culture';
        fixable: boolean;           // 是否可修复
      }>;
      
      // 组织因素
      organizationalFactors?: Array<{
        factor: string;
        area: 'policy' | 'training' | 'supervision' | 'resource' | 'culture';
      }>;
      
      // 根本原因总结
      primaryRootCause: string;
      secondaryRootCauses?: string[];
    };
    
    // === 纠正措施 ===
    correctiveActions: {
      // 立即措施（已采取）
      immediateActions: Array<{
        action: string;
        takenBy: string;            // 执行者
        effectiveness?: 'high' | 'medium' | 'low'; // 效果评估
      }>;
      
      // 短期措施（计划中）
      shortTermActions?: Array<{
        action: string;
        responsible: string;        // 负责人
        deadline?: string;          // 截止时间
        status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
      }>;
      
      // 长期措施（系统性改进）
      longTermActions?: Array<{
        action: string;
        goal: string;               // 目标
        timeline: string;           // 时间线
        metrics?: string[];         // 衡量指标
      }>;
      
      // 效果验证
      effectivenessVerification?: {
        method: string;             // 验证方法
        results?: string;           // 结果
        verifiedBy?: string;        // 验证者
      };
    };
    
    // === 经验教训 ===
    lessonsLearned: {
      // 关键教训
      keyLessons: Array<{
        lesson: string;
        applicability: 'specific' | 'general' | 'universal'; // 适用范围
        importance: 'critical' | 'important' | 'useful';     // 重要性
      }>;
      
      // 警示信号（早期预警）
      warningSigns?: string[];
      
      // 预防策略
      preventionStrategies: Array<{
        strategy: string;
        target: 'individual' | 'team' | 'system' | 'organization'; // 目标层面
        feasibility: 'easy' | 'moderate' | 'difficult'; // 可行性
      }>;
      
      // 安全检查表
      safetyChecklist?: Array<{
        item: string;
        critical: boolean;          // 是否关键项
        verificationMethod?: string; // 验证方法
      }>;
      
      // 最佳实践建议
      bestPractices?: string[];
    };
    
    // === 系统改进建议 ===
    systemImprovements?: {
      // 流程优化
      processImprovements?: string[];
      
      // 培训建议
      trainingRecommendations?: Array<{
        topic: string;
        targetAudience: string;     // 目标受众
        format: 'workshop' | 'online' | 'simulation' | 'guideline';
      }>;
      
      // 工具/设备改进
      toolImprovements?: Array<{
        tool: string;
        improvement: string;
        priority: 'high' | 'medium' | 'low';
      }>;
      
      // 政策/制度建议
      policyRecommendations?: string[];
    };
    
    // === 后续跟进 ===
    followUp: {
      // 患者后续情况
      patientFollowUp?: {
        status: 'recovered' | 'improving' | 'stable' | 'deteriorated' | 'deceased';
        followUpPeriod?: string;    // 随访时间
        additionalInfo?: string;
      };
      
      // 事件报告
      reportedToAuthority?: boolean;
      reportingDetails?: string;
      
      // 内部审查
      internalReview?: {
        conducted: boolean;
        findings?: string;
        recommendations?: string[];
      };
      
      // 分享范围
      sharingScope: 'department' | 'hospital' | 'regional' | 'national' | 'public';
    };
    
    // === 反思与启示 ===
    reflections?: {
      // 个人反思
      personalReflections?: string[];
      
      // 团队反思
      teamReflections?: string[];
      
      // 文化启示
      culturalInsights?: string[];
      
      // 伦理思考
      ethicalConsiderations?: string[];
    };
    
    // === 微信分享优化字段 ===
    wechatShare?: {
      // 警示要点
      warningPoints?: string[];
      
      // 错误再现（流程图或时间线）
      errorReproduction?: string;
      
      // 关键教训卡片
      lessonCards?: Array<{
        situation: string;          // 情境
        error: string;              // 错误
        correction: string;         // 纠正
        prevention: string;         // 预防
      }>;
      
      // 安全检查提醒
      safetyReminders?: string[];
      
      // 经验分享格式
      shareFormats?: {
        brief: string;              // 简要版
        detailed: string;           // 详细版
        checklist: string;          // 检查表版
      };
    };
  };
}

/**
 * 前车之鉴查询选项
 */
export interface LessonQueryOptions {
  // 教训类型筛选
  lessonType?: LessonType | LessonType[];
  
  // 严重程度筛选
  severity?: IncidentSeverity;
  
  // 发生环节筛选
  occurrenceStage?: OccurrenceStage;
  
  // 涉及人员筛选
  involvedRole?: InvolvedRole;
  
  // 可预防性筛选
  preventable?: boolean;
  
  // 分享范围筛选
  sharingScope?: string;
  
  // 时间筛选
  recentOnly?: boolean;             // 仅最近发生的
  hasFollowUp?: boolean;            // 有后续跟进的
  
  // 实用性筛选
  hasChecklist?: boolean;           // 有安全检查表
  hasBestPractices?: boolean;       // 有最佳实践
}

/**
 * 前车之鉴统计信息
 */
export interface LessonStats {
  // 总量统计
  totalLessons: number;
  preventableLessons: number;       // 可预防的教训
  severeLessons: number;            // 严重教训（中度伤害以上）
  
  // 分类统计
  byLessonType: Record<LessonType, number>;
  bySeverity: Record<IncidentSeverity, number>;
  byOccurrenceStage: Record<OccurrenceStage, number>;
  
  // 时间趋势
  monthlyTrend: number;             // 月趋势（上升/下降）
  byQuarter: Record<string, number>; // 季度分布
  
  // 严重性分析
  severityDistribution: {
    nearMiss: number;
    noHarm: number;
    minorHarm: number;
    moderateHarm: number;
    majorHarm: number;
    death: number;
  };
  
  // 预防效果统计
  preventionEffectiveness: {
    high: number;                   // 高效预防措施
    medium: number;                 // 中等效果
    low: number;                    // 低效果
    unknown: number;                // 效果未知
  };
  
  // 热门教训
  topLessons: Array<{
    lessonId: string;
    title: string;
    viewCount: number;
    saveCount: number;
    applicabilityScore: number;     // 适用性评分
  }>;
}

/**
 * 前车之鉴工具函数
 */
export const LessonUtils = {
  /**
   * 获取教训类型中文名称
   */
  getLessonTypeName(type: LessonType): string {
    const names: Record<LessonType, string> = {
      [LessonType.MEDICATION_ERROR]: '用药错误',
      [LessonType.DIAGNOSTIC_ERROR]: '诊断错误',
      [LessonType.TREATMENT_ERROR]: '治疗错误',
      [LessonType.COMMUNICATION_ERROR]: '沟通错误',
      [LessonType.EQUIPMENT_FAILURE]: '设备故障',
      [LessonType.DOCUMENTATION_ERROR]: '记录错误',
      [LessonType.INFECTION_CONTROL]: '感染控制',
      [LessonType.FALL_ACCIDENT]: '跌倒意外',
      [LessonType.MEDICATION_ADVERSE]: '药物不良反应',
      [LessonType.SYSTEM_FAILURE]: '系统问题'
    };
    return names[type] || type;
  },
  
  /**
   * 获取严重程度描述
   */
  getSeverityDescription(severity: IncidentSeverity): string {
    const descriptions: Record<IncidentSeverity, string> = {
      [IncidentSeverity.NEAR_MISS]: '未遂事件：及时发现未造成伤害',
      [IncidentSeverity.NO_HARM]: '无伤害事件：发生错误但未造成伤害',
      [IncidentSeverity.MINOR_HARM]: '轻度伤害：轻微、短暂伤害',
      [IncidentSeverity.MODERATE_HARM]: '中度伤害：需要治疗干预',
      [IncidentSeverity.MAJOR_HARM]: '重度伤害：永久性伤害',
      [IncidentSeverity.DEATH]: '死亡'
    };
    return descriptions[severity];
  },
  
  /**
   * 获取发生环节中文名称
   */
  getOccurrenceStageName(stage: OccurrenceStage): string {
    const names: Record<OccurrenceStage, string> = {
      [OccurrenceStage.OUTPATIENT]: '门诊',
      [OccurrenceStage.EMERGENCY]: '急诊',
      [OccurrenceStage.INPATIENT]: '住院',
      [OccurrenceStage.OPERATING_ROOM]: '手术室',
      [OccurrenceStage.ICU]: '重症监护室',
      [OccurrenceStage.PHARMACY]: '药房',
      [OccurrenceStage.LABORATORY]: '检验科',
      [OccurrenceStage.IMAGING]: '影像科',
      [OccurrenceStage.COMMUNITY]: '社区医疗',
      [OccurrenceStage.HOME_CARE]: '家庭护理'
    };
    return names[stage] || stage;
  },
  
  /**
   * 评估教训的可预防性
   */
  assessPreventability(lesson: LessonMessage): {
    preventable: boolean;
    level: 'highly_preventable' | 'moderately_preventable' | 'difficult_to_prevent' | 'unpreventable';
    factors: string[];
    preventionScore: number; // 0-100
  } {
    const { lessonInfo } = lesson;
    const factors: string[] = [];
    let preventionScore = 50; // 基础分
    
    // 人为因素分析
    if (lessonInfo.rootCauseAnalysis.humanFactors) {
      const humanErrors = lessonInfo.rootCauseAnalysis.humanFactors.filter(
        f => f.type === 'knowledge' || f.type === 'skill'
      );
      
      if (humanErrors.length > 0) {
        factors.push('涉及知识或技能不足');
        preventionScore += 20; // 可通过培训预防
      }
    }
    
    // 系统因素分析
    if (lessonInfo.rootCauseAnalysis.systemFactors) {
      const fixableSystemIssues = lessonInfo.rootCauseAnalysis.systemFactors.filter(
        f => f.fixable
      );
      
      if (fixableSystemIssues.length > 0) {
        factors.push('存在可修复的系统问题');
        preventionScore += 15; // 可通过系统改进预防
      }
    }
    
    // 预防策略评估
    if (lessonInfo.lessonsLearned.preventionStrategies) {
      const feasibleStrategies = lessonInfo.lessonsLearned.preventionStrategies.filter(
        s => s.feasibility === 'easy' || s.feasibility === 'moderate'
      );
      
      if (feasibleStrategies.length > 0) {
        factors.push('存在可行的预防策略');
        preventionScore += 15;
      }
    }
    
    // 安全检查表评估
    if (lessonInfo.lessonsLearned.safetyChecklist) {
      factors.push('已制定安全检查表');
      preventionScore += 10;
    }
    
    // 严重程度影响（严重事件更应预防）
    if (lessonInfo.severity === IncidentSeverity.MAJOR_HARM || 
        lessonInfo.severity === IncidentSeverity.DEATH) {
      preventionScore += 10; // 严重事件应重点预防
    }
    
    // 确定可预防级别
    let level: 'highly_preventable' | 'moderately_preventable' | 'difficult_to_prevent' | 'unpreventable';
    if (preventionScore >= 80) {
      level = 'highly_preventable';
    } else if (preventionScore >= 60) {
      level = 'moderately_preventable';
    } else if (preventionScore >= 40) {
      level = 'difficult_to_prevent';
    } else {
      level = 'unpreventable';
    }
    
    const preventable = preventionScore >= 60;
    
    return {
      preventable,
      level,
      factors,
      preventionScore: Math.min(preventionScore, 100)
    };
  },
  
  /**
   * 生成微信警示内容
   */
  generateWechatWarning(lesson: LessonMessage): {
    title: string;
    content: string;
    severity: string;
    keyLessons: string[];
    preventionTips: string[];
  } {
    const { lessonInfo } = lesson;
    
    // 标题根据严重程度调整
    let titlePrefix = '';
    switch (lessonInfo.severity) {
      case IncidentSeverity.DEATH:
        titlePrefix = '【严重警示】';
        break;
      case IncidentSeverity.MAJOR_HARM:
        titlePrefix = '【重要警示】';
        break;
      case IncidentSeverity.MODERATE_HARM:
        titlePrefix = '【警示】';
        break;
      default:
        titlePrefix = '【经验分享】';
    }
    
    const title = `${titlePrefix}${lesson.title}`;
    
    // 主要内容
    let content = `${title}\n\n`;
    
    // 基本信息
    content += `⚠️ 事件类型：${this.getLessonTypeName(lessonInfo.lessonType)}\n`;
    content += `🏥 发生环节：${this.getOccurrenceStageName(lessonInfo.occurrenceStage)}\n`;
    content += `📊 严重程度：${this.getSeverityDescription(lessonInfo.severity)}\n\n`;
    
    // 简要描述
    const briefDescription = lesson.summary || 
      lessonInfo.incidentDescription.background.substring(0, 150) + '...';
    content += `📝 事件概要：${briefDescription}\n\n`;
    
    // 关键教训（最多3条）
    const keyLessons = lessonInfo.lessonsLearned.keyLessons
      .filter(lesson => lesson.importance === 'critical')
      .slice(0, 3)
      .map(lesson => lesson.lesson);
    
    if (keyLessons.length > 0) {
      content += `💡 关键教训：\n`;
      keyLessons.forEach((lessonText, index) => {
        content += `  ${index + 1}. ${lessonText}\n`;
      });
      content += '\n';
    }
    
    // 预防措施（最多3条）
    const preventionTips = lessonInfo.lessonsLearned.preventionStrategies
      ?.filter(strategy => strategy.feasibility === 'easy')
      .slice(0, 3)
      .map(strategy => strategy.strategy) || [];
    
    if (preventionTips.length > 0) {
      content += `🛡️ 预防建议：\n`;
      preventionTips.forEach((tip, index) => {
        content += `  ${index + 1}. ${tip}\n`;
      });
    }
    
    // 来源和提醒
    content += `\n—— 分享自：众创医案平台\n`;
    content += `📚 前车之鉴，后事之师\n`;
    content += `💬 分享经验，避免重蹈覆辙`;
    
    // 限制长度
    const maxLength = 1800;
    if (content.length > maxLength) {
      content = content.substring(0, maxLength - 3) + '...';
    }
    
    return {
      title,
      content,
      severity: this.getSeverityDescription(lessonInfo.severity),
      keyLessons,
      preventionTips
    };
  },
  
  /**
   * 生成安全检查表
   */
  generateSafetyChecklist(lesson: LessonMessage): {
    title: string;
    items: Array<{
      item: string;
      critical: boolean;
      verification: string;
      relatedLesson?: string;
    }>;
    usageInstructions: string[];
  } {
    const { lessonInfo } = lesson;
    
    const items = lessonInfo.lessonsLearned.safetyChecklist?.map(checkItem => ({
      item: checkItem.item,
      critical: checkItem.critical,
      verification: checkItem.verificationMethod || '观察/询问/检查',
      relatedLesson: lessonInfo.lessonsLearned.keyLessons[0]?.lesson
    })) || [];
    
    // 如果没有现成的检查表，根据教训生成
    if (items.length === 0) {
      lessonInfo.lessonsLearned.keyLessons.forEach((lesson) => {
        items.push({
          item: `检查：是否了解"${lesson.lesson.substring(0, 50)}..."相关风险`,
          critical: lesson.importance === 'critical',
          verification: '询问相关人员',
          relatedLesson: lesson.lesson
        });
      });
      
      lessonInfo.lessonsLearned.preventionStrategies?.forEach((strategy) => {
        items.push({
          item: `执行：${strategy.strategy}`,
          critical: strategy.feasibility === 'easy',
          verification: '检查执行记录',
          relatedLesson: ""
        });
      });
    }
    
    const usageInstructions = [
      '在类似操作前逐项检查',
      '关键项目必须完成检查',
      '记录检查结果和发现的问题',
      '发现问题立即采取纠正措施',
      '定期回顾和更新检查表'
    ];
    
    return {
      title: `${lesson.title} - 安全检查表`,
      items,
      usageInstructions
    };
  },
  
  /**
   * 评估教训的适用性
   */
  assessApplicability(lesson: LessonMessage, context: {
    userRole?: string;
    workSetting?: string;
    specialty?: string;
  }): {
    applicable: boolean;
    relevance: 'high' | 'medium' | 'low';
    reasons: string[];
    adaptations?: string[];
  } {
    const { lessonInfo } = lesson;
    const reasons: string[] = [];
    const adaptations: string[] = [];
    let relevance: 'high' | 'medium' | 'low' = 'low';
    
    // 角色匹配度
    if (context.userRole && lessonInfo.involvedRoles.includes(context.userRole as InvolvedRole)) {
      relevance = 'high';
      reasons.push('与您的角色直接相关');
    } else if (context.userRole) {
      // 检查角色相关性
      const relatedRoles: Record<string, string[]> = {
        [InvolvedRole.DOCTOR]: [InvolvedRole.NURSE, InvolvedRole.PHARMACIST],
        [InvolvedRole.NURSE]: [InvolvedRole.DOCTOR, InvolvedRole.PATIENT],
        [InvolvedRole.PHARMACIST]: [InvolvedRole.DOCTOR, InvolvedRole.NURSE],
        [InvolvedRole.PATIENT]: [InvolvedRole.FAMILY, InvolvedRole.DOCTOR]
      };
      
      // userRole 作为字符串使用，因为 relatedRoles 使用字符串键
const userRole = context.userRole;
      if (relatedRoles[userRole as string]?.some(role => lessonInfo.involvedRoles.includes(role as InvolvedRole))) {
        relevance = 'medium';
        reasons.push('与您的角色间接相关');
      }
    }
    
    // 工作环境匹配度
    if (context.workSetting && lessonInfo.occurrenceStage === context.workSetting as OccurrenceStage) {
            // 选择更高的相关性级别
      if (relevance !== 'high') {
          relevance = 'medium';
      }
      reasons.push('与您的工作环境相同');
    }
    
    // 专业领域匹配度
    if (context.specialty) {
      // 简单的关键词匹配（实际应用可以更复杂）
      const specialtyKeywords: Record<string, string[]> = {
        '内科': ['用药', '诊断', '治疗'],
        '外科': ['手术', '操作', '治疗'],
        '护理': ['护理', '执行', '观察'],
        '药学': ['用药', '配药', '发药']
      };
      
      const keywords = specialtyKeywords[context.specialty] || [];
      const lessonText = JSON.stringify(lessonInfo).toLowerCase();
      
      const hasKeyword = keywords.some(keyword => 
        lessonText.includes(keyword.toLowerCase())
      );
      
      if (hasKeyword) {
        relevance = 'high';
        reasons.push('与您的专业领域相关');
      }
    }
    
    // 教训类型普遍性
    const universalLessonTypes = [
      LessonType.COMMUNICATION_ERROR,
      LessonType.DOCUMENTATION_ERROR,
      LessonType.SYSTEM_FAILURE
    ];
    
    if (universalLessonTypes.includes(lessonInfo.lessonType)) {
      if (relevance === 'low') relevance = 'medium';
      reasons.push('此类问题在各领域普遍存在');
    }
    
    // 生成适应建议
    if (relevance === 'medium' || relevance === 'high') {
      adaptations.push('根据您的具体情况进行调整');
      adaptations.push('结合本单位实际情况应用');
      
      if (lessonInfo.lessonsLearned.safetyChecklist) {
        adaptations.push('参考安全检查表制定本地版本');
      }
    }
    
    const applicable = relevance !== 'low';
    
    return {
      applicable,
      relevance,
      reasons,
      adaptations: adaptations.length > 0 ? adaptations : undefined
    };
  },
  
  /**
   * 验证教训信息完整性
   */
  validateLessonInfo(lessonInfo: LessonMessage['lessonInfo']): {
    valid: boolean;
    completeness: number; // 0-100
    missingCritical: string[];
    suggestions: string[];
  } {
    const missingCritical: string[] = [];
    const suggestions: string[] = [];
    let completeness = 100;
    
    // 必填字段检查
    if (!lessonInfo.lessonType) {
      missingCritical.push('lessonType');
      completeness -= 10;
    }
    
    if (!lessonInfo.severity) {
      missingCritical.push('severity');
      completeness -= 10;
    }
    
    if (!lessonInfo.occurrenceStage) {
      missingCritical.push('occurrenceStage');
      completeness -= 5;
    }
    
    if (!lessonInfo.involvedRoles || lessonInfo.involvedRoles.length === 0) {
      missingCritical.push('involvedRoles');
      completeness -= 5;
    }
    
    if (!lessonInfo.incidentDescription.background) {
      missingCritical.push('incidentDescription.background');
      completeness -= 10;
    }
    
    if (!lessonInfo.incidentDescription.immediateCauses || 
        lessonInfo.incidentDescription.immediateCauses.length === 0) {
      missingCritical.push('incidentDescription.immediateCauses');
      completeness -= 10;
    }
    
    if (!lessonInfo.incidentDescription.consequences.patientImpact) {
      missingCritical.push('incidentDescription.consequences.patientImpact');
      completeness -= 10;
    }
    
    if (!lessonInfo.rootCauseAnalysis.primaryRootCause) {
      missingCritical.push('rootCauseAnalysis.primaryRootCause');
      completeness -= 10;
    }
    
    if (!lessonInfo.correctiveActions.immediateActions || 
        lessonInfo.correctiveActions.immediateActions.length === 0) {
      missingCritical.push('correctiveActions.immediateActions');
      completeness -= 10;
    }
    
    if (!lessonInfo.lessonsLearned.keyLessons || 
        lessonInfo.lessonsLearned.keyLessons.length === 0) {
      missingCritical.push('lessonsLearned.keyLessons');
      completeness -= 10;
    }
    
    if (!lessonInfo.lessonsLearned.preventionStrategies || 
        lessonInfo.lessonsLearned.preventionStrategies.length === 0) {
      missingCritical.push('lessonsLearned.preventionStrategies');
      completeness -= 5;
    }
    
    // 建议性检查
    if (!lessonInfo.incidentDescription.timeline || 
        lessonInfo.incidentDescription.timeline.length === 0) {
      suggestions.push('建议提供事件时间线');
      completeness -= 3;
    }
    
    if (!lessonInfo.rootCauseAnalysis.humanFactors && 
        !lessonInfo.rootCauseAnalysis.systemFactors) {
      suggestions.push('建议进行根本原因分析');
      completeness -= 3;
    }
    
    if (!lessonInfo.lessonsLearned.safetyChecklist) {
      suggestions.push('建议制定安全检查表');
      completeness -= 2;
    }
    
    if (!lessonInfo.systemImprovements) {
      suggestions.push('建议提出系统改进建议');
      completeness -= 2;
    }
    
    if (lessonInfo.anonymityLevel === 'none') {
      suggestions.push('建议进行匿名化处理保护隐私');
      completeness -= 2;
    }
    
    // 后续跟进检查
    if (!lessonInfo.followUp.patientFollowUp && 
        lessonInfo.severity !== IncidentSeverity.NEAR_MISS && 
        lessonInfo.severity !== IncidentSeverity.NO_HARM) {
      suggestions.push('建议提供患者后续情况');
      completeness -= 3;
    }
    
    const valid = missingCritical.length === 0;
    
    return {
      valid,
      completeness: Math.max(0, completeness),
      missingCritical,
      suggestions
    };
  },
  
  /**
   * 计算教训的教育价值
   */
  calculateEducationalValue(lesson: LessonMessage): {
    total: number;          // 总分 0-100
    clarity: number;       // 清晰度：描述是否清晰
    analysis: number;      // 分析深度：原因分析是否深入
    practicality: number;  // 实用性：预防措施是否实用
    universality: number;  // 普适性：是否具有普遍意义
  } {
    const { lessonInfo } = lesson;
    
    // 清晰度评分（0-25分）
    let clarity = 15; // 基础分
    
    if (lessonInfo.incidentDescription.timeline && 
        lessonInfo.incidentDescription.timeline.length >= 3) {
      clarity += 5;
    }
    
    if (lesson.summary && lesson.summary.length > 50) {
      clarity += 5;
    }
    
    // 分析深度评分（0-30分）
    let analysis = 10; // 基础分
    
    if (lessonInfo.rootCauseAnalysis.humanFactors && 
        lessonInfo.rootCauseAnalysis.humanFactors.length > 0) {
      analysis += 5;
    }
    
    if (lessonInfo.rootCauseAnalysis.systemFactors && 
        lessonInfo.rootCauseAnalysis.systemFactors.length > 0) {
      analysis += 5;
    }
    
    if (lessonInfo.rootCauseAnalysis.organizationalFactors && 
        lessonInfo.rootCauseAnalysis.organizationalFactors.length > 0) {
      analysis += 5;
    }
    
    if (lessonInfo.rootCauseAnalysis.secondaryRootCauses && 
        lessonInfo.rootCauseAnalysis.secondaryRootCauses.length > 0) {
      analysis += 5;
    }
    
    // 实用性评分（0-25分）
    let practicality = 10; // 基础分
    
    if (lessonInfo.correctiveActions.immediateActions && 
        lessonInfo.correctiveActions.immediateActions.length > 0) {
      practicality += 5;
    }
    
    if (lessonInfo.lessonsLearned.preventionStrategies) {
      const easyStrategies = lessonInfo.lessonsLearned.preventionStrategies.filter(
        s => s.feasibility === 'easy'
      );
      if (easyStrategies.length > 0) practicality += 5;
    }
    
    if (lessonInfo.lessonsLearned.safetyChecklist && 
        lessonInfo.lessonsLearned.safetyChecklist.length > 0) {
      practicality += 5;
    }
    
    // 普适性评分（0-20分）
    let universality = 5; // 基础分
    
    // 教训适用范围
    const broadApplicability = lessonInfo.lessonsLearned.keyLessons.filter(
      l => l.applicability === 'general' || l.applicability === 'universal'
    );
    universality += Math.min(broadApplicability.length * 3, 10); // 最多加10分
    
    // 教训类型普适性
    const universalTypes = [
      LessonType.COMMUNICATION_ERROR,
      LessonType.SYSTEM_FAILURE,
      LessonType.DOCUMENTATION_ERROR
    ];
    if (universalTypes.includes(lessonInfo.lessonType)) {
      universality += 5;
    }
    
    const total = clarity + analysis + practicality + universality;
    
    return {
      total: Math.min(Math.round(total), 100),
      clarity: Math.min(Math.round(clarity), 25),
      analysis: Math.min(Math.round(analysis), 30),
      practicality: Math.min(Math.round(practicality), 25),
      universality: Math.min(Math.round(universality), 20)
    };
  }
};

/**
 * 类型守卫 - 检查是否为LessonMessage
 */
export function isLessonMessage(message: MessageBase): message is LessonMessage {
  return message.category === MessageCategory.LESSON_LEARNED;
}