/**
 * kfb-combat-atlas.js — DER TUSCHE-ATLAS ALS GEMEINSAME QUELLE (v2.1.0)
 *
 * v2.1.0 (T1, 03.09.2026): NUR eine Meldezeile im PNG-Hook. Die Zeichnung ist ab jetzt der
 * RÜCKFALL — das ausgelieferte Blatt liegt in `assets/vfx/kfb-combat-atlas_4x3.png`
 * (10 Brackeys-Masken + card/stamp gezeichnet, INDEX.json daneben), gesetzt über
 * `window.KFB_VFX_ATLAS_URL` in v8 und v9/v10.
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * KORREKTUR GEGENÜBER v1.0.0 (Verifier-Fund, 03.09.2026)
 * v1 hat zwölf Formen NEU ERFUNDEN — ich hatte sie selbst geschrieben, um Kontext
 * zu sparen, statt v8s Zeichnung zu heben. Die Kachel-Reihenfolge stimmte, die
 * FORMEN nicht. Damit hätte Georg im Schussstand Sprites getunt, die im Spiel nicht
 * existieren — und das widerlegt genau die Begründung, mit der der Schussstand
 * gegen das weiße Labor gewonnen hat: „was du tunst, ist was ausgeliefert wird".
 * Zwei Atlanten für einen Vertrag sind zwei Wahrheiten.
 *
 * Diese Fassung ist die WÖRTLICHE Zeichnung aus `KFB Mech Slice v8._buildAtlas()`,
 * nur die Naht ist umgestellt: statt `this._atlasTex` zu setzen, gibt sie zurück.
 * Wer eine Kachel ändert, ändert sie für beide Stände.
 *
 * Zwölf weisse Alpha-Formen in einem 4×3-Bogen. Farbe kommt zur Laufzeit: EINE
 * Form × n Farben sind n Effekte bei EINER Textur.
 * Reihenfolge = UV-Index und damit Vertrag (siehe `ATLAS` in kfb-combat-def.js):
 *   burst star puff spark | splat ring streak shard | tongue card stamp smoke
 *
 * Der Strich kommt aus `kfb-ink.js` (Tusche-SSOT). Fehlt es, bleibt die Form und
 * nur die Kante ist glatt — das Rückgabefeld `inked` sagt, was passiert ist, damit
 * „keine Tusche" nicht wie Absicht aussieht.
 */

export function describe() {
  return { id: 'kfb-combat-atlas', version: '2.2.0', needs: ['THREE', 'kfb-ink?'], provides: ['atlas-texture'] };
}

const CELLS = ['burst', 'star', 'puff', 'spark', 'splat', 'ring', 'streak', 'shard', 'tongue', 'card', 'stamp', 'smoke', 'muzzle', 'scorch', 'fire', 'dot', 'arc', 'plasma'];
const COLS = 4, ROWS = Math.ceil(CELLS.length / COLS);   // 4×5 seit T6b; die Zeichnung unten füllt nur 0–11 (Rückfall)

/** UV-Fenster einer Kachel: { ox, oy, w, h } für map.offset / map.repeat. */
export function cellUV(name) {
  const i = Math.max(0, CELLS.indexOf(name));
  const cx = i % COLS, cy = Math.floor(i / COLS);
  // Canvas-Zeile 0 liegt OBEN, UV-Zeile 0 unten — deshalb gespiegelt
  return { ox: cx / COLS, oy: (ROWS - 1 - cy) / ROWS, w: 1 / COLS, h: 1 / ROWS };
}

/**
 * @param {object} THREE
 * @param {object} [ink] Modul kfb-ink.js; fehlt es, wird `window.KFBInk` versucht
 * @param {number} [size] Kantenlänge einer Kachel (v8 nutzt 256 — nicht ohne Grund ändern)
 * @param {function} [onPNG] Rückruf, wenn `window.KFB_VFX_ATLAS_URL` ein Blatt nachlädt
 * @returns {{texture, cols, rows, cells, canvas, inked}}
 */
export function buildAtlas(THREE, ink, size, onPNG) {
  const S = size || 256, cv = document.createElement('canvas');
  cv.width = S * COLS; cv.height = S * ROWS;
  const c = cv.getContext('2d');
  const Ink = ink || (typeof window !== 'undefined' ? window.KFBInk : null);
    const rnd = Ink ? Ink.mulberry(4711) : (() => { let a = 4711; return () => { a = (a * 1103515245 + 12345) & 0x7fffffff; return a / 0x7fffffff; }; })();
    const at = (i) => [(i % 4) * S + S / 2, Math.floor(i / 4) * S + S / 2];
    const ring = (cx, cy, r, jit, n) => {
      const pts = [];
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, rr = r * (1 - jit / 2 + rnd() * jit); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
      return pts;
    };
    const poly = (pts, style) => {
      c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
      c.closePath(); c.fillStyle = style; c.fill();
    };
    const soft = (cx, cy, r, a) => {
      const g = c.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(255,255,255,' + a + ')'); g.addColorStop(0.55, 'rgba(255,255,255,' + (a * 0.6).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g; c.beginPath(); c.arc(cx, cy, r, 0, 6.2832); c.fill();
    };
    const rays = (cx, cy, n, r0, r1, w, alpha) => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rnd() * 0.5, len = r1 * (0.6 + rnd() * 0.5), ww = w * (0.6 + rnd() * 0.8);
        const ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux;
        poly([[cx + ux * r0 + px * ww, cy + uy * r0 + py * ww], [cx + ux * len, cy + uy * len], [cx + ux * r0 - px * ww, cy + uy * r0 - py * ww]], 'rgba(255,255,255,' + alpha + ')');
      }
    };
    // 0 burst — der wichtigste: Kern plus unregelmaessige Zacken (Interpunktion, kein Feuerwerk)
    let [x, y] = at(0); poly(ring(x, y, S * 0.26, 0.42, 13), 'rgba(255,255,255,0.96)'); rays(x, y, 6, S * 0.2, S * 0.46, S * 0.05, 0.85);
    // 1 star — nur Zacken, kein Kern: schnelle, harte Waffen
    ;[x, y] = at(1); rays(x, y, 5, S * 0.04, S * 0.45, S * 0.035, 1); poly(ring(x, y, S * 0.09, 0.3, 9), '#fff');
    // 2 puff — kleiner weicher Ballen
    ;[x, y] = at(2); soft(x, y, S * 0.38, 0.62); soft(x - S * 0.1, y + S * 0.07, S * 0.22, 0.5); soft(x + S * 0.12, y - S * 0.05, S * 0.19, 0.45);
    // 3 spark — laengliche Raute
    ;[x, y] = at(3); poly([[x, y - S * 0.42], [x + S * 0.07, y], [x, y + S * 0.42], [x - S * 0.07, y]], '#fff');
    // 4 splat — Klecks mit Tropfen
    ;[x, y] = at(4); poly(ring(x, y, S * 0.25, 0.5, 15), 'rgba(255,255,255,0.95)');
    for (let i = 0; i < 7; i++) { const a = rnd() * 6.2832, d = S * (0.28 + rnd() * 0.16); poly(ring(x + Math.cos(a) * d, y + Math.sin(a) * d, S * (0.03 + rnd() * 0.05), 0.6, 8), 'rgba(255,255,255,0.85)'); }
    // 5 ring — NUR fuer Wasser, Zone, Schild (semantische Sperre aus beiden Quellen)
    ;[x, y] = at(5); c.strokeStyle = '#fff'; c.lineWidth = S * 0.045; c.lineJoin = 'round';
    { const p = ring(x, y, S * 0.38, 0.12, 30); c.beginPath(); c.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) c.lineTo(p[i][0], p[i][1]); c.closePath(); c.stroke(); }
    /* 6 streak — die SPEEDLINE. Vorn eine helle, gerundete Spitze, hinten laeuft sie auf
       null zu UND blendet aus. Beides zusammen: ein Strich, der eckig endet, liest sich als
       Balken, nicht als Geschwindigkeit. Deckel und harte Kante sind der Fehler, nicht die
       Laenge. */
    ;[x, y] = at(6);
    { const x0 = x - S * 0.46, x1 = x + S * 0.44, h = S * 0.1;
      c.beginPath();
      c.moveTo(x0, y);                                   // Schwanzspitze: exakt null
      c.quadraticCurveTo(x + S * 0.1, y - h * 0.55, x1 - h, y - h);
      c.arc(x1 - h, y, h, -Math.PI / 2, Math.PI / 2);    // runder heller Kopf
      c.quadraticCurveTo(x + S * 0.1, y + h * 0.55, x0, y);
      c.closePath(); c.fillStyle = 'rgba(255,255,255,0.95)'; c.fill();
      // Kopf-Licht: der vorderste Teil ist heisser als der Rest
      const hg = c.createLinearGradient(x1 - h * 2.6, 0, x1, 0);
      hg.addColorStop(0, 'rgba(255,255,255,0)'); hg.addColorStop(1, 'rgba(255,255,255,0.75)');
      c.fillStyle = hg; c.fill();
      // Schwanz ausblenden statt abschneiden
      c.save(); c.beginPath(); c.rect(x - S * 0.5, y - S * 0.5, S, S); c.clip();
      c.globalCompositeOperation = 'destination-out';
      const fg = c.createLinearGradient(x0, 0, x + S * 0.16, 0);
      fg.addColorStop(0, 'rgba(0,0,0,1)'); fg.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = fg; c.fillRect(x0, y - S * 0.2, S * 0.62, S * 0.4);
      c.restore(); }
    // 7 shard — Splitter
    ;[x, y] = at(7); poly([[x - S * 0.05, y - S * 0.4], [x + S * 0.11, y + S * 0.12], [x - S * 0.09, y + S * 0.4]], '#fff');
    // 8 tongue — Flammenzunge, unregelmaessig, keine runde Kugel
    ;[x, y] = at(8);
    { const p = []; for (let i = 0; i <= 16; i++) { const t = i / 16, a = Math.PI * 2 * t; const r = S * (0.34 - 0.14 * Math.cos(a)) * (0.9 + rnd() * 0.2); p.push([x + Math.sin(a) * r * 0.75, y - Math.cos(a) * r * 1.15]); } poly(p, 'rgba(255,255,255,0.95)'); }
    // 9 card — KFB-Munition: Kartenfetzen
    ;[x, y] = at(9); c.save(); c.translate(x, y); c.rotate(-0.22);
    poly([[-S * 0.2, -S * 0.3], [S * 0.2, -S * 0.26], [S * 0.17, S * 0.3], [-S * 0.22, S * 0.27]], 'rgba(255,255,255,0.92)'); c.restore();
    // 10 stamp — Stempelmarke: unregelmaessiger Rahmen
    ;[x, y] = at(10); c.strokeStyle = 'rgba(255,255,255,0.95)'; c.lineWidth = S * 0.06;
    { const p = [[-1, -1], [1, -0.94], [0.96, 1], [-0.95, 0.97]].map((q) => [x + q[0] * S * 0.3 + (rnd() - 0.5) * 8, y + q[1] * S * 0.3 + (rnd() - 0.5) * 8]);
      c.beginPath(); c.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) c.lineTo(p[i][0], p[i][1]); c.closePath(); c.stroke(); }
    // 11 smoke — grosser weicher Ballen, niedrige Deckkraft
    ;[x, y] = at(11); soft(x, y, S * 0.46, 0.42); soft(x - S * 0.14, y - S * 0.1, S * 0.26, 0.3); soft(x + S * 0.13, y + S * 0.12, S * 0.24, 0.28);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  /* LOADER-HOOK aus v8, unveraendert in der Absicht: ein PNG mit demselben 4x3-Raster
     ersetzt die Zeichnung, ohne dass irgendeine andere Zeile sich aendert. */
  if (typeof window !== 'undefined' && window.KFB_VFX_ATLAS_URL && onPNG) {
    new THREE.TextureLoader().load(window.KFB_VFX_ATLAS_URL, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      /* MELDEZEILE (T1, 03.09.2026): das Blatt hat KEINE Tuschekante — das muss gesagt
         werden, sonst sieht „weiche Kante" wie Absicht aus (dieselbe Klasse wie der
         stumme Ink-Ausfall). Fehlt die Datei, bleibt die Zeichnung: kein leerer Atlas. */
      console.log('[atlas] Blatt: PNG ' + window.KFB_VFX_ATLAS_URL + ' · ' + t.image.width + '×' + t.image.height + ' · ohne Tuschekante (ersetzt die Zeichnung)');
      onPNG(t);
    }, undefined, () => console.warn('[atlas] Blatt ' + window.KFB_VFX_ATLAS_URL + ' nicht ladbar — Zeichnung bleibt'));
  }
  return {
    texture: tex, cols: COLS, rows: ROWS, cells: CELLS.slice(), canvas: cv,
    inked: !!(Ink && Ink.drawInkOutline)
  };
}
