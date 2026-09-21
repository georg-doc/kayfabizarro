# Card Zone Lab v2 + Zonen-Registry — Export 2026-07-26 (Cut v3)

Zwei Artefakte, ein Modell. Beide im Browser direkt öffnen; Pfade sind relativ, Texturen und GLBs
kommen live aus `georg-doc/kayfabizarro` (`media/3D_Assets/`).

## Die zwei Einstiege

**`KFB Zonen-Registry.dc.html`** — die Weltkarte. 168 Card Zones auf dem Hex-Grid, nach Biome
geclustert, mit Lernstand und Verbindungen. Hier fängt man an.

**`KFB Card Zone Lab v2.dc.html`** — eine einzelne Zone in 3D. Aus der Registry heraus per
„Im Card Zone Lab öffnen", oder direkt für die erste Karte des Pools.

## Bedienung Lab

| | |
|---|---|
| Ziehen **auf dem Würfel** | Würfel drehen |
| Ziehen **daneben** | Kamera |
| Klick auf eine Fläche | Fläche nach vorn |
| **Zweiter** Klick | Face-Focus (HTML-Vollbild: PDF-Zoom, Chat) · Esc zurück |
| Annäherung < 62 | Karte deckt sich selbst auf |
| Dock rechts | Karte, Graben, Fluss, Collage, Terrain, FX |

## Bedienung Registry

Links filtern (Biome, Lernstand, Deck), Mitte klicken, rechts bewerten. Flows erscheinen, sobald ein
Deck gefiltert oder eine Zone gewählt ist — global wären es 165 Pfade über 168 Hexe.

## Dateien

| Datei | Rolle |
|---|---|
| `KFB Zonen-Registry.dc.html` · `zone-registry.json` | Registry + Vertrag |
| `zone-index.json` | Biome-Kanon (6 Biome × 3 Register, Connectors, Props) |
| `KFB Card Zone Lab v2.dc.html` | die 3D-Szene |
| `terrain-v10/voxel-terrain.js` | Terrain, **kanonisch** (heightStep, setCarve, setCarvePath) |
| `terrain-v10/world-context.js` | Karten-Seed → Vektor, Palette, Biome, Story-Modus |
| `cardbuilder/*.js` | echte Karten aus den PDFs |
| `kfb-box-material.js` · `kfb-ink-outline.js` | Voxel-Material, Tusche-Pass (im Lab aus) |
| `docs/` | Spec, Handover, Sessions |

## Zuerst lesen

`docs/HANDOVER_card-zone-lab_v2_2026-07-26.md` — die vier Regeln (Wasser, Anker, Radien, Ufer-Feld).
Wer am Wasser, am Ufer oder am Fluss arbeitet, spart sich damit mehrere Runden.
Danach `docs/SESSION_cut-v3_2026-07-26.md`, Abschnitt 6 — die drei Fehler, die ich in dieser Session
zweimal gemacht habe.
