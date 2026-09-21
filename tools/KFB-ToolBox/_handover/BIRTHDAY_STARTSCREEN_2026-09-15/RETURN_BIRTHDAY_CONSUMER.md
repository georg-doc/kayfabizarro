# RETURN · Birthday-Consumer-Handoff · ToolBox/Design · 15.09.2026

**Status:** TESTED RESULT für das Casting · Actor-/Motion-Eingaben consumer-ready benannt · **keine** Travel-Implementation, **kein** Rebuild von Ergebnis A, Ergebnis B unangetastet.
**Auftrag:** [`START_HERE.md`](START_HERE.md) · Board P0.1.
**Consumer:** Travel/Astra Birthday Startscreen (eigener Implementation-SSOT, `georg-doc/KFB-Travel-Globe`).
**Repo-Stand gelesen:** `main` @ `b15931f4803938d6ebe1bbd33fd25f2eec071a0d` (06:20 UTC) · `KFB ToolBox.zip` @ `d3c16e3a…` (3 981 305 B, sha256 `06ad6176…46b27` — Intake-Angabe, hier nicht neu gehasht).

## 1 · In einem Satz

Beide Hero-Figuren laufen am **echten Rig** mit demselben KayKit-Rig_Medium-Casting — Idle_A · Waving · Cheering · zurück zu Idle_A, je **69/69 Tracks gebunden** — FrizzleBob über den vorhandenen `mountGraft`-Leser, Novacyy/GothGirl direkt aus dem Repo-GLB; Dance bleibt P1 (kein Tanzclip im Spender), Hihi ist ein inaktiver Slot auf dem bestehenden Cube-Pet-Vertrag.

## 2 · Return Contract

| Item | exact source/config | consumer API/path | tested evidence | status |
|---|---|---|---|---|
| **FrizzleBob** | `kfb.pets/1` pet `graft-driver` · Fixture `A_QUELLSTAND/src/fixtures/kfb-pet-graft-driver.v4.json` (v1.2.9 / meta.contract 1.3.0, 13.09.) · **plus** Georgs Export 15.09. `profiles/kfb-pet-graft-driver.georg-2026-09-15.json` (sha256 `554a4395…9a05`, Waffe aus, Brauen/Nase carl-original, **ohne `anim`-Block**) | `frizzlegraft-v1/graft-mount.v1.js` → `mountGraft({THREE, loader, parent, pet: pickGraftPet(lib,'graft-driver'), lib, camera, animation:'host'})` · `handle.figure` = Skelettwurzel für den Consumer-Mixer · `handle.update(dt, cam)` je Bild (Gesicht, Pose, Wobble) · `handle.dispose()` · Look/Eye/Mouth-Owner bleibt der Graft (Studio-Bauweg) | Probe 06:37 UTC: Fixture gemountet, 23 Knochen, brow `carl-original`, Waffe `OK`; Georg-Profil gemountet: brow/nose `carl-original`, Waffe aus · `05–08-casting.jpg`, `02-layout.jpg` | **PASS** |
| **Novacyy / GothGirl** | `media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb` · 323 724 B · Blob `b56f67e4ddb7` · Commit `5b94e3e1…f405` (14.09.) · CC0 · lokale Packs `GothGirl/Animations/gltf/Rig_Medium/{General,MovementBasic}.glb` = **bytegleich** zur Shared-Library (Blobs `5d16cb68…`, `98e965e8…`) | `GLTFLoader.loadAsync(raw)` → `gltf.scene` als Mixer-Wurzel; Clips aus den Rig_Medium-Packs; Registry-Referenz: Librarian »live« findet das Asset, der v1-Katalog (Pin 11d7df97, 12.09.) **nicht** — Registry-Nachzug ist Librarian-Sache (P0.4) | 6 SkinnedMeshes · **23 Knochen** · 0 eingebettete Clips · 55/55 Clips aus General/MovementBasic/Simulation/Special voll gebunden · `01–04-casting.jpg` | **PASS** (Rig-Familie über Bindung gemessen; Skin-Namen tragen kein `Rig_Medium`) |
| **Idle** | `Rig_Medium_General.glb` · `Idle_A` · 1,067 s · loop | Consumer: `mixer.clipAction(Idle_A).play()` — identisch zur ToolBox-Zuordnung `anim-map.v1.js` STATES.Idle | binding **69/69** beide Figuren · Bild 01, 05 | **PASS** |
| **Focus / Hover** | `Rig_Medium_Simulation.glb` · `Waving` · 2,133 s · once | `LoopOnce` → `finished` → crossFade 0,25 s zurück zu Idle_A (anim-map STATES.Wave) | **69/69** beide · Rückweg beobachtet · Bild 02, 06 | **PASS** |
| **Select / Celebrate** | `Rig_Medium_Simulation.glb` · `Cheering` · 1,667 s · once | wie Focus (anim-map STATES.Cheer) | **69/69** beide · Rückweg beobachtet · Bild 03, 07, 01-layout | **PASS** |
| **Rest / Recovery** | = Idle_A (loop) | `crossFadeTo(idle, 0.25)` nach jedem Once-Clip; kein Clamp, kein Restzustand außer Idle | Bild 04, 08 | **PASS** |
| **Dance · P1** | **kein** Tanzclip in KayKit Character Animations 1.1 (anim-map: »Kein Tanzclip im ganzen Spenderpaket«) | genau ein P1-Kandidat: `Rig_Medium_Special.glb` · **`Skeletons_Taunt_Longer`** · 3,0 s · loopbar · 69/69 an beiden Figuren — Lesart als Groove **nicht gesichtet**; Alternative = eigene Aufnahme | Bindung gemessen · `01/02-dance-p1-candidate.jpg` | **OPEN (P1)** |
| **Hihi inactive** | Identität »Hihi« im Repo **nicht registriert** · bestehender Vertrag `kfb.pet-library/1` pet `cat` → `GLB_cube-pets/animal-cat.glb` (Commit `b601e553…`) · Motion `kfb.motion-library/1` v1.2.0 | Slot zeigt das GLB mit eingebettetem `idle` (1,0 s, Node-Anim, 0 Knochen); **keine** Rigging-/Talk-/Dance-Arbeit | 8 Clips gelesen (`static, idle, walk, run, eat, dance, gesture-±`) | **PASS als Slot** (Name-Registrierung offen, Owner Librarian/Georg) |
| **EyeRig Speaker · P1** | Prop vorhanden: `GothGirl/assets/gltf/GothGirl_Speaker.gltf` (+ `.bin`, Textur) · 1 Mesh · h 1,0 · EyeRig-Donor `petstudio-v9/studio-v12/pet-eye-rig.v6.js` (Leser: `mountGraft`/`mountCarl`) | Mount-Pfad benannt, **nicht** montiert; Pointer-/Active-Look ist vorhandene EyeRig-Capability (`rig.pointTo`), Audio-Ownership bleibt Travel | Prop lädt · Messlauf | **OPEN (P1)** |

Consumer-Regeln, die aus der Messung folgen:

- **Ein Mixer je Figur**, Wurzel = `handle.figure` (FB) bzw. `gltf.scene` (GothGirl). Keine zweite Mixer-Instanz für das Gesicht — `handle.update` treibt es.
- **Waffe:** Fixture trägt `graft.weapon.on:true`. Für den Startscreen entweder Georgs 15.09.-Profil nehmen (Waffe aus) **oder** `override:{graft:{weapon:{on:false}}}` an `mountGraft` — nicht im Vertrag editieren.
- **`anim`-Block:** Georgs Export trägt keinen; `anim-contract.v1.js#normalize(undefined)` liefert den Default (`Medium/chain`). Kein Fehler, aber siehe §4.
- Shared-Library **per Registry-Pin** laden (`raw/…/11d7df978c…/KayKit_Character_Animations_1.1/…`), nicht `main` — die Probe hat beide gegen dieselben Blobs geprüft.

## 3 · Ergebnis A · `FIELD_COVERAGE.md` nach neuer Lieferung

Die Datei im Repo (`_inbox/WS0_2026-09-15/FIELD_COVERAGE.md`, Blob `52519a1b46e2`) ist **bytegleich** zur hier vorliegenden — Georg hat den Jobordner-Kern (5 Dokumente + LIES_MICH + B-Pilot) und das vollständige `KFB ToolBox.zip` nach `main` gebracht; `qa-wsa/`, `PUSH.md`, `original/` und der entpackte A-Baum liegen **nur im ZIP**, nicht als Baum. Kein neuer Widerspruch. Zeilenstatus nach dieser Runde:

| Zeile | vorher | jetzt | Grund |
|---|---|---|---|
| `anim.{rig,mode,clipMap,params}` | APPLIED_MEASURED | **APPLIED_MEASURED + Befund** | Georgs Studio-Export 15.09. (`meta.contract 1.3.0`) enthält **keinen** `anim`-Block, das Fixture vom 13.09. schon → Studio-Single-Export verliert den Block **oder** Georgs Sitzung hat ihn nie erhalten. Rundlauf-Zeile bleibt NOT_TESTED, dieser Fall gehört dort hinein. Owner WS0. |
| `graft.weapon.on` | APPLIED_MEASURED | APPLIED_MEASURED | beide Werte (`true` Fixture / `false` Georg) korrekt umgesetzt (Waffe an/aus im Mount) |
| `brow.graft.*`, `nose.mod`/`nose.graft.*` | NOT_STORED | **APPLIED_SOURCE (Georg-Profil)** | Georgs Profil belegt `brow.graft.color`, `nose.mod:'carl-original'`, `nose.graft.{scale,depth,color}` → `report.nose='carl-original'`; Sichtbeleg `02-layout.jpg` nur als Status, kein Nahbild |
| `pose.arm*` | APPLIED_SOURCE | APPLIED_SOURCE | Georg-Profil andere Armwinkel (`armDy −0,132 / armDx −0,509 / armDz −0,339`), gemountet ohne Fehler; nicht vermessen |
| `seat`, `cardRider` | NOT_MEASURED | NOT_MEASURED | unverändert — und Georgs Notiz (§5) betrifft genau diesen Kanal |

Alle übrigen 44 Zeilen unverändert. Kein Source-/Contract-Blocker für den Birthday-Slice.

## 4 · Ergebnis A und B — getrennt

- **A:** Quellstand unverändert genutzt (Leser `graft-mount.v1.js`, Fixture, Module) — nichts kopiert, nichts nachgebaut. Neuer Beleg: mountGraft mit **zwei** Verträgen (Fixture + Georg-Profil) fehlerfrei.
- **B:** UI-Pilot nicht angefaßt, nicht geprüft. Workflow-Test »Select actor → inspect → choose state clips → export → consumer mounts same« ist mit dieser Probe **außerhalb** des Piloten gelaufen — das ist ein UX-Befund für B: der Pilot hat heute keine Fläche, die ein Casting (Zustand → Clip → Bindung) ausgibt; die Probe ersetzt das nicht, sie zeigt nur, was fehlt.

## 5 · Notizen für später (Georg, 15.09., nicht Birthday-Blocker)

1. **Surf-Sektion im Studio »komplett broken«** (Body-Reiter, Seat · sitting pose v13 · Surf) — Screenshot zeigt FB frei rotiert über der Karte.
2. **Wild rotierender FB läßt sich nicht zurücksetzen** → gehört in Rigging/Animation-Lab-Workflow (authored reset pose, dieselbe Regel wie Town-Handoff §7 D).
3. **Flatternde Surf-Karte aus Travel Globe** einbauen/nutzen statt der starren Karte im Studio (`cardrider.v1`).
Alle drei: Owner WS0/Studio, Kanal `seat`/`cardRider`/`pose` — Zeilen in `FIELD_COVERAGE.md` bleiben NOT_MEASURED.

## 6 · Nicht gebaut

Kein Startscreen, kein Terrain/Sky/Audio/Feuerwerk, kein neuer Actor-Contract, keine Dance-Library, kein Retargeting, kein UI-Rework, keine Registry-Schreibung, kein Umbenennen von GothGirl.

## 7 · Dateien dieser Runde

    _handover/BIRTHDAY_STARTSCREEN_2026-09-15/
      RETURN_BIRTHDAY_CONSUMER.md          dieses Dokument
      profiles/kfb-pet-graft-driver.georg-2026-09-15.json   Georgs Upload, unverändert
      qa/casting-probe.html                Meßseite (HTTP, three r160, liest den WS0-Quellstand relativ)
      qa/casting-probe.json                Meßwerte (Bindung je Clip, Casting, Profile)
      qa/QA_EVIDENCE.md                    sha256 der 12 Bilder
      qa/*.jpg                             12 Standbilder

Probe öffnen: `qa/casting-probe.html` (Fixture) · `qa/casting-probe.html?contract=georg` (Georg-Profil). Sie schreibt nichts in localStorage.
