import type { AdminDashboardStats } from "../../shared/admin";
import { leadStatusValues, type LeadStatus } from "../../shared/lead";
import { getPageViewStats } from "../analytics/repository";
import { getDbPool } from "../db";

interface LeadSummaryRow {
  total: string;
  today: string;
  this_week: string;
}

interface LeadStatusRow {
  status: LeadStatus;
  count: string;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const db = getDbPool();

  const [leadSummaryResult, leadStatusResult, pageViews] = await Promise.all([
    db.query<LeadSummaryRow>(`
      SELECT
        COUNT(*)::text AS total,
        COUNT(*) FILTER (
          WHERE created_at >= date_trunc('day', NOW())
        )::text AS today,
        COUNT(*) FILTER (
          WHERE created_at >= date_trunc('week', NOW())
        )::text AS this_week
      FROM leads
    `),
    db.query<LeadStatusRow>(`
      SELECT status, COUNT(*)::text AS count
      FROM leads
      GROUP BY status
    `),
    getPageViewStats(),
  ]);

  const byStatus = Object.fromEntries(
    leadStatusValues.map((status) => [status, 0]),
  ) as Record<LeadStatus, number>;

  leadStatusResult.rows.forEach((row) => {
    byStatus[row.status] = Number(row.count ?? "0");
  });

  return {
    leads: {
      total: Number(leadSummaryResult.rows[0]?.total ?? "0"),
      today: Number(leadSummaryResult.rows[0]?.today ?? "0"),
      thisWeek: Number(leadSummaryResult.rows[0]?.this_week ?? "0"),
      byStatus,
    },
    pageViews,
  };
}
