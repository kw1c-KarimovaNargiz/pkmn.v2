import { useContext, useState, useEffect } from 'react';
import useFetch from './useFetch'; // Adjust the path as necessary
import { useUser } from '../pages/UserContext';

const apiBaseUrl = 'http://127.0.0.1:8000/api/';

const useApi = (url, params, fetchImmediate = true, method = 'POST') => {
  const { authToken, userLoading } = useUser();
  const [fetchParams, setFetchParams] = useState(params);
  const [shouldFetch, setShouldFetch] = useState(fetchImmediate);

  const { data, loading, error } = useFetch(
    shouldFetch ? `${apiBaseUrl}${url}` : null,
    fetchParams,
    {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    method,
  );

  const triggerFetch = (newParams = {}, newMethod = method) => {
    setFetchParams(newParams);
    setShouldFetch(true);
  };

  useEffect(() => {
    if (fetchImmediate && !userLoading) {
      console.log(authToken);
      setShouldFetch(true);
    }
  }, [fetchImmediate, userLoading]);

  useEffect(() => {
    if (shouldFetch) {
      setShouldFetch(false); // Reset shouldFetch to prevent infinite loop
    }
  }, [shouldFetch]);

  return { data, loading, error, triggerFetch };
};

export default useApi;