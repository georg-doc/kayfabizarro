# HANDOVER an WSA / Web Lead · Session-Cut R2D 2026-10-03

## Check-in
Vorschlag für den Pfad: `tools/KFB-ToolBox/_inbox/KFB_WORLD_CORE_R2D_CLAUDE_DESIGN_SESSION_CUT_2026-10-03_r1/`, als Branch/PR neben PR #328 (R2D-Brief). Inhalt des ZIPs 1:1, ohne Umbenennen: Die .dc.html laden `./support.js` und `./KFB_R2D_v0/…` relativ.

## Was der Code von außen lädt (Pins)
| Quelle | Pin | Wofür |
|---|---|---|
| R2D-Brief | 14a1c55bbf2748d67cfd673d5d0df73bf3f7b082 | Auftrag |
| R2C Hex-Archipel | 927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f | Paletten, Landmarken, sky-core, Joyride road-markings |
| Claymation SSOT | 589fa4fe6a3d5a950cf8a82bcf480b8e6326e711 | Knet-Regeln |
| Track Core | 64d8597c3dad1dc9814c794d4a566d589e1e1a25 | track-core.mjs, stream-to-three.mjs |
| B2 Fassaden-Owner | 69c9c7f54cb1c048105f5aa822593c8976727959 | noch nicht angeschlossen |
| Assets (Forest, Texturen) | 378b209355b13304e3cff656ec0806ca5b89df28 | Bäume, Büsche, Fingerprints |
| Hexagon Pack | 34cde3f8f752d481a03c9714f1c3b3a8b2c15c46 | Landmarken, building_A |
| Snow Biome | ab65e8c46ca3c07db4294214a63384975fb7d0d9 | castle_snow, house_snow |
| Festive Mini-Pack | 7600fa9e29d396eaa9c5a11532e63cdad7689e75 | Schneebäume |
Vollständige Liste: `ASSET_MANIFEST.json`. three@0.160.0 über unpkg (Importmap in den Seiten).

## Bitte prüfen
1. Die Seiten laufen lokal außerhalb der Claude-Vorschau (NOT_TESTED).
2. Alle raw-URLs liefern 200 (Pins existieren auf main).
3. Kein Modell, keine Textur, kein Font im Cut, nur Code, Daten, Doku und Belege.

## Aufträge an WSA
- `KFB_R2D_v0/BRIEF_WSA_FLUID_SHADER.md`: Fluid-Shader aus Card Lab v2 als Baustein, für S4.
- `KFB_R2D_v0/BRIEF_WSA_KNETSTRANG_BAUSTEIN.md`: Joyride-Knetstrang als einzeln aufrufbare Funktion.

## Bekannte Fehler und Grenzen
Die Unterseite in der Insel ist v6, Status FAIL. Sie wird in S2 durch Scholle v7 ersetzt. Die Bank zeigt ohne `uploads/` keine Benchmark-Vorschaubilder. Postmortem Quaternius-Pfadsteine: `KFB_R2D_v0/POSTMORTEM_QUATERNIUS_PFADSTEINE_2026-10-03.md`.
