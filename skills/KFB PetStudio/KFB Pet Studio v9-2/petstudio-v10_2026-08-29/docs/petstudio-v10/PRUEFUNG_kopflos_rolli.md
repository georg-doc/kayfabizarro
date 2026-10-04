# Prüfung ohne Bühne · Rolli-Mechanik (29.08.2026)

**Warum es diese Datei gibt.** Beide Vorschaufenster haben in dieser Runde nicht mehr geantwortet
(„Agent viewport not ready", „preview may not be responsive"), also gab es kein Bild und keine
Live-Probe. Die Regel dieses Projekts ist trotzdem *messen statt behaupten*. Also wurde der
**echte Quelltext** von `studio-v10/KloRolli.js` geladen, die `export`-Schlüsselwörter entfernt und
gegen einen **THREE-Stub** laufen gelassen: `BufferGeometry`, `BufferAttribute`,
`Float32BufferAttribute`, `MeshStandardMaterial`, `Mesh`, `Vector3` — mehr fasst `PaperSheet` nicht
an. `KloRolli.update()` läuft dabei unverändert; gestellt sind nur `roll`, `swing`, `paper` und
`rig: null`.

**Was das kann und was nicht.** Es misst *Mechanik*: Zahlen, Vorzeichen, Schwellen, Zustände. Es
misst **kein Bild** — Strahltreffer auf das Blatt, Kamera-Freigabe und der neue Panel-Abschnitt
brauchen die laufende Seite und sind unten als offen geführt.

---

## Gemessen

| Frage | Ergebnis |
|---|---|
| Dreht die Rolle beim Ziehen ab oder auf? | Zug 0 → 1 dreht **0,0000 → 3,3365 rad = 191,2°**, Vorzeichen **positiv** = die vordere Fläche läuft nach unten, das Papier rollt ab |
| Stimmt die abgelesene Kennzahl mit der Drehung? | `sheetState().radPerPull` = **3,337** gegen gemessene 3,3365 — dieselbe Zahl, ein Eigentümer |
| Springt die Rolle nach `newSheet()` zurück? | **Nein.** Differenz **+0,9336 rad** vorwärts (ohne das `rewound`-Zeichen wären es −3,3). Die 0,93 sind kein Fehler: das neue Blatt rollt auf Zug 0,28 ab, 0,28 × 3,337 = 0,934 |
| Reißt der Riss an der Rate, nicht am Weg? | Leinwand 525 px, Anteil 0,44, Schwelle 2,6: 4 px/Bild → Rate 1,04 → zieht · 10 px/Bild → 2,60 → zieht (die Schwelle ist ein *echtes* Größer-als) · 30 px/Bild → 7,79 → **reisst** · 10 px in 250 ms → 0,17 → zieht |
| Hält die Perforation unter halbem Zug? | Bei Zug 0,28 reisst auch Rate **7,79 nicht** — `minPull 0,5` greift |
| Kommt Papier durch den Boden? | Voller Zug: **72 Punkte liegen**, **0 Punkte durch** den Boden, tiefster −0,1927 bei Boden −0,1927 |
| Klebt es dort fest? | Zug zurück auf 0,28 → **0 Punkte liegen**. Das Blatt hebt wieder ab (die Klemmung in der Zwang-Schleife statt dahinter) |

Nebenbefund, der die Runde vorher bestätigt: dieselbe Bodenmessung auf einem frisch gebauten
`PaperSheet` — also unabhängig von der Bühne — liefert dieselben Zahlen wie die Live-Messung.

## Gemessen, zweiter Durchgang: die Gestik am Wirt

Die drei Methoden `_sheetDown` / `_sheetMove` / `_sheetUp` wurden aus der Logik-Klasse
herausgeschnitten und gegen einen Stub mit **gefälschter Uhr** laufen gelassen — damit ist die
Ereignis-Dichte der Maus steuerbar.

**Der Fehler, den das gefunden hat:** die Zugrate hing an der Maus-Frequenz, nicht an der Hand.
Rate war Weg geteilt durch den Abstand zweier Zeigerbewegungen, und der wurde auf 1/240 geklemmt.
Eine 1000-Hz-Maus meldet alle 1 ms — dieselbe ruhige Handbewegung erzeugte dadurch Rate **31 statt
3,4** und riss das Blatt beim normalen Ziehen ab. Behoben durch ein Sammelfenster von 30 ms.

| Handbewegung | 60 Hz | 125 Hz | 500 Hz | 1000 Hz |
|---|---|---|---|---|
| 200 px/s | 0,87 | 0,87 | 0,87 | 0,87 |

Dieselbe Zahl in allen vier Spalten — die Abhängigkeit ist weg.

| Handgeschwindigkeit (1000 Hz) | Rate | Ergebnis |
|---|---|---|
| 120 px/s | 0,52 | zieht |
| 400 px/s | 1,73 | zieht |
| 900 px/s | 3,90 | **reisst** |
| 1800 px/s | 7,79 | **reisst** |

Die Grenze liegt also bei rund **600 px/s** — eine gewollte Bewegung, kein Verrutschen.

**Kamera-Besitz** (Besitz und Zug sind zwei Zustände): nach dem Riss, solange die Hand hält,
`drag=false · owns=true · controls=false` → die Bühne dreht sich nicht mit. Beim Loslassen
`controls=true`. Zweimal loslassen schadet nicht. Ein `blur` **ohne** vorherigen Zug lässt eine
fremd abgeschaltete Kamera abgeschaltet — der Zug gibt nur zurück, was er selbst genommen hat.

## Gemessen, dritter Durchgang: Georgs zwei Bildbefunde vom Abend

**»Am unteren Papierrand glitcht und flackert etwas, Quer-Knick«** — kein Grafikfehler, ein
Stapel. Die Klemmung legte alle Restreihen auf dieselbe Höhe: der Reihenabstand fiel von 0,0295 auf
**0,0050** (sechsfach gestaucht), die Dreiecke werden entartet, und eine beidseitig sichtbare Fläche
streitet dann mit sich selbst um dieselben Pixel. Behoben, indem die Eindringtiefe **nach vorn**
ausweicht statt nach oben — Papier auf dem Boden legt sich hin, es stapelt nicht.

| Ausweichen | Punkte liegen | durch den Boden | kleinster Reihenabstand | Ausdehnung nach vorn |
|---|---|---|---|---|
| 0 (vorher) | 72 | 0 | **0,0050** | 0,044 |
| 0,4 | 54 | 0 | 0,0295 | 0,307 |
| **0,8 (gesetzt)** | 45 | 0 | **0,0295** | 0,319 |
| 1,2 | 45 | 0 | 0,0295 | 0,331 |

0,0295 ist der Sollabstand bei ganzem Zug — ab 0,4 ist er wieder exakt erreicht, also gibt es keine
entarteten Dreiecke mehr. Der **Ruhezustand bleibt unberührt**: bei Zug 0,28 liegt nichts auf der
Platte, Abstand 0,0083 (= Soll), Ausdehnung nach vorn 0,005 — das Ausweichen tut nur etwas, wenn
etwas ankommt.

**»Das Blatt ist unsauber und mit Farb-/Licht-Unterschied lazy vor die Rolle geklebt«** — richtig
gesehen: `PaperSheet` baute sich ein eigenes weißes Material (0xffffff, Rauheit 0,94), während die
Rolle das Material aus der GLB trägt. Zwei Materialien für **ein** Stück Papier, also zwei
Antworten auf dasselbe Licht. Das Blatt klont jetzt das Papiermaterial der Rolle (beidseitig, damit
die Rolle nicht mitgedreht wird). Am Bild abzunehmen — headless gibt es kein Licht.

## Am laufenden Build nachgemessen (29.08., nach dem Neuladen der Vorschau)

Das Fenster antwortete wieder, also ist alles hier **live** über den echten Bedienweg abgenommen —
von Hand getickt, weil `document.hidden` die Bildschleife anhält.

| Frage | Ergebnis |
|---|---|
| Trifft der Klick das Blatt? | Blattmitte bei 433 / 319 px → `_sheetDown` **true**, Kamera aus, Besitz gesetzt. 8 px in der Bildecke → **false**, Kamera bleibt an |
| Zieht langsames Ziehen? | 6 px je 50 ms = 120 px/s → Rate **0,62** in zehn Schritten konstant, Zug 0,28 → **0,59**, kein Riss |
| Reisst der Ruck? | 40 px je 50 ms = 800 px/s bei Zug 0,6 → Rate **4,12** → `ripping`, Zug beendet, **Kamera bleibt aus, solange die Hand hält** |
| Kommt der Riss durch? | Phase `released`, Drehung 2,953 rad, der Wirt meldet »abgerissen« |
| Neues Blatt | Zug 0,28, Drehung 7,223 rad — vorwärts, kein Rückwärtssprung |
| Voller Zug am Boden | 45 Punkte liegen, **0 durch**, kleinster Reihenabstand **0,0295** (= Soll) |
| Kriecht es nach vorn? | z-Ausdehnung über 40 s: 0,3191 · 0,3241 · 0,3297 · 0,3189 — es **atmet im Wind, es driftet nicht** |
| Panel-Abschnitt | mit Rolli 6 Zeilen, ohne Rolli genau **1** Zeile: die Erklärung statt eines Fehlers |
| Unterer Blattrand in PIXELN | Fenster 413 × 78 px um die letzten zwei Reihen: mittlerer Nachbarsprung **1,19** von 255, starke Kanten 17 (die Silhouette), **Sprenkel über 80: 0** — das Speckel-Band ist weg |
| Ein Material für ein Papier | Blatt und Rolle: Farbe **#a1a19e**, Rauheit **0,4151**, Metall **0,4000**, beide ohne Textur — identisch, das Blatt nur beidseitig |

**Offene Look-Frage, gemessen statt geraten:** das GLB-Material sagt **Metall 0,400** und Rauheit
0,415. Deshalb liest das Papier halbglänzend-grau, jetzt Rolle *und* Blatt gleich. Ob Papier Metall
0 haben soll, ist Georgs Entscheidung — es wäre eine Änderung am Rollen-Material, nicht am Blatt.

## Vierter Durchgang (29.08., Abend): »graue Platte · vorgeklebt · zittert«

Drei Befunde, **zwei Ursachen**, beide gemessen.

**Ursache 1: das Blatt hing 0,4262 zu tief.** In `attachPaper` stand `this.rollY - this.pivotY`.
`hang` und die Rolle sind aber beide Kinder von `swing`, und die Rolle sitzt bei `rollY` — zwei
Höhen-Konventionen im selben Bezugssystem, ein Rest aus der Bühnenfassung, wo `hang` am Nagel hing.
Gemessen: Reihe 0 lag **0,4425 von der Rollenachse** entfernt statt 0,1190 (Radius + 4 mm). Das
Papier begann also unter der Rollenmitte und lag als Platte vor der unteren Hälfte — genau
»vorgeklebt«.

**Dazu der Wickel.** Zwei genadelte Reihen können keinen Bogen bilden. Jetzt vier Reihen auf der
Rollenfläche, Viertelkreis von der vorderen Tangente bis **unten** an die Rolle; erst darunter fällt
das Papier frei. Damit kommt es UNTER der Rolle heraus, wie Papier von einer Rolle.

| Messung | vorher | jetzt |
|---|---|---|
| Abstand Reihe 0 von der Achse | 0,4425 | 0,1190 (= Radius + Haut) |
| Abstand der Wickelreihen zur Rollenfläche | 0,0040 → **0,0001** (verjüngt) | **0,0040 konstant** über alle vier |
| Freier Teil, kleinster Abstand zur Rolle | — | 0,0154 |
| Freier Teil, Abweichung aus der Senkrechten | — | 0,0005 über die ganze Länge |
| Zittern (Reihe 8 über 90 Bilder) | — | **0,00006** = 0,06 mm |

Die verjüngenden 0,0001 waren das Flackern: zwei Flächen im gleichen Abstand vom Auge streiten um
dieselben Pixel. Die Haut liegt jetzt **im Radius** des Wickels, nicht nur im Ursprung.

**Ursache 2: Papier ist kein Metall.** Das GLB-Papiermaterial sagt **Metall 0,400** bei Rauheit
0,415. Auf der gewölbten Rolle fällt das kaum auf; eine flache Bahn spiegelt damit eine dunkle
Stelle der Umgebung und liest als **graue Platte** — und weil eine Spiegelung auf winzige
Normalen-Unterschiede reagiert, wird jede Reihe der Simulation zu einer **Linie über dem Papier**.
Das Blatt trägt jetzt Metall **0**, Rauheit **0,85**, Farbe und Textur unverändert die der Rolle.

**Nicht gelöst, benannt:** das Tuch hat **keine Biegesteifigkeit**. Die Krümmung unten entsteht nur
aus Zug und Schwerkraft, darum liest sie wie dünnes Blech. Das wäre ein eigener Schnitt (ein
Winkel-Zwang über drei Reihen), keine Zahl an einem Regler.

## Reglerspannen am Mund (29.08.)

Die Grenzen kamen von den Cube-Pets: Mund unter der Mitte, kleiner Kopf. Rolli steht bei dy 0,52 und
Breite 1,49 — im oberen Drittel der alten Spanne, und darüber war Schluss. Neu: Größe 0,15…**1,6**
(war 0,9), Höhe **−1,8…1,8** (war −1,0…0,9), Breite 0,5…**3,5** (war 2,0). **Nur die Grenzen
wachsen, kein Wert ändert sich.**

## Tipp-Punkte (29.08.)

Die Punkte über dem Kopf hingen nur daran, dass die Sprechblase zu ist — und seit die zu ist,
standen sie immer, im Gesicht-Reiter über den Augen. Sichtbarkeit ist jetzt ein eigener Schalter
(`v2ind.on`, Standard **aus**, Schalter im Abschnitt »Indicator«), kein Nebeneffekt.

## Offen, weil es ein Bild braucht

1. **Strahltreffer** — trifft `_sheetDown` das Blatt (`paper.mesh`) an der Stelle, wo man es sieht?
   (Der Stub liefert immer einen Treffer; die Rechnung dahinter ist ungeprüft.)
2. **Panel-Abschnitt** — dass `V2CFG.pad` `_padSheetRows` rendert, ist geprüft; dass er mit einem
   Cube-Pet die Notiz statt eines Fehlers zeigt, nicht.
3. **Das Bild selbst** — dreht sich die Rolle sichtbar, liest der Riss als Riss.

**Messfalle für die nächste Runde** (steht auch im Fallen-Katalog): im Vorschaufenster ist
`document.hidden` true → rAF steht → jede Ablesung zeigt das letzte gerenderte Bild. Von Hand
ticken: `S.rolli.update(1/60)` in einer Schleife.
