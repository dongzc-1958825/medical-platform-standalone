/**
 * 问卷存储服务
 * 负责问卷结果的本地存储管理
 */

export interface QuestionnaireHistoryItem {
  id: string;
  totalScore: number;
  healthLevel: string;
  assessmentTime: string;
  bmi?: number;
  bmiCategory?: string;
}

export interface QuestionnaireResult {
  id: string;
  userId: string;
  assessmentDate: string;
  totalScore: number;
  healthLevel: string;
  sectionScores: any;
  recommendations: string[];
  bmi: number;
  bmiCategory: string;
  questionnaireData: any;
}

class QuestionnaireStorageService {
  private readonly STORAGE_KEYS = {
    LATEST_RESULT: 'latest_questionnaire_result',
    HISTORY: 'questionnaire_history',
    ADULT_RESULT: 'adult_questionnaire_result',
    ADULT_DATA: 'adult_questionnaire_data'
  };

  /**
   * 保存问卷结果
   */
  saveQuestionnaireResult(result: QuestionnaireResult): void {
  try {
    // 确保日期是有效的ISO字符串
    const validResult = {
      ...result,
      assessmentDate: result.assessmentDate || new Date().toISOString()
    };
    
    // 保存最新结果
    localStorage.setItem(this.STORAGE_KEYS.LATEST_RESULT, JSON.stringify(validResult));
    localStorage.setItem(this.STORAGE_KEYS.ADULT_RESULT, JSON.stringify(validResult));
    
    // 更新历史记录
    this.addToHistory({
      id: validResult.id,
      totalScore: validResult.totalScore,
      healthLevel: validResult.healthLevel,
      assessmentTime: validResult.assessmentDate, // ✅ 使用有效的ISO字符串
      bmi: validResult.bmi,
      bmiCategory: validResult.bmiCategory
    });

    console.log('✅ 问卷结果已保存');
  } catch (error) {
    console.error('❌ 保存问卷结果失败:', error);
  }
}

  /**
   * 获取最新问卷结果
   */
  getLatestResult(): QuestionnaireResult | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.LATEST_RESULT);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ 获取最新结果失败:', error);
      return null;
    }
  }

  /**
   * 添加到历史记录
   */
  private addToHistory(item: QuestionnaireHistoryItem): void {
    try {
      const history = this.getHistory();
      
      // 检查是否已存在相同ID的记录
      const existingIndex = history.findIndex(h => h.id === item.id);
      if (existingIndex !== -1) {
        history[existingIndex] = item;
      } else {
        history.unshift(item); // 新记录添加到开头
      }
      
      // 只保留最近20条记录
      const limitedHistory = history.slice(0, 20);
      
      localStorage.setItem(this.STORAGE_KEYS.HISTORY, JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('❌ 添加历史记录失败:', error);
    }
  }

  /**
   * 获取历史记录列表
   */
  getHistory(): QuestionnaireHistoryItem[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ 获取历史记录失败:', error);
      return [];
    }
  }

  /**
   * 根据ID获取历史记录详情
   */
  getHistoryItemById(id: string): QuestionnaireResult | null {
    try {
      // 先从最新结果中查找
      const latest = this.getLatestResult();
      if (latest && latest.id === id) {
        return latest;
      }
      
      // 从历史记录中查找（需要额外存储详细数据）
      // 这里简化实现，实际应该存储每个结果的详细数据
      return null;
    } catch (error) {
      console.error('❌ 获取历史记录详情失败:', error);
      return null;
    }
  }

  /**
   * 清除所有问卷数据
   */
  clearAllData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.LATEST_RESULT);
      localStorage.removeItem(this.STORAGE_KEYS.HISTORY);
      localStorage.removeItem(this.STORAGE_KEYS.ADULT_RESULT);
      localStorage.removeItem(this.STORAGE_KEYS.ADULT_DATA);
      localStorage.removeItem('adult_questionnaire_temp');
      console.log('✅ 所有问卷数据已清除');
    } catch (error) {
      console.error('❌ 清除数据失败:', error);
    }
  }

  /**
   * 删除单条历史记录
   */
  deleteHistoryItem(id: string): void {
    try {
      const history = this.getHistory();
      const filtered = history.filter(item => item.id !== id);
      localStorage.setItem(this.STORAGE_KEYS.HISTORY, JSON.stringify(filtered));
      console.log(`✅ 已删除历史记录: ${id}`);
    } catch (error) {
      console.error('❌ 删除历史记录失败:', error);
    }
  }

  /**
   * 获取历史记录数量
   */
  getHistoryCount(): number {
    return this.getHistory().length;
  }

  /**
   * 检查是否有最新结果
   */
  hasLatestResult(): boolean {
    return localStorage.getItem(this.STORAGE_KEYS.LATEST_RESULT) !== null;
  }
}

// 导出单例实例
export const questionnaireStorageService = new QuestionnaireStorageService();