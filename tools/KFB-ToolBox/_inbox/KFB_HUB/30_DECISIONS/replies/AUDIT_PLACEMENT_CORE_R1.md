# Prüfbericht Platzierungs-Kern R1 · Umgebung, Props, Natur, WFC · 25.10. · für WS0 (V-748)

**Auftrag:** Georg 25.10. (V-748). Die Blender-MCP-Vorarbeit wird gegen Kanon und Recherche geprüft, damit daraus ein Kern-Modul wird: ein Regelwerk mit Kachel-Datei und zwei Adaptern.
**Gelesen (nur lesen):**
- Kanon `CANON_3D_R1` (Gebiete 1–4, 15–17) mit Anhang A und den verlinkten Quellen unter `S/`;
- `lib/` (`kfb_env`, `kfb_env_bpy`, `kfb_edge_bpy`, `kfb_edge_params.json`);
- `50_BLENDER/STATUS.md`, B2, B2/R2, N36, STEINKIT, B29, B44;
- Register V-341 … V-748;
- `BLENDER MCP/` (HEX_BLENDER_BENCH, ISLAND_FORM_KIT);
- WS1-Code nur über vorhandene Refs im Spiegel, ohne Fetch: `survey/ws1/biome-drive-r1` (22.10.: `endlessVeg.js`, `grammar.js`, `kfb-biome-drive.r1.json`) und den WFC-01-Brief vom 28.09.;
- die Asset-Ordner.

**Urteil in einem Satz:** Die Regeln liegen fast vollständig in Zahlen vor, und es gibt gute Bausteine: Gruppenbau, Einsinken, Abschlüsse, Einbettung und Steinkit-Daten. Sie stehen aber in drei Sprachen und vier Kopien. Die Spielwelt nutzt keinen davon (`endlessVeg.js` ist ein gewürfeltes Raster), und für WFC fehlt fast jede Socket-Angabe.

## 1 · Bestand

| Baustein | Wo (Datei / Funktion) | Was er kann | Urteil | Begründung gegen die Recherche |
|---|---|---|---|---|
| Kanon-Gate | `lib/kfb_env.py` `gate()` auf `kfb.env-scene/1` | K0, B1/B2, S1–S5, E1/E2, M1–M5, C1, G1/G2, H3/H5/H7/H9/H11 | **KEEP** | Reines Python auf JSON. Es kann jedes Platzierungs-Rezept prüfen, auch ohne Blender. Die Zahlen stehen aber fest im Code (→ §5). |
| Gruppenbau | `kfb_env.nest()`, `nest_ok()`, `relax()`, `rule_report()` | 1 : 3 : Rest, Größen 1 : 0,62 : 0,38, ungerade, Kontur 0,85 / 1,25, Neuversuch | **KEEP** (in den Kern) | Entspricht Grammatik R2 §2 und dem WS0-Entscheid 18.10. Es ist aber ein Port von `grammar.js`, und die beiden laufen schon auseinander (§4 Nr. 2). |
| Kontakt-Geometrie | `kfb_env.contact()` + Gate C1 | n Steinchen bzw. Büschel am Fuß, bergab gehäuft | **ADAPT** | Das Fenster aus Ü5 fehlt (≤ 50 % des Umfangs, Lücke ≥ 25 %), ebenso das Formalphabet (Gebiet 17 (5)). C1 prüft nur, ob irgendein kleines Objekt in 1,5 r liegt. |
| Zahlen | `kfb_env.SINK`, `SINK_CAP`, `RULES`, `NEST` | Einsinken je Art, Gruppen-Toleranzen | **ADAPT** | Inhaltlich auf dem Stand von V-570. Sie gehören in die eine Regeldatei, die beide Adapter lesen. |
| Setzen auf den Boden | `kfb_env_bpy.place()`, `export()`, `run()` | Raycast auf `kfb_ground`, Einsinken am Hang (Talseite), Export ins Gate | **KEEP** | Einziger kanonischer Setz-Baustein (K3), Herkunft der Zahlen nachvollziehbar. Er wird Teil des Blender-Adapters. |
| Abschlüsse | `lib/kfb_edge_bpy.py` (`free_end`, `built_end`, `ruin_end`, `rubble_nest`, `EdgeField`) + `kfb_edge_params.json` | V-577/V-578: Pfadstein-Auflösung, Kappen, Ruine | **KEEP** | Wörtlich nach Kanon Gebiet 4, Test PASS. Für die Laufzeit gibt es lokal kein Gegenstück (§4). |
| Eingangsprüfung | `lib/kfb_clay_bpy.apply()`, `write_asset_pass()` | Knet-Profil, Rollenfarbe, Asset-Pass | **KEEP / ADAPT** | Die 313 Pässe liegen verstreut je Job-Ausgabe (K6, K7, N36 …). Für die Natur-Packs gibt es keinen zentralen Pass je Teil. |
| Fluff-Grammatik (Laufzeit) | WS1 `src/world/grammar.js` (`candidates`, `score`, `stands`, `ripeness`, `stand`, `nest`, `relax`, `fall`, `ruleReport`, `grow`) | Grammatik R2 §2 vollständig, Fallobst hangabwärts | **KEEP** (Fluff-Ebene) | Von Georg abgenommen (17.10., „Verteilungsmuster gut“). `rules.sizeTol` steht noch auf 0,1 statt 0,20 (V-570). |
| Fluff-Anker an Bäumen | `50_BLENDER/B2/kaykit-tree-fluff-anchors.v1.json` (20 KayKit-Bäume, 125 Anker) | Ankerpunkte mit Normale, Höhenanteil, maxBallR | **ADAPT** | Die Verteilung nach R1 ist abgelöst (Georg TUNE). Die gemessenen Punkte taugen als `anchors` je Kachel, wie in `fruitFromAnchors()`. Büsche fehlen (B2b offen). |
| Fluff-Proofseite | `B2/R2/proof/fluff_stage.html` (`nest`, `relax`, `scoreDir`) | dritte JS-Kopie der Operatoren | **REJECT** als Code | Bleibt Bildreferenz. Eine dritte Kopie erzeugt Drift. |
| Einbettungs-Werkzeug | `50_BLENDER/N36/scripts/n36_embed.py` (`lay_in`, `adapt`, `signed_dist`, `entrance_field`, `band_seeds`, `transition_stones`, `profile_checks`, `export_delta`) | Delta ≥ 0 (V-716), Düne 4–6 m, Rampen ≤ 15°, Steinbänder 0/1/2, Eingänge, Export `kfb.terrain-delta/1` + `kfb.stage-edges/1` | **ADAPT** | Inhaltlich der beste Baustein für Stamps. Der Kern (Fußabdruck, Abstandsfeld, Delta, Prüfungen) ist numpy und motorneutral. Blender-Teile (Ziegel, Render) gehören in den Adapter. |
| Einbettungs-Regeln | `N36/data/n36_rules.r1.json` (`kfb.embed-rules/1`) | Biom × Gruppe × Übergang, Bänder, Gewichte, Prüfwerte | **KEEP** | Schon als Daten gebaut und ausdrücklich „Grundlage für WS1/WFC“. Sie werden zum Abschnitt `embed` der Regeldatei. |
| Steinkit | `STEINKIT/data/kfb_stone_kit.v4.json` (`kfb.stone-kit/1`, 82 Steine) | `sinkMin/Max`, `rest`, `upAxis`, `hullRadius`, `weight`, `role`, `sizeClass` | **KEEP** | Die einzige vollständige Teil-Tabelle im Bestand. Sie ist die Vorlage für das Kachel-Schema. |
| Mauer-Kit | `B29/data/wall_kit.r4.json` (28 Teile) | `cells`, `connect` (±X …), Zelle 4 u, Fuß-Attribut | **KEEP** | Echte Sockets auf dem Quadratraster, Fugentest 0 offene Kanten. Die ersten WFC-Module stehen also schon bereit. |
| Hex-Sockets | `BLENDER MCP/HEX_BLENDER_BENCH_2026-10-02/` (`SOCKETS_SUPPORT.json`, `asset_inventory.json` 447 Zeilen) | Kantenklassen je Hex-Kante (`gggggg`, `sggsgg`), `openEdges`, `propSupports`, Anker | **ADAPT** | Die einzige Kantenklassen-Konvention im Bestand. Es fehlt eine Achse für Höhe und Neigung: Schrägkacheln sind unlösbar, die Naht springt 0,09–0,20. Die Maßstabsfrage ist offen. |
| WFC-01-Brief | Spiegel `work/wfc-01-trackside-city-filler-2026-09-28` (`START_HERE`, `RETURN`) | WFC nur als Füller neben geschütztem Korridor; Seed = gleiches Layout; Widerspruch → begrenzter Neuversuch → Autoren-Fallback; Ausgabe als Rezept | **KEEP** (Grundsätze) | Deckt sich mit V-708. Nie gebaut. |
| Bewuchs Spielwelt | WS1 `src/world/endlessVeg.js` `placeCell()` | 64-m-Zellen weltfest; je Rasterpunkt (6 m, Gras 3,2 m) 1 Kandidat mit Jitter 0,15–0,85; Biom gewürfelt nach Gewicht; Dichte über `vegetation.density` | **REJECT** als Regel, **KEEP** als Hülle | Gleichmäßige Zufallsstreuung ist nach QA §6 verboten. Es gibt keine Gruppen und keine 1 : 3 : Rest. Steine sinken um feste 0,25·s statt `SINK`, alles andere um 0,08 m. Keine Kontakt-Geometrie. BatchedMesh, Zeitteilung, LOD, Tönung und Wind bleiben als Laufzeit-Hülle. |
| Biom-Liste | WS1 `src/data/worlds/kfb-biome-drive.r1.json` | 6 Biome, je `veg` (50 KayKit-Forest-Teile), `mix`, `spacing_m`, `density` | **ADAPT** | Wird zu Biom-Rezepten mit Rollen (Anker, Stütze, Akzent) statt Kategorien-Anteilen. |
| Eigene `nest()`-Kopien | `B32/scripts/b32_r4.py:159`, `B36/scripts/b36_set_r4.py:209` | Steinnest vor dem Kanon | **REJECT** | Verstößt gegen Kanon §0 Nr. 2 (keine eigenen Platzierungs-Helfer). Abgelöst durch `kfb_env.nest_ok`. |
| Topfpflanzen-Inventar | `KFB KayKit Plant Toon Atlas v1/…/src/plant-inventory.js` (72 vermessene Teile) | Maße, Dreiecke, UV-Spanne | **KEEP** (niedrige Priorität) | Innenraum-Pflanzen. Für den Roadtrip nur als Requisit. |
| Recherche-Regeln Quaternius | `S/QUATERNIUS_MEGAKIT_STUDY.md` §5 (15 Regeln) | Erdung, Facetten, Stufen, Kontakt | **ADAPT** | Regeln 7, 9–12 gelten. Regeln 1–3 sind abgelöst (Verlauf und 10–20 % Einsinken, §4 Nr. 3/5). |

## 2 · Regeln in Zahlen und wo sie wirklich laufen

Spalten: Blender = `kfb_env` bzw. Werkzeuge; Laufzeit = WS1-Stand vom 22.10.
- **Code** = gebaut und geprüft.
- **Teil** = nur teilweise bzw. nur ein Befund.
- **Papier** = nur Text.

| Regel | Zahl (Quelle) | Blender | Laufzeit |
|---|---|---|---|
| 70/20/10 Ruhe/Struktur/Bedeutung | V-566, Gebiet 2 | Papier (nur Kritiker K3) | Papier |
| Ungerade Gruppen | 3/5/7 (Etherington §3) | Code (`rule_report` odd, `nest` erzwingt ungerade) | Code nur Fluff (`grammar.js`), Welt nein |
| 1 : 3 : Rest, Größen 1 : 0,62 : 0,38 | Grammatik R2 §1/§2; Etherington 1 : 0,6 : 0,35 : 0,15 | Code (`NEST`, `nest_ok`; N36 `brick_nest`) | Code nur Fluff |
| Rule-of-Three-Rezept: Anker 1,2–1,4 × Rolle, Stützen 0,7–0,9 | ENV-Kit §9, Grammatik §1 | Papier (stimmt rechnerisch mit 0,62 überein) | Papier |
| Abstände ≥ 30 % verschieden | Etherington §3 | Teil: `spread = (max − min)/max` der Nachbarabstände (Lesart A4), TUNE 0,45 | nur Fluff |
| ≤ 2 auf einer Geraden | Etherington §3 | Code (`collinear`, Toleranz 5 %) | nur Fluff |
| Kontur ≥ 15 % überlappt / ≥ 25 % Luft | Etherington §4, Entscheid 18.10. | Code im Grundriss (0,85 / 1,25); Tangenten im Bildraum (E3, 5 px): Papier | nur Fluff |
| Negativraum ≥ 30 % | QA H3 | Code (Rasterprobe H3; N36 freie Randlänge ≥ 30 %) | nein |
| Landmarke am höchsten, davor ≤ 60 % | QA H5 | Teil: höchste ja, `landmark_front` unbenutzt | nein |
| Staffel 1 : 3 : 9 | QA H7 | Teil: Befund L ≤ M ≤ S, `ratio_LMS` unbenutzt | nein |
| Ein Kit je Gruppe, keine Klone, Formwiederholung ≤ 3 | H9, H11, Etherington §4 | Code (Wiederholung nur Befund) | nein (ein Kit je Welt) |
| Einsinken je Objektart | `SINK`: Fels/stone_L 40–50 %, Kappe 50 %, Baum 5–10 %, Busch 5–12 %, Requisit 2–5 % (V-570, V-571) | Code (`SINK`, E2, `place()` mit Hang) | nein (fest 0,25·s bzw. 0,08 m) |
| Kontakt-Geometrie an jeder Fuge | V-565; Ü5 ≤ 50 % Fußumfang, Lücke ≥ 25 %; Quaternius ≥ 40 % | Teil (`contact()`, C1 grob, N36 `foot_contact`) | nein |
| Lehnrichtung Felsgruppe ±15° + 1 Ausnahme; ≥ 20 % Kiesel schräg; Hangbäume 20–40 % | Ü1, Ü2, Ü4 | Papier (Schlüssel `lean_tol` … fehlen in `RULES`) | nein |
| Freiraum Fokus 0,5 r; Interaktion 1 H; POI-Aktionsraum ≥ 1,5 m, Wege ≥ 1,2 m | Ü6, V-496 | Teil (N36 Begehbarkeit ≥ 1,2 m) | nein |
| Platzierung nach Ursache: Drift −∇h, Mulden, e^(−λd) | Etherington §5b, E7 | Teil (N36 Band 2 nur hangabwärts) | Fluff `fall()` ja, Welt nein |
| Ortsbiografie: 4 Schichten, Moos in Fugen, Gras 0–2 m, Büsche 2–6 m, Bäume ab 6 m | Konzept Ortsbiografie, Gebiet 3 | Teil (S3: Schicht-Tag vorhanden; Abstandsbänder Papier) | nein |
| Signatur 1 Hero + 2 Echos; Gebrauchsspuren ≥ 2 | Gebiet 3, V-566 | Signatur Code (S5), Spuren nur Feld `wear` im Pass, ungeprüft | nein |
| Steinbänder 0/1/2 | Grammatik R2 §4: 2,0 / 0,9 / 0,3 Gruppen je 10 m | Code (N36: 2,0 / 0,6 / 0,15 nach TUNE) | offen (V-400) |
| Einbettung nur auftragen | V-716: Δ ≥ 0, 4–6 m, Stufe ≤ 2 cm, Rampe ≤ 15° | Code (N36 `lay_in`, `profile_checks`) | Delta-Format liegt vor, Anwendung offen |
| Sprenkel-Übergänge | V-403, Gebiet 17 (5) | **fehlt** (kein Blender-Gegenstück) | Code (`kfb-speckle-transition.v1`) |
| Zielhöhen je Rolle in H | ENV-Kit §2, QA H6 | Papier | Teil (`SCALE` je Kategorie) |

## 3 · Asset-Bestand: Natur, Pflanzen, Landmarken

Fundort, wenn nicht anders genannt: `Frizzlebob …/3D TableDiorama …/3D ASSETS/` (im Folgenden „3DA“).

| Pack | Teile | Wo | Inhalt (gezählt) | Daten vorhanden | Fehlt für WFC bzw. Kern |
|---|---|---|---|---|---|
| KayKit Forest Nature FREE | 84 glTF | 3DA; im Spiel über `FOREST_PIN` | Bäume 14, kahle Bäume 6, Büsche 22, Steine 22, Gras 20 | 20 Bäume mit Fluff-Ankern (B2); 43 Steine als Knete im Steinkit | Hülle, Höhe in H, Ruhelage, Einsinken je Teil, Biom-Tags (nur 50 in der Biom-Liste), Anker für Büsche, Pässe; keine Schnee-Varianten |
| KayKit Medieval Hexagon FREE | 221 glTF | 3DA `…Hexagon_Pack_1.0_FREE 3` | Kacheln Basis 5, Küste 10, Fluss 30, Straße 15; Natur-Deko 42; Requisiten 26; Gebäude 93 (5 Farben); Landmarken Kirche, Windmühle, Wassermühle, Sägewerk, Mine | Kantenklassen je Hex-Kante (Browser-Katalog), Messung HEX-Bench | Achse für Höhe und Neigung, Naht-Toleranz, Maßstabsentscheid (Kachel 2,0 u) |
| KayKit Medieval Snow Biome | 57 glb | 3DA | Hex-Schnee, Straßen A–K mit Detail, Wald | – | Socket-Abgleich mit Hexagon, alles ungemessen |
| KayKit Halloween Bits | 36 glTF | 3DA | path_A–D (Vorlage der Verfallsstufen), Gräber, Zaun, Krypta | K6 mit Pässen | Kanten und Funktionsgruppen als Daten |
| Kenney Nature Kit | 329 glb | 3DA `kenney_nature-kit` | Bäume 61, Klippen 56, Steine 30 + Felsen 30, Boden 29, Feldfrüchte 17, Brücken 16, Zäune 12, Pfade 7 | – | Raster-Sockets für Klippen, Pfade und Zäune ungemessen; facettierter Stil |
| Quaternius Ultimate Nature | 150 FBX | `~/KFB-AssetCache/quaternius/UltimateNature` | je Art Sommer/Herbst/Schnee/tot (Common, Pine, Birch, Willow, Kaktus, Steine, Moos-Steine) | Kit-Faktor 0,044 (ENV-Kit §1) | Linear-Farbe, Zentimeter, keine Pässe; wertvoll für Biom-Wechsel |
| Quaternius Stylized Nature MegaKit PRO | 116 | AssetCache `…_PRO` | Bäume 40, Büsche 6, Gras 7, Blumen 12, Pflanzen 10, Pilze 4, Steine 6, Kiesel 11, Pfadplatten 10 | Messung Studie §1 | Sockets nur bei Pfadplatten sinnvoll; Maßstab uneinheitlich |
| Tiny Treats Pretty Park | 28 glTF | 3DA | Bäume, Büsche, Hecke gerade/Ecke, Blumen, Gras, Bodenkacheln `floor_grass_sliced_A–I` | – | Hecken-Sockets; die Bodenkacheln sind ein 9-Slice-Satz, nur für gebaute Parks (§4 Nr. 6) |
| Tiny Treats House Plants | 113 glTF | 3DA; Inventar 72 im Plant-Lab | Töpfe, Pflanzen | Maße, UV | – (Requisit) |
| Steinkit v4 | 82 Formen | `50_BLENDER/STEINKIT` | Findlinge, Platten, Passstücke | vollständig (`kfb.stone-kit/1`) | Biom-Tags |
| B29 Mauer-Kit r4 | 28 | `50_BLENDER/B29` | Mauer, Tor, Enden, Polar-Ringe | `cells`, `connect` | Kantenklasse und Biom |
| Landmarken außerhalb der Kits | – | OSM City Lab + Landmark Overrides, Meshy-Türme, Resident-Atlas-Dioramen | Dom, Skyline, Genii Loci | Footprint teils (`kfb.stage-edges/1`) | **nie WFC** (V-708); nur Stamp mit Footprint, Eingängen, `edgePalette` |

**Fehlt für WFC in allen Packs:**
1. Ein Socket-Schema für Raster-Module: Kantenklasse + Höhe + Biom, für Hex und Quadrat.
2. Eine Kompatibilitäts-Tabelle für freie Natur: Rolle × Rolle, Biom × Biom, Kit.
3. Hülle, Höhe in H, Ruhelage und Einsinken je Teil.
4. Anker (Fluff, Kontakt).
5. Ein zentraler Asset-Pass je Teil.
6. **Story-Vorlagen je Rezept:** Gate S1 verlangt „wer/womit/warum“ je Objekt, prozedural geht das nur über Vorlagen (Ü9 Story-Stamp).

## 4 · Lücken und Widersprüche

1. **Drei Implementierungen, keine Quelle:** `grammar.js` (JS, Laufzeit), `kfb_env.py` (Python-Port) und `fluff_stage.html` (dritte Kopie), dazu Zahlen in `n36_rules`, `kfb_edge_params` und `kfb-biome-drive`. Genau diese Drift soll V-748 verhindern.
2. **`size_tol`:** `kfb_env` hat 0,20 (V-570). `grammar.js` hat in `ws1_terrain-439`, `ws1_mvp-r1` und `biome-drive-r1` noch 0,1, obwohl Anhang A „gleichzeitig in grammar.js ändern“ verlangt.
3. **Einsinken Fels:** Code und V-570 sagen 40–50 % mit Kappe 50 %. Dagegen stehen noch alte Werte:
   - Quelle `ETHERINGTON_REGELN_IN_ZAHLEN_R1` §2: 25–45 %;
   - Grammatik R2 §4.1: Band 0 L 45–60 %;
   - ENV-Kit §10: 5–15 % für alles;
   - Quaternius-Studie Regel 3: 12–20 %.
   Die Quellen sind nicht nachgezogen.
4. **Kontakt am Fuß:** Vier Vorgaben passen nicht zusammen. ENV-Kit §8 verlangt „3–8 Büschel am Fuß jedes Objekts“, §10 „≥ 3 Überlappungen“. QA H8 sagt „keine Zählregel“, Etherington §1 „keine Blümchenkränze“. Ü5 erlaubt ≤ 50 % Umfang mit Lücke ≥ 25 %, Quaternius Regel 8 fordert ≥ 40 %. Es bleibt also ein schmales Fenster von 40–50 %, das kein Code prüft.
5. **Kontaktton:** Quaternius Regel 1/2 beschreibt einen Verlauf über 25–40 % der Höhe. Gebiet 7 (V-570) verlangt dagegen eine harte schmale Stufe 8–12 L* unter dem Wurfschatten, und V-403 verbietet Verläufe. Die Studie ist hier abgelöst, aber nicht markiert.
6. **„WFC für Übergänge“ (V-748) gegen Anhang A:** Dual-Grid-Übergangskacheln (R1-19) sind ausdrücklich nicht übernommen, weil sie ein erkennbares Konstruktionsmuster ergeben (V-403). Lesart für den Kern:
   - WFC wählt nur diskrete Übergangs-*Familien* und Module, etwa Art-Ausdünnung am Biom-Rand, Steinband, `free_end`/`built_end`;
   - Bodenübergänge bleiben Sprenkel;
   - es gibt nie Bodenkachel-Sätze in der Natur.
7. **Funktionsgruppen fallen durch das Gate:** N36 Friedhof ist BLOCKED (G1). Georgs abgenommene B33-Anordnung (V-512, Gräber in Reihen) bricht `odd`/`collinear`. `kfb_env` kennt nur Naturgruppen. Es fehlt eine Klasse „gebaute Ordnung/Funktionsgruppe“ (Ü11) mit eigenen Regeln.
8. **Sprenkel nur zur Laufzeit:** Das Spiel nutzt `kfb-speckle-transition.v1`, Blender hat kein Gegenstück (Kanon Gebiet 4: „Lücke“). Blender-Proofs zeigen deshalb andere Übergänge als das Spiel.
9. **Grammatik R2 in sich:** Die Statuszeile sagt „relax ≤ 0,85 × oder ≥ 1,25 ×, nie 0,92 ×“, §2 schreibt noch „bis d ≥ 0,92·(rₐ + r_b)“. Die Abstandsregel „benachbarte Abstände ≥ 30 % verschieden“ ist im Code als Spannweite (max − min)/max umgesetzt, also eine andere Metrik.
10. **Bänder getunt, Quelle nicht:** N36 nutzt 0,6 / 0,15 Gruppen je 10 m statt 0,9 / 0,3 (Spec §4.1). Das ist zulässig nach V-568, muss aber in die eine Datei zurück, sonst baut WS1 nach der Spec.
11. **Gate-Namen doppelt:** Die Gate-Codes kollidieren. `kfb_env` „G1“ heißt Gruppe, Proof-Stage „G1“ heißt Augen, und Anhang A plant `kfb_env` G3–G8. N36 meldet „Gate G1“ und meint `kfb_env`. Das ist mehrdeutig in Berichten.
12. **Drei Einheiten:** K2 (H = 3,64 Lab-Einheiten, „keine Meter“), N36 und Grammatik in Metern, Spiel mit `M_PER_RIG` 0,616 m je KayKit-u. Die Regeldatei braucht genau eine Einheit plus Umrechnung.
13. **Papier-Regeln mit Gate-Versprechen:** 70/20/10, Ü1–Ü7 (Schlüssel fehlen in `RULES`), E3 Tangenten im Bild, E7 Ursache, H2 (nichts im Weg bzw. Wasser), H6 Zielhöhen, `landmark_front`, Ortsbiografie-Abstandsbänder, Gebrauchsspuren ≥ 2.
14. **Laufzeit-Abschlüsse fehlen:** Für `kfb_edge` ist lokal kein WS1-Gegenstück auffindbar (V-577 nennt es).
15. **Älterer Befund überholt:** Der HEX-Bench (02.10.) verwarf facettierte KayKit-Bäume als Zielsprache. Seit V-619 und B2 ist KayKit Forest das Haupt-Kit der Fahrt. Zu prüfen bleibt nur, ob die Laufzeit (`plateTint`) die Knet-Pflicht aus Gebiet 15 (7) erfüllt.

## 5 · Vorschlag Kern-Modul „ein Regelwerk, zwei Adapter“ (`kfb-place`)

**Grundsatz:**
- Eine Datei mit allen Zahlen, Rezepten und Kacheln.
- Ein Löser, einmal geschrieben: rein, deterministisch über den Seed, ohne three.js und ohne bpy.
- Er liefert ein Rezept (`kfb.place-recipe/1`). Blender und Spiel instanziieren nur.
- Das Python-Gate prüft dasselbe Rezept.
- So zeigen Proof und Spiel bei gleichem Seed dasselbe Bild.

**Dateien:**
- `CANON_3D/lib/kfb_place.r1.json` (`kfb.place/1`): die Regel- und Kachel-Datei.
- `kfb-place-core.v1.mjs` (Löser) mit CLI `kfb-place.mjs`.
- `kfb_place_bpy.py` (Blender-Adapter).
- Laufzeit-Adapter im Spiel (ersetzt `placeCell` in `endlessVeg.js`).

```text
kfb_place.r1.json  (kfb.place/1)
  units    { base: "H", m_per_H, m_per_kaykit_u: 0.616381 }                  # §4 Nr. 12
  rules    { sink{kind:[lo,hi]}, sink_cap, group{odd, sizes[1,.62,.38], size_tol .20, spread .30/.45, line_tol, overlap .85, air 1.25},
             zone{groups[2,4], neg_space .30, ratio_LMS[1,3,9], landmark_front .60}, lean{Ü1–Ü4}, contact{perimeter[.40,.50], gap_min .25},
             functional{…Ü11, ohne odd/collinear}, budget{tris, draws} }          # ersetzt SINK/RULES/NEST im Code
  masks    { p = base × transition × cause × rest, weights{corner 1.6, downhill 1.4, behind_camera .5}, cause{drift:-grad_h, hollow:curv>0, lambda} }
  embed    <kfb.embed-rules/1 aus N36>     edge <kfb.edge-params/1>     fluff <GRAMMAR aus grammar.js>
  recipes  [{ id, biomes[], slots[{role anchor|support|accent|pebble, kinds[], h_rel[1.2,1.4]…}], story_template, layer, carrier_types[] }]
  biomes   { <id>: { recipes{id:w}, density, spacing_H, palette_roles, transition{<to>: {families[], width_H}} } }
  adjacency[{ a:"role|kind|kit|biome", b:"…", allow:true|false, w }]          # WFC-Kompatibilität für freie Natur
  tiles    [{ id, pack, path, kit, kind, role, size_class, h_H, hull_r_H, rest, up, sink[lo,hi], anchors[{p,n,hs}],
              contact_family, biomes[], asset_pass, sockets{ grid:"none|hex|square", edges[{dir, class, level}] } }]   # Vorlage: kfb.stone-kit/1, wall_kit.r4

Löser  placeChunk({ rules, seed, chunk{x0,z0,size}, terrain{h(x,z), n(x,z)}, biome{weights(x,z)}, masks{blocked(x,z), entrances[], stamps[]}, zone })
         1 Zone (Makro): 2–4 Gruppenkeime, Thomas/Matérn auf der Maske, Negativraum ≥ 30 %, Fokusplatz frei
         2 Gruppe (Meso): Rezept wählen → solveLocal() belegt die Slots mit Kacheln (WFC lokal: Domänen aus tiles/adjacency,
           ein Kit, Größenstufen, keine Klone, Wiederholung ≤ 3) → nest_ok() → relax() → Lehnregeln → Einsinken nach sink/Hang
         3 Mikro: Kontakt-Geometrie (Fenster 40–50 %), Kiesel/Fallobst entlang −∇h, Fluff an anchors (grammar.js)
         4 Ränder: Biom-Rand = Übergangs-Familien (Sprenkel bleibt Boden-Owner); Bauten = kfb_edge-Form wählen (A oder B)
       solveLocal(slots, domains, constraints, seed, {tries:16}) → Belegung | Widerspruch → Neuversuch → Autoren-Fallback (WFC-01)
       embedStamp(stamp, terrain, rules.embed) → kfb.terrain-delta/1 (nur Δ ≥ 0) + kfb.stage-edges/1 (Port N36)
Ausgabe kfb.place-recipe/1 { seed, chunk, instances[{tile, p[x,y,z], rotY, s(±15 %), sink, group, role, layer, story, rule_refs[]}],
                             stamps[{id, footprint, fixed:true}], deltas[…], report{rule_report je Gruppe} }
Gate    recipe → kfb.env-scene/1 → kfb_env.gate()  (Python, Zahlen aus derselben JSON; neue Prüfungen §4 Nr. 7/13)
```

**WFC-Grenzen:**
- **Erlaubt:**
  - Slot-Belegung in Gruppen und Stamps;
  - Raster-Module mit Sockets (B29-Mauern, Hex-Straße/Küste/Fluss, Kenney-Klippen und -Pfade, Zäune, Hecken);
  - Übergangs-Familien am Biom-Rand;
  - Lücken neben dem Fahrkorridor (WFC-01).
- **Nie:**
  - Landmarken, OSM-Gebäude, Straßengraph, Geländehöhe (ein Höhen-Owner);
  - ein globales Natur-Raster (es läse sich als Kachelmuster);
  - Verformen von Kit-Teilen.
- **Stamps:** Landmarken und Dioramen sind feste Stamps. Um sie herum laufen nur `embedStamp` (V-716) und die Steinbänder.

| Teil | Owner | Erste Lieferung |
|---|---|---|
| Zahlen, Rezepte, Story-Vorlagen, Kompatibilität in `kfb_place.r1.json`; Widersprüche §4 Nr. 2–5, 9, 10 entscheiden; V-Nummer | **WS0** | R1 der Datei aus `kfb_env`, `n36_rules`, `kfb_edge_params`, `GRAMMAR`, `biome-drive` |
| Kachel-Tabellen messen (headless: Hülle, H, Ruhelage, Einsinken, Anker, Sockets) + zentrale Asset-Pässe je Teil | **WSB** | KayKit Forest 84 + Steinkit 82 + B29 28 |
| Löser `kfb-place-core.v1.mjs` + CLI + Golden-Test (gleicher Seed = gleicher Rezept-Hash) | **WS1b** | `placeChunk` + `solveLocal` für Natur ohne Sockets |
| Blender-Adapter `kfb_place_bpy.py`: Rezept → Import → `kfb_clay_bpy.apply` → `kfb_env_bpy.place` (sink aus Rezept) → `run()` | **WSB** | Instanziierung + Proof-Stage |
| Laufzeit-Adapter: `placeCell` → Löser, Hülle aus `endlessVeg` (BatchedMesh, 64-m-Zellen, Zeitteilung, Wind je Gruppen-ID), Schalter `veg=core` | **WS1b** | hinter Schalter, Standard bytegleich |
| Delta anwenden, Sprenkel, Laufzeit-Abschlüsse (`kfb_edge`-Gegenstück) | **WS1 Lead** | nach der Probe |
| Gate: `kfb_env` liest die JSON; neue Prüfungen Funktionsgruppe, Ü1–Ü7, E7, Kontaktfenster; Gate-Präfix `ENV-` gegen die Namenskollision | **WSB** (Zahlen WS0) | mit R1 der Datei |

**Kleinste sichtbare Probe P0 (eine Zelle):**
- Eine 64-m-Zelle im Biom `moos` mit festem Seed, nur KayKit Forest (ein Kit).
- Drei Gruppen:
  - Baumgruppe: 1 Baum + 3 Büsche + 1 Akzentstein;
  - Busch-Nest;
  - Steinkit-Nest am Hang.
- Dazu Kontakt-Geometrie und 1 fester Stamp (Baumstumpf als Mini-Landmarke, darf nicht umgeordnet werden).
- `solveLocal` belegt die Slots, das zeigt WFC lokal.
- Das Rezept läuft durch `kfb_env.gate`.
- Bilder: Blender-Proof (Proof-Stage, echtes Terrain sobald der WS1-Export da ist, sonst als Platzhalter markiert) und Spiel hinter `veg=core`, gleiche Kamera, A/B gegen `endlessVeg`.
- Nach Gate und blindem Kritiker gehen die Bilder an Georg, und erst nach seiner Bildabnahme ist P0 die Vorlage (V-740).

**P1:** dieselbe Zelle mit Biom-Rand `moos` → `wueste` (Übergangs-Familien) und ein Raster-Satz mit Sockets (B29-Mauerstück mit `free_end`).
