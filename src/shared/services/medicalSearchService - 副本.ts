// src/shared/services/medicalSearchService.ts

/**
 * 医案/疾病搜索服务 - 独立功能
 * 输入：症状/疾病名
 * 输出：医案、疾病介绍、治疗方案
 */

export interface MedicalInfo {
  id: string;
  title: string;
  content: string;
  type: 'disease' | 'case' | 'treatment';
  source: string;
  sourceUrl?: string;
  relevance: number;
}

export interface MedicalAnalysis {
  summary: string;
  diseaseInfo: MedicalInfo | null;
  cases: MedicalInfo[];
  treatments: MedicalInfo[];
}

class MedicalSearchService {
  
  private backendUrl = 'http://localhost:3001/api';

  /**
   * 根据症状搜索疾病信息
   */
  async searchDisease(symptom: string): Promise<MedicalInfo[]> {
    console.log(`🔍 疾病搜索: ${symptom}`);
    
    // 1. 优先从中华医学期刊搜索
    const yiigleResults = await this.searchFromYiigle(symptom);
    if (yiigleResults.length > 0) {
      console.log(`✅ 中华医学期刊返回 ${yiigleResults.length} 条结果`);
      return yiigleResults;
    }
    
    // 2. 尝试从网络搜索
    const webResults = await this.searchFromWeb(symptom);
    if (webResults.length > 0) {
      console.log(`✅ 网络搜索返回 ${webResults.length} 条结果`);
      return webResults;
    }
    
    // 3. 使用本地知识库
    console.log(`⚠️ 使用本地知识库`);
    return this.getLocalDiseaseInfo(symptom);
  }

  /**
   * 从中华医学期刊搜索
   */
  private async searchFromYiigle(keyword: string): Promise<MedicalInfo[]> {
    try {
      const response = await fetch(
        `${this.backendUrl}/yiigle/search?q=${encodeURIComponent(keyword)}&page=1`
      );
      
      if (!response.ok) return [];
      
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        return data.data.map((article: any, index: number) => ({
          id: `yiigle-${Date.now()}-${index}`,
          title: article.title,
          content: article.abstract,
          type: article.title.includes('指南') ? 'treatment' : 'disease',
          source: '中华医学期刊',
          sourceUrl: article.url,
          relevance: 85
        }));
      }
      
      return [];
      
    } catch (error) {
      console.error('中华医学期刊搜索失败:', error);
      return [];
    }
  }

  /**
   * 根据症状搜索医案
   */
  async searchCases(symptom: string): Promise<MedicalInfo[]> {
    const cases = JSON.parse(localStorage.getItem('medical_cases') || '[]');
    
    return cases
      .filter((c: any) => this.matchCase(c, symptom))
      .map((c: any) => ({
        id: c.id,
        title: c.title || `${c.diagnosis}案例`,
        content: c.description || c.treatment || '',
        type: 'case',
        source: '平台医案',
        relevance: this.calculateRelevance(c, symptom)
      }));
  }

  /**
   * 搜索治疗方案
   */
  async searchTreatment(symptom: string): Promise<MedicalInfo[]> {
    const diseaseInfo = await this.searchDisease(symptom);
    return diseaseInfo.filter(info => info.type === 'treatment');
  }

  /**
   * AI分析：综合医案信息
   */
  async analyze(symptom: string): Promise<MedicalAnalysis> {
    const [diseaseResults, cases, treatments] = await Promise.all([
      this.searchDisease(symptom),
      this.searchCases(symptom),
      this.searchTreatment(symptom)
    ]);
    
    const diseaseInfo = diseaseResults.find(d => d.type === 'disease') || null;
    
    return {
      summary: this.generateSummary(symptom, diseaseInfo, cases),
      diseaseInfo,
      cases,
      treatments
    };
  }

  /**
   * 从网络搜索
   */
  private async searchFromWeb(keyword: string): Promise<MedicalInfo[]> {
    try {
      const response = await fetch(`${this.backendUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, type: 'disease' })
      });
      
      if (!response.ok) return [];
      
      const data = await response.json();
      return this.parseMedicalResults(data, keyword);
      
    } catch (error) {
      console.error('网络搜索失败:', error);
      return [];
    }
  }

  /**
   * 解析医案搜索结果
   */
  private parseMedicalResults(data: any, keyword: string): MedicalInfo[] {
    const results: MedicalInfo[] = [];
    
    if (data.diseases) {
      results.push({
        id: `disease-${Date.now()}`,
        title: `${keyword}介绍`,
        content: data.diseases.content?.substring(0, 1000) || '',
        type: 'disease',
        source: data.diseases.source || '网络',
        sourceUrl: data.diseases.url,
        relevance: 85
      });
    }
    
    return results;
  }

  /**
   * 匹配医案
   */
  private matchCase(c: any, symptom: string): boolean {
    const searchText = [
      c.title,
      c.diagnosis,
      ...(c.symptoms || []),
      c.description || '',
      c.treatment || ''
    ].join(' ').toLowerCase();
    
    return searchText.includes(symptom.toLowerCase());
  }

  /**
   * 计算相关度
   */
  private calculateRelevance(c: any, symptom: string): number {
    let score = 0;
    const searchText = JSON.stringify(c).toLowerCase();
    
    if (searchText.includes(symptom.toLowerCase())) {
      score += 50;
    }
    
    return Math.min(score, 100);
  }

  /**
   * 生成摘要
   */
  private generateSummary(symptom: string, diseaseInfo: MedicalInfo | null, cases: MedicalInfo[]): string {
    if (diseaseInfo) {
      return `${symptom}：${diseaseInfo.content.substring(0, 150)}...`;
    }
    
    if (cases.length > 0) {
      return `找到${cases.length}例相似病例，供参考。`;
    }
    
    return `关于"${symptom}"的信息较少，建议咨询医生。`;
  }

  /**
   * 本地疾病知识库
   */
  private getLocalDiseaseInfo(symptom: string): MedicalInfo[] {
    const knowledge: Record<string, MedicalInfo[]> = {
      '痛风': [
        {
          id: 'gout-1',
          title: '痛风介绍',
          content: '痛风是由于尿酸代谢异常导致尿酸盐结晶沉积在关节引起的疾病。急性期表现为关节红、肿、热、痛，常见于第一跖趾关节。',
          type: 'disease',
          source: '本地知识库',
          relevance: 90
        },
        {
          id: 'gout-2',
          title: '痛风治疗方案',
          content: '急性期：秋水仙碱、NSAIDs；缓解期：别嘌醇、非布司他、苯溴马隆。',
          type: 'treatment',
          source: '本地知识库',
          relevance: 85
        }
      ],
      '多动症': [
        {
          id: 'adhd-1',
          title: '注意缺陷多动障碍介绍',
          content: '注意缺陷多动障碍（ADHD）是一种常见的神经发育障碍，表现为注意力不集中、多动、冲动。',
          type: 'disease',
          source: '本地知识库',
          relevance: 90
        },
        {
          id: 'adhd-2',
          title: 'ADHD治疗方案',
          content: '一线药物：哌甲酯；二线药物：托莫西汀。配合行为治疗效果更佳。',
          type: 'treatment',
          source: '本地知识库',
          relevance: 85
        }
      ]
    };
    
    if (knowledge[symptom]) return knowledge[symptom];
    
    for (const [key, info] of Object.entries(knowledge)) {
      if (symptom.includes(key) || key.includes(symptom)) {
        return info;
      }
    }
    
    return [];
  }
}

export const medicalSearchService = new MedicalSearchService();