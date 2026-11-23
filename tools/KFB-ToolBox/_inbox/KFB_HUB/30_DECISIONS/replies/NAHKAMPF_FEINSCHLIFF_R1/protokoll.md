# Nahkampf-Feinschliff R1 · Protokoll Endstand (Code = runde3)

## Gates (Endstand)
- `test/waffenHalt.mjs` WAFFEN=spear,halberd,staff,scythe (Kit r4d, Gleitgriff): **GRÜN 16/16**.

| Figur | Waffe | max Griff vorn (cm) | max Griff hinten (cm) | max im Körper (cm) | rot |
|---|---|---|---|---|---|
| the_boss | spear | 0.9 | 1.5 | 0.0 | 0 |
| the_boss | halberd | 0.9 | 1.2 | 0.0 | 0 |
| the_boss | staff | 0.9 | 1.1 | 0.3 | 0 |
| the_boss | scythe | 0.9 | 0.8 | 0.0 | 0 |
| michelle | spear | 0.4 | 0.5 | 0.0 | 0 |
| michelle | halberd | 0.4 | 0.4 | 0.0 | 0 |
| michelle | staff | 0.4 | 0.4 | 0.0 | 0 |
| michelle | scythe | 0.4 | 0.4 | 0.0 | 0 |
| big_vegas | spear | 1.1 | 1.5 | 0.0 | 0 |
| big_vegas | halberd | 1.2 | 1.1 | 0.0 | 0 |
| big_vegas | staff | 1.1 | 1.0 | 0.5 | 0 |
| big_vegas | scythe | 1.2 | 1.4 | 0.0 | 0 |
| ortiz | spear | 1.1 | 1.0 | 0.0 | 0 |
| ortiz | halberd | 0.3 | 0.3 | 0.0 | 0 |
| ortiz | staff | 1.2 | 0.3 | 0.0 | 0 |
| ortiz | scythe | 1.2 | 0.3 | 0.0 | 0 |

- WAFFEN=sword1h: **GRÜN 4/4**; Michelle Stand Knauf 0,79 cm in der Hüfte, in fünf Läufen gleich (vorher 0,8–1,1 cm je nach Lauf: dieselbe Ursache wie §2, Armraum summierte sich auf der stehenden Haltung).
- SCHRITT=0.1 (nicht blockierend): 13 Proben rot (Klinge/Schild streifen zwischen den Extremposen, vor allem Big Vegas/Ortiz/Michelle; bekannt seit Einhand R1).
- Stielrichtung je Bild (`test/_stangen-frames.mjs`, the_boss, Speer): Fäuste vor dem ersten Angriff / danach, Drehung im ersten Angriffsbild, größte Drehung je Bild (im schnellen Schwung):

| Angriff | Fäuste vorher | Fäuste nachher | erstes Bild | größte Drehung |
|---|---|---|---|---|


- CI `scripts/ci/run.mjs`: 231 Tests, grün 229, bekannt rot 2 (audioMixer, deps), Rückfall 0. Smoke `test/_smoke-hashes.mjs` ok (Testfahrt, Slice).
- FB-Nahkampf-Labore (`test/melee-reference-r1.mjs`, `test/axe-reference-r1.mjs`, Port 8798): laufen schon im Stamm @7d7be47b nicht durch (Zeitüberschreitung beim Laden der Prüfseite, Kampf bleibt LOADING), also ohne Aussage zu diesem Schritt; Einheitstests `melee-reference.unit.test.mjs` (17/17) und `comboLite` grün.

## Stille Blind-Kritik (SOP §5, ohne Zielbild: paarweise gegen WAFFEN_STANGEN_R1/runde4 bzw. WAFFEN_EINHAND_R1)
- R1: A 7 · B 7 · C 7 · D 6 · E 7 · F n/a · G n/a · H 7 → 6,8 FAIL. Paarweise Speer A/B/D besser, C/E/H gleich; Schwert A/B/D/E besser, C/H gleich. Ein-Bild-Sprünge bei allen fünf Angriffen weg, Haltung nach dem Ausrüsten steht, Schwert-Spur weicher Bogen. Rest: Überkopf trifft über dem eigenen Kopf, Anlauf/Ausrüsten ohne Ease, Speer-Schwung-Spur mit Haken.
- R2 (Ease `glatt`, Ausrüsten `einS`, `spurBis`, Schwert-Spur breiter): 6 · 6 · 6 · 6 · 6 · H 7 → 6,2 FAIL. Paarweise Speer und Schwert A/B/D besser, sonst gleich. Rest: Ausrüsten mit einem Bild schlaffer Arme, Schwert-Spur als Ring durch die Beine, Ruck-Bild beim Schrägschlag.
- R3 (Ausrüsten aus der letzten Lage, Fenster gekürzt, Schwert `fade` 0,16, Speer erst mit fertigem Griff sichtbar): 7 · 6 · 5 · 7 · 6 · H 7 → 6,3 FAIL. Paarweise Speer A/B/D besser, Schwert A/B/D/E besser, sonst gleich.
- Stopp nach zwei Runden ohne Verbesserung des Mittels (R1 6,8 bester absoluter Wert). Endstand = R3-Code: die R2/R3-Änderungen beheben jeweils einen konkreten Befund (Haken, Ring, schlaffe Arme), der paarweise Vergleich blieb in allen Runden „besser/gleich“, nie „schlechter“.
- Kleinster Blocker (R3): Klinge geht beim Schrägschlag (attack_b) etwa 9 Bilder durch den Schild – Clip, nicht mit Platzierung lösbar (Einhand-Fehlt-Liste).

## Konsole
- Gate-, Beleg- und Smoke-Läufe ohne Seitenfehler.
