# WhackMan v1 · Codebase-Export 2026-09-22

Enthält alle `wm-*.js`-Module + die DC-Datei + `support.js` (DC-Runtime) für diese Session.

## Wichtig: fehlende Abhängigkeiten
Dieser Export ist NICHT eigenständig lauffähig. Er importiert aus zwei Owner-Bibliotheken, die
im Ursprungsprojekt unter `tools/` liegen und hier bewusst NICHT dupliziert wurden (Owner-Code,
nicht dieses Projekts Eigentum):
- `tools/resident_atlas_s6/lib/atlas.js` (Legacy-Rig-Zugriff, `wm-src.js`)
- `tools/world_atlas/source/lib/dungeon-grid.js` + `kit-lab.js` (Dungeon-Bauteile, `wm-gate-b.js`, `wm-kit.js`)

Für einen lauffähigen Stand: aus dem Ursprungsprojekt (Projekt-ID siehe `github.md` dort) den
`tools/`-Ordner dazukopieren, oder die Dateien hier zurück ins Ursprungsprojekt legen.

## Dateien in diesem Export
- `KFB WhackMan v1.dc.html` — Design-Component-Entry
- `wm-*.js` — alle Spiel-Module (Motor, Maze, Gates A/B/C, Verfolger, Kollision, Audio, Lull, Pool, Recipe, Src)
- `support.js` — DC-Runtime (nicht anfassen)
- `SESSION_CUT_2026-09-22.md` — strukturiertes Handover (Kontext, Postmortem, Backlog, 5 proaktive Vorschläge)
- `WHACKMAN_BACKLOG_2026-09-22.md` — offene Punkte mit Reihenfolge-Vorschlag
- `POSTMORTEM_CHANGELOG.md` — vollständiger Session-Changelog (2026-09-21 + 2026-09-22)
- `TEST_REPORT_2026-09-21.md` — gemessene Testergebnisse aus der vorherigen Session

## Für den WSA-Lead-Chat
Das generische Kollisions-/Bounce-Modul (`wm-collide.js`) ist absichtlich ohne WhackMan-
Spezifika geschrieben — bei Bedarf auch für andere Welt-Objekte jenseits von WhackMan
wiederverwendbar.
