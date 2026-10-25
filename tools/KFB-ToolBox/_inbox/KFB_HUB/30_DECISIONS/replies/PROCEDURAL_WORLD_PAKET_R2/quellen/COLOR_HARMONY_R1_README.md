# KFB · Farbharmonie-Modell R1 (aus Joyride J17 abgeleitet)

Stand 15.10.2026 · WS0 · Register V-293 (Auftrag), V-292 (Story-Mode-Farben), V-102/V-174 (Fahrbahn, Bande).
Quelle der Messung: Lab `src/world/organ/vendor/j17/lab-track/track-look.v5.js` `WORLDS` und Lab `src/palettes.ts` `PALETTES` (canyon, bucht, otown). Spender für die Rechenart: Cologne Race `cologne-palette.v1.js` (OKLCH, Gamut-Rücknahme, Schemata; Repo main, Blob `38246785`).

## 1 · Das Modell in Kürze

Eine J17-Welt hat **drei tragende Farbtöne**: den **Boden** g (die Fläche, rund 60 % des Bildes), den **Strang** (Bande, Rahmen), der um etwa **90° vom Boden** steht und **immer warm** ist (Orange, Koralle, Senf), und das **Wahrzeichen** (Türme), das etwa **gegenüber dem Boden (180°)** steht und ins **Bonbon-Band** Violett–Magenta–Rot gezogen wird. Kommt es dabei dem Strang zu nah, wird es **einfarbig mit dem Strang** (Canyon: orange Türme). Alles andere hängt daran: **Laub** ist Naturgrün, außer der Boden ist selbst grün oder türkis, dann **Herbst-Orange** (O-Town). Der **Himmel** liegt **90° neben dem Laub** (grünes Laub → Blau, oranges Laub → Mint). **Stamm und Erde** liegen **105° auf der anderen Seite des Laubs** (Braun bzw. Lila). **Pad** ist immer Gelb, **Fahrbahn** immer Schiefer.

**Helligkeit folgt dem Farbton, aber gestaucht.** Jeder Farbton hat eine natürliche Helligkeit, bei der er am buntesten sein kann (Gelb hell, Violett/Blau tief). J17 nimmt diese Helligkeit nur zur Hälfte mit und zieht den Rest zur Mitte (Pop-L = 0,37 + 0,5 · Cusp-L). Darum sind Gelb und Orange hell, Violett und Magenta mittel, aber nichts ist dunkel. **Buntheit hat vier Stufen mit Deckel:** Pop (Strang, Pad, Türme, Laub) bis 0,195, Fläche (Boden, Hügel) bis 0,14, Ruhe (Himmel, Wasser, Fahrbahn) um 0,07, Neutral (Wolke, Weg, Sand) um 0,03. Das „Cartoon“ entsteht genau hier: kräftige Farben bei mittlerer bis heller Helligkeit, wenige klare Stufen, warm gegen kühl, und nie Neon, weil der Deckel auch dann gilt, wenn der Bildschirm mehr Buntheit hergeben würde.

## 2 · Gemessen (OKLCH; L Helligkeit 0–1, C Buntheit, h Farbton in Grad, Δh zum Boden)

| Rolle | Canyon | Bucht | O-Town | Regel |
|---|---|---|---|---|
| Boden | L 0,59 · C 0,143 · 299° | L 0,87 · C 0,107 · 88° | L 0,66 · C 0,099 · 182° | Tisch L ≈ 0,55 + 0,12·Cusp-L, C ≤ 0,14 (warm ≤ 0,11); Strand (Gelb 65–110°) L 0,87 |
| Hügel hell / dunkel | +0,08 / −0,04 L, gleicher Ton | Aqua 192–200° (kühler Partner) | +0,05 / −0,07 L | Tisch: Boden ±0,06 L; Strand: Hügel = Himmel −30° |
| Strang | L 0,66 · C 0,195 · 39° (Δh +100) | L 0,71 · C 0,161 · 10° (−78) | L 0,80 · C 0,145 · 84° (−98) | g ± 90°, die wärmere Seite, 30 % zur Orange-Mitte 45° |
| Wahrzeichen | = Strang (monochrom) | L 0,63 · C 0,147 · 303° (−145) | L 0,61 · C 0,167 · 351° (+169) | g + 180°, 40 % zum Bonbon-Zentrum 350°; < 35° am Strang → monochrom |
| Laub | Grün 148–150°, L 0,51–0,56 | Grün 131–140°, L 0,70–0,78 | Orange 58–75°, L 0,73–0,80 | Grün 143°; Boden grün/türkis (105–215°) → Herbst 66°; grünes Laub ≤ Boden-L − 0,06 |
| Blüte | Limette 105°, L 0,81 | Rosa 354°, L 0,80 | = Wahrzeichen | hell, 75 % vom Wahrzeichen zum Strang; Herbst → Wahrzeichen; monochrom → Limette |
| Himmel | L 0,78 · 243° | L 0,84 · 219° | L 0,84 · 156° | Laub + 90°, L ≈ 0,82, C 0,068 |
| Stamm / Erde | Braun 54° / Orange 38–45° | Ocker 47–56° | Lila 304–307°, L 0,35–0,47 | Laub − 105°; L 0,68/0,61/0,52; Herbst 0,47/0,42/0,35 (dunkles Gegengewicht zur hellen Krone) |
| Pad | 82°, L 0,81 | 94°, L 0,87 | 103°, L 0,94 | Gelb 92°, ≥ 20° vom Strang, an der Cusp |
| Wolke · Weg · Sand | Creme 70–87°, L 0,87–0,97, C 0,03–0,04 | | | fest Creme 80–84°, L 0,93 |
| Wasser | 249° L 0,60 | Lagune 207° L 0,76 | 244° L 0,58 | Tisch Taubenblau 247°; Strand im Ton der Dünen |
| Fahrbahn | 261° L 0,41 C 0,04 | 249° L 0,47 | 280° L 0,43 | fest `#3d4a60` (V-102/V-174), Straße +0,10 L |

**Helligkeits-Leiter:** Creme 0,87–0,97 · Himmel/Blüte 0,78–0,84 · Pop 0,61–0,85 (Gelb oben, Violett unten) · Boden 0,59–0,66 (Strand 0,87) · Erde/Stamm 0,47–0,68 · Fahrbahn 0,41.

## 3 · Generator-Regeln (`kfb-cartoon-palette.js`)

1. **Eingabe:** ein Boden-Farbton (`fromHue(h, seed, scheme)`), ein Story-Mode (`fromStoryMode(id, seed)`), 1–3 Vorgabefarben (`fromColors([...])`) oder nur ein Seed (`random(seed)`). `seed = 0` heißt reine Regel ohne Würfel-Rauschen.
2. **Farbtöne** nach §2. Schemata bestimmen nur die Winkel von Strang und Wahrzeichen: `joyride` (90°/180°, gemessen), `komplementaer` (180°/150°), `split` (150°/210°), `triade` (120°/240°), `analog` (40°/−40°). Die J17-Leitplanken gelten in jedem Schema: Strang warm, Wahrzeichen Richtung Bonbon, Laub/Himmel/Stamm/Pad nach Regel.
3. **Helligkeit und Buntheit** je Rolle aus der Tabelle `MODEL.L` / `MODEL.C` (an Cusp-L des Farbtons gebunden, Buntheit gedeckelt absolut und relativ zum Möglichen).
4. **Gamut:** OKLCH → sRGB; wenn nicht darstellbar, sinkt nur die Buntheit (L und Farbton bleiben).
5. **Würfel** (seed ≠ 0): Schema gewichtet (Joyride 4, Komplementär 2, Split 2, Triade 2, Analog 1), Farbtöne ±6°, Stimmung einmal je Palette L ±0,02 und C ×0,92–1,08.
6. **Vorgaben** (`fromColors`): Jede Farbe wird der passendsten Rolle zugeordnet (Boden, Strang, Wahrzeichen, Laub), bleibt exakt, der Rest folgt der Regel. Beispiel in `results.json` `fromColorsDemo`: O-Town aus `#3aa596` + `#e9b53b` ergibt Wahrzeichen `#d7568b`, Laub `#ed9c3e`, Himmel `#a7d8b8`.
7. **Story-Mode:** der Farbton der Website-Farbe (V-292, Mittel aus dunkel und satt) wird **Boden-Farbton**; Helligkeit kommt aus der J17-Leiter, nicht aus der dunklen Website-Farbe (Website L 0,43–0,67 → Spiel-Boden L 0,62–0,87). Die Website-Farben bleiben im Ergebnis (`source.storyDunkel`, `source.storySatt`) für Schrift und Linien.
8. **Ausgabe:** `roles` (J17-/`palettes.ts`-Form: sky, top, top2, hill[2], sand, rim, under[4], rock, tower[2], leaf[3], trunk, cloud, water, path, roadStreet, roadTrack, strang, pad), `envRoles` (ENV_ROLES-Form, je drei Töne hell/mitte/dunkel, plus asphalt, landmark, sky), `variants` (je Akzent `dunkel` / `mitte` / `satt`), `hues`, `mode`.
9. **Leitern und Varianten:** hell = +0,07 L (C ×0,95), dunkel = −0,09 L. Variante **dunkel** = −0,17 L, C ×0,85 (Linie, Schrift auf hell). Variante **satt** = +0,06 L (+0,06 mehr bei Gelb), C ×1,15. Das entspricht dem Muster der Website-Paare: dort ist „satt“ vor allem heller (+0,04 bis +0,15 L) und etwas bunter (×1,07–1,21), bei gleichem Farbton.

## 4 · Nachweis

**J17-Nachbau aus nur dem Boden-Farbton** (ΔE in OKLab: 0,02 kaum sichtbar, 0,05 deutlich, 0,10 eine andere Farbe; 25 Rollen je Welt):

| Welt | Eingabe | mittleres ΔE | ohne Fahrbahn | größtes ΔE | Rollen < 0,05 |
|---|---|---|---|---|---|
| Canyon | 299° | 0,024 | 0,027 | 0,063 (Wolke) | 23 / 25 |
| Bucht | 88° | 0,027 | 0,023 | 0,077 (Straße) | 22 / 25 |
| O-Town | 182° | 0,023 | 0,021 | 0,058 (Pad) | 24 / 25 |

Die größten Abweichungen sind die Fahrbahn (J17 tönt sie je Welt; KFB hat sie mit V-174 auf `#3d4a60` festgelegt), das Pad-Gelb (±10°) und die Creme-Töne. Je Rolle mit Hex-Werten: `results.json` → `j17.<welt>.perRole`.

**Ehrlich dazu:** Die Konstanten sind an genau diesen drei Welten gemessen (rund 30 Zahlen für 75 Farbwerte), der Nachbau ist also eine Erklärung, kein unabhängiger Test. Drei Regeln haben eine Fallunterscheidung, die je an einer Welt hängt: Strand-Boden (Bucht), monochromes Wahrzeichen (Canyon), Herbstlaub mit dunklem Stamm (O-Town). Grenze: eine natürliche grüne Wiese (z. B. `kfb_town`) bekommt nach der Regel Herbstlaub; dafür gibt man das Laub als Vorgabe mit (`fromColors`).

Bilder (`bilder/`, alle selbst gesichtet):
- `01_j17_<welt>_original_vs_regel.png` – je Welt links Original, rechts Nachbau mit ΔE je Rolle.
- `02_storymodes_1_tragic_comic_absurd.png`, `02_storymodes_2_heroic_mystical_forbidden.png` – Story-Mode-Paletten mit Website-Farben, Spiel-Helligkeit und Varianten dunkel/mitte/satt.
- `03_zufall_1..4_*.png` – Seeds 1–12 ungeschönt.
- `04_szene_1_otown_original.png`, `04_szene_2_otown_regel.png`, `04_szene_3_storymode_mystical.png`, `04_szene_4_zufall_seed_9.png` – Knet-Testszene (three.js 0.186, WS1-Bühnenlicht: Hemisphäre 0xfff4e0/0x3a3226 · 1,25, Sonne 0xffffff · 1,8 bei (6, 11, 7), fov 38, keine Tonabbildung, sRGB): Boden, Hügel, Fels, Turm, Baum mit Blüten, Himmel, Display-Rahmen, Fluff-Kugel, Fahrbahn mit Strang und Pad.

Fluff in der Szene = Blüte, Variante „satt“ (Arbeitsstand; ein Fluff-Farbschema ist weiter offen, COLOR_CONCEPT_R1 G-1).

## 5 · Dateien und Aufruf

- `kfb-cartoon-palette.js` – Modul (ES, ohne Abhängigkeiten): `fromHue`, `fromColors`, `fromStoryMode`, `random`, `analyse`, dazu `MODEL`, `SCHEMES`, `STORY_MODES`, `deltaE`, `hexToOklch`, `oklchToHex`, `ladderOf`, `variantsOf`.
- `j17-reference.js` – die drei J17-Paletten als Referenz.
- `kfb-harmony-run.mjs` – `node kfb-harmony-run.mjs` → Nachbau + ΔE, Story-Modes, 12 Zufallspaletten → `results.json`.
- `kfb-harmony-render.mjs` – `node kfb-harmony-render.mjs [filter]` → Bilder in `bilder/` (headless Chrome über playwright-core und three aus dem Lab-`node_modules`, nur gelesen; kein Server, kein Port).
- `results.json` – alle Paletten, ΔE je Rolle, Analyse der Originale.
