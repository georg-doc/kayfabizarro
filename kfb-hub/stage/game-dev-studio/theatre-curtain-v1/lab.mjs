import {mountKFBTheatreCurtain,CURTAIN_TEXTURES} from '/game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs';
const stage=document.getElementById('stage'),status=document.getElementById('status');
const ui={open:document.getElementById('open'),close:document.getElementById('close'),impact:document.getElementById('impact'),reset:document.getElementById('reset'),fabric:document.getElementById('fabric'),wind:document.getElementById('wind'),windOut:document.getElementById('windOut')};
window.__KFB_CURTAIN_V1__={ready:false,error:null,source:{three:'0.186.0',threeExampleCommit:'7300402f96c23bfa2174ffc0da01fb4e277d33da',threeExampleBlob:'0b3c18d87ac0d2428e6a558b6d09889e425dd537',kfbImplementationHead:'4e2de202f82b0f0d7dfa3241d6f0416a84eb15d0'},snapshot:()=>null};
try{
  const curtain=await mountKFBTheatreCurtain(stage,{texture:'velour_velvet',tint:'#8c3f37',wind:.62});
  Object.assign(window.__KFB_CURTAIN_V1__,{ready:true,curtain,snapshot:()=>curtain.snapshot()});
  const refresh=()=>{const s=curtain.snapshot();status.textContent=s.backend+' · '+s.state+' · open '+s.openProgress.toFixed(2)+' · '+(CURTAIN_TEXTURES[s.texture]?.label||s.texture)+' · '+s.hooks+' visible rings'};
  ui.open.onclick=()=>{curtain.setState('open');refresh()};
  ui.close.onclick=()=>{curtain.setState('close');refresh()};
  ui.impact.onclick=()=>{curtain.impulse({x:0,y:-.2,strength:2.15,radius:1.28});refresh()};
  ui.reset.onclick=()=>{curtain.reset();refresh()};
  ui.fabric.onchange=async()=>{ui.fabric.disabled=true;status.textContent='Loading '+CURTAIN_TEXTURES[ui.fabric.value].label+'...';await curtain.setMaterial(ui.fabric.value);ui.fabric.disabled=false;refresh()};
  ui.wind.oninput=()=>{curtain.setWind(ui.wind.value);ui.windOut.textContent=Number(ui.wind.value).toFixed(2);refresh()};
  addEventListener('keydown',e=>{if(/input|select/i.test(e.target?.tagName||''))return;const k=e.key.toLowerCase();if(k==='o')curtain.setState('open');if(k==='c')curtain.setState('close');if(k==='i')curtain.impulse({x:0,y:-.2,strength:2.15,radius:1.28});if(k==='r')curtain.reset();refresh()});
  setInterval(refresh,250);refresh();
}catch(error){console.error(error);window.__KFB_CURTAIN_V1__.error=String(error?.stack||error);status.textContent='ERROR · '+String(error?.message||error)}
