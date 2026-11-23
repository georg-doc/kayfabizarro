# Nahkampf-Feinschliff R1 · Runde 2 · Protokoll

## Gate test/waffenHalt.mjs (WAFFEN=spear,halberd,staff,scythe; Grenzen Griff–Hand ≤ 2 cm, Waffe im Körper ≤ 1 cm)

| Figur | Waffe | max Griff vorn (cm) | max Griff hinten (cm) | max im Körper (cm) | rot |
|---|---|---|---|---|---|
| the_boss | spear | 0.9 | 1.5 | 0.0 | 0 |
| the_boss | halberd | 0.9 | 0.9 | 0.0 | 0 |
| the_boss | staff | 0.9 | 0.8 | 0.2 | 0 |
| the_boss | scythe | 0.9 | 0.8 | 0.0 | 0 |
| michelle | spear | 0.4 | 0.5 | 0.0 | 0 |
| michelle | halberd | 0.4 | 0.4 | 0.0 | 0 |
| michelle | staff | 0.4 | 0.7 | 0.0 | 0 |
| michelle | scythe | 0.4 | 0.4 | 0.0 | 0 |
| big_vegas | spear | 1.1 | 1.5 | 0.0 | 0 |
| big_vegas | halberd | 1.4 | 1.3 | 0.0 | 0 |
| big_vegas | staff | 1.1 | 1.0 | 0.0 | 0 |
| big_vegas | scythe | 1.3 | 1.4 | 0.0 | 0 |
| ortiz | spear | 1.1 | 1.0 | 0.0 | 0 |
| ortiz | halberd | 1.1 | 1.5 | 0.0 | 0 |
| ortiz | staff | 1.1 | 1.6 | 0.0 | 0 |
| ortiz | scythe | 1.2 | 1.7 | 0.0 | 0 |

Ergebnis: GRÜN (16 von 16), Seitenfehler: 0

## Gate sword1h (WAFFEN=sword1h)

GRÜN 4 von 4. Michelle Stand: Knauf 0,79 cm in der Hüfte (drei Läufe gleich; Grenze 1 cm).

SCHRITT=0.1 (ganzer Clip alle 0,1 s, nicht im Gate): 13 Proben rot, zwischen den Extremposen streifen Klinge/Schild die breiten Figuren (bekannt seit Einhand R1).

## Stielrichtung je Bild (test/_stangen-frames.mjs, the_boss, Speer)

| Angriff | Stand vor dem Angriff | Stand danach | Drehung im ersten Angriffsbild | größte Drehung je Bild (im Schwung) |
|---|---|---|---|---|
| stoss | Fäuste 0.26 m, Stiel aufrecht | Fäuste 0.26 m | 6° | 8° |
| schwung | Fäuste 0.26 m, Stiel aufrecht | Fäuste 0.26 m | 8° | 19° |
| smash | Fäuste 0.26 m, Stiel aufrecht | Fäuste 0.26 m | 10° | 15° |


## Konsole
- Gate- und Belegläufe: keine Seitenfehler (pageerror leer, Protokoll-JSON fehler: []).

## Belege
- test/_einhand-beleg.mjs, Ziel Würfelmonster, Abstand Stoß/Smash 1,8 m, Schwung 1,3 m, Schwert 1,0 m; 60 Bilder/s im Prüftakt, Zeitlupe ¼, Bildstreifen 8 Bilder.
- *_ausruesten_*: Faust-Modus, Waffe im Video bei 0,3 s gewählt, Haltung 1,2 s, dann der Angriff.
- *_start_jedesbild.jpg: jedes Bild 0,3 s ab Angriffsbeginn (geteiltes Bild: links fb_seite, rechts fb_dreiviertel).

## Hinweis Runde 2
- Gate-Zahlen oben aus dem Stand von Runde 1 (Griff und Körper unverändert); Endlauf der Gates folgt nach der letzten Runde.
