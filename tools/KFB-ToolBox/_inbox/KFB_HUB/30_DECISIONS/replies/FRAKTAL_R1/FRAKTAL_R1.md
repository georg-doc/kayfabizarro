# FRAKTAL_R1 · Das eine Muster für Verteilung, Partikel und Übergänge · WS0-Agent · 31.10.2026 (V-1114)

**Status:** Vorschlag für WS0, kein Kanon, bis eine V-Nummer es dorthin hebt. Kein Spiel-Code geändert.
**Kennzeichnung:** `belegt` = steht so in Tafel, Register oder Recherche. `abgeleitet` = von mir aus Belegtem geschlossen. `[V]` = Startwert ohne Beleg, an einer Musterregion zu eichen (V-568).
**Etherington-Tafeln sind Bilder.** Ihr Inhalt steht hier in eigenen Worten mit Tafelnummer. Register- und Georg-Sätze sind wörtlich.

## 0 · Ergebnis

Das Muster steht seit dem 17.10. im Papier: „Etwas entsteht an einer Quelle, gruppiert sich nach 1 : 3 : Rest und wandert abwärts“ (`SPEC_PLACEMENT_GRAMMAR_R2` §0). Vergessen wurde es, weil es dort als Regel für Fluff und Steine steht und jede spätere Baustelle eine eigene Formel bekam.

**Georgs Lesart stimmt im Kern, in fünf Punkten korrigieren die Quellen sie:**

| Annahme | Befund | Beleg |
|---|---|---|
| Größe, Dichte und Abstand fallen mit dem Abstand | **Dichte fällt, Größe fällt, der Abstand zwischen den Kindern wächst** | V-578 Fuge 3 → 31 cm; `SPEC_CARTOON_VFX` §1.5 |
| Der Abstand allein reicht | **Es fehlt die Richtung.** Abstand allein ergibt einen Ring, also den verbotenen Kranz | #27, #3, V-749 Nr. 3, Ü12; Vorlage 5 |
| Größe fällt stufenlos | **In Stufen, je Klasse ein Verhalten.** Innerhalb der kleinsten Klasse darf die Größe fast gleich bleiben, dort trägt die Dichte | #27, #161, #170; V-799 „Stufenfunktion“; Messung Vorlage 5 |
| Ein Fall gilt wie der andere | **Das Kartenrelief ist die Ausnahme:** dort sitzen die kleinen Kugeln an der Kante, weil sie Bild sind, nicht Auswurf | `ballCore.pointsFromImage` |
| Die Formeln stammen von Etherington | **Nein.** Belegt sind dort nur 2 : 1, drei Kerngrößen, drei Primärformen, fünf Tiefenstufen, acht Landmarken-Typen. Die Formeln stammen aus P3, Perplexity und KFB | `WS1_R2_ETHERINGTON_ABGLEICH` |

**Etherington belegt die Selbstähnlichkeit ausdrücklich:** #162 wendet Klein, Mittel, Groß immer wieder an, auf Formen, Innenflächen und Oberflächen. #28 setzt die Explosion von innen mit dem Wasserspritzer gleich. Das ist die Brücke zwischen Trümmern und Gischt.

**Die Bausteine gibt es schon, sie teilen nur keinen Code:** Fels→Kiesel in `kfb-place-field` besteht die Prüfungen fast überall (§5, `PRUEFUNG.md`), `cascade/r4/spill.js` setzt „groß kurz, klein weit“ richtig um, `ground-crater.mjs` hat die Energie-Stufen. Der Kugel-Kern `impact` bricht dagegen zwei Regeln, siehe `LUECKEN.md`.

## 1 · Die Grundfunktion

```
kinder(Q, P, R) → [{ x, z, r, generation, d, quelle }]

Q   Quelle: Punkt, Ring (Fuß), Linie (Wasserkante, Tuschekante, Lochkante) oder Feld (Ruhekeim)
    mit Stärke r_Q (Größe bzw. Wucht), Abstandsfeld d(p), Richtungsfeld a(p) aus einer Ursache
P   eine Zeile der Datentabelle, §3
R   Zufall nur aus Saat und Ort

u(p)     = d(p) / L,  L = k_L · r_Q                              Reichweite
λ(p)     = λ0 · e^(−u/τ) · W(θ − a(p)) · M_Ursache · M_Ruhe      Dichte der Keime, bei u = 1 abgeschnitten
r(g)     = r_Q · q^g · (1 ± 0,15),  q = 0,618                    Größe nur auf der Leiter
g(u)     = g0 + ⌊u · G⌋                                          Stufen statt Verlauf
Keim     → nest(3 | 5 | 7) mit 1 : q : q²                        die Gruppe ist dieselbe Funktion, eine Stufe tiefer
Abbruch  r < r_min(Blick) oder Flächenregel                      darunter Shader, darunter nichts
```

**Die Leiter (`abgeleitet`):** 0,62 und 0,38 sind q und q². Damit liegen alle unsere Staffeln auf einer Leiter: `kfb_place` 1 : 0,62 : 0,38 = q⁰, q¹, q²; R3 1 : 0,4 : 0,1 ≈ q⁰, q², q⁵; Etherington-Zahlen 1 : 0,6 : 0,35 : 0,15 ≈ q⁰, q¹, q², q⁴. Der scheinbare Widerspruch ist nur ein anderer Sprung auf derselben Leiter.

**Die Flächenregel (`abgeleitet`):** Trägt jedes Element b Kinder, wächst die belegte Fläche je Generation um b · q². Ab b ≈ 2,6 gleich groß, bei b = 3 schon 15 % mehr. Darum dürfen nicht alle Kinder wieder Kinder tragen, sonst entsteht über mehrere Stufen genau der Krümelteppich aus V-797. Erst die dritte Stufe im Nest ist seltener (`rules.nest.counts` 1, 3, 1–5), das stimmt schon.

**Energie-Stufen (`belegt`, Krater-Modell):** Dieselbe Quelle ergibt mit wachsender Energie Lippe, dann Lippe mit Wurzelrissen, dann Krater mit Schollen, Rissen und Auswurf. So gehören Einbettung, Krater und Zerstörung in eine Reihe.

## 2 · Die Terme mit ihren Belegen

| # | Term | Quelle und Stelle, Wortlaut kurz | Bild | Formel, Parameter | Verbietet | Art |
|---|---|---|---|---|---|---|
| T1 | **Quelle zuerst** | Georg V-1114: „Grenze oder Elternobjekt spawnt Kinder“. QA §00 wer, womit, warum. R3 Punkt 4 Verfall hat einen Ort. Perplexity Flächengrammatik §6: Ursachenmaske | Vorlage 5; `R2_etherington.jpg` | Jedes Kind trägt `quelle`, `d ≤ L` | Gischtflächen im Gelände, Streuung, Konfetti | belegt |
| T2 | **Dichte fällt** | P3 „Spurensicherung“: Kleinteile mit Abfall e^(−λd) zum Einschlag; P3 Parent-Child mit Gauß-Ausdünnung; V-403 Intent: dünnt aus, bis nichts mehr da ist; VFX-Spec §1.5 | Vorlage 1, 5 | τ je Fall; gemessen Vorlage 5: 1,04 → 0,06 je m² über 3 m | gleichmäßige Dichte, harte Kante am Ende | belegt, Zahl [V] |
| T3 | **Größe auf der Leiter, in Stufen** | #161 drei Kerngrößen, gleiche wirken langweilig; #162 immer wieder angewendet; `kfb_place` V-749; VFX-Spec §1.2; V-799 Stufenfunktion | Tafel #161, #162 | r(g), Toleranz ±15 %, Nachbarn ≥ 20 % verschieden (`size_tol`) | Verlauf, gleich große Nachbarn | belegt, Leiter abgeleitet |
| T4 | **Jede Klasse verhält sich anders** | #27 große Stücke brechen wenig und fallen, mittlere fächern im Druckstoß, kleinste zuerst und in alle Richtungen; Krater: groß nah, klein weit; V-845; Grammatik §4 nah groß und tief, außen klein und selten | Tafel #27 | Flugweite ∝ q^(−g), Einsinken mit g fallend | gleiche Flugweite für alle Größen | belegt |
| T5 | **Richtung mit Ursache** | #27 Auswurf folgt dem Einschlagwinkel; #3 ruhiges Wasser bricht an einer Seite des Steins; V-1054; Ü12 ≥ 70 % Bewuchs auf Schatten- bzw. Wetterseite; V-749 Nr. 3 Umfang 40–50 %, Lücke ≥ 25 % | Tafel #3 Schluss | W(θ): Bogen bis 50 %, Resultante ≥ 0,45 [V] | Kranz, Saum, Halo, gleichmäßiger Stern | belegt, Schwelle [V] |
| T6 | **Gruppe** | #161; 2-zu-1 A/B (nur Ausgangspunkt, kein Selbstzweck); Dreiecks-Grundriss; V-1005; `rules.group` | Tafel #161 | n ∈ {3, 5, 7}, Konturen ≤ 0,85 oder ≥ 1,25, ≤ 2 auf einer Geraden | Reihen, Paare gleicher Größe, Fast-Berühren | belegt; „ungerade“ ist KFB, nicht Etherington (R2 E1) |
| T7 | **Rhythmus und Auslauf** | Georg über Q-027: Runde 1 ohne „Tapering, Rhythmus, Geländebezug“; 2 : 1; Krater: Riss schmaler und flacher, bis er ausläuft; #3 Spitzen im Zickzack | Tafel #3, #4 | Lückenpaare ≥ 30 % ungleich, Ziel 2 : 1 (`spread_target` 0,5); Breite w(s) = w0 · sin(π s)^k [V] | gleich breite durchgehende Linie, erkennbarer Takt | belegt, k [V] |
| T8 | **Unregelmäßigkeit mit Grenzen** | V-749 Gleichmaß ±15 %; Ü1 Lehnrichtung ±15° mit genau einer Ausnahme; Ü2, #170 nicht alle flach; Kanon 17 (3) erst entwerfen, dann schwach verzerren; V-1004 nur langwellig, V-952 | Tafel #10, #170 | Streuung nur innerhalb der Toleranzen, sonst Saat fest | freier Zufall, Knubbel | belegt |
| T9 | **Negativraum** | #117, #170 Fläche mit größerem Objekt unterbrechen; V-799 „≥ 50 % Ruhe“; Joyride jede dritte Stelle Sichtachse; V-1036 Materialcodes nur als Behelf | Vorlage 5 (67 % leer bei 4-m-Zellen) | M_Ruhe; Boden-Gate 30 %, Ziel 50 % | Teppich, jede Fläche füllen | belegt |
| T10 | **Abbruch** | V-797 „kein Clutter“; #169 aus der Ferne wenige Schlüsselsteine; Kanon 17 (2) Mikro verändert die Lesbarkeit nicht; V-403 kleinste Stufe ≥ 3 px; V-1090 Pixel sind die Grenze; #162 Fluten kostet den Fokus | Tafel #169 | r_min aus 3 px am Ausblend-Abstand | Kleinteile unter der Sichtgrenze als Instanz | belegt |
| T11 | **Erdung und Farbe** | #10 im Gelände, nicht darauf; V-911 Bänder laufen über Steine; V-936 Farbe aus dem Band darunter; V-1100 `ground_albedo`; Grammatik §4.5 diskret statt Verlauf | `R2_etherington.jpg` | Farbe = Eltern oder Boden, diskret, Einsinken aus `rules.sink` | Fremdkörper, Farbverlauf, schwarzer Ring | belegt |
| T12 | **Zeit** | #28 Bruch, Auseinanderdrücken, Wegfliegen, Moment direkt danach; #3 das Objekt drückt Wasser erst hoch, dann zurück; #4 fächert aus, Kanten rollen ein, Ripples und Bläschen bleiben; VFX-Spec §1.4 | Tafel #4 | Geburt aus der Quelle, Ruhezustand nur mit Quelle | Aufpoppen, Alpha-Ausblenden als Ende | belegt |

**Selbst angesehen:** #3, #4, #10, #27, #28, #161, #162, #169, #170. **Nur über `WS1_R2` bzw. `ETHERINGTON_ZERSTOERUNG`:** 2-zu-1, #41/#42, #79/#80, #117, #155/#156, #173/#174, #783, #153, #15. **Etherington sagt nichts zum Uferaufbau** (R2 E6) und nichts zu Materialcodes in unserem Sinn; das sind KFB-Begriffe. Links in `CANON_3D/sources/WS1_R2_ETHERINGTON_ABGLEICH_R1.md` und `ETHERINGTON_ZERSTOERUNG_R1.md`.

## 3 · Die Fälle als Zeilen derselben Tabelle

Maße in Metern. Ohne Kennzeichen belegt aus dem genannten Papier oder Code, sonst [V].

| Fall | Quelle Q und Stärke | Richtung a(p) | Größenkurve | Dichtekurve | Gruppe | Farbe | Träger |
|---|---|---|---|---|---|---|---|
| **Gischt Ufer** | Linie h = Spiegel; Reichweite 1,2 wasserseitig (Georg-Korrektur 290c6324) | Strömung (#3), Welle aufs Land nur im Flug; Ruhe nur auf Wasser | Auf der Kante groß und halb im Wasser, dann 1,55 / 0,95 / 0,55 (im Code schon 1 : 0,61 : 0,35) | 150 / 90 / 50 je Welle (Code); Keime auf der Linie im Rhythmus 2 : 1, Uferlänge höchstens halb belegt [V] | Kern + 2–3 je Keim | Fluidfarbe aufgehellt, weißlich (V-1084) | `ballCore impact`, je Klasse ein Auslöser; 2–4 s |
| **Uferlinien** | Dieselbe Linie, vShore | Zum Land, mit dem Wellenpuls | Breite fällt nach außen und zu den Segmentenden (Tapering); Länge 1 : 0,62 : 0,38 [V]; Schaumlinie 0,3 Einheiten (WS1 Wasser) | 2–3 Linien wandern, Abstand wächst [V]; Lücken 2 : 1 | Segment-Dreier [V] | Wie Gischt | Shader `kfbWater`, nur diese Ebene |
| **Kiesel am Fels** | Ring Fuß, r_Q = Hülle; L ≈ 3,2 r_Q [V], passt zum Löser | Offene Seite: Hang und Sonne gemischt, je Fels fest (`openOf`) | r_Fels : r_Kiesel ≈ 5 : 1; innen 0,12, außen 0,07 (Messung) | `trail` 5–11, `n_near_rock` 7–16, exponentiell | Fels 3/5/7, Kiesel-Häufchen | Stein-Ton, unten Boden (V-1100) | Worker, Instanzen; Fernes als Korn im Shader |
| **Fußkügelchen Fels, Busch** | Ring Fuß, nur jeder zweite bis dritte Träger [V], Georg: „nicht zu dicht“ | Wie Kiesel; am Busch Schattenseite | r0 0,14–0,22 (`kugel_r_m`), 1 : 0,62 : 0,38 | Genau ein Bogen, Stückmaß 0,06–0,22 (`contact`) | Dreier | Palette, je Gruppe ein Ton (V-1005) | Worker → `ballCore` still |
| **Minimalform leerer Boden** | Feld: Ruhekeim im 4-m-Raster, nur bei weniger als 4 Bewuchs im Umkreis 12 (V-1036) | Hang, sonst Saat | r0 0,16–0,24 (`MC`), 1 : 0,62 : 0,38 | Abnehmend mit dem Bewuchs, ≥ 50 % bleibt leer | Dreier, Zweier nur als kleinste Form (V-1004) | Palette; ≥ 3 Codes je Blick nur auf kahlem Boden | Wie Fußkügelchen |
| **Krater, Trümmer** | Punkt mit Wucht E und Treffwinkel; Stufen Lippe, Risse, Krater; 12–18 Risse, Reichweite 0,15–0,45 R über den Rand | Treffwinkel; Risse ausnahmsweise rund, der Auswurf nie | Groß am Rand, aufgestellt; mittel auf den Strahlen, außen kleiner; Splitter im Flug weit, in Ruhe Sprenkel (V-845) | Weniger nach außen (Krater §Physik); Ruß zwischen den Strahlen | Schollen je Lücke 1–3, nie zwei gleich gekippt | Bänder über Schollen (V-911), innen dunkel, außen heller (V-855) | Höhe plus Shader (V-864), Kit-Brocken als Instanz, `impact` für Splitter |
| **Goo-Splat** | Punkt; Explosion von innen = Spritzer (#28) | Fächer aus dem Treffwinkel (#4) | Hauptklecks, Spritzer an den Spitzen der langen Strahlen, Tropfen dahinter (V-846) | Fällt nach außen | Tropfen 3/5 [V] | Zensur-Tinte #1f1a14, matt (V-583) | Shader `impactScar`; Spritzer im Flug wie Gischt [V]; Ende in Sprenkeln |
| **Kartenkante, Kugelrelief** | Tuschekante und Motivkanten | Keine beim Liegen; beim Freifahren Schieber-Tempo | **Umgekehrt:** Kante und Dunkles dichter und kleiner (`pointsFromImage`) | imp = 0,15 + 0,5 (1 − L)^1,3 + 0,9 E | Keine, Bild | Bandrollen plus Tusche | `ballCore relief` / still; Kinder enden eine Kugel vor dem Außenrand der Tusche (N-015) |
| **Fluff aus Zerstörung** | Lochkante mit Schadensereignis (Dossier 01: Ort, Richtung, Stärke, Radius, Saat) | Fächer entlang des Treffers, öffnet mit der Lochbreite | r 0,11–0,195; Reichweite 0,45 + 0,95 · klein² (spill.js) | Groß bleibt am Fuß, klein weit, kein runder Haufen (V-1071) | Sorte nach Story-Mode (V-368) | Fluff-Farben (V-292) | Flug `impact` oder Pool, Ruhe rollt bergab (`fluff.js`), Spielwert getrennt vom Bild (Dossier 03 §7–8) |

**Gleich gebaut, heute nicht im Umfang:** Fallobst, Fluff-Nester, Rauch-Lobes (BMS, V-1043), Bodenübergang über Fenster `zone=r1` (Joyride §6.3: jede Schicht ein eigenes Fenster über u). Das u aus §1 ist dieselbe Achse wie Joyrides Übergangsachse, darum `w(layer, u)` als Faktor in M_Ursache. Die Ebenen aus V-1007 (Himmel, Klang, NPC) nutzen Saat und Tabelle, nicht diese Abstandsformel.

## 4 · Technik: ein Löser, ein Kern, kein zweiter Verteiler

| Stelle | Aufgabe | Änderung gegenüber heute |
|---|---|---|
| `kfb_place.r1.json`, neuer Block `fraktal` | Einzige Zahlenquelle je Fall (V-748, V-749) | Größen aus `kfb-place-field.r2.json` ziehen beim Merge dorthin (V-1097) |
| `kfb-place-core.v1.mjs`, `kinder()` neben `nestPositions` | Rein, deterministisch, kein three, Blender und Spiel gleich | `rockGroup`, `pebbleDrift`, `contactArcs`, Materialcodes im Worker rufen sie, statt je eine eigene Formel zu tragen |
| Worker (`placeWorker.js`, Wasser-Worker) | Alles, was liegen bleibt: Kiesel, Kügelchen, ruhende Brocken, **Keimlisten entlang des Ufers** | Gruppe gehört ihrer Heimatzelle und wird ganz ausgegeben (V-830); Ufer-Keime kommen aus der Bogenlänge, nicht mehr aus Zufallspunkten um die Figur |
| Hauptfaden | Liest nur fertige Keime und löst `ballCore`-Auslöser aus | Keine Verteilung im Hauptfaden |
| `ballCore` | Alle Kugeln: `relief` still für ruhende, `impact` für fliegende. Ein Look (Q-023, `balls=r1`) | Fehlt: Fächer statt Rundum in `IMPACT_VEL`. Größe zu Weite geht schon mit drei Auslösern (`sizeK`, `spread`), wie Gischt es macht. Die Kügelchen von `addPebble` zweigen heute auf ein eigenes `InstancedMesh`; das ist der zweite Look |
| Shader | Linien und alles unter der Instanzgrenze: Uferlinien, Risse, Ruß, feines Korn, Sprenkel | Liest dieselben Zeilen als Uniform; kein eigener Abstandsbegriff |

**Budget (V-1090, V-1097, V-1107):** Dreiecke sind nicht die Grenze, Pixel sind es. Darum:
- Zählwerte in `perf.json` je Modul: Zeichenaufrufe, neue Programme, Texturspeicher. Welt-Zelle 60–100 k Dreiecke, höchstens 4 Aufrufe (V-1090).
- Kugeln sind kleine Sprites mit `discard`, Kosten folgen ihrer Bildfläche. Vorschlag: Kugelfläche ≤ 1 % des Bildes im Normalfall, gezählt über Kugelzahl und Größe [V]. Leere Plätze entfernen (V-1090).
- Kinder nur bis `near_m` 64 als Instanz, außen Korn im Shader; 500 Kugeln tragen nach dem Mess-Spike, das Kartenrelief hat eigene Fassungen (V-922).
- Fliegende Kerne ohne lebende Kugeln rechnen nichts (`ballCore`-Leerlauf), still gezeichnete Kerne rechnen nie. Das gilt schon.
- Gischt `shoreSide` 64 = 4096 Plätze, drei Auslöser mit zusammen 290 Kugeln alle 0,32 s ergeben bei 2–4,2 s Leben rund 1 800–3 800 lebende Kugeln. Das passt, reizt den Ring aber aus; ohne den Rhythmus aus T7 ist es zugleich zu viel.

## 5 · Stand gegen die Prüfung

Gerechnet mit `fraktal_ref.mjs` und dem Löser aus dem Worktree ohne Spiel, Gelände synthetisch, Saat 4711, 36 Zellen. Einzelheiten in `PRUEFUNG.md`.

| Stand | Ergebnis |
|---|---|
| Fels→Kiesel in `place=r2` | **besteht** in Moos und Pastell, Wüste knapp unter der Vorschlagsgrenze für den Quellen-Anteil (88 statt 90 %) |
| Gegenproben Kranz, Teppich, Reihe, Waise | **fallen durch**, die Prüfung trennt also |
| `ballCore impact` als Aufprall | **fällt durch:** Größe unabhängig vom Abstand, kein offener Bogen |

Skizze `SKIZZE_EINE_FUNKTION.jpg`: dieselbe Funktion mit drei Tabellenzeilen. Gerechnet, kein Spielbild.

## 6 · Quellenlage

- **Gelesen:** Register-Zeilen zum Thema; Kanon Gebiete 2, 4, 11, 15, 17, 18; beide Etherington-Papiere; `WS1_R2`; Krater; VFX-Spec; Grammatik R2; R3; Verteiler-Konzept; Flächengrammatik; Gap; Joyride §2, §6.3; Kanal N-015, N-018, N-022, Q-023, Q-025, Q-027.
- **Perplexity-Dossiers 01–04 und Übersicht:** lokal vorhanden, gezielt in den einschlägigen Abschnitten gelesen, nicht vollständig. **Sie enthalten keine eigene Verteilungsregel im Sinne dieses Musters** (Gap D6 sagte das schon). Beitrag: Schadensereignis und Impuls (01), Rauchklassen (02), vier Darstellungen und Spielwert getrennt vom Bild (03), Vorfilter vor WFC (04). Georgs „Perplexity“ meint für Verteilung vor allem `PERPLEXITY_FLAECHENGRAMMATIK`.
- **Lokal nicht lesbar, kein Fetch:** `docs/KONZEPT_UFERLINIEN_R2.md`, `docs/SPEC_KUGEL_LOOK_R1.md`, `hydroSpray.js` @290c6324, `kfbWater.js` und `terrain3.js` im Stamm @7022aa60. Nur ihre Commit-Texte sind bekannt. Gischt-Code gelesen auf @bb87eb11 (`flight-wt`). **WS1 muss das Uferlinien-Konzept R2 gegen §3 abgleichen.**
- **Nicht angesehen:** Hub-Bilder q332, q339; Abnahme-Seite von WS1; `Bauweise_Erdung.jpg`. Kein Spiel gestartet.
- **`R2_etherington.jpg`** (Lab, Etherington-Probe): gut für Eingraben und Kontakt. Das Baum-Beispiel mit Gras rund um den Stamm liegt nah am abgelehnten Kranz, darum nicht als Verteilungsmuster nehmen.
- **Vorlagen 1–5 (V-1078)** sind Bild-Chat-Erzeugnisse: Hinweis auf Logik, keine Bauanleitung (V-148). Messwerte daraus sind Vorschläge.
