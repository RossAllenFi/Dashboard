# Ross Allen Financial Loan Intelligence Dashboard

Production-grade Next.js + PostgreSQL ingestion and analytics system for lender operations.

## Features
- CSV ingestion for master loans, performance updates, and payment history.
- Relational model linked by `loan_id`.
- Time-series performance snapshots (`loan_performance`) with latest-state queries.
- Recourse eligibility and trigger tracking (`loan_recourse_tracking`).
- Real API-backed dashboard (no mock data).

## Stack
- Next.js (frontend + API routes)
- PostgreSQL / Supabase-compatible
- `csv-parse` for CSV parsing
- Vercel-compatible serverless routes

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure env:
   ```bash
   cp .env.example .env.local
   ```
3. Create tables in your database:
   ```bash
   psql "$DATABASE_URL" -f models/schema.sql
   ```
4. Start app:
   ```bash
   npm run dev
   ```

## Sample Data Generator
Generate realistic CSV test files:
```bash
npm run db:seed
```
Files are produced in `scripts/output/`:
- `master_loans.csv`
- `performance_updates.csv`
- `payments.csv`

## API Endpoints
- `POST /api/upload/master`
- `POST /api/upload/performance`
- `POST /api/upload/payments`
- `GET /api/metrics`
- `GET /api/recourse`
- `GET /api/loans`
