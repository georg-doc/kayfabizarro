/* seat-lab.v1.js — SITZPROBE UND FAHR-ACTING (P33 §9–§13)
 *
 * Zwei Dinge, die zusammengehören, weil sie dieselbe Figur an derselben Stelle anfassen:
 *
 * 1. **Sitzprofile.** Ein Profil ist eine Sammlung von Werten für das vorhandene `PoseRig` —
 *    Hüfte, Knie, Zehen, Spreizen, Neigung, dazu die Versätze der Messhilfe (Sitzhöhe, Armlehne).
 *    Kein Profil bringt eine neue Rechenmaschine mit. Das Briefing (§12) ist hier ausdrücklich:
 *    keine IK-Architektur, bevor »Clip + Sitzanker + Versatz« sichtbar scheitert.
 *
 * 2. **Fahr-Acting.** Die fünf Zustände, die im Zuordnungsblatt `PROCEDURAL` heißen, haben keinen
 *    Clip beim Spender — und sollen auch keinen bekommen. Sie sind eine RECHNUNG auf den
 *    Fahrzeugzustand: Lenken neigt den Oberkörper zur Seite, Gas legt ihn zurück, Bremse nach
 *    vorn, Luft spannt ihn an, Landung stößt ihn kurz. Der Kopf hält dagegen, wie ein Kopf das tut.
 *    ⚠ Das ist Darstellung, nicht Physik: diese Schicht LIEST einen Fahrzeugzustand und schreibt
 *    ihn nie (Briefing §1, harte Owner-Regel).
 *
 * Die Schicht rechnet NACH Mixer und Pose und multipliziert auf das, was dort steht — sie ersetzt
 * nichts, sie legt darauf. Deshalb braucht sie keinen eigenen Gewichtsregler.
 */

const DEG = Math.PI / 180;
export const SCHEMA = 'kfb.seat-profiles.v0';

/* Die Werte sind ANFANGSWERTE zum Messen, keine Wahrheiten. `bath` und `armchair` kommen aus den
   Voreinstellungen des Pose-Rigs (v13) und bleiben dort die Quelle; die drei neuen sind
   Arbeitsstände, die in der Sitzprobe nachgemessen und überschrieben werden. */
export const PROFILES = [
  { id:'neutral_chair', label:'Stuhl', preset:'armchair', preferredState:'SitVehicle',
    pose:{ hip:88, knee:92, toe:0, spread:8, lean:-4, hands:'rest' }, jig:{ seatDy:0, armDy:0, armDx:0, armDz:0 },
    notes:'Der Bezugsfall. Alles andere wird an ihm gemessen.' },
  { id:'bathtub', label:'Badewanne', preset:'bath', preferredState:'SitVehicle', tub:'bath', race:true,
    pose:{ hands:'free' }, jig:{},
    notes:'Der Pflichttest (§11) — nach dem Rezept des Rennens, nicht nach einem eigenen Sitzlöser: die Wanne kommt auf ihre gemessene Breite, die Figur sinkt bis 0,28 unter den Wasserspiegel, die Beine werden NICHT gebeugt, sondern verdeckt. Geprüft wird deshalb Sichtbarkeit, nicht Geometrie.' },
  { id:'truck', label:'Lastwagen', preset:'armchair', preferredState:'DriveIdle',
    pose:{ hip:92, knee:86, toe:-4, spread:10, lean:2, hands:'controls' }, jig:{ seatDy:0.04, armDy:0.02, armDx:0, armDz:0.06, ctrlDy:0.06, ctrlDz:0.10 },
    notes:'Aufrecht, Lenkrad hoch und nah. Hände an den Bedienteilen, nicht auf der Lehne.' },
  { id:'pickup', label:'Pickup', preset:'armchair', preferredState:'DriveIdle',
    pose:{ hip:86, knee:96, toe:0, spread:9, lean:-6, hands:'controls' }, jig:{ seatDy:0, armDy:0, armDx:0, armDz:0.02, ctrlDy:0, ctrlDz:0.04 },
    notes:'Zwischen Stuhl und Lastwagen. Der Fall, an dem sich zeigt, ob ein Profilwechsel überhaupt etwas ändert.' },
  { id:'mech', label:'Mech', preset:'armchair', preferredState:'DriveIdle',
    pose:{ hip:80, knee:104, toe:6, spread:20, lean:-10, hands:'controls' }, jig:{ seatDy:0.10, armDy:0.10, armDx:0.10, armDz:-0.04, ctrlDy:0.10, ctrlDz:-0.06 },
    notes:'Tief in der Schale, Knie weit, Steuerknüppel dicht am Körper.' },
];
export const BY_ID = (id) => PROFILES.find((p) => p.id === id) || PROFILES[0];

/* ══ Abnahme ═══════════════════════════════════════════════════════════════════════════════════
   Die Zahlen kommen aus `PoseRig.report()` (dort aus den KNOCHENRICHTUNGEN gemessen, nicht vom
   Regler abgelesen) plus zwei, die nur hier zu holen sind: Kopfhöhe über der Sitzfläche und die
   Fußlage vor der Sitzkante.
   ⚠ WAS DIESE PROBE NICHT BEANTWORTET: ob die Beine durch die Wanne stechen. Dafür bräuchte es die
   Wanne als Netz. Solange sie fehlt, ist »clippt nicht« keine Messung, sondern eine Hoffnung —
   das steht so im Bericht, statt daß eine grüne Zahl es überdeckt. */
export function measure(THREE, pose, figure, pen, vis, fit) {
  if (!pose || !pose.built) return { status:'NO_POSE' };
  /* ⚠ GEMESSEN, weil es einmal eine grüne Zahl für nichts gab: beim Platformer-FrizzleBob hängt
     `FootL` am **Root**, nicht am Unterschenkel. Der Kniewinkel wird aus (Knöchel − Knie) gebildet —
     bewegt sich der Knöchel nicht mit, bleibt die Zahl auf dem Bindewert stehen und sieht dabei
     völlig gesund aus. Ist die Kette nicht geschlossen, gibt es hier KEINE Kniezahl. */
  const l = pose.bones.legs[0];
  let chained = false; { let n = l.F; while (n) { if (n === l.L) { chained = true; break; } n = n.parent; } }
  const r = pose.report();
  const box = new THREE.Box3().setFromObject(figure);
  const rootY = pose.root.getWorldPosition(new THREE.Vector3()).y;
  const topY = box.max.y - rootY;                       // Wurzelraum, wie alles andere im Bericht
  const seatY = r.jig.seatY;
  const handMiss = Math.max(...Object.values(r.hands || {}).map((h) => h.miss || 0), 0);
  /* ⚠ EIN FELD IST GENAU DANN GÜLTIG, WENN SEIN ERZEUGER GELAUFEN IST — UND DAS WIRD HIER GEFRAGT,
     NICHT ANGENOMMEN. Zwei Runden lang gab es zwei fest verdrahtete Ergebnisformen (Löser an /
     Löser aus); jede Zustandskombination, die ich nicht vorhergesehen hatte, rutschte durch. So
     stand `miss: 0,465` in der Übergabedatei, obwohl `hands: 'free'` gar kein Handziel setzt — das
     Tor hing am Löser, nicht an der Hand. Jetzt eine Form, und je Feld ein Wenn. */
  const solverOff = !pose.p.on;                 // Gelenkwinkel, Sitzebene
  const handsOff = solverOff || pose.p.hands === 'free';   // Handziele
  const V = (on, v) => (on ? v : null);
  const out = {
    status:'OK',
    solver: solverOff ? 'off' : 'on',
    handSolver: handsOff ? 'off' : pose.p.hands,
    notes: [
      solverOff ? 'Sitzlöser aus: Knie, Hüfte, Sitzabstand und Kopffreiheit sind nicht gemessen, sondern null.' : null,
      handsOff && !solverOff ? 'Hände dem Clip überlassen (`hands: free`): es gibt kein Handziel, also auch keine Abweichung — null statt einer Zahl, die nichts mißt.' : null,
    ].filter(Boolean),
    kneeAngle: V(!solverOff, r.kneeMeasured), kneeDelta: V(!solverOff, r.kneeDelta), kneeWanted: V(!solverOff, r.kneeWanted),
    hipDelta: V(!solverOff, r.hipDelta), hipWanted: V(!solverOff, r.hipWanted),
    seatY: V(!solverOff, seatY), seatGap: V(!solverOff, r.seatGap),
    hipY: r.hipY, footY: r.footY,
    headTop: +topY.toFixed(3), headClearance: V(!solverOff, +(topY - seatY).toFixed(3)),
    handMiss: V(!handsOff, +handMiss.toFixed(3)), hands: V(!handsOff, r.hands),
  };
  /* Abnahmekriterien §11, als VERHÄLTNIS und mit benannter Schwelle — eine nackte Zahl kann nicht
     durchfallen. Kniebeugung: der Regler ist ein Zusatz auf die Bindepose, also ist die prüfbare
     Größe die Differenz, und die muß dem Regler folgen (Toleranz 12°). */
  out.checks = solverOff ? [] : [
    chained
      ? { id:'knee', label:'Knie folgt dem Regler', ok: Math.abs(r.kneeDelta - r.kneeWanted) <= 12,
          got: r.kneeDelta + '° von ' + r.kneeWanted + '° gewünscht' }
      : { id:'knee', label:'Knie NICHT MESSBAR — der Fuß hängt nicht am Unterschenkel', ok:false,
          got: 'Kette ' + l.F.name + ' ← ' + (l.F.parent ? l.F.parent.name : '?') + ' statt ' + l.L.name },
    { id:'hip', label:'Hüfte folgt dem Regler', ok: Math.abs(r.hipDelta - r.hipWanted) <= 14,
      got: r.hipDelta + '° von ' + r.hipWanted + '° gewünscht' },
    { id:'seat', label:'Gesäß liegt auf der Sitzfläche, steht nicht darüber', ok: Math.abs(r.seatGap) <= 0.08,
      got: 'Abstand ' + r.seatGap.toFixed(3) + ' (Grenze 0,080)' },
    { id:'hands', label: handsOff ? 'Hände — dem Clip überlassen, nicht geprüft' : 'Hände erreichen ihr Ziel',
      ok: handsOff ? true : handMiss <= 0.12,
      got: handsOff ? 'kein Handziel gesetzt' : 'größte Abweichung ' + handMiss.toFixed(3) + ' (Grenze 0,120)' },
    /* ⚠ KEIN PRÜFPUNKT OHNE MASSSTAB. »Kopffreiheit« war erst eine Spanne von 0,6 bis 2,2 — eine
       Zahl, die ich mir ausgedacht hatte, und prompt fielen zwei Profile durch, ohne daß irgendwo
       ein Dach war. Kopffreiheit ist erst prüfbar, wenn ein Cockpit eine Decke hat. Bis dahin wird
       die Höhe BERICHTET, nicht benotet. */
  ];
  out.headNote = 'Kopf ' + out.headClearance.toFixed(3) + ' über der Sitzfläche (Ohrenspitze eingerechnet) — prüfbar erst gegen eine Cockpit-Decke.';
  /* Der Pflichttest §11, sobald ein Möbelstück da ist: kein Beinpunkt unter dem Innenboden, keiner
     seitlich durch die Wand, keiner vorn oder hinten hinaus. */
  if (pen) out.checks.push({ id:'tub', label:'Beine bleiben in der Wanne', ok: pen.ok,
    got: (pen.below > 0.02 ? pen.below.toFixed(3) + ' unter dem Boden (' + pen.at + ')' : 'nichts unter dem Boden')
       + ' · ' + (pen.side > 0.02 ? pen.side.toFixed(3) + ' durch die Wand' : 'nichts durch die Wand')
       + ' · ' + (pen.end > 0.02 ? pen.end.toFixed(3) + ' über das Ende' : 'nichts über das Ende') });
  /* ⚠ DER PRÜFPUNKT, DER GEFEHLT HAT: ob die Figur das Möbelstück überhaupt AUSFÜLLT. Ohne ihn
     konnte »kleiner Punkt in einer viel zu großen Wanne« 5/5 bestehen. Als VERHÄLTNIS mit benannter
     Schwelle, und der Beinlöser sagt dazu, ob das Bein das Ende überhaupt erreichen konnte. */
  if (fit && fit.fillsLength != null) out.checks.push({ id:'fill',
    label:'Figur füllt das Möbelstück', ok: fit.fillsLength >= 0.45,
    got: 'Bein überspannt ' + Math.round(fit.fillsLength * 100) + ' % der Innenlänge (Schwelle 45 %) · '
       + fit.aspectNote });
  /* Der Prüfpunkt, auf den es nach dem Rennen wirklich ankommt: nicht ob ein Bein draußen liegt,
     sondern ob man es SIEHT. Ein Bein im Wannenboden ist erlaubt — ein sichtbares nicht. */
  /* Der Sichtbarkeitstest gehört zur VERSTECK-Strategie des Rennens: dort liegen die Beine
     geometrisch draußen und dürfen nur nicht zu sehen sein. Sind die Beine richtig GELÖST, ist die
     Frage gegenstandslos — dann sagt der `tub`-Test schon, daß nichts draußen liegt, und »von oben
     sieht man die Beine« ist keine Rüge, sondern der Sinn einer offenen Wanne. Deshalb: Prüfpunkt
     nur bei abgeschaltetem Löser, sonst reine Angabe. */
  if (vis && solverOff) out.checks.push({ id:'seen', label:'Kein Bein sichtbar — geprüft über ' + vis.views.length + ' feste Ansichten', ok: vis.seen === 0,
    got: Math.round(vis.hiddenShare * 100) + ' % verdeckt (' + vis.hidden + ' von ' + vis.checks + ' Prüfungen)'
       + (vis.worst && vis.worst.seen ? ' · schlechteste Ansicht »' + vis.worst.view + '«: ' + vis.worst.seen + ' von ' + vis.worst.of + ' sichtbar' : ' · keine Ansicht zeigt ein Bein')
       + ' · ' + vis.aboveWater + ' Punkte liegen über dem Spiegel (dürfen gesehen werden)' });
  else if (vis) out.visNote = Math.round(vis.hiddenShare * 100) + ' % der Beinpunkte unter Wasser sind aus den '
    + vis.views.length + ' Prüfansichten verdeckt (nur Angabe — die Beine sind gelöst, nicht versteckt).';
  out.passed = out.checks.filter((c) => c.ok).length;
  out.kneeMeasurable = chained;
  out.notMeasured = pen ? ['Kopffreiheit — es gibt keine Decke, gegen die sie zu prüfen wäre.']
    : ['Beine gegen die Wannenwand — es ist kein Möbelstück geladen, also gibt es dazu keine Zahl.',
       'Kopffreiheit — es gibt keine Cockpit-Decke, gegen die sie zu prüfen wäre.'];
  if (pen) out.pen = pen;
  if (vis) out.vis = vis;
  if (fit) out.fit = fit;
  /* Was NICHT gemessen ist, und der Handel, den das Rennrezept eingeht — an einer Stelle, damit
     beides auch in der Übergabedatei steht und nicht nur am Bildschirm. */
  out.limits = [];
  if (pen && pen.below > 0.02) out.limits.push('Handel des Rennrezepts: ' + pen.below.toFixed(3)
    + ' Bein steckt unter dem Wannenboden. Unsichtbar (siehe Sichtbarkeitsprüfung), aber geometrisch vorhanden.');
  else if (pen) out.limits.push('Beindurchdringung GEMESSEN gegen das geladene Möbelstück: '
    + pen.below.toFixed(3) + ' unter dem Boden, ' + pen.side.toFixed(3) + ' durch die Wand, ' + pen.end.toFixed(3) + ' über das Ende.');
  out.limits = out.limits.concat(out.notes || [], out.notMeasured);
  return out;
}

/** Setzt das Armlehnen-Δ so, daß die Lehne auf der GEMESSENEN Ellbogenhöhe liegt statt auf einem Anteil. */
export function armrestToElbow(THREE, pose) {
  if (!pose || !pose.built || !pose.chains.length) return null;
  pose.root.updateMatrixWorld(true);
  const P = (b) => pose.root.worldToLocal(b.getWorldPosition(new THREE.Vector3()));
  const elbowY = pose.chains.reduce((a, c) => a + P(c.L).y, 0) / pose.chains.length;
  const j = pose._jigGeom();
  const dy = +(elbowY - (j.armY - pose.p.armDy)).toFixed(3);
  return { armDy: dy, elbowY: +elbowY.toFixed(3), was: +j.armY.toFixed(3), becomes: +(j.armY - pose.p.armDy + dy).toFixed(3) };
}

/** Zieht die Sitzfläche der Messhilfe auf die GEMESSENE Unterseite von Becken und Oberschenkeln.
    Vorher war `seatDy` je Profil ein Daumenwert — und die Wanne stand 0,100 daneben. */
export function seatToBody(pose) {
  if (!pose || !pose.built) return null;
  const r = pose.report();
  return { seatDy: +(pose.p.seatDy + r.seatGap).toFixed(3), was: r.seatY, gapWas: r.seatGap };
}

/** ⚠ DIE ARMLÄNGE WAR FALSCH GEMESSEN, UND ZWAR ZU KURZ.
    `PoseRig` bildet die Unterarmlänge als `fist.position.length()` — das ist der Abstand zum
    ELTERNKNOCHEN. Beim Platformer-Hasen stimmt das (Unterarm → Faust direkt). Beim KayKit-Rig
    hängt dazwischen ein Handgelenk: `lowerarm → wrist → hand`. Gemessen wurde deshalb **0,074**
    statt der echten Strecke, die Reichweite kam als 0,316 heraus, das Ziel lag bei 0,438 — und der
    Löser streckte den Arm vergeblich. Genau das sah Georg als hängende Arme.
    Hier wird die Kette ABGELAUFEN und aufsummiert, statt einen Schritt für das Ganze zu nehmen. */
export function fixChainLengths(pose) {
  if (!pose || !pose.built) return null;
  const walk = (from, to) => { let d = 0, n = to; while (n && n !== from) { d += n.position.length(); n = n.parent; } return n === from ? d : null; };
  const out = [];
  for (const c of pose.chains) {
    const u = walk(c.U, c.L), l = c.F ? walk(c.L, c.F) : null;
    const before = { lenU: +c.lenU.toFixed(3), lenL: +c.lenL.toFixed(3) };
    if (u) c.lenU = u;
    if (l) c.lenL = l;
    out.push({ side: c.s, before, after: { lenU: +c.lenU.toFixed(3), lenL: +c.lenL.toFixed(3) } });
  }
  return out;
}

/** ⚠ DER ARM IST SO LANG, WIE ER IST. Die Lehne außen und vorn zu setzen ist billig — die Faust
    kommt dann nicht hin, und die Abnahme meldet 0,206 Abweichung (gemessen, Stuhl). Also wird das
    Ziel auf die GEMESSENE Reichweite hereingezogen, statt den Fehler stehen zu lassen. */
export function armrestToReach(THREE, pose) {
  if (!pose || !pose.built || !pose.chains.length) return null;
  const P = (b) => pose.root.worldToLocal(b.getWorldPosition(new THREE.Vector3()));
  let worst = 0, reach = 0;
  pose.root.updateMatrixWorld(true);
  for (const c of pose.chains) {
    const shoulder = P(c.U), t = pose._handTarget(c.s);
    const need = shoulder.distanceTo(t), can = (c.lenU + c.lenL) * 0.95;
    reach = Math.max(reach, can);
    worst = Math.max(worst, need - can);
  }
  if (worst <= 0) return { armDx:0, armDz:0, slack:+(-worst).toFixed(3), reach:+reach.toFixed(3) };
  /* Den Überhang je zur Hälfte aus Breite und Tiefe nehmen — beides ist gleich schuld. */
  const dx = -(worst * 0.6), dz = -(worst * 0.4);
  return { armDx:+dx.toFixed(3), armDz:+dz.toFixed(3), over:+worst.toFixed(3), reach:+reach.toFixed(3) };
}

/* ══ Fahr-Acting ═══════════════════════════════════════════════════════════════════════════════
   Ausschläge in Grad. Sie sind ANFANGSWERTE und stehen hier an einer Stelle, damit ein Regler sie
   später ändern kann, ohne sie zu suchen. */
export const GAINS = { steerRoll:14, steerYaw:6, accelPitch:7, brakePitch:10, airPitch:12, landPitch:16, headCounter:0.45 };
/* Wie schnell ein Kanal seinem Ziel folgt (Sekunden bis ~63 %) und ob er von selbst abklingt. */
const CH = {
  steer:    { tau:0.18, decay:0 },
  accel:    { tau:0.25, decay:0 },
  brake:    { tau:0.12, decay:0 },
  airborne: { tau:0.15, decay:0 },
  landing:  { tau:0.05, decay:2.6 },   // Stoß: schnell hin, von selbst zurück
};

export class DriveActing {
  constructor(o) {
    this.T = o.THREE; this.pose = o.pose; this.figure = o.figure;
    this.on = false;
    this.tgt = { steer:0, accel:0, brake:0, airborne:0, landing:0 };
    this.cur = { steer:0, accel:0, brake:0, airborne:0, landing:0 };
    this.head = null;
    if (this.figure) this.figure.traverse((n) => { if (!this.head && n.isBone && /^(head|neck)$/i.test(n.name)) this.head = n; });
  }
  /** Ein Kanal, ein Wert. `pulse` setzt ihn und läßt ihn von selbst zurückfallen. */
  set(k, v) { if (k in this.tgt) { this.tgt[k] = v; this.on = true; } return this; }
  pulse(k, v) { this.set(k, v); if (CH[k] && !CH[k].decay) { clearTimeout(this._t && this._t[k]); (this._t = this._t || {})[k] = setTimeout(() => { this.tgt[k] = 0; }, 900); } return this; }
  clear() { for (const k in this.tgt) this.tgt[k] = 0; return this; }

  update(dt) {
    if (!this.on || !this.pose || !this.pose.built) return;
    let live = 0;
    for (const k in this.cur) {
      const c = CH[k], a = 1 - Math.exp(-dt / Math.max(0.01, c.tau));
      this.cur[k] += (this.tgt[k] - this.cur[k]) * a;
      if (c.decay) { this.tgt[k] *= Math.exp(-dt * c.decay); if (Math.abs(this.tgt[k]) < 0.003) this.tgt[k] = 0; }
      if (Math.abs(this.cur[k]) > 0.002) live++;
    }
    if (!live) { this.on = Object.values(this.tgt).some((v) => Math.abs(v) > 0.002); return; }
    const T = this.T, C = this.cur, G = GAINS, q = new T.Quaternion();
    const roll = C.steer * G.steerRoll;
    const pitch = -C.accel * G.accelPitch + C.brake * G.brakePitch + C.airborne * G.airPitch + C.landing * G.landPitch;
    const t = this.pose.bones.torso;
    if (t) {
      /* Auf das MULTIPLIZIEREN, was Mixer und Pose gerade geschrieben haben — nicht auf die
         Bindepose. Sonst löscht diese Schicht den Clip, statt ihn zu färben. */
      t.quaternion.multiply(q.setFromAxisAngle(t.userData.kfbFwd, -roll * DEG));
      t.quaternion.multiply(q.setFromAxisAngle(t.userData.kfbSide, pitch * DEG));
    }
    if (this.head && this.head.userData.kfbFwd) {
      this.head.quaternion.multiply(q.setFromAxisAngle(this.head.userData.kfbFwd, roll * G.headCounter * DEG));
      this.head.quaternion.multiply(q.setFromAxisAngle(this.head.userData.kfbSide, -pitch * G.headCounter * DEG));
    }
    this._last = { roll:+roll.toFixed(1), pitch:+pitch.toFixed(1) };
    this.pose.root.updateWorldMatrix(true, true);
  }
  /** Bereitet den Kopfknochen so vor, wie das Pose-Rig es für seine Knochen tut (Achsen im Knochenraum). */
  prepHead() {
    if (!this.head || !this.pose || !this.pose.built || this.head.userData.kfbSide) return;
    const T = this.T, rq = this.pose.root.getWorldQuaternion(new T.Quaternion());
    const wq = this.head.getWorldQuaternion(new T.Quaternion()).invert();
    this.head.userData.kfbSide = this.pose.side.clone().applyQuaternion(rq).applyQuaternion(wq).normalize();
    this.head.userData.kfbFwd = this.pose.fwd.clone().applyQuaternion(rq).applyQuaternion(wq).normalize();
  }
  report() { return { on:this.on, target:{ ...this.tgt }, current:{ ...this.cur }, applied:this._last || null, head:this.head ? this.head.name : null }; }
}

/* ══ DAS MÖBELSTÜCK ════════════════════════════════════════════════════════════════════════════
   ⚠ GEORGS BEFUND, UND ER HAT RECHT: die Badewannen-Werte waren GERATEN. »Flacher sitzen, Beine
   weiter ausgestreckt« ist eine Beschreibung, keine Messung — und solange keine Wanne da war,
   konnte auch nichts durchfallen. Ein Prüfpunkt, der nicht durchfallen kann, ist keiner.
   Ab hier wird das echte Modell geladen und ABGETASTET: Boden, Rand, Innenmaße per Strahlen von
   oben. Danach ist »die Füße stecken durch« eine Zahl. */
export const TUBS = {
  bath: { id:'bath', label:'Badewanne',
    path:'Bubbly_Bathroom_Tiny_Treats_1-1/Assets/gltf/bath.gltf', mesh:'bath', water:'bath_water' },
};

/** Tastet ein Möbelstück von oben ab: Innenboden, Randhöhe, Innenmaße. Keine Annahme über die Form. */
export function measureTub(THREE, obj, meshName, waterName) {
  const mesh = meshName ? obj.getObjectByName(meshName) : obj;
  const target = mesh || obj;
  target.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(target);
  const rc = new THREE.Raycaster(), down = new THREE.Vector3(0, -1, 0), top = box.max.y + 1;
  const hits = [];
  const nx = 21, nz = 31;
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
    const x = box.min.x + (box.max.x - box.min.x) * (i + 0.5) / nx;
    const z = box.min.z + (box.max.z - box.min.z) * (j + 0.5) / nz;
    rc.set(new THREE.Vector3(x, top, z), down);
    const h = rc.intersectObject(target, true);
    if (h.length) hits.push({ x, z, y: h[0].point.y, n: h.length });
  }
  if (!hits.length) return null;
  /* Der INNENBODEN ist die häufigste Höhe unter der halben Bauhöhe — eine große ebene Fläche, die
     von oben sichtbar ist. Der RAND ist die häufigste Höhe darüber (ohne den Hahn, der als
     Einzelspitze auffällt und in keinem Häufigkeitsgipfel landet). */
  const mid = (box.min.y + box.max.y) / 2;
  const mode = (list) => { const h = new Map(); list.forEach((q) => { const k = Math.round(q.y * 100); h.set(k, (h.get(k) || 0) + 1); });
    let best = null; h.forEach((n, k) => { if (!best || n > best[1]) best = [k, n]; }); return best ? { y: best[0] / 100, n: best[1] } : null; };
  const lo = mode(hits.filter((q) => q.y < mid)), hi = mode(hits.filter((q) => q.y >= mid));
  if (!lo) return null;
  const floorPts = hits.filter((q) => Math.abs(q.y - lo.y) < 0.02);
  const xs = floorPts.map((q) => q.x), zs = floorPts.map((q) => q.z);
  let water = null;
  const wm = waterName ? obj.getObjectByName(waterName) : null;
  if (wm) { const wb = new THREE.Box3().setFromObject(wm); water = { topY:+wb.max.y.toFixed(3), centerZ:+((wb.min.z + wb.max.z) / 2).toFixed(3) }; }
  return {
    floorY: +lo.y.toFixed(3), floorPts: floorPts.length,
    rimY: hi ? +hi.y.toFixed(3) : null,
    depth: hi ? +(hi.y - lo.y).toFixed(3) : null,
    innerX: [+Math.min(...xs).toFixed(3), +Math.max(...xs).toFixed(3)],
    innerZ: [+Math.min(...zs).toFixed(3), +Math.max(...zs).toFixed(3)],
    innerW: +(Math.max(...xs) - Math.min(...xs)).toFixed(3),
    innerL: +(Math.max(...zs) - Math.min(...zs)).toFixed(3),
    outer: { size: box.getSize(new THREE.Vector3()).toArray().map((v) => +v.toFixed(3)) },
    water,
    peak: +box.max.y.toFixed(3),
  };
}

/** ⚠ MASSSTAB AUS DEM KÖRPER, NICHT AUS DER POSE. Erster Versuch nahm die Strecke Hüfte→Ferse in
    der Sitzhaltung — die ist bei 46° Kniebeugung nur 0,237 lang, und die Wanne schrumpfte auf ein
    Puppenmaß (Innenlänge 0,32 bei einer 1,6 hohen Figur). Die Bezugsgröße ist die BEINKETTE in
    ihrer vollen Länge plus Rumpftiefe, und die ist von der Haltung unabhängig.
    Zwei Bedingungen, die größere gewinnt: die Figur muß der Länge nach hineinpassen UND der Breite
    nach. Welche bindet, steht im Bericht. */
export function fitTub(THREE, tubObj, tm, pose, clearance) {
  const P = (b) => pose.root.worldToLocal(b.getWorldPosition(new THREE.Vector3()));
  pose.root.updateMatrixWorld(true);
  const seg = (from, to) => { let d = 0, n = to; while (n && n !== from) { d += n.position.length(); n = n.parent; } return n === from ? d : 0; };
  const l = pose.bones.legs[0];
  const legLen = seg(l.U, l.L) + seg(l.L, l.F) + (l.F.children[0] ? l.F.children[0].position.length() : 0);
  const hipDepth = Math.abs(P(pose.bones.torso).y - P(pose.bones.hips).y) + legLen * 0.12;
  const shoulderW = pose.a && pose.a.shoulderX ? pose.a.shoulderX * 2 : legLen * 0.7;
  const c = clearance || 1.2;
  /* Innenlänge = ausgestrecktes Bein plus Gesäß. `hipDepth` war erst der Abstand Brust→Hüfte — das
     ist eine RumpfhÖHE, keine Sitztiefe, und die Wanne wurde breiter als lang. */
  const wantL = legLen * c, wantW = shoulderW * 1.2;
  const kL = wantL / tm.innerL, kW = wantW / tm.innerW;
  const k = Math.max(kL, kW), binds = kL >= kW ? 'Länge' : 'Breite';
  tubObj.scale.setScalar(k);
  /* Ausrichtung: die Längsachse der Wanne (z) auf die Blickrichtung der Figur drehen. */
  tubObj.rotation.set(0, Math.atan2(pose.fwd.x, pose.fwd.z), 0);
  const seatY = pose._jigGeom().seatY;
  const hip = P(pose.bones.hips);
  /* Rücken an das hintere Ende: die Hüfte sitzt ein Stück vor der Rückwand, die Beine zeigen nach
     vorn. Innenboden GENAU auf der Sitzebene. */
  const innerMidZ = (tm.innerZ[0] + tm.innerZ[1]) / 2 * k;
  const rearToHip = legLen * 0.22;
  const centerAhead = (tm.innerL * k) / 2 - rearToHip;
  tubObj.position.set(
    hip.x + pose.fwd.x * centerAhead - pose.fwd.x * 0 - innerMidZ * pose.fwd.x,
    seatY - tm.floorY * k,
    hip.z + pose.fwd.z * centerAhead - innerMidZ * pose.fwd.z);
  tubObj.updateMatrixWorld(true);
  /* ⚠ EINE ZAHL, DIE NICHT SCHÖN IST UND DESHALB ERST RECHT DASTEHT: die Wanne ist ein flaches
     Modell (Tiefe = 15 % der Länge). Skaliert man sie auf die Beinlänge, reicht ihr Rand der Figur
     nur bis zur Hüfte. Das ist die Form des Spenders, keine Schwierigkeit des Grafts — aber es
     gehört gemeldet, nicht übersehen. */
  const shoulderY = pose.a && pose.a.shoulderY != null ? pose.a.shoulderY : null;
  const rimAt = tm.rimY != null ? tubObj.position.y + tm.rimY * k : null;
  return { scale:+k.toFixed(4), binds, legLen:+legLen.toFixed(3), hipDepth:+hipDepth.toFixed(3),
    shoulderW:+shoulderW.toFixed(3), innerLenAfter:+(tm.innerL * k).toFixed(3),
    innerWidthAfter:+(tm.innerW * k).toFixed(3), depthAfter: tm.depth != null ? +(tm.depth * k).toFixed(3) : null,
    floorAt:+seatY.toFixed(3), rimAt: rimAt != null ? +rimAt.toFixed(3) : null,
    rimVsSeated: (rimAt != null && shoulderY != null)
      ? +((rimAt - seatY) / Math.max(0.01, shoulderY - seatY)).toFixed(2) : null };
}

/** ⚠ DIE FRAGE, DIE GEORG GESTELLT HAT: stecken die Füße durch? Jetzt eine Zahl statt einer
    Hoffnung. Abgetastet werden Oberschenkel, Schienbein und Fuß beider Beine (je 5 Punkte entlang
    des Knochens) gegen den GEMESSENEN Innenraum — zu tief, zu weit außen, zu weit vorn/hinten. */
/** ⚠ DIE HALTUNG KOMMT AUS DEM MÖBELSTÜCK, NICHT AUS EINER VOREINSTELLUNG.
    Die alten Wannenwerte (Hüfte 68°, Knie 46°) ließen die Füße unter der Sitzebene hängen — in
    einer Wanne liegen die Beine aber auf dem Boden, nach vorn ausgestreckt. Also wird der Knöchel
    AUF den gemessenen Innenboden gesetzt, so weit vorn, wie das Bein reicht, und Hüft- und
    Kniewinkel werden dazu ausgerechnet (Kosinussatz). Kein Regler, den ich mir überlegt habe. */
export function poseIntoTub(THREE, pose, tubObj, tm) {
  pose.root.updateMatrixWorld(true); tubObj.updateMatrixWorld(true);
  const P = (b) => pose.root.worldToLocal(b.getWorldPosition(new THREE.Vector3()));
  const seg = (from, to) => { let d = 0, n = to; while (n && n !== from) { d += n.position.length(); n = n.parent; } return n === from ? d : 0; };
  const l = pose.bones.legs[0];
  const a = seg(l.U, l.L), b = seg(l.L, l.F);      // Oberschenkel, Schienbein — WURZELMASS
  const hip = P(l.U);
  /* ⚠ DERSELBE EINHEITENFEHLER ZUM ZWEITEN MAL, UND ER SAH HARMLOS AUS: die Hüfte kam aus
     `root.worldToLocal` (Wurzelmaß), der Wannenboden aus `tubObj.position.y` (Weltmaß). Gemessen:
     Hüfte 0,392 gegen Boden 0,083 → »0,309 über dem Boden«, obwohl es 0,021 sind. Der Löser hielt
     das Bein deshalb für zu kurz und ließ es fast senkrecht hängen — genau das STEHEN in der Wanne,
     das Georg gesehen hat. Jetzt wird der Boden erst in dasselbe Maß geholt, in dem die
     Knochenlängen leben. */
  const k = tubObj.scale.y;   // ⚠ v15: die HÖHE des Bodens hängt am HÖHENmaßstab — seit `split` ist der Maßstab nicht mehr uniform
  const floorW = new THREE.Vector3(0, tubObj.position.y + tm.floorY * k, 0);
  const floorL = pose.root.worldToLocal(floorW);
  const dy = hip.y - floorL.y;                      // Hüfte über dem Wannenboden, WURZELMASS
  /* Vorderes Innenende, ebenfalls im Wurzelmaß und entlang der Blickrichtung gemessen. */
  const frontL = pose.root.worldToLocal(tubObj.localToWorld(new THREE.Vector3(0, 0, tm.innerZ[1])));
  const reachZ = Math.max(0.05, frontL.clone().sub(hip).dot(pose.fwd));
  const maxL = (a + b) * 0.98;
  const dz = Math.min(reachZ, Math.sqrt(Math.max(0, maxL * maxL - dy * dy)));
  const L = Math.min(maxL, Math.hypot(dz, dy));
  const cl = (v) => Math.max(-1, Math.min(1, v));
  const thetaKnee = Math.acos(cl((a * a + b * b - L * L) / (2 * a * b)));   // Innenwinkel am Knie
  const flex = 180 - thetaKnee * 180 / Math.PI;                            // so mißt `report()`
  const alpha = Math.atan2(dz, dy) + Math.acos(cl((a * a + L * L - b * b) / (2 * a * L)));
  const pitch = 90 - alpha * 180 / Math.PI;                                // 90 = senkrecht nach unten
  const gb = pose._legGeomBind || { knee:0, pitch:90 };
  return {
    hip: +(gb.pitch - pitch).toFixed(1), knee: +(flex - gb.knee).toFixed(1),
    solved:{ thighLen:+a.toFixed(3), shinLen:+b.toFixed(3), hipAboveFloor:+dy.toFixed(3),
      reachAvailable:+reachZ.toFixed(3), forward:+dz.toFixed(3), span:+L.toFixed(3),
      kneeFlexion:+flex.toFixed(1), thighPitch:+pitch.toFixed(1) },
  };
}

/* ══ DAS REZEPT AUS DEM RENNEN ═════════════════════════════════════════════════════════════════
   ⚠ ICH HABE ETWAS NEU ERFUNDEN, DAS ES SCHON GAB — UND ZWAR GENAU DAS, WAS DORT VERWORFEN WURDE.
   `frankenstein-v1/race/src/driver.v2.js`, Zeile 52, wörtlich:
     »seat mode: NO leg solve. The analytic two-bone solve bent the legs visibly (F1-S5, Georg's
      picture); the module's own pose stays, the host puts the hips under the waterline.«
   Das Rennen setzt die Figur also NICHT in die Wanne hinein, sondern SENKT sie unter den
   Wasserspiegel. Die Beine werden nicht gebeugt — sie werden verdeckt. Gemessene Werte aus
   `vehicles.v1.js`: Wannenbreite 2,1 · Fahrerhöhe 1,55 · Hüfte 0,28 unter dem Wasser.
   Referenz schlägt Beschreibung. Ab hier gilt das Rennen, nicht mein Sitzlöser. */
export const RACE = { driverHeight: 1.55, tubWidth: 2.1, lift: -0.28, forward: 0, seatBehind: 0.15 };
/* Bezugsgrößen für den Sitz, alle am KÖRPER (nicht an der Gesamthöhe — bei dieser Figur sind
   ~40 % davon Kopf und Ohren, siehe `seatLikeRace`). Anfangswerte, am Regler veränderbar. */
export const BODY_FIT = { widthPerBody: 1.25, lengthPerLeg: 1.45, depthOfTorso: 0.85, sinkOfTorso: 0.45, behindOfTorso: 0.25 };

/** ⚠ »Pose aus« läßt die Knochen STEHEN, WO SIE STANDEN. Gemessen: nach `set({on:false})` saß die
    Figur weiter in ihrer Sitzhaltung, die Hüfte lag auf 17 % der Körperhöhe, und die Wanne wurde
    auf eine Haltung gerechnet, die gar nicht mehr galt. Also wird die Bindehaltung ausdrücklich
    wiederhergestellt — dasselbe, was `dispose()` tut, nur ohne das Rig abzuräumen. */
export function releasePose(pose) {
  if (!pose || !pose.built) return false;
  const back = (b) => { if (b && b.userData.kfbBind) b.quaternion.copy(b.userData.kfbBind); };
  back(pose.bones.torso);
  pose.bones.legs.forEach((l) => { back(l.U); back(l.L); back(l.F); });
  pose.bones.arms.forEach((a) => { back(a.U); back(a.L); back(a.F); });
  pose.set({ on:false });
  pose.root.updateMatrixWorld(true);
  return true;
}

export function seatLikeRace(THREE, pose, figure, tubObj, tm, widthK, mode, lenK) {
  if (!tm || !tm.water) return null;
  pose.root.updateMatrixWorld(true);
  /* ⚠ DER MASSSTABSFEHLER, GEORGS BILD: DIE GESAMTHÖHE IST DER FALSCHE BEZUG — UND DIE EINHEITEN
     WAREN AUCH NOCH GEMISCHT. Das Rennen skaliert die Wanne an der HÖHE des Fahrers (2,1 zu 1,55).
     Bei dieser Figur sind aber rund 40 % der Höhe Kopf und Ohren; der KÖRPER, der in der Wanne
     sitzt, ist entsprechend kleiner, und die Wanne bekam das Maß eines Körpers, den es hier nicht
     gibt. Dazu kam: `pose.a` liefert Schulter 1,412 und Hüfte 0,490 in WURZELEINHEITEN, die Box3
     dagegen 1,013 in WELTMASSEN (die Bühne skaliert jeden Bewohner) — beides in eine Formel
     geschrieben rechnet Äpfel gegen Birnen.
     Ab hier ist der Bezug der KÖRPER, durchgehend in WELTMASSEN: Schulterbreite für die Breite,
     Rumpfhöhe für die Eintauchtiefe. Die Haltungsregel des Rennens (Beine nicht lösen, Figur
     absenken) bleibt — nur ihr Maßstab kommt jetzt vom Körper statt von der Ohrenspitze. */
  const wp = (b) => b.getWorldPosition(new THREE.Vector3());
  const sh = pose.bones.arms.map((a) => wp(a.U));
  const shoulderW = sh.length > 1 ? Math.abs(sh[0].x - sh[1].x) : 0;
  const shoulderY = sh.reduce((a, v) => a + v.y, 0) / Math.max(1, sh.length);
  const hipsW = wp(pose.bones.hips);
  const torso = Math.max(0.02, shoulderY - hipsW.y);
  const box = new THREE.Box3().setFromObject(figure);
  const figH = box.max.y - box.min.y;
  /* ⚠ BREITE AM SICHTBAREN KÖRPER, NICHT AM SCHULTERKNOCHEN. Der Abstand der Oberarmknochen ist
     0,177 — die Jacke ist doppelt so breit. Mit dem Knochenmaß wurde die Wanne 0,265 innen und
     damit zu klein; mit der Gesamthöhe zu groß. Die prüfbare Größe ist die BREITE der Figur im
     Bild (X-Ausdehnung), und sie ist am Regler nachstellbar. */
  const bodyW = Math.max(0.02, box.max.x - box.min.x);
  /* ⚠ EINE UNVEREINBARKEIT, DIE GEMELDET WIRD STATT ÜBERDECKT. Das Wannenmodell hat ein FESTES
     Innenverhältnis (Breite:Länge = 1,333 : 1,839 = 0,72), die Figur hat Körperbreite:Beinreichweite
     ≈ 3. Ein uniformer Maßstab kann also nur die Breite ODER die Länge treffen. Georg hat das Bild
     mit BREITE als Bezug abgenommen — dabei bleibt es. Aber die Folge (die Wanne ist deutlich länger,
     als das Bein reicht) steht jetzt als Verhältnis im Bericht, damit kein Prüfpunkt blind ist. */
  const rootScale = pose.root.getWorldScale(new THREE.Vector3()).x || 1;
  const seg = (from, to) => { let d = 0, n = to; while (n && n !== from) { d += n.position.length(); n = n.parent; } return n === from ? d : 0; };
  const lg = pose.bones.legs[0];
  const legReach = (seg(lg.U, lg.L) + seg(lg.L, lg.F)) * rootScale;   // WELTMASS
  const k = ((widthK || BODY_FIT.widthPerBody) * bodyW) / tm.innerW;
  /* ═══ v15 · DREI MASSSTÄBE, WEIL EINER NICHT REICHT ═══════════════════════════════════════
     Georg 12.09. wollte auf BEINLÄNGE umstellen. Gemessen, bevor es gebaut wurde: die Beine dieser
     Figur sind kurz (Reichweite 0,145 in Weltmaßen) und der Körper breit (0,56) — eine Wanne am
     Beinmaß hätte 0,15 Innenbreite bei 0,56 Figurenbreite; die Figur paßte nicht mehr hinein.
     Deshalb drei Stände, Vorgabe ist der GETRENNTE:
       `width` — uniform an der Breite (bisher; Wanne viel zu lang)
       `leg`   — uniform an der Beinlänge (sitzt eng, aber zu schmal für diese Figur)
       `split` — Breite aus dem Körper, Länge aus dem Bein, Höhe wie die Breite
     `split` verzerrt das Spendermodell (das gibt Breite:Länge 0,72 vor), trifft aber beide
     Bedingungen — und bei einer Wanne als FAHRZEUG ist das Maß wichtiger als die Modelltreue. */
  const kLeg = (BODY_FIT.lengthPerLeg * legReach) / tm.innerL;
  /* ═══ v15 · VON HAND, MIT DEN PROPORTIONEN DES MODELLS ═══════════════════════════════════
     Drei Anläufe, drei falsche Zahlen — und beim dritten sagte Georg das Entscheidende: »ich kann
     die gerne per Hand skalieren.« Richtig. Meine hergeleiteten Längen (Bein → Zuber, Grundriß →
     quadratische Schüssel) haben jedes Mal die Form des Spendermodells zerstört, um eine Zahl zu
     treffen, die niemand gefordert hat.
     Ab hier: **uniform** am gemessenen Sitz-Grundriß × Zugabe (Regler), Proportion des Modells
     bleibt — und ein zweiter Regler streckt die LÄNGE, wenn Georg das will. Kein Automatismus mehr.
     Die alten Stände bleiben nur als Zahlen im Bericht, nicht als Verhalten. */
  const corner = [];
  for (let i = 0; i < 8; i++) corner.push(new THREE.Vector3(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z));
  const span = (ax) => { const v = corner.map((c) => c.dot(ax)); return Math.max(...v) - Math.min(...v); };
  const footW = Math.max(0.02, span(pose.side));
  const footL = Math.max(0.02, span(pose.fwd));
  const clear = widthK || BODY_FIT.widthPerBody;
  const m = 'manual';
  const kw = (footW * clear) / tm.innerW;
  const ky = kw;
  const kl = kw * (lenK == null ? 1 : lenK);
  tubObj.scale.set(kw, ky, kl);
  tubObj.rotation.set(0, Math.atan2(pose.fwd.x, pose.fwd.z), 0);
  /* Wasserspiegel auf Taillenhöhe: die Hüfte liegt darunter, der Rumpf schaut heraus. */
  const wantWaterY = hipsW.y + torso * BODY_FIT.sinkOfTorso;
  tubObj.position.y = wantWaterY - tm.water.topY * ky;
  const backZ = tm.water.centerZ * kl, behind = torso * BODY_FIT.behindOfTorso;
  tubObj.position.x = hipsW.x - pose.fwd.x * (backZ - behind);
  tubObj.position.z = hipsW.z - pose.fwd.z * (backZ - behind);
  tubObj.updateMatrixWorld(true);
  const innerL = tm.innerL * kl;
  return {
    source: 'frankenstein-v1/race · Haltung aus driver.v2 seat mode · Maßstab ' + m + ' (v15)',
    mode: m, scaleW:+kw.toFixed(4), scaleL:+kl.toFixed(4), scaleLegOnly:+kLeg.toFixed(4), scaleWidthOnly:+k.toFixed(4),
    bodyDepth:+footL.toFixed(3), lengthNeeded:+(footL * clear).toFixed(3), widthNeeded:+(footW * clear).toFixed(3),
    footprint:[+footW.toFixed(3), +footL.toFixed(3)], clearance:+clear.toFixed(2), lenK:+(lenK == null ? 1 : lenK).toFixed(2),
    figureHeight:+figH.toFixed(3), headShare:+((box.max.y - shoulderY) / figH * 100).toFixed(0),
    bodyWidth:+bodyW.toFixed(3), shoulderWidth:+shoulderW.toFixed(3), torsoHeight:+torso.toFixed(3),
    legReach:+legReach.toFixed(3),
    tubScale:+kw.toFixed(4), innerWidthAfter:+(tm.innerW * kw).toFixed(3),
    innerLenAfter:+innerL.toFixed(3), depthAfter: tm.depth != null ? +(tm.depth * ky).toFixed(3) : null,
    /* Das Verhältnis, das die Abnahme vorher nicht kannte: wie viel der Wannenlänge das Bein überhaupt
       überspannt. Klein heißt nicht falsch — in einer langen Wanne sitzt man nun einmal vorn —, aber
       es ist die Zahl, die »kleiner Punkt in großer Wanne« sichtbar macht, ohne ein Bild zu brauchen. */
    fillsLength:+(legReach / innerL).toFixed(3),
    aspectDonor:+(tm.innerW / tm.innerL).toFixed(3),
    aspectNote: 'Uniform skaliert an der Breite. Das Modell gibt Breite:Länge = ' + (tm.innerW / tm.innerL).toFixed(2)
      + ' vor; die Figur hätte ' + (bodyW / Math.max(0.01, legReach)).toFixed(2) + '. Beides ist mit einem Maßstab nicht zu treffen — die Länge bleibt übrig.',
    waterAt:+wantWaterY.toFixed(3), hipsAt:+hipsW.y.toFixed(3),
    hipsUnderWater:+(wantWaterY - hipsW.y).toFixed(3),
    /* ⚠ ABGELEITET, NICHT KONSTANTIERT. */
    legsPosed: !!pose.p.on,
  };
}

/** ⚠ »GETROFFEN« IST NICHT »GESEHEN«. Das Rennen läßt die Beine durch den Wannenboden gehen und
    verdeckt sie mit der Schale — das ist erlaubt, solange man es nicht SIEHT. Also wird beides
    gemessen: wie weit ein Beinpunkt draußen liegt UND ob er von der Kamera aus sichtbar ist
    (Strahl zur Kamera; trifft er vorher die Wanne, ist der Punkt verdeckt). */
/** ⚠ EINE ABNAHMEZAHL DARF NICHT AM KAMERASTAND HÄNGEN. Erste Fassung strahlte von der
    Nutzerkamera — gemessen mit derselben Pose, nur vier Kamerapositionen: 18/6 · 16/8 · 24/0 · 17/7.
    »24 von 24 verdeckt« war damit ein Befund über einen Blickwinkel, nicht über den Bau. Jetzt wird
    über einen FESTEN Satz Prüfansichten gemessen (Briefing §22: Front · Seite · 3/4 · Hinten · oben)
    und als Verhältnis über alle ausgegeben, dazu die SCHLECHTESTE Ansicht mit Namen. */
export const QA_VIEWS = [
  { id:'front', f:1,  s:0,  up:0.35 },
  { id:'seite', f:0,  s:1,  up:0.35 },
  { id:'3/4',   f:0.7, s:0.7, up:0.35 },
  { id:'hinten', f:-1, s:0,  up:0.35 },
  { id:'oben',  f:0.15, s:0.15, up:2.2 },
];

export function visibility(THREE, pose, tubObj, figure, waterY) {
  if (!tubObj) return null;
  pose.root.updateMatrixWorld(true); tubObj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(figure);
  const figH = Math.max(0.1, box.max.y - box.min.y);
  const centre = pose.bones.hips.getWorldPosition(new THREE.Vector3());
  const fwd = pose.fwd.clone().applyQuaternion(pose.root.getWorldQuaternion(new THREE.Quaternion())).setY(0).normalize();
  const side = new THREE.Vector3(0, 1, 0).cross(fwd).normalize();
  /* Die Punkte werden EINMAL gesammelt — dieselbe Menge für jede Ansicht, sonst vergleicht man
     unterschiedliche Stichproben miteinander. */
  const pts = [];
  for (const l of pose.bones.legs) {
    const seq = [l.U, l.L, l.F].filter(Boolean).map((b) => b.getWorldPosition(new THREE.Vector3()));
    for (let i = 0; i < seq.length - 1; i++) for (let t = 0; t <= 1.0001; t += 0.2) pts.push(seq[i].clone().lerp(seq[i + 1], t));
  }
  const under = waterY != null ? pts.filter((p) => p.y <= waterY) : pts;
  const above = pts.length - under.length;
  const rc = new THREE.Raycaster(), dir = new THREE.Vector3();
  const views = QA_VIEWS.map((v) => {
    const camP = centre.clone()
      .addScaledVector(fwd, v.f * figH * 2.2)
      .addScaledVector(side, v.s * figH * 2.2)
      .addScaledVector(new THREE.Vector3(0, 1, 0), v.up * figH);
    let hidden = 0, seen = 0;
    for (const q of under) {
      dir.copy(q).sub(camP); const d = dir.length(); dir.divideScalar(d || 1);
      rc.set(camP, dir); rc.far = d - 0.004;
      (rc.intersectObject(tubObj, true).length ? hidden++ : seen++);
    }
    return { id:v.id, hidden, seen };
  });
  const hiddenAll = views.reduce((a, v) => a + v.hidden, 0);
  const seenAll = views.reduce((a, v) => a + v.seen, 0);
  const worst = views.reduce((a, v) => (!a || v.seen > a.seen ? v : a), null);
  const n = hiddenAll + seenAll;
  return {
    points: under.length, aboveWater: above, views,
    hidden: hiddenAll, seen: seenAll, checks: n,
    hiddenShare: n ? +(hiddenAll / n).toFixed(3) : 0,
    worst: worst ? { view:worst.id, seen:worst.seen, of:under.length } : null,
  };
}

export function penetration(THREE, pose, tubObj, tm) {
  if (!tubObj || !tm) return null;
  pose.root.updateMatrixWorld(true); tubObj.updateMatrixWorld(true);
  const k = tubObj.scale.x;
  /* Im EIGENEN Raum der Wanne rechnen, nicht in Weltachsen — sonst stimmt der Test nicht mehr,
     sobald die Wanne gedreht steht (und sie steht gedreht, sie folgt der Blickrichtung). */
  const toTub = (b) => tubObj.worldToLocal(b.getWorldPosition(new THREE.Vector3()));
  const worst = { below:0, side:0, end:0, at:null };
  let n = 0;
  for (const l of pose.bones.legs) {
    const seq = [l.U, l.L, l.F].filter(Boolean).map(toTub);
    for (let i = 0; i < seq.length - 1; i++) {
      for (let t = 0; t <= 1.0001; t += 0.25) {
        const q = seq[i].clone().lerp(seq[i + 1], t); n++;
        const below = tm.floorY - q.y;
        const side = Math.max(tm.innerX[0] - q.x, q.x - tm.innerX[1]);
        const end = Math.max(tm.innerZ[0] - q.z, q.z - tm.innerZ[1]);
        if (below > worst.below) { worst.below = below; worst.at = 'Bein ' + l.s.toUpperCase(); }
        if (side > worst.side) worst.side = side;
        if (end > worst.end) worst.end = end;
      }
    }
  }
  const sc = (v) => +Math.max(0, v * k).toFixed(3);   // zurück in Moduleinheiten der Figur
  const lim = 0.02;
  return {
    below: sc(worst.below), side: sc(worst.side), end: sc(worst.end), at: worst.at, samples: n,
    ok: sc(worst.below) <= lim && sc(worst.side) <= lim && sc(worst.end) <= lim,
  };
}

export function profilesJSON(rows, meta) {
  return {
    schema: SCHEMA, measuredAt: new Date().toISOString(),
    unit: 'Moduleinheiten der gelieferten Figur, +Y oben',
    donorRepo: (meta && meta.donorRepo) || null,
    rule: 'Jede Zahl ist im Lab gemessen. Ein Profil ohne Messung steht als `measured: null` da — keine Fantasiewerte (Briefing §25).',
    profiles: PROFILES.map((p) => {
      const m = (rows || {})[p.id] || null;
      return {
        id: p.id, label: p.label, posePreset: p.preset, preferredState: p.preferredState,
        characterScale: 1, pose: p.pose, jig: p.jig, notes: p.notes,
        measured: m ? {
          solver: m.solver || 'on', handSolver: m.handSolver || null, notes: m.notes || null,
          kneeAngle: m.kneeAngle, kneeDelta: m.kneeDelta, hipDelta: m.hipDelta,
          seatY: m.seatY, seatGap: m.seatGap, hipY: m.hipY, footY: m.footY,
          headTop: m.headTop, headClearance: m.headClearance,
          handTargets: m.hands,
          fit: m.fit || null,
          penetration: m.pen || null,
          visibility: m.vis ? { hiddenShare: m.vis.hiddenShare, hidden: m.vis.hidden, seen: m.vis.seen,
            checks: m.vis.checks, views: m.vis.views, worst: m.vis.worst, aboveWater: m.vis.aboveWater,
            method: 'Strahl je Beinpunkt zu ' + m.vis.views.length + ' FESTEN Prüfansichten (Front · Seite · 3/4 · Hinten · oben) — nicht zur Nutzerkamera' } : null,
          limits: m.limits || null,
          passed: m.passed + '/' + m.checks.length,
        } : null,
      };
    }),
    notMeasured: ['Kopffreiheit — es gibt noch keine Cockpit-Decke, gegen die sie zu prüfen wäre.'],
    tub: (meta && meta.tub) || null,
  };
}
