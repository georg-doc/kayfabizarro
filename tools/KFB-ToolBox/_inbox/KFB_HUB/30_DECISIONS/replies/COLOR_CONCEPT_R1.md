# KFB · Farbkonzept R1 (Konsolidierung aller Farbquellen)

Stand 15.10.2026 · WS0 · Datei mit den Werten: `replies/kfb-color-concept.r1.json` (schema `kfb.color-concept/1`).
Register: V-010, V-011, V-051, V-102, V-174, V-245, V-270, **V-286**. Keine Farbe in diesem Dokument ist erfunden. Wo eine Zahl aus einer Formel der Quelle gerechnet ist, steht das dabei. Wo WS0 nur beschreibt, was in den Daten steckt, steht **abgeleitet (WS0)**.

---

## 1 · Das Konzept in einem Absatz

Jede Welt bzw. Kartenzone hat **eine Welt-Palette**: die Joyride-Paletten aus J17 (`canyon`, `bucht`, `otown`) und ihre Ableitungen (`wueste`, `kfb_town`, `protopia`). Eine Palette ist kein Stimmungston, sondern ein Harmonie-System mit mindestens sechs Farben, und **jede Farbe hat eine Rolle**: Boden, Hügel, Wahrzeichen/Türme, Strang bzw. Rahmen, Laub, Stamm, Fels, Wolke, Himmel, Pad, Fahrbahn. Für unsere eigenen Bauteile gilt die Farb-Grammatik `ENV_ROLES`: je Rolle drei Töne (hell, mitte, dunkel). Über der Welt-Palette liegt der **Story-Mode der Karte** als leichte Tönung (sechs Modi, je `base`, `accent` und daraus `deep`, `light`, `line`), nie statt der Palette. **Wo welche Farbe wirkt (V-286):** gemalte Meshy-Texturen werden nur sanft getönt, alles, was wir selbst bauen, trägt die volle Palette mit Rollen. Drei Teile fehlen im Bestand und sind offene Fragen an Georg (§6): ein Fluff-Farbschema nach Story-Modes mit Werten, eine Regel für „dunkle und sattere Variante“ und ein gebauter Paletten-Würfel.

---

## 2 · Die Schichten

### 2.1 · Wo welche Farbe wirkt (V-286, Georg 15.10.)

| Träger | Was wirkt | Wie stark |
|---|---|---|
| **Meshy-Bühnen mit fertig gemalter Textur** (Amphitheater, Theater, Dom, Pyramide, Library, Mesa, Nature/Snow, Dystopia-Gasse) | Welt-Palette bzw. Story-Mode als **sanfte Färbung** | Textur bleibt lesbar. Keine Rollen-Umfärbung der Meshy-Textur (V-286 ersetzt V-270 an dieser Stelle). |
| **Alles, was wir selbst bauen**: Rahmen und Displays (Billboard, `kfb_screen_slot`-Rahmen), Requisiten, Fluff, Himmel, Licht, Figuren-Akzente | **volle Palette**: sechs harmonische Farben mit Rollen, dazu dunkle und sattere Variante | Rollen nach §2.2.3; Story-Tint darüber nach §2.3. |
| **Strecke** (Rennen) | J17 fest: Fahrbahn `#3d4a60`, Banden/Strang `#ef5a22` | V-102, V-174. Rot-Weiß nur für Kerbs. |
| **Licht** (Sonne, Gischt, Glanz) | Lichtfarbe kommt von der Lichtquelle, nicht von der Marke | Regel aus Travel globe-v13 `sky-presets.js` (Georg 30.8., „gelbe Wellen stören“): Material harmonisieren (Farbton KFB, Sättigung und Helligkeit aus der Quelle), Licht nicht. Story-Mode darf das Licht tönen (Tint), nicht ersetzen. |

Hinweis zur sanften Färbung: Der einzige Zahlenwert im Bestand ist WS1s Story-Tint **12 %** gerade sRGB-Mischung zum `accent` des Modus (Grenze „höchstens ~15 %“, WS0-Vorgabe an WS1, WS1_STATUS §34.1). Für die Welt-Palette auf Meshy-Texturen gibt es noch keinen Zahlenwert → Frage G-6 in §6.

---

### 2.2 · Schicht 1 · Welt-Palette (sechs harmonische Farben + Rollen)

#### 2.2.1 Die Joyride-Welten (Goldstandard, kanonisch)

Quelle: `track-look.v5.js` `WORLDS` (Lab-Vendor `src/world/organ/vendor/j17/lab-track/track-look.v5.js`, Git-Blob `7c0d2483…` = Repo main, J14-Schnitt; `WORLDS` ist in allen drei Repo-Fassungen gleich; J17 `JOYRIDE_J17_2026-10-01` bietet genau diese drei Welten an).

| Rolle (J17) | canyon · A Claybound-Canyon | bucht · B Bikini-Bucht | otown · C O-Town |
|---|---|---|---|
| table (Boden) | `#8b68c7` | `#f0cf7e` | `#3aa596` |
| hill [hell/dunkel] | `#a582d9` / `#7b5bb8` | `#5cc3bf` / `#46adb2` | `#2f8f83` / `#4cb5a5` |
| strang (Rahmen/Bande) | `#ef5a22` | `#f2708a` | `#e9b53b` |
| tower (Wahrzeichen) | `#ef5a22` / `#e8743a` | `#9a6fd0` / `#b08ae0` | `#c9508f` / `#e0679f` |
| leaf [0, 1, Akzent] | `#1f7a3e` `#2f8a45` `#cdc666` | `#8fcf45` `#5fb84a` `#f7a1c4` | `#f08a2c` `#f5b041` `#c9508f` |
| trunk | `#8a5a3a` | `#c9895a` | `#6b4a8a` |
| rock | `#e2d0bc` | `#9a6fd0` | `#e0679f` |
| cloud | `#e2d0bc` | `#fff4e2` | `#f3ead8` |
| sky | `#96bede` | `#8fd6ec` | `#a8d8b9` |
| pad (Boost) | `#f2b632` | `#f7d23c` | `#fff06a` |
| roadStreet / roadTrack | `#566680` / `#3d4a60` | `#5f7f9a` / `#3e5d7c` | `#6a6e8f` / `#4a4d6e` |
| kart [3] | `#f2b632` `#5983ac` `#e2d0bc` | `#f7d23c` `#9a6fd0` `#fff4e2` | `#fff06a` `#6b4a8a` `#f08a2c` |

Für das Rennen gilt unabhängig von der Welt: Fahrbahn `#3d4a60`, Banden `#ef5a22` (V-102, V-174).

#### 2.2.2 Die Insel-Paletten (Lab `src/palettes.ts` `PALETTES`)

`canyon`, `bucht`, `otown` = Joyride 1:1 auf Inselteile gelegt (sky, top/top2, hill[2], sand, rim, under[4], rock, tower[2], leaf[3], trunk, cloud, water, path, roadStreet, roadTrack, strang). Abgeleitet: `wueste` (aus Canyon-Orange + Bucht-Sand), `kfb_town` und `protopia` (aus R2C `hex-archipel.r2c.js` PAL burg/protopia). Alle Werte stehen in der JSON (`layer1_worldPalettes.islandPalettes`).

Die Sechser-Kombination laut Schema `kfb.island-theme/1` (`public/themes/island-themes.json`, Auszug aus WORLDS): **sky, ground, hill, accent, road, strang** + cloud.

| | sky | ground | hill | accent | road | strang | cloud |
|---|---|---|---|---|---|---|---|
| canyon | `#96bede` | `#8b68c7` | `#a582d9` | `#ef5a22` | `#3d4a60` | `#ef5a22` | `#e2d0bc` |
| bucht | `#8fd6ec` | `#f0cf7e` | `#5cc3bf` | `#9a6fd0` | `#3e5d7c` | `#f2708a` | `#fff4e2` |
| otown | `#a8d8b9` | `#3aa596` | `#2f8f83` | `#c9508f` | `#4a4d6e` | `#e9b53b` | `#f3ead8` |

#### 2.2.3 Farb-Grammatik `ENV_ROLES` (Rollen für alles, was wir bauen)

Quelle: Lab `src/palettes.ts` `ENV_ROLES` (lokal, nach V-174). Je Palette elf Rollen mit drei Tönen **[hell, mitte, dunkel]** und einer Begründung (`why`): `ground, grass, stone, bark, leaf, bloom, water, accent, sand, paved, earth`, dazu inselübergreifend `ASPHALT_DEFAULT ['#4a5770','#3d4a60','#323d50']`, `MASONRY_DEFAULT ['#e6d5b7','#dccdb9','#d2bc9a','#b49d7e']`, `BANDE_DEFAULT #ef5a22`. Regeln: Farbe nie backen, nur über Rollen (STYLE_GUIDE §4); Stein aus Boden und Fels der Insel, nie Turmfarbe; Gras aus der Bodenfamilie, nie Laubfarbe; 60/30/10 (Haupt-, Neben-, Akzentfarbe), Akzente führen zur Landmarke (QA_RULEBOOK_ENVIRONMENT_R1 §0b Punkt 4, Kriterium K2).

Akzent-Familie je Palette (Rahmen, Requisiten, Wahrzeichen-Führung):

| Palette | accent [hell, mitte, dunkel] | Herkunft (`why`) |
|---|---|---|
| canyon | `#f2b632` `#ef5a22` `#c4441a` | Strang-Orange |
| bucht | `#b08ae0` `#9a6fd0` `#7a52b0` | Korallen-Violett |
| otown | `#f08ab8` `#e0679f` `#c9508f` | Magenta der Wackeltürme |
| wueste | `#f8dc98` `#ef7a4f` `#c95a35` | Pyramidenspitze + Koralle |
| kfb_town | `#f2b632` `#ef5a22` `#c4441a` | Burg-Rot aus dem Strang |
| protopia | `#f5a050` `#e8742a` `#c05a1c` | Werkstatt-Orange |

**Rollen für eigene Bauteile (V-286).** Belegt ist: Joyride legt jede Rolle auf eine eigene Objektklasse (table, hill, tower, leaf, trunk, rock, cloud, strang, pad, sky; WS1_STATUS §36.2). Daraus folgt für Bühnenteile WS1s Vorschlag „Variante B“ (WS1_STATUS §36.3): Torbögen/Mauerkrone `tower`, Sitzreihen `hill[0]/hill[1]`, Bühnenboden `top`/`sand`, Gelände `hill[1]`, Billboard-Rahmen `strang`, Pfosten `trunk`, Leiste `pad`/`rock`, Himmel `sky → cloud`. **Achtung V-286:** Torbögen, Sitzreihen und Bühnenboden sind beim Amphitheater Meshy-Textur, dort also nur sanfte Tönung; volle Rollen nur für Rahmen, Pfosten, Leiste, Requisiten, Himmel, Fluff, Licht, Figuren-Akzente. Die Tabelle wartet auf Georgs Urteil (G-5).

---

### 2.3 · Schicht 2 · Story-Mode-Tönung

#### 2.3.1 Kanonisch für den Tint: `storymode.v4.js`

Quelle: `KFB_HUB/30_DECISIONS/replies/donors/storymode.v4.js` (Blob `58a79133…`; Original `KFB FrankenStein Lab + Models/KFB Shader Duo Tone v1/kfb-bg-shader-kit_2026-09-02/`; alle zwölf Kopien in Dropbox md5-gleich; WS1 hat denselben Blob). Laut Dateikopf ist `base` die Kachelfläche und `accent` der Modusname, **pixelweise gemessen an der Story-Mode-Tabelle auf kayfabizarro.pages.dev** (gedruckt vorhanden).

Formeln der Quelle (sRGB, gerade Mischung): `deep = mix(base, accent, 0.62)`, `light = mix(base, accent, 0.14)`, `line = mix(accent, #000, 0.42)`. Übergang 1,4 s, weich.

| Modus (Würfel) | base | accent | deep | light | line | Regel (Website-Wortlaut) |
|---|---|---|---|---|---|---|
| Tragic (1) | `#dadacb` | `#34566b` | `#73888f` | `#c3c8be` | `#1e323e` | Loss is real. Push forward anyway. |
| Comic (2) | `#e3dfc2` | `#5d7033` | `#909a69` | `#d0cfae` | `#36411e` | Things go wrong. It's your fault. Play the gap. |
| Absurd (3) | `#f5e6be` | `#b8901d` | `#cfb15a` | `#ecdaa7` | `#6b5411` | The impossible is normal. Don't explain it. |
| Heroic (4) | `#f1ddc0` | `#b25e23` | `#ca8e5f` | `#e8cbaa` | `#673714` | Your Actor is right for this moment. Play the peak. |
| Mystical (5) | `#e1d6ca` | `#5c4470` | `#8f7b92` | `#cec2bd` | `#352741` | Something's happening beneath the surface. |
| Forbidden (6) | `#e9d5c7` | `#8e3a60` | `#b17587` | `#dcbfb9` | `#522238` | Cross the line the story's been avoiding. Sell it. |

(deep, light, line mit `paletteOf()` der Quelle gerechnet.)

#### 2.3.2 Wie stark, wo

- **Regel:** leichte Einfärbung über dem Grundthema, nie statt ihm (V-051, Plan R1 §2, STYLE_GUIDE §4).
- **Zahl im Bestand:** WS1 mischt 12 % zum `accent` (gerade sRGB), Prüfung „höchstens 15 %“ (WS1 `stagePalette.js` `TINT_K = 0.12`).
- **Wo:** alle eigenen Bauteile und Himmel (V-270, V-286); Meshy-Texturen nur sanft (V-286).
- **Georg 15.10. (WS1_STATUS §36.1):** Die Story-Modes bringen eine Tönung „mit einer differenzierten Palette“ mit. Eine Sechs-Farben-Palette je Story-Mode **gibt es im Bestand nicht** (siehe §2.3.3, G-8).

#### 2.3.3 Konkurrierender Satz: „Rules Print v4“ in `world-context.js`

Quelle: Repo `travel/KFB Travel Combat v25/terrain-v25/world-context.js` (main, Blob `478e8cb4…`, auch bei WS1 vendored, dort nur für die Moduswahl der Karte benutzt). Laut Kommentar „KFB Rules Print v4 canon (09_MODE_COLORS_canonical, 1:1 with rollercoaster-ride MODES)“. Dazu je Modus eine Drei-Stufen-Palette (dunkel → mitte → Glut) „SSOT mirror of MOOD_SKY / FRACTAL_PALETTES“, also die einzige Story-Mode-Palette mit mehr als zwei Farben.

| Modus | ink | panel | glowOf(ink) | STORY_PALETTES (dunkel / mitte / Glut) |
|---|---|---|---|---|
| tragic | `#3e6a83` | `#dbe4e9` | `#90c9e9` | `#0f1a29` / `#3d6b8c` / `#9ebdd1` |
| comic | `#5e6f33` | `#e3e9d3` | `#cce983` | `#242e0f` / `#85a833` / `#f0eb9e` |
| absurd | `#9a4f86` | `#efe0ec` | `#e694d0` | `#291a05` / `#d9339e` / `#29b8a8` |
| heroic | `#b5642a` | `#f0e2d2` | `#ffb27a` | `#240d05` / `#db6b1f` / `#ffdb85` |
| mystical | `#6b4f9c` | `#e6dff0` | `#b193e6` | `#140a24` / `#855cb8` / `#d6c7f0` |
| forbidden | `#8f3a5f` | `#efdbe2` | `#f089b6` | `#1a030d` / `#b81433` / `#f03d85` |

(glowOf mit der Formel der Quelle gerechnet.)

---

### 2.4 · Schicht 3 · Fluff-Farben nach Story-Mode

**Ergebnis:** Ein Farbschema, das die Fluff-Sorten nach Story-Modes auf Farben legt, **mit Werten in keiner gefundenen Quelle** (Suche nicht vollständig abgeschlossen, siehe G-1). Gefunden sind nur Regeltexte, und die widersprechen sich:

| Quelle | Was dort steht |
|---|---|
| Lab Plan R1 §2 | storyTint je Story-Mode „(High- bzw. Low-Vibrational-Fluff)“, leicht über dem Grundthema |
| Register V-270 | Story-Modes als Tint, „definiert über das Fluff-Farbschema (V-051 storyTint)“ |
| Lab Plan R1 §2b | Fluff im Baum zuerst als **bunte Mischung**, bewusst auffällig, auch außerhalb der Insel-Palette; Farbwirkung/Alchemie später |
| Lab SPEC_ENVIRONMENT_KIT §13, ENV_ERZAEHLRASTER | Fluff-Kugeln in der **Biom-Farbe**: Rolle Blüte bzw. Akzent der Farb-Grammatik, keine Verläufe (`fluff: { colour: 'accent' }`) |
| Lab `docs/story/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md` | High-/Low-Vibrational-Fluff als Story-Sprache (Low = erntbar, Academy-UFO-Abfluss; High = Wachstum, Bau), **keine Farben** |
| WS1_STATUS §28.2 | „Quelle fehlt: Das Fluff-Farbschema steht nicht im Lab-Schnappschuss.“ |

**Arbeitsstand bis zur Klärung (aus Lab-Spec, nicht vom Register bestätigt):** Fluff-Kugel = `ENV_ROLES[palette].accent` (Werte §2.2.3). Der WS1-Kommentar „Story-Tint aus dem Fluff-Farbschema (storymode.v4.js)“ setzt Fluff-Schema und storymode.v4 gleich; dafür gibt es keine Quelle.

---

### 2.5 · Schicht 4 · Dunkle und sattere Variante

**Ergebnis der Suche:** Eine Regel „je Palettenfarbe eine dunkle und eine sattere Variante“ steht **in keiner Quelle**. Vorhanden sind diese Formeln und Daten (Werte und Pfade in der JSON, `layer4_variants`):

| Was | Quelle | dunkel | satter |
|---|---|---|---|
| `ENV_ROLES` [hell, mitte, dunkel] | Lab `palettes.ts` | ja, als handgesetzte Daten je Rolle. **Abgeleitet (WS0):** dunkel ≈ mitte −0,09 OKLCH-Helligkeit (0,04–0,12), gleicher Farbton (±9°), Buntheit etwa gleich | nein |
| Fahrbahn | Lab `palettes.ts` | hell/dunkel ±12 % um `#3d4a60` | nein |
| Story-Mode | `storymode.v4.js` | `line = mix(accent, #000, 0.42)`; `deep = mix(base, accent, 0.62)` | nein |
| Story-Mode-Glut | `world-context.js` `glowOf` | nein | **ja:** HSL `s' = min(1, s·1,55 + 0,12)`, `l' = min(0,74, l·1,3 + 0,3)` („ink lifted into a legible neon“) |
| Bühnen-Rollen | Clay Stage R2 `palette-roles.js` | Mischung im linearen Raum zur dunklen Stufe bzw. zu `#1f1a14` / `#2b2018` (0,3–0,62) | nein |
| Cologne-Generator | `cologne-palette.v1.js` | `lightMood` ±0,035 L für die ganze Palette | `chromaMood` ×0,84–1,24 Buntheit für die ganze Palette (OKLCH) |
| Cel-Konzept (historisch, Juli) | RollerCoaster v8 `04_CEL_SHADING_shadow_lighting.md` | Schatten nicht schwarz: dunklere Grundfarbe + Hauch Story-Mode-Ink; Rim-Licht = Mode-Ink | nein |

Was davon gilt, ist offen (G-2). Zwei Leitplanken aus dem Register stehen fest: J17 bleibt Maßstab für Licht und Sättigung (V-174 (4)); Dunkelheit am Fuß entsteht durch Eingraben, Schatten und AO, nicht durch Abdunkel-Scheiben oder Verläufe (ENV_ERZAEHLRASTER, V-011).

---

### 2.6 · Paletten würfeln (Generator)

**Regel:** V-051 und Plan R1 §2: Generator „zufällig harmonisch oder aus 2–3 vorgegebenen Farben die passenden Cartoon-Farben ergänzen (Harmonie-Regeln aus den Joyride-Kombinationen ableiten)“. God-Mode-Vision §3.3: „Würfeln“ (Farbkreis-Schemata) und „Ableiten“ (1–3 Grundfarben); Ergebnis sind immer die Rollen von `ENV_ROLES`. Georg 15.10.: jede Kartenzone bzw. Welt hat ihre Palette, und eine Palette lässt sich würfeln, um eine ganze Zone samt Requisiten, Signatur-Elementen und Wahrzeichen umzufärben.

**Was es gibt:**
- **Lab:** nichts gebaut. `src/theme/island-theme.ts`: „palette 6-combo + storyTint follow in Phase F“; `island-themes.json`: „Generator for new palettes: Phase F“.
- **Travel v25 `world-palettes.js`:** kein Würfel, acht feste Drei-Stufen-Paletten (cubescape … ember) plus `from_cards` (`paletteFromVector` in `world-context.js`: Farbton je Karten-Dimension, Chaos spreizt den Akzent-Winkel, HSL).
- **Clay Stage R2 `palette-roles.js`:** kein Würfel, leitet Bühnen-Rollen aus drei Stufen + Akzent ab.
- **Cologne Race `cologne-palette.v1.js`:** **der einzige gebaute Paletten-Würfel** (`makePalette(seed)`, Schema `kfb-palette/v1`, OKLCH). Er dreht die Farbfamilien (Zonen) auf ein Harmonie-Schema und behält Helligkeit und Buntheit der gemessenen Anker-Palette: Schemata in Grad zum Grundton `analog [0,26,−32,54]`, `komplementaer [0,176,22,−158]`, `triade [0,118,−124,34]`, `split [0,152,−148,26]`, `tetrade [0,88,178,−92]`; innerhalb einer Familie bleibt der Winkelabstand (×0,8); `chromaMood`/`lightMood` einmal je Palette; Markierungen bleiben im Band Gelb–Orange; Lesbarkeitsboden Markierung über Fahrbahn ΔL ≥ 0,28; Export/Import als JSON, reproduzierbar per Seed.

**Was die Joyride-Kombinationen als Harmonie-Regeln hergeben (abgeleitet (WS0), OKLCH-Messung der drei WORLDS, kein Register-Wert):**
1. **Boden ist eine Familie:** table und beide hills haben denselben Farbton (±3°); hill = heller bzw. dunkler Ton des Bodens.
2. **Strang/Rahmen ≈ Vierteldrehung vom Boden:** canyon +100°, bucht −78°, otown −98°; immer der bunteste Ton der Welt.
3. **Wahrzeichen (tower):** entweder Strangfarbe (canyon) oder etwa Gegenfarbe zum Boden (bucht −145°, otown +169°).
4. **Pad/Boost immer Gelb** (82–103°), sehr hell.
5. **Fahrbahn immer gedämpftes Schieferblau** (249–280°, wenig bunt), unabhängig von der Welt.
6. **Himmel hell und wenig bunt.**
7. **Laub folgt keiner festen Regel** (canyon Gegenfarbe, bucht +43°, otown −124°); `leaf[2]` ist der Blüten- bzw. Akzentton.

**Vorschlag (nicht gebaut, nicht entschieden, G-4):** Würfel = Cologne-Methode (OKLCH-Drehung, L und C aus der Anker-Palette) mit einer Joyride-Palette als Anker statt der Köln-Messung; Zonen = Joyride-Rollen: Boden-Familie (table, hill), Strang/Rahmen, Wahrzeichen, Laub, Himmel; fest bleiben Fahrbahn (V-102), Pad-Gelb, Banden (V-174). Ausgabe immer als `ENV_ROLES`-Satz (drei Töne je Rolle). **Wirkung des gewürfelten Satzes (V-286):** voll auf Rahmen/Displays (`strang`/`accent`), Requisiten (`accent`, `bark`, `stone`), Wahrzeichen und Signatur-Elemente (`tower`/`accent`), Fluff (siehe §2.4), Himmel (`sky → cloud`), Licht-Tönung und Figuren-Akzente; auf Meshy-Bühnen nur als sanfte Tönung. Story-Mode bleibt Tint darüber.

---

## 3 · Quellen

Repo `georg-doc/kayfabizarro`, lokale Kopie `~/KFB_GitHub_sync` (nur `git show`/`git ls-tree`). main = `e082405ee`, `ws1/r3f-frame` = `980467bf5` (15.10. 11:26).

| # | Quelle (Pfad · Commit/Blob) | Inhalt | Status |
|---|---|---|---|
| 1 | Lab `src/world/organ/vendor/j17/lab-track/track-look.v5.js` · Blob `7c0d2483` = main `…KFB_JOYRIDE_J14_…/lab-track/track-look.v5.js` | `WORLDS` canyon/bucht/otown (J17) | **kanonisch** (V-010, V-102) |
| 2 | Lab `src/palettes.ts` (lokal, git-hash `44d9f5f9`, nach V-174) | `PALETTES` (6), `ENV_ROLES` (6×11 Rollen ×3 Töne), ASPHALT/MASONRY/BANDE | **kanonisch** |
| 3 | Repo `gh/sync/lab-snapshot-2026-10-11` @`64ae61fe7` `…/KFB Island Worldbuilder Lab/src/palettes.ts` · Blob `f8f57d76` | Stand 11.10. vor V-174 (ASPHALT `#545e7a`, BANDE rot/weiß) | **veraltet** in ASPHALT/BANDE, sonst gleich |
| 4 | Lab `public/themes/island-themes.json` · `kfb.island-theme/1` · git-hash `659fb62c` | Sechser-Kombination je Joyride-Welt, `skyHueShift`, Insel→Palette | abgeleitet aus 1; Generator/storyTint „Phase F“ |
| 5 | Lab `docs/KFB_WORLDBUILDER_PLAN_R1.md` §2, §2b | Schema-Regel, Generator, storyTint, Fluff „bunte Mischung“ | Regel (V-051) |
| 6 | Lab `docs/SPEC_WORLDBUILDER_GODMODE_VISION_R1.md` §3.3 | Würfeln / Ableiten → `ENV_ROLES` | Regel-Entwurf |
| 7 | Lab `docs/QA_RULEBOOK_ENVIRONMENT_R1.md` §0b Punkt 4, K2 | Farb-Grammatik, 60/30/10 | Regel |
| 8 | Lab `docs/SPEC_ENVIRONMENT_KIT_R1.md` §3, §13; `docs/ENV_ERZAEHLRASTER_R1.md` | Kit-Umfärbung je Rolle; Fluff-Farbe = Biom-Akzent | Regel bzw. Idee |
| 9 | `KFB_HUB/30_DECISIONS/STYLE_GUIDE_3D_R1.md` §4 | Rollen, J17-Grundpalette, Story-Tint leicht | Regel (Zusammenfassung) |
| 10 | `KFB_HUB/30_DECISIONS/DECISIONS.md` | V-010, V-011, V-051, V-102, V-174, V-245, V-270, V-286 | Register |
| 11 | `KFB_HUB/30_DECISIONS/replies/donors/storymode.v4.js` · Blob `58a79133` (Original FrankenStein Lab Duo Tone v1) | 6 Modi base/accent + Formeln | **kanonisch für Tint** |
| 12 | Repo main `travel/KFB Travel Combat v25/terrain-v25/world-context.js` · @`7d6a8496e` · Blob `478e8cb4` | Modi ink/panel („Rules Print v4“), `STORY_PALETTES`, `glowOf`, `paletteFromVector` | konkurrierend (ABSURD) |
| 13 | Repo main `travel/KFB Travel Combat v25/terrain-v25/world-palettes.js` · Blob `f6121ae4` (= travel-v16) | 8 Stimmungs-Paletten (3 Stufen) | **abgelöst als Bühnenquelle** durch V-270 |
| 14 | Repo main `tools/KFB-ToolBox/_inbox/KFB Clay Stage + Curtain R2 …/KFB_Clay_Stage_R2/palette-roles.js` · Blob `fd13480d` (R1: `a3e31bf3`) | Bühnen-Rollen aus 3 Stufen + Akzent | **abgelöst als Farbquelle** (V-270); Formel-Vorlage Lichter |
| 15 | Repo main `tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/lab-v9/cologne-palette.v1.js` · Blob `38246785` | OKLCH-Paletten-Würfel `kfb-palette/v1` | Spender für Generator (nicht im Register) |
| 16 | Repo `ws1/r3f-frame` `ws1/kfb-planet/src/stagePalette.js` · Blob `4cfb5123`; `src/vendor/palette/*`, `SOURCE.md` | WS1-Umsetzung V-270 | Ist-Stand WS1 |
| 17 | Repo `ws1/r3f-frame` `WS1_STATUS.md` §28.2, §34, §36 | WS1-Bericht, Georgs Urteil, Fragen an WS0 | Bericht |
| 18 | Lab `src/sky/vendor/travel/globe-v13/sky-presets.js` | Material harmonisieren, Licht nicht (Georg 30.8.) | Regel (Spender) |
| 19 | RollerCoaster v8 `v6/docs/deep_specs/04_CEL_SHADING_shadow_lighting.md` (Frizzlebob fractal almanac BRIEFING anchor v2) | Cel-Bänder, Schatten getönt, Rim = Mode-Ink | historisch (Juli), nicht Register |
| 20 | Lab `docs/story/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md` | High-/Low-Vibrational-Fluff als Story-Sprache, ohne Farben | Kontext, keine Werte |

---

## 4 · Widersprüche und wer gewinnt

| # | Widerspruch | Gewinner laut Register |
|---|---|---|
| K1 | **Story-Mode ABSURD:** `storymode.v4.js` Ocker (`#f5e6be` / `#b8901d`, gemessen an der Website) gegen `world-context.js` Magenta (`#9a4f86` / `#efe0ec`, „Rules Print v4“). Die anderen fünf Modi liegen im Farbton nahe beieinander (z. B. Tragic `#34566b` / `#3e6a83`). | **Kein Register-Eintrag.** Arbeitsstand: `storymode.v4.js` (von WS0 an WS1 gegeben, V-270-Umsetzung). Entscheidung Georg (G-3). |
| K2 | WS1 hat `palettes.ts` vom 11.10. vendored: ASPHALT `#545e7a`, BANDE rot `#d73d30` / weiß `#eee9dc`. | **V-174 / V-102:** Fahrbahn `#3d4a60` (±12 %), Bande `#ef5a22`. WS1 muss nachziehen, sobald Strecke/Banden in WS1 sichtbar werden. |
| K3 | V-245 (Stimmungs-Paletten `world-palettes.js` + `palette-roles.js`) gegen V-270 (Joyride-Paletten mit Rollen). | **V-270** (Paletten sind Harmonie-Systeme). |
| K4 | V-270 (Rollen auf das Amphitheater) gegen V-286 (Meshy-Textur nur sanft tönen). | **V-286** ersetzt V-270 an dieser Stelle. |
| K5 | V-010 Wortlaut „rote Banden, orange Fahrbahn“ gegen J17-Bau. | **V-102** (schieferblau + orange Banden). |
| K6 | Fluff-Farbe: Plan R1 §2b „bunte Mischung, auch außerhalb der Insel-Palette“ gegen SPEC_ENVIRONMENT_KIT §13 / ENV_ERZAEHLRASTER „Biom-Farbe, Akzent der Farb-Grammatik“ gegen Plan R1 §2 / V-270 „Story-Tint nach Fluff-Farbschema“. | Kein Register-Wert für Fluff-Farben (V-082 TBD). Offen (G-1). |
| K7 | canyon und kfb_town haben dieselbe Akzent-Familie (`#f2b632/#ef5a22/#c4441a`). | Datenlage, kein Widerspruch zu einer Regel; Georg entscheidet, ob getrennt (G-7). |
| K8 | Cel-Shading-Konzept (Juli, harte Bänder) gegen J17-Knete (V-010). | **V-010** (J17-Look); Cel-Text nur als Ideenquelle für Schatten-Ton. |

---

## 5 · WS1 heute und was fehlt

**WS1 heute** (`ws1/r3f-frame` @`980467bf5`, `stagePalette.js`):
- Karte → Deck-Genre → eine der sechs Insel-Paletten (Tabelle `stage-palette.genre.json`, Vorschlag WS1, Rückfall `kfb_town`).
- Rollen: Billboard Rahmen `accent[0]`, Leiste `accent[2]`, Pfosten `bark[1]`; Amphitheater senkrecht `stone`, waagrecht `paved` (Anteil 0,85 über der Meshy-Textur); Himmel `sky → cloud`, Nebel `cloud`.
- Story-Modus der Karte über `world-context.js` (Kartenvektor → stärkste Dimension → Modus), Tint 12 % zum `accent` aus `storymode.v4.js`, gerade sRGB.
- Wechsel weich 1,2 s (V-011). Test `palette` 13/13 PASS.
- Georgs Urteil (§36): „eine Tönung, keine Palette“. WS1 baut Variante B (Rolle je Bühnenteil wie Joyride), ohne Tint.

**Was fehlt bzw. falsch ist:**
1. Volle Rollenvielfalt fehlt: sichtbar sind zwei bis drei Töne plus Tint statt acht und mehr wie in Joyride (WS1 §36.2).
2. V-286 noch nicht umgesetzt: Rollen liegen mit 0,85 auf der Meshy-Textur des Amphitheaters; richtig ist sanfte Tönung dort, volle Palette auf Rahmen, Requisiten, Himmel, Licht, Fluff, Figuren-Akzente.
3. Veraltete ASPHALT/BANDE-Werte (K2).
4. Kein Licht-Anteil: Sonne/Hemisphäre/Rim tragen weder Palette noch Story-Mode.
5. Keine dunkle/sattere Variante (es gibt keine Regel, G-2).
6. Kein Fluff-Farbschema (G-1); der Code-Kommentar „Story-Tint aus dem Fluff-Farbschema (storymode.v4.js)“ ist eine Gleichsetzung ohne Quelle.
7. Kein Würfel (Generator) und keine Palette je Kartenzone, nur je Deck-Genre (G-4).
8. `world-palettes.js` und `palette-roles.js` liegen weiter im Vendor-Ordner, sind aber nicht mehr Farbquelle; `palette-roles.mix` mischt linear (stärker als der Tint).

---

## 6 · Offene Lücken (keine Quelle vorhanden) · Fragen an Georg

- **G-1 Fluff-Farben nach Story-Mode:** Kein Farbschema „Fluff-Sorte × Story-Mode“ mit Werten gefunden. Wo liegt es (Datei, Chat, Bild, Website, Druck)? **Nicht fertig durchsucht** (Suche auf Anweisung abgebrochen): ganz `~/Dropbox/Mac/Documents/Codex/*/kayfabizarro-*`, die Branches `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`, `canon`, `wso/card-text-canonical` per `git grep`, der NIE-Ordner im KFB_HUB, SPinBall Wizard und die Frizzlebob-Almanach-Briefings auf „fluff colo*/Fluff-Farbe“, sowie die Herkunft von „09_MODE_COLORS_canonical“, MOOD_SKY und FRACTAL_PALETTES (RollerCoaster-Ride) und eine lokale Kopie der Story-Mode-Tabelle von kayfabizarro.pages.dev. Bis dahin: Fluff = Akzent-Rolle der Insel oder bunte Mischung (Plan §2b)?
- **G-2 Dunkle und sattere Variante:** Keine Quelle definiert sie je Palettenfarbe. Vorhanden: `ENV_ROLES`-Dunkelton (Daten), `line` aus storymode.v4, `glowOf` (satter), Cologne `chromaMood`. Welche Formel soll gelten (oder gibt es eine Datei, die WS0 nicht gefunden hat)?
- **G-3 Story-Mode ABSURD:** Ocker (Website-Messung, storymode.v4) oder Magenta („Rules Print v4“, world-context)? Am besten ein Foto der gedruckten Tabelle.
- **G-4 Würfel:** Darf der Cologne-Würfel (OKLCH-Drehung) mit Joyride-Ankern die Grundlage sein? Welche Rollen bleiben fest (Vorschlag: Fahrbahn, Pad-Gelb, Banden)?
- **G-5 Rollen je Bühnenteil:** Passt WS1s Variante B (§2.2.3) mit der V-286-Einschränkung?
- **G-6 Stärke der sanften Tönung auf Meshy-Texturen:** Gibt es einen Wert? Im Bestand steht nur der Story-Tint 12 % (Grenze ~15 %).
- **G-7 Joyride-Farbvariationen:** J17 hat genau drei Welten (canyon, bucht, otown); weitere Varianten je Palette gibt es im Bestand nicht. Sind die Lab-Ableitungen (wueste, kfb_town, protopia) gemeint, oder sollen Varianten gewürfelt werden? Sollen canyon und kfb_town eigene Akzente bekommen?
- **G-8 Story-Mode-Palette mit sechs Farben:** Es gibt je Modus nur base/accent (+ deep/light/line) bzw. drei `STORY_PALETTES`-Stufen. Wie soll der Story-Mode „differenziert“ wirken: Tönung je Rolle (z. B. Akzent stärker, Boden schwächer) oder eigene Rollen?


## Nachtrag 15.10. · Story-Mode-Farben von der Website (Georg: „hier die story modes“)
Quelle: https://kayfabizarro.pages.dev/#kfb, CSS-Variablen der Seite. Je Modus gibt es dort eine **dunkle** Farbe (Text, `--m-N`) und eine **satte** Farbe (`--w-*`). Das ist für die Story-Modes die gesuchte dunkle und sattere Variante.

| Modus | dunkel | satt |
|---|---|---|
| Tragic | #34576b | #3e6a83 |
| Comic | #5e6f33 | #7a8d4a |
| Absurd | #b8901c | #e9c14a |
| Heroic | #b35e22 | #d97c3a |
| Mystical | #5b4470 | #6b4e7d |
| Forbidden | #8f3a60 | #a64670 |

- **G-3 gelöst:** Absurd ist Ocker bzw. Gold, nicht Magenta. `world-context.js` („Rules Print v4“) ist hier überholt.
- **G-2 teilweise gelöst:** Für die Story-Modes ist die dunkle und die satte Variante damit gegeben. Für die Insel-Paletten bleibt die Frage offen. Vorschlag: dasselbe Verhältnis wie auf der Website anwenden, also aus der Palettenfarbe eine dunkle Textstufe und eine satte Leuchtstufe ableiten.
- **Fluff-Farben (G-1):** stehen nicht auf der Website. Naheliegend wäre, dass die Fluff-Sorte den Story-Mode trägt (satte Farbe für das Fell, dunkle für die Kontur). Das ist ein Vorschlag und braucht Georgs Bestätigung.
