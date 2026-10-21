# WS-NPC · Inventur R1 · 2026-10-21 · Entwurf
Ziel-Ort im Hub: `CANON_3D/sources/WS_NPC_INVENTUR_R1.md` (WS0 übernimmt; WS-NPC schreibt nicht in den Register-Zweig).
Auftrag: `BRIEF_WS1_NPC_LIFE_R2.md` (V-585), gelesen auf `origin/docs/kfb-decisions-register-2026-10-11` @e71b70f4a.
Spiel-Basis: `kfb-planet` Zweig `terrain/439` @fd5ccc5 (three r186, R3F, Rapier, ecctrl). Eigener Worktree `~/kfb-ws1/kfb-planet-npc`, Zweig `ws-npc/phase-a` (lokal, nicht gepusht).

Legende: **Ü** = übernommen · **N** = nicht übernommen (Grund) · **L** = Lücke (wer liefert)

## 1 · Auftrag und Entscheidungen
| Quelle | Ü / N / L |
|---|---|
| `BRIEF_WS1_NPC_LIFE_R2.md` | **Ü** vollständig: Phasen A → C → B → D, WS0-ACK 1–7, Messlatte ≥ 55 fps, Abnahmematrix PASS/FAIL/NOT RUN je Zeile, Grenzen. |
| Lead-Entscheid 21.10. (Sitzungs-Auftrag, WS1_STATUS §118) | **Ü** Speicher-Owner `kfb.world-save/1` = WS1-Lead (`src/world/worldSave.js`); WS-NPC liefert nur den Abschnitt NPC-Gedächtnis als Vorschlag. Status über Lead + `WS_NPC_STATUS.md` auf `ws-npc/status`. |
| `WS1_EMERGENT_RESIDENT_LIFE_SOCIAL_MEMORY_WORKSHOP_R1` (gilt) | **Ü** M0–M2 = Phase A; Abnahmematrix-Zeilen; Return-Vertrag. **N** M3 jetzt (wartet auf worldSave), M4 LLM (erst nach A–B mit Georgs Go), M5 (= Phase D, eigenes Go). **N** „GPT Site URL“ als Abnahmefläche: es gilt das Spiel mit Hash (`dist/index.html#m1,…`). |
| `SPEC_NPC_PATROL_R1.md` (V-464) | **Ü** Fahrplan statt Simulation: Position(t) aus Route + Startzeit + Tempo; Spielerblase R; Erscheinen exakt am Planort; `kfb.npc-route/1` (id, zone, points, stops, loop/pingpong, speed). **N** Begegnungstabelle, Spielzeugsoldaten, Bots (Phase D). |
| `BRIEF_WS1_DARK_FLUFFER_R1.md` (V-583) | **Ü** als Phase C, nach A. Jetzt nur Schritt-0-Vorbereitung (siehe §6). |
| `KONZEPTBLATT_R1.md` (Vorlage, V-561) | **L** Für die Bewohner-Szene liegt kein ausgefülltes Konzeptblatt vor. WS0 schreibt es. Bis dahin baut WS-NPC nur Logik und Bewegung in der vorhandenen M1-Welt, keine neue Umgebung. |
| `CANON_3D_R1.md` | **Ü** Gebiete 9 (Augen, kein Skalieren), 10 (Augen → Kopf → Körper, Tempo-Fenster, Clip-Stufen statt Multiplikator), 13 (eine Besetzungsliste), 14 (Gate, Kritiker). Licht, Schatten, Knete nur über vorhandene Module (`kfb-stage-light`, `claySSOT`, terrain3-Fuß/Schatten). **N** `kfb_env.py`/Blender-Werkzeuge: Phase A baut keine Umgebung. |
| `CRITIC_3D_R1.md` | **Ü** als Abgabeweg nach dem mechanischen Gate. |

## 2 · Quellpaket PR #400 (`recovery/kfb-minigames-fluff-source-bridge-2026-10-15`)
| Quelle | Ü / N / L |
|---|---|
| R0.6 Resident Life (POI, Tagesablauf, Aggro, Gedächtnis) | **Ü** Intent statt Zufallslaufen; kleine Zustandsmenge `IDLE → SELECT_POI → TRAVEL → ACT → ENCOUNTER → RESUME/REPLAN`; Wiederholungs-Strafe + Mindest-Haltezeit; Seed je Bewohner; Nah/Mittel/Fern-LOD; Debug-Zeile (intent/POI/Route/Phase/Grund). **N** Treffer-Leiter, KO, Respawn, Fluff-Beute (Phase D bzw. C). |
| R0.7 Choreografie mit KayKit | **Ü** Ankunft = abbremsen, drehen, Blick, Haltung; dann ein Aktions-Beat; Root-Motion überschreibt nie die Bewegung; acht Kanäle, Priorität Sicherheit > Aktion > Begegnung > Dialog > Reaktion > Idle; Interrupt = Schnappschuss + Fortsetzen. **L** Clip `Digging` (Farmer) und Lorekeeper-Requisiten (Buch, Stab) nicht nachweisbar, siehe §5. |
| R0.8 AI-Town-Rekonstruktion | **Ü** höchstens eine offene Operation je Bewohner; Einladung → Hingehen → Teilnehmen → Gehen; Wahrnehmung → Deutung → Absicht → Weltaktion; kein gemeinsamer Geist. **N** Convex, Pixi, Vektorspeicher, LLM je Bild, Yuka als zweiter Bewegungs-Owner. |
| R1-Quell-Audit | **Ü** KEEP/ADAPT/REJECT-Tabelle wie dort; `interactable.js` nur für den Spieler-Hinweis; POI-Sicht read-only über vorhandene Szenenobjekte. **N** Perplexity-TS-Schema 1:1 (dupliziert Profil/Plan im Save). |
| WS0-Intake R1, R0.9 Google-Doc-Handoff | **Ü** nur als Kontext. |
| Dark-Fluffer-Konzept R1 + WS1-Follow-on | **Ü** für Phase C (Spender-Pins `KFB-Combat-Arena` @f6a59ad: Roster, `spuck.v3.js`, `zensur.v3.js`). **N** `flood.v3.js`, Blumen, zweites Kampfsystem. **L** Repo `georg-doc/KFB-Combat-Arena` lokal nicht geklont, Schritt 0 in Phase C. |
| Card Ink Defense R0.5 | **N** jetzt (kein Bezug zu A). |
| **Google-Doc** (Recherche-SSOT) | **L** nicht ohne Anmeldung gelesen; Inhalt nur über R0.9/R1-Zusammenfassungen bekannt. |

## 3 · Spender-Code
| Quelle | Ü / N / L |
|---|---|
| PR #210 `encounter-bus.js` @f534a056 (157 Z.) | **Ü** `EncounterBeatBus`, `createEncounterHost`: Legalität, belegte Teilnehmer, genau eine Begegnung, Beats. **Erweiterung (Phase A):** Abbruch (`cancel`), Unterbrechen/Fortsetzen (`interrupt`/`resume`), Beat `orient`, Ausgang „schweigen“ statt Angebot; IDs aus Bewohner-Paar + Plantag statt `enc-<n>` (stabil für Phase B). **N** `offer` als Gegenstand (kein Grant). Alte 21/21-Tests werden mitportiert und laufen gegen die erweiterte Fassung. |
| PR #210 `npc-life-01.adapters.js` | **Ü** Idee „Clip nur aus `availableFor(actorId)`“. **N** ChatterBox-Zeilen (Ton/Text liefert WS0; bis dahin Blase mit Platzhalter-Text oder Schweigen). |
| PR #272 `resident-aida-poi.v0.1.json` @992ea98 | **Ü** Semantik: AIDA-Zustände, POI-Felder, Auswahl-Priorität (`continue_current_routine` vor `open_social_thread`), Rückkehr-Pflicht nach Beat. **N** Laufzeit, Speicher-Teil (Phase B). |

## 4 · Spiel (WS1, `terrain/439` @fd5ccc5)
| Teil | Ü / N / L |
|---|---|
| `ModuleHost.jsx` (create/update/dispose) | **Ü** ein Modul `residentLife` für alle Bewohner, ein Takt (M1Loop, 1/60 s). |
| `m1-locoActor.js` + `m1-gait.js` (GaitAnimator, V-248) | **Ü** Gang-Mischer für NPC-Fortbewegung (Abspielrate = Tempo/Eigentempo, keine rutschenden Füße), Overlays für Aktions-Clips, Augen → Kopf → Körper. |
| `actors/actorSlot.js` + `stageCast.js` (KAYKIT) | **Ü** Figuren nur über den Darsteller-Slot (KFB-Augen über kaykit-eye-adapter). |
| `world/interactable.js` | **Ü** Spieler-Hinweis E an einem Bewohner (bewegtes `pos()`), keine eigenen Listener. |
| `world/save.js` (`kfb.save/1`) | **N** kein NPC-Zustand im Spieler-Save. |
| `kfb.world-save/1` / `src/world/worldSave.js` | **L** gibt es noch nicht (Lead baut). Phase A nur flüchtig. |
| `world/fluff.js`, Obstgärten (`#m1,harvest`, Zonen goblin/atlantis/utopia), Amphitheater, Demo-Weg | **Ü** als echte, vorhandene POI-Orte (Arbeit: Obstgarten-Bäume; Sozial: Amphitheater-Rampe/Bühne, Wegkreuzung). |
| `world/perfBudget.js` | **Ü** Messung (p95, Calls, Dreiecke) + fps aus der Spielkamera. |

## 5 · Figuren und Clips
| Quelle | Ü / N / L |
|---|---|
| `60_CAST/cast.r1.json`, `60_CAST/clips.r1.json` | **L — Blocker.** Liegen nur im Hub (Dropbox). Auf diesem Mac gibt es kein Dropbox (bestätigt im Lead-Status §118); in keinem Git-Zweig. Status `ready` von `farmer_harke` damit nicht prüfbar. |
| Farmer B = KayKit S6 Farmers Textur B (`farmer_harke`) | **L — Blocker.** GLB, Augenprofil, Figurenkarte nicht auf diesem Mac (gesucht: alle Worktrees, `intake/`, Repo-Zweige). Writers Room `the_bards_barnyard_beatdown`: **BESTÄTIGT**, Rolle „Bäuerin als Theaterdirektorin“, Zuhause „Scheune mit Strohballen-Bühne“. |
| Lorekeeper (KayKit S6 #1) | **L** erst über WSB K11 (Augen, Mund, Clips, Cast-Eintrag). Writers Room `frizzlebob_s_mission_control`: VORSCHLAG, Zuhause „Kartenraum mit Questbrett“. |
| Platzhalter zweite Rolle | Vorschlag **`adventurer-mage`** (KayKit Adventurers Mage, im Spiel mit KFB-Augen aus Georgs Batch, `src/data/actors/cast/`): Gelehrten-Silhouette passt zur Lorekeeper-Rolle (Archiv, Lesen). Klar markiert `PLATZHALTER · Lorekeeper (WSB K11)`. Ob „ready“ in cast.r1.json: **nicht prüfbar** (siehe oben). Alternative: `gothgirl` (im Spiel, Figurenkarte), steht aber schon als Bühnen-Partnerin. |
| Hexen (Witch A/B), Fluff-Alchemistinnen (Georg 21.10.) | **L** kein GLB auf diesem Mac. Writers Room: VORSCHLAG, Zuhause Kräuterküche bzw. Trankküche = Arbeits-POI-Kandidat. Für Phase C relevant. |
| Clips im Spiel: `Rig_Medium_General` (Idle_A/B, Interact, PickUp, Use_Item, Throw, Hit_A/B, Death_*), `Rig_Medium_MovementBasic` (Walking_A/B/C, Running_A/B, Jump_*) | **Ü** as-is (V-574). Gehen = Walking_B über GaitAnimator; Arbeit = `Interact`/`Use_Item`/`PickUp`; Begegnung = Kopf/Blick + `Idle_B`. |
| Clips unter `~/kfb-ws1/intake/loco/`: `Rig_Medium_Simulation` (**Waving**, Cheering, Sit_Floor_*, Sit_Chair_*), `MovementAdvanced`, `Special` | **Ü nach Freigabe:** `Waving` = Grüßen, `Sit_Floor_*` = Pause. Nicht im Spiel eingebunden; Herkunft KayKit Character Animations wie die beiden Spiel-Pakete. Frage an Lead: in `src/assets/actors/` aufnehmen? |
| Clip `Digging` (R0.7, Farmer) | **L** in keinem lokalen Paket. Bis WSB liefert: `Interact`/`Use_Item` am Baum. Liste an WS0. |

## 6 · Dark Fluffer (Phase C, Schritt 0 · Quell-Audit, Lead-Freigabe 21.10., kein Laufzeit-Code)
Spender gelesen: `georg-doc/KFB-Combat-Arena` main **@f6a59ad** (= Pin im Brief): `modules/kfb-monster-roster.js` (204 Z.), `combat-arena-v2/mobs.v2.js` (581), `combat-arena-v3/spuck.v3.js` (404), `combat-arena-v3/zensur.v3.js` (1015), `docs/ENTWURF_zensur-und-heilung.md` (98). Modelle: `kayfabizarro` main `media/3D_Assets/MonsterPack_Quaternius/MonsterCuteCubes/glTF/` + `Textures/`.

| Quelle | Ü / N / L |
|---|---|
| Roster: 21 Cubes, 16 Bodenläufer mit 10 Clips (Bite_Front, Bite_InPlace, Dance, Death, HitRecieve, Idle, Jump, No, Walk, Yes), `Tree` ohne Death, 4 Flieger ohne Walk/Idle; vorne = **+Z** (im Spender gemessen) | **Ü**. Isoliert nachgerendert (Licht nur `kfb-stage-light`): 16 Läufer frontal, Blick +Z als Pfeil, `Bite_Front` von vorn und seitlich. Höhen = Spender-Messung (z. B. Skull 1,56, Alien 2,07, Cactus 2,236). Bilder: `test/out/npc/iso/cubes-sheet.png`, `lineup1_front.png`, `lineup2_front.png`, `bite_front.png`, `bite_side.png` (lokal). **N** Flieger (P4). |
| `spuck.v3.js`: Ansage 0,34 s, Tropfen sammeln sich am Maul, 3–5 Tropfen, Flug 0,42–0,95 s, Bogen mit Mindeststeigung, Klecks erst beim Aufprall, Abgang erst wenn der Körper ±29° aufs Ziel schaut, keine Zielmarke, Tinte `#1f1a14` | **Ü** als Choreografie. **L** Maul-Ort ist im Spender geschätzt (`maulHoehe` 0,62 × Körperhöhe, `maulVor` 1,02 × Radius); ein gemessener Maul-Anker je Cube kommt erst mit dem WSA-Spenderpaket (V-584). |
| `zensur.v3.js`: Tusche als Karten-UV-Maske (Canvas) | **N** 1:1 (Karte ≠ Gelände). **L** Für das Gelände braucht es einen begrenzten Patch (Decal/Zellmaske) über den Terrain-Owner (Lead), kein Flood-Shader. |
| `mobs.v2.js` | **N** als Laufzeit (zweites Spawn-/Bewegungssystem verboten); nur Idee „Blick dreht weich, Spucken wartet auf Blick“. |
| `ENTWURF_zensur-und-heilung.md` (7.9.): Heilen statt Töten, weiße Augen, Tinte stoppt | **Ü** Kern. **N** Blumen (Georg 21.10.: abgelehnt). |
| Welche Cube? | **Ü Georg 21.10.: `Ghost.gltf`** (Bodenläufer, 10 Clips, Höhe 1,41). |
| Weiße Augen | **L** Variante baut WSB (Blender, as-is bis auf die Augen); bis dahin Heilung ohne Augenwechsel. |

**Heil-Werkzeug-Kandidaten im Spiel** (`#m1,harvest`, vorhandene Aktionen, keine neue Waffe): V Faust (`punch`), B Schuss (`shoot`, echtes Projektil), N Cartoon-Bombe (`blast`), T Saugarm (`fluffSuck`, saugt bis zu 6 Kügelchen im Kegel), I Aufheben. Team-Heilen: Hexen als Fluff-Alchemistinnen (Georg 21.10.), Figur noch nicht auf diesem Mac. **Georg 21.10.: Heil-Waffe vorerst `KayKit_Bits_Bundle1_1.1/Prototype Bits/Assets/gltf/Gun_Pistol.gltf`** (statt töten). Früherer Vorschlag war T Saugarm (saugt das dunkle Goo ab statt zu schlagen, passt zu „Heilen statt Töten“; bunter Fluff fällt danach einmal über `fluff.js`).
**Kampf-Schnittstelle:** Treffer gibt es heute nur gegen Obstgarten-Bäume (`orchard.hitTree/shoot/blast`), keine Gegner-Trefferwahrheit. P1 bleibt deshalb gewaltfrei (Spucken, Ausweichen, Reinigen/Ablauf).

## 7 · Lücken-Liste (Kurzform)
1. `60_CAST/cast.r1.json` + `clips.r1.json` auf diesem Mac (Blocker, Dropbox fehlt).
2. Farmer-B-GLB + Augenprofil/Figurenkarte (Blocker für A2).
3. Konzeptblatt WS-NPC Phase A (WS0).
4. `kfb.world-save/1` (Lead) → Phase B.
5. Lorekeeper (WSB K11); Clip `Digging`; Lorekeeper-Requisiten.
6. Google-Doc ohne Anmeldung nicht lesbar.
7. Scheune/Strohballen-Bühne als Asset fehlt → Zuhause-POI nur als Ort, ohne neues Asset.
8. Ton/Stimme (WS0) → stumm bzw. Text.
