const { parseCsvBuffer } = require('../../../lib/csv');
const { parseForm, readUploadedFile } = require('../../../lib/upload');
const { query } = require('../../../lib/db');
const { validatePerformanceRow } = require('../../../lib/validators');
const { refreshRecourseTracking } = require('../../../lib/recourse');

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { files } = await parseForm(req);
  const buffer = await readUploadedFile(files.file);
  const rows = parseCsvBuffer(buffer);

  const loansResult = await query('SELECT loan_id FROM loans');
  const knownLoans = new Set(loansResult.rows.map((r) => r.loan_id));

  const invalidRows = [];
  const orphanLoanIds = new Set();
  const touchedLoans = new Set();
  let validRows = 0;

  for (const [index, row] of rows.entries()) {
    const parsed = validatePerformanceRow(row);
    if (!parsed.valid) {
      invalidRows.push({ row: index + 1, reason: parsed.reason, loan_id: row.loan_id || null });
      continue;
    }

    const p = parsed.payload;
    if (!knownLoans.has(p.loan_id)) {
      orphanLoanIds.add(p.loan_id);
      continue;
    }

    await query(
      `INSERT INTO loan_performance (loan_id, report_date, current_balance, days_past_due, status)
       VALUES ($1,$2,$3,$4,$5)`,
      [p.loan_id, p.report_date, p.current_balance, p.days_past_due, p.status]
    );
    touchedLoans.add(p.loan_id);
    validRows += 1;
  }

  if (touchedLoans.size > 0) {
    await refreshRecourseTracking(Array.from(touchedLoans));
  }

  return res.status(200).json({
    total_rows: rows.length,
    valid_rows: validRows,
    invalid_rows: invalidRows.length,
    invalid_details: invalidRows,
    orphan_loan_ids: Array.from(orphanLoanIds)
  });
}
