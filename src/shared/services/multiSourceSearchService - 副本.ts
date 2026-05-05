// src/shared/services/multiSourceSearchService.ts

import { caseService } from './caseService';
import { yiigleParserService, YiigleArticle } from './yiigleParserService';

export interface UnifiedSearchResult {
  id: string;
  title: string;
  content: string;
  source: 'platform' | 'yiigle' | 'other';
  sourceLabel: string;
  credibilityLevel: 'S' | 'A' | 'B' | 'C' | 'D';
  patientInfo?: {
    gender?: string;
    age?: number;
    chiefComplaint?: string;
  };
  diagnosis: string;
  treatment: string;
  outcome: string;
  institution?: string;
  author?: string;
  publishDate: string;
  url?: string;
  relevanceScore: number;
}

class MultiSourceSearchService {
  
  /**
   * 多源搜索，整合平台医案和中华医学期刊
   */
  async searchAll(params: {
    symptoms: string[];
    keywords: string[];
    maxResults?: number;
  }): Promise<UnifiedSearchResult[]> {
    
    const allResults: UnifiedSearchResult[] = [];
    const searchTerm = params.keywords.join(' ');
    
    console.log('🔍 多源搜索:', { searchTerm, ...params });
    
    // 1. 搜索平台内部医案（S/A级）
    const platformResults = this.searchPlatform(params);
    allResults.push(...platformResults);
    
    // 2. 搜索中华医学期刊（B/C级）
    try {
      const yiigleResults = await this.searchYiigle(searchTerm);
      allResults.push(...yiigleResults);
    } catch (error) {
      console.error('中华医学期刊搜索失败:', error);
    }
    
    // 3. 按可信度和相关度综合排序
    const sorted = this.sortResults(allResults, params.keywords);
    
    // 4. 限制返回数量
    return sorted.slice(0, params.maxResults || 20);
  }
  
  /**
   * 搜索平台内部医案
   */
  private searchPlatform(params: { symptoms: string[]; keywords: string[] }): UnifiedSearchResult[] {
    const cases = caseService.getCases();
    
    return cases
      .filter(c => this.matchPlatformCase(c, params.keywords))
      .map(c => this.platformToUnified(c, params.keywords));
  }
  
  /**
   * 搜索中华医学期刊
   */
  private async searchYiigle(searchTerm: string): Promise<UnifiedSearchResult[]> {
    try {
      const articles = await yiigleParserService.searchArticles(searchTerm);
      if (!articles || !Array.isArray(articles)) {
        console.log('⚠️ 中华医学期刊返回空结果');
        return [];
      }
      
      return articles.map(article => this.yiigleToUnified(article, searchTerm));
    } catch (error) {
      console.error('中华医学期刊搜索失败:', error);
      return [];
    }
  }
  
  /**
   * 匹配平台医案
   */
  private matchPlatformCase(c: any, keywords: string[]): boolean {
    const searchText = [
      c.title,
      c.diagnosis,
      ...(c.symptoms || []),
      c.description || '',
      c.treatment || '',
      c.outcome || '',
      ...(c.tags || [])
    ].join(' ').toLowerCase();
    
    return keywords.some(k => 
      k && searchText.includes(k.toLowerCase())
    );
  }
  
  /**
   * 转换平台医案为统一格式
   */
  private platformToUnified(c: any, keywords: string[]): UnifiedSearchResult {
    // 计算可信度
    const credibilityLevel = this.getPlatformCredibility(c);
    
    // 计算相关度
    const relevanceScore = this.calculateRelevance(
      JSON.stringify(c), 
      keywords
    );
    
    return {
      id: `platform-${c.id}`,
      title: c.title,
      content: c.description || c.treatment || '',
      source: 'platform',
      sourceLabel: credibilityLevel === 'S' ? '专家医案' : '平台案例',
      credibilityLevel,
      patientInfo: {
        gender: c.patientGender,
        age: c.patientAge,
        chiefComplaint: c.symptoms?.join('、')
      },
      diagnosis: c.diagnosis,
      treatment: c.treatment || '未记录',
      outcome: c.outcome || '未记录',
      institution: c.hospital,
      author: c.author,
      publishDate: c.createdAt,
      relevanceScore
    };
  }
  
  /**
   * 转换中华医学期刊为统一格式
   */
  private yiigleToUnified(article: YiigleArticle, searchTerm: string): UnifiedSearchResult {
    const relevanceScore = this.calculateRelevance(
      article.title + ' ' + article.abstract,
      [searchTerm]
    );
    
    // 安全处理可能为 undefined 的字段
    const authors = Array.isArray(article.authors) ? article.authors : [];
    const journal = article.journal || '';
    const date = article.date || '';
    const url = article.url || '';
    
    return {
      id: article.id,
      title: article.title,
      content: article.abstract,
      source: 'yiigle',
      sourceLabel: article.articleType === 'guideline' ? '权威指南' : '医学文献',
      credibilityLevel: article.credibilityLevel,
      diagnosis: article.title,
      treatment: article.abstract.substring(0, 200),
      outcome: '',
      institution: journal,
      author: authors.join(', '),
      publishDate: date,
      url: url,
      relevanceScore
    };
  }
  
  /**
   * 计算平台医案可信度
   */
  private getPlatformCredibility(c: any): 'S' | 'A' {
    // S级：专家认证、三甲医院主任医师
    if (c.doctorTitle?.includes('主任') || 
        c.doctorTitle?.includes('教授') ||
        c.expertVerified === true) {
      return 'S';
    }
    // A级：普通医案
    return 'A';
  }
  
  /**
   * 计算相关度
   */
  private calculateRelevance(text: string, keywords: string[]): number {
    let score = 0;
    const lowerText = text.toLowerCase();
    
    keywords.forEach(k => {
      if (!k) return;
      const keyword = k.toLowerCase();
      // 完全匹配
      if (lowerText.includes(keyword)) {
        score += 20;
        // 多次出现加分
        const matches = lowerText.match(new RegExp(keyword, 'g'));
        if (matches) {
          score += Math.min(matches.length * 5, 30);
        }
      }
    });
    
    return Math.min(score, 100);
  }
  
  /**
   * 综合排序（可信度权重0.6，相关度权重0.4）
   */
  private sortResults(results: UnifiedSearchResult[], keywords: string[]): UnifiedSearchResult[] {
    const levelScore: Record<string, number> = { 'S': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
    
    return results.sort((a, b) => {
      const scoreA = levelScore[a.credibilityLevel] * 0.6 + a.relevanceScore * 0.4;
      const scoreB = levelScore[b.credibilityLevel] * 0.6 + b.relevanceScore * 0.4;
      return scoreB - scoreA;
    });
  }
}

export const multiSourceSearchService = new MultiSourceSearchService();