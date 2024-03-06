import React, { useState, useEffect } from 'react';
import Link from './Link';
import httpClient from '../../httpClient';
import '../../index.css';
import './Banking.css';
import logo from '../../assets/logo.png';
import widgetSettingsLight from '../../assets/widget-settings-light.svg';
import Sidebar from '../Sidebar';
import API_URL from "../../constants";

// Custom hook for fetching data
function useFetchData(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await httpClient.get(url);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => { }; // Cleanup function if needed
  }, [url]);

  return { data, loading, error };
}

function getDataByID(id, data) {
  let found = data.find(data => data.id === id);
  if (found === undefined) {
    return ""
  } else {
    console.log(found)
    return found
  }
}



// InstitutionsWidget component
function InstitutionsDropdown({ institutions, selectedInstitution, setSelectedInstitution }) {
  const handleInstitutionChange = (event) => {
    setSelectedInstitution(event.target.value);
  };

  return (
    <div>
      <select value={selectedInstitution} onChange={handleInstitutionChange}>
        <option value="">Select an institution</option>
        {institutions.map(institution => (
          <option key={institution.id} value={institution.id}>{institution.name}</option>
        ))}
      </select>
    </div>
  );
}

// AccountsWidget component
function AccountsDropdown({ accounts, selectedAccount, setSelectedAccount }) {
  const handleAccountChange = (event) => {
    setSelectedAccount(event.target.value);
  };

  return (
    <div>
      <select value={selectedAccount} onChange={handleAccountChange}>
        <option value="">Select an account</option>
        {accounts.map(account => (
          <option key={account.id} value={account.id}>{account.name}</option>
        ))}
      </select>
    </div>
  );
}

// AccountsWidget component
function AccountsWidget({ data, loading, error, selectedAccount, setSelectedAccount, selectedInstitution, setSelectedInstitution }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { institutions, accounts } = data;

  // Filter accounts based on the selected institution
  const filteredAccounts = accounts.filter(account => account.plaid_institution_id === selectedInstitution);

  return (
    <>
      <div className="banking-widget widget-accent">
        <div className="widget-header">
          <h3>Accounts</h3>
          <div>
            <img src={widgetSettingsLight} />
          </div>
        </div>
        <div className="widget-content">
          <InstitutionsDropdown className="widget-dropdown"
            institutions={institutions}
            selectedInstitution={selectedInstitution}
            setSelectedInstitution={setSelectedInstitution}
          />
          <AccountsDropdown className="widget-dropdown"
            accounts={filteredAccounts}
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
          />
          <p>Balance: £{getDataByID(selectedAccount, accounts).current_balance}</p>
          <button className="btn-add-account" onClick={openModal}>Add Another Account</button>
          {isModalOpen && <Link onClose={closeModal} />}
        </div>
      </div>
    </>
  );
}


// Banking component
function Banking() {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('');

  // Fetch institutions and accounts data
  const institutionsFetchData = useFetchData(API_URL + 'accounts/get_institutions');
  const accountsFetchData = useFetchData(API_URL + 'accounts/get_accounts');

  useEffect(() => {
    document.title = "Banking | Cache";
  }, [])

  return (
    <div className='page'>
      <Sidebar />
      <div className='content'>
        <h1>Banking</h1>

        <AccountsWidget
          data={{ institutions: institutionsFetchData.data, accounts: accountsFetchData.data }}
          loading={institutionsFetchData.loading || accountsFetchData.loading}
          error={institutionsFetchData.error || accountsFetchData.error}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          selectedInstitution={selectedInstitution}
          setSelectedInstitution={setSelectedInstitution}
        />
      </div>
    </div>
  );
}

export default Banking;
