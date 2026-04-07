const { query } = require('./db');

async function refreshRecourseTracking(loanIds = []) {
  const filterClause = loanIds.length ? 'WHERE l.loan_id = ANY($1)' : '';
  const params = loanIds.length ? [loanIds] : [];

  await query(
    `
    INSERT INTO loan_recourse_tracking (loan_id, recourse_type, payments_made, recourse_eligible, recourse_triggered, updated_at)
    SELECT
      l.loan_id,
      l.recourse_type,
      COALESCE(p.payments_made, 0) AS payments_made,
      COALESCE(p.payments_made, 0) >= l.recourse_type AS recourse_eligible,
      (COALESCE(p.payments_made, 0) >= l.recourse_type AND COALESCE(lp.days_past_due, 0) >= 60) AS recourse_triggered,
      NOW()
    FROM loans l
    LEFT JOIN (
      SELECT loan_id, COUNT(*)::INTEGER AS payments_made
      FROM loan_payments
      GROUP BY loan_id
    ) p ON p.loan_id = l.loan_id
    LEFT JOIN latest_loan_performance lp ON lp.loan_id = l.loan_id
    ${filterClause}
    ON CONFLICT (loan_id)
    DO UPDATE SET
      recourse_type = EXCLUDED.recourse_type,
      payments_made = EXCLUDED.payments_made,
      recourse_eligible = EXCLUDED.recourse_eligible,
      recourse_triggered = EXCLUDED.recourse_triggered,
      updated_at = NOW();
  `,
    params
  );
}

module.exports = {
  refreshRecourseTracking
};
