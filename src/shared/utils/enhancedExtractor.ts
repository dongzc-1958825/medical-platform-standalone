// src/shared/utils/enhancedExtractor.ts

// ==================== 医案信息接口 ====================
export interface CasePatientInfo {
  name?: string;           // 可脱敏，如"王某某"
  age?: number;
  gender?: '男'|'女'|'未知';
  baseline?: {             // 基础病
    diseases: string[];
    duration?: string;     // 病程
  };
  onsetTime?: string;      // 发病时间
  visitTime?: string;      // 就诊时间
}

export interface CaseSymptoms {
  primary: string[];       // 主要症状
  duration?: string;       // 症状持续时间
  description?: string;    // 详细描述
}

export interface CaseDiagnosis {
  primary: string;         // 主要诊断
  differential?: string[]; // 鉴别诊断
  icdCode?: string;        // ICD编码
  basis?: string;          // 诊断依据
}

export interface CaseTreatment {
  medications: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    route?: string;        // 给药途径
  }>;
  procedures?: string[];   // 手术/操作
  other?: string;          // 其他治疗
}

export interface CaseEfficacy {
  outcome: '治愈'|'好转'|'无效'|'恶化'|'未知';
  description?: string;
  followUp?: string;       // 随访情况
}

export interface CaseHospital {
  name?: string;           // 医院名称
  department?: string;     // 科室
  doctor?: string;         // 医生
  level?: string;          // 医院等级
}

export interface EnrichedCaseInfo {
  patient: CasePatientInfo;
  symptoms: CaseSymptoms;
  diagnosis: CaseDiagnosis;
  treatment: CaseTreatment;
  efficacy: CaseEfficacy;
  hospital: CaseHospital;
  rawText: string;
  confidence: number;      // 0-100
}

// ==================== 药品信息接口 ====================
export interface DrugInfo {
  name: string;            // 药品名称
  genericName?: string;    // 通用名
  brandName?: string;      // 商品名
  
  indications: string[];   // 适应症
  contraindications: string[]; // 禁忌症
  precautions: string[];   // 注意事项
  
  usage: {
    dosage?: string;       // 用法用量
    route?: string;        // 给药途径
    timing?: string;       // 服药时间
    duration?: string;     // 疗程
  };
  
  pricing: {
    price?: number;        // 价格
    unit?: string;         // 单位（盒/瓶）
    insuranceType?: '甲类'|'乙类'|'丙类'|'未知'; // 医保类型
    manufacturer?: string; // 生产厂家
  };
  
  sideEffects?: string[];  // 不良反应
  interactions?: string[]; // 相互作用
  
  category?: string;       // 药品分类
  form?: string;           // 剂型
  specification?: string;  // 规格
}

// ==================== 增强提取器 ====================
export class EnhancedExtractor {
  
  /**
   * 提取医案信息
   */
  extractCase(text: string): EnrichedCaseInfo {
    return {
      patient: this.extractPatientInfo(text),
      symptoms: this.extractSymptoms(text),
      diagnosis: this.extractDiagnosis(text),
      treatment: this.extractTreatment(text),
      efficacy: this.extractEfficacy(text),
      hospital: this.extractHospitalInfo(text),
      rawText: text.substring(0, 200),
      confidence: this.calculateConfidence(text)
    };
  }

  /**
   * 提取患者信息
   */
  private extractPatientInfo(text: string): CasePatientInfo {
    const info: CasePatientInfo = {
      gender: '未知'
    };

    // 提取姓名（脱敏）
    const nameMatch = text.match(/([王李张刘陈杨赵黄周吴][某]{1,2})/);
    if (nameMatch) {
      info.name = nameMatch[1];
    }

    // 提取年龄
    const ageMatch = text.match(/(\d+)[岁]?/);
    if (ageMatch) {
      info.age = parseInt(ageMatch[1]);
    }

    // 提取性别
    if (text.includes('男') || text.includes('男性')) {
      info.gender = '男';
    } else if (text.includes('女') || text.includes('女性')) {
      info.gender = '女';
    }

    // 提取基础病
    const baselinePatterns = [
      /既往(史)?[：:]\s*([^。；，\n]+)/,
      /有([^。；，\n]+?)(病史|史)/,
      /合并([^。；，\n]+)/
    ];
    
    const diseases: string[] = [];
    for (const pattern of baselinePatterns) {
      const match = text.match(new RegExp(pattern.source, 'i'));
      if (match) {
        const diseaseText = match[2] || match[1];
        // 常见基础病关键词
        const diseaseKeywords = ['高血压', '糖尿病', '冠心病', '肝炎', '肾炎', '哮喘'];
        diseaseKeywords.forEach(keyword => {
          if (diseaseText.includes(keyword)) {
            diseases.push(keyword);
          }
        });
      }
    }
    
    if (diseases.length > 0) {
      info.baseline = { diseases };
    }

    // 提取发病时间
    const onsetMatch = text.match(/(发病|出现症状)(\d+)(天|周|月|年)/);
    if (onsetMatch) {
      info.onsetTime = `${onsetMatch[2]}${onsetMatch[3]}`;
    }

    return info;
  }

  /**
   * 提取症状信息
   */
  private extractSymptoms(text: string): CaseSymptoms {
    const symptoms: CaseSymptoms = {
      primary: []
    };

    // 主要症状关键词
    const symptomKeywords = [
      '发热', '头痛', '胸痛', '腹痛', '咳嗽', '咳痰', 
      '呼吸困难', '心悸', '恶心', '呕吐', '腹泻', '便秘',
      '关节痛', '肌肉痛', '乏力', '盗汗', '消瘦'
    ];

    symptomKeywords.forEach(symptom => {
      if (text.includes(symptom)) {
        symptoms.primary.push(symptom);
      }
    });

    // 提取症状持续时间
    const durationMatch = text.match(/(症状|发作)(\d+)(天|周|月|年)/);
    if (durationMatch) {
      symptoms.duration = `${durationMatch[2]}${durationMatch[3]}`;
    }

    // 提取症状描述
    const descMatch = text.match(/症状[：:]\s*([^。；，\n]+)/);
    if (descMatch) {
      symptoms.description = descMatch[1];
    }

    return symptoms;
  }

  /**
   * 提取诊断信息
   */
  private extractDiagnosis(text: string): CaseDiagnosis {
    const diagnosis: CaseDiagnosis = {
      primary: '未知'
    };

    // 主要诊断
    const primaryPatterns = [
      /诊断[：:]\s*([^。；，\n]+)/,
      /诊断为\s*([^。；，\n]+)/,
      /确诊[：:]\s*([^。；，\n]+)/
    ];

    for (const pattern of primaryPatterns) {
      const match = text.match(pattern);
      if (match) {
        diagnosis.primary = match[1].trim();
        break;
      }
    }

    // 鉴别诊断
    const diffMatch = text.match(/鉴别诊断[：:]\s*([^。；，\n]+)/);
    if (diffMatch) {
      diagnosis.differential = diffMatch[1].split(/[，,、]/).map(s => s.trim());
    }

    // 诊断依据
    const basisMatch = text.match(/诊断依据[：:]\s*([^。；，\n]+)/);
    if (basisMatch) {
      diagnosis.basis = basisMatch[1];
    }

    return diagnosis;
  }

  /**
   * 提取治疗信息
   */
  private extractTreatment(text: string): CaseTreatment {
    const treatment: CaseTreatment = {
      medications: [],
      procedures: []
    };

    // 提取用药
    const medicationPatterns = [
      /给予\s*([^。；，\n]+?)(治疗|用药)/,
      /使用\s*([^。；，\n]+?)(药物|治疗)/,
      /服用\s*([^。；，\n]+)/
    ];

    for (const pattern of medicationPatterns) {
      const match = text.match(pattern);
      if (match) {
        const medText = match[1];
        // 解析药品名称和剂量
        const medMatch = medText.match(/([^0-9]+)(\d+)(mg|g|ml)?/);
        if (medMatch) {
          treatment.medications.push({
            name: medMatch[1].trim(),
            dosage: medMatch[2] + (medMatch[3] || '')
          });
        } else {
          // 只有药品名称
          treatment.medications.push({
            name: medText.trim()
          });
        }
      }
    }

    // 提取手术信息
    const surgeryMatch = text.match(/(行|接受)([^。；，\n]+?)(术|手术)/);
    if (surgeryMatch) {
      treatment.procedures?.push(surgeryMatch[2] + surgeryMatch[3]);
    }

    return treatment;
  }

  /**
   * 提取疗效信息
   */
  private extractEfficacy(text: string): CaseEfficacy {
    const efficacy: CaseEfficacy = {
      outcome: '未知'
    };

    if (text.includes('治愈') || text.includes('痊愈')) {
      efficacy.outcome = '治愈';
    } else if (text.includes('缓解') || text.includes('好转') || text.includes('改善')) {
      efficacy.outcome = '好转';
    } else if (text.includes('无效') || text.includes('未缓解')) {
      efficacy.outcome = '无效';
    } else if (text.includes('加重') || text.includes('恶化')) {
      efficacy.outcome = '恶化';
    }

    // 提取疗效描述
    const descMatch = text.match(/(疗效|效果)[：:]\s*([^。；，\n]+)/);
    if (descMatch) {
      efficacy.description = descMatch[2];
    }

    // 提取随访情况
    const followUpMatch = text.match(/(随访|复查)(\d+)(天|周|月|年)后[，,]?\s*([^。；，\n]+)/);
    if (followUpMatch) {
      efficacy.followUp = `${followUpMatch[2]}${followUpMatch[3]}后：${followUpMatch[4]}`;
    }

    return efficacy;
  }

  /**
   * 提取医院信息
   */
  private extractHospitalInfo(text: string): CaseHospital {
    const hospital: CaseHospital = {};

    // 医院名称
    const hospitalMatch = text.match(/([^。；，\n]+?)(医院|卫生院|医疗中心)/);
    if (hospitalMatch) {
      hospital.name = hospitalMatch[1] + hospitalMatch[2];
    }

    // 科室
    const deptMatch = text.match(/([^。；，\n]+?)(科|科室)/);
    if (deptMatch) {
      hospital.department = deptMatch[1] + deptMatch[2];
    }

    // 医生
    const doctorMatch = text.match(/([王李张刘陈杨赵黄周吴][某]{0,2})(医生|医师|主任)/);
    if (doctorMatch) {
      hospital.doctor = doctorMatch[1] + (doctorMatch[2] || '医生');
    }

    return hospital;
  }

  /**
   * 提取药品信息
   */
  extractDrug(text: string): DrugInfo {
    const drug: DrugInfo = {
      name: '未知',
      indications: [],
      contraindications: [],
      precautions: [],
      usage: {},
      pricing: {}
    };

    // 药品名称
    const nameMatch = text.match(/【药品名称】\s*([^【\n]+)/) ||
                     text.match(/通用名称[：:]\s*([^【\n]+)/);
    if (nameMatch) {
      drug.name = nameMatch[1].trim();
    }

    // 适应症
    const indMatch = text.match(/【适应症】\s*([^【\n]+)/) ||
                    text.match(/适应症[：:]\s*([^【\n]+)/);
    if (indMatch) {
      drug.indications = indMatch[1].split(/[，,、]/).map(s => s.trim());
    }

    // 禁忌症
    const contraMatch = text.match(/【禁忌】\s*([^【\n]+)/) ||
                       text.match(/禁忌症[：:]\s*([^【\n]+)/);
    if (contraMatch) {
      drug.contraindications = contraMatch[1].split(/[，,、]/).map(s => s.trim());
    }

    // 用法用量
    const usageMatch = text.match(/【用法用量】\s*([^【\n]+)/) ||
                      text.match(/用法用量[：:]\s*([^【\n]+)/);
    if (usageMatch) {
      drug.usage.dosage = usageMatch[1].trim();
    }

    // 价格和医保
    const priceMatch = text.match(/(\d+(\.\d+)?)元/);
    if (priceMatch) {
      drug.pricing.price = parseFloat(priceMatch[1]);
    }

    if (text.includes('医保') || text.includes('甲类')) {
      drug.pricing.insuranceType = '甲类';
    } else if (text.includes('乙类')) {
      drug.pricing.insuranceType = '乙类';
    }

    // 生产厂家
    const manuMatch = text.match(/【生产企业】\s*([^【\n]+)/) ||
                     text.match/(生产厂家[：:]\s*([^【\n]+)/);
    if (manuMatch) {
      drug.pricing.manufacturer = manuMatch[1].trim();
    }

    // 不良反应
    const sideMatch = text.match(/【不良反应】\s*([^【\n]+)/);
    if (sideMatch) {
      drug.sideEffects = sideMatch[1].split(/[，,、]/).map(s => s.trim());
    }

    return drug;
  }

  /**
   * 计算可信度
   */
  private calculateConfidence(text: string): number {
    let score = 0;
    const checks = [
      { pattern: /患者|病人/, weight: 10 },  // 有患者信息
      { pattern: /症状|主诉/, weight: 10 },  // 有症状描述
      { pattern: /诊断/, weight: 15 },       // 有诊断
      { pattern: /治疗|用药/, weight: 15 },  // 有治疗
      { pattern: /疗效|效果/, weight: 10 },  // 有疗效
      { pattern: /医院|医生/, weight: 5 },   // 有医院信息
      { pattern: /\d+[岁]/, weight: 10 },    // 有年龄
      { pattern: /[男女]/, weight: 10 },      // 有性别
      { pattern: /[。；]/, weight: 5 }        // 有完整句子
    ];

    checks.forEach(check => {
      if (new RegExp(check.pattern).test(text)) {
        score += check.weight;
      }
    });

    return Math.min(score, 100);
  }

  /**
   * 生成医案摘要
   */
  generateCaseSummary(info: EnrichedCaseInfo): string {
    const parts: string[] = [];

    // 患者基本信息
    const patientParts = [];
    if (info.patient.name) patientParts.push(info.patient.name);
    if (info.patient.age) patientParts.push(`${info.patient.age}岁`);
    if (info.patient.gender && info.patient.gender !== '未知') patientParts.push(info.patient.gender);
    if (patientParts.length > 0) {
      parts.push(patientParts.join(''));
    }

    // 基础病
    if (info.patient.baseline?.diseases.length) {
      parts.push(`有${info.patient.baseline.diseases.join('、')}病史`);
    }

    // 发病时间
    if (info.patient.onsetTime) {
      parts.push(`发病${info.patient.onsetTime}`);
    }

    // 症状
    if (info.symptoms.primary.length > 0) {
      let symptomText = `因${info.symptoms.primary.join('、')}`;
      if (info.symptoms.duration) {
        symptomText += info.symptoms.duration;
      }
      parts.push(symptomText);
    }

    // 诊断
    if (info.diagnosis.primary !== '未知') {
      parts.push(`诊断为${info.diagnosis.primary}`);
    }

    // 治疗
    if (info.treatment.medications.length > 0) {
      const meds = info.treatment.medications.map(m => m.name).join('、');
      parts.push(`给予${meds}治疗`);
    }

    // 疗效
    if (info.efficacy.outcome !== '未知') {
      parts.push(`疗效${info.efficacy.outcome}`);
    }

    // 医院
    if (info.hospital.name) {
      parts.push(`于${info.hospital.name}就诊`);
    }
    if (info.hospital.doctor) {
      parts.push(info.hospital.doctor);
    }

    return parts.join('，') + '。';
  }

  /**
   * 生成药品摘要
   */
  generateDrugSummary(drug: DrugInfo): string {
    const parts: string[] = [];

    parts.push(`【${drug.name}】`);

    if (drug.indications.length > 0) {
      parts.push(`适应症：${drug.indications.slice(0, 3).join('、')}${drug.indications.length > 3 ? '等' : ''}`);
    }

    if (drug.contraindications.length > 0) {
      parts.push(`禁忌：${drug.contraindications.slice(0, 2).join('、')}${drug.contraindications.length > 2 ? '等' : ''}`);
    }

    if (drug.usage.dosage) {
      parts.push(`用法：${drug.usage.dosage}`);
    }

    if (drug.pricing.price) {
      parts.push(`参考价：${drug.pricing.price}元`);
    }

    if (drug.pricing.insuranceType && drug.pricing.insuranceType !== '未知') {
      parts.push(`医保：${drug.pricing.insuranceType}`);
    }

    if (drug.pricing.manufacturer) {
      parts.push(`厂家：${drug.pricing.manufacturer}`);
    }

    return parts.join('；');
  }
}

// 导出单例
export const enhancedExtractor = new EnhancedExtractor();