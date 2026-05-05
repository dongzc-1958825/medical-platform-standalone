// src/shared/services/enhancedConsultService.ts
import { consultService, Consultation } from './consultService';
import { multiSourceSearchService, UnifiedSearchResult } from './multiSourceSearchService';

export interface EnhancedAnswer extends UnifiedSearchResult {
  id: string;
  // 继承所有 UnifiedSearchResult 字段
}

export interface AIEnhancedConsult {
  originalConsult: Consultation;
  aiSuggestedAnswers: EnhancedAnswer[];
  stats: {
    totalResults: number;
    byLevel: Record<'S' | 'A' | 'B' | 'C' | 'D', number>;
    bySource: Record<string, number>;
  };
}

class EnhancedConsultService {
  
  /**
   * 获取咨询详情（包含多源AI推荐）
   */
  async getConsultWithAI(id: string): Promise<AIEnhancedConsult | null> {
    const consult = consultService.getConsultation(id);
    if (!consult) return null;
    
    // 1. 提取关键词
    const symptoms = consult.symptoms.split(/[,，、\s]+/).filter(s => s.length > 0);
    const keywords = this.extractKeywords(consult);
    
    console.log('🔍 开始多源搜索，症状:', symptoms, '关键词:', keywords);
    
    // 2. 执行多源搜索
    const results = await multiSourceSearchService.searchAll({
      symptoms,
      keywords,
      maxResults: 15
    });
    
    // 3. 转换为增强答案格式
    const answers: EnhancedAnswer[] = results.map(r => ({
      ...r,
      id: r.id
    }));
    
    // 4. 统计数据
    const stats = this.calculateStats(answers);
    
    console.log('📊 搜索结果:', stats);
    
    return {
      originalConsult: consult,
      aiSuggestedAnswers: answers,
      stats
    };
  }
  
  /**
   * 获取指定可信度等级的答案
   */
  async getAnswersByLevel(id: string, minLevel: 'S' | 'A' | 'B' | 'C'): Promise<EnhancedAnswer[]> {
    const result = await this.getConsultWithAI(id);
    if (!result) return [];
    
    const levelOrder: Record<string, number> = { 'S': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
    const minScore = levelOrder[minLevel];
    
    return result.aiSuggestedAnswers.filter(a => 
      levelOrder[a.credibilityLevel] >= minScore
    );
  }
  
  /**
   * 只获取平台内部数据（S/A级）
   */
  async getPlatformAnswers(id: string): Promise<EnhancedAnswer[]> {
    const result = await this.getConsultWithAI(id);
    if (!result) return [];
    
    return result.aiSuggestedAnswers.filter(a => 
      a.source === 'platform'
    );
  }
  
  /**
   * 提取关键词
   */
  private extractKeywords(consult: Consultation): string[] {
    const words = new Set<string>();
    
    // 从症状中提取
    consult.symptoms.split(/[,，、\s]+/).forEach(s => {
      if (s.length > 1) words.add(s);
    });
    
    // 从描述中提取
    const commonTerms = ['治疗', '用药', '效果', '疼痛', '发烧', '咳嗽', '胃痛', '头痛', '失眠', '高血压', '糖尿病'];
    commonTerms.forEach(term => {
      if (consult.description.includes(term)) {
        words.add(term);
      }
    });
    
    // 从诉求中提取
    consult.request.split(/[,，、\s]+/).forEach(r => {
      if (r.length > 1) words.add(r);
    });
    
    return Array.from(words);
  }
  
  /**
   * 统计数据
   */
  private calculateStats(answers: EnhancedAnswer[]): AIEnhancedConsult['stats'] {
    const stats = {
      totalResults: answers.length,
      byLevel: { S: 0, A: 0, B: 0, C: 0, D: 0 },
      bySource: {} as Record<string, number>
    };
    
    answers.forEach(a => {
      stats.byLevel[a.credibilityLevel]++;
      stats.bySource[a.source] = (stats.bySource[a.source] || 0) + 1;
    });
    
    return stats;
  }
  
  /**
   * 提交反馈
   */
  submitFeedback(answerId: string, helpful: boolean) {
    console.log('用户反馈:', { answerId, helpful });
    
    const feedbacks = JSON.parse(localStorage.getItem('ai_feedbacks') || '[]');
    feedbacks.push({
      answerId,
      helpful,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('ai_feedbacks', JSON.stringify(feedbacks));
    
    alert(helpful ? '感谢您的反馈！' : '感谢您的反馈，我们会继续优化');
  }
}

export const enhancedConsultService = new EnhancedConsultService();