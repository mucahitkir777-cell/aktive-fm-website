# Tracking Architecture

## Scope

This project now has a technical foundation for full funnel tracking without enabling uncontrolled live automations.
External destinations are disabled by default and require explicit environment configuration.

## Module Structure

- `client/src/lib/tracking`: event types, tracking config, UTM capture, device classification, event dispatch.
- `client/src/lib/analytics`: application-facing analytics API and backwards-compatible helpers.
- `client/src/lib/ga4`: consent-gated GA4 script loading and event mapping.
- `client/src/lib/consent`: consent read/write helpers and external analytics gating.
- `client/src/lib/seo`: SEO manager placeholders for canonical URLs and Search Console verification.
- `client/src/lib/crm`: CRM lead payload structure and endpoint placeholder.
- `client/src/lib/reporting`: in-memory reporting queue for debugging and future dashboards.

## Events

- `call_click`: telephone link clicks.
- `whatsapp_click`: WhatsApp link clicks.
- `cta_click`: CTA clicks with `cta_id`, `cta_text`, `cta_location`, and destination.
- `form_start`: first interaction with a form.
- `form_submit`: successful form submit intent.
- `form_success`: lead was accepted by the internal lead endpoint and at least one provider.
- `form_error`: client validation, server validation, or transport processing failed.
- `service_interest`: service-related page or CTA interest.
- `location_interest`: region/city-related page interest.
- `page_view` and `scroll_depth`: supporting funnel context events.

Every event includes page path, URL, title, referrer, session id, device class, timestamp, event id, and stored UTM data.

## Environment Placeholders

Use these values only when the relevant integration should be activated:

```env
VITE_TRACKING_DEBUG=true
VITE_GA4_ENABLED=true
VITE_GA4_MEASUREMENT_ID=G-RM3SBZCP0G
VITE_GA4_DEBUG=true
VITE_GTM_ENABLED=false
VITE_GTM_CONTAINER_ID=GTM-XXXXXXX
VITE_UMAMI_ENABLED=false
VITE_UMAMI_WEBSITE_ID=UMAMI-WEBSITE-ID
VITE_UMAMI_SCRIPT_URL=https://analytics.example.com/script.js
VITE_HEATMAP_ENABLED=false
VITE_HEATMAP_PROVIDER=placeholder
VITE_HEATMAP_PROJECT_ID=YOUR_HEATMAP_PROJECT_ID
VITE_CRM_TRACKING_ENABLED=false
VITE_CRM_LEAD_ENDPOINT=https://crm.example.com/leads
VITE_CRM_PROVIDER=placeholder
VITE_LEAD_API_ENDPOINT=/api/leads
VITE_LEAD_WEBHOOK_ENABLED=false
VITE_LEAD_WEBHOOK_ENDPOINT=https://hooks.example.com/proclean-leads
VITE_LEAD_CRM_ENABLED=false
VITE_LEAD_CRM_ENDPOINT=https://crm.example.com/leads
VITE_LEAD_CRM_PROVIDER=placeholder
VITE_LEAD_EMAIL_ENABLED=false
VITE_LEAD_EMAIL_ENDPOINT=https://email.example.com/send-lead
VITE_LEAD_EMAIL_PROVIDER=placeholder
LEAD_INBOX_ENABLED=true
LEAD_INBOX_FILE=./data/leads.jsonl
LEAD_WEBHOOK_ENABLED=false
LEAD_WEBHOOK_ENDPOINT=https://hooks.example.com/proclean-leads
LEAD_CRM_ENABLED=false
LEAD_CRM_ENDPOINT=https://crm.example.com/leads
LEAD_CRM_PROVIDER=placeholder
LEAD_EMAIL_ENABLED=false
LEAD_EMAIL_ENDPOINT=https://email.example.com/send-lead
LEAD_EMAIL_PROVIDER=placeholder
VITE_SITE_URL=https://www.proclean-gmbh.de
VITE_GOOGLE_SITE_VERIFICATION=GOOGLE_SEARCH_CONSOLE_PLACEHOLDER
```

## Integration Notes

GA4 is enabled through the central tracking config and loaded only after analytics consent.
GTM, Umami, heatmaps, and CRM are prepared through config but not loaded automatically.
External analytics dispatch is gated by analytics consent.
CRM submission should be implemented through a server endpoint before using real credentials or webhook URLs.
Lead submission now uses `/api/leads` as the internal endpoint. Without external credentials, the server stores validated leads in the local inbox configured by `LEAD_INBOX_FILE`.

## GA4 Integration

GA4 uses Measurement ID `G-RM3SBZCP0G` from `client/src/lib/tracking/config.ts` or `VITE_GA4_MEASUREMENT_ID`.
The script is loaded by `client/src/lib/ga4` only when analytics consent is granted.
SPA page views are emitted by `App.tsx` on every route change through `trackPageView`, then mapped to GA4 `page_view`.

Mapped GA4 events:

- `page_view`
- `call_click`
- `whatsapp_click`
- `cta_click`
- `form_start`
- `form_submit`
- `form_success`
- `form_error`
- `service_interest`
- `location_interest`

Local debug:

1. Set `VITE_TRACKING_DEBUG=true` and `VITE_GA4_DEBUG=true`.
2. Accept analytics cookies in the consent banner.
3. Check the browser console for `[tracking]` and `[ga4]` logs.
4. Confirm one GA4 script tag with id `proclean-ga4-script` exists after consent.

## Regional Lead Logic

The active regional lead targets are maintained centrally in `client/src/config/company.ts` and exposed through `client/src/data/leadTargets.ts`.
Current regions:

- Kreis Offenbach
- Frankfurt am Main
- Hanau

Primary regional URLs:

- `/gebaeudereinigung-frankfurt`
- `/gebaeudereinigung-hanau`
- `/gebaeudereinigung-kreis-offenbach`

Curated Frankfurt service URLs prepared for quality SEO pages:

- `/buero-reinigung-frankfurt`
- `/treppenhausreinigung-frankfurt`
- `/glasreinigung-frankfurt`

The project intentionally uses curated regional pages instead of generating mass service-by-region URL combinations.
Region and service interest is tracked through `location_interest` and `service_interest` events on the home page, contact page, regional pages, regional service pages, CTA links, and qualifying form fields.
