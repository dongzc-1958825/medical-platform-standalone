// src/shared/services/aiSearchService.ts

import { medicalSearchService } from './medicalSearchService';

export class AISearchService {
  async search(symptom: string, patientInfo?: any): Promise<any> {
    console.log('🤖 AI智能搜索:', symptom);
    
    // 临时返回空结果，避免报错
    return {
      drugs: {
        summary: 'AI搜索功能正在优化中',
        categories: []
      }
    };
  }
}

export const aiSearchService = new AISearchService();
