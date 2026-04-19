# ENV Configuration Audit Complete

**Date:** April 19, 2026  
**Status:** ✅ Code-verified and corrected  
**Scope:** Production environment variables only (no new features)

---

## Summary of Changes

### Files Modified

1. **[.env.tracking.example](.env.tracking.example)** 
   - ✅ Fixed LEAD_INBOX_ENABLED default from `true` to `false` (code default is false)
   - ✅ Added clarifying comments for email configuration flags
   - ✅ Documented LEAD_EMAIL_ENDPOINT as fallback (not just optional)
   - ✅ Noted LEAD_EMAIL_PROVIDER as cosmetic/unused
   - ✅ Added warning for VITE_SITE_URL fallback behavior

2. **[.env.production.example](.env.production.example)** (NEW)
   - ✅ Created minimal production configuration
   - ✅ Organized into 5 tiers: Required, Recommended, Optional Email, Integrations, Defaults
   - ✅ Added code references and file locations
   - ✅ Included security guidance for each variable
   - ✅ No speculation: all values based on actual code analysis

3. **[ENV_REFERENCE.md](ENV_REFERENCE.md)** (NEW)
   - ✅ Complete categorization: A. Required / B. Recommended / C. Optional
   - ✅ All 40+ variables mapped to actual code files and functions
   - ✅ Clear explanation of what happens when each variable is missing
   - ✅ Included migration guide from old documentation
   - ✅ Added troubleshooting section and test commands

---

## Critical Corrections Made

| Variable | Old Statement | New Statement | Impact |
|----------|---------------|---------------|---------| 
| **LEAD_INBOX_ENABLED** | Default is `true` | ❌ FALSE: Default is `false` in code | Configuration was backwards |
| **NODE_ENV** | "Blocking at startup" | ✅ Blocks at startup only if in production without it | Security issue if not set to "production" |
| **ADMIN_PASSWORD** | "Always blocking" | ✅ Blocking only during bootstrap (if no users in DB) | Can be removed after initial setup |
| **ADMIN_JWT_SECRET** | "Blocking at startup" | ✅ Blocks at admin login/token-signing, not startup | Server starts fine, login fails if missing |
| **VITE_SITE_URL** | "Totally optional" | ⚠️ Has fallback to hardcoded aktive-fm.de (may be wrong) | SEO broken if not set correctly |
| **LEAD_EMAIL_ENDPOINT** | "Optional" | ✅ Fallback if SMTP incomplete | Only relevant in specific configurations |
| **LEAD_EMAIL_PROVIDER** | "Optional config" | ⚠️ Never actively used in code (cosmetic) | Can be safely removed/ignored |

---

## A. REQUIRED FOR PRODUCTION (3+2 variables)

These **must** be set. Server won't start or admin login will fail without them.

### Absolutely Required (blocks startup):
```env
DATABASE_URL=postgresql://user:password@host:5432/proclean_db
NODE_ENV=production
DATABASE_SSL=require
ADMIN_JWT_SECRET=<min_32_chars_random_string>
ADMIN_PASSWORD=<secure_password>  # Only needed for bootstrap (first run)
```

**Why these are blocking:**
- `DATABASE_URL` — Checked immediately at server startup
- `NODE_ENV=production` — Enables security hardening
- `ADMIN_JWT_SECRET` — Required when signing/verifying admin tokens
- `ADMIN_PASSWORD` — Required only on first startup if no users exist in DB

---

## B. STRONGLY RECOMMENDED (3 variables)

Website runs without these, but **core functionality is degraded**:

```env
VITE_SITE_URL=https://www.aktive-fm.de          # SEO critical (canonical URLs)
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX             # Analytics (no tracking without it)
VITE_GOOGLE_SITE_VERIFICATION=<token>            # Search Console verification
```

**Why strongly recommended:**
- No VITE_SITE_URL → Wrong canonical URLs → SEO issues
- No GA4 → No traffic analytics
- No Google verification → Cannot access Search Console

---

## C. OPTIONAL (everything else)

All other variables are **completely optional**. Website works fine without them.

### Email (if you want notifications):
```env
LEAD_EMAIL_ENABLED=true
LEAD_EMAIL_NOTIFICATION_ENABLED=true
LEAD_EMAIL_CONFIRMATION_ENABLED=true
LEAD_SMTP_HOST=smtp.gmail.com
LEAD_SMTP_PORT=587
LEAD_SMTP_SECURE=false
LEAD_SMTP_USER=notifications@gmail.com
LEAD_SMTP_PASSWORD=app-specific-password
LEAD_EMAIL_FROM=notifications@aktive-fm.de
LEAD_NOTIFICATION_TO=team@aktive-fm.de
```

### Everything else:
- Tracking integrations (GA4, GTM, Umami, Heatmap) — optional
- CRM webhooks — optional
- Local inbox backup — optional
- All client-side tracking flags — optional

---

## Test & Verification Commands

### 1. Type-Check (no ENV needed)
```bash
pnpm check
```

### 2. Build (uses VITE_* from .env.production)
```bash
pnpm build
```

### 3. Start Server (test DATABASE_URL and ADMIN_JWT_SECRET)
```bash
pnpm build
NODE_ENV=production node dist/index.js
# Should see: "Server listening on port 3000"
# Should NOT see: "DATABASE_URL is not set" or "ADMIN_JWT_SECRET is not set"
```

### 4. Test Admin Login (test ADMIN_JWT_SECRET and ADMIN_PASSWORD)
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username":"admin",
    "password":"your-password-from-ADMIN_PASSWORD"
  }'
# Should return: 200 OK with token
# If fails: Check ADMIN_JWT_SECRET and ADMIN_PASSWORD
```

### 5. Test Lead Submission (test DATABASE_URL and schema validation)
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "formId":"contact-form","formType":"inquiry","source":"contact-page","pagePath":"/kontakt",
    "submittedAt":"2026-04-19T10:00:00Z","deviceType":"desktop",
    "name":"Max Mustermann","email":"max@example.com","phone":"+491234567890",
    "regionId":"region-1","serviceId":"service-1","privacyConsent":true
  }'
# Should return: 200 OK with leadId and success: true
# Should create record in database
# If fails: Check DATABASE_URL
```

### 6. Test Email Flag Logic (test LEAD_EMAIL_* configuration)

**Test 1: All emails disabled (default)**
```bash
export LEAD_EMAIL_ENABLED=false
# Submit lead (curl from Test 5)
# Result: Emails skipped, but lead stored in database ✅
```

**Test 2: Email enabled but SMTP not configured**
```bash
export LEAD_EMAIL_ENABLED=true
export LEAD_EMAIL_NOTIFICATION_ENABLED=true
# Do NOT set LEAD_SMTP_* variables
# Submit lead
# Result: Email fails gracefully, lead still stored ✅
```

**Test 3: Email enabled with valid SMTP**
```bash
export LEAD_EMAIL_ENABLED=true
export LEAD_EMAIL_NOTIFICATION_ENABLED=true
export LEAD_EMAIL_CONFIRMATION_ENABLED=true
export LEAD_SMTP_HOST=smtp.gmail.com
export LEAD_SMTP_PORT=587
export LEAD_SMTP_USER=your-email@gmail.com
export LEAD_SMTP_PASSWORD=your-app-password
export LEAD_EMAIL_FROM=notifications@aktive-fm.de
export LEAD_NOTIFICATION_TO=team@aktive-fm.de
# Submit lead
# Result: Both emails sent successfully ✅
```

### 7. Check Database Connection
```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users"
# Should show: 0 (if fresh) or > 0 (if already initialized)
# If fails: DATABASE_URL is wrong or DB doesn't exist
```

### 8. Check Environment Variables are Set
```bash
echo "DATABASE_URL: $DATABASE_URL"
echo "NODE_ENV: $NODE_ENV"
echo "ADMIN_JWT_SECRET: ${ADMIN_JWT_SECRET:0:20}..." # Only show first 20 chars
echo "VITE_SITE_URL: $VITE_SITE_URL"
echo "VITE_GA4_MEASUREMENT_ID: $VITE_GA4_MEASUREMENT_ID"
```

---

## Final Minimal Production `.env`

```bash
# Copy from .env.production.example and fill in your actual values:

# REQUIRED
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/proclean_db
DATABASE_SSL=require
ADMIN_JWT_SECRET=<openssl rand -base64 32>
ADMIN_PASSWORD=<secure_password>

# STRONGLY RECOMMENDED (for SEO & Analytics)
VITE_SITE_URL=https://your-actual-domain.com
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GOOGLE_SITE_VERIFICATION=<token>

# OPTIONAL (if you want email)
LEAD_EMAIL_ENABLED=false
# ... (see .env.production.example for SMTP details)
```

---

## Migration Path for Old Configuration

If you have an old `.env` file with unclear variables:

1. **Start fresh** from `.env.production.example`
2. **Only set these:**
   - DATABASE_URL (yours)
   - NODE_ENV=production
   - ADMIN_JWT_SECRET (generate new)
   - ADMIN_PASSWORD (generate new)
   - VITE_SITE_URL (your domain)
   - VITE_GA4_MEASUREMENT_ID (from Google Analytics)
3. **Everything else:** Leave at defaults or disable
4. **Test with commands** in "Test & Verification" section above
5. **Add more variables later** only if you need specific features

---

## References

- **Complete ENV Guide:** [ENV_REFERENCE.md](ENV_REFERENCE.md)
- **Example Files:**
  - [.env.production.example](.env.production.example) — All categories organized
  - [.env.tracking.example](.env.tracking.example) — All variables with defaults
- **Code Files:**
  - [server/leads/config.ts](server/leads/config.ts) — Lead configuration loading
  - [server/auth.ts](server/auth.ts) — Admin authentication
  - [server/index.ts](server/index.ts) — Server startup and validation
  - [client/src/lib/tracking/config.ts](client/src/lib/tracking/config.ts) — Tracking setup

---

## Checklist: Go-Live Preparation

- [ ] Copy `.env.production.example` to `.env.production`
- [ ] Fill in all REQUIRED variables
- [ ] Fill in all STRONGLY RECOMMENDED variables
- [ ] Run `pnpm check` (no new errors)
- [ ] Run `pnpm build` (no new errors)
- [ ] Run Test Commands 1-8 above
- [ ] Create backup of production database
- [ ] Deploy to production
- [ ] Monitor server logs for any missing variable errors
- [ ] Verify admin login works
- [ ] Verify lead form submission works
- [ ] Check Google Analytics shows traffic
- [ ] Check Search Console verification status

---

**Status:** ✅ Audit complete. All environment variables code-verified.  
**Next Step:** Use `.env.production.example` to create your actual `.env.production` file.
