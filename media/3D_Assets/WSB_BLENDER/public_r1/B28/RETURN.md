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
