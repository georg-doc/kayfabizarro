# Für WSB (Mac mini, Blender MCP) · KFB-Kulturtechniken R1: Tanzen zuerst, dazu Lesen, Fluff ernten/handeln/Alchemie, Brickfish werfen, Geschenke, Debatten · 14.11. (Georg, V-1788)

**Kern (3 Zeilen):**
1. FB und alle KFB-NPCs tanzen bei jeder Gelegenheit. Tanz hat Vorrang und soll den eigenen Chill-, Tanz- und Spaß-Vibe tragen. Dazu kommen fünf weitere Kulturtechniken: Lesen (Bücher, Comics), Fluff ernten/handeln/Alchemie, Brickfish werfen, Geschenke, Debatten.
2. Bestand zuerst (Tabelle unten, alles schon abgenommen). Neue Bewegungen nur für echte Lücken und nur aus fertigen freien Bibliotheken oder Motion-Captures. Keine eigenen Keyframes, auch nicht für Übergänge.
3. Rückgabe: Teil A sofort (Bestand je Technik plus Kandidaten für Lücken), Teil B erst nach Georgs Auswahl im Hub. Rückgabe als Git-Bundle, WS0 pusht.

**Georgs Wortlaut (14.11.):** „die ganzen dance clips, animations, audio-sync und pose-transitions mit passenden clips/mixamo importe etc optimieren: alle KFB NPCs und FB tanzen bei jeder gelegenheit (-> dance clips = immersive prio & unique chill&dance&fun vibe) -> hier auch weitere clips & motion captures recherchieren. mixamo sowie andere motion libraries & tools … dazu lesen alle gerne bücher und comics · fluff-harvest, trade & alchemie · dazu das brickfish-werfen · sowie geschenke · und debatten · -> als KFB kulturtechniken“

**Grundlage:** Repo `georg-doc/KFB-Stunt-Car-Race`, Stamm `game/integration-r2` @69830312c (auf GitHub geprüft), Assets `assets/private` @cd4983b2. Pfade ohne Präfix liegen in `assets/private`.

| Technik / Teil | Bestand (geprüfter Pfad) |
|---|---|
| Clip-Katalog (290 Clips, Lückenliste) | `KFB_HUB/30_DECISIONS/replies/WSO_CLIP_CATALOG_R1.md`, `…/WSO_CLIP_CATALOG_R1/clip-catalog.json` |
| Tanz: Disco K12 mit Bodenausgleich je Figur (V-596) | `50_BLENDER/K12/data/disco_cast_k12.json`, `50_BLENDER/K12/data/disco_*.k12.figure.json`, `50_BLENDER/K12/data/floorlift/*.json` |
| Tanz: Motion Library FB und KayKit | `50_BLENDER/IDLE_R1/clips_fb/KFB_Motion_dance.v2.Rig_Medium.fb.glb`; `kfb-mirror/7b5cf6642987ee8b4bb9fa8200dbc85347b44762/media/3D_Assets/Animations/KFB_Motion_Library/libs/Rig_Medium/KFB_Motion_dance.glb` (Large daneben) |
| Tanz im Spiel (Stufen, Takt aus der Musik, barsPerClip, timeScale) | Stamm `src/data/life/idle_dance.r1.json`, `src/life/danceHost.js`, `src/life/idleDance.js` |
| ML v2 für KayKit, Aktions-Clips | `50_BLENDER/WSB_ML_V2_KK_R2/clips_kaykit/`; `motion_lib_r1/KFB_Motion_action_i04.Rig_Medium.glb` … `i06` |
| Lesen: Buch, Lesen, Umblättern (V-591) | `50_BLENDER/K11/props/KFB_Book_Open.k11.glb`; `50_BLENDER/K11/_privat_kauf_asset/K11_lorekeeper_read.proof.glb`, `…/K11_lorekeeper_pageturn.v2.proof.glb` (Holding_C liegend, Holding_B Nachschlagen) |
| Debatten: Gesprächsbibliothek und Rufe (V-706, V-709, V-774) | `50_BLENDER/N35/out/talk_library_r2/KFB_Talk_Library_Rig_Medium.glb`, `…_Rig_Large.glb`, Kataloge `KFB_Talk_Library.catalog.Rig_*.json`; Rufe `50_BLENDER/N35/out/rufe/` |
| Brickfish werfen (V-537): Figur, Wurf-Requisit, Wurf-Clips mit Abwurf-Marken | `50_BLENDER/BRICKFISH_R1/data/KFB_BrickFish.figure.r4.glb`, `…/KFB_Throw_BrickFish.large.r4.glb`, `50_BLENDER/B41/props/KFB_Throw_BrickFish.medium.r1.glb`; `KFB_HUB/50_BLENDER/B41/data/thrower_clips_medium.json`, `thrower_clips_large.json`, `b41_throw_markers_r1.json`, `data/timelines/` |
| Geschenk | `kfb-mirror/891eadf01e218f5fc21387e64cea1fec8332c5b6/media/3D_Assets/KayKit_Mystery_Series6/6 - December 2025 - Toy Soldier/gltf/Present_Base.gltf` (+ `Present_UnwrappedBase`) |
| Fluff-Kugel zum Werfen/Übergeben | `KFB_HUB/50_BLENDER/B41/props/KFB_Throw_FluffBomb.medium.r1.glb` (`.large.r1` daneben) |
| Alchemie-Kessel/Flasche, Comic-Heft, geschlossenes Buch | Platzhalter, Build folgt (nicht im Bestand; WSB meldet Kandidaten, modelliert nicht) |
| Ganzkörper-Choreografie (Haltungen, Reaktionen, Gefühle) | Stamm `src/modules/haltung.js`, `src/web/fb/kfb-choreo.v1.js` (kfb.choreo/1) |
| Ziel-Rigs | FB wie `50_BLENDER/IDLE_R1/clips_fb/` (Skripte `50_BLENDER/IDLE_R1/scripts/clips_auf_figur.mjs`); KayKit Medium wie `50_BLENDER/WSB_ML_V2_KK_R2/clips_kaykit/`, Large wie `kfb-mirror/7b5cf6642987ee8b4bb9fa8200dbc85347b44762/media/3D_Assets/Animations/KFB_Motion_Library/libs/Rig_Large/` bzw. `50_BLENDER/N35/out/talk_library_r2/KFB_Talk_Library_Rig_Large.glb` |

**Teil A (sofort):**
- **Bestand je Technik:** Den Bestand oben zuordnen, ohne etwas zu ändern. Lücken als Liste: welcher Beat, welche Technik, welches Rig.
- **Kandidaten nur für Lücken:** Tanz mit KFB-Vibe in vielen Stilen (Hip-Hop, House, Disco, Funk, Swing/Charleston, Twist, Robot), Paar- und Gruppentanz, sonst nur die gemeldeten Lücken.
  - Quellen: Mixamo, Quaternius Universal Animation Library, KayKit, CMU Mocap, Kevin Iglesias „Human Dance Animations FREE“, weitere freie Bibliotheken.
  - Mixamo lädt nur Georg selbst (V-454). WSB nennt dafür Namen und Link, loggt sich nicht ein. Dasselbe gilt für Quellen mit Konto (Kevin Iglesias über den Unity Asset Store).
- **Rückgabe A:**
  - Je Kandidat eine eigene kurze Vorschau, Clip oder großes Einzelbild, gleiche Bühne und Kamera, Dateiname = Kandidat. Höchstens 8 je Technik.
  - Dazu ein Kontaktbogen nur als Übersicht für WS0.
  - Kandidaten, die nur mit Login zu laden sind (Mixamo, Asset Store): Name, Link und die Vorschau der Quelle, auf einer eigenen, klar beschrifteten Hub-Folie. Georg lädt die ausgewählte Kurzliste selbst, danach rendert WSB sie auf der Bühne.
  - WS0 baut die Hub-Karte aus den Einzelvorschauen (V-195). Georg wählt.

**Teil B (nach Georgs Hub-Wahl):**
- **Import:**
  - KayKit-Originale bleiben unverändert (V-1752, q665).
  - Importierte ML-, Mixamo- und Mocap-Clips werden nach V-1752 repariert (Oberarm, Ellbogen, Brust/Wirbel, Ziel ≤ 1,5 cm im Rumpf).
  - Mixamo-Clips lädt Georg in `KFB_HUB/50_BLENDER/KULTURTECHNIKEN_R1/in_mixamo/`.
- **Boden:** Einsinkende Tanz- und Mocap-Clips bleiben in der Spur unverändert. WSB liefert je Figur × Clip einen Bodenausgleich wie K12 (`floorlift/*.json`, V-596). Kein neuer Hüft-Lift in der Spur, kein pauschaler groundOffset. Der feste Hüft-Ausgleich der FB-Clips aus IDLE_R1 (bis 3 cm, V-1388/V-1389) bleibt, wie er ist. Der Bodenausgleich fängt nur das Einsinken je Bild ab.
- **Requisiten im Spiel:** Anker `KFB_Grip` (V-536) mit einem festen, gemessenen slotOffset je Requisit, ein Wert für alle Clips, mit Beleg (V-574, V-581). Kein Nachposieren der Hand je Bild. `KFB_Griff` nur für Web-Dateien.
- **Tanz und Musik:** Je Clip die neuen Felder `beatsPerLoop` (Schläge pro Schleife) und `downbeatS` (Takt-Eins in Sekunden) in der clips.json, dazu wie in `idle_dance.r1.json` tier, rank, bpm, energy. Saubere Schleifen.
- **Übergänge:** Nur vorhandene Übergangs-Clips oder Blend-Daten (blendS, Einstiegsframe) für Idle_A ↔ Tanz, Gehen → Tanz und Ein-/Ausstieg je Technik. Fehlt ein Übergang, wird er als Lücke gemeldet.
- **Daten:** je GLB sha256 (`SHA256SUMS.txt` wie IDLE_R1) und clips.json im Pool-Format von `50_BLENDER/IDLE_R1/data/clips.idle_r1.json`. Technik, Gefühl, Energie, Kontaktmarken (Abwurf, Übergabe, Umblättern in Sekunden) und Partner nötig ja/nein sind Felder darin. Kein zweites Manifest-Format.
- **Beleg:**
  - Je Technik vorn oder seitlich plus Spielkamera von hinten, im Spiel-Look auf der einheitlichen Proof-Stage.
  - Knete, KFB-Augen, Kanon-Wache FB (beide Ohren, Schwanz).
  - Ein Kritiker je Runde.

**Rückgabe:** Git-Bundle mit Zweig `assets/wsb-kulturtechniken-r1` von `assets/private` @cd4983b2 in `KFB_HUB/30_DECISIONS/replies/KULTURTECHNIKEN_R1/`, dazu RETURN.md. WS0 pusht den Zweig und baut ein: Idle-Tanz, NPC-Tagesablauf, Choreografie-Gefühle.
