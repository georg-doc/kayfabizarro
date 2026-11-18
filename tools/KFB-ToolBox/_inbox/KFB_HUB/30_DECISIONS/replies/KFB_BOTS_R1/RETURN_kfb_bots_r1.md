# KFB Bots R1 · Mixamo X/Y Bot im KFB-Look · RETURN Stufe 1 (WSB, 18.11.2026)

**Auftrag:** WS0 Auftrag 5 (Georg 18.11.), Antworten in Kanal 85. X Bot (männlich zu lesen) und Y Bot (weiblich zu lesen) bekommen KFB-Augen, Knete, einen Mund aus R4 und Balken-Brauen. Dazu Figurenkarten und später der Web-Export. Mixamo-Skelett, Gewichte und Animationen bleiben unverändert.

**Stufe 1 (diese Lieferung):** Anker, Karten, Zusammenbau im Spiel, Mund-Vorschläge am Bild, Belege und Clip.
**Stufe 2 (nach Georgs Mundwahl und den Mixamo-Dateien):** Testfassung mit echtem Idle/Walking, Web-Export-GLB je Figur.

## Zuordnung (Kanal 85)
- **q_xbot „X Bot“** (männlich zu lesen) = Netz Alpha (kräftig, blaugrün #58aebf) aus `_inbox/KFB Bots/Y Bot.fbx`.
- **q_ybot „Y Bot“** (weiblich zu lesen) = Netz Beta (schlank, orangerot #ec958c) aus `X Bot.fbx`.
- Die Dateinamen stehen nur in der Karte (`body.quelle`).

## Was gebaut ist
- **Anker** (Blender, `scripts/bot_anker_clips.py`): fünf Empties am Knochen `mixamorig:Head` (im Browser `mixamorigHead`).
  - `KFB_Eye_L/R_anchor`: Strahl von der Kopfmitte, Gier ±18°, Nick +8°. Radius 0,15 × Kopfbreite (X 2,34 cm, Y 2,63 cm). Augenmitte 0,2 r hinter der Fläche.
  - `KFB_Mouth_anchor`: Nick −24°.
  - `KFB_Brow_L/R_anchor`: über den Augen.
  - Achsen im Spiel: lokal +Z nach außen, +Y Kopf oben. Das ist am Bild geprüft; Blender und glTF drehen die Achsen, der Rahmen ist im Skript darauf eingestellt.
  - Netz, Gewichte und Skelett: nur importiert und wieder exportiert, nichts geändert.
- **Testfassung GLB** (`_privat_kauf_asset/KFB_q_{x,y}bot_spieltest.r1i.glb`):
  - Clip `Walk` = Mixamo `firing_rifle_walking_inplace`, unverändert, nur Knochenspuren übernommen.
  - `Idle` ist **keine Mixamo-Animation**, sondern die ruhende Bindepose (T-Pose) als Platzhalter, bis Georgs Mixamo-Idle da ist.
- **Karten** `karten/q_xbot.figure.json`, `karten/q_ybot.figure.json` (kfb.figure/1, erzeugt mit `scripts/karten_bauen.mjs`):
  - **eyeRig:** v6, seat `anchor`, frame `node mixamorigHead`, matte-cute, converge 0,12. Lidfarbe über `lidTone` dunkler als der Körper (X #3f909f, Y #ce685b).
  - **mouth:** `decal-set` R4, Kandidaten je Figur, Breite in Kopfknochen-cm.
  - **brows:** `bar` über brow-rig.v2, taper 0, thickness 2,4, Farbe Körper × 0,3.
  - **Rest:** material kfb-clay (Profil character), family `legacy`, license Mixamo, approval `pending-georg`.
- **Zusammenbau im Spiel nur per Routing** (`scripts/_wsb-bots-beleg.r1b.mjs`, Stamm @b3da382e, keine Spieldatei geändert):
  - `figuren=alle` holt `/@kfb-cast/review.json` mit den Bots (body `castcard`). `cardActor` setzt Augen und Lidschale v6 an die Anker.
  - Mund und Brauen setzt das Prüfskript dazu, wie `headpartMouth` und brow-rig.v2. Knete kommt aus dem Knet-Look des Spiels.
  - Der Lidschalen-Absturz in `kfb-proof-eyes` ist im Test noch per Routing umgangen; WS0 hat ihn in @77983f8b behoben.

## Mund-Vorschläge (Georg wählt)
- **X Bot:** `buck_grin` | `sausage`, Bögen `belege/r1b/BOTS_mundwahl_q_xbot_{gesicht_0,gesicht_35,figur_0}.jpg`.
- **Y Bot:** `full_soft` | `round_clay`, Bögen `belege/r1b/BOTS_mundwahl_q_ybot_*.jpg`.
- Einzelbilder per `belegAbnahme` (Kampfbühne, Spiel-Look, 9 s nach dem Laden, damit der Bühnenvorhang offen ist): gesicht 0°/35°, figur 0°/60°, je Mund (`belege/r1b/q_*bot_r4_*`), Daten in `beleg_q_*bot.json`.

## Clip mit unveränderter Mixamo-Animation
- `replies/KFB_BOTS_R1/videos/q_{x,y}bot_mixamo_walk.mp4` (60 fps) und `_zeitlupe.mp4` (15 fps). Spiel-Look, Kamera dreiviertel folgend, fester Takt, 331 Bilder.
- Die Figur steht in der Bindepose, geht 4 s mit dem Mixamo-Walk und bleibt wieder stehen. Gesehen: Augen, Lider, Mund und Brauen gehen mit dem Kopf mit.
- Der Walk ist die Gewehr-Gehanimation (Kopf leicht geneigt, Arme in Haltung), bis Georgs Mixamo „Walking“ da ist.

## Offen
1. **Georgs Mundwahl** je Figur.
2. **Mixamo „Idle“ und „Walking“** (Without Skin, 30 fps) nach `_inbox/KFB Bots/`. WS0 hat Georg gefragt.
3. **Danach Stufe 2:**
   - Testfassung r2 mit den echten Clips, Belege und Clip neu.
   - Web-Export wie FB_WEB_KANON (wk_export/phase2/pack/check): eine GLB je Figur mit Augen, gewähltem Mund, Brauen, Knete gebacken und Mixamo-Skelett.
   - Die Brauen nutzen heute ShaderMaterial; für den Export wandle ich sie in Standard-Material um.
   - In der Karte `appearance.export.web` setzen.

## Dateien
- **Bündel (Zweig `assets/wsb-kfb-bots-r1`):**
  - `RETURN_kfb_bots_r1.md`, `PLAN.md`
  - `karten/`, `scripts/`, `data/q_*bot_spieltest.r1i.json`
  - `_privat_kauf_asset/KFB_q_{x,y}bot_spieltest.r1i.glb`
  - `belege/r1b/`, `belege/zwischen/BOTS_dateien_x_y.jpg`
- **Nur im Hub:** Videos in `replies/KFB_BOTS_R1/videos/`. Zwischenstände r1–r1h stehen auf der Löschliste und warten auf Georgs Ja.
