# P1 · UFO Tractor Beam Event Lab

Status: **V1 GEBAUT · 06.10.2026 · r2 Beam-Überarbeitung 07.10.2026 · Return: `ufo-event-lab/RETURN.md` · Übergabe: `ufo-event-lab/HANDOVER_WSA_2026-10-07.md`** (vorher: READY ON MAIN · DO NOT START UNTIL GEORG TIMING; Start von Georg freigegeben)
UFO-Quelle V1 (Georg): `media/3D_Assets/KFB/ricks ufo by eeee - q6vNUoHZXr.glb` @ `276728f3f82f729cd1656b61e81d278856d736bb` (blob `4e338d00…`). Weitere 3D-Modelle folgen; das Lab tauscht das UFO-Rig per `setUfo()`.
Eingang: 06.10.2026 · Executor: Claude Design · Typ: isoliertes Visual/Audio Event Lab
Runtime-Risiko: niedrig — keine Open-World-Writes
Abhängig von Coworker: nein (nur für spätere Runtime-Integration)
Priorität: erste parallele Vorbereitung, während Coworker abschließt

## Zweck
Isolierter KFB UFO-/Tractor-Beam-Event-Beweis, ohne die Live-Open-World-Runtime zu berühren.

## Lieferumfang (ein isoliertes Event Lab)
- UFO-Donor-Auswahl aus echten Repo-Assets
- Ankunft / Schweben / Abflug
- Tractor Beam: Charge / Lock / Transfer
- Clay-artige De- und Rematerialisierung
- Zielskalierung:
  - kleines Prop
  - Resident-/Cube-Pet-großes Ziel
  - burggroßes Ziel
- Audio-Cue-Mapping aus vorhandenem Repo-Audio

## Gepinnte Docs auf main
- `skills/chat/UFO_HUNKY_DORY_WORLD_EVENT_PREP_2026-10-06.md`
- `skills/chat/CLAUDE_DESIGN_UFO_TRACTOR_BEAM_EVENT_BRIEF_2026-10-06.md`
- `skills/chat/UFO_EVENT_AUDIO_DONOR_SHORTLIST_2026-10-06.md`

Main head: `d04e0b8f2c2c34e9176f7eb75a77f19487d17698`

## Asset-Donors (Kenney Tower Defense, UFO-Familie)
- `enemy-ufo-a.glb`
- `enemy-ufo-b.glb`
- `enemy-ufo-c.glb`
- `enemy-ufo-d.glb`
- `enemy-ufo-beam.glb`
- `enemy-ufo-beam-burst.glb`

## Scope-Regeln
- keine Open-World-Runtime-Writes
- keine Edits an PR #348
- keine Persistenz-Implementierung
- kein Blender-Aufruf
- keine volle Hunky/Dory-Charakter-Integration in V1
- keine zweite Audio-Architektur
- UFO-Varianten erst source-isolieren, dann integrieren

## Warum jetzt
- voll parallel zum Coworker
- Vorbereitung ohne Architekturkonflikt
- Brücke zu Hunky & Dory, Destruction/Rebuild und World Events

## Next Gate
1. Claude Design: isolierter Event-Lab-Return
2. später: Coworker exact RETURN → Work/WSA Architecture Freeze → explizite UFO-Runtime-Integration als eigener Slice

## Ausblick · Destruction Beam / Terraforming Beam (Hinweis Georg, 06.10.2026 · NICHT in V1)
Neben dem Tractor Beam folgt später ein **Destruction Beam** auf demselben UFO:
- zerstört einzelne Props, Gebäude oder ganze Blöcke in spektakulären Explosionen mit Knetgummi-Partikel-Staub
- gleiche VFX und Logik wie in `KFB Seed World Mech Destruction POC 01` (`seedworld/sw-destruct.js` Zellen/Support/Kollaps/Rubble, `seedworld/sw-fx.js` Funken/Flashes)
- Umkehrung als **Terraforming-/Build-Aktion:** aufbauen, reparieren oder neue absurde Strukturen, Gebäude und Props erschaffen

Modul-Aufbau (Vorschlag für den Architecture Freeze, nicht implementiert):
```
UFO Rig (Quelle austauschbar: Rick, Kenney A–D, spätere Modelle)
  └─ Beam Emitter (Kegel, Fuß = Zielgröße, Charge/Lock/Retract)  ← geteilt
       ├─ Tractor:     Transfer-Gruppen → Dissolve + Clay-Partikel → Trichter (V1, dieses Lab)
       ├─ Destruction: Damage Cells → Kollaps/Rubble + Knet-Staub (Seed-World-Owner)
       └─ Terraform:   Rezept/Sektionen → Partikel → Assemble/Pop (Umkehrung)
Gemeinsam: stabile semantische IDs (Source Recipe ↕ Sections ↕ Damage Cells ↕ Particles), keine identische Geometrie nötig
Transfer ≠ Zerstörung: Zustände getrennt halten (PREP §3/§4)
```

## Beim Start (Vorbereitung, noch nicht ausgeführt)
1. Die drei gepinnten Docs von main @ `d04e0b8` lesen
2. Pfade der sechs `.glb` und der Audio-Shortlist im Repo lokalisieren, nur benötigte Dateien kopieren
3. Source-Isolation-Gate: jede UFO-Variante einzeln laden und prüfen, bevor sie ins Lab kommt
4. Lab als eigene Datei, z. B. `KFB UFO Tractor Beam Event Lab.dc.html`, mit `three_d_stage` oder eigener Szene
5. Return-Dokument `ufo-event-lab/RETURN.md` analog `seedworld/docs/RETURN.md`
