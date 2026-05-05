// server/search.js

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

// ========== 中华医学期刊搜索 ==========
router.get('/yiigle/search', async (req, res) => {
  const { q, page = 1 } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: '缺少搜索关键词' });
  }
  
  console.log(`🔍 中华医学期刊搜索: ${q}`);
  
  try {
    // 修改后的搜索URL - 去掉了 /case
    const searchUrl = `https://www.yiigle.com/search?q=${encodeURIComponent(q)}&page=${page}`;
    console.log(`📡 请求URL: ${searchUrl}`);
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Referer': 'https://www.yiigle.com/'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(response.data);
    const articles = [];
    
    // 尝试多种选择器匹配搜索结果
    $('.search-result-item, .case-item, .article-item, .result-item').each((i, elem) => {
      if (i >= 10) return;
      
      const titleElem = $(elem).find('.title, .case-title, .result-title a');
      const title = titleElem.text().trim();
      const link = titleElem.find('a').attr('href') || $(elem).find('a').first().attr('href');
      const abstract = $(elem).find('.abstract, .summary, .description').text().trim();
      const journal = $(elem).find('.journal, .source, .meta').text().trim();
      
      if (title && title.length > 5) {
        articles.push({
          id: `yiigle-${Date.now()}-${i}`,
          title: title,
          abstract: abstract.substring(0, 300),
          url: link ? (link.startsWith('http') ? link : `https://www.yiigle.com${link}`) : '',
          journal: journal || '中华医学期刊',
          source: 'yiigle',
          articleType: title.includes('病例') || title.includes('临床') ? '病例报告' : '文献'
        });
      }
    });
    
    if (articles.length === 0) {
      console.log('⚠️ 未找到搜索结果，返回Mock数据');
      return res.json({
        success: true,
        isMock: true,
        data: getMockYiigleArticles(q)
      });
    }
    
    console.log(`✅ 找到 ${articles.length} 条结果`);
    res.json({
      success: true,
      isMock: false,
      data: articles
    });
    
  } catch (error) {
    console.error('中华医学期刊搜索失败:', error.message);
    res.json({
      success: true,
      isMock: true,
      data: getMockYiigleArticles(q)
    });
  }
});

function getMockYiigleArticles(keyword) {
  return [
    {
      id: `mock-1`,
      title: `${keyword}诊疗指南（2024版）`,
      abstract: `本指南系统总结了${keyword}的最新诊疗进展，包括病因学、诊断方法、治疗方案和预防措施。`,
      journal: '中华医学杂志',
      url: 'https://www.yiigle.com/guideline/2024',
      source: 'yiigle'
    }
  ];
}

// ========== 统一搜索服务 ==========
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

// ========== 药品搜索（优先中国药品数据源）==========
async function searchDrug(keyword) {
  try {
    // 1. 黑龙江公共数据平台（174,460条药品数据，无条件开放）
    const heilongjiangResults = await searchHeilongjiangDrug(keyword);
    if (heilongjiangResults && heilongjiangResults.results?.length > 0) {
      console.log(`✅ 黑龙江平台返回 ${heilongjiangResults.results.length} 条中国药品`);
      return heilongjiangResults;
    }
    
    // 2. 临沂公共数据平台（1,587条药品价格数据，无条件开放）
    const linyiResults = await searchLinyiDrug(keyword);
    if (linyiResults && linyiResults.results?.length > 0) {
      console.log(`✅ 临沂平台返回 ${linyiResults.results.length} 条中国药品`);
      return linyiResults;
    }
    
    // 3. 国家药监局官方数据查询
    const nmpaResults = await searchNMPAOfficial(keyword);
    if (nmpaResults && nmpaResults.results?.length > 0) {
      console.log(`✅ 国家药监局返回 ${nmpaResults.results.length} 条药品`);
      return nmpaResults;
    }
    
    // 4. FDA API（国际药品补充）
    const fdaResults = await searchFDAFiltered(keyword);
    if (fdaResults && fdaResults.results?.length > 0) {
      console.log(`✅ FDA返回 ${fdaResults.results.length} 条国际药品`);
      return fdaResults;
    }
    
    // 5. 如果没有结果，返回国家药监局查询链接
    return {
      source: 'nmpa_link',
      isExternal: true,
      message: '未找到精确匹配，请点击链接查询国家药监局官方数据',
      url: `https://www.nmpa.gov.cn/datasearch/search-result.html?q=${encodeURIComponent(keyword)}&tableId=26`,
      results: []
    };
    
  } catch (error) {
    console.error('药品搜索失败:', error.message);
    return null;
  }
}

// ========== 黑龙江公共数据平台 ==========
async function searchHeilongjiangDrug(keyword) {
  try {
    const url = `https://data.harbin.gov.cn/oportal/api/catalog/62210?keyword=${encodeURIComponent(keyword)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      },
      timeout: 10000
    });
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      return {
        source: 'heilongjiang',
        results: response.data.data.map(item => ({
          name: item.YPMC || item.药品名称,
          manufacturer: item.SCQY || item.生产企业,
          specification: item.GG || item.规格,
          dosage: item.JX || item.剂型,
          price: item.JG || item.价格,
          source: '黑龙江公共数据平台'
        }))
      };
    }
    return null;
  } catch (error) {
    console.error('黑龙江药品搜索失败:', error.message);
    return null;
  }
}

// ========== 临沂公共数据平台 ==========
async function searchLinyiDrug(keyword) {
  try {
    const url = `http://lydata.sd.gov.cn/gateway/api/1/post_coun92?keyword=${encodeURIComponent(keyword)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      },
      timeout: 10000
    });
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      return {
        source: 'linyi',
        results: response.data.data.map(item => ({
          name: item.YaoPinMingCheng,
          manufacturer: item.ShengChanChangJia,
          specification: item.GuiGe,
          dosage: item.YaoPinJiXing,
          price: item.LingShouJiaYuan,
          source: '临沂公共数据平台'
        }))
      };
    }
    return null;
  } catch (error) {
    console.error('临沂药品搜索失败:', error.message);
    return null;
  }
}

// ========== 国家药监局官方数据查询 ==========
async function searchNMPAOfficial(keyword) {
  try {
    const url = `https://www.nmpa.gov.cn/datasearch/api/search?tableId=26&searchValue=${encodeURIComponent(keyword)}&pageNum=1&pageSize=10`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://www.nmpa.gov.cn/',
        'Accept': 'application/json'
      },
      timeout: 10000
    });
    
    if (response.data && response.data.data && response.data.data.list) {
      return {
        source: 'nmpa',
        results: response.data.data.list.map(item => ({
          name: item.PRODUCT_NAME || item.GENERIC_NAME,
          approvalNumber: item.APPROVAL_NUMBER,
          manufacturer: item.ENTERPRISE_NAME,
          specification: item.SPECIFICATION,
          source: '国家药监局'
        }))
      };
    }
    return null;
  } catch (error) {
    console.error('NMPA搜索失败:', error.message);
    return null;
  }
}

// ========== FDA API（过滤版）==========
const COMMON_DRUGS = [
  'febuxostat', 'allopurinol', 'colchicine', 'ibuprofen', 'aspirin',
  'gabapentin', 'pregabalin', 'amitriptyline', 'metformin', 'amlodipine'
];

async function searchFDAFiltered(keyword) {
  try {
    const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(keyword)}+openfda.generic_name:${encodeURIComponent(keyword)}&limit=10`;
    const response = await axios.get(url, { timeout: 10000 });
    
    if (response.data.results && response.data.results.length > 0) {
      const filtered = response.data.results.filter(item => {
        const name = (item.openfda?.brand_name?.[0] || item.openfda?.generic_name?.[0] || '').toLowerCase();
        const excluded = ['placidyl', 'nembutal', 'erythrocin'];
        if (excluded.some(e => name.includes(e))) return false;
        return COMMON_DRUGS.some(d => name.includes(d));
      });
      
      const resultsToUse = filtered.length > 0 ? filtered : response.data.results.slice(0, 3);
      
      return {
        source: 'fda',
        results: resultsToUse.map((item) => ({
          name: item.openfda?.brand_name?.[0] || item.openfda?.generic_name?.[0],
          manufacturer: item.openfda?.manufacturer_name?.[0],
          indications: item.indications_and_usage?.[0]?.substring(0, 200),
          source: 'FDA'
        }))
      };
    }
    return null;
  } catch (error) {
    console.error('FDA搜索失败:', error.message);
    return null;
  }
}

// ========== 疾病搜索 ==========
async function searchDisease(keyword) {
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
        content: content.substring(0, 2000),
        url
      };
    }
    return null;
  } catch (error) {
    console.error('疾病搜索失败:', error.message);
    return null;
  }
}

module.exports = router;