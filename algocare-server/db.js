import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const DB_PATH = path.join(__dirname, 'routine.db')

export const db = new DatabaseSync(DB_PATH)

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS routine (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    added_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS intake (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    routine_id INTEGER NOT NULL REFERENCES routine(id) ON DELETE CASCADE,
    taken_on TEXT NOT NULL,
    UNIQUE(routine_id, taken_on)
  );
`)
