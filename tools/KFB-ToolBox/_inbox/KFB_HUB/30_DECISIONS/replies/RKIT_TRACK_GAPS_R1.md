# RKIT · Lückenliste Track Core 0.16.1 (V-134, Schritt 1: nur Liste, kein Bau)

Stand: 2026-10-11 · Besitzer Track Core: RKIT (V-118) · Look bleibt im Lab (J17, V-010/V-102). RKIT liefert Geometrie, Graph und Tests. Track Core bleibt privat (`~/Developer/rkit-r3/trackcore/track-core.mjs`).

**Status-Wörter:** **vorhanden** = kompiliert, hat Tests, Prüfungen grün · **teilweise** = Geometrie da, aber Prüfung rot, Test fehlt oder Schnittstelle fehlt · **fehlt** = nicht im Track Core.

**Aufwand:** S ≈ ½ Sitzungsblock · M ≈ 1 Block · L ≈ 2–3 Blöcke. Jeweils für Geometrie, Graph und Tests im Track Core, ohne Lab-Look.

## 0 · Grundsatz: Schnittstelle zuerst (betrifft jedes Teil)

| | Stand | Was fehlt | Aufwand |
|---|---|---|---|
| **Stream-Vertrag Lab ↔ Track Core** | **teilweise** | Das Lab rechnet mit einer eigenen Kopie **v0.12** (`src/world/organ/vendor/vendor-j15/lab-track/core/track-core.v012.mjs`, Stream-Schema 0.3). Track Core ist bei **0.16.1** (gleiches Schema 0.3 plus `body.edge {L,R}`, `body.bandeSide`, TOWN_BAY/B7). EXIT/ENTRY, DIVERGE/CONVERGE, JUNCTION und Körper gibt es in v0.12 nicht. „0.16 → v5“ ist ungetestet (PHASE_C_DONORS_R1 l.28–31; C2). | **M** |
| **Modul-Katalog (MODULES.md)** | **teilweise** | Liegt nur in Kritik-Ordnern (`docs/critic/lab-track/2026-10-11_C1b-C3-r2/MODULES.md`), mit Naht-Prüfung (Lücke 0, Höhensprung 0, Normalensprung ≤ 1,10°). Es fehlen Felder für Querschnitt, Banden-Seiten (`edge`) und Anschluss-Rahmen (Socket). | **S** (Vorschlag unten §4) |

Ohne diese zwei Punkte ist kein neues Teil „nahtlos einbaubar“. Ich schlage sie deshalb als **Teil 0** vor allen anderen vor.

<!-- TEILE -->
