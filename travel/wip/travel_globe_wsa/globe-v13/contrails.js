// ============================================================================
// contrails.js — v13 · COMIC-SPEEDLINES am Fahrzeug (Herkunft: tinyskies `Contrails.ts`)
// ----------------------------------------------------------------------------
// Quelle: georg-doc/tinyskies, `client/src/game/Contrails.ts` (gelesen 3.9.2026, Tree 2659a5cc987d).
// TRAIL_LENGTH 72, eisblaue Tönung (0.9, 0.95, 1.0), additiv, premultipliedAlpha, toneMapped false,
// Band-Aufbau (Punkt-Ring, `_cross` aus Fahrtrichtung × Blick zur Kamera, Fallback (0,1,0))
// zeichengleich — derselbe Kniff wie in `carpet-trail.js`, nur länger, dünner, kälter.
//
// **Was das Ding IST (Georg, 3.9.): „das sind doch quasi (comic) speedlines → also müssen sie von dem
// object/card ausgehen!"** Das ist nicht Kosmetik, das ist die Bauvorschrift. Ein Kondensstreifen ist
// ein Objekt der LUFT: er hängt an einem Ort, den das Fahrzeug irgendwann hatte, und darf ruhig
// abgerissen sein. Eine Comic-Speedline ist ein Objekt des FAHRZEUGS: sie geht von der Karte aus,
// immer, sichtbar verbunden. Der Unterschied entscheidet, wo der Kopf des Bandes wohnt — und daran
// sind zwei Fassungen gescheitert.
//
// **Der Anker gehört in die gezeichnete Karte, nicht in eine Parallelrechnung.** ⚠⚠⚠ Zwei Fassungen
// haben die Ansatzpunkte aus `carpet-mesh.js` gerechnet (Teppichkörper: `bodyW = s·2,8` = 0,07,
// `bodyLen = s·3,6` = 0,09, Hinterkante 0,045). Gezeichnet wird aber der **CardCarrier**:
// `CW = 3.0`, `CD = CW·447/800 = 1.676`, Gruppenskala `0.075/3.0 = 0.025` — die Karte ist in
// Weltmaß **0,075 breit und 0,042 TIEF**, ihre Hinterkante liegt bei **0,021**. Ein `offZ` von 0,045
// bzw. 0,036 lag also 0,024 bzw. 0,015 u HINTER dem Blech, in der freien Luft. Genau die Lücke, die
// Georg zweimal fotografiert hat. *Es waren nie falsche Zahlen, es war die falsche Quelle: zwei
// Fahrzeugmeshes im Projekt, und ich habe das gelesen, das nicht gezeichnet wird.*
// Konsequenz, und das ist die eigentliche Reparatur: **die Anker sind jetzt zwei `Object3D` IN der
// Karte** (`anchorTo(carrier.seat.parent, ...)`, Maße aus `carrier.halfW/halfD`). Damit erben sie
// Skala, Lage, Lean-Federn, Bob und Wellenschlag der gezeichneten Karte, und eine Lücke ist
// konstruktiv unmöglich — keine Zahl kann mehr driften, weil keine Zahl mehr abgeschrieben wird.
// Die Literale unten sind nur noch der Notnagel, falls kein Anker gesetzt wird.
//
// **Bremsen: keine leuchtenden Knöpfe mehr (Georg, 3.9.: „nicht als kleine Kreise enden, die sich mit
// den gelben Speedlines überlagern und dann heller werden").** Die Ursache ist die Quelle selbst:
// sie schiebt JEDES Bild einen Stützpunkt nach. Steht das Fahrzeug, liegen 72 Stützpunkte auf einem
// Fleck — 72 additive Vierecke übereinander, und additiv heißt addieren: ein Knopf, der mit jedem
// Bild heller wird. **Und nein, bei tinyskies passiert das nicht — nicht weil es dort gelöst ist,
// sondern weil es dort nicht vorkommt: der Doppeldecker hat keine Bremse und kein Schweben, seine
// Geschwindigkeit erreicht nie null.** Die Quelle hat deshalb keinen Tempo-Term; wir brauchen einen.
// Zwei Zeilen, beide deklariert:
//   1. **Mindestschritt.** Ein neuer Stützpunkt entsteht nur, wenn der Anker sich um `minSchritt`
//      bewegt hat. Sonst wird der KOPF nachgezogen — das Band bleibt an der Karte, stapelt aber nicht.
//   2. **Tempo-Blende + Einzug.** Alpha × `smoothstep(tempoAus … tempoVoll)`; unter der Schwelle
//      fällt zusätzlich pro Bild ein Stützpunkt vom Ende weg. Die Speedlines ziehen sich also in die
//      Karte zurück, statt als Fleck stehenzubleiben. Comic-Logik: keine Bewegung, keine Striche.
//
// **Vierte Abweichung, deklariert — kein Tiefentest.** Die Quelle testet Tiefe (Standard). Bei uns
// schnitten Baumkronen und Hänge die Bänder ab (Georg: „von Gelände überlagert/durchstochen") —
// die Bänder liegen auf Flughöhe 0,20 u, die ts-flora-Bäume reichen dorthin. `depthTest: false`,
// renderOrder 6 (über Gelände und Flora, unter der Lavafahne 10/11).
//
// **Dezenter und schmaler (Georg, 3.9.).** Breite 0,005 → 0,0034, Alpha-Gain 0,55 → 0,33: die Quelle
// fliegt gegen hellen Himmel, wir ziehen Striche über dunkles Gelände, wo additives Weiß doppelt so
// laut liest. `?contrails=0` schaltet ab.
// ============================================================================

export const CONTRAILS_QUELLE = Object.freeze({
  length: 72,
  width: 0.0034,   // Quelle 0.005 — ein Drittel schmaler (Georg, 3.9.)
  alphaGain: 0.33, // Quelle 0.55 — dezenter über dunklem Gelände (Georg, 3.9.)
  tint: [0.9, 0.95, 1.0],
  minSchritt: 0.0035,  // kein neuer Stützpunkt unter diesem Weg — gegen den additiven Knopf
  // Blende über die ABSOLUTE Fahrt (u/s), nicht über `speedRatio`. Grund: die Reisefahrt liegt auf
  // dem Tempoboden 0,28, und `speedRatio` misst gegen das Maximum 0,78 — auf dem Boden ist das
  // Verhältnis **0,00**, genau wie im Stand. Eine Blende auf `speedRatio` hätte die Striche also
  // nicht nur beim Bremsen, sondern in der ganzen normalen Fahrt gelöscht: sichtbar nur, solange man
  // W hält. *Wer Bewegung meint, muss Bewegung messen, nicht Ausnutzung des Spielraums.*
  // 0,08 → 0,22 liegt damit UNTER dem Reiseboden: bei 0,28 stehen die Striche voll, und nur
  // Schweben (H) und echter Stillstand ziehen sie ein.
  tempoAus: 0.08, tempoVoll: 0.22,
  // NOTNAGEL, falls `anchorTo` nicht gerufen wird. Maße der GEZEICHNETEN Karte (CardCarrier):
  // halbe Breite 0,0375, halbe Tiefe 0,0209 — also knapp innen und unten an der Hinterkante.
  offX: 0.030, offY: -0.003, offZ: 0.017,
});

const ABWEICHUNGEN = Object.freeze([
  'Ansatzpunkte sind zwei Object3D IN der gezeichneten Karte (anchorTo) statt Flügelspitzen einer Parallelrechnung — anderes Fahrzeug, und nur so kann keine Lücke entstehen',
  'Mindestschritt + Tempo-Blende + Einzug bei echtem Stillstand — die Quelle braucht das nicht, ihr Doppeldecker wird nie langsam; unser Teppich bremst und schwebt. Gemessen wird die absolute Fahrt, nicht `speedRatio`: die Reisefahrt liegt auf dem Tempoboden und hätte dort das Verhältnis 0',
  'Breite 0,0034 statt 0,005 und Alpha-Gain 0,33 statt 0,55 — additives Weiß über dunklem Gelände liest lauter als über Himmel',
  'depthTest false + renderOrder 6 — Baumkronen und Hänge zerhackten die Bänder auf Flughöhe',
  'Sichtbarkeit folgt der Avatar-Sicht (POV-Blende) wie carpet-trail — die Quelle kennt keine Ich-Sicht',
]);

export function createContrails(THREE, opts = {}) {
  const P = Object.assign({}, CONTRAILS_QUELLE, opts.params || {});
  const TRAIL_LENGTH = P.length, WIDTH = P.width;

  const vert = `
attribute float alpha;
varying float vAlpha;
void main() {
  vAlpha = alpha;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
  const frag = `
uniform vec3 uTint;
varying float vAlpha;
void main() {
  vec3 color = uTint * vAlpha;
  gl_FragColor = vec4(color, 1.0);
}`;

  const _dir = new THREE.Vector3(), _toCamera = new THREE.Vector3();
  const _cross = new THREE.Vector3(), _fallback = new THREE.Vector3(0, 1, 0);
  const tintU = { value: new THREE.Vector3(...P.tint) };

  function makeTrail() {
    const vertCount = TRAIL_LENGTH * 2;
    const posAttr = new THREE.BufferAttribute(new Float32Array(vertCount * 3), 3);
    const alphaAttr = new THREE.BufferAttribute(new Float32Array(vertCount), 1);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', posAttr);
    geometry.setAttribute('alpha', alphaAttr);
    const indices = [];
    for (let i = 0; i < TRAIL_LENGTH - 1; i++) {
      const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
      indices.push(a, c, b, b, c, d);
    }
    geometry.setIndex(indices);
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert, fragmentShader: frag, uniforms: { uTint: tintU },
      transparent: true, depthWrite: false, depthTest: false, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, premultipliedAlpha: true, toneMapped: false,
    });
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.frustumCulled = false;
    mesh.renderOrder = 6;
    mesh.name = 'contrail';
    const points = [], lastCross = new THREE.Vector3(0, 1, 0);
    const MIN2 = P.minSchritt * P.minSchritt;

    function update(worldPos, cameraPos, blende) {
      // **Der Kopf wohnt AN der Karte** (Speedline, nicht Kondensstreifen): entweder als neuer
      // Stützpunkt, oder — wenn der Weg zu kurz war — indem der vorhandene Kopf nachgezogen wird.
      // Das ist die Zeile, die den additiven Knopf beim Bremsen verhindert.
      const kopf = points[0];
      if (!kopf) points.unshift(worldPos.clone());
      else if (kopf.distanceToSquared(worldPos) >= MIN2) {
        points.unshift(worldPos.clone());
        if (points.length > TRAIL_LENGTH) points.length = TRAIL_LENGTH;
      } else kopf.copy(worldPos);
      // Unter der Tempo-Schwelle ziehen sich die Striche in die Karte zurück, statt stehenzubleiben.
      if (blende <= 0.01 && points.length > 1) points.length = points.length - 1;
      const positions = posAttr.array, alphas = alphaAttr.array, count = points.length;
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const p = points[i];
        if (!p) {
          positions[i * 6] = positions[i * 6 + 1] = positions[i * 6 + 2] = 0;
          positions[i * 6 + 3] = positions[i * 6 + 4] = positions[i * 6 + 5] = 0;
          alphas[i * 2] = alphas[i * 2 + 1] = 0;
          continue;
        }
        const prevIdx = Math.max(i - 1, 0), nextIdx = Math.min(i + 1, count - 1);
        _dir.subVectors(points[prevIdx], points[nextIdx]);
        if (_dir.lengthSq() < 1e-10) {
          _cross.copy(lastCross);
        } else {
          _dir.normalize();
          _toCamera.subVectors(cameraPos, p).normalize();
          _cross.crossVectors(_dir, _toCamera);
          if (_cross.lengthSq() < 1e-10) _cross.crossVectors(_dir, _fallback);
          _cross.normalize();
          lastCross.copy(_cross);
        }
        const fade = 1 - i / TRAIL_LENGTH;
        const w = WIDTH * fade;
        positions[i * 6]     = p.x + _cross.x * w;
        positions[i * 6 + 1] = p.y + _cross.y * w;
        positions[i * 6 + 2] = p.z + _cross.z * w;
        positions[i * 6 + 3] = p.x - _cross.x * w;
        positions[i * 6 + 4] = p.y - _cross.y * w;
        positions[i * 6 + 5] = p.z - _cross.z * w;
        const a = fade * fade * P.alphaGain * blende;
        alphas[i * 2] = alphas[i * 2 + 1] = a;
      }
      posAttr.needsUpdate = true;
      alphaAttr.needsUpdate = true;
    }
    function reset() { points.length = 0; }
    return { mesh, update, reset, get count() { return points.length; },
             dispose() { geometry.dispose(); mat.dispose(); } };
  }

  const group = new THREE.Group();
  group.name = 'contrails';
  const links = makeTrail(), rechts = makeTrail();
  group.add(links.mesh, rechts.mesh);

  const offL = new THREE.Vector3(-P.offX, P.offY, P.offZ), offR = new THREE.Vector3(P.offX, P.offY, P.offZ);
  const _l = new THREE.Vector3(), _r = new THREE.Vector3(), _cam = new THREE.Vector3();
  let frames = 0, ankerL = null, ankerR = null, ankerWo = '—', blende = 0, anGeschaltet = true;
  let ankerX = 0, ankerZ = 0, ankerY = 0, leseFlaeche = null;
  const smoothstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a || 1))); return t * t * (3 - 2 * t); };

  return {
    name: 'contrails', group, params: P, quelle: CONTRAILS_QUELLE, abweichungen: ABWEICHUNGEN,
    /** **Die Reparatur der Lücke**: zwei Anker IN der gezeichneten Karte statt Zahlen daneben.
     *  `eltern` ist der Knoten, der die Karte trägt (`carrier.lean` — inklusive Federn, Bob und
     *  Wellenschlag); `halbBreite`/`halbTiefe` sind die NATIVEN Maße des Rigs (`carrier.halfW/halfD`),
     *  nicht Weltmaß — die Skala erbt der Anker vom Elternknoten.
     *  `flaeche` ist optional `carrier.surfaceAt(x, z)`: dann folgt der Anker der VERFORMTEN Karte,
     *  nicht ihrer Mittelebene. Das ist an den Hinterecken der Unterschied, auf den es ankommt —
     *  dort ist der Wellenschlag am größten (`0,35 + |w|`), und dort setzt der Strich an.
     *  *Die verformte Geometrie ist die Wahrheit über die Fläche* (dieselbe Regel, die im
     *  `card-carrier` über `plantSeat` steht — der Sitz des Pets hängt an genau diesem Satz). */
    anchorTo(eltern, halbBreite, halbTiefe, flaeche) {
      if (!eltern || !(halbBreite > 0)) return false;
      // ⚠⚠⚠ **Hier stand die Zuweisung IM KOMMENTAR.** Ein vorheriger Edit hat literale
      // Backslash-n in die Zeile geschrieben; damit war alles bis zum Zeilenende Kommentar —
      // `ankerX/Y/Z` blieben 0, und die beiden Striche saßen in der KARTENMITTE, unter dem Pet.
      // Genau das hat Georg gesehen („der mittlere Strahl … zwischen den Beinen des Pet“), und es
      // waren die ganze Zeit zwei Layer — sie lagen nur aufeinander.
      // *Eine auskommentierte Zuweisung ist kein Fehler, den man sieht: sie ist eine Null, die
      // sich als Absicht ausgibt.* Deshalb nennt die Torzeile unten die Zahl, statt sie zu glauben.
      //
      // Die Werte: 0,96 = knapp innerhalb der Tuschekante, also an den HINTEREN ECKEN der Karte
      // und weit auseinander (eine Speedline geht an der Kante ab, nicht unter dem Bauch);
      // −0,02 nativ = ein Haar unter der Oberseite, noch innerhalb der Plattendicke (`TH` 0,055).
      ankerX = halbBreite * 0.96;
      ankerZ = halbTiefe * 0.96;
      ankerY = -0.02;
      leseFlaeche = typeof flaeche === 'function' ? flaeche : null;
      ankerL = new THREE.Object3D(); ankerL.name = 'contrailAnkerL'; ankerL.position.set(-ankerX, ankerY, ankerZ);
      ankerR = new THREE.Object3D(); ankerR.name = 'contrailAnkerR'; ankerR.position.set(ankerX, ankerY, ankerZ);
      eltern.add(ankerL); eltern.add(ankerR);
      ankerWo = 'in the drawn card (' + (eltern.name || 'lean') + '), ±' + ankerX.toFixed(2) + ' / '
        + ankerZ.toFixed(2) + ' native' + (leseFlaeche ? ', riding the DEFORMED surface' : ', mid-plane');
      return true;
    },
    /** Quelle: `update(planeMatrix, camera)`. `tempo` ist unsere Zutat: die ABSOLUTE Fahrt in u/s
     *  (nicht `speedRatio` — der ist auf dem Reiseboden 0, s. Kopf). */
    update(matrix, camera, tempo) {
      blende = tempo == null ? 1 : smoothstep(P.tempoAus, P.tempoVoll, tempo);
      if (ankerL) {
        if (leseFlaeche) {
          // Jeden Frame die Kartenfläche an DIESEM Ort ablesen — nach `sync`, das sie verformt hat.
          ankerL.position.y = leseFlaeche(-ankerX, ankerZ, null) + ankerY;
          ankerR.position.y = leseFlaeche(ankerX, ankerZ, null) + ankerY;
        }
        ankerL.getWorldPosition(_l); ankerR.getWorldPosition(_r);
      } else { _l.copy(offL).applyMatrix4(matrix); _r.copy(offR).applyMatrix4(matrix); }
      camera.getWorldPosition(_cam);
      links.update(_l, _cam, blende); rechts.update(_r, _cam, blende);
      frames++;
    },
    /** Beim Respawn/Teleport leeren, sonst zieht ein Band quer durch die Welt zum neuen Ort. */
    reset() { links.reset(); rechts.reset(); },
    setEnabled(on) { anGeschaltet = !!on; group.visible = anGeschaltet; },
    get enabled() { return anGeschaltet; },
    /** **Die POV-Blende darf den EIN/AUS-Schalter nicht überschreiben.** `enabled` war früher ein
     *  Lesefenster auf `group.visible` — wer die Sichtbarkeit für die Ich-Sicht schrieb, hätte damit
     *  `?contrails=0` gelöscht, und der Effekt wäre nie wiedergekommen. Zwei Fragen, zwei Speicher:
     *  `anGeschaltet` ist der Schalter, `group.visible` ist das Bild. */
    setVisible(on) { group.visible = anGeschaltet && !!on; },
    tor() {
      // Die Torzeile prüft die ZAHL, nicht die Absicht: `ankerX > 0` fällt auf, wenn die
      // Zuweisung wieder im Kommentar landet (3.9., einmal passiert, einmal zu oft).
      // ⚠ Und sie darf einen EINGEZOGENEN Zustand nicht als Fehler melden: im Schweben ist ein
      // Band von einem Punkt das RICHTIGE Ergebnis. Ein Instrument, das den gesunden Standardfall
      // als Warnung anzeigt, erzieht dazu, es zu ignorieren.
      const ok = frames > 0 && !!ankerL && ankerX > 0 && (blende <= 0.01 || links.count > 1);
      const zustand = blende <= 0.01 ? 'retracted (hover/stop — correct)' : links.count + '/' + TRAIL_LENGTH + ' points';
      const text = (ok ? '✓' : (frames ? '⚠' : '✗')) + ' two comic speedlines · ' + zustand
        + ' · width ' + WIDTH + ' (source 0.005) · alpha fade²·' + P.alphaGain + ' (source 0.55) × speed fade '
        + blende.toFixed(2) + ' (absolute u/s, ramp ' + P.tempoAus + '–' + P.tempoVoll + ', cruise floor 0.28 is above it)'
        + ' · anchors ' + ankerWo
        + ' · min step ' + P.minSchritt + ' u (no additive pile-up when braking) · no depth test (declared; source tests)';
      return { ok, text, frames, punkte: links.count, anker: !!ankerL, blende };
    },
    dispose() { links.dispose(); rechts.dispose(); },
  };
}
