# Dungeon-Strecke · Machbarkeit (R1) · nur gemessen, nichts gebaut

Stand 2026-10-12 · Frage Georg: Kann die KFB-Strecke durch Dungeons aus dem KayKit-Dungeon-Pack fahren (Pac-Man-Draufsicht, breite Gänge, 2–n Etagen mit Rampen, Fackeln, Truhen, Gitterfenster, Geisterbahn-Gefühl)?

**Urteil: JA MIT UMBAU.** Der Kit-Faktor bleibt K2 (× 1,6). Die Gänge werden mehrere Zellen breit, die Wände zwei Module hoch. Es fehlen gerundete Innenecken, Rampen-Wände, ein breites Portal und eine Dungeon-Skin im Track Core.

## 0 · Kennzeichnung der Zahlen

- **[M]** gemessen: glTF-Eckpunkte nach Knoten-Transformen, eigenes Skript (Dreiecks-Schnitte für Öffnungen). Quelle: `~/Downloads/KayKit_Dungeon_Pack_1.1_FREE.zip` und `KayKit Dungeon Pack 1.0.zip`, entpackt nur in den Scratchpad.
- **[D]** aus einem Doc, Pfad steht dabei.
- **[C]** aus Code, Pfad steht dabei (nur gelesen).
- **[R]** gerechnet aus [M]/[D]/[C].
- **[S]** Schätzung.
- Einheiten: k = KayKit-Einheit, lab = Lab-Einheit, TC-m = Track-Core-Meter. lab = k × 1,6 (K2) und lab = TC-m × 1,46 (`RACE_W`, `src/play/camera.ts:19`).

## 1 · KayKit-Dungeon-Packs

**Fundorte**
- Lab: nur `public/assets/kaykit/dungeon/wall_doorway.gltf` + Textur + License (Pack 1.1). Bytegleich mit 1.1 [M, `cmp`]. Im Lab-Code nicht eingebunden (grep `src` ohne Treffer).
- Voll: `~/Downloads/KayKit_Dungeon_Pack_1.1_FREE.zip` (Lizenzdatei: 1.1, 16.07.2026; 423 Dateien im gltf-Ordner) und `KayKit Dungeon Pack 1.0.zip` (2020, 185 Dateien).
- Repo `georg-doc/kayfabizarro` `main`: `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/`. Registry `registry/assets/v1/packs/kaykit-dungeon-pack-1-1-free-2.json` mit 227 Assets [D].
- WSA-Inventar (`WSA_RHYTHM_PROPS_INVENTORY_R1.md`, Branch `docs/kfb-decisions-register-2026-10-11`): torch 1,0416 · torch_lit 1,1258 · torch_mounted 1,0625 k hoch. Das deckt sich mit meiner Messung [M].
- Nebenbei: Kenney Modular Dungeon Kit (Downloads) hat dasselbe 4-k-Raster und fertige `corridor-wide` 8 × 8 [M]. In der Quellen-Reihenfolge (KayKit > Tiny Treats > Quaternius > Kenney) kommt Kenney aber zuletzt.

**Raster 1.1** [M]
- Modul = Zelle = 4,0 k (= 1 MC = 6,4 lab, wie K2 [D `docs/SCALE_CONTRACT_K2.md` §2]).
- Wände sitzen mittig auf der Fuge (z ± 0,5). Daraus folgt: Lichte Gangbreite = (4·N − 1) k bei N Zellen [R].

| Teil | Maß in k [M] | × 1,6 in lab [R] |
|---|---|---|
| `wall` (auch cracked, broken, sloped, window, gated …) | 4,0 breit · 4,0 hoch · 1,0 dick | 6,4 · 6,4 · 1,6 |
| `wall_half` / `wall_endcap` | 2,0 / 1,07 breit | 3,2 / 1,7 |
| `wall_corner` / `_small` | 2,5 × 2,5 / 1,5 × 1,5 | 4,0 / 2,4 |
| `wall_Tsplit` / `wall_crossing` | 4,0 × 2,5 / 4,0 × 4,0 | – |
| `wall_pillar` | 4,0 breit, 1,5 tief | ragt 0,4 lab in den Gang |
| `pillar` | 1,5 × 4,0 × 1,5 | 2,4 × 6,4 |
| `floor_tile_large` / `_small` | 4 × 4 / 2 × 2, Oberkante y 0,05 | 6,4 / 3,2 |
| `floor_tile_extralarge_grates` | 8 × 8, Grube bis −0,98 | 12,8 |
| `ceiling_tile` | 4 × 4 × 0,35 (y −0,25 … 0,10) | hängt 0,4 lab |
| `stairs` / `stairs_long` / `stairs_wide` | 5,0 breit, Hub 4,0 auf 4 / 8 Lauf; wide 7,0 breit | Steigung 100 % / 50 % |
| `stairs_walled` | 5 × 4 × 4 | 100 % |
| `floor_foundation_*` | 2,2 × 2,0 hoch | Sockel 3,2 hoch |

**Öffnungen** [M, Schnitte]
- `wall_doorway`: **geschlossen.** Bretter-Füllung 2,0 breit, etwa 2,05–2,1 hoch [S aus Schnitt]; das Türblatt ist ein eigener Knoten im selben Modell. Nicht befahrbar.
- `wall_arched`: **geschlossene Nische** 3,0 breit, 2,75 hoch (passt zum K2-Wert „Dungeon-Tür ≈ 2,75 k“).
- `wall_window_open`: 1,35 breit, Brüstung 1,30, Sturz 2,60.
- `wall_archedwindow_gated`: Gitterfenster 2,0 breit, 1,05 bis 2,75 hoch.
- `wall_gated`: Gitterwand, Stäbe über 3,16 Breite, 0,76 bis 2,94 hoch. Man sieht durch in den Nachbargang.
- `wall_open_scaffold`: größte Öffnung, 3,5 breit, 3,2 hoch.
- Pack 1.0 zum Vergleich: Wand 1,5 dick, `wall_door` offen 2,0 × 2,57, Bodenkacheln 2/4/6. Gemischtes Raster, deshalb 1.1 bevorzugen.

**Requisiten** [M] → × 1,6 [R]
- `torch_mounted` 1,06 → 1,70 lab hoch; `torch_lit` 1,13 → 1,80.
- `chest` / `chest_gold` 1,70 × 1,30 → 2,72 breit, 2,08 hoch.
- `barrel_large` 1,8 × 2,0 → 2,88 × 3,20; `crates_stacked` ≈ 2,1 → 3,4.
- `banner_*` 1,5 × 3,2 → 2,4 × 5,1; `candle_lit` 1,05 → 1,68.
- **Nicht gefunden** in den Dateilisten 1.1 und 1.0: Hängelampe, Kronleuchter, Deckenlicht, runde oder schräge Wände, Rampe für Fahrzeuge, offener breiter Torbogen.

## 2 · Dungeon-Generator

**Gefunden: S13.2 `dungeon-grid.js` (BSP)**
- Orte:
  - `~/Dropbox/CLAUDE/KayKit Environment Atlas + Dungeon Generator + 3D scene editor TOOL (5)/KFB_Dungeon_RoomStudy_S21_EXPORT_2026-09-20/lib/`;
  - `~/Dropbox/CLAUDE/KayKit_Room_Study_S21/S22_RoomStudy_Handover/lib/`;
  - Repo `tools/world_atlas/source/` mit `KayKit_Dungeon_Generator_S13_2.html`.
- Nicht im Lab, nicht im Track Core.
- Ausgabe von `generate({seed, grid: 8, levels: 2, …})` [C]: ein Modell als JS-Objekt. Es enthält Zellen (Map `"c,r"` → room/corr), Fugen (Set mit kanonischem Schlüssel, Klasse wall/door/gate/open), Regionen, Ecken, Fackeln, Requisiten, Treppe und Prüfungen.
- `layout(model, kit)` liefert eine Platzierungsliste `{a: 'dungeon:<teil>', p: [x,y,z], r: Grad}`. Das ist Grid plus Szene, kein JSON-Export. JSON wäre aber trivial.
- Grenzen für die Strecke:
  - Gänge sind **erzwungen 1 Modul breit** (`thinCorridors` entfernt 2×2-Gangblöcke);
  - Raster 8 × 8;
  - Ebenenwechsel nur per Treppe;
  - BSP-Räume statt Labyrinth.

**Gefunden: KFB WhackMan v1 (Pac-Man auf KayKit-Dungeon)**
- Repo `tools/KFB-ToolBox/_inbox/KFB WhackMan v1-1/WHACKMAN_SESSION_2026-09-22/`.
- `wm-recipe.js`: handgeschriebenes ASCII-Labyrinth 17 × 15 → S13.2-Fugenmodell → `layout()` des Owners.
- `wm-maze.js`: MazeGraph mit Nachbarn, Tunnelpaar, BFS.
- Das ist genau Georgs Draufsicht-Idee, nur mit 1-Zellen-Gängen. **Bester Donor für den Grundriss.**

**Kein Generator:** `~/Downloads/Dungeon.zip` / `Dungeon.json` ist eine 2D-Kachelkarte (Tileset 0x72, tileSize 16).

**Falls extern nötig:** rot.js (`ROT.Map.*`: Digger, Uniform, Labyrinth-Verfahren, Ausgabe als Raster-Callback x, y, Wert) oder ein WFC-Port. Beide liefern ein Raster, das man genauso grob skalieren müsste (§4).

## 3 · Strecken-Vertrag (Ist)

| Größe | Wert | Quelle |
|---|---|---|
| H / MC / FIG_SCALE | 3,64 / 6,4 / 1,6, Figuren nie skaliert | [D] SCALE_CONTRACT_K2, V-060 |
| Track Core → lab | × 1,46 | [C] `src/play/camera.ts:19` |
| RACE-Breiten | NARROW 10,8 · STANDARD 14,4 · WIDE 18 · HERO 21,6 TC-m | [C] `vendor/private/track-core-0.16.9/track-core.mjs:14` |
| Seite RACE (Bankett, Abstand, Bande) | 1,98 + 0,72 + 1,62 = 4,32 TC-m je Seite | [C] ebd. :62–75 |
| Ringspur STANDARD | 14,4 × 1,46 = **21,0 lab** | [R] |
| Weltspuren | 3,75 / 4,0 / 4,5 lab | [C] `LANE_WIDTHS` :111, [D] K2 §4 |
| Weltauto Cicada | 6,0 × 3,11 × 3,0 lab | [D] `replies/RKIT_CAR_WIDTHS_R1.md` |
| LEVEL_RAMP | ≤ 8 %, Halteplatte 12, Core lehnt zu steile Rampen ab | [D] `replies/RKIT_LEVEL_RAMP_R1.md` |
| LEVEL_RAMP-Länge | 4 → „about 93,7“, 6 → „about 140,6“, also ≈ 23,4 × Höhe | [D] ebd., [R] |
| Kurven-Faltung | Mittellinien-Radius ≥ innere Querschnittsbreite + 0,5 TC-m | [C] `inner_edge_fold`, `TOL.foldMargin` |
| Ecken-Feld `corner` je Familie | RACE 14 · TOWN 9 · DRIVING_SCHOOL 8 · COUNTRY/DIRT 10 · HIGHWAY 18 | [C] :116–137 (Bedeutung offen, s. §7) |
| NPC-Wendeweg-Radius | ≥ 8 | [C] `NODE_TOL.pathRadius` |
| Kamera-Freiraum V-169 | 4,9 (Kamera 4,4 + 0,5), Einheit Track-Core-Meter | [D] `replies/RKIT_SPIRAL_CLEARANCE_R1.md` |
| Durchfahrtshöhe V-175 | 5,8 lab (1,6 H), „deckt Kamera 4,9“ | [D] DECISIONS.md V-175 |
| Lab-Verfolgerkamera | Pivot 0,5 H + up 3,5 × 1,46 (+ 0,9 × 1,46 bei vmax) → 6,9 … 8,2 lab über Fahrbahn bei Zoom 1 | [C] `src/play/camera.ts:33`, [R] |
| spiral_clearance | gebaut in 0.16.10, **nicht** vendort (Lab hat 0.16.9) | [D] RKIT_SPIRAL_CLEARANCE_R1 |

**Einheiten-Widerspruch (wichtig):** V-169 rechnet 4,9 in Track-Core-Metern, das sind 7,15 lab [R]. V-175 sagt „5,8 lab deckt 4,9“. Das stimmt nur, wenn man 4,9 als lab liest. Die Lab-Kamera selbst sitzt laut Code bei 6,9–8,2 lab [R], mit Marge 0,73 also **≈ 9,0 lab Bedarf** [R]. Ich rechne unten mit 9,0 lab als sicherer Wert.

## 4 · Rechnung

### 4a · Gangbreite und Kit-Faktor

Hüllen (lichte Breite, die der Gang braucht):

| Hülle | Inhalt | lab |
|---|---|---|
| E1 RACE STANDARD voll | 14,4 + 2 × 4,32 TC-m | 33,6 [R] |
| E2 RACE NARROW voll | 10,8 + 2 × 4,32 TC-m | 28,4 [R] |
| E3 „Dungeon-Gasse“ | NARROW-Fahrbahn 10,8 TC-m, Dungeonwand statt Bande, 0,5 TC-m Rand je Seite | 17,2 [R; Vorschlag] |
| E4 Welt 2 Spuren | 2 × 4,0 + 2 × 1,0 Rand | 10,0 [S] |
| E5 Geisterbahn 1 Spur | 4,0 + 2 × 1,0 | 6,0 [S] |

Kit-Faktor, damit ein Gang aus N Zellen die Hülle fasst (Faktor = Hülle / (4N − 1)) [R]:

| N Zellen | E1 | E2 | E3 | E4 | E5 |
|---|---|---|---|---|---|
| 1 | 11,2 | 9,5 | 5,7 | 3,3 | 2,0 |
| 2 | 4,8 | 4,1 | 2,5 | 1,4 | 0,9 |
| 3 | 3,1 | 2,6 | **1,57** | 0,9 | – |
| 5 | 1,8 | **1,5** | – | – | – |
| 6 | **1,46** | 1,2 | – | – | – |

**Ergebnis:** Mit dem K2-Faktor 1,6 passt jede Hülle, wenn der Gang breit genug ist [R]:
- E1 in 6 Zellen: lichte Breite 36,8;
- E2 in 5 Zellen: 30,4;
- **E3 in 3 Zellen: 17,6 (Empfehlung für das Labyrinth)**;
- E4 in 2 Zellen: 11,2;
- E5 in 1 Zelle: 4,8 reicht **nicht**.

**Ein eigener Kit-Faktor ist also nicht nötig.** Gleichmäßig hochskalieren (z. B. × 11,2 für E1 in einer Zelle) wäre schlecht:
- Wand 45 lab hoch;
- Tür 19 lab hoch (5 H statt 1,2 H, K2 §4);
- Fackel 12 lab hoch;
- eine Etage wäre 45 lab, die Rampe dafür 560 lab lang.

Der Grundriss wird stattdessen grob gerechnet: Eine Labyrinth-Zelle (z. B. aus dem WhackMan-Rezept) wird zu 3 × 3 MC. Wandzellen bleiben 1 MC dick oder werden ganz gefüllt. Das passiert in einem Adapter, nicht im Generator-Code (wie K2 §5).

### 4b · Höhe

- Ein Wandmodul ist 6,4 lab [R]. Das reicht für 5,8 (V-175), aber **nicht** für 7,15 (V-169 umgerechnet) und nicht für ≈ 9,0 (Lab-Kamera).
- **Zwei Module übereinander = 12,8 lab** (3,5 H) [R]. Unter der Deckenkachel bleiben ≈ 12,4 lab [R]. Das besteht alle drei Lesarten.
- Proportion E3: 17,6 breit × 12,4 hoch, wie ein Tunnel. E1: 36,8 × 12,4, wie ein Parkdeck.
- Niedrige Geisterbahn-Decke (1 Modul) geht erst mit dem Kamera-Modul V-170 (Absenkung, `q.ceiling`, noch nicht gebaut [D]). Die Kamera kürzt heute schon ihren Arm bei einem Raycast-Treffer [C `camera.ts:107`]. Ob die Decke in diesem Raycast liegt, ist offen.

### 4c · Requisiten

- Bei 1,6 [R]: Fackel 1,7–1,8 lab ≈ 0,6 Autohöhe (Auto 2,5–3,0 [D]); Truhe 2,7 breit; Banner 5,1 hoch; Gitterwand 5,1 × 3,5.
- Kamera 13–18 lab hinter dem Auto [C, R].
- In E3 (Wand ≈ 8,8 lab neben der Mittellinie) sind Fackeln und Truhen gut lesbar [S].
- In E1-Hallen (Wand ≈ 18 lab entfernt) wirken Wand-Requisiten klein [S]. Möglich wäre ein Kulissen-Faktor × 1,5 nur für Wand-Requisiten (K2 §1/§5 erlaubt nur begründete Kulissen-Vergrößerung). Das entscheidet Georg.
- Gehen Figuren durch den Dungeon, bleibt alles bei 1,6 ohne Ausnahme.

### 4d · Etage und Rampe (≤ 8 %)

- Etagenhöhe = 2 Module = **12,8 lab** [R]. Ein Modul (6,4) fällt durch, weil Deck und Decke den Rest unter 5,8 drücken: 6,4 − 0,8 − 0,56 ≈ 5,0 [R].
- **Gerade Rampe, linear 8 %: 160 lab = 25 MC** [R].
- Mit LEVEL_RAMP (Hermite, Spitze 8 %): ≈ 23,4 × 12,8 ≈ **300 lab ≈ 47 MC** plus Halteplatte [R aus Doc-Zahlen]. Im Labyrinth geht das als gefaltete Rampe (zwei parallele Gänge mit Haarnadel) oder entlang der langen Außenseite.
- **Spindel (Parkhaus, V-113):**
  - 1 Umlauf je Etage, 8 % → Umfang 160 → Mittellinien-Radius **R ≈ 25,5 lab** [R].
  - Zwei Umläufe je Etage gehen nicht: Dann wären es nur 6,4 je Umlauf, unter der Kamera-Höhe (V-169).
  - Faltung ok für E3 (25,5 − 7,9 ≫ 0,73) [R].
  - Grundfläche: E3 Ø ≈ 68 lab → **Raum 11 × 11 MC**; E1 Ø ≈ 85 lab → 14 × 14 MC [R].
  - Freie Höhe unter dem nächsten Umlauf: 12,8 − RACE-Deck 3,29 = 9,5 (knapp über 9,0) bzw. mit Weltdeck 0,8 = 12,0 [R].

### 4e · 90°-Ecken im Raster

- Mit **eckiger Innenecke** liegt der Kreismittelpunkt höchstens auf der Innenecke. Dann gilt: R ≥ halbe Fahrbahn + 0,73 und R + halbe Fahrbahn ≤ lichte Breite − 0,73 [R].
  - E3 in 3 Zellen: R nur **8,6–9,0 lab** (≈ 6 TC-m) [R]. Fahrbar, aber eine langsame Haarnadel. Das liegt unter RACE `corner` 14 TC-m und unter dem J17-Haarnadel-Radius 13,75 TC-m [D RKIT_TRACK_GAPS_R1].
  - E4 in 2 Zellen: R ≈ 5,5–5,7 lab, unter `pathRadius` 8 → zu eng [R].
- Die Clothoid-Einläufe (`CURVE_EASE`, ease bis 0,6 R) brauchen zusätzlich Platz [C]. Die Ecken-Werte oben sind deshalb Obergrenzen.
- Mit **gerundeter Innenecke** (Radius ρ, Mittelpunkt in der Innenwand) reicht dieselbe Gangbreite für jeden Radius [R]. Für flüssige R = 14 TC-m = 20,4 lab in E3 braucht es ρ ≈ 11 lab ≈ 1,7 MC [R].
- Die Außenecke darf eckig bleiben (Pac-Man-Look). Ein runder Außenbogen ist nur Optik.
- **Folge:** Eckige Rasterecken gehen nur als Geisterbahn-Haarnadel. Für ein Renngefühl braucht es gerundete Innenecken-Teile. Die gibt es im Pack nicht; S13 schreibt selbst, dass runde oder schräge Räume mit dem Pack nicht baubar sind [D `KayKit_Dungeon_Model_S13.html`].

## 5 · Lücken

Suchraum: Pack 1.1 und 1.0 (Dateilisten), Lab `public/assets` und `src`, Repo `main`, S21-Export mit `PACK_GAPS_DUNGEON_1_1.md`, WSA-Inventar, Kenney Dungeon, KayKit Space Base Bits. Die V-140-Donorlisten (J14 T4 Parkdeck, TC1-Portale) sind nur als Vorlage genannt, nicht vollständig durchsucht.

| Lücke | Stand | Wer |
|---|---|---|
| Breite Gänge | Keine eigenen Kacheln nötig: Bodenkacheln 4 × 4 und 8 × 8 reihen. Der Generator kann es nicht (1 Zelle). | Adapter Rezept → 3 × 3 MC (POC-Sitzung), S13.2 bleibt unangetastet |
| Gerundete Innenecke ρ ≈ 11 lab (optional Außenbogen) | nicht gefunden in KayKit 1.1/1.0 | RKIT-Knetteil oder Blender, Abschluss gerundet (V-168) |
| Rampe zwischen Etagen (8 %) | KayKit hat nur Treppen (50–100 %) | Fahrbahn = Track Core `LEVEL_RAMP`; Seitenwand: gestapelte Wände + Knet-Sockel gegen den Schrägschnitt (RKIT) |
| Spindelraum | keine runden Wände | Vorlage J14 T4 Parkdeck (V-113); Kern als Knetkörper (RKIT/Blender) |
| Decke mit Licht | `ceiling_tile` da; Hängelampe nicht gefunden | Licht: `dungeon-light.js` (S13.3) + `torch_mounted`; Hängelaterne: Quaternius `Lantern_Wall` (CC0 laut WSA). KayKit-Holiday-Laternen: Lizenz laut WSA unbelegt. |
| Portal rein/raus zur offenen Strecke | größte Öffnung 3,5 k = 5,6 lab | TC1-Portal (V-130 PASS) + Dungeon-Fassade; Blender oder RKIT |
| Dungeon-Skin im Track Core | fehlt: Steinboden-Fahrbahn, Kante „frei“ an Dungeonwand | RKIT (Skin-Daten) + Lab (Look, Kollision Auto ↔ Wand) |
| Gitterfenster, Fackeln, Truhen | **vorhanden** (§1) | Bestand, 1,6 |
| Sci-Fi-Variante | Space Base Bits hat keine Innen-Gänge | später (V-105 Skin B) |

## 6 · POC-Skizze (eigene Claude-Code-Sitzung später)

Port 5194 (nicht 5180, nicht 5192), eigener Branch, z. B. `poc/dungeon-track-r1`. Track Core 0.16.9 nur lesen. Prüfung bei ≥ 50 fps.

1. **Maß-Gang.** Ein gerader E3-Gang (3 MC breit, 2 Module hoch, 6 MC lang) aus Pack 1.1 bei 1,6. Darin Figur, Cicada, Fackel, Truhe, Gitterwand.
   - *Standbild S1* mit eingeblendeten Maßen (lichte Breite 17,6, Höhe 12,4).
2. **Labyrinth.** WhackMan-Rezept, verkleinert auf etwa 9 × 9, über einen Adapter auf 3 × 3 MC → S13.2-Fugenmodell → `layout()`.
   - *Standbild S2*: Draufsicht mit eingezeichneter Fahrlinie.
3. **Fahrlinie.** Eine Runde durch das Labyrinth als Track-Core-Rezept (STRAIGHT, CURVE_EASE) mit E3-Querschnitt. `runChecks` grün, besonders `inner_edge_fold`.
   - Ecken-Vergleich: eckig (R ≈ 9) gegen Knet-Platzhalter mit gerundeter Innenecke (R ≈ 20).
   - *Standbilder S3a/S3b*: Verfolgerkamera in beiden Ecken.
4. **Zweite Etage.** Spindelraum 11 × 11 MC oder gefaltete Rampe, Etage 12,8. Kamera-Freiraum von Hand messen (spiral_clearance ist nicht vendort).
   - *Standbild S4*: Kamera unter dem oberen Umlauf, Auto sichtbar, dazu ein Seitenschnitt mit Maßen.
5. **Portal und Stimmung.** TC1-Portal mit Dungeon-Fassade, Fackel-Rhythmus, Truhen, Gitterfenster, `dungeon-light.js`.
   - *Standbilder S5*: Einfahrt, Innen, Ausfahrt (wie `tc1-looks`).

## 7 · Offene Fragen

1. Kamera-Freiraum in lab: gilt 5,8 (V-175), 7,15 (V-169 umgerechnet) oder der Code-Wert ≈ 9,0? Ich empfehle 9,0.
2. Welche Strecken-Klasse im Dungeon: RACE (× 1,46, Banden) oder Welt (KFB-Autos, Spuren)? Davon hängt die Gangbreite ab (3, 5 oder 6 MC).
3. Gehen Figuren zu Fuß durch den Dungeon? Wenn ja, bleibt alles strikt bei 1,6. Wenn nur gefahren wird, wäre ein Kulissen-Faktor für Wand-Requisiten denkbar.
4. Kollision Auto ↔ Dungeonwand bei Kante „frei“: neu im Lab oder Bande unsichtbar im Track Core?
5. Größe: 17 × 15 Pac-Man-Zellen bei 4 MC Teilung sind ≈ 435 × 384 lab je Etage [R]. Die Testinsel hat 128 lab [D]. Liegt der Dungeon in einer Insel (V-099 Typ 2, V-113) oder schwebt er frei?
6. Feld `corner` im Track Core: Ist es der Mindest-Kurvenradius oder nur der Knoten-Eckradius? Das muss RKIT bestätigen.
7. Gibt es in J14 T4 / TC1 schon ein Stück, das Innenecke, Rampenwand oder Portal abdeckt? Das ist die V-140-Prüfung vor jedem Neubau.
