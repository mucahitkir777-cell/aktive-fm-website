# ProClean Sitemap & Regionale SEO-Struktur

## Hauptseiten

```
/                           -> Startseite
/leistungen                 -> Leistungen-Übersicht
/ueber-uns                  -> Über uns
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
- `location_interest` Tracking für Seitenbesuch und Regionslinks

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
- vorausgewählte Region und Leistung im Anfrageformular

## Interne Verlinkung

Die Startseite und Kontaktseite beziehen die Zielregionen über `companyConfig.regions`.
Die Regionsseiten verlinken untereinander und verbinden die zentralen Leistungen mit den vorbereiteten Frankfurt-Leistungsseiten.

## Mobile Anforderungen

- StickyBar bleibt unverändert aktiv.
- CTA-Gruppen werden mobil einspaltig und groß dargestellt.
- Keine globale Layout- oder Designstruktur wurde für diese SEO-Erweiterung verändert.

## Pflegehinweis

Neue Regionen oder regionale Leistungsseiten dürfen nicht als Massenstruktur angelegt werden.
Erst wenn Inhalte, Nachfrage und Tracking-Auswertung eine neue Zielseite rechtfertigen, wird ein Eintrag in `companyConfig.regions` oder `companyConfig.regionalServiceRoutes` ergänzt und danach Routing sowie Sitemap aktualisiert.
