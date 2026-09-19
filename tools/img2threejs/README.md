# KFB img2threejs · Arbeitsbereich

**Stand:** 2026-09-19 · **Owner:** Georg / KFB  
**Aktueller Return:** [Landmark Group Rig v1](docs/LANDMARK_GROUP_RIG_V1_RETURN_2026-09-19.md)  
**Slice:** [Bounded contract](landmarks/pilot-04/SLICE.md)  
**Ideation:** [Living Toy World / Reactive Landmarks](docs/IDEATION_LIVING_TOY_WORLD_2026-09-19.md)

## Aktuell

**Landmark Group Rig v1: IMPLEMENTATION + STATIC / NUMERICAL TESTED RESULT.**  
Spasskaja-Turm und Kreml-Mauerstudie besitzen jetzt semantische Objektgruppen und vier starre Uhr-Attachments. Die Gruppierung verhindert die sichtbare Ablösung/Verformung der Uhrkörper unter City Grotesque und Soft Cubist.

Zusätzlich gibt es einen presentation-only **Living Toy Reactor**:
- Idle breathing;
- synthetischer Disco-Beat mit BPM/Intensity;
- Impact-Reaction Preview;
- Accent/Glazing-Pulse.

Kein Audio-, Collision-, Movement- oder Terrain-Owner wurde neu geschaffen.

**212/212 aktuelle Source-/Geometrie-/Reactor-/Viewer-Prüfungen PASS.**  
[Evidence](evidence/2026-09-19-landmark-rig-v1/summary.json)

## Öffnen

- [Pilot 04 · Group Rig + Living Toy Preview](landmarks/pilot-04/index.html)
- [Pilot 03 · Grotesque / Soft Cubist / Giza Voxel](landmarks/pilot-03/index.html)
- [Pilot 02 · Landmark Pack](landmarks/pilot-02/index.html)
- [Pilot 01 · Eiffel / Giza / Stonehenge](landmarks/pilot-01/index.html)
- [Dom v0.2 · akzeptierte Stilprobe](prototypes/koelner-dom/v0.2/index.html)

GitHub zeigt HTML als Quelltext. Pilot 04 benötigt JavaScript/WebGL und Three.js 0.160.0.

## Pilot 04 · Rig Contract

Aktuelle Gruppen:
- `towerCore` — deformierbare Hauptmasse;
- `clock:0..3` — `rigidAttached`, folgen expliziten Ankern / lokaler deformierter Basis;
- `wall:left/right` — Kernsegmente der Kreml-Mauerstudie;
- `secondarySoft` — weicher Sekundärkanal für spätere Wobble-/Overshoot-Reaktionen.

Das Rig exportiert zusätzlich `bumperProfile` als **PROPOSAL_METADATA_ONLY**. Es existiert noch kein echter Bounce-/Collision-Receiver.

## Reaktionen / North Star

North Star:

> **the world as a breathing, living toy**

Pilot 04 beweist nur die Präsentationsseite:
- Atem-/Pulse-Skalierung bleibt begrenzt;
- Disco-Mode verwendet einen synthetischen Beat-Envelope, keinen Audio-Owner;
- Impact-Buttons simulieren ein Reaktionssignal, keine Race-Physik.

Vollständige Ideen und nächste Scenery-Kandidaten: [IDEATION_LIVING_TOY_WORLD](docs/IDEATION_LIVING_TOY_WORLD_2026-09-19.md).

## Evidenz

Die aktuellen Tests belegen:
- unveränderte Quellmodelle;
- gleiche Dreieckszahl unter grouped deformation;
- bodenverankerte Geometrie;
- vier explizite Clock-Attachments;
- unabhängige Anchor-Field-Rechnung;
- orthogonale lokale Attachment-Basen;
- Uhr-Geometrie bleibt bis ca. `4e-15 m` rigiditätsgenau;
- Legacy-Point-Deformation verzerrt Uhren in den geprüften Fällen um ca. `0.24–0.44 m`;
- Living-Toy-Signale bleiben innerhalb definierter Vorschaugrenzen;
- Viewer-Source/Controls statisch gültig.

**Nicht behauptet:** erfolgreicher WebGL-/Mobile-/Consumer-PASS, echter Pinball-Bounce, Audio-Integration, OSM-Bindung oder Georg-Abnahme des neuen Rig-Looks.

## Recovery

1. `skills/chat/START_HERE.md` + Registry/SOP aktuell lesen.
2. [Pilot-04-Slice](landmarks/pilot-04/SLICE.md) → [Evidence](evidence/2026-09-19-landmark-rig-v1/summary.json) → jüngste Changelog-Einträge.
3. Sichtbar A/B testen:
   - Legacy vs Grouped;
   - Grouped City Grotesque vs Grouped Soft Cubist;
   - Idle vs Disco;
   - Impact L/R.
4. Erst nach Look-Gate nächste Fläche: `kfb-box-material` + `edge3.jpg`.
5. Danach separate Receiver-Slices für Beat-/Audio-Seam und Bumper-/Contact-Seam.

## Zuständigkeiten

City Lab besitzt Geodaten, lokale Projektion, City-Style und Landmark-Override. Registry/Librarian besitzt Assetidentität. Travel/Free Roam besitzt Bewegung/Terrainkontakt/Persistenz. Race besitzt Driving/Contact/Physics/Camera/Gameplay. Audio bleibt beim bestehenden Audio-Owner.

Pilot 04 ist ein reversibler Authoring-/Presentation-Donor und ersetzt keinen dieser Owner.
