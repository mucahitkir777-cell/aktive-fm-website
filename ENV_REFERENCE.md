# Environment Variables Reference

**Last Updated:** April 2026  
**Status:** Code-Verified against actual implementation

---

## Overview

This document categorizes all environment variables into three tiers:
- **A. Required for Production Startup** — Server won't start or key features fail without these
- **B. Strongly Recommended** — Website runs, but core functionality or SEO is degraded
- **C. Optional** — Additional integrations for future expansion

---

## A. REQUIRED FOR PRODUCTION STARTUP

These variables are **blocking** at startup or critical features.

### DATABASE_URL
- **File & Function:** `server/db.ts:getDatabaseUrl()`
- **Required:** YES (blocking startup)
- **What happens without it:** `Error: DATABASE_URL is not set.` → **Server crashes immediately**
- **Format:** `postgresql://user:password@host:port/database`
- **Example:** `postgresql://produser:secure123@db.example.com:5432/proclean_prod`
- **Notes:** Must include proper credentials. Database must exist.

### NODE_ENV
- **File & Function:** `server/auth.ts:getJwtSecret()`, `server/users/repository.ts:getBootstrapAdminPassword()`, `vite.config.ts`
- **Required:** YES (critical for security)
- **What happens without it:** Dev defaults are used → **weak security in production**
  - ADMIN_JWT_SECRET falls back to `"local-development-secret"` if not set
  - ADMIN_PASSWORD falls back to `"admin123"` if not set
- **Values:** `production` (required) or `development` (local only)
- **Example:** `NODE_ENV=production`
- **Notes:** Must be `production` for production deployments.

### ADMIN_JWT_SECRET
- **File & Function:** `server/auth.ts:signTokenPayload()`, `verifySignedToken()`
- **Required:** YES (blocking admin login)
- **What happens without it:** `Error: ADMIN_JWT_SECRET is not set.` when signing tokens → **admin login fails**
- **Format:** Min 32 characters, randomly generated
- **Example:** `openssl rand -base64 32` → output becomes the value
- **Notes:** Used to sign and verify JWT tokens for admin sessions. Different value for each environment.

### ADMIN_PASSWORD
- **File & Function:** `server/users/repository.ts:ensureInitialAdminUser()`, `getBootstrapAdminPassword()`
- **Required:** YES (but only during bootstrap if no users exist)
- **What happens without it:** If no users in DB + `NODE_ENV=production` → `Error: No admin user exists and ADMIN_PASSWORD is not set for bootstrap.` → **Server startup fails**
- **When it's needed:** Only on first deployment when database is empty
- **When it's NOT needed:** After initial admin user is created in database, variable can be removed
- **Format:** Secure password (min 12 chars, mixed case, numbers, symbols recommended)
- **Example:** `ADMIN_PASSWORD=SecurePass123!`
- **Notes:** Used only once to create initial admin user. After that, password changes happen in admin panel.

### DATABASE_SSL
- **File & Function:** `server/db.ts:shouldUseSsl()`, PostgreSQL connection pool
- **Required:** STRONGLY RECOMMENDED (critical for security)
- **Values:** 
  - `require` — mandatory SSL (recommended for production)
  - `disable` — no SSL (only for local/dev databases)
- **Example:** `DATABASE_SSL=require`
- **Notes:** Without SSL, database credentials are transmitted unencrypted.

---

## B. STRONGLY RECOMMENDED (Core Features & SEO)

These are **not blocking**, but website quality is significantly degraded without them.

### VITE_SITE_URL
- **File & Function:** `client/src/lib/seo/index.ts:SEO_MANAGER_CONFIG.baseUrl`
- **Impact if missing:** Falls back to hardcoded `https://aktive-fm.de` from `client/src/config/company.ts`
- **Problem:** If your domain is NOT aktive-fm.de, all canonical URLs and og:url meta tags will be **wrong**
- **SEO Impact:** ⚠️ CRITICAL — Search engines may index duplicate content or wrong domain
- **Format:** Full HTTPS URL of your site
- **Example:** `VITE_SITE_URL=https://www.aktive-fm.de`
- **Notes:** Used in canonical links, OpenGraph tags, and Region.tsx. Update for each domain.

### VITE_GA4_MEASUREMENT_ID
- **File & Function:** `client/src/lib/tracking/config.ts:TRACKING_CONFIG.destinations.ga4`
- **Impact if missing:** GA4 tracking is completely disabled
- **Problem:** No analytics data collected
- **Format:** `G-XXXXXXXXXX` (11 alphanumeric characters)
- **Example:** `VITE_GA4_MEASUREMENT_ID=G-RM3SBZCP0G`
- **Source:** https://analytics.google.com/ → Admin → Property → Measurement ID
- **Notes:** Without this, you have no traffic data.

### VITE_GOOGLE_SITE_VERIFICATION
- **File & Function:** `client/src/lib/seo/index.ts:SEO_MANAGER_CONFIG.searchConsoleVerificationCode`
- **Impact if missing:** Falls back to `"GOOGLE_SEARCH_CONSOLE_PLACEHOLDER"`
- **Problem:** Google Search Console cannot verify domain ownership
- **Format:** Token from Google Search Console (varies by verification method)
- **Example:** `VITE_GOOGLE_SITE_VERIFICATION=abcdef123456GHIJKLMNOpqrstu`
- **Source:** https://search.google.com/search-console → Verify ownership
- **Notes:** Required for full Search Console access. Without it, cannot verify domain.

### LEAD_SMTP_* (if LEAD_EMAIL_ENABLED=true)
- **File & Function:** `server/leads/email.ts:hasConfiguredLeadSmtp()`, `sendLeadNotificationEmail()`, `sendLeadConfirmationEmailToLead()`
- **Variables:**
  - `LEAD_SMTP_HOST` — SMTP server hostname
  - `LEAD_SMTP_PORT` — SMTP port (default 587)
  - `LEAD_SMTP_SECURE` — Use TLS (true/false, default false)
  - `LEAD_SMTP_USER` — SMTP username
  - `LEAD_SMTP_PASSWORD` — SMTP password
  - `LEAD_EMAIL_FROM` — Sender email address
  - `LEAD_NOTIFICATION_TO` — Team email address for notifications
- **Impact if missing (but LEAD_EMAIL_ENABLED=true):** Email sending fails → fallback to `LEAD_EMAIL_ENDPOINT` webhook (if configured)
- **Format Examples:**
  ```
  LEAD_SMTP_HOST=smtp.gmail.com
  LEAD_SMTP_PORT=587
  LEAD_SMTP_SECURE=false
  LEAD_SMTP_USER=notifications@gmail.com
  LEAD_SMTP_PASSWORD=app-specific-password
  LEAD_EMAIL_FROM=notifications@aktive-fm.de
  LEAD_NOTIFICATION_TO=team@aktive-fm.de
  ```
- **Notes:** Only required if `LEAD_EMAIL_ENABLED=true`. If incomplete, falls back to webhook endpoint.

---

## C. OPTIONAL (Future Integrations & Feature Flags)

These are **completely optional**. Website runs fine without them. Activating them enables additional features.

### Lead Email Delivery (optional feature)

#### LEAD_EMAIL_ENABLED
- **File & Function:** `server/leads/config.ts`, `server/leads/email.ts:deliverLeadNotification()`, `deliverLeadConfirmation()`
- **Default:** `false`
- **What it controls:** Master switch for all email delivery
- **If false:** Email sending is skipped (status: "skipped"), but leads are still stored in database
- **If true:** Requires valid SMTP configuration (see section B above)
- **Example:** `LEAD_EMAIL_ENABLED=true`
- **Server Impact:** Non-blocking — leads still store successfully even if email fails

#### LEAD_EMAIL_NOTIFICATION_ENABLED
- **File & Function:** `server/leads/email.ts:deliverLeadNotification()`
- **Default:** `false`
- **What it controls:** Team notification emails to LEAD_NOTIFICATION_TO
- **Requirements:** LEAD_EMAIL_ENABLED=true + valid SMTP configuration
- **Example:** `LEAD_EMAIL_NOTIFICATION_ENABLED=true`
- **Server Impact:** Non-blocking — lead storage not affected by email failure
- **Email Content:** Includes name, email, phone, region, service, message, lead ID, admin link

#### LEAD_EMAIL_CONFIRMATION_ENABLED
- **File & Function:** `server/leads/email.ts:deliverLeadConfirmation()`
- **Default:** `false`
- **What it controls:** Customer confirmation emails to the lead's email address
- **Requirements:** LEAD_EMAIL_ENABLED=true + valid SMTP configuration
- **Example:** `LEAD_EMAIL_CONFIRMATION_ENABLED=true`
- **Server Impact:** Non-blocking — lead storage not affected by email failure
- **Email Content:** Welcome message, request summary, contact details, signature

#### LEAD_SMTP_HOST
- **File & Function:** `server/leads/config.ts:LEAD_SERVER_CONFIG.email.smtp.host`, `server/leads/email.ts:getTransporter()`
- **Required if:** `LEAD_EMAIL_ENABLED=true`
- **Default:** `smtp.example.com` (placeholder)
- **Format:** Hostname of SMTP server (no protocol, no port)
- **Examples:** 
  - `smtp.gmail.com` (Gmail)
  - `smtp.office365.com` (Microsoft 365)
  - `mail.company.com` (self-hosted)
- **Notes:** Domain only, port specified separately in LEAD_SMTP_PORT

#### LEAD_SMTP_PORT
- **File & Function:** `server/leads/config.ts:LEAD_SERVER_CONFIG.email.smtp.port`
- **Required if:** `LEAD_EMAIL_ENABLED=true`
- **Default:** `587` (TLS standard)
- **Valid values:** 
  - `587` — TLS (recommended, requires LEAD_SMTP_SECURE=false)
  - `465` — SSL/implicit TLS (requires LEAD_SMTP_SECURE=true, auto-set)
  - `25` — plain (not recommended)
- **Example:** `LEAD_SMTP_PORT=587`
- **Notes:** Auto-sets LEAD_SMTP_SECURE=true if port is 465

#### LEAD_SMTP_SECURE
- **File & Function:** `server/leads/config.ts:LEAD_SERVER_CONFIG.email.smtp.secure`, `server/leads/email.ts:getTransporter()`
- **Required if:** `LEAD_EMAIL_ENABLED=true` with port 25 or non-standard
- **Default:** `false` (automatically set to `true` if port is 465)
- **Meaning:**
  - `true` — Use SSL/TLS from connection start (port 465)
  - `false` — Start plain, upgrade with STARTTLS (port 587)
- **Example:** `LEAD_SMTP_SECURE=false`
- **Auto-calculation:** If `LEAD_SMTP_PORT=465`, this is automatically set to `true`

#### LEAD_SMTP_USER
- **File & Function:** `server/leads/config.ts:LEAD_SERVER_CONFIG.email.smtp.user`, `server/leads/email.ts:getTransporter()`
- **Required if:** `LEAD_EMAIL_ENABLED=true` and SMTP is used
- **Format:** Email address or username for SMTP authentication
- **Example:** `LEAD_SMTP_USER=notifications@gmail.com`
- **No default:** Empty string, validation requires this to be non-empty
- **Security:** ⚠️ NEVER commit to repository, use `.env.production` only

#### LEAD_SMTP_PASSWORD
- **File & Function:** `server/leads/config.ts:LEAD_SERVER_CONFIG.email.smtp.password`, `server/leads/email.ts:getTransporter()`
- **Required if:** `LEAD_EMAIL_ENABLED=true` and SMTP is used
- **Format:** Password or app-specific token (NOT your account password for Gmail/Office365)
- **Examples:**
  - Gmail: Use "App Password" from Account Security (16-character token)
  - Office365: Use account password or app password
  - Self-hosted: Use SMTP password
- **No default:** Empty string, validation requires this to be non-empty
- **Security:** ⚠️ NEVER commit to repository, use `.env.production` only, ⚠️ DO NOT log this value

#### LEAD_EMAIL_FROM
- **File & Function:** `server/leads/config.ts:LEAD_SERVER_CONFIG.email.smtp.from`, `server/leads/email.ts:sendLeadNotificationEmail()`, `sendLeadConfirmationEmailToLead()`
- **Required if:** `LEAD_EMAIL_ENABLED=true`
- **Default:** `notifications@example.com` (placeholder)
- **Format:** Valid email address (typically same as or verified by SMTP_USER)
- **Example:** `LEAD_EMAIL_FROM=notifications@aktive-fm.de`
- **Notes:** This is the "From" address visible in sent emails. Many SMTP providers require this to match the authenticated user.

#### LEAD_NOTIFICATION_TO
- **File & Function:** `server/leads/config.ts:LEAD_SERVER_CONFIG.email.smtp.to`, `server/leads/email.ts:sendLeadNotificationEmail()`
- **Required if:** `LEAD_EMAIL_ENABLED=true` and `LEAD_EMAIL_NOTIFICATION_ENABLED=true`
- **Default:** `team@example.com` (placeholder)
- **Format:** Valid email address (team/operator email)
- **Example:** `LEAD_NOTIFICATION_TO=team@aktive-fm.de`
- **Recipient:** This is who receives internal lead notifications (not the customer)
- **Notes:** Can be different from LEAD_SMTP_USER

#### LEAD_EMAIL_ENDPOINT (fallback webhook)
- **File & Function:** `server/leads/email.ts:postLeadNotificationEndpoint()`
- **Default:** empty
- **What it controls:** Fallback webhook if SMTP is not fully configured
- **Usage:** Used only if `LEAD_SMTP_HOST` is not set or incomplete
- **Not recommended for production** — Use SMTP instead
- **Example:** `LEAD_EMAIL_ENDPOINT=https://email-service.example.com/send`

#### LEAD_EMAIL_PROVIDER
- **File & Function:** `server/leads/config.ts:LEAD_SERVER_CONFIG.email.provider`
- **Status:** Read but **never actively used** in code — cosmetic only
- **Can be:** Removed or left empty without any impact
- **Example:** `LEAD_EMAIL_PROVIDER=placeholder`

### Local Lead Inbox (optional backup storage)

#### LEAD_INBOX_ENABLED
- **File & Function:** `server/leads/config.ts`, `server/leads/adapters.ts:persistToLocalInbox()`
- **Default:** `false` (NOT true, despite older documentation)
- **What it controls:** Writes leads to a local JSONL file in addition to database
- **If false:** Leads go only to database (status: "skipped" for inbox provider)
- **If true:** Creates/appends to `LEAD_INBOX_FILE`
- **Example:** `LEAD_INBOX_ENABLED=false`

#### LEAD_INBOX_FILE
- **File & Function:** `server/leads/config.ts:LEAD_SERVER_CONFIG.inbox.filePath`
- **Default:** `./data/leads.jsonl`
- **What it controls:** Location of local lead file (only if LEAD_INBOX_ENABLED=true)
- **Example:** `LEAD_INBOX_FILE=./data/leads.jsonl`

### Webhook & CRM Integrations (optional)

#### LEAD_WEBHOOK_ENABLED / LEAD_WEBHOOK_ENDPOINT
- **File & Function:** `server/leads/config.ts`, `server/leads/adapters.ts:postJson("webhook", ...)`
- **Default:** disabled
- **What it controls:** POST leads to external webhook
- **Example:**
  ```
  LEAD_WEBHOOK_ENABLED=false
  LEAD_WEBHOOK_ENDPOINT=https://hooks.zapier.com/hooks/catch/123456/abc
  ```

#### LEAD_CRM_ENABLED / LEAD_CRM_ENDPOINT / LEAD_CRM_PROVIDER
- **File & Function:** `server/leads/config.ts`, `server/leads/adapters.ts:postJson("crm", ...)`
- **Default:** disabled
- **What it controls:** POST leads to CRM API
- **Example:**
  ```
  LEAD_CRM_ENABLED=false
  LEAD_CRM_ENDPOINT=https://crm.example.com/leads
  LEAD_CRM_PROVIDER=placeholder
  ```

### Tracking Integrations (optional analytics)

#### VITE_GA4_ENABLED / VITE_GA4_DEBUG
- **File & Function:** `client/src/lib/tracking/config.ts`
- **Default:** enabled
- **What it controls:** GA4 event tracking and debug mode
- **Example:** `VITE_GA4_ENABLED=true`, `VITE_GA4_DEBUG=false`

#### VITE_GTM_ENABLED / VITE_GTM_CONTAINER_ID
- **File & Function:** `client/src/lib/tracking/config.ts`
- **Default:** disabled
- **What it controls:** Google Tag Manager integration
- **Example:** `VITE_GTM_ENABLED=false`

#### VITE_UMAMI_ENABLED / VITE_UMAMI_WEBSITE_ID / VITE_UMAMI_SCRIPT_URL
- **File & Function:** `client/src/lib/tracking/config.ts`
- **Default:** disabled
- **What it controls:** Umami analytics integration
- **Example:** `VITE_UMAMI_ENABLED=false`

#### VITE_HEATMAP_ENABLED / VITE_HEATMAP_PROVIDER / VITE_HEATMAP_PROJECT_ID
- **File & Function:** `client/src/lib/tracking/config.ts`
- **Default:** disabled
- **What it controls:** Heatmap provider (Hotjar, etc.)
- **Example:** `VITE_HEATMAP_ENABLED=false`

#### VITE_CRM_TRACKING_ENABLED / VITE_CRM_LEAD_ENDPOINT
- **File & Function:** `client/src/lib/tracking/config.ts`
- **Default:** disabled
- **What it controls:** Client-side CRM event tracking
- **Example:** `VITE_CRM_TRACKING_ENABLED=false`

#### VITE_TRACKING_DEBUG
- **File & Function:** `client/src/lib/tracking/config.ts`
- **Default:** `false`
- **What it controls:** Console logging of all tracking events
- **Example:** `VITE_TRACKING_DEBUG=false` (set to `true` only for local debugging)

### Admin Configuration (optional customization)

#### ADMIN_USERNAME
- **File & Function:** `server/users/repository.ts:getBootstrapAdminUsername()`
- **Default:** `"admin"`
- **What it controls:** Username of initially created admin user
- **Example:** `ADMIN_USERNAME=admin`

#### ADMIN_SESSION_TTL_SECONDS
- **File & Function:** `server/auth.ts:getSessionTtlSeconds()`
- **Default:** `28800` (8 hours)
- **What it controls:** Admin session validity duration
- **Example:** `ADMIN_SESSION_TTL_SECONDS=28800`

#### PORT
- **File & Function:** `server/index.ts`
- **Default:** `3000`
- **What it controls:** HTTP server listen port
- **Example:** `PORT=3000`

### Internal Defaults (no change needed)

These have sensible defaults and should rarely be changed:

- `VITE_LEAD_API_ENDPOINT=/api/leads` — API route for form submissions
- `VITE_SEO_RUNTIME_META_ENABLED=false` — Runtime SEO meta updates
- `LEAD_SMTP_PORT=587` — Standard SMTP TLS port
- `LEAD_SMTP_SECURE=false` — SMTP TLS (not SMTPS)

---

## Production Deployment Checklist

### Before Going Live

1. **✅ Create `.env.production`** from `.env.production.example`
2. **✅ Set DATABASE_URL** with production database credentials
3. **✅ Set NODE_ENV=production**
4. **✅ Generate ADMIN_JWT_SECRET** with `openssl rand -base64 32`
5. **✅ Set ADMIN_PASSWORD** for bootstrap (can be removed after first user is created)
6. **✅ Set VITE_SITE_URL** to your actual production domain
7. **✅ Set VITE_GA4_MEASUREMENT_ID** for analytics
8. **✅ Set VITE_GOOGLE_SITE_VERIFICATION** for Search Console
9. ✅ If using email: Configure SMTP variables
10. ✅ If using webhooks: Configure LEAD_WEBHOOK_ENDPOINT
11. **✅ Run type-check**: `pnpm check`
12. **✅ Run build**: `pnpm build`
13. **✅ Test locally**: Start server, verify logs show no errors
14. **✅ Deploy to production**

---

## Testing Variables

### Minimal Test Configuration

```bash
# Required for startup
NODE_ENV=production
DATABASE_URL=postgresql://testuser:testpass@localhost:5432/proclean_test
DATABASE_SSL=disable
ADMIN_JWT_SECRET=test_secret_min_32_chars_long_ok
ADMIN_PASSWORD=TestPass123!

# Recommended for testing
VITE_SITE_URL=http://localhost:3000
VITE_GA4_MEASUREMENT_ID=G-TEST123

# Optional for testing
LEAD_EMAIL_ENABLED=false
```

### Test Commands

```bash
# Type check
pnpm check

# Build
pnpm build

# Start development
pnpm dev

# Start production (requires .env.production)
pnpm build
NODE_ENV=production node dist/index.js

# Test admin login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"TestPass123!"}'

# Test lead submission (with valid schema)
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "formId":"contact-form","formType":"inquiry","source":"contact-page","pagePath":"/kontakt",
    "submittedAt":"2026-04-19T10:00:00Z","deviceType":"desktop",
    "name":"Max Mustermann","email":"max@example.com","phone":"+491234567890",
    "regionId":"region-1","serviceId":"service-1","privacyConsent":true
  }'
```

---

## Migration Guide from Old Documentation

| Old Statement | New Statement | Impact |
|---------------|---------------|---------| 
| NODE_ENV is "blocking" | NODE_ENV blocks at startup if not set to "production" in production | Clarified: not technically blocking, but safety-critical |
| ADMIN_PASSWORD is "blocking" | ADMIN_PASSWORD is blocking only during bootstrap | Clarified: depends on whether DB already has users |
| VITE_SITE_URL is "optional" | VITE_SITE_URL has fallback to hardcoded aktive-fm.de | Clarified: fallback may be wrong for your domain |
| LEAD_EMAIL_PROVIDER is "optional" | LEAD_EMAIL_PROVIDER is never actively used (cosmetic only) | Clarified: can be safely ignored |
| LEAD_INBOX_ENABLED default is "true" | LEAD_INBOX_ENABLED default is "false" | FIXED: Code default is false, documentation was wrong |
| LEAD_EMAIL_ENDPOINT is "optional" | LEAD_EMAIL_ENDPOINT is fallback if SMTP incomplete | Clarified: only relevant in specific configuration |

---

## Questions & Troubleshooting

### Server won't start

**Check 1:** Is DATABASE_URL set?
```bash
echo $DATABASE_URL  # Should print postgresql://...
```

**Check 2:** Does the database exist?
```bash
psql postgresql://user:pass@host:5432/proclean_db -c "SELECT 1"
```

**Check 3:** Is NODE_ENV set correctly?
```bash
echo $NODE_ENV  # Should be "production"
```

### Admin login fails

**Check 1:** Is ADMIN_JWT_SECRET set?
```bash
echo $ADMIN_JWT_SECRET  # Should be non-empty
```

**Check 2:** Does the admin user exist?
```bash
psql $DATABASE_URL -c "SELECT * FROM users LIMIT 1"
```

### Email not sending

**Check 1:** Is LEAD_EMAIL_ENABLED=true?
```bash
grep LEAD_EMAIL_ENABLED .env.production
```

**Check 2:** Is SMTP fully configured?
```bash
grep LEAD_SMTP .env.production  # All LEAD_SMTP_* should be set
```

**Check 3:** Test SMTP with:
```bash
npm run test:smtp  # If available, or manual telnet test
```

### Canonical URLs are wrong

**Check:** Is VITE_SITE_URL set to your actual domain?
```bash
grep VITE_SITE_URL .env.production
# Should be: VITE_SITE_URL=https://your-actual-domain.com
```

---

**For code-level details, see:**
- Lead configuration: [server/leads/config.ts](server/leads/config.ts)
- Email delivery: [server/leads/email.ts](server/leads/email.ts)
- SEO configuration: [client/src/lib/seo/index.ts](client/src/lib/seo/index.ts)
- Tracking configuration: [client/src/lib/tracking/config.ts](client/src/lib/tracking/config.ts)
