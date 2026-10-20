# Ferne und Luftperspektive ohne Nebelwand · R1 · 2026-10-21

**Anlass:** Georg (21.10.): Zwischen Gelände und Bergkulissen liegt eine helle Schicht. Sie wirkt wie Zwischenschicht, Kuppelgrenze oder Nebelwand und zerstört das Raumgefühl.
**Baut auf:** R13 (H1–H23), R10 (Noble, Lozzi, Vordergrund-Masse), R12 (5-Ebenen-Staffel). Was dort steht, wird hier nur verwiesen.
**Stand:** Recherche-Ergebnis, kein Kanon, WS0 entscheidet. Nur Webseiten gelesen. Kein Repo verändert. Die Probe habe ich nur gelesen (`~/kfb-ws1/probe/gelaende-probe.html`).
**Kennzeichnung:** [Q] gelesen · [Q\*] nur Suchauszug · [V] mein Vorschlag oder meine Rechnung · [KFB] Kanon, R-Dateien oder Code · [M] Ausschalt-Probe der Koordination vom 21.10. (gleiche Kamera, Palette mesa, Tag).

---

## 1 · Diagnose

1. **Hauptursache ist der Fuß der Kulissen** [M, KFB]. Der Shader rechnet `col = mix(far, skyColor(rd), pow(1−smoothstep(0, 0,7, hN), 1,7) · 0,97)`. Damit läuft jeder Ring über die unteren 70 % seiner Höhe fast vollständig in die Himmelsfarbe aus. R13-H14 hatte 30 % vorgeschlagen. Schaltet man die Kulissen aus, ist das Band weg (C). Ein längeres Gelände (B) und ein Horizont-Glow von 0 (D) ändern kaum etwas.
2. **Die Werte kehren sich um, und das liest das Auge als Gegenstand** [V, gerechnet für mesa/Tag]. Von unten nach oben ergibt sich:
   - fernes Gelände ≈ L\* 70–78 (Luft = `uAirTint`, halb Horizont, halb Zenit, dazu die kühleren Staffeln)
   - Kulissenfuß ≈ L\* 88–90 (reine Horizontfarbe `#f6d6b8`, L\* 87,6, plus Glow und Sonnenverlauf)
   - Bergkörper ≈ L\* 60–73
   - Himmel ≈ L\* 88

   Ein Helligkeitsmaximum zwischen zwei dunkleren Zonen ist kein Dunst mehr. Es ist eine eigene Schicht. Das verletzt die Regel, dass Ferne nie heller ist als das, was dahinter liegt (runevision; R13-H10), nur nach unten statt nach oben.
3. **Das Band ist über alle drei Ringe gleich hoch.** Alle drei Ausläufe beginnen auf derselben Welthöhe y = 0, also am Horizont. Ihre hellen Zonen überlagern sich zu einem einzigen waagrechten Streifen, über die Breite gleichmäßig und von keiner Silhouette unterbrochen.
4. **Die Ringe stehen zu niedrig.** Sichtbar sind die Gipfel bei +1,5° / +3° / +5°, gemessen von Höhe 0 aus. Vom eigentlichen Bergkörper bleibt nur das obere Drittel als dunkler Saum über dem hellen Streifen. Jede Kamerahöhe h senkt die Kämme zusätzlich um etwa h/R rad.
5. **Die Kulissen fahren mit der Kamera** [KFB, Code: `K.m.position.set(camera.position.x, 0, camera.position.z)`]. Sie zeigen deshalb keine Parallaxe und verhalten sich wie die Himmelskuppel. Das stützt den Eindruck „Kuppelabgrenzung“. R13-H14 wollte sie weltfest haben. [V: nicht gemessen, plausibel als zweite Ursache.]
6. **Die Luftfarbe der Ringe ist die falsche.** Sie mischen auf `skyColor(rd)`, also auf den hellsten, wärmsten und blassesten Ton am Horizont, statt auf eine eigene, kühlere Luftfarbe je Ebene. Gelände und Kulissen streben so verschiedenen Zielfarben zu. Dazwischen entsteht eine Naht.

**Welche R13-Regeln beteiligt sind:**

| R13 | Anteil | Korrektur |
|---|---|---|
| H14 Fuß „k → 1“ zur Himmelsfarbe | **Hauptursache** (Code 70 %, Ziel `skyColor`) | Fußdunst streichen; ganze Ebene in einem Schritt tönen (P9) |
| H6 Nebel = Himmel in Blickrichtung | richtig nur für die **letzte** Schicht vor echtem Himmel | Zwischenebenen bekommen eigene Luftfarbe (P11) |
| H13 Geländekante im Himmel | richtig ohne Kulissen (C), falsches Ziel mit Kulissen | Gelände endet im Ton von K1 (U3) |
| H2 Horizont = hellste Linie | für den Himmel richtig; unter dem Kamm gering (D) | Gelände und Kulissen lesen `skyColor` nicht unterhalb des Horizonts |
| H5 Bodendunst | harmlos, solange verdeckt; speist aber den Geländenebel hell | wie H2 |

---

## 2 · Prinzipien

**P1 · Werte laufen stetig auf den Schleier zu und kehren nie um.** Mit der Entfernung wird Dunkles heller, geometrisch statt linear (Gurney 2013, Faustregel: eine Wertstufe je etwa 2 Meilen) [Q]. Ein Berg ist nie blasser als der Himmel direkt dahinter (runevision) [Q]. Daraus folgt: Kein Ort unterhalb einer Kammlinie ist heller als die Ebene darüber und der Himmel über dem Kamm [V]. **Gilt für KFB, Kernregel.**

**P2 · Wert-Kompression je Ebene.** In der Ferne wird nicht nur heller gemalt, auch die Spanne zwischen hell und dunkel schrumpft. Je enger die Spanne, desto ferner wirkt die Fläche [Q\* Draw Paint Academy; Q Gurney 2013]. Für KFB heißt das: Licht- und Schattenton einer Kulisse rücken pro Ring zusammen (U6). **Gilt.**

**P3 · Sättigung nimmt ab, aber nicht linear zu Grau.** Die mittlere Ferne ist **satter und tiefer blau**, erst die äußerste wird blass. Die Luft geht von durchsichtig über blau zu fast weiß (runevision) [Q]. Besonnte Flächen behalten ihre Eigenfarbe länger als Schattenseiten [Q runevision; R13-H11]. **Gilt, mit Anpassung:** Statt Blau nimmt KFB die Luftfarbe des Bioms (P12).

**P4 · Farbtemperatur kippt mit der Blickrichtung.** Normalfall: Die Ferne wird kühler. Ausnahme: Im Blick zur tiefen Sonne, bei Dunst oder Staub, wird sie wärmer (Hudson River School). Diese umgekehrte Luftperspektive gibt es nur bei Sonnenauf- oder -untergang [Q Gurney 2007]. Nachts laufen die Ebenen auf den hellen, violetten Nachthimmel zu, die Ferne wird also heller [V]. **Gilt, richtungsabhängig gerechnet (U7).**

**P5 · Kanten: Silhouette bleibt hart, nur ihr Kontrast fällt.**
- Die Malerei weicht ferne Kanten auf (Draw Paint Academy [Q\*]). Oga legt die fernen, nebligen Partien nass in nass an und setzt scharfe Details zuletzt [Q Gurney 2017; Animation Obsessive].
- Die Cartoon- und Designlinie hält ferne Kanten hart. Eyvind Earle malte Vorder- und Hintergrund gleich scharf, in der Tradition van Eycks und der Flamen [Q\* Suchauszug; Earles Vorbilder selbst sind Q Walt Disney Family Museum]. Firewatch lässt ferne Grate in flachen Plakatfarben auslaufen [Q Alisavakis/csarko.sh zu Ng].
- **Für KFB mit Anpassung:** Kämme bleiben geometrisch hart (≤ 2 px), die Innentöne werden mit der Entfernung weniger (3 → 2 → 1). Nur der Himmel und die Luft dürfen weich sein (P9).

**P6 · Detail nimmt ab und wird stilisierter.**
- Firewatch senkt bei fernen Bäumen den Alpha-Schwellwert. Sie werden dadurch puffiger und einfacher [Q Ng, GDC 2016, Sprechernotizen].
- Sable blendet Umrisslinien mit der Entfernung aus, damit nichts aufploppt [Q Game Developer].
- Oga malt erst die großen Flächen, dann das Detail [Q].
- **Gilt:** K1 trägt Biom-Flächen, K2 nur noch halb so viele, K3 keine (U6).

**P7 · Wenige Ebenen, die sich überlappen.**
- Die Ferne liest sich als gestapelte Farbformen (runevision) [Q].
- Firewatch: deutlich getrennte Farbschichten (R13-H14).
- Blevins: Vordergrund dunkel, Mittelgrund hell, Hintergrund am hellsten (R10-01).
- Bei Sky: Children of the Light müssen Hintergrundbauten nur Silhouette, Tiefe und Komposition tragen [Q 80.lv, Flora Yu].
- **Gilt, mit Zusatz [V]:** Jede Ebene muss die nächste sichtbar schneiden, also Kamm vor Kamm auf ≥ 30 % des Rundblicks. Der Fuß jeder Ebene liegt hinter der Ebene davor, nie frei vor dem Himmel.

**P8 · Weltfest mit Parallaxe, wenigstens teilweise.**
- Arcane, die TF2-Skybox und Wind Waker sind in R13-H14 belegt.
- Ori setzt auf weitläufige, geschichtete Hintergründe mit Parallaxe und auf eigenen Nebel, dessen Farbe über die Tiefe einblendet [Q\* Suchauszug, Primärquelle nicht lesbar].
- Der Multiplan-Gedanke dahinter: Ferne Ebenen bewegen sich weniger [V].
- **Gilt:** Kulissen werden teilweise mitgeführt, mit festem Faktor je Ring (U5).

**P9 · Harte Fläche und weicher Verlauf ergänzen sich, sie konkurrieren nicht** (Georgs Road-Runner-Befund).
- **Belege:**
  - Lozzi: harte Frisket-Formen über einer durchscheinenden Himmels-Grundfarbe, Schwamm nur als Textur in der Fläche [Q John K 2006].
  - Firewatch: Himmel aus additiven Bausteinen (Verlauf, Sonnenscheibe, Sonnenhof, Horizont-Halo) [Q Campo Santo, R13-H2]; davor flache Plakat-Grate [Q].
  - tinyskies: runder Lichthof um die Sonne (R13).
  - Gurney: doppelter Himmelsverlauf (R13-H1).
- **Regel [V]:**
  - **Verlauf gehört der Luft und dem Licht.** Dazu zählen der Himmel (vertikal und seitlich), der Sonnenhof als additiver Glanz auf dem Himmel und die Luft zwischen den Ebenen. Die Luft zwischen den Ebenen erscheint **als Stufe**: Der Verlauf wird **über** die Ebenen verteilt, nicht **in** sie gelegt.
  - **Harte Kante gehört dem Körper.** Dazu zählen Kämme, Konturen, die Stufenlicht-Grenze und die Biom-Flächen.
  - Jede harte Kante hat einen Verlauf **hinter** sich, nämlich Himmel oder hintere Ebene. Deshalb wechselt ihr Kontrast entlang der Kante.
  - **Verboten:** ein Verlauf, der direkt unter einem Kamm parallel zu ihm über die ganze Breite läuft. Genau das ist unser Band.
- **Gilt, Kernregel.**

**P10 · Nebel hat drei Formen, keine davon ist ein Band.**
- **(a) Distanz als Farbrampe:** In Firewatch ist die Nebelfarbe ein gemalter Verlauf nach Entfernung, je Tageszeit einer [Q Alisavakis; csarko.sh].
- **(b) Höhennebel nur in Senken:** Die Dichte fällt mit der Höhe (Quilez) [Q]. Oga beobachtet Nebel, der aus Tälern steigt [Q].
- **(c) Nebel je Biom und Tageszeit:** Sable nennt den Fernnebel „really, really key“ für die Lesbarkeit und stimmt ihn je Biom ab [Q Game Developer]. BotW färbt den Nebel aus Sonnen- und Himmelslicht (Inscatter) [Q, Community-Analyse ResetEra, schwach].
- **Gegenbeispiel:** Overgrowth legt einen unscharfen Streifen aus Himmelsfarbe über den Horizont [Q Wolfire 2009]. Für Realismus ist das eine gute Brücke, im Cartoon-Look entsteht genau unsere Zwischenschicht.
- **Urteil:** (a), (b) und (c) gelten für KFB, das Horizontband **nicht**.

**P11 · Nebelfarbe ist nicht gleich Himmelsfarbe am Horizont.**
- runevision beschreibt das Dilemma [Q]: Nebel in Zenitfarbe wirkt am Horizont falsch. Nebel in Horizontfarbe macht Gipfel blasser als den Himmel dahinter.
- Lösung [V]: Mittlere Ebenen nähern sich der **oberen**, kühleren Himmelsfarbe. Nur die letzte Ebene nähert sich der Horizontfarbe, und auch sie erreicht sie nie. `skyColor(rd)` bleibt das Ziel nur dort, wo wirklich Himmel dahinter liegt, also beim Gelände ohne Kulissen (Befund C).
- **Ändert R13-H6.**

**P12 · Biom-Farbe bleibt erkennbar, die Luft ist biomspezifisch.** Sable stimmt den Nebel je Biom ab [Q]. Lozzi lässt eine Grundfarbe durch alle Flächen scheinen [Q, R10-21]. Startwert: Luft eines Bioms = 70 % Himmel-Mitte der Stimmung und 30 % die Rolle `sky` des Bioms. Der Farbton einer Kulisse dreht pro Ring nur teilweise zur Luft (U8) [V]. **Gilt.**

**P13 · Repoussoir: Ein dunklerer Vordergrund schiebt die Ferne weg.**
- Gurney beschreibt den Repoussoir, den Vordergrund im Schatten als Konvention und den Schatten als Weg ins Licht [Q, R10-01/-04].
- Road Runner mit dunkler Vordergrund-Masse: WS0-439 [KFB].
- R10 schließt die Masse für die Verfolgerkamera aus, weil sie am Bildschirm kleben müsste (Kanon 7).
- **Mit Anpassung:** Als Option für die Third-Person-Kamera nur in weltfester Form (U9).

---

## 3 · Umbauvorschlag für die Probe

**U1 · Fußdunst der Kulissen streichen** (Hauptmaßnahme, Befund C/D).
- Die Zeile `float ft=…; col=mix(far, air, pow(ft,1.7)*0.97);` entfällt.
- Ersatz ist flache Ebenen-Luft plus optionaler Talnebel nur in Sätteln:
```glsl
vec3 far = mix(col, kAir(rd), uKA);   // ganze Ebene ein Schritt (P9), uKA = 0,45 / 0,65 / 0,80
float sad = (1.0-smoothstep(0.0,0.25,hL)) * (1.0-smoothstep(0.35,0.55,vTop/uTop)); // nur niedrige Partien, unteres Viertel
col = mix(far, uKAirBack, 0.3*sad);    // Talnebel = Luft der NÄCHSTEN hinteren Ebene, nie skyColor; ΔL* ≤ +3
```
- `kAir(rd) = mix(uKAirAnti, uKAirSun, az*az)` mit `az` wie in `skyColor`. Zwei Farben je Ring berechnet JS je Stimmung aus der Tabelle in U7.

**U2 · Innenkontrast fällt automatisch.** Mit `uKA` 0,45 / 0,65 / 0,80 schrumpft der Licht-/Schattenabstand (bisher Faktor 0,62 ↔ 1,2) auf 55 / 35 / 20 %.
- Ergebnis für mesa: ΔL\* ≈ 9 / 6 / 3,5 [V, gerechnet].
- Biom-Flächen (`veg`, `cap`) mit Gewicht 0,6 / 0,3 / 0 je Ring.

**U3 · Gelände endet im Ton von K1, nicht im Himmel.**
- Wenn die Kulissen an sind, mischt `applyAir` in der letzten Staffel auf `uEdgeTone` statt auf `skyColor(rd)`:
```glsl
vec3 tgt = mix(skyColor(rd), mix(uEdgeAnti, uEdgeSun, az*az), uKul);
air = mix(mix(tgt,uAirTint,0.35), tgt, smoothstep(0.3,0.9,f));
```
- `uEdgeTone` ist der mittlere Flächenton von K1 nach U1, also ein Mittel aus Licht und Schatten nach der Luftmischung.
- Gelände und K1-Fuß haben damit am Stoß denselben Wert: Das ist die Mittelgrund-Brücke.
- Ohne Kulissen bleibt alles wie bisher (C ist bereits gut).
- Die vier Staffeln, die Nebelbänke und den Höhennebel nicht ändern: Sie arbeiten nur im Gelände und dunkeln die Senken.

**U4 · Unterhalb des Horizonts kein heller Himmel als Nebelziel.**
- Gelände und Kulissen lesen `skyColor` mit `rd.y < 0` nicht mehr. Bodendunst und Glow (H2/H5) bleiben nur für die Kuppel.
- `uSkyGround` auf `uEdgeTone` setzen. Dann ist auch eine Lücke zwischen den Ringen nie heller als K1.

**U5 · Ringe höher setzen und teilweise mitführen.**
- **Position:** `pos_i = C + (cam − C)·m_i` mit `m` = 0,5 / 0,7 / 0,9 (K1 zeigt die meiste Parallaxe). So behalten die Ringe Parallaxe, ohne dass man sie im Flug erreicht. Das löst R13-F4.
- **Höhe:** Die Kammhöhe wird für die **höchste** Kamera des Modus ausgelegt: `top_i = h_max + R_i·tan(θ_i)` mit θ = **3° / 2° / 1°** als Mindestwinkel über dem Horizont (Median über 360°).
- **Kontur:** Die Oberkante nimmt den Mesa-Rhythmus aus `topY` auf. K1 schneidet K2 auf ≥ 30 % des Umfangs (P7).
- **Radius:** K1 steht bei ≥ 1,05 × `uEdgeR`, Fuß wie bisher bei −60 bzw. × 17.

**U6 · Distanz-Farbrampe als Startwerte.**
- L\*-Ziele sind relativ zu **L_H** = L\* des Himmels am Horizont in neutraler Richtung (Tag `#cfe8f2` 90,5; mesa-`sky` 87,6).
- Die Spalte „Luft“ zeigt das Ziel der Mischung, nicht den Endwert.

| Stufe | Distanz ohne / mit Ringen | Luftanteil | L\* Flächenmittel (Tag) | Spanne P95−P5 | Chroma × | Farbton |
|---|---|---|---|---|---|---|
| S1 Nah | 0–60 m / 0–400 m | 0–0,1 | Eigenfarbe | ≥ 20 | 1,0 | eigen |
| S2 Mittel | 60–180 / 0,4–2 km | 0,15–0,35 | Eigenfarbe + 5…8 | ≤ 18 | 0,8 | 5–10° zur Luft |
| S3 Rand | 180–290 / 2–4,7 km | 0,4–0,55 | L_H − 24…−20 | ≤ 14 | 0,6 | 15–25° zur Luft |
| K1 | ≥ 1,05·Rand | 0,45 (flach) | L_H − 21 ± 2 | ≤ 10 | 0,5 | Luft = Himmel-**Mitte** (kühl) |
| K2 | +35 % | 0,65 | L_H − 14 ± 2 | ≤ 6 | 0,35 | Luft zwischen Mitte und Horizont |
| K3 | +45 % | 0,80 | L_H − 7 ± 1,5 | ≤ 4 | 0,25 | Luft nahe Horizont, nie gleich |
| Himmel über Kamm | – | – | L_H − 2…0 | – | – | – |

- Beispiel Tag (L_H 90,5): Rand ≈ 68, K1 ≈ 69, K2 ≈ 76, K3 ≈ 83, Himmel ≈ 89. Das ist durchgehend steigend, ohne Maximum unter dem Kamm.
- Der Ton der Tag-Luft liegt bei h ≈ 235–250° (Zenit 247°). Damit stehen kühle Silhouetten vor dem warmen, blassen Horizont, wie es H3 verlangt.

**U7 · Sonderfälle je Richtung und Stimmung** (Werte am L_H der Stimmung, interpoliert über `az`).

| Fall | Stufen K1/K2/K3 (ΔL\* zu L_H) | Luftfarbton | Innenkontrast | Quelle |
|---|---|---|---|---|
| Tag, von der Sonne weg | −24 / −16 / −8 | 240–255° (kühler, satter) | voll nach U2 | Gurney 2013, runevision |
| Tag/Gold, **Gegenlicht** | −16 / −10 / −5 | zur Sonnenfarbe (gold 40–60°) | K2/K3 fast flach (≤ 2), Sonnenkante am Kamm erlaubt | Gurney 2007 (umgekehrt) |
| Gold, von der Sonne weg | −22 / −15 / −8 (L_H 79,6) | violett 275–300° | voll | [V] |
| Nacht | Gelände 12–16, K1 ≈ 18, K2 ≈ 22, K3 ≈ 25, Himmel 28,5 | 275–285°, C 0,03–0,05 | ≤ 4 / 3 / 2 | [V]; P4 |

- Nachts wird die Ferne heller, weil sie auf den Himmel zuläuft. Der Abstand je Ebene darf auf 3 L\* schrumpfen.

**U8 · Biom-Farben.**
- Kulissen-Grundtöne bleiben wie heute (`cliff`/`mid`/`low`/`high`/`peak`). Die Zeile `lerp(hz, ix·0,12)` entfällt, weil die Luft jetzt in U1 sitzt.
- Die Luftfarbe des Bioms ist 70 % Himmel-Mitte der Stimmung und 30 % Rolle `sky` (P12).
- Der Farbton dreht pro Ring um 30 / 50 / 70 % zur Luft. So bleibt mesa in K1 noch rötlich, wird in K2 staubig-rosé und in K3 violett-blau, vor pfirsichfarbenem Himmel. Das ist das Road-Runner-/Monument-Valley-Bild.
- Für Dschungel ergibt sich blaugrün → Türkis, für Schnee blauviolett [V].

**U9 · Option „dunklerer Vordergrund“ für Racer und Figur** (P13). Alle drei Varianten sind weltfest. Kein Bildschirm-Overlay, keine Vignette.

| Variante | Bau | Startwerte | Kanon |
|---|---|---|---|
| **R-B Körper am Rand** (empfohlen) | dunkle Knet-Körper (Böschung, Busch, Felslippe) seitlich der Strecke, die durch die unteren Bildecken laufen; ungleich gesetzt (R10-15) | Abstand 15–40 m unregelmäßig; 4–12 m seitlich; Höhe 0,6–1,5 × Kamerahöhe; Ton `cliff` × 0,6, L\* ≥ 15; ≤ 2 gleichzeitig im Bild | konform |
| **R-C Wolkenschatten** | weltfeste Schattenflecken aus der Puff-Schicht, Richtung = Sonne, Drift wie Wind; Vordergrund oft im Schatten, Mittelgrund im Licht (Gurney) | Bedeckung 25–35 %, ΔL\* −10…−14, Kantenbreite 1–2 m | konform, wenn aus echten Wolken |
| **R-A Nah-Ton** (Test) | Stufe S0 der Rampe in `applyAir`: Boden (n.y > 0,6) näher als d0 dunkler und etwas satter; Rand mit Weltrauschen gebrochen; Fahrbahn halbe Stärke, Figur/Racer ausgenommen | d0 = 1,6 × Kamerahöhe über Grund (Figur ≈ 5 m, Racer ≈ 9 m → untere 10–15 % des Bildes), Übergang 0,6·d0, Rauschen ±35 % d0 bei 6–10 m Maßstab, OKLab-L × 0,88 (≈ −8…−10 L\*), C +0,01 | **WS0 muss entscheiden**: rechnet wie Nebel nach Entfernung, folgt aber der Kamera (R10-01 hatte Nein gesagt) |

**U10 · Reihenfolge:**
1. U1 + U4 einbauen und gegen Befund C vergleichen; das allein sollte das Band beseitigen.
2. Danach U3, U6 und U7 (Farbe und Brücke).
3. Danach U5 (Höhe und Parallaxe).
4. Danach U8.
5. U9 zuletzt und getrennt abnehmen.

---

## 4 · Abnahme-Kriterien

**Messaufbau:** Gemessen wird im gerenderten Bild (R4-15) mit 9 senkrechten Pixelspalten.
- **Kameras:** Übersicht in 50 / 200 / 600 m Höhe, 4 Kritiker-Kameras, Fahr- und Figurkamera.
- **Stimmungen:** tag, gold und nacht, je zur Sonne und von ihr weg.
- **Paletten:** mesa und eine grüne.

| # | Prüfung | PASS |
|---|---|---|
| A1 | **Kein Hell-Maximum unter dem Kamm:** Im Abschnitt Geländerand → Kamm K1 ist kein Pixelblock (≥ 6 px hoch) heller als K1 darüber **und** als das Gelände darunter | max. Überhöhung ≤ **2 ΔL\*** |
| A2 | **Stoß Gelände/K1:** letzte 5 % Gelände vor dem Rand gegen K1-Fuß in derselben Spalte | \|ΔL\*\| ≤ **3**, ΔE_OK ≤ 0,03 |
| A3 | **Staffel steigt:** Flächenmittel Rand ≤ K1 < K2 < K3 < Himmel 1° über K3 | Schritte **5–9 ΔL\*** am Tag, ≥ 3 nachts und im Gegenlicht; keine Umkehr |
| A4 | **Wert-Kompression:** P95−P5 L\* je Ebene | K1 ≤ 10, K2 ≤ 6, K3 ≤ 4; Mittelgrund-Gelände ≥ 15 |
| A5 | **Chroma:** C je Ebene relativ zum Nahgelände | K1 ≤ 0,6, K2 ≤ 0,4, K3 ≤ 0,25; jede ≥ 0,02 (nicht grau) |
| A6 | **Temperatur:** Farbton K2 gegen Biom-Grundton | von der Sonne weg ≥ 15° zur kühlen Luft; im Gegenlicht (gold) zur warmen Seite |
| A7 | **Kein Band:** Zeilen zwischen tiefstem Kamm und Geländerand | kein Streifen ≥ 8 px hoch über ≥ 50 % der Breite mit vertikal ΔL\* < 2, dessen Wert ≥ der Ebene darüber liegt. Schnelltest nach R13: Bild auf 25 % verkleinern, um 90° drehen, kein heller Querstreifen |
| A8 | **Kämme über dem Horizont:** Median über 360° | K1 ≥ +3°, K2 ≥ +2°, K3 ≥ +1° in **allen** Kamerahöhen; K1 schneidet K2 auf ≥ 30 % des Umfangs |
| A9 | **Parallaxe:** 100 m Seitwärtsfahrt bzw. 1 km Flug | K1 verschiebt sich gegen K3 um ≥ **8 px** (1080p) |
| A10 | **Kanten:** Breite der Kammkante | ≤ 2 px auf allen Ebenen; K3 ohne Innen-Tongrenze |
| A11 | **Richtung:** 8 Schritte um 360° | A1–A3 halten in jeder Richtung; Gegenlicht nie heller als der Himmel direkt dahinter |
| A12 | **Option U9:** untere 12 % des Bildes gegen Mittelgrund | Mittel −8…−15 L\*, nie < L\* 15; Oberkante ohne gerades Stück > 25 % der Breite; Figur/Racer ΔL\* = 0 mit/ohne; Fahrbahn bleibt lesbar (Kontrast Markierung/Belag ≥ 80 % des Werts ohne) |
| A13 | **Blindtest Georg:** 10 Bilder alt/neu, dazu Befund C als Referenz | 0 Treffer „Wand/Band“; neu mindestens so tief wie C |

---

## 5 · Quellen

**Gelesen [Q]:**
- Rune Skovbo Johansen, „Notes on atmospheric perspective and distant mountains“ (2025). https://blog.runevision.com/2025/06/notes-on-atmospheric-perspective-and.html
- James Gurney:
  - „Reverse Atmospheric Perspective“ (2007). http://gurneyjourney.blogspot.com/2007/09/reverse-atmospheric-perspective.html
  - „Atmospheric distance and value“ (2013). http://gurneyjourney.blogspot.com/2013/07/atmospheric-distance-and-value.html
  - „Demo by Kazuo Oga“ (2017). http://gurneyjourney.blogspot.com/2017/03/demo-by-kazuo-oga.html
  - Repoussoir, Illuminated Foreground, Cast Shadow in Foreground: siehe R10-01/-04.
- Animation Obsessive, „What Kazuo Oga thinks about when he thinks about backgrounds“. https://animationobsessive.substack.com/p/what-kazuo-oga-thinks-about-when
- Jane Ng, „Making the World of Firewatch“, GDC 2016, Folien mit Sprechernotizen, S. 46 (ferne Bäume puffiger). https://media.gdcvault.com/gdc2016/Presentations/Ng_Jane_MakingTheWorld.pdf (R13-F7 damit teilweise erledigt; über Nebel steht dort nichts)
- Cyrus Sarkosh, „Stylized shader looks“ (Sekundärquelle zu Firewatchs Gradient-Nebel). https://csarko.sh/research/stylized-shader-looks
- Game Developer, „How Shedworks refined the art of Sable in pursuit of readability“. https://www.gamedeveloper.com/marketing/how-shedworks-refined-the-art-of-sable-in-pursuit-of-readability
- 80.lv, Flora Yu zu Sky: Children of the Light. https://80.lv/articles/how-to-design-emotional-game-environments-for-sky-children-of-the-light
- Wolfire, „Blending land and sky“ (2009). https://www.wolfire.com/blog/2009/07/blending-land-and-sky/
- ResetEra, „Zelda: Breath of the Wild: The Technical Analysis“ (Community, schwach). https://www.resetera.com/threads/zelda-breath-of-the-wild-the-technical-analysis.8197/
- Thumbsticks zu Takizawa, GDC 2017 (Gouache, Plein-Air, keine Fernetechnik). https://www.thumbsticks.com/gdc17-designing-zelda-breath-of-the-wild/
- John K / Art Lozzi, „Color Theory – Art Lozzi explains some technique“ (2006). http://johnkstuff.blogspot.com/2006/12/color-theory-art-lozzi-explains-some.html
- Walt Disney Family Museum zu Eyvind Earle. https://www.waltdisney.org/blog/eyvind-earle-artistic-devotion-distinction-sleeping-beauty
- Aus R13 übernommen: Campo Santo (Himmelsbausteine), Alisavakis (Firewatch-Nebel), Quilez (Höhennebel), tinyskies (Sonnenhof).

**Nur Suchauszug [Q\*]:**
- Draw Paint Academy, „Compressed values“. https://drawpaintacademy.com/compressed-values/
- Ori: eigener Nebel mit Farbe und Wert über die Tiefe, nicht linearer Tiefenschärfe-Verlauf. Primärquelle nicht lesbar: Polycount 403; Xbox Wire und 80.lv ohne diese Aussage.
- Earle „gleich scharf wie van Eyck“ (Suchauszug; die Primärseite nennt nur die Vorbilder).
- Genshin GDC 2021 (nur Video): Nebel je Region und Tageszeit. https://www.gdcvault.com/play/1027538/-Genshin-Impact-Crafting-an

**Ohne Textquelle zur Ferne geblieben:** Journey, A Short Hike (nur Nachbearbeitungs-Nebel, Threadreader), Tiny Glade, Fortnite, Road-Runner-Himmelsverläufe (DeGuard/Noble; dafür Georgs Stills, WS0-439).

**Vermutungen [V]:**
- alle Zahlen in U5–U9 und A1–A13
- die Wertkette mesa in der Diagnose (gerechnet, nicht gemessen)
- die Parallaxe-Ursache in Diagnose Punkt 5
- die Nacht-Rampe

**Offen für WS0:**
1. R13-H6 und H13 wie in P11/U3 einschränken?
2. Teil-Mitführung der Kulissen (U5) als Antwort auf R13-F4?
3. Option R-A gegen Kanon 7?
