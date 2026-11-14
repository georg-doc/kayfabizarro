# Testrechner Grundlinie · site/stage @84acfcd1 · Mac mini (WSB) · RETURN

WSB, 14.11.2026, Brief WSB_REIHE_R1 §3 (V-1713). Gemessen wurde das fertige Stage-Bündel (Build `58b070e6`, 13.11. 23:50, „Fusskontakte je Fuss (3D-Schatten fuehrt), Soldaten Einzelschuss, Mausfang-Diagnose je Klick“), lokal ausgeliefert vom Worktree `~/kfb_work/stage`, außerhalb der Dropbox.
- Messgerät: Chromium (Playwright) mit ANGLE Metal, 1440 × 900.
- Probe: `../messe.mjs`, nach dem Muster `test/_rc5-check.mjs`.
- Je Lauf ein frischer Browser. Kalt = leerer Cache, warm = Neuladen im selben Kontext. „Bereit“ = Ereignis `kfb:ready`.
- Bildzeit: 10 s je Ort, gemessen über requestAnimationFrame.
- Die Proben `_tag-zyklus` und `_koerper-maus` brauchen den Vite-Quellserver und keinen fertigen Build. Für die Bündel-Messung habe ich sie nicht genutzt.

## Ladezeit bis spielbereit
| Lauf | kalt | warm | übertragen kalt / warm |
|---|---|---|---|
| A · nackte Adresse | 8.0 s | 7.0 s | 26.1 / 6.9 MB |
| B · mit debug | 7.9 s | 7.1 s | 42.1 / 6.9 MB |

- Der allererste Lauf nach dem Auschecken (Plattencache kalt, ohne Shader-Cache) brauchte für A 22.8 s.
- Danach brachte A am Start 13 Bilder über 33 ms, das längste mit 1,18 s. Das ist das Nachladen nach „bereit“, siehe `erstlauf/`.

## Bildzeit p50 / p95 (vsync an, 60 Hz, `vsync_an/perf.json`)
| Ort | A nackt | B debug | Speicher (B) |
|---|---|---|---|
| Start | 16.7 / 16.7 ms (60 fps, >33 ms: 0) | 16.7 / 16.7 ms (60 fps, >33 ms: 0) | 364.6 MB, 292 Draw Calls, 747245 Dreiecke, 182 Texturen |
| Wald (60, −220) | – | 16.7 / 16.7 ms (60 fps, >33 ms: 0) | 417.1 MB, 252 Draw Calls, 899008 Dreiecke, 186 Texturen |
| Arena (neben den Wachen, Gottmodus) | – | 16.7 / 16.7 ms (60 fps, >33 ms: 0) | 358.3 MB, 273 Draw Calls, 1983287 Dreiecke, 187 Texturen |

Mit vsync stehen alle Orte an der Bildschirmgrenze (60 fps, keine Ruckler). Die echte Rechenzeit ohne vsync (`vsync_aus/perf.json`):

| Ort | A nackt | B debug |
|---|---|---|
| Start | 9.4 / 11.1 ms (108.3 fps, >33 ms: 0) | 8.6 / 12.4 ms (114.6 fps, >33 ms: 0) |
| Wald | – | 12.3 / 13.5 ms (81.2 fps, >33 ms: 0) |
| Arena | – | 6.2 / 12 ms (154.5 fps, >33 ms: 1) |

- Am teuersten ist der Wald, mit etwa 12–14 ms je Bild (81 fps, also rund ein Drittel Luft über 60 fps).
- Wald und Arena gibt es nur mit debug: Ohne debug ist `__kfbM1` nicht da (Teleport geht nicht).
- JS-Speicher A am Start: 442.2 MB.

## Fehler
`FEHLERLISTE.md`:
- Ohne debug: 0 Seitenfehler, 0 Konsolenfehler.
- Mit debug: ein 404 (Kartenrückseite `KayfaBizarro_Card_Backside_01_lowrez.png` fehlt im Bündel).
- Dazu abgebrochene Song-Abrufe (`ERR_ABORTED`) beim Titelwechsel.

## Bilder
`orte.jpg`: oben Start A und B, unten Wald und Arena (B). Einzelbilder liegen in `vsync_an/`.

## Weiter
Nächste Messung nur auf Meldung von WS0 in PR #49, mit `node messe.mjs <stage-worktree> <out>` (mit `UNCAP=1` ohne vsync).
