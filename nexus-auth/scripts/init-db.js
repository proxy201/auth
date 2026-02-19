#!/usr/bin/env node
/**
 * Nexus Auth — Database Initialiser
 * Usage: node scripts/init-db.js
 *
 * Creates the `users` table in your Aiven MySQL database.
 * Reads credentials from .env.local automatically.
 */

const path = require('path');
require('fs').existsSync(path.join(__dirname, '../.env.local')) &&
  require('fs')
    .readFileSync(path.join(__dirname, '../.env.local'), 'utf8')
    .split('\n')
    .forEach((line) => {
      const [key, ...rest] = line.split('=');
      if (key && !key.startsWith('#') && rest.length) {
        process.env[key.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
      }
    });

const mysql = require('mysql2/promise');

async function main() {
  console.log('\n🔌  Connecting to Aiven MySQL…');
  console.log(`    Host: ${process.env.DB_HOST}`);
  console.log(`    Port: ${process.env.DB_PORT}`);
  console.log(`    DB:   ${process.env.DB_NAME}\n`);

  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     Number(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl:      process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    connectTimeout: 15_000,
  });

  console.log('✅  Connected!\n');
  console.log('📦  Creating `users` table (if not exists)…');

  await conn.execute(`
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

  console.log('✅  Table ready!\n');

  /* Show table info */
  const [rows] = await conn.execute('DESCRIBE users');
  console.table(rows);

  await conn.end();
  console.log('\n🎉  Database initialised successfully!\n');
}

main().catch((err) => {
  console.error('\n❌  Initialisation failed:', err.message, '\n');
  process.exit(1);
});
