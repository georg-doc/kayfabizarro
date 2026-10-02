import { readFile, access } from 'node:fs/promises';
import { extendHexCatalog, reportMeasuredSeam } from '../../../../world_atlas/source/lib/hex-levels.mjs';
const root = new URL('../', import.meta.url);
const measurementsPath = 'BLENDER_RETURN/BLENDER_MEASUREMENTS.json';
const measurements = JSON.parse(await readFile(new URL(measurementsPath, root), 'utf8'));
const original = JSON.parse(await readFile(new URL('data/HEX_BROWSER_MEASUREMENTS.json', root), 'utf8'));
const before = structuredClone(original);
const recipe = JSON.parse(await readFile(new URL('BLENDER_RETURN/SCENELET_RECIPE_2CELL.json', root), 'utf8'));
const source = { repo: 'georg-doc/kayfabizarro', commit: 'fe45e3fbafec9180cd41a15ae824ee55af74e084',
  path: `tools/KFB-ToolBox/_handover/HEX_BLENDER_BENCH_2026-10-02/${measurementsPath}`,
  blobSha: '0236b4e1594089beb5fec0e29c96fdbda7e23af6' };
original.hexTiles = extendHexCatalog(original.hexTiles, measurements, source);
const seamReport = { schema: 'kfb.hex-level-seam-report/0.1-candidate', scaleDecision: 'A_LOGICAL_HEX',
  contractStatus: 'PASS_ADDITIVE_DATA', productionAdmission: 'PREPARE_FULL_EDGE_BROWSER_CHECK',
  seams: reportMeasuredSeam(recipe, { repo: source.repo, commit: source.commit,
    path: 'tools/KFB-ToolBox/_handover/HEX_BLENDER_BENCH_2026-10-02/BLENDER_RETURN/SCENELET_RECIPE_2CELL.json' }) };
// Pure deterministic rebake. Caller persists through the repository's file-edit tool.
for (const tile of original.hexTiles.tiles.filter(t => t.verticalTopology))
  tile.verticalTopology.contractStatus = 'PASS_ADDITIVE_DATA';
export { original as catalogBundle, seamReport };
if (process.argv[1] === new URL(import.meta.url).pathname) {
  if (process.argv.includes('--patch')) {
    const file = new URL('data/HEX_BROWSER_MEASUREMENTS.json', root).pathname;
    const indent = (obj, spaces) => JSON.stringify(obj, null, 2).split('\n').map(s => ' '.repeat(spaces) + s).join('\n');
    const changes = original.hexTiles.tiles.filter(t => t.verticalTopology &&
      JSON.stringify(t) !== JSON.stringify(before.hexTiles.tiles.find(b=>b.key===t.key))).map(t => [
      indent(before.hexTiles.tiles.find(b => b.key === t.key), 6) + ',', indent(t, 6) + ',',
    ]);
    const runtime = '    "runtime": ' + indent(before.hexTiles.runtime, 4).slice(4);
    if (!before.hexTiles.verticalContract) changes.push([runtime, runtime + ',\n' +
      '    "verticalContract": ' + JSON.stringify(original.hexTiles.verticalContract, null, 2).split('\n').join('\n    ')]);
    const sourceText = await readFile(file, 'utf8');
    if (!changes.every(([old]) => sourceText.includes(old))) throw new Error('Catalog formatting/source changed');
    let seamExists=true; try { await access(new URL('LEVEL_SLOPE/SEAM_REPORT.json',root)); } catch { seamExists=false; }
    console.log('*** Begin Patch\n' + (changes.length ? '*** Update File: ' + file + '\n' + changes.map(([a,b]) =>
      '@@\n' + a.split('\n').map(s => '-' + s).join('\n') + '\n' + b.split('\n').map(s => '+' + s).join('\n')).join('\n') +
      '\n' : '') + (!seamExists ? '*** Add File: ' + new URL('LEVEL_SLOPE/SEAM_REPORT.json', root).pathname + '\n' +
      JSON.stringify(seamReport,null,2).split('\n').map(s => '+' + s).join('\n') + '\n' : '') + '*** End Patch');
  } else console.log(JSON.stringify({ catalogBundle: original, seamReport }, null, 2));
}
