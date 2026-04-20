# Structured Data Validation (B.2 Final)

## Zu prüfende Routen
- `/`
  - Erwartet: `ProfessionalService` + `LocalBusiness` (globale Company-Entity, `@id: https://aktive-fm.de#organization`)
- `/faq`
  - Erwartet: `FAQPage` mit `Question`/`Answer`
  - plus globale Company-Entity aus `App.tsx`
- `/leistungen`
  - Erwartet: `ItemList` mit `ListItem` und verschachteltem `Service`
  - `Service.provider` verweist auf globale Company-`@id`
- `/buero-reinigung-frankfurt`
  - Erwartet: `LocalBusiness` (globale Company-Entity) + verschachtelter `Service`
- `/glasreinigung-frankfurt`
  - Erwartet: `LocalBusiness` (globale Company-Entity) + verschachtelter `Service`

## Externe Prüfung
1. Route als vollständige URL in den Google Rich Results Test einfügen.
2. Erkennen lassen, welche strukturierten Daten gefunden werden; Fehler/Warnungen prüfen.
3. Dieselbe URL im Schema Markup Validator prüfen.
4. Ergebnisse pro Route kurz dokumentieren (OK / Warnung / Fehler).

## Soll-Check pro Route
- JSON-LD-Script vorhanden.
- Keine leeren Felder (`""`, `null`, leere Arrays bei Kernfeldern).
- `url`-Felder korrekt und zur Route passend.
- `@id`-Verknüpfungen konsistent:
  - `provider` / `publisher` -> `https://aktive-fm.de#organization`
- Keine doppelten FAQ-Einträge auf `/faq`.
