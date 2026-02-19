/**
 * Aiven MySQL connection pool
 * Auto-initialises the users table on first call.
 */
import mysql from 'mysql2/promise';

/* ── Global singleton for hot-reload safety in dev ───────── */
declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: mysql.Pool | undefined;
}

function buildPool(): mysql.Pool {
  return mysql.createPool({
    host:             process.env.DB_HOST!,
    port:             Number(process.env.DB_PORT) || 3306,
    user:             process.env.DB_USER!,
    password:         process.env.DB_PASSWORD!,
    database:         process.env.DB_NAME!,
    ssl:              process.env.DB_SSL === 'true'
                        ? { rejectUnauthorized: false }   // Aiven self-signed CA
                        : undefined,
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
    connectTimeout:     30_000,
    timezone:           '+00:00',
  });
}

const pool: mysql.Pool =
  global.__mysqlPool ?? (global.__mysqlPool = buildPool());

export default pool;

/* ── Schema bootstrap (idempotent) ──────────────────────── */
let initialised = false;

export async function ensureSchema(): Promise<void> {
  if (initialised) return;
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name          VARCHAR(120)  NOT NULL,
      password_hash VARCHAR(255)  NOT NULL,
      created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_name (name)
    ) ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci;
  `);
  initialised = true;
}

/* ── Query helpers ───────────────────────────────────────── */
export interface DBUser {
  id:            number;
  name:          string;
  password_hash: string;
  created_at:    Date;
}

export async function findUserByName(name: string): Promise<DBUser | null> {
  await ensureSchema();
  const [rows] = await pool.execute<mysql.RowDataPacket[]>(
    'SELECT * FROM users WHERE name = ? LIMIT 1',
    [name],
  );
  return (rows[0] as DBUser) ?? null;
}

export async function findUserById(id: number): Promise<Omit<DBUser, 'password_hash'> | null> {
  await ensureSchema();
  const [rows] = await pool.execute<mysql.RowDataPacket[]>(
    'SELECT id, name, created_at FROM users WHERE id = ? LIMIT 1',
    [id],
  );
  return (rows[0] as Omit<DBUser, 'password_hash'>) ?? null;
}

export async function createUser(data: {
  name:          string;
  password_hash: string;
}): Promise<number> {
  await ensureSchema();
  const [result] = await pool.execute<mysql.ResultSetHeader>(
    'INSERT INTO users (name, password_hash) VALUES (?, ?)',
    [data.name, data.password_hash],
  );
  return result.insertId;
}
