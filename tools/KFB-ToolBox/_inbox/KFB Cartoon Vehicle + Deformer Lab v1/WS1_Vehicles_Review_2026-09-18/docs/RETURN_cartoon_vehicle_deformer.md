# RETURN · Cartoon Vehicle Deformer Lab

Antwort auf `_handover/CLAUDE_DESIGN_CARTOON_VEHICLE_DEFORMER_BRIEF_2026-09-17.md`.
Stand 17.09.2026. Strikt getrennt nach dem im Briefing verlangten Schema.

Werkbank: `KFB Cartoon Vehicle Deformer Lab.dc.html`. Module unter `lab-v7/`.

---

## IMPLEMENTED

**Architekturgrenze eingehalten.** Der Deformer schreibt ausschließlich in eigene
Presentation-Knoten. Er bekommt den contactRoot nur als Elternteil und hält keine Referenz, in die
er schreiben könnte — es gibt im ganzen Modul keine Zuweisung an `contactRoot.position` oder
`.quaternion`, keine Kollisionsgeometrie, kein Grip-, Drift- oder Recovery-Tuning. Knotenbaum
wörtlich wie im Briefing, mit einer Ergänzung: **die Räder hängen am responseRoot, nicht am
shellRoot.** Sie folgen dem Schräglauf, aber nicht dem Nicken und nicht der Stauchung. Ein Rad,
das mit der Karosserie kippt, hebt sichtbar von der Straße ab.

**KISS statt Vertex-Shader.** Nested Groups, bounded non-uniform scale, Offsets, gedämpfte
Springs. Kein Softbody, kein Lattice, kein Shader.
Das ist eine bewusste Abkehr von meiner eigenen Vorarbeit: `lab-v7/cardeform.v1.js` verbog die
Karosserie im Vertex-Shader. Die Datei bleibt liegen, wird aber nicht mehr benutzt. Preis der
Umstellung: die Bananen-Biegung (Querversatz über s² längs der Fahrtrichtung) lässt sich mit
Gruppen nicht bauen und ist entfallen. Sie stand in keinem Kanal des Briefings. Gewinn: planierte
Räder und ein Fixture-Wechsel, der keinen Uniform-Zustand mitschleppen kann.

**Signale.** Kontinuierlich `speed, longAccel, lateral, bank, drift`; Ereignisse
`railImpact({side, strength})` und `landing({strength})`. Teilmengen sind erlaubt. Jeder Eingang
geht durch einen Endlichkeitsfilter — ein NaN aus der Telemetrie kann das Rig nicht vergiften.

**Springs** mit den Parametern aus dem Briefing: amplitude (`cap`), frequency, damping, attack,
release, overshoot cap. Attack und release sind getrennt, weil eine Last, die schnell aufbaut und
langsam abfällt, als Gewicht liest, während gleiche Zeiten als Feder lesen. Große `dt` werden in
Teilschritte von 1/240 s zerlegt; ohne das explodiert der Integrator beim Tab-Wechsel.

**Priorität statt Multiplikation.** `impact > drift/load > speed bias > idle`. Die Ursachen werden
gegeneinander gedämpft (`loadScale`, `speedScale`), nicht miteinander verrechnet — sonst hebt ein
gleichzeitiger Drift den Einschlag auf.

**Drift ist anders als Kurve, nicht stärker.** Im Drift tritt die Seitenlast um 45 % zurück, dafür
kommen sichtbarer Yaw und Gegenroll (`driftRoll`). Gemessen an car_hatchback: LEFT LOAD ergibt
Roll ohne Yaw, DRIFT LEFT ergibt Yaw −7,25° mit Gegenroll +1,25°.

**Kontakt-Latch für Rail-Impacts, ohne Sonderwissen.** `railImpact` darf je Frame gerufen werden.
Aufrufe innerhalb von `retriggerMs` gelten als derselbe Kontakt: ein Impuls, dann eine gehaltene
Schräglage, dann ein Aufrichten beim Loslassen. `railRelease()` beendet sofort, sonst löst ein
Wachhund nach 60 ms.

Das brauchte drei Anläufe, zwei davon falsch gebaut und einer davon falsch gemeldet:
1. **Reiner Cooldown** (`retriggerMs: 140`). Ein Cooldown kennt nur »zu früh«, nicht »noch
   derselbe Kontakt«: 600 ms Wandkontakt ergaben gemessene **fünf** Einschläge — und ich hatte
   »genau ein Einschlag« berichtet. Serie `[… 0,537 → 1, 0,808 → 1, 0,907 → 1, 0,946 → 1 …]`.
2. **Latch hinter `contact: true`.** Der Latch hielt, aber nur für Aufrufer, die das Flag kannten.
   Die in dieser Datei dokumentierte flaglose Form ergab weiterhin **drei** Einschläge — die Naht
   führte also direkt in den Fehler zurück, den sie behoben haben sollte.
3. **Latch als Regel.** Jetzt ist der Dauerkontakt der Normalfall und das Flag nur eine
   Absichtserklärung. Ein Aufrufer, der jeden Frame meldet, kommt ohne Sonderwissen richtig heraus.

Belegt wird das über den eigenen Amplituden-Messwert: er fällt bei einem gedämpften Schwinger
monoton, jeder Wiederanstieg ist also beweisbar ein neuer Impuls.

**Vier Profile** in `lab-v7/deformer-profiles.json` mit den Briefing-Parametern (`massFeel`,
`squashAmount`, `stretchAmount`, `pitchResponse`, `rollResponse`, `driftYawResponse`,
`impactResponse`, `springFrequency`, `springDamping`, `secondaryLag`). `massFeel` wirkt
ausschließlich auf die Trägheit der Springs.

**Zwölf deterministische Testsequenzen** in `lab-v7/TEST_SEQUENCES.json`: die elf Knöpfe aus dem
Briefing plus `RAIL HOLD` (Retrigger-Test) und `NEUTRAL` (Ruhe-Test). Jede nennt ihren erwarteten
Read und endet im Ruhezustand.

**Sekundärbewegung** ist als Schnittstelle da: `addSecondary(node, {depth, axis, gain})`, eigener
Spring je Teil, Spitze laggt stärker als Basis (`0.6 + 0.8 × depth`). Kein permanentes Sinusflattern
— ohne Ursache steht das Teil still. Für FrizzleBobs Ohren ist damit die Naht gelegt, aber kein Ohr
angeschlossen.

**Fahrer.** `seatAnchor → driverRoot` mit eigenen, langsameren Springs. Das Nachziehen entsteht aus
der Frequenzdifferenz, nicht aus einer Verzögerungsleitung.

---

## STATIC TESTED

- **43 Fixtures** aus zwei Quellen, jede Zeile mit Herkunft: 25 aus Georgs Handoff
  (`kfb.asset-handoff.v1`, sourceCommit `10a7fdce6b`), 18 aus dem Registry (`34cde3f8f7`).
  Adressen und Bytes sind aus den JSONs generiert, nicht getippt.
- Der Handoff sagt selbst, was er ist: `selectionStatus: candidate-only`,
  `suitabilityDecision: owned-by-receiving-consumer`. Die Liste ist eine Kandidatenliste.
- Profilzuordnung je Gruppe statisch gesetzt, nicht abgestimmt.

---

## BROWSER TESTED

Gemessen an `car_hatchback` (4 Räder aus benannten Knoten, r 0,072, Spur 0,35, Radstand 0,50):

| Test | Befund |
|---|---|
| ACCEL | Nase hebt, Fahrer laggt |
| BRAKE | Nicken −2,45°, Längskompression −1,8 % |
| LEFT/RIGHT LOAD | Roll ohne Yaw, spiegelbildlich |
| DRIFT LEFT | Yaw −7,25°, Gegenroll +1,25°, Seitenlast reduziert |
| RAIL HIT L/R | Stauchung folgt der Wandseite |
| RAIL HOLD | ein gesättigter Einschlag → monotoner Abfall auf 0,018 → ein Übergang beim Loslassen (0,745 → 0). Kein zweiter Schlag; vorher fünf. Der Ausschlag am Ende ist das Aufrichten: das Ziel springt beim Kontaktende, der Wert läuft ihm nach — kein Impuls |
| LANDING | dominant `impact`, Squash → Rebound → ein Settle |
| HIGH SPEED | dominant `speed bias`, Nicken −0,35 °, Squash 1,1 % |
| NEUTRAL | impact 0,00 über zwei Sekunden, sichtbar ruhig |
| RESET | alle Springs exakt null, Knoten auf Identität |
| Fixture-Swap | `dispose()` wirft die Knoten weg statt sie zurückzusetzen — kein Spring-Zustand wandert mit |

Weitere geladene Fixtures: `car_sedan`, `car_stationwagon`, `vehicle-monster-truck` (HEAVY_FUTURE),
`Taxi by Poly by Google`, `Skateboard by Poly by Google`.

**Drei Messfehler, die dabei gefunden und behoben wurden.** Sie stehen hier, weil sie zeigen, wo
die Zahlen belastbar sind und wo sie es vorher nicht waren:

1. **Impact-Gewicht aus der Geschwindigkeit** (`|vel| / 40`). Doppelt falsch: zu klein skaliert,
   und im Moment der größten Stauchung ist die Geschwindigkeit null. Ein voller Landeschlag meldete
   sich als »speed bias«.
2. **Dann aus der absoluten Amplitude.** Richtig über den Schlag hinweg, aber zwei Sekunden
   Neutralfahrt standen auf `impact 0,10`, weil die ruhende Auslenkung mitgezählt wurde.
   Jetzt zählt die Abweichung **vom Ziel**: ein Spring auf seinem Ziel hat keine Ereignis-Energie.
3. **Räder aus Namen statt aus Form.** `raceCarRed` meldete 12 Räder, weil Felge, Reifen und Nabe
   je einzeln »wheel« heißen. Jetzt gilt die Formprüfung in beiden Wegen und koaxiale Teile werden
   verschmolzen: 4 Räder.
4. **Eine Scheibe ist noch kein Rad.** Der Poly-Police-Car meldete 15 Räder — und weil die
   Türplatte als Rad geriggt wurde, **rotierte die Tür bei ACCEL mit**. Das war der schlimmste der
   vier Fehler: nicht eine falsche Zahl, sondern sichtbar falsche Bewegung. Drei gemessene
   Bedingungen kamen dazu: ein Rad hat ein GEGENSTÜCK auf der anderen Seite bei gleichem z und
   gleichem Radius, es hat BODENKONTAKT auf derselben Höhe wie die anderen, und es hat die GLEICHE
   GRÖSSE (±35 % um den Median). Police Car 15 → 4, Wagon 10 → 4.
5. **Die Kamera sprang mit der Blickrichtung.** Ihre z-Lage war mit `facing` multipliziert, also
   wurden die toy-cars nach rechts gezeigt und alle anderen nach links. Die Blickrichtung ist eine
   Eigenschaft des Modells, kein Grund den Betrachter umzusetzen.
6. **Feste Near/Far-Ebenen schnitten große Modelle ab.** 0,01/200 gegen Modelle zwischen 0,5 und
   43 Einheiten. Jetzt aus der Hülle abgeleitet.
7. **Vier Orientierungen reichten nicht.** Der Schalter drehte nur um die Querachse; Assets, die
   auf der Seite liegen, blieben unheilbar. Jetzt sechs achsenparallele Lagen.

---

## VISUALLY ACCEPTED BY GEORG

Nichts. Keine der Zahlen ist abgestimmt, kein Profil freigegeben. Die Startbereiche stammen aus dem
Briefing, nicht aus einem Urteil.

---

## OPEN / UNRESOLVED

**A · KayKit ActionFigure / Rig_Medium fehlt.** Briefing-Fixture 3 (Skateboard + Rider) ist nicht
baubar. Im Handoff-Satz (141 Assets) kein Treffer auf `rig_medium|actionfigure`. Nächstliegende
gerigte Figuren: `Astronaut_*` (43 Joints, 18 Clips) und `Mech_*` (13 Joints, 17 Clips) — beide
keine ActionFigure. Die Rider-Kette (hips → knee → torso → head) ist im Profil
`BOARD_RIDER_LIGHT` angelegt und ohne Rider nicht abnehmbar.

**B · Skateboard findet keine Räder.** `0 Räder (none)` — das Modell ist ein verschweißtes
Einzelnetz, die Inseltrennung kann es nicht zerlegen. Die Board-Roll-Kette läuft trotzdem (sie
braucht keine Räder), aber es gibt keine Radaufstandsmessung; der Nullpunkt liegt auf der
Netzunterkante statt auf der Rollenunterkante.

**C · Poly-by-Google-Assets sind Z-up.** Der Taxi richtet sich über den gemessenen `upFix` auf
(Hülle höher als lang → einmal um die Querachse). Beim **Go-Kart greift die Messung nicht**: das
Modell ist 33,9 hoch gegen 39,5 lang, liegt nach der Hüllbox also flach und steht trotzdem auf der
Nase. Eine Hüllbox kann das nicht von einem legitim hohen Mech unterscheiden. Darum hat die
Werkbank einen `Orient`-Knopf (90°-Schritte um die Querachse), der sich je Fixture merkt.
**Der Go-Kart braucht diese Einstellung einmal von Hand.**

**D · Maßstäbe klaffen um Faktor 100.** car_hatchback hat Radstand 0,50, der Poly-Taxi 37,1. Für
den Deformer ist das gleichgültig (alles rechnet in Anteilen der gemessenen Fahrzeugmaße), für eine
gemeinsame Strecke nicht.

**E · Die Insel-Radsuche zählt an dichten Modellen noch zu viel.** Nach der Paar-Regel (siehe
unten) meldet der Poly-Police-Car 4 statt 15, der Wagon 4 statt 10 — aber `Kart by Ben Harrison`
noch 6 mit Radstand 0,00, weil dort sechs Scheiben auf derselben z-Lage liegen. Für den Deformer
ohne Folge (er rechnet in Anteilen der Hülle, nicht im Radstand), für eine Federung je Achse nicht.

**F · HEAVY_FUTURE und MECH_FUTURE sind nur Profilstruktur.** An keinem Fixture abgestimmt, wie im
Briefing vorgegeben. Für MECH_FUTURE ist außerdem kein Mech-Fixture in der Liste.

**G · Kein Ton, kein VFX, keine Kamera.** Nach KFB-Motion-Skill §15 zuerst die Choreografie.

**H · Race-Telemetry-Adapter läuft synthetisch, nicht echt.** `window.__cvd.setSignals(…)` nimmt
den v0.7-Satz an, aber gegen den echten Runtime ist nichts gelaufen. Die Signalnamen sind aus dem
Entwurf übernommen und nicht als Vertrag behandelt — der Entwurf ist ausdrücklich nicht
eingefroren.

---

## Naht zum Race-Runtime

```js
window.__cvd.setSignals({ speed, longAccel, lateral, bank, drift });  // kontinuierlich, je Frame
window.__cvd.railImpact({ side: -1 | 1, strength: 0..1 });            // Wand: je Frame melden
window.__cvd.railRelease();                                           // Wand verlassen (optional)
window.__cvd.landing({ strength: 0..1 });                             // Ereignis
window.__cvd.run('DRIFT LEFT');   // Testsequenz
window.__cvd.reset();             // exakt neutral
window.__cvd.readout();           // { dominant, impactWeight, pose }
window.__cvd.nodes();             // { contactRoot, responseRoot, shellRoot, seatAnchor, driverRoot, secondary }
```

**`railImpact` darf je Frame gerufen werden.** Aufrufe, die dichter als `retriggerMs` (Vorgabe
140 ms) aufeinander folgen, gelten als DERSELBE Kontakt: ein Impuls, danach eine gehaltene
Schräglage. `contact: true` macht das nur ausdrücklich, es schaltet nichts ein. `railRelease()`
beendet den Kontakt sofort; ohne Aufruf löst ein Wachhund nach 60 ms ohne Meldung.
Kehrseite, benannt statt versteckt: zwei echte Einschläge innerhalb von 140 ms verschmelzen zu
einem. Wer sie getrennt braucht, ruft `railRelease()` dazwischen.

Was Race liefert, sind Fakten. Was dieses Modul daraus macht, ist eine Deutung. Die Deutung
überschreibt die Fakten an keiner Stelle.

## Dateien

| Datei | Rolle |
|---|---|
| `lab-v7/vehicle-cartoon-deformer.v2.js` | der Deformer: Knotenbaum, Springs, Kanäle, Priorität |
| `lab-v7/deformer-profiles.json` | vier Profile, Tuning-Vorschlag, nicht eingefroren |
| `lab-v7/TEST_SEQUENCES.json` | zwölf deterministische Sequenzen mit erwartetem Read |
| `lab-v7/fixture-adapters.v2.js` | 43 Fixtures, Herkunft je Zeile, offene AssetRefs, Facing- und Orient-Speicher |
| `lab-v7/carrig.v1.js` | Vermessen und Riggen: Inseln, Radsuche, Aufrichten, Radaufstandspunkt |
| `KFB Cartoon Vehicle Deformer Lab.dc.html` | die Werkbank |
| `lab-v7/cardeform.v1.js` | **überholt.** Shader-Fassung, durch v2 ersetzt, bleibt als Nachweis liegen |
| `lab-v7/fixtures.v1.js` | **überholt.** Keyframe-Fixtures, durch signalgetriebene Sequenzen ersetzt |
