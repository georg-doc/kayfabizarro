export const DEFAULT_CONTRACT=Object.freeze({
  sourceMode:'direct',
  returnAnchor:'/',
  selectedActor:'graft-driver',
  unlockedLevel:'1',
  seed:'KFB-CA2'
});

export function readContract(search=''){
  const q=new URLSearchParams(search);
  const out={};
  for(const [key,value] of Object.entries(DEFAULT_CONTRACT)){
    const raw=q.get(key);
    out[key]=raw===null||raw===''?value:raw;
  }
  return Object.freeze(out);
}

export function arenaQuery(contract){
  const q=new URLSearchParams({
    ca2:'1',
    slice:'combat-integration-v2',
    sourceMode:contract.sourceMode,
    returnAnchor:contract.returnAnchor,
    selectedActor:contract.selectedActor,
    unlockedLevel:String(contract.unlockedLevel),
    seed:contract.seed
  });
  return q.toString();
}
