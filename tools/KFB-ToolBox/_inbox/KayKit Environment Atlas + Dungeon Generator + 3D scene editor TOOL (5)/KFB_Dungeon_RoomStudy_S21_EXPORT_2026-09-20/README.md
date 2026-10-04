# KFB · Dungeon Room Study S21 · Export 2026-09-20

Revision `2026-09-20-r1`. Schlanker Export: nur was in dieser Session gebaut oder geändert wurde.
**Keine Modelldateien** — jedes Asset lädt zur Laufzeit über die kanonische RAW-URL aus
`georg-doc/kayfabizarro`. Ohne Netz bleibt die Bühne leer, das ist Absicht.

## Sofort loslegen
1. `KayKit_Room_Study_S21.html` im Browser öffnen (ES-Module, three 0.184 über unpkg).
2. Warten bis „messe Bauteile" durch ist, dann steht R02.
3. **Vorlage** (zweimal drücken) = Promobild halbdurchsichtig darüber → Deckungsprobe.
4. **Editor** an → Objekt anklicken → Mini-Menü am Objekt (✥ ⟳ ⬓ ⛓ ✕).
   Ergebnis in der Leiste unter „Editor · geänderte Positionen" kopieren.

## Wo was steht
| Datei | Rolle |
|---|---|
| `KayKit_Room_Study_S21.html` | Nachbau-Bühne R02, Prüfblock, Deckungsprobe, Mini-Editor |
| `KayKit_Sample_Atlas_S20.html` | 13 Promobilder gegen das Register kartiert · **Post mortem pm1–pm7** |
| `lib/room-recipes.js` | Rezept R02 + `buildRoom()` |
| `lib/room-fx.js` | synthetischer Ton (WebAudio) + Funken/Glut/Welle |
| `lib/sample-map.js` | Mapping, Kaufliste, tote Namen, Post mortem |
| `lib/kit-lab.js` | **geteilt von 20 Seiten** — Viewer, Laden, Messen, Prüfungen |
| `lib/dungeon-grid.js`, `lib/dungeon-light.js` | Generator-Grammatik und Lichtwerk (S13.2/13.3) |
| `docs/` | mentales Modell · Editor-Standard · Sprint 22 · Onboarding · Asset-Lücken |

## Für die Abstimmung mit PSA / Lead
- **Was bewiesen ist:** ein Promoraum ist mit dem freien Pack 1:1 nachbaubar, messbar
  (Silhouette 0,72 × 0,576 gegen Vorlage 0,72 × 0,57), kollisionsfrei und mit benannten
  Abweichungen.
- **Was gelernt wurde:** `docs/HANDOFF_S21_ONBOARDING.md`, Abschnitt „Fallen, die zweimal
  zugeschnappt haben" — fünf Klassen, jede hat Zeit gekostet.
- **Was als Nächstes:** `docs/SPRINT_22_ROOMS.md` (sechs Räume, Tore je Raum) und
  `docs/EDITOR_LAYER.md` E2 (Figuren posieren).
- **Was blockiert bleibt:** Skelett-Mobs für DG2-D fehlen als Asset
  (`docs/PACK_GAPS_DUNGEON_1_1.md`).

## Nicht im Export
Promobilder (`ref/samples/*.png`, ~17 MB) und Abnahme-Screenshots. Die Vorlage lädt über RAW-URL;
die Screenshots liegen im Projekt unter `screenshots/s21-*`.
