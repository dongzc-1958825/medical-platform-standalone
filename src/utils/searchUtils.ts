// src/utils/searchUtils.ts
export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
};

export const getSearchSuggestions = (cases: any[], searchTerm: string): string[] => {
  const suggestions = new Set<string>();
  
  if (!searchTerm || searchTerm.length < 2) return [];
  
  cases.forEach(caseItem => {
    // 标题建议
    if (caseItem.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      suggestions.add(caseItem.title);
    }
    
    // 诊断建议
    if (caseItem.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())) {
      suggestions.add(caseItem.diagnosis);
    }
    
    // 症状建议
    caseItem.symptoms?.forEach((symptom: string) => {
      if (symptom.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.add(symptom);
      }
    });
    
    // 标签建议
    caseItem.tags?.forEach((tag: string) => {
      if (tag.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.add(tag);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, 5);
};