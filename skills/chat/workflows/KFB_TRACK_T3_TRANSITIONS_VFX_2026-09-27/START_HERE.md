# KFB Track T3 v2 / K2 · Produktions-Follow-up

Status: **CURRENT BRIEFING v2 · T3 v2/K2 ACCEPTED AS BASE · EXECUTION NOT STARTED**

Owner: KFB Track / World integration

Source lock: `georg-doc/kayfabizarro@7bd27b3d281911670250d6adad8f02e04412e149`

Accepted donor: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28`

## Ziel

Die akzeptierte T3-v2-Formensprache **Knetstrang auf K2** wird produktionsfähig gemacht: als sauberer Blender-Baukasten mit messbaren Anschlüssen und als visuelle Übergangs-, Biom- und Partikelgrammatik für einen frischen Claude-Design-Chat ohne Projektgedächtnis.

Es entsteht **kein neuer Track-Look**. T1/T2 sind als visuelle Richtung verworfen. T3 v2 mit `track-look.v4.js`, `clay-material.v10.js`, `clay-relief.v4.js` und `clay-toolmix.v1.js` ist die aktuelle Basis. T3 v1 bleibt Herkunftsbeleg, nicht Arbeitsstand.

## Startreihenfolge

1. [Gemeinsamer Übergangsvertrag](TRANSITION_GRAMMAR_T3_V1.md)
2. Blender MCP: [BLENDER_MCP_REBRIEF_T3_PRODUCTION.md](BLENDER_MCP_REBRIEF_T3_PRODUCTION.md)
3. Frischer Design-Chat: [CLAUDE_DESIGN_FRESH_CHAT_T4_TRANSITIONS_VFX.md](CLAUDE_DESIGN_FRESH_CHAT_T4_TRANSITIONS_VFX.md)
4. Partikelsprache: [VFX_CLAY_PARTICLE_GRAMMAR_V1.md](VFX_CLAY_PARTICLE_GRAMMAR_V1.md)
5. WFC-Einordnung für WorldBuilder: [WFC_HYBRID_WORLD_PLACEMENT_V1.md](WFC_HYBRID_WORLD_PLACEMENT_V1.md)
6. Spätere Jobs für Pit/Rampen und Billboards: [CLAUDE_DESIGN_LATER_JOBS_PIT_RAMPS_BILLBOARDS.md](CLAUDE_DESIGN_LATER_JOBS_PIT_RAMPS_BILLBOARDS.md)
7. Quellenbeleg: [SOURCE.json](SOURCE.json)

## Source-first Lesepaket

Alle nötigen Kontexte liegen in GitHub. Kein lokaler Ordner und kein früherer Chat ist erforderlich. Der frische Design-Chat liest zuerst die vier folgenden Dateien des akzeptierten T3-v2/K2-Pakets:

- Einstieg: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/START_HERE.md`
- verbindlicher Handover: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/HANDOVER_WSA.md`
- lebender Clay-Stand: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/docs/LIVING_CLAY.md`
- frischer Anschluss: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/NEXT_CHAT.md`

Danach nur die für die Ausführung benötigten Module:

- aktive Bühne: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/KFB Knet-Strecke T3 v2.dc.html`
- Track-Basis: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/lab-track/track-look.v4.js`
- Material: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/lab-clay/clay-material.v10.js`
- Relief/Werkzeuge: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/lab-clay/clay-relief.v4.js`
- Klassenmischungen: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/lab-clay/clay-toolmix.v1.js`
- Knetstrang-Konzept: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/lab-track/KONZEPT_S4_KNETSTRANG.md`
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
- Keine Rückkehr zu `clay-material.v8` als neue Basis und kein Überschreiben von `track-look.v4.js`; neue Arbeit ist additiv versioniert.
- Nicht alle sechs K2-Werkzeuge pauschal auf jedes Material oder jedes VFX-Partikel schalten. Die Klassenmischung und das Performance-Budget sind Teil der Gestaltung.
- Keine neue Review-Microsite als Produktziel. Beweise und Renderings gehen in GitHub; die spätere Abnahme erfolgt im echten Racer/WorldBuilder.

## Produktionsfolge

1. **B0 Blender:** ein Track→City-Übergang mit vollständigen Layern und Exportvertrag; nur Anschluss-Sockets für spätere Pit/Rampen.
2. **T4 Design:** dieselbe reale T3-v2/K2-Szene als Übergangsatlas plus Clay-Partikelatlas; kein erneuter Look-Wettbewerb.
3. **M2 Integration:** ein echter, befahrbarer Abschnitt im WorldBuilder/Racer mit Performance-Messung.
4. **D1/B5 später:** Boxengasse + Auf-/Abfahrten sowie Clay-Billboards mit bestehender Embed-Engine.

Blender und Design dürfen parallel arbeiten, solange sie nur ihren Owner-Bereich ändern und denselben Übergangsvertrag lesen.
