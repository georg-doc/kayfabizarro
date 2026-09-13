# RETURN.md — KFB/MED Deck Viewer

Nach `skills/chat/workflows/handover-return.md`.

**Repository / Branch / Commit:** kein eigenes Repo — Claude-Design-Projekt
"PDF Viewer für Comic Card Decks". Korpus + Assets referenzieren
`georg-doc/kayfabizarro`@main live per RAW-URL (kein lokaler Commit-Pin nötig,
da nur gelesen, nie geschrieben).

**Was geändert wurde:**
- Full View (6. Ansicht) in v4 hinzugefügt, siehe `CHANGELOG.md` 2026-08-04.
- Standalone-Single-File-Build für v4 erzeugt.
- `HOUSEKEEPING.md` und `CLAUDE.md` nachgezogen.

**Owner/Contracts unverändert:**
- `deckviewer/*.js` bleiben geteiltes Modul-SSOT für v3 UND v4 — nicht dupliziert.
- v3 (`KFB Deck Viewer v3.dc.html`) bleibt Georgs eingefrorene Referenz, nicht angefasst.
- Layout bleibt arithmetisch abgeleitet (kein CV), Card-Mode = Center-Cut + Regler,
  nur CSS+Canvas, Paper-Theme default, Modul single-file vanilla JS ohne Build-Step —
  siehe `uploads/KAYFABIZARRO_VIEWER_HANDOVER.md` §0, weiterhin bindend.

**Tests / Environment:**
- Manuell im Claude-Design-Preview-iframe geprüft: Boot → Korpus (130 Decks / 1914 Seiten) →
  alle sechs Ansichten → Full-View-Scroll/Klick/Doppelklick → Kopfzeile-Breakpoints →
  Standalone-Build lädt und rendert. Kein automatisierter Testlauf, kein echter Browser
  außerhalb der Sandbox.

**Offene visuelle/menschliche Gates:**
- Georgs Freeplay-Abnahme auf Full View (Scroll-Gefühl, Deckkraft-Wert 60 %,
  Breakpoint-Werte 1120/900/620) steht noch aus.
- Kein Cross-Browser-Check (nur Sandbox-Chromium).

**DEFERRED / bekannte Baseline-Lücken:**
- `worlds_fair_conspiracy.pdf` ungeklärt (kein Match in der aktuellen Registry, siehe CHANGELOG 2026-09-13).
- Standalone-Build bleibt netzabhängig (pdf.js-CDN + Live-Korpus) — volle Offline-Fassung
  mit eingebetteten PDFs wäre ein separater, deutlich schwererer Export.
- v1-Zweig (`KFB Deck Viewer.dc.html`, `kfb-viewer.js`) bleibt SUPERSEDED, aber nicht gelöscht.

**Evidenz:** keine Screenshots in diesem Re-Home-Export (bewusst ausgeschlossen, siehe Anfrage).
Ein Abnahme-Screenshot wurde im Chat gezeigt, nicht als Datei abgelegt.

**Nächster sicherer Wiedereinstiegspunkt:**
`KFB Deck Viewer v4.dc.html` öffnen, Clean-Run-Checkliste in `HOUSEKEEPING.md` abarbeiten,
dann Georgs Freeplay-Feedback zu Full View einholen.
