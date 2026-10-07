// Terrain generator identity + speed check (node, no browser). Hashes every TerrainCell field the stage-1 layer writes
// (level, water, coastMask, slope, biome, forest, deco, lakeDist, cliffUp, form, derived tags) plus riverCorridor()
// (onCentre, corridor, dist, level, id) over 161×161 cells around the origin for seeds 123, 1337, 42, 7, in a shuffled
// query order on a fresh generator, and compares with the hashes of the pre-perf generator (2026-10-06).
//
//   cd "$HOME/Dropbox/CLAUDE/KFB Open World" && . tools/env.sh
//   node --experimental-transform-types --no-warnings src/modules/terrain/tools/ident.mjs [row|shuffle|reverse] [cq cr]
import { registerHooks } from 'node:module';
import { createHash } from 'node:crypto';

// extensionless TS imports ('../../core/rng') → '.ts'
registerHooks({
  resolve(spec, ctx, next) {
    try {
      return next(spec, ctx);
    } catch (e) {
      if ((spec.startsWith('.') || spec.startsWith('/')) && !spec.endsWith('.ts')) return next(spec + '.ts', ctx);
      throw e;
    }
  },
});
const { TerrainGen } = await import('../gen.ts');

const EXPECTED = {
  '0,0': { 123: 'b28a995bf9ce16c3', 1337: 'a08fcdab61ffcf10', 42: '82052137dc4e4ef6', 7: 'b7c1aa8672f2002b' },
  '2000,-1500': { 123: 'c86ff9df387e0bcb', 1337: 'd3b5b4378773c7a1', 42: 'c5d0f7f893be2882', 7: '37e565ea79e1ac18' },
  '-3000,4100': { 123: '58571499b5eff6b9', 1337: '8899aec762165d95', 42: 'aa32aa605d71f24b', 7: '19f8cecd26471e4b' },
};
const [order = 'shuffle', cqS = '0', crS = '0'] = process.argv.slice(2);
const R = 80, cq0 = +cqS, cr0 = +crS;

function ser(t, rv) {
  const tags = [];
  if (t.water) tags.push('lake');
  if (t.coastMask) tags.push('coast');
  if (t.slope) tags.push('ramp');
  if (t.cliffUp > 0) tags.push('cliff');
  if (t.deco) tags.push('rock');
  if (t.biome === 'mountain') tags.push('mountain');
  return [t.level, t.water ? 1 : 0, t.coastMask, t.slope ? t.slope.dir + ':' + t.slope.steps : '-', t.biome, t.forest, t.deco ? t.deco.kind + '/' + t.deco.asset + '/' + t.deco.rot : '-', t.lakeDist, t.cliffUp, t.form, tags.join('|'),
    rv.onCentre ? 1 : 0, rv.corridor ? 1 : 0, rv.dist, rv.level, rv.id].join(',');
}

let ok = true;
for (const seed of [123, 1337, 42, 7]) {
  const g = new TerrainGen(seed);
  const cells = [];
  for (let r = cr0 - R; r <= cr0 + R; r++) for (let q = cq0 - R; q <= cq0 + R; q++) cells.push([q, r]);
  const ord = cells.map((_, i) => i);
  if (order === 'shuffle') {
    let s = 12345;
    for (let i = ord.length - 1; i > 0; i--) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      const j = s % (i + 1);
      [ord[i], ord[j]] = [ord[j], ord[i]];
    }
  }
  if (order === 'reverse') ord.reverse();
  const T = new Array(cells.length), RV = new Array(cells.length);
  const t0 = performance.now();
  for (const i of ord) {
    const [q, r] = cells[i];
    T[i] = g.cell(q, r);
    RV[i] = g.river(q, r);
  }
  const ms = performance.now() - t0;
  const h = createHash('sha256');
  for (let i = 0; i < cells.length; i++) h.update(ser(T[i], RV[i]) + '\n');
  const hex = h.digest('hex').slice(0, 16);
  const exp = EXPECTED[cq0 + ',' + cr0]?.[seed];
  const verdict = exp ? (exp === hex ? 'IDENTICAL' : 'MISMATCH (expected ' + exp + ')') : '(no reference for this area)';
  if (exp && exp !== hex) ok = false;
  console.log(`seed ${seed}: ${hex} ${verdict}  ${((ms * 1000) / cells.length).toFixed(1)} µs/cell (cold, incl. JIT warm-up on the first seed)`);
}
process.exit(ok ? 0 : 1);
