# Aktive Facility Management Lead-Automatisierungs-Strategie

## ðŸŽ¯ Ziel
VollstÃ¤ndig automatisierte Lead-Erfassung, -Verarbeitung und -Verwaltung ohne manuelle Eingriffe.

---

## ðŸ“Š Tracking-Architektur

### Google Analytics 4 Events

```
Event: call_click
â”œâ”€ Trigger: Telefon-Button geklickt
â”œâ”€ Parameter: page_path, button_location
â””â”€ Ziel: Anrufe tracken

Event: whatsapp_click
â”œâ”€ Trigger: WhatsApp-Button geklickt
â”œâ”€ Parameter: page_path, button_location
â””â”€ Ziel: WhatsApp-Anfragen tracken

Event: form_submit
â”œâ”€ Trigger: Kontaktformular abgesendet
â”œâ”€ Parameter: page_path, form_type, service_type
â””â”€ Ziel: Formular-Conversions tracken

Event: scroll_depth
â”œâ”€ Trigger: 25%, 50%, 75%, 100% gescrollt
â”œâ”€ Parameter: page_path, scroll_percentage
â””â”€ Ziel: Engagement messen
```

---

## ðŸ”„ Lead-Flow

```
Website
  â”œâ”€ Telefon-Klick
  â”‚  â”œâ”€ GA Event: call_click
  â”‚  â””â”€ Tracking: Umami
  â”‚
  â”œâ”€ WhatsApp-Klick
  â”‚  â”œâ”€ GA Event: whatsapp_click
  â”‚  â””â”€ Tracking: Umami
  â”‚
  â””â”€ Formular-Submission
     â”œâ”€ GA Event: form_submit
     â”œâ”€ Tracking: Umami
     â”œâ”€ Webhook â†’ Zapier
     â”‚  â”œâ”€ â†’ HubSpot/Pipedrive (CRM)
     â”‚  â”œâ”€ â†’ E-Mail (BestÃ¤tigung + intern)
     â”‚  â”œâ”€ â†’ Google Sheets (Backup)
     â”‚  â””â”€ â†’ WhatsApp (optional)
     â””â”€ Datenbank-Speicherung (lokal)
```

---

## ðŸ” DSGVO-Compliance

### Cookie Consent Banner
- Opt-In fÃ¼r Analytics
- Opt-In fÃ¼r Marketing
- Opt-Out mÃ¶glich
- Cookie-Speicherung

### Datenschutz
- Formular-Daten verschlÃ¼sselt
- Keine Tracking ohne Consent
- DatenschutzerklÃ¤rung aktualisiert
- Impressum aktualisiert

---

## ðŸ’¼ CRM-Integration (HubSpot oder Pipedrive)

### Webhook-Struktur

```json
{
  "contact": {
    "name": "Max Mustermann",
    "email": "max@example.de",
    "phone": "+49 123 456789",
    "company": "Musterfirma GmbH",
    "location": "Frankfurt am Main",
    "service_type": "BÃ¼roreinigung",
    "cleaning_interval": "wÃ¶chentlich",
    "object_size": "1000-5000 mÂ²",
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

## ðŸ¤– Zapier-Automatisierungen

### Automation 1: Formular â†’ CRM
```
Trigger: Website Formular abgesendet
â”œâ”€ Webhook empfangen
â”œâ”€ Daten validieren
â”œâ”€ Lead in CRM erstellen
â””â”€ BestÃ¤tigung senden
```

### Automation 2: Formular â†’ E-Mail
```
Trigger: Website Formular abgesendet
â”œâ”€ BestÃ¤tigungs-E-Mail an Kunde
â”œâ”€ Interne Benachrichtigung an Team
â””â”€ Automatische Antwort
```

### Automation 3: Formular â†’ Google Sheets
```
Trigger: Website Formular abgesendet
â”œâ”€ Neue Zeile in Google Sheets
â”œâ”€ Alle Kontaktdaten speichern
â””â”€ Backup-Funktion
```

### Automation 4: Formular â†’ WhatsApp (optional)
```
Trigger: Website Formular abgesendet
â”œâ”€ WhatsApp-Nachricht an Team
â”œâ”€ Lead-Details
â””â”€ Schnelle Reaktion ermÃ¶glichen
```

---

## ðŸ“ˆ Tracking-Metriken

### Wichtigste KPIs
- **Conversion Rate**: Formular-Submissions / Seitenaufrufe
- **Call Rate**: Telefon-Klicks / Seitenaufrufe
- **WhatsApp Rate**: WhatsApp-Klicks / Seitenaufrufe
- **Lead Quality**: Leads mit vollstÃ¤ndigen Daten / Gesamt-Leads
- **Response Time**: Zeit bis erste Antwort

### Dashboards
- Google Analytics: Echtzeit-Conversions
- HubSpot/Pipedrive: Lead-Pipeline
- Google Sheets: Backup & Analyse

---

## ðŸ”— Google Search Console

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

## ðŸ“‹ Lead-Qualifizierung

### Formular-Felder (erweitert)
1. **Name** (Pflicht)
2. **Telefon** (Pflicht)
3. **E-Mail** (Pflicht)
4. **Ort** (Pflicht) - Dropdown/Autocomplete
5. **Leistung** (Pflicht) - Dropdown
6. **Reinigungsintervall** (Pflicht) - Dropdown
7. **ObjektgrÃ¶ÃŸe** (Optional) - Dropdown
8. **Nachricht** (Optional) - Text

### Lead-Score
- VollstÃ¤ndige Daten: +10 Punkte
- Telefon vorhanden: +5 Punkte
- E-Mail vorhanden: +5 Punkte
- Ort in Zielregion: +10 Punkte
- Leistung definiert: +5 Punkte

---

## ðŸ§ª Testing-Checklist

- [ ] GA Events werden korrekt gesendet
- [ ] Cookie Consent funktioniert
- [ ] Formular-Submission triggert Webhook
- [ ] CRM-Lead wird erstellt
- [ ] E-Mail-BestÃ¤tigung kommt an
- [ ] Google Sheets wird aktualisiert
- [ ] WhatsApp-Nachricht kommt an (optional)
- [ ] Datenschutz ist DSGVO-konform
- [ ] Mobile-Ansicht funktioniert
- [ ] Ladezeit ist optimiert

---

## ðŸ“Š Erfolgs-Metriken

Nach Implementierung sollten folgende Metriken gemessen werden:

1. **Lead-Volumen**: Leads pro Woche
2. **Lead-QualitÃ¤t**: % mit vollstÃ¤ndigen Daten
3. **Conversion-Rate**: Seitenaufrufe â†’ Leads
4. **Response-Time**: Zeit bis erste Antwort
5. **Close-Rate**: Leads â†’ Kunden
6. **ROI**: Umsatz / Akquisitionskosten

---

## ðŸš€ Skalierung

FÃ¼r Zukunft vorbereitet:
- Mehrsprachigkeit (DE, EN)
- Mehrere Standorte
- Unterschiedliche Leistungen
- A/B-Testing
- Dynamische Preisberechnung
- Automatische Angebotsgenerierung

