/* KFB Plant Prop Lab · PlantRecipe, Generator-Grammatik, Bau
   Ein Pflanzen-Prop ist hier KEIN verschmolzenes GLB, sondern ein kleines Szenen-Rezept über
   unveränderten GitHub-Quellen (MENTAL_MODEL §1). Dieses Modul hält drei Dinge auseinander:

     Grammatik  generate(inputs)  →  PlantRecipe        (deterministisch aus Seed)
     Bau        buildProp(recipe) →  Gruppe + Bericht   (messend, nie ratend)
     Vertrag    serialize/parse   →  JSON-Rundlauf      (Reproduzieren statt Screenshot)

   Gemessen wird beim Bau: Untersetzer-Innenboden, Topfkante, Erdhöhe, Kronenbox. Die
   Einsetztiefe kommt aus dem getopften Zwilling des Packs (plant-inventory INSERT_REFERENCE),
   nicht aus dem Gefühl. */
import * as THREE from 'three';
import { instance, measure } from './kit-lab.js';
import * as INV from './plant-inventory.js';
import { stylePot, defaultStyle, PALETTE_NAMES, FAMILY_NAMES } from './plant-pattern.js';

export const SCHEMA = 'kfb.plant-prop.recipe/0.1-candidate';

/* mulberry32 — gleicher Seed, gleiche Komposition. Kein Math.random in der Grammatik. */
export function rng(seed) {
  let a = (seed >>> 0) || 1;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pickOf = (r, arr) => arr[Math.floor(r() * arr.length) % arr.length];

export const PRESETS = {
  A: { id: 'A', label: 'A · NORMAL', note: 'Tiny-Treats-Topf + konventionelle Tiny-Treats-Pflanze',
       inputs: { potFamily: 'A', size: 'large', plantFamily: 'monstera', plantCount: 1, alien: false, scaleClass: 'TABLETOP', style: { family: 'plain', paletteId: 'terracotta', rim: false, accent: 0 }, living: 'STATIC' } },
  B: { id: 'B', label: 'B · ALIEN', note: 'Tiny-Treats-Topf + Quaternius-Spender',
       inputs: { potFamily: 'C', size: 'large', alien: true, alienFamily: 'Tree_Spiral', plantCount: 1, scaleClass: 'TABLETOP', style: { family: 'diamonds', paletteId: 'talavera', density: 7, accent: 0.3, outline: 0.6 }, living: 'AMBIENT' } },
  C: { id: 'C', label: 'C · MISCHGRUPPE', note: '2–5 Töpfe, gemischte Größen, ein Alien-Akzent',
       inputs: { cluster: true, potCount: 4, plantCount: 1, scaleClass: 'TABLETOP', style: { family: 'bands', paletteId: 'chili' }, living: 'AMBIENT' } },
  D: { id: 'D', label: 'D · CRAZY-CAT-LANDMARKE', note: 'Riesentopf + gewöhnliche Hauspflanze als Landmarke',
       inputs: { potFamily: 'B', size: 'large', plantFamily: 'monstera', plantCount: 1, scaleClass: 'LANDMARK', style: { family: 'zigzag', paletteId: 'clay', bands: 6, accent: 0.5 }, living: 'AMBIENT' } },
  E: { id: 'E', label: 'E · LEBENDE PFLANZE', note: 'gültige Komposition + bestehender KFB EyeRig v6',
       inputs: { potFamily: 'D', size: 'large', plantFamily: 'zzplant', plantCount: 1, scaleClass: 'ROOM', style: { family: 'dots', paletteId: 'jade', density: 8, accent: 0.25, outline: 0.6 }, living: 'AWARE', eyePlacement: 'pot' } }
};
export const PRESET_NAMES = Object.keys(PRESETS);

const SRC = (pack, name) => ({
  repo: INV.PACK[pack].repo, path: INV.PACK[pack].path + name + '.gltf',
  revision: 'main', asset: `${INV.PACK[pack].pack}:${name}`
});

/* ---------------------------- Grammatik ---------------------------- */
export function generate(inputs = {}) {
  const seed = inputs.seed ?? Math.floor(Math.random() * 100000);
  const r = rng(seed);
  const I = Object.assign({}, inputs);
  const scaleClass = I.scaleClass || 'TABLETOP';
  const potCount = I.cluster ? Math.max(2, Math.min(5, I.potCount || (2 + Math.floor(r() * 4)))) : 1;

  const containers = [];
  for (let i = 0; i < potCount; i++) {
    const fam = I.cluster ? pickOf(r, INV.POT_FAMILIES) : (I.potFamily || pickOf(r, INV.POT_FAMILIES));
    const size = I.cluster ? pickOf(r, ['small', 'medium', 'large']) : (I.size || 'large');
    /* Ein Alien-Akzent in der Gruppe: der letzte Topf, sonst wie gewünscht. */
    const alien = I.cluster ? (i === potCount - 1) : !!I.alien;
    const count = Math.max(1, Math.min(5, I.plantCount || 1));
    const plants = [];
    for (let j = 0; j < count; j++) {
      if (alien) {
        const af = I.alienFamily || pickOf(r, Object.keys(INV.ALIEN_FAMILIES));
        const v = pickOf(r, INV.ALIEN_FAMILIES[af].variants);
        plants.push({ kind: 'alien', name: INV.alienName(af, v), family: af, src: SRC('qu', INV.alienName(af, v)) });
      } else {
        const pf = I.plantFamily || pickOf(r, ['monstera', 'pothos', 'sansevieria', 'yucca', 'zzplant']);
        const F = INV.PLANT_FAMILIES[pf];
        const ps = F.sizes.includes(size) ? size : pickOf(r, F.sizes);
        plants.push({ kind: 'tt', name: F.name(ps), family: pf, src: SRC('tt', F.name(ps)) });
      }
    }
    const pot = INV.potName(fam, size);
    const withSaucer = I.saucer != null ? !!I.saucer : r() > 0.35;
    const sc = INV.saucerName(fam, size);
    /* Gruppe: Töpfe auf einem Ring mit Rauschen, Radius aus den gemessenen Topfbreiten. */
    const ang = potCount === 1 ? 0 : (i / potCount) * Math.PI * 2 + r() * 0.5;
    const ringR = potCount === 1 ? 0 : 0.85 + 0.55 * r();
    containers.push({
      pot: { family: fam, size, name: pot, src: SRC('tt', pot) },
      saucer: withSaucer ? { name: sc, src: SRC('tt', sc) } : null,
      offset: potCount === 1 ? [0, 0] : [+(Math.cos(ang) * ringR).toFixed(3), +(Math.sin(ang) * ringR).toFixed(3)],
      rotation: +(r() * 360).toFixed(1),
      insertDepth: I.insertDepth ?? INV.INSERT_REFERENCE.depthFraction,
      plants
    });
  }

  const style = Object.assign(defaultStyle(), {
    paletteId: pickOf(r, PALETTE_NAMES), family: pickOf(r, FAMILY_NAMES.filter((f) => f !== 'plain')),
    /* Cartoon-Massstab: wenige grosse Formen. Die Obergrenzen stehen in plant-pattern
       (CELL_LIMITS) und werden dort noch einmal gedeckelt — hier bleibt der Zufall schon
       innerhalb des Rahmens, damit das Rezept liest, was gebaut wird. */
    density: 4 + Math.floor(r() * 9), bands: 2 + Math.floor(r() * 5),
    phase: +(r()).toFixed(3), accent: +(r() * 0.45).toFixed(2),
    outline: +(0.35 + r() * 0.4).toFixed(2), soil: true,
    rim: r() > 0.4, seed
  }, I.style || {});

  return {
    schema: SCHEMA,
    id: `${(I.preset || 'gen').toLowerCase()}-${style.family}-${seed}`,
    seed, preset: I.preset || null, label: I.label || null,
    scaleClass, scale: I.scale ?? INV.SCALE_CLASSES[scaleClass].s,
    containers, style,
    rig: { level: I.living || 'AMBIENT', sway: I.sway ?? 0.5, wind: I.wind ?? [0.25, 0], pulse: I.pulse ?? 0.25 },
    living: (I.living === 'AWARE') ? { level: 'AWARE', eyeRig: 'pet-eye-rig.v6', placement: I.eyePlacement || 'crown' } : null,
    slots: { potRoot: {}, soilAnchor: 'gemessen beim Bau', plantRoots: [], eyeAnchor: (I.living === 'AWARE') ? (I.eyePlacement || 'crown') : null },
    consumers: ['Travel/TinySkies', 'OSM Ehrenfeld/Hürth', 'Platformer Project Island', 'World Atlas', 'Dungeon Room', 'Game Dev Studio'],
    placement: { note: 'Konsument setzt PlantPropRoot. Support/Kollision gehören dem Konsumenten.' }
  };
}

export const serialize = (recipe) => JSON.stringify(recipe, null, 2);
export function parse(text) {
  const j = typeof text === 'string' ? JSON.parse(text) : text;
  if (!j || j.schema !== SCHEMA) throw new Error('kein ' + SCHEMA);
  return j;
}

/* ------------------------ Messung am Behälter ------------------------
   Der Innenboden eines Topfes ist Rückseite. Ein Strahl von oben trifft ihn nur, wenn die
   Materialien für die Messung zweiseitig stehen — sonst fällt er durch den Topf und der Bau
   würde die Pflanze auf die Bühne setzen. Also: Seiten für die Dauer der Messung umstellen,
   danach zurück. Gemeldet wird, welcher Weg gegriffen hat. */
export function probeContainer(node) {
  node.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(node);
  const size = box.getSize(new THREE.Vector3());
  const c = box.getCenter(new THREE.Vector3());
  const sides = [];
  node.traverse((o) => { if (o.isMesh) for (const m of [].concat(o.material).filter(Boolean)) { sides.push([m, m.side]); m.side = THREE.DoubleSide; } });
  const ray = new THREE.Raycaster();
  const down = new THREE.Vector3(0, -1, 0);
  const hitY = (x, z, pickLast) => {
    ray.set(new THREE.Vector3(x, box.max.y + size.y * 2 + 1, z), down);
    const hits = ray.intersectObject(node, true);
    if (!hits.length) return null;
    return (pickLast ? hits[hits.length - 1] : hits[0]).point.y;
  };
  const rimTop = box.max.y;
  const centreFirst = hitY(c.x, c.z, false);
  const centreLast = hitY(c.x, c.z, true);
  /* Kante: der grösste Radius, auf dem ein Strahl noch nahe der Oberkante auftrifft. */
  let rimRadius = 0;
  const rMax = Math.max(size.x, size.z) / 2;
  for (let k = 12; k >= 1; k--) {
    const rr = (rMax * k) / 12;
    let hitsNear = 0, tries = 0;
    for (let a = 0; a < 8; a++) {
      const th = (a / 8) * Math.PI * 2;
      const y = hitY(c.x + Math.cos(th) * rr, c.z + Math.sin(th) * rr, false);
      tries++;
      if (y !== null && rimTop - y < size.y * 0.12) hitsNear++;
    }
    if (hitsNear >= tries - 1) { rimRadius = rr; break; }
  }
  for (const [m, s] of sides) m.side = s;
  const hollow = centreFirst !== null && (rimTop - centreFirst) > size.y * 0.15;
  return {
    box, top: +rimTop.toFixed(3), bottom: +box.min.y.toFixed(3),
    height: +size.y.toFixed(3), width: +size.x.toFixed(3), depth: +size.z.toFixed(3),
    rimRadius: +rimRadius.toFixed(3),
    innerFloor: centreFirst === null ? null : +centreFirst.toFixed(3),
    outerFloor: centreLast === null ? null : +centreLast.toFixed(3),
    hollow,
    method: centreFirst === null ? 'kein Treffer · Rückfall Kantenformel' : (hollow ? 'Innenboden gemessen' : 'Deckfläche gemessen')
  };
}

/* ------------------------ Messung an der Pflanze ------------------------
   Der Modellursprung ist NICHT der Stammfuss. Bei mehreren Spendern liegt das Netz seitlich
   versetzt über dem Ursprung — wer den Ursprung in die Topfmitte setzt, stellt den Stamm in
   den Rand (Befund aus der S18-Sichtung). Gemessen wird der SCHWERPUNKT der untersten 12 %
   der Vertices und der Radius dieses Fusses; beides in den Einheiten des ungeskalierten
   Netzes, weil der Massstab erst danach angewandt wird. */
export function baseFootprint(node, raw) {
  node.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(node.matrixWorld).invert();
  const m = new THREE.Matrix4(), v = new THREE.Vector3();
  const cut = raw.min.y + (raw.max.y - raw.min.y) * 0.12;
  const pts = [], all = [];
  node.traverse((o) => {
    if (!o.isMesh || !o.geometry.attributes.position) return;
    m.multiplyMatrices(inv, o.matrixWorld);
    const p = o.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(m);
      all.push([v.x, v.z]);
      if (v.y <= cut) pts.push([v.x, v.z]);
    }
  });
  const use = pts.length >= 6 ? pts : all;
  if (!use.length) return { x: 0, z: 0, radius: 0, from: 'kein Netz', samples: 0 };
  let sx = 0, sz = 0;
  for (const [x, z] of use) { sx += x; sz += z; }
  const cx = sx / use.length, cz = sz / use.length;
  const rs = use.map(([x, z]) => Math.hypot(x - cx, z - cz)).sort((a, b) => a - b);
  return {
    x: cx, z: cz,
    radius: rs[Math.floor(rs.length * 0.90)],
    from: pts.length >= 6 ? 'unterste 12 %' : 'ganzes Netz (kein Fussband)',
    samples: use.length
  };
}

/* ------------------------------ Bau ------------------------------ */
export async function buildProp(recipe, opts = {}) {
  const R = recipe;
  const root = new THREE.Group();
  root.name = 'PlantPropRoot';
  root.userData.recipe = R;
  const plants = [];
  const squashes = [];
  const measurements = [];
  const notes = [];
  const styles = [];

  for (let ci = 0; ci < R.containers.length; ci++) {
    const C = R.containers[ci];
    const cg = new THREE.Group();
    cg.name = 'Container_' + ci;
    cg.position.set(C.offset[0], 0, C.offset[1]);
    root.add(cg);

    const potRoot = new THREE.Group();
    potRoot.name = 'PotRoot';
    potRoot.rotation.y = THREE.MathUtils.degToRad(C.rotation);
    cg.add(potRoot);

    let baseY = 0;
    if (C.saucer) {
      const sa = await instance('tt_plants', C.saucer.name).catch(() => null);
      if (sa) {
        sa.name = 'Saucer';
        potRoot.add(sa);
        const sp = probeContainer(sa);
        /* Der Topf steht auf dem INNENBODEN des Untersetzers, nicht auf seiner Oberkante.
           Gemessen statt gerechnet: bei saucer_A_large sind das zwei verschiedene Höhen. */
        baseY = sp.hollow && sp.innerFloor !== null ? sp.innerFloor : sp.top * 0.55;
        measurements.push({ part: C.saucer.name, kind: 'saucer', ...sp, box: undefined });
      } else notes.push('Untersetzer fehlt: ' + C.saucer.name);
    }

    const pot = await instance('tt_plants', C.pot.name).catch(() => null);
    if (!pot) { notes.push('TOPF FEHLT: ' + C.pot.name); continue; }
    pot.name = 'Pot';
    pot.position.y = baseY;
    potRoot.add(pot);
    const pp = probeContainer(pot);
    measurements.push({ part: C.pot.name, kind: 'pot', ...pp, box: undefined });

    const st = stylePot(pot, Object.assign({}, R.style, { seed: R.seed }), { roughness: 0.72 });
    styles.push(st);
    if (C.saucer && R.style.saucer !== 'plain') {
      const sa = potRoot.getObjectByName('Saucer');
      if (sa) styles.push(stylePot(sa, Object.assign({}, R.style, {
        /* `family` wird in der Register-Grammatik nur noch gelesen, wenn leitmotif ===
           'family'. Der alte 'plain'-Pfad war tot und lieferte dem Untersetzer das laute
           Leitmotiv des Topfes statt der beabsichtigten ruhigen Fläche. */
        leitmotif: R.style.saucer === 'accent' ? 'leer' : (R.style.leitmotif || 'auto'), rim: false
      }), { roughness: 0.72 }));
    }

    const squash = new THREE.Group();
    squash.name = 'SquashWrap';
    squash.position.y = baseY;
    cg.add(squash);
    squashes.push(squash);

    const soilTop = baseY + pp.height;
    const depth = C.insertDepth ?? INV.INSERT_REFERENCE.depthFraction;
    const originY = soilTop - depth * pp.height;
    const rimR = Math.max(0.05, pp.rimRadius);

    for (let pi = 0; pi < C.plants.length; pi++) {
      const P = C.plants[pi];
      const pack = P.kind === 'alien' ? 'qu_env' : 'tt_plants';
      const node = await instance(pack, P.name).catch(() => null);
      if (!node) { notes.push('PFLANZE FEHLT: ' + P.name); continue; }
      const raw = new THREE.Box3().setFromObject(node);
      const rawSize = raw.getSize(new THREE.Vector3());
      /* Maßstabsbrücke, gemessen: Quaternius-Spender sind Weltbäume (Tree_Spiral_2 ist 6,19
         hoch) und Tiny Treats ist Tischmaßstab. Statt eines Faktors aus der Luft wird die
         Kronenbreite auf ein Vielfaches des GEMESSENEN Kantenradius gesetzt. */
      let s = 1;
      if (P.scale) s = P.scale;
      else if (P.kind === 'alien') s = (rimR * 2 * (R.style.alienFit ?? 2.1)) / Math.max(0.01, Math.max(rawSize.x, rawSize.z));
      else if (R.plantFit) s = R.plantFit;

      const foot = baseFootprint(node, raw);
      const pivot = new THREE.Group();
      pivot.name = 'PlantPivot_' + pi;
      const n = C.plants.length;
      const th = n === 1 ? 0 : (pi / n) * Math.PI * 2;
      /* Mehrere Pflanzen im Topf: der Versatz darf den GEMESSENEN Fussradius nicht über die
         Kante schieben — sonst steckt der Stamm in der Wand statt in der Erde. */
      const footR = foot.radius * s;
      const off = n === 1 ? 0 : Math.max(0, Math.min(rimR * 0.45, rimR * 0.82 - footR));
      pivot.position.set(Math.cos(th) * off, originY - baseY, Math.sin(th) * off);
      pivot.userData.yaw = (P.yaw != null ? P.yaw : (pi * 137.5) % 360) * Math.PI / 180;
      pivot.rotation.y = pivot.userData.yaw;
      squash.add(pivot);

      const crown = new THREE.Group();
      crown.name = 'CrownPivot_' + pi;
      /* Der Kronen-Pivot sitzt auf Schopfhöhe, nicht im Ursprung: ein Nachlauf um den Fuss
         wäre dieselbe Drehung wie am Fuss und damit unsichtbar. */
      const crownY = Math.max(0.05, rawSize.y * 0.45) * s;
      crown.position.y = crownY;
      pivot.add(crown);
      /* Fussebene exakt auf die Pivot-Null, Fussschwerpunkt exakt auf die Achse. Zwei Dinge
         müssen dabei mit dem Massstab multipliziert werden — der Massstab wirkt auf die
         GEOMETRIE, nicht auf `position`, also trägt die Position bereits Weltmaße. */
      node.position.set(-foot.x * s, -crownY - raw.min.y * s, -foot.z * s);
      node.scale.setScalar(s);
      crown.add(node);
      plants.push({ pivot, crown, node, recipe: P, scale: +s.toFixed(3) });
      measurements.push({
        part: P.name, kind: P.kind === 'alien' ? 'alien' : 'plant',
        raw: [+rawSize.x.toFixed(3), +rawSize.y.toFixed(3), +rawSize.z.toFixed(3)],
        rawMinY: +raw.min.y.toFixed(3), scale: +s.toFixed(3),
        footOffset: [+foot.x.toFixed(4), +foot.z.toFixed(4)],
        footRadius: +foot.radius.toFixed(4), footFrom: foot.from,
        plantOffsetInPot: +off.toFixed(4),
        fitted: [+(rawSize.x * s).toFixed(3), +(rawSize.y * s).toFixed(3), +(rawSize.z * s).toFixed(3)],
        originY: +originY.toFixed(3), insertDepth: +(depth * pp.height).toFixed(3)
      });
    }
  }

  const overlay = new THREE.Group();
  overlay.name = 'LivingOverlay';
  root.add(overlay);

  root.scale.setScalar(R.scale || 1);
  root.updateMatrixWorld(true);
  const worldBox = new THREE.Box3().setFromObject(root);
  const wsz = worldBox.getSize(new THREE.Vector3());

  /* Platzierungsvertrag (MENTAL_MODEL §10): Auskunft, keine Physik. */
  const footprint = {
    support: [+wsz.x.toFixed(3), +wsz.z.toFixed(3)],
    height: +wsz.y.toFixed(3),
    clearanceRadius: +(Math.max(wsz.x, wsz.z) / 2 * 1.15).toFixed(3),
    colliderProposal: R.containers.length === 1
      ? { type: 'cylinder', radius: +(Math.max(wsz.x, wsz.z) / 2).toFixed(3), height: +wsz.y.toFixed(3), note: 'Topf trägt, Laub nicht' }
      : { type: 'compound', parts: R.containers.length, note: 'je Topf ein Zylinder' },
    interactionAnchor: [0, +(wsz.y * 0.55).toFixed(3), 0],
    lookTarget: [0, +(wsz.y * 0.8).toFixed(3), 0]
  };

  return {
    root, plants, squashes, overlay, styles,
    report: {
      id: R.id, seed: R.seed, scaleClass: R.scaleClass, scale: R.scale,
      containers: R.containers.length, plants: plants.length,
      worldSize: [+wsz.x.toFixed(2), +wsz.y.toFixed(2), +wsz.z.toFixed(2)],
      pattern: styles[0] ? styles[0].report() : null,
      measurements, footprint, notes,
      tris: plants.reduce((a, p) => a + (INV.MEASURED[p.recipe.name]?.tris || 0), 0)
        + R.containers.reduce((a, c) => a + (INV.MEASURED[c.pot.name]?.tris || 0) + (c.saucer ? (INV.MEASURED[c.saucer.name]?.tris || 0) : 0), 0)
    }
  };
}

/* Kandidat für die Übergabe an Game Dev Studio — als VORSCHLAG, nicht als Katalogeintrag. */
export function gameReadyPackage(recipe, built, eyes) {
  return {
    schema: 'kfb.game-ready-plant/0.1-candidate',
    status: 'CANDIDATE · nicht in den Game-Dev-Studio-Katalog geschrieben',
    recipe,
    sources: recipe.containers.flatMap((c) => [c.pot.src, c.saucer && c.saucer.src, ...c.plants.map((p) => p.src)].filter(Boolean)),
    patternRecipe: recipe.style,
    propRig: { kind: 'transform', hierarchy: 'PotRoot | SquashWrap > PlantPivot > CrownPivot', ownsWorldTransform: false, levels: ['STATIC', 'AMBIENT', 'AWARE'] },
    eyeRigAdapter: eyes ? eyes.report() : null,
    collider: built.report.footprint.colliderProposal,
    lod: {
      tris: built.report.tris,
      note: 'Ein Netz je Teil, ein Atlas je Pack → Instancing über Topf/Pflanze möglich; LOD0 genügt bis LANDMARK, darüber Laub-Dezimierung nötig.'
    },
    consumerChecklist: [
      'Standfläche auf dem Terrain des Konsumenten geprüft',
      'Kollisionsproxy übernommen oder ersetzt',
      'Blickziel angemeldet, wenn AWARE',
      'Maßstabsklasse gegen Szene geprüft',
      'Licht/Palette gegen Umgebung geprüft'
    ]
  };
}
