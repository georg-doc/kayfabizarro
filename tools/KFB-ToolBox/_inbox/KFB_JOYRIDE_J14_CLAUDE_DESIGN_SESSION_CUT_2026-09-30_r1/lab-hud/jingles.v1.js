// KFB Cologne Race · Option C-3 · Jingles — wörtlich aus lab-v9/cologne-gates.v1.js (KFB-Stunt-Car-Race main, 29.09.),
// ohne die Tor-Geometrie davor (die braucht option-c-style und gehört dem Cologne-Rennen). Nichts geändert.
export const JINGLE_PIN = '7eebc7cad1488f2c2bf37328e86cd088834f9fa9';
const JDIR = 'media/3D_Assets/Audio/kenney_music-jingles/Audio/';
export const JINGLE_FAMILIES = [
  { dir: '8-Bit jingles', tag: 'RETRO' },
  { dir: 'Hit jingles', tag: 'HIT' },
  { dir: 'Pizzicato jingles', tag: 'PIZZI' },
  { dir: 'Sax jingles', tag: 'SAX' },
  { dir: 'Steel jingles', tag: 'STEEL' }
];

const jrawUrl = (dir, file) =>
  'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + JINGLE_PIN + '/' +
  (JDIR + dir + '/' + file).split('/').map(encodeURIComponent).join('/');

export function createJingles(opts = {}) {
  const pool = [];
  for (const f of JINGLE_FAMILIES) {
    for (let i = 0; i < 17; i++) {
      pool.push({ family: f.tag, dir: f.dir, file: 'jingles_' + f.tag + String(i).padStart(2, '0') + '.ogg' });
    }
  }
  const reward = { family: 'STEEL', dir: 'Steel jingles', file: 'jingles_STEEL00.ogg' };
  const cache = new Map();
  let level = opts.level ?? 0.55;
  const played = [];

  const play = (pick) => {
    try {
      const url = jrawUrl(pick.dir, pick.file);
      let a = cache.get(url);
      if (!a) { a = new Audio(url); a.crossOrigin = 'anonymous'; a.preload = 'auto'; cache.set(url, a); }
      a.volume = level;
      a.currentTime = 0;
      a.play().catch(() => {});
      played.push(pick.family + '/' + pick.file);
      if (played.length > 12) played.shift();
    } catch (e) { /* Klang ist Beiwerk */ }
  };

  return {
    pin: JINGLE_PIN, poolSize: pool.length, families: JINGLE_FAMILIES.map(f => f.tag),
    setLevel(v) { level = Math.max(0, Math.min(1, v)); },
    checkpoint() { play(pool[Math.floor(Math.random() * pool.length)]); },
    finish() { play(reward); },
    recent() { return played.slice(-6); }
  };
}
