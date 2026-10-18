# B28 · Fundstücke im Gelände (V-434) · RETURN (WSB, 2026-10-18)

**Lizenz:** nur _FREE-Packs, alle CC0 1.0. Die Dateien sind deshalb **öffentlich** (Handoff: 42 Einträge `public: true`, Gruppen `loot_<typ>`). Quell-Packs:
- KayKit (Kay Lousberg): Restaurant Bits, Resource Bits, RPG Tools Bits.
- Tiny Treats (Isa Lousberg): Baked Goods, Bakery Interior, Charming Kitchen, Pleasant Picnic.

Die Lizenzdateien habe ich in jedem Pack geprüft. Bei RPG Tools liegt sie nur im ZIP.

## Ergebnis
- **42 GLBs** `B28/KFB_Loot_<id>.r1.glb`: 30 häufige und 12 seltene Teile, je etwa 10–60 KB.

| Seltenheit | Typ | Anzahl | Teile |
|---|---|---|---|
| häufig | food | 11 | Burger, Tellergericht, Eintopf-Schale, Karotte, Tomate, Käseecke, Apfel, Sandwich, Baguette, Brezel, Marmeladenglas |
| häufig | sweet | 12 | Cupcake, Donut rosa/Schoko, Keks, Muffin, Zimtschnecke, Croissant, Erdbeertorte-Stück, Kirschkuchen-Stück, Waffel, Macaron, Windbeutel |
| häufig | drink | 7 | Getränkedose, Milchflasche, Kaffee zum Mitnehmen, Tasse rosa, Becher rot, Thermoskanne, Teekanne |
| selten | tool / prop | 12 | Riesenlöffel, Wackelhammer, Riesen-Holzhammer, Riesenlupe, Laterne, Riesenschere, Nudelholz, Topfhandschuh, Frisbee, Kofferradio, Goldklumpen, Zahnrad |

- **Je Teil:**
  - Ursprung in der **Bbox-Mitte** (V-437, siehe Nachtrag unten);
  - leerer Knoten **`KFB_Pickup`** im Ursprung als Greifpunkt (`extras.kfb.radius_u` = Aufsammel-Radius, `ground_offset_u` = halbe Höhe);
  - keine Knete, keine neue Textur (KayKit- und Tiny-Treats-Atlas unverändert).
- **Größe** in Rig_Medium-Einheiten (1 u = 0,616 m, FrizzleBob 2,94 u):
  - häufige Teile: 0,35–1,0 u (≈ 21–60 cm), bewusst cartoonig groß, damit sie am Boden und in der Hand lesbar sind;
  - seltene Teile: 0,5–1,8 u. Die „Riesen“-Werkzeuge sind übergroß (Riesenlöffel 1,8 u ≈ 1,1 m).
- **Daten:** `data/loot_items.r1.json` (`kfb.loot-items/1`). Je Teil stehen dort id, name_de, glb, rarity, type, mass_kg, size_u und size_m, Quelle (Pack, Datei, Faktor), Lizenz, Anker, Radius und sha256.

## Abnahme
Je Gruppe ein Bogen von der Bühne v1.1 (`--type prop`, alle Standard-Ansichten). Die Teile stehen dafür in einer Reihe nebeneinander (`lineup/B28_<gruppe>_lineup.glb`, nur für die Bögen):
- `renders/proof_stage/food/`, `drink/`, `sweet/`, `tool_prop/`: alle **PASS** (G2, G3 und G5 PASS).
- G4 WARN kommt von losen Kleinteilen der Packs (Burger-Lagen, Glasuren, Laternen-Glas).

## Hinweise
- **Wackelhammer:** Das Wackeln kommt zur Laufzeit (Cartoon-Deformer, V-103). Das Asset ist ein normaler Hammer.
- **Laterne und Radio:** Licht und Musik nur zur Laufzeit.
- **Eintopf:** `food_stew` statt `stew_bowl`, weil `stew_bowl` nur die Einlage ohne Schale ist.
- **ResourceBits** gibt es nur als ZIP. Ich habe zwei Modelle (Goldklumpen, Zahnrad) samt Textur in meinen Arbeitsordner entpackt. Das Original-ZIP ist unverändert.
- Skript: `scripts/b28_loot.py` (headless). Die Tabelle `ITEMS` legt Auswahl, Größe und Masse fest.

## Nachtrag 18.10. · Ursprung in der Bbox-Mitte (V-437)
Im Spiel schweben die Fundstücke auf Hüfthöhe der Medium-Figur und drehen und wippen wie die Whackman-Pickups. Fluff liegt am Boden.

- **Geprüft:** In x/z war der Ursprung schon mittig. In der Höhe lag er nach V-434 am Boden, bis zu 0,9 u unter der Mitte (Riesenlöffel). Beim Drehen um eine schräge Achse hätte das geeiert.
- **Behoben:** Alle 42 GLBs haben den Ursprung jetzt exakt in der Bbox-Mitte. Nachgemessen: die Abweichung der Mitte ist 0 auf allen Achsen, `KFB_Pickup` liegt im Ursprung.
- **Zum Hinlegen auf den Boden** um `ground_offset_u` anheben (halbe Höhe). Der Wert steht im GLB (`extras.kfb` an Teil und `KFB_Pickup`) und in `data/loot_items.r1.json` (`ground_offset_u`, `pivot`).
- Die Aufstellungs-GLBs für die Bögen heben jedes Teil um diesen Wert an und stehen weiter auf dem Boden (min y = 0).
- Das Aussehen ist unverändert, deshalb gibt es **keinen neuen Bogen**. Die vorhandenen Bögen zeigen dieselbe Anordnung, nur die sha256 der Aufstellung im Manifest stammt noch vom Stand davor.

## Nachtrag 18.10. · Georg q20 TUNE (V-443)
- **Alle 42 Teile ×1,25** (Cartoon-Logik), eingestellt über die eine Zahl `ALL_SCALE` im Skript.
  - Der Ursprung bleibt in der Bbox-Mitte.
  - `ground_offset_u` ist neu berechnet. Beispiele: Donut 0,61 u breit, Bodenabstand 0,15 u; Riesenlöffel 2,25 u hoch, Bodenabstand 1,125 u.
  - `data/loot_items.r1.json`, die GLBs und die Aufstellungen sind neu gebaut.
- **Noch nicht neu gerendert:** Laut V-443 erst mit Bühne v1.2 (Schwebe-Modus auf Hüfthöhe und Schatten-Naht-Fix V-440). Die Bögen oben zeigen deshalb noch den Stand vor ×1,25.
- Nach dem v1.2-Lauf liste ich hier jede Einzelansicht in voller Auflösung auf.

## Nachtrag 18.10. · Aufstellungen als kompaktes Raster (WS0)
`lineup/B28_<gruppe>_lineup.glb` ist jetzt ein Raster mit etwa 4:3 Grundfläche. Die Teile-GLBs selbst sind unverändert (byte-gleich).

| Gruppe | Teile | Raster | Zellabstand | Grundfläche |
|---|---|---|---|---|
| food | 11 | 4×3 | 1,84 u | 6,3 × 4,7 u |
| drink | 7 | 3×3 | 1,18 u | 3,1 × 2,9 u |
| sweet | 12 | 4×3 | 1,05 u | 3,7 × 2,7 u |
| tool_prop | 12 | 4×3 | 2,25 u | 7,5 × 5,3 u |

Der Zellabstand ist 1,5 × die größte Grundfläche der Gruppe. Alles steht auf dem Boden (min y = 0). Der Bogen folgt nach dem v1.2-Go.

## Abnahme auf Bühne v1.2 (18.10.) · 4 Raster PASS (Schweben auf Hüfthöhe automatisch über `KFB_Pickup`, V-437)
Bühne **v1.2.1** (`--stage v1.2`, kfb-stage-light.v1.1, alle Standard-Ansichten, Maßstabszelle mit FrizzleBob 1,81 m + DemonLord 2,85 m). **Diese Bilder sind privat** (DemonLord in der Maßstabszelle ist ein Kauf-Asset), die Fundstücke selbst bleiben öffentlich.

### Einzelansichten in voller Auflösung (1600 × 1200)
- `_privat_kauf_asset/renders/proof_stage_v12/drink/`: Bogen `B28_drink_lineup_contact_sheet.png` · Einzelansichten: `B28_drink_lineup_back.png`, `B28_drink_lineup_detail_low.png`, `B28_drink_lineup_detail_right.png`, `B28_drink_lineup_far.png`, `B28_drink_lineup_front.png`, `B28_drink_lineup_near_face.png`, `B28_drink_lineup_scale_ref.png`, `B28_drink_lineup_threeq.png`, `B28_drink_lineup_top.png`
- `_privat_kauf_asset/renders/proof_stage_v12/food/`: Bogen `B28_food_lineup_contact_sheet.png` · Einzelansichten: `B28_food_lineup_back.png`, `B28_food_lineup_detail_low.png`, `B28_food_lineup_detail_right.png`, `B28_food_lineup_far.png`, `B28_food_lineup_front.png`, `B28_food_lineup_near_face.png`, `B28_food_lineup_scale_ref.png`, `B28_food_lineup_threeq.png`, `B28_food_lineup_top.png`
- `_privat_kauf_asset/renders/proof_stage_v12/sweet/`: Bogen `B28_sweet_lineup_contact_sheet.png` · Einzelansichten: `B28_sweet_lineup_back.png`, `B28_sweet_lineup_detail_low.png`, `B28_sweet_lineup_detail_right.png`, `B28_sweet_lineup_far.png`, `B28_sweet_lineup_front.png`, `B28_sweet_lineup_near_face.png`, `B28_sweet_lineup_scale_ref.png`, `B28_sweet_lineup_threeq.png`, `B28_sweet_lineup_top.png`
- `_privat_kauf_asset/renders/proof_stage_v12/tool_prop/`: Bogen `B28_tool_prop_lineup_contact_sheet.png` · Einzelansichten: `B28_tool_prop_lineup_back.png`, `B28_tool_prop_lineup_detail_low.png`, `B28_tool_prop_lineup_detail_right.png`, `B28_tool_prop_lineup_far.png`, `B28_tool_prop_lineup_front.png`, `B28_tool_prop_lineup_near_face.png`, `B28_tool_prop_lineup_scale_ref.png`, `B28_tool_prop_lineup_threeq.png`, `B28_tool_prop_lineup_top.png`

Die älteren Bögen in `renders/proof_stage/` (v1.1, lange Reihe, vor ×1,25) sind überholt.

## r2 · Pack-Varianten, floatTilt, neue Raster (V-450, Georg q23 PASS mit Hinweisen) · 18.10.
- **Eigene Zusammenstellungen:** Es gab keine. „Burger“ (`food_burger`) und „Tellergericht“ (`food_dinner`, Keule mit Karotten) sind **Original-Teile** des KayKit-Restaurant-Packs.
- **Pizza:** gibt es in keinem der freien Packs.
- **Neu (Georgs Wunsch):** Pack-Varianten als Folge, Feld `variantGroup` in `data/loot_items.r2.json` (id, order, state, scale_from). Alle Varianten einer Folge haben **denselben Maßstab** wie das Ausgangsteil, damit das Stück zur Torte passt.

| variantGroup | Folge |
|---|---|
| `apple` | Apfel → Apfel angeschnitten → Apfelstück |
| `baguette` | Baguette → Baguette (halb) → Baguette-Scheibe |
| `cake_strawberry` | Erdbeertorte → Erdbeertorte angeschnitten → Erdbeertorte (Stück) |
| `dinner` | Tellergericht → Teller leer gegessen |
| `pie_cherry` | Kirschkuchen → Kirschkuchen angeschnitten → Kirschkuchen (Stück) |
| `stew` | Eintopf-Schale → Schale leer gegessen |
| `waffle` | Waffel → Waffelstapel |

- **11 neue GLBs** aus den Packs:
  - Erdbeertorte und Kirschkuchen ganz und angeschnitten;
  - Baguette halb und Scheibe;
  - Apfel angeschnitten und Stück;
  - Teller und Schale leer gegessen (`plate_dirty`, `bowl_dirty`);
  - Waffelstapel.
- **Bestand jetzt:** 41 häufig + 12 selten = 53 Teile.
- **floatTilt:** `extras.kfb.pickup.floatTilt = true` (und `floatTilt` in der Tabelle) bei Teilen, deren längste Kante mindestens doppelt so lang ist wie die zweitlängste: carrot, baguette, giant_spoon, magnifying_glass, giant_scissors, rolling_pin, baguette_half. Das GLB selbst ist nicht gedreht; das Kippen um 35° machen Bühne bzw. WS1.
- **Raster** (Varianten-Folgen nebeneinander): food 5×4 (17), drink 3×3 (7), sweet 5×4 (17), tool_prop 4×3 (12).
- **Tabelle:** `loot_items.r2.json` ersetzt r1; der Handoff verweist auf r2.

### Bühne v1.2.1 (aktuell, Schwebe-Abstand 0,15 m für alle) · 4 × PASS
- `_privat_kauf_asset/renders/proof_stage_v12_r2/drink/`: Bogen `B28_drink_lineup_contact_sheet.png` · Einzelansichten: `B28_drink_lineup_back.png`, `B28_drink_lineup_detail_low.png`, `B28_drink_lineup_detail_right.png`, `B28_drink_lineup_far.png`, `B28_drink_lineup_front.png`, `B28_drink_lineup_near_face.png`, `B28_drink_lineup_scale_ref.png`, `B28_drink_lineup_threeq.png`, `B28_drink_lineup_top.png`
- `_privat_kauf_asset/renders/proof_stage_v12_r2/food/`: Bogen `B28_food_lineup_contact_sheet.png` · Einzelansichten: `B28_food_lineup_back.png`, `B28_food_lineup_detail_low.png`, `B28_food_lineup_detail_right.png`, `B28_food_lineup_far.png`, `B28_food_lineup_front.png`, `B28_food_lineup_near_face.png`, `B28_food_lineup_scale_ref.png`, `B28_food_lineup_threeq.png`, `B28_food_lineup_top.png`
- `_privat_kauf_asset/renders/proof_stage_v12_r2/sweet/`: Bogen `B28_sweet_lineup_contact_sheet.png` · Einzelansichten: `B28_sweet_lineup_back.png`, `B28_sweet_lineup_detail_low.png`, `B28_sweet_lineup_detail_right.png`, `B28_sweet_lineup_far.png`, `B28_sweet_lineup_front.png`, `B28_sweet_lineup_near_face.png`, `B28_sweet_lineup_scale_ref.png`, `B28_sweet_lineup_threeq.png`, `B28_sweet_lineup_top.png`
- `_privat_kauf_asset/renders/proof_stage_v12_r2/tool_prop/`: Bogen `B28_tool_prop_lineup_contact_sheet.png` · Einzelansichten: `B28_tool_prop_lineup_back.png`, `B28_tool_prop_lineup_detail_low.png`, `B28_tool_prop_lineup_detail_right.png`, `B28_tool_prop_lineup_far.png`, `B28_tool_prop_lineup_front.png`, `B28_tool_prop_lineup_near_face.png`, `B28_tool_prop_lineup_scale_ref.png`, `B28_tool_prop_lineup_threeq.png`, `B28_tool_prop_lineup_top.png`

Bilder privat (DemonLord in der Maßstabszelle). Die Bögen in `proof_stage_v12/` (r1-Tabelle) sind überholt.
