// src/shared/utils/patterns/medicalPatterns.ts

/**
 * 医学文本模式匹配规则库
 * 版本: v1.0.0
 * 说明: 基于规则的文本提取，无需AI，零成本
 */

// ==================== 患者信息匹配模式 ====================
export const PATIENT_PATTERNS = {
  // 标准格式: "患者，男性，56岁"
  standard: [
    { 
      pattern: /患者[，,]\s*([男女])[性]?[，,]\s*(\d+)[岁]/.source,
      type: 'standard',
      description: '标准格式：患者，男，56岁'
    },
    { 
      pattern: /患者[，,]\s*(\S{2,10})[，,]\s*(\d+)[岁]/.source,
      type: 'withName',
      description: '带姓名：患者，张三，56岁'
    }
  ],

  // 简洁格式: "男，56岁" 或 "56岁男性"
  simple: [
    { 
      pattern: /([男女])[，,]\s*(\d+)[岁]/.source,
      type: 'simple',
      description: '简洁格式：男，56岁'
    },
    { 
      pattern: /(\d+)[岁]\s*([男女])性?/.source,
      type: 'reverse',
      description: '反向格式：56岁男性'
    }
  ],

  // 隐含格式: "患者头痛发热3天" (无明确年龄性别)
  implied: [
    { 
      pattern: /患者/.source,
      type: 'implied',
      description: '隐含患者信息'
    }
  ],

  // 英文/数字混合: "Male, 56y"
  english: [
    { 
      pattern: /([Mm]ale|[Ff]emale)[,\s]+(\d+)[y]/.source,
      type: 'english',
      description: '英文格式'
    }
  ]
};

// ==================== 症状关键词库 ====================
export const SYMPTOM_KEYWORDS = [
  // 全身症状
  '发热', '发烧', '畏寒', '寒战', '乏力', '疲倦', '消瘦', '盗汗',
  
  // 呼吸系统
  '咳嗽', '咳痰', '干咳', '胸痛', '胸闷', '气促', '呼吸困难', '喘憋',
  
  // 循环系统
  '心悸', '心慌', '胸骨后疼痛', '压榨感', '水肿',
  
  // 消化系统
  '恶心', '呕吐', '腹痛', '腹胀', '腹泻', '便秘', '纳差', '食欲不振',
  
  // 神经系统
  '头痛', '头晕', '眩晕', '失眠', '嗜睡', '意识障碍',
  
  // 肌肉骨骼
  '关节痛', '肌肉痛', '腰痛', '颈痛', '活动受限',
  
  // 皮肤
  '皮疹', '瘙痒', '红肿', '溃瘍',
  
  // 泌尿系统
  '尿频', '尿急', '尿痛', '血尿',
  
  // 五官
  '咽痛', '咽部不适', '鼻塞', '流涕', '耳鸣', '视力模糊'
];

// 症状同义词映射（统一术语）
export const SYMPTOM_SYNONYMS: Record<string, string> = {
  '发烧': '发热',
  '头疼': '头痛',
  '肚子疼': '腹痛',
  '拉肚子': '腹泻',
  '大便干燥': '便秘',
  '心口疼': '胸痛',
  '喘不上气': '呼吸困难',
  '没劲儿': '乏力',
  '不想吃饭': '纳差'
};

// ==================== 诊断匹配模式 ====================
export const DIAGNOSIS_PATTERNS = [
  // 明确诊断格式
  { 
    pattern: /诊断[：:]\s*([^。；，\n]+)/.source,
    weight: 10,
    type: 'explicit',
    description: '诊断：XXX'
  },
  { 
    pattern: /诊断为\s*([^。；，\n]+)/.source,
    weight: 9,
    type: 'explicit',
    description: '诊断为XXX'
  },
  { 
    pattern: /确诊[：:]\s*([^。；，\n]+)/.source,
    weight: 9,
    type: 'explicit',
    description: '确诊：XXX'
  },
  
  // 隐含诊断格式
  { 
    pattern: /考虑\s*([^。；，\n]+?)[。，]/.source,
    weight: 7,
    type: 'implicit',
    description: '考虑XXX'
  },
  { 
    pattern: /拟诊[断]?\s*([^。；，\n]+)/.source,
    weight: 7,
    type: 'implicit',
    description: '拟诊XXX'
  },
  { 
    pattern: /印象[：:]\s*([^。；，\n]+)/.source,
    weight: 6,
    type: 'implicit',
    description: '印象：XXX'
  },
  
  // 关键词匹配（常见疾病）
  { 
    pattern: /(冠心病|高血压|糖尿病|肺炎|感冒|流感|上呼吸道感染|胃炎|溃疡|关节炎)/.source,
    weight: 5,
    type: 'keyword',
    description: '疾病关键词'
  }
];

// 常见疾病关键词
export const COMMON_DISEASES = [
  '冠心病', '高血压', '糖尿病', '肺炎', '感冒', '流感',
  '上呼吸道感染', '支气管炎', '胃炎', '胃溃疡', '关节炎',
  '痛风', '甲亢', '甲减', '肝炎', '肾炎', '贫血'
];

// ==================== 治疗匹配模式 ====================
export const TREATMENT_PATTERNS = [
  // 明确治疗格式
  { 
    pattern: /治疗[：:]\s*([^。；，\n]+)/.source,
    weight: 10,
    type: 'explicit',
    description: '治疗：XXX'
  },
  { 
    pattern: /治疗方案[：:]\s*([^。；，\n]+)/.source,
    weight: 9,
    type: 'explicit',
    description: '治疗方案：XXX'
  },
  
  // 用药格式
  { 
    pattern: /给予\s*([^。；，\n]+?)[治疗用药]/.source,
    weight: 8,
    type: 'medication',
    description: '给予XXX治疗'
  },
  { 
    pattern: /使用\s*([^。；，\n]+?)[药物]/.source,
    weight: 8,
    type: 'medication',
    description: '使用XXX药物'
  },
  { 
    pattern: /服用\s*([^。；，\n]+)/.source,
    weight: 7,
    type: 'medication',
    description: '服用XXX'
  },
  { 
    pattern: /用\s*([^。；，\n]+?)\s*治疗/.source,
    weight: 7,
    type: 'medication',
    description: '用XXX治疗'
  },
  
  // 手术格式
  { 
    pattern: /手术[：:]\s*([^。；，\n]+)/.source,
    weight: 8,
    type: 'surgery',
    description: '手术：XXX'
  },
  { 
    pattern: /行\s*([^。；，\n]+?)\s*术/.source,
    weight: 8,
    type: 'surgery',
    description: '行XXX术'
  }
];

// ==================== 疗效匹配模式 ====================
export const EFFICACY_PATTERNS = [
  // 正向疗效
  { 
    pattern: /(效果|疗效)(良好|显著|明显|满意|不错)/.source,
    type: 'positive',
    description: '效果良好'
  },
  { 
    pattern: /(症状|病情)(缓解|减轻|好转|改善|消失)/.source,
    type: 'positive',
    description: '症状缓解'
  },
  { 
    pattern: /(治愈|痊愈|康复)/.source,
    type: 'positive',
    description: '治愈'
  },
  { 
    pattern: /有效/.source,
    type: 'positive',
    description: '有效'
  },
  
  // 负向疗效
  { 
    pattern: /(效果|疗效)(不佳|差|不好|不明显)/.source,
    type: 'negative',
    description: '效果不佳'
  },
  { 
    pattern: /(症状|病情)(加重|恶化|反复|未缓解)/.source,
    type: 'negative',
    description: '症状加重'
  },
  { 
    pattern: /无效/.source,
    type: 'negative',
    description: '无效'
  },
  
  // 中性/待观察
  { 
    pattern: /(继续|待|观察|随访)/.source,
    type: 'unknown',
    description: '待观察'
  }
];

// ==================== 药品关键词库 ====================
export const MEDICATION_KEYWORDS = [
  // 心血管类
  '阿司匹林', '氯吡格雷', '华法林', '利伐沙班',
  '硝苯地平', '氨氯地平', '非洛地平',
  '依那普利', '贝那普利', '培哚普利',
  '氯沙坦', '缬沙坦', '厄贝沙坦', '替米沙坦',
  '美托洛尔', '比索洛尔', '卡维地洛',
  '阿托伐他汀', '瑞舒伐他汀', '辛伐他汀',
  
  // 降糖类
  '二甲双胍', '格列本脲', '格列美脲', '格列齐特',
  '胰岛素', '门冬胰岛素', '甘精胰岛素',
  '阿卡波糖', '伏格列波糖',
  '西格列汀', '利格列汀',
  
  // 抗生素类
  '青霉素', '阿莫西林', '氨苄西林',
  '头孢', '头孢克洛', '头孢克肟', '头孢呋辛',
  '阿奇霉素', '克拉霉素', '红霉素',
  '左氧氟沙星', '莫西沙星',
  
  // 消化类
  '奥美拉唑', '兰索拉唑', '泮托拉唑', '雷贝拉唑',
  '多潘立酮', '莫沙必利',
  '乳果糖', '聚乙二醇',
  
  // 止痛类
  '布洛芬', '对乙酰氨基酚', '双氯芬酸', '塞来昔布',
  
  // 呼吸类
  '氨溴索', '乙酰半胱氨酸', '沙丁胺醇',
  '氯雷他定', '西替利嗪', '氯苯那敏',
  
  // 中成药
  '连花清瘟', '板蓝根', '感冒灵', '藿香正气',
  '六味地黄丸', '金匮肾气丸', '逍遥丸'
];

// ==================== 药品分类映射 ====================
export const MEDICATION_CATEGORIES: Record<string, string> = {
  // 心血管
  '阿司匹林': '抗血小板',
  '氯吡格雷': '抗血小板',
  '硝苯地平': '钙通道阻滞剂',
  '依那普利': 'ACEI',
  '氯沙坦': 'ARB',
  '美托洛尔': 'β受体阻滞剂',
  '阿托伐他汀': '他汀类',
  
  // 降糖
  '二甲双胍': '双胍类',
  '胰岛素': '胰岛素',
  '格列美脲': '磺脲类',
  
  // 其他
  '布洛芬': 'NSAIDs',
  '奥美拉唑': '质子泵抑制剂',
  '阿莫西林': '青霉素类'
};

// ==================== 导出所有模式 ====================
export const MEDICAL_PATTERNS = {
  patient: PATIENT_PATTERNS,
  symptoms: SYMPTOM_KEYWORDS,
  symptomSynonyms: SYMPTOM_SYNONYMS,
  diagnosis: DIAGNOSIS_PATTERNS,
  treatment: TREATMENT_PATTERNS,
  efficacy: EFFICACY_PATTERNS,
  medications: MEDICATION_KEYWORDS,
  medicationCategories: MEDICATION_CATEGORIES,
  commonDiseases: COMMON_DISEASES
};

// ==================== 辅助函数 ====================

/**
 * 合并所有患者匹配模式为正则表达式
 */
export function getAllPatientPatterns(): RegExp[] {
  const allPatterns = [
    ...PATIENT_PATTERNS.standard,
    ...PATIENT_PATTERNS.simple,
    ...PATIENT_PATTERNS.implied,
    ...PATIENT_PATTERNS.english
  ];
  return allPatterns.map(p => new RegExp(p.pattern, 'i'));
}

/**
 * 获取所有诊断匹配模式（按权重排序）
 */
export function getDiagnosisPatternsByWeight(): Array<{pattern: RegExp, weight: number}> {
  return DIAGNOSIS_PATTERNS
    .map(p => ({
      pattern: new RegExp(p.pattern, 'i'),
      weight: p.weight
    }))
    .sort((a, b) => b.weight - a.weight);
}

/**
 * 获取所有治疗匹配模式（按权重排序）
 */
export function getTreatmentPatternsByWeight(): Array<{pattern: RegExp, weight: number}> {
  return TREATMENT_PATTERNS
    .map(p => ({
      pattern: new RegExp(p.pattern, 'i'),
      weight: p.weight
    }))
    .sort((a, b) => b.weight - a.weight);
}

/**
 * 标准化症状术语
 */
export function normalizeSymptom(symptom: string): string {
  return SYMPTOM_SYNONYMS[symptom] || symptom;
}

/**
 * 获取药品分类
 */
export function getDrugCategory(drugName: string): string {
  return MEDICATION_CATEGORIES[drugName] || '其他';
}

// ==================== 默认导出 ====================
export default MEDICAL_PATTERNS;