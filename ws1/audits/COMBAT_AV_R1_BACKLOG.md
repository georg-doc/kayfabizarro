# Combat-AV R1 · Backlog (TUNE später) · Stand 21.10.2026

Georg hat jeden Prototyp mit „PASS, TUNE später“ abgenommen. Die Punkte unten sind der Feinschliff dazu. Prototypen liegen lokal auf `ws1/combat-av-r1` im Arena-Klon und werden nicht gepusht.

## Klang je Waffe (Top-10 Nr. 1) · PASS mit TUNE
| # | Punkt | Vorschlag | Aufwand |
|---|---|---|---|
| K1 | Einige Schüsse klingen noch nach hohem „Piu-Piu“ (Georg) | Anschlag tiefer stimmen (Rate ×0,8–0,85), mehr Körper-Ebene, laserartige Ebenen leiser | S |
| K2 | Würfelrollen als KFB-Kennung anpassen (Georg) | Kurzer Würfel-Klick als Körper-Ebene (L6 `dice_flick`) statt 1,4 s Schütteln | S, wartet auf L6 |
| K3 | Armbrust, Bogen und Magie sind Platzhalter, Armbrust und Magie setzen 35/45 ms zu spät ein | Mit L1, L2 und L4 von WS0 ersetzen | S, wartet auf WS0 |
| K4 | Gatling als Einzelklänge | Schleife X02 über `loopKeep` plus Hochlaufen und Auslaufen (L11) | S |
| K5 | Prüfregel R3 (Gegner ≥ 6 dB unter dem eigenen Schuss) misst im Gesamtmix und ist nicht belastbar | Mitschnitt je Bus im Prüfskript (`av-clip.mjs`) | S |

## Treffer als Knet-Masse + Kill am Ort (Top-10 Nr. 4 und 8) · PASS mit TUNE
| # | Punkt | Vorschlag | Aufwand |
|---|---|---|---|
| T1 | ~~Bei der heutigen weiten Kamera ist alles klein, auch das „PLOPP!“~~ | **erledigt r8:** Wort ×1,3 plus Kampfkamera (b) | ✓ |
| T2 | ~~Von oben sieht man fast nur den dunkleren Ton~~ | **erledigt r8:** Licht-Schwelle −0,1 | ✓ |
| T3 | ~~Der Kill-Puff liest sich als ein Klumpen~~ | **erledigt r8:** 3 Kuppeln, Abstand 1,6 r | ✓ |
| T4 | Pop → Klack beim Schädel-Tausch ist ein Platzhalter (S04 + C06) (Georg PASS mit TUNE 21.10.) | L9 `mob_pop_to_skull` von WS0 | S, wartet auf WS0 |

## Gegner kündigt an (Top-10 Nr. 3) · PASS mit TUNE
| # | Punkt | Vorschlag | Aufwand |
|---|---|---|---|
| A1 | Der Ausholklang ist ein Platzhalter: etwa 0,8 s lang, länger als das Ausholen, ratternd | L13 `mob_windup` (0,5 s) von WS0, in der Rückgabe als dringend markiert | S, wartet auf WS0 |
| A2 | Das Stauchen ist bei der weiten Kamera kaum zu sehen, die Warnung trägt der Ring | Kamera näher (Top-10 Nr. 6); bei Bedarf Stauchen 0,8 → 0,72 | S |
| A3 | Holen viele Gegner gleichzeitig aus, überlagern sich die Ringe | Ringe auf die zwei nächsten Gegner begrenzen, die übrigen nur mit Klang | S |
| A4 | Das Stauchen beim Ausholen schreibt `m.root.scale` direkt; `spuck.v3.js` verlangt für Ansage-Verformung den `deform`-Kanal mit Schiedsrichter (DP3, S6) | beim Einbau über den `deform`-Kanal leiten | M |

## Prüfen und Werkzeug
| # | Punkt | Vorschlag | Aufwand |
|---|---|---|---|
| W1 | Nahkamera: Der große Magierhut verdeckt beim Zielen, Klinge und Stab trafen in der Nahprobe nicht | Schulter-Versatz (Top-10 Nr. 6) | in Nr. 6 |
| W2 | Die Seite lädt nach dem Tod der Spielfigur neu, längere Prüf-Clips brechen ab | Clips ≤ 7 s mit Wiederholung, oder die QA-Spielfigur unverwundbar schalten | S |
| W3 | `serve_soldier.py` setzt beim ersten Laden Verbindungen zurück | `request_queue_size=256` (eine Zeile, WSA) | S |
| W4 | `?actor=soldier` im Brief, richtig ist `soldier-r3d`; `qa.js:22` wirft bei unbekannter Figur | Brief korrigieren, `qa.js` absichern | S |
| W5 | Einbau in die Arena trifft die Hash-Sperre (`gunfight.v2.js`) | WSA trägt im Recovery-Manifest nach | S |

## Kamera & Bühne (Top-10 Nr. 6) · Georg 21.10.: PASS mit Weg (b), TUNE später
| # | Punkt | Vorschlag | Aufwand |
|---|---|---|---|
| B1 | C8 fällt von 89 % auf 73 % (Vorgabe 85 %) | **Entschieden: (b)** Nähe nur im Kampf, in Ruhe bleibt C8 bei 89 % | erledigt im Prototyp |
| B2 | (Georg bestätigt) Nach Drehung zur Kartenkante füllt der Hintergrund ein Drittel des Bildes | Neigung mit dem Abstand zur Kartenkante steiler stellen, oder Vorausblick zur Kartenmitte ziehen | M |
| B3 | (Georg bestätigt) Die Waffenleiste unten bleibt auch eingeklappt sichtbar | Waffenleiste schmaler oder ebenfalls einklappen | S |

## Abgang sichtbar (Top-10 Nr. 7) · Georg 21.10.: PASS mit TUNE
| # | Punkt | Vorschlag | Aufwand |
|---|---|---|---|
| V1 | Cast- und Sehnen-Pop nur über die Engine belegt, nicht im Bild (Figur ragt aus dem Ausschnitt) | Blickprobe mit Ausschnitt um die Mündung | S |
| V2 | Bei der Gatling (18 Schuss/s) entstehen viele Bänder nebeneinander | Bei Dauerfeuer ein gemeinsames Band je Lauf oder nur jedes dritte Geschoss | S |
| V3 | Gatling-Blitz einmal erst nach 182 ms | Zusammenspiel von Spin-up und Marke prüfen | S |

## Spieler-Treffer ohne Geist (Top-10 Nr. 5) · Georg 21.10.: PASS mit TUNE
| # | Punkt | Vorschlag | Aufwand |
|---|---|---|---|
| H1 | Bonk-Klang ist ein Platzhalter (K06 + C02) | L8 `player_hurt` von WS0 | S, wartet auf WS0 |
| H2 | Unverwundbarkeit nach einem Treffer ist nicht sichtbar (heute zeigte das ungewollt der rosa Schleier) | blinzelnde Augen über EyeRig oder ein leichtes Wippen, keine Transparenz | S–M |
| H3 | Treffer von hinten: der Knet-Treffer sitzt dann hinter der Figur und ist verdeckt | bei Abstand zur Kamera < Figur seitlich versetzen | S |

## Tusche (Top-10 Nr. 9) · Georg 21.10.: PASS mit TUNE
| # | Punkt | Vorschlag | Aufwand |
|---|---|---|---|
| I1 | Der Glanz liest sich als gleichförmige Ovale | Glanzkante entlang der Klecksform (aus dem Kleckssatz der Zensur) | S–M |
| I2 | Die Tusche-Abfrage sieht nur gestempelte Kleckse, nicht den GPU-Zulauf | Abfrage auf die Rücklesung der Zensur (64×64, alle 0,5 s) umstellen | S |
| I3 | Breite des Freistellers (0,035 u) und Papierton sind nur an einem Gegnertyp geprüft | an allen Cube-Gegnern und bei Sonnen- bzw. Chill-Licht prüfen | S |

## Stumme Ereignisse (Nr. 10) + Kaskade-Rest (Nr. 2) · Georg 21.10.: PASS mit TUNE
| # | Punkt | Vorschlag | Aufwand |
|---|---|---|---|
| E1 | Sprung-Klang ist ein Platzhalter (C04), Rauchpuff zu lang (T08 2 s) | L14 `jump_hop`, L12 `smoke_pop_short` von WS0 | S, wartet auf WS0 |
| E2 | `raise` im Spiel nicht gehört, weil der Würfel-Gun-Slot den Zauber verdrängte | Probe mit festem Slot | S |
| E3 | Splats laufen im Original über `treffer` → confirm.hit; der Prototyp leitet nur im Ton-Modus um | beim Einbau den Splat-Weg dauerhaft auf `impact.wet.ink` | S |
| W6 | `hp = 0` per `setInterval` in der Seite löste den Tod in Proben nicht aus, einmaliges Setzen schon (Ursache offen) | im Prüfskript einmalig setzen | S |

## Tod-Inszenierung · Georg 21.10.: PASS mit TUNE (D1 und D5 sind Pflicht)
| # | Punkt | Vorschlag | Aufwand |
|---|---|---|---|
| D1 | **Georg: „die Tusche-Tropfen mit den Kugeln am Ende sind falsch“** | keine Kugelköpfe. Tusche läuft als zähe Fahne mit stumpfer, abgerundeter Front (wie dicke Farbe/Sirup), Breite schwillt an und ab, einzelne Läufer überholen, an der Front leichte Verdickung statt Kugel; dazu 2–3 lange Hauptläufer plus viele kurze | M |
| D2 | Doppelt: das spieleigene Fenster „FrizzleBob is down“ mit „Blödsinn!“-Knopf erscheint zusätzlich | Fenster erst nach dem Wort zeigen oder den Titel durch das Knet-Wort ersetzen | S–M |
| D3 | Kreuze statt Pupillen beim Tod (**Georg 21.10.: freigegeben**) | Augen-Rig v6 um `pupil: 'kreuz'` erweitern (Besitzer Augen-Rig/WSB) | M |
| D4 | Kein eigener Klang zum Wort | L15 `bloedsinn_stinger` von WS0 | S, wartet auf WS0 |
| D5 | **Georg: „Blödsinn muss als Claymation-Modell gebaut werden, aus comicmäßig gebogenem und typografisch sauber gestaltetem Lettering“** | 3D-Knet-Wort: gezeichnetes Lettering (eigene Buchstabenformen, Grundlinie im Bogen, einheitliche Strichstärke, saubere Abstände, gesetztes ö), daraus extrudierte Knet-Körper mit gerundeten Kanten, Fingerabdruck-Normalen, zwei Tönen und Saum; Einzelbuchstaben animiert (Pop, Stauchen, Nachwippen) | L |
