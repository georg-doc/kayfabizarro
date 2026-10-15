# Alien Figures ToolBox R1 · Lord Hunky und Lady Dory als fertige Figuren-GLBs

WS0, 15.10.2026. Für die KFB ToolBox (WSA-Site v8, PR #399, Head facbf3d2). Die beiden Aliens sollen im Figuren-Menü stehen wie FrizzleBob v5b. Georg stellt sie dort fein ein, riggt und animiert sie (Ausdrücke, Sprech-Animation, neue Münder).

Grundlage:
- Kopfteile aus `_alien_head_parts_r1`, unverändert übernommen (Netz, Gewichte, Stiel- und Antennenknochen, Anker, `defaultFit.spaceRanger`).
- Körper: KayKit Space Ranger auf Rig_Medium, mit den Farbakzenten aus `_frankenstein_poc` (Lord Hunky Teal-Blau, Lady Dory Orange-Rot, V-261).

## Dateien
| Datei | Was |
|---|---|
| `LordHunky_RigMedium.toolbox.glb` (4,0 MB) | Körper + Rig_Medium + Kopfteil in **einer** Haut (27 Gelenke). Kopf-Wurzel `LordHunky_Head` am Kopfknochen, darunter `head_part` → `eyestalk.r`, `eyestalk.l`. Anker `KFB_Eye_R/L_anchor`, `KFB_Mouth_anchor`, `KFB_Brow_R/L_anchor`. Morph-Ziel `neckTaper`. |
| `LadyDory_RigMedium.toolbox.glb` (4,5 MB) | Dasselbe mit 28 Gelenken: `head_part` → `eyestalk.c`, `antenna.r`, `antenna.l`. Anker `KFB_Eye_C_anchor`, `KFB_Mouth_anchor`, `KFB_Brow_C_anchor`. |
| `lordhunky-headpart-r1.ws0-2026-10-15.kfb-pets.json` | Rezept im ToolBox-Format `kfb.pets/1`. |
| `ladydory-headpart-r1.ws0-2026-10-15.kfb-pets.json` | Rezept für Lady Dory, gleiches Format. |
| `mouths/A`, `mouths/B` | Mundsätze MOUTHS_GPT_R2: Typ A für Lady Dory, Typ B für Lord Hunky, upperLift 0,35 eingebacken. **Die ToolBox hat sie noch nicht** (weder auf main noch in PR #399), darum liegen sie hier bei. |
| `bilder/` | 20 Prüfbilder, 1600×900, WS1-Bühnenlicht (Liste unten). |
| `_work/` | `build_figure.py` (GLB-Zusammenbau), `make_recipe.py` (Rezept), `proof.html` (Referenz-Lader und Prüfung), `shoot.mjs`/`shoot_all.sh` (Bilder), `measure_*.json` (Messwerte), `build_*.json` (Quellen mit sha256). |

**Nicht kopiert, weil die ToolBox sie schon hat** (sha256 geprüft):
- `pet-eye-rig.v6.js` (EyeRig v6): identisch mit `kfb-lib/pet-eye-rig.v6.js` der Site, sha256 3129bb7b…
- `ear-dangle.v1.js` (DangleChain): identisch mit `kfb-lib/ear-dangle.v1.js`, sha256 3d7626bb…

## Aufbau der GLB
```
Rig_Medium                      (Szenen-Wurzel)
  LordHunky_Head_mesh           SkinnedMesh, 4 Teilnetze (Kopf, Sockel R, Sockel L, Mund-Flicken), Morph neckTaper
  SpaceRanger_ArmLeft/ArmRight/Body/LegLeft/LegRight
  root → hips → spine → chest → head
                                  └ LordHunky_Head      Gelenk, trägt headOffset (Position) + headScale (Skala)
                                      └ head_part       Gelenk, starr (Kopfnetz hängt hier mit Gewicht 1 − w)
                                          ├ eyestalk.r → KFB_Eye_R_anchor, KFB_Brow_R_anchor
                                          ├ eyestalk.l → KFB_Eye_L_anchor, KFB_Brow_L_anchor
                                          └ KFB_Mouth_anchor
```
- Das Kopfnetz liegt im Bindungsraum des Modells. Es steht also auch ohne Skinning richtig (Blender, Viewer).
- `SpaceRanger_Head` ist **nicht** in der GLB.
- Der alte Halsring (`Hanky_Collar`) und die alten Kopf- und Stielknochen aus `_frankenstein_poc` sind ebenfalls nicht dabei.
- Der Körper ist byte-gleich der KayKit-`SpaceRanger.glb` (sha256 302f8aef…). Darauf wurden Kragen und `defaultFit` gemessen.
- Die Akzent-Textur ist byte-gleich der in den `_frankenstein_poc`-GLBs.
- Keine Clips in der GLB, wie bei FB v5b. Die ToolBox nimmt die KayKit-Clips für Rig_Medium.
- Die Clips enthalten Spuren für `head` (Drehung, Lage, Skala), aber keine für `LordHunky_Head`, `head_part` oder die Stiele. Deshalb liegen die Regler auf eigenen Gelenken: Kein Clip überschreibt sie.

## Formatabgleich mit FrizzleBob v5b
**Gleich wie bei FB v5b** (`FB_TEMPLATE_LOOK_v5b.glb`, Pin 23615cff):
- Eine Szenen-Wurzel, alle Netze direkte Kinder davon, **eine** Haut über **ein** Skelett.
- Rig_Medium mit identischen Knochennamen und Ruhelagen, `head` in der Welt bei (0, 1,2414, 0). Gleiche Größe auf der Bühne (`CLASS_K`).
- Zusatzknochen als Kinder von `head` in derselben Haut, wie `ear.l/r.1–3` bei FB.
- Gesichtsteile als Knoten unter dem Kopfknochen.
- Rezept `kfb.pets/1`, oben `schema`, `version`, `meta`, `eyeRig`, `face`, `mouth` (Vertrag v4 wörtlich, wie im FB-Export), darin `pets[1]`.
- In `pets[0]` dieselben Feldnamen wie bei FB, soweit sie passen: `id`, `name`, `kind: biped`, `module`, `variant`, `source`, `color`, `eye.*` (anchor, pupilStyle, pupilSize, gloss, lidFit, inset, converge, splay, socket, turn, turnFine, lashes, oval, sclera, pupil, life), `brow`, `nose`, `moustache`, `mouth`, `parts`, `original`, `body` (kfb.body-shape/0.1), `lids` (kfb.eyerig-lids/0.1), `clayLids` (`on: false` wie bei FB).
- Dateiname nach dem Muster der Site: `<id>.<wer>-<datum>.kfb-pets.json`.

**Anders als bei FB v5b:**
- Zwischen `head` und den Stielen liegen zwei Knoten: `<Name>_Head` (Regler) und `head_part` (starr).
  - FBs Ohren hängen direkt an `head`.
  - Das Kopfnetz ist an `head_part` gewichtet, nicht an `head`.
- Augen-Anker sind leere Knoten am Stielknochen (`KFB_Eye_*_anchor`). FB hat gemalte Augen-Netze `FB_Eye_L/R` und keine Anker.
- Der Mund ist ein Decal aus dem MOUTHS_GPT_R2-Satz (DecalGeometry). FB nutzt PetMouth aus pet-mouth.v1 mit FrizzelBob-Mouth_01.
- Texturen: Der Kopf hat WebP-Texturen (`EXT_texture_webp`, required), die three.js ohne Zusatz kann. FB hat keine Texturen. Dazu kommt das Attribut `_CLAYSEED` (Knet-Seed für clay-material v10).
- Ein Morph-Ziel `neckTaper` auf dem Kopfnetz. FB hat keine Morphs.
- Neue Blöcke im Rezept:
  - `eyes[]`: Auge je Anker mit Lage, Größe und Blick.
  - `eyeHost`: Proxy-Quader `body` für EyeRig und Lidfarbe.
  - `dangle`: DangleChain je Stiel bzw. Antenne.
  - `neckRing`: aus.
  - `headPart`: Regler, Kragen, Skala-Bereich.
- `module: "HeadPart"`, `variant: "headpart-r1"`, `eye.socket: "anchor"` (neu). FB hat `"FaceHost"`, `"earrig-v5"`, `"surface"`.
- `source.glb` ist der lokale Dateiname, `source.commit` ist `null`. Beides trägt WSA nach dem Hochladen ein.

**Wichtig:** Der FB-Weg der Site (`kind: 'earfb'` → `_mountFaceOn` → face-mount.v1/FaceHost) passt **nicht** 1:1.
- FaceHost misst die Kopfbox an Punkten mit `head` als stärkstem Knochen. Hier sind das null Punkte, weil der Kopf an `head_part` hängt. FaceHost meldet dann „keine Punkte am Kopfknochen“.
- FaceHosts symmetrische dx-Platzierung auf einem Ellipsoid passt ohnehin nicht zu Stielaugen.
- Deshalb braucht es eine eigene Figurenart (Vorschlag `kind: 'headpart'`). Sie liest die Augen aus `eyes[]`.

## Regler (Slider)
Alle stehen in `pets[0].headPart.tunables`, je mit `value`, `default`, `min`, `max`, `step`, `apply` und `label`.

| Regler | Wirkt auf | Lord Hunky | Lady Dory |
|---|---|---|---|
| `headScale` | `node(<Name>_Head).scale.setScalar(v)` | Vorgabe 0,73, Bereich 0,50–1,25 | Vorgabe 0,751, Bereich 0,45–1,40 |
| `headOffset` | `node(<Name>_Head).position.set(x, y, z)`, im Rahmen des Kopfknochens, m | Vorgabe (0, −0,1015, 0,0161) | Vorgabe (0, −0,1315, 0,0161) |
| `neckTaper` | Morph `neckTaper` an jedem Teilnetz des Kopfnetzes, 0 = aus | 0–1, Vorgabe 0 | 0–1, Vorgabe 0 |

`headOffset` hat bei beiden den Bereich x und z ±0,15, y −0,25 bis +0,10.

**`neckTaper` im Einzelnen:**
- Verjüngt die untersten 15 % der Kopfhöhe radial zur Halsachse.
- Am Halsschnitt ist der Radius-Faktor 1 − 0,4·v, er läuft weich (C1, ohne Kante) bis 0 am oberen Rand des Bands aus. Normalen sind im Morph mitgeführt.
- Band in L: Lord Hunky 0,129 m, Lady Dory 0,132 m.

**Automatischer Wert:**
- Formel: `neckTaper ≥ clamp((1 − maxScaleWithoutTaper / headScale) / 0,4, 0, 1)`.
- `maxScaleWithoutTaper` ist 0,738 (Lord Hunky) bzw. 1,181 (Lady Dory).
- Das ist dieselbe Kragenregel wie bei `defaultFit`: Die Halsschnitt-Schleife bleibt innerhalb der Außenkante des Kragens.
- Beispiel Lord Hunky bei Größe 1,0: neckTaper 0,655 (Bilder 10/11).

**Reihenfolge:**
- Die Regler jedes Bild nach `mixer.update(dt)` setzen.
- Ebenso nach jedem `Skeleton.pose()`. `pose()` setzt alle Knochen auf die Bindung zurück, auch `<Name>_Head` auf 0,73/0,751.

**Mund-Decal neu bauen**, wenn Größe, Lage oder Verjüngung sich ändern. DecalGeometry liest keine Morphs. Der Mund liegt aber über dem Verjüngungs-Band (L-Höhe 0,262 bzw. 0,248), darum ändert neckTaper ihn nicht.

## Rezept, wichtigste Werte
- **EyeRig v6 je Auge**, übernommen aus der Kopfteil-JSON, also Claude Designs Augen-Rig:
  - matte-cute, pupilSize 0,4, gloss 0,1, anchor dx/ring wie in Claude Design.
  - Lord Hunky lidFit 0, Lady Dory **lidFit 0,9**.
  - Nach dem Bau: Augen auf `eyes[i].pos/scale` setzen. Bei Lady Dory Auge 0 auf `gaze` drehen und Auge 1 ausblenden.
- **Mund:**
  - Lord Hunky: Typ B, Ruhe-Ausdruck `smirk`.
  - Lady Dory: Typ A, Ruhe-Ausdruck `smile_closed`.
  - Beide: upperLift 0,35 und `rest: "closed"` (V-243). Dazu `emoteMap` (neutral, happy, angry, sad, surprised, thinking, blink) und `visemeMap` für Talk.
- **Dangle:** eine DangleChain je Knochen, Werte je Art.

  | Art | stiffness | damping | maxDeg | inertia | bob / bobHz |
  |---|---|---|---|---|---|
  | Stiel (`stalk`) | 45 | 5,5 | 18 | 0,016 | 2,5 / 0,55 |
  | Antenne (`antenna`, nur Lady Dory) | 26 | 3,2 | 32 | 0,02 | 4 / 0,8 |

  Das Auge folgt seinem Stiel (`eyeFollow`).
- **Halsring:** `neckRing.enabled: false`.
- **Brauen:** nicht gebaut (V-297: später). Die Punkte stehen als `KFB_Brow_*_anchor` in der GLB und in `brow.points`.
- **Knet-Lider:** `clayLids.on: false`, Schalter für Georg in der ToolBox.

## Was WSA tun muss
1. **Hochladen** auf einen Asset-Branch: beide GLBs, beide Rezepte, `mouths/A` und `mouths/B`. Dann `source.glb` und `source.commit` im Rezept eintragen. Die Mund-PNGs auf einen Commit pinnen (A6).
2. **Ins Figuren-Menü:** zwei Einträge in `BASE_ROSTER`. Die Werte stehen auch im Rezept unter `meta.roster`.
   ```js
   { id: 'lordhunky-headpart-r1', kind: 'headpart', label: 'Lord Hunky · Space Ranger', section: 'Frankenstein', swatch: '#3095ad', rig: 'Rig_Medium' },
   { id: 'ladydory-headpart-r1',  kind: 'headpart', label: 'Lady Dory · Space Ranger',  section: 'Frankenstein', swatch: '#fb650e', rig: 'Rig_Medium' },
   ```
3. **`_actorRecord`:** einen Zweig für `kind === 'headpart'` mit `{ path: <GLB>, recipe: <Rezept>, commit }`.
4. **Laden** (`_buildActor`, neuer Zweig `headpart`):
   - Wie bei `earfb`: GLB laden, `container.scale = CLASS_K`, PoseRig, Stock-Clips Rig_Medium (General, MovementBasic, MovementAdvanced), Mixer, `defaultIdle: Idle_A`.
   - Dann das Gesicht aus dem Rezept statt `_mountFaceOn`:
     - EyeRig v6 auf `eyeHost` und `eyes[]`;
     - DangleChain je `dangle.parts[]`;
     - Mund-Decal aus `mouths/<Typ>/`;
     - Regler jedes Bild.
   - Die Referenz, die genau so läuft, ist `_work/proof.html`: `loadFigure`, `buildEyes`, `buildDangle`/`dangleStep`, `buildMouth`, `applyTunables`. Knotennamen immer über `THREE.PropertyBinding.sanitizeNodeName` suchen (`eyestalk.r` → `eyestalkr`).
5. **Regler im Rigging-Tab**, Abschnitt „Kopf“:
   - Kopf·Größe, Kopf·Lage x/y/z und Hals·Verjüngung, dazu ein Knopf „auto“ (Formel oben).
   - Speichern schreibt `headPart.tunables.*.value` zurück, im selben `kfb.pets/1`-Speicherweg wie bei FB.
6. **Emotes und Talk:**
   - Augen über `face.emotes` (Vertrag v4) mit `rig.applyEmote`.
   - Mund über `mouth.emoteMap` und `mouth.visemeMap`: Textur des Decals wechseln.
7. **`actor-bootstrap.v1.js`** ist nur für FB gebaut (fester `ACTOR_ID` und sha256). Sollen die Aliens beim Start aus `data/actors/` geladen werden, muss das Modul allgemein werden. Sonst gilt das Rezept einfach als Vorgabe, solange es keinen gespeicherten Stand gibt.

## Prüfung
Die Prüfung lief in three.js r180 (`_work/proof.html`, headless Chromium): EyeRig v6 auf den Ankern, DangleChain, Mund-Decal, Regler angewandt, Clips `Idle_A` und `Walking_A`.

**Kopf starr:**
- Gemessen an 628 (Lord Hunky) bzw. 554 (Lady Dory) Punkten mit vollem Gewicht auf `head_part`, im Rahmen des Kopfknochens.
- 25 Bilder je Clip. Größte Abweichung **0,000 mm** in beiden Clips und bei beiden Figuren.

**Kragen rundum zu:**
- Gemessen wurde die Überdeckung der Kragenöffnung: der Kopfradius minus dem Radius der Innenkante, in 24 Richtungen, je Bild im Rahmen des Kopfknochens.

| | Ruhe | Idle_A min | Walking_A min |
|---|---|---|---|
| Lord Hunky (0,73) | 45,4 mm | 42,6 mm | 40,2 mm |
| Lady Dory (0,751) | 51,6 mm | 39,2 mm | 38,1 mm |
| Lord Hunky bei 1,0 + neckTaper auto (0,655) | 67,0 mm | – | 59,6 mm |

**Angesehen** (alle Bilder in `bilder/`):
- Der Kragen ist vorn und hinten geschlossen, auch im schlechtesten Laufbild. Das graue Band hinten ist der weiße Wulst im Schatten, kein Loch.
- Der Mund sitzt über dem Kragen, die Augen sitzen auf den Stielen, die Stiele und Antennen wackeln.
- Lord Hunky bei Größe 1,0 ohne Verjüngung: Der Kopf sticht vorn durch die Brustplatte (Bild 09). Mit neckTaper auto steckt er im Kragen (Bilder 10/11).

**Bilder:**
- `00_Vergleich_FrizzleBob_LordHunky_LadyDory`.
- Je Figur:
  - `01–03` Idle_A vorn, Seite, ¾;
  - `04–06` Walking_A vorn, Seite, ¾;
  - `07`/`08` Kragen hinten und vorn im Laufbild mit der geringsten Überdeckung.
- Nur Lord Hunky: `09`–`11`, Größe 1,0 ohne und mit Verjüngung.

**NOT_RUN:**
- Laden in der ToolBox-Site selbst. Die Figurenart `headpart` gibt es dort noch nicht.
- Blender-Import.
- glTF-Validator. Geprüft sind nur die innere Stimmigkeit (Gelenk-Indizes, IBMs, Gewichtssummen, Bounds) und das Laden in three.js r180.

## Offene Punkte
1. Hohe Werte für neckTaper ergeben eine sichtbare Einschnürung mit dunklerer Unterseite. Der Auto-Wert reicht, mehr braucht es nicht.
2. Bei Lady Dory reicht das 15-%-Band in die Unterseite der Untertasse. Sie passt aber ohne Verjüngung bis Größe 1,18, also braucht sie den Regler selten.
3. Die feine Falte unter Lady Dorys Lippen und der Farbsprung am Halsring der Stiele sind unverändert offen, wie in den Kopfteilen.

## Neu bauen
```
python3 _work/build_figure.py hunky && python3 _work/build_figure.py dory
python3 _work/make_recipe.py hunky && python3 _work/make_recipe.py dory
# Prüfung: MeshyModels lokal ausliefern (python3 -m http.server 5249 --bind 127.0.0.1), dann _work/shoot_all.sh
```
Reines Python mit numpy, ohne Blender. Quellen mit sha256 stehen in `_work/build_*.json` und im Rezept unter `meta.sources`.
