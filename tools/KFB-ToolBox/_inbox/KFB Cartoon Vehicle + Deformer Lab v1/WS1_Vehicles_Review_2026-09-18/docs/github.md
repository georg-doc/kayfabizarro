repo: georg-doc/kayfabizarro
branch: main
path: registry/assets/v1, media/3D_Assets

secondary-repo: georg-doc/KFB-Stunt-Car-Race
secondary-branch: main
secondary-path: 3D Assets/KayKit_Space_Base_Bits_1.0_FREE, skills/, _handover/SPRINTS_2026-09-10

## Last sync
date: 2026-09-17T19:48:00Z
commit: 10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0

### Updated in this project
- Fahrzeugliste auf Georgs Asset-Handoff umgestellt (`kfb.asset-handoff.v1` @ 10a7fdce6b): 43 Fixtures, davon 25 aus dem Handoff und 18 aus dem Registry, Herkunft je Zeile.
- Nachgetragen, was fehlte: KayKit City Builder Cars (5) und die Poly-by-Google-Fahrzeuge (7).
- Neuer gruppenbasierter Deformer `lab-v7/vehicle-cartoon-deformer.v2.js` samt Profilen und zwölf Testsequenzen; Shader-Fassung `cardeform.v1.js` überholt.
- Neue Werkbank `KFB Cartoon Vehicle Deformer Lab.dc.html`; Rückmeldung in `RETURN_cartoon_vehicle_deformer.md`.

### Vorherige Runde
- Fahrzeugliste aus den Registry-Packs gezogen (kenney-car-kit, -toy-car-kit, -racing-kit): 22 Fahrzeuge mit gepinnten RAW-Adressen.
- Neue Fahrzeug-Linie `lab-v7/` plus Oberfläche `KFB Vehicle Lab v1.dc.html` (Rig, Cartoon-Deformer, fünf Fixtures, Telemetrie-Naht).
- Befund: KayKit Space Base Bits liegt nicht im Registry und ist im Browser nicht ladbar (RAW-Fehler, `.bin` nicht kopierbar) — Abhilfe als `.glb` in `media/3D_Assets`.
- Stand-Dokument `LIVING_VEHICLES.md` angelegt.

## Screen map

| Screen / Datei | Repo-Quellen |
|---|---|
| `KFB Vehicle Lab v1.dc.html` · `lab-v7/registry-vehicles.v1.js` | kayfabizarro: `registry/assets/v1/packs/kenney-car-kit.json`, `…/kenney-toy-car-kit.json`, `…/kenney-racing-kit.json`, `registry/assets/v1/manifest.json`; Modelle unter `media/3D_Assets/kenney_car-kit`, `…/kenney_toy-car-kit`, `…/kenney_racing-kit` |
| `lab-v7/cardeform.v1.js` | KFB-Stunt-Car-Race: `_inbox/KFB TRAVEL GLOBE re-home WS0/.../travel/kfb-cartoon-deform.js` (Technik-Vorbild) |
| `lab-v7/carrig.v1.js` | KFB-Stunt-Car-Race: `_handover/SPRINTS_2026-09-10/F2_VEHICLE_REVIEW/source/frankenstein/race/src/vehicles.v1.js` (Inselregel, Radachse) |
| `lab-v7/fixtures.v1.js` | KFB-Stunt-Car-Race: `skills/kfb-cartoon-animation_v2.md` (§2, §11, §12) |
| `KFB Cartoon Vehicle Deformer Lab.dc.html` · `lab-v7/fixture-adapters.v2.js` · `lab-v7/vehicle-cartoon-deformer.v2.js` | `uploads/kfb-race-track-asset-handoff-generic-runtime.json` (Georgs Handoff, kayfabizarro @ 10a7fdce6b); kayfabizarro: `registry/assets/v1/packs/kaykit-city-builder-bits-1-0-free.json`, Modelle unter `media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE`, `media/3D_Assets/KFB`, `media/3D_Assets/Frankensteining`; KFB-Stunt-Car-Race: `_handover/CLAUDE_DESIGN_CARTOON_VEHICLE_DEFORMER_BRIEF_2026-09-17.md` |
| `3D Assets/KayKit_Space_Base_Bits_1.0_FREE/*` | KFB-Stunt-Car-Race, gleicher Pfad (contents.png, sample.png, License.txt, spacebits_texture.png) |

## Sync history

### 2026-09-17T18:33:30Z
- Erstaufnahme: Space-Base-Bits-Inventar gelesen (57 glTF, 3 Fahrzeuge), Vorarbeit `kfb-cartoon-deform.js` und `vehicles.v1.js` gelesen, `github.md` angelegt.
