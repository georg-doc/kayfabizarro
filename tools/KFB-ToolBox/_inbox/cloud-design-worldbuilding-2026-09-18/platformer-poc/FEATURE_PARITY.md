# Feature Parity — gegen den Brief vom 2026-09-18

`CLAUDE_DESIGN_BRIEF.md` @ `a12e3316dd56f2bcda1bf0d7c1b743f40fec849e`.
Legende: **JA** gebaut und geprüft · **TEIL** gebaut, mit Einschränkung · **NEIN** nicht gebaut.

## P0 · Platformer Default Actor

| Anforderung | Stand |
|---|---|
| Szene, Plattformen, Kollision | JA |
| freier Orbit | JA |
| Walk / Run / Duck | JA |
| Jump / Airborne / Land | JA |
| Chill-Assist | JA — 12/12 im Test |
| Game Mode | JA |
| Rettung | JA (Chill: letzte sichere Plattform · Game: Checkpoint) |

## P1 · KFB-Aktor-Adapter

| Anforderung | Stand |
|---|---|
| FrizzleBob über `mountGraft()`, `animation:'host'` | JA |
| CapsuleCarl über `mountCarl()`, prozedural | JA |
| ein Resident/KayKit-Biped | JA (Skeleton Warrior) |
| Aktorwechsel ohne doppelte Mixer/Gesichter | JA |
| kein dauerhaft reduziertes Demo-Roster | JA — 15 Einträge, manifest-getrieben, lazy |

## P2 · Hub-Schicht

| Anforderung | Stand |
|---|---|
| Projekt-Plattformen / Portale | JA — 9, aus `data/hub-portals.json` |
| Aktor-Picker | JA, einklappbar |
| Pickups | JA — 18 |
| kompakte Hub-UI | JA |
| Ziele als Kandidatendaten, kein Hub-Scraping | JA |

## Einzelne Briefing-Punkte

| §  | Anforderung | Stand |
|---|---|---|
| 2 | Pack-Identität bleibt „Platformer Game Kit - Dec 2021" | JA, keine Gleichsetzung behauptet |
| 3 | Spielbar auch ohne jeden externen KFB-Aktor | JA |
| 7 | Gemeinsame semantische Zustände | JA — 9 Zustände |
| 7 | Keine behauptete Geschwindigkeitsleiter | JA, ausdrücklich offen gelassen |
| 7 | `Jump_Full_*` nur bei echter Kompatibilität | TEIL — nicht in der Zustandskarte, im Dropdown wählbar |
| 7 | Motion Lab | JA |
| 8 | KFB/Travel-Preset als Standard, Platformer-Preset zusätzlich | JA |
| 9 | Kein 180°-Kippen, Orbit bleibt beim Laufen | JA |
| 9 | Kamera-Kollision | NEIN (laut Brief optional) |
| 10 | Plattform-Graph mit Nachbarn, Landeflächen, Portalen | JA |
| 10 | Bewertung im LAB sichtbar | JA (align · dist · drop) |
| 11 | Anticipation → Absprung → Bogen → Landung → Recovery | JA |
| 11 | Flow Hop | TEIL — schlägt vor, springt nicht |
| 12 | Pickups, Bouncer, Spikes/Säge, Checkpoints | JA |
| 12 | Gegner (Bee/Crab/Enemy/Skull) | NEIN |
| 12 | Goal_Flag / Tür / Schlüssel als Mechanik | NEIN — Flagge steht als Marke |
| 13 | Spieler-UI Englisch | JA |
| 15 | 3D-Aufbau statt Sidescroller, Höhen und Cluster | JA |
| 16 | Wenig UI, Spiel dominant, Diagnose in einer Schublade | JA |
| 17 | Ton/VFX als Ereignisabbildung, kein zweiter Audio-Motor | JA (WebAudio, keine Binärdateien) |
| 18 | Persistenz im eigenen Namensraum, kein `clear()` | JA |
| 20 | Tests getrennt berichtet, Nicht-Gelaufenes als NOT_TESTED | JA |
| 21 | ZIP ohne Ballast, Assets als SourceRefs | JA |

## Non-Goals — eingehalten

Free-Roam-Drive-POC unberührt · keine Travel-Integration · kein Walk↔Drive · keine Combat
Arena · kein OSM · keine 43 Fahrzeuge · kein Multiplayer · kein Questsystem · keine
universelle Animation-Engine · kein neues Asset-Registry · keine volle Project-Island-Kanon-
Umsetzung.
