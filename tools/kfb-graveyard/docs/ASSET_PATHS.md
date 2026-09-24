# ASSET_PATHS — was im Repo liegt, und wie das Modul es zieht

Stand: **2026-08-04**, gemessen am Live-Tree von `georg-doc/kayfabizarro@main`
(plus `media/3D_Assets/CATALOG/github_status.json`, verifiziert 2026-07-23).

## 1 Die Regel

> **Kein Asset im Projekt. Jede Asset-Adresse entsteht in `kfb-assets.js`.**

Ein relativer Pfad (`./assets/…`) funktioniert in der Chat-Vorschau und stirbt im Export:
neben der exportierten Datei liegt kein `assets/`. Deshalb gibt es im Modul **keinen einzigen**
relativen Asset-Pfad — nur `raw()`, `glb()`, `TEX`, `SKY`, `DATA`, `CODE`.

```js
import { raw, glb, TEX, DATA, setRef, setCacheBust } from './kfb-assets.js';

glb('graveyard', 'gravestone-round')   // → …/media/3D_Assets/GLB_graveyard/gravestone-round.glb
glb('nature', 'tree_default')          // → …/kenney_nature-kit/Models/GLTF format/tree_default.glb
TEX.edge3                              // → …/media/3D_Assets/KFB/edge3.jpg
DATA.petContract                       // → …/media/3D_Assets/pet-LIBRARY.json

setRef('65083e977b3e…');               // auf einen Commit pinnen (reproduzierbarer Build)
setCacheBust('2');                     // frisch gepusht? ?v=2 gegen den 5-Minuten-CDN-Cache
```

Basis: `https://raw.githubusercontent.com/georg-doc/kayfabizarro/<ref>/media/3D_Assets/`.
RAW liefert `Access-Control-Allow-Origin: *` — deshalb lädt `GLTFLoader` direkt, ohne Proxy.

## 2 Packs, die per RAW ziehbar sind

Flache `GLB_*`-Packs liegen 1:1 im Repo-Root von `media/3D_Assets/`:

`GLB_graveyard` (die Zone) · `GLB_cube-pets` (FrizzleBob) · `GLB_pirate` · `GLB_hexagon_kit` ·
`GLB_mini_chars` · `GLB_blocky_chars` · `GLB_block_chars` · `GLB_mini_arcade` ·
`GLB_mini_arena` · `GLB_mini_dungeon` · `GLB_mini_market` · `GLB_platformer` ·
`Ultimate Monsters Bundle-glb` · lose GLBs im Wurzelverzeichnis.

Kenney-Kits mit Unterstruktur brauchen einen Präfix — der steht in `PACKS`, damit ihn niemand
zweimal raten muss:

| Pack-Key | Repo-Präfix |
|---|---|
| `nature` | `kenney_nature-kit/Models/GLTF format/` |
| `graveyardKit` | `kenney_graveyard-kit_5.0/Models/GLB format/` |
| `survival` | `kenney_survival-kit/Models/GLB format/` |
| `fantasyTown` | `kenney_fantasy-town-kit_2.0/Models/GLB format/` |

Weiter im Repo, außerhalb der Packs: `Textures/` (86 Diffuse-Sets + Decals + FrizzleBob-Mund-
Sprites), `KFB/` (12 Material-Maps), `Sounds/jukebox.json`, `skydome_a.webp` / `skydome_b.webp`,
`build/` (Pet-Module), `pet-LIBRARY.json`, `motion-LIBRARY.json`.

## 3 Was NICHT ziehbar ist (Upload-Kandidaten)

- **Nur lokal, nicht im Repo:** `kenney_building-kit`, `castle-kit`, `factory-kit`,
  `furniture-kit`, `modular-buildings`, `modular-cave-kit`, `modular-dungeon-kit`,
  `prototype-kit`, `tower-defense-kit`, `coaster-kit`, `Dice`.
- **Früher als hochgeladen genannt, am 23.07. nicht da:** `city-kit-commercial`,
  `city-kit-industrial`, `city-kit-suburban`, `holiday-kit`.
- **Nur Teilmenge auf GitHub** (volles Kit lokal): mini-arcade 2/20, mini-arena 1/22,
  mini-dungeon 2/25, mini-market 1/20, platformer 5/153 — `PACKS_PARTIAL` in `kfb-assets.js`.
- **`postmortems.json`** — Kanon liegt im Diary-Ordner, nicht im Repo. `DATA.postmortems`
  ist die erwartete URL; bis zum Push liefert sie 404 und das Modul nimmt die Host-Daten.
  **Push-Kandidat Nr. 1**, dann ist die Zone ohne mitgelieferte Daten lauffähig.

## 4 Zwei Messfallen (teuer bezahlt)

1. **Ein leeres Werkzeug-Ergebnis ist keine Aussage.** Der Repo-Tree über die API filtert auf
   text-/bildartige Dateien — **`.glb` erscheint dort gar nicht**. `GLB_graveyard/` sieht im
   Baum aus wie „eine Datei (colormap.png)", enthält aber die 91 Modelle. Beweis ist der
   Direktabruf der URL, nicht die Abwesenheit im Listing.
2. **CDN-Cache.** Frisch gepushte Datei liefert bis zu fünf Minuten 404. Mit `?v=x` prüfen
   (`setCacheBust`), bevor jemand „liegt nicht im Repo" in ein Doc schreibt.

## 5 Ordnerstruktur nicht anfassen

Die Kenney-GLBs lösen ihre Textur **relativ** auf (`../Textures/colormap.png`). Wer ein GLB
umlegt oder einzeln kopiert, bekommt weiße Modelle. Also: Modelle immer aus ihrem Pack-Ordner
per RAW laden, nie umsortieren, nie einbetten.
