# Prop-Pool R1 · Inventurkatalog / Entwurf

Stand: 28.10.2026. Keine Spielabnahme; Einbau und M5 durch WS0.

## Messung
Unveränderte measure()-Funktion aus 6742aad. Einheiten aus kfb_place.r1.json; 84/84 Forest-Referenzen exakt gleich. Quaternius: 150 BLEND-Objekte, FBX/OBJ als Formatduplikate. foot_r_m, foot_off_m und long_axis bleiben gemäß V-932 null/offen; Kern-Fallback note_v790.

## Prüfung und Grenzen
kfb_clay_bpy.apply und write_asset_pass verwendet; Tageslicht ausschließlich kfb_light_bpy.setup. Native Blender-Prüfung der Material-/Textur-/Normalen- und Knetkennzeichen; kein vollständiger JS-Proof-Stage-Lauf, keine Spielkamera-/Kritiker-Abnahme. Bilder bei fehlender oder fehlgeschlagener Eingangsprüfung zurückgehalten. Art, Biom, Ruhelage und Farbrolle sind Vorschläge. Kein Geometrieumbau.

## Packs
| Pack | Einträge | Bogen |
|---|---:|---|
| KayKit_Adventurers_2.0_FREE | 31 | sheets/b83b7177f788.png |
| KayKit_BlockBits_1.0_FREE | 40 | sheets/1ccd85c74064.png |
| KayKit_BoardGameBits_1.0_FREE | 162 | sheets/151e39dcacb1.png |
| KayKit_City_Builder_Bits_1.0_FREE | 41 | sheets/22dcb8456ba2.png |
| KayKit_Dungeon_Pack_1.1_FREE 2 | 207 | sheets/eaa91bb5f133.png |
| KayKit_FantasyWeaponsBits_1.0_FREE | 31 | sheets/9c1aa97e58eb.png |
| KayKit_Forest_Nature_Pack_1.0_FREE | 105 | sheets/cb48b78f457a.png |
| KayKit_Furniture_Bits_1.0_FREE | 53 | sheets/971571d9baca.png |
| KayKit_Medieval_Hexagon_Pack_1.0_FREE | 221 | sheets/0f1ed00fc1cf.png |
| KayKit_Mixed_Bag_1_FREE | 41 | sheets/4567d8e9c415.png |
| KayKit_RPGToolsBits_1.0_FREE | 49 | sheets/843dd2aad584.png |
| KayKit_ResourceBits_1.0_FREE | 76 | sheets/f461656ad055.png |
| KayKit_Restaurant_Bits_1.0_FREE | 144 | sheets/2e0df5e020ea.png |
| KayKit_Space_Base_Bits_1.0_FREE | 57 | sheets/3a6467ee577a.png |
| SciFI_Ultimate Space Kit_Quaternius | 80 | sheets/6bb9904267c8.png |
| Tiny_Treats_Baked_Goods_1.0_FREE | 32 | sheets/2be188d39bc8.png |
| Tiny_Treats_Bakery_Interior_1.1_FREE | 114 | sheets/a80811e662b4.png |
| Tiny_Treats_Charming_Kitchen_1.1_FREE | 118 | sheets/28d6a98d7ea0.png |
| Tiny_Treats_Homely_House_1.0_FREE | 27 | sheets/b2bbd700ec1c.png |
| Tiny_Treats_House_Plants_1.0_FREE 2 | 113 | sheets/e73ab06c07c3.png |
| Tiny_Treats_Pleasant_Picnic_1.0_FREE | 41 | sheets/fc5f77124b4f.png |
| Tiny_Treats_Pretty_Park_1.0_FREE | 28 | sheets/97ec3a97a7af.png |
| Ultimate Nature Pack by Quaternius(1) | 150 | sheets/f00f8316ea67.png |
| kenney_blaster-kit_2.1 | 40 | sheets/f545368547a6.png |

## Neue Arten
Zwei neue Arten als Vorschlag (kein Spielcode): `prop` für bewegliche Requisiten wie Bank, Kessel, Pult, Kiste und Angel, die weder Gebäude noch Vegetation oder Gestein sind; `water_plant` für Wasserpflanzen mit Wasserbezug statt der bisherigen Land-Vegetation. WS0 entscheidet über Aufnahme oder Zuordnung zu einer bestehenden Art. Verwendet: building, bush, grass, log, prop, rock, stone_L, stone_M, stone_S, tree, water_plant.

## Szenen-Requisiten
Namensbasierte Vormerkung; Sichtzuordnung offen.
- `kaykit-adventurers-2-0-free:spellbook_closed` · `media/3D_Assets/KayKit_Adventurers_2.0_FREE/Assets/gltf/spellbook_closed.gltf`
- `kaykit-adventurers-2-0-free:spellbook_open` · `media/3D_Assets/KayKit_Adventurers_2.0_FREE/Assets/gltf/spellbook_open.gltf`
- `kaykit-city-builder-bits-1-0-free:bench` · `media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/bench.gltf`
- `kaykit-dungeon-pack-1-1-free-2:barrel_large` · `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/barrel_large.gltf`
- `kaykit-dungeon-pack-1-1-free-2:barrel_large_decorated` · `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/barrel_large_decorated.gltf`
- `kaykit-dungeon-pack-1-1-free-2:barrel_small` · `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/barrel_small.gltf`
- `kaykit-dungeon-pack-1-1-free-2:barrel_small_stack` · `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/barrel_small_stack.gltf`
- `kaykit-dungeon-pack-1-1-free-2:chest` · `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/chest.gltf`
- `kaykit-dungeon-pack-1-1-free-2:chest_gold` · `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/chest_gold.gltf`
- `kaykit-dungeon-pack-1-1-free-2:crates_stacked` · `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/crates_stacked.gltf`
- `kaykit-furniture-bits-1-0-free:book_set` · `media/3D_Assets/KayKit_Furniture_Bits_1.0_FREE/Assets/gltf/book_set.gltf`
- `kaykit-furniture-bits-1-0-free:book_single` · `media/3D_Assets/KayKit_Furniture_Bits_1.0_FREE/Assets/gltf/book_single.gltf`
- `kaykit-medieval-hexagon-pack-1-0-free:barrel` · `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/barrel.gltf`
- `kaykit-medieval-hexagon-pack-1-0-free:crate_A_big` · `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/crate_A_big.gltf`
- `kaykit-medieval-hexagon-pack-1-0-free:crate_A_small` · `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/crate_A_small.gltf`
- `kaykit-medieval-hexagon-pack-1-0-free:crate_B_big` · `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/crate_B_big.gltf`
- `kaykit-medieval-hexagon-pack-1-0-free:crate_B_small` · `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/crate_B_small.gltf`
- `kaykit-medieval-hexagon-pack-1-0-free:crate_long_A` · `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/crate_long_A.gltf`
- `kaykit-medieval-hexagon-pack-1-0-free:crate_long_B` · `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/crate_long_B.gltf`
- `kaykit-medieval-hexagon-pack-1-0-free:crate_long_C` · `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/crate_long_C.gltf`
- `kaykit-medieval-hexagon-pack-1-0-free:crate_long_empty` · `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/crate_long_empty.gltf`
- `kaykit-medieval-hexagon-pack-1-0-free:crate_open` · `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/crate_open.gltf`
- `kaykit-medieval-hexagon-pack-1-0-free:tent` · `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/tent.gltf`
- `kaykit-mixed-bag-1-free:circus_tent` · `media/3D_Assets/KayKit_Mixed_Bag_1_FREE/Assets/gltf/circus_tent.gltf`
- `kaykit-mixed-bag-1-free:comicbook_A` · `media/3D_Assets/KayKit_Mixed_Bag_1_FREE/Assets/gltf/comicbook_A.gltf`
- `kaykit-mixed-bag-1-free:comicbooks_stacked` · `media/3D_Assets/KayKit_Mixed_Bag_1_FREE/Assets/gltf/comicbooks_stacked.gltf`
- `kaykit-restaurant-bits-1-0-free:crate` · `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/crate.gltf`
- `kaykit-restaurant-bits-1-0-free:crate_buns` · `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/crate_buns.gltf`
- `kaykit-restaurant-bits-1-0-free:crate_carrots` · `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/crate_carrots.gltf`
- `kaykit-restaurant-bits-1-0-free:crate_cheese` · `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/crate_cheese.gltf`
- `kaykit-restaurant-bits-1-0-free:crate_ham` · `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/crate_ham.gltf`
- `kaykit-restaurant-bits-1-0-free:crate_lettuce` · `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/crate_lettuce.gltf`
- `kaykit-restaurant-bits-1-0-free:crate_lid` · `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/crate_lid.gltf`
- `kaykit-restaurant-bits-1-0-free:crate_onions` · `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/crate_onions.gltf`
- `kaykit-restaurant-bits-1-0-free:crate_potatoes` · `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/crate_potatoes.gltf`
- `kaykit-restaurant-bits-1-0-free:crate_steak` · `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/crate_steak.gltf`
- `kaykit-restaurant-bits-1-0-free:crate_tomatoes` · `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/crate_tomatoes.gltf`
- `kaykit-rpgtoolsbits-1-0-free:lantern` · `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/lantern.gltf`
- `kenney-blaster-kit-2-1:crate-medium` · `media/3D_Assets/kenney_blaster-kit_2.1/Models/GLB format/crate-medium.glb`
- `kenney-blaster-kit-2-1:crate-small` · `media/3D_Assets/kenney_blaster-kit_2.1/Models/GLB format/crate-small.glb`
- `kenney-blaster-kit-2-1:crate-wide` · `media/3D_Assets/kenney_blaster-kit_2.1/Models/GLB format/crate-wide.glb`
- `scifi-ultimate-space-kit-quaternius:Pickup_Crate` · `media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Items/GLTF/Pickup_Crate.gltf`
- `tiny-treats-charming-kitchen-1-1-free:kettle` · `media/3D_Assets/Tiny_Treats_Charming_Kitchen_1.1_FREE/Assets/gltf/kettle.gltf`
- `tiny-treats-homely-house-1-0-free:bench_A` · `media/3D_Assets/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/bench_A.gltf`
- `tiny-treats-homely-house-1-0-free:bench_B` · `media/3D_Assets/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/bench_B.gltf`
- `tiny-treats-pretty-park-1-0-free:bench` · `media/3D_Assets/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/bench.gltf`
- `tiny-treats-pretty-park-1-0-free:street_lantern` · `media/3D_Assets/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/street_lantern.gltf`
- `kaykit_resourcebits_1.0_free:Fuel_A_Barrel` · `media/3D_Assets/KayKit_ResourceBits_1.0_FREE/Assets/gltf/Fuel_A_Barrel.gltf`
- `kaykit_resourcebits_1.0_free:Fuel_A_Barrel_Dirty` · `media/3D_Assets/KayKit_ResourceBits_1.0_FREE/Assets/gltf/Fuel_A_Barrel_Dirty.gltf`
- `kaykit_resourcebits_1.0_free:Fuel_A_Barrels` · `media/3D_Assets/KayKit_ResourceBits_1.0_FREE/Assets/gltf/Fuel_A_Barrels.gltf`
- `kaykit_resourcebits_1.0_free:Fuel_B_Barrel` · `media/3D_Assets/KayKit_ResourceBits_1.0_FREE/Assets/gltf/Fuel_B_Barrel.gltf`
- `kaykit_resourcebits_1.0_free:Fuel_B_Barrel_Dirty` · `media/3D_Assets/KayKit_ResourceBits_1.0_FREE/Assets/gltf/Fuel_B_Barrel_Dirty.gltf`
- `kaykit_resourcebits_1.0_free:Fuel_B_Barrels` · `media/3D_Assets/KayKit_ResourceBits_1.0_FREE/Assets/gltf/Fuel_B_Barrels.gltf`
- `kaykit_resourcebits_1.0_free:Fuel_C_Barrel` · `media/3D_Assets/KayKit_ResourceBits_1.0_FREE/Assets/gltf/Fuel_C_Barrel.gltf`
- `kaykit_resourcebits_1.0_free:Fuel_C_Barrel_Dirty` · `media/3D_Assets/KayKit_ResourceBits_1.0_FREE/Assets/gltf/Fuel_C_Barrel_Dirty.gltf`
- `kaykit_resourcebits_1.0_free:Fuel_C_Barrels` · `media/3D_Assets/KayKit_ResourceBits_1.0_FREE/Assets/gltf/Fuel_C_Barrels.gltf`

## Lücken
- Drei Platzierungsfelder offen gemäß V-932, für alle Einträge.
- Form-DNA-Ausschlüsse stehen in den Eintragsnotizen und erhalten keine Biome.
- Einträge mit fehlender Eingangsprüfung erhalten keine Biome.
- BLEND-Dateien benötigen für die Laufzeit noch die Übernahme durch WS0.
- Große Größenunterschiede im Pack machen kleine Requisiten im gemeinsamen Maßstab sehr klein.
- Figuren, Animationen und Format-/Farbvarianten wurden getrennt protokolliert.
- `kaykit-dungeon-pack-1-1-free-2:floor_wood_large`: floor_wood_large: Null-Normalen
- `kaykit-dungeon-pack-1-1-free-2:floor_wood_large_dark`: floor_wood_large_dark: Null-Normalen
- `kaykit-dungeon-pack-1-1-free-2:wall_doorway_Tsplit`: wall_doorway_Tsplit: Null-Normalen
- `kaykit-forest-nature-pack-1-0-free:Grass_1_Mesh`: Grass_1_Mesh: kein Quellmaterial
- `kaykit-forest-nature-pack-1-0-free:Grass_1_SingleSided_Mesh`: Grass_1_SingleSided_Mesh: kein Quellmaterial
- `kaykit-forest-nature-pack-1-0-free:Grass_2_Mesh`: Grass_2_Mesh: kein Quellmaterial
- `kaykit-forest-nature-pack-1-0-free:Grass_2_SingleSided_Mesh`: Grass_2_SingleSided_Mesh: kein Quellmaterial
- `kaykit-medieval-hexagon-pack-1-0-free:hex_river_I`: hex_river_I: Null-Normalen
- `kaykit-medieval-hexagon-pack-1-0-free:hex_road_B`: hex_road_B: Null-Normalen
- `kaykit-medieval-hexagon-pack-1-0-free:hex_road_C`: hex_road_C: Null-Normalen
- `kaykit-medieval-hexagon-pack-1-0-free:hex_road_D`: hex_road_D: Null-Normalen
- `kaykit-medieval-hexagon-pack-1-0-free:hex_road_E`: hex_road_E: Null-Normalen
- `kaykit-medieval-hexagon-pack-1-0-free:hex_road_F`: hex_road_F: Null-Normalen
- `kaykit-medieval-hexagon-pack-1-0-free:hex_road_G`: hex_road_G: Null-Normalen
- `kaykit-medieval-hexagon-pack-1-0-free:hex_road_H`: hex_road_H: Null-Normalen
- `kaykit-medieval-hexagon-pack-1-0-free:hex_road_I`: hex_road_I: Null-Normalen
- `kaykit-medieval-hexagon-pack-1-0-free:hex_road_J`: hex_road_J: Null-Normalen
- `kaykit-medieval-hexagon-pack-1-0-free:hex_road_K`: hex_road_K: Null-Normalen
- `kaykit-medieval-hexagon-pack-1-0-free:hex_road_L`: hex_road_L: Null-Normalen
- `kaykit-medieval-hexagon-pack-1-0-free:hex_road_M`: hex_road_M: Null-Normalen
- `kaykit-restaurant-bits-1-0-free:crate_lid`: Materialprüfung fehlt oder G5 nicht bestanden
- `kaykit-restaurant-bits-1-0-free:kitchencounter_innercorner_backsplash`: Materialprüfung fehlt oder G5 nicht bestanden
- `kaykit-restaurant-bits-1-0-free:kitchencounter_outercorner_backsplash`: Materialprüfung fehlt oder G5 nicht bestanden
- `kaykit-restaurant-bits-1-0-free:kitchencounter_sink_backsplash`: Materialprüfung fehlt oder G5 nicht bestanden
- `kaykit-restaurant-bits-1-0-free:kitchencounter_straight_A_backsplash`: Materialprüfung fehlt oder G5 nicht bestanden
- `kaykit-restaurant-bits-1-0-free:kitchencounter_straight_B_backsplash`: Materialprüfung fehlt oder G5 nicht bestanden
- `kaykit-restaurant-bits-1-0-free:lid_A`: Materialprüfung fehlt oder G5 nicht bestanden
- `kaykit-restaurant-bits-1-0-free:lid_B`: Materialprüfung fehlt oder G5 nicht bestanden
- `kaykit-restaurant-bits-1-0-free:lid_large`: Materialprüfung fehlt oder G5 nicht bestanden
- `kenney-blaster-kit-2-1:blaster-q`: blaster-q: Null-Normalen
- `kenney-blaster-kit-2-1:target-small`: target-small: Null-Normalen
- `tiny-treats-charming-kitchen-1-1-free:lid`: Materialprüfung fehlt oder G5 nicht bestanden
- `tiny-treats-charming-kitchen-1-1-free:wall_plain_kitchen_corner_inner`: wall_plain_kitchen_corner_inner: Null-Normalen
- `tiny-treats-charming-kitchen-1-1-free:wall_plain_kitchen_corner_outer`: wall_plain_kitchen_corner_outer: Null-Normalen
- `tiny-treats-charming-kitchen-1-1-free:wall_tiles_kitchen_corner_outer`: wall_tiles_kitchen_corner_outer: Null-Normalen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_1:BirchTree_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_2:BirchTree_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_3:BirchTree_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_4:BirchTree_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_5:BirchTree_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Autumn_1:BirchTree_Autumn_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Autumn_2:BirchTree_Autumn_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Autumn_3:BirchTree_Autumn_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Autumn_4:BirchTree_Autumn_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Autumn_5:BirchTree_Autumn_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Dead_1:BirchTree_Dead_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Dead_2:BirchTree_Dead_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Dead_3:BirchTree_Dead_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Dead_4:BirchTree_Dead_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Dead_5:BirchTree_Dead_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Dead_Snow_1:BirchTree_Dead_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Dead_Snow_2:BirchTree_Dead_Snow_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Dead_Snow_3:BirchTree_Dead_Snow_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Dead_Snow_4:BirchTree_Dead_Snow_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Dead_Snow_5:BirchTree_Dead_Snow_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Snow_1:BirchTree_Snow_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Snow_2:BirchTree_Snow_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Snow_3:BirchTree_Snow_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Snow_4:BirchTree_Snow_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BirchTree_Snow_5:BirchTree_Snow_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BushBerries_1:BushBerries_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:BushBerries_2:BushBerries_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Bush_1:Bush_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Bush_2:Bush_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Bush_Snow_1:Bush_Snow_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Bush_Snow_2:Bush_Snow_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CactusFlower_1:CactusFlower_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CactusFlowers_2:CactusFlowers_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CactusFlowers_3:CactusFlowers_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CactusFlowers_4:CactusFlowers_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CactusFlowers_5:CactusFlowers_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Cactus_1:Cactus_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Cactus_2:Cactus_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Cactus_3:Cactus_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Cactus_4:Cactus_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Cactus_5:Cactus_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_1:CommonTree_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_2:CommonTree_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_3:CommonTree_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_4:CommonTree_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_5:CommonTree_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Autumn_1:CommonTree_Autumn_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Autumn_2:CommonTree_Autumn_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Autumn_3:CommonTree_Autumn_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Autumn_4:CommonTree_Autumn_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Autumn_5:CommonTree_Autumn_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Dead_1:CommonTree_Dead_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Dead_2:CommonTree_Dead_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Dead_3:CommonTree_Dead_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Dead_4:CommonTree_Dead_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Dead_5:CommonTree_Dead_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Dead_Snow_1:CommonTree_Dead_Snow_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Dead_Snow_2:CommonTree_Dead_Snow_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Dead_Snow_3:CommonTree_Dead_Snow_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Dead_Snow_4:CommonTree_Dead_Snow_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Dead_Snow_5:CommonTree_Dead_Snow_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Snow_1:CommonTree_Snow_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Snow_2:CommonTree_Snow_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Snow_3:CommonTree_Snow_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Snow_4:CommonTree_Snow_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:CommonTree_Snow_5:CommonTree_Snow_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Corn_1:Corn_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Corn_2:Corn_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Flowers:Flowers`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Grass:Grass`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Grass_2:Grass_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Grass_Short:Grass_Short`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Lilypad:Lilypad`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PalmTree_1:PalmTree_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PalmTree_2:PalmTree_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PalmTree_3:PalmTree_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PalmTree_4:PalmTree_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PineTree_1:PineTree_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PineTree_2:PineTree_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PineTree_3:PineTree_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PineTree_4:PineTree_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PineTree_5:PineTree_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PineTree_Autumn_1:PineTree_Autumn_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PineTree_Autumn_2:PineTree_Autumn_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PineTree_Autumn_3:PineTree_Autumn_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PineTree_Autumn_4:PineTree_Autumn_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PineTree_Autumn_5:PineTree_Autumn_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PineTree_Snow_1:PineTree_Snow_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PineTree_Snow_2:PineTree_Snow_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PineTree_Snow_3:PineTree_Snow_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PineTree_Snow_4:PineTree_Snow_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:PineTree_Snow_5:PineTree_Snow_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Plant_1:Plant_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Plant_2:Plant_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Plant_3:Plant_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Plant_4:Plant_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Plant_5:Plant_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_1:Rock_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_2:Rock_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_3:Rock_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_4:Rock_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_5:Rock_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_6:Rock_6`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_7:Rock_7`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_Moss_1:Rock_Moss_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_Moss_2:Rock_Moss_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_Moss_3:Rock_Moss_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_Moss_4:Rock_Moss_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_Moss_5:Rock_Moss_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_Moss_6:Rock_Moss_6`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_Moss_7:Rock_Moss_7`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_Snow_1:Rock_Snow_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_Snow_2:Rock_Snow_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_Snow_3:Rock_Snow_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_Snow_4:Rock_Snow_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_Snow_5:Rock_Snow_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_Snow_6:Rock_Snow_6`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Rock_Snow_7:Rock_Snow_7`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:TreeStump:TreeStump`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:TreeStump_Moss:TreeStump_Moss`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:TreeStump_Snow:TreeStump_Snow`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Wheat:Wheat`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_1:Willow_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_2:Willow_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_3:Willow_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_4:Willow_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_5:Willow_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Autumn_1:Willow_Autumn_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Autumn_2:Willow_Autumn_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Autumn_3:Willow_Autumn_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Autumn_4:Willow_Autumn_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Autumn_5:Willow_Autumn_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Dead_1:Willow_Dead_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Dead_2:Willow_Dead_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Dead_3:Willow_Dead_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Dead_4:Willow_Dead_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Dead_5:Willow_Dead_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Dead_Snow_1:Willow_Dead_Snow_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Dead_Snow_2:Willow_Dead_Snow_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Dead_Snow_3:Willow_Dead_Snow_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Dead_Snow_4:Willow_Dead_Snow_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Dead_Snow_5:Willow_Dead_Snow_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Snow_1:Willow_Snow_1`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Snow_2:Willow_Snow_2`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Snow_3:Willow_Snow_3`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Snow_4:Willow_Snow_4`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:Willow_Snow_5:Willow_Snow_5`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:WoodLog:WoodLog`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:WoodLog_Moss:WoodLog_Moss`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen
- `ultimate-nature-pack-by-quaternius-1:WoodLog_Snow:WoodLog_Snow`: BLEND-Quelle: Laufzeitformat/Einbau durch WS0 offen

## Vollständigkeitsnachweis
SOURCE_COVERAGE.json führt jede Originaldatei der enthaltenen Packs auf. Nicht aufgelöste Format- und Eignungsfälle bleiben offen. KENNEY_R1.json ist die gesonderte Kenney-Liste. EXCLUSIONS.json dokumentiert Figuren, Animationen und Varianten. `tris` übernimmt unverändert das Ergebnis der Kanon-Routine (keine nachträgliche Triangulierung).

## Freigabe
Original-Proof-Stage G2/G5 steht aus. Daher Inventur-Arbeitsstand auf dem Katalog-Branch, keine Hub-Abnahme. Fehlende Arten je Biom können erst nach der Sichtzuordnung belastbar festgestellt werden; nicht als vollständig behauptet.
