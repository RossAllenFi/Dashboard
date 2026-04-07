const { query } = require('../../lib/db');
const { refreshRecourseTracking } = require('../../lib/recourse');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  await refreshRecourseTracking();

  const result = await query(
    `SELECT
      l.loan_id,
      l.orig_balance,
      l.fico,
      l.term,
      l.recourse_type,
      lp.report_date,
      lp.current_balance,
      COALESCE(lp.days_past_due, 0) AS days_past_due,
      lp.status,
      rt.payments_made,
      rt.recourse_eligible,
      rt.recourse_triggered
    FROM loans l
    LEFT JOIN latest_loan_performance lp ON lp.loan_id = l.loan_id
    LEFT JOIN loan_recourse_tracking rt ON rt.loan_id = l.loan_id
    ORDER BY l.loan_id`
  );

  res.status(200).json({ loans: result.rows });
}
