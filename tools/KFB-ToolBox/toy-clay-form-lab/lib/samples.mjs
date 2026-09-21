import {roundedBox,capsuleBeam,softSpire,softArch,toyMaterial,toyStats} from './kfb-toy-primitives.mjs';

export const SAMPLE_IDS=['panel','eiffel','cologne'];
export const PART_BUDGETS=Object.freeze({panel:4,eiffel:14,cologne:16});
const mat=(THREE,color)=>toyMaterial(THREE,color);

export function buildPanel(THREE){
  const g=new THREE.Group();g.name='toy-panel-3-buttons';
  const body=mat(THREE,'#e7c76b'),red=mat(THREE,'#d85a49'),blue=mat(THREE,'#6f9fc7'),green=mat(THREE,'#7ea46c');
  g.add(roundedBox(THREE,{name:'panel-body',size:[4.6,2.45,.62],radius:.34,material:body,position:[0,1.35,0]}));
  const xs=[-1.35,0,1.35],ms=[red,green,blue];
  xs.forEach((x,i)=>g.add(roundedBox(THREE,{name:'button-'+(i+1),size:[.94,.68,.36],radius:.30,material:ms[i],position:[x,1.36,.45]})));
  g.userData.kfbToySample='panel';g.userData.kfbToyStats=toyStats(g);return g;
}

export function buildEiffel(THREE){
  const g=new THREE.Group();g.name='toy-eiffel-icon';
  const iron=mat(THREE,'#7b6559'),deck=mat(THREE,'#d2b57d'),dark=mat(THREE,'#584943');
  const feet=[[-2.1,0,-2.1],[2.1,0,-2.1],[-2.1,0,2.1],[2.1,0,2.1]];
  const mid=[[-.92,3.15,-.92],[.92,3.15,-.92],[-.92,3.15,.92],[.92,3.15,.92]];
  const high=[[-.34,5.35,-.34],[.34,5.35,-.34],[-.34,5.35,.34],[.34,5.35,.34]];
  feet.forEach((p,i)=>g.add(capsuleBeam(THREE,{name:'leg-low-'+i,start:p,end:mid[i],radius:.28,material:iron})));
  mid.forEach((p,i)=>g.add(capsuleBeam(THREE,{name:'leg-high-'+i,start:p,end:high[i],radius:.20,material:iron})));
  g.add(roundedBox(THREE,{name:'deck-low',size:[2.75,.40,2.75],radius:.17,material:deck,position:[0,3.12,0]}));
  g.add(roundedBox(THREE,{name:'deck-high',size:[1.55,.34,1.55],radius:.15,material:deck,position:[0,5.32,0]}));
  g.add(roundedBox(THREE,{name:'summit-room',size:[.95,.72,.95],radius:.22,material:dark,position:[0,5.86,0]}));
  g.add(capsuleBeam(THREE,{name:'mast',start:[0,6.15,0],end:[0,7.35,0],radius:.12,material:dark}));
  g.add(softArch(THREE,{name:'front-arch',radius:1.48,tube:.17,material:iron,position:[0,1.48,2.0]}));
  g.userData.kfbToySample='eiffel';g.userData.kfbToyStats=toyStats(g);return g;
}

export function buildCologne(THREE){
  const g=new THREE.Group();g.name='toy-cologne-cathedral-icon';
  const stone=mat(THREE,'#8c8578'),dark=mat(THREE,'#5f5a52'),glass=mat(THREE,'#5f8192');
  g.add(roundedBox(THREE,{name:'foundation',size:[5.8,.55,5.9],radius:.24,material:dark,position:[0,.275,0]}));
  g.add(roundedBox(THREE,{name:'nave',size:[3.8,3.1,4.6],radius:.34,material:stone,position:[0,1.95,-.25]}));
  g.add(roundedBox(THREE,{name:'west-facade',size:[4.8,3.7,1.05],radius:.30,material:stone,position:[0,2.25,2.20]}));
  for(const x of [-1.42,1.42]){
    g.add(roundedBox(THREE,{name:'tower-body-'+x,size:[1.45,4.65,1.45],radius:.28,material:stone,position:[x,2.9,2.15]}));
    g.add(roundedBox(THREE,{name:'tower-crown-'+x,size:[1.22,1.15,1.22],radius:.25,material:dark,position:[x,5.43,2.15]}));
    g.add(softSpire(THREE,{name:'tower-spire-'+x,radius:.70,height:2.18,material:dark,position:[x,5.95,2.15]}));
  }
  g.add(roundedBox(THREE,{name:'portal',size:[1.25,1.72,.24],radius:.32,material:dark,position:[0,1.28,2.77]}));
  g.add(roundedBox(THREE,{name:'rose-window',size:[1.02,1.02,.20],radius:.45,material:glass,position:[0,3.12,2.78]}));
  g.add(roundedBox(THREE,{name:'clerestory',size:[2.25,.88,.20],radius:.31,material:glass,position:[0,3.20,-2.58]}));
  g.userData.kfbToySample='cologne';g.userData.kfbToyStats=toyStats(g);return g;
}

export function buildSample(THREE,id){
  const fn={panel:buildPanel,eiffel:buildEiffel,cologne:buildCologne}[id];
  if(!fn)throw Error('Unknown toy sample '+id);
  const g=fn(THREE),budget=PART_BUDGETS[id];
  if(g.userData.kfbToyStats.parts>budget)throw Error(id+' exceeded toy part budget');
  return g;
}
