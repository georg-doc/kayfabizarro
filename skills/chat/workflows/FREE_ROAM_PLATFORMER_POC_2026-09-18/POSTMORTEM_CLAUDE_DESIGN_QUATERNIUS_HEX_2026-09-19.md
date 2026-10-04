# Post-mortem · Claude Design · Quaternius/Platformer- und Hex-Baukasten-Fehlläufe

**Datum:** 2026-09-19  
**Status:** PRE-EXPORT FAILURE REVIEW · kein vollständiger technischer Befund ohne Code-Export  
**Quelle:** Georgs Bericht über drei fehlgeschlagene Platformer-/Quaternius-Anläufe und der am 19.09.2026 übergebene Screenshot des Projekts „Hex Assets Worldbuilding“.  
**Aktueller Kandidat im Screenshot:** „HEX-BAUKASTEN S0 · Bestand · Bauteile · Regeln · Generator“  
**Owner:** bestehende Atlas-/ToolBox-/World-Authoring-Linie; keine neue Runtime.

## Kurzurteil

Der aktuelle Stand ist **kein wertloser Totalschaden**, aber er ist auch keine belastbare Baukasten- oder Generatorbasis.

Im Screenshot sind ein funktionierender 3D-Viewer, UI-Struktur, mehrere echte Assetfamilien und ein Ansatz zur ehrlichen Fehleranzeige erkennbar. Gleichzeitig liest sich das Terrain als gestapelte beziehungsweise ringförmig verteilte Sammlung einzelner Teile, nicht als sicher verstandener, geschlossen anschließender Baukasten. Sichtbare Abstände, harte Höhensprünge, isolierte Plattformstücke und unklare Supportbeziehungen bleiben bestehen.

Nach drei teuren Anläufen ist eine weitere Korrekturrunde innerhalb derselben Grundlage nicht sinnvoll. Der nächste Schritt ist **vollständige Bergung und ein kleiner Beweis**, nicht ein vierter großer Generatorversuch.

## Evidenzgrenze

Belegt durch den Screenshot:

- eine 23-seitige Claude-Design-Arbeitsfläche existiert;
- die Oberfläche trennt „Bestand“, „Bauteile“, „Regeln“ und „Generator“;
- echte 3D-Assets werden gerendert;
- Hex-/Plattformteile verschiedener Formen und Höhen, Wege, Steine, Bäume und ein Landmark-Bauteil sind sichtbar;
- Teile liegen in mehreren getrennten beziehungsweise gestuften Gruppen;
- die Arbeitsnotiz meldet weiterhin Fälle ohne passendes Teilsechseck und harte Kanten;
- Claude Design befindet sich erneut in einer „Found issues — fixing…“-Schleife.

Von Georg berichtet, aber ohne exportierten Code noch nicht technisch nachprüfbar:

- drei Platformer-/Quaternius-Anläufe sind als Baukasten-/Mentalmodell-Ergebnis gescheitert;
- der Prozess verbraucht unverhältnismäßig viel Claude-Design-Quote.

Nicht belegt:

- exakte Assetpfade, Packrevisionen und Mischungsverhältnisse;
- korrekte oder falsche Pivots;
- tatsächliche Anschluss- und Generatorregeln;
- Grounding, Kollision oder Begehbarkeit;
- Konsolenfehler;
- Vollständigkeit des Codes;
- Reproduzierbarkeit eines Seeds.

## Was wahrscheinlich wiederverwendbar ist

Vorbehaltlich des Exports:

| Teil | vorläufiger Status | Begründung |
|---|---|---|
| UI mit vier Arbeitsstufen | REUSE_CANDIDATE | verständliche Trennung von Bestand, Regeln und Generator |
| Viewer, Kamera und Grundbeleuchtung | REUSE_CANDIDATE | Szene ist lesbar und Assets werden dargestellt |
| Assetloader/-liste | NEEDS_ISOLATED_TEST | reale Modelle erscheinen, Vollständigkeit unbekannt |
| Mess- oder Fremdmaß-Hinweise | REUSE_CANDIDATE | richtige Richtung: Abweichungen sichtbar lassen |
| Fehler-/Fallback-Bericht | REUSE_CANDIDATE | besser als unpassende Geometrie still einzusetzen |
| aktuelle Terrainkomposition | ARCHIVED_FAILED | keine belastbare visuelle Baukastengrundlage |
| aktuelle Generatorregeln | REJECTED_FOUNDATION | dürfen erst nach Asset- und Anschlussbeweis weiterverwendet werden |
| einzelne manuelle Offsets | UNKNOWN | ohne Messkontext keine übertragbare Regel |

## Fehlermuster

### 1. Der Generator kam vor dem bestätigten Mentalmodell

Die Oberfläche enthält bereits einen Generator, während der Screenshot zugleich ungelöste Teilsechseck-, Padding- und Höhensprungfälle zeigt. Damit wird eine unsichere Annahme vervielfacht.

**Lehre:** Kein Generator vor einer kleinen, gemessenen Anschlussgrammatik.

### 2. „Asset sichtbar“ wurde zu früh mit „Baukasten verstanden“ verwechselt

Ein korrekt geladenes GLB kann trotzdem die falsche Rolle, Drehung, Zelle, Höhe oder Nachbarschaft haben.

**Lehre:** Identität, Maße, Pivot, Supportfläche, Außenkante und zulässige Nachbarn getrennt belegen.

### 3. Pack-Logik wurde aus Namen und Einzelbildern rekonstruiert

Claude Design ist gut in visueller Variation, aber hier wird eine konkrete modulare Sprache benötigt. Ohne Atlas und Referenzrekonstruktion entstehen plausible, jedoch nicht packtreue Stapel.

**Lehre:** Erst alle relevanten Teile katalogisieren, dann eine kleine Quellen-Preview nachbauen.

### 4. Lokale Reparaturen verdecken den fehlenden gemeinsamen Rahmen

Padding, Streuung, harte Kanten und einzelne Höhen werden nacheinander behandelt. Dadurch entstehen viele Korrekturen, aber keine gemeinsame Einheit für Raster, Höhe und Anschluss.

**Lehre:** Eine einzige gemessene Transform-/Rasterkonvention; Abweichler bleiben ausdrücklich Ausnahmen.

### 5. Kein früher Stop-/Exportpunkt

Nach mehreren fehlgeschlagenen Kompositionen wird weiter im selben Projekt repariert. Das bindet Quote und gefährdet die brauchbaren Codeanteile.

**Lehre:** Nach zwei wirkungslosen Reparaturen Recovery-Modus; vollständiger Export vor der nächsten Idee.

## Auftrag für den jetzigen Claude-Design-Chat

Das allgemeine Template anwenden:

`skills/chat/templates/CLAUDE_DESIGN_FAILURE_RECOVERY_EXPORT.md`

Gewünschter Dateiname:

`KFB_Hex_Platformer_FAILURE_RECOVERY_EXPORT_2026-09-19_r1.zip`

Zusätzlich zum allgemeinen Paket bitte sichern:

```text
source/
  alle 23 aktuellen Seiten/Dateien beziehungsweise deren echte Quellen
  alle gemeinsam verwendeten Module
  aktuellen Bestand-/Bauteile-/Regeln-/Generator-Stand

data/
  asset-catalog.*
  module-rules.*
  generator-config.*
  seeds.*
  transforms.*
  browser-state.*

docs/
  POSTMORTEM.md
  ATTEMPT_LOG.md
  PACK_SOURCE_MAP.md
  ASSET_TRUTH.md
  MODULE_GRAMMAR.md
  SALVAGE_MAP.md
  NEXT_GATE.md
  TEST_REPORT.md

evidence/
  final-current-state.png
  screenshots-attempt-1/
  screenshots-attempt-2/
  screenshots-attempt-3/
```

Wenn die 23 „pages“ keine getrennten Quelldateien sind, muss das Manifest erklären, wo ihr editierbarer Zustand tatsächlich gespeichert ist.

## Nächster Versuch: klein und beweisbar

### Gate 0 · Export

Der vollständige aktuelle Stand startet außerhalb von Claude Design oder die nicht portierbare Abhängigkeit ist exakt benannt.

### Gate 1 · Asset Truth

Für höchstens zwölf repräsentative Bauteile:

- exakter Pack-/Dateipfad;
- Maße, Pivot und Boden-/Oberkante;
- Rolle: Zentrum, Rand, Ecke, Stütze, Deko oder Landmark;
- zulässige Drehungen;
- belegte kompatible Nachbarn.

Noch kein Generator.

### Gate 2 · Drei-Teil-Anschlussprobe

Eine kleine Kombination aus genau drei Teilen:

- gleiche Rasterbasis;
- keine ungeklärte Lücke oder Überlappung;
- verständliche Außenkante;
- gemessene Lauf-/Supportfläche;
- Seitenansicht und Draufsicht als Beleg.

### Gate 3 · Eine Quellen-Preview

Eine kleine, referenzgeführte Pack-Komposition nachbauen. Kein KFB-Hub, keine Residents, keine Portale und kein Gameplay.

### Gate 4 · Erst dann Regeln/Generator

Die bestätigten Rollen und Anschlüsse als Daten. Der Generator darf nur Kombinationen erzeugen, die Gate 2 unabhängig besteht.

## Ein nächster Prüfpunkt

**Kann der exportierte Stand außerhalb von Claude Design genau eine gemessene Drei-Teil-Plattform ohne ungeklärte Lücke, Überlappung oder schwebende Supportbeziehung reproduzieren?**

Vor diesem PASS kein vierter großer Baukasten- oder Inselversuch.
