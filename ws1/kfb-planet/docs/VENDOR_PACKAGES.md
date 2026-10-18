# WS1-Pakete zum Einbinden (V-409)

Zwei Module, die andere Werkzeuge unverändert übernehmen: Dramatis Personae, ToolBox-Studio, WSB-Bühnen und die Claude-Design-Bühne.
Beide brauchen nur den three-Namensraum des Wirts. Sie haben kein React, keinen Store und keine Fenster-Listener.

Feste Fundstelle: Branch `ws1/vendor` im Repo `georg-doc/kayfabizarro`, Ordner `ws1/vendor/`.
Jede Lieferung ist ein eigener Commit. **Pin = Commit-Hash**, nie den beweglichen Branch laden.

| Paket | Datei | Schema | Abhängigkeiten |
|---|---|---|---|
| Bühnenlicht | `kfb-stage-light.v1.js` | `kfb.stage-light/1` | `three` (Import) |
| Figuren-Loader | `kfb-figure-loader.v1.js` | `kfb.figure-loader/1` | keine; `THREE`, `GLTFLoader`, `EyeRig`, `attachClaySkin` übergibt der Wirt |
| E2-Lider (WS0, byte-gleich) | `e2/clay-skin-attach.v1.js` + `e2/clay-eyelid.v1/v2/v3.js` | `kfb.clay-skin-attach/1` | keine |
| Fahrzeug-Antrieb (R1a) | `kfb-vehicle-rig.v1.js` (= `src/modules/vehicleRig.js`) | `kfb.vehicle-rig/1` | `three` (Import) |

## Bühnenlicht · `kfb-stage-light.v1.js`

```js
import { createStageLight, applyTone, MOOD_SETS, TOD, createContactAO, selfTest } from './kfb-stage-light.v1.js'
const undo = applyTone(renderer, 'aces')            // ein Tonemapping für alles, Belichtung 1
const rig = createStageLight({
  tod: () => TOD.gold,                              // 0 Nacht · 0,5 Gold · 1 Tag (stufenlos)
  moods: MOOD_SETS.mesa,                            // Standard Mesa (V-402); J17 = MOOD_SETS.r2 (null → MOODS)
  groundColor: () => '#8a6f5a',                     // Hemi-Boden = edgePalette der Bühne
  fit: () => ({ center: { x: 0, y: 1, z: 0 }, radius: 8 }),   // Schattenbereich (Kugel), Bias wird daraus abgeleitet
  figures: () => [figA, figB],                      // Module mit object3d: das warme Figurenlicht zielt auf sie
})
scene.add(rig.object3d)
// je Bild: rig.update(dt, { camera })   · Abbau: rig.dispose(); undo()
```

Regeln, die das Modul durchsetzt:
- Die Sonne ist der einzige Schattenwerfer.
- Es gibt kein Rand- und kein Gegenlicht.
- Das Figurenlicht wirft keinen Schatten.
- `selfTest(renderer)` muss den Spalt 0 melden.
- **Ein Rig (V-429):** Alle Objekte werfen und empfangen Schatten vom selben Key. Am Wirt heißt das: Figuren, Tafeln und Props setzen `castShadow` und `receiveShadow`, ausgenommen nur Augen und Overlays.

## Figuren-Loader · `kfb-figure-loader.v1.js`

Eine Figur kommt nur über ihre Karte (`kfb.figure/1`, WS0 `replies/FIGURES_R1/figures/<id>.figure.json`).

```js
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EyeRig } from './pet-eye-rig.v6.js'                       // ToolBox studio-v12, blob 853bcf5f
import { attachClaySkin } from './e2/clay-skin-attach.v1.js'
import { checkCard, applyVariant, loadFigureBody, buildHeadpartEyes, setLidState } from './kfb-figure-loader.v1.js'

const v = applyVariant(card, variantOrNull)          // z. B. Sockelrand 80° (kfb.figure-variant/1), hängt an Karten-id + Karten-sha256
if (!v.ok) showRefusal(card.id, v.reason)
const body = await loadFigureBody({ card: v.card, GLTFLoader, where: 'stage' })   // lädt Bytes von fester Adresse, prüft sha256 im Browser
if (!body.ok) showRefusal(card.id, body.reason)       // sichtbar ablehnen (rotes Schild), nie still eine Ersatzfigur zeigen
const fig = body.gltf.scene
// Kopfteil-Figuren (eyeRig.seat 'headpart-socket', Aliens): Kopf, EyeRig v6 und E2-Lidhaut wie im WS0-Beweis proof_r1e.html
const eyes = buildHeadpartEyes({ THREE, EyeRig, attachClaySkin, fig, recipe /* kfb.pets/1 der Karte */, makeMat: (hex) => myClayMat(hex) })
setLidState(eyes.rig, 'half')                         // open | rest | half | closed
// je Bild: eyes.rig.update(dt)
```

- `checkCard(card, { sha256, where })` ist rein, ohne three und ohne DOM.
- Ablehnungsgründe:
  - falsches Schema;
  - `eyeRig` fehlt;
  - sha256 weicht ab;
  - Samt > 0,05;
  - `open-design` außerhalb der Werkstatt.
- `where`: `stage` | `proof` | `workshop`.
- Status-Tor: `approved` gilt überall, `candidate` nur mit Vermerk außerhalb des Bildes.

## Fahrzeug-Antrieb · `kfb-vehicle-rig.v1.js` (R1a, V-481)

```js
import { createVehicleRig, createEngine } from './kfb-vehicle-rig.v1.js'
const rig = createVehicleRig({ anchors: data.anchors, hover: data.hover, glow: data.glow, unit: 0.58 }) // Daten: kfb-vehicle-rig.json je Fahrzeug
rig.stretch.add(model)          // Modell + Anker verformen gemeinsam (surge/ascent)
carVisual.add(rig.object3d); scene.add(rig.world)   // world = Bodennähe-Staub im Weltraum
// je Bild: rig.update(dt, { throttle, speed01, boost, brake, groundAt: (x, z) => y }) → Ereignisse [{ type: 'shift'|'backfire' }] für Klang/Deformer
rig.surge(1); rig.ascent(0.9)   // Stauchen → Strecken
```

- Anker-Typen heute: `thrust` (Glow-Kern + Fahne mit Schockdiamanten) und `fan` (drehende Lüfterscheibe). Geplant: `antigrav`, `exhaust`, `weapon`, `light`.
- Keine Lichter und kein Bloom-Pass; je Düse 1–2 Draw Calls, Funken und Staub je 1.

## Herkunft
- Gebaut und getestet in `kfb-planet`. Tests: `test/unit/figures.mjs` und `test/light.mjs`, dazu die Bühnenprobe `#stage,actors=aliens,light=l1`.
- Die E2-Dateien sind byte-gleich mit WS0 `E2_ATTACH_R1`: clay-skin-attach.v1 blob `80b3ddce`, clay-eyelid.v3 `3c2bd9ae`, v2 `8f1ab9e0`, v1 `5f39e135`.
