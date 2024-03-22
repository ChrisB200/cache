import React, { useState, useEffect } from 'react';
import Link from './Link';
import httpClient from '../../httpClient';
import '../../index.css';
import './Banking.css';
import logo from '../../assets/logo.png';
import widgetSettingsLight from '../../assets/widget-settings-light.svg';
import widgetSettingsDark from '../../assets/widget-settings-dark.svg';
import Sidebar from '../Sidebar';
import up_arrow from '../../assets/uparrow.svg'
import down_arrow from '../../assets/downarrow.svg'

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
    return found
  }
}

function getBalance(account) {
  if (account && account.most_recent_balance && account.most_recent_balance.current_balance !== undefined) {
    return account.most_recent_balance.current_balance;
  } else {
    return 0;
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
  console.log(accounts)
  // Filter accounts based on the selected institution
  const filteredAccounts = accounts.filter(account => account.plaid_institution_id === selectedInstitution);

  return (
    <>
      <div className="widget banking-widget widget-accent">
        <div className="widget-header">
          <h3>Accounts</h3>
          <div>
            <img src={widgetSettingsLight} />
          </div>
        </div>
        <div className="banking-widget widget-content">
          <InstitutionsDropdown className="banking-widget widget-dropdown"
            institutions={institutions}
            selectedInstitution={selectedInstitution}
            setSelectedInstitution={setSelectedInstitution}
          />
          <AccountsDropdown className="banking-widget widget-dropdown"
            accounts={filteredAccounts}
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
          />
          <button className="banking-widget btn-add-account" onClick={openModal}>Add Another Account</button>
          {isModalOpen && <Link onClose={closeModal} />}
        </div>
      </div>
    </>
  );
}

function ImprovementWidget({title, data, percentage, typeOfIncrease}) {
  let arrow = up_arrow;
  let prefix = "+";
  if (!typeOfIncrease) {
    arrow = down_arrow;
    prefix = "-";
  }

  return (
    <>
      <div className='widget info-widget widget-primary'>
        <div className='info-widget widget-header'>
          <h3>{title}</h3>
          <div>
            <img src={widgetSettingsDark}/>
          </div>
        </div>
        <div className='info-widget widget-content'>
          <p>£{data}</p>
        </div>
        <div className='info-widget widget-footer'>
          <img className="info-widget widget-arrow" src={arrow}/>
          <p>{prefix}{percentage}%</p>
        </div>
      </div>
    </>
  );
}

function Banking() {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('');

  // Fetch institutions and accounts data
  const institutionsFetchData = useFetchData('http://localhost:8000/api/accounts/get_institutions');
  const accountsFetchData = useFetchData('http://localhost:8000/api/accounts/get_accounts');

  useEffect(() => {
    document.title = "Banking | Cache";
  }, []);

  return (
    <div className='page'>
      <Sidebar />
      <div className='content'>
        <h1>Banking</h1>
        <div className="widgets">
        <AccountsWidget
          data={{ institutions: institutionsFetchData.data, accounts: accountsFetchData.data }}
          loading={institutionsFetchData.loading || accountsFetchData.loading}
          error={institutionsFetchData.error || accountsFetchData.error}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          selectedInstitution={selectedInstitution}
          setSelectedInstitution={setSelectedInstitution}
        />

        <ImprovementWidget
          title="Balance"
          data={getBalance(getDataByID(selectedAccount, accountsFetchData.data))}
          percentage={20}
          typeOfIncrease={true}
        />
        </div>
      </div>
    </div>
  );
}


export default Banking;
