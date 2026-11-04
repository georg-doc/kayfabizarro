# Slops als Zensurwesen · Metanarrativ R1 · 04.11.2026 · WS0 (Georg 04.11.)

Bindend für Writer's Room, Spielablauf, Effekte und Bauten. Baut auf V-846 (Goo = Zensur-Tinte), V-1319 (Zensur-Tintenspuren), V-1416 (Kontroll-Eskalation: Slops springen aus zerstörten Häusern), V-1047 (Bewohner mit Karten und Weltwissen) und der Combat-Arena-Logik (geschwärzte Karte).

## 1 · Kern in drei Sätzen
- Slops sind die **Bewohner der HyperNorm-Gebäude** und zugleich **Zensurwesen**. Sie können nur Schwarz-Weiß denken, verfehlen sich und ihre Umwelt in falscher Dialektik und wollen kognitiv dissonante Karten „einhegen“: schwärzen, zudecken, glattbügeln.
- Motiviert, gedrängt oder in übererfüllter Freiwilligkeit angestachelt werden sie von den Men in Black und von Hunky & Dory. Sie stellen eine satirische „böse Gegenmacht“ dar, mit Meinungskontrolle und Propaganda je Typus und Cluster.
- Alles mit Augenzwinkern und Herz: für die Slops wie für die Men in Black. Spielbar ist auch die dunkle Seite: Räume einhegen und Resonanzräume schaffen, die nur noch schwarze Zensurmasse (Black Fluff) produzieren. Das ist Satire als gesellschaftskritische Spielebene, mit Selbst- und Meta-Bewusstsein in satirischer Doppelbrechung.

## 2 · Was im Spiel passiert (Ursache → Wirkung)
1. **Zerstörtes Gebäude:** Die Slops wohnen darin und springen heraus. Je Typus reagieren sie verwirrt, unzufrieden oder kämpferisch. Rufe und Haltung kommen aus der Slop-Karte (Writer's Room).
2. **Was herausfällt, ist keine bunte Beute, sondern Zensurmasse:** Ink-Blobs bzw. Black-Fluff-Glue, dunkel, matt glänzend und klebrig (dieselbe Tinte wie Slop-Goo und Lande-Spritzer). Die Menge ist ein Datenwert. Die Blobs rollen und sickern ein (Modul einsickern).
3. **Die Karte im Inneren** des Gebäudes ist zuerst geschwärzt bzw. zensiert, wie in der Combat-Arena. Je mehr Slops und Blobs herauskommen (nicht exakt, als Faktor), desto mehr Tinte läuft von oben nach unten ab und **enthüllt das Motiv**.
4. **Metanarrative Gegenrichtung:** Die HyperNorm-Gebäude stellen sich darüber auf. Die Fassade ist die normierte Oberfläche, die Karte darunter die dissonante Wahrheit.
5. **Eskalation** wie V-1416: Slops (Trash/Common/Elite) → Toy Soldiers → Men in Black verhören (Triplet-Logik, Spieler antwortet Bingo/Boggle/Bongo/Blödsinn) → Aliens bzw. H&D.

## 3 · Offene Punkte und Widersprüche (WS0-Vorschlag)
- **Bunte Kugeln aus Gebäuden (spill.js) vs. Zensurmasse:** Gebäude geben künftig schwarze Blobs ab. **Vorschlag:** Bunter Fluff entsteht, wenn der Spieler Zensurmasse auflöst (Slop besiegt bzw. Blob platzt): Aus Schwarz wird Farbe, die „Ent-Zensur“ ist die Ernte. Die Ökonomie bleibt, ihre Bedeutung dreht sich. Georg bestätigt.
- **Slop-Tod** (Platzen plus Papierschnipsel, V-1416/q-Regel): passt; Schnipsel sind Fetzen der zensierten Karte.
- **Spielbare dunkle Seite** (MiB bzw. Slop als Spielerfigur, V-1027): nur als Konzept, nach MVP.

## 4 · Wer was übernimmt
- **Writer's Room (b330):** Backstory je Familie und Typus: welche Dissonanz der Slop „einhegt“, seine Schwarz-Weiß-Logik, seine Beziehung zu MiB bzw. H&D (gezwungen, motiviert, übererfüllend), Quirks. Rufe nur aus dem Triplet-Bestand; fehlende als Vorschlag.
- **WS-Design (Aufprall bzw. Bresche, Kartenbau):** Blobs statt bunter Kugeln; Karte im Inneren geschwärzt, Tinte läuft mit der Menge der herausgekommenen Slops von oben nach unten ab. Ein Shader-Wert `enthuellt` 0..1 am Kartenmaterial.
- **Flug (Slops, Goo):** Slops springen aus der Bresche als Gruppe, Reaktion je Typus (verwirrt, unzufrieden, kämpferisch); Blob-Material = Slop-Goo.
- **Verteiler:** Slop-Karte bekommt `rolle.bewohner` (welche Gebäudeklassen bzw. Biome) und `haltung` (verwirrt, unzufrieden, kämpferisch) als Datenfelder.
- **WS1:** Ereignisse `gebaeude.bresche` → `slops.ausbruch` → `karte.enthuellt` über cueBus; Eskalationszähler wie V-1416.
