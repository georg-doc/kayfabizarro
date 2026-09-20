# ToolBox · Modulkarte

Was aus welcher Stelle des Labs kommt — damit ein späterer Sync weiß, wo er nachsehen muss.

## Herkunft

Quelle für alles: `KFB Card Zone Lab v2.dc.html`, Projektwurzel, Stand 2026-09-21.

| Modul · Datei | Lab-Herkunft (Methoden der Component-Klasse) |
|---|---|
| `kfb-fluid-v1/kfb-fluid-field.js` | `h2`, `vnoise`, `fbm`, `reach`, `moatRing`, `perimS`, `riverPath`, `riverField`, `riverHalf`, `riverCells`, `waterY`, `bankTopAt`, `riverTopAt`, `flowAt` |
| `kfb-fluid-v1/kfb-fluid-shader.js` | `FLUIDS`, `buildFluidSurface` (Shader-Teil), Quad-Erzeugung aus `layoutFluid` |
| `kfb-fluid-v1/kfb-gutter.js` | `buildMoat`, `layoutMoat`, `layoutFluid`, `bankCalib`, `applyCarve` |
| `kfb-fluid-v1/kfb-bubbles.js` | `buildBubbles`, `tickBubbles` |
| `kfb-beam-v1/kfb-beam.js` | `buildProjection`, `updateProjection` |
| `kfb-cardstack-v1/kfb-card-stack.js` | `buildStack`, `prepReveal`, `poseCard`, `tickReveal`, `tickCard`, `setCardSide` |
| `kfb-seeds-v1/kfb-card-seed.js` | `buildBaseline`, `dev`, `seedCard`, `triplet`, `seedMode`, `seedSignature`, `applySeed` |
| `kfb-voxel-world-v1/*` | `terrain-v10/`, unverändert |

## Nicht herausgelöst (bleibt im Lab)

| Was | Warum |
|---|---|
| Card Cube (sechs Flächen als Interface) | gehört zur Cube Academy, nicht zum Wasser |
| `faceTexture()` (Canvas-Texturen) | Lab-spezifische Inhalte |
| Face-Focus, HTML-Panel, Chat | UI des Labs |
| Drone-Audio | drei Zeilen, kein Modul wert; Rezept steht in CONTRACTS.md |
| Zonenboden (`buildZone`, `zoneTopAt`, `layoutZone`) | jede Anwendung hat ihren eigenen; das Fluid-Modul nimmt ihn als Callback |
| Projektor-Laden, Sockel, Lochboden | Asset-Logik, gehört zur Registry |

## Abhängigkeiten

```
kfb-fluid-v1/index.js
  ├── kfb-fluid-field.js      (keine)
  ├── kfb-fluid-shader.js     (THREE)
  ├── kfb-gutter.js           (THREE, ↑ shader, ↑ field)
  └── kfb-bubbles.js          (THREE, ↑ shader)

kfb-beam-v1/kfb-beam.js       (THREE)
kfb-cardstack-v1/…            (THREE)
kfb-seeds-v1/…                (world-context aus kfb-voxel-world-v1)
kfb-voxel-world-v1/…          (THREE)
```

Keine Zyklen, kein npm, keine Bundler-Annahme. Alles ist ES-Modul, direkt per
`<script type="module">` oder dynamischem `import()` ladbar.

## Wenn das Lab sich ändert

Diese Karte ist die Liste der Stellen, die dann nachgezogen werden müssen. Änderungen an
`layoutFluid`, `bankTopAt` oder `waterY` im Lab **ohne** Nachzug hier erzeugen zwei
Wahrheiten. Besser: das Lab auf die Module umstellen und diese Spalte leeren.
