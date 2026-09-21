# MODULE · Was schon existiert

**Zweck: verhindern, dass etwas zum zweiten Mal gebaut wird.** Vor jedem neuen Modul hier nachsehen.

**Jede Signatur in diesem Blatt ist aus dem Quelltext gelesen, nicht erinnert** (Stand 10.09.2026).
Wo etwas ungeprüft ist, steht es dabei. Ein Index, der raten würde, wäre schlimmer als keiner.

**Hausform**, die fast überall gilt:

```js
const m = createDings({ THREE, ...abhängigkeiten, params: { … } });
m.update(dt);   m.params;   m.setX(v);   m.dispose();
```

Der Wirt reicht **eine** three-Instanz herein. Ein Modul, das `import * as THREE` selbst auflöst und
nicht `o.THREE` nimmt, ist im nächsten Wirt kaputt.

---

## 1 · Pets — der größte Vorrat

Liegt in **`build/module/`**. Das ist der richtige Ort für geteilte Module; wenn zwei Linien dasselbe
Pet brauchen, importieren beide von hier.

| Modul | Export | Was es kann |
|---|---|---|
| `pet-library.v6.js` | `class Character`, `SETS`, `ARCHETYPES`, `PET_BASE`, `faceShells`, `selectEyeShells`, `buildStripped`, `MODS` | **Die Pet-Basis.** Ein Code-Pfad für alle Sets. Lädt Kenney-Cube-Pets per RAW, kann Augenschalen finden und abtrennen, Recolor, steckbare Mods (u. a. Googly-Eyes). `ARCHETYPES` bindet Rollen an Pets — `frizzlebob` ist der Canon-Hase in Gelb. |
| `pet-eye-rig.v5.js` | `class EyeRig`, `PUPIL_STYLES`, `GAZES` | Augen-Rig: Pupillenstile, Blickrichtungen, Lider. Zahl **oder** `[L,R]` je Seite. |
| `pet-face.v1.js` | `class PetFace`, `FACE_DEFAULTS`, `FACE_META` | Gesicht über dem Rig: Emotes (neutral/happy/angry/sad/surprised/thinking), Drift und Zittern kontinuierlich. `FACE_META` sind fertige Regler-Metadaten. |
| `pet-mouth.v1.js` | `class PetMouth`, `MOUTH_BASE/FILES/DEFAULTS/META` | Mund als Textursatz (FrizzleBob-Mundformen), Sprech-Pool und Schließer. |
| `pet-motion.v2.js` | `class PetMotion`, `MOTION_DEFAULTS`, `CLIPS`, `EVENTS`, `COMBOS`, `TRIGGER_INFO` | **Bewegungs-Grammatik.** Idle/Hop/Jump/Land mit Anticipation, Squash, Stretch, Rebound · die 8 Kenney-Clips · Spiel-Ereignisse (`drop`, `brake`, `card`) mit deklarativem Mapping auf Gesicht, Körper, FX, Auge. |
| `pet-fx.v1.js` | `class PetFX` | FX als Interpunktion, nicht Dauerregen. `update(dt)` je Frame, Sprites billboarden selbst. |
| `kfb-pets.js` + `kfb-pets.json` | `resolvePet`, `petEntry`, `petIds`, `petList`, `glbUrl`, `VERSION` | **Der Pet-Vertrag.** Nachschlagen statt hart verdrahten. |

> **Vorsicht, eine echte Falle:** `build/module/kfb-pets.js` importiert `pet-mouth.v1.js` per
> **jsDelivr-URL aus dem Repo**, nicht relativ. Wer die Datei kopiert, nimmt diese Bindung mit —
> gewollt für Standalones, überraschend beim Debuggen.

**Ältere Fassungen** liegen je Ordner: `build/rollercoaster-v10/pet-eye-rig.v3.js`,
`pet-motion.v1.js`, `pet-library.v6.js`. **`build/module/` ist die neuere Reihe** (Rig v5, Motion v2).
Beim Umzug einer Linie auf die neuere Reihe: Versionssprünge sind nicht rückwärtskompatibel getunt.

---

## 2 · Der Pet-Auswahl-Screen — das ausgearbeitete Beispiel

**`build/rollercoaster-v10/pet-select.v7.js`** · gelesen, Signatur bestätigt.

| | |
|---|---|
| Export | `class PetSelect(stage, opts)` · dazu `inkChip2D`, `inkRibbon2D` (2D-Tusche) |
| Rückgabe | ruft `onSelect(petId)` nach `select → celebrate → transition` |
| Was es ist | Ein **waagerechtes Karussell**: Pets nach außen gedreht, das vordere schaut den Spieler an, Scrollen dreht mit Overshoot. Fokus-Pet auf schwebendem KFB-Kartenrücken-Podest mit Spot, Sprechblase erst **nach** der Bewegung. |
| Hängt an | `pet-library.v6` · `pet-motion.v1` · `pet-eye-rig.v3` |
| Lädt per RAW | Kartenrücken-Podest · `skydome_a.webp` als Himmel |
| Gemessener Inhalt | **12 von 24 Pets sind spielbar** — spielbar heißt: hat eine Stimme (Narrator-Prompt). Die Liste steht als `PLAYABLE` in der Datei. |
| Eingebunden als | `rc-pet-select` in der Importmap von `Rollercoaster Ride v11.dc.html` |

**Wenn das in eine neue Linie soll:** der Wirt muss `stage`, eine three-Instanz, einen GLTF-Loader und
eine Materialfabrik stellen; `onSelect` ist der einzige Ausgang. Die Tusche kommt mit — **nicht** eine
zweite Tuschekante daneben bauen.

Weiter in derselben Ecke: `frizzlebob-voice.v3.js` (Stimme, auch als
`terrain-v25/frizzlebob-voice.js` mit `class FrizzleBobVoice`) und `rc-world-dancefloor.js`.

---

## 3 · Welt und Terrain — `terrain-v25/`

| Modul | Export | Was es kann |
|---|---|---|
| `voxel-terrain.js` | `createVoxelTerrain` | Höhenfeld aus instanzierten Würfeln, fbm + Domain-Warp + Biome, `edge3.jpg` als Kachel. Kann Paletten, Regenbogen, Farbparameter. |
| `skydome-shader.js` | `createSkydome` | Prozeduraler Himmel **plus** statische Skyboxen (Aquarell, Sternfeld, Nacht) per RAW. `setVariant`, `setPalette`, `follow(camera)`. |
| `world-context.js` | `makeWorldContext`, `MODES`, `STORY_PALETTES`, `paletteFromVector`, `cardSemanticVector`, `mulberry32`, `joinSeeds`, `hashStr`, `glowOf` | **Das Herz:** drei Karten → semantischer Vektor → Seed → Welt. Deterministisch. Die sechs D6-Story-Modi und ihre Paletten sind hier kanonisch — Terrain **und** Himmel lesen dieselbe Tabelle. |
| `world-palettes.js` | `NAMED_PALETTES`, `PALETTE_OPTIONS`, `resolvePalette` | Acht benannte Farbwelten. |
| `color-worlds.js` | `createColorWorlds`, `rotateStops`, `guardStops` | Farbwelten, die beim Fliegen morphen. |
| `travel-stage.js` | `createTravelStage` | **Der Bühnenaufbau in einem Aufruf:** Renderer, Szene, Kamera, Sonne, Himmel, Terrain, Bodensonden. Gibt zurück, besitzt nicht. |
| `voxel-glyphs.js` | `createVoxelGlyphs` | Schrift aus Würfeln. |
| `ground-shadow.js` | `createBlobShadow` | Boden-Schatten ohne Shadow-Map. |
| `light-budget.js` | `createLightBudget`, `palettePruefung`, `PAPIER_ALBEDO`, `PROP_ALBEDO`, `SAT_KEEP` | **Ein Ort besitzt die Helligkeit.** Vorher besaß sie niemand, und drei Runden „immer noch überstrahlt" waren die Folge. Prüft Paletten gegen gemessenes Papier-Albedo (0,92). |
| `pet-lighting.js` | `createPetLighting` | Himmel als PMREM-Environment — die billigste Art, Farbe ins Material zu holen. |
| `zone-ring.js` | `createZoneRing` | Zonen-Ring, liest `zone-index.json` + `zone-registry.json`. |
| `post-radial.js` | `createRadialPost` | Radiale Nachbearbeitung. |

---

## 4 · Bewegung und Kamera — `terrain-v25/`

| Modul | Export | |
|---|---|---|
| `flight-controller.js` | `createFlightController` | Flug. SPD_MIN 2 · CRUISE 9 · SPD_MAX 42. |
| `walk-controller.js` | `createWalkController` | Gehen und Sprung am Boden. |
| `pet-kinetics.js` | (Fabrik, in v25 stark bearbeitet) | Bob, Stauchung, Kadenz, Schrittmaß. `setBob('run'\|'hang', v)`, `bobReport()`. **Renn-Bob wartet auf ein Urteil.** |
| `pet-facing.js` | `createPetFacing` | Ausrichtung. |
| `camera-rig.js` | `createCameraRig` | Kamera mit Einzug und Terrain-Flucht. |
| `mode-owner.js` | `createModeOwner`, `assertController` | **Wer den Bildschirm besitzt.** `assertController` prüft einen Controller gegen den Vertrag — der Grund, warum Modus-Wechsel nicht mehr streiten. |
| `warp-jump.js` | `createWarpJump` | Sprung ab 300 u Restdistanz. |
| `travel-manager.js` | `createTravelManager` | Reise-Ablauf in Schritten. |
| `travel-events.js` | `createEventTable` | Ereignistabelle. |
| `travel-heat.js` | `createTravelHeat` | Hitze aus Geschwindigkeit. |
| `arrival.js` | `createArrival` | Anflug-Regie: Beats als Grenzen auf **einem** Fortschritt, nicht als Schwellen. |

---

## 5 · Kampf — `modules/` (linienunabhängig) + `terrain-v25/`

| Modul | Export | |
|---|---|---|
| `modules/kfb-combat-def.js` | `WEAPONS`, `AMMO`, `ENERGY`, `SURFACES`, `ENEMIES`, `READY`, `resolveImpact`, `impactTable`, `enemyShot`, `ATLAS`, `INK/GOLD/RED/PAPER/SAND`, `rng` | **Die Kampf-Wahrheit.** Waffen, Munitionsformen, Energie × Oberfläche → Trefferbild (32 Zellen), Gegnerliste mit `ready`-Kennung. Vier Farben, keine fünfte. |
| `modules/kfb-mech-combat.js` | `default class MechCombat`, `MECHS`, `WEAPONS`, `SKELETONS`, `CLIP_ALIAS`, `SFX_PRESETS`, `MATH_RANDOM_STELLEN` | Mech-Kampf. Skelett-Gegner uniform 1,85 m, **Skalierung immer über die Idle-Pose-Bbox** — nie Bone-Span, nie T-Pose. |
| `modules/kfb-hit-response.js` | `createHitResponse` | Trefferreaktion. Knockback 0,9 — **Urteil offen.** |
| `modules/kfb-combat-cues.js` | `createCombatCues` | Klang-Anlässe. |
| `modules/kfb-combat-travel-adapter.js` | `createCombatSeam` | **Die Naht** zwischen Kampf und Reise. Das Muster für „zwei Systeme, ein Wirt". |
| `modules/kfb-weapon-dice.js` | `WEAPONS`, `AMMO`, `createDiceAmmo` | Würfelwurf, ballistisch. |
| `modules/kfb-weapon-eyeball.js` | `WEAPONS`, `AMMO`, `createEyeballAmmo` | Augapfel: Regenbogenspur, zerplatzt, Fehlschuss hüpft. |
| `modules/kfb-stride-measure.js` | `createStrideMeasure` | **Schrittmaß messen** statt schätzen (Standfuß-Drift im Clip). Ergebnis: `schrittmass.json`, 41 Messungen. |
| `terrain-v25/combat-shots.js` | `createCombatShots` | Schuss-Pool: 48 Schüsse, 64 Sprites. |
| `terrain-v25/sky-mobs.js` | `createSkyMobs`, `MOB_QUELLE` | Sky-Mobs. Jede Zahl mit Herleitung, damit sie nicht als Meinung dasteht. |
| `terrain-v25/sky-dice.js` | `createSkyDice` | Drei Würfel, 120° im Azimut — wer sich dreht, hat nach höchstens 120° einen im Bild. |
| `terrain-v25/slot-dice.js` | `createSlotDice` | Würfel-Slots. |

---

## 6 · Karten und Tusche — querliegend

| Modul | Export | |
|---|---|---|
| `skills/kfb-ink-canon.js` (Repo) | — | **Die Kanon-Feder. Importieren, nie nachbauen.** Es gibt genau eine Tuschekante. |
| `kfb-ink-outline.js` (Projekt) | — | Tusche-Umriss im Projekt. |
| `terrain-v25/card-registry.js` | `createCardRegistry` | 130 Decks, je 56 Karten. Lädt Registry und Deck-JSONs. |
| `terrain-v25/card-carrier.js` | `createCardCarrier` | Karten-Träger in der Welt. |
| `terrain-v25/card-collage.js` | `createCardCollage` | Landschaft aus Karten, Reißkante. |
| `terrain-v25/card-dock.js` · `card-title.js` · `card-backside.js` | `createCardDock`, `createCardTitle` | Dock, Titel, Rückseite. `card-backside` ist **absichtlich** ein eigenes Modul: ein Import aus `sky-cards` wäre ein Zyklus. |
| `terrain-v25/sky-cards.js` | `createSkyCards`, `backsideBereit` | Karten im Himmel. |
| `cardbuilder/` + `skills/kfb-embed-bundle v3/` | `createCardBuilder` | Karten-Einbettung, Geschwister vom selben Basis-URL. |
| `kfb-box-material.js` · `kfb-texture-catalog.json` | — | Material und Texturkatalog. |
| `kfb-cartoon-deform.js` · `kfb-deform-instanced.js` | — | Cartoon-Verbieger, auch instanziert. |

---

## 7 · Ton, Stimme, Erzähler

| Modul | Export | |
|---|---|---|
| `terrain-v25/travel-audio.js` | `createTravelAudio`, `AUDIO_MOODS` | Prozedurale Klangbank je Story-Modus (TRAGIC, COMIC, …) mit Grundton, Verhältnissen, Helligkeit, Hall, Fahrtwind. **Ton standardmäßig aus.** |
| `terrain-v25/narrator.js` | `createNarrator` | Reflexe mit Mindestabstand — Anlässe dürfen sich nicht stapeln. |
| `terrain-v25/narrator-llm.js` | `createNarratorLLM` | LLM-Erzähler, Rate begrenzt (15/min). |
| `terrain-v25/narrator-prompts.js` | `createPromptRegistry` | Prompt-Registry per RAW. |
| `terrain-v25/frizzlebob-voice.js` | `class FrizzleBobVoice` | Sprachausgabe. |

---

## 8 · HUD, Bedienung, Werkzeug

| Modul | Export | |
|---|---|---|
| `terrain-v25/settings-schema.js` | `buildSections` | **86 kB — die Wahrheit über jeden Zahlenwert.** Wer einen Regler sucht, sucht hier. |
| `terrain-v25/settings-overlay.js` | (Fabrik) | Das Bedienfeld selbst. |
| `terrain-v25/hud-cube.js` | `createHudCube` | Weltwürfel im HUD. |
| `terrain-v25/hud-stub.js` | `createHudStub` | Platzhalter-HUD. |
| `terrain-v25/note-field.js` · `lesson-search.js` | `createNoteField`, `createLessonSearch` | Notizen, Suche. |
| `overworld/ui-kit-ts.js` | — | **Tiny-Swords-Baukasten, 96 Teile** (aus 19 gewachsen): Knopfzustände, Rahmen, Leisten. Ungeprüfte Signatur. |
| `asset-index.js` · `asset-repo.json` | — | Asset-Zugriff über die Bibliothek. |

---

## 9 · Was ausdrücklich **kein** Modul ist

Die rund dreißig Werkbänke und Prüfstände (`PROJEKTE.md` §11). Ihr Produkt ist eine **Zahl**, kein
Code. Sie sind nicht dafür gebaut, zusammengesetzt zu werden — genau dieser Versuch war die
Gründungsdiagnose. Wer daraus schöpft, schöpft den **Befund** und schreibt ihn ins living document,
nicht die Datei.

---

## 10 · Bevor du hier etwas hinzufügst

1. **Nur eintragen, was du gelesen hast.** Eine erfundene Signatur kostet mehr als ein fehlender
   Eintrag.
2. **Ein Modul, ein Ort.** Dieselbe Datei zweimal im Projekt heißt: zwei Fassungen, die auseinander
   laufen. `build/module/` ist der Ort für Geteiltes.
3. **Versionen im Dateinamen** (`pet-motion.v2.js`), nicht im Ordner. So kann eine Linie umziehen,
   ohne dass die andere bricht.
4. **Wenn ein Modul den Wirt-Vertrag bricht, hier notieren** — sonst tritt der nächste in dieselbe
   Falle (siehe die jsDelivr-Bindung in §1).
