CREATE TABLE IF NOT EXISTS loans (
  loan_id TEXT PRIMARY KEY,
  orig_balance NUMERIC(14, 2) NOT NULL,
  origination_date DATE NOT NULL,
  fico INTEGER,
  term INTEGER,
  merchant_fee NUMERIC(10, 2),
  recourse_type INTEGER NOT NULL CHECK (recourse_type > 0)
);

CREATE TABLE IF NOT EXISTS loan_performance (
  id BIGSERIAL PRIMARY KEY,
  loan_id TEXT NOT NULL REFERENCES loans(loan_id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  current_balance NUMERIC(14, 2) NOT NULL,
  days_past_due INTEGER NOT NULL DEFAULT 0,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loan_performance_loan_date ON loan_performance (loan_id, report_date DESC);

CREATE TABLE IF NOT EXISTS loan_payments (
  id BIGSERIAL PRIMARY KEY,
  loan_id TEXT NOT NULL REFERENCES loans(loan_id) ON DELETE CASCADE,
  payment_date DATE NOT NULL,
  payment_amount NUMERIC(14, 2) NOT NULL,
  principal NUMERIC(14, 2) NOT NULL,
  interest NUMERIC(14, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loan_payments_loan_date ON loan_payments (loan_id, payment_date DESC);

CREATE TABLE IF NOT EXISTS loan_recourse_tracking (
  loan_id TEXT PRIMARY KEY REFERENCES loans(loan_id) ON DELETE CASCADE,
  recourse_type INTEGER NOT NULL,
  payments_made INTEGER NOT NULL DEFAULT 0,
  recourse_eligible BOOLEAN NOT NULL DEFAULT FALSE,
  recourse_triggered BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE VIEW latest_loan_performance AS
SELECT DISTINCT ON (loan_id)
  loan_id,
  report_date,
  current_balance,
  days_past_due,
  status
FROM loan_performance
ORDER BY loan_id, report_date DESC, id DESC;
