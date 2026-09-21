# EMBED KFB RIGS v3 — jede KFB-Figur in eine fremde three.js-Seite setzen

**Version 3.0 · Stand 2026-09-14 · löst `EMBED_CUBE_PET_FULL_v2.2.md` ab, soweit es um die
KayKit-Figuren geht (Graft-Zweibeiner, CapsuleCarl). Für die 24 Cube-Pets gilt v2.2 weiter.**

Für: ein fremdes LLM oder eine fremde App, die eine KFB-Figur korrekt zeigen soll — mit dem
Gesicht aus dem Studio (Augen, Brauen, Nase, Mund), den KayKit-Bewegungen und der Waffe.

---

## 0. Die eine Regel, die alles andere ersetzt

**Es gibt genau zwei Leser. Wer eine KFB-Figur zeigt, ruft einen davon. Wer stattdessen eigene
Augen-Kugeln baut, eigene Insel-Zerlegung schreibt oder ein Mund-Decal nachprogrammiert, baut
eine zweite Wahrheit — und die sieht falsch aus** (siehe §7, der Flexikon-Fall).

| Figur | Leser | Eingabe |
|---|---|---|
| Graft-Zweibeiner (KayKit-Körper + FrizzleBob-Kopf, Waffe, Clips) | `frizzlegraft-v1/graft-mount.v1.js` → `mountGraft()` | ein `pets[]`-Eintrag aus `kfb.pets/1` mit `kind:'biped', module:'Graft'` |
| CapsuleCarl (Wissens-Pilli, statischer Körper, Gesicht montiert) | `lab-v6/carlrig-mount.v1.js` → `mountCarl()` | ein `pets[]`-Eintrag mit `kind:'capsule'` — oder `kfb.carl.rig/6`, übersetzt mit `lab-v6/carl-contract.v1.js` `toPets1()` |

Beide Leser liefern eine **fertige Figur** (Gruppe, Gesicht, Bericht) und eine `update(dt)`-Methode.
Sie bekommen `THREE` und einen `GLTFLoader` **hereingereicht** — sie importieren kein eigenes three.
Damit gibt es nie zwei three-Builds auf einer Seite.

---

## 1. Dateien — Ablage im Repo (Georg lädt hoch)

Das Bündel `kfb-rigs-embed-v3/` (30 Dateien, ~1 MB, alle Text) muss **mit seiner Ordnerstruktur**
in das Repo, z. B. unter `tools/KFB-ToolBox/kfb-rigs-embed-v3/`. Die Module importieren einander
relativ (`../lab-v4/carlrig.js`, `../petstudio-v9/studio-v12/…`); wer die Struktur ändert, bricht
die Importe. Manifest: `kfb-rigs-embed-v3.manifest.json` (transitiv aus den zwei Lesern gemessen).

```
frizzlegraft-v1/   graft-mount.v1.js (Leser) · graft-biped.v1.js · headgraft.v1.js · facehost.v1.js
                   matzones.v1.js · headzones.v1.js · donoreyes.v1.js · eyeoval.v1.js · wordmark.v1.js
                   actor-wobble.v1.js · ears.v2.js · fx.v1.js (Mündungs-/Treffer-Effekte, optional)
lab-v6/            carlrig-mount.v1.js (Leser) · carl-contract.v1.js (Übersetzer) · facegraft.v1.js
                   partrig.v1.js · texclean.js · zonenames.v4.js
lab-v4/carlrig.js · lab-v2/audit.js
petstudio-v9/      studio-v12/{frizzlebob.v4a, pet-eye-rig.v6, brow-rig.v2, pet-nose.v2, pet-moustache.v1, gun-look.v4a}.js
                   studio-v3/pet-mouth.v1.js · studio-v13/pose-rig.v1.js · kfb-ink-canon.js
                   assets/models/FrizzleBob_Yellow.gltf (Spender des Kopfes, eingebettete Puffer)
contracts/         kfb-pet-graft-driver.v4.json (kfb.pets/1, Eintrag »graft-driver«)
                   kfb-carl-rig-v6.json (kfb.carl.rig/6, Georgs Carl vom 13.09.)
```

**Module über jsDelivr, Daten über raw** (Regel aus v2.2, gilt weiter):
`BASE = https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/KFB-ToolBox/kfb-rigs-embed-v3/`
für `import(...)`; die Leser holen KayKit-Modelle und Texturen selbst per `raw.githubusercontent.com`.
`raw` liefert JS als `text/plain` — als Modul geladen ergibt das einen schwarzen Bildschirm.

---

## 2. Graft-Zweibeiner — der kürzeste richtige Weg

```html
<script type="importmap">
{ "imports": { "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
               "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/" } }
</script>
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const BASE = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/KFB-ToolBox/kfb-rigs-embed-v3/';
const { mountGraft, pickGraftPet } = await import(BASE + 'frizzlegraft-v1/graft-mount.v1.js');

// … renderer / scene / camera wie gewohnt; Licht: Hemisphere 1.05 + Directional 1.55 reicht …

const contract = await (await fetch(BASE + 'contracts/kfb-pet-graft-driver.v4.json')).json();
const pet = pickGraftPet(contract);                       // erster Graft-Eintrag (»graft-driver«)
const graft = await mountGraft({ THREE, loader: new GLTFLoader(), parent: scene, pet, lib: contract,
  camera, animation: 'own' });                            // 'own' = der Leser spielt Idle selbst
console.log(graft.report);                                // Haut-Dreiecke, Handton, Zonen, Waffe, Pose

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => { graft.update(clock.getDelta(), camera); renderer.render(scene, camera); });
</script>
```

Was du zurückbekommst (`graft`): `root` (Gruppe) · `figure` (die KayKit-Figur mit Skelett) · `rig`
(EyeRig v6) · `mouth` (PetMouth v1) · `brow`/`nose`/`moust` · `weapon` (`.muzzle` = FX-Anker) ·
`report` · `update(dt, cam)` · `dispose()`.

### 2a. Eigene KayKit-Clips fahren (`animation:'host'`)

Du besitzt dann den Mixer. Das Skelett ist `graft.figure`; die Clips kommen aus den KayKit-Packs
(`media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_<Pack>.glb`,
Packs: MovementBasic · MovementAdvanced · General · Simulation · Tools · CombatMelee · CombatRanged ·
Special). Reihenfolge je Bild: **erst `mixer.update`, dann `graft.update`** — der Leser rechnet das
Gesicht auf die fertige Pose.

```js
const mixer = new THREE.AnimationMixer(graft.root);
const pack = await new GLTFLoader().loadAsync(RAW + '…/Rig_Medium/Rig_Medium_MovementBasic.glb');
mixer.clipAction(pack.animations.find((c) => c.name === 'Walking_A')).play();
// je Bild: mixer.update(dt); graft.update(dt, camera);
```

**Pose gegen Clip (14.09. gemessen):** trägt der Eintrag `pose.on:true`, schreibt der Leser die Pose
NACH dem Clip in die Knochen — mit `preset:'stand'` würde das die Beine einfrieren (die Figur
rutscht). Darum gilt `poseOverClip:'auto'`: die Pose gewinnt nur für Sitz-Voreinstellungen
(Sessel, Fahrzeug). Wer immer die Pose will: `poseOverClip:true`; nie: `false`. Umschalten zur
Laufzeit: `graft.poseOverClip = false`.

### 2b. Welche Clips zu welcher Waffe (Namensregel, gemessen)

Klasse und Phase stehen im KayKit-Clipnamen: `Ranged_1H_*` (Pistole) · `Ranged_2H_*` (Gewehr,
geliehen für Bazooka/Armbrust) · `Ranged_Bow_*` (Bogen — sitzt im **linken** Slot) · `Melee_1H_*` ·
`Melee_2H_*` · `Melee_Dualwield_*`. Phasen: `_Aiming` · `_Aiming_Idle` · `_Reload` · `_Shoot`
(einzeln) · `_Shooting` (Dauerfeuer) · `_Draw` · `_Release` · `_Idle`. Tabelle im Leser:
`WEAPON_CLASSES`, Zuordnung `clipClass(name)`. Vertragsfeld: `graft.weapon.class`.

### 2c. Effekte an der Mündung (optional, `fx.v1.js`)

```js
const { makeFx, fireTimes } = await import(BASE + 'frizzlegraft-v1/fx.v1.js');
const fx = makeFx(THREE, scene);
const F = fireTimes(THREE, clip, 'r');       // gemessene Auslösezeiten (Spitzen der Handrotation)
// wenn action.time eine Zeit aus F.times überschreitet:
fx.fire(graft.weapon.muzzle, graft.report.weapon.fx /* muzzle|tip|edge */, graft.report.weapon.forearm);
// je Bild: fx.update(dt)
```

---

## 3. CapsuleCarl (Wissens-Pilli) — der kürzeste richtige Weg

```js
const BASE = '…/kfb-rigs-embed-v3/';
const { mountCarl } = await import(BASE + 'lab-v6/carlrig-mount.v1.js');
const { faceMods } = await import(BASE + 'frizzlegraft-v1/graft-mount.v1.js');   // dieselben Gesichtsmodule
const { toPets1 } = await import(BASE + 'lab-v6/carl-contract.v1.js');

const rig6 = await (await fetch(BASE + 'contracts/kfb-carl-rig-v6.json')).json();   // Georgs Carl
const pet = toPets1(rig6).pets[0];                                                  // → kfb.pets/1-Eintrag
const carl = await mountCarl({ THREE, loader: new GLTFLoader(), scene, mods: await faceMods(), pet });
// Größe: Carl ist 2 u hoch; auf Pet-Maß: carl.group.scale.setScalar(1.6 / 2)
// je Bild: carl.update(dt); renderer.render(…)
```

`carl.face.eyeRig` (EyeRig v6) · `carl.face.mouth` (PetMouth v1) · `carl.face.browRig`/`noseRig` ·
`carl.parts` (21 Inseln) · `carl.names` (gemessene Inselnamen). **Carl hat 0 Knochen** — KayKit-Clips
binden ihn nicht; Bewegung ist prozedural (Hüpfen, Atmen: Skala/Position der Gruppe).

Was der Eintrag entscheidet — und was passiert, wenn er fehlt:
- `brow.mod:'block'` → Carls **eigene** Brauen-Inseln; fehlt es, malt BrowRig Brauen (schwarze Striche).
- `nose.mod:'original'` → Carls eigene Nase; fehlt es, sitzt die gezeichnete Knubbelnase davor.
- `zones[]` mit `island` 1-basiert: 9, 10, 14, 15, 21 verborgen = Mundhöhlen-Teile und Originalpupillen.
  Fehlt die Liste, gilt der gemessene Startzustand der Werkbank.
- `mouth.set:'red'` (12 Formen, kein `smile` → Fallback `neutral`, Lächeln trägt der Mundwinkel).

---

## 4. Sprechen, Blick, Miene — dieselben drei Griffe für beide Figuren

| Wirkung | Graft | Carl |
|---|---|---|
| Sprechen an/aus (Visem-Shuffle, kein Lip-Sync) | `graft.mouth.talk(true)` | `carl.face.mouth.talk(true)` |
| Sprechen für 1,6 s | `.mouth.talkBurst(1.6)` | dito |
| Einzelnes Visem (`closed·open·wide·round·smile`) | `.mouth.setViseme('closed')` | dito |
| **Mund sauber zu:** Ruhe-Form = `closed` (Decal `m`) | `.mouth.setRestMap({ neutral: 'm' })` | dito |
| Pupillen folgen dem Zeiger | `graft.rig.setGazeFollow(true); graft.rig.pointTo(nx, ny)` (−1…1, y nach oben) | `carl.face.eyeRig.…` |
| Miene | `graft.rig.applyEmote(contract.face.emotes.happy)` + `graft.mouth.setRest('happy')` | dito |
| Blinzeln | `.rig.blinkNow()` · `.rig.setBlink({minGap, maxGap, dur})` | dito |

Die sechs Mienen (`neutral · happy · angry · sad · surprised · thinking`) stehen im Vertrag unter
`face.emotes` mit `lidUpper/lidLower/slant/pupil/gaze`. Nicht raten — aus dem Vertrag lesen.

---

## 5. Frame-Reihenfolge (Pflicht)

```
[dein Mixer.update]  →  graft.update(dt, cam) / carl.update(dt)  →  fx.update(dt)  →  render
```
Gesicht vor Mixer = das Gesicht hinkt ein Bild nach und der Mund schwebt.

---

## 6. Messen statt glauben — der Bericht

`graft.report` sagt, was gebaut wurde: `graft.skinTris/clothTris/rejected` (Haut-Färbung),
`handTone`, `zones`, `mat.status`, `weapon.status/class/hand/muzzleWorld`, `pose.on/preset`,
`notes[]` (jedes ausgefallene Modul steht hier — nichts fällt still weg). Wer eine Figur einbaut,
loggt den Bericht einmal und vergleicht ihn mit dem Lab (Data-Tafel): dieselben Zahlen = derselbe Bau.

**Unsichtbar ≠ kaputt:** in einem verborgenen Tab parkt `requestAnimationFrame`. Standbilder erst
nach einem selbst ausgelösten `render`.

---

## 7. Der Flexikon-Embed (Wissens-Pilli-Extension, 14.09.) — warum er falsch aussieht

Gelesen aus `ext/stage.mjs`. Vier Abweichungen von §0, jede für sich sichtbar:

1. **Eigenes Proxy-Gesicht statt EyeRig.** `PilliStage._build()` baut Kugel-Augen, Lider, Wimpern,
   Box-Brauen, Kugel-Nase selbst (`mat('#f2efe6')`, `SphereGeometry`). Das ist nicht das Studio-Gesicht;
   Lidform, Blick-Kinetik, Pupillenstil fehlen. → `mountCarl()` mit `faceMods()`.
2. **Eigene Insel-Zerlegung + Rollen-Heuristik** (`_splitIslands`, `_roleMap`, `STUDIO_ROLE`) statt
   `zonenames.v4` / `carlrig.js`. Die Kommentare sagen es selbst: »The Studio owns the split … not in
   this repo«. Jetzt ist es im Bündel.
3. **Rig-Datei:** `RIG_URL` zeigt auf `kfb-carl-rig-v6(1).json` (kfb.carl.rig/6) und liest daraus nur
   `zones`, `brow.mod`, `nose.mod` per Hand. → `toPets1()` + `mountCarl()`, ein Weg.
4. **Mund nicht sauber geschlossen:** `MouthDecal` ist eine Nachprogrammierung von `pet-mouth.v1`;
   Ruhe-Form `MOUTH_REST.neutral = 'neutral'` — im roten Satz ist `Neutral` eine leicht offene
   Lippenform. Geschlossen ist das Visem **`closed`** (Decal `m`). → `mouth.setRestMap({ neutral: 'm' })`
   oder Ruhe-Visem `closed`.

Die Tour-Runtime (`tour.mjs`) und das Overlay (`overlay.js`) sind davon unberührt — nur die Bühne
(`stage.mjs`) tauscht ihren Bau gegen `mountCarl()`. Three kommt dort schon lokal aus `vendor/`;
die Leser nehmen dieses `THREE` entgegen (§0), kein zweiter Build.

---

## 8. Was NICHT im Bündel ist

- Die KayKit-Modelle, -Clips und Mund-Texturen: kommen zur Laufzeit per raw aus dem Repo
  (`media/3D_Assets/…`). Netz nötig, kein Skript-Laden.
- Cube-Pets (`kfb-pets.js`, 24 Tiere): siehe v2.2.
- Achs-/FX-Logik je Waffenklasse für Axt und Bogen: offen (Briefing Waffenklassen).
