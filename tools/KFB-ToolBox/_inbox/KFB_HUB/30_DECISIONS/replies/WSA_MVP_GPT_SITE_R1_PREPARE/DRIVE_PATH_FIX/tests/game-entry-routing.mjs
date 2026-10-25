import assert from 'node:assert/strict';
import {canonicalEntry,fetchPackageAsset} from '../lib/game-entry-routing.mjs';
import {protectedFetch} from '../lib/mvp-delivery.mjs';
let passed=0;async function check(name,fn){await fn();passed++;console.log('PASS '+name);}
const request=(path)=>new Request('https://site.test'+path);
for(const path of ['/game-package','/game-package/','/game-package/index.html','/index.html'])await check('canonical alias '+path,()=>{const r=canonicalEntry(request(path+'?kfbqa=1'));assert.equal(r.status,307);assert.equal(r.headers.get('Location'),'/?kfbqa=1');assert.ok(!r.headers.get('Location').includes('#'));});
for(const path of ['/','/assets/a.js','/h15/','/raw/main/a'])await check('leave route '+path,()=>assert.equal(canonicalEntry(request(path)),null));
await check('index redirect consumed internally',async()=>{const seen=[];const binding={async fetch(req){seen.push(new URL(req.url).pathname);return seen.length===1?new Response(null,{status:307,headers:{Location:'/game-package/?kfbqa=1'}}):new Response('<html>actual package</html>');}};const r=await fetchPackageAsset(request('/?kfbqa=1'),binding,'/index.html');assert.equal(r.status,200);assert.equal(r.headers.has('Location'),false);assert.deepEqual(seen,['/game-package/index.html','/game-package/']);assert.match(await r.text(),/actual package/);});
await check('unredirected index preserved',async()=>{const r=new Response('original');assert.equal(await fetchPackageAsset(request('/'),{fetch:async()=>r},'/index.html'),r);});
await check('external or unexpected redirect rejected',async()=>{for(const Location of ['https://evil.test/game-package/','/elsewhere/','/game-package/?unexpected=1','/game-package/#x'])await assert.rejects(()=>fetchPackageAsset(request('/'),{fetch:async()=>new Response(null,{status:307,headers:{Location}})},'/index.html'));});
await check('non-index redirects rejected',async()=>assert.rejects(()=>fetchPackageAsset(request('/'),{fetch:async()=>new Response(null,{status:307,headers:{Location:'/elsewhere'}})},'/assets/a.js')));
await check('second redirect rejected',async()=>assert.rejects(()=>fetchPackageAsset(request('/'),{fetch:async()=>new Response(null,{status:307,headers:{Location:'/game-package/'}})},'/index.html')));
await check('aliases remain behind application authorization',async()=>{let called=false;const r=await protectedFetch(request('/game-package'),{SITE_USER:'georg',SITE_PASS:'test'},{asset:async(req)=>{called=true;return canonicalEntry(req)}});assert.equal(r.status,401);assert.equal(called,false);});
console.log(JSON.stringify({schema:'kfb.entry-routing-test/1',passed,failed:0,scope:'candidate source; does not prove hosted static dispatch protection'}));
