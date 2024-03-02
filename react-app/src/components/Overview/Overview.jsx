import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Assuming you have a token stored in localStorage or somewhere else
const token = localStorage.getItem('user');

// Create a new instance of Axios with default headers
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // Your API base URL
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Include the token in the 'Authorization' header
  }
});

function Overview() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data using the token
    const token = localStorage.getItem("user");
    fetchUserData(token);
  }, []);

  const fetchUserData = (token) => {
    axiosInstance.get("/user/data")
      .then(response => {
        setUserData(response.data);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setLoading(false); // Set loading to false if there's an error
      });
  }

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
