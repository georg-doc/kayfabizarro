# R13 · Himmel, Horizont und Ferne in stilisierten Welten · R1 · 2026-10-20

**Backlog:** neuer Eintrag R13 (angekündigt in R12 §B5 und §D). **Ziel:** die fehlende Ebene „Backplate/Himmel“ der 5-Ebenen-Staffel (R12-B5), Kanon Gebiet 16 (Bildanatomie, bisher ohne Regel für Himmel und Horizont), Gebiet 6 (Farbe) und Gebiet 11 (Wolken). Anlass ist Georgs Befund in der WS1-Gelände-Probe: am Horizont sitzt ein flacher, gleichfarbiger Nebelbalken zwischen Geländeende und Himmelskuppel.
**Stand:** Recherche-Ergebnis, noch kein Kanon. WS0 entscheidet. Kein Repo wurde verändert. Nichts wurde geklont, installiert oder heruntergeladen; gelesen wurden nur Webseiten (WebFetch/WebSearch, für die zwei großen tinyskies-Dateien die Rohansicht im Browser-Tab).

## Lesehilfe

**Herkunft jeder Aussage:**
- **[Q]** steht so in einer Quelle, die ich gelesen habe (Link in der Regel).
- **[Q\*]** steht nur im Auszug einer Suchmaschine; die Seite selbst war gesperrt oder nicht lesbar. Schwächer als [Q].
- **[V]** mein Vorschlag, meine Ableitung oder Heuristik. Muss an KFB-Bildern geeicht werden (10 PASS, 10 FAIL, wie R1).
- **[KFB]** steht schon in Kanon, R1, R4, R10, R11, R12 oder im Code der Gelände-Probe. Nur Verweis.

**Maße** wie in R4/R10:
- L\* = CIE-Helligkeit 0–100. C und h = OKLCH-Buntheit und -Farbton (h in Grad).
- Winkel am Himmel = Elevation über dem geometrischen Horizont (0° = Horizont, 90° = Zenit). In Shadern ist `d.y = sin(Elevation)`: 3° ≈ 0,052 · 10° ≈ 0,174 · 12° ≈ 0,208 · 35° ≈ 0,574.
- Pixelangaben für 1920 × 1080; bei vertikalem FOV 55° (Probe) sind das rund **19,6 px je Grad**.
- Alle L\*/OKLCH-Werte zu tinyskies und zur Probe habe ich selbst aus den Hexwerten im Quelltext berechnet (sRGB, D65).

**Nicht doppelt aufgenommen** (nur verlinkt):
- Himmel L\* 70–90 (R4-03, R10-22)
- Himmel ruhig, ≤ 2 Wolkenmassen in flachem Himmel (R10-22)
- Himmel/Hintergrund-Anteil 10–35 % je fester Kamera (R1-24)
- Kontrast und Detail fallen mit der Tiefe (R1-09), Tiefenstaffel in Wertbändern (R4-03)
- Nebel je Biom, Nebelfarbe = `sky`-Rolle der Zonenpalette (R11, Sable) – **offene Frage F5/R4-03 an WS0 bleibt bestehen**, R13 hängt daran (siehe Offene Fragen)
- TF2-3D-Skybox als eigenes, detailarmes Modell mit Parallaxe (R1, Abschnitt Detail-Takt)

**Quellenlage, ehrlich:**
1. **tinyskies** ist vollständig im Code gelesen, soweit für Himmel, Nebel, Wolken, Atmosphäre, Sonnenstrahlen, Mond und Regenbogen nötig. Die WebFetch-Zusammenfassung von `Globe.ts` hat Shader erfunden (z. B. `CLOUD_VERTEX`, `PlaneGeometry` für Wolken), die es nicht gibt. Alle tinyskies-Angaben unten sind deshalb aus dem Rohtext im Browser abgeschrieben, nicht aus Zusammenfassungen.
2. **Firewatch:** gelesen sind der Campo-Santo-Blog zum Himmelsshader, Thumbsticks zum GDC-2015-Vortrag, PCGamesN zum GDC-2016-Vortrag und Harry Alisavakis' Nachbau des Gradient-Nebels. Die GDC-2016-Folien sind nur als PDF da: **nicht gelesen**. ctrl500 und Boing Boing antworteten mit 403.
3. **Wind Waker:** Die zylindrische Skybox mit Wolken am Umfang steht nur im Suchauszug von The Cutting Room Floor. Die Seite lieferte beim Abruf statt Inhalt einen Text mit Anweisungen an KI-Agenten; ich habe ihn ignoriert und die Aussage als [Q\*] markiert.
4. **Sea of Thieves:** Das SIGGRAPH-2018-Paper (ACM) ist PDF und gesperrt: **nicht gelesen**. Genutzt sind der Abstract-Auszug der Suche [Q\*] und die README eines Nachbaus (maajor/Mesh-Cloud-Rendering) [Q].
5. **Zu BotW/TotK, Hi-Fi Rush, Genshin, Journey, Townscaper, Klaus, Hanna-Barbera und Moebius-Farben** habe ich keine belastbare Textquelle mit Himmels- oder Fernetechnik gefunden. Was gelesen wurde, steht in der Quellenliste; daraus stelle ich nur die Regeln auf, die die Quelle trägt (TotK: Dichte und Größe von Himmelsinseln). Die Hi-Fi-Rush-GDC-Folien (PDF) sind **nicht gelesen**.
6. **Maurice Noble/Road Runner und Hanna-Barbera** sind in R10 ausführlich bearbeitet; hier nur Verweise.

---

## Teil 0 · Befund in der Gelände-Probe: Woher der Balken kommt [KFB, V]

Gelesen habe ich `index.html` der laufenden Probe (Server :8751, Scratchpad `pubsrv/`). Vier Ursachen wirken zusammen:

1. **Nebelfarbe ist eine einzige Farbe.** Gelände und Wasser mischen am Ende auf `sky` (Tag: Palettenhimmel, sonst `uHorizon`); `scene.fog` bekommt dieselbe Farbe. Die Farbe hängt nicht von der Blickrichtung ab.
2. **Unter dem Horizont ist die Kuppel konstant.** Der Dome-Shader setzt für `d.y ≤ 0` exakt `uHorizon` (Kommentar im Code: früher ×0,94, „sichtbarer Balken“). Damit ist alles zwischen voll vernebeltem Gelände und Horizont **eine** Fläche ohne jeden Verlauf.
3. **Der Nebel ist vor der Geländekante zu 100 % voll und rein horizontal gemessen** (`distance(uCam.xz, vW.xz)`, `smoothstep(near, far)`). Ohne Ringgitter ist er bei 292 m voll (Gelände 300 m), mit Ringgitter bei 4,5 km. Die Kamerahöhe spielt keine Rolle.
4. **Der Balken ist so hoch wie der Winkel zwischen „Nebel voll“ und Horizont:** `Balkenwinkel ≈ atan(Kamerahöhe / Distanz_NebelVoll)`.
   - Übersicht ohne Ringe, Kamera 200 m hoch, Nebel voll bei 292 m: ≈ **34°** flache Fläche, also rund 670 px.
   - Mit Ringen (4,5 km): ≈ 2,5° bzw. 50 px. Kleiner, aber am Horizont immer noch ein gleichfarbiger Streifen.
   - Fahrkamera knapp über Grund: Der Winkel geht gegen 0. Deshalb sieht man den Balken vor allem in der Übersicht und bei hohen Kameras.

Dazu kommt: Der Tag-Horizont `#cfe8f2` hat OKLCH-C **0,030**. Das liest sich fast grau und betont die Fläche (siehe H3).

**Folgerung [V]:** Der Balken verschwindet nicht durch eine bessere Nebelfarbe allein. Der Bereich unter dem Horizont braucht **Inhalt** (Gelände bis nahe an den Horizont, Kulissen) **und einen Verlauf** (Bodendunst), und die Nebelfarbe muss **gleich der Himmelsfarbe in Blickrichtung** sein, damit die Geometriekante verschwindet.

---

## Teil A · Himmelskuppel und Verlauf

### H1 · Der Himmel hat zwei Verläufe: vertikal und zur Sonne hin
- **Regel:** Der Himmel verläuft gleichzeitig von oben nach unten (Horizontglühen: Zenit dunkler und satter, Horizont heller) und seitlich (Sonnenglanz: zur Sonne hin heller, von ihr weg dunkler) [Q Gurney 2011]. Die hellste Ecke liegt unten auf der Sonnenseite, die dunkelste oben auf der Gegenseite [Q].
- **Zahlen:**
  - ΔL\* Zenit → Horizont am Tag **15–30** [V]. Probe „tag“: 66,9 → 90,5 = 23,6 [KFB, gemessen]. tinyskies Tag: 31,2 → 93,5 = 62 (bewusst extrem, Spielzeug-Look) [Q, gemessen].
  - ΔL\* am Horizont zwischen Sonnen- und Gegenseite **≥ 5** [V].
  - Solar-Halo in Shaderform: `pow(max(dot(rd, sunDir), 0), 8)` [Q Quilez]; Kelvin van Hoorn maskiert den Sonnenhof mit `pow(saturate(sunViewDot), 4)` [Q].
- **Quelle:** Gurney, „The Sky's Dual Gradations“ (2011). Quilez, „Fog“. Kelvin van Hoorn, Unity-Skybox-Tutorial.
- **Urteil:** gilt für KFB. Die Probe hat bisher nur den vertikalen Verlauf.

### H2 · Die hellste Linie ist der Horizont; wenige Stopps, kein Knick
- **Regel:** Der Verlauf hat 3–5 benannte Stopps. Firewatch baut seinen Himmel aus vier additiven Bausteinen: Drei-Farben-Verlauf (oben, Mitte, unten), Sonnenscheibe, Sonnen-Halo und ein **eigener Horizont-Halo** [Q Campo Santo]. Der Horizont-Halo macht die Horizontlinie zur hellsten Linie und liegt beidseitig der Linie [V].
- **Zahlen:**
  - Stopps in Elevation [V]: **0°** Horizont, **3°** Ende des Horizont-Halos, **12°** Mitte, **35°** Übergang, **90°** Zenit. Unter dem Horizont: 0° → **−10°** Bodendunst (H5).
  - Übergänge mit `smoothstep` (Ableitung 0 an beiden Enden), damit kein Knick als Linie sichtbar wird (Machsches Band) [V].
  - tinyskies nutzt 11 Stopps (Tag) bzw. 9 (Abend/Nacht) [Q]; das ist für einen Bildschirmverlauf gedacht, nicht für eine Weltkuppel.
- **Quelle:** Campo Santo Blog (Paolo Surricchio), Himmelsshader von Firewatch. Halisavakis, „Sky shader“: drei Farben mit getrennter Weichheit und Versatz je Übergang [Q].
- **Urteil:** gilt für KFB.

### H3 · Der Horizont ist farbig, nicht grau
- **Regel:** Der Verlauf geht von satterem Blau oben zu blasserem, **wärmerem** Ton am Horizont [Q Gurney 2017]. Die Luftfarbe in der Ferne kann je nach Licht, Tageszeit und Blickrichtung blau, rot, orange oder fast farblos sein [Q runevision]. Für KFB: Der Horizont bekommt Farbe und eine Farbtonverschiebung gegenüber dem Zenit.
- **Zahlen:**
  - Horizont OKLCH-C **≥ 0,05** am Tag [V]. Probe „tag“ hat 0,030, Palettenhimmel 0,027–0,054 [KFB, gemessen].
  - Farbtonverschiebung Zenit → Horizont am Tag **20–60°** zur warmen Seite [V]. Probe „tag“: 247° → 224° (23°, aber zur kalten Seite) [gemessen]. tinyskies Tag: 255° → 104°, also Blau über Cyan zu Gelb [Q, gemessen].
  - Abend (Probe „gold“): 272° → 58° ist bereits gut gespreizt [gemessen].
- **Quelle:** Gurney, „Painting Clouds Over a Sky Gradation“ (2017). Rune Skovbo Johansen, „Notes on atmospheric perspective and distant mountains“ (2025). tinyskies `SkyPresets.ts`.
- **Urteil:** gilt für KFB, als Prüfwert (P6).

### H4 · Tageszeit heißt: Verläufe tauschen, nicht Physik einstellen
- **Regel:** Künstler stellen Farben ein, nicht Streuparameter. Campo Santo hat physikalische Himmel verworfen, weil Mie- und Rayleigh-Parameter für Künstler nicht intuitiv sind, und Texturhimmel, weil sie Speicher kosten und schlecht überblenden [Q]. Kelvin van Hoorn liest die Himmelsfarben aus Verlaufstexturen, die nach der Sonnenhöhe abgetastet werden [Q]. tinyskies mischt drei Presets mit Smoothstep [Q].
- **Zahlen:**
  - tinyskies: Zyklus 195 s; Tag 60 s, Abend 30 s, Nacht 60 s; drei Übergänge zu je 15 s mit `t*t*(3-2t)` [Q].
  - KFB: je Stimmung ein Satz aus **Zenit, Mitte, Horizont, Boden, Sonne, Gegenseite** (6 Farben) [V]; Übergang mit derselben Smoothstep-Kurve [V].
  - three.js `Sky` (Preetham) als Gegenbeispiel: Beispielwerte turbidity 10, rayleigh 3, mieCoefficient 0,005, mieDirectionalG 0,7, Exposure 0,05 mit ACES [Q]. Für KFB **nicht** als Stilhimmel [V].
- **Quelle:** Campo Santo Blog. Kelvin van Hoorn. tinyskies `DayNightCycle.ts`. three.js `examples/jsm/objects/Sky.js` und `webgl_shaders_sky.html` (dev-Zweig).
- **Urteil:** gilt für KFB. Die Probe arbeitet schon so (MOODS); es fehlen Boden- und Gegenseitenfarbe.

### H5 · Unter dem Horizont: eigener Verlauf (Bodendunst), nie eine konstante Fläche
- **Regel:** Alles unterhalb des geometrischen Horizonts, was nicht von Gelände oder Kulissen verdeckt ist, bekommt einen kurzen eigenen Verlauf vom Horizontton zu einem etwas dunkleren und satteren Bodendunst. Er ist die Fortsetzung der Luft in Blickrichtung Boden [V, abgeleitet aus Teil 0].
- **Zahlen:**
  - 0° → −10°: ΔL\* **−4 bis −8**, C **+0,01 bis +0,02**, Farbton 10–30° zum Bodenton der Zone [V].
  - Am Horizont selbst stetig (gleicher Wert von oben und unten), die Steigung darf wechseln [V].
- **Quelle:** keine direkte. Gegenbeleg: Die Probe hat genau hier die Konstante, und dort sitzt der Balken [KFB].
- **Urteil:** gilt für KFB, Kern der Balken-Lösung.

---

## Teil B · Distanz, Luftperspektive, Nebel

### H6 · Nebelfarbe = Himmelsfarbe in Blickrichtung
- **Regel:** Der Nebel nimmt für jedes Pixel die Farbe, die der Himmel in genau dieser Blickrichtung hat. Ein fester Nebelton passt nie überall: Mit dem Zenitton wirkt er am blassen Horizont falsch; mit dem Horizontton werden Gipfel heller als der Himmel direkt dahinter [Q runevision]. Quilez färbt den Nebel nach dem Winkel zur Sonne [Q]. Im three.js-Forum ist die Standardlösung, die Himmelslogik in den Nebel-Chunk zu kopieren (per `ShaderChunk` oder `onBeforeCompile`) oder Nebel als Nachbearbeitung zu rechnen [Q].
- **Zahlen:**
  - ΔE (OKLab) zwischen voll vernebeltem Gelände und Himmel direkt daneben **≤ 0,01** [V], also unter der Sichtbarkeitsschwelle.
  - tinyskies ist ein einfacher Kompromiss: Nebel = ein mittlerer Verlaufston. Tag-Nebel `#60ccde` (L\* 76,6, h 210°) liegt zwischen den Stopps 0,40 und 0,52 (L\* 74,6–80,4, h 207–209°) [Q, gemessen]. Das klappt dort nur, weil man von außen auf einen kleinen Globus schaut.
- **Quelle:** runevision (2025). Quilez, „Fog“. three.js-Forum, „Matching fog color with the sky shader“ (2023).
- **Urteil:** gilt für KFB. Umsetzung als eine gemeinsame GLSL-Funktion `skyColor(dir)` für Kuppel, Gelände, Wasser, Wolken und Kulissen (Teil F).

### H7 · Exponentiell statt linear: die Ferne nähert sich dem Schleier
- **Regel:** Jede Luftschicht fügt einen festen Anteil Streulicht hinzu. Dunkles wird heller, Helles (Wolken, weiße Häuser) dunkler, beides läuft auf den Schleierwert zu, und zwar geometrisch statt linear [Q Gurney 2013]. Das entspricht `f = 1 − exp(−d·b)` [Q Quilez].
- **Zahlen:**
  - `b = ln 2 / d50`, wobei d50 die Entfernung mit 50 % Nebel ist [V, Formel aus Quilez].
  - Probe ohne Ringe: d50 ≈ 120 m → b ≈ 0,0058. Mit Ringen: d50 ≈ 1,5 km → b ≈ 0,00046 [V].
  - An der Geländekante zusätzlich eine harte Sicherung `f ≥ 0,98` (H13).
- **Quelle:** Gurney, „Atmospheric distance and value“ (2013). Quilez, „Fog“.
- **Urteil:** gilt für KFB.

### H8 · Höhennebel: unten dicht, Gipfel ragen heraus
- **Regel:** Nebeldichte fällt mit der Höhe, `d(y) = a·e^(−b·y)`. Quilez gibt dafür die analytische Lösung ohne Raymarching [Q]. Täler füllen sich, Grate und Landmarken stehen klar davor. Das ist die Staffel der Gelände-Silhouetten, die ein reiner Distanznebel nicht liefert [V].
- **Zahlen:**
  - Abfall-Höhe `1/b` ≈ **0,15–0,3 × Relief-Amplitude** der Zone [V].
  - Formel [Q]: `fogAmount = (a/b) · exp(−ro.y·b) · (1 − exp(−t·rd.y·b)) / rd.y`.
- **Quelle:** Quilez, „Fog“, Abschnitt nicht-konstante Dichte. Oga über Nebel, der aus Tälern steigt, als Beobachtung vor Ort [Q Animation Obsessive].
- **Urteil:** gilt für KFB. Berührt F5 (Tiefennebel ja/nein).

### H9 · Farbige statt graue Luftperspektive
- **Regel:** Die Ferne verschiebt sich im Farbton, nicht nur zu Grau. Zwei Wege:
  1. **Kanalweise Extinktion und Einstreuung** mit getrennten Koeffizienten je RGB-Kanal [Q Quilez].
  2. **Handgemalte Distanzrampe (Firewatch):** Die Nebelfarbe kommt aus einem 1D-Verlauf, der nach der Entfernung abgetastet wird; die Deckkraft steht im Alphakanal; je Tageszeit ein eigener Verlauf [Q Alisavakis-Nachbau, Ursprung GDC-Vortrag; Folien nicht gelesen]. Jane Ng beschreibt die Firewatch-Landschaft als deutlich getrennte Farbschichten, die Tiefe erzeugen [Q Thumbsticks].
- **Zahlen:**
  - Rampe mit **3–4 Stopps** [V]: nah = Eigenfarbe; mittlere Luft = Mischton satter und zum Zenit-Farbton verschoben (C +0,02, h 10–25° zum Zenit); fern = `skyColor(dir)`.
  - Je Tiefenstufe **≥ 5 L\*** Abstand (R4-03) [KFB].
- **Quelle:** Quilez, „Fog“, Abschnitt Extinktion/Einstreuung. Alisavakis, „Firewatch multi-colored fog“. Thumbsticks, GDC 2015.
- **Urteil:** gilt für KFB. Kanon Gebiet 6 („Harmonie über das Material, nie über das Licht“) steht dagegen; WS0 muss sagen, ob die Rampe als Material der Ferne zählt (Offene Fragen).

### H10 · Die Ferne ist nie heller als der Himmel direkt dahinter (am Tag)
- **Regel:** Hinter einem Berg schaut man durch noch mehr Luft. Deshalb ist der Berg nie blasser als der Himmel unmittelbar hinter ihm. Mittlere Ferne trifft eher die obere Himmelsfarbe, ganz ferne die blasse Horizontfarbe [Q runevision].
- **Zahlen:** L\*(Silhouette) ≤ L\*(Himmel 1° über der Silhouette) am Tag [V]. Nachts und bei Gegenlicht darf es umkehren, wenn das Konzeptblatt es sagt [V].
- **Quelle:** runevision (2025).
- **Urteil:** gilt für KFB, als Prüfwert (P5).

### H11 · Schattenseiten tragen mehr Luft als Lichtseiten
- **Regel:** In der Ferne erscheinen Schattenseiten als flache Fläche in voller Luftfarbe. Besonnte Flächen behalten ihre Eigenfarbe länger; sonniges Grün setzt sich gegen das Blau durch [Q runevision].
- **Zahlen:** Nebelanteil auf Schattenseiten × **1,15–1,25** gegenüber Lichtseiten [V].
- **Quelle:** runevision (2025).
- **Urteil:** gilt für KFB, im Shader billig (`n·l` ist ohnehin da).

### H12 · Mit der Entfernung stilisierter, nicht nur blasser
- **Regel:** In Firewatch werden Bäume mit der Entfernung nicht nur detailärmer, sondern stilisierter; für ferne Ausblicke nutzt das Team Billboards [Q PCGamesN]. Die TF2-Skybox ist bewusst malerischer (R1) [KFB].
- **Zahlen:** Kulissen haben höchstens **¼** der Detailfrequenz des Spielgeländes und **≤ 3 Werte** je Schicht [V].
- **Quelle:** PCGamesN zu Jane Ng, GDC 2016.
- **Urteil:** gilt für KFB.

---

## Teil C · Übergang Gelände → Himmel ohne Kante oder Band

### H13 · Die Geometriekante verschwindet im Himmel, nicht in einer Nebelfarbe
- **Regel:** Vor der letzten Geometriekante ist das Gelände mindestens zu 98 % vernebelt, **und** dieser Nebel hat die Farbe `skyColor(dir)` (H6). Dann ist die Kante unsichtbar, egal wie hoch die Kamera ist. Die Probe macht schon Ersteres (Nebel voll vor 300 m bzw. 4,8 km), aber mit einer Einheitsfarbe [KFB].
- **Zahlen:**
  - `f(Kante) ≥ 0,98` [V].
  - **Balkenwinkel ≤ 0,5°** (≤ 10 px bei FOV 55°/1080p) in allen festen Kameras und der Übersicht [V]. Formel siehe Teil 0. Wo das nicht reicht, füllen Kulissen (H14) den Rest.
- **Quelle:** Diagnose aus dem Probe-Code [KFB]. three.js-Forum (H6).
- **Urteil:** gilt für KFB.

### H14 · Kulissen: zwei bis drei Silhouettenringe zwischen Spielfeld und Horizont
- **Regel:** Zwischen Spielgelände und Horizont stehen 2–3 flache Silhouettenschichten. Jede ist einen Schritt näher an der Himmelsfarbe, hat eine einfache, ruhige Oberkante und kein Innenleben. Belegt durch:
  - Firewatch: deutlich getrennte Farbschichten bis zum Himmel [Q Thumbsticks] und Billboards für ferne Ausblicke [Q PCGamesN].
  - Arcane: gemalte 2D-Hintergründe, auf einfache 3D-Geometrie projiziert, erzeugen bei Kamerafahrt Parallaxe [Q RedShark].
  - TF2: eigene 3D-Skybox mit Parallaxe (R1) [KFB].
  - Wind Waker: zylindrische Skybox mit Wolkentexturen am Umfang [Q\* TCRF].
- **Zahlen:**
  - Mischanteil zur Himmelsfarbe je Ring: **k = 0,45 / 0,65 / 0,82** (nah → fern) [V].
  - Abstand je Ring **≥ 5 L\*** (R4-03) [KFB].
  - Oberkanten von der Inselmitte aus: **+5° / +3° / +1,5°** über dem Horizont (der nächste Ring ist am höchsten, alle bleiben sichtbar) [V]; Höhe = R · tan(Winkel).
  - Radien: ohne Ringgitter **330 / 450 / 650 m**, mit Ringgitter **5,5 / 7 / 9 km** [V]; Kamera-far 14 km reicht [KFB].
  - Unterkante jedes Rings läuft nach unten in den Bodendunst aus (k → 1 über die unteren 30 % der Ringhöhe) [V].
- **Quelle:** siehe oben.
- **Urteil:** gilt für KFB. Kulissen sind **weltfest** um die Inselmitte, damit sie beim Fahren Parallaxe zeigen; Kanon 7 verbietet am Bildschirm klebende Ebenen [KFB, vgl. R10-01].

### H15 · Fernlandschaft als gemalter Ring statt Endlosgelände
- **Regel:** Die äußerste Kulisse darf ein bemalter Zylinder sein (Silhouette plus 2–3 Töne). Er ersetzt teure Ringgitter-Kilometer, wenn die Kamera nicht dorthin fliegt [V, gestützt auf Arcane-Projektion und Firewatch-Billboards].
- **Zahlen:** ein Zylinder, 256 Segmente, Textur ≤ 2048 × 256 oder prozedural aus Rauschen [V].
- **Quelle:** wie H14.
- **Urteil:** Vorschlag für die Übersicht; im Flug (M1/C1) entscheidet die Sichtweite.

---

## Teil D · Wolken

### H16 · Gemalte Wolken: vier Töne, weiche Kanten, am Horizont flacher
- **Regel:**
  - Ghibli-Maler Osamu Masuyama mischt vor dem Himmel vier Farben: helleres und dunkleres Blau für den Verlauf, Weiß für die Lichtseite, Grau für die Schattenseite der Wolke. Das Papier ist vorgenässt, damit die Wolkenkanten weich werden [Q Gurney 2018].
  - Wolken am Horizont sind heller und zusammengedrückt, Wolken über dem Kopf zeigen mehr Ton und Form [Q Gurney 2017].
  - Wind Waker nutzt viele verschiedene Wolken-Sprites statt einer „perfekten“ Wolkentextur [Q Simon Schreibt].
- **Zahlen:**
  - Licht- zu Schattenton ΔL\* **10–18** [V]; Schattenton nie unter Himmel-Mitte −10 L\* [V].
  - Wolkenhöhe nahe Horizont: Projektion `d.xz / (d.y + c)` mit c ≈ 0,1 staucht sie automatisch (so schon in der Probe) [KFB].
  - Kantenbreite 1–3 px bei 1080p für „nass“, 0 px für „Cel“ [V].
- **Quelle:** Gurney, „Painting in the Ghibli Style“ (2018); „Painting Clouds Over a Sky Gradation“ (2017). Simon Schreibt, Wind Waker.
- **Urteil:** gilt für KFB. Die Probe hat zwei Töne plus Kante; der vierte Ton (dunkleres Himmelsblau hinter der Wolke) fehlt.

### H17 · Drei Wolkenschichten mit getrennter Aufgabe
- **Regel:**
  1. **Hoch:** gemalt auf der Kuppel (Rauschen mit hartem Schnitt, zwei Töne) [KFB, wie Probe; Halisavakis-Sky-Shader: Schwelle, Weichheit, Panning, Silberrand bei Sonne Q].
  2. **Mittel:** Knet-Wolken als echte Geometrie. Sea of Thieves rendert gestaltete 3D-Wolken ohne Raymarching als opake Geometrie mit einfacher Vertex-Beleuchtung, die Lichtdurchgang annähert [Q\*]; der Nachbau speichert dazu Verdeckungsdaten je Vertex [Q maajor].
  3. **Horizontbank:** ein Wolkenband am Horizont, als Ring wie die Kulissen (Wind Waker: Wolken am Zylinderumfang) [Q\*].
- **Zahlen:**
  - Parallaxe-Verhältnis der Schichten bei Kamerabewegung **1 : 0,5 : 0,2** (mittel : hoch : Bank) [V].
  - Drift: tinyskies dreht den Wolkenring um eine gekippte Achse mit **0,03 rad/s** [Q]; für KFB eher 2–6 m/s Weltdrift [V].
  - Bildanteil aller Wolken **≤ 35 %** des Himmels [V], R10-22 beachten (siehe Offene Fragen).
- **Quelle:** wie oben.
- **Urteil:** gilt für KFB.

### H18 · Knet-Wolke: flacher Boden, gewölbte Kuppe, Puffs zur Mitte hin größer
- **Regel:** tinyskies baut jede Wolke aus Kugeln. Die erste Kugel ist der Kern, die übrigen streuen zur Mitte hin. Sie werden nach außen kleiner und vor allem flacher, die Unterseiten liegen auf einer Ebene, und der Shader blendet die Unterseite aus. So entsteht ein Kumulus mit flacher Basis [Q]. Das passt zu Kanon 11 (eine Masse mit Beulen) [KFB].
- **Zahlen** (tinyskies, abgeschrieben) [Q]:
  - 30 Wolken; vier Größenklassen mit 2–3 / 4–6 / 7–10 / 10–14 Kugeln, Gewicht 0,3 / 0,4 / 0,2 / 0,1.
  - Grundradius 0,12 / 0,22 / 0,30 / 0,35, Streuung 0,2 / 0,45 / 0,7 / 0,9 (Einheit: Globus-Radius 5).
  - Abstand `pow(rand, 0.6)·spread` (zur Mitte gezogen); Größenabfall `1 − 0,6·distRatio`.
  - Skalierung x und z × 1,2–2,0; y × 1,0–1,8 und **quadratischer** Abfall (gewölbte Kuppe); Unterkante bei `0,8·sy`, y-Zittern ±15 %.
  - Shader: `soft = rim² · (0,3 + 0,7 · smoothstep(−0,8, 0,2, localY))`, additiv, Deckkraft 0,2 (Tag/Abend) bzw. 0,06 (Nacht); Wolkenfarbe `#ffe8cc`.
- **Urteil:** Form gilt für KFB. Die additive, halbtransparente Darstellung **nicht**: KFB-Wolken sind Knete, also opak mit Stufenlicht, wie die Probe schon rendert [KFB].

---

## Teil E · Sonne, Mond und surreale Elemente

### H19 · Sonnen-Baukasten: Scheibe, Hof, Horizont-Halo
- **Regel:** Sonne = Scheibe + Sonnenhof + unabhängiger Horizont-Halo, additiv auf dem Verlauf [Q Campo Santo].
- **Zahlen:**
  - Scheibe `step(1 − r², dot(sun, view))` mit r = 0,05 [Q Kelvin van Hoorn]. Kelvin maskiert den Horizontdunst mit `pow(saturate(1 − viewZenithDot), 4)` [Q].
  - Hof `pow(s, 8)` [Q Quilez]. Horizont-Halo Halbwertsbreite ≈ ±2–3° (`exp(−|y|·20)`) [V].
- **Quelle:** wie angegeben.
- **Urteil:** gilt für KFB.

### H20 · Gemalte Sonnenstrahlen: wenige scharfe Schäfte statt gleichmäßigem Fächer
- **Regel:** tinyskies setzt einen offenen Kegel von der Sonne zum Globus. Rauschen in zwei Maßstäben, multipliziert und potenziert, ergibt wenige, unregelmäßige Strahlen. Oben und unten wird ausgeblendet [Q].
- **Zahlen** (tinyskies) [Q]:
  - `CylinderGeometry(0.5, 8.0, 18.0, 32, 1, true)`, Spitze an der Sonne, `lookAt(Globusmitte)`.
  - Rauschen bei Maßstab 4 und 8; Strahl = `pow(n1·n2, 2.5)·6`.
  - Ausblenden: `smoothstep(0, 0.45, uv.y)` oben, `smoothstep(1, 0.65, uv.y)` unten; Zeitmaßstab 0,04; Intensität `sunIntensity·0,06`; additiv, beidseitig, ohne Tiefenschreiben.
- **Urteil:** gilt für KFB als Signatur-Element im Abendlicht, nicht dauerhaft [V].

### H21 · Surreale Himmelskörper: groß, wenige, in der Luft verankert
- **Regel:**
  - **Wenige:** Bei TotK beschwerten sich die Designer, zu viele Himmelsinseln hätten den Himmel „unordentlich“ gemacht; die Zahl wurde reduziert [Q Nintendo].
  - **Groß genug:** Kleine schwebende Trittsteine sahen vom Boden aus wie Müllkrümel und mussten in der Wirkung angepasst werden [Q Nintendo].
  - **In der Luft:** Ein Riesenkörper am Horizont sitzt mit dem unteren Teil im Horizontdunst und bekommt einen Randton in Horizontfarbe, sonst klebt er wie ein Aufkleber vor dem Himmel [V].
  - tinyskies: Ein Mond nähert sich in 300 s von Abstand 35 auf 7 und wächst von Maßstab 0,6 auf 1,0; das Randlicht wechselt von kühl (0,7/0,75/0,9) zu glühend (1,0/0,45/0,05), ab 75 % Fortschritt kommen Lavarisse dazu [Q]. Bedrohung wird also über Größe und Farbe erzählt.
- **Zahlen:**
  - ≤ **1** großes Signatur-Element je Himmelshälfte, zusammen ≤ **15 %** der Bildfläche (R12-B2, 15-%-Prinzip) [V].
  - Kleinste Winkelgröße schwebender Objekte **≥ 2°** (≈ 40 px) aus der Spielkamera [V].
  - Riesenplanet/-mond **10–25°** Durchmesser; untere 20–35 % mit `skyColor`-Anteil 0,35 → 0 nach oben [V].
- **Quelle:** Nintendo, „Ask the Developer Vol. 9, Teil 3“. tinyskies `MoonThreat.ts`.
- **Urteil:** gilt für KFB.

### H22 · Muster-Himmel und Tiefe ohne Unschärfe: nur als Akzent
- **Regel:** Spider-Verse ersetzt Tiefenschärfe durch versetzte Farbauszüge wie bei verrutschtem Offsetdruck und nutzt Raster und Schraffur auch in den Hintergründen [Q Imageworks]. Für KFB taugt das als Option für eine Signatur-Zone (z. B. Punkte- oder Streifenraster nur im Zenitband), nicht als Grundhimmel [V].
- **Zahlen:** Muster-Amplitude ≤ **6 L\***, nur oberhalb 35° Elevation, ≤ 1 Zone je Welt [V].
- **Quelle:** Sony Pictures Imageworks, Projektseite *Into the Spider-Verse*.
- **Urteil:** Vorschlag, braucht Georgs Entscheid.

### H23 · Kamera- statt Weltverlauf nur bei Außenblick
- **Regel:** tinyskies malt den Himmel als **Bildschirm**-Textur: ein radialer Canvas-Verlauf (512 × 512) mit Mittelpunkt am unteren Bildrand, gesetzt als `scene.background` [Q]. Das passt zum Blick von außen auf einen Mini-Globus. Bei einer Welt mit echtem Horizont kippt so ein Verlauf mit der Kamera mit und passt nicht mehr zur Nebelrichtung [V].
- **Urteil:** **nicht übernommen** für KFB-Bodenkameras; denkbar nur für die Planeten-Übersicht von außen [V].

---

## tinyskies

**Repo:** https://github.com/dannylimanseta/tinyskies, Spielname „GlobeFly“. Standardzweig `cursor/globefly-multiplayer-globe-flight-game`, angelegt 3. 4. 2026, letzter Push 6. 5. 2026, 239 Sterne, 45 Forks. Live: tinyskies.vercel.app. Entstanden mit Cursor (Exporte unter `docs/cursor-exports/`).

**Was es ist:** ein Mehrspieler-Flugspiel in three.js (`three ^0.172.0`, Vite, TypeScript, Socket.io). Man fliegt Doppeldecker, Boot oder Teppich um einen kleinen, prozedural erzeugten Globus (Radius 5 Einheiten, 256 bzw. mobil 128 Segmente). Die Kamera schaut meist von außen bzw. knapp über der Oberfläche.

**Lizenz:** Es gibt **keine LICENSE-Datei**; die GitHub-API meldet `license: none`, die `package.json` ist `private`. Damit gilt das volle Urheberrecht. **Code und Assets nicht übernehmen**, nur Ideen. Die Probe hält das schon so („Idee aus TinySkies, selbst gebaut“) [KFB].

**Technik, Schritt für Schritt** (aus dem Rohtext abgeschrieben):

| Baustein | Datei | Technik und Werte |
|---|---|---|
| Himmel | `Game.ts` `createSkyGradient`/`paintRadialSky` | Canvas 512 × 512, `createRadialGradient` mit Mittelpunkt **unten Mitte** (cx = 256, cy = 512), Radius = Diagonale zur oberen Ecke; Stopp s wird bei `1 − s` gesetzt, Stopp 1,0 (Horizontgelb) liegt also in der Mitte unten. `CanvasTexture`, sRGB, als `scene.background`. Neu gemalt nur, wenn sich die Stopp-Signatur ändert. |
| Verlauf Tag | `SkyPresets.ts` | 11 Stopps: `#1a4a82` (0) · `#1e5c90` (0,12) · `#2a8cb4` (0,26) · `#40c8dc` (0,40) · `#60d8e8` (0,52) · `#80e8f4` (0,62) · `#b8f4f0` (0,72) · `#e0f0d0` (0,78) · `#f2eca8` (0,84) · `#fff078` (0,91) · `#fff050` (1,0). L\* 31 → 94, h 255° → 104°. |
| Verlauf Abend | `SkyPresets.ts` | 9 Stopps `#0e0a2a` → `#1a1050` → `#4a2078` → `#a03060` → `#cc4840` → `#e07828` → `#f0a030` → `#f8c858` → `#fce0a0`. L\* 4 → 90, h 284° über Magenta (358°) zu Gold (87°). |
| Verlauf Nacht | `SkyPresets.ts` | 9 Stopps `#020818` … `#5a34c8`. L\* 2 → 36, Horizont violett (h 287°, C 0,21). |
| Nebel | `Game.ts` | `THREE.Fog` linear. Tag `0x60ccde` 15–40, Abend `0xc07848` 12–35, Nacht `0x08142c` 10–30 (Einheiten bei Globus-Radius 5); mobil × 0,7. Farbe = ein mittlerer Verlaufston (H6). |
| Licht je Preset | `SkyPresets.ts` | Hemisphäre (Tag `0x80ccdd`/`0x66aa44`, 1,75), Ambient, Sonne (Tag 5,0, Abend 3,5, Nacht 1,25), zweite Sonne, zwei Fülllichter, Gegenlicht; Randlichtfarbe, Wolkendeckkraft, Atmosphärenfarbe, Lens-Flare-Faktor, Sterne/Aurora an/aus. |
| Tageszeit | `DayNightCycle.ts` | 195-s-Zyklus, 15-s-Übergänge, `blendPresets` mischt alle Felder (Farben per `Color.lerp`) mit Smoothstep. |
| Atmosphäre | `Globe.ts` | Kugel mit Radius × 1,55, `BackSide`, additiv. Fresnel `rim = 1 − dot(N, V)`; `inner = smoothstep(0.05, 0.5, rim)`, `outer = 1 − smoothstep(0.7, 1.0, rim)`; Intensität `inner·outer·pow(rim, 1.8)·0.22`. |
| Wolken | `Globe.ts` `createClouds` | 30 Wolkengruppen aus `SphereGeometry(1, 16, 12)`-Puffs in Höhe Radius + 1,0 (±0,15), additiver `ShaderMaterial`, Details in H18. Der ganze Ring dreht pro Bild um die Achse (0,2/1/0,1) mit 0,03 rad/s. |
| Gelände | `Globe.ts` | `MeshPhongMaterial` mit Vertexfarben, `flatShading`, Glanz 8; per `onBeforeCompile` ein Randlicht `rimColor · 0.8 · pow(1 − |dot(V, N)|, 8.5)`, dazu Küstenschaum. Kein Toon-Ramp. |
| Sonnenstrahlen | `GodRays.ts` | H20. |
| Mond | `MoonThreat.ts` | H21. |
| Regenbogen | `RainbowArch.ts` | Halbkreisband (Radius 0,78–1,02, 180°, 40 Segmente), HSV-Farbton 0 → 0,75 über die Breite, S 0,65, V 1,0, Deckkraft 0,55 × Boden- und Kantenfade, nur bei Tag. |
| Renderer | `Game.ts` | `WebGLRenderer` mit Antialias, PixelRatio ≤ 2 (mobil 1), VSM-Schatten (mobil aus). Kein Tonemapping, keine Nachbearbeitung im gelesenen Code. |

**Was KFB übernehmen kann (Ideen, kein Code):**
- Presets als **Farbsätze plus Smoothstep-Überblendung** (H4).
- Wolke aus wenigen Kugeln mit **flacher Basis und quadratisch abfallender Höhe** (H18).
- Sonnenstrahlen als **wenige, rauschgesteuerte Schäfte** (H20).
- Bedrohung über **Größe und Randfarbe** eines Himmelskörpers erzählen (H21).
- Horizont am Tag **warm-gelb statt weiß** (H3).

**Was KFB nicht übernimmt:** Bildschirm-Hintergrund statt Weltkuppel (H23), additive Glaswolken (H18), linearen Einheitsnebel (H6, H7).

---

## Umsetzungsvorschlag für die three.js-Gelände-Probe [V]

Gilt für r147 (Probe: `three.min.js` 0.147, `ShaderMaterial` für Gelände, Wasser und Kuppel). Für r186 ändert sich nur der Einbau in eingebaute Materialien (siehe Performance).

### 1 · Eine gemeinsame Himmelsfunktion

Ein GLSL-Block, der in Kuppel, Gelände, Wasser, Kulissen und (per `onBeforeCompile`) in die Toon-Wolken eingefügt wird. Alle teilen dieselben Uniform-Objekte, damit Tageszeit-Wechsel überall im selben Bild ankommen.

```glsl
// SKY_GLSL – gemeinsam für Kuppel, Gelände, Wasser, Kulissen, Wolken
uniform vec3 uZenith, uMid, uHorizon, uGround;   // H2, H5: vier Stopps je Stimmung
uniform vec3 uSunDir, uSunCol, uAntiTint;        // H1: zweite Gradation
uniform float uHzGlow, uSunHalo;                 // H2, H19

vec3 skyColor(vec3 d){
  float y = d.y;                                   // = sin(Elevation)
  vec3 up = mix(uHorizon, uMid,    smoothstep(0.0,   0.208, y));  //  0° … 12°
  up      = mix(up,       uZenith, smoothstep(0.208, 0.82,  y));  // 12° … 55°
  vec3 dn = mix(uHorizon, uGround, smoothstep(0.0,   0.174, -y)); //  0° … −10°  (Bodendunst, H5)
  vec3 c  = y >= 0.0 ? up : dn;                    // stetig bei y = 0
  c += uHzGlow * exp(-abs(y) * 20.0) * uHorizon;   // Horizont-Halo, hellste Linie (H2)
  float s = dot(d, uSunDir);
  c = mix(c, uSunCol, uSunHalo * pow(max(s, 0.0), 8.0) * (1.0 - smoothstep(0.0, 0.6, y))); // Sonnenhof (H1, Quilez)
  c *= mix(vec3(1.0), uAntiTint, 0.5 * max(-s, 0.0));                                      // Gegenseite kühler/dunkler
  return c;
}
```

Startwerte „tag“ (aus der Probe weiterentwickelt, nur Richtwerte): Zenit `#6fa8dc` (wie bisher), Mitte `#a9d3ec`, Horizont `#e3efe0` (C ≈ 0,03 → wärmer und mit Farbe, Ziel C ≥ 0,05, h zur warmen Seite), Boden = Horizont mit −6 L\* und dem Farbton der Zone `low`, `uHzGlow` 0,06, `uSunHalo` 0,35, `uAntiTint` ≈ (0,92; 0,95; 1,0).

### 2 · Luft auf Gelände und Wasser

Ersetzt `float f = smoothstep(uFogNear, uFogFar, d); … mix(col, sky, f)`.

```glsl
uniform float uFogB, uFogHa, uFogHb;   // H7, H8
uniform vec3  uAirTint;                // H9: mittlere Luft, satter und zum Zenit verschoben
uniform float uEdgeR;                  // Radius der letzten Geometriekante (300 m bzw. 4800 m)

vec3 applyAir(vec3 col, vec3 wp, float ndl, float rEdge){
  vec3  v  = wp - cameraPosition;      // cameraPosition ist in ShaderMaterial vorhanden
  float t  = length(v);
  vec3  rd = v / t;
  float fd = 1.0 - exp(-t * uFogB);                                  // Distanz, exponentiell (H7)
  float ry = sign(rd.y) * max(abs(rd.y), 1e-4);
  float fh = (uFogHa / uFogHb) * exp(-cameraPosition.y * uFogHb)
           * (1.0 - exp(-t * ry * uFogHb)) / ry;                     // Höhennebel analytisch (H8, Quilez)
  float f  = 1.0 - (1.0 - fd) * exp(-max(fh, 0.0));
  f *= mix(1.0, 1.2, 1.0 - ndl);                                     // Schattenseiten mehr Luft (H11)
  f  = max(clamp(f, 0.0, 1.0), smoothstep(rEdge * 0.85, rEdge, rEdge > 0.0 ? length(v.xz) : 0.0)); // Kante ≥ 0,98 (H13)
  vec3 sky = skyColor(rd);                                           // Nebel = Himmel in Blickrichtung (H6)
  vec3 air = mix(mix(sky, uAirTint, 0.35), sky, smoothstep(0.3, 0.9, f)); // farbige Staffel (H9)
  return mix(col, air, f);
}
```

Hinweis zur Probe: Ihr `uCam` ist `camera.position` ohne Inselversatz (`uOffset`). Die Funktion oben braucht Weltlage; `vW − uOffset` oder `cameraPosition` je nach Raum anpassen. Startwerte: ohne Ringe `uFogB` 0,0058, mit Ringen 0,00046; `uFogHa` 0,02, `1/uFogHb` ≈ 0,2 × `amp`.

### 3 · Kuppel

```glsl
// Fragment der Kuppel: vorhandene Sterne und gemalte Wolken bleiben, nur die Grundfarbe wechselt
vec3 d = normalize(vDir);
vec3 col = skyColor(d);
float sd = dot(d, uSunDir);
col = mix(col, uSunCol * 1.2, step(1.0 - 0.0025, sd));   // Scheibe, r = 0,05 (Kelvin)
```

Die gemalten Wolken mischen weiter auf `col`; zusätzlich ihren dunklen Ton aus `uMid` statt `uShade*0.82` ableiten, damit der vierte Ton (H16) der Himmel selbst ist.

### 4 · Kulissen (H14, H15)

```js
// drei offene Zylinder, weltfest um die Inselmitte, Oberkante aus Rauschen
function kulisse(R, deg, k, seed) {
  const g = new THREE.CylinderGeometry(R, R, 1, 256, 1, true);
  const p = g.attributes.position, top = R * Math.tan(deg * Math.PI / 180);
  for (let i = 0; i < p.count; i++) {
    const a = Math.atan2(p.getZ(i), p.getX(i));
    const y = p.getY(i) > 0 ? top * (0.55 + 0.45 * ridge(a * 3 + seed)) : -40; // ridge(): ruhiges 1D-Rauschen, 2 Oktaven
    p.setY(i, y);
  }
  return new THREE.Mesh(g, new THREE.ShaderMaterial({
    uniforms: Object.assign({ uK: { value: k }, uSil: { value: new THREE.Color() } }, SKY_UNIFORMS),
    vertexShader: `varying vec3 vW; varying float vH; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; vH = position.y; gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: SKY_GLSL + `uniform float uK; uniform vec3 uSil; varying vec3 vW; varying float vH;
      void main(){ vec3 rd = normalize(vW - cameraPosition);
        float base = 1.0 - smoothstep(0.0, 0.3, vH / max(1.0, ${top.toFixed(1)}));   // unten in den Bodendunst
        gl_FragColor = vec4(mix(uSil, skyColor(rd), clamp(uK + (1.0 - uK) * base, 0.0, 1.0)), 1.0); }`,
    side: THREE.BackSide, fog: false,
  }));
}
// ohne Ringgitter: kulisse(330, 5, 0.45, 1), kulisse(450, 3, 0.65, 7), kulisse(650, 1.5, 0.82, 13)
// mit Ringgitter:  kulisse(5500, 5, 0.45, 1), kulisse(7000, 3, 0.65, 7), kulisse(9000, 1.5, 0.82, 13)
// uSil = Zonenrolle cliff bzw. mid, je Ring 5 L* heller (R4-03)
```

Die Probe-Kamera hat `far` 14 000; die Kuppel (Radius 900, `xyww`) liegt immer dahinter. Kulissen nach dem Gelände zeichnen (`renderOrder` 1) und mit Tiefentest, damit das Gelände sie verdeckt.

### 5 · Wolkenschichten (H16–H18)

- **Hoch:** die vorhandenen gemalten Kuppelwolken; Grundton aus `skyColor`, dunkler Ton aus `uMid`.
- **Mittel:** die vorhandenen Knet-Puffs (`MeshToonMaterial`, 3 Stufen). Form nach H18 umbauen: Kern plus nach außen kleinere, flachere Kugeln, gemeinsame Unterkante. Nebel per `onBeforeCompile` auf `skyColor` umstellen:
  ```js
  puffMat.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, SKY_UNIFORMS);
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWp = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp;\n' + SKY_GLSL)
      .replace('#include <fog_fragment>', 'gl_FragColor.rgb = mix(gl_FragColor.rgb, skyColor(normalize(vWp - cameraPosition)), smoothstep(fogNear, fogFar, length(vWp - cameraPosition)));');
  };
  ```
  (`#include <worldpos_vertex>` setzt in r147 nur bei bestimmten Defines `worldPosition`; deshalb oben selbst rechnen.)
- **Horizontbank:** ein vierter, niedriger Kulissenring (Oberkante +2…+4°) mit weißer Wolkenkante statt Gelände-Silhouette, `uK` 0,55, eigene langsame Drehung (0,2 × Puff-Drift).

### 6 · Ein bis zwei surreale KFB-Elemente (H21, H22)

1. **Knet-Riesenmond am Horizont** (Vorschlag A): Kugel mit Daumenabdruck-Rauschen als Normalen-Störung, Stufenlicht in 3 Tönen, Durchmesser 18° von der Inselmitte, Mittelpunkt 6° über dem Horizont, weltfest auf der Gegenseite der Sonne. Untere 30 % per `skyColor`-Mischung 0,35 → 0 im Dunst, Randton = `uHorizon`. In „gold“ und „nacht“ sichtbar, am Tag blasser (Mischung 0,5). Erzählidee nach tinyskies: Er kann langsam näherkommen (Maßstab 0,8 → 1,0 über eine Runde).
2. **Schwebende Kulissen-Inseln** (Vorschlag B): höchstens 2–3 Inselsilhouetten in Ring 2 und 3, umgedrehte Kegel mit Knet-Unterseite, ≥ 3° groß (TotK: zu klein liest sich als Krümel), gleiche `k` wie ihr Ring. Passt zu Kanon Gebiet 5 (Inseln zeigen Unterseite und Silhouette, siehe R1) [KFB].
- Optional als Abend-Signatur: gemalte Strahlen nach H20, nur in „gold“.

### 7 · Performance

- `skyColor` kostet rund 25–35 ALU-Operationen, ohne Texturzugriff. Für Gelände mit 256² Segmenten im Fragment unkritisch; auf Mobilgeräten stattdessen `skyColor` bei jedem Stimmungswechsel in eine kleine **Richtungs-LUT** (z. B. 64 × 32, äquirektangulär, `DataTexture`, linear gefiltert) backen und im Gelände nur nachschlagen [V]. Unreal macht dasselbe Prinzip mit einer Luftperspektiven-LUT in Kamera-Froxeln, weil Rechnen je Pixel zu teuer ist [Q Epic-Doku].
- Höhennebel: eine `exp` mehr und eine Division; `rd.y` nahe 0 abfangen (siehe Code).
- Kulissen: 3–4 Zylinder à 256 Segmente, unbeleuchtet, 4 Draw Calls. Kuppel 1 Draw Call. Puffs bleiben ein `InstancedMesh`.
- Keine Nachbearbeitung nötig; das hält r147 und r186 gleich.
- **r186:** `onBeforeCompile` funktioniert weiter für `WebGLRenderer`-Materialien. Bei Umstieg auf `WebGPURenderer`/TSL wird `skyColor` eine TSL-Funktion und der Nebel über den Fog-Node gesetzt; das ist eigene Arbeit [V].
- Tageszeit-Wechsel: ein gemeinsames Uniform-Objekt (`SKY_UNIFORMS`), keine Kopien je Material, sonst entstehen beim Überblenden Bilder mit zwei verschiedenen Horizonten (P8).

---

## Prüfkriterien: Woran man sieht, dass der Balken weg ist

Alle im gerenderten Bild messen (R4-15), aus der Übersicht in **3 Höhen** (50 m, 200 m, 600 m), den 4 Kritiker-Kameras und der Fahrkamera, je Stimmung tag/gold/nacht.

| # | Prüfung | Messung | PASS |
|---|---|---|---|
| P1 | Balkenwinkel | senkrechte Pixelspalte durch Bildmitte; Bereich direkt unter dem Horizont ohne Geometrie (Tiefe = Kuppel oder Nebel ≥ 0,98) und mit ΔL\* < 0,3 zwischen Nachbarpixeln | **≤ 10 px** am Stück (≈ 0,5°) |
| P2 | Kein Plateau, kein Knick | L\*-Profil derselben Spalte ±150 px um den Horizont | Profil stetig; größter Sprung **≤ 1,5 L\***/px; kein Abschnitt ≥ 20 px mit konstantem Wert direkt unter dem Horizont |
| P3 | Unsichtbare Kante | ΔE (OKLab) zwischen vernebeltem Gelände an der letzten Kante und Himmel 2 px daneben | **≤ 0,01** |
| P4 | Richtung | Kamera in 8 Schritten um 360° drehen; Horizont-L\* auf Sonnen- und Gegenseite | Unterschied **≥ 5 L\***; Nebel folgt (P3 hält in allen 8 Richtungen) |
| P5 | Kulissen lesbar | Silhouettenschichten zwischen Spielfeld und Horizont zählen; L\* je Schicht | **≥ 2** Schichten; Nachbarn **≥ 5 L\*** auseinander; jede ≤ Himmel 1° darüber (am Tag) |
| P6 | Farbiger Horizont | OKLCH am Horizont und im Zenit | Tag: C **≥ 0,05**, Farbtonverschiebung **≥ 20°** |
| P7 | Höhenunabhängig | P1–P3 in allen drei Übersichtshöhen | alle PASS |
| P8 | Überblendung | jedes Bild eines 15-s-Stimmungswechsels | P3 hält in jedem Bild |
| P9 | Himmelanteil | Pixel mit Tiefe = Kuppel | **10–35 %** je fester Kamera (R1-24) |
| P10 | Ruhe | Wolkenmassen in flachem Himmel; Signatur-Fläche | ≤ 2 Massen (R10-22); Signatur ≤ 15 % |
| P11 | Blindtest | 10 Bilder alt/neu gemischt; Georg zeigt auf „Balken“ | im neuen Satz **0** Treffer |

Schnelltest ohne Messwerkzeug: Bild auf 25 % verkleinern und um 90° drehen. Ist ein waagrechter Streifen in einer Farbe zu sehen, ist der Balken noch da [V].

---

## Offene Fragen

- **F1 (= R11 F5 = R4-03):** Ist ein Tiefen- bzw. Höhennebel im einen Rig erlaubt? R13 setzt **Ja** voraus. Bei „nein“ bleiben nur Kulissen (H14) und Bodendunst (H5); der Balken lässt sich so verkleinern, aber in hohen Kameras nicht ganz beseitigen.
- **F2:** Kanon Gebiet 6 sagt „Harmonie über das Material, nie über das Licht“. Gilt die farbige Distanzrampe (H9) als Material der Ferne oder als Licht? Vorschlag: als Material, weil sie aus Zonenrollen gespeist wird.
- **F3:** R10-22 erlaubt in flachem Himmel ≤ 2 Wolkenmassen; H17 hat drei Schichten. Zählt die Horizontbank als Kulisse statt als Wolkenmasse?
- **F4:** Kulissen weltfest (Parallaxe, H14) oder mit der Kamera mitgeführt (wie die Kuppel)? Vorschlag weltfest; in M1/C1-Flughöhen muss dann geprüft werden, ob man sie überfliegt.
- **F5:** Welches surreale Element passt zum KFB-Kanon: Knet-Riesenmond (A), schwebende Kulissen-Inseln (B) oder beides? Und darf A erzählerisch etwas tun (näherkommen)?
- **F6:** Der Horizont „tag“ (`#cfe8f2`) ist fast grau und leicht kalt. Bekommt die Zonenpalette eine eigene Rolle `horizon` (neben `sky`) mit C ≥ 0,05?
- **F7:** Nicht gelesen, aber für eine R2 nützlich: Jane Ng, „Making the World of Firewatch“, GDC 2016 (PDF: https://media.gdcvault.com/gdc2016/Presentations/Ng_Jane_MakingTheWorld.pdf); Nigel Ang, „The Technical Art of Sea of Thieves“, SIGGRAPH 2018 (ACM-PDF); Tanaka/Komada, „3D Toon Rendering in Hi-Fi RUSH“, GDC 2024 (PDF: https://media.gdcvault.com/gdc2024/Slides/GDC+slide+presentations/Tanaka_Kosuke_3D_Toon_Rendering.pdf); Sébastien Hillaire, „A Scalable and Production Ready Sky and Atmosphere Rendering Technique“, EGSR 2020 (PDF). Soll Georg die PDFs selbst beschaffen?
- **F8:** Ohne Textquelle geblieben: BotW-Himmel/Ferne, Genshin-Wolken (GDC 2021 nur als Video), Journey, Townscaper, Klaus, Hanna-Barbera-Himmel (über R10 hinaus), Moebius-Farben. Lohnt eine Video-Auswertung (GDC-Vault/YouTube) in R2?

---

## Quellen

**Gelesen:**
- tinyskies, Repo-Seite und Quelltext: `README.md`, `client/src/game/SkyPresets.ts`, `DayNightCycle.ts`, `Game.ts` (Himmel, Nebel, Renderer), `Globe.ts` (Wolken, Atmosphäre, Geländematerial), `GodRays.ts`, `MoonThreat.ts`, `RainbowArch.ts`, `client/package.json`, GitHub-API (Lizenz, Zweig, Datum). https://github.com/dannylimanseta/tinyskies
- Campo Santo Blog, Firewatch-Himmelsshader. https://blog.camposanto.com/post/112703721804/this-blog-post-is-an-in-detail-explanation-of-part
- Thumbsticks, „GDC 2015: The Art of Firewatch“. https://www.thumbsticks.com/gdc-2015-the-art-of-firewatch/
- PCGamesN, Jane Ng zu Firewatch (GDC 2016). https://www.pcgamesn.com/firewatch/there-was-a-lot-of-copy-pasting-jane-ng-talks-creating-firewatchs-wyoming-wilderness
- Harry Alisavakis, „Firewatch multi-colored fog“. https://halisavakis.com/my-take-on-shaders-firewatch-multi-colored-fog/
- Harry Alisavakis, „Sky shader“. https://halisavakis.com/my-take-on-shaders-sky-shader/
- Kelvin van Hoorn, Unity-Skybox-Tutorial. https://kelvinvanhoorn.com/tutorials/unity_skybox_shader/
- Josephy5/Stylized-Skybox (MIT, nach MinionsArt). https://github.com/Josephy5/Stylized-Skybox
- Inigo Quilez, „Fog“. https://iquilezles.org/articles/fog/
- three.js `Sky.js` und `webgl_shaders_sky.html` (dev-Zweig). https://github.com/mrdoob/three.js
- three.js-Forum, „Matching fog color with the sky shader“. https://discourse.threejs.org/t/matching-fog-color-with-the-sky-shader/52018
- Epic, Sky Atmosphere Component. https://dev.epicgames.com/documentation/en-us/unreal-engine/sky-atmosphere-component-in-unreal-engine
- Rune Skovbo Johansen, „Notes on atmospheric perspective and distant mountains“ (2025). https://blog.runevision.com/2025/06/notes-on-atmospheric-perspective-and.html
- James Gurney: „Atmospheric distance and value“ (2013) http://gurneyjourney.blogspot.com/2013/07/atmospheric-distance-and-value.html · „The Sky's Dual Gradations“ (2011) http://gurneyjourney.blogspot.com/2011/02/skys-dual-gradations.html · „Painting Clouds Over a Sky Gradation“ (2017) http://gurneyjourney.blogspot.com/2017/11/painting-clouds-over-sky-gradation.html · „Painting in the Ghibli Style“ (2018) https://gurneyjourney.blogspot.com/2018/05/painting-in-ghibli-style.html · „Demo by Kazuo Oga“ (2017) http://gurneyjourney.blogspot.com/2017/03/demo-by-kazuo-oga.html
- Animation Obsessive, Kazuo Oga. https://animationobsessive.substack.com/p/what-kazuo-oga-thinks-about-when
- Simon Schreibt, Wind Waker. https://simonschreibt.de/gat/zelda-wind-waker-hyrule-travel-guide/
- maajor/Mesh-Cloud-Rendering (Sea-of-Thieves-Nachbau). https://github.com/maajor/Mesh-Cloud-Rendering
- Game Developer, Ryan Stevenson zu Sea of Thieves (GDC 2018). https://www.gamedeveloper.com/art/video-how-rare-crafted-the-look-and-feel-of-i-sea-of-thieves-i-
- Nintendo, „Ask the Developer Vol. 9, Tears of the Kingdom, Teil 3“. https://www.nintendo.com/us/whatsnew/ask-the-developer-vol-9-the-legend-of-zelda-tears-of-the-kingdom-part-3/
- Thumbsticks, Takizawa zu BotW (GDC 2017), ohne Himmelsdetails. https://www.thumbsticks.com/gdc17-designing-zelda-breath-of-the-wild/
- RedShark News zu Arcane. https://www.redsharknews.com/why-netflixs-arcane-looks-so-good-how-fortiche-ramped-up-the-animation-pipeline
- Sony Pictures Imageworks, *Into the Spider-Verse*. https://www.imageworks.com/our-craft/feature-animation/movies/spider-man-spider-verse
- Cook and Becker, Sable-Interview, ohne Himmelsdetails. https://www.cookandbecker.com/en/article/170/sable-exploration-through-line-art.html
- 80 Level zu Hi-Fi Rush, ohne Himmelsdetails. https://80.lv/articles/the-making-of-hi-fi-rush-s-3d-toon-rendering-style
- Threadreader, adamgryu zu A Short Hike, ohne Himmelsdetails. https://threadreaderapp.com/thread/1113100182655262721.html

**Nur Suchauszug [Q\*]:** The Cutting Room Floor, Wind Waker Unused Models (Seite lieferte statt Inhalt einen Text an KI-Agenten, ignoriert). ACM-Abstract „The technical art of Sea of Thieves“ (https://dl.acm.org/doi/10.1145/3214745.3214820, 403).

**Nicht gelesen (PDF oder gesperrt):** siehe F7; ctrl500 und Boing Boing zu Firewatch (403); ResearchGate (403); TWHL „Seamless Skybox Fog“ (403).

**KFB-intern:** R1, R4, R10, R11, R12; Gelände-Probe `index.html` (Scratchpad `pubsrv/`, Stand 20. 10., 05:14).
