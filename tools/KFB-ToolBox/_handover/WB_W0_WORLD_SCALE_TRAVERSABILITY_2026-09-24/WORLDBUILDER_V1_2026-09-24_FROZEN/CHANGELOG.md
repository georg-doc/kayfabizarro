# CHANGELOG · KFB WorldBuilder v1

## 2026-09-24 · Slice 1 · STATUS CHANGE → `HUMAN_REJECTED_FOUNDATION` · DO NOT PATCH

**Urteil Georg:** kein Tuning-Fall, sondern falsche Grundlage. Eingefroren, nur als Failure-Evidence exportiert. Das Claude-Coworker-Briefing (`START_CLAUDE_DESIGN_WORLDBUILDER_V1.md`) ist als FAIL eingestuft.

**Root Cause:** Planet-/Editor-Demo gebaut, bevor Massstab, Traversierbarkeit, Routennetz und lokale Weltregion verbindlich definiert waren → willkürliche Gebäudegrössen, blockierte Laufbereiche, zackige Landmassen, ungefilterte Objektverteilung, zu grobe schwarze Outline.

### New
- `POST_MORTEM.md` — ausführlich: Briefing-Ursachen B-1…B-6 (zu breit · Route/OSM verschoben · Terrain-First-Linie nicht übertragen · eingefrorene Hürth/Elastic-Grundlage PR #194 als Donor · Bildwort statt Messziel · keine Massquellen), Umsetzungsursachen 4.1…4.8 (Massstab dreimal umgebaut und nie abgeleitet: R 5 → 60 → 400 · Spawn im Meer · keine Begehbarkeitsprüfung · Gebäude im Hang vergraben · Objektstreuung ohne Belegungstest · Blindgriffe in der Registry · treppige Küste · pixelkonstante Outline · Pastell-Look · Screenshot statt Messung), fehlende Tore, Regeln, weiterverwendbares Wissen, Evidenzliste.
- `NEXT_GATE_WB-W0.md` — Scope Correction: WB-W0 · WORLD SCALE + TRAVERSABILITY PROOF (eine kleine spielbare Region, Route vor Gelände vor Inhalt vor Licht, PASS-Kriterien). Festgehalten, nicht begonnen.
- `evidence/` — 8 Screenshots aus diesem Slice (A1…C3), benannt nach dem Fehler, den sie zeigen.

### Changed
- `RETURN.md` — Statuskopf oben ergänzt (additiv, Rest unverändert).
- `SOURCE.json` — Feld `status` ergänzt.

### Unchanged
- `code/` — eingefroren, byte-gleich mit dem abgelehnten Stand. Nicht weiter patchen.

### Removed
- nothing.

---

## 2026-09-24 · Slice 1 · Planet foundation

### New
- `KFB WorldBuilder v1.dc.html` — host page (import map three@0.184.0, one Three.js instance), tweaks: start camera, ink, macro tile.
- `wb1-boot.js` — host: one-parameter camera flight, edit-layer wiring, sculpt input, objects, panel, save/load, donor log.
- `wb1-planet.js` — stylised-Earth planet: cube-sphere (ZyFou PlanetWorld approach), Natural Earth land mask, WB2 noise subset (MIT) verbatim, WB2 sculpt core on the sphere, near-field LOD patch, sea sphere, atmosphere halo, ground look.
- `wb1-sky.js` — wrapper for the 8 TinySkies globe-v13 modules, one length factor K = R/5.
- `wb1-buildings.js` — Hürth OSM buildings in 4 switchable views on the planet.
- `wb1-actor.js` — GothGirl (Rig_Medium) with KayKit idle/walk/run, EyeRig v6 via the Eye-Rig-Batch adapter, WASD walking on the sphere.

### Unchanged (reused as-is from this project)
- `wd-look.js`, `wd-macro.js`, `wd-ink.js`, `wd-registry.js`, `wd-donors.js`, `textures/derek-rgb-ref.png`, `support.js`.

### Removed
- nothing.

### Course corrections in this slice (Georg, chat)
- "die Skalierung ist schon völlig falsch" → one scale truth: metres. Assets native, OSM real metres, WB2 terrain numbers identical; only the TinySkies modules get one factor K.
- "nimm eine stilisierte Erde als Vorlage" → planet is a stylised Earth (R 400 m), Hürth at its real lat/lon.
