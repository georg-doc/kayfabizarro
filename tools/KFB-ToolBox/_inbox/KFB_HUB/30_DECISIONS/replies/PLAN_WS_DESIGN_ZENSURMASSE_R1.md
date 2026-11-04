# PLAN · WS-Design · Zensurmasse und enthüllte Karte · R1 · 04.11. · an WS0

Grundlage: SLOP_METANARRATIV_R1 §2–4, SLOP_AUSBRUCH_PLAN_R1 §3, §4 und §6 (entschieden).
Gebaut wird im nächsten Slot, hinter dem Schalter `zensur=1`.
Ohne den Schalter bleibt die Bresche wie in design/aufprall-r3 @23a3270c.

## 1 · Blobs statt bunter Kugeln (cascade/r4/spill.js)
- **Form:** runde Klumpen mit harter Kante (D-Form).
  - Eine Grundform: ein Ikosaeder, mit Rauschen verbeult, unten flach abgeschnitten.
  - Je Instanz ungleich skaliert (0,7–1,3), in einem einzigen InstancedMesh.
- **Material:** `gooBlobMaterial(THREE)` von Flug.
  - Bis es da ist, nehme ich ein Platzhalter-Material: dunkel, Rauheit 0,35. Der Tausch ist dann eine Zeile.
- **Menge:** ein Datenwert in `spill.r1.json` (`blobs_je_gebaeude`), Vorschlag 24. Den Pool begrenzt dieselbe Zahl je Gebäude, also höchstens 12 × 24 Instanzen je Viertel.
- **Bewegung:**
  - Fall aus der Bresche wie heute (Fächer entlang der Normalen).
  - Klebrig heißt: wenig Rückprall (0,12 statt 0,34) und etwas mehr Reibung.
  - Sie rollen trotzdem ab, und am Hang ruhen sie spätestens nach 5 s, wie jetzt.
  - Beim Aufkommen gibt es einen kurzen Squash (Volumen bleibt, cartoon-motion).
- **Einsickern:** über Flugs `einsickern3d(material)` und `einsickernKurve`, mit den Werten aus §6: liegen 6 s, dauer 4 s.
  - Erst wird der Blob matt, dann versinkt er mit unruhiger Kante. Kein Ausblenden.
  - Die heutige Absenkung der Kugeln fällt dafür weg.
- **Ent-Zensur:**
  - Trifft ein Schuss einen Blob, platzt er über Flugs Goo-Platzen.
  - An seiner Stelle springen 3 bunte Kugeln aus dem heutigen Kugel-Pool heraus. Die Ernte bleibt so erhalten.
  - Für die Treffer meldet spill.js die Blobs als Kampfziel an (combatTargets).

## 2 · Die Karte im Inneren: `enthuellt` 0..1
- Die Kartenfläche hinter den Wänden (`OriginalCard-*`) bekommt den Shader-Wert `enthuellt`.
- **Bei 0:** Die Karte ist ganz geschwärzt, mit derselben Tinte (dunkel, matt glänzend).
- **Wenn der Wert steigt:** Die Tinte läuft von oben nach unten ab.
  - Die Kante ist eine Tropfkante: Spalten mit Rauschen, einzelne lange Läufer, eine nasse Glanzlinie an der Kante.
  - Darunter erscheint das Motiv.
  - Jeder Schritt läuft etwa 1,5 s nach (Feder), kein Springen.
- **Wert je Gebäude:** min(1, (Slops × 1 + Blobs × 0,2) / Bewohner), wie in §6 entschieden.
  - Slops und Bewohner kommen aus `slops.ausbruch` (cueBus, WS1).
  - Die Blobs zähle ich selbst beim Herausfallen.
- **Prüfschalter:** `enthuellt=<0..1>` setzt den Wert für alle Gebäude fest, solange das Ereignis noch fehlt.

## 3 · Beleg (ein Blatt, höchstens 3 Folien, je höchstens 2 Bilder, Kamera von vorn bzw. seitlich)
1. Blobs fallen und rollen aus der Bresche, nah.
2. Dieselbe Stelle nach 6 s und nach 10 s (matt, dann eingesickert).
3. Karte in der Bresche bei `enthuellt` 0 und 0,6 (ablaufende Tinte).

Ein Kritiker am Ende. Node-Prüfung: Zählung und Formel für enthuellt, Pool-Grenze, Einsickern nach Zeit.

## Schnittstelle Einsickern (Flug 04.11., src/modules/einsickern.js)
- `einsickern3d(mat, { instanz: true })` hängt `aSicker` (vec2, InstancedBufferAttribute) an die Blob-Geometrie.
  - x = Fortschritt 0..1, y = Bodenhöhe am Blob.
  - Ist x negativ, gilt der Material-Wert.
- Je Bild:
  - `einsickernKurve(t, { liegen: 6, dauer: 4 }).s` nach aSicker.x schreiben;
  - die Bodenhöhe nach aSicker.y;
  - das Absinken `sinkY(t, hoehe)` in die instanceMatrix;
  - danach needsUpdate setzen.
- Der Shader löst unter dem Boden mit unruhiger Kante auf und dunkelt nass ab.
- `gooBlobMaterial(THREE)` wird ein Abkömmling von MeshStandardMaterial und passt so zum InstancedMesh. Bis dahin nutze ich den Platzhalter.

## Offen
- Nichts für WS0. Mit Flug abgestimmt sind Material, Einsickern-Modul, die Werte 6 s / 4 s, die Ent-Zensur und die Formel für enthuellt. Ich nehme sie so.
