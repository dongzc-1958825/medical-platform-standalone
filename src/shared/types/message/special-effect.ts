// src/shared/types/message/special-effect.ts
import { MessageBase, MessageCategory } from './base';

/**
 * 特效类型 - 治疗方法和效果的分类
 */
export enum SpecialEffectType {
  MEDICATION_EFFECT = 'medication_effect',      // 药物特效：特殊用药效果
  TREATMENT_PROTOCOL = 'treatment_protocol',    // 治疗方案：特殊治疗方案
  SURGICAL_TECHNIQUE = 'surgical_technique',    // 手术技巧：特殊手术方法
  PHYSICAL_THERAPY = 'physical_therapy',        // 物理治疗：特殊康复方法
  TRADITIONAL_MEDICINE = 'traditional_medicine', // 传统医学：中医等传统疗法
  LIFESTYLE_INTERVENTION = 'lifestyle_intervention', // 生活方式干预
  PSYCHOLOGICAL_INTERVENTION = 'psychological_intervention', // 心理干预
  NUTRITIONAL_THERAPY = 'nutritional_therapy',  // 营养治疗
  EMERGENCY_MANEUVERS = 'emergency_maneuvers',  // 急救技巧
  HOME_REMEDY = 'home_remedy'                   // 家庭疗法
}

/**
 * 证据强度
 */
export enum EvidenceStrength {
  STRONG_EVIDENCE = 'strong_evidence',      // 强证据：多个高质量研究支持
  MODERATE_EVIDENCE = 'moderate_evidence',  // 中等证据：有研究支持但需更多验证
  WEAK_EVIDENCE = 'weak_evidence',          // 弱证据：初步研究或病例报告
  EXPERT_OPINION = 'expert_opinion',        // 专家意见：基于临床经验
  ANECDOTAL = 'anecdotal'                   // 个案经验：个人或少数案例
}

/**
 * 适用人群
 */
export enum ApplicablePopulation {
  GENERAL = 'general',                // 普通人群
  SPECIFIC_DISEASE = 'specific_disease', // 特定疾病患者
  SPECIFIC_AGE = 'specific_age',      // 特定年龄段
  SPECIFIC_GENDER = 'specific_gender', // 特定性别
  PREGNANT_WOMEN = 'pregnant_women',  // 孕妇
  CHILDREN = 'children',              // 儿童
  ELDERLY = 'elderly',                // 老年人
  WITH_COMORBIDITIES = 'with_comorbidities' // 有合并症者
}

/**
 * 风险等级
 */
export enum RiskLevel {
  VERY_LOW = 'very_low',      // 极低风险：几乎没有副作用
  LOW = 'low',                // 低风险：轻微可逆副作用
  MODERATE = 'moderate',      // 中等风险：需要监测的副作用
  HIGH = 'high',              // 高风险：可能严重副作用
  VERY_HIGH = 'very_high'     // 极高风险：危险，需专业监督
}

/**
 * 特效分享消息类型 - 专用于特效治疗方案分享
 */
export interface SpecialEffectMessage extends MessageBase {
  // 固定分类为特效分享
  category: MessageCategory.SPECIAL_EFFECT;
  
  // === 特效基本信息 ===
  effectInfo: {
    // 特效类型
    effectType: SpecialEffectType;
    
    // 主要针对的疾病/症状
    targetCondition: string;
    alternativeConditions?: string[]; // 其他适用情况
    
    // 证据强度
    evidenceStrength: EvidenceStrength;
    supportingStudies?: string[];     // 支持研究（简要描述）
    
    // 适用人群
    applicablePopulation: ApplicablePopulation | ApplicablePopulation[];
    populationDescription?: string;   // 适用人群详细描述
    
    // === 治疗方案详情 ===
    treatmentProtocol: {
      // 核心治疗方法
      coreMethod: string;
      alternativeMethods?: string[];  // 替代方法
      
      // 具体实施步骤
      implementationSteps: Array<{
        step: number;
        description: string;
        duration?: string;           // 该步骤持续时间
        frequency?: string;          // 频率
        precautions?: string[];      // 注意事项
      }>;
      
      // 所需材料/设备
      requiredMaterials?: Array<{
        name: string;
        description?: string;
        alternative?: string;        // 替代品
        whereToGet?: string;         // 获取途径
      }>;
      
      // 治疗周期
      treatmentDuration?: string;    // 总治疗时间
      treatmentSchedule?: string;    // 具体时间安排
      
      // 成本信息
      costEstimate?: {
        low: number;                 // 最低成本（元）
        high: number;                // 最高成本
        coveredByInsurance?: boolean; // 是否医保覆盖
        notes?: string;              // 费用说明
      };
    };
    
    // === 效果评估 ===
    effectiveness: {
      // 有效率/改善率
      efficacyRate?: string;         // 如：80%，或描述性
      timeToEffect?: string;         // 见效时间
      
      // 效果描述
      effectDescription: string;
      measuredOutcomes?: string[];   // 可测量的结果
      
      // 持久性
      durability?: string;           // 效果持续时间
      maintenanceRequired?: boolean; // 是否需要维持治疗
      maintenanceProtocol?: string;  // 维持方案
      
      // 对比信息
      comparison?: {
        standardTreatment: string;   // 标准治疗
        advantages: string[];        // 优势
        disadvantages?: string[];    // 劣势
      };
    };
    
    // === 安全性信息 ===
    safetyInfo: {
      // 风险等级
      riskLevel: RiskLevel;
      
      // 已知副作用
      sideEffects?: Array<{
        effect: string;
        frequency: 'common' | 'uncommon' | 'rare';
        severity: 'mild' | 'moderate' | 'severe';
        management?: string;         // 处理方法
      }>;
      
      // 禁忌症
      contraindications?: string[];
      
      // 警告和注意事项
      warnings?: string[];
      precautions?: string[];
      
      // 需要专业监督的情况
      requiresSupervision?: boolean;
      supervisionLevel?: 'self' | 'family' | 'professional'; // 监督级别
    };
    
    // === 案例信息 ===
    caseInfo?: {
      // 病例数量
      numberOfCases: number;
      
      // 典型病例描述（匿名化）
      typicalCase?: {
        patientProfile?: string;     // 患者概况（匿名）
        condition?: string;          // 病情
        treatmentCourse?: string;    // 治疗过程
        outcome?: string;            // 结果
        followUp?: string;           // 随访情况
      };
      
      // 成功率和失败率
      successRate?: number;          // 成功率百分比
      failureRate?: number;          // 失败率百分比
      failureReasons?: string[];     // 失败原因分析
    };
    
    // === 实施建议 ===
    implementationAdvice: {
      // 适合自行实施吗？
      suitableForSelf: boolean;
      selfImplementationTips?: string[]; // 自行实施建议
      
      // 需要专业帮助吗？
      requiresProfessional: boolean;
      professionalTypes?: string[];  // 需要什么专业人士
      
      // 环境要求
      environmentRequirements?: string[];
      
      // 最佳时机
      optimalTiming?: string;
      timingConsiderations?: string[]; // 时间考虑因素
    };
    
    // === 验证信息 ===
    verificationInfo?: {
      // 验证者信息
      verifiedBy?: Array<{
        name: string;
        role: string;
        institution?: string;
        verificationDate: string;
      }>;
      
      // 验证方法
      verificationMethod?: string;
      
      // 可重复性
      reproducibility?: 'high' | 'medium' | 'low';
      reproductionNotes?: string;    // 重复注意事项
    };
    
    // === 更新和维护 ===
    updateInfo?: {
      lastUpdated: string;
      updateReason?: string;
      version: number;
      nextReviewDate?: string;       // 下次评估时间
    };
    
    // === 微信分享优化字段 ===
    wechatShare?: {
      // 快速指南
      quickGuide?: string;
      
      // 关键步骤要点
      keySteps?: Array<{
        step: string;
        tip?: string;
      }>;
      
      // 效果对比表
      comparisonTable?: Array<{
        aspect: string;              // 方面
        thisMethod: string;          // 本方法
        standardMethod: string;      // 标准方法
      }>;
      
      // 安全提醒卡片
      safetyCards?: Array<{
        situation: string;           // 情况
        action: string;              // 应对措施
        warning?: boolean;           // 是否警告
      }>;
      
      // 适用性自测问题
      suitabilityQuestions?: Array<{
        question: string;
        yesMeans: string;            // 回答"是"意味着什么
        noMeans: string;             // 回答"否"意味着什么
      }>;
    };
  };
}

/**
 * 特效分享查询选项
 */
export interface SpecialEffectQueryOptions {
  // 特效类型筛选
  effectType?: SpecialEffectType | SpecialEffectType[];
  
  // 目标疾病筛选
  targetCondition?: string;
  
  // 证据强度筛选
  evidenceStrength?: EvidenceStrength;
  
  // 适用人群筛选
  applicablePopulation?: ApplicablePopulation;
  
  // 风险等级筛选
  riskLevel?: RiskLevel;
  
  // 实施难度筛选
  suitableForSelf?: boolean;
  requiresProfessional?: boolean;
  
  // 效果验证筛选
  verifiedOnly?: boolean;
  hasCaseInfo?: boolean;
  
  // 成本筛选
  maxCost?: number;
  coveredByInsurance?: boolean;
}

/**
 * 特效分享统计信息
 */
export interface SpecialEffectStats {
  // 总量统计
  totalEffects: number;
  verifiedEffects: number;           // 已验证的特效
  selfManageable: number;            // 可自行实施的特效
  
  // 分类统计
  byEffectType: Record<SpecialEffectType, number>;
  byEvidenceStrength: Record<EvidenceStrength, number>;
  byRiskLevel: Record<RiskLevel, number>;
  
  // 疾病领域分布
  topConditions: Array<{
    condition: string;
    count: number;
    percentage: number;
  }>;
  
  // 效果统计
  averageEfficacyRate?: number;      // 平均有效率
  highEfficacyEffects: number;       // 高效特效数量（有效率>80%）
  
  // 安全性统计
  lowRiskEffects: number;            // 低风险特效数量
  requiresSupervision: number;       // 需要专业监督的数量
  
  // 实用性统计
  popularEffects: Array<{
    effectId: string;
    title: string;
    viewCount: number;
    saveCount: number;
    shareCount: number;
  }>;
}

/**
 * 特效分享工具函数
 */
export const SpecialEffectUtils = {
  /**
   * 获取特效类型中文名称
   */
  getEffectTypeName(type: SpecialEffectType): string {
    const names: Record<SpecialEffectType, string> = {
      [SpecialEffectType.MEDICATION_EFFECT]: '药物特效',
      [SpecialEffectType.TREATMENT_PROTOCOL]: '治疗方案',
      [SpecialEffectType.SURGICAL_TECHNIQUE]: '手术技巧',
      [SpecialEffectType.PHYSICAL_THERAPY]: '物理治疗',
      [SpecialEffectType.TRADITIONAL_MEDICINE]: '传统医学',
      [SpecialEffectType.LIFESTYLE_INTERVENTION]: '生活方式干预',
      [SpecialEffectType.PSYCHOLOGICAL_INTERVENTION]: '心理干预',
      [SpecialEffectType.NUTRITIONAL_THERAPY]: '营养治疗',
      [SpecialEffectType.EMERGENCY_MANEUVERS]: '急救技巧',
      [SpecialEffectType.HOME_REMEDY]: '家庭疗法'
    };
    return names[type] || type;
  },
  
  /**
   * 获取证据强度描述
   */
  getEvidenceDescription(strength: EvidenceStrength): string {
    const descriptions: Record<EvidenceStrength, string> = {
      [EvidenceStrength.STRONG_EVIDENCE]: '强证据：多个高质量研究支持',
      [EvidenceStrength.MODERATE_EVIDENCE]: '中等证据：有研究支持但需更多验证',
      [EvidenceStrength.WEAK_EVIDENCE]: '弱证据：初步研究或病例报告',
      [EvidenceStrength.EXPERT_OPINION]: '专家意见：基于临床经验',
      [EvidenceStrength.ANECDOTAL]: '个案经验：个人或少数案例'
    };
    return descriptions[strength];
  },
  
  /**
   * 获取风险等级描述
   */
  getRiskDescription(level: RiskLevel): string {
    const descriptions: Record<RiskLevel, string> = {
      [RiskLevel.VERY_LOW]: '极低风险：几乎没有副作用',
      [RiskLevel.LOW]: '低风险：轻微可逆副作用',
      [RiskLevel.MODERATE]: '中等风险：需要监测的副作用',
      [RiskLevel.HIGH]: '高风险：可能严重副作用',
      [RiskLevel.VERY_HIGH]: '极高风险：危险，需专业监督'
    };
    return descriptions[level];
  },
  
  /**
   * 检查特效适用性
   */
  checkSuitability(
    effect: SpecialEffectMessage, 
    userProfile: {
      condition?: string;
      age?: number;
      gender?: string;
      comorbidities?: string[];
    }
  ): {
    suitable: boolean;
    reasons: string[];
    warnings: string[];
    precautions: string[];
  } {
    const { effectInfo } = effect;
    const reasons: string[] = [];
    const warnings: string[] = [];
    const precautions: string[] = [];
    
    // 基本适用性检查
    let suitable = true;
    
    // 疾病匹配检查
    if (userProfile.condition) {
      const matchesCondition = effectInfo.targetCondition === userProfile.condition ||
        effectInfo.alternativeConditions?.includes(userProfile.condition);
      
      if (!matchesCondition) {
        warnings.push(`此特效主要针对 ${effectInfo.targetCondition}，您的病情可能不完全适用`);
      } else {
        reasons.push(`适用于您的病情：${userProfile.condition}`);
      }
    }
    
    // 年龄匹配检查
    if (userProfile.age) {
      const applicablePops = Array.isArray(effectInfo.applicablePopulation) 
        ? effectInfo.applicablePopulation 
        : [effectInfo.applicablePopulation];
      
      let ageSuitable = false;
      
      if (applicablePops.includes(ApplicablePopulation.GENERAL)) {
        ageSuitable = true;
      } else if (userProfile.age < 18 && applicablePops.includes(ApplicablePopulation.CHILDREN)) {
        ageSuitable = true;
      } else if (userProfile.age >= 60 && applicablePops.includes(ApplicablePopulation.ELDERLY)) {
        ageSuitable = true;
      } else if (applicablePops.includes(ApplicablePopulation.SPECIFIC_AGE)) {
        // 需要具体的年龄范围信息
        ageSuitable = true;
      }
      
      if (!ageSuitable) {
        warnings.push('您的年龄可能不适合此方法');
      }
    }
    
    // 合并症检查
    if (userProfile.comorbidities && userProfile.comorbidities.length > 0) {
      if (effectInfo.applicablePopulation === ApplicablePopulation.WITH_COMORBIDITIES) {
        reasons.push('此方法适合有合并症的患者');
      } else if (effectInfo.safetyInfo.contraindications) {
        const hasContraindication = userProfile.comorbidities.some(comorbidity =>
          effectInfo.safetyInfo.contraindications?.some(contra =>
            contra.toLowerCase().includes(comorbidity.toLowerCase())
          )
        );
        
        if (hasContraindication) {
          suitable = false;
          warnings.push('您的合并症可能构成禁忌症');
        }
      }
    }
    
    // 证据强度警告
    if (effectInfo.evidenceStrength === EvidenceStrength.ANECDOTAL) {
      warnings.push('此方法仅为个案经验，证据强度较低');
    } else if (effectInfo.evidenceStrength === EvidenceStrength.WEAK_EVIDENCE) {
      warnings.push('此方法证据强度较弱，需谨慎参考');
    }
    
    // 风险警告
    if (effectInfo.safetyInfo.riskLevel === RiskLevel.HIGH) {
      warnings.push('此方法风险较高，必须在专业指导下进行');
      precautions.push('必须寻求专业医疗指导');
    } else if (effectInfo.safetyInfo.riskLevel === RiskLevel.VERY_HIGH) {
      suitable = false;
      warnings.push('此方法风险极高，普通患者不宜自行尝试');
    }
    
    // 自行实施能力检查
    if (!effectInfo.implementationAdvice.suitableForSelf) {
      precautions.push('此方法需要专业帮助，不宜自行实施');
    }
    
    return {
      suitable,
      reasons,
      warnings,
      precautions
    };
  },
  
  /**
   * 生成微信快速指南
   */
  generateWechatQuickGuide(effect: SpecialEffectMessage): string {
    const { effectInfo } = effect;
    
    let guide = `【特效分享】${effect.title}\n\n`;
    
    // 基本信息
    guide += `🎯 针对：${effectInfo.targetCondition}\n`;
    guide += `📊 证据强度：${this.getEvidenceDescription(effectInfo.evidenceStrength)}\n`;
    guide += `⚠️ 风险等级：${this.getRiskDescription(effectInfo.safetyInfo.riskLevel)}\n\n`;
    
    // 核心方法
    guide += `💡 核心方法：${effectInfo.treatmentProtocol.coreMethod}\n\n`;
    
    // 关键步骤（最多3步）
    if (effectInfo.treatmentProtocol.implementationSteps.length > 0) {
      guide += `📝 关键步骤：\n`;
      effectInfo.treatmentProtocol.implementationSteps
        .slice(0, 3)
        .forEach(step => {
          guide += `  ${step.step}. ${step.description}\n`;
        });
      guide += '\n';
    }
    
    // 见效时间
    if (effectInfo.effectiveness.timeToEffect) {
      guide += `⏰ 见效时间：${effectInfo.effectiveness.timeToEffect}\n`;
    }
    
    // 有效率
    if (effectInfo.effectiveness.efficacyRate) {
      guide += `📈 有效率：${effectInfo.effectiveness.efficacyRate}\n`;
    }
    
    // 重要提醒
    if (effectInfo.safetyInfo.warnings && effectInfo.safetyInfo.warnings.length > 0) {
      guide += `\n🚨 重要提醒：${effectInfo.safetyInfo.warnings[0]}\n`;
    }
    
    // 适用性提示
    if (!effectInfo.implementationAdvice.suitableForSelf) {
      guide += `\n👨‍⚕️ 注意：此方法需要专业指导\n`;
    }
    
    // 来源信息
    guide += `\n—— 分享自：众创医案平台\n`;
    guide += `作者：${effect.authorName} (${effect.authorRole})\n`;
    if (effect.institution) guide += `机构：${effect.institution}\n`;
    guide += `💬 分享经验，帮助更多人`;
    
    // 限制长度
    const maxLength = 1500;
    if (guide.length > maxLength) {
      guide = guide.substring(0, maxLength - 3) + '...';
    }
    
    return guide;
  },
  
  /**
   * 生成详细实施手册
   */
  generateImplementationManual(effect: SpecialEffectMessage): {
    overview: string;
    materials: string[];
    steps: Array<{ step: number; description: string; tips?: string[] }>;
    precautions: string[];
    monitoring: string[];
  } {
    const { effectInfo } = effect;
    
    // 概述
    const overview = `本方法用于${effectInfo.targetCondition}，通过${effectInfo.treatmentProtocol.coreMethod}达到治疗效果。`;
    
    // 材料清单
    const materials = effectInfo.treatmentProtocol.requiredMaterials?.map(m => 
      `${m.name}${m.description ? `（${m.description}）` : ''}`
    ) || [];
    
    // 步骤详情
    const steps = effectInfo.treatmentProtocol.implementationSteps.map(step => ({
      step: step.step,
      description: step.description,
      tips: step.precautions ? [...step.precautions] : undefined
    }));
    
    // 注意事项
    const precautions: string[] = [];
    if (effectInfo.safetyInfo.warnings) precautions.push(...effectInfo.safetyInfo.warnings);
    if (effectInfo.safetyInfo.precautions) precautions.push(...effectInfo.safetyInfo.precautions);
    
    // 监测指标
    const monitoring: string[] = [];
    if (effectInfo.effectiveness.measuredOutcomes) {
      monitoring.push(...effectInfo.effectiveness.measuredOutcomes.map(outcome => 
        `监测${outcome}的变化`
      ));
    }
    
    return {
      overview,
      materials,
      steps,
      precautions,
      monitoring
    };
  },
  
  /**
   * 验证特效信息完整性
   */
  validateEffectInfo(effectInfo: SpecialEffectMessage['effectInfo']): {
    valid: boolean;
    completeness: number; // 0-100
    missingSections: string[];
    suggestions: string[];
  } {
    const missingSections: string[] = [];
    const suggestions: string[] = [];
    let completeness = 100;
    
    // 必填字段检查
    if (!effectInfo.effectType) {
      missingSections.push('effectType');
      completeness -= 10;
    }
    
    if (!effectInfo.targetCondition) {
      missingSections.push('targetCondition');
      completeness -= 10;
    }
    
    if (!effectInfo.evidenceStrength) {
      missingSections.push('evidenceStrength');
      completeness -= 5;
    }
    
    if (!effectInfo.applicablePopulation) {
      missingSections.push('applicablePopulation');
      completeness -= 5;
    }
    
    if (!effectInfo.treatmentProtocol.coreMethod) {
      missingSections.push('treatmentProtocol.coreMethod');
      completeness -= 10;
    }
    
    if (!effectInfo.treatmentProtocol.implementationSteps || 
        effectInfo.treatmentProtocol.implementationSteps.length === 0) {
      missingSections.push('implementationSteps');
      completeness -= 15;
    }
    
    if (!effectInfo.effectiveness.effectDescription) {
      missingSections.push('effectiveness.effectDescription');
      completeness -= 10;
    }
    
    if (!effectInfo.safetyInfo.riskLevel) {
      missingSections.push('safetyInfo.riskLevel');
      completeness -= 10;
    }
    
    if (!effectInfo.implementationAdvice) {
      missingSections.push('implementationAdvice');
      completeness -= 5;
    }
    
    // 建议性检查
    if (!effectInfo.caseInfo) {
      suggestions.push('建议添加案例信息，增加可信度');
      completeness -= 5;
    }
    
    if (!effectInfo.verificationInfo) {
      suggestions.push('建议添加验证信息');
      completeness -= 5;
    }
    
    if (!effectInfo.updateInfo) {
      suggestions.push('建议添加更新信息');
      completeness -= 5;
    }
    
    // 安全信息详细程度检查
    if (!effectInfo.safetyInfo.sideEffects || effectInfo.safetyInfo.sideEffects.length === 0) {
      suggestions.push('建议详细说明可能的副作用');
    }
    
    if (!effectInfo.safetyInfo.contraindications || effectInfo.safetyInfo.contraindications.length === 0) {
      suggestions.push('建议说明禁忌症');
    }
    
    return {
      valid: missingSections.length === 0,
      completeness: Math.max(0, completeness),
      missingSections,
      suggestions
    };
  },
  
  /**
   * 计算特效价值评分
   */
  calculateEffectValueScore(effect: SpecialEffectMessage): {
    total: number;          // 总分 0-100
    effectiveness: number;  // 有效性分数
    safety: number;        // 安全性分数
    practicality: number;  // 实用性分数
    evidence: number;      // 证据强度分数
  } {
    const { effectInfo } = effect;
    
    // 有效性评分（0-30分）
    let effectiveness = 10; // 基础分
    
    if (effectInfo.effectiveness.efficacyRate) {
      const rate = parseFloat(effectInfo.effectiveness.efficacyRate);
      if (!isNaN(rate)) {
        effectiveness += Math.min(rate / 5, 15); // 最高加15分
      }
    }
    
    if (effectInfo.caseInfo?.successRate) {
      effectiveness += Math.min(effectInfo.caseInfo.successRate / 10, 5); // 最高加5分
    }
    
    // 安全性评分（0-30分）
    let safety = 30; // 基础分（假设安全）
    
    switch (effectInfo.safetyInfo.riskLevel) {
      case RiskLevel.VERY_HIGH:
        safety -= 25; // 极高风险减25分
        break;
      case RiskLevel.HIGH:
        safety -= 15; // 高风险减15分
        break;
      case RiskLevel.MODERATE:
        safety -= 5; // 中等风险减5分
        break;
      case RiskLevel.LOW:
        safety -= 2; // 低风险减2分
        break;
      // VERY_LOW 不减分
    }
    
    if (effectInfo.safetyInfo.requiresSupervision) {
      safety -= 5;
    }
    
    // 实用性评分（0-25分）
    let practicality = 10; // 基础分
    
    if (effectInfo.implementationAdvice.suitableForSelf) {
      practicality += 10;
    }
    
    if (effectInfo.treatmentProtocol.costEstimate) {
      const avgCost = (effectInfo.treatmentProtocol.costEstimate.low + 
                      effectInfo.treatmentProtocol.costEstimate.high) / 2;
      if (avgCost < 100) practicality += 5;
      else if (avgCost < 500) practicality += 3;
    }
    
    // 证据强度评分（0-15分）
    let evidence = 0;
    switch (effectInfo.evidenceStrength) {
      case EvidenceStrength.STRONG_EVIDENCE:
        evidence = 15;
        break;
      case EvidenceStrength.MODERATE_EVIDENCE:
        evidence = 10;
        break;
      case EvidenceStrength.WEAK_EVIDENCE:
        evidence = 5;
        break;
      case EvidenceStrength.EXPERT_OPINION:
        evidence = 3;
        break;
      case EvidenceStrength.ANECDOTAL:
        evidence = 1;
        break;
    }
    
    const total = effectiveness + safety + practicality + evidence;
    
    return {
      total: Math.min(Math.round(total), 100),
      effectiveness: Math.min(Math.round(effectiveness), 30),
      safety: Math.min(Math.round(safety), 30),
      practicality: Math.min(Math.round(practicality), 25),
      evidence: Math.min(Math.round(evidence), 15)
    };
  }
};

/**
 * 类型守卫 - 检查是否为SpecialEffectMessage
 */
export function isSpecialEffectMessage(message: MessageBase): message is SpecialEffectMessage {
  return message.category === MessageCategory.SPECIAL_EFFECT;
}