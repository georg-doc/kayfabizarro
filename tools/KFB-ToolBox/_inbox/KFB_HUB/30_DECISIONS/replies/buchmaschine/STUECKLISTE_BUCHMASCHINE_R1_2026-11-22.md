# Buchmaschine · Stückliste R1 · 22.11.2026

Georg 22.11.: nichts selbst modellieren. Die Maschine entsteht aus vorhandenen Teilen, freien Modellen und Meshy-Modellen von Georg. Der Rahmen ist der WSB-Gerüst-Baukasten, der Antrieb das Orrery-Getriebe. Die Modul-Session baut nur den Zusammenbau, den Ablauf und die beiden Spender-Ports (Orrery-Mechanik, fertig; Membran-Schälen).

## Vorhanden (nehmen, nicht neu bauen)
| Teil | Quelle | Stand |
|---|---|---|
| Rahmen, Einrüstung, Leitern, Beläge, Flaschenzug, Wimpel | WSB Gerüst-Baukasten r1–r3 (`50_BLENDER/GERUEST_R1`, Häute Holz / Dieselpunk-Metall / Brettspiel, `geruest_einruesten.py` mit Modus `absurd` und `grotesk`, Layout `kfb.geruest-layout/1`) | in assets/private gemergt (V-2064) |
| Brettspiel-Witz: Meeple, Pöppel, Domino, Würfel-Knoten, Poker-Chip-Säulen, Mikado-Riegel, Kartenhaus | Brettspiel-Haut des Gerüst-Baukastens; D6 aus dem Theater | vorhanden |
| Antrieb: Kurbel, Zahnräder, Wellen, Sternzeichen-Uhrwerk als Krone | Orrery 06 (Gate a, Mechanik unverändert), Looks A/B/C/Mix über kfb-clay + waffenLook | Gate (a)+(b) PASS |
| Bediener | die beiden Bots aus dem Pendel-Theater mit Clip-Bibliothek `KFB_BOTS_R1/bibliothek` (Lücken laut V-1951: gerader Kisten-Gang, Karte über Kopf, zu zweit tragen) | vorhanden |
| Gerettete Karten | KFB-Karten (flach, Tuschekante, Kartenrücken), Deck „Hilfe, ich bin ein Mensch!“ | vorhanden |
| Roboterarm (für Greifer/Auswurf) | `src/roboarm-reference` im Spiel | vorhanden, prüfen |
| Wände der Kammer | HyperNorm-Kern bzw. Karten; Kammer = Infinite Room (WS0/WSA) | angefragt |
| Effekte | WS0-Port Geometry Painter (Glowing reef, Molten cracks, Aurora silk) | angefragt (V-2041) |
| Buch | WSB, echtes Buch mit beweglichen Seiten | beauftragt (WS0_AN_WSB 17.11.) |

## Frei verfügbar (Kandidaten, aus der Asset-Suche)
| Teil | Kandidat |
|---|---|
| Förderband, Rollen, kleine Maschinenteile | Kenney Factory Kit (140 Teile) |
| Walzensatz für Einzug/Schälwalze | 3D Assets „Web Path Roller Set“ und „Flatbed Cylinder Press“ (Druckerei-Set, animiert) |
| Riesenschere | grab3d „Office Scissors“ |
| Trichter mit Rutsche | 3D Assets „Mill Grain Hopper And Chute“ |
| Schredder | grab3d „Paper Shredder“ |
| Scannerkopf/Linse | grab3d „Camera Lens“ |
| Control-Panel | grab3d „Industrial Control Panel“ |
| Kurbel (Ersatz) | 3D Assets „Hand Crank Generator“ |

Alle bekommen die KFB-Knete und den gewählten Look. Realistische Modelle können neben dem Spielzeug-Look fremd wirken; deshalb unten die Meshy-Liste für die Teile, die die Gags tragen.

## Signature-Parts für Meshy (Vorschlag: Georg erzeugt, WSB setzt Pivots)
Alle im KFB-Claymation-Spielzeug-Look, gebraucht, leicht schief, einzeln (nicht verschmolzen), mit klarer Drehachse.
1. **Buchklemme mit Blätterfingern** – zwei gepolsterte Backen, die ein großes Buch aufrecht halten, darüber Gummifinger an Gelenkarmen zum Umblättern. Drehachsen: Backen, Finger.
2. **Schälwalze mit Schälmesser** – große Trommel auf zwei Lagerböcken, daneben ein breites Messer an einem Schwenkarm wie bei einer Furnier-Schälmaschine. Drehachse: Trommel.
3. **Trichter mit Tülle** – großer verbeulter Blechtrichter mit Gummischürze, unten eine Spritztülle wie bei einer Teigspritze, darunter ein Eimer.
4. **Leimpresse mit Riesen-Klebestift** – Spindelpresse, deren Stempel ein übergroßer Klebestift ist, seitlich ein Kartenauswurf-Schlitz. Achse: Stift auf und ab.
5. **Control-Panel mit Blödsinn-Taster** – schiefes Pult mit Hebeln, Rundinstrumenten und einem großen roten Pilztaster (ohne Schrift, die kommt als Karte/Decal).
6. **Scannerkopf** – Gehäuse mit großer Linse auf einer Laufschiene, wie ein alter Diaprojektor.
7. *(optional)* **Riesen-Spielzeugschere** – falls die freie Schere fremd wirkt.

## Was die Modul-Session selbst macht
- Zusammenbau: Teile auf Anker setzen, Gerüst-Layout als Instanzen, Getriebe-Mathematik vom Orrery an die Stationen koppeln.
- Ablauf: Zustandsmaschine der 12 Phasen, rückwärts nach „Blödsinn!“, Ereignisse an den Host.
- Ports: Membran-Schälen (WebGPU → WebGL), wie beim Orrery ohne neue Formen.
- Kein eigenes Modellieren von Gehäusen, Rahmen oder Signature-Parts.
