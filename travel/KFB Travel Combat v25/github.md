repo: georg-doc/kayfabizarro
branch: main
path: media

## Last sync

date: 2026-09-09T15:39:52Z

### Updated in this project

- **`edge3.jpg`-Pfad korrigiert (v25.2s).** Der kanonische RAW-Pfad zeigte auf `media/3D_Assets/Textures/edge3.jpg` und antwortete mit 404. Die Datei liegt unter `travel/travel-v16/terrain-v16/edge3.jpg` (2543 B, im Baum bestätigt). In `voxel-terrain.js`, `hud-cube.js` und `voxel-glyphs.js` umgehängt.
- **`voxel-glyphs.js` hatte gar keinen Rückfall** — nur `new URL('./edge3.jpg', import.meta.url)`. Genau das ließ die Voxel-Glyphen im Standalone texturlos, ohne Eintrag im Log. Jetzt dieselbe Kette wie die anderen beiden: lokal zuerst, RAW als Rückfall.
- `travel/travel-v16/` als Referenz gesichtet (81 Dateien, `terrain-v16/` mit 58) — die Fassung, in der alles läuft.
- Export-Paket `export-v25/` gebaut: Codebasis + Doku + `IST_v25.md`, `SPRINT_v26.md`, `ONBOARDING_v26_frischer-Chat.md`.

## Screen map

| Screen / Modul | gebaut aus |
|---|---|
| KFB Travel Combat v25 · Props | `kfb-asset-library.json` → `kenney_nature-kit` (23) + `KayKit_Forest_Nature_Pack_1.0_FREE` (13) + `Platformer Game Kit - Dec 2021/Nature` (2) |
| KFB Travel Combat v25 · Gegner | `Ultimate Monsters Bundle-glb/Flying` (17) + `MonsterPack_Quaternius/MonsterCuteCubes` (21) + Space-Kit (3) |
| KFB Travel Combat v25 · Mech | `SciFI_Ultimate Space Kit_Quaternius/Characters/GLTF` über `mech-avatar.js` |
| KFB Travel Combat v25 · Waffen | `Dice/dice_ugur_lowpoly.glb` (Würfelwurf) · Augapfel aus `studio-v3/pet-eye-rig.v5.js` (kein Repo-Asset) |
| KFB Travel Combat v25 · HUD | `GEAR_ICON.glb` (Zahnrad) · Slot-Zeichen gemalt, keine Bilddateien |
| KFB Travel Combat v25 · Karten | `media/kfb/KayfaBizarro_Card_Backside_01_lowrez.png` |
| Icon-Sichtung (nicht verbaut) | `media/2D_Assets/RPG Icons` — 401 PNG, Kontaktblatt im Projekt |

## Hinweis zum Werkzeug (5.9.)

Die GitHub-Baumsuche dieses Chats listet **nur „importable files"** — 3D-Modelle (`.gltf`, `.glb`,
`.bin`) sind darin **nicht enthalten**. Gegentest: `Enemy_Flying.gltf` und `tree_palm*.glb`, die im
Projekt nachweislich geladen werden, liefern über dieselbe Suche 0 Treffer. Eine Abwesenheit in
dieser Liste ist deshalb **kein Beweis**, dass eine Datei fehlt — genau dieser Fehlschluss hat am
5.9. eine Runde gekostet. Wer wissen will, welche Modelle im Repo liegen, liest
`kfb-asset-library.json`.
**Am 5.9. zum zweiten Mal bestätigt:** die Suche über
`media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE` meldete vier Dateien (drei PNG, eine Textur),
die Library führt für denselben Ordner **105 `.gltf`**. Und der Umweg, der funktioniert: eine
Bilddatei DARF kopiert werden (`github_copy_files`) und ist danach ansehbar — so wurde das
Icon-Kontaktblatt geprüft, statt über 400 Dateinamen zu raten.

## Sync history

date: 2026-09-05T14:22:42Z — Prop-Set 38 Modelle, Gegner-Pool 41 Arten, RPG-Icons gesichtet (nicht verbaut), `GEAR_ICON.glb` im HUD.

date: 2026-09-05T02:28:58Z — `kfb-asset-library.json` als Laufzeit-Index, 6 KayKit-Modelle im
Prop-Set, 20 Flieger im Gegner-Pool, Kartenrückseite als Platzhalter aller drei Kartenmaler.
