# BRIEF — Graveyard Denizens (Skelett-Wander-Modul, KISS, wiederverwendbar)

**Stand:** 2026-08-02 · **Als Modul bauen**, damit es später in jede Zone eingehängt/weiterentwickelt werden kann (Gutter-Hop, Worldbuilder, Ruhezonen). Stack: **WebGL, three 0.160, ein Build, GLB via RAW/pages.dev.**

## 0 · Was es ist (und was NICHT)

Eine Handvoll KayKit-Skelette laufen **untot-zufällig und albern** in einer **begrenzten Zone** herum, **prallen cartoonig gegeneinander, bouncen und laufen weiter**. Kein Flocking/Boids (das teure Steering entfällt), keine KI — nur **Random-Wander + Kollisions-Bounce**. Player-Pet-Interaktion kommt **später**.

## 1 · Assets (liegen im Repo, CC0)

- **KayKit Skeletons** (Kay Lousberg, **CC0**): `media/3D_Assets/KayKit_Skeletons/` — `Skeleton_Mage/Minion/Rogue/Warrior.glb` + `skeleton_texture.png` + `License.txt`. Fetch über RAW/pages.dev.
- **Animationen:** `KayKit_Skeletons/anim/Rig_Medium_MovementBasic.glb` (Walk/Idle/Run) + `Rig_Medium_General.glb`. KayKit-Standard: **geteiltes Rig, separate Anim-Bibliothek** → Clips per `SkeletonUtils.retargetClip` (oder gleiches Rig = direkt) auf die Figuren legen. Für den MVP reicht **Walk + Idle** aus MovementBasic.
- **Szene:** Kenney-Graveyard-Pack (`GLB_graveyard`, schon im Katalog) als Boden/Grabsteine.

## 2 · Modul-Vertrag (so wird es einhängbar)

```js
import { createDenizens } from './graveyard-denizens.js';
const den = createDenizens(scene, THREE, {
  bounds: { x:[-8,8], z:[-8,8] },   // Zonengrenze (rechteckig)
  count: 12,                        // Handvoll — NICHT Horde (§4)
  seed: 1234,                       // reproduzierbar
  glbBase: RAW + 'media/3D_Assets/KayKit_Skeletons/'
});
den.update(dt);   // pro Frame
den.dispose();
```
Das Modul besitzt seine Skelette + deren Mixer, sonst nichts (keine Kamera, kein Licht — das gehört der Szene). So lässt es sich in Gutter-Hop, Worldbuilder oder eine Ruhezone gleich einhängen.

## 3 · Mechanik (Bedingungen, prüfbar)

- **Wander:** jedes Skelett hat eine Geschwindigkeit; Heading ändert sich **zufällig, langsam, wackelig** (untot-albern) — z. B. alle 1–3 s ein neues Zufalls-Ziel oder ein Heading-Jitter. Walk-Clip läuft dabei; gelegentliches Idle/Stolpern erhöht die Albernheit. Messung: kein Skelett verlässt `bounds` (an der Kante reflektieren).
- **Kollision (der Kern):** bei ~12 reicht **naiver Paarvergleich** (O(n²), ~144 Checks/Frame). Kreis/Kapsel-Überlappung → **beide um die HALBE Überlappung auseinanderschieben** (gedämpft!) + Geschwindigkeit umlenken. **Bedingung gegen Zappeln:** nie um die *ganze* Überlappung schieben, sonst vibrieren zwei steckende Skelette gegeneinander. Messung: zwei aufeinandertreffende Skelette lösen sich in < 0,5 s, kein Dauer-Vibrieren.
- **Cartoon-Bounce (die Würze):** beim Aufprall ein **Squash&Stretch-Puls** (aus der vorhandenen Cartoon-Motion/PetMotion-Idee) + kleiner Rückpral → aus „zwei Kapseln stoßen sich" wird ein albernes „boing". Messung: Impuls sichtbar (Skala-Ausschlag im Changelog), klingt in Ruhe ab.
- **Deformer = NUR PROPS.** Der Cartoon-Verbieger (`kfb-cartoon-deform.js`) läuft **auf den Grabsteinen/Requisiten** (wie im Card-Zone-Lab), **nie auf den Skeletten** — auf skinned Meshes wäre es Custom-Shader und auf kleinen Figuren kaum sichtbar. Leben der Figuren = ihre Clips + der Bounce-Puls.

## 4 · Grenze & Staffeln

- **Anzahl:** **Dutzend-ish** ist billig — geriggte (skinned) Figuren haben je einen `AnimationMixer`, das trägt bis ein paar Dutzend. **Horde (Hunderte) = eigener, teurer Job** (GPU-Instanced-Skinning oder **VAT**/Animation-in-Textur) → bewusst später, nicht im ersten Modul.
- **Später (Backlog):** Player-Pet-Interaktion (das Pet ist einfach **ein weiterer Collider**, auf den die Skelette reagieren — wegbouncen, kurz erschrecken, Mini-Beat) · Waffen anhängen (KayKit `assets/gltf`: Axe/Blade/Crossbow/Shield…) · Horde via VAT · weitere KayKit-Packs als andere Denizens.

## 5 · Technik / Regeln

- GLTFLoader + `AnimationMixer` je Figur; Clips aus der Rig_Medium-Bibliothek (retarget, falls Rig abweicht). **InstancedMesh geht NICHT für skinned** — je Figur eine Instanz mit eigenem Mixer (bei einem Dutzend problemlos).
- Kollision ist **kein Physik-Engine-Job** — Überlappung von Hand auflösen (ein paar Zeilen), gedämpft.
- **Stil-Kurier-Pass:** KayKit ↔ Kenney-Graveyard ↔ KFB-Look sind drei Sprachen. Entweder KayKit als eigenständiges „Friedhofs-Denizen"-Set akzeptieren oder leicht Richtung KFB tönen (Papier/Ton-Textur drüber). **Look entscheidet Georg.**
- WebGL 0.160, ein Build; Assets über RAW/pages.dev; nur Georg pusht.

## 6 · Abnahme

Ein Dutzend Skelette wandern untot-albern in einer begrenzten Zone · prallen cartoonig gegeneinander (Squash&Stretch-boing) und laufen weiter · **kein Vibrieren** steckender Paare · keiner verlässt die Zone · stabile FPS · Deformer nur auf Props. Player-Pet-Haken vorbereitet (Collider-Schnittstelle), aber nicht gebaut.
