// src/shared/utils/textExtractor.ts

import { 
  MEDICAL_PATTERNS,
  getAllPatientPatterns,
  getDiagnosisPatternsByWeight,
  getTreatmentPatternsByWeight,
  normalizeSymptom,
  getDrugCategory
} from './patterns/medicalPatterns';

export interface ExtractedPatientInfo {
  age?: string;
  gender?: string;
  description?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface ExtractedEfficacy {
  result: 'positive' | 'negative' | 'unknown';
  description: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface ExtractedKeyInfo {
  patientInfo?: ExtractedPatientInfo;
  symptoms: string[];
  diagnosis?: string;
  treatment?: string;
  efficacy?: ExtractedEfficacy;
  medications: Array<{
    name: string;
    category: string;
  }>;
  rawText: string;           // 保留原始文本片段
  confidence: number;        // 0-100 总体可信度
  extractionTime: number;    // 提取时间戳
}

export class RuleBasedExtractor {
  
  /**
   * 从文本中提取关键信息
   */
  extract(text: string): ExtractedKeyInfo {
    const startTime = Date.now();
    
    const result: ExtractedKeyInfo = {
      symptoms: [],
      medications: [],
      rawText: text.substring(0, 200), // 只保留前200字符
      confidence: 0,
      extractionTime: startTime
    };

    // 按顺序提取各项信息
    result.patientInfo = this.extractPatientInfo(text);
    result.symptoms = this.extractSymptoms(text);
    result.diagnosis = this.extractDiagnosis(text);
    result.treatment = this.extractTreatment(text);
    result.efficacy = this.extractEfficacy(text);
    result.medications = this.extractMedications(text);
    
    // 计算总体可信度
    result.confidence = this.calculateConfidence(result);
    result.extractionTime = Date.now() - startTime;
    
    return result;
  }

  /**
   * 提取患者信息
   */
  private extractPatientInfo(text: string): ExtractedPatientInfo | undefined {
    const patterns = getAllPatientPatterns();
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        // 尝试提取年龄
        let age: string | undefined;
        const ageMatch = text.match(/(\d+)[岁]?/);
        if (ageMatch) {
          age = ageMatch[1];
        }
        
        // 尝试提取性别
        let gender: string | undefined;
        if (text.includes('男') || text.includes('Male') || text.includes('male')) {
          gender = '男';
        } else if (text.includes('女') || text.includes('Female') || text.includes('female')) {
          gender = '女';
        }
        
        // 判断可信度
        let confidence: 'high' | 'medium' | 'low' = 'low';
        if (age && gender) {
          confidence = 'high';
        } else if (age || gender) {
          confidence = 'medium';
        }
        
        return {
          age,
          gender,
          description: match[0],
          confidence
        };
      }
    }
    
    // 检查是否包含"患者"关键词
    if (text.includes('患者')) {
      return {
        confidence: 'low',
        description: '提及患者但无详细信息'
      };
    }
    
    return undefined;
  }

  /**
   * 提取症状
   */
  private extractSymptoms(text: string): string[] {
    const foundSymptoms = new Set<string>();
    const textLower = text.toLowerCase();
    
    // 直接匹配症状关键词
    MEDICAL_PATTERNS.symptoms.forEach(symptom => {
      if (text.includes(symptom)) {
        foundSymptoms.add(normalizeSymptom(symptom));
      }
    });
    
    // 匹配"症状：XXX"模式
    const symptomPatterns = [
      /症状[：:]\s*([^。；，\n]+)/g,
      /主诉[：:]\s*([^。；，\n]+)/g,
      /表现为\s*([^。；，\n]+)/g
    ];
    
    symptomPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const symptomText = match[1];
        // 分割症状（常见分隔符）
        symptomText.split(/[，,、\s]+/).forEach(s => {
          if (s.length > 1) {
            // 检查是否是已知症状
            const normalized = normalizeSymptom(s);
            if (MEDICAL_PATTERNS.symptoms.includes(normalized) || s.length < 5) {
              foundSymptoms.add(normalized);
            }
          }
        });
      }
    });
    
    return Array.from(foundSymptoms);
  }

  /**
   * 提取诊断
   */
  private extractDiagnosis(text: string): string | undefined {
    const patterns = getDiagnosisPatternsByWeight();
    
    // 存储所有匹配及其权重
    const matches: Array<{text: string, weight: number}> = [];
    
    patterns.forEach(({pattern, weight}) => {
      const match = text.match(pattern);
      if (match) {
        // 如果是关键词匹配，直接使用匹配到的词
        if (pattern.source.includes('|')) {
          matches.push({
            text: match[1] || match[0],
            weight
          });
        } else {
          // 常规匹配
          matches.push({
            text: match[1]?.trim() || match[0]?.trim(),
            weight
          });
        }
      }
    });
    
    if (matches.length > 0) {
      // 按权重排序
      matches.sort((a, b) => b.weight - a.weight);
      
      // 如果有多个匹配，选择权重最高的，但长度适中的（避免过长）
      const bestMatch = matches[0];
      if (bestMatch.text.length > 50) {
        // 如果太长，尝试找次优但更简洁的
        const conciseMatch = matches.find(m => m.text.length < 30);
        return conciseMatch?.text || bestMatch.text.substring(0, 50) + '...';
      }
      return bestMatch.text;
    }
    
    return undefined;
  }

  /**
   * 提取治疗
   */
  private extractTreatment(text: string): string | undefined {
    const patterns = getTreatmentPatternsByWeight();
    
    const matches: Array<{text: string, weight: number}> = [];
    
    patterns.forEach(({pattern, weight}) => {
      const match = text.match(pattern);
      if (match) {
        matches.push({
          text: match[1]?.trim() || match[0]?.trim(),
          weight
        });
      }
    });
    
    if (matches.length > 0) {
      matches.sort((a, b) => b.weight - a.weight);
      
      // 治疗信息通常不宜太长
      const bestMatch = matches[0];
      if (bestMatch.text.length > 100) {
        return bestMatch.text.substring(0, 100) + '...';
      }
      return bestMatch.text;
    }
    
    return undefined;
  }

  /**
   * 提取疗效
   */
  private extractEfficacy(text: string): ExtractedEfficacy | undefined {
    const patterns = MEDICAL_PATTERNS.efficacy;
    
    for (const pattern of patterns) {
      const regex = new RegExp(pattern.pattern, 'i');
      const match = text.match(regex);
      if (match) {
        // 确定可信度
        let confidence: 'high' | 'medium' | 'low' = 'medium';
        
        // 如果有明确的疗效词，可信度更高
        if (pattern.type === 'positive' || pattern.type === 'negative') {
          if (match[0].length > 4) { // 匹配到的文本较长，更可信
            confidence = 'high';
          }
        }
        
        return {
          result: pattern.type as 'positive' | 'negative' | 'unknown',
          description: match[0],
          confidence
        };
      }
    }
    
    return undefined;
  }

  /**
   * 提取药品
   */
  private extractMedications(text: string): Array<{name: string, category: string}> {
    const found = new Set<string>();
    
    MEDICAL_PATTERNS.medications.forEach(drug => {
      if (text.includes(drug)) {
        found.add(drug);
      }
    });
    
    // 额外匹配：药品加剂量模式，如"阿司匹林100mg"
    const drugWithDosagePattern = /([阿司匹林|布洛芬|二甲双胍|胰岛素]+)\s*(\d+)(mg|g|ml)/g;
    let match;
    while ((match = drugWithDosagePattern.exec(text)) !== null) {
      if (match[1]) {
        found.add(match[1]);
      }
    }
    
    return Array.from(found).map(name => ({
      name,
      category: getDrugCategory(name)
    }));
  }

  /**
   * 计算总体可信度
   */
  private calculateConfidence(info: ExtractedKeyInfo): number {
    let score = 0;
    const weights = {
      patientInfo: 20,
      symptoms: 25,
      diagnosis: 25,
      treatment: 20,
      efficacy: 10
    };

    // 患者信息评分
    if (info.patientInfo) {
      if (info.patientInfo.confidence === 'high') {
        score += weights.patientInfo;
      } else if (info.patientInfo.confidence === 'medium') {
        score += weights.patientInfo * 0.6;
      } else {
        score += weights.patientInfo * 0.3;
      }
    }

    // 症状评分（多个症状加分）
    if (info.symptoms.length > 0) {
      const symptomScore = Math.min(info.symptoms.length * 8, weights.symptoms);
      score += symptomScore;
    }

    // 诊断评分
    if (info.diagnosis) {
      // 诊断越长不一定越好，取合理范围
      const diagnosisQuality = Math.min(info.diagnosis.length / 20, 1);
      score += weights.diagnosis * (0.7 + diagnosisQuality * 0.3);
    }

    // 治疗评分
    if (info.treatment) {
      const treatmentQuality = Math.min(info.treatment.length / 30, 1);
      score += weights.treatment * (0.6 + treatmentQuality * 0.4);
    }

    // 疗效评分
    if (info.efficacy) {
      if (info.efficacy.confidence === 'high') {
        score += weights.efficacy;
      } else if (info.efficacy.confidence === 'medium') {
        score += weights.efficacy * 0.6;
      } else {
        score += weights.efficacy * 0.3;
      }
    }

    // 返回0-100的整数
    return Math.min(Math.round(score), 100);
  }

  /**
   * 批量提取（用于多个结果）
   */
  extractBatch(texts: string[]): ExtractedKeyInfo[] {
    return texts.map(text => this.extract(text));
  }

  /**
   * 生成摘要（按角色）
   */
  generateSummary(text: string, role: 'patient' | 'doctor' | 'researcher'): string {
    const extracted = this.extract(text);
    
    switch (role) {
      case 'patient':
        return this.generatePatientSummary(extracted);
      case 'doctor':
        return this.generateDoctorSummary(extracted, text);
      case 'researcher':
        return this.generateResearcherSummary(extracted, text);
      default:
        return this.generatePatientSummary(extracted);
    }
  }

  /**
   * 生成患者友好摘要
   */
  private generatePatientSummary(info: ExtractedKeyInfo): string {
    const parts: string[] = [];
    
    // 患者基本信息
    if (info.patientInfo) {
      if (info.patientInfo.age && info.patientInfo.gender) {
        parts.push(`${info.patientInfo.age}岁${info.patientInfo.gender}性患者`);
      } else if (info.patientInfo.age) {
        parts.push(`${info.patientInfo.age}岁患者`);
      } else if (info.patientInfo.gender) {
        parts.push(`${info.patientInfo.gender}性患者`);
      }
    }
    
    // 症状
    if (info.symptoms.length > 0) {
      const symptomText = info.symptoms.slice(0, 3).join('、');
      parts.push(`主要症状：${symptomText}${info.symptoms.length > 3 ? '等' : ''}`);
    }
    
    // 诊断（用通俗语言）
    if (info.diagnosis) {
      const simpleDiagnosis = this.simplifyDiagnosis(info.diagnosis);
      parts.push(`诊断：${simpleDiagnosis}`);
    }
    
    // 治疗
    if (info.treatment) {
      const simpleTreatment = this.simplifyTreatment(info.treatment);
      parts.push(`治疗：${simpleTreatment}`);
    }
    
    // 疗效
    if (info.efficacy) {
      if (info.efficacy.result === 'positive') {
        parts.push('治疗效果良好');
      } else if (info.efficacy.result === 'negative') {
        parts.push('治疗效果不佳，建议咨询医生');
      }
    }
    
    // 药品提醒
    if (info.medications.length > 0) {
      const drugNames = info.medications.map(m => m.name).join('、');
      parts.push(`涉及药品：${drugNames}`);
    }
    
    return parts.join('。') + '。';
  }

  /**
   * 生成医生版摘要
   */
  private generateDoctorSummary(info: ExtractedKeyInfo, originalText: string): string {
    // 医生版：包含更多专业信息
    let summary = '';
    
    if (info.patientInfo) {
      summary += `【患者】${info.patientInfo.age || '?'}岁/${info.patientInfo.gender || '?'} `;
    }
    
    if (info.symptoms.length > 0) {
      summary += `【症状】${info.symptoms.join('/')} `;
    }
    
    if (info.diagnosis) {
      summary += `【诊断】${info.diagnosis} `;
    }
    
    if (info.treatment) {
      summary += `【治疗】${info.treatment} `;
    }
    
    if (info.efficacy) {
      summary += `【疗效】${info.efficacy.description}`;
    }
    
    // 如果摘要太短，补充原文前100字
    if (summary.length < 50 && originalText.length > 0) {
      summary += originalText.substring(0, 100);
    }
    
    return summary;
  }

  /**
   * 生成研究者版摘要
   */
  private generateResearcherSummary(info: ExtractedKeyInfo, originalText: string): string {
    // 研究者版：包含更多细节
    return `【提取信息】\n` +
           `可信度：${info.confidence}%\n` +
           `患者信息：${JSON.stringify(info.patientInfo)}\n` +
           `症状：${info.symptoms.join(', ')}\n` +
           `诊断：${info.diagnosis || '无'}\n` +
           `治疗：${info.treatment || '无'}\n` +
           `疗效：${JSON.stringify(info.efficacy)}\n` +
           `药品：${info.medications.map(m => `${m.name}(${m.category})`).join(', ')}\n` +
           `\n【原文片段】\n${info.rawText}`;
  }

  /**
   * 简化诊断术语（面向患者）
   */
  private simplifyDiagnosis(diagnosis: string): string {
    // 常见医学术语通俗化
    const simplifications: Record<string, string> = {
      '上呼吸道感染': '感冒',
      '急性上呼吸道感染': '感冒',
      '原发性高血压': '高血压',
      '2型糖尿病': '糖尿病',
      '冠状动脉粥样硬化性心脏病': '冠心病',
      '不稳定型心绞痛': '心绞痛'
    };
    
    for (const [medical, simple] of Object.entries(simplifications)) {
      if (diagnosis.includes(medical)) {
        return diagnosis.replace(medical, simple);
      }
    }
    
    return diagnosis;
  }

  /**
   * 简化治疗描述
   */
  private simplifyTreatment(treatment: string): string {
    // 如果包含具体剂量，保留但简化
    if (treatment.includes('mg') || treatment.includes('g')) {
      return treatment;
    }
    return treatment;
  }

  /**
   * 获取提取统计信息
   */
  getStats(): { patternsLoaded: number; version: string } {
    return {
      patternsLoaded: Object.keys(MEDICAL_PATTERNS).length,
      version: '1.0.0'
    };
  }
}

// 导出单例
export const textExtractor = new RuleBasedExtractor();

// 导出便捷函数
export const extractFromText = (text: string) => textExtractor.extract(text);
export const generateSummary = (text: string, role: 'patient' | 'doctor' | 'researcher' = 'patient') => 
  textExtractor.generateSummary(text, role);