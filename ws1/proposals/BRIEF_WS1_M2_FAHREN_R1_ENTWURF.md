# Briefing M2 · Fahren übers Gelände (ENTWURF R1)

Stand 15.10.2026 · Entwurf von WS1 (M1-Sitzung) im Auftrag Georgs · **noch ohne V-Nummer**
Ausgang Georg, Autor WS1. WS0 prüft den Entwurf gegen das Register, vergibt die Nummer und beauftragt WS1 (V-213).

## Ziel
FrizzleBob steigt in ein Auto und fährt rasant und frei über das Gelände der M1-Welt: Hügel als Rampen, Sprünge, Überschläge, Selbstaufrichten, weiterfahren (V-290). Keine Rennstrecke. Es soll Spaß machen und bei 60 fps laufen.

## Grundlage im Register
- **V-290:** Reisen ist rasante, freie Fahrt übers Gelände; Cartoon-Fahrzeug mit plausibler Physik und viel Hilfe. WS1 vergleicht per Vorlagen-Zeile das J17-k2b-Fahrgefühl mit einem Fahrzeug-Controller im R3F/Rapier-Rahmen und schlägt einen vor. Georg urteilt an der Fahrprobe. Ersetzt V-251 (Fahrphysik fest J17 k2b).
- **V-273:** Meshy-Fahrzeuge werden wie die KayKit-Autos in J17 aufbereitet:
  - Browser-Fassung, Räder als eigene Knoten mit Drehpunkt in der Nabe;
  - Sitz-Anker, Lenkrad-Anker, Lenkrad als Requisit;
  - Mixamo-„Driving“-Animation.

  WS0 (Asset) → WS1.
- **V-307:** Badewannen-Kart: Kart-Sitzhaltung (zurückgelehnt, Beine nach vorn).
- **V-030:** geschlossenes Auto (Cicada), die Figur ist beim Fahren unsichtbar.
- **V-031:** Ein- und Aussteigen (Hop) als Arbeitsstand, Rückfall Überblenden.
- **V-286:** Gemalte Meshy-Texturen werden nur leicht getönt.
- **V-288:** Das Reisen selbst macht Spaß.
- **V-294:** Eine Zone durchquert man mit dem Auto in etwa 2–4 Minuten.

## Neu seit V-290: zwei Kandidaten für den Vergleich
1. **J17 k2b**: das abgenommene Fahrgefühl (V-032), als Modul, Boden aus dem Gelände statt aus der Strecke. Laut Georg ist das „alles andere als ideal und spieltauglich“, es muss ohnehin nachgearbeitet werden.
2. **ecctrl 2.0.2 `EcctrlVehicle`**: steckt schon im Projekt, also dieselbe Bibliothek wie FrizzleBobs Laufen und Fliegen.
   - Räder als Shape-Cast-Räder (`ShapeCastWheel`), Motor mit Drehmomentkurve, Gänge (automatisch oder manuell), Lenkwinkel-Kurve.
   - Dazu gibt es eine Drohne (`ThrustPropeller`).
   - Läuft auf Rapier und damit in derselben Physik wie Gelände, Theater und Zaun aus M1.

## Umfang M2
0. **G0 · Vergleich vor dem Bau (Vorlagen-Zeile in WS1_STATUS)**
   - Beide Kandidaten mit demselben Platzhalter-Fahrzeug auf demselben Gelände (M1-Welt, Hang, Theater-Umland).
   - Kriterien: Fahrspaß und Kontrolle, Sprung über eine Kuppe, Überschlag und Selbstaufrichten, Weiterfahren, 60 fps, Aufwand.
   - Ergebnis: je ein **Video** (Querformat, ≥ 1600 px, V-253), Empfehlung von WS1. Georg entscheidet.
1. **Ein Meshy-Fahrzeug spielfertig**
   - Georgs neue Modelle (18–19 MB) auf eine Browser-Fassung von wenigen MB bringen, Textur und Farbigkeit erhalten (Weg wie bei den Meshy-Bühnen, `build-browser.mjs`).
   - Räder als eigene Knoten mit Drehpunkt; Sitz- und Lenkrad-Anker (V-273).
   - Farbe: Originaltextur, höchstens sanft getönt (V-286). Cartoon-Umfärbung nur, wenn Georg sie am Bildpaar will.
2. **Fahren in der M1-Welt**
   - Einsteigen (Taste, Hop-Arbeitsstand oder Überblenden, V-031), fahren, aussteigen. Kamera folgt.
   - Hügel als Rampen; Überschlag erlaubt; Aufrichten automatisch oder per Taste; Weltgrenzen wie M1.
   - Fahrzeug als Modul nach create/update/dispose am Darsteller- bzw. Fahrzeug-Slot (Host-Vertrag R1.2).
3. **Tastenliste** um Fahren ergänzen.

## Abnahme (Georgs Mac)
| # | Prüfpunkt | Wie geprüft |
|---|---|---|
| 1 | Fahren macht Spaß: beschleunigen, lenken, driften, Kuppe springen | Fahrprobe Georg + Video |
| 2 | Überschlag, danach weiterfahren (Selbstaufrichten) | Video + ein Replay-Test (Auto steht danach auf den Rädern) |
| 3 | Kein Durchfallen und kein Durchfahren von Gelände, Theater oder Zaun | ein Replay-Test mit schneller Fahrt gegen Hang und Wand |
| 4 | Einsteigen, Aussteigen, Kamera-Übergabe | Szenen-Test (kurz) |
| 5 | 60 fps mit Auto, Theater, Gelände, Himmel | Messung auf dem M4 |
| 6 | Meshy-Auto: Textur und Farbe erhalten, Browser-Fassung klein | Bildpaar Original \| Browser-Fassung (V-253) |

## Arbeitsweise (Lehre aus M1)
- **Schlank prüfen.** Wenige Tests, die echtes Verhalten messen (Durchfahren, Aufrichten, Ein-/Aussteigen, fps). Das Fahrgefühl beurteilt Georg am Video, nicht ein Test.
- **Ein blinder Prüfer** am Ende der Scheibe, nicht nach jeder Runde. In M1 kosteten fünf Prüfer-Durchgänge sehr viele Token.
- **Eigener Arbeitsbaum**, parallel zur übrigen WS1-Arbeit wie M1. Push und WS1_STATUS führt die Owner-Sitzung.
- **Browser-Slot-Protokoll** wie in M1: immer nur eine Sitzung fährt Browser-Tests, „frei“ wird ausdrücklich gemeldet.

## Nicht in M2
- Rennstrecke und Strecken-Versatzstücke (später als Requisiten, V-290).
- Gizmo-Wände und Labyrinth (V-301).
- Autos sammeln bzw. Garage. Das ist eine starke Motivationsidee von Georg, kommt aber als eigene Scheibe danach.
- Figur sichtbar im offenen Fahrzeug mit Lenkrad-Haltung (V-273/V-307). Die Anker werden vorbereitet; die Haltung kommt, wenn WS0 die Kart-Figuren abgenommen hat.
- Zweites Fahrzeug, Drohne, Mehrspieler.

## Fragen an WS0
1. **Erstes Fahrzeug:** Georgs neue Meshy-Autos, Cicada (V-030) oder das Badewannen-Kart (V-273/V-307)? Vorschlag WS1: eines von Georgs neuen Meshy-Autos, geschlossen; damit entfällt die Sitzhaltung wie bei V-030.
2. **Aufbereitung:** WS0 (Asset-Branch wie bei den Bühnen) oder WS1 nach eurem `build-browser.mjs`-Weg? V-273 sagt „WS0 (Asset) → WS1“.
3. **Ablage:** Georg legt die Modelle vorerst unter `~/kfb-ws1/assets/meshy-vehicles/` ab. Wohin kommen sie im Repo bzw. in den Asset Librarian?
4. **Auslieferweg** für Georgs Probe (offen aus M1, §40): Wohin wird gebaut und gehostet?
5. **Passt M2 zur Racer-Linie** (J17, Lab), oder soll k2b dort weiterleben und hier nur verglichen werden?
