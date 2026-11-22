// kfb-hypernorm · Material nur aus Manifesten (K1b, WSV 06.11.2026)
// Regel: Der Kern lädt nur von freigegebenen Herkünften: der eigenen Seite und den Medien-Adressen, die der Aufrufer ausdrücklich
// freigibt (`erlaubt`, Georg 06.11. W-004: öffentliche PD-Medien-Adresse von WSA, ohne Login, mit CORS). Alles andere wird nie geladen.
// Bilder fremder Herkunft werden mit crossOrigin='anonymous' geladen, sonst wäre die Fläche für getImageData gesperrt.
//
// loadMaterial(quellen, { onProgress }) → kfb.hn-material/1: { schema, items, imgs, report }
//   quellen: [{ url: 'pfad/manifest.json', src?: 'pd'|'kfb'|'loc', mirror?: 'basis/', max?: n, nur?: [Sammlungs-Ids] }]   · mirror schlägt baseUrl/image.url des Manifests
//   optionen: { erlaubt: ['https://medien.beispiel'], onProgress, maxKante: px (große Bilder beim Laden verkleinern; Standard aus = wie bisher) }
// Adapter je Schema:
//   kfb pd_pool (eintraege[]: datei, titel, urheber, datum, gruppe, seite, lizenz) – wie H15 loadWs0, Art/Tags wortgleich
//   kfb.hypernorm-archive/1 (assets[]: id, title, creator, date, classification, tags, image{sha256,mime}) – Bild aus mirror/<sha256>.<ext>
//   kfb.hn-material/1 (items[]: id, src, kind, tags, title, who, year, file) – eigenes Format, Datei relativ
//   W-010 (WSA 06.11.): kfb.hypernorm-advertising-stills/1, kfb.hypernorm-*-images/1 (semantic, tarot, manuscripts, technical),
//     kfb.hypernorm-official-document-images/1: assets[].image.url ist das Engine-Bild; Art und Etiketten nach Sammlung (SAMMLUNG unten),
//     engineKind/engineTags im Eintrag schlagen das. existingPoolLink ersetzt den Pool-Eintrag (höhere Auflösung), workKey doppelt: größtes Bild.
//   kfb.hypernorm-image-collections/1 (Gesamtkatalog): Verzeichnis der Sammlungs-Manifeste; wird aufgelöst (nur?: Ids), bereits genannte Manifeste nicht doppelt.

const KIND = g => /^akte/.test(g) ? 'document' : /^(film|kosmos)|photograph|daguerreo|stereo/.test(g) ? 'photo' : /poster|advert/.test(g) ? 'poster' : /map|atlas|anatom|botan|zoolog|alchem|astrol|diagram|machine|buch/.test(g) ? 'engraving' : 'print';
const TAGS = g => /^akte/.test(g) ? ['political', 'historical'] : /^kosmos|anatom|botan|zoolog|diagram|machine|comet|eclipse/.test(g) ? ['scientific', 'historical'] : /poster|advert|carnival|circus/.test(g) ? ['commercial', 'historical'] : ['artistic', 'historical'];
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

let ERLAUBT = new Set();
const sameOrigin = u => { const x = new URL(u, location.href); return x.origin === location.origin || ERLAUBT.has(x.origin); };
const own = u => new URL(u, location.href).origin === location.origin;
const rel = (base, f) => new URL(f, new URL(base, location.href)).href;

// W-010: Art (kind) und Etiketten (tags) im Wortschatz von H15 (photo, print, engraving, poster, document; political, historical, scientific, artistic, commercial)
const SAMMLUNG_SCHEMA = /^kfb\.hypernorm-(advertising-stills|[a-z-]+-images)\/1$/;
const MT = { photograph: 'photo', 'sculpture-photograph': 'photo', 'artwork-reproduction': 'print', 'painting-reproduction': 'print', 'playing-card-reproduction': 'print',
  'illuminated-manuscript-page': 'print', 'illustrated-printed-book-page': 'engraving', 'technical-drawing': 'engraving', 'document-page': 'document', 'patent-drawing-facsimile': 'engraving' };
const WISSEN = /cosmos|nature|machine|science|astronom|anatom|botan|crystal|motion|flight|patent/;
function sammlung(schema) {
  if (/advertising/.test(schema)) return a => ['poster', a.category === 'public-campaign-propaganda' ? ['political', 'historical'] : a.category === 'culture-entertainment' ? ['commercial', 'artistic', 'historical'] : ['commercial', 'historical']];
  if (/official-document/.test(schema)) return a => [MT[a.mediaType] || 'document', a.mediaType === 'patent-drawing-facsimile' ? ['scientific', 'political', 'historical'] : ['political', 'historical']];
  if (/technical/.test(schema)) return a => [MT[a.mediaType] || 'engraving', ['scientific', 'historical']];
  return a => [MT[a.mediaType] || 'print', WISSEN.test((a.curatorialTags || []).join(' ')) || a.mediaType === 'photograph' && WISSEN.test(String(a.title).toLowerCase()) ? ['scientific', 'artistic', 'historical'] : ['artistic', 'historical']];
}

function adapt(m, q) {
  const out = [];
  if (Array.isArray(m.eintraege)) {   // WS0-/WSA-Pool (H15 hypernorm_r3/pd_pool)
    const seen = new Set();
    for (const e of m.eintraege) { if (!e.datei || seen.has(e.datei)) continue; seen.add(e.datei); const g = e.gruppe || '';
      out.push({ id: 'pool.' + e.datei, src: q.src || 'pd', kind: KIND(g), tags: TAGS(g), title: e.titel || e.datei, who: e.urheber || '—', year: e.datum || '—', page: e.seite, lic: e.lizenz, file: rel(q.url, e.datei) }); }
  } else if (m.schema === 'kfb.hypernorm-archive/1') {
    for (const a of m.assets || []) { const im = a.image || {}; if (!im.sha256) continue;
      const kind = /print|drawing/i.test(a.classification || '') ? 'engraving' : /photo/i.test(a.classification || '') ? 'photo' : 'print';
      out.push({ id: a.id, src: q.src || 'pd', kind, tags: (a.tags || []).concat(['artistic', 'historical']).slice(0, 8), title: a.title, who: a.creator || '—', year: a.date || '—', page: a.source && a.source.page, lic: a.rights && a.rights.license,
        sha256: im.sha256, file: q.mirror ? rel(q.mirror, im.sha256 + '.' + (EXT[im.mime] || 'jpg')) : m.baseUrl ? rel(m.baseUrl, im.sha256 + '.' + (EXT[im.mime] || 'jpg')) : im.url || null }); }
  } else if (m.schema === 'kfb.hn-media/1') {   // K3: auch Figuren, Karten, Seiten (deck, card, page, quadrant, zones, cutBottom)
    const base = q.mirror || m.baseUrl || './';
    for (const it of m.items || []) { if (!['image', 'card', 'figure', 'page'].includes(it.kind)) continue;
      out.push(Object.assign({}, it, { src: it.kind === 'image' ? (q.src || 'pd') : null, kind: it.kind === 'image' ? (it.engineKind || 'print') : it.kind, tags: it.engineTags || it.tags || ['artistic', 'historical'],
        title: it.title || it.id, who: it.creator || '—', year: it.date || '—', file: rel(rel(q.url, base), it.file) })); }
  } else if (m.schema === 'kfb.hn-material/1') {
    for (const p of m.items || []) out.push(Object.assign({}, p, { file: p.file ? rel(q.url, p.file) : null }));
  } else if (SAMMLUNG_SCHEMA.test(m.schema || '')) {
    const S = sammlung(m.schema);
    for (const a of m.assets || []) { const im = a.image || {}; if (!im.url) continue; const [kind, tags] = S(a);
      out.push({ id: a.id, src: q.src || 'pd', kind: a.engineKind || kind, tags: a.engineTags || tags, title: a.title || a.id, who: a.creator || '—', year: a.dateDisplay || a.date || '—',
        lic: a.rights && a.rights.license, sammlung: m.schema.slice(14, -2), werk: a.workKey || null, px: (im.width || 0) * (im.height || 0), schriftImBild: !!(a.display && a.display.hasEmbeddedText),
        ersetzt: a.existingPoolLink && a.existingPoolLink.assetId ? 'pool.' + a.existingPoolLink.assetId.replace(/^ws0\./, '') : null,
        file: q.mirror ? rel(q.mirror, im.url.split('/').pop()) : rel(q.url, im.url) }); }
  } else throw new Error('Manifest-Schema unbekannt: ' + (m.schema || '(ohne)') + ' · ' + q.url);
  return out;
}

const loadImgDom = url => new Promise(res => { const i = new Image(); i.decoding = 'async'; if (!own(url)) i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = () => res(null); i.src = url; });
// Worker (K7): kein Image-Element. ImageBitmap aus fetch, mit naturalWidth/naturalHeight wie ein Bild-Element (H15 liest diese Maße)
export const alsBild = b => { if (b && b.naturalWidth === undefined) Object.defineProperties(b, { naturalWidth: { value: b.width }, naturalHeight: { value: b.height } }); return b; };
const loadImgWorker = async url => { try { const r = await fetch(url, { mode: own(url) ? 'same-origin' : 'cors', credentials: 'omit' }); if (!r.ok) return null; return alsBild(await createImageBitmap(await r.blob())); } catch (e) { return null; } };
const loadImg = (url, bm) => bm || typeof Image === 'undefined' ? loadImgWorker(url) : loadImgDom(url);   // bm: auch im Hauptfaden als ImageBitmap (gleich wie im Worker)

// bitmaps: Bilder als ImageBitmap auch im Hauptfaden. Dann rendern Worker und Hauptfaden bitgleich, auch PNG mit Alpha (Darsteller). Standard aus (K1-Gleichheit mit der H15-Seite).
// maxKante (W-010): Bilder mit längerer Kante darüber werden beim Laden als ImageBitmap verkleinert (Hauptfaden und Worker gleich). Ohne maxKante unverändert.
const passe = async (im, max) => { if (!im || !max) return im; const w = im.naturalWidth || im.width, h = im.naturalHeight || im.height, s = max / Math.max(w, h); if (s >= 1) return im;
  const b = alsBild(await createImageBitmap(im, { resizeWidth: Math.round(w * s), resizeHeight: Math.round(h * s), resizeQuality: 'high' })); if (im.close) im.close(); return b; };
export async function loadMaterial(quellen, { onProgress, parallel = 8, erlaubt = [], bitmaps = false, maxKante = 0 } = {}) {
  ERLAUBT = new Set(erlaubt.map(u => new URL(u).origin));
  const items = [], imgs = {}, report = { quellen: [], geladen: 0, fehlt: 0, ohneDatei: 0, fremdVerweigert: 0, ersetzt: 0, doppelt: 0 };
  const L = quellen.slice(), gesehen = new Set(L.map(q => new URL(q.url, location.href).href));
  for (let i = 0; i < L.length; i++) { const q = L[i];
    if (!sameOrigin(q.url)) { report.fremdVerweigert++; report.quellen.push({ url: q.url, err: 'Herkunft nicht freigegeben' }); continue; }
    const m = await (await fetch(q.url)).json();
    if (m.schema === 'kfb.hypernorm-image-collections/1') {   // Gesamtkatalog: Sammlungen dahinter einreihen (gleiche Regeln, gleiche Freigabe)
      const neu = (m.collections || []).filter(c => c.manifest && (!q.nur || q.nur.includes(c.id))).map(c => ({ url: rel(q.url, c.manifest), src: q.src, max: q.max, sammlung: c.id })).filter(c => !gesehen.has(c.url));
      neu.forEach(c => gesehen.add(c.url)); L.splice(i + 1, 0, ...neu); report.quellen.push({ url: q.url, schema: m.schema, sammlungen: neu.length }); continue; }
    let list = adapt(m, q); if (q.max) list = list.slice(0, q.max);
    report.quellen.push({ url: q.url, schema: m.schema || 'pool', n: list.length });
    items.push(...list);
  }
  // höhere Auflösung schlägt den Pool-Eintrag; dasselbe Werk (workKey) nur einmal, das größte Bild
  const weg = new Set(items.filter(p => p.ersetzt).map(p => p.ersetzt)), werk = new Map();
  for (const p of items) if (p.werk) { const w = werk.get(p.werk); if (!w || p.px > w.px) { if (w) weg.add(w.id); werk.set(p.werk, p); } else weg.add(p.id); }
  for (let i = items.length - 1; i >= 0; i--) if (weg.has(items[i].id)) { report[items[i].id.startsWith('pool.') ? 'ersetzt' : 'doppelt']++; items.splice(i, 1); }
  let k = 0; const todo = items.filter(p => { if (!p.file) { report.ohneDatei++; return false; } if (!sameOrigin(p.file)) { report.fremdVerweigert++; return false; } return true; });
  const worker = async () => { while (k < todo.length) { const p = todo[k++], im = await passe(await loadImg(p.file, bitmaps), maxKante); if (im) { imgs[p.id] = im; report.geladen++; } else report.fehlt++; onProgress && onProgress(report); } };
  await Promise.all(Array.from({ length: parallel }, worker));
  return { schema: 'kfb.hn-material/1', items: items.filter(p => imgs[p.id]), imgs, report };
}

// Netzwächter: zählt jede Ressource von nicht freigegebener Herkunft (Bilder, Skripte, Schriften, fetch), auch die vor dem Aufruf geladenen
export function netzwaechter(erlaubt = []) {
  const ok = new Set([location.origin, ...erlaubt.map(u => new URL(u).origin)]);
  const fremd = [], seen = new Set(), take = e => { if (seen.has(e.name)) return; seen.add(e.name); try { if (!ok.has(new URL(e.name).origin)) fremd.push(e.name); } catch (x) {} };
  performance.getEntriesByType('resource').forEach(take);
  const po = new PerformanceObserver(l => l.getEntries().forEach(take)); po.observe({ type: 'resource', buffered: true });
  return { get fremd() { return fremd.slice(); }, stop: () => po.disconnect() };
}

// ---------- K2b · Filme ----------
// loadFilms(quellen, { erlaubt, max, streuen }) → [{ id, el: HTMLVideoElement (stumm, Metadaten geladen), title, who, year, tags, kind: 'film' }]
// streuen (Standard an): bei max reihum je Quelle (catalogId bzw. Titel) statt der ersten n im Manifest (dort liegen die Clips einer Quelle hintereinander).
// Schemas: kfb.hypernorm-films/1 (clips[].media.url; Wiedergabe ab 0, cut.startSeconds NICHT anwenden), kfb.hn-media/1 (items kind 'video').
// q.mirror bzw. manifest.baseUrl ersetzt die Herkunft: Dateiname aus der Medien-URL, neu angehängt an die Basis.
const loadVideo = (url) => new Promise(res => { const v = document.createElement('video'); v.muted = true; v.preload = 'auto'; v.playsInline = true; if (!own(url)) v.crossOrigin = 'anonymous';
  v.onloadeddata = () => res(v); v.onerror = () => res(null); v.src = url; });
const reihum = list => { const g = new Map(); for (const f of list) { if (!g.has(f.quelle)) g.set(f.quelle, []); g.get(f.quelle).push(f); }
  const out = [], G = [...g.values()]; for (let i = 0; out.length < list.length; i++) for (const L of G) if (L[i]) out.push(L[i]); return out; };
export async function loadFilms(quellen, { erlaubt = [], max = Infinity, streuen = true } = {}) {
  ERLAUBT = new Set(erlaubt.map(u => new URL(u).origin)); const out = [];
  for (const q of quellen) {
    if (!sameOrigin(q.url)) continue;
    const m = await (await fetch(q.url)).json(), base = q.mirror || m.baseUrl || null, list = [];
    if (m.schema === 'kfb.hypernorm-films/1') for (const c of m.clips || []) { const u = c.media && c.media.url; if (!u) continue;
      list.push({ id: c.id, title: c.title, who: (c.source && c.source.creator) || '—', year: c.year || '—', tags: ['artistic', 'historical'], quelle: c.catalogId ?? c.title, url: base ? rel(base, u.split('/').pop()) : u }); }
    else if (m.schema === 'kfb.hn-media/1') for (const it of m.items || []) { if (it.kind !== 'video') continue; list.push({ id: it.id, title: it.title, who: it.creator || '—', year: it.date || '—', tags: it.engineTags || ['artistic', 'historical'], quelle: it.source || it.title, url: rel(base || q.url, it.file) }); }
    else throw new Error('Film-Manifest unbekannt: ' + (m.schema || '(ohne)'));
    for (const f of (streuen ? reihum(list) : list)) { if (out.length >= max) break; if (!sameOrigin(f.url)) continue; const v = await loadVideo(f.url); if (v) out.push({ id: f.id, el: v, title: f.title, who: f.who, year: f.year, tags: f.tags, kind: 'film' }); }
  }
  return out;
}
