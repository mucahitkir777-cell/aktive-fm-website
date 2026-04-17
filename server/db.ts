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

export async function closeDatabase() {
  if (!pool) {
    return;
  }

  await pool.end();
  pool = null;
}

export async function initializeDatabase() {
  const db = getDbPool();

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin'
        CHECK (role IN ('admin', 'editor', 'staff')),
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.query(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'users_role_check'
      ) THEN
        ALTER TABLE users DROP CONSTRAINT users_role_check;
      END IF;
    END $$;
  `);

  await db.query(`
    ALTER TABLE users
    ADD CONSTRAINT users_role_check
    CHECK (role IN ('admin', 'editor', 'staff'))
  `);

  await db.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_idx
    ON users (LOWER(username))
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'contacted', 'qualified', 'done', 'archived')),
      internal_note TEXT,
      follow_up_date DATE,
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

  await db.query(`
    ALTER TABLE leads
    ADD COLUMN IF NOT EXISTS internal_note TEXT
  `);

  await db.query(`
    ALTER TABLE leads
    ADD COLUMN IF NOT EXISTS follow_up_date DATE
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS page_views (
      id TEXT PRIMARY KEY,
      path TEXT NOT NULL,
      user_agent TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS page_views_created_at_idx
    ON page_views (created_at DESC)
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS page_views_path_idx
    ON page_views (path)
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS cms_pages (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      path TEXT NOT NULL,
      content JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.query(`
    ALTER TABLE cms_pages
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published'
      CHECK (status IN ('draft', 'published'))
  `);

  await db.query(`
    ALTER TABLE cms_pages
    ADD COLUMN IF NOT EXISTS seo_title TEXT
  `);

  await db.query(`
    ALTER TABLE cms_pages
    ADD COLUMN IF NOT EXISTS seo_description TEXT
  `);
}
