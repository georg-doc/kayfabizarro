import fs from 'node:fs';

const read=(p)=>fs.readFileSync(p,'utf8');
const json=(p)=>JSON.parse(read(p));
let pass=0;
const ok=(name,cond)=>{ if(!cond) throw new Error('FAIL '+name); pass++; console.log('ok '+pass+' - '+name); };

const root='tools/KFB-ToolBox/worldbuilder/world-integration-01/';
const app=read('tools/KFB-ToolBox/worldbuilder/wb2-design-01/wb2d-app.js');
const presentation=read('tools/KFB-ToolBox/worldbuilder/wb2-design-01/wb2d-presentation.js');
const actor=read(root+'wi1-actor.js');
const play=read(root+'wi1-play.js');
const world=read(root+'wi1-world.js');
const self=read(root+'wi1-selftest.js');
const terrain=read('tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/terrain-sculpt.js');
const edit=read('tools/KFB-ToolBox/lib/edit-layer.js');
const huerth=json(root+'fixtures/huerth-crop-v0.json');
const alt=json(root+'fixtures/huerth-alstaedten-v0.json');
const cologne=json(root+'fixtures/cologne-dom-crop-v0.json');

ok('accepted terrain-sculpt owner retained',terrain.includes('ensureSculpt')&&terrain.includes('applyDabToGeometry'));
ok('accepted edit-layer owner retained',edit.includes('makeEditLayer')&&edit.includes('drop()'));
ok('WB2 design imports existing terrain owner',app.includes("../wb2-terrain-sculpt-01/terrain-sculpt.js"));
ok('WB2 design imports existing shared edit-layer',app.includes("../../lib/edit-layer.js"));
ok('World r2 uses ToolBox profile immutable pin',actor.includes('5dcf34bcdf9d87445e927c98f60d41adae72f00e'));
ok('World r2 requires ToolBox consumer schema',actor.includes("kfb.locomotion-profile-set/0.1#consumer"));
ok('World r2 semantic source map is profile-driven',actor.includes('ToolBox locomotion role missing')&&!actor.includes("const CANON = {\n  idle:"));
ok('sprint consumes source-backed ToolBox role',play.includes("sprint: { clip: 'sprint' }")&&!play.includes('VARIANTS.sprint'));
ok('World movement still owns controller',play.includes('createWalkController')&&play.includes('walker.setParams'));
ok('World does not export a second movement controller',!actor.includes('createWalkController'));
ok('World integration uses stable local presentation seam',world.includes("const ROOT = new URL('./', import.meta.url).href;"));
ok('WB2 presentation uses stable WorldBuilder presentation modules',presentation.includes("../presentation/wd-light.js")&&presentation.includes("../presentation/wd-look.js"));
ok('Hürth fixture parses with buildings',Array.isArray(huerth.buildings)&&huerth.buildings.length>100);
ok('Alstädten fixture parses with buildings',Array.isArray(alt.buildings)&&alt.buildings.length>100);
ok('Cologne fixture parses with protected landmark data',Array.isArray(cologne.buildings)&&cologne.buildings.length>100&&!!cologne.landmark);
ok('World selftest includes sprint semantic state',self.includes("'run', 'sprint', 'backward'"));
ok('World selftest covers shared scene document',self.includes('scene document is a WB2 document'));
ok('World selftest covers facade rule',self.includes('FACADE_RULE'));
ok('World selftest covers host support',self.includes('Support')||self.includes('support'));
ok('World selftest preserves save/reload',self.includes('Reload')||self.includes('reload'));

console.log('WORLD R2 STATIC PASS '+pass+'/'+pass);
