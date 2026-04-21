#!/usr/bin/env node

import http from "node:http";
import https from "node:https";

const DEFAULT_SLUGS = ["global", "home", "leistungen", "ueber-uns", "faq", "kontakt"];

function getEnv(name, fallback = "") {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : fallback;
}

function getEnvBoolean(name, fallback = false) {
  const value = getEnv(name, "");
  if (!value) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function getEnvNumber(name, fallback) {
  const raw = Number(getEnv(name, ""));
  return Number.isFinite(raw) && raw > 0 ? raw : fallback;
}

function joinUrl(baseUrl, path) {
  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function parseJsonSafe(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalizeRedirectLocation(currentUrl, locationValue) {
  if (!locationValue) {
    return "";
  }

  const raw = String(locationValue).trim();
  if (!raw) {
    return "";
  }

  let absolute;
  try {
    absolute = new URL(raw, currentUrl).toString();
  } catch {
    return "";
  }

  // Some source redirects are malformed, e.g. https://www.aktive-fm.deapi/content/pages/home
  return absolute
    .replace("https://www.aktive-fm.deapi/", "https://www.aktive-fm.de/api/")
    .replace("https://aktive-fm.deapi/", "https://aktive-fm.de/api/");
}

function requestJson(url, options = {}) {
  const {
    method = "GET",
    headers = {},
    body,
    timeoutMs = 20000,
    insecureTls = false,
    followRedirects = true,
    maxRedirects = 5,
  } = options;

  const parsed = new URL(url);
  const isHttps = parsed.protocol === "https:";
  const transport = isHttps ? https : http;

  return new Promise((resolve, reject) => {
    const request = transport.request(
      {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port || (isHttps ? 443 : 80),
        path: `${parsed.pathname}${parsed.search}`,
        method,
        headers: {
          Accept: "application/json",
          ...headers,
        },
        rejectUnauthorized: insecureTls ? false : true,
      },
      (response) => {
        let raw = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          raw += chunk;
        });
        response.on("end", () => {
          const status = response.statusCode ?? 500;
          const isRedirect = status >= 300 && status < 400;
          const locationHeader = response.headers.location;

          if (followRedirects && isRedirect && maxRedirects > 0 && locationHeader) {
            const redirectUrl = normalizeRedirectLocation(url, locationHeader);

            if (redirectUrl) {
              requestJson(redirectUrl, {
                method,
                headers,
                body,
                timeoutMs,
                insecureTls,
                followRedirects,
                maxRedirects: maxRedirects - 1,
              })
                .then(resolve)
                .catch(reject);
              return;
            }
          }

          const json = parseJsonSafe(raw);
          resolve({
            ok: status >= 200 && status < 300,
            status,
            headers: response.headers,
            text: raw,
            json,
          });
        });
      },
    );

    request.setTimeout(timeoutMs, () => {
      request.destroy(new Error(`Request timeout after ${timeoutMs}ms`));
    });

    request.on("error", (error) => reject(error));

    if (body !== undefined) {
      request.write(typeof body === "string" ? body : JSON.stringify(body));
    }

    request.end();
  });
}

async function loginAdmin(baseUrl, username, password, insecureTls, timeoutMs, label) {
  const response = await requestJson(joinUrl(baseUrl, "/api/admin/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      username,
      password,
    },
    insecureTls,
    timeoutMs,
    followRedirects: false,
  });

  if (!response.ok || !response.json?.success || !response.json?.token) {
    if (response.status === 404 && /<!doctype|<html/i.test(response.text)) {
      throw new Error(`${label} login failed (404): target looks like a frontend app, not the admin API. Set CMS_SYNC_TARGET_BASE_URL to your backend URL.`);
    }
    throw new Error(`${label} login failed (${response.status}): ${response.json?.message ?? response.text}`);
  }

  return response.json.token;
}

async function getSourcePage({
  sourceBaseUrl,
  sourceUseAdmin,
  sourceToken,
  slug,
  insecureTls,
  timeoutMs,
}) {
  const path = sourceUseAdmin
    ? `/api/admin/cms/pages/${encodeURIComponent(slug)}`
    : `/api/content/pages/${encodeURIComponent(slug)}`;

  const response = await requestJson(joinUrl(sourceBaseUrl, path), {
    method: "GET",
    headers: sourceUseAdmin
      ? {
          Authorization: `Bearer ${sourceToken}`,
        }
      : {},
    insecureTls,
    timeoutMs,
  });

  if (!response.ok || !response.json?.success || !response.json?.page) {
    throw new Error(`Could not fetch source page '${slug}' (${response.status}): ${response.json?.message ?? response.text}`);
  }

  return response.json.page;
}

async function updateTargetPage({
  targetBaseUrl,
  targetToken,
  slug,
  content,
  status,
  insecureTls,
  timeoutMs,
}) {
  const response = await requestJson(joinUrl(targetBaseUrl, `/api/admin/cms/pages/${encodeURIComponent(slug)}`), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${targetToken}`,
      "Content-Type": "application/json",
    },
    body: {
      content,
      status,
    },
    insecureTls,
    timeoutMs,
  });

  if (!response.ok || !response.json?.success || !response.json?.page) {
    throw new Error(`Could not update target page '${slug}' (${response.status}): ${response.json?.message ?? response.text}`);
  }

  return response.json.page;
}

function printHelp() {
  console.log(`\nCMS Sync\n\nSynchronisiert CMS-Seiten von SOURCE nach TARGET.\n\nEnv-Variablen:\n- CMS_SYNC_SOURCE_BASE_URL (default: http://www.aktive-fm.de)\n- CMS_SYNC_TARGET_BASE_URL (default: http://localhost:3000)\n- CMS_SYNC_PAGE_SLUGS (default: global,home,leistungen,ueber-uns,faq,kontakt)\n- CMS_SYNC_TARGET_USERNAME (required)\n- CMS_SYNC_TARGET_PASSWORD (required)\n- CMS_SYNC_SOURCE_USE_ADMIN (default: false)\n- CMS_SYNC_SOURCE_USERNAME (required wenn SOURCE_USE_ADMIN=true)\n- CMS_SYNC_SOURCE_PASSWORD (required wenn SOURCE_USE_ADMIN=true)\n- CMS_SYNC_DRY_RUN (default: false)\n- CMS_SYNC_INSECURE_TLS (default: false; nur wenn TLS lokal Probleme macht)\n- CMS_SYNC_TIMEOUT_MS (default: 20000)\n\nBeispiele:\n- PowerShell:\n  $env:CMS_SYNC_TARGET_USERNAME='admin'; $env:CMS_SYNC_TARGET_PASSWORD='***'; pnpm cms:sync\n\n- Nur prüfen ohne Schreiben:\n  $env:CMS_SYNC_DRY_RUN='true'; pnpm cms:sync\n`);
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    printHelp();
    return;
  }

  const sourceBaseUrl = getEnv("CMS_SYNC_SOURCE_BASE_URL", "http://www.aktive-fm.de");
  const targetBaseUrl = getEnv("CMS_SYNC_TARGET_BASE_URL", "http://localhost:3000");
  const sourceUseAdmin = getEnvBoolean("CMS_SYNC_SOURCE_USE_ADMIN", false);
  const dryRun = getEnvBoolean("CMS_SYNC_DRY_RUN", false);
  const insecureTls = getEnvBoolean("CMS_SYNC_INSECURE_TLS", false);
  const timeoutMs = getEnvNumber("CMS_SYNC_TIMEOUT_MS", 20000);
  const slugs = getEnv("CMS_SYNC_PAGE_SLUGS", DEFAULT_SLUGS.join(","))
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);

  const targetUsername = getEnv("CMS_SYNC_TARGET_USERNAME");
  const targetPassword = getEnv("CMS_SYNC_TARGET_PASSWORD");

  if (!dryRun && (!targetUsername || !targetPassword)) {
    throw new Error("CMS_SYNC_TARGET_USERNAME und CMS_SYNC_TARGET_PASSWORD sind erforderlich (außer im dry-run).");
  }

  const sourceUsername = getEnv("CMS_SYNC_SOURCE_USERNAME");
  const sourcePassword = getEnv("CMS_SYNC_SOURCE_PASSWORD");

  if (sourceUseAdmin && (!sourceUsername || !sourcePassword)) {
    throw new Error("CMS_SYNC_SOURCE_USERNAME und CMS_SYNC_SOURCE_PASSWORD sind erforderlich, wenn CMS_SYNC_SOURCE_USE_ADMIN=true.");
  }

  console.log(`Starting CMS sync (${dryRun ? "dry-run" : "write"})...`);
  console.log(`Source: ${sourceBaseUrl}`);
  console.log(`Target: ${targetBaseUrl}`);
  console.log(`Slugs: ${slugs.join(", ")}`);

  let sourceToken = "";
  let targetToken = "";

  if (sourceUseAdmin) {
    sourceToken = await loginAdmin(sourceBaseUrl, sourceUsername, sourcePassword, insecureTls, timeoutMs, "source");
  }

  if (!dryRun) {
    targetToken = await loginAdmin(targetBaseUrl, targetUsername, targetPassword, insecureTls, timeoutMs, "target");
  }

  const results = [];

  for (const slug of slugs) {
    try {
      const page = await getSourcePage({
        sourceBaseUrl,
        sourceUseAdmin,
        sourceToken,
        slug,
        insecureTls,
        timeoutMs,
      });

      if (dryRun) {
        console.log(`[dry-run] ${slug}: source fetched (status=${page.status ?? "published"})`);
        results.push({ slug, success: true, mode: "dry-run" });
        continue;
      }

      await updateTargetPage({
        targetBaseUrl,
        targetToken,
        slug,
        content: page.content,
        status: page.status ?? "published",
        insecureTls,
        timeoutMs,
      });

      console.log(`[ok] ${slug}: synced`);
      results.push({ slug, success: true, mode: "write" });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[error] ${slug}: ${message}`);
      results.push({ slug, success: false, error: message });
    }
  }

  const failed = results.filter((entry) => !entry.success);
  const succeeded = results.length - failed.length;

  console.log(`\nFinished: ${succeeded}/${results.length} successful.`);

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
