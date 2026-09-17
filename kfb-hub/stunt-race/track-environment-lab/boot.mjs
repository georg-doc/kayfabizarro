import {startRaceHost} from './host-bootstrap.mjs';
import {createEnvironment} from './environment-runtime.mjs';
const $=id=>document.getElementById(id),status=$('envStatus');
function announce(text){status.textContent=text;status.hidden=false}
const isEditing=e=>e.target instanceof Element&&e.target.matches('input:not([type="checkbox"]):not([type="radio"]),select,textarea');
// Preserve editable seed/select focus. Race still owns every actual driving input.
addEventListener('keydown',e=>{if(isEditing(e))e.stopImmediatePropagation()},{capture:true});
addEventListener('keyup',e=>{if(isEditing(e))e.stopImmediatePropagation()},{capture:true});
document.addEventListener('focusin',e=>{if(isEditing(e))dispatchEvent(new Event('blur'))});
document.addEventListener('pointerdown',e=>{if(isEditing(e))e.stopPropagation()});
try{
  const json=async path=>{const r=await fetch(new URL(path,import.meta.url));if(!r.ok)throw Error(path+' HTTP '+r.status);return r.json()};
  const [manifest,recipes]=await Promise.all([json('./asset-manifest.json'),json('./environment-recipes.json')]);
  const port=await startRaceHost();announce('Loading repository scenery…');
  const env=await createEnvironment(port,{assets:manifest.assets.map(a=>({...a,sourceRepo:manifest.sourceRepo,revision:manifest.revisionPin}))},recipes,(n,total)=>announce(`Loading repository scenery · ${n}/${total}`));
  const params=new URLSearchParams(location.search),selected=params.get('world'),seed=params.get('seed')||recipes.defaultSeed;
  if(seed!==recipes.defaultSeed||selected==='surreal')env.change(selected==='surreal'?'surreal':'facility',seed);
  function sync(){const d=env.snapshot();$('worldSelect').value=d.recipe;$('seedInput').value=d.seed;document.body.dataset.world=d.recipe;
    $('worldDescription').textContent=recipes.recipes.find(r=>r.id===d.recipe).description;
    $('environmentHash').textContent=d.placementHash;$('environmentOwner').textContent=d.unchangedRoute&&d.unchangedWidths?'UNCHANGED · v0.8':'FAIL';
    $('environmentCounts').textContent=`${d.placements} placements · ${d.assetCount} assets`;$('environmentGap').textContent=d.minTerrainRoadGap.toFixed(2)+' m (visual only)';
    $('buildLabel').textContent=d.build;const url=new URL(location.href);url.searchParams.set('world',d.recipe);url.searchParams.set('seed',d.seed);history.replaceState(null,'',url);
  }
  function change(id,nextSeed){try{env.change(id,nextSeed);sync();$('gl').focus({preventScroll:true});status.hidden=true}catch(e){announce('Environment kept its last valid state. '+e.message);console.error(e)}}
  $('worldSelect').onchange=e=>change(e.target.value,$('seedInput').value);
  $('seedForm').onsubmit=e=>{e.preventDefault();change($('worldSelect').value,$('seedInput').value)};
  $('nextSeed').onclick=()=>{const s=$('seedInput').value,m=s.match(/^(.*?)(\d+)$/);change($('worldSelect').value,m?m[1]+(Number(m[2])+1):s+'-2')};
  document.querySelectorAll('[data-layer]').forEach(el=>el.onchange=()=>env.toggleLayer(el.dataset.layer,el.checked));
  $('dressingOn').onchange=e=>env.setEnabled(e.target.checked);
  window.__KFB_ENV__=env;sync();status.hidden=true;window.__KFB_ENV_READY__=true;
}catch(e){$('loading').style.display='none';announce('Could not start this donor: '+e.message);window.__KFB_ENV_ERROR__=String(e.stack||e);console.error(e)}
