# ProClean Lead-Automatisierungs-Plattform – Quick Start Guide

## 🚀 5-Minuten-Setup

Folge diesen Schritten, um die Lead-Automatisierungs-Plattform in Betrieb zu nehmen.

---

## Schritt 1: Google Analytics 4 aktivieren (2 Minuten)

### 1.1 GA4-Measurement ID besorgen
1. Gehe zu https://analytics.google.com/
2. Erstelle ein neues Property oder verwende ein bestehendes
3. Kopiere die **Measurement ID** (Format: `G-XXXXXXXXXX`)

### 1.2 GA4-ID in Website eintragen
Öffne `client/index.html` und ersetze:
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
1. Wähle **Webhooks by Zapier** als Trigger
2. Wähle **Catch Raw Hook**
3. Kopiere die **Webhook URL**

### 2.3 Webhook-URL in Website eintragen
Öffne `client/src/lib/webhook.ts` und ersetze:
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
3. Gehe zu **Settings** → **Integrations** → **Private Apps**
4. Erstelle eine neue Private App
5. Kopiere den **Access Token**
6. In Zapier: Verbinde HubSpot mit deinem Zap

### Option B: Pipedrive
1. Gehe zu https://www.pipedrive.com/
2. Erstelle einen kostenlosen Account
3. Gehe zu **Settings** → **Personal Preferences** → **API**
4. Kopiere deinen **API Token**
5. In Zapier: Verbinde Pipedrive mit deinem Zap

**Fertig!** Leads werden jetzt automatisch in dein CRM übertragen.

---

## Schritt 4: Testen (1 Minute)

### 4.1 Test-Lead erstellen
1. Öffne deine Website: https://www.proclean-gmbh.de/kontakt
2. Fülle das Formular mit Test-Daten aus
3. Klicke **Anfrage senden**

### 4.2 Ergebnisse prüfen
- ✅ **GA4**: Gehe zu Analytics → Real-time → Events (sollte `form_submit` zeigen)
- ✅ **Zapier**: Gehe zu Zap History → sollte "Success" zeigen
- ✅ **CRM**: Prüfe HubSpot/Pipedrive → sollte neuen Lead zeigen
- ✅ **E-Mail**: Prüfe dein Postfach → sollte Bestätigungs-E-Mail haben

**Alles funktioniert!** 🎉

---

## 🎯 Was ist jetzt aktiv?

### Lead-Erfassung
- ✅ Sticky-Bar mit Telefon, WhatsApp, Anfrage
- ✅ Kontaktformular mit 9 Feldern
- ✅ Multi-CTA-Strategie auf allen Seiten

### Tracking
- ✅ Google Analytics 4 Event-Tracking
- ✅ Scroll-Depth Tracking (25%, 50%, 75%, 100%)
- ✅ Telefon/WhatsApp Click-Tracking
- ✅ Formular-Submission Tracking
- ✅ Cookie Consent Management

### Automatisierung
- ✅ Formular → Zapier Webhook
- ✅ Zapier → CRM (HubSpot/Pipedrive)
- ✅ Zapier → E-Mail-Bestätigung
- ✅ Zapier → Google Sheets Backup

---

## 📊 Dashboard-Links

Speichere diese Links für schnellen Zugriff:

| Service | Link |
|---|---|
| Google Analytics | https://analytics.google.com/ |
| Zapier | https://zapier.com/app/dashboard |
| HubSpot CRM | https://app.hubspot.com/ |
| Pipedrive CRM | https://app.pipedrive.com/ |
| Google Search Console | https://search.google.com/search-console |
| Google My Business | https://business.google.com/ |

---

## 🔍 Monitoring-Checkliste

### Täglich
- [ ] GA4 Events prüfen (sollten > 0 sein)
- [ ] Neue Leads in CRM prüfen
- [ ] Zapier Zap Status prüfen (sollte "on" sein)

### Wöchentlich
- [ ] Leads pro Woche zählen
- [ ] Lead-Qualität prüfen (vollständige Daten?)
- [ ] Response-Rate prüfen (wie viele Leads beantwortet?)

### Monatlich
- [ ] GA4 Performance-Report
- [ ] CRM Lead-Bericht
- [ ] Conversion-Rate berechnen
- [ ] Optimierungsmöglichkeiten identifizieren

---

## ⚙️ Häufige Probleme & Lösungen

### Problem: GA4 Events werden nicht gesendet
**Lösung:**
1. Prüfe GA4-Measurement ID in `index.html`
2. Öffne Browser DevTools → Console
3. Sollte keine Fehler zeigen
4. Warte 24 Stunden für GA4-Daten

### Problem: Zapier Zap schlägt fehl
**Lösung:**
1. Gehe zu Zapier → Zap History
2. Prüfe die Fehlermeldung
3. Häufig: Webhook-URL falsch oder CRM-Verbindung fehlgeschlagen
4. Teste Webhook mit `curl` (siehe CRM_INTEGRATION_GUIDE.md)

### Problem: Leads kommen nicht im CRM an
**Lösung:**
1. Prüfe Zapier Zap Status (sollte "on" sein)
2. Prüfe CRM API-Token (sollte gültig sein)
3. Prüfe Webhook-Payload in Zapier History
4. Prüfe CRM Custom Fields (sollten existieren)

### Problem: E-Mail-Bestätigung kommt nicht an
**Lösung:**
1. Prüfe Spam-Ordner
2. Prüfe Zapier Gmail/Outlook Verbindung
3. Prüfe E-Mail-Template in Zapier
4. Teste mit anderer E-Mail-Adresse

---

## 🚀 Nächste Schritte

Nach dem Quick Start:

1. **Google Search Console einrichten** (siehe GOOGLE_SEARCH_CONSOLE_SETUP.md)
2. **Google My Business erstellen** (für lokale Rankings)
3. **Lokale Verzeichnisse aktualisieren** (Gelbe Seiten, Handwerkskammer)
4. **Backlinks aufbauen** (Branchenverzeichnisse, Pressemitteilungen)
5. **SEO optimieren** (Meta-Tags, Content, interne Links)

---

## 📞 Support

Bei Fragen:
- **Google Analytics**: https://support.google.com/analytics/
- **Zapier**: https://zapier.com/help/
- **HubSpot**: https://knowledge.hubspot.com/
- **Pipedrive**: https://support.pipedrive.com/

---

## 🎉 Glückwunsch!

Deine Lead-Automatisierungs-Plattform ist jetzt aktiv. Die Website wird automatisch:

- Besucher tracken
- Leads erfassen
- In CRM übertragen
- Bestätigungs-E-Mails senden
- Daten in Google Sheets sichern

**Viel Erfolg beim Lead-Generieren!** 🚀
