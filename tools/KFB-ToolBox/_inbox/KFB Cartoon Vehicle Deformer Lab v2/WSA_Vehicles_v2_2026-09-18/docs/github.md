repo: georg-doc/kayfabizarro
branch: main
path: registry/assets/v1, media/3D_Assets

secondary-repo: georg-doc/KFB-Stunt-Car-Race
secondary-branch: main
secondary-path: 3D Assets/KayKit_Space_Base_Bits_1.0_FREE, skills/, _handover/SPRINTS_2026-09-10

## Last sync
date: 2026-09-18T20:05:00Z

### Updated in this project
- Neuer Asset-Handoff `kfb.asset-handoff.v1` (consumer `animation-lab`, sourceCommit `29aac1061bdd`, 141 Assets) gegen die Fixture-Liste gerechnet: **112 Assets waren nicht referenziert**, davon rund zwanzig Fahrzeuge.
- `lab-v7/fixture-adapters.v3.js`: importiert v2 und hängt **15 Bodenfixtures** an (46 → 61) sowie **10 Flug-Fixtures** als eigene Ebene. Jede Zeile aus dem Handoff generiert. `Paper Plane` steht nicht im Handoff — Pfad byteweise geprüft (3216 B @ 29aac106) und mit `via: repo` geführt.
- Alle 25 neuen Zeilen im Browser geladen und vermessen. Befund: die Rad-Paar-Regel verwirft Traktor-Hinterachse, Schubkarrenrad und Rollstuhl-Lenkrollen korrekt; `rover-round` meldet 1 Rad und ist damit ein offener Verdacht auf eine Lücke im Insel-Weg.
- Neue Oberfläche `KFB Cartoon Vehicle Deformer Lab v2.dc.html` im Schnitt von `tools/resident_atlas_s6/KFB_Resident_Atlas_S6.html`: warm-dunkle Bühne, Auswahlfelder statt Knopfreihen, Zeitleiste im Dock, Tab »Flug«. v1 bleibt unverändert.
- `PLAN_flight_deformer.md`: drei Schnitte (Lage, Form, Ereignisse), gemessene Ersatzanker für ein Fahrzeug ohne Räder, Klapprad-Brücke über die bestehenden `steer/susp/spin`-Gruppen.

### Vorher
date: 2026-09-18T17:15:00Z

### Updated in this project
- Drei neue Motion-Familien gebaut: `lab-v7/vehicle-manoeuvre.v1.js` (Rückwärts, Wenden, Einparken), `lab-v7/vehicle-twowheel.v1.js` (Zwei-Rad-Schräglage, frei und an der Bande), `lab-v7/vehicle-tumble.v1.js` (Fassrolle mit wandernder Drehachse, gerundeter Umdrehungszahl, ballistisch abgeleiteter Landestärke). Lautwörter aus Vorgabe AUS.
- **FX-Quelle geprüft, nichts kopiert.** `media/3D_Assets/FX_Visual` enthält keine 3D-Effektnetze: `kenney_smoke-particles/PNG` liegt als Einzelbilder in fünf Ordnern (Black smoke 25, White puff 25, Explosion 9, Fart 9, Flash 9) und ist direkt als Billboard-Sprite verwendbar; `explosions_smoke` liefert GEPACKTE Spritesheets mit `.plist`-Bildlagen (siehe `explosion_smoke_HowTo_v01.md`) und müsste erst zerlegt werden. Folge für diese Linie: alle Effekte sind kamerazugewandte Billboards, keine Volumen.
- **VFX-Vorlagen im Repo gefunden und als Grundlage der nächsten Runde vermerkt**, statt neu zu erfinden: `travel/travel-v16/terrain-v16/speed-lines.js` (portiert aus TinySkies `client/src/game/SpeedLines.ts` @ 2659a5cc) sowie `travel/KFB Travel Globe v13-1/globe-v13/` mit `contrails.js` (Comic-Speedlines am Fahrzeug), `drift-smoke.js`, `impact-dust.js`, `carpet-wake.js`, `post-radial.js`. Planung in `PLAN_vehicle_vfx_flightmode.md`.
- **Befund an den Modellen: kein Fahrzeug hat einen Türknoten.** Acht Fixtures geprüft; Kenney und KayKit haben 6–8 Knoten (Karosserie plus vier Räder), die Poly-by-Google-Modelle sind nach MATERIAL getrennt (`Object003_1 … _6`). Einzige Ausnahme: `garbage-truck` bringt `arm`, `body`, `trash` als eigene Knoten mit. Der geplante Ausstieg wird darum als Ducken gebaut, nicht als Tür.

## Screen map

| Screen / Datei | Repo-Quellen |
|---|---|
| `lab-v7/fixture-adapters.v3.js` · `KFB Cartoon Vehicle Deformer Lab v2.dc.html` · `PLAN_flight_deformer.md` | `uploads/kfb-asset-handoff-animation-lab (6)` = `data/handoff-animation-lab-29aac106.json` (kayfabizarro @ 29aac106); UI-Vorbild kayfabizarro: `tools/resident_atlas_s6/KFB_Resident_Atlas_S6.html`; Modelle unter `media/3D_Assets/{KayKit_Mystery_Series6,Frankensteining,SciFI_Ultimate Space Kit_Quaternius,GLB_mini_chars,KFB,kenney_prototype-kit,KayKit_Medieval_Hexagon_Pack_1.0_FREE}` |
| `lab-v7/vehicle-manoeuvre.v1.js` · `lab-v7/vehicle-twowheel.v1.js` · `lab-v7/vehicle-tumble.v1.js` | KFB-Stunt-Car-Race: `skills/kfb-cartoon-animation_v2.md` (§1.2, §2.4, §2.5, §8.3, §10, §12, §15); Geometrie durchweg am geladenen Modell gemessen, keine Repo-Zahl übernommen |
| `PLAN_vehicle_vfx_flightmode.md` (Paket A, VFX) | kayfabizarro: `travel/travel-v16/terrain-v16/speed-lines.js`, `travel/KFB Travel Globe v13-1/globe-v13/{contrails,drift-smoke,impact-dust,carpet-wake,post-radial}.js`; Material `media/3D_Assets/FX_Visual/kenney_smoke-particles/PNG/*` (Einzelbilder) und `…/explosions_smoke/*` (gepackt, `.plist`) |
| `PLAN_vehicle_vfx_flightmode.md` (Paket B, Ausstieg) | kayfabizarro: `media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_{Medium,Large}/*.glb`; Maßregel aus `lab-v4/player.js` (Hüftspur in Medium-Maß auf Mannequin_Large 3,981 u) |

| Screen / Datei | Repo-Quellen |
|---|---|
| `KFB Vehicle Lab v1.dc.html` · `lab-v7/registry-vehicles.v1.js` | kayfabizarro: `registry/assets/v1/packs/kenney-car-kit.json`, `…/kenney-toy-car-kit.json`, `…/kenney-racing-kit.json`, `registry/assets/v1/manifest.json`; Modelle unter `media/3D_Assets/kenney_car-kit`, `…/kenney_toy-car-kit`, `…/kenney_racing-kit` |
| `lab-v7/cardeform.v1.js` | KFB-Stunt-Car-Race: `_inbox/KFB TRAVEL GLOBE re-home WS0/.../travel/kfb-cartoon-deform.js` (Technik-Vorbild) |
| `lab-v7/vehicle-fishtail.v1.js` | KFB-Stunt-Car-Race: `skills/kfb-cartoon-animation_v2.md` (§1.2, §2.4, §2.5, §8.3, §10, §12) |
| `lab-v7/carrig.v2.js` | wie v1, eine gemessene Änderung: Dicke-Schwelle 1,3 im Knoten-Weg (erzwungen von `spacetruck_large.gltf`, Verhältnis 1,407) |
| `lab-v7/carrig.v1.js` | KFB-Stunt-Car-Race: `_handover/SPRINTS_2026-09-10/F2_VEHICLE_REVIEW/source/frankenstein/race/src/vehicles.v1.js` (Inselregel, Radachse) |
| `lab-v7/fixtures.v1.js` | KFB-Stunt-Car-Race: `skills/kfb-cartoon-animation_v2.md` (§2, §11, §12) |
| `KFB Cartoon Vehicle Deformer Lab.dc.html` · `lab-v7/fixture-adapters.v2.js` · `lab-v7/vehicle-cartoon-deformer.v2.js` | `uploads/kfb-race-track-asset-handoff-generic-runtime.json` (Georgs Handoff, kayfabizarro @ 10a7fdce6b); kayfabizarro: `registry/assets/v1/packs/kaykit-city-builder-bits-1-0-free.json`, Modelle unter `media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE`, `media/3D_Assets/KFB`, `media/3D_Assets/Frankensteining`; KFB-Stunt-Car-Race: `_handover/CLAUDE_DESIGN_CARTOON_VEHICLE_DEFORMER_BRIEF_2026-09-17.md` |
| `lab-v7/fixture-adapters.v2.js` · Gruppe `spacebits` | kayfabizarro: `registry/assets/v1/packs/kaykit-space-base-bits-1-0-free.json`, `media/3D_Assets/KayKit_Space_Base_Bits_1.0_FREE/Assets/gltf/spacetruck{,_large,_trailer}.gltf` @ `eb48f50489b9` |
| `3D Assets/KayKit_Space_Base_Bits_1.0_FREE/*` | KFB-Stunt-Car-Race, gleicher Pfad (contents.png, sample.png, License.txt, spacebits_texture.png) |

## Sync history

### 2026-09-18T01:52:00Z
date: 2026-09-18T01:52:00Z
commit: eb48f50489b9e4903ec1e3d2fb1837605ce7d792

### Updated in this project
- KayKit Space Base Bits aufgenommen: `spacetruck`, `spacetruck_large`, `spacetruck_trailer` als neue Fixture-Gruppe `spacebits` — 46 Fixtures statt 43.
- Befund B2 erledigt: das Pack liegt jetzt in `kayfabizarro/media/3D_Assets` und im Registry-Pack `kaykit-space-base-bits-1-0-free`; glTF, `.bin` und Textur byteweise geprüft, Pin `eb48f50489b9`.
- Zwei neue Deformer-Profile `SPACE_HAULER` und `TRAILER_TOWED` (beide nicht abgestimmt, Struktur deklariert).
- `registry-vehicles.v1.js`: die drei Zeilen von `available: false` auf gepinnt und ladbar gestellt.
- Neue Motion-Familie `lab-v7/vehicle-fishtail.v1.js` (Schlingern): Drehung um die gemessene Vorderachse, Gegenroll nachlaufend, Gegenlenkung abgeleitet.
- Neue Rig-Fassung `lab-v7/carrig.v2.js`: Dicke-Schwelle der Radsuche nach Weg getrennt (1,3 Knoten, 1,5 Insel).

### 2026-09-17T19:48:00Z
date: 2026-09-17T19:48:00Z
commit: 10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0

### Updated in this project
- Fahrzeugliste auf Georgs Asset-Handoff umgestellt (`kfb.asset-handoff.v1` @ 10a7fdce6b): 43 Fixtures, davon 25 aus dem Handoff und 18 aus dem Registry, Herkunft je Zeile.
- Nachgetragen, was fehlte: KayKit City Builder Cars (5) und die Poly-by-Google-Fahrzeuge (7).
- Neuer gruppenbasierter Deformer `lab-v7/vehicle-cartoon-deformer.v2.js` samt Profilen und zwölf Testsequenzen; Shader-Fassung `cardeform.v1.js` überholt.
- Neue Werkbank `KFB Cartoon Vehicle Deformer Lab.dc.html`; Rückmeldung in `RETURN_cartoon_vehicle_deformer.md`.

### Vorherige Runde
- Fahrzeugliste aus den Registry-Packs gezogen (kenney-car-kit, -toy-car-kit, -racing-kit): 22 Fahrzeuge mit gepinnten RAW-Adressen.
- Neue Fahrzeug-Linie `lab-v7/` plus Oberfläche `KFB Vehicle Lab v1.dc.html` (Rig, Cartoon-Deformer, fünf Fixtures, Telemetrie-Naht).
- Befund: KayKit Space Base Bits liegt nicht im Registry und ist im Browser nicht ladbar (RAW-Fehler, `.bin` nicht kopierbar) — Abhilfe als `.glb` in `media/3D_Assets`.
- Stand-Dokument `LIVING_VEHICLES.md` angelegt.

### 2026-09-17T18:33:30Z
- Erstaufnahme: Space-Base-Bits-Inventar gelesen (57 glTF, 3 Fahrzeuge), Vorarbeit `kfb-cartoon-deform.js` und `vehicles.v1.js` gelesen, `github.md` angelegt.
