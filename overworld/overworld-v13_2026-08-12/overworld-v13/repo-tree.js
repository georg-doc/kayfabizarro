/* KFB Overworld — repo-tree (rt-v1.0, V5-S2)
   Was WIRKLICH im Repo liegt. Ein Verzeichnisbaum in zwei Anfragen, danach 12 Stunden aus dem
   localStorage: (1) `contents/media` → die SHA von `2D_Assets`, (2) `git/trees/<sha>?recursive=1`.
   Nicht 205 Einzelabfragen — die GitHub-API gibt einem unangemeldet 60 pro Stunde.

   Warum es das gibt: der Katalog (`media/3D_Assets/CATALOG/2d-catalog.json`) ist gegen einen
   LOKALEN Ordnerbaum gebaut, der nicht deckungsgleich mit dem Repo ist — im Enemy Pack fehlt ihm
   die Ebene `Enemies/`, also zeigen seine Pfade auf 404. Ein Werkzeug, das Assets zeigt, darf das
   nicht schlucken: der Baum ist die Wahrheit, der Katalog ist der Index, und die Differenz ist ein
   Befund (Masterplan §18.1 — wo der Katalog schweigt oder irrt, gilt er als Übergang). */
(function(){
'use strict';
const S=window.OW_SRC;
if(!S)console.error('[repo-tree] asset-source.js fehlt — der Baum kann nicht gelesen werden');
const REF=S?S.ref:'main';
const API=S?S.api:'';   // Quelle: overworld/asset-source.js
const IMG=/\.(png|jpe?g|webp|svg)$/i;
const TTL=12*3600*1000;
const KEY='kfb-2dtree:';

function cacheGet(k){
  try{const raw=localStorage.getItem(KEY+k);if(!raw)return null;
    const o=JSON.parse(raw);
    if(Date.now()-o.t>TTL)return null;
    return o.v;}catch(e){return null;}
}
function cacheSet(k,v){
  try{localStorage.setItem(KEY+k,JSON.stringify({t:Date.now(),v}));}catch(e){}
}
async function json(u){
  const r=await fetch(u,{headers:{'Accept':'application/vnd.github+json'}});
  if(!r.ok)throw new Error('GitHub-API '+r.status+(r.status===403?' (Kontingent erschöpft)':''));
  return r.json();
}

/* dir = Pfad unterhalb von media/, z. B. '2D_Assets'.
   → {files:[{path,size}], truncated, cached, count} — path ist RELATIV zu media/<dir>/ */
async function tree(dir){
  const hit=cacheGet(dir);
  if(hit)return Object.assign({},hit,{cached:true});
  const top=await json(API+'/contents/media?ref='+REF);
  const node=top.find(e=>e.name===dir&&e.type==='dir');
  if(!node)throw new Error('media/'+dir+' gibt es nicht');
  const t=await json(API+'/git/trees/'+node.sha+'?recursive=1');
  const files=(t.tree||[]).filter(e=>e.type==='blob'&&IMG.test(e.path))
    .map(e=>({path:e.path,size:e.size|0}));
  const out={files,truncated:!!t.truncated,count:files.length,at:Date.now()};
  cacheSet(dir,out);
  return Object.assign({},out,{cached:false});
}

window.OW_REPO={version:'rt-v1.0',tree,clear(){try{for(const k of Object.keys(localStorage))
  if(k.indexOf(KEY)===0)localStorage.removeItem(k);}catch(e){}},
  note:'Der echte Baum von media/2D_Assets in zwei Anfragen, 12 h gecacht. Wahrheit über dem Katalog.'};
})();
