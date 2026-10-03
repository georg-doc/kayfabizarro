import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const target=process.env.KFB_FREEPLAY_URL || 'http://127.0.0.1:8765/tools/KFB-ToolBox/actionfigure-motion-freeplay-01/index.html';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:800}});
const consoleErrors=[],pageErrors=[];
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
page.on('pageerror',e=>pageErrors.push(String(e)));
await page.goto(target,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForFunction(()=>document.querySelector('#stage')?.dataset.ready==='1',null,{timeout:90000});

const initial=await page.evaluate(()=>window.__KFB_FREEPLAY__.snapshot());
assert.equal(initial.ready,true);
assert.match(initial.actor.source,/ActionFigure\.glb$/);
assert.equal(initial.ownerPin,'2f76a5a38e3e692e6e1fc3b43bcca547e45a6c9e');
assert.deepEqual(initial.choices,{jog:'a',run:'a',sprint:'a'});

await page.keyboard.down('w');
await page.waitForTimeout(1800);
let moving=await page.evaluate(()=>window.__KFB_FREEPLAY__.snapshot());
assert.ok(moving.speed>.8,JSON.stringify(moving));
assert.ok(['jog','run.easy','run'].includes(moving.semanticState),JSON.stringify(moving));

await page.keyboard.down('Shift');
await page.waitForTimeout(1600);
let sprint=await page.evaluate(()=>window.__KFB_FREEPLAY__.snapshot());
assert.equal(sprint.semanticState,'sprint',JSON.stringify(sprint));
assert.match(sprint.clip,/sprint_a$/);

await page.keyboard.up('Shift');
await page.keyboard.up('w');
await page.waitForTimeout(350);
await page.keyboard.down('s');
await page.waitForTimeout(750);
let reverse=await page.evaluate(()=>window.__KFB_FREEPLAY__.snapshot());
assert.equal(reverse.semanticState,'backward',JSON.stringify(reverse));
assert.match(reverse.clip,/walk_backward_a$/);
await page.keyboard.up('s');

await page.keyboard.press('Space');
await page.waitForTimeout(120);
let jump=await page.evaluate(()=>window.__KFB_FREEPLAY__.snapshot());
assert.equal(jump.grounded,false,JSON.stringify(jump));
assert.ok(jump.jumpY>0,JSON.stringify(jump));
assert.ok(['jump.start','jump.air'].includes(jump.semanticState),JSON.stringify(jump));

await page.locator('[data-choice="jog"][data-variant="b"]').click();
await page.locator('[data-choice="run"][data-variant="b"]').click();
await page.locator('[data-choice="sprint"][data-variant="b"]').click();
const choices=await page.evaluate(()=>window.__KFB_FREEPLAY__.snapshot().choices);
assert.deepEqual(choices,{jog:'b',run:'b',sprint:'b'});

await page.screenshot({path:'actionfigure-freeplay.png',fullPage:true});
fs.writeFileSync('actionfigure-freeplay-proof.json',JSON.stringify({
  target,initial,moving,sprint,reverse,jump,choices,consoleErrors,pageErrors
},null,2)+'\n');
assert.deepEqual(consoleErrors,[]);
assert.deepEqual(pageErrors,[]);
await browser.close();
console.log(JSON.stringify({pass:true,initial,moving,sprint,reverse,jump,choices},null,2));
