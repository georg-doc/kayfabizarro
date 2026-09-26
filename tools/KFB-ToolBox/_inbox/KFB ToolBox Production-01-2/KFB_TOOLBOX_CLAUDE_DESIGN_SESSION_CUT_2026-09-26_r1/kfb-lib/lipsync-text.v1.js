/* lipsync-text.v1.js — Text → Mundbild-Spur über ALLE 13 Decals von pet-mouth.v1 (2026-09-26).
 * Die Decals sind der Adobe-Character-Animator-Satz (Neutral · Smile · M · D · S · Ee · Uh · Ah ·
 * Oh · R · F · W-oo · L). talk() in pet-mouth ist der Zufalls-Shuffle (Silbentakt, kein Lip-Sync);
 * diese Datei liefert die gezielte Spur: Buchstabe/Laut → Decal, mit Dauer. Deutsch zuerst,
 * Englisch als Umschalter. Reiner Rechenweg, keine Szene — derselbe Track kann später aus einer
 * Audio-Phonem-Liste kommen (Rhubarb/Papagayo-Formate haben dieselben Namen).
 * Rückgabe: [{ key, ms, ch }] · key = pet-mouth-Schlüssel. */
export const SCHEMA = 'kfb.lipsync-track/0.1';
export const SHAPES = ['neutral', 'smile', 'm', 'd', 's', 'ee', 'uh', 'ah', 'oh', 'r', 'f', 'woo', 'l'];
export const LABELS = { neutral: 'Neutral', smile: 'Smile', m: 'M·B·P', d: 'D·T·N·K', s: 'S·Z·Sch', ee: 'Ee·I', uh: 'Uh', ah: 'Ah', oh: 'Oh', r: 'R', f: 'F·V', woo: 'W-oo·U', l: 'L' };
const MULTI = { de: [['tsch', ['s']], ['sch', ['s']], ['ch', ['s']], ['ck', ['d']], ['ng', ['d']], ['qu', ['d', 'f']], ['ph', ['f']], ['th', ['d']], ['ei', ['ah', 'ee']], ['ai', ['ah', 'ee']], ['au', ['ah', 'woo']], ['eu', ['oh', 'ee']], ['äu', ['oh', 'ee']], ['ie', ['ee']], ['ee', ['ee']], ['oo', ['oh']]],
  en: [['sh', ['s']], ['ch', ['s']], ['th', ['d']], ['ph', ['f']], ['ck', ['d']], ['ng', ['d']], ['qu', ['d', 'woo']], ['oo', ['woo']], ['ou', ['ah', 'woo']], ['ow', ['ah', 'woo']], ['ee', ['ee']], ['ea', ['ee']], ['ai', ['ee']], ['ay', ['ee']], ['oi', ['oh', 'ee']], ['oy', ['oh', 'ee']]] };
const ONE = { a: 'ah', e: 'ee', i: 'ee', o: 'oh', u: 'woo', ä: 'ee', ö: 'oh', ü: 'woo', y: 'ee', m: 'm', b: 'm', p: 'm', f: 'f', v: 'f', w: 'f', l: 'l', r: 'r', s: 's', z: 's', c: 's', x: 's', ß: 's', j: 'd', d: 'd', t: 'd', n: 'd', k: 'd', g: 'd', q: 'd', h: 'uh' };
const EN = { u: 'uh', w: 'woo', j: 's', i: 'ah', y: 'ee' };
const VOW = new Set(['ah', 'ee', 'oh', 'woo', 'uh']);
export function textToTrack(text, o = {}) {
  const lang = o.lang === 'en' ? 'en' : 'de', rate = Math.max(0.2, o.rate || 1), t = String(text || '').toLowerCase(), out = [];
  const push = (key, ms, ch) => { const last = out[out.length - 1]; if (last && last.key === key) { last.ms += ms * 0.5; last.ch += ch; } else out.push({ key, ms, ch }); };
  for (let i = 0; i < t.length;) {
    const c = t[i];
    if (/[.!?]/.test(c)) { push('neutral', 380, c); i++; continue; }
    if (/[,;:\-–—]/.test(c)) { push('neutral', 220, c); i++; continue; }
    if (/\s/.test(c)) { push('neutral', 70, ' '); i++; continue; }
    const mm = MULTI[lang].find(([k]) => t.startsWith(k, i));
    if (mm) { mm[1].forEach((k, j) => push(k, VOW.has(k) ? 130 : 80, j ? '' : mm[0])); i += mm[0].length; continue; }
    const k = (lang === 'en' && EN[c]) || ONE[c];
    if (k) { if (c === 'h' && (i === 0 || /\s/.test(t[i - 1]))) push('uh', 60, c); else if (c !== 'h') push(k, VOW.has(k) ? 130 : (k === 'm' || k === 'f' ? 95 : 75), c); }
    i++;
  }
  push('neutral', 260, '');
  out.forEach((x) => { x.ms = Math.round(x.ms / rate); });
  return out;
}
/** Welche der 13 Formen eine Spur benutzt — für die Abdeckungszeile. */
export function coverage(track) { const u = new Set(track.map((x) => x.key)); return { used: SHAPES.filter((k) => u.has(k)), missing: SHAPES.filter((k) => !u.has(k)) }; }
/** Testsatz, der alle 13 Formen trifft (Smile kommt als Ausdruck davor/danach). */
export const PANGRAM = { de: 'Hallo! Ich bin FrizzleBob — willkommen im Kayfabizarro, Leute.', en: 'Well, hello! I am FrizzleBob, welcome to Kayfabizarro, you lovely people.' };
