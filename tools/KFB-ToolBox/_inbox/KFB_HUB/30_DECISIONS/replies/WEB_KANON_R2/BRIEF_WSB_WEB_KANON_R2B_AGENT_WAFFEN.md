# Für WSB (Mac mini) · Web-Kanon R2b: FB-Agent mit Jetpack Twin und fünf Web-Requisiten für Claude Design · 14.11. (Georg, V-1743, V-1755)

**Anlass (Georg 14.11.):** „design braucht noch FB mit spy-anzug, dem neuem jetpack und dem ninja katana, spy-gun mit silencer, action figure shotgun & gatling“ und „auch gerne das cocktailglas aus dem kaykit spy set“. Claude Design hat die Lücke gemeldet: Eine Datei mit Spy-Anzug und Jetpack zusammen gibt es nicht, nur `FB_WEB_KANON_agent.r1d.glb` (Anzug ohne Jetpack) und `FB_WEB_KANON_twin.r1d.glb` (Jetpack mit T-Shirt).

**Reihenfolge:** vor den Teilen 2–4 aus R2, als eigene Lieferung (Claude Design wartet).

**Grundlage:** Repo `georg-doc/KFB-Stunt-Car-Race`, Stamm `game/integration-r2` @e5acb971a, Assets `assets/private` @30c4f387. Alle Regeln von r1d gelten unverändert (Mund als voller Rig-Teil, Viseme, `web/fb_mund.js`, Plapper-Loop, Mimik-Clips, Ruhe aus den Extras, Maß, Knete, Kanon-Wache).

**1 · `FB_WEB_KANON_agent_twin.r1d.glb`** in `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/`: FB im Spy-Anzug wie `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON_agent.r1d.glb` plus Jetpack Twin in Lage A wie `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON_twin.r1d.glb` (Anker aus `50_BLENDER/WSB_JETPACK_TWIN_R1/data/jetpack.contract.twin.r1b.json`). Status Entwurf wie der Agent (Abnahme im Hub). Auf dem Bildblatt die Hand-Ärmel-Stelle nah zeigen (dein A6-Befund 1, spitze Dreiecke zwischen Ärmel und Hand), damit sichtbar ist, ob sie sauber ist.

**2 · Fünf Requisiten als eigene Web-Dateien** in `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/waffen/`, jede so, wie FB sie im Spiel trägt (Kit-Teil unverändert, V-574; Material wie im Spiel):

| Requisit | Quelle | Spiel-Karte (Halterung, Clips) |
|---|---|---|
| Ninja-Katana | `assets/private` `50_BLENDER/B50/ninja/_privat_kauf_asset/KFB_Ninja_red_katana.r1.glb` | `src/data/combat/k10/kfb_kit_ninja_katana.fb_r1.weapon.json` |
| Spy-Pistole mit Silencer | deine A6-Lieferung `KFB_HUB/50_BLENDER/WSB_REIHE_R1/6_SPY/waffen/KFB_Spy_Gun.r1.glb` (noch nicht in `assets/private`, bitte mitliefern) | Halterung aus `KFB_HUB/30_DECISIONS/replies/WSB_REIHE_R1/A6_SPY_RETURN.md` (handslot.r, Ry +90°, KFB_Muzzle_Silencer) |
| Action-Figure-Shotgun | `assets/private` `50_BLENDER/K10/_privat_kauf_asset/KFB_ActionFigure_Gun.k10.glb` | `src/data/combat/k10/kfb_kit_actionfigure_gun.weapon.json` (im Spiel „Scattershot“) |
| Gatling | `assets/private` `50_BLENDER/K10/_privat_kauf_asset/KFB_CombatMech_Minigun.k10.glb` | `src/data/combat/k10/kfb_kit_combatmech_minigun.fb_r2.weapon.json` |
| Cocktailglas (Martini) | deine A6-Lieferung `KFB_HUB/50_BLENDER/WSB_REIHE_R1/6_SPY/waffen/KFB_Martini.r1.glb` (bitte mitliefern) | Requisit, Halterung handslot.l oder .r nach deinem Vorschlag |

Je Datei: Knoten `KFB_Griff` (sitzt am Handslot), bei Schusswaffen `KFB_Muendung`, beim Katana `KFB_Tip` aus der Spiel-Karte (Katana wie im Spiel aus dem Spender herauslösen: `src/modules/katanaSource.js`, Netz `kfb_katana_native` mit `KFB_Tip`, Geometrie unverändert), in den glTF-Extras die Halterung aus der Spiel-Karte (Slot, Versatz, Drehung), damit die Seite sie in three.js an FBs `handslot.r`/`handslot.l` hängt. Die Halte-, Ziel- und Schuss- bzw. Hieb-Clips, die FB im Spiel mit diesen Waffen spielt (`src/modules/combatPlayer.r2.js`), kommen in die Datei aus Teil 1; Liste Waffe → Clips in RETURN.

**Prüfung:** Kanon-Wache; Bildblatt Spiel gegen Web: Agent-Twin vorn/seitlich/Gesicht und je Requisit FB-Agent-Twin mit dem Requisit in der Hand (Ruhe und eine Aktion); Dateigröße je Requisit klein halten (Standard-Decoder von three.js).

**Rückgabe** wie r1d: Bundle, RETURN, Bildblätter in `replies/WEB_KANON_R2/MINI_r1d_agent/`, Zweig `assets/wsb-fb-web-kanon-r1d-agent` von `assets/private` @30c4f387. WS0 trägt die Pfade in `src/data/characters/frizzlebob.character.json` (`appearance.export`, Felder `web_agent_twin`, `web_requisiten`) ein und gibt Claude Design die Liste.
