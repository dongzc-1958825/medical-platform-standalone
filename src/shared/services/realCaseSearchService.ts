// src/shared/services/realCaseSearchService.ts
import { MedicalCase } from '../types/case';

export interface CaseSearchResult {
  caseId: string;
  case: MedicalCase;
  relevanceScore: number;      // 相关度
  treatmentEffectiveness: number; // 治疗效果评分
  hospitalLocation: string;     // 医院地点
  hospitalName: string;         // 医院名称
  doctorName?: string;          // 医生姓名
  treatmentCost?: string;       // 治疗费用参考
  convenience: number;          // 就医便利性评分
}

export interface SearchCriteria {
  disease: string;              // 疾病名称
  symptoms: string[];           // 症状
  location?: string;            // 期望就医地点
  maxDistance?: number;         // 最大距离(km)
  costRange?: [number, number]; // 费用范围
}

class RealCaseSearchService {
  
  /**
   * 搜索真实医案
   */
  async searchCases(criteria: SearchCriteria): Promise<CaseSearchResult[]> {
    console.log('🔍 搜索真实医案:', criteria);
    
    // 1. 从 localStorage 获取所有医案
    const allCases = this.getAllCases();
    
    // 2. 根据条件筛选
    let matchedCases = allCases.filter(caseItem => {
      // 疾病匹配
      const diseaseMatch = caseItem.diagnosis.includes(criteria.disease) ||
                          caseItem.tags.some(tag => tag.includes(criteria.disease));
      
      // 症状匹配（至少匹配一个症状）
      const symptomMatch = criteria.symptoms.length === 0 || 
                          criteria.symptoms.some(s => 
                            caseItem.symptoms.some(sym => sym.includes(s))
                          );
      
      return diseaseMatch && symptomMatch;
    });
    
    // 3. 计算相关度和效果评分
    const results: CaseSearchResult[] = matchedCases.map(caseItem => ({
      caseId: caseItem.id,
      case: caseItem,
      relevanceScore: this.calculateRelevance(caseItem, criteria),
      treatmentEffectiveness: this.extractEffectiveness(caseItem),
      hospitalLocation: this.extractHospitalLocation(caseItem),
      hospitalName: this.extractHospitalName(caseItem),
      doctorName: this.extractDoctorName(caseItem),
      treatmentCost: this.extractCost(caseItem),
      convenience: this.calculateConvenience(caseItem)
    }));
    
    // 4. 按治疗效果排序
    return results.sort((a, b) => b.treatmentEffectiveness - a.relevanceScore);
  }
  
  /**
   * 获取所有医案
   */
  private getAllCases(): MedicalCase[] {
    const saved = localStorage.getItem('medical_cases');
    return saved ? JSON.parse(saved) : [];
  }
  
  /**
   * 计算相关度
   */
  private calculateRelevance(caseItem: MedicalCase, criteria: SearchCriteria): number {
    let score = 0;
    const text = `${caseItem.title} ${caseItem.diagnosis} ${caseItem.description}`.toLowerCase();
    
    // 疾病名称完全匹配加分
    if (text.includes(criteria.disease.toLowerCase())) {
      score += 50;
    }
    
    // 每个症状匹配加分
    criteria.symptoms.forEach(s => {
      if (text.includes(s.toLowerCase())) {
        score += 20;
      }
    });
    
    return Math.min(score, 100);
  }
  
  /**
   * 提取治疗效果（从 outcome 字段）
   */
  private extractEffectiveness(caseItem: MedicalCase): number {
    const outcome = caseItem.outcome?.toLowerCase() || '';
    
    if (outcome.includes('痊愈') || outcome.includes('治愈') || outcome.includes('康复')) {
      return 90;
    } else if (outcome.includes('好转') || outcome.includes('缓解') || outcome.includes('改善')) {
      return 70;
    } else if (outcome.includes('有效')) {
      return 50;
    }
    return 30; // 默认
  }
  
  /**
   * 提取医院地点（从描述中）
   */
  private extractHospitalLocation(caseItem: MedicalCase): string {
    // TODO: 从 description 或新增字段中提取
    // 可以先从 tags 或 description 中查找城市名
    const commonCities = ['北京', '上海', '广州', '深圳', '杭州', '南京', '武汉', '成都'];
    const text = `${caseItem.description} ${caseItem.tags.join(' ')}`;
    
    for (const city of commonCities) {
      if (text.includes(city)) {
        return city;
      }
    }
    return '未知';
  }
  
  /**
   * 提取医院名称
   */
  private extractHospitalName(caseItem: MedicalCase): string {
    // TODO: 需要医案中增加医院字段
    return '未知医院';
  }
  
  /**
   * 提取医生姓名
   */
  private extractDoctorName(caseItem: MedicalCase): string {
    // TODO: 需要医案中增加医生字段
    return caseItem.author || '未知';
  }
  
  /**
   * 提取费用信息
   */
  private extractCost(caseItem: MedicalCase): string {
    const text = `${caseItem.description} ${caseItem.treatment}`.toLowerCase();
    
    if (text.includes('医保') || text.includes('报销')) {
      return '医保可报销';
    }
    
    const costMatch = text.match(/[约共]?(\d+[千万元])/);
    if (costMatch) {
      return `约${costMatch[1]}`;
    }
    
    return '费用未知';
  }
  
  /**
   * 计算就医便利性
   */
  private calculateConvenience(caseItem: MedicalCase): number {
    // TODO: 基于地点、交通等因素计算
    return 50; // 默认中等
  }
}

export const realCaseSearchService = new RealCaseSearchService();