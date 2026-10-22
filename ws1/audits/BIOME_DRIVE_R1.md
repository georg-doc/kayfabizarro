# BIOME_DRIVE_R1 · Endlose Biom-Fahrt mit Wetter, Tageszeiten und Lichtstimmungen · V-619 · WS1b · 22.10.2026

## Kurzstatus (für WS0)
- **Läuft:** `#m1,car,look=terrain3,world=endless` im Spiel. Branch `ws1/biome-drive-r1` (kfb-planet) auf `ws1/mvp-r1` @b863c35, Stand e98c88e+ (5 Commits). Kein Merge.
- **Endlos:** Kacheln um den Wagen, 6 Biome aus dem Seed, Übergänge 30–80 m gesprenkelt (V-403). Keine Nähte (0,001 mm, Normalen ≤ 0,02°), 5 km gerade + 5 km Zickzack mit dem echten Wagen ohne Kollider-Lücke.
- **Tageszeit, Wetter, Stimmungen:** Regler 0–24 h + Zeitraffer, Sonne/Mond, Sterne, Polarlicht; klar, Wolken, Regen (Tropfen auf dem Bildschirm, im Schnee Schnee), Nebel, Wind; weiche Wechsel 20–60 s; 6 Presets je Biom; Ereignis „MIB“. Alles über das EINE Licht-Rig (V-385), keine Extra-Lichter.
- **Farben (Georg 22.10.):** Biom-Farben sind prozedurale, harmonische Cartoon-Farbplatten (`paletteGen`); der Kanon gilt dafür nicht.
- **Leistung:** ≥ 60 fps NICHT belastbar nachgewiesen. Erstes ruhiges Fenster 60/60/60 fps (klar/Regen/Nacht) – damals war der Bewuchs wegen eines Fehlers unsichtbar. Mit Bewuchs 54–58 fps in Slots, in denen andere Sitzungen trotzdem GPU-Last erzeugten (Lastschnitt bis 47). Kandidat für den Rest: Schattenpass (GPU-Messung unter Last: 5 ms ohne, ~30 ms mit Schatten). Nachmessung in einem wirklich ruhigen Fenster nötig.
- **Kritiker CRITIC_3D_R1:** Runde 1 REWORK (Mittel 4,0; Stopp-Regel: Bänder vs. Kanon → durch Georgs Vorgabe zu den Farben aufgelöst), Runde 2 REWORK (Mittel 5,75, kein Kriterium unter 4). Offen v. a. Erdung des Bewuchses, Materialsprache Racer/Terrain, Gruppenbildung.
- **Nach dem MVP (Georg 22.10.: „super wichtige Punkte“):** (1) Bäume und Steine sitzen ohne Übergang auf dem Boden (Erdung/Kontakt fehlt); (2) Racer (Metall mit Rost) und flaches Cartoon-Gelände lesen sich als zwei verschiedene Machweisen; (3) Gras steht als einzelne Halme statt in Büscheln.
- **Offen:** siehe Abschnitt 8.

## 1 · Was gebaut ist
| Teil | Datei | Kern |
|---|---|---|
| Biom-Feld | `src/world/biomeField.js`, `src/data/worlds/kfb-biome-drive.r1.json` | Voronoi-Zellen 460 m aus Seed, Ränder verbogen (70 m), Nachbarn verschieden; Farb-Band 30–80 m (je Grenzstelle anders), Höhen-Band 220 m; Start-Biom Mesa um das Amphitheater. 1 µs je Abfrage. |
| Gelände | `src/world/endlessTerrain.js` | Höhe der Gelände-Probe (`probeHeight`, erzeugt aus der Probe) mit Platz-Anker, Biom-Höhenfaktor. Quadtree 64–512 m, 32×32 Zellen, zeitgeteilt ≤ 2,5 ms je Bild, neuer Satz erst wenn fertig. Kanten an gröbere Nachbarn genäht (Höhe + Normale, auch über Eck). Kollider = gezeigte Dreiecke je 64-m-Kachel (Rapier-Trimesh), Strom im Umkreis 70 m. |
| Biom-Look | `src/look/biomeTerrain.js` | Hängt an terrain3 (Fließfarben der Probe). Je Bildpunkt die zwei stärksten Biome; welche Palette, entscheidet das Sprenkel-Modul (V-403, nur im Band gerechnet). Farbfluss treibt mit dem geteilten Wind (Regler 0–1, Standard 0,35); nahe der Figur gedämpfter Bandkontrast (Kreis 12–28 m, Lead-Variante, keine zweite Rechnung). |
| Farbplatten | `src/look/paletteGen.js` | Familie (Grundton + Harmonie) + Seed → 7 Flächenrollen + Himmel in OKLCH: Helligkeitsleiter als Platten, analoge Bodentöne, Akzent nach Harmonie, nie Neon. 6 Familien; `palgen=0` zeigt die Hand-Paletten, `palseed=n` eine andere Ausprägung, Tafel-Knopf „Neue Farben“. |
| Bewuchs | `src/world/endlessVeg.js` | KayKit Forest (CC0, im Spiel vorhanden) je Biom; weltfeste Lagen je 64-m-Zelle; dünnt im Band aus; 4 BatchedMesh (Bäume, Büsche, Steine, Gras); Farbe aus den Biom-Platten, Textur gibt nur Hell/Dunkel; wiegt im Wind. |
| Wind | `src/world/kfbWind.js` | Vorschlag `kfb.wind/1` (V-605): ein Feld, Böen laufen mit dem Wind, GPU-Sway + CPU-Zwilling. Treibt Bewuchs, Regen, Farbfluss. |
| Atmosphäre | `src/world/driveAtmos.js`, `src/data/looks/kfb-drive-moods.r1.json` | Uhr, Sonnen-/Mondbahn, Kurve je Biom (Morgen, Mittag, Abend, Nacht), Wetter, Presets, Ereignisse. Schreibt nur den `moods`-Satz des Rigs (kfb-stage-light.v1.1 unverändert), Himmel und Host-Nebel. |
| Himmel | `src/modules/sky-drive.js` (erzeugt: `probe/port/gen_sky_drive.py`) | Kuppel der Probe 1:1 (Mond, Sterne, Polarlicht, gemalte Wolken); Generator-Eingriffe: Sterne stufenlos, Wetter-Schritt (bedeckt, Nebel, Blitz). |
| Niederschlag | `src/world/driveWeather.js` | Regen/Schnee in einem Draw Call um die Kamera; gemalte Knet-Tropfen auf dem Bildschirm. |
| Anschluss | `src/world/EndlessDrive.jsx` | M1World nur 4 Zeilen (Import, Gelände/Himmel-Wahl, `adoptRig(RIG)`, `<EndlessDrive>`). Kollider-Strom, Fokus, Ton (kfbAudio: `ambienceContext`, `ambienceLightning`, Cues W01–W06 von WS-Audio), Tafel (Taste L). |

Hash: `hour=0..24`, `tlapse=` (Spielstunden je Sekunde), `weather=klar|wolken|regen|nebel|wind|auto`, `preset=<id>`, `flowwind=0..1`, `palgen=0`, `palseed=n`, `drivepanel=0`.

## 2 · Lichtstimmungen (6 je Biom)
Gemeinsam: Morgentau, Klarer Mittag, Goldene Stunde, Blaue Stunde. Je Biom zwei eigene: Moos „Gewitter-Grün“, „Mondwiese“ · Mesa „Krazy-Kat-Abend“, „Staubsturm“ · Wüste „Hitzeflimmern“, „Sternenwüste“ · Schnee „Polarlicht“, „Schneetreiben“ · Pastell „Zuckerwatte-Morgen“, „Regenbogen-Schauer“ · Canyon „Violetter Tisch“, „Gewitter-Grün“. Ereignis `mib`: Rig verdunkelt (Sonne × 0,4), Tönung, Ein-/Ausblenden 2,5/4 s. Steuerung: Tafel (L), `atmos.applyPreset(id)`, `atmos.event('mib', on)`.

## 3 · Prüfbilder
- Kontaktbogen 6 Biome × 4 Tageszeiten aus der Spielkamera: `biome-drive-r1/sheet.png` (generierte Farbplatten) und `sheet-hand.png` (erste Runde, Hand-Paletten).
- Farbplatten 6 Familien × 6 Seeds: `biome-drive-r1/palettes.png`.
- 60-s-Fahrclip mit Ton (Spielkamera, v3 mit generierten Farbplatten und Bewuchs; Biome Schnee → Canyon → Mesa → Moos → Canyon → Schnee, Wetter klar → Regen ab 16 s über 22 s, Uhr 16:12 → 17:12): bleibt lokal (`test/out/biome-drive/clip.webm`, private Töne), Standbilder `biome-drive-r1/clip-stills.jpg`.

## 4 · fps-Tabelle (Georgs Mac, Chromium headless mit Metal-GPU, 1280×800, dpr 1)
| Lauf | Bedingung | fps | p50 ms | p95 ms | > 20 ms | Bau-Scheibe max |
|---|---|---|---|---|---|---|
| Fahrt klar, Mittag, 25 s (Bewuchs unsichtbar, Fehler) | ruhiges Fenster 00:16 | 60 | 16,7 | 16,7 | 0 | 3,4 ms |
| Fahrt Regen, 16 Uhr, 15 s (dto.) | ruhiges Fenster | 60 | 16,7 | 16,8 | 0 | 2,7 ms |
| Fahrt Nacht, 23 Uhr, 10 s (dto.) | ruhiges Fenster | 60 | 16,7 | 16,7 | 0 | 2,9 ms |
| Clip v2 60 s mit Ton (vite-Dev, dto.) | ruhiges Fenster | 59,7 | 16,7 | 16,8 | – | – |
| Fahrt klar / Regen / Nacht (mit Bewuchs, Platten v1) | Slot 01:25, Last 4–9 | 57,7 / 54,6 / 38 | 16,7 / 16,7 / 33,3 | 16,8 / 33,3 / 33,4 | 55 / 79 / 197 | 4,4 ms |
| Fahrt klar / Regen / Nacht (Endstand) | Slot 01:41, Last 4 → 47 während des Laufs | 54,3 / 58,4 / 58,3 | 16,7 | 33,3 / 16,8 / 16,8 | 138 / 23 / 16 | 4,7 ms |
| Clip v3 60 s (vite-Dev, Ton) | derselbe Slot | 52,9 | – | 33,3 | – | – |
| 5 km gerade / 5 km Zickzack | Fremdlast (Lastschnitt 16–30) | 51,9 / 52,2 | 16,7 | 33,4 | 14 % | – |
CPU-Kosten des Renderns 1,9–2,7 ms je Bild (Probe-Welt 1,9 ms); eigener Takt (Fahrt-Logik) ≤ 0,3 ms p95, Kollider-Bau ≤ 4,5 ms selten.
Befund unterwegs: Die Bewuchs-Bündel mit Einzelauslese luden jedes Bild eine Textur hoch → 16/33-ms-Wechsel; ohne Einzelauslese ruhig (Dreiecke trotzdem < 0,9 Mio).

## 5 · Tests
| Test | Ergebnis |
|---|---|
| `test/unit/endlessSeams.mjs` (Node): 5 km gerade + 5 km Zickzack, Kanten aller Kacheln | PASS · max Höhensprung 0,001 mm, Normalen 0,023°, 0 Lücken, 0 Überlappungen, Ecken exakt |
| `test/unit/paletteGen.mjs`: 6 Familien × 50 Seeds | PASS · deterministisch, kleinster Plattenabstand ΔE 0,056, ΔL 0,031, Chroma ≤ 0,18 |
| `test/biomeDriveKm.mjs` (Browser, echter Wagen): 5 km gerade + 5 km Zickzack | PASS · Bodenabstand ≥ 0,25 m, 733 Kollider-Strahlen ohne Lücke, Bodensprung ≤ 0,39 m (Hangkante im Zickzack) |
| `test/biomeDrive.mjs` (Browser): Kontaktbogen, ein Rig, Sonne/Mond, Wetter weich, Regen + Tropfen, Nebel, 6 Presets, MIB, fps, Bodenkontakt, Shader-Fehler | PASS bis auf fps (alle anderen Prüfungen grün; „Mond nachts“ nach dem Aufhellen der Nacht auf < 1,0 statt < 0,6 gesetzt) |
| `test/biomeDriveClip.mjs` (vite lokal): Clip mit Ton | Clip v3: 60 s, Ton durchgehend (RMS ≈ −27 dB), Atmo-Kontext kommt an (forest/evening/snow/Wind 0,55 am Ende) |
Licht-Prüfung: Szene hat genau 1 Richtungslicht, 1 Hemisphäre, 1 Spot (Figurenlicht des Rigs), 0 Punkt-/Umgebungslichter.

## 6 · Ton
Nur über kfbAudio (WS-Audio b863c35): `ambienceContext({ biome, weather, wind, timeOfDay })` mit Vorrang (Zuordnung von WS-Audio: moos→meadow, mesa/wüste/canyon→beach, schnee→forest + snow, pastell→pond), `ambienceLightning` für Blitz-Donner, W04 beim Übergang trocken → Regen, W01–W03 als leise Tageszeit-Schichten, W06 nur als Ersatz ohne Atmo-Regen. Clip-Pegel durchgehend hörbar (RMS ≈ −26 dB).

## 7 · Kritiker CRITIC_3D_R1 (blind)
**Runde 1** (Hand-Paletten, Bewuchs fehlte im Clip): REWORK, Mittel 4,0 (K7 = 3 → Stopp-Regel). Kern: Fließfarben-Bänder widersprechen Kanon V-570; Farben ohne Rolle; Bewuchs fehlt; Nacht schwarz. Volltext: `biome-drive-r1/CRITIC_R1_runde1.md`.
**Georg 22.10.:** Für die Biom-Farben gilt der Kanon nicht – harmonische, prozedural erzeugte Cartoon-Farbplatten. → `paletteGen`, Bewuchs in den Platten, Nacht heller, Fehler behoben.
**Runde 2** (generierte Platten, Bewuchs sichtbar): REWORK, Mittel 5,75 (K1 7, K2 6, K3 6, K4 5, K5 6, K6 5, K7 5, K9 6; kein Kriterium unter 4). Volltext: `biome-drive-r1/CRITIC_R1_runde2.md`.
Nach Runde 2 schon umgesetzt: Canyon violett statt lachs, Schnee hellblau statt graugrün, mehr Varianz je Seed, Mesa/Wüste getrennt, Nacht neutraler (Biome nachts unterscheidbar – siehe neuer Kontaktbogen), Bänder nahe der Figur ruhiger.
Offen aus Runde 2 (nicht Farbe): Erdung des Bewuchses (keine Kontakt-Geometrie), zwei Materialsprachen (Racer PBR vs. Toon-Gelände), Gras als Einzelhalme statt Büschel, Bäume ohne Gruppen 1:3:Rest, Silhouetten-/Diagnosepässe fehlen, Schnee-Biom zeigt im Clip am Ende noch Regen (Wechsel folgt dem Biom am Wagen).

## 8 · Offen / Vorschläge
**Nach dem MVP, von Georg priorisiert (22.10.):**
1. Erdung des Bewuchses: Bäume und Steine sitzen ohne Übergang auf dem Boden.
2. Eine Machweise: Racer (Metall mit Rost) und flaches Cartoon-Gelände wirken wie zwei verschiedene Machweisen.
3. Gras in Büscheln statt einzelner Halme.

Weitere offene Punkte:
- Wasser (Meer/Flüsse) fehlt in der endlosen Welt (Hydro der Probe rechnet auf fester Fläche) → Backlog V-621 / WS1c.
- Schatten-Auslese des Bewuchses: zurzeit werfen alle Bewuchs-Teile im Bündel Schatten (Kosten klein, aber messbar); Einzelauslese nur ohne Texturupload.
- „Nahe der Figur ruhiger“: Bandkontrast im Kreis 12–28 m um die Figur gedämpft (Farbe zur Plattenmitte, 35 %); Georg urteilt am Bild.
- Leistung: Schattenpass prüfen (VSM-Weichzeichnen, Bewuchs-Werfer ohne Einzelauslese), dann Nachmessung im ruhigen Fenster.
- Scheinwerfer (WS1d, ws1/vehicles-r1): Haken HEADLIGHTS.daylight/dark bei world=endless setzen, sobald der Lead es einführt.
- Wind-Modul `kfbWind.js` ist ein Vorschlag für V-605 (Besitz WS1-Lead).
- Keine neuen Assets (KayKit Forest ist schon im Spiel).
