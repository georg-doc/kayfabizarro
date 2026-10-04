/* KFB Pet Studio v5 — Bodenplatte und Schatten.  gnd-v1.0
 *
 * GEORGS BEFUND (25.8., am WS0-Bild): die Schatten hingen in Huefthoehe hinter den Figuren und die
 * Spielflaeche schnitt durch sie hindurch. Ursache ist immer dieselbe: der Schatten wurde auf eine
 * RUECKWAND projiziert (eine Ebene hinter der Szene) statt auf den BODEN. Sobald die Figur sich
 * hebt, laeuft so ein Schatten mit ihr nach oben, wird vom Boden beschnitten und braucht Masken,
 * die dann auch noch reissen.
 *
 * DIE REGEL HIER: der Schatten ist ein STEMPEL DER ECHTEN FORM, von oben genommen.
 * Eine kleine Kamera schaut senkrecht auf die Figur und nimmt ihre Silhouette ab (Ohren, Fluegel,
 * Beinchen inklusive — es ist dieselbe Trefferflaeche, die `body.radius` beschreibt). Dieses Bild
 * wird auf den Boden gelegt, nach vorne rechts versetzt (dieselbe Lichtlogik wie die Karten-Tusche:
 * unten und rechts satter) und mit der Hoehe kleiner und schwaecher. Damit gilt:
 *
 *   - Huepfen, Prellen, Kippen brauchen keine Maske. Der Stempel liegt IMMER auf dem Boden.
 *   - Kein Beschneiden: die Ebene ist gross und der Stempel liegt in ihrer Mitte.
 *   - Keine Rueckwand: es gibt keine zweite Projektionsflaeche, auf der etwas landen koennte.
 *   - Die Form ist die Figur, kein allgemeines Oval — auch beim Pinguin mit Fluegeln.
 *
 * Der Schatten ist ein DECAL, kein Lichtschatten. Deshalb konkurriert er nicht mit dem Licht, das
 * das Gesicht macht: das Licht darf flackern, die Lage der Figur bleibt ruhig.
 */

export const version = 'gnd-v1.0';

export const PLANE_MODES = ['paper', 'invisible', 'flat', 'card'];

/* Standardwerte. `dir` ist die Lichtentscheidung des Hauses: Schatten nach VORNE (zum Betrachter)
   und RECHTS, wie der Saum an der Karten-Tusche. */
export const DEF = {
  plane: { mode: 'paper', tint: '#efe6d3', size: 14 },
  shadow: {
    on: true,
    /* TUSCHE ist der Standard. Das Rosa war Georgs mentales Modell fuer die Uebergabe an WS0 (»die
       rosa Kreise sind die Schatten«) — als Look bleibt es eine Wahl, nicht die Voreinstellung. */
    color: '#1f1a14',
    opacity: 0.34,
    scale: 1.06,             // Stempel etwas groesser als die Figur (weiche Kante)
    dir: [0.13, 0.17],       // [rechts, vorne] in Anteilen der Grundform
    liftFade: 0.55,          // wie viel Deckung eine Grundform-Hoehe kostet
    liftGrow: 0.30,          // wie viel groesser der Stempel dabei wird
    res: 256,
  },
};

const hexToRgb = (h) => {
  const s = String(h).replace('#', '');
  const n = parseInt(s.length === 3 ? s.split('').map((c) => c + c).join('') : s, 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
};

/**
 * @param {object} o THREE · renderer · scene · target (die Gruppe, die Schatten wirft) ·
 *                   groundY (Standard 0) · cubeH (Grundform, fuer Versatz und Hoehen-Mass)
 */
export function createGround(o) {
  const THREE = o.THREE, renderer = o.renderer, scene = o.scene;
  let target = o.target || null;
  const S = { plane: { ...DEF.plane }, shadow: { ...DEF.shadow }, groundY: o.groundY || 0, cubeH: o.cubeH || 0.75, tilt: [0, 0], hover: 0 };
  const fx = [];

  /* ── Die Platte ────────────────────────────────────────────────────────────────────────────── */
  const planeGeo = new THREE.PlaneGeometry(1, 1);
  const planeMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(S.plane.tint), roughness: 0.95, metalness: 0 });
  const plane = new THREE.Mesh(planeGeo, planeMat);
  plane.name = 'kfb-ground-plane';
  plane.rotation.x = -Math.PI / 2;
  plane.scale.set(S.plane.size, S.plane.size, 1);
  plane.position.y = S.groundY;
  plane.receiveShadow = false;      // der Stempel ersetzt den Lichtschatten, er addiert sich nicht
  plane.renderOrder = 0;
  scene.add(plane);

  /* ── Der Stempel: eine Kamera von oben, ein Ziel-Bild ──────────────────────────────────────── */
  const rt = new THREE.WebGLRenderTarget(S.shadow.res, S.shadow.res, { depthBuffer: true, stencilBuffer: false });
  rt.texture.colorSpace = THREE.NoColorSpace;
  const stampCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 10);
  stampCam.up.set(0, 0, -1);        // Blick senkrecht nach unten: »oben im Bild« ist hinten in der Welt
  /* WEISS, nicht schwarz: `alphaMap` liest den GRUENKANAL der Textur, nicht ihren Alphakanal. Eine
     schwarze Maske heisst Gruen 0 heisst Alpha 0 — der Stempel waere unsichtbar (am 25.8. genau so
     passiert). Der Hintergrund bleibt durch `setClearAlpha(0)` und Gruen 0 aussen vor. */
  const maskMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });

  const shadowMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(S.shadow.color),
    alphaMap: rt.texture, transparent: true, opacity: S.shadow.opacity,
    depthWrite: false, toneMapped: false, side: THREE.DoubleSide,
  });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shadowMat);
  shadow.name = 'kfb-ground-shadow';
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = S.groundY + 0.004;
  shadow.renderOrder = 2;           // ueber der Platte, ueber den FX
  scene.add(shadow);

  const box = new THREE.Box3(), vec = new THREE.Vector3(), size = new THREE.Vector3();
  const nrm = new THREE.Vector3(), axR = new THREE.Vector3(), axF = new THREE.Vector3(), foot = new THREE.Vector3();
  let last = { lift: 0, w: 1 };

  /** Die Platte kippen (Flipper-Tisch!). Danach ist »oben« nicht mehr +Y — der Stempel projiziert
   *  entlang der PLATTENNORMALE, deshalb bleibt er auch auf einer schiefen Fläche unter der Figur. */
  function setTilt(xDeg, zDeg) {
    S.tilt = [xDeg || 0, zDeg || 0];
    plane.rotation.set(-Math.PI / 2 + (xDeg || 0) * Math.PI / 180, 0, (zDeg || 0) * Math.PI / 180);
    shadow.rotation.copy(plane.rotation);
    plane.updateMatrixWorld(true);
  }

  /* ── Zwei Regeln aus dem WS0-Handover vom 25.8., hier als Code ──────────────────────────── */

  /**
   * DER FUSSANKER HÄLT NUR EINEN FRAME (WS0, gemessen: Fehler 7,0 px beim Hasen, 3,4 beim Pinguin).
   * Beim Einsetzen liegt die Sohle richtig; ab dem naechsten Bild hebt der Ruhe-Clip den Koerper, je
   * Tier verschieden weit. Deshalb wird JEDES BILD gepflanzt, und zwar NACH allen anderen Schreibern
   * (Buehne, Atmen, Betonung, Flipper) und direkt vor dem Rendern — der letzte Schreiber gewinnt.
   *
   * Gemessen wird am Huellkasten-Minimum (`Box3.min.y` ist ein echter Vertex), nicht an einer
   * projizierten Ecke: die WS0-Runde hat die Unterkante im BILD geschaetzt und deshalb zwei
   * verschiedene Fehler bekommen. Regel: **y ist Physik (Weltmass), x ist Komposition (Pixel).**
   */
  function plant(lift) {
    if (!target) return null;
    box.setFromObject(target);
    if (!isFinite(box.min.y)) return null;
    const soll = S.groundY + (lift || 0);
    const d = box.min.y - soll;
    if (Math.abs(d) < 1e-6) return { corrected: 0 };
    target.position.y -= d;
    return { corrected: +d.toFixed(5) };
  }

  /**
   * SIEHT DIE KAMERA DIE EMPFÄNGERFLÄCHE ÜBERHAUPT? (WS0: vier Runden gekostet.) Steht die Kamera
   * unter der Fusslinie, sieht sie jede waagerechte Ebene von der KANTE — dann kann ein Bodenschatten
   * nur ein Strich sein. Das ist Geometrie, keine Parameterfrage, und keine Lichtrichtung repariert es.
   * `seen` ist der Winkel, unter dem die Kamera auf die Fläche schaut (Grad, > 0 = von oben).
   */
  function seesPlane(cam) {
    if (!cam) return null;
    axes();
    const v = new THREE.Vector3();
    cam.getWorldDirection(v);
    const c = Math.max(-1, Math.min(1, -v.dot(nrm)));
    const seen = Math.asin(c) * 180 / Math.PI;
    return { seen: +seen.toFixed(2), ok: seen > 4, hint: seen > 4 ? 'Flaeche sichtbar' : 'Kamera schaut die Flaeche von der KANTE an — ein Bodenschatten kann hier nur ein Strich sein' };
  }
  /** Die Platte der Kamera entgegenkippen, statt den Schatten schoenzurechnen (WS0-Formel:
   *  Neigung = Sollwinkel − gesehener Winkel, geklemmt). */
  function autoTilt(cam, viewAngleDeg) {
    const s = seesPlane(cam); if (!s) return null;
    const want = viewAngleDeg == null ? 12 : viewAngleDeg;
    const need = Math.max(0, Math.min(34, want - s.seen));
    setTilt(-need, S.tilt[1]);
    return { ...s, tilt: -need };
  }
  function axes() {
    plane.updateMatrixWorld(true);
    nrm.set(0, 0, 1).transformDirection(plane.matrixWorld).normalize();   // Flaechennormale
    axR.set(1, 0, 0).transformDirection(plane.matrixWorld).normalize();   // rechts auf der Flaeche
    axF.set(0, 1, 0).transformDirection(plane.matrixWorld).normalize();   // vorne auf der Flaeche
  }

  /** WIE BREIT IST EINE KACHEL, IN BILDSCHIRMPIXELN, AM ORT `atWorld`?
   *  Georgs Ansage 25.8.: »Referenz ist die ground plane des Pet«. Also gehoert dieses Mass dem
   *  BODEN und nicht dem Aufrufer — dieselbe Hausregel wie beim Schatten (der Boden gehoert der Zone,
   *  das Podest dem Pet). Zwei Gruende, warum eine Messung ausserhalb falsch war:
   *    · sie lag auf Brusthoehe des Tiers statt auf der PLATTE — unter Perspektive sind das zwei
   *      verschiedene Groessen, und die Kachel liegt nun einmal am Boden;
   *    · sie nahm die Kamera-Achse. Eine Kachel ist ein Ding IN der Flaeche; ihre Kanten sind axR
   *      und axF. Genommen wird die weiter erscheinende der beiden — sonst schrumpft das Mass beim
   *      Umkreisen, wenn eine Kante gerade auf den Betrachter zeigt.
   *  Auf einer gekippten Platte (Flipper) stimmt es weiter: gemessen wird in der Flaeche, und der
   *  Punkt wird vorher entlang der Normale auf sie gelegt.
   */
  function screenTile(cam, cvW, cvH, edge, atWorld) {
    if (!cam || !cvW || !cvH) return null;
    axes();
    const e = edge || 2;
    const p = atWorld ? atWorld.clone() : new THREE.Vector3(0, S.groundY, 0);
    const base = new THREE.Vector3(0, S.groundY, 0);
    p.addScaledVector(nrm, -p.clone().sub(base).dot(nrm));
    const px = (v) => { const q = v.clone().project(cam); return [(q.x + 1) / 2 * cvW, (1 - q.y) / 2 * cvH]; };
    const span = (ax) => {
      const a = px(p.clone().addScaledVector(ax, -e / 2)), b = px(p.clone().addScaledVector(ax, e / 2));
      return Math.hypot(b[0] - a[0], b[1] - a[1]);
    };
    return Math.max(span(axR), span(axF));
  }

  /** Alles ausser der Figur unsichtbar machen — sonst stempelt sich der Boden selbst mit ab. */
  function renderStamp() {
    if (!target) return null;
    box.setFromObject(target);
    if (!isFinite(box.min.y)) return null;
    box.getSize(size);
    const c = box.getCenter(vec).clone();
    const half = Math.max(size.x, size.z) * 0.5 * S.shadow.scale || 0.5;
    axes();
    /* Abstand der Figur ZUR PLATTE, entlang ihrer Normale — nicht die Y-Differenz. Auf einer
       gekippten Fläche sind das zwei verschiedene Zahlen, und nur die erste ist die Höhe. */
    const d = c.clone().sub(plane.position).dot(nrm);
    const lift = Math.max(0, d - size.y * 0.5);
    foot.copy(c).addScaledVector(nrm, -d);
    stampCam.left = -half; stampCam.right = half; stampCam.top = half; stampCam.bottom = -half;
    stampCam.near = 0.01; stampCam.far = Math.max(0.6, size.y * 1.5 + Math.abs(d) + 0.6);
    stampCam.up.copy(axF);
    stampCam.position.copy(c).addScaledVector(nrm, size.y * 0.6 + 0.06);
    stampCam.lookAt(foot);
    stampCam.updateProjectionMatrix();

    const hidden = [];
    for (const ch of scene.children) {
      if (ch === target) continue;
      if (ch.visible) { hidden.push(ch); ch.visible = false; }
    }
    const prevTarget = renderer.getRenderTarget();
    const prevAlpha = renderer.getClearAlpha();
    const prevOverride = scene.overrideMaterial;
    const prevBg = scene.background;
    scene.background = null;
    scene.overrideMaterial = maskMat;
    renderer.setRenderTarget(rt);
    renderer.setClearAlpha(0);
    renderer.clear(true, true, false);
    renderer.render(scene, stampCam);
    renderer.setRenderTarget(prevTarget);
    renderer.setClearAlpha(prevAlpha);
    scene.overrideMaterial = prevOverride;
    scene.background = prevBg;
    for (const ch of hidden) ch.visible = true;

    return { half, lift, foot: foot.clone() };
  }

  function update() {
    if (!S.shadow.on || !target) { shadow.visible = false; return null; }
    const m = renderStamp();
    if (!m) { shadow.visible = false; return null; }
    shadow.visible = true;
    /* Hoehe erzaehlt EINE Sache: der Stempel wird schwaecher und groesser. Die Figur selbst wird
       nicht angetastet — sonst haette man zwei Erzaehler fuer dieselbe Hoehe. */
    const h = S.cubeH || 0.75;
    /* Der Nullpunkt ist die RUHEHOEHE, nicht der Boden. Ein Flug-Pet steht in der Luft — sein
       Schatten ist dort scharf, sonst waere es fuer immer mitten im Sprung. */
    const rel = Math.max(0, m.lift - S.hover);
    const t = Math.min(1.6, rel / h);
    const fade = Math.max(0.08, 1 - t * S.shadow.liftFade) * (S.hover > 0 ? 0.9 : 1);
    const grow = 1 + t * S.shadow.liftGrow;
    const w = m.half * 2 * grow;
    shadow.scale.set(w, w, 1);
    shadow.position.copy(m.foot).addScaledVector(nrm, 0.004)
      .addScaledVector(axR, h * S.shadow.dir[0]).addScaledVector(axF, h * S.shadow.dir[1]);
    shadowMat.opacity = S.shadow.opacity * fade;
    last = { lift: +m.lift.toFixed(4), w: +w.toFixed(4), fade: +fade.toFixed(3), grow: +grow.toFixed(3), tilt: S.tilt.slice(), hover: S.hover };
    for (let i = fx.length - 1; i >= 0; i--) {
      const f = fx[i];
      if (f.life == null) continue;
      f.t = (f.t || 0) + 0.016;
      const k = 1 - f.t / f.life;
      if (k <= 0) { scene.remove(f.mesh); f.mesh.geometry.dispose(); f.mesh.material.dispose(); fx.splice(i, 1); continue; }
      f.mesh.material.opacity = f.opacity * k;
      const s2 = f.r * (1 + (1 - k) * 0.5);
      f.mesh.scale.set(s2 * 2, s2 * 2, 1);
    }
    return last;
  }

  /* ── Boden-FX: AOE, Treffer, Zonen. DATEN, keine Lichter. ──────────────────────────────────── */
  function addFx(p) {
    const col = new THREE.Color(p.color || '#ff5fd0');
    const cv = document.createElement('canvas'); cv.width = cv.height = 128;
    const g = cv.getContext('2d');
    const grd = g.createRadialGradient(64, 64, 8, 64, 64, 62);
    grd.addColorStop(0, 'rgba(255,255,255,0)');
    grd.addColorStop(p.ring == null ? 0.72 : p.ring, 'rgba(255,255,255,0)');
    grd.addColorStop(0.86, 'rgba(255,255,255,1)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(cv);
    const mat = new THREE.MeshBasicMaterial({ color: col, alphaMap: tex, transparent: true, opacity: p.opacity == null ? 0.6 : p.opacity, depthWrite: false, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    mesh.rotation.x = -Math.PI / 2;
    const r = p.r || 0.5;
    mesh.scale.set(r * 2, r * 2, 1);
    mesh.position.set(p.x || 0, S.groundY + 0.002, p.z || 0);
    mesh.renderOrder = 1;             // UNTER dem Schatten: der Boden ist bemalt, die Figur liegt darauf
    scene.add(mesh);
    const rec = { mesh, r, opacity: mat.opacity, life: p.life == null ? null : p.life, t: 0, id: p.id || ('fx' + fx.length) };
    fx.push(rec);
    return rec.id;
  }
  function clearFx() { for (const f of fx) { scene.remove(f.mesh); f.mesh.geometry.dispose(); f.mesh.material.dispose(); } fx.length = 0; }

  /* ── Einstellungen ─────────────────────────────────────────────────────────────────────────── */
  function setPlane(patch) {
    Object.assign(S.plane, patch || {});
    plane.scale.set(S.plane.size, S.plane.size, 1);
    planeMat.color.set(S.plane.tint);
    const m = S.plane.mode;
    plane.visible = m !== 'invisible';
    planeMat.transparent = m === 'invisible';
    planeMat.opacity = m === 'invisible' ? 0 : 1;
    planeMat.roughness = m === 'flat' ? 1 : 0.95;
    planeMat.needsUpdate = true;
  }
  function setShadow(patch) {
    Object.assign(S.shadow, patch || {});
    shadowMat.color.set(S.shadow.color);
    shadowMat.opacity = S.shadow.opacity;
    shadow.visible = !!S.shadow.on;
  }

  return {
    version, state: S, plane, shadow, fx,
    setTarget(g) { target = g; },
    setCubeH(h) { if (h) S.cubeH = h; },
    setHover(h) { S.hover = Math.max(0, h || 0); },
    setGroundY(y) { S.groundY = y || 0; plane.position.y = y || 0; },
    setPlane, setShadow, setTilt, addFx, clearFx, update, plant, seesPlane, autoTilt, screenTile,
    report() { return { ...last, plane: S.plane.mode, color: S.shadow.color, dir: S.shadow.dir.slice(), tilt: S.tilt.slice(), fx: fx.length }; },
    dispose() {
      clearFx();
      scene.remove(plane); scene.remove(shadow);
      planeGeo.dispose(); planeMat.dispose();
      shadow.geometry.dispose(); shadowMat.dispose();
      rt.dispose(); maskMat.dispose();
    },
  };
}
