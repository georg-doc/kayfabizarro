import fs from 'node:fs';

const P = {
  env: 'tools/KFB-ToolBox/lib/environment-preview.v1.js',
  atlas: 'tools/KFB-ToolBox/_inbox/KFB_Resident_Atlas_S9/S40-disco-rotation/lib/host-env.js',
  atlasHtml: 'tools/KFB-ToolBox/_inbox/KFB_Resident_Atlas_S9/S40-disco-rotation/KFB_Resident_Atlas_S9.html',
  toolbox: 'tools/KFB-ToolBox/_inbox/KFB ToolBox Production-01/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/KFB ToolBox Production-01.dc.html'
};
const S = Object.fromEntries(Object.entries(P).map(([k,p]) => [k, fs.readFileSync(p, 'utf8')]));
const checks = [];
const ok = (name, pass) => checks.push({ name, pass: !!pass });

ok('shared schema', S.env.includes("kfb.environment-preview/0.1-candidate"));
ok('current Travel source head pinned', S.env.includes('8614282aab2ced43bb5dda9fcf7abadf9768100a'));
ok('sky preset source is consumed not copied per host', S.env.includes("from '../../../travel/wip/travel_globe_wsa/globe-v13/sky-presets.js'"));
ok('WORLD_MATCH supported', S.env.includes("'WORLD_MATCH'"));
ok('SOURCE_ISOLATION supported', S.env.includes("'SOURCE_ISOLATION'"));
ok('CONSUMER_PRESET supported', S.env.includes("'CONSUMER_PRESET'"));
ok('ground support supported', S.env.includes("'ground'"));
ok('terrainPatch declared', S.env.includes("'terrainPatch'"));
ok('worldZone declared', S.env.includes("'worldZone'"));
ok('terrain/world support fails closed without provider', S.env.includes('requires a real host supportProvider'));
ok('adapter creates no renderer', !S.env.includes('new THREE.WebGLRenderer'));
ok('adapter creates no camera', !S.env.includes('new THREE.PerspectiveCamera'));
ok('adapter exposes resolved profile', S.env.includes('resolveProfile'));
ok('adapter restores host scene', S.env.includes('restoreScene(snapshot'));
ok('adapter disposes provider presentation', S.env.includes('function dispose()'));

ok('Resident Atlas host consumes shared adapter', S.atlas.includes("../../../../lib/environment-preview.v1.js"));
ok('Resident Atlas keeps World Match', S.atlas.includes("'WORLD_MATCH'"));
ok('Resident Atlas keeps Source Isolation', S.atlas.includes("'SOURCE_ISOLATION'"));
ok('Resident Atlas wrapper has no own ShaderMaterial', !S.atlas.includes('ShaderMaterial'));
ok('Resident Atlas wrapper has no own terrain/noise generator', !S.atlas.includes('kfbm(') && !S.atlas.includes('NOISE'));
ok('Resident Atlas UI identifies shared environment', S.atlasHtml.includes('Shared KFB Environment'));

ok('ToolBox keeps exactly one WebGL renderer', (S.toolbox.match(/new THREE\.WebGLRenderer/g) || []).length === 1);
ok('ToolBox consumes shared adapter', S.toolbox.includes("/tools/KFB-ToolBox/lib/environment-preview.v1.js"));
ok('ToolBox defaults to World Match', S.toolbox.includes("mode: 'WORLD_MATCH'"));
ok('ToolBox offers Source Isolation', S.toolbox.includes("SOURCE_ISOLATION::world.current"));
ok('ToolBox offers Evening consumer preset', S.toolbox.includes("CONSUMER_PRESET::world.evening"));
ok('ToolBox offers Night consumer preset', S.toolbox.includes("CONSUMER_PRESET::world.night"));
ok('ToolBox updates shared environment in existing frame loop', S.toolbox.includes('if (this.ENV) this.ENV.update(dt);'));
ok('ToolBox disposes shared environment', S.toolbox.includes('if (this.ENV) this.ENV.dispose();'));
ok('ToolBox exposes probe for review automation', S.toolbox.includes('window.__kfbEnvPreview = this.ENV'));

const failed = checks.filter(x => !x.pass);
for (const x of checks) console.log((x.pass ? 'PASS' : 'FAIL') + ' · ' + x.name);
console.log('\n' + (checks.length - failed.length) + '/' + checks.length + ' PASS');
if (failed.length) process.exit(1);
