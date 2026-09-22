# Postmortem R08 Vorratskeller · Fail

Georgs Befund (Screenshot, S22): Treppe steht schräg und frei im Raum statt flach an der Wand
zu enden, mehrere Requisiten (Kerzen auf dem Fass, Fläschchen daneben) schweben sichtbar über
ihrer Unterlage. Zwei vorherige Runden hatten bereits Grundrissfehler (falsche Wandseite für Tür
und Treppe, Steinformation statt Pfeiler) — das ist die DRITTE Korrekturrunde für denselben Raum.
Das ist ein Muster, kein Einzelfehler, und wird deshalb hier dokumentiert statt sofort weiter
gepatcht.

## Was falsch war

1. **Treppe frei rotiert statt flach an der Wand.** `stairs_wood` bekam `rot: 250` und eine
   Position im offenen Raum, damit sie "zur Ecke zeigt" — geraten, nicht aus der Vorlage
   abgelesen. Im Promobild endet die Treppe GERADE an der Wand, Laufachse parallel zu einem
   Wandzug, kein Freiwinkel. Eine Treppe ist kein Möbelstück, das man in eine Lücke dreht; sie
   ist ein Bauteil mit einer Laufrichtung, und die muss aus dem Grundriss folgen (90°-Vielfaches,
   Anker an der Wandfläche), genau wie bei den Wandteilen selbst.
2. **Requisiten auf Requisiten ohne geprüfte Auflage.** Kerzen/Fläschchen mit `auf: 'fass_gross'`
   wurden mit einer geschätzten `pos` gesetzt, ohne den gemessenen Bodenkontakt der Unterlage
   (Fassdeckel-Höhe, Radius) zu prüfen. Ergebnis: sichtbarer Spalt zwischen Fass und Aufsatz.
3. **Ursache hinter beiden Punkten:** Positionen wurden aus der Bild-KOMPOSITION geschätzt
   („sieht am Bild richtig aus"), nicht aus einer Messung der jeweiligen Bauteil-Box abgeleitet.
   R02/R07 hatten dieselbe Versuchung und sind ihr nicht gefolgt — R08 ist ihr gefolgt, dreimal
   in Folge, weil jede Korrekturrunde nur den zuletzt gemeldeten Fehler behoben hat, nicht die
   Methode dahinter.

## Zwei Regeln, ab jetzt hart

**R1 · Lange/asymmetrische Bauteile (Treppe, Regal, Bank) stehen achsparallel an einer Wand,
nie frei rotiert.** Rotation ist ein Vielfaches von 90°, Anker ist die Wandfläche (wie bei jedem
Wandrequisit), Laufrichtung folgt der Wand, an die das Teil lehnt — nicht dem Blick auf das
Referenzbild.

**R2 · Kein Objekt ohne geprüften Bodenkontakt.** Jede Requisite steht auf dem Boden
(`y = -box.min[1]`) oder auf der GEMESSENEN Oberkante einer Unterlage (`auf`-Mechanik, `top`).
Vor dem Screenshot: pro Stapel eine Sichtprüfung, ob ein Spalt zwischen Unterlage und Aufsatz
sichtbar ist — das ist keine Ermessensfrage, das ist ein Ja/Nein am Bild.

## Fail Nr. 2 (selbe Sitzung, nach dem ersten Fix-Versuch)

Georgs Anweisung war klar: Treppe korrigieren UND jedes Objekt vernünftig absetzen. Beide
"Fixes" der ersten Runde waren selbst wieder falsch:

- **Kronenkerzen weiter in der Luft.** `y: 'krone'` traf die Höhe (`kit.WALL_H`, gemessen,
  korrekt) — aber `pos` lag bei z≈0,3, und die Rückwand-Fuge liegt bei z=−2
  (`mid = r − 0,5`, Modulmitte × MOD). Die Kerzen standen zwei Meter VOR der Wand, über dem
  offenen Raumboden, nur eben auf Wandkronenhöhe angehoben — sichtbar schwebend im Nichts.
  Fehlerklasse: Höhe gemessen, Grundriss-Koordinate weiter geraten. Gefixt durch Nachrechnen der
  tatsächlichen Fugenmitte statt einer geschätzten Zahl.
- **Treppe falsch rotiert UND nicht in der Eckzelle.** Stand in Modul c=4 statt c=5 (der
  tatsächlichen Eckzelle) und mit `rot: 90` in einer Richtung, die nicht zur Wand passte.
  Der erste Korrekturversuch (`rot: 270`) hat das Bauteil nicht gespiegelt, sondern in eine
  völlig andere, unbrauchbare Ansicht gedreht (flacher Streifen auf der Wandkrone) — ein Beleg,
  dass `stairs_wood` nicht symmetrisch unter 180° ist und Rotation an diesem Teil PROBIEREN,
  nicht ANNEHMEN, verlangt. `rot: 180` ergab eine dritte falsche Ansicht (Block statt Treppe).
  Erst `rot: 90` mit korrigierter Zellposition (c=5) zeigte die Treppe richtig: Stufen sichtbar,
  endet flach an der Wandkrone in der Ecke.

## Regel-Ergänzung

**R3 · Rotation eines neuen, ungemessenen Bauteils wird DURCHPROBIERT (0/90/180/270) und per
Screenshot verglichen, nie aus der vorigen falschen Rotation um 180° weitergerechnet.** „180°
verdreht" ist eine Bildbeobachtung, keine Formel — das Bauteil kann unter Rotation asymmetrisch
reagieren (siehe `stairs_wood`), und nur der Screenshot entscheidet, welcher der vier Werte
stimmt.

## Fail Nr. 3 · Abbruch (Georgs Entscheidung)

Nach dem dritten Korrekturversuch: Treppe steht immer noch falsch (nicht begehbar ausgerichtet,
nicht in der Ecke), das freistehende Innenteil (`wall_doorway_sides`-Vermutung) ist falsch, die
Bodenplatte selbst ist falsch. Georgs Befund: „Bastelzirkus" — drei Runden Screenshot-Fixversuch
haben den Raum nicht auf einen sauberen Stand gebracht. **R08 gilt als NICHT abgenommen,
Bau-Versuch abgebrochen.** Kein weiterer Korrekturversuch in dieser Betriebsart.

Ursache übergreifend über alle drei Runden: jede Korrektur hat einen EINZELNEN gemeldeten Fehler
behoben (Position, dann Rotation, dann wieder Position), nie die Methode — Koordinaten und
Rotationen für neue, ungemessene Bauteile (`stairs_wood`, `wall_doorway_sides`) wurden weiter aus
der Bildkomposition geraten statt aus dem Grundriss oder einer Messung abgeleitet. Vier
Rotationswerte durchprobiert (90/180/270/90 erneut), keiner davon aus einer Messung, alle aus
„sieht am Screenshot ungefähr richtig aus". Das ist exakt das Muster, das R1–R3 verhindern
sollten, und es ist trotz der Regeln wieder passiert, weil die Regeln nur für KÜNFTIGE Bauteile
formuliert waren, nicht rückwirkend auf `stairs_wood` angewendet wurden.

## Fail Nr. 4 · R03, gleiches Muster in neuem Code

Georgs Befund per Screenshot (nicht per Prüfzeile — die zeigte 0 Überlappungen und schwieg):
Brüstung stand verzogen/verbogen statt als gerade Linie, Galerie-Requisiten wirkten ohne
sichtbaren Boden. Ursache: der Entzerrer (Kollisions-Push für Requisiten) kannte keinen
Unterschied zwischen einem Fass, das verschoben werden DARF, und einer Brüstung, die an ihrer
Rezept-Position stehen MUSS — `barrier`/`barrier_corner` kollidierten mit der Treppe und
untereinander und wurden bis zu 2,6 Einheiten verschoben, bevor sie gerendert wurden. Die
Prüfzeile meldete das nicht, weil sie nur zählt, ob am ENDE noch etwas überlappt — nicht, ob ein
Architekturteil von seiner beabsichtigten Position weggeschoben wurde.

Fix: neues `p.fest`-Flag (Architektur, keine Requisite) — der Entzerrer und die Wandklemmung
lassen `fest`-Teile unberührt, und die abschliessende Überlappungszählung ignoriert
Fest-gegen-Fest-Paare (ein Eckpfosten DARF die beiden Brüstungsläufe berühren, das ist die Fuge,
kein Fehler). `stairs_wood` und alle `barrier`-Teile in R03 sind jetzt `fest: true`.

Dasselbe Muster wie Fail 1–3: ein System, das für lose Requisiten richtig ist (Entzerrer,
Wandklemmung), wurde ungeprüft auf ein neues Bauteilklasse (Architektur auf einer zweiten Ebene)
angewendet. Die Lehre ist wieder dieselbe — ein neues Bauteil/eine neue Mechanik verlangt eine
eigene Prüfung, nicht die Annahme, dass die alte Prüfung automatisch mitgilt.

## Weg nach vorn: kein weiterer Freihand-Versuch

Georgs Entscheidung: kein Weiterbauen von Hand. Nächster Schritt ist der **3D-Editor** — Teile
werden nicht mehr aus geschätzten Koordinaten im Rezept gesetzt, sondern von Hand im Raum
platziert und dort belassen (anfassen, ziehen, absetzen), damit falsch stehende Treppen/Requisiten
direkt sichtbar und korrigierbar sind, statt über Zahlenraten in mehreren Screenshot-Runden.

**Bereits vorhanden, geprüft (S22):** `KayKit_Room_Study_S21.html` hat schon einen
Inline-3D-Editor — `TransformControls` (three.js), Knöpfe „Editor / Verschieben / Drehen /
Gruppe / Raster / Absetzen", Klick aufs Objekt greift das Gizmo, „Absetzen" setzt die
Unterkante exakt auf den Boden (`Box3` gegen `y=0`), Handkorrekturen landen in
`localStorage['kfb-s21-editor']` als Patch pro Raum (nicht im Rezept selbst — „Vorschlag,
keine zweite Wahrheit"). Das ist bereits das Werkzeug, das Georg für R08 fehlte. Es war für
diesen Raum nicht im Einsatz, weil alle Korrekturen über Rezept-Koordinaten liefen statt über den
Editor direkt im Raum.

## Status R08

**Abgebrochen, nicht abgenommen.** Grundriss/T-Pfeiler/Treppe bleiben im aktuellen (falschen)
Zustand stehen, bis der 3D-Editor-Workflow für Hand-Platzierung steht. Kein weiterer
Rezept-Koordinaten-Versuch für diesen Raum.

## Nebenbefund: 3D-Editor gehört in die zentrale Toolbox, nicht in jede Rezept-Seite einzeln

Georgs Entscheidung nach dem R08-Abbruch: der Weg nach vorn ist Handplatzierung im 3D-Editor statt
Rezept-Koordinaten raten. Aber der Editor, der dafür gebraucht wird (`TransformControls`,
Verschieben/Drehen/Gruppe/Raster/Absetzen/Kollisionsfrei, JSON-Ablage-Export/Import), sitzt
aktuell fest in `KayKit_Room_Study_S21.html` — eine Kopie pro Seite, die bei jedem neuen Nachbau
erneut eingebaut oder abgeschrieben werden müsste.

**Deliverable, nicht verlieren:** dieses Editor-Werkzeug gehört als EIGENE, zentrale Komponente in
die Toolbox (Kandidat: eigenes `lib/`-Modul oder ein Starter analog zu `tweaks_panel.jsx` /
`three_d_stage.js`), die jede Raum-Seite importiert, statt es lokal zu duplizieren. Umfang, den
S21 bereits bewiesen hat und den die zentrale Fassung mitnehmen muss:
- Gizmo-Modi Verschieben/Drehen, Einzelteil vs. Bedeutungsgruppe,
- Raster-Snap (0,1 / 15°), „Absetzen" (Unterkante auf Y=0),
- „Kollisionsfrei" (AABB-Push gegen Wand/Ecke/Endstück/Requisit, mehrere Durchgänge),
- Patch-Ablage pro Raum in `localStorage`, plus roher JSON-Export/Import zum Sichern/Teilen,
- Rezept-Code-Export (`Patch kopieren`) für den Weg zurück in die Quelle.

Noch NICHT gebaut: die zentrale, seitenübergreifende Fassung selbst — das ist der nächste
Schritt, sobald mehr als eine Seite den Editor braucht. Für R09 läuft der Bau vorerst noch über
Rezept-Koordinaten wie gewohnt (der Editor ersetzt das erst, wenn er zentral steht), diesmal mit
den Regeln R1–R3 UND einer Screenshot-Probe für jede neue, ungemessene Rotation vor dem Abschluss.
