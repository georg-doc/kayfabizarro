# MODUL-DOKU · KFB Skydome + Environment (Stand SKY3, 2026-10-01)

## 1 · Dateien und Abhängigkeiten

```
KFB Skydome Gates SKY3.dc.html          Einstieg (Design Component, braucht support.js)
└─ lab-sky/sky-gates.v3.js              Gate-Bank: ein Renderer, eine Scene, eine Schleife
   ├─ lab-sky/env-host.v3.js            EnvironmentHost
   │  ├─ travel/globe-v13/{sky-presets, day-night, starfield, sky-atmosphere, lens-flare, rain-overlay, weltstimmungen}.js   (Travel-Globe @8614282aab2c, byte-gleich)
   │  ├─ travel/KFB Travel Combat v25/terrain-v25/skydome-shader.js                                                          (Schale 2, blob 919ed27bb4ab, byte-gleich)
   │  ├─ lab-sky/spindle-sky.v5.js      Schale 3 · Vertrag 0.3-candidate
   │  │  ├─ _handover/…/combat-arena-v4/himmel.v4.js                                                                         (Combat-Arena @735b5449bf09, byte-gleich)
   │  │  └─ lab-sky/spindle-sky.v1.js   nur loadCards (Kartenbild aus dem Deck-PDF)
   │  └─ lab-sky/planets.v1.js          Planeten-Schicht
   ├─ lab-sky/cloud-family.v3.js        Archetypen
   │  ├─ lab-sky/cloud-family.v2.js     Feld → Netz, Material
   │  └─ lab-sky/cloud-family.v1.js     Donor, Lappen, Spec, Feld-Instancing, Knete-Grundlage
   │     └─ lab-clay/{clay-soften.v1, clay-material.v10, clay-profiles.v2, clay-relief.v2, clay-relief.v5, clay-toolmix.v1}.js   (K2-Linie)
   └─ lab-sky/spindle-sky.v5.js         Lebenszyklus-Test
```
Historie (lauffähig, nicht mehr Linie): SKY1 → `sky-gates.v1` / `env-host.v1` / `cloud-family.v1` / `spindle-sky.v1` (+ `spindel.v4.js`); SKY2 → `*.v2`.
Regel: neue Fassung = neue Datei `.vN.js`; Vendor-Dateien (`travel/`, `_handover/`, `lab-clay/`) werden nie bearbeitet.

## 2 · EnvironmentHost (`env-host.v3.js`)

`createEnvironmentHost({ THREE?, renderer, scene, camera, lights = null, radius = 1400, fogScale = 1, minutes = 6, travelVariant = 'S', travelMode = 3, cards = null, onNote, getClayU = null, planetDistance = null })`

Besitz (genau einmal): Licht-Rig (eigenes oder Adapter `lights`) · Tageszeit `day-night` (einziger Schreiber für Hintergrund, `scene.fog`, Lichter, Sterne) · Wetter · aktive Schale · Aurora/God Rays/Flare/Regen (aus `nachtGewicht`/`tagGewicht`) · Planeten-Schicht.

| Aufruf | Wirkung |
|---|---|
| `update(dt)` | aus der EINEN Wirtsschleife; treibt Uhr, Wetter, Ebenen, Schale, Planeten |
| `after()` | nach dem Hauptbild: Flare + Regen, ohne zu löschen |
| `setShell('tiny' \| 'travel' \| 'spindle')` | Promise; alte Schale wird vollständig entsorgt |
| `setTime('day' \| 'evening' \| 'night' \| 'auto')`, `setAutoMinutes(m)` | Tageszeit |
| `setWeather('clear' \| 'rain')` | Regen blendet weich ein/aus |
| `setMood('verdant' \| 'molten' \| 'frost' \| 'bone')` | Himmelston-Versatz (`weltstimmungen`) |
| `setSpindleEnds({ unten, oben, palUnten, palOben, seed })` | merkt sich den Zustand auch ohne aktive Spindel |
| `setPlanets(mode, set)` | `'off' \| 'original' \| 'clay'`, `3 \| 6 \| ['Planet_1', …]` |
| `probe()` | Uhr, Gewichte, Wetter, Schale, `opaqueShells` (≤ 1), Nebel, Sonne, Aurora, God Rays, Flare, Stimmung, `shellProbe`, `planets` |
| `footprint()`, `leakTest(n)` | Objekte, Materialien, Geometrien, Lichter, GPU-Geometrien/-Texturen, Programme |
| `cloudColor` | Farbe für Wolkenmaterialien (Sonne, Nacht, Regen) |

Maßstabsanpassungen (benannt): Starfield/Aurora/God-Rays-Gruppen × k; Punktgröße im Starfield-Shader `300` × kStar.

## 3 · Card-Spindle 0.3 (`spindle-sky.v5.js`)

Lebenszyklus: `mount(parent, { cards (6, Pflicht), scale, ends })` · `setEnds(p)` · `follow(camera)` · `update(dt, { brightness })` · `measure()` · `probe()` · `dispose()`.

- Mantel: `himmel.v4` (R 34, 6 Reihen, Backsteinverband, Dunst), unverändert. `hi.trichter.visible = false`.
- Trichter je Ende: Profil `r(s) = r_e + (R − r_e)·(1 − smoothstep(s))`, `h = L·s`, `L = 1,15 R`, `r_e = 0,16 R`, 40 Ringe × 96 Segmente; ein Überlappring 0,4 u in den Mantel. uv.v wächst mit `R / r` (winkeltreu), Textur = Manteltextur (wrapT Repeat). Nebel je Vertex `((s − 0,28) / 0,62)^1,3` in die End-Palette.
- Endfläche: Scheibe r_e am Trichterende, ShaderMaterial (Grund bzw. Himmel), Rand läuft ab r 0,6 in dieselbe Nebelfarbe.
- Zeichenfolge: Mantel/Trichter renderOrder −800, Endfläche −799, alle ohne Tiefentest/-schreiben (wie der Donor) → die Welt zeichnet darüber.
- Paletten: 4 Rollen A–D + Nebel. Quellen `shader` (Vorgabe je Preset), `canyon`/`bucht`/`otown` (WORLDS-Rollen: oben hill·sky·cloud·pad, unten trunk·table·strang·pad), `deck` (Kartenmittelwert `hi.basis` + Kartenkanon Gold #f2c93c / Rot #b8361f). Saat ≠ 1 dreht den Farbton deterministisch um ≤ ±9°.
- Deckungsprobe: 15 Höhen (−84° … +84°) × 24 Azimute von der Spielpose (0, 5,9, 0), normalisierte Gruppe, Ziele Mantel + Trichter + Endflächen. Soll: 0 fehl, 0 jenseits far 120.

## 4 · Clay-Wolken

**Donor** `media/3D_Assets/KFB/Clouds by Jarlan Perez - b3Kia9N2fS2.glb`, Git-Blob `acd9d653f31f249d0bcf11a8b6311594a9d6e153`, 201 576 B. 1 Mesh, 7 476 V / 3 452 △, nach Verschweißen 18 Ellipsoid-Schalen = Lappen, in 3 Wolken (6/7/5).

**v1** (`cloud-family.v1.js`): `loadDonor` (Projektkopie → RAW, SHA-Pin, sonst `SOURCE_REQUIRED`) · `analyseLobes` (Jacobi-Ellipsoid-Fit, Cluster) · `makeSpec` (Rekombination) · `scatterClouds` · `createCloudField` (InstancedMesh je Variante × LOD, LOD nach Entfernung / Wolkenbreite) · `makeClayBase` (Relief- und Werkzeugkarten, Fingerabdruck).

**v2** (`cloud-family.v2.js`): `lobeEllipsoids(lobes, spec)` → `makeField(ell, params)` → `polygonize(THREE, field, box, cells, ao, creaseAO)` → `buildVariant`. Parameter `CLAY_PARAMS = { k 0,022 (smin-Kehle), flat 0,07 (Tisch-Ebene über dem tiefsten Punkt, Anteil Höhe), flatK 0,035, lump 0,011, lumpF 7,5, cells [56, 24, 12] je Breite, creaseAO 0,5 }`. Normale = Feldgradient, Umlaufsinn gegen die Normale geprüft. Material `makeCloudMaterial`: `clay-material.v10`, Profil `cloud` + Toolmix `cloud`, Hand 0,2 · Kachel 0,64 · Abdruck 1,8 je Wolkenbreite (Verhältnis 0,5 : 1,6 : 4,5 aus K1/H0), Stroke 1,0, PrintK 0,55, Mottle 0,06.

**v3** (`cloud-family.v3.js`): `PLAN` (13 Archetypen-Slots), `makeArchSpec(lobes, i, arch, seed)`, `buildFamily(THREE, lobes, { seed, ao, params = { creaseAO 0,32 }, plan })`. Archetypen nehmen nur Donor-Lappen; Überlappregel ≥ 15 % Radius.

Integration: ein Material für alle Wolken, `material.color.copy(env.cloudColor)` je Bild; Himmelswolken mit `fog = false`.

## 5 · Planeten (`planets.v1.js`)

`PLANETS` (11 Pfade), `loadPlanet(THREE, id)` (Projektkopie → RAW, Git-Blob protokolliert, Cache), `clayGeometry` (`softenGeometry` maxEdge 0,12, 2 Stufen, lump 0,014), `createPlanetLayer({ THREE, scene, camera, distance, getClayU })` → `set(mode, set)`, `update(dt, { night })`, `probe()`, `dispose()`. Plätze `SLOTS` (Azimut, Höhe, Winkeldurchmesser) und `SETS` sind Setzungen. Kein eigenes Licht; nachts Eigenleuchten 0,18 × Nacht aus der Atlasfarbe.

## 6 · Gate-Bank / UI (`sky-gates.v3.js`, SKY3-DC)

`bootGates(box, { onState, onNote })` → API: `setGate('E0'|'E1'|'E2'|'E3'|'P')`, `view`, `toggle('wire'|'lobes'|'aoOn')`, `setTime`, `setWeather`, `setMood`, `setShell`, `setSkyClouds(0|4|12|24)`, `setPlanets`, `setEnds`, `spindleView('front'|'top'|'under'|'out')`, `seamProbe`, `lifecycle(n)`, `leak(n)`, `fieldTest()`, `dispose()`. `window.__sky1` zeigt auf die API.
UI-Zustand (Paletten/Messwerte/Details) in `localStorage['kfb.sky3.ui']`.

## 7 · Messwerte (Vorschau, nicht Georgs Gerät)

Feld, gleiche Kamera, `gl.finish()`, Mittel aus 40 Bildern:

| Fall | v1 Hüllen | v3 Knetstück |
|---|---|---|
| 4 Wolken | 2,6 ms · 3,3 k △ | 2,4 ms · 4,9 k △ |
| 12 Wolken | 4,3 ms · 6,5 k △ | 3,2 ms · 9,4 k △ |
| 24 Wolken | 6,3 ms · 14 k △ | 7,2 ms · 23 k △ |
| 24 alle near | 15,0 ms · 118 k △ | 19,0 ms · 282 k △ |

v3 near je Variante 3,6–21,5 k △, mid 0,6–3,9 k, far 0,13–0,98 k. Bake der Familie 1,6 s.
Spindel 0.3: 15 936 △ sichtbar, Deckung 360 / 0 / 0, max 99,7 u.
