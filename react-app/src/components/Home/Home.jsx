import React, { useState, useEffect } from 'react';
import httpClient from '../../utils/httpClient';
import { BASE_API_URL } from '../../utils/constants';

function useFetchData(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await httpClient.post(url);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}

function Home() {
  const data = useFetchData(`${BASE_API_URL}/shift/all`);
  return (
    <div>
      <h1>Profile Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre> {/* Render the data as JSON */}
    </div>
  );
}

export default Home;

