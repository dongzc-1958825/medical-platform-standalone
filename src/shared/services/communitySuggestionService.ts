/**
 * 社区发展建议服务
 * 负责社区发展建议的存储和管理
 */

export interface CommunitySuggestion {
  id: string;
  diseaseId: string;
  diseaseName: string;
  title: string;
  content: string;
  author: string;
  publisherId: string;
  date: string;
  likes: number;
  likedBy: string[];
  comments: any[];
  isCollected: boolean;
}

class CommunitySuggestionService {
  private readonly STORAGE_KEY = 'community_suggestions';

  /**
   * 获取所有建议
   */
  getAllSuggestions(diseaseId?: string): CommunitySuggestion[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      const suggestions = saved ? JSON.parse(saved) : [];
      
      if (diseaseId) {
        return suggestions.filter((s: CommunitySuggestion) => s.diseaseId === diseaseId);
      }
      return suggestions;
    } catch (error) {
      console.error('加载建议失败:', error);
      return [];
    }
  }

  /**
   * 添加建议
   */
  addSuggestion(suggestion: Omit<CommunitySuggestion, 'id' | 'likes' | 'likedBy' | 'comments'>): CommunitySuggestion {
    try {
      const suggestions = this.getAllSuggestions();
      const newSuggestion: CommunitySuggestion = {
        ...suggestion,
        id: `suggestion_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        likes: 0,
        likedBy: [],
        comments: []
      };
      
      suggestions.push(newSuggestion);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(suggestions));
      
      return newSuggestion;
    } catch (error) {
      console.error('添加建议失败:', error);
      throw error;
    }
  }

  /**
   * 点赞建议
   */
  likeSuggestion(suggestionId: string, userId: string): boolean {
    try {
      const suggestions = this.getAllSuggestions();
      const index = suggestions.findIndex(s => s.id === suggestionId);
      
      if (index === -1) return false;
      
      const suggestion = suggestions[index];
      const hasLiked = suggestion.likedBy.includes(userId);
      
      if (hasLiked) {
        // 取消点赞
        suggestion.likes--;
        suggestion.likedBy = suggestion.likedBy.filter(id => id !== userId);
      } else {
        // 点赞
        suggestion.likes++;
        suggestion.likedBy.push(userId);
      }
      
      suggestions[index] = suggestion;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(suggestions));
      
      return true;
    } catch (error) {
      console.error('点赞失败:', error);
      return false;
    }
  }

  /**
   * 删除建议
   */
  deleteSuggestion(suggestionId: string, userId: string): boolean {
    try {
      const suggestions = this.getAllSuggestions();
      const suggestion = suggestions.find(s => s.id === suggestionId);
      
      if (!suggestion) return false;
      if (suggestion.publisherId !== userId) return false;
      
      const filtered = suggestions.filter(s => s.id !== suggestionId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      
      return true;
    } catch (error) {
      console.error('删除建议失败:', error);
      return false;
    }
  }

  /**
   * 获取建议统计
   */
  getSuggestionStats(diseaseId: string): { count: number; totalLikes: number } {
    const suggestions = this.getAllSuggestions(diseaseId);
    return {
      count: suggestions.length,
      totalLikes: suggestions.reduce((sum, s) => sum + s.likes, 0)
    };
  }
}

export const communitySuggestionService = new CommunitySuggestionService();