# Themen-Tags · Beleg R1 · WS-Verteiler · 03.11.2026 (V-1291)

Je Ort 5 Songs und 5 Pop-ups aus `ziehe()` in `src/world/themenTags.js`, Saat aus dem Ort. **unpassend** = der bewusst gezogene Bruch aus dem unteren Drittel (einer je 5). Wert = Passung 0 bis 1 aus Biom und Zone.

## Wald mit Traum-Zone (x 820, z 310; Biom moos 0.85, pastell 0.15; Zone dream_wrestling_with_kayfabe_freud)

| # | Song | Tags | Wert | | Pop-up | Tags | Wert |
|---|---|---|---|---|---|---|---|
| 1 | Psychedelic Lanterns | ostasien, traeumerisch, luft, wasser | 0.745 | | wz_freiheitsstatue **unpassend** | nordamerika, feierlich, wasser | 0.024 |
| 2 | Orchester 2: Streicher und Blech einzeln, mit Abschnitten und Pausen | mitteleuropa, feierlich, melancholisch, luft | 0.731 | | ding_fahrrad | westeuropa, heiter, luft | 0.669 |
| 3 | Kitsune no Majo | ostasien, unheimlich, traeumerisch, feuer | 0.619 | | bg_wald | traeumerisch, erde | 0.804 |
| 4 | Shepard Ascent **unpassend** | kosmos, unheimlich, traeumerisch, aether | 0.235 | | bg_schnee | kuehl, melancholisch, luft | 0.572 |
| 5 | Orchester-Charaktere | mitteleuropa, heiter, traeumerisch, luft | 0.966 | | wz_sternwarte | kosmos, traeumerisch, aether | 0.412 |

## Wüste mit Pharao-Zone (x -1460, z 2210; Biom wueste 0.9, canyon 0.1; Zone pharaoh_piledriver)

| # | Song | Tags | Wert | | Pop-up | Tags | Wert |
|---|---|---|---|---|---|---|---|
| 1 | Sunset Spiral | afrika, traeumerisch, heiter, erde, feuer | 0.555 | | bg_wueste | wild, feuer | 0.682 |
| 2 | E-Funk mit Talkbox | nordamerika, wild, heiter, feuer | 0.355 | | wz_koelner_dom | mitteleuropa, feierlich, unheimlich, erde | 0.537 |
| 3 | Hijaz Spring Reverb | nahost, traeumerisch, unheimlich, feuer | 0.943 | | bg_wald | traeumerisch, erde | 0.949 |
| 4 | S16 Café Absurde, zweiter Take **unpassend** | westeuropa, kosmos, traeumerisch, heiter, aether | 0.185 | | st_statue_4 | mittelmeer, feierlich, melancholisch, erde | 0.473 |
| 5 | Kitsune no Majo | ostasien, unheimlich, traeumerisch, feuer | 0.572 | | bg_schnee **unpassend** | kuehl, melancholisch, luft | 0 |

## Schnee ohne Zone (x 3020, z -870; Biom schnee 1)

| # | Song | Tags | Wert | | Pop-up | Tags | Wert |
|---|---|---|---|---|---|---|---|
| 1 | Hijaz Spring Reverb **unpassend** | nahost, traeumerisch, unheimlich, feuer | 0 | | bg_schnee | kuehl, melancholisch, luft | 0.912 |
| 2 | Freylekhs Dance | osteuropa, mitteleuropa, wild, melancholisch, feuer | 0.426 | | wz_kreml | osteuropa, feierlich, kuehl, feuer | 0.63 |
| 3 | Tender Bends | nordamerika, melancholisch, kuehl, wasser | 0.47 | | wz_diner **unpassend** | nordamerika, heiter, feuer | 0 |
| 4 | Kühle Wiederholung | mitteleuropa, kuehl, unheimlich, aether | 0.407 | | wz_freiheitsstatue | nordamerika, feierlich, wasser | 0.304 |
| 5 | Orchester-Charaktere | mitteleuropa, heiter, traeumerisch, luft | 0.481 | | st_statue_4 | mittelmeer, feierlich, melancholisch, erde | 0.204 |

Gleiche Stelle, gleiche Auswahl: Wer zurückkommt, hört und sieht dasselbe. Prüfung: `node test/unit/themenTags.mjs`.
