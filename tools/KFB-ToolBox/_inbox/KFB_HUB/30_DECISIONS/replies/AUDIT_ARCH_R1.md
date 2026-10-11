# Audit R1 · Architektur und Code-Review · KFB Island Worldbuilder Lab

Stand: 11.10.2026 abends · externer Review (nur gelesen) · three r186, Vite 8, TypeScript 7

## 0 · Rahmen

- **Nur gelesen.** Nichts gebaut, kein Dev-Server, kein Test gestartet, keine Datei außer diesem Bericht geändert. Eine andere Sitzung arbeitet gleichzeitig am Code. Zeilennummern gelten für den Stand von heute 21–22 Uhr.
- **Zahlen** stammen aus vorhandenen Lieferungen (`docs/critic/lab-track/…`). Was ich nicht gemessen habe, ist als Vermutung markiert.
- **Gelesen:** `CLAUDE.md`, Plan R1, `PROJECT_STATE.md` (oben), `PHASE_C_DONORS_R1.md`, `START_HERE_STEERING.md`, `DECISIONS.md` (V-042, V-060, V-071, V-115, V-132, V-166, V-168), dazu `src/` (main, play, world, sky, audio, hud, clay), `tools/parity`, `tools/track` (Auswahl), `package.json`, `vite.config.ts`, `tsconfig.json` und `.gitignore`. Vom privaten Track Core nur den Importpfad.
- **Schweregrad:** hoch / mittel / niedrig. **Aufwand:** S (≤ ½ Tag), M (1–3 Tage), L (> 3 Tage).

## Kurzfazit

1. **Die Ladezeit kommt fast ganz aus Rechenarbeit, die bei jedem Seitenaufruf gleich ausgeht.** Dazu gehören das Meshing der Organe per levelSet, die Tunnel-Booleans und Lab-Inseln, die gebaut und dann versteckt werden. Ein Ergebnis-Cache ist der billigste und sicherste Hebel.
2. **Das sichtbare „Flackern im Stand“ ist in den vorhandenen Messdaten nur als Sprung der dynamischen Auflösung nachweisbar.** In `frames_default.json` ändern sich in einem Bild 0,95 % der Pixel bei Mittelwert 0,742, mit `dynres=0` höchstens 0,08 %. Weitere wahrscheinliche Quellen bei bewegter Kamera: harte LOD- und Tier-Wechsel ohne Überblendung, Z-Fighting durch near 0,5 bei far 9000, und LOD-Schwellen der Knete über `fwidth`.
3. **Die zerrissenen Banden sind ein Bauprinzip-Problem, kein Einzelfehler.** Die Bande ist eine offene, gesweepte Fläche ohne geschlossenen Querschnitt. Wird das Profil verformt, grob abgetastet oder flach zugedeckelt, liegt die Kante offen. Es fehlt ein einheitlicher Endstück-Baustein nach V-168 und ein automatischer Offene-Kanten-Test.
4. **Veröffentlichungsrisiko:** `dist/` (76 MB) ist nicht in `.gitignore` und enthält **33 MB StreakByte-Assets** (gekauft, V-071) sowie Autos ohne Lizenzdatei.
5. **Wer keinen privaten Track Core hat, kann das Lab gar nicht starten.** Der statische Import bricht den ganzen Modulgraphen ab, nicht nur die Organ-Welt.
6. **Tests:** Parity und Fußtests hängen an Wanduhr und Bildrate. Einige Prüfungen werden unter Last stillschweigend schwächer (Check 4). Die neue Standardwelt `organ` ist nicht im Standardlauf. Positiv: `drive-test.ts` rechnet mit festem dt.
7. **Der Lab-Ordner ist kein Git-Repository.** Mehrere Sitzungen ändern gleichzeitig Dateien, und es gibt keine Diffs und kein Rollback außer dem Dropbox-Verlauf.

---

## 1 · Architektur

### 1.1 Single-Owner-Regeln (V-042, V-132, Plan §2)

| Regel | Befund | Beleg | Urteil |
|---|---|---|---|
| Ein Licht-Rig | Gehalten. Organ-Welt und Sky erzeugen keine eigenen Lichter. Day-night schreibt über Proxy-Objekte in das eine Rig. | `world/light.ts:64–74, 140–153`; LAB PATCH 3/5 in `organ-world.lab.js` | ok |
| Ein Nebel- und Hintergrund-Schreiber (day-night) | Meist gehalten. Aber `light.ts:96–97` und `main.ts:84, 707` schreiben `scene.fog` bzw. `scene.background` ebenfalls, wenn der Sky nicht aktiv ist. `skyOwned` regelt das zur Laufzeit; der Silhouette-Debugpfad überschreibt beide. | `light.ts:84`, `main.ts:707` | ok mit Vorbehalt |
| Ein AudioContext | Gehalten durch LAB PATCH C1 (Kontakt-Engine) und den Song-Transport-Patch. Beide Vendor-Dateien behalten aber einen Fallback, der einen **zweiten** Kontext anlegt, wenn der Host keinen übergibt. | `audio/audio-owner.ts:112`, `audio/vendor/contact-audio-engine.mjs:70`, `song-transport.js:89` | ok, Fallback still entfernen oder warnen |
| Ein Renderer | Im Spiel gibt es einen zweiten WebGL-Kontext für die Rucksack-Miniaturen. Er wird lazy angelegt (`hud/game-hud.ts:31`, `kfb-backpack.js:68`). Das ist vertretbar, aber nicht dokumentiert. Andere Renderer gibt es nur in Bench- und Probe-Seiten. | wie genannt | niedrig |

**Fazit:** Die Owner-Regeln sind im Code sichtbar und meist eingehalten. Die eigentlichen Architekturprobleme liegen woanders (1.2–1.4).

### 1.2 `main.ts`: Größe, Kopplung, globaler Zustand · **hoch · M–L**

- 809 Zeilen, 64 KB. `boot()` ist eine einzige Closure von rund 520 Zeilen (`main.ts:280–804`). Darin steckt alles: Moduswahl (`ORGAN`, `TRAVEL`, `STAGE`, `RKIT`, `drive`, `play`), Spawn-Suche, Felsen-Platzierung (`354–377`), Maus- und Tastatur-Schema, HUD, Audio, Sky und Almanach. Die Spielschleife (`510–568`) verzweigt nach Modus und ruft Organ, Sky, Licht, Audio, Race-FX und HUD in fester, impliziter Reihenfolge auf.
- `window.__kfb` hat rund 70 Einträge (`570–803`). Tests und Probes greifen tief in interne Objekte, z. B. `travel().walk.walker.reset`. Jede Umbenennung bricht unsichtbar Skripte in `tools/`.
- Globale Seiteneffekte: `console.warn` wird global überschrieben (`65–66`). `NATURE.mode` und `TERRAIN.mode` sind veränderliche Modul-Singletons (`61`, `784`). Query-Parameter werden in 19 Dateien jeweils selbst geparst.
- **Der Organ-Modus baut die ganze Lab-Welt mit.** `await app.load(app.world)` läuft immer (`284`), auch bei `?hub=1&play=game`. Danach werden die Inseln versteckt (`328`). `isl.update(dt)` läuft aber weiter für jede versteckte Insel, mit Residents und Mixer (`514`; `island/island.ts:398–402`). Wolken werden gebaut und versteckt (`283`, `329`).
- **Empfehlung:** eine Host-Schnittstelle je Welt (`OrganHost`, `StageHost`, `RkitHost`) mit `build()`, `update(dt)` und `dispose()`, und eine Spielschleife mit geordneter System-Liste (input → sim → camera → world → light/sky → render → probes). `__kfb` sollte ein schmales, versioniertes Probe-API sein (`probe.v1`), keine Objektreferenzen. Der Umbau kann schrittweise geschehen; erster Schritt: Lab-Inseln im Organ-Modus nicht bauen (S).

### 1.3 `organ-world.ts` als Host · **mittel · M**

- 434 Zeilen, aber 64 KB; 22 Zeilen sind länger als 300 Zeichen. Inhaltlich sind das vier Module in einer Datei: der levelSet-Mesher (`38–143`, mit mehreren Topologie-Reparaturen: Clear, Pinch, Amb, Gap, Foam), die J17-Strecke mit LOD (`170–200`), die C4c-Zweige (`201–212`) und die komplette Geometrie der B7-Bucht mit Hang, Klecksen, Rampen, losen Steinen und Hex-Nahtwülsten (`245–334`). Dazu kommen der Treppen-Fußtest (`335–356`) und Debug-Funktionen, die große Felder behalten (`395–430`).
- Die Bucht-Geometrie ist reine Inselgestaltung. Nach V-002 und V-155 gehört sie später in den Insel-Editor bzw. in Bausteine. Heute ist sie mit Track-Samples und hartkodierten Maßen verdrahtet: `16.5`, `4.4`, `0.3 + 6.4`, `19.2 / RACE_W`, `1.46` doppelt in Tests.
- **Empfehlung:** aufteilen in `organ-mesher.ts` (reine Funktion, worker-fähig), `j17-track-host.ts`, `c4-branches.ts`, `bay-b7.ts` und `debug-organ.ts`. Das ist Voraussetzung für Phase E, weil der Strecken-Editor die Strecke ohne Organ-Neubau neu bauen muss.

### 1.4 LAB PATCHes gegenüber den vendorten Donoren · **mittel · S–M**

| Datei | Marker | Dokumentation |
|---|---|---|
| `world/organ/vendor/lab-organ/organ-world.lab.js` | 28 (Patches 1–16, 9b/9c/9d) | Kopfkommentar plus `organ-world.lab.diff`. **Die Diff ist veraltet:** PATCH 16 (C4c) fehlt, 241 statt 270 geänderte Zeilen (Stand `.diff` 19:14, `.js` 21:25). Der Kopf verweist auf `docs/critic/lab-track/<run>/organ-world.diff`; die Datei liegt aber im Vendor-Ordner. |
| `world/organ/vendor/j17/lab-track/j17-track.lab.js` | 19 (A–I, G2) | Nur Kopfkommentar, keine Diff, keine md5 der Quellen |
| `audio/vendor/song-transport.js`, `contact-audio-engine.mjs` | 9 + 6 | Inline |
| `play/vendor/travel-core.j17.js` | 5 | Inline |
| `sky/vendor/travel/globe-v13/day-night.js` | 3 (N1) | Inline |
| `env-host.v3.js`, `skydome-shader.js`, `fluid.js`, `cabrio-seat.j17.js` | je 1 | `play/vendor/VENDOR.md` mit md5-Tabelle für Quelle und Lab (gut) und `sky/vendor/VENDOR.md` |

- **Versteckte Laufzeit-Patches:** `sky/sky.ts:33–37` ersetzt `host.aurora.update` zur Laufzeit. `light.ts` übersetzt day-night über Proxy-Setter. Die Vendor-Dateien gelten als „unverändert“, ihr Verhalten aber nicht. Das sollte in VENDOR.md stehen.
- **Doppelte Kopien:** `clay-material.v10.js` und `clay-relief.v2.js` liegen md5-gleich in `sky/vendor/lab-clay/` und in `world/organ/vendor/lab-clay/`. Dazu kommen die TS-Portierung `src/clay/clay-material.ts` (575 Z.) und die Variante `v10nb`. `tunnel-clay.tc1.js:10` importiert `clay-material.v10.js?r=2`; der Query-String erzeugt eine **zweite Modulinstanz**. Ungenutzte Versionen: `sky-gates.v1/.v2.js` haben keine Referenz, `env-host.v1/.v2`, `cloud-family.v1/.v2` und `organ-islands.v4/.v7.js` dienen nur als Re-Export bzw. Vorlage.
- **Empfehlung:** ein Skript `tools/vendor/check.mjs` erzeugt die Diff jedes LAB-Forks gegen den Donor neu, prüft die md5 der unveränderten Dateien und läuft vor jeder Lieferung zusammen mit Parity. Dann kann die Diff nicht mehr veralten.

### 1.5 Fehlende Versionskontrolle · **hoch · S**

`git rev-parse` meldet im Lab-Ordner kein Repository. Bei mehreren parallelen Sitzungen (Sperrliste V-141) heißt das: kein Diff je Lieferung, kein Rollback, keine Bisect-Möglichkeit, wenn ein PASS-Stand verloren geht.

**Empfehlung:** Ein lokales Git-Repository ohne Remote, das die Sitzungen selbst pflegen, mit einem Commit pro Lieferung. Georg muss dafür nichts tun. `.gitignore` gibt es schon.

---

## 2 · Live-Probleme von heute

### 2a · Ladezeit 40–60 s bei `?hub=1&play=game` · **hoch**

**Belege:**
- `createOrganWorld.info.buildMs` = 30,6–35,8 s je Tunnel-Stil (`docs/critic/lab-track/2026-10-11_C1b-C3-r2/qcheck*.json`). Mit Feldtunnel-Prototyp 53,6 s (`2026-10-11_tunnel-field-proto/qcheck.json`).
- Die TC1-Tunnel-Booleans brauchen zusammen etwa **15,3 s**: Hirn 3,2 + 1,4, Herz 2,1 + 1,0, Darm 4,0 + 1,5, Niere 1,4 + 0,8 (`qcheck_tunnels_stone_arch.json`, `joins[].totalMs`).
- Der Rest von `buildMs` (≈ 15–20 s) ist O1-Feldaufbau plus levelSet-Mesher je Organ und Tier.
- **Nicht in `buildMs` enthalten:** `initClay()`, der Bau aller Lab-Inseln (`main.ts:284`), die Wolken, Auto und Figur. Mit vollem Swap auf Georgs Rechner sind 40–60 s plausibel.

**Ursachen im Code (nach Gewicht):**
1. **levelSet mit JS-Callback je Gitterpunkt** (`organ-world.ts:115`). manifold-3d ruft für jeden Gitterpunkt `sampField` in JS auf: Millionen JS↔WASM-Übergänge je Organ und Tier. Davor laufen mehrere Vollgitter-Durchläufe (Surface Nets als Referenz `43`, Union-Find, Masken mit `Map<string,…>`-Hash `58–72`, Amb-Fix mit Würfel-Zerlegung `85–92`, Gap-Fix `96–100`). Danach `simplify` und `refineToLength` (`124`) und eine Newton-Projektion mit Gradient je Vertex (`127–130`).
2. **Hero- und Light-Tier werden beide sofort gebaut und beide mit Tunneln verschnitten** (`222–228`), obwohl Hero nur unter 900 lab gebraucht wird.
3. **Alles läuft seriell im Hauptthread.** Es gibt genau einen Yield (`219`). Die Seite reagiert in der Zeit nicht.
4. **Lab-Inseln, Wolken und Residents werden umsonst gebaut** (`main.ts:283–284`).
5. **Die Fingerabdruck-Textur wird zweimal auf der CPU berechnet**: 2048² (Organ, `organ-world.lab.js:377`) und 1024² (`clay/index.ts:67`). Je Lauf sind das etwa 48 MB Float-Zwischenspeicher (`clay-material.v10nb.js:543–568`).

**Billigste robuste Lösung (Reihenfolge):**
1. **Ergebnis-Cache (S–M, größter Hebel).** Alle Eingaben sind deterministisch: Bake-Dateien, Rezept-Fingerprint (LAB PATCH 15 legt ihn schon in `trackInfo`), Core-Version, `ls*`-Parameter, Tunnelstil, `tc1`, `c4c`. Schlüssel = Hash daraus plus eine manuelle Code-Version. Gespeichert werden die fertigen Körper je Organ und Tier **nach** dem Boolean: Position, Normale, Farbe, Index, Gruppen, Lampenpositionen. Ablage in IndexedDB, oder als Bake-Dateien in `public/assets/organ-o1/cache/`, das schon gitignored ist. Geschätzt 30–40 MB und Ladezeit dieses Teils unter 2 s. Ein Cache-Miss baut wie heute und schreibt den Cache.
2. **Lab-Inseln im Organ-Modus nicht bauen (S).** `app.load` erst beim Wechsel in den God-Mode oder gar nicht. Das spart auch die `update`-Kosten je Bild (siehe 3).
3. **Hero-Tier lazy (S),** falls der Cache noch nicht steht: erst bauen, wenn die Kamera unter `heroIn + 300` kommt, mit Platzhalter Light.
4. **Worker (M):** Mesher und Booleans brauchen nur TypedArrays und manifold-3d. Beides läuft im Worker. Vier Organe parallel auf einem Pool bringen etwa das 3–4-Fache ohne Cache. Erst nach dem Cache sinnvoll, weil der Cache den Normalfall abdeckt.
5. Fingerabdruck-Textur einmal offline in eine PNG mit Gradient und Maske umrechnen und direkt laden (S).

### 2b · Flackern, auch im Stand · **hoch**

**Belege aus `docs/critic/lab-track/2026-10-11_flicker/`:**
- `frames_default.json`: ein Sprung der Canvas-Größe 1600×1000 → 1280×800 bei t ≈ 735 ms, 0,95 % geänderte Pixel, Mittelwert 0,742. Sonst höchstens 0,07 %.
- `frames_dynres=0.json`: kein Sprung, höchstens 0,08 %.
- Die übrige Schwankung von etwa 0,05 % mit rund 1 s Periode passt zur Idle-Animation der Figur und ist kein Flackern.
- Der Probe lief headless auf einer schnellen Maschine. Auf Georgs Mac mit DPR 2 und Swap treten die Auflösungssprünge öfter auf.

**Ursachen (nach Wahrscheinlichkeit):**
1. **Dynamische Auflösung** (`main.ts:493–504`). Jede Stufe ruft `setPixelRatio` und `setSize` auf (`496`). Damit wird der Drawingbuffer neu angelegt und das ganze Bild ändert seine Schärfe. Zusätzlich verschiebt sich jede `fwidth`-Schwelle der Knete: Nahband, Fingerabdrücke und Werkzeugrelief hängen an der Pixelgröße (`clay-material.v10nb.js:364, 375`). Ein Sprung ändert also auch, welche Details überhaupt sichtbar sind. Auslöser im Stand sind GC- und Swap-Spitzen: Ein 0,5-s-Fenster mit über 50 % Bildern über 20 ms reicht (`502`). Der Anti-Pendel-Fix (60 s Sperre, sechs ruhige Fenster) senkt nur die Häufigkeit.
2. **Harte Tier-Wechsel Hero ↔ Light** (`organ-world.ts:388`): `visible` springt um, ohne die in V-115 verlangte 1-s-Dither-Überblendung. Die Hysterese 900/1000 verhindert Pendeln im Stand, aber jeder Wechsel bleibt ein Sprung. Laut V-115 ist Light eine andere Form.
3. **`THREE.LOD` der Strecke ohne Hysterese** (`organ-world.ts:181–187`, Stufen 250 und 900 lab). Dazu kommt Aliasing: Die Bandenrippe `rib = cos(2π·s/3,5)` (`j17-track.lab.js:117`) wird bei Stride 8 (4 m) unter der Nyquist-Grenze abgetastet. Die mittlere LOD-Stufe hat in Innenkurven also eine **andere Form** und springt sichtbar. Mit nachfedernder Kamera kann das auch „im Stand“ pendeln.
4. **Tiefenpuffer:** `near 0.5`, `far 9000` im Organ-Modus (`main.ts:86, 323`). Bei 24 Bit beträgt die Tiefenauflösung ungefähr z²/(near·2²⁴). Bei 200 lab sind das ≈ 0,005 lab, bei 300 lab ≈ 0,011 lab. Die Gore-Fläche liegt nur 0,006 m × 1,46 ≈ 0,009 lab über der Fahrbahn (`c4c-furniture.ts:33`), die Hex-Nahtwülste 0,02–0,04 lab über den Kacheln. Ab etwa 270 lab sind diese Flächen Z-Fighting-Kandidaten. Nirgends wird `polygonOffset` genutzt, außer in Wasser und Hatch. (Plausibel, nicht gemessen.)
5. **Periodische Hänger, die als Ruckeln oder Flackern gelesen werden:**
   - `applyShadowContract(scene)` durchläuft jede Sekunde die ganze Szene (`main.ts:513`).
   - day-night malt den 512²-Hintergrund 4× pro Sekunde neu und erzeugt dabei jedes Mal eine neue Textur (`day-night.js:78, 303–311`), auch wenn die Travel-Kuppel den Hintergrund verdeckt.
   - Die Horizont-Probe löst `repaint()` aus, sobald die Nebelfarbe wechselt (`sky.ts:109–113`). Bei Tageszeit AUTO springt die Nebelfarbe damit alle 0,5 s in kleinen Stufen.
6. **Alpha-Hash beim POV-Zoom** (`main.ts:530`): bei Nähe ein Rauschmuster. Gewollt, aber ohne TAA bei jeder Bewegung unruhig.

Die Schatten halte ich für keine wahrscheinliche Ursache. `keyTo` rastet das Zentrum auf das Texel-Raster (`light.ts:118–121`). Im Stand ändert sich die Box nicht, weil sie an `root.position` hängt.

**Billigste robuste Lösung:**
1. **dynres im Spiel standardmäßig aus** (`?dynres=1` nur für Tests). Alternativ höchstens **ein** Abwärtsschritt pro Sitzung und nie ein Aufwärtsschritt im Stand. Besser: in ein Render-Target mit fester Canvas-Größe rendern und nur die interne Auflösung skalieren; dann bleibt `fwidth` stabil, wenn man `uClayLodK` mit dem Faktor gegenrechnet. (S)
2. **`lod.hysteresis = 0.1`** für alle Strecken-Chunks (ein Wert, S). Die Rippe für Stride ≥ 4 ausblenden (`rib` · `stride ≤ 3`), damit LOD-Stufen dieselbe Form haben (S).
3. **Dither-Überblendung für Tier und LOD nach V-115** (M): ein gemeinsamer Fade-Uniform in der Knete (Bayer-Dither über `gl_FragCoord`), 1 s, beide Stufen kurz gleichzeitig sichtbar.
4. **Tiefe:** near im Spiel auf 1,0 (verdoppelt die Präzision) und `polygonOffset` (factor −1, units −4) für alle Auflagen (Gore, Markierungen, Nahtwülste, Hang) (S). Als größerer Schritt reversed-Z; three r17x+ bietet das als Renderer-Option, den genauen Namen in r186 prüfen (M).
5. `applyShadowContract` nur nach Lade- und Rebuild-Ereignissen aufrufen; day-night-Hintergrund nicht malen, solange die Kuppel deckt (S).
6. **Flicker-Probe als Gate:** `tools/track/flicker-probe.mjs` gibt es schon. Ihn mit DPR 2, unter künstlicher CPU-Last (`CDP Emulation.setCPUThrottlingRate`) und mit Kamera-Mikrobewegung laufen lassen; PASS bei höchstens 0,5 % geänderten Pixeln je Bildpaar.

### 2c · Zerrissene bzw. offene Banden an der Hub-Ausfahrt (C4c, WIP) · **hoch**

`docs/critic/lab-track/2026-10-11_georg-live/georg_banden_FAIL.webp` zeigt freie orange Flächen mit offenen Kanten über der Gore- bzw. Platzfläche.

**Ursachen im Code:**
1. **Die Bande ist eine offene Fläche.** `sideProfile` (`j17-track.lab.js:108–141`) ist ein offener Polygonzug: Fahrbahnrand → Wulst → Unterseite bis zur Mitte. Beide Seiten werden zu einem Ring zusammengesetzt (`143–144`) und gesweept. Eine Rückseite gibt es nicht. Sobald das Profil verformt wird, sieht man in die Fläche hinein.
2. **Offene Seite = Profil fällt auf einen Punkt** (LAB PATCH I, `123–128`). Die Punkte 1–24 schrumpfen gegen `A = [e+0.06, −0.7]`, die Punkte 0 und ≥ 25 bleiben stehen. Das erzeugt degenerierte und langgezogene Dreiecke. `computeVertexNormals` mittelt dann über Splitter; das ergibt helle und dunkle Ränder und dünne „Segel“.
3. **C4c-Zweige ohne Lippen, mit flachen Fächer-Deckeln.** Die Zweige werden mit Stride 1 und `capStart`/`capEnd = true` gebaut (`organ-world.ts:206`). Der Deckel ist ein Fächer vom Ring-Schwerpunkt (`j17-track.lab.js:166–171`). Der Querschnitt ist stark **konkav** (U-Form aus Fahrbahn und zwei Wülsten), deshalb ragen Fächerdreiecke aus der Form heraus oder überlappen. Die Lippen-Kapseln, die im Ring diese Enden verdecken (`buildJ17Lips`, `182–189`), werden für die Zweige nicht gebaut (`organ-world.ts:191` nur für den Ring).
4. **Kein geometrischer Anschluss Ring ↔ Zweig.** Der Ring öffnet seine Bande über `openSpans` mit einer Kopflänge von 13,15 m (`organ-world.ts:161–169`). Der Zweig beginnt mit eigener Bande und eigenem Deckel. Dazwischen liegen nur Nase und Gore aus `c4c-furniture.ts`. Ob Ring-Kopf und Zweig-Anfang zusammenpassen, prüft niemand.
5. **LOD unterschlägt die Köpfe.** Ein 13-m-Kopf hat 26 Samples. Bei Stride 8 bleiben 3 Ringe, bei Stride 24 keiner. Aus der Ferne wird der Kopf deshalb zu einem langen Splitter (`ORGAN_LOD`, `organ-world.ts:31`).
6. **Uneinheitliche Schatten:** Ring-Chunks werfen nie Schatten (`castShadow = stride <= 2` bei Strides 3/8/24, `organ-world.ts:185`), Zweige und Nasen schon (`207`, `c4c-furniture.ts:28`). Gerade an der Ausfahrt sieht man das.

**Billigste robuste Lösung:**
1. **Ein Endstück-Baustein für alle Bandenenden (V-168):** Run-Ende, Tunnel- oder Luftspalt, `edge_end` (EXIT `_div`, ENTRY `_conv`), Zweig-Anfang und -Ende. Statt das Sweep-Profil zu verformen, endet der Sweep, und ein geschlossener Knet-Kopf sitzt darauf: Kugel- bzw. Torus-Viertel mit dem Wulst-Querschnitt, eingetaucht unter die Fahrbahnkante. Für Ring und Zweige gleich, auch die Lippen-Kapsel kommt aus diesem Baustein (M).
2. **Sofort-Stopp (S):** Für Zweige `buildJ17Lips(preB)` aufrufen und den Fächer-Deckel nur bei konvexem Querschnitt erlauben. LAB PATCH I nicht auf einen Punkt kollabieren lassen, sondern den Sweep am Span-Anfang abbrechen.
3. **Automatischer Test (S–M):** `mesh-check.ts` gibt es schon. Für alle Strecken-Meshes in 300 m um den Hub zählen: offene Kanten außer der Fahrbahnnaht, degenerierte Dreiecke (Fläche < 1e-6), Dreiecke mit Seitenverhältnis > 50. Mit Schwellen in Parity aufnehmen. So wird „zerrissen“ messbar, bevor Georg es sieht.
4. LOD-Stride in Chunks mit Köpfen bzw. offenen Spans auf höchstens 3 begrenzen (S).

---

## 3 · Performance

| Thema | Befund | Beleg | Schwere | Fix | Aufwand |
|---|---|---|---|---|---|
| Knete-Shader | Sehr teuer je Pixel: 27-Zellen-3D-Voronoi (`clay-material.v10nb.js:178`), 8er-Schleife (`343`), 6 Werkzeugreliefs × 3 `textureGrad` (`401`), FBM, viele Ableitungen. Das Nahband spart nur dort, wo die Gewichte 0 sind. Die Organkörper laufen schon als Platzhalter mit `MeshStandardMaterial` (`organ-world.ts:231`). | wie genannt | hoch | Reihenfolge laut V-115 einhalten. Zusätzlich: Voronoi und FBM in eine 3D- bzw. Triplanar-Textur vorbacken (Bake einmal, Lookup je Pixel); Fingerabdruck nur `lodNear`. Gleichstand Δ ≤ 1/255 messen. | M–L |
| Punktlichter | In der Organ-Welt sind 6 PointLights immer im Shader: `local` mit Intensität 0, aber sichtbar (`light.ts:71`), Lichtkreis und 4 Tunnel-Pool-Lichter. Bei Forward-Rendering zahlt jedes Knete-Fragment die Schleife. Der Tunnel-Pool wird erst nach der Materialkompilierung angelegt (`light.ts:193`); das erzwingt eine einmalige Neukompilierung aller Programme. | `light.ts:71, 182, 193` | mittel | `local.visible = false`, solange `state.local = 0` (einmal beim Start setzen, nie umschalten). Tunnel-Pool vor dem ersten Render anlegen. | S |
| Schatten | 2048er-Map auf 550 × 550 lab ≈ 0,27 lab je Texel. `blurSamples = 12` wirkt nur bei VSM, hier wirkungslos (`light.ts:69`). Die Schatten werden jedes Bild neu gerendert, auch im Stand. Figuren in O1 haben `frustumCulled = false` (`organ-world.lab.js:577`). | wie genannt | niedrig–mittel | `blurSamples` entfernen. `frustumCulled` für Figuren wieder an (Bounding Sphere einmal aus dem Skelett berechnen). Später: statische Welt in einen eigenen Schatten-Cache. | S |
| Draw Calls | Ring ≈ 88 Chunks × 2 Meshes (LOD), Markierungs-Zellen je 200 m, C4c-Teile, Hex-Kacheln (KayKit, einzelne Meshes), Organe je 2 Tiers. Nicht gemessen. `__kfb.stats()` und `passes()` gibt es dafür. | `organ-world.ts:177–200` | mittel | Messen (Haupt- und Schatten-Pass getrennt). Hex-Kacheln und statische Kleinteile zusammenführen bzw. `BatchedMesh`. | S messen, M fix |
| Pro-Bild-Allokationen | `new Vector3` in `main.ts:543`. `light.ts:170` und `195–196` sortieren und mappen die Lampen- und Tunnelpunkte **jedes Bild** und parsen `L.color.set(string)`. `tunnelWeight` (≈ 1 200 Punkte) wird zweimal pro Bild brute force gerechnet (`main.ts:542, 560`). `surface.at()` erzeugt pro Aufruf ein Objekt (`play/surface.ts:40`), mehrfach pro Bild. Race-FX klont Vektoren pro Emit. | wie genannt | mittel (GC bei vollem Swap) | Vorab-Puffer; Top-k ohne Sortierung; Farben als `Color` vorab; `tunnelWeight` einmal pro Bild cachen; `at(x, z, out)`. | S |
| Versteckte Welt | Lab-Inseln mit Residents werden im Organ-Modus jedes Bild aktualisiert (`main.ts:514`) und von `scene.updateMatrixWorld` mit durchlaufen (three überspringt unsichtbare Knoten dabei nicht). | `main.ts:284, 514` | mittel | nicht bauen (siehe 2a) | S |
| Speicher (manifold-3d) | **Kein einziges `.delete()`** auf manifold-Objekten (`organ-world.ts`, `tunnel/*.ts`). Der WASM-Heap wächst und schrumpft nie. `heroCache` hält feine Hero-Manifolds plus Feldkopien (`Float32Array.from(G.V)`) für die ganze Sitzung (`organ-world.ts:57, 122`). Die Debug-Funktionen `shapeCheck` und `testLevelSet` halten die Felder `TT.GT` am Leben. | wie genannt | hoch (Swap) | Nach dem Bau `delete()` auf alle Zwischenobjekte, `heroCache.clear()`, Felder nur mit `?debug=1` behalten. | S |
| Lauf-Oberfläche | `buildSurfaceField` speichert alle Vertices als `number[]` (64 bit, `play/surface.ts:10–17`). „Höchste Fläche gewinnt“ (`37`) passt nicht zu Über- und Unterführungen in Phase D/E. | wie genannt | mittel | `Float32Array`; Höhenabfrage mit Referenzhöhe (nächste Fläche unter Fußhöhe + Stufe) oder BVH (`three-mesh-bvh`). | M |
| Zeitschritt | Variables dt, auf 50 ms begrenzt (`main.ts:511`). Unter 20 fps läuft die Simulation langsamer als Echtzeit. | `main.ts:511` | mittel | Fester Schritt mit Akkumulator (1/60) für travel/k2b, Render interpoliert. | M |

---

## 4 · Test-Zuverlässigkeit

| Test | Abhängigkeit | Schwere | Deterministisch machen |
|---|---|---|---|
| `tools/parity/parity.mjs` Check 2 (Sprint) | Kriterium über **Wanduhr**: `v2 = Weg / wallB` (`47–48`). Die Sim-Zeit wird nur als Info geführt. | hoch | wie Check 1, 5, 8 auf `simWait` umstellen (V-107) |
| Check 3 (Sprünge) | Leertaste 40 ms, Abfrage nach 160 ms Wanduhr (`50, 55, 58`). Bei 12 fps sind das zwei Bilder. Der Clip-Zustand hängt vom Timing ab. | hoch | Taste über `onFrame` für n Sim-Bilder halten; Clip-Wechsel als Ereignis protokollieren statt abtasten |
| Check 4 (Kamera ruhig) | Unter 30 fps setzt `measurable = false` das Jitter-Kriterium **still aus** (`74–75`). Der Test besteht dann mit weniger Prüfung. | hoch | Bei `measurable = false` FAIL oder „nicht prüfbar“ ausgeben, nie PASS; besser fester Schritt (siehe unten) |
| Check 6 (Zoom) | 3 s Einschwingen per Wanduhr (`89`), vorher schon einmal von 1,8 s erhöht | mittel | auf Sim-Zeit warten bzw. bis Konvergenz |
| Check 7 | Mausbewegung mit 16-ms-Schritten über Playwright | mittel | Pointer-Events im Seitenkontext pro Bild (wie Check 4) |
| Check 10 (Cozy offline) | braucht die private lokale Audiokopie (`110–115`) | niedrig | als „lokal-only“ markieren |
| Einträge | Standard `game,hub` (`16`). Die neue Standardwelt **`organ`** läuft nur auf Wunsch. | hoch | `organ` in den Standard aufnehmen |
| Fehlerpfad | Wirft `boot()`, wird `window.__kfb` nie gesetzt (`main.ts:570`, erst am Ende). Die Tests warten dann bis zum Timeout: 180 s (Parity) bzw. 600 s (Fußtest). | mittel | `__kfb = { ready: false, bootError }` sofort setzen; Tests brechen bei `bootError` ab |
| Fußtests (`c4a-foot-test.mjs`, `drive-test.mjs` Fußteil, `trail-foot-test.mjs`) | Lenkung im geschlossenen Regelkreis über Playwright-Tasten mit 50-ms-Abfrage (`c4a-foot-test.mjs:12–17`). Ergebnis hängt von Bildrate und IPC-Latenz ab. V-159 verlangt ≥ 50 fps. | hoch | Autopilot **in der Seite** laufen lassen (wie `drive-test.ts`), Tasten pro Sim-Schritt setzen, fester Schritt |
| `src/play/drive-test.ts` | **fester dt = 1/60** (`17`), eigener Loop | gut | Vorbild für die übrigen Tests |
| Umgebung | 125 Skripte mit hartkodiertem Pfad `/Applications/Google Chrome 2.app`. Alle Tests laufen gegen den **laufenden Dev-Server**, an dem andere Sitzungen gleichzeitig Dateien ändern. Eine Seite kann so gemischte Stände laden. | hoch | Chrome-Pfad per `KFB_CHROME`; vor dem Lauf einen Schnappschuss bauen (`vite build` in ein Temp-Verzeichnis, `vite preview` auf eigenem Port) |
| Abdeckung | Parity prüft Gangart, Kamera, HUD und Audio. **Kein Skript liest `docs/baseline.accepted.json`.** Die in V-060 genannte Prüfung „parity: scale“ gibt es in `parity.mjs` nicht. Bilder, Banden, Ladezeit und Flackern werden nicht geprüft. | hoch | Checks ergänzen: Maßstab (H = 3,64 aus `__kfb.sizes()`), offene Kanten (2c), Ladebudget (z. B. ≤ 15 s mit Cache), Flicker-Gate (2b) |

**Kern-Empfehlung (M):** Einen Testmodus `?fixedDt=1` einführen. Die Spielschleife rendert dann nicht per `requestAnimationFrame`, sondern per `__kfb.step(n)` mit genau n Sim-Schritten zu 1/60 s. Eingaben werden als Schritt-Skript übergeben. Damit werden Parity, Fußtests und Kamera-Jitter bildratenunabhängig und reproduzierbar, auch headless bei 12 fps.

---

## 5 · Robustheit und Wartbarkeit

| Thema | Befund | Schwere | Fix | Aufwand |
|---|---|---|---|---|
| Private bzw. ignorierte Vendors brechen alles | `track-core-alias.js:6` importiert `vendor/private/track-core-0.16.9` **statisch**, auch bei `?core=012`. `src/world/organ/vendor/` ist komplett gitignored. `main.ts:37` importiert die Organ-Welt statisch. Ohne diese Ordner löst Vite den Modulgraphen nicht auf, und **jede** Lab-Seite (RKIT-Hub, Stage, Editor) startet nicht. `npm run build` scheitert ebenso. | hoch | `createOrganWorld` per `import()` nur bei `ORGAN`; Track Core über einen Vite-Alias mit Stub, der eine klare Meldung „privater Track Core fehlt“ wirft; ein Smoke-Test „öffentlicher Klon“ (Ordner ohne Ignoriertes kopieren, bauen) | S–M |
| Weitere lokal-only Abhängigkeiten | `public/assets/streakbyte` (Stage `?play=game`, PondLand), `public/private-audio` (Parity 10), `public/vendor/joyride-j17` (C0-Tools), Chrome-Pfad, Port 5192 | mittel | Liste in `docs/LOCAL_ONLY.md` mit Fallback-Verhalten je Eintrag | S |
| Fehlerbehandlung | Viele `try/catch` schreiben nur in Info-Objekte und laufen weiter: Tunnel-Join (`organ-world.ts:226–228`), C4c-Möblierung (`211–212`), Bucht (`334`), Sky (`main.ts:468`). Fehlt ein Tunnel, steht das nur in `tunnelReports`; kein Test schaut dort nach. Das Lade-HUD wird ohne `finally` entfernt (`main.ts:317–320`) und bleibt bei einem Fehler stehen. `unhandledrejection` wird nicht erfasst (`63–64`). | mittel | `organ.info.errors` und Tunnel-Fehler in Parity als FAIL; `finally` fürs HUD; `unhandledrejection` loggen | S |
| Feature-Flags | **≈ 124 verschiedene Query-Parameter** in `src/`, in 19 Dateien jeweils selbst gelesen. Allein der Mesher hat 15 `ls*`-Flags (`organ-world.ts:38, 57, 77, 85, 95, 103, 140, 143`). Kein Verzeichnis, keine Typen. Welche Flags WIP sind (V-166), sieht man nur im Kommentar. | mittel | Ein Modul `flags.ts`: Name, Typ, Standard, Status (`stable \| wip \| probe \| deprecated`), Besitzer, V-Nummer. Unbekannte Flags in der Konsole melden. Der Cache-Schlüssel (2a) nimmt nur die geometrie-relevanten Flags. | S–M |
| Typsicherheit | `strict: true`, aber `checkJs: false` bei `allowJs`. Rund 109 × `as any`, 220 × `: any`, 25 × `@ts-ignore`, 8 × `@ts-nocheck`. Der ganze Organ- und Strecken-Datenpfad (Stream, Samples, Slots, Graph) ist `any`. | mittel | `types/track-stream.d.ts` für `kfb.track-core.stream/0.3` (Samples, Slots, Joints, Graph); damit werden Phase E und F sicherer | M |
| Magische Zahlen | `1.46` (RACE_W) in Tests hartkodiert (`c4a-foot-test.mjs:29, 34, 37`); Bucht-Maße (`organ-world.ts:259, 297, 369`); `0.006`, `0.012` als Lift (`c4c-furniture.ts:33, 38`); LOD- und Tier-Distanzen | niedrig–mittel | Konstanten aus `scale.ts` bzw. einer `track-dims.ts` | S |
| Toter Code | `sky-gates.v1/.v2.js` (keine Referenz), `env-host.v1/.v2`, `cloud-family.v1/.v2` (nur Re-Export-Ketten), `organ-islands.v4/.v7.js` (Vorlage, 250 KB), `retired/`, Probe-Seiten `probe*.ts`, `speckle.ts` | niedrig | in `vendor/_donor-ref/` verschieben bzw. als Referenz markieren; nicht im Modulgraph halten | S |
| Doppelte Logik | Drei Knete-Familien gleichzeitig im Spiel (`src/clay` TS-Port, `v10` und `v10nb`) mit getrennten Uniforms, Texturen und Programmen. Zwei Fingerabdruck-Bakes (2a). Spawn-Suche, Tastenzuordnung und Kamera-Setup kommen je Modus doppelt vor (`main.ts:347–351` und `384–387`). | mittel | Eine Knete-Instanz mit Profilen; Nahband als Profil-Schalter | M |
| Vite-Patch | `vite.config.ts` patcht `three-inspect` per String-Replace. Schlägt der Patch still fehl (neue Version), bricht nur `?inspect=1`. | niedrig | Nach dem Replace prüfen, ob ersetzt wurde, sonst Warnung | S |

---

## 6 · Lizenz- und Veröffentlichungsrisiko

| Fund | Risiko | Schwere | Fix |
|---|---|---|---|
| **`dist/` (76 MB, Build vom 10.10.) ist nicht gitignored** und enthält `dist/assets/streakbyte/` (33 MB, gekauft, V-071), `dist/assets/cars/` (Cicada, Cruiser, Carrier: FBX + JPG ohne Lizenzdatei) und weitere Kit-Assets. Ein `git add .` im falschen Ordner würde das veröffentlichen. Alter Bundle-Code (`index-*.js`, 1 MB) enthält vermutlich auch damaligen privaten Code (nicht geprüft). | hoch | `dist/` in `.gitignore`; den alten `dist/` nach Rückfrage bei Georg löschen; Build-Ausgabe nach `/tmp` oder `out/` (ignoriert) |
| **Autos „Retro Cartoon Cars“** (`public/assets/cars/*`) ohne Lizenz- und Herkunftsdatei und nicht gitignored | mittel–hoch (falls Unity- bzw. Store-Asset) | Herkunft klären; bis dahin in `.gitignore` |
| **BodyParts3D (CC BY-SA 2.1 JP)**: Organ-Bakes und alle daraus abgeleiteten Meshes. Wer Organ-Geometrie oder die Organ-Welt veröffentlicht (auch als Build), muss namentlich nennen und das abgeleitete Werk **unter derselben Lizenz** freigeben. Das steht in `lab-organ/SOURCES.md`, aber nicht im Plan und nicht in V-071. Heute lokal gitignored, also nur ein Risiko bei späterer Veröffentlichung. | mittel | Entscheidung für Georg vormerken: Organ-Welt öffentlich nur mit Share-alike, sonst eigene Körper (Blender, V-167) |
| **Clouds by Jarlan Perez (CC BY 3.0)** in `src/sky/vendor/media/…glb`, nicht gitignored | niedrig | Namensnennung steht in `sky/vendor/VENDOR.md`; im Spiel bzw. in den Credits sichtbar machen |
| **J17-Code** in `src/play/vendor/j17/` und `src/hud/vendor/` (Claude-Design-HUD) ist nicht gitignored, `public/vendor/joyride-j17/` schon. Ob Joyride-Code öffentlich sein darf, ist nicht entschieden (die `.gitignore` sagt „Joyride donors … stay local“). | mittel | Klare Regel: Ist Eigeninhalt öffentlich erlaubt? Sonst einheitlich ignorieren |
| **Track Core**: privat, korrekt ignoriert (`vendor/private/`). Im Lab-Code stehen nur der Pfad und die API-Namen (`track-core-alias.js:11–13`). | ok | – |
| Fingerabdrücke: cgbookcase über joebinns, MIT-Lizenz liegt bei | ok | – |
| `tools/`: Unity-Extraktoren (`unitypkg.py`, `unity_scene.py`) sind nur Code, ok. `tools/img2threejs-tests/**` enthält JSON mit absoluten lokalen Pfaden; laut Auftrag unkritisch. | niedrig | – |

**Empfehlung (S):** Ein Pre-Push-Skript `tools/publish-guard.mjs` prüft gegen eine Sperrliste (StreakByte, Megakit Pro, private-audio, decks, organ-o1, vendor/private, dist, Autos) und gegen Dateitypen über 5 MB. Dazu `ASSET_LICENSES.md` mit einer Zeile je Asset-Ordner. V-071 sieht als Prüfung „Push-Prüfung“ vor; ein Werkzeug dafür habe ich nicht gefunden.

---

## 7 · Top 10 für die nächsten zwei Wochen

Ausgerichtet auf den Plan: C abschließen → D Archipel → E Strecken-Editor → F Insel-Editor. Die Reihenfolge ist zugleich die Priorität.

| # | Maßnahme | Warum jetzt | Aufwand | Abnahme |
|---|---|---|---|---|
| 1 | **Organ-Welt-Cache und Lab-Inseln im Organ-Modus nicht bauen** (2a): Bake der fertigen Körper nach dem Boolean, Schlüssel aus Rezept-Fingerprint, Core, Tunnelstil und Geometrie-Flags | Georg testet live; 40–60 s zerstören jede Abnahme. Phase D lädt noch mehr Inseln. | S–M | Kalter Start ≤ 15 s, warmer Start ≤ 5 s bei `?hub=1&play=game`; Parity unverändert grün |
| 2 | **Flacker-Paket** (2b): dynres im Spiel aus bzw. nur ein Abwärtsschritt; `lod.hysteresis`; Rippe ab Stride 4 aus; near 1,0 plus `polygonOffset` für Auflagen; Shadow-Contract und Himmel-Neumalen nur bei Bedarf | V-166-Anlass; billig | S | Flicker-Probe mit DPR 2 und CPU-Drossel ×4: kein Bildpaar über 0,5 % |
| 3 | **Bandenenden als ein Baustein (V-168) plus Offene-Kanten-Test** (2c) | C4c ist der nächste Liefergegenstand; derselbe Baustein wird im Strecken-Editor (E) für jedes Ende gebraucht | M | 0 offene Kanten außer der Naht in 300 m um den Hub; Nahbild jedes Endes |
| 4 | **Veröffentlichungs-Hygiene** (6): `dist/` ignorieren bzw. nach Rückfrage löschen, Lizenzdatei je Asset-Ordner, Herkunft der Autos klären, publish-guard | Ein einziger falscher Push wäre ein Lizenzverstoß | S | publish-guard grün auf einem simulierten öffentlichen Klon |
| 5 | **Private Vendors entkoppeln und schnell scheitern** (5): `import()` der Organ-Welt, Track-Core-Stub, `__kfb.bootError`, HUD-`finally` | Heute startet ohne `vendor/private` keine einzige Seite; Tests warten 3–10 min auf Timeouts | S | Klon ohne Ignoriertes startet RKIT-Hub und Editor; Organ zeigt eine klare Meldung |
| 6 | **Deterministische Tests**: `?fixedDt=1` + `__kfb.step(n)`; Check 2/3/4/6 auf Sim-Zeit; Fußtest-Autopilot in der Seite; `organ` im Standardlauf; Chrome-Pfad per Umgebungsvariable; Testlauf gegen einen Build-Schnappschuss statt gegen den geteilten Dev-Server | Parity entscheidet über gültig/ungültig. Heute hängt es an der Rechnerlast (vgl. „PASS nach Wiederholung unter Last“ in PROJECT_STATE). | M | Dreimal hintereinander gleiches Ergebnis, auch mit CPU-Drossel ×4 |
| 7 | **Speicher und GC** (3): `delete()` für manifold, `heroCache` leeren, Debug-Felder nur mit `?debug=1`, Pro-Bild-Allokationen in `light.ts` und `main.ts` raus, Fingerabdruck-Bake einmal offline | Der Rechner läuft im vollen Swap; jede Spitze löst dynres-Sprünge und Ruckler aus | S | JS- und WASM-Heap nach dem Laden messen (vorher/nachher) |
| 8 | **Lokales Git + Vendor-Prüfskript** (1.4/1.5): Commit pro Lieferung; `tools/vendor/check.mjs` erzeugt die Diffs der LAB-Forks neu und prüft md5 | Mehrere Sitzungen ändern dieselben Dateien; die Organ-Diff ist schon veraltet | S | Diff je Lieferung im Bericht verlinkt |
| 9 | **`flags.ts` und Aufteilung von `main.ts` / `organ-world.ts`** in Hosts und Systeme (1.2/1.3), schrittweise, hinter Parity | Phase E braucht einen Strecken-Host, der ohne Organ-Neubau neu bauen kann. Phase F braucht einen sauberen Editor-Modus. | M (schrittweise) | Je Schritt Parity grün; `main.ts` < 300 Zeilen |
| 10 | **Phase-D/E-Vorbereitung**: Strecke als Daten → Geometrie in Chunks mit Hash je Chunk (nur geänderte Chunks neu bauen, im Worker); Track-Stream-Typen; Lauf-Oberfläche mit Ebenen bzw. BVH für Über- und Unterführungen; Welt-Layout-Datei `kfb.world-layout/1` | Der Zieh-Editor (E) braucht Neubau in < 100 ms je Punkt-Zug; heute ist jede Änderung ein kompletter `createOrganWorld` | M–L | Prototyp: einen Kontrollpunkt verschieben → betroffene Chunks neu in < 100 ms |

---

## Anhang A · Belegstellen (Auswahl)

- Ladezeit: `organ-world.ts:38–143` (Mesher), `:115` (levelSet-Callback), `:122` (heroCache), `:219–228` (Tunnel-Joins seriell), `main.ts:283–284` (Lab-Welt immer gebaut), `:328` (danach versteckt), `:514` (versteckte Inseln aktualisiert).
- Flackern: `main.ts:493–504` (dynres), `:496` (`setSize`), `:513` (Shadow-Contract 1 Hz), `organ-world.ts:181–187` (LOD ohne Hysterese), `:388` (Tier hart), `j17-track.lab.js:117` (Rippe), `main.ts:86, 323` (near/far), `c4c-furniture.ts:33, 38` (Lift), `day-night.js:78, 303–311` (Hintergrund 4 Hz), `sky.ts:109–113` (Nebel-Repaint).
- Banden: `j17-track.lab.js:108–141` (offenes Profil), `:123–128` (Kollaps auf Punkt), `:166–171` (Fächer-Deckel), `:182–189` (Lippen nur Ring), `organ-world.ts:191, 203–208` (Zweige ohne Lippen), `:185` vs. `:207` (Schatten).
- Robustheit: `track-core-alias.js:6`, `.gitignore` (kein `dist/`, `src/world/organ/vendor/` ignoriert), `main.ts:37, 570, 806–809`.
- Tests: `tools/parity/parity.mjs:16, 20, 47–48, 50, 74–75, 89, 110–115`; `tools/track/c4a-foot-test.mjs:12–20`; `src/play/drive-test.ts:17`.

## Anhang B · Was ich nicht prüfen konnte

- Keine Laufzeitmessung. Draw Calls, Heap-Größen und die Zeit für den Bau der Lab-Inseln im Organ-Modus sind geschätzt bzw. offen. Empfohlen: `performance.mark` je Bauschritt in `boot()` und `createOrganWorld`, Ausgabe in `__kfb.organ().info.timeline`.
- Den privaten Track Core habe ich nicht gelesen (nur Importpfad und Exportnamen).
- Den Inhalt des alten `dist/index-*.js` habe ich nicht auf eingebetteten privaten Code untersucht.
- Ob Z-Fighting heute schon sichtbar ist, ist eine Rechnung, keine Beobachtung.
