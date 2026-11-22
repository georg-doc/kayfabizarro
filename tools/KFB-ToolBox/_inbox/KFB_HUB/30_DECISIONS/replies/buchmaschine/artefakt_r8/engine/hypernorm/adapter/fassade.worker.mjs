// kfb-hypernorm · Flächen-Worker (K7, W-007 Punkt 2; WSV 06.11.2026): ein Kern für alle Flächen der Seite, der Hauptfaden zeigt nur fertige Bilder.
// Hülle: document.createElement('canvas') → OffscreenCanvas, document.fonts → self.fonts. Filme gibt es im Worker nicht (Fassaden-Ring sperrt FILM).
// Protokoll (Hauptfaden → Worker): init { quellen?, erlaubt?, items?, bitmaps?, schriftManifest?, darsteller? } · neu { id, cfg } · weg { id }
//                                  tick { id, zeit } · add { id, it } · farbe { id, wert, ueber } · vorfuellen { id, maxS } · bildBei { id, zeit } (Prüfung)
//           init.schriftPool: { url?, blacklist?, anteil?, budget? } (Schrift-Pool, Typo-Konzept 0c)
//           (Worker → Hauptfaden): bereit { pool, schriften } · fehler { id?, text } · bild { id, bmp, ms, vor, sh } · leer { id }
//           neu.cfg.raum (R1): Raum-Durchgang mit WebGL2 auf OffscreenCanvas im Worker; bildBei meldet raum { ok, grund, bilder, flach }
//                                  ring { id, bmp, meta, fortschritt } · vorgefuellt { id, zeit, fortschritt } · bildBei { id, bmp }
if (typeof document === 'undefined') {
  // querySelector/-All/getElementsByTagName: im Vite-Dev holt hypernorm.gen.mjs den Vite-Client (injectQuery) in den Worker, der fragt das document ab (WS1-Theater T-014 Befund 1)
  self.document = { createElement(t) { if (t === 'canvas') return new OffscreenCanvas(300, 150); throw new Error('Worker: kein ' + t); }, fonts: self.fonts, querySelector: () => null, querySelectorAll: () => [], getElementsByTagName: () => [] };
  self.window = self;
  self.HTMLCanvasElement = OffscreenCanvas;   // withBake setzt willReadFrequently über HTMLCanvasElement.prototype.getContext
}
const warte = []; let inst = null, mod = null, offen = false; const FL = new Map(), OUT = new Map();
self.onmessage = e => { if (offen || e.data.typ === 'init') los(e.data); else warte.push(e.data); };   // bis init fertig ist, in Reihenfolge sammeln
const fehler = (x, id) => self.postMessage({ typ: 'fehler', id, text: String(x && x.message || x) });

// Bild des Kerns in die Ausgabefläche der Fläche kopieren und als ImageBitmap übergeben (ohne Kopie, transfer)
const bild = (id, c) => { let o = OUT.get(id); if (!o || o.c.width !== c.width || o.c.height !== c.height) { const cv = new OffscreenCanvas(c.width, c.height); o = { c: cv, x: cv.getContext('2d', { willReadFrequently: true }) }; OUT.set(id, o); }
  o.x.clearRect(0, 0, o.c.width, o.c.height); o.x.drawImage(c, 0, 0); return o.c.transferToImageBitmap(); };

async function los(m) {
  const F = m.id != null ? FL.get(m.id) : null;
  try {
    if (m.typ === 'init') {
      mod = await Promise.all([import('./flaeche.mjs'), import('../material.mjs'), import('../fonts/fonts.mjs'), import('../schriftpool.mjs')]);
      const [{ kernInstanz }, { loadMaterial, alsBild }, { loadFonts }, { ladeSchriftPool }] = mod;
      const schrift = await loadFonts(undefined, { manifest: m.schriftManifest || null });
      let mat;
      if (m.quellen) mat = await loadMaterial(m.quellen, { erlaubt: m.erlaubt || [] });
      else { mat = { schema: 'kfb.hn-material/1', items: m.items, imgs: {} }; for (const k in m.bitmaps) mat.imgs[k] = alsBild(m.bitmaps[k]); }
      const sp = m.schriftPool ? Object.assign({}, m.schriftPool, { manifest: m.schriftPool.url ? await ladeSchriftPool(m.schriftPool.url) : null }) : null;
      inst = kernInstanz(mat, { darsteller: m.darsteller !== false, schriftPool: sp });
      self.postMessage({ typ: 'bereit', pool: mat.items.length, schriften: schrift.geladen });
      while (warte.length) await los(warte.shift());
      offen = true; return;
    }
    if (m.typ === 'neu') { FL.set(m.id, mod[0].flaeche(inst, Object.assign({}, m.cfg, { budgetMs: 1e9 }))); return; }   // kein Auslassen im Worker: ist er langsam, sinkt nur die Bildrate
    if (m.typ === 'weg') { FL.delete(m.id); OUT.delete(m.id); return; }
    if (!F) { if (m.typ === 'tick') self.postMessage({ typ: 'leer', id: m.id }); return; }
    if (m.typ === 'tick') { const a = performance.now(), r = F.tick(m.zeit);
      if (!r) { self.postMessage({ typ: 'leer', id: m.id }); return; }
      const bmp = bild(m.id, r.c); self.postMessage({ typ: 'bild', id: m.id, bmp, ms: performance.now() - a, vor: r.vor, sh: r.sh }, [bmp]); return; }
    if (m.typ === 'add') { F.add(m.it); return; }
    if (m.typ === 'farbe') { F.farbe(m.wert, { ueber: m.ueber }); return; }
    if (m.typ === 'vorfuellen') { const g = F.vorfuellen(m.maxS); let s = g.next();
      while (!s.done) { const bmp = bild(m.id, s.value.c); self.postMessage({ typ: 'ring', id: m.id, bmp, meta: s.value.meta, fortschritt: s.value.fortschritt }, [bmp]); s = g.next(); }
      self.postMessage({ typ: 'vorgefuellt', id: m.id, zeit: s.value, fortschritt: F.buch ? F.buch.fortschritt : 1 }); return; }
    if (m.typ === 'bildBei') { const a = performance.now(), bmp = bild(m.id, F.render(m.zeit)); self.postMessage({ typ: 'bildBei', id: m.id, bmp, ms: performance.now() - a, raum: Object.assign({}, F.raum) }, [bmp]); return; }
  } catch (x) { fehler(x, m.id); if (m.typ === 'tick') self.postMessage({ typ: 'leer', id: m.id }); }
}
