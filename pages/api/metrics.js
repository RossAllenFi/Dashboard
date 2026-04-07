const { query } = require('../../lib/db');
const { refreshRecourseTracking } = require('../../lib/recourse');

function toNum(val) {
  if (val === null || val === undefined) return 0;
  return Number(val);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  await refreshRecourseTracking();

  const portfolio = await query(
    `SELECT
      COUNT(*)::INTEGER AS total_loans,
      COALESCE(SUM(lp.current_balance), 0) AS total_portfolio_balance,
      COALESCE(AVG(l.fico), 0) AS average_fico,
      COALESCE(SUM(l.orig_balance * (l.merchant_fee / 100.0)), 0) AS total_reserves
    FROM loans l
    LEFT JOIN latest_loan_performance lp ON lp.loan_id = l.loan_id`
  );

  const delinquency = await query(
    `SELECT
      COUNT(*) FILTER (WHERE COALESCE(lp.days_past_due, 0) = 0)::INTEGER AS current,
      COUNT(*) FILTER (WHERE COALESCE(lp.days_past_due, 0) BETWEEN 1 AND 29)::INTEGER AS bucket_1_29,
      COUNT(*) FILTER (WHERE COALESCE(lp.days_past_due, 0) BETWEEN 30 AND 59)::INTEGER AS bucket_30_59,
      COUNT(*) FILTER (WHERE COALESCE(lp.days_past_due, 0) BETWEEN 60 AND 89)::INTEGER AS bucket_60_89,
      COUNT(*) FILTER (WHERE COALESCE(lp.days_past_due, 0) >= 90)::INTEGER AS bucket_90_plus
    FROM loans l
    LEFT JOIN latest_loan_performance lp ON lp.loan_id = l.loan_id`
  );

  const recourse = await query(
    `SELECT
      COUNT(*) FILTER (WHERE recourse_eligible)::INTEGER AS eligible_count,
      COUNT(*) FILTER (WHERE recourse_triggered)::INTEGER AS triggered_count
    FROM loan_recourse_tracking`
  );

  res.status(200).json({
    total_portfolio_balance: toNum(portfolio.rows[0].total_portfolio_balance),
    average_fico: toNum(portfolio.rows[0].average_fico),
    total_loans: toNum(portfolio.rows[0].total_loans),
    delinquency_buckets: delinquency.rows[0],
    total_reserves: toNum(portfolio.rows[0].total_reserves),
    recourse_stats: recourse.rows[0]
  });
}
