# DESIGN_SPEC_T4 · Knet-Strecke T4 · Übergangsatlas + Clay-VFX · 2026-09-28

Basis: T3 v2 / K2 (`track-look.v4.js`, `clay-material.v10.js`, `clay-relief.v4.js`, `clay-toolmix.v1.js`), Route TD03 unverändert.
Neu und additiv: `lab-track/track-look.v5.js`, `lab-track/transition-atlas.v1.js`, `lab-track/transition-profiles.v1.json`, `lab-vfx/clay-vfx.v1.js`, `lab-vfx/clay-particle-profiles.v1.json`.
Einstieg: `KFB Knet-Strecke T4.dc.html`. Prüfoptionen hinter dem Schalter oben links, standardmäßig zu.

## 1 · Eine Szene, vier Zonen auf TD03

Keine neue Route. Die Zonen liegen dort, wo TD03 ohnehin den Charakter wechselt.

| Zone | Familie | s (m) | Länge | Seiten | Anker in TD03 |
|---|---|---|---|---|---|
| ZC | C · Stadt → Strecke (Parkdeck) | 560–650 | 90 | beide | `atrium_up` (Skin street → track bei s 605) |
| ZB | B · Strecke → Natur | 1195–1285 | 90 | links | `east_run` |
| ZN | C · Natur → Strecke | 1300–1395 | 95 | links | `turn_east` → `std_jump` (Beschleunigung zum Kicker) |
| ZA | A · Strecke → Stadt | 1470–1570 | 100 | beide | `landing` → `street_out` |

Regionen dazwischen ergeben sich aus den Zonen: 0–560 Stadt (Start-Straße, Parkhaus-Spirale), 650–1195 Strecke, 1285–1300 Wiese, 1395–1470 Strecke (Kicker, Luft), ab 1570 Stadt.

Warum Natur nur links: rechts neben `east_run` liegt TD03 selbst in 23–49 m Abstand auf 15 m Höhe. Eine Böschung rechts würde die Nachbarbahn verschlucken. Links ist bis zum Tischrand frei.

## 2 · Layer-Fenster (u = 0…1 in Fahrtrichtung)

Wert w = Anteil des Nicht-Track-Bioms. `sideLag` versetzt links und rechts um ± lag/2, damit auch quer keine Linie umschaltet.

| Layer | A Track→Stadt | B Track→Natur | C Natur→Track | C Parkdeck→Track |
|---|---|---|---|---|
| road | 0.05–0.72 | 0.12–0.70 | 0.20–0.75 | 0.25–0.80 |
| mark_track (Randsegmente) | 0.10–0.55 weg | 0.10–0.60 weg | 0.55–1.00 zurück | 0.50–1.00 zurück |
| mark_city (Mitte, Ränder) | 0.45–0.82 an | – | – | 0.05–0.45 weg |
| barrier | 0.00–0.55 | 0.00–0.50 | 0.25–0.80 | 0.30–0.70 (Boden 0) |
| curb | 0.28–1.00 | – | – | 0.00–0.40 (Boden 0) |
| sidewalk | 0.40–1.00 | – | – | – |
| props | 0.55–1.00 | 0.60–1.00 | 0.00–0.30 | – |
| embank | – | 0.08–0.62 | 0.30–0.85 | – |
| ditch | – | 0.35–0.80 | 0.10–0.50 | – |
| fence | – | 0.50–0.95 | 0.00–0.40 | – |
| nature | – | 0.35–1.00 | 0.00–0.55 | – |
| light | 0.30–0.90 | 0.30–0.90 | 0.10–0.70 | 0.20–0.80 |
| vfx | 0.35–0.75 | 0.30–0.70 | 0.30–0.70 | 0.30–0.70 |

Die Rückkehr C ist keine gespiegelte B: Zaun, Wiese und Graben gehen früh, die Böschung sinkt erst ab u 0,3, der Strang wächst ab 0,25, die Randsegmente kommen zuletzt (ab 0,55) vor dem Kicker.

## 3 · Wie jeder Layer wechselt (kein Alpha, keine Querlinie)

- **Fahrbahn:** der bestehende Fleckenshader von T3 (Straße ↔ Bahn) bekommt eine dritte Farbe für den Naturweg (`uRoadC`, `aBio`). Das Skinfeld kommt aus dem Vertrag statt aus der 24-m-Fuge. Fahrfläche, Querschnitt und Kontakt unverändert; Fahrbahn bleibt `legacy 1`.
- **Markierungen:** Knetsegmente (gerundete Riegel 0,30 m breit, 0,14 m hoch). Rhythmus aus TD03: Strecke 2,3 m Teilung, Stadt 3 m / 3 m Mitte, Ränder 3,3 m. Beim Wechsel werden Stücke kürzer (bis −62 %), flacher, versetzen sich seitlich und tauchen in die Fahrbahn ab. Jedes Stück hat seinen eigenen Schwellwert (Seed), dadurch reißt die Reihe unregelmäßig.
- **Strang/Bande:** der T3-Querschnitt liest `barrierT`. Stadt: Wulsthöhe 1,35 → 0,32 m, Wulst rückt an die Fahrbahnkante, nur wo die Fahrbahn unter 1,2–4 m Höhe liegt (Parkhaus-Spirale bleibt Absturzkante). Natur: niedriger (0,5 m) und 1,9× breiter. Farbe wandert über Knetflecken zur Bordstein- bzw. Wiesenfarbe (`patchify`, derselbe Fleckentyp wie auf der Fahrbahn).
- **Bordstein:** gequetschte Knetsteine 0,9 × 0,36 × 0,56 m auf dem abgesenkten Wulst, erst vereinzelt (Seed < w^0,8), wachsen aus dem Strang (Höhe 45 % → 100 %).
- **Stadtsockel + Gehweg:** Sockelband breitet sich mit dem Gehweg-Fenster von 1,6 m auf 35 m aus, Kante organisch. Platten 1,6 × 1,95 m in drei Reihen, straßennahe Reihe zuerst.
- **Häuser:** KayKit City Builder Bits `building_A…H`, Maß 4,1 wie `city-assets.js`, Höhe je Rhythmus 0,92–1,38, Biegung ± 6 %, Drehung ± 5° über die Höhe, Front zur Straße. Nur wo die Route am Boden liegt und ≥ D/2 + 13 m Freiraum zu anderen TD03-Teilen ist. Zwei Plätze schließen die Blickachse an Start und Ende.
- **Stadtmöbel:** KayKit `streetlight` (× 5,95), `firehydrant` (× 3,49), Tiny Treats Pretty Park `bench`, `trashcan` (× 1,6), `tree_large` (× 1,9). Raster 10,5 m: Laterne und Baum im Wechsel, Bank + Mülleimer jede vierte Stelle, Hydrant jede sechste.
- **Böschung:** Knetrücken links, wächst vom Tisch (−1,8 m) bis 0,3 m unter die Fahrbahn. Querschnitt: Wulstfuß, Schulter 5,2 m, Graben 1,1 m tief, Zaunsockel +0,5 m, Wiese 10 m, gewölbter Hang (1,35 × Höhe + 5 m). Hang flickt über Knetflecken in die Hügelfarbe der Welt.
- **Zaun:** Tiny Treats Homely House `fence_straight_long` / `fence_post`, Maß 1,5, Teilung 3,0 m (Pfosten überlappen wie im Pack gemessen). Erst Sockel, dann nur Pfosten, dann Felder. Steht 9 m hinter der Asphaltkante.
- **Dreiergruppen:** Baum (Anker) · zwei Büsche · Fels aus den T3-Formen, Teilung 12 m, jede dritte Stelle bleibt Sichtachse.
- **Licht:** Hemisphäre und Sonne mischen je Fenster zwischen `track`, `city`, `nature` (Werte in `transition-profiles.v1.json → light`). In der Fahrt folgt es dem gelben Kart, in festen Ansichten der Zone.

## 4 · Biom-/Seed-Vertrag

Ein Zonen-Seed (20260928) speist getrennt: Track-/Randpalette (`worldPresets.*.city/markTrack`), Terrain-/Vegetationspalette (`worldPresets.*.nature`), K2-Klassenmischung (Bordstein/Gehweg = `rock`, Sockel/Böschung = `terrain`, Häuser = `house`, Zaun = `trunk`, Bäume = `nature`), Licht (`light`), VFX-Profil (`vfx`-Fenster + `trackBiome` je Welt). Welten A Canyon · B Bikini-Bucht · C O-Town schalten alle Rollen zusammen um, ohne neue Architektur.

## 5 · K2-Materialvertrag eingehalten

- Keine neue Mischung. Neue Massen bekommen vorhandene Klassen (`rock`, `terrain`, `house`, `trunk`, `nature`), `legacy 0`.
- Markierungen wie die Boost-Platten: `legacy 1`, keine Werkzeuge (sie liegen auf der Fahrbahn, deren Profil bewusst unberührt bleibt).
- Kein Spachtel-Querraster, keine Macro-Maserung zusätzlich, keine Rückkehr zu v8.

## 6 · Clay-VFX

- Formen: Kugel (Ikosaeder, 80 Dreiecke) · gestauchter Tropfen · kurzer Span. Anteile je Profil 55–75 / 15–30 / 5–15 %.
- Ein `InstancedMesh` je Form, Pool 200, keine Objektanlage pro Frame, keine Schatten. Material: MeshStandard + ein Dellen-Rauschterm per Ableitung, nicht der K2-Werkzeugpfad.
- Verhalten: Fliegen → Abprallen (Stufe) → Kleben (flachgedrückt) oder Ausrollen (nur HIGH) → Schrumpfen im letzten Drittel. Kein Ausblenden.
- 6 Ereignisse × 4 Biome = 24 Profile in `clay-particle-profiles.v1.json` mit allen Pflichtfeldern der Grammatik.
- Qualität: LOW 60 · MEDIUM 120 · HIGH 200 gleichzeitig; LOW nur Kugel + Tropfen, Lebensdauer × 0,7, ein Abpraller, Sichtweite 90 m.
- Ereignisquelle heute: `makeKartDriver` liest Kart-Position, Krümmung, Boost-Platten, Landepunkt und Zonen-Mitten. In M2 ersetzt der Racer diese Quelle durch echte Kontakte; das Modul bleibt Leser.
- Probenbrett auf dem Tisch: von links Rollen · Drift · Streifen · Landung · Boost · Biomwechsel, von vorn Stadt · Wiese · Canyon · Küste. Gelber Knubbel = Emitter-Stellvertreter.

## 7 · Kameras

`totale`, `fahrtNatur` (Mitfahrt durch ZB/ZN), `fahrtStadt` (Kicker, Landung, ZA), `natur`, `rueck`, `stadt`, `fuss` (1,9 m über dem Gehweg), `quellen`, `atlas`, `vfx_<ereignis>`, dazu alle T3-Ansichten unverändert.

## 8 · Nicht in T4

Boxengasse, Auf-/Abfahrten, Trackrand-Billboards (Brief D1/B5). Die Vertragsnamen `pit_in/pit_out` und das Fenster `pit` stehen reserviert im Profil.
