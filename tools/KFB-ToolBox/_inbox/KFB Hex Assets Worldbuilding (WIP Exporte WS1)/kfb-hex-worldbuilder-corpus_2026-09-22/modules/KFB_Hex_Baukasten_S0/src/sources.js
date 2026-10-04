/* Quellen. Eine Stelle, an der steht, wo etwas herkommt — und eine Stelle, die protokolliert,
   was tatsächlich geladen wurde.

   ZWEI REFS, ABSICHTLICH.
   Die Packs kommen ungepinnt von `main`, weil Georg sie gerade hochlädt und der Baukasten den
   Zuwachs sehen soll. Das Registry liegt ebenfalls auf main, ist aber ein GENERIERTES
   Inventar mit eigenem sourceCommit (29aac10, 18.09. 20:43) — was danach hochgeladen wurde,
   steht dort noch nicht drin. Deshalb ist das Registry hier die Pfadquelle für die zwei
   bekannten Packs und NICHT die Wahrheit über das dritte. Das dritte wird abgetastet. */

export const REPO = 'georg-doc/kayfabizarro';
export const REF = 'main';

const RAW = `https://raw.githubusercontent.com/${REPO}/${REF}/`;
const JSD = `https://cdn.jsdelivr.net/gh/${REPO}@${REF}/`;

/* raw liefert JS als text/plain — für Daten ist das egal, für Module nicht. Hier werden nur
   Daten und Binärdateien geholt, also raw. (Projektregel 2.) */
export const raw = (path) => RAW + path.split('/').map(encodeURIComponent).join('/');
export const jsd = (path) => JSD + path.split('/').map(encodeURIComponent).join('/');

export const PACKS = {
  hex: {
    id: 'hex',
    label: 'KayKit Medieval Hexagon Pack 1.0 FREE',
    root: 'media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/',
    shard: 'registry/assets/v1/packs/kaykit-medieval-hexagon-pack-1-0-free.json',
    prefer: '/gltf/',
  },
  builder: {
    id: 'builder',
    label: 'KayKit Medieval Builder Pack 1.0',
    root: 'media/3D_Assets/KayKit Medieval Builder Pack 1.0/',
    shard: 'registry/assets/v1/packs/kaykit-medieval-builder-pack-1-0.json',
    prefer: '/gltf/',
  },
  /* Kein Registry-Shard: das Pack ist jünger als der Registry-Lauf. Es wird abgetastet,
     nicht behauptet — siehe probeQuaternius(). */
  quat: {
    id: 'quat',
    label: 'Rocks + Pebbles + Path Tiles by Quaternius',
    root: 'media/3D_Assets/Rocks + Pebbles + Path Tiles by Quaternius/',
    shard: null,
    prefer: '/glTF/',
  },
};

export const loadLog = new Map();
export function note(key, ok, ms, extra) {
  loadLog.set(key, { ok, ms: Math.round(ms), ...extra });
}

export async function getJSON(path) {
  const t0 = performance.now();
  const res = await fetch(raw(path), { cache: 'force-cache' });
  if (!res.ok) { note(path, false, performance.now() - t0, { status: res.status }); throw new Error(`${res.status} ${path}`); }
  const json = await res.json();
  note(path, true, performance.now() - t0, { bytes: res.headers.get('content-length') });
  return json;
}

/* Existenzprobe. Kein HEAD: raw.githubusercontent antwortet auf HEAD nicht verlässlich mit
   404, und ein Range-GET von einem Byte kostet praktisch nichts. */
export async function exists(path) {
  const t0 = performance.now();
  try {
    const res = await fetch(raw(path), { headers: { Range: 'bytes=0-0' }, cache: 'no-store' });
    const ok = res.status === 200 || res.status === 206;
    note(path, ok, performance.now() - t0, { status: res.status });
    return ok;
  } catch (e) {
    note(path, false, performance.now() - t0, { error: e.message });
    return false;
  }
}
