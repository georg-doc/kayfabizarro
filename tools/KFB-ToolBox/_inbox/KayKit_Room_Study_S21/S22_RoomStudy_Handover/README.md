# S22 Handover · Room Study Codebase (lean)

Nur Code und Dokumentation. **Keine Assets, keine Screenshots, kein Ballast** — alle 3D-Teile
lädt die Seite zur Laufzeit über `raw.githubusercontent.com` aus dem Asset-Repo
(`media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/`), siehe `github.md`. Das Promobild für die
Deckungsprobe kommt ebenfalls über die kanonische RAW-URL, der lokale Pfad
(`ref/samples/*.png`) ist nur Fallback und hier bewusst NICHT mitgeliefert.

## Start

1. `docs/ONBOARDING_S22_HANDOVER.md` lesen (Stand, was offen ist, nächster Schritt).
2. `docs/POSTMORTEM_S22_CONSOLIDATED.md` lesen (vier Fails dieser Session, Regel R4, fünf
   Verbesserungsvorschläge).
3. `KayKit_Room_Study_S21.html` über einen lokalen Webserver öffnen (ES-Module + `import map`
   brauchen `http://`, `file://` reicht nicht):
   `python3 -m http.server 8080` → `http://localhost:8080/KayKit_Room_Study_S21.html`

## Inhalt

| Pfad | Rolle |
|---|---|
| `KayKit_Room_Study_S21.html` | Bau-Bühne: Rezepte bauen, Inline-3D-Editor, Prüfungen, Vorlagenvergleich |
| `lib/room-recipes.js` | `ROOMS[]` (R02, R07, R08, R09, R03) + `buildRoom()` |
| `lib/dungeon-grid.js` | Geometrie-Messung: `wallFrame`, `cornerFrame`, `nodeFrame`, `stairFrame`, Generator S13.2 |
| `lib/kit-lab.js` | geteilte Viewer-/Lade-/Mess-Schicht aller Seiten |
| `lib/dungeon-light.js` · `lib/room-fx.js` | Lichtrig, Ton/VFX (synthetisch, kein Pack hat Audio) |
| `tools/probe-wall-nodes.html` | Messsonde Wandknoten (S22, Vertragsgrundlage) |
| `tools/probe-dungeon-parts.html` | Namensprobe Pack-Teile |
| `ref/dungeon_pack_names.json` | Registerliste aller 207 Pack-Namen (klein, deshalb dabei) |
| `docs/` | Verträge, Postmortems, Sprintstand, Onboarding |
| `CHANGELOG.md` · `HOUSEKEEPING.md` · `github.md` | Additive Historie, Dateistatus, Repo-Bindung |

## Wichtigster offener Punkt

R03 Brüstung/Treppe (`barrier`, `barrier_corner`, `stairs_wood`) sind falsch — die Teile wurden
nie isoliert angesehen. **Regel R4: kein neues Bauteil in ein Rezept, ohne es vorher allein im
leeren Raum gesehen zu haben.** Details im konsolidierten Postmortem.
