// src/shared/services/aiDrugAdvisor.ts

/**
 * AI用药指导服务
 * 基于患者画像提供个性化用药建议
 */

export interface PatientProfile {
  age?: number;
  isElderly?: boolean;        // 老年人（>65岁）
  isChild?: boolean;          // 儿童（<12岁）
  isPregnant?: boolean;       // 孕妇
  isLactating?: boolean;      // 哺乳期
  conditions?: string[];      // 基础病（高血压、糖尿病、消化道溃疡、肝肾功能不全等）
  allergies?: string[];       // 过敏史（如阿司匹林、磺胺类）
  medications?: string[];     // 正在服用的药物（用于检查相互作用）
}

export interface DrugAdvice {
  drugName: string;
  drugClass: string;
  suitability: '首选' | '可选' | '慎用' | '禁用';
  reason: string;
  dosage?: string;
  precautions: string[];
  sideEffects?: string[];
}

export interface PainAdvice {
  painLevel: '轻度' | '中度' | '重度' | '神经痛';
  description: string;
  recommendedClass: string;
  firstChoice: DrugAdvice[];
  alternatives: DrugAdvice[];
  warnings: string[];
  whenToSeeDoctor: string;
  drugInteractions?: string[];
}

export interface ComparisonResult {
  drugs: Array<{
    name: string;
    pros: string[];
    cons: string[];
    suitableFor: string[];
    notSuitableFor: string[];
  }>;
  recommendation: string;
}

class AIDrugAdvisor {
  
  // 药物知识库
  private drugKnowledgeBase = [
    {
      name: '布洛芬',
      class: '非甾体抗炎药（非选择性COX抑制剂）',
      level: '轻度',
      description: '常用的解热镇痛药，适用于轻中度疼痛',
      indications: ['头痛', '牙痛', '关节痛', '肌肉痛', '痛经', '发热'],
      pros: ['口服方便', '起效快', '价格低廉', '非处方药易获取'],
      cons: ['胃肠道刺激', '心血管风险', '每日需多次服用'],
      dosage: {
        adult: '一次200-400mg，一日3-4次（最大日剂量1200mg）',
        child: '5-10mg/kg/次，一日3次',
        elderly: '起始剂量减半'
      },
      precautions: [
        '饭后服用减少胃部刺激',
        '避免与酒精同服',
        '连续使用不超过3天（止痛）或2周（退热）',
        '避免与其他NSAIDs联用'
      ],
      sideEffects: ['胃部不适', '恶心', '消化道出血', '头痛', '皮疹'],
      contraindications: ['消化道溃疡', '严重肝肾功能不全', '心血管疾病急性期', '孕妇（尤其晚期）'],
      allergies: ['阿司匹林过敏'],
      interactions: ['华法林（增加出血风险）', '降压药（降低降压效果）', '糖皮质激素（增加胃肠道风险）'],
      specialGroups: {
        elderly: '慎用，需监测肾功能',
        child: '6个月以上可用',
        pregnant: '禁用（尤其晚期）',
        nursing: '慎用'
      }
    },
    {
      name: '塞来昔布',
      class: '非甾体抗炎药（COX-2选择性抑制剂）',
      level: '轻度',
      description: '选择性COX-2抑制剂，胃肠道安全性更高',
      indications: ['关节炎', '类风湿关节炎', '强直性脊柱炎', '急性疼痛'],
      pros: ['胃肠道刺激小', '每日1-2次用药方便', '适合有胃病史患者'],
      cons: ['心血管风险需关注', '价格较高', '处方药'],
      dosage: {
        adult: '一次100-200mg，一日1-2次',
        elderly: '起始剂量减半'
      },
      precautions: [
        '有心血管疾病史者慎用',
        '监测血压',
        '避免与抗凝药联用'
      ],
      sideEffects: ['水肿', '高血压', '头痛', '消化不良'],
      contraindications: ['磺胺类药物过敏', '严重心血管疾病', '孕妇'],
      allergies: ['磺胺类'],
      interactions: ['抗凝药（增加出血风险）', '降压药（影响降压效果）'],
      specialGroups: {
        elderly: '相对安全',
        pregnant: '禁用',
        nursing: '慎用'
      }
    },
    {
      name: '对乙酰氨基酚',
      class: '解热镇痛药',
      level: '轻度',
      description: '安全性最高的止痛药，无胃肠道刺激',
      indications: ['头痛', '牙痛', '发热', '轻度疼痛'],
      pros: ['胃肠道刺激小', '儿童可用', '孕妇相对安全', '不升高血压'],
      cons: ['无抗炎作用', '过量伤肝'],
      dosage: {
        adult: '一次325-650mg，一日3-4次（最大日剂量3g）',
        child: '按体重计算，10-15mg/kg/次',
        elderly: '减量'
      },
      precautions: [
        '避免与含对乙酰氨基酚的复方感冒药同服',
        '服药期间禁酒',
        '肝功能不全者减量'
      ],
      sideEffects: ['过量导致肝损伤'],
      contraindications: ['严重肝功能不全'],
      allergies: [],
      interactions: ['酒精（增加肝毒性）', '华法林（增强抗凝效果）'],
      specialGroups: {
        elderly: '安全',
        child: '安全',
        pregnant: '相对安全',
        nursing: '安全'
      }
    },
    {
      name: '曲马多',
      class: '弱阿片类',
      level: '中度',
      description: '中枢性镇痛药，用于中度至中度偏重疼痛',
      indications: ['术后疼痛', '癌痛', '中度慢性疼痛'],
      pros: ['无成瘾性（相对）', '镇痛效果优于NSAIDs'],
      cons: ['头晕', '便秘', '恶心', '需处方'],
      dosage: {
        adult: '一次50-100mg，一日3-4次（最大日剂量400mg）',
        elderly: '减量'
      },
      precautions: [
        '连续使用不超过7天',
        '避免与酒精同服',
        '可能影响驾驶',
        '突然停药可致戒断反应'
      ],
      sideEffects: ['头晕', '嗜睡', '便秘', '恶心', '出汗'],
      contraindications: ['呼吸抑制', '颅脑损伤', '癫痫未控制'],
      allergies: [],
      interactions: ['酒精（加重呼吸抑制）', '镇静剂（增强中枢抑制）', 'SSRI类抗抑郁药（增加癫痫风险）'],
      specialGroups: {
        elderly: '减量',
        child: '不推荐',
        pregnant: '慎用',
        nursing: '慎用'
      }
    },
    {
      name: '加巴喷丁',
      class: '抗惊厥药',
      level: '神经痛',
      description: '神经病理性疼痛的一线用药',
      indications: ['带状疱疹后神经痛', '糖尿病性神经痛', '坐骨神经痛', '癫痫'],
      pros: ['神经痛特效', '无成瘾性', '可与阿片类联用减少阿片用量'],
      cons: ['嗜睡', '头晕', '需逐步加量'],
      dosage: {
        adult: '起始300mg睡前，逐渐加量至900-1800mg/日',
        elderly: '减量'
      },
      precautions: [
        '逐步加量以减少副作用',
        '不可突然停药',
        '避免驾驶'
      ],
      sideEffects: ['嗜睡', '头晕', '共济失调', '周围性水肿'],
      contraindications: ['严重肾功能不全'],
      allergies: [],
      interactions: ['抗酸药（降低吸收）', '中枢抑制剂（增强镇静作用）'],
      specialGroups: {
        elderly: '减量',
        child: '遵医嘱',
        pregnant: '慎用',
        nursing: '慎用'
      }
    },
    {
      name: '普瑞巴林',
      class: '抗惊厥药',
      level: '神经痛',
      description: '神经病理性疼痛一线用药，起效快',
      indications: ['带状疱疹后神经痛', '糖尿病性神经痛', '纤维肌痛', '坐骨神经痛'],
      pros: ['起效快', '神经痛特效', '改善睡眠'],
      cons: ['嗜睡', '头晕', '体重增加'],
      dosage: {
        adult: '起始75mg一日2次，可增至150mg一日2次',
        elderly: '减量'
      },
      precautions: [
        '不可突然停药',
        '避免驾驶',
        '监测体重'
      ],
      sideEffects: ['嗜睡', '头晕', '口干', '视力模糊', '体重增加'],
      contraindications: ['严重肾功能不全'],
      allergies: [],
      interactions: ['中枢抑制剂（增强镇静作用）'],
      specialGroups: {
        elderly: '减量',
        pregnant: '慎用',
        nursing: '慎用'
      }
    },
    {
      name: '阿米替林',
      class: '三环类抗抑郁药',
      level: '神经痛',
      description: '用于神经病理性疼痛和预防头痛',
      indications: ['神经病理性疼痛', '预防偏头痛', '慢性疼痛伴抑郁'],
      pros: ['神经痛有效', '改善睡眠', '价格低'],
      cons: ['嗜睡', '口干', '便秘', '心脏毒性'],
      dosage: {
        adult: '起始10-25mg睡前，逐渐加量',
        elderly: '起始10mg'
      },
      precautions: [
        '睡前服用',
        '监测心电图',
        '不可突然停药'
      ],
      sideEffects: ['嗜睡', '口干', '便秘', '视力模糊', '心悸'],
      contraindications: ['青光眼', '前列腺增生', '心律失常', '近期心梗'],
      allergies: [],
      interactions: ['MAO抑制剂（禁用）', '降压药（增强降压效果）'],
      specialGroups: {
        elderly: '慎用',
        pregnant: '慎用',
        nursing: '慎用'
      }
    }
  ];

  /**
   * 根据疼痛描述和患者情况提供用药建议
   */
  adviseForPain(painDescription: string, patient: PatientProfile): PainAdvice {
    // 1. 判断疼痛类型和程度
    const painLevel = this.assessPainLevel(painDescription);
    const painType = this.assessPainType(painDescription);
    
    // 2. 根据患者情况筛选安全药物
    const allDrugs = this.drugKnowledgeBase;
    const safeDrugs = this.filterByPatient(allDrugs, patient);
    
    // 3. 根据疼痛类型和程度筛选
    let candidateDrugs = safeDrugs;
    if (painType === '神经痛') {
      candidateDrugs = safeDrugs.filter(d => d.level === '神经痛');
    } else {
      candidateDrugs = safeDrugs.filter(d => d.level === painLevel);
    }
    
    // 4. 生成推荐
    const firstChoice = candidateDrugs.slice(0, 2).map(d => this.drugToAdvice(d, '首选'));
    const alternatives = candidateDrugs.slice(2, 4).map(d => this.drugToAdvice(d, '可选'));
    
    // 5. 生成警告
    const warnings = this.generateWarnings(patient, painDescription);
    
    // 6. 检查药物相互作用
    const interactions = this.checkInteractions(candidateDrugs, patient);
    
    return {
      painLevel: painType === '神经痛' ? '神经痛' : painLevel,
      description: this.getPainLevelDescription(painDescription, painLevel),
      recommendedClass: this.getRecommendedClass(painLevel, painType),
      firstChoice,
      alternatives,
      warnings,
      whenToSeeDoctor: this.getDoctorAdvice(painDescription, patient),
      drugInteractions: interactions
    };
  }

  /**
   * 比较两种药物
   */
  compareDrugs(drugName1: string, drugName2: string): ComparisonResult | null {
    const drug1 = this.drugKnowledgeBase.find(d => d.name === drugName1);
    const drug2 = this.drugKnowledgeBase.find(d => d.name === drugName2);
    
    if (!drug1 || !drug2) return null;
    
    return {
      drugs: [
        {
          name: drug1.name,
          pros: drug1.pros,
          cons: drug1.cons,
          suitableFor: drug1.indications,
          notSuitableFor: drug1.contraindications
        },
        {
          name: drug2.name,
          pros: drug2.pros,
          cons: drug2.cons,
          suitableFor: drug2.indications,
          notSuitableFor: drug2.contraindications
        }
      ],
      recommendation: this.generateComparisonRecommendation(drug1, drug2)
    };
  }

  /**
   * 获取特定疼痛的建议
   */
  adviseForSpecificPain(painType: string, patient: PatientProfile): DrugAdvice[] {
    const drugs = this.drugKnowledgeBase.filter(d => 
      d.indications.some(i => i.includes(painType))
    );
    
    const safeDrugs = this.filterByPatient(drugs, patient);
    
    return safeDrugs.map(d => this.drugToAdvice(d, '可选'));
  }

  /**
   * 评估疼痛程度
   */
  private assessPainLevel(description: string): '轻度' | '中度' | '重度' {
    const lowerDesc = description.toLowerCase();
    
    // 重度疼痛关键词
    const severeKeywords = ['剧烈', '无法忍受', '刀割样', '撕裂样', '持续不断', '无法入睡'];
    if (severeKeywords.some(k => lowerDesc.includes(k))) {
      return '重度';
    }
    
    // 中度疼痛关键词
    const moderateKeywords = ['明显', '影响睡眠', '阵发性', '反复发作', '中等程度'];
    if (moderateKeywords.some(k => lowerDesc.includes(k))) {
      return '中度';
    }
    
    return '轻度';
  }

  /**
   * 评估疼痛类型
   */
  private assessPainType(description: string): '普通' | '神经痛' {
    const neuroKeywords = ['神经', '刺痛', '麻木', '灼烧', '放电', '针刺'];
    if (neuroKeywords.some(k => description.includes(k))) {
      return '神经痛';
    }
    return '普通';
  }

  /**
   * 根据患者情况筛选安全药物
   */
  private filterByPatient(drugs: any[], patient: PatientProfile): any[] {
    return drugs.filter(drug => {
      // 老年人筛选
      if (patient.isElderly && drug.specialGroups.elderly === '禁用') return false;
      
      // 儿童筛选
      if (patient.isChild && drug.specialGroups.child === '禁用') return false;
      
      // 孕妇筛选
      if (patient.isPregnant && drug.specialGroups.pregnant === '禁用') return false;
      
      // 哺乳期筛选
      if (patient.isLactating && drug.specialGroups.nursing === '禁用') return false;
      
      // 基础病筛选
      if (patient.conditions) {
        for (const condition of patient.conditions) {
          if (drug.contraindications.some((c: string) => c.includes(condition))) {
            return false;
          }
        }
      }
      
      // 过敏史筛选
      if (patient.allergies) {
        for (const allergy of patient.allergies) {
          if (drug.allergies.some((a: string) => a.includes(allergy))) {
            return false;
          }
        }
      }
      
      return true;
    });
  }

  /**
   * 药物转建议格式
   */
  private drugToAdvice(drug: any, suitability: '首选' | '可选' | '慎用' | '禁用'): DrugAdvice {
    return {
      drugName: drug.name,
      drugClass: drug.class,
      suitability,
      reason: this.generateReason(drug, suitability),
      dosage: this.getDosageByPatient(drug),
      precautions: drug.precautions.slice(0, 3),
      sideEffects: drug.sideEffects.slice(0, 3)
    };
  }

  /**
   * 生成推荐理由
   */
  private generateReason(drug: any, suitability: string): string {
    if (suitability === '首选') {
      return `${drug.name}是${drug.level}疼痛的常用药物，${drug.pros[0]}。${drug.description}`;
    }
    return `${drug.name}可作为备选，${drug.description}`;
  }

  /**
   * 根据患者情况获取剂量
   */
  private getDosageByPatient(drug: any): string | undefined {
    // 简化版，实际应根据患者情况返回
    return drug.dosage.adult;
  }

  /**
   * 生成警告信息
   */
  private generateWarnings(patient: PatientProfile, painDesc: string): string[] {
    const warnings = [];
    
    // 特殊人群警告
    if (patient.isElderly) {
      warnings.push('👴 老年人：起始剂量应为成人剂量的50%，需监测肝肾功能和出血风险');
    }
    
    if (patient.isChild) {
      warnings.push('🧒 儿童：6个月以下禁用布洛芬，所有药物需按体重计算剂量');
    }
    
    if (patient.isPregnant) {
      warnings.push('🤰 孕妇：禁用所有NSAIDs（尤其妊娠晚期），对乙酰氨基酚相对安全但需咨询医生');
    }
    
    if (patient.isLactating) {
      warnings.push('🤱 哺乳期：慎用阿片类药物，可能通过乳汁影响婴儿');
    }
    
    // 基础病警告
    if (patient.conditions?.includes('高血压')) {
      warnings.push('💊 高血压患者：NSAIDs可能升高血压，优先选择对乙酰氨基酚');
    }
    
    if (patient.conditions?.includes('糖尿病')) {
      warnings.push('💉 糖尿病患者：NSAIDs可能增加低血糖风险，需加强血糖监测');
    }
    
    if (patient.conditions?.includes('消化道溃疡')) {
      warnings.push('🩹 消化道溃疡患者：禁用非选择性NSAIDs，可考虑COX-2抑制剂（如塞来昔布）并加用胃黏膜保护剂');
    }
    
    if (patient.conditions?.includes('肝肾功能不全')) {
      warnings.push('🩺 肝肾功能不全患者：需调整剂量，避免使用对乙酰氨基酚（肝）和NSAIDs（肾）');
    }
    
    // 症状相关警告
    if (painDesc.includes('胸痛')) {
      warnings.push('❤️ 胸痛可能是心梗信号，如伴出汗、呼吸困难请立即就医');
    }
    
    if (painDesc.includes('头痛') && patient.conditions?.includes('高血压')) {
      warnings.push('💆 高血压患者剧烈头痛可能预示血压升高，请监测血压');
    }
    
    return warnings;
  }

  /**
   * 检查药物相互作用
   */
  private checkInteractions(drugs: any[], patient: PatientProfile): string[] {
    const interactions: string[] = [];
    
    if (!patient.medications?.length) return [];
    
    for (const drug of drugs) {
      for (const med of patient.medications) {
        const interaction = drug.interactions.find((i: string) => i.includes(med));
        if (interaction) {
          interactions.push(`${drug.name}与${med}可能存在相互作用：${interaction}`);
        }
      }
    }
    
    return interactions.slice(0, 3);
  }

  /**
   * 获取疼痛程度描述
   */
  private getPainLevelDescription(description: string, level: string): string {
    return `您描述的疼痛"${description}"，评估为**${level}疼痛**。`;
  }

  /**
   * 获取推荐药物类别
   */
  private getRecommendedClass(level: string, type: string): string {
    if (type === '神经痛') {
      return '抗惊厥药（如加巴喷丁、普瑞巴林）、三环类抗抑郁药（如阿米替林）';
    }
    
    const map = {
      '轻度': '非甾体抗炎药（NSAIDs）如布洛芬、双氯芬酸钠，或对乙酰氨基酚',
      '中度': '弱阿片类（如曲马多）或强效NSAIDs',
      '重度': '强阿片类（需医生处方）'
    };
    return map[level];
  }

  /**
   * 生成比较推荐
   */
  private generateComparisonRecommendation(drug1: any, drug2: any): string {
    if (drug1.class === drug2.class) {
      return `${drug1.name}和${drug2.name}属于同一类药物，作用机制相似。选择时需考虑：${drug1.name}${drug1.pros[0]}，${drug2.name}${drug2.pros[0]}。建议根据您对副作用的耐受性和医生建议选择。`;
    }
    
    return `${drug1.name}属于${drug1.class}，${drug1.pros[0]}；${drug2.name}属于${drug2.class}，${drug2.pros[0]}。两者适用于不同类型的疼痛，建议根据您的具体情况选择。`;
  }

  /**
   * 获取就医建议
   */
  private getDoctorAdvice(painDesc: string, patient: PatientProfile): string {
    const emergencySigns = [
      '胸痛放射到左肩',
      '剧烈头痛伴呕吐',
      '腹痛伴发热',
      '外伤后疼痛加重',
      '疼痛伴意识模糊'
    ];
    
    if (emergencySigns.some(sign => painDesc.includes(sign))) {
      return '⚠️ **立即就医！** 这些症状可能危及生命，请立即前往医院急诊科。';
    }
    
    if (patient.isPregnant) {
      return '🤰 孕妇用药需特别谨慎，建议咨询妇产科医生后再使用任何止痛药。';
    }
    
    if (patient.isChild && patient.age && patient.age < 2) {
      return '👶 2岁以下婴幼儿用药需遵医嘱，请及时就医。';
    }
    
    return '📋 用药3天后疼痛未缓解或加重，请及时就医进行详细检查。';
  }
}

// ========== 导出单例 ==========
const instance = new AIDrugAdvisor();
export const aiDrugAdvisor = instance;

if (typeof window !== 'undefined') {
  (window as any).aiDrugAdvisor = instance;
}