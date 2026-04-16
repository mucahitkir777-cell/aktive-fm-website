import type { AdminDashboardStats, AdminDueLead, AdminRecentLead } from "../../shared/admin";
import { leadStatusValues, type LeadStatus } from "../../shared/lead";
import { getPageViewStats } from "../analytics/repository";
import { getDbPool } from "../db";

interface LeadSummaryRow {
  total: string;
  today: string;
  this_week: string;
  due_today: string;
  overdue: string;
}

interface LeadStatusRow {
  status: LeadStatus;
  count: string;
}

interface RecentLeadRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus | "ohne Status";
  created_at: Date | string;
}

interface DueLeadRow {
  id: string;
  name: string;
  status: LeadStatus | "ohne Status";
  follow_up_date: Date | string;
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapRecentLeadRow(row: RecentLeadRow): AdminRecentLead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    status: row.status,
    createdAt: toIsoString(row.created_at),
  };
}

function mapDueLeadRow(row: DueLeadRow): AdminDueLead {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    followUpDate: toIsoString(row.follow_up_date).slice(0, 10),
  };
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const db = getDbPool();

  const [
    leadSummaryResult,
    leadStatusResult,
    recentLeadResult,
    dueLeadResult,
    newTodayLeadResult,
    dueTodayLeadResult,
    overdueLeadResult,
    pageViews,
  ] = await Promise.all([
    db.query<LeadSummaryRow>(`
      SELECT
        COUNT(*)::text AS total,
        COUNT(*) FILTER (
          WHERE created_at >= date_trunc('day', NOW())
        )::text AS today,
        COUNT(*) FILTER (
          WHERE created_at >= date_trunc('week', NOW())
        )::text AS this_week,
        COUNT(*) FILTER (
          WHERE follow_up_date IS NOT NULL
          AND follow_up_date = CURRENT_DATE
        )::text AS due_today,
        COUNT(*) FILTER (
          WHERE follow_up_date IS NOT NULL
          AND follow_up_date < CURRENT_DATE
        )::text AS overdue
      FROM leads
    `),
    db.query<LeadStatusRow>(`
      SELECT status, COUNT(*)::text AS count
      FROM leads
      GROUP BY status
    `),
    db.query<RecentLeadRow>(`
      SELECT
        id,
        name,
        email,
        phone,
        COALESCE(status, 'ohne Status') AS status,
        created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT 10
    `),
    db.query<DueLeadRow>(`
      SELECT
        id,
        name,
        COALESCE(status, 'ohne Status') AS status,
        follow_up_date
      FROM leads
      WHERE follow_up_date IS NOT NULL
        AND follow_up_date <= CURRENT_DATE
      ORDER BY follow_up_date ASC, created_at ASC
      LIMIT 10
    `),
    db.query<RecentLeadRow>(`
      SELECT
        id,
        name,
        email,
        phone,
        COALESCE(status, 'ohne Status') AS status,
        created_at
      FROM leads
      WHERE created_at >= date_trunc('day', NOW())
      ORDER BY created_at DESC
      LIMIT 10
    `),
    db.query<DueLeadRow>(`
      SELECT
        id,
        name,
        COALESCE(status, 'ohne Status') AS status,
        follow_up_date
      FROM leads
      WHERE follow_up_date = CURRENT_DATE
      ORDER BY follow_up_date ASC, created_at ASC
      LIMIT 10
    `),
    db.query<DueLeadRow>(`
      SELECT
        id,
        name,
        COALESCE(status, 'ohne Status') AS status,
        follow_up_date
      FROM leads
      WHERE follow_up_date IS NOT NULL
        AND follow_up_date < CURRENT_DATE
      ORDER BY follow_up_date ASC, created_at ASC
      LIMIT 10
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
      dueToday: Number(leadSummaryResult.rows[0]?.due_today ?? "0"),
      overdue: Number(leadSummaryResult.rows[0]?.overdue ?? "0"),
      byStatus,
    },
    pageViews,
    recentLeads: recentLeadResult.rows.map(mapRecentLeadRow),
    dueLeads: dueLeadResult.rows.map(mapDueLeadRow),
    newLeadsToday: newTodayLeadResult.rows.map(mapRecentLeadRow),
    dueTodayLeads: dueTodayLeadResult.rows.map(mapDueLeadRow),
    overdueLeads: overdueLeadResult.rows.map(mapDueLeadRow),
  };
}
