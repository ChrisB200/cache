import React, { useState, useEffect } from 'react';
import httpClient from '../utils/httpClient';
import { BASE_API_URL } from '../utils/constants';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function useFetchData(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get(url);
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
  const data = useFetchData(`${BASE_API_URL}/profile`);
  const navigate = useNavigate();
  const change = () => {
    navigate("/work");
  }
  return (
    <div className="content">
      <Navbar></Navbar>
      <div>
        <h1>Profile Data</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre> {/* Render the data as JSON */}
      </div>
      <button onClick={change}>WORK</button>
    </div>
  );
}

export default Home;

