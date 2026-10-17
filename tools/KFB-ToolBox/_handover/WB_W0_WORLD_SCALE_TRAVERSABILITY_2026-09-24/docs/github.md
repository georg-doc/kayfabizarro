repo: georg-doc/kayfabizarro
branch: main
path: tools/KFB-ToolBox/_handover

secondary: georg-doc/KFB-Travel-Globe (main) — implementation SSOT, read-only for this project

## Last sync
date: 2026-09-24T04:30:00Z

### Updated in this project (WB-W0 · World Scale + Traversability Proof, 2026-09-24)
- Neu: `KFB WB-W0 · World Scale + Traversability.dc.html` + `w0-boot.js` · `w0-region.js` · `w0-globe.js` · `w0-actor.js` · `w0-ink.js`. Köln dom-zentrum-v0, Racer-Route CP0→CP2 (241 m, 18,0 m), GothGirl 2,211 m, KayKit-Tür 2,80 m, Tiny Treats ×1,12, Kenney ×14,286, unveränderter Travel-walk-controller (Rampentest → 25°). 10/10 Gates PASS im Preview, Abnahme offen.
- Rückgabe: `returns/WB-W0_2026-09-24/` (code/, evidence/, RETURN.md, CHANGELOG.md, SOURCE.json).

### Updated in this project (WorldBuilder v1 · Slice 1 → HUMAN_REJECTED_FOUNDATION, 2026-09-24)
- Georg: falsche Grundlage, nicht weiterpatchen. Claude-Coworker-Briefing als FAIL eingestuft.
- Additiv ergänzt unter `returns/WORLDBUILDER_V1_2026-09-24/`: `POST_MORTEM.md`, `NEXT_GATE_WB-W0.md`, `evidence/` (8 Screenshots), Statuskopf in RETURN.md, `status` in SOURCE.json, CHANGELOG-Eintrag. `code/` eingefroren.
- Nächstes Tor: WB-W0 · WORLD SCALE + TRAVERSABILITY PROOF — nicht begonnen.

### Updated in this project (WorldBuilder v1 · Slice 1 · planet foundation, 2026-09-24)
- New `KFB WorldBuilder v1.dc.html` + `wb1-boot.js` · `wb1-planet.js` · `wb1-sky.js` · `wb1-buildings.js` · `wb1-actor.js`: stylised-Earth planet (R 400 m, metres throughout), one-parameter continuous orbit⇄ground flight, WB2 sculpt on the sphere, edit-layer objects from registry shards, TinySkies sky/weather/moods, Hürth buildings in 4 views, GothGirl walk + EyeRig v6, save/load.
- Donors: WB2 sculpt + edit-layer @8922d4b1, ZyFou @f58a8ddb (MIT, via WB2), TinySkies globe-v13 @main, Elastic V2 @0c59e92d, palette @b7f28824, Eye-Rig-Batch @cloudflare-live.
- Return package: `returns/WORLDBUILDER_V1_2026-09-24/` (code/, CHANGELOG.md, RETURN.md, SOURCE.json).

### Updated in this project (Billboard B0 Source Proof · Karten-Platzierung korrigiert, 2026-09-24)
- Recovery-Pass auf einen überbauten Vorgängerstand (Inspector-Panels, Debug-Karten, ungeprüfte
  Card-Pipeline) auf B0-Scope zurückgeführt: Beweis, nicht Komposition. Neu:
  `KFB Billboard Media Szene · B0 Source Proof.dc.html` + `bb0-boot.js`, geteilter Owner
  `bb-scene.js` (unverändert aus dem GATE-1-Build: `HERO_DONORS`, `renderCardQuarter()`,
  `buildStage()`).
- Zwei Korrekturrunden zur Kartenplatzierung, beide von Georg angestoßen: Panel saß zunächst
  schräg/versetzt neben der echten Werbefläche (falsche Pivot-Annahme), dann mit Rand
  (geschätzte statt gemessene Panelgröße, Donor ist EIN gemergtes Multi-Material-Mesh, keine
  isolierbare Ad-Face-Node). Gelöst durch Live-Vermessung der `tankco`-Materialfläche
  (Index-Buffer + drawRange, im laufenden Preview gemessen): exakt `4,20 × 2,10`
  Welteinheiten, volle Modellbreite, obere Modellhälfte. Panel jetzt deckungsgleich, Donor-
  eigenes "TANKCO"-Platzhalterbild vollständig verdeckt, Kartentextur randlos per Cover-Crop,
  keine Metadaten-Einblendung mehr. **Von Georg abgenommen.**
- Vollständiges Handover (Code-Kopie, RETURN/CHANGELOG/POST_MORTEM/SOURCE.json) für WSA Lead
  Chat unter `returns/BILLBOARD_B0_SOURCE_PROOF_2026-09-24/`.
- Offen, angesagt für den nächsten Schritt: Cartoon-Anatomie der Kartenmotive und 3D-Modell-
  Proportionen aneinander angleichen ("beide etwas runter") — bewusst nicht weiter dokumentiert.

### Updated in this project (Billboard / Media Residency Szene · GATE 1, 2026-09-23)
- Auftrag: `tools/KFB-ToolBox/_handover/CLAUDE_BILLBOARD_MEDIA_DESIGN_2026-09-23/{START_HERE,CLAUDE_DESIGN_BRIEF}.md`.
  Claude-Design-Slice, kein Runtime-Build: ein Mini-Diorama mit einem echten Billboard-Donor als
  Held, sichtbar in drei Inhaltsmodi (CARD/PDF, TRIPLET, COLLAGE LOOP) plus DEFAULT→INSPECT→REVEAL.
- Neu: `KFB Billboard Media Szene.dc.html` + `bb-scene.js` + `bb-boot.js`. Eigener Three.js-Host
  (three@0.160.0, wie `diorama-boot.js`), freier Orbit + Hero-/3-4-Kamera-Vorgaben.
- Hero: Kenney-Racing-Kit Billboard-Familie, 4 echte Varianten durchschaltbar (`billboard.glb`,
  `billboardDouble_exclusive.glb`, `billboardLow.glb`, `billboardLower.glb`), gepinnt
  @378b209355b13304e3cff656ec0806ca5b89df28 (`registry/assets/v1/packs/kenney-racing-kit.json`).
  Panel-Messtechnik (Box3 → Zielhöhe → Panel vor der Tafel) route-los aus `buildBillboard()`
  nachgezogen. `overhead.glb`/`overheadLights.glb`/`bannerTower*.glb` geprüft, für dieses
  kompakte Diorama bewusst NICHT verbaut (Torbauten brauchen eine spannende Fahrbahn) — Lücke
  benannt statt stillschweigend übersprungen.
- Karte/PDF: `renderCardQuarter()` aus `KFB Cologne Race Option C-2/lab-v9/cologne-props.v1.js`
  route-los neu geschrieben (Original braucht `route.sampleAt()`), sonst identisch: dieselbe
  Registry `media/kfb/index.json`, dieselbe pdf.js-Version 4.7.76, derselbe Viertelseiten-Schnitt,
  derselbe CARD_POOL (forget_utopia #7 · embrace_protopia #12 · medkayfab_cardiology #5).
- Requisiten: Fels ×2 + Busch über den echten Owner-Weg dieses Projekts (`wd-registry.js` Shard-
  Pick + `wd-donors.js` `mountAsset()` → atlas.js/kit-lab.js), mit ehrlichem prozeduralem
  Rückfall bei Ladefehler. Laterne = `lightPost_exclusive.glb` (gleiche Kenney-Familie).
- Persona/Slogans (TRIPLET) sind Beispieltext ("UNCLE FRIZZLEBOB", "STAY FLUFFY." — aus der
  Repo-eigenen Tagline), klar als Beispiel markiert: ChatterBox besitzt den echten Inhalt, diese
  Seite nur die Präsentation.
- Rückgabe/offene Fragen: kein Video, kein LLM-Call (Brief-Vorgabe). CARD/COLLAGE fangen einen
  fehlgeschlagenen Kartenabruf ehrlich mit einer beschrifteten Lücke ab, keine erfundene Kartenkunst.

### Updated in this project (WorldDesign Lab · Abschluss 2026-09-23)
- CapsuleCarl rot (`enemy.gltf`) mit übermaltem Mund; Monstrosity + Driver-Auto (Mystery S6 @fd52a9c4…); Normalen-/Rauheits-Look; Story-Palette; Tuschefarbe aus Fläche; Tageszeit-Zyklus.
- Doku: `docs/WORLDDESIGN_LAB_HANDOVER.md`, `docs/CHANGELOG_WORLDDESIGN.md`, `HOUSEKEEPING.md`.

### Updated in this project (WorldDesign Lab · Derek-Korrektur, 2026-09-23)
- Tusche: KFB-Schattenlogik (Licht dünn, Schatten dick, Breite aus Bildhelligkeit), weicher fliessender Wobble statt Stufen, Owner-Zellen-Stift-Druck durch weiches Rauschen ersetzt (Mosaik-Ursache), Scissor im Pass aus, SOURCE ohne Tusche.
- Look: Morph der Farbflächen (animierte Domänenverzerrung der Kachel) + Schattenkante aus Textur; Geometrie-Wobble für Derek aus.

### Updated in this project (WorldDesign Lab · UI-Rework + Derek/Tusche/Cel/Himmel/McCloud, 2026-09-22 spät)
- UI: Burger rechts oben schaltet die Schublade; Schublade rechts (breit) bzw. unten (schmal) mit Anfasser für Breite/Höhe (gespeichert); Beleg als Abschnitt statt eigenem Icon; Bank 1er/4er-Umschalter; Rahmung passt horizontal UND vertikal.
- Tusche `wd-ink.js` abgeleitet von `kfb-ink-outline.js` (Voxel Zone S2), Delta: Boiling-Wobble der Linie, Aussetzer, je Feld im 4er-Raster, 24-bit-Tiefe. Look: Cel-Shading + Flächen-Wobble (Owner-Formel aus kfb-box-material.js). Derek-Defaults aus Post + Bild abgelesen.
- Himmel `wd-sky.js`: three Sky, `travel/KFB Travel Combat v25/terrain-v25/skydome-shader.js` (Shader S/A, Aquarell = rollercoaster-v11-Rezept), tinyskies über `travel/wip/travel_globe_wsa/globe-v13/sky-presets.js`.
- Natur: Kenney Nature Kit, Tiny Treats Park/Zimmerpflanze, Plant Lab (`KFB_Plant_Prop_Lab_v2/src/plant-recipe.js` generate/buildProp, Presets A/B/C). Weltszene mit McCloud-Ebenen VG/MG/HG/Gelände, je Ebene eigener Look.

### Updated in this project (WorldDesign Lab · Derek-RGB-Palette + Voxel, 2026-09-22 nachts)
- Derek-Verfahren (r/TechnicalArtist): EINE RGB-Kachel triplanar, R/G/B wählen je Material zwischen drei Farben aus der Quellfarbe (Basis · dunkler+Drift · heller+Gegendrift). Neue Ebene „RGB-Palette“, Presets DEREK · RGB-GENERATOR / REFERENZ-KACHEL / + KORN.
- Referenzkachel aus `tools/KFB-ToolBox/_inbox/KFB Style References/TRIPLANAR TEXTURE SEAMLESS 01 …png` ausgeschnitten, per Vier-Quadranten-Überblendung nahtlos gemacht, Kanalreinheit wiederhergestellt → `textures/derek-rgb-ref.png`. Generator hat einen RGB-Masken-Modus (konstruktiv periodisch).
- Voxel-Gelände über den Owner `tools/KFB-ToolBox/_inbox/KFB Voxel Zone S2/voxel-zone-s2-full_2026-09-22/` (kfb-box-material.js, terrain/world-context.js STORY_PALETTES/MODES, kfb-ink-outline.js), Säulenhöhen aus wd-terrain; Tusche über die ganze Weltszene. edge3/Korn-Map nicht geladen (relative Manifeste fehlen im Export).
- Eigenschatten auf Figuren standardmäßig aus (Schattenkarten-Artefakt auf GothGirl-Brust/Hals).

### Updated in this project (WorldDesign Lab · dritte Fassung, 2026-09-22 abends)
- Bedienung als Ebenen-Stapel (Makro · Farbe · Ton · Korn · Relief · Rauheit · Glanz), jede Ebene an/aus + Stärke + Details + Kanal-Auge; Kanal-Ansicht BILD/ALBEDO/NORMALE/RAUHEIT; aktives Feld im Bild anklickbar.
- Vergleichsachse PRESETS · TEXTUREN · STÄRKE; Textur-Atelier mit Kachel-Thumbnails (Repo-Sätze + Generator); Grain Scale Vorgabe 7.
- Natürliches Laborgelände `wd-terrain.js` (Registry hat nur Kachel-Gelände: Hex hills, KayKit mountain/detail_hill, Kenney ground-hills); Weltszene mit vollem Fackelpool (6) statt 2 → nicht mehr schwarz.
- GothGirl-„Dreieck" = modellierter V-Ausschnitt, von flachem Fackel-Streiflicht übersteigert; Bank-Vorgabe jetzt BASELINE, Bank-Fackeln hoch/vorne.

### Updated in this project (KFB WorldDesign Lab v1 · Vergleichsbank, 2026-09-22)
- Neu: `KFB WorldDesign Lab v1.dc.html` + `wd-boot.js` · `wd-view.js` · `wd-look.js` ·
  `wd-macro.js` · `wd-light.js` · `wd-donors.js` · `wd-registry.js`. Erst als WD0-Spendergalerie
  gebaut, dann nach Georgs Korrektur zur **Vergleichsbank** umkomponiert: dasselbe echte Asset
  gleichzeitig in vier synchronen Feldern (SOURCE | RGB TRIPLANAR | PROCEDURAL/CLAY | COMBINED,
  eine Kamera, ein Orbit), Assetkatalog nur noch in der Schublade `Asset ▾`. Alle Bedienflächen
  sind ANGEDOCKT — nichts überlagert mehr das Bild; ein Icon schaltet die Paletten weg, unter
  900 px docken sie unter das Bild.
- **Makro-Texturgenerator** (`wd-macro.js`) mit Seed/Brush/Stroke/Blob/Warp/Blur/Contrast/RGB-
  Balance. Periodizität konstruktiv: neunfaches Zeichnen über die Kachelgrenzen, Warp nur mit
  ganzzahligen Perioden, Blur auf der 3×3-Kachelung mit Mittelschnitt, Normale/Rauheit mit
  umlaufendem Zugriff. 1 Kachel + 2×2-Vorschau + gemessene Naht (0,21/255) stehen in der Palette.
- **Look-System** (`wd-look.js`): Shader-Einschub statt Materialersatz, SOURCE bleibt verlustfrei.
  Triplanar mit Mischschärfe, stochastische Doppelprobe, Farbeinfluss getrennt von Wertmodulation
  (0 = Quellfarbe erhalten, 1 = starke RGB-Palette), Korn über die NORMALE, Glanzerhalt der Quelle
  statt globalem Matt-Klemmer.
- **Lichtprofile** (`wd-light.js`) BASELINE ↔ WHACKMAN, orthogonal zum Material. WhackMan-Werte
  gemessen übernommen aus `wm-boot.js` (ACES, 0x151322, FogExp2 0,019, Hemisphere 0x3f4a66/
  0x1f1917 @0,48, Directional 0x9db4e8 @0,68 + 0x6478a8 @0,12) und `wm-gate-b.js`
  (PointLight(0xff8c3a, 30, 18, decay 2), Phasen i·1,7, zweifrequentes Flackern, additive Glut);
  lokale Sicht aus `wm-gate-c.js`, Vorgabe aus. Fackelpositionen sind als LABORpositionen benannt.
- **PostFX minimal**: selektiver Bloom über die getaggte Ebene (nur Fackelglut, kein Materialtausch)
  plus Grade-Pass. Befund: der Grade muss NACH `OutputPass` sitzen — im linearen Raum ist 0,5 nicht
  Mittelgrau, ein Kontrast um diesen Punkt drückte die Szene gemessen fast schwarz. Echtes
  `.cube`-LUT bleibt SOURCE_REQUIRED.
- **Cube-Pet-Korrektur**: Augen fehlten, weil das nackte GLB geladen wurde. Jetzt über den Owner
  nach EMBED_CUBE_PET_FULL_v2.2: `media/3D_Assets/kfb-pets.js` `loadPets()`/`makePet()` mit EyeRig,
  PetFace, PetMouth, PetMotion; der Beleg meldet, ob Augen und Mund wirklich gebaut wurden.
- **Registry-Befund**: `registry/assets/v1/packs/<slug>.json` (`kfb.asset-pack.v1`) liefert Pfad,
  Format, `dependencyStatus` und je Asset `source.commit`/`rawPinned` — damit umgeht man die
  `.gltf`-Blindheit des Tree-Lesers ohne eigenen Katalog. `KayKit_Mystery_Series6` hat KEINEN
  Shard (GothGirl/CapsuleCarl laufen ungepinnt auf `main`).
- **Umgebungsbefund**: einzelne jsDelivr-Modul-URLs antworten per `fetch` 200 und
  `application/javascript`, per `import()` dauerhaft „error loading dynamically imported module"
  (gemessen: `kfb-rigs-embed-v3/lab-v2/audit.js`, damit die ganze CapsuleCarl-Kette;
  `graft-mount.v1.js` nicht betroffen). Zweistufiger Lader: Cache-Brecher-Query, sonst wörtliches
  Blob-Modul mit absolutierten Spezifizierern.
- Rückgabe: `returns/WORLDDESIGN_WD0_2026-09-22/RETURN.md` + `SOURCE.json`. Stage/Branch/PR aus
  dieser Umgebung nicht erzeugbar; Übergabe läuft über den Session-Cut.


## Last sync
date: 2026-09-22T02:35:00Z

### Updated in this project (WhackMan · Session-Abschluss, 2026-09-22)
- Kekse: Anker fix, Hoch-Hüpfen statt Wegschieben, Spin in der Luft, sichtbares Auftitschen beim
  Landen (zwei Folgefehler dabei gefixt: Stauch-Trigger feuerte nie, `hopV`-NaN). Kamera: Scroll/
  Touch-Zoom mit Cursor-Fokus ergänzt zur schon vorhandenen Zieh-Blick-mit-Rückkehr-Funktion.
  Snapshot + CHANGELOG in `returns/WHACKMAN_V1_2026-09-22/` final für diese Session aktualisiert.

## Last sync
date: 2026-09-22T02:05:00Z

### Updated in this project (WhackMan · Check-in, Cookie-Kaskade + Kamera + VFX, 2026-09-22)
- Cookie-"Fressen"-Kaskade behoben: Verfolger lösen keinen Ballistik-Tritt mehr aus (das war die
  Quelle des "viele Kekse tauchen auf/verschwinden"-Effekts, wenn ein Verfolger durch einen
  Kekse-Gang lief) — nur noch harte Verdrängung + Feder-Rückkehr, gleichmässig statt kaskadierend.
  Freier Blick in der Verfolgerkamera (Ziehen, federt bei Bewegung zurück). Impact-VFX auf runde
  additive Punkte mit Schrumpfen umgestellt. Snapshot + CHANGELOG in
  `returns/WHACKMAN_V1_2026-09-22/` aktualisiert als Übergabestand.

## Last sync
date: 2026-09-22T01:40:01Z

### Updated in this project (WhackMan · Kollisions-/Bounce-Modul, 2026-09-22)
- Referenz gelesen: `skills/kfb-cartoon-animation_v2.md` — Ursache→Anticipation→Aktion→Impact→
  Follow-through→Recovery, additive Bounce-Offsets statt Überschreiben der kanonischen Position.
  Generisches `Bounce`/`pushApart` in `wm-collide.js`: Verfolger-Verfolger-Trennung, Verfolger-
  Sammelgut-Ausweichen (kein Dauer-Fressen mehr) und Spieler-Treffer (Wirbel hoch, Fall,
  Landestauchung, Rückkehr zur Standpose) laufen jetzt über dieselbe Feder statt Einzel-Tweens.

## Last sync
date: 2026-09-22T01:13:01Z

### Updated in this project (WhackMan · Minimap + HUD-Politur, 2026-09-22)
- Referenz `butchler/Pacman-3D@gh-pages` (`game.js`) gelesen für Gameplay-Vergleich: deren
  Geisterlogik ist reiner Zufallsturn an Kreuzungen ohne Scatter/Chase/Zielpolitik — unser
  Verfolgersystem (3 Politiken, Wellen, Fright) ist bereits weiter; übernommen wurde nur die
  Minimap-Idee (`renderHud`: zweite Draufsicht-Kamera in Eckviewport), hier als eigene 2D-Canvas
  aus dem MazeGraph statt eines zweiten WebGL-Passes. Werkzeuge-Icon sitzt jetzt neben dem Titel
  statt oben rechts; HUD-Text unten links gedimmt (opacity .62).

## Last sync
date: 2026-09-22T00:51:10Z

### Updated in this project (WhackMan · Kollision/Feedback-Pass, 2026-09-22)
- Wandkollision (AABB/Zell-basiert, `wm-collide.js`) für Spieler + Verfolger; Dot-Trefferfenster
  über die ganze Flugkurve; zufällige Idle-Nummern deaktiviert (`wm-lull.js`); Kontakt-Feedback
  (Knockback-Bogen + Stauchung) für den Spieler statt nur Funkenstoß; Fog-of-War-Licht (default
  aus, stufenloser Regler); Verfolger-Verfolger-Trennung + Sammelgut weicht Verfolgern statt
  einmalig getreten zu werden; Ton startet standardmässig aus. Nachgeschaut (nur gelesen, nichts
  kopiert): `media/3D_Assets/Audio/sfx.json` — kein appear/vanish-Cue im aktuellen Manifest.

### Updated in this project (WhackMan · Enchilada-Animationen, Welle, Laufmodus, 2026-09-21)
- **Alle Legacy-Clips im Einsatz**, neu `wm-lull.js`. Von den 30 Clips des Rigs stehen **28** im
  Leerlauf-Pool; ausgenommen sind nur `Walk` und `Run` (Fortbewegung). Wer stehen bleibt, fängt
  nach ~2,6 s eine Nummer an; eine Taste bricht sie sofort ab — eine Animation nimmt die
  Steuerung nicht in Geiselhaft. Gemessen in 40 Durchläufen gesehen: Winken, Hüpfer, Zielen,
  Angeln, Nickerchen, Jubel, Sprung, Hieb, Amboss-Schlag.
- **Ehrlich benannt**: Angeln und Amboss-Hämmern gibt es im Legacy-Satz NICHT. Nächstliegend und
  so in der Tabelle notiert: `Shoot(2h)Bow` als Angel-Pose (zweihändig, vorgeneigt, langer Halt —
  mit einer Rute in der Hand ist es Angeln, ohne ein Bogen), `HeavyAttack` als Amboss-Schlag,
  `Interact` als Kurbel/Hebel. Requisiten fehlen noch, das ist der nächste Schritt.
- **Welle unter den Verfolgern**: läuft ein Verfolger über Sammelgut, springt es hoch und fällt
  gedämpft zurück — ausgelöst einmal je Knotenwechsel für die nächsten fünf Zellen in
  Fahrtrichtung mit wachsender Verzögerung, daher eine Welle statt eines Zuckens. Das Ruhewippen
  tritt dabei zurück, sonst überschriebe es die Höhe jedes Bild.
- **Laufmodus getrennt** (Georgs Unterscheidung): `Chill & Fun` hält an, sobald niemand drückt;
  `Pacman` läuft weiter. Gemessen: Chill bleibt auf x 10,25 stehen, Pacman läuft in derselben
  Zeit bis 14,3.
- Ton-Schalter und Laufmodus-Schalter in der linken Knopfleiste.
- OFFEN und als Nächstes: 3D-Zahnrad oben rechts als Ansichts-/Settings-Toggle (Vorbild Travel
  Globe) mit kompaktem Fullscreen-Overlay statt der gewachsenen Knopfleiste.

### Vorheriger Eintrag
date: 2026-09-21T02:05:00Z

### Updated in this project (WhackMan · Decken-Bauteil, Audio, VFX, 2026-09-21)
- **Deckenfrage beantwortet aus dem Pack-Inventar.** Vollständige `.gltf`-Liste des Dungeon 1.1
  über die GitHub-**Contents-API** geholt (der Tree-Leser blendet `.gltf` aus): 199 Bauteile.
  Die Blockdächer nutzen jetzt `ceiling_tile` (4,00 × 0,35 × 4,00) statt `floor_tile_large` —
  eine Bodenplatte oben drauf zeigt ihre Hex-Fugen nach oben und liest sich als Boden.
  Die `floor_foundation_*`-Familie (allsides · corner · front · front_and_back ·
  front_and_sides · diagonal_corner) wäre die reichere Lösung: gemessen **2,00 × 2,00 × 2,00**
  mit 0,10 Kantenlippe, also VIER Viertel je Modul mit Randvarianten je nachdem, welche Seite auf
  einen Gang zeigt. Saubere Kanten, aber 528 statt 132 Platzierungen — als Entwurfsentscheidung
  notiert, nicht still eingebaut.
- **Audio aus dem Repo-Manifest**, neu `wm-audio.js`. Quelle ist `media/3D_Assets/Audio/sfx.json`,
  nicht eine eigene Liste; das README dort benennt das Manifest ausdrücklich als Wahrheit, weil
  die Ordneransicht den Audio-Ordner fälschlich als leer meldet. Geladen und belegt: coin ·
  boost · hit · error · win · confirm · ui — **7/7, 0 fehlend**. Die `/Audio/`-Segment-Falle aus
  dem README ist eingehalten.
  Cues nach Brief §13: Sammelgut, Sonderleckerei, Spielertreffer, Whack-Kontakt, Feld leer.
- **VFX als Interpunktion, kein Dauerfeld**: ein kurzer Funkenstoß aus einem Punkte-Pool am
  Ereignisort (Whack golden, Spielertreffer rot), 0,6 s, wiederverwendete Geometrie.
- HUD aus der unteren Bildmitte nach rechts unten: die Verfolgerkamera parkt den Akteur
  konstruktionsbedingt genau dort, HUD und Figur konnten sich nicht verfehlen.
- `setFade()` bekam denselben `needsUpdate`-Guard wie `repairTextures` — 41 Texturwarnungen weg.
- `CLEAR` und `AUS` getrennt (die Anzeige meldete bei 1/113 einen Sieg, der ein Game Over war),
  Neustart nach 3,2 s.

### Vorheriger Eintrag
date: 2026-09-21T01:21:16Z

### Updated in this project (WhackMan · Blockdächer, Ansichten, drei Verfolger, 2026-09-21)
- **Maze-Architektur aus dem Original nachgezogen.** In `butchler/Pacman-3D` ist jede `#`-Zelle
  ein gefüllter Würfel; das KayKit-Fugenmodell setzt die Wand dagegen auf die KANTE, und ein
  `#`-Feld ist damit eine GRUBE zwischen dünnen Wänden. Von oben schaute man hinein. Jede nicht
  begehbare Zelle bekommt jetzt eine `floor_tile_large` auf Wandkronenhöhe — **132 Blockdächer**.
  Schalter `innenDecken`: aus · standard (Blockdächer) · an (zusätzlich Pferchdach).
- **Vier Ansichten** durchschaltbar: Verfolger (Referenzkamera), Draufsicht (senkrecht,
  mitwandernd), freier Orbit, Freiflug/God-Mode (WASD fliegt die Kamera, Q/E Höhe, Akteur steht).
- **Lauffläche** `gaenge` | `wandkronen`. Wandkronen ist kein Höhenversatz, sondern ein
  UMGEKEHRTER Graph (begehbar ist, was `#` ist) — Georgs Nachsatz „dann aber logisch auf den
  Innenwänden". Gemessen und benannt: ein Pacman-Grundriss ergibt umgekehrt einen Ring plus
  Inseln; nur die grösste Komponente wird bespielt. Ein echtes Wandlauf-Feld braucht eine eigene
  Rezeptur.
- **Drei Verfolger, drei verschiedene Zielpolitiken** (Brief §8, keine umgefärbten Gehirne):
  Abfänger (Abfangpunkt vor dem Spieler), Druck (kürzester Weg), Schnüffler (dichtestes
  Sammelnest nahe am Spieler). Zustände CHASE · SCATTER · FRIGHTENED · RETURNING · PEN, dazu
  Scatter/Chase-Wellen. Alle drei über `legacyAssemble()` **4/4 gebunden**: `character_orcA`,
  `character_orcB`, `character_skeleton_minion`.
- Core Loop: READY → PLAYING → POWERED → HIT → CLEAR, drei Leben, Whack-Theater als reiner
  Darstellungsversatz (Stauchen, Abflug, Drehung) bei unberührtem Graphknoten — Brief §G2.
- **Werkzeugbefund**: Der Repo-Tree-Leser blendet `.gltf` aus, die **GitHub-Contents-API** nicht.
  Die exakten Skelett-Dateinamen (`character_skeleton_minion.gltf`, nicht `skeleton_minion.gltf`)
  kamen darüber. Geraten hatte ich sie ohne `character_`-Präfix → 404.
- **Revisionsbefund**: Das Skeletons-Paket liegt NICHT am Legacy-Pin `10a7fdce` (404), sondern auf
  `main`. Figur und Rig dürfen deshalb auf verschiedenen Revisionen liegen; das Rig bleibt am Pin,
  es ist die Architekturquelle. Revision steht je Verfolger im Bericht.
- **Leistungsbefund**: Zwei Dinge haben die Seite zum Stehen gebracht. (1) Die 132 Blockdächer
  landeten in der Sichtlinien-Prüfung — jeder Strahl der Verfolgerkamera streift Dutzende, und
  `setFade()` klont dabei Materialien. Blockdächer sind jetzt ausgenommen; der Gang, in dem der
  Akteur steht, hat ohnehin kein Dach. (2) Breitensuche pro Knotenankunft je Verfolger und eine
  Nestsuche über das Paarprodukt aller Restpellets (113²). Suche jetzt je Ziel gecacht, Dichte
  über ein Zellraster.

### Vorheriger Eintrag
date: 2026-09-21T00:11:49Z

### Updated in this project (WhackMan Gate C · Ansicht aus der Referenz, 2026-09-21)
- Referenz `butchler/Pacman-3D@gh-pages` **gelesen statt beschrieben** (`game.js`, `updateCamera`).
  Gemessene Konstanten übernommen, in Modulen: Kamera 1,5 Zellen hoch, 1,0 Zellen hinter dem
  Akteur, Blickpunkt 1,0 Zellen davor, Blickwinkel **65°**, Nachführung 10·dt. Kein Code kopiert —
  nur die vier Zahlen und der Aufbau. Reference-only bleibt reference-only.
- **Befund**: Die „Decken-Konstruktion" der Referenz ist keine Decke. Dort ist die Wand genau eine
  Zelle hoch und die Kamera sitzt eine volle Zelle ÜBER der Wandkrone — man schaut auf die
  Wandoberseiten, und dadurch liest das Spielfeld als geschlossene Platte mit eingeschnittenen
  Kanälen. `game.js` hat kein `ceiling`-Objekt, die Wände sind `BoxGeometry(1,1,1)`. Meine Kamera
  stand auf 0,78 Wandhöhen, also darunter: ein Korridorblick statt eines Spielfelds.
- `ceiling_tile` (4,00 × 0,35 × 4,00, gemessen über die Owner-Funktion) bleibt als Bauteil
  verfügbar und deckt auf Wunsch die Innenräume (`kind === 'room'`, hier der Whack-Pferch).
  **Vorgabe aus**, wie in der Referenz. Eine Vollbedachung aller 123 Zellen hatte Gate B zugedeckt.
- Steuerung nach drei Anläufen sauber: `face` gehört der Eingabe, aus der Fahrt wird es nur bei
  `MazeMotor.forcedTurn` nachgezogen (Kantenwechsel ohne gepufferte Abbiegung). Gemessen:
  S halten/loslassen/auslaufen → 1,13, danach W → 5,13; W + A-Tipp → biegt nach Norden auf 12,8;
  A 3 s gehalten → genau eine Drehung; A dreimal getippt → O→N→W→S.
- Schattenkamera auf die Labyrinthgrenzen gepasst (Radius 42,2 bei 68 × 53,3) statt makeViewers
  ±40-Frustum; Böden werfen keinen Schatten.
- Werkzeugbefund für spätere Durchgänge: der Screenshot-Greifer liest in einem gedrosselten
  Rahmen den zuletzt gezeichneten WebGL-Puffer und zeigt nach einem Gate-Wechsel minutenlang die
  alte Szene, während der Szenengraph sauber ist. `window.__wm.V.draw()` vor dem Greifen erzwingt
  ein frisches Bild.

### Vorheriger Eintrag
date: 2026-09-21T00:05:00Z

### Updated in this project (WhackMan Gate C + Owner-Umbau, 2026-09-21)
- **Owner-Korrektur von Georg umgesetzt.** Der erste Pass hatte im WhackMan-HTML einen zweiten
  Dungeon-Katalog, eine zweite Messung, eine eigene Platzierungsmathematik und einen eigenen
  Renderer. Alles entfernt. Jetzt aufgerufen statt nachgebaut: `kit-lab.js` (PACKS · loadAsset ·
  measure · instance · **buildScene** · **repairTextures** · **auditFootprints** · **makeViewer**),
  `dungeon-grid.js` (**layout()** + collectTris/planScan/wallFrame/cornerFrame/stairFrame/
  openingScan/seamKey/cellId), `dungeon-light.js` (measureFlame), `atlas.js` (**legacyAssemble**).
  Unberührt: `generate()` (BSP), S14/S21-Editor, `registry/assets/v1`, Librarian.
- Der Umbau zahlte sich messbar aus: `HUB` ist jetzt **4,05** (gemessener Treppenhub) statt der
  angenommenen Wandhöhe 4; die Fackeln sitzen auf der vom Owner gelösten Protrusionsachse; und
  `auditFootprints` fand **4 Durchdringungen von 1,0** an den Tunnelmündern, die der eigene
  Aufbau nie gemeldet hätte. Jetzt 0.
- **MISSING_DELTA benannt statt still gebaut**: (1) LegacyFaceHost — OFFEN, der einzige erlaubte
  Neu-Messauftrag; (2) Kit-Builder — liegt beim Owner inline im Seitenkörper von
  `KayKit_Dungeon_Generator_S13_2.html` (Z. 220–290) statt in `dungeon-grid.js`; wortgleich
  übernommen in `wm-kit.js`, **gehört beim Owner als `export async function buildKit()`
  hochgezogen**, dann entfällt die Datei; (3) Modell aus Handschrift — der Owner kennt nur
  `generate()` (Zufall) als Eingang in seine Modellform, Brief §6 verlangt eine autorierte Karte;
  (4) Tiny Treats ohne Commit-Pin, als `PACKS`-Eintrag registriert, Branch `main`.
- **Gate C** (neu): `Input → MovementIntent → MazeMotor → player transform` und
  `player transform → CameraFollowTarget → OrbitControls`, getrennt für einen späteren
  FPS-Adapter. Gemessen: 2,70 Zellen/s bei Sollwert 2,70 · **0 Wanddurchbrüche in 4000 Schritten**
  · 19/115 Abbiegungen gepuffert · Tunnel-Wrap 1 Teleport · 108/108 Sammelplätze erreichbar ·
  0 Konsolenfehler. Der Motor kennt nur den MazeGraph; Aufsammeln ist eine Knotenabfrage.
- Georgs UI-Korrektur: Belegtafeln standardmäßig ZU, Schilder hängen unter ihrem Ankerpunkt statt
  darüber (sie verdeckten die Figur, die sie beschriften) und sind per Knopf abschaltbar.
- Zwei Takt-Befunde, jetzt beide abgedeckt: rAF wird in unsichtbaren Vorschaurahmen angehalten
  (Diorama-Pass), ein reines `setInterval(16)` wird auf **einen Tick pro Sekunde** gedrosselt,
  sobald der Rahmen nicht im Vordergrund ist (dieser Pass, gemessen bei 1,2 ms Renderzeit).
  Takt jetzt wie in kit-labs Viewer: rAF führt, Intervall fängt auf.
- Schattenkamera auf die Labyrinthgrenzen gepasst (Radius 42,2 bei 68 × 53,3) statt makeViewers
  ±40-Werkzeugblatt-Frustum; Böden werfen keinen Schatten mehr.
- Rückgabe: `returns/WHACKMAN_V1_2026-09-20/` (SOURCE.json, RETURN.md),
  `returns/WHACKMAN_V1_2026-09-21/TEST_REPORT.md`.

### Vorheriger Eintrag
date: 2026-09-20T21:19:02Z

### Updated in this project (KFB WhackMan v1 · Gate A + Gate B, 2026-09-20)
- Auftrag: `skills/chat/workflows/KFB_WHACKMAN_V1_2026-09-20/CLAUDE_DESIGN_BRIEF.md` (Branch
  `orchestration/wsa-mvp-consolidation-2026-09-20`). Dungeon-first Maze-Chase-Kandidat.
- Neu: `KFB WhackMan v1.dc.html` + `wm-src.js` + `wm-maze.js` + `wm-gate-a.js` + `wm-gate-b.js`
  + `wm-boot.js`. Eigener Three.js-Host (three@0.184.0, die Version, gegen die atlas.js gebaut
  ist), freier Orbit, Tweak `gate` schaltet A/B. Rückgabepaket unter
  `returns/WHACKMAN_V1_2026-09-20/` (SOURCE.json, RETURN.md).
- **Nichts nachgebaut.** Wiederverwendet statt neu geschrieben: `tools/resident_atlas_s6/lib/atlas.js`
  (loadAsset/instance/measure/**legacyAssemble**/LEGACY_RIG — die Legacy-Architektur bleibt beim
  Owner) und `tools/world_atlas/source/lib/dungeon-grid.js` (collectTris/planScan/wallFrame/
  cornerFrame/wallRot/cornerRot/rotVec/openingScan). Der BSP-Generator `generate()` ist bewusst
  NICHT benutzt — Brief §6 verlangt eine von Hand autorierte Rezeptur. Beide Dateien plus
  `kit-lab.js`, `dungeon-light.js`, `KayKit_Dungeon_Generator_S13_2.html` liegen als Lesekopien
  im Projekt.
- **Gate A PASS** (Brief §5): 5 Stationen, einzeln anfahrbar, mit Pfad/Revision/Bounding-Box.
  Dungeon 1.1 5/5 — Modul 4, Wandhöhe 4, Wandplatte 1, Eckteil 2,5×4×2,5, unabhängig
  nachgemessen und deckungsgleich mit `HANDOFF_dungeon_S13.md`. PrototypePete: 6 Bones, 30 Clips
  in einer Datei, spielt `Walk`; vollständige Clipliste protokolliert. `character_orcA`: 0 Bones,
  über `legacyAssemble()` 4/4 an Body/Head/armLeft/armRight. Tiny Treats 5/5. A5 EyeRig ist
  sichtbar GESPERRT — der LegacyFaceHost-Nachweis (§4) steht aus und wird nicht vorgetäuscht.
- **Gate B PASS** (Brief §6): 17×15-Rezeptur von Hand, 123 Knoten / 140 Kanten / 18 Schleifen /
  5 Kreuzungscluster / 0 Sackgassen / 0 unerreichbare Knoten / 0 freie Wandenden / 104 Eckteile /
  1 Tunnelpaar / Pferch 6 Zellen mit genau einer Tür. Alle acht §6-Gates erfüllt. Gebaut nach dem
  Fugenmodell des Dungeon-Owners; wo zwei Eckschenkel eine Fuge voll decken, steht keine Wand.
- Zwei Befunde für andere Konsumenten: (1) `loadAsset()` in `atlas.js` cached nach PFAD, nicht
  nach Pfad+Commit — ein erster Fehlversuch vergiftet jede weitere Revision derselben Datei;
  Revisionen werden hier deshalb mit nacktem `fetch` aufgelöst. (2) Die schwarzen Dungeon-Teile
  sind der bekannte Texturfall; `repairTextures` (kit-lab.js:346) löst ihn auch hier.
- OFFEN und benannt: Gate C (PlayerMotor + Orbit), Stop-Gate 3 (Legacy-EyeRig), Core Loop,
  G1/G2/G3, Audio/VFX. KayKit Bits Bundle 1 (PR #144) bleibt `SOURCE_REQUIRED`.

## Sync history
### 2026-09-19T14:16:02Z

### Updated in this project (Kit-Lab-Oberfläche, Anker, Terrain, Quaternius-Wege)
- Bedienung vollständig in die Seite verlegt, in der UI-Sprache des World-Atlas-Kit-Labs
  (gelesen: `tools/world_atlas/index.html`, `tools/world_atlas/source/KayKit_Forest_Clearing_S6.html`,
  `tools/world_atlas/README.md`): dunkle Kopfleiste, Mess-Seitenleiste, HUD, Pick-Anzeige,
  Referenz-Regler, `Recipe JSON`. Host-Tweaks entfernt — ein Schreiber pro Zustand.
- Anker-Regel: `onSurface()` tastet einen Ring auf der Oberfläche eines benannten Teils ab und
  nimmt den höchsten Treffer. Der Vogel sitzt gemessen auf dem Rand der oberen Brunnenschale.
  Dazu `support()` als Gate: fünf Abtastpunkte je Requisite, verankerte Teile brauchen einen.
- Weggelassene Teile nennen jetzt ihren Blocker.
- Terrain-Tauglichkeit: Schalter Sockel/Terrain. Bodenplatten haben ihren Nullpunkt an der
  Oberkante, liegen also bündig in einer Geländeoberfläche; die Scheibe darunter ist ein
  Stellvertreter für TinySkies/Travel-Gelände, nicht Teil des Sets. Grundfläche und Ankerhöhe
  stehen im Recipe-Export.
- Neu genutzt: `media/3D_Assets/Rocks + Pebbles + Path Tiles by Quaternius` (13 GLB, CC0),
  vermessen und in drei Klassen gemappt — Pebble (5, Streu), Rock Path Small (6, Trittstein),
  Rock Path Thin/Wide (2, geschlossene Fläche). Gemeinsamer Tiefenwert **1,987** bei Thin und Wide
  ist das Rastermaß für lange Strecken. `pathRun()` legt daraus Wege ohne Wiederholungsmuster;
  die Promo-Fassungen behalten den pack-eigenen Stein.
- Schattenbias und -frustum nachgezogen; Anatomie-Auslage rechnet ihre Zeilenbreite selbst.

### Updated in this project (Tiny Treats Promo-Nachbau, 2026-09-19)
- Auftrag kam als D01 (Dungeon), wurde von Georg im selben Zug geändert: zuerst die Tiny-Treats-
  Pakete, und die vorhandenen Promo-Setups möglichst 1:1 nachbauen, mit Screenshot-Vergleich
  und Reparaturschleifen vor der Ausgabe. D01 ist damit **nicht** bearbeitet.
- Neu: `KFB Tiny Treats · Promo-Nachbau.dc.html` + `tt-scene.js` + `tt-boot.js`. Eigener
  Three.js-Host (three@0.160.0, derselbe gepinnte Build wie `diorama.js`), Modelle zur Laufzeit
  aus `georg-doc/kayfabizarro@main` über jsDelivr mit raw-Fallback. Nichts kopiert außer den
  zwei Vorschaubildpaaren als Vergleichsreferenz.
- Nachgebaut: `Tiny_Treats_Homely_House_1.0_FREE` (27/27 Modelle) und
  `Tiny_Treats_Pretty_Park_1.0_FREE` (28/28) nach ihren `sample.png`. Dazu je eine erweiterte
  Fassung nach Georgs Vorgaben: Zaun verlängert und Grundstück 10×8 → 16,5×13,5; Gartenrequisiten
  vom Haus weggerückt mit Trittsteinweg; Park 10×6 → 18×12 mit längerer Hecke, zweiter Bank,
  zweiter Laterne und durchgehendem Weg; zwei markierte Freiflächen je Szene für Picknick-Set
  und Limonaden-Stand.
- Alles messbasiert statt geschätzt: Bounding Box je Modell, Bodenkontakt über die gemessene
  Unterkante plus Strahl auf das, was darunter steht, Zaun-/Heckenketten über die gemessene
  Segmentlänge. Rezept und Messwerte zur Laufzeit unter `window.__tt.rezept()` / `.messwerte()`.
- Für den C0-Katalog gemessen: Park-Grasboden ist eine 2,00-Kachel aus einem 3×3-Slice-Satz
  (`floor_grass_sliced_A…I`) auf einer ebenfalls gekachelten Sockellage — Homely House löst den
  Boden dagegen mit einer einzelnen 10×8-Platte. Brunnen 4,00×4,00 als Maßstabsanker.
  Zaunsegmente 2,494 / 1,494 / 0,494, Tor 2×1,000.
- Wichtiger Lesehinweis: der Repo-Tree-Leser blendet `.gltf`/`.bin` aus. Die Tiny-Treats-Ordner
  sehen dadurch leer aus, obwohl die Modelle da sind — Dateinamen über die Contents-API holen.
- Behoben und protokolliert: der Renderloop lief über `requestAnimationFrame` und wurde in nicht
  aktiven Vorschaufenstern angehalten; die Szene stand nach dem ersten Bild still, ohne Fehler.
  Takt jetzt über ein Intervall. Derselbe Fehlertyp wie beim Diorama-Pass.
- NICHT erfüllt: feste Stage-Adresse, Mobil-Beleg, Branch/PR — aus dieser Umgebung nicht möglich.
  Rückgabepaket liegt vollständig unter `returns/TINY_TREATS_C0_2026-09-19/`.
- Offen benannt: Georg nennt neun neue Tiny-Treats-Pakete, im Repo liegen sechs. Drei fehlen
  oder heißen anders; nicht geraten. Siehe `MISSING_AND_SUBSTITUTES.md`.

### Updated in this project (Fail 6 → Diorama-Host)
- Georgs Host-Entscheidung nach Fail 6: eigener Diorama-Host statt Travel. Begründung ist die
  Diagnose, die WB0s START_HERE für Town v1–v3 schon aufgeschrieben hatte — eine Ground-Erfahrung
  wurde auf eine Flight-Runtime gepatcht, und jede Look-Korrektur lief in eine Flight-Annahme.
  Travel ist Makro/low-poly/Blick-aus-der-Höhe, die Cozy-Referenz ist klein/dicht/matt/Kamera am
  Boden. `KFB World Walk · Scene Orbit` bleibt als Historie liegen, ist aber nicht die Strecke.
- Neu: `KFB Diorama · Straßenecke.dc.html` + `diorama.js` + `diorama-boot.js`. Ort: Straßenecke, der
  Zirkus ist gerade angekommen (Wagen mit abgelegter Schere, Kistenstapel mit angelehntem Deckel,
  halb ausgelegte Plane, ein stehender Mast mit Abspannung, Reifen am Wagen, Trommel, Ballons).
  Übernommen aus dem verworfenen Pass, nach Georgs Auswahl: der LOOK_CONTRACT L-1…L-6 mit den
  gemessenen Werten, und `frizzlegraft-v1/graft-mount.v1.js` für FrizzleBob (`animation:'own'`,
  Waffe über `graft.weapon` ausgeblendet, 1.78 m).
- Beide Gates parallel, einen Schalter auseinander: `showActor` aus = nur der Ort.
- Gemessen gegen die Referenz (800×450, Standardkamera): L̄ 150 / S̄ 20% gegen Referenz 163 / 30%,
  0% Pixel unter L 40 (kein Schwarzpunkt). Drei Implementierungsfehler fielen erst durch diese
  Messung auf und sind behoben: (1) die 12–30% der Referenz sind das ERGEBNIS, nicht ein Faktor —
  als Multiplikator auf eine bereits autorierte Palette gelegt ergaben sie 8%; (2) L-4 braucht
  einen Mitteltonhub, kein Grau-Mix, und r160-Standardmaterialien ohne Tone Mapping brauchen
  deutlich höhere Lichtstärken; (3) die Ink-Hüllenskalierung über die Objektspanne war für große
  Körper subpixel — jetzt über den Bounding-Radius.
- Offen und benannt: die Referenzoberflächen sind handgemalt, die hiesigen sind Lokalfarbe plus
  Korn. Das ist der verbleibende Abstand und eine Textur-Aufgabe, kein Parameter.
- Drei Nachbesserungen nach Review, alle gemessen bestätigt: (1) der Renderer-Canvas hängt an
  `document.body`, nicht in einem Template-Knoten — der DC-Runtime räumt fremde Kinder bei jedem
  Re-Render weg, und die Seite war wirklich leer (derselbe Fehler wie zuvor bei der Statuszeile);
  (2) B-3 ist jetzt beantwortet statt benannt: `animation:'own'` half nicht, der Wirt bringt 0
  eigene Clips — `Rig_Medium_Simulation` hat 14 Clips und kein Idle, der einzige stehende Loop ist
  `Waving`, er läuft geloopt und steht als Quelle in der Statuszeile; der Clip hängt hinter
  `graft.update`, weil der Graft sonst jedes Bild seine Standpose darüber schreibt (mixer.time blieb
  gemessen stehen); (3) die Requisite hängt an `graft.weapon.holder`, nicht an Namensmustern.

### Updated in this project (Scene Orbit build)
- New `KFB World Walk · Scene Orbit.dc.html` + `walk-scene.js` + `walk-boot.js`: the circus-ring
  scene staged INSIDE the live Travel runtime (globe-poc.js via jsDelivr), free-orbit inspectable,
  no player control. Georg's call: a still has too little evidential value and was itself part of
  the five Birthday fails — so the gate is an orbitable scene, not a screenshot.
- Scale: authored in KayKit metres, translated ONCE by `globe-v13/kit-massstab.js` · `BAUM_WELT` /
  KayKit tree median 5.54, imported at runtime from the world's own owner. Nothing is height-fitted
  per object. Measured: FrizzleBob 2.31 m = 0.418×Baum, graft calibration ×0.91 against the KayKit
  crowd median (declared, non-destructive, per WB0 §5).
- Land anchor is found by sampling the world's baked surface (520 directions, altitude band above
  water and below the highlands, flatness from four neighbours) instead of reusing the Birthday
  shallow-water constant — that constant put the ring in the sea.
- Ground presentation and the overexposure fix are lifted from the tested `town-presentation-v3.js`
  (lines/post/trail/wake off, `lighting.setEnv(0)`, `setTint(…,0)`, `setFill(0.12)`), not re-derived.
  Town query params applied through the world's own owners; those without an owner are reported as
  not-found rather than silently claimed (muenzen, mech, regen, flora, tsflora).
- LOOK_CONTRACT implemented: L-1 as scene fog toward the measured sky colour, authored in tree
  heights and converted to density (a hand-typed density did nothing — the ring is 0.05 world units
  wide); L-2/L-4 as a shader-level saturation budget and high-key lift (the kit's colour lives in
  the texture, so grading `material.color` changed nothing); L-3 contact shadows at ~10% darkening
  instead of the Birthday pass's 0.62 alpha; L-5 ink as a back-face hull in darkened local colour.
  `worldGrade` extends L-2/L-4 to Travel's terrain — opt-in and reversible.

### Updated in this project (Scene-Walk-Mode Vorlauf)
- New `KFB World Walk · Look Target.dc.html`: measured render-style contract (L-1…L-6) for the cozy
  reference, the target/too-cute boundary, the gate order (Standbild before Walk) and the Town
  query-param base contract. Colour/contrast values are pixel-sampled from the reference frames.
- B-1: walk-mode is NOT to be built here. `KFB-Travel-Globe@b1b5065` (PR #13) already ships
  `site/world-builder/ground-controller.js` (spherical WASD over the baked Travel mesh, own ground
  camera) + `runtime-mode.js` (one active movement writer per locomotion mode, Flight FX off by mode).
  21/21 CI PASS, browser acceptance pending. The open delta is FrizzleBob replacing WB0's "Hiker"
  ground-player presentation, not the walking.
- B-2: the reddit look reference and the in-repo `_inbox/KFB Town a-bit-too-cute-StyleReference/`
  screenshots are the SAME source — the frames carry reddit's fullscreen banner and the
  "no name squish game" title card. The boundary runs inside one source: take the light model,
  leave the character canon and UI language.
- B-3: `frizzlegraft-v1/graft-biped.v1.js:111` records, measured, that `MovementBasic` for this rig
  has Jump/Running/Walking but NO Idle. Walk clips are covered; the idle source must be named
  (General, or a pet host's own 19 clips) before walk is wired.
- 3 reference frames copied to `refs/cozy-town.png`, `refs/cozy-canoe.png`, `refs/cozy-title.png`.

### Updated in this project (2026-09-17 sync)
- Birthday G0/Restage lane closed on both sides: Travel's own checkpoint
  (`_handover/CRISIS_CHECKPOINT_BIRTHDAY_G0_2026-09-16.md`, `CURRENT_PRIORITY_2026-09-16.md`,
  `SESSION_RETURN_BIRTHDAY_G0_2026-09-16.md`) classifies the G0 Hero as REJECTED VISUAL DIRECTION /
  technical history; this project's independently-authored `BIRTHDAY-2026-ABORT.md` is mirrored
  upstream at `_inbox/BIRTHDAY-2026-ABORT.md`. No conflict, no further Birthday production.
- World priority moved: Travel's `_handover/INDEX.md` (stand 2026-09-17) names
  `WORLD_BUILDER_GOD_MODE_2026-09-17` (START_HERE.md, REUSE_MATRIX.md, WORLD_RECIPE_v0_PROPOSAL.json)
  as the CURRENT DECISION / implementation brief — a WB0 live-authoring loop (Ground Hardening →
  BUILD/PLAY/GOD → persistence → ROAD → BlockBits → stunt ramp → Georg acceptance → STOP).
  `TOWN_FOUNDING_SLICE_2026-09-17` is recorded as STATIC-CI PASS / BROWSER REJECTED — history, not
  a build target.
- `KFB World Design · Setup Pass.dc.html`: SOURCE_MAP gained S-32/S-33 for the two 2026-09-17
  handover packages; OPEN_DECISIONS gained OD-09 closing the Birthday G0 direction question;
  reconciliation date and entry counts bumped to 2026-09-17.
- No changes pulled into the Birthday-titled DCs or `birthday-stage.js`/`birthday-boot.js` —
  correctly aborted, not resumed by this sync.

### Updated in this project (HARD RESET pass)
- `KFB World G0 · Elisa Birthday Restage.dc.html` + `birthday-stage.js` + `birthday-boot.js`:
  the birthday event built **inside** the live Travel/TinySkies runtime. The DC boots
  `travel/wip/travel_globe_wsa/globe-v13/globe-poc.js`; the world keeps running, and the hero camera
  is forced into both `renderer.render` and the `post.render` composite so the host's camera-rig
  cannot take the frame back. The carpet is parked, nothing is overlaid on a screenshot.
- Corrections against the rejected pass: letter installation is now **free-floating 3D letter
  boxes** in two hoisted, depth-bowed rows — no poles, no cables, no cords, no bunting. The flat
  rainbow is **omitted, not faked**. The pasted cut-out clouds are gone; the world's own cloud layer
  carries the sky. The clearing has real Z spread (≈5 m) and is turned off-axis, so it reads as a
  place rather than a proscenium. Contact shadows were added so nothing floats.

### Proof list
**IMPLEMENTED** — live Travel runtime as host; world-integrated clearing on a shallow-water coast;
real actors placed and posed; free-floating letter installation; disco ball; contact shadows;
hero camera locked through the post composite; asset-provenance overlay (`showLabels`).

**REUSED (WORLD)** — terrain, coast/water, volcano (reads as a volcano, erupting), portal,
lighthouse, cloud layer, sky/day-night, lighting rig, flora, card towers, D6. All read, none replaced.

**REUSED (BOUND, 16)** — `GothGirl.glb`; `GothGirl_Stool / _MicStand / _Microphone / _Speaker`×2;
`animal-cat.glb`×2; Santa `Present_A–D`; Clown `balloon_red/blue/yellow`;
`Rig_Medium_Simulation.glb` for the poses.

**REUSED (GRAFT, 1)** — FrizzleBob via `frizzlegraft-v1/graft-mount.v1.js` `mountGraft()` +
`contracts/kfb-pet-graft-driver.v4.json`. Poses are real KayKit clips held at a fixed time:
`Sit_Chair_Idle` t 0.40 (Elisa), `Cheering` t 2.10 (FrizzleBob).

**NEW (3)** — letter installation, disco ball, contact shadows. Nothing else was modelled.

**OMITTED** — rainbow (no integrated version available; omitted rather than faked), curtain/cloth,
fireworks, confetti, motion, audio. Per brief §10.

**KNOWN OPEN**
1. Sky dome reads darker than the day-lit terrain at this phase/altitude. The sky is the world's
   owner (`day-night.js` + `sky-presets.js`); the `phase` tweak exposes it rather than overriding it.
   Needs a world-side call on which preset the birthday runs in.
2. Lighthouse/portal handedness: measured, the world's lighthouse sits at azimuth 1.052 and the
   nearest portal at 2.006 — looking inward, no single yaw gives lighthouse-LEFT and portal-RIGHT
   together. Needs a different coast or a Travel-side portal placement.
3. At wide aspect ratios the left speaker leaves the frame; the placement table holds, the framing
   is one number (`hero.dist`).
4. Elisa's hands do not grip the mic — no hand-slot attach in this pass.

### Updated in this project
- `KFB World G0 · Elisa Birthday Restage.dc.html` + `birthday-stage.js` + `birthday-boot.js`: the Gemini
  mockup staged **inside the live Travel Globe runtime**, not a lookalike. The DC boots
  `travel/wip/travel_globe_wsa/globe-v13/globe-poc.js` from jsDelivr; terrain, coast, water, flora,
  sky/day-night, lighthouse + beam, volcano, portal, card towers and the D6 are Travel's own objects.
  The birthday layer is one group added to `globe.scene` and registered with `globe.lighting`.
- Measured, decisive: `raw.githubusercontent.com` **is** reachable from this preview (GLB fetch 200).
  `docs/v13/BACKLOG_globe.md:180` ("raw BLOCKT im Artefakt-Betrachter") does not apply here. This is
  why the Fable pass did not need placeholder primitives.
- Real actors, no silhouettes: FrizzleBob via `kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js`
  `mountGraft()` + `contracts/kfb-pet-graft-driver.v4.json`; Elisa = `GothGirl.glb`; Hihi =
  `GLB_cube-pets/animal-cat.glb`; stool / mic stand / mic / 2 speakers = the GothGirl prop set;
  presents = Santa `Present_A–D`; balloons = Clown pack; clouds = Platformer Nature pack.
  22 BOUND assets + 1 GRAFT + 3 AUTHORED, reported per object in `staged.report`.
- Both hero poses are **real KayKit clips** held at a fixed time, not hand-posing:
  `Rig_Medium_Simulation.glb` → `Sit_Chair_Idle` (Elisa, t 0.40) and `Cheering` (FrizzleBob, t 2.10).
- `PLACE` in `birthday-stage.js` is the placement contract: one table, stage metres, with anchor,
  hero framing and every object's position/rotation/height. Astra reproduces these numbers.
- `showLabels` tweak projects each object's asset provenance into the frame — the gate "present in
  the code" vs "present in the frame" is now checkable by looking.

### Open, named, not faked
- **Lighthouse/portal handedness.** At the staged coast the world's lighthouse sits at azimuth 1.052
  and the nearest portal at 2.006; looking inward there is no yaw that gives lighthouse-LEFT and
  portal-RIGHT together. Needs a different coast or a Travel-side portal placement — world owner's call.
- **Curtain.** `CURTAIN_SLOT` in `birthday-stage.js` is a reserved mount (rail, drop, segments), nothing
  authored. `three.js webgpu_compute_cloth` requires `WebGPURenderer`; the graft driver's own `verbote`
  pins Travel to "klassisches WebGL, ein three-Build (0.160), eine Quelle". Contract decision first.
- Not in this pass by design (static placement gate): fireworks, confetti, curtain motion, disco-ball
  spin, water reflections of the cast, the second cat's hat graft, comic cards laid on the water.

### 2026-09-16T02:05:00Z
- HARD RESET pass: Birthday event rebuilt inside the live Travel/TinySkies runtime (see the
  "Updated in this project (HARD RESET pass)" section above for full detail). SOURCE_MAP 31
  entries, reconciled.
### 2026-09-15T23:40:00Z
- Fable G0 executed as a transparent overlay on a graded Travel screenshot; actors were
  self-built "PLACEHOLDER silhouettes". Classified by Georg as REJECTED VISUAL DIRECTION.
  Kept as failed-lookdev history; not a visual donor.
### 2026-09-16T00:52:00Z
- Reconciliation pass against `main`: Atlas merged (PR #26), FrankenStein v18 source available.
  SOURCE_MAP 31 entries; OD-01/02/03 closed, OD-05 narrowed; SLOT-01/06/07 filled, SLOT-02 closed.

## Screen map
| Screen / section | Built from |
|---|---|
| Billboard / Media Residency Szene (`KFB Billboard Media Szene.dc.html`, `bb-scene.js`, `bb-boot.js`) | Auftrag `tools/KFB-ToolBox/_handover/CLAUDE_BILLBOARD_MEDIA_DESIGN_2026-09-23/{START_HERE,CLAUDE_DESIGN_BRIEF}.md`; Hero-Donor `registry/assets/v1/packs/kenney-racing-kit.json` @378b209355b1 (billboard family); Karten-/PDF-Technik route-los aus `tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/lab-v9/cologne-props.v1.js` (renderCardQuarter/buildBillboard) + `media/kfb/index.json`; Requisiten über `wd-registry.js` + `wd-donors.js mountAsset()` |
| WorldDesign Lab v1 · Vergleichsbank (`KFB WorldDesign Lab v1.dc.html`, `wd-boot.js`, `wd-view.js`, `wd-look.js`, `wd-macro.js`, `wd-light.js`, `wd-donors.js`, `wd-registry.js`) | Auftrag „KFB WorldDesign Lab v1" + Korrektur „material bench first" (Chat 2026-09-22); GitHub-Wahrheit `tools/KFB-ToolBox/_handover/CLAUDE_DESIGN_WORLD_RACER_2026-09-22/{START_HERE,SOURCE_FAILURE_MATRIX}.md`, `skills/chat/ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md`; Owner-Reader `tools/resident_atlas_s6/lib/atlas.js` (loadAsset/instance/measure/legacyAssemble/loadClips/bindReport), `tools/world_atlas/source/lib/kit-lab.js` (repairTextures, makeViewer-Werte), `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js` (mountGraft/pickGraftPet/faceMods), `kfb-rigs-embed-v3/lab-v6/carlrig-mount.v1.js` (mountCarl), `media/3D_Assets/kfb-pets.js` (loadPets/makePet + EyeRig) nach `media/3D_Assets/GLB_cube-pets/EMBED_CUBE_PET_FULL_v2.2.md`; Pfad-/Revisionswahrheit `registry/assets/v1/packs/*.json`; Texturen `media/3D_Assets/Textures/**` (CC0-Web-Satz, README-Benennung); Lichtspender lokal `wm-boot.js`, `wm-gate-b.js`, `wm-gate-c.js` |
| WhackMan v1 Gate A/B/C (`KFB WhackMan v1.dc.html`, `wm-src.js`, `wm-kit.js`, `wm-recipe.js`, `wm-maze.js`, `wm-motor.js`, `wm-gate-a.js`, `wm-gate-b.js`, `wm-gate-c.js`, `wm-boot.js`) | Auftrag `skills/chat/workflows/KFB_WHACKMAN_V1_2026-09-20/CLAUDE_DESIGN_BRIEF.md`; kayfabizarro `tools/resident_atlas_s6/lib/atlas.js` (+ `juggle-math.js`) für `loadAsset`/`instance`/`measure`/`legacyAssemble`/`LEGACY_RIG`, `tools/world_atlas/source/lib/dungeon-grid.js` (Geometrie-Primitiven), `tools/world_atlas/source/lib/kit-lab.js:346` (`repairTextures`, als Kopie mit Quellenangabe), `tools/world_atlas/docs/HANDOFF_dungeon_S13.md` (Fugenmodell), `tools/resident_atlas_s6/docs/LEGACY_INTAKE_2026-09-18.md` (Legacy-Pfade); Modelle `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/**` @8948a06b, `media/3D_Assets/KayKit Legacy/**` @10a7fdce, `media/3D_Assets/Tiny_Treats_Baked_Goods_1.0_FREE/Assets/gltf/**` @main |
| G0 Restage (`KFB World G0 · Elisa Birthday Restage.dc.html`, `birthday-stage.js`, `birthday-boot.js`) | kayfabizarro `travel/wip/travel_globe_wsa/` (globe-poc.js host, CONTRACT.md, themes, hud-frame.css), `tools/KFB-ToolBox/kfb-rigs-embed-v3/` (EMBED_KFB_RIGS_v3.md, graft-mount.v1.js, kfb-pet-graft-driver.v4.json), `media/3D_Assets/KayKit_Mystery_Series6/**`, `media/3D_Assets/GLB_cube-pets/animal-cat.glb`, `media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_Simulation.glb`, `media/3D_Assets/Platformer Game Kit - Dec 2021/Nature/**`; composition target `_inbox/KFB Elisa B-Day Reference+Mockups/mockup elisa b-day 01 - Gemini_*.jpeg` |
| G0 Hero Frame (`KFB World G0 · Elisa Birthday Hero.dc.html`, `g0-scene.js`, `plates/*`) | FAILED LOOKDEV — kept as history, superseded by the Restage |
| Diorama Straßenecke (`KFB Diorama · Straßenecke.dc.html`, `diorama.js`, `diorama-boot.js`) | eigener Host (kein Travel-Import); kayfabizarro `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js` + `contracts/kfb-pet-graft-driver.v4.json`; Look-Werte gemessen aus `tools/KFB-ToolBox/_inbox/KFB Town a-bit-too-cute-StyleReference/**` (lokal `refs/cozy-*.png`) |
| Walk Scene Orbit (`KFB World Walk · Scene Orbit.dc.html`, `walk-scene.js`, `walk-boot.js`) | kayfabizarro `travel/wip/travel_globe_wsa/globe-v13/globe-poc.js` (host), `globe-v13/kit-massstab.js` (BAUM_WELT, KayKit factor), `travel/wip/travel_globe_wsa/town/town-presentation-v3.js` (ground presentation + lighting recipe), `themes/kfb-med.css`, `kfb-shell.css`, `globe-v13/hud-frame.css`, `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/**`, `8 - February 2024 - Ninja/**`, `3 - September 2023 - Monster Costume/**`, `11 - May 2026 - Magical Girl/**`, `KayKit_Character_Animations_1.1/.../Rig_Medium_Simulation.glb`, `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js` + `contracts/kfb-pet-graft-driver.v4.json`; asset selection from the animation-lab handoff (local `handoff.json`) |
| Walk Look Target (`KFB World Walk · Look Target.dc.html`, `refs/cozy-*.png`) | kayfabizarro `tools/KFB-ToolBox/_inbox/KFB Town a-bit-too-cute-StyleReference/**` (measured), `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-biped.v1.js`, `graft-mount.v1.js`, `_inbox/KFB Elisa B-Day Reference+Mockups/kfb-asset-handoff-animation-lab (2).json` (= local `handoff.json`); KFB-Travel-Globe `_handover/WORLD_BUILDER_GOD_MODE_2026-09-17/**`, `site/world-builder/ground-controller.js`, `runtime-mode.js` |
| Tiny Treats Kit Lab (`KFB Tiny Treats · Promo-Nachbau.dc.html`, `tt-scene.js`, `tt-boot.js`) | kayfabizarro `media/3D_Assets/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/**`, `media/3D_Assets/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/**` (Modelle + `sample.png` als Vergleichsreferenz), `media/3D_Assets/Rocks + Pebbles + Path Tiles by Quaternius/**` (Weg-Baukasten); UI-Vorbild `tools/world_atlas/index.html` + `tools/world_atlas/source/KayKit_Forest_Clearing_S6.html`; Auftrag aus `skills/chat/workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/START_HERE.md` §4 mit Georgs Änderungen vom 2026-09-19; Ersatzvorschläge aus `media/3D_Assets/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/**` |
| SOURCE_MAP / LIVING_WORLD_MASTERPLAN / OPEN_DECISIONS / FABLE_G0_LAUNCH_BRIEF / HANDOFF_SLOTS (`KFB World Design · Setup Pass.dc.html`) | `_handover/Opus Setup · KFB World Design Project.md` and the 2026-09-15 handover folders; KFB-Travel-Globe `travel/CONTRACT.md`, `MASTERPLAN.md`, `docs/OWNER_BOUNDARIES.md`, `docs/DONOR_MATRIX.md`, `docs/LIVING_TRAVEL_GLOBE.md`, `_handover/INDEX.md`, `_handover/CRISIS_CHECKPOINT_BIRTHDAY_G0_2026-09-16.md`, `_handover/WORLD_BUILDER_GOD_MODE_2026-09-17/**`, `_handover/TOWN_FOUNDING_SLICE_2026-09-17/**` |
