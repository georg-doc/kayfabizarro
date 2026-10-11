# Modul-Katalog · Lab (lebend) · Schema nach RKIT §MODULES-Felder (Steuerung 11.10., verbindlich)

**Besitz:**
- **Geometrie:** RKIT, Track Core 0.16.8, privat, `vendor/private/track-core-0.16.8/` (Organ-Welt über `track-core-alias.js`, C4b Teil 0 bitgleich; `?core=012` = v0.12).
- **Look:** Lab (J17, V-010).

**Maße:**
- Track-Meter `race-m`. Das Lab zeichnet × 1,46 (`lab`). 1 H = 3,64 lab = 2,49 m.
- Figuren werden nie skaliert (V-060).

**Vorgänger:** Der Katalog der Strecken-Welt C1b+C3 (`docs/critic/lab-track/2026-10-11_C1b-C3-r2/MODULES.md`) gilt weiter für die Messwerte dort.

## Feld-Bedeutung

| Feld | Inhalt |
|---|---|
| `id` / `version` | Modulname, Track-Core-Version, ab der es gilt |
| `family` | race (RACE, COSMIC) bzw. world (TOWN, COUNTRY, MOUNTAIN, HIGHWAY, DRIVING_SCHOOL); edge-only TOWN_BAY |
| `section` | Breite, Spuren, Seitenquerschnitt je Seite (14 Slots), Decktiefe |
| `edge` | je Seite L/R: bande · kerb · shoulder · free, `barrierVis` |
| `frames` | Anschluss-Rahmen {id, kind, p, T, U, R, …}; kind: route-start/-end · socket · portal · level · dock · anchor |
| `scale` | `race-m` oder `lab` |
| `seam` | Lücke 0, Höhensprung 0, Normalensprung ≤ 1,10°; Querschnitt gleich oder Katalog-Übergang (B…, C…) |
| `checks` | Track-Core-Prüfungen + Lab-Prüfungen (offen 0, mehrfach 0, V-136 / V-112) |
| `tests` | Datei + Anzahl |
| `look` | Lab-Modul (J17) |
| `parity` | Gleichstand gegen den Vorgänger |

## Module

### Fahrbahn + Strang (Ring)
- **id / version:** `race_road` / 0.16.8 (bitgleich v0.12, Lab-Beweis C4b).
- **family:** race RACE.
- **section:** STANDARD 14,4 m; Slots 6/7 = Fahrspur; Bande 1,35 m.
- **edge:** L/R bande (`barrierVis` 1).
- **frames:** route-start/-end, joints, portal (`tunnels`).
- **scale:** race-m.
- **seam:** Nähte 0 m, Normalen ≤ 1,1° (Fahrtest R2).
- **checks:** Fahrtest V-125, parity.
- **tests:** `tools/track/drive-test.mjs`.
- **look:** `j17-track.lab.js` `prepJ17` / `buildJ17Chunk` (J17 1:1).
- **parity:** RKIT `parity_v012.mjs` 0 Abweichung.

### Markierungen M2
- **id / version:** `markings_m2` / 0.12.
- **family:** race.
- **section:** Rand B 0,6 lab weiß; MAG gelbe Blocklinie.
- **edge:** an Slot 6/7.
- **frames:** –.
- **scale:** race-m.
- **seam:** –.
- **checks:** Dichte gegen J17 (`m2_density.json`).
- **tests:** `tools/track/m2-density.mjs`.
- **look:** LAB PATCH F, Zone `track` = bio −1 (J17-Atlas).
- **parity:** `?m2zone=city` = alt.

### B7 Haltebucht (Hex-Hub)
- **id / version:** `bay_b7` / 0.16.1 Katalog B7.
- **family:** world-edge TOWN_BAY an race.
- **section:** gw 3,0 · kh 0,12 · kw 0,3 · ww 6,4 · wy 0,12 lab.
- **Fenster:** bande [0, 0,3] · gutter [0,15, 0,85] · kerb [0,55, 1] · walk [0,35, 1] · foot [0, 1].
- **edge:** R: bande → kerb (Bucht), L bande.
- **frames:** dock (Auto-Stand), Spawn auf dem Gehweg.
- **scale:** race-m (Lab-Querschnitt) + lab (RKIT-GLB).
- **seam:** B7 als Morph im J17-Querschnitt, ohne Zusatzteil.
- **checks:** Fußtest 6/6, Gate-1b-Punkte.
- **tests:** `tools/track/c4a-foot-test.mjs`.
- **look:** LAB PATCH G (Bandenkopf J17). Bord, Gehweg und Kantensteine = RKIT `public/roadbeds/hex_b7.parts.glb` (V-138, geliefert 11.10.); Knet-Schüttung zur Hex-Insel und Kerben-Füller Lab-eigen (`?bayParts=0` = C4a).
- **parity:** `?bay=0` = alt.

### Tunnel im Feld
- **id / version:** `tunnel_field` / 0.12 + TC1 v3.
- **family:** race.
- **section:**
  - Ring aus Core `tunnelSpec(spec)`.
  - **`profile` = arch | rect | round**: eigene Eigenschaft, getrennt vom `look`.
  - Standard je Look = TC1 v3 `p1b.export.json → tunnelLooks.*.spec`: stone_arch `{preset gotthard}` (arch) · stone_rect `{gotthard, rect, e 6}` · race_tube `{preset toy, host mountain}` (round) · mine `{gotthard, rect, e 10, host earth, wall 1}`.
  - Später je Tunnel im Strecken-Editor wählbar (V-100, Phase E).
- **edge:** –.
- **frames:** portal (Einfahrt / Ausfahrt = Mündung im Körper).
- **scale:** race-m.
- **seam:** Feldschnitt mit Lippe 0,6 m.
  - Kopfplatte + Portal-Fußflächen als weiche Feld-Vereinigung (Knet-Fuß, smin 0,6 / 0,35).
  - Wandfarben-Naht im Ebenenschnitt (konform).
  - Rollrand: 7 Bogen-Ebenen.
- **checks:** Körper offen 0 / mehrfach 0 (V-112, V-136), Q1 0 schwebend, Durchsicht 0, Freiraum ≥ 0,3 m, Q5 nach Art.
- **tests:** `bench.html` + `tools/track/bench-run.mjs` (Prüfbank A), `tunnel-qcheck`.
- **look:** TC1 v3 Portal + Innenausbau je Look aus `tunnel-insert.ts tunnelParts` (1:1 + Q1/Q5-Anpassungen); Wandfarbe je Look (strang/cloud · rock · tower1).
- **parity:** Bank A gegen `tc1-looks.v3.jpg`.

### Tunnel · Wirt-Körper
- **id / version:** `host_field` / –.
- **family:** –.
- **section:**
  - Jeder Körper als Abstandsfeld G {V, nx, ny, nz, o, h} (innen < 0).
  - Quellen: O1-Feld · Höhenfunktion → 3D (TC1-Hügel; Berg-Insel `src/bench/host-berg.ts`, Bank B) · Netz → Feld (Blender R3 Inselboden, wenn geliefert).
- **edge:** –.
- **frames:** anchor.
- **scale:** race-m.
- **seam:** ein levelSet, Insel = ein geschlossenes Mesh (V-136).
- **checks:** offen 0, mehrfach 0.
- **tests:** `tools/track/body-closed.mjs`, `bench-run.mjs` (`host=berg[&size=M|L]`).
- **look:** Körper-Material (Hügel hill0 / Organ std); Berg-Insel: eine Knete mit Vertex-Farbe (Erde, Fels, Moos, Gras, Schnee aus Feld-Kanälen).
- **parity:** –.

## Rundkurs-Module von RKIT (Stand Track Core 0.16.2, noch nicht im Lab eingebaut)
Quelle: `KFB_HUB/30_DECISIONS/replies/RKIT_RUNDKURS_SKINS_R1.md` §4. Kurzform; die vollen Felder kommen beim Einbau (C4).
Legende Skins: ✓ vorhanden, ~ teilweise.

| id | logic | skins | edge | frames | checks / tests | Lücke |
|---|---|---|---|---|---|---|
| gerade_kreisel | roundabout (Arm) | race ✓ · town ~ | race bande · town bande statt kerb | socket node/arm, mouth | node_mouth, test.mjs M/S/L | town-Kante |
| einfaedelung | roundabout (Einfahrt) | race ~ · town ~ | wie Arm | Wartelinie | node_paths | Einfädel-Markierung |
| ausfaedelung | roundabout (Ausfahrt) | race ~ · town ~ | wie Arm | – | node_paths | Ausfahrtpfeile |
| banden_innen | roundabout (Insel-Lauf) | race ✓ · town ~ | race bande · town kerb fehlt | anchor roundabout_centre | node_clear | town-Querschnitt |
| banden_aussen | roundabout (Ecken-Läufe) | race ✓ · town ~ | race bande · town kerb fehlt | – | rfMin-Fehler | town-Querschnitt |
| verjuengung | Aufweitung / WIDTH_TAPER | race ✓ · town ✓ | – | – | width_taper | – |
| markierung | node markings | race ~ · town ~ | – | – | – | Pfeile, Ringspuren |
| endkappen | ROUND_END / U-Nase / Bordkopf | race ~ · town ~ | – | – | – | Stummel-Kappe, erhabener Splitter |
