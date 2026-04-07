const { Pool } = require('pg');

const globalForPg = global;

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  if (!globalForPg.__pgPool) {
    globalForPg.__pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }

  return globalForPg.__pgPool;
}

async function query(text, params = []) {
  const pool = getPool();
  return pool.query(text, params);
}

module.exports = {
  query,
  getPool
};
