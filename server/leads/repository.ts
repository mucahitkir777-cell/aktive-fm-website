import type { AdminLead, AdminLeadUpdateInput, LeadStatus } from "@shared/lead";
import { getDbPool } from "../db";
import type { StoredLead } from "./adapters";

interface LeadRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  status: LeadStatus;
  internal_note: string | null;
  follow_up_date: Date | string | null;
  company: string | null;
  region_label: string | null;
  service_label: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toDateString(value: Date | string | null) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
}

function mapLeadRow(row: LeadRow): AdminLead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    status: row.status,
    internalNote: row.internal_note,
    followUpDate: toDateString(row.follow_up_date),
    company: row.company,
    regionLabel: row.region_label,
    serviceLabel: row.service_label,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

const leadSelect = `
  id,
  name,
  email,
  phone,
  message,
  status,
  internal_note,
  follow_up_date,
  company,
  region_label,
  service_label,
  created_at,
  updated_at
`;

export async function createLead(storedLead: StoredLead) {
  const db = getDbPool();
  const { payload } = storedLead;

  const result = await db.query<LeadRow>(
    `
      INSERT INTO leads (
        id,
        name,
        email,
        phone,
        message,
        company,
        region_label,
        service_label,
        payload,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $10)
      RETURNING ${leadSelect}
    `,
    [
      storedLead.leadId,
      payload.name,
      payload.email,
      payload.phone,
      payload.message ?? null,
      payload.company ?? null,
      payload.regionLabel ?? payload.location ?? null,
      payload.serviceLabel ?? payload.serviceType ?? null,
      JSON.stringify(payload),
      storedLead.receivedAt,
    ],
  );

  return mapLeadRow(result.rows[0]);
}

export async function listLeads() {
  const db = getDbPool();
  const result = await db.query<LeadRow>(`
    SELECT ${leadSelect}
    FROM leads
    ORDER BY created_at DESC
  `);

  return result.rows.map(mapLeadRow);
}

export async function getLeadById(id: string) {
  const db = getDbPool();
  const result = await db.query<LeadRow>(
    `
      SELECT ${leadSelect}
      FROM leads
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] ? mapLeadRow(result.rows[0]) : null;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  return updateLead(id, { status });
}

export async function updateLead(id: string, input: AdminLeadUpdateInput) {
  const db = getDbPool();
  const existingLead = await getLeadById(id);

  if (!existingLead) {
    return null;
  }

  const nextLead = {
    name: input.name ?? existingLead.name,
    email: input.email ?? existingLead.email,
    phone: input.phone ?? existingLead.phone,
    message: input.message !== undefined ? input.message : existingLead.message,
    internalNote: input.internalNote !== undefined ? input.internalNote : (existingLead.internalNote ?? null),
    followUpDate: input.followUpDate !== undefined ? input.followUpDate : (existingLead.followUpDate ?? null),
    status: input.status ?? existingLead.status,
  };

  const result = await db.query<LeadRow>(
    `
      UPDATE leads
      SET
        name = $2,
        email = $3,
        phone = $4,
        message = $5,
        status = $6,
        internal_note = $7,
        follow_up_date = $8,
        payload = COALESCE(payload, '{}'::jsonb) || $9::jsonb,
        updated_at = NOW()
      WHERE id = $1
      RETURNING ${leadSelect}
    `,
    [
      id,
      nextLead.name,
      nextLead.email,
      nextLead.phone,
      nextLead.message,
      nextLead.status,
      nextLead.internalNote,
      nextLead.followUpDate,
      JSON.stringify({
        name: nextLead.name,
        email: nextLead.email,
        phone: nextLead.phone,
        message: nextLead.message,
        status: nextLead.status,
      }),
    ],
  );

  return result.rows[0] ? mapLeadRow(result.rows[0]) : null;
}

