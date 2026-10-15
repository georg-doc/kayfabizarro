# Alien Head Parts R1 · Lord Hunky und Lady Dory als reine Kopfteile

WS0, 15.10.2026. Für das KFB-ToolBox-Frankenstein-Studio (WSA). Georg setzt dort Kopf, Mund, Augen und (optional) Halsring selbst: Lage, Größe, Drehung.

Grundlage: die von Georg abgenommenen Teile aus `_frankenstein_eyes_r1`, unverändert übernommen. Das sind die reparierten Köpfe von Claude Design mit den neuen Augenschalen, das Wackeln (Stiel- und Antennenknochen mit Claude Designs Biegegewichten) und die Mundsätze (Lord Hunky Typ B, Lady Dory Typ A).
Neu sind nur der eigene Bezugsrahmen je Kopf und ein Vorschlag, wie der Kopf im Kragen des Astronauten sitzt.

## Dateien
| Datei | Was |
|---|---|
| `LordHunky_Head.part.glb` (2,9 MB) | Nur der reparierte Kopf: 50.859 Dreiecke, 26.492 Punkte, Textur und Normalmap 2048² als WebP. Kleines Skelett `head_part` → `eyestalk.r`, `eyestalk.l`. Anker `KFB_Eye_R_anchor`, `KFB_Eye_L_anchor`, `KFB_Mouth_anchor`. Kein Körper, kein Halsring, keine Augen, keine Animation. |
| `LadyDory_Head.part.glb` (3,3 MB) | Dasselbe: 59.940 Dreiecke, 30.606 Punkte. Skelett `head_part` → `eyestalk.c`, `antenna.r`, `antenna.l`. Anker `KFB_Eye_C_anchor`, `KFB_Mouth_anchor`. |
| `*_Head.part.json` | Schema `kfb.headpart/1`. Enthält Augenanker, EyeRig-Optionen, Dangle-Teile, Mund, Halsschnitt, Halsring (AUS), Brauen-Punkte für später, Quellen mit sha256, `defaultFit.spaceRanger`. |
| `bilder/` | Vorschlag auf dem Astronauten, Ruhe-Haltung aus Idle_A. Je Figur: `_01_vorn`, `_02_seite`, `_03_Kragen_hinten`, `_04_Kragen_vorn`. Dazu `00_Vergleich_FrizzleBob_LordHunky_LadyDory.png`. Alle Bilder sind 1600×900. |
| `vendor/` | Kopien aus r1: `pet-eye-rig.v6.js` (EyeRig v6), `kfb-pet-graft-driver.v4.json` (Vertrag v4), `ear-dangle.v1.js` (DangleChain) und `mouths/A`, `mouths/B` (GPT-Münder R2). |
| `_work/` | Skripte und Messdaten. `proof.html` ist die Lade-Referenz, mit der die Bilder entstanden sind (siehe unten). |

## Bezugsrahmen
- **Kopfteil-Rahmen L:**
  - Ursprung ist die Mitte der Halsschnitt-Schleife, also dort, wo der Kopf in den Kragen geht.
  - +Y zeigt nach oben, +Z nach vorn (Blickrichtung), +X zur linken Seite der Figur.
  - Einheit Meter, im Maßstab S. S ist der Meshy-GLB-Raum, in dem Claude Design gemessen hat.
  - L = S − Halsmitte. Das ist nur eine Verschiebung, ohne Drehung und ohne Skalierung. Die r1-Montage war S × 1,388 (Lord Hunky) bzw. × 1,429 (Lady Dory).
- **Knoten im GLB:**
  - `<Name>_Head` ist die Wurzel, ein einfacher Knoten ohne Netz.
  - Darunter liegen `<Name>_HeadRig` (Skelett) und `<Name>_Head_mesh` (SkinnedMesh).
  - `head_part` ist das starre Gelenk im Ursprung, ohne Drehung. Die Stiel- und Antennenknochen sind Kinder von `head_part`.
  - Die Wurzel lässt sich an jeden beliebigen Kopfknochen hängen.
- **three.js-Namen:** GLTFLoader entfernt Punkte aus Knotennamen (`eyestalk.l` → `eyestalkl`, `antenna.r` → `antennar`). Darum immer `THREE.PropertyBinding.sanitizeNodeName(name)` benutzen.
- **Halsschnitt (`neckBase`):** waagrecht und offen.

  | | Mittlerer Radius | rx | rz |
  |---|---|---|---|
  | Lord Hunky | 0,242 | 0,238 | 0,247 |
  | Lady Dory | 0,152 | 0,153 | 0,147 |

  Alle Werte in L.
- **`defaultFit.spaceRanger`** gilt im Rahmen des Kopfknochens `head` von Rig_Medium. Dieser Knochen hat in Ruhe keine Drehung und liegt in der Welt bei (0, 1,24143, 0).

## Vorschlag für den KayKit-Astronauten (`defaultFit.spaceRanger`)

| | Lord Hunky | Lady Dory |
|---|---|---|
| `scale` (gleichmäßig) | **0,73** | **0,751** |
| `position` im Kopfknochen (m) | **(0, −0,1015, 0,0161)** | **(0, −0,1315, 0,0161)** |
| Drehung | keine | keine |
| Größe gegenüber r1 | 0,526 | 0,526 |
| Skala-Bereich bei dieser Lage: kein Spalt ab … / Halsschnitt noch im Kragen bis … | 0,56 … 0,738 | 0,50 … 1,18 |
| Öffnung rundum überdeckt, mindestens | 44,5 mm | 36,1 mm |
| Halsschnitt innerhalb der Kragen-Außenkante, mindestens | 10 mm | 74 mm |
| Mund (Kopfknochen) | (0, 0,090, 0,239), 13,2 cm über dem vorderen Kragenwulst | (0,026, 0,055, 0,289), 9,7 cm darüber |
| Mundbreite (Welt) | 0,160 m | 0,181 m |
| Kopf ohne Stiele, breit / Oberkante Welt | 0,47 m / 1,77 m | Untertasse 0,60 m / 1,77 m |
| zum Vergleich r1 | 0,89 m breit | 1,14 m breit |

FrizzleBob v5b auf demselben Rig hat einen Kopf von 1,006 m Breite und 0,941 m Höhe, die Oberkante liegt bei 2,157 m. Beide Aliens sind jetzt deutlich kleiner (Bild `00_Vergleich`).

**Regel, nach der die Zahlen entstehen** (`_work/fit.py`):
1. **Lord Hunky bestimmt den Faktor.** Sein Halsschnitt ist fast so breit wie der ganze Kopf (76 %). Gewählt ist die größte Skala, bei der die Halsschnitt-Schleife noch 8 mm innerhalb der Außenkante des weißen Kragens liegt.
2. **Lady Dory bekommt denselben Faktor gegenüber r1.** So bleibt das Größenverhältnis der beiden Figuren gleich.
3. **Lage:**
   - Mittig auf die Kragenöffnung (z = +0,0161).
   - Die Halsebene liegt mindestens 20 mm unter der tiefsten Innenkante des Kragens. Die tiefste Stelle ist vorn, der Kragen ist sattelförmig.
   - Die Halsebene sinkt so weit, bis die Kopfoberfläche die Öffnung rundum um mindestens 3 mm überdeckt. Das ergibt bei Lord Hunky 25 mm und bei Lady Dory 55 mm, weil ihr kurzer Hals stark ausläuft.
4. **Mund:**
   - Ein Drittel der sichtbaren Kopfhöhe über dem vorderen Kragenwulst.
   - Die sichtbare Kopfhöhe reicht bis zum Scheitel, bei Lady Dory bis zum Fußpunkt des Augenstiels.
   - Lord Hunky: Der Mund sitzt jetzt 17 cm (L) höher als Claude Designs alter Mund-Flicken.
   - Lady Dory: Ihr Lippen-Flicken liegt schon in diesem Drittel, darum bleibt der Mund dort. Er deckt auch die feine Falte darunter.

**Kragen des Anzugs, gemessen** (`defaultFit.spaceRanger.collar`, Kopfknochen-Rahmen). Gemessen wurde am Netz `SpaceRanger_Body`. Die Texturfarbe trennt den weißen Kragen, den grauen Kragen-Innenraum und den orangen Anzug.

| Kante | Radius | Höhe vorn | Höhe Seite | Höhe hinten |
|---|---|---|---|---|
| Innenkante (engste Öffnung) | rx 0,117, rz 0,141 | −0,077 | +0,004 | −0,037 |
| Wulst oben | 0,147–0,182 | −0,042 | +0,044 | −0,003 |
| Außenkante | 0,189–0,212 | −0,123 | +0,008 | – |

Der eigene Kopf des Astronauten (`SpaceRanger_Head`) wird ausgeblendet.

## So lädt ein Studio ein Kopfteil (three.js r180)
Die Referenz, die genau so läuft, ist `_work/proof.html`. Sie lädt den Astronauten, hängt das Kopfteil an, baut EyeRig, Dangle und Mund. Sie braucht einen lokalen Server, zum Beispiel `python3 -m http.server 5243 --bind 127.0.0.1` im Ordner `_alien_head_parts_r1`. Dann `http://127.0.0.1:5243/_work/proof.html?fig=hunky&view=vorn` öffnen (`fig` = hunky, dory oder all).

```js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import * as ER from './vendor/pet-eye-rig.v6.js';     // EyeRig v6, nie nachbauen
import * as ED from './vendor/ear-dangle.v1.js';      // DangleChain (FrizzleBob-Ohren)
const SAN = THREE.PropertyBinding.sanitizeNodeName;

// 1) Kopfteil laden
const [gltf, part] = await Promise.all([new GLTFLoader().loadAsync('LordHunky_Head.part.glb'),
                                        fetch('LordHunky_Head.part.json').then(r => r.json())]);
const root = gltf.scene.getObjectByName(part.nodes.root);
const bones = {}, meshes = [];
root.traverse(o => { if (o.isBone) bones[o.name] = o; if (o.isMesh) meshes.push(o); });

// 2) an den Kopfknochen des Körpers hängen + defaultFit
const fit = part.defaultFit.spaceRanger;
for (const n of fit.hideBodyNodes) body.getObjectByName(n).visible = false;   // SpaceRanger_Head aus
const headBone = body.getObjectByName(SAN(fit.attachBone));
headBone.add(root);
root.position.set(...fit.position); root.quaternion.set(...fit.quaternion); root.scale.setScalar(fit.scale);
body.updateMatrixWorld(true);

// 3) EyeRig auf den Ankern (Wirt = Gruppe direkt unter der Wurzel, also Rahmen L)
const er = part.eyeRig, o = er.options, bx = er.host.proxy.box;
const host = new THREE.Group(); root.add(host);
const pg = new THREE.BoxGeometry(bx[1][0]-bx[0][0], bx[1][1]-bx[0][1], bx[1][2]-bx[0][2]);
pg.translate((bx[0][0]+bx[1][0])/2, (bx[0][1]+bx[1][1])/2, (bx[0][2]+bx[1][2])/2);
const proxy = new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ visible: false })); proxy.name = er.host.proxy.name; host.add(proxy);
host.updateMatrixWorld(true);
const rig = new ER.EyeRig({ THREE, inner: host, o: { makeMat: () => new THREE.MeshStandardMaterial({ color: er.host.lidColour, roughness: 0.85 }) } },
  { anchor: { ...o.anchor }, pupilStyle: o.pupilStyle, pupilSize: o.pupilSize, inset: o.inset, lidFit: o.lidFit,   // Lady Dory: lidFit 0.9
    gloss: o.gloss, converge: o.converge, baseColor: parseInt(o.baseColor.slice(1), 16), blink: { ...o.blink }, lashes: { ...o.lashes } });
const byKey = Object.fromEntries(part.eyes.map(e => [e.cdKey, e])), one = part.eyes.length === 1;
const place = () => { ['eyeL', 'eyeR'].forEach((k, i) => { const q = byKey[k] || part.eyes[0], e = rig.eyes[i];
    e.position.set(...q.pos); e.scale.setScalar(q.scale); e.rotation.y = 0; });
  if (one) { rig.eyes[0].quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...part.eyes[0].gaze)); rig.eyes[1].visible = false; } };
const build0 = rig.build.bind(rig); rig.build = (...a) => { const r = build0(...a); place(); return r; };
rig.build(); rig.applyEmote(er.afterBuild.emote); rig.setLife(er.afterBuild.life);
const eyeQ0 = rig.eyes.map(e => e.quaternion.clone());

// 4) DangleChain je Stiel/Antenne, Federwerte je Teil aus dem JSON
const chains = part.dangle.parts.map(p => { const b = bones[SAN(p.bone)];
  return { p, b, q0: b.quaternion.clone(), dc: new ED.DangleChain([b], { side: /\.r$/.test(p.bone) ? 'R' : 'L',
    params: { stiffness: p.stiffness, damping: p.damping, maxDeg: p.maxDeg, inertia: p.inertia, spin: p.spin, elastic: p.elastic, bob: p.bob, bobHz: p.bobHz } }) }; });
function dangleStep(dt) {           // je Bild nach mixer.update(dt)
  for (const c of chains) { c.dc.update(dt, {});
    if (c.p.eyeIndex == null) continue;                   // Antennen tragen kein Auge
    const i = one ? 0 : c.p.eyeIndex, q = c.b.quaternion.clone().multiply(c.q0.clone().invert());
    const E = part.eyes.find(x => x.bone === c.p.bone).pos, piv = new THREE.Vector3(...c.p.pivot);
    rig.eyes[i].position.set(...E).sub(piv).applyQuaternion(q).add(piv);
    rig.eyes[i].quaternion.copy(q).multiply(eyeQ0[i]); } }

// 5) Mund als Decal aus dem Mundsatz (in Ruhepose projizieren, dann am starren Gelenk festmachen)
const ms = part.mouth, an = await fetch(ms.path + 'anchors.json').then(r => r.json());
const tex = await new THREE.TextureLoader().loadAsync(ms.path + ms.default + '.png'); tex.colorSpace = THREE.SRGBColorSpace;
const ws = root.getWorldScale(new THREE.Vector3()).x, size = ms.width * ws * an.canvas[0] / an.closed_width_px;
const n = new THREE.Vector3(...ms.normal).transformDirection(root.matrixWorld), up = new THREE.Vector3(...ms.up).transformDirection(root.matrixWorld);
const x = new THREE.Vector3().crossVectors(up, n).normalize(), y = new THREE.Vector3().crossVectors(n, x);
const rot = new THREE.Euler().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, n));
const ctr = new THREE.Vector3(...ms.centre).applyMatrix4(root.matrixWorld).addScaledVector(y, -(an.canvas[1] / 2 - an.anchor.y) / an.canvas[1] * size);
const mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, roughness: 0.75, alphaTest: 0.02 });
const hp = bones[SAN(part.nodes.rigidJoint)], grp = new THREE.Group(); grp.matrixAutoUpdate = false; grp.matrix.copy(hp.matrixWorld.clone().invert()); hp.add(grp);
for (const m of meshes) { const g = new DecalGeometry(m, ctr, rot, new THREE.Vector3(size, size, 0.3 * ws)); if (g.attributes.position.count) grp.add(new THREE.Mesh(g, mat)); }
// Ausdruck wechseln: mat.map = Textur von ms.emoteMap[name]; Augen: rig.applyEmote(contract.face.emotes[name])
```

Hinweise für das Studio:
- **Reihenfolge:**
  - Den Decal erst projizieren, wenn die Wurzel ihre endgültige Lage und Größe hat. Ändert Georg Lage, Größe oder Mundpunkt, den Decal neu bauen.
  - Den EyeRig muss man nicht neu bauen, er hängt unter der Wurzel.
- **Mund verschieben:** `mouth.centre` und `mouth.normal` liegen in L. Ein neuer Mundpunkt sollte auf der Kopfoberfläche liegen, zum Beispiel per Raycast entlang −normal. Der Decal projiziert ±0,15 · Weltmaßstab tief.
- **Halsring:** `neckRing` hat `enabled: false`. Nur einschalten, wenn ein Körper keinen eigenen Kragen hat. Dann einen Torus in L bei y = 0 mit `radius` bzw. `ellipse`, `tube` und `colour` setzen, als Kind der Wurzel.
- **Brauen später:** `eyebrowsLater.points[]` hat je Auge einen Vorschlagspunkt in L als Kind des Stielknochens. Die genaue Lage liefert zur Laufzeit EyeRig v6 `eyeFrame()`.
- **Laden:** Die GLB braucht `EXT_texture_webp`, das three.js von sich aus kann. Draco oder Meshopt gibt es nicht, also braucht es keinen Decoder. Ein Attribut `_CLAYSEED` trägt den Knet-Seed 7 für clay-material v10.
- **Clips:** Die Clips (Rig_Medium) bewegen nur den Körper. Die Kopfteil-Knochen bewegt allein DangleChain.

## Was gemessen ist und was angenommen
**Gemessen:**
- Halsschnitt-Schleife: Mitte, Radien, plan auf 0,0 mm.
- Kragen des Anzugs je Richtung: Innenkante, Wulst, Außenkante.
- Überdeckung der Öffnung und Abstand des Halsschnitts zur Außenkante bei jeder Skala. Die Bereiche stehen in `scaleRange`.
- FrizzleBob-Kopf.
- Mundpunkt auf der Oberfläche mit Normale.

**Geprüft in three.js** (`_work/skin_test.mjs`):
- Das Skelett lädt.
- Dreht man einen Stiel- oder Antennenknochen um 11,5°, bleibt der starre Kopf auf 0,000 mm stehen. Die Stielpunkte bewegen sich, bei Lord Hunky bis 22 bzw. 24 mm, bei Lady Dory 27 mm (Stiel) und 65 mm (Antennen), jeweils in L.
- EyeRig baut 2 Augen (bei Lady Dory ist eines ausgeblendet).
- Der Mund-Decal wird erzeugt.

**Angesehen:** alle Bilder in `bilder/`.
- Der Kragen ist rundum geschlossen. Hinten liegt der Kopf auf dem weißen Wulst, der dort im Schatten grau wirkt. Er ist kein Loch, die Öffnung ist rechnerisch um mindestens 36 mm überdeckt.
- Der Mund liegt klar über dem Kragen.

**Angenommen:**
- Die Regel für die Skala: der Faktor durch Lord Hunkys Halsschnitt begrenzt, Lady Dory mit demselben Faktor.
- Mund im unteren Drittel.
- Die Brauen-Punkte.
- Die Halsring-Werte, übernommen aus r1.

## Offene Punkte
1. **Lord Hunkys Größe ist durch den Kragen begrenzt.**
   - Sein Halsschnitt ist 0,48 m breit (S). Der Kragen des Anzugs ist außen nur 0,38–0,42 m weit.
   - Darum passt der Halsschnitt nur bis Skala 0,738 in den Kragen. Damit ist sein Schädel etwa halb so breit wie FrizzleBobs Kopf.
   - Soll er größer werden und trotzdem im Kragen stecken, braucht der Kopf einen schmaleren Hals. Das wäre eine Netz-Änderung (Hals-Verjüngung), die hier nicht gemacht ist.
   - Darüber hinaus skaliert, sitzt der Kopf auf dem Kragen statt darin.
2. **Lady Dory liegt hinten und seitlich über dem Wulst.**
   - Ihre Untertasse beginnt direkt über dem kurzen Hals und deckt den Wulst an den Seiten und hinten zu. Vorn bleibt er sichtbar.
   - Kleiner als 0,50 öffnet sich ein Spalt. Größer bis 1,18 bleibt der Halsschnitt im Kragen.
3. **Nur Ruhe-Haltung geprüft.** Das Laufen mit dem Kopfteil ist NOT_TESTED. Die Knochenkette ist dieselbe wie in r1, dort gemessen 0 mm Verzug.
4. **Feine Falte:** Der Farbsprung am Halsring der Stiele und die feine Falte unter Lady Dorys Lippen sind unverändert offen, wie in r1.
5. **FrizzleBob-Quelle:** `FB_TEMPLATE_LOOK_v5b.glb` ist lokal (KFB-Pin 93abbf22) und nicht auf main. Der sha256 steht im JSON.

## Quellen (Kurzform, vollständig in `sources` je JSON)
- **Kopfnetz, Gewichte, Normalen, Stielknochen:** 1:1 aus `_frankenstein_eyes_r1/_work/<fig>_frankeneyes.blend`. Die Datei wurde nur gelesen und nicht gespeichert. Sie ist dieselbe Montage wie die r1-GLB. Die sha256 von Blend, r1-GLB und Mount-JSON stehen im JSON.
- **Meshy-Quellen:**
  - `Strict Clay Alien Space Ranger 3D.glb` (d7bd583c…)
  - `Meshy_AI_female_clay_alien_ran_1014181632_image-to-3d-texture.glb` (a33cc97d…)
- **Module:**
  - EyeRig v6 und Vertrag v4: letzte Änderung f6e1a57, origin/main dccf75c.
  - `ear-dangle.v1.js`: 1c888c4.
- **Körper:** `SpaceRanger.glb` aus `kayfabizarro-publish` origin/main, nur per `git show` gelesen (Blob bdc8efb8…).
- **Blender:** 5.2.2, nur headless, mit Speicher-Wächter (`_work/bl.sh`: höchstens 12 GB RSS und 40 min, Abbruch unter 40 GB freiem Speicher).
