// kfb-hypernorm · Schriften (K1b lokal, ab 06.11. vollständig von WSA).
// Ohne Angabe: 9 lokale Dateien (8 Familien, teils nur ein Schnitt), dieselben wie das Spiel (src/vendor/h15-fonts). Netzlos.
// Mit { manifest }: alle 19 H15-Familien (65 Schnitte, kfb.hypernorm-fonts/1) von der öffentlichen Medien-Adresse, mit Achsen, Stilen und unicodeRange.
//   Scheitert das Manifest, bleibt es bei den lokalen Dateien. Im Worker registriert über self.fonts.
const FACES = [
  ['Archivo', 'archivo.woff2', { weight: '100 900', stretch: '62% 125%' }],
  ['Big Shoulders Display', 'big-shoulders-900.woff2', { weight: '900' }],
  ['Bodoni Moda', 'bodoni-moda-800i.woff2', { weight: '800', style: 'italic' }],
  ['Bodoni Moda', 'bodoni-moda-900.woff2', { weight: '900' }],
  ['IBM Plex Mono', 'ibm-plex-mono-600.woff2', { weight: '600' }],
  ['Instrument Serif', 'instrument-serif-i.woff2', { style: 'italic' }],
  ['Silkscreen', 'silkscreen.woff2', {}],
  ['Six Caps', 'six-caps.woff2', {}],
  ['Special Elite', 'special-elite.woff2', {}]
];
export const FEHLEN = ['Pinyon Script', 'Imperial Script', 'Noto Sans Egyptian Hieroglyphs', 'Noto Sans Cuneiform', 'Noto Sans Math', 'Cinzel 600/900',
  'UnifrakturMaguntia', 'IM Fell English (normal/kursiv)', 'Monoton', 'Bungee Shade', 'Rubik Mono One'];
export const TEILWEISE = ['Big Shoulders Display 700', 'Instrument Serif normal', 'IBM Plex Mono 400', 'Bodoni Moda übrige Schnitte'];
export const SCHRIFT_MANIFEST = 'https://kfb-public-media.frizzlebob.chatgpt.site/media/hypernorm-fonts/manifest.r1.json';   // WSA 06.11., PR #49
const ablage = () => (typeof document !== 'undefined' && document.fonts) || self.fonts;

async function ausManifest(url) {
  const m = await (await fetch(url, { credentials: 'omit' })).json();
  if (m.schema !== 'kfb.hypernorm-fonts/1') throw new Error('Schrift-Manifest unbekannt: ' + m.schema);
  const ok = await Promise.all(m.faces.map(f => { const d = {}; for (const k of ['style', 'weight', 'stretch', 'unicodeRange']) if (f[k]) d[k] = f[k];
    return new FontFace(f.family, `url(${f.file.url})`, d).load().then(x => { ablage().add(x); return 1; }).catch(() => 0); }));
  const geladen = ok.reduce((a, b) => a + b, 0);
  return { quelle: 'manifest', geladen, von: m.faces.length, familien: new Set(m.faces.map(f => f.family)).size, fehlen: geladen === m.faces.length ? [] : ['(' + (m.faces.length - geladen) + ' Schnitte nicht geladen)'], teilweise: [] };
}

// loadFonts() lokal · loadFonts(undefined, { manifest: SCHRIFT_MANIFEST }) vollständig
export async function loadFonts(base = new URL('./', import.meta.url).href, { manifest = null } = {}) {
  if (manifest) { try { const r = await ausManifest(manifest); if (r.geladen > 0) return r; } catch (e) { /* Rückfall lokal */ } }
  const ok = await Promise.all(FACES.map(([fam, file, d]) => new FontFace(fam, `url(${new URL(file, base).href})`, d).load().then(f => { ablage().add(f); return 1; }).catch(() => 0)));
  return { quelle: 'lokal', geladen: ok.reduce((a, b) => a + b, 0), von: FACES.length, fehlen: FEHLEN, teilweise: TEILWEISE };
}
