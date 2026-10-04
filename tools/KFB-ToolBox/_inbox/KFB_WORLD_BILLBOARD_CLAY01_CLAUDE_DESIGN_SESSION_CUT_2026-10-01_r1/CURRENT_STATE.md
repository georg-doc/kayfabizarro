# CURRENT STATE · 2026-10-01

| Teil | Status |
|---|---|
| Billboard-Körper (Rahmen, Pfosten, Rückseite, Leuchten, Laufsteg, Leiter, Sockel), eine verschmolzene Geometrie, Vertexfarben, ein Clay-Material | IMPLEMENTED |
| 2:1-Bildfläche 12 × 6 m, 1024×512, ungelit, kein Clay | IMPLEMENTED · TESTED (Prüfprotokoll: 12,000 × 6,000 m, 2,0000) |
| Embed-Spec `billboard.embed-spec.v1.json` treibt 1–16 Instanzen, nur Anker wechselt | IMPLEMENTED · TESTED (16 Instanzen, Geometrie/Material geteilt) |
| Zeitgeber: `BillboardScheduler.tick()` aus dem bestehenden Frame-Owner, kein eigener Timer | IMPLEMENTED |
| LOD Inhalt: nah 12 Hz, mittel 4 Hz, fern 0, außerhalb Blickfeld/über 260 m 0, max. 4 gleichzeitig nah | IMPLEMENTED · TESTED (Fahrt 16×: 4,2 sichtbar Ø, 62 Updates/s) |
| Insel kfb-insel-1 (Formeln aus briefd/bench.js) | IMPLEMENTED |
| Messwerte Struktur (Draw, △, Textur, sichtbar, Updates/s) | TESTED |
| Messwerte Zeit (FPS, p95, Ladezeit) im sichtbaren Tab | NOT_RUN |
| B1/B2a-Geometrie, H0/K2-Golden-Samples als Owner | SOURCE_REQUIRED (nicht gefunden) |
| Georgs Abnahme | OPEN |
