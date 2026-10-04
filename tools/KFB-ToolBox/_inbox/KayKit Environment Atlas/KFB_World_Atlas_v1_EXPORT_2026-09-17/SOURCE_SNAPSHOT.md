# Source Snapshot

| Feld | Wert |
|---|---|
| Projektname (Claude Design) | `KayKit Atlas Preflight Access` |
| Projektname im Code | `KFB Kit Lab` |
| Exportrevision | 2026-09-17-r1 |
| Exportzeitpunkt | 2026-09-17T20:34Z |
| Interne Sprintmarke | S13.3 (Licht), S13.2 (Generator) |
| Git-SHA des Design-Projekts | **unbekannt** — Claude Design führt kein Git; Versionierung erfolgte über `CHANGELOG.md` und `github.md` |
| Letzte Repo-Synchronisation (aus `github.md`) | 2026-09-17T13:10:00Z, commit `10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0` (Asset-Übergabe `kfb.asset-handoff.v1`) |
| Build | keiner — 15 eigenständige HTML-Seiten + ES-Module |
| Laufzeitabhängigkeit | three.js 0.184.0 (unpkg), S10 abweichend 0.160.1 |
| Assetquelle | `raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/` — kanonisch, nicht im Paket eingebettet (Entscheidung, siehe `docs/DECISIONS.md`) |
| Browserzustand (localStorage / IndexedDB) | **keiner** — projektweit gegen `localStorage`, `sessionStorage`, `indexedDB` gesucht: 0 Treffer |
| `window.claude` / Artifact-Bridge | **keine** — 0 Treffer; das Paket startet ohne Claude-Sitzung |

## Enthaltene Funktionen

**Messkern** (`lib/kit-lab.js`, 633 Zeilen): Pack-Tabelle mit 23 Basispfaden, GLTF-Loader mit Cache,
Laufzeitmessung jedes Bauteils (`measure`/`measured`), `buildScene`/`makeViewer` (Orbit, Damping 0,14,
geklemmter Zoom, rAF-Notnagel), `repairTextures`, `contactSheet`, `relaxOverlaps`, `snapToSurface`,
`measureSurface`, `probeSurface`, `kerbSlots` sowie die Audits `auditWorld`, `auditJoints`,
`auditFootprints`, `auditGround`, `auditLanes`, `auditClearance` und `makeTopDownProbe`
(Pixelprobe auf die assemblierte Szene).

**Solver**: `dungeon-grid.js` (BSP, zwei Ebenen, Fugenmodell, Treppe zuerst), `hex-grid.js`
(`TILE_EDGES` als einzige Kachelwahrheit, Masken abgeleitet), `road-solver.js` (gemessene
Anschlusstabelle), `track-chain.js` (Kette mit Höhe), `props-lab.js`, `chess-set.js`, `domino-rig.js`.

**Licht** (`dungeon-light.js`, S13.3): drei Stimmungen (Promo/Fackeln/Nacht), Punktlicht-Pool mit
Stapelbetrieb, Flammenerkennung über den Atlas-Texel, Ebenen-Masken gegen Lichtleckage,
ACES-Tonemapping, Leseprobe (Luminanz Rec. 709 je Zellmitte).

**Seiten**: 15, davon 2 reine Modellseiten (S12, S13) und 13 gebaute Szenen.

## Nicht enthaltene Funktionen

Keine. Es wurde nichts entfernt, vereinfacht oder neu gebaut. Modelle und three.js sind
planmäßig extern (RAW-URL bzw. CDN) und deshalb keine fehlenden Abhängigkeiten.
