# HANDOVER · Billboard Clay · an WSA · 2026-10-01 (r2)

## Entscheidung Georg
`KFB_WORLD_BILLBOARD_CLAY01…r1`: **PASS → TUNE**. Status **DESIGN_DONOR_APPROVED_TUNE**. Das Design darf als Billboard-Design-Donor verwendet werden. Nächster Integrationsowner: **WSA**.

## Übernehmen
- 50er/60er-Highway-Silhouette
- 12 × 6 m, Medienfläche 2:1
- Rahmen, Pfosten, Rückseite, Laufsteg, Leiter, Leuchten
- Front-/Rear-Konzept (hier Front +Z, Rear −Z)
- `billboard.embed-spec.v1`
- Anker-, LOD- und Scheduler-Konzept (`BillboardScheduler.tick()` vom bestehenden Frame-Owner, kein eigener Takt)
- Bildfläche ungelit, unverformt, vom Clay-Material getrennt

## Nicht als neue Owner übernehmen
- lokaler `briefd/bench.js`-Clay-Shader (`makeClayFamily` in billboard-clay.js ist nur Prüfstand)
- die Beispielinsel (`buildIsland` in billboard-stage.js)
- eine zweite Billboard-Engine oder einen zweiten Scheduler
- eigene PDF-/Card-Crop-Logik (`newCut`/`paintFace` sind Platzhalter bis zum H13/H14-Provider)

## Tune-Punkte (offen, Owner WSA)
1. Pfosten-Bodenkontakt nicht als separate große Knetklumpen; Anschluss über das gemeinsame Terrain-/Prop-Kontaktprofil.
2. Leuchten und kleine Aufbauten in Nahsicht beruhigen.
3. Körper mit dem gemeinsamen KFB-Prop/Signage-Clay-Profil behandeln.
4. Medienfläche ohne Knetrelief und ohne Deformation.
5. B1/B2a-Front-/Rear-Semantik abgleichen.
6. H13/H14 über einen Provider anschließen; der Provider besitzt keinen eigenen Takt.
7. Sichtbaren Messlauf 1/4/8/16 nachholen.

## Neu in r2 · PROPOSED (Abnahme Georg offen)
| `bodyStyle` | Körper | Innenradius | Körper-△ | Bodenkontakt |
|---|---|---|---|---|
| `highway` | Donor, Geometrie unverändert | 0 (Schalter: 0,6 m) | 6 792 (7 176 rund) | Knethügel, Tune 1 offen |
| `plain` | Fasenrahmen, Rückplatte, 2 Kantpfosten, 1 Riegel | 0,45 m | 2 952 | flacher Fußkragen |
| `tv` | flacher Cartoon-Fernseher: Gehäuse, Lünette, 2 Drehknöpfe, 3 Lautsprecherschlitze, Hasenohr-Antenne, Rückdeckel, 2 Standsäulen | 1,1 m | 4 482 | flacher Fußkragen |

- Rundecken: Bildfläche = Rundrechteck, UV linear über die volle 12 × 6-Box. Bild unverzerrt, nur die Ecken fallen weg (Verlust 0,24 % / 0,43 % / 1,44 %).
- Spec additiv: `bodyStyle` (`highway`|`plain`|`tv`), `faceCornerM` (m). Fehlen die Felder, verhält sich alles wie r1.
- Pro Stil eigenes Layout (`STYLES` in billboard-clay.js): Fußpunkte, Kollisionszylinder, Anker-Bodenprüfung und Kameraansichten lesen es. Plain und TV haben 2 statt 4 Fußpunkte.
- Die Varianten lösen Tune 1/2 nur für sich, nicht für den Donor. Clay-Profil bleibt Tune 3.

## Next Gate (genau eins)
**BILLBOARD-MEASURE-VISIBLE-01:** Auf dem Zielgerät bei sichtbarem Tab „Messlauf 0 · 1 · 4 · 8 · 16“ je Körperstil (highway, plain, tv) fahren, `billboard-messung.json` laden und die Bildzeit-Spalte belegen.
