# Aktor-Adapter — was wirklich bindet

Gemessen am 18.09.2026 im Preview, nicht aus Namen geschlossen. Ein Adapter liefert
Präsentation zu einem Zustand, den er nicht besitzt.

## 1 · Platformer Default Character — Referenz-Kontrolle

`media/3D_Assets/Platformer Game Kit - Dec 2021/Character/glTF/Character.gltf` @ `eb48f50`

18 eingebettete Clips gemessen: Death, Duck, HitReact, Idle, Idle_Gun, Idle_Shoot, Jump,
Jump_Idle, Jump_Land, No, Punch, Run, Run_Gun, Run_Shoot, Walk, Walk_Gun, Wave, Yes.
Rest-Höhe 2,057 → Faktor 1,021.

| Zustand | Clip | Bindung |
|---|---|---|
| IDLE | Idle | 100 % |
| WALK | Walk | 100 % |
| RUN | Run | 100 % |
| DUCK | Duck | 100 % |
| JUMP_START | Jump | 100 % |
| AIRBORNE | Jump_Idle | 100 % |
| LAND | Jump_Land | 100 % |
| HIT | HitReact | 100 % |
| EMOTE | Wave | 100 % |

Alle neun semantischen Zustände haben hier einen echten Clip. Deshalb ist dieser Aktor die
Kontrolle: fällt jeder externe KFB-Aktor aus, bleibt das Spiel vollständig spielbar.

## 2 · KayKit / Resident-Biped — geteilte Bibliothek

Gemessen am **Skeleton Warrior**
(`media/3D_Assets/KayKit_Skeletons/characters/gltf/Skeleton_Warrior.glb` @ `main`):
23 Bones, Rest-Höhe 2,702 → Faktor 0,777, **39 Clips** aus drei Sets, mittlere Bindung 100 %.

Geladene Sets (Vorgabe): MovementBasic (11), MovementAdvanced (13), General (15) aus
`KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/` @ `aa16a77`.

| Zustand | gewählter Clip | Anmerkung |
|---|---|---|
| IDLE | Idle_A | |
| WALK | Walking_A | **keine Geschwindigkeitsleiter behauptet** |
| RUN | Running_A | s. o. |
| DUCK | Crouching | aus MovementAdvanced |
| JUMP_START | Jump_Start | |
| AIRBORNE | Jump_Idle | |
| LAND | Jump_Land | |
| HIT | Hit_A | |
| EMOTE | Interact | **kein Waving in den drei Sets** — nächstliegende echte Geste |

`Jump_Full_Short` / `Jump_Full_Long` liegen in MovementBasic vor, werden aber **nicht**
benutzt: sie sind Ganzsprung-Clips mit eigener Dauer, und ob sie zu unserer Sprungphysik
passen, ist ein offenes Experiment (Briefing §7), kein Ergebnis. Sie stehen im manuellen
Clip-Dropdown zum Ausprobieren.

Ebenso ausdrücklich NICHT behauptet: dass Walking_A → Walking_B → Running_A → Running_B eine
Geschwindigkeitsleiter ist. Der Adapter nimmt den ersten vorhandenen Kandidaten und skaliert
die Abspielgeschwindigkeit stattdessen stufenlos mit der gemessenen Horizontalgeschwindigkeit.

**Rig_Large** (Black Knight, Demon Lord) lädt dieselbe Struktur unter `Rig_Large/` und wird
1,12× höher skaliert. **Rig_Legacy** lädt die 30 Clips aus der einen Legacy-Datei; die
Legacy-FIGUREN sind aber unrigged (0 Bones, vier Teilgruppen) — der Adapter meldet das im Lab
als Notiz, statt eine stehende Figur als Erfolg zu verkaufen. Der Legacy-Zusammenbau aus dem
Resident Atlas ist in diesem POC **nicht** enthalten.

## 3 · FrizzleBob · Graft

Leser: `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js` → `mountGraft()`
Vertrag: `contracts/kfb-pet-graft-driver.v4.json` · Module über **jsDelivr**, Daten über raw
(Regel aus EMBED_KFB_RIGS_v3 §1).

`animation:'host'` — der Platformer besitzt den einen Mixer und fährt dieselben
Rig_Medium-Clips wie ein Resident. Gemessen: Rest-Höhe 2,420 → Faktor 0,868, 39 Clips,
mittlere Bindung 100 %. Bildreihenfolge eingehalten (§5 des Embed-Dokuments):
`mixer.update(dt)` → `graft.update(dt, camera)` → render.

Gesicht, EyeRig, Mund und Waffe kommen vollständig vom Leser. Dieses Paket baut **keine**
eigenen Augen, kein Mund-Decal, keine Insel-Zerlegung.

## 4 · CapsuleCarl · prozedural

Leser: `lab-v6/carlrig-mount.v1.js` → `mountCarl()`, Gesichtsmodule aus `faceMods()`,
Vertrag `contracts/kfb-carl-rig-v6.json` über `toPets1()`.
Gemessen: Rest-Höhe 2,087 → Faktor 1,006. **0 Knochen** — es wird kein einziger KayKit-Clip
gebunden.

Stattdessen rechnet der Adapter das Acting, gedämpft gegen Zielwerte, in denselben
semantischen Zuständen:

| Zustand | Präsentation |
|---|---|
| IDLE | Atmen (Skala ±2,5 %) |
| WALK / RUN | Hüpfen (6 bzw. 9,5 Hz), Squash gegenphasig, Vorlage mit der Geschwindigkeit |
| DUCK | 42 % Squash |
| JUMP_START | 30 % Squash — Anticipation |
| AIRBORNE | Stretch −16 %, Neigung aus der Vertikalgeschwindigkeit |
| LAND | 34 % Impact, läuft in die Recovery aus |
| HIT | Squash + Kippen |

Carl teilt die Physik mit allen anderen; er schreibt keine zweite Position. Das manuelle
Clip-Dropdown bleibt bei ihm leer — es gibt keine Clips, und das Lab sagt das auch so.

## Aktorwechsel

`mountActor()` ist der einzige Eingang. Beim Wechsel wird zuerst der neue Aktor gebaut, dann
der alte entsorgt (`mixer.uncacheRoot`, Geometrie, Leser-`dispose()`), damit kein zweiter
Mixer, kein zweites Gesicht und kein zweiter Update-Pfad entsteht. Geteilte Texturen bleiben
im Cache — sie gehören dem Loader, nicht der Instanz.
