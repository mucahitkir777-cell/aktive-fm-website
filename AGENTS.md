# AGENTS.md

## Arbeitsregeln für dieses Repository

1. Keine unnötigen globalen UI-Änderungen vornehmen.
   Globale Styles, Design Tokens, Layout-Grids und wiederverwendete UI-Klassen nur ändern, wenn die Aufgabe es zwingend erfordert.

2. Erst analysieren, dann planen, dann implementieren.
   Vor Änderungen die betroffenen Seiten, Komponenten, Datenstrukturen und bestehenden Integrationen prüfen. Danach einen konkreten, nachvollziehbaren Plan formulieren.

3. Änderungen modular und nachvollziehbar halten.
   Neue Logik gehört in klar benannte Module oder bestehende passende Komponenten. Keine verstreuten Sonderfälle, keine schwer nachvollziehbaren Inline-Lösungen.

4. Bestehende Komponenten bevorzugen.
   Vor dem Bau neuer UI oder Logik prüfen, ob vorhandene Komponenten, Hooks, Datenstrukturen oder Hilfsmodule erweitert werden können.

5. Keine unkontrollierten Automationen.
   Externe Dienste, Tracking-Ziele, CRM-Webhooks, Heatmaps, Analytics oder wiederkehrende Jobs nur über klare Konfiguration, Platzhalter und bewusste Aktivierung anbinden.

6. Tracking, SEO, Consent und CRM sauber trennen.
   Tracking-Events, SEO-Metadaten, Consent-Entscheidungen und CRM-/Lead-Übergaben dürfen nicht vermischt werden. Jede Schicht muss separat wartbar bleiben.

7. Alle geänderten Dateien am Ende jeder Aufgabe dokumentieren.
   Die Abschlussnotiz muss aufführen, welche Dateien geändert wurden und warum. Relevante Prüfungen oder nicht ausführbare Prüfungen müssen ebenfalls genannt werden.

8. Mobile und Tablet dürfen nicht verschlechtert werden.
   Änderungen müssen responsive Layouts respektieren. Keine CTAs, Formulare, Sticky-Elemente oder Textblöcke einbauen, die auf kleinen Viewports überlaufen oder bestehende Bedienbarkeit verschlechtern.
