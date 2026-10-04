/* KFB Kit Lab · S13.3 · Licht für den Dungeon-Generator
   Vorlage: die beiden KayKit-Promobilder (uploads/). Was daran Licht ist, in Zahlen gelesen:
   · kein Dach, Blick von oben aussen — die Szene wird von OBEN gelesen, nicht durchwandert
   · Hintergrund ein dunkelvioletter Radialverlauf, keine Fläche
   · Innenräume HELL und lesbar; die Fackeln sind Akzent, nicht die einzige Lichtquelle
   · unter jedem Prop ein weicher Kontaktschatten — daran klebt ein Gegenstand am Boden

   Deshalb drei Stimmungen statt einer Einstellung: `promo` (wie die Vorlage), `fackeln`
   (Fackeln tragen), `nacht` (nur Fackeln). Die Zahlen stehen hier an einer Stelle und werden
   im Balken der Seite gemessen nachgewiesen — Lichtwirkung ist prüfbar (Luminanz je Zelle),
   also wird sie geprüft. */
import * as THREE from 'three';

export const MOODS = {
  /* hemi/key/fill sind Faktoren auf die von makeViewer gesetzten Werte.
     ABFALL: `decay` 1, nicht 2. Physikalisch richtig wäre 1/r² — und genau das war der
     „Spiegel-Kabinett“-Effekt: eine Kerze steht 0,8 vor der Wand, die Mauersteine des Packs ragen
     0,1–0,15 heraus, und bei 1/r² bekommt der vordere Stein das Doppelte des hinteren. Ergebnis
     waren einzelne Lichtkegel je Stein statt EINER Beleuchtung der Ecke. Die Vorlage zeigt das
     Gegenteil: ein weicher, zusammenhängender Gradient je Fackel. Mit 1/r ist der Kontrast
     zwischen zwei Steinen halb so gross, und `reach` schneidet die Reichweite weiter sauber ab.
     Die Intensitäten sind entsprechend umgerechnet (bei r = 2 gleiche Helligkeit wie vorher). */
  /* Fackeln sind AKZENT, nicht Hauptlicht — die Lesbarkeit trägt die Hemisphäre plus ein Key.
     Genau daran scheitern Dungeon-Szenen: um die Fackeln allein hell genug zu machen, übersteuert
     man sie und schiebt den Abfall an die Szenenränder. Deshalb hier niedrige Candela und kleine
     Reichweite, und in „Nacht“ tragen sie mehr, ohne zu übersteuern. */
  promo: { label: 'Promo', hemi: 1.15, key: 1.2, fill: 0.6, torch: 2.4, decay: 1, reach: 9, flicker: 0.05, bg: ['#4a3670', '#140d20'] },
  fackeln: { label: 'Fackeln', hemi: 0.5, key: 0.4, fill: 0.18, torch: 6, decay: 1, reach: 12, flicker: 0.12, bg: ['#2d2048', '#0d0916'] },
  nacht: { label: 'Nacht', hemi: 0.22, key: 0.14, fill: 0.06, torch: 9, decay: 1, reach: 14, flicker: 0.18, bg: ['#1d1533', '#07050c'] }
};

/* Flammenpunkt GEMESSEN: Schwerpunkt der obersten Prozente der Geometrie. Die Mitte der Box wäre
   der Griff, nicht das Feuer — und ein Licht im Griff leuchtet das Bauteil von innen aus. */
export function measureFlame(tris, frac = 0.18) {
  let mn = Infinity, mx = -Infinity;
  for (const t of tris) for (const v of t) { if (v[1] < mn) mn = v[1]; if (v[1] > mx) mx = v[1]; }
  const thr = mx - (mx - mn) * frac;
  let n = 0, sx = 0, sy = 0, sz = 0;
  for (const t of tris) for (const v of t) if (v[1] >= thr) { n++; sx += v[0]; sy += v[1]; sz += v[2]; }
  return n ? [sx / n, sy / n, sz / n] : [0, mx, 0];
}

function gradientTexture([inner, outer]) {
  const S = 512;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(S * 0.5, S * 0.46, S * 0.04, S * 0.5, S * 0.5, S * 0.62);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeLightRig(V, opts = {}) {
  /* makeViewer hat schon Hemisphere + Key + Fill gesetzt. Nicht danebenstellen, sondern
     übernehmen: zwei Lichtsysteme in einer Szene sind der Grund, warum später niemand mehr
     weiss, woher die Helligkeit kommt. */
  const hemi = V.scene.children.find((o) => o.isHemisphereLight);
  const dirs = V.scene.children.filter((o) => o.isDirectionalLight);
  const key = dirs.find((d) => d.castShadow) || dirs[0];
  const fill = dirs.find((d) => d !== key);
  const base = {
    hemi: hemi ? hemi.intensity : 1.9,
    key: key ? key.intensity : 2.1,
    fill: fill ? fill.intensity : 0.6
  };

  /* Budget über der üblichen Quellenzahl: ohne Schattenkarten kosten Punktlichter nur
     Fragment-Rechenzeit, und eine Quelle ohne Licht fällt als dunkler Halter auf (gemessen:
     3 von 6 Wandfackeln bei Budget 10 und 17 Quellen). */
  const budget = opts.budget ?? 10;
  /* KEIN Schattenwurf aus den Punktlichtern. Das ist die Entscheidung, die dieses Kapitel
     abschliesst, und sie steht in den Promobildern des Packs: dort fallen ALLE Schatten in
     dieselbe Richtung — es gibt genau ein schattenwerfendes Licht von oben, die Fackeln und Kerzen
     sind Fill. Ein Punktlicht, das im oder am Bauteil sitzt, projiziert dessen Silhouette
     hyperbolisch auf den Boden: das waren die dunklen Fünfecke um die Kerzen, und keine
     Near-Plane rettet das, weil die Geometrie stimmt und nur die Absicht falsch war.
     Kontaktschatten kommt vom Key-Light mit gefitteter Schattenkamera. */
  const shadowed = opts.shadowed ?? 0;
  /* Fester Pool statt ein Licht je Fackel: jede Änderung der Lichtzahl lässt three.js alle Shader
     neu bauen — bei 20 Fackeln ein sichtbarer Hänger je Neuwurf. Der Pool wandert zu den nächsten
     Lichtquellen, die Zahl bleibt.
     Die Schattenwerfer sitzen IM Bauteil: damit wirft die Fackel ihren eigenen Schatten auf die
     Wand — richtig ausgerichtet, weil aus der Geometrie gerechnet und nicht als Scheibe
     dahintergeklebt. `normalBias` gegen Streifen auf den flachen Wandplatten. */
  /* Ebenen-Maske: eine Lichtquelle leuchtet ihr EIGENES Bauteil nicht an. Das Punktlicht sitzt im
     Flammenpunkt, also mitten in der Flammengeometrie — es blies sie zu einem weissen Klumpen aus
     und verschattete das Teil mit sich selbst. Drei.js kann genau das: die Leuchtkörper liegen auf
     einer eigenen Ebene, die Punktlichter nicht. Damit ist die Flamme in ihrer eigenen Farbe zu
     sehen, das Teil wirft keinen Schatten von seinem eigenen Licht, und Hemisphäre/Key beleuchten
     es weiter (sie bekommen die Ebene dazu). Eine Mechanik statt zweier halber. */
  const FIX = 2;                 // eigenleuchtende Leuchtkörper
  const LVL = (level) => 3 + (level || 0);   // Lichtempfänger je Etage
  for (const l of [hemi, key, fill]) if (l) { l.layers.enable(FIX); l.layers.enable(3); l.layers.enable(4); }
  V.camera.layers.enable(FIX); V.camera.layers.enable(3); V.camera.layers.enable(4);

  /* LICHTEMPFÄNGER JE ETAGE. Ohne Schattenkarten gibt es keine Verdeckung — ein Punktlicht im
     Untergeschoss leuchtet durch den 0,15 dünnen Boden auf die Wände der oberen Etage (genau die
     Lichtkegel, die Georg durch die Bodenkanten gesehen hat). In Spielen wird das nicht mit
     Schatten gelöst, sondern mit Licht-Culling je Raum: ein Licht erreicht nur die Geometrie
     seiner eigenen Etage. Drei.js kann das über Ebenen-Masken, exakt und kostenlos. */
  function markLevels(root) {
    let n = 0;
    for (const node of root.children) {
      const rec = node.userData.recipe;
      if (!rec) continue;
      node.traverse((o) => { o.layers.enable(LVL(rec.level)); });
      n++;
    }
    return n;
  }

  /* MATT. Gemessen liefert das Pack `roughness 0.45` — das ist der Glanz, der die Wände
     spiegelglatt aussehen lässt. Dungeon-Stein ist matt; in der Fachpraxis heißt die Regel
     "Specular auf 0". Dazu ACES-Tonemapping: ohne Tonemapping clippen helle Stellen hart auf
     Weiß (die ausgeblasenen Flecken), mit ACES rollen sie ab. */
  function matteMaterials(root, roughness = 0.95) {
    const seen = new Set();
    root.traverse((o) => {
      if (!o.isMesh) return;
      for (const m of [].concat(o.material)) {
        if (!m || seen.has(m) || !('roughness' in m)) continue;
        m.roughness = roughness;
        m.metalness = 0;
        m.needsUpdate = true;
        seen.add(m);
      }
    });
    return seen.size;
  }
  function markFixtures(root, pick) {
    let n = 0;
    for (const node of root.children) {
      const rec = node.userData.recipe;
      if (!rec || !pick(rec)) continue;
      node.traverse((o) => { o.layers.set(FIX); });
      n++;
    }
    return n;
  }

  const pool = [];
  for (let i = 0; i < budget; i++) {
    const L = new THREE.PointLight(0xffb066, 0, 12, 1);
    if (i < shadowed) {
      L.castShadow = true;
      L.shadow.mapSize.set(512, 512);
      L.shadow.bias = -0.002;
      L.shadow.normalBias = 0.03;
    }
    L.visible = false;
    V.scene.add(L);
    pool.push(L);
  }
  /* Zwei Sorten Leuchtbauteil, zwei Mechaniken — und das ist kein Widerspruch, sondern folgt aus
     dem Pack:
     · Teile mit GELÖSTER Flamme (Kerzen) liegen auf der Ebenen-Maske: ihre Flamme leuchtet selbst,
       also darf kein Punktlicht sie anleuchten und ausblasen.
     · Teile OHNE gelöste Flamme (torch_mounted — kein stiller Zwilling im Pack) bleiben auf
       Ebene 0 und werden von ihrem eigenen Punktlicht angeleuchtet. Damit sie sich nicht selbst
       verschatten, beginnt das Schattenfrustum hinter dem GEMESSENEN Eigenradius des Teils
       (Flammenpunkt → weitester eigener Vertex: torch_mounted 0,95).
     Eine Maske für alle machte genau das, was Georg fotografiert hat: schwarze Halter neben
     glühenden Kerzen. */
  const setNear = (L, r) => {
    if (!L.castShadow) return;
    L.shadow.camera.near = (r || 0.1) + 0.06;
    L.shadow.camera.updateProjectionMatrix();
  };

  let torches = [];
  let mood = MOODS[opts.mood || 'promo'];
  let bg = null;

  function setMood(name) {
    mood = MOODS[name] || MOODS.promo;
    if (hemi) hemi.intensity = base.hemi * mood.hemi;
    if (key) key.intensity = base.key * mood.key;
    if (fill) fill.intensity = base.fill * mood.fill;
    if (bg) bg.dispose();
    bg = gradientTexture(mood.bg);
    V.scene.background = bg;
    for (const L of pool) { L.distance = mood.reach; L.decay = mood.decay ?? 1; }
    return mood;
  }

  /* Schattenkamera aus der GEMESSENEN Szenenbox. Die feste ±40 aus makeViewer deckt ein 8×8-Feld,
     schneidet aber bei 16×16 (64 Einheiten) die Hälfte der Schatten ab — sichtbar als Kante
     mitten im Raum. */
  function fitShadow(root) {
    if (!key) return null;
    const box = new THREE.Box3().setFromObject(root);
    const c = box.getCenter(new THREE.Vector3());
    const s = box.getSize(new THREE.Vector3());
    const r = Math.max(s.x, s.z) * 0.62 + 4;
    key.position.set(c.x - r * 0.55, c.y + r * 1.15, c.z + r * 0.48);
    key.target.position.copy(c);
    if (!key.target.parent) V.scene.add(key.target);
    Object.assign(key.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: 1, far: r * 4 });
    key.shadow.camera.updateProjectionMatrix();
    return { radius: +r.toFixed(2), centre: c.toArray().map((v) => +v.toFixed(2)) };
  }

  /* Keine gebauten Schatten und keine gebaute Flamme. Beides war Bastelei und sah danach aus:
     eine orange Kugel ist keine Flamme, und eine dunkle Scheibe hinter der Fackel frisst genau den
     Lichthof, den das Punktlicht dort erzeugt — deshalb wirkte das Licht „falsch ausgerichtet".
     Das Feuer ist die Flammengeometrie des Packs, der Schatten kommt aus der Schattenkarte der
     Punktlichter, die IM Bauteil sitzen. Beides aus dem Pack, nichts dazugemalt. */

  function bind(list) { torches = list; return torches.length; }

  /* Messen mit einem festen Pool geht nur in STAPELN. Ein einzelnes Bild zeigt nur die Fackeln,
     die gerade ein Pool-Licht haben — eine Leseprobe daraus messt die KAMERA, nicht den Dungeon
     (bei 16×16 mit 25 Fackeln und Budget 10 sind zwei Drittel der Räume dunkel, je nachdem wo man
     steht). Also: der Pool geht reihum über alle Fackeln, je Stapel ein Bild, und der Aufrufer
     behaelt je Zelle das Maximum. Danach steht der Pool wieder wie vorher. */
  function probeBatches(list, render) {
    const saved = pool.map((L) => ({ p: L.position.clone(), v: L.visible, i: L.intensity }));
    const batches = Math.max(1, Math.ceil(list.length / pool.length));
    for (let b = 0; b < batches; b++) {
      const chunk = list.slice(b * pool.length, (b + 1) * pool.length);
      pool.forEach((L, k) => {
        const it = chunk[k];
        L.visible = !!it;
        L.intensity = it ? mood.torch : 0;
        if (it) { L.position.set(it.p[0], it.p[1], it.p[2]); setNear(L, it.r); L.layers.set(LVL(it.level)); }
      });
      render(b, chunk);
    }
    pool.forEach((L, k) => { L.position.copy(saved[k].p); L.visible = saved[k].v; L.intensity = saved[k].i; });
    lastKeys = '';
    return batches;
  }

  /* Die nächsten Fackeln an den Pool. Zugewiesen wird nach Abstand zum Kameraziel, nicht zur
     Kamera: beim Herauszoomen soll das Licht im Blickfeld bleiben, nicht hinter der Kamera.
     `only` filtert auf eine Ebene — ein Licht an einer ausgeblendeten Ebene wirft Flecken aus
     dem Nichts. */
  let lastKeys = '';
  let only = null, enabled = true;
  /* Zwei Schalter, weil es zwei Achsen gibt: die EBENE (welche Fackeln gehören zur Ansicht) und
     der SCHRITT (trägt der Aufbau schon Fackeln?). Beim schrittweisen Aufbau ist die Fackel
     ausgeblendet — ihr Licht darf dann nicht als Fleck auf dem Boden liegen bleiben. */
  function setLevelFilter(v) { only = v; lastKeys = ''; }
  function setEnabled(v) { enabled = !!v; lastKeys = ''; }
  function update(t) {
    const list = !enabled ? [] : only === null ? torches : torches.filter((tr) => String(tr.level) === String(only));
    if (!list.length) { for (const L of pool) L.visible = false; lastKeys = 'x'; return; }
    const c = V.controls.target;
    /* Priorität vor Distanz: eine Quelle OHNE eigenleuchtende Flamme braucht ihr Punktlicht
       dringender als eine, die selbst glüht — sonst verdrängt eine Kerze eine Wandfackel, und die
       steht dann schwarz da (gemessen: 3 von 6 Fackeln ohne Licht bei 17 Quellen auf 10 Plätze). */
    const near = list
      .map((tr, i) => ({ i, tr, d: (tr.p[0] - c.x) ** 2 + (tr.p[2] - c.z) ** 2, prio: tr.selfLit ? 1 : 0 }))
      .sort((a, b) => (a.prio - b.prio) || (a.d - b.d))
      .slice(0, pool.length);
    const keys = near.map((n) => n.i).join(',');
    if (keys !== lastKeys) {
      lastKeys = keys;
      pool.forEach((L, k) => {
        const it = near[k];
        L.visible = !!it;
        if (it) { L.position.set(it.tr.p[0], it.tr.p[1], it.tr.p[2]); setNear(L, it.tr.r);
          L.layers.set(LVL(it.tr.level)); }
      });
    }
    pool.forEach((L, k) => {
      if (!L.visible) return;
      const it = near[k];
      if (!it) { L.visible = false; return; }   // Pool länger als die Liste: still abschalten, nicht werfen
      const ph = it.i * 2.399;
      const f = 1 + mood.flicker * (Math.sin(t * 7.3 + ph) * 0.6 + Math.sin(t * 13.1 + ph * 1.7) * 0.4);
      L.intensity = mood.torch * f;
    });
  }

  return { setMood, bind, update, setLevelFilter, setEnabled, probeBatches, fitShadow, markFixtures,
    markLevels, matteMaterials, FIX, pool, get mood() { return mood; }, budget, shadowed, base };
}

/* Lichtreichweite als GRAPH-Aussage, nicht als Gefühl: welche Zelle liegt im Radius einer Fackel?
   Gerechnet auf dem Raster, damit die Zahl auch ohne Rendering stimmt — die Luminanzprobe auf dem
   Bild prüft danach, ob das auch ankommt. */
export function lightReach(model, torches, MOD, reach) {
  const lit = new Set();
  for (const t of torches) {
    for (const cell of model.cells.values()) {
      if (cell.level !== t.level) continue;
      const d = Math.hypot(cell.c * MOD - t.p[0], cell.r * MOD - t.p[2]);
      if (d <= reach * 0.55) lit.add(`${cell.level}:${cell.c},${cell.r}`);
    }
  }
  const dark = [...model.cells.values()].filter((c) => !lit.has(`${c.level}:${c.c},${c.r}`));
  return { lit: lit.size, total: model.cells.size, dark };
}
