# RETURN · KFB Clay Stage R2 · 02-Bogenpfeil + Bühne/Vorhang nach Georgs Review (09.10.2026)

Von Claude Design an Georg / Web Lead / WSA. Claude Design pusht nicht. Lieferung = ZIP + Preview.
Einstieg: `KFB Clay Stage R2.dc.html` (statischer Server). Bühne braucht WebGPU. R1 (`KFB Clay Stage R1.dc.html`, `KFB_Clay_Stage_R1/`) bleibt unverändert.

## Fünf Zeilen
- **Ziel:** 02 Boomerang Arrow als sauberer Bogenpfeil; Bühne + Vorhang auf einen MVP-fähigen, aufgeräumten Stand.
- **Eigentümer:** Billboard Media Residency (Billboard Family) · Theatre Curtain Core (Issue #372).
- **Quelle:** R1 dieses Projekts · Vorhang-Kern `candidate/kfb-curtain-core.js` @main (gelesen: DIM, Panel, Hardware-Optionen) · Georgs Review-Kommentare 09.10.
- **Geschützte Grenze:** Vorhang-Kern und Vertrag unverändert. R1, Billboard Family v1, CLAY-01, H13 unverändert. Familien 01, 03–07 unverändert.
- **Fertig, wenn:** 02-Schaft ist ein Kreisbogen ohne Dellen, Kanal läuft in die Spitze, Blink-Spitze sitzt darauf und folgt dem Schwung; Vorhang schließt rundum, Saum setzt auf, Bretter durchgehend, keine Behelfsstreben und Kleinteile.

## Was sich geändert hat
**02 Boomerang Arrow** (`billboards/kit.js`, neu `arcArrow`, `insetTri`)
- Schaft = exakter Kreisbogen (C = [3,6; fy+0,6], R 6,4 m, 158° → −20°). R1 lief über eine Spline durch sechs Handpunkte: daher die Dellen und der schräge Anfang.
- Anfang liegt verdeckt hinter der Tafel (gemessen: Konturkante bei 158° unter der Tafeloberkante).
- Spitze symmetrisch, Achse = Sehne vom Bogenende zum Kreispunkt im Abstand HL: die Spitze liegt auf dem Kreis, die Achse ist 18,2° gegen die Tangente eingedreht. Spitzenwinkel 53° (bei 78° las sich die Einlage als „Play"-Dreieck).
- Bogenkanten enden exakt auf der Basislinie der Spitze (Bisektion), keine Stufe an der Kerbe.
- Kanal (accent2) = derselbe Pfeil mit 0,62 m Rand, läuft mit parallelen Kanten in die Spitze. Blink-Spitze = Innenspitze 0,12 m eingerückt, sitzt auf dem Kanal. Kontur 0,32 m wie R1.

**Bühne + Vorhang** (`curtain/clay-look.js`, `curtain/host.js`, `palette-roles.js`)
- Portal als Pappaufsteller vor dem Vorhang: 4,6 × 3,2 m, Öffnung ±1,42 m, Kante 0,24 m, Frontplatte 8 cm eingerückt, Kontur-Wulst um die Öffnung, Seitenwangen 0,98 m nach hinten, Laibung bis 2 cm vor den Stoff.
- Stoffbahnen reichen bis ±1,51 m (Kern-DIM): 9 cm Überdeckung je Seite. Mitte überlappt der Kern selbst (railGap −0,09).
- Boden: 19 durchgehende Bretter von der Vorderkante bis hinter den Prospekt, Oberkante 4,5 cm über `DIM.floorY`, der Saum steckt 2 cm im Boden.
- Kern mit `hardware:'none'`: Stange, Ringe, Haken entfallen; ein Blendbrett hinter den Bögen verdeckt die Stoffoberkante.
- Entfernt: Behelfsstreben, Seitenflats, Kopfbänder, Nägel, Säulenringe, Kordelringe, Flickenplanke, überstehende Planke, gekippte Quaste.
- Säulen klobig und ungleich (Doppelsockel + Kugel / Einzelsockel + Block + Brett, leicht schief). Schild aus der Mitte versetzt. Vier Laternen ungleich gesetzt.
- Schmuckvorhang: Bögen wie R1, jetzt in der Stofffarbe (`valance = cloth`). Seitenschals aus vier Falten-Wülsten je Seite (Kaskade, außen am längsten). Quasten senkrecht, unterschiedlich lang.
- Stoff: Faserstreifen schwächer, dieselbe Knet-Marmorierung wie die Wülste, Rauheit 0,9 wie die Knet-Teile.
- Neue Rollen: `portal`, `portalEdge`, `portalLine`.

## Ehrlichkeit
| Feld | Stand |
|---|---|
| SOURCE | siehe fünf Zeilen; Kern über jsDelivr `@main`, nicht gepinnt |
| DECISION | Portal statt Säulen allein, weil nur eine geschlossene Rahmenebene vor dem Stoff garantiert, dass geschlossen nichts dahinter sichtbar ist. Saum per angehobenem Boden versenkt statt Kern-DIM zu ändern. Bogenpfeil-Spitze auf dem Kreis mit Sehnenachse (symmetrisch) statt Tangentenachse. |
| IMPLEMENTATION | Dateien oben; `measure` im Bühnen-Snapshot (Öffnung, Stoffkante, Überdeckung, Saum, Boden) wird in der Bedienung angezeigt. |
| TESTED RESULT | Gesehen (`evidence/`): Bühne Front geschlossen, ¾ links/rechts geschlossen, Bühne nah (Saum im Boden), ¾ offen; 02 Front, ¾, Nah Spitze, Seite (Einzelrender des R2-Kits, WebGL). Gemessen: Überdeckung 0,09 m/Seite, Saum 0,02 m im Boden, Spitzenwinkel 53,1°, Achsdrehung 18,2°. Bühnenbilder per Einzelrender, weil der Vorschau-Rahmen im Hintergrund keine Animationsframes bekommt. |
| NOT_TESTED | Billboard-Bildschirm im laufenden Betrieb: der Boot blieb in dieser Sitzung in R1 UND R2 beim Laden hängen (kein Fehler, Rahmen im Hintergrund) — 02 deshalb nur als Einzelrender geprüft, Lauflicht/Blinken nicht gesehen. Vorhang-Bewegung (Öffnen/Schließen) live nicht gesehen, nur Endzustände. fps · Safari/Firefox · Mobil. |
| EXPORT | Projektordner `KFB_Clay_Stage_R2/` + DC als ZIP |
| PUBLIC DEPLOYMENT | NOT RUN |
| GEORG ACCEPTANCE | OPEN |
| OPEN | (1) Falten geschlossen weiter fast glatt (Kern-TUNE). (2) Kern ungepinnt. (3) Rubbel-Grammatik / `kfbBlend` nicht eingebaut. (4) Bogenpfeil-Bauweise (arcArrow) noch nicht auf andere Tafeln übertragen. |

## Ein Gate
**GEORG CLAY STAGE REVIEW** im R2-Bildschirm. Offene Prüffrage: Trägt das Portal als Pappaufsteller den Bühnenrahmen, oder sollen die Säulen allein abschließen?
