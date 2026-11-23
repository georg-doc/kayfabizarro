# KFB Modul-Katalog R1 · Spender und ihr Rest-Potenzial (23.11.2026, V-2101)

Stufe 1 der Eskalationsleiter (SOP §2a). Bevor jemand sucht oder baut, wird hier geprüft, ob ein schon eingebauter Spender es mit einem anderen Preset, Modus oder Parameter kann. Neue Spender bekommen beim Übernehmen sofort eine Zeile (SOP §2, Schritt 8).
Spalten: Spender · Ast · im Spiel (Pfad, Schalter) · übernommen · **Rest-Potenzial** · V. Pfade relativ zum Spiel-Repo. `?` = Rest nur im Original-Repo sichtbar, nicht geraten.

## Größte ungenutzte Vorräte
1. **Effekseer:** 28 von 33 Effekten ungenutzt (Katalog `replies/VFX_EFFEKSEER_R1/`). Darunter 5 Schwert-Spuren, 3 Schilde, Spark Hit, Red Hit und Shockwave. Passt direkt zu Einhandschwert, Schild und Stangenwaffen.
2. **Ultra Elements:** 32 von 39 Zaubern ungenutzt, `setParam` mit 411 Parametern und je 3 benannten Looks, `setSky` für Tag und Nacht, `autoQuality`. Wind Slash ist schon für die Schallfaust vorgemerkt.
3. **Patch Fire:** 8 weitere Presets: Fackel, Kerze, Gas (blau), Kohlebecken, Kamin, Freudenfeuer, Kiste, Feuerwand.
4. **Elemental Abilities:** Portal, Aether und Fire Portal, dazu 3 Boosts (brauchen das CharacterController-Rig). Georg: später als Power-Moves bzw. Boss-Fähigkeiten.
5. **codevember-2026 (Adam Chernick, MIT):** Genutzt sind 7 Tage (1, 4, 11, 13, 17, 18, 21), die übrigen Tage sind unberührt. Bolt-Handtracking ist vendored, aber nicht verdrahtet.

## Katalog
| Spender | Ast | Im Spiel | Übernommen | Rest-Potenzial | V |
|---|---|---|---|---|---|
| Patch „Realistic car“ (patch.gg/patch/car 3.0.3; Reifen Dechode, Getriebe Easy-Vehicle, Aufrichten Bruno Simon, Rapier) | Spiel | `src/vendor/patch-car`, `src/m2/M2Car.jsx`; `fahrphysik=patch1`, `fahrton=mix`, `soldatpuppe=r1` | car.js, effects.js, sound.js, 81 CC0-Ogg | Kameras, Ragdoll, Yard, `dirt.js` (Schmutz am Auto), Rallye-Bühne (Poly-Haven-Boden, ez-tree), `tools/bench.mjs`; `fahrprofil=r1` nur Kandidat | V-1860–1868 |
| Ultra Elements (Humpalumps; patch.gg/patch/elements) | VFX | `src/vendor/elements`, `src/look/elementeNaht.js`; `elemente=r1` (geparkt) | Bibliothek unverändert, 7 Zauber auf der VFX-Bühne | 32 Zauber (u. a. Frozen Lightning, Fire Tornado, Black Flame), 411 Parameter mit Looks, Himmel, autoQuality, `examples/game.js`, Zauber-Vorlage; `spells.json` und `tuning.js` nicht vendored | V-1721–1732, V-2014 |
| Elemental Abilities (Chiro Visuals; patch.gg/patch/abilities) | VFX, Spiel | `src/vendor/abilities`, `src/m1/abilities.jsx`; `abilities=r1` (aus seit 13.11.) | 10 Fähigkeiten auf Waffen gemappt | Portal, Aether, Fire Portal, 3 Boosts, Mannequin mit Quaternius-Cast-Clips | V-1664/1667 |
| Patch Fire (MIT) | VFX | `src/vendor/fire`, `src/look/feuerNaht.js`; `feuer=0` aus, `feuerwind=r1` | nur `campfire` | 8 Presets (s. oben); Georg wünscht einen gebogenen Flammenstrahl | V-1721/1723/1813 |
| Effekseer + Effekt-Pack (patch.gg/patch/effekseer 1.0.4) | VFX, Regie | `src/vfx/effekseerSchicht.js`, `portalSprung.r2.js`; `portal=r2` | 5 von 33 | 28 Effekte, Katalog `replies/VFX_EFFEKSEER_R1/` | WS0 21.11. |
| INKWAVE (Jayden Davis, MIT; patch blendi/inkwave) | VFX, Spiel | `src/vendor/inkwave`, `src/look/tintenKarte.js`; `labyink=r1` | Farbstempel, inkShading, Projektile, Physik | Gesamte Spielschicht: Match, Bots, Navigation, CameraRig, Minimap, swimWake, screenfx, Musik, UI | V-1852/1856 |
| Low-poly trees (patch.gg; Rand-Monster-Generator) | 3D | `src/vendor/lowpoly-trees`, `table-diorama/stage/lowpolyTrees.js` | 6 Archetypen × 2 Seeds, nur Geometrie | Generator, Ranken, Wind-Rig und -Animation, mehr Seeds | Georg 19.11. |
| three.quarks 0.17.1 | VFX | `src/vfx/quarksHost.js`, `kampfVfx.r1.js`; `quarks=r1` | Mündung, Funken, Tracer, Treffer-Splitter, Staub | Mündungsstern wartet auf Georgs Vorlagenwahl; Rest `?` | V-1940/1942 |
| codevember Day 1 „Fold“ | Szene | `src/world/fold/*`; `fold=r1`, `sheepHerd.js` | Stunden, Qualität, Formen, Rig, Herde | Steuerleiste, Presets (`foldpreset`), Testbed-Schalter (ws1c/demos-r0); welche der 7 Formen das Spiel nutzt: `?` | V-1981–2008 |
| codevember Day 21 „Bolt“ | VFX, Regie | `vendor/codevember-bolt`, `src/vfx/plasmaKugel.js`, `portalKugel.r3.js`; `portal=r3` | Filament-Kern, Gase classic, xenon, neon | `hands/` (Handtracking über MediaPipe) vendored, nicht verdrahtet; geplant für die Aqua-Unterwasserkugel | WS0 21.11. |
| codevember Day 4 „Tangle“ | Animation | `src/vendor/tangle/sim.js`, `src/modules/wollknaeuel/*`; `schlange=r1` | PBD-Schnüre | geplante Codevember-Klangmaschine (V-2021) | V-2021/2023 |
| codevember Day 13 „Labyrinth“ | 3D, Szene | `vendor/codevember-labyrinth`, `table-diorama/stage/studio/rabbits.js`, `bend.js` | Hase, Hüpfen, `bent()`-Weltkrümmung | Blätter in den Ranken, Labyrinth selbst, CC0-Scans | V-1963 |
| codevember Day 18 „Pendulum“ | Spiel | `vendor/codevember-pendulum`, `table-diorama/stage/pendulum/*`; `pendelwerk=r1`, `pendelhn=r1` | Kugelpendel mit Farbfluss | `?` | V-1959 |
| codevember Day 11 „Rust“ / Boids | Szene | `src/look/skyFlock.js`; `schwaerme=r1` | Möwe, Boids | `?` | A-199/203 |
| codevember Day 17 „Kelp“ | Szene | `src/ride/rideWelt.js` | Kelp-Stängel, Blasen, Farben | `?` | – |
| Dungeon Forge (Majid Manzarpour, MIT) | Szene, Spiel | `src/modules/infiniteRooms/core/generator.js`; `infiniterooms=r3` (aus) | Generator, umgebaut | Original-View und Themen-Ausstattung `?` | V-1859/1861 |
| Patch patchwork-quilt (+ watercolor, colored-pencil) | Szene, Look | `table-diorama/stage/patchwork.js`; `boden=patchworld` | Stoff, Naht, Quilt, Raum | Patch `post.js` (Falz-AO, Tiefenschärfe, Korn); Aquarell, Buntstift, Öl als Raumstile für Mindspaces und Karten-Dungeons | V-1721–1993 |
| mattatz/THREE.Fire | VFX | `src/vfx/campfire/mattatz-fire-shader.js` | Volumen-Feuer-Shader | `?` | – |
| Patch „Apex Drift“ | Szene (Licht) | `src/look/suchLicht.js` | SpotLight-Werte | `?` | – |
| KhazP/rwanda-f1-2026-sim (MIT) | Ton, 3D | `src/vendor/audio/racer/engine.mjs` | Loop-Überblendung | Freigegeben, aber nicht gesehen: Texel-Snap-Schatten, GPU-Reifenverformung, PMREM-Metall, 120-Hz-Schritt, `smoothDamp3`-Kamera, `compileAsync`-Vorwärmen | V-378 |
| Kenney Sci-fi Sounds (patch.gg) | Ton | `src/assets/audio/portal/` | 2 Dateien | restliches Pack | – |
| Kenney Impact Sounds (CC0) | Ton | `src/vendor/audio/footsteps` | 5 Ogg je Untergrund | – | V-389/430 |
| OpenGameArt/Freesound Ambience (CC0) | Ton | `src/vendor/audio/ambience` | 36 Dateien | Tannen-Aufnahme, Dschungel-Nacht, trockener Donner; Original-WAVs statt MP3-Vorschauen | V-458 |
| Tiny Treats House Plants (CC0) | 3D | `src/vendor/plants` | Topfpflanzen mit Augen und Rig | – | V-1291 |

## Eingeplant
- **Einhandschwert, Schild und Effekseer-Schwertspuren:** läuft im Waffen-Schritt (Branch `ws0/waffen-einhand-r1`).
- **Stangenwaffen:** direkt danach.
- **Fire-Presets (Georg 23.11.), danach als eigener Schritt:** Die 8 Presets bekommen feste Orte und Zustände über den bestehenden Pfad `src/look/feuerNaht.js`, ohne neuen Feuer-Code:
  - Fackeln im Gefängnis-Labyrinth;
  - Kerzen und Kamin in Innenräumen;
  - Kohlebecken im Amphitheater;
  - Freudenfeuer an Lagerplätzen;
  - brennende Kiste als Zerstörungszustand;
  - Feuerwand als Gefahr bzw. Boss-Element;
  - blaues Gasfeuer für MiB- und Sci-Fi-Orte.

  Georgs Wunsch nach einem gebogenen Flammenstrahl wird zuerst mit dem Preset `line` und seinen Parametern geprüft. Abnahme wie immer: Kampfbühne bzw. Spiel-Look, stille Blind-Kritik.

- **Elements-Zauber (Georg 23.11.), nach den Fire-Presets als eigener Schritt:** Die 32 ungenutzten Zauber von Ultra Elements werden Zauberwaffen und Fähigkeiten zugeordnet, über `src/vendor/elements` und `src/look/elementeNaht.js`, ohne neuen Effekt-Code:
  - **Zauberstab (einhändig):** die 2 Magie-Clips aus WSB r4.
  - **Kampfstab (zweihändig):** Stangenwaffen-Clips.
  - **Schallfaust:** Wind Slash (V-2014, A-226 bei WS1, dort abstimmen statt doppelt bauen).
  - **Hybride für Boss-Fähigkeiten:** Frozen Lightning, Fire Tornado, Black Flame.
  - Je Zauber einer der 3 benannten Looks über `setParam`, dazu Tag/Nacht über `setSky`, `autoQuality` für Handys.
  - Farbe nach dem Meta-Typ der Waffe.

  Vorher klären, warum `elemente=r1` geparkt ist (V-1721–1732), und die nicht vendorten `spells.json` und `tuning.js` aus dem Spender nachziehen.

## Kandidaten (noch nicht im Spiel)
**adamwebsite.com/experiments (Adam Chernick):**
- Lizenz: Keine Lizenz angegeben, nur „extended from R3F/three.js open source examples“. Deshalb Idee übernehmen und nachbauen bzw. auf die three.js/pmndrs-Originale zurückgehen. Den Autor bei Bedarf fragen.
- Die vielversprechendsten Experimente:

| Experiment | Ast | Wofür bei uns |
|---|---|---|
| Cell Fracture (experiment-four) | VFX | Zerstörung mit eckigen Splittern, passt zum Spell-Spill-Ziel |
| Thunder Clouds (experiment-six) | VFX, Regie | Blitz-Flash und Kamerawackeln |
| Environment Blur and Transitions (experiment-three) | Regie | Übergänge, Hero-Umgebung |
| Building Dynamic Env Maps / Envmap Ground Projection | Regie, 3D | Produktfilm-Licht und Bodenkontakt (Buchmaschine, Auto) |
| Audio Analyser | Ton, Szene | Musikreaktive Blasen und Billboards (Bubble FM) |
| Grass Shader | 3D, Szene | Wind in der Vegetation |
| Color Grading (LUT) | 3D | Feinabstimmung des Looks, nur über das eine Licht-Rig |
| Water Shader | 3D, Szene | Aquarium- und Wasserflächen |

Nur WebGPU, für uns derzeit nicht direkt nutzbar: Cloth Sim Alley, Pipe Screensaver, Vehicle Explorer.

**codevember-2026, weitere Tage:** Die Seite rendert per JavaScript, ich konnte sie nicht auflisten. Die übrigen Tage im Repo werden durchgesehen, sobald ein Ast Bedarf hat.

**patch.gg Toolbox Assets** (`patch.gg/create/toolbox/assets`): Suche über den patch-gg-Weg. Jede Übernahme bekommt hier eine Zeile mit Lizenz-Zeile.
