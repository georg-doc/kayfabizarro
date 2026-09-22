# POSTMORTEM · Kamera, Sichtachse, Bruchkanten · 2026-09-22

Für Workspace A: was kaputt war, warum, und wie es gemessen wurde — nicht nur was geändert
wurde. Die CHANGELOG-Einträge desselben Datums nennen die Codestellen; hier steht die Kette
der Fehlschlüsse dahinter, damit sie sich nicht wiederholt.

## 1. Die Verfolgerkamera fuhr durch Gebäude

**Symptom:** in Kurven zeigte die Kamera Fassaden-Innenseiten statt der Strecke, ruckte, klemmte
teils unter dem Rheindeck fest.

**Ursprüngliche Lösung (falsch):** ein Kollisions-Strahl vom Fahrzeug zur Wunschlage der Kamera;
traf er etwas, wurde die Kamera 1,2 m davor zurückgezogen, minimal 3,5 m vor dem Fahrzeug.

**Warum das falsch war:** die Kamera durfte sich frei im Raum bewegen und wurde erst NACH dem
Fakt korrigiert. Jeder neue Blocker-Refresh (alle 120 Frames) konnte die Lage abrupt ändern,
und die Rückzug-Distanz war unabhängig von der Fahrsituation — das erzeugte genau das Rucken,
das gemeldet wurde.

**Fix:** das Verfahren aus FILAMENT #02 (KilledByAPixel/SP13KTRA, `code/game.js`
`updateCamera()`, gelesen — kein Code übernommen) — die Kamera wird nie „frei“ platziert. Ihre
Wunschlage wird auf die Streckenroute projiziert, seitlich in den Fahrkorridor geklemmt, in der
Höhe auf die Fahrbahn gehoben (`railClamp()` in `cologne-play.v1.js`). Sie kann dadurch
grundsätzlich nicht mehr in ein Bauwerk laufen, weil sie den Fahrkorridor nie verlässt.

**Nebenfund, der fast neue Bugs eingebaut hätte:** `Box3.setFromObject()` liefert für nie
gerenderte Objekte die LOKALE statt der Welt-Bounding-Box, wenn die Weltmatrix nicht aktuell
ist. Der neue Korridor-Schrubber (`scrubCorridor()`) hielt deshalb beim ersten Testlauf den
ganzen Kölner Dom für ein Hindernis auf der Startgeraden — behoben durch
`scene.updateMatrixWorld(true)` VOR jeder Bounding-Box-Abfrage. Diese Falle trifft jeden
nachträglichen Geometrie-Scan in three.js; hier notiert, damit Workspace A sie nicht neu entdeckt.

## 2. Die „braune Fläche vor der Unterführung" — 15+ Meldungen, ein Fehlschluss

**Symptom (Georgs Wortlaut):** eine braune/olive Fläche genau an der Trackposition vor dem
Tunnel, in die man hineinfährt.

**Erster Fehlschluss:** die Meldung wurde wiederholt als Kollisions-/Geometrie-Bug behandelt
(Gebäude im Fahrkorridor, Pfeiler falsch eingezogen, verschmolzene Netze). Jede dieser Ursachen
wurde geprüft und mehrfach behoben — `city.pierSkipped`, `scrubCorridor()`, Punkt-in-Polygon
für Gebäude — und jedes Mal blieb die Fläche im Bild.

**Der eigentliche Befund, diesmal per Raycast durch die exakte Bildkoordinate aus Georgs
Screenshot gemessen, nicht vermutet:** an der Stelle, wo die Fläche erscheint, meldet
`scrubCorridor()` **null** Treffer — der Fahrkorridor ist dort tatsächlich frei, das Fahrzeug
berührt nichts. Der Raycast durch die Bildmitte trifft statt einer Kollision den **westlichen
Pfeiler der Hohenzollernbrücke**, 90–145 m entfernt, aber optisch zentriert, weil die Gerade
Tunnelmund → Tunnelausfahrt fast genau auf ihn zeigt.

**Warum das so lange unentdeckt blieb:** die Prüfwerkzeuge (Korridor-Schrubber, Punkt-in-
Polygon, Pfeiler-Check) beantworten alle dieselbe Frage — „berührt die Fahrbahn ein Hindernis?"
— und die Antwort war korrekt: nein. Die tatsächliche Frage war eine andere: „steht ein
Bauwerk optisch in der Sichtachse einer geraden Strecke, ohne die Fahrbahn je zu berühren?"
Dafür gab es kein Werkzeug — das Fehlen einer Sichtachsen-Prüfung, nicht ein Kollisions-Bug,
war die Lücke.

**Fix:** `buildGeniusLoci()` verlangt für die Hohenzollernbrücke jetzt 45 m statt 14 m
Korridor-Abstand (der Versatz-Deckel wurde von 30 auf 70 m angehoben, damit der
Größenreduktions-Hebel nicht greifen muss). Die Brücke bleibt in Originalgröße und rückt 32 m
seitlich — der Pfeiler steht danach als Silhouette am Bildrand, nicht mehr zentriert im
Fahrweg. Das ist eine GEOMETRISCHE Verschiebung, keine Sichtbarkeits-Sonderregel — sie hält
auch bei anderen Kamerawinkeln.

**Empfehlung für Workspace A:** sollte irgendwo wieder eine "man fährt scheinbar in etwas
hinein"-Meldung auftreten, zuerst `scrubCorridor()`/`auditRoute()` prüfen — wenn die 0 Treffer
melden, ist es mit hoher Wahrscheinlichkeit ein Sichtachsen-, kein Kollisionsproblem. Ein
Raycast durch die exakte Bildkoordinate des Befunds (siehe Vorgehen oben) identifiziert das
Objekt in unter einer Minute; das Nachjustieren von Kollisions-Toleranzen ins Blaue kostet
Tage.

## 3. Bruchkanten an gebogenen Strukturen

**Symptom:** am Bahnhofsdach und an den Tordurchfahrten zeigen die Bögen außen sichtbare Kerben
statt einer glatten Kurve.

**Ursache:** jeder Bogen war eine Kette gerader Einzelsegmente (Boxen bzw. Zylinder) mit
FLACHEN Stirnflächen. Am Übergang von Segment N zu Segment N+1 trifft die flache Stirnfläche
auf die Seitenfläche des Nachbarn — auf der AUSSENSEITE der Kurve (dem größeren Radius) ist der
Winkel zwischen den Stirnflächen am größten, daher ist der Defekt dort am sichtbarsten. Die
Tunnel-Rippen hatten dieses Problem nie: sie waren von Anfang an ein einziges durchgehendes
`TubeGeometry`.

**Fix:** dieselbe Bauweise überall angewendet — Hauptbahnhof-Dachrippen, Hohenzollernbrücke-
Bogen und alle Tor-Bögen sind jetzt je EIN `TubeGeometry` entlang einer `CatmullRomCurve3`,
mit `flatShading:false` für einen glatten Schattenverlauf. Gerade Bauteile (Hänger,
Querverband, Kämpferstreben) waren nie betroffen und blieben unverändert.

**Regel für neue Bögen:** jede Kurve, die als Bauteil (nicht nur als Dekor) gebaut wird, ist ein
durchgehendes `TubeGeometry`, nie eine Kette diskreter Box- oder Zylindersegmente. Eine Kette
ist nur für STARRE, gerade Elemente zulässig (Geländer aus Pfosten, Kaskadenstäbe).
