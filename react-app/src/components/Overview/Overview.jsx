import React, { useState, useEffect } from 'react';
import httpClient from '../../httpClient';

function Overview() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('user');
        const response = await httpClient.get('http://localhost:8000/api/user/data', {
          headers: {
            "Content-Type": 'application/json',
          }
        });
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h2>Overview</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        userData && (
          <div>
            <p>Username: {userData.name}</p>
            <p>Email: {userData.email}</p>
          </div>
        )
      )}
    </div>
  );
}

export default Overview;
