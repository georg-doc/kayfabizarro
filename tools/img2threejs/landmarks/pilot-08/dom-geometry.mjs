import {assembly,spin,add} from '../pilot-02/builder.mjs';

const TAU=Math.PI*2;

function rotateY(p,yaw){return spin(p,yaw);}
function transformVertices(vertices,position=[0,0,0],yaw=0){
  return vertices.map(v=>add(position,rotateY(v,yaw)));
}
function markNewParts(a,before,rigGroup){
  for(let i=before;i<a.parts.length;i++)a.parts[i].rigGroup=rigGroup;
}
function addSolid(a,name,zone,vertices,faces,rigGroup,position=[0,0,0],yaw=0){
  const before=a.parts.length;
  a.solid(name,zone,transformVertices(vertices,position,yaw),faces);
  markNewParts(a,before,rigGroup);
}
function addBox(a,name,zone,center,size,rigGroup,yaw=0){
  const before=a.parts.length;a.box(name,zone,center,size,yaw);markNewParts(a,before,rigGroup);
}
function addBeam(a,name,zone,start,end,width,rigGroup,endWidth=width){
  const before=a.parts.length;a.beam(name,zone,start,end,width,endWidth);markNewParts(a,before,rigGroup);
}
function cylinderData(rTop,rBottom,height,segments=8){
  const vertices=[],faces=[];
  for(const y of [-height/2,height/2]){
    const r=y<0?rBottom:rTop;
    for(let i=0;i<segments;i++){
      const a=i/segments*TAU;
      vertices.push([Math.cos(a)*r,y,Math.sin(a)*r]);
    }
  }
  faces.push([...Array(segments).keys()].reverse());
  faces.push([...Array(segments).keys()].map(i=>segments+i));
  for(let i=0;i<segments;i++){
    const j=(i+1)%segments;
    faces.push([i,j,segments+j,segments+i]);
  }
  return {vertices,faces};
}
function coneData(radius,height,segments=8){
  const vertices=[],faces=[];
  for(let i=0;i<segments;i++){
    const a=i/segments*TAU;
    vertices.push([Math.cos(a)*radius,-height/2,Math.sin(a)*radius]);
  }
  const apex=vertices.length;vertices.push([0,height/2,0]);
  faces.push([...Array(segments).keys()].reverse());
  for(let i=0;i<segments;i++)faces.push([i,(i+1)%segments,apex]);
  return {vertices,faces};
}
function addCylinder(a,name,zone,center,rTop,rBottom,height,segments,rigGroup,yaw=0){
  const d=cylinderData(rTop,rBottom,height,segments);
  addSolid(a,name,zone,d.vertices,d.faces,rigGroup,center,yaw);
}
function addCone(a,name,zone,center,radius,height,segments,rigGroup,yaw=0){
  const d=coneData(radius,height,segments);
  addSolid(a,name,zone,d.vertices,d.faces,rigGroup,center,yaw);
}
function prismData(section,length){
  if(!(length>0)||section.length<3)throw Error('Invalid roof prism');
  const vertices=[],faces=[],n=section.length;
  for(const z of [-length/2,length/2])for(const [x,y] of section)vertices.push([x,y,z]);
  faces.push([...Array(n).keys()].reverse());
  faces.push([...Array(n).keys()].map(i=>n+i));
  for(let i=0;i<n;i++){const j=(i+1)%n;faces.push([i,j,j+n,i+n]);}
  return {vertices,faces};
}
function crossingData(w,d,h){
  const vertices=[[-w,0,-d],[0,h,-d],[w,0,-d],[w,h,0],[w,0,d],[0,h,d],[-w,0,d],[-w,h,0],[0,h,0]];
  const faces=[];
  for(let i=0;i<8;i++)faces.push([8,(i+1)%8,i]);
  faces.push([0,1,2],[2,3,4],[4,5,6],[6,7,0],[0,2,4],[0,4,6]);
  return {vertices,faces};
}
function addRoofData(a,name,data,position,rigGroup,yaw=0){
  addSolid(a,name,'upper',data.vertices,data.faces,rigGroup,position,yaw);
}
function gable(width,rise,length){return prismData([[-width/2,0],[width/2,0],[0,rise]],length);}

export const DOM_SOURCE_CONTRACT=Object.freeze({
  id:'koelner-dom-v0.3-modular',
  donor:'tools/img2threejs/prototypes/koelner-dom/v0.2/index.html',
  donorStatus:'GEORG_ACCEPTED_CARTOON_DIRECTION',
  geographicPlacement:'STYLE_INTEGRATION_ONLY_NOT_GEO',
  units:'metre',
  sourceDimensions:{
    foundation:[44,1,64],
    twinTowerBody:[6.4,36,6.4],
    towerSpireHeight:22,
    sourceOverallApproxHeightM:84
  }
});

export function buildCologneCathedral(){
  const a=assembly('koelner-dom','Cologne Cathedral · modular v0.3','Modularized from Georg-accepted v0.2. Style integration proof only; no real OSM placement yet.');
  a.sourceAcceptance='GEORG_ACCEPTED_V0_2_DIRECTION';
  a.geographicBinding=null;

  addBox(a,'foundation','base',[0,.5,0],[44,1,64],'foundation');

  addBox(a,'nave','structure',[0,10,1],[14,18,42],'nave');
  addBox(a,'aisle-left','structure',[-10,6.5,1],[6,11,38],'nave');
  addBox(a,'aisle-right','structure',[10,6.5,1],[6,11,38],'nave');
  addBox(a,'transept','structure',[0,10,-4],[32,18,10],'transept');
  addBox(a,'choir','structure',[0,10,-24.5],[14,18,9],'choir');
  addBox(a,'west-facade','structure',[0,11,22],[20,20,8],'west');

  addRoofData(a,'roof-nave-front',gable(14.8,7,16.6),[0,19,9.7],'nave');
  addRoofData(a,'roof-nave-choir',gable(14.8,7,20),[0,19,-19.4],'choir');
  addRoofData(a,'roof-crossing',crossingData(7.4,5.4,7),[0,19,-4],'transept');
  addRoofData(a,'roof-transept-left',gable(10.8,7,9.4),[-12.1,19,-4],'transept',Math.PI/2);
  addRoofData(a,'roof-transept-right',gable(10.8,7,9.4),[12.1,19,-4],'transept',Math.PI/2);
  addRoofData(a,'roof-west-facade',gable(20,7,8),[0,21,22],'west');
  for(const side of [-1,1]){
    const section=side<0?[[-3.3,0],[3.3,0],[3.3,3.8]]:[[-3.3,0],[3.3,0],[-3.3,3.8]];
    addRoofData(a,`roof-aisle-${side}-front`,prismData(section,19),[side*10,12,10.9],'nave');
    addRoofData(a,`roof-aisle-${side}-rear`,prismData(section,9),[side*10,12,-13.9],'nave');
  }

  function buildTower(x,side){
    addBox(a,`tower-${side}-body`,'structure',[x,19,22],[6.4,36,6.4],'west');
    addBox(a,`tower-${side}-cornice`,'secondary',[x,37,22],[8,4,8],'west');
    addCylinder(a,`tower-${side}-upper`,'structure',[x,48,22],2.7,3.6,18,8,'west');
    addCone(a,`tower-${side}-spire`,'upper',[x,68,22],3.2,22,8,'west');
    addCylinder(a,`tower-${side}-finial`,'upper',[x,80,22],.18,.18,8,5,'west');
  }
  buildTower(-6.5,'left');buildTower(6.5,'right');

  function smallSpire(name,x,z,baseY,scale,group){
    const shaft=5*scale,tip=9*scale;
    addCylinder(a,`${name}-shaft`,'structure',[x,baseY+shaft/2,z],1.1*scale,1.5*scale,shaft,8,group);
    addCone(a,`${name}-tip`,'upper',[x,baseY+shaft+tip/2,z],1.5*scale,tip,8,group);
  }
  smallSpire('choir-left',-5.1,-27,19,1.1,'choir');
  smallSpire('choir-right',5.1,-27,19,1.1,'choir');
  smallSpire('transept-left',-15,-4,19,.8,'transept');
  smallSpire('transept-right',15,-4,19,.8,'transept');

  for(const side of [-1,1]){
    for(const z of [14,7,-12,-18]){
      addBox(a,`buttress-${side}-${z}`,'secondary',[side*14.5,7.5,z],[1.2,13,1.2],'nave');
      addBeam(a,`brace-${side}-${z}`,'secondary',[side*14.5,13.6,z],[side*7.1,18.1,z],.65,'nave',.65);
    }
  }

  for(const side of [-1,1]){
    for(const z of [15,10,5,-12,-17,-23,-27]){
      const group=z<=-20?'choir':'nave';
      addBox(a,`clerestory-${side}-${z}`,'glazing',[side*7.06,17.3,z],[.18,2.6,1.35],group);
    }
    for(const z of [15,10,5,-12,-17]){
      addBox(a,`aisle-window-${side}-${z}`,'glazing',[side*13.06,8,z],[.18,4.2,1.45],'nave');
    }
    for(const y of [25,31]){
      addBox(a,`tower-window-${side}-${y}`,'glazing',[side*6.5,y,25.26],[1.5,3,.18],'west');
    }
  }
  addBox(a,'portal','secondary',[0,4.8,26.07],[5.5,7.6,.18],'west');
  const portalPoint=prismData([[-2.75,0],[2.75,0],[0,2]],.18);
  addSolid(a,'portal-point','secondary',portalPoint.vertices,portalPoint.faces,'west',[0,8.6,26.07],0);

  const out=a.finish();
  out.rigGroups=['foundation','west','nave','transept','choir'];
  out.sourceContract=DOM_SOURCE_CONTRACT;
  return out;
}
