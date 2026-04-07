export default function PortfolioOverview({ metrics }) {
  return (
    <div className="grid">
      <div className="card"><h3>Total Balance</h3><div>${Number(metrics.total_portfolio_balance || 0).toLocaleString()}</div></div>
      <div className="card"><h3>Avg FICO</h3><div>{Math.round(Number(metrics.average_fico || 0))}</div></div>
      <div className="card"><h3>Total Loans</h3><div>{metrics.total_loans || 0}</div></div>
      <div className="card"><h3>Total Reserves</h3><div>${Number(metrics.total_reserves || 0).toLocaleString()}</div></div>
    </div>
  );
}
