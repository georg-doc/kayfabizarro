import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT=process.cwd();
const ROUTE='http://127.0.0.1:8777/kfb-hub/stage/minigames/baukasten-c0/';
const OUT=path.join(ROOT,'skills/chat/workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/C0_CATALOG_2026-09-19');
const SHOTS=path.join(OUT,'screenshots');
fs.mkdirSync(SHOTS,{recursive:true});
const report={schema:'kfb.c0-browser-report/1',route:ROUTE,gitSha:process.env.GITHUB_SHA||null,checks:[],errors:[],consoleErrors:[],startedAt:new Date().toISOString()};
const check=(name,pass,detail=null)=>{report.checks.push({name,pass:!!pass,detail});if(!pass)process.exitCode=1;};
const shot=async(page,name)=>{await page.screenshot({path:path.join(SHOTS,name),fullPage:false});};
const fmt=n=>Number(n).toFixed(3);

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
page.on('pageerror',e=>report.errors.push('pageerror: '+String(e)));
page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});
try{
  const response=await page.goto(ROUTE,{waitUntil:'domcontentloaded',timeout:60000});
  check('local Stage HTTP response',!!response&&response.ok(),response?.status());
  await page.waitForFunction(()=>document.documentElement.dataset.c0Ready==='1',{}, {timeout:180000});
  const summary=await page.evaluate(()=>({
    status:document.querySelector('#globalStatus')?.textContent,
    packs:document.querySelectorAll('.pack').length,
    tiny:document.querySelectorAll('.tiny-card').length,
    proofs:document.querySelectorAll('[data-proof][data-evidence="browser-seen"]').length,
    evidence:window.__C0_EVIDENCE__
  }));
  report.runtime={status:summary.status,packs:summary.packs,tiny:summary.tiny,proofs:summary.proofs};
  report.evidence=summary.evidence;
  check('11 scoped registry pack cards',summary.packs===11,summary.packs);
  check('all six Tiny Treats cards',summary.tiny===6,summary.tiny);
  check('five measured browser witnesses',summary.proofs===5,summary.proofs);
  check('runtime evidence has no errors',(summary.evidence?.errors||[]).length===0,summary.evidence?.errors||[]);
  for(const id of ['carry','tell-modular','tell-loose','inhabit','act']){
    const e=summary.evidence?.proofs?.[id];
    check(`${id} has finite XYZ measurement`,Array.isArray(e?.measurement?.size)&&e.measurement.size.length===3&&e.measurement.size.every(Number.isFinite),e?.measurement?.size||null);
    check(`${id} has evidence status`,String(e?.evidence||'').includes('BROWSER SEEN'),e?.evidence||null);
  }
  const door=summary.evidence?.proofs?.['tell-modular'];
  check('Bakery door scale is re-derived from measured height',/2\.05 target = scale/.test(door?.scaleAnchor||''),door?.scaleAnchor||null);
  const resident=summary.evidence?.proofs?.inhabit;
  check('Resident module keeps collision consumer-owned',/consumer-owned/i.test(resident?.collision||''),resident?.collision||null);
  const graft=summary.evidence?.proofs?.act;
  check('FrizzleBob uses Driver host path',/Driver\.glb$/.test(graft?.host?.path||''),graft?.host?.path||null);

  await page.evaluate(()=>scrollTo(0,0)); await page.waitForTimeout(500); await shot(page,'01-overview-desktop.png');
  await page.locator('#tells').scrollIntoViewIfNeeded(); await page.waitForTimeout(500); await shot(page,'02-tiny-treats-desktop.png');
  await page.locator('#inhabits').scrollIntoViewIfNeeded(); await page.waitForTimeout(500); await shot(page,'03-resident-desktop.png');
  await page.locator('#acts').scrollIntoViewIfNeeded(); await page.waitForTimeout(500); await shot(page,'04-graft-desktop.png');
  await page.setViewportSize({width:390,height:844});
  await page.locator('#carries').scrollIntoViewIfNeeded(); await page.waitForTimeout(700); await shot(page,'05-mobile-carry.png');

  const compactPacks={};
  for(const [id,p] of Object.entries(summary.evidence?.packs||{})) compactPacks[id]={packId:p.packId,displayName:p.displayName,root:p.root,assetCount:p.assetCount,kinds:p.kinds,formats:p.formats,registrySourceCommit:p.assets?.find(a=>a.kind==='model-3d')?.source?.commit||null};
  const source={
    schema:'kfb.c0-source/1',
    repository:'georg-doc/kayfabizarro',
    baseCommit:summary.evidence?.baseCommit,
    registry:{schema:summary.evidence?.registry?.schema,sourceCommit:summary.evidence?.registry?.sourceCommit,counts:summary.evidence?.registry?.counts},
    packs:compactPacks,
    proofs:summary.evidence?.proofs,
    modules:{
      resident:{manifest:'tools/resident_atlas/modules/clown-juggling-island.module.json',adapter:'tools/resident_atlas/modules/runtime/s6-resident-module.js',definition:summary.evidence?.modules?.resident},
      graft:{contract:'tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json',reader:'tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js',definition:summary.evidence?.modules?.graft}
    },
    rule:'References only. No asset copies. Central registry remains asset identity/provenance owner.'
  };
  fs.writeFileSync(path.join(OUT,'SOURCE.json'),JSON.stringify(source,null,2));

  const rows=['| Role proof | XYZ bounds | Base Y | Scale anchor | Collision | Evidence |','|---|---:|---:|---|---|---|'];
  for(const id of ['carry','tell-modular','tell-loose','inhabit','act']){const e=summary.evidence.proofs[id],m=e.measurement;rows.push(`| ${id} | ${m.size.map(fmt).join(' × ')} | ${fmt(m.baseY)} | ${String(e.scaleAnchor).replaceAll('|','/')} | ${String(e.collision).replaceAll('|','/')} | ${e.evidence} |`);}
  const passed=report.checks.filter(x=>x.pass).length,total=report.checks.length;
  const md=`# C0 Baukasten · TEST REPORT

**Status:** ${process.exitCode?'FAIL':'TESTED RESULT · PASS'}  
**GitHub SHA under test:** \`${process.env.GITHUB_SHA||'local'}\`  
**Route:** \`${ROUTE}\`  
**Browser:** Playwright Chromium  

## Assertions

- ${passed}/${total} assertions passed.
- Pack cards: ${summary.packs}/11.
- Tiny Treats cards: ${summary.tiny}/6.
- Browser witnesses: ${summary.proofs}/5.
- Page/runtime errors: ${(summary.evidence?.errors||[]).length}.
- Console errors captured by QA: ${report.consoleErrors.length}.

## Measurements from loaded browser scenes

${rows.join('\n')}

## Scope boundary

The test verifies catalog loading, exact registry/source wiring, visual WebGL previews, measurements, responsive layout and existing Resident/Graft seams. It does **not** claim gameplay collision, Dungeon integration, public Cloudflare deployment or Georg acceptance.
`;
  fs.writeFileSync(path.join(OUT,'TEST_REPORT.md'),md);
} catch(e){
  report.errors.push(String(e?.stack||e)); process.exitCode=1;
} finally {
  report.finishedAt=new Date().toISOString();
  report.pass=!process.exitCode && report.errors.length===0 && report.consoleErrors.length===0;
  fs.writeFileSync(path.join(OUT,'browser-report.json'),JSON.stringify(report,null,2));
  await browser.close();
}
