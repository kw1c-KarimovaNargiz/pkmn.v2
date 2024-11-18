import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url, params, headers, method = 'GET') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    console.log('Fetching data from:', url, 'with params:', params, 'and headers:', headers, 'using method:', method);
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        if (method === 'GET') {
          response = await axios.get(url, {
            params: params,
            headers: {
              ...headers,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
        } else if (method === 'POST') {
          response = await axios.post(url, params, {
            headers: {
              ...headers,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
        }
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, JSON.stringify(params), JSON.stringify(headers), method]);
  return { data, loading, error };
};

export default useFetch;