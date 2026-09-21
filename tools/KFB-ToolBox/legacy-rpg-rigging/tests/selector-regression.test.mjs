import fs from 'node:fs';
import assert from 'node:assert/strict';

const tool=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const stage=fs.readFileSync(new URL('../../../../kfb-hub/stage/toolbox/legacy-rpg-rigging/app.js',import.meta.url),'utf8');

const fixed="function syncModeButtons(){$$('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));}";
const broken="function syncModeButtons(){$('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));}";

let pass=0;
for(const [name,src] of [['tool',tool],['stage',stage]]){
  assert.ok(src.includes(fixed),name+' app must use collection selector in syncModeButtons');
  assert.ok(!src.includes(broken),name+' app must not contain broken single-node selector seam');
  pass++;
  console.log('PASS',name,'collection selector');
}
console.log('KLR_KIT_F1_SELECTOR_RESULT',pass+'/2 PASS');
