# Konzept · Karten als Punktwolke und Relief im Terrain · R1 · WS0 · 25.10.2026 (V-735)

Anlass: Georg findet die Punktwolken-Probe (`60_VIDEO/pointcloud_probe_r1`, Hub q194) „sehr, sehr gut“ und möchte sie weiterverfolgen. Drei Zwecke: Bilder darstellen, aus Karten Höhenreliefs ableiten, Karten im Terrain verbergen (flach und als animierte Kügelchen).

## Tier 0
1. **Ein Datensatz je Karte, mehrere Formen:** Aus dem Kartenbild werden offline Farbe, Tiefe und Punkte gebacken. Daraus entstehen drei Formen: Relief im Boden (flach), Punktwolke aus Knetkügelchen (lebendig) und das Kartenbild (Inventar).
2. **Verborgene Karten:** Im Gelände liegt die Karte als flaches Relief, aus der Luft lesbar wie ein Geoglyph. Wird sie entdeckt, steigt sie als Kügelchen-Schwarm auf, setzt sich zur Karte zusammen und zerfällt nach dem Einsammeln wieder zu Fluff.
3. **Ein Modul für Entstehen und Vergehen (V-533):** Die Kügelchen sind dieselben wie beim Fluff-Saugen und beim Materialisieren. Es entsteht kein zweites Partikelsystem.

## 1 · Backen (offline, je Karte einmal)
- **Eingang:** das Kartenbild (Motivfläche, ohne Rahmen und Text, optional mit).
- **Tiefe:** ein echtes Tiefenmodell statt der Helligkeit aus Probe R1. Kandidat ist Apple Depth Pro (Open Source, lokal auf dem Mac); Ergebnis eine 16-Bit-Höhenkarte.
- **Punkte:** wie Probe R1, dichter an Kanten. Farbe aus dem Bild, im Gelände auf die Biom-Palette abgebildet (Rollen nach V-406), damit die Karte im Boden zur Welt passt und nicht aufgeklebt wirkt.
- **Ausgabe je Karte:** `height.png`, `albedo.png`, `points.bin` (gepackt) und ein Eintrag im Karten-Register. Das sind Daten-Module im Sinne der modularen Site, sie laden einzeln nach.

## 2 · Formen im Spiel
| Form | Wann | Wie |
|---|---|---|
| Relief im Boden | Karte verborgen | Die Höhenkarte wird ins Gelände aufgetragen (nur auftragen, V-716), leicht getönt. Vom Boden aus sieht man Hügel und Rillen, aus der Luft (Flug) die ganze Karte als Geoglyph. |
| Punktwolke | Karte entdeckt, Mindspace, HyperNorm | Kügelchen lösen sich aus dem Relief, steigen auf, setzen die Karte in der Luft zusammen und atmen. Spieler und Bewohner können sie umrunden. |
| Kartenbild | eingesammelt | normale Karte im Almanach bzw. in der Truhe. Die Kügelchen fallen als Fluff zurück (Ernte-Belohnung). |

## 3 · Wabernder Boden und Höhenphysik
- **Kollision bleibt einfach:** Gelaufen wird auf der Höhenkarte (dieselbe, die auch das Relief formt). Die Kügelchen sind Bild, keine Physikkörper.
- **Weiche Knete unter den Füßen:** In Kügelchen-Zonen (Mindspace, Gutter, später Melt-Terrain) senkt sich der Boden unter Spieler und Fahrzeug leicht ein und federt zurück (Shader mit Spielerposition). Bei Sprüngen spritzen Kügelchen als Fluff.
- **Atmen:** Die Zone hebt und senkt sich langsam, in Mindspaces im Atem-Takt (Breath-Sync).

## 4 · Spielmechanik
- **Finden:** Verborgene Karten liegen an Orten mit Bezug zum Kartenthema. Aus der Luft erkennt man sie als Muster im Gelände, am Boden über ein leichtes Glimmen der Kügelchen an den Rillen.
- **Heben:** Saugarm bzw. Fluff-Blick auf das Relief. Die Karte steigt als Schwarm auf. Vorbild ist das bestehende Saug-Modul, Richtung umgekehrt (build).
- **Tratsch:** Bewohner haben verborgene Karten gesehen oder spekulieren über das Muster im Boden (V-697, V-702) und geben Hinweise weiter.
- **Zensur:** Goo kann ein Relief schwärzen (V-531). Der Spieler wäscht es mit buntem Fluff frei.

## 5 · Leistung
- Probe R1: 90.000 Punkte bei 66–118 fps im eingebauten Browser, mit verdecktem Fenster.
- Im Gelände Punkte nur im Nahbereich (Radius um den Spieler bzw. die entdeckte Karte), in der Ferne das Relief als normales Gelände mit Tönung.
- Eine Karte als Punktwolke kostet etwa 2,5 MB roh, gepackt (Quantisierung, 16 Bit) unter 1 MB.

## 6 · Schritte
1. **Probe R2 (WS0):**
   - echtes Tiefenmodell für eine Karte;
   - Relief als Geländestück in der Probe-Seite, mit Flug von oben und Gehen am Boden;
   - Aufsteigen der Karte aus dem Relief als Schwarm;
   - Kügelchen-Boden, der unter einem Testkörper nachgibt;
   - gemessen: fps und Größe.
2. Abnahme R2 durch Georg im Hub.
3. **Nach dem MVP:**
   - WS1b trägt Reliefs ins Gelände ein (Einbettungs-Logik von N36/V-716).
   - WS1 übernimmt Schwarm und Kügelchen-Boden als Modul über den Stage-Kanal.
   - WS-NPC bindet den Tratsch an.
4. Die Mehrbild-Technik (3dpoint.art) bleibt optional für einzelne Hero-Karten.
