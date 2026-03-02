import Database from 'better-sqlite3';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const KIDS_DIR = join(DATA_DIR, 'kids');

// Ensure data directories exist
mkdirSync(KIDS_DIR, { recursive: true });

// === Admin Database ===

const adminDbPath = join(DATA_DIR, 'admin.db');
const adminDb = new Database(adminDbPath);
adminDb.pragma('journal_mode = WAL');

adminDb.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'kid',
    name TEXT NOT NULL,
    avatar_id TEXT NOT NULL DEFAULT 'wizard',
    parent_id INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (parent_id) REFERENCES accounts(id)
  );
`);

export function createAccount({ username, passwordHash, role, name, avatarId, parentId }) {
  const stmt = adminDb.prepare(
    `INSERT INTO accounts (username, password_hash, role, name, avatar_id, parent_id)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  const result = stmt.run(username, passwordHash, role, name, avatarId, parentId || null);
  return result.lastInsertRowid;
}

export function getAccountByUsername(username) {
  return adminDb.prepare('SELECT * FROM accounts WHERE username = ?').get(username);
}

export function getAccountById(id) {
  return adminDb.prepare('SELECT * FROM accounts WHERE id = ?').get(id);
}

export function getKidsByParentId(parentId) {
  return adminDb.prepare(
    'SELECT id, username, name, avatar_id, created_at FROM accounts WHERE parent_id = ?'
  ).all(parentId);
}

export function getAllKids() {
  return adminDb.prepare(
    "SELECT id, username, name, avatar_id, created_at FROM accounts WHERE role = 'kid'"
  ).all();
}

// === Per-Kid Databases ===

const kidDbCache = new Map();

function getKidDb(kidId) {
  if (kidDbCache.has(kidId)) return kidDbCache.get(kidId);

  const dbPath = join(KIDS_DIR, `kid_${kidId}.db`);
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  kidDbCache.set(kidId, db);
  return db;
}

export function getKidState(kidId) {
  const db = getKidDb(kidId);
  const rows = db.prepare('SELECT key, value FROM state').all();
  const state = {};
  for (const row of rows) {
    state[row.key] = JSON.parse(row.value);
  }
  return state;
}

export function setKidState(kidId, key, value) {
  const db = getKidDb(kidId);
  db.prepare(
    `INSERT INTO state (key, value, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  ).run(key, JSON.stringify(value));
}

export function setKidFullState(kidId, state) {
  const db = getKidDb(kidId);
  const stmt = db.prepare(
    `INSERT INTO state (key, value, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  );
  const transaction = db.transaction((entries) => {
    for (const [key, value] of entries) {
      stmt.run(key, JSON.stringify(value));
    }
  });
  transaction(Object.entries(state));
}

export function closeAll() {
  adminDb.close();
  for (const db of kidDbCache.values()) {
    db.close();
  }
}
