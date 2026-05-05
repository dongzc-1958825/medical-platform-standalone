// src/shared/utils/storage.ts
const STORAGE_PREFIX = 'medical_platform_';

export class StorageService {
  private prefix: string;

  constructor(customPrefix?: string) {
    this.prefix = customPrefix || STORAGE_PREFIX;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.getKey(key), serialized);
    } catch (error) {
      console.error('存储失败:', error);
    }
  }

  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('读取存储失败:', error);
      return defaultValue || null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  clear(): void {
    // 只清除应用相关的存储
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  // 用户相关存储
  setUser(user: any): void {
    this.set('user', user);
  }

  getUser(): any | null {
    return this.get('user');
  }

  clearUser(): void {
    this.remove('user');
  }

  // 医案草稿
  setCaseDraft(draft: any): void {
    this.set('case_draft', draft);
  }

  getCaseDraft(): any | null {
    return this.get('case_draft');
  }

  clearCaseDraft(): void {
    this.remove('case_draft');
  }

  // 搜索历史
  addSearchHistory(query: string, maxItems: number = 10): void {
    const history = this.getSearchHistory();
    const newHistory = [query, ...history.filter(item => item !== query)].slice(0, maxItems);
    this.set('search_history', newHistory);
  }

  getSearchHistory(): string[] {
    return this.get('search_history', []);
  }

  clearSearchHistory(): void {
    this.remove('search_history');
  }
}

// 导出单例
export const storage = new StorageService();