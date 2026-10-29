# Konzept · Kartenviertel als Hauptachse der Karten-Platzierung in der prozeduralen Welt (V-1002) · R1 · 29.10.2026

**Warum:** Georg 29.10.: Wenn die Cascade-Sphere-Mechanik funktioniert (Kartengebäude, Gutter, Zerstörung und Heilung), wird sie neben Mindsphere, Dioramen und Landmarken zur Hauptachse, wie Karten in der Welt stehen. Ein Deck wird ein Viertel.

## 1 · Das Bild
Ein Kartendeck wird ein kleines, surreales Stadtviertel:
- **Je Karte ein Block** mit der Kartennummer als Hausnummer. Die Deckgröße ist frei (56, 63 …), der Generator skaliert.
- **Am Eingang** steht das Deck-Cover als großer 2D-Pappaufsteller (Billboard).
- **Gebäude** sind ein Mix aus 3D-Assets und einfachen Blöcken mit Dachformen und Höhenmustern.
- **Eine HyperNorm-Schicht überzieht das ganze Viertel**, gesät aus den Karten des Decks und ohne Wiederholung. Man kann sie wegschießen, heilen oder umbauen.

## 2 · Bausteine (alle aus der Cascade Sphere übernommen, keine Doppelungen)
| Baustein | Quelle | Rolle im Viertel |
|---|---|---|
| `cascade-core` | Cascade Golden (V-962 R4) | ein Zustands-Besitzer: Schaden, Heilung, Fluff-Fluss, Belohnung |
| Kartengebäude | Konzept Cascade §4d, §4d.2 | Hülle, Kartenkern, Kugeln, Treffer-Löcher mit Wandstärke und Brandspur |
| `kfb-curb` | `replies/SPEC_GUTTER_CURB_R1.md` | Gutter und Bürgersteig. **Skins:** Stadt (Pflaster, Bordstein), Höhle (Felskante), später weitere |
| Materialadapter | Cascade §4f | Bänder, Knete, Stoff, HyperNorm, auch auf Originalgebäuden |
| HyperNorm H15 | `site-extra/h15`, `src/world/MindSphere.jsx` | **eine** Bildquelle je Viertel, Karten-Saat = Deck, Unähnlichkeits-Auswahl der Engine gegen Wiederholung |
| Impact-Physik | Cascade §4f | Gatling, Rakete und Racer, Materialantwort |
| `fx-burst` | Cascade §6b | Rauch, Trümmer, Funken, Flammen, Fluff, mit Schummeln |
| Fluid-Shader | Wasser/Fluide im Spiel (V-750, V-904) | Fluff-Ströme bergab, Seen am Viertelrand |
| Grundriss | Random Maze (V-984/V-988), OSM-Variante | rund, eckig, Labyrinth oder Stadtplan |

## 3 · Spielmechanik in allen Fortbewegungsarten
- **Zu Fuß bzw. Jetpack:** schießen, sammeln, umleiten, reparieren (Cascade-Schleife).
- **Aus der Luft:** dasselbe aus der Höhe, Greifhaken zwischen Dächern.
- **Mit dem Racer:** Durchbrüche nach der Impact-Physik. Abprallen, Abgleiten oder Durchbrechen mit Energieverlust, Cartoon-Bounce, die Fahrt geht weiter. Beispiel: Gischt vom See trifft die Uferpromenade, Rauchwolke, Fluff-Kugeln frei, Bounce, weiter.
- **Ziel:** Das Viertel heilen bzw. befreien heißt, das Deck in den Almanach holen (Anschluss an Karten-Relief V-751, „eine Runde sammelt die Karte“).

## 4 · Ausstattung (aus dem Bestand, über `kfb-place`)
- **Stadtmöbel:** Ampeln, Laternen (später leicht im Wind wiegend), Billboards, unsere 2D-Pop-ups. Dazu Hausnummern-Schilder mit der Kartennummer.
- **Brettspiel-Teile:** große Schachfiguren u. a. aus KayKit BoardGameBits, für die satirisch-absurde Ludo- bzw. Meta-Spiel-Logik.
- **Surreale Landmarken:** Riesen-Schuh, Kaffeetasse, Katze im Bierglas, Dioramen. In Originaltextur oder über den Materialadapter, prozedural kombinierbar.
- **Bäume und Natur:** aus dem Prop-Pool (V-920), nach den Etherington-Regeln.

## 5 · Einbau in die prozedurale Welt
- **Begegnungs-Pool (Slice I3, V-941):** Das Kartenviertel wird eine Begegnungsart neben Mindsphere, NPC-Szenen, Diorama und Krater. Auslöser zufällig oder passend zum Ort.
- **Themen-Saat (V-951):** Das Deck bestimmt Palette, Gebäudemix und Skin, das Thema des Orts mischt mit.
- **Endlos-Welt (V-815, „Karten je Zone“):** je Zone ein Viertel, Gedächtnis je Zelle (geheilt, zerstört, gesammelt).
- **Mindsphere:** Die Kuppel kann als Hauptort im Zentrum eines Viertels stehen (Glocke, Turm, Dom als Alternativen).

## 6 · Reihenfolge
0. **Cascade Golden (WSA, läuft):** beweist Kern, Kartengebäude, Gutter und Treffer.
1. **Nach dem Golden und dem Reset (WS0):** `cascade-core`, Kartengebäude, `kfb-curb`, `fx-burst`, Impact-Physik als Module ins Hauptspiel übernehmen (gleiche Architektur, Plug-and-Play).
2. **Erstes Kartenviertel in der Endlos-Welt:** ein Deck, Maze-Grundriss, Cover-Billboard, Hausnummern. Design zuerst.
3. **Skins und Wasser:** Höhlen-Skin für `kfb-curb`, Fluff-Strom und See mit Fluid-Shader, Racer-Durchbruch an der Promenade.
4. **Ausstattung:** Stadtmöbel mit Wind, Brettspiel-Teile, surreale Landmarken, Dioramen.

## 7 · Grenzen und Risiken
- **Leistung:** eine HyperNorm-Quelle je Viertel, keine Engine je Gebäude. Kugeln instanziert, nur wenige mit echter Physik.
- **Lesbarkeit:** Die Collage darf wild sein, Silhouetten, Wege und Interaktionen bleiben lesbar (Cascade §4f).
- **Keine Bastelei:** Übergänge nur über `kfb-curb` bzw. die Erdlippe. Mechanische Prüfung vor jedem Bild (Spec §5).
- **Nicht vor dem Golden ausbauen.**
