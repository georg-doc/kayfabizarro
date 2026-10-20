# WASSER R1: Fluid-Material für KFB (Wasser, Kaugummi-See, Giftsumpf)

**Stand:** 21.10.2026 · **Auftrag:** Georg („wirkt nicht als Wasser") · **Gilt für:** Gelände-Probe (three.js r147, `ShaderMaterial`) und Spiel (r186/R3F), WebGL2, Mac mit ca. 17 fps
**Kennzeichnung:** [Q] = belegt (Quelle am Ende) · [B] = Befund im Code der Probe · [V] = Vermutung · [S] = Startwert, muss in der Probe kalibriert werden
**Nicht lokal:** `DECISIONS.md` und `CANON_3D_R1.md` liegen nicht auf dem Mac. V-407 und V-568 sind so wiedergegeben, wie der Auftrag sie beschreibt.

---

## 1 · Kurzfassung und Empfehlung

**Empfehlung:** ein Material „Fluid" mit gemeinsamer Basis und drei Parametersätzen (Wasser, Bubblegum Sea, Giftsumpf). Die Basis teilt die Arbeit in **Volumen** und **Haut**:

- **Volumen im Gelände-Shader.** Der Gelände-Fragment kennt seine eigene Höhe `vH` und den Wasserspiegel. Unter Wasser färbt er sich selbst nach Tiefe und Blickweg, zeichnet Kaustik und den nassen Uferstreifen. Wir brauchen **keinen Tiefen-Pass**. Den bräuchten Roystan, Cyanilux, A Short Hike und Slime Rancher [Q], weil sie das Gelände nicht als Funktion kennen.
- **Haut auf der Wasserebene.** Die Ebene wird halbtransparent und zeichnet nur, was an der Oberfläche passiert: Fresnel mit Himmelsspiegelung über unser vorhandenes `skyColor(reflect(...))`, harte Glanzlichter und Funken, Schaumringe zum Ufer, Kielwelle, Blasen.
- **Varianten = Parameter.** Viskosität heißt langsamer, länger, glatter und glänzender. Klarheit heißt, wie weit man in die Tiefe sieht. Dazu kommen Leuchten (Säure), Blasenrate und -größe sowie das Ufer-Vokabular (Schaumring, Wulst oder Zisch-Linie).

**V-407 geprüft: gilt, mit drei Ergänzungen.** Cartoon-Logik, KISS, Knet-Ringe als Schaum, stilisierte Funken und wenige Wellen sind durch Wind Waker, Slime Rancher und A Short Hike gedeckt [Q]. web-ocean bzw. FFT bleibt nur Ideen-Spender. Selbst Sea of Thieves stilisiert eine FFT-Basis [Q], und das ist für 17 fps zu teuer. **Ergänzen:** (a) Blickwinkel-Abhängigkeit (Fresnel plus Himmel) ist Pflicht und kostet fast nichts. (b) Die Tiefe kommt analytisch aus der Geländehöhe. (c) Bewegung läuft auf Echtzeit, nicht auf der Fließuhr (siehe §3).

---

## 2 · Technik × Beispiel × Wirkung × Kosten

Kostenklassen im Browser: **0** = ein paar Rechenoperationen · **g** = gering (≤ 4 Textur- bzw. Rauschzugriffe) · **m** = mittel (Voronoi 3×3, Schleifen) · **h** = hoch (zusätzlicher Szenen-Pass)

| Technik | Beispiel | Wirkung | Kosten | Quelle |
|---|---|---|---|---|
| Tiefenfärbung (flach → tief, 2–3 harte Stufen) | Roystan (Max. 1,0; Flach/Tief), Alisavakis (3 Stufen), Slime Rancher (Rot weg mit der Tiefe) | **wichtigstes Wasser-Signal**: Grund scheint durch, Tiefe wird dunkel | **0**, wenn analytisch im Gelände; **h** über den Tiefen-Pass | [1][3][9] |
| Absorption je Farbkanal (Beer-Lambert) | gameidea: k = (0,3; 0,06; 0,02) | realistischerer Farbverlauf, Rot verschwindet zuerst | 0 | [12] |
| Uferschaum aus Tiefendifferenz | Roystan (0,04–0,4, über die Normale angepasst), A Short Hike, Minions Art | klare Schnittlinie Wasser/Land | 0–g | [1][10][11] |
| Schaumbreite nach Steigung normieren | Roystan (Normale), Crest (Warnung: Tiefen-Schwelle ≠ Abstand) | gleich breites Band an flachen und steilen Ufern | 0 | [1][15] |
| Wandernde Schaumlinien zum Ufer (sin über Uferabstand) | Alisavakis (8π → 4 Linien), Ghibli-Schaum sin(d+t) mit Rauschen | „Brandung", liest sofort als Fluid | g | [3][13] |
| Atmendes Ufer / Nass-Sand | Animal Crossing-Nachbau (Schaum und nasser Sand atmen) | Wasserlinie bewegt sich, Sand dunkelt nach | 0 | [14] |
| Scrollende Normalen (2 Lagen, gegenläufig) | three.js Water2, BotW-Nachbau, Alisavakis | lebendige Oberfläche ohne Geometrie | g | [5][7][3] |
| Flowmap | Valve Portal 2 | Strömung um Hindernisse (Fluss, Überlauf) | g + Textur | [16] |
| Wind-Waker-Gitter (2 überlagerte Muster, verwackelt per Sinus) | Wind Waker, WATER_SPEC | ikonischer Cartoon-Ozean, sehr billig | g | [4][17] |
| Gerstner-Wellen (Vertex, 3–4 Wellen, Summe der Steilheit ≤ 1) | Catlike, Ameye (4 Wellen) | Silhouette und Schaukeln, Auftrieb auf der CPU nachrechenbar | m (braucht ein Gitter) | [18][8] |
| Fresnel + Himmelsspiegelung | Genshin (128²-Himmelstextur für Spiegelung und Nebel), Slime Rancher | Wasser ändert sich mit dem Blickwinkel, der Horizont spiegelt | **0** mit `skyColor` | [6][9] |
| Planare Spiegelung / Reflector | three.js Water, Water2 | echte Inselspiegelung | **h** (zweiter Szenen-Render) | [7] |
| Stilisierte Glanzlichter (Schwellwert) | Ameye (hart/weich), WATER_SPEC (Funken auf Kämmen) | „nass", Sonnenpfad | 0 | [8][17] |
| Kaustik am Grund (Voronoi oder 2 Gitter) | Cyanilux, BotW-Nachbau, gameidea | klares Flachwasser | m (Voronoi) / g (Gitter) | [2][5][12] |
| Brechung / Verzerrung | Cyanilux 0,02, Slime Rancher | Grund wackelt | h (braucht Szenenfarbe) – **weglassen** | [2][9] |
| Interaktion (Ringe, Kielwelle) | Alisavakis (Ortho-Kamera → Ripple-Textur) | Material reagiert auf den Racer | g (analytisch) / m (Ping-Pong 256²) | [3] |
| Glänzende dicke Flüssigkeit (Normale aus Höhe, starker Glanz) | Splatoon-Tinte | Kaugummi, Schleim | g | [19][20] |
| Blasen: wachsen, wackeln, platzen | Kessel-Shader (gestufter Fresnel-Rand, Pop über Lebenszeit), Polycount Lava-Blase | Blubbern, Viskosität sichtbar | g (Zellraster) | [21][22] |
| Voronoi-Kruste + leuchtende Risse | Ilett Lava, Minions Art Lava | Lava, Säure-Kruste | m | [23] |

**Ohne technische Quelle:** Mario Odyssey (Gift dort dicker, teerartig; pinke Lava im Luncheon Kingdom [Q 24]), BotW-Malice (schwarz-magenta, teerig, mit Augen [Q 25]), Tunic, Spyro Reignited, Tiny Glade: zu Wasser keine Shader-Aufschlüsselung gefunden. Ableitungen daraus sind [V].

---

## 3 · Warum unser Wasser nicht als Wasser liest, und Gegenmittel

| # | Ursache (Code-Befund [B]) | Gegenmittel |
|---|---|---|
| U1 | **Deckend, eine Farbe, keine Tiefe** (`waterMat` `transparent:false`, Farbe = Palette × Tint). Flach und tief sehen gleich aus, Wasser liest wie lackierter Boden. | Volumen im Gelände: Tiefen-Stufen, der Grund scheint im Flachen durch |
| U2 | **Keine Blickwinkel-Abhängigkeit.** Kein Fresnel, keine Spiegelung, kein Glanz; die Fläche sieht aus jeder Richtung gleich aus. | `skyColor(reflect(rd,n))` × Fresnel; harte Sonnen-Glanzlichter |
| U3 | **Steht praktisch still.** Die Striche driften mit `uTimeT*0.01`, und `uTimeT` ist die *Fließuhr* (läuft mit dem Racer-Tempo schneller). Das Wasser hängt also am Spieler, nicht an der Physik. Das Schaumband hat gar keine Zeit. | Eigene Echtzeit `uTime` für Fluide; jede Zutat bewegt sich mit eigener Periode |
| U4 | **Uferband liegt auf dem Land.** Foam = Höhe 0 … +0,32 über dem Spiegel (Gelände-Shader). Es hat feste Höhenbreite (an steilen Ufern dünn, an flachen breit), ist durchgehend und bewegt sich nicht. Ergebnis: liest wie ein Sand- oder Schneestreifen, also „helle Banden". | Uferzone neu ordnen (§4): Schaumlinie *auf* dem Wasser, gebrochen und wandernd; nasser Streifen auf dem Land; Breite über die Steigung normieren |
| U5 | **Striche sind Höhenlinien.** `fract(noise*6 + linear)` erzeugt Isolinien, die wie eine Landkarte oder Holzmaserung aussehen, nicht wie Wellen. | Wind-Waker-Prinzip: 2 verwackelte Muster (hell und dunkel versetzt), die gegeneinander scrollen |
| U6 | **Harte Schnittlinie ohne Übergang** zwischen der opaken Ebene und dem Gelände (gewollt: „verwaschen wirkte wie ein Fehler"). | Die Linie bleibt scharf, aber als **Schaumlinie**, dahinter gestufte (nicht weiche) Tiefe |
| U7 | **Keine Reaktion.** Der Racer fährt über die Ebene (`groundAt` klemmt auf den Spiegel), ohne Spur. | Kielwelle und Ringe (Stufe 3) |
| U8 | **Ebene mit 1×1 Segment.** Keine Silhouette und kein Schaukeln möglich. | Erst Stufe 4 (Gitter, das dem Spieler folgt, wie A Short Hike und Wind Waker [Q 10][4]) |

---

## 4 · Bauvorschlag in Stufen (günstig → aufwendig)

**Stufe 1: Volumen + Haut + Ufer-Zone (Kern, ca. 0 Zusatzkosten).** Gelände-Shader, nur Fragmente mit `vH < wl`:

```glsl
float d  = wl - vH;                                   // senkrechte Tiefe
float L  = d / max(abs(rd.y), 0.15);                  // Blickweg durchs Fluid
float k  = 1.0 - exp(-L / uClarity);                  // 0 flach … 1 tief
k = floor(k*uSteps + 0.5)/uSteps;                     // 3 harte Stufen (Cartoon), mit fwidth-AA weichzeichnen
col = mix(col * uShallowTint, uDeep, k);              // Grund wird zur Tiefe
```

Die Wasserebene wird `transparent:true`, `depthWrite:false`. Alpha = `mix(uAlphaMin, 1.0, F)` mit `F = F0 + (1−F0)·(1−cosθ)^uFresP`. Farbe = `mix(uSurf, skyColor(reflect(rd,n))*uSkyRefl, F)` + Glanz `step(uSpecCut, pow(max(dot(reflect(rd,n),uSunDir),0.),uSpecExp))`. Der Overdraw bleibt wie heute (die Fläche wird schon gezeichnet), nur jetzt mit Blending. In den Ring-Shadern (`RINGS`) dieselbe Funktion in grober Form, sonst gibt es einen Bruch an der Ringgrenze [V].

**Ufer-Grammatik (Kanon V-568: Ufer als eigene Zone).** Fünf Bänder vom Wasser zum Land. Breiten sind *horizontal* gemeint, umgerechnet über die Steigung aus `vN`: `dx ≈ dz · vN.y / max(length(vN.xz), 0.05)`. Dann bleibt das Band an jedem Hang gleich breit [Q 1][15].

| Band | Wasser | Kaugummi | Säure |
|---|---|---|---|
| ① Tiefe | gestufte Tiefenfarbe | fast deckend, rosa Unterlicht | trüb, grünes Leuchten von unten |
| ② Flachwasser | Grund sichtbar, Kaustik (Stufe 2) | Grund kaum sichtbar | Grund dunkel verfärbt |
| ③ Uferlinie (am Spiegel) | gebrochene Schaumringe, 2–3 wandern zum Land | **Wulst**: Rand gewölbt, Glanzlinie oben, dunkle Kontaktlinie | **Zisch-Linie**: gelbgrün, flackernd, kleine Blasen |
| ④ Nassband (Atem-Zone) | Wasserlinie atmet ± 0,08 Höhe [S], Periode 4,5 s; Sand dahinter 25 % dunkler und glänzend | rosa Schlieren und Fäden, klebrig glänzend | gebleicht bzw. verätzt: Sättigung −60 %, Helligkeit −30 % |
| ⑤ Sand- und Kiesband | E6: 0,6–3,4 Einheiten (R2) | wie Wasser | totes Gras, grüner Widerschein bis 1 Einheit über dem Spiegel |

Startwerte Stufe 1 [S]: `uClarity` = 0,35·wl (begrenzt auf 0,6–3 Einheiten; in „Sanfte Hügel" ist wl ≈ 1,8), `uSteps` = 3, F0 = 0,08, `uFresP` = 4, `uAlphaMin` = 0,35, `uSkyRefl` = 0,7, `uSpecExp` = 220, `uSpecCut` = 0,55. Schaumlinie 0,3 Einheiten breit, Normalen aus 2 Lagen einer **einmal beim Start erzeugten** 256²-Rausch-Textur (kein Download): Maßstab 1/18 und 1/7 Einheiten, Drift 0,35 bzw. 0,6 Einheiten/s, Stärke 0,15. Das ist billiger als `snoise` je Pixel; die Wasserebene ruft heute 5× `snoise` auf (3 eigene + 2 in `applyAir`) [B].

**Stufe 2: Uferkarte (Höhen-Textur, einmalig je Ring-Sprung).** Die GPU-Funktion `hgt()` einmal in ein 256²-Ziel über 600 Einheiten rendern, also im Raster des Nahgitters (`SIZE=600, SEG=256`) [B]. Neu backen, wenn der Ring springt (das passiert ohnehin). Die Haut kennt damit die Tiefe *an der Oberfläche*. Daraus:

- Uferabstand ≈ Tiefe / Steigung, aus dem Gradienten der Textur; kein Jump-Flood nötig [V].
- Schaumringe `step(0.75, sin(2π(dist/1.2 − t/3.5)))·(1−dist/3)·Rauschmaske` [S], nach Alisavakis und Ghibli [Q 3][13].
- Wellen in Ufernähe dämpfen.
- Kaustik: 2 überlagerte, gedrehte Gitter (billiger als Voronoi), nur bei k < 0,5.

Für R3F gilt dasselbe Prinzip, auch wenn das Spiel kein analytisches Gelände hat: Gelände einmal per Ortho-Kamera von oben als Höhe rendern [V].

**Stufe 3: Interaktion und Blasen.** Kielwelle analytisch: die letzten 12 Racer-Positionen mit Zeitstempel als Uniform-Array; je Punkt ein Ring `r = 2.5·(t−tᵢ)`, Ausblenden über 2,5 s, nur im Umkreis von 15 Einheiten [S]. Später optional eine Ping-Pong-Wellengleichung (256² um den Racer, 2 kleine Passes). Blasen im Zellraster: je Zelle Hash → Phase. Lebenszyklus:

- Wachsen als Kuppel (Glanzpunkt zur Sonne, gestufter Fresnel-Rand [Q 21]),
- Zittern,
- Platzen als Ring plus kurzer dunkler Krater,
- Pause.

Der Blasenradius bleibt < ½ Zelle, dann reicht **1 Zelle statt 3×3**. Dampf (Säure): 4–6 Billboard-Wölkchen, die über Blasen-Positionen recycelt werden.

**Stufe 4: Geometrie.** Gitter (z. B. 96×96, innen dicht, außen grob), das dem Spieler folgt [Q 10]. 3 Gerstner-Wellen: (0°, s 0,15, λ 14), (55°, 0,10, 8), (−30°, 0,07, 5); Summe 0,32 ≤ 1 [Q 18][S]. Amplitude × smoothstep(0, 1,5, Tiefe), damit das Ufer ruhig bleibt. Kaugummi: Blasen heben die Vertices als Kuppel an. Erst prüfen, wenn die fps es erlauben.

**Parametersätze [S]**

| Parameter | Wasser (Piraten-Insel) | Bubblegum Sea | Giftsumpf |
|---|---|---|---|
| Flach / Tief | Palette `water`×1,3 / ×0,55 | #ffb3dc / #d9468f | #b6ff4a / #24401a |
| Klarheit `uClarity` | 0,35·wl | 0,05·wl (fast deckend) | 0,12·wl (trüb) |
| Normalen-Stärke / Drift | 0,15 / 1,0× | 0,04 / 0,3× (zäh) | 0,08 / 0,6× |
| Wellen λ / Tempo | 1× / 1× | 2× / 0,35× (dicke, langsame Dünung) | 1,3× / 0,6× |
| Glanz `uSpecExp` / Funken | 220 / Sternfunken | 450, breite weiße **Haube** auf Kuppeln (Splatoon-Prinzip) | 120 / keine |
| Fresnel F0 / Himmel | 0,08 / 0,7 | 0,04 / 0,35 (Plastik-Glanz) | 0,05 / 0,4 |
| Leuchten (Emission) | 0 | 0,1 (Unterlicht rosa #ffd1ea) | 0,35 Fläche, 0,8 an Blasen und Zisch-Linie |
| Blasen: Zelle / Radius / Leben / Rate | aus | 4 E. / 0,6–1,4 / 3–5 s / 0,25 je s; selten Riesenblase 2–3 E. | 1,5 E. / 0,15–0,35 / 1–1,5 s / 1,5 je s |
| Ufer ③ | Schaumringe weiß | Wulst + Glanzlinie | Zisch-Linie #e6ff7a |
| Extra | Kaustik | Fäden am Ufer (Stufe 4) | Dampf-Billboards, verätzter Sand |

---

## 5 · Abnahme, offene Fragen, Quellen

**Messbare Abnahme-Kriterien**

1. **Kosten:** Stufe 1+2 kosten ≤ 1 fps auf Georgs Mac (Referenz 17 fps, feste Prüfkamera `__probeCam`). Kein zusätzlicher Szenen-Render; Uferkarte ≤ 5 ms je Neubacken.
2. **Tiefe lesbar:** Im Standbild ist der Helligkeitsabstand zwischen Flachwasser (k < 0,2) und Tiefe (k > 0,9) ≥ 15 L\*-Punkte. Die Uferlinie bleibt scharf: Übergang ≤ 2 px.
3. **Blickwinkel:** Bei Blick flacher als 10° liegt die Wasserfarbe innerhalb ΔE ≤ 12 von `skyColor` in Spiegelrichtung. Bei Blick steiler als 60° ist der Grund im Flachwasser sichtbar.
4. **Bewegung:** Jede Zutat läuft auf Echtzeit, unabhängig vom Racer-Tempo. Schaumringe Periode 3–5 s, Ufer-Atem 4–5 s. Im 2-s-Clip stimmen keine zwei Bilder im Wasserbereich überein.
5. **Uferbreite:** Die Schaumlinie ist an Hängen von 5° bis 40° gleich breit (Faktor ≤ 1,5). Messung an 3 Prüfpunkten.
6. **Blindtest:** 5 Standbilder je Variante an 3 Personen (Georg + 2). ≥ 80 % benennen „Wasser/Flüssigkeit" bzw. unterscheiden Kaugummi und Säure richtig.
7. **Varianten:** Umschalten nur über Parameter (ein Shader, höchstens ein Define je Variante), Live-Wechsel in der Probe.
8. **Interaktion:** Die Kielwelle erscheint ≤ 0,1 s nach dem Eintauchen und klingt in 2–3 s ab. Kein Flimmern an Schaum- und Blasenkanten (fwidth-AA) in 3 Entfernungen.

**Offene Fragen (max. 5)**

1. Ist Fluid befahrbar (Racer schwimmt, wie heute über `groundAt`), Hindernis oder Gefahr (Säure schadet)? Das entscheidet über Kielwelle und Auftrieb in Stufe 4.
2. Darf die Kamera je unter die Oberfläche? Annahme: nein, wie in BotW [Q 5]. Das hält den Shader einfach.
3. Wie wird die Variante gewählt: je Insel bzw. Biom (Palette) oder gemischt in einer Szene (Kaugummi-See neben Wasser)?
4. Reichen Himmelsspiegelungen, oder sollen sich Inseln spiegeln (Etherington #289, R2)? Echte Spiegelung kostet einen zweiten Render; eine Attrappe wäre [V].
5. Spiel (R3F): Hat das Gelände dort eine Höhenfunktion wie `hgt()`? Sonst gilt der Weg „Höhe per Ortho-Kamera backen" (Stufe 2).

**Quellen**

1. Roystan, Toon Water: https://roystan.net/articles/toon-water/
2. Cyanilux, Water Shader Breakdown: https://www.cyanilux.com/tutorials/water-shader-breakdown/
3. H. Alisavakis, Stylized water shader: https://halisavakis.com/my-take-on-shaders-stylized-water-shader/
4. Simon Schreibt, Wind Waker (Ebene folgt dem Boot, Wellenebene blendet ein): https://simonschreibt.de/gat/zelda-wind-waker-hyrule-travel-guide/ · N. Gordon, WW-Analyse (403, nicht gelesen): https://medium.com/@gordonnl/the-ocean-170fdfd659f1
5. 80.lv, BotW-Wasser-Nachbau (Tiefenpuffer-Nebel, Kaustik, Kamera immer über Wasser): https://80.lv/articles/caustic-surface-production-guide
6. Genshin-Rendering (Himmelstextur 128² für Wasserspiegelung, SSR auf Wasser; Sekundärquelle ohne Beleg, daher schwach): https://parsers.vc/news/250124-the-art-of-game-rendering--a-deep-dive-into/
7. three.js Water/Water2, Reflector-Kosten: https://threejsresources.com/guides/water · https://github.com/mrdoob/three.js/pull/12341/files
8. Ameye, Stylized Water Shader: https://ameye.dev/notes/stylized-water-shader/
9. Monomi Park (Slime Rancher), Ozean-Shader: https://blog.monomipark.com/post/139862950537/hello-im-ian-and-ive-taken-the-task-of-leading
10. adamgryu (A Short Hike), Ebene folgt dem Spieler, Ufer über Tiefenpuffer: https://x.com/adamgryu/status/1112783007566450691 · https://threadreaderapp.com/thread/1113100182655262721.html
11. Minions Art: https://minionsart.github.io/tutorials/
12. gameidea, Stylized 3D Water (Beer-Lambert-Werte, Voronoi-Kaustik): https://gameidea.org/2026/02/01/creating-a-stylized-3d-water-shader/
13. J. Panuelos, Ghibli-Schaum sin(d+t): https://jpanuelos.com/2020/10/18/GhibliWater.html
14. D. Feargrieve, Beach Waves (Animal-Crossing-Ufer): https://feargrieve.wordpress.com/portfolio/beach-waves-shader/
15. Crest, Shoreline-Foam-Hinweis: https://crest.readthedocs.io/en/4.12/user/ocean-simulation.html
16. A. Vlachos, Water Flow in Portal 2: https://advances.realtimerendering.com/s2010/Vlachos-Waterflow(SIGGRAPH%202010%20Advanced%20RealTime%20Rendering%20Course).pdf
17. WW-Stil-Spec: https://github.com/paulriordanfb/stylized-water/blob/master/WATER_SPEC.md · https://godotshaders.com/shader/wind-waker-water-no-textures-needed/
18. Catlike Coding, Waves (Gerstner, Steilheit ≤ 1): https://catlikecoding.com/unity/tutorials/flow/waves/
19. VFX Mike, Splatoon in Unity: https://vfxmike.blogspot.com/2017/04/splatoon-in-unity.html
20. Splatoon-Tinten-Demo (Höhe → Normale): https://www.artstation.com/artwork/y4neQQ
21. D. Feargrieve, Bubbling Cauldron: https://feargrieve.wordpress.com/portfolio/bubbling-cauldron-potion/
22. Polycount, Lava bubble popping: https://polycount.com/discussion/178536/lava-bubble-popping-effect
23. D. Ilett, Voronoi Lava: https://danielilett.com/2023-06-20-tut7-2-voronoi-lava/
24. Mario Wiki, Poison / Lava: https://www.mariowiki.com/Poison_(obstacle) · https://www.mariowiki.com/Lava
25. Zelda Wiki, Malice: https://zeldawiki.wiki/wiki/Malice
26. Sea of Thieves, SIGGRAPH 2018 (FFT nach Tessendorf, stilisiert; Schaum aus der Choppiness-Maske; nur Abstract gelesen): https://dl.acm.org/doi/10.1145/3214745.3214820

---

**Zusammenfassung:** Unser Wasser liest nicht als Wasser, weil es deckend und einfarbig ist, sich mit dem Blickwinkel nicht ändert, auf der Fließuhr statt auf Echtzeit läuft und den Uferschaum als festes Band *auf das Land* malt. Empfehlung: ein Material „Fluid" aus Volumen (Tiefe, Kaustik und Nassband im Gelände-Shader, analytisch aus `vH`, ohne Tiefen-Pass) und Haut (halbtransparente Ebene mit Fresnel × `skyColor`, harten Glanzlichtern, Schaumringen, Kielwelle, Blasen). Varianten sind Parametersätze: Wasser, Bubblegum Sea (zäh, glänzend, Kuppelblasen, Wulst-Ufer) und Giftsumpf (trüb, leuchtend, Zisch-Linie, Dampf, verätzter Sand). V-407 gilt, ergänzt um Fresnel/Himmel, analytische Tiefe und Echtzeit. Vier Stufen von ca. 0 Zusatzkosten bis Gerstner-Gitter, 8 messbare Kriterien, 5 offene Fragen.
Pfad: `/Users/georgvonwestphalen/kfb-ws1/research/wasser/WASSER_R1_RECHERCHE.md`
