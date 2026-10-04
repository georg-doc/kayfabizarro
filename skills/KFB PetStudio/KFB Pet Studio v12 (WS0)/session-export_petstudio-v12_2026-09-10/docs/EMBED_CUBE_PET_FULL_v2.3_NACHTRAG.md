# EMBED_CUBE_PET_FULL — Nachtrag v2.3 (Pet Studio v12, 2026-09-09)

**Additiv zu** `skills/EMBED_CUBE_PET_FULL_v2.2.md` (Stand 04.08.2026). Nichts aus §0–§16 wird geändert;
Cube-Pets über `kfb-pets.js` laufen unverändert. Dieser Nachtrag gehört als **§17–§20** ans Ende der
v2.2 und macht daraus v2.3. Georg lädt hoch; Ziel-Ablage wie bisher `media/3D_Assets/GLB_cube-pets/`
(und die Spiegel in `skills/` — **drei byteidentische Kopien im Repo**, alle drei nachziehen oder zwei löschen).

> **Neu in v2.3:** §17 der Zweibeiner (FrizzleBob als Bewohner neben den Cube-Pets), §18 der öffentliche
> Augen-Anker `eyeFrame()`, §19 die Braue (eine Kurve, eine Maske), §20 die Nase. Dazu §21 Berichtigungen
> an v2.2, die nach v12 nicht mehr stimmen.

---

## 17. Zweibeiner: FrizzleBob (KayKit-Platformer) als Bewohner

Das Studio kennt seit v12 einen zweiten Körpertyp: `kind: 'biped'`. Das Modul `frizzlebob.v4a.js`
(Astra/WS-A, 06.09.) bringt Körper, Kopf-Host und 18 Clips; **Gesicht baut der Wirt** mit denselben
Bauteilen wie beim Cube-Pet. Kontrakt des Moduls (`SPEC`):

| Feld | Wert | Anmerkung |
|---|---|---|
| `yellowFiles` | `../assets/models/FrizzleBob_Yellow.gltf` / `_Gun.gltf` | gepatchte Modelle, Puffer eingebettet; Rückweg RAW+Tint bei 404 |
| `eyes` | `anchor {dx .375, dy −.175, ring .285, track .095} · inset .39 · pupilSize .27 · lidFit .9 · gloss .85` | Georgs Abnahme 05.09. |
| `mouth` | `size .59 · dy −.60 · sx 1.34 · set male · lift .12 · wrap 1` | |
| `hostShape` | `ellipsoid` | Kopf-Host aus der Knochen-Box ohne Ohren (1,851×2,058×1,562) |
| `faceCtx()` | `{ THREE, inner, o:{}, _squash:null, getFaceShells:()=>[] }` | genau das, was `EyeRig`/`PetMouth` erwarten |

Regeln: **Waffe = Knoten `Gun` (4 Netze), nicht Materialname** — aus jeder Messung ausschließen ·
Größe = 1,35 × Cube-Pet-Höhe über die Körperhöhe ohne Waffe · Kenneys aufgemalte Augen sind drei
eigene Netze am `Head` (`EyeColor · White · Black`) → ausblenden + `noMeasure` · Waffenpalette über
`gun-look.v4a.js` (`applyGunPalette(figure, 'dice')`, nur `dice` implementiert), Hülse frei einfärbbar.

## 18. `rig.eyeFrame()` — der öffentliche Augen-Anker (pet-eye-rig **v6**)

```js
const f = rig.eyeFrame();   // null, solange kein Rig steht
// { left: Vector3, right: Vector3, radius, parent: Object3D, rig: Group, gen: int, unit }
```

Koordinaten im System von `parent` (Körpernetz beim Cube-Pet, Kopf-Host beim Zweibeiner) — dort hängen
Braue und Nase als Geschwister der Augen. `gen` zählt bei jedem `build()`; ein Bauteil vergleicht `gen`
und `parent` je Bild und baut nur bei Wechsel neu. **Nie `rig.eyes` / `rig._R` privat lesen.**

v6 bringt außerdem `splay` (0…1): beide Augen drehen spiegelgleich um die Hochachse nach außen (×45°),
Lage per Strahl entlang der gedrehten Blickachse abgetastet (v6a) — für runde Köpfe. Standard 0 = v5-Bild.
`build/pet-eye-rig.v5.js` bleibt der Ladeweg von `kfb-pets.js`; v6 liegt in `studio-v12/`.

## 19. Braue — eine Kurve, eine Maske (`brow-rig.v1.js`)

Georgs Zeichenpraxis: **eine** Wellenlinie über beiden Augen, in der Mitte maskiert. Zwei Enden aus einer
Kurve können nicht auseinanderfallen; Maske 0 = Monobraue, kein Sonderfall.

```js
import { BrowRig, PRESETS, pointsFor, validate } from './brow-rig.v1.js';
const brow = new BrowRig({ THREE, getEyeFrame: () => rig.eyeFrame(), baseColor: 0xf2c93c, seed: 1001,
  params: { mask: .35, thickness: 1, length: .6, taper: .85, height: .3, color: '#17130f', points: pointsFor('neutral') } });
brow.set({ mask: 0 });            // validate() zuerst; UNSUPPORTED als Struktur, kein Wurf
brow.expression('skeptical');     // neutral · skeptical · angry · worried · surprised · tired · critical-angry
brow.sync();                      // je Bild; bindet nach Rig-Neubau neu
brow.export();                    // { schema:'kfb.brow-experiment/0.1', seed, ...params }
```

Feder = `inkHalfWidth` aus `kfb-ink-canon.js` (Preset `figure`, offene Bandtopologie). Farbe D04 fast
schwarz `#17130f` (ersetzt »aus der Figur, 0,5«). **Gespeichert wird `pet.brow = { points, mask, … }`** —
nie `leftBrow`/`rightBrow`. Bekannte Grenze: Anker am Auge, nicht an der Fläche (bei ~35° Gier schweben
die Spitzen) — Tiefenpolitik offen.

## 20. Nase — Cartoon-Knubbel (`pet-nose.v1.js`)

Quergestelltes abgerundetes Rechteck (die Kopfform zitiert, kein Oval), KFB-Rot `#e96049`, Glanzregler.

```js
import { NoseRig } from './pet-nose.v1.js';
const nose = new NoseRig({ THREE, getEyeFrame: () => rig.eyeFrame(),
  params: { enabled: true, size: .9, radius: .42, height: .55, depth: .10, x: 0, gloss: .55, color: '#e96049' } });
nose.sync();   // je Bild
```

Größe in Einheiten des Augenradius R (Breite 1,6·size·R, Höhe 1,0, Tiefe 0,9); Tiefe per Strahl auf die
Kopffläche abgetastet. `gloss` fährt Rauheit 0,75→0,15 und Clearcoat 0,15→1,0. Vorgabe AN beim
Zweibeiner, AUS beim Cube-Pet (Schnauze im Netz). Werte in `pet.nose`.

## 21. Berichtigungen an v2.2 (was nach v12 nicht mehr stimmt)

1. **§1 »8 Dateien, eine Quelle«** — für den Zweibeiner kommen fünf dazu (§17–§20 + `gun-look`), und sie
   liegen noch **nicht** im Repo, sondern in `petstudio-v9/studio-v12/`. Bis zum Upload laden die Modelle
   relativ (`../assets/models/`) — **bricht im Standalone-Export** (Pfad-Hygiene).
2. **§3 EyeRig-Methoden** — ergänzen: `eyeFrame()`, `setEye({splay})`, `gen`.
3. **§12 Fallstrick 6 »Ein Augenpaar«** — gilt jetzt auch für Braue und Nase: `dispose()` vor dem
   Neubau, sonst stapeln sich Geschwister am alten Elternknoten.
4. **§13 Backlog** — »Krone / Kopf-Zubehör (Accessory-Slot)« hat mit `eyeFrame()` seinen Anker; der
   Slot selbst ist nicht gebaut.
5. **Zwei `kfb-pets.js` im Repo** (`media/3D_Assets/kfb-pets.js` 17 kB, `media/3D_Assets/build/kfb-pets.js`
   12 kB). Der TL;DR importiert die obere. Eine ist ein Aufräum-Kandidat — erst messen, welche wer lädt.
6. **Vertragsfelder** — `pets[]` kennt jetzt `kind` (`cube` implizit · `hanging` · `biped`), `variant`,
   `module`, `brow`, `nose`, `gun`. Unbekannte Felder müssen Round-Trips überleben (§14 gilt).
7. **`Math.random` im Blinzeln** (EyeRig, unverändert seit v4) verletzt den Wirt-Vertrag des
   Gründungsdokuments (§4 `rng` geseedet). Benannt, nicht behoben.

*Quelle dieses Stands: Pet Studio v12 (S1–S6b, 09.09.2026), LIVING `docs/petstudio-v12/LIVING_petstudio_v12.md`.*
