# ONBOARDING · frischer Chat · Fahrzeug- und Fluglinie

*Für den Chat, der DIESE Linie fortsetzt. Fünf Minuten lesen, dann kannst du arbeiten.*

## Lies in dieser Reihenfolge
1. `CLAUDE.md` — Arbeitsweise und zwei Fallen, in die diese Linie schon gelaufen ist.
2. `LIVING_VEHICLES.md` — das Stand-Dokument. Entscheidungen V1–V22, jede mit Grund.
3. `SPRINTS.md`, `TODO.md`, `BACKLOG.md` — was ansteht, was offen ist, was warten muss.
4. `PLAN_flight_deformer.md` — die nächste Ausbaustufe, falls S2 durch ist.
5. `CHANGELOG.md` nur bei Bedarf: es ist die Zeitachse, nicht die Begründung.

## Was gebaut ist, in einem Satz
Eine Werkbank (`KFB Cartoon Vehicle Deformer Lab v2.dc.html`), die 61 Fahrzeuge lädt, ihre
Räder MISST, einen gruppenbasierten Cartoon-Deformer plus vier Motion-Familien darauf legt und
23 deterministische Sequenzen abspielt — dazu ein Flug-Tab mit 10 deklarierten, aber
unbewegten Fixtures.

## Die fünf Regeln, die hier wirklich gelten
1. **Gemessen statt geraten.** Eine Zahl ohne Messung kommt nicht ins Rig. Wer eine Größe
   ableitet, belegt ihre SPANNE, nicht einen Punkt (V16).
2. **Die Strecke besitzt Physik, die Werkbank die Sicht darauf.** Keine zweite Fahrphysik.
   Die Naht ist `window.__cvd.setSignals(...)`, und sie ist einseitig.
3. **Räder werden gefunden, nicht erfunden.** Findet die Paar-Regel nichts, steht 0 im Bericht.
4. **Eine Abnahme an einem Fahrzeug ist keine Abnahme** (V13). Jede neue Familie wird über
   mindestens sechs Fixtures abgetastet, darunter die Ausreißer nach oben und unten.
5. **Neue Modulfassung heißt `.vN.js`, Import mit Abrufstempel `?r=N`.** Eine überschriebene
   Datei bleibt im Zwischenspeicher liegen und die Seite läuft still mit der alten.

## Wie du etwas beweist
In der Bühne gilt nur eine echte Pixelaufnahme — ein DOM-Nachzeichner bildet WebGL nicht ab.
Griffe dafür liegen auf `window.__cvd`: `paint()`, `stepMs(ms)`, `scrubTo(ms)`, `ticks()`,
`seqState()`, `camState()`, `measured()`. In einem unsichtbaren Rahmen hält der Browser
`requestAnimationFrame` an — ohne eigenen Bildstempel beweist eine Aufnahme nichts.

## Die Dateien, die du anfasst
```
lab-v7/fixture-adapters.v3.js      Fixture-Liste (importiert v2, hängt an). Hier kommen Assets rein.
lab-v7/carrig.v2.js                Messen und Riggen: Inseln, Radsuche, Backen, WheelRig.
lab-v7/vehicle-cartoon-deformer.v2.js   Pose: Squash, Stretch, Twist. Gruppen, keine Shader.
lab-v7/vehicle-{fishtail,manoeuvre,twowheel,tumble}.*.js   Die vier Motion-Familien.
lab-v7/deformer-profiles.json      Sechs Profile. HIER landen die Zahlen aus der Sichtabnahme.
lab-v7/TEST_SEQUENCES.json         23 Sequenzen als Signalverläufe, keine Posen.
KFB Cartoon Vehicle Deformer Lab v2.dc.html   Die Oberfläche.
```
**Nicht anfassen:** `lab-v2/vendor/` (WS0), `fixture-adapters.v2.js` (trägt drei Runden
gemessener Zahlen — v3 hängt an, statt zu ersetzen).

## Wo du anfängst
An **S2** in `SPRINTS.md`: die Sichtabnahme. Sie blockiert jede Profilzahl. Wenn Georg dafür
keine Zeit hat, ist **S3** (Rad-Paar-Regel an `rover-round`) der einzige Punkt, der ohne ihn
vorangeht.
