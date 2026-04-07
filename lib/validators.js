const { normalizeRow, toDateString, toNumber } = require('./csv');

function validateMasterRow(raw) {
  const row = normalizeRow(raw);
  if (!row.loan_id) return { valid: false, reason: 'Missing loan_id' };

  const payload = {
    loan_id: String(row.loan_id),
    orig_balance: toNumber(row.orig_balance),
    origination_date: toDateString(row.origination_date),
    fico: toNumber(row.fico),
    term: toNumber(row.term),
    merchant_fee: toNumber(row.merchant_fee),
    recourse_type: toNumber(row.recourse_type)
  };

  if (payload.orig_balance === null || payload.origination_date === null || payload.recourse_type === null) {
    return { valid: false, reason: 'Missing required numeric/date fields' };
  }

  return { valid: true, payload };
}

function validatePerformanceRow(raw) {
  const row = normalizeRow(raw);
  if (!row.loan_id) return { valid: false, reason: 'Missing loan_id' };

  const payload = {
    loan_id: String(row.loan_id),
    report_date: toDateString(row.report_date),
    current_balance: toNumber(row.current_balance),
    days_past_due: toNumber(row.days_past_due) ?? 0,
    status: row.status || null
  };

  if (payload.report_date === null || payload.current_balance === null) {
    return { valid: false, reason: 'Invalid report_date or current_balance' };
  }

  return { valid: true, payload };
}

function validatePaymentRow(raw) {
  const row = normalizeRow(raw);
  if (!row.loan_id) return { valid: false, reason: 'Missing loan_id' };

  const payload = {
    loan_id: String(row.loan_id),
    payment_date: toDateString(row.payment_date),
    payment_amount: toNumber(row.payment_amount),
    principal: toNumber(row.principal),
    interest: toNumber(row.interest)
  };

  if (payload.payment_date === null || payload.payment_amount === null || payload.principal === null || payload.interest === null) {
    return { valid: false, reason: 'Invalid payment fields' };
  }

  if (Math.abs(payload.payment_amount - (payload.principal + payload.interest)) > 0.01) {
    return { valid: false, reason: 'payment_amount must equal principal + interest' };
  }

  return { valid: true, payload };
}

module.exports = {
  validateMasterRow,
  validatePerformanceRow,
  validatePaymentRow
};
