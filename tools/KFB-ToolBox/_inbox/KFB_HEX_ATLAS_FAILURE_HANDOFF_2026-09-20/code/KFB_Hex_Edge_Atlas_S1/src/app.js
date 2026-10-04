/* BT1 · Kanten-Atlas. Laden, messen, EICHEN, hinsehen.

   Ablauf, und die Reihenfolge ist die Aussage:
     1 Kacheln beider Packs laden (Pfade aus dem Registry-Shard, nichts geraten)
     2 Sektorprofil je Kachel messen — Geometrie, keine Kamera
     3 Farbgruppen aus dem Bestand ableiten
     4 GEGEN `TILE_EDGES` EICHEN — trifft es die 32 bekannten Kacheln nicht, hört es hier auf
     5 erst dann die Tabelle für die 128 ungedeckten Builder-Kacheln ableiten
     6 Kontaktbogen: jede Kachel von oben, mit den sechs gemessenen Kanten als Ring

   Schritt 6 ist kein Schmuck. Zwei Fehlschläge an einem Tag wurden von Georg im BILD
   gefunden und von keiner Messung (Projektregel 7). */
import * as THREE from 'three';
import { readPack } from '../../KFB_Hex_Baukasten_S0/src/inventory.js';
import { load, warm, measured, folds } from '../../KFB_Hex_Baukasten_S0/src/kit.js';
import {
  hexMetrics, TILE_EDGES, atlasProbe, harvestTriangles, sectorProfile,
  deriveColorGroups, calibrate, classifyEdges, verify,
} from './measure.js';
import { loadStock, CASES, makeStage } from './cases.js';
import { instance } from '../../KFB_Hex_Baukasten_S0/src/kit.js';

const $ = (s) => document.querySelector(s);
const COL = { g: '#6fbf5a', s: '#e0b34a', w: '#4a90d9', '?': '#d94ad9' };
const state = { tiles: [], groups: [], report: null, metrics: null, waterDrop: 0, packs: [] };

const say = (t, sub) => { $('#boot b').textContent = t; if (sub != null) $('#boot span').textContent = sub; };

/* Kopf und Tab-Leiste kommen aus dem JS, nicht aus dem Markup. Diese Seite liegt zusätzlich
   als Spiegel auf Projektebene; solange die Leiste im HTML stand, fehlte dort jeder neue
   Bildschirm still. Eine Hülle, die nichts weiß, kann nicht veralten. */
const TABS = [
  ['calib', 'Eichung'], ['sheet', 'Kontaktbogen'], ['stock', 'Teile'],
  ['cases', 'Bauvorgaben'], ['table', 'Tabelle'], ['lessons', 'Lehren'],
];
function chrome() {
  $('#head').innerHTML = `<h1>Hex-Kanten-Atlas · S1 · BT1/BT2</h1>
    <p>Sechs Kanten je Kachel, gemessen aus der Geometrie im Objektraum — keine Kamera in der
       Messkette. Das Verfahren wird zuerst gegen <code>TILE_EDGES</code> geeicht; erst wenn es
       die 32 bekannten Kacheln trifft, darf es die ungedeckten Builder-Kacheln beschreiben.</p>`;
  $('#tabs').innerHTML = TABS.map(([v, l], i) =>
    `<button${i === 0 ? ' class="on"' : ''} data-v="${v}">${l}</button>`).join('');
}

/* Eine Kachel ist, was im Pack unter `tiles` liegt oder `hex_…` heißt. Gebäude, Natur und
   Requisiten haben keine Kanten im Sinne dieses Atlas — sie STEHEN auf einer Kachel. */
const isTile = (p) => /(^|\/)tiles?(\/|$)/i.test(p.family || '') || /^hex[_-]/i.test(p.base || '');

async function boot() {
  chrome();
  say('Bestand lesen', 'Registry-Shards beider Packs');
  const packs = [];
  for (const key of ['hex', 'builder']) {
    try { packs.push(await readPack(key)); }
    catch (e) { packs.push({ key, label: key, parts: [], error: e.message }); }
  }
  state.packs = packs;
  const tiles = packs.flatMap((p) => p.parts.filter(isTile));
  if (!tiles.length) { say('KEINE KACHELN', 'Registry-Shard nicht lesbar — nichts gemessen'); return; }

  say('Kacheln laden', `0 / ${tiles.length}`);
  const res = await warm(tiles, (n, all) => say('Kacheln laden', `${n} / ${all}`), 10);

  /* Atlas-Sonde JE PACK — und die Zahl, die dabei herauskommt, ist 1.

     NUR DAS HEXAGON-PACK HAT EINEN ATLAS (`hexagons_medieval`). Das Builder-Pack benutzt
     EINFARBIGE Materialien ohne `map`; seine Kanten werden aus der Materialfarbe gelesen.
     Die Erklärung »die beiden Packs haben verschiedene Atlanten« war falsch und stand in
     drei Dokumenten — ein Befund über den Bestand, den niemand nachgemessen hatte.

     Der wirkliche Fehler hinter `hex_forest = wwwwww`: die Builder-Geometrie trägt UVs, und
     die Bedingung `if (uv && probe)` griff mit der GLOBAL gesetzten Hexagon-Sonde, statt auf
     die Materialfarbe zurückzufallen. Weil die Sonde jetzt am Material hängt (`mat.map`
     fehlt → null), fällt Builder korrekt auf die Flachfarbe zurück.

     Der Schlüssel ist das Pack, weil kein Merkmal der Textur taugt: GLTFLoader decodiert zu
     `ImageBitmap` (weder `src` noch `currentSrc`), und `texture.uuid` wie
     `texture.source.uuid` werden bei jedem Ladevorgang neu geprägt. Ein Schlüssel auf die
     Bildquelle fiel still auf die uuid zurück, decodierte 60 Canvas für einen Atlas — und
     wurde als behoben gemeldet, während die Seite weiter »60« zeigte. */
  const probes = new Map();
  const probeFor = (pack) => (mat) => {
    const tex = mat?.map;
    if (!tex) return null;
    if (!probes.has(pack)) probes.set(pack, atlasProbe(tex));
    return probes.get(pack);
  };

  /* Modulmaß: die meistvertretene Grundfläche unter den geladenen Kacheln. */
  const sizes = res.ok.map((p) => measured.get(p.path)).filter(Boolean);
  const tally = new Map();
  for (const r of sizes) { const k = `${r.size[0].toFixed(2)}x${r.size[2].toFixed(2)}`; tally.set(k, (tally.get(k) || 0) + 1); }
  const [bestKey, bestN] = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];
  const ref = sizes.find((r) => `${r.size[0].toFixed(2)}x${r.size[2].toFixed(2)}` === bestKey);
  const m = hexMetrics(ref.size);
  /* Die Terrassenstufe ist die Körperhöhe der Referenzkachel — die Deckfläche liegt bei
     y = 0, der Körper hängt darunter (S11-Befund). `hexMetrics` liefert sie NICHT, und der
     Padding-Fall rechnete deshalb `level * undefined`: 32 Teile auf NaN, Gruppe voll,
     Bild schwarz. Eine fehlende Zahl ist kein leeres Bild, sie ist ein stilles NaN. */
  state.metrics = { ...m, step: +ref.size[1].toFixed(3), sample: bestN, of: sizes.length, key: bestKey };

  say('Kanten messen', `0 / ${res.ok.length}`);
  const samples = [];
  let i = 0;
  for (const p of res.ok) {
    const scene = await load(p);
    const rec = measured.get(p.path) || p;
    /* Nur Kacheln auf dem Gitter. Was nicht aufs Modulmaß passt, wird ausgewiesen statt
       stillschweigend mitgemessen — sonst verzerrt eine 4×4-Platte alle Sektoren. */
    const onGrid = Math.abs(rec.size[0] - m.W) < m.W * 0.12 && Math.abs(rec.size[2] - m.H) < m.H * 0.12;
    const tris = harvestTriangles(scene, probeFor(p.pack));
    const prof = sectorProfile(tris, m);
    state.tiles.push({ ...p, rec, onGrid, prof, scene, kinds: null });
    if (onGrid) for (const s of prof) if (s.col) samples.push({ base: p.base, d: s.d, col: s.col });
    if (++i % 12 === 0) say('Kanten messen', `${i} / ${res.ok.length}`);
  }

  say('Farbgruppen ableiten', `${samples.length} Sektorproben`);
  const { groups, cut } = deriveColorGroups(samples);
  const edgeIndex = new Map(Object.entries(TILE_EDGES));
  state.groups = calibrate(groups, edgeIndex);
  state.cut = cut;

  /* Wasserebene: Median der tiefsten Fugenflächen, die überhaupt unter der Deckfläche
     liegen. hex-grid.js nennt ≈ −0,20 für die Uferkacheln — hier wird der Wert gemessen
     statt zitiert. Er klassifiziert NICHT mehr (das tut der Flächenanteil), er belegt nur,
     dass es eine gemeinsame Ebene gibt. */
  const lows = state.tiles.flatMap((t) => t.prof.map((s) => s.low)).filter((v) => v < -0.05).sort((a, b) => a - b);
  state.waterDrop = lows.length ? +lows[lows.length >> 1].toFixed(3) : 0;

  /* KEINE SUCHE. Jede Sektorprobe IST Mitglied ihrer Gruppe — die Zuordnung steht seit dem
     Gruppieren fest.

     DIE ERSTE FASSUNG HAT SIE WEGGEWORFEN UND DANN GERATEN: ein unbegrenztes
     Nächster-Nachbar über alle 32 Gruppen, das nur die 4 GEEICHTEN Gruppen als Antwort
     zuließ. Eine Builder-Farbe rastete damit auf die am wenigsten weit entfernte der vier
     ein, egal wie fern sie war — `hex_forest` kam als `wwwwww` heraus, Waldgrün als sechs
     Wasserkanten. Exakt der Fehler, den hex-grid.js für sein verworfenes UV-Sampling
     protokolliert. Eine Zuordnung, die man schon hat, darf man nicht noch einmal schätzen. */
  const byProbe = new Map();
  for (const g of state.groups) for (const mem of g.members) byProbe.set(mem.base + '|' + mem.d, g);
  const resolver = (base) => (s) => {
    const g = byProbe.get(base + '|' + s.d);
    if (!g) return null;
    return { letter: g.kind, cls: g.kind ?? ('#' + g.id), group: g };
  };

  /* Beide Regeln durch dieselbe Eichung. Gewonnen hat, was misst. */
  const rules = [
    { id: 'A', label: 'Geometrie schlägt Farbe (Fuge unter Deckhöhe = Wasser)', opts: { wet: 0.35 } },
    { id: 'B', label: 'Nur Farbe (Gruppe der Probe entscheidet)', opts: { wet: 2 } },
  ];
  /* EICHUNG NUR GEGEN DAS PACK, DAS DIE TABELLE BESCHREIBT. `TILE_EDGES` ist die Kantenkunde
     des HEXAGON-Packs. `hex_water` gibt es in beiden Packs — die erste Fassung zählte beide
     gegen dieselbe Tabelle und meldete 33 geprüfte Kacheln, wo die Tabelle 32 Einträge hat.
     Ein Bericht, dessen Zweck ehrliches Messen ist, darf seine eigene Stichprobe nicht um
     eins überzählen. Und der Brief sagt es ausdrücklich: die Maße und Anschlüsse der beiden
     Packfamilien werden NICHT stillschweigend gleichgesetzt. */
  for (const r of rules) {
    r.out = state.tiles.map((t) => (t.onGrid ? classifyEdges(t.prof, resolver(t.base), r.opts) : null));
    r.report = verify(state.tiles
      .map((t, i) => ({ base: t.base, pack: t.pack, kinds: r.out[i]?.kinds || '??????' }))
      .filter((x) => x.pack === 'hex'));
  }
  const win = rules.slice().sort((a, b) => (b.report.edges ?? 0) - (a.report.edges ?? 0))[0];
  state.rules = rules;
  state.rule = win;
  state.tiles.forEach((t, i) => { t.kinds = win.out[i]?.kinds || null; t.classes = win.out[i]?.classes || null; });
  state.report = win.report;

  /* Zweite Kennzahl, getrennt geführt: die Eichquote gilt NUR für Kacheln, die schon eine
     Tabelle hatten. Was das Werkzeug für das ungedeckte Pack wirklich liefert, ist eine
     andere Zahl — und sie gehört danebengestellt, nicht in dieselbe Überschrift. */
  /* Der Zugewinn zählt alles, was keine bekannte Tabelle hat — auch die Hexagon-Kacheln, die
     dort fehlen, und die gleichnamigen Builder-Kacheln, für die sie nicht gilt. */
  const fresh = state.tiles.filter((t) => t.onGrid && !(t.pack === 'hex' && TILE_EDGES[t.base]));
  state.fresh = {
    total: fresh.length,
    full: fresh.filter((t) => t.classes && t.classes.every(Boolean)).length,
    partial: fresh.filter((t) => t.classes && t.classes.some(Boolean) && !t.classes.every(Boolean)).length,
    none: fresh.filter((t) => !t.classes || !t.classes.some(Boolean)).length,
    lettered: fresh.filter((t) => t.kinds && !t.kinds.includes('?')).length,
  };
  state.offGrid = state.tiles.filter((t) => !t.onGrid);
  /* Kacheln ohne Oberseite (Unterseiten-Kappen: alle Normalen zeigen nach unten) sind kein
     Messfehler — sie haben keine Deckfläche, auf der eine Kante liegen könnte. */
  state.noDeck = state.tiles.filter((t) => t.onGrid && t.prof.every((s) => s.hits === 0));
  state.probeCount = probes.size;
  /* Basenamen, die in BEIDEN Packs vorkommen. Sie sind der Grund, warum der Export
     pack-qualifiziert schlüsselt — sonst überschreibt einer den anderen. */
  const seen = new Map();
  for (const t of state.tiles) seen.set(t.base, (seen.get(t.base) || new Set()).add(t.pack));
  state.shared = [...seen.entries()].filter(([, p]) => p.size > 1).map(([b]) => b);
  state.fail = res.fail || [];
  $('#boot').classList.add('gone');
  renderCalib();
  bindTabs();
}

/* ── Bildschirm 1 · Eichung ─────────────────────────────────────────────────────────── */
function renderCalib() {
  const r = state.report, m = state.metrics;
  const pass = r.edges !== null && r.edges >= 0.95;
  const rows = [];
  const kv = (k, v, cls) => rows.push(`<div class="kv"><span>${k}</span><b class="${cls || ''}">${v}</b></div>`);

  rows.push('<h2>Eichung gegen TILE_EDGES</h2>');
  rows.push('<p class="note">Geprüft werden nur Kacheln des <b>Hexagon-Packs</b> — die Tabelle beschreibt kein anderes. Eine frühere Fassung zählte das gleichnamige <code>hex_water</code> des Builder-Packs mit und meldete 33 Kacheln, wo die Tabelle 32 Einträge hat.</p>');
  if (r.tileCount === 0) {
    rows.push('<p class="note bad">Keine der geladenen Kacheln steht in TILE_EDGES. Ohne bekannte Wahrheit ist die Messung nicht prüfbar — hier wird nichts abgeleitet.</p>');
  } else {
    for (const x of state.rules) {
      rows.push(`<div class="kv"><span>Regel ${x.id} · ${x.label}</span><b class="${x === state.rule ? 'ok' : ''}">`
        + `${(x.report.edges * 100).toFixed(1)} % Kanten · ${(x.report.tiles * 100).toFixed(1)} % Kacheln`
        + `${x === state.rule ? ' ← gewählt' : ''}</b></div>`);
    }
    kv('Geprüfte Kacheln', r.tileCount);
    kv('Kanten richtig', `${(r.edges * 100).toFixed(1)} %`, pass ? 'ok' : 'bad');
    kv('Kacheln vollständig richtig', `${(r.tiles * 100).toFixed(1)} %`, r.tiles >= 0.9 ? 'ok' : 'bad');
    rows.push(pass
      ? '<p class="note ok">Das Verfahren trifft die bekannte Tabelle. Es darf auf die ungedeckten Builder-Kacheln angewendet werden.</p>'
      : '<p class="note bad">FAIL · Das Verfahren trifft die bekannte Tabelle nicht. Die abgeleitete Builder-Tabelle unten ist damit NICHT belegt und darf nicht in den Generator.</p>');

    /* Die Eichquote oben gilt NUR für Kacheln, die schon eine Tabelle hatten. Was für das
       ungedeckte Pack wirklich herauskommt, ist eine zweite Zahl — und sie stand in der
       ersten Fassung nirgends, während README und github.md 143 Kacheln als geliefert
       meldeten. Sie gehört hierher, getrennt und ungeschönt. */
    const f = state.fresh;
    rows.push('<h2>Builder-Pack · was wirklich herauskommt</h2>');
    rows.push(`<p class="note">Die Quote oben gilt ausschließlich für die ${r.tileCount} Kacheln des Hexagon-Packs, die bereits eine Tabelle hatten. Diese hier hatten keine — sie sind der eigentliche Zugewinn und werden deshalb getrennt gezählt.</p>`);
    kv('Kacheln ohne bekannte Tabelle', f.total);
    kv('Alle sechs Kanten klassifiziert', `${f.full} · ${((f.full / Math.max(1, f.total)) * 100).toFixed(0)} %`, f.full === f.total ? 'ok' : 'warn');
    kv('Teilweise klassifiziert', f.partial, f.partial ? 'warn' : 'ok');
    kv('Gar nicht klassifiziert', f.none, f.none ? 'bad' : 'ok');
    kv('Davon im Alphabet g/s/w (ohne ?)', f.lettered, 'warn');
    rows.push(`<p class="note">Die Übrigen tragen Klassen, die das Hexagon-Alphabet nicht kennt — eigene Geländesorten des Builder-Packs. Sie bekommen ihre Gruppen-ID (<code>#7</code>) statt eines erfundenen Buchstabens. Für Nachbarschaft reicht das: »passt A an B« heißt nur »gleiche Klasse beiderseits der Fuge«.</p>`);
    if (state.noDeck.length) kv('Ohne Deckfläche (Unterseiten-Kappen)', state.noDeck.length, 'warn');
    if (state.offGrid.length) kv('Nicht auf dem Gitter — nicht gemessen', state.offGrid.length, 'warn');
    if (state.shared.length) kv('Basenamen in BEIDEN Packs', `${state.shared.join(', ')} — Export schlüsselt pack-qualifiziert`, 'warn');
    const bad = r.rows.filter((x) => !x.ok);
    if (bad.length) {
      rows.push(`<h2>Abweichungen · ${bad.length}</h2><div class="mono">`);
      for (const b of bad.slice(0, 40)) {
        let got = '';
        for (let d = 0; d < 6; d++) got += b.got[d] === b.truth[d] ? b.got[d] : `<u>${b.got[d]}</u>`;
        rows.push(`<div class="cmp"><i>${b.base}</i><span>soll ${b.truth}</span><span>ist ${got}</span></div>`);
      }
      rows.push('</div>');
    }
  }

  rows.push('<h2>Farbgruppen aus dem Bestand</h2>');
  rows.push(`<p class="note">Verschmelzungsgrenze ${state.cut} (Median-Nachbarabstand × 2,6), nicht gesetzt. Gefunden: ${state.groups.length} Gruppen.</p>`);
  for (const g of state.groups) {
    const sw = `rgb(${g.col.join(',')})`;
    rows.push(`<div class="kv"><span><i class="sw" style="background:${sw}"></i> Gruppe ${g.id} · ${g.n} Proben ${g.name ? `· »${g.name}«` : ''}</span>`
      + `<b>${g.kind ? `„${g.kind}" · ${(g.purity * 100).toFixed(0)} % rein · ${g.known} bekannt` : (g.known ? `unklar (${g.known} bekannt)` : `#${g.id} · eigene Klasse des Builder-Packs`)}</b></div>`);
  }

  rows.push('<h2>Gemessenes Gitter</h2>');
  kv('Referenz-Grundfläche', `${m.key} · ${m.sample}/${m.of}`);
  kv('Inkreis / Umkreis', `${m.inradius.toFixed(3)} / ${m.circumradius.toFixed(3)}`);
  kv('Wasserebene (Median)', state.waterDrop.toFixed(3));
  kv('Textur-Faltung', `${folds.unique} von ${folds.seen}`);
  kv('Atlas-Sonden', `${state.probeCount} — nur das Hexagon-Pack hat einen Atlas; Builder-Kacheln werden aus der Materialfarbe gelesen`);

  rows.push('<h2>Bestand</h2>');
  for (const p of state.packs) kv(p.label, p.error ? 'FEHLER: ' + p.error : `${p.parts.filter(isTile).length} Kacheln`);
  if (state.fail.length) kv('Nicht geladen', state.fail.length, 'bad');

  $('#pane').innerHTML = rows.join('');
}

/* ── Bildschirm 2 · Kontaktbogen ─────────────────────────────────────────────────────
   Draufsicht je Kachel, und darüber die sechs GEMESSENEN Kanten als Ring. Die Kamera hat
   `up = (0,0,−1)`, damit +x rechts und +z unten liegt — dieselbe Konvention wie der
   Messwinkel. Läge sie anders, sähe der Ring richtig aus und wäre es nicht: genau der
   Fehler, an dem das zweite Messverfahren in hex-grid.js gescheitert ist. */
let shot = null;
function shooter() {
  if (shot) return shot;
  const S = 192;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(S, S);
  renderer.setClearColor(0x0f1216, 1);
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x404858, 2.1));
  const dir = new THREE.DirectionalLight(0xffffff, 1.5);
  dir.position.set(2, 6, 3);
  scene.add(dir);
  const m = state.metrics;
  const half = m.circumradius * 1.12;
  const cam = new THREE.OrthographicCamera(-half, half, half, -half, 0.1, 40);
  cam.position.set(0, 8, 0);
  cam.up.set(0, 0, -1);
  cam.lookAt(0, 0, 0);
  shot = { renderer, scene, cam, S };
  return shot;
}

function thumb(tile, canvas) {
  const { renderer, scene, cam, S } = shooter();
  const node = tile.scene.clone(true);
  scene.add(node);
  renderer.render(scene, cam);
  scene.remove(node);
  const ctx = canvas.getContext('2d');
  canvas.width = S; canvas.height = S;
  ctx.drawImage(renderer.domElement, 0, 0);
  if (!tile.kinds) return;

  /* Der Ring: Kante d liegt bei d·60°, Sektor ±30°. Screen-x = +x, screen-y = +z.
     Eine Klasse, die das Hexagon-Alphabet nicht kennt, wird in IHRER EIGENEN Farbe
     gezeichnet — nicht in der einer fremden Klasse. Genau die Verwechslung war der Fehler. */
  const R = S * 0.46, cx = S / 2, cy = S / 2;
  const truth = TILE_EDGES[tile.base];
  ctx.lineWidth = S * 0.055;
  ctx.lineCap = 'butt';
  for (let d = 0; d < 6; d++) {
    const k = tile.kinds[d];
    const cls = tile.classes?.[d];
    let stroke = COL[k] || COL['?'];
    if (cls && cls[0] === '#') {
      const g = state.groups[+cls.slice(1)];
      if (g) stroke = `rgb(${g.col.join(',')})`;
    }
    const a0 = (d * 60 - 27) * Math.PI / 180, a1 = (d * 60 + 27) * Math.PI / 180;
    ctx.strokeStyle = stroke;
    ctx.beginPath(); ctx.arc(cx, cy, R, a0, a1); ctx.stroke();
    if (truth && truth[d] !== k) {
      ctx.strokeStyle = '#ff3b30';
      ctx.lineWidth = S * 0.018;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.12, a0, a1); ctx.stroke();
      ctx.lineWidth = S * 0.055;
    }
  }
  /* Kante 0 markieren, sonst ist der Ring nicht lesbar. */
  ctx.fillStyle = '#f2efe6';
  ctx.font = `${Math.round(S * 0.085)}px ui-monospace,monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('0', cx + R * 0.74, cy);
}

function renderSheet() {
  const q = ($('#find')?.value || '').toLowerCase();
  const only = $('#onlybad')?.checked;
  const list = state.tiles.filter((t) => (!q || t.base.toLowerCase().includes(q) || t.pack.toLowerCase().includes(q))
    && (!only || (TILE_EDGES[t.base] && TILE_EDGES[t.base] !== t.kinds)));
  const head = `<div class="bar">
      <input id="find" type="text" placeholder="filtern (auch nach Pack)…" value="${q}">
      <label><input id="onlybad" type="checkbox" ${only ? 'checked' : ''}> nur Abweichungen</label>
      <span class="note">${list.length} von ${state.tiles.length}</span>
      <span class="legend">${Object.entries(COL).map(([k, c]) => `<i class="sw" style="background:${c}"></i>${k}`).join('')}</span>
    </div><div id="grid"></div>`;
  $('#pane').innerHTML = head;
  const grid = $('#grid');
  for (const t of list.slice(0, 260)) {
    const card = document.createElement('div');
    card.className = 'cardi';
    const cv = document.createElement('canvas');
    card.appendChild(cv);
    const truth = TILE_EDGES[t.base];
    const cls = t.classes ? t.classes.map((c) => c || '·').join(' ') : '';
    /* Das Pack GEHÖRT in die Beschriftung: `hex_water` gibt es in beiden, und die beiden
       wurden gegen verschiedene Atlanten gemessen. Der Kontaktbogen ist die Ansicht, an der
       ein Mensch prüft — ausgerechnet dort dürfen die Packs nicht zusammenfallen. */
    card.insertAdjacentHTML('beforeend',
      `<div class="cap"><b>${t.base}</b><em class="pk">${t.pack}</em>${t.kinds || '— nicht gemessen'}`
      + `${truth && truth !== t.kinds ? `<br><s>${truth}</s>` : ''}`
      + `${t.classes && t.kinds?.includes('?') ? `<br><em>${cls}</em>` : ''}`
      + `${t.onGrid ? '' : '<br>off-grid'}</div>`);
    grid.appendChild(card);
    thumb(t, cv);
  }
  $('#find').oninput = () => renderSheet();
  $('#onlybad').onchange = () => renderSheet();
}

/* ── Bildschirm 3 · Die Tabelle ──────────────────────────────────────────────────────
   Was der Generator später lesen soll — und zwar nur, wenn die Eichung bestanden hat. */
function renderTable() {
  const pass = state.report.edges !== null && state.report.edges >= 0.95;
  const f = state.fresh;
  const onGrid = state.tiles.filter((t) => t.onGrid && t.kinds);
  /* PACK-QUALIFIZIERTER SCHLÜSSEL. Die erste Fassung schlüsselte nach bloßem Basenamen —
     `hex_water` gibt es in BEIDEN Packs, einer überschrieb den anderen stillschweigend.
     Genau das verbietet der Brief: die beiden Packfamilien dürfen nebeneinander stehen,
     aber ihre Anschlüsse werden nicht gleichgesetzt — zumal sie gegen VERSCHIEDENE Atlanten
     gemessen wurden. Heute messen beide zufällig dasselbe; das Schema dürfte den Unterschied
     trotzdem nicht verlieren. Jeder Eintrag trägt zusätzlich Pack und Pfad, damit ein Leser
     ihn auf eine Datei zurückführen kann. */
  const key = (t) => `${t.pack}|${t.base}`;
  const out = { schema: 'kfb.hex-edge-atlas/3', measuredAt: new Date().toISOString(),
    calibration: { against: 'hexrealm/lib/hex-grid.js TILE_EDGES',
                   scope: 'nur Kacheln des Hexagon-Packs — die Tabelle beschreibt kein anderes',
                   tiles: state.report.tileCount, edgeAccuracy: state.report.edges,
                   tileAccuracy: state.report.tiles, pass, rule: state.rule.label },
    /* Getrennt ausgewiesen, weil es zwei verschiedene Aussagen sind. Eine frühere Fassung
       meldete nur die Eichquote und verkaufte 143 unvollständige Kacheln als geliefert. */
    coverage: { withoutKnownTable: f.total, fullyClassified: f.full, partial: f.partial,
                unclassified: f.none, inKnownAlphabet: f.lettered,
                note: 'Klassen mit # sind eigene Geländesorten des Builder-Packs; das Hexagon-Alphabet kann sie nicht benennen.' },
    sharedBasenames: state.shared,
    grid: { W: +state.metrics.W.toFixed(3), H: +state.metrics.H.toFixed(3),
            inradius: +state.metrics.inradius.toFixed(3) },
    waterPlane: state.waterDrop,
    colorGroups: state.groups.map((g) => ({ id: g.id, rgb: g.col, kind: g.kind, name: g.name,
                                            purity: g.purity, samples: g.n })),
    /* `kinds` ist das Alphabet der bekannten Tabelle und nur gegen sie prüfbar.
       `classes` ist, was die Nachbarschaftsprüfung wirklich braucht. */
    tiles: onGrid.map((t) => ({ key: key(t), pack: t.pack, base: t.base, path: t.path,
                                kinds: t.kinds, classes: t.classes })),
    edges: Object.fromEntries(onGrid.map((t) => [key(t), t.kinds])),
    classes: Object.fromEntries(onGrid.map((t) => [key(t), t.classes])),
    excluded: {
      offGrid: state.offGrid.map((t) => key(t)),
      noDeckSurface: state.noDeck.map((t) => key(t)),
    },
  };
  const known = onGrid.filter((t) => t.pack === 'hex' && TILE_EDGES[t.base]).length;
  $('#pane').innerHTML = `<h2>Abgeleitete Kantentabelle</h2>
    <p class="note ${pass ? 'ok' : 'bad'}">${pass
      ? `Eichung bestanden — für die ${known} Kacheln, die schon eine Tabelle hatten.`
      : 'Eichung NICHT bestanden. Diese Tabelle ist ein Zwischenstand, keine Quelle.'}</p>
    <p class="note ${f.full === f.total ? 'ok' : 'bad'}">Für das ungedeckte Builder-Pack:
      <b>${f.full} von ${f.total}</b> Kacheln vollständig klassifiziert${f.partial ? `, ${f.partial} teilweise` : ''}${f.none ? `, ${f.none} gar nicht` : ''}.
      Davon ${f.lettered} im Alphabet g/s/w — der Rest trägt eigene Klassen des Packs.
      ${f.full === f.total ? '' : 'Das ist der offene Teil von BT1, nicht das Ergebnis.'}</p>
    <button class="go sec" id="dl">edge-atlas.json sichern</button>
    <pre class="json">${JSON.stringify(out, null, 1).replace(/</g, '&lt;')}</pre>`;
  $('#dl').onclick = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' }));
    a.download = 'edge-atlas.json';
    a.click();
  };
}

/* ── Bildschirm 4 · Bauvorgaben ──────────────────────────────────────────────────────
   Die Anleitungsbilder des Herstellers, nachgebaut. Referenz links, Nachbau rechts, Befund
   darunter — wer sie nebeneinander sieht, braucht keine Prozentzahl.

   Der Bestand für die Fälle (Häuser, Bäume, Felsen, Türme) wird erst hier geladen: beim
   Start braucht ihn niemand, und 500 Teile eager wären ein Boot von einer Minute. */
/* Pfade RELATIV ZUM MODUL, nicht zum Dokument: diese Seite liegt zusätzlich als Spiegel
   auf Projektebene, damit sie im Dropdown auftaucht. Ein dokumentrelativer Pfad zeigt von
   dort ins Leere. */
const up = (p) => new URL(p, import.meta.url).href;
const REF = {
  padding: { img: up('../../uploads/grafik-c23434b1.png'), at: '6% 50%', zoom: '300%' },
  decorate: { img: up('../../uploads/grafik-c23434b1.png'), at: '50% 46%', zoom: '330%' },
  rocky: { img: up('../../uploads/grafik-c23434b1.png'), at: '90% 45%', zoom: '300%' },
  village: { img: up('../../uploads/grafik-0457f2a5.png'), at: '76% 55%', zoom: '250%' },
};
let stock = null;
const stages = new Map();

async function renderCases() {
  $('#pane').innerHTML = `<h2>Bauvorgaben des Herstellers</h2>
    <p class="note">KayKit legt dem Pack zwei Anleitungsbilder bei — drei benannte Regeln und zwei
    Inselkompositionen. Hier stehen sie nachgebaut neben der Vorlage. <b>Nachgebaut, nicht generiert:</b>
    jede Zelle steht einzeln da, weil sie dort stehen soll. Das ist die Bedingung aus
    <code>FAIL_ISLANDS.md</code>.</p>
    <div id="cases"></div>`;
  const host = $('#cases');
  for (const c of CASES) {
    const r = REF[c.id];
    host.insertAdjacentHTML('beforeend', `<div class="case" id="case-${c.id}">
      <div class="case-h"><b>${c.title}</b><span>${c.source}</span></div>
      <p class="rule">${c.rule}</p>
      <div class="case-b">
        <div class="ref" style="background-image:url('${r.img}');background-position:${r.at};background-size:${r.zoom}">
          <i>Vorlage</i></div>
        <div class="view"><canvas id="cv-${c.id}"></canvas>
        <div class="views" data-for="${c.id}">
          <button data-w="top">Draufsicht</button><button data-w="iso" class="on">Dreiviertel</button><button data-w="side">Seite</button>
        </div><i>Nachbau · ziehen zum Drehen</i></div>
      </div>
      <div class="findings" id="fi-${c.id}"><span class="wait">baut…</span></div>
    </div>`);
  }
  if (!stock) {
    $('#cases').insertAdjacentHTML('afterbegin', '<p class="note" id="stockmsg">Bestand für die Fälle wird geladen…</p>');
    stock = await loadStock((n, all) => { const e = $('#stockmsg'); if (e) e.textContent = `Bestand für die Fälle: ${n} / ${all}`; });
    $('#stockmsg')?.remove();
  }
  for (const c of CASES) {
    const findings = [];
    let group = null;
    try { group = await c.build(stock, state.metrics, findings); }
    catch (e) { findings.push({ ok: false, text: 'Baufehler: ' + e.message }); }
    const fi = $('#fi-' + c.id);
    fi.innerHTML = findings.length
      ? findings.map((f) => `<div class="f ${f.ok ? 'ok' : 'bad'}">${f.ok ? '✓' : '✗'} ${f.text}</div>`).join('')
      : '<div class="f ok">✓ ohne Befund</div>';
    if (group) {
      const cv = $('#cv-' + c.id);
      let st = stages.get(c.id);
      if (!st) { st = makeStage(cv); stages.set(c.id, st); } else st.attach(cv);
      st.show(group);
      /* G5: der Nachbau wird aus DREI benannten Winkeln gegen die Vorlage gestellt, nicht
         aus einem. Die Seitenansicht ist die, die Auflieger und Höhenstufen verrät. */
      document.querySelectorAll(`.views[data-for="${c.id}"] button`).forEach((b) => {
        b.onclick = () => {
          document.querySelectorAll(`.views[data-for="${c.id}"] button`).forEach((x) => x.classList.toggle('on', x === b));
          st.setView(b.dataset.w);
        };
      });
      fi.insertAdjacentHTML('beforeend', `<div class="f dim">${group.children.length} Teile gesetzt</div>`);
    }
  }
  /* Der erste Fall bekam einen Canvas ohne Höhe und rannte ins Leere: zum Zeitpunkt von
     `show()` stand das Layout noch nicht. Nach dem Bau einmal alle nachziehen. */
  requestAnimationFrame(() => stages.forEach((s) => { s.resize(); s.fit(); }));
}

/* ── Bildschirm 5 · Lehren ───────────────────────────────────────────────────────────
   Der Atlas soll die ausführliche Fassung des Embed-Moduls werden: nicht nur WAS gemessen
   wurde, sondern was dabei schiefging. Die teuerste Information in diesem Projekt sind die
   verworfenen Verfahren — sie stehen hier, damit sie niemand ein zweites Mal baut. */
const LESSONS = [
  { t: 'Nähe ist keine Zugehörigkeit', s: 'Kantenmessung, Fassung 1 und 2',
    p: ['Zwei Anläufe fragten »welche Dreiecke liegen NAHE der Fuge« — 60°-Tortenstück (75,3 %), dann ein Fenster um den Kantenmittelpunkt (89,4 %).',
        '`hex_water` kam als `w?w?w?` zurück. Getestet wurde der Schwerpunkt jedes Dreiecks, und das Pack baut Deckflächen aus vier großen Dreiecken — deren Schwerpunkte liegen in der Kachelmitte, an der Fuge liegt keiner.',
        'Fassung 3 fragt stattdessen: welche Fläche ÜBERDECKT diesen Punkt? Unabhängig von der Tesselierung. 99,5 %.'] },
  { t: 'Gegen die falsche Nachschlagetabelle gemessen ist nicht gemessen', s: 'Atlas-Sonde',
    p: ['`atlasProbe` nahm die erste Textur, die auftauchte, und maß beide Packs dagegen. `hex_forest` kam als `wwwwww` heraus — sechs Wasserkanten für eine sattgrüne Kachel.',
        'ACHTUNG, DIE ERSTE ERKLÄRUNG DAFÜR WAR AUCH FALSCH und stand in drei Dokumenten: »die beiden Packs haben verschiedene Atlanten«. Nachgemessen hat das Builder-Pack GAR KEINEN Atlas — es benutzt einfarbige Materialien ohne `map`. Seine Geometrie trägt aber UVs, und die Bedingung `if (uv && probe)` griff mit der global gesetzten Hexagon-Sonde, statt auf die Materialfarbe zurückzufallen.',
        'Eine Ursache, die plausibel klingt und nicht nachgemessen ist, ist eine Behauptung über den Bestand — Guardrail G2. Dass sie in dieselbe Richtung zeigte wie die richtige Ursache, hat sie drei Dokumente weit getragen.',
        'Und: wer eine Gesamtquote meldet, muss sagen, worüber sie läuft. Die 99,5 % waren korrekt und haben den Fehler verdeckt, weil sie nur Kacheln misst, die schon eine Tabelle hatten.'] },
  { t: 'Eine Zuordnung, die schon feststeht, darf man nicht schätzen', s: 'Farbgruppen',
    p: ['`lookup()` machte ein unbegrenztes Nächster-Nachbar über alle 32 Farbgruppen, ließ aber nur die 4 geeichten als Antwort zu. Eine Builder-Farbe rastete auf die am wenigsten weit entfernte der vier ein, egal wie fern.',
        'Dabei IST jede Sektorprobe Mitglied ihrer Gruppe — die Zuordnung stand seit dem Gruppieren fest und wurde weggeworfen. Es wird nicht mehr gesucht.'] },
  { t: 'Schwellen aus dem Kopf teilen keinen Bestand', s: 'übernommen aus dem Baukasten',
    p: ['Drei Runden lang kamen die Felsklassen-Grenzen aus meinem Kopf, dreimal waren sie kaputt (alles C · B übervoll · B leer, weil zwischen 0,5 und 1,11 nichts existiert).',
        'Jetzt sortiert `deriveRockClasses` die gemessenen Grundflächen und sucht die echten Lücken. Findet sie zwei Populationen, heißt das Ergebnis »zwei Populationen« — und die dritte Regel wird als INAKTIV gemeldet.',
        'Dieselbe Lehre trägt die Verschmelzungsgrenze der Farbgruppen: Median-Nachbarabstand × 2,6, nicht eine Zahl.'] },
  { t: 'Die plausiblere Hypothese war die falsche', s: 'Geometrie gegen Farbe',
    p: ['Gebaut wurde mit der Annahme, Wasser sei geometrisch erkennbar: eine eigene Fläche unter der Deckhöhe.',
        'Beide Regeln liefen durch dieselbe Eichung. Geometrie 94,3 %, Farbe 99,5 %. Regel A lag bei genau einer Sorte daneben — Uferkacheln, wo `sssggg` als `wwwggg` zurückkam: ein Strand fällt zum Wasser hin ab.',
        'Statt eine vierte Schwelle zu erfinden, hat die Messung entschieden. Wer zwei Regeln hat, soll beide fahren und beide Quoten zeigen.'] },
  { t: 'Ein Alphabet, das ein Pack nicht kennt, darf es nicht benennen', s: 'zwei Ausgaben',
    p: ['Das Builder-Pack bringt eigene Geländesorten mit. Das Hexagon-Alphabet (g/s/w) kann sie per Konstruktion nicht benennen.',
        '`kinds` bleibt das Alphabet der bekannten Tabelle — nur damit ist gegen `TILE_EDGES` prüfbar. `classes` trägt für Unbekanntes die Gruppen-ID (`#3`).',
        '»Passt A an B« heißt ohnehin nur »gleiche Klasse beiderseits der Fuge«. Das beantwortet eine ID genauso gut, und sie lügt nicht.'] },
  { t: 'Zwei Packs, zwei Namensräume', s: 'Export-Schlüssel',
    p: ['`hex_water` gibt es in beiden Packs. Nach Basename geschlüsselt überschrieb einer den anderen stillschweigend, und die Eichung zählte beide (33 geprüfte Kacheln, wo die Tabelle 32 Einträge hat).',
        'Der Brief sagt es wörtlich: die Packfamilien dürfen nebeneinander stehen, aber ihre Maße und Anschlüsse werden nicht stillschweigend gleichgesetzt.',
        'Schlüssel `pack|base`, jeder Eintrag mit Pack und Pfad. Auch im Kontaktbogen — das ist die Ansicht, an der ein Mensch prüft.'] },
  { t: 'Die Drehung ist der Fehler, den keine Quote sieht', s: 'aus hex-grid.js, hier befolgt',
    p: ['»Straße 22/22 gelöst« leuchtete monatelang grün, während jede Kurve spiegelverkehrt lag: der Löser prüft, ob eine Wunschmaske erfüllbar ist — nicht, ob die gesetzte Kachel zum Nachbarn passt.',
        '`rotDeg(n) = (6−n)·60`, nicht `n·60`: eine Drehung um +θ bildet ein Merkmal bei Winkel a auf a−θ ab. Mit `n·60` stimmt nur n=0 und n=3 — deshalb sahen gerade Straßen richtig aus und jede Kurve nicht.',
        'Im Babel-Generator stand `Math.floor(rand()*6)*60`. Das ist keine Näherung, das ist keine Drehung.'] },
  { t: 'Die Familie entscheidet vor dem Maß — zum zweiten Mal', s: 'Bauvorgabe Padding',
    p: ['Der Fall »padding« suchte Teilsechsecke über die Form: Sechseckverhältnis bei kleinerem Grundriss. Er meldete 36 Treffer — `building_barracks_red`, `building_church_green`, `building_barracks_blue`.',
        'Im Hexagon-Pack sitzt JEDES Gebäude auf einem Hex-Sockel, damit es auf eine Kachel passt. Ein reiner Formfilter hält sie deshalb für Teilsechsecke. `kit.js` protokolliert genau das als »acht Burgen als Fußboden« — und ich habe es wiederholt, obwohl die Lehre im selben Dokument steht.',
        'Eine Lehre aufzuschreiben schützt nicht davor, sie zu brechen. Der Filter fragt jetzt zuerst nach der Familie.'] },
  { t: 'Ein Fluss ohne Mündung ist kein Packmangel', s: 'Bauvorgabe Dorfinsel',
    p: ['Der Löser meldete »keine river-Kachel für Maske 000001« — eine einzelne Kante. Der erste Reflex ist, das Pack für unvollständig zu halten.',
        '`hex-grid.js` sagt es aber ausdrücklich: die Flussfamilie hat 12 Muster und KEINE Quellkachel. Ein Fluss beginnt und endet am Wasser oder am Kartenrand, nie im Feld. Mein Lauf endete im Feld.',
        'Der Fehler lag im Entwurf, nicht im Bestand. Mit Mündungen an beiden Enden: 48 Fugen geprüft, 0 Fehlstellen.'] },
  { t: 'Eine fehlende Zahl ist kein leeres Bild, sondern ein stilles NaN', s: 'Terrassenstufe',
    p: ['Der Padding-Fall blieb schwarz, während sein Bericht »32 Teile gesetzt« meldete — die schlechteste Kombination, die eine Prüfung liefern kann.',
        '`hexMetrics()` gibt W, H, colStep, rowStep, inradius, circumradius — aber kein `step`. Der einzige Fall, der Höhenstufen baut, rechnete `level * undefined`. Die Gruppe hatte 32 Kinder, alle auf NaN.',
        'Die Stufe ist jetzt gemessen (Körperhöhe der Referenzkachel). Und: eine Zahl, die aus einer fremden Funktion kommt, wird geprüft, bevor man mit ihr multipliziert.'] },
  { t: 'Der älteste WebGL-Kontext stirbt zuerst', s: 'Betrachter',
    p: ['Vier Fälle bekamen je einen eigenen `WebGLRenderer`, dazu der des Kontaktbogens. Der Browser opfert bei Bedarf den ältesten — also den des ersten Falls.',
        'Ein Renderer, ein Besitzer (Projektregel 5) ist hier keine Stilfrage: ein einziger Kontext rendert reihum in ein Offscreen-Canvas, jedes Fall-Canvas bekommt das Bild per `drawImage`.'] },
  { t: 'Eine Vorlage aus einem Pack verlangt einen Nachbau aus demselben Pack', s: 'Bauvorgaben',
    p: ['Die Anleitungsbilder zeigen das Hexagon-Pack. Der erste Nachbau griff in den gemischten Bestand: türkiser Builder-Wald neben sandfarbenen Hügeln, wo die Vorlage grünen Wald und grauen Fels zeigt.',
        'Der Brief verbietet das stillschweigende Gleichsetzen der Packfamilien nicht nur in Tabellen — auch im Bild.'] },
  { t: 'Ein Namensmuster aus dem Kopf kennt den Bestand nicht — dritter Fall', s: 'Feldkachel',
    p: ['Die Dorfinsel suchte ihre Felder mit `/^hex_(farm|field|wheat|crops)/` und meldete: das Pack hat kein Feld. Vier Zellen der Vorlage blieben Wiese, und der Bericht behauptete einen Packmangel.',
        'Das Pack hat eins: `building_grain`, 1,87 × 2,09 × 0,39. Kachelgroß und flach — also kein Kachelkörper, sondern eine Bodendecke, die AUF eine Graskachel kommt. Abgelegt unter `building_*`, aus demselben Grund, aus dem `assignRole` jedes Gebäude als `landmark` führt: die Ordnung des Packs kennt keine Kategorie »Auflieger«.',
        'Derselbe Fehler wie Lehre 04 und 09, ein drittes Mal. Wer nach einem Namen sucht, den er sich ausgedacht hat, findet nur, was zufällig so heißt — und hält den Rest für nicht vorhanden. Suchen heißt: den Bestand nach Maß und Form fragen, nicht nach Vokabeln.'] },
  { t: 'Prüfen heißt hinsehen', s: 'Projektregel 7',
    p: ['Zwei Fehlschläge an einem Tag wurden im Bild gefunden und von keiner Messung: die Treppe und die Inselkomposition.',
        'Der Kontaktbogen dieses Atlas hat den Forest-Fehler gezeigt, bevor eine Zahl ihn zeigte — die Kachel war grün, der Ring blau.',
        'Deshalb: vor jeder weiteren Teile- oder Szenenkonstruktion ein Blick in Arbeitsgröße, isoliert, plus Seitenansicht. Und kein Whack-a-Mole: stimmt das Bild nicht, wird die Grundlage geprüft, nicht das Pixel korrigiert.'] },
];

function renderLessons() {
  $('#pane').innerHTML = `<h2>Lehren</h2>
    <p class="note">Die teuerste Information in diesem Projekt sind die verworfenen Verfahren. Sie stehen
    hier, damit sie niemand ein zweites Mal baut — dieser Atlas ist die ausführliche Fassung, auf die ein
    knappes Embed-Modul verweisen kann.</p>
    ${LESSONS.map((l, i) => `<div class="lesson">
      <div class="lh"><b>${String(i + 1).padStart(2, '0')} · ${l.t}</b><span>${l.s}</span></div>
      ${l.p.map((p) => `<p>${p}</p>`).join('')}
    </div>`).join('')}`;
}

/* ── Bildschirm · Teile ──────────────────────────────────────────────────────────────
   DER BLICK, DER GEFEHLT HAT. Der Kontaktbogen zeigt 176 Kacheln; die rund 270 Natur-,
   Prop- und Gebäudeteile wurden nie angesehen und trotzdem verbaut — mit Namensmustern aus
   dem Kopf (`/^tree_/`, `/^hex_(farm|field)/`). Vier Fehlgriffe kamen daher: ein Zaun in der
   Streu, »kein Teilsechseck« neben einer Vorlage, die es zeigt, `building_grain` übersehen.

   Hier liegt jedes Teil des Bestands als Bild, mit Familie und gemessenen Maßen. Was man
   gesehen hat, sucht man nicht mehr per Vokabel. */
async function renderStock() {
  $('#pane').innerHTML = '<h2>Teile</h2><p class="note" id="stockmsg">Bestand wird geladen…</p><div id="grid"></div>';
  if (!stock) stock = await loadStock((n, all) => { const e = $('#stockmsg'); if (e) e.textContent = `Bestand: ${n} / ${all}`; });
  const fams = [...new Set(stock.parts.map((r) => r.family || '—'))].sort();
  const q = (window.__stockQ || '').toLowerCase();
  $('#pane').innerHTML = `<h2>Teile · ${stock.parts.length}</h2>
    <div class="bar">
      <input id="sfind" type="text" placeholder="filtern (Name, Familie, Pack)…" value="${q}">
      <span class="note">${fams.length} Familien</span>
    </div>
    <div class="fams">${fams.map((f) => `<button class="famb" data-f="${f}">${f}</button>`).join('')}</div>
    <div id="grid"></div>`;
  const list = stock.parts.filter((r) => !q || r.base.toLowerCase().includes(q)
    || (r.family || '').toLowerCase().includes(q) || r.pack.toLowerCase().includes(q));
  const grid = $('#grid');
  for (const r of list.slice(0, 300)) {
    const card = document.createElement('div');
    card.className = 'cardi';
    const cv = document.createElement('canvas');
    card.appendChild(cv);
    card.insertAdjacentHTML('beforeend', `<div class="cap"><b>${r.base}</b><em class="pk">${r.pack} · ${r.family || '—'}</em>`
      + `${r.size[0]} × ${r.size[2]} × ${r.size[1]}</div>`);
    grid.appendChild(card);
    await partThumb(r, cv);
  }
  const set = (v) => { window.__stockQ = v; renderStock(); };
  $('#sfind').oninput = (e) => { clearTimeout(window.__sT); window.__sT = setTimeout(() => set(e.target.value), 350); };
  document.querySelectorAll('.famb').forEach((b) => { b.onclick = () => set(b.dataset.f); });
}

/* Dreiviertelansicht statt Draufsicht: bei einem Baum, einem Zaun oder einem Haus sagt die
   Silhouette mehr als der Grundriss. Derselbe Renderer wie der Kontaktbogen. */
async function partThumb(rec, canvas) {
  const { renderer, scene, cam, S } = shooter();
  let node;
  try { node = await instance(rec); } catch (e) { return; }
  const box = new THREE.Box3().setFromObject(node);
  const c = box.getCenter(new THREE.Vector3());
  const rad = Math.max(...box.getSize(new THREE.Vector3()).toArray()) * 0.62 || 1;
  const ortho = new THREE.OrthographicCamera(-rad, rad, rad, -rad, 0.1, 100);
  ortho.position.set(c.x + rad * 2, c.y + rad * 1.7, c.z + rad * 2.2);
  ortho.lookAt(c);
  scene.add(node);
  renderer.render(scene, ortho);
  scene.remove(node);
  canvas.width = S; canvas.height = S;
  canvas.getContext('2d').drawImage(renderer.domElement, 0, 0);
}

function bindTabs() {
  const views = { calib: renderCalib, sheet: renderSheet, stock: renderStock, table: renderTable,
                  cases: renderCases, lessons: renderLessons };
  for (const b of document.querySelectorAll('#tabs button')) {
    b.onclick = () => {
      document.querySelectorAll('#tabs button').forEach((x) => x.classList.toggle('on', x === b));
      views[b.dataset.v]();
    };
  }
}

boot().catch((e) => { say('ABBRUCH', e.message); console.error(e); });
