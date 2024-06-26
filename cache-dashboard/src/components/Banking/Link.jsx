import React, { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import httpClient from '../../httpClient'; // Assuming your httpClient module is in the same directory
import './Link.css';
import API_URL from "../../constants";

const Link = ({ onClose }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const generateToken = async () => {
      try {
        const response = await httpClient.post(API_URL + '/plaid/create_link_token');
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.error('Error generating link token:', error);
      }
    };

    generateToken(); // Call the function when the component mounts
  }, []);

  const onSuccess = (public_token, metadata) => {
    httpClient
      .post(API_URL + '/plaid/exchange_public_token', { public_token })
      .then(response => {
        // Handle response ...
        setShowSuccessMessage(true); // Show success message
        setTimeout(() => {
          setShowSuccessMessage(false); // Hide success message after timeout
          onClose(); // Close the modal after success
        }, 2000); // Adjust timeout as needed
      })
      .catch(error => {
        console.error('Error setting access token:', error);
      });
  };

  const config = {
    token: linkToken,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
        <button className="link-btn" onClick={open} disabled={!ready}>
          Link account
        </button>
        {showSuccessMessage && <div className="success-message">Success!</div>}
      </div>
    </div>
  );
};

export default Link;
