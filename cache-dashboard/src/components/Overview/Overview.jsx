import React, { useState, useEffect } from 'react';
import httpClient from '../../httpClient';
import { usePlaidLink } from 'react-plaid-link';

// APP COMPONENT
// Upon rendering of App component, make a request to create and
// obtain a link token to be used in the Link component

const Overview = () => {
  const [linkToken, setLinkToken] = useState(null);

  const generateToken = async () => {
    try {
      const response = await httpClient.post('http://localhost:8000/api/plaid/create_link_token'); // Use Axios instead of fetch
      setLinkToken(response.data.link_token);
    } catch (error) {
      console.error('Error generating link token:', error);
    }
  };

  useEffect(() => {
    generateToken();
  }, []);

  return linkToken != null ? <Link linkToken={linkToken} /> : <></>;
};

// LINK COMPONENT
// Use Plaid Link and pass link token and onSuccess function
// in configuration to initialize Plaid Link

const Link = (props) => {
  const onSuccess = React.useCallback((public_token, metadata) => {
    // send public_token to server using Axios
    httpClient.post('http://localhost:8000/api/plaid/exchange_public_token', { public_token })
      .then(response => {
        httpClient.get("http://localhost:8000/api/plaid/get_accounts_test")
          .then(test => {
            console.log(test)
          })
      })
      .catch(error => {
        console.error('Error setting access token:', error);
      });
  }, []);

  const config = {
    token: props.linkToken,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button onClick={() => open()} disabled={!ready}>
      Link account
    </button>
  );
};

export default Overview;
