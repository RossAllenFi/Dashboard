export default function LoanTable({ loans }) {
  return (
    <div className="card">
      <h2>Loan Table</h2>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Loan ID</th><th>Orig Balance</th><th>Current Balance</th><th>FICO</th><th>Term</th><th>DPD</th><th>Status</th><th>Payments</th><th>Recourse</th>
            </tr>
          </thead>
          <tbody>
            {(loans || []).map((loan) => (
              <tr key={loan.loan_id}>
                <td>{loan.loan_id}</td>
                <td>{Number(loan.orig_balance || 0).toLocaleString()}</td>
                <td>{Number(loan.current_balance || 0).toLocaleString()}</td>
                <td>{loan.fico}</td>
                <td>{loan.term}</td>
                <td>{loan.days_past_due || 0}</td>
                <td>{loan.status || '-'}</td>
                <td>{loan.payments_made || 0}</td>
                <td>{loan.recourse_eligible ? 'Eligible' : 'Not Eligible'} / {loan.recourse_triggered ? 'Triggered' : 'Not Triggered'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
