# Einarbeitung WS1-Recherchen R12 + R13 in den 3D-Kanon · R2 · 2026-10-20 · Vorlage für WS0

**Status: VERBINDLICH als Kanon-Anhang B (V-575, WS0 20.10.).** Es gelten Ü31–Ü47, die Gate-Werte, die Widersprüche W14–W25 und die Nicht-Übernahmen.

**WS0-Abweichungen:**
- **W23 TinySkies:** Georg nutzt TinySkies seit V-092/V-093/V-096 bewusst. WS0 meldet die Lizenzlage einmal an Georg und blockiert nicht. Eigenbau nur, wenn Georg das will.
- **Abschnitt 2 Steinwerte:** Der Kommentar-Bug ist behoben (SINK stone_L/M/S wieder aktiv, Regressionstest ergänzt).
- **`sky_plan` und die übrigen Felder in Abschnitt 4:** Pflicht ab Konzeptblatt-Runde R2.

**Status:** Vorschlag an WS0, noch nicht verbindlich. Mit V-Nummer wird er Kanon-Anhang B. Anhang A (`EINARBEITUNG_WS1_R1.md`, Ü1–Ü30) gilt unverändert und wird hier nicht wiederholt.

**Quellen** (`S/WS1_…`):
- **R12:** Abgleich von Georgs „cartoon animation.md“; die Zahlen dort sind unbelegt.
- **R13:** Himmel, Horizont, Ferne (H1–H23, P1–P11, F1–F8).

**Anlass:** der Nebelbalken am Horizont, den Georg in der Probe gefunden hat. Ursachen nach R13 Teil 0:
- ein einziger Nebelton;
- die Kuppel ist unter dem Horizont konstant;
- der Nebel ist schon vor der Geländekante voll.

**Zeichen** wie in Anhang A: [S] Startwert, [I] Invariante, TUNE.

**Werkzeug:**
- Bildtests gehen in `kfb_view` (WS1 W5; das Modul ist noch nicht im Hub).
- Datentests gehen in `kfb_env` (§2).

## 1 · Übernehmen

| # | Geb. | Kanon-Wortlaut (Vorschlag) | Quelle | Prüfung |
|---|---|---|---|---|
| Ü31 | 18 (16 (4) präzisiert) | **Ebene 0 = Ferne:** Himmel, Kulissen und Horizont liegen hinter den drei Tiefenebenen. Die Ferne hat den niedrigsten Detailgrad und trägt keinen Fokus und keinen Akzent; einzige Ausnahme ist Ü40. | R12-B5 | K0 (`sky_plan`); K3 |
| Ü32 | 18 | **Der Himmel ist ein Farbsatz je Stimmung, keine Physik.** Er hat 6 Farben: Zenit, Mitte, Horizont, Bodendunst, Sonne, Gegenseite. Stopps bei 0/3/12/35/90° [S], alle Übergänge mit `smoothstep`. Vertikal fällt ΔL\* über die Kuppel um 15–30 [S]. Am Horizont ist die Sonnenseite ≥ 5 L\* heller als die Gegenseite [S]. Die hellste Linie ist der Horizont-Halo (±2–3°). Stimmungswechsel überblenden den ganzen Satz (V-101). | H1, H2, H4 | View P2, P4 |
| Ü33 | 6/18 | Neue Rolle **`horizon`** neben `sky`. Tag: C ≥ 0,05, Farbton ≥ 20° gegen den Zenit, zur warmen Seite [S, TUNE]. `sky` bleibt V-305; Chroma ≤ 0,195 gilt weiter. | H3, F6 | View P6 |
| Ü34 | 18 | **[I] Unter dem Horizont liegt nie eine konstante Fläche.** Bodendunst von 0° bis −10°: ΔL\* −4…−8, C +0,01…0,02, Farbton 10–30° zum Bodenton [S]. Am Horizont stetig [I]. | H5 | View P1, P2 |
| Ü35 | 18 | **[I] Die Luft hat die Himmelsfarbe in Blickrichtung.** Eine Funktion `skyColor(dir)` mit einem Uniform-Satz gilt für Kuppel, Terrain, Wasser, Kulissen und Wolken; es gibt keine eigene Nebelfarbe. **[I]** An der Geländekante ist f ≥ 0,98. ΔE zwischen Kante und Himmel ≤ 0,01. Balken ≤ 0,5° (10 px@1080) in jeder Kamera, Höhe und Überblendung [S]. | H6, H13 | View P1, P3, P7, P8; Gate Y1 |
| Ü36 | 7/18 | **Distanzluft exponentiell:** `f = 1 − exp(−d·ln2/d50)`. Sie wirkt erst hinter dem Mittelgrund: d50 ≥ 2 × Spielfeldradius [S, WS0]. Die Wertmassen aus Ü26 halten auch mit Luft. Einziger Schreiber ist das Stimmungsmodul (V-132). | H7 | Gate Y2; View |
| Ü37 | 18 | **Kulissen:** 2–3 weltfeste Silhouettenringe, nie am Bildschirm fixiert. Mischung zum Himmel k = 0,45/0,65/0,82; Oberkante +5/+3/+1,5°; Nachbarn ≥ 5 L\* auseinander [S]. Ruhige Oberkante, ≤ 3 Werte, ≤ ¼ Detailfrequenz [S]. Unten laufen sie in den Dunst aus. Farbe aus `cliff`/`mid`, also Material der Ferne. Am Tag nie heller als der Himmel darüber. Der äußerste Ring darf ein prozeduraler Zylinder sein. | H10, H12, H14, H15, F4 | View P5; Gate Y3 |
| Ü38 | 11 präzisiert | **Wolken = opake Knete** mit Stufenlicht aus dem einen Rig. Eine Masse mit Lappen (V-499), flache Basis, gewölbte Kuppe; die Lappen werden nach außen kleiner und flacher. 4 Töne, der Himmel ist einer davon; Licht/Schatten ΔL\* 10–18 [S]. Schichten: gemalt hoch auf der Kuppel; mittel aus Knet-Geometrie, ≤ 2 Massen; Horizontbank als Kulissenring. Parallaxe 1 : 0,5 : 0,2, Wolken ≤ 35 % des Himmels [S]. | H16–H18, F3 | View P10; VFX-Liste; K6 |
| Ü39 | 7/18 | **Sonne:** Scheibe + Hof + Horizont-Halo im Farbsatz. **[I]** Sonne bzw. Mond auf der Kuppel stehen in Key-Richtung des einen Rigs (±5° [S]). | H19 | Gate Y4 |
| Ü40 | 18 | **Surreale Himmelskörper** (V-132). Je Himmelshälfte höchstens 1 großes Signatur-Element, zusammen ≤ 15 % des Bildes. Größen: Riesenkörper 10–25°, Schwebendes ≥ 2°, Inseln ≥ 3° [S]. Die unteren 20–35 % stehen im Dunst. Der Randton kommt aus der Luftmischung, nie aus Rim-Licht (V-392). Knete, weltfest, Verhalten nur mit Ursache in `story`. Knet-Mond (A) und Kulissen-Inseln (B) sind beide zulässig. | H21, F5 | View P10; K7 |
| Ü41 | 14/18 | **Horizont-Pass:** Übersicht aus 50/200/600 m, 4 Kritiker-Kameras und Fahrkamera, je Tag, Gold und Nacht, in 8 Richtungen. Schnelltest: Bild auf 25 % verkleinern und um 90° drehen; ein einfarbiger Streifen ist FAIL. Den Blindtest (P11) macht der Kritiker, nicht Georg. | P1–P11 | CRITIC Kamera 10; K3, K6 |
| Ü42 | 2/3 | **Landmark-Pass** je Landmarke: Funktion, Sichtbarkeit, Silhouette, Material, Farbrolle, Geschichte, ≥ 2 Spuren, Bewegung. `landmark_type` bleibt bei Georg. | R12-B4 | Gate M6; K7 |
| Ü43 | 16 (5) präzisiert | Neue Felder im Farb-Skript: **Wertverlauf** und **Lichtquelle**. Die Lichtquelle ist die Stimmung des Rigs plus benannte Praktikals, kein Zusatzlicht. | R12-A | K0 |
| Ü44 | 14 präzisiert (Ü17) | **Golden Frames:** Der Farbkey aus Ü17 besteht aus drei Bildern (weit, mittel, nah) aus den Kritiker-Kameras 1–3, vor dem Bau. | R12-B8 | K0; K2 |
| Ü45 | 8 präzisiert (Ü23) | Jedes Knet-Profil hat eine Rolle. Haben zwei Profile dieselbe Rolle, fällt eines weg. | R12-B3 (Teil) | K6 |
| Ü46 | 1 | **Das Vertraute trägt das Surreale:** überwiegend vertraute Funktionsformen; Verdrehung und Signatur sind in der Minderheit (Richtwert 60/25/15). Bis Georg entscheidet (R12 E3), ist das nur eine Kritikerfrage. | R12-B2 | K1, K9 |
| Ü47 | 2/3 | **Prop-Budget:** 1 Hero, 2–3 Story, 3–5 Funktion, 5–8 Atmosphäre [S, TUNE, unbelegt]. | R12-B7 | Gate S9 (Befund) |

## 2 · Gate-Werte

| Schlüssel | alt → neu | Grund |
|---|---|---|
| **Fehler `SINK['stone_L/M/S']`** | Seit V-571 stehen die Einträge im Kommentar von Zeile 23 und fehlen deshalb im Dict. Steine werden nur gegen `SINK_CAP` geprüft. → Wiederherstellen (0,40–0,50 / 0,35–0,50 / 0,30–0,40), dazu ein Test in `test_kfb_env.py`. | Regression V-570 |
| `CONCEPT_FIELDS` | Die Felder aus Anhang A §5 fehlen noch. → `value_plan`, `surface_plan`, `cameras` und `sky_plan` ab Konzeptblatt R2. | Anhang A §5 |
| `SKY` neu | alle [S] außer `edge_fog` [I] | Ü32–Ü40 |

```python
SKY = dict(stops_deg=(0, 3, 12, 35, 90), haze_dL=(-8, -4), zen_hz_dL=(15, 30), sun_anti_dL=5, horizon_C=0.05,
           hue_shift=20, edge_fog=0.98, edge_dE=0.01, bar_deg=0.5, d50_min_R=2.0, backdrop_k=(0.45, 0.65, 0.82),
           backdrop_deg=(5, 3, 1.5), backdrop_n=(2, 3), cloud_masses=2, cloud_share=0.35, sig_share=0.15,
           float_deg=2.0, body_deg=(10, 25), sun_key_tol=5)
sp = (scene.get('concept') or {}).get('sky_plan')
if sp:  # Y1: 1 − 2^(−R/d50) ≥ 0,98 ⇔ R_edge ≥ log2(50)·d50 ≈ 5,64·d50, sonst Kanten-Rampe
    if not sp.get('edge_ramp') and sp['edge_r'] < math.log2(50) * sp['d50']: F('Y1', 'Kante nicht voll vernebelt')
    if sp['d50'] < SKY['d50_min_R'] * sp['play_r']: find.append('Y2 Luft im Spielfeld (TUNE)')
    if not 2 <= len(sp.get('backdrops', [])) <= 3: find.append('Y3 Kulissenringe ≠ 2–3')
    if abs((sp['sun_az'] - sp['key_az'] + 180) % 360 - 180) > SKY['sun_key_tol']: F('Y4', 'Sonne ≠ Key-Richtung')
```

## 3 · Widersprüche (Georg und Register gelten)

| # | Konflikt | Empfehlung |
|---|---|---|
| W14 | Tiefen- und Höhennebel (H7/H8, F1) ↔ ein Tonweg (V-385); Anhang A W9 (Nebel nur am Horizont); V-444 (Georg will Distanznebel zum Skydome) | Distanzluft nur als Übergang zur Ferne (Ü36). Höhennebel nur an den Kulissen. Talnebel im Spielfeld erst nach A/B vor Georg. |
| W15 | V-444 „kein Shader-Trick“ ↔ `skyColor` in allen Materialien | Die gemeinsame Funktion ist die saubere Lösung. Verboten bleiben Kaschierungen (Nebelband, Sprite) und Bildschirm-Effekte (Kanon 12 [I]). |
| W16 | Farbige Distanzrampe (H9, F2) ↔ Gebiet 6 „Harmonie über das Material, nie über das Licht“ | Kulissentöne aus den Zonenrollen zählen als Material. Eine Luftrampe auf dem Gelände nur nach A/B vor Georg. |
| W17 | Kuppel und Kulissen unbeleuchtet ↔ Gebiet 7 „alles empfängt vom einen Key“ | Die Ferne ist Himmels-Material, kein Akteur, und braucht keinen Schatten. Die Stimmung kommt aus dem Farbsatz des Rigs (Ü39). |
| W18 | Ü27: Himmelsspanne ≤ 15 L\* ↔ H1: 15–30 | Ü27 misst im Bild, Ü32 über die ganze Kuppel. Beide gelten. |
| W19 | Wolken aus Kugeln (tinyskies) ↔ V-499 „nie Kugelstapel“ | Nur die Silhouettenlogik übernehmen, gebaut wird eine Masse mit Lappen. |
| W20 | Drei Wolkenschichten ↔ ≤ 2 Massen (Ü27) | Die Bank zählt als Kulisse, die hohen Wolken als Kuppelbild. ≤ 2 Massen gilt für die Mittelschicht. |
| W21 | Gemalte Sonnenstrahlen (H20) ↔ V-564, Anhang A W4, V-385 (keine Tricks) | Nicht übernehmen. |
| W22 | Karton und Candy-Glanz (R12-B3) ↔ Gebiet 8 (ein Knet-Modul, kein CGI-Glanz) | Gebiet 8 bleibt. Ein Profil `paper` nur nach Georgs Ja (R12 E1). |
| W23 | tinyskies hat keine Lizenz ↔ V-092 „SKY3 vendored“ | WS0 prüft die Herkunft von SKY3; stammt es von dort, folgt ein Eigenbau. Erlaubt sind nur Ideen; kein Rim und kein Lens-Flare (W1). |
| W24 | Horizont-Chroma ≥ 0,05 ↔ V-565 (keine Farbsperre) | Nur TUNE, nie FAIL. Hart bleibt „kein Mittelgrau“. |
| W25 | RA 1:1, Kit as-is (V-573/574) | Ein RA-Himmel bleibt 1:1. Kit-Inseln und Kulissen werden nicht gestaucht. |

## 4 · Konzeptblatt

| Feld | Änderung |
|---|---|
| `sky_plan` (neu, Pflicht ab R2) | Farbsatz je Stimmung; `sun_az` = `key_az`; `d50`, `edge_r`, `play_r`, `edge_ramp`; Kulissen (Radius, k, Rolle); Wolkenschichten; Signatur-Himmelskörper mit Ursache; Himmelsanteil je Kamera |
| `palette_roles` | + `horizon`, `ground_haze`, `sun`, `anti` |
| `color_script` | + `value_arc`, `light_source` (Ü43) |
| `color_key` | drei Golden Frames (Ü44) |
| `landmark_pass` (neu) | je Landmarke (Ü42) |
| `space` | Ebene 0 (Ü31) |
| `prop_budget` | optional (Ü47) |
| `comedy_contract` | empfohlen; Pflicht erst nach Georgs Ja (R12 E2) |

## 5 · Nicht übernehmen

| Punkt | Grund |
|---|---|
| H11: mehr Luft auf Schattenseiten | zweite Lichtantwort (Kanon 7) |
| H20: gemalte Strahlen | W21 |
| H22: Musterhimmel | Georg-Entscheid; Farbversatz ist schon in Anhang A abgelehnt |
| H23: Bildschirm-Himmel | Kanon 12 [I] |
| Preetham-Himmel, Atmosphäre, volumetrische Wolken | V-381 |
| aus tinyskies: Code, Assets, Glaswolken, linearer Nebel, Rim, Flare | Lizenz, V-499, Ü35, V-392 |
| Talnebel im Spielfeld | W14 |
| R12-B6: Biom-Blatt | durch `form_dna`, `color_script` und `material_codes` abgedeckt (V-411) |
| R12-B3: Karton/Candy | W22 |
| R12: neue Begriffe „World Rig“ usw. | Die Regel steht schon in den Gebieten 7 und 12. |
| R13 F7/F8: PDFs | erst als R13 R2, falls P1–P10 an der Probe nicht reichen |

**Pflege:** R12 und R13 fehlen in `S/MANIFEST.tsv`, R13 fehlt im `RESEARCH_BACKLOG_R1.md`.

## 6 · Kanon-Gebiet

**Empfehlung: neues Gebiet 18.** Das Thema hat einen eigenen Baustein (`skyColor`), eigene Tests (P, Y) und einen eigenen Fehlertyp (Balken). Verteilt auf die Gebiete 5, 6, 7, 11, 12 und 16 hätte es keinen Besitzer (V-411). Die Gebiete 6, 7, 11 und 16 (4) bekommen je eine Verweiszeile.

**Zeile, nach Gebiet 17 einzufügen:**

| 18 | **Himmel, Horizont, Ferne** (Ebene 0 hinter den Tiefenebenen von Gebiet 16; Georgs Befund „Nebelbalken“ 20.10.) | `S/WS1_R13_HIMMEL_HORIZONT_FERNE_R1.md`; `S/WS1_R12_…` §B5; Anhang B Ü31–Ü41; V-101, V-132, V-305, V-381, V-444 | Himmel = Farbsatz je Stimmung: 6 Farben, zwei Verläufe, der Horizont als hellste Linie, Rolle `horizon` farbig. **[I]** Unter dem Horizont nie eine konstante Fläche, sondern Bodendunst. **[I]** Luft = `skyColor(dir)` für Kuppel, Terrain, Wasser, Kulissen und Wolken; an der Kante f ≥ 0,98, kein Balken. Distanzluft erst hinter dem Mittelgrund. 2–3 weltfeste Kulissenringe. Wolken aus Knete (Gebiet 11), ≤ 2 Massen. **[I]** Die Sonne steht in Key-Richtung. ≤ 1 Signatur-Himmelskörper je Hälfte, ≤ 15 %. Nie: Bildschirm-Himmel, gemalte Strahlen, physikalischer Himmel. Ein RA-Himmel bleibt 1:1. | `kfb_env` Y1–Y4, K0; `kfb_view` P1–P10 | K3, K6, K7 + Horizont-Pass |
