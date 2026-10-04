# RETURN · WORLD-INTEGRATION-01 · WorldBuilder in the real world · 2026-09-25

**Status: BUILT · WORLD SELFTEST 26/26 PASS (ausgeführt, Preview) · GEORG HUMAN GATE OFFEN · kein Merge · kein Cloudflare**

## Was es ist
Der echte WorldBuilder (`wb2-design-01/wb2d-app.js`, WB2-Engine aus PR #190 @ec52eb74, Basis-Blob `8a1e725e` = WB2-DESIGN-01, unverändert als `base/` beigelegt) öffnet mit `world=huerth` die reale Hürth-Zone. Kein zweiter Editor: dieselbe Datei, dieselbe `terrainHeightAt`, dieselben Sculpt-Strokes, derselbe `edit-layer.js`, dasselbe Szenendokument (`kfb-worldbuilder-scene` v1), dasselbe Save/Reload. Play liest genau diesen Zustand.

Ohne `world` ist der WB2-Sandbox-Pfad unverändert (geprüft: Boot, Key `kfb-wb2-terrain-sculpt-01`, Doc-ID, 18-m-Terrain). WB2-Selbsttest 34/34 hier **nicht** erneut ausgeführt, weil er den Nutzer-Speicherschlüssel löscht → Web führt `WB2_DESIGN_01_SOURCE.html?selftest=1` aus.

## Dateien (Repo-Pfade 1:1)
| Datei | Blob | Bytes |
|---|---|---|
| `tools/KFB-ToolBox/worldbuilder/wb2-design-01/wb2d-app.js` (Seams) | `d64f5a3d130839cbda396fb3750facda65606387` | 68083 |
| `tools/KFB-ToolBox/worldbuilder/world-integration-01/wi1-world.js` | `cf1228c0f049d0a99358d08a002df143e485c06e` | 14530 |
| `…/world-integration-01/wi1-actor.js` | `477ba41811fd40d8208584141a6771fe35a5c3bf` | 13160 |
| `…/world-integration-01/wi1-play.js` | `05251c91b9c40c347e623717e920b5c841f6a665` | 13090 |
| `…/world-integration-01/wi1-selftest.js` | `fd9d6972eff9d775994321a0e76b3dbe89a44285` | 7757 |
| `…/world-integration-01/WORLD_INTEGRATION_01_SOURCE.html` | `16de820e15e711c415e3d9d0cdc118426f47ca30` | 989 |

Hängt ab von (Projekt-Wurzel, eine Konstante `ROOT` in `wi1-world.js`): `wd1-seam.js`, `wd1-city.js`, `wd1-names.js`, `w0-ink.js`, `fixtures/huerth-crop-v0.json` (WB-D2, unverändert). Web setzt `ROOT` beim Rehome.

## Seams in wb2d-app.js (sonst nichts)
`WORLD_ID` → `WI.prepare()` · `STORAGE_KEY`/`DOC_ID` je Profil · `patchDoc(DEFAULT_DOC)` · `terrain.tile` in `buildTerrain`/`terrainSettingsFromUI` · `dressTerrain` (Bodenkarte der Stadt auf dem Tile) · `stage` (Kamera/Fog/Schatten auf Stadtmaß) · `setPanels`/`showScene`/`initPlay`/`setPlay` · Tab-Umschalter · Render-Loop (`PLAY.update`, `WORLD.tick`, `WORLD.render`) · `saveDoc`/`reloadDoc`/`resetFixture` schreiben/lesen die Spielerpose · Boot lädt eine gespeicherte Welt · `__wb2d` exportiert den Zustand für den Test.

## Messwerte
- Zone `huerth-crop-v0` über `wd1-seam.loadZone`, 700/700 Gebäude (Elastic Clay V2, FACADE_RULE v1), 19 Straßennamen, Spawn Luxemburger Straße (43 m vom Zentrum), Edit-Tile 128 m @ 0,5 m. Außerhalb des Tiles bleibt die Stadtplatte flach (OSM hat keine Höhe).
- Figur: FrizzleBob-Graft (`graft-mount.v1.js`, `animation:'host'`), 1,85 m Körper (Rig 2,278 × 0,812), Tür/Figur 1,41, Geschoss/Figur 1,62. Genau ein EyeRig, ein Mund, Spenderaugen entfernt.
- Clips: Idle `kfb_idle_breathing_a`, Run `kfb_locomotion_run_forward_a`, WalkBack/RunBack KFB; **Lücken in der KFB Motion Library: Vorwärts-Gehen, Sprung** → KayKit `Walking_A`, `Jump_Start/Jump_Idle/Jump_Land` (bestehende Clips, keine neuen).
- Geschwindigkeit aus den Füßen gemessen (Standbein-Weg ÷ Kontaktzeit): Walk 0,60 m/s × Kadenz 1,35 = 0,81 m/s · Run 1,04 m/s · Sprung-Apex 0,97 m. Gleiten im Lauf gemessen: Walk 0,10 m/s, Run 0,08 m/s Rutschen der Standfüße.
- Befund: Die Mixamo-Wurzelbewegung der KFB-Clips passt nicht zu den Füßen dieses Wirts (Run 1,66 m/s Wurzel gegen 1,04 m/s Füße → 0,74 m/s Rutschen). Sie ist auf die Hüfthöhe 0,406 der Library skaliert. Die Wurzelbewegung bleibt deshalb nur Gegenprobe.
- Walker v25 bleibt unverändert, es werden nur Parameter in Metern gesetzt. Seine Vorgaben stammen aus Cube-Pet-Einheiten (5,4 u/s, Apex 4,7 u, Gummiball-Prellen), daher kam der riesenhafte Gleit-Hüpfer.
- Tusche: `headgraft`-Gesichtsbox `body` (Opazität 0) wurde im Normalenpass mitgezeichnet. Jetzt ausgeschlossen (2 Netze). Den unsichtbaren Wirtskopf (Zeichengruppe `visible:false`) überspringt three.js vor dem Override bereits.

## Selbsttest 26/26 (auf dem Live-Zustand)
Zone/Stadt/Tile/Dokument · Zustände gebunden · Walk-Tempo = Clip × Kadenz · ein Face-Owner · Walk/Run: Strecke = Tempo × Zeit, Zustand aus der Bewegung, Rutschen < 25 % · Sprung Start→Air→Land, Apex, Bodenkontakt · Raise ändert die Wahrheit, Mesh = Wahrheit, Walker läuft darüber · Save → Clear → Reload stellt den Sculpt wieder her, Play danach auf der geänderten Stelle · verschobener Boulder ist fest und übersteht Reload · Tusche schließt Unsichtbares aus. Nutzerspeicher wird gesichert und wiederhergestellt.

## Runde 2 (Georg-Feedback, 2026-09-25 nachmittags)
- Straßenränder: Das Edit-Tile hat jetzt eine eigene Bodenkarte, gezeichnet mit derselben Routine (`wd1-city.js groundMapFor`, additiv). Sie hat 4096 px auf 128 m, also 3 cm/px statt 17 cm/px. Straßen werden nach Klasse statt nach Klasse + Breite verkettet, die Breite wechselt innerhalb einer Straße nicht mehr in Stufen.
- Himmel: `wd-sky.js` → Travel Combat v25 `skydome-shader.js` (Vorgabe Aquarell 1 = Rollercoaster-v11-Rezept, zur Auswahl Aquarell 2, Shader S/A, TinySkies-Hintergrund). Der Horizontnebel hat die TinySkies-Farbe. Das Licht bleibt WB2.
- Animation: wählbare Motion-Sets, Vorgabe KayKit A (Idle_A · Walking_A · Running_A · Walking_Backwards · Jump_*). Befund für eine zentrale Klärung: Beim KFB-Library-Run schaut der Kopf im Mittel 48,7° nach unten, bei KayKit Running_A 6,2°. Auf dem großen Graft-Kopf wirkt der Mixamo-Lauf deshalb „traurig“. Überblendungen laufen jetzt einzeln mit Gewichtssumme 1. Der Körper dreht sich nicht mehr bei Stillstand weg. Die Sprung-Vorspannung dauert 0,14 s.
- Kamera: Der Orbit hat keine Polar- oder Distanzgrenzen mehr und zoomt zum Cursor. Die Play-Kamera dreht frei um die Figur (eigener Zustand, weil die Walker-Kamera auf ±2,6 rad begrenzt ist). Der Nebel skaliert mit dem Abstand.
- Schatten: bias −0,00005, normalBias 0,016, Map 4096 → kein Lichtspalt unter Fels und Füßen.
- Oberfläche in der Welt: Die Tabs Actor/Prop/Scene sind ausgeblendet. Die Statuszeile zeigt nur noch Fehler.
- Selbsttest weiter 26/26 PASS (KayKit A: Walk 0,81 m/s, Rutschen 0,10 · Run 2,48 m/s, Rutschen 0,09).

## Runde 3 (Georg-Feedback, 2026-09-25 abends)
- Animation nach KFB Animation Lab v1/v4, gelesen, nicht neu erfunden (`lab/locomotion.js`, `lab-v4/player.js` + `ground.js`):
  - **Binderegel**: Drehungen überall, Verschiebungen nur an root/hips/pelvis, Skalierungen nie. Vorher waren alle 69 Spuren gebunden, also auch 23 Knochen-Positionen und 23 Skalierungen des Quell-Rigs. Das bog die Arme des Graft-Wirts. Jetzt sind es 25 von 69.
  - **Hüftfaktor**: einmal je Rig, am stehenden Idle gemessen. Ein Faktor je Clip (Lab-fitHips) hätte Jump_Land ×1,195 und Jump_Idle ×0,856 umskaliert.
  - **Sprung nach Lab-Kette**: Jump_Start einmal beim Absprung, Jump_Idle wenn er fertig ist, Jump_Land beim Aufsetzen bis fertig, alle Clips in Originaltempo. Die Walker-Vorspannung (`windup`) ist auf 1/120 s gesetzt. Die doppelte Hocke aus Walker-Windup plus Clip-Anticipation war der „Doppelsprung“.
  - **Vorgabe** bleiben die KayKit-Basisclips (Set A). Die KFB Motion Library ist wählbar, nicht Standard.
- Straßenschilder: echte Eckmasten statt schwebender Sprites und Stäbe, ein Mast je Kreuzung (15 in Hürth). Je Straße ein beidseitiges Schild parallel zu ihrem Verlauf. Es sitzt mit einem Ende am Mast und läuft von der Kreuzung weg über den Gehweg. Neuer Modus `posts` in `wd1-names.js` (additiv, WB-D1 unverändert).
- Schatten: Die Schattenbox kommt jetzt aus WB-D1 `shadowFollow` (90–400 m nach Kameraabstand, auf ganze Texel gerastet, normalBias 1,2 Texel, bias −0,00003) statt einer festen ±34-m-Box. Häuser außerhalb verlieren ihren Schatten nicht mehr.
- Edit-Tile 192 m @ 0,5 m, Bodenkarte darauf 4,7 cm/px. Übergang zur Zonenkarte (17 cm/px) weiter draußen. Der echte Fix ist eine nachgeladene Detailkarte oder Straßen als Geometrie (offen).

## Offen, benannt
- Kein Mensch-Test, kein Mobil-Test. Bedienung des Human Gate in der Seite: Tab = Play/Edit, WASD/QE/Shift/Space, Mausrad = Radius (Edit), Save/Reload oben.
- Die Graft-Module laden über raw.githack (Dev-CDN). jsDelivr @main und @a46dbdff1503 verlieren in diesem Host einzelne dynamische Imports; jsDelivr bleibt als Fallback.
- Gebäude bleiben auf OSM-Grund stehen. Sculpt unter einem Haus lässt es einsinken oder schweben. Am Tile-Rand entsteht eine Stufe, wenn der Pinsel über die Kante reicht.
- Kamera-Kollision mit Gebäuden fehlt. Strafe hat keinen eigenen Clip: der Körper dreht sich in die Laufrichtung.
- Die Lichtprofile Baseline/WhackMan setzen ihre Laborfackeln am Ursprung, nicht in der Zone.
