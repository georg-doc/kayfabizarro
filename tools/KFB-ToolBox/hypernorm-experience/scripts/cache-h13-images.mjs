import fs from 'node:fs';
const src=fs.readFileSync('reference/H13.dc.html','utf8');
const rows=[...src.matchAll(/P\('([^']+)', '([^']+)', '([^']+)'/g)].slice(0,12);
fs.mkdirSync('dist/experience/archive',{recursive:true});
for(const [,id,file,title] of rows){const url='https://tile.loc.gov/storage-services/service/pnp/'+file;try{const r=await fetch(url,{signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error(r.status);fs.writeFileSync('dist/experience/archive/'+id+'.jpg',new Uint8Array(await r.arrayBuffer()));console.log('CACHED '+id);}catch(e){console.log('UNAVAILABLE '+id+' '+e.message);}}
