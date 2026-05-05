// src/shared/services/webDrugSearchService.ts

/**
 * 网络药品分类服务
 * 提供药物大类的比较和指导
 */

export interface DrugCategory {
  name: string;              // 类别名称
  description: string;       // 类别说明
  pros: string[];            // 优点
  cons: string[];            // 缺点
  suitableFor: string[];     // 适用人群
  notSuitableFor: string[];  // 不适用人群
  commonDrugs: string[];     // 常见药物
  matchScore?: number;       // 匹配度
  matchReason?: string;      // 匹配理由
}

export interface CategoryComparison {
  mainCategory: string;      // 主要类别
  categories: DrugCategory[]; // 可选的多个类别
  recommendation: string;    // 综合建议
}

class WebDrugSearchService {
  
  // 药物类别知识库
  private categoryDatabase: Record<string, DrugCategory[]> = {
    '失眠': [
      {
        name: '非苯二氮䓬类',
        description: '新一代镇静催眠药，作用时间短，依赖性较低',
        pros: ['起效快', '半衰期短', '依赖性低', '次日嗜睡少'],
        cons: ['价格较高', '部分人可能有口苦感'],
        suitableFor: ['入睡困难者', '需要短期用药者', '老年人（减量）'],
        notSuitableFor: ['重症肌无力患者', '严重呼吸功能不全者'],
        commonDrugs: ['右佐匹克隆', '唑吡坦', '扎来普隆']
      },
      {
        name: '苯二氮䓬类',
        description: '传统镇静催眠药，有抗焦虑作用',
        pros: ['抗焦虑效果好', '价格便宜', '作用时间长'],
        cons: ['易产生依赖性', '有戒断反应', '次日嗜睡明显'],
        suitableFor: ['焦虑性失眠', '早醒型失眠', '短期用药'],
        notSuitableFor: ['老年人', '肝功能不全者', '有药物依赖史者'],
        commonDrugs: ['艾司唑仑', '阿普唑仑', '劳拉西泮']
      },
      {
        name: '褪黑素受体激动剂',
        description: '调节生物节律，副作用小',
        pros: ['副作用少', '无依赖性', '调节生物钟'],
        cons: ['起效慢', '效果因人而异'],
        suitableFor: ['老年人', '生物节律紊乱者', '时差综合征'],
        notSuitableFor: ['自身免疫疾病患者', '癫痫患者'],
        commonDrugs: ['褪黑素', '雷美替胺']
      }
    ],
    '高血压': [
      {
        name: '钙通道阻滞剂',
        description: '通过阻断钙离子通道，扩张血管',
        pros: ['降压效果好', '无代谢副作用', '适合老年人'],
        cons: ['可能引起踝部水肿', '头痛', '面部潮红'],
        suitableFor: ['老年高血压', '合并冠心病', '单纯收缩期高血压'],
        notSuitableFor: ['心力衰竭患者', '严重低血压'],
        commonDrugs: ['硝苯地平', '氨氯地平', '非洛地平']
      },
      {
        name: 'ACEI类',
        description: '血管紧张素转换酶抑制剂',
        pros: ['保护心肾功能', '减少蛋白尿', '改善心衰'],
        cons: ['可能引起干咳', '血钾升高'],
        suitableFor: ['合并糖尿病', '合并心衰', '蛋白尿患者'],
        notSuitableFor: ['孕妇', '双侧肾动脉狭窄', '血管神经性水肿史'],
        commonDrugs: ['卡托普利', '依那普利', '培哚普利']
      },
      {
        name: 'ARB类',
        description: '血管紧张素II受体拮抗剂',
        pros: ['降压平稳', '无干咳', '保护肾脏'],
        cons: ['价格较高', '起效较慢'],
        suitableFor: ['ACEI不耐受者', '合并糖尿病', '蛋白尿患者'],
        notSuitableFor: ['孕妇', '双侧肾动脉狭窄'],
        commonDrugs: ['氯沙坦', '缬沙坦', '厄贝沙坦']
      }
    ],
    '疼痛': [
      {
        name: '非甾体抗炎药',
        description: '具有抗炎、镇痛、解热作用',
        pros: ['抗炎效果好', '非处方药易得', '价格便宜'],
        cons: ['胃肠道刺激', '心血管风险'],
        suitableFor: ['关节炎', '肌肉痛', '头痛', '牙痛'],
        notSuitableFor: ['消化道溃疡', '严重肝肾功能不全'],
        commonDrugs: ['布洛芬', '双氯芬酸钠', '塞来昔布']
      },
      {
        name: '弱阿片类',
        description: '中枢性镇痛药，用于中度疼痛',
        pros: ['镇痛效果强于NSAIDs', '无成瘾性（相对）'],
        cons: ['头晕', '便秘', '恶心'],
        suitableFor: ['中度疼痛', '术后疼痛', '癌痛'],
        notSuitableFor: ['呼吸抑制', '颅脑损伤'],
        commonDrugs: ['曲马多', '可待因']
      }
    ]
  };

  /**
   * 根据症状获取药物类别比较
   */
  async getCategoryComparison(symptom: string): Promise<CategoryComparison | null> {
    if (!symptom) return null;

    // 查找匹配的症状
    const matchedKey = this.findMatchingSymptom(symptom);
    if (!matchedKey) return null;

    const categories = this.categoryDatabase[matchedKey];
    
    // 计算每个类别的匹配度
    categories.forEach(category => {
      category.matchScore = this.calculateMatchScore(category, symptom);
      category.matchReason = this.generateMatchReason(category, matchedKey);
    });

    // 按匹配度排序
    const sortedCategories = categories.sort((a, b) => 
      (b.matchScore || 0) - (a.matchScore || 0)
    );

    return {
      mainCategory: matchedKey,
      categories: sortedCategories,
      recommendation: this.generateRecommendation(sortedCategories, matchedKey)
    };
  }

  /**
   * 查找匹配的症状
   */
  private findMatchingSymptom(symptom: string): string | null {
    // 直接匹配
    if (this.categoryDatabase[symptom]) {
      return symptom;
    }
    
    // 部分匹配
    for (const key of Object.keys(this.categoryDatabase)) {
      if (symptom.includes(key) || key.includes(symptom)) {
        return key;
      }
    }
    
    return null;
  }

  /**
   * 计算匹配度
   */
  private calculateMatchScore(category: DrugCategory, symptom: string): number {
    let score = 70; // 基础分
    
    // 根据症状和类别的相关性加分
    if (symptom.includes('失眠') && category.name.includes('苯二氮')) {
      score += 20;
    } else if (symptom.includes('高血压') && category.name.includes('地平')) {
      score += 20;
    } else if (symptom.includes('高血压') && (category.name.includes('ACEI') || category.name.includes('ARB'))) {
      score += 15;
    } else if (symptom.includes('疼痛') && category.name.includes('非甾体')) {
      score += 20;
    }
    
    return Math.min(100, score);
  }

  /**
   * 生成匹配理由
   */
  private generateMatchReason(category: DrugCategory, symptomKey: string): string {
    const reasons: Record<string, string> = {
      '失眠': `${category.name}是治疗失眠的常用药物类别之一`,
      '高血压': `${category.name}是治疗高血压的主要药物类别`,
      '疼痛': `${category.name}适用于缓解疼痛`
    };
    
    return reasons[symptomKey] || `适用于${symptomKey}的治疗`;
  }

  /**
   * 生成综合建议
   */
  private generateRecommendation(categories: DrugCategory[], symptomKey: string): string {
    const topCategory = categories[0];
    const secondCategory = categories[1];
    
    if (!topCategory) return '请咨询医生获取个性化建议';
    
    let recommendation = `根据您的症状，**${topCategory.name}** 是首选，`;
    recommendation += topCategory.pros[0] + '。';
    
    if (secondCategory) {
      recommendation += ` 如果${topCategory.name}不适合，可考虑${secondCategory.name}，`;
      recommendation += secondCategory.pros[0] + '。';
    }
    
    return recommendation;
  }
}

export const webDrugSearchService = new WebDrugSearchService();