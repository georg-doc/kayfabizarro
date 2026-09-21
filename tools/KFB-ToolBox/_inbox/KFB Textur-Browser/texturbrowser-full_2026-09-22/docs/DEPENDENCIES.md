# Abhängigkeiten · KFB Textur-Browser

## Lokal (in diesem Export)
```
KFB Textur-Browser.dc.html
├── ./support.js                       <script src>
├── ./kfb-box-material.js              import()  Z. 247
├── ./kfb-ink-outline.js               import()  Z. 247
└── ./kfb-texture-catalog.json         fetch()   Z. 223
```

## Extern (nicht kopiert)
| Quelle | Was |
|---|---|
| `unpkg.com/three@0.160.0` | three.module.js, OrbitControls, RoomEnvironment |
| `fonts.googleapis.com` | Projekt-Schriften |
| `raw.../media/3D_Assets/...` | 86 Diffuse-Texturen, URLs stehen im Katalog-JSON, geladen als `<img src>` (Z. 63) |

Basis: `https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/`
`localStorage`-Schlüssel für Bewertungen ist projektlokal — im Export ohne Vorbelegung.

## Nicht enthalten
Modelle, Animationsbibliotheken, Fonts, Audio, die 86 Texturbilder selbst (Regel 1).
