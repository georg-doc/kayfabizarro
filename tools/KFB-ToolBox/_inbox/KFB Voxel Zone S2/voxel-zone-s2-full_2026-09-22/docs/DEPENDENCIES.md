# Abhängigkeiten · KFB Voxel Zone S2

## Lokal (in diesem Export)
```
KFB Voxel Zone S2.dc.html
├── ./support.js                    <script src>
├── ./kfb-box-material.js           import()  Z. 154
│   └── ./asset-index.js            import
├── ./terrain/world-context.js      import()  Z. 155
└── ./kfb-ink-outline.js            import()  Z. 156
```

## Extern (nicht kopiert)
| Quelle | Was |
|---|---|
| `unpkg.com/three@0.160.0` | three.module.js, OrbitControls, RoomEnvironment |
| `fonts.googleapis.com` | Projekt-Schriften |
| `raw.../media/3D_Assets/...` | Kacheltexturen (Bestandsrezept, prozedurale Referenz) |

Basis: `https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/`
Ohne Netz startet die Anwendung nicht (three fehlt).

## Nicht enthalten
Modelle, Animationsbibliotheken, Fonts, Audio (Regel 1).
