import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const checks = [];
const ok = (name, value) => { if (!value) throw new Error('FAIL ' + name); checks.push(name); };

const html = read('index.html');
const stage = read('lab-v9/cologne-stage.v1.js');
const track = read('lab-v9/cologne-track.v1.js');
const style = read('lab-v9/option-c-style.v1.js');
const onboarding = read('ONBOARDING.md');
const colorMap = JSON.parse(read('lab-v9/color-map.v1.json'));

ok('entry exists', html.includes("import { boot } from './lab-v9/cologne-stage.v1.js'"));
ok('docs icon exists', html.includes('Doku und Weiterarbeit'));
ok('docs closed by default', html.includes('docsOpen: false'));
ok('color export exists', html.includes('onExportColorMap'));
ok('color import exists', html.includes('onImportColorMap'));
ok('three palette presets', colorMap.presets.length === 3);
ok('versioned color schema', colorMap.schema === 'kfb.track-zone-color-map.v1');
ok('seed query supported', colorMap.selection.query.includes('seed'));
ok('center line yellow', /dashMat = flat\(THREE, C\.lineYellow/.test(track));
ok('outer line orange', /C\.lineOrange[\s\S]{0,240}track-line-outer-/.test(track));
ok('ambiguous lane bands removed', !track.includes('for (const u of [-0.52, 0.52])'));
ok('supports are explicit structure only', track.includes("if (p.kind === 'STRUCTURE')"));
ok('supports are inspectable', track.includes("kfbRole = 'structure-support'"));
ok('route camera guard exists', stage.includes('function keepCameraOnRoute()'));
ok('tunnel camera ceiling exists', stage.includes("p.kind === 'TUNNEL' ? p.y + 5.4"));
ok('review tunnel start exists', stage.includes("reviewStart === 'tunnel'"));
ok('SP13KTRA boundary documented', onboarding.includes('All Rights Reserved'));
ok('no local acceptance link', !/file:\/\/|githack|github\.io/.test(html + onboarding));

console.log(`PASS ${checks.length}/${checks.length}`);
for (const name of checks) console.log('  ✓ ' + name);
