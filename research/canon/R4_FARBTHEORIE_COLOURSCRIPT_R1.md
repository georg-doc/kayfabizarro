# R4 · Farbtheorie und Colour-Script gegen die J17-Messung · R1 · 2026-10-20

**Backlog:** `CANON_3D/RESEARCH_BACKLOG_R1.md` Zeile R4 (Priorität 2). **Ziel:** Kanon Gebiet 6 (Farbe und Palette), K2-Kriterien des Kritikers und eine Wertprüfung am Graustufenbild.
**Stand:** Recherche-Ergebnis, noch kein Kanon. WS0 entscheidet. Kein Repo wurde verändert.

## Lesehilfe

**Herkunft jeder Zahl:**
- **[Q]** Die Zahl bzw. Aussage steht so in der genannten Quelle.
- **[V]** Mein Vorschlag bzw. meine Heuristik. Muss an KFB-Bildern geeicht werden.
- **[J17]** Von mir aus den J17-Hexwerten gerechnet (`COLOR_CONCEPT_R1` §2.2.1). Rechenweg: sRGB → linear → CIE L* bzw. OKLab/OKLCH nach Ottosson. Das ist Messung, keine Quelle.
- **[KFB]** besteht schon im Kanon bzw. Register.

**Maße:**
- **L\*** = CIE-Helligkeit 0–100, also der Graustufenwert.
- **C** = OKLCH-Buntheit (0 = grau, ca. 0,2 = sehr bunt).
- **h** = OKLCH-Farbton in Grad.

Alle Prüfungen laufen in diesen Maßen, weil sie wahrnehmungsnah sind und ohne Bibliothek rechenbar.

**Zitate:** keine; alles in eigenen Worten.

---

## Teil A · Was die J17-Messung heute abdeckt und was fehlt

**Heutiger Ansatz (Kanon Gebiet 5/6, COLOR_CONCEPT_R1):**
- J17 legt **Hexwerte je Rolle** fest: table, hill, strang, tower, leaf, trunk, rock, cloud, sky, pad, road.
- Für eigene Bauteile kommen `ENV_ROLES` dazu, je Rolle 3 Töne (hell, mitte, dunkel).
- Regeln: 60/30/10, Akzente führen zur Landmarke, kein Mittelgrau, kein sattes Grün als Boden (V-564), Story-Tint 12 % (Grenze 15 %).
- Geprüft wird heute **nur**, ob ein Objekt eine Rolle hat (`kfb_env` S2). Die Farbwerte gegen den Generator prüft niemand (Kanon-Lücke Gebiet 6).

**Was externe Praxis zusätzlich verlangt** (Teil B):
1. Wertstruktur **vor** Farbe, geprüft am Graustufenbild.
2. Tiefenstaffel in Wertbändern.
3. Fokus über den höchsten Kontrast.
4. Sättigungshierarchie: gedämpft dominiert, Akzent klein.
5. Eine begrenzte Zahl von Farbtonfamilien je Zone.
6. Colour-Script als Abfolge von Zonen bzw. Story-Beats.

J17 liefert dafür die Palette, prüft aber keines davon im **gerenderten** Bild. Dass das nötig ist, zeigt Grammatik R2 §6: Ein Moosgrün aus der Palette wurde unter ACES zu grellem Limettengrün.

**Was die J17-Paletten selbst zeigen** (gerechnet [J17]):

| Palette | Boden (table) L\* / C | Himmel L\* | Fahrbahn L\* | Akzent-C (Rolle) | höchste C im Satz | Boden-C ÷ Akzent-C |
|---|---|---|---|---|---|---|
| canyon | 51 / 0,143 | 75 | 31 | 0,195 (strang `#ef5a22`) | 0,195 = Akzent ✔ | 0,73 |
| bucht | 84 / 0,107 | 82 | 38 | 0,161 (strang `#f2708a`); 0,147 (accent `#9a6fd0`) | **0,180 = leaf0 `#8fcf45`** ✘ | 0,66–0,73 |
| otown | 62 / 0,099 | 82 | 34 | 0,162 (accent `#e0679f`); 0,145 (strang) | 0,167 (tower = Akzentfamilie) ✔ | 0,61–0,68 |

**Befunde aus der Tabelle [J17]:**
- Das Verhältnis Boden-Buntheit zu Akzent-Buntheit liegt in **allen drei** Goldstandard-Paletten bei **0,61–0,73**. Daran ist R4-05 geeicht.
- In **bucht** ist das Laub bunter als der Akzent. Das bricht die Sättigungshierarchie, sobald Laub große Flächen bedeckt (siehe R4-05).
- Die Himmel liegen bei L\* 75–82, die Fahrbahn ist überall der dunkelste Ton (L\* 31–38). Daran sind R4-03 und R4-13 geeicht.
- In bucht ist der Boden (Sand, L\* 84) heller als der Himmel (L\* 82). Das ist eine gewollte Umkehr der „realistischen“ Staffel und muss im Konzeptblatt stehen (R4-03).

---

## Teil B · Regeln

### R4-01 · Wertstruktur zuerst: drei Wertgruppen
- **Regel:**
  - Jede Szene ist im Graustufenbild auf **3** Wertgruppen reduzierbar [Q]: hell, mittel, dunkel.
  - Posterisiert man L\* auf 3 Cluster (k-means), fallen ≥ 85 % der Bildfläche in Cluster, deren Zentren ≥ 15 L\* auseinanderliegen [V].
  - Fokus und Landmarke bleiben im 3-Stufen-Bild erkennbar [V].
  - Mehr als 4 deutlich getrennte Wertgruppen gelten als unruhig [Q: Loomis arbeitet mit 4 Tönen; Pyle hielt 2–3 für stark und 4+ für zu viel].
- **Quelle:**
  - Bacher, *Dream Worlds: Production Design for Animation* (Focal Press 2007), Kapitel „Values and Color“: reduziert die Grauskala auf drei Werte, plant Szenen mit Vorder-, ein bis zwei Mittel- und Hintergrundflächen. Gelesen über die Zusammenfassung https://www.worldofleveldesign.com/categories/game_environments_design/11-things-i-learned-from-dream-worlds.php (Sekundärquelle; Kapiteltitel laut Verlagsseite).
  - Gurney zu Loomis' Tonschema (*Creative Illustration*) und Pyles Zwei-bis-drei-Werte-Satz: http://gurneyjourney.blogspot.com/2012/06/loomiss-scheme-for-tonal-organization.html
  - Gurney, „Three Value Study“ (Tom Lovell plante mit drei Tönen): http://gurneyjourney.blogspot.com/2008/06/three-value-study.html
  - Etherington #69/#70: Die Layout-Daumen für Vorder-, Mittel- und Hintergrund sind durchweg in drei Werten angelegt [Q, Bildbefund]. https://theetheringtonbrothers.blogspot.com/2017/09/how-to-think-when-you-draw-foreground.html
- **Urteil:** gilt für KFB. Neu, J17 hat keine Wertprüfung.

### R4-02 · Eine Wertgruppe dominiert
- **Regel:** Ein Ton beherrscht das Bild, die anderen ordnen sich ein [Q: Loomis' vier Pläne haben je einen dominanten Ton]. Die größte der 3 Wertgruppen hat ≥ 40 % der Bildfläche, die kleinste ≤ 25 % [V].
- **Quelle:** Gurney zu Loomis (URL wie R4-01).
- **Urteil:** gilt für KFB.

### R4-03 · Tiefenstaffel in Wertbändern
- **Regel:**
  - Vorder-, Mittel- und Hintergrund haben **getrennte Wertbänder**. In der „realistischen“ Anordnung ist der Vordergrund am dunkelsten, der Hintergrund am hellsten [Q]; für Stimmung darf das umgekehrt werden [Q], muss dann aber im Konzeptblatt stehen [V].
  - Mit der Entfernung hellen Dunkelheiten auf und der Kontrast nimmt ab [Q].
  - **Zahlen:**
    - Mittlere L\* benachbarter Ebenen ≥ 10 auseinander [V].
    - Kontrastspanne (P95 − P5 der L\*) im Hintergrund ≤ 0,6 × der Spanne im Vordergrund [V].
    - Himmel bzw. ferner Hintergrund L\* 70–90 [V, geeicht an J17-Himmeln 75–82].
- **Quelle:**
  - Bacher (wie R4-01): realistische Staffel dunkel vorn, hell hinten; Umkehr für Angstszenen.
  - Gurney, „Atmospheric distance and value“: Beispiel naher dunkler Baum Wert 8 gegen fernen Hügel Wert 2 auf einer 0–10-Skala (0 = weiß); die Aufhellung verläuft eher geometrisch als linear; Ferne wird blauer. http://gurneyjourney.blogspot.com/2013/07/atmospheric-distance-and-value.html
  - Mitchell, Francke, Eng, „Illustrative Rendering in Team Fortress 2“, NPAR 2007, Abschnitt 6 „Abstraction“: Abstraktion in der Ferne über Tiefennebel und geglättete Beleuchtung. https://steamcdn-a.akamaihd.net/apps/valve/2007/NPAR07_IllustrativeRenderingInTeamFortress2.pdf
- **Urteil:** gilt für KFB, mit Einschränkung. Kanon Gebiet 6 verlangt „Harmonie über das Material, nie über das Licht“. Die Staffel entsteht deshalb über **Rollenwahl** (hellere Ton-Stufe für ferne Objekte) und den einen Tonweg, nicht über private Nebel- oder Lichttricks. Ob ein Tiefennebel im einen Rig erlaubt ist, entscheidet WS0/Georg (LIGHT_MODEL_R2).

### R4-04 · Fokus = höchster Kontrast
- **Regel:**
  - Der Fokus (Figur bzw. Landmarke) trägt den höchsten Wertkontrast des Bildes [Q]. Rundherum wird Detail zurückgenommen [Q].
  - **Zahlen:**
    - Der L\*-Kontrast zwischen Fokusobjekt und einem Ring von 0,5 × seiner Bildgröße ist ≥ 1,5 × der Median-Kontrast aller anderen Objekte zu ihrem Ring [V].
    - Der Fokus liegt unter den 3 stärksten Spitzen einer einfachen Salienzkarte [V].
- **Quelle:**
  - Valve GDC 2008, „Stylization with a Purpose“, Folie „Read Hierarchy“: höchster Kontrast auf Brusthöhe, wo die Waffe sitzt; Verlauf von dunklen Füßen zu heller Brust. https://cdn.cloudflare.steamstatic.com/apps/valve/2008/GDC2008_StylizationWithAPurpose_TF2.pdf
  - Etherington #156 (Detail rund um die Landmarke zurücknehmen): https://theetheringtonbrothers.blogspot.com/2018/07/how-to-think-when-you-draw-detail-at.html
  - Itti, Koch, Niebur, „A Model of Saliency-Based Visual Attention for Rapid Scene Analysis“, IEEE TPAMI 20(11), 1998: Aufmerksamkeit folgt lokalen Kontrasten in Helligkeit, Farbgegensatz und Orientierung (Grundlage der Salienzkarte).
- **Urteil:** gilt für KFB. Schnittstelle zu R1 (Fokus-Kontrast-Gate). Die Zahl wird nur einmal geführt; R1 und R4 sollen dasselbe Gate nutzen.

### R4-05 · Sättigungshierarchie: gedämpft dominiert
- **Regel:**
  - Große Flächen sind gedämpft, kleine Flächen dürfen gesättigt sein [Q]. Nur die Eckfarben der Palette (die Primärfarben der Gamut-Maske) erreichen volle Buntheit, alles andere ist abgemischt [Q].
  - **Zahlen:**
    - Boden-C ≤ 0,75 × Akzent-C [V, geeicht an J17: 0,61–0,73].
    - Keine Rolle, die > 15 % der Bildfläche bedeckt, ist bunter als der Akzent (C ≤ Akzent-C) [V].
    - Die bunteste Fläche im Bild (P99 der C) liegt in der Akzent-Familie oder auf der Figur [V].
- **Quelle:**
  - Mitchell et al., NPAR 2007, Abschnitt 4.2 „World Modeling“ mit Farbtafel (Figure 4): gedämpfte Farben dominieren, kleine gesättigte Flächen geben Interesse; Komplementär-Nebenfarben nur an kleinen Requisiten (URL wie R4-03).
  - Gurney, „The Shapes of Color Schemes“: Die Buntheit nimmt zur Mitte der Maske ab; die kräftigsten Farben sitzen an ihren Ecken. http://gurneyjourney.blogspot.com/2008/02/shapes-of-color-schemes.html
  - Van Dongen (Ronimo), Farbschema-Analyse von Spiel-Screenshots: Nur die 2–3 gewählten Primärfarben erreichen volle Sättigung (Sekundärquelle, Praxisbeleg). https://joostdevblog.blogspot.com/2015/01/a-tool-for-analysing-colour-schemes.html
- **Urteil:** gilt für KFB. **Befund:** Die J17-Palette **bucht** verletzt die zweite Zahl, wenn Laub (leaf0 C 0,180) Großfläche ist. Vorschlag: Laub in bucht eine Ton-Stufe dämpfen (C ≤ 0,15) oder Laubflächen klein halten. Entscheidung Georg, weil J17 Goldstandard ist (V-174).

### R4-06 · Akzent: klein, und er führt zum Fokus
- **Regel:**
  - Akzentfarbe ca. 10 % der Bildfläche [KFB 60/30/10], Band **3–10 %** [V].
  - ≥ 50 % der Akzentfläche liegt im Fokus oder auf der Linie zur Landmarke [V; KFB: „Akzente führen zur Landmarke“].
  - Gezählt wird als Akzent jedes Pixel mit h im Akzent-Fenster (±20° um den Akzent-Farbton) und C ≥ 0,7 × Akzent-C [V].
- **Quelle:**
  - Gurney (URL wie R4-05), Schema „Mood and Accent“: die meisten Farben in einem Bereich, ein isolierter Akzent von gegenüber, ohne Zwischenmischungen.
  - Mitchell et al. (wie R4-05): kleine Sättigungsflächen.
  - Für 60/30/10 selbst habe ich **keine Primärquelle** gefunden; die Regel ist eine verbreitete Faustregel aus der Innenarchitektur. Der Zahlenwert bleibt [KFB].
- **Urteil:** gilt für KFB.

### R4-07 · Höchstens drei Farbtonfamilien je Zone plus ein Akzent
- **Regel:**
  - Eine Zone bzw. ein Scenelet nutzt **≤ 3** Farbtonfamilien als Grundlage [Q: Gamut-Dreieck mit drei Primärfarben] und **1** Akzentfamilie [Q: „Mood and Accent“].
  - Farbtonfamilie = 30°-Fenster in h [V]. Gezählt werden nur Pixel mit C > 0,05; eine Familie zählt ab ≥ 5 % der Bildfläche [V].
  - Alle übrigen Töne sind gedämpft: C ≤ 0,06 [V].
- **Quelle:**
  - Gurney, „Part 2: Gamut Masking Method“: Die Maske legt eine Form, meist ein Dreieck, auf den Farbkreis; was außerhalb liegt, bleibt weg. http://gurneyjourney.blogspot.com/2011/09/part-2-gamut-masking-method.html
  - Lou Romano (Pixar, *The Incredibles*): Farbskript-Szenen auf ihre Grundfarben reduziert. Die Angabe „oft nur 3–4 Farben“ stammt aus einer Sekundärquelle (Studentenblog), deshalb nur als Hinweis: https://dansandersartanimation.wordpress.com/2019/02/08/lou-romano-colour-script-research/
  - Romano-Interview zu Tentpole-Bildern (die großen Ideen bleiben klar zwischen den Nebenbeats): https://www.thunderchunky.co.uk/articles/pixar-colour-and-tent-poles-with-lou-romano/
- **Urteil:** gilt für KFB. Die J17-Sätze haben mehr als 3 Familien, weil sie ganze Welten abdecken; die Grenze gilt **je Bildausschnitt bzw. Zone**, nicht je Welt-Palette.

### R4-08 · Gamut-Maske aus der Palette
- **Regel:**
  - Jede Zone hat eine Gamut-Maske = konvexe Hülle der Rollenfarben ihrer Palette in der OKLab-Ebene (a, b) [V nach Gurney].
  - Im gerenderten Bild liegen ≥ 95 % der Pixel mit C > 0,05 innerhalb der um 10 % vergrößerten Hülle [V].
  - Meshy- bzw. Kit-Farben außerhalb der Maske werden auf die nächste Rolle umgetönt [KFB Gebiet 15 (2)].
- **Quelle:** Gurney, Gamut Masking Part 2/3 (URL wie R4-07) und http://gurneyjourney.blogspot.com/2011/09/part-3-gamut-masking-method.html
- **Urteil:** gilt für KFB. Macht die Kanon-Lücke „Farbwerte gegen den Generator nicht geprüft“ mechanisch prüfbar (`kfb_env` M3).

### R4-09 · Colour-Script: jede Zone ein eigener Farbcode, Bogen über Sättigung
- **Regel:**
  - Jede Zone bzw. jeder Ort hat einen sofort erkennbaren Farbcode [Q].
  - Der emotionale Bogen läuft über Sättigung und Wärme: gedämpft in Distanz und Verlust, gesättigt in Nähe und Höhepunkt [Q].
  - **Zahlen:**
    - Benachbarte Zonen unterscheiden sich in der dominanten Farbtonfamilie um ≥ 30° h **oder** in der mittleren L\* um ≥ 10 [V].
    - Die Story-Mode-Tönung bleibt ≤ 15 % [KFB].
  - **Artefakt:** je Insel bzw. Route ein Colour-Script-Streifen aus einem Daumenbild je Zone bzw. Story-Beat, in Reihenfolge der Spielerroute. Die Daumenbilder sind Spielkamera-Bilder in 3 Werten (R4-01) plus Farbe [V nach Pixar-Praxis].
- **Quelle:**
  - Eggleston (Pixar), Interview „Design With a Purpose“: Farbe aus der Emotion der Figur; Erde in warmen Tönen mit wenig Blau und Grün, der Weltraum gedämpft; Farbe steigert sich bis „wild gesättigt“, wenn die Figuren sich nahekommen, und kehrt beim Bruch zum Anfangston zurück; jeder Bereich der Axiom hat einen eigenen Farbcode, damit man ihn in Actionszenen sofort erkennt. https://www.animationartconservation.com/design-with-a-purpose,-an-interview-with-ralph-eggleston.html
  - Romano (Tentpole-Bilder, Farbskript als Inspiration und Kontinuität): URL wie R4-07.
  - Bacher (wie R4-01): eine Emotions- bzw. Handlungskurve soll die Farbwahl über eine Sequenz begleiten.
- **Urteil:** gilt für KFB. Der Hebel dafür existiert schon: Welt-Palette je Zone und Story-Mode-Tint. Neu ist nur der Streifen als Abnahme-Artefakt und die Unterscheidbarkeits-Zahl.

### R4-10 · Akzent bei seinem Spitzenwert
- **Regel:**
  - Jeder Farbton erreicht seine größte Buntheit bei einer eigenen Helligkeit: Gelb hell, Rot mittel, Blau dunkel [Q].
  - Akzente sitzen nahe an diesem Spitzenwert: OKLab-L des Akzents innerhalb ±0,08 vom L des Gamut-Scheitels (Cusp) seines Farbtons [V].
  - Ein Gelb-Akzent muss also hell sein, ein Blau-Akzent darf dunkel sein.
- **Quelle:** Gurney, „Peak Saturation Value“. http://gurneyjourney.blogspot.com/2010/03/peak-saturation-value.html
- **Urteil:** gilt für KFB. Prüfbar an den Palettendaten, ohne Rendern.

### R4-11 · Schatten nie schwarz
- **Regel:** Schatten bleiben farbig und nie schwarz [Q]. Zahlen: Schatten-L\* ≥ 15 [V]; Schatten-C ≥ 0,3 × C des beschatteten Materials [V].
- **Quelle:** Mitchell et al., NPAR 2007, Abschnitt 3 (Leyendecker-Konventionen): Schatten gehen ins Kühle statt ins Schwarze; die Sättigung steigt an der Licht-Schatten-Grenze (URL wie R4-03).
- **Urteil:** gilt für KFB **ohne die Kühl-Regel**. Nicht übernommen ist „Schatten kühl“, weil V-564 den Schatten nach der Palette des Empfängers tönt (castShadowTint). Übernommen ist nur „nie schwarz, farbig“. Die „gesättigte Grenze“ betrifft den Tonweg (LIGHT_MODEL_R2) und geht als Frage an WS0.

### R4-12 · Figuren lesbar: Silhouette und Wertabstand
- **Regel:**
  - Figuren sind schon als Schattenriss ohne Innenzeichnung erkennbar [Q].
  - Innerhalb der Figur steigt der Wert von unten nach oben, mit dem höchsten Kontrast am Handlungszentrum (Brust, Hände) [Q].
  - **Zahlen:**
    - Figur gegen Hintergrund ΔL\* ≥ 15 über ≥ 70 % des Umrisses, aus Spielkamera und allen 4 Kritiker-Kameras [V].
    - Mittleres L\* der oberen Körperhälfte ≥ mittleres L\* der unteren Hälfte + 5 [V].
- **Quelle:** Mitchell et al., NPAR 2007, Abschnitt 4.1 und Figure 2 (Silhouetten der neun Klassen als Validierung im Konzept); Valve GDC 2008, Folie „Read Hierarchy“ (URLs wie R4-03/R4-04).
- **Urteil:** gilt für KFB (Gebiet 9). Die zweite Zahl hängt vom Rig ab und gilt deshalb als Kritiker-Kriterium, nicht als Gate.

### R4-13 · Kein Mittelgrau als Fläche
- **Regel:**
  - Neutrale Mitteltöne nehmen keine großen Flächen ein [KFB „kein Mittelgrau“].
  - Fläche mit C < 0,02 und 0,45 < OKLab-L < 0,65 ist ≤ 5 % des Bildes [V].
  - Ausnahme: die Fahrbahn [KFB `#3d4a60`]; sie ist dunkler (L\* 31) und leicht blau (C 0,041), also kein Mittelgrau nach dieser Definition [J17].
- **Quelle:** Gurney, „Shapes of Color Schemes“ (das Neutral der Palette verschiebt sich mit der Maske; ein echtes Grau gehört zu keiner Maske), URL wie R4-05.
- **Urteil:** gilt für KFB. Macht die bestehende Regel messbar.

### R4-14 · Unnatürliche Farben erlaubt, wenn der Wert trägt (Mary Blair)
- **Regel:** Kühne, nicht naturalistische Farbkombinationen und flache Formen sind erlaubt und stilbildend [Q], solange R4-01 bis R4-05 erfüllt sind. Ein Beispiel ist der violette Boden in J17 canyon. **Keine Zahl in den Quellen.**
- **Quelle:**
  - Walt Disney Family Museum, „Painting Dreams with Mary Blair“: Walt hielt ihre Farbkombinationen für so ungewöhnlich, dass er scherzte, sie sei farbenblind; Color Keys für *Cinderella*, Stimmung von *Alice im Wunderland*. https://www.waltdisney.org/blog/painting-dreams-mary-blair
  - Hintergrund: Canemaker, *The Art and Flair of Mary Blair* (Disney Editions 2003, nicht eingesehen).
- **Urteil:** gilt für KFB als Haltung (Kritiker K2), nicht als Gate.

### R4-15 · Gemessen wird im gerenderten Bild, nicht nur in den Daten
- **Regel:**
  - Jede Farbregel wird zweimal geprüft:
    - (a) an den Palettendaten (R4-05, R4-07, R4-08, R4-10);
    - (b) am gerenderten Bild nach Tonwert-Mapping aus der Spielkamera und den 4 Kritiker-Kameras (R4-01 bis R4-06, R4-12, R4-13).
  - Weicht (b) von (a) um mehr als 0,03 C bzw. 5 L\* je Rolle ab, ist das ein Befund für den Tonweg [V].
- **Quelle:**
  - KFB Grammatik R2 §6: Moosgrün wird unter ACES Limette [KFB].
  - Mitchell et al., Abschnitt 4.2: Farben nahe am Realismus, aber mit erhöhter Sättigung und erhöhtem Wertkontrast. Das ist eine Bildwirkung, die erst nach Shading und Licht entsteht [Q].
- **Urteil:** gilt für KFB.

---

## Teil C · J17 gegen extern, Kurzbilanz

| Thema | J17 / KFB heute | Externe Praxis | Folge |
|---|---|---|---|
| Palette mit Rollen | ja, Hex je Rolle, 3 Töne je Rolle | entspricht Gamut-Maske + Rollen | R4-08 macht sie prüfbar |
| Wertstruktur | nicht geprüft | zuerst, 3 Werte | R4-01/02 neu |
| Tiefenstaffel | nicht geregelt | Wertbänder, Kontrast nimmt ab | R4-03 neu (über Rollen, nicht Licht) |
| Fokus | „Akzente führen zur Landmarke“ | höchster Kontrast am Fokus | R4-04 neu, mit R1 teilen |
| Sättigung | 60/30/10, kein sattes Grün | gedämpft dominiert, Akzent bunteste Farbe | R4-05/06; bucht-Laub fällt auf |
| Farbtonzahl | nicht begrenzt | 3 + 1 Akzent je Ausschnitt | R4-07 neu |
| Colour-Script | Story-Mode-Tint 12 % | Farbcode je Ort, Sättigungsbogen | R4-09: Streifen als Artefakt |
| Schatten | V-564 Empfänger-Tönung | kühl, nie schwarz | nur „nie schwarz“ übernommen |
| Messort | Daten | Bild | R4-15: beides |

---

## Vorschlag Prüfung

**Ein neues Gate `kfb_color_gate`** (Python, ohne Bibliothek, neben `kfb_env.py`), zwei Stufen:

**Stufe 1, Palettendaten** (`kfb.color-concept/1` bzw. `ENV_ROLES` + Szenen-Rollen aus `kfb.env-scene/1`):
- **R4-05:** C(ground) ≤ 0,75 × C(accent); keine Großflächen-Rolle (Flächenanteil aus dem Export) mit C > C(accent).
- **R4-07:** Rollen mit Flächenanteil ≥ 5 % in 30°-Familien gruppieren; ≤ 3 Familien + 1 Akzent.
- **R4-08:** konvexe Hülle (a, b) der Zonen-Palette bilden; jede Objektfarbe (`color` im Export) liegt innerhalb der Hülle +10 %, sonst Befund M3.
- **R4-10:** je Akzent den Cusp-L seines Farbtons rechnen (Gamut-Rand von OKLCH); Abstand ≤ 0,08.
- **R4-13:** keine Rolle mit C < 0,02 und 0,45 < L < 0,65 außer `road`.

**Stufe 2, Bild** (PNG aus Spielkamera + 4 Kritiker-Kameras, gleiche Kamera-Marken wie Grammatik R2 §5):
1. L\* je Pixel: sRGB → linear → Y = 0,2126 R + 0,7152 G + 0,0722 B → L\*.
2. **R4-01/02:** k-means k = 3 auf L\*; Anteil in den Clustern, Zentrenabstand ≥ 15, größte Gruppe ≥ 40 %, kleinste ≤ 25 %.
3. **R4-03:** Tiefenpuffer bzw. Objekt-Tiefe aus dem Export in Terzile (vorn, mitte, hinten); mittlere L\* je Terzil ≥ 10 auseinander (Richtung laut Konzeptblatt); Spanne hinten ≤ 0,6 × vorn.
4. **R4-04:** Objekt-Masken (ID-Pass) → Ring-Kontrast je Objekt; Fokus ≥ 1,5 × Median. Gleiches Gate wie R1 (nur einmal implementieren).
5. **R4-05/06:** C und h je Pixel; P99(C) in Akzent-Familie oder Figur; Akzentanteil 3–10 %; ≥ 50 % davon in Fokus-Maske bzw. Korridor zur Landmarke.
6. **R4-12:** Figur-Maske: ΔL\* zur Umgebung entlang des Umrisses (2-px-Ring) ≥ 15 auf ≥ 70 % der Umrisspixel.
7. **R4-13:** Mittelgrau-Fläche ≤ 5 %.
8. **R4-15:** mittlere C/L\* je Rolle im Bild gegen die Palettendaten; Abweichung > 0,03 C bzw. > 5 L\* → Befund „Tonweg“.

**Ausgabe:** wie `kfb_env.gate`: `{ok, fail[], findings[]}`. FAIL bei R4-01, R4-05 (Boden), R4-08, R4-12; alles andere zunächst TUNE, bis die Schwellen an 5–10 abgenommenen KFB-Szenen geeicht sind [V].

**Kritiker K2 (blind, nach `CRITIC_3D_R1.md`), neue Fragen:**
- **K2a (R4-01):** „Bild auf 64 px Breite verkleinern und in Graustufen ansehen: Liest man hell, mittel, dunkel als drei klare Massen? Ist der Fokus sofort da?“ Gurney: Eine einfache Tonanlage wirkt stärker und liest sich auch quer durch den Raum oder stark verkleinert [Q] (http://gurneyjourney.blogspot.com/2019/12/plein-air-tip-grouping-tonal-values.html).
- **K2b (R4-04/06):** „Wohin geht der Blick zuerst? Liegt dort der Akzent?“
- **K2c (R4-05):** „Gibt es eine große Fläche, die bunter ist als der Akzent?“
- **K2d (R4-09):** „Colour-Script-Streifen der Route: Kann man jede Zone an der Farbe erkennen, und folgt die Sättigung dem Story-Bogen?“
- **K2e (R4-14):** „Wirkt die Farbe gewollt und stilbildend oder zufällig?“
- **K2f (R4-11):** „Gibt es schwarze oder farblose Schatten?“

---

## Quellen

- Bacher, Hans P.: *Dream Worlds: Production Design for Animation*, Focal Press 2007, Kapitel „Values and Color“. Inhalt über die Zusammenfassung bei World of Level Design gelesen (Sekundärquelle): https://www.worldofleveldesign.com/categories/game_environments_design/11-things-i-learned-from-dream-worlds.php
- Gurney, James (Gurney Journey):
  - „Loomis's Scheme for Tonal Organization“: http://gurneyjourney.blogspot.com/2012/06/loomiss-scheme-for-tonal-organization.html
  - „Three Value Study“: http://gurneyjourney.blogspot.com/2008/06/three-value-study.html
  - „Plein-Air Tip: Grouping Tonal Values“: http://gurneyjourney.blogspot.com/2019/12/plein-air-tip-grouping-tonal-values.html
  - „How Many Values?“ (Pyle: wenige Töne, stärkste Kontraste für die Betonung): http://gurneyjourney.blogspot.com/2018/01/how-many-values.html
  - „Atmospheric distance and value“: http://gurneyjourney.blogspot.com/2013/07/atmospheric-distance-and-value.html
  - „Peak Saturation Value“: http://gurneyjourney.blogspot.com/2010/03/peak-saturation-value.html
  - „The Shapes of Color Schemes“: http://gurneyjourney.blogspot.com/2008/02/shapes-of-color-schemes.html
  - „Part 2/Part 3: Gamut Masking Method“: http://gurneyjourney.blogspot.com/2011/09/part-2-gamut-masking-method.html · http://gurneyjourney.blogspot.com/2011/09/part-3-gamut-masking-method.html
  - dazu sein Buch *Color and Light* (Andrews McMeel 2010), nicht eingesehen.
- Mitchell, Jason; Francke, Moby; Eng, Dhabih: „Illustrative Rendering in Team Fortress 2“, NPAR 2007 (ACM DOI 10.1145/1274871.1274883), Abschnitte 3, 4.1, 4.2, 6: https://steamcdn-a.akamaihd.net/apps/valve/2007/NPAR07_IllustrativeRenderingInTeamFortress2.pdf
- Mitchell, Jason: „Stylization with a Purpose: The Illustrative World of Team Fortress 2“, GDC 2008, Folien „Read Hierarchy“, „Environment Design“: https://cdn.cloudflare.steamstatic.com/apps/valve/2008/GDC2008_StylizationWithAPurpose_TF2.pdf
- Eggleston, Ralph (Pixar), Interview „Design With a Purpose“: https://www.animationartconservation.com/design-with-a-purpose,-an-interview-with-ralph-eggleston.html
- Romano, Lou (Pixar), Interview Thunderchunky: https://www.thunderchunky.co.uk/articles/pixar-colour-and-tent-poles-with-lou-romano/ · Sekundär: https://dansandersartanimation.wordpress.com/2019/02/08/lou-romano-colour-script-research/
- Amidi, Amid: *The Art of Pixar: The Complete Colorscripts …*, Chronicle Books 2011: Referenz für die Pixar-Colour-Script-Praxis, nicht eingesehen.
- Walt Disney Family Museum, „Painting Dreams with Mary Blair“: https://www.waltdisney.org/blog/painting-dreams-mary-blair · Canemaker, *The Art and Flair of Mary Blair*, Disney Editions 2003, nicht eingesehen.
- Van Dongen, Joost: „A tool for analysing colour schemes“: https://joostdevblog.blogspot.com/2015/01/a-tool-for-analysing-colour-schemes.html
- Itti, L.; Koch, C.; Niebur, E.: „A Model of Saliency-Based Visual Attention for Rapid Scene Analysis“, IEEE TPAMI 20(11), 1998, S. 1254–1259.
- Ottosson, Björn: „A perceptual color space for image processing“ (OKLab, 2020): https://bottosson.github.io/posts/oklab/
- Etherington #69/#70 (Vorder-, Mittel-, Hintergrund) und #156 (Detail in der Ferne): URLs siehe `R2_ETHERINGTON_ABGLEICH_R1.md`.
- KFB intern: `CANON_3D_R1.md` Gebiete 5/6/15; `replies/COLOR_CONCEPT_R1.md` §2.2 (J17-Werte); `SPEC_PLACEMENT_GRAMMAR_R2.md` §6 (ACES-Befund).

**Nicht zugänglich:** Sharon Calahan, „Storytelling through Lighting“ (SIGGRAPH 1996, Kurs 30). Die gefundenen PDF-Fassungen waren nicht lesbar, deshalb ist die Quelle hier nicht verwendet.
