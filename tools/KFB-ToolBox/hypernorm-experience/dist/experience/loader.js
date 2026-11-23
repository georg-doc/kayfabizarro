const base=new URL('./',import.meta.url);
const compatible=manifest=>manifest.schema==='kfb.site-manifest/1'&&manifest.shell==='1'&&manifest.base==='hypernorm-private-r1';
try{
 const stage=location.hash.includes('stage'),name=stage?'stage':'live';
 let manifest;
 try{const response=await fetch(new URL(name+'.json',base),{cache:'no-store'});if(!response.ok)throw Error(response.status);manifest=await response.json();}
 catch{manifest=await fetch(new URL('stage.packaged.json',base)).then(r=>r.json());}
 if(!compatible(manifest))throw Error('Experience module requires a compatible shell and private base');
 const entry=manifest.modules['kfb-hypernorm-experience'];if(!entry)throw Error('Experience is a Stage candidate. Open this page with #stage.');
 const url=new URL(entry.src,base),bytes=await fetch(url).then(r=>{if(!r.ok)throw Error(r.status);return r.arrayBuffer();});
 const actual=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
 if(actual!==entry.sha256)throw Error('Experience module integrity mismatch');
 await import(url.href);
}catch(e){document.getElementById('error').hidden=false;document.getElementById('error').textContent=e.message;}
