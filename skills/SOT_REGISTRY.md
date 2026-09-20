# SoT-Registry — KFB (Single Source of Truth · wo liegt der Kanon)

**Zweck:** EIN Nachschlag-Ort. Pro Ding: was ist die kanonische Datei, welche Version, wo liegt sie. Kein
Datei-Verschieben (das macht nur Georg), nur der eine Lookup gegen das Zuwuchern.

**Stand: 24.07.2026.** Datum bei jeder Änderung mitziehen.
**GitHub-Ziel dieser Datei:** Repo `georg-doc/kayfabizarro` (Vorschlag: Repo-Root oder `skills/`).

## Harte Regel
**Kein neues `SSOT_`/Kanon-Doc ohne Zeile hier.** Wer eine „Wahrheit" schreibt, ohne sie hier zu
registrieren, erzeugt eine zweite Wahrheit (siehe Graveyard `konkurrenz-ssot-statt-kanon`).
Und: **erst hier nachsehen, ob der Kanon schon existiert, bevor man etwas neu definiert.**

## Renderer-Regel (gilt für ALLES)
**WebGL, three 0.160, ein Build.** Kein WebGPU/TSL. (Der Pet ist dagegen vermessen; zwei Motoren =
unsichtbarer Mund/Textur.)

## Register

| Ding | Kanonische Quelle | Version | Wo |
|---|---|---|---|
| **Ink-Outline (Master)** | `KFB_INK_OUTLINE_STYLE_v1.md` + Modul `kfb-ink.js` | v1 (2026-07-15) | `ROLLERCOASTER/…Ride v6-full/docs/` bzw. Repo-Root `kfb-ink.js`; aktuelle Nutzung: Ride v11 `rc-ink` |
| **Ink-Outline (Karten-Sicht)** | `SSOT_Card_Ink_Outline.md` | — | `CARD_VIEWER_POC/`; verweist auf Master, divergiert nicht |
| **Ink-Styles** | `inked` (=Ink, Default) · `torn` | — | im Master. **`bend` = offener Backlog** (bogig/Fahne, unbestätigt) |
| **Pet-Stack** | `kfb-pets.js` + `kfb-pets.json` + `build/`-Module | Contract 1.2.x | GitHub `media/3D_Assets/` (WebGL 0.160) |
| **Pet-Bauanleitung** | `EMBED_CUBE_PET_FULL_v2.md` | v2 | `media/3D_Assets/GLB_cube-pets/` |
| **Story-Modi (6 D6-Farben)** | `09_MODE_COLORS_canonical.md` / `kfb-table.v6.js` MODES | — | SSOT-Web: kayfabizarro.pages.dev/#kfb |
| **Kartenformat** | PDF 745×416 · Rückseite 800×447 → **1.79** | — | in `rollercoaster-ride.v11.js` kanonisch |
| **Terrain + Skydome** | `KFB Terrain + Skydome + 3D Glyphs v2` | **v2 (WebGPU) → v3 (WebGL) im Umbau** | `KFB VoxelWorld/…v2/session-v2/`; Briefs im `docs/` |
| **Skydome-Rezept** | `fractal-skydome.js` | v11 | animierter Shader A/S behalten, Raymarch B/L streichen (Brief: `BRIEF_Skydome_chirurgisch…`) |
| **Rollercoaster-Ride** | `rollercoaster-ride.v11.js` | **v11** | `KFB VoxelWorld/KFB RollerCoaster v11/` |
| **PetFlight** | `petflight.v2.js` | **v2** | `KFB VoxelWorld/KFB PetFlight v2/` |
| **Travel-Modi (Flug+Boden)** | `BRIEF_v4_TravelModes_auf_WebGL-Terrain.md` | v4-Plan | `…Terrain…v2/session-v2/docs/`; Module: flight/ground/card-carrier |
| **Asset-Katalog + Browser** | `asset-browser.html` + `github_status.json` | — | `…/3D ASSETS/CATALOG/`; **Wahrheit = Live-GitHub-Tree** |
| **Postmortems (Graveyard)** | `Graveyard_Slice1/postmortems.json` | kanonisch | andere zwei `postmortems.json` = Kopien, konsolidieren |
| **Diary / Session-Cuts** | `KFB-MED Project Diary (Camp-Hub)/` | — | Cuts als `SESSION_CUT_YYYY-MM-DD_*.md` |
| **Landkarte (Master)** | `LIVING_KFB_MED_UNIVERSE.md` | living | dieser Ordner (Hub) |
| **Landkarte (VoxelWorld)** | `00_START_HERE_voxelworld.md` | living | `KFB VoxelWorld/` |
| **PolyGarden** | `PolyGarden_v2.html` | v2 | `KFB VoxelWorld/PolyGarden_Session_Export WS1 #1/deliverables/` (lose Kopien im Root = alt) |

## Offene Backlog-Punkte (Kanon-relevant)
- **Ink-Style `bend`** rekonstruieren (Quelle: Table-v6-/Diorama-Projekt suchen).
- Die **drei `postmortems.json`** auf den einen kanonischen Stand (`Graveyard_Slice1`) zusammenführen.
- `pattern`-Feld in allen Graves nachtragen (Muster sichtbar machen).
