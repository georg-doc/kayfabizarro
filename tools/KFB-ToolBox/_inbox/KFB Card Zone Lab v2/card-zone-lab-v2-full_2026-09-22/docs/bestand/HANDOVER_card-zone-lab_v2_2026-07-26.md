# HANDOVER — Card Zone Lab v2 · Stand 2026-07-26

Für Design-Chat und Coworker. Was in dieser Runde entstanden ist, warum es so gebaut ist, und was
man wissen muss, um daran weiterzuarbeiten oder es in Travel zu übernehmen.

## Was jetzt läuft

`KFB Card Zone Lab v2.dc.html` — eine Card Zone im echten v10-Terrain:

- **Zone** 16×9 Zellen als Plateau, Collage-Material, D6-Stufen im Boden.
- **Wassergraben** mit unregelmäßiger Uferlinie, fünf Füllungen (Wasser/Öl/Säure/Bubblegum/Schlacke).
- **Wasser in der Zone**: Mulden werden Teiche, Kanäle münden in den Graben.
- **Flusslauf** aus der Zone heraus, mit Strömungsrichtung — die Basis für *narrative flows*.
- **Card Cube** mit sechs Flächen, Academy-Mechanik, Face-Focus mit echtem HTML (PDF-Zoom, Chat).
- **Karte** liegt flach auf dem Deck und klappt auf; Deck 1–6 Stufen hoch, cartoon-realistischer Stapel.
- **Karten-Seed steuert die Zone**: Story-Modus, Palette, Füllung, Abnutzung, Textur, Grabenbreite.
- **Blasen** im Graben, **Drone** bei Annäherung (beides abschaltbar, Drone default aus).

## Die vier Regeln, an denen die meiste Zeit hing

Wer hier weiterbaut, sollte diese vier kennen — jede kostete mehrere Runden.

### 1 Wasser: zwei Höhen, ein Modell

`waterLevel` klassifiziert (nass/trocken), `fluidY` ist die **gezeichnete** Ebene und liegt eine
Viertelstufe darunter. Grund: Cube-Oberseiten rasten auf `SUB` (= CELL/6). Läge die Ebene auf dem
gleichen Raster, wäre sie mit Deckflächen exakt koplanar — das flackert (Tiefenpuffer-Streit, sichtbar
als Schraffur auf den Oberseiten).

Der Anti-Flacker-Abstand `WMARGIN` **muss kleiner als eine Höhenstufe sein**. Mit `CELL*0.3` (= 0.9 >
SUB = 0.5) musste die Ebene fast zwei Stufen über jeder Zelle liegen, die sie füllt — Ergebnis war ein
schwebender Wasserfilm über trockenem Sand.

Bezugshöhe ist der **Modus** des Zonenbodens, nicht ein Quantil oder das Minimum. Ein Quantil liegt bei
gerastertem Boden oft genau auf dem Hauptniveau (dann flutet die halbe Insel), das Minimum liegt per
Konstruktion unter allem (dann flutet nie etwas).

### 2 Bauten heben sich über das Wasser, nicht umgekehrt

`anchorTops()` setzt Deck, Sockel und Würfel auf `max(zoneTopAt, waterY + SUB)`. Die frühere Variante
(Wasser unter jeden Anker klemmen) machte die Wasserebene von der Zufallshöhe **einer** Zelle abhängig:
stand das Deck in einer Mulde, war das Zonen-Wasser komplett aus.

### 3 Eine Zahl, ein Radius

`riverHalf()` liefert die Bettbreite an **alle** Stellen: Zellen, Carve, Uferfeld. Zwei getrennt
gerechnete Radien (Bett eine halbe Zelle breiter als der Carve) ergaben ein Band, in dem Fluss- und
Terraincube gleichzeitig standen — flackernde Deckflächen am Fluss.

Dasselbe Prinzip beim Nass-Test: "ist nass" und "bekommt ein Wasser-Quad" müssen **dieselbe Menge**
sein, sonst bleiben dunkle Löcher in der Fläche.

### 4 Das Ufer ist ein Feld, kein Rahmen

`bankTopAt(x, z)` mischt Wannenboden → Terrainhöhe über eine Distanz, die aus einem Rauschen **entlang**
der Kante kommt. Drei Fallen, alle erlebt:

- Das Rauschen über eine achsenparallele Koordinate laufen lassen → spiegelsymmetrisch auf beiden
  Achsen, liest als gezeichneter Rahmen. Lösung: **Bogenlänge** am Rand, periodisch abgetastet.
- Das Rampen-**Ende** festnageln → nur die Steilheit variiert, die Wasserlinie bleibt ein Rechteck.
  Die Wasserlinie muss selbst der Parameter sein.
- `fbm` clustert um 0.5, der nominelle Bereich wird nie ausgeschöpft. Ohne Kontrastspreizung bleibt die
  Streuung unter einer Rasterweite und die Quantisierung schluckt sie.

Und der Gewinn: **derselbe Code trägt das Flussufer** (`riverTopAt`) — nur Abstand-zur-Kurve statt
Abstand-zum-Rechteck und Bogenlänge entlang der Kurve. Kein zweites Höhenmodell.

## Narrative Flow — Stand und nächster Schritt

Der Fluss läuft heute aus **einer** Zone nach außen; sein Verlauf, seine Richtung und sein
Austrittspunkt kommen aus dem Karten-Seed. Für echte Verbindungen fehlt nur die Kurve zwischen zwei
Zonen: `setCarvePath` nimmt jede Polyline, `riverTopAt` jede Bogenlänge. Semantik (welche Karten
verbunden werden, in welcher Richtung gelesen) liegt außerhalb dieses Moduls — sie gehört in die
Zonen-Registry.

## Was offen ist

- **cardGrid** in `media/kfb/index.json` — wartet auf die Card-&-Ink-Specs.
- **Zonen-Registry**: mehrere Zonen, Flüsse dazwischen, Academy-Status persistent.
- **Cartoon-Deformer** für Kenney-Props (Briefing liegt in `uploads/`).
- **Face-Focus**: Chat spricht über `window.claude.complete`, wenn verfügbar — sonst Platzhalter.
