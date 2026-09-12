# MANIFEST · Session-Export Pet Studio v12 · 10.09.2026

Diese Session: **S7** (Braue und Nase erweitert) · **S8** (Schnurrbart) · **S9** (Waffen-Mods) · Versionsprüfung · Standalone.
Exportiert wird **nur der Ladeweg der v12**, nicht das Projekt. Gemessen: 34 Code-Dateien, 2300.1 kB.
**Keine Datei über 2 MB.** Die schwerste ist `assets/models/FrizzleBob_Yellow_Gun.gltf` mit 660,6 kB.

## (a) Deliverables — `code/`

| Datei | Größe | Rolle |
|---|---|---|
| `petstudio-v9/KFB Pet Studio v12.dc.html` | 418.6 kB | der Wirt (diese Session: Bart-Abschnitt, Waffen-Wähler, drei neue Bedienwege) |
| `studio-v12/brow-rig.v2.js` | 11.7 kB | **NEU S7** · Kopfrundung, dreifache Dicke, Biegung je Seite, echter Balken |
| `studio-v12/pet-nose.v2.js` | 6.9 kB | **NEU S7** · Knolle als Superellipsoid |
| `studio-v12/pet-moustache.v1.js` | 13.2 kB | **NEU S8** · acht Formen, Feder aus dem Brauen-Modul |
| `studio-v12/weapon-mods.v1.js` | 11.7 kB | **NEU S9** · Kenney-Blaster statt Standardgewehr |
| `studio-v12/brow-rig.v1.js` · `pet-nose.v1.js` | 0.0 kB · 0.0 kB | Rückwege, unangetastet |
| übrige 27 Dateien | 2300.1 kB gesamt | der aufgelöste Ladeweg (Augen, Mund, Pets, Rolli, Bühne, Bank, Modelle) |

## (b) Contract- und Daten-Dateien

* `petstudio-v9/kfb-pinball-sfx.json` — 17.6 kB
* `petstudio-v9/podcast-v2/bubble-shapes.json` — 3.1 kB
* `petstudio-v9/studio-v3/kfb-pets.json` — 35.6 kB
* `petstudio-v9/studio-v3/PET_EDITOR/pet-LIBRARY.json` — 20.4 kB

_Keine dieser Bänke wurde in dieser Session geschrieben — die Version bleibt, wo sie stand._

## (c) Docs — `docs/`

* `LIVING_petstudio_v12.md` — **SSOT**, diese Session: S7, S7b, S8, S9, Versionsprüfung, S8–S10-Plan
* `UPLOAD_v12_github.md` — **NEU** · die zwölf Dateien mit Zielpfaden und den drei relativen Fallen
* `HANDOVER_v12_WSA.md` · `EMBED_CUBE_PET_FULL_v2.3_NACHTRAG.md` — Stand vom 09.09., unverändert

## (d) Abnahme-Captures — `captures/`

* `v12s7/` (8) — Braue und Nase v2, Standalone-Messung
* `v12s8/` (6) — acht Bartformen, Kennlinien-Vergleich
* `v12s9/` (6) — Waffen-Mods, Rückweg, Standalone

## Nicht im Export (bewusst)

* **`petstudio-v9/fonts/` (17 Dateien, 5,2 MB)** — steht in KEINEM Verweis des Ladewegs; der Standalone lädt die Schriften über Google Fonts (gemessen 0 `@font-face`). Gehört ins Repo oder auf die Platte, nicht ins Zip.
* **Kenney Blaster Kit, Platformer-Character, KayKit-Animationen, Texturen, Skydome** — 18 RAW-Adressen, zur Laufzeit geladen.
* Alles andere im Projekt (Boxel Blitz, SpinballCast, Travel, ältere Pet-Studio-Fassungen).
