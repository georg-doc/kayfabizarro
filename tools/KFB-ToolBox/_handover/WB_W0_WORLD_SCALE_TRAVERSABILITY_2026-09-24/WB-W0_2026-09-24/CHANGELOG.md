# CHANGELOG · WB-W0

## 2026-09-24 · WB-W0 · World Scale + Traversability Proof

### New
- `KFB WB-W0 · World Scale + Traversability.dc.html`, `w0-boot.js`, `w0-region.js`, `w0-globe.js`, `w0-actor.js`, `w0-ink.js`.
- Gate-Panel mit 10 gemessenen Gates, Rampentabelle, Figurmaßen, Ladeprotokoll; `COPY REPORT JSON` / `window.__w0.report()`.

### Changed (in this slice, after Georg's review)
- Billboard flackerte stark → Kartenfläche 6 cm vor + polygonOffset; Schattenkamera in Texelschritten; Tusche ohne Animation.
- Globus-Farbe an der Zone = Einstrahlung des TinySkies-Rigs (kein Farbsprung beim Handoff); Polkappe erst ab 72°.
- Gelände: Rampentest läuft zuerst, Erosions-Talus = gemessene Hanggrenze 25°; Böschungen erodieren mit; Rand blendet auf die Fernflächenfarbe.
- Props: Auflagetest (≤ 0,30 m Höhenunterschied unter dem Fußabdruck) in der Platzierung; Türschwelle zählt als Boden, nicht als Kollision.

### Unchanged (reused)
- `wd-registry.js`, `wd-donors.js`, `bb-scene.js`, `support.js`; `w0-ink.js` = `wd-ink.js` + ein benanntes Delta.

### Removed
- nothing. WorldBuilder-v1-Slice-1 bleibt eingefroren (`returns/WORLDBUILDER_V1_2026-09-24/`), nichts davon wird importiert.
