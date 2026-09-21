# SOP — KFB Ink Line / Outline: Fallen, Regeln, Abnahme
### Additiv geführt. Neuer Eintrag oben. Stand v1.0 · 2026-08-25 (WS1, Pet Studio v5)

Dieses Blatt ist die Sammelstelle für alles, was an der **Tusche** und an den **Blasen** bezahlt
wurde. Es ist so geschrieben, dass es in zwei Repo-Dateien nachgezogen werden kann:

- `skills/SSOT_Card_Ink_Outline_v2.md` → **§11 neu** (Kleinformate und Blasen), §5 ergänzt
- `skills/kfb-embed-bundle v3/` → die Regeln als Code-Kommentar am Kanon-Modul und im Embed-Text

**Grundsatz, aus dem alles andere folgt:**
> Eine gezeichnete Linie ist nirgends gleich dick — und ihre Dicke hängt an der **Lage**, nicht an
> der Bedeutung. Wo ringsum dieselbe Breite steht, sieht man kein Comic, sondern einen Termin.

---

## CHANGELOG

### v1.0 — 2026-08-25 (Pet Studio v5, WS1)
Erste Fassung. Enthält 12 Fallen, 7 SOPs und 3 Abnahmeblätter aus dem Blasen-, Boden- und
Tipp-Punkte-Slice. Alle Zahlen gemessen, keine geschätzt.

---

## 1 Die zwölf Fallen

### F1 · Zwei Punkte, die aufeinander liegen, machen aus einer Ecke eine Rundung
`bubble-shapes.json` trug in `rect` an **jeder** Ecke zwei Stützpunkte im Abstand von **0,0296 der
halben Breite** (eine Fase). Die Kantenfasung fast dort ein zweites Mal — Ergebnis: weiche oder
kaputte Ecke, je nach Zoom.
**Regel:** zwei Anfasser näher als `mergePx` (Standard **14 px**) werden zu **einem**, und der neue
Punkt ist eine **Ecke**. Beim Laden *und* beim Ziehen. Ein Kurvenpunkt wäre die Rundung zurück.
**Gemessen:** `rect` 11 → 7 Punkte (4 zusammengelegt), `round` unverändert 11 — dessen Fase ist
~40 px weit, die Regel beißt dort zu Recht nicht.

### F2 · `bevelCorners()` fast jeden Knick über 34°
Nach F1 sind die `rect`-Ecken echte 90°-Knicke — also werden sie gefast und sehen angeschrägt aus.
**Nicht behoben (Georgs Entscheidung 25.8.):** ein Eingriff dort ändert die Feder **aller** Karten
und Interfaces, die den Kanon lesen. Dokumentiert statt riskiert. Wer es angeht, braucht ein
Abnahmeblatt über Karte · Comic · Chip · Blase gleichzeitig.

### F3 · `stroke()` ist keine KFB-Tusche
Ein Canvas- oder SVG-Rand hat ringsum dieselbe Breite. Der Kanon moduliert über die Lage:
**Licht oben links, Linie unten und rechts satter** — `LX 0,62 · LY 0,78 · ORIENT 0,34`.
**Regel:** nie `stroke()`, sondern ein **BAND** zwischen zwei Offsetkurven füllen (`inkRibbon2D`).
Georgs Befund dazu wörtlich: *»das ist deadline, nicht KFB ink«.*

### F4 · Das Band des Kanons deckt kleine Formen zu
Bei einer Scheibe von ~20 px Durchmesser ist die Band-Halbbreite größer als der Radius — die Form
wird schwarz. **Regel:** unter etwa **40 px** die Bandbreite direkt rechnen (dieselbe Lichtformel,
`half = pen/2 × (1 + ORIENT × (nx·LX + ny·LY))`), statt `inkHalfWidth` mit hohem `gain` zu quälen.

### F5 · `alphaMap` liest den GRÜNKANAL, nicht den Alphakanal
Eine schwarze Maske heißt Grün 0 heißt Alpha 0 — das Decal ist unsichtbar, obwohl alles stimmt.
**Regel:** Masken **weiß** rendern, Freistellung über `setClearAlpha(0)`.

### F6 · Farb-Helfer, die nur Hex lesen, geben stillschweigend NaN
`_mix('rgb(250,244,230)', …)` ergibt `rgb(NaN,NaN,NaN)`; die Leinwand behält daraufhin die **letzte**
Farbe — im Zweifel den Schatten. So wurden aus papierfarbenen Tipp-Punkten schwarze Klötze.
**Regel:** ein Farbformat im Modul, an der Grenze konvertieren, nie mischen.

### F7 · Uniforme Catmull-Rom überschießt bei ungleichen Abständen
Einen Punkt einfügen und die Kontur schlägt nach außen aus. **Regel:** zentripetal (alpha 0,5) —
kann per Konstruktion keine Schlaufe bilden. Nicht der Punkt war falsch, sondern die Kurve zwischen
den Punkten.

### F8 · Der Satz sitzt im gemessenen Innenraum, nicht in der Mitte des Rahmens
Ein Zipfel zieht die Rahmenmitte zu sich; der Text stand oben zu weit, unten zu eng.
**Regel:** größtes Rechteck im Satzverhältnis im Innenraum suchen, bei Gleichstand den mittigsten
Ort nehmen. Rand = Tuschebreite + eine Kapitälchenhöhe.

### F9 · Padding ist Geometrie, keine Zahl nach Gefühl
Block × √2 × 1,12; der Schrei rechnet gegen den Innenring 0,84. Wer Padding als Pixelwert setzt,
bekommt bei jeder Schriftgröße ein anderes Bild.

### F10 · Zwei Schreiber auf einer Zahl
Gemessen in dieser Sitzung zweimal: die Schlaf-Animation setzte `rotation.x` absolut und löschte die
Kopfneigung; im Podcast schreibt etwas nach dem Augen-Rig und der Blick steht (0,0026 rad gegen
0,699 rad im Studio, also das 269-fache).
**Regel:** **eine Zahl hat einen Eigentümer, alle anderen ADDIEREN.** Wer absolut schreibt, gewinnt
zufällig — nach Aufrufreihenfolge.

### F11 · Canvas misst still die Ausweichschrift
`document.fonts.ready` genügt nicht: eine nicht angeforderte Webfont ist auch dann nicht geladen.
**Regel:** `await document.fonts.load('<Größe> <Familie>')` für **jede** benutzte Schrift, dann
zeichnen. Sonst sitzt der Satz zweimal falsch — in Größe und Breite.

### F12 · Eine Bühne von 0 px ist keine Bühne
Im versteckten Tab hat die Leinwand keine Größe; die Form fällt auf einen Punkt und F1 legt sie zu
einem einzigen Anfasser zusammen. **Regel:** Form vormerken und beim ersten Bild mit Größe laden.

### F13 · Eine Bewegung folgt einer BAHN, nicht einer Liste von Zeitfenstern
Der erste Chat-Hüpfer war in fünf `if`-Fenster geschnitten (Absprung 0,16 · halten 0,18 · Fall 0,16 …).
Das ergibt an jeder Fenstergrenze einen Knick und ein Stauchen, das nicht zur Geschwindigkeit passt.
**Regel:** die Höhe kommt aus **einer** Wurfparabel (`y = −4·u·(1−u)`), Quetschen und Strecken aus
ihrer **Ableitung** — schnell heißt gestreckt, Umkehrpunkt heißt rund, Aufprall heißt flach. Das
Halten oben entsteht dabei von selbst, weil die Parabel dort ihr Maximum hat.

### F14 · Wer polstert, muss wissen, wer sonst noch polstert
`growToText` rechnete den Kanon-Zuschlag (`Block × √2 × 1,12`) **auf** den Innenabstand, den der
Zeichner ohnehin schon abzieht (`Feder + 0,34 × Schriftgröße`) — Faktor ~1,6 zu viel Luft.
**Regel:** Padding hat **einen** Eigentümer. Autogrow verlangt genau, was der Zeichner verlangt.

### F15 · Zwei Maße für dieselbe Fläche sind eines zu viel
Der Innenraum wurde beim Wachsen im **Rahmen**-Seitenverhältnis gemessen, beim Zeichnen im
**Satz**-Verhältnis. Zwei verschiedene `q` für dieselbe Form — die Blase wuchs gegen eine Zahl, die
niemand benutzt.

### F16 · Eine Lücke ist ein Schnitt in der TUSCHELAGE, nicht im Bild
Drei Anläufe für die gestrichelte Flüsterblase, zwei falsch:
1. `destination-out` direkt in die Leinwand → das **Papier** war mit weg, man sah den Hintergrund
   durch die Blase. Falsch war nicht das Radieren, sondern **wo**.
2. Feder an den Lücken ausdünnen („sie hebt ab") → falsches mentales Modell. **Der Profi setzt nicht
   ab.** Die Kontur ist ein Zug; das Gestrichelte entsteht durch **Wegnehmen**. Ein Strichende hat
   deshalb die **volle** Bandbreite und eine harte Kante.

**Regel:** Tusche in eine eigene Lage, dort schneiden, Lage als Ganzes aufs Papier setzen.

### F17 · Strichmuster in em, Schnitte auf Bogenlänge
Ein Muster in Bildschirmpixeln gibt einer kleinen Blase drei Riesenstriche. Und wer segmentweise
schneidet, bekommt entweder alles oder nichts: das Segment ist `step` lang (26 px), das Muster nur
~15 px. **Regel:** Strich und Lücke in **em** der Stimmengröße (Flüstern 0,46 / 0,40), und den
Schnittpunkt **an der Bogenlänge** auslesen, nicht am Stützpunkt.

### F18 · Die Feder gehört zur SCHRIFT, nicht zur letzten Bühnengröße
Nach dem Autogrow stand `baseW` noch auf dem Wert aus dem Bühnen-Fit (4,6 px für eine doppelt so
große Blase) und wirkte an der geschrumpften Form viel zu dick. **Regel:** bei jeder Änderung von
Stimme oder Text die Federbreite neu aus der Schriftgröße ziehen — es sei denn, jemand hat sie von
Hand gesetzt (`penManual`).

### F19 · `textBaseline='middle'` mittelt die em-Box, nicht die Tusche
Bei ALLCAPS ist die em-Box unten voller Luft (dort wären die Unterlängen) — der Satz sitzt zu hoch.
**Regel:** über `actualBoundingBoxAscent/Descent` die **wirklich gesetzte** Ober- und Unterkante
mitteln. Dazu Luft je Stimme: kursiv braucht seitlich mehr (der Schnitt hängt über), ALLCAPS oben und
unten weniger.

### F24 · Ein Messwert, der vom Ergebnis abhängt, ist keine Messung
Die Bühne fittete die Form gegen die Satzbreite — gemessen am `.v2txt`-Element, das dieselbe
Rechnung danach verschmälert. Kasten schmal → Satz umgebrochen → gemessene Breite kleiner → Kasten
noch schmaler. Der Regelkreis kollabiert, und der Satz läuft **senkrecht** aus der Blase.
**Regel:** Maße, die in eine Layout-Rechnung eingehen, neutral messen — Canvas-`measureText` oder ein
Element mit `nowrap`, das die Rechnung nicht anfasst. Nie am Objekt messen, das man gleich ändert.

### F25 · Zwei Fit-Verhältnisse für dieselbe Form ergeben zwei Größen
Der Shaper fittet gegen den **Satzblock** (breit und flach), die Bühne fittete gegen den
**HTML-Kasten** (120×80, Verhältnis 1,5). `innerBox` sucht das größte Rechteck **in diesem
Verhältnis** — also kam für denselben Satz eine 183 px breite Form heraus, wo der Shaper 163 px
braucht. Die Feder folgt der Schrift, nicht der Form; in der zu großen Form wirkte sie zu dünn.
Gemessen: relative Federstärke **8,7 gegen 14,4** — derselbe Zeichner, zwei Looks.
**Regel:** wer eine Form auf Inhalt fittet, fittet immer gegen dasselbe Verhältnis. (Erweiterung von
F15 auf zwei Aufrufer.)

### F28 · Eine Regel in Bildschirmpixeln gilt nur in einer Größe
Die Mindestabstands-Regel arbeitete mit `mergePx` — einer **absoluten** Pixelzahl. Auf der kleinen
Bühnen-Blase (~100 px) liegen die Zipfel-Punkte näher als 14 px zusammen, also legte die Regel sie
zusammen und **fraß den Zipfel**. Die Blase zeigte auf nichts.
**Regel:** eine Formregel gehört in den **normierten** Raum der Form, nicht in die Bildebene. Dort
ist der Abstand der rect-Fase 0,0296; eine Schwelle von 0,06 legt sie in JEDER Größe zusammen und
lässt den Zipfel stehen. Zusammengelegt wird EINMAL, vor dem Skalieren.

### F29 · Eine Blase misst sich am PET, nicht an einer Pixelzahl
Die Schriftgröße stand fest auf 15 px. Bei nahem Zoom (Kopf 400 px) wirkte die Blase winzig, bei
weitem Zoom zu groß — sie war kein Teil der Komposition, sondern ein Fremdkörper mit fester Größe.
**Regel:** die Letteringhöhe ist ein **Anteil der projizierten Figurenhöhe** (Comic-Konvention
~8,5 %, gedeckelt auf 11–46 px). Gemessen wird die Box des Pets in die Bildebene projiziert; beim
Zoomen viermal je Sekunde nachgemessen und nur bei echter Änderung neu gezeichnet.
Dieselbe Regel wie beim 3D-Maßstab (»die Kachel ist die Maßeinheit«), nur in der Bildebene.
Gemessen: nah 545 px breit, fern 157 px — Verhältnis 3,47, also folgt die Blase dem Pet.

### F39 · Die Blase ist relativ zur KACHEL, nicht zum Tier
Die Schriftgröße hing an der projizierten **Pet-Höhe** — die falsche Bezugsgröße: Pinguin
(`cubeH 0,542`) und Hase (`0,748`) stehen auf derselben Kachel **gleich groß**, hätten aber Blasen
mit einem Drittel Unterschied bekommen (Georgs Entscheidung 25.8.: »normiert auf ground plane / tile«).
**Regel:** gemessen wird die projizierte **Kachel-Kante** am Ort des Pets — dieselbe Maßeinheit, mit
der auch die Bühne skaliert (`scale = tile.edge × fill / cubeH`). Faktor 0,05 der Kachelbreite.
Damit ist die Blase eine Eigenschaft der SPIELFLÄCHE: Flipper-Kachel, Kartenraster und Overworld-Feld
rechnen mit derselben Zahl, statt sie je Zone zu erfinden.
Gemessen: Pinguin und Hase bei Kachelprojektion 500 / 498 px beide **Schrift 24**.

### F40 · Ein Zipfel braucht beide Richtungen
Die Blase weicht dem Gesicht auch nach unten aus — dann zeigte der Zipfel weiter nach unten, also
ins Leere (Georg: »beide Richtungen mitdenken«). `flipY` spiegelt die y-Achse und dreht den
Umlaufsinn mit, damit die Lichtseite (unten/rechts satter) nicht kippt. Umgeschaltet wird mit
Totzone (24 px), sonst kippt er an der Grenze.
Gemessen: Spitze bei 100 % (unten) bzw. 0 % (oben), Form in beiden Fällen 128×51 px.

### F41 · Ein Maß wechselt nie das Koordinatensystem ohne seinen Versatz
`fitted.inner` liegt in LEINWAND-Koordinaten, der Textkasten hängt im ELEMENT — und die Leinwand sitzt
bei `left:-PAD; top:-PAD`. Ohne Abzug saß der Satz um genau **PAD = 26 px** nach rechts unten
verschoben und ragte bei kleiner Schrift 9 px aus der Tusche. Zweite Fundstelle desselben Fehlers
(vgl. F36, die Klemmung).
**Und die Messung log:** der Beleg »Satzversatz −0,4 px« verglich die Satzmitte in Element- gegen die
Tuschemitte in Leinwand-Koordinaten — zwei PAD-Fehler, die sich aufheben und einen Freibrief ergeben.
**Regel:** beide Seiten eines Vergleichs über dasselbe Rechteck holen (`cr.left + bb.x0 - er.left`),
sonst prüft das Blatt sich selbst grün.

### F43 · Ein Satz und seine Blase gehören auf DIESELBE Leinwand
Der Shaper zeichnete den Satz auf die Leinwand, die Bühne setzte ihn als HTML-Kasten daneben — zwei
Systeme mit zwei Versätzen (pts → Leinwand → Element). Drei Anläufe haben ihn um **+26**, **−26** und
wieder daneben gesetzt; eine Messung sagte sogar »Versatz −0,4 px · drin«, während der Satz im Bild
sichtbar neben der Blase stand.
**Regel:** wer zusammen gehört, wird zusammen gezeichnet. Auf derselben Leinwand KANN der Satz nicht
verrutschen — er sitzt in derselben Transformation wie die Linie, die ihn umschliesst. Das erledigt
die ganze Fehlerklasse F36/F41 statt sie an jeder Fundstelle zu reparieren.

### F48 · EDGE CASE (offen, dokumentiert statt gefixt): kein freier Platz bei extremem Zoom
Steht der Kopf größer als etwa zwei Drittel der Bühne, gibt es **keinen** Ort mehr, der weder das
Augenfeld schneidet noch aus dem Bild fällt. Die Regel »kleinste Überdeckung gewinnt« liefert dann
korrekt das kleinste Übel — und das ist ein abgedecktes Auge (belegt: Penguin, Kopf ~1000 px auf
1700 px Bühne, Blase auf dem linken Auge).
**Warum nicht gefixt:** die drei denkbaren Auswege kosten mehr, als sie bringen, und keiner ist eine
Entscheidung, die ich allein treffen sollte:
1. Blase verkleinern — bricht F29 (die Blase mißt sich am Pet) und macht sie unlesbar.
2. Blase teilweise aus dem Bild schieben — bricht die Klemmung (F35) und schneidet Lettering ab.
3. Kamera zurückfahren, wenn gesprochen wird — ein Kamera-Eingriff aus der Blasen-Logik heraus.
   Das wäre ein zweiter Eigentümer für die Kamera (F10) und gehört in die Regie, nicht hierher.
**Regel bis dahin:** ein Zoom, bei dem der Kopf mehr als zwei Drittel der Bühne füllt, ist eine
Detailansicht — dort spricht niemand. Wer dort sprechen lässt, entscheidet sich für das kleinste
Übel. Die Zahl steht im Code (`headFrac > 0.66`), damit die Regie sie abfragen kann.

### F47 · Der Kopfanker ist der SCHEITEL, gesprochen wird im GESICHT
`_headPt()` liefert den oberen Punkt des Kopfes. Zipfelrichtung und Schutzfeld rechneten damit —
und wenn die Blase seitlich auf Augenhöhe liegt, ist der Scheitel zufällig höher als die
Blasenmitte: der Zipfel zeigte nach OBEN, weg vom Gesicht.
**Regel:** beide rechnen gegen die **Gesichtsmitte**, und die liegt bei **38 %** der Pet-Höhe unter
dem Scheitel — am Bild abgezählt (bei 316 px Höhe 120 px darunter), nicht geschätzt. Mit 14 % bzw.
26 % sass das Schutzfeld über den Augen, also durfte die Blase genau dort liegen, wo sie stört.
**Und:** ein Anteil dieser Art wird am Bild abgezählt und als Zahl notiert, nicht dreimal geraten.

### F45 · Eine Quelle für den Kopfort — nicht drei
Zipfelrichtung, Ausweichen und Gesichtsfeld rechneten mit `_bhx`/`_bhy`: blasen-lokale Ankerwerte,
aus denen sich kein Bühnenort ableiten lässt. Gemessen `_by + _bhy = 271`, der Kopf lag bei **y 73**
— nur x stimmte zufällig (462 gegen 459). Folgen: der Zipfel zeigte im Normalfall nach oben ins
Leere, und das Gesichtsfeld wurde **747 statt 316 px** breit, also fand das Ausweichen nie einen
freien Platz.
**Regel:** `_headPt()` projiziert den Kopf EINMAL in Bühnen-Koordinaten; alle drei Rechnungen lesen
ihn. Dieselbe Hausregel wie »eine Zahl hat einen Eigentümer«, hier für einen ORT.

### F46 · Ein Schutzbereich, der zu groß ist, schaltet sich selbst ab
Das Gesichtsfeld war 30 % der Pet-Höhe (179×286 px) — bei nahem Zoom gibt es dann keinen freien Ort,
die Regel »kleinste Überdeckung gewinnt« greift, und die Blase landet mitten im Gesicht. Dazu lagen
die Ausweich-Kandidaten an der **Pet-Box** (bei nahem Zoom weit ausserhalb der Bühne, also geklemmt
und wieder auf den Augen).
**Regel:** geschützt wird die **Augenregion** (16 % der Höhe, flach, auf 26 % unter dem Scheitel —
dort sitzen die Augen, nicht bei 14 %), und die Kandidaten gehen um DIESES Feld herum. Um ein 140 px
breites Feld ist immer Platz, um eine 900 px breite Box nie.
Gemessen: Augenfeld y 72–154, Blase y 167–230, Überdeckung **0**.

### F44 · Wer einen Block verschiebt, nimmt seine Namen nicht mit
Dreimal in einer Sitzung: `hlx`/`hly` (aus `_bubbleShape` in `_bubbleTick`), `font` (doppelt
deklariert), `plain` (aus `_drawBubble` in `_bubbleShape`). Jedes Mal gültiger Code, jedes Mal ein
`ReferenceError` — einmal 804 Würfe im Load-Report, weil er in einem Bild-Tick sass und alles danach
mitriss (Position, Ruhezone, Klemmung, Ausweichen — vier Runden Arbeit unwirksam).
**Regel:** nach jedem Verschieben eines Blocks die Konsole lesen UND die Zielfunktion direkt aufrufen
(`C._bubbleTick()`), den Wurf fangen. Der Syntaxtest findet fehlende Klammern, keine fehlenden
Bindungen. Dritte Wiederholung derselben Lehre (F22, F26, F27).

### F42 · Ausgewichen wird vor der Trägheit, und geschützt wird das GESICHT
Die Blase zielte auf den Kopf und wurde nur am Bildrand geklemmt — wenn oben kein Platz war, saß sie
auf dem Gesicht. Erster Versuch gegen die ganze Pet-Box lief leer: bei nahem Zoom reicht sie von
−140 bis 1045 px, es gibt keinen freien Ort, also fiel jeder Kandidat durch.
**Regel:** geschützt wird ein **Gesichtsfeld** am Kopf-Anker (30 % der Pet-Höhe) — eine Blase darf
über einer Schulter liegen, nur nicht über den Augen. Ausgewichen wird das ZIEL (vor der Trägheit),
damit der Ballon einen ruhigen Punkt anzieht statt gegen eine Wand zu federn. Und wenn nichts frei
wird, gewinnt die **kleinste Überdeckung** statt gar keiner.

### F38 · Der Ballon zieht träge nach — auch in der GRÖSSE
Die Luftballon-an-unsichtbarer-Schnur-Logik lag nur auf der **Position** (Feder-Nachlauf `_bvx/_bvy`).
Die **Größe** hing roh an der projizierten Pet-Höhe — und der Ruhe-Clip hebt den Körper um Bruchteile,
also kippte die Schrift zwischen 25 und 26 px und die Blasenbreite zwischen 111 und 115 px. Jedes
Kippen baut die Blase neu: sie flackerte im Stillstand. Doppelt ärgerlich, weil die Position ruhig
nachzog, während der Durchmesser sprang.
**Regel:** jede Größe, die aus einem laufenden Bild gemessen wird, braucht denselben Nachlauf wie die
Position — Tiefpass (0,12) **und** Stufen (3 px). Dann reagiert sie auf Zoom, nicht auf Atem.
Gemessen über 20 Bilder im Ruhezustand: Schrift **Spanne 0**, Breite **Spanne 0**, Position ±1 px.

### F37 · Eine Spitze braucht keine Tusche
An der Zipfelspitze blieben 30 % Federbreite stehen — also eine stumpfe Tuschekeule statt einer
Spitze (Georg 25.8.: »Pfeilspitze ohne KFB ink, einfach spitz zulaufend«). Die Feder läuft dort jetzt
auf 4 % aus, quadratisch, damit der Auslauf kurz und die Spitze wirklich spitz ist.
**Regel:** die Federmodulation trägt die FLÄCHE, nicht die Spitze. Wo die Form endet, endet die
Feder — sonst wird aus einem Zeigefinger ein Daumen.
Dazu: auf geraden Kanten wirkt die Bauchung **gar nicht** mehr (Faktor 0 statt 0,12) — gerade ist
gerade, es bleibt allein der Federwackler.

### F34 · Eine gerade Kante beult nicht
Die Bauchung `bow` lief als Sinus über den GANZEN Umlauf — also auch über Kanten, die zwischen zwei
Ecken liegen und deshalb Geraden sind. Ergebnis: eine Delle mitten in der Kante (Georg 25.8.: »eine
gerade Linie zwischen zwei Punkten macht so etwas nicht«).
**Regel:** eine gezeichnete Gerade **zittert**, sie **beult nicht**. Auf Segmenten zwischen zwei
Ecken bleibt nur der feine Federwackler (Faktor 0,12), die Bauchung wirkt allein auf Kurvensegmente.

### F35 · Der Fit rechnet, er sucht nicht
`innerBox` suchte das größte Rechteck mit **festem** Seitenverhältnis — damit ist `fx` rechnerisch
immer gleich `fy`, getrennte Faktoren für Breite und Höhe waren wirkungslos. Dazu rutschte die Suche
durch den konkaven Zipfel (gemessen: Innenraum 190 px breit in einer 187 px breiten Form).
**Regel — die Schablone:** der **Körper** der Form (alles ausser dem Zipfel) trägt den Satz. Seine
Kanten sind bekannt, also ist die Größe eine Division, in x und y unabhängig:
`kx = wantW / (Körperbreite × nutzbar)`, `ky = wantH / (Körperhöhe × nutzbar)`.
`nutzbar` kommt aus der Form selbst (Anteil der Punkte auf den Aussenkanten): Rechteck 0,94, Oval
0,89. Gemessen: Innenraum trifft in allen drei Fällen exakt (60×34 · 190×34 · 70×70), Form folgt dem
Satz in **beiden** Richtungen.

### F36 · Wer klemmt, muss den ganzen Weg kennen
Die Randklemmung rechnete mit den Massen des **Satzkastens** (190×34), gezeichnet wird aber die
gefittete **Form** (202×48) — und die Leinwand sitzt zusätzlich `PAD` (26 px) höher als ihr Element.
Zwei vergessene Größen, eine Blase im Header: gemessen −11 px über dem Bühnenrand.
**Regel:** in eine Klemmung geht die Ausdehnung des GEZEICHNETEN plus jeder Versatz auf dem Weg
dorthin. Nachgemessen: 15 px Abstand oben, Blase vollständig im Bild.

### F32 · Der Zipfel GLEITET, er spiegelt nicht
Die Bühne spiegelte die ganze Form, sobald der Kopf die Blasenmitte wechselte — ein Umschalten, das
bei jeder kleinen Bewegung kippt (Georg: »Pfeil springt hin und her«) und den Zipfel nie dazwischen
stehen lässt (»ist nicht zentriert«). Eine Richtung ist eine **stetige** Größe, kein Schalter —
dieselbe Lehre wie »Faktoren statt Schalter« aus den Travel-Fehlerklassen.
**Und: die Lage gehört in den Pixelraum.** Im normierten Raum wächst die Formbreite mit der
Verschiebung mit (der Zipfel ragt seitlich heraus), also zehrt sie ihre eigene Wirkung auf —
gemessen 42,6 % bei `tail 0` statt 50 %, Spanne nur 38–46 %. Im Pixelraum ist die Breite bekannt und
die Lage eine Ansage: gemessen **50 % mittig, 15 % / 85 % an den Enden, 67,5 % bei tail 0,5**.
Auf der Bühne wird der Wert träge geführt (Totzone 0,06, Nachlauf 0,25), damit ein Atemzug ihn nicht
zappeln lässt.

### F33 · Ein Bedienelement, das den Gegenstand verdeckt
Das blaue gestrichelte Anfasser-Polygon lag **genau auf der Kontur** und zerhackte sie optisch: die
Blase im Tab sah unterbrochen aus, obwohl die Feder durchlief — und die Bühnen-Blase wirkte deshalb
wie ein anderer Zeichner. Die Anfasser allein genügen; die Tusche IST die Linie zwischen ihnen.

### F31 · Ein Standardwert im Zustand schlägt die Automatik, die ihn ersetzen sollte
F29 war gebaut, aber **tote Logik**: `_drawBubble` las `b.font || this._bubbleFont()`, und
`v2bubble.font` stand im Anfangszustand fest auf **15**. Der `||`-Vorrang gewinnt immer, also wurde
die gemessene Größe nie benutzt — gemessen: `autoWert 46`, `gezeichnet 15`, Blase in beiden
Zoomstufen 102 px. Der Nachmess-Tick lief und rief neu zu zeichnen, wo derselbe Standardwert wieder
gewann: eine Schleife ohne Wirkung.
**Regel:** wer eine Größe automatisch bestimmt, löscht ihren Standardwert im Zustand (`null`) und
gibt dem Zwang ein **eigenes, sichtbares Feld** (`fontFixed`). Ein Vorrang gegen einen belegten
Standardwert ist kein Vorrang.
Nachgemessen: nah Schrift 46 / Blase 313 px, fern 19 / 129 px — Verhältnis **2,42 auf beiden**.

### Q&A: das MASS aus dem Zeichner lesen, nicht aus Pixel-Hüllkästen
Mein eigener Beleg der Vorrunde (»545 gegen 157 px, Verhältnis 3,47«) war falsch: das Skript nahm den
Hüllkasten aller dunklen Pixel im oberen Bilddrittel — bei nahem Zoom liegt dort die dunkle
Körperkontur des Pinguins. Gemessen wurde das **Pet**, nicht die Blase. Der Beweis sah richtig aus,
während die Blase unverändert 102 px breit blieb.
**Regel:** Maße kommen aus dem Zeichner (`_bubInk.bb`, `_bubFont`, `shaper.info()`), das Bild dient
dem Auge. Ein Hüllkasten über unbekanntem Inhalt ist keine Messung — er ist ein Zufallsfund.

### F30 · Zwei Formeln für denselben Innenabstand
Der Shaper rechnet `Feder + 0,34 × Schrift`, zweimal je Achse. Die Bühne rechnete `Schrift × 1,35`
— also fast keine Luft nach oben und unten: 69×28 px, wo der Shaper bei gleichem Verhältnis 163×61
hält. **Regel:** ein Maß, eine Formel, an einer Stelle. (Dritter Fall derselben Klasse nach F15/F25.)

### F27 · Eine Ausnahme in `renderVals()` tötet den GANZEN Tab, nicht nur ihre Zeile
In `_bankRows` blieb aus einem Copy-Vorgang die Zeile `const font = b.font || 15;` stehen — in dieser
Funktion gibt es kein `b`. Kettenreaktion, gemessen:
1. `renderVals()` spreizt `_chromeVals`, das über die Abschnitts-Map `_bankRows` aufruft → die ganze
   `renderVals()` wirft.
2. Damit bleibt **jeder** Template-Hole leer: `display:;` ist ungültig, der Shaper-Container fällt auf
   `display:block`, das Canvas-Wrapper-Div verliert seine Höhe (`art 390×0`).
3. `loadPreset()` greift in seine Schutzklausel `clientHeight < 50` → `S.pending` bleibt dauerhaft
   gesetzt: 0 Punkte, `pen 4,6` (Startwert), `autogrow: null`.
4. Nur 4 `<button>` im Dokument, Pet-Auswahl 0 Einträge — der Tab ist leer.

**Das sind vier Symptome aus einer nicht deklarierten Variablen.** Genau der Zustand, den der Nutzer
zweimal als »Ladezustand-Bug« und »handles fehlen« gemeldet hat — ich habe zweimal an der Schutzklausel
gesucht statt an der Ausnahme.
**Regel:** wenn ein Tab LEER ist (nicht falsch, sondern leer), ist die erste Frage nie das Layout,
sondern ob `renderVals()` durchläuft. Jede Abschnitts-Funktion einzeln aufrufen und den Wurf fangen:
`try { C._bankRows(C.state, th) } catch(e) { … }`. Der Syntaxtest findet das nicht — es ist gültiger
Code mit einer fehlenden Bindung (vgl. F22, F26).

### F26 · `const` in derselben Funktion, zweimal deklariert — weiße Seite
Ein Fit-Block brauchte `font` vor seiner alten Deklaration, ein Messaufruf brauchte den
Zeichenkontext `g`, der erst danach entsteht (seine Größe hängt vom Fit ab). Beides bricht die
ganze Komponente: `ReferenceError: can't access lexical declaration before initialization`, Seite
weiß. Der Syntaxtest findet es NICHT — es ist gültiger Code mit ungültiger Reihenfolge.
**Regel:** nach jedem Umbau an einer langen Funktion die Konsole lesen. Und Messhilfsmittel
(Kontexte, Puffer) einmal am Objekt anlegen, nicht mitten im Ablauf ausleihen.

### F23 · Die Leinwand muss die FORM fassen, nicht den Satzkasten
Die Blähe-Leinwand war aus `w + 2M` berechnet — den Maßen des **Textes**. Die aus dem Vertrag
gefittete Form ist breiter (gemessen 178,8 gegen 148), also wurden rechts 35 px **abgeschnitten**.
Sichtbar waren zwei Beschwerden aus **einem** Fehler: die Blase glich der `rect`-Vorgabe nicht, und
der Satz sass scheinbar rechts der Mitte. Gemessen sass er bei **−0,4 px** — richtig; nur das BILD
war beschnitten, und die sichtbare Mitte lag deshalb links der echten.
**Regel:** ein Zeichenziel wird aus der Ausdehnung des GEZEICHNETEN bemessen, nie aus der eines
Nachbarn. Und: bevor man eine Lage verschiebt, prüfen, ob sie überhaupt vollständig sichtbar ist.

### Q&A-PFLICHT: Zoom-Ausschnitt mit Messmarken
Der Fehler lag zwei Runden lang offen, weil Vollbild-Screenshots ihn nicht zeigen — bei 924 px
Breite sind 35 px Beschnitt unsichtbar, und die Kante der Figur liest sich wie die Kante der Blase.
**Nach jedem Eingriff an Blase, Tusche oder Satz:** Zoom-Ausschnitt (Faktor 3–4) auf das Objekt,
mit eingezeichneten Marken — grün die Blasenmitte, rot die Satzmitte, blau der Formrand. Die
Abweichung wird als Zahl ins Bild geschrieben. Ein Auge schätzt, eine Marke belegt; und ein
Prueffbild ohne Marken ist ein Screenshot, keine Prüfung.

### F22 · Ein Helfer, der beim Extrahieren mitwandert, nimmt drei Dinge mit
Beim Herauslösen des Bandteils in `paintBubble()` ging der Pfad-Helfer `poly` mit — aber `draw()`
benutzte ihn weiter für die Anfasser. `draw()` brach mit `poly is not defined` ab, und damit fiel
**alles danach** aus: die blauen Anfasser (letzte Zeilen von `draw()`) UND das Wachsen (es steht nach
`fit()`, das intern `draw()` ruft). Drei Symptome — fehlende Anfasser, `autogrow: null`, Fußzeile
»loading shape« — aus **einem** Fehler.
**Regel:** nach jeder Extraktion die Konsole lesen, nicht nur den Parser fragen. Ein Syntaxtest
findet fehlende Klammern, keine fehlenden Bindungen. Und: gemeinsame Helfer gehören ins Modul, nicht
in eine Funktion.

### F21 · Der Schnitt kennt den Zipfel nicht (OFFEN, Georg 25.8.: »braucht Finetuning«)
Die Lücken laufen stur am Bogenmaß entlang — trifft eine Lücke die **Zipfelspitze**, ist die Spitze
weg und die Blase zeigt auf nichts. Dasselbe gilt für die Ecken: eine Lücke genau im Knick nimmt der
Form den Halt. Der Zeichner kennt beide Stellen schon (`tips[]` für die Zipfel, das Ecken-Flag für
die Knicke) — die Schnittschleife fragt sie nur nicht.
**Richtung für den Fix:** eine Schutzzone um Zipfel und Ecken; ein Schnitt, der hineinfiele, wird
verschoben statt weggelassen (sonst entsteht ein Doppelstrich). Nicht »Lücke kleiner machen« — das
ändert das Muster überall.

### F20 · Ein verzögerter Nachruf ruft die INNERE Funktion, nicht die Hülle
Das Wachsen stand in der exportierten Hülle (`loadPreset: (n) => { loadPreset(n); growToText(); }`).
Im versteckten Tab ist die Bühne 0 px, die innere Funktion merkt die Form vor und kehrt früh zurück —
und der Nachruf beim ersten Bild mit Größe ruft **die innere**. Ergebnis: der Tab startete genau mit
den zwei Fehlern, die schon zweimal gemeldet waren (Schrift zu klein, Feder zu dick), obwohl der
Code sie behoben hatte. Jeder Klick auf eine Stimme reparierte es sofort — und verdeckte damit den
Defekt.
**Regel:** eine Wirkung gehört in die Funktion, die den Zustand ändert, nicht in ihre Hülle. Das ist
F10 (»eine Zahl hat einen Eigentümer«) für Verhalten statt für Werte.
**Und:** der Standardzustand ist ein Prüffall. Wer nur prüft, was er gerade angeklickt hat, prüft nie,
was der Nutzer zuerst sieht.

---

## 2 Die sieben SOPs

1. **Eine Feder, eine Lichtrichtung.** `LX 0,62 · LY 0,78 · ORIENT 0,34` gelten in Karte, Comic,
   Chip, Blase, Tipp-Punkt und Bodenschatten identisch. Zwei Lichtrichtungen sind zwei Sonnen.
2. **Der Saum sitzt unten rechts**, immer, mit demselben Verhältnis zur Federbreite. Auch der
   Bodenschatten folgt ihm (Versatz vorne/rechts).
3. **Der Vertrag trägt Punkte, nicht Namen.** `voice.bubble.pts` statt `"rect"` — ein Name ist eine
   Bitte, Punkte sind eine Ansage. An genau dieser Naht sind drei Fassungen von `pet-mouth.v1.js`
   entstanden.
4. **Die Form besitzt die Silhouette, die Feder besitzt die Linie.** Ein Federwechsel ändert Breite
   und Textur, nie die Silhouette. Punkte tragen `struct`, Formen tragen `deform`.
5. **Ein Ausdünnen wird gemeldet, nicht übernommen.** Beim Vereinigen zweier Stände gewinnt der
   reichere Feld für Feld; `leafCounts` ist die Gegenprobe (v1.2.6 hatte höhere Version und drei
   ärmere Pets).
6. **Messen statt behaupten**, und die Zahl in den Changelog. Kein „sieht besser aus" ohne Zahl.
7. **Über den echten Bedienweg testen**, nicht über die API. Ein Slice kann über `start()` grün und
   über den Schalter tot sein.
8. **Die Blase wächst am Satz, nicht der Satz in die Blase.** Der Text steht in seiner Sollgröße, die
   Form folgt: `Rahmen = (Satzblock + 2 × Innenabstand) / q`, mit `q = Innenraum/Rahmen` je Form.
9. **Bewegung aus einer Bahn**, Verformung aus ihrer Ableitung. Kein Abspulen von Zeitfenstern.
10. **Die Oberfläche ist strikt EN**, Kommentare und Dokumente deutsch. Kein Mischen — Eigennamen
    (BLÖDSINN!, Puste, Witz, Schneid) ausgenommen.

---

## 3 Abnahmeblätter

### 3.1 Blase
- [ ] `rect` hat nach dem Laden **7** Punkte, alle Ecken sind Knicke, keine Rundung an den Ecken.
- [ ] Ein Punkt eingefügt → die Kontur schlägt **nicht** nach außen aus.
- [ ] Zwei Anfasser aufeinandergezogen → **ein** Punkt, als Ecke, Meldung im Fuß.
- [ ] Federbreite folgt der Schriftgröße; unten/rechts messbar satter als oben/links.
- [ ] Satz sitzt im Innenraum, Rand ≥ Tuschebreite + Kapitälchenhöhe, auch mit Zipfel.
- [ ] Schrift geladen, bevor gezeichnet wird (kein Serifen-Fallback).
- [ ] Autogrow: derselbe Satz in zwei Längen → gleiche Schriftgröße, gleiche Luft, nur mehr Breite.
- [ ] Federbreite nach Stimmenwechsel neu gezogen (nicht der Wert der vorigen Blase).
- [ ] ALLCAPS sitzt senkrecht mittig; kursiv hat seitlich mehr Luft.
- [ ] **Zipfel-Lage:** `tail 0` → 50 % der Breite, `±1` → 15 % / 85 %; auf der Bühne ruhig
      (kein Springen bei kleinen Kopfbewegungen).
- [ ] **Zipfel vorhanden** — in kleiner UND großer Form (Regel im normierten Raum, nicht in Pixeln).
- [ ] **Zipfel zeigt zum Kopf:** Vorzeichen von (Kopf-y − Blasenmitte-y) gegen `_flipY` prüfen, in
      beiden Lagen. Und: Augenfeld gegen Blasenrechteck — Überdeckung 0.
- [ ] **Jeden Bild-Tick direkt aufrufen** (`_bubbleTick`, `_bubbleShape`, `_drawBubble`) und den Wurf
      fangen — ein Fehler im Tick ist unsichtbar, bis nichts mehr folgt.
- [ ] **Zwei Pets, eine Kachel:** Pinguin und Hase müssen dieselbe Schriftgröße bekommen.
- [ ] **Beide Seiten im SELBEN Koordinatensystem messen** — Tusche über `_bubCv`-Rect, Satz über
      dasselbe Rect, nie eines in Element- und eines in Leinwand-Koordinaten.
- [ ] **Ruhezustand:** 20 Bilder ohne Eingriff — Schrift, Breite und Position dürfen sich NICHT ändern
      (Spanne 0). Ein Atemzug ist keine Zoomänderung.
- [ ] **Blase folgt dem Pet:** zweimal zoomen, `_bubInk.bb`-Breite und `_bubFont` im selben
      Verhältnis — aus dem Zeichner gelesen, nicht aus einem Pixel-Hüllkasten.
- [ ] Flüstern: Papier durchgehend (keine Löcher), Strichenden hart und in voller Breite.
- [ ] **Tab frisch geladen, nichts angeklickt:** jede Abschnitts-Funktion läuft (`_shaperRows`,
      `_bankRows`, `_bodyRows`, `_groundRows` — einzeln aufrufen, Wurf fangen), Canvas-Höhe > 0,
      `S.S.pts` = 7, `pen` ≈ 2,3.
- [ ] Früher geprüft: `autogrow` ist gesetzt, Feder aus der Schriftgröße
      (nicht der Bühnen-Fit-Wert). Gemessen: Feder 2,3 px, Rahmen 163 px — nicht 4,6 px / 563 px.

### 3.2 Tipp-Punkte
- [ ] Füllung ist **Papier** (max. ein Hauch Pet-Grundfarbe), **kein** Vollton, **kein** Schwarz.
- [ ] Linie unten/rechts satter — kein gleichmäßiger Ring.
- [ ] Saum unten rechts vorhanden.
- [ ] Bewegung: Absprung, kurzes Halten oben, Landung mit Quetschen; Versatz je Punkt.
- [ ] Nur sichtbar, wenn **keine** Blase offen ist (Fokus-Regel `voice.focus.mode = 'one'`).

### 3.3 Bodenschatten (aus demselben Kanon)
- [ ] Stempel der **echten Form**, auf dem Boden, nicht auf einer Rückwand.
- [ ] Versatz vorne/rechts wie der Saum.
- [ ] Hüpfen: Stempel wird weicher und größer, verschwindet nicht, wird nicht beschnitten.
- [ ] Gekippte Platte: Stempel liegt auf der Fläche, Höhe ist der Abstand **zur Platte**.
- [ ] Sohle liegt auf der Platte, jedes Bild (Fußanker als letzter Schreiber).

---

## 4 Was in die Repo-Dateien nachgezogen werden muss

### `skills/SSOT_Card_Ink_Outline_v2.md`
- **§11 neu — Kleinformate und Blasen:** F3, F4 (die 40-px-Grenze mit der direkten Bandformel),
  F1/F2 (Mindestabstand und der offene Fasen-Befund), plus die Blasen-Kennzahlen
  (`hb 0,0110` zwischen Karte 0,0069 und Figur 0,0155 · `taper 0,50` · `edge 1,70` · `step 26`).
- **§5 ergänzen:** `LX/LY/ORIENT` explizit als Kanon benennen — sie stehen heute nur im Code.
- **§9/§10 querverweisen** auf F10 (ein Eigentümer je Zahl).

### `skills/kfb-embed-bundle v3/`
- Die Regeln F1, F3, F4, F5, F11 als Kommentarblock an der Stelle, wo das Bundle Tusche zeichnet.
- Den Vertragsblock `voice.bubble` (mit `pts`) und `voice.typing` in den Embed-Text aufnehmen —
  sonst muss jede Zone die Blase erraten.
- Den Verweis auf dieses Blatt, damit die Sammelstelle **eine** bleibt.
