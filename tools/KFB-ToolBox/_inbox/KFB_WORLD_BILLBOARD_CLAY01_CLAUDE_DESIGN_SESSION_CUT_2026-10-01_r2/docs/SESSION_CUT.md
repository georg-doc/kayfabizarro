# Session-Cut · CD-ISLAND-BILLBOARD-CLAY-01 (2026-10-01)

## Status: `DESIGN_DONOR_APPROVED_TUNE` (Georg, 01.10.)
PASS → TUNE. Design darf als Billboard-Design-Donor verwendet werden. Nächster Integrationsowner: **WSA**. Dieser Design-Chat baut keinen H0/K2-Materialvergleich und keine Inselintegration mehr.

**Übernehmen:** 50er/60er-Highway-Silhouette · 12 × 6 m, Medienfläche 2:1 · Rahmen, Pfosten, Rückseite, Laufsteg, Leiter, Leuchten · Front-/Rear-Konzept · `billboard.embed-spec.v1` · Anker-, LOD- und Scheduler-Konzept · Bildfläche ungelit, unverformt, vom Clay-Material getrennt.

**Nicht als neue Owner übernehmen:** lokaler `briefd/bench.js`-Clay-Shader · Beispielinsel · zweite Billboard-Engine oder zweiter Scheduler · eigene PDF-/Card-Crop-Logik.

**Tune-Punkte (offen, Owner WSA):**
1. Pfosten-Bodenkontakt nicht als separate große Knetklumpen; Anschluss über das gemeinsame Terrain-/Prop-Kontaktprofil.
2. Leuchten und kleine Aufbauten in Nahsicht beruhigen.
3. Körper mit dem gemeinsamen KFB-Prop/Signage-Clay-Profil behandeln.
4. Medienfläche ohne Knetrelief und ohne Deformation.
5. B1/B2a-Front-/Rear-Semantik abgleichen (hier: Front +Z, Rear −Z).
6. H13/H14 über einen Provider anschließen; der Provider hat keinen eigenen Takt.
7. Sichtbarer Messlauf 1/4/8/16 nachholen (Tab sichtbar, Zielgerät).

## Nachtrag 01.10.: Körpervarianten · PROPOSED
Weniger Details, Bildöffnung innen abgerundet. Gleiche Bildfläche (12 × 6, 2:1, ungelit), gleicher Spec, gleicher Scheduler. Umschalter in der Prüffläche.
| `bodyStyle` | Körper | Innenradius | Bodenkontakt |
|---|---|---|---|
| `highway` | Donor, unverändert | optional 0,6 m | Knethügel (Tune 1 offen) |
| `plain` | Fasenrahmen, Rückplatte, 2 Kantpfosten, 1 Riegel | 0,45 m | flacher Fußkragen |
| `tv` | flacher Cartoon-Fernseher: Gehäuse, Lünette, Knopfleiste, Hasenohr-Antenne, 2 Standsäulen | 1,1 m | flacher Fußkragen |

Spec-Felder neu (additiv, v1 bleibt gültig): `bodyStyle`, `faceCornerM`. Rundecken: Bildfläche ist ein Rundrechteck, UV linear über die volle 2:1-Box → Bild unverzerrt, nur die Ecken fallen weg (Verlust im Prüfprotokoll). Die Varianten lösen Tune 1/2 nur für sich, nicht für den Donor.

## Lieferung
| Datei | Rolle | Status |
|---|---|---|
| `KFB Billboard Clay Island.dc.html` | ausführbare Prüffläche (Prüfszene, Insel, 1/4/8/16×, Messlauf) | IMPLEMENTED |
| `briefd/billboard-clay.js` | Billboard (Geometrie, Clay-Material, Inhalte, Anker, Zeitgeber-Tick) | IMPLEMENTED |
| `briefd/billboard-stage.js` | Insel (Formeln aus `briefd/bench.js`), Ansichten, Messlauf | IMPLEMENTED |
| `billboard.embed-spec.v1.json` | Embed-Spec, treibt alles | IMPLEMENTED |
| `briefd/billboard-messung-2026-10-01.json` | Messwerte | TESTED Struktur · NOT_TESTED Zeiten |
| `briefd/billboard/01…08-vergleich.png` | Vergleichsbilder | IMPLEMENTED |

## Vergleichsbilder
01 Prüfszene Ausrichtung 1:1 · 02 Prüfszene schräg · 03 Prüfszene Rückseite · 04 Insel nah · 05 Insel mittel · 06 Insel fern · 07 Insel Bodenanschluss · 08 Insel 16×.

## Messwerte (Insel kfb-insel-1, M1 Max, Tab verborgen → Zeiten nur indikativ)
Ü = Kreisfahrt um die Insel, F = Fahrt auf der Straße.
| Stufe | Draw | Dreiecke | Tex MB | sichtbar Ø | Upd/s |
|---|---|---|---|---|---|
| Basis | 5 | 82k | 0 | 0 | 0 |
| 1× Ü / F | 8 / 6 | 96k / 89k | 2,7 | 1 / 0,4 | 6,4 / 3,6 |
| 4× Ü / F | 17 / 11 | 136k / 116k | 10,7 | 4 / 1,1 | 16,7 / 16,8 |
| 8× Ü / F | 29 / 17 | 191k / 150k | 21,3 | 8 / 2,1 | 27,4 / 29,9 |
| 16× Ü / F | 53 / 28 | 300k / 218k | 42,7 | 16 / 4,2 | 60 / 62 |

Je Billboard: 3 Draw Calls (Körper im Schattendurchgang, Körper, Bildfläche), ~13,6k △ inkl. Schatten, 2,7 MB Textur. Fünf Shader-Programme statt vier (ein Programm für alle Billboards). Bildzeiten (indikativ, 3–8 ms GPU-synchron) sind **nicht belegt**: Tab war verborgen. Sichtbarer Lauf: Button „Messlauf“.

## Inhalte (nur gebackene GitHub-Bilder, Pin `f3acaaeb98530dd9ffb7d200d61956891e738336`)
- `media/public_domain/aic/great-wave-hokusai-1830-33.jpg` (PD, Sidecar vorhanden)
- `media/public_domain/met/bathing-suit-1890-95.jpg` (PD, Sidecar vorhanden)
- `media/kfb/wall_protopia_full.jpg` (KFB-eigen)
- `media/kfb/KayfaBizarro_Card_Backside_01_lowrez.png` (KFB-eigen)
- ausgelassen: `commons/silent-film.svg` (SVG), `ia/the-general-1926-item-tile.jpg` (4 KB)
- Design-Quelle: `georg-doc/kayfabizarro@6df3410473ae32b8f75d992e0d534e49a9dc3ca0`, `tools/KFB-ToolBox/_inbox/KFB Billboard Kaleidoscope H13/kfb-collage-session-2026-09-30/`. Die H13-Generatorlogik selbst wurde nicht übernommen; der Schnittgenerator ist ein kleiner eigener Satz (Cover, Zoom, Spiegel, Quad, Streifen, Textplatte) über den gebackenen Bildern. Keine PDF-Seiten, keine 24 Frames.

## Nicht gefunden / Abweichungen
- **B1/B2a-Billboard-Geometrie, H0- und K2-Golden-Samples** waren im gelesenen Bestand (Pin 6df3410, `_inbox`-Suche) nicht auffindbar. Körper ist neu modelliert nach Georgs Hinweis (50er/60er-Highway-Tafel, Spielzeugknete). Front = +Z, Rückseite = −Z als Konvention. Wenn B2a-Semantik abweicht, nur `LAYOUT` und die Ausrichtung in `billboard-clay.js` anpassen.
- Clay-Material: Shader wortgleich aus `briefd/bench.js` (K2-artig), Fenster für Billboard-Größe 26–70 m statt 9–24 m. Nicht der Materialpfad K1/H0 (Gate 4 bleibt offen).
- Schatten: eine statische Quelle über die ganze Insel (±64 m, 2048, Texel 6 cm) statt dem folgenden ±18-m-Ausschnitt. Bodenanschluss über Sockelhügel in Geländefarbe statt Kontaktfleck.
- Insel: Formeln kopiert, nicht die Bench-Insel geladen (Bench ist ein geschlossenes `boot()`).

## Offen (ein nächstes Gate)
Messlauf im sichtbaren Tab auf dem Zielgerät, dann Bildzeit-Spalte in die Tabelle übernehmen.
