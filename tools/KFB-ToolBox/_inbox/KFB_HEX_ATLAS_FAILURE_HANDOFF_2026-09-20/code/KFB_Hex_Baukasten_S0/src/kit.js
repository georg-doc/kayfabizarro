/* Der Baukasten. Ein Loader, ein Cache, eine Messung, eine Rollenzuordnung.

   Der Unterschied zwischen »Bestand« und »Baukasten«: der Bestand sagt, welche Dateien es
   gibt. Der Baukasten sagt, was ein Teil TUT und woran man es erkennt. Beides hier getrennt,
   weil nur das zweite eine Entscheidung ist — und Entscheidungen müssen begründbar sein.

   Alle Maße werden zur Laufzeit gemessen. Die einzigen Zahlen, die aus einer fremden Quelle
   kommen, sind die Kanten-Tabellen aus hexrealm/lib/hex-grid.js; die wurden dort im dritten
   Anlauf gegen Geometrie belegt und werden hier NICHT nachgebaut (Projektregel 4). */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { raw, note } from './sources.js';

THREE.Cache.enabled = true;

/* Textur-Faltung: jede .gltf verweist RELATIV auf `hexagons_medieval.png`, also löst
   `tiles/base/…` eine andere URL auf als `buildings/blue/…` — dieselbe Datei, zwölf
   Downloads. Schlüssel ist Pack-Ordner + Dateiname, nicht der Dateiname allein. */
export const folds = { seen: 0, unique: 0 };
const aliases = new Map();
const manager = new THREE.LoadingManager();
manager.setURLModifier((url) => {
  const m = /\/media\/3D_Assets\/([^/]+)\/(?:.*\/)?([^/?#]+\.(?:png|jpe?g|webp|ktx2))(?:[?#].*)?$/i.exec(url);
  if (!m) return url;
  const key = m[1] + '|' + m[2];
  folds.seen++;
  if (!aliases.has(key)) { aliases.set(key, url); folds.unique++; }
  return aliases.get(key);
});

const loader = new GLTFLoader(manager);
const cache = new Map();
export const measured = new Map();

export async function load(part) {
  if (cache.has(part.path)) return cache.get(part.path);
  const t0 = performance.now();
  const p = loader.loadAsync(raw(part.path)).then((g) => {
    const scene = g.scene;
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    let tris = 0;
    scene.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true; o.receiveShadow = true;
      const geo = o.geometry;
      tris += (geo.index ? geo.index.count : geo.attributes.position.count) / 3;
    });
    measured.set(part.path, {
      ...part,
      size: [+size.x.toFixed(3), +size.y.toFixed(3), +size.z.toFixed(3)],
      min: box.min.toArray().map((v) => +v.toFixed(3)),
      max: box.max.toArray().map((v) => +v.toFixed(3)),
      tris: Math.round(tris),
      foot: +Math.max(size.x, size.z).toFixed(3),
    });
    note(part.path, true, performance.now() - t0, {});
    return scene;
  }).catch((e) => { note(part.path, false, performance.now() - t0, { error: e.message }); throw e; });
  cache.set(part.path, p);
  return p;
}

export async function instance(part) {
  const src = await load(part);
  const node = src.clone(true);
  node.userData.part = part;
  return node;
}

/* Warmlauf: erst EIN Teil allein, damit die Pack-Textur im Browser-Cache liegt, dann in
   kleinen Bündeln. Hundert gleichzeitige Anfragen auf dieselbe Atlas-Textur werden
   gedrosselt — und gedrosselte Teile rendern schwarz. (Befund aus S11.) */
export async function warm(parts, onStep, batch = 12) {
  if (!parts.length) return [];
  const ok = [], fail = [];
  try { await load(parts[0]); ok.push(parts[0]); } catch (e) { fail.push(parts[0]); }
  onStep?.(1, parts.length);
  for (let i = 1; i < parts.length; i += batch) {
    const slice = parts.slice(i, i + batch);
    await Promise.all(slice.map(async (p) => { try { await load(p); ok.push(p); } catch (e) { fail.push(p); } }));
    onStep?.(Math.min(i + batch, parts.length), parts.length);
  }
  return { ok, fail };
}

/* ── Rollen ───────────────────────────────────────────────────────────────────────────────
   Sieben Rollen, mehr braucht der Baukasten nicht. Jede beantwortet eine Bau-Frage:

     module    Was ist der Boden?           Volles Sechseck, Deckfläche bei y=0.
     padding   Wie überbrücke ich Höhe?     Teilsechseck mit Felsrand (Promobild: »use as
                                            padding between height gaps«).
     water     Wo ist kein Boden?           Wasser-/Ufer-Kacheln, nicht begehbar.
     landmark  Was sieht man von weitem?    Gebäude, Türme, Mühlen.
     nature    Was macht die Fläche voll?   Bäume, Büsche, Felsen.
     prop      Was erzählt am Boden?        Zäune, Brücken, Kleinkram.
     unknown   Alles, was keine Regel trifft — bleibt sichtbar, statt still zu verschwinden. */
export const ROLES = ['module', 'padding', 'water', 'pathtile', 'landmark', 'nature', 'prop', 'unknown'];

export function assignRole(rec, ref) {
  const f = (rec.family || '').toLowerCase();
  const b = (rec.base || '').toLowerCase();

  /* Quaternius zuerst, und zwar am NAMEN, nicht am Maß. »Rock Path Square Smal« enthält
     beides — Fels und Pfad — und würde von der allgemeinen Regel als Fels einsortiert. Es ist
     aber eine Pfadkachel: flach, quadratisch, gehört auf die Lauffläche. Wer die Reihenfolge
     hier dreht, streut Wege als Findlinge über die Wiese. */
  if (f.startsWith('quaternius/')) {
    if (f.endsWith('/paths')) return 'pathtile';
    return 'nature';
  }

  /* DIE FAMILIE ENTSCHEIDET VOR DEM MASS — und das ist keine Stilfrage, sondern ein
     behobener Fehler. Die erste Fassung fragte zuerst »ist der Grundriss ein Sechseck?«.
     Im Hexagon-Pack sitzt aber JEDES Gebäude auf einem Hex-Sockel, damit es auf eine Kachel
     passt. Also maßen Burgen, Türme und Mühlen 2,0 × 2,31 und wurden zu Bodenkacheln. Der
     erste Belegbogen zeigte es sofort: acht Burgen als Fußboden. Das Maß darf erst
     entscheiden, wenn die Ordnung des Packs nichts sagt. */
  if (f.startsWith('buildings')) return 'landmark';
  if (f.includes('nature')) return 'nature';
  if (f.includes('prop')) return 'prop';
  if (f.startsWith('tiles')) {
    if (/water|coast|river|lake|ocean/.test(b) && !/waterless/.test(f + b)) return 'water';
    /* Teilsechseck: gleiche Bauhöhe, deutlich kleinerer Grundriss. Genau das Teil aus dem
       Promobild, das Höhensprünge abfängt. Ohne Messung nicht entscheidbar — dann bleibt es
       vorerst Modul und wird nach dem Vermessen erneut eingestuft. */
    /* Teilsechseck: kleinerer Grundriss UND dieselbe Sechseckform. `hex_coast_D_waterless`
       ist 1 × 1,732 — kleiner, ja, aber das Seitenverhältnis 1,73 statt 1,15 verrät die
       halbe Uferkachel. Als Padding gesetzt wäre sie genau das »etwas Falsches«, das der
       Bericht ausschließen soll. */
    if (ref && rec.foot && rec.foot < ref.W * 0.88 && rec.foot > ref.W * 0.35
        && Math.abs(rec.size[2] / Math.max(0.001, rec.size[0]) - ref.H / ref.W) < 0.1) return 'padding';
    return 'module';
  }

  /* Ab hier sagt die Ordnung des Packs nichts mehr — erst jetzt zählen Name und Maß. */
  if (/water|coast|river|lake|ocean/.test(b) && !/waterless/.test(b)) return 'water';
  if (/castle|tower|house|windmill|church|keep|barrack|market/.test(b)) return 'landmark';
  if (/tree|pine|bush|rock|stone|boulder|cliff|pebble/.test(b)) return 'nature';
  if (/fence|bridge|sign|cart|barrel|crate|wall/.test(b)) return 'prop';
  if (ref && rec.size && Math.abs(rec.size[0] - ref.W) < ref.W * 0.12 && Math.abs(rec.size[2] - ref.H) < ref.H * 0.12) {
    return rec.foot < ref.W * 0.88 ? 'padding' : 'module';
  }
  return 'unknown';
}

/* ── Die Felsklassen ──────────────────────────────────────────────────────────────────────
   Georgs Vorgabe: drei Klassen, konsistent und kombiniert. Die Frage ist, WOHER die Grenzen
   kommen.

   DREI RUNDEN LANG KAMEN SIE AUS MEINEM KOPF, und dreimal waren sie falsch:
     1 · Höhe ≥ 1,2 / 0,35 Stufen   → A=0, B=0, C=13. Die Steinfamilie heißt im Pack nicht »rock«.
     2 · Grundfläche ≥ 0,8 Kacheln  → B übervoll mit tilegroßen Hügeln, der Rand unter Bergen.
     3 · Grundfläche ≥ 0,55         → B leer, weil zwischen 0,5 und 1,11 nichts existiert.
   Jede Runde eine andere Zahl, jede Runde kaputt. Eine Schwelle, die den Bestand nicht kennt,
   kann ihn nicht teilen.

   JETZT KOMMEN SIE AUS DEM BESTAND. `deriveRockClasses()` sortiert die gemessenen
   Grundflächen und sucht die ECHTEN LÜCKEN: eine Trennstelle ist ein Sprung um mindestens
   den Faktor 2. Was dabei herauskommt, kommt heraus — hat der Bestand nur ZWEI Populationen,
   heißt das Ergebnis »zwei Populationen«, nicht »drei Klassen, eine davon leer, Regel
   trotzdem im README«. Die Rollen hängen an den gefundenen Gruppen, größte zuerst:

     A · FORMATION   tilegroß — Kachelmitte, ungedreht, einer je Plattform, höchste Terrasse.
     B · CLUSTER     mittel — auf Außenkanten und Höhensprüngen, Gruppen von 2–4, nie einzeln.
     C · SCATTER     klein — Streu auf offener Fläche, nie im Laufweg.

   Kombinationsregel: wo ein A steht, stehen zwei bis drei B am Fuß und C dazwischen. Wo nur
   B steht, steht C dazwischen. C allein nur auf reiner Wiese. Fehlt eine Gruppe, wird ihre
   Regel als INAKTIV gemeldet statt als Bauregel beworben. */
export const ROCK_ROLES = [
  { id: 'A', label: 'Formation', rule: 'Kachelmitte, ungedreht, einer je Plattform, höchste Terrasse' },
  { id: 'B', label: 'Cluster', rule: 'Gruppen 2–4 auf Außenkante / Höhensprung, nie einzeln' },
  { id: 'C', label: 'Scatter', rule: 'Streu auf offener Fläche, nie im Laufweg' },
];

export function deriveRockClasses(recs, opts = {}) {
  const BREAK = opts.breakRatio ?? 2.0;
  const list = recs.filter((r) => r.size && r.foot > 0).sort((a, b) => a.foot - b.foot);
  for (const r of list) r.rock = null;
  if (!list.length) return { bands: [], populations: 0, breakRatio: BREAK, cuts: [] };

  /* Trennstellen: jeder Sprung um Faktor ≥ BREAK zwischen zwei aufeinanderfolgenden Maßen. */
  const cuts = [];
  for (let i = 1; i < list.length; i++) {
    const ratio = list[i].foot / Math.max(0.0001, list[i - 1].foot);
    if (ratio >= BREAK) cuts.push({ at: i, ratio: +ratio.toFixed(2), lo: +list[i - 1].foot.toFixed(2), hi: +list[i].foot.toFixed(2) });
  }
  /* Mehr als zwei Trennstellen: die zwei deutlichsten gewinnen, sonst gibt es mehr Gruppen
     als Rollen. Weniger: dann gibt es eben weniger Gruppen. */
  const use = [...cuts].sort((a, b) => b.ratio - a.ratio).slice(0, 2).sort((a, b) => a.at - b.at);
  const bounds = [0, ...use.map((c) => c.at), list.length];
  const groups = [];
  for (let i = 0; i < bounds.length - 1; i++) {
    const part = list.slice(bounds[i], bounds[i + 1]);
    if (part.length) groups.push(part);
  }
  groups.reverse();                                  // größte Gruppe zuerst → Rolle A

  const bands = groups.map((part, i) => {
    for (const r of part) r.rock = ROCK_ROLES[i].id;
    return { ...ROCK_ROLES[i], count: part.length,
             min: +part[0].foot.toFixed(2), max: +part[part.length - 1].foot.toFixed(2) };
  });
  /* Nicht besetzte Rollen bleiben als Zeile stehen, mit count 0 — eine Regel, die nicht
     laufen kann, muss man sehen können. */
  for (let i = groups.length; i < ROCK_ROLES.length; i++) bands.push({ ...ROCK_ROLES[i], count: 0, min: null, max: null });
  return { bands, populations: groups.length, breakRatio: BREAK, cuts };
}

/* Biom = der Kachelsatz, der zusammengehört.
   Das Builder Pack liefert `hex_forest`, `hex_forest_detail`, `hex_forest_transitionA`,
   `hex_sand`, `hex_grass` … Wer daraus je Zelle zufällig würfelt, bekommt Flickwerk: eine
   Plattform aus Wald, Sand und Wiese nebeneinander. Eine Plattform hat EIN Bodenbiom, mit
   seinen eigenen Varianten als Abwechslung. */
const BIOME_TAIL = /^(detail|transition|variant|alt|piece|tile)?[A-Za-z]?\d*$/;
export function biomeOf(base) {
  const t = base.split('_');
  while (t.length > 1 && BIOME_TAIL.test(t[t.length - 1])) t.pop();
  return t.join('_') || base;
}

/* Die Steinfamilie heißt im Pack nicht »rock«.
   Erste Fassung suchte nach rock|stone|boulder|pebble|cliff und fand genau zwei Sorten:
   `rock_single_A…E` (0,07–0,20 hoch) und die dreizehn Quaternius-Kiesel (0,10–0,17). Alles
   unter 0,35 Stufen, also dreizehn Mal Klasse C und kein einziges A oder B — das
   Dreiklassensystem stand auf dem Papier und passierte nie.

   Die Teile, die A und B besetzen, heißen `mountain_*` (1,43–2,51) und `hills_*` /
   `hill_single_*` (0,31–0,79). Genau die zeigt das Promobild unter »create rocky
   landscapes«. Der Filter kennt sie jetzt. */
export function isRockish(rec) {
  /* Eine Pfadkachel ist kein Fels, auch wenn »Rock« im Namen steht. */
  if (rec.role === 'pathtile' || /path/i.test(rec.family || '')) return false;
  if (!rec.size) return false;                      // ungemessen lässt sich nicht einstufen
  return /rock|stone|boulder|pebble|cliff|crag|mountain|hill/i.test(rec.base)
      || /rock|pebble/i.test(rec.family || '');
}

/* Deckkacheln — der Satz, auf dem man STEHT.
   Nicht jede Kachel mit Rolle `module` taugt dafür. Das Pack liefert zur selben Grundfläche
   auch Unterseiten-Kappen (`*_bottom`) und Schrägen (`*_sloped_high/low`). Die erste Fassung
   zog aus allen `module` zufällig — im Belegbogen hatten mehrere Hexe eine abgeschrägte
   Oberseite statt einer ebenen. Derselbe Fehlertyp wie »falsche Teilewahl am Rand« in Gate A.
   Deckkacheln sind deshalb eine bewusste Auswahl, kein Rest. */
const NOT_DECK = /(_bottom|_sloped|_slope|_ramp|_cap|_under|_side|_corner|_edge|_wall)/i;
/* Auch ohne Wasseroberfläche ist eine Fluss- oder Uferkachel keine Deckkachel: sie trägt
   eine eingeschnittene Rinne. Straßen kommen aus Bauschritt 5, Berge und Hügel sind Felsen.
   Alles davon hat die richtige Grundfläche und die falsche Oberseite. */
const NOT_GROUND = /(water|river|coast|lake|ocean|road|bridge|cliff|mountain|hill)/i;
export function isDeckTile(rec) {
  return rec.role === 'module' && !NOT_DECK.test(rec.base) && !NOT_GROUND.test(rec.base);
}

/* ── Modulmaß ─────────────────────────────────────────────────────────────────────────────
   Referenz ist die meistvertretene Grundfläche unter den Kachel-Teilen, nicht ein von Hand
   gewähltes Teil. Wird ein Pack nachgeliefert, verschiebt sich die Referenz automatisch mit
   und der Bericht zeigt es. */
export function moduleMetrics(all) {
  const tileRecs = all.filter((r) => r && r.size);
  if (!tileRecs.length) return null;
  const key = (r) => `${r.size[0].toFixed(2)}x${r.size[2].toFixed(2)}`;
  const tally = new Map();
  for (const r of tileRecs) tally.set(key(r), (tally.get(key(r)) || 0) + 1);
  const [best, count] = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];
  const sample = tileRecs.filter((r) => key(r) === best);
  const W = sample[0].size[0], H = sample[0].size[2];
  /* Bauhöhe = Medianhöhe der Referenzkacheln. Die Deckfläche liegt bei y=0, der Körper hängt
     darunter (S11-Befund) — eine Terrassenstufe ist also genau diese Körperhöhe. */
  const heights = sample.map((r) => r.size[1]).sort((a, b) => a - b);
  const step = heights[heights.length >> 1];
  return {
    W: +W.toFixed(3), H: +H.toFixed(3), step: +step.toFixed(3),
    inradius: +(W / 2).toFixed(3), circumradius: +(H / 2).toFixed(3),
    orientation: H > W ? 'pointy-top' : 'flat-top',
    sample: sample.length, of: tileRecs.length, agreement: +(count / tileRecs.length).toFixed(2),
  };
}
