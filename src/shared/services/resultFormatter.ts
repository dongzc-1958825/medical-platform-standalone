// src/shared/services/resultFormatter.ts

/**
 * 搜索结果格式化服务
 * 将海量搜索结果整理成结构化卡片
 * 让用户一目了然
 */

export interface FormattedDrugCard {
  // 基本信息（一眼看到）
  name: string;
  category: string;
  matchScore: number;
  
  // 关键信息（3-5条，最多）
  keyPoints: string[];
  
  // 详细字段（点击展开）
  details: {
    indications: string[];
    contraindications: string[];
    usage: string;
    sideEffects: string[];
    manufacturer: string;
    approvalNumber?: string;
    insuranceType?: string;
    price?: string;
  };
  
  // 来源标记
  source: '国产' | '进口' | '国际';
  sourceLabel: string;
  verified: boolean;
  origin?: string;
  
  // 操作
  actions: {
    collect: boolean;
    share: boolean;
    compare: boolean;
  };
}

export interface FormattedCaseCard {
  title: string;
  matchScore: number;
  keyPoints: string[];
  details?: {
    patientInfo: string;
    symptoms: string[];
    diagnosis: string;
    treatment: string;
    efficacy: string;
    hospital?: string;
    doctor?: string;
  };
  source: 'platform' | 'yiigle' | 'pubmed';
  sourceLabel: string;
  actions: {
    collect: boolean;
    share: boolean;
    reference: boolean;
  };
}

class ResultFormatter {
  
  // 英文到中文的映射（全部小写，便于匹配）
  private translationMap: Record<string, string> = {
    // 痛风/降尿酸药
    'allopurinol': '别嘌醇',
    'febuxostat': '非布司他',
    'colchicine': '秋水仙碱',
    'probenecid': '丙磺舒',
    'benzbromarone': '苯溴马隆',
    
    // 非甾体抗炎药
    'ibuprofen': '布洛芬',
    'aspirin': '阿司匹林',
    'naproxen': '萘普生',
    'diclofenac': '双氯芬酸钠',
    'celecoxib': '塞来昔布',
    'ketoprofen': '酮洛芬',
    'indomethacin': '吲哚美辛',
    
    // 神经痛药物
    'gabapentin': '加巴喷丁',
    'pregabalin': '普瑞巴林',
    'amitriptyline': '阿米替林',
    'duloxetine': '度洛西汀',
    'carbamazepine': '卡马西平',
    
    // 降压药
    'amlodipine': '氨氯地平',
    'nifedipine': '硝苯地平',
    'felodipine': '非洛地平',
    'lisinopril': '赖诺普利',
    'enalapril': '依那普利',
    'losartan': '氯沙坦',
    'valsartan': '缬沙坦',
    'irbesartan': '厄贝沙坦',
    'metoprolol': '美托洛尔',
    'atenolol': '阿替洛尔',
    'hydrochlorothiazide': '氢氯噻嗪',
    
    // 降糖药
    'metformin': '二甲双胍',
    'glimepiride': '格列美脲',
    'gliclazide': '格列齐特',
    'sitagliptin': '西格列汀',
    'empagliflozin': '恩格列净',
    'dapagliflozin': '达格列净',
    'insulin': '胰岛素',
    
    // 降脂药
    'atorvastatin': '阿托伐他汀',
    'rosuvastatin': '瑞舒伐他汀',
    'simvastatin': '辛伐他汀',
    'pravastatin': '普伐他汀',
    
    // 抗生素
    'amoxicillin': '阿莫西林',
    'cefalexin': '头孢氨苄',
    'azithromycin': '阿奇霉素',
    'clarithromycin': '克拉霉素',
    'levofloxacin': '左氧氟沙星',
    'ciprofloxacin': '环丙沙星',
    'erythromycin': '红霉素',
    
    // 镇静催眠药
    'zolpidem': '唑吡坦',
    'eszopiclone': '右佐匹克隆',
    'zaleplon': '扎来普隆',
    'melatonin': '褪黑素',
    'diazepam': '地西泮',
    'lorazepam': '劳拉西泮',
    
    // 抗抑郁药
    'fluoxetine': '氟西汀',
    'sertraline': '舍曲林',
    'paroxetine': '帕罗西汀',
    'citalopram': '西酞普兰',
    'escitalopram': '艾司西酞普兰',
    
    // 抗过敏药
    'loratadine': '氯雷他定',
    'cetirizine': '西替利嗪',
    'fexofenadine': '非索非那定',
    'diphenhydramine': '苯海拉明',
    
    // 症状/适应症
    'pain': '疼痛',
    'neuropathic pain': '神经病理性疼痛',
    'postherpetic neuralgia': '带状疱疹后神经痛',
    'sciatica': '坐骨神经痛',
    'diabetic neuropathy': '糖尿病性神经痛',
    'headache': '头痛',
    'migraine': '偏头痛',
    'arthritis': '关节炎',
    'rheumatoid arthritis': '类风湿关节炎',
    'osteoarthritis': '骨关节炎',
    'gout': '痛风',
    'hypertension': '高血压',
    'diabetes': '糖尿病',
    'hyperlipidemia': '高血脂',
    'insomnia': '失眠',
    'allergy': '过敏',
    
    // 禁忌/副作用
    'contraindication': '禁忌',
    'side effect': '副作用',
    'gastrointestinal': '胃肠道',
    'bleeding': '出血',
    'ulcer': '溃疡',
    'dizziness': '头晕',
    'drowsiness': '嗜睡',
    'nausea': '恶心',
    'vomiting': '呕吐',
    'constipation': '便秘',
    'dry mouth': '口干'
  };

  // 常用药品白名单（用于过滤不常见药品）
  private commonDrugs: string[] = [
    'allopurinol', 'febuxostat', 'colchicine', 'ibuprofen', 'aspirin',
    'gabapentin', 'pregabalin', 'amitriptyline', 'metformin', 'amlodipine',
    'losartan', 'atorvastatin', 'rosuvastatin', 'zolpidem', 'melatonin',
    'loratadine', 'cetirizine', 'diclofenac', 'celecoxib', 'naproxen'
  ];

  /**
   * 中文化处理
   */
  private toChinese(text: string): string {
    if (!text) return text;
    
    const lowerText = text.toLowerCase();
    
    // 直接匹配小写
    if (this.translationMap[lowerText]) {
      return this.translationMap[lowerText];
    }
    
    // 部分匹配（用于长文本中的关键词）
    for (const [en, cn] of Object.entries(this.translationMap)) {
      if (lowerText.includes(en)) {
        return cn;
      }
    }
    
    // 如果没有匹配，返回原文本
    return text;
  }

  /**
   * 检查是否为常用药品
   */
  private isCommonDrug(drugName: string): boolean {
    const lowerName = drugName.toLowerCase();
    return this.commonDrugs.some(d => lowerName.includes(d));
  }

  /**
   * 安全获取数组
   */
  private safeArray(arr: any[] | undefined, defaultValue: string[]): string[] {
    if (!arr || !Array.isArray(arr) || arr.length === 0) {
      return defaultValue;
    }
    return arr;
  }

  /**
   * 安全获取字符串
   */
  private safeString(str: string | undefined, defaultValue: string): string {
    if (!str || typeof str !== 'string') {
      return defaultValue;
    }
    return str;
  }

  /**
   * 格式化药品搜索结果
   */
  formatDrugs(rawResults: any[]): FormattedDrugCard[] {
    if (!rawResults || !Array.isArray(rawResults)) {
      console.warn('⚠️ formatDrugs 接收到的数据无效:', rawResults);
      return [];
    }
    
    console.log('📦 formatDrugs 接收到的原始数据:', rawResults);
    
    // 先过滤，优先保留常用药品
    let results = rawResults;
    const commonResults = rawResults.filter(item => {
      const name = item.openfda?.brand_name?.[0] || item.openfda?.generic_name?.[0] || '';
      return this.isCommonDrug(name);
    });
    
    // 如果有常用药品，只显示常用药品；否则显示前5条
    if (commonResults.length > 0) {
      results = commonResults;
      console.log(`📦 过滤后保留 ${results.length} 条常用药品`);
    } else {
      results = rawResults.slice(0, 5);
      console.log(`📦 无常用药品，显示前 ${results.length} 条`);
    }
    
    return results.map((item, index) => {
      // 统一数据格式
      let drug: any;
      
      // 检查是否是 FDA API 格式
      if (item.openfda || item.drugs) {
        const drugData = item.drugs?.results?.[0] || item;
        drug = {
          name: drugData.openfda?.brand_name?.[0] || drugData.openfda?.generic_name?.[0] || '',
          manufacturer: drugData.openfda?.manufacturer_name?.[0],
          indications: drugData.indications_and_usage ? [drugData.indications_and_usage[0]] : [],
          contraindications: drugData.contraindications ? [drugData.contraindications[0]] : [],
          usage: drugData.dosage_and_administration?.[0],
          sideEffects: drugData.adverse_reactions ? [drugData.adverse_reactions[0]] : [],
          source: 'fda',
          matchScore: 85
        };
      } else {
        drug = item;
      }
      
      const drugName = drug.name || '未知药品';
      const chineseName = this.toChinese(drugName);
      
      // 调试日志
      if (drugName !== chineseName && drugName !== '未知药品') {
        console.log(`📝 翻译: "${drugName}" -> "${chineseName}"`);
      }
      
      const category = drug.category || '其他';
      const origin = this.detectOrigin(drug);
      
      // 生成关键点
      let keyPoints = this.generateDrugKeyPoints(drug, chineseName);
      if (!keyPoints || keyPoints.length === 0) {
        keyPoints = [
          `💊 药品：${chineseName}`,
          `📌 来源：${this.getSourceLabel(drug)}`
        ];
      }
      
      return {
        name: chineseName,
        category: this.toChinese(category),
        matchScore: drug.matchScore || 70,
        keyPoints: keyPoints,
        details: {
          indications: this.safeArray(drug.indications, ['请参考药品说明书']),
          contraindications: this.safeArray(drug.contraindications, ['请参考药品说明书']),
          usage: this.safeString(this.toChinese(drug.usage), '请遵医嘱'),
          sideEffects: this.safeArray(drug.sideEffects, ['请参考药品说明书']),
          manufacturer: this.safeString(this.toChinese(drug.manufacturer), '未知'),
          approvalNumber: drug.approvalNumber,
          insuranceType: drug.insuranceType,
          price: drug.price
        },
        source: origin,
        sourceLabel: this.getSourceLabel(drug),
        verified: drug.verified || false,
        origin: origin,
        actions: { collect: true, share: true, compare: true }
      };
    });
  }

  /**
   * 格式化医案搜索结果
   */
  formatCases(rawResults: any[]): FormattedCaseCard[] {
    if (!rawResults || !Array.isArray(rawResults)) {
      return [];
    }
    
    return rawResults.map(raw => ({
      title: this.generateCaseTitle(raw),
      matchScore: raw.matchScore || 70,
      keyPoints: this.generateCaseKeyPoints(raw),
      details: {
        patientInfo: this.formatPatientInfo(raw),
        symptoms: this.safeArray(this.parseArray(raw.symptoms), []).map(s => this.toChinese(s)),
        diagnosis: this.safeString(this.toChinese(raw.diagnosis), '未知'),
        treatment: this.safeString(this.toChinese(raw.treatment), '未知'),
        efficacy: this.safeString(this.toChinese(raw.efficacy), '未知'),
        hospital: raw.hospital,
        doctor: raw.doctor
      },
      source: raw.source || 'platform',
      sourceLabel: this.getCaseSourceLabel(raw),
      actions: { collect: true, share: true, reference: true }
    }));
  }

  /**
   * 生成药品关键点
   */
  private generateDrugKeyPoints(drug: any, chineseName: string): string[] {
    const points = [];
    
    points.push(`💊 药品：${chineseName}`);
    
    if (drug.indications?.length) {
      const indications = drug.indications
        .map((ind: string) => this.toChinese(ind))
        .filter(Boolean)
        .slice(0, 2)
        .join('、');
      if (indications) points.push(`🎯 主治：${indications}`);
    }
    
    if (drug.contraindications?.length) {
      const contraindications = drug.contraindications
        .map((con: string) => this.toChinese(con))
        .filter(Boolean)
        .slice(0, 2)
        .join('、');
      if (contraindications) points.push(`⚠️ 禁忌：${contraindications}`);
    }
    
    if (drug.usage) {
      points.push(`💊 用法：${this.toChinese(this.simplifyText(drug.usage, 1))}`);
    }
    
    if (drug.insuranceType) {
      points.push(`🏥 医保：${drug.insuranceType}类`);
    } else if (drug.manufacturer) {
      points.push(`🏭 厂家：${this.toChinese(drug.manufacturer)}`);
    } else {
      points.push(`📌 来源：${this.getSourceLabel(drug)}`);
    }
    
    return points.filter(Boolean);
  }

  /**
   * 生成医案关键点
   */
  private generateCaseKeyPoints(case_: any): string[] {
    const points = [];
    
    if (case_.patientInfo) {
      points.push(`👤 患者：${this.formatPatientInfo(case_)}`);
    } else if (case_.patientAge || case_.patientGender) {
      const parts = [];
      if (case_.patientAge) parts.push(`${case_.patientAge}岁`);
      if (case_.patientGender) parts.push(case_.patientGender);
      if (parts.length) points.push(`👤 患者：${parts.join('·')}`);
    }
    
    if (case_.diagnosis) points.push(`🏷️ 诊断：${this.toChinese(case_.diagnosis)}`);
    if (case_.treatment) points.push(`💊 治疗：${this.toChinese(this.simplifyText(case_.treatment, 1))}`);
    
    if (case_.efficacy) {
      const emoji = case_.efficacy.includes('治愈') ? '✅' : case_.efficacy.includes('好转') ? '📈' : '❓';
      points.push(`${emoji} 疗效：${this.toChinese(case_.efficacy)}`);
    }
    
    if (case_.hospital) points.push(`🏥 医院：${case_.hospital}`);
    else if (case_.journal) points.push(`📚 期刊：${case_.journal}`);
    
    return points.slice(0, 5);
  }

  /**
   * 检测药品来源
   */
  private detectOrigin(drug: any): '国产' | '进口' | '国际' {
    if (drug.origin === '国产') return '国产';
    if (drug.source === 'fda') return '国际';
    if (drug.source === 'china') return '国产';
    return '进口';
  }

  /**
   * 获取来源标签
   */
  private getSourceLabel(drug: any): string {
    if (drug.source === 'fda') return '🇺🇸 FDA批准';
    if (drug.source === 'local') return '📚 平台收录';
    if (drug.origin === '国产') return '🇨🇳 国产药品';
    return '📖 网络资源';
  }

  /**
   * 获取医案来源标签
   */
  private getCaseSourceLabel(case_: any): string {
    if (case_.source === 'platform') return '⭐ 平台真实案例';
    if (case_.source === 'yiigle') return '📚 中华医学期刊';
    return '📄 网络资源';
  }

  /**
   * 生成医案标题
   */
  private generateCaseTitle(case_: any): string {
    const age = case_.patientInfo?.age || case_.patientAge || '';
    const gender = case_.patientInfo?.gender === 'male' ? '男' : case_.patientInfo?.gender === 'female' ? '女' : case_.patientGender || '';
    const diagnosis = this.toChinese(case_.diagnosis || case_.title || '病例');
    return `${age}${gender}${diagnosis}`.trim();
  }

  /**
   * 格式化患者信息
   */
  private formatPatientInfo(case_: any): string {
    const parts = [];
    if (case_.patientInfo?.age) parts.push(`${case_.patientInfo.age}岁`);
    else if (case_.patientAge) parts.push(`${case_.patientAge}岁`);
    
    if (case_.patientInfo?.gender) parts.push(case_.patientInfo.gender === 'male' ? '男' : '女');
    else if (case_.patientGender) parts.push(case_.patientGender);
    
    if (case_.patientInfo?.baseline?.length) {
      parts.push(`基础病：${case_.patientInfo.baseline.map((b: string) => this.toChinese(b)).join('、')}`);
    }
    
    return parts.join(' · ') || '信息待完善';
  }

  /**
   * 解析数组
   */
  private parseArray(arr: any): string[] {
    if (!arr) return [];
    if (Array.isArray(arr)) return arr;
    if (typeof arr === 'string') return [arr];
    return [];
  }

  /**
   * 简化文本
   */
  private simplifyText(text: string, n: number): string {
    if (!text) return '';
    if (typeof text !== 'string') return String(text);
    const sentences = text.split(/[。；]/).filter(s => s.trim());
    return sentences.slice(0, n).join('。') + (sentences.length > n ? '...' : '');
  }
}

// ========== 导出单例 ==========
const instance = new ResultFormatter();
export const resultFormatter = instance;

if (typeof window !== 'undefined') {
  (window as any).resultFormatter = instance;
}