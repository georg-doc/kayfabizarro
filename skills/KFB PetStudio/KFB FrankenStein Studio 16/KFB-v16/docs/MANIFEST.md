# Manifest · Export FrankenStein Studio v16
*13.09.2026, 05:05. Nur was in dieser Sitzung entstand oder benutzt wird. Kein Gesamt-Projekt-Zip.*

## (a) Deliverables
| Datei | kB | |
|---|---|---|
| `KFB-FrankenStein-Studio-v16-STANDALONE.html` | ~1700 | **ein Doppelklick, kein Server** — Code vollständig eingebettet |
| `KFB FrankenStein Studio v16.dc.html` | 541 | Wurzelkopie (Arbeitsfassung) |
| `petstudio-v9/KFB FrankenStein Studio v16.dc.html` | 541 | **QUELLE** — hier wird bearbeitet |
| `frizzlegraft-v1/` (17 Dateien) | 178 | davon **neu in v16**: `matzones` · `headzones` · `eyeoval` · `donoreyes` · `wordmark` · `cardrider` |
| `petstudio-v9/studio-v3 · v7 · v8 · v9 · v10 · v12 · v13 · podcast-v2` | ~400 | Ladeweg, unverändert außer `pose-rig.v1.js` |
| `support.js` | 68 | DC-Laufzeit |

## (b) Verträge und Daten
`petstudio-v9/studio-v3/kfb-pets.json` · Format `kfb.pets/1`.
Neue Felder aus v16: `graft.mat` · `graft.zones` · `graft.wordmark` · `graft.donorEyes` ·
`eye.oval` · `eye.sclera` · `eye.pupil` · `pose.stagger` · `cardRider`.
Gemessen: 81 → 89 Blattfelder, Rundlauf verlustfrei.

## (c) Dokumente
| Datei | |
|---|---|
| `WSA_UEBERGABE_STUDIO_V16_2026-09-13.md` | Übergabe an WSA · sechs Abschnitte, alles gemessen |
| `BRIEFING_SONNET_AnimationLab_v5_Waffen.md` | Auftrag für den zweiten Chat |
| `OFFEN_nach_v16.md` | vier offene Punkte mit Befund und Fundstelle |
| `LIVING_frizzlegraft.md` | Projektgedächtnis, neueste Zeile oben |
| `HOUSEKEEPING.md` | Status je Artefakt |
| `github.md` | Quelle der 3D-Modelle + Sync-Beleg |

## (d) Abnahme-Belege
Keine Bilddateien im Export. Alle Abnahmen stehen als **Zahl** im LIVING und in der WSA-Übergabe
(gerenderte Bildpunkte, Dreieckszahlen, Card-Einheiten, Driftwerte). Georgs Rückmeldebilder bleiben
in `uploads/` und sind verarbeitet.

## Größen-Budget
Nichts über 2 MB. Größte Dateien: Standalone 1,7 MB · Spender-GLTF 594 kB · Kartenmotiv 237 kB.

## ⚠ Pfad-Hygiene · zwei ehrliche Einschränkungen
1. **Das Standalone ist nicht netzfrei.** Code und Bedienung stecken drin; die **3D-Modelle laden
   zur Laufzeit per RAW-URL** aus `georg-doc/kayfabizarro` — so war das Blatt von Anfang an gebaut,
   und die Skill-Regel §6 verlangt genau das. Ohne Netz: Bedienung da, Bühne leer.
2. **Zwei lokale Pfade laufen ins Leere**, in v16 wie in v15: `studio-v3/PET_EDITOR/pet-LIBRARY.json`
   (fällt sauber auf die RAW-URL zurück — 27 Pets geladen, gemessen) und **17 Schriftdateien** unter
   `fonts/`, die es im Projekt gar nicht gibt; es greift die Ersatzschrift. Beides ist alt, nicht
   neu — und genannt statt still.

## Gegengeprüft am laufenden Standalone
```
27 Pets geladen · Graft-Driver gebaut · 23 Knochen · ×0,42
alle sieben v16-Module geladen (mat · head · oval · donor · mark · card · pose)
11 Materialzonen · Spender-Augen ausgeblendet (OK) · Karte gebaut
```
