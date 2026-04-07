const { query } = require('../../lib/db');
const { refreshRecourseTracking } = require('../../lib/recourse');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  await refreshRecourseTracking();

  const rows = await query(
    `SELECT rt.loan_id, rt.payments_made, rt.recourse_type, rt.recourse_eligible, rt.recourse_triggered,
            COALESCE(lp.days_past_due, 0) AS days_past_due
     FROM loan_recourse_tracking rt
     LEFT JOIN latest_loan_performance lp ON lp.loan_id = rt.loan_id
     ORDER BY rt.loan_id`
  );

  const eligibleCount = rows.rows.filter((r) => r.recourse_eligible).length;
  const triggeredCount = rows.rows.filter((r) => r.recourse_triggered).length;

  res.status(200).json({
    total_loans_eligible_for_recourse: eligibleCount,
    total_loans_triggered_for_recourse: triggeredCount,
    loans: rows.rows
  });
}
