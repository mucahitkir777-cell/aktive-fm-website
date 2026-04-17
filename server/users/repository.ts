import crypto from "crypto";
import type { AdminRole, AdminUser } from "@shared/admin";
import { getDbPool } from "../db";
import { hashPassword } from "./password";

interface UserRow {
  id: string;
  username: string;
  password_hash: string;
  role: AdminRole;
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface AuthUserRecord {
  id: string;
  username: string;
  passwordHash: string;
  role: AdminRole;
  isActive: boolean;
  updatedAt: string;
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapUserRow(row: UserRow): AdminUser {
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    isActive: row.is_active,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

function mapAuthUserRow(row: UserRow): AuthUserRecord {
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    role: row.role,
    isActive: row.is_active,
    updatedAt: toIsoString(row.updated_at),
  };
}

const userSelect = `
  id,
  username,
  password_hash,
  role,
  is_active,
  created_at,
  updated_at
`;

function getBootstrapAdminUsername() {
  return process.env.ADMIN_USERNAME || "admin";
}

function getBootstrapAdminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "production" ? "" : "admin123";
}

export async function countUsers() {
  const db = getDbPool();
  const result = await db.query<{ count: string }>("SELECT COUNT(*)::text AS count FROM users");
  return Number(result.rows[0]?.count ?? "0");
}

export async function listUsers() {
  const db = getDbPool();
  const result = await db.query<UserRow>(`
    SELECT ${userSelect}
    FROM users
    ORDER BY created_at ASC
  `);

  return result.rows.map(mapUserRow);
}

export async function getUserById(id: string) {
  const db = getDbPool();
  const result = await db.query<UserRow>(
    `
      SELECT ${userSelect}
      FROM users
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] ? mapUserRow(result.rows[0]) : null;
}

export async function getAuthUserById(id: string) {
  const db = getDbPool();
  const result = await db.query<UserRow>(
    `
      SELECT ${userSelect}
      FROM users
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] ? mapAuthUserRow(result.rows[0]) : null;
}

export async function getAuthUserByUsername(username: string) {
  const db = getDbPool();
  const result = await db.query<UserRow>(
    `
      SELECT ${userSelect}
      FROM users
      WHERE LOWER(username) = LOWER($1)
    `,
    [username],
  );

  return result.rows[0] ? mapAuthUserRow(result.rows[0]) : null;
}

export async function createUser(input: { username: string; passwordHash: string; role: AdminRole }) {
  const db = getDbPool();
  const result = await db.query<UserRow>(
    `
      INSERT INTO users (
        id,
        username,
        password_hash,
        role,
        is_active,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, TRUE, NOW(), NOW())
      RETURNING ${userSelect}
    `,
    [crypto.randomUUID(), input.username, input.passwordHash, input.role],
  );

  return mapUserRow(result.rows[0]);
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  const db = getDbPool();
  const result = await db.query<UserRow>(
    `
      UPDATE users
      SET password_hash = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING ${userSelect}
    `,
    [userId, passwordHash],
  );

  return result.rows[0] ? mapUserRow(result.rows[0]) : null;
}

export async function ensureInitialAdminUser() {
  const userCount = await countUsers();
  if (userCount > 0) {
    return { created: false as const };
  }

  const username = getBootstrapAdminUsername();
  const password = getBootstrapAdminPassword();

  if (!password) {
    throw new Error("No admin user exists and ADMIN_PASSWORD is not set for bootstrap.");
  }

  const user = await createUser({
    username,
    passwordHash: hashPassword(password),
    role: "admin",
  });

  return {
    created: true as const,
    user,
  };
}

