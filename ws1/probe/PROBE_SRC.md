# Gelände-Probe · Quellen (WS1, Spiegel)

Die Probe ist eine einzelne HTML-Seite (three r147 global). Dieser Ordner ist der Quell-Spiegel aus `~/kfb-ws1/probe` auf Georgs Mac.
**Nicht enthalten:** Sicherungen (`backups/`, `*.bak`), Testbilder (`tests/out/`), gebaute Dateien (`gelaende-probe.public.html`, `pubsrv/`, `artifact-assets/`), Modellkopien (`racers/`, `assets/`, `tests/rig-extra/glb/`).

## Bauen und Veröffentlichen
- `python3 mkpublic.py` → `gelaende-probe.public.html` (Spielcode eingebettet über `mkdrive.py`); lokal: Kopie nach `pubsrv/index.html`, Server :8751.
- Vorschau: `gelaende-probe.public.html` → Branch `ws1/preview` als `gelaende-probe.html` (Pages: ws1-preview.kayfabizarro.pages.dev/gelaende-probe).
- Artefakt (claude.ai): `python3 mkartifact.py` bündelt die Assets (der Viewer blockt GitHub-Abrufe).

## Spiel-Port (aus der Probe erzeugt, nicht abgeschrieben)
- `port/gen_height.py` → `src/world/probeHeight.js` (Parität bitgenau) · `port/gen_hydro.py` → `src/world/kfb-hydro.v1.js` (Parität `port/kfb-hydro.parity.mjs`)
- `port/gen_water_game.py` + `port/kfbWater.tpl.js` → `src/look/kfbWater.js` · `port/gen_terrain3.py`, `gen_sky.py`, `gen_fluid.py`, `gen_claytex.py`

## Tests (Playwright mit Metal-GPU, Server :8751)
`tests/*.mjs`, u. a. rivers, falls, underwater, river-hitch, shore-ab, car-look, car-far, all-cars, dio-painpoint, perf-ab.
