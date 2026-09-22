/* kfb-stride-measure.js · Das Schrittmass eines Clips, gemessen (v1, 05.09.2026)
 *
 * AUFTRAG (Georg, 05.09.): „dann gerne erst das schrittmass der cube monster."
 * Offen seit dem 04.09.: `kfb-mob-locomotion.js` KOPPELT die Clip-Rate an das
 * Bodentempo (`refSpeed` 3,0 u/s = Rate 1,0) und sagt in seiner eigenen Zeile, dass
 * das NICHT kalibriert ist. Eine Kopplung ist eine Vermutung mit Vorzeichen: sie
 * stimmt fuer ein Modell und rutscht bei allen anderen.
 *
 * ═══ WAS GEMESSEN WIRD, UND WARUM GENAU DAS ══════════════════════════════════
 * Die Cube-Pets und Cube-Monster laufen AUF DER STELLE (0 Wurzelversatz, steht so
 * im Pet-Roster). Es gibt also keinen Wurzelweg, aus dem man das Tempo lesen
 * koennte. Was es gibt, ist der STANDFUSS: solange er den Boden beruehrt, zieht er
 * im Modellraum nach hinten, und diese Strecke IST der Schritt. Fuss unten und nach
 * hinten ziehend = Standphase; Strecke geteilt durch Dauer = das Tempo, bei dem
 * dieser Clip nicht rutscht.
 *
 * Das Verfahren ist NICHT neu erfunden: es steht seit dem 03.09. in
 * `KFB Academy 01 Locomotion.dc.html` als `_measure(key)` und ist dort am Mech
 * belegt. Hier ist es herausgezogen, damit ein zweiter Wirt es benutzen kann, ohne
 * es abzuschreiben.
 * OFFEN, ausdruecklich: Academy 01 hat seine eigene Fassung noch INLINE. Sie zu
 * ersetzen ist ein Eingriff in einen laufenden Regelkreis (01 fuettert die Messung
 * live in die Steuerung zurueck) und gehoert in eine eigene Runde. Bis dahin ist
 * dieses Modul der zweite Leser derselben Idee — `tor()` sagt das an.
 *
 * ═══ GEMESSENER BEFUND 05.09., DER DAS WERKZEUG GEAENDERT HAT ════════════════
 * Die 21 CUBE-MONSTER HABEN KEINE BEINE. Gemessen an Alien: die Armature besteht
 * aus `Body Mouth Head Head2 Head3 EyebrowR EyebrowL` — kein Fuss, kein Bein, kein
 * Zeh. Ihr `Walk` ist ein Wippen des Rumpfes, kein Schritt. Die 24 CUBE-PETS
 * dagegen sind node-animiert mit benannten Beinen (`leg-front-left` usw.).
 * Die erste Fassung hatte einen HOEHEN-RUECKFALL: fand sie keinen Namen, nahm sie
 * die vier tiefsten Knoten. Bei Alien waren das `MonsterArmature`, `Alien`, `Body`
 * und `Mouth` — und sie meldete 1,57 u/s. Eine Zahl ueber etwas, das es nicht gibt,
 * ist schlimmer als keine Zahl: sie sieht aus wie eine Messung.
 * DER RUECKFALL IST DESHALB RAUS. Ohne benannte Fuesse gibt es kein Schrittmass,
 * und das Werkzeug sagt genau das. Fuer beinlose Modelle misst es stattdessen den
 * HUB (Auf und Ab des Rumpfes je Zyklus) — das ist die Groesse, die dort wirklich
 * vorhanden ist, und aus ihr laesst sich ein Takt ableiten, aber keine Strecke.
 *
 * ═══ ZWEITER BEFUND 05.09.: NICHT DER KNOTEN LAEUFT, DIE SPITZE LAEUFT ═══════
 * Auch die Pets lieferten zuerst „keine Standphase" — obwohl ihre Beine benannt
 * und animiert sind. Ursache: die Beine sind ROTATIONS-animiert. Der Knoten sitzt
 * im Huftgelenk, und ein Gelenk bleibt beim Drehen an seinem Platz. `getWorldPosition`
 * liefert also einen Punkt, der sich kaum bewegt, waehrend der Fuss unten einen
 * halben Meter zieht.
 * Gemessen wird deshalb die FUSSSPITZE: aus der Geometrie des Beins wird EINMAL der
 * tiefste Punkt seines lokalen Kastens genommen, und dieser lokale Punkt wird je
 * Abtastung durch die Weltmatrix geschickt. Damit ist es gleichgueltig, ob das Bein
 * gedreht, verschoben oder beides wird — die Spitze ist die Spitze. Knoten ohne
 * Geometrie (Bones) behalten ihren Ursprung, und der Bericht sagt je Fuss, was
 * benutzt wurde (`spitze: true/false`).
 *
 * ═══ DREI FALLEN, DIE HIER SCHON DRIN SIND ═══════════════════════════════════
 *
 * 1 · DAS KONTAKTBAND GILT JE FUSS UND JE CLIP, nicht global. Gemessen am Mech:
 *     im Run steht ein Fuss bei y ≈ 0,76, im Walk bei 0,10 — ein gemeinsamer
 *     Schwellwert haette im Run gar keinen Bodenkontakt gefunden.
 *
 * 2 · VORNE IST NICHT IMMER +Z. Beide Cube-Roster haben `forwardZ: 1` (21× bzw.
 *     an den Beinen gemessen), aber ein Pack mit −Z wuerde ohne diesen Parameter
 *     ein NEGATIVES Tempo liefern und damit als „laeuft rueckwaerts" durchgehen.
 *     Die Richtung kommt herein, sie wird nicht geraten.
 *
 * 3 · DIE MESSUNG LIEFERT MODELLEINHEITEN, NICHT WELTEINHEITEN. Der Wirt skaliert
 *     die Pets (h = Rohhoehe × 0,56) — ein Schritt von 0,8 Modelleinheiten ist im
 *     Bild 0,45 u. Wer `skala` nicht mitgibt, bekommt `roh*`-Werte und ein Feld
 *     `skala: 1` im Bericht, damit die Verwechslung sichtbar ist statt still.
 *
 * ═══ VERTRAG ══════════════════════════════════════════════════════════════════
 *   const M = createStrideMeasure({ THREE });
 *   M.beine(root, opts)        → { nodes, wie, namen }   welche Knoten sind Fuesse
 *   M.messen({ root, clip, beine, forwardZ, skala, n })
 *        → { ok, grund, tempo, strecke, rohTempo, rohStrecke, dauer, kontakt,
 *            fuesse: [ …je Fuss… ], skala }
 *   M.zeile() · M.tor() · M.stats()
 */

export function createStrideMeasure(o) {
  const THREE = (o && o.THREE) || null;
  if (!THREE) throw new Error('kfb-stride-measure: THREE fehlt');

  const QUELLE = {
    /* 60 Abtastungen je Clip. Academy-01-Wert, und er ist eine Untergrenze: die
       Standphase eines Laufzyklus dauert rund 40 % des Zyklus, das sind hier 24
       Abtastungen — genug fuer eine Steigung, die nicht am Rauschen haengt. */
    n: 60,
    /* Kontaktband: unterste 12 % der Fussbahn, mindestens aber 0,05 Modelleinheiten
       ueber dem tiefsten Punkt. Der Boden ist ein Wert JE FUSS (Falle 1). */
    band: 0.12, bandMin: 0.05,
    /* Eine Standphase unter 2 Abtastungen ist keine Phase, sondern ein Zufall. */
    minPhase: 2,
    /* Namensmuster fuer Fuesse. Die Cube-Modelle sind node-animiert und heissen
       `leg-front-left` o. ae.; `foot`/`paw` deckt fremde Packs mit. */
    beinRx: /leg|foot|fuss|paw|toe|hoof/i,
    /* Hoechstens vier Fuesse. Ein Modell mit acht Beinen (Krabbe) wuerde sonst acht
       Messungen mitteln, von denen sechs Nebenbeine sind. */
    maxBeine: 4,
    /* Untergrenze fuer ein plausibles Tempo. Darunter gilt die Messung als
       gescheitert und sagt das \u2014 statt eine 0,02 als Ergebnis auszugeben. */
    minTempo: 0.05,
    /* Der Rumpf eines beinlosen Modells — gemessen an den Cube-Monstern, deren
       Armature `Body` heisst. `torso`/`rumpf` deckt fremde Packs mit. */
    rumpfRx: /^body$|torso|rumpf|hips|pelvis/i,
    /* Darunter ist ein Wippen kein Wippen. 0,001 Modelleinheiten sind bei einem
       1,3 u hohen Blob rund ein Promille — das ist Rechenrauschen, kein Bild. */
    hubMin: 0.001
  };
  const P = Object.assign({}, QUELLE, (o && o.params) || {});

  const zaehler = { messungen: 0, gelungen: 0, ohneBeine: 0, ohnePhase: 0, zuLangsam: 0 };
  let letzte = null;

  /* ---------- Wer ist ein Fuss? ------------------------------------------- */
  /* NUR UEBER DEN NAMEN. Kein Hoehen-Rueckfall — Begruendung im Kopf: er hat bei
     den beinlosen Cube-Monstern `Body` und `Mouth` als Fuesse ausgegeben und ein
     Ergebnis geliefert, das nach Messung aussah. Findet die Namenssuche nichts,
     ist die ehrliche Antwort eine leere Liste. */
  function beine(root, opts) {
    opts = opts || {};
    const rx = opts.rx || P.beinRx;
    const max = opts.max || P.maxBeine;
    const alle = [];
    root.updateMatrixWorld(true);
    root.traverse((n) => { if (n !== root) alle.push(n); });
    const v = new THREE.Vector3();
    const tief = (n) => { n.getWorldPosition(v); root.worldToLocal(v); return v.y; };
    const treffer = alle
      .filter((n) => rx.test(String(n.name || '')))
      .map((n) => ({ n: n, y: tief(n) }))
      .sort((a, b) => a.y - b.y)
      .slice(0, max)
      .map((x) => x.n);
    return {
      nodes: treffer,
      wie: treffer.length ? 'Name' : 'keine',
      namen: treffer.map((n) => String(n.name || '(ohne Namen)')),
      /* Was DA WAR, wenn nichts passte — damit der Bericht sagen kann, WORAN es
         gescheitert ist, statt nur dass es gescheitert ist. */
      geprueft: alle.length,
      bones: alle.filter((n) => n.isBone).length
    };
  }

  /* ---------- Der Ersatz fuer beinlose Modelle ---------------------------- */
  /* KEIN SCHRITT, ABER EIN TAKT. Ein wippender Blob hat eine Groesse, die man
     messen kann: den HUB seines Rumpfes je Zyklus. Daraus folgt kein Tempo (es
     gibt keine Strecke), aber die Frequenz, mit der er sich bewegt — und die ist
     das, was eine Clip-Rate ueberhaupt beeinflussen kann. Ausdruecklich als
     ERSATZ benannt, nicht als Schrittmass. */
  function hub(spec) {
    spec = spec || {};
    const root = spec.root, clip = spec.clip;
    if (!root || !clip) return null;
    const n = spec.n || P.n;
    const skala = spec.skala != null ? spec.skala : 1;
    /* Der Rumpf, wenn er einen Namen hat. Bei den Cube-Monstern ist `Body` ein
       BONE — und ein Bone bewegt sich, waehrend das Mesh nur seine Huelle ist. */
    let rumpf = null;
    root.traverse((x) => { if (!rumpf && x !== root && P.rumpfRx.test(String(x.name || ''))) rumpf = x; });
    const mixer = new THREE.AnimationMixer(root);
    mixer.clipAction(clip).play();
    const box = new THREE.Box3();
    const v = new THREE.Vector3();
    const quelle = rumpf ? ('Knoten ' + rumpf.name) : 'Kastenmitte';
    let lo = Infinity, hi = -Infinity, unten = Infinity;
    for (let i = 0; i <= n; i++) {
      mixer.setTime((i / n) * clip.duration);
      root.updateMatrixWorld(true);
      box.setFromObject(root);
      if (isFinite(box.min.y)) unten = Math.min(unten, box.min.y);
      let y = NaN;
      if (rumpf) { rumpf.getWorldPosition(v); root.worldToLocal(v); y = v.y; }
      else if (isFinite(box.min.y)) y = (box.min.y + box.max.y) / 2;
      if (isFinite(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); }
    }
    mixer.stopAllAction();
    mixer.uncacheClip(clip);
    const takt = +(1 / Math.max(0.001, clip.duration)).toFixed(3);
    if (!isFinite(lo) || !isFinite(hi)) {
      return { ok: false, grund: 'kein messbarer Knoten (Pruefkoerper ohne Geometrie?)', quelle: quelle, takt: takt };
    }
    const roh = hi - lo;
    /* EIN HUB VON NULL IST KEIN ERGEBNIS. Verifier-Fund 05.09.: die erste Fassung
       mass `box.min.y` — die UNTERKANTE. Ein Blob, der auf dem Boden steht und oben
       staucht, hat eine Unterkante, die sich NIE bewegt; gemessen kam Hub 0,000 bei
       einem Clip, der sichtbar wippt. Dieselbe Fehlerklasse wie der Hoehen-Rueckfall
       eine Stunde vorher: eine Zahl ueber etwas, das die Messung nicht erfasst. */
    if (roh < P.hubMin) {
      return { ok: false, grund: 'kein messbares Wippen (' + roh.toFixed(5) + ' an ' + quelle + ')',
               quelle: quelle, dauer: +clip.duration.toFixed(4), takt: takt };
    }
    return {
      ok: true, quelle: quelle,
      rohHub: +roh.toFixed(4),
      hub: +(roh * skala).toFixed(4),
      dauer: +clip.duration.toFixed(4),
      /* Takt = Zyklen je Sekunde. Die einzige Zahl, die ein beinloses Modell zu
         einer Clip-Rate beitragen kann. */
      takt: takt,
      bodenkontakt: isFinite(unten) ? +(unten * skala).toFixed(4) : null
    };
  }

  /* ---------- Die Messung -------------------------------------------------- */
  function messen(spec) {
    spec = spec || {};
    const root = spec.root, clip = spec.clip;
    const fz = spec.forwardZ != null ? spec.forwardZ : 1;
    const skala = spec.skala != null ? spec.skala : 1;
    const n = spec.n || P.n;
    zaehler.messungen++;

    const leer = (grund) => {
      const r = { ok: false, grund: grund, tempo: 0, strecke: 0, rohTempo: 0, rohStrecke: 0,
                  dauer: clip ? clip.duration : 0, kontakt: null, fuesse: [], skala: skala };
      letzte = r;
      return r;
    };
    if (!root || !clip) return leer('kein Modell oder kein Clip');
    const bi = (spec.beine && spec.beine.length) ? { nodes: spec.beine, wie: 'Name' } : beine(root);
    const B = bi.nodes;
    if (!B.length) {
      zaehler.ohneBeine++;
      const r = leer('ohne Beine — Schrittmass nicht definiert (' + bi.geprueft + ' Knoten, ' + bi.bones + ' Bones, kein Name mit leg/foot/paw)');
      /* Der Ersatz gehoert AN DAS GESCHEITERTE ERGEBNIS, nicht daneben: wer die
         Zeile liest, soll im selben Objekt finden, was stattdessen messbar war. */
      r.ersatz = hub({ root: root, clip: clip, skala: skala, n: n });
      return r;
    }

    /* EIN EIGENER MIXER je Messung, danach weggeraeumt: liefe die Messung auf dem
       Mixer des Wirts, haette sie dessen Zeit verstellt \u2014 und der Wirt haette nach
       einer Messung eine andere Pose als vorher. */
    /* DIE SPITZE, EINMAL bestimmt (zweiter Befund im Kopf): tiefster Punkt des
       lokalen Geometrie-Kastens. Einmal, weil sie im Modellraum des Beins liegt und
       sich durch die Animation nicht aendert — was sich aendert, ist die Matrix. */
    const spitzen = B.map((b) => {
      if (b.isMesh && b.geometry) {
        if (!b.geometry.boundingBox) b.geometry.computeBoundingBox();
        const bb = b.geometry.boundingBox;
        if (bb && isFinite(bb.min.y)) {
          return { p: new THREE.Vector3((bb.min.x + bb.max.x) / 2, bb.min.y, (bb.min.z + bb.max.z) / 2), spitze: true };
        }
      }
      return { p: new THREE.Vector3(0, 0, 0), spitze: false };
    });

    const mixer = new THREE.AnimationMixer(root);
    const act = mixer.clipAction(clip);
    act.play();
    const dur = clip.duration;
    const v = new THREE.Vector3();
    const proben = B.map(() => []);
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * dur;
      mixer.setTime(t);
      root.updateMatrixWorld(true);
      B.forEach((b, f) => {
        v.copy(spitzen[f].p).applyMatrix4(b.matrixWorld);
        root.worldToLocal(v);
        proben[f].push({ t: t, y: v.y, z: v.z });
      });
    }
    mixer.stopAllAction();
    mixer.uncacheClip(clip);

    const fuesse = [];
    const tempi = [];
    for (let f = 0; f < proben.length; f++) {
      const s = proben[f];
      const ys = s.map((p) => p.y);
      const yMin = Math.min.apply(null, ys), yMax = Math.max.apply(null, ys);
      const lim = yMin + Math.max(P.bandMin, (yMax - yMin) * P.band);   // Falle 1
      const m = s.length - 1;
      /* Standphase: unten UND gegen die Laufrichtung ziehend (Falle 2). */
      const ok = (i) => {
        const a = s[i % m], b = s[(i + 1) % m];
        return a.y <= lim && b.y <= lim && ((b.z - a.z) * fz) < 0;
      };
      let best = null;
      for (let start = 0; start < m; start++) {
        if (!ok(start) || ok((start - 1 + m) % m)) continue;
        let len = 0;
        while (len < m && ok(start + len)) len++;
        if (!best || len > best.len) best = { start: start, len: len };
      }
      if (!best || best.len < P.minPhase) {
        fuesse.push({ name: String(B[f].name || '?'), spitze: spitzen[f].spitze, phase: 0, hub: +(yMax - yMin).toFixed(4), tempo: 0, strecke: 0 });
        continue;
      }
      let dz = 0;
      for (let k = 0; k < best.len; k++) {
        dz += (s[(best.start + k) % m].z - s[(best.start + k + 1) % m].z) * fz;
      }
      const phaseDauer = best.len * dur / n;
      const tempo = dz / phaseDauer;
      tempi.push(tempo);
      fuesse.push({
        name: String(B[f].name || '?'),
        spitze: spitzen[f].spitze,
        phase: +(best.len / m).toFixed(3),          // Anteil des Zyklus mit Bodenkontakt
        hub: +(yMax - yMin).toFixed(4),
        tempo: +tempo.toFixed(4),
        strecke: +dz.toFixed(4)
      });
    }

    if (!tempi.length) { zaehler.ohnePhase++; return leer('keine Standphase gefunden (Clip laeuft ohne Bodenkontakt?)'); }
    const rohTempo = tempi.reduce((a, b) => a + b, 0) / tempi.length;
    if (rohTempo < P.minTempo) { zaehler.zuLangsam++; return leer('Standfuss bewegt sich kaum (' + rohTempo.toFixed(4) + ' Einheiten/s)'); }
    /* Das SCHRITTMASS ist die Strecke eines Zyklus, nicht die eines Kontakts:
       ein Vierbeiner setzt viermal auf, kommt aber je Zyklus einmal voran. */
    const rohStrecke = rohTempo * dur;
    zaehler.gelungen++;
    const r = {
      ok: true, grund: null,
      rohTempo: +rohTempo.toFixed(4), rohStrecke: +rohStrecke.toFixed(4),
      tempo: +(rohTempo * skala).toFixed(4), strecke: +(rohStrecke * skala).toFixed(4),
      dauer: +dur.toFixed(4),
      kontakt: +(fuesse.reduce((a, x) => a + x.phase, 0) / fuesse.length).toFixed(3),
      fuesse: fuesse, skala: skala
    };
    letzte = r;
    return r;
  }

  return {
    id: 'kfb-stride-measure',
    version: '1.0.0',
    group: null,
    besitzt: 'nichts \u2014 es liest fremde Knoten und legt seinen Mixer nach jeder Messung weg',
    schreibt: [],
    quelle: QUELLE,
    params: P,
    beine: beine,
    messen: messen,
    stats() { return Object.assign({}, zaehler); },
    zeile() {
      const s = zaehler;
      return 'stride-measure · ' + s.gelungen + '/' + s.messungen + ' Messungen gelungen'
        + (s.ohneBeine ? ' · ' + s.ohneBeine + '\u00d7 ohne Beine (Hub als Ersatz)' : '')
        + (s.ohnePhase ? ' · ' + s.ohnePhase + '\u00d7 ohne Standphase' : '')
        + (s.zuLangsam ? ' · ' + s.zuLangsam + '\u00d7 zu langsam' : '')
        + ' · ' + P.n + ' Abtastungen, Kontaktband ' + (P.band * 100) + ' %';
    },

    tor() {
      const z = []; let ok = 0, von = 0, nm = 0;
      const pruef = (b, gut, schlecht) => { von++; if (b) { ok++; z.push('\u2713 ' + gut); } else z.push('\u2717 ' + schlecht); };
      const info = (s) => { z.push('\u00b7 ' + s); };
      const offen = (s) => { nm++; z.push('\u2013 ' + s + ' (nicht messbar)'); };

      /* KONTROLLPROBE STATT SELBSTBERICHT (PM-41): ein synthetischer Clip mit
         BEKANNTEM Schrittmass. Ein Knoten, der 0,5 Einheiten je halben Zyklus nach
         hinten zieht und dabei unten bleibt, muss als Tempo 1,0 Einheiten/s
         herauskommen \u2014 wenn nicht, misst das Werkzeug sich selbst falsch, und jede
         Zahl danach ist Zierrat. */
      const root = new THREE.Object3D();
      const bein = new THREE.Object3D();
      bein.name = 'leg-front-left';
      root.add(bein);
      const zeiten = [0, 0.5, 0.5001, 1];
      const werte = [
        0, 0, 0.25,      // t=0    unten, hinten bei z=+0.25
        0, 0, -0.25,     // t=0.5  unten, nach hinten gezogen
        0, 0.4, 0.25,    // t=0.5+ oben (Schwungphase), zurueck nach vorn
        0, 0, 0.25       // t=1    unten, wieder am Anfang
      ];
      const spur = new THREE.VectorKeyframeTrack('.children[0].position', zeiten, werte);
      const clip = new THREE.AnimationClip('probe-walk', 1, [spur]);
      const r = messen({ root: root, clip: clip, forwardZ: 1, skala: 1, n: 60 });
      /* 0,5 Einheiten in 0,5 s = 1,0 Einheiten/s. Toleranz 8 %, weil die Abtastung
         die Kanten der Phase nicht genau trifft. */
      pruef(r.ok && Math.abs(r.rohTempo - 1) < 0.08,
        'Kontrollprobe: bekanntes Schrittmass 1,00 wird als ' + (r.ok ? r.rohTempo.toFixed(3) : '\u2014') + ' gemessen',
        'Kontrollprobe FEHLGESCHLAGEN: erwartet 1,00, gemessen ' + (r.ok ? r.rohTempo.toFixed(3) : ('nichts \u2014 ' + r.grund)));

      /* Und die Gegenrichtung: dasselbe Modell mit `forwardZ: -1` darf NICHT
         dasselbe Ergebnis liefern. Ein Werkzeug, das die Richtung ignoriert, wuerde
         hier trotzdem 1,0 melden \u2014 Falle 2 wird gemessen, nicht behauptet. */
      const rr = messen({ root: root, clip: clip, forwardZ: -1, skala: 1, n: 60 });
      pruef(!rr.ok || Math.abs(rr.rohTempo - 1) > 0.2,
        'Laufrichtung wirkt: mit forwardZ \u22121 kommt ' + (rr.ok ? rr.rohTempo.toFixed(3) : 'keine Phase') + ' heraus, nicht 1,00',
        'Laufrichtung wird ignoriert \u2014 forwardZ \u22121 liefert dasselbe Ergebnis (' + (rr.ok ? rr.rohTempo.toFixed(3) : '\u2014') + ')');

      /* Der Skalen-Fehler aus Falle 3, messbar gemacht. */
      const rs = messen({ root: root, clip: clip, forwardZ: 1, skala: 0.56, n: 60 });
      pruef(rs.ok && Math.abs(rs.tempo - rs.rohTempo * 0.56) < 1e-3,
        'Skala wird angewendet: roh ' + rs.rohTempo.toFixed(3) + ' \u00d7 0,56 = ' + rs.tempo.toFixed(3),
        'Skala wirkt nicht: roh ' + (rs.ok ? rs.rohTempo.toFixed(3) : '\u2014') + ' gegen Ergebnis ' + (rs.ok ? rs.tempo.toFixed(3) : '\u2014'));

      const b = beine(root);
      pruef(b.wie === 'Name' && b.nodes.length === 1,
        'Fussknoten ueber den Namen gefunden (' + b.namen.join(', ') + ')',
        'Fusssuche fand den benannten Knoten nicht (' + b.wie + ', ' + b.nodes.length + ' Knoten)');

      /* DIE ZEILE ZUM BEFUND VOM 05.09.: ein Modell OHNE benannte Beine darf kein
         Ergebnis liefern. Kontrollprobe mit umbenanntem Knoten — faellt der
         Hoehen-Rueckfall je zurueck, faellt hier das Tor. */
      const ohne = new THREE.Object3D();
      const blob = new THREE.Object3D();
      blob.name = 'Body';
      ohne.add(blob);
      const spur2 = new THREE.VectorKeyframeTrack('.children[0].position', zeiten, werte);
      const clip2 = new THREE.AnimationClip('probe-bob', 1, [spur2]);
      const ro = messen({ root: ohne, clip: clip2, forwardZ: 1, skala: 1, n: 60 });
      pruef(!ro.ok && /ohne Beine/.test(String(ro.grund)),
        'Modell ohne benannte Beine liefert KEIN Schrittmass, sondern eine Begruendung'
          + (ro.ersatz ? ' und den Hub (' + ro.ersatz.rohHub.toFixed(3) + ')' : ' \u2014 der Pruefkoerper hat keine Geometrie, also auch keinen Hub'),
        ro.ok ? 'Modell ohne Beine liefert ein Schrittmass (' + ro.rohTempo + ') \u2014 der Hoehen-Rueckfall ist zurueck'
              : 'Modell ohne Beine scheitert mit der falschen Begruendung: ' + ro.grund);

      if (!letzte || !letzte.ok) offen('Ergebnis der letzten echten Messung');
      else info('letzte Messung: ' + letzte.strecke.toFixed(3) + ' u je Zyklus, Kontakt '
        + Math.round(letzte.kontakt * 100) + ' % des Zyklus');

      info('SCHULD: Academy 01 hat dieselbe Messung noch inline (`_measure`) \u2014 '
        + 'Ablösung gehoert in eine eigene Runde, weil sie dort in einem Regelkreis haengt');

      return { ok: ok === von, bestanden: ok, von: von, nichtMessbar: nm, zeilen: z,
               text: 'stride-measure: ' + ok + '/' + von + ' bestanden' + (nm ? ', ' + nm + ' nicht messbar' : '') };
    }
  };
}
