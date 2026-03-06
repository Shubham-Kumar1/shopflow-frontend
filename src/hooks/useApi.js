'use client';

import { useState, useCallback } from 'react';

export function useApi() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      if (result.error) {
        setError(result.error);
        setData(null);
      } else {
        setData(result.data);
        setError(null);
      }
      return result;
    } catch (err) {
      setError(err.message);
      setData(null);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, error, loading, execute };
}
