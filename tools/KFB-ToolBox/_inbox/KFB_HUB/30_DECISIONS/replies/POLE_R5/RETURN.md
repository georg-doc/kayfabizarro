# POLE_R5 · Rückgabe an WS0 (15.11.2026)

Vergleich der vier Energiebögen: heutiger Pol-Effekt gegen vorhandene Patch-Spender, unverändert am echten Pol.
Kein neues VFX-System. Nichts heruntergeladen.

## Stand

- Branch: `ws0/pole-r5` (auf origin), SHA `3de7337babf67e1ac2338f98118de61421610927`, Basis `5d39e2e1a`.
- Einschalten: `energiebogen=r2,bogenprofil=<BOGEN>,polfx=<spender>` an den Hash hängen.
  Spender: `heute`, `feuer`, `ember`, `aurora`, `aegis`, `chainarc`, `thunderstrike`, `blackflame`, `rift`.
  Ohne `polfx` ändert sich nichts.
- Bei einem Spender sind die heutigen Pol-Funken, Glows und Bodenlichter aus. Bogen und Ton bleiben.
- Test: `PW_GPU=1 node test/pole-r5.mjs`, dann `python3 test/pole-r5-bilder.py`. Ausgabe: `test/out/pole-r5/`.
- Code: `src/vfx/polfx.r5.js` (neu), dazu kleine Haken in `energyPoleSite.js`, `energy-poles.r1.js`, `viertelLoader.js` (gl), `elementeNaht.js`.

## Welche Kandidaten im Spiel sind

| Kandidat | Status |
|---|---|
| Patch Fire (torch/brazier) | im Spiel: `src/vendor/fire`. Gezeigt: Typ torch, ohne eigene Lichter und Schatten |
| Elements · Ember Swarm, Aurora Veil, Aegis, Chain Arc, Thunderstrike, Black Flame, Rift | im Spiel: `src/vendor/elements` (über `elementeNaht.js`) |
| Effekseer · Golden rise, Healing light, Lightning-Familie | nicht im Spiel |
| 00GameDevs · Darkchain Sigil Rupture | nicht im Spiel |

## Aufbau

- Gleicher Pol (Viertel -4:1), gleiche Kamera: von vorn, 3,6 m Abstand, 0,9 m über dem Sockel, beide Pole ganz im Bild.
- Look: `TESTFAHRT_HASH + ',debug,mute,tod=12'`.
- Farbe: Wo der Spender einen Farbparameter hat, ist die Profilfarbe des Bogens gesetzt. Ember Swarm und Patch Fire haben keinen.
- Zauber laufen in Schleife: Der nächste startet, sobald der letzte vorbei ist.
- Ortsanpassung nur bei Chain Arc: Die Ziel-Puppe 0 steht auf Pol B, sonst springt der Bogen nirgendwohin.
- Bildfolge: 14 Bilder im Abstand von 0,3 s. Der Streifen zeigt 6 davon (1,5 s), ab dem Wurf.

## Kosten (ms je Bild, dpr 1, Puffer 1280×720, Metal-GPU)

Gemessen in gepaarten A/B-Läufen: 41 Paare mit je 12 Bildern, jede Probe mit 1×1-readPixels abgeschlossen.
Rechnung: Median / p95 des Unterschieds (an minus aus).

- **Effekt**: Spender gegen dieselbe HDR-Naht ohne Effekt. Das sind die reinen Kosten des Spenders.
- **Spiel**: gegen das heutige Bild ohne Pol-Effekt.

| Bogen | Variante | Effekt Median / p95 | Spiel Median / p95 | Liest am Pol? |
|---|---|---|---|---|
| SOLAR_BRIDGE | heute | – | −0,13 / 1,69 | ja, sehr klein |
| SOLAR_BRIDGE | **Patch Fire** | **0,58 / 1,38** | −3,28 / −1,73 | **ja**: kleine Fackel auf jedem Sockel |
| SOLAR_BRIDGE | Ember Swarm | 3,16 / 4,88 | −2,59 / −0,33 | **nein**: unsichtbar, kostet trotzdem |
| SPECTRAL_RIBBON | heute | – | 0,16 / 3,69 | ja, sehr klein |
| SPECTRAL_RIBBON | **Aegis** | 1,48 / 2,92 | −2,90 / 0,27 | teils: großes Siegel und Splitter an Pol B, nach ~1 s weg |
| SPECTRAL_RIBBON | Aurora Veil | 2,17 / 4,50 | −2,29 / −0,35 | **nein**: Vorhang über dem Bild, nur riesiges Bodensiegel und Lichtpunkte |
| VOLTAGE_FILAMENT | heute | – | −0,03 / 2,85 | ja, sehr klein |
| VOLTAGE_FILAMENT | **Chain Arc** | 1,21 / 4,48 | −2,97 / 0,43 | **ja**: dicker Blitzkanal von Pol zu Pol |
| VOLTAGE_FILAMENT | Thunderstrike | 3,42 / 7,09 | −4,19 / −1,08 | schwach: Blitze kriechen über die Straße, kein Einschlag im Bild |
| INK_TENSION | heute | – | 0,14 / 3,75 | ja, sehr klein |
| INK_TENSION | **Black Flame** | 4,34 / 6,34 | −3,98 / 0,10 | liest, aber **kaputt**: schwarze Säulen verdecken Pole und Bogen, harte Bodenkante |
| INK_TENSION | Rift | 4,21 / 6,09 | −3,66 / −0,61 | **nein**: Riss öffnet nicht am Pol, nur Splitter oben |

Lesehilfe:
- **Heute**: Die Kosten liegen unter der Messgenauigkeit (Median etwa 0). Die p95-Werte sind Rauschen.
- **Spiel negativ**: Mit einem Spender läuft das Bild über die HDR-Naht, und die Naht zeichnet ohne MSAA. Das spart mehr Zeit, als der Effekt kostet.
- **Kanten**: Das FXAA der Naht ist aus (`feuerInfo().fxaa=false`, der Regex-Patch in `feuerNaht.js` greift nicht). Unter der Naht hat das Bild also gar keine Kantenglättung. Spender-Bilder sind darum etwas härter und dunkler.
- **Grundzeit**: Sie stieg im Lauf von 19 auf 41 ms (Swap fast voll). Die gepaarten Unterschiede bleiben davon unberührt.

## Bilder

- Hub (ein Vergleich je Bogen, links „heute“, rechts der Spender):
  - `POLE_R5_SOLAR_BRIDGE_feuer.jpg`
  - `POLE_R5_SPECTRAL_RIBBON_aegis.jpg`
  - `POLE_R5_VOLTAGE_FILAMENT_chainarc.jpg`
  - `POLE_R5_INK_TENSION_blackflame.jpg`
- `weitere/`: der zweite Spender je Bogen (Ember Swarm, Aurora Veil, Thunderstrike, Rift). Keiner davon liest am Pol.
- Streifen (6 Bilder, 1,5 s): `~/kfb-ws0/pole-r5-wt/test/out/pole-r5/streifen_<bogen>_<variante>.jpg`, je ≤ 400 KB.

## Klartext

- Brauchbar am Pol: **Patch Fire** (SOLAR, billig) und **Chain Arc** (VOLTAGE, liest stark).
- Aegis liest nur kurz und nur an einem Pol.
- Black Flame verdeckt alles.
- Ember Swarm, Aurora Veil und Rift lesen am Pol nicht.
- Für SPECTRAL_RIBBON und INK_TENSION gibt es aus dem vorhandenen Bestand keinen sauberen Spender.
