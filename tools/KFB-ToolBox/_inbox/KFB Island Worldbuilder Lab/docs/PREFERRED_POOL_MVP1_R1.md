# Preferred Pool MVP-1 · R1.1 (erster Durchgang + Nachträge der Steuerung)

Stand 2026-10-10 · Bau-Sitzung MVP-1 · nur sortiert, nichts kopiert, keine Repo-Änderung.

- **Quelle:** GitHub georg-doc/kayfabizarro main @ dccf75cab (#387), media/3D_Assets.
- **Methode:** nur Dateilisten (git ls-tree) und Pack- bzw. Modellnamen; keine Modelle geöffnet.
- **Formen und Maßstab:** stehen bei jeder Übernahme noch aus (Maßstab K2, Vorlage-zuerst-Zeile).
- **JSON:** PREFERRED_POOL_MVP1_R1.json (kfb.preferred-pool/1).
- **Quellen-Reihenfolge:** KayKit → Tiny Treats → Quaternius → Kenney. KFB-eigene Assets (KFB_Crown_01, KFB_Coin_01, Almanach) sind eine eigene Quelle vor KayKit.
- **Figuren:** nur Verweis auf Resident Atlas bzw. Figuren-Karte.

**Befund:**
- KayKit **Mystery Series 6** enthält fast den ganzen MVP-1-Cast samt Requisiten: Farmer_A/B, Clown, Lorekeeper, Paladin, BlackKnight, Caveman.
- **Bits Bundle 1.1** enthält Einzelteile, die sonst in keinem Pack liegen: desk, chair_desk, haybale, scarecrow, wagon_hay, sign_*, Weaponrack, Coin.

## Bewohner

### Farmer A / Farmer-Duo
- **Figur:** Resident Atlas: KayKit Mystery Series6 Farmer_A + Farmer_B; Figuren-Karte public/cards/farmer_a.card.json (Lab)
- `pitchfork` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/gltf/pitchfork.gltf`
  - Grund: Ernte-Werkzeug, gleiche Serie wie die Figur
  - Weltlogik: Der Farmer wendet das Heu und trägt die Gabel über der Schulter zum Markt.
- `wheelbarrow` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/gltf/wheelbarrow.gltf`
  - Grund: Transport Feld → Markt
  - Weltlogik: Das Duo karrt die Ernte über die Ringstraße zum Stand der Farmersfrau.
- `Basket_Mushrooms_Handle` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/5 - November 2024 - Witch/assets/obj/Basket_Mushrooms_Handle.obj`
  - Grund: Tragekorb, gefüllt
  - Weltlogik: Gesammelt am Waldrand unter der Burg, verkauft am Markt.
- `dirt_plot` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/gltf/dirt_plot.gltf`
  - Grund: Beet als Arbeitsort
  - Weltlogik: Ihr Beet am Plateau-Fuß: hier wächst, was später am Stand liegt.
- `carrot` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/gltf/carrot.gltf`
  - Grund: Ernte-Gut
  - Weltlogik: Frisch gezogen, liegt im Korb und am Stand.
- `shovel` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/shovel.gltf`
  - Grund: Graben, Pflanzen
  - Weltlogik: Mit dem Spaten wird das Beet umgegraben.
- `haybale` · KayKit_Bits_Bundle1_1.1 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Bits_Bundle1_1.1/Halloween Bits/Assets/gltf/haybale.gltf`
  - Grund: Hof-Requisit (nur im Bundle)
  - Weltlogik: Heu für die Tiere, gestapelt am Feldrand.

### Farmersfrau (Gemüsestand)
- **Figur:** LÜCKE: keine eigene Farmersfrau-Figur in Mystery Series6 (nur Farmer_A/B) – Resident Atlas klären
- `crate_carrots` · KayKit_Restaurant_Bits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/crate_carrots.gltf`
  - Grund: Gemüsekiste, gefüllt
  - Weltlogik: Die Kisten vom Feld des Duos stehen offen am Stand.
- `crate_lettuce` · KayKit_Restaurant_Bits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/crate_lettuce.gltf`
  - Grund: Gemüsekiste
  - Weltlogik: Salat vom eigenen Beet, morgens gebracht.
- `crate_potatoes` · KayKit_Restaurant_Bits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/crate_potatoes.gltf`
  - Grund: Gemüsekiste
  - Weltlogik: Kartoffeln aus der Erde unter der Burg-Anhöhe.
- `Basket_Handle` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/5 - November 2024 - Witch/assets/obj/Basket_Handle.obj`
  - Grund: Korb für Kunden
  - Weltlogik: Sie reicht den Korb über die Theke.
- `scale` · Tiny_Treats_Bakery_Interior_1.1_FREE (tinytreats)
  - Pfad: `media/3D_Assets/Tiny_Treats_Bakery_Interior_1.1_FREE/Assets/gltf/scale.gltf`
  - Grund: Waage am Stand (Tiny Treats)
  - Weltlogik: Gewogen wird ehrlich – oder auch nicht.
- `sack` · KayKit_Medieval_Hexagon_Pack_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/sack.gltf`
  - Grund: Sack mit Ware
  - Weltlogik: Saatgut und Mehl, gegen Fluff getauscht.

### Clown (Jonglage)
- **Figur:** Resident Atlas: KayKit Mystery Series6 Clown (Ordner "11 - May 2024 - Clown"); Jonglage-Laufzeit J5 clown_juggle_j5 unverändert (Masterplan §5)
- `juggling_pin_red` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/assets/gltf/juggling_pin_red.gltf`
  - Grund: Jonglierkeule (4 Farben)
  - Weltlogik: Er jongliert am Markt, bis jemand stehen bleibt – dann redet er.
- `juggling_pin_yellow` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/assets/gltf/juggling_pin_yellow.gltf`
  - Grund: zweite Farbe
  - Weltlogik: Wechselt die Farben je nach Laune des Publikums.
- `clown_ball` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/assets/gltf/clown_ball.gltf`
  - Grund: Ball für die Nummer
  - Weltlogik: Der Ball rollt manchmal den Markt hinunter (Ursache-Regel E7).
- `circus_podium` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/assets/gltf/circus_podium.gltf`
  - Grund: Bühne auf dem Markt
  - Weltlogik: Sein Podest steht mitten zwischen den Ständen.
- `balloon_dog_red` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/assets/gltf/balloon_dog_red.gltf`
  - Grund: Requisit für Kinder
  - Weltlogik: Ballontiere als Lockmittel für Zuhörer.
- `circus_tent` · KayKit_Mixed_Bag_1_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mixed_Bag_1_FREE/Assets/gltf/circus_tent.gltf`
  - Grund: Wohnort / Kulisse
  - Weltlogik: Sein Zelt am Marktrand – er ist auf Tour hier gestrandet.

### Lorekeeper (Schreibpult, Eremiten-Hügel)
- **Figur:** Resident Atlas: KayKit Mystery Series6 Lorekeeper
- `Lorekeeper_Tome` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/1 - July 2025 - Lorekeeper/gltf/Lorekeeper_Tome.gltf`
  - Grund: sein eigenes Buch (Serie)
  - Weltlogik: Das Buch, in dem er die Golden Journey aufschreibt.
- `Lorekeeper_Staff` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/1 - July 2025 - Lorekeeper/gltf/Lorekeeper_Staff.gltf`
  - Grund: Wanderstab (Serie)
  - Weltlogik: Mit dem Stab steigt er den Eremiten-Hügel hinauf.
- `desk_decorated` · KayKit_Bits_Bundle1_1.1 (kaykit) ⚠
  - Pfad: `media/3D_Assets/KayKit_Bits_Bundle1_1.1/Furniture Bits/Assets/gltf/desk_decorated.gltf`
  - Grund: Schreibtisch als Pult-Ersatz (nur im Bundle)
  - Weltlogik: Sein Pult unter freiem Himmel; LÜCKE: echtes Stehpult fehlt.
- `journal_open` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/journal_open.gltf`
  - Grund: aufgeschlagenes Journal
  - Weltlogik: Hier notiert er, was ihm Besucher erzählen.
- `map_rolled` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/map_rolled.gltf`
  - Grund: Karte der Inseln
  - Weltlogik: Er gibt Aufträge mit einer Karte der zersprengten Erde.
- `candle_lit` · KayKit_Dungeon_Pack_1.1_FREE 2 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/candle_lit.gltf`
  - Grund: Licht am Pult
  - Weltlogik: Er schreibt bis in die Nacht.
- `OpenBook_FrizzleBobFractalAlmanac_01` · KFB (media/3D_Assets root) (kfb)
  - Pfad: `media/3D_Assets/OpenBook_FrizzleBobFractalAlmanac_01.glb`
  - Grund: eigenes KFB-Asset
  - Weltlogik: Der Almanach liegt aufgeschlagen auf dem Pult.

### Dark Knight (Wache am Tor)
- **Figur:** Resident Atlas: KayKit Mystery Series6 BlackKnight ("3 - September 2024 - Black Knight")
- `BlackKnight_Sword_Large` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/assets/gltf/BlackKnight_Sword_Large.gltf`
  - Grund: Waffe der Serie
  - Weltlogik: Er stützt sich auf das große Schwert vor dem Tor.
- `BlackKnight_Shield_Large` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/assets/gltf/BlackKnight_Shield_Large.gltf`
  - Grund: Schild der Serie
  - Weltlogik: Der Schild lehnt an der Torwand, wenn niemand kommt.
- `halberd` · KayKit_FantasyWeaponsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_FantasyWeaponsBits_1.0_FREE/Assets/gltf/halberd.gltf`
  - Grund: Torwachen-Waffe
  - Weltlogik: Die Hellebarde kreuzt er vor dem Tor, wenn jemand rein will.
- `torch` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/torch.gltf`
  - Grund: Licht am Tor
  - Weltlogik: Die Fackel am Tor brennt Tag und Nacht.
- `banner_patternA_red` · KayKit_Dungeon_Pack_1.1_FREE 2 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/banner_patternA_red.gltf`
  - Grund: Burg-Banner
  - Weltlogik: Das Banner des Königs über dem Tor.
- `Weaponrack_Decorated` · KayKit_Bits_Bundle1_1.1 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Bits_Bundle1_1.1/Prototype Bits/Assets/gltf/Weaponrack_Decorated.gltf`
  - Grund: Waffenständer (nur im Bundle)
  - Weltlogik: Seine Ersatzwaffen stehen griffbereit im Torbogen.

### Paladin oben auf der Burg = King Kayfabian (Masterplan §2: heller Paladin mit Krone)
- **Figur:** Resident Atlas: KayKit Mystery Series6 Paladin bzw. Paladin_with_Helmet; Krone KFB_Crown_01.glb (eigenes Asset)
- `KFB_Crown_01` · KFB (media/3D_Assets root) (kfb)
  - Pfad: `media/3D_Assets/KFB_Crown_01.glb`
  - Grund: die Krone (eigenes KFB-Asset)
  - Weltlogik: Die Krone macht den Paladin zum König Kayfabian.
- `paladin_hammer` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/10 - April 2024 - Paladin/assets/gltf/paladin_hammer.gltf`
  - Grund: Waffe der Serie
  - Weltlogik: Der Hammer ist eher Zepter als Waffe.
- `paladin_shield` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/10 - April 2024 - Paladin/assets/gltf/paladin_shield.gltf`
  - Grund: Schild der Serie
  - Weltlogik: Sein Wappen auf dem Schild = Wappen der Stadt.
- `paladin_book` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/10 - April 2024 - Paladin/assets/gltf/paladin_book.gltf`
  - Grund: Buch der Serie
  - Weltlogik: Gesetzbuch bzw. Regelwerk des Königs (Kayfabe).
- `Vampire_Throne` · KayKit_Mystery_Series6 (kaykit) ⚠
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/4 - October 2024 - Vampire/assets/gltf/Vampire_Throne.gltf`
  - Grund: einziger Thron im Bestand
  - Weltlogik: LÜCKE: gotischer Vampir-Thron, kein heller Königsthron – nur Platzhalter bzw. umfärben.
- `Vampire_Goblet` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/4 - October 2024 - Vampire/assets/gltf/Vampire_Goblet.gltf`
  - Grund: Kelch
  - Weltlogik: Der König prostet vom Turm herab.
- `flag_yellow` · KayKit_Medieval_Hexagon_Pack_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/flag_yellow.gltf`
  - Grund: Flagge auf der Turmspitze
  - Weltlogik: Weht über dem König, sichtbar von der Ringstraße.

### Caveman (Mine)
- **Figur:** Resident Atlas: KayKit Mystery Series6 Caveman
- `Caveman_Club` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/assets/gltf/Caveman_Club.gltf`
  - Grund: Werkzeug der Serie
  - Weltlogik: Ältester Bewohner: klopft mit der Keule Gestein ab.
- `pickaxe` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/pickaxe.gltf`
  - Grund: Mine-Werkzeug
  - Weltlogik: Die Spitzhacke hat er der Stadt abgenommen – oder umgekehrt.
- `mining_helmet` · KayKit_Mixed_Bag_1_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mixed_Bag_1_FREE/Assets/gltf/mining_helmet.gltf`
  - Grund: Grubenhelm
  - Weltlogik: Der Helm passt nicht zur Steinzeit – genau das ist der Witz.
- `Gold_Nuggets` · KayKit_ResourceBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_ResourceBits_1.0_FREE/Assets/gltf/Gold_Nuggets.gltf`
  - Grund: Ausbeute
  - Weltlogik: Das Gold, das die Stadt reich gemacht hat (Ausbeutungsgeschichte).
- `Stone_Chunks_Large` · KayKit_ResourceBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_ResourceBits_1.0_FREE/Assets/gltf/Stone_Chunks_Large.gltf`
  - Grund: Abraum
  - Weltlogik: Abraum liegt hangabwärts vor dem Mineneingang (E7).
- `Gem_Medium` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/4 - October 2024 - Vampire/assets/gltf/Gem_Medium.gltf`
  - Grund: Fund
  - Weltlogik: Ein Edelstein, den er niemandem zeigt.
- `Campfire_Logs` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/assets/gltf/Campfire_Logs.gltf`
  - Grund: Wohnspur
  - Weltlogik: Sein Feuer vor der Höhle.

## Orte

### Markt
- `building_market_red` · KayKit_Medieval_Hexagon_Pack_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/buildings/red/building_market_red.gltf`
  - Grund: Marktgebäude (Hex-Kachel, Maßstab prüfen)
  - Weltlogik: Der überdachte Stand der Farmersfrau.
- `crate_tomatoes` · KayKit_Restaurant_Bits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/crate_tomatoes.gltf`
  - Grund: Ware
  - Weltlogik: Gemüse vom Feld unter der Burg.
- `Barrel_A` · KayKit_Bits_Bundle1_1.1 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Bits_Bundle1_1.1/Prototype Bits/Assets/gltf/Barrel_A.gltf`
  - Grund: Fass (nur im Bundle)
  - Weltlogik: Wasser bzw. Most für die Händler.
- `crate_open` · KayKit_Medieval_Hexagon_Pack_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/crate_open.gltf`
  - Grund: offene Kiste
  - Weltlogik: Halb ausgeräumt, der Markt läuft.
- `bench` · Tiny_Treats_Pretty_Park_1.0_FREE (tinytreats)
  - Pfad: `media/3D_Assets/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/bench.gltf`
  - Grund: Sitzplatz (Tiny Treats)
  - Weltlogik: Hier sitzt das Publikum des Clowns.
- `picnic_basket_round` · Tiny_Treats_Pleasant_Picnic_1.0_FREE (tinytreats)
  - Pfad: `media/3D_Assets/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/picnic_basket_round.gltf`
  - Grund: Korb (Tiny Treats)
  - Weltlogik: Ein Einkaufskorb, vergessen auf der Bank.
- `market.gltf` · KayKit Medieval Builder Pack 1.0 (kaykit)
  - Pfad: `media/3D_Assets/KayKit Medieval Builder Pack 1.0/Models/objects/gltf/market.gltf.glb`
  - Grund: freistehender Marktstand (KayKit Medieval Builder, Legacy; Steuerung-Nachtrag)
  - Weltlogik: Der Stand der Farmersfrau – erste Wahl für Lücke 4.
- `Market Scene by Quaternius - LkNRqxdCKp` · KFB (media/3D_Assets/KFB) (quaternius)
  - Pfad: `media/3D_Assets/KFB/Market Scene by Quaternius - LkNRqxdCKp.glb`
  - Grund: Markt-Szene (Quaternius, Steuerung-Nachtrag)
  - Weltlogik: Kompositions- bzw. Stand-Kandidat, falls der KayKit-Stand nicht passt.
- `stall-red` · kenney_fantasy-town-kit_2.0 (kenney)
  - Pfad: `media/3D_Assets/kenney_fantasy-town-kit_2.0/Models/GLB format/stall-red.glb`
  - Grund: nur noch letzte Wahl (KayKit und Quaternius davor)
  - Weltlogik: Klassischer Stand mit Markise.

### Burg
- `banner_patternB_red` · KayKit_Dungeon_Pack_1.1_FREE 2 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/banner_patternB_red.gltf`
  - Grund: Banner
  - Weltlogik: Banner an der Burgmauer, Farbe der Stadt.
- `flag_red` · KayKit_Medieval_Hexagon_Pack_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/flag_red.gltf`
  - Grund: Flagge
  - Weltlogik: Flaggen auf den Türmen.
- `torch` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/torch.gltf`
  - Grund: Fackel
  - Weltlogik: Licht am Tor (Dark Knight).
- `barrier` · KayKit_Dungeon_Pack_1.1_FREE 2 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/barrier.gltf`
  - Grund: Torsperre
  - Weltlogik: Die Sperre, die der Dark Knight öffnet.
- `Weaponrack_Decorated` · KayKit_Bits_Bundle1_1.1 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Bits_Bundle1_1.1/Prototype Bits/Assets/gltf/Weaponrack_Decorated.gltf`
  - Grund: Waffenständer
  - Weltlogik: Im Torbogen.
- `stairs` · KayKit_Dungeon_Pack_1.1_FREE 2 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/stairs.gltf`
  - Grund: Treppe (Maßstab/Familie A prüfen)
  - Weltlogik: Hinweis: Plateau-Treppe ist RKIT Familie A; dies nur Innen-/Detailtreppe.

### Mine (Caveman, Plateau-Rückseite)
- `building_mine_yellow` · KayKit_Medieval_Hexagon_Pack_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/buildings/yellow/building_mine_yellow.gltf`
  - Grund: Mineneingang (Hex-Kachel, Maßstab prüfen)
  - Weltlogik: Der Stolleneingang in der Plateau-Rückseite.
- `tracks_straight` · KayKit_Holiday_Bits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Holiday_Bits_1.0_FREE/Assets/gltf/tracks_straight.gltf`
  - Grund: Gleise (Holiday-Look, umfärben)
  - Weltlogik: Die alten Lorengleise führen aus dem Stollen.
- `lantern` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/lantern.gltf`
  - Grund: Grubenlampe
  - Weltlogik: Hängt am Stolleneingang.
- `rope_bundle_A` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/rope_bundle_A.gltf`
  - Grund: Seil
  - Weltlogik: Zum Abseilen in den Schacht.
- `Pallet_Wood_Covered_A` · KayKit_ResourceBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_ResourceBits_1.0_FREE/Assets/gltf/Pallet_Wood_Covered_A.gltf`
  - Grund: abgedeckte Lieferung
  - Weltlogik: Was die Stadt aus der Mine holt.
- `Iron_Nuggets` · KayKit_ResourceBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_ResourceBits_1.0_FREE/Assets/gltf/Iron_Nuggets.gltf`
  - Grund: Erz
  - Weltlogik: Liegt neben dem Gleis.
- `wood-support` · kenney_mini-dungeon (kenney) ⚠
  - Pfad: `media/3D_Assets/kenney_mini-dungeon/Models/GLB format/wood-support.glb`
  - Grund: Stollen-Stützbalken; LÜCKE KayKit (Kenney letzte Wahl)
  - Weltlogik: Hält den Stolleneingang offen.

### Eremiten-Hügel (Lorekeeper)
- `Tent` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2025 - Hiker/assets/gltf/Tent.gltf`
  - Grund: Wohnort
  - Weltlogik: Sein Zelt auf dem Hügel – er wohnt, wo er schreibt.
- `Campfire_Base` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/assets/gltf/Campfire_Base.gltf`
  - Grund: Feuerstelle
  - Weltlogik: Abends erzählt er am Feuer.
- `Table_Small` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/5 - November 2024 - Witch/assets/gltf/Table_Small.gltf`
  - Grund: Beistelltisch
  - Weltlogik: Für Tee und Besucher.
- `chair_desk_A` · KayKit_Bits_Bundle1_1.1 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Bits_Bundle1_1.1/Furniture Bits/Assets/gltf/chair_desk_A.gltf`
  - Grund: Stuhl am Pult
  - Weltlogik: Sein Platz am Pult.
- `book_set` · KayKit_Furniture_Bits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Furniture_Bits_1.0_FREE/Assets/gltf/book_set.gltf`
  - Grund: Bücherstapel
  - Weltlogik: Bücher stapeln sich neben dem Pult.
- `lantern` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/lantern.gltf`
  - Grund: Laterne
  - Weltlogik: Laterne am Pfad hinauf – Wegweiser für Besucher.

### Teich
- `waterlily_A` · KayKit_Medieval_Hexagon_Pack_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/nature/waterlily_A.gltf`
  - Grund: Seerose
  - Weltlogik: Seerosen am ruhigen Ufer.
- `waterplant_B` · KayKit_Medieval_Hexagon_Pack_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/nature/waterplant_B.gltf`
  - Grund: Wasserpflanze
  - Weltlogik: Schilf am Ufer, wo die Fische stehen.
- `bucket_water` · KayKit_Medieval_Hexagon_Pack_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/bucket_water.gltf`
  - Grund: Eimer
  - Weltlogik: Der Farmer holt hier Gießwasser.
- `bucket_metal` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/bucket_metal.gltf`
  - Grund: Fang-Eimer
  - Weltlogik: Später: Fang beim Fluff-Angeln.
- `Lilypad` · Ultimate Nature Pack by Quaternius(1) (quaternius)
  - Pfad: `media/3D_Assets/Ultimate Nature Pack by Quaternius(1)/FBX/Lilypad.fbx`
  - Grund: Seerosenblatt (Quaternius)
  - Weltlogik: Großes Blatt, auf dem ein Frosch säße.
- `Grass_2_A_Color1` · KayKit_Forest_Nature_Pack_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Grass_2_A_Color1.gltf`
  - Grund: Ufergras (KayKit)
  - Weltlogik: Gras am Ufer, vom Wasser gewachsen.

### Ringstraße
- `sign_both` · KayKit_Bits_Bundle1_1.1 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Bits_Bundle1_1.1/Halloween Bits/Assets/gltf/sign_both.gltf`
  - Grund: Wegweiser (nur im Bundle)
  - Weltlogik: Zeigt zur Brücke nach Protopia und zur Burg.
- `street_lantern` · Tiny_Treats_Pretty_Park_1.0_FREE (tinytreats)
  - Pfad: `media/3D_Assets/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/street_lantern.gltf`
  - Grund: Straßenlaterne (Tiny Treats)
  - Weltlogik: Laternen säumen die Ringstraße.
- `post_lantern` · KayKit_HalloweenBits (kaykit)
  - Pfad: `media/3D_Assets/KayKit_HalloweenBits/Assets/gltf/post_lantern.gltf`
  - Grund: Laternenpfahl (Alternative)
  - Weltlogik: Holzpfahl mit Laterne – Kandidat für den Rand-Rhythmus.
- `bench` · KayKit_City_Builder_Bits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/bench.gltf`
  - Grund: Bank
  - Weltlogik: Rastplatz an der Kante mit Blick auf die Inseln.
- `cone` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/2 - August 2023 - Driver/assets/gltf/cone.glb`
  - Grund: Pylon (Baustelle/Satire)
  - Weltlogik: Wo die Straße noch gebaut wird.

### Brückenkopf
- `building_bridge_A` · KayKit_Medieval_Hexagon_Pack_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/buildings/neutral/building_bridge_A.gltf`
  - Grund: Brücken-Referenz (Hex; Bau ist RKIT)
  - Weltlogik: Nur Formreferenz – die Brücke selbst baut RKIT.
- `sign_right` · KayKit_Bits_Bundle1_1.1 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Bits_Bundle1_1.1/Halloween Bits/Assets/gltf/sign_right.gltf`
  - Grund: Wegweiser
  - Weltlogik: Hier geht es nach Protopia.
- `street_lantern` · Tiny_Treats_Pretty_Park_1.0_FREE (tinytreats)
  - Pfad: `media/3D_Assets/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/street_lantern.gltf`
  - Grund: Laterne
  - Weltlogik: Laternen an beiden Brückenköpfen.
- `banner_patternA_yellow` · KayKit_Dungeon_Pack_1.1_FREE 2 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/banner_patternA_yellow.gltf`
  - Grund: Banner
  - Weltlogik: Die Stadt markiert ihre Grenze.

## Activities

### Schreiben / Lesen
- `journal_open` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/journal_open.gltf`
  - Grund: aufgeschlagen
  - Weltlogik: Lorekeeper schreibt.
- `pencil_A_short` · KayKit_RPGToolsBits_1.0_FREE (kaykit) ⚠
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/pencil_A_short.gltf`
  - Grund: Stift (Ersatz für Feder)
  - Weltlogik: LÜCKE: Federkiel + Tintenfass fehlen im Bestand.
- `map` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/map.gltf`
  - Grund: Karte
  - Weltlogik: Aufträge werden auf der Karte gezeigt.
- `magnifying_glass` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/magnifying_glass.gltf`
  - Grund: Lupe
  - Weltlogik: Lesen der kleinen Schrift im Almanach.
- `Lorekeeper_Tome` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/1 - July 2025 - Lorekeeper/gltf/Lorekeeper_Tome.gltf`
  - Grund: Buch
  - Weltlogik: Das Hauptbuch.
- `book_single` · KayKit_Furniture_Bits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Furniture_Bits_1.0_FREE/Assets/gltf/book_single.gltf`
  - Grund: Einzelbuch
  - Weltlogik: Ein Buch, das ein Besucher liest.

### Jonglieren
- `juggling_pin_blue` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/assets/gltf/juggling_pin_blue.gltf`
  - Grund: Keule
  - Weltlogik: Clown am Markt (J5-Laufzeit).
- `juggling_pin_green` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/assets/gltf/juggling_pin_green.gltf`
  - Grund: Keule
  - Weltlogik: dto.
- `clown_ball` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/assets/gltf/clown_ball.gltf`
  - Grund: Ball
  - Weltlogik: dto.
- `circus_hoop` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/assets/gltf/circus_hoop.gltf`
  - Grund: Reifen
  - Weltlogik: Zugabe-Nummer.
- `balloon_red` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/assets/gltf/balloon_red.gltf`
  - Grund: Ballon
  - Weltlogik: Belohnung für Zuschauer.

### Wache
- `halberd` · KayKit_FantasyWeaponsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_FantasyWeaponsBits_1.0_FREE/Assets/gltf/halberd.gltf`
  - Grund: Hellebarde
  - Weltlogik: Dark Knight am Tor.
- `spear_A` · KayKit_FantasyWeaponsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_FantasyWeaponsBits_1.0_FREE/Assets/gltf/spear_A.gltf`
  - Grund: Speer
  - Weltlogik: Zweite Wache (später).
- `BlackKnight_Shield` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/assets/gltf/BlackKnight_Shield.gltf`
  - Grund: Schild
  - Weltlogik: Dark Knight.
- `torch` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/torch.gltf`
  - Grund: Fackel
  - Weltlogik: Nachtwache.
- `Trainingdummy_Base` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/9 - March 2026 - Avian Swordsman/gltf/Trainingdummy_Base.gltf`
  - Grund: Übungspuppe
  - Weltlogik: Die Wache übt, wenn keiner kommt.

### Ernte
- **Animationen:** KayKit_Character_Animations_1.1.zip → Rig_Medium_Tools.glb: Dig, Digging, Work_A, Working_A, Holding_A
- `pitchfork` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/gltf/pitchfork.gltf`
  - Grund: Gabel
  - Weltlogik: Farmer-Duo.
- `wheelbarrow` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/gltf/wheelbarrow.gltf`
  - Grund: Schubkarre
  - Weltlogik: Transport zum Markt.
- `dirt_plot` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/gltf/dirt_plot.gltf`
  - Grund: Beet
  - Weltlogik: Arbeitsort.
- `lettuce` · KayKit_Mystery_Series6 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/gltf/lettuce.gltf`
  - Grund: Ernte-Gut
  - Weltlogik: Liegt im Beet bzw. Korb.
- `scarecrow` · KayKit_Bits_Bundle1_1.1 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Bits_Bundle1_1.1/Halloween Bits/Assets/gltf/scarecrow.gltf`
  - Grund: Vogelscheuche (nur im Bundle)
  - Weltlogik: Schützt das Beet am Plateau-Fuß.
- `wagon_hay` · KayKit_Bits_Bundle1_1.1 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Bits_Bundle1_1.1/Halloween Bits/Assets/gltf/wagon_hay.gltf`
  - Grund: Heuwagen (nur im Bundle)
  - Weltlogik: Großernte.
- `watering_can_A` · Tiny_Treats_House_Plants_1.0_FREE 2 (tinytreats)
  - Pfad: `media/3D_Assets/Tiny_Treats_House_Plants_1.0_FREE 2/Assets/gltf/watering_can_A.gltf`
  - Grund: Gießkanne (Tiny Treats)
  - Weltlogik: Gießen mit Teichwasser.

### Handel am Stand
- **Animationen:** KayKit_Character_Animations_1.1.zip → Rig_Medium_Tools.glb: Holding_B, Work_B, Working_B
- `crate_onions` · KayKit_Restaurant_Bits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/crate_onions.gltf`
  - Grund: Ware
  - Weltlogik: Farmersfrau.
- `scale` · Tiny_Treats_Bakery_Interior_1.1_FREE (tinytreats)
  - Pfad: `media/3D_Assets/Tiny_Treats_Bakery_Interior_1.1_FREE/Assets/gltf/scale.gltf`
  - Grund: Waage
  - Weltlogik: Abwiegen.
- `KFB_Coin_01` · KFB (media/3D_Assets root) (kfb)
  - Pfad: `media/3D_Assets/KFB_Coin_01.glb`
  - Grund: Münze (eigenes KFB-Asset)
  - Weltlogik: Bezahlt wird in Fluff bzw. Münzen.
- `Coin_A` · KayKit_Bits_Bundle1_1.1 (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Bits_Bundle1_1.1/Prototype Bits/Assets/gltf/Coin_A.gltf`
  - Grund: Münze (KayKit)
  - Weltlogik: Wechselgeld auf der Theke.
- `pastry_stand_A_covered` · Tiny_Treats_Bakery_Interior_1.1_FREE (tinytreats)
  - Pfad: `media/3D_Assets/Tiny_Treats_Bakery_Interior_1.1_FREE/Assets/gltf/pastry_stand_A_covered.gltf`
  - Grund: Auslage (Tiny Treats)
  - Weltlogik: Brot vom Bäcker nebenan.
- `sack` · KayKit_Medieval_Hexagon_Pack_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/sack.gltf`
  - Grund: Sack
  - Weltlogik: Tauschware.

### Graben in der Mine
- **Animationen:** KayKit_Character_Animations_1.1.zip → Rig_Medium_Tools.glb: Pickaxe, Pickaxing, Dig, Digging
- `pickaxe` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/pickaxe.gltf`
  - Grund: Spitzhacke
  - Weltlogik: Caveman.
- `shovel` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/shovel.gltf`
  - Grund: Schaufel
  - Weltlogik: Abraum wegschaufeln.
- `mining_helmet` · KayKit_Mixed_Bag_1_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Mixed_Bag_1_FREE/Assets/gltf/mining_helmet.gltf`
  - Grund: Helm
  - Weltlogik: Caveman.
- `Stone_Chunks_Small` · KayKit_ResourceBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_ResourceBits_1.0_FREE/Assets/gltf/Stone_Chunks_Small.gltf`
  - Grund: Gestein
  - Weltlogik: Liegt unter dem Abbau (E7).
- `Gold_Nugget_Small` · KayKit_ResourceBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_ResourceBits_1.0_FREE/Assets/gltf/Gold_Nugget_Small.gltf`
  - Grund: Gold
  - Weltlogik: Ausbeute.
- `bucket_metal` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/bucket_metal.gltf`
  - Grund: Eimer
  - Weltlogik: Für Wasser aus dem Stollen.

### Fluff-Angeln (später)
- **Animationen:** KayKit_Character_Animations_1.1.zip → Animations/gltf/Rig_Medium/Rig_Medium_Tools.glb: Fishing_Cast, Fishing_Idle, Fishing_Bite, Fishing_Tug, Fishing_Reeling, Fishing_Struggling, Fishing_Catch
- `bucket_metal` · KayKit_RPGToolsBits_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/bucket_metal.gltf`
  - Grund: Fang-Eimer
  - Weltlogik: Der Fluff-Fang landet im Eimer.
- `rope_bundle_B` · KayKit_RPGToolsBits_1.0_FREE (kaykit) ⚠
  - Pfad: `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/rope_bundle_B.gltf`
  - Grund: Schnur-Ersatz
  - Weltlogik: LÜCKE: kein Angel-Mesh im Bestand. Georgs Angel = KayKit Character Animations 1.1 Rig_Medium_Tools: 7 Fishing-Clips (Cast, Idle, Bite, Tug, Reeling, Struggling, Catch), nur Animation, kein Mesh.
- `campfire-fishing-stand` · kenney_survival-kit (kenney)
  - Pfad: `media/3D_Assets/kenney_survival-kit/Models/GLB format/campfire-fishing-stand.glb`
  - Grund: Angel-Gestell (Kenney, letzte Wahl)
  - Weltlogik: Einziges Angel-Objekt im Bestand.
- `waterlily_B` · KayKit_Medieval_Hexagon_Pack_1.0_FREE (kaykit)
  - Pfad: `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/nature/waterlily_B.gltf`
  - Grund: Angelplatz
  - Weltlogik: Geangelt wird zwischen den Seerosen am Teich.

## Lücken

- Farmersfrau (Gemüsestand): Figur – LÜCKE: keine eigene Farmersfrau-Figur in Mystery Series6 (nur Farmer_A/B) – Resident Atlas klären
- Lorekeeper (Schreibpult, Eremiten-Hügel): desk_decorated – Sein Pult unter freiem Himmel; LÜCKE: echtes Stehpult fehlt.
- Paladin oben auf der Burg = King Kayfabian (Masterplan §2: heller Paladin mit Krone): Vampire_Throne – LÜCKE: gotischer Vampir-Thron, kein heller Königsthron – nur Platzhalter bzw. umfärben.
- Mine (Caveman, Plateau-Rückseite): wood-support – Stollen-Stützbalken; LÜCKE KayKit (Kenney letzte Wahl)
- Schreiben / Lesen: pencil_A_short – LÜCKE: Federkiel + Tintenfass fehlen im Bestand.
- Fluff-Angeln (später): rope_bundle_B – LÜCKE: kein Angel-Mesh im Bestand. Georgs Angel = KayKit Character Animations 1.1 Rig_Medium_Tools: 7 Fishing-Clips (Cast, Idle, Bite, Tug, Reeling, Struggling, Catch), nur Animation, kein Mesh.

## Änderungen R1.1

- R1.1 (Steuerung): Marktstand-Kandidaten KayKit Medieval Builder market.gltf.glb und KFB/Market Scene by Quaternius vor Kenney
- R1.1: Angel = KayKit Character Animations 1.1 Rig_Medium_Tools, 7 Fishing-Clips (kein Mesh); Tools-Clips (Dig, Pickaxe, Work, Holding) bei Ernte, Graben, Handel eingetragen

## Nächste Schritte (Vorschlag, nichts davon gebaut)

1. **Formen prüfen:** contents.png je Pack bzw. Mystery-Ordner ansehen (Clown, Black Knight, Lorekeeper, Paladin, Caveman, Farmer), dann Maßstab gegen K2.
2. **Lücken schließen**, je nach Steuerung:
   - Farmersfrau: Resident Atlas bzw. Kostüm-Variante von Farmer_B;
   - heller Königsthron;
   - Stehpult, Federkiel und Tintenfass;
   - Angel-Mesh (die Animationen sind da);
   - Lore und Stützbalken.
   Quellen: Quaternius MegaKit (Download-OK steht aus), bauarm selbst, oder Kenney.
3. **Kostüm-Logik** (Masterplan §2, Cast-Serie): eine Figur, je Welt andere Requisiten, über die Figuren-Karte.