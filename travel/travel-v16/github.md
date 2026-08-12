# github

repo: georg-doc/kayfabizarro
branch: main
path: overworld

Der WS1-Stand (Lead) liegt unter `overworld/` im Repo: Runner und Module in
`overworld/overworld/`, die Dokumente in `overworld/docs/`, der Tusche-Kanon in
`overworld/cardbuilder/`. Dieser Workspace ist **WS0** — HUD, UI-Chrome, Rail, Map-Layer.
Wir lesen von dort und liefern Diffs zurück; der Runner wird hier nicht angefasst.

## Last sync

date: 2026-08-10T16:58:02Z
tree: c41e620d5a5b (Baum-Hash aus `github_get_tree`, kein Commit)

### Updated in this project

- Re-Home auf den S22-Stand: `overworld-v10/` (50 Module + `backs/`, `card-backs.js`,
  `rss-2d.js`, `zone-story.js`); `units-catalog.js` bleibt unsere zusammengeführte Fassung.
- `card-backs.js` gepatcht: Pfade lösen relativ zum Modul auf, und `kfb` ist wieder die
  **Wortmarke** — die vier BLÖDSINN!-Blätter heißen jetzt `anti_rules`. Geht als Diff zurück.
- `hud-v7.js`: S22-Fassung übernommen (die sechs `WS1-Eingriff`-Leser), unsere zwei Eingriffe
  neu aufgetragen (Zahnrad aus `OW_UIKIT`, `hud-slots.json`-Fehlschlag wird gemeldet).
- W6 gemessen: `KFB Ink-Normierung.dc.html` — `minHalf 1.2` ist eine absolute Zahl in einem
  relativen System, Umschlagpunkt `min(W,H)` 174 px. Ankermaße `bend` 446×69 und `tear` 87×50.
- Nach `docs/GLOSSAR_KFB.md` umgestellt: Statblatt zeigt die Kanon-Kürzel
  `Biz · Kay · Bin · Bon · Bog · Blö` statt unserer Zwei-Buchstaben-Fassung.
- Große Kartenvorlage in der Welt: `fit` statt `cover`, Breite gegen beide Achsen (320 → 1036 px).

## Gelesen für Travel v16 (kein Sync)

date: 2026-08-12T13:17:24Z

**L1/L2 (Recherche):** `media/3D_Assets/CATALOG/catalog.json` — 1,29 MB, **2538 Assets in 33 Packs**,
je Eintrag `pack` · `path` · `category`/`subcategory` · `animations` · `size` [x,y,z] ·
`footprint_xz` · `scores` (ease/kfb/med). **Nicht ins Projekt kopiert** — zu schwer.

**L3 (gebaut):** die Props laden zur Laufzeit über RAW, aufgelöst über **`asset-repo.json`**
(Projektwurzel, 328 kB, **986 Assets** mit fertiger `ghUrl`) — nicht über `catalog.json`, weil
dessen `path` der LOKALE Pfad ist und rund 1550 seiner Einträge nicht im Repo liegen.
Gelesen und im Browser verifiziert: `CATALOG/github_status.json`,
`CATALOG/PROTOKOLL_github-abgleich_2026-07-23.md`, `CATALOG/PACK_SUMMARY.md`,
`CATALOG/README_catalog.md`, `CATALOG/INDEX.md` (Teilsuchen).

⚠ **Verifizierte Pfad-Falle:** `kenney_nature-kit` liegt unter `Models/GLTF format/` — und dieser
Ordner enthält **`.glb`**-Dateien. Gemessen: `.../GLTF format/tree_default.glb` → **200**
(9 428 Bytes) · `.../GLB format/tree_default.glb` → 404 · `.../GLTF format/tree_default.gltf` → 404.
Wer die Endung aus dem Ordnernamen ableitet, baut 329 kaputte URLs.

**Kein Code und keine Datei aus dem Repo importiert.** Der Konsolidierungs-Auftrag für die zwei
Indizes steht als standalone Blatt in `docs/travel-v16/HANDOVER_assets_chatgpt.md` (sechs
verifizierte Fallen, Zielformat, Verifikationspflicht) — er gehört nicht in dieses Projekt.

## Screen map

| Was hier gebaut ist | Gebaut aus / gegen |
|---|---|
| `KFB Overworld v10 HUD.dc.html` | `overworld/overworld/*` (Runner S22) + `overworld/hud-slots.json` |
| `overworld/card-rail-v9b.js` (unser) | hängt an `hud-v7.js`, liest `OW_BACKS`, `OW_ART`, `popCost` |
| `overworld/ui-kit-ts.js` (unser) | Tiny-Swords-Blätter, unabhängig vom Repo-Runner |
| `KFB Ink-Normierung.dc.html` | `overworld/cardbuilder/kfb-ink-canon.js` (`INK_PRESETS`, `INK_CHECK`, `measureInk`) |
| `KFB Kartenschau.dc.html` | derselbe Ink-Kanon + `overworld/card-grids.json` (Zelle 1,81 vs. Sollformat 1,74) |
| Statblatt-Kürzel im Rail | `overworld/docs/GLOSSAR_KFB.md` §1 (`short`-Feld, WS0-Regel) |
| `overworld-v10/card-backs.js` | Fork von `overworld/overworld/card-backs.js`, zwei Korrekturen |

## Referenz-Repos (gelesen, nicht angebunden)

| Repo | Zweig | Gelesen am | Wofür |
|---|---|---|---|
| `dannylimanseta/tinyskies` | `cursor/globefly-multiplayer-globe-flight-game` (Baum `2659a5cc987d`) | 2026-08-12 | **Blueprint und Benchmark für Travel v15** (Flug-Sprint). Gelesen: `Carpet.ts`, `Plane.ts`, `FlightControls.ts`, `CameraRig.ts`, `ui/ControlHints.ts`. **Kein Code kopiert** — übernommen wurden Raten und Verhältnisse. Lesebericht: `docs/travel-v15/BENCHMARK_tinyskies.md` |

Ein Referenz-Repo ist **keine Anbindung**: es wird nicht synchronisiert, es steht in keiner
Screen-Map, und es hat keinen Anspruch auf einen Diff zurück. Der `repo:`-Eintrag oben bleibt die
eine Quelle dieses Projekts.

## Nicht von hier ändern

`overworld/overworld/overworld-game-v10.js` und alles darunter gehört WS1. Änderungen gehen als
Diff über `docs/overworld-v10/BEFUNDE_fuer_WS1_*.md`, nie als stiller Fork.
