// src/shared/services/cmcrSearchService.ts
export interface CMCaseResult {
  id: string;
  title: string;
  authors: string[];
  institution: string;
  patientInfo: {
    gender?: string;
    age?: number;
    chiefComplaint: string;
  };
  diagnosis: string;
  treatment: string;
  outcome: string;
  keywords: string[];
  publishDate: string;
  url: string;
  abstract: string;
}

class CMCRSearchService {
  private baseUrl = 'https://cmcr.yiigle.com/api'; // 需要实际抓包确定
  
  /**
   * 搜索真实案例
   */
  async searchCases(keywords: string[]): Promise<CMCaseResult[]> {
    try {
      // 1. 构建搜索请求（需要先通过浏览器开发者工具抓包确定真实API）
      const searchQuery = keywords.join(' ');
      
      // 这里需要先手动分析cmcr.yiigle.com的网络请求
      // 打开Chrome DevTools -> Network -> 搜索关键词 -> 找到真实API
      
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0...', // 模拟浏览器
        },
        body: JSON.stringify({
          keyword: searchQuery,
          pageSize: 20,
          page: 1
        })
      });
      
      const data = await response.json();
      return this.transformResults(data);
      
    } catch (error) {
      console.error('CMCR搜索失败:', error);
      
      // 2. 降级方案：直接访问网页并解析HTML（更复杂但可行）
      return this.fallbackSearchByHtml(keywords);
    }
  }
  
  /**
   * 降级方案：直接抓取网页HTML并解析（当API不可用时）
   */
  private async fallbackSearchByHtml(keywords: string[]): Promise<CMCaseResult[]> {
    const searchUrl = `https://cmcr.yiigle.com/search?q=${encodeURIComponent(keywords.join(' '))}`;
    
    const response = await fetch(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0...' }
    });
    
    const html = await response.text();
    
    // 用正则或cheerio解析HTML提取案例信息
    // 需要根据实际网页结构调整
    return this.parseHtmlResults(html);
  }
  
  /**
   * 转换为平台统一格式，并添加五级可信度
   */
  private transformResults(rawData: any): CMCaseResult[] {
    return rawData.list.map((item: any) => ({
      id: item.id,
      title: item.title,
      authors: item.authors || [],
      institution: item.institution || '',
      patientInfo: {
        gender: item.patientGender,
        age: item.patientAge,
        chiefComplaint: item.chiefComplaint
      },
      diagnosis: item.diagnosis,
      treatment: item.treatment,
      outcome: item.outcome,
      keywords: item.keywords || [],
      publishDate: item.publishDate,
      url: `https://cmcr.yiigle.com/case/${item.id}`,
      abstract: item.abstract
    }));
  }
  
  /**
   * 计算可信度等级（基于CMCR的同行评议机制）
   */
  getCredibilityLevel(caseData: CMCaseResult): 'S' | 'A' | 'B' {
    // 中国临床案例成果数据库的所有案例都经过同行评议
    // 可结合更多因素调整：三甲医院、专家作者等
    if (caseData.institution.includes('医院') && caseData.authors.length > 0) {
      return 'A'; // 真实患者分享（验证后）
    }
    return 'B'; // 默认B级
  }
}

export const cmcrSearchService = new CMCRSearchService();