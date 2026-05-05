// src/shared/services/multiSourceSearchService.ts

import { caseService } from './caseService';

export interface UnifiedSearchResult {
  id: string;
  title: string;
  content: string;
  source: 'platform' | 'yiigle' | 'other';
  sourceLabel: string;
  credibilityLevel: 'S' | 'A' | 'B' | 'C' | 'D';
  patientInfo?: any;
  diagnosis: string;
  treatment: string;
  outcome: string;
  institution?: string;
  author?: string;
  publishDate: string;
  url: string;
  relevanceScore: number;
}

class MultiSourceSearchService {
  
  async searchAll(params: { symptoms: string[]; keywords: string[]; maxResults?: number }): Promise<UnifiedSearchResult[]> {
    const allResults: UnifiedSearchResult[] = [];
    const searchTerm = params.keywords.join(' ');
    
    console.log('🔍 多源搜索:', { searchTerm, ...params });
    
    // 1. 搜索本地平台医案（UGC数据）
    const platformResults = this.searchPlatform(params);
    allResults.push(...platformResults);
    console.log('📚 平台医案:', platformResults.length);
    
    // 2. 搜索中华医学期刊（返回链接，不存储内容）
    const yiigleResults = await this.searchYiigle(searchTerm);
    allResults.push(...yiigleResults);
    console.log('📚 中华期刊链接:', yiigleResults.length);
    
    // 按相关度排序
    const sorted = this.sortResults(allResults, params.keywords);
    
    return sorted.slice(0, params.maxResults || 20);
  }
  
  private searchPlatform(params: { symptoms: string[]; keywords: string[] }): UnifiedSearchResult[] {
    const cases = caseService.getCases();
    
    const matched = cases.filter(c => this.matchPlatformCase(c, params.keywords));
    
    return matched.map(c => ({
      id: 'platform-' + c.id,
      title: c.title || c.diagnosis || '平台医案',
      content: c.description || c.treatment || '',
      source: 'platform',
      sourceLabel: '平台真实医案',
      credibilityLevel: 'A',
      diagnosis: c.diagnosis || '',
      treatment: c.treatment || '',
      outcome: c.outcome || '',
      institution: c.hospital || '用户分享',
      author: c.author,
      publishDate: c.createdAt || new Date().toISOString(),
      url: `/mobile/case/${c.id}`,
      relevanceScore: this.calculateRelevance(JSON.stringify(c), params.keywords)
    }));
  }
  
  private async searchYiigle(searchTerm: string): Promise<UnifiedSearchResult[]> {
    try {
      // 尝试调用后端API
      const response = await fetch(`/api/yiigle/search?q=${encodeURIComponent(searchTerm)}&page=1`);
      
      if (!response.ok) {
        console.log('⚠️ 中华期刊API不可用，使用模拟数据');
        return this.getMockYiigleResults(searchTerm);
      }
      
      const data = await response.json();
      const articles = data.articles || data.data || [];
      
      if (articles.length === 0) {
        return this.getMockYiigleResults(searchTerm);
      }
      
      // 只保留病例报告，只返回链接
      return articles
        .filter((a: any) => this.isCaseReport(a))
        .map((a: any) => ({
          id: a.id,
          title: a.title,
          content: '', // 不存储内容
          source: 'yiigle',
          sourceLabel: '中华医学期刊',
          credibilityLevel: 'B',
          diagnosis: a.diagnosis || a.title,
          treatment: '',
          outcome: '',
          institution: a.journal || '中华医学期刊',
          author: a.authors?.join(', ') || '',
          publishDate: a.date || '',
          url: a.url || `https://yiigle.com/article/${a.id}`,
          relevanceScore: 70
        }));
    } catch (error) {
      console.error('中华医学期刊搜索失败:', error);
      return this.getMockYiigleResults(searchTerm);
    }
  }
  
  private getMockYiigleResults(searchTerm: string): UnifiedSearchResult[] {
    // 模拟中华医学期刊搜索结果（仅链接，不存储内容）
    return [
      {
        id: 'yiigle_mock_1',
        title: `${searchTerm}病例报告分析`,
        content: '',
        source: 'yiigle',
        sourceLabel: '中华医学期刊',
        credibilityLevel: 'B',
        diagnosis: searchTerm,
        treatment: '',
        outcome: '',
        institution: '中华医学杂志',
        author: '',
        publishDate: '2024-03-15',
        url: 'https://rs.yiigle.com/article/example1',
        relevanceScore: 75
      },
      {
        id: 'yiigle_mock_2',
        title: `${searchTerm}临床治疗经验分享`,
        content: '',
        source: 'yiigle',
        sourceLabel: '中华医学期刊',
        credibilityLevel: 'B',
        diagnosis: searchTerm,
        treatment: '',
        outcome: '',
        institution: '中华医学杂志',
        author: '',
        publishDate: '2024-02-10',
        url: 'https://rs.yiigle.com/article/example2',
        relevanceScore: 70
      }
    ];
  }
  
  private isCaseReport(article: any): boolean {
    const title = article.title || '';
    const type = article.articleType || article.type || '';
    return type === '病例报告' ||
           type === '临床病例' ||
           title.includes('病例报告') ||
           title.includes('临床病例') ||
           title.includes('个案');
  }
  
  private matchPlatformCase(c: any, keywords: string[]): boolean {
    if (keywords.length === 0) return true;
    const searchText = [
      c.title, c.diagnosis, ...(c.symptoms || []),
      c.description || '', c.treatment || '', c.outcome || ''
    ].join(' ').toLowerCase();
    return keywords.some(k => k && searchText.includes(k.toLowerCase()));
  }
  
  private calculateRelevance(text: string, keywords: string[]): number {
    let score = 0;
    const lowerText = text.toLowerCase();
    for (const k of keywords) {
      if (k && lowerText.includes(k.toLowerCase())) {
        score += 20;
      }
    }
    return Math.min(score, 100);
  }
  
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
