# Onboarding · nächster Chat · restliche Promoräume nachbauen

Stand 2026-09-20 nach S21 (R02 Schatz- und Esskammer, abgenommen).
Lies **vor** dem ersten Bau: `docs/MENTAL_MODEL_DIORAMA.md`, `docs/EDITOR_LAYER.md`,
Post mortem pm1–pm7 in `lib/sample-map.js` (sichtbar in `KayKit_Sample_Atlas_S20.html`).

## Was steht

| Artefakt | Rolle |
|---|---|
| `KayKit_Sample_Atlas_S20.html` + `lib/sample-map.js` | 13 Promobilder gegen das Register kartiert, Kaufliste, **Post mortem pm1–pm7** |
| `KayKit_Room_Study_S21.html` | Nachbau-Bühne: Rezept bauen, Vorlage überlagern, Prüfungen, **Mini-Editor** |
| `lib/room-recipes.js` | Rezept R02 + `buildRoom()` (Ecken abgeleitet, Klemmen gegen Wandfläche, Bank, Deckel) |
| `lib/room-fx.js` | synthetischer Ton + Funken/Glut/Schockwelle |
| `lib/kit-lab.js` | geteilt von allen 20 Seiten · **neu:** Grössen-Notnagel + `onResize`/`onFrame` |
| `docs/PACK_GAPS_DUNGEON_1_1.md` | fehlende Assets **und** „geprüft, keine Lücke" |

## Die Reihenfolge, die funktioniert hat

1. **Grundfläche zuerst.** Wandmodule je Zug zählen, Platte daraus ableiten, Kamera fitten,
   Silhouette gegen die Vorlage messen. Erst wenn Breite **und** Höhe passen, wird möbliert.
   Das hat in S21 rückwirkend drei Runden gekostet (pm7).
2. **Ein Ereignis je Wandmodul**, Eckmodul glatt (sonst steht ein Holzbalken in der Ecke).
3. **Meshnamen lesen, bevor ein Teil als fehlend gilt** — Deckel und Türblatt sind Submeshes (pm6).
4. **Requisiten in Weltkoordinaten**, gegen gemessene Halbmasse gerechnet; der Entzerrer ist
   Prüfung, kein Werkzeug (`entzerren: false`).
5. **Blickfang prüfen**: Strahlen von der Vorlagenkamera auf echte Oberflächenpunkte des Ziels.
6. **Editor für die letzten Zentimeter**, Patch zurück ins Rezept.

## Fallen, die zweimal zugeschnappt haben

- `buildScene` liest `s` als **Skalierung** → Zustandsfeld heisst `zs`.
- three.js raycastet **unsichtbare** Objekte → vor jedem Picking auf sichtbare filtern.
- `requestAnimationFrame` liefert in dieser Vorschau **0 Bilder** → Licht/Effekte an
  `V.onFrame` **und** ein Intervall hängen.
- Eine **Boxmessung** sagt nichts über bewegliche Teile.
- Ein Gate, das dauerhaft rot steht und nie aufgelöst wird, entwertet alle anderen.

## Erste Handgriffe im neuen Chat

1. `KayKit_Room_Study_S21.html` öffnen, R02 als Referenz ansehen (Vorlage → darüber).
2. Neues Rezept in `lib/room-recipes.js` anlegen (ROOMS-Array), Reihenfolge nach
   `docs/SPRINT_22_ROOMS.md`.
3. Nach jedem Raum: Prüfblock grün, Abweichungen benannt, Screenshot in `screenshots/`.
