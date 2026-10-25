# Mentales Modell Welt R2: so baut KayKit (Georg 25.10.: q210/q211 FAIL, „schaut euch die Creator-Videos an“)

Quellen, diesmal wirklich angesehen:
- Kay Lousberg, „Basic Environment and Lighting Setup in Godot“ (YouTube Vfr3n4WKsc0): Bilder bei 5:00, 10:00, 16:40.
- KayKit Medieval Hexagon Pack: Samples/sample1–2.
- KayKit Medieval Builder Pack: Samples/sampleA–E.
- Georgs Farmer-Promo.
- Kays Live-Shows 1 und 9: nur Prop-Modellieren, kein Szenenbau; für das Modell ohne Belang.

## Was dort zu sehen ist

1. **Boden = Materialzonen.**
   - Gras, Feld, Weg, Sand, Wasser und Fels sind Flächen in einer flachen Farbe mit klarer Kante.
   - Ein Weg ist eine Bodenfarbe, gesäumt von einer Mauer, und keine Kette aus Steinen.
   - Erdung macht das Material: Kontaktschatten unter dem Teil, Farbe am Fuß. Steinchen-Geometrie gibt es nicht.
2. **Bewuchs = Massen.**
   - Wald ist eine dichte Masse aus Bäumen, Schulter an Schulter, die eine ganze Zone füllt.
   - Am Rand stehen wenige Einzelgänger. Dazwischen liegt freie Fläche.
   - Kleine Gruppen mit Stützen, Kieseln und Fußgras gibt es nirgends.
3. **Steine = Formationen.**
   - Große, gestapelte Fels- und Klippenblöcke, dazu selten ein einzelner Brocken.
   - Kein Streukies, kein Nest um jede Gruppe.
4. **Wenige, große Teile.**
   - Jedes Teil ist im Bild gut lesbar. Haus, Baum und Fels haben ähnliche Größenordnungen.
   - Im Godot-Bild sind die Bäume fast so hoch wie das Haus.
5. **Gelände.**
   - Weich und hügelig, eine Grundfarbe. Licht und Nebel machen die Tiefe.
   - Die Fließfarben bleiben bei uns, wie Georg es will. Sie sind unser Bodenmaterial, und die Zonen liegen darauf.

## Was wir falsch gemacht haben

Wir haben Mikro-Grammatik gebaut: Anker, Stützen, Kiesel, Kontaktsteinchen, Fußgras, Moosfugen. Jede Gruppe wurde zu einer kleinen Insel und mit Regeln poliert. Das ist „gebastelt“ und Clutter, kein natürliches Verteilungsmuster.

## Neues Modell (zur Freigabe)

- **Ebene 1, Zonen:** Ein Feld aus Rauschen und Ursache (Höhe, Hang, Wasser, Weg) teilt den Boden in Materialzonen: Wiese, Waldboden, Weg/Erde, Fels, Wasserrand.
  - Die Zonen werden in den Boden gemalt (Materialcode).
  - Die Fließbänder bleiben die Wiesen-Textur.
- **Ebene 2, Massen:** In Waldzonen füllt ein Poisson-Feld mit hoher Dichte die Fläche mit Bäumen, Kronen dicht an dicht.
  - Zum Zonenrand nimmt die Dichte ab, dort stehen wenige Einzelbäume und Büsche als Saum.
  - In Wiesenzonen steht fast nichts: selten ein Solitärbaum oder Busch.
- **Ebene 3, Formationen:** Fels nur dort, wo das Gelände bricht (Hangkante, Ufer), als große Formation aus 1 bis 5 großen Blöcken.
- **Ebene 4, Akzente:** Stumpf, Fluff, Fundstück: wenige, gezielt, an der Story.
- **Gestrichen:**
  - Kontaktsteinchen, Fußsteinchen, Moosfugen als Objekte.
  - Grasbüschel als Streu: Gras ist Bodenmaterial, Büschel nur als Saum an Zonenkanten.
  - Kiesel-Nester.

Nächster Schritt nach Georgs Ja: ein Stilbild im Spiel (Zonen + Waldmassen + Wiese) und erst dann Regeln und Löser.
