# RETURN · T4 + Markierung M2 · 2026-09-28 r1

**Status:** `T4_M2_CANDIDATE` · Georgs Abnahme für den jetzigen Stand, Tune-Pass offen.

## Probleme zuerst
1. **Liniendicke uneinheitlich im Eindruck.** S 0,30 / B 0,60 / Q 1,20 m sind regelkonform skaliert, lesen aber je Plan und Kamera verschieden (Georg). Nicht angefasst, gehört in den Tune-Pass.
2. **Einmündung: „es fehlt ein kompletter Streifen"** ist als Wartelinie-zu-kurz gelesen und gefixt. Wenn Georg etwas anderes meinte (z. B. Rand-Leitlinie im Knoten), ist das offen. `VOICE_INPUT_UNCERTAIN`.
3. **Anschlussstücke der Nebenstraße fehlen** (Georg: „fehlen grundsätzlich noch"). Nicht gebaut.
4. **Übergang Punktraster (Verwehung, Knetfleck) im 3D läuft noch mit M1** (Gauß-Kugelfelder, `KFB_BLEND_GLSL`). Das M2-Blatt zeigt das Raster, T4 nicht. Georg: „muss noch getunt werden, erstmal so lassen".
5. **Situationen nur auf dem Blatt:** Einmündung, Parkbucht, Linksabbieger, Parkdeck, Boxengasse, Start/Ziel, Curbs, Pfeile gibt es in T4 nicht, weil TD03 diese Orte nicht hat.
6. **td03.stream.json gepackt** (siehe START_HERE §3). Ohne Entpacken lädt T4 nicht.
7. **Fingerabdruck-Karte fehlt** (unverändert seit T3 v2).
8. **Leistung nicht neu gemessen.** Zahlen aus dem T4-Rückgabepaket gelten weiter mit Vorbehalt.

## Geliefert in dieser Session
- `KFB Markierungen M2.dc.html` · Regelwerk-Blatt M2 (neu, M1 bleibt als Verlauf).
- `lab-track/road-markings.m2.json` · Vertrag v2.2.0.
- `lab-track/road-markings.m2.js` · 3D-Bau M2 für T4 (neu).
- `lab-track/transition-atlas.v1.js` · liest M2, Fallback M1 (additiv, Mesh-Namen `m2-markierung-*`).
- `lab-track/track-look.v5.js` · lädt `road-markings.m2.json`, Zebra-Kamera versetzt.
- `KFB Knet-Strecke T4.dc.html` · Link auf M2, Beschriftungen M2, Import `?r=18`.
- Doku: `docs/ROAD_MARKINGS_M2.md`, `POSTMORTEM.md`, `CHANGELOG.md` (additiv), `HOUSEKEEPING.md`.

## Georgs Feedback, Punkt für Punkt
| Punkt | Stand |
|---|---|
| Einmündung: Streifen fehlt | Wartelinie reicht jetzt über den ganzen Fahrstreifen, bündig an Begrenzung und Randlinie im Bogen (Lücken gestreckt) |
| Querstreifen mit Blöcken komisch, Überlagerung mit dem Rand | Wartelinie liegt 0,6 m hinter der Rand-Leitlinie, nie darauf |
| weiß vs. gelb (US) | Wartelinie bleibt weiß (MUTCD: Querlinien weiß, gelb trennt Gegenrichtungen). Sperrfläche Linksabbieger wird in US gelb |
| Anschlussstücke | offen |
| Pfeile | gut, unverändert |
| Übergang | unverändert, Tune-Pass |
| Liniendicke | unverändert, Tune-Pass |
| Parkbucht komisch | echte Parkbucht im Gehweg, Bord 45° zurück, Trennstriche nur zwischen Ständen |
| Pfeile im Parkweg unbekannt | Fahrgasse als Einbahn, Pfeile mittig in einer Richtung |
| in den Track einsetzen | T4 läuft mit M2 (Rand, Stärkewechsel, Takt-Auslauf, Block, Mitte, Zebra) |
