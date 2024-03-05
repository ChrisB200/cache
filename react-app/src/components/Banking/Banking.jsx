import React, { useState, useEffect } from 'react';
import Link from './Link';
import httpClient from '../../httpClient';
import '../../index.css';
import './Link.css';

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

// InstitutionsWidget component
function InstitutionsDropdown({ institutions, selectedInstitution, setSelectedInstitution }) {
  const handleInstitutionChange = (event) => {
    setSelectedInstitution(event.target.value);
  };

  return (
    <div>
      <h3>Institutions</h3>
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
      <h3>Accounts</h3>
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
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { institutions, accounts } = data;

  // Filter accounts based on the selected institution
  const filteredAccounts = accounts.filter(account => account.plaid_institution_id === selectedInstitution);

  console.log(accounts)
  console.log(selectedInstitution)
  console.log(filteredAccounts)

  return (
    <>
      <InstitutionsDropdown
        institutions={institutions}
        selectedInstitution={selectedInstitution}
        setSelectedInstitution={setSelectedInstitution}
      />
      <AccountsDropdown
        accounts={filteredAccounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
      />
    </>
  );
}


// Banking component
function Banking() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('');

  // Fetch institutions and accounts data
  const institutionsFetchData = useFetchData('http://localhost:8000/api/accounts/get_institutions');
  const accountsFetchData = useFetchData('http://localhost:8000/api/accounts/get_accounts');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Banking Route</h1>
      <p>This is your banking route content.</p>

      <button onClick={openModal}>Add Account</button>
      {isModalOpen && <Link onClose={closeModal} />}

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
  );
}

export default Banking;
