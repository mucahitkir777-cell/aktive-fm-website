# SEO & Meta Architecture

## Zuständigkeiten
- `client/src/lib/seo.ts`
  - Zentrale Routine `applyPageSeo(...)` für:
    - `title`
    - `meta[name="description"]`
    - `canonical`
    - `og:url`, `og:title`, `og:description`
    - `twitter:title`, `twitter:description`
- `client/src/components/CompanyMeta.tsx`
  - Route-Fallback für Seiten ohne eigene SEO-Setzung.
  - Setzt immer `canonical`/`og:url` konsistent zur Route.
  - Behandelt `/404` und unbekannte Routen als 404-Fallback.
  - Überschreibt keine SEO für CMS-/Regionalrouten.

## Seiten mit eigener SEO-Setzung
- CMS-/Kernseiten via `applyPageSeo(...)`:
  - `/`
  - `/leistungen`
  - `/ueber-uns`
  - `/kontakt`
  - `/faq`
- Statische Seiten via `applyPageSeo(...)`:
  - `/impressum`
  - `/datenschutz`
- Regionale Seiten:
  - `client/src/pages/Region.tsx` setzt SEO über `applyPageSeo(...)` mit routebezogenem `path`.

## Fallback-Verhalten (`CompanyMeta.tsx`)
- Greift nur für Routen ohne eigene Setzung.
- Regionalrouten (aus `companyConfig.regions` + `companyConfig.regionalServiceRoutes`) sind ausgenommen.
- Adminrouten werden nicht als 404 behandelt; 404-Fallback gilt für echte unbekannte Frontend-Routen.

## Structured-Data Einbindung
- `CompanyStructuredData`:
  - global in `App.tsx` eingebunden (siteweite Company-Entity).
- `ServiceStructuredData`:
  - eingebunden in `pages/Leistungen.tsx`.
- `RegionalServiceStructuredData`:
  - eingebunden in `pages/Region.tsx` bei regionalen Service-Seiten.
- `FAQPageStructuredData`:
  - eingebunden in `pages/FAQ.tsx`.

## Konsistenzregeln
- `@id`-Anker für Company: `https://aktive-fm.de#organization`.
- `provider`/`publisher` in JSON-LD referenzieren diese globale Company-Entity.
- Canonical und `og:url` folgen immer der aktuellen Route (bzw. `/404` bei unbekannten Routen).
