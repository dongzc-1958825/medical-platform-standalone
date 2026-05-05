import { useState, useCallback } from 'react';

export function useApiCall<T, Args extends any[] = []>(
  apiFunction: (...args: Args) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: Args): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : '请求失败';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return {
    data,
    loading,
    error,
    execute,
    setData,
  };
}
