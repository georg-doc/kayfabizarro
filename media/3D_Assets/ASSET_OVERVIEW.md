# Asset-Übersicht — 3D + Audio (Stand 2026-08-04)

*Inventar der lokalen Bibliothek in `3D ASSETS/`. 3D-Detail liegt im bestehenden `CATALOG/catalog.json` (via `build_catalog.py`) — das bleibt SSOT fürs 3D. **Audio war bisher nicht indexiert; dieser Teil ist neu.** Kein Per-File-Dump, sondern Pack-Ebene.*

## Kurzbild

- **~50 3D-Packs**, tausende GLB/glTF. Grob: KFB-eigene `GLB_*`, gekaufte/free **KayKit**, große **Kenney**-Kits, **Monsters**, plus `optimized/` (cel-ready).
- **~1.018 Audio-Files** (606 ogg · 400 wav · 12 mp3) in ~13 Ordnern. Kern: das **„400 Sounds Pack"** + Kenney-Audio-Sets.

---

## 3D — Packs nach Gruppe (Detail im `CATALOG/catalog.json`)

**KFB-eigene `GLB_*` (im Repo/Katalog gespiegelt):** `GLB_graveyard` (91) · `GLB_pirate` (72) · `GLB_hexagon_kit` (72) · `GLB_block_chars` (26) · `GLB_mini_chars` (26) · `GLB_cube-pets` (24) · `GLB_blocky_chars` (18) · `GLB_platformer` (5) · `GLB_mini_arcade/arena/dungeon/market` (1–2).

**KayKit (gekauft + free):** `Mystery_Series6` (14 GLB — **bereinigt, upload-ready**) · `Adventurers_2.0` (8 GLB + 31 gltf) · `Character_Animations_1.1` (16 — **Retarget-Rig**) · `Dungeon_Pack` (211 gltf) · `Medieval_Hexagon` (221) · `Forest_Nature` (84) · `RPGToolsBits` (44) · `BlockBits` (40) · `HalloweenBits` (36) · `BoardGameBits` (35) · `FantasyWeaponsBits` (31) · `Skeletons` (6 GLB + 13).

**Kenney (groß):** `nature` (329) · `coaster` (183) · `tower-defense` (160) · `platformer` (153) · `prototype` (145) · `factory` (143) · `furniture` (140) · `modular-buildings` (108) · `holiday` (99) · `graveyard` (91) · `survival` (80) · `building` (79) · `castle` (76) · `hexagon` (72) · `pirate` (72) · `city-kit ×3` · `mini-*` (20–26) · `cube-pets` (24). **Plus Staging-Dumps:** `_UPLOAD_kenney` (1.559 GLB) · `_UPLOAD_starter` (667).

**Monster/Boss-Fundus:** `Ultimate Monsters Bundle-glb` (45 GLB) · `Ultimate Monsters` (50 gltf) — plus die KayKit-Monster (Monstrosity, Orc Brute, Hoarder, Plant Warrior).

**Sonstiges:** `optimized/` (18 GLB, cel-reskin-ready — siehe `ASSETS.md`) · `3D Card Kit Fantasy` (34) · `Dice` · `Platformer Game Kit`.

---

## Audio — voller Index (neu)

| Ordner | Files | Rolle |
|---|---|---|
| **400 Sounds Pack** | 400 wav | Universelles FX-Arsenal (die 400 aus deiner Nachricht) |
| kenney_impact-sounds | 130 | Treffer/Impacts (Gutter-Fall, Hits) |
| kenney_interface-sounds | 100 | UI/HUD |
| Audio (Root) | 100 | gemischt |
| kenney_music-jingles | 86 | Win/Level-Jingles (Lootbox) |
| kenney_sci-fi-sounds | 73 | Sci-Fi-FX |
| kenney_digital-audio | 63 | Digital/Blip |
| curated | 59 | KFB-Auswahl |
| kenney_casino-audio | 55 | Coins/Chips/Ökonomie |
| kenney_rpg-audio | 52 | RPG (Loot, Zauber) |
| kenney_voiceover-pack-fighter | 47 | Kampf-Voiceover |
| KFB/Van-Metronome-Stems | 9 | Ride-Musik-Stems |

**Formate gesamt:** 606 ogg · 400 wav · 12 mp3. Für Web: ogg direkt, wav ggf. zu ogg/mp3 transkodieren (kleiner).

Passt zur `travel-audio.js`-Engine (Jukebox + sfx-Manifest): impact→`land/roll`, casino→coins, jingles→win, interface→UI.

---

## Housekeeping (Dedup-Kandidaten, viel Platz)

- **Zips neben entpackten Ordnern:** `BoardGameBits` (3×!), `Dungeon_Pack` + „ 2"-Dublette, `Medieval_Hexagon` + „ 2", `Mystery`-Zip. Nach Verifikation je eine Version behalten.
- **`KayKit_Mystery_Monthly_Series_6_(1.1)` (93 MB roh) + Zip** → können weg, sobald `KayKit_Mystery_Series6` (12 MB, bereinigt) im Repo ist.
- **`_UPLOAD_kenney` (84 MB, 1.559 GLB) + `_UPLOAD_starter`** = Staging-Dumps; kuratieren, was wirklich gebraucht wird.
- **Katalog-Abgleich:** `catalog.json` ist der 3D-SSOT, deckt aber nicht die ganze lokale Bibliothek. Vor Repo-Push je Pack einen Katalog-Eintrag (analog `GLB_graveyard`).

*Erweiterung wäre: `build_catalog.py` um einen Audio-Zweig ergänzen (Ordner→Count→Format→Tag), damit auch Sounds im Katalog/Asset-Browser auftauchen.*
