# Public Route SEO Status

## Seiten mit eigener SEO-Setzung
- `/ueber-uns`
  - `applyPageSeo(...)` in `client/src/pages/UeberUns.tsx`
- `/kontakt`
  - `applyPageSeo(...)` in `client/src/pages/Kontakt.tsx`
- `/impressum`
  - `applyPageSeo(...)` in `client/src/pages/Impressum.tsx`
- `/datenschutz`
  - `applyPageSeo(...)` in `client/src/pages/Datenschutz.tsx`

## Weitere Seiten mit eigener SEO-Setzung
- `/`
- `/leistungen`
- `/faq`
- Regionale Seiten aus `companyConfig.regions` und `companyConfig.regionalServiceRoutes`
  - SEO in `client/src/pages/Region.tsx` über `applyPageSeo(...)`

## Fallback über `CompanyMeta.tsx`
- Greift nur, wenn eine Route keine eigene SEO setzt.
- Ausgenommen vom Fallback:
  - CMS-/Kernseiten: `/`, `/leistungen`, `/ueber-uns`, `/faq`, `/kontakt`, `/impressum`, `/datenschutz`
  - Regionale Routen aus `companyConfig`
- `/404` und unbekannte Frontend-Routen erhalten 404-Fallback-Meta.

## Indexierbarkeit (öffentlich)
- Öffentliche Hauptseiten und regionale Zielseiten sind indexierbar.
- Admin-Routen (`/admin`, `/admin/*`) sind über `robots.txt` ausgeschlossen.
