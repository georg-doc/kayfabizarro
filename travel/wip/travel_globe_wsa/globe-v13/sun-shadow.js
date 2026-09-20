// ============================================================================
// sun-shadow.js — v9 · Der ECHTE Schatten der Quelle, nachgebaut
// ----------------------------------------------------------------------------
// **Zuerst die Korrektur, weil sie teuer war.** `card-shadow.js` trägt seit 30.8. die Notiz:
// die Quelle habe *keinen* sichtbaren Schatten, weil ihre Schattenkamera ±22 Weltunits groß sei
// (Globusradius 5) — bei 2048 px also ~0,021 u je Texel, und der Teppich (0,075 u) läge unter
// vier Texeln. Diese Rechnung war richtig und die Schlussfolgerung falsch, weil ich nur den
// KONSTRUKTOR gelesen habe. `Game.ts` ändert dieselbe Kamera je Bild (Zeilen 3164–3170):
//
//     this.sunLight.target.position.copy(_shadowPlayerPos);
//     this.sunLight.target.updateMatrixWorld();
//     this.sunLight.shadow.camera.left   = -5;  … right/top/bottom = ±5
//     this.sunLight.shadow.camera.updateProjectionMatrix();
//
// Das Ziel der Sonne FOLGT dem Spieler, und die Box schrumpft auf ±5. Damit deckt die Karte
// 10 × 10 u um das Fahrzeug: bei 2048 px **0,0049 u je Texel**, der Teppich also ~15 Texel —
// weich (VSM, `radius 2.5`, `blurSamples 12`), lichtabhängig und leicht versetzt. Genau das
// Bild, das Georg am 1.9. eingekreist hat.
// **Lehre, zum zweiten Mal in diesem Projekt: eine Konstante im Konstruktor ist keine Aussage
// über die Laufzeit.** Wer einen Wert liest, muss seine Schreiber zählen.
//
// Eine benannte Abweichung: unsere Sonne steht auf Abstand **60** (`sky-presets.buildLightRig`,
// Richtung normalisiert × 60), die der Quelle auf **13,2** (`position.set(12, 2, 5)`). `near 1 /
// far 40` der Quelle würde bei uns den Globus nie erreichen — die Tiefe wird deshalb aus dem
// tatsächlichen Lampenabstand gerechnet (`abstand ± tiefe`), nicht aus deren Zahlen. Alles
// andere ist zeichengleich.
// ============================================================================

export function createSunShadow({ THREE, renderer, sun, empfaenger = [], params = {} }) {
  // Quellenzahlen (Game.ts 1141–1177 + 3164–3170). `spanne` ist der LAUFZEIT-Wert, nicht der
  // Konstruktor-Wert — siehe Kopf.
  const P = Object.assign({ on: true, res: 2048, spanne: 5, radius: 2.5, blur: 12,
                            bias: -0.0015, normalBias: 0, tiefe: 9 }, params);
  const ziel = new THREE.Object3D();
  ziel.name = 'sun-shadow-target';
  let angewandt = false;

  function tiefeSetzen() {
    const abstand = sun.position.length() || 60;
    sun.shadow.camera.near = Math.max(0.1, abstand - P.tiefe);
    sun.shadow.camera.far = abstand + P.tiefe;
  }

  function anwenden() {
    renderer.shadowMap.enabled = P.on;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    sun.castShadow = P.on;
    sun.shadow.mapSize.width = P.res;
    sun.shadow.mapSize.height = P.res;
    sun.shadow.camera.left = -P.spanne;
    sun.shadow.camera.right = P.spanne;
    sun.shadow.camera.top = P.spanne;
    sun.shadow.camera.bottom = -P.spanne;
    tiefeSetzen();
    sun.shadow.radius = P.radius;
    sun.shadow.blurSamples = P.blur;
    sun.shadow.bias = P.bias;
    sun.shadow.normalBias = P.normalBias;
    sun.shadow.camera.updateProjectionMatrix();
    sun.target = ziel;
    for (const e of empfaenger) if (e) e.receiveShadow = P.on;
    angewandt = true;
  }
  anwenden();

  return {
    name: 'sun-shadow', ziel, params: P,
    /** Je Bild: das Ziel der Sonne ist das Fahrzeug — dadurch reist die kleine Box mit. */
    folgen(pos) {
      if (!P.on || !pos) return;
      ziel.position.copy(pos);
      ziel.updateMatrixWorld();
    },
    setOn(on) {
      P.on = !!on;
      anwenden();
      return P.on;
    },
    setSpanne(v) {
      P.spanne = Math.max(1, Math.min(24, v));
      anwenden();
      return P.spanne;
    },
    /** ⚠ Gelesen wird der LAUFENDE Renderer und die LAUFENDE Lampe, nicht diese Datei. */
    tor() {
      const an = renderer.shadowMap.enabled && sun.castShadow;
      const c = sun.shadow.camera;
      const texel = (c.right - c.left) / sun.shadow.mapSize.width;
      const karte = 0.075;                                  // gezeichnete Kartenbreite (CARD_WELT)
      const texelKarte = texel > 0 ? karte / texel : 0;
      const empfangen = empfaenger.filter((e) => e && e.receiveShadow).length;
      const vsm = renderer.shadowMap.type === THREE.VSMShadowMap;
      const ok = an && texelKarte >= 6 && empfangen === empfaenger.length && vsm;
      return { ok, an, texel: +texel.toFixed(5), texelKarte: +texelKarte.toFixed(1),
        empfangen, empfaenger: empfaenger.length,
        text: (!an ? '— off: nothing casts, the card shadow module stays the fallback'
          : (ok ? '✓ ' : '✗ ') + 'shadow box ±' + c.right.toFixed(0) + ' u follows the vehicle'
            + ' · ' + sun.shadow.mapSize.width + ' px → ' + texel.toFixed(5) + ' u per texel'
            + ' → the 0.075 u card spans ' + texelKarte.toFixed(1) + ' texels'
            + ' · VSM ' + (vsm ? '✓' : '✗') + ' radius ' + sun.shadow.radius
            + ' · near/far ' + c.near.toFixed(1) + '/' + c.far.toFixed(1)
            + ' (lamp distance ' + sun.position.length().toFixed(1)
            + ' — source 13.2 with 1/40, ours derived)'
            + ' · receivers ' + empfangen + '/' + empfaenger.length
            + (texelKarte < 6 ? ' — ⚠ under six texels the card casts a smear, not a shadow' : '')) };
    },
  };
}
