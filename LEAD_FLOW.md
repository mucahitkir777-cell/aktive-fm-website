# Lead Flow

## Ziel

Kontakt- und Quick-Lead-Formulare erfassen Leads nicht mehr per Fake-Success.
Eine Erfolgsmeldung wird nur angezeigt, wenn der interne Lead-Endpunkt die Anfrage validiert und mindestens ein Provider sie angenommen hat.

## Architektur

```
QuickContactForm
  -> shared/lead.ts Validation
  -> client/src/lib/leads/submit.ts
  -> POST /api/leads
  -> server/leads/adapters.ts
  -> local inbox / webhook / CRM / email
```

## Datenmodell und Validierung

Das zentrale Lead-Modell liegt in `shared/lead.ts`.
Es validiert:

- Name
- Telefonnummer
- E-Mail
- Region oder Einsatzort
- gewünschte Leistung
- Datenschutz-Zustimmung
- optionale B2B-Felder wie Firma, Objektgröße, Reinigungsintervall und Nachricht

Die Validierung wird clientseitig vor dem Submit und serverseitig am API-Endpunkt ausgeführt.

## Transport

Der Client sendet Leads an:

```
VITE_LEAD_API_ENDPOINT=/api/leads
```

Der Server verarbeitet Leads über:

- `local_inbox`: schreibt validierte Leads in `./data/leads.jsonl`
- `webhook`: vorbereitet, standardmäßig deaktiviert
- `crm`: vorbereitet, standardmäßig deaktiviert
- `email`: vorbereitet, standardmäßig deaktiviert

Ohne externe Zugangsdaten bleibt `local_inbox` aktiv. Das ist die kontrollierte Annahmestelle und ersetzt die frühere Fake-Success-Logik.

## Tracking

Die Formulare senden:

- `form_start`
- `form_submit`
- `form_success`
- `form_error`

Der Kontext enthält:

- `page_path`
- `page_type`
- Region / Einsatzort
- Leistung
- Geräteklasse
- UTM-Parameter, soweit vorhanden

## Externe Anschlüsse

Spätere Live-Integrationen werden ausschließlich über Konfiguration aktiviert:

```env
LEAD_WEBHOOK_ENABLED=true
LEAD_WEBHOOK_ENDPOINT=https://...

LEAD_CRM_ENABLED=true
LEAD_CRM_ENDPOINT=https://...
LEAD_CRM_PROVIDER=hubspot

LEAD_EMAIL_ENABLED=true
LEAD_EMAIL_ENDPOINT=https://...
LEAD_EMAIL_PROVIDER=placeholder
```

Keine dieser Integrationen ist ohne explizite Konfiguration aktiv.

## Datenschutz

Leads werden nur verarbeitet, wenn die Datenschutz-Zustimmung im Formular gesetzt ist.
Die lokale Inbox ist eine technische Übergangsschicht; für Live-Betrieb müssen Löschfristen, Zugriffsschutz und die Datenschutzerklärung final abgestimmt werden.
