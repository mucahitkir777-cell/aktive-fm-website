import type { LeadStatus } from "@shared/lead";
import { getDbPool } from "../db";

type LeadReminderStatus = "due_today" | "overdue";

interface LeadReminderRow {
  id: string;
  name: string;
  status: LeadStatus | "ohne Status";
  follow_up_date: Date | string;
  created_at: Date | string;
  reminder_status: LeadReminderStatus;
}

export interface LeadReminderItem {
  id: string;
  name: string;
  status: LeadStatus | "ohne Status";
  followUpDate: string;
  reminderStatus: LeadReminderStatus;
}

export interface LeadReminderSnapshot {
  evaluatedAt: string;
  dueToday: LeadReminderItem[];
  overdue: LeadReminderItem[];
  totalDueToday: number;
  totalOverdue: number;
  total: number;
}

export interface RunLeadReminderJobOptions {
  referenceDate?: Date;
  onLead?: (lead: LeadReminderItem) => Promise<void> | void;
}

export interface LeadReminderJobResult extends LeadReminderSnapshot {
  processed: number;
  failed: number;
}

function toDateString(value: Date | string) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
}

function toIsoDateString(value: Date) {
  return value.toISOString().slice(0, 10);
}

function mapReminderRow(row: LeadReminderRow): LeadReminderItem {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    followUpDate: toDateString(row.follow_up_date),
    reminderStatus: row.reminder_status,
  };
}

export async function getLeadReminderSnapshot(referenceDate = new Date()): Promise<LeadReminderSnapshot> {
  const db = getDbPool();
  const day = toIsoDateString(referenceDate);
  const result = await db.query<LeadReminderRow>(
    `
      SELECT
        id,
        name,
        COALESCE(status, 'ohne Status') AS status,
        follow_up_date,
        created_at,
        CASE
          WHEN follow_up_date = $1::date THEN 'due_today'
          ELSE 'overdue'
        END AS reminder_status
      FROM leads
      WHERE follow_up_date IS NOT NULL
        AND follow_up_date <= $1::date
      ORDER BY follow_up_date ASC, created_at ASC
    `,
    [day],
  );

  const dueToday: LeadReminderItem[] = [];
  const overdue: LeadReminderItem[] = [];

  result.rows.forEach((row) => {
    const lead = mapReminderRow(row);
    if (lead.reminderStatus === "due_today") {
      dueToday.push(lead);
      return;
    }

    overdue.push(lead);
  });

  return {
    evaluatedAt: referenceDate.toISOString(),
    dueToday,
    overdue,
    totalDueToday: dueToday.length,
    totalOverdue: overdue.length,
    total: dueToday.length + overdue.length,
  };
}

export async function runLeadReminderJob(options: RunLeadReminderJobOptions = {}): Promise<LeadReminderJobResult> {
  const snapshot = await getLeadReminderSnapshot(options.referenceDate);
  const leads = [...snapshot.dueToday, ...snapshot.overdue];
  let processed = 0;
  let failed = 0;

  if (options.onLead) {
    for (const lead of leads) {
      try {
        await options.onLead(lead);
        processed += 1;
      } catch (error) {
        failed += 1;
        console.error("[lead-reminder-job] lead processing failed", {
          leadId: lead.id,
          followUpDate: lead.followUpDate,
          reminderStatus: lead.reminderStatus,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  } else {
    processed = leads.length;
  }

  return {
    ...snapshot,
    processed,
    failed,
  };
}

