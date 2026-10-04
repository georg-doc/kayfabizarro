# PLAN · Flight Deformer (`KFB Cartoon Flight Deformer`)

*Stand 18.09.2026. Nichts davon ist gebaut. Der Flug-Tab in
`KFB Cartoon Vehicle Deformer Lab v2.dc.html` laedt und vermisst die Fixtures — mehr nicht.*

## Warum ein eigener Plan und keine sechste Motion-Familie

Die vier Bodenfamilien (Deformer, Schlingern, Zwei-Rad, Manoever) haengen ausnahmslos an
gemessenen Radgroessen: Aufstandspunkt, Spur, Radstand, Radbreite. **Gemessen am 18.09. an
zehn Flug-Fixtures: alle melden 0 Raeder.** Damit hat keine der vier Familien einen Anker.
Eine Familie, die trotzdem laeuft, waere eine Bewegung ohne Ursache — deshalb haengt der
Flug-Tab beim Laden ausdruecklich KEINE Bodenfamilie an.

## Was ein Flugkoerper stattdessen hergibt

| Groesse | Woraus | Wofuer |
|---|---|---|
| Spannweite | Huellbox x nach dem Aufrichten | Rollrate, Flaechenlast, Wankradius |
| Rumpflaenge | Huellbox z | Nickrate, Kameraabstand |
| Fluegelebene | y-Lage der breitesten x-Schicht | Drehpunkt der Rollbewegung, nicht die Bodenmitte |
| Schwerpunkt der Huelle | Volumenmittel der Teilnetze | Drehpunkt in Nicken und Gieren |
| Schub-Achse | Blickrichtungsschalter (wie am Boden) | Vorzeichen von Beschleunigung und Kondensstreifen |

Alles mit derselben Regel wie bisher: **gemessen oder gar nicht.** Was das Modell nicht hergibt,
wird ein Schalter mit Gedaechtnis (Flip, Orient) — keine Heuristik.

## Die drei Schnitte

**S1 · Lage (Rollen, Nicken, Gieren).** Eine Gruppe, Drehpunkt Schwerpunkt der Huelle,
Rollachse in der Fluegelebene. Bank folgt der Kurve als ABGELEITETE Groesse: Querbeschleunigung
= g · tan(Rollwinkel), Kurvenradius = v² / a — dieselbe Ableitung wie im Einspurmodell der
Manoeverfamilie, nur ohne Reifen. Wer einen Rollwinkel setzt, bekommt die Kurve; wer eine Kurve
setzt, bekommt den Rollwinkel. Kein zweiter Regler.

**S2 · Form (Deformer, unveraendert).** Squash, Stretch und Twist haengen an Signalen, nicht an
Raedern. `vehicle-cartoon-deformer.v2.js` laesst sich anhaengen, sobald S1 die Gruppe liefert.
Neues Profil `FLIGHT_LIGHT`: ein Rumpf liest steifer als eine Karosserie, also kleinere Grenzen
fuer Squash und groessere fuer Twist (Fluegel als Nachlauf). Werte werden an mindestens sechs
Fixtures abgetastet (V13), darunter die Ausreisser Papierflieger (0,12 u) und
Spaceship Rae (9,9 u).

**S3 · Ereignisse.** Boe, Einschlag, Abfangen, Aufsetzen. Jedes setzt einen Spring-Impuls, nicht
eine Pose (Q3). Offene Entscheidung: ist eine Landung ein `landing()` im Sinne der Bodenlinie
oder ein eigenes Ereignis? Solange Fahrwerk und Aufstandspunkt fehlen, spricht alles fuer ein
eigenes.

## Die Bruecke Fahren → Fliegen (ohne neue Geometrie)

Das Rad-Rig hat je Rad drei geschachtelte Gruppen: `steer` (y) → `susp` (y-Versatz) →
`spin` (x). Eine Drehung von `steer` um **z** um 90° stellt die Radachse von quer auf
senkrecht: die Scheibe liegt waagerecht und dreht um die Hochachse — ein Rotor.
`susp.position.y` senkt sie unter den Aufbau. EIN Faktor 0…1 fuehrt Klappwinkel, Fahrhoehe und
Schubneigung gemeinsam. Damit ist der Uebergang fliessend und braucht kein zweites Modell.
Kandidaten mit Raedern UND Hover-Read: `spacetruck`, `spacetruck_large`,
`spacetruck_trailer` (in `fixture-adapters.v3.js` als `HOVER_CANDIDATES` gefuehrt).

## Fixtures · gemessen am 18.09.

Zehn Zeilen, `FLIGHT_GROUPS` in `lab-v7/fixture-adapters.v3.js`. Alle geladen, alle 0 Raeder,
alle Pfade aufloesbar.

| Fixture | Herkunft | Bytes |
|---|---|---|
| Airplane A · Poly by Google | handoff animation-lab @ 29aac106 | 377 648 |
| Airplane B · Poly by Google | handoff | 236 484 |
| Low poly Fighter · Stephen Graybill | handoff | 10 660 |
| **Paper Plane · Anonymous** | **repo, byteweise geprueft** | **3 216** |
| Spaceship A · Quaternius | handoff | 265 104 |
| Spaceship B · Quaternius | handoff | 188 464 |
| Spaceship Barbara / Fernando / Finn / Rae | handoff | 143–348 k |

Der Papierflieger steht NICHT im Handoff-Satz (141 Assets durchsucht). Georgs Adresse wurde am
Pfad byteweise geprueft: 3216 B @ 29aac106 — die Ordneransicht zeigt `.glb` nicht zuverlaessig
(CLAUDE.md).

## Offen, bevor gebaut wird

- **Massstaebe klaffen um Faktor 80.** Papierflieger 0,12 u Spannweite gegen Spaceship Rae
  9,95 u. Dem Deformer gleichgueltig (er rechnet in Anteilen), einer gemeinsamen Szene nicht.
- **Z-up-Verdacht bei den Poly-Modellen.** Airplane A meldet Spur 2,43 / Laenge 3,78 — plausibel,
  aber nicht am Bild geprueft. Der Orient-Schalter steht bereit, die Vorgabe ist 0°.
- **Kein VFX.** Kondensstreifen und Speedlines liegen als Vorlage im Repo
  (`travel/travel-v16/terrain-v16/speed-lines.js`, `travel/KFB Travel Globe v13-1/globe-v13/contrails.js`).
  Skill §15: erst die Choreografie.
- **Georgs Nachtrag vom 18.09., spaeter:** eine KFB-Karte im Querformat wie im Travel Globe, auf
  der ein Pet- oder Driver-Graft in Surf-Pose auf Karte, Hoverboard oder Papierflieger steht.
  Braucht die ActionFigure (offener AssetRef) und ist darum noch nicht terminierbar.
