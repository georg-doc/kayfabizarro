# Stangen R1 · Runde 3 · Protokoll

## Gate test/waffenHalt.mjs (WAFFEN=spear,halberd,staff,scythe; Stand, Gehen, Ausholen und Treffer je Angriff; Grenzen Griff–Hand ≤ 2 cm, Waffe im Körper ≤ 1 cm)

| Figur | Waffe | max Griff vorn (cm) | max Griff hinten (cm) | max im Körper (cm) | rot |
|---|---|---|---|---|---|
| the_boss | spear | 0.9 | 1.4 | 0.0 | 0 |
| the_boss | halberd | 0.9 | 1.0 | 0.0 | 0 |
| the_boss | staff | 0.9 | 0.8 | 0.0 | 0 |
| the_boss | scythe | 0.9 | 0.8 | 0.0 | 0 |
| michelle | spear | 0.4 | 0.5 | 0.0 | 0 |
| michelle | halberd | 0.4 | 0.4 | 0.0 | 0 |
| michelle | staff | 0.4 | 0.4 | 0.0 | 0 |
| michelle | scythe | 0.4 | 0.4 | 0.0 | 0 |
| big_vegas | spear | 1.1 | 1.2 | 0.0 | 0 |
| big_vegas | halberd | 1.1 | 1.0 | 0.0 | 0 |
| big_vegas | staff | 1.1 | 1.0 | 0.0 | 0 |
| big_vegas | scythe | 1.2 | 1.0 | 0.0 | 0 |
| ortiz | spear | 1.8 | 1.5 | 0.0 | 0 |
| ortiz | halberd | 0.3 | 1.1 | 0.0 | 0 |
| ortiz | staff | 0.3 | 0.9 | 0.0 | 0 |
| ortiz | scythe | 0.3 | 0.3 | 0.0 | 0 |

Ergebnis: GRÜN (16 von 16), Seitenfehler: 0

## Gate sword1h (WAFFEN=sword1h)

- the_boss: rot 0 []
- michelle: rot 1 ['Stand: Waffe im Körper 0.0102']
- big_vegas: rot 0 []
- ortiz: rot 0 []

## Belege
- test/_einhand-beleg.mjs: keine Seitenfehler; je Angriff ein frisches Ziel. Kontakt (Clip-Zeit, Treffer-Extrem in Klammern): Speer Stoß 0,91 s (0,867), Schwung 0,81 s (0,867), Smash 1,04 s (1,167); Hellebarde/Stab/Sense Schwung 0,76–0,79 s; Schwert schräg 0,61 s (0,767), über Kopf 0,51 s (0,567).
- Abstand Figur–Ziel: Stoß und Smash 1,8 m, Schwung 1,3 m, Schwert 1,0 m.
- spurInfo.treffer zählt nur am Ende noch laufende Treffer-Effekte (0 = abgelaufen), Gesamtzahl steht in trefferGesamt.
