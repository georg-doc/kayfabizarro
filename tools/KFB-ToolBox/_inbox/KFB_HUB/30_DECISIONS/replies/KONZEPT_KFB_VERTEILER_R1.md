# Konzept · Ein stochastischer KFB-Verteiler für alle Ebenen der Welt (V-1007) · R1 · 29.10.2026

**Warum:** Georg 29.10.: Die gleiche Wahrscheinlichkeits- und Nachbarschafts-Logik wie bei Farbbändern, Props und Kleinteilen (V-1004 bis V-1006) soll für den Himmel, die Planeten, die Klänge und die NPCs gelten. Später soll sie mit der Karten-Saat verbunden werden: Ein Deck bringt seine Farb-, Biom- und Prop-Logik mit. So entsteht eine globale, fraktal nutzbare Verteilungsfunktion für KFB, statt pro Ebene eigener Zufall.

## 1 · Der Kern
- **Eine Saat-Hierarchie:** Welt-Saat → Zone bzw. Thema → (später) Deck-Saat → Zelle → Gruppe. Jede Ebene erbt von der darüber und würfelt nur ihren eigenen Anteil. Alles ist deterministisch und reproduzierbar: gleicher Ort, gleiches Bild.
- **Eine Gewichtstabelle je Ebene** als Daten, nicht Code. Sie enthält:
  - Nachbarschaften (was folgt worauf, mit welchem Gewicht),
  - Gruppen-Sätze nach der Dreier-Regel,
  - eine kleine Ausreißer-Quote für surreale Kombinationen.
- **Ein Löser:** `kfb-place` bzw. der WFC-Teil daraus. Alle Ebenen nutzen denselben Löser mit eigener Tabelle. Neue Ebenen sind neue Tabellen, kein neuer Code.
- **Prüfung je Ebene:** Häufigkeiten über eine lange Fahrt zählen. Sie sollen den Gewichten folgen, Ausreißer selten bleiben, keine verbotene Nachbarschaft auftreten.

## 2 · Ebenen
| Ebene | Was verteilt wird | Stand / Quelle |
|---|---|---|
| Farbbänder | Farbrollen-Nachbarschaften (auf Orange meist Lila, selten Hellblau) | V-1006, `terrain3`, `replies/COLOR_CONCEPT_R1.md` |
| Themen und Props | Themen-Sätze (Wüste: Oase, Palme groß + zwei klein, Kügelchen, Gras), seltene Ausreißer (Schnee-Bäume in der Wüste) | V-951, V-1006, Prop-Pool V-920 |
| Kleinteile | Materialcodes, Fundstücke, Fluff-Nester, Blumen nach der Dreier-Regel | V-1004, V-1005 |
| **Himmel: Wolken** | Formen, Dichte, Schichten, Färbung der Schattenseiten aus der Palette | `src/modules/sky-drive.js` (`cloudLayer`, Licht- und Schattenton schon vorhanden) |
| **Himmel: Verlauf** | Horizont- und Zenitfarbe als Nachbarschaft zur Bandpalette, nicht frei gewürfelt | `sky-drive.js` (`uHorizon`, `uZenith`, `skyColor`) |
| **Planeten** | mehrere Himmelskörper, verteilt statt gehäuft (Mindestwinkel zwischen ihnen), Größe und Farbe variiert; Typen: Knet-Riesenmond, Ringplanet, der lila Planet, selten die Erde | heute ein Körper in `sky-drive.js` (`uMoon`: Knet-Mond bzw. Ringplanet); erweitern auf N Körper; nicht die Quaternius-Planeten (Georg) |
| Klänge | Klangbetten, Schichten und Musik je Thema, seltene Ausreißer | WS1 Slice I6, Audio-Site, Musik-Katalog |
| NPCs und Begegnungen | Szenen, Kartenviertel, Mindsphere, Dioramen, Krater als Begegnungs-Pool | WS1 Slice I3, V-941, V-1002 |

## 3 · Karten-Saat (Ausbau)
Ein Deck verschiebt die Gewichte. Ein verschwörungstheoretisches bzw. dystopisches Deck bringt zum Beispiel dunklere Farbrollen, Überwachungs- und Beton-Props, MiB-Türme, Dystopie-Drone als Klang und seltenere Blumen. Dieselbe Tabelle bekommt dafür nur einen Deck-Aufschlag, keine eigene Logik. Das Kartenviertel (V-1002) nutzt das direkt.

## 4 · Fraktal für die Spielmechanik
Dieselbe Funktion bestimmt auch, wo Goo befällt, wo Fluff-Quellen liegen, welche Gebäude ein Viertel bekommt und welche Fundstücke wo eine Spur bilden. Die Spielwelt wird dadurch auf jeder Ebene, von Welt über Zone, Viertel und Gruppe bis zum Element, nach denselben Regeln komponiert.

## 5 · Reihenfolge
1. **WS1 Slice I2:** Löser und Gewichtstabellen für Farbbänder, Themen, Props und Kleinteile (V-1004 bis V-1006).
2. **WS-Audio I6:** dieselbe Saat-Hierarchie für Klangbetten.
3. **Nach dem Reset (WS0):** Himmel (Wolken-Variation, Verlauf aus der Palette) und Planeten (N Körper, verteilt, Größen und Farben, seltene Erde). Design zuerst als Bild-Karte.
4. **Später:** Deck-Saat, Begegnungen und NPCs über dieselben Tabellen.
