# KFB Island Worldbuilder · Projektstand

Laufendes Statusdokument. Wird nach jedem größeren Schritt fortgeschrieben. Neueste Einträge oben.

## Rollen (seit 2026-10-08)

| Wer | Was |
| --- | --- |
| Claude Code, Steuer-Sitzung | Konzept, Integration, Prüfung; dieses Lab; Briefings; Zusammenführen der Ergebnisse |
| Claude Code, RKIT-Sitzung | Straßenbaukasten RKIT R3 in Blender (Profile, Andock-Bauteile, T/Y/X-Kreuzungen im Track Core) |
| Blender-Coworker (Mac mini) | Bewohner, Rigging, Animationen, NPC-Activities |
| Claude Design | Formen: Natur-Kit, Wasser, Pyramide, Unterseite (`deliveries/KFB_ISLAND_KIT_R1.zip`) |
| WSA | MVP-Integration in WB2 nach `docs/SPEC_PLACEMENT_GRAMMAR_R1.md` |

## Parallele Stränge (Stand 2026-10-08, von Georg eingebracht)

- **Strang A · AI Game Art Academy:** 3D AI Classroom (MIT, React Three Fiber) nur als UX- und Architektur-Vorbild; alte Cube Academy nur als Lektions-Donor. Living Document v0.4. Nicht Teil dieses Labs.
- **Strang B · KFB 3D Technology & Workflow Research:** WebGL Studio, TSL Node Editor, three-inspect, ShaderPass als Werkzeug-Donoren für Material, Clay, Performance, Debugging. Doku auf `georg-doc/kayfabizarro`, Branch `planning/hybrid-baked-clay-texture-architecture-2026-10-07` (Head `7416cfff38b9`), Main-Router `ca7295d1e92a`. Nächstes Gate: **KFB Surface Lab · Inspector Donor Proof 01** (three-inspect an echten KFB-Materialien, isoliert).

## Stand 11.10. abends (nach Blender-Review, gilt vor „Übergabepunkt“)

**Maßgeblich:** `KFB_HUB/30_DECISIONS/DECISIONS.md` (V-001…V-121) + `docs/KFB_WORLDBUILDER_PLAN_R1.md` + diese Datei. Abgelöst: siehe V-117 bzw. `START_HERE_STEERING.md` im Register-Ordner. Spiegel auf GitHub: Branch `docs/kfb-decisions-register-2026-10-11`, wird bei jeder Register-Änderung mitgeschoben.

**Fertig (11.10.):** A10 TinySkies-Effekte + AUTO-Skydome-Überblendung (V-092, V-101) · C0 Übergang A/B → B (V-104) · C1a J17 1:1 als Lab-Seite, Squash .12/.18/.06 + Schienen-Kamera im FAHREN, Parity grün mit Sim-Zeit-Checks (V-107) · Fahrbahn schieferblau + orange Banden (V-102 PASS).

**Läuft:** C1b+C3 neue Standard-Welt (V-109): O1-v7-Ring-Modus + Organ-Inseln + Hex-Hub, J17-Look, Spawn Farmer auf Hex-Insel, alte RKIT-Welt nur `?rkit=1`. Tunnel V-112–V-116 (TC1-Portal + Innenschale + Licht in O1-Bohrung, manifold-3d, levelSet-Vernetzung, Prüfungen offen/nicht-mannigfaltig/Durchblick). Leistung V-115 (≥ 30 fps; Nahband Standard, Stufenwechsel mit Dither).

**Danach:** C2 (Track Core 0.16 → v5) · C4 Ausfahrt auf Inselboden (V-110, V-113, Track-Core-EXIT/ENTRY V-118; Wendeschleife fehlt im Track Core) · C5 · Phase D.

**Referenzen von Georg (11.10.):** Gefängnis-Mauer-Baukasten mit Skins (V-105), Inselboden der Bildblätter TUNE (V-106), Dystopia (V-108), Protopia + Maker Space mit Strecken-Anschluss (V-110), Organe später für MED-Welten (V-111). Ablage `docs/golden/candidates/…`.

**Offen bei Georg:** siehe `KFB_HUB/30_DECISIONS/REVIEW_STEUERUNG_R1.md` (Steuer-Entscheidungen zur Durchsicht + Konflikt mit WSA-Router „Vier-Insel-A/B einziges Tor / Open World R4 STOP“).

## Stand 11.10. (Übergabepunkt)

- **Maßgeblich:** `KFB_HUB/30_DECISIONS/DECISIONS.md` (V-001 … V-100, Warum/Wann, additiver CHANGELOG; Generator `build_decisions.py`), Plan `docs/KFB_WORLDBUILDER_PLAN_R1.md`, Lab-`CLAUDE.md`, `tools/parity` (Pflicht vor jeder Lieferung).
- **Erledigt:** Phase A (HUD R3 + Rucksack, Klang/Radio, Himmel/Licht/Paletten, Almanach R2), B0 (ein Gangschema, WoW-Steuerung/-Kamera, Sprünge; parity grün), B2 Figuren-Auswahl (67 Figuren, V-090-Augen, Figuren-Knete RA2 fine), B+ Wasser (fluid.js, ?stage=lake).
- **Läuft:** A10 TinySkies-Effekte (Regen, Flare, Zyklus, Aurora-Elevation, Lichtkreis V-097) → Lieferung mit Standbildern; danach Phase C Joyride-Rückgrat (Vorlagen: J16/J17, track-look v5, Track Core 0.16.1, Organ-Inseln v4 `~/Dropbox/CLAUDE/KFB Organ-Inseln + race track v4+/` (V-098), Tunnel-Anschluss V-099, Joyride-Tunnel-Styles V-100, Übergangs-Research V-095); Umgebungs-Knete V-053 dort mitnehmen.
- **Offen bei Georg:** Cozy Tunes Ablage später (V-087); WSA-Studie (privates Screenshot-ZIP ja/nein); Treppe von WSA (`wsa/kfb-g4-stairs-form-design-r3-2026-10-11`) ansehen, wenn gemeldet.

## Phase B gestartet (11.10.)

- **B0, Regress:** Georg im Spiel (?play=game): WASD/QE bewegen scheinbar nur die Kamera, Bewegung ruckelig, Laufen ist nicht Joggen. Fix plus erster automatischer Gleichstand-Test (`tools/parity/`: W → Running_A ≈ 1,40 H/s, Shift → Running_B, Sprünge).
- **Steuerung und Kamera, WoW-Schema (Georg 11.10., verbindlich):**
  - Ohne Maustaste A/D drehen, Q/E strafen. RMB: Maus lenkt die Figur, A/D strafen. LMB: nur Kamera orbitieren. Beide Tasten: vorwärts.
  - Spielmodus: Zoom per Rad bzw. Touchpad (normalisiert, gedämpft) von weit bis Ich-Perspektive (Figur ausblenden). Träges Recenter hinter die Figur bei Bewegung; im Stand bleibt die Blickrichtung. Default-Position per Slider (Rollercoaster-Vorlage) innerhalb der Zoom-Grenzen.
  - God-Mode: Zoom zum Cursor, nicht zu empfindlich. Orbit-Ruckeln beseitigen (geglätteter Arm, gefilterte Kollision, ruhiges Ziel).
  - Ein Gangschema: walk.ts stillgelegt, beide Spiel-Adressen über den J17-Travel-Core.
- **Sprünge (Georg):** Leertaste im Stand = Sprung auf der Stelle, Leertaste aus dem Joggen = Sprung vorwärts, **Shift+Leertaste aus dem Sprint = Weitsprung** (KayKit-Animationspaket). Doppel-Leertaste reserviert für Flug-Modus bzw. Jetpack (WoW-Logik, schon gemessen), später.
- **Almanach (Georg):** Fächer rechts, senkrecht gerade nach unten. Für tausende Karten zeigt der Fächer die letzten N (≈ 7) plus „+N“; Klick öffnet ein Overlay mit Deck- bzw. Welt-Reitern und einem Raster der Viertel → Viewer.

## Phase A abgeschlossen (10.10. Nacht)

- A5 HUD R3 mit Rucksack (`docs/critic/lab-hud/2026-10-10_01/`), A6 Klang ohne Video (`lab-sound/2026-10-10_01/`), A8+9 Himmel/Licht/Joyride-Paletten am Insel-Thema (`lab-sky/2026-10-10_01/`; Abend zu orange bzw. dunkel → TUNE), A7 Almanach-Fächer mit Viewer (`lab-almanac/2026-10-10_01/`).
- Spiel-Adresse `?play=game` (PondLand). RKIT-Hub nur noch über `?rkit=1`. Laufzeit offline bis auf die HUD-R3-Item-Modelle. Wolken CC BY 3.0 (Jarlan Perez), Credit nötig.
- Bau-Sitzung steht. Nächstes laut Plan: B (Gleichstand plus B2 Figuren-Auswahl, B+ Wasser) bzw. C (Joyride-Rückgrat), nach Georgs Wahl.

## Stand vor Georgs Pause (10.10. Nacht)

- A5 HUD R3 inklusive Rucksack geliefert (`docs/critic/lab-hud/2026-10-10_01/`), A6 Klang läuft, A7/A8 warten.
- Georg: In Vorschauen keine RKIT-Test-Hub-Reste mehr (quergestellte Teilbanden, flacher Asphalt, Gehwegplatten, nicht-Joyride-Muster). Vorschau-Bühne = StreakByte-Demo-Insel; RKIT-Hub nur über `?rkit=1`.
- Nach der Pause: Mechanismus gegen Verlust von Georgs Vorgaben besprechen (Vorgaben-Register wörtlich, an Baseline-Tests gekoppelt).

## Plan R1 gültig: `docs/KFB_WORLDBUILDER_PLAN_R1.md` (10.10. spät)

Phasen A (läuft: HUD mit Rucksack, Klang, Almanach, Licht) → B Gleichstand → C Joyride-Rückgrat → D Archipel im Raum → E Strecken-Editor → F Insel-Editor mit Insel-Thema (`kfb.island-theme/1`: 6er-Palette aus Joyride plus zwei abgeleiteten Schemata, Licht, Klang, Biom, Story-Tint) → G prozedurale Inseln. Offen: Cozy-Tunes-Lizenz (öffentlich auf main), private Screenshots an WSA.

## Neuer Kurs: Joyride-Rückgrat, dann Editor (10.10. spät, Georg)

- **Joyride J17 ist Goldstandard für den Gesamt-Look** (Strecke, Banden, orange Fahrbahn, Cartoon-Deformer, Kamera, Paletten). Postmortem `docs/POSTMORTEM_JOYRIDE_REGRESS_R1.md`; Masterplan §7 korrigiert; Baseline-Block `look.joyride-gold`.
- Reihenfolge: (1) Joyride-Rückgrat 1:1, (2) die 8 StreakByte-Demo-Inseln im Raum (unverändert; keine davon ist KFB Town, die baut Georg selbst), (3) Strecken-Editor mit Auf- und Abfahrten, (4) God-Mode-Insel-Editor (Terrain, Asset-Librarian-Overlay mit KayKit, Tiny Treats und Quaternius, Resident-Atlas-Inline-Editor mit Snap und Ground, Muster-Pinsel).
- Bau-Sitzung: Vorlagen-Inventur (nur lesend) → `docs/BACKBONE_EDITOR_DONORS_R1.md`; plus 32 Screenshots der Demo-Inseln (lokal, lizenziert).
- **Sicherer Integrations-Slice (Georg-Freigabe):** HUD R3 von Claude Design unverändert übernehmen (Knet-Look später), Funktionen nach J17-HUD (Modus-Schalter, Minikarte, Tacho, Radio) plus Schalter Spiel ↔ God-Mode, keine Debug-Werte im Spiel; Audio-Bed je Insel heuristisch zugeordnet, kompaktes diegetisches Radio mit Cozy-Tunes und Ticker. Bau-Sitzung: erst Vorlage-zuerst-Zeile, dann Bau.
- WSA: großer Studienauftrag Szene, Biom und Licht (`deliveries/BRIEF_WSA_SCENE_STUDY_R1.md`, Branch `wsa/kfb-scene-study-2026-10-10`): KayKit-Creator-Videos, Mystery-of-the-Month-GIFs (Patreon), 8 Inseln über privates ZIP, Licht, Joyride-Goldblatt → `scene-rules.json`. Treppen-Test zurückgestellt (nie gestartet).

## Stopp und Neuplanung (10.10. spät, Georg: „regressiver Failure-Loop“)

- Steuerung gesteht zu: reaktive Mini-Aufträge statt Plan, Abgenommenes wird nachgebaut statt 1:1 übernommen, zu viele Baustellen gleichzeitig. Vorschlag an Georg: Schritt 0 Einfrieren; Schritt 1 Liste „Abgenommener Bestand“ (Version, Abnahme, Werte, Lab-Stand, Frage nach der besten Basis); Schritt 2 Gleichstand 1:1 mit Beweisbild; Schritt 3 neue Gestaltung, höchstens zwei Baustellen. Wartet auf Georgs OK und seine Nennung der am weitesten integrierten Builds.
- Quaternius-Studie fertig (`docs/research/quaternius-megakit-study_2026-10-10/`): CC0; 27 Fels-Modelle (Rock_Big ×2, Rock_Medium ×4, Kiesel, Wegsteine) im Lab unter `public/assets/env/quaternius-megakit-pro/`. Kein Fels-Shader, kein Moos als Geometrie, keine komponierten Beispielszenen. Übertragbare Regeln: Bodenfarbe am Fuß, 3–21 % versenkt, Flächen-Hierarchie, Helligkeit vom Fuß zur Krone, Bewuchs an jeder Fels-Boden-Kante. Eingang für Schritt 3.

## Probe 6 abgenommen (10.10. spät)

- Georg: Tempo „passt so erstmal“. W = Jog (Running_A, 1,40 H/s), Shift = Sprint (Running_B ×1,3, 2,22 H/s), Strg = Gehen; kein Start-Hüpfer. Auto bleibt vor dem Bordstein (Band = Bordfläche − halbe Autobreite − 0,15).
- Backlog: Cartoon-Prinzipien Anticipation, Impact und Recovery (Nachfedern nach dem Hop); Hut-Artefakte vorerst hinnehmen, vielleicht später metanarrativ nutzen. Georg will im Spiel urteilen → Spiel-URL und Leistungsprobe (Ruckeln: Aufnahme oder Laufzeit?) bei der Bau-Sitzung.
- Quaternius MegaKit PRO + Source (von Georg gekauft) in der Studie (`docs/research/quaternius-megakit-study_2026-10-10/`); Fels-Runde 4 wartet darauf.

## Reißleine Claude Design (10.10. spät)

- **Town-Massemodell R1 von Claude Design: FAIL** (Georg: „Regress“, „sprachlos“). Postmortem und brauchbare Reste (`plan-geometry.js`, Burg-Platz 44 × 39 × 41) unter `docs/critic/claude-design/town-massemodell-r1-FAIL_2026-10-10/`. Ursachen laut Claude Design selbst: Streu-Primitive statt geformter Masse, zehn Bauteile in einem Lauf, Eigenbau statt Bestand (Track Core, KayKit-Figuren, Scholle v7), Zahlen statt Hinsehen.
- **Folge (Steuerung):** Claude Design baut keine 3D-Geometrie mehr für KFB, höchstens 2D-Lagepläne. Insel- und Bauteil-Look entsteht im Lab aus Bestand (KayKit/Tiny Treats/Quaternius) plus `moss-cap.ts`, mit Webchat-Bildern als Stil-Richtung; Teile isoliert neben Vorbild, erst dann Szene.
- PR #387 (KayKit/Tiny-Treats-Vervollständigung, Holiday Bits, Charming-Kitchen-Fix) gemergt `dccf75c`. Preferred Pool (MVP-1-Bewohner) bei der Bau-Sitzung; Quaternius Stylized Nature MegaKit wird geladen.

## Georg-Entscheidungen 10.10. abends: Auto, Bild-Vorlagen, Brücken-Test 2

- **Messung 06 Kritiker 5,57 (Runde 2, Stopp):** technische Fixes Staub, Absprung/Landung an der Tür, Kamera-Drehrate, Blob-Schatten; danach Video an Georg, kein dritter Kritiker.
- **Auto MVP-1:** geschlossenes Retro-Auto, Figur beim Fahren unsichtbar; Cabrio-Port (Sitz-Gates bestanden) eingefroren hinter `car=cabrio`, post-MVP. Bau-Sitzung: J17-Hop ohne T-Pose für den Cicada, Kamera nicht durchs Auto.
- **G4-Blatt „STONE BRIDGE 01“** (Webchat) aus Quarantäne, Stil-Richtung: `docs/golden/candidates/G4_stone_bridge_sheet_webchat_r1.webp`. Briefing Webchat §7a „bauarm“ + Teileliste.
- **img2threejs bridge02** gestartet (Georg „ja“): Blatt als Vorlage, Keilsteinring, Sockelfelsen, Graskappe, Pfeiler mit Laternen, Pflaster, flache Fahrbahn, ≤ 40 k Dreiecke → `tools/img2threejs-tests/bridge02/`.
- G1/G4-Originale (Town R1/R2, Protopia, Fels-Mood, Brückenblatt) auf GitHub-Branch `assets/kfb-mvp1-concept-originals-2026-10-10` (SHA256 3/3 geprüft), lokal `docs/golden/candidates/`; für Claude Design (Town-Massemodell K1–K3, Burg-Stellvertreter 44 × 39 × 41 lab).
- **Ein-/Aussteigen abgenommen als Arbeitsstand** (Georg: „etwa 30 % einer sauberen Cartoon-Animation … so nehmen, bevor wir uns verkünsteln“; Rückfall: Überblenden auf Tastendruck). Fokus jetzt Environment. Masterplan §3b/§5 angepasst (Dither statt Sicht-Loch fürs Auto, 0,15-s-Regel nur freies Laufen/Fahren, Cabrio post-MVP).
- **Fels-Bausatz-Test R1** (`docs/critic/lab-env/rock-kit_2026-10-10_01/`, Modul `src/environment/rock-kit.ts`, 8,9 k Dreiecke): Teile funktionieren (Bruchflächen, Rollenfarben), Gesamtform nicht. 7 schmale Säulen statt breiter Pyramide aus 12–15 Blöcken, Moos wirkt wie flache Platten statt Knet-Polster, Büschel spitz statt Rosetten, Varianten kaum unterscheidbar. Steuerung ~4/10. Befund: echter Kenney rock_largeA ist ein flacher Brocken, die „Kenney-Referenz“ auf dem Blatt ist erfunden. Georg entscheidet über Runde 3.
- **Fels-Blätter 1 + 2** (Kenney rock_largeA im Knetstil, Webchat) auf dem Asset-Branch und unter `docs/golden/candidates/`; Georgs Favorit: Blatt 1. Quellbasiert, deshalb direkter Weg: Kenney-Fels (CC0) plus Moos-Kappen plus Büschel.
- **WSA-Treppen-Test:** Rückfragen geklärt (Briefing R1b: Basis `3c42bf7`, nur WSA-Branch, 2 Runden, Stufenmaß, Scorecard, Stil-Referenzen).
- **bridge02 Ergebnis:** 36,8 k Dreiecke, 2 von 3 Runden. Bogenring (15 Keilsteine + Schlussstein) und Steinblöcke treffen das Blatt. Sockelfelsen (Raster), Graskappe (Balken) und Laternen (zu klein) nicht; Wand zwischen Ring und Brüstung zu hoch. Eigene Wertung 5/10. Vorschlag: Ring und Blöcke als Bausatz übernehmen, Felsen und Gras aus dem Insel-Look (G1) teilen statt je Bauteil neu erfinden, Laternen aus der Bibliothek.

## Stufe 2 · sichtbarer Fahrer, Messung 04 (2026-10-10)

- Probe 01 (Messung 03) an Georg; offen bei ihm: Fahrgefühl-Zahlen und Inselrand (a/b/c).
- Messung 04 (`docs/critic/lab-stage2/2026-10-10_04/`): erste Figuren-Karte `public/cards/farmer_a.card.json` (seat), Hüfte auf Sitz 0,000 H, Figurdrehung 0°.
- Auto: **B offenes Cartoon-Cabrio** (K2-Größe bleibt) von der Steuerung vorläufig freigegeben, Georg kann widersprechen; A hätte ×1,56 gebraucht, Fahrer trotzdem unsichtbar.
- Auflage B: gebauter Abschluss an der Schnittlinie (Wulst/Türkappe mit Wandstärke), geschlossene Kabine, Scheibenstummel, Lenkrad; Vorlage-zuerst-Zeile vor Modellierung.
- Blinder Kritiker Messung 04: 5,0, nicht bestanden (Runde 1), Mängel in `CRITIC_VERDICT.md`, an Bau-Sitzung als Pflicht für die Cabrio-Lieferung.
- **Update:** Vorlage zuerst ergab das gebaute KFB-Cabrio aus J17 (`KFB_CVP1_cabrio.glb` r2 @93abbf22, FB-CAR-01: Türen mit Wandstärke, Kabine, Scheibenrahmen, Lenkrad). Freigegeben als MVP-1-Auto statt des aufgeschnittenen Cicada. Gates: Hände am Kranz ≤ 0,03 H (J17-IK-FAIL nicht übernehmen), Hüfte ≤ 0,02 H, keine Durchdringung, Dach offen, Maße gegen Spur und Bande, VENDOR.md mit md5. Variante B zurückgestellt.

## Kurswechsel „finden statt bauen“, img2threejs-Brücke (2026-10-10)

- Post-Mortem `docs/POSTMORTEM_MVP1_STAGE1_R1.md`; Stufe 1 nach Lauf 03 (5,0) gestoppt.
- Pflicht-Schritt „Vorlage zuerst“ (QA §1a), Karte `docs/MVP1_DONOR_AND_MODEL_MAP_R1.md`.
- Webchat-Strang Asset-Kandidaten G1–G6 mit Bildgenerierung, Recovery und additivem Changelog (`deliveries/BRIEF_WEBCHAT_ASSET_CANDIDATES_R1.md`).
- img2threejs v2.0.0 getestet (`tools/img2threejs-tests/bridge01/`): Georg findet den Steinbogen „super, Richtung nehmen, 10–20 % fehlen“ → Richtungsreferenz für gebaute Formen; 234 k Dreiecke reduzieren.
- Prinzip Dioramen-Materialmix (Masterplan §0.2). WSA-Modellier-Test Treppe gebrieft. Stufe-2-Spielsysteme (Laufen, Kamera, Fahren, Ein- und Aussteigen) laufen aus Vorlagen.

## MVP-1 Stufe 1 und RKIT: erste Kritiker-Läufe (2026-10-10)

- **Lab Stufe 1 Lauf 02:** Q1–Q8 bestanden, Kritiker 4,29 (alle G 4–5, Silhouette 6). Teller-Look, Weltlogik Town nicht lesbar, Kegelberge, schwebende Relikte, identisches Sprenkelmuster, Moiré, harte Farbkanten. Reparaturrunde 1 mit Diagnose „reiner R2D-Port gegen Vorlage“. Formblatt R2 und Formsprache §2b umgesetzt; Erdschichten positiv.
- **RKIT Steinbogen Lauf 02:** Q bestanden, Kritiker 5,38 (U3 = 3, Fels-Anschluss). Letzte Reparaturrunde erst mit echtem Fels aus Stufe 1; bis dahin Gehweg/Bord-Pipeline neu und Fels-unabhängige Fixes.
- **RKIT Q-Rückprüfung:** alle alten Bauweise-Renders fallen durch (schwebender Rubbel, Durchdringungen, ungerundete Platten, Bordsteine 16–27 % im Boden). Renders werden gekennzeichnet; Bauweise bleibt gültig.
- **Protokoll:** Q9 (Mauerenden gebaut), Relikte bzw. Kleinteile in Q1/Q3; Silhouetten-Kamerasatz; Q5-Regel für Gelände-Körper.

## Steinbogen-Renders fehlerhaft, neue Bauqualitäts-Stufe (2026-10-10)

- Georg: Brücke und Track im Bauweise-Blatt v7 defekt. Befund der Steuer-Sitzung: verschmierte Bogensteine, Lücken in der Stirnmauer, schwebende Steine, nackter Fahrbahn-Kasten, keine Widerlager, lila Platzhalter-Kugeln. Die v7-Freigabe galt der Bauweise; die Renders hätte das Review stoppen müssen.
- Neu: `QA_CRITIC_PROTOCOL_R1.md` §1b, Stufe 0 Bauqualität Q1–Q7 als Messung vor jedem Bild, plus Kamerasatz „Nah“. Masterplan-DoD ergänzt.
- RKIT: Mängelliste und Neuaufbau `deliveries/RKIT_STEINBOGEN_MAENGEL_R1.md`, per Nachricht an die RKIT-Sitzung.

## Deck Library PR #384 und Clown J5 (2026-10-10)

- **PR #384 (WSA, `work/kfb-deck-library-r1-2026-10-09`):** Deck Viewer v5, 130 Deck-Shards (6.985 Karten), Arten Deck/Karte im Asset Librarian, Handoff `kfb.card-ref/1`. CI `build-test`, `build-validate`, `browser-smoke` grün. `Cloudflare Pages` rot, genauso wie auf `main` (Ursache: `wrangler.jsonc` `assets.directory: "."`, Repo 24.995 Dateien), also nicht durch diesen PR verursacht. Empfehlung Steuerung: mergen. Nachprüfen: Karte 1 bei mehreren Decks rechts abgeschnitten (Kontaktbogen).
- **Cloudflare:** eigener kleiner WSA-Auftrag: Asset-Verzeichnis auf einen öffentlichen Unterordner bzw. `.assetsignore`. Danach baut auch die öffentliche Seite `kayfabizarro.pages.dev` wieder aktuell.
- **Clown J5 (Blender MCP, #381):** three.js-Prop-Track-Player mit Headless-Beweis (Knochen bzw. Pins gegen Blender < 1e-5, Zustandsmaschine mit Talk-Fenster). Für Stufe 2 (Markt) unverändert übernehmen; Süßigkeiten-Props: Im Repo lag nur Halloween Bits 1.0 FREE ohne `candy_*`; jetzt ergänzt aus Bits Bundle 1.1 (CC0) unter `media/3D_Assets/KayKit_Bits_Bundle1_1.1/Halloween Bits/Assets/gltf/` (eigene Textur, Sync-Branch `29edff3c`); Augenprofil des Clowns ist AUTO_CANDIDATE und braucht die Figuren-Karte.

## Architektur-Review Post-MVP-Konzepte (2026-10-09)

- Gelesen: Fluff-Branch (v0.3–v0.7.1: Crafting/Almanac, Chill/Standard/Hard, Genesis/UFO, Angeln/Farm/Blast, Blast-Mining/Loot, lebende Props) und Academy-Branch (Reputation in sechs Stufen v1.1, Gatekeeper-Grammatik, Gott-Modus-Zensus, Holographic Foundry) plus Lean-Memory- und Deck-Pipeline-Verträge auf Main.
- Ergebnis `docs/REVIEW_POSTMVP_CONCEPTS_ARCH_FIT_R1.md`: passt, kein P0-Bruch. Im Lab-Code gibt es nur Autoren-Zustand, noch keinen Spielstand.
- Vier Datenfelder für `kfb.island-config/1` eingetragen (`worldId`, `decks[{deckId, role}]` mit Registry-IDs, Bewohner `{id, card, variant}`, Anker `{id, kind}` + `nodes[]`). Beispiel korrigiert: `embrace_protopia` statt PDF-Name.
- Masterplan §6b: Post-MVP-Spielschicht P0–P4. Georgs Entscheidungen: Lab ist Welt-Besitzer; alle Inseln im MVP offen; Town-Deck vorerst FrizzleBob’s Mission Control (Registry-Eintrag fehlt noch).
- Datumsfehler korrigiert: „2026-10-10“ → 2026-10-09 in sechs Lab-Dokumenten.

## Gott-Modus-Perspektive, A/B-Gate erledigt (2026-10-09)

- **Four-Island-A/B-Gate** (Bild-Varianten aus der Planung vom 08.10.) ist erledigt und durch den Masterplan ersetzt (Georg).
- **Worldbuilder bzw. Gott-Modus** als Perspektive nach dem MVP: `docs/SPEC_WORLDBUILDER_GODMODE_VISION_R1.md`.
  - **Inseln:** Archetypen in zwei Größen, Erweitern, Terrain-Transformer.
  - **Farbe:** Paletten würfeln oder ableiten, immer als Rollen.
  - **Verbindung und Reisen:** Track-Editor mit Track-Core-Anschlussberechnung, Portale und Taschenportal.
  - **Folge für Stufe 1:** Inseln werden als Rezept gespeichert, mit Ankern am Rand.

## MVP-Plan abgeschlossen (2026-10-09)

- **Masterplan R2.1** (`docs/KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md`) ist abgeschlossen. Georg-Entscheide:
  - **MVP-1 „Town + Protopia“ zuerst**, danach MVP-2 (Dystopia, Utopia, Flug, volles Audio);
  - Inselgrößen Town ≈ 40 × 40 MC, Satelliten 20–28 MC;
  - Sitz-Schicht im Lab über die Figuren-Karte;
  - Four-Island A/B erst in Stufe 3b.
- **Neu im Plan:** Definition of Done MVP-1, Ablauf nach dem Reset je Owner (§5b), Renderer-Entscheid (Lab bleibt WebGL r186, Vorhang auf eigener Fläche), Farbquelle `ENV_ROLES`.
- **Nächster Schritt:** Georgs Reset, dann baut Claude Code Stufe 1.

## WSA-Hub-Auftrag erledigt, Bewohner-Logik, Aufräumen (2026-10-09)

- **WSA-Work** (Return in `KFB_HUB/90_ARCHIVE/2026-10-09_wsa-work_hub-update.md`):
  - PR #380 gemergt (`720955a`), der Asset Librarian v10 lädt (16.054 Assets);
  - Hub-PR #383 gemergt (`909828e`, nur `kfb-hub/current-board.json`), der Production Hub läuft auf v11;
  - **Dropbox-Schreiben funktioniert.**
- **Nicht gemergt:** `sync/lab-rkit-2026-10-09`. Der Zielbaum hätte 25.702 Dateien; das Cloudflare-Pages-Limit liegt bei 20.000 (Free). Nächstes Gate: Tarif bzw. 100k nachweisen **oder** die Inbox-Ordner vom Deployment ausschließen (z. B. `.assetsignore` für `tools/KFB-ToolBox/_inbox/**`), dann gegen den aktuellen `main` neu prüfen.
- **Offen bei WSA:** FBX/OBJ-Vorschau (nicht umgesetzt), externe 3D-Suche (Draft-PR #382).
- **Bewohner (Georg):** Wiederkehrende NPCs neben FrizzleBob sind ausdrücklich gewollt.
  - Die Figuren sind reiselustig: Skelette arbeiten in verschiedenen Dungeons, die Orc-Band tourt, der Vampir-Lord fliegt als Fledermaus über die Inseln.
  - Gedacht wie eine Character-Cast-Serie mit Multiversum-Logik: je Welt bzw. Kontext andere Kostüme und Accessoires, dieselbe Figur performt ihr „Kayfabe“.
  - Die FrizzleBob-Regel der Character Bible gilt für Comics und Decks.
- **Aufgeräumt:** 67 ZIPs in `~/Dropbox/CLAUDE/`, deren Inhalt vollständig im gleichnamigen Ordner lag (je Datei geprüft), liegen jetzt im Mac-Papierkorb (`~/.Trash/KFB_zip_cleanup_2026-10-09/`, 493 MB, Liste `_MOVED_LIST.txt`). Sie sind wiederherstellbar; auch Dropbox behält sie unter „Gelöschte Dateien“. 22 ZIPs ohne gleichnamigen Ordner bleiben unangetastet.
- **Georg:** `gvw-hub.pages.dev` privat schalten (eigene Aufgabe).

## Clown-Jonglage J3 einsatzfähig (2026-10-09)

- **Georg: Clown-Jonglage mit TUNE einsatzfähig** für den Marktplatz von KFB Town, gegebenenfalls mit Flachwitzen über die ChatterBox.
- **Blender-Coworker hat eingecheckt:** Branch `blender-mcp/motion-forge-poc-01-2026-10-08`, Issue #381 (Commits `ed5c1d6` … `2a14028`). Inhalt:
  - RETURN + Katalog-Patch (MVP-Slice, additiv);
  - Prop-Tracks im glTF-Raum;
  - Rig_Medium-Clip-GLB;
  - Juggle-Builder und **KFB Eye-Guard-Skripte**;
  - Vorschau-Videos mit Keulen bzw. Knetbällen.
- Die Eye-Guard-Skripte sind ein erster Baustein des Validators aus `SPEC_CHARACTER_INTEGRITY_R1.md`.

## Content-Atlas und KFB_HUB (2026-10-09)

- **Drei Inventur-Agenten** (nur lesend): Berichte in `docs/content-atlas/` (A Decks-Korpus, B Engines/Tools, C Ordner/Vault). Zusammenfassung: `docs/KFB_CONTENT_ATLAS_R1.md`.
- **Funde:**
  - 20.837 Karten als JSON mit 20.705 Bild-Prompts;
  - Hannover-Decks A/B/C + `00_SHARED_SPINE.md` als Insel-Kanon (Vorschlag);
  - Mnemosyne's Quill (Warburg-Tafel-Generator, privates Repo);
  - NIE (~220 Module, privat);
  - ChatterBox + Triplet-Pool;
  - alte Hubs (VaultGvW, `_COWORKER_HUB`, Router) seit Juli bis September still;
  - 67 ZIP-neben-Ordner-Paare.
- **Neuer Hub** (Georg: passt): `~/Dropbox/CLAUDE/KFB_HUB/` mit `INDEX.md`, `projects.json` (`kfb.hub-projects/1`), `00_INBOX/<quelle>/`, `10_SSOT/` (Zeiger), `20_BRIEFINGS/<empfänger>/` (Zeiger), `30_DECISIONS/`, `90_ARCHIVE/`. Regeln: zeigen statt kopieren, ein Schreiber je Datei. Volle Einrichtung (Regeln je Chat, Schreibrechte testen) nach dem MVP.
- **Nicht öffentlich synchronisieren:** `docs/content-atlas/` und der Atlas (lokale Pfade, private Repos, sensible Deck-Titel).

## Problemfeld Figuren-Integrität (2026-10-09)

- **Georg meldet wiederkehrende Fehler** aus dem Blender-Coworker: Props nicht in der Hand (Stammtisch-Bierkrüge, früher Waffen), Originalaugen bzw. falsche oder keine Cartoon-Augen, Schielen, Augen zu weit aus dem Kopf. Approved-Eye-Rig-Konfigurationen (FrizzleBob v5) sind nicht persistiert.
- **Spec:** `docs/SPEC_CHARACTER_INTEGRITY_R1.md`. Figuren-Karte `kfb.character-card/1` als SSOT je Bewohner, kanonisches Eye-Rig (heute über zehn Kopien von `pet-eye-rig.v6.js`), Validator, Kamerasatz „Figur“. Slice nach dem MVP; im MVP Mindestprüfung für die sichtbaren Bewohner.

## Vorbereitung Stufe 1 (2026-10-09, vor Georgs Reset)

- **Bauplan:** `docs/STAGE1_R2D_PORT_PLAN.md`. Zuordnung R2D → Lab-Module (`src/island/r2d/`), `planFromSpec` aus Editor-Umriss und RKIT-Straßenbett, `IslandField` bleibt als Fassade (gezählte Aufrufer), S1 statt kfbLayer, Scholle v7 statt `buildBody`, eine Farbquelle `ENV_ROLES`. Dazu Reihenfolge in 8 Schritten, harte Regeln, Risiken.
- **Kritiker-Protokoll:** `docs/QA_CRITIC_PROTOCOL_R1.md` (blind, Kamerasätze, neue Inselkriterien G1–G7, Schema `verdict.json`, Auftragsvorlage, Bericht).
- **Satelliten:** Lageplan auf die MVP-Welt umgestellt (Environment), Stufe nach dem MVP. Abenteuer auf 02 Fluss-Camp + 08 Holzhacker-Hütte.
- **Infrastruktur nach dem MVP** im Masterplan-Backlog (Georg: bis dahin pragmatisch; Track Core bleibt privat, `RKIT-R3/private/` wird nie synchronisiert).

## GitHub-Sync (2026-10-09)

- **Branch `sync/lab-rkit-2026-10-09`** auf `georg-doc/kayfabizarro`:
  - `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/` (Lab-Snapshot, Einstieg `SNAPSHOT.md`);
  - `tools/KFB-ToolBox/_inbox/KFB Racetrack Blender Kit/RKIT-R3/` (inkl. `masonry_a`).
- Kein Merge, `main` unverändert.
- **Künftige Syncs** pusht die Steuer-Sitzung selbst über den Deploy-Key „KFB Lab Sync“ (nur dieses Repo). Arbeitskopie `~/KFB_GitHub_sync` liegt außerhalb der Dropbox.

## Recherche P2 Straßen (2026-10-09)

- **Bericht:** `docs/research/NOTEBOOKLM_P2_STRASSEN_DISKRET_GEBAUT_2026-10-09.md`.
- **Abgleich mit Track Core v0.13:** weitgehend bestätigt, an mehreren Stellen ist Track Core schon weiter. Vorhanden sind SPIRAL mit Easement, LOOP mit Führungsrahmen, KICKER/AIR/LANDING, Tunnel-Portalprüfung, Hermite-CONNECT, Fenster für Übergänge.
- **Übernommen:**
  - Rubbel nach Ursache und Verfallsstufen in `SPEC_EDGE_RUBBLE_GRAMMAR_R1.md`;
  - Handverlegt-Jitter und Ablauf an Tiefpunkten, an RKIT gemeldet;
  - Lab: Böschungsbreite am analytischen Straßenbett wächst mit dem Höhenunterschied (≈ 1 : 1,5, gerundet), Schürze ≥ 0,3 unter dem tiefsten Geländepunkt im Schürzenbereich.
- **Nicht übernommen:** DIN-Realmaße, taktile Platten, C++-Kern.

## Sprenkel-Kandidat S1 und Regeln R2 (2026-10-09)

- **S1 „Scheiben-Sprenkel“** (`src/clay/kfb-speckle.ts`): Maximum aus diskreten, gejitterten Knet-Scheiben statt der Differenz aufsummierter Gaußfelder. Schwelle kalibriert über eine Quantil-Tabelle (Abdeckung ≈ w). Ränder per `fwidth`, Randlinie nur an der sichtbaren Kante. Drei Größen nach außen, Mikro-Punkte nur in der Nähe (LOD), Rücktropfen in zwei Größen, kleine Ebenen dünnen mit w^1,5 aus. Die Flecken bleiben in der Welt fest, kein „infinite zoom“. Gleicher Vertrag wie `kfbLayer` (Gewicht → Maske).
- **Vergleich:** `/speckle.html` (Raster jetzt gegen S1 × Übersicht, Fahrhöhe, Laufhöhe), Einzelansicht `?solo=old|new&cam=…`, Renders in `docs/feedback/speckle/` (`tools/render-speckle.mjs`).
- **Regeln R2:** `docs/ETHERINGTON_REGELN_IN_ZAHLEN_R1.md` auf R2 (P3 übernommen bzw. abgelehnt), `QA_RULEBOOK_ENVIRONMENT_R1.md` §2b mit Tests E1–E7.
- **RKIT Mauerwerk-Familie A v1** liegt bereit: `~/Dropbox/CLAUDE/KFB Racetrack Blender Kit/RKIT-R3/masonry_a/` (31 Module, GLB + Manifest `kfb.masonry-family/1`, Übergabe Brick-Fish). Kritiker-Lauf steht aus.

## Bauweise-Blatt RKIT freigegeben · erste Recherche-Berichte (2026-10-09)

- **Georg: PASS für Bauweise-Blatt v7** („auch mit Rubbel-Eiern“). RKIT baut. TUNE später: Rubbel sichtbar aus den Platten gebrochen.
- **NotebookLM-Berichte** liegen in `docs/research/`: P1 Sprenkel, P3 Erdung und Komposition. Die Bewertung durch die Steuer-Sitzung steht im Chat vom 09.10.

**P1 Sprenkel:**
- **Übernehmen:** Ränder per `fwidth` glätten; Gewichte bzw. Splat statisch und nur in der Übergangszone rechnen; Formen als diskrete, gejitterte Scheiben (Worley bzw. Poisson) statt Felddifferenz.
- **Nicht übernehmen:** Flecken, die mit der Kameradistanz die Größe wechseln („infinite zoom“); widerspricht der Weltlogik eines gemalten Kleckses. Die Code-Beispiele sind nicht direkt nutzbar (Kreisraster, Gewicht fehlt, TSL braucht WebGPURenderer).

**P3 Erdung und Komposition:**
- **Übernehmen:** Mikro-Ebene 0,15; Tangenten-Test im Bildraum (≈ 5 px); Felsen am Hang ausgerichtet und geschichtet; Platzierung nach Ursache (Gefälle, Mulden); Parent-Child-Cluster mit Poisson; Vorlagen plus Streuung; automatische Tests (Erdung, Gruppengröße, Symmetrie, BMS).
- **Nicht übernehmen:** Alpha- bzw. Decal-Übergänge, Grasringe um Büsche, Meterangaben (K2 hat keine Meter).

## Clay Stage R2 + Billboards (2026-10-09)

- **Session-Cut:** `main` · `tools/KFB-ToolBox/_inbox/KFB Clay Stage + Curtain R2 - KFB Billboards Hypernormalisation+Quotes/kfb-clay-stage-session-2026-10-09/`. Georg: „passt so mit TUNE für später".
- **Module:**
  - `palette-roles.js` (Farbrollen für Tafeln und Bühne);
  - `billboards/kit.js` (7 Formfamilien, `recolor` ohne Neubau);
  - `curtain/clay-look.js` (kleidet den Vorhang-Kern ein: Stoff, Portal, Boden, Säulen, Schmuckvorhang).
  - `stage.js` und `host.js` sind nur Demo-Hosts.
- **Wunsch Georg:** ein Billboard je Insel im neuen Design und in der Inselpalette, mit Hypernormalization-Loops, Quotes und weiteren Darstellungsarten. Später diegetisch umschaltbar über Knöpfe an der Tafel.
- **Technik offen:**
  - Zwei three-Builds (Billboards 0.180 WebGL, Vorhang 0.186 WebGPU), es braucht eine Renderer-Entscheidung.
  - Der Vorhang-Kern ist ungepinnt.
  - Der Billboard-Bildschirm wurde nie live getestet (Boot hing in der Vorschau).
  - Eine dritte bzw. vierte Farbquelle neben `ENV_ROLES` muss zusammengeführt werden.

**HUD-Entscheidung (Georg, 09.10.):** Knet-Material übernehmen statt glattem Interface. Das HUD R3 sieht „okayisch" aus und kann mit TUNE genommen werden.

## HUD + Flug-VFX R3 von Claude Design (2026-10-09)

- **Session-Cut auf GitHub:** `main` · `tools/KFB-ToolBox/_inbox/KFB HUD Flight Board - Flight VFX/KFB_HUD_FLIGHT_SESSION_CUT_2026-10-09_r1/`.
- **Module:** `kfb-hud.js` (`createHud`, Modi, Fluff-Zähler, Radio-Events für den Audio-Owner), `kfb-flight-vfx.js` (Speedlines, Knet-Schub, Puff, `hoverPose`), `kfb-backpack.js` (20 Fächer, Kassettendeck; über das Briefing hinaus vorgezogen), `kfb-jukebox-data.js`. Gebaut für r170, im Lab auf r186 noch nicht getestet.
- **Sprint R4** vorgeschlagen. **Blocker R4-0:** fehlende Quellen. Die Antwort liegt in `deliveries/HANDOVER_HUD_FLIGHT_R4_0_SOURCES_2026-10-09.md` (Masterplan R2, ENV_ROLES, Pfad zu kfbBlend, Mauerwerk A noch nicht gebaut).
- **Owner-Frage R4-1:** K7 `lab-clay/clay-hud.v1.js` (27.09., Georg „top!") hat schon Tacho, Score und Rucksack mit 20 Plätzen. Empfehlung: ein HUD-Owner, K7-Material plus R3-Bauteile (Radio, Moduswechsel, Biom-Palette).
- **Offen:** Die Plaketten sind noch glatt statt Knet (R4-2), das echte Jetpack und die echte Figur fehlen (R4-4).

## Masterplan R2 und NotebookLM-Paket (2026-10-09)

- **Masterplan R2:** `docs/KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md` löst den R1-Plan ab. Neu sind die Grundsätze §0, Stufe 0 (Konzept-Gates), die zwei Randfamilien (Bord, Joyride-Bande), der Sprenkel-Befund, der Asset Librarian v10 und der Recherche-Anschluss.
- **Neue Regeldateien:** `docs/ETHERINGTON_REGELN_IN_ZAHLEN_R1.md` (Arbeitsfassung, wird über Recherche P3 geprüft); §01 „keine harten Schnitte“ in beiden QA-Regelwerken; Darstellungsregel (3D-Render mit Profilschnitt) im Übergangs-Regelwerk §1.
- **NotebookLM-Upload:** `deliveries/NOTEBOOKLM_UPLOAD/`, ein flacher Ordner zum Hochladen mit 28 einzelnen Markdown-Dateien (eine je SSOT-Dokument, nummeriert) und 18 Bildern. Er wird erzeugt mit `python3 tools/build-notebooklm.py` (keine zweite Ablage; nach Änderungen neu bauen). Georg: keine Bündel-Dateien, kein Lies-mich.
  - **Neue SSOT-Dateien:** `docs/KFB_PROJEKTKONTEXT.md`, `docs/KFB_GLOSSAR.md`, `docs/KFB_TECHNIK_UND_SCHNITTSTELLEN_R1.md`, `docs/KFB_PAINPOINTS_UND_BLINDSPOTS_R1.md`, `docs/notebooklm/KFB_DEEP_RESEARCH_PROMPTS_R1.md`, v5-Renders in `docs/feedback/`.
- **RKIT Bauweise-Blatt:** v5 TUNE (Georg). v7 ist vorgelegt (Sandbett nur in den Fugen, Bandenkappe als Wulst, Verziehung über die Rinne, echte Steinkörper). Die Knetflecken ruhen, bis Georg die Referenz liefert.

## Environment Kit R1 · Gates E1 + E2 (2026-10-08) · PASS mit offenen Punkten

- **Code:** `src/environment/` (`kits.ts` Intake + Normierung, `biomes.ts` Artentabellen, `place.ts` Grammatik, `material.ts` Clay + Umfärben, `index.ts` `buildEnvironment()` nach Spec §11). Ersetzt den NatureBuilder; `?env=old` zeigt den alten zum Vergleich, `__kfb.env('kit'|'old')` schaltet live um.
- **Intake:** nur genutzte Dateien unter `public/assets/env/{quaternius,kaykit-forest,tinytreats}/`, je mit Lizenz (KayKit Forest hat keine im Paket, CC0-Vermerk ergänzt). FBX werden direkt geladen.
- **Maßstab:** jede Art einmal auf die Bandmitte ihrer Rolle in H normiert (Quaternius-Faktoren 0,012–0,083 auf cm, KayKit/TT 0,5–8). Danach Varianz nur aus der Platzierung. Prüfung: `__kfb.envSizes()` (pro Art: Band, Normhöhe, Instanzhöhen in H, Einsinken, Dreiecke) und `__kfb.sizes()` (Einträge `env:<Insel>:<Art>`).
- **Look:** Kit-Farbe bleibt in der Vertexfarbe (FBX-Material bzw. KayKit/TT-Atlas am UV gelesen, Dateien unverändert), dazu Slot Laub/Stamm/Stein/Blüte/behalten + Helligkeit relativ zum Slot. Der Shader färbt auf die Insel-Palette um; Schnee und Birkenrinde bleiben. Clay K2 `nature`, Relief folgt der Instanz.
- **Mischtest (`?envmix=1`):** Auf Übersichtsdistanz trägt Palette + Clay beide Stile, aus der Nähe bleibt facettiert (Quaternius) gegen weich (KayKit/TT) sichtbar; das Clay-Relief liest auf den weichen Kits deutlich besser. **Urteil: Kits pro Biom.** Quaternius: Wald (Canyon), Wüste (Pyramide), Herbst, Schnee. KayKit + Tiny Treats: Park/Stadt (O-Town), Strand (Bucht). Nie zwei Kits in einer Gruppe (geprüft: `groupsWithTwoKits = 0`). Biom-Override: `?biome=otown:autumn,canyon:snow,bucht:beachQ`.
- **Platzierung:** Zonen, 3–4 Rule-of-Three-Gruppen (Anker 1,2–1,4, drei Stützen 0,7–0,9, Füller, Akzent), Übergangs-Cluster ohne Einzelgänger, Weg-Begleiter, 2–4 Randsteine (Anschluss `connector` bleibt frei). Palmen an die Oase, Kiefern an den Berg. Fuß auf tiefster Bodenstelle, 5–15 % eingesunken. `__kfb.envCheck()`: nichts schwebt, nichts im Wegbett/Wasser/Freifläche, Landmarke überall höchstes Element.
- **E2 · Instanzierung:** je Insel zwei `BatchedMesh` (Schattenwerfer = Anker + Randsteine, Rest nur Empfänger). Pro Instanz in einer Daten-Textur: Gruppen-ID, Phase, Steifigkeit, Paletten-Slot (für E3–E5).
- **Messung Übersicht, 4 Inseln** (`__kfb.passes()` trennt Haupt- und Schatten-Pass):

  | Natur | Calls Haupt / Schatten | Dreiecke Haupt / Schatten |
  | --- | ---: | ---: |
  | vorher (NatureBuilder) | 25 / 25 | 145 k / 145 k |
  | nachher (Kit R1) | 8 / 4 | 51 k / 16 k |

  Budget ≤ 16 Calls und ≤ 120 k Dreiecke pro Pass: eingehalten, Reserve für das Gras (E4) 8 Calls / ≈ 69 k. Ganze Szene pro Frame: 158 → 120 Calls, 483 k → 261 k Dreiecke.
- **Korrektur Inspector Proof 01:** Die dort genannten „289 k Dreiecke / 50 Calls pro Pass“ waren pro Frame (Haupt- + Schatten-Pass); `renderer.info` zählt beide.
- **Offen:**
  - Die Landmarken-Regel (kein Baum höher; im Blickkegel ≤ 60 %) drückt die Anker auf Canyon (Wassermühle 2,37 H) und Bucht (Taverne 2,3 H) unter das Anker-Band 2,5–4 H. Löst sich mit der K2-Hochskalierung der Gebäude.
  - Kleine Bäume werfen nach Regel keinen Schatten; aus der Nähe prüfen, ob sie schweben wirken (sonst Kontaktschatten aus E6).
  - Canyon-Randsteine (`Rock_Moss`) lesen als geschichtete Blöcke; Quaternius-Laubbäume kosten bis 2,9 k Dreiecke (`CactusFlower_1` 2,1 k, deshalb gestrichen).
  - Recipe-Overrides (Gruppe verschieben/löschen) sind in `placeEnvironment` vorbereitet, aber noch nicht im Editor.
  - Für E3 braucht der Deformer ein eigenes `customDepthMaterial`, damit Schatten mitbiegen.

## MVP-Slice „Drive Loop“ R1 (Plan, 2026-10-08 nachts)

- Plan: `docs/MVP_DRIVE_LOOP_R1_PLAN.md`. Heimat ist das Lab, später GPT-Site per Work-Job, GitHub bleibt SSOT-Hub.
- **Welt:** KFB Town groß in der Mitte mit Ringstraße an der Inselkante, Auffahrten zu Dystopia, Utopia und Protopia in verschiedenen Höhen, Rennstücke (Looping, Sprung) in den Zwischenräumen, Rand-Rhythmus aus der Geschichte je Insel.
- **Fahren:** Retro Cars + J17-Cabrio mit FrizzleBob; den Drehfehler um die eigene Achse vor Stufe 2 beheben.
- **4 Stufen:** Grundlage → Ring → Loop → Klang + Gefühl, jede mit harten Regeln, blindem Kritiker und Georg.
- **Story-SSOT:** `docs/story/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md` (lokale Kopie von GitHub).

## Georgs Story-Richtung (2026-10-08 nachts)

- **Geschichten kommen aus den Decks:** Utopia, Dystopia, Protopia (lokal `docs/decks/*.json`, 56 Karten je Deck), metanarrativ, cartoonig, weird und offbeat.
  - Dystopia: dunkle zerklüftete Berge, Pentagramm, Demon Lord auf dem Thron.
  - Pyramide: Mumien aus dem Mumien-Dungeon entkommen, Ankh, halb verwehte Sphinx mit Cartoon-Augen als Orakel, Limonadenstand an der Oase.
- **Billboards** sind Insel-Signatur neben der Landmarke (Hypernormalization-Loops, später im MVP).
- **Bucht = echte Strandszene** mit Meer bzw. Fluss über die Kante (fluid.js F2–F4), kein Tümpel.
- **Mit den gekauften Vorlagen arbeiten:** Die 8 StreakByte-Demo-Szenen werden komplett im Lab nachgebaut (`/demo-scenes.html`, Environment-Sitzung). Erst danach entstehen Biom-Vorlagen und Erzählraster aus Deck und Vorlage.

## ENTSCHEIDUNG: Inselgrundlage auf R2D v0 + Scholle v7 (2026-10-08 nachts)

- **Georg:** Probe v2 „durchgängiger Fail, schlampig gebaut“; die Lab-Inseln sind ein Rückschritt gegenüber R2D v0 und R2B.
- **Ursache:** Das Lab-Gelände (Delaunay, Vertexfarben-Verläufe, Grasband als eigener Ring, eigene Unterseite) ist eine zweite Wahrheit neben der Claude-Design-Bauanleitung.
- **Quelle:** `donors/kfb-island-kit-r2-2026-10-08/` (BAUANLEITUNG.md §0–§11, `KFB_R2D_v0/island.js`, `scholle-bench.js`, `KFB_Island_Kit_R1/kit/fluid.js` F0–F2 PASS).
- **Plan nach dem Reset:**
  1. R2D v0 auf three r186 im Lab lauffähig machen (Bauanleitung OPEN 3).
  2. Lab-Inseln darauf umstellen: Umriss-Editor → `planIsland`/SDF, Paletten + `ENV_ROLES` → `BIOMES`-Zeilen, Polarnetz + Draufsicht-Farbkarte + `kfbLayer`, Viertelkreis-Kante, Scholle v7.
  3. Adapter erhalten: `height()`/`base()`/`isClear()`, Straßenbett analytisch wie R2D, mit RKIT vereinbart:
     - `hw` und `roadY` **je Station** aus den `sections`: hw = Abstand von Stützpunkt 6 zur Achse; keine konstante Breite.
     - Lab macht die Böschung: lerp auf roadY − 0,35 über hw … hw + 7. RKITs Körper endet mit einer Schürze ≥ 0,3 unter dem Gelände.
     - T2 neu: (a) Schürzentiefe min ≥ 0,3, (b) Gelände an hw ≥ 0,05 unter der Gehweg- bzw. Bankett-Oberkante, (c) kein sichtbarer Spalt aus den §4-Kameras.
     - RKIT wartet danach auf neue Felsprofile (Viertelkreis + Scholle v7) für die Kämpfersitze.
     - Brückenbuckel bis 8 % Steigung (Georg)., Embeds als analytische Höhe + `aTW`-Gewichte (kein `contact`-Verlauf).
  4. Gebäude und Bewohner darauf neu setzen, K2-Katalog umstellen.
  5. Danach Environment (Erzählraster §10) und RKIT darauf.
- **Zweite Übergangsart (Georg):** Zackenkappen für Schnee und Frost, als harte Maske mit gewellter Grundlinie, Zähnen bergab, zwei versetzten Lagen und mehr Schnee im Schatten und in Mulden, entzackt per `fwidth`. **Nach §01 (2026-10-09):** Zähne als gerundete Knetzungen, hart nur der Knetrand wie bei `kfbBlend`, nie eine gerade Linie; an den Spitzen lösen sich kleine Knetflecken; kein Verlauf. In Cozy- bzw. Weihnachts-Kontexten Flocken über `kfbLayer`.
  - Umsetzung im Gelände-Shader beim Umbau. Die Biom-Zeile bekommt `transitions: { ground: 'sprenkel', snow: 'zacken' | 'flocken' }` (siehe `docs/ENV_ERZAEHLRASTER_R1.md` §8).
  - Referenz: `docs/style-references/georg_2026-10-08_schneekuppen_zacken.png`.
- **Böschung (Georg, präzisiert, `docs/ENV_ERZAEHLRASTER_R1.md` §9):**
  - Form: natürliche Viertelkreis-Rundung von der Oberseite in den Erdfels.
  - Übergang über `kfbLayer`-Dots, auf der Oberseite oder über die Rundung. Gras wächst ein Stück über die Böschung und geht in Erde über; Schnee-Biom: Rand abgetaut, über Tropfen in Erde.
  - Vorerst keine modellierten Unebenheiten.
- **Inselkante:** Für den Umbau reicht der Text (Bauanleitung §5, KONZEPT_R2 §2, R2D RETURN v3–v5). Georgs Bildserie mit sauberer Böschung wird die Abnahme-Referenz für den Kritiker. Sie blockiert nicht.

## Gelände-Einbettung (2026-10-08 spät)

- **Georg hat das Environment-Bauweise-Blatt „Wie liegt was in der Landschaft“ freigegeben.** Hook `field.addEmbed()` ist gebaut (`terrain.ts`): Kinds `boulder` (Erdkeil bergauf), `outcrop` (Halde bergab), sonst symmetrisch; konkaver Anlauf, dichte Abtastung am Fuß; `island.rebuildGround()`.
- **`rim`-Einbettung gebaut:** Band entfällt unter dem Randfels, Gelände läuft an. Dazu `contact` (dunklere Erde als Vertexfarbe) und Bergkuppe in Steinfarbe aus `ENV_ROLES`. Environment-Probe v2 (`/probe2.html`) nutzt den Hook. **Überholt** nach §01 und Bauanleitung §11 (Kontaktband als Verlauf, `contact`-Abdunklung): nur Erdungs-Studie, keine Vorlage; beim R2D-Umbau entfällt `contact`.
- **Neuer Grundsatz:** `docs/SPEC_EDGE_RUBBLE_GRAMMAR_R1.md` (kfbBlend + gerundete Abschlussstücke + Knet-Rubbel für Straßen, Natur, freistehende Räume, Fluff-An- und Abbau). Nächster Proof nach dem Reset: freistehender Raum 2 × 1 MC mit Anbau-Schritt.
- **kfbBlend** (Knetfleck-Übergang, `src/clay/kfb-blend.ts`) ist für organische Oberflächen-Wechsel gesetzt (Georg/RKIT). Performance-Hinweise siehe Chat: nur in Übergangszonen rechnen, statische Übergänge backen, günstiger Hash.

## Stand für den Neustart (2026-10-08 abends)

- **Straßenbett-Naht `kfb.road-bed/1` mit RKIT vereinbart:**
  - RKIT liefert JSON (+ GLB), das Lab schneidet Gelände, Wege und Rand. Environment liest nur `field.isClear(x, z)`.
  - Das Format nutzt Inselkoordinaten mit `outlineHash`, `seam` mit `falloff`, `anchors`, `rim` mit `rootDepth` und `clear`.
  - **Testinsel `rkit_hub`:** nur zur Laufzeit über `?hub=1`. Umriss in `public/roadbeds/rkit_hub.outline.json` (Hash `fnv1a32:a55e4d41`), erzeugt mit `tools/export-outline.mjs`; Code in `src/island/roadbed.ts`.
  - **Gelände-Schnitt gebaut:** `src/island/roadbed.ts` + `terrain.ts`.
    - Laden über `public/roadbeds/index.json`, Hash-Prüfung, cdt2d mit der Naht als feste Kante.
    - Boden läuft mit `falloff` auf die Nahthöhe, Band-Aussparung an `rim`, Inselweg ab der Naht vor dem Anker, `field.isClear()`.
    - Straßen-Vorschau aus den Stationen, bis RKITs GLB kommt.
    - Messung `__kfb.measureRoadBed(id)`, Anwenden `__kfb.applyRoadBed(id, spec)`.
  - **Gemessen auf `rkit_hub`:** T1 = 0 Dreiecke über Fahrbahn, Bordstein oder Gehweg (Kurven-Innenseiten 0); T2 = 244/244 Nahtpunkte und 242/242 Kanten im Netz, Höhenfehler 0.
  - **Offen bei RKIT:** D2-Teil über die Böschung, Wurzel-GLB für C2, Naht im C2-Bereich am Rand enden lassen.
  - **Brücke (Georg):** Steinbogen aus dem Fels mit Kämpferbank, Knetstein-Bogen, Zwickelwänden, Brüstung und Flügelmauern.
    - Inselfels-Daten dafür: `public/roadbeds/rkit_hub.rim-profiles.json` (Längs- und Querprofile je Brückenwurzel) und `rkit_hub.island.glb`, erzeugt mit `tools/export-rim.mjs`.
    - RKIT-Atlas v0.15 ist FAIL; als Nächstes kommt das Bauweise-Blatt mit Baugeschichte je Eintrag.
  - **Grundsatz §00 „Weltlogik zuerst“** steht in beiden Regelwerken; dazu das Kritiker-Kriterium K9 bzw. U8, Pflicht ≥ 7.
  - Der Absturz des Natur-Codes auf `rkit_hub` ist behoben (Environment-Sitzung): Kurze Wege nach dem Clip und leere Inseln sind abgesichert, `rebuildEnvironment` fängt Fehler ab. `?env=old` ist nicht mehr nötig.
- **GitHub, Asset Library (WSA-Work, erledigt):**
  - Quaternius Ultimate Nature ist ausgepackt, der Librarian hat 16.029 Assets, ZIP-Uploads werden künftig automatisch ausgepackt, Refresh-Knopf vorhanden (PR #377, #378).
  - Folgeaufträge in `deliveries/`: externe 3D-Suche (`HANDOVER_WSA_EXTERNAL_3D_SEARCH_FOLLOWUP`), FBX/OBJ-Vorschau (`HANDOVER_WSA_FBX_OBJ_PREVIEW`).
  - **Stand 2026-10-09 (WSA-Work, verifiziert):** Asset Librarian v10 live unter https://kfb-asset-librarian.frizzlebob.chatgpt.site/ (kanonischer Produktstand; Cloudflare-PR-Vorschau irrelevant). Draft-PR #380 auf `bd4c99b5`, offen und ungemerged, beide Actions grün. Data-only-Refresh ohne Site-Republish; private Storage-/File-IDs bleiben draußen. Production Control finalisiert (`4662de68-136e-400b-be50-1855f6ee1c87`).
  - **Alltag:** Neue Songs, Texturen, Animationen und ZIPs brauchen keinen Work-Lauf mehr. Weg: Intake → Handoff → private Inbox/Registry → Live-Refresh. Offen bleibt nur der direkte Upload von der Site in die Inbox (Connector-Berechtigung fehlt). Bis dahin erzeugt die Site den Handoff, die Datei bleibt lokal.
- **Georg-Urteil:** Der Natur-Look der Environment-Sitzung ist komplett abgelehnt, die RKIT-Übergänge sind gebastelt.
- **Regelwerke (verbindlich):** `docs/QA_RULEBOOK_ENVIRONMENT_R1.md` und `docs/QA_RULEBOOK_TRANSITIONS_R1.md`. Konzept-Gate vor Code (Biom-Blatt bzw. Atlas-Bildpaare), harte Messregeln, blinder Kritiker mit Punkten (bestanden ab Mittel ≥ 8, kein Wert < 6), Stopp nach 2 erfolglosen Reparaturen.
  - Beide Sitzungen sind informiert; Environment ist angehalten bis zu den Biom-Blättern.
  - **Nach Georgs Reset:** Kritiker-Läufe starten (Workflow oder je eine Kritiker-Sitzung).

## Maßstab-Kontrakt K2 (2026-10-08, später)

- **Georg entscheidet:** Figuren bleiben, alles andere wird nach der Tür-Regel hochskaliert, Inseln werden größer.
- **Kontrakt:** `docs/SCALE_CONTRACT_K2.md`. Keine Meter mehr, Maße sind H (Medium-Figur = 3,64) und MacroCell (4 KayKit-Einheiten = 6,4 = Dungeon-Modul = Stockwerk). Kette: Asset → Kit-Faktor → KayKit-Einheit → × 1,6.
- **Messungen:** Aufreihung `lineup.html`, Audit `docs/SCALE_AUDIT_R1.md`. Tiny Treats = KayKit-Einheit (Faktor 1,6). Hex-, Builder-, City- und Snow-Gebäude sind Miniaturen (Faktor ≈ 5–9 auf KayKit-Einheit).
- **Rennstrecke:** Korrektur für RKIT Gate 1 in `docs/RKIT_GATE1_SCALE_NOTE.md`. Die RKIT-Sitzung hatte die falschen 1,9 m übernommen.
- **Seed World Destruction POC:** Umrechnung POC × 1,65 = Lab; die POC-Tür ist mit 1,0 H zu niedrig.
- **Offen:** Katalog und Inselgrößen umstellen, mit Migration der gespeicherten Welten. Rennklasse Welt gegen Joyride entscheiden. Automatischer Maßstabs-Wächter im Lab.

## Maßstab-Kontrakt K1 und Environment-Entscheidung (2026-10-08)

- **Maßstab K1** (`src/scale.ts`): 1 Einheit = 1 m. Ein KayKit-Kit hat einen Faktor für Figur und alle Requisiten (1,6, Figur ≈ 3,6 m). Sarkophag, Krüge und Ankh hatten eigene Faktoren (2,2 / 3), das war der Grund, warum die Mumien zu klein wirkten. Sitzplätze sind jetzt in lokalen Einheiten des Gastgebers angegeben und skalieren mit. Gespeicherte Welten werden einmal migriert (`scale-k1`). Prüfung: `__kfb.sizes()`.
- **Pyramide:** Die Vergrößerung war nie wirksam, weil der Aufruf fest 22 m übergab. Jetzt hat sie 40 m Basis (+80 %); 58 m ragte über den Inselrand. Der frühere Eintrag „58 m“ war falsch.
- **Vor MVP offen:** KayKit-Hex- und City-Gebäude haben eigene Faktoren (4,2–6), ihre Türen passen nicht zur 3,6-m-Figur. Regel: Tür ≥ 1,1 × Figurhöhe, wo Bewohner hineingehen; sonst ist das Gebäude Kulisse.
- **Environment:** Natur kommt aus fertigen CC0-Kits (KayKit, Kenney, Tiny Treats), instanziert, mit Cartoon-Deformer, Wind-Gruppen, Musik-Visualizer, Grasbüscheln, Rule of Three und Etherington-Q&A. Spec: `docs/SPEC_ENVIRONMENT_KIT_R1.md`. Sie ersetzt Teil A des Claude-Design-Briefs.
- **Inspector:** Fenster lassen sich an der oberen Leiste verschieben. Vorher sprangen sie beim Ziehen zurück; die Startposition rechts wird jetzt über die eigene Drag-Logik gesetzt. Test: `tools/dragtest.mjs`.

## Inspector Donor Proof 01 (2026-10-08) · PASS mit Patch

- `?inspect=1` hängt three-inspect 0.7.2 (MIT) an die echte Szene: Szenenbaum, Objekt-Auswahl, Perf-Monitor (rechts, verschiebbar). `__kfb.profile()` misst pro Materialklasse. Code: `src/inspect.ts`.
- **Kompatibilität:** three-inspect bündelt ein altes troika-Text, das auf three r186 abstürzt (`customDepthMaterial` nur Getter). Lösung ohne Fork: Vite-Transform in `vite.config.ts` ergänzt einen leeren Setter. three-inspect ist von `optimizeDeps` ausgenommen.
- **Messung (Übersicht, 4 Inseln):** 160 Draw Calls und 483 k Dreiecke pro Pass. Der Schatten-Pass verdoppelt das auf 320 Calls und 967 k Dreiecke pro Frame.

  | Klasse | Calls | Dreiecke | Materialien |
  | --- | ---: | ---: | ---: |
  | Natur (eigene Kugelbäume) | 50 | 289 k | 25 |
  | Gebäude | 49 | 63 k | 16 |
  | Gelände oben | 8 | 52 k | 1 |
  | Bewohner | 29 | 38 k | 23 |
  | Wolken | 1 | 26 k | 1 |
  | Grasnarbe, Unterseite, Wege, Wasser | 21 | 16 k | 9 |

- **Zeiten:** GPU-Timer in Headless Chrome streuen stark. Stabil über alle Läufe ist nur, dass Natur und Gelände oben den größten Grenzanteil haben. Belastbare Millisekunden gibt es nur im echten Chrome über den Perf-Monitor.
- **Folgerung:** Die selbstgebaute Vegetation ist 60 % der Dreiecke. Abhilfe ist der Ersatz durch das Claude-Design- oder KayKit-Kit, ohnehin geplant, plus Instancing. Schnelle Hilfe: Kugelsegmente senken, kleine Büsche nicht in die Schattenkarte.

## Stand 2026-10-08

- **Inseln:** Umriss-Editor, Joyride-Paletten + Wüste, gemessene Unterseiten-Regel (`docs/ISLAND_ANATOMY_RULES.md`), Clay-Look der Unterseite, runde Grasnarbe, Wege mit ausgeformten Enden und Randanschluss.
- **Pyramiden-Insel:** 40-m-Stufenpyramide (7 Stufen, helle Spitze als Sockel für das KFB-Auge), Oase, Palmen, Sarkophag.
- **Bewohner:** Port aus Resident Atlas R2/S17: NoEyes-Figuren + KFB Eye-Rig v6 + Clay K1/K2, Handrequisiten, Sitzplätze. Mumien fertig; 26 weitere Figuren in `KFB Resident Atlas S16/NPC_SETTINGS_01/EYE_CLEANUP_02/glb/`.
- **Fahrzeuge:** Retro Cartoon Cars (6 m) im Katalog.
- **Schatten:** globaler Saum-Fix (FrontSide, normalBias 1,2 × Texel).
- **Originale:** StreakByte-Inseln als Vergleich, in Joyride-Farben mit Clay.

## Offen

- Natur → Environment Kit R1: E1 + E2 erledigt (siehe oben); E3–E6 offen. Pyramide, Wasser, Unterseiten-Zapfen → Claude Design (Brief verschickt, Teil A entfällt).
- Gebäude-Maßstab gegen Figur (Türen) vor MVP klären.
- Platzierungs-Grammatik → WSA/MVP (Spec geschrieben).
- Straßen zwischen den Inseln → RKIT-Sitzung, danach Anschluss an `IslandField.connector`.
- Weitere Bewohner mit Eye-Rig; großes KFB-Auge auf der Pyramide.
- NPC-Activities (Blender MCP, Status TUNE) fürs nächste MVP einplanen.
- Bewohner sind auf ihren Inseln statisch: Bewegung zwischen Inseln (Taxi, Bus, Besuche) später.
