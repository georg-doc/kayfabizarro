# kayfabizarro privat stellen · Umzugsinventar R1 · WS0 14.11.2026 (V-1740, V-1741)

Ziel: georg-doc/kayfabizarro wird privat. Danach funktionieren für Besucher und für das Spiel keine raw.githubusercontent-Links und keine GitHub-Pages-Seite mehr. Jede Abhängigkeit braucht vorher ein Ziel.

## 1 · Spiel (KFB-Stunt-Car-Race, game/integration-r2): Raw-Links auf kayfabizarro

| Datei im Spiel | Anzahl Links | Ziel |
|---|---|---|
| `src/actors/discoCast.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/assets/fx/blaster-reference-r1/SOURCE_LOCK.json` | 16 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/assets/fx/pistol-reference-r1/SOURCE_LOCK.json` | 13 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/audio/engineAudio.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/audio/songsR2.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/audio/suckAudio.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/card-edge/kfb-card-builder.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/cardImage.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/data/actors/frizzlebob.georg-2026-10-14.kfb-pets.json` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/data/characters/frizzlebob.character.json` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/data/eyes/kfb-pet-graft-driver.v4.json` | 9 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/data/npc/ra_scenes.r1.json` | 3 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/dialogText.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/m1/M1World.jsx` | 2 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/m1/locoStates.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/m2/M2Car.jsx` | 2 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/modules/amphitheater.js` | 2 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/modules/billboard.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/modules/meshyStage.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/modules/orchard3d.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/modules/vehicleLineup.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/poolReader.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/siteRaw.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/vendor/eyes/pet-library.v6.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/vendor/fb/emb/petstudio-v9/studio-v3/pet-mouth.v1.js` | 3 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/vendor/fb/kfb-lib/hair-tufts.v1.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/vendor/sky3/skydome-shader.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/world/endlessVeg.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |
| `src/world/loot.js` | 1 | ins Spiel spiegeln (src/assets/kfb-mirror/, gleicher Pfad), Basis-Konstante umstellen |

Gemeinsame Basen (Pfade auf kayfabizarro): 8 gepinnte Ordner, dazu Links auf `main` (nicht gepinnt, brechen am frühesten).

Vorschlag: ein Spiegel-Skript holt jede gepinnte Datei einmal in `src/assets/kfb-mirror/<pfad>` (privat im Spiel-Repo bzw. assets/private für gekaufte Pakete, V-470) und ersetzt die Basen durch einen Import; danach Probe aller Stellen (Karten, Requisiten, Wald, Himmel, Clips, Audio).

## 2 · Öffentliche Seiten auf kayfabizarro (GitHub Pages / main)

| Bereich | Ziel |
|---|---|
| Website-Inhalte (index.html, media/kfb Karten-PDFs, Würfel) | neue KFB-Website als GPT Site (V-1736/V-1740) |
| Deck-Dossiers mit Essays (FrizzleBob/index.html, registry/assets/v1/decks) | Deck-Seiten der neuen Website (V-1741) |
| KFB Comic Card Deck Viewer v4 | als Modul der neuen Website |
| kfb-hub (stage, stunt-race, free-roam, sim-blood-3d-rbc) | private Werkbank-Site oder archivieren – Georg entscheidet |
| tools/ (world_atlas, resident_atlas, img2threejs, KFB-ToolBox, …) | private Werkbank-Sites (wie Asset Librarian) |
| travel/, overworld/, Nexus Castle, skills/ | archivieren oder private Site – Georg entscheidet |
| media/3D_Assets inkl. KayKit Mystery Series (gekauft, V-470) | privat bleiben; was das Spiel braucht, über Abschnitt 1 |

## 3 · Reihenfolge
1. Spiegel-Skript für Abschnitt 1, Spiel-Probe, Commit (WS0).
2. Neue Website live als GPT Site (Claude Design + WS0).
3. Georg entscheidet Abschnitt 2 Zeilen 4–6.
4. Repo privat stellen (Georg in den GitHub-Einstellungen).
