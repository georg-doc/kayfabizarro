# FRAKTAL_R1 · Lückenliste und Widersprüche · 31.10.2026

Stand im Spiel: `world/verteiler-r1` @e0054fda (gemergt hinter `place=r2`, aus), `origin/game/integration-r2` @7022aa60 soweit lokal lesbar, Gischt-Code @bb87eb11. T-Nummern siehe `FRAKTAL_R1.md`.

## 1 · Fälle

| Fall | Heutiger Stand (Datei) | Status | Was konkret fehlt | Abnahme von Georg |
|---|---|---|---|---|
| Kiesel am Fels | `kfb-place-field.v1.mjs` `rockGroup`, `pebbleDrift` | **umgesetzt**, nur hinter `place=r2` | Standard erst nach 5-Minuten-Messung (V-1097); Maße außerhalb `kfb_place` (V-1097) | q333, q339 KEEP (V-1093, V-1112) |
| Gemalte Steine | `biomeTerrain.js` `kfbStones`, `stones=r1` Standard | **teilweise**, ohne `place=r2` weiter Zellraster | Georg: Dreiergruppen in Reihen, Fremdkörper (`START_WS_VERTEILER`). Mit `place=r2` aus | q266, q270 TUNE (V-902, V-907, V-936); Code-Notiz „Steine so lassen“ |
| Fußkügelchen Fels, Busch | Nicht vorhanden. `contactArcs` nur im alten Pfad `veg=core`. Field: `kugel_p` 0,06 nur am Ende einer Kiesel-Drift | **fehlt** | Messung: 108 Kügelchen in Wüste, 0 in Moos und Pastell auf 14,7 ha. `balls=place` steht aus (N-018, N-022) | q339 offen (V-1112) |
| Minimalform leerer Boden | `placeWorker.js` `MC`, nur `theme=1`; Kontextregel da | **teilweise** | Nicht Standard; 55 % der Gruppen sind Zweier; keine Quelle im Datenmodell; Kügelchen nicht auf dem Kern | V-1004, V-1036; q339 offen |
| Gras am Fuß | `grassGroup` Schattenseite, `stamps` | **umgesetzt**, zu viel | 289 Büschel je 64-m-Zelle in Moos, 242 in Pastell, keine Obergrenze geprüft | q339 „zu viele einzelne Halme“ |
| Gischt Ufer | `hydroSpray.js`, drei Kerne | **teilweise** | Größe und Menge richtig (1 : 0,61 : 0,35; 150/90/50). Fehlen: Keime entlang der Linie, Rhythmus, Takt zur Welle, Strömungsseite. Heute Zufallspunkt 6–40 m um die Figur | q332 TUNE; Korrekturen 31.10. (bb87eb11, 290c6324); V-1114 FAIL |
| Durchfahren Wasser | `ballCore wake` | **teilweise** | Kein Größenabfall je Klasse; Größe zufällig | V-1084 |
| Uferlinien | `kfbWater.js` `F_LINES` hinter `shore=lines` | **FAIL, R2 wartet** | Tapering, Rhythmus, Geländebezug; Kritiker 4/10. Konzept R2 lokal nicht lesbar | Georg 31.10. (Q-027), N-022 Stopp |
| Krater | `craterR1.js`, `CraterMesh.jsx`, `impactScar.js`; `game/crater-gen-r1`; `design/kartengebaeude-r1` `ground-crater.mjs` | **teilweise** | Nachbau statt Generator im Stamm; Energie-Stufen nur auf dem Design-Branch; Einbettungs-Lippe für Stehendes fehlt | q268 FAIL (V-906), V-863, V-855 |
| Trümmer am Krater | `ImpactDebris.jsx` drei Klassen, Polarraster | **teilweise** | Klassen nach #27 richtig, Bauart V-850; Georgs Fail V-855 sagt Strahlen als Konstruktion, nicht als Anordnung | V-845, q248/q249 |
| Aufprall, Landung, Geröll | `landingDebris.js` → `ballCore impact` | **Verstoß gegen T4, T5** | Richtung `rnd·2π`, Tempo unabhängig von der Größe (`IMPACT_VEL`, `writeRange`). Prüfung fällt durch | q278 ins Spiel (V-922), Q-023 Plastik |
| Goo-Splat | `impactScar.js` Spritzer und Tropfen im Shader | **teilweise** | Keine fliegenden Tropfen, kein eigener Splat-Aufruf im Spiel gefunden | V-846, V-850 |
| Kartenkante, Kugelrelief | `cardRelief.js`, `ballCore relief`, `src/card-edge` | **umgesetzt** für den Ruhezustand | Beim Freifahren kein Klassenverhalten; Schwelle `CARD.thr` offen (N-022). Übergang Kugelkarte zu Gelände nicht geprüft | q278, q334 KEEP |
| Fluff aus Zerstörung | `cascade/r4/spill.js` richtig; im Stamm nur `orchard.burst`, `fluff.js` | **fehlt im Stamm** | Fächer samt „groß kurz, klein weit“ liegt nur auf dem Design-Branch und nicht auf dem Kern; Georg noch unsicher | q315 TUNE 4 (V-1071), Q-023 |
| Bodenübergang | Bänder (`biomeTerrain.js`), Fenster nicht vorhanden | **fehlt** | `zone=r1` steht aus; `ground=j17` offen | q222 PASS (V-802), V-1113 |

## 2 · Terme quer durch

| Term | Stand | Lücke |
|---|---|---|
| T1 Quelle | Nur im Field über `ga`, `nearest` | **Kein gemeinsames Feld `quelle`.** Kiesel-Drift ohne Fels im Umkreis 8 m: 91 von 643 Gruppen in Wüste. Das ist zulässig als Wind- oder Wasserablage (Vorlage 2), muss aber als Quelle markiert sein |
| T3 Leiter | `rules.group.sizes`; mehrere Kopien im Code | Hart kodiert in Worker, Shader, Spray |
| T5 Richtung | `openOf`, `shade`, `SCAR.dir` | Kein gemeinsames Richtungsfeld; Strömung gar nicht genutzt |
| T7 Rhythmus | `spread_pair_min`, `spread_target` nur in Gruppen | Entlang von Linien nirgends |
| T10 Abbruch | `near_m`, `kfbStones` Fade | Keine Pixelregel, keine Flächenregel |
| T12 Zeit | VFX-Spec, `wake`, `impact` | Zustand „ruht mit Quelle“ nicht geprüft |

## 3 · Widersprüche zwischen unseren Papieren

Rangfolge laut Kanon: Georg > Register > Kanon > Quellen. Neuere Georg-Entscheidung geht vor.

| # | Widerspruch | Es gilt | Folge |
|---|---|---|---|
| W1 | Kontakt-Geometrie Pflicht (V-565, V-749 Nr. 3, Kanon Gebiet 4) gegen „Kontaktsteinchen und Fußsteinchen gestrichen“ (V-797) gegen Kügelchen am Fuß (V-1112) | **V-1112, gebremst durch V-797 und V-1036:** Kinder am Fuß ja, wenige, als Materialcode, nie als Bogen um alles | Kanon Gebiet 4 und `contact.required` nachziehen |
| W2 | Staffel 1 : 0,62 : 0,38 gegen R3 1 : 0,4 : 0,1 gegen Etherington-Zahlen gegen BMS 1 : 0,4–0,7 | **`kfb_place` (V-749)**; die anderen liegen auf derselben Leiter | Leiter in die Tabelle |
| W3 | Negativraum 30 % (`neg_space_min`) gegen 50 % (R3, V-799) gegen 70/20/10 (V-566) | **Gate 30, Ziel 50 (V-799);** 70 meint Aufmerksamkeit, nicht leere Fläche | Prüfung P5 auf 50 |
| W4 | Ungerade 3/5/7 gegen Zweier- und Dreiergruppen (V-1004, V-1005 „zwei bis drei“) | **3 als Regel (WS0-Auftrag nach Georg 31.10.), Zweier nur als kleinste Form.** Herkunft „ungerade“ ist KFB, nicht Etherington | Worker-Quote 55 % Zweier senken |
| W5 | Poisson-Teppich verboten (QA §6) gegen Poisson-Disc (V-799) gegen Thomas-Prozess (Grammatik §4.2) gegen Blue Noise nur in Maske (Flächengrammatik §6) | **Kein Widerspruch:** Keime gehäuft, innen Mindestabstand | In §1 so festgelegt |
| W6 | Sprenkel (V-403, Gebiet 17) gegen Bänder (V-802 q222) gegen Joyride-Ruhe (V-1113) | **Gelände:** Bänder bis zum Bildpaar `ground=j17`. **Sprenkel** nur am Fuß (V-1100) und für Splitter (V-845) | Kanon Gebiet 4 und 17 sagen noch „nur Sprenkel“ |
| W7 | Kein Kies (V-798), Splitter nur Shader (V-845), Steinchen im Shader (V-904) gegen Kiesel als Instanzen (V-1076) | **V-1076 nah, Shader fern;** Splitter fliegen als Kugel und ruhen als Sprenkel | Grenze über T10 |
| W8 | Gras Licht- bzw. Hangfußseite (`rules.grass.foot`) gegen Schattenseite (Ü12, V-1078, `grassGroup`) gegen Windschatten (Etherington-Zahlen §2) | **Schattenseite** (neuer, q339 KEEP); Windschatten deckt sich damit oft | `rules.grass.foot.side` ändern |
| W9 | Größe fällt mit dem Abstand (V-1114) gegen Kies einheitlich groß, Abwechslung aus Grüppchen (#170) | **Beides:** zwischen Klassen fällt sie, innerhalb Kies trägt die Dichte. Für Gischt, Trümmer, Georgs Worte gelten Stufen | P2 je Fall mit oder ohne Größe |
| W10 | Gischt „landeinwärts mittel“ (bb87eb11, „nach außen“ in V-1114) gegen „nie landeinwärts“ (290c6324) gegen Welle aufs Land (Uferlinie) | **Offen, Hub-Frage.** Vorschlag: In der Luft darf es über Land, liegen bleibt es auf Wasser und im nassen Streifen | Georg per Bild, `FUER_GEORG.md` |
| W11 | Zahlen nur aus `kfb_place` (V-749) gegen Größen in `kfb-place-field.r2.json` | **V-749**, beim Merge überführen (V-1097) | Noch offen |
| W12 | Grammatik R2: Band 0 Einsinken 45–60 %, `relax` 0,92; §2 kennt 0,85 nur im Kopf | **V-749:** 40–50 %, ≤ 0,85 oder ≥ 1,25 | Grammatik R2 wird Quelle |
| W13 | Kieselsäume als Übergang verboten (V-1000) gegen Übergangssteine am Bühnenrand (V-341, Grammatik §4) | **Beides passt:** kein durchgehender Saum, Kinder nur als Bogen mit Lücke (T5) | Keine |
| W14 | Partikel statt Wolkenskulptur bei Fahrspur (Particle-First 22.10., teils überholt durch V-690) gegen eine Masse mit Beulen (VFX-Spec) | **Getrennt:** Bodenspur aus vielen Partikeln, Rauchsäule als Masse (V-1043, V-1055 offen) | Außerhalb dieses Umfangs |
| W15 | Joyride-Gruppen ohne Kleinteile, „alles übernehmen“ (V-1113) gegen Kügelchen-Ebene (V-1112) | **Joyride für Luft, Maßstab und Fenster** (Bestand §2 sagt selbst: kein Vorbild für die Regeln); Kügelchen nach V-1112 | Dichte im Bildpaar prüfen |
