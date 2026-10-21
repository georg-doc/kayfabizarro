# WS_NPC_STATUS · Sitzung „WS-NPC“ (Bewohner-Leben, Begegnung, Dark Fluffer)
Auftrag: `BRIEF_WS1_NPC_LIFE_R2.md` (V-585). Lead: WS1 „R3F Modul-Host Vertrag“. Empfänger: Lead (schreibt den Abschnitt WS-NPC in `WS1_STATUS.md`), WS0 liest hier direkt.
Neueste Einträge oben.

## 3 · 21.10. · Farmer B echt im Spiel · Georgs Entscheide zu Phase C

**Farmer B:** `Farmer_B.glb` aus `kayfabizarro` main (KayKit Mystery S6 „12 - June 2026 - Farmers“, Blob bc765229 = Pin @29c7500 in Georgs Augen-Batch), über das vorhandene Besetzungs-Werkzeug `scripts/cast/build-cast.py` als `farmer-b` aufgenommen (Augen aus `eye-rig-medium.batch-1` @ac9dbaed, AUTO_CANDIDATE wie Mage/Barbarian; bestehende Besetzung byte-gleich). **Georg 21.10.:** Farmer B „wie ausgeliefert“, also mit der eingebetteten Textur (das ist farmer_texture_A; farmer_texture_B.png liegt nur daneben). Vergleichsbild `evidence/phase-a/farmer-ab.png`.
- npc-a im Spiel PASS mit echter Figur (Sohlen −4,2 … +5,1 cm, Gang-Rate 0,8–1,25, Begegnung volle Grammatik + Waving, 0 Pop-ins).
- Matrix-Zeile M0-2: **Farmer B PASS** (echte Figur, Augen); **Lorekeeper weiter Platzhalter** (Mage, WSB K11). Georgs Batch enthält auch ein Lorekeeper-Augenprofil und `Lorekeeper.glb` mit Buch und Stab liegt in main – Frage an WS0, ob er vor K11 so laufen darf.
- **Widerspruch an WS0:** Writers Room `reality_redrawn` nennt Farmer_A „Bäuerin mit Kornschein“; `Farmer_A.glb` ist der Bauer mit Bart.

**Phase C, Georg 21.10.:** Dark Fluffer = `MonsterCuteCubes/glTF/Ghost.gltf`. Heil-Waffe (statt töten) vorerst `KayKit_Bits_Bundle1_1.1/Prototype Bits/Assets/gltf/Gun_Pistol.gltf`. Damit sind Cube und Heil-Auslöser entschieden; offen bleiben Patch-Ort und Baum (Vorschlag folgt), weiße Augen (WSB).

## 2 · 21.10. · Phase A gebaut (lokal, Zweig `ws-npc/phase-a`, kein Push) · Abnahmematrix

**Stand:** Spiel `kfb-planet`, Basis `terrain/439` @a701da4 (mit `kfb.world-save/1` und M1 dpr ≤ 1,25 des Leads), lokale Commits auf `ws-npc/phase-a` (Hash siehe Meldung an den Lead). Aufruf: `dist/index.html#m1,harvest,npc` (Start 0,27 Tag: erstes Treffen nach ≈ 20 s; `npct=<s>` setzt die Tageszeit).

**Was läuft:**
- Zwei Bewohner mit Tagesplan `kfb.npc-day/1` (Tag = 300 s): Farmer B (Bäuerin/Theaterdirektorin: Zuhause → Fluff-Baum pflegen → Treffpunkt Wiesenrand → Bühne prüfen → Baum → Zuhause) und **PLATZHALTER · Lorekeeper (WSB K11)** (Zuhause → Helden-Fluff studieren → Treffpunkt → zurück). Figuren: Farmer B fehlt auf diesem Mac, Platzhalter-Figur `adventurer-barbarian`, klar markiert; Lorekeeper-Platzhalter `adventurer-mage` (Lead-OK).
- Fahrplan statt Simulation: Lage = `planAt(t)` aus Plan + Route + Weltzeit; Live-Abweichungen (Spieler, Begegnung) holen mit ≤ 1,25 × Plantempo wieder auf.
- Begegnung über den portierten #210-Bus, Grammatik notice → approach → orient → greet|silent → react → part → resume, stabile ID `meet:farmer_b+lore_ph:d<Tag>:wiese_rand`.
- Einbau: ein ModuleHost-Modul `src/npc/residentLife.js` + kinematische Kapseln; `M1World.jsx` nur hinter Hash `npc` (+24 Zeilen), dunkler Fuß (terrain3) wie bei Spieler und Partnerin; Kontaktverdeckung ist seit V-587 aus M1 entfernt. Gruß-Clip `Waving` aus `Rig_Medium_Simulation.glb` as-is (KayKit Character Animations, byte-gleich mit `intake/loco`, Lead-OK 21.10.). Keine eigenen Licht-, Schatten- oder Materiallösungen.

**Abnahmematrix Phase A** (Belege: `test/unit/npcEncounter|npcWorld|npcSim.mjs`, `test/npc-a.mjs`, Bildreihe `test/out/npc/npc-a-sheet.png`, Clip `test/out/npc/clip/*.webm`)

| # | Zeile | Ergebnis | Beleg |
|---|---|---|---|
| M0-1 | Inventur je Quelle (übernommen / nicht / Lücke) | **PASS** (Entwurf) | `CANON_3D/sources/WS_NPC_INVENTUR_R1.md` |
| M0-2 | Echte Figuren aus cast.r1.json, `ready`, quell-isoliert (Farmer B, Lorekeeper) | **Farmer B PASS · Lorekeeper FAIL** | Farmer B echt (§3); Lorekeeper erst WSB K11, Mage-Platzhalter; cast.r1.json selbst weiter nicht auf diesem Mac |
| M0-3 | Jeder Clip isoliert nachgewiesen | **NOT RUN** | genutzt as-is: Idle_A, Idle_B, Walking_B, Interact, PickUp, Use_Item, Waving (Rig_Medium General/MovementBasic/Simulation) |
| M0-4 | Konzeptblatt Phase A | **NOT RUN** | WS0 schreibt es |
| M1-1 | Tagesplan `kfb.npc-day/1` für zwei Bewohner, deterministisch je Seed | **PASS** | npcWorld, npcSim |
| M1-2 | Arbeits- und Sozial-POIs mit Aktionsraum ≥ 1,5 m an echten Weltobjekten | **PASS** | npcWorld (Baum in Reichweite 1,7–1,8 m; kein Stamm/Fundsache/Laterne im Raum) |
| M1-3 | Zwei Routen-Varianten je Weg, beide benutzt; frei von Stämmen (≥ 1,7 m), Fundsachen (≥ 0,96 m), Laternen, Rang-Zaun, Theaterring | **PASS** | npcWorld; Spiegel = Spielstand (npc-a B) |
| M1-4 | Gang ohne Rutschen: Abspielrate 0,8–1,25, Sohlen am Boden (tiefste Sohle −2 … +6,7 cm), Wurzel auf dem Gelände | **PASS** | npc-a D |
| M1-5 | Unterbrechen durch den Spieler (stehen, drehen, schauen) und Fortsetzen mit Aufholen ≤ 1,25 × | **PASS** | npc-a E (aufgeholt nach 13 s), npcSim |
| M2-1 | Echte gegenseitige Begegnung über die Grammatik, beide richten sich aus | **PASS** | npc-a C (Blickfehler < 1°), Clip |
| M2-2 | Begegnung pausiert, wenn der Spieler dazukommt, und setzt am selben Beat fort; Fensterende bricht sauber ab | **PASS** (Node) / **NOT RUN** (im Spiel) | npcSim 4a/4b |
| M2-3 | Weggehen und Zurückkommen: beide exakt auf dem Plan, kein Sprung im Kamerabild | **PASS** | npc-a F (Abweichung 4e-16 m, 0 Pop-ins in 4 289 Schritten) |
| M2-4 | Gruß-Geste | **PASS** | Gruß und Antwort-Gruß = `Waving` (npc-a C_greetGesture) |
| M2-5 | Zeile oder Schweigen | **PASS** (Schweigen) | stumm bis WS0 Ton/Text liefert; Ausgang `silent` vorhanden |
| M2-6 | Spieler-Hinweis E an Bewohnern (`interactable`) | **NOT RUN** | in M1 gibt es keinen interactable-Host, E = seitwärts |
| P-1a | ≥ 55 fps aus der Spielkamera (Spiel gesamt) | **FAIL** · Basis-Grenze | sichtbares Chromium, Metal, 1600×900, dpr 1, Stand a701da4: Spiel **ohne** Bewohner 35,1/35,1 fps, **mit** 34,9/35,1 fps (p95 ≈ 28,6 fps); auf 4c6ec5a unter höherer GPU-Last 15,5 bzw. 15,4–15,7. Die Grenze liegt im Spiel selbst (GPU geteilt mit ~8 Sitzungen; Prüfer C misst, CODE_PERF_R1 §7) |
| P-1b | Anteil der Bewohner an der Bildzeit | **PASS** · kein messbarer Anteil | A/B je 900 Bilder auf beiden Ständen: Unterschied innerhalb der Streuung (≤ 0,2 ms); Modul 0,11–0,15 ms/Schritt, +41 Draw Calls, +51 k Dreiecke |
| P-2 | Stresstest 8/12/20 | **NOT RUN** | erst nach 2 Figuren + fps-Basis |
| V-1 | Clip aus der Spielkamera | **PASS** | `test/out/npc/clip/page@….webm` (32 s, Headless-GPU mit Aufnahme) |
| V-2 | Mechanisches Gate + blinder Kritiker (CRITIC_3D_R1) | **NOT RUN** | nach echten Figuren |
| T-1 | volle `npm test` (46 Tests, PW_GPU, Stand 4c6ec5a; nach Rebase auf a701da4: Node-Tests + npc-a erneut PASS, volle Reihe vor dem Code-Push) | **PASS** außer bekannten Wacklern | Gesamtlauf 42/46; einzeln: s5a PASS (zuvor Zeitprüfung bzw. Netz 403), drift PASS (fehlte nur `test/out/drift/drift-report.json` im frischen Worktree), c2 PASS im Software-Modus; **orbit FAIL** (`calmAfterRelease`, SW: Zeitüberschreitung). Gegenprobe auf dem unveränderten Lead-Stand 4c6ec5a: orbit und c2 scheitern dort gleich → nicht durch Phase A |

**Phase A ist damit nicht abgenommen** (M0-2 FAIL, P-1a FAIL als Basis-Grenze; mehrere NOT RUN). Kein „MVP PASS“.

**Clip-Liste an WS0 (WSB baut):** `Digging` bzw. Harke/Mistgabel-Arbeit (Farmer B am Baum), Lesen/Buch (Lorekeeper). Alles für Rig_Medium.
**Lücken an WS0:** Konzeptblatt Phase A; Scheune/Strohballen-Bühne und Kartenraum als Orte (heute nur Stellen ohne Asset); Knete für die KayKit-Adventurer (keine Figurenkarte → kein `claySSOT`-Profil, Spieler und Partnerin haben eins).

**Phase C Schritt 0 (Quell-Audit, Lead-Freigabe):** erledigt, siehe Inventur §6. Isolationsbilder der 16 Bodenläufer (+Z bestätigt, Höhen = Spender), Lücken Maul-Anker (V-584) und Gelände-Patch (Terrain-Owner). **An WS0:** Cube wählen (Vorschlag Skull oder GreenDemon), Heil-Auslöser wählen (Vorschlag T Saugarm), weiße Augen bei WSB.

**Nächstes Gate:** Farmer-B-Dateien auf diesem Mac (Lead/WS0) → Tausch der Platzhalter-Figur, Clip-Isolation, Kritiker. Phase C P1 nach WS0-Entscheid zu Cube, Patch, Baum und Heil-Auslöser.

## 1 · 21.10. · Inventur-Entwurf + Bauplan Phase A

**Gelesen:** Brief R2, Dark-Fluffer-Brief, Patrol-Spec, PR-#400-Paket (R0.6, R0.7, R0.8, R1-Audit, Workshop R1, Intake, R0.9, Fluffer-Konzept + Follow-on), Dramatis Personae + Writers Room (`ws-song/workshop-r1`: FIGURES_R1, PERSONAE_PATCH_R1, RESIDENT_DP_ALIGNMENT_R1, Export 2026-10-20c), CANON_3D R1 + Konzeptblatt-Vorlage + Kritiker, PR #210 `encounter-bus.js` @f534a056, PR #272 AIDA @992ea98, Spielcode `terrain/439` @fd5ccc5.
**Nicht gelesen:** `60_CAST/cast.r1.json`, `clips.r1.json` (nur im Hub/Dropbox, auf diesem Mac nicht vorhanden); Google-Doc (Anmeldung nötig).

**Inventur:** `CANON_3D/sources/WS_NPC_INVENTUR_R1.md` (dieser Zweig). Kurz: Plan-Logik, Begegnungs-Bus und Bewegung lassen sich vollständig aus vorhandenen Quellen bauen. Es fehlen die Figuren-Dateien.

**Blocker (bitte Lead / Georg):**
1. **Farmer B (`farmer_harke`)**: GLB, Augenprofil, Figurenkarte nicht auf diesem Mac. Bitte nach `~/kfb-ws1/private/cast/` kopieren (lokal, nicht in Git), zusammen mit `60_CAST/cast.r1.json` und `clips.r1.json`.
2. Platzhalter zweite Rolle: Vorschlag `adventurer-mage` (im Spiel, KFB-Augen aus Georgs Batch), markiert `PLATZHALTER · Lorekeeper (WSB K11)`. Ob sie in cast.r1.json `ready` ist, kann ich ohne die Datei nicht prüfen.
3. Clip `Waving` (Grüßen) liegt nur unter `~/kfb-ws1/intake/loco/Rig_Medium_Simulation.glb`, nicht im Spiel. Darf ich das Paket as-is nach `src/assets/actors/` aufnehmen?

**Bauplan Phase A** (Laufzeit-Code nur lokal auf `ws-npc/phase-a`, Push erst nach WS0-Go):

| Schritt | Inhalt | Beleg |
|---|---|---|
| A0 Kern (rein, Node) | `src/npc/npcRoute.js` (`kfb.npc-route/1`: Polylinie, Länge, Lage/Blick bei s), `src/npc/npcDay.js` (`kfb.npc-day/1`: Zeit → POI, Aktivität, Route-Variante; `planAt(t)` deterministisch aus Seed + Tag), `src/npc/encounter.js` (Port #210 + `orient`, `silent`, `cancel`, `interrupt`/`resume`, stabile IDs) | Node-Tests: 21 alte #210-Prüfungen + neue (Abbruch, Unterbrechen/Fortsetzen, Überschneidung, Aufräumen, Schweigen, gleicher Seed = gleicher Tag, zwei Seeds = andere Route) |
| A1 Daten | `src/data/npc/pois.r1.json`, `routes.r1.json`, `days.r1.json`: Farmer B Arbeit = Obstgarten-Bäume (Fluff-Ernte), Sozial = Wegkreuzung am Demo-Weg / Amphitheater-Rampe (Theaterdirektorin), Zuhause = Ort ohne neues Asset (Scheune fehlt); Platzhalter-Rolle Arbeit = Billboard-Karte lesen, Sozial = dieselbe Kreuzung. Je Bewohner 2 Routen-Varianten | Node: jeder POI ≥ 1,5 m frei (Bäume, Zaun, Weg), Routen außerhalb des Rang-Zauns, Steigung begrenzt |
| A2 Modul | `src/npc/residentLife.js` (ein ModuleHost-Modul): Darsteller-Slot + GaitAnimator (V-248, Füße stehen), Ankunft = abbremsen → drehen → Blick → Aktions-Clip as-is; **Plan ist Wahrheit**: Abweichungen (Begegnung, Unterbrechung) holen danach im Tempo-Fenster ≤ 1,25× wieder auf. Blase: nah = voll, fern = seltener animiert, Lage immer aus dem Plan. Kinematische Kollider, Spieler-Hinweis über `interactable` | Browser `#m1,harvest,npc,debug,replay` |
| A3 Begegnung | Beide am Sozial-POI → bemerken → annähern → ausrichten → grüßen oder schweigen → reagieren → trennen → weitermachen; Spieler nähert sich → Unterbrechen (Blick, Gruß), danach Fortsetzen | Test: Beat-Folge, beide belegt, keine zweite Begegnung, Fortsetzen am selben Beat |
| A4 Weggehen/Zurückkommen | Spieler > R weg, Zeit läuft, zurück: beide stehen dort, wo der Plan sie sieht; kein Sichtbarkeitswechsel im Kamerabild | Test: Lageabweichung ≤ 0,05 m zum Plan, 0 Pop-ins im Frustum |
| A5 Abnahme | Abnahmematrix (PASS/FAIL/NOT RUN je Zeile), Clip aus der Spielkamera, fps (perfBudget + Messung im Spiel), volle `npm test` | Matrix hier + an Lead |

Einbau in `M1World.jsx` nur hinter dem Hash `npc` (eine Zeile + ein Kollider-Baustein), damit der Diff zum Lead-Stand klein bleibt.

**Nächstes Gate:** Lead/Georg zu Blocker 1–3; WS0 zum Konzeptblatt Phase A. A0 und A1 baue ich jetzt (brauchen keine Figur-Dateien).
