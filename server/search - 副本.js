// server/search.js

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

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
  
  // 修复：移除 TypeScript 类型注解
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

module.exports = router;