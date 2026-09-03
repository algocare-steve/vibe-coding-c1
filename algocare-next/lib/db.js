import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(), 'routine.db')

function createConnection() {
  const database = new DatabaseSync(DB_PATH)

  database.exec(`
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

  return database
}

// next dev는 파일을 고칠 때마다 이 모듈을 다시 실행할 수 있어서,
// globalThis에 연결을 캐싱해 매번 새 SQLite 연결이 열리는 것을 막는다.
export const db = globalThis.__routineDb ?? createConnection()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__routineDb = db
}
