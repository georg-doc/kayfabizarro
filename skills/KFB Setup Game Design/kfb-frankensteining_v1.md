---
name: kfb-frankensteining
version: 1.0
date: 2026-09-10
origin: Post Mortem Frankenstein-Vehikel v1 (docs/frankenstein-v1/POSTMORTEM_F1_2026-09-10.md) · sieben Befunde, sieben Regeln
description: >
  Verfahren, um aus Bibliotheksteilen (kfb-asset-library, Kenney, Quaternius, Poly, Pet-Studio-Module) glaubwürdige KFB-Hybride
  zu bauen: Fahrzeuge, Cockpits, Anbauten, Charakter-Einbauten. Trigger auf "frankensteinen", "Frankenstein-Vehikel", "Teil aus der
  Bibliothek", "Booster anbauen", "Luke/Cockpit bauen", "bring your own model", "DIY Garage", "Spender schneiden", "Insel-Schnitt".
  Auch triggern, wenn jemand ein Primitiv (Zylinder, Box, Torus) sichtbarer Größe in ein KFB-Modell setzen will — dann ist dieser
  Skill die Alternative. Trigger generously.
---

# kfb-frankensteining · Vertrag vor Teil, Messung vor Bau, Bild vor »fertig«

**Wortschatz.** *Spender* = Originalmodell, aus dem geschnitten wird (GLB/GLTF aus dem Repo). *Insel* = zusammenhängender Netzteil
(verschweißt bei 0,5 mm). *Wirt* = das Ding, an das montiert wird. *Rahmen* = gemessener Anbauort (Ursprung, Achse, Raum).
*Teile-Labor* = `frankenstein-v1/lab/parts-lab.html`; *Spender-Labor* = `lab/donor-lab.html`.

**Prime Directive bleibt:** wonky/handgemacht, cartoon-plausibel, keine Casino-Politur. Frankensteining heißt: Fremdes so setzen,
dass es aussieht, als hätte es immer dazugehört — mit Lücke, Bolzen, Farbe, nie »reingeklatscht«.

## 0 · Die Hausregel, die alles andere trägt
**Ein Werkzeug misst erst, wenn es an einer bekannten Zahl bestanden hat.** Bevor eine Mess- oder Schnittfunktion baut, muss sie ein
Teil mit im Labor gemessener Größe auf ±2 % reproduzieren. Ohne Eichung ist jede Abnahme danach wertlos (F1-S4: `computeBoundingBox`
las das Attribut, nicht den Index; alle Pods waren auf die Box des ganzen Schiffs skaliert, und vier Bilder haben es nicht gefangen,
weil Zahlen des Werkzeugs gegen Zahlen desselben Werkzeugs geprüft wurden).

## 1 · Spender-Karte zuerst (nichts bauen)
1. `kfb-asset-library.json` durchsuchen (Ordner, Name, Größe). Kandidaten: mindestens drei je Bauteil, dazu der »verwandte« Spender
   (das Raumschiff desselben Tiers zum Mech, das Set-Kit zur Requisite).
2. Jeden Kandidaten im Teile-Labor laden: Inselzahl, Box je Insel, Mittelpunkt, Achse (welche Richtung ist »heraus«?). **Bild je
   Kandidat** — im Bild fallen Fehlgriffe auf (Flügelspitzen statt Düsen, Finnen statt Pods).
3. Kandidaten benennen, Fehlgriffe benennen, EINE Wahl mit Begründung (Größe passt · Achse klar · Palette verträglich).
4. Pfad + gepinnte Revision + Inselmittelpunkte ins LIVING, bevor eine Zeile Code entsteht.

## 2 · Rahmen messen, nicht raten
- **Die Box des Teils, an dem montiert wird — nie die Box des Ganzen.** Räder hängen an den *Füßen* (`boneBoxes(/Foot/)`), Booster
  sitzen im *Rumpf* (`boneBoxes(/Torso|Chest/)`), Luken auf dem *Deck* (Median der Trefferhöhen aus Strahlen, nicht die Tierbox).
- Rahmen als Satz: »Teil A sitzt an Fläche B von Wirt C, x % Eindringtiefe, Achse so, Spalt y.« Dann als Zahlen. Beide ins LIVING.
- Posierte Boxen (`skinnedBox`, `getVertexPosition`) — die Bindepose lügt bei allem, was ein Skelett hat.
- Hohlräume mit Strahlen: 6-cm-Raster von oben, Deck = Median, Loch = fehlender Treffer oder > 15 cm unter Deck (795 Strahlen, F1-S4).

## 3 · Schneiden und Wählen
- **Insel-Regel vor Dreiecks-Regel:** ganze Inseln nach dominantem Knochen oder gemessenem Mittelpunkt; Dreiecksschnitt nur, wenn
  ein Körper eine einzige Insel ist — und dann lieber **Clip-Ebene** (Material `clippingPlanes`), die schneidet nichts und lässt sich
  je Bild verschieben (F1-S4: Beine unsichtbar statt abgeschnitten).
- Geometrie immer als **Kopie** mit neuem Index; der Spender bleibt unberührt.
- Auswahl nach **gemessenem Mittelpunkt** (Abweichung ins Protokoll, ≤ 0,01 ist gut), nie nach Index allein.
- Kinematik (Arme, Beine) nur mit gemessenen Knochenachsen und -längen; eine unerklärte Abweichung (»Fuß verfehlt um 0,6«) ist ein
  **Stopp**, keine Fußnote. Im Zweifel abschalten und die Pose dem Modul lassen.

## 4 · Kein Primitiv sichtbarer Größe
Zylinder, Kasten, Torus, Kugel sind **Verbinder unter 10 cm** — Bolzen, Stummel, Stange. Alles Größere kommt aus der Bibliothek oder
wird nicht gebaut, sondern als offen benannt. Wer ein Primitiv größer setzen will, holt Georgs Freigabe mit Bild.
Verbotene Muster aus F1: Iris aus acht Kästen · Pult aus Platte und Stängchen · Balken als Halter · Torus als Ring um einen
Propeller · Kegelstumpf als Düse.

## 5 · Farb-Logik
Fremdteile in die **gemessene Palette des Wirts**: Hauptfarbe + Akzent aus einem kleinen Render (Quantisierung, dominante Farbe,
fernster Akzent). KFB-Konstanten: Gelb `#f2c93c` (FrizzleBob), Rot `#e96049`, Stahl `#8e8878`, Dunkel `#354238`. Regel: ein Fremdteil
trägt entweder die Wirtsfarbe (verschmilzt) oder KFB-Stahl/Rot (liest sich als Anbau) — nie seine Spenderfarbe roh.

## 6 · Ein Bauteil, ein Bild, dann das nächste
Nie zwei neue Teile in einer Scheibe. Reihenfolge je Teil: Rahmen messen → Teil wählen → montieren → **vier Kameras** (¾ vorn,
Seite, Heck, nah am Kontaktpunkt) → drei Fehler suchen → dann melden. Bilder nach `captures/<baustelle>/NN-sX-<teil>.jpg`, im LIVING
verlinkt. Im verborgenen Vorschaufenster steht die Bildschleife — `renderer.render` selbst rufen, Gesichts-Rigs 30× von Hand ticken.

## 7 · Abnahme in Georgs Worten, nicht in Zahlen
»0 Fehler, 141 Zeichenaufrufe, Rad vorhanden« ist keine Abnahme. Die Liste steht in Sätzen, die ein Betrachter am Bild prüft:
- Rad **neben** dem Bein, nicht darin · Düse **berührt** den Rumpf · **kein Schnitt** sichtbar · Augen **offen** (auch in Pause) ·
  Hände **auf** den Bedienteilen · Charakter **ganz** im Fahrzeug · nichts steckt in Wasser/Wand · Anbau nur dort **aktiv**, wo er
  Sinn hat (Glut im Flug).
- Dazu die Zahlen als Beleg: Spalt, Eindringtiefe, Abweichung der Inselwahl, Zeichenaufrufe.
**Silent Repair Loop:** nach dem eigenen Bild erst reparieren, dann melden. Nichts heißt »fertig«, was nur geladen hat.

## 8 · Was dieser Skill nicht ist
Kein Ersatz für den Charaktervertrag (Pet Studio baut Gesicht/Körper, der Wirt montiert), kein Physik-Skill (Kontakte bleiben Eigentum
des Körpers; Segway-Optik ist visuell, bis eine eigene Scheibe das Balancieren baut), kein Freibrief für neue Spender-Downloads ohne
Eintrag in `github.md`.

## 9 · Checkliste (kopierbar ins LIVING)
```
[ ] Spender-Karte: ≥3 Kandidaten, Labor-Zahlen, Bild je Kandidat, Wahl begründet
[ ] Werkzeug geeicht an bekannter Zahl (±2 %)
[ ] Rahmen als Satz + Zahl (Box des Teils, Eindringtiefe, Achse, Spalt)
[ ] Schnitt: Insel/Clip, Kopie, Abweichung protokolliert
[ ] Kein Primitiv > 10 cm (oder Freigabe mit Bild)
[ ] Farbe: Wirtspalette oder KFB-Stahl/Rot
[ ] Vier Kameras, drei Fehler gesucht, Bilder verlinkt
[ ] Abnahme in Georgs Worten + Belegzahlen
[ ] LIVING-Zeile, HOUSEKEEPING-Status, github.md falls Spender neu
```
