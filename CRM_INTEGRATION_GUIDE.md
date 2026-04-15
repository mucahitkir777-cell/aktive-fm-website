# ProClean CRM-Integration Guide

## 🎯 Ziel
Automatische Lead-Erfassung und -Verwaltung in HubSpot oder Pipedrive über Zapier-Webhooks.

---

## 📋 Option 1: HubSpot Integration

### 1. HubSpot Setup

#### Schritt 1: Private App erstellen
1. Gehe zu **Settings** → **Integrations** → **Private Apps**
2. Klicke auf **Create app**
3. Name: `ProClean Website Leads`
4. Gib folgende Scopes ein:
   - `crm.objects.contacts.write`
   - `crm.objects.contacts.read`
   - `crm.objects.deals.write`
   - `crm.objects.deals.read`

#### Schritt 2: Access Token kopieren
- Kopiere den **Access Token** (wird später in Zapier verwendet)

### 2. Webhook-Struktur für HubSpot

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
    "dealname": "Max Mustermann - Büroreinigung Frankfurt am Main",
    "dealstage": "negotiation",
    "pipeline": "default",
    "amount": 0,
    "hubspot_owner_id": 123456,
    "description": "Anfrage: Büroreinigung in Frankfurt am Main, wöchentlich, 1000-5000 m²"
  }
}
```

---

## 🔄 Option 2: Pipedrive Integration

### 1. Pipedrive Setup

#### Schritt 1: API Token generieren
1. Gehe zu **Settings** → **Personal Preferences** → **API**
2. Kopiere deinen **API Token**

#### Schritt 2: Custom Fields erstellen
In Pipedrive müssen folgende Custom Fields erstellt werden:

| Field Name | Type | Beschreibung |
|---|---|---|
| `cleaning_service` | Dropdown | Art der Reinigung |
| `cleaning_interval` | Dropdown | Reinigungsintervall |
| `object_size` | Dropdown | Objektgröße |
| `source_channel` | Text | Lead-Quelle (Website) |

### 2. Webhook-Struktur für Pipedrive

```json
{
  "name": "Max Mustermann",
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
  "notes": "Website-Anfrage: Büroreinigung in Frankfurt am Main"
}
```

### 3. Deal erstellen in Pipedrive

```json
{
  "title": "Max Mustermann - Büroreinigung Frankfurt am Main",
  "person_id": 12345,
  "pipeline_id": 1,
  "stage_id": 1,
  "expected_close_time": "2026-05-12",
  "value": 0,
  "currency": "EUR",
  "notes": "Anfrage: Büroreinigung in Frankfurt am Main, wöchentlich, 1000-5000 m²"
}
```

---

## 🤖 Zapier-Automatisierung

### Automation 1: Formular → CRM (HubSpot)

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

### Automation 2: Formular → E-Mail (Bestätigung)

**Trigger:** Website Webhook (Formular-Submission)

**Action:** Gmail/Outlook - Send Email
```
To: {{form_email}}
Subject: Vielen Dank für Ihre Anfrage – ProClean
Body:
---
Hallo {{form_name}},

vielen Dank für Ihre Anfrage. Wir haben folgende Informationen erhalten:

Leistung: {{form_service}}
Ort: {{form_city}}
Intervall: {{form_interval}}
Objektgröße: {{form_object_size}}

Wir prüfen Ihre Anfrage und melden uns innerhalb von 24 Stunden mit einem individuellen Angebot.

Beste Grüße,
ProClean Team
---
```

### Automation 3: Formular → Google Sheets (Backup)

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

### Automation 4: Formular → WhatsApp (Intern)

**Trigger:** Website Webhook (Formular-Submission)

**Action:** WhatsApp Business - Send Message
```
To: +49 123 456789 (Team-Nummer)
Message:
---
🔔 Neue Lead-Anfrage!

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

## 🔗 Webhook-URL für Website

Die Website sendet Formulardaten an diese Zapier-Webhook-URL:

```
https://hooks.zapier.com/hooks/catch/YOUR_ZAPIER_ID/YOUR_WEBHOOK_KEY
```

### Webhook-Payload-Format

```json
{
  "name": "Max Mustermann",
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

## 🧪 Testing

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

### 2. CRM-Lead prüfen
- Gehe zu HubSpot/Pipedrive
- Suche nach "Test User"
- Verifiziere, dass alle Daten korrekt übertragen wurden

### 3. E-Mail-Bestätigung prüfen
- Prüfe dein E-Mail-Postfach
- Verifiziere, dass die Bestätigungs-E-Mail angekommen ist

---

## 📊 Monitoring & Troubleshooting

### Zapier Dashboard
- Gehe zu **Zaps** → **History**
- Prüfe auf Fehler oder fehlgeschlagene Executions
- Klicke auf eine Execution um Details zu sehen

### Häufige Fehler

| Fehler | Lösung |
|---|---|
| "Invalid API Token" | API Token in Zapier aktualisieren |
| "Contact already exists" | Zapier auf "Update" statt "Create" setzen |
| "Missing required field" | Webhook-Payload prüfen und fehlende Felder hinzufügen |
| "Rate limit exceeded" | Zapier Delay-Action hinzufügen (2-3 Sekunden) |

---

## 🔒 Sicherheit

### API Token Schutz
- Speichere API Tokens **nie** im Code
- Verwende **Umgebungsvariablen** oder **Secret Management**
- Rotiere Tokens regelmäßig (alle 90 Tage)

### Webhook-Sicherheit
- Verwende **HTTPS** nur
- Implementiere **Webhook-Verification** (Optional)
- Rate-Limiting aktivieren

---

## 📈 Lead-Scoring in CRM

### HubSpot Lead Score
```
+10 Punkte: Vollständige Kontaktdaten
+5 Punkte: Telefon vorhanden
+5 Punkte: E-Mail vorhanden
+10 Punkte: Ort in Zielregion
+5 Punkte: Leistung definiert
+5 Punkte: Intervall definiert
```

### Pipedrive Deal Value
```
Basis: €0 (Lead)
+€500: Nach erstem Kontakt
+€2.000: Nach Angebot
+€5.000: Nach Angebots-Annahme
```

---

## 🚀 Nächste Schritte

1. **CRM auswählen** (HubSpot oder Pipedrive)
2. **API Token generieren** und sicher speichern
3. **Zapier-Automationen erstellen** (siehe oben)
4. **Webhook-URL** in Website-Code integrieren
5. **Testing durchführen** mit Test-Leads
6. **Live-Schaltung** und Monitoring
7. **Regelmäßige Überprüfung** der Lead-Qualität

---

## 📞 Support

Bei Fragen zu CRM-Integration:
- HubSpot: https://knowledge.hubspot.com/
- Pipedrive: https://support.pipedrive.com/
- Zapier: https://zapier.com/help/
