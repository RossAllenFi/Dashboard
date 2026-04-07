/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const loans = [];
const performance = [];
const payments = [];

const recourseTypes = [1, 2, 4];
const now = new Date('2026-04-01');

for (let i = 1; i <= 1000; i += 1) {
  const loanId = `LN-${String(i).padStart(6, '0')}`;
  const origBalance = 5000 + Math.floor(Math.random() * 45000);
  const fico = 580 + Math.floor(Math.random() * 220);
  const term = [12, 24, 36, 48][Math.floor(Math.random() * 4)];
  const merchantFee = 1 + Math.random() * 8;
  const recourseType = recourseTypes[Math.floor(Math.random() * recourseTypes.length)];
  const originationDate = new Date(now);
  originationDate.setDate(originationDate.getDate() - Math.floor(Math.random() * 720));

  loans.push({
    loan_id: loanId,
    orig_balance: origBalance.toFixed(2),
    origination_date: originationDate.toISOString().slice(0, 10),
    fico,
    term,
    merchant_fee: merchantFee.toFixed(2),
    recourse_type: recourseType
  });

  const paymentCount = Math.floor(Math.random() * 8);
  let paidPrincipal = 0;
  for (let p = 0; p < paymentCount; p += 1) {
    const principal = Math.min(origBalance * (0.03 + Math.random() * 0.08), origBalance - paidPrincipal);
    if (principal <= 0) break;
    const interest = principal * (0.01 + Math.random() * 0.03);
    const paymentAmount = principal + interest;
    paidPrincipal += principal;

    const paymentDate = new Date(originationDate);
    paymentDate.setMonth(paymentDate.getMonth() + p + 1);

    payments.push({
      loan_id: loanId,
      payment_date: paymentDate.toISOString().slice(0, 10),
      payment_amount: paymentAmount.toFixed(2),
      principal: principal.toFixed(2),
      interest: interest.toFixed(2)
    });
  }

  const balance = Math.max(origBalance - paidPrincipal, 0);
  const dpd = [0, 0, 0, 15, 32, 65, 95][Math.floor(Math.random() * 7)];
  performance.push({
    loan_id: loanId,
    report_date: now.toISOString().slice(0, 10),
    current_balance: balance.toFixed(2),
    days_past_due: dpd,
    status: dpd >= 60 ? 'Delinquent' : 'Current'
  });
}

function writeCsv(filename, rows) {
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(',')]
    .concat(rows.map((row) => headers.map((h) => row[h]).join(',')))
    .join('\n');
  fs.writeFileSync(path.join(outputDir, filename), csv);
}

writeCsv('master_loans.csv', loans);
writeCsv('performance_updates.csv', performance);
writeCsv('payments.csv', payments);

console.log('Generated sample CSV files in scripts/output');
