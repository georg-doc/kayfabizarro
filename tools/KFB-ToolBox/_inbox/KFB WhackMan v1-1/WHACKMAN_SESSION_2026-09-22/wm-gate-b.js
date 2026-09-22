/* KFB WhackMan v1 · GATE B — das Labyrinth, gebaut von den bestehenden Eigentümern
   Diese Datei rechnet KEINE Position. Sie verkettet nur:

     wm-kit.buildKit()          Messung (Owner-Funktionen aus kit-lab + dungeon-grid)
     wm-recipe.dungeonModel()   Handschrift → Owner-Modellform
     dungeon-grid.layout()      Platzierung: Anker, Drehung, Höhe, Fackelachse — alles Owner
     kit-lab.buildScene()       Instanzierung mit Cache-Aufwärmung
     kit-lab.repairTextures()   der bekannte Schwarz-Fall
     kit-lab.auditFootprints()  Durchdringungsprüfung auf der GERENDERTEN Geometrie

   Danach erst WhackMan-Eigenes: MazeGraph und Sammelgut. */

import * as THREE from 'three';
import { layout } from './tools/world_atlas/source/lib/dungeon-grid.js';
import { buildScene, repairTextures, auditFootprints, instance, measure }
  from './tools/world_atlas/source/lib/kit-lab.js';
/* Ladepool aus dem Quellenregister — vier gleichzeitig, wie der Dungeon-Owner es gemessen hat. */
import { pool } from './wm-pool.js';
import { buildKit, TREATS_REV } from './wm-kit.js';
import { RECIPE, cellRoles, dungeonModel } from './wm-recipe.js';
import { mazeGraph, auditMaze } from './wm-maze.js';
import { sliceFor, GRUPPEN, BODENDECKER, SILHOUETTEN, AKZENT, AKZENT_ANTEIL, RANDHOHES, MAX_HOEHE, blockRegions, hash as ghash }
  from './wm-garden.js';

/* Sammelgut: eine billige Wiederholfamilie plus wenige grosse Sonderstücke (Brief §9).
   Geklont wird EINE geprüfte Quelle je Familie — kein eigenes GLTF pro Pellet. */
export const TREATS = { pellet: 'cookie', special: ['donut', 'donut_pink', 'donut_chocolate', 'cupcake'], story: 'cupcake' };

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
}

export async function buildGateB({ scene, onProgress = () => {}, label = () => {}, innenDecken = 'standard' }) {
  const report = { gate: 'B', errors: [], owners: {}, revisions: { treats: TREATS_REV } };

  onProgress('B · Bauteile werden vom Dungeon-Owner gemessen …');
  const K = await buildKit((d, t) => onProgress(`B · Messung ${d}/${t}`));
  report.kit = K.facts;
  report.owners.messung = 'kit-lab.js · dungeon-grid.js (Kit-Builder verbatim aus S13.2)';

  const roles = cellRoles(RECIPE);
  const model = dungeonModel(roles, K.parts);
  report.recipe = roles.recipe;
  report.model = model.checks;
  report.owners.platzierung = 'dungeon-grid.js layout()';

  onProgress('B · Platzierung (layout) …');
  const placements = layout(model, K.kit);
  report.placements = placements.length;

  /* ---------- Blockdächer als Dachgärten ----------
     Das Original füllt jede `#`-Zelle als Würfel; das KayKit-Fugenmodell setzt die Wand auf die
     KANTE, also ist ein `#`-Feld eine Grube zwischen dünnen Wänden. Es braucht einen Deckel.

     Erster Versuch war eine `floor_tile_large` bündig eingesetzt — Z-Fighting, weil sie die
     Wände um 0,5 je Seite überlappt. Zweiter Versuch `ceiling_tile` oben auf: sauber, aber eine
     braune Platte, und von oben sieht die Karte damit aus wie ein Tisch.

     Jetzt Georgs Lösung: Tiny-Treats-Rasen aus dem 3×3-SLICE-SATZ des Pretty Park. Kachel 2,00,
     also vier Teilkacheln je Modul, und die Slice-Wahl je Teilkachel ergibt die abgerundeten
     Außenecken — dafür ist der Satz gemacht. Der Rand wird auf dem FEINEN Raster bestimmt, sonst
     rundet jede Zelle für sich statt das ganze Blockfeld. */
  const grass = await measure('park', 'floor_grass_sliced_E').catch(() => null);
  const roofed = { kacheln: 0, requisiten: 0, felder: 0, gruppen: [] };
  if (innenDecken !== 'aus' && grass) {
    const TILE = Math.max(grass.size[0], grass.size[2]);          // gemessen, nicht angenommen
    /* Die Kachel liegt OBEN AUF der Krone, nicht mit der Oberkante bündig darin. Bündig
       überlappt ihr Körper die oberen 0,15 der Wand — dreidimensional, also meldet die
       Owner-Prüfung 36 Durchdringungen. Derselbe Fehler wie zuvor bei der Bodenplatte, nur
       diesmal in Y statt in XZ. */
    const topY = K.kit.WALL_H - grass.min[1] + 0.01;
    /* Alles, was auf dem Dach steht, steht auf dem RASEN — nicht auf der Wandkrone. Die Kachel
       ist gemessen 0,15 dick; wer auf WALL_H setzt, steckt mit dem Fuß darin, und die
       Owner-Prüfung meldet 40 Durchdringungen zwischen Baum und Grasnarbe. */
    /* Die Oberkante des Rasens, gemessen: die Kachel ist 0,50 dick, nicht 0,15 wie angenommen. */
    const rasenOben = topY + grass.max[1];
    /* Und gesetzt wird an der UNTERKANTE des Teils, nicht an seinem Pivot. Ein Baum mit
       min.y = −0,19 steckte sonst genau so tief im Rasen — das ist der Fehler, den der
       Dungeon-Owner als teuersten des Packs beschreibt, nur eine Ebene höher. */
    const propY = (nm) => rasenOben - (unten[nm] || 0) + 0.005;
    const { isBlock } = blockRegions(roles);
    /* Feines Raster: eine Teilkachel je halbem Modul. */
    const subOcc = (sx, sy) => isBlock(Math.floor(sx / 2), Math.floor(sy / 2));
    const SW = roles.w * 2, SH = roles.h * 2;
    for (let sy = 0; sy < SH; sy++) {
      for (let sx = 0; sx < SW; sx++) {
        if (!subOcc(sx, sy)) continue;
        const part = sliceFor(!subOcc(sx, sy - 1), !subOcc(sx + 1, sy), !subOcc(sx, sy + 1), !subOcc(sx - 1, sy));
        placements.push({
          a: 'park:' + part,
          p: [(sx - (SW - 1) / 2) * TILE + ((roles.w - 1) / 2) * K.kit.MOD, topY,
            (sy - (SH - 1) / 2) * TILE + ((roles.h - 1) / 2) * K.kit.MOD],
          r: 0, layer: 'blockroof', sub: [sx, sy]
        });
        roofed.kacheln++;
      }
    }

    /* ---------- Requisiten ----------
       Zuerst MESSEN, dann setzen. Jedes Teil, das höher ist als MAX_HOEHE × Wandhöhe, fällt raus
       und steht im Bericht — so entscheidet die Geometrie und nicht meine Namensliste.
       Gesetzt wird je BLOCKZELLE, nicht je Blockfeld: ein Feld aus sechs Zellen bekam vorher drei
       Cluster und blieb sonst kahl, gemessen 114 von 132 Zellen leer. */
    const hoehe = {}, groesse = {}, unten = {}, verworfen = [];
    const grenze = K.kit.WALL_H * MAX_HOEHE;
    const kandidaten = [...new Set([...GRUPPEN.flatMap((g) => g.teile), ...BODENDECKER, ...SILHOUETTEN, AKZENT])];
    await pool(kandidaten, async (nm) => {
      const m = await measure('park', nm);
      hoehe[nm] = m.size[1];
      groesse[nm] = [m.size[0], m.size[2]];
      unten[nm] = m.min[1];
      /* Epsilon: `hedge_straight` misst exakt 1,50 gegen eine Grenze von 1,50 und fiel durch —
         ein Gleitkomma-Gleichstand, kein zu hohes Teil. Mit der Hecke verlor die Gruppe
         `heckenkante` ihr drittes Stück und wurde still ganz weggeworfen. */
      if (m.size[1] > grenze + 1e-6) verworfen.push(nm + ' ' + m.size[1].toFixed(2) + ' > ' + grenze.toFixed(2));
    }, 4);
    const erlaubt = (nm) => hoehe[nm] !== undefined && hoehe[nm] <= grenze + 1e-6;
    const gruppenOk = GRUPPEN.map((g) => ({ ...g, teile: g.teile.filter(erlaubt) })).filter((g) => g.teile.length >= 3);
    const deckerOk = BODENDECKER.filter(erlaubt);
    const silOk = SILHOUETTEN.filter(erlaubt);
    roofed.silhouetten = silOk;
    roofed.hoehen = hoehe;
    roofed.verworfen = verworfen;
    roofed.grenze = +grenze.toFixed(2);

    const { regions } = blockRegions(roles);
    const amRand = ([x, y]) => x === 0 || y === 0 || x === roles.w - 1 || y === roles.h - 1;
    /* Der Streuradius kommt aus der GEMESSENEN Grundfläche des Teils, nicht aus einer getippten
       Zahl. Vorher stand dort MOD × 0,36 = 1,44 für alles; eine 2,00 lange Bank reichte damit
       2,44 vom Zellmittelpunkt gegen 2,00 halbe Zellbreite und hing über dem Gang.
       Bei freier Drehung zählt der Umkreis, bei 90°-Schritten die Achse — sonst wäre die
       Rechnung für gedrehte Teile falsch.

       Dazu ein Mindestabstand innerhalb der Zelle: 39 Heckenpaare standen exakt ineinander
       (Durchdringung 1,50 = volle Tiefe), weil nichts geprüft hat, was schon dasteht. */
    let abgelehnt = 0;
    const setzeIn = (belegt, nm, cx, cy, seed, rot, freiDreh) => {
      const g = groesse[nm] || [0.5, 0.5];
      /* Bei freier Drehung ist die Grundfläche die DIAGONALE, nicht die längere Kante: ein
         2,00 × 1,50 Teil um 45° gedreht misst 2,50. Mit `max` gerechnet blieben 40 Kollisionen
         übrig, weil die Teile über ihre Zellgrenze traten.
         Große Teile bekommen deshalb 90°-Schritte — dort ist die Grundfläche exakt (sx,sz) bzw.
         vertauscht — und behalten so ihre nutzbare Fläche, statt an der Diagonale zu ersticken. */
      const diag = Math.hypot(g[0], g[1]);
      const gross = diag > 1.2;
      const drehung = freiDreh && !gross ? rot : [0, 90, 180, 270][Math.floor(ghash(seed + 'q') * 4)];
      const quer = drehung === 90 || drehung === 270;
      const ex = freiDreh && !gross ? diag : (quer ? g[1] : g[0]);
      const ez = freiDreh && !gross ? diag : (quer ? g[0] : g[1]);
      const limX = Math.max(0, (K.kit.MOD - ex) / 2 - 0.1);
      const limZ = Math.max(0, (K.kit.MOD - ez) / 2 - 0.1);
      for (let t = 0; t < 10; t++) {
        const ox = (ghash(seed + 'x' + t) - 0.5) * 2 * limX;
        const oz = (ghash(seed + 'z' + t) - 0.5) * 2 * limZ;
        const box = [ox - ex / 2, oz - ez / 2, ox + ex / 2, oz + ez / 2];
        let passt = true;
        for (const o of belegt) {
          if (box[0] < o[2] && box[2] > o[0] && box[1] < o[3] && box[3] > o[1]) { passt = false; break; }
        }
        if (!passt) continue;
        belegt.push(box);
        placements.push({
          a: 'park:' + nm,
          p: [cx * K.kit.MOD + ox, propY(nm), cy * K.kit.MOD + oz],
          r: drehung, layer: 'gartenprop'
        });
        roofed.requisiten++;
        return true;
      }
      abgelehnt++;
      return false;
    };
    const setze = (nm, cx, cy, ox, oz, rot) => {
      placements.push({
        a: 'park:' + nm,
        p: [cx * K.kit.MOD + ox, propY(nm), cy * K.kit.MOD + oz],
        r: rot, layer: 'gartenprop'
      });
      roofed.requisiten++;
    };

    for (const region of regions) {
      roofed.felder++;
      const innen = region.filter((c) => !amRand(c));
      if (!innen.length || !gruppenOk.length) continue;
      for (const [cx, cy] of innen) {
        const seed = 'z' + cx + ',' + cy;
        const belegt = [];
        /* SILHOUETTEN zuerst: sie tragen die Lesart von oben. */
        const sil = 2 + Math.floor(ghash(seed + 's') * 3);
        for (let i = 0; i < sil && silOk.length; i++) {
          const nm = silOk[Math.floor(ghash(seed + 'sl' + i) * silOk.length)];
          const frei = true;
          setzeIn(belegt, nm, cx, cy, seed + 'S' + i, Math.round(ghash(seed + 'sr' + i) * 360), frei);
        }
        /* Grundschicht füllt ZWISCHEN den Umrissen, sie ist nicht die Hauptmasse. */
        const decker = 2 + Math.floor(ghash(seed + 'n') * 2);
        for (let i = 0; i < decker && deckerOk.length; i++) {
          const nm = deckerOk[Math.floor(ghash(seed + 'dk' + i) * deckerOk.length)];
          setzeIn(belegt, nm, cx, cy, seed + 'D' + i, Math.round(ghash(seed + 'r' + i) * 360), true);
        }
        /* Kies als Akzent, nicht als Teppich: nur auf jeder fünften Zelle. */
        if (erlaubt(AKZENT) && ghash(seed + 'ak') < AKZENT_ANTEIL) {
          setzeIn(belegt, AKZENT, cx, cy, seed + 'A', [0, 90, 180, 270][Math.floor(ghash(seed + 'akr') * 4)], false);
        }
        /* Eine semantische Gruppe als Motiv der Zelle — dieselbe Abstandsprüfung. */
        const grp = gruppenOk[Math.floor(ghash(seed + 'g') * gruppenOk.length)];
        roofed.gruppen.push(grp.id);
        grp.teile.forEach((teil, ti) => {
          setzeIn(belegt, teil, cx, cy, seed + 'G' + ti,
            grp.dreh ? Math.round(ghash(seed + 'd' + ti) * 360) : [0, 90, 180, 270][Math.floor(ghash(seed + 'd' + ti) * 4)],
            grp.dreh);
        });
      }
    }

    /* ---------- Rand: hier darf es hoch sein ----------
       Georgs Trennung: Bäume und Landmarks an die Spielfeldränder, nicht ins Blickfeld. Der
       Rahmenring ist genau dieser Ort — durch ihn muss niemand hindurchsehen. */
    const randOk = [];
    await pool(RANDHOHES, async (nm) => {
      const m = await measure('park', nm);
      hoehe[nm] = m.size[1];
      groesse[nm] = [m.size[0], m.size[2]];
      unten[nm] = m.min[1];
      randOk.push(nm);
    }, 4);
    let rand = 0;
    for (const region of regions) {
      for (const [cx, cy] of region) {
        if (!amRand([cx, cy])) continue;
        if (ghash('rand' + cx + ',' + cy) > 0.34) continue;      // ausgedünnt, keine Allee
        const nm = randOk[Math.floor(ghash('rt' + cx + ',' + cy) * randOk.length)];
        if (!nm) continue;
        /* Derselbe Versatz-Deckel wie auf den Dächern: die Grenze kommt aus der gemessenen
           Grundfläche des Teils. Der Brunnen misst 4,00 × 4,00, also ein ganzes Modul — mit
           festem Versatz lief er zwangsläufig in die Nachbarzelle, gemessen vier Mal. Bei
           Grenze 0 steht er dort, wo er allein passt: in der Mitte. */
        const g = groesse[nm] || [1, 1];
        const lim = (a) => Math.max(0, (K.kit.MOD - a) / 2 - 0.1);
        setze(nm, cx, cy,
          (ghash('rx' + cx + ',' + cy) - 0.5) * 2 * lim(g[0]),
          (ghash('rz' + cx + ',' + cy) - 0.5) * 2 * lim(g[1]),
          [0, 90, 180, 270][Math.floor(ghash('rr' + cx + ',' + cy) * 4)]);
        rand++;
      }
    }
    roofed.randHohes = rand;
    roofed.abgelehnt = abgelehnt;
  }
  report.daecher = roofed;

  onProgress('B · Szene wird instanziert …');
  const root = await buildScene(placements, (d, t) => onProgress(`B · Aufbau ${d}/${t}`), { concurrency: 6 });
  root.name = 'gateB';
  /* buildScene kennt das `hide`-Feld nicht — das Türblatt füllt sonst die einzige begehbare
     Fuge des Packs. Consumer-Seite, eine Zeile, kein zweiter Lader. */
  let hidden = 0;
  for (const n of root.children) {
    const h = n.userData.recipe && n.userData.recipe.hide;
    if (!h) continue;
    n.traverse((o) => { if (o.name === h) { o.visible = false; hidden++; } });
  }
  report.hiddenDoorLeaves = hidden;
  /* Wer wirft, wer empfängt. Flache Platten — Böden und Blockdächer — empfangen nur: ihr
     eigener Schatten ist bei einem Licht von oben unsichtbar, und jeder Werfer kostet die
     Schattenkarte einen zweiten Durchgang. Werfer sind Wände, Ecken, Fackeln und die Akteure. */
  for (const n of root.children) {
    const rec = n.userData.recipe;
    const flat = rec && (rec.layer === 'floor' || rec.layer === 'blockroof' || rec.layer === 'ceiling');
    n.traverse((o) => { if (o.isMesh) { o.castShadow = !flat; o.receiveShadow = true; } });
  }
  scene.add(root);

  /* ---------- MazeGraph · WhackMan-eigen ---------- */
  const graph = mazeGraph(roles);
  report.maze = auditMaze(graph);
  report.maze.freeWallEnds = model.checks.freeWallEnds;
  report.maze.corners = model.checks.corners;

  const MOD = K.kit.MOD;

  /* ---------- Fackellicht · Flammenpunkt vom Owner gemessen ---------- */
  const flame = K.FLAME.torch_mounted;
  /* ---------- Fackeln: Quelle, Licht und Abfall ----------
     Konzept: das Labyrinth steht oben offen — der Himmel liefert also den Schatten (schwach,
     kalt, von oben), die Fackeln liefern die Stimmung (warm, nah, unruhig). Kein drittes
     Licht. Drei Regeln, aus denen der Rest folgt:
     1 · Abfall physikalisch (decay 2). Vorher stand hier decay 1 — damit reicht eine Fackel
         doppelt so weit wie sie darf, die Kegel überlagern sich zu Waschlicht, und genau das
         war der ausgebrannte Fleck an der Wand.
     2 · Sechs Lampen wandern zu den nächsten Fackeln. Punktlichter kosten in three.js pro
         Material und pro Pixel; vierzig davon sind ein Standbild-Luxus, kein Spielbudget.
     3 · Die QUELLE ist an jeder Fackel sichtbar — ein additiver Glutfleck, auch dort, wo
         gerade keine Lampe steht. Licht ohne sichtbare Quelle ist der Grund, warum eine Szene
         "buggy" aussieht: das Auge sucht den Ursprung und findet keinen. */
  const fackeln = [];
  if (flame) {
    for (const p of placements) {
      if (p.a !== 'dungeon:torch_mounted' || !p.p) continue;
      fackeln.push(new THREE.Vector3(
        p.p[0] + (p.into ? p.into[0] * 0.25 : 0), p.p[1] + flame[1],
        p.p[2] + (p.into ? p.into[1] * 0.25 : 0)));
    }
  }

  const glutTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,238,200,1)');
    g.addColorStop(0.25, 'rgba(255,164,64,.85)');
    g.addColorStop(0.6, 'rgba(255,96,24,.28)');
    g.addColorStop(1, 'rgba(255,80,16,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();

  const gluten = [];
  for (const v of fackeln) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glutTex, color: 0xffffff, blending: THREE.AdditiveBlending,
      transparent: true, depthWrite: false, fog: false
    }));
    s.position.copy(v);
    s.scale.setScalar(MOD * 0.62);
    s.userData.ph = Math.random() * 6.283;
    root.add(s);
    gluten.push(s);
  }

  const POOL = Math.min(6, fackeln.length);
  const poolLichter = [];
  for (let i = 0; i < POOL; i++) {
    /* Intensität in Candela: mit decay 2 fällt sie mit 1/d², also braucht ein Gang von zwei
       Modulen Reichweite eine zweistellige Zahl. 30 ist gemessen an MOD 4 der Wert, bei dem
       die Wand gegenüber noch Zeichnung hat und die Fackel daneben nicht ausbrennt. */
    const L = new THREE.PointLight(0xff8c3a, 30, MOD * 4.5, 2);
    L.visible = false;
    L.userData.ph = i * 1.7;
    root.add(L);
    poolLichter.push(L);
  }

  const lampen = {
    anzahl: fackeln.length,
    folge(x, z) {
      if (!POOL) return;
      const sortiert = fackeln
        .map((v, i) => ({ i, d: (v.x - x) * (v.x - x) + (v.z - z) * (v.z - z) }))
        .sort((a, b) => a.d - b.d);
      for (let i = 0; i < POOL; i++) {
        const q = sortiert[i];
        poolLichter[i].visible = !!q;
        if (q) poolLichter[i].position.copy(fackeln[q.i]);
      }
    },
    /* Flackern aus ZWEI unharmonischen Sinus überlagert — eine einzelne Frequenz liest sich
       als Blinker, zwei lesen sich als Feuer. Jede Flamme hat ihre eigene Phase, sonst pulst
       das ganze Labyrinth im Gleichtakt. */
    tick(t) {
      for (const L of poolLichter) {
        if (!L.visible) continue;
        const ph = L.userData.ph;
        L.intensity = 30 * (0.84 + 0.1 * Math.sin(t * 11.3 + ph) + 0.06 * Math.sin(t * 6.7 + ph * 2.3));
      }
      for (const s of gluten) {
        const ph = s.userData.ph;
        const f = 0.86 + 0.09 * Math.sin(t * 12.1 + ph) + 0.05 * Math.sin(t * 7.3 + ph * 1.9);
        s.scale.setScalar(MOD * 0.62 * f);
        s.material.opacity = f;
      }
    }
  };
  if (fackeln.length) lampen.folge(((roles.w - 1) / 2) * MOD, ((roles.h - 1) / 2) * MOD);
  report.torchLights = fackeln.length + ' Fackeln · ' + POOL + ' Lampen im Pool · decay 2';

  /* ---------- Sammelgut ---------- */
  const pickups = { pellets: [], specials: [], story: [] };
  try {
    const names = [TREATS.pellet, ...TREATS.special];
    for (const nm of names) await measure('treats', nm);
    /* Auf die GRÖSSTE Kante skalieren, nicht auf die Höhe. Ein Keks ist 0,49 × 0,16 × 0,49 —
       auf Höhe gerechnet wird er viermal zu breit und deckt den halben Gang. */
    const fit = async (nm, size) => {
      const n = await instance('treats', nm);
      const b = new THREE.Box3().setFromObject(n);
      const s = b.getSize(new THREE.Vector3());
      n.scale.setScalar(size / Math.max(s.x, s.y, s.z, 1e-4));
      n.updateMatrixWorld(true);
      const b2 = new THREE.Box3().setFromObject(n);
      const c2 = b2.getCenter(new THREE.Vector3());
      n.position.set(-c2.x, -b2.min.y, -c2.z);
      n.traverse((o) => { if (o.isMesh) o.castShadow = true; });
      const g = new THREE.Group();
      g.add(n);
      return g;
    };
    for (const k of graph.pickupNodes) {
      const n = graph.nodes.get(k);
      const g = await fit(TREATS.pellet, MOD * 0.24);
      g.position.set(n.x * MOD, MOD * 0.14, n.y * MOD);
      g.userData.node = k; g.userData.phase = hash(k) * 6.28; g.userData.baseY = MOD * 0.14;
      root.add(g); pickups.pellets.push(g);
    }
    for (let i = 0; i < graph.specialNodes.length; i++) {
      const k = graph.specialNodes[i], n = graph.nodes.get(k);
      const g = await fit(TREATS.special[i % TREATS.special.length], MOD * 0.62);
      g.position.set(n.x * MOD, MOD * 0.1, n.y * MOD);
      g.userData.node = k; g.userData.phase = hash(k) * 6.28;
      root.add(g); pickups.specials.push(g);
    }
    for (const k of graph.storyNodes) {
      const n = graph.nodes.get(k);
      const g = await fit(TREATS.story, MOD * 0.66);
      g.position.set(n.x * MOD, MOD * 0.1, n.y * MOD);
      g.userData.node = k; g.userData.phase = 0;
      root.add(g); pickups.story.push(g);
    }
    report.pickups = { pellets: pickups.pellets.length, specials: pickups.specials.length, story: pickups.story.length };
  } catch (e) {
    report.errors.push({ teil: 'sammelgut', error: e.message });
  }

  /* ---------- Owner-Prüfungen auf der GERENDERTEN Geometrie ---------- */
  /* ---------- Schattenkamera auf das Labyrinth passen ----------
     makeViewer richtet sein Key-Light auf ein Werkzeugblatt aus: Frustum ±40, bias 0. Das
     Labyrinth misst gemessen 80 × 72 Einheiten — der halbe Grundriss, darunter der Spielerstart,
     lag ausserhalb. Das war der dunkle Streifen, in dem der Akteur stand. */
  let key = null;
  scene.traverse((o) => { if (!key && o.isDirectionalLight && o.castShadow) key = o; });
  if (key) {
    const bounds = new THREE.Box3().setFromObject(root);
    const c = bounds.getCenter(new THREE.Vector3());
    const s = bounds.getSize(new THREE.Vector3());
    const rad = Math.max(s.x, s.z) * 0.62;
    key.target.position.copy(c);
    if (!key.target.parent) scene.add(key.target);
    key.target.updateMatrixWorld();
    key.position.set(c.x - rad * 0.55, c.y + rad * 1.25, c.z + rad * 0.5);
    Object.assign(key.shadow.camera, { left: -rad, right: rad, top: rad, bottom: -rad, near: 1, far: rad * 4 });
    key.shadow.bias = -0.0008;
    key.shadow.normalBias = 0.02;
    key.shadow.mapSize.set(1536, 1536);
    if (key.shadow.map) { key.shadow.map.dispose(); key.shadow.map = null; }
    key.shadow.camera.updateProjectionMatrix();
    report.shadow = { radius: +rad.toFixed(1), bounds: [s.x, s.y, s.z].map((v) => +v.toFixed(1)) };
  }
  /* Im Lauf folgt die Schattenkamera dem Akteur mit einem ENGEN Ausschnitt. Über den ganzen
     Grundriss (Radius 53) musste jedes Bild das komplette Labyrinth in die Schattenkarte —
     das war der grösste Einzelposten am Ruckeln, und die Karte war dabei auch noch grob. */
  const schatten = {
    weit: key ? { ...key.shadow.camera } : null,
    folge(x, z, rad) {
      if (!key) return;
      const r = rad || MOD * 7;
      key.target.position.set(x, 0, z);
      key.target.updateMatrixWorld();
      key.position.set(x - r * 0.8, r * 1.9, z + r * 0.7);
      const c = key.shadow.camera;
      if (c.left !== -r) {
        Object.assign(c, { left: -r, right: r, top: r, bottom: -r, near: 1, far: r * 5 });
        c.updateProjectionMatrix();
      }
    }
  };

  report.textures = repairTextures(root);
  const fp = auditFootprints(root, { tolerance: 0.02 });
  report.footprints = { kollisionen: fp.bad ? fp.bad.length : (fp.collisions || 0), worst: fp.worst };

  /* Boden unter dem Labyrinth, damit nichts im Nichts schwebt. */
  const pad = new THREE.Mesh(
    new THREE.PlaneGeometry(roles.w * MOD + MOD * 3, roles.h * MOD + MOD * 3),
    new THREE.MeshStandardMaterial({ color: 0x120e1a, roughness: 1 })
  );
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(((roles.w - 1) / 2) * MOD, -0.22, ((roles.h - 1) / 2) * MOD);
  pad.receiveShadow = true;
  root.add(pad);

  const at = (k, y, title, sub) => {
    const n = graph.nodes.get(k);
    if (!n) return;
    const a = new THREE.Object3D();
    a.position.set(n.x * MOD, y, n.y * MOD);
    root.add(a);
    label({ kind: 'item', anchor: a, y: 0, title, sub, station: 'B' });
  };
  at(graph.spawn, MOD * 0.9, 'Spielerstart', graph.spawn);
  if (graph.penDoor) at(graph.penDoor, MOD * 0.9, 'Pferchtür', 'einziger Austritt');
  graph.tunnelPairs.forEach(([a, b], i) => {
    at(a, MOD * 0.9, 'Tunnel ' + (i + 1) + 'A', '→ ' + b);
    at(b, MOD * 0.9, 'Tunnel ' + (i + 1) + 'B', '→ ' + a);
  });
  graph.storyNodes.forEach((k) => at(k, MOD * 1.1, 'Story-Bit', 'G3 · schaltet ein Tor'));

  return {
    root, report, roles, model, graph, kit: K.kit, MOD, pickups, lampen, schatten,
    views: [{ id: 'B', title: 'B · Dungeon-Maze', group: root }],
    /* Wenn Gate C läuft, gehört die HÖHE der Sammelstücke dort hin: Kopfstoß und Ruhepuls sind
       eine Aussage über Nähe zu Akteuren, und die kennt nur Gate C. Zwei Schreiber auf einer
       Höhe waren schon einmal der Grund, warum nichts sichtbar wurde. */
    ownPickupY: false,
    update(dt, t) {
      for (const g of pickups.pellets) {
        g.rotation.y += dt * 1.1;
        if (!this.ownPickupY) g.position.y = g.userData.baseY + Math.sin(t * 2 + g.userData.phase) * MOD * 0.02;
      }
      for (const g of pickups.specials) {
        g.rotation.y += dt * 0.7;
        if (!this.ownPickupY) g.position.y = g.userData.baseY + Math.sin(t * 1.5 + g.userData.phase) * MOD * 0.045;
      }
      for (const g of pickups.story) g.rotation.y += dt * 0.5;
      lampen.tick(t);
    }
  };
}
