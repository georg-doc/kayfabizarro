import {mountRoadProof} from './road-proof.mjs';
import {mountHouseProof} from './house-proof.mjs';
import {mountFacadeProof} from './facade-proof.mjs';

const $=s=>document.querySelector(s);
const city=await fetch('../../data/huerth-v0/normalized.json',{cache:'no-store'}).then(r=>{
  if(!r.ok)throw new Error('Hürth normalized source '+r.status);
  return r.json();
});
const building=city.features.buildings.find(b=>b.id==='way/371401492');
if(!building)throw new Error('Pinned house source way/371401492 missing');

const proofs={
  road:mountRoadProof($('#roadCanvas'),{
    wireButton:$('#roadWire'),
    centerButton:$('#roadCenter'),
    metrics:$('#roadMetrics')
  }),
  house:mountHouseProof($('#houseCanvas'),building,{
    wireButton:$('#houseWire'),
    metrics:$('#houseMetrics')
  }),
  facade:mountFacadeProof($('#facadeCanvas'),{
    sourceSelect:$('#paletteSource'),
    rerollButton:$('#paletteReroll'),
    metrics:$('#facadeMetrics'),
    labels:$('#facadeLabels')
  })
};

const tabs=[...document.querySelectorAll('[data-proof]')];
const panels=[...document.querySelectorAll('.proof-panel')];
function activate(id){
  tabs.forEach(b=>b.classList.toggle('active',b.dataset.proof===id));
  panels.forEach(p=>p.classList.toggle('active',p.id==='proof-'+id));
  history.replaceState(null,'','#'+id);
}
tabs.forEach(b=>b.onclick=()=>activate(b.dataset.proof));
activate(location.hash.replace('#','')||'road');

window.__KFB_HUERTH_ARCH_PROOFS__=Object.freeze({
  report:()=>({
    schema:'kfb.huerth-recovery-architecture-proofs/0.1',
    sourceCity:city.id,
    sourceHouse:building.id,
    frozenR2:'4cc496e79af80c7f8419ffb14f7f5d8daeb0b679',
    r2Modified:false,
    road:proofs.road.report(),
    house:proofs.house.report(),
    facade:proofs.facade.report(),
    humanAcceptance:'PENDING'
  })
});
