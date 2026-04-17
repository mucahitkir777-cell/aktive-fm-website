# Aktive Facility Management Sitemap & Regionale SEO-Struktur

## Hauptseiten

```
/                           -> Startseite
/leistungen                 -> Leistungen-Ãœbersicht
/ueber-uns                  -> Ãœber uns
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
/gebaeudereinigung-mannheim
```

Jede Regionsseite nutzt:

- eigene H1
- eigenen Meta Title
- eigene Meta Description
- regionale Leistungs- und Kontakt-CTAs
- interne Links zu anderen Zielregionen
- `location_interest` Tracking fÃ¼r Seitenbesuch und Regionslinks

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
- vorausgewÃ¤hlte Region und Leistung im Anfrageformular

## Weitere regionale Leistungsseiten

```
/buero-reinigung-mannheim
/unterhaltsreinigung-mannheim
```

## Interne Verlinkung

Die Startseite und Kontaktseite beziehen die Zielregionen Ã¼ber `companyConfig.regions`.
Die Regionsseiten verlinken untereinander und verbinden die zentralen Leistungen mit den vorbereiteten Frankfurt-Leistungsseiten.

## Mobile Anforderungen

- StickyBar bleibt unverÃ¤ndert aktiv.
- CTA-Gruppen werden mobil einspaltig und groÃŸ dargestellt.
- Keine globale Layout- oder Designstruktur wurde fÃ¼r diese SEO-Erweiterung verÃ¤ndert.

## Pflegehinweis

Neue Regionen oder regionale Leistungsseiten dÃ¼rfen nicht als Massenstruktur angelegt werden.
Erst wenn Inhalte, Nachfrage und Tracking-Auswertung eine neue Zielseite rechtfertigen, wird ein Eintrag in `companyConfig.regions` oder `companyConfig.regionalServiceRoutes` ergÃ¤nzt und danach Routing sowie Sitemap aktualisiert.

