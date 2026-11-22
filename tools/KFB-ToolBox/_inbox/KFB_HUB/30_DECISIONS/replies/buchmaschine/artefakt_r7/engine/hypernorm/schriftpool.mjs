// kfb-hypernorm · Schrift-Pool (Georg 06.11., Typo-Konzept Abschnitt 0c; WSV)
// Hausschriften für Lesetext plus ein großer Pool freier Schriften mit Blacklist („dadaistisch“). Der Kern zieht pro Einstellung
// aus dem Pool (Seed, Gedächtnis gegen Wiederholung), mit Leitplanken statt Verboten. Ohne Pool bleibt die H15-Schriftwahl unverändert.
//
// Manifest (Vorschlag an WSA, kfb.hypernorm-fonts/1 mit rolle 'pool'):
//   { schema: 'kfb.hypernorm-fonts/1', rolle: 'pool', blacklist: ['Anybody', …],
//     families: [ { family, art: display|serif|sans|mono|hand|script|pixel|dekor, haus?: 'SHANTELL'|'COURIER'|'DEPARTURE', versal?, lesbarKlein?, gewicht?, stil?,
//                   faces: [ { style, weight, stretch?, unicodeRange?, file: { url, sha256? } } ] } ] }
// Laden wie Filme: Die Zeitleiste kennt die Schriften der nächsten Sekunden und lädt sie vorab (timeline.prepare, Live-Vorlauf), auch im Worker.
// Ist eine Pool-Schrift beim Bild noch nicht geladen, zeichnet der Kern deterministisch die Hausschrift ihrer Art und zählt das (stats.rueckfall).

export const BLACKLIST = Object.freeze(['Anybody', 'Recursive', 'Comic Sans MS', 'Comic Neue', 'Balsamiq Sans', 'Pinyon Script', 'Imperial Script']);
const SPLIT = new Set(['SCATTER', 'CHARFLIP', 'ARC', 'WAVE']);       // zerlegen Text in Einzelzeichen: keine Hand- und Schreibschrift
const KLEIN = new Set(['TEXTURE', 'ECHO']);                           // kleine bzw. wiederholte Schrift: nur lesbarKlein
const FIX = new Set(['WIDTH_MORPH', 'REDACT', 'ROSETTA', 'RANSOM', 'MOLECULE', 'FORMULA']);   // Typo-Arten mit fester Schrift (Achsen, Glyphen): unverändert
const V_ART = { display: { slogan: 2.5, signal: 1.5 }, sans: { slogan: 2, signal: 1.5 }, serif: { poem: 2, slogan: 1.2, latin: 1 }, mono: { signal: 2.5, slogan: .8 },
  hand: { poem: 1.5, slogan: 1.5 }, script: { poem: 2.5, slogan: .6 }, pixel: { signal: 2.5, slogan: .8 }, dekor: { slogan: 1.5, signal: 1 } };
const RUECKFALL = { display: 'GROT', sans: 'GROT', serif: 'SERIF', mono: 'MONO', hand: 'TYPE', script: 'SERIF', pixel: 'PIXEL', dekor: 'GROT' };
// Lesetext-Rollen (Konzept Abschnitt 3): nur Hausschriften; Schlüssel in Reihenfolge, der erste vorhandene gilt
export const ROLLEN_HAUS = Object.freeze({ name: ['GROT_C'], ansage: ['GROT_C'], kraft: ['TYPE'], lore: ['TYPE'], zitat: ['COURIER', 'TYPE'],
  karaoke: ['SHANTELL', 'SERIF'], subtext: ['SHANTELL', 'SERIF'], terminal: ['DEPARTURE', 'PIXEL'] });
export const LESEROLLEN = Object.freeze(['lore', 'zitat', 'karaoke', 'subtext', 'terminal']);
const ablage = () => (typeof document !== 'undefined' && document.fonts) || self.fonts;

export async function ladeSchriftPool(url) {
  const m = await (await fetch(url, { credentials: 'omit' })).json();
  if (m.schema !== 'kfb.hypernorm-fonts/1') throw new Error('Schrift-Pool: Schema unbekannt ' + m.schema);
  return m;
}

// E: createEngine-Instanz · manifest: geladenes Pool-Manifest (oder null: nur Blacklist auf die H15-Schriften)
// optionen: blacklist (Familiennamen, ergänzt die des Manifests), anteil (0..1, wie oft eine freie Einstellung eine Pool-Schrift bekommt), budget (geladene Pool-Familien), gedaechtnis
export function installSchriftPool(E, manifest, { blacklist = BLACKLIST, anteil = .6, budget = 48, gedaechtnis = 16 } = {}) {
  const { M, o } = E, F = M.FONTS;
  const schwarz = new Set([...blacklist, ...((manifest && manifest.blacklist) || [])].map(s => s.toLowerCase()));
  const famVon = k => { const s = F[k].f(10), m = s.match(/"([^"]+)"/) || s.match(/\d+px (.+)$/); return m ? m[1].trim().toLowerCase() : ''; };
  const geladen = new Set(), laeuft = new Map(), flaechen = new Map(), lru = [], stats = { familien: 0, geladen: 0, rueckfall: 0, entladen: 0, fehler: 0, schwarz: [] };
  const pool = [], meta = {}; let n = 0;
  for (const fam of (manifest && manifest.families) || []) {
    if (schwarz.has(String(fam.family).toLowerCase())) { stats.schwarz.push(fam.family); continue; }
    const key = fam.haus ? String(fam.haus).toUpperCase() : 'P' + String(n++).padStart(3, '0');
    const art = fam.art || 'display', faces = (fam.faces || []).filter(x => x.file && x.file.url);
    if (!faces.length) continue;
    const stil = fam.stil || (faces.some(x => (x.style || 'normal') === 'normal') ? 'normal' : faces[0].style);
    const wf = String((faces.find(x => (x.style || 'normal') === stil) || faces[0]).weight || '400'), [w0, w1] = wf.split(' ').map(Number);
    const ziel = fam.gewicht || (['display', 'sans', 'dekor'].includes(art) ? 800 : 400), w = w1 ? Math.max(w0, Math.min(w1, ziel)) : w0 || 400;
    const fb = RUECKFALL[art] || 'GROT';
    F[key] = { f: s => geladen.has(key) ? `${stil === 'italic' ? 'italic ' : ''}${w} ${s}px "${fam.family}"` : F[fb].f(s), up: !!fam.versal,
      v: fam.v || V_ART[art] || { slogan: 1 }, pool: true, haus: !!fam.haus, art, fam: fam.family };
    meta[key] = { art, lesbarKlein: fam.lesbarKlein !== false, faces: faces.filter(x => (x.style || 'normal') === stil), family: fam.family };
    pool.push(key);
  }
  stats.familien = pool.length;
  const schwarzeKeys = new Set(Object.keys(F).filter(k => !F[k].pool && schwarz.has(famVon(k))));
  const ok = (k, c) => !!k && !!F[k] && !schwarzeKeys.has(k) && !(SPLIT.has(c.type) && ['hand', 'script'].includes(F[k].art)) && !(KLEIN.has(c.type) && meta[k] && !meta[k].lesbarKlein);
  const mem = [];
  const wahl = (r, c, pred = () => true) => { const voice = c.text && c.text.voice, ks = pool.filter(k => ok(k, c) && pred(k) && !mem.includes(k)); if (!ks.length) return null;
    const ws = ks.map(k => F[k].v[voice] || .12); let s = ws.reduce((a, b) => a + b, 0) * r(); for (let i = 0; i < ks.length; i++) { s -= ws[i]; if (s <= 0) return ks[i]; } return ks[ks.length - 1]; };
  const merke = k => { if (F[k] && F[k].pool) { mem.push(k); if (mem.length > gedaechtnis) mem.shift(); } };
  const ersatz = k => F[k] && F[k].art ? (RUECKFALL[F[k].art] || 'GROT') : (k === 'SCRIPT' || k === 'SWASH' ? 'SERIF' : 'GROT');
  // Haken in planShot (Patch P16): ersetzt bzw. prüft die Schriftwahl von H15
  o._schriftWahl = (c, r) => {
    if (c.type === 'SCRIPT') { if (!ok(c.font, c)) c.font = wahl(r, c, k => ['hand', 'script', 'serif'].includes(F[k].art)) || 'SERIF'; }
    else if (!FIX.has(c.type) && pool.length && r() < anteil) { const k = wahl(r, c); if (k) c.font = k; }
    if (!ok(c.font, c)) c.font = ersatz(c.font);
    if (c.mfonts) { let p = 0; c.mfonts = c.mfonts.map((k, i) => { let x = i === 0 ? c.font : k;
      if (i > 0 && pool.length && p < 2 && r() < anteil) { const y = wahl(r, c, z => !c.mfonts.includes(z)); if (y) x = y; }
      if (!ok(x, c) || (F[x].pool && p >= 2 && i > 0)) x = ersatz(x); if (F[x].pool) p++; return x; }); }
    merke(c.font); (c.mfonts || []).forEach(merke);
  };
  // Hausschrift je Lesetext-Rolle (text.role); null, wenn die Rolle keine Lesetext-Rolle ist
  const hausFuer = rolle => { const ks = ROLLEN_HAUS[rolle]; if (!ks) return null; return ks.find(k => F[k] && !schwarzeKeys.has(k)) || null; };
  // Laden (wie Filme): Familien der nächsten Einstellungen vorab, Budget mit LRU, nie die gerade gebrauchten entladen
  async function lade(key) {
    if (geladen.has(key)) return; if (laeuft.has(key)) return laeuft.get(key);
    const m = meta[key]; if (!m) return;
    const p = Promise.all(m.faces.map(x => { const d = {}; for (const q of ['style', 'weight', 'stretch', 'unicodeRange']) if (x[q]) d[q] = x[q];
      const ff = new FontFace(m.family, `url(${x.file.url})`, d); return ff.load().then(f => { ablage().add(f); return f; }); }))
      .then(fs => { flaechen.set(key, fs); geladen.add(key); stats.geladen = geladen.size; }).catch(() => { stats.fehler++; }).finally(() => laeuft.delete(key));
    laeuft.set(key, p); return p;
  }
  async function vorbereiten(keys) {
    const ks = [...new Set(keys)].filter(k => meta[k]);
    for (const k of ks) { const i = lru.indexOf(k); if (i >= 0) lru.splice(i, 1); lru.push(k); }
    await Promise.all(ks.map(lade));
    while (geladen.size > budget) { const k = lru.find(x => geladen.has(x) && !ks.includes(x)); if (!k) break; lru.splice(lru.indexOf(k), 1);
      for (const f of flaechen.get(k) || []) ablage().delete(f); flaechen.delete(k); geladen.delete(k); stats.entladen++; }
    stats.geladen = geladen.size;
  }
  const keysVon = sh => [sh.font, ...(sh.mfonts || [])].filter(k => k && meta[k]);
  E._pool = { pool, meta, stats, vorbereiten, keysVon, hausFuer, istGeladen: k => !meta[k] || geladen.has(k), schwarzeKeys: [...schwarzeKeys] };
  return E._pool;
}
