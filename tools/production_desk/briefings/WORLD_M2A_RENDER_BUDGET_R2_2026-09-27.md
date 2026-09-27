# WORLD-M2A-R2 · Render Budget

Owner: bestehende World-M2A-Runtime  
Executor: Work · Sol High  
Source: PR #258 · `work/world-m2a-playability-r1-2026-09-27@9e74fc792e6f00309e9f57f1d3ae4c46e1f0ee57`

## Ziel

Dieselbe Hürth-/KlayfaBizarro-Szene bei unverändertem Kernloop sichtbar und spielbar unter das Framebudget bringen. Kein neuer Feature-Slice.

## Erst prüfen

1. Im echten Browser den aktiven WebGL-Renderer/Grafikpfad protokollieren. Software-/Fallback-Rendering ist ein Befund, kein Grund für blindes Geometrie-Tuning.
2. Den vorhandenen Probeablauf identisch wiederholen: Idle, Walk, Drive-Offroad.
3. `PERFORMANCE_VALUE_MATRIX.md` aus PR #258 als Priorität verwenden.

## Genau ein Kandidat

Wenn Hardwarebeschleunigung aktiv ist: eine zusammenhängende sichtbare Runtime-Lösung aus

- Stadt-Distanzstufen bzw. vereinfachter Ferne,
- Schatten nur im nahen Gameplay-Korridor,
- entfernungsabhängigen Namen/kleinen Props.

Die Knetwelt, Gebäude-Silhouette und befahrbare Zone bleiben sichtbar. Keine „leere Stadt“ als Optimierung.

Wenn Software-/Fallback-Rendering aktiv ist: STOP mit reproduzierbarem Befund; keine Grafikqualität zerstören, um eine ungeeignete Testumgebung schönzumessen.

## Gates

- Frame p95 ≤ 33,3 ms für Idle, Walk und Drive-Offroad.
- Kaltstart bis Kontrolle ≤ 15 s.
- 4/4 Radkontakte, kein Fall außerhalb der Straße, Ground Gap innerhalb ±3 cm.
- World/Travel/Race-Owner bleiben unverändert.
- Paketprüfung und identischer Browserlauf grün.

## Nicht erlaubt

Keine Tracks, HUDs, Billboards, NPC-Ausweitung, Water, Combat, neuen Assets, neue Physik oder visuelle Neugestaltung. Keine Veröffentlichung der festen Stage vor bestandenem Browsergate.

## Return

Exact Repo/Branch/Head, Grafikpfad, Vorher/Nachher-Messung, sichtbare Änderung, Testzahlen, Publication-Status und genau ein nächster Gate.
