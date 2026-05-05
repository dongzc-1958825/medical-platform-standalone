import { useState, useCallback, useEffect } from 'react';
import { MedicalCase, CaseFilter, CaseListResponse } from '../types/medical';
import { caseApi } from '../api/caseApi';

export function useMedicalCases() {
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = useCallback(async (filter: CaseFilter = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: CaseListResponse = await caseApi.getCaseList(filter);
      setCases(response.cases);
    } catch (err) {
      setError('加载医案列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const likeCase = useCallback(async (caseId: string) => {
    setCases(prev => prev.map(caseItem => 
      caseItem.id === caseId 
        ? { 
            ...caseItem, 
            likeCount: caseItem.likeCount + 1,
            isLiked: true 
          }
        : caseItem
    ));
    
    try {
      await caseApi.likeCase(caseId);
    } catch (err) {
      console.error('点赞失败:', err);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  return {
    cases,
    loading,
    error,
    fetchCases,
    likeCase,
    refresh: fetchCases,
  };
}
