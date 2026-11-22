# Buchmaschine R8: Klang-Wunschliste für ElevenLabs (an WS0, 22.11.)

Georg 22.11.: Fehlende Klänge sammelt die Buchmaschine als Liste. WS0 erzeugt sie mit ElevenLabs und stellt sie über die Audio-Site bzw. das Spiel bereit.
Stand R8: Alle Ereignisse klingen schon mit Atlas-Klängen (TON_BELEGUNG in tools/buchmaschine/ton_belegung.json). Die Liste ersetzt die schwächsten davon.
Stil: Retro-Mechanik (Moderne Zeiten), Tesla und Dampf, cartoonig-satt, kein Sci-Fi-Glanz. Kurz und trocken; den Hall macht der Raum.

| Nr | Ereignis (Belegung) | Wunsch | Länge | Varianten | ersetzt heute |
|---|---|---|---|---|---|
| 1 | `laden` | Kondensator lädt auf: steigendes Brummen mit Knistern. Kommt 0,3–0,4 s vor dem Bogen. | 0,4 s | 3 | Power_Up (Arcade) |
| 2 | `blitz` (Treffer) | Harter Tesla-Knall an der Buchkante, mit einem Anteil Papierriss | 0,5 s | 4 | ZapHard und Co. |
| 3 | `brumm` | Tiefer Spannungsaufbau vor dem Finale, schwillt an und reißt ab | 1,5 s | 1 | Bass Buzz (Arcade) |
| 4 | `relief` (neu) | Pixel-Säulen wachsen: trockenes Knistern, Kristallisieren, leicht tonal | 2 s, als Schleife | 1 | Rascheln-Schicht |
| 5 | `wuerfel` | Schauer kleiner Holz- oder Kunststoffwürfel auf Steinboden, von dicht bis vereinzelt | 0,3–1 s | 4 | dice_roll |
| 6 | `landen` | Dickes Taschenbuch fällt auf ein Blech: Plumps mit kurzem Nachfedern | 0,6 s | 2 | land_thump |
| 7 | `servo` | Hebel und Klammern: Ratsche mit Federklick, mechanisch | 0,4 s | 3 | mech_servo |
| 8 | `klick` | Klammer schnappt ein, satter Metallklick (auch: eine Gruppe rastet ein) | 0,15 s | 3 | Einrast-Klicks |
| 9 | `hydraulik_ab` / `hydraulik_auf` | Hydraulikstempel fährt aus bzw. ein: pneumatisches Zischen mit Anschlag | 0,8 s | je 1 | hydraulic_down/up |
| 10 | `auswurf` | Karte schießt aus der Seite („Fwip“ und Flattern); dasselbe gröber für das leere Buch (Federkatapult) | 0,4 / 0,6 s | 2 + 1 | dust_puff |
| 11 | `karte` | Karte klatscht flach auf den Stapel | 0,15 s | 2 | card-place (Kenney) |
| 12 | `schritt` | Schritte der Bots: kleines Metallgewicht auf Stein, leicht cartoonig | 0,12 s | 4 | bot_step_metal |
| 13 | `tuer` (neu belegt) | Ferner Durchgang zum Nachbarraum: dumpfer Raumwechsel, wenn ein Bot verschwindet | 1 s | 1 | industrial_door_close |
| 14 | `kammer` (neu) | Grundton der Kammer: tiefer Raum-Drone, nahtlos über 30 s, passt zu 112 bpm | 30 s | 1 | (keiner) |
| 15 | `stille` (neu) | Nachklang vor dem Finale: kurzer, rückwärts anschwellender Hall | 1 s | 1 | (keiner) |

Ablage: wie bisher als Atlas-Einträge (ID = Datei-ID). Die Buchmaschine braucht danach nur neue IDs in `ton_belegung.json`, am Code ändert sich nichts.
Ereignisse, Zeitpunkte und Stärken stehen im Ereignis-Protokoll jedes Belegs (`ereignisse.json`).
