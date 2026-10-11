# Replay-Harness · Spezifikation R1 · deterministische Tests im KFB Lab

Stand: 12.10.2026 · nur gelesen, nichts gebaut · Bezug: V-159, V-171 (Punkt „deterministische Tests“), V-166, V-107, V-169, V-185, V-187

## 0 · Rahmen

- **Lab-Wurzel:** `~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/`. Alle Code-Pfade sind relativ dazu. Zeilennummern gelten für den Stand vom 12.10. nachmittags.
- **Kennzeichnung:** `[code: Pfad:Zeile]` = im Code gelesen. `[doc: Pfad]` = aus einem Dokument. `[Vorschlag]` = mein Entwurf, nicht gebaut.
- **Nummerierung:** In `DECISIONS.md` ist „deterministische Tests (fixedDt, Sim-Zeit)“ Punkt 6 von V-171. Im Audit ist es Maßnahme 6 in §7. Der Auftrag nannte Punkt 5. Gemeint ist derselbe Inhalt. [doc: `30_DECISIONS/DECISIONS.md` V-171; `replies/AUDIT_ARCH_R1.md` §7]
- **NPC Performance Proof R1:** `replies/NPC_PERFORMANCE_PROOF_R1/REPORT.md` gibt es noch nicht. Der seek(t)-Ansatz steht nur als Idee in V-187 (TBD). Die Mixer-Regel unten (§2.6) ist darauf vorbereitet, hängt aber nicht davon ab. [doc: DECISIONS.md V-187]

---

## 1 · Ist-Zustand

### 1.1 Woher dt kommt

- Es gibt genau eine Spielschleife: `renderer.setAnimationLoop` [code: src/main.ts:510].
- dt kommt aus `THREE.Timer` (Wanduhr) und wird auf 50 ms gedeckelt: `dt = Math.min(0.05, clock.getDelta())` [code: src/main.ts:508, 511].
- Pro Bild gibt es **einen** Simulationsschritt mit diesem variablen dt. Unter 20 fps läuft die Simulation deshalb langsamer als Echtzeit. [code: src/main.ts:511; doc: AUDIT_ARCH_R1.md §3 „Zeitschritt“]
- Die Reihenfolge pro Bild ist fest, aber nur implizit: Shadow-Contract-Timer → Lab-Inseln `update` → Eingabe-Umbau (WoW-Maus) → `travel.update` → Kamera → Verdeckung → Audio → Race-FX → HUD → Organ (Tier-Timer, Schatten-Box) → Sky → Licht → `render` → Probe-Hooks → dynres. [code: src/main.ts:512–566]
- Probes hängen an `frameHooks`, also **nach dem Rendern, einmal pro Bild** [code: src/main.ts:505, 563, 597]. Bei wenig fps gibt es also weniger Messpunkte.

### 1.2 Was variabel getaktet ist

| System | Abhängigkeit von dt | Beleg |
|---|---|---|
| k2b-Fahrphysik | `stepDriver(d, F, inp, dt)` ist rein und dreifrei. Aber: explizite Euler-Terme (`latV`, Dämpfung `min(1, k·dt)`, Zentrifugal, Sprung) ändern das Ergebnis mit dt. Die Flugphase rechnet schon in 1/120-s-Teilschritten. Die Abhebe-Vorschau hängt an `speed·dt·2`. | [code: src/play/vendor/kfb-drive.k2b.js:79–141, 82, 110, 114] |
| Aufruf k2b | Der Lab-Adapter reicht das Bild-dt durch. | [code: src/play/drive.ts:148, 249] |
| Fuß-Controller | Ein Schritt ist `speed·dt`. Geprüft werden nur das Ziel `(nx, nz)` und drei Punkte im Abstand `radius` davor. Was zwischen Start und Ziel liegt, prüft niemand. | [code: src/play/vendor/walk-controller.js:133, 146–157] |
| Schwerkraft Fuß | `vy -= g·dt; y += vy·dt` (explizit) | [code: src/play/vendor/walk-controller.js:199] |
| Travel-Core | Zustandsmaschine, Schnitt-Zeitplan, Figuren-Mixer `actor.mixer.update(dt)` **in** der Logik. Der Sprung-Zustand liest die Clip-Zeit (`a.time >= duration·0,85`). Die Animation ist also Teil des Spielzustands. | [code: src/play/vendor/travel-core.j17.js:114, 140, 179] |
| Kamera | Meist `1 − exp(−k·dt)` (gut). Aber die Orbit-Feder ist explizit mit `h = min(dt, 0,05)`, und die Armlänge hat einen Deckel `7,5·dt`. | [code: src/play/camera.ts:89, 112] |
| Rail-Chase | `lerp(1 − exp(−dt·follow))`, FOV `min(1, dt·4)` | [code: src/play/drive.ts:81–97] |
| WoW-Maus | `turnA = absorbYaw() / (2·dt)`: Mausweg pro Bild wird zu einer Drehrate. Hängt an Bildtakt und Event-Takt. | [code: src/main.ts:519] |
| Tier- und Schatten-Timer | `tierT`, `organShadowT`, `contractT` zählen mit dt. | [code: src/world/organ/organ-world.ts:395, 406–409; src/main.ts:512–513, 558] |

### 1.3 Was zufällig oder uhrabhängig ist

- **Sim-relevant ist fast nichts zufällig.** k2b, Walker und Travel-Core nutzen kein `Math.random` und keine Uhr. [code: Dateien oben, grep]
- **Darstellung, unseeded:** Resident-Startzeit `act.time = Math.random()·duration` [code: src/residents/resident.ts:74]; Augen-Rig Blinzeln und Blick [code: src/residents/pet-eye-rig.v6.js:58–66, 285–311]; Ohren [code: src/play/vendor/j17/pinned/ear-dangle.v1.js:69]; Gesicht, dazu ein `setTimeout`-Drossel mit `performance.now` [code: src/play/vendor/j17/pinned/face-mount.v1.js:111, 584, 606]; HUD-Bogen [code: src/hud/vendor/kfb-hud.js:449].
- **Shader-Zeit aus der Wanduhr:** Wasser `uTime = performance.now()` [code: src/water/water.ts:76, 114].
- **Audio:** Streu-Sounds und Jingles zufällig [code: src/audio/audio-owner.ts:48, 130; src/audio/race-audio.ts:79]. Das gehört nicht in die Sim.
- **Schon deterministisch (Vorlage):** Knet-VFX mit `mulberry(seed)` [code: src/play/vendor/clay-vfx.v1.js:9, 12]; Organ-Figuren mit `hash()` als Startzeit [code: src/world/organ/vendor/lab-organ/organ-world.lab.js:578]; Regen bleibt bewusst zufällig, weil Bild, nicht Welt [code: src/sky/vendor/travel/globe-v13/rain-overlay.js:16]. Ein Seed-RNG gibt es schon: `rng(seed)` (mulberry32) [code: src/island/noise.ts:34; src/island/r2d/math.ts:17].
- **dynres** ändert Canvas-Größe und Pixelverhältnis zur Laufzeit [code: src/main.ts:493–504, 496]. In allen Tests ist sie per `dynres=0` aus [code: tools/parity/parity.mjs:20].

### 1.4 Wie die Tests heute laufen

- **Alle Tests** starten Playwright mit festem Pfad `/Applications/Google Chrome 2.app`, headless, gegen den **geteilten Dev-Server** 5192 [code: tools/parity/parity.mjs:20, 22; tools/track/c4a-foot-test.mjs:7, 9].
- **Kein Rail-Follower für Fußtests.** Die Fußtests lenken in einem Regelkreis über echte Tasten: Zustand lesen, Taste drücken, 50 ms Wanduhr warten [code: tools/track/c4a-foot-test.mjs:12–16; tools/track/drive-test.mjs:22–27]. Treppe und Platz halten Tasten nach Wanduhr (bis 14–40 s bzw. 3,5 s) [code: tools/track/trail-foot-test.mjs:20; tools/track/c4c-plaza-foot.mjs:19].
- **fps-Gate nach V-159:** Der Mittelwert der Bildrate über den Lauf wird berichtet, PASS nur bei ≥ 50 [code: tools/track/c4a-foot-test.mjs:20, 42; trail-foot-test.mjs:28; c4c-plaza-foot.mjs:22].
- **Parity:** Checks 1, 5, 8 halten Tasten in Sim-Zeit (`simWait`, V-107) [code: tools/parity/parity.mjs:42]. Check 2 misst über die Wanduhr [code: :49–50]. Check 3 drückt Space 40 ms und liest nach 160 ms [code: :52, 57, 60]. Check 4 setzt das Jitter-Kriterium unter 30 fps still aus [code: :76–77]. Check 6 wartet 3 s Wanduhr [code: :91]. Check 11 (offene Kanten) ist geometrisch und zeitfrei [code: :111].
- **Fahrtest:** Die einzige saubere Stelle. `runDriveTest` fährt k2b mit festem `dt = 1/60` in einer eigenen Schleife, ohne Rendern, im Autopiloten über die echten Tasten-Eingänge [code: src/play/drive-test.ts:17, 36–64]. Der Runner lädt es per `import()` in die Seite [code: tools/track/drive-test.mjs:15].
- **Vorlagen für feste Schritte gibt es schon:** J17 `track-look.v5.js` hat `step(fixed)` und misst Kosten mit `step(1/60)` [code: src/world/organ/vendor/j17/lab-track/track-look.v5.js:486, 515–516]. Der Travel-Core hat ein Probe-Skript nach Sim-Zeit (`[t, {car, keys, tap, place, guide}]`) [code: src/play/vendor/travel-core.j17.js:195–210].

### 1.5 Warum niedrige fps ins Ergebnis durchschlagen

1. **Schrittweite = Abtastweite.** Der Walker prüft nur Ziel und Führungskante. Bei 20 fps und Sprint liegt das Ziel bis etwa 0,3–0,45 lab voraus (Annahme: Sprint 6–9 lab/s; gemessen ist nur Jog ≈ 1,40 H/s = 5,1 lab/s [code: tools/parity/parity.mjs:21]). Eine Fuge oder Wand, die schmaler ist als dieser Sprung, liegt zwischen zwei Abfragen. So entstand das falsche PASS aus V-159. [code: walk-controller.js:146–157; doc: DECISIONS.md V-159]
2. **Der Mittelwert schützt nicht.** Das Gate prüft die mittlere fps. Ein Lauf mit 55 fps im Mittel kann einzelne 50-ms-Schritte enthalten (GC, Swap), genau an der Fuge. Ein falsches PASS ist also auch mit „fpsOk“ möglich. [code: c4a-foot-test.mjs:20, 42]
3. **Die fps-Zahl ist verzerrt.** Sie wird als Bilder ÷ Summe der *gedeckelten* dt gerechnet. Unter 20 fps zeigt sie nie weniger als 20. Das Gate kippt trotzdem richtig auf FAIL, aber die berichtete Zahl stimmt nicht. [code: c4a-foot-test.mjs:20, 42; trail-foot-test.mjs:28]
4. **Regelkreis über Prozessgrenzen.** Lenkung mit 50 ms Wanduhr plus Playwright-Latenz. Bei 12 fps bekommt die Sim nur jeden dritten bis vierten Lenkbefehl rechtzeitig. Der Weg und damit der Testinhalt ändern sich. [code: c4a-foot-test.mjs:12–16]
5. **Tasten-Taps hängen am Bild.** Space-Loslassen wartet zwei rAF [code: src/main.ts:350]. Die Länge eines Taps in Sim-Zeit hängt also an der Bildrate. Das ist ein Grund für das Kippen von Parity 3.
6. **Explizite Integration.** k2b, Walker-Schwerkraft und Kamera-Feder liefern bei anderem dt andere Bahnen. Selbst ohne Tunneln sind zwei Läufe also nie gleich. [code: kfb-drive.k2b.js:114; walk-controller.js:199; camera.ts:89]
7. Der Travel-Core notiert selbst: Bremsen schießt bei 20 fps in den Rückwärtsgang über [code: travel-core.j17.js:207].

### 1.6 Nebenbefund Vendor

`src/play/vendor/travel-core.j17.js` hat heute md5 `7c6bcc53…`. `SOURCE.md` nennt als Lab-Stand `c49e8fe7…` und nur einen LAB PATCH (Zeile 97). In der Datei stehen fünf LAB-PATCH-Marker vom 10. und 11.10. (B0 Sprungarten, WoW-Maus) [code: travel-core.j17.js:24, 98, 153, 160, 176; doc: src/play/vendor/SOURCE.md]. `kfb-drive.k2b.js` (`8f1ba4b8…`), `walk-controller.js` und `locomotion-profiles.v1.js` stimmen mit `SOURCE.md` überein. → `SOURCE.md` nachziehen, bevor das Replay sich auf Byte-Stände beruft.

---

## 2 · Zielentwurf

### 2.1 Fester Simulationsschritt

[Vorschlag] Neues Modul `src/sim/loop.ts`:

- `SIM_HZ = 120`, `SIM_DT = 1/120`. Begründung: k2b fliegt schon in 1/120-Schritten [code: kfb-drive.k2b.js:82]; der Walker-Schritt sinkt auf ≤ 0,08 lab bei 9 lab/s. Rückfall 60 Hz, falls die Kosten pro Tick über 2 ms liegen (siehe §4, Risiko 4).
- Akkumulator: `acc += min(realDt, 0,25)`; solange `acc ≥ SIM_DT` und `n < MAX_SUB = 8`: einen Tick rechnen. Bleibt danach mehr als ein Tick übrig, wird der Rest verworfen und `simLag` gezählt (Zeitlupe statt Todesspirale; nie größere Schritte).
- Invariante als Prüfung: `v_max · SIM_DT ≤ ½ · kleinste Fugenbreite`. Die Bau-Sitzung trägt die gemessene kleinste Fuge ein (G2-Fuge Bord/Gehweg).
- `tick` ist eine ganze Zahl ab 0. Sim-Zeit = `tick · SIM_DT`. Kein Float-Aufsummieren.

Tick-Reihenfolge (eine geordnete Liste, wie im Audit §1.2 gefordert):

1. `input.apply(tick)` – logische Aktionen setzen (§2.4)
2. `travel.update(SIM_DT)` – k2b, Travel-Core, Walker, Figuren-Mixer, Car-Hop/Sitz
3. `camera.update(SIM_DT)` – Spielkamera inklusive Rail-Chase und Raycasts
4. `presentationTick(SIM_DT)` – Race-FX (seeded), Sky/Tageszeit, Organ-Tier-Timer, Verdeckungs-Fade, Residents
5. `probes.onTick(tick)` – Messungen, **vor** dem Rendern, je Tick

Danach rendert der Bild-Takt einmal (§2.2). Audio, HUD, dynres und fps-Messung laufen im Bild-Takt außerhalb der Sim (§2.6).

### 2.2 Rendern entkoppelt und interpoliert

[Vorschlag]

- Nach jedem Tick werden `prev` und `curr` für wenige Transformationen gesichert: Auto-Pose, Figuren-Root (Position, Heading), Kamera (Position, Quaternion, FOV).
- Gerendert wird mit `alpha = acc / SIM_DT`: Position lerp, Rotation slerp. Danach werden die echten Werte zurückgeschrieben. Die Sim sieht nie interpolierte Werte.
- Skelett-Posen werden nicht interpoliert. Bei 120 Hz ist der Fehler kleiner als ein Bild.
- Im Replay-Modus ist `alpha = 0`: Ein Bild zeigt genau den Tick-Zustand.

### 2.3 Seed-RNG und Zeitquelle

[Vorschlag] `src/sim/rng.ts` übernimmt `rng(seed)` aus `src/island/noise.ts:34` (Vorlage zuerst):

- Benannte Ströme: `rng.stream('residents')`, `('eyes')`, `('fx')`, `('audio')`. Jeder Strom leitet seinen Seed aus `worldSeed` und Namen ab (Hash). So stört ein neuer Aufrufer die anderen Ströme nicht.
- Lab-eigener Code ersetzt `Math.random` durch den passenden Strom: `resident.ts:74`, `race-audio.ts:79`, `audio-owner.ts:48, 130`.
- Vendor-Dateien bleiben byte-gleich. Im Modus `?replay=1` oder `?seed=` wird **vor** jedem anderen Import `Math.random` durch einen eigenen Strom `('vendor')` ersetzt (erste Zeile in `main.ts` bzw. ein Mini-Modul `src/sim/boot-seed.ts`). Das deckt Augen, Ohren, Gesicht und HUD ab, ohne sie zu ändern.

`src/sim/clock.ts`:

- `clock.simTime()` = `tick · SIM_DT`; `clock.realNow()` = `performance.now()`.
- Modus `real` (Spiel) und `test` (Replay). Im Test-Modus liefert die Schleife keine Wanduhr an die Sim; sie wird nur noch über `step(n)` getrieben.
- Wasser-Shader und alle Lab-eigenen `uTime` lesen `clock.simTime()` statt `performance.now()` [betrifft code: src/water/water.ts:76, 114].
- Bau-Zeitmessungen (`buildMs`, `ms`) bleiben bei `performance.now()`. Sie sind Messwerte, keine Sim-Eingabe.
- Prüfskript `tools/sim/purity-check.mjs`: In den Sim-Dateien (`src/sim/`, `src/play/` außer Bau-Zeitmessung, `drive.ts`, `travel.ts`, `camera.ts`) darf kein `Math.random`, `Date.now` oder `performance.now` stehen. Ausnahmen stehen in einer Liste mit Grund.

### 2.4 Eingabe-Aufzeichnung

[Vorschlag] `src/sim/input.ts`:

- Tastatur und Maus schreiben nur noch in einen Puffer. Erst `input.apply(tick)` setzt `travel.keys` bzw. `drive.keys`. Heute schreiben die Event-Handler direkt mitten im Bild [code: src/main.ts:348–350, 385–386].
- Ein Tap gilt mindestens einen Tick lang. Das ersetzt den Doppel-rAF beim Space-Loslassen [code: src/main.ts:350].
- Mausdrehung wird pro Tick als Winkel gesammelt (rad), nicht als Pixel. `turnA` entsteht aus diesem Winkel ÷ `SIM_DT` [ersetzt code: src/main.ts:519].

Format `kfb.replay/1` (JSON, geräteunabhängig, nur logische Aktionen):

```json
{
  "schema": "kfb.replay/1",
  "lab": { "md5": { "kfb-drive.k2b.js": "8f1ba4b8…", "travel-core.j17.js": "7c6bcc53…" }, "chrome": "…", "note": "Grund des Laufs" },
  "entry": "organ", "query": "hub=1&play=game&c4c=1",
  "simHz": 120, "seed": 4242,
  "start": { "mode": "WALK", "walker": [x, z, heading], "car": { "s": 0, "lat": 0 }, "cam": { "zoom": 1.0, "yawOff": 0 } },
  "input": [
    [0,   { "fwd": 1 }],
    [240, { "fwd": 1, "shift": 1 }],
    [300, { "jump": 1 }], [301, { "jump": 0 }],
    [600, { "turn": 0.35 }],
    [900, {}]
  ],
  "events": [[1200, { "place": [1395, 30, 0] }], [1500, { "mark": "door" }]],
  "probeEvery": 1,
  "shots": [0, 480, 1200],
  "expect": { "hash": { "1200": "9f3a…" } }
}
```

- `input` ist delta-kodiert: Ein Eintrag gilt ab seinem Tick, bis der nächste kommt. Felder: `fwd back left right strafeL strafeR shift ctrl jump` (0/1), `turn` (analog, Anteil an turnRate), `orbit: [dYaw, dPitch]` (rad pro Tick), `zoom` (Zielwert). Für das Auto übersetzt der Travel-Core dieselben Felder wie heute [code: src/play/travel.ts:181].
- `events` sind Harness-Eingriffe (Platzieren, Marken). Sie sind keine Spielereingabe und werden im Bericht getrennt gezählt.
- Aufnahme: `?record=1` schreibt pro Tick die Deltas mit; `__kfb.sim.recording()` gibt das JSON zurück.
- Die vorhandenen Travel-Core-Skripte (Sekunden) lassen sich 1:1 in Ticks umrechnen (`tick = round(t · simHz)`) [code: travel-core.j17.js:195–197].

### 2.5 Replay-Runner (headless)

[Vorschlag] Seiten-API als schmaler, versionierter Namensraum (Audit §1.2: `probe.v1`):

- `__kfb.sim.ready` – Promise; erfüllt erst, wenn Welt, Auto, Figur, Texturen und Shader fertig sind. `__kfb` wird sofort mit `{ ready: false, bootError }` gesetzt (Audit §4) [betrifft code: src/main.ts:570].
- `__kfb.sim.load(replay)` – setzt Seed, Startzustand und Eingabeliste; stoppt die Animationsschleife (`setAnimationLoop(null)`).
- `__kfb.sim.run(toTick, opts)` – rechnet Ticks so schnell wie möglich, **ohne** zu rendern. Läuft in Blöcken (z. B. 600 Ticks je `evaluate`), damit die Seite antwortet. Gibt Probe-Daten und Hashes zurück.
- `__kfb.sim.render()` – rendert den aktuellen Tick einmal (alpha 0) und liefert das Bild als PNG-Daten-URL.
- `__kfb.sim.hash()` – FNV-1a über die Float64-Bits eines festen Zustandsvektors: k2b-Fahrer (`s lat psi speed latV airY airV onGround drift squash fly.P fly.V`), Walker (`position heading vy onGround`), Travel-Core (`st gait clip` + Clip-Zeit), Kamera (`position quaternion fov`), Zählerstände der RNG-Ströme. Hash je Sekunde (alle 120 Ticks) und am Ende.

Node-Seite `tools/replay/run.mjs <replay.json> <outDir>`:

- Chrome aus `KFB_CHROME`, Standard der heutige Pfad.
- Ziel ist ein **Build-Schnappschuss**: `vite build` in ein Temp-Verzeichnis, `vite preview` auf eigenem Port (z. B. 5193). Nie 5180, nicht der geteilte 5192 (Audit §4). Rückfall auf 5192 nur mit Flag `--live`.
- Feste Seite: Viewport 960×600, `deviceScaleFactor 1`, Query `replay=1&dynres=0&prCap=1&shot=1&sound=0&hud=0&almanac=0`. `shot=1` schaltet `preserveDrawingBuffer` an [code: src/main.ts:41, 69].
- Ausgabe: `result.json` (Hashes, Probes, Kennzahlen, simLag = 0 Pflicht), `shots/<tick>.png`.
- CPU-Drossel optional per CDP `Emulation.setCPUThrottlingRate` (Audit §2b). Sie darf das Ergebnis nicht ändern, nur die Laufzeit.

### 2.6 Was nicht in die Sim gehört

| Bereich | Regel |
|---|---|
| dynres | Bleibt im Bild-Takt. Im Replay aus. Liest nie Sim-Zustand, schreibt nie hinein. [code: src/main.ts:493–504, 566] |
| Audio | Liest Sim-Ereignisse (k2b `events`, Travel-Core-Ereignisse) und den Zustand nach dem Tick. Schreibt nichts zurück. Eigener Strom `rng('audio')`. Läuft auf der AudioContext-Uhr. |
| VFX (Race-FX, Knet-Partikel) | Tick-getrieben im Präsentationsschritt, Seed fest [code: clay-vfx.v1.js:12]. Ergebnis wird nie von der Sim gelesen. |
| HUD, Almanach, Debug-Panel | Bild-Takt, nur lesend. |
| Shadow-Contract, Himmel-Neumalen | Nach Ereignissen statt nach Zeit (Audit §2b, Punkt 5). Im Replay nach jedem Ladeereignis einmal. |
| fps-Messung, Probe-Hooks `onFrame` | Bild-Takt, nur für Leistungsmessung. Logik-Probes nutzen `onTick`. |

**Animation-Mixer:**

- Der Figuren-Mixer gehört zur Sim, weil der Travel-Core die Clip-Zeit liest [code: travel-core.j17.js:140, 179]. Er läuft mit `mixer.update(SIM_DT)` je Tick. Das passiert schon heute innerhalb von `core.update`; es ändert sich nur das dt.
- Andere Mixer (Residents, Organ-Figuren, Augen) sind Präsentation. Sie laufen seek-artig: `action.time = phase0 + simTime` modulo Clipdauer, dann `mixer.update(0)`. `phase0` kommt aus `rng('residents')` statt `Math.random` [betrifft code: resident.ts:74; organ-world.lab.js:578 macht es schon mit `hash()`].
- Damit ist jede Pose eine Funktion von `simTime`. Ein Bild an Tick n ist ohne Vorgeschichte reproduzierbar. Das passt zu seek(t) aus V-187.

---

## 3 · Testarten auf dem Harness

Jeder Test hat zwei Ebenen: **Determinismus** (gleiche Hashes) und **Inhalt** (Kriterium). Ein Test ist nur PASS, wenn beide halten. Die Bildrate ist kein Kriterium mehr, sie wird nur berichtet. [Vorschlag; die Steuerung entscheidet, ob V-159 für Replay-Tests ersetzt wird]

### 3.1 Fahr-Replay (Rail und frei)

- **Rail:** Der Autopilot aus `drive-test.ts` bleibt [code: src/play/drive-test.ts:36–64]. Er läuft jetzt im Sim-Loop mit `SIM_DT` und schreibt seine Eingaben als `kfb.replay/1` mit. Ein zweiter Lauf spielt nur diese Aufnahme ab, ohne Autopilot.
- **Frei:** Eine aufgenommene Handfahrt im Organ-Hub (Abfahrt, C4c-Ausfahrt, Sprung, Parkbox, Wende). Startzustand und Eingaben aus der Datei.
- **PASS Determinismus:** drei Läufe, CPU-Drossel ×1, ×1, ×4: alle Sekunden-Hashes und der End-Hash gleich. Aufnahme und Abspielen ergeben denselben End-Hash.
- **PASS Inhalt:** wie heute in `drive-test.ts`: `tunnelling = 0`, `underRoad = 0`, `stuck = 0`, `rescues = 0`, `landingsOk = true`, `camClipTunnel = 0`, `camClipBody = 0`; Rundenzeit innerhalb ±1 % der abgenommenen Baseline-Datei.

### 3.2 Fuß-Test ohne Tunneln

- Der Autopilot läuft **in der Seite** und lenkt pro Tick (Audit §4). Die Logik von `walkTo` bleibt (Kreuzprodukt, Schwelle 0,12) [code: tools/track/c4a-foot-test.mjs:12–16], aber ohne Wanduhr und ohne Playwright-Tasten.
- Probes an jedem Tick: Figurenhöhe gegen Lauffläche, Rolle, `belowSurface`, `airborneOver1H`, Zustand.
- **Neuer Segment-Probe:** Zwischen Position(t−1) und Position(t) wird die Lauffläche alle 0,05 lab abgefragt (`surfaceAt`). Liegt auf dem Segment ein Punkt mit `null`, `wall` oder einem Höhensprung größer `stepMax` (0,885 lab [code: src/play/figure.ts:99]), und der Walker ist trotzdem durchgegangen, zählt das als `tunnel`.
- **Kontrolle, dass der Probe sieht:** Ein Test-Fixture mit einer 0,2-lab-Fuge (nur hinter `?fixture=gap`). Mit `SIM_DT = 1/20` muss der Segment-Probe anschlagen, mit 1/120 darf die Figur nicht hindurch.
- Routen: C4a (Tür, Ein-/Aussteigen, Bucht, 6 Hex-Punkte), Treppe V-157, Platz C4c (Zebra, Poller), Hex-Schleife aus `drive-test.mjs`.
- **PASS:** `tunnel = 0`, `belowSurface = 0`, alle Wegpunkte erreicht, `simLag = 0`; Hashes gleich bei Drossel ×1 und ×4; Fixture-Kontrolle schlägt bei 1/20 an.

### 3.3 Kamera-Freiraum (V-169 / V-185)

- Fahr-Replay über Spiralen: O1-Ring (bekannt PASS) und td03-Parkhaus-Spirale (bekannt FAIL, als Gegenprobe) [doc: DECISIONS.md V-169].
- Je Tick, mit der echten Rail-Chase-Kamera:
  - Sichtlinie Kamera → Auto (Dach, Mitte, Front) gegen Strecken- und Weltmeshes. Treffer = `occluded`.
  - Freiraum über der Kamera: Strahl entlang Fahrbahn-Oben bis zur nächsten Fläche darüber. Kleinster Wert = `clearMin`.
  - Kamerahöhe über der eigenen Fahrbahn in lab. Größter Wert = `camMaxLab`.
- `camMaxLab` liefert den Endwert, den V-185 von der Bau-Sitzung verlangt (vorläufig 9,0 lab = Kamera-Maximum + 0,5). Alle Werte mit Einheit lab.
- **PASS:** O1-Ring `occluded = 0` und `clearMin ≥ 0,5 lab`. td03 muss FAIL melden, sonst ist der Test blind. Bericht nennt `camMaxLab`.

### 3.4 Golden Frames

- Je Replay feste Shot-Ticks, zum Start sechs: Hub im Stand, Jog, gerade Fahrt, Tunnel, Spirale, Landung.
- Bild über `__kfb.sim.render()` bei festem Canvas 960×600, DPR 1, dynres aus, alpha 0.
- Vergleich **in der Seite**, ohne neue Node-Pakete: Golden-PNG laden, auf 2D-Canvas zeichnen, `getImageData`.
  - Pixel-Diff: Anteil der Pixel mit Luma-Δ > 8/255.
  - SSIM auf Luma, 8×8-Fenster, Standardkonstanten (k1 = 0,01, k2 = 0,03).
  - Diff-Bild als PNG neben das Ergebnis.
- Die vorhandene Flicker-Messung liest schon Raster per `readPixels` [code: tools/track/flicker-frames.mjs:1–3]. Sie ist Vorlage für das Auslesen.
- **PASS gleiche Maschine, gleicher Chrome:** Pixel-Diff ≤ 0,2 % und SSIM ≥ 0,995 je Shot. **Selbsttest:** zwei Renders desselben Ticks im selben Lauf = 0 Pixel Unterschied.
- **Fremde Maschine:** SSIM ≥ 0,98 nur als Info. GPU und Treiber sind nicht gleich.
- Goldens liegen in `docs/golden/<replay-id>/` mit Manifest (md5, Chrome-Version, GPU-String, Replay-md5). Neue Goldens nur nach Freigabe der Steuerung.

### 3.5 Offene Kanten (unverändert)

- Parity-Check 11 bleibt wie er ist: `openEdgesInPage(300)` [code: tools/parity/parity.mjs:111; tools/track/open-edges-lib.mjs].
- Er ist geometrisch und braucht keine Zeit. Er läuft nach `sim.ready` im selben Lauf.
- **PASS:** `open = 0`, `multi = 0` (wie heute).

---

## 4 · Migrationsplan für die Bau-Sitzung

Regeln für alle Schritte: Arbeitsstand hinter URL-Flag (V-166). Nach jeder Änderung die geänderten Module per curl auf 200 prüfen. Kein `//` in einzeiligen Funktionen. Vendor-Dateien nie ändern; Prüfung per md5. [doc: Memory „Shared dev server edits“; DECISIONS.md V-166]

| # | Schritt | Prüfbar durch | Aufwand |
|---|---|---|---|
| 1 | **Sim-Loop und Uhr hinter `?sim=fixed`.** `src/sim/loop.ts`, `src/sim/clock.ts`. Die Schleife in `main.ts:510–567` ruft die Systeme über die geordnete Liste auf. Ohne Flag bleibt alles wie heute. | Ohne Flag: Parity unverändert grün. Mit Flag: Walker legt in 2,0 s Sim-Zeit bei Drossel ×1 und ×4 dieselbe Strecke zurück (±0,5 %). `simLag` sichtbar. | S |
| 2 | **Physik-Abgleich k2b und Walker.** `drive-test.ts` einmal mit 1/60 (heute) und einmal mit 1/120. Vergleich: Rundenzeit, Treffer, Landungen, Querbeschleunigung. Walker: Parity 1–3 bei 1/120. Entscheidung 120 oder 60 Hz. | Rundenzeit ±2 %, Treffer ±1, Landungen gleich, Parity 1–3 grün. Sonst 60 Hz. | S |
| 3 | **Eingabe-Schicht und Aufnahme.** `src/sim/input.ts`; Tasten und Maus nur in den Puffer; Tap ≥ 1 Tick; `turn` in rad pro Tick; `?record=1`. | Eine Handfahrt aufnehmen und abspielen: gleicher End-Hash auf derselben Maschine. | M |
| 4 | **Seed-RNG und Zeitquelle.** `src/sim/rng.ts` (aus `noise.ts`), `boot-seed.ts`, `uTime` aus Sim-Zeit, `purity-check.mjs`. | Purity-Check grün. Zwei Replays mit gleichem Seed: gleiche Hashes inklusive Residents und VFX. | S |
| 5 | **Replay-API und Runner.** `__kfb.sim.*`, Zustands-Hash, `tools/replay/run.mjs`, `KFB_CHROME`, Build-Schnappschuss auf eigenem Port. | Audit-Abnahme: dreimal gleiches Ergebnis, auch mit Drossel ×4. | M |
| 6 | **Interpoliertes Rendern.** `prev`/`curr` für Auto, Figur, Kamera; alpha-Render. Parity-Check 4 ohne `measurable`-Ausnahme. | Kamera-Jitter p95 ≤ 0,05 lab bei 20 und 60 fps. Flicker-Probe nicht schlechter als vorher. | M |
| 7 | **Tests umstellen.** Fahr-Replay, Fuß-Replay mit Segment-Probe und Fixture, Parity 1–8 als Replay-Skripte, Kamera-Freiraum, Golden Frames. | Alte und neue Fußtests auf gleicher Route: gleiches Urteil bei ≥ 50 fps. Der neue bleibt bei Drossel ×4 gleich. O1 PASS, td03 FAIL. Golden-Selbsttest 0 Pixel. | M–L |
| 8 | **Standard umschalten.** `sim=fixed` wird Standard, wenn Parity dreimal grün ist. Der alte Pfad bleibt eine Woche als `?sim=var`, dann raus. | Parity und Replay-Suite grün auf Standard-URL. | S |

**Was sich an Tests ändert:**

- Ändern: Parity-Checks 1–8 (Eingabe per Replay, Kriterien gleich); `c4a-foot-test.mjs`, `trail-foot-test.mjs`, `c4c-plaza-foot.mjs` und der Fußteil von `drive-test.mjs` (Autopilot in der Seite, Tick-Probes, kein fps-Gate); `drive-test.ts` (Sim-Loop, Hash, Aufnahme; Logik und Kriterien bleiben).
- Bleiben: Parity-Check 9 (keine Debug-Werte), 10 (Cozy offline), 11 (offene Kanten). Ein echter Tastatur-Smoke-Test bleibt in Parity, damit die Verdrahtung Taste → Aktion geprüft wird. Leistungs-Tests (`fps-diag`, `perf-line`, V-107-Leistungsmessung) und die Flicker-Probe bleiben Echtzeit. Sie messen die Maschine, nicht die Logik.

**Risiken:**

1. **Physik-Nachstimmung (hoch).** k2b ist auf variables dt um 60 fps abgestimmt. Explizite Terme ergeben bei 1/120 leicht andere Bahnen [code: kfb-drive.k2b.js:96, 114, 134]. Walker-Sprunghöhe und Clip-Zeiten verschieben sich minimal (Parity 3). Gegenmittel: Schritt 2 als messbarer A/B-Vergleich vor allem anderen. Kriterium verfehlt → 60 Hz, nie die Zahlen in k2b ändern.
2. **k2b-Byte-Gleichheit.** `stepDriver` ist rein und bekommt dt als Argument [code: kfb-drive.k2b.js:79]. Der feste Schritt entsteht nur im Aufrufer (`drive.ts:148, 249`). k2b bleibt `8f1ba4b8…`. Das Vendor-Prüfskript aus V-171 Punkt 7 prüft das vor jeder Lieferung. Dasselbe gilt für Walker und Travel-Core; dort zuerst `SOURCE.md` auf den echten Stand bringen (§1.6).
3. **Versteckte Nicht-Determinismen.** Reihenfolge asynchroner Ladevorgänge, `setTimeout` im Gesicht [code: face-mount.v1.js:111], Reihenfolge der `Math.random`-Aufrufe in Vendor-Dateien. Gegenmittel: `sim.ready`-Schranke, benannte Ströme, Hash je Sekunde. Bei Abweichung wird der erste abweichende Tick per Halbierung gefunden.
4. **Leistung.** 120 Hz heißt zwei Ticks pro Bild bei 60 fps, mehr bei weniger fps. Teuer sind Figuren-Mixer und Kamera-Raycasts. Auf Georgs Mac im Swap greift dann `MAX_SUB` und das Spiel läuft in Zeitlupe statt zu tunneln. Gegenmittel: Tick-Kosten messen, Budget ≤ 2 ms je Tick; sonst 60 Hz. Vorher die Pro-Bild-Allokationen aus Audit §3 entfernen.
5. **„Gleiche Bilder“ gilt nur auf gleicher Maschine.** Gleiche Hashes sind über Maschinen erreichbar, wenn die Chrome-Version gleich ist (V8 rechnet Math-Funktionen mit eigener Bibliothek). Gleiche Pixel sind es nicht (GPU, Treiber). Deshalb SSIM-Toleranz für fremde Maschinen.
6. **Geteilter Dev-Server.** Ohne Schnappschuss lädt eine Seite gemischte Stände. Deshalb Runner gegen Build auf eigenem Port.

---

## 5 · Aufwand und Vorarbeit außerhalb des Dev-Servers

| Schritt | Aufwand | Außerhalb von 5192 vorbereitbar |
|---|---|---|
| 1 Sim-Loop, Uhr | S | `loop.ts`, `clock.ts` als reines TS mit Node-Test (Akkumulator, MAX_SUB, Tick-Zähler). |
| 2 Physik-Abgleich | S | Ganz offline: k2b ist dreifrei. Mit einem exportierten Stream (Vorlage `tools/track/export-b7-stream.mjs`) läuft der A/B-Vergleich 1/60 gegen 1/120 in Node. |
| 3 Eingabe, Aufnahme | M | Schema `kfb.replay/1` als JSON-Schema plus Validator; Umrechner Travel-Core-Skript → Ticks. |
| 4 RNG, Zeit | S | `rng.ts` mit Strom-Ableitung und Node-Test; `purity-check.mjs` läuft rein auf Dateien. |
| 5 Replay-API, Runner | M | `run.mjs` mit Build-Schnappschuss und eigenem Port; Hash-Funktion mit Node-Test. |
| 6 Interpolation | M | Nur im Lab sinnvoll; hinter Flag. |
| 7 Tests | M–L | SSIM- und Pixel-Diff-Funktion mit Node-Test auf PNG-Paaren; Segment-Probe gegen eine synthetische Höhenfunktion; Fixture-Geometrie. |
| 8 Umschalten | S | – |

Summe grob: 4 × S, 3 × M, 1 × M–L, also etwa 6–9 Arbeitstage. Größter Einzelposten ist Schritt 7, weil sechs Testskripte umziehen.

Schritt 2 kommt vor 3–8. Verlangt der Abgleich 60 Hz, ändert sich nur `SIM_HZ`.
