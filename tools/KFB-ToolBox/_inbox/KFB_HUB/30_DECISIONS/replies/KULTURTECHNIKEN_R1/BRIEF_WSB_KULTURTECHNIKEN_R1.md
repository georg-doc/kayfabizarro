# Für WSB (Mac mini, Blender MCP) · KFB-Kulturtechniken R1: Tanzen zuerst, dazu Lesen, Fluff ernten/handeln/Alchemie, Brickfish werfen, Geschenke, Debatten · 14.11. (Georg, V-1788)

**Kern (3 Zeilen):**
1. FB und alle KFB-NPCs tanzen bei jeder Gelegenheit. Tanz hat Vorrang und soll den eigenen Chill-, Tanz- und Spaß-Vibe tragen. Dazu kommen fünf weitere Kulturtechniken: Lesen (Bücher, Comics), Fluff ernten/handeln/Alchemie, Brickfish werfen, Geschenke, Debatten.
2. Bestand zuerst, Clips unverändert (V-574, V-1752). Neue Bewegungen nur aus fertigen freien Bibliotheken oder Motion-Captures, keine eigenen Keyframes. Kein Clip wird aus dem Pool genommen, um Fehler zu verbergen; es wird repariert.
3. Rückgabe: je Technik ein Clip-Paket für FB und für die KayKit-Körper, ein Manifest mit Tags und Übergängen, Belege. Teil A zuerst, Teil B erst nach Georgs Auswahl im Hub.

**Georgs Wortlaut (14.11.):** „die ganzen dance clips, animations, audio-sync und pose-transitions mit passenden clips/mixamo importe etc optimieren: alle KFB NPCs und FB tanzen bei jeder gelegenheit (-> dance clips = immersive prio & unique chill&dance&fun vibe) -> hier auch weitere clips & motion captures recherchieren. mixamo sowie andere motion libraries & tools … dazu lesen alle gerne bücher und comics · fluff-harvest, trade & alchemie · dazu das brickfish-werfen · sowie geschenke · und debatten · -> als KFB kulturtechniken“

**Grundlage:** Repo `georg-doc/KFB-Stunt-Car-Race`, Stamm `game/integration-r2` @69830312c, Assets `assets/private` @cd4983b2.

| Bestand | Pfad |
|---|---|
| Clip-Katalog (290 Clips, mit Lückenliste: Paar-Tanz, Lesen, Geschenke, Kayfabulieren) | `KFB_HUB/30_DECISIONS/replies/WSO_CLIP_CATALOG_R1.md` und `…/WSO_CLIP_CATALOG_R1/clip-catalog.json` |
| Tanz-Clips FB (Motion Library v2, FB-Rig) | `assets/private` `50_BLENDER/IDLE_R1/clips_fb/KFB_Motion_dance.v2.Rig_Medium.fb.glb` |
| Tanz-Clips KayKit (Motion Library) | `assets/private` `kfb-mirror/7b5cf6642987ee8b4bb9fa8200dbc85347b44762/media/3D_Assets/Animations/KFB_Motion_Library/libs/Rig_Medium/KFB_Motion_dance.glb` (Large daneben) |
| ML v2 für KayKit (Gesten, Idles, kk.r2b) | `assets/private` `50_BLENDER/WSB_ML_V2_KK_R2/clips_kaykit/` |
| Aktions-Clips | `assets/private` `motion_lib_r1/KFB_Motion_action_i04.Rig_Medium.glb` … `i06` |
| Idle-Tanz im Spiel (Stufen groove/simple/big, Takt aus der Musik, barsPerClip, timeScale) | Stamm `src/data/life/idle_dance.r1.json`, `src/life/danceHost.js`, `src/life/idleDance.js` |
| NPC-Tagesablauf (rest, tend, inspect, study, social) | Stamm `src/data/npc/residents.r1.json` |
| Brickfish (Figur, Wurf-Requisit) | `assets/private` `50_BLENDER/BRICKFISH_R1/data/KFB_BrickFish.figure.r4.glb`, `…/KFB_Throw_BrickFish.large.r4.glb`, `50_BLENDER/B41/props/KFB_Throw_BrickFish.medium.r1.glb` |
| Ganzkörper-Choreografie (Haltungen, Reaktionen, Gefühle; Debatten laufen darüber) | Stamm `src/modules/haltung.js`, `src/web/fb/kfb-choreo.v1.js` (Format kfb.choreo/1) |
| Buch-/Comic-Requisit | Platzhalter, Build folgt: freie Kandidaten Quaternius Fantasy Props MegaKit (Low-Poly, frei) oder Poly-Haven-Bücher (CC0, zu dicht, nur als Notlösung) |

**Teil A (sofort):**
- **Bestand sichten:** Je Technik zuordnen, was im Katalog, in ML v2, in KayKit und in den Aktions-Clips schon passt.
- **Kandidaten suchen:** freie Clips und Motion-Captures für die Lücken. Tanz mit eigenem KFB-Vibe in vielen Stilen (Hip-Hop, House, Disco, Funk, Swing/Charleston, Twist, Robot), dazu Paar- und Gruppentanz.
  - Quellen: Mixamo (nur über Georgs Adobe-Login), Quaternius Universal Animation Library, KayKit, CMU Mocap, Kevin Iglesias „Human Dance Animations FREE“ und weitere freie Bibliotheken.
  - Je Kandidat: Quelle, frei ja/nein, Vorschau.
- **Rückgabe A:** ein Kontaktbogen je Technik mit **höchstens 8 Kandidaten**, als Bild mit Vorschau, nichts heruntergeladen außer Vorschauen. WS0 macht daraus eine Hub-Karte. Georg wählt.

**Teil B (nach Georgs Hub-Wahl):**
- **Import:** die gewählten Clips unverändert auf FB (`.fb.glb` wie IDLE_R1) und KayKit Rig_Medium/Large (`.kk.glb` wie WSB_ML_V2_KK_R2) übertragen. Fehler nach V-1752 reparieren: Arme nicht im Rumpf, Hände an Requisiten, Füße auf dem Boden.
- **Tanz und Musik:**
  - Je Clip Schläge pro Schleife, Takt-Eins und passender Tempo-Bereich, damit der Idle-Tanz Clips per timeScale auf den Takt der Musik legt (idle_dance.r1.json).
  - Saubere Schleifen.
  - Übergänge Idle_A ↔ Tanz und Gehen → Tanz.
- **Weitere Übergänge:** Einstieg und Ausstieg je Technik zu Idle_A (Pose-Übergang, kein harter Schnitt).
- **Requisiten:** Buch/Comic (nach Wahl), Brickfish, Geschenk-Paket, Fluff-Kugel, Alchemie-Kessel/Flasche.
  - Je Requisit `KFB_Griff` am Handslot wie bei den Web-Waffen (R2b).
  - Requisit-Teile aus Kits unverändert (V-574).
  - Fehlt ein Requisit im Bestand: Platzhalter melden, nicht selbst modellieren.
- **Manifest** `kfb.kultur-clips/1` je Clip:
  - Technik, Gefühl, Energie,
  - Schleife oder einmal,
  - Kontaktmarken (Wurf-Abgang, Übergabe, Seite umblättern) in Sekunden,
  - Partner nötig ja/nein,
  - Tanz-Daten (Schläge, Takt-Eins),
  - Quelle.
- **Beleg:** je Technik ein GIF vorn oder seitlich im Spiel-Look (Knete, KFB-Augen, Kanon-Wache FB: beide Ohren, Schwanz) und ein Kontaktbogen. Ein Kritiker je Runde.

**Rückgabe:** Zweig `assets/wsb-kulturtechniken-r1` von `assets/private` @cd4983b2, RETURN in `KFB_HUB/30_DECISIONS/replies/KULTURTECHNIKEN_R1/`. WS0 baut ein: Idle-Tanz, NPC-Tagesablauf, Choreografie-Gefühle.
