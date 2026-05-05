// src/services/searchService.ts
export interface SearchFilters {
  searchTerm: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  diagnosis?: string[];
}

export class CaseSearchService {
  static searchCases(cases: any[], filters: SearchFilters): any[] {
    let results = cases;

    // 文本搜索
    if (filters.searchTerm) {
      results = results.filter(caseItem =>
        this.matchesSearchTerm(caseItem, filters.searchTerm)
      );
    }

    // 日期范围筛选
    if (filters.dateRange) {
      results = results.filter(caseItem =>
        this.isInDateRange(caseItem.createdAt, filters.dateRange!)
      );
    }

    // 标签筛选
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(caseItem =>
        this.hasMatchingTags(caseItem.tags, filters.tags!)
      );
    }

    // 诊断筛选
    if (filters.diagnosis && filters.diagnosis.length > 0) {
      results = results.filter(caseItem =>
        filters.diagnosis!.includes(caseItem.diagnosis)
      );
    }

    return results;
  }

  private static matchesSearchTerm(caseItem: any, searchTerm: string): boolean {
    const term = searchTerm.toLowerCase();
    return (
      caseItem.title.toLowerCase().includes(term) ||
      caseItem.patientName.toLowerCase().includes(term) ||
      caseItem.diagnosis.toLowerCase().includes(term) ||
      caseItem.symptoms?.some((symptom: string) => 
        symptom.toLowerCase().includes(term)
      ) ||
      caseItem.tags?.some((tag: string) => 
        tag.toLowerCase().includes(term)
      ) ||
      caseItem.notes?.toLowerCase().includes(term)
    );
  }

  private static isInDateRange(date: string, dateRange: { start: string; end: string }): boolean {
    const caseDate = new Date(date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    return caseDate >= startDate && caseDate <= endDate;
  }

  private static hasMatchingTags(itemTags: string[], filterTags: string[]): boolean {
    return filterTags.some(tag => 
      itemTags.some(itemTag => 
        itemTag.toLowerCase() === tag.toLowerCase()
      )
    );
  }
}