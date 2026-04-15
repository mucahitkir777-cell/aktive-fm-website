import pg from "pg";

const { Pool } = pg;

let pool: pg.Pool | null = null;

function getDatabaseUrl() {
  return process.env.DATABASE_URL ?? "";
}

function shouldUseSsl() {
  const value = String(process.env.DATABASE_SSL ?? process.env.PGSSLMODE ?? "").toLowerCase();
  return value === "true" || value === "require";
}

export function getDbPool() {
  if (pool) return pool;

  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }

  pool = new Pool({
    connectionString,
    ssl: shouldUseSsl() ? { rejectUnauthorized: false } : undefined,
  });

  return pool;
}

export async function initializeDatabase() {
  const db = getDbPool();

  await db.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'contacted', 'qualified', 'done', 'archived')),
      company TEXT,
      region_label TEXT,
      service_label TEXT,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS leads_created_at_idx
    ON leads (created_at DESC)
  `);
}
