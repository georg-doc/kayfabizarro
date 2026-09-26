# Lessons learned · Schatten in three.js (KFB ToolBox, WSA, OMS-Slices)
*26.09.2026 · gilt für jede three.js-Bühne im KFB-Kosmos. Das Problem ist bekannt und taucht immer wieder auf, deshalb steht es hier als Rezept.*

## Symptome
- **Pixelig / treppig:** die Schattenkanten zeigen Stufen, am Gesicht sind die Stufen größer als Brauen und Lider.
- **Flackern / Schimmern:** der Schatten zittert beim Orbit, beim Idle und bei jeder kleinen Bewegung (Augen-Life, Ohren-Dangle).
- **Helle Artefakte an Schnittstellen:** an der Stelle, wo Auge, Lid, Nase oder Ohr in den Kopf stecken, erscheint eine helle Naht, oder es entstehen Streifen (Akne) auf der Haut.

## Ursachen (in dieser Reihenfolge prüfen)
1. **Das Frustum ist zu groß für die Map.** Ein festes ±10-Frustum mit einer 2048er-Map ergibt etwa 100 px pro Einheit. Ein KFB-Kopf ist rund 1 Einheit groß, Lider sind 0,05 groß. Das Ergebnis sind Stufen und Schimmern.
2. **Das Frustum wird ohne Einrasten nachgeführt.** Jedes Nachführen um Bruchteile eines Texels verschiebt das ganze Raster, und das sieht man als Flackern.
3. **Der Bias ist falsch.** Nur ein negativer `bias` ohne `normalBias` ergibt Akne auf gekrümmten Flächen. Ein zu großer `normalBias` oder `bias` lässt Licht an konkaven Ecken durch (*Peter-Panning*), und das ist die helle Naht an Schnittstellen.
4. **Dünne Overlays werfen Schatten.** Brauen-Bändchen (ShaderMaterial, DoubleSide), Mund-Decals, Wimpern, Pupillen und Clay-Lider dicht am Augapfel sind oft dünner als ein Texel. Sie gehören nicht in die Shadow-Map, sonst entstehen Akne und Nähte.
5. **DoubleSide-Material in der Shadow-Map.** Bei null Dicke gibt das Akne. Trotzdem nicht ausschließen, sonst verschwindet der ganze Körper (glTF doubleSided). `normalBias` behebt die Akne.

## Rezept (so in Production-02 umgesetzt, `_fitShadow`)
```js
// 1) Große Map, gedeckelt auf die GPU
const smax = Math.min(4096, renderer.capabilities.maxTextureSize);
sun.shadow.mapSize.set(smax, smax);
scene.add(sun.target);                      // das Ziel muss in der Szene hängen, sonst gilt matrixWorld nicht

// 2) Frustum auf den Darsteller zuschneiden, alle ~4 Frames
const sph = new THREE.Box3().setFromObject(actorRoot).getBoundingSphere(new THREE.Sphere());
const r = Math.ceil(Math.max(0.6, sph.radius * 1.12) * 8) / 8;   // Radius in 1/8-Schritten: kein Zoom-Schimmern
// 3) Mitte in Lichtkoordinaten auf das Texelraster einrasten
const texel = 2 * r / smax;   // right/up = Lichtbasis senkrecht zur Lichtrichtung
center = right * round(c·right / texel) * texel + up * round(c·up / texel) * texel + fwd * (c·fwd);
sun.position = center + lightDir * (r + 30); sun.target.position = center;
cam.left = -r; cam.right = r; cam.top = r; cam.bottom = -r; cam.near = 0.1; cam.far = 2 * r + 60;
// 4) Bias an die Texelgröße koppeln, nicht raten
sun.shadow.bias = -0.00015;
sun.shadow.normalBias = texel * 1.5;
// 5) Dünnes wirft nicht
// NICHT DoubleSide ausschließen: glTF-Körper sind doubleSided
mesh.castShadow = !(mesh.userData.petOverlay || mat.isShaderMaterial || (mat.transparent && mat.opacity < 0.98));
mesh.receiveShadow = !mat.isShaderMaterial;
```
- Warum der ganze Umriss (Sphäre) reicht: ein Bodenpunkt, auf den der Darsteller Schatten wirft, liegt im Lichtraum an derselben XY-Stelle wie der werfende Punkt. Also liegt er im Kreis mit Radius r.
- Eine Szene mit großer Kulisse (Resident Scene, Band): das Frustum auf die Vereinigung aller Wurzeln zuschneiden, mit einer Kappe (hier r ≤ 14). Im Gesichts- oder Rigging-Modus nur auf den Darsteller, damit die Gesichtsdetails die Auflösung bekommen.
- `PCFSoftShadowMap` bleibt. **VSM** meiden: sie lässt an Kontaktstellen Licht durch, und das ist genau das KFB-Problem.

## Prüfen, bevor man »fertig« sagt
1. Face-Cam, Orbit langsam einmal um den Kopf: es darf nichts schimmern.
2. Idle mit Augen-Life und Ohren-Dangle 10 s laufen lassen: das Schattenraster darf nicht wandern.
3. Nahaufnahme an Auge und Kopf, Nase und Kopf, Ohr und Kopf: keine helle Naht, keine Streifen.
4. Die Figur wandert (Sequenz-Vorschau): der Schatten bleibt dran, am Rand darf er nicht abreißen.

## Bekannte Stellen im Kosmos
- **Rückfall 26.09. abends (Georgs Screenshot: nur die Haare warfen Schatten):** die Regel »dünn = wirft nicht« hatte `side === DoubleSide` mit drin. glTF/KayKit-Körper sind fast immer `doubleSided`, deshalb warf der ganze Körper keinen Schatten mehr. **DoubleSide ist KEIN Ausschlussgrund.** Den Körper schützt `normalBias` vor Akne. Ausgeschlossen werden nur `petOverlay`, `ShaderMaterial` und echt transparente Materialien (`opacity < 0.98`).
- `KFB ToolBox Production-02.dc.html` · `_fitShadow()` + Overlay-Regel im Actor-Traverse (26.09., dieses Rezept).
- `kfb-lib/clay-lids.v1.js`: Clay-Lider mit `castShadow = false` und `receiveShadow = true`.
- Offen, dort gilt dasselbe Rezept: Studio v18 (`ground-plane.v2.js` + Sonne), Stage-First v1, WorldBuilder-Vorschau und alle OMS-Slices mit eigener Bühne.
