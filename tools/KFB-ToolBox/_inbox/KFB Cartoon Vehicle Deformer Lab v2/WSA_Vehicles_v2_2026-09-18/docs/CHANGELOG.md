# CHANGELOG · KFB Animation Lab

**Additiv.** Neue Einträge kommen oben dazu. Nichts wird überschrieben, nichts gelöscht.
Ein überholter Eintrag bekommt `NACHTRAG` und bleibt stehen — wer nur den aktuellen Stand
sieht, kann nicht erkennen, welche Wege schon verworfen wurden, und geht sie wieder.

Stand-Dokumente: `LIVING_RIGGING.md` (Carl/Gesicht), `LIVING_VEHICLES.md` (Fahrzeuge).
Dieser Changelog ist die Zeitachse, die Stand-Dokumente sind die Begründung.

---

## 2026-09-18 · Fehlende Fahrzeuge aufgenommen, Oberflaeche auf Atlas-Schnitt · `fixture-adapters.v3.js`, `KFB Cartoon Vehicle Deformer Lab v2.dc.html`

**Gemessen zuerst:** Georgs neuer Asset-Handoff (`kfb.asset-handoff.v1`, consumer `animation-lab`,
sourceCommit `29aac1061bdd`, 141 Assets) gegen `fixture-adapters.v2.js` gerechnet — **112 Assets
waren nicht referenziert.** Davon sind rund zwanzig Fahrzeuge; der Rest sind Figuren, Planeten,
Zahlen, Zaeune, Pickups und einzelne RAEDER (`wheel-*.glb`) — Bauteile, keine Fahrzeuge.

**Fuenfzehn Bodenfixtures dazu, 46 → 61.** Driver Car (Georgs Beispiel), Tractor by Poly, KFB
Tourbus/WaterBowser, Truck Armored, Rover 1/2/Round, vier Rollstuehle plus Kenney-Rollstuhl, drei
Schubkarren. `v3` importiert `v2` und haengt an — die alte Liste bleibt unberuehrt, jede neue
Zeile ist AUS dem Handoff generiert, nicht getippt.

**Alle vierzehn neu im Browser geladen und vermessen** (nicht nur deklariert):

| Fixture | Raeder | Radradius | Spur | Radstand |
|---|---|---|---|---|
| driver-car | 4 (node) | 0,395 | 2,088 | 3,094 |
| kfb-tourbus | 4 (island) | 0,375 | 4,190 | 6,984 |
| rover-1 | 4 (node) | 0,683 | 3,592 | 3,793 |
| tractor-poly | **2 (island)** | 1,936 | 5,241 | 0,000 |
| truck-armored | **2 (node)** | 0,439 | 1,879 | 0,000 |
| rover-round | **1 (island)** | 1,071 | 3,169 | 0,000 |
| wheelchair | 2 (island) | 0,145 | 0,450 | 0,000 |
| wheelchair-kenney · Schubkarren ×3 | **0 (none)** | — | — | — |

Die Nullen und Zweien sind **Befunde, keine Fehler**: die Rad-Paar-Regel (V9) verlangt ein
Gegenstueck auf derselben Hoehe mit gleichem Radius (±25 %) und gleicher Groesse (±35 % um den
Median). Ein Traktor hat vorn kleine und hinten grosse Raeder, eine Schubkarre hat genau eins,
ein Rollstuhl hat zwei grosse und zwei kleine. Erfunden wird nichts.
**NEU OFFEN:** `rover-round` meldet **1** Rad. Eine Eins verletzt die Paar-Regel und ist damit
ein Verdacht auf eine Luecke im Insel-Weg, nicht ein Messwert. Braucht eine Sichtpruefung.

**Zehn Flug-Fixtures deklariert, kein Deformer.** `FLIGHT_GROUPS` in v3: Airplane A/B, Low poly
Fighter, Paper Plane, Spaceship A/B, die vier Charakter-Schiffe. Alle geladen, alle **0 Raeder** —
genau darum haengt der Flug-Tab beim Laden keine Bodenfamilie an. Plan: `PLAN_flight_deformer.md`.
Der Papierflieger steht nicht im Handoff; sein Pfad wurde byteweise geprueft (3216 B @ 29aac106).

**Oberflaeche v2 im Schnitt des Resident Atlas S6** (`tools/resident_atlas_s6/KFB_Resident_Atlas_S6.html`
gelesen, Palette und Raster uebernommen): warm-dunkle Buehne statt weisser DocCheck-Rahmen, ein
Auswahlfeld fuer die Fixture und eines fuer die Bewegung im Kopf statt vierzig Knoepfen unter der
Buehne, Zeitleiste im Dock, 380-px-Leiste rechts, QA-Marke oben links, Live-Telemetrie oben rechts.
Georgs Grund dafuer: **cleanere Views mit Fokus auf die Modelle.** v1 bleibt unveraendert liegen.

**Das Spulen rechnet neu, statt rueckwaerts zu laufen.** Springs haben ein Gedaechtnis; eine
Sequenz laeuft beim Scrubben von null in 1/60-Schritten bis zur Zielzeit. Dieselbe Zeit liefert
damit dasselbe Bild (V8) — und der Regler haelt die Fixture an, statt sie weiterlaufen zu lassen.

---

## 2026-09-18 · Motion-Familie »Fassrolle« · `lab-v7/vehicle-tumble.v1.js`

Der Read: **das Fahrzeug überschlägt sich seitlich und fängt sich auf den Rädern wieder.** Der
ganze Witz liegt im letzten Teil. Eine Fassrolle, die auf dem Dach endet, ist ein Unfall und ein
anderer Read.

**Darum wird die Umdrehungszahl gerundet und die Drehrate danach nachgerechnet, nicht umgekehrt.**
Flugzeit aus Stärke und Profil, gewollte Rate aus dem Tempo, dann `turns = round(Flugzeit × Rate)`
und `rate = turns / Flugzeit`. Damit landet das Fahrzeug bei jedem Tempo exakt auf 360° × n.
Gemessen an car_hatchback:

| Stärke | Tempo | Flugzeit | Rate gewollt | Rate gerundet | Umdrehungen | Gipfel |
|---|---|---|---|---|---|---|
| 0,2 | 0,2 | 490 ms | 0,84 Hz | 2,04 Hz | 1 | 0,132 u |
| 0,55 | 0,6 | 735 ms | 1,42 Hz | 1,36 Hz | 1 | 0,194 u |
| 1,0 | 1,0 | 1050 ms | 2,00 Hz | 1,91 Hz | **2** | 0,274 u |
| 1,0 | 0,2 | 1050 ms | 0,84 Hz | 0,95 Hz | 1 | 0,274 u |
| 0,2 | 1,0 | 490 ms | 2,00 Hz | 2,04 Hz | 1 | 0,132 u |

Die Zahl springt stufig, nicht stetig — richtig so: eine halbe Umdrehung mehr ist sichtbar, eine
Zehntel nicht. Endwinkel gemessen 719,8° gegen Soll 720° (Restbetrag aus dem Abtastpunkt 2 ms vor
Schluss), Gipfel gemessen 0,2741 u gegen geplant 0,2741 u.

**Die Drehachse wandert, und das ist der Unterschied zum Späß.** Absprung auf der Aufstandslinie
(am Boden kippt ein Fahrzeug über seine Kante), Flug um den gemessenen Schwerpunkt (ein freier
Körper dreht um seinen Schwerpunkt — alles andere sieht nach Puppenspiel aus), Landung zurück auf
die Kante, damit die Räder zuerst kommen. Anteile 0,16 der Flugzeit hinein, 0,14 heraus.

**Drei Beats, nacheinander:** Überschlag (Hauptread) → Aufsetzen mit einem Lautwort und EINEM
Nachfedern (Akzent) → Schlingern (Erholung). Die Fassrolle LÖST das Schlingern aus und besitzt es
nicht: sie meldet `event: 'recover'`, der Aufrufer gibt es weiter. Ebenso `event: 'touchdown'` mit
der Stärke aus der Fallgeschwindigkeit — die Vertikalstauchung gehört dem Deformer, eine Feder,
nicht zwei.

**Lautwort und Ton**, erstmals über null im Ereignisbudget: EIN Lautwort (»WUMM«, unter Stärke 0,5
»WUPP«) und es sitzt auf dem Aufsetzen, nicht auf dem Absprung — der Einschlag ist der laute
Moment. Zwei Töne, beide synthetisiert statt geladen: aufsteigender Whoosh beim Absprung,
Rauschstoß plus tiefer Puls beim Aufsetzen. **Aus Vorgabe stumm**, Schalter in der Kopfzeile —
Ton, der ungefragt losgeht, ist ein Fehler. VFX bleibt bei null, bis der Rauch-Pack angebunden ist.

**Derselbe Vorzeichenfehler, zweimal in einer Stunde.** Der Gegenroll der Anticipation drehte um
die Radkante der falschen Seite und zog deren Räder 0,0432 u unter den Boden — exakt die
Vorhersage 2 × contactX × sin 6°. Erst beim Übernehmen des Musters aus `vehicle-twowheel.v1.js`
mitgekommen, dann beim Beheben nur für EINE Drehrichtung behoben, weil der Fix die Seite statt den
WINKEL befragte (in dieser Datei steckt `side` schon im Winkel). Jetzt entscheidet allein das
Vorzeichen des Winkels. Nachgemessen im 10-ms-Raster über den ganzen Verlauf, fünf Kombinationen
aus Stärke, Tempo und Drehrichtung: **tiefste Radunterkante exakt 0,0000**, Endwinkel exakt
±n × 360°. Lehre: ein Vorzeichen, das an zwei Stellen gebraucht wird, wird EINMAL abgeleitet.

Belege: `screenshots/0*-tumble.png` (Absprung, Vierteldrehung in der Luft, Gipfel — dort steht der
Wagen bei zwei Umdrehungen genau wieder aufrecht — und Landung).

**NACHTRAG (18.09., aus der Abnahme).** Die Fassrolle war nur an car_hatchback gemessen, das
Modul ist aber für alle 46 Fixtures verdrahtet. An anderen Fahrzeugen zog sie die Räder unter den
Boden: `race` (Spur 1,0 u) −0,0422 u mitten im Flug, `vehicle-monster-truck` −0,0284 u im Frame
VOR dem Aufsetzen. Ursache war kein Vorzeichen, sondern ein Verhältnis: der Hub war eine reine
Wurfparabel, während die Drehachse beim Abheben und Aufsetzen wandert — der Hub ist dort noch
klein, der Drehradius aber schon voll wirksam. Bei breiter Spur reicht die Parabel dann nicht, um
den eigenen Drehradius freizuräumen.

Behoben in zwei Schritten, und beide machen nebenbei den richtigen Read:
- **Der Boden ist eine Untergrenze unter der Parabel.** Je Frame wird der tiefste Punkt der
  gedrehten Hülle um die aktuelle Achse analytisch bestimmt und `h = max(Parabel, nötiger Hub)`
  gesetzt. Die Hülle ist Karosserie VEREINT mit Radspur — die Karosserie kann schmaler sein als
  die Räder (Monster-Truck) und umgekehrt.
- **Die Gipfelhöhe hat eine gemessene Untergrenze:** der weiteste Punkt der Hülle vom Schwerpunkt
  minus die Schwerpunkthöhe. Darunter kann sich ein Fahrzeug überhaupt nicht frei überschlagen.
  Ein breiter Wagen MUSS höher springen. Gemessen: `race` 0,356 u Untergrenze, `truck` 0,318 u,
  car_hatchback nur 0,090 u.

Dazu ein dritter Befund aus derselben Messreihe: **`vehicle-drag-racer` hat vorn schmale und
hinten breite Räder**, und `contactX` rechnete mit Spurweite plus der Breite des ERSTEN Rades —
der Drehpunkt fiel 1,6 mm zu weit innen aus. Jetzt wird die äußerste Laufflaechenkante über ALLE
Räder gemessen (`max(|x| + Breite/2)`). Derselbe Denkfehler stand in `vehicle-twowheel.v1.js` und
ist dort mitkorrigiert; contactX des Drag-Racers 0,2781 → 0,2938 u.

Außerdem: der Absprungton wurde in `trigger()` in den Readout geschrieben, und `update()` löschte
ihn in seiner ersten Zeile — von zwei deklarierten Audio-Cues kam nur einer heraus. In der
Werkbank war das unsichtbar, weil die Ereignisverteilung den Ton direkt anstößt; eine Laufzeit,
die das Modul allein über seinen Readout fährt, hätte ihn verloren. Jetzt gepuffert.

Nachgemessen im 5-ms-Raster über den ganzen Verlauf, **sechs Fahrzeuge** (car-hatchback,
monster-truck, race, drag-racer, truck, kart-oobi) × vier Kombinationen aus Stärke, Tempo und
Drehrichtung, Fassrolle UND Zwei-Rad: tiefste Radunterkante **exakt 0,0000**, Endwinkel exakt
±n × 360°. Lehre, die über diese Familie hinausgeht: **eine Abnahme an einem Fahrzeug ist keine
Abnahme.** Die Ableitung ist fahrzeugunabhängig, die Zahlen sind es nicht — und genau an den
Verhältnissen (breite Spur gegen kleinen Hub) bricht sie.

**ZWEITER NACHTRAG (18.09., aus der Abnahme).** Die Landestärke war ein FESTWERT, obwohl der
Kommentar im Modul das Gegenteil behauptete. Gemessen lag `strength` in 16 von 16 Fällen auf
exakt 0,35 — also auf ihrer eigenen Untergrenze, über alle Stärken und alle Fahrzeuge. Ein
flacher und ein dreifacher Überschlag setzten sichtbar gleich auf; der Akzent-Beat war tot.

Zwei Ursachen, und die zweite ist die interessante:
- *Der Nenner war etwa dreimal zu groß*, das rohe Verhältnis lag durchweg unter der Untergrenze.
- *Die Größe selbst war degeneriert.* Gipfel UND Flugzeit standen unabhängig an der Stärke, und
  beide wuchsen fast gleich schnell (×2,08 gegen ×2,14). In der Aufsetzgeschwindigkeit
  4·Gipfel/Flugzeit kürzte sich das weg — gemessen 1,074 → 1,044, also FALLEND bei steigender
  Stärke. Die Bahn war auch keine Wurfparabel: dort gilt Gipfel = g·t²/8 und damit t ∝ √Gipfel;
  hier war t ∝ Gipfel, die wirksame Schwerkraft sank mit der Stärke.

Behoben: **eine Schwerkraftkonstante je Fahrzeug**, verankert am Bezugspunkt Stärke 1 (dort bleibt
die Flugzeit, wie sie war). Daraus folgt alles andere ballistisch — Flugzeit 2·√(2·Gipfel/g),
Aufsetzgeschwindigkeit √(2·g·Gipfel) — und die Stärke wird zwischen Stärke 0 und Stärke 1
DESSELBEN Fahrzeugs gespannt, damit der Bereich 0–1 wirklich ausfährt.

Gemessen, vier Stärken × sechs Fahrzeuge, Plan und echter Lauf identisch:

| Fahrzeug | g | Flugzeit 0,2 → 1,0 | Stärke 0,2 / 0,5 / 0,8 / 1,0 |
|---|---|---|---|
| car-hatchback | 1,99 | 727 → 1050 ms | 0,248 / 0,563 / 0,835 / 1,000 |
| kart-oobi | 3,52 | 727 → 1050 ms | 0,248 / 0,563 / 0,835 / 1,000 |
| firetruck | 3,36 | 1149 → 1658 ms | 0,248 / 0,563 / 0,835 / 1,000 |
| monster-truck | 0,87 | 1149 → 1658 ms | 0,248 / 0,563 / 0,835 / 1,000 |
| race | 6,32 | 727 → 1050 ms | 0,150 / 0,488 / 0,807 / 1,000 |
| raceCarRed | 3,32 | 727 → 1050 ms | 0,150 / 0,455 / 0,795 / 1,000 |

Bei `race` und `raceCarRed` bindet die Gipfel-Untergrenze schon bei Stärke 0,2 — dort fängt die
Stärke auf 0,15 an, statt weiter zu fallen. Das ist richtig: ein Fahrzeug, das seinen Drehradius
freiräumen muss, kann nicht flacher springen. Bodenkontakt in allen Läufen weiter exakt 0,0000.

Dass `g` je Fahrzeug verschieden ist (0,87 bis 6,32), ist Absicht und keine Physik: der
Bezugspunkt ist die gewollte Flugzeit bei Stärke 1, und die hängt am Profil, nicht am Gramm.
Innerhalb eines Fahrzeugs ist die Bahn dann durchgängig ballistisch — das ist, was man sieht.

## 2026-09-18 · Zwei Motion-Familien · »Manöver« und »Zwei-Rad-Schräglage«

Georgs Nachtrag: Rückwärtsfahren, Wenden und Einparken für die drei Ride-Modes, dazu die
seitlich gekippte Stunt-Fahrt an einer Bande. Zwei neue Dateien, `lab-v7/vehicle-manoeuvre.v1.js`
und `lab-v7/vehicle-twowheel.v1.js`. Die Fassrolle bleibt der nächste Schnitt.

**Schichtung.** Von innen nach außen: Deformer (Pose) → Schlingern (Gier um die Vorderachse) →
Zwei-Rad (Kippen um die Aufstandslinie) → Manöver (Weg über den Boden). Jede Schicht besitzt
genau eine Gruppe. Deshalb kann das Fahrzeug an der Bande entlangFAHREN und dabei gekippt stehen,
ohne dass eine der beiden Bewegungen von der anderen weiß.

**Das Manöver erfindet keine Deformation.** Es erzeugt die Signale, die der Deformer schon frisst
(`speed`, `longAccel`, `lateral`) — aus einem kinematischen Einspurmodell auf dem GEMESSENEN
Radstand, Drehpunkt gemessene Hinterachse. `longAccel` wird DIFFERENZIERT statt geschrieben, und
darum taucht die Nase beim Anfahren im Rückwärtsgang nach vorn: die Trägheit weiß nichts vom Gang.
Beide Signale werden auf ihr Maximum im Plan normiert; kein gesetzter Faktor.

**Wie viele Züge eine Wende braucht, wird ausgerechnet.** Der Löser fährt bei Vollausschlag, bis
eine gemessene Fahrzeugecke aus der Gasse läuft, wechselt Gang UND Einschlag und zählt weiter.
Gemessen an car_hatchback (Radstand 0,502 u, R 0,744 u, Länge 0,806 u):

| Gasse × Länge | Züge |
|---|---|
| ≤ 1,25 | erreicht 180° gar nicht (77–117° bei sieben Zügen) |
| 1,30–1,35 | 7 |
| 1,40–1,50 | 5 |
| 1,55 | 4 |
| **1,60–2,00** | **3** |
| ≥ 2,05 | 2 — dann ist es keine Wende, sondern eine Kehre |

Vorgabe jetzt 1,60, der schmalste Wert mit Drei-Punkt-Read. Eine reale Wohnstraße liegt bei 1,33;
dort braucht ein echtes Auto tatsächlich fünf bis sieben Züge, und genau das gibt der Löser aus.

**Einparken ist exakt gelöst, nicht geraten.** Zwei gleich große Bögen versetzen das Fahrzeug um
2R(1 − cos θ) und geben ihm den Kurs zurück, also θ = arccos(1 − d/2R) = **51,71°** für 0,5656 u
Seitenversatz. Nachgefahren kamen **0,5752 u** heraus (1,7 % über Soll, aus dem
Integrationsschritt), Endgierwinkel exakt 0,00°, benötigte Lücke 1,981 u.

**Vier Fehler auf dem Weg, alle gemessen gefunden:**
- *Die Wende fing in der Gassenmitte an.* Sieben Züge, und nach 74,7° war Schluss. Ein Fahrer
  fährt vor dem Wenden an den Rand — damit verdoppelt sich der Weg quer. Die Gasse liegt jetzt
  asymmetrisch an der Flanke, kein Sprung im Bild, drei Züge.
- *Das Manövertempo war zu träge.* 0,55 Fahrzeuglängen je Sekunde ergaben 6,4 s für ein
  Rückwärtsstück von 1,8 u. Jetzt 0,95 — Rückwärts 3,05 s, Wenden 5,10 s, Einparken 5,46 s.
- *Die Lenkung sprang beim Einparken in einem Frame von −34° auf +34°.* 68° auf einen Schlag, und
  das sieht man. Jetzt liegt eine kurze Standzeit zwischen den Bögen, in der der Fahrer im Stand
  umdreht — die einzige Art, wie das überhaupt geht.
- *Das Bild schnitt die Wende ab.* Der Kameraabstand kam aus Radius × 2,3. Das Blickfeld ist
  VERTIKAL 30°, und die 2,05 u Weglaenge fallen genau auf diese Achse (sichtbare Höhe bei 3,46 u
  Abstand: 1,85 u). Jetzt r / sin(fov/2) aus der Umkugel der überstrichenen Fläche.

**Zwei-Rad: der Kippwinkel ist gerechnet, nicht gesetzt.** φ_tip = atan(Hebel / Schwerpunkthöhe),
Schwerpunkt als gemessener Mittelpunkt der Karosseriehülle (0,1999 u — geometrisch, nicht
Massenschwerpunkt, und so steht es im Bericht). Daraus **45,94°**. Frei gehalten wird bei 0,92
davon (**42,27°**), an der Bande darüber (**65,77°**), weil die Wand trägt; die nötige
Wandentfernung wird an der gedrehten Karosseriehülle gemessen (**0,3375 u**) und die Bande genau
dort gezeichnet. Die Haltephase ist der Kern der Bewegung: zwei nicht ganzzahlig verwandte
Balanceraten, damit es nicht als Schleife liest.

**Der Fehler, der zweimal in denselben Irrtum lief — `frame.contactY`.**
`carrig` MISST `contactY` VOR dem Einbacken und verschiebt danach die ganze Geometrie um
−contactY. Im Rig-Raum liegt der Boden also auf genau 0, und `frame.contactY` ist der alte
Modellwert (bei car_hatchback −0,15 u) — während `frame.height` im SELBEN Objekt nach dem Backen
steht. Beide Kipp-Familien nahmen `contactY` als Höhe der Drehachse:
- Zwei-Rad kippte um eine Achse unter dem Asphalt; gemessen sanken die unteren Räder 0,031 u
  (frei) und 0,059 u (Bande) in den Boden.
- Schlingern hatte denselben Fehler, nur unsichtbar: der Gegenroll geht bis 1,3°, und
  0,15 × (1 − cos 1,3°) sind 4 × 10⁻⁵ u. Nach der Korrektur wurde die Messreihe gegengeprüft und
  ist zeichengleich (−4,73 / +2,28 / −1,10 / +0,53) — der Gierwinkel hängt nicht an der Höhe des
  Drehpunkts.

**Und der Rest der Senkung war eine Rechnung, keine Toleranz.** Nach der Korrektur auf y = 0 blieb
−0,0186 u bei 37,3° und −0,027 u bei 62,1°. Beide ergeben −sinφ × (Radbreite/2) und damit zweimal
unabhängig **0,061 u Radbreite** — nachgemessen am Rig: **0,0612 u**. Ein gerolltes Rad steht auf
seiner KANTE, nicht auf seiner Mittelebene. Kippachse jetzt (Spurweite + Radbreite)/2, und damit
ist auch der Hebel gegen das Umfallen größer als die halbe Spurweite. **Bodenkontakt seitdem
exakt 0,0000 in allen vier Phasen** (peak, settled, holdMid, touchdown), beide Varianten.

**Drei Fahrweisen**, ausdrücklich Gestaltung und keine Messung: chill / city / freeroam mit
Tempo ×0,62 / ×1,00 / ×1,38 und Standzeit beim Gangwechsel 430 / 260 / 145 ms. Die Standzeit
unterscheidet sie deutlicher als das Tempo. Ein Wechsel mitten im Manöver lässt die Geometrie
stehen und skaliert nur die restliche Zeit.

**Zwei Werkzeugbefunde, die Zeit gekostet haben und bleiben:**
- *Der Zwischenspeicher.* Nach einem Reload meldete der Plan weiter die alte Gassenkonstante 1,45
  statt 1,60 — genau die Falle aus `CLAUDE.md`. Die beiden neuen Module werden jetzt mit
  Abrufstempel importiert (`?r=N`), der bei jeder inhaltlichen Änderung hochgezählt wird.
- *`requestAnimationFrame` steht in einem unsichtbaren Rahmen.* Drei Runden gingen auf die Suche
  nach einem Fehler, den es nicht gab: `ticks()` blieb bei 8, die Sequenz war gesetzt, aber kein
  Frame verarbeitete sie — `document.visibilityState` war `hidden`. Neu in `window.__cvd`:
  `paint()` zeichnet einen Frame unabhängig von der Schleife, `stepMs(ms)` treibt die Uhr um einen
  genauen Betrag weiter, `ticks()` / `seqState()` / `camState()` machen den Zustand abfragbar.
  Damit ist ein Beweisbild auch dann reproduzierbar, wenn die Seite nicht im Vordergrund liegt.
  Nachtrag: ein leeres Bild direkt nach dem Ein- oder Ausblenden der Seitenleiste ist KEIN Fehler —
  die Größenänderung leert die Leinwand, und bei angehaltener Schleife malt niemand nach.

**NACHTRAG Oberfläche (18.09. spät).** Lautwort und Ton saßen zuerst als zwei weitere Knöpfe in
der Kopfzeile. Gemessen bei 924 px Fensterbreite brach die Reihe damit um: fünf von sechs
Knöpfen zweizeilig in einem Kasten mit festen 28 px Höhe, je 4 px Text unter der Unterkante, und
der Untertitel auf zwei Zeilen in einer 52-px-Kopfzeile. Ursache war nicht der neue Knopf allein,
sondern dass ALLE Kopfzeilen-Kinder `flex-shrink: 1` und `white-space: normal` hatten — bei
Überbreite stauchen sie unter ihre Inhaltsbreite, und weil die Knöpfe eine feste Höhe haben,
spillt die zweite Zeile heraus statt den Knopf zu vergrößern.

Behoben nicht durch Zurechtbiegen, sondern durch Umziehen: **die beiden Schalter wohnen jetzt in
der Seitenleiste unter »Optionale Schicht«**, wo Profil und Fahrweise ohnehin stehen. Die
Kopfzeile behält vier Knöpfe mit `white-space: nowrap` und `flex: 0 0 auto`; das nachgebende
Element ist der Untertitel (Auslassungspunkte). Nachgemessen: Kopfreihe 283 px in 884 px, kein
`scrollWidth`- oder `scrollHeight`-Überhang an irgendeinem Knopf, Untertitel eine Zeile.

**Sechs neue Knöpfe:** RÜCKWÄRTS, RÜCKWÄRTS ECKE, WENDEN, EINPARKEN, 2 RÄDER FREI, BANDE. Dergefahrene Weg, die Gasse und die benötigte Lücke werden gezeichnet; die Seitenleiste zeigt alle
vorausgerechneten Zahlen. Bei einem Wallride setzt sich die Kamera auf die OFFENE Seite — sonst
steht die Bande im Bild und verdeckt alles.

Belege: `screenshots/0*-manoeuvre.png` (Wenden Zug 1 und 2, Rückwärts um die Ecke) und
`screenshots/0*-stunt.png` (Rückwärts Ecke, Einparken zweiter Bogen, zwei Räder frei, Bande).

**Offen:** Fassrolle (Drehachse, Umdrehungen bis zum Ausrollen, Tempoabhängigkeit, Landung mit
einmaligem Hochfedern, Lautwort und Ton) und die unsichtbare Kupplung als Kette beliebiger Länge.

**NACHTRAG (18.09., aus der Abnahme).** Der Drehpunkt des Zwei-Rad-Stunts stand fest auf
`side × contactX`. In den beiden Phasen mit NEGATIVEM Rollwinkel — dem Gegenroll der Anticipation
und dem einmaligen Rückfedern nach dem Aufsetzen — drehte die Karosserie damit über die
Laufflaechenkante der anderen Seite hinweg und zog deren Räder unter die Ebene. Gemessen
2 × contactX × sin|φ|: an der Bande **−0,0483 u** im Landeframe, also zwei Drittel des Radradius
im Asphalt — im meistbeachteten Bild des ganzen Stunts, und spiegelbildlich gleich für `side −1`.

Die Abnahme oben hat das übersehen, weil sie an den Marken `peak / settled / holdMid / touchdown`
abgetastet hat — genau die Stellen mit nicht-negativem Winkel. **Regel daraus: einen Verlauf
abtastet man über seine ganze Länge, nicht an seinen Marken.** Die Marken sind dafür da, ein
Beweisbild zu setzen, nicht dafür, einen Verlauf zu prüfen.

Behoben: der Drehpunkt folgt dem Vorzeichen des Winkels. Das ist auch der richtige Read — wer
sich zum Aufschwingen belädt, kippt kurz auf die Räder der Gegenseite. Nachgemessen im 10-ms-Raster
über den ganzen Verlauf (0–2530 ms), beide Varianten, beide Seiten: tiefste Radunterkante **exakt
0,0000**. Gegenroll bei −6,58° hebt die Gegenseite 0,0403 u, Rückfedern bei −6,73° hebt sie
0,0413 u, am Ende stehen alle vier Räder auf 0. `wallGeometry` war nicht betroffen: sie rechnet
mit dem positiven Haltewinkel.

## 2026-09-18 · Motion-Familie »Schlingern« · `lab-v7/vehicle-fishtail.v1.js`

Georgs Reihenfolge: Schlingern zuerst als eigene Familie, danach als Erholungsphase in den
Überschlag. Also nur das Schlingern — kein Flug, kein Lautwort, kein Ton, keine Kamera.

**Der Read.** Das Heck pendelt aus, die Nase bleibt auf Kurs. Dafür dreht das Fahrzeug um die
**Vorderachse**, nicht um seine Mitte — sonst wandert die Nase mit und das Bild liest als Drift.
Der Drehpunkt ist gemessen: Mittelpunkt der Vorderräder aus dem Rig, Höhe auf `frame.contactY`,
damit der Gegenroll um die Bodenlinie kippt und die Räder aufstehen bleiben.

**Schichtung.** Primär die Gierauslenkung. Sekundär Gegenroll (nachlaufend) und Gegenlenkung der
Vorderräder (aus dem Gierwinkel abgeleitet). Tertiär nichts.

**Additiv.** Eigene Gruppe *über* `rig.group`. Der Deformer besitzt weiter `responseRoot` und
`shellRoot`; diese Datei fasst beide nicht an. Die Gegenlenkung wird zum Lenkwinkel addiert,
nicht gesetzt.

**Abgeleitet statt erfunden.** Genau ein freier Faktor (`HZ_OF_SPRING = 0,42`), alles andere aus
den schon deklarierten Profilwerten. Gemessen an CAR_CHILL_LIGHT: 1,26 Hz, 396,8 ms je Schwinger,
Verhältnis 0,483, vier Schwinger, 1587 ms.

**Gemessen im Browser** (Haltezustand, feste Kamera, car_hatchback):

| t | Schwinger | Gier | Roll |
|---|---|---|---|
| 198 ms | 1 | −4,73° | 1,20° |
| 230 ms | 1 | −4,32° | **1,28°** (Rollspitze, 32 ms nachlaufend) |
| 595 ms | 2 | +2,28° | −0,58° |
| 992 ms | 3 | −1,10° | 0,28° |
| 1389 ms | 4 | +0,53° | −0,14° |

Abklingen je Schwinger gemessen 0,474 / 0,483 / 0,495 gegen deklariert 0,483. Rückkehr auf
exakt 0 bestätigt.

Profilstreuung, abgeleitet: BOARD_RIDER_LIGHT 1,76 Hz und sechs Schwinger, HEAVY_FUTURE 0,80 Hz
und 2506 ms, TRAILER_TOWED nur 1,74° erste Spitze — ein Anhänger schlingert flach, das fällt
aus der Ableitung heraus und musste nicht gesetzt werden.

**Zwei Fehler auf dem Weg, beide gemessen gefunden:**
- Der Gegenroll lief eine Vierteldrehung nach. Das ergibt auf jeder Gierspitze genau 0,00° Roll
  und umgekehrt — Gegenphase, nicht Follow-through, beide Bewegungen nie zusammen sichtbar.
  Nachlauf jetzt 0,18 einer halben Schwingerzeit, bei CAR_CHILL_LIGHT 71 ms, im Bereich von
  Motion-Skill §2.5 (35–85 ms).
- Die Aufnahme rannte der Bewegung nach: Ziel 170 ms, Bild 418 ms, also eine Pose, die niemand
  gemeint hat. Neu: `poseAt(ms)` hält einen Frame fest, `peakMs(k)` gibt die Umkehrpunkte —
  sie liegen auf (k + 0,5) × halber Schwingerzeit, nicht auf ganzen Schwingern.

**Ehrlichkeitskorrektur.** `yawDeg` ist die Amplitude bei t = 0, wo der Sinus null ist. Der erste
*sichtbare* Ausschlag ist `yawDeg × √ratio` — 6,80° deklariert, 4,73° gesehen. Beide Zahlen
stehen jetzt im Readout.

**Offen:** Überschlag (Fassrolle um die Längsachse, tempoabhängig bis zum Ausrollen, Landung auf
den Rädern mit einem Nachfedern, Lautwort und ein Ton) und die unsichtbare Kupplung als Kette
beliebiger Länge. Beides von Georg entschieden, noch nicht gebaut.

## 2026-09-18 · Space Base Bits aufgenommen · drei Fahrzeuge, zwei Profile

- **Befund B2 erledigt.** Das Pack liegt jetzt in `kayfabizarro/media/3D_Assets` und im
  Registry-Pack `kaykit-space-base-bits-1-0-free`. Byteweise geprüft: drei glTF, drei `.bin`,
  eine Textur, alle im selben Ordner. Pin `eb48f50489b9`. Kein `.glb`-Umbau nötig.
- Neue Fixture-Gruppe `spacebits` in `lab-v7/fixture-adapters.v2.js`: **Spacetruck**,
  **Spacetruck Large**, **Spacetruck Trailer**. Damit 46 Fixtures statt 43.
- Geometrie aus den glTF gelesen, nicht geschätzt: vier benannte Radknoten je Fahrzeug,
  Radachse auf x, Y-up, achsenparallel (`orientDefault: 0`). Radradius 0,0877 / 0,1140 / 0,0877 u,
  Radstand ±0,2136 / ±0,2136 / ±0,2636, Aufstandsebene y −0,0779 / −0,1335 / −0,1431.
- **Blickrichtung erstmals nicht geraten.** Bei allen anderen Fixtures ist `facing` eine Annahme.
  Hier benennt das Asset selbst `wheel_front_*` bei z +0,2136 — `facing: 1` ist damit abgelesen.
- Zwei Profile in `deformer-profiles.json`: `SPACE_HAULER` (kurzer Radstand, hoher Aufbau) und
  `TRAILER_TOWED` (`stretchAmount: 0` — ein Anhänger zieht nicht). Beide **nicht abgestimmt**,
  Struktur wie HEAVY_FUTURE deklariert.
- Offen geblieben: der Nachlauf des Trailers braucht eine Kopplung an das Zugfahrzeug. Ein
  Anhängepunkt ist im Asset nicht autoriert; die vordere Kante liegt bei z +0,5000. Ob der
  Nachlauf zum Zugfahrzeug gehört oder ein eigener Actor ist, entscheidet Georg.
- **`lab-v7/carrig.v2.js`.** Spacetruck Large fiel mit **0 Rädern** durch die Formprüfung:
  Radbreite 0,1620 u gegen Durchmesser 0,2280 u, Verhältnis 1,407 — unter der Schwelle 1,5 aus
  v1. Vier benannte, gespiegelte, bodenberührende Radknoten verworfen, weil die Räder dick sind.
  v2 trennt die Schwelle nach Weg: 1,3 im Knoten-Weg (der Autor hat benannt, die vier bestätigen
  sich gegenseitig), 1,5 im Insel-Weg (dort spricht nur die Form). Sonst zeichengleich mit v1,
  neue Datei statt Überschreiben wegen des Zwischenspeichers.
- Nachgemessen nach der Umstellung: Spacetruck 4, Large 4, Trailer 4, Hatchback 4,
  raceCarRed 4 (die »12 Räder« aus der ersten Fassung kommen nicht zurück), Monster-Truck 4,
  Skateboard weiterhin 0. Deformer antwortet auf beiden neuen Profilen, `stretch` beim Trailer
  bleibt 0.
- Der Aufbau des Spacetruck Large steht 0,0579 u nach hinten über — die Nickachse liegt nicht in
  der Mitte der Karosserie. Am Deformer noch nicht nachgezogen.

## 2026-09-18 · Session-Cut · Fahrzeug-Linie, dritte Runde abgeschlossen

**Gebaut**
- `KFB Cartoon Vehicle Deformer Lab.dc.html` — Werkbank mit elf Briefing-Knöpfen plus
  `RAIL HOLD` und `NEUTRAL`, vier Profilen, Signal-Reglern, `Flip` und `Orient` mit
  Gedächtnis je Fixture.
- `lab-v7/vehicle-cartoon-deformer.v2.js` — gruppenbasierter Deformer: nested Groups,
  bounded non-uniform scale, gedämpfte Springs. Kein Shader, kein Softbody.
- `lab-v7/fixture-adapters.v2.js` — 43 Fixtures, generiert aus Handoff (25) und
  Registry (18), Herkunft je Zeile.
- `lab-v7/deformer-profiles.json`, `lab-v7/TEST_SEQUENCES.json`.

**Sieben Befunde aus Georgs Sichtprüfung behoben**
- Rad-Regel um drei gemessene Bedingungen erweitert (Gegenstück, Bodenkontakt, Größen-Median).
  Police Car 15 → 4, Wagon 10 → 4. Vorher rotierte beim Police Car die **Tür** bei ACCEL mit.
- Kamera folgt nicht mehr der Blickrichtung (z-Lage war mit `facing` multipliziert).
- Near/Far aus der Modellhülle statt fest 0,01/200.
- Orient-Schalter auf sechs achsenparallele Lagen statt vier.
- Abgelesen und eingetragen: `Kart by Ben`, `vehicle-monster-truck`, `vehicle-truck` auf −z;
  `Wagon` auf X−90°.

**Kontakt-Latch statt Cooldown** — `railImpact()` darf je Frame gerufen werden; Aufrufe
innerhalb `retriggerMs` sind derselbe Kontakt. Drei Anläufe, zwei falsch gebaut, einer falsch
gemeldet (600 ms Wandkontakt ergaben gemessene fünf Einschläge, berichtet war einer).

**Überholt, bleibt liegen**
- `lab-v7/cardeform.v1.js` — Shader-Fassung. Briefing verlangt ausdrücklich keinen
  Vertex-Overkill. Preis: die Bananen-Biegung ist entfallen.
- `lab-v7/fixtures.v1.js` — Keyframe-Fixtures, ersetzt durch signalgetriebene Sequenzen.
- `KFB Vehicle Lab v1.dc.html` — erste Werkbank.

**Offen geblieben** — Go-Kart nicht achsenparallel, Rollerskate/Skateboard-Rollen
Einzelnetz, Space Base Bits nicht ladbar, ActionFigure fehlt, keine Zahl abgenommen,
kein Ton/VFX/Kamera. Vollständig in `RETURN_cartoon_vehicle_deformer.md` (OPEN) und
`HANDOVER_RACE_2026-09-18.md`.

---

## 2026-09-17 · Fahrzeug-Linie `lab-v7` angelegt

- Auftrag: KayKit Space Base Bits aufnehmen, Fahrzeuge mit Cartoon-Deformern für
  Speed-Race-Tracks vorbereiten. Track baut Georg selbst (`kfb-hub/stunt-race/track-lab-v062`).
- **Befund B1:** das Pack hat genau drei Fahrzeuge, nicht 57. Die übrigen glTF sind Basismodule.
- **Befund B2:** Space Base Bits liegt nicht im Registry und ist im Browser nicht ladbar.
- **Befund B3:** die Registry-Fahrzeuge sind die tragfähige Quelle (22 aus drei Packs).
- **NACHTRAG (17.09. abends):** der Asset-Handoff `kfb.asset-handoff.v1` @ `10a7fdce6b` ist
  ab jetzt die Quelle, nicht das Registry. Beide bleiben, getrennt gekennzeichnet.
- Stand-Dokument `LIVING_VEHICLES.md` angelegt.

---

## 2026-09-12 · Animation Lab v1.1 · Cross-Rig abgenommen

- Cross-Rig (`M+L`) mit `FIT`/`RAW`: fremde Clips füllen nur Lücken, das gemessene Rig
  hat Vorrang. Sechs Versuche eingetragen, Urteil vom Bediener.
- **Befund Large-Lücke:** Orc Brute mit `Jump_Start` aus Rig Medium bindet 23/23 und faltet
  roh zusammen; ohne Positionsspuren hält er. Urteil *limited*.
  **Produktionsfolge: Custom-Sprungclips für Rig Large entfallen.**
- Quellen gepinnt auf `b97b5ac55df2724fae623992433685583eece51e`, 94 Pfade vorher geprüft.
- `export/AnimationMap.v0.json` und `MISSING_ANIMATIONS.md` aus den echten Inventaren erzeugt.
- Evidence-Batch: Georgs Vollauf 48/48 Zellen gegengeprüft.
- Details in `HOUSEKEEPING.md` und `LAB_QA.md`.

---

## 2026-09-09 bis 09-11 · Clip-Schau und Asset-Aufnahme

- `KFB Clip-Schau v1.dc.html` als Evidence-Viewer, nach Sprint 1 eingefroren.
- Asset-Bibliothek von Georg aufgenommen, Pfade und doppelte Pack-Kopien in `SOURCE_PATHS.md`.
- Rigging-Linie (Carl/Gesicht) in `LIVING_RIGGING.md`; `16B-FAILED.md` und
  `POSTMORTEM_carlrig_v4_16B.md` sind das bezahlte Lehrgeld.
