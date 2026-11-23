# Stangen R1 · Runde 1 · Protokoll

## Gate test/waffenHalt.mjs (WAFFEN=spear,halberd,staff,scythe; Stand, Gehen, Ausholen und Treffer je Angriff; Grenzen Griff–Hand ≤ 2 cm, Waffe im Körper ≤ 1 cm)

| Figur | Waffe | max Griff vorn (cm) | max Griff hinten (cm) | max im Körper (cm) | rot |
|---|---|---|---|---|---|
| the_boss | spear | 0.7 | 1.3 | 0.0 | 0 |
| the_boss | halberd | 0.9 | 1.4 | 0.0 | 0 |
| the_boss | staff | 0.9 | 1.2 | 0.3 | 0 |
| the_boss | scythe | 0.9 | 1.4 | 0.0 | 0 |
| michelle | spear | 0.4 | 0.5 | 0.0 | 0 |
| michelle | halberd | 0.4 | 0.4 | 0.0 | 0 |
| michelle | staff | 0.4 | 0.4 | 0.0 | 0 |
| michelle | scythe | 0.4 | 0.4 | 0.0 | 0 |
| big_vegas | spear | 1.7 | 1.5 | 0.0 | 0 |
| big_vegas | halberd | 1.7 | 1.3 | 0.0 | 0 |
| big_vegas | staff | 1.6 | 1.3 | 0.0 | 0 |
| big_vegas | scythe | 1.5 | 1.4 | 0.0 | 0 |
| ortiz | spear | 0.3 | 1.0 | 0.0 | 0 |
| ortiz | halberd | 0.3 | 0.9 | 0.0 | 0 |
| ortiz | staff | 0.5 | 1.3 | 0.0 | 0 |
| ortiz | scythe | 0.3 | 0.6 | 0.0 | 0 |

Ergebnis: GRÜN (16 von 16; the_boss/halberd im Wiederholungslauf, der erste Lauf brach durch einen Neuladen des Prüfservers ab).

## Gate sword1h (WAFFEN=sword1h, neue Kit-Dateien r4c, Spur quarks)

- the_boss: rot 0 []
- michelle: rot 1 ['Stand: Waffe im Körper 0.0113']
- big_vegas: rot 0 []
- ortiz: rot 0 []
- Wiederholung michelle: ['Stand: Waffe im Körper 0.0103']

## Konsole / Belege
- Belegläufe (test/_einhand-beleg.mjs): keine Seitenfehler; je Angriff 1 Kontakt mit dem Ziel, Spur gestartet und beendet je Hieb.
