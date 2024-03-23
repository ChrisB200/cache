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
function AccountsWidget({ data, loading, error, selectedAccount, setSelectedAccount, selectedInstitution, setSelectedInstitution, onSuccessLink }) {
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
          {isModalOpen && <Link onClose={closeModal} onSuccessLink={onSuccessLink} />}
        </div>
      </div>
    </>
  );
}

function InfoWidget({title, data, percentage, typeOfIncrease}) {
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

function TransactionsWidget({ transactions, loading, error }) {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className='widget transactions-widget'>
      <div className='widget-header'>
        <h3>Transactions History</h3>
        <div>
          <img src={widgetSettingsDark} />
        </div>
      </div>
      <div className='widget-content'>
        <ul className='transactions'>
          {transactions.map(transaction => (
            <li className="transaction" key={transaction.id}>
              <div>
              <p className='transaction-name'>{transaction.name}</p>
              <p className='transaction-date'>{transaction.date}</p>
              </div>
              <div>
                <p className='transaction-amount'>£{transaction.amount}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Banking component
function Banking() {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [linkSuccess, setLinkSuccess] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState(null);

  // Fetch institutions and accounts data
  let institutionsFetchData = useFetchData('http://localhost:8000/api/accounts/get_institutions');
  let accountsFetchData = useFetchData('http://localhost:8000/api/accounts/get_accounts');

   // Fetch transactions data
   useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const accountData = getDataByID(selectedAccount, accountsFetchData.data);
        if (accountData) {
          const response = await httpClient.get(`http://localhost:8000/api/accounts/get_transactions?account_id=${accountData.id}&startingAmount=0&amount=25`);
          setTransactions(response.data);
        }
        setTransactionsLoading(false);
      } catch (error) {
        setTransactionsError(error);
        setTransactionsLoading(false);
      }
    };

    if (selectedAccount) {
      fetchTransactions();
    }
  }, [selectedAccount]);
  
  useEffect(() => {
    document.title = "Banking | Cache";
  }, []);

  // Function to trigger re-fetch after successful link
  const onSuccessLink = () => {
    setLinkSuccess(true);
  };

  useEffect(() => {
    if (linkSuccess) {
      // Refetch institutions and accounts data
      institutionsFetchData.refetch();
      accountsFetchData.refetch();
    }
  }, [linkSuccess]);

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
            onSuccessLink={onSuccessLink} // Pass the callback function
          />
          <InfoWidget
            title="Balance"
            data={getBalance(getDataByID(selectedAccount, accountsFetchData.data))}
            percentage={20}
            typeOfIncrease={true}
          />
           <TransactionsWidget
            transactions={transactions}
            loading={transactionsLoading}
            error={transactionsError}
          />
          
        </div>
      </div>
    </div>
  );
}

export default Banking;
