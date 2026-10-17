# Backlog & To-dos — KayfaBizarro Viewer / Gameplay Stage

Stand Session-Cut v1. Priorisiert; jedes Item ist eigenständig umsetzbar.

## P1 — als Nächstes

- [ ] **Batch-Check über alle ~200 Deck-JSONs** (Handover §17): Skript liest nur `cardCount`/`pageCount`/`coverScore` aller JSONs im `decks`-Ordner (lokal gemountet) und erzeugt die „needs-review"-Liste, ohne ein PDF zu öffnen. Output: Markdown-Tabelle Deck → Status → Rekonziliations-Hypothese (Cover-Flip ja/nein).
- [ ] **Export-Modul (v2, §19):** PNG-Einzelexport (`getCardCanvas` existiert), Mehrfachauswahl → ZIP (JSZip/CDN), Karten-PDF (jede Karte eine Seite, pdf-lib/CDN). On-demand-Hi-Res (~300 DPI) rendern statt Screen-Auflösung. Kein Bleed/Schnittmarken (bewusst out of scope).
- [ ] **GitHub-Pairing verifizieren:** Discovery gegen das echte Repo laufen lassen; Pairing-Heuristik (Namensbasis) an realen Dateinamen prüfen, ggf. `sourceFile`-basiertes Pairing ergänzen (JSON laden, `sourceFile` matchen).

## P2 — danach

- [ ] **Agent-Story-Loop in der Stage:** `window.claude.complete` liest `KFBStageContext`, erzählt Story-Beats zu gespielten Karten, schlägt nächste Karte/Slot vor (Skill „Claude API in prototypes"). UI: Erzähl-Feed neben dem Tisch.
- [ ] **Per-Deck-Karten-Mapping für Irregulärdecks:** World's Fair braucht eine `cardIndex → (page, cell)`-Map (JSON-Reihenfolge ≠ Seitenreihenfolge). Format definieren (z. B. optionales `layoutMap` im Deck-Pref-Storage), manuell für World's Fair pflegen.
- [ ] **Stage: Upload-Decks in den Pool** (aktuell nur die 8 vorverdrahteten) + optional GitHub-Pool.
- [ ] **pdf.js einbetten** für echtes Offline-Standalone (aktuell CDN nötig; Worker als Blob-URL).
- [ ] **Asymmetrische Ränder**, falls `offset` in der Praxis nicht reicht (margin-top ≠ margin-bottom). API-kompatibel erweitern.
- [ ] **Karten-Thumbnails im Picker** (Stage): Mini-Canvas statt Textliste, lazy.

## P3 — später / nice to have

- [ ] Standalone-Build-Skript versionieren (aktuell: `super_inline_html` + fetch-Shim-Inject per Hand, s. Doku §5).
- [ ] Alle 8 Decks im Standalone, sobald >20-MB-Dateien möglich sind (oder Split-Archiv).
- [ ] Session-Persistenz der Stage (Tischzustand in localStorage).
- [ ] Print-Sheets aus der Stage (gespielte Karten als Handout).
- [ ] `RAF`-Semantik mit Georg klären (korreliert mit Backmatter-Seiten? → Resolver-Hinweis).
- [ ] MedKayfab: PDFs und JSONs derselben Edition zusammenführen (aktuell WEB_v1-PDF vs. ADD-web-JSON).
- [ ] Viewer: Deck-übergreifende Suche über Kartennamen (JSONs sind ja da).

## Erledigt in v1 (Referenz)

- Modul nach Handover §0–§15 inkl. DoD-Checks (Reading-Order an Deck B visuell verifiziert)
- needs-review-Fallback + manueller Override (Cover-Flip-Suggestion, Force-Grid)
- Gutter-Regler + **Offset/Shift X/Y** (Erweiterung wg. Header-Bannern)
- Wheel/Trackpad/Pinch/Keyboard komplett; Daten-API + `loadDeck()` headless
- Gameplay Stage (Quest/3 Scenes/Actor, D6-Tracker, Picker, `KFBStageContext`)
- Standalone-Builds mit 4 eingebetteten Decks
