// src/shared/services/drugDataService.ts

/**
 * 药品数据服务 - 使用真实可用的免费API
 * 数据来源：
 * - openFDA：https://open.fda.gov/apis/ （完全免费，40次/分钟）
 * - ClinicalTrials.gov：https://clinicaltrials.gov/api （完全免费）
 */

// ========== 导出类型定义（必须放在最前面）==========
export interface DrugInfo {
  id: string;
  name: string;
  genericName?: string;
  brandName?: string;
  manufacturer?: string;
  origin: '国产' | '进口' | '国际';
  approvalNumber?: string;
  dosage?: string;
  strength?: string;
  indications: string[];
  contraindications: string[];
  usage?: string;
  sideEffects?: string[];
  insuranceType?: '甲类' | '乙类' | '谈判药' | '丙类';
  insuranceNotes?: string;
  source: 'fda' | 'clinicaltrials' | 'local' | 'chengdu' | 'guangxi' | 'shandong' | 'jinan';
  sourceUrl?: string;
  verified: boolean;
  matchScore?: number;
}

class DrugDataService {
  
  /**
   * 搜索药品 - 只调用真实可用的API
   */
  async searchDrugs(keyword: string): Promise<DrugInfo[]> {
    if (!keyword.trim()) return [];
    
    console.log(`🔍 搜索药品: "${keyword}"`);
    
    try {
      // 1. 先调用FDA API（完全免费，40次/分钟）
      const fdaResults = await this.searchFDA(keyword);
      
      if (fdaResults.length > 0) {
        console.log(`✅ FDA返回 ${fdaResults.length} 条真实数据`);
        return fdaResults;
      }
      
      // 2. 如果FDA没结果，尝试ClinicalTrials.gov
      const ctResults = await this.searchClinicalTrials(keyword);
      if (ctResults.length > 0) {
        console.log(`✅ ClinicalTrials返回 ${ctResults.length} 条真实数据`);
        return ctResults;
      }
      
      // 3. 如果都没有，返回空数组
      console.log('⚠️ 未找到相关药品');
      return [];
      
    } catch (error) {
      console.error('❌ 药品搜索失败:', error);
      return [];
    }
  }

  /**
   * FDA Open API - 完全免费，无需申请
   * 文档：https://open.fda.gov/apis/drug/label/
   * 限制：40次/分钟，无需API密钥
   */
  private async searchFDA(keyword: string): Promise<DrugInfo[]> {
    try {
      // FDA API - 搜索药品名和适应症
      const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(keyword)}+openfda.generic_name:${encodeURIComponent(keyword)}+indications_and_usage:${encodeURIComponent(keyword)}&limit=10`;
      
      console.log('🔍 请求FDA API:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.log('FDA API响应:', response.status);
        if (response.status === 404) {
          // 404表示没有找到结果，不是错误
          return [];
        }
        return [];
      }
      
      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        return [];
      }
      
      return data.results.map((item: any, index: number) => {
        const brandName = item.openfda?.brand_name?.[0];
        const genericName = item.openfda?.generic_name?.[0];
        const manufacturer = item.openfda?.manufacturer_name?.[0];
        
        return {
          id: `fda-${Date.now()}-${index}`,
          name: brandName || genericName || keyword,
          genericName: genericName,
          brandName: brandName,
          manufacturer: manufacturer,
          origin: '国际',
          dosage: this.parseDosageForm(item.openfda?.dosage_form),
          strength: item.openfda?.product_ndc?.[0]?.split('-')[1],
          indications: this.parseIndications(item.indications_and_usage),
          contraindications: this.parseContraindications(item.contraindications),
          usage: this.parseUsage(item.dosage_and_administration),
          sideEffects: this.parseSideEffects(item.adverse_reactions),
          source: 'fda',
          sourceUrl: `https://www.fda.gov/drugs`,
          verified: true,
          matchScore: 85
        };
      });
      
    } catch (error) {
      console.error('❌ FDA API调用失败:', error);
      return [];
    }
  }

  /**
   * ClinicalTrials.gov API - 完全免费，无需申请
   * 文档：https://clinicaltrials.gov/data-api/api
   */
  private async searchClinicalTrials(keyword: string): Promise<DrugInfo[]> {
    try {
      const url = `https://clinicaltrials.gov/api/v2/studies?query.term=${encodeURIComponent(keyword)}&pageSize=5&format=json`;
      
      console.log('🔍 请求ClinicalTrials:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        return [];
      }
      
      const data = await response.json();
      
      if (!data.studies || data.studies.length === 0) {
        return [];
      }
      
      return data.studies.map((study: any, index: number) => {
        const protocol = study.protocolSection;
        const interventions = protocol.armsInterventionsModule?.interventions || [];
        const drugs = interventions
          .filter((i: any) => i.type === 'DRUG')
          .map((i: any) => i.name);
        
        const conditions = protocol.conditionsModule?.conditions || [];
        const sponsor = protocol.sponsorCollaboratorsModule?.leadSponsor?.name;
        
        return {
          id: `ct-${Date.now()}-${index}`,
          name: drugs[0] || keyword,
          genericName: drugs.length > 1 ? drugs[1] : undefined,
          manufacturer: sponsor,
          origin: '国际',
          indications: conditions,
          contraindications: [],
          usage: protocol.designModule?.phases?.join(', ') || '',
          sideEffects: [],
          source: 'clinicaltrials',
          sourceUrl: `https://clinicaltrials.gov/study/${protocol.identificationModule.nctId}`,
          verified: true,
          matchScore: 70
        };
      });
      
    } catch (error) {
      console.error('❌ ClinicalTrials API调用失败:', error);
      return [];
    }
  }

  /**
   * 国家药监局数据 - 通过公共数据开放平台
   * 需要申请API密钥，但完全免费
   */
  async searchNMPA(keyword: string, apiKey?: string): Promise<DrugInfo[]> {
    // 如果有API密钥，可以调用国家药监局接口
    if (!apiKey) return [];
    
    try {
      // 以广西公共数据开放平台为例
      const url = `https://data.gx.gov.cn/gateway/api/1/post_coun92?drugName=${encodeURIComponent(keyword)}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      if (!response.ok) return [];
      
      const data = await response.json();
      
      return data.list?.map((item: any) => ({
        id: `nmpa-${item.id}`,
        name: item.drugName,
        approvalNumber: item.approvalNumber,
        manufacturer: item.enterpriseName,
        origin: '国产',
        dosage: item.dosageForm,
        strength: item.specification,
        drugType: item.drugType,
        insuranceType: item.medicalInsuranceType,
        source: 'local',
        verified: true,
        matchScore: 95
      })) || [];
      
    } catch (error) {
      console.error('NMPA API调用失败:', error);
      return [];
    }
  }

  // ========== 解析辅助函数 ==========
  
  /**
   * 解析剂型
   */
  private parseDosageForm(dosageForm: string[] | undefined): string | undefined {
    if (!dosageForm || dosageForm.length === 0) return undefined;
    return dosageForm[0];
  }

  /**
   * 解析适应症
   */
  private parseIndications(text: string[] | undefined): string[] {
    if (!text || !Array.isArray(text) || text.length === 0) {
      return ['请查看FDA官网获取详细适应症信息'];
    }
    
    try {
      const fullText = text[0];
      if (!fullText) return ['无详细适应症数据'];
      
      // 按句子分割，过滤空字符串，取前3条
      const sentences = fullText
        .split(/[.;]/)
        .map(s => s.trim())
        .filter(s => s.length > 10)
        .slice(0, 3);
      
      if (sentences.length > 0) {
        return sentences;
      }
      
      // 如果句子太短，返回整个文本的前100字
      return [fullText.substring(0, 100) + '...'];
      
    } catch (error) {
      console.error('解析适应症失败:', error);
      return ['数据解析失败'];
    }
  }

  /**
   * 解析禁忌症
   */
  private parseContraindications(text: string[] | undefined): string[] {
    if (!text || !Array.isArray(text) || text.length === 0) {
      return ['请查看FDA官网获取详细禁忌症信息'];
    }
    
    try {
      const fullText = text[0];
      if (!fullText) return [];
      
      const sentences = fullText
        .split(/[.;]/)
        .map(s => s.trim())
        .filter(s => s.length > 5)
        .slice(0, 3);
      
      if (sentences.length > 0) {
        return sentences;
      }
      
      return [fullText.substring(0, 100) + '...'];
      
    } catch (error) {
      return ['数据解析失败'];
    }
  }

  /**
   * 解析用法用量
   */
  private parseUsage(text: string[] | undefined): string | undefined {
    if (!text || !Array.isArray(text) || text.length === 0) {
      return undefined;
    }
    
    try {
      const fullText = text[0];
      if (!fullText) return undefined;
      
      // 取第一句
      const firstSentence = fullText.split(/[.;]/)[0]?.trim();
      if (firstSentence && firstSentence.length > 10) {
        return firstSentence;
      }
      
      return fullText.substring(0, 100) + '...';
      
    } catch (error) {
      return undefined;
    }
  }

  /**
   * 解析副作用
   */
  private parseSideEffects(text: string[] | undefined): string[] {
    if (!text || !Array.isArray(text) || text.length === 0) {
      return ['请查看FDA官网获取详细副作用信息'];
    }
    
    try {
      const fullText = text[0];
      if (!fullText) return [];
      
      const sentences = fullText
        .split(/[.;]/)
        .map(s => s.trim())
        .filter(s => s.length > 5)
        .slice(0, 3);
      
      if (sentences.length > 0) {
        return sentences;
      }
      
      return [fullText.substring(0, 100) + '...'];
      
    } catch (error) {
      return ['数据解析失败'];
    }
  }

  /**
   * 按来源分类统计
   */
  async getStats(): Promise<Record<string, number>> {
    try {
      // 测试几个常用关键词，统计各API返回数量
      const testKeywords = ['pain', 'diabetes', 'cancer', 'heart', 'infection'];
      const stats: Record<string, number> = {
        fda: 0,
        clinicaltrials: 0
      };
      
      for (const keyword of testKeywords) {
        const fdaResults = await this.searchFDA(keyword);
        stats.fda += fdaResults.length;
        
        const ctResults = await this.searchClinicalTrials(keyword);
        stats.clinicaltrials += ctResults.length;
      }
      
      return stats;
      
    } catch (error) {
      console.error('获取统计失败:', error);
      return { fda: 0, clinicaltrials: 0 };
    }
  }
}

// ========== 导出类型和单例 ==========

// 创建实例
const instance = new DrugDataService();

// 直接导出实例（最常用）
export const drugDataService = instance;

// 导出类型（供其他文件使用）
export type { DrugInfo };