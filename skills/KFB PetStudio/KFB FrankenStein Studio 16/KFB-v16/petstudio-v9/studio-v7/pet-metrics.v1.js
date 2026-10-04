/* KFB Pet Studio v5 — Messschicht und Vertragsfelder.  met-v1.0
 *
 * Der Podcast musste die Grundform in JEDER Zone neu messen, weil der Vertrag sie nicht trug. Das
 * geht schief, sobald zwei Zonen unterschiedlich messen: die Buehne skalierte auf die GESAMTHOEHE
 * (Umriss inklusive Ohren), also wurde ein Hase mit langen Ohren kleiner als ein Pinguin mit
 * flachem Kopf. Hier wird es EINMAL gemessen und ins Feld geschrieben.
 *
 * DREI ZAHLEN, DREI AUFGABEN — sie werden bewusst nicht zusammengelegt:
 *   body.cubeH     Grundform (Koerperwuerfel). Der MASSSTAB. Zwei Pets mit gleichem cubeH sind
 *                  gleich gross, egal was an Ohren, Fluegeln und Beinchen dranhaengt.
 *   body.radius    Silhouette. Die TREFFERFLAECHE und der Abstand zum Bildrand — nicht der Massstab.
 *   body.facePitch Blickachse, aus der Frontnormale der Mundflaeche. Dieselbe Referenz, die `az`
 *                  im Puppet-Vertrag benutzt.
 *
 * Beim Pinguin stecken die Fluegel IM `body`-Mesh (Spannweite 1,57 gegen Hoehe 1,02). Fuer die
 * HOEHE ist das unschaedlich, fuer eine Breiten-Normierung nicht — deshalb misst `cubeH` die Hoehe
 * und `span` steht als Warnzahl daneben, statt still in den Massstab einzugehen.
 */

export const version = 'met-v1.0';

/** Das Mesh, das den Koerperwuerfel traegt: `body` beim Namen, sonst das mit dem groessten Rauminhalt. */
export function findBody(THREE, root) {
  let named = null, best = null, bestVol = -1;
  root.traverse((n) => {
    if (!n.isMesh || !n.geometry) return;
    if (n.userData && n.userData.petOverlay) return;
    const nm = String(n.name || '').toLowerCase();
    if (!named && (nm === 'body' || nm.endsWith('_body') || nm.indexOf('body') === 0)) named = n;
    n.geometry.computeBoundingBox();
    const b = n.geometry.boundingBox;
    if (!b) return;
    const s = b.getSize(new THREE.Vector3());
    const vol = s.x * s.y * s.z;
    if (vol > bestVol) { bestVol = vol; best = n; }
  });
  return { mesh: named || best, byName: !!named };
}

/**
 * Alles in EINER Referenz: die Wurzelskalierung wird herausgerechnet (die Buehne stellt 1,6 ein),
 * damit die Zahl dieselbe ist wie im Podcast (`cube.h 1,020`) und nicht die der Buehne.
 */
export function measure(THREE, ch, mouthMesh) {
  const g = ch && ch.group;
  if (!g) return null;
  g.updateWorldMatrix(true, true);
  const k = g.scale && g.scale.x ? g.scale.x : 1;
  const whole = new THREE.Box3().setFromObject(g);
  const wsz = whole.getSize(new THREE.Vector3());
  const found = findBody(THREE, g);
  let cubeH = null, span = null, cubeW = null, byName = found.byName, meshName = found.mesh ? (found.mesh.name || '(ohne Namen)') : null;
  if (found.mesh) {
    const b = new THREE.Box3().setFromObject(found.mesh);
    const s = b.getSize(new THREE.Vector3());
    cubeH = s.y / k; span = Math.max(s.x, s.z) / k; cubeW = s.x / k;
  }
  const radius = Math.max(wsz.x, wsz.z) / k / 2;
  let facePitch = null, faceDir = null;
  const src = mouthMesh || (ch.inner || g);
  if (src) {
    src.updateWorldMatrix(true, false);
    const d = new THREE.Vector3(0, 0, 1).transformDirection(src.matrixWorld).normalize();
    faceDir = [+d.x.toFixed(4), +d.y.toFixed(4), +d.z.toFixed(4)];
    facePitch = +(Math.asin(Math.max(-1, Math.min(1, d.y))) * 180 / Math.PI).toFixed(2);
  }
  return {
    cubeH: cubeH == null ? null : +cubeH.toFixed(4),
    cubeW: cubeW == null ? null : +cubeW.toFixed(4),
    span: span == null ? null : +span.toFixed(4),
    totalH: +(wsz.y / k).toFixed(4),
    radius: +radius.toFixed(4),
    facePitch, faceDir,
    fromMouth: !!mouthMesh,
    bodyByName: byName, bodyMesh: meshName,
    stageScale: +k.toFixed(3),
    /* Die eine Warnzahl: traegt das `body`-Mesh mehr Breite als Hoehe, steckt Anatomie drin
       (Pinguin-Fluegel). Fuer cubeH unschaedlich, fuer jede Breiten-Normierung nicht. */
    spanWarn: (cubeH && span) ? +(span / cubeH).toFixed(3) : null,
  };
}

/** Die gemessenen Zahlen in den Pet-Eintrag schreiben — additiv, nie loeschend. */
export function writeBody(pet, m, opts) {
  if (!pet || !m) return null;
  const o = opts || {};
  pet.body = pet.body || {};
  const before = JSON.stringify(pet.body);
  /* TOLERANZ. Zwei Messungen desselben Pets weichen um Bruchteile ab (Clip-Stand, Mund-Overlay):
     gemessen 0,7482 gegen 0,7461 beim zweiten Laden. Ohne Toleranz waere JEDES Laden eine
     Aenderung, jeder Pet ein Entwurf und die Markierung »unexportiert« bedeutungslos. Geschrieben
     wird erst ab 1 % Abweichung — darunter gilt die Zahl, die schon im Vertrag steht. */
  const tol = o.tol == null ? 0.01 : o.tol;
  const put = (k, v) => {
    if (v == null) return;
    const cur = pet.body[k];
    if (typeof cur === 'number' && Math.abs(cur - v) <= Math.abs(cur || 1) * tol) return;
    pet.body[k] = v;
  };
  put('cubeH', m.cubeH); put('radius', m.radius); put('totalH', m.totalH);
  if (!o.keepFace) {
    if (m.facePitch != null && !(typeof pet.body.facePitch === 'number' && Math.abs(pet.body.facePitch - m.facePitch) <= 0.5)) pet.body.facePitch = m.facePitch;
    if (m.faceDir && !pet.body.faceDir) pet.body.faceDir = m.faceDir;
  }
  if (before === JSON.stringify(pet.body)) return { changed: false, body: pet.body };
  pet.body.measured = { by: 'KFB Pet Studio v5 · ' + version, at: new Date().toISOString().slice(0, 10), bodyMesh: m.bodyMesh, byName: m.bodyByName, span: m.span, spanWarn: m.spanWarn };
  return { changed: true, body: pet.body };
}

/* ── Der Wuerfel des Spiels ──────────────────────────────────────────────────────────────────── */
/**
 * Halbe Grundform-Kante, gleiche Basisform (abgerundeter Wuerfel). Damit gibt es EINE Grundform
 * fuer Kollisionsabfragen: Wuerfel gegen Pet, Pet gegen Klinge, Wuerfel gegen Klinge.
 *
 * WUERFELAUGEN (Georgs Entscheidung 25.8.): KEINE Dellen und keine klassischen Pips, sondern
 * PottyMouth-Glyphen in Papierfarbe auf der Clay-Oberflaeche. Zwei Gruende, beide praktisch:
 * eine Delle ist Geometrie (sie braucht Kanten, Schatten und eine zweite Kollisionsform), ein
 * Glyph ist eine Textur; und PottyMouth ist die Hausschrift, in der jede Taste ein Bild zeichnet —
 * der Wuerfel spricht damit dieselbe Sprache wie die Karten. Die sechs Zeichen sind ein Feld, kein
 * Kanon: `glyphs` gibt sie vor, der Zeichenschluessel steht in »KFB Pottymouth Key«.
 *
 * `makeMat` wird von aussen hereingegeben, damit der Wuerfel die CLAY-Oberflaeche des Studios
 * traegt (Fingerabdruck-Relief, AO, Papierton) statt einer zweiten Materialwahrheit.
 */
export async function buildCube(THREE, cubeH, o) {
  const opt = o || {};
  const edge = (cubeH || 1) * (opt.factor == null ? 0.5 : opt.factor);
  const r = edge * (opt.round == null ? 0.14 : opt.round);
  let geo = null;
  try {
    const M = await import('three/addons/geometries/RoundedBoxGeometry.js');
    geo = new M.RoundedBoxGeometry(edge, edge, edge, opt.seg || 3, r);
  } catch (e) {
    geo = new THREE.BoxGeometry(edge, edge, edge, 2, 2, 2);   // Rueckweg: eckig, aber richtig gross
  }
  const mat = opt.makeMat ? opt.makeMat({ color: opt.color || 0xd8c48e })
    : new THREE.MeshStandardMaterial({ color: opt.color || 0xe8d9ae, roughness: 0.82, metalness: 0.0 });
  const cube = new THREE.Mesh(geo, mat);
  cube.name = 'kfb-cube-body';
  cube.castShadow = true; cube.receiveShadow = false;
  const group = new THREE.Group();
  group.name = 'kfb-cube';
  group.add(cube);
  group.userData.kfb = { kind: 'game-cube', edge: +edge.toFixed(4), round: +r.toFixed(4), fromCubeH: cubeH,
    rule: 'halbe Grundform-Kante, gleiche Basisform', faces: 'PottyMouth-Glyphen, keine Dellen' };

  const glyphs = (opt.glyphs || '').slice(0, 6);
  if (glyphs.length) {
    if (document.fonts && document.fonts.load) { try { await document.fonts.load('180px "PottyMouth BB"'); } catch (e) {} }
    const half = edge / 2 + edge * 0.004;                 // haarfein vor der Flaeche, damit nichts z-flimmert
    const dirs = [
      [[0, 0, 1], [0, 0, 0]],                              // vorn
      [[0, 0, -1], [0, Math.PI, 0]],                       // hinten
      [[1, 0, 0], [0, Math.PI / 2, 0]],                    // rechts
      [[-1, 0, 0], [0, -Math.PI / 2, 0]],                  // links
      [[0, 1, 0], [-Math.PI / 2, 0, 0]],                   // oben
      [[0, -1, 0], [Math.PI / 2, 0, 0]],                   // unten
    ];
    const size = edge * (opt.glyphScale == null ? 0.62 : opt.glyphScale);
    for (let i = 0; i < glyphs.length; i++) {
      const cv = document.createElement('canvas'); cv.width = cv.height = 256;
      const g = cv.getContext('2d');
      g.clearRect(0, 0, 256, 256);
      g.fillStyle = opt.glyphColor || '#f7f0da';           // Papierfarbe, nicht Weiss
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = '190px "PottyMouth BB", "Special Elite", monospace';
      g.fillText(glyphs[i], 128, 138);
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
      const pm = new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.9, metalness: 0, depthWrite: false, name: 'kfb-cube-glyph-' + (i + 1) });
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(size, size), pm);
      const d = dirs[i][0], rot = dirs[i][1];
      pl.position.set(d[0] * half, d[1] * half, d[2] * half);
      pl.rotation.set(rot[0], rot[1], rot[2]);
      pl.name = 'kfb-cube-face-' + (i + 1);
      pl.userData.glyph = glyphs[i];
      group.add(pl);
    }
  }
  return { mesh: group, cube, edge: +edge.toFixed(4), round: +r.toFixed(4), glyphs };
}

/** Als GLB herausgeben — Kollision und Aussehen kommen danach aus derselben Quelle. */
export async function exportGLB(obj, name) {
  const M = await import('three/addons/exporters/GLTFExporter.js');
  const ex = new M.GLTFExporter();
  const buf = await new Promise((res, rej) => ex.parse(obj, res, rej, { binary: true }));
  const blob = new Blob([buf], { type: 'model/gltf-binary' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = (name || 'kfb-cube') + '.glb';
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  return blob.size;
}

/* ── behavior: Vertragsfelder ohne Motor ─────────────────────────────────────────────────────── */
/**
 * Der Podcast v4 soll Reaktionen LESEN koennen. Hier stehen sie als Felder, damit die Zone nicht
 * jedes Mal eine Zahl erfindet — ein Motor gehoert nicht hierher (PetMotion ist der Eigentuemer).
 */
export const BEHAVIOR_DEF = {
  archetype: null,                 // erbt aus pet.archetype, wenn leer
  reactions: {
    hit: { squash: 0.82, recover: 0.26, viseme: 'open', emote: 'surprise' },
    praise: { bounce: 0.18, recover: 0.34, viseme: 'smile', emote: 'happy' },
    ignored: { droop: 0.12, recover: 0.9, viseme: 'closed', emote: 'sad' },
  },
  triggers: [
    { on: 'enter', do: 'gesture-positive', once: true },
    { on: 'namecalled', do: 'lookAt', within: 0.4 },
    { on: 'bumper', do: 'squash', after: 1, liftAfter: 3 },
  ],
  actions: ['idle', 'walk', 'run', 'dance', 'gesture-positive', 'gesture-negative'],
  lull: { after: 4.5, do: 'idle-glance' },
};
export function ensureBehavior(pet) {
  if (!pet) return null;
  if (!pet.behavior) pet.behavior = JSON.parse(JSON.stringify(BEHAVIOR_DEF));
  if (!pet.behavior.archetype && pet.archetype) pet.behavior.archetype = pet.archetype;
  return pet.behavior;
}

/* ── Grenzen und Podest: was dem PET gehoert, nicht der Zone ─────────────────────────────────── */
/**
 * Georgs Vorschlag (25.8.): »evtl. bringt jedes Pet ground plane, hitbox, deformer/limits im JSON
 * mit — dann hat man direkt ein Tile/Spielflaeche, kippbar«.
 *
 * Der Kern ist richtig, eine Haelfte davon ist eine Falle:
 *
 * RICHTIG — das gehoert ins Pet, weil es die FIGUR beschreibt:
 *   `body.hit`    Trefferflaeche (aus `radius`/`cubeH` gemessen, hier nur benannt und feiner)
 *   `body.limits` wie weit sie sich verformen darf, wie hoch sie springt, wie weit sie kippt
 *   `token`       das Podest, das sie MITBRINGT, wenn sie allein irgendwo abgesetzt wird
 *
 * FALLE — der BODEN gehoert der Zone, nicht dem Pet: sechs Pets auf derselben Flaeche haetten sechs
 * Bodenplatten, also sechs Meinungen darueber, wo unten ist. Sobald zwei sich um einen Zentimeter
 * unterscheiden, hat man Z-Flimmern und zwei Schattenhoehen. Deshalb: EINE Platte je Zone
 * (`ground`, kippbar), und jedes Pet bringt sein PODEST mit — das ist das Tile, das er meint, und es
 * ist eine Komposition, kein Fussboden.
 */
export const LIMITS_DEF = {
  squash: 0.82,        // wie flach sie beim Aufprall werden darf
  stretch: 1.18,       // wie lang beim Absprung
  tiltMax: 14,         // Grad, bevor es kippelig aussieht
  jumpMax: 1.6,        // in Grundform-Hoehen
  spinMax: 720,        // Grad je Sekunde (Flipper!)
  bounce: [1.0, 0.34, 0.12],   // drei Preller, wie in game-feel gemessen
  /* SCHWEBEN (Georg 25.8.: »dann können wir auch Flug-Pets wie die Biene besser nutzen«).
     Ohne eigene Ruhehoehe rechnet der Boden jede Schwebehoehe als SPRUNG: die Biene haette immer
     einen blassen, aufgeblasenen Schatten und wuerde dadurch nie gelandet wirken. Mit `hover.h` ist
     die Ruhehoehe der neue Nullpunkt — der Schatten ist dort scharf, und erst ein echtes Steigen
     darueber macht ihn weich. `bob` ist das Wippen an der Stelle, es aendert den Schatten kaum. */
  hover: { on: false, h: 0, bob: 0.10, speed: 1.4 },
};
/* ── Die Kachel ist die Masseinheit ──────────────────────────────────────────────────────────── */
/**
 * Georgs Gedanke (25.8.): die Relation zur base tile / ground plane IST die Pet-Skalierung.
 * Genau so — und es ist besser als eine Referenz nach einem Lieblings-Pet:
 *
 *   Massstab ist die KACHEL, nicht der Hase.   scale = tile.edge × fill / cubeH
 *
 * Zwei Pets auf derselben Kachel sind gleich gross, egal welches Modell zuerst gemessen wurde. Die
 * Spielflaeche (Flipper-Kachel, Kartenraster, Overworld-Feld) erbt dieselbe Zahl, statt sie zu
 * erfinden. Gefuellt wird die Kachel von der GRUNDFORM (`cubeH`), nicht von der Silhouette — sonst
 * schrumpfen die Fluegel der Biene ihren Koerper.
 *
 * Die Zahlen sind so gewaehlt, dass sich am Bild NICHTS aendert: Kachel 2,0 mal Fuellung 0,60 ergibt
 * fuer den Hasen (cubeH 0,748) die Skalierung 1,604 — die Buehne stand vorher auf festen 1,6.
 * `token.fill` je Pet ist die Ausnahme fuer Sonderfaelle (ein Boss fuellt seine Kachel weiter).
 */
export const TILE_DEF = { edge: 2.0, fill: 0.60 };
export function stageScale(cubeH, tile, petFill) {
  const t = { ...TILE_DEF, ...(tile || {}) };
  const fill = petFill == null ? t.fill : petFill;
  return t.edge * fill / (cubeH || 0.748);
}

export const TOKEN_DEF = {
  on: false,
  shape: 'card',       // card · disc · square \u2014 die Grundform des Podests
  size: 1.35,          // in Kachel-Kanten
  fill: null,          // wie weit dieses Pet seine Kachel fuellt (null = Wert der Zone)
  tint: '#f7f0da',
  ink: true,           // Kanon-Tusche als Rand
  tilt: 0,             // Grad, wenn es allein steht
};
export function ensureLimits(pet) {
  if (!pet) return null;
  pet.body = pet.body || {};
  if (!pet.body.limits) pet.body.limits = JSON.parse(JSON.stringify(LIMITS_DEF));
  /* Startwerte fuer die Flieger und den Schwimmer, damit man nicht bei Null anfaengt — eingestellt
     wird am Bild. Wer hier eine Zahl findet, hat sie nicht abgenommen, sondern geerbt. */
  const FLY = { bee: 0.85, parrot: 0.70, chick: 0.0, fish: 0.55 };
  if (FLY[pet.id] != null && !pet.body.limits.hover.on && FLY[pet.id] > 0) {
    pet.body.limits.hover = { on: true, h: FLY[pet.id], bob: 0.12, speed: 1.6, _quelle: 'Startwert v5, am Bild abzunehmen' };
  }
  if (!pet.token) pet.token = JSON.parse(JSON.stringify(TOKEN_DEF));
  if (pet.body.radius != null && pet.body.hit == null) {
    /* Die Trefferflaeche wird benannt, nicht erfunden: sie IST die gemessene Silhouette. */
    pet.body.hit = { shape: 'ellipse', r: pet.body.radius, h: pet.body.cubeH || null, from: 'gemessen (silhouette)' };
  }
  return pet.body.limits;
}

/* ── EMBED_CUBE_PET_FULL v2.3 — aus dem laufenden Stand geschrieben ──────────────────────────── */
/**
 * Nichts in diesem Text wird behauptet: jede Zahl kommt aus dem Vertrag oder aus der Messung
 * dieser Sitzung. Wo nichts gemessen wurde, steht »— (nicht gemessen)« und keine Zahl.
 */
export function specMarkdown(o) {
  const c = o.contract || {}, pets = o.pets || [], m = o.measures || {}, sh = o.shapes || null, ink = o.ink || null;
  const d = new Date().toISOString().slice(0, 10);
  const num = (v, dg) => (v == null ? '— (nicht gemessen)' : (+v).toFixed(dg == null ? 3 : dg));
  const L = [];
  L.push('# EMBED_CUBE_PET_FULL v2.3');
  L.push('');
  L.push('> Geschrieben von **KFB Pet Studio v5** am ' + d + ' aus dem laufenden Stand.');
  L.push('> Vertrag `' + (c.$schema || 'kfb.pets/1') + '` v' + (c.version || '?') + ' · ' + pets.length + ' Pets · Messschicht ' + version + '.');
  L.push('> Ersetzt v2.2. Jede Zahl hier ist gemessen oder steht im Vertrag; wo nichts gemessen wurde, steht kein Wert.');
  L.push('');
  L.push('## 1 Was ein Cube-Pet ist');
  L.push('');
  L.push('Ein GLB-Koerper aus `' + ((c.assets && c.assets.glbBase) || '—') + '`, dazu drei Aufsaetze, die NICHT im GLB stecken:');
  L.push('das **Augen-Rig** (`pet-eye-rig.v5.js`), der **Mund** (`pet-mouth.v1.js`, PNG-Set) und die **Blase**');
  L.push('(`bubble-shaper.v2.js` + `bubble-shapes.json`). Der Koerper bringt ' + (((c.assets && c.assets.glbAnimClips) || []).length || 8) + ' Clips mit; alles andere ist prozedural.');
  L.push('');
  L.push('## 2 Die drei Zahlen des Koerpers');
  L.push('');
  L.push('| Feld | Aufgabe | Regel |');
  L.push('|---|---|---|');
  L.push('| `body.cubeH` | **Massstab** | Grundform = Koerperwuerfel. Zwei Pets mit gleichem `cubeH` sind gleich gross — Ohren, Fluegel, Beinchen zaehlen NICHT mit. |');
  L.push('| `body.radius` | **Trefferflaeche** | Silhouette: Abstand zum Bildrand und Kollision. Nie als Massstab benutzen. |');
  L.push('| `body.facePitch` / `faceDir` | **Blickachse** | Frontnormale der Mundflaeche — dieselbe Referenz wie `az` im Puppet-Vertrag. |');
  L.push('');
  L.push('Grundform ist NICHT Silhouette. Wer sie zusammenlegt, bekommt entweder abgeschnittene Fluegel');
  L.push('oder ungleich platzierte Figuren (im Podcast gemessen: −37 px bzw. 25 gegen 6 px).');
  L.push('');
  L.push('### Gemessen in dieser Sitzung');
  L.push('');
  const ids = Object.keys(m);
  if (!ids.length) L.push('_Noch nichts gemessen — im Studio ein Pet laden und »messen« druecken._');
  else {
    L.push('| Pet | cubeH | Gesamthoehe | radius | facePitch | body-Mesh | Spannweite/Hoehe |');
    L.push('|---|---|---|---|---|---|---|');
    for (const id of ids) {
      const q = m[id] || {};
      L.push('| `' + id + '` | ' + num(q.cubeH) + ' | ' + num(q.totalH) + ' | ' + num(q.radius) + ' | ' + (q.facePitch == null ? '—' : q.facePitch + '°') + ' | `' + (q.bodyMesh || '—') + '`' + (q.bodyByName ? '' : ' (groesster Rauminhalt)') + ' | ' + num(q.spanWarn, 2) + ' |');
    }
    L.push('');
    L.push('Eine Spannweite/Hoehe deutlich ueber 1 heisst: im `body`-Mesh steckt Anatomie (beim Pinguin die');
    L.push('Fluegel). Fuer `cubeH` unschaedlich, fuer jede Breiten-Normierung nicht.');
  }
  L.push('');
  L.push('## 3 Der Wuerfel des Spiels');
  L.push('');
  L.push('**Halbe Grundform-Kante, gleiche Basisform** (abgerundeter Wuerfel). Damit gibt es EINE Grundform');
  L.push('fuer Kollisionsabfragen: Wuerfel gegen Pet, Pet gegen Klinge, Wuerfel gegen Klinge.');
  if (o.cube) L.push('Zuletzt erzeugt: Kante ' + num(o.cube.edge) + ' · Rundung ' + num(o.cube.round) + ' · aus `cubeH` ' + num(o.cube.fromCubeH) + (o.cube.glbBytes ? ' · GLB ' + Math.round(o.cube.glbBytes / 1024) + ' KB' : '') + '.');
  else L.push('_Im Studio noch nicht erzeugt._');
  L.push('');
  L.push('## 4 Blasen');
  L.push('');
  L.push('Die Form besitzt die Silhouette, die Feder besitzt die Linie. Punkte tragen `struct`, Formen tragen');
  L.push('`deform`. Gedanke und Fluester sind kursiv, POP! ist Bangers.');
  L.push('');
  if (sh && sh.shapes) {
    L.push('| Form | aspect | Punkte | Ecken | Zweck |');
    L.push('|---|---|---|---|---|');
    for (const s of sh.shapes) L.push('| `' + s.name + '` | ' + num(s.aspect) + ' | ' + s.pts.length + ' | ' + s.pts.filter((p) => p[2]).length + ' | ' + (s.label || '—') + ' |');
    L.push('');
  }
  L.push('**Mindestabstands-Regel (neu in v2.3):** zwei Anfasser, die naeher liegen als `mergePx`, werden zu');
  L.push('EINEM (Mitte beider, und der neue Punkt ist eine ECKE) — beim Laden und beim Ziehen. Grund: `rect`');
  L.push('trug an jeder Ecke zwei Punkte im Abstand von 0,0296 der halben Breite (die Fase), und die');
  L.push('Kantenfasung machte daraus eine Rundung oder einen Glitch. Gemessen: `rect` 11 → 7 Punkte,');
  L.push('4 zusammengelegt; `round` unveraendert 11 (seine Fase ist ~40 px weit, die Regel beisst dort nicht).');
  L.push('Ein Kurvenpunkt statt einer Ecke waere die Rundung zurueck — deshalb ist der neue Punkt IMMER eine Ecke.');
  L.push('');
  L.push('**Die vier Kennzahlen der Feder** (Kanon `SSOT_Card_Ink_Outline_v2.md`): Familie · Stuetzpunkte ·');
  L.push('Feder · Bauchung ≤ 0,5 %. Fuer die Blase: Familie BAND (abgeleitet von `figure`), Stuetzpunkte aus');
  L.push('der Bank, Feder aus der Schriftgroesse (`inkWidthFor`: Stamm × Verhaeltnis × Zielskalierung).');
  L.push('');
  L.push('**Bekannt und bewusst nicht behoben (Georg 25.8.):** `bevelCorners()` fast jeden Knick ueber 34°,');
  L.push('deshalb sind die Ecken leicht angeschraegt. Ein Eingriff dort aendert die Feder ALLER Karten und');
  L.push('Interfaces, die den Kanon lesen — also dokumentiert statt riskiert.');
  L.push('');
  L.push('**Was der Vertrag traegt** (`voice.bubble`), damit eine Zone die Blase OHNE `bubble-shapes.json`');
  L.push('bauen kann: `shape` · `aspect` · `pts` (die Punkte selbst, normiert, mit Ecken-Flag) · `voice` ·');
  L.push('`pen` · `mergePx` · `bow`/`jit`/`step`/`seed` · `ink{family,hb,taper,edge,step,color}`. Ein Name');
  L.push('allein genuegt nicht: dann muesste die Zone die Form woanders herbekommen — genau die Naht, an der');
  L.push('drei Fassungen von `pet-mouth.v1.js` entstanden sind.');
  if (o.contract && o.contract.voice && o.contract.voice.bubble && o.contract.voice.bubble.pts) {
    const vb = o.contract.voice.bubble;
    L.push('');
    L.push('Im laufenden Vertrag: Form `' + (vb.shape || '?') + '` · ' + vb.pts.length + ' Punkte · aspect '
      + num(vb.aspect) + ' · Stimme ' + (vb.voice || '?') + ' · Feder ' + num(vb.pen, 2) + ' px · mergePx '
      + (vb.mergePx == null ? '—' : vb.mergePx) + ' px.');
  }
  if (ink) {
    L.push('');
    L.push('Feder: Familie `' + (ink.for || 'figure') + '`, `hb` ' + num(ink.hb, 4) + ' · `taper` ' + num(ink.taper, 2) + ' · `edge` ' + num(ink.edge, 2) + ' · Schritt ' + (ink.step || '—') + ' px.');
    L.push('Sie liegt zwischen Karte (0,0069) und Figur (0,0155), weil die Tusche duenner als das Lettering sein muss.');
  }
  L.push('');
  L.push('## 5 Vertragsfelder je Pet');
  L.push('');
  L.push('| Block | Felder | Wer liest sie |');
  L.push('|---|---|---|');
  L.push('| `eye` | anchor{dx,dy,ring,track} · pupilStyle · pupilSize · inset · lidFit · converge · lashes{length,density,width} | `pet-eye-rig.v5.js` |');
  L.push('| `mouth` | set · size · dy · dx · sx · tilt · rot · bend · lift · wrap · onTop · slope · visemeMap | `pet-mouth.v1.js` |');
  L.push('| `body` | cubeH · radius · totalH · facePitch · faceDir · measured | Buehne, Kollision, Kamera |');
  L.push('| `behavior` | reactions{hit,praise,ignored} · triggers[] · actions[] · lull | Zone (Podcast v4) — **Felder, kein Motor** |');
  L.push('');
  L.push('Regel aus der Uebergabe: was im Studio ueber die Oberflaeche gesetzt wird, braucht (a) einen Platz im');
  L.push('Export und (b) eine Durchreiche in `kfb-pets.js`. Neue Regler brauchen beide Schritte.');
  L.push('');
  L.push('## 6 Datei und Herkunft');
  L.push('');
  L.push('```json');
  L.push('meta: {');
  L.push('  contract: "1.3.0", updated: "' + d + '", source: "KFB Pet Studio v5",');
  L.push('  label: "single | selection | full", count: <n>, ids: [...],');
  L.push('  petVersions: { <id>: <n> }, leafCounts: { <id>: <n> }');
  L.push('}');
  L.push('```');
  L.push('');
  L.push('`petVersions` je Pet, nicht global: der Podcast liest eine Datei und muss sehen koennen, ob DIESER');
  L.push('Pinguin neuer ist als der im Repo. `leafCounts` ist die Gegenprobe gegen stille Verarmung — v1.2.6');
  L.push('trug eine hoehere Version und drei aermere Pets (pig/beaver/bee 40 → 14 bzw. 37 → 14 Blattfelder).');
  L.push('');
  L.push('## 7 Ladereihenfolge in einer Zone');
  L.push('');
  L.push('1. `canonical` (' + (c.canonical || '—') + ')');
  L.push('2. lokale Kopie — **Spiegel, nie Quelle**');
  L.push('3. vollstaendiger Inline-Fallback');
  L.push('');
  L.push('Vereinigt wird nach der Regel **der reichere Stand gewinnt, Feld fuer Feld**; ein Ausduennen wird');
  L.push('gemeldet, nicht uebernommen. Die Versionsnummer entscheidet nicht allein.');
  L.push('');
  return L.join('\n');
}
