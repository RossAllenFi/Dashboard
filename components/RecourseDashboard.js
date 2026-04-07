export default function RecourseDashboard({ recourse }) {
  return (
    <div className="card">
      <h2>Recourse Dashboard</h2>
      <p>Eligible: <strong>{recourse.total_loans_eligible_for_recourse || 0}</strong> | Triggered: <strong>{recourse.total_loans_triggered_for_recourse || 0}</strong></p>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Loan ID</th><th>Payments Made</th><th>Recourse Type</th><th>DPD</th><th>Eligible</th><th>Triggered</th>
            </tr>
          </thead>
          <tbody>
            {(recourse.loans || []).map((loan) => (
              <tr key={loan.loan_id}>
                <td>{loan.loan_id}</td>
                <td>{loan.payments_made}</td>
                <td>{loan.recourse_type}</td>
                <td>{loan.days_past_due}</td>
                <td>{loan.recourse_eligible ? 'Yes' : 'No'}</td>
                <td>{loan.recourse_triggered ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
