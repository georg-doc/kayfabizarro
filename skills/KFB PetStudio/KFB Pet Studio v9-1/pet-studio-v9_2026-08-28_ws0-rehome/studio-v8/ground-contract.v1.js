/* KFB Pet Studio v8 — DIE MESSFLÄCHE DES PETS ALS VERTRAGSBLOCK.  gc-v1.1
 *
 * Georgs Modell (SPEC_groundplane_v1.md §1): jedes Pet hat eine ground plane · sie bestimmt die
 * Skalierung (auch Blasen) · sie empfängt den 3D-Schatten · sie kippt mit dem Spielfeld · der
 * Schatten ist damit IMMER unter dem Pet · und Pets skalieren sauber, egal ob Flügel oder Ohren.
 *
 * ZWEI DINGE, DIE EINEN NAMEN TEILTEN:
 *   FUSSBODEN   — einer je Zone. Er sagt, wo unten ist. Physik. (`ground-plane.v1.js`)
 *   MESSFLÄCHE  — eine je Pet. Maßstab, Blasengröße, Schattenempfang, Kippung. Kein zweiter Boden:
 *                 sie liegt IM einen, kippt mit ihm und hat keine eigene Meinung über unten.
 *
 * ⚠ BEFUND VOM 26.8., NACH DEM WS0-VOLLEXPORT — BITTE VOR BENUTZUNG LESEN:
 * Für die Rolle »Grundform« liest dieses Modul `body.cubeH` aus dem Vertrag. Das ist die SCHWÄCHERE
 * von zwei Lösungen derselben Frage. WS0 hat die stärkere längst gebaut und abgenommen:
 * `podcast-v1/stage.v1.js` mit `opts.byCube` MISST die Grundform aus der Geometrie — die größte
 * zusammenhängende Komponente, beim Cube-Pet also der Körperwürfel — und benennt das gefundene Mesh
 * im Actor (`cube.name`, `cube.edge`), damit man es nachmessen kann statt es zu glauben.
 * Gemessen im laufenden SpinballCast v2: `cube.name 'body'`, Kante 0,780 / 0,702.
 *
 * Eine gemessene Kante schlägt ein Vertragsfeld, das jemand gepflegt haben muss. Der richtige Weg
 * ist deshalb NICHT, `cubeH` hier zu verteidigen, sondern die Messung aus `stage.v1.js` in die
 * Messschicht des Studios zu heben und `cubeH` daraus zu schreiben. Bis dahin ist dieses Modul für
 * den STUDIO-Vertragsblock zuständig (Felder, Blasenmaß, Schattenempfang) — die Pet-Größe in einer
 * Sendung gehört `byCube`. Nicht zwei Rechnungen für dieselbe Zahl aufstellen.
 *
 * Keine Zahl hier ist neu gewählt: Kachel 2,0 und Füllung 0,60 stehen seit v5 in
 * `pet-metrics.v1.js` (`TILE_DEF`), `letterShare` 0,061 und Bezugskachel 557 px seit v7 im
 * Blasen-Handover §5. Neu GEMESSEN wird genau eine Zahl: der Fuß.
 */

export const version = 'gc-v1.1';

export const FIELD_DEF = {
  edge: 2.0,            // Kachelkante in Welteinheiten            — pet-metrics.v1.js TILE_DEF (v5)
  fill: 0.60,           // wie viel der Kante die Grundform füllt  — pet-metrics.v1.js TILE_DEF (v5)
  letterShare: 0.061,   // Letteringhöhe als Anteil der Kachelbreite — HANDOVER_WS0_v7 §5
  refTile: 557,         // Kachelbreite in px, bei der die Blase k = 1 hat — §5
  band: 0.06,           // unterste 6 % der Figurenhöhe gelten als Fuß
};

const num = (v, d) => (v == null ? null : +(+v).toFixed(d == null ? 4 : d));

/* ── Die eine gemessene Zahl: der FUSS ───────────────────────────────────────────────────────── */
/**
 * DER FUSS IST NICHT DIE SILHOUETTE. `body.radius` ist die Trefferfläche und enthält Ohren, Flügel
 * und Schnauze; die Aufstandsfläche ist etwas anderes und deutlich kleiner. Ohne sie muss der
 * Schatten die ganze Silhouette breit sein, und Punkt 6 (»immer UNTER dem Pet«) wird zu einer
 * Anforderung, die man von Hand nachjustiert.
 *
 * GEMESSEN AN DER RUHENDEN GEOMETRIE, nicht am animierten Körper (Falle 3 im v7-Handover: der
 * Ruhe-Clip hebt und senkt die Hülle je Tier verschieden weit — ein Anker daran ist ein Pendel).
 * GELESEN über `getX/getY/getZ` (Regel 7): selbst adressierte Puffer haben schon NaN-Geometrie
 * erzeugt, weil `position` und `normal` interleaved im selben Puffer lagen.
 */
export function measureFoot(THREE, root, opts) {
  const o = opts || {};
  const band = o.band == null ? FIELD_DEF.band : o.band;
  if (!root) return null;
  root.updateWorldMatrix(true, true);
  const k = (root.scale && root.scale.x) || 1;
  const box = new THREE.Box3().setFromObject(root);
  if (!isFinite(box.min.y) || !isFinite(box.max.y)) return null;
  const h = box.max.y - box.min.y;
  const yCut = box.min.y + h * band;
  const c = box.getCenter(new THREE.Vector3());
  const v = new THREE.Vector3();
  let r = 0, n = 0, meshes = 0;
  root.traverse((m) => {
    if (!m.isMesh || !m.geometry) return;
    if (m.userData && m.userData.petOverlay) return;   // Mund/Augen liegen auf, sie stehen nicht
    const pos = m.geometry.getAttribute && m.geometry.getAttribute('position');
    if (!pos) return;
    meshes++;
    m.updateWorldMatrix(true, false);
    for (let i = 0; i < pos.count; i++) {
      v.set(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(m.matrixWorld);
      if (v.y > yCut) continue;
      n++;
      const d = Math.hypot(v.x - c.x, v.z - c.z);
      if (d > r) r = d;
    }
  });
  if (!n) return null;
  return { r: num(r / k), rWorld: num(r), samples: n, meshes, band, yCut: num(yCut), k: num(k, 3) };
}

/* ── Der Vertragsblock ───────────────────────────────────────────────────────────────────────── */
/** `pet.ground` — additiv geschrieben, 1-%-Toleranz wie `pet-metrics.writeBody` (sonst ist jedes
 *  Laden eine Änderung und die Entwurfsmarkierung wertlos). */
export function ensureGround(pet, field) {
  if (!pet) return null;
  const F = { ...FIELD_DEF, ...(field || {}) };
  if (!pet.ground) {
    pet.ground = {
      edge: F.edge,
      fill: pet.token && pet.token.fill != null ? pet.token.fill : F.fill,
      foot: null,                 // Aufstandsradius in Modelleinheiten (gemessen)
      coverage: null,             // Fuß-Durchmesser / Kachelkante, nach dem Maßstab
      letterShare: F.letterShare, // Aufgabe 2: die Blasen erben ihre Größe von hier
      refTile: F.refTile,
      receives: true,             // Aufgabe 3: die Fläche empfängt, das Pet wirft
      tilt: 'inherit',            // Aufgabe 4: sie kippt mit dem Feld, sie entscheidet nicht selbst
      hover: 0,                   // Nullpunkt für Flug-Pets (Ruhehöhe, nicht Boden)
    };
  }
  const hov = pet.body && pet.body.limits && pet.body.limits.hover;
  if (hov && hov.on && hov.h != null) pet.ground.hover = num(hov.h);
  return pet.ground;
}

export function writeGround(pet, m, field) {
  if (!pet) return null;
  const g = ensureGround(pet, field);
  const before = JSON.stringify(g);
  const tol = 0.01;
  const put = (k, v) => {
    if (v == null) return;
    const cur = g[k];
    if (typeof cur === 'number' && Math.abs(cur - v) <= Math.abs(cur || 1) * tol) return;
    g[k] = v;
  };
  if (m && m.foot != null) put('foot', num(m.foot));
  if (m && m.coverage != null) put('coverage', num(m.coverage, 3));
  if (before === JSON.stringify(g)) return { changed: false, ground: g };
  g.measured = {
    by: 'KFB Pet Studio v8 · ' + version,
    at: new Date().toISOString().slice(0, 10),
    band: (m && m.band) != null ? m.band : FIELD_DEF.band,
    samples: (m && m.samples) || null,
    note: 'Fuß aus der ruhenden Geometrie, nicht aus der animierten Hülle',
  };
  return { changed: true, ground: g };
}

/**
 * Maßstab = Kante × Füllung / Grundform.
 * ⚠ `cubeH` ist hier die Grundform — siehe Kopfnotiz: in einer SENDUNG ist `stage.v1.js` mit
 * `opts.byCube` der richtige Weg, weil er die Grundform MISST statt sie zu lesen.
 */
export function groundScale(pet, field) {
  const g = ensureGround(pet, field);
  const F = { ...FIELD_DEF, ...(field || {}) };
  const edge = field && field.edge != null ? field.edge : (g.edge != null ? g.edge : F.edge);
  const fill = g.fill != null ? g.fill : F.fill;
  const h = (pet && pet.body && pet.body.cubeH) || null;
  if (!h) return null;
  return { k: num(edge * fill / h), edge, fill, cubeH: num(h) };
}

/** Blasenmaßstab — dieselbe Fläche, dieselbe Zahl. `tilePx` kommt aus `ground-plane.screenTile`. */
export function bubbleScale(pet, tilePx, field) {
  const g = ensureGround(pet, field);
  if (!tilePx) return null;
  return num(tilePx / (g.refTile || FIELD_DEF.refTile), 3);
}

/** Messen und schreiben in einem Griff, plus die laute Zeile (Regel 6): wer dieses Modul übernimmt,
 *  muss BELEGEN können, dass es läuft und nicht nachgebaut wurde. */
export function apply(THREE, pet, root, field, opts) {
  const o = opts || {};
  const sc = groundScale(pet, field);
  const f = measureFoot(THREE, root, { band: (field && field.band) || FIELD_DEF.band });
  let coverage = null;
  if (f && sc) coverage = (2 * f.r * sc.k) / sc.edge;
  const w = writeGround(pet, { foot: f && f.r, coverage, band: f && f.band, samples: f && f.samples }, field);
  const line = '[GC] ' + (pet && pet.id) + ' · Ebene ' + (sc ? sc.edge.toFixed(3) : '—')
    + ' × Fuellung ' + (sc ? sc.fill.toFixed(3) : '—')
    + ' / Grundform ' + (sc ? sc.cubeH.toFixed(4) : '—')
    + ' → Massstab ' + (sc ? sc.k.toFixed(4) : '—')
    + ' · Fuss ' + (f ? f.r.toFixed(4) : '—')
    + (coverage != null ? ' (Deckung ' + (coverage * 100).toFixed(1) + ' %, ' + f.samples + ' Punkte aus ' + f.meshes + ' Netzen)' : '')
    + ' · Ruhe ' + ((pet && pet.ground && pet.ground.hover) || 0).toFixed(2)
    + ' · kippt: ' + ((pet && pet.ground && pet.ground.tilt) || '—');
  if (o.quiet !== true) console.log(line);
  return { scale: sc, foot: f, coverage: coverage == null ? null : num(coverage, 3), ground: w && w.ground, changed: !!(w && w.changed), line };
}

/** Die Fläche an den Fußboden der Zone hängen. Sie kippt NICHT selbst — sie wird Kind der Gruppe,
 *  die das Layout kippt, und erbt die Kippung geometrisch statt über eine zweite Zahl. */
export function attach(gnd, pet, root) {
  if (!gnd || !pet) return null;
  const g = ensureGround(pet);
  if (root) gnd.setTarget(root);
  if (pet.body && pet.body.cubeH) gnd.setCubeH(pet.body.cubeH);
  gnd.setHover(g.hover || 0);
  return { cubeH: (pet.body && pet.body.cubeH) || null, hover: g.hover || 0, tilt: g.tilt };
}
