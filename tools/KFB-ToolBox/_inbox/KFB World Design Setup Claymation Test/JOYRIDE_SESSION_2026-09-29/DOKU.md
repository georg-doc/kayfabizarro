# DOKU · Joyride Module

- **kfb-drive.k2.js**: `makeFrame(S, ds)` → at(s) {p,T,U,R,c,half,surface}; `stepDriver(d, F, inp, dt, {assist, motorK, halfWidth})`; `pose(d, q)`. Spurhilfe: Kurve zum Anteil assist mitgenommen, Ausrichtung align 2,4. Bande: weich (Spender) + Prall (Spiegel ×0,4, Tempo ×0,995, Squash). Flug: Absprung wenn Fahrfläche endet, Schwere 13,3, Landehilfe min(1, assist×1,15) auf Landung +6 m, 1/120-s-Unterschritte. Q = links, E = rechts.
- **lean-pass.l2.js**: chunkify(cell 140), thinNoCast, clayLite, makeShadowFollow (Kanon PR #290), faceNormals (42°), makeWobble (Bandenfeder im Vertex-Shader).
- **joyride-drive.j06.js**: Gelände, Häuser-Hooks, S5-Werkbank, Tafeln, Eingabe, Kamera (Schiene/Flug/Orbit/frei), VFX-Emitter, Prüfansichten (fs-quelle, fs-nah, fs-strasse, orbit, kontakt, haus).
- **Rezept joyride.j06.json**: drive, vfx, lean (t4-Dichte, shadow, foliageAO), facade (h0, k1, houseK1), billboards, terrain, vehicles.
