# SESSION — Card Zone Lab v2 · 2026-07-26

## Was in dieser Session entstanden ist

Ausgangspunkt war v1: Zone, Graben, Beamer, Karte im Himmel. v2 hat daraus eine Bühne gemacht.

**Karte** liegt flach auf einem Kartendeck und klappt auf — Aufdeck-Sequenz mit gestaffelten
Einsätzen (Sockel → Loch → Projektor → Würfel), nichts blendet hart ein oder aus, alles fährt aus
dem Boden. Deck 1–6 D6-Stufen hoch, cartoon-realistischer Stapel mit unregelmäßig überstehenden
Rändern.

**Card Cube** statt Pappkarton: sechs Flächen (Art, Titel, Power, Lore, Verwandt, Chat), Mechanik
aus Cube Academy v1 — frei drehbar auf dem Würfel, Kamera-Orbit daneben, Klick richtet eine Fläche
aus, zweiter Klick geht in den **Face-Focus**: die Kamera fährt achsenbündig heran, bis die Fläche
das Bild füllt, und ein HTML-Panel legt sich über die projizierte Fläche. Damit gibt es echten
PDF-Zoom (Rad, Ziehen) und ein echtes Chat-UI (Sprechblasen, Voice-First-Umschaltung
Mikrofon/Senden) statt einer 512-px-Canvas-Kachel.

**Wasser** ist ein Niveau-Modell geworden: eine Ebene für Graben und Zone, Mulden werden Teiche,
Kanäle münden. Das Ufer ist ein Höhenfeld — Buchten, Sandbänke, Landzungen entstehen, statt
gezeichnet zu werden.

**Flusslauf** aus der Zone heraus, mit Strömungsrichtung pro Zelle. Verlauf, Richtung und
Austrittspunkt kommen aus dem Karten-Seed. Das ist die Basis für *narrative flows*.

**Karten-Seed steuert die Zone**: der semantische Vektor aus `world-context.js` bestimmt
Story-Modus, Palette, Füllung, Abnutzung, Collage-Textur, Grabenbreite, Deckhöhe. Gegen die
Pool-Basislinie gerechnet — sonst gewinnt immer `power` und jede Zone wäre `heroic`.

**Atmosphäre**: Blasen im Graben (Rate nach Füllung), synthetisierte Drone bei Annäherung.

**terrain-v10 ist kanonisch**: `heightStep`, `setCarve`, `setCarvePath` übernommen, kein Fork mehr.

## Was wir dabei gelernt haben

Die vier Regeln stehen ausführlich im HANDOVER. Kurzfassung:

1. **Zwei Höhen für Wasser** — klassifizieren und zeichnen sind nicht dasselbe. Liegt die gezeichnete
   Ebene auf dem Höhenraster, flackert sie gegen Deckflächen.
2. **Bauten heben sich über das Wasser**, nicht umgekehrt — sonst entscheidet eine einzige Zelle, ob
   es überhaupt Wasser gibt.
3. **Eine Zahl, ein Radius** — zwei getrennt gerechnete Breiten für Bett und Carve ergeben
   überlappende Cubes.
4. **Rauschen braucht einen Parameter, der Spiegelungen bricht** (Bogenlänge) und eine
   Kontrastspreizung, sonst schluckt die Quantisierung die Variation.

Fünftens, methodisch: dreimal habe ich am selben Zahlenwert gedreht, statt die Ursache zu suchen.
Die Runden, die etwas gebracht haben, begannen mit einer Messung und endeten mit **einer**
strukturellen Änderung.

## Offen

- **cardGrid** in `media/kfb/index.json` — wartet auf die Card-&-Ink-Specs.
- **Zonen-Registry**: mehrere Zonen, Flüsse dazwischen, Academy-Status persistent.
- **Cartoon-Deformer** für Kenney-Props (Briefing in `uploads/`).
- **Tusche**: im Lab abgeschaltet. Der Screen-Space-Sobel legt ein Raster über das Voxel-Feld; die
  KFB-Kante gehört aus `cardbuilder/kfb-ink-canon.js` pro Objekt abgeleitet.
