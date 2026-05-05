// src/shared/services/drugSearchService.ts

/**
 * 药品搜索服务 - 保留AI药品问答功能
 * AI药品问答调用专业的AI药品问答服务，返回专业详实的Markdown格式回答
 */

import { aiMedicalService } from './aiMedicalService';

export interface DrugInfo {
  id: string;
  name: string;
  nameCn: string;
  category: string;
  indications: string[];
  contraindications: string[];
  usage: string;
  sideEffects: string[];
  manufacturer?: string;
  source: string;
  sourceUrl?: string;
  matchScore?: number;
}

export interface DrugRecommendation {
  summary: string;
  categories: {
    name: string;
    description: string;
    drugs: DrugInfo[];
  }[];
}

class DrugSearchService {
  
  /**
   * 根据症状搜索药品 - 已移除，直接返回空
   * 请使用AI用药指导功能
   */
  async searchBySymptom(symptom: string): Promise<DrugInfo[]> {
    console.log(`⚠️ 药品搜索功能已移除，请使用AI药品问答或AI用药指导`);
    return [];
  }

  /**
   * 根据药品名搜索 - 已移除
   * 请使用AI药品问答功能
   */
  async searchByName(drugName: string): Promise<DrugInfo | null> {
    console.log(`⚠️ 药品名称搜索已移除，请使用AI药品问答`);
    return null;
  }

  /**
   * AI推荐 - 已移除
   * 请使用AI用药指导功能
   */
  async recommend(symptom: string, patientInfo?: any): Promise<DrugRecommendation> {
    console.log(`⚠️ AI推荐已移除，请使用AI用药指导功能`);
    return {
      summary: `关于"${symptom}"的用药指导，请点击上方"AI智能用药指导"按钮获取个性化建议。`,
      categories: []
    };
  }

  /**
   * AI药品问答 - 专业详实的药品咨询服务
   * 
   * 适用场景：
   * - 药物对比（如：布洛芬和对乙酰氨基酚哪个好？）
   * - 特殊人群用药（如：老年人高血压用药选择？）
   * - 药物机制咨询（如：他汀类药物是怎么降血脂的？）
   * - 宽泛药品问题（如：痛风急性期止痛药有哪些？）
   * - 癌症晚期止痛（如：癌症晚期病人止痛药怎么选？）
   * 
   * @param question 用户问题
   * @returns 专业详实的Markdown格式回答
   */
  async askDrugQuestion(question: string): Promise<{
    answer: string;
    relatedDrugs?: DrugInfo[];
  }> {
    console.log(`🤖 AI药品问答: ${question}`);
    
    if (!question || !question.trim()) {
      return {
        answer: '请先输入您的问题。\n\n例如：\n- 布洛芬和对乙酰氨基酚哪个好？\n- 痛风急性期止痛药有哪些？\n- 癌症晚期病人止痛药怎么选？',
        relatedDrugs: []
      };
    }
    
    try {
      // 调用 aiMedicalService 的 askDrugQuestion 方法（返回详细Markdown）
      const answer = await aiMedicalService.askDrugQuestion(question);
      return {
        answer: answer,
        relatedDrugs: []
      };
    } catch (error) {
      console.error('AI药品问答失败:', error);
      return {
        answer: `关于"${question}"的问题，建议咨询医生或药师。`,
        relatedDrugs: []
      };
    }
  }
}

export const drugSearchService = new DrugSearchService();

// 挂载到window方便测试
if (typeof window !== 'undefined') {
  (window as any).drugSearchService = drugSearchService;
}