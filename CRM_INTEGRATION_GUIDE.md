# Aktive Facility Management CRM-Integration Guide

## ðŸŽ¯ Ziel
Automatische Lead-Erfassung und -Verwaltung in HubSpot oder Pipedrive Ã¼ber Zapier-Webhooks.

---

## ðŸ“‹ Option 1: HubSpot Integration

### 1. HubSpot Setup

#### Schritt 1: Private App erstellen
1. Gehe zu **Settings** â†’ **Integrations** â†’ **Private Apps**
2. Klicke auf **Create app**
3. Name: `Aktive Facility Management Website Leads`
4. Gib folgende Scopes ein:
   - `crm.objects.contacts.write`
   - `crm.objects.contacts.read`
   - `crm.objects.deals.write`
   - `crm.objects.deals.read`

#### Schritt 2: Access Token kopieren
- Kopiere den **Access Token** (wird spÃ¤ter in Zapier verwendet)

### 2. Webhook-Struktur fÃ¼r HubSpot

```json
{
  "properties": {
    "firstname": "Max",
    "lastname": "Mustermann",
    "email": "max@example.de",
    "phone": "+49 123 456789",
    "company": "Musterfirma GmbH",
    "city": "Frankfurt am Main",
    "lifecyclestage": "lead",
    "hs_lead_status": "NEW",
    "custom_service_type": "buero",
    "custom_cleaning_interval": "weekly",
    "custom_object_size": "medium",
    "notes": "Website-Anfrage vom 12.04.2026"
  }
}
```

### 3. Deal erstellen in HubSpot

```json
{
  "properties": {
    "dealname": "Mücahit Kir - BÃ¼roreinigung Frankfurt am Main",
    "dealstage": "negotiation",
    "pipeline": "default",
    "amount": 0,
    "hubspot_owner_id": 123456,
    "description": "Anfrage: BÃ¼roreinigung in Frankfurt am Main, wÃ¶chentlich, 1000-5000 mÂ²"
  }
}
```

---

## ðŸ”„ Option 2: Pipedrive Integration

### 1. Pipedrive Setup

#### Schritt 1: API Token generieren
1. Gehe zu **Settings** â†’ **Personal Preferences** â†’ **API**
2. Kopiere deinen **API Token**

#### Schritt 2: Custom Fields erstellen
In Pipedrive mÃ¼ssen folgende Custom Fields erstellt werden:

| Field Name | Type | Beschreibung |
|---|---|---|
| `cleaning_service` | Dropdown | Art der Reinigung |
| `cleaning_interval` | Dropdown | Reinigungsintervall |
| `object_size` | Dropdown | ObjektgrÃ¶ÃŸe |
| `source_channel` | Text | Lead-Quelle (Website) |

### 2. Webhook-Struktur fÃ¼r Pipedrive

```json
{
  "name": "Mücahit Kir",
  "email": [
    {
      "value": "max@example.de",
      "primary": true
    }
  ],
  "phone": [
    {
      "value": "+49 123 456789",
      "primary": true
    }
  ],
  "org_id": null,
  "custom_fields": {
    "cleaning_service": "buero",
    "cleaning_interval": "weekly",
    "object_size": "medium",
    "source_channel": "website"
  },
  "notes": "Website-Anfrage: BÃ¼roreinigung in Frankfurt am Main"
}
```

### 3. Deal erstellen in Pipedrive

```json
{
  "title": "Mücahit Kir - BÃ¼roreinigung Frankfurt am Main",
  "person_id": 12345,
  "pipeline_id": 1,
  "stage_id": 1,
  "expected_close_time": "2026-05-12",
  "value": 0,
  "currency": "EUR",
  "notes": "Anfrage: BÃ¼roreinigung in Frankfurt am Main, wÃ¶chentlich, 1000-5000 mÂ²"
}
```

---

## ðŸ¤– Zapier-Automatisierung

### Automation 1: Formular â†’ CRM (HubSpot)

**Trigger:** Website Webhook (Formular-Submission)

**Action 1:** HubSpot - Create or Update Contact
```
- Email: {{form_email}}
- First Name: {{form_name}} (First Part)
- Last Name: {{form_name}} (Last Part)
- Phone: {{form_phone}}
- Company: {{form_company}}
- City: {{form_city}}
- Custom Field (Service): {{form_service}}
- Custom Field (Interval): {{form_interval}}
- Custom Field (Size): {{form_object_size}}
```

**Action 2:** HubSpot - Create Deal
```
- Deal Name: {{form_name}} - {{form_service}} {{form_city}}
- Pipeline: Default
- Stage: Negotiation
- Contact: {{contact_id}} (vom vorherigen Schritt)
- Description: Website-Anfrage vom {{today}}
```

### Automation 2: Formular â†’ E-Mail (BestÃ¤tigung)

**Trigger:** Website Webhook (Formular-Submission)

**Action:** Gmail/Outlook - Send Email
```
To: {{form_email}}
Subject: Vielen Dank fÃ¼r Ihre Anfrage â€“ Aktive Facility Management
Body:
---
Hallo {{form_name}},

vielen Dank fÃ¼r Ihre Anfrage. Wir haben folgende Informationen erhalten:

Leistung: {{form_service}}
Ort: {{form_city}}
Intervall: {{form_interval}}
ObjektgrÃ¶ÃŸe: {{form_object_size}}

Wir prÃ¼fen Ihre Anfrage und melden uns innerhalb von 24 Stunden mit einem individuellen Angebot.

Beste GrÃ¼ÃŸe,
Aktive Facility Management Team
---
```

### Automation 3: Formular â†’ Google Sheets (Backup)

**Trigger:** Website Webhook (Formular-Submission)

**Action:** Google Sheets - Create Spreadsheet Row
```
Columns:
- Timestamp: {{timestamp}}
- Name: {{form_name}}
- Email: {{form_email}}
- Phone: {{form_phone}}
- Company: {{form_company}}
- City: {{form_city}}
- Service: {{form_service}}
- Interval: {{form_interval}}
- Size: {{form_object_size}}
- Message: {{form_message}}
- Source: website
```

### Automation 4: Formular â†’ WhatsApp (Intern)

**Trigger:** Website Webhook (Formular-Submission)

**Action:** WhatsApp Business - Send Message
```
To: +49 123 456789 (Team-Nummer)
Message:
---
ðŸ”” Neue Lead-Anfrage!

Name: {{form_name}}
E-Mail: {{form_email}}
Telefon: {{form_phone}}
Leistung: {{form_service}}
Ort: {{form_city}}
Intervall: {{form_interval}}

Link zum CRM: [HubSpot/Pipedrive Link]
---
```

---

## ðŸ”— Webhook-URL fÃ¼r Website

Die Website sendet Formulardaten an diese Zapier-Webhook-URL:

```
https://hooks.zapier.com/hooks/catch/YOUR_ZAPIER_ID/YOUR_WEBHOOK_KEY
```

### Webhook-Payload-Format

```json
{
  "name": "Mücahit Kir",
  "email": "max@example.de",
  "phone": "+49 123 456789",
  "company": "Musterfirma GmbH",
  "city": "Frankfurt am Main",
  "service": "buero",
  "interval": "weekly",
  "objectSize": "medium",
  "message": "Weitere Informationen...",
  "timestamp": "2026-04-12T21:30:00Z",
  "source": "website"
}
```

---

## ðŸ§ª Testing

### 1. Webhook testen
```bash
curl -X POST https://hooks.zapier.com/hooks/catch/YOUR_ZAPIER_ID/YOUR_WEBHOOK_KEY \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.de",
    "phone": "+49 123 456789",
    "company": "Test GmbH",
    "city": "Frankfurt am Main",
    "service": "buero",
    "interval": "weekly",
    "objectSize": "medium",
    "message": "Test-Anfrage"
  }'
```

### 2. CRM-Lead prÃ¼fen
- Gehe zu HubSpot/Pipedrive
- Suche nach "Test User"
- Verifiziere, dass alle Daten korrekt Ã¼bertragen wurden

### 3. E-Mail-BestÃ¤tigung prÃ¼fen
- PrÃ¼fe dein E-Mail-Postfach
- Verifiziere, dass die BestÃ¤tigungs-E-Mail angekommen ist

---

## ðŸ“Š Monitoring & Troubleshooting

### Zapier Dashboard
- Gehe zu **Zaps** â†’ **History**
- PrÃ¼fe auf Fehler oder fehlgeschlagene Executions
- Klicke auf eine Execution um Details zu sehen

### HÃ¤ufige Fehler

| Fehler | LÃ¶sung |
|---|---|
| "Invalid API Token" | API Token in Zapier aktualisieren |
| "Contact already exists" | Zapier auf "Update" statt "Create" setzen |
| "Missing required field" | Webhook-Payload prÃ¼fen und fehlende Felder hinzufÃ¼gen |
| "Rate limit exceeded" | Zapier Delay-Action hinzufÃ¼gen (2-3 Sekunden) |

---

## ðŸ”’ Sicherheit

### API Token Schutz
- Speichere API Tokens **nie** im Code
- Verwende **Umgebungsvariablen** oder **Secret Management**
- Rotiere Tokens regelmÃ¤ÃŸig (alle 90 Tage)

### Webhook-Sicherheit
- Verwende **HTTPS** nur
- Implementiere **Webhook-Verification** (Optional)
- Rate-Limiting aktivieren

---

## ðŸ“ˆ Lead-Scoring in CRM

### HubSpot Lead Score
```
+10 Punkte: VollstÃ¤ndige Kontaktdaten
+5 Punkte: Telefon vorhanden
+5 Punkte: E-Mail vorhanden
+10 Punkte: Ort in Zielregion
+5 Punkte: Leistung definiert
+5 Punkte: Intervall definiert
```

### Pipedrive Deal Value
```
Basis: â‚¬0 (Lead)
+â‚¬500: Nach erstem Kontakt
+â‚¬2.000: Nach Angebot
+â‚¬5.000: Nach Angebots-Annahme
```

---

## ðŸš€ NÃ¤chste Schritte

1. **CRM auswÃ¤hlen** (HubSpot oder Pipedrive)
2. **API Token generieren** und sicher speichern
3. **Zapier-Automationen erstellen** (siehe oben)
4. **Webhook-URL** in Website-Code integrieren
5. **Testing durchfÃ¼hren** mit Test-Leads
6. **Live-Schaltung** und Monitoring
7. **RegelmÃ¤ÃŸige ÃœberprÃ¼fung** der Lead-QualitÃ¤t

---

## ðŸ“ž Support

Bei Fragen zu CRM-Integration:
- HubSpot: https://knowledge.hubspot.com/
- Pipedrive: https://support.pipedrive.com/
- Zapier: https://zapier.com/help/

