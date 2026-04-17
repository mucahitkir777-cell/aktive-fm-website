import crypto from "crypto";
import type { NextFunction, Request, Response } from "express";
import type { AdminRole, AdminSessionUser } from "@shared/admin";
import { getAuthUserById } from "./users/repository";

interface AdminTokenPayload extends AdminSessionUser {
  iat: number;
  exp: number;
}

interface VerifiedTokenResult {
  valid: boolean;
  code: "invalid_token" | "token_expired";
  payload?: AdminTokenPayload;
}

declare global {
  namespace Express {
    interface Request {
      adminUser?: AdminSessionUser;
      adminTokenPayload?: AdminTokenPayload;
    }
  }
}

function base64UrlEncode(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function getJwtSecret() {
  if (process.env.ADMIN_JWT_SECRET) return process.env.ADMIN_JWT_SECRET;
  return process.env.NODE_ENV === "production" ? "" : "local-development-secret";
}

function getSessionTtlSeconds() {
  const parsed = Number(process.env.ADMIN_SESSION_TTL_SECONDS ?? 60 * 60 * 8);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 60 * 60 * 8;
}

function timingSafeEqualString(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function signTokenPayload(payload: AdminTokenPayload) {
  const secret = getJwtSecret();
  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET is not set.");
  }

  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");

  return `${header}.${body}.${signature}`;
}

function verifySignedToken(token: string): VerifiedTokenResult {
  const secret = getJwtSecret();
  if (!secret) {
    return { valid: false, code: "invalid_token" };
  }

  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) {
    return { valid: false, code: "invalid_token" };
  }

  const expectedSignature = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  if (!timingSafeEqualString(signature, expectedSignature)) {
    return { valid: false, code: "invalid_token" };
  }

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as AdminTokenPayload;
    const now = Math.floor(Date.now() / 1000);

    if (
      !payload?.id ||
      !payload?.username ||
      !payload?.role ||
      typeof payload.iat !== "number" ||
      typeof payload.exp !== "number"
    ) {
      return { valid: false, code: "invalid_token" };
    }

    if (payload.exp <= now) {
      return { valid: false, code: "token_expired", payload };
    }

    return { valid: true, code: "invalid_token", payload };
  } catch {
    return { valid: false, code: "invalid_token" };
  }
}

export function createAdminToken(user: AdminSessionUser) {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + getSessionTtlSeconds();

  return {
    token: signTokenPayload({
      ...user,
      iat: now,
      exp: expiresAt,
    }),
    expiresAt: new Date(expiresAt * 1000).toISOString(),
  };
}

async function resolveAuthenticatedUser(token: string) {
  const verified = verifySignedToken(token);
  if (!verified.valid || !verified.payload) {
    return verified;
  }

  const user = await getAuthUserById(verified.payload.id);
  if (!user || !user.isActive) {
    return { valid: false as const, code: "invalid_token" as const };
  }

  const updatedAtSeconds = Math.floor(new Date(user.updatedAt).getTime() / 1000);
  if (updatedAtSeconds > verified.payload.iat) {
    return { valid: false as const, code: "invalid_token" as const };
  }

  return {
    valid: true as const,
    code: "invalid_token" as const,
    payload: verified.payload,
  };
}

function unauthorized(res: Response, code: "invalid_token" | "token_expired") {
  res.status(401).json({
    success: false,
    code,
    message: code === "token_expired" ? "Sitzung abgelaufen." : "Nicht autorisiert.",
  });
}

export async function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.get("authorization") ?? "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    unauthorized(res, "invalid_token");
    return;
  }

  const result = await resolveAuthenticatedUser(token);
  if (!result.valid || !result.payload) {
    unauthorized(res, result.code);
    return;
  }

  req.adminUser = {
    id: result.payload.id,
    username: result.payload.username,
    role: result.payload.role,
  };
  req.adminTokenPayload = result.payload;

  next();
}

export function requireAdminRole(role: AdminRole) {
  return requireAdminAnyRole([role]);
}

export function requireAdminAnyRole(roles: readonly AdminRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.adminUser || !roles.includes(req.adminUser.role)) {
      res.status(403).json({
        success: false,
        message: "Keine Berechtigung.",
      });
      return;
    }

    next();
  };
}

