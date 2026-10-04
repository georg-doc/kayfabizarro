# CloudDesign Worldbuilding Intake · 2026-09-18

## Status und Grenze

Dieses Verzeichnis ist ein **kuratierter Recovery-/Integrations-Intake** aus dem lokalen CloudDesign-Komplettexport „KFB Card Viewer + Card Zones + Combat Mech + Voxel World + Hex Assets Worldbuilding (5)“.

- Status: **WIP_INBOX / INTEGRATION_CANDIDATE**
- Kein Public Deployment, keine automatische Aufnahme in Hub, Travel, Combat oder ToolBox.
- Keine bestehenden Eigentümer, Verträge oder kanonischen Runtime-Pfade wurden ersetzt.
- Dokumente aus dem Export sind Quellen und Verlaufsmaterial, keine neuen Arbeitsanweisungen.
- Modell- und Texturpakete bleiben SourceRefs auf die bestehenden Repo-Pfade; es wurden keine neuen Pack-Binärdateien dupliziert.
- Dieser Intake ist **nicht** als formal vom Game Development Studio „admitted“ gekennzeichnet: die lokale `game-dev`-CLI stand bei der Prüfung nicht zur Verfügung.

## Inhalt

### `platformer-poc/` — neuer, vollständiger Kandidat

Der vollständige Free-Roam-Platformer-POC einschließlich Quellcode, Daten, Dokumentation, Tests, fünf Belegbildern und Platformer-Kit-Atlas.

Belegter Stand aus dem Export:

- 17 Plattformen, 9 Portal-Kandidaten, 18 Pickups, Bouncer, 2 Hazards, 8 Checkpoints.
- Zwei Modi: Chill & Fun mit ballistisch berechnetem Zielbogen sowie KFB Game mit manueller Bewegung.
- Vier tatsächlich gemountete Präsentationswege: Platformer Character, Skeleton Warrior, FrizzleBob über `mountGraft({ animation: 'host' })`, CapsuleCarl prozedural.
- Ein Bewegungsbesitzer, ein Renderloop und ein Aktor-Mixer.
- Export-Testbericht: Kaltstart PASS, 35/35 Laufzeitquellen, assistierte Sprünge 12/12, manuelle Teststrecke 3/7, Bouncer PASS.
- Atlas: 109/109 operative glTF-Pfade geladen. Das Registry-Shard enthält 113 Modelle; die vier zusätzlichen Einträge sind doppelte Pack-Kopien (`glTF/Character*` und `Modular Platforms/Single Cube/*`).

Offen vor Integration: Georg-Abnahme, Rig_Large und Rig_Legacy, Mobile/Touch, Kamera-Kollision, manuelles Level-Tuning sowie Zahlen-gegen-Zahlen-Prüfung des FrizzleBob-Grafts.

### `card-zone-lab-v3/` — wieder lauffähiger Fluid-/Card-Zone-Spender

Der erhaltene Cut v3 mit dem Runtime-Einstieg `KFB Card Zone Lab v2.dc.html`, Zonen-Registry und relativen Laufzeitabhängigkeiten.

Beim Recovery-Test fehlten dem exportierten Unterordner drei von `kfb-box-material.js` benötigte Dateien: `asset-index.js`, `kfb-textures.json` und `constructs.json`. Sie lagen im Export-Root, wurden in diesem Intake als **Recovery-Abhängigkeiten** ergänzt und sind im Manifest entsprechend gekennzeichnet. Der reparierte Cut bootet lokal ohne Konsolenfehler bis `HEROIC · Biome plateau · Seed …`.

Wiederverwendbare Kerne:

- 168 Card Zones auf Hex-Grid.
- Card Cube, flache Aufdeckkarte, Face-Focus sowie distanzgetriebene Sky-Card-Logik.
- Fünf Fluidtypen, unregelmäßiger Graben, Teiche, Fluss und narrative Fließrichtung.
- Gemeinsame Nass-/Geometrie-Mengen, getrennte `waterLevel`/`fluidY`, eine Radiusfunktion und Ufer als Distanzfeld.
- `setCarvePath`, `world-context`, `voxel-terrain`, Card Builder sowie Ink-/Box-Materialmodule.

Das ist ein Integrationsspender für spätere Landmark-/Card-Zone-Slices, nicht die neue Terrain-SSOT.

### `donor-bank/` — geordnete Werkzeug- und Sidequest-Bank

- Platform/Worldbuilding: 3D Asset Repo, Hex-Bühne, Hex-Worldbench, Zonen-Atlas.
- Material: Voxel Zone S1/S2, Material Bench, Textur-Browser, stochastisches Box-Material und Screen-Space-Ink.
- Props: Cartoon-Verbieger und zugehöriges Deformationsmodul.
- Zonen: Zonen-Registry samt Biome-/Zonendaten.
- Combat/Mech: Mech Combat v10, Mech Voxel World v1, Region Field, VFX, Fahrzeuge, Boden und Combat-Module.
- Erkenntnisse: konsolidierte Art Direction, Textur-Handover, VFX-Design, Mech-Voxel-Konzept und Asset-Repo-Sprint.

Die Combat- und Travel-nahen Dateien sind ausdrücklich **Donoren**. Neuere kanonische Travel-/Combat-Stände im Repo haben Vorrang.

## Integrationslinie

1. Free-Roam-Vertical-Slice: Platformer-Bewegungsbesitzer + Actor-Adapter mit dem aktuellen Vehicle-/Motion-Lab verbinden.
2. Platformer-Props über bestehende SourceRefs verwenden: Pfeile als Quest-/Fahrtrichtungszeichen, Zahlen für Race BOX1, Chest/Lever/Bouncer/Bomb als Interaktionsbausteine, Tower als Hub-Landmark.
3. FrizzleBob nur über den aktuellen Graft-/Driver-Vertrag einhängen; kein zweites Gesicht oder Animationssystem erzeugen.
4. Terrain zunächst gegen die aktuelle Travel-/OSM-Linie adaptieren. Voxel- und Hex-Dateien hier bleiben Mess-/Look-/Mechanikspender.
5. Card Zones und Fluid später als Landmark-Modul anbinden.
6. Combat erst nach dem Free-Roam-MVP; Mech v10/VFX sind Basis, nicht Zielruntime.

## Provenienz- und Lizenzbefund

Der Pack `platformer-game-kit-dec-2021` ist im bestehenden Registry-Shard strukturell erfasst und auf `eb48f50489b9e4903ec1e3d2fb1837605ce7d792` gepinnt. Die Registry weist aber bewusst **keine Lizenz her**; im Export liegt keine eigene Lizenzdatei. Außerdem ist die Gleichsetzung mit dem heutigen offiziellen KayKit Platformer Pack ungeklärt. Deshalb werden hier nur Code, Metadaten, Belegbilder und SourceRefs aufgenommen — keine erneute externe Asset-Zulassung behauptet.

## Recovery-Befund zum mitgelieferten Platformer-Manifest

`platformer-poc/EXPORT_MANIFEST.json` ist als Originalbeleg erhalten, aber veraltet:

- deklariert: 31 Dateien; tatsächlich im Ordner: 37;
- nicht gelistet: das Manifest selbst, Atlas-HTML, Atlas-Report, Atlas-Belegbild und zwei Atlas-Module;
- drei gelistete Dateien haben spätere Größen: `docs/evidence/01-island-overview.png`, `src/hud.js`, `src/main.js`.

`INTAKE_MANIFEST.json` ist deshalb der maßgebliche Hashnachweis dieses GitHub-Intakes.

## Prüfung dieses Intakes

- JavaScript-Syntax der aufgenommenen Module: PASS.
- JSON-Parsing: PASS.
- Card Zone Lab: PASS nach Ergänzung der drei fehlenden Recovery-Abhängigkeiten.
- Platformer: UI, Inselbeschriftung und Zähler starten ohne Konsolenfehler; das Mounting des externen Platformer Characters blieb in diesem Netzlauf nach mehr als 60 Sekunden offen. Der enthaltene 35/35-Testbericht bleibt daher als **Export-Testresultat**, dieser Intake-Lauf als **PARTIAL** gekennzeichnet.
- Originale Dateigrößen und SHA-256: `INTAKE_MANIFEST.json`.
