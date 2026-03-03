import { useEffect, useState } from "react";
import "./index.css";

const ACCOUNT_ID = 1;

export default function App() {
  const [balance, setBalance] = useState(0);
  const [activities, setActivities] = useState([]);
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    const es = new EventSource(`http://localhost:8080/api/v1/balances/stream/${ACCOUNT_ID}`);

    es.onopen = () => setStatus("open");
    
    es.addEventListener("balance-update", (e) => {
      const data = JSON.parse(e.data);
      setBalance(data.balance);
      if (data.ledger) {
        setActivities((prev) => [data.ledger, ...prev].slice(0, 5));
      }
    });

    es.onerror = () => {
      setStatus("closed");
      es.close();
    };

    return () => es.close();
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat("id-ID").format(val);

  return (
    <div className="dashboard-container">
      <div className="balance-card">
        <header>
          <span className="account-label">Account ID: {ACCOUNT_ID}</span>
          <div className={`status-badge ${status}`}>
            <span className="dot"></span> {status.toUpperCase()}
          </div>
        </header>

        <section className="main-balance">
          <h1><small>IDR</small> {formatCurrency(balance)}</h1>
          <p className="description">Available Balance</p>
        </section>

        <section className="activity-section">
          <h3>Recent Activities</h3>
          <div className="activity-list">
            {activities.length === 0 && <p className="empty">No recent transactions</p>}
            {activities.map((a) => (
              <div key={a.referenceId} className="activity-item">
                <div className="activity-info">
                  <span className="ref">REF: {a.referenceId}</span>
                  <span className="date">{new Date().toLocaleTimeString()}</span>
                </div>
                <span className={`amount ${a.amount > 0 ? "plus" : "minus"}`}>
                  {a.amount > 0 ? "+" : ""}{formatCurrency(a.amount)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}