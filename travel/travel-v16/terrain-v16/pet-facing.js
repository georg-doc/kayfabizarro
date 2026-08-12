// ============================================================================
// pet-facing.js — KFB Travel · Slice S33b · Wohin das Pet schaut
// ----------------------------------------------------------------------------
// Portiert aus `rollercoaster-v11` (dort `this.petFacing` + Slerp zwischen
// `qTrack` und `qFace`): **im Stand dreht sich das Pet zu dir, mit Tempo in die
// Fahrtrichtung.** Drei Stellungen wie in v11 — `auto` · `player` · `track`.
//
// WARUM EIN EIGENES MODUL UND KEINE ZEILE IN `pet-kinetics.js`:
// Die Kinetik steht auf „nicht anfassen" (Briefing §8) und besitzt Squash, Lean
// und den Gehzyklus. Das Facing ist eine **dünne Schicht DANACH** — Reihenfolge-
// Kanon des Runners: Motor zuerst (PetMotion/Face/EyeRig), dann unsere Kinetik,
// dann das Facing obendrauf.
//
// **Nur die Gier wird geschrieben** (`rotation.y`), nie das ganze Quaternion:
// sonst wäre der Lean aus der Kinetik weg. Das ist der ganze Trick, mit dem sich
// zwei Systeme dasselbe Objekt teilen, ohne sich zu überschreiben.
//
// Die Mischung ist v11s Kurve: `f = clamp(1 − speed01 · 1.5, 0, 1)` — bis etwa
// zwei Drittel Höchsttempo ist das Pet also schon ganz auf Fahrtrichtung. Der
// Blick der Augen folgt separat und SANFT (`EyeRig.pointTo`), nie als Hard-Lock:
// ein Pet, dessen Pupillen kleben, sieht aus wie ein Fehler.
//
//   const facing = createPetFacing({ THREE });
//   facing.update(dt, { pet, camera, speed01 });   // NACH petKin.update
//   facing.setMode('player');
// ============================================================================

export function createPetFacing(opts = {}) {
  const THREE = opts.THREE;
  const P = Object.assign({
    mode: 'auto',        // 'auto' | 'player' | 'track'
    base: Math.PI,       // Fahrtrichtung: so wird das Pet beim Mount gesetzt (−Z)
    damp: 3.4,           // 1/s — wie schnell der Kopf der Mischung folgt
    arriveDamp: 8,       // 1/s — während der Ankunft führt die Regie, der Kopf folgt straff
    speedGain: 1.5,      // v11: f = clamp(1 − speed01 · 1.5, 0, 1)
    // **S93b · Die Pupillen haben EINEN Eigentümer, und das ist `PetFace`.** Bauanleitung §3,
    // wörtlich: „Wenn PetFace aktiv ist (Standard), gehören die Pupillen ihm — treib den Blick über
    // `pet.face`, nicht direkt über den Rig." Genau das tat dieses Modul aber: `rig.pointTo` jeden
    // Frame, gegen PetFace, das im selben Frame danach seinen eigenen Blick schreibt. Zwei Verwalter
    // derselben Pupillen — dieselbe Fehlerklasse wie der Doppel-Fade in S89g.
    // Jetzt: läuft PetFace, schweigt dieses Modul zu den Augen. Der Blick „zu uns" entsteht dann
    // dort, wo er hingehört — über den KÖRPER (die Gier unten) plus den Cursor-Blick, den der Runner
    // an `face.setCursor` gibt. `eyeMode: 'rig'` ist der Rückweg auf das alte Verhalten.
    eyeMode: 'face',     // 'face' = PetFace besitzt die Augen · 'rig' = direktes `pointTo` (alt)
    eyeTrack: true,
    // **S89d · Die Augen zielen nie auf etwas, das im Kopf steht.** Georgs Screenshot vom Anflug:
    // keine Augen im Gesicht, dafür zwei glatte Beulen zwischen den Ohren — das sind die Rückseiten
    // der Lidschalen. Ursache ist `rig.pointTo(camera.position)` ohne jede Bedingung: gegen Ende der
    // Ankunft steht die Kamera **1,8 u** vom Pet entfernt und im POV praktisch IN ihm, also zeigt das
    // Blickziel nach hinten/oben, und die Kappen drehen durch den Schädel.
    // Zwei Grenzen, beide als Verlauf: `eyeNear/eyeFar` blendet den Blick mit der Nähe auf
    // „geradeaus", und `eyeFront` tut dasselbe, sobald die Kamera seitlich hinter die Schnauze wandert.
    // Ein Blick, der nicht mehr geht, wird also weich zu einem, der geht — kein Umschalten.
    eyeNear: 3.2, eyeFar: 6.5, eyeFront: 0.22, eyeAhead: 14,
    // **S93b · Der Höhenwinkel ist das eigentliche Problem der Erzählerposition.** Gemessen im
    // Lesebild: die Gier stimmt auf **3,1°**, aber die Kamera steht **44,3° ÜBER** dem Pet (sie rahmt
    // die Karte, das Pet sitzt unten in der Ecke). Eine Gier kann dagegen nichts tun — man sieht den
    // Scheitel, nicht das Gesicht. Zwei kleine Beiträge lösen es zusammen:
    //
    //  · `tilt` — das Pet hebt den Kopf. Der Anstellwinkel gehört `pet-kinetics` (`pitch.x`, jeden
    //    Frame neu geschrieben); wir ADDIEREN danach, wie beim Yaw seit S33b, und deckeln hart.
    //    9° klingt wenig, ist bei einem Würfel-Pet aber deutlich — mehr sieht aus wie umfallen.
    //  · `gaze` — die Pupillen gehen den Rest. Das läuft über `PetFace.nudgeGaze` (Bauanleitung §4:
    //    „Blick-Impuls ohne Lidwechsel"), also über den EINEN Eigentümer der Augen, und es ist ein
    //    Impuls mit Haltezeit, kein Frame-Spam: der Cursor darf jederzeit gewinnen.
    // S93d · 0,38 rad = **21,8°** statt 9° (Georgs Entscheidung „1 klein: 22°"). Der Pivot ist der
    // Ursprung des Modells, und der liegt bei den Cube-Pets **an den Füßen** (Bauanleitung §8:
    // `object3D.position.y ≈ 0.004`) — es lehnt sich also zurück und hebt dabei die Vorderfüße, statt
    // um die Mitte zu kippen. Genau Georgs „Füße ungefähr auf der Karte", und es kostet keine Zeile.
    // Über ~25° liest es sich als Umfallen; der Deckel ist die Grenze, nicht der Zielwert.
    tiltMax: 0.38, tiltGain: 0.55,       // rad · Anteil des Höhenwinkels
    // **S94a · Worauf das Pet aufsetzt.** Gemessen im Lesebild (Sitzraum, Sitzebene = 0):
    // Hinterbein −0,041 · Vorderbein **+0,081**. Die Lehne von 21,8° dreht um den Ursprung, und der
    // liegt zwischen den Beinen — also HEBT sie die Vorderpfoten zwangsläufig um sin(21,8°) · z ≈ 0,07.
    // Genau das ist Georgs „das ganze Pet schwebt": das Auge liest die vorderen Pfoten, und die einzige
    // Pfote mit Kontakt war die hintere, die die Clip-Ebene sowieso wegschneidet.
    // Also setzt der VORDERE Kontakt auf; was dabei unter das Papier taucht, ist genau der Fall, für den
    // `rig.applyClip` da ist. `plant: 'lowest'` ist der Rückweg auf „tiefster Punkt".
    plant: 'front',
    gazeGain: 1.15, gazeEvery: 0.30, gazeHold: 0.45,   // Blick-Impuls: Stärke, Abstand, Haltezeit
    // **S94a · Die Blick-Achse des Rigs zeigt zu Modell-−X. Am Bild gemessen, nicht hergeleitet.**
    // Zwei Standbilder, Pet zur Kamera, Blick fest gehalten: `face.setCursor(+1)` legt die Pupillen an
    // den **linken** Augenrand, `(−1)` an den rechten (scraps/gaze-plus-face.png · gaze-minus-face.png).
    // Der Impuls unten rechnete aber mit +X (`_e.x` = Kamera im Modellraum) — er schickte den Blick also
    // systematisch WEG von der Kamera. Und weil er übernimmt, sobald die Hand 2,4 s ruht, war genau das
    // Georgs „die Pupillen folgen in die falsche Richtung": der Cursor-Blick zog richtig, der Impuls
    // danach falsch zurück. Zwei Schreiber, ein Vorzeichen — deshalb steht es EINMAL hier und wird vom
    // Runner über `gazeSign` mitgelesen, statt in jedem Modul neu geraten zu werden.
    gazeSign: -1,
    // **S93c · Der Cursor gewinnt, solange die Hand führt.** `PetFace.setCursor` löst sich nach 2,4 s
    // von selbst in den Drift (§7e) — genau so lange schweigt der Blick-Impuls hier, sonst zieht er
    // den Cursor-Blick alle 0,3 s zur Kamera zurück. Zwei Schreiber auf denselben Pupillen war der
    // Fehler aus S89g; die Lösung ist nicht „schneller", sondern EINE Reihenfolge.
    gazeIdle: 2.4,
  }, opts.params || {});

  const _v = new THREE.Vector3();
  const _e = new THREE.Vector3();
  let lastEye = { k: 1, front: 1, dist: 0 }, lastDrop = 0;
  let curYaw = P.base, blend = 0, lastYawTo = 0, lastMix = 0, lastArrive = 0, lastOwns = false;
  let curTilt = 0, gazeT = 0, lastGaze = { x: 0, y: 0, elev: 0 }, lastPlant = null;
  // **S93f · Wer kippt, muss auch aufsetzen.** Eine Lehne von 21,8° dreht das Pet um seinen Ursprung,
  // und der liegt NICHT auf der Fußsohle: gemessen reichen die Beine 0,089 u (bei Maßstab 1,45) unter
  // den Ursprung. Beim Kippen wandert der tiefste Punkt zusätzlich nach unten — das ist die zweite
  // Hälfte von Georgs „floatet und leicht schräg". Also rechnet der Besitzer der Lehne auch die
  // Aufsetz-Korrektur: tiefster Punkt der gedrehten Hülle zurück auf die Sitzebene.
  // ADDITIV auf `position.y`, weil PetMotion dort seine Sprünge und Stauchungen schreibt (Kanon-
  // Reihenfolge: Kinetik und Motion zuerst, Facing danach).
  let bbox = null, bboxFor = null;   // Hülle in Pet-Koordinaten, einmal je Pet gemessen
  // **S94a · Die Ecken EINER Gesamt-Hülle sind Phantompunkte.** Der erste Anlauf nahm ymin/ymax des
  // ganzen Pets gegen zmin/zmax des ganzen Pets — Kombinationen wie „Ohrenspitze am Schwanzende", an
  // denen kein Dreieck liegt. Gedreht wurde daraus ein zu tiefer „tiefster Punkt", und das Pet stieg.
  // Richtig sind die Ecken JE TEIL (Beinkästen sind echte Kästen) — und mit ihnen weiß man auch, WELCHE
  // Pfote vorn ist. Einmal je Pet gemessen, danach nur noch 8 Punkte pro Teil transformieren.
  let corners = null, cornersFor = null;
  function measureCorners(pet) {
    const o = pet.object3D; o.updateWorldMatrix(true, true);
    const inv = o.matrixWorld.clone().invert();
    const pts = [];
    o.traverse((n) => {
      if (!n.isMesh || !n.geometry || n.visible === false) return;
      n.geometry.computeBoundingBox(); const b = n.geometry.boundingBox; if (!b) return;
      const front = /front|vorn/i.test(n.name || '');
      for (const cx of [b.min.x, b.max.x]) for (const cy of [b.min.y, b.max.y]) for (const cz of [b.min.z, b.max.z]) {
        _v.set(cx, cy, cz).applyMatrix4(n.matrixWorld).applyMatrix4(inv);
        pts.push({ v: _v.clone(), front });
      }
    });
    if (!pts.length) return null;
    // Kein Teil heißt „front"? Dann ist vorn, was vor dem Ursprung liegt — das Gesicht ist +Z (S93b).
    if (!pts.some((p) => p.front)) for (const p of pts) p.front = p.v.z > 0;
    return pts;
  }
  function measureBox(pet) {
    const o = pet.object3D; o.updateWorldMatrix(true, true);
    const inv = o.matrixWorld.clone().invert();
    let ymin = 1e9, ymax = -1e9, zmin = 1e9, zmax = -1e9, got = false;
    o.traverse((n) => {
      if (!n.isMesh || !n.geometry) return;
      n.geometry.computeBoundingBox(); const b = n.geometry.boundingBox; if (!b) return;
      for (const cx of [b.min.x, b.max.x]) for (const cy of [b.min.y, b.max.y]) for (const cz of [b.min.z, b.max.z]) {
        _v.set(cx, cy, cz).applyMatrix4(n.matrixWorld).applyMatrix4(inv);
        if (_v.y < ymin) ymin = _v.y; if (_v.y > ymax) ymax = _v.y;
        if (_v.z < zmin) zmin = _v.z; if (_v.z > zmax) zmax = _v.z; got = true;
      }
    });
    return got ? { ymin, ymax, zmin, zmax } : null;
  }

  const shortAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));

  function update(dt, src) {
    const pet = src && src.pet, camera = src && src.camera;
    if (!pet || !pet.object3D || !camera) return;
    const obj = pet.object3D;
    if (!obj.parent) return;

    // Kamera in den ELTERN-Raum des Pets holen: der Sitz dreht mit der Karte, also ist
    // „zur Kamera" dort eine andere Gier als in der Welt.
    _v.copy(camera.position);
    obj.parent.worldToLocal(_v);
    const dx = _v.x - obj.position.x, dz = _v.z - obj.position.z;
    const yawToCam = Math.atan2(dx, dz);
    lastYawTo = yawToCam;

    const s01 = Math.max(0, Math.min(1, (src.speed01 != null ? src.speed01 : 0)));
    let f;
    if (P.mode === 'player') f = 1;
    else if (P.mode === 'track') f = 0;
    else f = Math.max(0, Math.min(1, 1 - s01 * P.speedGain));
    blend += (f - blend) * Math.min(1, dt * 2.4);
    // **S56 · Während der Ankunft führt die Regie, nicht das Tempo.** Vorher lief hier ein
    // ZWEITER Verlauf (2,4/s auf `speed01`) gegen den Zoom und den Dock-Mix — das war Georgs
    // „dreht sich durch die Karte weg“: das Pet schwenkte nach seiner eigenen Uhr, während die
    // Kamera nach ihrer heranfuhr. `arrive` ist bereits geglättet (Fenster auf `a`), bekommt
    // also KEINE zweite Dämpfung — es wird direkt eingesetzt.
    const arrive = Math.max(0, Math.min(1, src.arrive != null ? src.arrive : 0));
    // **S82 · Während einer Ankunft führt die Regie ALLEIN.** S56 hat `max(blend, arrive)` gebaut — und
    // damit blieb das Tempo ein zweiter Eigentümer: in der Bremse fällt `speed01` von 1 auf 0, `f`
    // läuft auf 1, und das Pet dreht sich zur Kamera, lange bevor das Regie-Fenster (0,95) aufmacht.
    // Genau das war Georgs „dreht sich sichtbar weg statt abzubremsen". Jetzt gilt: läuft eine Ankunft
    // (`owns`), schreibt nur sie; `blend` wird dabei auf den aktuellen Stand mitgezogen, damit beim
    // Lösen nichts springt (der Rückweg beginnt da, wo der Kopf steht).
    const owns = !!(src.owns || src.arriveOwns);
    const mix = owns ? arrive : Math.max(blend, arrive);
    if (owns) blend = mix;
    lastMix = mix; lastArrive = arrive; lastOwns = owns;

    const target = P.base + shortAngle(yawToCam - P.base) * mix;
    // Die Kopfdämpfung gilt der HAND (Tempoänderung), nicht der Regie: während der Ankunft
    // ist `arrive` selbst schon die Kurve, also folgt die Gier ihr straff. Sonst hätte die
    // Ankunft wieder zwei Zeitkonstanten — eine sichtbare, eine versteckte.
    const damp = P.damp + (P.arriveDamp - P.damp) * arrive;
    curYaw += shortAngle(target - curYaw) * Math.min(1, dt * damp);
    obj.rotation.y = curYaw;
    // **S94a · Wer die Pose gerade geschrieben hat, muss sie auch gültig machen.** `worldToLocal` unten
    // liest `matrixWorld`, und die stand hier noch auf dem Stand VOR dieser Zeile — in der Praxis auf
    // `base` (Fahrtrichtung), weil Kinetik und Motion die Drehung jeden Frame neu schreiben. Der Blick
    // rechnete also im Modellraum eines Pets, das wegschaut, während das Bild eines zeigt, das ansieht:
    // genau das Gegenvorzeichen, das Georg gesehen hat. Ein Aufruf, und die Rechnung stimmt mit dem Bild.
    obj.updateWorldMatrix(true, false);

    // S93b · Kopf heben und Blick heben — beide nur so weit, wie die Regie führt (`mix`), damit
    // sie beim Lösen von selbst verschwinden.
    _e.copy(camera.position);
    obj.worldToLocal(_e);
    const eDist = Math.max(1e-3, _e.length());
    const elev = Math.atan2(_e.y, Math.max(1e-3, Math.hypot(_e.x, _e.z)));   // >0 = Kamera oben
    const wantTilt = -Math.max(-P.tiltMax, Math.min(P.tiltMax, elev * P.tiltGain)) * mix;
    curTilt += (wantTilt - curTilt) * Math.min(1, dt * damp);
    obj.rotation.x += curTilt;   // ADDITIV auf die Kinetik (die schreibt `pitch.x` jeden Frame neu)

    // Aufsetzen: tiefster Punkt der um x gedrehten Hülle (y' = y·cosθ − z·sinθ, vier Ecken reichen)
    // zurück auf die Sitzebene. `rotation.z` bleibt außen vor — es ist ≤0,2° und würde die Rechnung
    // verdoppeln, ohne dass man es sieht.
    // S94a · Gerechnet wird mit der EIGENEN Matrix des Pets (Position auf 0), nicht mit einer
    // Handformel auf `rotation.x`: die trägt Maßstab und Drehreihenfolge automatisch richtig mit.
    // Der Maßstab war im ersten Anlauf schlicht vergessen — 1,15 heißt 15 % zu wenig Korrektur.
    // Additiv bleibt es trotzdem: nur der DREH-Anteil wird ausgeglichen, damit PetMotion weiter
    // springen und stauchen darf (Kanon-Reihenfolge: Kinetik, Motion, dann Facing).
    if (P.contact !== false) {
      const key = pet.id || pet;
      if (!bbox || bboxFor !== key) { bbox = measureBox(pet); bboxFor = key; }
      if (!corners || cornersFor !== key) { corners = measureCorners(pet); cornersFor = key; }
      if (corners) {
        const keepY = obj.position.y;
        obj.position.y = 0; obj.updateMatrix();
        let lo = 1e9, loFront = 1e9;
        for (const c of corners) {
          _v.copy(c.v).applyMatrix4(obj.matrix);
          if (_v.y < lo) lo = _v.y;
          if (c.front && _v.y < loFront) loFront = _v.y;
        }
        const gap = (P.plant === 'front' && loFront < 1e8) ? loFront : lo;
        obj.position.y = keepY - gap;   // Kontakt auf 0 = Sitzebene = Papierfläche
        lastDrop = -gap;
        lastPlant = { lo: +lo.toFixed(4), loFront: +loFront.toFixed(4), pts: corners.length,
                      front: corners.reduce((a, c) => a + (c.front ? 1 : 0), 0), used: P.plant };
      }
    }

    const handFuehrt = (src.cursorIdle != null) && src.cursorIdle < P.gazeIdle;
    if (mix > 0.5 && !handFuehrt && pet.face && pet.face.nudgeGaze) {
      gazeT += dt;
      if (gazeT >= P.gazeEvery) {
        gazeT = 0;
        // Blick im Modellraum: +Z ist das Gesicht (am Modell gemessen, siehe unten).
        const gx = Math.max(-1, Math.min(1, P.gazeSign * (_e.x / eDist) * P.gazeGain));
        const gy = Math.max(-1, Math.min(1, (elev / (Math.PI / 3)) * P.gazeGain));
        lastGaze = { x: +gx.toFixed(2), y: +gy.toFixed(2), elev: +(elev * 180 / Math.PI).toFixed(1) };
        try { pet.face.nudgeGaze(gx, gy, P.gazeHold); } catch (e) {}
      }
    } else gazeT = P.gazeEvery;   // beim nächsten Eintritt sofort, nicht erst nach der Wartezeit

    // Augen: sanfter Drift zur Kamera, kein Hard-Lock. Der EyeRig (v5) macht die Dämpfung
    // selbst; wir liefern nur das Ziel — und nur, wenn er die Schnittstelle wirklich hat.
    // S89d · … und nur ein Ziel, das ein Auge auch ansehen KANN (siehe `eyeNear`/`eyeFront`).
    // S93b · Nur noch im Rückweg-Modus: sonst besitzt PetFace die Pupillen (Begründung an `eyeMode`).
    const petFaceOwns = P.eyeMode !== 'rig' && pet.face && pet.face.enabled !== false;
    if (P.eyeTrack && !petFaceOwns && pet.rig && pet.rig.pointTo) {
      // Kamera im Modellraum des Pets: dort ist −Z das Gesicht.
      _e.copy(camera.position);
      obj.worldToLocal(_e);
      const dist = _e.length();
      // **S93b · Das Gesicht ist +Z, nicht −Z.** Am Modell gemessen: der Mund liegt bei z = +0,242,
      // die zwei Augenpaare bei +0,204 und +0,211 (paarweise ±x) — und die Bauanleitung §7e sagt
      // dasselbe („Das Pet schaut nach +z"). Der Kommentar hier behauptete das Gegenteil, und mit ihm
      // war `front` verdreht: positiv war es genau dann, wenn die Kamera HINTER dem Kopf stand.
      // Damit öffnete die Grenze aus S89d, wo sie schließen sollte — und das ist die Ursache der
      // „Beulen zwischen den Ohren", nicht ihre Behebung. (Sichtbar wurde es erst mit S93: vorher war
      // das Pet in diesem Moment ausgeblendet.)
      const front = dist > 1e-3 ? (_e.z / dist) : 0;
      // Zwei Verläufe, multipliziert: zu nah UND zu weit hinten sind beides Gründe wegzuschauen.
      const kNear = Math.max(0, Math.min(1, (dist - P.eyeNear) / Math.max(1e-3, P.eyeFar - P.eyeNear)));
      const kFront = Math.max(0, Math.min(1, (front - P.eyeFront) / Math.max(1e-3, 0.55 - P.eyeFront)));
      const k = kNear * kFront;
      // Ziel = zwischen „geradeaus" (0,0,−eyeAhead im Modellraum) und der Kamera.
      // „Geradeaus" ist damit +Z, nicht −Z (siehe oben).
      _e.set(_e.x * k, _e.y * k, _e.z * k + P.eyeAhead * (1 - k));
      obj.localToWorld(_e);
      lastEye = { k: +k.toFixed(3), front: +front.toFixed(3), dist: +dist.toFixed(2) };
      try { pet.rig.pointTo(_e); } catch (e) { P.eyeTrack = false; }
    }
  }

  return {
    name: 'pet-facing', update,
    get mode() { return P.mode; },
    setMode(m) { P.mode = m === 'player' || m === 'track' ? m : 'auto'; },
    get blend() { return lastMix; },
    get arrive() { return lastArrive; },
    get owned() { return lastOwns; },
    get yaw() { return curYaw; },
    get yawToCam() { return lastYawTo; },
    get eye() { return lastEye; },
    get tilt() { return curTilt; },
    get drop() { return lastDrop; },
    get plant() { return lastPlant; },
    get gazeSign() { return P.gazeSign; },
    setPlant(m) { P.plant = m === 'lowest' ? 'lowest' : 'front'; corners = null; },
    get eyeLocalY() { return bbox ? bbox.ymin + (bbox.ymax - bbox.ymin) * 0.72 : 0.6; },
    get box() { return bbox; },
    get gaze() { return lastGaze; },
    // Beim Modus-Wechsel (Walk ⇄ Fly) sitzt das Pet in einem anderen Eltern-Raum:
    // Gier zurücksetzen, sonst dreht der Kopf einmal quer durchs Bild.
    reset(base) { P.base = base != null ? base : P.base; curYaw = P.base; blend = 0; },
    setParams(p) { Object.assign(P, p || {}); },
    get params() { return P; },
  };
}
