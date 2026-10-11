# KFB Worldbuilder · Plan R1 (ersetzt die Stufenfolge des Masterplans R2 für MVP-1)

Stand: 11.10.2026 (nachgeführt bis V-121) · vorher 10.10.2026 spät · Steuer-Sitzung · Grundlage: Georgs Entscheidungen vom 10.10., `BASELINE_ACCEPTED_R1.md`, `BACKBONE_EDITOR_DONORS_R1.md`, `POSTMORTEM_JOYRIDE_REGRESS_R1.md`

## 0 · Grundsätze

1. **Joyride J17 ist Goldstandard** für den Gesamt-Look: Strecke, orange Banden, schieferblaue Fahrbahn (V-102), Cartoon-Deformer, Kamera, Paletten.
2. **Georg gestaltet, wir bauen Werkzeuge.** Inseln, Komposition und Town entstehen im Editor durch Georg. Wir liefern Werkzeuge, Regeln und Spielbarkeit.
3. **Vorlage zuerst:** Vor jedem Teil kommt eine Vorlage-zuerst-Zeile an die Steuerung. Übernahme geht 1:1; Neubau nur mit Begründung.
4. **Kein stiller Drift:** `baseline.accepted.json` plus automatische Gleichstand-Tests vor jeder Lieferung.
5. **Höchstens zwei Baustellen gleichzeitig.** Abnahme durch Georg im Spiel (Spiel-URL, kurzes Video, Standbilder), keine Kritiker-Schleifen.
6. **Lizenzen:** Gekaufte Inseln, Unity-Assets und private Audio-Dateien bleiben lokal.

## 1 · Phasen

| Phase | Inhalt | Vorlagen (1:1) | Neu | Größe | Abnahme |
| --- | --- | --- | --- | --- | --- |
| **A · Oberfläche, Klang, Almanach, Licht** (läuft) | (5) HUD R3 mit Rucksack-Overlay und God-Mode-Schalter · (6) Audio-Bed je Insel plus Radio · (7) Almanach-Fächer mit PDF-Previews · (8+9) Licht-Profile Tag/Abend/Nacht/Innen plus Tag-Nacht-Regler, Glow-Emission, **Skydome mit allen Varianten** (SKY3 globe-v13, TinySkies, Spindel, Claude-Design-Wolken), **Insel-Farben** als Joyride-6er-Presets am Insel-Thema | HUD R3 (Claude Design), cologne-audio.v1, song-transport, Joyride- bzw. Overworld-v13-Fächer, wd-light.js, TinySkies | God-Mode-Plakette, Inventarliste, Insel-Klang-Zuordnung | M | je Teil im Spiel |
| **B · Gleichstand** | Figuren-Knete auf Resident-Atlas-Profil `fine`, Umgebungs-Knete nach K2-Kanon mit Nahband, Augen-Lidfarbe, Kamera (Rad-Zoom, RMB-Orbit, Sperr-Modus), Gleichstand-Tests für alle Baseline-Blöcke | Clay-Kanon 07.10., Resident Atlas, sw-mech-Kamera | Test-Suite `tools/parity/` | M | Tests grün, Bilder Figur und Boden nah |
| **B2 · Figuren-Auswahl als Spieler (Georg 10.10.)** | Alle registrierten KayKit-Figuren spielbar und wählbar: Medium-Rig, Large-Rig und, soweit vorhanden, Legacy. Dazu FrizzleBob v4, v3 (Graft-Rig) und v5 (eigene Ohren auf angepasster KayKit-Basis). **Alle mit KFB-Eye-Rig in Georgs gespeicherter Konfiguration.** Zweck: Spiel und Qualitätskontrolle (Knete, Augen, Farbe und Licht mit Terrain, Locomotion; Orbit von allen Seiten). Legacy bzw. Large ohne passende Clips zeigen Idle bzw. das nächste passende Set, ehrlich markiert. **Alle Textur- und Farbvarianten je Figur wählbar** (z. B. kleiner und großer Ork, Hiker usw.); vorher prüfen, dass alle Texturen vorhanden sind. Bekannter Fehler: Der Medium-Rig-Ork erscheint im Asset Librarian ohne Textur (Texturpfad bzw. Atlas prüfen, im Librarian und im Lab). | Resident Atlas (Figuren-Karten, Eye-Rig v6, anchored-eyes), Character-Select bzw. Vorhang (Clay Stage R2), FB-v5-Karte | Auswahlliste im HUD- bzw. God-Mode-Stil | M | Georg spielt jede Klasse einmal |
| **B+ · Wasser (Pflicht, Georg 10.10.)** | Claude-Design-Wasser-Shader übernehmen: fließendes Wasser bzw. Flüsse und Seen mit Tiefe (`donors/kfb-island-kit-r2-2026-10-08/KFB_Island_Kit_R1/kit/fluid.js`, F0–F2 PASS). **Inklusive des geformten Geländes drumherum:** See als Geländesenke (`lakeHAt`, `heightField`), weiche Wasserlinie per Marching Squares (`waterline`), Fluss als Rinne (`flowPath`, `lakeRiver`: Gelände = min(See, Rinne)), ein Netz für See und Fluss (`fieldWater`), Uferschaum (`uShoreFoam`), Deckkraft nach Tiefe.
**Alle Fixes mitnehmen:** F0.4 Hash ohne sin (keine Haarlinien), F0.5–F0.7 (keine Faltung), F1.2 (kein weißer Saum bzw. keine TinySkies-Linien), F2.1 (am Schnittrand kein Wasser unter der Böschung, keine dunklen bzw. schwarzen Kantenartefakte).
Doku: `donors/kfb-island-kit-r2-2026-10-08/STATUS.md` (F0–F2: Georg-Abnahme PASS) und `CHANGELOG_ADDITIVE.md` (2026-10-08). In Szene gesetzt auf den Demo-Inseln mit Wasser und als Wasser-Werkzeug im Insel-Editor (F). Darf nicht verloren gehen. | fluid.js 1:1 | Einbau, r186-Check | M | Georg sieht Fluss und See mit Tiefe im Spiel |
| **C · Joyride-Rückgrat** (läuft) | Reihenfolge V-103, geändert 11.10.: **C0** ✓ Übergang A/B (V-095 → V-104 B) · **C1a** ✓ J17 1:1 als Lab-Seite, Squash + Schienen-Kamera im FAHREN · **C1b+C3** (läuft) neue Standard-Welt: O1-v7-Ring + Organ-Inseln + Hex-Hub mit J17-Look (V-109, V-111), Tunnel = O1-Bohrung + TC1-Portal/Innenschale/Licht, geschlossen per manifold-3d (V-112–V-116), Leistung ≥ 30 fps (V-115) · **C2** Brücke Track Core 0.16 → v5 · **C4** Ausfahrt auf Inselboden nach V-110/V-113 mit Track-Core-v0.14-EXIT/ENTRY (V-118) · **C5** Umgebungs-Knete Nahband (V-053, im Organ-Bereich schon Standard) | J17 (p1b.v2, track-look v5, tc1), Organ-Inseln v7 (Ring-Modus), Track Core 0.14/0.16.1 | LAB-Host-Patch, Nahband-Kopie, Boolean-Einbau | M–L | Lab-Bild neben J17 `chase-curve` bzw. `chase-straight`; Blatt je Schritt |
| **D · Archipel im Raum** | Die 8 Demo-Inseln als ganze Szenen (Maßstab je Szene über die Tür- bzw. Bank-Regel), Anordnungs-Werkzeug im Orbit (greifen, verschieben, heben, drehen), Speichern als `kfb.world-layout/1`; erster Vorschlag nach Raumregeln (Höhenstufen, Gruppen, Überschneidung der Silhouetten) | demo-scenes.ts | Anordnungs-Gizmo, Layout-Datei | M | Georg ordnet selbst an |
| **E · Strecken-Editor** | Punkte im Raum setzen bzw. ziehen → Track-Core-Spline im Joyride-Look; Anschlüsse mit Auf- und Abfahrt an Insel-Ankern; hin, um und vorbei; sofort befahrbar | Track Core 0.16.1 (Rampen, Ein- und Ausfahrt), k2b | Zieh-Editor (der vorhandene Streckenbauer kann nur Stücklisten) | L | Georg fährt eine Runde |
| **F · Insel-Editor (God-Mode)** | Grundkörper (Scholle oder StreakByte-Basis), Terrain-Pinsel (WB2-Sculpt), Asset-Overlay mit Live-Suche und Vorschau (Librarian-Index; KayKit, Tiny Treats, Quaternius), Inline-Editor mit Snap und Ground (Resident Atlas), Muster-Pinsel (WB2-Strich plus nest/fan plus `scene-rules.json`), **Insel-Thema** (siehe §2), **Terrain-Painter** (Pinsel mit Radius wie der Terrain-Editor, Übergang als Dots- bzw. Sprenkel-Muster S1, Farbe per Color-Picker aus dem Toolbox-Studio, Auswahl aus der Insel-Palette; vom Webchat als God-Mode- bzw. Maker-Space-Feature angemeldet), Speichern und „Spielen“ | Resident-Atlas-Editor (0.184), WB2-Sculpt, grounding.ts, Librarian-JSONL | Muster-Pinsel-Adapter, Thema-Panel | L | Georg baut eine Taverne bzw. eine erste Insel |
| **H · Studio-Übernahme 1:1 (Georg 10.10.)** | Eye-Rig-Studio mit Ausdrücken und allen Reglern, Viseme bzw. Laute, Gesichtsmodule. **Kein einziger Regler und keine Einstellung darf verloren gehen.** Vorher eine Funktionsinventur über Toolbox, Frankenstein-Studio und Patch-Studio (dort waren Teile schon verdrahtet, z. B. die Viseme, die in der Toolbox nur teilweise umgesetzt sind). Index zuerst: `ACCEPTANCE_INDEX.md` plus PASS/TUNE/FAIL. Einbau in den God-Mode schrittweise. | Toolbox, Frankenstein-Studio, Patch-Studio, Resident Atlas | Inventur-Tabelle je Regler: Quelle → Lab | L | Georg vergleicht Regler-Liste und ein Gesicht vorher/nachher |
| **G · Prozedurale bzw. zufällige Inseln** | Ein Generierungsschritt aus Grundkörper, Terrain, Biom, Insel-Thema und Regeln; auch für Spieler-Inseln | F plus scene-rules | Generator | M | Georg bewertet 5 Zufallsinseln |

**Parallel:**
- Blender-Coworker (Mac mini): Island Form Kit 01, K1 Unterseiten + K2 Silhouetten → Georg wählt → K3 Übergänge (V-119). Nur Referenzen, keine Laufzeit.
- WSA-Studie Szene, Biom und Licht → `scene-rules.json` als Eingang für F und G (Recherche, kein Bau).
- Georg baut KFB Town im Editor, sobald F steht.

## 2 · Insel-Thema (Georg 10.10.): ein Generierungsschritt, überall gleich

Schema `kfb.island-theme/1`, gespeichert im Insel-Rezept:
- **palette:** Sechser-Kombination (6 Farben) plus Zuordnung zu den Rollen in `ENV_ROLES`.
  - Basis ist das Joyride-Farbschema mit seinen zwei abgeleiteten Schemata (`track-look.v5` WORLDS: canyon, bucht, otown).
  - **Generator:** zufällig harmonisch oder aus 2–3 vorgegebenen Farben die passenden Cartoon-Farben ergänzen (Harmonie-Regeln aus den Joyride-Kombinationen ableiten); Feintuning später.
- **light:** Profil aus Phase A8 (Tag, Abend, Nacht, Innen) plus Zeit.
- **sound:** Ambience bzw. Sender aus Phase A6.
- **biome:** Asset-Klassen und Dichte (aus `scene-rules.json`).
- **storyTint:** leichte Einfärbung je Story-Mode (High- bzw. Low-Vibrational-Fluff), über dem Grundthema der Insel (z. B. O-Town), nie statt ihm.

Genutzt wird das Thema im God-Mode (Panel), im Generator (G) und für Spieler-Inseln. Ein Owner, keine zweite Farbtabelle: Die alte Tabelle `PALETTES` und `palette-roles.js` (Clay Stage) werden in `ENV_ROLES` zusammengeführt (Phase B).

## 2b · Fluff-Zonen im God-Mode (perspektivisch, Georg 10.10.)

- **Baum anklicken** → er wird mit Fluff-Kügelchen gefüllt. Erst eine **bunte Mischung** als Cartoon-Akzent, bewusst auffällig, auch außerhalb der Insel-Palette, damit der Spieler erkennt: Hier gibt es Fluff. Die Wirkung der Farben bzw. die Alchemie kommt später.
- **Terrain bzw. Mine markieren** → dort kann man mit Bombe oder Schäufelchen nach Fluff graben.
- **Felder bzw. Beete** → Fluff ernten, Fluff-Möhrchen pflanzen.
- **Wasserflächen** → Fluff-Angeln (KayKit-Animationen Fishing_Cast bis Catch auf Rig_Medium_Tools sind vorhanden; Angel-Mesh fehlt).
- Speicherung als Zonen im Insel-Rezept (`nodes` bzw. `zones`, Art, Fläche bzw. Objekt-ID). Der Spielzustand (was schon geerntet ist) bleibt im Spielstand, nie im Rezept. Siehe Erinnerung „Fluff-Ernte“ und `6b` im Masterplan.
- Einordnung: nach Phase F als F+; die Datenstruktur `zones` wird in F schon vorgesehen.

## 2c · TBD später: Interaktion, Schuss, Action-Bar (Georg 11.10.)

- **Chill & Fun, Ziel-Hilfe:** Tab wechselt durch sichtbare Ziele bzw. Gegner (WoW-Logik). Angriff, Schuss bzw. Schlag per Maustaste (vermutlich rechts, zu klären) auf das Ziel. Vorlage: Combat Arena.
- **Derselbe Mechanismus für die Welt:** Fluff-Kugel vom Baum klopfen bzw. boxen oder per Blaster bzw. Gun abschießen. Je nach Waffe Übergang zur Zerstörung (Raketen-Explosion → Baum weg, kahl bzw. verkohlt). Danach zeitgesteuerte Regeneration mit Animation bzw. Übergang zum nachgewachsenen Baum, an dem wieder Fluff wächst bzw. als Fallobst fällt.
- **Action-Bar 1–6:** klein, nicht störend im Sichtfeld, für Waffenwechsel, Potions, Flugmodus usw. Nur befüllte Slots werden angezeigt. Später entsperrbar bzw. verschiebbar.
- **Doppel-Leertaste:** Flug-Modus bzw. Jetpack (WoW-Logik, schon gemessen).
- Einordnung: nach Phase F bzw. mit den Fluff-Zonen (2b). Der HUD-R3-Stil gilt.

## 2d · Mauer-Baukasten mit Skins (Georg 11.10., V-105/V-106)

Referenz: `docs/golden/candidates/prison-maze_2026-10-11/` (Gefängnis- bzw. Maze-Insel rund und eckig, Wall-Kit-Blatt).
- **Module:** gerade (2 bzw. 1 Einheit), Innen- und Außenecke, T, Kreuz, Endkappe, Tor mit Fallgitter, kaputt, Brüstung, Pfeiler, Treppe bzw. Rampe, Brücke bzw. Schwelle; Wachturm-Module; Requisiten. Festes Rastermaß.
- **Skins:** A Stein (Blatt), B Sci-Fi (später), weitere je Insel-Thema (§2). Gleiche Module, andere Haut.
- **Vorlage zuerst:** Bestand prüfen (KayKit > Tiny Treats > Quaternius > Kenney); Georg setzt die Teile im Insel-Editor (F), der Generator (G) kann Labyrinthe auslegen.
- **Nicht übernehmen:** der Inselboden der Blätter (TUNE, zu sehr drangeklebt). Inselkörper bleibt Scholle (V-015).

## 3 · Offen bei Georg

- 10 Fragen aus `BASELINE_ACCEPTED_R1.md` §2; die Empfehlungen gelten, bis Georg anders entscheidet.
- Cozy Tunes (Pizza Doggy) liegen öffentlich auf GitHub ohne Lizenzdatei: Lizenz klären, gegebenenfalls ins private Repo.
- Screenshots der 8 gekauften Inseln privat an WSA: ja oder nein.

## 4 · Auf Eis

R2D- bzw. Scholle-Eigenbau als Insel-Gestaltung (bleibt nur als Grundkörper-Option), Fels-Bausatz-Runden, Steinbogen-Brücke, Claude Design (3D), WSA-Treppen-Test, Cabrio (post-MVP).
