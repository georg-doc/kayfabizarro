# WSA · InfiniteRooms R20 · Cartoon Perspective

Eigenständige Opt-in-Slice auf der bestehenden privaten InfiniteRooms-Site; kein Merge. Der normale Einstieg bleibt Original.

## Spielbarer Umfang
Original / A Raumform / B Bildebenen / C Hybrid, derselbe bestehende Raum und dieselben drei Vergleichskameras. Vier begrenzte Regler (Wandneigung, Verjüngung, Krümmung, Tiefenversatz). Oberflächen Karten, ganze Pages, HyperNorm und Terrain bleiben verfügbar. Die Raumhülle wird tatsächlich als Mesh verformt. Kein Fisheye auf HUD oder Figur.

Die Raumform gilt für das Foyer und einen weichen 5-m-Übergangsbereich. Rapier bekommt dieselbe analytische Verformung als statische Dreiecksflächen, nur dort, wo etwas verändert wird. Unveränderte Böden und entfernte Wände behalten ihre Cuboids. Freier Laufbereich bis 2,35 m und der Portalanker bleiben unverändert. Ein Renderer, eine Physikwelt, eine Host-Uhr.

B/C verwenden drei echte Original-Karten als gegeneinander versetzte Bühnenebenen und das bereits zugelassene transparente TR_AMETHYST-Pop-up mit Scharnier am Fuß. Keine neuen Assets oder Bibliotheken heruntergeladen. Kein neues Möbelmodell. Das ist ein erster Raum-/Kompositionsvergleich, keine fertige komplette Cartoon-Einrichtung.

## Prüfungen
97/97 Node-Tests grün; der geänderte Kollisionspfad anschließend nochmals mit den fünf R20-Tests geprüft. Produktions-Build grün. Alle drei Saaten: Raumgraph und Portalöffnung erhalten. Echter Rapier-Controller durchläuft den geschlossenen Hauptweg auf Saat 1337. Browser: Original/A/B/C sichtbar, drei Hybrid-Blickwinkel, Portal hin/zurück (2 Übergänge in 5,65 s), lokales Video und Belege. Kein neuer Kampfablauf behauptet; vorhandener Dungeon bleibt derselbe Owner.

Fester Terrain3-Raumblick, Apple M1 Max, ein lokaler Lauf je Modus, rollende 600 Bilder. Keine GPU-Zeitmessung, kein Mac-mini-Benchmark:

| Modus | p50 Bild ms | p95 Bild ms | Host-CPU p95 ms | Dreiecke | Draw Calls |
|---|---:|---:|---:|---:|---:|
| off | 8.3 | 9.2 | 5.5 | 15540 | 5 |
| geometry | 8.3 | 9.3 | 5.4 | 18750 | 5 |
| layers | 8.3 | 10.2 | 7.7 | 15552 | 11 |
| hybrid | 8.3 | 9.2 | 6.3 | 18762 | 11 |

## Sixfold / nächster Escher-Schritt
https://patch.gg/games/rehan/sixfold/source nennt eindeutig Closed Source. Kein Code übernommen. Spielreferenz für zielgerichtetes Wandwählen, sechs Down-Richtungen und Lösbarkeitsprüfung.

„Stand on this wall“ ist noch NICHT implementiert. Nächste getrennte Slice: eine gezielt wählbare Wand wird begehbar; lokales Schwerkraft-/Bewegungs-Koordinatensystem samt orientierter Kapsel, Bodentest und Kamera-up-Übergang; ein belegter Hin-/Rückweg. Nicht einfach die Kamera kippen und nicht die gesamte Rapier-Welt drehen. Keine automatische Übernahme fremden Closed-Source-Codes.

Weitere Ausgestaltung: gezielt schiefe Rahmen/Möbel erst aus geprüften Donoren, höhere Kurven-Auflösung nur nach Bedarf, Raumsequenzen und alternative Wand-/Decken-Ausgänge erst nach der einzelnen geprüften Wandtransfer-Slice. Keine globale Style-Kanonisierung.

## Lieferung
Private Site Version 13. Head `4c8d499d5c12b3a30600d1a4aeb32718c8e82805`, Branch `wsa/infiniterooms-r20-cartoon-perspective-20261114`. Kein Merge. Link: https://kfb-infiniterooms.frizzlebob.chatgpt.site/?perspective=hybrid&qa=1&look=terrain3
Bedienkorrektur: Ein Wechsel der Perspektive behält die zuvor gewählte Oberfläche. Im Browser auf HyperNorm geprüft.


Gemeinsame Ablage mit Bildern, Video, Patch und Prüfdaten: `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Combat Arena/WSA_Patch_Transfer_R1_2026-11-13/R20_Cartoon_Perspective_2026-11-14`.
Private Site Version 13, Quellstand `4c8d499d5c12b3a30600d1a4aeb32718c8e82805`. Kein Merge.
