# Aktive Facility Management Lead-Automatisierungs-Plattform â€“ Quick Start Guide

## ðŸš€ 5-Minuten-Setup

Folge diesen Schritten, um die Lead-Automatisierungs-Plattform in Betrieb zu nehmen.

---

## Schritt 1: Google Analytics 4 aktivieren (2 Minuten)

### 1.1 GA4-Measurement ID besorgen
1. Gehe zu https://analytics.google.com/
2. Erstelle ein neues Property oder verwende ein bestehendes
3. Kopiere die **Measurement ID** (Format: `G-XXXXXXXXXX`)

### 1.2 GA4-ID in Website eintragen
Ã–ffne `client/index.html` und ersetze:
```html
<!-- Vorher -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>

<!-- Nachher (mit deiner ID) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ"></script>
```

**Fertig!** GA4-Tracking ist jetzt aktiv.

---

## Schritt 2: Zapier Webhook konfigurieren (2 Minuten)

### 2.1 Zapier-Konto erstellen
1. Gehe zu https://zapier.com/
2. Erstelle einen kostenlosen Account
3. Klicke **+ Create Zap**

### 2.2 Webhook erstellen
1. WÃ¤hle **Webhooks by Zapier** als Trigger
2. WÃ¤hle **Catch Raw Hook**
3. Kopiere die **Webhook URL**

### 2.3 Webhook-URL in Website eintragen
Ã–ffne `client/src/lib/webhook.ts` und ersetze:
```typescript
// Vorher
return "https://hooks.zapier.com/hooks/catch/YOUR_ZAPIER_ID/YOUR_WEBHOOK_KEY";

// Nachher (mit deiner URL)
return "https://hooks.zapier.com/hooks/catch/12345678/abcdefg";
```

**Fertig!** Formular-Submissions werden jetzt zu Zapier gesendet.

---

## Schritt 3: CRM verbinden (1 Minute)

### Option A: HubSpot
1. Gehe zu https://www.hubspot.com/
2. Erstelle einen kostenlosen Account
3. Gehe zu **Settings** â†’ **Integrations** â†’ **Private Apps**
4. Erstelle eine neue Private App
5. Kopiere den **Access Token**
6. In Zapier: Verbinde HubSpot mit deinem Zap

### Option B: Pipedrive
1. Gehe zu https://www.pipedrive.com/
2. Erstelle einen kostenlosen Account
3. Gehe zu **Settings** â†’ **Personal Preferences** â†’ **API**
4. Kopiere deinen **API Token**
5. In Zapier: Verbinde Pipedrive mit deinem Zap

**Fertig!** Leads werden jetzt automatisch in dein CRM Ã¼bertragen.

---

## Schritt 4: Testen (1 Minute)

### 4.1 Test-Lead erstellen
1. Ã–ffne deine Website: https://www.aktive-fm.de/kontakt
2. FÃ¼lle das Formular mit Test-Daten aus
3. Klicke **Anfrage senden**

### 4.2 Ergebnisse prÃ¼fen
- âœ… **GA4**: Gehe zu Analytics â†’ Real-time â†’ Events (sollte `form_submit` zeigen)
- âœ… **Zapier**: Gehe zu Zap History â†’ sollte "Success" zeigen
- âœ… **CRM**: PrÃ¼fe HubSpot/Pipedrive â†’ sollte neuen Lead zeigen
- âœ… **E-Mail**: PrÃ¼fe dein Postfach â†’ sollte BestÃ¤tigungs-E-Mail haben

**Alles funktioniert!** ðŸŽ‰

---

## ðŸŽ¯ Was ist jetzt aktiv?

### Lead-Erfassung
- âœ… Sticky-Bar mit Telefon, WhatsApp, Anfrage
- âœ… Kontaktformular mit 9 Feldern
- âœ… Multi-CTA-Strategie auf allen Seiten

### Tracking
- âœ… Google Analytics 4 Event-Tracking
- âœ… Scroll-Depth Tracking (25%, 50%, 75%, 100%)
- âœ… Telefon/WhatsApp Click-Tracking
- âœ… Formular-Submission Tracking
- âœ… Cookie Consent Management

### Automatisierung
- âœ… Formular â†’ Zapier Webhook
- âœ… Zapier â†’ CRM (HubSpot/Pipedrive)
- âœ… Zapier â†’ E-Mail-BestÃ¤tigung
- âœ… Zapier â†’ Google Sheets Backup

---

## ðŸ“Š Dashboard-Links

Speichere diese Links fÃ¼r schnellen Zugriff:

| Service | Link |
|---|---|
| Google Analytics | https://analytics.google.com/ |
| Zapier | https://zapier.com/app/dashboard |
| HubSpot CRM | https://app.hubspot.com/ |
| Pipedrive CRM | https://app.pipedrive.com/ |
| Google Search Console | https://search.google.com/search-console |
| Google My Business | https://business.google.com/ |

---

## ðŸ” Monitoring-Checkliste

### TÃ¤glich
- [ ] GA4 Events prÃ¼fen (sollten > 0 sein)
- [ ] Neue Leads in CRM prÃ¼fen
- [ ] Zapier Zap Status prÃ¼fen (sollte "on" sein)

### WÃ¶chentlich
- [ ] Leads pro Woche zÃ¤hlen
- [ ] Lead-QualitÃ¤t prÃ¼fen (vollstÃ¤ndige Daten?)
- [ ] Response-Rate prÃ¼fen (wie viele Leads beantwortet?)

### Monatlich
- [ ] GA4 Performance-Report
- [ ] CRM Lead-Bericht
- [ ] Conversion-Rate berechnen
- [ ] OptimierungsmÃ¶glichkeiten identifizieren

---

## âš™ï¸ HÃ¤ufige Probleme & LÃ¶sungen

### Problem: GA4 Events werden nicht gesendet
**LÃ¶sung:**
1. PrÃ¼fe GA4-Measurement ID in `index.html`
2. Ã–ffne Browser DevTools â†’ Console
3. Sollte keine Fehler zeigen
4. Warte 24 Stunden fÃ¼r GA4-Daten

### Problem: Zapier Zap schlÃ¤gt fehl
**LÃ¶sung:**
1. Gehe zu Zapier â†’ Zap History
2. PrÃ¼fe die Fehlermeldung
3. HÃ¤ufig: Webhook-URL falsch oder CRM-Verbindung fehlgeschlagen
4. Teste Webhook mit `curl` (siehe CRM_INTEGRATION_GUIDE.md)

### Problem: Leads kommen nicht im CRM an
**LÃ¶sung:**
1. PrÃ¼fe Zapier Zap Status (sollte "on" sein)
2. PrÃ¼fe CRM API-Token (sollte gÃ¼ltig sein)
3. PrÃ¼fe Webhook-Payload in Zapier History
4. PrÃ¼fe CRM Custom Fields (sollten existieren)

### Problem: E-Mail-BestÃ¤tigung kommt nicht an
**LÃ¶sung:**
1. PrÃ¼fe Spam-Ordner
2. PrÃ¼fe Zapier Gmail/Outlook Verbindung
3. PrÃ¼fe E-Mail-Template in Zapier
4. Teste mit anderer E-Mail-Adresse

---

## ðŸš€ NÃ¤chste Schritte

Nach dem Quick Start:

1. **Google Search Console einrichten** (siehe GOOGLE_SEARCH_CONSOLE_SETUP.md)
2. **Google My Business erstellen** (fÃ¼r lokale Rankings)
3. **Lokale Verzeichnisse aktualisieren** (Gelbe Seiten, Handwerkskammer)
4. **Backlinks aufbauen** (Branchenverzeichnisse, Pressemitteilungen)
5. **SEO optimieren** (Meta-Tags, Content, interne Links)

---

## ðŸ“ž Support

Bei Fragen:
- **Google Analytics**: https://support.google.com/analytics/
- **Zapier**: https://zapier.com/help/
- **HubSpot**: https://knowledge.hubspot.com/
- **Pipedrive**: https://support.pipedrive.com/

---

## ðŸŽ‰ GlÃ¼ckwunsch!

Deine Lead-Automatisierungs-Plattform ist jetzt aktiv. Die Website wird automatisch:

- Besucher tracken
- Leads erfassen
- In CRM Ã¼bertragen
- BestÃ¤tigungs-E-Mails senden
- Daten in Google Sheets sichern

**Viel Erfolg beim Lead-Generieren!** ðŸš€

