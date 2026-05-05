// src/shared/services/medicalSearchService.ts

/**
 * 医学搜索服务 - 中华医学期刊搜索
 */

class MedicalSearchService {
  
  /**
   * 搜索中华医学期刊
   * @param keyword 搜索关键词
   * @returns 文章列表
   */
  async searchYiigle(keyword: string): Promise<any[]> {
    try {
      console.log(`🔍 搜索中华期刊: ${keyword}`);
      const response = await fetch(`/api/search/yiigle?keyword=${encodeURIComponent(keyword)}`);
      
      if (!response.ok) {
        console.error(`搜索失败: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      const articles = data.articles || data.data || data.results || [];
      
      console.log(`📄 返回文章数: ${articles.length}`);
      
      // 打印前3条用于调试
      articles.slice(0, 3).forEach((article: any, i: number) => {
        console.log(`  ${i+1}. ${article.title} (类型: ${article.type || '未标注'})`);
      });
      
      // 确保每个文章都有 type 字段
      return articles.map((article: any) => ({
        id: article.id,
        title: article.title,
        type: article.type || this.guessArticleType(article.title),
        abstract: article.abstract || article.summary || '',
        url: article.url || article.link,
        publishDate: article.publishDate || article.date || '',
        hospital: article.hospital || article.authorOrg || '',
        journal: article.journal || '中华医学期刊',
        diagnosis: article.diagnosis || '',
        treatment: article.treatment || '',
        outcome: article.outcome || ''
      }));
      
    } catch (error) {
      console.error('搜索中华期刊失败:', error);
      return [];
    }
  }

  /**
   * 根据标题推断文章类型
   */
  private guessArticleType(title: string): string {
    if (!title) return '未知';
    if (title.includes('病例报告')) return '病例报告';
    if (title.includes('临床病例')) return '临床病例';
    if (title.includes('例报告')) return '病例报告';
    if (title.includes('个案')) return '病例报告';
    if (title.includes('指南')) return '指南';
    if (title.includes('共识')) return '专家共识';
    if (title.includes('综述')) return '综述';
    return '论著';
  }
}

export const medicalSearchService = new MedicalSearchService();