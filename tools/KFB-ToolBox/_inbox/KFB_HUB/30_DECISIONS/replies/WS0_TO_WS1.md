# WS0 → WS1 · Antworten der Steuerung (neueste oben)

## 16.10.2026 · Entlichtete Meshy-Texturen für L2 Schritt 5 (V-355)
Branch `assets/kfb-meshy-delit-r1-2026-10-16`, Ordner `media/3D_Assets/MeshyModels/browser/delit-r1/`: `GoblinBank_A_screen.v2.delitL1/L2.glb`, `Atlantis_A_screen.delitL1/L2.glb` (nur Base-Colour ersetzt, Farbton exakt, alles andere bytegleich inkl. `kfb_screen_frame/slot`) + Proofs/Messwerte. **Für Variante C nehmen: Goblin L2, Atlantis L1.**
Ehrlicher Befund: Die Wirkung ist klein (+2–4 % Helligkeit). Gemaltes Oberlicht/AO steckt vor allem in Atlantis; die Goblin Bank ist in der Albedo wirklich dunkel, und **11 % ihrer Texel sind Metall (Gold, Messing), die ohne Environment-Map in three.js dunkel rendern**. Das ist Laufzeit: bitte für Schritt 5 eine schlichte Raum-/PMREM-Environment-Map (gleiche warme Tönung wie Look B, kein zweites Licht) und gegebenenfalls Metallglanz begrenzen, dann neu messen. Ob die Bühnenfarben zusätzlich bewusst aufgehellt werden dürfen (Regrade, Konflikt mit „Farben behalten“/V-286), entscheidet Georg erst am A|B|C-Vergleich.

## 16.10.2026 · Antworten auf WS1_STATUS §58–§59 (VFX-Slice, Audio, Partikel) – V-357
1. **VFX-Slice V1** als Vorlagen-Zeile freigegeben (V-001 durch `kfb-flight-vfx.js`), Reihenfolge wie §59.3 (Georg bestätigt): M2-Grundfahren → Speedlines/Trails + Staub/Erde/Rauch → Düsen-Glow → Antigrav/Flug → Audio parallel. KISS: **ein** Antriebs-Effekt für alle Fahrzeuge, Antigrav an vier Punkten aus `kfb_wheel_*` bzw. `kfb_hover_*`, keine Modelländerung. Gemeinsames VFX-Budget wie euer Vorschlag (feste Obergrenzen je Familie wie `VFX_CAPS`, ein Partikel-Pool, Instancing, keine neuen Lichter, Leuchten nur über Material/additive Sprites) – gilt auch für spätere Destruction-/Waffen-Effekte.
2. **Düsen-Anker: (b) Klick-Werkzeug in der Vorschau** (Raycast → Punkt + Normale → JSON), weil Georg damit selbst gestaltet (V-002/V-306) und es für Waffen-Aufsätze wiederverwendbar ist. Format bestätigt, GLB bleibt unverändert:
```json
{ "schema": "kfb.vehicle-thrust/1", "vehicle": "crimson_flame_dragster", "space": "glb",
  "points": [ { "id": "jet_l", "pos": [x,y,z], "dir": [x,y,z], "radius": 0.18, "type": "jet|turbine|exhaust|antigrav" } ] }
```
   WS0 legt die Dateien nach Georgs Klicks unter `media/3D_Assets/MeshyModels/vehicles/<id>/<id>.kfb-vehicle-thrust.json` ab.
3. **Terraintyp → Partikelprofil** (Farben aus der Bühnen-/Biom-Palette V-305, nicht fest):
| Terrain | Partikel | Farbe | Auslöser |
|---|---|---|---|
| Gras/Wiese | Erdkrumen + Grashalm-Knetstückchen | Boden-Rolle dunkel + Laub | Schlupf, Drift, Landung |
| Sand/Wüste | heller Staub, weiche Wolke | Boden-Rolle hell | Fahrt > 40 % Tempo, Drift, Landung |
| Fels/Stein | graue Rauchwölkchen + kleine Splitter | Fels-Grau der Bühne | Landung, Aufprall |
| Erde/Lehm/Ton | ockerfarbene Knetbrocken | Boden-Rolle | Schlupf, Drift |
| Schnee | weiße Puffs | Weiß mit Himmelston | Fahrt, Landung |
| Straße/Platten | kaum Staub, nur Reifenrauch bei Drift | neutrales Grau | Drift |
   Spender für Form und Bewegung: `clay-vfx.v1.js` + `clay-particle-profiles.v1.json` auf main (`tools/KFB-ToolBox/_inbox/KFB World Core R0A · Clay World Donor/WORLD_CORE_MOBILITY_R0A_2026-09-29/lab-vfx/` bzw. Joyride-Schnitt `…/JOYRIDE_SESSION_2026-09-29/code/lab-vfx/`), Andockstelle eure Ereignisse aus §56.1.
4. **Audio-Bett (§58):** Quellen auf main, Inventar `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/INVENTORY_AND_ARCHITECTURE.md`. Motor zuerst aus `media/3D_Assets/Audio/KFB Racer/` (`KFB_Steampunk_SciFi_Engine_Idle_Loop_12s_48k.wav`, `…_Throttle_8s_48k.wav`, eigene Erzeugung), Reifen `media/3D_Assets/Audio/ElevenLabs Audio/Seamless_car_tire_ro_…mp3`, Drohne/Antigrav `media/3D_Assets/Audio/kenney_sci-fi-sounds/Audio/engineCircular_*.ogg` bzw. `spaceEngineLarge_*.ogg` (CC0). Ein AudioContext (V-042), Pitch/Volumen aus `speed`/`thrust01`, Aufprall/Landung aus den Ereignissen. Formate wie vorhanden (wav/mp3/ogg), für die Auslieferung nach ogg/mp3 wandeln.
5. **§58 Punkte 1–3** (Schatten folgt dem Ziel, Kontaktschatten in M1 über `createContactBlobs`, weniger Rückstoß an Figuren als an Wänden): einverstanden, so umsetzen.

## 16.10.2026 · L2 Schritt 5 präzisiert (V-355, Georg GO)
Schritt 5 steht jetzt im Briefing `replies/BRIEF_WS1_LOOK_RUN_L2.md` (Hub b57) mit Reihenfolge, Abnahmepaket A | B | C und Messwerten; Grundlage ist zusätzlich die Web-Chat-Diagnose `replies/WS0_SPELLSPILL_LOOK_COHESION_DIAG_R1_2026-10-16.md` (SpellSpill nur als Bildreferenz). Billigste Naht zuerst (Tonemapping-Bypass, Rim/Fresnel, Gesichtslicht), keine VFX vor bestandenem Vergleich. WS0 baut gerade die entlichteten Texturen (Goblin Bank v2, Atlantis) für Variante C.

## 16.10.2026 · Auslieferweg und ein Look für alle Schichten – V-355, V-356
1. **build.json (§57) bestätigt** als `kfb.ws1-build/1` mit `{schema, commit, date, tests, links{stage,m1,car,lineup}, notes}` (bei mehrteiligem Build zusätzlich `entry`). Bitte ab sofort bei jedem Vorschau-Push mitliefern. WSA baut die Staging-Site auf der GPT-Plattform (Hub b62); Cloudflare bleibt nur Rückfall, bis sie läuft.
2. **Ein Look für alle Schichten (V-355)** – Georg sieht Terrain, Dioramen und Figuren als getrennte Schichten. WS0-Befund an eurer Vorschau (Goblin Bank, L1/B/Knet): eingemaltes Licht in den Meshy-Texturen + Echtzeitlicht = dunkle, matschige Dioramen neben hellen, reinen Figuren; einfarbiger Hintergrund ohne Boden; unterschiedliche Oberflächen. Als **L2 Schritt 5** einplanen (nach Schritt 4 Terrain): gemeinsame Tönung/Haze/Ambient für alle Schichten aus der Bühnen-`edgePalette`, Figuren-Umgebungslicht aus der Bühne (Hemi-Boden = Bühnenfarbe), gemeinsame Knet-Detail-Normal, Himmel ≠ Bodenfarbe mit Horizont; Messung: mittlere Helligkeit und Buntheit je Schicht (Figuren, Diorama, Terrain) im selben Kamerabild, Abweichung ≤ 15 %. WS0 liefert dazu entlichtete/normierte Meshy-Texturen (Farben bleiben).
3. Schöne Überraschung im Vorschaubild: die Radial-Auswahl mit den vier Rufen + „eigene Wörter“ – bitte bis Claude Design HUD R4 so lassen.

## 16.10.2026 · Stunt-Fahren: Spender-Karte (V-351)
WS0 hat die Spender im Stunt-Car-Race-Repo, im Deformer-Lab und in k2b gesichtet: `replies/STUNT_DONOR_MAP_R1.md` (Regeln mit Fundstellen, 11 Spender mit Pfad und Status, Werte, Lücken). Bitte mit dem abgleichen, was ihr aus Georgs Recherche-Link zieht, und Abweichungen im WS1_STATUS nennen. Wichtig: kein Stunt-Spender ist abgenommen; **Anti-Roll-Stabilisierung gibt es in keinem Spender** (nur Reset nach dem Umkippen) – das ist für M2 neu zu bauen. Reihenfolge: erst die M2-Fahrprobe nach V-347, dann ein eigener M3-Auftrag „Assisted Stunt“, sobald die Web-Chat-Recherche (V-352) da ist.

## 16.10.2026 · Antwort auf WS1_STATUS §52 (Fahrprobe, Drift) – gilt V-347
1. **B · k2b bekommt den Drift 1:1 aus der Vorlage sofort**, schon vor Georgs Wahl (Q/E nur im Auto, zu Fuß bleibt Strafen). Die K2-Kommentarzeile (Δ1) ist der bekannte Fehler – K3-Fassung nehmen.
2. **A · ecctrl: Nachbau ja**, gleiche Tasten, gleiches Gefühl nach k2b-FEEL (Hinterrad-Haftung kurz senken, Gier mit `driftYawGain`, Wiedergreifen nach `regripSeconds`). Beide Systeme sollen sich in der Probe nur in der Physik unterscheiden, nicht in der Bedienung.
3. Dazu aus V-347: **enger Wendekreis** mit A/D (Wert messen und nennen), **ecctrl kippt nicht** bei Kurvenfahrt mit Vollgas (tiefer Schwerpunkt, Lenkwinkel je Tempo kleiner – wie in eurem Plan), **großes Label** „Fahrphysik A · ecctrl / B · k2b“ und Tastenliste im Info-Symbol.
4. Euren Plan für die nächste Probe (echter Dragster v3, Hangabtrieb bei k2b, Hang ist keine Wand, Ruhe-Prüfung 2 s ohne Eingabe) bestätige ich. Reihenfolge: Maßstab-Umstellung (V-345) zuerst, dann diese Probe.
5. Vergleichsleiste für Look/Tageszeit/Knet/Tonemapping: sehr gut, so beibehalten; bitte die V-346-Korrekturen (Glow, Mund-Licht, Farbtreue Knet) dort direkt mit sichtbar machen.

## 16.10.2026 · M2 Fahrgefühl: Drift, Wendekreis, Überschläge – V-347
Georg (noch kein Urteil über die Engine):
1. **Drift wie in Joyride („Tokyo Drift“):** Q/E = Drift links/rechts, analog zum Strafen beim Gehen. Spender: die k2b-Drift aus J17 (`kfb-drive.k2b.js`: `driftMinSpeed 7.5`, `driftSteerScale 1.28`, `driftDampingScale 0.28`, `driftKickScale`, `driftYawGain`, `regripSeconds 0.34`; Lab-Kopie liegt im Snapshot-Ordner nicht bei – ihr habt k2b schon im Kandidaten). Bei ecctrl die gleiche Logik als Seitenschub/Grip-Abbau nachbilden.
2. **A/D = Lenken mit engem Wendekreis:** Das Auto muss sich auf kleiner Fläche umdrehen lassen (Ziel: Wenden auf ≈ 2 Wagenlängen bei Schritttempo; Wert bitte messen und nennen).
3. **ecctrl überschlägt sich zu leicht, besonders bei hohem Tempo:** tiefer Schwerpunkt bzw. Anti-Roll, Überschlag nur bei großen Sprüngen/harten Stößen; Selbstaufrichten bleibt.
4. **Orientierung in der Vorschau:** oben klein anzeigen, welches Fahr-System aktiv ist (ecctrl | k2b), Tastenliste im Info-Symbol (W/S, A/D, Q/E Drift, Leertaste, Shift, C, R).
5. Dann neue Fahrprobe mit **gleicher Tastenbelegung** für beide Systeme; Raster G0 plus: Drift auslösbar und wieder fangbar, Wendekreis gemessen, 0 Überschläge bei Vollgas auf ebener Strecke in 20 Läufen.

## 16.10.2026 · Georgs Look-Urteile – V-346 (TUNE, bitte in einem Schritt)
1. **Look B wird Standard.** Offen: Georg sieht einen anderen Skydome als bei A – bitte prüfen/erklären (soll derselbe Himmel sein, nur getönt). **GothGirls lila Glow** ist zu stark: Randlicht deutlich zurücknehmen (Rand nur als Hauch an der Silhouette). **FBs Mundpartie** ist zu dunkel: Fill bzw. Face-Light so, dass Mund und Augen klar lesbar sind (G1).
2. **Schattenlänge:** Georg fragt, ob sie an Tageszeit/Licht hängt. Bitte als Regel umsetzen und in einem Satz bestätigen: Schattenlänge und -richtung folgen der Sonnenhöhe/-richtung von `timeOfDay` (Tag kurz, Gold lang), nicht beliebig.
3. **Tonemapping:** Licht/Figuren wirken mit ACES besser, der **Boden ohne**. Vorschlag umsetzen: ACES global, Boden-Material mit `toneMapped:false` bzw. eigener Belichtung, damit er wie „ohne“ aussieht; Bildpaar zeigen.
4. **Knet:** FB bekommt Knet (`clay=all` als Standard). GothGirl wirkt **überstrahlt** → Knet-Profil/Belichtung für sie zurücknehmen. **Fahrzeuge:** Knet immer, aber die **Texturfarben dürfen nicht ausgewaschen werden** (heute blass/staubig) → Knet nur als Relief/Rauheit, Albedo fast unverändert (Sättigung ≥ 95 % der Meshy-Textur).
5. **Abnahmebilder** von Figuren und Fahrzeugen ab jetzt immer mit Knet-Textur.
6. **Fahrprobe** (ecctrl | k2b) ist noch offen; Maßstab-Umstellung (V-345) davon unabhängig zuerst.

## 16.10.2026 · Antworten auf WS1_STATUS §46–§51 – V-345
1. **Lab-Walker (§46):** liegt jetzt nur lesend im Register-Branch: `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/donors/lab-walker-2026-10-16/` (die sechs Dateien + `SOURCE.md` mit Zeilenhinweisen). Damit sind T1–T3 frei.
2. **Maßstab (§49.4): Entscheidung WS0 – WS1 stellt auf WS0-/J17-Meter um** (FB 1,81 m = 2,94 Rig × 0,616 m/Rig, Maßstab A aus J17). Ein Faktor für alles (Figuren, Amphitheater, Meshy-Slots ≈ × 0,65), Physik-Werte (Schwerkraft bleibt 9,81, Tempi nach V-020/M1-Messung, Radradius, Sprunghöhen) mit umrechnen und testen. Grund: J17 ist Goldstandard, alle WS0-Maße (Fahrzeuge 5,18 m, Bühnen-m/u, Ränder) und die k2b-/Lab-Vorlagen rechnen in diesen Metern; mit FB 2,79 m wirkt jede Bewegung bei 9,81 m/s² zäh. Bitte **vor** dem M2-Merge, als eigener kleiner Schritt mit Testreihe.
3. **Orc Brute (§48.4):** Original auf main: `media/3D_Assets/KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb` (Rig_Large). WS0 hat im Blender-Lauf eine Fassung mit schaltbaren Original-Augen und KFB-Augenankern gebaut (`OrcBrute.kfb-eyes.r1.glb`); sie kommt nach WS0-Prüfung mit Pfad. Für die Aufstellung reicht das Original.
4. **practicals / edgePalette (§49.5):** geliefert, siehe Eintrag „Bühnen-Ränder R1“ (`data/kfb-stage-edges-r1-2026-10-16`). Steine-Kit folgt.
5. **Georgs Wahl (§47/§48/§49/§51):** als Bildfragen im Hub: Look A|B, ACES|ohne, FB mit Knet, Fahrzeuge mit Knet, Fahrprobe ecctrl|k2b (WS0 empfiehlt ecctrl + J17-Tempo als Abstimmungsziel). Bis zur Antwort: nichts umstellen, M2 nicht mergen.
6. **M1 TUNE (§50):** Ruckel-Fix und T4–T6 gesehen, danke. Weiter mit T1–T3 aus dem Snapshot.

## 16.10.2026 · Bühnen-Ränder R1 geliefert (für V-341/V-342)
Branch `data/kfb-stage-edges-r1-2026-10-16` @d4e24f15: `media/3D_Assets/MeshyModels/browser/kfb-stage-edges.r1.json` (`kfb.stage-edges/1`, 19 Bühnen) + Proofs in `.../browser/stage-edges-r1/`.
- Je Bühne: `footprint` (Schnitt mit dem Bühnenboden, 33–40 Punkte, Uhrzeigersinn von oben, Einheiten u wie `marks`), ggf. `footprintBase` (inkl. Sockel bis 1,5 m unter Boden), `edgePalette` (3–5 Farben mit Anteil, OKLab-Cluster), `terrainMode` (`ground` | `plinth` | `island`), `terrainRing` (welcher Umriss ans Terrain anschließt).
- Regel: Bodenfarbe = `fromColors(edgePalette)` (V-342). Sockel-Bühnen giza_pyramid und portal_ruin schließen über `footprintBase` an; schwebende Inseln (akashic_library, mesa_island, nature_island, snow_island) bekommen keinen Terrain-Anschluss, ihr Felsrand bleibt sichtbar.
- marble_terraces: Bühnenboden = Ursprung (untere Terrasse, −0,305 u); `figures.floorY` im Slot sagt −0,042 u (obere Terrasse) – bitte für die Figuren weiter floorY nutzen.
- `practicals[]` (Format §43.4): goblin_bank (v2) 12 Stück (5 Laternen, 3 Pendellampen, Schreibtischlampe, 3 Edelsteine), atlantis 11 (Turmkristall, Kristallportal, Kronenjuwelen, Turmfenster, Poseidons Kronjuwel, eine Feuerschale). Einige liegen hinter der Kartentafel; das ist gewollt (Licht von hinten).
- Steine-Kit folgt mit dem Blender-Lauf.

## 16.10.2026 · Portal Ruin als echtes Portal – V-343
Neue Bühne `assets/meshy-stage-portal-ruin-2026-10-16` @22e382c9: `media/3D_Assets/MeshyModels/browser/kfb-meshy-portal-ruin.screen-a.v1.glb` + `.slot.json` (8 m/u).
- Georg (Hub st05): Der Ring ist ein **Portal**: hellblau-weißer, spiralig animierter Shader (Wirbel nach innen, additiv, weicher Rand, keine Schatten) auf einer Scheibe in der Ringöffnung; ein Pool-Licht (#bfefff) beleuchtet das Runen-Podest. Ring und Schlussstein bleiben frei.
- **Billboard nicht Standard:** `billboard.defaultVisible: false`; die Knoten `kfb_screen_frame` und `kfb_screen_slot` werden standardmäßig ausgeblendet (eigene Knoten, keine Mesh-Änderung) und erscheinen nur, wenn eine Karte gezeigt wird.
- `portal.plane` im Slot-JSON ist eine Schätzung (Mitte [0, −0,04, −0,31] u, Radius 0,37 u); bitte an die Innenkante des Rings anpassen.
- Reisefunktion kommt erst mit der Weltstruktur (V-289). Einplanung: mit dem Bühnen-Einbau bzw. L2; Abnahme Bild + kurze Videoschleife.

## 16.10.2026 · Antworten auf WS1_STATUS §43–§45 – V-342
1. **Story-Farbe (§45.1, §43.1, §43.3 Punkt 1):** Georg hat recht, die Karte hat keinen Story-Mode. Entscheidung: **Bodenfarbe kommt von der Bühne**, nicht von der Karte und nicht von einer Deck-Tabelle.
   - Quelle: `fromColors(edgePalette)` der Bühne (3–5 Farben, an der Basis gemessen). WS0 trägt `edgePalette` und `footprint` je Bühne mit dem Blender-Lauf R1 (17.10., b51 §E) in die Bühnen-Deskriptoren ein. Damit passt der Boden auch zum Terrain-Übergang (V-341).
   - Bis dahin: die heutige Bühnen-Tönung (V-286) als Platzhalter, **kein Story-Tint**. Die Ableitung aus dem Kartentext (`world-context`/computeContext) fliegt raus.
   - Story-Mode wird Spielzustand, gesetzt durch den W6-Wurf (Option A, später). Dann tönt `fromStoryMode(gewürfelt)` als Akzent (Licht/Rand), nicht den ganzen Boden. Den Würfel-Look liefert Claude Design mit HUD R4; WS1 baut ihn erst danach.
   - Korrigiert: V-331 Punkt 2 und L2 G6 lauten jetzt „Bodenfarbe aus der Bühne (edgePalette)“.
2. **Walker-Vorlage (§44.3, §45.2):** Die Lab-Fassung liegt lokal auf demselben Mac (nur lesen, Lab 5192 läuft für Georg): `~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/`
   - `src/main.ts` ab Zeile ≈ 307: Tastenbelegung und WoW-Maus (RMB lenkt die Figur, A/D strafen; LMB nur Kamera; beide = vorwärts; Tasten werden nur bei gedrückter Maustaste umgelegt, Z. ≈ 532–535); Z. ≈ 356: Leertaste-Antippen kürzer als ein Frame springt trotzdem.
   - `src/play/travel.ts` (`TravelKeys` inkl. `turnA`), `src/play/vendor/travel-core.j17.js` (Schema `wsa6`; Sprünge je Zustand Z. ≈ 168: stand / short aus Joggen / long mit Boost), `src/play/vendor/walk-controller.js`, `locomotion-profiles.v1.js`, `src/play/figure.ts` (Walker, gemessene Profile).
   - V-199 (1) ist dort behoben (Q/E strafen auch im Stand), nicht den alten Fehler übernehmen.
   - **Flug:** Ein gemessener Flug-Controller existiert im Lab **nicht** (V-024 war TBD). Freigabe als Neubau mit Vorlagen-Zeile (V-001 erfüllt durch diese Freigabe): WoW-Flug – Doppel-Leertaste im 400-ms-Fenster hebt ab (V-179); im Flug W vorwärts in Blickrichtung (mit RMB steuert die Kameraneigung das Steigen), A/D drehen, Q/E strafen, Leertaste halten = steigen, X halten = sinken, Shift = Schub; Bodenkontakt unter Landetempo = Landung und zurück ins Gehen. Look und Pose aus `KFB HUD Flight Board - Flight VFX/.../hud-flight/kfb-flight-vfx.js` (main: `hoverPose`, `FLIGHT_IDLE`, Takeoff/Land-Puff, Speed-Trails).
3. **Reihenfolge (§44.2, §45.3):** bestätigt. M1 TUNE vor M2; Owner-Sitzung wie in §45.3 (Kamera „Nah“ → L1 ohne Farbe → V-305-Einbau nach Punkt 1 → L1-Bildreihe → L2 Schritt 1–4).
   **Abnahme-Raster M1 TUNE (V-312):**
   - T1 V-022: im Stand A/D drehen, Q/E strafen (auch ohne W); RMB: Maus lenkt, A/D strafen; LMB nur Kamera; beide Tasten = vorwärts.
   - T2 V-023: Leertaste im Stand = Sprung auf der Stelle; aus Joggen = vorwärts; Shift+Leertaste aus Sprint = Weitsprung (Jump_Full_Long).
   - T3 Doppel-Leertaste < 400 ms = Abheben; einzelne Leertaste hebt nie ab; > 400 ms = zwei Sprünge.
   - T4 Flug nach Punkt 2; Frametime im Flug p95 ≤ 20 ms und ≤ 1,2 × Boden; Kamera ohne Ruckeln.
   - T5 Rampe auf der START-Achse begehbar, G = Geh-Umschalter, weiches Aufsetzen ≈ 0,15 s, Info-Symbol unten links.
   - T6 Figur folgt Hügeln statt durchzulaufen (V-199 (3)).
4. **Lokale Lichter (§43.3 Punkt 2, §45.2):** Pool-PointLight + additiver Leuchthof (`halo`) freigegeben. Emissions-Masken nur, falls die Höfe aufgesetzt wirken; dann liefert WS0 sie je Bühne. `practicals[]` für Goblin Bank v2 und Atlantis trägt WS0 im Format §43.4 ein (Blender-Lauf R1).
5. **Kontaktschatten KayKit (§43.3 Punkt 3):** freigegeben: nur Körper und Füße, Kopf ausgenommen. Weicht das Gesicht trotzdem messbar ab, kommt die Frage nach einer neuen Studio-Referenz zu Georg.
6. **Tonemapping (§43.3 Punkt 5):** Bildpaar ACES | ohne zeigen; Georg wählt. Kartenfläche bleibt `toneMapped: false`.
7. **Kamera „Nah“ (§44.2):** freigegeben, Ziel = Kartenmitte.
8. **Dioramen ins Gelände (§44.2):** Vorlage ist jetzt L2 Schritt 4 (V-341) plus WS0-Lieferung (Steine-Kit, `footprint`, `edgePalette`). Terrain-Spender: der Lab-Inselboden (`src/island`, Höhenfeld + Clay-Oberfläche) – erst Vorlagen-Zeile.
9. **Info-Symbol (§44.3):** passt; mehr HUD erst mit Claude Design HUD R4.

## 16.10.2026 · Look-Lauf L2 – V-340
Neuer langer Auftrag `replies/BRIEF_WS1_LOOK_RUN_L2.md` (Hub b57): baut auf L1 (V-329) auf. Drei Schritte, ein Lauf, Raster G1–G10 selbst messen, keine Prüferrunden: (1) L1 + warmer Krazy-Kat-Look B neben J17-Kontrolle A, Licht-Identität je Figur als Daten; (2) ein Knet-Material für KayKit-Figuren und alle Meshy-Fahrzeuge; (3) Aufstellung aller 14 Fahrzeuge + FB + Orc. Fahrzeuge: `assets/meshy-arcade3-marble-vehicles3-2026-10-16` @9bd8e037 (13 Racer v3 + neu `wasteland_beetle/`). M1 TUNE / M2 nicht umordnen; Einplanung bitte im WS1_STATUS. Fluff-HUD nicht bauen (kommt über Claude Design HUD R4).

## 16.10.2026 · Nachtrag zu V-333: Ziel-Pfeil in der Welt – V-334
- Georgs Vorbild ist WoW *Undermine*: Der 3D-Pfeil schwebt **über der Spielfigur bzw. dem Fahrzeug** in der Welt, nicht in einer HUD-Ecke; am Ziel ein Ring. Im HUD nur Name + Distanz (+ im Flug ↑/↓, Δ-Höhe). Mechanik aus V-333 bleibt (Gierwinkel, Flug-Neigung, ehrliche Distanz); der Overlay-Pass entfällt, Pfeil und Ring sind normale Objekte der einen Szene.
- Look von HUD, Pfeil, Ring und neuem **Social-Call-Radialmenü** (KayfaBINGO/BONGO/BOGGLE/Blödsinn! + eigener Text; die Spielfigur spricht die Wahl in ihrer eigenen Blase) kommt von Claude Design (HUD R4, `replies/HUD_R4_DESIGN/`). Bitte nichts davon vor der Design-Lieferung stylen; Mechanik-Vorarbeit hinter `?debug=1` ist ok.
- Beobachtung in `ws1-preview` (Intro-Ritual): das Kartenbild ragt rechts aus dem Kartenrahmen. Bitte bei Gelegenheit prüfen.

## 16.10.2026 · HUD-Kompass als 3D-Objekt – V-333
Georg will den Kompass/Entfernungsmesser für Quests und POIs im HUD. Heute ist dort (HUD R3) ein statischer SVG-/CSS-Pfeil: nur Nordrichtung, keine Distanz, keine Höhe.
- **Ziel:** ein echtes 3D-Clay-Pfeil-Objekt (GLB) im HUD, gerendert als Overlay-Pass im **einen** Three.js-Renderer (kein zweiter Kontext). Ein aktives Ziel (`TargetRef`: Quest/POI) mit Name + Distanz; Distanz ehrlich als „Luftlinie ~m“, solange keine Routenlänge existiert, keine erfundene ETA.
- **K1 (HUD-Slice nach M2):** Gierwinkel relativ zur Blickrichtung (`targetBearing − playerHeading`, kürzester Weg, gedämpft), Distanz, zu Fuß und im Fahrzeug ruhig waagrecht. Nähe-Farbe nur zusätzlich, nie allein.
- **K2 (mit Flugmodus V-274):** Pflicht-Neigung `pitch = atan2(Δy, max(hypot(Δx,Δz), ε))` um die lokale Querachse des Pfeils, kleiner Horizontring, ↑/↓ + Δ-Höhe; bei Ziel fast senkrecht: letzten Gierwinkel halten, „direkt über/unter“ anzeigen statt Zittern. Baut den Pfeil in K1 schon so, dass die Neigung nur freigeschaltet wird.
- **Asset:** WS0 liefert `kfb_hud_compass.glb` (Gehäuse aus KayKit RPG Tools Bits `compass_base`, CC0 auf main, + Clay-Nadel, Pivot in der Mitte, Nadel zeigt +Z) mit Pfad und Bild im nächsten Eintrag. Bis dahin Platzhalter nur hinter `?debug=1`.
- **Abnahme K1:** Bildpaar Ziel vorn / hinten / links; Pfeil dreht beim Umdrehen korrekt um; Distanz ändert sich stetig. **K2:** Prüfbilder Ziel waagrecht, +30°, −30°, senkrecht drüber.
- Quelle: Web-Chat R0.3 (`recovery/kfb-minigames-fluff-source-bridge-2026-10-15`, `skills/chat/recovery/KFB_HOME_RETURN_STONE_POI_3D_COMPASS_R0_3_2026-10-15.md`); Owner dort = Lab ist überholt, Laufzeit = WS1 (V-228). Ruhestein/Taschenportal aus demselben Dokument sind **nicht** Teil davon.

## 16.10.2026 · Antworten auf alle offenen WS0-Punkte (§32–§42) – V-331
1. **Auslieferweg (§40.6):** siehe V-314 – Branch `ws1/preview` → `https://ws1-preview.kayfabizarro.pages.dev/`; ihr dürft Georg die URL geben. Gilt auch für den M1-Zwischenstand.
2. **V-305-Einbau (§40.7):** freigegeben wie eure **Hauptvariante**: `kfb-cartoon-palette.js` 1:1 vendoren, `fromStoryMode(story-mode der Karte, 0)`, Story-Farbe auf dem Boden; Rollen Rahmen=`strang`, Pfosten=`trunk`, Leiste=`pad`/`cloud`, Himmel=`sky`→`cloud`, Gelände=`top`; Meshy 18 % zum Boden-Farbton; `island-palettes.js`, Genre-Tabelle und `palv=b` entfallen. Tageszeit-Regel für Himmel/Nebel steht im Licht-Briefing (`BRIEF_WS1_LIGHT_R1.md`). Bildreihe je Story-Mode + Paar heute | V-305 wie vorgeschlagen.
3. **Vorderer Ring / Rampe (§39.4 a/b):** Die Bühne muss zu Fuß erreichbar sein (Begegnung am Diorama, V-288). Bitte eine unsichtbare Rampe (Kollider) vor dem vorderen Ring auf der START-Achse, ≈ 3 m breit. Das WS0-Kollisionsnetz fürs Amphitheater entfällt für MVP-0; begehbare Netze kommen künftig je Bühne als optionales `walkable`-GLB im Bühnen-Deskriptor.
4. **Zaunhöhe (§38.3):** Variante **(a)** bleibt.
5. **V-248 Gehen/Sprint (§33.1, §39.4 d):** Rutschen 0,47/0,21 ist Clip-Eigenschaft – für MVP-0 **nicht blockierend**. Später Gehen/Sprint aus der Motion-Library-v7-Gangleiter (LOCOMOTION-LADDER-02) mit gemessenem Rutschen < 0,1 tauschen.
6. **Harter Halt beim Aufsetzen (§39.4 e):** weiches Abdämpfen (≈ 0,15 s) ist freigegeben.
7. **Strg auf dem Mac (§35.4):** G als Geh-Umschalter.
8. **V-023 Sprungarten:** nicht Teil von MVP-0.
9. **m1-gait vs. anim.mjs:** m1-gait ist das eine Gang-Modul; anim.mjs bleibt weg.
10. **Eigene M1-Schleife (§32):** bei M2 in die eine Host-Schleife zurückführen.
11. **Bewegtes Bildpaar Studio | M1 (V-214):** erst zum Meilenstein-Ende.
12. **Bühnen-Deskriptor `kfb.stage-descriptor/1` (§40.3):** freigegeben, ergänzt um `practicals[]` (V-329) und optional `walkable`.
- **Neu für die Bühnen-Vorlagen:** Arcade v3 (Billboard vor dem Neonschild) und Marmor-Terrassen sind von Georg PASS (V-330): Branch `assets/meshy-arcade3-marble-vehicles3-2026-10-16` @2633f354, dazu Fahrzeuge v3 (×1,5, Racer ≈ 5,2 m, `rigClassScale` large 1,70; Georg: Ohren dürfen im Auto knicken, V-321).

## 16.10.2026 · Licht-Auftrag L1 (V-329) – beantwortet §38.2 und Intake #404
- Briefing: `replies/BRIEF_WS1_LIGHT_R1.md`. Kurz: ein Licht-Schreiber; `timeOfDay` mit Tag (J17: Sonne #fff4e6/2,9, Hemi #eef4fa/#9a8a78/1,05, Gegenlicht #ffe6d6/0,6, Elev. ≈ 49°, Az. ≈ −53°), Goldener Stunde (E50 aus light-presets.json) und Story-Nacht; Farben aus V-305; Karte nie umgefärbt; nur die Sonne wirft Schatten (enger texel-gerasteter PCFSoft-Frustum, nur Figuren/Fahrzeug/Leit-Requisiten), Meshy-Dioramen werfen keine Echtzeit-Schatten; Kontaktschatten für alle Figuren; lokale Lichtquellen `practicals[]` je Bühne (Emission + Pool von 4–6 PointLights ohne Schatten).
- Probe L1 parallel zu M2 (M2 nicht umordnen): Dialogszene + Goblin-Bank v2 + Atlantis, je Tag/Gold/Nacht, 16:9 und 9:16; Raster G1–G5 im Briefing; Abnahme live über ws1-preview.
- Bitte bestätigt das `practicals[]`-Format im Bühnen-Deskriptor; dann trägt WS0 die Lichtpunkte für Goblin-Bank und Atlantis nach.

## 16.10.2026 · Deck-Songs im Hauptstand (jukebox.json)
- main @2ecac226 (PR #405): `media/3D_Assets/Sounds/kfb_deck_songs/<deckId>__suno_<ver>/` für wrinkle_rumble 01a, help_i_am_a_human 01e, kayfabizarro_monomyth_mayhem 01c, kayfabizarro_philosophy 01d – Mix, Stems, `meta.json` (kfb.deck-song.v1: bpm, Stimme, Dauer, sha256), Karaoke-`.srt` (eine Zeile je Karte, gegen den Mix getaktet). `jukebox.json` hat 4 neue Einträge (`group: "deck_songs"`, `deckId`, `srt`).
- Bitte bei Gelegenheit: Box-Stop-Radio liest jukebox.json noch fest von f510a35 → Pin auf main nachziehen; `srt`/`group`/`deckId` liest bisher kein Code (für Karaoke bzw. Deck-Performance V-279/V-298 später).
- Karten-Clips je Karte (Stimme bzw. mit Musik) und getaktete takes liegen im KFB_HUB `40_AUDIO/<deckId>__suno_<ver>/` (nicht im Repo).

## 15.10.2026 · Neue Bühnen: Grüne Ruinen (Verdant Ruins) + Alien-Werkstatt (V-318)
- **Branch** `assets/meshy-stages-verdant-alien-2026-10-15` @228f7459 (Parent main), `media/3D_Assets/MeshyModels/browser/`:
  - `kfb-meshy-verdant-ruins.screen-a.v1` – Meshy-Community (CC0), 12 m/u, Karte als Attika-Tafel auf dem Triumphbogen (Sandstein + Moosband, 5,3 × 2,9 m), Kampf auf der versunkenen Plaza ≈ 28 m²; Rücktreppe 6 × 0,16 m begehbar, Vordertreppe endet 0,85 m über der Plaza → Kollider mit Stufe/Rampe. GLB 17,4 MB (dichte Moos-Textur).
  - `kfb-meshy-alien-workshop.screen-a.v1` – 6 m/u, Innenraum ≈ 11,4 × 8,3 m, Karte als genieteter Laborschirm vor dem Globus-Monitor (2,2 × 1,2 m), Kampf vorn ≈ 9 m²; Leitertreppe 46° nur als Kletter-Kollider.
- Georgs Bestätigung: Hub st04. Einbau nach MVP-0 als Vorlagen-Zeile.

## 15.10.2026 · Fahrzeuge v2: Größe für Medium-Rigs + Logos überklebt (V-315)
- **Branch** `assets/meshy-dieselpunk-vehicles-2026-10-15` @d26b6860: jetzt alle 13 Fahrzeuge, je `<id>_browser.v2.glb` + `<id>.kfb-vehicle.v2.json` neben v1. v2 = v1 × 1,92 (sitzender FB mit Ohren passt in die geschlossene Kabine des Dragsters, Dach 5,8 cm); Racer ≈ 6,6 m, Laster ≈ 8,6 m. `rigClassScale { medium: 1.0, large: 1.33 }` (large = Vorschlag). Anker, Radstand, Spur, Radius, Kamera, Kollision mitskaliert.
- **Logos:** graffiti_jet_cruiser, ironclad_wrecker, street_racer_hoverbeast überklebt (Textur `*_basecolor_v2_aufkleber.webp` ist in der v2-GLB).
- **Bitte:** Fahrzeuggröße als Laufzeit-Regler (Georg urteilt beim Fahren; Hub dv02: evtl. ~×1,5, wenn Ohren knicken dürfen). Erstes Auto bleibt crimson_flame_dragster.

## 15.10.2026 · M2: erstes Auto = Flammen-Dragster, Autos werden größer (V-315) · Cabrio später (V-316)
- **Erstes Auto:** `crimson_flame_dragster` (Georg, Hub dv01). Bis die v2-Größe da ist, den v1-Branch nutzen und den Laufzeit-Faktor offen lassen.
- **Größe:** Georg: Autos größer, damit FB plausibel hineinpasst. WS0 misst den Faktor (sitzender FB mit Ohren passt in die geschlossene Kabine) und liefert alle Racer als v2 mit `rigClassScale { medium, large }`. Bis dahin bitte Größe als Laufzeit-Faktor je Rig-Klasse vorsehen.
- **Später (V-316, nicht M2):** FB sichtbar im Cabrio wie J17: wenig Körperbewegung, flatternde Ohren, Kopf/Schulter neigen sich in Kurven, Hände halten Kontakt zum Lenkrad des Modells.

## 15.10.2026 · M2-Fahrzeuge da: 10 Dieselpunk-Racer auf Asset-Branch (V-311, V-313)
- **Branch** `assets/meshy-dieselpunk-vehicles-2026-10-15` @9f5c0f48 (Parent main), `media/3D_Assets/MeshyModels/vehicles/<id>/`: `<id>_browser.glb` (100–120k Dreiecke, 3,5–6 MB, WebP 2048), `<id>.kfb-vehicle.json` (Form wie bathtub_kart, `entryMode: "hop-in-hidden"`), `<id>_receipt.json`.
- **Fahrzeuge:** brasswing_roadster, crimson_flame_dragster, crimson_thunderjet (offen/Cabrio), iron_phantom_hovercar, ironclad_skycruiser, jetbound_roadster, rust_runner, rustfire_interceptor (ohne Scheiben), rustwing_cruiser, rustwing_hauler (Laster). Nicht auf dem Branch: graffiti_jet_cruiser, ironclad_wrecker, street_racer_hoverbeast (echte Markenlogos auf der Textur – erst übermalen).
- **Normierung:** Front +Z, Boden y = 0, KayKit-Rig-Einheiten (1 Rig = 0,6164 m, Figuren 1:1); Racer ≈ 5,6 Rig = 3,45 m, Laster ≈ 7,3 Rig = 4,5 m. Größe bitte als Laufzeit-Faktor einstellbar (Georg urteilt beim Fahren).
- **Räder:** bei allen Rad-Fahrzeugen mit der Karosserie verschmolzen (nicht sauber schneidbar) → leere Naben-Anker `kfb_wheel_FL/FR/RL/RR` (Ursprung Nabenmitte, Spin lokal X, Extras `kfb_fused`, `kfb_radius`), Radstand/Spur/Radius im JSON → unsichtbare ShapeCastWheels auf diese Anker. Schwebe-Fahrzeuge: `kfb_hover_FL/FR/RL/RR`. Bodenfreiheit im Netz fast 0 → Fahrhöhe als Laufzeit-Wert (Vorschlag 0,35–0,6 Rig).
- **Weitere Anker:** `kfb_entry` (Bodenpunkt an der linken Tür), `kfb_driver_hidden`, `kfb_camera_follow`.
- **Welches zuerst:** Georg wählt im Hub (dv01); Vorschlag WS0: rustfire_interceptor oder jetbound_roadster. G0 mit Platzhalter läuft davon unabhängig.
- **Maßstab-Hinweis:** FB_TEMPLATE_LOOK_v5b misst 2,94 Rig = 1,81 m mit Ohren (nicht 2,16 m), Orc Brute 4,19 Rig = 2,59 m – bitte gegen euren kanonischen Faktor prüfen und melden.

## 15.10.2026 · M2 freigegeben (V-313) · Auslieferweg = Branch-Vorschau ws1/preview (V-314)
- **M2 „Fahren übers Gelände“:** euer Entwurf passt und ist so beauftragt. Freigegebene Fassung mit WS0-Ergänzungen und Antworten auf eure fünf Fragen: `replies/BRIEF_WS1_M2_FAHREN_R1.md` (Abschnitt „WS0-Freigabe und Ergänzungen“). Kurz: G0-Vergleich k2b vs. EcctrlVehicle **sofort mit Platzhalter**; erstes Fahrzeug ein Dieselpunk-Racer zum Hineinhüpfen, Asset kommt von WS0 (Räder als Knoten mit Naben-Drehpunkt, Anker); M2 = die eine Fahrzeug-Steuerung; viel Fahrhilfe als ein Tuning-Objekt; Raster: Aufrichten < 2 s, 0 Durchfahrten in 20 Replays, 60 fps Median, kein Frame > 33 ms beim Sprung.
- **Auslieferweg (§40.6):** Branch `ws1/preview` mit nur dem statischen Bundle (`index.html` in der Wurzel) → `https://ws1-preview.kayfabizarro.pages.dev/`. Pages liefert `media/2D_Assets`, `media/3D_Assets`, `.md/.fbx/.zip` nicht aus, max. 25 MiB je Datei → Assets ins Bundle. Push = Vorschau-URL; ihr dürft Georg die URL geben, bitte mit Commit in WS1_STATUS; WS0 stellt sie in den Hub. Gilt sofort auch für den M1-Zwischenstand.

## 15.10.2026 · SOFORT: Prüfstrategie verschlanken (V-312) – keine Vollcode-Prüfer je Runde mehr
- **Georg:** Blinde Prüfer lesen je Runde ~280k Token Code und laufen ~35 min Browser, mehrfach; danach wird nachgebaut und alles läuft neu. Beim jetzigen Spielstand unsinnig und Token-Verschwendung. Das war ein Planungsfehler von WS0 (Abnahme-Kette G3 „blinder Prüfer bei sichtbaren Teilen“) – nicht euer Fehler. G3 ist geändert.
- **Ab jetzt:** (1) Jede Aufgabe kommt mit einem Abnahme-Raster aus Georgs Vorgaben (messbar + feste Bildserie); wo es fehlt, fragt WS1 WS0 danach, statt einen Prüfer laufen zu lassen. (2) WS1 prüft selbst nur den Diff: geänderte Module + kurzer Browser-Rauchtest mit fester Kamera-/Bildserie, Ziel ≤ 5 min, keine Vollcode-Lektüre. (3) Regress-Tests bleiben automatisch. (4) Blinder Prüfer nur einmal am Meilenstein-Ende (MVP-0-Abnahme), nur auf Diff + Bildserie. (5) Nichts nachbauen auf Prüfer-Hinweise, die nicht im Raster stehen – erst an WS0 melden.
- **Laufende Prüferrunden** (§39 „vierter Prüfer“): bitte jetzt beenden; offene Auflagen als Liste an WS0, WS0 entscheidet, was davon zählt. Je Runde im WS1_STATUS Token- und Minutenverbrauch ausweisen.

## 15.10.2026 · Bühnen v2 nach Georgs Antworten + Retro-Arcade-Casino (V-306, V-309)
- **Branch** `assets/meshy-stages-v2-arcade-2026-10-15` @8cf2ec71 (Parent main), unter `media/3D_Assets/MeshyModels/browser/`. Ersetzt für diese Bühnen die v1-Slots:
  - `kfb-meshy-goblin-bank.screen-a.v2` – Karte statt grüner Kurstafel an der linken Wand (Messingrahmen, 3,6 × 2,0 m, 2 Konsolen 0,37 m vor der Wand wegen der Laternen).
  - `kfb-meshy-prison-panopticon.screen-a.v2` – Stahlrahmen-Billboard oben mittig auf dem Ringdach-Geländer (7,1 × 4,0 m, Unterkante 8,7 m), Parole frei.
  - `kfb-meshy-utopia-stage.screen-a.v2` – Display ohne Abstand nach oben direkt vor dem Monitor, deckt den Monitor-Fuß (Fuß ist Teil des Meshy-Netzes, nicht schneidbar).
  - `kfb-meshy-retro-arcade-casino.screen-a.v1` – neue Bühne, 8,5 m/u, Billboard über dem Galaxy-Neonschild (Chrom-Clay, pinkes Band, 4,8 × 2,7 m), Kampf ≈ 21 m² auf dem Stern-Mosaik, zwei Treppen 0,14 m begehbar (Stufen-Kollider), Galerie +2,9 m.
- Georgs Bestätigung: Hub st03. Einbau nach MVP-0, je Bühne eine Vorlagen-Zeile; Platzierung später per God-Mode-Editor (V-306).

## 15.10.2026 · Georgs Hub-Antworten: Farbmodell PASS, Bühnen-Abnahmen, Display-Editor (V-305, V-306)
- **Farben (V-305):** Harmonie-Modell PASS. Einzige Quelle für Paletten ist jetzt `replies/COLOR_HARMONY_R1/kfb-cartoon-palette.js` (`fromHue`, `fromColors`, `fromStoryMode`, `random`; README dort). Story-Farbe bleibt auf dem Boden. Fluff: High = satte, Low = dunkle Story-Mode-Farbe. Die Paletten-Vorlage V-270 (Hub pal02) ist überholt – bitte die Rollenfarben aus dem Generator ziehen statt aus den Joyride-Einzelpaletten (der Generator baut J17 mit ΔE ≈ 0,025 nach). Meshy-Tönung 18 % bleibt (V-286).
- **Schatten:** Georg hat gesehen, dass GothGirl jetzt Schatten wirft (§38) – danke. Das Licht-Briefing (Tageslicht-Basis, einheitliches Schatten- und Farbkonzept, §38.2) liefert WS0 nach.
- **Bühnen (V-306):** st01 PASS alle; Köln echter Maßstab 1:1 (ggf. später kleiner, betrifft OSM-Skalierung und Zellgröße Destruction-Mech); Dystopia Standard = B unten vor dem Rolltor; Goblin-Bank: Karte statt grüner Kurstafel; Gefängnis: Spruch bleibt, Billboard mit Stahlrahmen oben mittig am Geländer; Atlantis: am Turm; Utopia: ohne Sockel, raumsparend schwebend/an der Wand. WS0 baut die geänderten Fassungen (v2) und meldet neue Branches.
- **Display-Editor (präzisiert V-287):** Alle 3D-Billboards und die Hypernormalisation-Display-Modelle sind im God-Mode per 3D-In-Place-Editor frei verschieb-, dreh- und skalierbar, mit responsivem Seitenverhältnis für den KFB-Karten-Fit. Unsere Platzierungen = Standardwerte. Für MVP-2 einplanen.

## 15.10.2026 · Neue Bühne: Atlantis (Hidden-History-Decks)
- **Branch** `assets/meshy-stage-atlantis-2026-10-15` @d3326a6a (Parent main): `media/3D_Assets/MeshyModels/browser/kfb-meshy-atlantis.screen-a.v1.glb` + `.slot.json` – 11 m/u, Insel Ø ≈ 20,5 m, Karte als versunkene Tempeltafel am Kristallturm (Sandstein + blaues Einlageband, 4,7 × 2,6 m), Kampf auf dem unteren Dreizack-Mosaik (≈ 7,5 × 3,3 m, eben), obere Plaza 2,7 m höher. Haupttreppe 12 × 0,22 m (≈ 40°, nur 0,7–0,8 m breit) → Rampen-Kollider; Turmportal-Stufen dekorativ.
- Georgs Abnahme der Platzierung offen (Hub at01). Einbau nach MVP-0 als Vorlagen-Zeile, wie Goblin-Bank/Gefängnis.

## 15.10.2026 · Neue Bühnen: Goblin-Bank + Gefängnis-Panoptikum (V-300/V-301) · Atlantis folgt
- **Branch** `assets/meshy-stages-goblin-prison-2026-10-15` @48b0f492 (Parent main), unter `media/3D_Assets/MeshyModels/browser/`:
  - `kfb-meshy-goblin-bank.screen-a.v1.glb` + `.slot.json` – 5 m/u, Karte als Kurstafel über der Galerie (Messing-Knetrahmen, 4,2 × 2,3 m), Kampf in der Schalterhalle vor dem Tresor (~4,2 × 3,2 m), Treppe 14 × 0,20 m (42°) begehbar, besser Rampen-Kollider. Feine helle Säume an Schreibtisch-/Teppichkanten kommen aus der Vereinfachung.
  - `kfb-meshy-prison-panopticon.screen-a.v1.glb` + `.slot.json` – 12 m/u, Karte als Propaganda-Schirm der Wärter unter der Wachturm-Krone (Rost-Eisen, 5,0 × 2,8 m), Hof Ø ≈ 13 m, Kampf ≈ 30 m² vor dem Brunnen, Treppe 32 × 0,21 m (31°) begehbar. Für später (Gizmo-Labyrinth, V-301): Anschluss vorn 7,8 m offen, Schaltpult-Platz oben auf dem Turm (Messwerte im Receipt, lokal bei WS0).
- Slot-JSON im UFO-Format mit Standardkamera; Display = eigenes Objekt, Position aus dem Slot nur als Standardwert (V-287). Georgs Abnahme der Platzierung offen (Hub gb01, pr01) – Einbau nach MVP-0 als je eine Vorlagen-Zeile.
- **Atlantis** (Hidden-History-Decks) wird gerade gleich aufbereitet und folgt auf eigenem Branch.

## 15.10.2026 · Farbkonzept R1 liegt vor (Entwurf) · alte Fahrbahn-/Bandenfarben
- **Einzige Farbquelle (Entwurf, Georg klärt Lücken):** `replies/COLOR_CONCEPT_R1.md` + `replies/kfb-color-concept.r1.json` (Werte 1:1 aus Quellen mit Blob/Commit). Bitte lesen; noch nichts umbauen außer der Tönung nach V-286.
- **Sofort korrigierbar (Register V-102/V-174):** Fahrbahn `#3d4a60` statt `#545e7a`, Banden/Randstrang `#ef5a22` statt rot-weiß (rot-weiß nur Kerbs). Das Farbkonzept fand die alten Werte in eurem Lab-Stand.
- **Offen bei Georg:** Story-Mode Absurd (Ocker oder Magenta), Fluff-Farben je Story-Mode, Regel für dunkle/sattere Variante, Stärke der Meshy-Tönung.

## 15.10.2026 · Reisen: freie Fahrt übers Gelände (V-290), Dramaturgie (V-288), Welt offen (V-289)
- **Dramaturgie:** Grund zu reisen → Reisen macht Spaß → Begegnung am Diorama als Höhepunkt (V-288).
- **Fahren (V-290, ersetzt die feste Vorgabe J17 k2b aus V-251):** rasante Cartoon-Fahrt mit plausibler Physik direkt übers Gelände, Hügel als Rampen, Überschlag erlaubt und Selbstaufrichten, kein Racetrack nötig. Bitte für MVP-1 eine Vorlagen-Zeile: J17-k2b-Fahrgefühl vs. Fahrzeug-Controller im R3F/Rapier-Rahmen auf einem Testgelände (Hügel, Rampe, Überschlag), Messwerte + kurzes Fahrvideo; Vorschlag, welcher schneller und zuverlässiger ist. Fahrzeug für die Probe: Badewannen-Kart (WS0, folgt auf Asset-Branch) oder Cicada.
- **Welt-Struktur (V-289):** offen, Konzept `replies/WORLD_CONCEPT_R1.md`; nichts dazu bauen, bis Georg entscheidet.

## 15.10.2026 · Displays im God-Mode frei platzierbar (V-287)
- Karten-Displays/Billboards sind Objekte wie Residents und Librarian-Props: im God-Mode (MVP-2) verschieben, drehen, skalieren – proportional mit festem Format 1,79:1, vom kleinen Monitor bis zur Stadionleinwand. Gespeichert in `kfb.world/1`.
- **Folge für den Bau jetzt:** Display = eigenes Objekt (Rahmen-Familie je Bühne + `kfb_screen_slot`), nicht mit dem Bühnen-GLB verschmolzen. Die `*_screen.glb` von WS0 enthalten Slot/Rahmen nur als Start-Platzierung; beim Einbau Rahmen + Slot als eigenes Objekt laden und die Position aus dem Slot-JSON als Standardwert nehmen. Auch das Amphitheater-Billboard ist nur Arbeitshypothese.

## 15.10.2026 · Farben: Meshy-Bühnen nur leicht tönen (V-286)
- **Georg:** Meshy-Bühnen nur leicht tönen; die Palette wirkt auf Rahmen und Requisiten. Konkret: Die Rollen-Umfärbung der Amphitheater-Textur (stone/paved, Anteil 0,85) zurücknehmen auf eine leichte Tönung (Vorschlag: höchstens ~15–20 %, Textur bleibt lesbar). Die volle Palette (sechs harmonische Farben mit Rollen) gehört auf Billboard-/Display-Rahmen, Pfosten, Requisiten, Fluff, Himmel und Licht.
- **Farbkonzept wird konsolidiert:** WS0 schreibt `replies/COLOR_CONCEPT_R1.md` + `kfb-color-concept.r1.json` (Welt-Paletten, Story-Modes, Fluff-Farben je Story-Mode, dunkle und sattere Variante) als einzige Farbquelle. Bis dahin an den Farben nichts Neues bauen; nur die Tönung zurücknehmen, als Vorlagen-Zeile mit Bildpaar vorher | nachher.

## 15.10.2026 · Antworten auf §33–§35 (V-283)
- **Ränge (§35.6):** Option 2 – in MVP-0 sind die Ränge Kulisse ohne Begehen; die Kollision soll das Betreten verhindern. Die Prüfung „Ränge“ gehört nicht zur MVP-0-Abnahme. Fuß-IK/Stufenlogik kommt später als eigene Vorlagen-Zeile (MVP-1; zuerst Spender in J17/Lab suchen).
- **Kollisionsnetz Amphitheater (§34.4/§31):** WS0 baut ein vereinfachtes Kollisionsnetz (Rückwand-Sockel, Ränge als saubere Blöcke) und liefert es als eigenes GLB; bis dahin die Rückwand-Stelle nur berichten.
- **Paletten V-270 (§34.1):** Bilder liegen bei Georg im Production Hub; sein Urteil kommt hierher. Gleiche Akzente canyon/kfb_town: so lassen, bis Georg etwas sagt.
- **Offene Prüfer-Punkte (§35.4):** WS0 beantwortet sie gesondert, sobald geprüft (eigene Schleife, m1-gait vs. anim.mjs, Strg auf dem Mac, V-023, Bildpaar gegen das Studio). Bis dahin nichts davon umbauen.

## 15.10.2026 · Bühnen-Assets: Bibliothek mit Slot, Dystopia, Utopia, Comic (V-264, V-268, V-281)
- **Bibliothek vermessen:** Branch `assets/meshy-stages-library-dystopia-2026-10-15` @8e7519ea, `media/3D_Assets/MeshyModels/browser/kfb-meshy-utopia-library.screen-a.v1.glb` + `.slot.json` – `kfb_screen_slot` + `kfb_screen_frame` (antiker Knet-Holzrahmen, Wandbild über der Galerie, 3,41 × 1,90 m, 5,5 m/u, Standardkamera im JSON). Ersetzt für den Einbau die Fassung ohne Slot.
- **Dystopia-Gasse:** gleicher Branch, `kfb-meshy-dystopia-alley.screen-a.v1.glb` (6 m/u, Display ohne Sockel vor der Hypernormalization-Tafel). Georgs Abnahme offen – bis dahin nicht einbauen.
- **Utopia + Comic-Broadcast:** `assets/meshy-stages-utopia-comic-2026-10-15` @8ce77add (Comic PASS; Utopia Wand-Display nach TUNE, Abnahme offen).
- Alle Slot-JSONs im UFO-Format (Ecken, UV flipY = false, Sichtöffnung, Maßstab, Standardkamera, Rahmen). Weitere Bühnen (Theater, Giza, Köln mit Roncalliplatz, Akashic, Mesa, Nature, Snow) sind in Arbeit. Einbau nach MVP-0, je Bühne eine Vorlagen-Zeile.

## 15.10.2026 · Antworten auf §27/§28 · Paletten-Vorlage frei · Fluff-Farbschema gefunden
- **Vorlagen-Zeile V-270 (Paletten als Harmonie-Systeme): freigegeben** wie beschrieben (Lab `palettes.ts`/`ENV_ROLES` 1:1, Rollen je Bühnenteil, Normalen-Kriterium waagrecht/senkrecht, Genre-Tabelle als Vorschlag). Georg urteilt an den sechs Einzelbildern plus Bildpaar alt | neu.
- **Story-Tint-Quelle (Fluff-Farbschema):** `storymode.v4.js` – die sechs Story-Modes als Farbräume, gemessen aus der gedruckten Story-Mode-Tabelle (kayfabizarro.pages.dev #kfb), mit `base`/`accent` je Modus, `deep`/`light` abgeleitet, weicher Übergang 1,4 s. Liegt jetzt auf dem Register-Branch unter `replies/donors/storymode.v4.js` (Original: KFB Shader Duo Tone v1 / kfb-bg-shader-kit 2026-09-02). Daten 1:1 übernehmen, Tint höchstens ~15 % über der Palette.
- **Daten-Pin:** bitte von @a71de421 auf **@52adc8f1** (Generator-Fix, `anti_rules_toolkit` jetzt verified, alle anderen Decks bytegleich). Danach darf Anti-Rules gezeigt werden, wenn das OCR-Audit es als SAFE führt.
- **Gedankenstrich in der Blase (§27.2/4):** Schriftfrage, Text bleibt; nicht ändern.

## 15.10.2026 · Kartentitel vereinheitlicht (V-271) · neuer Daten-Pin
- **Branch** `data/kfb-card-title-case-2026-10-15` @eade4aec (Parent @233efd5): 1503 Titel in 44 Decks von Versalien auf normale Schreibweise, z. B. „Jean-Jacques Rousseau“; Akronyme bleiben groß. Die Druck-Schreibweise steht in `cardNamePrint`. Liste alt → neu: `media/kfb/CARD_TITLE_CASE_R1.md`.
- **Bitte Karten-Daten auf @eade4aec pinnen** (statt @233efd5). Systeme, die über den Titel zuordnen, müssen den neuen Titel nehmen; `cardNamePrint` nur für Abgleich mit dem Kartenbild.
- **Registry nachgezogen:** Branch `data/kfb-registry-title-case-2026-10-15` @a71de421 (Parent @eade4aec), mit dem Repo-Generator `tools/asset_registry/decks.py` neu erzeugt: 130 Decks, 6984 Karten, Titel = Kartendaten (Abgleich über Deck + Nummer, 6984/6984). Mit dabei sind alle Kartentext-Änderungen seit dem letzten Registry-Lauf (Druck-Kanon).
- **Generator-Fix Anti-Rules:** Branch `data/kfb-registry-generator-offset-2026-10-15` @52adc8f1 (Parent @a71de421): neues optionales Feld `trailingPages` in `media/kfb/index.json` (nur anti_rules_toolkit: Deckblatt vorn + Rückseite hinten); `anti_rules_toolkit` jetzt `verified`, 56/56 Karten mit Seite/Viertel, am Seitenbild geprüft. Alle anderen Decks bytegleich. `coverOffsetStatus` dort = `manifest-checked`. **Pin für Kartendaten und Registry jetzt @52adc8f1.**

## 15.10.2026 · Georgs Urteile: Besetzung, Paletten, Kartentitel (V-269–V-271)
- **Zweite Figur (F-4): GothGirl** (V-269). Bitte so in die Dialog-Szene; Feinschliff des Augen-Profils macht Georg im Studio, keine WS1-Werte.
- **Paletten (V-270): TUNE.** Georg: „das sind nicht einfach nur eine Farbstimmung – das sind harmonische Paletten mit Akzenten“ (Joyride: canyon, bucht, otown). Quellen:
  - Joyride-Paletten 1:1: `track-look.v5.js` WORLDS (J17-Spender) bzw. Lab `src/palettes.ts` (Rollen für sky, top, hill, sand, rim, under, rock, tower, leaf, trunk, cloud, water, path, Straße/Strecke/Strang).
  - Regel V-051 und Lab-Plan `KFB_WORLDBUILDER_PLAN_R1.md` (Schema `kfb.island-theme/1`): Sechser-Palette + Rollen; **storyTint** = leichte Einfärbung je Story-Mode (High-/Low-Vibrational-Fluff) über dem Grundthema, nie statt ihm.
  - Bitte das Paletten-Konzept daran prüfen und einen neuen Vorschlag als Vorlagen-Zeile machen: Rollen für alle Bühnenteile (nicht nur Rahmen und Himmel), Akzente, Story-Mode-Tint aus dem Fluff-Farbschema; Bildfolge je Palette nach V-253.
- **Kartentitel in Versalien (V-271):** WS0 vereinheitlicht sie zentral in den Kartendaten (eigener Daten-Branch, Meldung folgt). Bitte nichts selbst umschreiben.
- **Bühnen:** Comic-Broadcast-Diorama PASS (V-268), Utopia folgt nach einem kleinen Fix (Display ohne Sockel an der Wand). Assets kommen gesammelt auf einen Asset-Branch; Einbau nach MVP-0.

## 15.10.2026 · Antworten auf §24–§26 · Bibliothek (V-264)
- **Vorlagen-Zeile V-256 (Bildflächen-Modul): freigegeben**, mit zwei Korrekturen:
  1. Der UFO-Slot ist nicht mehr ≈ 1,60, sondern **1,79:1** (V-259) und liegt bereit: Branch `assets/meshy-ufo-cockpit-2026-10-15`, `media/3D_Assets/MeshyModels/browser/kfb-meshy-ufo-cockpit.screen-up179.v1.slot.json`. Karten füllen ihn randlos. Papierrand nur, wenn ein Träger wirklich ein anderes festes Format hat; nie beschneiden.
  2. Die Träger-Varianten stehen jetzt in V-262 (Amphitheater gemauert, UFO Monitor, Bibliothek Wandbild) und kommen nach dem Schnitt als eigene Vorlagen-Zeilen.
  - Reihenfolge (B1 schneiden pixelgleich → `video` → UFO-Slot) und CSS3D-Ebene im Host: so umsetzen.
- **Zitate und Hypernormalisation-Loops:** Richtig, vorerst nur `card` und `video`. Quellen (kuratierter Zitat-Pool, Loop-Dateien mit Rechten) liefert WS0 später mit eigener Vorlagen-Zeile.
- **Drift (§24.2):** Für MVP-0 hinnehmen. Die Dialog-Szene wählt bevorzugt Karten von drift-freien Seiten (Auswahl, nicht Beschnitt). Ein Neu-Export der betroffenen Seiten geht in WS0s Daten-Rückstand.
- **Host R1.3:** als zurückgezogen markiert in `replies/KFB_HOST_CONTRACT_R3F_R1.md`.
- **Besetzung F-4 und Paletten:** Georg hat beide als Einzelbilder im Production Hub. Seine Wahl kommt hierher.
- **Bibliothek (V-264):** Branch `assets/meshy-library-2026-10-15` @63f9e73b, `kfb-meshy-utopia-library.browser-a.v1.glb` (17,9 MB) + `….stage.json`. Maßstab 5,5 m pro Einheit; Kartenfläche = Wandbild über der Galerie (3,4 × 1,9 m), Standardkamera im stage.json. Einbau nach MVP-0.

## 15.10.2026 · Bildflächen-Träger je Bühne (V-262), Frankenstein-Standard (V-260/V-261)
- **Amphitheater:** Das Billboard bekommt einen Knet-gemauerten Rahmen passend zu Torbögen und Mauerwerk (Georg hatte das schon angesprochen). Inhalt weiter über das Bildflächen-Modul (V-256), 1,79:1. Vorschlag bitte als Vorlagen-Zeile.
- **Bibliothek:** neue Meshy-Bühne; WS0 prüft gerade die Fläche (antiker Knet-Holzrahmen oder Fläche im Raum) und liefert eine Browser-Fassung. Erst danach einbauen.
- **Figuren:** Meshy-Figuren kommen künftig als Frankenstein (KayKit-Körper + Meshy-Kopf am Kopfknochen). WS0 baut gerade die Probe Lord Hunky und Lady Dory auf dem KayKit-Astronauten; das Gesicht entsteht in der WSA-ToolBox. Für MVP-0 nichts ändern.

## 15.10.2026 · UFO-Cockpit mit Bildfläche liegt bereit (V-259) · Einbau nach MVP-0
- **Branch** `assets/meshy-ufo-cockpit-2026-10-15` @b9a46d1c, Ordner `media/3D_Assets/MeshyModels/browser/`: `kfb-meshy-ufo-cockpit.screen-up179.v1.glb` (14,1 MB, ohne Steuerknüppel) und `….slot.json`.
- **Bildfläche** = Mesh/Node `kfb_screen_slot` (gewölbt, unlit Platzhalter). Das Bildflächen-Modul (V-256) setzt Inhalte darauf; kein Billboard davor. Ecken, Flächenformel, UV (flipY = false) und die sichtbare Öffnung stehen im slot.json.
- **Maß:** 8 m pro Einheit (V-257), Bodenmitte = Ursprung. Embedding-Standard 1,79:1; Karten passen das Embedding an ihr Format an, ohne schwarze Ränder (V-259).
- **Reihenfolge:** erst die Dialog-Szene (MVP-0), dann Einbau mit Vorlagen-Zeile in WS1_STATUS.

## 15.10.2026 · Bühnen-Kamera (V-257)
- **Frei bewegliche Orbit-Kamera** für Spieler und Zuschauer: 360° drehen, Zoom zum Cursor, Panning, Fokus auf Klick. Ruhig und nicht zu empfindlich (V-026).
- **Standard-Blick** als Startpunkt: Die Figuren stehen am Rand der Bildfläche (Billboard bzw. später UFO-Monitor), die Bildfläche bleibt frei, davor liegt offene Spielfläche wie eine Bühne oder ein Wrestling-Ring.
- **`cam=near` bzw. `two`** bleiben als Sprungmarken („Standard“, „nah“), nicht als einzige Option. Der Dialog-Ablauf darf die Kamera nicht festnageln; nach einer Sprungmarke kann der Spieler sie frei weiterbewegen.
- **Maßstab:** Bühnen groß genug für Bewegung und Cartoon-Rauferei. Das UFO bekommt 8 m pro Einheit; WS0 liefert es mit Bildschirm-Slot.
- **Vorschlag zur Umsetzung** (Kamera-Controller, Übergang Sprungmarke → frei, Kollision mit Kulisse) bitte als Vorlagen-Zeile in WS1_STATUS. Vorlage: die God-Mode-Kamera aus dem Lab bzw. J17 (V-026).

## 15.10.2026 · Bildflächen-Modul: Inhalt und Träger trennen (V-256) · wichtig für B1 und D1
- **Inhalt = ein Embedding-Modul**, frei auf jede 3D-Oberfläche setzbar. Dazu gehören: Karte (`cardImage`), Hypernormalisation-Loops, YouTube-Videos, Card-Viewer, Zitate, Farbstimmung (Palette V-245).
- **Technik:** Canvas- bzw. Video-Textur auf einer Fläche, HTML/YouTube per CSS3D. Spender: Branch `chatgpt-web/billboard-b2a-css3d-2026-09-24`, Ordner `tools/KFB-ToolBox/_handover/BILLBOARD_B2A_CSS3D_2026-09-24/` (`bb2a-boot.js`, `bb-scene.js`, `wd-donors.js`), dazu `_handover/BILLBOARD_MEDIA_LIVING_2026-09-24.md`. Vor dem Bau bitte eine Vorlagen-Zeile.
- **Träger:**
  - Das Knet-Billboard (B1) ist nur **ein** Träger; euer B1-Körper bleibt dafür gültig.
  - Im UFO ist der Träger die Monitorfläche. WS0 liefert einen benannten Bildschirm-Slot (`kfb_screen_slot`, Eckpunkte als JSON) mit angepasstem Seitenverhältnis von etwa 1,60:1.
- **Bitte:** B1 so schneiden, dass Körper (Träger) und Fläche (Inhalt) getrennte Module sind. Das Inhaltsmodul bekommt eine Fläche (Mesh + UV) übergeben und weiß nichts vom Billboard.

## 15.10.2026 · UFO-Cockpit-Bühne (V-252) · Info, kein Auftrag vor MVP-0
- Intake `replies/WS0_WS1_UFO_COCKPIT_STAGE_INTAKE_R1_2026-10-14.md` ist freigegeben.
- **Phase 1 macht WS0 hier**, weil die Master-Datei (96 MB) in Georgs Dropbox liegt: Quell-Beleg, Browser-Fassung A/B nach eurem `build-browser.mjs`-Weg (Kopie, eure Datei bleibt unverändert), Steuerknüppel → optionale Variante `stage_clean`, Bühnenplan, Monitor-Befund. Ergebnis kommt als Asset-Branch wie bei Mesa/Library.
- **Phase 2 bei euch nach MVP-0:** zweite wählbare Bühne im ModuleHost.
- **Karte:** ein B1-Modul mit zwei Montagearten ist erlaubt, entweder freistehend oder auf dem Rückwand-Monitor. Beide nutzen dieselbe `cardImage`-Quelle und dieselben R2-Regeln. Georg wählt am Bildpaar.

## 15.10.2026 · Ergänzung MVP-1b: Fahren übers Gelände (V-251)
- In MVP-1 gehört auch Fahren: ganz normal über das Gelände, ohne Rennstrecke.
- **Fahrphysik = J17 k2b 1:1 als Modul** (V-032). Der Boden kommt aus dem Gelände, nicht aus der Strecke.
- **Auto:** Cicada geschlossen (V-030). Ein- und Aussteigen über den Hop-Arbeitsstand (V-031).
- **Bitte erst eine Vorlagen-Zeile:** Quelle (J17-Pfad, Commit), was 1:1 übernommen wird und was sich für den Geländeboden ändert. Den Bordstein-Puffer aus V-032 braucht es ohne Strecke nicht.

## 15.10.2026 · MVP-Fahrplan (V-250) · bitte quittieren
1. **MVP-0 Dialog-Szene spielbar** (läuft): Amphitheater, FrizzleBob + KayKit-Gegenüber (drei Kandidaten an WS0), B1 Billboard, Blasen, Spielerwahl, Paletten (V-245), Vorschau-Text (drei Karten). Abschluss: G4 an WS0, dann Georg im Spiel.
2. **MVP-1 Welt-Hülle:** eine begehbare Insel aus den Meshy-Kulissen (Mesa B, Bibliothek A; Schnee/Natur folgen), Laufen/Springen aus M1 (V-248), Kamera, NPC-Begegnungen an Billboards. Vorschlag zum Inselaufbau (Maßstab, Übergänge ohne harte Kanten V-011, Bodenschluss V-203) zuerst als Plan in WS1_STATUS.
3. **MVP-2 God-Mode v1:** Platzieren/Drehen/Skalieren aus dem Asset Librarian, Undo, Welt als `kfb.world/1`-Datei (Vorschlag in `replies/WORLD_CONTRACT_R1.md`, `WORLDBUILDER_MODULE_MAP_R1.md`), Umschalten Spiel ↔ God-Mode (Kamera V-026). Vorlagen-Zeile vor Bau.
4. **MVP-3 Veröffentlichen:** Build als Site mit Versionen; WS0 klärt Ziel und Weg mit WSA work.
5. **MVP-4 Combat-Arena:** Destruction-Mech, KayKit-Mündungsfeuer (groß/Rakete, klein/Gatling, cartoonig im Schusstakt), Zerstörungs-Ebene, Flugmodus (V-024). Bausteine aus `KFB Combat Arena/` (v2) prüfen und als Module übernehmen. Nicht vor MVP-1.
Höchstens zwei Baustellen gleichzeitig (V-005). M1 läuft als zweite.

## 15.10.2026 · Antwort auf §23 (M1) · und Erinnerung Palette
- **Palette:** Steht weiter oben unter „15.10.2026 früh · Antworten auf §19–§22“ (V-245). §23 war älter als die Antwort.
- **Befund 1, Tempo (V-248):**
  - Die Tempi aus V-020 bleiben, Georg hat sie abgenommen.
  - Damit die Füße stehen, folgt die Abspielrate dem Körpertempo: `timeScale = Tempo / Clip-Eigentempo`, begrenzt auf 0,8–1,25. Außerhalb dieser Grenzen wechselt der Clip.
  - Ziel in `m1-feet`: Rutschanteil < 0,1 bei Gehen, Joggen und Sprint.
- **Befund 2, Haltung:** Lösung angenommen (senkrecht, auf den Bodenpunkt gesetzt). Gilt auch auf der Bühne.
- **Host-Vertrag R1.3:** `fixedDt` + `after` freigegeben.
  - Eingetragen in `replies/KFB_HOST_CONTRACT_R3F_R1.md` §R1.3, inklusive der Pflicht, `after.current` jedes Bild aufzurufen.
  - Diff bitte übernehmen. M1 braucht dann keine eigene Hülle mehr.

## 15.10.2026 · Meshy-Kulissen bereit (V-246)
- Branch `assets/meshy-scenery-2026-10-15` @6d46d085 (von main), Ordner `media/3D_Assets/MeshyModels/browser/`: `kfb-meshy-mesa-island.browser-b.v1.glb` (100 k, 4,6 MB) und `kfb-meshy-akashic-library.browser-a.v1.glb` (350 k, 14,7 MB), dazu SHA256SUMS und README.
- Einbau nach dem Amphitheater-Muster (Kennung im Asset Librarian, Bildpaar, fps). Priorität nach G4. Die Bibliothek ist ein Kandidat für die nächste Bühne.

## 15.10.2026 früh · F-4 zweite Besetzung: KayKit-Figur mit Georgs Augen
Georg wählt eine **KayKit-Medium-Figur mit seinem abgenommenen Augen-Profil** aus dem Eye-Rig-Studio (derselbe F1-Weg; Profile `eye-rig-medium.batch-1.json`, Studio @db823766).
- **Bitte drei Kandidaten vorlegen:** unmaskiert, Gesicht gut sichtbar, unterschiedliche Silhouette neben FrizzleBob. Je Kandidat ein Bild im Two-Shot `cam=near` neben FrizzleBob, mit Name und Profilquelle.
- Gleicher Darsteller-Slot, `KFB_NATIVE`, keine eigenen Werte.
- KayKit hat keinen eigenen Sprechmund: Bitte zeigen, wie die Figur spricht (heute ohne Mund). Ein Mund ist eine eigene spätere Frage; nichts dazubauen.
- WS0 legt Georg die drei Bilder vor; seine Wahl kommt hierher.

## 15.10.2026 früh · Antworten auf §19–§22 (gebündelt) · gelesen bis V-245 bitte quittieren
**FrizzleBob:** F-1 erledigt (Georg: „fb passt so“). V-243 umgesetzt; den Satz zum neutral-Decal hat WS0 berichtigt (V-245). Das Gate `FRIZZLEBOB_V240_ASSEMBLED_BINDPOSE_SOURCE_PROOF` entfällt in WS1; Ganzkörper und Export kommen über die neue ToolBox-Site (V-244).

**F-2 Palette (V-245), entschieden:**
- (a) **Besitzer `palette-roles.js` R2.** Er versorgt Billboard, Amphitheater, Boden und Himmel. Die Stufen kommen aus `world-palettes.js` (Travel v25, acht Cartoon-Paletten). Das ist die Linie, die Georg mit „Joyride v17“ meint (d). BIOMES nur noch als Rückfall.
- (b) **Zuordnung dynamisch nach Karte über das Deck-Feld `genre` bzw. `bundle`** (Werte uneinheitlich: EDUCATION/education, CONSPIRACY_THEORY/conspiracy, satire/COMEDY …). Ihr schlagt eine Tabelle Genre → Palette vor und legt einen Bildbogen bei: je Palette ein Bühnenbild mit einer passenden Karte. Georg urteilt am Bogen.
- (c) **Himmel färbt mit.**
- **Wechsel weich überblenden** (V-011).

**F-3 Dialogtext:**
- (a) **Für G4 Vorschau mit drei Karten** und Georgs eigenen Fassungen, als Vorschau gekennzeichnet (Packet `preview:true`, nicht ACCEPTED). Der Opener steht als eigene Schicht davor:
  - Monomyth #1: „[Welcome to] The Ordinary World stasis loop: nothing changes; Dysfunction is habit. Normalize pain – feels like home.“
  - Monomyth #5: „[Remember] Crossing the Threshold: hand new cards, old self dead. Fear becomes movement. You can't un-fluff the pill.“
  - Help I Am A Human #10: „[You know] Jean-Jacques Rousseau, Natural Goodness: man born free, everywhere in chains.“
  - Kartentext = Druck (@233efd5).
  - Ist eine der Karten nicht SAFE, zeigt das Billboard den Platzhalter mit Drucktext.
- (b) **Pool r6 kommt erst mit sauberen Triplets.** Das Plugin wird nach der neuen Methode (Closure, Fluff-o-lect, Georgs Fassungen als Richtung) angepasst; abgenommen wird in einem Prüfwerkzeug (V-237). Format bleibt kfb.voice.triplet-opener-pool/1, Opener als eigene Schicht. Termin offen. Bis dahin Vorschau wie (a).
- (c) **Spielerwahl** KayfaBINGO/BOGGLE/BONGO/BLÖDSINN + eigene Wörter: bleibt für G4.

**F-4 zweite Besetzung:** Klärt WS0 mit Georg; Antwort folgt hier. Bis dahin spielt FrizzleBob beide Seiten, nur im Prüf-Browser.

**F-5:** Kopf-Blickschicht nach dem Mixer und `lookAt` in Weltkoordinaten ist freigegeben (V-214). Kinetik-Automatik und M1-Fußabnahme kommen nach G4.

**19.1:** `cam=near` + `place=near` als Standard bestätigt (Georg: „near nehmen“).

**19.x Kartennummern:** Die Decks ohne Nummern bzw. mit `num`/`name` (ai_kayfabe, brain_flipper, kompendium, kreative_kayfab, carnival_therapy, tragic_flaws_shakespeare) normalisiert WS0 als nächsten Datenschritt (V-242).

## 14.10.2026 spät · Präzisierung zu V-243: kein FrizzleBob-Sonderweg
- **Nur datengetrieben:** Den Ruhe-Mund liest der Darsteller aus einem Rezept-Feld `mouth.rest` (z. B. `"closed"` → das Decal für geschlossene Lippen). Den Wert setzt bis auf Weiteres euer Rezept mit Quelle „V-243“. Später schreibt ihn die ToolBox selbst. Nichts fest im Code für FrizzleBob.
- **Kein weiterer FrizzleBob-Ausbau** über diesen Punkt hinaus (Augenlage, Ganzkörper, Export). Die Rigging-Fixes wandern in die ToolBox (WSA-work-Port, V-241); Georg stellt FrizzleBob dort einmal ein, ihr übernehmt das Rezept 1:1.
- Weiter wie geplant mit B1, D1 und der Bühne.

## 14.10.2026 spät · FrizzleBob: Mund zu, Augenlage, Ganzkörper (V-243) · freigegeben
Grundlage: `replies/FRIZZLEBOB_V240_CLOSED_MOUTH_AND_FACE_VISUAL_FAIL_2026-10-14.md` und `…_RAW_GLB_VIEWER_FAIL_AND_TRUE_EXPORT_ROUTE_2026-10-14.md` (Georg FAIL).
- **G0 erledigt (WS0):** Im ToolBox-Schnitt P08 ist „Zu“ (`setViseme('closed')` bzw. `mouthRest`) nur eine Live-Vorschau. Sie wird nicht gespeichert und nicht exportiert. Der Export im Schnitt ist identisch mit V-240 (16:00). Einen neueren Stand gibt es also nicht; Georgs Absicht ist eindeutig: **Ruhe-Mund geschlossen**.
- **Freigabe, kleinster Eingriff in `faceMountActor`:**
  - Ruhe-Mund = sichtbar geschlossene Lippen mit dem vorhandenen Decal (euer `_closedNeutral`-Zweig mit closed = „m“).
  - `say()` endet wieder in diesem Ruhezustand.
  - Kein neues Decal-Set, keine zweite Mundebene, keine sonstigen Werte geändert.
- **Beleg, in dieser Reihenfolge:**
  1. Bildreihe idle / „Zu“ / mitten im Satz / nach dem Satz, jeweils mit `parts.mouth`, `mouthOnModel`, `m.rest`, `m.viseme`, `m.cur`. Geschlossen heißt: keine Zähne, keine Lücke.
  2. Augenlage: eyeFrame und Kopf-Transform gegen die ToolBox aus gleicher Kamera (vorn, ¾, Seite). Nichts frei verschieben.
  3. Ganzkörper in Bindepose, vorn, ¾ und Seite mit Rand, Ohren, Hände und Füße ganz im Bild, neutraler Hintergrund, fertig montierter Darsteller (kein nacktes GLB), dazu ein Augen-Auf/Zu-Bild.
- **Danach:** Erst wenn WS0 die Bilder geprüft hat, folgt der GLB-Export-Versuch. Nach zwei Durchgängen ohne Verbesserung: Naht festhalten und melden, keine Varianten erfinden.

## 14.10.2026 spät · Neuer Kartentext-Stand (V-242)
- **Branch `data/kfb-card-text-canonical-2026-10-14` @233efd5** (baut auf der Registry-Korrektur a9f5ffa1 auf). Kartentext = Druck; der alte Text steht in `jsonLegacy`, die Herkunft in `textSource`.
- **37 Titel geändert** (32 in carnival_therapy, z. B. ai_kayfabe #11 „Claude 3.7's Ghost“). Eure Zuordnungsprüfung über Titel bitte gegen diesen Stand laufen lassen. Erst danach `MEDIA_COMMIT` umstellen; das Ergebnis in WS1_STATUS melden.
- Bericht: `media/kfb/CARD_TEXT_CANONICAL_R1.md`.

## 14.10.2026 spät · ToolBox-Antworten auf eure Befunde (Kurzfassung)
Claude Design hat zu eurer Liste geantwortet. Der volle Schnitt kommt später auf GitHub.
- **A1 bestätigt:** Die ToolBox zeigt nie die Bindepose, sondern immer eine Pose bzw. Idle_A. Eure Bilder in Bindepose bleiben richtig; für Paare mit der ToolBox die Pose angeben.
- **A2 bestätigt:** `frizzlebob-earrig-v5` lädt v5b. Das deckt sich mit V-240.
- **A5:** Brauen `original.brows.lift` = 0,242. So steht es auch in Georgs Export, also nicht 0,18.
- **Achtung:** Brauen- und Nasenfarbe werden noch nicht exportiert. Nehmt bis auf Weiteres die Farben aus dem Export (`brow.color`, `nose.color`).

## 14.10.2026 abends · FrizzleBob WEITER mit Georgs Eintrag (V-240) · Stopp aufgehoben
- **Quelle:** `replies/actors/frizzlebob.georg-2026-10-14.kfb-pets.json` im Register-Branch (Georgs Export, kfb.pets/1, `pets[0]` = `frizzlebob-earrig-v5`).
- **Figur laut Eintrag: `FB_TEMPLATE_LOOK_v5b.glb` @23615cff (Blob 24134a51).** Georg hat ihn auf v5b eingestellt; das gilt (ersetzt „kein v5b“ aus V-236).
- **1:1 übernehmen**, eure vorläufigen Werte (§12, Rezept C) ersetzen:
  - eye: dx .455, dy .21, ring .255, oval 1,06/1,04/0,98/−25, socket surface, matte-cute 0,27, life 0,27/0,2;
  - brow, nose, mouth, original.*, parts (eyes rig, Rest original);
  - hair, ears, lids.
  - Datei ins Rezept bzw. in den Datenordner ziehen, Quelle und SHA-256 vermerken.
- **Knet-Lider:** `clayLids.on: false` → Eye-Rig-Lider. Die Knet-Lid-Konstruktion klärt Georg separat. Daran nicht aufhalten.
- **Mund:** `mouth` (set male, dy −0,681, lift 0,03) + `original.mouth` (pitch 18, depth −0,188). Prüfen, ob der Mund damit in ¾ am Kopf sitzt (euer Befund A7).
- **Abnahme:** Bildpaar ToolBox-Spender | Spiel aus gleicher Kamera (vorn, ¾, Seite) mit **diesem** Eintrag, Pose angegeben. Auf v5b mit seinen Modulständen (Cut r2 bzw. P08-Linie); Abweichungen der Modulstände bitte benennen.
- **Hinweis:** Die Export-Kennung lautet „KFB ToolBox Production-02 · Rigging“. Welche Claude-Design-Fassung das genau ist, klärt WS0 (V-241).

## 14.10.2026 abends · V-238 zurückgenommen (V-239)
Der Composer ist **kein** Rigging-Ort; Georg: dort sind alle Modelle falsch. Gültige Rigging-Quelle bleibt das Eye-Rig-Studio (euer F1-Weg). FrizzleBob ist dort nicht enthalten. FrizzleBob-Ausbau bleibt gestoppt, bis WS0 mit Georg die Quelle geklärt hat. B1 läuft weiter.

## 14.10.2026 abends · FrizzleBob-Werte kommen aus dem Composer (V-238)
Rigging-Ort ist ab jetzt nur die FrankenStein-Composer-Site (WSA work, #355). Dort wird FrizzleBob v5 mit euren gepinnten Modulen repariert (Mund/Nase ¾, Brauen, Pose-Schalter, Pins, v5/v5b) und von Georg eingestellt. Gespeichert wird ein Rezept auf GitHub im Format eures `frizzlebob-v5.recipe.json`. WS1 übernimmt es dann 1:1. Bis dahin FrizzleBob-Ausbau gestoppt (siehe oben). Eure TOOLBOX_FINDINGS_R1 sind die Mängelliste dafür. Der Vertrag R2 (modelRef, CUSTOM, beidseitige Exklusivität) geht ebenfalls an den Composer.

## 14.10.2026 abends · STOPP FrizzleBob-Rigging (Georg: „komplett kaputt“)
- **FrizzleBob im Darsteller-Slot nicht weiter ausbauen.** `fb_pair_face_q.png` zeigt es in ¾: Nase und Mund-Decal stehen frei vor dem Gesicht, das hintere Auge sitzt außerhalb des Kopfs. Das ist Parität mit einem **kaputten Spender-Stand** (P06 r1 mit Standard-Eintrag), keine Abnahme. „Gleich wie ToolBox“ zählt hier nicht.
- **Weiter erlaubt:** B1 Billboard (§14, Vorlagen-Zeile freigegeben, siehe unten) und der Slot-Code selbst (Vertrag R2, Tests). Der Slot ist nicht schuld, die Gesichtswerte sind es.
- **Grundhaltung (§13.1):** Befund angenommen. Idle_A bleibt vorläufig Ruhe-Clip auf der Bühne; die Prüfbilder bleiben in Bindepose.
- **F1-Lid-Naht (§13.2):** Diff freigegeben (eine Stelle in `seatPupils`, 1074 → 139). Diff und neuen Blob zurückmelden.
- **B1 (§14):** Vorlagen-Zeile freigegeben (1:1 `billboard-clay.js`, `fitFace`, `gb 3.0 → 0.9`, Innenecken ≤ 0,8 × Papierrand, sonst eckig). Abnahme: Bildpaar Referenz | Stand, Karte ganz und randlos.
- **Wie es mit FrizzleBob weitergeht:** WS0 klärt mit Georg, wo sein **funktionierender** FrizzleBob liegt, also welcher Stand als Referenz gilt. Bis dahin keine eigenen Gesichtswerte setzen und keine Werte aus J17 übernehmen.

## 14.10.2026 nachmittags · Antwort auf §11 (G0 FrizzleBob v5)
- **G0 angenommen.** Saubere Arbeit, besonders die Falle v5/v5b und die ehrliche Lid-Naht.
- **F1-Lid-Naht** (`pupilHiddenWhenClosed`, 1074 Pixel): bleibt TUNE. Einen Owner für eyeoval.v1 gibt es nicht. Bitte als eigenen kleinen Vorschlag (Ursache + Diff) in WS1_STATUS; WS0 gibt frei. Kein stilles Ändern.
- **Georgs FrizzleBob-Eintrag:** Georg exportiert ihn (ToolBox › Rigging › Import · Export › Export). WS0 legt die Datei ins Repo und meldet den Pfad. Bis dahin Code-Pfad-Parität mit dem markierten Prüf-Eintrag wie vorgeschlagen; nichts davon an Georg.
- **Lider hinge vs. glide:** Entscheidung liegt bei Georg und kommt hierher.
- **Wireface-SDK:** Es liegt nicht auf eurem Mac. Georg bringt die zwei Dateien (`wireface-sdk-0.3.3.tgz`, `wireface-browser-0.3.3.tgz`) per AirDrop o. Ä.; Ablage außerhalb des Repos. Bis dahin: Schalter + Build ohne SDK.
- **Grundpose/Haltung:** Georg sagt, ihr habt Probleme in der ToolBox gefunden, u. a. zur Grundpose (FrizzleBob-GLB ist T-Pose ohne Clips). Bitte als eigenen Abschnitt in WS1_STATUS festhalten: Befund, betroffene Dateien/Figuren, Vermutung zur Haltung/Animation im Spiel, Belegbild. WS0 prüft und vergibt.

## 14.10.2026 morgens · BESETZUNG: FrizzleBob v5 (V-236) · verbindlich, ohne Rückfrage umsetzen
**F1 (WS1_STATUS §10):** angenommen als technischer Nachweis des Moduls (Studio-Parität, Vertragstest, Prüfer 4). Rogue_Hooded bleibt **nur Testfigur** für F1; als Darsteller ist er falsch (maskiert, kein sichtbarer Mund).

**Hauptdarsteller der ersten Dialog-Bühne: FrizzleBob v5.**
- **Modell:** `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5.glb`, Blob `131d7c38`, Commit `19088b14`, Branch `chat/fb-ear-rig-v5-2026-09-25`. Dort liegen auch `FB_BASE_NOEARS_v5.glb`, `FB_EAR_UNIT_v5.glb`, `rigs/fb-default.ear-rig.json`, `ear-dangle.v1.js`, `blender/build_fb_v5.py` und das Ear-Rig-Studio.
- **Augen/Lider-Beleg:** 7/7 PASS vom 30.09., `tools/KFB-ToolBox/_inbox/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/evidence/acceptance_1-7_frizzlebob-earrig-v5.json` (Actor `frizzlebob-earrig-v5`) auf main. Gilt für diesen Spender, noch nicht für R3F.
- **Nicht v5b** (`FB_TEMPLATE_LOOK_v5b.glb`, Production-06 r2) stillschweigend einsetzen.

**Ablauf:**
1. **G0 Quell-Isolation FrizzleBob v5:** Modell allein zeigen; Gesichts-Stapel (Augen, Lider, Brauen, Ohren, Mund) mit Quelle und Werten pinnen. Keine Rogue-Werte übernehmen. Was fehlt, z. B. ein sichtbarer Mund, als `SOURCE_REQUIRED` melden, nie mit Platzhalter füllen.
2. **Darsteller-Slot** mit genau einem Gesichts-Treiber (`KFB_NATIVE` aus FrizzleBobs eigenem Stapel; keine neue Gesichts-Engine, kein Mischbetrieb).
3. **Abnahme:** Bildpaar bzw. kurzer Clip Spender | R3F, gleiche Figur und gleicher Winkel; Blinzeln vollständig geschlossen, Blick, Ohren.
4. Danach weiter wie geplant: B1 Billboard (R2) → D1 → G4-Szene im Amphitheater.

Die Fragen aus §10 beantwortet WS0 gesondert. Sie halten FrizzleBob G0 nicht auf.

## 14.10.2026 früh · F1: Eye-Rig-Studio-Quelle (Korrektur, Fehler WS0)
Die Live-Adresse `kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/` liefert nur die Startseite (SPA-Fallback, Studio dort nicht ausgeliefert). WS0 hatte sie nicht geprüft. **Nicht weiter auf Cloudflare suchen.**
- **Studio-Quelle:** Branch `work/hub-ux-v2-masterplan-2026-09-27`, Ordner `kfb-hub/stage/toolbox/eye-rig-batch/`, letzter Stand Commit `5c3334bd2` (22.09.); `index.html`, `app.js`, `lib/` (u. a. `kaykit-eye-adapter.v1.js`), `data/`. Ursprung PR #104 (Branch `toolbox/eye-rig-batch-2026-09-18`). Lokal per statischem Server ausliefern (z. B. `npx serve`), nicht über file://.
- **EyeRig v6:** dieselbe Datei wie im Lab (md5 1c194efa); im Repo z. B. `skills/KFB PetStudio/KFB Pet Studio v12 (WS0)/session-export_petstudio-v12_2026-09-10/code/petstudio-v9/studio-v12/pet-eye-rig.v6.js`.
- **Georgs Werte:**
  - Klassen-Standard `rig-medium-default.v0.json` (Resident-Atlas-Cut, Z. 38–66);
  - 33 Figurenprofile `eye-rig-medium.batch-1.json`;
  - Large `rig-large-reviewed.v1.json`.
  - Lab-Kopien: `~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/public/assets/figures-b2/eye-profiles/` (mit SOURCE.md).
- **Alle Regler, Schieberwerte und die Schielursache:** Lab `docs/concepts/EYE_RESTORE_SEARCH_R1.md` §1–4. Blickachse = Host-vorn, nicht Anker-Drehung.

## 14.10.2026 früh · Registry-Korrektur fertig (Antwort auf 4.2)
- **Neuer `MEDIA_COMMIT`: `a9f5ffa1484f510d2fbfb04bf3204546ef7dc867`**, Branch `data/kfb-registry-mapping-fix-2026-10-14`, Basis main @ac9dbaed. Bericht: `media/kfb/MAPPING_FIX_R1.md`.
  - coverOffset 1→0 bei 14 Decks;
  - 1→2 bei 4 Decks (zwei Vorseiten);
  - `pages` = gemessene Seitenzahl;
  - Einzelfälle anti_rules_toolkit (Dublette entfernt, #52–57 → #51–56), big_bad_brain_wrestling #50/#51, unspoken_systems #38 „TRUST LOOP“;
  - die 2 „fehlenden“ PDFs: Apostroph im Registry-Namen korrigiert.
- **Bitte:** Audit (`python3 scripts/audit-mapping.py`) gegen `a9f5ffa1` laufen lassen und das Ergebnis in WS1_STATUS melden. Die Vorhersage aus euren Rohdaten lautet 58/78 SAFE; belegt ist das erst durch euren Lauf. Erst danach stellt ihr `MEDIA_COMMIT` um.
- **Offen** (Bericht §Offene Fälle): 4er-Reihen-Seiten in 4 Decks, Karten-JSON ≠ Druck bei ego_mania_narcissist/mission_control #37–56, ontological_hazards mit gemischtem Offset. Diese Decks bleiben bis auf Weiteres Platzhalter.

## 14.10.2026 früh · Meshy-Amphitheater (Antwort auf §9, V-230)
Gute Quell-Isolation: Bildpaar, Inventur, Messung, Befunde A/B. So soll Intake aussehen.
1. **Ablage:** wie vorgeschlagen. Das Master bleibt in der Dropbox (SHA-256 + Herkunft im Librarian). Ins Repo kommt nur eine Browser-Fassung unter eigener Kennung und Version: Geometrie ≈ 300–400 Tsd. Dreiecke, Texturen 2048² WebP (Metall/Rau 1024²), Ziel < 20 MB. **Kein KTX2/Meshopt jetzt**, damit kein neuer Laufzeit-Decoder nötig wird; erst wenn das Ziel sonst verfehlt wird, als Vorschlag. `@gltf-transform/cli` ist als gepinnte Dev-Abhängigkeit freigegeben (nur Werkzeug-Skript, `npm ci`/Build/Tests bleiben grün). Abnahme: Bildpaar Master | Browser-Fassung aus gleichen Kameras + Bildzeit wie in deiner Tabelle.
2. **Registrierung:** WS1 trägt genau eine Kennung im Asset Librarian (`registry/assets/v1`) im Intake-Slice ein; WS0 prüft.
3. **Maßstab:** Bühnenfläche ≈ 14 m bestätigt. Das Billboard gilt nach `BILLBOARD_STANDARD_R2` (responsiv, niedrig, kein 12 × 6 m mehr). Prüfung im ruhigen Two-Shot: Karte lesbar, beide Figuren davor.
4. **Unterseite:** Das Theater steht auf Clay-Gelände mit Bodenschluss (V-203); die Kamera kommt nie darunter.
5. **Reihenfolge:** Die Browser-Fassung darfst du jetzt erzeugen, wenn es F1 nicht aufhält. Einbau als Modul erst nach F1 und B1, wie vorgeschlagen.

## 14.10.2026 früh · Architektur R1 (V-228) · gebündelt, bitte quittieren
**Lesen:** `ARCHITECTURE_R1.md` (eine Seite) und `replies/BILLBOARD_STANDARD_R2.md`. Im nächsten WS1_STATUS bitte quittieren: „gelesen bis V-228“.

1. **Alle Laufzeit baut WS1**, auch Kamera (ruhiger Two-Shot als Standard, kein Auto-Schnitt) und den kompakten Clay-Boden der Bühne. V-225 ist zurückgenommen. Die Module in `replies/CLAUDE_DESIGN_STAGE_LIVE_R1/` werden **nicht** übernommen; nur `fitFace` dient als Vorlage für B1.
2. **8.1 Billboard:** gilt nach R2. Kein TV, keine feste 2:1-Fläche, responsive Fläche, Karte randlos, Innenecken höchstens im Papierrand gerundet, kurze Pfosten. Bitte neue Vorlagen-Zeile nach R2 §5.
3. **Gesicht (ersetzt den Mischbetrieb aus V-217):** Je Figur steuert genau ein Treiber das ganze Gesicht, wie im #355-Code (`DOUBLE_FACE_CHANNEL_OWNER`). KFB-Figur = `KFB_NATIVE` (F1). Wireface-Cast oder GLB = `WIREFACE_*` exklusiv. Den Darsteller-Vertrag erweitert ihr im Code für Nicht-KayKit-Figuren (bisher verlangt er `kfb.actor-recipe` mit Rig_Medium) und reicht den Diff in WS1_STATUS ein.
4. **Wireface-SDK:** lokaler Alias mit Schalter (z. B. `VITE_WIREFACE=1`). `npm ci`, Build und alle Tests müssen **ohne** SDK bestehen. Keine SDK-Datei im Repo.
5. **Text:** Pool r6 entsteht im Branch `data/kfb-dialog-pool` (`data/dialog-pool/KFB_DIALOG_POOL_R6_2026-10-14.json`), mit Georgs Opener-Urteilen und den drei 56er-Sets als Kandidaten. `POOL_PATH`/`POOL_REF` stellt ihr um, wenn WS0 die Revision meldet. Bis dahin bleibt r5.
6. **Reihenfolge:** F1 → Darsteller-Slot → B1 → D1 → Vorführung (G4). Vorher zeigt ihr Georg nichts.

## 14.10.2026 früh · Antwort auf WS1_STATUS §8 (Head ddf4e22d)
**S5a/b/c:** angenommen. Die Optik der Spielerwahl prüft WS0 mit der Vorführung (8.2), nicht einzeln.

**8.2 Reihenfolge: angenommen.** F1 Augen → Billboard → Vorführung „Karte im Billboard + Blase + Wahl, Figur mit Eye-Rig“ auf kompaktem Clay-Boden statt Hex. Die Karten-Aufsteller auf Bühne und Turm fallen weg.

**F1 jetzt starten** (Stopp aus §7 ist damit aufgehoben, Antwort auf 4.5):
- **Augen:** Vorgaben wie am 14.10. (pet-eye-rig.v6 + anchored-eyes 1:1, Studio-Werte, Anker-Drehung nicht übernehmen, Brauen). Abnahme: bewegtes Paar Studio | R3F.
- **Figuren-Slot (V-227):** eine Darsteller-Schnittstelle mit `faceDriver` je Figur (`KFB_NATIVE | WIREFACE_MESH | WIREFACE_MODEL`, Vertrag #355). Je Region genau ein Treiber. F1 liefert `KFB_NATIVE`; die Wireface-Treiber kommen als zweite Quelle in denselben Slot.
- **Wireface-SDK 0.3.3** (Peer `three ^0.186.1`, passt zum Host-Vertrag) liegt nur lokal: `~/Dropbox/CLAUDE/KFB_HUB/40_VENDOR_PRIVATE/wireface-0.3.3/` (`sdk/package/` und `browser/`). Einbinden über einen ignorierten Vendor-Ordner bzw. Alias. **Nie ins Repo**, auch nicht in Builds, die gepusht werden.
- **Stimme:** Es gibt keine Tonaufnahmen. `say()` braucht aufgenommene Clips; ohne Audio-Kontext bewegt die Figur nur den Mund („mime“). Bis auf Weiteres gilt: mime, kein TTS.

**8.1 Billboard-Vorlage: noch nicht freigegeben.** V-223/V-224 ändern sie: kein TV-Knopf, keine feste 2:1-Fläche, responsive Fläche, Karte randlos, niedrig. Die Antwort kommt nach dem Architektur-Check von WS0 (heute), zusammen mit der Frage, welches Billboard-Modul die eine Quelle ist.

**Registry (4.2):** Die Korrektur läuft jetzt im Branch `data/kfb-registry-mapping-fix-2026-10-14`. Den neuen `MEDIA_COMMIT` meldet WS0.

**Pool (S5b):** Der Pool r5 hat 0 ACCEPTED und nur einen Beat. Georgs Urteile (V-218, V-222) und die neuen Opener-Kandidaten trägt WS0 ein; neue Pool-Revision und Ref meldet WS0.

## 14.10.2026 nachts · Figuren-Slot quellen-offen (V-226/V-227)
- Claude-Design-Bühne R1 = FAIL (keine Figuren, Auto-Schnitt). Ursache WS0.
- **Neu für F1/F2:** Darsteller-Schnittstelle mit mehreren Quellen: KFB-Figur (Körper + Eye-Rig, F1 1:1 aus dem Studio), Wireface-Cast (`buildCharacter(id)` aus `@wireface/sdk/three/characters`), beliebiges GLB mit `attachFace`/`ModelFace`. Je Figur genau ein Gesichts-Treiber (`faceDriver`).
- Das SDK kommt von Georg (Konto-Download). Es bleibt lokal in einem ignorierten Vendor-Ordner und kommt nie ins Repo. WS0 meldet den Pfad, sobald es da ist.

## 14.10.2026 nachts · Wireface-Bühne als 3D-Szene (V-225)
- Claude Design baut die Bühne live in three.js (Projekt „KFB Billboard Clay Island“); jedes Teil als Modul nach Host-Vertrag R1.2. WS1 übernimmt die Module später 1:1 über den ModuleHost. Kein eigener Nachbau. WS0 meldet, wenn die Szene geprüft ist.

## 14.10.2026 nachts · Bühnen-Billboard (V-224, für B1)
- Plain-Körper ohne TV bzw. Mini-TV; niedrig gesetzt, damit die Figuren davor agieren.
- Responsive Bildfläche nach dem Seitenverhältnis der Karte (B3 `fit_face`, siehe `replies/BILLBOARD_STANDARD_R1.md` §6); die feste 2:1-Fläche mit Randfarbe entfällt.
- Karte = ganze Viertelseite, unbeschnitten, randlos.

## 14.10.2026 nachts · Opener-Regeln und Billboard-Referenz
- **V-222 (für S5b):** Opener-Varianten (z. B. die „heard of“-Formen) bleiben, aber **keine Variante zweimal in einem Set, Akt oder Dialog**. Also braucht der Pool-Leser eine Rotation bzw. einen Cooldown. Orts-Opener sind je Figur erlaubt (frei als Bühnenfiktion oder nur Kartenorte, laut Figurenprofil).
- **V-223 (für B1):** Referenzbild `replies/REFS_BILLBOARD/PLAIN_BILLBOARD_REFERENCE_GEORG_2026-10-14.webp`.
  - Knet-Rahmen, runde Innenecken, zwei Pfosten.
  - Inhalt als integrierte Collage bzw. Hypernormalisation; die Karte wird integriert, nicht aufgeklebt.
  - Kein TV-Knopf vorerst.

## 14.10.2026 spät · Billboard-Standard (V-220)
Jedes Billboard bzw. jede Karte auf einem Billboard folgt `replies/BILLBOARD_STANDARD_R1.md`:
- **Körper:** World Billboard Clay01 r2 in der Variante `plain` (Einbau-Vertrag `billboard.embed-spec.v1.json`, Branch `work/billboard-island-integration-01-2026-10-01`).
- **Karte:** **in** die 12 × 6 m-Bildfläche eingesetzt (CanvasTexture 2:1), über `cardImage`, `fit`. Nie als Rechteck davor.
- **Engine:** Hypernormalisation (START_HERE im Branch `planning/billboard-quote-hypernorm-curator-2026-10-04`, H13 als Bild-Besitzer), genau ein `BillboardScheduler`.

Für den Billboard-Slice zuerst eine Vorlagen-Zeile an WS0: welche Datei bzw. Funktion 1:1 übernommen wird.

Ablage im Register-Branch `docs/kfb-decisions-register-2026-10-11`. Verbindlich ist `DECISIONS.md`.

## 14.10.2026 · Antwort auf WS1_STATUS (Head 0fdabf87)

**Gut gemacht:** S0/S1 sauber. Blinde Prüfer, Bildpaare mit unabhängiger Referenz, das Audit der Kartenzuordnung, „gesperrt statt falsch“. So soll es laufen.

**Freigaben**
- **Host-Vertrag R1.2 = V-215.** Kopie liegt in `replies/KFB_HOST_CONTRACT_R3F_R1.md`. Besitzer ist ab jetzt WS0. Änderungen bitte als Vorschlag in WS1_STATUS; WS0 trägt sie ein.
- **S0 + S1 freigegeben**, ohne dritten Prüfer. Zu Georg geht S1 aber erst gebündelt mit S5a, also mit Karten und Blase zusammen.

**4.1 · Hex (V-216 Punkt 1, V-194):** Eure Empfehlung gilt.
- Die Hex-Insel bleibt nur eine ausdrücklich markierte Legacy-Testkulisse; nichts hängt daran.
- S2 Clay wird nicht auf Hex ausgerichtet.
- Die erste Bühne ist ein kompakter, organischer Clay-Boden mit Billboard, zwei Figuren, Blasen, Kontaktschatten und SKY3.
- Terrain und God-Mode kommen später beim Worldbuilder-Owner. Der Integrationsplan R1 ist insoweit korrigiert.

**4.2 · Registry:** Die Korrektur ist ein eigener Auftrag beim Deck-Registry-Owner: `coverOffset` der 15 verschobenen Decks, 2 fehlende PDFs, Einzelfälle in `cards.json`. WS0 vergibt ihn und meldet danach den neuen `MEDIA_COMMIT`. Bis dahin bleibt es beim Platzhalter mit wörtlichem Kartentext.

**4.3 · cardImage():** Bestätigt: Es ist ein Host-Dienst, kein Modul. Die Prüfung über `s1`/`s1-view` genügt.

**4.5 · Gesichter (V-216 Punkt 3, V-214, V-217):** Erst F1, dann F2, dann D1.
- **F1 Augen** (Modul nach create/update/dispose):
  - `pet-eye-rig.v6.js` + `anchored-eyes.v1.js` 1:1, Quellen und Fundorte in Lab `docs/concepts/EYE_RESTORE_SEARCH_R1.md`.
  - Werte aus Georgs Studio „KFB Batch EyeRig Atlas“ (live: `kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`) bzw. `eye-rig-medium.batch-1.json` (19.09.).
  - **Die Drehung der Anker nicht übernehmen.** Das war die Ursache des Schielens im Lab (V-201): Die Anker zeigen 14–55° nach außen, im Studio blicken die Augen geradeaus.
  - Blinzeln, Leben, Kinetik und Blickziele einschalten; dazu Brauen (V-179).
  - Abnahme: **bewegtes** Bildpaar bzw. kurzer Clip „Studio | R3F“, gleiche Figur, gleicher Winkel. WS0 prüft, bevor Georg es sieht.
- **F2 Mund:** Wireface nach dem Composer-Vertrag #355, je Region genau ein Treiber. Eye-Rig besitzt Augen, Lider, Pupillen und Brauen; Wireface zunächst nur Mund und Kiefer. Ablauf A → B → C → D aus V-217. Erst nach F1.
- **D1** wartet auf F1. S5a, S5b und S5c laufen weiter.

**4.6 · Referenz für V-204:** `replies/lab-donors/V204_plain_bubble_reference.jpg` (Lab, V-202-Abnahmefahrt). Die Blase gilt als Referenz. Die Figuren darin haben KayKit-Augen und sind **keine** Figuren-Referenz.

**Eure Regel gegen Drift** (Vorlage gegen `DECISIONS.md` prüfen; eine ältere Vorlage zählt nicht, wenn eine neuere Entscheidung sie ablöst) übernimmt WS0 für alle Sitzungen (V-214).

**S5b:** Richtig erkannt. Es gilt der KEEP-Pool (#365/#379, accepted-only), nicht `RUNTIME_POOL`. Georg kreuzt die 15 Kandidaten gerade an; das Ergebnis kommt hierher.
