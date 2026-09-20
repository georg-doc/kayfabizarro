# KONZEPT — KFB Mech Voxel World v1
**Stand 2026-09-03 · Konzept & Architektur (Fable 5.1 / high) · Ausarbeitung der Slices in Opus/Sonnet-Chats**
Quellen: `uploads/KFB WorldBuildung + Game Modules - AresRPG.txt` (Blaupause) · `KFB Mech Combat Slice v10.dc.html` (Combat, VFX, Audio) · `KFB Card Zone Lab v2.dc.html` (Zone, Graben, Fluss) · `terrain-v10/` (Boden) · `modules/kfb-vfx.js` · `docs/VFX_DESIGN_v10.md` · Georgs Antworten 2026-09-03.

---

## 0 Entscheidungen (Georg, 2026-09-03)

| Frage | Entscheidung |
|---|---|
| Kaskaden-Regel | **Boden-Match-3:** Mobs hinterlassen farbige Voxel-Gems, drei gleiche in Reihe → Explosion, Kettenreaktion |
| Welt-Topologie | **Endlos gestreamt**, Regionen ≈ 4×4 Chunks mit eigenem Biome/Story-Mode aus dem Seed, weiche Naht |
| Card Zones im MVP | **Nur Anker** (Obelisk/Sockel markiert den Ort), Zone in späterem Slice |
| Mech-Wechsel | **Tasten 1–4** im Feld (5 = Robot) |
| Gegner-Roster MVP | Drohnen (fliegend) + Skelette (4 Arten) aus v10. **Später primär `media/3D_Assets/MonsterPack_Quaternius`** |
| Fail-State | Respawn wie v10 (Hull regeneriert nach Ruhe, Tod = Respawn am Anker) |
| Dieser Turn liefert | Konzept-Doku · Slice-Plan mit DoD + Screenshot-Beweis · leeres Skelett (bootet, Terrain + Mech, ohne Kaskade) |

---

## 1 Was das Spiel ist

Ein **Chill-&-Fun-Shooter in einer endlosen Voxelwelt.** Man fährt einen von vier Mechs durch Regionen, die aus einem Seed entstehen, sieht am Horizont die nächste Stimmung kommen, räumt Mob-Gruppen ab und lässt die Gems, die liegen bleiben, in Kaskaden platzen. Kein Fail-Druck, kein Inventar, kein Menü-Tiefgang. Die Belohnung ist das Bild: Farbe, Interpunktion, Kettenreaktion.

Drei Loops, ineinander:

```
EXPLORE   Region betreten → Stimmung wechselt (Palette, Nebel, Himmel) → Anker sichtbar → nächste Region am Horizont
COMBAT    Mob-Gruppe (3er) sichten → Mech dreht → Windup lesbar → Treffer → Reaktion → Gem fällt
CASCADE   Gems liegen auf dem Zellraster → 3 gleiche in Reihe → Pop → Nachbarn kippen → Kette → Score-Multiplikator
```

Der dritte Loop ist das, was v10 nicht hat und was das MVP rechtfertigt.

---

## 2 Was aus dem Bestand kommt (nicht neu bauen)

| Bestand | Rolle in v1 | Anfassen? |
|---|---|---|
| `terrain-v10/voxel-terrain.js` | Boden, D6-Stufen, Chunk-Streaming (`recenter`), Carve, Ruhezonen, Caster-Schatten | **v11-Zusatz nötig:** per-Chunk-Weltkontext (siehe §4.2). Additiv, Default = altes Verhalten |
| `terrain-v10/world-context.js` | Seed-Logik (FNV/mulberry32/joinSeeds), Modi, Paletten, `makeWorldContext` | nein |
| `modules/kfb-vfx.js` | Alle Combat-FX; vier Ereignisse `shake · hitstop · cue · react` | nein — Kaskade spricht dieselbe API (`impact`, `aftermath`, `flip`) |
| v10 Slice: Mech-Laden, Panzer-Steuerung, Sprung, Over-Shoulder-Kamera, Waffenzeilen, Audio-Bank | Locomotion + Combat | **herauslösen** in Module (§3), nicht kopieren |
| v10 Slice: Drohnen, Skelette (KayKit, geteiltes Rig) | Gegner-Roster MVP | als **EnemyRecipe** neu fassen (§4.4), Modelle bleiben |
| Card Zone Lab v2: Carve-Rechteck, Graben = Wasser-Level, Fluss = `setCarvePath` | später: Card Zone als Landmark | im MVP nur der Anker-Ort |
| `KFB Zonen-Registry` · `zone-registry.json` | später: welche Karte an welchem Anker | nicht im MVP |

---

## 3 Architektur — Schichten (nach AresRPG-Blaupause, auf KFB-Maß)

```
kfb-world        modules/kfb-region-field.js        Seed → Region (Modus, Vektor, Biome, Anker, Name), Naht-Mischung   ✔ Slice 0
                 terrain-v10/*                      Höhe, Chunks, Farbe, Carve                                          ✔ (v11: per-Region-Kontext)
kfb-engine       (im Wirt)                          Renderer, Kamera, Licht, Himmel, Wasser-Ebene, Streaming-Takt        ✔ Slice 0
kfb-gameplay     modules/kfb-locomotion.js          Panzer-Steuerung, Sprung-Ereignis, Grounding, Squash-Werte           Slice 1 (aus v10 herauslösen)
                 modules/kfb-mech-combat.js*        Waffenzeilen, Feuern, Geschosse, Hitscan, Beam                       Slice 3
                 modules/kfb-enemies.js             EnemyRecipe, AttackPhase-Maschine, Spawner pro Region                Slice 4
                 modules/kfb-gems.js                Gem-Raster, Match-3, Kaskaden-Auflösung                              Slice 5
kfb-content      modules/kfb-mech-roster.js         MECHS, WEAPONS, Signaturen (heute Konstanten im v10-Wirt)             Slice 3
                 EnemyRecipe-Tabelle (JSON)         Roster: Drohne, 4 Skelette; später MonsterPack_Quaternius            Slice 4
kfb-presentation modules/kfb-vfx.js                 unverändert                                                          ✔
                 modules/kfb-combat-sfx.json + Bank Audio, `cue` → Datei                                                  Slice 3
                 Kaskaden-Choreografie              Pop-Takt, Multiplikator-Interpunktion, Welt-Tint                      Slice 5
kfb-replay       Seed im HUD + `localStorage`       gleicher Seed = gleiche Welt; Event-Log optional                     Slice 0 (Seed) · später (Log)
```

`*` `modules/kfb-mech-combat.js` existiert als v3-Spiegel, ist aber vom v10-Wirt nicht importiert; v10 hat die Logik inline. Slice 3 entscheidet: Spiegel aktualisieren oder aus v10 herauslösen — nicht beides.

**Regel M11 gilt für jede Schicht:** Module zeichnen bzw. rechnen, der Wirt entscheidet. Kein Modul kennt `camera`, `AudioContext` oder `enemy.hp` eines anderen.

---

## 4 Datenverträge

### 4.1 Region (steht, `kfb-region-field.js`)

```js
Region = { rx, rz, id:'R+1-2', key, seed, storyMode, storyModeName, biome, vector{8}, wc, palette[3][3],
           center{x,z}, anchor{x,z}, name, fogDensity }
field.regionAt(x,z) · field.neighbors(rx,rz,ring) · field.moodAt(x,z) → { here, palette (gemischt), fogDensity, parts[] }
```
Region = `regionChunks × CHUNK` (Default 4 × 48 u = **192 u**). Naht `seam` = 22 u je Seite. Deterministisch: `joinSeeds(worldSeed,'region',rx,rz)`.

**Slice-0-Grenze, ehrlich:** die Region trägt die **Stimmung** (Palette, Nebel, Himmel, Wasserfarbe, Anker, Name). Die **Höhenform** kommt aus EINEM globalen Kontext, sonst springt der Boden an der Grenze unter dem Mech. Biome-Form pro Region braucht Terrain v11 (4.2).

### 4.2 Terrain v11 — additiver Zusatz (Slice 2)

```js
createVoxelTerrain({ …, contextAt: (wx, wz) => wc })   // optional; ohne = altes Verhalten
```
`bakeChunk` fragt pro Zelle `contextAt`, `heightAt` mischt in der Naht die zwei Höhenwerte über `moodAt().parts`. Palette pro Instanz statt Uniform (Attribut `aPal` 3 Stops oder Index in ein 6-Modi-Array). `groundHeightAt` muss **dieselbe** Mischung rechnen, sonst schwebt der Mech in der Naht (Falle aus dem Card-Zone-Lab: zwei getrennt gerechnete Radien).

### 4.3 CombatHit (aus Blaupause, an `kfb-vfx.impact` angelehnt)

```js
CombatHit = { attackerId, targetId, point, normal, weapon{color,energy,heft,muz}, surface:'earth|metal|bone|air|water|shield', airborne, impulse }
```
Der Wirt bestimmt `surface` (`_surfaceOf`), das VFX-Modul zeichnet, `react` kommt zurück. Unverändert zu v10.

### 4.4 EnemyRecipe (datengetrieben, keine Klassenhierarchie)

```js
EnemyRecipe = { id, model:{url, scale, clips}, archetype:'guard|chaser|ranged|swarm', material:'metal|bone|organic',
                hp, speed, perception:{radius, fov}, attack:{range, windup, active, recovery, dmg, shot?},
                temperament:'aggressive|territorial|coward', gem:{color}, group:{size:3, spacing} }
AttackPhase = idle → detect → approach → threaten → windup → active → recovery → retreat
```
Jeder Mob **trägt eine Gem-Farbe** (6 Farben = 6 Story-Modi-Glows) und fällt als 3er-Gruppe gleicher Farbe. Abnahme Phase 4 der Blaupause: *Spieler versteht den Angriff vor dem Schaden* → `threaten` + `windup` sind sichtbar (Pose, Emissive-Puls), bevor `active` schadet.

### 4.5 Gem & Kaskade (neu, Slice 5)

```js
Gem  = { cell:{cx,cz}, color:0..5, y, state:'falling|rest|primed|popping', born }
Grid = Map<cellKey, Gem>   // Zellraster = Terrain-Raster (CELL 3), Rest-Höhe = groundHeightAt(cell)
```
Regeln:
1. Ein sterbender Mob lässt **ein** Gem seiner Farbe fallen; es rollt auf die nächste freie Zelle (max. 2 Zellen Suche), sonst verschwindet es mit einem Puff.
2. Nach jedem Rest-Ereignis prüft `kfb-gems.match(cell)` Reihen ≥ 3 in X und Z (kein Diagonal, wie Candy Crush).
3. Treffer → alle Gems der Reihe `primed` (120 ms Wackeln, lesbar), dann `popping` (Flipbook `star`, Farbe = Gem), **Nachbarn kippen**: jedes Gem im Radius 1 Zelle bekommt einen Impuls und rollt eine Zelle weiter → neue Prüfung → Kette.
4. Kettenstufe n → Multiplikator ×(1+0.5n), Interpunktion wächst nicht in Größe, sondern in **Ton und Hitstop** (M4: Struktur konstant, Amplitude über heft). Ab Stufe 3 ein Welt-Puls (`terrain.update({beat:1})`, 1 Frame).
5. Cap: höchstens 12 Pops pro 100 ms, Rest wird in die nächste Welle geschoben (Hauptbuch-Prinzip, nichts flackert).
6. Der Mech kann Gems **schieben** (Kollision) — das ist der Spieler-Eingriff ins Puzzle, ohne UI.
7. Gems altern nicht, aber sterben mit der Region (Streaming: Zellen > 1 Region entfernt werden verworfen).

Keine Physik-Engine: Zellraster + Zustandsautomat, wie das Terrain selbst.

### 4.6 Anker (Slice 0, Platzhalter der Card Zone)

Voxel-Obelisk (Sockel 3×3, Säule 5 Cubes, Kopf leuchtet in Palette-Spitze) am `region.anchor`. Später ersetzt durch Card-Zone-Plateau (Lab v2: Carve + Graben), gleicher Ort, gleicher Seed. Respawn-Punkt der Region.

### 4.7 Persistenz (MVP)

`localStorage['kfb-mvw-v1'] = { worldSeed, pos, mech, visited[], score }` — Reload landet in derselben Welt am selben Ort. Kein Server, kein Protokoll (Blaupause: „nicht übernehmen").

---

## 5 Slice-Plan — jeder Slice mit Definition-of-Done und Screenshot-Beweis

Reihenfolge = Abhängigkeit. Jeder Slice endet mit **Q&A + Beweisbildern im Chat**, bevor Georg ihn sieht. Beweisbild = Capture aus dem Live-Canvas (`readPixels`-Pfad wie v10, **kein** `preserveDrawingBuffer`), abgelegt in `captures/mvw-S<n>-<was>.jpg`.

### S0 — Skelett · *dieser Turn, `KFB Mech Voxel World v1.dc.html`*
Terrain v10 streamt endlos (`recenter` pro Frame), Regionen-Feld färbt Palette/Nebel/Himmel/Wasser mit weicher Naht, Anker-Obelisken im 3×3-Umfeld, Mech 1–5 wechselbar, Panzer-Steuerung + Sprung aus v10, HUD zeigt Region (Name, Modus, Biome, Seed) und besuchte Regionen, F1-Diagnose.
**DoD:** bootet ohne Konsolenfehler · 300 u geradeaus fahren → mindestens eine Naht, Palette wechselt ohne Sprung, Boden bleibt unter dem Mech · `R` würfelt neue Welt · gleicher `worldSeed` → gleiche Region-Namen an gleichen Koordinaten.
**Beweis:** (a) Standbild in der Naht (zwei Farbwelten im Bild), (b) F1-Diagnose offen mit Region-ID und fps, (c) zweimal derselbe Seed → gleiche Namen.
**Offen (bewusst):** kein Audio, keine Props, kein Combat. Biome-Höhenform global.

### S1 — Locomotion als Modul
`modules/kfb-locomotion.js` aus v10 herauslösen: `LocomotionController {pos, vel, grounded, state, facing}`, `step(dt, input, groundAt)` gibt Squash-Werte und Ereignisse (`jump`, `land`, `step`) zurück. Wirt bindet Clips.
**DoD:** v1 fährt sich identisch zu S0; das Modul enthält kein THREE außer Vector3 · Abnahme Phase 2 der Blaupause: kein Schweben, kein Tunneln, stabile Kamera, sichtbarer Bodenkontakt.
**Beweis:** Landung mit Staub auf einer D6-Kante (Standbild), Stufe hinauf/hinunter (2 Bilder).

### S2 — Terrain v11 · Biome pro Region, Naht in der Höhe
`contextAt`-Hook (4.2), Palette pro Instanz, `groundHeightAt` mischt identisch. Props pro Region aus `asset-index.getSet({biome, storyMode, seed})` (v10-Scatter-Rezept, Hash des Ortes).
**DoD:** Plateau-Region neben Meadow-Region ohne Klippe in der Naht · Mech fährt die Naht ab, Höhe stetig · fps ≥ 50 bei 9×9 Chunks · Regler `Variation` (Box-Material) wirkt weiter.
**Beweis:** Naht-Bild mit zwei Biome-Formen, Diagnose-Zeile `groundHeightAt` vs. Instanz-Höhe an 3 Nahtpunkten (Differenz 0).

### S3 — Combat aus v10 als Module
`kfb-mech-roster.js` (MECHS, WEAPONS, CARDS als Daten) · Feuern/Geschosse/Beam als `kfb-mech-combat.js` (Spiegel aktualisieren **oder** herauslösen — eine Entscheidung) · Audio-Bank + `cue`-Mixer · VFX-Adapter (60 Zeilen aus v10). Ziel: Fadenkreuz, Zielrast, Signatur + Wechselwaffe, Kisten als Dummy.
**DoD:** alle 5 Signaturen + 3 Wechselwaffen feuern und treffen Kisten und Boden · Impact-Tabelle 4×6 sichtbar korrekt · `F2` (Sprites aus) spielbar · kein Objekt-Wachstum in `vfx.stats()` nach 2 min Dauerfeuer.
**Beweis:** Standbild pro Waffe auf Erde (8 Bilder, Kontaktbogen), `stats()`-Zeile vor/nach.

### S4 — Gegner als Rezepte, Spawner pro Region
`kfb-enemies.js`: EnemyRecipe (4.4), AttackPhase-Maschine, 3er-Gruppen gleicher Gem-Farbe, Spawner am Regionsrand (nie im Anker-Radius), Population pro Region gedeckelt (z. B. 3 Gruppen), Despawn beim Verlassen. Roster: Drohne + 4 Skelette. Respawn am Anker.
**DoD:** Gruppe erscheint mit sichtbarem `threaten` + `windup` vor dem ersten Schaden (Blaupause Phase 4) · Gruppe teilt eine Farbe (Emissive-Ring am Fuß) · Tod → `react` + Impact aus dem Modul · Respawn am Anker.
**Beweis:** Bildfolge detect → threaten → windup → active eines Skelett-Warriors (4 Bilder), HUD-Zähler.

### S5 — Gems & Kaskade (der neue Loop)
`kfb-gems.js` nach 4.5. Pop-Choreografie über `vfx.flip('star')` + `aftermath` in Gem-Farbe, Kettenstufe → Ton/Hitstop, Welt-Puls ab Stufe 3, Score-Multiplikator im HUD.
**DoD:** 3 Kills einer Gruppe → mindestens ein Pop in ≥ 80 % der Fälle (Gruppe fällt kompakt) · Kette ≥ 3 reproduzierbar (Testtaste `G` legt 9 Gems in Kreuzform) · nie mehr als 12 Pops / 100 ms · fps stabil.
**Beweis:** 4 Standbilder einer Kette (primed → pop → kippen → zweiter pop), Diagnose-Zeile `gems: rest/primed/popping`, Score-Sprung.

### S6 — Politur Chill & Fun
Musik-/Ambience-Bett pro Story-Modus (Drone aus Lab v2 als Grundlage), Region-Betreten-Interpunktion (Name blendet groß ein), Persistenz (4.7), Hilfe-Overlay, Tweaks (Dichte der Gruppen, Kaskaden-Tempo, Region-Größe).
**DoD:** 10 Minuten ohne Ziel spielbar, ohne Regler · Reload landet am selben Ort · Georg-Abnahme.
**Beweis:** Zeitraffer-Kontaktbogen (6 Bilder über 10 min, verschiedene Regionen).

### S7+ (nach MVP, eigene Chats)
Card Zone am Anker (Lab v2 Plateau/Graben), Flüsse zwischen Nachbar-Ankern (`setCarvePath`), MonsterPack_Quaternius als Roster-Erweiterung (nur neue Rezept-Zeilen, kein Code), Tusche pro Objekt (S9 aus dem Re-Home-Handover).

---

## 6 Arbeitsregeln für die Slice-Chats (Opus/Sonnet)

1. **Erst lesen:** dieses Dokument, `docs/VFX_DESIGN_v10.md` §2–3, `docs/SPEC_v10_terrain.md`, `HOUSEKEEPING.md` (Fallen).
2. **Kopieren statt neu bauen:** `KFB Mech Voxel World v1.dc.html` ist der Wirt; jeder Slice ist eine Kopie `v1.<n>` oder ein Modul in `modules/`. Der Vorgänger bleibt (`versions/`).
3. **Beweis vor Ausgabe:** Captures aus dem Live-Canvas, Diagnose-Zeile (F1) im Bild. Kein Screenshot, keine Abnahme.
4. **Q&A-Format im Chat:** je Slice drei Zeilen — *Was steht* · *Was gemessen* (Zahl) · *Was offen*. Dann die Bilder. Dann Georgs Veto.
5. **Pfad-Hygiene:** Assets nur per RAW-URL, Module per `./` mit jsdelivr-Fallback (raw liefert `text/plain`).
6. **Eine Zahl ist leichter zu ändern als ein Modell** — wer am dritten Regler dreht, hat das Modell noch nicht (Re-Home-Handover §4).
7. **Nicht bauen:** Blockchain/Protokoll, Server, Inventar, zweite Arena, Glow-Postprocessing, Klassenhierarchie für Gegner.

---

## 7 Offene Punkte

| Sache | Wer | Bis |
|---|---|---|
| Sechs Gem-Farben = sechs Modi-Glows (`glowOf(MODES[i].ink)`) oder eigene Candy-Palette? | Georg | S5 |
| Region-Größe 192 u (4 Chunks) — zu klein für Stimmungswechsel im Boost (16 u/s ≈ 12 s)? Alternative 6 Chunks = 288 u | Georg, nach S0-Fahrt | S2 |
| `kfb-mech-combat.js`: Spiegel aktualisieren oder aus v10 herauslösen | Slice-3-Chat | S3 |
| MonsterPack_Quaternius: Rig, Clips, Größen sichten (wie KayKit-Recon in v10) | Slice-4-Chat, nach MVP | S7 |
| Card Zone am Anker: welche Karte (Zonen-Registry-Vertrag `kfb-zone-open`) | später | S7 |
