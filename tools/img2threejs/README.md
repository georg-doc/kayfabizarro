# KFB img2threejs · Arbeitsbereich

**Status:** EXPERIMENTAL · Stand 2026-09-18  
**Owner:** Georg / KFB  
**Ablage dieser Arbeit:** `georg-doc/kayfabizarro/tools/img2threejs/`  
**Aktueller Kandidat:** Kölner Dom, Viewer v0.1.0; ursprüngliche Modellgeometrie unverändert.

Dieser Ordner führt die Arbeit aus dem Webchat additiv weiter. Er ist kein Fork und keine Installation des externen Projekts `img2threejs/img2threejs`. Der bisherige Dom wurde im Chat von Hand als prozeduraler Three.js-Code aufgebaut, **nicht** mit der img2threejs-Pipeline erzeugt.

## Öffnen

- [Browser-Einstieg](index.html) — bei Auslieferung über einen statischen Webhost.
- [Dom · v0.1 · HTML-Quelltext](prototypes/koelner-dom/v0.1/index.html) — in GitHub über **Download raw file** herunterladen, dann im Browser öffnen. Internetzugriff auf `unpkg.com` wird benötigt.
- [Unverändertes Chat-Original](archive/2026-09-18/koelner_dom_lowpoly_threejs.html) — ARCHIVED HISTORY; enthält einen bekannten Importfehler.
- [Living Doc / Entscheidungen / nächste Schritte](docs/LIVING_IMG2THREEJS.md).
- [Additives Changelog](CHANGELOG.md).
- [Prüfbericht](evidence/2026-09-18/TEST_REPORT.md) und [maschinelle Quellprüfungen](evidence/2026-09-18/static-checks.json).

**GitHub zeigt HTML als Quelltext, nicht als laufenden 3D-Viewer.** Ein öffentliches Deployment ist mit dieser Ablage noch nicht bestätigt. Für die heruntergeladene Einzeldatei ist kein eigener Build-Schritt vorgesehen; ihr tatsächlicher Browserstart bleibt zu prüfen.

## Ordner

```text
img2threejs/
  README.md                         Einstieg und Recovery
  CHANGELOG.md                      additive Historie
  index.html                        schlanker Browser-Einstieg
  docs/LIVING_IMG2THREEJS.md         Umfang, Herkunft, Entscheidungen, offene Punkte
  prototypes/koelner-dom/v0.1/       aktueller HTML-Kandidat
  archive/2026-09-18/                unverändertes Chat-Original
  tests/check_static.py             reproduzierbare Quellprüfungen
  evidence/2026-09-18/               tatsächliche Testergebnisse und Grenzen
```

## Recovery für den nächsten Chat

1. Zuerst [`skills/chat/START_HERE.md`](../../skills/chat/START_HERE.md), Registry und relevante SOP-/Sync-Regeln aktuell lesen.
2. Danach dieses README, Living Doc, letzte Changelog-Einträge und Prüfbericht lesen.
3. GitHub-Stand vor Änderungen prüfen. Dateien unter `archive/` nicht korrigieren; Nachfolger separat anlegen.
4. Nächster konkreter Schritt: v0.1 in einem Browser mit freigegebenem Netzwerkzugriff rendern und echte Ansichten sichern. Erst danach die erkennbaren Geometrieprobleme in einem neuen Kandidaten bearbeiten.
5. Änderungen und Belege additiv dokumentieren. `IMPLEMENTATION`, `TESTED RESULT` und Georgs visuelle Abnahme nicht gleichsetzen.

## Grenzen und Zuständigkeiten

Vorhandene GitHub-Assets zuerst wiederverwenden. Dieser experimentelle Authoring-Bereich ersetzt weder Asset Librarian noch ToolBox, World oder Race. Eine spätere Übernahme in die ToolBox ist **PROPOSAL**, kein integriertes Ergebnis. Die Race-Implementierungs-SSOT bleibt `georg-doc/KFB-Stunt-Car-Race`.

Dropbox wurde am 2026-09-18 mit dem exakten Suchbegriff `img2threejs` geprüft: keine Treffer. Es wurden dort keine Dateien verändert oder neue Parallelablagen angelegt.
