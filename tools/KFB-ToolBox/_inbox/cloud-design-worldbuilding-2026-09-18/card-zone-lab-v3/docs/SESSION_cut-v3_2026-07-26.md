# SESSION — Card Zone Lab v2 + Zonen-Registry · Cut v3 · 2026-07-26

Fortsetzung von `SESSION_card-zone-lab-v2_2026-07-26.md`. Was seit dem v2-Cut entstanden ist.

## 1 terrain-v10 ist kanonisch

Kein Fork mehr. `heightStep`, `setCarve` und das neue `setCarvePath` sind übernommen, alle additiv
und mit Default rückwärtskompatibel. `docs/SPEC_v10_terrain.md` ersetzt das alte Patch-Dokument und
nennt die Fallstricke für Aufrufer (wer `heightStep` einschaltet, muss alles, was auf
`groundHeightAt` aufsetzt, auf dieselbe Rasterweite bringen).

Neu nach außen gegeben: `carvedAt(x,z)` und `pathDistAt(x,z)`. Wer ein Flussbett füllt, muss exakt
dieselbe Menge treffen wie der Carve — zwei getrennt gerechnete Radien haben überlappende Cubes und
flackernde Deckflächen erzeugt.

## 2 Flusslauf und Strömung

`setCarvePath(pts, breite)` stanzt eine offene Kurve, `riverTopAt` trägt ihr Ufer. Es ist dieselbe
Rechnung wie am Zonenufer — nur Abstand-zur-Kurve statt Abstand-zum-Rechteck und Bogenlänge entlang
der Kurve statt am Umfang. Kein zweites Höhenmodell.

Strömungsrichtung liegt als Vertex-Attribut `aFlow` pro Zelle. Ein Uniform hätte es nicht geleistet:
ein Material bedient Stillwasser und Fluss gleichzeitig. Die Stärke ist eine Rampe über den Abstand
zum Lauf, auch für Grabenzellen — sonst schaltet die Animation an der Mündung hart um.

## 3 Face-Focus

Zweiter Klick auf eine vorne stehende Würfelfläche fährt die Kamera achsenbündig heran und legt ein
HTML-Panel über die **projizierte** Fläche. Damit gibt es echten PDF-Zoom (Rad, Ziehen) und ein
echtes Chat-UI statt einer 512-px-Canvas-Kachel.

Zwei Fallen, beide erlebt:
- `OrbitControls.update()` klemmt den Radius auf `minDistance` **auch bei `enabled = false`**. Die
  Fokus-Kamera erreichte ihre Zieldistanz nie, die Fläche füllte 40 % statt 80 %.
- Kamera-Flug und Panel-Nachführung dürfen nicht hinter demselben frühen Return liegen: sonst friert
  das Rechteck in dem Moment ein, in dem die Kamera ankommt, und der pendelnde Würfel läuft darunter weg.

## 4 Blasen und Drone

Blasen steigen aus **derselben** Liste nasser Zellen auf, aus der das Fluid-Netz seine Quads baut —
keine Blase kann im Trockenen stehen. Rate nach Füllung: Säure sprudelt, Schlacke kaum.

Drone ist synthetisiert, keine Datei: zwei um 0,7 % verstimmte Sägezähne durch einen Tiefpass plus
bandgefiltertes Rauschen. Lautstärke folgt dem Abstand, der Filter öffnet mit — nah wird es
*präsenter*, nicht nur lauter. Kontext startet erst bei der ersten Geste, Drone default aus.

## 5 Zonen-Registry — die fehlende Ebene

`KFB Zonen-Registry.dc.html` + `zone-registry.json`.

Wichtigste Entscheidung: die Registry **erzeugt keine Zonen von Hand**. Jede Card Zone wird
deterministisch aus ihrer Karte abgeleitet, mit derselben Rechnung wie im Lab (Vektor aus
`world-context.js`, gegen die Pool-Basislinie normiert, stärkste Abweichung → Story-Modus). Registry
und Szene können damit nicht auseinanderlaufen.

Die sechs D6-Story-Modi treffen auf die sechs Biome aus `zone-index.json` — das passte fast von
selbst. Register (up/mid/down) kommt aus wonder+humor gegen threat+melancholy.

**Zwei Kantenarten, zwei Bedeutungen** — der Kern des Narrative-Flow-Konzepts:
- **Flow** (Pfeil): gleiches Deck, fortlaufende Nummern. Story-Fließrichtung; im Lab wird daraus der
  Flusslauf mit Strömungsrichtung.
- **Fluss** (gestrichelt): Wasserverbindung zwischen benachbarten Biomen, eine pro Biome-Paar.

Flows werden nur gezielt gezeichnet (gefiltertes Deck oder gewählte Zone). Global sind es 165 Pfade
über 168 Hexe — genau das Netz ohne Aussage, das die Fluss-Regel bewusst vermeidet.

Lernstand pro Zone liegt in localStorage, der Export ist die Übergabe. „Im Lab öffnen" schreibt einen
Übergabe-Schlüssel, den das Lab beim Laden liest und danach verwirft.

## 6 Was diese Runde methodisch gelehrt hat

Vier Verifier-Runden hintereinander lagen an derselben Sorte Fehler: **ich habe an Zahlen gedreht,
wo die Ursache eine Ebene tiefer lag.** Drei Beispiele, alle aus dieser Session:

- Doppelte Hexe: ich habe den Cluster-Abstand vergrößert. Ursache war der Startpunkt des Ringlaufs
  in `hexSpiral` — die Funktion lieferte für 45 Zellen nur 33 verschiedene Koordinaten.
- Helles Ufer-Band: ich habe die Lerp-Richtung gedreht. Ursache war, dass Graben-Instanzfarben und
  der Terrain-Shader nie gegeneinander kalibriert waren (Helligkeitsspreizung × Kanten-Mittel ×
  Beleuchtung). Der Faktor wird jetzt aus den echten Uniforms gelesen.
- Fehlende SVG-Titel: die Attribute waren korrekt. Die Runtime verpackt ein `{{ }}`-Hole in ein
  `<span>`, und SVG rendert ein span als Kind von `text` nicht.

Die Runden, die etwas gebracht haben, begannen mit einer Messung und endeten mit **einer**
strukturellen Änderung.

## Offen

- **cardGrid** in `media/kfb/index.json` — wartet auf die Card-&-Ink-Specs.
- **Cartoon-Deformer** für Kenney-Props (Briefing in `uploads/`).
- **Tusche**: im Lab abgeschaltet. Der Screen-Space-Sobel legt ein Raster über das Voxel-Feld; die
  KFB-Kante gehört aus `cardbuilder/kfb-ink-canon.js` pro Objekt abgeleitet.
- **Mehrere Zonen in EINER Szene**: die Registry hält jetzt Plätze und Kanten, das Lab zeigt weiter
  genau eine Zone. Der Schritt dahin ist kein Modellproblem mehr, nur Arbeit an der Szene.
