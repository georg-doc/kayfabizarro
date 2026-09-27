# WORLD-MOBILITY-M1 · Additive Changelog

## 2026-09-27 · accepted Hirnwelt H0 look integrated

- Georgs akzeptierten Hirnwelt-H0-Donor als aktuelle Clay-Richtung übernommen;
- `clay-material.v4.js` und `clay-relief.v2.js` tatsächlich in der World-Runtime eingesetzt;
- Reliefmaßstäbe für Fassaden/Dächer, Terrain/Straße/Gehweg und kleine Props getrennt;
- ursprüngliche Materialkarten und Farben erhalten und nur kontrolliert mit Knetpalette gemischt;
- `clay-soften.v1.js` als Source-Lock mitgeführt, aber nicht zur Laufzeit ausgeführt;
- SkinnedMesh/Characters ausdrücklich nicht vorverarbeitet;
- Original/Knete weiterhin direkt reversibel;
- Paket-/Owner-Prüfung 43/43 und Browserprüfung 40/40 bestanden;
- nächste Geometriearbeit klar getrennt: echter Track-Core plus modellierte Bordstein-/Gehweg-Stadtzelle.

## 2026-09-27 · Publication route fallback preserved

- exact 41-file package pushed to `cloudflare-live@e10745def24c1dde96ef36b474cea0b90dc1b237`;
- branch readback PASS;
- three exact public browser requests returned the general site root instead of the M1 marker;
- status recorded as `PUBLIC_ROUTE_FALLBACK`, not falsely promoted to `PUBLIC_VERIFIED`;
- no rebuild or runtime patch triggered by the deployment symptom.

## 2026-09-27 · productive Ground/Flight integration

- den abgelehnten gefalteten ST01-Track-Dummy vollständig entfernt;
- Travel-Mode-Router und 400-ms-Intent als exakte Donoren übernommen;
- echten Travel-Card-Carrier statt eines neuen Flug-Placeholders integriert;
- World-r2-Ground-Owner und World-Kontaktlogik beibehalten;
- pro Modus genau einen Movement- und Camera-Owner durchgesetzt;
- FrizzleBob im Flug auf Carrier-Idle statt dauerhaftem `jump.air` betrieben;
- Original/Clay weiterhin reversibel gehalten;
- Drive und Water bis zu ihren tatsächlichen Source-Ownern gesperrt;
- Paketprüfung 40/40 und lokale Browserprüfung 40/40 bestanden;
- keine Public-Stage-/Live-Promotion vorgenommen.
