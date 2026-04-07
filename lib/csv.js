const { parse } = require('csv-parse/sync');

function parseCsvBuffer(buffer) {
  return parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
}

function normalizeHeader(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function normalizeRow(row) {
  return Object.entries(row).reduce((acc, [key, value]) => {
    acc[normalizeHeader(key)] = typeof value === 'string' ? value.trim() : value;
    return acc;
  }, {});
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toDateString(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

module.exports = {
  parseCsvBuffer,
  normalizeRow,
  toNumber,
  toDateString
};
