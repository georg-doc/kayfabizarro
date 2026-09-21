# Abhängigkeiten · KFB Card Zone Lab v2

## Lokal (in diesem Export enthalten)

```
KFB Card Zone Lab v2.dc.html
├── ./support.js                              <script src>, DC-Laufzeit
├── ./kfb-box-material.js                     import()  Z. 327
│   └── ./asset-index.js                      import
├── ./terrain-v10/voxel-terrain.js            import()  Z. 328
├── ./terrain-v10/world-context.js            import()  Z. 328
├── ./asset-repo.json                         fetch()   Z. 1924, 1958
└── ./cardbuilder/kfb-card-builder.js         import()  Z. 2272
    ├── ./cardbuilder/kfb-ink-canon.js
    └── ./cardbuilder/kfb-card-format.js
```

`terrain-v10/edge3.jpg` liegt lokal, wird zur Laufzeit aber über die Repo-URL geladen.

## Extern (Netz nötig, absichtlich nicht kopiert)

| Quelle | Was |
|---|---|
| `unpkg.com/three@0.160.0` | three.module.js, OrbitControls, GLTFLoader, RoundedBoxGeometry |
| `fonts.googleapis.com` | Barlow Condensed, IBM Plex Mono |
| `raw.../media/3D_Assets/KFB/edge3.jpg` | Kantentextur |
| `raw.../media/3D_Assets/KFB/noise.png` | Korn |
| `raw.../media/3D_Assets/KFB/waterdudv.jpg` | **`uDudv`** — fehlt sie, wird `duv` konstant und die Verzerrung verschwindet |
| `raw.../media/3D_Assets/KFB/water.jpg` | **`uMap`, `uHasMap=1`** — fehlt sie, fehlt die Struktur |
| `raw.../media/3D_Assets/Cardboard003/...` | Zonen-Photo-Textur |
| `raw.../media/kfb/kfb-index.json` | Karten-Registry mit gemessenen `cardGrid`-Zahlen |
| `raw.../media/kfb/index.json` | älterer Deploy-Stand, Fallback |
| `raw.../media/kfb/KayfaBizarro_Card_Backside_01_lowrez.png` | Kartenrückseite |
| `asset-repo.json` → `ghUrl` | GLBs für Projektor und Sockel |

Basis: `https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/`

**Ohne Netz startet die Anwendung nicht** (three fehlt). Mit Netz, aber ohne Repo-Zugriff
startet sie und sieht falsch aus — das ist der Fehlermodus aus dem Post Mortem vom 21.09.
Die beiden Wasser-Texturen sind keine Verschönerung, sie sind der Shader-Pfad.

## Nicht enthalten (Regel 1)

Modelle, Animationsbibliotheken, Fonts, Audio. Assets bleiben SourceRefs.
