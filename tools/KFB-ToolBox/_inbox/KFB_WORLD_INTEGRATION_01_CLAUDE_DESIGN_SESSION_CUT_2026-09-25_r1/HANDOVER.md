# HANDOVER · WORLD-INTEGRATION-01 → Web (Rehome + Human Gate)

## Was gebaut ist
Der echte WorldBuilder (`wb2-design-01/wb2d-app.js`, WB2-Engine aus PR #190 @ec52eb74 über WB2-DESIGN-01) bekommt ein Welt-Profil. Mit `world=huerth` öffnet er die Hürth-Zone (WB-D2-Seam `wd1-seam.js`, eingefrorene OSM-Fixture). Dieselbe Engine, dasselbe Szenendokument (`kfb-worldbuilder-scene` v1), dieselben Sculpt-Strokes, derselbe `edit-layer.js`, dasselbe Save/Reload. Play liest genau diesen Zustand. Ohne `world` läuft der WB2-Sandbox-Pfad unverändert.

## Rehome (Web)
1. Dateien 1:1 an die Repo-Pfade legen und Blobs gegen EXPORT_MANIFEST.json prüfen.
2. `ROOT` in `wi1-world.js` zeigt auf die Projektwurzel (dort liegen `wd1-*.js`, `w0-ink.js`, `wd-sky.js`, `wd-donors.js`, `wd-registry.js`, `fixtures/`). Beim Rehome auf den echten Ablageort der WB-D2/WorldDesign-Dateien umstellen (eine Konstante).
3. `?selftest=wi1` → 26/26. WB2-Sandbox `WB2_DESIGN_01_SOURCE.html?selftest=1` → 34/34 **ausführen** (in dieser Session NOT_RUN, er löscht den Nutzer-Speicherschlüssel).
4. Zero-install Review-Seite für Georg bereitstellen (Portable Preview Pack).

## Owner-Grenzen (eingehalten)
Terrain/Sculpt/Objekte/Persistenz = WorldBuilder (WB2) · Geografie = OSM City Lab / World Zone (Fixture, nichts erfunden) · Präsentation = WB-D2 (`wd1-city`, `wd1-names`, additiv erweitert) · Bewegung = Travel Combat v25 `walk-controller.js` UNVERÄNDERT (nur Parameter in Metern) · Figur = `frizzlegraft-v1/graft-mount.v1.js` (animation:'host') · Clips = KayKit Character Animations 1.1 Rig_Medium (Vorgabe), KFB Motion Library wählbar · Bindung und Sprungkette = KFB Animation Lab v1/v4 (gelesen, nicht neu erfunden) · Himmel = `wd-sky.js` → Travel v25 `skydome-shader.js` · Tusche = `w0-ink.js`.

## Next Gate
**GEORG HUMAN GATE WORLD-INTEGRATION-01** — die 11 Schritte aus dem Brief direkt in der Seite: laden · bewegen · Walk/Run plausibel · Edit · Raise/Lower · Radius per Rad · Objekt verschieben · Save · Reload · Welt bleibt · in Play durch die geänderte Stelle laufen.
