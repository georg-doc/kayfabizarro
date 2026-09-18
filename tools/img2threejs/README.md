# KFB img2threejs · Arbeitsbereich

**Status:** EXPERIMENTAL · Stand 2026-09-18  
**Owner:** Georg / KFB  
**Ablage dieser Arbeit:** `georg-doc/kayfabizarro/tools/img2threejs/`  
**Aktueller Kandidat:** Kölner Dom v0.2.0 — Geometriekorrektur bei erhaltenem Low-Poly-Stil.  
**Prüfstand:** 53/53 statische/numerische Dachprüfungen; neuer Browserrender und Georgs Abnahme offen.

Dieser Ordner führt die Arbeit aus dem Webchat additiv weiter. Er ist kein Fork und keine Installation des externen Projekts `img2threejs/img2threejs`. Der bisherige Dom wurde im Chat von Hand als prozeduraler Three.js-Code aufgebaut, **nicht** mit der img2threejs-Pipeline erzeugt.

## Öffnen

- [Browser-Einstieg](index.html) — bei Auslieferung über einen statischen Webhost.
- [Dom · v0.2 · HTML-Quelltext](prototypes/koelner-dom/v0.2/index.html) — aktueller Kandidat. In GitHub über **Download raw file** herunterladen, dann im Browser öffnen. Internetzugriff auf `unpkg.com` wird benötigt.
- [Dom · v0.1 · vorheriger Viewer](prototypes/koelner-dom/v0.1/index.html) — unveränderte Vergleichsfassung; Dachfehler durch Georgs Screenshot gemeldet.
- [Unverändertes Chat-Original](archive/2026-09-18/koelner_dom_lowpoly_threejs.html) — ARCHIVED HISTORY; enthält einen bekannten Importfehler.
- [Living Doc / Entscheidungen / nächste Schritte](docs/LIVING_IMG2THREEJS.md).
- [Additives Changelog](CHANGELOG.md).
- [Aktueller v0.2-Prüfbericht](evidence/2026-09-18-v0.2/TEST_REPORT.md) und [Dachprüfungen](evidence/2026-09-18-v0.2/geometry-checks.json).
- [Historischer v0.1-Prüfbericht](evidence/2026-09-18/TEST_REPORT.md) und [damalige Quellprüfungen](evidence/2026-09-18/static-checks.json).

**GitHub zeigt HTML als Quelltext, nicht als laufenden 3D-Viewer.** Ein öffentliches Deployment ist mit dieser Ablage noch nicht bestätigt. Für die heruntergeladene Einzeldatei ist kein eigener Build-Schritt vorgesehen. Georgs Screenshot belegt einen sichtbaren vorherigen Viewer, aber keine korrekte Geometrie; der neue v0.2-Browserstart bleibt unabhängig davon zu prüfen.

## Aktueller Umfang

v0.2 ersetzt die liegenden Dachpyramiden durch geschlossene Dachprismen und ein verbundenes Kreuzdach. Strebewerk, Auflagen kleiner Spitzen, Grundplatte und einige Außenflächen sind korrigiert. Hauptturm-Dimensionen, einfache Materialien und Beleuchtung bleiben erhalten. Bedienelemente liegen außerhalb der 3D-Fläche.

Das ist eine Reparatur des einfachen Modells, keine hochauflösende Neumodellierung. Die zehn Dächer benötigen zusammen 86 Dreiecke. Die vollständige Quellrechnung des Modellbudgets und sämtliche Prüfgrenzen stehen im aktuellen Bericht.

## Ordner

```text
img2threejs/
  README.md                         Einstieg und Recovery
  CHANGELOG.md                      additive Historie
  index.html                        Browser-Einstieg mit getrennten Versionen
  docs/LIVING_IMG2THREEJS.md         Herkunft, Entscheidungen, offene Punkte
  prototypes/koelner-dom/v0.2/       aktueller Geometriekandidat
  prototypes/koelner-dom/v0.1/       unveränderte Vergleichsfassung
  archive/2026-09-18/                unverändertes Chat-Original
  tests/check_roofs_v02.mjs          aktuelle numerische Dachprüfungen
  tests/check_static.py             historische v0.1-Quellprüfungen
  evidence/2026-09-18-v0.2/          neue Testergebnisse und Grenzen
  evidence/2026-09-18/               frühere Testergebnisse unverändert
```

## Recovery für den nächsten Chat

1. Zuerst [`skills/chat/START_HERE.md`](../../skills/chat/START_HERE.md), Registry und relevante SOP-/Sync-Regeln aktuell lesen.
2. Danach dieses README, Living Doc, letzte Changelog-Einträge und aktuellen Prüfbericht lesen.
3. GitHub-Stand vor Änderungen prüfen. Original und v0.1 nicht korrigieren; sie bleiben Vergleichsbelege.
4. Nächster konkreter Schritt: v0.2 im Browser prüfen — Front, Seite, Rückseite, freie Drehung; Dachanschlüsse, aufliegende Spitzen und freie Sicht auf das Modell beurteilen.
5. Änderungen und Belege additiv dokumentieren. `IMPLEMENTATION`, `TESTED RESULT` und Georgs visuelle Abnahme nicht gleichsetzen. Numerische Prüfung für einen ausführenden Agenten: im Arbeitsordner `node tests/check_roofs_v02.mjs`; keine Terminalaufgabe für Georg.

## Grenzen und Zuständigkeiten

Vorhandene GitHub-Assets zuerst wiederverwenden. Dieser experimentelle Authoring-Bereich ersetzt weder Asset Librarian noch ToolBox, World oder Race. Eine spätere Übernahme in die ToolBox ist **PROPOSAL**, kein integriertes Ergebnis. Die Race-Implementierungs-SSOT bleibt `georg-doc/KFB-Stunt-Car-Race`.

Dropbox wurde am 2026-09-18 bei der Erstablage mit dem exakten Suchbegriff `img2threejs` geprüft: keine Treffer. Es wurden dort keine Dateien verändert oder neue Parallelablagen angelegt. Für v0.2 wurde keine neue Dropbox-Prüfung oder Synchronisierung behauptet.
