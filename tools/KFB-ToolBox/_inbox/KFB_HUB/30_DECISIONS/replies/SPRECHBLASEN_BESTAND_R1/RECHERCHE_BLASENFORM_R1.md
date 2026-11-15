# Recherche Blasenform R1

Stand 15.11.2026. Web-Treffer sind verlinkt. Alles andere ist Wissen und so markiert.
Das Web liefert keine Paper zu "procedural burst balloon". Es gibt nur Handwerksquellen und kleine Open-Source-Projekte.

## Grundprinzip für alle Formen (Wissen)
- Erst die Textbox messen (Breite w, Höhe h in Pixeln). Dann eine Basiskontur daraus bauen.
- Die Kontur wird immer bei Endgröße erzeugt. Nie eine feste Form per scale(x,y) strecken.
- Entlang der Kontur nach Bogenlänge arbeiten, nie nach Winkel. Winkel verteilt Zacken auf breiten Boxen schlecht. Das ist die Ursache des "einen gestreckten Zackens".
- Basiskontur: Superellipse |x/a|^n + |y/b|^n = 1 mit n = 2.6 bis 4 (Rundrechteck-Look), a = w/2 + Rand, b = h/2 + Rand. Rand = 0.35 mal Zeilenhöhe plus Zackenhöhe.
- Zufall pro Instanz: seeded PRNG (mulberry32, public domain). Seed = Hash aus Sprecher-ID plus Text. So bleibt die Blase beim Neuzeichnen stabil.
- Text-Safe-Box: die Textbox plus 0.5 Zeilenhöhe Polster. Keine Kante, kein Tal darf in diese Box. Nach dem Bau prüfen und Basiskontur sonst vergrößern.

## 1. Schrei- und Burst-Blasen
Handwerk: Klein beschreibt Burst-Ballons als gezackte Form für Schreien ([Comicraft-Glossar](https://balloontales.com/?p=418), [Balloon Tales Sawtooth](https://balloontales.com/sawtooth-balloons/)). Sawtooth entsteht durch abwechselnd nach außen geschobene Ankerpunkte.
Code-Referenz: [pretext-comic](https://awesome.ecosyste.ms/projects/github.com%2FShipItAndPray%2Fpretext-comic) nutzt eine sinusmodulierte Breite. Das skaliert auf breite Boxen schlecht. Lizenz dort nicht geprüft.

Algorithmus (Wissen):
1. Umfang U der Superellipse numerisch berechnen (200 Samples, Längen summieren).
2. Zielabstand s = 1.6 bis 2.2 mal Zeilenhöhe (Basis-Zackenbreite). Zahl der Zacken N = round(U / s), mindestens 8.
3. Spitzen-Positionen: gleichmäßige Schritte u_i = i·U/N plus Jitter j_i in ±0.25·s. Jitter nicht unabhängig ziehen, sondern als Random Walk mit Rückzug (Summe der Jitter ≈ 0), damit der Ring schließt. Alternative: 1D-Poisson-Disk mit Mindestabstand 0.7·s ([Bridson 2007](https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf), 1D-Variante: Abstand zufällig in [0.75 s, 1.25 s], dann Gesamtlänge auf U skalieren).
4. Spitzenhöhe: H_i = H0·(0.75 + 0.5·r_i), H0 = 0.6 bis 0.9 mal Zeilenhöhe. Deckel bei H_i ≤ 1.3·H0. Das ist die Regel gegen den gestreckten Zacken. Die Höhe hängt nie von Breite oder Höhe der Box ab.
5. Spitze = Basispunkt plus Normale mal H_i. Täler = Basispunkt zwischen zwei Spitzen, leicht nach innen (−0.1·H0).
6. Die Normalen an den Ecken der Superellipse glätten (Mittel aus 3 Nachbarn). Sonst klappen Zacken an Ecken zusammen.
7. Täler glätten: Tal als quadratische Bézier-Kurve statt Spitzknick, Kontrollpunkt am Basispunkt. Spitzen bleiben scharf. Optional: Zacken leicht schief (Spitze um ±0.15·s entlang der Tangente verschoben).
8. Abwechselnd lange und kurze Zacken (Muster L,K,L,K mit Zufallsbruch) wirkt handgemacht.
Prüfung: jeder Tal-Punkt liegt außerhalb der Safe-Box. Sonst Basis um 4 px wachsen lassen und neu bauen.

## 2. Gedankenwolke
Handwerk: Wolkenform mit Kreisreihe zum Kopf ([Klein/Comicraft](https://balloontales.com/?p=418), [Thought Balloons Roundtable](https://balloontales.com/?p=411)).
Algorithmus (Wissen):
1. Basis: Ellipse oder Superellipse n = 2.2 bis 2.8 mit a = w/2·1.1 + r_max, b = h/2·1.1 + r_max. Dadurch bleibt der Text innerhalb der Bögen.
2. Umfang U numerisch. Bogenradien r_i ∈ [0.8, 1.25]·r0 mit r0 = 0.9 bis 1.3 mal Zeilenhöhe. Zufall aus Seed.
3. Entlang U Bögen so legen, dass die Summe der Sehnen 2·r_i·0.8 genau U ergibt. Letzte Bögen proportional anpassen (Faktor f = U / Summe, auf alle r_i angewendet). Nie nur den letzten strecken.
4. Jeder Bogen ist ein SVG-Arc (A r r 0 0 1 x y) zwischen zwei Basispunkten, Ausbuchtung nach außen. Benachbarte Bögen überlappen um 15 bis 25 Prozent, so sieht es nach Wolke aus.
5. Prüfen: Das innere Bogenmaximum (Tiefe der Täler) bleibt außerhalb der Safe-Box.
6. Schweif: 3 Kreise von der Wolke zum Kopf, Radien 0.45, 0.3, 0.18 mal r0. Abstände wachsen (1.0, 1.2, 1.5 mal Durchmesser). Mittellinie leicht gekrümmt (quadratische Bézier). Ankerpunkt = Schnitt Wolke und Strecke zum Kopf-Zielpunkt.

## 3. Papierkanten-Blasen (gerade Kanten, integrierter Schweif)
Handwerk: "Loaf of bread" = fast quadratisch, oben schmaler, unten breiter, jede Blase leicht anders ([Glossar](https://balloontales.com/?p=418)). Das ist genau der Look, den wir wollen.
Algorithmus (Wissen):
1. Vier Eckpunkte der Safe-Box plus Rand (0.6 Zeilenhöhe). Jede Ecke um Zufall verschieben: Betrag ≤ 0.25·Zeilenhöhe, Richtung beliebig. Oben-Verschiebung nach innen leicht bevorzugt (Brotlaib).
2. Skew: Gesamtneigung ±2 bis 3 Grad. Kanten bleiben gerade. Optional zusätzlicher Knick in langen Kanten (Kante > 8 Zeilenhöhen, Mittelpunkt ±0.15·Zeilenhöhe seitlich).
3. Ecken minimal abrunden (r = 2 bis 4 px) oder spitz lassen, nach Stilregel. Pro Instanz nur ein Stilwert.
4. Verbotene Wiederholung: Seed-Wert für Ecken und Seed für Schweif trennen. Aufeinanderfolgende Blasen im selben Panel erhalten verschiedene Neigungsvorzeichen.
5. Schweif: Anker an der Kante, die dem Sprecherkopf am nächsten liegt. Ankerposition muss mindestens 1.0 Zeilenhöhe vom nächsten Eck entfernt bleiben. Schweifbreite an der Basis 0.8 bis 1.4 mal Zeilenhöhe. Spitze zeigt auf den Kopf-Zielpunkt, stoppt aber 0.5 Kopfradius davor. Schweif schneidet nie die Safe-Box. Schweif ist Teil desselben Pfades (kein getrenntes Dreieck), damit Rand und Füllung nahtlos sind.
6. Zwei Blasen vom selben Sprecher: nur eine bekommt einen Schweif (zweite = Kette per Verbindungsbalken).

## 4. Erzähler-Kästen und Spielwahl
Handwerk (Wissen, bestätigt durch [Klein Design Basics](https://kleinletters.com/DesignBasics.html) und [Piekos-Buch](https://www.Blambot.com/pages/the-essential-guide-to-comic-book-lettering)):
- Kasten ist rechteckig, am oberen oder unteren Panelrand, bündig an der Panelkante oder knapp innen. Kein Schweif.
- Lesereihenfolge: oben links zuerst. Ballons folgen links nach rechts, oben nach unten.
- Erzähler und Sprecher klar durch Form trennen: Kasten = Rechteck, farbige Fläche (gelb/creme). Zweiter Erzähler = andere Farbe.
- Text: Versalien, 1 bis 1.5 Zeilenhöhe Innenabstand, Zeilenumbruch zentriert im Ballon, linksbündig im Kasten.
- Rahmen: Linie 2 bis 3 px. Blasen dürfen Kasten nie überlappen.
- Gedankenwechsel oder Funk: gezackt-elektrisch oder gestrichelter Rand (Wissen).

Spiele (Wissen, ohne Web-Belege):
- Telltale (Walking Dead): Antwort-Optionen als 4 Kästen im Kreuzmuster (oben, links, rechts, unten), kurze Stichworte, Timer-Balken. Comic-Look mit dicker Tinte.
- Night in the Woods: Sprechblasen über dem Kopf, Auswahl als kurze Liste, Cursor springt.
- Oxenfree: Blasen am Kopf des Sprechers, Antworten erscheinen als kleine Blasen und laufen ab, wenn man nichts wählt.
- Monkey-Island-Chat: Liste unten im Bild, Hover-Farbe, Auswahl ersetzt sich durch gesprochene Zeile.
Muster für uns: Spielerantworten als kleine Papierkanten-Kästen in einer Spalte, aktive Option leicht gedreht und höher, Maximalzahl 4, Timer optional.

## 5. Soundwörter (SFX)
Handwerk (Wissen, [Blambot](https://www.Blambot.com/pages/the-essential-guide-to-comic-book-lettering), Eisner "Comics and Sequential Art"):
- Wörter sind Teil des Bildes: groß, fett, Kontur plus Füllung plus Schlagschatten.
- Gewicht: Buchstaben dick (Strichstärke ≥ 0.2 mal Höhe). Rundum Außenkontur 4 bis 8 Prozent der Höhe, in dunkler Farbe.
- Perspektive: Wort wächst zum Ziel hin. Buchstabenhöhe steigt linear um 20 bis 40 Prozent von Anfang zu Ende.
- Bogenlayout: Buchstaben entlang einer Kurve (SVG textPath oder eigene Platzierung), Winkel = Tangente.
- Überlappung: Buchstaben dürfen sich um 5 bis 10 Prozent der Breite überlappen. Der nächste Buchstabe liegt oben.
- Jitter pro Buchstabe: Rotation ±4 bis 8 Grad, Skalierung 0.9 bis 1.15, y-Versatz ±5 Prozent. Seeded. Nie mehr als ±10 Grad, sonst unlesbar.
- Extrusion: n Kopien (6 bis 12) mit Versatz (dx, dy) = (1, 1)·k·0.6 px, dunklere Farbe, hinten gezeichnet. Dann Vordergrund mit Konturstrich.
- Hintergrund: Burst-Form (siehe Punkt 1) hinter dem Wort, andere Farbe als das Wort. Wort darf den Burst überragen.
- Farbpaare: Füllung hell (gelb, weiß), Kontur dunkelrot oder schwarz.
- Lesbarkeit zuerst: höchstens 8 Zeichen pro Wort, Kontrast Füllung zu Kontur ≥ 4:1.

## Bibliotheken
- [rough.js](https://github.com/rough-stuff/rough), MIT. Handgezeichnete Linien und Flächen. Für Blasenränder mit Seed (option seed) nutzbar. Zufallsabweichung auf bewusst kleine Werte setzen (roughness 0.6 bis 1.0).
- [perfect-freehand](https://github.com/steveruizok/perfect-freehand), MIT. Druckempfindliche Strichkontur. Gut für verjüngte Tinten-Ränder.
- [simplex-noise](https://github.com/jwagner/simplex-noise.js), MIT. Glatter Zufall entlang der Bogenlänge statt Weißrauschen.
- [d3-polygon / d3-shape](https://github.com/d3/d3-shape), ISC. Pfade und Kurven.
- [pretext-comic](https://awesome.ecosyste.ms/projects/github.com%2FShipItAndPray%2Fpretext-comic): Lizenz offen. Nur als Idee ansehen.
- Papier mit emotionsgesteuerten Balloons: [Automatic Comic Generation (arXiv 2101.11111)](https://arxiv.org/pdf/2101.11111). Gezackte Kontur für verbale Konflikte, Formwahl nach Emotion.

## Weitere Quellen
- Scott McCloud, "Making Comics" (2006): Kapitel Wörter und Bilder, Balloon-Typen und Lesefluss (Wissen).
- Todd Klein: [Design Basics](https://kleinletters.com/DesignBasics.html) und [Kunst und Geschichte des Letterings](https://kleinletters.com/Blog/the-art-and-history-of-lettering-comics/).
- Nate Piekos: [Essential Guide to Comic Book Lettering](https://www.Blambot.com/pages/the-essential-guide-to-comic-book-lettering), Kapitel 5 Ballons.

## Für uns zuerst
1. Burst: Superellipse aus Textbox, Zackenzahl N = round(Umfang/(1.9·Zeilenhöhe)), Spitzen nach Bogenlänge mit Random-Walk-Jitter ±0.25 s, Höhe fest 0.75 bis 1.3 mal H0 (unabhängig von der Boxgröße), Täler als Bézier, Safe-Box-Prüfung.
2. Gedanke: Superellipse n=2.5, Bögen nach Bogenlänge mit r ∈ [0.8,1.25]·r0, Skalierfaktor f = U/Summe auf alle Radien, Bögen überlappen 20 Prozent, 3 Schweifkreise 0.45/0.3/0.18·r0.
3. Papierkante: vier Ecken der Safe-Box um ≤ 0.25 Zeilenhöhe seeded verschieben, Neigung ±2.5 Grad, Schweif als Teil desselben Pfades, Anker ≥ 1 Zeilenhöhe vom Eck, nie in die Safe-Box.
4. Erzähler und Wahl: Rechteck-Kasten ohne Schweif an Panelkante; Spielerantworten als Spalte aus höchstens 4 kleinen Papierkanten-Kästen, aktive Option leicht gedreht.
5. SFX: Wort als Einzelbuchstaben mit seeded Rotation ±6 Grad, Skalierung 0.9–1.15, Bogenlayout, Extrusion 8 Kopien, dicke Kontur, Burst aus Punkt 1 dahinter.
6. Regel: Form immer bei Endgröße aus Textmaß und Zeilenhöhe erzeugen, Zufall nur seeded pro Instanz und nur innerhalb fester Grenzen, nie per Nicht-Uniform-Skalierung strecken.
