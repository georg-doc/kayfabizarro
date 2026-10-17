# Kayfabrick bots, harvest combat and costume details R1 (Georg 17.10., V-426)

Assets (Georg's selection "Selection v5", registry paths on main):
- Robot `KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_Two.glb` + `assets/gltf/Robot_ChargingStation.gltf` (two colour variants in the pack)
- Mining helmet `KayKit_Mixed_Bag_1_FREE/Assets/gltf/mining_helmet.gltf`
- Action Figure `KayKit_Mystery_Series6/6 - December 2023 - Action Figure/` (character, `Grenade.gltf`, two muzzle-fire models, cigar; overview `contents.png`)
- Bombs: `11 - May 2024 - Clown/assets/gltf/clown_bomb.gltf`, `KayKit_Adventurers_2.0_FREE/Assets/gltf/smokebomb.gltf`
- Potions (Dungeon Pack legacy: large/medium/small in blue, green, red) + `5 - November 2024 - Witch/assets/gltf/Potionstation(_decorated).gltf`. WS0 assumption: magic/colour variants and the witch/alchemy fluff-recipe station (V-368). Georg confirms.

## 1 · Kayfabrick bots (Utopia construction crew)
- **Six bots**, one per fluff colour (V-368: Tragic, Comic, Absurd, Heroic, Mystical, Forbidden) as an **accent colour**. Base is Robot_Two. The charging station in matching colours.
- Optionally the **mining helmet** for construction and mining work.
- **Work kit:** clay/fluff block pieces from the KayKit set. They carry and interact **like the gift animations**.
- **Default animation, Sisyphus logic:** each bot rolls a large clay/fluff ball in its preferred colour, uphill, and the ball rolls back down. Scale the ball to the Medium/Large rig.

## 2 · Harvesting from the bot balls (uses the harvest rule V-423)
- a) 3 punches (fist / brass knuckles), or b) 2 shots (primary), or c) 1 hit with a cartoon bomb, grenade or rocket (secondary, "one-shot").
- The ball bursts, and fluff balls in the bot's colour bounce and roll into the terrain. Collect them; a collection animation plays in the HUD.
- **Then the bots get angry:** aggro/pull. The bot attacks the player, and nearby bots join in to help. This is how the **combat arena** for card zines, mobs and mini games comes about (MVP-4).

## 3 · Muzzle fire
- The Action Figure has two muzzle-fire models (Georg 17.10.): **primary** = `…/6 - December 2023 - Action Figure/assets/gltf/Muzzleflash.gltf` (small), **secondary** = `…/Muzzleflash_Long.gltf` (large/rocket). They are the default for gun/blaster, as in the combat arena.
- Variants for laser, magic and so on, as colour and VFX changes, form variants where needed.

## 4 · Banker (Monopoly cliché) as a suit variant (B12)
A slightly bent cartoon top hat, a gold monocle, a cigar (from the Action Figure), vertically striped trousers and tailcoat tails at the back.

## Licence note (WS0)
KayKit **Mystery Series** packs are purchased Patreon assets. All derivatives stay in `_privat_kauf_asset/` and never go into the public repo. The originals currently sit on `main` in the **public** repo; Georg decides (see V-426).
