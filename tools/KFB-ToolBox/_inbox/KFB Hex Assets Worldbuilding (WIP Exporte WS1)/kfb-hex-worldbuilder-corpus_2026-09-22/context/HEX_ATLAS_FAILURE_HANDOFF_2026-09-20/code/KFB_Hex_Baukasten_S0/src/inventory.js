/* Bestand. Was liegt wirklich in den beiden Packs — und was im dritten.

   VERFAHREN, und warum es so aussieht.
   `github_get_tree` listet in diesem Repo keine .gltf/.glb (gilt als nicht importierbar).
   »0 gefunden« heißt dort also nicht »nicht da«. Die Pfadquelle ist deshalb der
   Registry-Shard. Dessen genaues Schema ist hier ABSICHTLICH nicht hartkodiert: `harvest()`
   läuft die JSON-Struktur durch und sammelt jede Zeichenkette, die wie ein Modellpfad unter
   dem Pack-Wurzelverzeichnis aussieht. Ändert das Registry sein Schema, bleibt das hier
   heil. Und nichts davon ist getippt — jeder Pfad stammt aus der Datei.

   DUBLETTEN. Die Packs liefern dasselbe Modell mehrfach (gltf, glb, fbx, obj). Behalten wird
   je Basisname genau EINE Datei, bevorzugt der glTF-Zweig: er trägt die Textur als separate
   Datei, und die Textur-Faltung im Loader lädt sie dann genau einmal für hunderte Teile. */
import { PACKS, REPO, REF, getJSON, note } from './sources.js';

const MODEL = /\.(gltf|glb)$/i;

export function harvest(json, root) {
  const out = new Set();
  const walk = (v) => {
    if (typeof v === 'string') {
      if (MODEL.test(v)) {
        const p = v.startsWith(root) ? v : (v.includes(root) ? v.slice(v.indexOf(root)) : null);
        if (p) out.add(p);
      }
      return;
    }
    if (Array.isArray(v)) { for (const x of v) walk(x); return; }
    if (v && typeof v === 'object') { for (const x of Object.values(v)) walk(x); }
  };
  walk(json);
  return [...out].sort();
}

export function dedupe(paths, prefer) {
  const by = new Map();
  for (const p of paths) {
    /* DOPPELTE Endungen abschneiden, nicht nur eine. Das Builder Pack liegt im Repo als
       `archeryrange.gltf.glb` — beim Entpacken wurde die Quellendung nicht ersetzt, sondern
       ergänzt. Eine einzelne Abschneidung lässt `.gltf` stehen, und ein Basisname mit Endung
       bricht jeden Namens-Lookup (`kit.byName`) und steht so auch in der Beschriftung. */
    const base = p.slice(p.lastIndexOf('/') + 1).replace(/(\.(gltf|glb|bin|fbx|obj))+$/i, '');
    const score = (p.includes(prefer) ? 4 : 0) + (/\.gltf$/i.test(p) ? 2 : 1);
    const cur = by.get(base);
    if (!cur || score > cur.score) by.set(base, { base, path: p, score });
  }
  return [...by.values()].sort((a, b) => a.base.localeCompare(b.base));
}

/* Familie = der Ordnerpfad UNTER dem Pack-Wurzelverzeichnis, ohne den Formatordner.
   Das ist keine erfundene Kategorie, sondern die Ordnung, die die Pack-Autoren gewählt
   haben — im Hexagon-Pack steht sie sogar im Promobild: »these can be found under
   assets/fileformat/decoration/nature«. */
export function familyOf(path, root) {
  const rel = path.slice(root.length);
  const parts = rel.split('/').slice(0, -1)
    .filter((s) => !/^(assets|gltf|glb|glTF|GLB|obj|fbx|models|Models|Assets)$/i.test(s));
  return parts.join('/') || '(wurzel)';
}

export async function readPack(key) {
  const cfg = PACKS[key];
  const t0 = performance.now();
  const json = await getJSON(cfg.shard);
  const all = harvest(json, cfg.root);
  const parts = dedupe(all, cfg.prefer).map((p) => ({ ...p, pack: key, family: familyOf(p.path, cfg.root) }));
  const families = new Map();
  for (const p of parts) families.set(p.family, (families.get(p.family) || 0) + 1);
  return {
    key, label: cfg.label, root: cfg.root, source: cfg.shard,
    raw: all.length, parts, ms: Math.round(performance.now() - t0),
    families: [...families.entries()].sort((a, b) => b[1] - a[1]),
  };
}

/* Das Quaternius-Pack hat keinen Registry-Eintrag — es ist jünger als der Registry-Lauf
   (sourceCommit 29aac10, 18.09. 20:43).

   ERSTER ANLAUF WAR FALSCH und steht hier, damit ihn niemand wiederholt: abgetastet wurde ein
   Namensraster nach Quaternius-Konvention (`Rock_1.gltf`, `Pebble_2.glb` …). Das kann nicht
   treffen. Die Teile sind einzeln über Poly Pizza geholt, und Poly Pizza hängt jedem Download
   eine Zufalls-ID an:

       Pebble Round by Quaternius - icVsN3lmVy.glb

   Leerzeichen, » by Quaternius «, ein Bindestrich, zehn Zeichen Zufall. Kein Raster der Welt
   rät das. Die einzige ehrliche Quelle für diese Namen ist das Verzeichnis selbst.

   ZWEITER ANLAUF, der hier läuft: das Verzeichnis wird über die GitHub-Contents-API gelesen.
   Öffentliches Repo, kein Token, CORS erlaubt, 60 Anfragen je Stunde und IP — für ein
   Verzeichnis pro Start reicht das mit Abstand. Damit ist die Dateiliste GELESEN, nicht
   geraten, und jedes weitere Teil, das Georg dazulegt, taucht beim nächsten Start von selbst
   auf. Fällt die API aus (Rate-Limit, offline), sagt der Bericht genau das — dann wird nichts
   gebaut, statt etwas zu erfinden. */
const API = `https://api.github.com/repos/${REPO}/contents/`;
const MODEL_EXT = /\.(gltf|glb)$/i;

/* Poly-Pizza-Name → sprechender Name. »Pebble Round by Quaternius - icVsN3lmVy« wird
   »Pebble Round«. Die ID bleibt als `id` erhalten, damit der Pfad rückverfolgbar ist. */
export function polyName(file) {
  const stem = file.replace(MODEL_EXT, '');
  const m = /^(.*?)\s+by\s+([^-]+?)\s*-\s*([A-Za-z0-9_-]{6,})$/.exec(stem);
  if (!m) return { base: stem, author: null, id: null };
  return { base: m[1].trim(), author: m[2].trim(), id: m[3] };
}

async function listDir(path, depth = 0) {
  const url = API + path.split('/').map(encodeURIComponent).join('/') + `?ref=${REF}`;
  const t0 = performance.now();
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!res.ok) { note('api:' + path, false, performance.now() - t0, { status: res.status }); throw new Error(`GitHub-API ${res.status}`); }
  const items = await res.json();
  note('api:' + path, true, performance.now() - t0, { entries: items.length });
  const files = items.filter((i) => i.type === 'file');
  const dirs = items.filter((i) => i.type === 'dir');
  let out = files.map((f) => ({ path: f.path, name: f.name, size: f.size }));
  if (depth > 0) for (const d of dirs) { try { out = out.concat(await listDir(d.path, depth - 1)); } catch (e) {} }
  return out;
}

export async function probeQuaternius() {
  const root = PACKS.quat.root;
  const report = { root, present: false, source: 'GitHub-Contents-API', parts: [], files: 0, note: '', markers: [] };
  let files;
  try {
    files = await listDir(root.replace(/\/$/, ''), 2);
  } catch (e) {
    report.note = `Verzeichnis nicht lesbar (${e.message}). Ohne gelesene Dateiliste wird nichts `
      + 'gebaut — die Poly-Pizza-Namen tragen eine Zufalls-ID und lassen sich nicht raten.';
    return report;
  }
  report.files = files.length;
  report.markers = files.filter((f) => /license|readme|preview/i.test(f.name)).map((f) => f.name);
  const models = files.filter((f) => MODEL_EXT.test(f.name));
  report.present = models.length > 0;
  report.parts = models.map((f) => {
    const n = polyName(f.name);
    return { base: n.base, id: n.id, author: n.author, path: f.path, pack: 'quat',
             family: 'quaternius/' + bucket(n.base), bytes: f.size };
  }).sort((a, b) => a.base.localeCompare(b.base));
  report.note = report.present
    ? `${report.parts.length} Modelle aus dem Verzeichnis gelesen (${files.length} Dateien gesamt).`
    : `Verzeichnis gelesen, aber kein .gltf/.glb darin (${files.length} Dateien).`;
  return report;
}

/* Grobordnung nach dem sprechenden Teil des Namens — Quaternius benennt eindeutig
   (»Rock«, »Pebble Round«, »Path Tile«), also braucht es keine Heuristik über Maße. */
function bucket(base) {
  const b = base.toLowerCase();
  if (/pebble/.test(b)) return 'pebbles';
  if (/path|tile/.test(b)) return 'paths';
  if (/rock|boulder|stone|cliff/.test(b)) return 'rocks';
  return 'sonstige';
}
