# KFB Track T3 · Produktions-Follow-up

Status: **CURRENT BRIEFING · EXECUTION NOT STARTED**  
Owner: KFB Track / World integration  
Source lock: `georg-doc/kayfabizarro@692240b5b8c7b26369b4e4043a7df6d2939c6cbf`

## Ziel

Die akzeptierte T3-Formensprache **Knetstrang** wird produktionsfähig gemacht: zuerst als sauberer Blender-Baukasten mit messbaren Anschlüssen, parallel dazu als visuelle Übergangs- und Partikelgrammatik für einen frischen Claude-Design-Chat.

Es entsteht **kein neuer Track-Look**. T1/T2 sind als visuelle Richtung verworfen. T3 ist die Basis.

## Startreihenfolge

1. [Gemeinsamer Übergangsvertrag](TRANSITION_GRAMMAR_T3_V1.md)
2. Blender MCP: [BLENDER_MCP_REBRIEF_T3_PRODUCTION.md](BLENDER_MCP_REBRIEF_T3_PRODUCTION.md)
3. Frischer Design-Chat: [CLAUDE_DESIGN_FRESH_CHAT_T4_TRANSITIONS_VFX.md](CLAUDE_DESIGN_FRESH_CHAT_T4_TRANSITIONS_VFX.md)
4. Partikelsprache: [VFX_CLAY_PARTICLE_GRAMMAR_V1.md](VFX_CLAY_PARTICLE_GRAMMAR_V1.md)
5. Spätere Jobs für Pit/Rampen und Billboards: [CLAUDE_DESIGN_LATER_JOBS_PIT_RAMPS_BILLBOARDS.md](CLAUDE_DESIGN_LATER_JOBS_PIT_RAMPS_BILLBOARDS.md)
6. Quellenbeleg: [SOURCE.json](SOURCE.json)

## Source-first Lesepaket

Alle nötigen Kontexte liegen in GitHub. Kein lokaler Ordner und kein früherer Chat ist erforderlich.

- T3 Einstieg: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 - TUNE/KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27/START_HERE.md`
- T3 Spezifikation: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 - TUNE/KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27/DESIGN_SPEC_T3.md`
- T3 Knetstrang-Konzept: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 - TUNE/KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27/lab-track/KONZEPT_S4_KNETSTRANG.md`
- T3 aktive Bühne: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 - TUNE/KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27/KFB Knet-Strecke T3.dc.html`
- T3 Look-Code: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 - TUNE/KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27/lab-track/track-look.v3.js`
- Clay-Regeln: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 - TUNE/KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27/docs/HOWTO_KFB_3D_Claymation_Diorama_Worldbuilding.md`
- lebender Clay-Stand: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 - TUNE/KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27/docs/LIVING_CLAY.md`
- T1/T2 Postmortem: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 - TUNE/KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27/docs/POSTMORTEM_S4_T1_T2_TRACK_LOOK.md`
- Hirnwelt H0: `tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/START_HERE.md`
- bestehender Blender-Baukasten: `tools/KFB-ToolBox/_inbox/KFB Racetrack Blender Kit/START_BLENDER_RACETRACK.md`

## Zuständigkeiten

- **Track Core / bestehende Runtime:** Route, Fahrfläche, Breite, Steigung, Kontakt und Fahrphysik.
- **Blender MCP:** visuelle Module, Querschnitte, Anschlüsse, Export, Maße und LODs.
- **Claude Design:** Look, räumliche Rhythmik, Übergangslesbarkeit, Paletten und VFX-Presets.
- **Spätere Work-Integration:** bindet beide Ergebnisse an den echten WorldBuilder/Racer. Sie erfindet keinen dritten Look.

## Harte Grenzen

- Keine freihändig neu erfundene Strecke.
- Kein harter Übergang an einer Linie und kein reiner Farbverlauf.
- Keine dünnen Drahtgitter-Banden, Sticker-Schilder oder generisches Racing-Chrome.
- Kein zweiter Fahrflächen-, Kollisions-, Kamera- oder Physik-Owner.
- Keine neuen Platzhalter für vorhandene KayKit-, Kenney- oder Tiny-Treats-Teile.
- Keine neue Review-Microsite als Produktziel. Beweise und Renderings gehen in GitHub; die spätere Abnahme erfolgt im echten Racer/WorldBuilder.

## Produktionsfolge

1. **B0 Blender:** ein Track→City-Übergang mit vollständigen Layern und Exportvertrag; nur Anschluss-Sockets für spätere Pit/Rampen.
2. **T4 Design:** dieselbe reale T3-Szene als Übergangsatlas plus Clay-Partikelatlas.
3. **M2 Integration:** ein echter, befahrbarer Abschnitt im WorldBuilder/Racer mit Performance-Messung.
4. **D1/B5 später:** Boxengasse + Auf-/Abfahrten sowie Clay-Billboards mit bestehender Embed-Engine.

Blender und Design dürfen parallel arbeiten, solange sie nur ihren Owner-Bereich ändern und denselben Übergangsvertrag lesen.
