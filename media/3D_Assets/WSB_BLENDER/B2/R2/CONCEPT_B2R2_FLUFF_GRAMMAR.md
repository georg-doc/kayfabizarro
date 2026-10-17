# B2-R2 · Fluff-Grammatik an Pflanzen · Konzept · WSB · 2026-10-17

**Status: KONZEPT, wartet auf Georgs Wahl der Varianten.** Additiv zur vorhandenen Environment-Recherche, keine neue Parallel-Regel. Ersetzt den abgelehnten R1-Ansatz (Abstandsregeln plus Zufallsfarbe).

## 0 · Warum R1 gescheitert ist
- **Gleichmäßige Abstände ohne Richtung und Hierarchie** (Poisson/Farthest-Point). Das ist laut `QA_RULEBOOK_ENVIRONMENT_R1.md` §6 ausdrücklich verboten („Poisson-Teppiche“). Poisson ist nur als Abstandsprüfung *innerhalb* eines Clusters erlaubt.
- **„Nachbar andersfarbig“** maximiert die Farb-Unordnung. Genau so wirkt es dann beliebig.
- Die **abgenommene Bauweise** (Georg PASS, `LAB/docs/biome-sheets/bauweise.html`) blieb unbenutzt. Dort steht der Fluff schon:
  - Am Baum: in der Krone, an der Lichtseite, 3–6 je Anker.
  - Am Strauch: 1–2 Nester, die unter den Rand greifen.
  - Am Boden: fällt, springt 2–3-mal, rollt bergab.
  - „Kein Fluff ohne Herkunft.“
- **Träger:** kahle Bäume funktionieren konstruktiv nicht.

## 1 · Eine Grammatik für alle Ebenen (Vorschlag SSOT)
Die fraktale Rule of Three der Bauweise wird um eine Ebene nach unten verlängert. Es gelten **dieselben Operatoren** von der Zone bis zur Kugel:

| Ebene | Anker | Stützen | Füller / Akzent | Quelle |
|---|---|---|---|---|
| Insel/Zone | 2–4 Gruppen | – | Negativraum ≥ 30 % | Placement Grammar R1, Etherington R2 |
| Gruppe (Bäume/Büsche) | 1 Anker 1,2–1,4 | 2–3 Stützen 0,7–0,9 | 1 Akzent | Bauweise Regel 4 |
| **Pflanze (neu)** | **1 Hero-Nest** an der Licht- bzw. Kameraseite | **0–2 Neben-Nester** | Fallobst darunter | Bauweise „Fluff (Ernte)“ |
| **Nest (neu)** | **1 große Kugel** | **~3 mittlere** | 1–5 kleine | `grounding.ts nest()`: 1 : 3 : Rest, Größe 1 : 0,62 : 0,38 |

Für alle Ebenen gemeinsam:
- **Zahlen** aus `ETHERINGTON_REGELN_IN_ZAHLEN_R1.md`: ungerade Mengen (3/5/7), nie 2 gleich große nebeneinander, Abstände der Nachbarn um ≥ 30 % verschieden, ≤ 2 auf einer Geraden, Konturen entweder ≥ 15 % überlappt oder ≥ 25 % Luft.
- **Ursache:** Fluff wächst, wo Licht ist (außen, Sonnenseite, ab ~40 % Kronenhöhe). Fallobst liegt unter bzw. hangabwärts (`rollToRest()`, Test E7).

**Größenvariation ergibt sich aus der Staffel selbst**, ohne extra Zufall. Alle Kugeln behalten denselben Wert. Wachsen heißt: Jede Kugel läuft von 0 auf ihre Staffelgröße.

**SSOT-Vorschlag an WS0 (eine Stelle):**
- Dokument: `LAB/docs/SPEC_PLACEMENT_GRAMMAR_R2.md`, Ebenen Zone → Gruppe → Pflanze → Nest.
- Code: ein Modul `LAB/src/environment/grammar.ts` mit `nest`/`fan`/`rollToRest` und einer Portierung von Travel `formation.triadeSuchen`. Terrain und Fluff rufen dieselben Funktionen. WSB liefert die Pflanzen- und Nest-Ebene zu, WS0 verankert sie.

## 2 · Farbe als Muster, nicht als Konfetti
- **Ein Nest ist einfarbig.**
- **Eine Pflanze hat eine Leitfarbe** (Hero-Nest) und höchstens **einen Akzent** (Neben-Nest).
- **Die Zone mischt** über die Pflanzen hinweg: Hauptsorte ~40 %, jede andere ≥ 8 % (V-368). „Nachbar anders“ gilt **zwischen Pflanzen**, nicht zwischen Kugeln.
- **Kontrast:** Value schlägt Hue. Comic-Oliv auf Grün (ΔE ≈ 26) braucht entweder einen Nicht-Grün-Träger (Kaktus, Sukkulente, Herbst- oder Canyon-Laub, Boden-Nest) oder eine Kontrasthilfe (dunkler Ton-Rand). Die V-292-Farbe bleibt unverändert. → **offene Entscheidung**.
- **Farbsehschwäche:** Farbe nicht als einziges Merkmal. Später ein zweites Zeichen pro Sorte (Knubbel, Glanz, Form), als Notiz für den Fluff-Look.

## 3 · Träger (Reihenfolge V-369)
1. **Büsche und Sträucher:**
   - KayKit `Bush_1–4` (22 Stück);
   - Tiny Treats Pretty Park `bush`, `bush_large`, Hecken (rund, am nächsten an Knete);
   - Quaternius `BushBerries_1/2` (der natürlichste Beeren-Träger, muss erst nach glTF konvertiert werden).
2. **Flache bzw. Coconino-Pflanzen:** Tiny Treats House Plants `cactus_A–D`, `succulent_A–D` (Kakteen tragen Fluff wie Blüten oder Früchte, passend zu Canyon und Krazy Kat), Kenney `plant_flat*` und `flower_*` (zuletzt).
3. **Runde Laubbäume:** KayKit `Tree_1`/`Tree_2`/`Tree_4` (Hero-Nest an der Lichtseite).
4. **Kahle Bäume:** **kein Fluff** (Georg). Höchstens später als dystopische Variante.
5. **Surreal/Cosmic:** Quaternius SciFi `Tree_Blob`/`Swirl`/`Spiral` sind die Herriman-nächsten Formen. Nur für Cosmic-Zonen (#388), die Lizenz ist vorher zu prüfen.

## 4 · Drei Varianten zum Vergleich (gleiche Pflanzen, gleiche Bühne)
- **A · Bauweise-Nest (kanonisch, naturnah):**
  - 1 Hero-Nest (1 groß, ~3 mittel, 1–3 klein) an der Lichtseite, auf ~⅔ Höhe an der Silhouettenkante;
  - beim Strauch greift es unter den Rand;
  - optional 1 kleineres Neben-Nest im Akzent;
  - 0–2 Fallobst-Kugeln darunter bzw. hangabwärts.
  - Wirkung: gewachsen, Beeren- bzw. Traubenlogik mit klarem Blickpunkt.
- **B · Phyllotaxis-Kappe (ornamental, Herriman):**
  - 8 oder 13 Kugeln auf einer Goldener-Winkel-Spirale (137,5°) über die Lichtkappe;
  - Größe wächst mit der Wölbung (Kusama-Logik);
  - Farbe: Leitfarbe plus ein Spiralarm im Akzent.
  - Wirkung: sichtbar „gebaut“, dekorativ, für surreale bzw. Coconino-Zonen.
- **C · Coconino-Bänder (skulptural):**
  - Kugeln ruhig verteilt (gewichtetes Lloyd), in Mulden kleiner oder ausgelassen;
  - Farbe in 2 Bändern (oben Leitfarbe, unten Akzent), wie ein Navajo-Topfmuster.
  - Wirkung: gemustertes Objekt, eher Requisite als Natur.

Empfehlung: **A als Standard** für alle Biome. **B oder C als Sonderform** einer Zone (Story-Mode Absurd/Mystical oder Canyon/Cosmic) mit sparsamem Einsatz: Hero-Pflanze, ≤ 5 % Akzent-Flora wie in der Coconino-Palette.

## 5 · Proof-Bühne (statt grauem Grund)
- **Licht:** J17 Tag (Golden), Sonne `#fff4e6` 2,9, Elevation 49°, ACES, aus `ws1/kfb-planet/src/stageLight.js` bzw. `light-presets.json`.
- **Boden:** Ton-Terrain mit leichtem Kleinrelief: `billboard-clay.js` (WS1-Laufzeit-Boden) oder dasselbe Gelände wie die LAB-Etherington-Probe, Palette Canyon oder Forest.
- **Himmel:** `skydome_a.webp`.
- **Ton:** K1 v8, Profile `nature` und `figure`.
- **Erdung:** Busch 5–12 % eingesunken, Baum 5–10 %, dunklere Erde unter der Tropfkante (Bauweise).
- **Kameras:** wie QA K-Kritiker: Auge 1 H hangabwärts, Fuß nah, 45° von oben. Dazu eine Mumie als Maßstab.
- **Szene:** eine kleine Rule-of-Three-Gruppe (1 Baum, 2 Büsche, 1 Kaktus), damit auch die Zonen-Mischung über die Pflanzen sichtbar wird.

## 6 · Offene Fragen
1. **Georg:** Welche Varianten rendern? Empfehlung A plus B.
2. **Georg/WS0:** Comic auf Grün: nur Nicht-Grün-Träger oder Kontrasthilfe?
3. **WS0:** Schreibort für die SSOT (`SPEC_PLACEMENT_GRAMMAR_R2` + `grammar.ts`) freigeben.
4. **Etherington-Originale:** `ETHERINGTON_REGELN_IN_ZAHLEN_R1.md` (inhaltlich R2) übersetzt die Tafeln in Zahlen, die Blog- bzw. Tafel-URLs habe ich aber nicht gefunden. Wenn Georg die Beiträge zu Vegetation, Früchten, Büschen und „nicht aufgeklebt“ schickt, gleiche ich die Startwerte damit ab (offene Frage 1 im Etherington-Dokument).

## Quellen (Bestand)
- `LAB` = `~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/`
- `LAB/docs/biome-sheets/bauweise.html` + `R2_bauweise.jpg` (Georg PASS)
- `LAB/docs/ETHERINGTON_REGELN_IN_ZAHLEN_R1.md`
- `LAB/docs/SPEC_PLACEMENT_GRAMMAR_R1.md`
- `LAB/docs/QA_RULEBOOK_ENVIRONMENT_R1.md`
- `LAB/docs/research/NOTEBOOKLM_P3_ERDUNG_KOMPOSITION_METRIKEN_2026-10-09.md`
- `LAB/src/environment/grounding.ts` (`nest`, `fan`, `rollToRest`)
- GH `travel/KFB Travel Globe v13-1/globe-v13/formation.js` (Rule of Three als eine Funktion)
- `KFB_HUB/30_DECISIONS/replies/FLUFF_WORLD_DRESSING_R1.md` (V-368)
- `KFB_HUB/30_DECISIONS/STYLE_GUIDE_3D_R1.md`
- `KFB_HUB/30_DECISIONS/replies/WS0_KRAZY_KAT_LIGHT_FLUFF_ACTOR_INTENT_R1_2026-10-16.md`
- Recherche WSB 17.10. (Bridson, Vogel/Fibonacci-Sphere, Thomas/Matérn, Lloyd/CVT, Kusama, Animal Crossing, Herriman): Quellen in `RESEARCH_SOURCES.md`
