/* KFB FrizzleBob Studio v13 · pose-rig.v1 — die Sitzpose.
 *
 * OWNER FIX 2026-09-25 (ToolBox Production-01 continuation): Ketten aus Weltpositionen gemessen,
 * Zwischenknochen (Handgelenk) berücksichtigt, Bein-Ketten + öffentliche Ziel-IK (ikChain/effector/
 * solveIK/chainReport). Basis: @8922d4b1 dieser Datei; sonst Wort für Wort unverändert.
 *
 * VORBILD (Schritt 0, gefunden vor der ersten Zeile): `frankenstein-v1/race/src/driver.v2.js`.
 * Von dort WÖRTLICH übernommen: die analytische Zweiknochen-Kinematik (`aim`/`solve`, Kosinussatz,
 * Ellbogen-Hinweis) und die Ellbogenrichtungen L [1,-.6,-.2] / R [-1,-.6,-.2] in Wurzelkoordinaten.
 * Von dort auch die WARNUNG, die diesem Modul seine Form gibt: derselbe Löser hat die BEINE sichtbar
 * falsch gebogen (F1-S5, Georgs Bild) und wurde dort abgeschaltet. Beine gehen hier deshalb über
 * gemessene Gelenkwinkel, Arme über Zielpunkte — jedes Verfahren dort, wo es sich bewährt hat.
 *
 * GEMESSEN AN DER DATEI (FrizzleBob_Yellow.gltf, 10.09.): die Bindepose ist NICHT achsparallel — jeder
 * Gliedmaßenknochen trägt eine Drehung (Oberschenkel 0,91 · Unterschenkel 0,69 · Oberarm 0,53/0,50/0,47).
 * Ein Winkel um die Welt-x-Achse wäre also je Knochen etwas anderes. Darum: die Beugeachse jedes Gelenks
 * ist die QUERACHSE DER FIGUR, in das lokale System des Knochens gerechnet, und der Winkel wird auf die
 * Bindedrehung DRAUFGELEGT (bind × delta), nie ersetzt.
 *
 * EICHUNG VOR MESSUNG (Hausregel 0 des Frankenstein-Verfahrens): die Vorzeichen werden nicht geraten.
 * `_calibrate()` dreht jedes Gelenk um 6° und misst, wohin sich sein Kind bewegt; erst dann steht fest,
 * was »Oberschenkel nach vorn« heißt. Auch die Blickrichtung ist gemessen (der Kopf-Host des Moduls
 * weiß sie), nicht angenommen.
 *
 * EIGENTUM: Körper und Clips gehören dem Modul (Mixer), Gesicht dem Studio, die POSE diesem Rig —
 * es rechnet NACH dem Mixer und mischt mit `weight` (0 = Clip, 1 = Pose). Die Attrappe (Sitz, Lehnen,
 * Kugel, Knöpfe) ist eine MESSHILFE: Linien und Marken unter 10 cm Weltmaß, alle mit `noMeasure`, damit
 * weder Bodenstempel noch Pflanzung sie für Körper halten. Geliefert wird nicht das Möbel, sondern die
 * gemessenen Hand-, Fuß- und Sitzanker.
 */
const DEG = Math.PI / 180;
/* v16-S5 · Ellbogen-Hinweis für die Surfhaltung: nach UNTEN und ein Stück nach hinten. Er steht
   senkrecht auf der seitwärts gestreckten Armachse — genau das, was dem festen Seitenhinweis fehlt. */
let _SURF_HINT = null;
export const SCHEMA = 'kfb.pose/0.1';

export const PRESETS = {
  stand:    { label:'Stand',    hip:0,  knee:0,  toe:0,  spread:0,  lean:0,   stagger:0, hands:'free' },
  armchair: { label:'Armchair', hip:88, knee:92, toe:0,  spread:8,  lean:-4,  stagger:0, hands:'rest' },
  cockpit:  { label:'Cockpit',  hip:82, knee:88, toe:-6, spread:6,  lean:-2,  stagger:0, hands:'controls' },
  /* v15 · Georg 12.09.: in der Wanne sitzt die Figur mit AUSGESTRECKTEN Beinen — das ist die
     Vorgabe für die Wanne als Fahrzeug. Die Werte sind seine (Bildschirmfoto 04:25): Knie 0°,
     Fuß 40° hoch, Knie zusammen, Rumpf fast gerade. Der Sitzlöser darf sie noch nachrechnen. */
  bath:     { label:'Bathtub',  hip:83, knee:0,  toe:40, spread:0,  lean:-1,  stagger:0, hands:'rest' },
  /* v16 · Georg 13.09.: »eine Surfpose, wo er wie auf einem Surfbrett steht — leicht
     auseinanderstehende Beine, leicht ausgestreckte Arme, eine glaubhafte Surfer-Position.«
     Eine Surfhaltung ist KEINE symmetrische Grätsche: das vordere Bein steht vor, das hintere
     zurück (`stagger`), die Knie federn, der Rumpf geht nach vorn, die Arme balancieren außen.
     Ohne den Versatz sieht die Figur aus, als stünde sie auf einem Sprungbrett. */
  surf:     { label:'Surf',     hip:16, knee:30, toe:0,  spread:17, lean:7, stagger:24, hands:'surf' },
};
export const FIELDS = [
  { k:'hip',    label:'Hip · thigh forward',   min:-20, max:110, step:1, unit:'°' },
  { k:'knee',   label:'Knee · flexion',        min:0,   max:130, step:1, unit:'°' },
  { k:'toe',    label:'Ankle · toe up',        min:-30, max:75,  step:1, unit:'°' },
  { k:'spread', label:'Knees apart',           min:-10, max:35,  step:1, unit:'°' },
  { k:'lean',   label:'Torso lean back/front', min:-25, max:25,  step:1, unit:'°' },
  /* v16 · Beinversatz: + = linkes Bein vorn. Er wird auf den HÜFTWINKEL gelegt, also auf dieselbe
     Achse und mit demselben gemessenen Vorzeichen — kein zweiter Weg für dieselbe Bewegung. */
  { k:'stagger',label:'Stance · front foot forward', min:-40, max:40, step:1, unit:'°' },
  { k:'weight', label:'Pose over clip',        min:0,   max:1,   step:0.02, unit:'' },
];
export const JIGFIELDS = [
  { k:'seatDy', label:'Seat height \u0394',    min:-0.6, max:0.6, step:0.01 },
  { k:'armDy',  label:'Armrest height \u0394', min:-0.6, max:0.6, step:0.01 },
  { k:'armDx',  label:'Armrest width \u0394',  min:-0.4, max:0.6, step:0.01 },
  { k:'armDz',  label:'Armrest reach \u0394',  min:-0.5, max:0.6, step:0.01 },
  { k:'ctrlDy', label:'Controls height \u0394',min:-0.6, max:0.8, step:0.01 },
  { k:'ctrlDz', label:'Controls reach \u0394', min:-0.5, max:0.8, step:0.01 },
  /* v15 · Georg 12.09.: »wide = Hände auf dem Wannenrand, festhalten — Arme weiter/enger«.
     Zwei Verschiebungen auf den gemessenen Armlehnenpunkt, damit derselbe Griff später auch
     Buch und Zeitung trägt. */
  { k:'gripDx', label:'Grip · hands wider \u0394', min:-0.3, max:0.6, step:0.01 },
  { k:'gripDy', label:'Grip · hands higher \u0394', min:-0.3, max:0.6, step:0.01 },
];
/* v15 · die Attrappe steht auf AUS. Georg 12.09.: »zwei dünne Linien, die mit dem Modell wackeln und
   keine Entsprechung im Modell haben« — gemessen waren es genau diese zwei Linienobjekte unter
   `pose-jig`. Eine Messhilfe, die niemand angefordert hat, ist im Bild ein Rätsel. */
export const DEFAULTS = { on:false, preset:'armchair', weight:1, jig:false, stagger:0,
  seatDy:0, armDy:0, armDx:0, armDz:0, ctrlDy:0, ctrlDz:0, gripDx:0, gripDy:0, ...PRESETS.armchair };

const norm = (s) => String(s || '').replace(/[.\s_-]/g, '').toLowerCase();

export class PoseRig {
  constructor(o) {
    this.T = o.THREE; this.root = o.root; this.figure = o.figure; this.fb = o.fb || null;
    this.log = o.log || (() => {});
    this.p = { ...DEFAULTS };
    this.last = { status:'INIT' };
    this.built = false; this._seatDirty = true;
  }

  /* ---------------------------------------------------------------- Aufbau */
  build() {
    const T = this.T, want = {};
    this.figure.traverse((n) => { if (n.isBone) { const k = norm(n.name); if (!want[k]) want[k] = n; } });
    const B = this.bones = {
      hips: want.hips, torso: want.torso || want.chest || want.spine,
      legs: ['l','r'].map((s) => ({ s, U: want['upperleg' + s], L: want['lowerleg' + s], F: want['foot' + s] })),
      arms: ['l','r'].map((s) => ({ s, S: want['shoulder' + s], U: want['upperarm' + s], L: want['lowerarm' + s], F: want['fist' + s] || want['hand' + s] })),
    };
    const missing = [];
    if (!B.hips) missing.push('Hips');
    B.legs.forEach((l) => { if (!l.U || !l.L || !l.F) missing.push('leg ' + l.s.toUpperCase()); });
    B.arms.forEach((a) => { if (!a.U || !a.L) missing.push('arm ' + a.s.toUpperCase()); });
    if (missing.length) { this.last = { status:'UNSUPPORTED', field:'bones', reason:'missing ' + missing.join(', ') }; return this.last; }

    /* ⚠ DIE BINDEPOSE MUSS ERST HERGESTELLT WERDEN. Wenn dieses Rig gebaut wird, läuft »Idle« schon —
       die Knochen stehen also mitten in einem Clip. Ein dort abgegriffenes »bind« wäre ein Standbild
       der Bewegung, und jede Pose stünde je nach Ladezeitpunkt woanders (»ein Ausdruck ohne
       Reifezeugnis«, Hausregel 12). `Skeleton.pose()` stellt die Bindepose per Definition her. */
    const skels = new Set();
    this.figure.traverse((n) => { if (n.isSkinnedMesh && n.skeleton) skels.add(n.skeleton); });
    skels.forEach((sk) => { try { sk.pose(); } catch (e) {} });
    this.root.updateMatrixWorld(true);
    /* Blickrichtung GEMESSEN, nicht angenommen: der Kopf-Host des Moduls trägt sie schon (sein +z ist das
       Gesicht, `faceDir` ist dort am Bild geprüft). Ohne Host: +z der Wurzel, und das steht im Bericht. */
    const fwdW = new T.Vector3(0, 0, 1);
    let fsrc = 'root +z';
    if (this.fb && this.fb.faceInner) { this.fb.faceInner.getWorldDirection(fwdW); fsrc = 'face host'; }
    const rq = this.root.getWorldQuaternion(new T.Quaternion());
    this.fwd = fwdW.clone().applyQuaternion(rq.clone().invert()).setY(0).normalize();   // Wurzelraum
    if (!isFinite(this.fwd.x) || this.fwd.lengthSq() < 0.01) this.fwd.set(0, 0, 1);
    this.side = new T.Vector3(0, 1, 0).cross(this.fwd).normalize();                     // Querachse, Wurzelraum
    this.up = new T.Vector3(0, 1, 0);
    const sideW = this.side.clone().applyQuaternion(rq);
    const fwdWr = this.fwd.clone().applyQuaternion(rq);

    /* Je Knochen: Bindedrehung merken und die WELT-Querachse in sein eigenes System rechnen. */
    const prep = (b, axisW) => { if (!b) return; b.userData.kfbBind = b.quaternion.clone();
      const wq = b.getWorldQuaternion(new T.Quaternion()).invert();
      b.userData.kfbSide = axisW.clone().applyQuaternion(wq).normalize();
      b.userData.kfbFwd = fwdWr.clone().applyQuaternion(wq).normalize(); };
    prep(B.torso, sideW);
    B.legs.forEach((l) => { prep(l.U, sideW); prep(l.L, sideW); prep(l.F, sideW); });
    B.arms.forEach((a) => { prep(a.U, sideW); prep(a.L, sideW); if (a.F) prep(a.F, sideW); });

    /* ⚠ OWNER FIX 25.09. (TOOLBOX-PRODUCTION-01 Befund): Achse und Länge jedes Glieds werden aus den
       WELTPOSITIONEN der Bindepose gemessen, nicht aus `child.position`. Hängt ein Handgelenk
       (`wrist`) zwischen Unterarm und Hand, ist `hand.position` der Versatz zum Handgelenk — am
       Driver-Wirt las lenL 0,074 statt gemessen 0,334, die Hand verfehlte ihr Ziel um ~0,05.
       Zwischenknochen stehen in `c.mid`; `_solve` misst die Kette vor jedem Lösen neu (ein Clip
       beugt das Handgelenk), damit kein Verbraucher mehr selbst nachmessen muss. Beine bekommen
       dieselbe Kette (`legChains`) für Ziel-IK an Füßen — die Gelenkwinkel-Pose bleibt unberührt. */
    const mkChain = (s, U, L, F, hint, leg) => {
      const c = { s, U, L, F, mid: [], hint, leg: !!leg, target: new T.Vector3() };
      for (let p = F && F.parent; p && p !== L && p !== this.root; p = p.parent) c.mid.push(p);
      this._measureChain(c); return c;
    };
    this.chains = B.arms.map((a) => a.U && a.L ? mkChain(a.s, a.U, a.L, a.F || null, new T.Vector3(a.s === 'l' ? 1 : -1, -0.6, -0.2).normalize(), false) : null).filter(Boolean);
    const kneeHint = this.fwd.clone().add(new T.Vector3(0, -0.15, 0)).normalize();
    this.legChains = B.legs.map((l) => l.U && l.L && l.F ? mkChain(l.s, l.U, l.L, l.F, kneeHint.clone(), true) : null).filter(Boolean);

    this._calibrate();
    this._anchors();
    this._legGeomBind = this._legGeom();   // Beugung und Neigung, wie die Bindepose sie mitbringt — der Regler ist ein ZUSATZ darauf
    this._buildJig();
    this.built = true;
    /* Der Surf-Hinweis lebt in WURZELKOORDINATEN wie die anderen Hinweise auch. */
    _SURF_HINT = new T.Vector3(0, -1, -0.35).normalize();
    this.last = { status:'OK', facing:fsrc, signs:this.signs, hipY:+this.a.hipY.toFixed(3) };
    this.log('pose rig · facing ' + fsrc + ' · signs hip ' + this.signs.hip + ' / knee ' + this.signs.knee
      + ' / spread ' + this.signs.spread + ' / lean ' + this.signs.lean + ' · arms ' + this.chains.length);
    return this.last;
  }

  /* EICHUNG: 6° drehen, das Kind messen, Vorzeichen behalten, zurückdrehen. Ein Vorzeichen, das sich
     aus der Bewegung ergibt, kann falsch sein — eines, das man annimmt, merkt man erst am Bild. */
  _calibrate() {
    const T = this.T, q = new T.Quaternion(), v = new T.Vector3(), B = this.bones;
    const wp = (b) => { this.root.updateMatrixWorld(true); return this.root.worldToLocal(b.getWorldPosition(new T.Vector3())); };
    const probe = (bone, child, pick) => {
      if (!bone || !child) return 1;
      const before = wp(child);
      bone.quaternion.copy(bone.userData.kfbBind).multiply(q.setFromAxisAngle(bone.userData.kfbSide, 6 * DEG));
      const after = wp(child);
      bone.quaternion.copy(bone.userData.kfbBind);
      this.root.updateMatrixWorld(true);
      return pick(v.copy(after).sub(before)) >= 0 ? 1 : -1;
    };
    const L = B.legs[0], A = B.arms[0];
    this.signs = {
      hip:   probe(L.U, L.L, (d) => d.dot(this.fwd)),                    // + = Knie nach vorn
      knee:  probe(L.L, L.F, (d) => -d.dot(this.fwd)),                   // + = Fuß nach hinten (Beugung)
      spread:1, lean: probe(B.torso, B.hips.parent === B.torso ? B.hips : (A.U || L.U), (d) => d.dot(this.fwd)),
    };
    /* Spreizen dreht um die BLICKACHSE, nicht um die Querachse — eigene Probe, je Bein gespiegelt. */
    const sp = (leg) => { if (!leg.U) return 1;
      const before = wp(leg.L);
      leg.U.quaternion.copy(leg.U.userData.kfbBind).multiply(q.setFromAxisAngle(leg.U.userData.kfbFwd, 6 * DEG));
      const after = wp(leg.L);
      leg.U.quaternion.copy(leg.U.userData.kfbBind); this.root.updateMatrixWorld(true);
      const out = v.copy(after).sub(before).dot(this.side) * (leg.s === 'l' ? 1 : -1);
      return out >= 0 ? 1 : -1; };
    this.signs.spread = sp(B.legs[0]);
    /* ⚠ GEMESSEN 12.09. (Georg: »›knees apart‹ verschiebt beide in EINE Richtung«): `sp()` liefert
       schon das Vorzeichen, das das Knie NACH AUSSEN dreht — es spiegelt intern nach Seite. Das
       zusätzliche `* -1` hier war eine zweite Spiegelung obendrauf, und zwei Spiegelungen heben sich
       auf: beide Knie wanderten um +0,0359 bzw. +0,0360 in dieselbe Richtung (Seitenachse, bei
       Spreizen 0 → 25). Ohne den Faktor sind die Wege entgegengesetzt — das ist Spreizen. */
    this.signs.spreadR = sp(B.legs[1]);
  }

  /* Anker aus der BINDEPOSE (Wurzelraum): Hüfte, Schultern, Armlängen. Maßstab für alles Weitere. */
  _anchors() {
    const T = this.T, B = this.bones;
    this.root.updateMatrixWorld(true);
    const P = (b) => this.root.worldToLocal(b.getWorldPosition(new T.Vector3()));
    const hips = P(B.hips), sL = B.arms[0].U ? P(B.arms[0].U) : hips.clone(), sR = B.arms[1].U ? P(B.arms[1].U) : hips.clone();
    const armLen = (this.chains[0] ? this.chains[0].lenU + this.chains[0].lenL : 0.9);
    this.a = { hips, hipY:hips.y, shoulderY:(sL.y + sR.y) / 2, shoulderX:Math.abs(sL.x), armLen, seatY:hips.y - 0.20 };
  }

  /* Die Attrappe: nur Linien und Marken. Kein Möbelstück — eine Messhilfe, an der die Pose eingestellt
     wird. Alles trägt `noMeasure` (Hausregel 7), sonst verschiebt sie den Boden unter der Figur. */
  _buildJig() {
    const T = this.T, g = this.jig = new T.Group(); g.name = 'pose-jig';
    const line = (col) => new T.LineSegments(new T.BufferGeometry(), new T.LineBasicMaterial({ color:col, transparent:true, opacity:0.75, depthTest:true }));
    this.jSeat = line(0x4d7488); this.jArm = line(0x8e8878); g.add(this.jSeat, this.jArm);
    this.jSeat.name = 'pose-jig · Sitzlinie'; this.jArm.name = 'pose-jig · Armlehne';   // v15: benannt, damit eine Linie im Bild zuordenbar ist
    const dot = (col, r) => { const m = new T.Mesh(new T.SphereGeometry(r, 16, 12), new T.MeshBasicMaterial({ color:col, transparent:true, opacity:0.85 })); m.userData.noMeasure = true; m.userData.petOverlay = true; return m; };
    this.jBall = dot(0xe96049, 0.075);                       // Joystick-Kugel (Weltmaß ≈ 3,4 cm)
    this.jBtn = [dot(0xf2c93c, 0.062), dot(0xf2c93c, 0.062)];  // zwei große Knöpfe
    g.add(this.jBall, this.jBtn[0], this.jBtn[1]);
    g.traverse((o) => { o.userData.noMeasure = true; o.userData.petOverlay = true; o.renderOrder = 4; });
    g.visible = !!(this.p.on && this.p.jig);   // sonst liegt die Sitzlinie unter einer stehenden Figur, bevor jemand die Pose eingeschaltet hat
    this.root.add(g);
  }

  /* ------------------------------------------------------------- Steuerung */
  set(v) {
    const before = JSON.stringify(this.p);
    Object.assign(this.p, v || {});
    if (v && v.preset && PRESETS[v.preset]) Object.assign(this.p, PRESETS[v.preset], { preset:v.preset });
    if (JSON.stringify(this.p) !== before) this._seatDirty = true;
    if (this.jig) this.jig.visible = !!(this.p.on && this.p.jig);
    return this.p;
  }

  /* Sitzfläche = gemessene UNTERSEITE von Becken und Oberschenkeln, nicht die Hüfthöhe minus Daumenwert.
     Zugriffsfunktion statt Rohpuffer (Hausregel 7); einmal je Änderung, nicht je Bild. */
  _measureSeat() {
    const T = this.T, v = new T.Vector3(), keep = new Set();
    const add = (b) => { if (b) b.traverse((n) => keep.add(n)); };
    add(this.bones.hips); this.bones.legs.forEach((l) => add(l.U));
    this.bones.legs.forEach((l) => { if (l.L) l.L.traverse((n) => keep.delete(n)); });
    let minY = Infinity, n = 0, zMin = Infinity, zMax = -Infinity;
    this.figure.traverse((m) => {
      if (!m.isSkinnedMesh || m.userData.noMeasure) return;
      const g = m.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, arr = m.skeleton && m.skeleton.bones;
      if (!si || !arr) return;
      for (let i = 0; i < g.attributes.position.count; i++) {
        let best = 0, bw = -1;
        for (let j = 0; j < 4; j++) { const w = sw.getComponent(i, j); if (w > bw) { bw = w; best = si.getComponent(i, j); } }
        if (!keep.has(arr[best])) continue;
        m.getVertexPosition(i, v); m.localToWorld(v); this.root.worldToLocal(v);
        if (v.y < minY) minY = v.y;
        const z = v.dot(this.fwd); if (z < zMin) zMin = z; if (z > zMax) zMax = z;
        n++;
      }
    });
    this.seat = { y:isFinite(minY) ? minY : this.a.hipY - 0.2, depth:isFinite(zMin) ? zMax - zMin : 0.8, verts:n };
    this._seatDirty = false;
  }

  /* ---------------------------------------------------------------- Rechnen */
  apply() {
    if (!this.built || !this.p.on) return;
    const T = this.T, P = this.p, S = this.signs, q = new T.Quaternion(), tmp = new T.Quaternion();
    const w = Math.max(0, Math.min(1, P.weight));
    const put = (b, axis, deg) => { if (!b) return;
      tmp.copy(b.userData.kfbBind).multiply(q.setFromAxisAngle(axis, deg * DEG));
      b.quaternion.slerp(tmp, w); };
    put(this.bones.torso, this.bones.torso && this.bones.torso.userData.kfbSide, S.lean * P.lean);
    this.bones.legs.forEach((l, i) => {
      if (!l.U) return;
      const spreadSign = i === 0 ? S.spread : S.spreadR;
      /* v16 · der Beinversatz sitzt auf demselben Hüftwinkel, je Bein gegenläufig. Damit gilt die
         Fußkorrektur unten weiter — sie muss den WIRKLICHEN Hüftwinkel zurücknehmen, nicht den
         eingestellten; sonst kippt beim Surf-Versatz genau eine Sohle weg. */
      const hipDeg = P.hip + (i === 0 ? 1 : -1) * (P.stagger || 0);
      tmp.copy(l.U.userData.kfbBind)
        .multiply(q.setFromAxisAngle(l.U.userData.kfbSide, S.hip * hipDeg * DEG))
        .multiply(q.setFromAxisAngle(l.U.userData.kfbFwd, spreadSign * P.spread * DEG));
      l.U.quaternion.slerp(tmp, w);
      put(l.L, l.L.userData.kfbSide, S.knee * P.knee);
      /* Fuß: die Drehungen darüber werden zurückgenommen, damit die Sohle waagerecht bleibt; `toe` legt
         danach drauf. Spreizen und Neigung bleiben unberücksichtigt — benannt, nicht versteckt. */
      put(l.F, l.F.userData.kfbSide, -(S.hip * hipDeg + S.knee * P.knee) + S.hip * P.toe);
    });
    this.root.updateWorldMatrix(true, true);
    if (this._seatDirty) this._measureSeat();
    this._placeJig();
    if (P.hands !== 'free' && w > 0.5) { for (const c of this.chains) { c.target.copy(this._handTarget(c.s)); this._solve(c); } }
  }

  _jigGeom() {
    const A = this.a, P = this.p, s = this.seat || { y:A.hipY - 0.2, depth:0.8 };
    const seatY = s.y + P.seatDy, halfW = A.shoulderX + 0.30, d = Math.max(0.45, s.depth * 0.9);
    const armY = seatY + (A.shoulderY - seatY) * 0.42 + P.armDy;
    const armX = A.shoulderX + 0.22 + P.armDx, armZ = 0.10 + P.armDz;
    const ctrlY = seatY + (A.shoulderY - seatY) * 0.55 + P.ctrlDy, ctrlZ = 0.34 + A.armLen * 0.42 + P.ctrlDz;
    return { seatY, halfW, d, armY, armX, armZ, ctrlY, ctrlZ };
  }
  _handTarget(side) {
    const T = this.T, j = this._jigGeom(), sgn = side === 'l' ? 1 : -1;
    const out = new T.Vector3();
    if (this.p.hands === 'controls') {
      const p = side === 'l' ? this.jBall.position : this.jBtn[0].position.clone().add(this.jBtn[1].position).multiplyScalar(0.5);
      return out.copy(p).addScaledVector(this.up, 0.19);   // die Faust sitzt ÜBER der Kugel, sonst steckt sie darin
    }
    /* v15 · »wide« — beide Hände AUSSEN auf Randhöhe, symmetrisch: festhalten. Ausgangspunkt ist
       derselbe gemessene Armlehnenpunkt wie bei »rest«, nur weiter außen und höher; `gripDx`/`gripDy`
       sind die beiden Regler dazu. Später trägt derselbe Griff Buch und Zeitung. */
    /* v16 · »surf« — beide Arme AUSSEN zum Balancieren, leicht ausgestreckt (nicht durchgedrückt:
       0,72 der gemessenen Armlänge, der Rest bleibt Beugung). Die Hand auf der Seite des vorderen
       Beins geht ein Stück mit nach vorn, sonst steht der Oberkörper schräg und die Arme parallel —
       genau das, was eine Surfhaltung unglaubwürdig macht. */
    if (this.p.hands === 'surf') {
      /* ⚠ GEMESSEN NACH DEM ERSTEN EINGRIFF: ein Ziel aus ABSOLUTEN Koordinaten (Schulterbreite +
         Reichweite × 0,78) lag links bei **1,037 der Reichweite** — außerhalb. Der Löser klemmt
         dann auf die Strecklage, der Arm steht durchgedrückt und sieht gebrochen aus, und die
         Ellbogenebene ist wieder unbestimmt. Das Ziel wird deshalb VOM SCHULTERPUNKT AUS gesetzt:
         Richtung × 0,82 der Reichweite. Damit ist das Verhältnis gebaut, nicht gehofft — auf
         beiden Seiten gleich, unabhängig von Schulterlage und Rumpfdrehung. */
      const ch = this.chains.find((q) => q.s === side);
      if (!ch) return out.set(0, 0, 0);
      const reach = ch.lenU + ch.lenL;
      const sh = this.root.worldToLocal(ch.U.getWorldPosition(new T.Vector3()));
      const dir = new T.Vector3()
        .addScaledVector(this.side, sgn * 1.0)
        .addScaledVector(this.up, -0.22)                                   // Hände unter Schulterhöhe
        .addScaledVector(this.fwd, 0.14 + (side === 'l' ? 1 : -1) * ((this.p.stagger || 0) / 45) * 0.22)
        .normalize();
      return out.copy(sh).addScaledVector(dir, reach * 0.82)
        .addScaledVector(this.side, sgn * this.p.gripDx)
        .addScaledVector(this.up, this.p.gripDy);
    }
    if (this.p.hands === 'wide') {
      return out.copy(this.side).multiplyScalar(sgn * (j.armX + 0.12 + this.p.gripDx))
        .addScaledVector(this.up, j.armY + 0.16 + this.p.gripDy)
        .addScaledVector(this.fwd, j.armZ + 0.06);
    }
    return out.copy(this.side).multiplyScalar(sgn * j.armX).addScaledVector(this.up, j.armY + 0.07).addScaledVector(this.fwd, j.armZ + 0.16);
  }
  _placeJig() {
    const T = this.T, j = this._jigGeom();
    const pt = (x, y, z) => new T.Vector3().addScaledVector(this.side, x).addScaledVector(this.up, y).addScaledVector(this.fwd, z);
    const rect = (obj, x0, x1, y, z0, z1) => {
      const c = [pt(x0, y, z0), pt(x1, y, z0), pt(x1, y, z1), pt(x0, y, z1)], v = [];
      for (let i = 0; i < 4; i++) { v.push(c[i].x, c[i].y, c[i].z); const n = c[(i + 1) % 4]; v.push(n.x, n.y, n.z); }
      obj.geometry.dispose(); obj.geometry = new T.BufferGeometry().setAttribute('position', new T.Float32BufferAttribute(v, 3));
    };
    rect(this.jSeat, -j.halfW, j.halfW, j.seatY, -j.d * 0.55, j.d * 0.55);
    const armV = [];
    [1, -1].forEach((s) => {
      const c = [pt(s * j.armX - 0.06, j.armY, j.armZ - 0.22), pt(s * j.armX + 0.06, j.armY, j.armZ - 0.22),
                 pt(s * j.armX + 0.06, j.armY, j.armZ + 0.30), pt(s * j.armX - 0.06, j.armY, j.armZ + 0.30)];
      for (let i = 0; i < 4; i++) { armV.push(c[i].x, c[i].y, c[i].z); const n = c[(i + 1) % 4]; armV.push(n.x, n.y, n.z); }
    });
    this.jArm.geometry.dispose(); this.jArm.geometry = new T.BufferGeometry().setAttribute('position', new T.Float32BufferAttribute(armV, 3));
    this.jBall.position.copy(pt(0.24, j.ctrlY, j.ctrlZ));
    this.jBtn[0].position.copy(pt(-0.20, j.ctrlY - 0.04, j.ctrlZ));
    this.jBtn[1].position.copy(pt(-0.40, j.ctrlY - 0.04, j.ctrlZ - 0.06));
    const ctrl = this.p.hands === 'controls';
    this.jBall.visible = ctrl; this.jBtn[0].visible = ctrl; this.jBtn[1].visible = ctrl;
    this.jArm.visible = this.p.hands === 'rest';
  }

  /* Zweiknochen-Löser, wörtlich aus driver.v2.js (Kosinussatz + Ellbogen-Hinweis). */
  _solve(c) {
    this._measureChain(c);
    const T = this.T, S = new T.Vector3(), u = new T.Vector3(), v = new T.Vector3(), E = new T.Vector3();
    c.U.getWorldPosition(S); this.root.worldToLocal(S);
    u.copy(c.target).sub(S); let d = u.length(); u.divideScalar(d || 1);
    const a = c.lenU, b = c.lenL;
    d = Math.min(Math.max(d, Math.abs(a - b) + 0.01), a + b - 0.01);
    const cosA = (a * a + d * d - b * b) / (2 * a * d), sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
    /* ⚠ v16-S5 · GEMESSENE URSACHE DES WACKELNDEN ARMS (Georg 13.09.: »rechter Arm ist broken und
       wackelt/dreht sich«): der Ellbogen-Hinweis steht fest auf L [1,−.6,−.2] / R [−1,−.6,−.2] —
       also fast PARALLEL zur Armachse, sobald der Arm zur Seite zeigt (Surfhaltung). Was nach dem
       Herausprojizieren von `u` übrig bleibt, ist dann ein Rest nahe null, und seine Richtung
       springt mit jedem Bild, das die laufende Bildschleife den Schulterknochen bewegt. Nicht der
       Löser ist kaputt, die Ellbogenebene ist entartet.
       Zwei Eingriffe: eine Haltung darf ihren eigenen Hinweis mitbringen (`c.hintFor`), und die
       Schwelle für den Notausgang steigt von 1e–6 auf 0,05 — fast entartet ist auch entartet. */
    const hint = (!c.leg && this.p.hands === 'surf' && _SURF_HINT) ? _SURF_HINT : c.hint;
    v.copy(hint).addScaledVector(u, -hint.dot(u));
    if (v.lengthSq() < 0.05 * 0.05) { v.set(0, -1, 0).addScaledVector(u, -u.y); if (v.lengthSq() < 1e-6) v.set(0, 0, -1).addScaledVector(u, u.z); }
    v.normalize();
    E.copy(S).addScaledVector(u, a * cosA).addScaledVector(v, a * sinA);
    this._aim(c.U, c.aU, E); this._aim(c.L, c.aL, c.target);
    /* Die HAND gehört zu keiner der beiden Ketten — der Löser faßt sie nie an, also dreht die
       laufende Bildschleife sie weiter. Genau das sieht man als sich drehende Faust. Sie geht auf
       ihre Bindelage zurück; die ist gemessen und liegt seit dem Bau in `userData.kfbBind`. */
    if (c.F && c.F.userData.kfbBind) { c.F.quaternion.copy(c.F.userData.kfbBind); c.F.updateWorldMatrix(false, true); }
  }
  /* Kette messen (Owner-Fix 25.09.): Achse im System des Knochens = Richtung zum nächsten Glied,
     mit der eigenen Skalierung des Knochens (ein Clip darf Skalenspuren tragen); Längen im Wurzelraum. */
  _measureChain(c) {
    const T = this.T, R = this.root; R.updateMatrixWorld(true);
    const wU = c.U.getWorldPosition(new T.Vector3()), wL = c.L.getWorldPosition(new T.Vector3());
    c.aU = c.U.worldToLocal(wL.clone()).multiply(c.U.scale).normalize();
    c.lenU = R.worldToLocal(wU.clone()).distanceTo(R.worldToLocal(wL.clone()));
    if (c.F) {
      const wF = c.F.getWorldPosition(new T.Vector3());
      c.aL = c.L.worldToLocal(wF.clone()).multiply(c.L.scale).normalize();
      c.lenL = R.worldToLocal(wL.clone()).distanceTo(R.worldToLocal(wF.clone()));
    } else { c.aL = c.L.position.clone().normalize(); c.lenL = c.L.position.length() * 0.8; }
    return c;
  }
  /* Öffentliche Ziel-IK (Studio + Animation Lab teilen sie): key = handL|handR|footL|footR,
     target im Wurzelraum. weight < 1 mischt mit dem, was der Clip geschrieben hat. */
  ikChain(key) {
    const s = String(key).slice(-1).toLowerCase(), list = /^foot/i.test(key) ? this.legChains : this.chains;
    return (list || []).find((c) => c.s === s) || null;
  }
  effector(key, out) {
    const c = this.ikChain(key); if (!c) return null;
    this.root.updateMatrixWorld(true);
    return this.root.worldToLocal((c.F || c.L).getWorldPosition(out || new this.T.Vector3()));
  }
  solveIK(key, target, weight = 1) {
    const c = this.ikChain(key); if (!c || !target) return null;
    const q0 = [c.U.quaternion.clone(), c.L.quaternion.clone(), c.F ? c.F.quaternion.clone() : null];
    c.target.copy(target); this._solve(c);
    if (weight < 0.999) {
      c.U.quaternion.slerpQuaternions(q0[0], c.U.quaternion.clone(), weight);
      c.L.quaternion.slerpQuaternions(q0[1], c.L.quaternion.clone(), weight);
      if (c.F && q0[2]) c.F.quaternion.slerpQuaternions(q0[2], c.F.quaternion.clone(), weight);
      c.U.updateWorldMatrix(false, true);
    }
    return c;
  }
  chainReport() {
    const r = {};
    for (const c of (this.chains || []).concat(this.legChains || [])) {
      const k = (c.leg ? 'foot' : 'hand') + c.s.toUpperCase();
      r[k] = { U: c.U.name, L: c.L.name, F: c.F ? c.F.name : null, mid: c.mid.map((m) => m.name), lenU: +c.lenU.toFixed(4), lenL: +c.lenL.toFixed(4),
        naiveLenL: c.F ? +c.F.position.length().toFixed(4) : null };
    }
    return r;
  }
  _aim(bone, axis, target) {
    const T = this.T, tW = new T.Vector3(), tP = new T.Vector3();
    bone.parent.updateWorldMatrix(true, false);
    this.root.localToWorld(tW.copy(target));
    bone.parent.worldToLocal(tP.copy(tW));
    tP.sub(bone.position).normalize();
    bone.quaternion.setFromUnitVectors(axis, tP);
    bone.updateWorldMatrix(false, true);
  }

  /* Kniebeugung und Oberschenkelneigung aus den KNOCHENRICHTUNGEN, nicht aus dem Regler. */
  _legGeom() {
    const T = this.T, l = this.bones.legs[0];
    this.root.updateMatrixWorld(true);
    const P = (b) => this.root.worldToLocal(b.getWorldPosition(new T.Vector3()));
    const hip = P(l.U), knee = P(l.L), ankle = P(l.F);
    const thigh = knee.clone().sub(hip).normalize(), shin = ankle.clone().sub(knee).normalize();
    return {
      knee: +(Math.acos(Math.max(-1, Math.min(1, thigh.dot(shin)))) / DEG).toFixed(1),
      pitch: +(Math.asin(Math.max(-1, Math.min(1, -thigh.y))) / DEG).toFixed(1),
    };
  }

  /* ---------------------------------------------------------------- Abnahme */
  report() {
    if (!this.built) return this.last;
    const T = this.T, P = (b) => this.root.worldToLocal(b.getWorldPosition(new T.Vector3()));
    this.root.updateMatrixWorld(true);
    const j = this._jigGeom(), out = { status:'OK', schema:SCHEMA, preset:this.p.preset, on:this.p.on };
    /* Der Kniewinkel wird aus den KNOCHENRICHTUNGEN gemessen, nicht vom Regler abgelesen — sonst
       bestätigt die Abnahme nur die Eingabe (Hausregel: eine Zahl, die nicht durchfallen kann). Der
       Regler ist ein ZUSATZ auf die Bindepose, also ist die prüfbare Zahl die DIFFERENZ zu ihr:
       `kneeDelta` muß dem Regler entsprechen, sonst greift Achse oder Vorzeichen daneben. */
    const g = this._legGeom(), gb = this._legGeomBind || { knee:0, pitch:0 };
    out.kneeMeasured = g.knee; out.kneeBind = gb.knee;
    out.kneeDelta = +(g.knee - gb.knee).toFixed(1); out.kneeWanted = this.p.on ? this.p.knee : 0;
    out.thighPitch = g.pitch;
    /* `pitch` ist +90° im Stand (Oberschenkel zeigt nach unten) und 0°, wenn er waagerecht nach vorn
       steht — die Drehung NACH VORN ist also die Abnahme des Wertes. */
    out.hipDelta = +(gb.pitch - g.pitch).toFixed(1); out.hipWanted = this.p.on ? this.p.hip : 0;
    if (this._seatDirty) this._measureSeat();
    out.seatY = +j.seatY.toFixed(3);
    out.thighUnder = +this.seat.y.toFixed(3);
    out.seatGap = +(this.seat.y - j.seatY).toFixed(3);
    out.footY = +Math.min(P(this.bones.legs[0].F).y, P(this.bones.legs[1].F).y).toFixed(3);
    out.hipY = +P(this.bones.hips).y.toFixed(3);
    out.hands = {};
    for (const c of this.chains) {
      const f = P(c.F || c.L), t = this._handTarget(c.s);
      out.hands[c.s.toUpperCase()] = { at:f.toArray().map((x) => +x.toFixed(3)), miss:+f.distanceTo(t).toFixed(3) };
    }
    out.jig = { seatY:+j.seatY.toFixed(3), armY:+j.armY.toFixed(3), armX:+j.armX.toFixed(3), ctrlY:+j.ctrlY.toFixed(3), ctrlZ:+j.ctrlZ.toFixed(3) };
    return (this.last = out);
  }

  /* Was das Fahrzeug bekommt: keine Möbel, sondern Winkel und Anker in MODULEINHEITEN. */
  exportPose(context) {
    const r = this.report(), j = this._jigGeom(), T = this.T;
    const P = (b) => this.root.worldToLocal(b.getWorldPosition(new T.Vector3()));
    const v3 = (v) => v.toArray().map((x) => +x.toFixed(4));
    return {
      schema:SCHEMA, actorId:'frizzlebob', context:context || (this.p.preset === 'bath' ? 'bath_relaxed' : 'open_cockpit'),
      unit:'module units (figure as delivered)', up:'+Y', forward:v3(this.fwd),
      angles:{ hip:this.p.hip, knee:this.p.knee, toe:this.p.toe, spread:this.p.spread, lean:this.p.lean },
      anchors:{
        hip:v3(P(this.bones.hips)),
        seat:{ y:+j.seatY.toFixed(4), width:+(j.halfW * 2).toFixed(4), depth:+j.d.toFixed(4) },
        foot:{ L:v3(P(this.bones.legs[0].F)), R:v3(P(this.bones.legs[1].F)) },
        hand:{ L:v3(this._handTarget('l')), R:v3(this._handTarget('r')) },
        control:{ joystick:v3(this.jBall.position), buttons:[v3(this.jBtn[0].position), v3(this.jBtn[1].position)] },
      },
      measured:{ kneeAngle:r.kneeMeasured, kneeAtBind:r.kneeBind, kneeDelta:r.kneeDelta, thighPitch:r.thighPitch, seatGap:r.seatGap, footY:r.footY, handMiss:r.hands },
      note:'Jig is a measuring aid; the vehicle owns seat, armrests, joystick and buttons. Hand anchors are the contract.',
    };
  }

  dispose() {
    const restore = (b) => { if (b && b.userData.kfbBind) b.quaternion.copy(b.userData.kfbBind); };
    if (this.bones) { restore(this.bones.torso); this.bones.legs.forEach((l) => { restore(l.U); restore(l.L); restore(l.F); }); this.bones.arms.forEach((a) => { restore(a.U); restore(a.L); restore(a.F); }); }
    if (this.jig && this.jig.parent) this.jig.parent.remove(this.jig);
    if (this.jig) this.jig.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    this.built = false;
  }
}
export default PoseRig;
