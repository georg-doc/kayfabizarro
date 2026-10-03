# KFB World + Racer + Hub · Konsolidierungs-Masterplan · 2026-09-24

Status: **DRAFT FOR GEORG REVIEW · COORDINATION ONLY**  
Owner: Georg / KFB  
Coordination owner: KFB Web/Work Lead  
Branch: `work/world-racer-hub-masterplan-2026-09-24`

Dieser Plan ergänzt den älteren `skills/chat/LIVING_MASTERPLAN.md`. Er ersetzt keine Projekt-SSOT, keinen Runtime-Owner und keine bestehende Return-Datei. GitHub-Stand und die benannten Returns schlagen Chat-Erinnerung.

## Ergebnis, auf das wir optimieren

Ein kleiner, spielbarer Welt-/Racer-MVP mit konsistentem Maßstab und Look:

1. KFB Hub öffnen.
2. Eine begehbare lokale Region laden.
3. Zu Fuß einen Landmark-/Routenpunkt erreichen.
4. In ein vorhandenes, bewährtes Fahrzeug steigen.
5. Auf einem befahrbaren OSM-/Racer-Korridor fahren.
6. Zurück zum Hub.

Der erste MVP beweist diesen Kernloop mit dem kleinsten funktionierenden Set. Er beweist noch nicht alle Fahrzeuge, Stunts, Wetterlagen, Bewohner, Gebäudeinneren, Gegner oder Minigames.

Bindende Budgetregel:  
`skills/chat/GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md`

## Harte Entscheidungen

### 1. Nur ein Hub

`https://kayfabizarro.pages.dev/kfb-hub/` bleibt die einzige menschliche Produktionsoberfläche.

- Die aktuelle kompakte Production-Desk-Gestaltung wird weitergeführt.
- Es wird keine vierte oder fünfte Hub-Variante gebaut.
- Die bisherige ToolBox-Seite bleibt ein Werkzeugkatalog innerhalb des Hubs, kein konkurrierender Hub.
- Ältere Hub-Ansichten bleiben nur als Archiv/Donor erhalten.
- Der Hub ist Anzeige und Einstieg, kein neuer Game-/Tool-Runtime-Owner.

Öffentlicher Ist-Check am 2026-09-24:

- die Seite öffnet;
- der eingebaute letzte Stand wird angezeigt;
- der Never-empty-Grundgedanke funktioniert;
- der sichtbare Stand ist aber noch nicht vollständig mit den neuesten GitHub-/Dropbox-Slices synchron.

### 2. Ein Datenweg für den Hub

Der Production-Registry-/Desk-Strang wird die einzige operative Datenquelle des Hubs.

Zielweg:

`Projekt-Return / PR-Metadaten → Registry-Snapshot → eingebauter letzter Stand → optional neuerer Live-Stand → Hub`

Pflichtfelder pro Lane:

- Repo;
- Branch;
- PR;
- exakter Head;
- Owner;
- Status;
- direkt nutzbare Review-URL;
- genau ein nächster Gate;
- Zeitpunkt der letzten Prüfung;
- Kennzeichnung `CURRENT | LAST_KNOWN | LOCAL_ONLY | HOLD | CLOSED`.

Never-empty-Vertrag:

- Ein valider eingebauter Snapshot muss immer rendern.
- Ein fehlerhafter, leerer oder unvollständiger Live-Stand darf den eingebauten Stand niemals durch Nullwerte ersetzen.
- Bei Sync-Fehler zeigt der Hub sichtbar „letzter bekannter Stand“ plus Fehlerhinweis.
- Private Cross-Repo-Heads werden nur als aktuell behauptet, wenn sie über einen autorisierten Owner-Write/Dispatch oder einen verifizierten Snapshot angeliefert wurden.
- Kein Browser-Client speichert GitHub-Tokens.

Spätere arbeitsfähige Hub-Erweiterung:

- PASS / TUNE / HOLD lokal markieren;
- Notiz, Link, Text/Markdown oder ZIP als lokales Intake-Paket aufnehmen;
- Ergebnis als JSON/Markdown kopieren oder herunterladen;
- ein Webchat kann dieses Paket in einen kleinen GitHub-Write übersetzen.

Direktes Schreiben aus dem öffentlichen Hub nach GitHub ist erst mit einer sicheren serverseitigen Autorisierung zulässig. Bis dahin gilt: Export statt vorgetäuschtem Sync.

### 3. Coworker schreibt keine ungeprüften Briefings mehr

Claude Coworker darf:

- exakte Heads lesen und Status-Snapshots aktualisieren;
- vorhandene, bereits geprüfte Briefings verlinken;
- Returns und geschlossene Pakete in die Registry übertragen;
- Lücken, Konflikte und fehlende Quellen melden.

Claude Coworker darf nicht:

- neue produktive Briefings selbstständig erfinden;
- World-/Track-/Scale-Entscheidungen setzen;
- Runtime-Owner umdeuten;
- ein `UNREVIEWED`-Briefing als startbereit ausgeben.

Jedes neue Briefing benötigt vor Ausführung:

- einen sichtbaren Reviewer;
- Source-Locks;
- Core Outcome;
- Critical Blockers;
- Quarantinable Issues;
- Human Questions;
- Budget Stop.

### 4. Claude- und Blender-Budget gezielt einsetzen

Claude Design:

- visuelle Komposition, Licht, Farbe, Material-/Shader-Studien und klar abgegrenzte UX;
- immer auf Basis eines vorher geprüften Briefings;
- echter Donor zuerst isoliert sichtbar;
- nach zwei fehlgeschlagenen Reparaturpässen Recovery statt Weiterpatchen;
- kein GitHub-/Runtime-Owner.

Blender MCP:

- gemessene Strecken-/Gebäude-/Resident-Geometrie;
- saubere Module, Pivots, Maße, Kontakte, GLB und Review-Render;
- keine stillen Änderungen an Route, Physik, Kamera oder Game-Ownership.

Webchat:

- kleine Source-Census-, Katalog-, Review-, Dokumentations- und isolierte Proof-Slices;
- ein Repo, ein Branch, ein Ergebnis.

Work/WSA:

- private Repos, Cross-Repo-Integration, Packaging, Deployment, echter Browser-Gate;
- keine lange Asset-, Axis- oder rein visuelle Tuning-Schleife.

Der optionale `game-dev`-Helper ist in dieser Umgebung nicht installiert. Das blockiert diesen Plan nicht; versiegelte Game-Development-Studio-Evidence wird nur verlangt, wenn ein späterer Slice sie ausdrücklich braucht.

## Weltentscheidung: WB-W0 ist der aktuelle Kandidat

Lokale Quelle:

`/CLAUDE/KFB WB-W0 · World Scale + Traversability/SESSION_2026-09-24_WB-W0/WB-W0_2026-09-24/`

Status laut `RETURN.md`:

- Candidate;
- 10/10 Preview-Gates bestanden;
- Georgs Abnahme offen;
- der verworfene WorldBuilder-v1-Ansatz bleibt eingefroren und wird nicht weitergepatcht.

WB-W0 beantwortet die fünf früheren Claude-Fragen bereits ausreichend:

- **Globus/Region:** Globus als Übersicht in eigenem Maßstab; lokale Region als metrische ENU-Welt. Kein erzwungener Mini-Planet-Maßstab.
- **Region:** Köln ist der erste Anker; Hürth bleibt Form-/OSM-Donor und eigener Proof-Strang.
- **Route:** 18,0 m Geometrie im vorhandenen W0-Kandidaten.
- **Landmark:** vorhandener Kenney-/KFB-Billboard-Donor; kein neu erfundener Landmark-Placeholder.
- **Hanggrenze:** 25° Walk-Controller-Grenze aus Rampentest; freigegebene Route deutlich flacher.

### Wichtige Benennungskorrektur

Es existieren zwei widersprüchliche Breitenleitern:

- akzeptierte Racer-Grammatik PR #13:  
  `NARROW 10,8 · STANDARD 14,4 · WIDE 18,0 · HERO 21,6 m`
- C-3/WB-W0-Kontext:  
  `14,4 · 18,0 · 21,6 · 28,8 m` mit verschobenen Labels.

Für neue gemeinsame Verträge gilt die bereits akzeptierte Racer-Grammatik.

Daraus folgt:

- WB-W0s vorhandene 18-m-Route wird **nicht geometrisch geändert**;
- sie wird im gemeinsamen Vertrag als **WIDE** bezeichnet;
- `STANDARD` bleibt 14,4 m;
- 28,8 m ist kein automatisch freigegebener fünfter Standard, sondern eine explizite Sonder-/Legacy-Breite.

## Runtime- und Modul-Owner

- WorldBuilder/WB-W0: lokaler Maßstab, Terrain, begehbarer Korridor, Platzierungszonen.
- OSM/Route-Semantik: reale Route, Zonen und Landmark-Anker.
- Racer C-3: aktuelles Fahren, Fahrzeug, Kamera, Controls und Race-Host.
- RKIT Blender: Streckenprofil-/Stützen-/Bogen-/Böschungs-Module und Messdaten; kein Physik-Owner.
- Travel Globe: späterer globaler Überblick und Übergang; nicht Teil des ersten lokalen MVP.
- Hürth Proofs: Form-/Topologie-Donors; kein zweiter World-Owner.
- Hub: Einstieg, Review und Status; kein Runtime-Owner.

## Aktueller Bestand

| Lane | Exakter Stand | Einordnung |
|---|---|---|
| Production Desk / Hub | PR #193, Branch `chatgpt-web/kfb-hybrid-production-handoff-2026-09-23`, Head `f5dd283a8530961414edbe89fd82224366374d13` | Einzige Hub-Richtung; Registry aktualisieren, UI nicht neu bauen |
| WB-W0 | Dropbox-Export, 10/10 Preview-Gates PASS, Human Gate offen | Aktueller World-MVP-Kandidat; zuerst unverändert sichern und prüfen |
| WB2 Terrain Sculpt | PR #190, Head `5a98e674184ea4694a5ad7d696d8cc84c1618bdf` | Editor-Donor; nicht vor WB-W0-Abnahme in den Kern-MVP ziehen |
| Racer Host | Race PR #33, Head `71e7051b2eea1ad731912b634f44ce5ba0218736` | R3d/TUNE; Fahr-/Host-Basis, keine neue Track-Architektur |
| RKIT-01 | Race PR #34, Head `f368dd0c71eb2798bcd057d30196cb8da4d967b6` | Review-Kandidat; Module/Messung brauchbar, volle Route noch nicht abgenommen |
| RKIT-02 | Race PR #35, Head `37047b5a14c00e8b3cb5ddb4129e76ce3f10b2d9` | HOLD für MVP; Jump/Flap/Physikfragen später |
| Hürth Proofs | PR #200, Head `0b42323af34a6e2e535765dc627ed8de45820314`; getesteter Head `c36f97be48a6b5da5617aa000c921e4a51329f7f` | A/B/C Human Review; PR #194 bleibt eingefroren |
| Billboard B2a | PR #199, Head `154edef4f220540c9079ab22d5b243baddea6909`; Runtime `147b517efdfba78302af4e5e3ff48846b1f21f92` | 22/22 Public PASS; Human PASS/TUNE offen |
| Motion Library | PR #197, Head `802843920e13903ca4ab77b43bae543197bca827` | 33 Clips Medium/Large; Representative-Actor-Preview später |
| Orc Band | PR #195, Head `9dda7957a33e69926265c1e3a69028a4b35b26f0` | Leader/Gitarre brauchbar; Drummer HOLD, kein MVP-Blocker |
| ToolBox Source-Safe | PR #185, Head `2833674b36be707fa4d14c8b532faee78ef3ba28` | Eigene ToolBox-Lane; nicht mit World-Runtime vermischen |

Direkte Review-Flächen:

- Billboard B2a: `https://kayfabizarro.pages.dev/kfb-hub/pruefen/billboard-b2a/`
- Hürth A/B/C: `https://kayfabizarro.pages.dev/kfb-hub/pruefen/huerth-architecture-proofs/`
- Hub: `https://kayfabizarro.pages.dev/kfb-hub/`

## Racer-Blender-Befund

### RKIT-01 · brauchbarer Donor, noch kein vollständiger Track-PASS

Vorhanden:

- 598 Routenpunkte;
- 2063,84 m Route;
- 54 Stützen;
- 12 Bögen;
- geglättetes Profil entlang derselben Catmull-Rom-Route;
- Stützen, Bögen, Böschung, GLBs, Mess-/Testdaten und Vorher/Nachher-Previews.

Quarantinierbare Probleme:

- enge Kurve „Anfahrt Start“ faltet bei voller Breite;
- Bogenbein/Kappe-Proportion braucht Georgs Look-Entscheidung;
- hohe Bank erzeugt breite Böschung;
- Runtime-Boden braucht später eine saubere Naht;
- mögliche schwebende Stützen müssen an einem repräsentativen Abschnitt geprüft werden.

Diese Punkte blockieren **nicht** den ersten World/Racer-MVP, wenn nur ein sicherer repräsentativer Abschnitt verwendet wird.

### RKIT-02 · später

Jump/Flap-Module sind interessante Donors, aber derzeit nicht Teil des Kernloops:

- C-3 hebt an einer Rampe noch nicht physikalisch ab;
- Flap-down kollidiert in einem kleinen Winkelbereich;
- Landung/Step-up und Physikbasis sind ungeklärt;
- Breitenlabels sind widersprüchlich.

Daher: `HOLD` bis der lokale Fahr-/Welt-MVP steht. Kein Work-Budget für Stunt-Physik in Sprint 1.

## WORLD-RACER-MVP-01

### Core Outcome

Eine kleine, konsistente lokale Region ist zu Fuß und mit einem vorhandenen Fahrzeug nutzbar. Maßstab, Terrain, Route und Darstellung wirken wie eine Welt, nicht wie lose Asset-Inseln.

### Kleinstes gültiges Set

- WB-W0 Region/Korridor unverändert als World-Basis;
- ein gemessener Pedestrian-Actor aus WB-W0;
- ein aktuell bewährtes Fahrzeug aus C-3;
- C-3 Controls/Kamera/Fahrbasis;
- ein sicherer repräsentativer RKIT-01-Streckenabschnitt;
- ein vorhandener Landmark-Donor;
- ein einfacher Eintritt vom und Rückweg zum Hub.

### Nicht in Sprint 1

- alle Fahrzeuge;
- komplette 2-km-Route;
- RKIT-02 Sprünge/Klappen;
- vollständiger Globe-to-Ground-Zoom;
- Tageszeiten/Wetter-Varianten;
- begehbare Innenräume;
- Resident-Dialog/NIE;
- Combat/Dungeon/Platformer;
- komplette Hürth-Stadt;
- Billboard-Video als Pflichtteil;
- neue generische World-/Track-Engine.

### Kritische Blocker

- Region bootet nicht;
- Actor oder Fahrzeug fällt durch den freigegebenen Korridor;
- Fahrzeug kann den gewählten Streckenabschnitt nicht befahren;
- Kamera/Controls verhindern die Bewertung;
- Maßstab ist im Kernloop sichtbar unbrauchbar;
- Rückweg/Exit funktioniert nicht.

### Quarantinierbar

- eine enge Kurve;
- ein Bogen-/Stützen-Look;
- ein einzelnes Fahrzeug;
- ein optionaler Shader;
- eine Wetterlage;
- ein Landmark-Modus;
- ein Resident/Clip;
- ein Stunt-Modul.

### Budget Stop

Ein Diagnosepass plus ein kleiner Reparaturpass pro echtem Core-/Acceptance-Blocker. Alles andere wird markiert, quarantiniert und aus dem Sprint entfernt.

## Reihenfolge

### P0 · HUB-CTRL-01

Kein Redesign.

1. Registry aus den exakten aktuellen Heads neu aufbauen.
2. WB-W0 als `LOCAL_ONLY · HUMAN REVIEW` aufnehmen.
3. RKIT-01 und RKIT-02 getrennt aufnehmen; RKIT-02 = HOLD.
4. B2a, Hürth #200, Motion #197, Orc #195 und ToolBox #185 aktualisieren.
5. Alte startbereite WorldBuilder-/Coworker-Briefings, die WB-W0 widersprechen, auf HOLD/Archiv setzen.
6. Never-empty Regression prüfen: valider Embedded-Stand bleibt sichtbar, wenn Live fehlt oder ungültig ist.
7. Keine Live-Promotion ohne direkten Browserbeweis.

### P0 · WB-W0 SOURCE LOCK

Nach Hub-Abgleich:

1. vollständigen Dropbox-Export unverändert in einen eigenen GitHub-Kandidaten übernehmen;
2. SOURCE/Return/Changelog bewahren;
3. keine Designänderung beim Import;
4. direkte Review-Fläche herstellen;
5. Georg prüft nur Maßstab, Route, Walkability, Globus/Region-Seam und Tuscheinsatz.

### P0 · RKIT-01 HUMAN GATE

Georg sieht:

- vorher/nachher;
- Standard- gegen Taper-Bogenfuß;
- einen sicheren Abschnitt in echten Proportionen;
- keine volle Route als falsches „fertig“.

Danach genau ein Integrationsabschnitt für WORLD-RACER-MVP-01.

### P1 · WORLD-RACER-MVP-01

Erst nach WB-W0- und RKIT-01-Gate. Cross-Repo-Integration durch Work/WSA, nicht durch Claude Design.

### P2 · Erweiterungen

- weitere Fahrzeuge;
- Palette/Tageszeit/Wetter;
- vollständiger OSM-/Racer-Korridor;
- Globe/Travel-Übergang;
- Residents/Scenery;
- Audio/VFX;
- RKIT-02 Stunts;
- instanzierte Minigames.

## Genau ein nächster Gate

**HUB-CTRL-01 · Registry aktualisieren, widersprüchliche startbereite Briefings entfernen und den öffentlichen Never-empty-Fallback mit dem aktuellen Bestand beweisen.**

STOP danach. Noch kein WORLD-RACER-MVP-01, kein RKIT-02, kein neuer WorldBuilder und kein Hub-Redesign.
