# Externe Assets (nicht im Export)

Alle Modelle lädt der Code über `RAW(pfad)`:
`https://raw.githubusercontent.com/georg-doc/kayfabizarro/<PIN>/<pfad>`
PIN in `clay-catalog.v5.js` und `brain-world.v8.js`: `2ff8b350beefe02912bbff6eeeead3882e583d08`

| Konstante | Pfad im Repo |
|---|---|
| `KIT` | `media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/` (building_A–H, streetlight, bench, bush, car_*) |
| `MS` | `media/3D_Assets/KayKit_Mystery_Series6/` (Figuren, Farmers, Caveman) |
| `ANIM` | `media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/` (Rig_Medium, Rig_Large) |

Lokale Textur: `ref/clay-joebinns/Fingerprints01_3K.png` (cgbookcase Fingerprints 01, via joebinns/clay, MIT).
Aus dem Projekt oder dem H0-Paket (`export/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/ref/clay-joebinns/`) an diesen Pfad legen.

Prüfregel aus dem Projekt: ob ein Modell existiert, per Byte-Abfrage auf den Raw-Pfad klären, nicht per Ordneransicht.
