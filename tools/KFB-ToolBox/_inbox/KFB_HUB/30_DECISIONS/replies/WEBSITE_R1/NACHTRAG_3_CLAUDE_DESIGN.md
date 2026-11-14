Für Claude Design (Website KayfaBizarro) · Nachtrag 3: FB-Agent mit Jetpack, Requisiten, Brettspiel-Bausteine · 14.11. (Georg, V-1743, V-1755, V-1757)

1) FrizzleBob (Georg hat die neue FB-Datei abgenommen). Repo georg-doc/KFB-Stunt-Car-Race, Zweig assets/private (@8ea2f386), Ordner 50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/:
- FB_WEB_KANON.r1d.glb (FB), FB_WEB_KANON_twin.r1d.glb (mit Jetpack Twin), FB_WEB_KANON_agent.r1d.glb (Spy-Anzug, Entwurf)
- NEU FB_WEB_KANON_agent_twin.r1e.glb: Spy-Anzug mit Jetpack Twin (Entwurf), Agent ohne Jetpack jetzt FB_WEB_KANON_agent.r1e.glb (Handgelenke sauber)
- NEU Requisiten in waffen/: KFB_Katana.r1d.glb, KFB_Spy_Pistole_Silencer.r1d.glb, KFB_ActionFigure_Shotgun.r1d.glb, KFB_Gatling.r1d.glb (Knoten KFB_Laeufe_drehen), KFB_Martini.r1d.glb. Aufbau je Datei: KFB_Griff → KFB_Halterung → Teil, dazu KFB_Muendung bzw. KFB_Tip; Halterung in den glTF-Extras (kfbHalterung: Slot, Versatz, Drehung) zum Einhängen an FBs handslot.r/handslot.l. Halte-, Ziel-, Schuss- und Hieb-Clips je Waffe (FB_Halten_<waffe>, KFB_Katana_*, KFB_SpreadShot_1H_R1, Ranged_1H_Shoot_mb1) liegen in der Agent-Twin-Datei, Liste in 50_BLENDER/FB_WEB_KANON_R1/RETURN_r1d_agent.md.
- Mund steuern mit 50_BLENDER/FB_WEB_KANON_R1/web/fb_mund.v2.js (Sprechen endet wie im Spiel in Ruhe), Beispiel web/fb_mund_beispiel.v2.html. Alte r1b/r1c-Dateien nicht mehr verwenden.

2) Brettspiel-Bausteine (Ludo-Wala-Logik, Brettspiel-Stimmung):
- KayKit Board Game Bits: Repo georg-doc/kayfabizarro, Zweig main, media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/Assets/gltf/ – Meeples (meeple_*), RPG-Würfel D4/D6/D8/D20, Standees (playerstand_* mit playercard_*), Spielsteine (pawn_*), Token, Münzen, Sanduhr, Dominosteine.
- Standee-Laufzeit (Karte im Ständer, Sitz, Material): kayfabizarro, Zweig stage/storytelling-maps-v1-t2-media-standee-2026-09-20, kfb-hub/stage/storytelling-maps/t2-media-standee/.
- Würfelwurf mit Physik: Donor 3d-dice/dice-box-threejs; Vorgaben (Physikwelt, Wurf aus der Höhe, Rollen, Ruhelage, nie durchs Brett) in tools/KFB-ToolBox/_inbox/KFB StoryMap v1/docs/SMA1-GATE.md, Abschnitt 1.
- Schachfiguren Kristall-Satz M: 50_BLENDER/B30/pieces_morph_gem/KFB_ChessM_<figur>_<white|black>.r2.glb, Steinbrett 50_BLENDER/B30/board/KFB_ChessBoard.r3.glb, Dominosteine 50_BLENDER/B30/dominoes/ (KFB-Stunt-Car-Race, assets/private @8ea2f386).

Der Website-Brief (KFB_HUB/30_DECISIONS/replies/WEBSITE_R1/BRIEF_CLAUDE_DESIGN_WEBSITE_R1.md) ist entsprechend ergänzt.
Rückgabe: Screenshot FB-Agent mit Jetpack und je einem Requisit in der Hand, dazu ein Brettspiel-Moment (Würfelwurf, Meeple, Standee) in deiner Bühne.
