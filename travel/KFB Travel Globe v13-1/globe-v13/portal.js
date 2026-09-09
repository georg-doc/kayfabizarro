// ============================================================================
// portal.js — KFB Travel Globe v6 · Slice E · das Portal
// ----------------------------------------------------------------------------
// Quelle: dannylimanseta/tinyskies@2659a5cc987d ·
//   `client/src/game/CarpetPortalSystem.ts`  → Geometrie, Shader, Aufklapp-Animation,
//                                              Trefferfläche, Segment-Ebenen-Test, Abkühlung
//   `client/src/game/CosmicWorldPortal.ts`   → Platzierung auf der Welt (Sektor, Land, Höhe als
//                                              Grund + Schwebehöhe + 0,22, Mindestabstand),
//                                              Aufrichtung zur Kamera bei radialem „Oben";
//                                              der Halo ist mitkopiert, aber AUS (Naht 5)
//
// ⚠ **„Freiraum über Grund" hieß hier einmal etwas anderes und ist bewusst nicht mehr so
// benannt:** die untere Ringkante steckt 0,022 im Gelände, genau wie in der Quelle. Der Zuschlag,
// der sie freistellen sollte, ist der bezahlte Fehlanlauf weiter unten.
//
// **Beide Dateien sind die Quelle, und das ist kein Kompromiss, sondern die Bauform des
// Originals:** dort ist das eine ein VOM SPIELER gesetztes Portalpaar (Mechanik) und das andere
// ein FESTES Weltportal (Platzierung). Unser Portal ist ein Weltportal mit der Mechanik des
// Paars — also die Platzierung aus der einen, die Trefferlogik aus der anderen Datei, jeweils
// Zeile für Zeile. Was NICHT von dort kommt, steht unten unter „Nähte" und hat eine Zahl im Panel.
//
// ── Georgs Entscheidungen (E-31 … E-33, 30.8.) ──────────────────────────────────────────────
//  E-31 **Anzahl ist ein PARAMETER**, nicht eine Konstante. Deshalb `naechstes()` statt „das
//       Portal": wer den kürzesten Weg will, rechnet ihn je Bild.
//  E-32 **Durchflug = Sprung auf DERSELBEN Kugel**, weit entfernte Seite, mit VFX und Audio.
//       Kein Weltwechsel, keine Zustandsübergabe, kein Ladeschirm. „Weit entfernt" ist bei uns
//       ≥ 2,0 rad ≈ 115° (die Quelle hält 1,2 rad Mindestabstand zwischen zwei Portalen — das ist
//       ihre Zahl für „nicht dieselbe Ecke", nicht für „andere Seite der Welt").
//  E-33 **Oval wie tinyskies**: Torus + Shader, richtet sich je Bild zur Kamera und bleibt
//       senkrecht zur Oberfläche.
//
// ── Nähte (bewusste Abweichungen, jede mit einer Zahl in `tor()`) ───────────────────────────
//  1 **Das Ziel ist ein ORT, kein zweites Portal.** Die Quelle springt zwischen zwei Endpunkten
//    und kennt deshalb die Zielhöhe. Wir springen auf eine leere Landstelle — also muss die
//    Ankunftshöhe erfunden werden. Erfunden wird das MINDESTE: Boden + Schwebehöhe, plus die
//    Höhe über Grund, die der Spieler beim Eintritt hatte (geklemmt). Wer hoch einfliegt, kommt
//    hoch heraus. `tor()` nennt die gemessene Ankunftshöhe.
//  2 **Der Kurs bleibt die Zahl, die er war.** Die Quelle bildet die Einflugrichtung auf die
//    Basis des Ziel-Portals ab (`mapHeading`); ohne Ziel-Portal gibt es keine Basis, auf die man
//    abbilden könnte. Ein Kurs von 210° bleibt 210° — die Welt wechselt, nicht die Absicht.
//  3 **Trefferfläche skaliert MIT dem Portal.** Die Quelle nennt 0,22 gegen sichtbare 0,15, also
//    **1,47×** („forgiving teleports"). Weil unser Weltportal wie in `CosmicWorldPortal` 1,3× groß
//    ist, wandert die absolute Zahl mit — das VERHÄLTNIS ist die Zusage, nicht der Zentimeter.
//  4 **Der Trefferest kennt die Kamera nicht.** Zwei Quellenregeln widersprechen sich hier
//    (feste Torebene ⇄ kamerazugewandtes Portal); die Auflösung samt Messung steht bei
//    `schnitt()`. Kurzfassung: die Ebene steht senkrecht auf dem FLUGSEGMENT.
//  5 **Das Bild ist das WELTPORTAL der Quelle, nicht das Spieler-Portal** — Halo, Riss
//    (`rift.png`, jetzt kopiert nach `globe-v7/rift.png`) und achtzig funkelnde Sterne aus
//    `CosmicWorldPortalVisual`. Vorgeschichte, die in der Datei bleibt: erste Fassung baute den
//    Torusring samt Wirbel-Shader aus `CarpetPortalSystem` — das Bild des vom SPIELER GESETZTEN
//    Portals — weil ich `rift.png` als „die einzige Datei der Quelle, die wir nicht haben"
//    notiert hatte. Georg, 30.8.: *„die portale sehen extrem anders aus als in tinyskies…?"*
//    Die Datei lag in `client/public/2D/`, 581×680, 70 % transparent.
//    **„Haben wir nicht" ist ein Messwert, kein Gefühl** — und ein Ersatz mit ordentlicher
//    Buchführung („Naht 5, Halo aus") ist trotzdem ein Ersatz für etwas, das vorhanden war.
//    Der Ring bleibt als zuschaltbarer Rahmen (`params.ring`, aus). Einzige Abweichung im Bild:
//    die achtzig Funken kommen aus einem Seed-Strom statt aus `Math.random()` — Hausregel S3a,
//    sonst sieht dieselbe Welt bei jedem Laden anders aus.
//
// ⚠ **Zwei Anläufe, die die Datei behalten soll** (30.8.):
//  (a) Die Portalhöhe war eine SUMME zweier Quellenzeilen (`placePortal` + `pickWorldPose`):
//      Mitte 0,512 über Grund gegen Trefferradius 0,286 bei Reiseflughöhe 0,03 — ein Portal, durch
//      das man nicht fliegen kann. Gefunden hat es eine Zahl, die es vorher nicht gab und die
//      jetzt im Panel steht: *senkrechte Lücke Mitte ↔ Reiselinie gegen Trefferradius.*
//      Fehlerklasse 2, die stille Mitte. **Wer aus zwei Quellenregeln eine dritte addiert, hat
//      nicht kopiert, sondern erfunden.**
//  (b) Das falsche Bild — siehe Naht 5. Beide Male war die Ursache dieselbe: eine BEHAUPTUNG über
//      die Quelle statt einer Messung an ihr.

import { moveOnSphere, tangentFrame, cartesianFromSpherical } from './spherical-math.js';
import { surfaceAltitudeAt } from './terrain-surface.js';
import { isLand } from './globe-field.js';
import { streuen } from './verteilung.js';   // v11 · Portale liegen auf DER Streuungsschicht, nicht auf eigenem Zufall
import { quaternionFromSurfaceNormal } from './spherical-math.js';
import { CARPET_HOVER_HEIGHT } from './carpet.js';

/** Wörtlich aus der Quelle — die Tabelle, gegen die das Panel prüft. */
export const PORTAL_QUELLE = Object.freeze({
  radius: 0.15,        // BASE_PORTAL_RADIUS
  tube: 0.022,         // BASE_TUBE_RADIUS
  trigger: 0.22,       // PORTAL_TRIGGER_RADIUS — 1,4667× radius
  armDistance: 0.38,   // PORTAL_ARM_DISTANCE
  exitPush: 0.22,      // PORTAL_EXIT_PUSH
  cooldown: 0.3,       // PORTAL_COOLDOWN_SEC
  ovalX: 0.65,         // scaledGroup.scale.x
  ovalY: 1.25,         // scaledGroup.scale.y
  weltSkala: 1.3,      // COSMIC_WORLD_PORTAL_SCALE
  freiraum: 0.22,      // PORTAL_CLEARANCE_ABOVE_HOVER
  mindestAbstand: 1.2, // MIN_VOID_PORTAL_ANGULAR_SEP (rad)
  aufklappen: 0.5,     // spawnDuration
});

/** PORTAL_COLORS aus `CarpetPortalSystem.ts`. Sie sind ab Slice E auch die Farbe der
 *  Portal-Wegweiser (E-35) — eine Portalfarbe, zwei Leser, EIN Eigentümer: diese Zeile. */
export const PORTAL_COLORS = [0x00aaff, 0xff7700];

/** Park–Miller wie `seededUnit` in `CosmicWorldPortal.ts` — dieselbe Folge bei gleichem Seed. */
function seededUnit(seed) {
  let s = seed | 0;
  if (s === 0) s = 1;
  return () => { s = (s * 16807) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff; };
}

/** Geteilter Halo (dunkelblauer Radialverlauf) — 1:1 `getPortalHaloTexture()`. Prozedural, also
 *  kein Asset. */
let haloTex = null;
function haloTextur(THREE) {
  if (haloTex) return haloTex;
  const size = 256;
  const cv = document.createElement('canvas');
  cv.width = size; cv.height = size;
  const ctx = cv.getContext('2d');
  const c = size / 2;
  const g = ctx.createRadialGradient(c, c, 0, c, c, c);
  g.addColorStop(0.0, 'rgba(120, 160, 255, 0.9)');
  g.addColorStop(0.2, 'rgba(80, 120, 255, 0.6)');
  g.addColorStop(0.5, 'rgba(40, 70, 200, 0.2)');
  g.addColorStop(0.78, 'rgba(15, 30, 120, 0.05)');
  g.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  haloTex = new THREE.CanvasTexture(cv);
  haloTex.colorSpace = THREE.SRGBColorSpace;
  return haloTex;
}

/** ⚠ **Der Riss ist das Bild des Weltportals — und er lag die ganze Zeit im Repo.**
 *  `CosmicWorldPortal` lädt `/2D/rift.png`; ich hatte notiert „die einzige Datei der Quelle, die
 *  wir nicht haben" und daraus einen Ersatz gebaut (Torusring plus Wirbel-Shader — das ist das
 *  Bild des SPIELER-Portals aus `CarpetPortalSystem`). Georg, 30.8.: *„die portale sehen extrem
 *  anders aus als in tinyskies…?"* — richtig, und der Grund war eine Behauptung über den Bestand,
 *  keine Suche: die Datei liegt in `client/public/2D/rift.png` (581×680, 70 % transparent).
 *  Jetzt kopiert nach `globe-v7/rift.png`.
 *  **Lehre, teuer und einfach: „haben wir nicht" ist ein Messwert, kein Gefühl — wer ihn nicht
 *  gemessen hat, hat geraten.** (Und das Etikett darüber, `params.halo`, hat den Ersatz dann als
 *  bewusste Naht ausgegeben — eine erfundene Abweichung mit ordentlicher Buchführung.) */
let riftTex = null;
function riftTextur(THREE) {
  if (riftTex) return riftTex;
  const ldr = new THREE.TextureLoader();
  // Zwei Adressen, keine `import.meta.url`-Basis (die ist beim Bündeln `blob:` — 28.8. bezahlt).
  // ⚠ **Drei jetzt, und die erste gehört dem Standalone-Export** (1.9., session-export §6):
  // `rift.png` ist der einzige relative Asset-Pfad des Zweigs — alles andere lädt über die
  // kanonische RAW-URL. Im gebündelten Export liegt aber weder `./globe-v7/` noch `./rift.png`
  // daneben, und dann ist der Riss weg: das BILD des Weltportals, ausgerechnet.
  // Der Bau setzt daher `window.__KFB_RIFT_URL` (Daten-URL). **Nur der Bau** — hier steht kein
  // eingebettetes Bild, weil eine Quelldatei kein Ablageort für 161 kB Base64 ist.
  // Sobald die Datei unter `media/2D/rift.png` im KFB-Repo liegt, wird diese Zeile eine RAW-URL und
  // die Sonderbehandlung fällt weg.
  const riftUrl = (typeof window !== 'undefined' && window.__KFB_RIFT_URL) || './globe-v13/rift.png';
  riftTex = ldr.load(riftUrl, undefined, undefined,
    () => { const t = ldr.load('./rift.png'); t.colorSpace = THREE.SRGBColorSpace;
            riftTex.image = t.image; riftTex.needsUpdate = true; });
  riftTex.colorSpace = THREE.SRGBColorSpace;
  return riftTex;
}

const STAR_VERT = `
uniform float uTime;
attribute float aPhase;
attribute float aSize;
varying float vAlpha;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = (10.0 * aSize) * (1.0 / -mvPosition.z);
  float twinkle = sin(uTime * 3.5 + aPhase);
  vAlpha = 0.2 + 0.8 * twinkle;
  vAlpha = max(0.0, vAlpha);
}`;

const STAR_FRAG = `
uniform float uOpacity;
varying float vAlpha;
void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;
  float core = exp(-dist * dist * 35.0);
  float halo = exp(-dist * dist * 10.0) * 0.5;
  float alpha = (core + halo) * vAlpha * uOpacity;
  gl_FragColor = vec4(vec3(0.9, 0.95, 1.0), alpha);
}`;

// ⚠ **Hier standen `INNER_VERT`/`INNER_FRAG`** — der Wirbel-Shader des SPIELER-Portals
// (`CarpetPortalSystem`). Er ist mit dem Riss überflüssig geworden und deshalb GELÖSCHT, nicht
// stillgelegt: ein Shader, den niemand kompiliert, ist kein Rückweg, sondern Ballast — der
// Rückweg steht in der Quelle, und die ist eine URL im Dateikopf.

const INNER_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// ⚠ Fragment-Shader WÖRTLICH aus `CarpetPortalSystem.ts`. Keine Zeile umgestellt, keine Zahl
// „angepasst" — Regel 2 des Onboardings (ein nachgerechnetes Verfahren ist ein neues Verfahren).
const INNER_FRAG = `
uniform float uTime;
uniform float uAge;
uniform float uFill;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;
  float r = length(uv) * 2.0;

  float a = atan(uv.y, uv.x);

  float spawnProgress = clamp(uAge / 0.5, 0.0, 1.0);
  float wobbleAmount = 0.03 + (1.0 - spawnProgress) * 0.12;
  r += sin(uTime * 25.0 + a * 5.0) * wobbleAmount;

  if (r > 1.0) discard;

  float angleOffset = r * 4.0 - uTime * 5.0;
  float swirl1 = sin(a * 3.0 + angleOffset) * 0.5 + 0.5;
  float swirl2 = sin(a * 5.0 - angleOffset * 1.5) * 0.5 + 0.5;

  float energy = swirl1 * swirl2;

  float edgeGlow = pow(r, 3.0) * 2.0;
  float centerDarkness = smoothstep(0.2, 0.6, r);

  vec3 finalColor = mix(vec3(0.0), uColor, centerDarkness);
  finalColor += uColor * energy * edgeGlow;
  finalColor += vec3(1.0) * pow(r, 8.0);

  float alpha = smoothstep(1.0, 0.95, r) * centerDarkness;

  // ⚠ DREI Zeilen, die NICHT im gepinnten Baum stehen — mit einem Regler, dessen 0 die Quelle ist.
  // Georgs Screenshot vom laufenden tinyskies (30.8., "das waren schon die richtigen assets, nur
  // falsch gebaut/animiert") zeigt ein Portal mit LEUCHTENDEM Inneren: weißblaue Glut, kein
  // dunkles Loch. Der gepinnte Baum (2659a5cc987d) malt mit centerDarkness genau das Gegenteil.
  //
  // ⚠⚠ **31.8., Georg: "portale wirken teilweise überstrahlt" — und das war meine Summe, nicht
  // seine Wahrnehmung.** Erste Fassung hatte hier ein Grundweiß von 0,35 und einen Faktor 1,4,
  // ADDITIV über einen ebenfalls additiven Schein-Sprite (Deckkraft 0,6) und die zwei Wirbel.
  // Vier additive Schichten, von denen die Quelle ZWEI hat. Gerechnet: im Zentrum kam eine
  // Summe von ~1,9 heraus, und alles über 1,0 klippt auf Weiß — also verlor das Portal genau
  // das, was es tragen soll: Farbe und Silhouette. Ein weißes Loch leuchtet nicht, es fehlt.
  // Jetzt: die Glut ist FARBIG (Grundweiß 0,06 statt 0,35, Faktor 0,85 statt 1,4), und die
  // Summe der Schichten steht als gerechnete Zahl im Panel ("peak additive load").
  // **Additive Schichten addieren sich — wer drei davon stapelt, muss die Summe ausrechnen,
  // nicht die einzelnen Deckkraefte beurteilen.**
  vec3 glut = uColor * 0.72 + vec3(0.06);
  finalColor += glut * uFill * (1.0 - centerDarkness) * 0.85;
  alpha = max(alpha, uFill * (1.0 - r * 0.35) * step(r, 1.0) * 0.85);

  gl_FragColor = vec4(finalColor, alpha);
}`;

/** ZWEI BILDER, ZWEI ROLLEN — und das ist Georgs Korrektur, nicht meine Idee (30.8.):
 *  *„das ist noch etwas anderes — das sind die transition zu space!"* · *„brauche wir auch — sind
 *  aber keine portale!"*
 *
 *   · `'ring'` — **das Portal**: Torusring, Wirbel-Shader, Aufklappen, Puls
 *     (`CarpetPortalSystem.PortalVisual`, 1:1). Daran hängt der Sprung, und E-33 nennt genau das
 *     („Oval wie tinyskies: Torus + Shader").
 *   · `'riss'` — **der Übergang zum Weltraum**: Halo, `rift.png`, achtzig Funken
 *     (`CosmicWorldPortalVisual`, 1:1). In der Quelle ist das der VOID-EINTRITT — `Game.ts` baut
 *     zwei davon und schaltet sie mit `voidPortalsClosed` ab; wer hindurchfährt, wechselt in
 *     `enterVoidPlaneFlight`, also auf eine flache Ebene im Weltraum. **Kein Sprung auf der Kugel.**
 *
 *  Ich hatte beide Rollen in EIN Objekt gelegt — zuerst mit dem Ring als Weltportal-Bild, dann mit
 *  dem Riss als Portal-Bild. Beide Male war die MECHANIK richtig und die ROLLE falsch. Ein Bild ist
 *  keine Dekoration, es ist eine Ansage: ein Riss sagt „dahinter ist kein Ort dieser Welt", ein Ring
 *  sagt „dahinter ist die andere Seite". Unser Sprung (E-32) ist die andere Seite. Also Ring.
 *  Der Riss bleibt gebaut und umschaltbar, weil er für den Weltraum-Slice gebraucht wird — aber er
 *  ist kein Portal, und die Zeile im Panel sagt es. */
function machRingVisual(THREE, colorHex, phase, R, T, opt) {
  const kernGlut = opt && opt.kernGlut != null ? opt.kernGlut : 0.75;
  // ⚠ **1.9. → 1.9., zweite Runde: Georgs Entscheidung ist „Quelle nachbauen".**
  // Die erste Fassung hier hatte den Zappel auf EINEN relativen Faktor umgebaut (Begründung stand
  // in der Vorversion dieses Kommentars) — eine bewusste VERBESSERUNG laut §05q, weil sie von der
  // Quelle abwich. Georg hat sie gesehen und trotzdem für die Quelle entschieden: die Datei baut
  // jetzt `CarpetPortalSystem.ts:210–218` wörtlich nach, inklusive der Formverzerrung.
  // Zwei ABSOLUTE Zuschläge, zwei Frequenzen, je EINE Achse — genau wie dort:
  //   x: `Math.sin(time * 12.0) * 0.02`   ·   y: `Math.cos(time * 15.0) * 0.02`
  // Die Schwebung der beiden Frequenzen (Periode 2π/(15−12) ≈ 2,1 s) windet das Oval jetzt wieder,
  // wie in der Quelle — das ist ab jetzt der GEWOLLTE Zustand, keine Regression.
  // `formTor()` unten ist entsprechend umgeschrieben: es meldet die Verzerrung, statt sie als
  // Fehler zu behandeln (§5.7 — ein Wächter, der eine Designentscheidung rot färbt, erzieht zum
  // Überlesen). Rückweg auf die formtreue Fassung: `zappelX`/`zappelY` auf 0.
  const zappelX = opt && opt.zappelX != null ? opt.zappelX : 0.02;
  const zappelY = opt && opt.zappelY != null ? opt.zappelY : 0.02;
  const group = new THREE.Group();
  const scaled = new THREE.Group();
  scaled.scale.set(PORTAL_QUELLE.ovalX, PORTAL_QUELLE.ovalY, 1.0);
  group.add(scaled);

  // **Der weiche Außenschein — als SPRITE, nicht als Post-Effekt.** Und das ist keine Erfindung,
  // sondern die Hausschreibweise der Quelle: `CapybaraFlameShots` nennt sie in einem Kommentar
  // („Sprite glow — camera-facing radial gradient, simulates bloom"), `PaintballSplash` ebenso
  // („soft, wide falloff = readable glow / blur on points (no post bloom required)").
  // Gemessen: im ganzen Projekt gibt es **keinen** Bloom-Pass (`EffectComposer` kommt nicht vor) —
  // das Leuchten im Screenshot ist also gebaute Geometrie, kein Filter. Ohne diesen Schein blieb
  // unser Portal ein dünner Ring mit einem Loch: richtige Teile, falsch gebaut.
  const scheinMat = new THREE.SpriteMaterial({
    map: haloTextur(THREE), color: colorHex, transparent: true, opacity: 0.32,
    blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true,
  });
  const schein = new THREE.Sprite(scheinMat);
  schein.renderOrder = -1;
  schein.scale.setScalar(R * 2 * 2.2);
  scaled.add(schein);

  const ringMat = new THREE.MeshBasicMaterial({
    color: colorHex, transparent: true, opacity: 0.95,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });
  const glowMat = new THREE.MeshBasicMaterial({
    color: colorHex, transparent: true, opacity: 0.35,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });
  const innerMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uAge: { value: 0 }, uFill: { value: kernGlut },
                uColor: { value: new THREE.Color(colorHex) } },
    vertexShader: INNER_VERT, fragmentShader: INNER_FRAG,
    transparent: true, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
  const swirlMat = new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0.7,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });
  const swirl2Mat = new THREE.MeshBasicMaterial({
    color: colorHex, transparent: true, opacity: 0.6,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });

  const ring = new THREE.Mesh(new THREE.TorusGeometry(R, T * 0.6, 18, 56), ringMat);
  const glow = new THREE.Mesh(new THREE.CircleGeometry(R * 1.3, 40), glowMat);
  const inner = new THREE.Mesh(new THREE.CircleGeometry(R * 0.95, 40), innerMat);
  const swirl = new THREE.Mesh(new THREE.TorusGeometry(R * 0.95, T * 0.4, 12, 36), swirlMat);
  const swirl2 = new THREE.Mesh(new THREE.TorusGeometry(R * 0.98, T * 0.6, 12, 36), swirl2Mat);
  glow.position.z = -0.012;
  inner.position.z = -0.004;
  swirl.position.z = 0.008;
  swirl2.position.z = 0.012;
  scaled.add(glow); scaled.add(inner); scaled.add(swirl); scaled.add(swirl2); scaled.add(ring);

  const mats = [ringMat, glowMat, innerMat, swirlMat, swirl2Mat, scheinMat];
  const geos = [ring.geometry, glow.geometry, inner.geometry, swirl.geometry, swirl2.geometry];

  return {
    group,
    /** 1:1 `PortalVisual.update` — easeOutBack, Morph vom Kreis zum Oval, Puls, zwei Wirbel. */
    update(time, age) {
      const t = Math.min(1.0, age / PORTAL_QUELLE.aufklappen);
      const c1 = 1.70158, c3 = c1 + 1;
      const ease = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      const morphT = Math.max(0, (t - 0.5) * 2.0);
      const morphEase = morphT * morphT * (3 - 2 * morphT);
      // Zwei absolute Zuschläge, zwei Frequenzen, je EINE Achse — wörtlich die Quelle.
      const spawnWobble = (1 - t) * 0.13;
      const cx = (0.3 + (PORTAL_QUELLE.ovalX - 0.3) * morphEase) * ease
               + Math.sin(time * 12.0) * zappelX
               + Math.sin(age * 40) * spawnWobble;
      const cy = (0.3 + (PORTAL_QUELLE.ovalY - 0.3) * morphEase) * ease
               + Math.cos(time * 15.0) * zappelY
               + Math.cos(age * 45) * spawnWobble;
      scaled.scale.set(cx, cy, 1.0 * ease);
      scaled.rotation.z = (1 - t) * Math.PI;
      ring.scale.setScalar(1 + Math.sin(time * 8.0 + phase) * 0.02);
      glow.scale.setScalar(0.95 + Math.sin(time * 4.0 + phase) * 0.05);
      innerMat.uniforms.uTime.value = time + phase;
      innerMat.uniforms.uAge.value = age;
      swirl.rotation.z = -time * 3.5 - phase;
      swirl2.rotation.z = time * 2.8 + phase * 0.5;
      swirl.scale.setScalar(1 + Math.sin(time * 12.0) * 0.03);
      swirl2.scale.setScalar(1 + Math.cos(time * 9.0) * 0.04);
    },
    setOpacity(o) {
      ringMat.opacity = 0.95 * o; glowMat.opacity = 0.35 * o;
      swirlMat.opacity = 0.7 * o; swirl2Mat.opacity = 0.6 * o; scheinMat.opacity = 0.32 * o;
    },
    setKernGlut(v) { innerMat.uniforms.uFill.value = Math.max(0, Math.min(1.5, v)); },
    setHalo(on) { schein.visible = !!on; }, setRing() {},
    dispose() {
      group.removeFromParent();
      for (const g of geos) g.dispose();
      for (const m of mats) m.dispose();
    },
  };
}

/** Der sichtbare Teil — **das Weltportal der Quelle** (`CosmicWorldPortalVisual`): Halo, Riss und
 *  achtzig funkelnde Sterne, alles in einer um 0,65×1,25 gestauchten Gruppe.
 *  Der Torusring samt Wirbeln (`CarpetPortalSystem.PortalVisual`) bleibt als **Rahmen** verfügbar,
 *  standardmäßig AUS: er gehört dort zum vom Spieler GESETZTEN Portal, nicht zum Weltportal.
 *  Kein Aufklappen mehr — ein Weltportal wird nicht geöffnet, es ist da (auch das ist die Quelle:
 *  `CosmicWorldPortalVisual` hat keine Spawn-Animation). */
function machVisual(THREE, colorHex, phase, R, T, opt) {
  const zeigeHalo = !opt || opt.halo !== false;
  const zeigeRing = !!(opt && opt.ring);
  const rnd = seededUnit((opt && opt.seed) || 1) ;
  const group = new THREE.Group();
  // ⚠ **`matrixAutoUpdate` bleibt AN** — anders als in `CarpetPortalSystem`. Dort legt eine
  // Basismatrix die Lage fest; hier richtet sich das Portal je Bild zur Kamera auf (E-33,
  // `CosmicWorldPortal.update`), und das läuft über `lookAt`.
  const scaled = new THREE.Group();
  scaled.scale.set(PORTAL_QUELLE.ovalX, PORTAL_QUELLE.ovalY, 1.0);
  group.add(scaled);

  const durchmesser = 2.0 * R * 1.25 * 1.25;   // `portalDiameter` der Quelle

  const haloMat = new THREE.SpriteMaterial({
    map: haloTextur(THREE), color: 0xffffff, transparent: true, opacity: 0.85,
    blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true,
  });
  const halo = new THREE.Sprite(haloMat);
  halo.renderOrder = -1;
  halo.scale.setScalar(durchmesser * 4.0);
  halo.visible = zeigeHalo;
  scaled.add(halo);

  // Der Riss. `depthWrite: false`, damit die transparenten Teile nichts hinter sich abschneiden
  // (Kommentar der Quelle: sonst blockiert das Blatt die Aurora dahinter).
  const riftMat = new THREE.MeshBasicMaterial({
    map: riftTextur(THREE), color: 0xffffff, transparent: true,
    depthWrite: false, depthTest: true, blending: THREE.NormalBlending, side: THREE.DoubleSide,
  });
  riftMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    riftMat.userData.shader = shader;
    shader.vertexShader = shader.vertexShader.replace('#include <common>',
      '#include <common>\nuniform float uTime;');
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',
      `#include <begin_vertex>
      float swayAmt = 0.025;
      transformed.x += sin(uv.y * 4.0 + uTime * 1.2) * swayAmt;
      transformed.y += cos(uv.x * 4.0 + uTime * 1.5) * swayAmt;`);
  };
  // Viele Segmente, damit die Vertex-Verschiebung eine Welle wird und nicht vier Ecken bewegt.
  const rift = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 16, 16), riftMat);
  rift.renderOrder = 0;
  rift.scale.setScalar(durchmesser * 1.5);
  scaled.add(rift);

  // Achtzig Funken. ⚠ Eine Abweichung, und zwar die Hausregel: die Quelle zieht `Math.random()`,
  // wir einen Seed-Strom — in der Weltgenerierung gibt es kein `Math.random` (S3a), sonst sieht
  // dieselbe Welt bei jedem Laden anders aus.
  const starCount = 80;
  const starGeo = new THREE.BufferGeometry();
  const sp = new Float32Array(starCount * 3), sph = new Float32Array(starCount), ss = new Float32Array(starCount);
  for (let i = 0; i < starCount; i++) {
    const r = Math.sqrt(rnd()) * (durchmesser * 0.7);
    const th = rnd() * Math.PI * 2;
    sp[i * 3] = Math.cos(th) * r; sp[i * 3 + 1] = Math.sin(th) * r;
    sp[i * 3 + 2] = (rnd() - 0.5) * 0.1 + 0.05;
    sph[i] = rnd() * Math.PI * 2;
    ss[i] = 0.5 + rnd() * 1.5;
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  starGeo.setAttribute('aPhase', new THREE.Float32BufferAttribute(sph, 1));
  starGeo.setAttribute('aSize', new THREE.Float32BufferAttribute(ss, 1));
  const starMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 1.0 } },
    vertexShader: STAR_VERT, fragmentShader: STAR_FRAG,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true,
  });
  const stars = new THREE.Points(starGeo, starMat);
  stars.renderOrder = 1;
  scaled.add(stars);

  // ── Rahmen (optional): der Ring des SPIELER-Portals ────────────────────────────────
  const ringMat = new THREE.MeshBasicMaterial({
    color: colorHex, transparent: true, opacity: 0.95,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });
  const glowMat = new THREE.MeshBasicMaterial({
    color: colorHex, transparent: true, opacity: 0.35,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });
  const swirlMat = new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0.7,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });
  const swirl2Mat = new THREE.MeshBasicMaterial({
    color: colorHex, transparent: true, opacity: 0.6,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });

  const rahmen = new THREE.Group();
  rahmen.visible = zeigeRing;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(R, T * 0.6, 18, 56), ringMat);
  const glow = new THREE.Mesh(new THREE.CircleGeometry(R * 1.3, 40), glowMat);
  const swirl = new THREE.Mesh(new THREE.TorusGeometry(R * 0.95, T * 0.4, 12, 36), swirlMat);
  const swirl2 = new THREE.Mesh(new THREE.TorusGeometry(R * 0.98, T * 0.6, 12, 36), swirl2Mat);
  glow.position.z = -0.012;
  swirl.position.z = 0.008;
  swirl2.position.z = 0.012;
  rahmen.add(glow); rahmen.add(swirl); rahmen.add(swirl2); rahmen.add(ring);
  scaled.add(rahmen);

  const mats = [haloMat, riftMat, starMat, ringMat, glowMat, swirlMat, swirl2Mat];
  const geos = [rift.geometry, starGeo, ring.geometry, glow.geometry, swirl.geometry, swirl2.geometry];

  return {
    group,
    /** 1:1 `CosmicWorldPortalVisual.update` (Zeit in den Riss und in die Sterne) plus der Puls des
     *  Rahmens, falls er an ist. */
    update(time, age) {
      if (riftMat.userData.shader) riftMat.userData.shader.uniforms.uTime.value = time + phase;
      starMat.uniforms.uTime.value = time + phase;
      if (!rahmen.visible) return;
      const pulse = 1 + Math.sin(time * 8.0 + phase) * 0.02;
      ring.scale.setScalar(pulse);
      glow.scale.setScalar(0.95 + Math.sin(time * 4.0 + phase) * 0.05);
      swirl.rotation.z = -time * 3.5 - phase;
      swirl2.rotation.z = time * 2.8 + phase * 0.5;
      swirl.scale.setScalar(1 + Math.sin(time * 12.0) * 0.03);
      swirl2.scale.setScalar(1 + Math.cos(time * 9.0) * 0.04);
    },
    setOpacity(o) {
      haloMat.opacity = 0.85 * o; riftMat.opacity = o;
      starMat.uniforms.uOpacity.value = o;
      ringMat.opacity = 0.95 * o; glowMat.opacity = 0.35 * o;
      swirlMat.opacity = 0.7 * o; swirl2Mat.opacity = 0.6 * o;
    },
    setHalo(on) { halo.visible = !!on; },
    setRing(on) { rahmen.visible = !!on; },
    dispose() {
      group.removeFromParent();
      for (const g of geos) g.dispose();
      for (const m of mats) m.dispose();
    },
  };
}

export function createPortals(opts = {}) {
  const THREE = opts.THREE;
  const R_GLOBE = opts.radius != null ? opts.radius : 5;
  const seed = opts.seed | 0;
  const terrainType = opts.terrainType;

  const P = Object.assign({
    on: true,
    anzahl: 2,          // E-31 · PARAMETER. Die Quelle hält 2 (`COSMIC_VOID_PORTAL_COUNT`).
    // ⚠ **Größe ist ab jetzt eine Entscheidung, keine Konstante — und der Grund ist ein Bild.**
    // Der gepinnte Baum rechnet `BASE_PORTAL_RADIUS 0.15` (Weltportal ×1,3 = 0,195): damit ist das
    // Portal SCHMALER als der Teppich (0,35) — in Georgs Screenshot des laufenden Spiels ist es ein
    // Mehrfaches davon und füllt ein Drittel des Bildes. Eine Zahl aus einem Foto zu schätzen wäre
    // wieder Mess-und-Rate; also steht sie als Regler mit einer BEZUGSGRÖSSE im Panel (Portalbreite
    // in Teppichbreiten), und Georg setzt sie in einer Sekunde. Standard 2,6 → 0,66 u breit,
    // 1,27 u hoch: klar größer als das Fahrzeug, wie im Bild.
    // Die Trefferfläche wächst mit (Naht 3), also bleibt die Zusage 1,47× unberührt.
    // ⚠ **Georg, 1.9.: „im Wasser kann auch ein Portal sein."** Das ist eine ERLAUBNIS, und die
    // erste Umsetzung hat sie in eine zweite Absolutheit verwandelt: die Landprüfung war gelöscht,
    // und in der geladenen Welt liegen **15,9 % Land** (10 502 von 66 049 Vertices). Erwartungswert
    // damit **0,64 von 4** Portalen auf Land, Wahrscheinlichkeit für keins auf Land
    // **0,841⁴ = 50 %** — gemessen standen tatsächlich **4 von 4** im offenen Meer.
    // *„Kann auch im Wasser sein" war zu „ist immer im Wasser" geworden.* Eine Erlaubnis ist keine
    // Umkehrung der Regel, sie ist der Verzicht auf ihre Unbedingtheit.
    // **Also eine Vorliebe statt eines Schalters**, mit der Bauform, die dieses Modul schon hat
    // (500 Versuche für den Mindestabstand): die ersten `landVersuche` bestehen auf Land, danach ist
    // Wasser zugelassen. Auf einer landreichen Welt stehen die Portale damit wie vorher; auf einer
    // Ozeanwelt kommen sie überhaupt zustande, statt zu fehlen.
    //
    // ⚠ **Und eine Unsymmetrie, die ausgesprochen sein muss (§05q):** das SPRUNGZIEL bleibt streng
    // landgebunden (`zielWaehlen`, unten). Man kann also in ein Portal im Meer einfliegen, kommt
    // aber immer auf Land heraus. Das ist Absicht — ein Portal ist ein Bauwerk und darf im Wasser
    // stehen, eine Ankunft ist ein Ort, an dem man sich wiederfindet. Sollte Georg auch Ankunft im
    // Wasser wollen, ist das eine Zeile; unentschieden bleibt es NICHT, es steht hier.
    nurLand: false,      // `true` = die Quellregel, Wasser wird nie akzeptiert
    landVersuche: 350,   // so viele der 500 Versuche bestehen auf Land (0 = Land ist kein Vorzug)
    skala: 1.3,
    // ⚠ **1,3 ist ab 1.9. der Standard, und das ist exakt die Quelle:** dort steht
    // `R = BASE_PORTAL_RADIUS 0,15 × COSMIC_WORLD_PORTAL_SCALE 1,3`. Vorher 2,6 — doppelt so groß,
    // gesetzt am 30.8. nach Georgs Screenshot des laufenden Spiels. Georg, 1.9., am eigenen Bild:
    // *„wir nehmen die kleineren Portale wie in TS → das sieht auch auf dem Globe odd aus mit den
    // riesigen Portal-Kreisen."* **Der Screenshot war das schwächere Zeugnis** — ein Portal im
    // Anflug füllt das Bild, dasselbe Portal von außen auf der Kugel ist ein Reifen. Wer eine
    // Größe aus einer Nahaufnahme schätzt, schätzt sie für eine Entfernung.
    // Damit ist die Abweichung Nr. 1 der Vergleichsliste **geschlossen**: Bild, Farbe UND Größe sind
    // jetzt quellentreu. Der Regler bleibt, der alte Wert ist 2,6.
    sprungBogen: 2.0,   // E-32 · „weit entfernt" ≥ 2,0 rad ≈ 115°
    trefferFaktor: 1,   // Regler auf die Trefferfläche (1 = Quelle). Der Aufschlag der Quelle
                        // heißt dort `upgrades.triggerRadiusMult` — also ein vorgesehener Eingang,
                        // kein Loch, das wir aufreißen.
    ankunftAglMax: 0.5, // Naht 1: so viel Höhe über Grund darf der Sprung mitnehmen
    // ── DAS BILD ── Georgs Rollenteilung (30.8.): *„wir können portal erstmal innerhalb einer Welt
    // denken · risse dann zu anderen welten/decks"*. Also:
    //   `'ring'` = PORTAL, Sprung auf derselben Kugel (E-32) — das ist der Standard.
    //   `'riss'` = Übergang zu einer ANDEREN Welt / einem anderen Deck. Das Bild ist gebaut und
    //              geprüft, die Mechanik dahinter ist ein eigener Slice (in der Quelle der
    //              Void-Eintritt: `Game.ts` → `enterVoidPlaneFlight`). Bis dahin ist es hier
    //              ansehbar, damit es nicht verloren geht — aber es ist kein Portal.
    bild: 'ring',
    kernGlut: 0.45,     // Leuchten des Portalinneren. 0 = gepinnter Quellbaum (dunkler Kern).
    // ⚠ **1.9., zweite Runde — Georgs Entscheidung: „Quelle nachbauen".** War `atem: 0,031` (ein
    // relativer Faktor, formtreu — eine bewusste VERBESSERUNG laut §05q). Jetzt `zappel: 0,02`:
    // dieselbe Zahl, mit der `CarpetPortalSystem.ts:210–218` auf BEIDEN Achsen absolut zappelt
    // (zwei Frequenzen, 12 und 15 rad/s, siehe `machRingVisual`). Das Oval windet sich damit
    // wieder wie in der Quelle — gewollt, nicht regressiert. `0` bleibt der Rückweg zur starren
    // (oder zur formtreuen, mit dem alten Faktor) Fassung.
    zappel: 0.02,
    halo: true,
    ring: false,
  }, opts.params || {});
  if (P.bild !== 'ring' && P.bild !== 'riss') {
    console.warn('[portal] bild „' + P.bild + '" gibt es nicht — es gilt „ring". '
      + 'Bekannt: „ring" (Portal in dieser Welt) und „riss" (Übergang zu anderen Welten/Decks).');
    P.bild = 'ring';
  }

  const group = new THREE.Group();
  group.name = 'portals';

  const portale = [];
  let zeit = 0, abkuehlung = 0, letzterPos = null;
  const stat = { spruenge: 0, letzterBogen: 0, letzteAnkunftAgl: 0, verworfeneOrte: 0,
                 imWasserGelandet: 0, keinPlatz: 0 };

  const _v1 = new THREE.Vector3(), _v2 = new THREE.Vector3(), _v3 = new THREE.Vector3();
  const _seg = new THREE.Vector3(), _rel = new THREE.Vector3(), _hv = new THREE.Vector3();

  const R = () => PORTAL_QUELLE.radius * P.skala;
  const T = () => PORTAL_QUELLE.tube * P.skala;
  /** Naht 3 · die Trefferfläche skaliert mit dem Portal, das VERHÄLTNIS bleibt die Zusage.
   *  ⚠ **Sie ist eine ELLIPSE am sichtbaren Oval, keine Kugel um den Mittelpunkt.** Erste Fassung
   *  nach Naht 4 prüfte nur den Abstand zum Mittelpunkt gegen `trigger` — das ist eine Fangkugel,
   *  und mit dem Größenregler wuchs sie auf 0,572 u, während das Oval nur 0,254 u halbbreit ist.
   *  Gemessen: ein tangentialer Vorbeiflug **0,55 u seitlich** (2,2× die sichtbare Halbbreite) hat
   *  teleportiert — man wurde von außen gegriffen, ohne das Portal zu berühren.
   *  Die 1,47 der Quelle sind in ihrem EBENEN-Test gebunden (0,22 gegen einen 0,15er Ring in
   *  derselben Ebene); ohne diese Bindung ist die Zahl kein Versprechen, sondern ein Netz.
   *  Also: 1,47× die sichtbaren HALBACHSEN, seitlich und radial getrennt — damit gilt die Zusage
   *  gegen das, was man SIEHT, bei jeder Größe, und die Richtungsunabhängigkeit aus Naht 4 bleibt
   *  (die Ellipse ist ein Rotationskörper um die Hochachse des Portals). */
  const TREFFER = PORTAL_QUELLE.trigger / PORTAL_QUELLE.radius;   // 1,4667
  const achseSeit = () => R() * PORTAL_QUELLE.ovalX * TREFFER * P.trefferFaktor;
  const achseHoch = () => R() * PORTAL_QUELLE.ovalY * TREFFER * P.trefferFaktor;
  /** Bleibt als EINE Zahl für Berichte und Vorprüfungen: die große Halbachse. */
  const trigger = () => Math.max(achseSeit(), achseHoch());

  /** 1:1 `pickWorldPose` — Sektor je Portal, nur Land, Höhe = Grund + Schwebehöhe + 0,22,
   *  Mindestabstand. (⚠ KEIN Freiraum für die untere Ringkante — siehe Kopf und die Zeile bei
   *  `alt` unten: der Ring steckt im Boden, das ist die Quelle.) */
  function ortWaehlen(rnd, sektor, anzahl, schonDa) {
    for (let k = 0; k < 500; k++) {
      const h0 = sektor + (rnd() - 0.5) * ((Math.PI * 2) / Math.max(1, anzahl));
      const a0 = 0.35 + rnd() * 2.2;
      const q1 = moveOnSphere(new THREE.Quaternion(), h0, a0);
      const h1 = rnd() * Math.PI * 2;
      const a1 = rnd() * 1.4;
      const q = moveOnSphere(q1, h1, a1);
      const fr = tangentFrame(q);
      // Land ist ein VORZUG, keine Bedingung: die ersten `landVersuche` lehnen Wasser ab, danach
      // wird es genommen. Begründung und die gemessenen 50 % oben bei `landVersuche`.
      const landPflicht = P.nurLand || k < P.landVersuche;
      if (landPflicht && !isLand(seed, terrainType, fr.up.x, fr.up.y, fr.up.z)) { stat.verworfeneOrte++; continue; }
      const grund = surfaceAltitudeAt(seed, terrainType, fr.up.x, fr.up.y, fr.up.z);
      // ⚠ **Die Höhe gehört dem BILD, weil sie in der Quelle dem OBJEKT gehört.** Zwei Regeln,
      // beide wörtlich, und die Wahl zwischen ihnen ist keine Geschmacksfrage:
      //   · `ring` → `placePortal`: `max(Schwebehöhe, halbe Ovalhöhe + 0,02)`, mit dem Kommentar
      //     „Ensure the portal's bottom edge clears the ground" — ein RING mit halb versenkter
      //     Kante ist ein halber Ring, und Georgs Referenzbild zeigt das ganze Oval auf dem Hügel.
      //   · `riss` → `pickWorldPose`: `Schwebehöhe + 0,22`. Dort steckt die untere Kante ABSICHTLICH
      //     im Gelände: ein Riss wächst aus dem Boden.
      // Vorgeschichte in zwei Stufen, beide teuer: erst habe ich die beiden Regeln ADDIERT
      // (Portal unerreichbar, Nachtrag a), dann die Rolle des Bildes gewechselt und die Höhe des
      // alten Bildes stehen gelassen — samt einer Torzeile, die die Folge als „source does the
      // same" ausgab. **Ein Instrument, das eine erfundene Abweichung als Quellentreue ausgibt, ist
      // schlimmer als keins.**
      const halbHoehe = R() * PORTAL_QUELLE.ovalY + T();
      const alt = (P.bild === 'riss')
        ? grund + CARPET_HOVER_HEIGHT + PORTAL_QUELLE.freiraum
        : grund + Math.max(CARPET_HOVER_HEIGHT, halbHoehe + 0.02);
      if (schonDa.length) {
        const dir = cartesianFromSpherical(q, alt, R_GLOBE).clone().normalize();
        let zuNah = false;
        for (const d of schonDa) if (d.dot(dir) > Math.cos(PORTAL_QUELLE.mindestAbstand)) { zuNah = true; break; }
        if (zuNah) { stat.verworfeneOrte++; continue; }
      }
      return { q, alt, ersatz: false };
    }
    // ⚠ **Hier stand ein NOTPLATZ, und der war der Defekt.** Die Quelle fällt nach 500 Versuchen auf
    // `moveOnSphere(q, 0, 0.4)` zurück — ohne Land- und ohne Abstandsprüfung. Bei EINEM festen
    // Weltportal ist das ein Notnagel; bei einer VARIABLEN Anzahl (E-31) ist es eine Lüge: mit
    // fünf Portalen auf einer Welt, die nur vier verträgt, stand zuverlässig ein Riss im Meer und
    // der Mindestabstand fiel auf 54° (gemessen auf zwei Seeds). Und es war die dokumentierte
    // Regel der Platzierung, die dabei brach: „nur Land".
    // **Eine unmögliche Anfrage bekommt eine ABLEHNUNG, keine falsche Antwort.** `bauen()` setzt
    // dieses Portal nicht, `tor()` sagt „5 asked, 4 placed — this world has no room". Ein Portal,
    // das fehlt und sich meldet, ist besser als eines, das steht und lügt.
    stat.keinPlatz++;
    return null;
  }

  /** E-32 · Das Sprungziel: dieselbe Kugel, ≥ `sprungBogen` entfernt, auf LAND.
   *  Deterministisch aus dem Seed — dasselbe Portal führt in derselben Welt immer dorthin. */
  function zielWaehlen(q0, i) {
    const rnd = seededUnit(seed + 77003 + i * 4241);
    const maxBogen = Math.PI - 0.18;   // nicht exakt der Antipode: dort ist der Kurs unbestimmt
    for (let k = 0; k < 500; k++) {
      const h = rnd() * Math.PI * 2;
      const bogen = P.sprungBogen + rnd() * Math.max(0.05, maxBogen - P.sprungBogen);
      const q = moveOnSphere(q0, h, bogen);
      const fr = tangentFrame(q);
      if (!isLand(seed, terrainType, fr.up.x, fr.up.y, fr.up.z)) continue;
      return { q, bogen, aufWasser: false };
    }
    // Ozeanwelt: dann eben Wasser — aber gezählt und im Panel sichtbar. Ein Sprung, der
    // ausfällt, wäre schlimmer als eine Landung im Meer (fliegen kann man dort auch).
    stat.imWasserGelandet++;
    const q = moveOnSphere(q0, 0, P.sprungBogen);
    return { q, bogen: P.sprungBogen, aufWasser: true };
  }

  function bauen() {
    const richtungen = [];
    // ⚠ **Die Phase wird KLEIN gehalten, und das ist keine Kosmetik, sondern Float32.**
    // Die Quelle rechnet `new CosmicWorldPortalVisual(seed * 0.0012 + index * 10)` — dort ist
    // `seed` eine kleine Weltzahl. Unser Seed hat neun Stellen: 403 807 147 × 0,0012 = **484 569**,
    // und ein float32-`uTime` hat bei dieser Größe eine Schrittweite von **0,031**. Bei dt = 1/60
    // ändert sich der Uniform dann erst nach zwei Bildern, und `sin(uTime * 25.0 + …)` im Riss-Sway
    // springt um 0,78 rad auf einmal: der Riss zuckt statt zu schwingen, die achtzig Funken blinken
    // im Gleichtakt — genau die Lebendigkeit, wegen der der Riss geholt wurde.
    // Die ABSICHT der Quelle ist „Portale laufen nicht im Gleichtakt", nicht eine absolute
    // Zeitmarke. Also Modulo 2π plus ein krummer Abstand je Portal.
    // **Dieselbe Formel mit einer anderen Eingabegröße ist nicht dieselbe Formel** — die
    // Fehlerklasse dieser Datei zum dritten Mal, diesmal numerisch. Darum steht die größte Phase
    // ab jetzt in `tor()`: im Code ist der Defekt unsichtbar und käme beim nächsten großen Seed
    // lautlos zurück.
    const phasenBasis = (((seed * 0.0012) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    // ── v11 · Slice „Streuung zusammenführen“ (Georg, OFFENE_SLICES 1) ──────────────────────
    // Die Portale würfelten bisher ihre Orte selbst (`ortWaehlen`, 500 Würfe je Sektor) — der
    // dritte eigene Zufall neben Gegnern und Karten. Jetzt kommen die Orte aus `streuen()` mit dem
    // Prädikat „Land“ und dem Mindestabstand der Quelle; Höhe und Bild bleiben Zeile für Zeile wie
    // vorher. `params.streuung = false` ist der Rückweg auf `ortWaehlen`.
    const orte = P.streuung !== false
      ? streuen({ THREE, count: P.anzahl, seed, salt: 19023, minSep: PORTAL_QUELLE.mindestAbstand,
                  gueltig: (n) => isLand(seed, terrainType, n.x, n.y, n.z) && (!opts.frei || opts.frei(n)) })
      : null;
    stat.streuung = orte ? orte.bericht : null;
    for (let i = 0; i < P.anzahl; i++) {
      const rnd = seededUnit(seed + 19023841 + i * 9999);
      const sektor = (i / Math.max(1, P.anzahl)) * Math.PI * 2;
      let ort;
      if (orte) {
        const n = orte[i];
        if (!n) { stat.keinPlatz++; continue; }
        const q = quaternionFromSurfaceNormal(n.x, n.y, n.z);
        const grund = surfaceAltitudeAt(seed, terrainType, n.x, n.y, n.z);
        const halbHoehe = R() * PORTAL_QUELLE.ovalY + T();
        ort = { q, alt: (P.bild === 'riss') ? grund + CARPET_HOVER_HEIGHT + PORTAL_QUELLE.freiraum
                                            : grund + Math.max(CARPET_HOVER_HEIGHT, halbHoehe + 0.02), ersatz: false };
      } else ort = ortWaehlen(rnd, sektor, P.anzahl, richtungen);
      if (!ort) continue;   // kein Platz auf dieser Welt — gezählt in `stat.keinPlatz`, siehe `tor()`
      const pos = cartesianFromSpherical(ort.q, ort.alt, R_GLOBE);
      richtungen.push(pos.clone().normalize());
      const phase = phasenBasis + i * 1.7;
      const visual = (P.bild === 'riss')
        ? machVisual(THREE, PORTAL_COLORS[i % PORTAL_COLORS.length], phase, R(), T(),
                     { halo: P.halo, ring: P.ring, seed: (seed | 0) + 7717 + i * 131 })
        : machRingVisual(THREE, PORTAL_COLORS[i % PORTAL_COLORS.length], phase, R(), T(),
                     { kernGlut: P.kernGlut, zappelX: P.zappel, zappelY: P.zappel });
      visual.group.position.copy(pos);
      group.add(visual.group);
      portale.push({
        i, q: ort.q, alt: ort.alt, pos, visual, phase,
        geboren: 0, scharf: false, ziel: zielWaehlen(ort.q, i),
      });
    }
  }
  bauen();

  /** Neu aufstellen. Kein Nachjustieren an stehenden Portalen: Anzahl und Sprungbogen gehen in
   *  die PLATZIERUNG ein (Sektorbreite, Zielsuche), und ein halb umgestelltes Portalfeld wären
   *  zwei Wahrheiten über eine Welt. */
  function neu() {
    for (const p of portale) p.visual.dispose();
    portale.length = 0;
    letzterPos = null;
    stat.keinPlatz = 0; stat.imWasserGelandet = 0; stat.verworfeneOrte = 0;
    bauen();
  }

  /** Lage je Bild: radiales „Oben" bleibt, die Front dreht sich zur Kamera (`CosmicWorldPortal`).
   *  **Nur das BILD** — der Trefferest liest diese Lage nicht (Naht 4, siehe `schnitt`). Genau
   *  deshalb steht hier auch keine Basis mehr herum: eine Basis, die niemand liest, wäre die
   *  Einladung, sie später für eine Messung zu benutzen, die sie nicht tragen kann. */
  function stellen(p, camera) {
    const radUp = _v1.copy(p.pos).normalize();
    const toCam = _v2.copy(camera.position).sub(p.pos);
    p.visual.group.up.copy(radUp);
    p.visual.group.lookAt(_v3.copy(p.pos).sub(toCam));
  }

  /** ⚠ **Naht 4 · der Trefferest kennt die Kamera NICHT.** Hier kollidieren zwei Quellenregeln,
   *  und nach §05q wird das GEMELDET, nicht in der Mitte geschlichtet:
   *   · `CarpetPortalSystem.segmentPortalIntersection` prüft das Flugsegment gegen die EBENE des
   *     Portals (`portal.forward`) — dort ist diese Ebene FEST, weil der Spieler das Portal in
   *     seine Flugrichtung setzt.
   *   · `CosmicWorldPortal` dreht sein Portal je Bild zur KAMERA (E-33, Georgs Entscheidung).
   *  Beides zusammen ergibt eine Torebene, die sich mit dem Blick dreht — und damit ein Tor, das
   *  je nach Kameralage nicht durchfliegbar ist. **Gemessen, nicht vermutet:** in der Startansicht
   *  steht die Kamera fast senkrecht über der Welt; die Portalebene liegt dann fast TANGENTIAL,
   *  ein waagerechter Anflug ändert die Tiefe kaum, `denom ≈ 0` — 300 Bilder Anflug, kein Sprung.
   *
   *  Aufgelöst wird es in Richtung der AUFGABE, nicht in Richtung einer der beiden Dateien: die
   *  Ebene ist die, die auf dem FLUGSEGMENT senkrecht steht. Das ist dieselbe Rechnung wie in der
   *  Quelle (Vorzeichenwechsel plus Radialabstand), nur mit der Flugrichtung als Normale — und
   *  damit genau die Aussage, die ein Weltportal braucht: *das Segment fliegt am Mittelpunkt in
   *  weniger als `trigger` vorbei.* Das VERHÄLTNIS 1,47× bleibt unberührt, die Zusage der Quelle
   *  („forgiving teleports") also auch. `t ∈ [0,1]` bleibt die Bedingung „Durchflug, nicht
   *  Annäherung" — ohne sie würde Vorbeifliegen in 0,2 u Abstand schon zählen.
   *  Der Selbsttest prüft es aus ZWEI Richtungen; unter der Kamera-Ebene fällt die zweite durch. */
  function schnitt(start, ende, p) {
    _seg.copy(ende).sub(start);
    const laenge2 = _seg.lengthSq();
    if (laenge2 < 1e-12) return null;
    _rel.copy(p.pos).sub(start);
    const t = _rel.dot(_seg) / laenge2;
    if (t < 0 || t > 1) return null;
    // Vektor von der Portalmitte zum Punkt der größten Annäherung …
    _v3.copy(_seg).multiplyScalar(t).sub(_rel);
    // … und der wird ANISOTROP gemessen: das Portal steht radial, also ist „oben" seine
    // Standortnormale. Seitlich gilt die schmale Halbachse, radial die hohe — genau die Form,
    // die man sieht (Oval 0,65 × 1,25), mal der 1,47 der Quelle.
    _hv.copy(p.pos).normalize();
    const v = _v3.dot(_hv);
    const h = Math.sqrt(Math.max(0, _v3.lengthSq() - v * v));
    const as = achseSeit(), ah = achseHoch();
    if ((h * h) / (as * as) + (v * v) / (ah * ah) > 1) return null;
    return t;
  }

  /**
   * @returns {null | { portal, bogen, ziel, agl }} — der Sprung, wenn einer passiert ist.
   *   Der Runner feuert daraufhin die Kaskade; dieses Modul kennt keine Effekte (E-28).
   */
  function update(dt, carpet, camera) {
    zeit += dt;
    abkuehlung = Math.max(0, abkuehlung - dt);
    if (!P.on) { group.visible = false; return null; }
    group.visible = true;
    for (const p of portale) {
      p.geboren += dt;
      stellen(p, camera);
      p.visual.update(zeit, p.geboren);
    }

    const jetzt = carpet.worldPos();
    if (!letzterPos) { letzterPos = jetzt.clone(); return null; }

    // Scharfstellen 1:1 (`updateArming`): ein Portal, in dem man startet, teleportiert nicht.
    const armSq = PORTAL_QUELLE.armDistance * PORTAL_QUELLE.armDistance;
    for (const p of portale) if (!p.scharf && jetzt.distanceToSquared(p.pos) > armSq) p.scharf = true;

    if (abkuehlung > 0) { letzterPos.copy(jetzt); return null; }

    let treffer = null, bestT = 2;
    for (const p of portale) {
      if (!p.scharf) continue;
      const t = schnitt(letzterPos, jetzt, p);
      if (t == null || t >= bestT) continue;
      bestT = t; treffer = p;
    }
    if (!treffer) { letzterPos.copy(jetzt); return null; }

    // ── Der Sprung (E-32) ────────────────────────────────────────────────────────────────
    const kurs = carpet.state.heading;
    const agl = Math.max(0, Math.min(P.ankunftAglMax, carpet.agl));
    const zielQ = moveOnSphere(treffer.ziel.q, kurs, PORTAL_QUELLE.exitPush / R_GLOBE);
    const fr = tangentFrame(zielQ);
    const grund = surfaceAltitudeAt(seed, terrainType, fr.up.x, fr.up.y, fr.up.z);
    const alt = grund + CARPET_HOVER_HEIGHT + agl;
    carpet.teleportTo(zielQ, kurs, alt, carpet.state.speed);
    abkuehlung = PORTAL_QUELLE.cooldown;
    for (const p of portale) p.scharf = false;
    letzterPos.copy(carpet.worldPos());
    stat.spruenge++;
    stat.letzterBogen = treffer.ziel.bogen;
    stat.letzteAnkunftAgl = agl;
    return { portal: treffer, bogen: treffer.ziel.bogen, ziel: treffer.ziel, agl };
  }

  /** E-31 · „das NÄCHSTE", nicht „das Portal" — Winkelabstand, je Bild neu. Ab Slice E Teil 2
   *  ist das der Eingang der Wegweiser; hier liest es zuerst das Panel. */
  function naechstes(weltPos) {
    if (!portale.length || !weltPos) return null;
    const n = _v1.copy(weltPos).normalize();
    let best = null, bestCos = -2;
    for (const p of portale) {
      const c = n.dot(_v2.copy(p.pos).normalize());
      if (c > bestCos) { bestCos = c; best = p; }
    }
    return { portal: best, bogen: Math.acos(Math.max(-1, Math.min(1, bestCos))) };
  }

  const grad = (r) => +(r * 180 / Math.PI).toFixed(1);

  /** ⚠ Benannt, damit `tor()` den Eigentümer der Größe FRAGEN kann statt sie ein drittes Mal
   *  nachzurechnen (Befund 1.9.: 0,29 gegen 0,25 u in zwei Zeilen desselben Panels). */
  const api = {
    name: 'portals', group, params: P, quelle: PORTAL_QUELLE,
    get enabled() { return P.on; },
    setEnabled(on) { P.on = !!on; group.visible = !!on; },
    update, naechstes,
    /** 1:1 `syncToCarpet` — **die Regel, die dazugehört: wer den Spieler versetzt, meldet es hier.**
     *  Der Trefferest ist ein SEGMENT von der letzten zur jetzigen Position. Nach einem
     *  Ortswechsel, den dieses Modul nicht selbst gemacht hat, wäre dieses Segment ein Strich
     *  über die halbe Kugel — und der schneidet Portalebenen, durch die niemand geflogen ist.
     *  Genau das ist mir im ersten Testflug passiert (Sprung im ERSTEN Bild nach einem
     *  Setz-Befehl): kein Fehler im Test, sondern ein fehlender Eingang. */
    sync(carpet) {
      letzterPos = carpet.worldPos().clone();
      abkuehlung = 0;
      const armSq = PORTAL_QUELLE.armDistance * PORTAL_QUELLE.armDistance;
      for (const p of portale) p.scharf = letzterPos.distanceToSquared(p.pos) > armSq;
    },
    get anzahl() { return portale.length; },
    get orte() { return portale.map((p) => ({ pos: p.pos, farbe: PORTAL_COLORS[p.i % PORTAL_COLORS.length] })); },
    /** E-31 · Anzahl ist ein Parameter — also muss sie sich auch ändern lassen. Neuaufbau statt
     *  Nachjustieren: ein halb umgestelltes Portalfeld wäre zwei Wahrheiten über eine Welt. */
    setAnzahl(n) {
      const z = Math.max(0, Math.min(8, Math.round(n)));
      // ⚠ Verglichen wird mit dem SOLL, nicht mit der Zahl der stehenden Portale: seit eine Welt
      // eine Anfrage ablehnen darf, sind die beiden nicht mehr dasselbe — und ein Vergleich gegen
      // die gesetzten hätte `5 → 4` verschluckt und die Meldung „5 asked, 4 placed" stehen lassen.
      if (z === P.anzahl) return z;
      P.anzahl = z;
      neu();
      return z;
    },
    /** E-32 · „weit entfernt" als Regler — die Ziele werden dabei NEU gesucht, sonst würde die
     *  Zahl im Panel etwas anderes behaupten als die Sprungweite im Bild. */
    setSprungBogen(v) {
      P.sprungBogen = Math.max(0.6, Math.min(2.9, v));
      neu();
      return P.sprungBogen;
    },
    setTrefferFaktor(v) { P.trefferFaktor = Math.max(0.5, Math.min(2.5, v)); },
    /** Halo an/aus (Fernsichtbarkeit) und Ring an/aus (Rahmen des Spieler-Portals). Kein
     *  Neuaufbau nötig: beides sind Sichtbarkeiten an vorhandenen Netzen. */
    setHalo(on) { P.halo = !!on; for (const p of portale) p.visual.setHalo(P.halo); return P.halo; },
    setRing(on) { P.ring = !!on; for (const p of portale) p.visual.setRing(P.ring); return P.ring; },
    /** Bild umschalten — Neuaufbau, weil es zwei verschiedene Objektbäume sind. */
    setBild(v) {
      const b = (v === 'riss') ? 'riss' : 'ring';
      if (b === P.bild) return b;
      P.bild = b; neu(); return b;
    },
    /** Leuchten des Portalinneren. 0 = der gepinnte Quellbaum (dunkler Kern). */
    setKernGlut(v) {
      P.kernGlut = Math.max(0, Math.min(1.5, v));
      for (const p of portale) if (p.visual.setKernGlut) p.visual.setKernGlut(P.kernGlut);
      return P.kernGlut;
    },
    /** Größe. Neuaufbau, weil Geometrie daran hängt — und die Trefferfläche wächst mit. */
    setSkala(v) { P.skala = Math.max(0.5, Math.min(8, v)); neu(); return P.skala; },
    /** ⚠ **Das GEZEICHNETE Maß der aktiven Rolle** — die Zahl, die das Panel-Etikett zweimal
     *  falsch selbst gerechnet hat (Röhre vergessen, Rolle ignoriert). Eine Größe hat einen
     *  Eigentümer; wer sie nachrechnet, rechnet sie irgendwann anders.
     *  `skalaProbe` erlaubt die Vorschau eines Reglerwerts, ohne die Welt neu zu bauen. */
    sichtbar(skalaProbe) {
      const sk = skalaProbe != null ? skalaProbe : P.skala;
      const r = PORTAL_QUELLE.radius * sk, t = PORTAL_QUELLE.tube * sk;
      if (P.bild === 'riss') {
        // `durchmesser = 2·R·1,25·1,25`, dann `rift.scale = durchmesser · 1,5` — die Röhre spielt
        // hier nicht mit, der Riss ist ein Blatt.
        const d = 2 * r * 1.25 * 1.25 * 1.5;
        return { rolle: 'rift sheet', breite: d * PORTAL_QUELLE.ovalX, hoehe: d * PORTAL_QUELLE.ovalY };
      }
      return { rolle: 'ring outer edge',
               breite: 2 * (r + t) * PORTAL_QUELLE.ovalX,
               hoehe: 2 * (r + t) * PORTAL_QUELLE.ovalY };
    },
    /** Zappel des Ovals (beide Achsen, source-Betrag 0,02). Neuaufbau, weil die Amplitude beim
     *  Bau in den Wirker geht. */
    setZappel(v) { P.zappel = Math.max(0, Math.min(0.06, v)); neu(); return P.zappel; },
    /** Nur auf Land? Neuaufbau, weil die Bedingung in die Platzsuche eingeht. Georg, 1.9.: aus. */
    setNurLand(on) { P.nurLand = !!on; neu(); return P.nurLand; },
    /** ⚠ **Die Zahl zu Georgs Befund, und sie ist durchfallbar.** Liest die GEZEICHNETE Skala der
     *  Ovalgruppe ab und vergleicht ihr Seitenverhältnis mit der Sollform 0,65 : 1,25 = 0,520.
     *  Vor dem Fix wanderte es zwischen 0,504 und 0,537 (±3,3 %); ein Faktor auf beide Achsen kann
     *  es rechnerisch nicht mehr verschieben. Gemessen wird das Bild, nicht die Absicht — genau
     *  deshalb hat die alte Fassung den Fehler nicht gefunden: sie hat nie hingesehen. */
    formTor() {
      if (!portale.length) return { idle: true, text: 'idle · 0 portals' };
      const soll = PORTAL_QUELLE.ovalX / PORTAL_QUELLE.ovalY;
      let maxAbw = 0, proben = 0, breiteMin = Infinity, breiteMax = 0;
      for (const p of portale) {
        const s = p.visual.group.children[0];
        if (!s || !s.scale) continue;
        proben++;
        const ist = s.scale.x / s.scale.y;
        const abw = Math.abs(ist - soll) / soll;
        if (abw > maxAbw) maxAbw = abw;
        const b = 2 * (PORTAL_QUELLE.radius * P.skala + PORTAL_QUELLE.tube * P.skala) * s.scale.x;
        if (b < breiteMin) breiteMin = b;
        if (b > breiteMax) breiteMax = b;
      }
      const ok = maxAbw < 0.005;
      // ⚠ **1.9., zweite Runde — Georgs Entscheidung ist „Quelle nachbauen" (§3 Sprintakte).** Das
      // Oval SOLL jetzt wieder verzerren, wörtlich wie `CarpetPortalSystem.ts:210–218`. Ein
      // Wächter, der das als „✗ warping" meldet, färbt eine Designentscheidung rot (§5.7) — also
      // heißt „ok" hier ab jetzt: das Verhalten passt zum GESETZTEN `zappel`, nicht: das Oval
      // steht still. Bei `zappel = 0` MUSS es starr sein; bei `zappel > 0` MUSS es wandern.
      const sollWandern = P.zappel > 0.001;
      const okQuelle = sollWandern ? maxAbw > 0.003 : maxAbw < 0.005;
      return {
        idle: false, ok: okQuelle, proben,
        sollVerhaeltnis: +soll.toFixed(4),
        abweichungProzent: +(maxAbw * 100).toFixed(2),
        breiteMin: +breiteMin.toFixed(4), breiteMax: +breiteMax.toFixed(4),
        zappel: P.zappel,
        text: (okQuelle ? '✓' : '✗') + ' aspect ' + soll.toFixed(3)
          + ' ±' + (maxAbw * 100).toFixed(2) + '% over ' + proben + ' portals'
          + ' · drawn width ' + breiteMin.toFixed(3) + '…' + breiteMax.toFixed(3) + ' u'
          + (sollWandern
              ? ' · warps on purpose (zappel ' + P.zappel.toFixed(3) + ' — CarpetPortalSystem.ts:210–218'
                + ', Georg 1.9.: „Quelle nachbauen")'
              : ' · rigid oval (zappel 0 — the shape-preserving fix, kept as a way back)')
          + (okQuelle ? '' : (sollWandern ? ' — ⚠ not warping as much as the source amplitude implies'
                                          : ' — ⚠ warping when it should be rigid')),
      };
    },
    /**
     * ⚠ **Die durchfallbare Zahl dieses Slice.** Vier Aussagen, die kaputtgehen KÖNNEN:
     *  · Trefferverhältnis gegen die 1,47 der Quelle („forgiving teleports")
     *  · jedes Portal auf LAND und mit freier Unterkante
     *  · Mindestabstand der Portale ≥ 1,2 rad (Quelle)
     *  · jedes Sprungziel ≥ `sprungBogen` entfernt (E-32) und auf Land
     * Ein leerer Eimer ist ein Ergebnis: bei 0 Portalen meldet sie `idle`, nicht „ok".
     */
    tor() {
      if (!portale.length) return { idle: true, text: 'idle · 0 portals (count = 0)' };
      // ⚠ **Quellentreue wird BEI FAKTOR 1 geprüft.** Vorher rechnete diese Zeile den
      // Aufweitungsfaktor mit — und machte damit jeden Reglerwert ≠ 1 zu einem Bruch, obwohl der
      // Regler in der Quelle vorgesehen ist (`upgrades.triggerRadiusMult`). **Eine Zeile, die rot
      // wird, weil man einen vorgesehenen Regler bewegt, erzieht zum Überlesen** — dieselbe
      // Klasse wie `Signpost glow = 0` eine Runde vorher, hier über ein anderes Bedienelement.
      // Der aufgeweitete Zustand wird deshalb BENANNT, nicht bestraft: die Textzeile sagt, um
      // wie viel weiter das Fangvolumen als das Bild ist, und ab wann es von außen greift.
      const f = P.trefferFaktor;
      const verhSeit = achseSeit() / (R() * PORTAL_QUELLE.ovalX) / f;
      const verhHoch = achseHoch() / (R() * PORTAL_QUELLE.ovalY) / f;
      const verh = verhSeit;
      const verhOk = Math.abs(verhSeit - TREFFER) < 0.01 && Math.abs(verhHoch - TREFFER) < 0.01;
      // ⚠ **Zweite Bezugsgröße, seit das Bild der Riss ist:** die 1,47 der Quelle beziehen sich auf
      // den RING (0,15). Sichtbar ist bei einem Weltportal aber der Riss, und der ist ein Vielfaches
      // davon — wer nur die 1,47 nennt, verspricht Großzügigkeit und liefert eine Nadel. Also steht
      // hier auch das Verhältnis zur sichtbaren Rissbreite: waagerecht ≈ 1 (man trifft, was man
      // sieht), senkrecht ≈ 0,5 (die Höhe ist großzügiger gemalt als getroffen).
      const rissHalbBreite = 2.0 * R() * 1.25 * 1.25 * 1.5 * PORTAL_QUELLE.ovalX / 2;
      const rissHalbHoehe = 2.0 * R() * 1.25 * 1.25 * 1.5 * PORTAL_QUELLE.ovalY / 2;
      // ⚠ **Und hier stand die Größe ein DRITTES Mal nachgerechnet — mit derselben fehlenden
      // Röhre wie im Panel-Etikett.** Die Reglerzeile sagte nach dem Fix 0,29 u, diese Torzeile
      // gleichzeitig **0,25 u**: zwei Zeilen desselben Panels, 15 % Unterschied, ein Objekt.
      // Ich hatte den Eigentümer (`sichtbar()`) angelegt und dann nur den einen Leser umgestellt.
      // *Einen Eigentümer einzuführen ist erst fertig, wenn alle Rechner ihn fragen* — sonst hat man
      // die Zahl nicht vereinheitlicht, sondern eine dritte Fassung gebaut.
      const sicht = api.sichtbar();
      let imWasser = 0, ringImBoden = 0, unerreichbar = 0, schlimmsteLuecke = 0;
      // ⚠ **Der Landanteil der WELT als Bezugsgröße.** Ohne ihn ist „4 von 4 im Wasser" nicht von
      // einem Fehler zu unterscheiden — auf einer Welt mit 16 % Land ist es der Erwartungswert.
      // Stichprobe über ein grobes Kugelgitter, 512 Punkte: genug für eine Verhältniszahl, zu wenig
      // für eine Behauptung über einzelne Orte — deshalb steht sie nur im Text, nicht im Urteil.
      let landProben = 0;
      for (let i = 0; i < 512; i++) {
        const y = 1 - (2 * i + 1) / 512;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const th = i * 2.39996323;
        if (isLand(seed, terrainType, Math.cos(th) * r, y, Math.sin(th) * r)) landProben++;
      }
      const landAnteil = landProben / 512;
      for (const p of portale) {
        const fr = tangentFrame(p.q);
      if (!isLand(seed, terrainType, fr.up.x, fr.up.y, fr.up.z)) imWasser++;
        const grund = surfaceAltitudeAt(seed, terrainType, fr.up.x, fr.up.y, fr.up.z);
        const tief = (grund) - (p.alt - (R() * PORTAL_QUELLE.ovalY + T()));
        if (tief > 0) ringImBoden = Math.max(ringImBoden, tief);
        // **Die Zahl, die den Anlauf gefunden hätte:** senkrechter Abstand der Portalmitte von der
        // Reiseflughöhe (Grund + Schwebehöhe) gegen den Trefferradius. Ist die Lücke größer, kann
        // man im Reiseflug NICHT durch — und ein Portal, das man nur mit gehaltener Leertaste
        // trifft, ist kein Portal, sondern ein Gerücht.
        const luecke = Math.abs(p.alt - (grund + CARPET_HOVER_HEIGHT));
        if (luecke > schlimmsteLuecke) schlimmsteLuecke = luecke;
        // Verglichen wird mit der RADIALEN Halbachse — die Lücke ist eine Höhendifferenz, und seit
        // die Trefferfläche eine Ellipse ist, gibt es für Höhe und Breite zwei verschiedene Zahlen.
        if (luecke > achseHoch()) unerreichbar++;
      }
      let minAbstand = Math.PI;
      for (let a = 0; a < portale.length; a++) {
        for (let b = a + 1; b < portale.length; b++) {
          const c = _v1.copy(portale[a].pos).normalize().dot(_v2.copy(portale[b].pos).normalize());
          const w = Math.acos(Math.max(-1, Math.min(1, c)));
          if (w < minAbstand) minAbstand = w;
        }
      }
      const abstandOk = portale.length < 2 || minAbstand >= PORTAL_QUELLE.mindestAbstand - 1e-3;
      // **Die Zahl gegen den Float32-Fehler.** `uTime` ist ein float32; die Auflösung an der Stelle
      // `x` ist ~`x · 1,2·10⁻⁷`. Damit ein Sinus mit Faktor 25 pro Bild noch gleichmäßig läuft, darf
      // ein Schritt deutlich unter der Bildänderung liegen — Grenze 4000 (Auflösung dort ~0,0005,
      // also 60× feiner als das, was ein Bild bewegt).
      let maxPhase = 0;
      for (const p of portale) if (p.phase > maxPhase) maxPhase = p.phase;
      const phaseOk = maxPhase < 4000;
      let zielKurz = 0, zielWasser = 0, zielMin = Math.PI;
      for (const p of portale) {
        if (p.ziel.bogen < P.sprungBogen - 1e-3) zielKurz++;
        if (p.ziel.aufWasser) zielWasser++;
        if (p.ziel.bogen < zielMin) zielMin = p.ziel.bogen;
      }
      const ok = verhOk && unerreichbar === 0 && abstandOk && zielKurz === 0 && phaseOk;
      return {
        idle: false, ok,
        portale: portale.length,
        trefferVerhaeltnis: +verhSeit.toFixed(3),   // gegen die sichtbare Halbbreite, OHNE Faktor
        trefferFaktor: f,
        trefferRadius: +trigger().toFixed(3),
        trefferSeitlich: +achseSeit().toFixed(3), trefferHoch: +achseHoch().toFixed(3),
        sichtbareHalbbreite: +(sicht.breite / 2).toFixed(3),
        sichtbareHalbhoehe: +(sicht.hoehe / 2).toFixed(3),
        sichtbarerRadius: +R().toFixed(3),
        rissBreite: +(rissHalbBreite * 2).toFixed(3), rissHoehe: +(rissHalbHoehe * 2).toFixed(3),
        imWasser, unerreichbar, landAnteil: +(landAnteil * 100).toFixed(1),
        luecke: +schlimmsteLuecke.toFixed(3),
        ringImBoden: +ringImBoden.toFixed(3),
        minAbstandGrad: portale.length > 1 ? grad(minAbstand) : null,
        zielMinGrad: grad(zielMin), zielKurz, zielWasser,
        ersatzOrte: stat.keinPlatz,
        angefordert: P.anzahl, gesetzt: portale.length,
        bild: P.bild,
        maxPhase: +maxPhase.toFixed(2),
        text: (ok ? '✓' : '⚠')
          + ' ' + (P.bild === 'riss' ? 'RIFT image (world/deck transition — not a portal)' : 'ring image (portal in this world)')
          + ' · ' + (P.bild === 'riss'
              ? sicht.breite.toFixed(2) + ' × ' + sicht.hoehe.toFixed(2) + ' u rift'
              : sicht.breite.toFixed(2) + ' × ' + sicht.hoehe.toFixed(2) + ' u ring ('
                + (sicht.breite / 0.35).toFixed(1) + '× the carpet width)')
          + ' · hit ' + TREFFER.toFixed(2) + '× the visible oval as an ellipse (source 1.47) — '
          + achseSeit().toFixed(3) + ' u sideways, ' + achseHoch().toFixed(3) + ' u vertically'
          + (Math.abs(f - 1) > 0.01
              ? ' · widened ' + f.toFixed(2) + '× by the upgrade knob → ' + (TREFFER * f).toFixed(2)
                + '× the image' + (TREFFER * f > 2 ? ' (⚠ grabs from outside)' : '')
              : '')
          + ' · ' + portale.length + ' portals, '
          + (imWasser
              ? imWasser + ' over water (allowed since 1.9.; this world is '
                + (landAnteil * 100).toFixed(0) + ' % land, so ' + (4 - landAnteil * 4).toFixed(1)
                + ' of 4 would be expected without the land preference)'
              : 'all on land')
          + ' · centre ' + schlimmsteLuecke.toFixed(3) + ' u above the cruise line vs hit half-height '
          + achseHoch().toFixed(3) + (unerreichbar ? ' — ⚠ ' + unerreichbar + ' UNREACHABLE at hover height' : ' — reachable')
          + (portale.length > 1 ? ' · min sep ' + grad(minAbstand) + '° (source ≥ 68.8°)' : '')
          + ' · jump ' + grad(zielMin) + '° min (E-32 ≥ ' + grad(P.sprungBogen) + '°)'
          + (zielKurz ? ' ⚠ ' + zielKurz + ' TOO SHORT' : '')
          + (zielWasser ? ' · ' + zielWasser + ' land in water' : '')
          + ' · rim ' + ringImBoden.toFixed(3) + ' u into the ground'
          + (P.bild === 'riss' ? ' (a rift grows OUT of the terrain — source does the same)'
                               : (ringImBoden > 0.01 ? ' ⚠ a RING must stand clear (placePortal)'
                                                     : ' · bottom edge clear, as placePortal demands'))
          + (stat.streuung ? ' · sites from the ONE scatter layer (v11): ' + stat.streuung.gesetzt + '/' + stat.streuung.gesucht + ' placed, ' + stat.streuung.nachgerueckt + ' relocated' : ' · own random (fallback)')
          + (stat.keinPlatz
              ? ' · ' + P.anzahl + ' asked, ' + portale.length + ' placed — this world has no room at '
                + PORTAL_QUELLE.mindestAbstand + ' rad separation'
              : '')
          + ' · shader phase ' + maxPhase.toFixed(1)
          + (phaseOk ? ' (float32-safe, < 4000)' : ' ⚠ TOO LARGE — sway and sparkle will step, not run'),
      };
    },
    /** ⚠ **Kontrollprobe der Trefferfläche — ohne den Spieler zu bewegen.** Der Segment-Test ist
     *  die Stelle, an der ein Portal stumm kaputtgeht: eine verdrehte Basis, ein Vorzeichen, ein
     *  Radius im falschen Maß, und man fliegt hindurch, ohne dass etwas passiert — sichtbar erst
     *  daran, dass NICHTS zu sehen ist. Deshalb vier Sätze, davon einer, der durchfallen MUSS,
     *  wenn der Test zu gutmütig ist (105 % der Trefferfläche darf nicht treffen). */
    selbsttest(camera) {
      const z = [];
      if (!portale.length) { z.push('— idle: 0 portals, nothing to test'); return z; }
      if (!camera) { z.push('✗ no camera passed — no pose, no test'); return z; }
      const p = portale[0];
      stellen(p, camera);
      const radUp = p.pos.clone().normalize();
      const achse1 = new THREE.Vector3().crossVectors(radUp, new THREE.Vector3(0, 1, 0));
      if (achse1.lengthSq() < 1e-6) achse1.set(1, 0, 0);
      achse1.normalize();
      const achse2 = new THREE.Vector3().crossVectors(radUp, achse1).normalize();
      const durch = (richtung, seitlich, laenge) => {
        const seit = new THREE.Vector3().crossVectors(radUp, richtung).normalize();
        const s = p.pos.clone().addScaledVector(richtung, -(laenge || 0.3)).addScaledVector(seit, seitlich);
        const e = p.pos.clone().addScaledVector(richtung, (laenge || 0.3)).addScaledVector(seit, seitlich);
        return schnitt(s, e, p) != null;
      };
      // Geprüft wird gegen die SEITLICHE Halbachse — die schmale. Der frühere Test nahm die große
      // Zahl und war damit blind für genau den Fehler, den die Abnahme gefunden hat: seitlich
      // vorbeifliegen und trotzdem gegriffen werden.
      const as = achseSeit(), sicht = R() * PORTAL_QUELLE.ovalX;
      z.push((durch(achse1, 0) ? '✓' : '✗') + ' straight through the middle hits');
      z.push((durch(achse2, 0) ? '✓' : '✗') + ' through from 90° hits TOO (seam 4)');
      z.push((durch(achse1, as * 0.95) ? '✓' : '✗') + ' 95 % of the sideways half-axis hits ('
             + (as * 0.95).toFixed(3) + ' u)');
      z.push((!durch(achse1, as * 1.05) ? '✓' : '✗') + ' 105 % does NOT hit — control probe ('
             + (as * 1.05).toFixed(3) + ' u)');
      z.push((!durch(achse1, sicht * 2.2) ? '✓' : '✗') + ' passing 2.2× outside the VISIBLE oval '
             + 'misses (' + (sicht * 2.2).toFixed(3) + ' u — the 30 Aug finding)');
      // Kontrollprobe der Kontrollprobe: ein Segment, das VOR dem Portal endet, ist eine
      // Annäherung und kein Durchflug — `t ∈ [0,1]` muss es abweisen.
      const s2 = p.pos.clone().addScaledVector(achse1, -0.9);
      const e2 = p.pos.clone().addScaledVector(achse1, -0.4);
      z.push((schnitt(s2, e2, p) == null ? '✓' : '✗') + ' approach without passing through misses');
      return z;
    },
    /** ⚠ **Die Zahl gegen „überstrahlt" — GERECHNET, nicht gerendert.** Georg, 31.8.: *„portale
     *  wirken teilweise überstrahlt"*. Ursache war eine Summe: vier additive Schichten, von denen
     *  die Quelle zwei hat. Additiv heißt, dass sich die Beiträge im Zentrum ADDIEREN — und alles
     *  über 1,0 klippt auf Weiß, wodurch Farbe und Silhouette verschwinden.
     *  Gerechnet statt gemessen, aus zwei Gründen: eine Pixelprobe braucht ein RenderTarget (teuer,
     *  und auf dem Default-Framebuffer liest sie das falsche Bild — Nachtrag 11), und die Summe
     *  hängt nur an Reglern, die hier alle bekannt sind. Ein Wert > 1,0 ist ein Befund, kein
     *  Geschmack. */
    strahlung() {
      // ⚠ **Zweite Fassung, und die erste war derselbe Fehler wie Nachtrag 12: sie zählte
      // Schichten an einer Stelle, an der sie nicht liegen.** Sie addierte die beiden Wirbel-Tori
      // (0,42) in die MITTENsumme — aber `swirl`/`swirl2` sind Tori bei r ≈ 0,95/0,98 R, im Zentrum
      // ist dort keine Geometrie. Dafür fehlte ihr die `glow`-SCHEIBE (`CircleGeometry(R·1,3)`,
      // Deckkraft 0,35), die das Zentrum tatsächlich abdeckt. Also: 0,42 zu viel gezählt, 0,35 zu
      // wenig — die Zahl war fast richtig und trotzdem aus falschen Teilen gebaut.
      // (Gefunden von der Abnahme, die die Geometrie geprüft hat statt den Wert.)
      //
      // Deshalb nennt sie jetzt ZWEI Zonen, weil ein Portal zwei helle Orte hat:
      //  · **Fläche** (r → 0): Schein-Sprite + Kernglut + glow-Scheibe. Das ist das, was Georg als
      //    „überstrahlt" gesehen hat — ein weißes OVAL, keine weiße Kante. Muss ≤ 1,0 bleiben.
      //  · **Kante** (r → 1): Ring + zwei Wirbel + `pow(r,8)`. Die klippt ABSICHTLICH, und das ist
      //    die Quelle: `finalColor += vec3(1.0) * pow(r, 8.0)` — weißglühender Rand. Wird genannt,
      //    nicht bewertet. **Ein Wächter, der den gewollten Zustand rot meldet, erzieht zum
      //    Überlesen** (dieselbe Regel wie beim `Signpost glow = 0`).
      const f = P.kernGlut;
      const schein = (P.halo ? 0.26 : 0) * 0.9;          // Sprite-Deckkraft × Gradient in der Mitte
      const glut = f * 0.85 * 0.78;                       // uColor·0,72 + 0,06, bei centerDarkness 0
      const glowScheibe = P.bild === 'ring' ? 0.22 : 0;   // CircleGeometry(R·1,3), deckt die Mitte
      const flaeche = schein + glut + glowScheibe;
      // Kante: die Linienbeiträge, nur zur Information.
      const kante = P.bild === 'ring' ? 0.95 + 0.7 + 0.6 + glowScheibe + 1.0 : 0;
      const ok = flaeche <= 1.0;
      return { ok, summe: +flaeche.toFixed(2), kante: +kante.toFixed(2),
               anteile: { schein: +schein.toFixed(2), kernGlut: +glut.toFixed(2),
                          glowScheibe: +glowScheibe.toFixed(2) },
               text: (ok ? '✓' : '⚠') + ' additive load over the FACE ' + flaeche.toFixed(2)
                 + (ok ? ' (≤ 1.00, keeps its colour)' : ' — OVER 1.00, CLIPS TO WHITE')
                 + ' · core glow ' + glut.toFixed(2) + ' + halo ' + schein.toFixed(2)
                 + ' + glow disc ' + glowScheibe.toFixed(2)
                 + (kante ? ' · rim ' + kante.toFixed(2) + ' — clips on PURPOSE (source: += vec3(1.0)·pow(r,8))'
                          : '')
                 + ' · the swirls are rings at 0.96 R and contribute nothing here' };
    },
    report() {
      return { an: P.on, portale: portale.length, anzahlSoll: P.anzahl,
               keinPlatz: stat.keinPlatz,
               spruenge: stat.spruenge,
               letzterSprungGrad: stat.letzterBogen ? grad(stat.letzterBogen) : null,
               letzteAnkunftAgl: +stat.letzteAnkunftAgl.toFixed(3),
               trefferRadius: +trigger().toFixed(3),
               trefferSeitlich: +achseSeit().toFixed(3), trefferHoch: +achseHoch().toFixed(3),
               drawCalls: group.children.length * 6,
               abkuehlung: +abkuehlung.toFixed(2) };
    },
    dispose() { for (const p of portale) p.visual.dispose(); portale.length = 0; group.removeFromParent(); },
  };
  return api;
}
