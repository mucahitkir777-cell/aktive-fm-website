# ProClean Sitemap & Regionale SEO-Struktur

## Hauptseiten

```
/                           -> Startseite
/leistungen                 -> Leistungen-Uebersicht
/ueber-uns                  -> Ueber uns
/kontakt                    -> Kontaktseite
/faq                        -> FAQ
/impressum                  -> Impressum
/datenschutz                -> Datenschutz
```

## Kuratierte Regionsseiten

Die regionale Struktur ist bewusst klein gehalten und wird zentral in `client/src/config/company.ts` gepflegt.

```
/gebaeudereinigung-frankfurt
/gebaeudereinigung-hanau
/gebaeudereinigung-kreis-offenbach
```

Jede Regionsseite nutzt:

- eigene H1
- eigenen Meta Title
- eigene Meta Description
- regionale Leistungs- und Kontakt-CTAs
- interne Links zu anderen Zielregionen
- `location_interest` Tracking fuer Seitenbesuch und Regionslinks

## Vorbereitete Frankfurt-Leistungsseiten

Diese Seiten sind kuratiert vorbereitet und verwenden dieselbe `Region`-Komponente mit servicebezogenem Kontext.

```
/buero-reinigung-frankfurt
/treppenhausreinigung-frankfurt
/glasreinigung-frankfurt
```

Jede regionale Leistungsseite nutzt:

- servicebezogene H1
- servicebezogenen Meta Title
- servicebezogene Meta Description
- `location_interest` und `service_interest` Tracking
- vorausgewaehlte Region und Leistung im Anfrageformular

## Interne Verlinkung

Die Startseite und Kontaktseite beziehen die Zielregionen ueber `companyConfig.regions`.
Die Regionsseiten verlinken untereinander und verbinden die zentralen Leistungen mit den vorbereiteten Frankfurt-Leistungsseiten.

## Mobile Anforderungen

- StickyBar bleibt unveraendert aktiv.
- CTA-Gruppen werden mobil einspaltig und gross dargestellt.
- Keine globale Layout- oder Designstruktur wurde fuer diese SEO-Erweiterung veraendert.

## Pflegehinweis

Neue Regionen oder regionale Leistungsseiten duerfen nicht als Massenstruktur angelegt werden.
Erst wenn Inhalte, Nachfrage und Tracking-Auswertung eine neue Zielseite rechtfertigen, wird ein Eintrag in `companyConfig.regions` oder `companyConfig.regionalServiceRoutes` ergaenzt und danach Routing sowie Sitemap aktualisiert.
