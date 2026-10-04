// ============================================================================
// camera-rig.js — KFB Travel · Slice S41 (V9-A) · die EINZIGE Stelle, die die Kamera schreibt
// ----------------------------------------------------------------------------
// Auftrag aus `docs/INTERMISSION_reviews_v8.md`: die Kamera ist **Konsument** des
// Runtime-States, kein Akteur. Vorher schrieben zwei Module dieselbe Kamera
// (Runner 10×, `card-dock` 5×) und kannten einander nicht.
//
// **Der Fehler, den dieser Slice behebt** (Georgs „Detailansicht springt", „Zoom
// ruckelt"): der Runner rief `camera.lookAt(follow)`, danach rief das Dock
// `camera.lookAt(card)`. Die POSITION war mit `k` gemischt — das BLICKZIEL aber
// wurde ab `k > 0,04` **hart überschrieben**. Ein Faktor für das eine, ein
// Schalter für das andere: genau die Fehlerklasse „Übergänge sind Faktoren".
// Dazu liefen zwei Glättungen mit verschiedenen Raten hintereinander auf
// derselben Position.
//
// DIE REGEL HIER: es gibt EINEN Ort (`commit`), der `camera.position`,
// `camera.lookAt` und `camera.fov` setzt — pro Frame genau einmal. Alle Beiträge
// (Follow, POV, Dock) sind Kandidaten, die vorher gemischt werden. Wer die Kamera
// beeinflussen will, liefert Ziel + Faktor, nicht Schreibzugriff.
//
// Reihenfolge im Frame: Controller → Dock (rechnet Ziel & k) → **Rig** → Render.
//
//   const cam = createCameraRig({ THREE, camera, pullIn, escapeTerrain, groundAt });
//   cam.updateFly(dt, flight.state, { heat, boostPulse, dock: dock.mix });
//   cam.updateWalk(dt, walk.state, { heat, eyeUp, recenter, dock: dock.mix });
// ============================================================================

export function createCameraRig(opts = {}) {
  const THREE = opts.THREE, camera = opts.camera;
  const pullIn = opts.pullIn, escapeTerrain = opts.escapeTerrain, groundAt = opts.groundAt;
  const P = Object.assign({
    // POV-Mischzone in Kamera-Abstand: 1,0 u = ganz POV, 3,6 u = ganz Follow.
    // Breite Zone, weil der Dolly sonst zu schnell durchläuft (gemessen S32e).
    povFar: 3.6, povNear: 1.0,
    // Zeitkonstanten des Übergangs — in 1/s, damit sie NICHT am Zoom-Easing hängen.
    povRate: 2.2,        // wie schnell der Mischfaktor dem Abstand folgt
    aimRateBand: 22,     // °/s Blickdrehung während der Mischung (dort entstand der Schwenk)
    aimRateFree: 150,    // °/s im reinen Follow-Flug (Kurven müssen folgen dürfen)
    zoomInRate: 1.6,     // 1/s Zoom-Easing nach INNEN (war 2,4 — hinein war 3× schneller als hinaus)
    zoomOutRate: 2.4, zoomFarRate: 4,
    // Unterhalb dieses Abstands versteilt sich der Follow-Kurs nicht weiter: `camH/camDist`
    // treibt die Richtung sonst fast senkrecht nach oben, und die Kamera schwenkt über die
    // Karte, während der POV-Mix erst anfängt (das war der Restsprung von 2,8 u).
    distFloor: 2.2,
    zoomMin: 0, zoomMax: 17,
    wheelGain: 0.0035,   // pro Pixel Wischweg — Touchpad-taugliche Feinheit

  }, opts.params || {});

  let dist = 9, zoomTarget = 9, yaw = 0, yawTarget = 0, zoomRate = 0;
  let pullF = 9, pullW = 9, walkLookY = 0, snapNext = false;
  let povS = 0, povRaw = 0, lastLookAt = 0;
  // S56 · Was die Ankunfts-Regie MESSEN muss: wie viel Grad hat der Blick in diesem Frame
  // wirklich gedreht, wie weit ist die Kamera wirklich gesprungen. Beides NACH der Bremse,
  // also das, was der Spieler sieht — nicht das, was gewollt war.
  let lastAimDeg = 0, lastMoveU = 0;

  const _back = new THREE.Vector3(), _pos = new THREE.Vector3(), _look = new THREE.Vector3();
  const _dir = new THREE.Vector3(), _povPos = new THREE.Vector3(), _povLook = new THREE.Vector3();
  // **Das Blickziel ist eine RICHTUNG, kein Punkt.** Ein gespeicherter Punkt dreht den Blick mit,
  // sobald sich die Kamera bewegt — an jeder Winkelbremse vorbei (gemessen: Spitzen 31,5°/s trotz
  // Grenze 26°/s). Als Einheitsvektor ist die Drehung vollständig beschränkbar, und eine reine
  // Positionsbewegung schwenkt das Bild gar nicht mehr.
  // Überhaupt war `lookAt` vorher der einzige ungefederte Pfad, und `pullIn`/`escapeTerrain` sind
  // ITERATIVE Suchen: ihr Ergebnis springt um ganze Schrittweiten.
  const _aim = new THREE.Vector3(0, 0, -1), _aimPt = new THREE.Vector3(), _wasAt = new THREE.Vector3();
  const smooth = (t) => t * t * (3 - 2 * t);
  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  function povFactor(d) { return smooth(clamp01((P.povFar - d) / (P.povFar - P.povNear))); }

  // **Der Mischfaktor hat seine EIGENE Zeitkonstante.** Er darf nicht am Zoom-Easing hängen:
  // das Mischband (3,6 → 1,0 u) liegt genau dort, wo `dist` relativ zur Restdistanz am schnellsten
  // läuft — gemessen 31,5°/s Median und Spitzen von 60,8°/s INNERHALB des Bandes gegen 0,8°/s
  // außerhalb (Faktor 40). Ein Faktor, der in 300 ms von 0 auf 1 geht, ist wieder ein Schalter,
  // nur mit Rampe. Also folgt `povS` dem Rohwert mit fester Rate — in Sekunden, nicht in Metern.
  function easePov(dt, d) {
    povRaw = povFactor(d);
    povS += (povRaw - povS) * Math.min(1, dt * P.povRate);
    return povS;
  }

  // Winkelbremse: der Blick darf pro Sekunde nur so viel drehen. Während der Mischung ist die
  // Grenze eng (dort entstand der Schwenk), im reinen Follow-Flug weit — sonst könnte die Kamera
  // einer Kurve nicht mehr folgen.
  const _tgtDir = new THREE.Vector3();

  // DIE einzige Schreibstelle. `dock` = { k, pos, look } oder null.
  function commit(dt, fovTarget, followRate, dock) {
    _wasAt.copy(camera.position);
    if (dock && dock.k > 0) {
      // Position UND Blickziel gehen denselben Weg — mit demselben Faktor.
      _pos.lerp(dock.pos, dock.k);
      _look.lerp(dock.look, dock.k);
    }
    camera.position.lerp(_pos, Math.min(1, followRate));
    _tgtDir.subVectors(_look, camera.position);
    if (_tgtDir.lengthSq() > 1e-8) _tgtDir.normalize(); else _tgtDir.copy(_aim);
    if (snapNext) { camera.position.copy(_pos); _aim.copy(_tgtDir); snapNext = false; lastAimDeg = 0; }
    else {
      // Die Bremse gilt in JEDEM Übergang — POV-Mischung UND Dock-Landung. Erst nur am POV-Band
      // festgemacht, blieb die Landung ungebremst: dort entstanden 46°/s (gemessen).
      const inBand = (povS > 0.02 && povS < 0.98) || (dock && dock.k > 0.02 && dock.k < 0.98);
      const lim = (inBand ? P.aimRateBand : P.aimRateFree) * dt;
      const ang = _aim.angleTo(_tgtDir) * 180 / Math.PI;
      lastAimDeg = Math.min(ang, lim);
      _aim.lerp(_tgtDir, ang > 1e-4 ? Math.min(1, lim / ang) : 1);
      if (_aim.lengthSq() > 1e-8) _aim.normalize(); else _aim.copy(_tgtDir);
    }
    lastMoveU = camera.position.distanceTo(_wasAt);
    _aimPt.copy(camera.position).addScaledVector(_aim, 8);
    camera.lookAt(_aimPt);
    camera.fov += (fovTarget - camera.fov) * Math.min(1, dt * 6);
    camera.updateProjectionMatrix();
  }

  function updateFly(dt, st, env) {
    const h = (env && env.heat) || 0, bp = (env && env.boostPulse) || 0;
    const now = performance.now();
    dist += (zoomTarget - dist) * Math.min(1, dt * (zoomRate || (dist < 4 ? (zoomTarget < dist ? P.zoomInRate : P.zoomOutRate) : P.zoomFarRate)));
    zoomRate = 0;   // Dringlichkeit gilt nur für den Frame, der sie gesetzt hat
    yaw += (yawTarget - yaw) * Math.min(1, dt * 5);
    if (now - lastLookAt > 1400) yawTarget += (0 - yawTarget) * Math.min(1, dt * 1.8);
    easePov(dt, dist);

    // POV-Kandidat: Blick aus der Karte nach vorn
    _povPos.copy(st.position).addScaledVector(st.up, 1.15);
    _povLook.copy(_povPos).addScaledVector(st.forward, 6).addScaledVector(st.up, 0.2);

    // Follow-Kandidat: Dolly an travelHeat (die Welt weitet sich beim Boost), Pull-in, Escape
    _back.copy(st.forward).negate(); if (yaw) _back.applyAxisAngle(st.up, yaw);
    const camH = 2.6 + h * 1.4 + dist * 0.18 + bp * 0.15;
    _look.copy(st.position).addScaledVector(st.forward, 2 + h * 3.4).addScaledVector(st.up, 0.8);
    _dir.copy(_back).addScaledVector(st.up, camH / Math.max(dist, P.distFloor)).normalize();
    const dRaw = pullIn(st.position, _dir, Math.hypot(dist + h * 1.6 + bp * 0.6, camH));
    // schnell heran, langsam hinaus — sonst hüpft die Kamera über gebrochenem Boden
    if (snapNext) pullF = dRaw;
    else pullF += (dRaw - pullF) * Math.min(1, dt * (dRaw < pullF ? 20 : 2.5));
    _pos.copy(st.position).addScaledVector(_dir, pullF);
    escapeTerrain(_pos, _look, 0.9, 4);

    _pos.lerp(_povPos, povS);
    _look.lerp(_povLook, povS);
    commit(dt, (54 + h * 13 + bp * 7) * (1 - povS) + 66 * povS,
           dt * (3.5 + povS * 2.5), env && env.dock);
    return povS;
  }

  function updateWalk(dt, ws, env) {
    const h = (env && env.heat) || 0, eyeUp = (env && env.eyeUp) || 1.1, c = ws.cam;
    const now = performance.now();
    easePov(dt, c.dist);

    // POV-Kandidat: Augenhöhe des Läufers, Blick in Laufrichtung
    const hy = ws.position.y + eyeUp * 1.15;
    _povPos.set(ws.position.x, hy, ws.position.z);
    _povLook.set(ws.position.x + Math.sin(ws.facing) * 4, hy + (0.32 - c.pitch) * 3.2,
                 ws.position.z + Math.cos(ws.facing) * 4);

    // Follow-Kandidat: Orbit hinter dem Kurs
    if (now - lastLookAt > 1400 && env && env.recenter) env.recenter(dt);
    const yw = ws.heading + c.yawOff, tgtY = ws.position.y + eyeUp;
    walkLookY += (tgtY - walkLookY) * Math.min(1, dt * 5);
    _look.set(ws.position.x, walkLookY, ws.position.z);
    _dir.set(-Math.sin(yw) * Math.cos(c.pitch), Math.sin(c.pitch), -Math.cos(yw) * Math.cos(c.pitch)).normalize();
    const dRaw = pullIn(_look, _dir, c.dist + h * 0.9, 1.2);
    if (snapNext) { pullW = dRaw; walkLookY = tgtY; _look.y = tgtY; }
    else pullW += (dRaw - pullW) * Math.min(1, dt * (dRaw < pullW ? 20 : 2.5));
    _pos.copy(_look).addScaledVector(_dir, pullW);
    const cg = groundAt(_pos.x, _pos.z) + 1.0;
    if (_pos.y < cg) _pos.y = cg;
    // … aber der Aufzug darf die Kamera nicht über das Pet hinaus heben (sonst schaut sie in den
    // Himmel und das Pet fällt aus dem Bild). Statt höher: näher heranziehen.
    const yCap = walkLookY + Math.max(2.4, c.dist * 0.8);
    if (_pos.y > yCap) {
      _pos.y = yCap;
      _pos.x += (_look.x - _pos.x) * 0.35;
      _pos.z += (_look.z - _pos.z) * 0.35;
    }
    escapeTerrain(_pos, _look, 0.8, 6);   // ganz zuletzt: nie in einer Säule stehen

    _pos.lerp(_povPos, povS);
    _look.lerp(_povLook, povS);
    commit(dt, (56 + h * 6) * (1 - povS) + 66 * povS, dt * 6, env && env.dock);
    return povS;
  }

  return {
    name: 'camera-rig', updateFly, updateWalk,
    // ---- Zoom & Blickrichtung (Eingaben, keine Schreibzugriffe)
    get zoomTarget() { return zoomTarget; },
    // `rate` ist die DRINGLICHKEIT dieses Frames: die Hand am Rad zoomt gemütlich (1,6/s nach
    // innen), eine Anflug-Regie darf schneller heranholen — sonst kriecht die Kamera dem Beat
    // hinterher und das Pet verschwindet, bevor sie da ist (gemessen: 5,43 u statt ≤ 3 u bei der
    // Übergabe). Sie gilt nur für diesen Frame, es gibt also keinen Zustand zum Aufräumen.
    setZoom(v, rate) { zoomTarget = Math.max(P.zoomMin, Math.min(P.zoomMax, v)); if (rate) zoomRate = rate; },
    zoom(delta) { this.setZoom(zoomTarget + delta); },
    // **Touchpad-Zoom: multiplikativ und proportional zur Wischstärke.** Vorher zählte nur das
    // VORZEICHEN des Rad-Ereignisses (0,9 u pro Ereignis) — ein Touchpad feuert Dutzende davon, und
    // dieselbe Rastung ist bei 2 u Abstand die halbe Distanz und bei 15 u ein Nichts. Jetzt ändert
    // eine Wischbewegung den Abstand um einen FAKTOR, und kleine Wische bleiben klein.
    zoomWheel(deltaY, mode) {
      const px = mode === 1 ? deltaY * 16 : (mode === 2 ? deltaY * 400 : deltaY);
      const step = Math.max(-0.35, Math.min(0.35, px * P.wheelGain));
      this.setZoom(Math.max(P.zoomMin, zoomTarget + Math.max(0.35, zoomTarget) * step));
    },
    get dist() { return dist; },
    get lastAimDeg() { return lastAimDeg; },
    get lastMoveU() { return lastMoveU; },
    nudgeYaw(d) { yawTarget += d; lastLookAt = performance.now(); },
    markLookAt() { lastLookAt = performance.now(); },
    // ---- Zustand, den andere LESEN dürfen
    get povS() { return povS; },
    get povRaw() { return povRaw; },
    get pov() { return povS > 0.5; },
    // Das Pet wird nicht geschaltet, sondern ausgeblendet: 0,68 → 0,94 ist der Verlauf. Früher
    // (0,45) SAH man das Ausblenden, weil das Pet da noch mitten im Bild saß (Georgs Befund).
    // Ein Boolean an einer Schwelle war der sichtbare Ruck beim Zoomen (Georgs Befund).
    get petFade() { return clamp01((povS - 0.68) / 0.26); },
    snap() { snapNext = true; },
    setWalkLookY(y) { walkLookY = y; },
    setParams(p) { Object.assign(P, p || {}); },
    get params() { return P; },
  };
}
