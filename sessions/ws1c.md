# Übernahmekarte · WS1c „Wasser: Seen, Flüsse, Unterwasser, Wasserfahrt“
Stand 24.10.2026 · Format nach `sessions/lead.md` (Status §162, V-713). Die Karte ist ein Schnappschuss. Ausführlich steht alles in `~/kfb-ws1/research/audits/WATER_R1.md`.

## 1 · Auftrag und Grenzen
- **Auftrag:** `BRIEF_WS1_WATER_R1.md` (V-631, V-621). Seen ohne gezackten Rand und ohne oliven Saum. Flüsse mit sauberen Fällen und Mündungen, platziert aus dem Gelände. Unterwasser-Ansicht über das eine Licht-Rig. Fahren im, unter und über Wasser: einfache Kräfte, Bugwelle, Spritzer, Kamera-Wechsel. Fehlende Klänge als Liste an WS0.
- **Owner von:**
  - Wasser im Spiel: `src/look/kfbWater.js` (erzeugt) und der Ufer- und Grund-Teil in `src/look/terrain3.js` (erzeugt).
  - `src/m2/waterDrive.js`, `src/modules/waterFx.js`.
  - Wasser-Teile in `src/modules/m1-terrain.js` (`waterActive`, `under()`, `bubbles()`, `probeCam()`).
  - Generatoren `probe/port/gen_water_game.py` + `kfbWater.tpl.js` und `gen_terrain3.py` + `terrain3.tpl.js`.
  - Probe-Patches 35–37.
- **Nicht Owner von:** Ton (WS-Audio, nur Cues anfragen), Fahrphysik K2B und Fahrzeuge (WS1d, M3), Folgekamera (C1; nur optionale Hooks `mod`/`clampY`), M1-Wirt und Nebel-Host (Lead; nur der Unterwasser-Nebel in `M1World.jsx`), Hydro/Talprofil (HYDRO-Block der Probe), Vegetation und Ufer-Props.
- **Grenze Gelände-Probe:** `~/kfb-ws1/probe/gelaende-probe.html` wird von mehreren Sitzungen editiert, zum Beispiel vom Lead (Zusammenfluss-Zeile). Änderungen dort nur mit kurzer Nachricht an den Lead (Absprache vom 22.10.).

## 2 · Repo, Zweig, Stand
| Was | Wo |
|---|---|
| Arbeitsstand | `~/kfb-ws1/kfb-planet-water` (Worktree von `~/kfb-ws1/kfb-planet`), Zweig `ws1/water-r1` @842741f. Rebased auf mvp @b1e40e3, per Fast-Forward in `ws1/mvp-r1` eingebaut (Lead, 22.10.). Alter Stand: `ws1/water-r1-pre-rebase`. |
| Symlinks (gitignored, nie committen) | `node_modules → ../kfb-planet-npc/node_modules`, `src/private → ~/kfb-ws1/private-assets` |
| Quelle des Wassers | Gelände-Probe `~/kfb-ws1/probe/gelaende-probe.html` (keine Git-Ablage). Patches `patch35_ws1c_saum.py`, `patch36_ws1c_muendung.py`, `patch37_ws1c_saum2.py`. Sicherungen `probe/backups/gelaende-probe.pre-ws1c.html`, `probe/port/*.pre-ws1c`, `probe/pubsrv/index.pre-ws1c.html` |
| Bericht | `~/kfb-ws1/research/audits/WATER_R1.md`. Bilder: `research/audits/img/water-r1/`. Clip: `research/audits/clips/water-r1/wasser-fahrt-60s.webm`. Kritiker-Pakete: `research/audits/water-r1-critic{,2,3}/` |
| Brief | kayfabizarro `docs/kfb-decisions-register-2026-10-11`: `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/BRIEF_WS1_WATER_R1.md` |

## 3 · Bauen und prüfen
- **Wasser ändern:** Erst die Probe ändern bzw. die Generator-Vorlagen, dann neu erzeugen. Nie `kfbWater.js` oder `terrain3.js` von Hand ändern.
  - `python3 ~/kfb-ws1/probe/port/gen_water_game.py <spiel-repo>`
  - `python3 ~/kfb-ws1/probe/port/gen_terrain3.py <spiel-repo>`
  - Probe bauen: `python3 mkpublic.py`, dann `cp gelaende-probe.public.html pubsrv/index.html` (lokaler Server :8751).
- **Spiel:** `npx vite build`, danach `PW_GPU=1 node test/waterDrive.mjs`, `test/probeWater.mjs`, `node test/contract-static.mjs`. Letzter Stand: alle PASS.
- **Probe:** `node tests/shore-ab.mjs`, `underwater.mjs`, `rivers.mjs` (ohne Seitenfehler). Paritätstest Hydro: `node port/kfb-hydro.parity.mjs` (HYDRO unverändert).
- **Bilder mit Georgs Werten** (`look=terrain3,world=probe,tod=0.557` ≈ Sonne 12°): `test/out/water-r1/_final.mjs`, `_drivecam.mjs`, `_under.mjs`, `_mouth.mjs`. Hilfen: `test/_waterKit.mjs` (shoot mit Prüfkamera, waterSpots) und `test/_waterRun.mjs` (Fahr-Drehbücher PLAN, PLAN_CLIP).
- **fps und Clip nur im Slot:** `test/out/water-r1/_perf.mjs`, `_clip.mjs`. Clips mit Ton nur über den Vite-Server (`test/_audioServer.mjs`), über `file://` lädt die Tonbank nicht.
- **Achtung, Fallen:**
  - Zeilenkommentare `//` mitten in einzeiligen Ketten bringen den Bau zum Scheitern.
  - Während eigener Browser-Tests nicht bauen.

## 4 · Laufende Aufträge
- Keine offenen. R1 ist geliefert und eingebaut (Status §135, Bericht WATER_R1.md).
- Wartet auf andere:
  - WS0/WS-Audio: Wasser-Klänge. Cue-Liste in WATER_R1.md: `water.enter.splash` S/M/L, `exit.splash`, `surface.breach`, `dive.gulp`, `kick`, `under.loop`, `bubbles`, `wade.slosh`, `skim.spray`. Ereignisse `M2EVENTS 'water'` und `M2STATE.water.mode` liegen bereit.
  - Lead: volle Testreihe nach dem Merge (im Slot).

## 5 · Offen bei Georg / WS0
- **Kritiker CRITIC_3D_R1:** 4,3 → 4,9 → 5,1, weiter REWORK (ohne Stopp-Regel). Rest für R2:
  1. Fall-Netz und Gischt der Probe: Platte mit gerader Oberkante, Lücke zum Becken, Kugel-Gischt.
  2. Flussenden und Mündungen: Lauf- und Meerverteilung im HYDRO-Block, Flüsse enden in Mini-Mulden.
  3. Wurfschatten des Racers auf dem Wasser: Die Wasser-Shader empfangen keinen Schatten.
  4. Ufer-Grammatik: Steine und Büschel an der Wasserlinie (Vegetation/Props, nicht Wasser).
  5. Mini-Mulden < 30 m² lesen sich als „Auge“: beim Erzeugen weglassen?
- **Fragen an Georg:**
  - Wertstruktur: Seen haben in der Übersicht denselben Grauwert wie das Gelände. Hängt an den Kit- und Palettenfarben.
  - Darf das Unterwasser-Overlay heller sein als die Probe (UNDER 1:1)?
  - Brief für R2 (Fälle, Mündungen, Schatten) ja oder nein?

## 6 · Sonderregeln (Verweise)
- Tests nur headless, keine sichtbaren Fenster. Bilder und Abnahmen immer mit `look=terrain3`. Spiel nie ohne Hash öffnen (Memory `kfb-no-visible-browser-terrain3`).
- QA mit Georgs Werten: Sonne 12°, Wasser 0,06, Island-Kit-Fluid.
- Test-Slot `~/kfb-ws1/bin/kfb-slot` für volle Reihen, fps und Clips. Einzeltests ohne Slot, höchstens einer gleichzeitig (Memory `kfb-test-slot`).
- `contract-static` grün halten: Module ohne React, Store und window-Listener; `waterFx` ist ein Modul.
- Kein Merge oder Push nach main; eingebaut wird über den Lead. Vor Commits `ListAgents` prüfen. Private Dateien nie öffentlich.
- Keine Lizenz- oder Herkunftsprüfungen; Creator-Credits bleiben (Racer-GLBs CC0, Memory `kfb-racer-lizenz-cc0`).

## 7 · Nächster sinnvoller Schritt
Auf den WS0-Entscheid zu einem Brief „Wasser R2“ warten. Bei Ja zuerst in der Probe arbeiten:
1. Fall-Netz folgt dem Fels, mit Zulauf-Lippe; Gischt als Knet-Wolke.
2. Flüsse nur in ausreichend große Meere münden lassen und das Band auffächern (HYDRO, mit Paritätstest).
3. Schatten des Rigs ins Wasser bringen.

Danach neu erzeugen, Kritiker-Runde und Clip mit den Wasser-Klängen, sobald WS0 sie liefert.
