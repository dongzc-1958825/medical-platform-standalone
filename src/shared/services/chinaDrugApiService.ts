// src/shared/services/chinaDrugApiService.ts

/**
 * 中国药品数据API服务 - 来自各地公共数据开放平台
 * 完全免费，无需申请API密钥
 */

export interface ChinaDrugInfo {
  id: string;
  name: string;
  genericName?: string;
  approvalNumber?: string;
  manufacturer?: string;
  dosage?: string;
  strength?: string;
  drugType?: string;
  insuranceType?: '甲类' | '乙类' | '谈判药' | '丙类';
  source: 'chengdu' | 'guangxi' | 'shandong' | 'jinan';
  sourceUrl?: string;
}

class ChinaDrugApiService {
  
  /**
   * 搜索中国药品 - 从多个公共数据平台获取
   */
  async searchChineseDrugs(keyword: string): Promise<ChinaDrugInfo[]> {
    if (!keyword.trim()) return [];
    
    console.log(`🔍 搜索中国药品: "${keyword}"`);
    
    try {
      // 并发从多个免费API获取数据
      const [chengduResults, guangxiResults, shandongResults, jinanResults] = await Promise.allSettled([
        this.searchChengdu(keyword),
        this.searchGuangxi(keyword),
        this.searchShandong(keyword),
        this.searchJinan(keyword)
      ]);
      
      const results: ChinaDrugInfo[] = [];
      
      // 合并成都结果
      if (chengduResults.status === 'fulfilled' && chengduResults.value.length > 0) {
        results.push(...chengduResults.value);
      }
      
      // 合并广西结果
      if (guangxiResults.status === 'fulfilled' && guangxiResults.value.length > 0) {
        results.push(...guangxiResults.value);
      }
      
      // 合并山东结果
      if (shandongResults.status === 'fulfilled' && shandongResults.value.length > 0) {
        results.push(...shandongResults.value);
      }
      
      // 合并济南结果
      if (jinanResults.status === 'fulfilled' && jinanResults.value.length > 0) {
        results.push(...jinanResults.value);
      }
      
      // 去重后返回
      return this.deduplicate(results);
      
    } catch (error) {
      console.error('❌ 中国药品API搜索失败:', error);
      return [];
    }
  }

  /**
   * 成都公共数据开放平台 - 大邑县部分药品名录
   * 数据量：104万+条，无条件开放 [citation:1]
   */
  private async searchChengdu(keyword: string): Promise<ChinaDrugInfo[]> {
    try {
      // API地址来自成都公共数据开放平台 [citation:1]
      const url = `https://www.chengdu.gov.cn/data/gateway/api/1/9c950aba8fbb4bdc8bd85d1966682944?keyword=${encodeURIComponent(keyword)}`;
      
      const response = await fetch(url);
      if (!response.ok) return [];
      
      const data = await response.json();
      
      return data.data?.map((item: any) => ({
        id: `cd-${item.xh}`,
        name: item.mm, // 药品通用名
        genericName: item.mm,
        approvalNumber: item.wh, // 批准文号
        manufacturer: item.qy, // 生产企业
        dosage: item.jx, // 细化剂型
        strength: item.gg, // 规格
        drugType: item.lb, // 基药类别
        source: 'chengdu'
      })) || [];
      
    } catch (error) {
      return [];
    }
  }

  /**
   * 广西公共数据开放平台 - 国家药品目录中成药部分
   * 数据量：1,422条，无条件开放 [citation:4]
   */
  private async searchGuangxi(keyword: string): Promise<ChinaDrugInfo[]> {
    try {
      const url = `https://bh.data.gxzf.gov.cn/gateway/api/1/a3dbbd6c31014d9e8f626d7822a2d3ae?keyword=${encodeURIComponent(keyword)}`;
      
      const response = await fetch(url);
      if (!response.ok) return [];
      
      const data = await response.json();
      
      return data.data?.map((item: any) => ({
        id: `gx-${item.xuhao}`,
        name: item.yaopinmingcheng, // 药品名称
        drugType: '中成药',
        source: 'guangxi'
      })) || [];
      
    } catch (error) {
      return [];
    }
  }

  /**
   * 山东公共数据开放网 - 国家带量采购药品目录
   * 无条件开放 [citation:5]
   */
  private async searchShandong(keyword: string): Promise<ChinaDrugInfo[]> {
    try {
      const url = `http://data.sd.gov.cn/gateway/api/1/gjdlcgypypmlxx?keyword=${encodeURIComponent(keyword)}`;
      
      const response = await fetch(url);
      if (!response.ok) return [];
      
      const data = await response.json();
      
      return data.data?.map((item: any) => ({
        id: `sd-${item.Pici}`,
        name: item.GuoJiaDiErPiDaiLiangCaiGouYaoPinZhongLei,
        manufacturer: item.GuoJiaDiErPiDaiLiangCaiGouYaoPinShengChanQiYe,
        strength: item.GuoJiaDiErPiDaiLiangCaiGouYaoPinGuiGe,
        dosage: item.JiXing,
        source: 'shandong'
      })) || [];
      
    } catch (error) {
      return [];
    }
  }

  /**
   * 济南公共数据开放网 - 国家医保药品目录（西药部分）
   * 数据量：5,860条，无条件开放 [citation:7]
   */
  private async searchJinan(keyword: string): Promise<ChinaDrugInfo[]> {
    try {
      const url = `http://data.jinan.gov.cn/jinan/gateway/api/1/72043f4ef2d24419b25c4cb416359b41?keyword=${encodeURIComponent(keyword)}`;
      
      const response = await fetch(url);
      if (!response.ok) return [];
      
      const data = await response.json();
      
      return data.data?.map((item: any) => ({
        id: `jn-${item.bh}`,
        name: item.ypmc, // 药品名称
        dosage: item.jx, // 剂型
        drugType: item.ypfl, // 药品分类
        source: 'jinan'
      })) || [];
      
    } catch (error) {
      return [];
    }
  }

  /**
   * 去重
   */
  private deduplicate(results: ChinaDrugInfo[]): ChinaDrugInfo[] {
    const seen = new Set();
    return results.filter(item => {
      const key = `${item.name}-${item.manufacturer || ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

// ========== 导出单例 ==========
const instance = new ChinaDrugApiService();
export const chinaDrugApiService = instance;

if (typeof window !== 'undefined') {
  (window as any).chinaDrugApiService = instance;
}