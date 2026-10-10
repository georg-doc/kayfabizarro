# KayKit completion audit (2026-10-10)

Quelle: Georgs lokale ZIPs in `~/Downloads` (KayKit Bits inkl. Patreon Early Access, Character-Packs, Forest Nature, Legacy, Tiny Treats), verglichen mit `main` @ `3d597aa`.
Methode: nur ZIP-Listings (`unzip -l`) gegen `git ls-tree -l`; Vergleich über relativen Pfad im Pack, gleicher Dateiname in anderem Unterordner zählt als vorhanden; Größenabweichungen werden nur gelistet, nicht überschrieben.
Format-Konvention wie im Bits-Bundle-Branch: nur `gltf`/`glb`/`bin`, Texturen, Vorschaubilder, `License.txt`. FBX, FBX(unity), OBJ/MTL und DAE sind bewusst weggelassen (außer im Zielordner liegen sie schon). `.url`-Verknüpfungen weggelassen.
Lizenz-Gate: `License.txt` im ZIP muss CC0 nennen. Alle hochgeladenen Packs: "Creative Commons Zero, CC0" (Kay Lousberg).

## Hinzugefügt (194 Dateien, ca. 7 MB)

| ZIP | Zielordner | vorher auf GitHub | neu |
| --- | --- | ---: | ---: |
| KayKit_HalloweenBits_1.0_FREE.zip (= Halloween Bits Patreon Early Access) | KayKit_HalloweenBits | 133 | 1: `Assets/gltf/gravemarker_A.bin` (das `.gltf` lag schon da, das Modell war ohne `.bin` kaputt) |
| KayKit_Dungeon_Pack_1.1_FREE.zip | KayKit_Dungeon_Pack_1.1_FREE 2 | 438 | 8: `trunk_small_A/B/C`, `wall_arched` (gltf+bin) |
| KayKit_ResourceBits_1.0_FREE.zip | **neu:** KayKit_ResourceBits_1.0_FREE | 0 (nur das ZIP lag im Repo) | 156: 76 Modelle (gltf+bin), Textur, contents.png, License.txt |
| KayKit_Forest_Nature_Pack_1.0_FREE.zip | KayKit_Forest_Nature_Pack_1.0_FREE | 214 | 1: License.txt |
| KayKit_BoardGameBits_1.0_FREE.zip | KayKit_BoardGameBits_1.0_FREE | 351 | 1: License.txt |
| KayKit_FantasyWeaponsBits_1.0_FREE.zip | KayKit_FantasyWeaponsBits_1.0_FREE | 65 | 1: License.txt |
| KayKit_RPGToolsBits_1.0_FREE.zip | KayKit_RPGToolsBits_1.0_FREE | 107 | 1: License.txt |
| KayKit_Character_Animations_1.1.zip | KayKit_Character_Animations_1.1 | 17 | 1: License.txt |
| Prototype Bits.zip (Version 1.0, Teilmenge von 1.1) | KayKit_Bits_Bundle1_1.1/Prototype Bits | 183 | 3: License.txt, contents.png, sample.png (Vorschau der 1.0-Version) |
| KayKit Dungeon Pack 1.0.zip | KayKit Legacy/KayKit Dungeon Pack 1.0 2 | 210 | 7: `KayKit Brand Resouces/*.png` |
| KayKit Medieval Builder Pack 1.0.zip | KayKit Medieval Builder Pack 1.0 | 236 | 7: `KayKit Brand Resouces/*.png` |
| KayKit Spooktober Seasonal Pack 1.1.zip | KayKit Legacy/KayKit Spooktober Seasonal Pack 1.1 | 55 | 7: `KayKit Brand Resouces/*.png` |

## Vollständig, nichts fehlt (gltf-Konvention)

Adventurers 2.0, Skeletons 1.1, Legacy Skeletons 1.0, Character Animations 1.2 legacy, Mystery Monthly Series 5 (1.1) (liegt komplett in `KayKit_Mystery_Series6`), Bits Bundle 1.1 (alle ZIP-Dateien vorhanden), BlockBits (FREE + Patreon EA), City Builder / Furniture / Restaurant / Space Base Bits (FREE + neue Downloads 2026-10-10, inhaltlich = 1.0), Medieval Builder Pack 1.0, Medieval Hexagon Pack 1.0, Mixed Bag 1, alle 7 Tiny Treats ZIPs.
Hinweis: Die neuen "Patreon Early Access"-/"... Bits.zip"-Downloads vom 2026-10-10 sind inhaltlich die 1.0-Stände (z. B. Halloween 63 Modelle). Die Halloween-Extras (102 Modelle, 1.1) liegen bereits in `KayKit_Bits_Bundle1_1.1/Halloween Bits`.

## Größenabweichungen (nicht überschrieben)

- `License.txt` anderer Stand: BlockBits (Patreon EA 1328 B vs. 1426), City Builder (585 vs. 853), Furniture (850 vs. 860), HalloweenBits (Patreon EA 860 vs. 913), Restaurant (Patreon EA 861 vs. 897), Space Base (583 vs. 850), Mystery S5 (1583 vs. `CharacterTemplate/License.txt` 952).
- Fantasy Weapon Bits **Patreon Early Access** weicht vom Repo (= FREE 1.0) ab: `bow_B.gltf`, `bow_B_withString.gltf`, `halberd.gltf`, `halberd.bin` (vermutlich überarbeitete Modelle).
- **Verdacht auf kaputte Dateien im Repo:** `Tiny_Treats_Charming_Kitchen_1.1_FREE/Assets/gltf/stove.bin` (Repo 60 059 B vs. ZIP 61 896 B), `overview.png` (60 061 vs. 791 862), `overview_1.1.png` (60 061 vs. 928 072), `sample.png` (60 062 vs. 1 077 971). Die fast gleichen ~60-KB-Größen deuten auf Platzhalter/Fehl-Uploads hin; prüfen und ggf. aus dem ZIP ersetzen.

## Nicht hochgeladen

- **KayKit_Holiday_Bits_1.0_FREE.zip** (98 Modelle, fehlt auf GitHub komplett): enthält **keine License.txt** → Lizenz-Gate nicht bestanden. Lizenz auf der KayKit-Seite prüfen, dann nachziehen.
- DAE-Modelle der Legacy-Packs (Skeletons 1.0: 37, Dungeon 1.0: 202, Medieval Builder 1.0: 226, Spooktober 1.1: 48) und alle FBX/OBJ-Varianten: Format-Konvention.
- Keine Einzeldatei > 95 MB gefunden.
- Nicht als KayKit-Packs behandelt: `KayKit Environment Atlas (*)`, `KayKit Resident Atlas (*)`, `KayKit_Room_Study_S21.zip` (eigene Atlas-/Studien-Exporte), `KFB_ANIMATION_LAB_v2_1_KAYKIT_EXPANSION.zip`.

## Forest Nature Pack: Felsen

Lokal und auf GitHub vollständig (105 Modelle). 43 Felsmodelle in `KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/`: `Rock_1_A`–`Rock_1_Q_Color1` (17), `Rock_2_A`–`Rock_2_H_Color1` (8), `Rock_3_A`–`Rock_3_R_Color1` (18).
