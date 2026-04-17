# Aktive Facility Management Google Search Console Setup Guide

## ðŸŽ¯ Ziel
Website in Google Search Console registrieren, indexieren und SEO-Performance monitoren.

---

## ðŸ“‹ Schritt 1: Website in GSC registrieren

### 1.1 Google Search Console Ã¶ffnen
- Gehe zu https://search.google.com/search-console
- Melde dich mit deinem Google-Konto an

### 1.2 Property hinzufÃ¼gen
1. Klicke auf **+ Property hinzufÃ¼gen**
2. WÃ¤hle **URL-PrÃ¤fix**
3. Gib ein: `https://www.aktive-fm.de`
4. Klicke **Weiter**

### 1.3 Ownership verifizieren
WÃ¤hle eine Verifizierungsmethode:

#### Option A: HTML-Datei (empfohlen)
1. Lade die HTML-Datei herunter
2. Speichere sie unter `/client/public/google-verification.html`
3. Klicke **Verifizieren**

#### Option B: HTML-Tag (schneller)
1. Kopiere den Meta-Tag
2. FÃ¼ge ihn in `client/index.html` ein (im `<head>`):
```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```
3. Klicke **Verifizieren**

#### Option C: Google Analytics
Wenn Google Analytics bereits installiert:
1. WÃ¤hle **Google Analytics**
2. Klicke **Verifizieren**

---

## ðŸ“Š Schritt 2: Sitemap einreichen

### 2.1 Sitemap-URL
Deine Sitemap ist bereits unter:
```
https://www.aktive-fm.de/sitemap.xml
```

### 2.2 Sitemap in GSC einreichen
1. Gehe zu **Sitemaps** (im linken MenÃ¼)
2. Klicke **Sitemap hinzufÃ¼gen**
3. Gib ein: `sitemap.xml`
4. Klicke **Senden**

### 2.3 Sitemap-Status prÃ¼fen
- Warte 24-48 Stunden
- PrÃ¼fe den Status unter **Sitemaps**
- Sollte zeigen: "Erfolgreich" mit Anzahl der eingereichten URLs

---

## ðŸ¤– Schritt 3: robots.txt validieren

### 3.1 robots.txt prÃ¼fen
Deine robots.txt ist unter:
```
https://www.aktive-fm.de/robots.txt
```

### 3.2 Inhalt der robots.txt
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: https://www.aktive-fm.de/sitemap.xml
```

### 3.3 robots.txt in GSC testen
1. Gehe zu **URL-Inspektion** (oben)
2. Gib ein: `https://www.aktive-fm.de/`
3. Klicke **Testen**
4. PrÃ¼fe: "Robots.txt erlaubt das Crawlen"

---

## ðŸ” Schritt 4: URL-Inspektion & Indexierung

### 4.1 Einzelne URLs prÃ¼fen
1. Gehe zu **URL-Inspektion**
2. Gib eine URL ein: `https://www.aktive-fm.de/leistungen`
3. Klicke **Enter**

**Sollte zeigen:**
- âœ… "URL ist in Google Index"
- âœ… "Robots.txt erlaubt das Crawlen"
- âœ… "Robots.txt blockiert keine Ressourcen"

### 4.2 URL indexieren lassen
Wenn URL nicht indexiert:
1. Klicke **Indexierung anfordern**
2. Google wird die URL in die Warteschlange einreihen
3. Warte 24-48 Stunden

### 4.3 Alle URLs indexieren
1. Gehe zu **Sitemaps**
2. Klicke auf deine Sitemap
3. Klicke **Indexierungsstatus anfordern**

---

## âš™ï¸ Schritt 5: Core Web Vitals prÃ¼fen

### 5.1 Core Web Vitals anzeigen
1. Gehe zu **Core Web Vitals** (im linken MenÃ¼)
2. PrÃ¼fe die Metriken:
   - **LCP** (Largest Contentful Paint): < 2,5 Sekunden
   - **FID** (First Input Delay): < 100 Millisekunden
   - **CLS** (Cumulative Layout Shift): < 0,1

### 5.2 Probleme beheben
Wenn Metriken schlecht:
1. Gehe zu **PageSpeed Insights**: https://pagespeed.web.dev/
2. Gib deine URL ein
3. Folge den Empfehlungen

**HÃ¤ufige Optimierungen:**
- Bilder komprimieren
- JavaScript minimieren
- CSS-Dateien optimieren
- Caching aktivieren

---

## ðŸ“ˆ Schritt 6: Performance & Keywords monitoren

### 6.1 Performance-Bericht
1. Gehe zu **Performance** (im linken MenÃ¼)
2. PrÃ¼fe:
   - **Clicks**: Anzahl der Klicks in Suchergebnissen
   - **Impressions**: Wie oft deine Website angezeigt wurde
   - **CTR**: Click-Through-Rate
   - **Position**: Durchschnittliche Ranking-Position

### 6.2 Top Keywords
1. Gehe zu **Performance**
2. Filtere nach **Queries**
3. PrÃ¼fe deine Top-Keywords:
   - "BÃ¼roreinigung Frankfurt"
   - "GebÃ¤udereinigung Kreis Offenbach"
   - "Glasreinigung"

### 6.3 Ranking-Verbesserung
Wenn Keywords schlecht ranken:
1. PrÃ¼fe die Seite (URL-Inspektion)
2. Optimiere Meta-Tags
3. Verbessere Content-QualitÃ¤t
4. Baue interne Links auf

---

## ðŸ”— Schritt 7: Backlinks & externe Links

### 7.1 Backlinks prÃ¼fen
1. Gehe zu **Links** (im linken MenÃ¼)
2. PrÃ¼fe:
   - **Top verlinkte Seiten**: Welche Seiten am meisten verlinkt sind
   - **Top verlinkte Websites**: Welche Domains zu dir linken
   - **Ankertexte**: Welche Texte in Links verwendet werden

### 7.2 Backlinks aufbauen
Strategien:
- Branchenverzeichnisse (Gelbe Seiten, Handwerkskammer)
- Lokale Verzeichnisse (Google My Business)
- Pressemitteilungen
- GastbeitrÃ¤ge auf relevanten Blogs

---

## âš ï¸ Schritt 8: Fehler & Warnungen beheben

### 8.1 Coverage-Bericht
1. Gehe zu **Coverage** (im linken MenÃ¼)
2. PrÃ¼fe auf Fehler:
   - ðŸ”´ **Fehler**: URLs kÃ¶nnen nicht gecrawlt werden
   - ðŸŸ¡ **Warnung**: URLs mit Problemen
   - ðŸŸ¢ **GÃ¼ltig**: URLs funktionieren korrekt

### 8.2 HÃ¤ufige Fehler beheben

| Fehler | Ursache | LÃ¶sung |
|---|---|---|
| 404 Not Found | Seite existiert nicht | URL in Sitemap entfernen |
| Robots.txt blockiert | robots.txt blockiert Crawling | robots.txt aktualisieren |
| Redirect-Fehler | Zu viele Redirects | Redirect-Kette vereinfachen |
| Mobile Usability | Mobile-Probleme | Mobile-Design verbessern |

### 8.3 Fehler einreichen
Nach Behebung:
1. Klicke **Validierung anfordern**
2. Google prÃ¼ft die URL erneut
3. Fehler sollten nach 24-48 Stunden behoben sein

---

## ðŸ“± Schritt 9: Mobile Usability

### 9.1 Mobile-Test
1. Gehe zu **Mobile Usability** (im linken MenÃ¼)
2. PrÃ¼fe auf Probleme:
   - Text zu klein
   - Buttons zu nah beieinander
   - Viewport nicht konfiguriert
   - Flash-Inhalte

### 9.2 Mobile-Optimierung
PrÃ¼fe in `client/index.html`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
```

Stelle sicher:
- âœ… Responsive Design
- âœ… Touch-Buttons > 48px
- âœ… Lesbare SchriftgrÃ¶ÃŸe (> 16px)
- âœ… Kein Horizontal-Scrollen

---

## ðŸ” Schritt 10: Sicherheit & HTTPS

### 10.1 HTTPS-Status prÃ¼fen
1. Gehe zu **Sicherheitsprobleme** (im linken MenÃ¼)
2. Sollte zeigen: "Keine Probleme erkannt"

### 10.2 HTTPS erzwingen
In deiner Website-Konfiguration:
- Alle URLs sollten mit `https://` beginnen
- HTTP â†’ HTTPS Redirect aktivieren
- SSL-Zertifikat gÃ¼ltig

---

## ðŸ“Š Schritt 11: RegelmÃ¤ÃŸiges Monitoring

### WÃ¶chentliche Checks
- [ ] Performance-Bericht prÃ¼fen
- [ ] Neue Keywords identifizieren
- [ ] CTR-Trends analysieren

### Monatliche Checks
- [ ] Core Web Vitals prÃ¼fen
- [ ] Coverage-Fehler beheben
- [ ] Backlinks analysieren
- [ ] Ranking-Positionen vergleichen

### Quartalsweise Checks
- [ ] SEO-Strategie Ã¼berprÃ¼fen
- [ ] Content-Gaps identifizieren
- [ ] Neue Keywords recherchieren
- [ ] Konkurrenz-Analyse durchfÃ¼hren

---

## ðŸŽ¯ SEO-Ziele fÃ¼r Aktive Facility Management

### Kurzfristig (3 Monate)
- [ ] Alle Seiten indexiert
- [ ] Keine Coverage-Fehler
- [ ] Core Web Vitals "Gut"
- [ ] 10 Top-Keywords identifiziert

### Mittelfristig (6 Monate)
- [ ] Top-10 Rankings fÃ¼r "BÃ¼roreinigung Frankfurt"
- [ ] 50+ Backlinks von relevanten Domains
- [ ] 100+ monatliche organische Clicks
- [ ] CTR > 3%

### Langfristig (12 Monate)
- [ ] Top-3 Rankings fÃ¼r Haupt-Keywords
- [ ] 200+ Backlinks
- [ ] 500+ monatliche organische Clicks
- [ ] CTR > 5%
- [ ] Organischer Traffic > 30% des Gesamt-Traffic

---

## ðŸ”— NÃ¼tzliche Links

- **Google Search Console**: https://search.google.com/search-console
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
- **Google Analytics**: https://analytics.google.com/
- **Google My Business**: https://business.google.com/

---

## ðŸ’¡ Best Practices

### On-Page SEO
- âœ… Unique Meta-Titles (50-60 Zeichen)
- âœ… Unique Meta-Descriptions (150-160 Zeichen)
- âœ… H1-Tag pro Seite
- âœ… Keyword-Dichte 1-2%
- âœ… Interne Links (3-5 pro Seite)

### Off-Page SEO
- âœ… Backlinks von relevanten Domains
- âœ… Lokale Verzeichnisse
- âœ… Social Media Signals
- âœ… Brand Mentions

### Technisches SEO
- âœ… Sitemap.xml
- âœ… robots.txt
- âœ… Schema.org Markup
- âœ… Mobile-Friendly
- âœ… HTTPS
- âœ… Fast Loading Speed
- âœ… Structured Data

---

## ðŸ“ž Support

Bei Fragen:
- Google Search Console Help: https://support.google.com/webmasters/
- SEO Starter Guide: https://developers.google.com/search/docs/beginner/seo-starter-guide

