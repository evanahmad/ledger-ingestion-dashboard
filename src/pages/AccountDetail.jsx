import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./AccountDetail.css";

export default function AccountDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [updateType, setUpdateType] = useState("latest");

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/balances/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setTimeout(() => {
        setData(json);
        setUpdateType("latest");
      }, 300); 
    });

    const es = new EventSource(`http://localhost:8080/api/v1/balances/stream/${id}`);
    
    es.addEventListener("balance-update", (e) => {
      const update = JSON.parse(e.data);
      setData(update);
      setUpdateType("realtime");
    });

    return () => es.close();
  }, [id]);

  if (!data) return <div className="loading">Mempersiapkan rincian akun...</div>;

  const formatIDR = (val) => new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(val || 0);

  const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  return (
    <div className="detail-page-wrapper">
      <nav className="detail-nav">
        <Link to="/" className="btn-back">← Dashboard</Link>
      </nav>

      <div className="grid-container">
        <aside className="info-card-blue">
          <div className="info-group">
            <div className="label-row">
              <label>Account Holder</label>
              <div className={`status-chip ${updateType}`}>
                <span className="dot"></span>
                {updateType === "realtime" ? "REAL-TIME" : "LATEST"}
              </div>
            </div>
            <h3>{data.accountName}</h3>
          </div>

          <div className="info-group">
            <label>Available Balance</label>
            <h2 className="balance-text">{formatIDR(data.balance)}</h2>
          </div>

          <div className="info-group footer">
            <small>Account ID: {data.accountId}</small>
          </div>
        </aside>

        <main className="table-section">
          <div className="table-header">
            <h3>Riwayat Transaksi Terakhir</h3>
          </div>
          <div className="table-responsive">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Tipe Transaksi</th>
                  <th>Balance</th>
                  <th>Nomor Referensi</th>
                  <th>Waktu Transaksi</th>
                </tr>
              </thead>
              <tbody>
                {data.recentLedgers?.map((log) => (
                  <tr key={log.referenceId} className="table-row">
                    <td>
                      <span className="type-label">
                        {log.amount > 0 ? "Transfer Masuk" : "Transfer Keluar"}
                      </span>
                    </td>
                    <td className={log.amount > 0 ? "amount-green" : "amount-red"}>
                      {formatIDR(Math.abs(log.amount))} {log.amount > 0 ? "(+)" : "(-)"}
                    </td>
                    <td className="ref-id">{log.referenceId}</td>
                    <td className="date-cell">{formatDateTime(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}