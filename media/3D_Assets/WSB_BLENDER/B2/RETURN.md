# RETURN · B2 · Fluff-Anker an den KayKit-Bäumen · WSB · 2026-10-17

**Status: GEORG TUNE/REDESIGN (17.10., Chat) → B2-R2 läuft.** Diese Runde (R1) ist technisch sauber, aber gestalterisch nicht abgenommen. `kaykit-tree-fluff-anchors.v1.json` enthält 125 Anker an 20 Bäumen. Proofs in Ton, mit den sechs V-292-Farben. **Wartet auf WS0-Review.**

## Quellen
- `media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/` @ GitHub `main`: alle 20 `Tree_*` (gltf + bin) und `forest_texture.png`, 41/41 Git-Blobs byte-gleich, Kopie in `_src/`.
- **Keine Schnee-Varianten:** Auf `main` liegt nur das FREE-Pack (84 Modelle, laut Registry und `ASSET_OVERVIEW.md`). Die „211 Modelle inkl. Schnee“ in `FLUFF_WORLD_DRESSING_R1.md` sind die Zahl des **Dungeon-Packs**, das ist eine Verwechslung. Schnee bräuchte das volle KayKit Forest Nature Pack (kostenpflichtig, nicht im Repo) → **Frage an WS0**.
- Entscheidungen: V-368 (Fluff = sechs Story-Modes, überall alle Sorten), V-292 (satte Farben).

## Methode (`proof/b2.html`, three.js r180, gleiche Ton-Pipeline wie B1 / R1)
1. **Krone vs. Holz:** Farbe des Textur-Atlas am UV-Schwerpunkt jedes Dreiecks (grün → Laub). Ergebnis: 14 Laubbäume und 6 kahle (0 Laub-Dreiecke).
2. **Kandidaten:** 6000 flächengewichtete, deterministische Samples.
   - **Krone:** Normale nach außen oder oben. ≥ 1,4 R Abstand zu Knickkanten (> 25°) und offenen Rändern, also keine Kugeln an Kanten und Ecken der eckigen Kronen. Die Kugel ist zu 45 % eingebettet („wächst im Baum“).
   - **Kahl:** nur dünne Äste (lokale Dicke ≤ 0,3), weg von der Stammachse (Achse aus dem Stammfuß bestimmt). Die Kugel sitzt oben auf dem Ast bzw. in der Gabel. Hängen gibt es nur als Gag-Variante (`bareMode=hang`).
   - **Freiraum:** Ein Strahl in Anhaftungsrichtung muss 6 R frei sein.
   - **Kein Durchstoßen:** Innerhalb des Kugelradius darf Geometrie nur unterhalb der Auflagefläche liegen, Astspitzen und Kronenlappen darüber werden verworfen.
3. **Auswahl organisch:** lockere Grüppchen aus 1–2 Kugeln.
   - Abstände: Gruppenzentren ≥ 6 R, innerhalb der Gruppe 3,4–4,5 R, Füller ≥ 3,5 R.
   - Die Krone oben wird seltener belegt.
   - Anzahl auf Kronen: 3 + 0,6·√Kronenfläche, begrenzt auf 6–12.
4. **Farbregel:**
   - Nachbarn unter 4,5 R bekommen nie dieselbe Farbe.
   - Eine Farbe kommt nur dorthin, wo ihr Kontrast zur lokalen Laubfarbe ΔE ≥ 40 erreicht (CIE76).
   - Die am wenigsten benutzte Farbe kommt zuerst dran.
   - Pro Anker stehen `bgColor` und `contrastDE` aller sechs Farben im JSON, damit die Runtime die Regel bei der Zonen-Gewichtung selbst anwenden kann.
5. **Größe und Lebenszyklus:**
   - `sizeScale` 0,85–1,15 pro Anker (gleicher Wert, nur die Optik variiert).
   - `maxBallR`: größter Radius, der den Durchstoß-Test noch besteht.
   - `regrowDelayS` (20–60 s) und `dropOrder` (unten und außen zuerst) als Vorschlag für Nachwachsen und Schütteln. Der Block `lifecycle` beschreibt die Phasen grow → ripe → loosen → drop.

## Ergebnis
| | Bäume | Anker | Spanne | Mindestabstand |
|---|---|---|---|---|
| Laubbäume | 14 | 106 (`surface`) | 6–12 je Baum | 0,52–0,61 (≥ 3,4 R) |
| Kahle Bäume | 6 | 19 (`branch`) | 1–8 je Baum | ≥ 0,51 |

- **`belowMinimum` (< 6 Anker):** `Tree_Bare_1_A` (2), `Tree_Bare_1_B` (4), `Tree_Bare_2_A` (2), `Tree_Bare_2_B` (2), `Tree_Bare_2_C` (1). Das sind dünne Stangenbäume mit wenigen Ästen. Mehr ginge nur über den Boden-Nest-Fundort (V-368: Boden/Graben) statt am Baum.
- **Farbbefund:** Comic-Oliv `#7a8d4a` hat gegen das KayKit-Grün nur ΔE ≈ 26 (alle anderen 44–99). Comic steht deshalb auf keiner grünen Krone, sondern auf kahlen Bäumen, und laut V-368 auch in Boden-Nestern und Truhen. **Entscheidung offen (WS0/Georg):**
  - (a) Comic nur auf Nicht-Grün-Trägern, oder
  - (b) Comic bekommt eine Kontrasthilfe auf Grün (z. B. hellerer Ton-Rand, Glanzpunkt, kleiner Schatten-Kragen), ohne die V-292-Farbe zu ändern.
- `sizeScale` 0,854–1,149. `maxBallR` 0,17–0,35 (Median 0,35).

## Georg-Tunes (Chat, 17.10.) → umgesetzt
1. Keine Kugeln an den Kanten und Ecken der eckigen Kronen, natürlicher „im Baum wachsen“: Knickkanten-Abstand, 45 % Einbettung.
2. Organisches Verteilmuster statt gleichmäßiger Streuung: lockere Grüppchen, oben weniger.
3. Farbkombinatorik klar unterscheidbar, Grün auf Grün schwach: Nachbar- und Kontrastregel, Comic fällt von den Kronen.
4. Größenvariation plus Wachsen und Abfallen: `sizeScale`, `lifecycle`, `regrowDelayS`, `dropOrder`.
5. Keine Christbaumkugeln oder Lichterketten als Standard, Gruppen nicht zu eng: Kugeln sitzen auf den Ästen, ≥ 3,4 R Abstand.
6. Nichts darf durch die Kugel piksen, auf Astspitzen sauber sitzen: Durchstoß-Test mit Kontaktkappe.

## Dateien
- `kaykit-tree-fluff-anchors.v1.json`: Modell → Anker mit p, n, surfaceNormal, attach, ballCenter, sizeScale, maxBallR, group, bgColor, contrastDE, proofColour, regrowDelayS, dropOrder. Dazu Regeln, `lifecycle` und Quellen-Blobs.
- `data/anchors_raw.json`, `data/inspect.json`
- `renders/`
  - `B2_sheet_1.png` / `B2_sheet_2.png` (je 10 Bäume, Ton, 1920×1080)
  - `B2_hero_<Baum>_az030|az210.png` für `Tree_1_C` (rund), `Tree_2_D` (eckig), `Tree_Bare_1_B` und `Tree_Bare_1_C` (kahl)
- `proof/b2.html` + `proof/vendor/` (K1)
- `scripts/b2_build_json.py`, `scripts/wsb_proof_server.py`
- `_src/`

## NOT_RUN / offen
- Schnee-Varianten: nicht vorhanden, siehe oben.
- Büsche nicht bearbeitet (V-368 nennt Bäume *und* Büsche, Job B2 nur Bäume). Das Verfahren lässt sich direkt auf `Bush_*` anwenden.
- Lebenszyklus nur als Daten und Vorschlag, **keine Animation gebaut**. Eine Vorschau (Wachsen → Wackeln → Schütteln → Fallen) wäre ein eigener kleiner Job.
- Kugelgröße 0,15 als Annahme gesetzt (kein Maß im Fluff-Konzept). Auf 8-m-Bäumen wirkt sie klein, `maxBallR` erlaubt bis 0,35.
- Kein Gameplay- oder Performance-Test. Kein Blender-Export. Georg hat die Bögen während des Laufs gesehen, ein formales PASS steht noch aus.

## Georg-Urteil zu R1 (Chat, 17.10.)
- Auf den Kronen gibt es kein schlüssiges Verteilmuster, die Farbauswahl wirkt beliebig. Konzept und Mathematik müssen erst geklärt werden (Recherche).
- Kahle Bäume: konstruktiv schwach. Dort lieber auf Fluff verzichten (höchstens dystopische Landschaft). Stattdessen Büsche, Sträucher und flache Pflanzen.
- Noch weit weg von organischer Skulpturenlogik und surrealem Gesamtdesign (Krazy-Kat-Richtung). Farb- und Lichtstimmung schwach.
- Grauer Grund ist nicht repräsentativ: Der Einbau in die Claymation-Terrain-Texturen lässt sich so nicht beurteilen.

## Nächstes Gate (eins)
~~WS0 Comic/Schnee~~ → überholt: **B2-R2** (Konzept + 2–3 Varianten auf Ton-Terrain) → Georg wählt.
