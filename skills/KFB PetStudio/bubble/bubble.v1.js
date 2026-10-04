/* bubble.v1.js — die KFB-Sprechblase, herausgezogen aus „KFB Pet Studio v4" (§Blase, 2026-07-30).

   PORTIERT, NICHT NEU ERFUNDEN. Die erste Podcast-Fassung war eine CSS-Box mit einem gedrehten
   Quadrat als Zipfel — falsch gebaut (Befund Georg). Die richtige Blase ist ein EINZIGER
   geschlossener SVG-Zug mit Linien-Jitter, exakten Ecken und einem getaperten PFEIL, der in die
   dem Pet naechste Kante hineinwaechst. Das sind die gemessenen Eigenschaften aus v4:

     - Anker = geglaettetes Pet-ZENTRUM (nicht die Bbox-Oberkante: die liegt bei naher Kamera
       ausserhalb des Bildes, dann zeigt der Pfeil in den Header).
     - EINE Totzone (`dead` 44 px): innerhalb steht der Anker STILL -> Idle-Drift 0,00 px.
     - Tempo-Deckel 18 px/Frame -> 286 px Weg in 0,22 s, kein Sprung.
     - Pfeil: Fuss 18 px, Schultern bei 55 % der Laenge, Laenge 14 … `arrow`. Der Fuss bleibt im
       mittleren Band der Kante (32…68 %), damit er nicht an die Ecke rutscht.
     - „Luftballon an kurzer Schnur": die Spitze ZIELT auf das Zentrum, sie reicht nicht quer
       durchs Bild.

   NEU hier (und nur das): mehrere Blasen gleichzeitig, jede mit eigenem Anker. Darum ist der
   Zustand pro Instanz gekapselt statt am Host zu haengen. */

const INK = '#1f1a14';

function mul(a) {
  return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** Der Zug der Blase, als reine Funktion. HERAUSGEZOGEN 2026-08-24 (additiv, gleiche Mathematik):
 *  die 2D-Comic-Buehne (`comic-v1/`) braucht denselben Blasen-Zug, aber ohne three.js-Kamera und
 *  ohne Pet-Anker. Wer die Form braucht, importiert sie hier — er schreibt keine zweite
 *  Jitter-Schleife. `o = { hx, hy, arrow }`: hx/hy = Zielpunkt IM Blasen-Koordinatensystem,
 *  `arrow` = maximale Zipfellaenge. */
export function bubbleRectPath(M, w, hh, seed, o = {}) {
  const hx = o.hx == null ? null : o.hx, hy = o.hy == null ? null : o.hy;
  const arrowMax = o.arrow == null ? 34 : o.arrow;
  const rng = mul(seed), j = () => (rng() * 2 - 1) * 1.3;
  const x0 = M, y0 = M, x1 = M + w, y1 = M + hh, cx = M + w / 2, cy = M + hh / 2;
  const dx = (hx == null ? 0 : hx - cx), dy = (hy == null ? 1 : hy - cy);
  let edge;
  if (Math.abs(dy) >= Math.abs(dx)) edge = dy >= 0 ? 0 : 1; else edge = dx >= 0 ? 2 : 3;
  const E = [{ a: [x0, y0], b: [x1, y0], n: [0, -1], id: 1 }, { a: [x1, y0], b: [x1, y1], n: [1, 0], id: 2 },
             { a: [x1, y1], b: [x0, y1], n: [0, 1], id: 0 }, { a: [x0, y1], b: [x0, y0], n: [-1, 0], id: 3 }];
  const foot = 18, hlen = Math.hypot(dx, dy) || 1, aMin = 14, aMax = arrowMax;
  const tailLen = Math.max(aMin, Math.min(aMax, hlen - 8));
  const pts = [];
  for (const e of E) {
    pts.push([e.a[0], e.a[1]]);
    const len = Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1]);
    const ux = (e.b[0] - e.a[0]) / len, uy = (e.b[1] - e.a[1]) / len;
    const K = 4, mids = [];
    for (let k = 1; k < K; k++) { const ss = len * k / K; mids.push({ s: ss, x: e.a[0] + ux * ss + e.n[0] * j(), y: e.a[1] + uy * ss + e.n[1] * j() }); }
    if (e.id === edge) {
      let ha = (hx == null) ? len / 2 : (hx - e.a[0]) * ux + (hy - e.a[1]) * uy;
      ha = Math.max(len * 0.32, Math.min(len * 0.68, ha));
      const fcx = e.a[0] + ux * ha, fcy = e.a[1] + uy * ha;
      let tx, ty;
      if (hx != null && hy != null) {
        const vx = hx - fcx, vy = hy - fcy, tl = Math.hypot(vx, vy) || 1, use = Math.max(aMin, Math.min(aMax, tl));
        tx = fcx + vx / tl * use; ty = fcy + vy / tl * use;
      } else { tx = fcx + dx / hlen * tailLen; ty = fcy + dy / hlen * tailLen; }
      const fx = e.a[0] + ux * (ha - foot / 2), fy = e.a[1] + uy * (ha - foot / 2);
      const gx = e.a[0] + ux * (ha + foot / 2), gy = e.a[1] + uy * (ha + foot / 2);
      const shx = fcx + (tx - fcx) * 0.55, shy = fcy + (ty - fcy) * 0.55;
      const s1x = shx + (fx - fcx) * 0.34, s1y = shy + (fy - fcy) * 0.34;
      const s2x = shx + (gx - fcx) * 0.34, s2y = shy + (gy - fcy) * 0.34;
      for (const m of mids) if (m.s < ha - foot / 2) pts.push([m.x, m.y]);
      pts.push([fx, fy], [s1x, s1y], [tx, ty], [s2x, s2y], [gx, gy]);
      for (const m of mids) if (m.s > ha + foot / 2) pts.push([m.x, m.y]);
    } else { for (const m of mids) pts.push([m.x, m.y]); }
  }
  let d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
  for (let p = 1; p < pts.length; p++) d += ' L' + pts[p][0].toFixed(1) + ' ' + pts[p][1].toFixed(1);
  return d + ' Z';
}

/** Die Gedanken-Blase als reine Funktion (siehe `bubbleRectPath`). */
export function bubbleBlobPath(M, w, hh, seed) {
  const rng = mul(seed);
  const cx = M + w / 2, cy = M + hh / 2, rx = w * 0.60 + 12, ry = hh * 0.64 + 12;
  const N = 11 + Math.floor(rng() * 3), step = Math.PI * 2 / N;
  const pts = []; const a0 = -Math.PI / 2 + (rng() * 2 - 1) * 0.15;
  for (let i = 0; i < N; i++) {
    const a = a0 + i * step + (rng() * 2 - 1) * step * 0.28, rr = 1 + (rng() * 2 - 1) * 0.07;
    pts.push([cx + Math.cos(a) * rx * rr, cy + Math.sin(a) * ry * rr]);
  }
  let d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
  for (let i = 0; i < N; i++) {
    const p1 = pts[(i + 1) % N], ch = Math.hypot(p1[0] - pts[i][0], p1[1] - pts[i][1]), r = (ch / 2 * 1.02).toFixed(1);
    d += ' A' + r + ' ' + r + ' 0 0 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1);
  }
  return d + ' Z';
}

export function createBubble(o = {}) {
  const THREE = o.THREE, cam = o.camera, canvas = o.canvas, host = o.host;
  const P = Object.assign({
    gap: 46, pad: 11, line: 2.4, tint: 0.42, font: 16, arrow: 34, dead: 44, lazy: 0.10,
    maxW: 320, accent: '#b8361f', label: '',
    // Farbcodierung statt Namensschild: das Papier traegt einen HAUCH der Pet-Farbe. Wer spricht,
    // steht im Bild direkt unter der Blase — der Name daneben war doppelt gemoppelt.
    tintHex: null, tintMix: 0.17,
    // Georgs Entscheidung 17.8.: die Blase STEHT, nur der Pfeil zielt. Fliegender Text wird nicht
    // gelesen. Die Schnur ist kurz (`arrow`) — ist das Pet weit weg, zeigt der Pfeil nur noch die
    // Richtung, er spannt sich nicht quer durchs Bild.
    pinned: true,
  }, o.params || {});

  let target = o.target || null;
  // `home` = die RUHELAGE des Pets (der Sitz). Der Standplatz der Blase haengt daran, nicht am
  // fliegenden Koerper: sonst reisst jedes `set()` mitten im Flug den Platz neu (Verifier 17.8. —
  // die Blase sprang 122 x 136 px, weil `_yelp` zweimal mit open:true neu setzt).
  let home = o.home || null;
  let type = 'speech', text = '', shown = null, open = false;
  let an = null, bw = 120, bh = 80, bM = 34, hx = null, hy = null, pin = null;

  const el = document.createElement('div');
  el.style.cssText = 'position:absolute;z-index:18;pointer-events:none;filter:drop-shadow(3px 4px 0 rgba(31,26,20,.28));';
  host.appendChild(el);

  const paperOf = () => {
    const base = [250 - P.tint * 6, 244 - P.tint * 22, 230 - P.tint * 62];
    if (!P.tintHex) return 'rgb(' + base.map(Math.round).join(',') + ')';
    const h = String(P.tintHex).replace('#', '');
    const c = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    const k = Math.max(0, Math.min(1, P.tintMix));
    return 'rgb(' + base.map((b, i) => Math.round(b * (1 - k) + c[i] * k)).join(',') + ')';
  };
  const plain = () => String(shown == null ? text : shown);

  // --- Anker ------------------------------------------------------------------------------------
  function points() {
    if ((!target && !home) || !cam || !canvas) return null;
    const cr = host.getBoundingClientRect(), r = canvas.getBoundingClientRect();
    const toStage = (wp) => {
      const v = wp.clone().project(cam);
      return { x: r.left - cr.left + (v.x * 0.5 + 0.5) * r.width, y: r.top - cr.top + (-v.y * 0.5 + 0.5) * r.height, behind: v.z > 1 };
    };
    /* Ohne Koerper zaehlt der SITZ (Befund Verifier 17.8.: die Blase blieb display:none und eine
       gedrosselte Sendung war damit unsichtbar). Der Sitz ist ohnehin die Ruhelage der Blase, er
       kann also auch ihr Anker sein, solange das Modell noch nicht da ist. Kopf = `home().top`. */
    let mid = null, topY = null;
    if (target) {
      const box = new THREE.Box3().setFromObject(target);
      if (isFinite(box.max.y)) {
        mid = new THREE.Vector3((box.min.x + box.max.x) / 2, (box.min.y + box.max.y) / 2, (box.min.z + box.max.z) / 2);
        topY = box.max.y + 0.05;
      }
    }
    const hv = home ? home() : null;
    if (!mid) {
      if (!hv) return null;
      mid = new THREE.Vector3(hv.x, hv.y, hv.z);
      topY = hv.top != null ? hv.top : hv.y;
    }
    const c = toStage(mid), t = toStage(new THREE.Vector3(mid.x, topY, mid.z));
    // Standplatz aus der RUHELAGE, jeden Frame frisch projiziert — damit er auch eine
    // Fenstergroessen-Aenderung ueberlebt, statt auf einem alten Pixelwert festzuhaengen.
    let seat = null;
    if (hv) {
      const sc = toStage(new THREE.Vector3(hv.x, hv.y, hv.z));
      const stp = toStage(new THREE.Vector3(hv.x, hv.top != null ? hv.top : hv.y, hv.z));
      seat = { x: sc.x, y: sc.y, dTop: Math.min(0, stp.y - sc.y) };
    }
    return { cx: c.x, cy: c.y, topY: t.y, behind: c.behind, cr, seat, span: c.y - t.y };
  }

  function anchorTick(pt) {
    const cr = pt.cr;
    const rx = Math.max(8, Math.min(cr.width - 8, pt.cx));
    const ry = Math.max(56, Math.min(cr.height - 56, pt.cy));
    if (!an) an = { x: rx, y: ry, vx: 0, vy: 0 };
    const d = Math.hypot(rx - an.x, ry - an.y);
    if (d > P.dead) {
      const k = Math.min(1, (d - P.dead) / P.dead);
      an.vx = (an.vx + (rx - an.x) * P.lazy * k) * 0.80;
      an.vy = (an.vy + (ry - an.y) * P.lazy * k) * 0.80;
      const sp = Math.hypot(an.vx, an.vy), cap = 18;
      if (sp > cap) { an.vx = an.vx / sp * cap; an.vy = an.vy / sp * cap; }
      an.x += an.vx; an.y += an.vy;
    } else { an.vx *= 0.86; an.vy *= 0.86; an.x += an.vx; an.y += an.vy; }
    return an;
  }

  // --- Form -------------------------------------------------------------------------------------
  // Duenne Huellen um die herausgezogenen Zuege — gleiche Mathematik, ein Eigentuemer.
  function rectPath(M, w, hh, seed) {
    return bubbleRectPath(M, w, hh, seed, { hx, hy, arrow: P.arrow });
  }

  function blobPath(M, w, hh, seed) {
    return bubbleBlobPath(M, w, hh, seed);
  }

  function thinkTail(g, M, w, hh, paper) {
    if (!g) return;
    const cx = M + w / 2, cy = M + hh / 2;
    let dx = (hx == null ? 0 : hx - cx), dy = (hy == null ? 1 : hy - cy);
    const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
    const ex = cx + dx * (w / 2 + 4), ey = cy + dy * (hh / 2 + 4);
    const c = (off, r) => "<circle cx='" + (ex + dx * off).toFixed(1) + "' cy='" + (ey + dy * off).toFixed(1) + "' r='" + r + "' fill='" + paper + "' stroke='" + INK + "' stroke-width='" + P.line + "'/>";
    g.innerHTML = c(9, 4.5) + c(20, 3);
  }

  function draw() {
    const t = plain();
    const font = P.font, pad = P.pad;
    const w = Math.max(Math.round(Math.min(P.maxW, Math.max(90, text.length * font * 0.44)) + pad * 2), Math.round(font * 2.4 + pad * 2));
    const cpl = Math.max(6, (w - pad * 2) / (font * 0.52));
    const lines = Math.max(1, Math.ceil(Math.max(text.length, 1) / cpl));
    const lh = 1.34, padV = Math.max(4, Math.round(pad - (lh - 1) / 2 * font));
    const labelH = P.label ? Math.round(font * 0.86) + 4 : 0;
    let hh = Math.round(lines * font * lh + padV * 2 + labelH);
    hh = Math.max(hh, Math.round(font * 2.2 + pad * 2));
    const M = 34; bw = w; bh = hh; bM = M;
    const paper = paperOf();
    el.style.width = (w + 2 * M) + 'px';
    el.innerHTML =
      "<svg width='" + (w + 2 * M) + "' height='" + (hh + 2 * M) + "' style='position:absolute;left:0;top:0;overflow:visible;'>"
      + "<g class='kb-think'></g><path class='kb-out' fill='" + paper + "' stroke='" + INK + "' stroke-linejoin='round' stroke-linecap='round'></path></svg>"
      + "<div style='position:absolute;left:" + M + "px;top:" + M + "px;width:" + w + "px;height:" + hh + "px;box-sizing:border-box;"
      + "padding:" + padV + "px " + pad + "px;display:flex;flex-direction:column;justify-content:center;gap:2px;"
      + "font-family:\"Shantell Sans\",cursive;font-size:" + font + "px;line-height:" + lh + ";color:" + INK + ";word-break:break-word;text-wrap:pretty;'>"
      + (P.label ? "<div style='font-family:\"Irish Grover\",cursive;font-size:" + Math.round(font * 0.68) + "px;letter-spacing:.06em;color:" + P.accent + ";'>" + esc(P.label) + "</div>" : '')
      + "<div class='kb-txt'>" + esc(t) + "</div></div>";
    shape();
  }

  function shape() {
    const path = el.querySelector('.kb-out'); if (!path) return;
    const paper = paperOf(), seed = (bw * 131 + bh * 17 + type.length * 7) % 9999;
    path.setAttribute('fill', paper);
    path.setAttribute('stroke-width', P.line);
    path.setAttribute('stroke-dasharray', type === 'whisper' ? '7 5' : 'none');
    const think = el.querySelector('.kb-think'); if (think) think.innerHTML = '';
    if (type === 'thought') { path.setAttribute('d', blobPath(bM, bw, bh, seed)); thinkTail(think, bM, bw, bh, paper); return; }
    path.setAttribute('d', rectPath(bM, bw, bh, seed));
  }

  return {
    el,
    get open() { return open; },
    setTarget(t) { target = t; },
    setHome(fn) { home = typeof fn === 'function' ? fn : null; },
    /** Text setzen (baut die Blase neu — Groesse haengt am VOLLEN Text, damit sie beim
        Enthuellen nicht waechst und der Leser nicht springt). */
    set(o2 = {}) {
      if (o2.text != null) { text = String(o2.text); shown = o2.reveal === false ? null : ''; }
      if (o2.type) type = o2.type;
      if (o2.label != null) P.label = o2.label;
      if (o2.accent) P.accent = o2.accent;
      if (o2.open != null) open = !!o2.open;    // Text tauschen darf NIE neu anpinnen
      draw();
      return this;
    },
    /** Enthuellung waehrend die Stimme laeuft — patcht NUR den Textknoten, kein Neubau. */
    reveal(part) {
      shown = part;
      const sp = el.querySelector('.kb-txt');
      if (sp) sp.textContent = String(part == null ? text : part);
    },
    show(on) { open = !!on; if (!on) el.style.display = 'none'; return this; },
    /** Pro Frame. Bewegt die Blase, friert die Kopf-Richtung ein und zeichnet den Zug neu. */
    tick() {
      if (!open) { el.style.display = 'none'; return; }
      const pt = points();
      if (!pt || pt.behind) { el.style.display = 'none'; return; }
      const a = anchorTick(pt);
      el.style.display = 'block';
      const dTop = Math.min(0, pt.topY - pt.cy);
      // Standplatz: die projizierte Ruhelage. Faellt sie aus (kein `home` mitgegeben), der
      // einmalig gemerkte Punkt. Der lebende Anker `a` dreht nur den Pfeil.
      if (P.pinned && pt.seat) pin = { x: pt.seat.x, y: pt.seat.y + pt.seat.dTop };
      else if (!pin || !P.pinned) pin = { x: a.x, y: a.y + dTop };
      const base = P.pinned ? pin : { x: a.x, y: a.y + dTop };
      let tx = base.x - bM - bw / 2, ty = base.y - P.gap - bh - bM;
      const cr = pt.cr;
      tx = Math.max(6 - bM, Math.min(cr.width - bw - bM - 6, tx));
      ty = Math.max(54 - bM, Math.min(cr.height - bh - bM - 96, ty));
      el.style.left = tx + 'px'; el.style.top = ty + 'px';
      const nhx = a.x - tx, nhy = a.y - ty;
      if (hx == null || Math.abs(nhx - hx) > 0.5 || Math.abs(nhy - hy) > 0.5) { hx = nhx; hy = nhy; shape(); }
    },
    dispose() { el.remove(); },
    params: P,
  };
}
