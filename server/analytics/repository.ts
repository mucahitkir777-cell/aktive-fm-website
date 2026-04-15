import crypto from "crypto";
import { getDbPool } from "../db";

interface PageViewSummaryRow {
  today: string;
  last_7_days: string;
}

export async function recordPageView(input: { path: string; userAgent?: string | null }) {
  const db = getDbPool();

  await db.query(
    `
      INSERT INTO page_views (
        id,
        path,
        user_agent,
        created_at
      )
      VALUES ($1, $2, $3, NOW())
    `,
    [crypto.randomUUID(), input.path, input.userAgent ?? null],
  );
}

export async function getPageViewStats() {
  const db = getDbPool();
  const result = await db.query<PageViewSummaryRow>(`
    SELECT
      COUNT(*) FILTER (
        WHERE created_at >= date_trunc('day', NOW())
      )::text AS today,
      COUNT(*) FILTER (
        WHERE created_at >= NOW() - INTERVAL '7 days'
      )::text AS last_7_days
    FROM page_views
  `);

  return {
    today: Number(result.rows[0]?.today ?? "0"),
    last7Days: Number(result.rows[0]?.last_7_days ?? "0"),
  };
}
