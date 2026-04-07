const { parseCsvBuffer } = require('../../../lib/csv');
const { parseForm, readUploadedFile } = require('../../../lib/upload');
const { query } = require('../../../lib/db');
const { validateMasterRow } = require('../../../lib/validators');

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { files } = await parseForm(req);
  const buffer = await readUploadedFile(files.file);
  const rows = parseCsvBuffer(buffer);

  let validRows = 0;
  const invalidRows = [];

  for (const [index, row] of rows.entries()) {
    const parsed = validateMasterRow(row);
    if (!parsed.valid) {
      invalidRows.push({ row: index + 1, reason: parsed.reason, loan_id: row.loan_id || null });
      continue;
    }

    const p = parsed.payload;
    await query(
      `INSERT INTO loans (loan_id, orig_balance, origination_date, fico, term, merchant_fee, recourse_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (loan_id) DO NOTHING`,
      [p.loan_id, p.orig_balance, p.origination_date, p.fico, p.term, p.merchant_fee, p.recourse_type]
    );
    validRows += 1;
  }

  return res.status(200).json({
    total_rows: rows.length,
    valid_rows: validRows,
    invalid_rows: invalidRows.length,
    invalid_details: invalidRows
  });
}
