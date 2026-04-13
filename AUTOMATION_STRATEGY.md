# ProClean Lead-Automatisierungs-Strategie

## 🎯 Ziel
Vollständig automatisierte Lead-Erfassung, -Verarbeitung und -Verwaltung ohne manuelle Eingriffe.

---

## 📊 Tracking-Architektur

### Google Analytics 4 Events

```
Event: call_click
├─ Trigger: Telefon-Button geklickt
├─ Parameter: page_path, button_location
└─ Ziel: Anrufe tracken

Event: whatsapp_click
├─ Trigger: WhatsApp-Button geklickt
├─ Parameter: page_path, button_location
└─ Ziel: WhatsApp-Anfragen tracken

Event: form_submit
├─ Trigger: Kontaktformular abgesendet
├─ Parameter: page_path, form_type, service_type
└─ Ziel: Formular-Conversions tracken

Event: scroll_depth
├─ Trigger: 25%, 50%, 75%, 100% gescrollt
├─ Parameter: page_path, scroll_percentage
└─ Ziel: Engagement messen
```

---

## 🔄 Lead-Flow

```
Website
  ├─ Telefon-Klick
  │  ├─ GA Event: call_click
  │  └─ Tracking: Umami
  │
  ├─ WhatsApp-Klick
  │  ├─ GA Event: whatsapp_click
  │  └─ Tracking: Umami
  │
  └─ Formular-Submission
     ├─ GA Event: form_submit
     ├─ Tracking: Umami
     ├─ Webhook → Zapier
     │  ├─ → HubSpot/Pipedrive (CRM)
     │  ├─ → E-Mail (Bestätigung + intern)
     │  ├─ → Google Sheets (Backup)
     │  └─ → WhatsApp (optional)
     └─ Datenbank-Speicherung (lokal)
```

---

## 🔐 DSGVO-Compliance

### Cookie Consent Banner
- Opt-In für Analytics
- Opt-In für Marketing
- Opt-Out möglich
- Cookie-Speicherung

### Datenschutz
- Formular-Daten verschlüsselt
- Keine Tracking ohne Consent
- Datenschutzerklärung aktualisiert
- Impressum aktualisiert

---

## 💼 CRM-Integration (HubSpot oder Pipedrive)

### Webhook-Struktur

```json
{
  "contact": {
    "name": "Max Mustermann",
    "email": "max@example.de",
    "phone": "+49 123 456789",
    "company": "Musterfirma GmbH",
    "location": "Frankfurt am Main",
    "service_type": "Büroreinigung",
    "cleaning_interval": "wöchentlich",
    "object_size": "1000-5000 m²",
    "source": "website_form",
    "created_at": "2026-04-12T21:30:00Z"
  }
}
```

### HubSpot Integration
- Contact erstellen
- Deal erstellen (Status: "New Lead")
- Automatische Zuweisung zu Vertrieb
- E-Mail-Sequenz starten

### Pipedrive Integration
- Person erstellen
- Deal erstellen (Stage: "Incoming Lead")
- Automatische Benachrichtigung
- Activity-Log aktualisieren

---

## 🤖 Zapier-Automatisierungen

### Automation 1: Formular → CRM
```
Trigger: Website Formular abgesendet
├─ Webhook empfangen
├─ Daten validieren
├─ Lead in CRM erstellen
└─ Bestätigung senden
```

### Automation 2: Formular → E-Mail
```
Trigger: Website Formular abgesendet
├─ Bestätigungs-E-Mail an Kunde
├─ Interne Benachrichtigung an Team
└─ Automatische Antwort
```

### Automation 3: Formular → Google Sheets
```
Trigger: Website Formular abgesendet
├─ Neue Zeile in Google Sheets
├─ Alle Kontaktdaten speichern
└─ Backup-Funktion
```

### Automation 4: Formular → WhatsApp (optional)
```
Trigger: Website Formular abgesendet
├─ WhatsApp-Nachricht an Team
├─ Lead-Details
└─ Schnelle Reaktion ermöglichen
```

---

## 📈 Tracking-Metriken

### Wichtigste KPIs
- **Conversion Rate**: Formular-Submissions / Seitenaufrufe
- **Call Rate**: Telefon-Klicks / Seitenaufrufe
- **WhatsApp Rate**: WhatsApp-Klicks / Seitenaufrufe
- **Lead Quality**: Leads mit vollständigen Daten / Gesamt-Leads
- **Response Time**: Zeit bis erste Antwort

### Dashboards
- Google Analytics: Echtzeit-Conversions
- HubSpot/Pipedrive: Lead-Pipeline
- Google Sheets: Backup & Analyse

---

## 🔗 Google Search Console

### Anforderungen
- Sitemap eingereicht
- robots.txt validiert
- Canonical Tags gesetzt
- Schema.org Markup vorhanden
- Mobile-Friendly validiert

### Monitoring
- Indexierungsstatus
- Core Web Vitals
- Ranking-Keywords
- Fehler & Warnings

---

## 📋 Lead-Qualifizierung

### Formular-Felder (erweitert)
1. **Name** (Pflicht)
2. **Telefon** (Pflicht)
3. **E-Mail** (Pflicht)
4. **Ort** (Pflicht) - Dropdown/Autocomplete
5. **Leistung** (Pflicht) - Dropdown
6. **Reinigungsintervall** (Pflicht) - Dropdown
7. **Objektgröße** (Optional) - Dropdown
8. **Nachricht** (Optional) - Text

### Lead-Score
- Vollständige Daten: +10 Punkte
- Telefon vorhanden: +5 Punkte
- E-Mail vorhanden: +5 Punkte
- Ort in Zielregion: +10 Punkte
- Leistung definiert: +5 Punkte

---

## 🧪 Testing-Checklist

- [ ] GA Events werden korrekt gesendet
- [ ] Cookie Consent funktioniert
- [ ] Formular-Submission triggert Webhook
- [ ] CRM-Lead wird erstellt
- [ ] E-Mail-Bestätigung kommt an
- [ ] Google Sheets wird aktualisiert
- [ ] WhatsApp-Nachricht kommt an (optional)
- [ ] Datenschutz ist DSGVO-konform
- [ ] Mobile-Ansicht funktioniert
- [ ] Ladezeit ist optimiert

---

## 📊 Erfolgs-Metriken

Nach Implementierung sollten folgende Metriken gemessen werden:

1. **Lead-Volumen**: Leads pro Woche
2. **Lead-Qualität**: % mit vollständigen Daten
3. **Conversion-Rate**: Seitenaufrufe → Leads
4. **Response-Time**: Zeit bis erste Antwort
5. **Close-Rate**: Leads → Kunden
6. **ROI**: Umsatz / Akquisitionskosten

---

## 🚀 Skalierung

Für Zukunft vorbereitet:
- Mehrsprachigkeit (DE, EN)
- Mehrere Standorte
- Unterschiedliche Leistungen
- A/B-Testing
- Dynamische Preisberechnung
- Automatische Angebotsgenerierung
