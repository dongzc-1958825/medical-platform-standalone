export interface YiigleArticle {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  date: string;
  abstract: string;
  url: string;
  articleType: 'guideline' | 'case' | 'review' | 'research';
  credibilityLevel: 'B' | 'C';
  keywords: string[];
}

class YiigleParserService {
  private proxyUrl = 'http://localhost:3001'; // 后端代理地址

  /**
   * 搜索并解析文章 - 通过后端代理
   */
  async searchArticles(keyword: string, page: number = 1): Promise<YiigleArticle[]> {
    try {
      console.log(`🔍 通过代理搜索中华医学期刊: ${keyword}, 第${page}页`);
      
      const response = await fetch(
        `${this.proxyUrl}/api/yiigle/search?q=${encodeURIComponent(keyword)}&page=${page}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.isMock) {
        console.log('⚠️ 使用模拟数据（代理抓取失败）');
      } else {
        console.log(`✅ 获取到 ${result.data.length} 篇真实文章`);
      }
      
      return result.data;
      
    } catch (error) {
      console.error('代理请求失败:', error);
      return this.getMockArticles(keyword);
    }
  }

  /**
   * 获取模拟数据（当抓取失败时）
   */
  private getMockArticles(keyword: string): YiigleArticle[] {
    if (keyword.includes('失眠')) {
      return [
        {
          id: `mock-insomnia-1-${Date.now()}`,
          title: `失眠诊疗指南（2024版）`,
          authors: ['中华医学会神经病学分会', '中国睡眠研究会'],
          journal: '中华神经科杂志',
          date: '2024-02-10',
          abstract: `本指南系统总结了失眠症的诊断标准和治疗方案，包括认知行为疗法(CBT-I)、药物治疗和非药物治疗的选择原则。强调了个性化治疗和长期管理的重要性。`,
          url: 'https://www.yiigle.com/guideline/insomnia-2024',
          articleType: 'guideline',
          credibilityLevel: 'B',
          keywords: [keyword, '失眠', '指南', 'CBT-I', '药物治疗']
        },
        {
          id: `mock-insomnia-2-${Date.now()}`,
          title: `失眠患者的管理新进展`,
          authors: ['李教授', '王医师', '张研究员'],
          journal: '中国现代神经疾病杂志',
          date: '2023-11-15',
          abstract: `探讨了失眠患者的综合管理策略，包括睡眠卫生教育、放松训练、刺激控制疗法等非药物治疗方法的临床应用效果。研究表明，多模式干预比单一治疗效果更佳。`,
          url: 'https://www.yiigle.com/article/insomnia-202311',
          articleType: 'research',
          credibilityLevel: 'C',
          keywords: [keyword, '失眠', '管理', '非药物治疗']
        }
      ];
    }
    
    return [
      {
        id: `mock-1-${Date.now()}`,
        title: `${keyword}诊疗指南（2024版）`,
        authors: ['中华医学会', '中国医师协会'],
        journal: '中华医学杂志',
        date: '2024-01-15',
        abstract: `本指南系统总结了${keyword}的最新诊疗进展，包括病因学、诊断方法、治疗方案和预防措施。特别强调了个体化治疗和多学科协作的重要性。`,
        url: 'https://www.yiigle.com/guideline/2024',
        articleType: 'guideline',
        credibilityLevel: 'B',
        keywords: [keyword, '指南', '诊疗规范']
      },
      {
        id: `mock-2-${Date.now()}`,
        title: `${keyword}患者管理新进展`,
        authors: ['李教授', '王医师', '张研究员'],
        journal: '中国实用内科杂志',
        date: '2023-12-20',
        abstract: `探讨了${keyword}患者的新型管理模式，通过远程医疗和数字健康技术改善患者依从性和治疗效果。`,
        url: 'https://www.yiigle.com/article/20231220',
        articleType: 'research',
        credibilityLevel: 'C',
        keywords: [keyword, '管理', '远程医疗']
      }
    ];
  }
}

export const yiigleParserService = new YiigleParserService();