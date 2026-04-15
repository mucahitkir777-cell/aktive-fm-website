import crypto from "crypto";
import type { NextFunction, Request, Response } from "express";

interface AdminTokenPayload {
  sub: "admin";
  iat: number;
  exp: number;
}

const TOKEN_TTL_SECONDS = 60 * 60 * 8;

function base64UrlEncode(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function getAdminUsername() {
  return process.env.ADMIN_USERNAME || "admin";
}

function getAdminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "production" ? "" : "admin123";
}

function getJwtSecret() {
  if (process.env.ADMIN_JWT_SECRET) return process.env.ADMIN_JWT_SECRET;
  return process.env.NODE_ENV === "production" ? "" : "local-development-secret";
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

function verifyAdminToken(token: string) {
  const secret = getJwtSecret();
  if (!secret) return false;

  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) return false;

  const expectedSignature = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  if (!timingSafeEqualString(signature, expectedSignature)) return false;

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as AdminTokenPayload;
    return payload.sub === "admin" && typeof payload.exp === "number" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function createAdminToken() {
  const now = Math.floor(Date.now() / 1000);
  return signTokenPayload({
    sub: "admin",
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  });
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUsername = getAdminUsername();
  const expectedPassword = getAdminPassword();

  if (!expectedPassword) {
    throw new Error("ADMIN_PASSWORD is not set.");
  }

  return timingSafeEqualString(username, expectedUsername) && timingSafeEqualString(password, expectedPassword);
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.get("authorization") ?? "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token || !verifyAdminToken(token)) {
    res.status(401).json({ success: false, message: "Unauthorized." });
    return;
  }

  next();
}
