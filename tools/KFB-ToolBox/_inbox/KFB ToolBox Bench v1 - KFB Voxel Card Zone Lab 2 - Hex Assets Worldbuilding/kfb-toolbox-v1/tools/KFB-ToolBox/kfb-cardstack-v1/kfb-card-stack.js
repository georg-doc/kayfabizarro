/**
 * KFB CardStack v1 · DECK, AUFDECKEN, SKY-CARD
 * ============================================
 * Drei Dinge, die zusammengehoeren, weil sie DIESELBE Karte in drei Zustaenden zeigen:
 *
 *   DECK      Ein echter Stapel Blaetter in Handgroesse auf dem Boden.
 *   AUFDECKEN Das oberste Blatt klappt um seine Unterkante auf, biegt sich dabei,
 *             waechst auf Projektionsgroesse und steigt in die Luft.
 *   SKY-CARD  Oben angekommen driftet es in Zero-G und dreht sich traege zur Kamera.
 *
 * WARUM EINE FUNKTION FUER DEN GANZEN WEG (`poseCard(p)`, p = 0…1): zwei getrennte
 * Animationen (erst klappen, dann fliegen) haben immer eine Naht, und jede Stoerung
 * dazwischen (Fenstergroesse, Terrain-Neubau) laesst die Karte springen. Eine Funktion,
 * die aus EINEM Parameter die ganze Pose ableitet, ist zu jedem Zeitpunkt konsistent und
 * jederzeit neu auswertbar.
 *
 * DREI ZUTATEN, DIE ES GLAUBHAFT MACHEN:
 *   1. SCHARNIER statt Mittelachse — der Pivot sitzt auf der Unterkante des Blattes.
 *   2. BIEGUNG — der obere Rand haengt nach, weil Papier Gewicht hat. Dafuer bekommen
 *      Blatt, Tusche und Rueckseite ein Segmentraster und einen uBend-Uniform, per
 *      onBeforeCompile in ein Standardmaterial gepatcht (uv.y² : Scharnier bleibt ruhig).
 *   3. GESTAFFELTE EINSAETZE — Sockel, Loch, Projektor und Wuerfel fahren in eigenen
 *      Zeitfenstern aus. Auf einem gemeinsamen Fenster kommen sie gleichzeitig an, und
 *      das liest als ein Ruck statt als Buehne, die sich oeffnet.
 *
 * VORDER- ODER RUECKSEITE, NIE BEIDE. Entschieden wird am Vorzeichen der WELT-Normalen:
 * der Wechsel passiert dann genau, wenn das Blatt von der Kante zu sehen ist. Zwei
 * gleichzeitig sichtbare Seiten lesen als zweite Karte.
 *
 * @module kfb-card-stack
 * @version 1.0.0
 * @herkunft KFB Card Zone Lab v2 (2026-09)
 * @status IMPLEMENTATION — als Modul herausgeloest, im Lab laufend erprobt,
 *         als eigenstaendiges Modul NOT_TESTED (siehe HANDOVER.md).
 */

const ease = (x) => x * x * (3 - 2 * x);
const win = (p, a, b) => ease(Math.min(1, Math.max(0, (p - a) / (b - a))));

/**
 * Biegung in ein bestehendes Material patchen. Muss VOR dem ersten Render passieren.
 * @param {object} material · @param {{uBend:{value:number}}} bendUniform
 */
export function patchBend(material, bendUniform) {
  material.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, bendUniform);
    sh.vertexShader = sh.vertexShader
      .replace('void main() {', 'uniform float uBend;\nvoid main() {')
      .replace('#include <begin_vertex>', [
        '#include <begin_vertex>',
        // uv.y ist 0 an der Unterkante (Scharnier) und 1 oben: quadratisch heisst,
        // die Biegung sitzt oben und das Scharnier bleibt ruhig.
        'float bw = uv.y * uv.y;',
        'transformed.z -= uBend * bw;',
        'transformed.y -= uBend * bw * 0.3;',
      ].join('\n'));
  };
  material.needsUpdate = true;
}

/**
 * DER STAPEL. Cartoon-realistisch heisst hier: gleiche Blaetter, aber jedes einen Hauch
 * versetzt und verdreht — die Unregelmaessigkeit sitzt in den Raendern, nicht in der Form.
 * Jedes fuenfte Blatt steht deutlicher heraus, sonst liest der Stapel als ein Block.
 * Die Hoehe zaehlt in D6-Stufen wie das Terrain, damit 1…6 Stufen verschieden dicke Decks
 * ergeben.
 *
 * @param {object} cfg
 * @param {object} cfg.THREE · @param {object} cfg.scene
 * @param {number} cfg.width · @param {number} cfg.height  Blattmass (bereits in Handgroesse).
 * @param {number} cfg.x · @param {number} cfg.z · @param {number} cfg.baseY  Ablageort.
 * @param {number} [cfg.steps=3]   Deckstaerke in D6-Stufen.
 * @param {number} [cfg.sub=0.5]   Hoehe einer D6-Stufe (cell/6).
 * @param {number} [cfg.thickness=0.115] Dicke eines Blattes.
 * @param {object} [cfg.backTexture]     Kartenrueckseite fuer das oberste Blatt.
 */
export function createCardStack(cfg) {
  const T = cfg.THREE;
  const thick = cfg.thickness || 0.115;
  const sub = cfg.sub || 0.5;
  let group = null, top = null, topY = 0, stackH = 0;

  function build(o = {}) {
    dispose();
    const w = o.width != null ? o.width : cfg.width;
    const h = o.height != null ? o.height : cfg.height;
    const x = o.x != null ? o.x : cfg.x, z = o.z != null ? o.z : cfg.z;
    const baseY = o.baseY != null ? o.baseY : cfg.baseY;
    const steps = o.steps != null ? o.steps : (cfg.steps || 3);
    const n = Math.max(1, Math.round(steps * sub / thick));
    stackH = n * thick * 0.97;

    const mesh = group = new T.InstancedMesh(
      new T.BoxGeometry(w, thick, h),
      new T.MeshStandardMaterial({ color: 0xe4d7b8, roughness: 0.95, metalness: 0 }),
      n,
    );
    mesh.name = 'kfb-card-stack';
    mesh.castShadow = mesh.receiveShadow = true;
    const d = new T.Object3D(), col = new T.Color();
    for (let i = 0; i < n; i++) {
      const r1 = (Math.sin(i * 12.9898) * 43758.5453) % 1, r2 = (Math.sin(i * 78.233) * 43758.5453) % 1;
      const out = (i % 5 === 2) ? 2.4 : 1;
      d.position.set(x + r1 * 0.5 * out, baseY + 0.3 + i * thick * 0.97, z + r2 * 0.5 * out);
      d.rotation.set(0, r1 * 0.05 * out, 0);
      d.updateMatrix();
      mesh.setMatrixAt(i, d.matrix);
      col.setRGB(0.90 + r2 * 0.09, 0.86 + r1 * 0.08, 0.74 + r2 * 0.10);
      mesh.setColorAt(i, col);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    cfg.scene.add(mesh);

    // Oberstes Blatt: die Rueckseite. Sie rueckt nach, sobald das echte Blatt abhebt — es
    // schiebt sich aus dem Stapel heraus statt aufzuploppen.
    const tex = o.backTexture || cfg.backTexture;
    top = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshStandardMaterial({
      map: tex || null, color: tex ? 0xffffff : 0xd8cba8, roughness: 0.9,
      transparent: true, opacity: 0,
    }));
    top.rotation.x = -Math.PI / 2;
    topY = baseY + 0.3 + stackH + 0.02;
    top.position.set(x, topY, z);
    top.visible = false;
    cfg.scene.add(top);
    return api;
  }

  /** `rise` ist der Steiganteil der Aufdeck-Kurve (0…1). */
  function poseTop(rise) {
    if (!top) return api;
    const fill = ease(Math.min(1, Math.max(0, (rise - 0.04) / 0.26)));
    top.visible = fill > 0.01;
    top.position.y = topY - (1 - fill) * sub * 0.9;
    top.material.opacity = fill;
    return api;
  }

  function dispose() {
    if (group) { cfg.scene.remove(group); group.geometry.dispose(); group.material.dispose(); group = null; }
    if (top) { cfg.scene.remove(top); top.geometry.dispose(); top.material.dispose(); top = null; }
  }

  const api = {
    name: 'kfb-card-stack', version: '1.0.0',
    build, poseTop, dispose,
    get mesh() { return group; },
    get topSheet() { return top; },
    get height() { return stackH; },
    setBackTexture(t) {
      if (top && t) { top.material.map = t; top.material.color.set(0xffffff); top.material.needsUpdate = true; }
      return api;
    },
    measure() { return { sheets: group ? group.count : 0, stackHeight: +stackH.toFixed(3), topY: +topY.toFixed(3) }; },
  };
  return api;
}

/**
 * DER AUFDECK-WEG. Eine Funktion, ein Zustand.
 *
 *   p = 0    flach auf dem Deck, Rueckseite oben, Handgroesse
 *   p = 0.6  aufgeklappt, noch unten
 *   p = 1    oben in der Luft, Projektionsgroesse
 *
 * @param {object} cfg
 * @param {object} cfg.pivot   Group, deren Ursprung auf der Blattunterkante liegt.
 * @param {number} cfg.height  Projektionshoehe des Blattes.
 * @param {number} cfg.skyY    Zielhoehe der Sky-Card (Mitte).
 * @param {number} cfg.deckX · @param {number} cfg.deckZ · @param {number} cfg.deckY  Ablage.
 * @param {number} cfg.centerZ Z-Mitte der Zone (Zielposition oben).
 * @param {number} [cfg.physScale=0.36] Handgroesse als Anteil der Projektion.
 * @param {{uBend:{value:number}}} cfg.bend
 */
export function createReveal(cfg) {
  const phys = cfg.physScale != null ? cfg.physScale : 0.36;
  let p = 0, dir = 0;

  /**
   * @param {number} v 0…1
   * @param {object} [live] Werte, die sich zwischen den Frames aendern koennen
   *   (Zonenhoehe, Deckhoehe): { deckY, skyY, height }.
   */
  function pose(v, live = {}) {
    p = Math.min(1, Math.max(0, v));
    const h = live.height != null ? live.height : cfg.height;
    const deckY = live.deckY != null ? live.deckY : cfg.deckY;
    const skyY = live.skyY != null ? live.skyY : cfg.skyY;
    const flip = ease(Math.min(1, p / 0.6));
    const rise = ease(Math.max(0, (p - 0.42) / 0.58));
    const sc = phys + (1 - phys) * rise;
    const zStart = cfg.deckZ - h * phys / 2;

    cfg.pivot.scale.setScalar(sc);
    cfg.pivot.rotation.set(Math.PI / 2 * (1 - flip), 0, 0);
    cfg.pivot.position.set(
      cfg.deckX * (1 - rise),
      deckY + (skyY - h / 2 - deckY) * rise,
      zStart + (cfg.centerZ - zStart) * rise,
    );
    if (cfg.bend) cfg.bend.uBend.value = Math.sin(Math.PI * Math.min(1, p / 0.6)) * h * 0.16 * (1 - rise * 0.7);
    return { flip, rise, scale: sc };
  }

  /**
   * GESTAFFELTE EINSAETZE fuer die Buehne unter der Karte.
   * Reihenfolge: Sockel (Grund) → Loch → Projektor → Wuerfel (Hauptdarsteller zuletzt).
   * @returns {{base:number, cap:number, projector:number, cube:number}} jeweils 0…1
   */
  function stageWindows(v = p) {
    return {
      base: win(v, 0.14, 0.46),
      cap: win(v, 0.18, 0.50),
      projector: win(v, 0.22, 0.56),
      cube: win(v, 0.26, 0.66),
    };
  }

  return {
    name: 'kfb-card-reveal', version: '1.0.0',
    pose, stageWindows,
    get p() { return p; },
    get direction() { return dir; },
    open() { if (dir === 0) dir = 1; },
    close() { if (dir === 0) dir = -1; },
    toggle() { if (dir === 0) dir = p >= 1 ? -1 : 1; },
    /** @param {number} dt @param {number} [dur=1.7] Sekunden fuer den ganzen Weg. */
    tick(dt, dur = 1.7) {
      if (dir === 0) return null;
      p = Math.min(1, Math.max(0, p + dir * dt / dur));
      if (p === 0 || p === 1) { const done = p === 1 ? 'offen' : 'verdeckt'; dir = 0; return done; }
      return null;
    },
  };
}

/**
 * ZERO-G. Die Sky-Card driftet auf drei Achsen und dreht sich traege zur Kamera, damit sie
 * lesbar bleibt. Bei ANNAEHERUNG nimmt beides ab — aus der Naehe soll sie ruhig stehen.
 * Nur der Gierwinkel wird nachgefuehrt und stark gedaempft; volle Ausrichtung ergibt einen
 * Nachzieh-Effekt, der wie ein Fehler aussieht.
 *
 * @param {object} THREE · @param {object} pivot · @param {object} camera
 * @param {object} o { t, dt, skyY, height, centerZ, calmNear=34, calmFar=80 }
 */
export function tickSkyCard(THREE, pivot, camera, o) {
  const dist = camera.position.distanceTo(pivot.position);
  const near = o.calmNear != null ? o.calmNear : 34;
  const span = (o.calmFar != null ? o.calmFar : 80) - near;
  const calm = Math.min(1, Math.max(0, (dist - near) / span));   // 0 = nah und ruhig
  const t = o.t;
  pivot.position.set(
    Math.sin(t * 0.23) * 2.2 * calm,
    o.skyY - o.height / 2 + Math.sin(t * 0.31 + 1.2) * 1.5 * calm,
    o.centerZ + Math.sin(t * 0.17 + 2.4) * 1.8 * calm,
  );
  const dir = camera.position.clone().sub(pivot.position); dir.y = 0;
  const yaw = Math.atan2(dir.x, dir.z);
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(
    Math.sin(t * 0.27) * 0.045 * calm, yaw, Math.sin(t * 0.19 + 0.7) * 0.05 * calm,
  ));
  pivot.quaternion.slerp(q, 1 - Math.pow(0.35, o.dt));
  return calm;
}

/**
 * Vorder- oder Rueckseite umschalten. Am Vorzeichen der Welt-Normalen, nicht am Winkel.
 * @returns {boolean} true = Vorderseite sichtbar
 */
export function setCardSide(THREE, group, camera, frontMeshes, backMesh) {
  group.updateMatrixWorld();
  const n = new THREE.Vector3(0, 0, 1).applyQuaternion(group.getWorldQuaternion(new THREE.Quaternion()));
  const toCam = camera.position.clone().sub(group.getWorldPosition(new THREE.Vector3()));
  const front = n.dot(toCam) > 0;
  frontMeshes.forEach((m) => { if (m) m.visible = front; });
  if (backMesh) backMesh.visible = !front;
  return front;
}

export default createCardStack;
