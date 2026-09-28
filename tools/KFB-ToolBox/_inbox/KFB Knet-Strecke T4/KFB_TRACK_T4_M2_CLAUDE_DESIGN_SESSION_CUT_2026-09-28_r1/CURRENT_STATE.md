# CURRENT_STATE · 2026-09-28 r1

| Bereich | Stand |
|---|---|
| Regelwerk M2 (Blatt) | CANDIDATE, von Georg für jetzt akzeptiert |
| Vertrag m2.json | v2.2.0 |
| T4 Markierung | M2 aktiv (`m2-markierung-hell`, `m2-markierung-signal`) |
| T4 Verwehung / Knetfleck | M1 (unverändert) |
| M1 Blatt + Vertrag | FROZEN als Verlauf |
| US-Regelwerk | Blatt: schaltbar · T4: nur im Builder-Parameter |

## Elemente in T4 nach M2
- Randlinie Strecke B 0,60 m, Stadt S 0,30 m, Keil über 20 m ab jeder Stadtgrenze, Außenkante bündig.
- Wo die Strecken-Randlinie im Übergang wegfällt (`mark_track` ≥ 0,5): Takt-Auslauf, 7 Stücke im 3-m-Takt bis auf Strichbreite.
- Magnetzone/Loop: Blocklinie B 3/3 m, signal, 3 m Lücke zum durchgezogenen Teil.
- Mitte Stadt: vom Zebra rückwärts 3 m, drei Warnstriche 6/3, 12 m, Leitlinie 6/12. Zum Ende hin Warnlinie bis in den Auslauf.
- Zebra: 12 m vor dem Sackgassenende, 6 m lang, Balken Q / Lücke Q, symmetrisch.
- Querschnitt: Knetwurst-Profil aus m2.json, Enden gerade (Stirnwand), keine Wobble.
