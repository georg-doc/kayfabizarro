/* Die Bank. Vier Bildschirme, ein Renderer, ein Kit.

   Reihenfolge ist Absicht: Bestand → Bauteile → Regeln → Generator. Erst wissen, was da ist;
   dann sehen, wie es aussieht; dann festlegen, was es tut; dann bauen. Die Insel-Komposition
   ist genau daran gescheitert, dass Schritt vier vor Schritt eins kam. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PACKS, loadLog, REF } from './sources.js';
import { readPack, probeQuaternius } from './inventory.js';
import { warm, measured, instance, assignRole, moduleMetrics, deriveRockClasses, isRockish, isDeckTile, biomeOf, folds } from './kit.js';
import { planPlatform, buildPlatform, SHAPES } from './generator.js';
import { Sunlight } from '../../KFB_Free_Roam_Platformer_v1/src/lighting.js';

const $ = (s) => document.querySelector(s);
const el = (t, a = {}, kids = []) => {
  const n = document.createElement(t);
  for (const [k, v] of Object.entries(a)) {
    if (k === 'class') n.className = v; else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on')) n[k] = v; else n.setAttribute(k, v);
  }
  for (const c of [].concat(kids)) n.append(c);
  return n;
};
const say = (t) => { const b = $('#boot'); b.classList.remove('gone'); b.innerHTML = `<b>Hex-Baukasten</b><span>${t}</span>`; };
const done = () => $('#boot').classList.add('gone');

const S = { packs: {}, quat: null, recs: [], metrics: null, kit: null, tab: 'bestand',
            gen: { seed: 'kfb-01', cells: 19, terraces: 3, shape: 'blob', path: true,
                   pathStyle: 'auto', tileSet: 'both' } };

/* ── Szene ───────────────────────────────────────────────────────────────────────────── */
const canvas = $('#view');
/* preserveDrawingBuffer, damit ein Belegbogen den echten Frame liest und nicht ein
   geleertes Puffer-Schwarz. Ohne das ist jeder Screenshot ein Zufallstreffer. */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x14171c);
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 400);
camera.position.set(14, 12, 16);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.target.set(0, 1, 0);
/* Licht, Schatten und Bodenkontakt kommen aus dem Platformer-Modul — ein Besitzer, keine
   zweite Fassung. Genau die Schattenlogik, die hier geprüft wird, läuft dort im Spiel. */
const light = new Sunlight(scene, { cell: 2, maxDistance: 90 });
const stage = new THREE.Group();
scene.add(stage);

function frame(obj, pad = 1.5) {
  const box = new THREE.Box3().setFromObject(obj);
  if (box.isEmpty()) return;
  const s = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
  const r = Math.max(s.x, s.y, s.z) * pad;
  controls.target.copy(c);
  camera.position.copy(c).add(new THREE.Vector3(r * 0.9, r * 0.75, r * 1.0));
  camera.near = Math.max(0.05, r / 200); camera.far = r * 20;
  camera.updateProjectionMatrix();
}
function tick() {
  requestAnimationFrame(tick);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== Math.round(w * renderer.getPixelRatio()) || canvas.height !== Math.round(h * renderer.getPixelRatio())) {
    renderer.setSize(w, h, false); camera.aspect = w / Math.max(1, h); camera.updateProjectionMatrix();
  }
  controls.update();
  light.fit(camera);
  renderer.render(scene, camera);
}
tick();

/* ── Start ───────────────────────────────────────────────────────────────────────────── */
boot().catch((e) => { console.error(e); say(`<b style="color:#ff6b6b">${e.message}</b>`); });

async function boot() {
  say('Registry-Shards werden gelesen…');
  const [hex, builder] = await Promise.all([readPack('hex'), readPack('builder')]);
  S.packs = { hex, builder };

  say('Quaternius-Pack wird abgetastet…');
  S.quat = await probeQuaternius();

  /* BEIDE Packs gehören in den Baukasten — das Builder Pack bringt allein 128 Hex-Kacheln
     mit, darunter die Teilsechsecke aus dem Promobild. Die erste Fassung ließ es weg und
     verfehlte damit den halben Auftrag.

     Aber nicht alles wird gleich geladen: 460 glTF am Stück sind Minuten Wartezeit für
     Bauteile, die der Generator nie anfasst. Gemessen wird der KERN — alles, woraus gebaut
     wird: Hex-Kacheln beider Packs, Natur (die Felsfamilie) und die Quaternius-Teile.
     Gebäude, Requisiten und die quadratischen Builder-Kacheln bleiben im Bestand sichtbar
     und laden erst, wenn sie gebraucht werden: im Kontaktbogen beim Scrollen, im Generator
     beim Setzen. Rollen aus der Pack-Ordnung brauchen keine Messung, nur Padding und
     Felsklasse tun das — die werden nach dem Messen nachgezogen. */
  const CORE = /^tiles(?!\/square)|nature|quaternius/;
  const all = [...hex.parts, ...builder.parts, ...S.quat.parts];
  const core = all.filter((p) => CORE.test(p.family));
  say(`${core.length} Kernteile werden geladen und vermessen (von ${all.length})…`);
  const res = await warm(core, (i, n) => say(`${i}/${n} Kernteile vermessen…`));
  S.failed = res.fail;

  /* Ein Datensatz je Teil, gemessen oder nicht. Ungemessene tragen size = null und sagen das
     im Bogen, statt mit einer erfundenen Null dazustehen. */
  S.recs = all.map((p) => measured.get(p.path) || { ...p, size: null, foot: null, tris: null });

  /* Modulmaß NUR aus den Kacheln des Hexagon-Packs. Das ist das Gitter, auf dem gebaut wird,
     und es darf nicht kippen: das Builder Pack bringt 128 Hex-Kacheln mit, also die MEHRHEIT.
     Käme die Referenz aus dem gemeinsamen Topf und wäre das Builder-Hex auch nur anders
     groß, würde die Mehrheit das Maß bestimmen und die halbe Hexagon-Bibliothek wortlos als
     »Teilsechseck« einsortiert. Stattdessen: ein Gitter, und jedes Teil, das nicht darauf
     passt, wird als solches ausgewiesen. */
  const hexTiles = S.recs.filter((r) => r.size && r.pack === 'hex' && (r.family || '').toLowerCase().startsWith('tiles'));
  S.metrics = moduleMetrics(hexTiles.length ? hexTiles : S.recs);
  const fits = (r) => Math.abs(r.size[0] - S.metrics.W) < S.metrics.W * 0.12
                   && Math.abs(r.size[2] - S.metrics.H) < S.metrics.H * 0.12;
  for (const r of S.recs) {
    r.role = assignRole(r, S.metrics);
    /* Passt eine Kachel nicht aufs Gitter, ist sie kein Teilsechseck, sondern ein fremdes
       Maß. Sie bleibt im Bestand sichtbar und fällt aus dem Wurf. */
    if (r.size && (r.role === 'module' || r.role === 'padding') && !fits(r) && r.foot > S.metrics.W * 0.88) r.offGrid = true;
  }
  /* Klassengrenzen aus der gemessenen Verteilung, nicht aus einer Schwelle im Kopf. */
  S.rockBands = deriveRockClasses(S.recs.filter((r) => isRockish(r)));
  S.offGrid = S.recs.filter((r) => r.offGrid).length;

  S.kit = buildKit(S.recs);
  done();
  tabs();
  show('bestand');
  await generate();
}

function buildKit(recs) {
  const by = (role) => recs.filter((r) => r.role === role);
  const rocks = { A: [], B: [], C: [] };
  for (const r of recs) if (r.rock) rocks[r.rock].push(r);
  /* Deckkacheln: gemessen, eben, und ohne Dubletten. Die erste Fassung hängte zwei Listen
     aneinander und schnitt bei zwölf ab — vier der zwölf Einträge waren derselbe Teil zweimal,
     und Unterseiten-Kappen und Schrägen standen als begehbare Fläche darin. */
  const deck = [...new Map(recs.filter((r) => r.size && !r.offGrid && isDeckTile(r)).map((r) => [r.base, r])).values()];
  /* Kachelsatz je Pack getrennt halten. Beide Packs kacheln auf demselben Gitter, sehen aber
     nicht gleich aus — Hexagon-Pack gelbgrün mit braunem Rand, Builder Pack blaugrün. Gemischt
     ergibt das Flickwerk. Die Mischung bleibt möglich, aber als WAHL, nicht als Nebenwirkung
     davon, welches Pack mehr Kacheln mitbringt. */
  const plainOf = (list) => {
    const p = list.filter((r) => /grass|ground|dirt|sand|forest|field|farm|stone/i.test(r.base));
    return (p.length ? p : list).slice(0, 16);
  };
  const sets = {
    hex: plainOf(deck.filter((r) => r.pack === 'hex')),
    builder: plainOf(deck.filter((r) => r.pack === 'builder')),
    both: plainOf(deck),
  };
  /* Biome: je Bodensatz eine Gruppe mit ihren Varianten. Der Generator nimmt genau eine. */
  const biomes = new Map();
  for (const r of deck) {
    const k = r.pack + ':' + biomeOf(r.base);
    if (!biomes.has(k)) biomes.set(k, []);
    biomes.get(k).push(r);
  }
  /* Vorgabe ist BEIDE, nicht das Hexagon-Pack allein.
     Gemessen: von den 38 Modul-Kacheln des Hexagon-Packs sind alle bis auf eine
     `hex_coast_*_waterless`, `hex_river_*_waterless`, `hex_road_*` oder Kappe/Schräge — zu
     Recht gefiltert, übrig bleibt `hex_grass`. Ein Generator, der aus einem Element würfelt,
     liefert eine einfarbige Plattform. Die Kachelvielfalt liegt im Builder Pack. */
  return {
    sets,
    biomes: [...biomes.entries()].map(([k, v]) => ({ key: k, pack: v[0].pack, tiles: v }))
      .sort((x, y) => y.tiles.length - x.tiles.length),
    modules: sets.both,
    deckAll: deck,
    padding: by('padding').filter((r) => !r.offGrid),
    water: by('water'),
    landmarks: by('landmark'),
    pathTiles: by('pathtile'),
    nature: by('nature').filter((r) => !r.rock),
    props: by('prop'),
    rocks,
    byName: new Map(recs.map((r) => [r.base, r])),
    all: recs,
  };
}

/* ── Bildschirme ─────────────────────────────────────────────────────────────────────── */
const TABS = [['bestand', 'Bestand'], ['bauteile', 'Bauteile'], ['regeln', 'Regeln'], ['generator', 'Generator']];
function tabs() {
  const nav = $('#tabs'); nav.innerHTML = '';
  for (const [k, label] of TABS) nav.append(el('button', { class: S.tab === k ? 'on' : '', onclick: () => show(k) }, label));
}
function show(k) {
  S.tab = k; tabs();
  $('#sheet').classList.toggle('on', k === 'bauteile');
  const p = $('#pane'); p.innerHTML = '';
  ({ bestand, bauteile, regeln, generator })[k](p);
}
const kv = (k, v, cls = '') => el('div', { class: 'kv' }, [el('span', {}, k), el('b', { class: cls, html: String(v) })]);

function bestand(p) {
  p.append(el('h2', {}, 'Quelle'));
  p.append(kv('Repo', `georg-doc/kayfabizarro @ ${REF}`));
  p.append(kv('Pfadquelle', 'registry/assets/v1/packs/*.json'));
  p.append(el('p', { class: 'note', html:
    'Der Verzeichnisbaum listet in diesem Repo keine .gltf/.glb. »0 gefunden« heißt dort '
    + 'nicht »nicht da«. Jeder Pfad unten stammt aus dem Registry-Shard, keiner ist getippt.' }));

  for (const key of ['hex', 'builder']) {
    const pk = S.packs[key];
    p.append(el('h2', {}, pk.label));
    p.append(kv('Modelle (dedupliziert)', `${pk.parts.length} von ${pk.raw}`));
    p.append(kv('Abruf', `${pk.ms} ms`));
    const t = el('table', {}, el('tr', {}, [el('th', {}, 'Familie'), el('th', { class: 'n' }, 'Teile')]));
    for (const [f, n] of pk.families) t.append(el('tr', {}, [el('td', {}, f), el('td', { class: 'n' }, String(n))]));
    p.append(t);
  }

  p.append(el('h2', {}, PACKS.quat.label));
  p.append(kv('Quelle', S.quat.source));
  p.append(kv('Dateien im Verzeichnis', S.quat.files));
  p.append(kv('Modelle gelesen', S.quat.parts.length, S.quat.present ? 'tag ok' : 'tag bad'));
  const qb = new Map();
  for (const q of S.quat.parts) qb.set(q.family, (qb.get(q.family) || 0) + 1);
  for (const [f, n] of [...qb].sort((x, y) => y[1] - x[1])) p.append(kv(f, n));
  p.append(el('p', { class: 'note', html: S.quat.note }));
  p.append(el('p', { class: 'note', html:
    'Die Teile sind einzeln über Poly Pizza geholt. Jeder Dateiname trägt eine Zufalls-ID — '
    + '<code>Pebble Round by Quaternius - icVsN3lmVy.glb</code>. Ein Namensraster kann das '
    + 'nicht treffen; deshalb wird das Verzeichnis gelesen, nicht abgetastet. Neue Teile '
    + 'tauchen beim nächsten Start von selbst auf.' }));

  p.append(el('h2', {}, 'Ladeprotokoll'));
  const ok = [...loadLog.values()].filter((l) => l.ok).length;
  p.append(kv('Erfolgreich', ok));
  p.append(kv('Fehlgeschlagen', loadLog.size - ok, loadLog.size - ok ? 'tag bad' : ''));
  p.append(kv('Textur-Faltung', `${folds.seen} → ${folds.unique}`));
}

function regeln(p) {
  const m = S.metrics;
  p.append(el('h2', {}, 'Modulmaß (gemessen)'));
  p.append(kv('Kachel', `${m.W} × ${m.H}`));
  p.append(kv('Ausrichtung', m.orientation));
  p.append(kv('Inkreis / Umkreis', `${m.inradius} / ${m.circumradius}`));
  p.append(kv('Terrassenstufe', m.step));
  p.append(kv('Übereinstimmung', `${m.sample} von ${m.of} Kacheln (${Math.round(m.agreement * 100)} %)`));
  p.append(el('p', { class: 'note', html:
    'Deckfläche liegt bei y = 0, der Körper hängt darunter. Wer auf einer Kachel steht, steht '
    + 'auf y = Stufe × Ebene — kein Einrasten nötig. Kantenmasken und Straßenlöser kommen aus '
    + '<code>hexrealm/lib/hex-grid.js</code> und werden hier nicht nachgebaut.' }));

  p.append(el('h2', {}, 'Rollen'));
  const counts = new Map();
  for (const r of S.recs) counts.set(r.role, (counts.get(r.role) || 0) + 1);
  const desc = { module: 'volles Sechseck — der Boden', padding: 'Teilsechseck — fängt Höhensprünge',
    water: 'Wasser / Ufer — nicht begehbar', landmark: 'Gebäude — gibt der Plattform eine Adresse',
    nature: 'Baum, Busch, Fels — füllt Fläche', prop: 'Zaun, Brücke, Kleinkram — erzählt am Boden',
    unknown: 'trifft keine Regel — bleibt sichtbar statt still zu verschwinden' };
  for (const [role, n] of [...counts].sort((a, b) => b[1] - a[1])) {
    p.append(kv(`${role} · ${n}`, ''));
    p.append(el('p', { class: 'note', html: desc[role] || '' }));
  }

  p.append(el('h2', {}, 'Deckkacheln'));
  p.append(kv('Ebene Vollkacheln', S.kit.deckAll.length));
  p.append(kv('Hexagon-Pack', S.kit.sets.hex.length, S.kit.sets.hex.length < 3 ? 'tag warn' : ''));
  p.append(kv('Builder Pack', S.kit.sets.builder.length));
  p.append(kv('im Wurf (Vorgabe: beide)', S.kit.modules.length));
  p.append(el('p', { class: 'note', html:
    'Unterseiten-Kappen (<code>*_bottom</code>) und Schrägen (<code>*_sloped_*</code>) sind '
    + 'ausgeschlossen: sie haben dieselbe Grundfläche, aber keine ebene Oberseite. Wer sie '
    + 'mitwürfelt, bekommt Hexe, auf denen man nicht steht.' }));
  p.append(kv('Fremdes Maß (aus dem Wurf)', S.offGrid, S.offGrid ? 'tag warn' : 'tag ok'));
  p.append(kv('Noch nicht vermessen', S.recs.filter((r) => !r.size).length));
  p.append(el('p', { class: 'note', html:
    'Gebäude, Requisiten und die quadratischen Builder-Kacheln laden erst bei Bedarf — '
    + 'im Kontaktbogen beim Scrollen, im Generator beim Setzen.' }));

  p.append(el('h2', {}, 'Felsklassen'));
  const rb = S.rockBands;
  p.append(kv('Populationen im Bestand', rb.populations, rb.populations < 3 ? 'tag warn' : 'tag ok'));
  p.append(el('p', { class: 'note', html:
    'Die Grenzen sind nicht gesetzt, sondern aus der Verteilung der gemessenen Grundflächen '
    + `gelesen: eine Trennstelle ist ein Sprung um Faktor ≥ ${rb.breakRatio}. Gefunden: `
    + (rb.cuts.length ? rb.cuts.map((c) => `${c.lo} → ${c.hi} (×${c.ratio})`).join(' · ') : 'keine')
    + '. Drei Runden lang kamen die Grenzen aus meinem Kopf und waren dreimal falsch — '
    + 'zu hoch, zu niedrig, dann in eine Lücke gelegt, in der nichts liegt.' }));
  for (const c of rb.bands) {
    p.append(kv(`${c.id} · ${c.label}`, c.count
      ? `${c.count} Teile · ${c.min}–${c.max}`
      : 'unbesetzt', c.count ? '' : 'tag bad'));
    p.append(el('p', { class: 'note', html: c.count ? c.rule
      : '<b>Regel inaktiv:</b> in diesem Bestand gibt es keine Teile dieser Größe. '
        + 'Sie läuft, sobald welche dazukommen.' }));
  }
  p.append(el('p', { class: 'note', html:
    '<b>Kombination:</b> wo ein A steht, stehen zwei bis drei B am Fuß und C dazwischen. Wo nur '
    + 'B steht, steht C dazwischen. C allein nur auf freier Wiese, nie im Laufweg.' }));
}

/* Kontaktbogen. Miniaturen entstehen erst, wenn die Karte ins Bild kommt — 200 Teile auf
   einmal zu rendern kostet Sekunden und zeigt nichts, was man vorher nicht wüsste. */
let thumbRenderer = null;
function thumb(rec, target) {
  if (!thumbRenderer) {
    thumbRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    thumbRenderer.setSize(192, 192, false);
    thumbRenderer.outputColorSpace = THREE.SRGBColorSpace;
  }
  const sc = new THREE.Scene();
  sc.add(new THREE.HemisphereLight(0xdff0ff, 0x30323a, 2.2));
  const d = new THREE.DirectionalLight(0xffffff, 1.7); d.position.set(3, 6, 4); sc.add(d);
  return instance(rec).then((node) => {
    sc.add(node);
    const box = new THREE.Box3().setFromObject(node);
    const c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
    const r = Math.max(s.x, s.y, s.z) || 1;
    const cam = new THREE.PerspectiveCamera(32, 1, r / 100, r * 40);
    cam.position.copy(c).add(new THREE.Vector3(r * 1.5, r * 1.25, r * 1.7));
    cam.lookAt(c);
    thumbRenderer.render(sc, cam);
    const cv = target;
    cv.width = cv.height = 192;
    cv.getContext('2d').drawImage(thumbRenderer.domElement, 0, 0);
  }).catch(() => { target.replaceWith(el('div', { class: 'ph' })); });
}

function bauteile(p) {
  const fams = [...new Set(S.recs.map((r) => r.family))].sort();
  const sel = el('select', {}, [el('option', { value: '*' }, `alle (${S.recs.length})`)]
    .concat(fams.map((f) => el('option', { value: f }, `${f} (${S.recs.filter((r) => r.family === f).length})`))));
  const roleSel = el('select', {}, [el('option', { value: '*' }, 'alle Rollen')]
    .concat([...new Set(S.recs.map((r) => r.role))].map((r) => el('option', { value: r }, r))));
  p.append(el('h2', {}, 'Kontaktbogen'));
  p.append(el('div', { class: 'ctrl' }, [el('label', {}, 'Familie'), sel]));
  p.append(el('div', { class: 'ctrl' }, [el('label', {}, 'Rolle'), roleSel]));
  const count = el('p', { class: 'note' });
  p.append(count);
  p.append(el('p', { class: 'note', html:
    'Jede Kachel ist das echte Teil, live geladen und im selben Rahmen gerendert. Der Bogen '
    + 'ist der Beleg, nicht die Messtabelle — er zeigt, was eine Zahl nicht zeigt.' }));

  const draw = () => {
    const grid = $('#grid'); grid.innerHTML = '';
    const list = S.recs.filter((r) => (sel.value === '*' || r.family === sel.value)
      && (roleSel.value === '*' || r.role === roleSel.value));
    count.textContent = `${list.length} Teile`;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { io.unobserve(e.target); thumb(e.target.__rec, e.target); }
    }, { root: $('#sheet'), rootMargin: '200px' });
    for (const r of list) {
      const cv = el('canvas'); cv.__rec = r;
      const cap = el('div', { class: 'cap', html:
        `<b>${r.base}</b>${r.role}${r.rock ? ' · ' + r.rock : ''}<br>`
        + (r.size ? `${r.size.join(' × ')}<br>${r.tris} △` : 'noch nicht vermessen') });
      grid.append(el('div', { class: 'cardi' }, [cv, cap]));
      io.observe(cv);
    }
  };
  sel.onchange = roleSel.onchange = draw;
  draw();
}

function generator(p) {
  const g = S.gen;
  const row = (label, node, valNode) => el('div', { class: 'ctrl' },
    [el('label', {}, label), node].concat(valNode ? [valNode] : []));
  const seed = el('input', { type: 'text', value: g.seed });
  const cells = el('input', { type: 'range', min: '5', max: '61', step: '1', value: String(g.cells) });
  const cellsV = el('span', { class: 'val' }, String(g.cells));
  const terr = el('input', { type: 'range', min: '1', max: '5', step: '1', value: String(g.terraces) });
  const terrV = el('span', { class: 'val' }, String(g.terraces));
  const shape = el('select', {}, Object.entries(SHAPES).map(([k, v]) =>
    el('option', { value: k, ...(k === g.shape ? { selected: 'selected' } : {}) }, v.label)));
  const path = el('input', { type: 'checkbox', ...(g.path ? { checked: 'checked' } : {}) });
  const style = el('select', {}, [['auto', 'automatisch'], ['quaternius', 'Quaternius-Pfadkacheln'], ['hexroad', 'Hex-Straßenkacheln']]
    .map(([k, l]) => el('option', { value: k, ...(k === (g.pathStyle || 'auto') ? { selected: 'selected' } : {}) }, l)));
  const tset = el('select', {}, [['hex', `Hexagon-Pack (${S.kit.sets.hex.length})`],
                                 ['builder', `Builder Pack (${S.kit.sets.builder.length})`],
                                 ['both', `beide gemischt (${S.kit.sets.both.length})`]]
    .map(([k, l]) => el('option', { value: k, ...(k === g.tileSet ? { selected: 'selected' } : {}) }, l)));

  cells.oninput = () => { cellsV.textContent = cells.value; };
  terr.oninput = () => { terrV.textContent = terr.value; };

  p.append(el('h2', {}, 'Plattform'));
  p.append(row('Seed', seed));
  p.append(row('Zellen', cells, cellsV));
  p.append(row('Terrassen', terr, terrV));
  p.append(row('Form', shape));
  p.append(row('Kachelsatz', tset));
  p.append(row('Weg legen', path));
  p.append(row('Wegart', style));
  p.append(el('button', { class: 'go', onclick: () => {
    Object.assign(S.gen, { seed: seed.value || 'kfb', cells: +cells.value, terraces: +terr.value,
      shape: shape.value, path: path.checked, pathStyle: style.value, tileSet: tset.value });
    generate();
  } }, 'Plattform bauen'));
  p.append(el('button', { class: 'go sec', onclick: () => {
    seed.value = 'kfb-' + Math.random().toString(36).slice(2, 7);
    Object.assign(S.gen, { seed: seed.value });
    generate();
  } }, 'Neuer Seed'));

  p.append(el('div', { id: 'genreport' }));
  renderReport();
}

function renderReport() {
  const host = $('#genreport');
  if (!host || !S.last) return;
  host.innerHTML = '';
  const r = S.last.report;
  host.append(el('h2', {}, 'Bericht'));
  host.append(kv('Bodenbiom', S.biome ? S.biome.key + ` · ${S.biome.tiles.length} Varianten` : '—'));
  host.append(kv('Varianten', S.biome
    ? `Grund 1 · Detail ${S.biome.tiles.filter((t) => /detail|variant|alt/i.test(t.base)).length} · Übergang ${S.biome.tiles.filter((t) => /transition/i.test(t.base)).length}`
    : '—'));
  host.append(kv('Zellen', r.cells));
  host.append(kv('Deckkacheln', r.tiles));
  host.append(kv('Füllkacheln', r.fill));
  host.append(kv('Zweistufensprünge', r.gaps));
  host.append(kv('Padding gesetzt', r.paddingParts ? r.padding : 'kein Teil im Bestand',
    r.paddingParts && r.padding ? 'tag ok' : 'tag warn'));
  host.append(kv('Zu groß zum Streuen', r.tooBig, r.tooBig ? 'tag warn' : 'tag ok'));
  host.append(kv('Wegkacheln', `${r.path} · ${r.pathStyle}`));
  host.append(kv('Weg ungelöst', r.pathUnsolved, r.pathUnsolved ? 'tag bad' : 'tag ok'));
  host.append(kv('Felsen A / B / C', `${r.rocks.A} / ${r.rocks.B} / ${r.rocks.C}`));
  host.append(kv('Natur', r.nature));
  host.append(kv('Landmarke', r.landmark));
  host.append(kv('Maße', (r.size || []).join(' × ')));
  host.append(kv('Fehlende Teile', r.missing.length, r.missing.length ? 'tag bad' : 'tag ok'));
  host.append(kv('Kontaktscheiben', light.report.contacts));
  host.append(kv('Schatten', `Spanne ${light.report.span} · Texel ${light.report.texel}`));
  if (r.rockInactive?.length) host.append(el('p', { class: 'note', html:
    `<b>Inaktive Felsregeln:</b> ${r.rockInactive.join(', ')} — keine Teile dieser Größe im Bestand.` }));
  if (!r.paddingParts) host.append(el('p', { class: 'note', html:
    '<b>Bauschritt 4 läuft nicht:</b> in beiden Packs liegt kein Teilsechseck. Alle 128 '
    + 'Hex-Kacheln des Builder Packs messen 2 × 2,309, also volle Kachel; der einzige '
    + 'Kandidat im Hexagon-Pack ist <code>hex_coast_D_waterless</code> — eine halbe '
    + 'Uferkachel, kein Padding-Teil. An Zweistufensprüngen bleibt die Kante hart. '
    + 'Nichts gesetzt ist besser als etwas Falsches gesetzt.' }));
}

async function generate() {
  say('Plattform wird gebaut…');
  stage.clear();
  const plan = planPlatform(S.gen);
  /* EIN Biom je Plattform, aus dem Seed gewählt. Vorher würfelte der Generator je Zelle aus
     allen Deckkacheln beider Packs — das Ergebnis war Flickwerk aus Wald, Sand und Wiese. */
  const pool = S.kit.biomes.filter((b) => S.gen.tileSet === 'both' || b.pack === S.gen.tileSet);
  const chosen = pool.length
    ? pool[Math.floor(Math.abs([...String(S.gen.seed)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)) % pool.length)]
    : null;
  /* Grundkachel ist die mit dem kürzesten Namen — `hex_sand` vor `hex_sand_detail`. Keine
     Heuristik über Dreiecke nötig, die Pack-Autoren benennen konsequent. */
  const biome = chosen ? (() => {
    const base = [...chosen.tiles].sort((x, y) => x.base.length - y.base.length)[0];
    return {
      base,
      detail: chosen.tiles.filter((t) => /detail|variant|alt/i.test(t.base)),
      transition: chosen.tiles.filter((t) => /transition/i.test(t.base)),
    };
  })() : null;
  const kit = { ...S.kit, modules: chosen ? chosen.tiles : S.kit.sets.both, biome };
  S.biome = chosen;
  const built = await buildPlatform(plan, kit, S.metrics, { path: S.gen.path, pathStyle: S.gen.pathStyle });
  stage.add(built.group);
  light.report.contacts = 0;
  light.contacts(built.group, { maxSize: S.metrics.W * 0.8 });
  S.last = built;
  frame(built.group, 1.15);
  done();
  renderReport();
}

window.HEXKIT = { S, scene, stage, camera, renderer, light, generate, planPlatform, buildPlatform };
