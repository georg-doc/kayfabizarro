import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateVfxCatalog,vfxRows,vfxReference,vfxSearchText,vfxPreviewURL,publicVfxURL,loadVfxCatalog,VFX_LIVE_URL} from '../librarian/vfx-catalog.js';
const source = JSON.parse(fs.readFileSync(new URL('../librarian/live/vfx-katalog.r1.json',import.meta.url)));
assert.equal(validateVfxCatalog(source),source);
assert.equal(vfxRows(source).length,127);
assert.equal(source.spender.length,10);
assert.deepEqual(source.zahlen.nach_status,{'vendored ungenutzt':72,'im Spiel':20,'nur extern':35});
const original = JSON.stringify(source);
const thunder=vfxRows(source).find(row=>row.vfxEffect.id==='elements.thunderstrike');
assert.equal(vfxReference(thunder).parameter.intensity,1);
assert.equal(vfxReference(thunder).parameter.branches,8);
assert(vfxSearchText(thunder).includes('elements.thunderstrike'));
const quarks=vfxRows(source).find(row=>row.vfxEffect.id==='quarks.muendung');
assert.equal(vfxReference(quarks).parameter.material,null);
assert.equal(vfxReference(quarks).parameter.waffe,null);
assert.deepEqual(vfxReference(thunder,{werte:[0,false,null,'unbekannt']}).parameter,[0,false,null,'unbekannt']);
assert.equal(vfxReference(thunder,{werte:'unbekannt'}).parameter,'unbekannt');
assert.equal(JSON.stringify(source),original);
const newer=structuredClone(source);newer.stand='test refresh';
assert.equal(validateVfxCatalog(newer).stand,'test refresh');
const invalid=structuredClone(source);invalid.spender[0].effekte[0].status='mismatched';assert.throws(()=>validateVfxCatalog(invalid));
for (const key of ['apiKey','inboxFileId','object_key']) {
  const unsafe=structuredClone(source);unsafe[key]='not-public';assert.throws(()=>validateVfxCatalog(unsafe));
}
for (const url of ['https://private.example.com/image.webp','https://cdn.patch.gg/private/image.webp','https://cdn.patch.gg/image.webp?token=123','https://user:pass@cdn.patch.gg/image.webp','javascript:alert(1)']) {
  assert.equal(publicVfxURL(url),null);assert.equal(vfxPreviewURL(url),null);
}
assert(vfxRows(source).filter(row=>vfxPreviewURL(row.vfxEffect.vorschau.url)).length>100);
assert.equal(vfxPreviewURL('https://other.example.com/preview.webp'),null);
const unknown=structuredClone(source);unknown.new_metadata={zero:0,unknown:'unbekannt'};assert.equal(validateVfxCatalog(unknown),unknown);

let snapshot=null;globalThis.localStorage={getItem:()=>snapshot,setItem:(_key,value)=>{snapshot=value;}};
const originalFetch=globalThis.fetch;const calls=[];
globalThis.fetch=async(url,options)=>{calls.push({url:String(url),options});return Response.json(url===VFX_LIVE_URL?newer:source);};
let loaded=await loadVfxCatalog();assert.equal(loaded.source,'main');assert.equal(loaded.document.stand,'test refresh');
assert(calls.every(({options})=>options.cache==='no-store'&&options.credentials==='omit'));
globalThis.fetch=async()=>{throw new Error('offline');};
loaded=await loadVfxCatalog();assert.equal(loaded.source,'snapshot');assert.equal(loaded.document.stand,'test refresh');
snapshot=null;globalThis.fetch=async(url)=>{if(url===VFX_LIVE_URL)throw new Error('offline');return Response.json(source);};
loaded=await loadVfxCatalog();assert.equal(loaded.document.stand,source.stand);assert.equal(loaded.source,'snapshot');
snapshot=null;globalThis.fetch=async()=>Response.json(invalid);
assert.equal((await loadVfxCatalog()).document,null);
globalThis.fetch=originalFetch;
console.log('PASS VFX owner totals, reference values, public URLs, unknown fields, fresh main reads and fail-soft snapshot');
