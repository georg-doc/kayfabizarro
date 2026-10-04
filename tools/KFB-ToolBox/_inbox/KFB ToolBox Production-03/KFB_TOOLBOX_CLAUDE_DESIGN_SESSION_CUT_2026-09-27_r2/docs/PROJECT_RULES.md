# Projektregeln (Kopie von CLAUDE.md im Projekt)


- **Schatten in jeder three.js-Bühne** (ToolBox, WSA, OMS-Slices): immer nach `handover/LESSONS_SHADOWS.md` (Kopie: `tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md`). Dazu gehören: das Frustum auf den Darsteller zuschneiden und auf das Texelraster einrasten, `normalBias` ≈ 1,5 Texel, und dünne Overlays (Brauen, Decals, Wimpern, Clay-Lider) werfen keinen Schatten. Das Problem ist bekannt und kommt immer wieder. Vor jedem »fertig« den Prüfteil aus dieser Datei durchgehen.
- Gesichtsteile laufen über einen Leser: `kfb-lib/face-mount.v1.js` (makeFaceApi · mountFace · mountPetFace). Neue Gesichtsfelder kommen dort hinein und nicht in die Oberfläche.
- Ohren und Stiele (später Lord Hunky, Alien Build A): die Physik liefert `ear-dangle.v1.js` (PR #214), DangleChain für jede Knochenkette von der Wurzel bis zur Spitze.
