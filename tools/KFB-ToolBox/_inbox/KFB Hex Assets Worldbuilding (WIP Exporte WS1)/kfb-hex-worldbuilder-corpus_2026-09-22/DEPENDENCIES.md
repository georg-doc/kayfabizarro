# DEPENDENCIES

## Extern, zur Laufzeit geladen

| Was | Von wo | Wer |
|---|---|---|
| three.js 0.184.0 + OrbitControls + GLTFLoader | `unpkg.com` | Kanten-Atlas, Baukasten, Babel, hexrealm |
| three.js 0.160.0 (+ jsm) | `cdn.jsdelivr.net` / `unpkg.com` | ältere hexrealm-Seiten, Studien |
| KFB-Rigs v3 (`mountGraft()`) | `cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/KFB-ToolBox/kfb-rigs-embed-v3/` | Babel (Figuren) |
| SkeletonUtils | `unpkg.com` | Babel |
| Google Fonts | `fonts.googleapis.com` | Studien |
| 3D-Modelle | `raw.githubusercontent.com/georg-doc/kayfabizarro/{main,8948a06}/media/3D_Assets/` | alle |
| Verzeichnislisting Quaternius | `api.github.com/repos/georg-doc/kayfabizarro/contents/` | Baukasten |

**Zwei Wege, ein Unterschied.** Module über jsDelivr, Daten über raw. raw liefert JS als
`text/plain`; als ES-Modul geladen ergibt das einen schwarzen Bildschirm ohne Fehlermeldung
im Netzwerk-Tab. Das ist Projektregel 2 und der häufigste Ausfall.

## Intern, zwischen den Paketen

| Nimmt | Von | Was |
|---|---|---|
| Baukasten S0 | `hexrealm/lib/hex-grid.js` | Kantenmasken, Straßenlöser, Hex-Gitter — **nicht nachgebaut** |
| Baukasten S0 | `registry/assets/v1/packs/*.json` | Pfade beider Packs |
| Baukasten S0 | `KFB_Free_Roam_Platformer_v1/src/lighting.js` | Licht, Schatten, Bodenkontakt — ein Besitzer |
| Kanten-Atlas S1 | `hexrealm/lib/hex-grid.js` (`TILE_EDGES`) | die bekannte Wahrheit, gegen die geeicht wird |
| Babel v1 | `KFB_Hex_Baukasten_S0` | Bauteilkunde |
| Babel v1 | `KFB_Free_Roam_Platformer_POC_v0/data/movement-config.json` | Bewegungswerte |
| Babel v1 | `lab-v6/carlrig-mount.v1.js` (`mountCarl()`) | Spielerfigur |
| Babel v1 | `tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html` | nur das UI |

**Zwei dieser Abhängigkeiten liegen NICHT in diesem Paket**, weil sie anderen Eigentümern
gehören: `lighting.js` (Platformer v1) und `movement-config.json` (POC v0). Wer das Paket
allein auspackt, sieht Baukasten und Babel mit fehlendem Licht bzw. Vorgabewerten. Beide
liegen im Repo auf `main`.

## Fehlermodi

| Symptom | Ursache |
|---|---|
| Schwarzer Bildschirm, keine Konsolenmeldung | Modul über `raw` statt jsDelivr geladen |
| Oberfläche da, keine Geometrie | kein Netz, oder raw-URL zeigt auf einen Commit, den es nicht mehr gibt |
| »0 Modelle gefunden« | `github_get_tree` statt Registry-Shard; es listet keine `.glb`/`.gltf` |
| Teile fehlen einzeln | doppelte Endung `*.gltf.glb` nur einfach abgeschnitten |
| Kapsel statt Figur | `mountCarl()` fehlgeschlagen — der Platzhalter ist als solcher gekennzeichnet, es wird **kein** Ersatzrig gebaut |
| Alle Kanten `wwwwww` | Atlas-Sonde global statt am Material — siehe PACK_TRUTH |

## Pins

| Zweck | Commit |
|---|---|
| Platformer Game Kit · Registry-Shard | `eb48f50489b9e4903ec1e3d2fb1837605ce7d792` |
| Resident-/Mystery-Figuren (Handoff) | `891eadf01e218f5fc21387e64cea1fec8332c5b6` |
| Asset-Basis einer Studie | `8948a06b75cb18c970599afb29b6a772315fad0e` |
| KayKit-Hexagon- und Builder-Pack | `main` (ungepinnt — siehe NEXT_FIVE Punkt 1) |
