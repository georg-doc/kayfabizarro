# KFB WhackMan v1 · TEST_REPORT

Stand 2026-09-21. Alle Zahlen sind zur Laufzeit im Browser gemessen, nicht getippt.
Was nicht gemessen wurde, steht unter „nicht geprueft" — keine erfundenen Testzahlen.

## Gate A · Spenderlage

| Pruefung | Ergebnis |
|---|---|
| PrototypePete geladen, Rig_Legacy | 6 Bones, 30 Clips in EINER Datei |
| Clipsatz vollstaendig protokolliert | Attack(1h), AttackCombo, AttackSpinning, BasePose, Block, Cheer, Climbing, Dance, DashBack, DashFront, DashLeft, DashRight, Defeat, HeavyAttack, Hop, Idle, Interact, Jump, LayingDownIdle, PickUp, Roll, Run, Shoot(1h), Shoot(2h), Shoot(2h)Bow, Shooting(1h), Shooting(2h), Throw, Walk, Wave |
| character_orcA ueber legacyAssemble() | 4/4 Teile gebunden (Body, Head, armLeft, armRight), 0 fehlend |
| beide Akteure animiert | ja, derselbe Legacy-Clip |
| EyeRig montiert | NEIN — gesperrt, LegacyFaceHost offen (Brief §4) |
| Fehler | 0 |

## Gate B · Rezeptur -> Modell -> layout() -> Szene

| Pruefung | Ergebnis |
|---|---|
| Bauteile bestaetigt (Owner-Messung) | 25/25 |
| Modul / Wandhoehe / Wandplatte / Hub | 4 / 4 / 1 / 4,05 |
| Platzierungen aus layout() | 399 |
| Fugen | 353 |
| Waende gesetzt | 171 (102 halb, 41 von Eckteilen gedeckt) |
| Eckteile | 92 |
| freie Wandenden | 4 (benannt: die zwei offenen Tunnelmuender) |
| Tunnelmuender offen statt Durchgang | 2 — Durchgang waere von zwei Eckschenkeln voll gedeckt |
| Durchdringungen (kit-lab auditFootprints, gerenderte Geometrie) | **0** |
| Texturen offen nach repairTextures | **0** |
| Tuerblaetter ausgeblendet | 0 (keine Tuer gesetzt) |
| Fackellichter | 7 |

## Gate B · MazeGraph

| Gate §6 | Soll | Ist | |
|---|---|---|---|
| Breite | 13–19 Zellen | 17 | PASS |
| Schleifen | > 0 | 18 | PASS |
| Kreuzungscluster (Grad 4) | 3–5 | 5 | PASS |
| Sackgassen | 0 | 0 | PASS |
| unerreichbare Knoten | 0 | 0 | PASS |
| Tunnelpaar | >= 1 | 1 | PASS |
| Pferch mit genau einer Tuer | ja | 6 Zellen, 1 Tuer | PASS |
| Sonderleckereien | >= 3 | 4 | PASS |

123 begehbare Knoten, 140 Kanten, 108 regulaere Sammelplaetze, 1 Story-Bit.

## Gate C · PlayerMotor + freier Orbit

| Pruefung | Methode | Ergebnis |
|---|---|---|
| Laufgeschwindigkeit | 1,5 s Messfenster gegen Sollwert | **2,70 Zellen/s** bei Sollwert 2,70 |
| Wanddurchbruch | 4000 Schritte mit zufaelligen Absichten; jeder Knotenwechsel muss eine Graphkante sein | **0 Durchbrueche** |
| gepufferte Abbiegung | im selben Lauf gezaehlt | 19 von 115 Abbiegungen wurden gepuffert ausgefuehrt |
| Tunnel-Wrap | von 1,7 nach Westen | 1 Teleport, Fortsetzung bei 13,7 in derselben Richtung |
| Sammeln | Knotenabfrage, kein Abstandstest gegen Meshes | 5 Sammelplaetze in 1,5 s Lauf eingesammelt |
| alle Sammelplaetze erreichbar | BFS vom Spielerstart | 108/108, **0 unerreichbar** |
| Kamera dreht den Spieler | Absicht ist kamerarelativ, Spielerdrehung folgt der Gangrichtung | nein |
| Orbit aendert den Spielzustand | Kamera schreibt nur controls.target | nein |
| Wandverdeckung | sieben Abtastpunkte der Silhouette (Fuesse/Mitte/Kopf/Schultern) alle 0,08 s, Vereinigung der Treffer wird durchscheinend | Akteur bleibt sichtbar |
| Tastenrichtung | alle vier Tasten bei drei Orbitwinkeln gegen die erwartete Kardinalrichtung | siehe unten |
| Browserfehler | Konsole | 0 |

### Ein Fehler, der fast durchgerutscht waere
`cameraIntent()` rechnete den Yaw-Winkel aus der Blickrichtung zurueck und drehte den
Tastenvektor damit — eine Drehung zu viel, mit falschem Vorzeichen. Bei der Startkamera
(suedlich, Blick nach Norden, camYaw = π) wurde aus **vorwaerts SUEDEN**, und Sueden ist dort
Wand: die erste Taste, die jemand nach dem Laden drueckt, tat schlicht nichts. Bei Yaw 0 war der
Fehler unsichtbar, deshalb hat er den ersten Durchgang ueberlebt. Richtig ist, die von der Kamera
gelieferte Vorwaertsrichtung direkt zu benutzen statt sie zurueckzurechnen.

Damit ist auch eine fruehere Zeile in diesem Bericht falsch gewesen: der Tastentest
`8,13 -> 11,13` war **kein** korrektes kamerarelatives Verhalten, sondern genau diese Inversion —
bei Blick nach Norden ist Bild-links Westen, nicht Osten.

### Ein Befund, der Zeit gekostet hat
Der Spielschritt lief zuerst ueber ein reines `setInterval(16)`. In einem nicht im Vordergrund
stehenden Vorschaurahmen wird das auf **einen Aufruf pro Sekunde** gedrosselt — gemessen: 1 Tick
in 1000 ms, Rendern selbst kostete dabei 1,2 ms. Es sah nach einer schweren Szene aus und war eine
Zeitgeberdrosselung. Der Takt laeuft jetzt wie in kit-labs eigenem Viewer: **rAF fuehrt, ein
Intervall faengt auf** und zeichnet nur, wenn rAF wirklich steht. Beide Fehlerrichtungen sind
damit abgedeckt — rAF-Stillstand (Diorama-Pass) und Intervall-Drosselung (dieser Pass).

## Nachtrag 2026-09-21 · Ansicht, Decke, Kamera (Georgs Durchsicht)

| Punkt | Befund |
|---|---|
| „Lücken zwischen Wänden und Tiles" | **Gemessen**: groesster Abstand zwischen zwei benachbarten Wandteilen **0,003** bzw. **0,007** Einheiten (145 Paare, zwei Werte). Das ist nicht sichtbar. Was sichtbar war, ist der offene Deckel: ohne Decke schaut man ueber die 4 Einheiten hohe Wand hinweg in die schwarze Flaeche ausserhalb des Labyrinths. |
| Decke | `ceiling_tile` **4,00 × 0,35 × 4,00** — exakt ein Modul, ueber dieselbe Owner-Messfunktion gemessen. Eine Platte je begehbarer Zelle, Unterkante auf Wandhoehe, 123 Stueck. Benannte Erweiterung des S13-Inventars: S13 war ausdruecklich „Architektur zuerst, keine Requisiten", eine Decke brauchte der Generator dort nie. |
| Deckenloch | Ein voll geschlossenes Dach zeigt von oben nur ein Dach. Also bleibt die Decke stehen und bekommt ein Loch: innerhalb 1,9 Module offen, bis 3,4 Module halbdurchsichtig, dahinter dicht. Abstandstest je Platte, kein Strahl. |
| Ansicht | Neue Vorgabe **Verfolgerkamera** nach Georgs Referenz (butchler/Pacman-3D, gh-pages): schraeg hinter dem Akteur, mitdrehend, **unter** der Decke (Hoehe 0,78 × Wandhoehe — jede Hoehe darueber sieht nur Deckenplatten). Freier Orbit bleibt als zweite Ansicht, umschaltbar. |
| Kamerakollision | Strahl vom Akteur nach hinten; der Abstand wird gekuerzt, bevor die Kamera in einer Wand steht (Minimum 0,9 Module). |
| Ruckeln beim Einschwingen | **Behoben.** Das Kameraziel wurde weich interpoliert, waehrend OrbitControls mit eigener Daempfung dieselbe Kamera schrieb — zwei Schreiber auf einem Zustand. Ziel wird jetzt hart gesetzt; weich ist die Bewegung des Akteurs, die Kamera haengt nur dran. Erstes Bild wird gesnappt statt angefahren. |
| Steuerung | Vorgabe jetzt **charakterrelativ** (W vor, S zurueck, A/D drehen) wie in der Referenz — damit ist „vorwaerts" immer Bildschirm-oben und die Richtungsfrage entfaellt. Kamerarelativ bleibt als A/B. |
| Startblick | Der Akteur und die Kamera starten jetzt in einer **legalen** Richtung (gemessen: Ost). Vorher schauten beide nach Norden, und noerdlich vom Start steht Wand — die erste Taste tat nichts und die Kamera stand in der Mauer. |

### Nachtrag · Panzersteuerung korrigiert

| Pruefung | Ergebnis |
|---|---|
| A drei Sekunden GEHALTEN | **genau eine** Drehung (E -> N), keine Bewegung. Vorher: fuenf Drehungen in drei Sekunden, zurueck auf Ost, zwei Zellen versetzt — die Drehung wurde jedes Bild neu angewendet. Jetzt flankengesteuert. |
| A dreimal GETIPPT | drei Drehungen (N -> W -> S -> E) |
| A gegen eine Wand | Akteur dreht **auf der Stelle** statt gar nichts zu tun. Eine unmoegliche Absicht schreibt den Puffer nicht mehr in jedem Bild neu — vorher konnte dadurch auch eine echte Abbiegung nie mehr feuern. |
| W drei Sekunden | 8,13 -> 15,13, 7 Sammelplaetze |
| Hinweiszeile | folgt jetzt Gate und Ansicht. Vorher stand in Gate C dauerhaft „Ziehen = Orbit · unten: Station" — der Orbit ist dort abgeschaltet (`controls.enabled === false`) und eine Stationsleiste gibt es nicht. |

### Nachtrag · Rueckwaerts und Startkamera

| Pruefung | Ergebnis |
|---|---|
| S drei Sekunden gehalten (Start 8,13, Blick Ost) | laeuft nach Westen bis **1,13**. Vorher: keine Bewegung. Ursache war eine Rueckkopplung — die Absicht kam aus `OPP[face]`, und `face` wurde danach aus der FAHRTrichtung zurueckgeschrieben, also der Gegenrichtung. Der Motor kehrte jedes Bild um, `t` fiel auf ~0 zurueck. `face` gehoert jetzt der Eingabe; nachgezogen wird es nur beim Vorwaertsfahren. |
| W 2 s, dann S 2 s | 8,13 -> 13,13 -> 8,13 |
| Startkamera | steht bei `[19,2 · 3,1 · 52]`, also **westlich hinter** dem nach Osten blickenden Akteur, im Gang. Vorher wurde sie stur nach Sueden gesetzt und stand damit hinter der Suedwand ausserhalb des Labyrinths — bis zum ersten Tick war das Bild fast schwarz. Jetzt aus der Blickrichtung gebildet. |

### Nachtrag · Steuerung, dritte und letzte Fassung

Drei Anläufe, ein Grund: `face` diente gleichzeitig als **Eingabe** und wurde aus der **Fahrt**
beschrieben. Jede Variante des Schutzes schob den Fehler nur an eine andere Stelle:

1. Schutz an `keys.down` — `face` kippte in den sechs Zellen, die der Akteur nach dem Loslassen
   noch rueckwaerts rollt. Danach zeigte „vorwaerts" in die Wand, aus der er kam.
2. Schutz an `!motor.buffer` — `face` ueberschrieb einen A-Tipp in genau dem Fenster, in dem die
   gewuenschte Abbiegung am Ankunftsknoten noch nicht legal und deshalb noch nicht gepuffert war.
3. **Richtig:** `face` gehoert der Eingabe. Aus der Fahrt wird es nur nachgezogen, wenn der GANG
   die Richtung erzwungen hat — `MazeMotor.forcedTurn`, gesetzt beim Kantenwechsel ohne
   gepufferte Abbiegung. Die sichtbare Drehung kommt ohnehin aus `p.yaw`; `face` ist Steuerung,
   keine Anzeige.

Ganze Kette handgesteppt ueber `built.update(1/60)` mit echten KeyboardEvents:

| Lauf | Ergebnis |
|---|---|
| S halten, loslassen, auslaufen (Start 8,13 Blick O) | 1,13 |
| danach W | **5,13** — faehrt wieder nach Osten |
| W halten, A tippen | biegt nach Norden ab, **12,8**, dir N |
| W halten, D tippen | Sueden ist in Zeile 13 nirgends legal, faehrt weiter nach Osten bis 15,13 — kein Fehler, das ist der Grundriss |
| A 3 s gehalten | **eine** Drehung, O -> N, keine Bewegung |
| A dreimal getippt | O -> N -> W -> S |
| W 3 s | 8,13 -> 15,13 |
| Startkamera | `[19,2 · 3,1 · 52]`, westlich hinter dem nach Osten blickenden Akteur |

`resetTo()` ergaenzt: setzt Motor UND Blickrichtung zurueck. Ein Pruef­lauf, der nur
`motor.reset()` ruft, misst sonst die Blickrichtung des vorigen Laufs — das ist mir in dieser
Runde selbst passiert und hat einen gruenen Lauf als roten gemeldet.

### Nachtrag · Ansicht und „Decken-Konstruktion" aus der Referenz gelesen

Ich hatte die Referenz beschrieben statt sie zu lesen. Quelle:
`butchler/Pacman-3D@gh-pages` · `game.js` · `updateCamera`, Zellmaß dort 1:

    targetPosition = pacman + UP * 1.5 + direction * (-1)
    targetLookAt   = pacman + direction * 1
    camera.position.lerp(targetPosition, delta * 10)
    new THREE.PerspectiveCamera(65, …)

In Modulen uebernommen: Kamera **1,5 Zellen hoch**, **1,0 Zellen hinter** dem Akteur, Blickpunkt
**1,0 Zellen davor** auf Akteurshoehe, **65°**, Nachfuehrung **10·dt**.

**Die Decken-Konstruktion der Referenz ist keine Decke.** Dort ist die Wand genau EINE Zelle hoch
und die Kamera sitzt eine volle Zelle UEBER der Wandkrone — man schaut auf die Wandoberseiten
hinunter, und dadurch liest das Spielfeld als geschlossene Platte mit eingeschnittenen Kanaelen.
Es gibt in `game.js` kein `ceiling`-Objekt; die Waende sind `BoxGeometry(1,1,1)`.

Meine Kamera stand auf **0,78 Wandhoehen**, also UNTER der Krone: ein Korridorblick, kein
Spielfeld. Und die 123 bzw. 7 Deckenplatten waren ein Ersatz fuer etwas, das die Referenz mit der
Kamerahoehe loest.

Konsequenz: `ceiling_tile` bleibt als Bauteil verfuegbar und der Tweak `decke` schaltet es fuer
die Innenraeume zu — **Vorgabe ist aus**, wie in der Referenz.

### Messhinweis
Die Zahl 2,70 Zellen/s stammt aus einem Lauf im fokussierten Fenster. In einem nicht fokussierten
Vorschaurahmen drosselt der Browser die Zeitgeber auf etwa vier Ticks pro Sekunde; dort misst
derselbe Code 0,19 Zellen/s. Wer nachmisst und auf einen solchen Wert kommt, misst die Drosselung,
nicht den Motor.

## Nicht geprueft

- Mobil / schmaler Viewport.
- Feste Stage-Adresse, Branch, PR — aus dieser Umgebung nicht moeglich.
- Verfolger, POWERED/Whack, Treffer/Respawn, Level-Clear: noch nicht gebaut.
- EyeRig auf Legacy: gesperrt bis LegacyFaceHost.
- Audio/VFX: nicht begonnen.
