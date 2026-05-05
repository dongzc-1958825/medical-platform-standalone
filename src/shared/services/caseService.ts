// src/shared/services/caseService.ts
import { MedicalCase, CaseComment, CaseFilter } from '../types/case';

// ✅ 确保使用与 MobileCasesPage.tsx 相同的键名
const STORAGE_KEY = 'medical_cases';  // 使用下划线
const COMMENTS_KEY = 'case_comments';

class CaseService {
  // 获取所有医案
  getCases(filter?: CaseFilter): MedicalCase[] {
    const cases = this.getAllCases();
    let filtered = [...cases];
    
    // 按时间倒序排序
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (filter) {
      if (filter.keyword) {
        const keyword = filter.keyword.toLowerCase();
        filtered = filtered.filter(c => 
          c.title.toLowerCase().includes(keyword) ||
          c.diagnosis.toLowerCase().includes(keyword) ||
          c.description?.toLowerCase().includes(keyword)
        );
      }
      if (filter.tags && filter.tags.length > 0) {
        filtered = filtered.filter(c => 
          filter.tags!.some(tag => c.tags.includes(tag))
        );
      }
    }
    
    return filtered;
  }

  // 获取单个医案
  getCaseById(id: string): MedicalCase | null {
    const cases = this.getAllCases();
    return cases.find(c => c.id === id) || null;
  }

  // 创建医案
  createCase(caseData: Omit<MedicalCase, 'id' | 'createdAt' | 'isFavorite'>): MedicalCase {
    const cases = this.getAllCases();
    const newCase: MedicalCase = {
      ...caseData,
      id: this.generateId(),
      createdAt: new Date().toISOString().split('T')[0],
      isFavorite: false,
      likeCount: 0,
      commentCount: 0,
      views: 0
    };
    
    cases.push(newCase);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    return newCase;
  }

  // 更新医案
  updateCase(id: string, updates: Partial<MedicalCase>): MedicalCase | null {
    const cases = this.getAllCases();
    const index = cases.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    cases[index] = { ...cases[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    return cases[index];
  }

  // 删除医案
  deleteCase(id: string): boolean {
    const cases = this.getAllCases();
    const filtered = cases.filter(c => c.id !== id);
    if (filtered.length === cases.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    // 同时删除相关评论
    this.deleteCommentsByCaseId(id);
    return true;
  }

  // 点赞/取消点赞
  toggleLike(id: string): MedicalCase | null {
    const cases = this.getAllCases();
    const index = cases.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    cases[index].likeCount = (cases[index].likeCount || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    return cases[index];
  }

  // 收藏/取消收藏
  toggleFavorite(id: string): MedicalCase | null {
    const cases = this.getAllCases();
    const index = cases.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    cases[index].isFavorite = !cases[index].isFavorite;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    return cases[index];
  }

  // 增加浏览次数
  incrementViews(id: string): void {
    const cases = this.getAllCases();
    const index = cases.findIndex(c => c.id === id);
    if (index === -1) return;
    
    cases[index].views = (cases[index].views || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  }

  // 获取评论
  getComments(caseId: string): CaseComment[] {
    const comments = this.getAllComments();
    return comments
      .filter(c => c.caseId === caseId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // 添加评论
  addComment(comment: Omit<CaseComment, 'id' | 'createdAt'>): CaseComment {
    const comments = this.getAllComments();
    const newComment: CaseComment = {
      ...comment,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      likes: 0
    };
    
    comments.push(newComment);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
    
    // 更新医案的评论数
    const case_ = this.getCaseById(comment.caseId);
    if (case_) {
      this.updateCase(comment.caseId, { 
        commentCount: (case_.commentCount || 0) + 1 
      });
    }
    
    return newComment;
  }

  // 删除评论
  deleteComment(id: string, caseId: string): boolean {
    const comments = this.getAllComments();
    const filtered = comments.filter(c => c.id !== id);
    if (filtered.length === comments.length) return false;
    
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(filtered));
    
    // 更新医案的评论数
    const case_ = this.getCaseById(caseId);
    if (case_) {
      this.updateCase(caseId, { 
        commentCount: Math.max(0, (case_.commentCount || 0) - 1)
      });
    }
    
    return true;
  }

  // 私有方法：获取所有医案
  private getAllCases(): MedicalCase[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // 私有方法：获取所有评论
  private getAllComments(): CaseComment[] {
    const stored = localStorage.getItem(COMMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // 私有方法：删除医案相关评论
  private deleteCommentsByCaseId(caseId: string): void {
    const comments = this.getAllComments();
    const filtered = comments.filter(c => c.caseId !== caseId);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(filtered));
  }

  // 私有方法：生成ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const caseService = new CaseService();