// src/shared/types/message/new-drug.ts
import { MessageBase, MessageCategory } from './base';

/**
 * 新药信息消息类型 - 专用于新药信息分享
 * 继承自 MessageBase，添加新药特定字段
 */
export interface NewDrugMessage extends MessageBase {
  // 固定分类为新药信息
  category: MessageCategory.NEW_DRUG;
  
  // === 新药基本信息 ===
  drugInfo: {
    // 药品名称
    drugName: string;
    genericName?: string;        // 通用名
    brandNames?: string[];       // 商品名列表
    englishName?: string;        // 英文名
    
    // 批准信息
    manufacturer: string;        // 生产厂家
    approvalNumber?: string;     // 批准文号
    approvalDate?: string;       // 批准日期
    approvalCountry?: string;    // 批准国家/地区
    approvalAuthority?: string;  // 批准机构（如：NMPA, FDA, EMA）
    
    // 药品分类
    drugClass?: string;          // 药品分类（如：抗生素、抗肿瘤药）
    atcCode?: string;            // ATC代码
    prescriptionType: 'otc' | 'rx' | 'both' | 'restricted'; // 处方类型
    controlledSubstance?: boolean; // 是否管制药品
    
    // 适应症
    indications: string[];       // 适应症列表
    mainIndication?: string;     // 主要适应症
    offLabelUses?: string[];     // 超说明书用途
    
    // 用法用量
    dosageForms?: string[];      // 剂型规格（如：片剂50mg）
    standardDosage?: string;     // 标准用法用量
    administrationRoute?: string; // 给药途径（口服、静脉等）
    dosageAdjustment?: string;   // 剂量调整（肝肾功能不全等）
    
    // 作用机制
    mechanism?: string;          // 作用机制
    pharmacologicalAction?: string; // 药理作用
    target?: string;             // 作用靶点
    
    // === 临床试验数据 ===
    clinicalData?: {
      // 试验阶段
      phase?: 'I' | 'II' | 'III' | 'IV' | 'post_marketing';
      
      // 样本信息
      sampleSize?: number;
      population?: string;       // 研究人群
      studyDesign?: string;      // 研究设计
      
      // 有效性数据
      efficacy?: string;
      efficacyRate?: number;     // 有效率（%）
      responseRate?: number;     // 应答率
      survivalBenefit?: string;  // 生存获益
      
      // 安全性数据
      safetyProfile?: string;
      adverseEvents?: Array<{
        event: string;
        frequency: 'very_common' | 'common' | 'uncommon' | 'rare' | 'very_rare';
        description?: string;
      }>;
      seriousAdverseEvents?: string[];
      contraindications?: string[];
      
      // 比较数据
      comparator?: string;       // 对照药物
      superiority?: boolean;     // 是否优效
      nonInferiority?: boolean;  // 是否非劣效
      
      // 研究信息
      studyId?: string;          // 临床试验编号
      publicationLinks?: string[]; // 发表链接
      principalInvestigator?: string; // 主要研究者
    };
    
    // === 药代动力学 ===
    pharmacokinetics?: {
      bioavailability?: string;   // 生物利用度
      halfLife?: string;         // 半衰期
      timeToPeak?: string;       // 达峰时间
      peakConcentration?: string; // 峰浓度
      metabolism?: string;       // 代谢途径
      excretion?: string;        // 排泄途径
      proteinBinding?: string;   // 蛋白结合率
    };
    
    // === 安全性信息 ===
    safetyInfo?: {
      // 禁忌症
      contraindications?: string[];
      
      // 警告与注意事项
      warnings?: string[];
      precautions?: string[];
      
      // 不良反应
      adverseReactions?: Array<{
        system: string;          // 系统（如：消化系统）
        reactions: string[];     // 具体反应
        frequency: string;       // 频率
      }>;
      
      // 药物相互作用
      drugInteractions?: Array<{
        interactingDrug: string; // 相互作用药物
        effect: string;          // 相互作用效应
        severity: 'major' | 'moderate' | 'minor';
        management?: string;     // 处理建议
      }>;
      
      // 特殊人群
      pregnancyCategory?: string; // 妊娠分级
      lactationRisk?: string;    // 哺乳期风险
      pediatricUse?: string;     // 儿童用药
      geriatricUse?: string;     // 老年用药
      hepaticImpairment?: string; // 肝功能不全
      renalImpairment?: string;  // 肾功能不全
    };
    
    // === 市场信息 ===
    marketInfo?: {
      // 价格信息
      priceRange?: string;
      unitPrice?: number;
      insuranceCoverage?: boolean; // 医保覆盖
      insuranceCode?: string;     // 医保编码
      
      // 供应信息
      availability?: string;      // 可及性
      supplyStatus?: 'available' | 'shortage' | 'discontinued' | 'limited';
      manufacturerContact?: string; // 厂家联系方式
      
      // 市场表现
      marketShare?: string;       // 市场份额
      salesVolume?: string;       // 销售量
      launchDate?: string;        // 上市日期
    };
    
    // === 替代药物比较 ===
    alternatives?: Array<{
      name: string;
      similarity: number;        // 相似度 0-100
      advantages?: string[];     // 优势
      disadvantages?: string[];  // 劣势
      costComparison?: string;   // 费用比较
    }>;
    
    // === 专家评价 ===
    expertReviews?: Array<{
      expertName: string;
      expertTitle: string;
      expertInstitution?: string;
      review: string;
      rating: number;           // 评分 1-5
      date: string;
      confidenceLevel?: 'high' | 'medium' | 'low'; // 置信度
    }>;
    
    // === 患者反馈 ===
    patientFeedback?: {
      totalPatients: number;
      averageRating: number;    // 平均评分 1-5
      commonBenefits?: string[]; // 常见获益
      commonSideEffects?: string[]; // 常见副作用
      satisfactionRate?: number; // 满意度 %
      adherenceRate?: number;   // 依从性 %
    };
    
    // === 研究进展 ===
    researchUpdates?: Array<{
      updateType: 'new_indication' | 'safety_update' | 'formulation_change' | 
                  'price_change' | 'guideline_update' | 'study_result';
      description: string;
      date: string;
      source?: string;
      impactLevel: 'major' | 'moderate' | 'minor'; // 影响程度
    }>;
    
    // === 微信分享优化字段 ===
    wechatShare?: {
      // 新药摘要（适合微信阅读）
      shortSummary?: string;
      
      // 关键卖点（适合列表展示）
      keyPoints?: string[];
      
      // 重要图表（用于微信卡片）
      shareImage?: string;
      
      // 快速参考表
      quickReference?: Array<{
        label: string;
        value: string;
        important?: boolean;
      }>;
      
      // 医生提醒
      doctorReminders?: string[];
      
      // 患者须知
      patientNotes?: string[];
    };
  };
}

/**
 * 新药查询特定选项
 */
export interface NewDrugQueryOptions {
  // 药品基本信息筛选
  drugClass?: string;
  atcCode?: string;
  prescriptionType?: string;
  
  // 适应症筛选
  indication?: string;
  medicalField?: string;
  
  // 厂家筛选
  manufacturer?: string;
  approvalCountry?: string;
  
  // 时间筛选
  approvalYear?: number;
  launchYear?: number;
  
  // 试验阶段筛选
  clinicalPhase?: string;
  
  // 价格筛选
  hasPriceInfo?: boolean;
  insuranceCoverage?: boolean;
  
  // 特殊人群筛选
  pediatricUse?: boolean;
  geriatricUse?: boolean;
}

/**
 * 新药统计信息
 */
export interface NewDrugStats {
  // 总量统计
  totalDrugs: number;
  newlyApproved: number;     // 今年新批准
  underReview: number;       // 在审评中
  
  // 分类统计
  byDrugClass: Record<string, number>;
  byManufacturer: Record<string, number>;
  byApprovalCountry: Record<string, number>;
  byApprovalYear: Record<number, number>;
  
  // 适应症分布
  topIndications: Array<{
    indication: string;
    count: number;
    percentage: number;
  }>;
  
  // 临床试验统计
  clinicalTrials: {
    total: number;
    byPhase: Record<string, number>;
    ongoing: number;
    completed: number;
  };
  
  // 市场统计
  marketStats: {
    coveredByInsurance: number;
    averagePrice: number;
    availabilityRate: number; // 可及性比率
  };
}

/**
 * 新药信息工具函数
 */
export const NewDrugUtils = {
  /**
   * 获取新药信息摘要
   */
  getDrugSummary(drug: NewDrugMessage['drugInfo']): string {
    const parts: string[] = [];
    
    if (drug.drugName) parts.push(`药品：${drug.drugName}`);
    if (drug.genericName) parts.push(`通用名：${drug.genericName}`);
    if (drug.manufacturer) parts.push(`厂家：${drug.manufacturer}`);
    if (drug.approvalDate) parts.push(`批准日期：${drug.approvalDate}`);
    if (drug.indications.length > 0) {
      parts.push(`适应症：${drug.indications.slice(0, 3).join('、')}`);
      if (drug.indications.length > 3) parts.push('等');
    }
    
    return parts.join(' | ');
  },
  
  /**
   * 检查是否为创新药
   */
  isInnovativeDrug(drug: NewDrugMessage['drugInfo']): boolean {
    // 创新药判断标准：新靶点、新机制、First-in-class等
    const innovativeKeywords = [
      'first-in-class', 'breakthrough', '创新', '新靶点', 
      '新机制', '首创', 'me-better', 'best-in-class'
    ];
    
    const text = JSON.stringify(drug).toLowerCase();
    return innovativeKeywords.some(keyword => text.includes(keyword));
  },
  
  /**
   * 获取价格信息描述
   */
  getPriceDescription(drug: NewDrugMessage['drugInfo']): string {
    if (!drug.marketInfo) return '价格信息未提供';
    
    const { priceRange, unitPrice, insuranceCoverage } = drug.marketInfo;
    const parts: string[] = [];
    
    if (priceRange) parts.push(`价格区间：${priceRange}`);
    if (unitPrice) parts.push(`单价：${unitPrice}元`);
    if (insuranceCoverage !== undefined) {
      parts.push(insuranceCoverage ? '医保覆盖：是' : '医保覆盖：否');
    }
    
    return parts.length > 0 ? parts.join(' | ') : '价格信息未提供';
  },
  
  /**
   * 生成微信分享内容
   */
  generateWechatShareContent(drugMessage: NewDrugMessage): string {
    const { drugInfo } = drugMessage;
    
    let content = `【新药信息】${drugMessage.title}\n\n`;
    
    // 基本信息
    content += `💊 药品名称：${drugInfo.drugName}\n`;
    if (drugInfo.genericName) content += `通用名：${drugInfo.genericName}\n`;
    content += `🏭 生产厂家：${drugInfo.manufacturer}\n`;
    if (drugInfo.approvalDate) content += `📅 批准日期：${drugInfo.approvalDate}\n\n`;
    
    // 适应症
    if (drugInfo.indications.length > 0) {
      content += `🎯 主要适应症：\n`;
      drugInfo.indications.slice(0, 3).forEach(indication => {
        content += `  • ${indication}\n`;
      });
      if (drugInfo.indications.length > 3) content += `  • 等${drugInfo.indications.length}个适应症\n`;
      content += '\n';
    }
    
    // 关键信息
    if (drugInfo.dosageForms && drugInfo.dosageForms.length > 0) {
      content += `📋 剂型规格：${drugInfo.dosageForms.join('、')}\n`;
    }
    
    if (drugInfo.mechanism) {
      content += `⚙️ 作用机制：${drugInfo.mechanism}\n`;
    }
    
    // 微信优化内容
    if (drugInfo.wechatShare?.shortSummary) {
      content += `\n📝 摘要：${drugInfo.wechatShare.shortSummary}\n`;
    }
    
    // 重要提示
    if (drugInfo.safetyInfo?.warnings && drugInfo.safetyInfo.warnings.length > 0) {
      content += `\n⚠️ 重要提示：\n`;
      drugInfo.safetyInfo.warnings.slice(0, 2).forEach(warning => {
        content += `  • ${warning}\n`;
      });
    }
    
    // 来源信息
    content += `\n—— 来源：众创医案平台\n`;
    content += `作者：${drugMessage.authorName} (${drugMessage.authorRole})\n`;
    if (drugMessage.institution) content += `机构：${drugMessage.institution}\n`;
    
    // 限制长度
    const maxLength = 2000; // 微信消息建议长度
    if (content.length > maxLength) {
      content = content.substring(0, maxLength - 3) + '...';
    }
    
    return content;
  },
  
  /**
   * 验证新药信息完整性
   */
  validateDrugInfo(drugInfo: NewDrugMessage['drugInfo']): {
    isValid: boolean;
    missingFields: string[];
    warnings: string[];
  } {
    const missingFields: string[] = [];
    const warnings: string[] = [];
    
    // 必填字段检查
    if (!drugInfo.drugName) missingFields.push('drugName');
    if (!drugInfo.manufacturer) missingFields.push('manufacturer');
    if (!drugInfo.indications || drugInfo.indications.length === 0) {
      missingFields.push('indications');
    }
    
    // 警告检查
    if (!drugInfo.approvalDate) warnings.push('未提供批准日期');
    if (!drugInfo.clinicalData) warnings.push('未提供临床试验数据');
    if (!drugInfo.safetyInfo) warnings.push('未提供安全性信息');
    
    return {
      isValid: missingFields.length === 0,
      missingFields,
      warnings
    };
  }
};

/**
 * 类型守卫 - 检查是否为NewDrugMessage
 */
export function isNewDrugMessage(message: MessageBase): message is NewDrugMessage {
  return message.category === MessageCategory.NEW_DRUG;
}