// src/shared/api/caseApi.ts
// @ts-ignore
import { api } from './baseApi';
import {
  MedicalCase,
  CreateCaseRequest,
  UpdateCaseRequest,
  CaseFilter,
  CaseListResponse,
  CaseComment,
  CreateCommentRequest,
  UserCollection,
} from '../types/medical';

export class CaseApiService {
  // 获取医案列表
  async getCaseList(params: CaseFilter): Promise<CaseListResponse> {
    return api.get<CaseListResponse>('/cases', params);
  }

  // 获取医案详情
  async getCaseDetail(id: string): Promise<MedicalCase> {
    return api.get<MedicalCase>(`/cases/${id}`);
  }

  // 创建医案
  async createCase(data: CreateCaseRequest): Promise<MedicalCase> {
    return api.post<MedicalCase>('/cases', data);
  }

  // 更新医案
  async updateCase(id: string, data: UpdateCaseRequest): Promise<MedicalCase> {
    return api.put<MedicalCase>(`/cases/${id}`, data);
  }

  // 删除医案
  async deleteCase(id: string): Promise<void> {
    return api.delete<void>(`/cases/${id}`);
  }

  // 点赞医案
  async likeCase(caseId: string): Promise<void> {
    return api.post<void>(`/cases/${caseId}/like`, {});
  }

  // 取消点赞
  async unlikeCase(caseId: string): Promise<void> {
    return api.delete<void>(`/cases/${caseId}/like`);
  }

  // 收藏医案
  async collectCase(caseId: string): Promise<void> {
    return api.post<void>(`/cases/${caseId}/collect`, {});
  }

  // 取消收藏
  async uncollectCase(caseId: string): Promise<void> {
    return api.delete<void>(`/cases/${caseId}/collect`);
  }

  // 获取医案评论
  async getCaseComments(caseId: string): Promise<CaseComment[]> {
    return api.get<CaseComment[]>(`/cases/${caseId}/comments`);
  }

  // 发表评论
  async createComment(data: CreateCommentRequest): Promise<CaseComment> {
    return api.post<CaseComment>('/comments', data);
  }

  // 获取用户收藏列表
  async getUserCollections(userId: string, params?: { page: number; limit: number }): Promise<UserCollection[]> {
    return api.get<UserCollection[]>(`/users/${userId}/collections`, params);
  }

  // 搜索医案
  async searchCases(keyword: string, params?: Partial<CaseFilter>): Promise<CaseListResponse> {
    return api.get<CaseListResponse>('/cases/search', {
      keyword,
      ...params,
    });
  }

  // 获取热门标签
  async getPopularTags(limit: number = 10): Promise<string[]> {
    return api.get<string[]>('/cases/tags/popular', { limit });
  }

  // 获取分类列表
  async getCategories(): Promise<{ value: string; label: string; count: number }[]> {
    return api.get('/cases/categories');
  }
}

// 导出单例实例
export const caseApi = new CaseApiService();