// server/search.js

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

// ========== 统一搜索服务 ==========

/**
 * 统一搜索服务
 * 支持 type: 'drug' | 'disease' | 'all'
 */
router.post('/search', async (req, res) => {
  const { keyword, type = 'all' } = req.body;
  
  if (!keyword) {
    return res.status(400).json({ error: '缺少搜索关键词' });
  }
  
  console.log(`🔍 搜索: ${keyword}, 类型: ${type}`);
  
  const result = { keyword, timestamp: new Date().toISOString() };
  
  try {
    // 药品搜索
    if (type === 'all' || type === 'drug') {
      result.drugs = await searchDrug(keyword);
    }
    
    // 疾病搜索
    if (type === 'all' || type === 'disease') {
      result.diseases = await searchDisease(keyword);
    }
    
    res.json(result);
    
  } catch (error) {
    console.error('搜索失败:', error);
    res.status(500).json({ error: '搜索失败' });
  }
});

/**
 * 药品搜索
 */
async function searchDrug(keyword) {
  try {
    // 药智数据
    const yaozhiResults = await searchYaozhi(keyword);
    if (yaozhiResults) return yaozhiResults;
    
    // FDA API
    const fdaResults = await searchFDA(keyword);
    if (fdaResults) return fdaResults;
    
    return null;
  } catch (error) {
    console.error('药品搜索失败:', error.message);
    return null;
  }
}

/**
 * 疾病搜索
 */
async function searchDisease(keyword) {
  try {
    // 默沙东诊疗手册
    const msdResults = await searchMSD(keyword);
    if (msdResults) return msdResults;
    
    // 百度百科
    const baiduResults = await searchBaidu(keyword);
    if (baiduResults) return baiduResults;
    
    return null;
  } catch (error) {
    console.error('疾病搜索失败:', error.message);
    return null;
  }
}

/**
 * 默沙东诊疗手册搜索
 */
async function searchMSD(keyword) {
  try {
    const searchUrl = `https://www.msdmanuals.cn/search?query=${encodeURIComponent(keyword)}`;
    const response = await axios.get(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    const firstResult = $('.search-result').first();
    if (!firstResult.length) return null;
    
    const link = firstResult.find('a').attr('href');
    const fullUrl = link && link.startsWith('http') ? link : `https://www.msdmanuals.cn${link}`;
    
    const detailResponse = await axios.get(fullUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    });
    
    const $detail = cheerio.load(detailResponse.data);
    
    let content = '';
    $detail('.section-content, .content, .article-content').each((i, elem) => {
      content += $detail(elem).text().trim() + '\n\n';
    });
    
    return {
      source: 'msd',
      content: content.substring(0, 5000),
      url: fullUrl
    };
    
  } catch (error) {
    console.error('MSD搜索失败:', error.message);
    return null;
  }
}

/**
 * 百度百科搜索
 */
async function searchBaidu(keyword) {
  try {
    const url = `https://baike.baidu.com/item/${encodeURIComponent(keyword)}`;
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    let content = '';
    $('.lemma-summary, .para').each((i, elem) => {
      content += $(elem).text().trim() + '\n\n';
    });
    
    if (content.length > 100) {
      return {
        source: 'baidu',
        content: content.substring(0, 5000),
        url
      };
    }
    
    return null;
    
  } catch (error) {
    console.error('百度搜索失败:', error.message);
    return null;
  }
}

/**
 * 药智数据搜索
 */
async function searchYaozhi(keyword) {
  try {
    const url = `https://db.yaozhi.com/search?keyword=${encodeURIComponent(keyword)}`;
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    const results = [];
    $('.search-item').each((i, elem) => {
      if (i >= 5) return;
      
      const name = $(elem).find('.drug-name').text().trim();
      const manufacturer = $(elem).find('.manufacturer').text().trim();
      const link = $(elem).find('a').attr('href');
      
      if (name) {
        results.push({
          name,
          manufacturer,
          url: link && link.startsWith('http') ? link : `https://db.yaozhi.com${link}`
        });
      }
    });
    
    if (results.length > 0) {
      return { source: 'yaozhi', results };
    }
    
    return null;
    
  } catch (error) {
    console.error('药智搜索失败:', error.message);
    return null;
  }
}

/**
 * FDA API搜索
 */
async function searchFDA(keyword) {
  try {
    const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(keyword)}+openfda.generic_name:${encodeURIComponent(keyword)}&limit=5`;
    const response = await axios.get(url);
    
    if (response.data.results && response.data.results.length > 0) {
      return {
        source: 'fda',
        results: response.data.results.map(function(item) {
          return {
            name: item.openfda && item.openfda.brand_name ? item.openfda.brand_name[0] : (item.openfda && item.openfda.generic_name ? item.openfda.generic_name[0] : ''),
            manufacturer: item.openfda && item.openfda.manufacturer_name ? item.openfda.manufacturer_name[0] : '',
            indications: item.indications_and_usage ? item.indications_and_usage[0]?.substring(0, 200) : ''
          };
        })
      };
    }
    
    return null;
    
  } catch (error) {
    console.error('FDA搜索失败:', error.message);
    return null;
  }
}

// ========== 中华医学期刊搜索 ==========

/**
 * 中华医学期刊搜索
 */
router.get('/yiigle/search', async (req, res) => {
  const { q, page = 1 } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: '缺少搜索关键词' });
  }
  
  console.log(`🔍 中华医学期刊搜索: ${q}, 页码: ${page}`);
  
  try {
    const searchUrl = `https://www.yiigle.com/search/case?q=${encodeURIComponent(q)}&page=${page}`;
    const response = await axios.get(searchUrl, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(response.data);
    const articles = [];
    
    // 解析搜索结果 - 尝试多种选择器
    const selectors = ['.search-result-item', '.case-item', '.article-item', '.item', '.list-item'];
    
    for (const selector of selectors) {
      const items = $(selector);
      if (items.length > 0) {
        items.each((i, elem) => {
          if (i >= 10) return;
          
          const titleElem = $(elem).find('.title, .case-title, a').first();
          const title = titleElem.text().trim();
          const link = titleElem.attr('href');
          const abstract = $(elem).find('.abstract, .summary, .desc').text().trim();
          const journal = $(elem).find('.journal, .source').text().trim();
          const date = $(elem).find('.date, .time').text().trim();
          
          if (title && title.length > 5 && !articles.some(a => a.title === title)) {
            articles.push({
              id: `yiigle-${Date.now()}-${i}`,
              title: title,
              abstract: abstract.substring(0, 500),
              url: link && link.startsWith('http') ? link : `https://www.yiigle.com${link || ''}`,
              journal: journal || '中华医学期刊',
              date: date || '',
              authors: [],
              articleType: 'case',
              credibilityLevel: 'B',
              keywords: [q]
            });
          }
        });
        break;
      }
    }
    
    // 如果没找到，返回模拟数据
    if (articles.length === 0) {
      console.log('⚠️ 未找到真实文章，返回模拟数据');
      return res.json({
        success: true,
        isMock: true,
        data: getMockYiigleArticles(q)
      });
    }
    
    console.log(`✅ 找到 ${articles.length} 篇真实文章`);
    res.json({
      success: true,
      isMock: false,
      data: articles
    });
    
  } catch (error) {
    console.error('中华医学期刊搜索失败:', error.message);
    // 失败时返回模拟数据
    res.json({
      success: true,
      isMock: true,
      data: getMockYiigleArticles(q)
    });
  }
});

/**
 * 获取模拟的中华医学期刊文章
 */
function getMockYiigleArticles(keyword) {
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
  
  if (keyword.includes('痛风')) {
    return [
      {
        id: `mock-gout-1-${Date.now()}`,
        title: `痛风诊疗指南（2024版）`,
        authors: ['中华医学会风湿病学分会'],
        journal: '中华风湿病学杂志',
        date: '2024-01-15',
        abstract: `本指南系统总结了痛风的诊断标准和治疗方案，包括急性期抗炎治疗和缓解期降尿酸治疗。强调了个体化治疗和生活方式干预的重要性。`,
        url: 'https://www.yiigle.com/guideline/gout-2024',
        articleType: 'guideline',
        credibilityLevel: 'B',
        keywords: [keyword, '痛风', '高尿酸', '别嘌醇']
      },
      {
        id: `mock-gout-2-${Date.now()}`,
        title: `痛风患者管理新进展`,
        authors: ['王教授', '李医师'],
        journal: '中国实用内科杂志',
        date: '2023-10-20',
        abstract: `探讨了痛风患者的综合管理策略，包括饮食控制、药物治疗和定期随访的重要性。研究表明，多模式干预比单一治疗效果更佳。`,
        url: 'https://www.yiigle.com/article/gout-202310',
        articleType: 'research',
        credibilityLevel: 'C',
        keywords: [keyword, '痛风', '管理', '饮食']
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

module.exports = router;