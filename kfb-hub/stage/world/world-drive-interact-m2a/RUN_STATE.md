# WORLD-M2A-R2 · Run State

Status: `STOPPED · HARDWARE_PASS · CANDIDATE_NO_GAIN · NOT_PUBLISHED`
Datum: 2026-09-27

## Lock

- Owner: bestehende World-M2A-Runtime
- Repo: `georg-doc/kayfabizarro`
- Branch: `work/world-m2a-render-budget-r2-2026-09-27`
- Parent: R1-Dokumentationsstand `9e74fc792e6f00309e9f57f1d3ae4c46e1f0ee57`
- R2-Implementierungscheckpoint: `46d796dcb139807f008294b2074a8d2f7b530ab3`
- Outcome: genau einen sichtbaren Renderkandidaten messen; keine Features und keine Veröffentlichung

## Ergebnis

- Hardware: ANGLE/Metal auf Apple M1 Max — PASS.
- Stadtlast: Wände 509.294, Dächer 215.255, Fenster 270.320 Dreiecke.
- Kandidat: vereinfachte dominante Knet-Reliefprojektion für Weltflächen; Props behalten volle Qualität.
- Paket: 23/23 PASS; Browser lädt ohne Shader-/Seitenfehler.
- p95: 180,8 / 172,8 ms statt Ziel ≤ 33,3 ms — FAIL, kein Gewinn.
- Diagnose ohne Fassadendetails: 832.865 Dreiecke, ebenfalls kein Framegewinn.

## Stop

Der eine zulässige R2-Kandidat ist ausgeschöpft. Keine Veröffentlichung und kein zweiter Material-/Shadow-Patch.

Nächster Gate: `WORLD-M2A-R3 · CITY SHELL LOD` — leichte mittlere/weite Stadtschale, volle Fassaden nur im Nahbereich.
