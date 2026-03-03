import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AccountList() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/accounts")
      .then((res) => res.json())
      .then((data) => setAccounts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="home-container">
      <header className="main-header">
        <h1>My Wallets</h1>
        <p>Select an account to monitor real-time activity</p>
      </header>

      <div className="account-grid">
        {accounts.map((acc) => (
          <Link to={`/account/${acc.id}`} key={acc.id} className="account-card">
            <div className="card-header">
              <span className="chip">Active</span>
              <h3>{acc.name}</h3>
            </div>
            <div className="card-body">
              <small>Available Balance</small>
              <h2 className="balance-text">
                IDR {new Intl.NumberFormat("id-ID").format(acc.balance)}
              </h2>
            </div>
            <div className="card-footer">
              <span>View Details</span>
              <span className="arrow">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}