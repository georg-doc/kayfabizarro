# Modell Dichte über die Fläche · V-1165 · WS-Verteiler, 01.11.2026

**Befund:** Die Kaskade hat oben kein zusammenhängendes Signal. Über 768 m hat keine einzige 64-m-Zelle null Felsen oder Pflanzen, und ein einzelner Fels trägt denselben Hof wie einer mit Nachbarn (Median 47 Kugeln bis 1 m Rand). Darum liest Georg feste Gruppen. Dazu sind Pflanzen und Kugeln im Spiel nur bis 64 m sichtbar: Ein Anschwellen in der Ferne kann man gar nicht sehen.

## Das Phänomen

Eine Landschaft verteilt sich nicht je Objekt, sondern je Standort. Es gibt Standortfelder über Hunderte Meter: Felsiger Rücken, feuchte Senke, Gebüschsaum. Ein Objekt ist eine Stichprobe aus seinem Feld. Was um ein Objekt liegt, hängt davon ab, wie viel Feld dort ist, nicht vom Objekt allein. Ein Fels im Geröllfeld liegt in Schutt, ein Findling auf der Wiese liegt fast sauber.

Zwischen zwei Feldern gibt es keine Linie. Im Übergang (Ökoton) mischen sich die Arten beider Seiten in Flecken, zum Rand werden zuerst die großen Teile selten, die kleinen laufen weiter.

## Die Hierarchie, von oben nach unten

| Maßstab | Was entscheidet | Ergebnis im Bild |
|---|---|---|
| 300–400 m | **Feld** je Standort: Fels, Wiese, Busch, Blume. Verzerrtes Rauschen plus Geländeform, Schwelle lässt große Flächen bei null | Felder, Ausläufer, weite leere Gebiete |
| 32 m | **Zone** (Löser): Vorwissen ist das Feld, Nachbartabelle wie bisher | Körnung im Feld, keine scharfen Ränder |
| 4 m | **Bodenplatz, Quelle** (Löser): Wahrscheinlichkeit = Höchstwert × Feld hoch Exponent × Zonenfaktor | Dichte schwillt stetig, Abfall je Sorte verschieden |
| 1 m–0,25 m | **Stück, Perle, Korn** (Löser): Kurve je Eltern × **Eltern-Stärke** | Viel im Feld, fast nichts beim einzelnen |

**Exponent statt Festwert:** Große Teile folgen Feld², kleine Feld^0,7. Beim Auslaufen verschwinden also zuerst die Felsen, dann die Brocken, zuletzt der Schutt. Niemand baut einen Saum, er folgt aus den Exponenten.

**Eltern-Stärke v:** Aus dem Feld am Objekt und der Zahl gleichartiger Nachbarn bis 8–9 m. Sie multipliziert die Wahrscheinlichkeit und skaliert die Reichweite. Einzeln im leeren Gebiet: v fast null, also fast kein Hof. Kein Festwert je Objekt. Bewuchs um Objekte hängt am Wiesenfeld: In der Geröllwüste keine Blume am Fels.

**Geländeform:** Weiträumige Mulde (Höhe gegen den Ring in 32 m Abstand) hebt Wiese und senkt Fels. Hang senkt Wiese und hebt Fels. Wirkt im Feld, also vor dem Löser. V-708 bleibt: Gelände wird nur gelesen.

**Artenwechsel:** Fleck 16 m aus dem Löser, jede Blume liest ihre Art an einem um rund 6 m zufällig versetzten Ort. An der Fleckgrenze mischen sich beide Arten stetig, im Fleckkern bleibt eine Art.

**Materialcodes:** Nur wo alle Felder niedrig sind (V-1036), dort als Gegengewicht zur Leere, selten.

**Sicht:** Gras und Blumen bleiben halbiert bis rund 140 m sichtbar, sonst sieht niemand das Anschwellen. Kugeln und Kiesel bleiben bei 64 m (V-403, V-1090).

## Bewährte Lösungen

- **Horizon Zero Dawn (Guerrilla, GDC 2017):** Platzierung über Dichte statt über gesetzte Punkte; „WorldData“, also 2D-Karten, teils erzeugt, teils gemalt; datengetrieben, deterministisch, lokal stabil. Übernommen: Dichte aus Feldern als Vorwissen, je Sorte eigene Regel. Gelesen habe ich nur die Zusammenfassung der Folien; die PDF war für mein Werkzeug zu groß. [Folien](https://www.guerrilla-games.com/media/News/Files/GDC2017_VanMuijden_GPUBasedProceduralPlacementInHorizonZeroDawn.pdf), [Seite](https://www.guerrilla-games.com/read/gpu-based-procedural-placement-in-horizon-zero-dawn)
- **Verzerrtes Rauschen (Inigo Quilez):** Rauschen an einem durch Rauschen verschobenen Ort ergibt gewachsene statt rasterförmiger Formen. Aus eigenem Wissen, der Artikel war beim Abruf nicht erreichbar (404). [Artikel](https://iquilezles.org/articles/warp/)
- **Ökoton:** Übergangszone, in der zwei Gemeinschaften sich mischen, an den Rändern oft als Mosaik. [Wikipedia](https://en.wikipedia.org/wiki/Ecotone)
- **Etherington #117, #170** (`FRAKTAL_R1.vor_WFC.md` §2): Ruhe und Unterbrechung. **V-797:** Zonen und Massen statt Clutter.

Nicht gelesen: Ghost of Tsushima, die Suche lieferte nur die gesperrte Vortragsseite.

## Was das nicht löst

Bäume und große Formationen kommen weiter aus dem vorhandenen Pass und folgen den neuen Feldern nicht. Sie sind nur Eltern. Ufer ist draußen. Der Rand der fernen Pflanzen bei 140 m ist eine Sichtgrenze und kein Muster.
