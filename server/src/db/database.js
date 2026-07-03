/**
 * Minimal JSON-file-backed data store. No native dependencies, so it
 * installs and runs anywhere Node.js runs (Render, Railway, Vercel
 * serverless functions with a writable /tmp, your own VPS, etc.)
 *
 * This is intentionally simple for an MVP/demo. For production scale with
 * multiple users and real money flowing through the platform, swap this
 * for Postgres/MySQL (see DEPLOYMENT.md for migration notes) - a flat file
 * is not safe for concurrent writes at scale and will NOT persist on most
 * serverless platforms between deploys/cold starts.
 */

const fs = require('fs');
const path = require('path');
const env = require('../config/env');

const DATA_FILE = path.resolve(process.cwd(), env.dbPath.replace(/\.db$/, '.json'));

function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(
        { users: [], brokerSessions: [], tradeLogs: [], backtestRuns: [], _seq: {} },
        null,
        2
      )
    );
  }
}

function readAll() {
  ensureFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw || '{}');
}

function writeAll(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function nextId(data, collection) {
  data._seq = data._seq || {};
  data._seq[collection] = (data._seq[collection] || 0) + 1;
  return data._seq[collection];
}

function makeCollection(name) {
  return {
    insert(record) {
      const data = readAll();
      const id = nextId(data, name);
      const row = { id, created_at: new Date().toISOString(), ...record };
      data[name].push(row);
      writeAll(data);
      return row;
    },
    findOne(predicate) {
      const data = readAll();
      return data[name].find(predicate) || null;
    },
    find(predicate = () => true) {
      const data = readAll();
      return data[name].filter(predicate);
    },
    all() {
      return readAll()[name];
    },
  };
}

module.exports = {
  users: makeCollection('users'),
  brokerSessions: makeCollection('brokerSessions'),
  tradeLogs: makeCollection('tradeLogs'),
  backtestRuns: makeCollection('backtestRuns'),
};
