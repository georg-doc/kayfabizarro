// Shared island data and ramp geometry. No physics engine, renderer or host ownership.
// Every physical thing in the zone is declared here. Renderer and colliders both read this list.
// kind: (none)=static cuboid · wall=static cuboid that reports contact · bumper=static cylinder with rebound · breakable=solid cuboid, breaks above contact threshold m/s.
// Slice 04 additions:
//  shape:'curve'  = arc road (flat or banked) built from curveGeometry(); renderer and trimesh collider share the same sampled hull.
//  shape:'gltf'   = Kenney tile; the host loads the model into the island mount and hands the SAME transformed triangles to physics.addMesh(). No collider until then.
//  kind:'prop'    = Kenney model without its own collider (its contact role, if any, is a separate declared cuboid with hidden:true).
//  hidden:true    = collider whose visual comes from a gltf prop; the island draws nothing for it.
//  yaw            = rotation about Y for cuboids/props (radians). rotation (about X) stays for the card ramp only.

// Kenney donors (CC0), copied unchanged from donors/kenney. Scale per family from real lane width, not per bounding box:
//  toy-car track: 2 units rail-to-rail → 6 m (deck 5.25 m) at ×3, one tile = 12 m, one level = 3 m.
//  racing kit: 1 unit garage bay → 8 m at ×8. Overhead gantry ×14 so its legs stand beside the 14 m road.
// pivot = model-space point placed at p (default model origin). tile = model rail-to-rail width and tile length incl. lips.
export const KENNEY={
 'toy/hill':{file:'kenney_toy-car-kit/track-wide-straight-hill-complete.glb',scale:3,tile:[2,4.4]},
 'toy/bump':{file:'kenney_toy-car-kit/track-wide-straight-bump-up.glb',scale:3,tile:[2,4.4]},
 'toy/support':{file:'kenney_toy-car-kit/supports-wide.glb',scale:3},
 'racing/garage':{file:'kenney_racing-kit/pitsGarage.glb',scale:8,cull:[.05,.2,-.05,.2,-.8,-.6]}, // cull: the small crate baked into the bay mouth centre (model box), so the bay is really enterable
 'racing/barrier':{file:'kenney_racing-kit/barrierRed.glb',scale:8,pivot:[-.225,0,-.7115]},
 'racing/rail':{file:'kenney_racing-kit/rail.glb',scale:8,pivot:[.15,0,-.625]},
 'racing/pylon':{file:'kenney_racing-kit/pylon.glb',scale:8,pivot:[-.35,0,-.65]},
 'racing/flag':{file:'kenney_racing-kit/flagCheckers.glb',scale:8,pivot:[-.34,0,-.667]},
 'racing/overhead':{file:'kenney_racing-kit/overhead.glb',scale:14,pivot:[.15,0,-.555]},
};

// Underside of track-wide-straight-hill-complete along its length (model units, measured from the GLB: z → lowest surface).
// Used to fill the hollow under each hill with visible sand terraces whose tops stay below the deck.
const HILL_UNDERSIDE=[[0,-1],[.5,-.97],[1,-.89],[1.5,-.72],[2,-.5],[2.5,-.28],[3,-.11],[3.5,-.03],[4,0]];
function hillTerraces(base,p,dir,scale=3){return [{id:base+'-base',shape:'hill-base',p:[p[0],0,p[2]+dir*6],size:[5.6,3,12],origin:p,dir,scale,color:0xd8c79b}];}
// Continuous solid skirt, including the low approach: visible and physical from the same profile.
export function hillBaseGeometry(s){const V=[],I=[];for(const [z,y] of HILL_UNDERSIDE){const top=s.origin[1]+y*s.scale-.02,zz=s.origin[2]+s.dir*z*s.scale;V.push(s.p[0]-2.8,top,zz,s.p[0]+2.8,top,zz,s.p[0]+2.8,-.4,zz,s.p[0]-2.8,-.4,zz);}
 const quad=(a,b,c,d)=>I.push(a,b,c,a,c,d);for(let i=0;i<HILL_UNDERSIDE.length-1;i++){const a=i*4,b=a+4;for(let j=0;j<4;j++)quad(a+j,b+j,b+(j+1)%4,a+(j+1)%4);}quad(3,2,1,0);const a=(HILL_UNDERSIDE.length-1)*4;quad(a,a+1,a+2,a+3);return {vertices:new Float32Array(V),indices:new Uint32Array(I)};}

// Kenney pit bays: two open bays side by side, walls/roof declared separately so the entrance stays open. Model ×8: bay 8 × 8.72 m, roof 4.27–5.52 m.
function pitBay(id,x){return [
 {id:`pit-bay-${id}`,kind:'prop',asset:'racing/garage',p:[x,0,-6.3]},
];}

export const TRACK=[
 {id:'island',p:[0,-.65,30],size:[100,1.3,156],color:0xa7bd74},
 {id:'road',p:[0,.025,31],size:[14,.05,128],color:0x626e69,road:true},
 {id:'bypass',p:[12,.025,20],size:[10,.05,50],color:0x6b7870,road:true},
 {id:'loop-east',p:[34,.025,22],size:[12,.05,110],color:0x626e69,road:true},
 {id:'loop-north',p:[17,.025,72],size:[46,.05,12],color:0x626e69,road:true},
 {id:'loop-south',p:[17,.025,-28],size:[46,.05,12],color:0x626e69,road:true},
 // Corner pads: the return is a driven curve, not a T-junction taken at 90 km/h. Same surface, one step lower than the apron.
 {id:'corner-ne',p:[26,.028,68],size:[24,.05,20],color:0x626e69,road:true},
 {id:'corner-se',p:[26,.028,-24],size:[24,.05,20],color:0x626e69,road:true},
 {id:'corner-sw',p:[0,.028,-24],size:[26,.05,20],color:0x626e69,road:true},
 {id:'ramp',shape:'solid-ramp',p:[0,2.15,18],size:[10,.30,15],rotation:-Math.atan(4.2/14.4),color:0xf4e3bd},
 {id:'sidewall',p:[-18,1.2,35],size:[1,2.4,14],color:0xe7c976},
 {id:'apron',p:[0,.03,60],size:[24,.05,30],color:0x6f7a73,road:true},
 {id:'beacon',kind:'bumper',look:'beacon',p:[22,7,24],radius:2.2,height:14,restitution:.3},
 {id:'gate-w',p:[-6.6,2.5,63],size:[.5,5,.5],color:0xd7b36c},
 {id:'gate-e',p:[6.6,2.5,63],size:[.5,5,.5],color:0xd7b36c},
 {id:'rock-a',look:'rock',p:[-37,1.4,3],size:[10,2.8,8],color:0x93a08a}, // Slice 04: moved 4 m west / 3 m south, clear of the banked return
 {id:'rock-b',look:'rock',p:[-39,1.1,54],size:[8,2.2,11],color:0x93a08a},
 {id:'rock-c',look:'rock',p:[-44,1.3,84],size:[8,2.6,9],color:0x93a08a},
 {id:'rock-d',look:'rock',p:[-40,1,-20],size:[7,2,7],color:0x93a08a},
 {id:'palm-a',kind:'bumper',p:[-11,2,6],radius:.55,height:4,restitution:.9},
 {id:'palm-b',kind:'bumper',p:[21,2,38],radius:.55,height:4,restitution:.9},
 {id:'palm-c',kind:'bumper',p:[17,2,-14],radius:.55,height:4,restitution:.9},
 {id:'palm-d',kind:'bumper',p:[-31.5,2,30],radius:.55,height:4,restitution:.9}, // Slice 04: was (-25,33), now west of the wave line
 {id:'palm-e',kind:'bumper',p:[23,2,54],radius:.55,height:4,restitution:.9},
 {id:'palm-f',kind:'bumper',p:[-32,2,-30],radius:.55,height:4,restitution:.9},
 {id:'palm-g',kind:'bumper',p:[44,2,5],radius:.55,height:4,restitution:.9},
 {id:'palm-h',kind:'bumper',p:[-31,2,70],radius:.55,height:4,restitution:.9}, // Slice 04: was (-17,73), stood on the fork arc
 {id:'crates',kind:'breakable',p:[0,1.5,86],size:[14,3,1.6],threshold:6,respawn:10},
 {id:'seawall',kind:'wall',p:[0,.9,104],size:[100,1.8,1.6],color:0xe7c976,restitution:.4},
 // WSA: fixed structures share one geometry and collision declaration. Slice 04 widens the yard floor for the two Kenney bays
 // and moves the old dressing out of the bays onto a service strip west of the rails, so parking and recovery under the roof stay clear.
 {id:'garage-floor',p:[-19.75,0.02,-13],size:[18.5,0.02,14],color:13615252,road:true},
 {id:'garage-bench',size:[4.4,1,1.5],p:[-32.5,0.5,-17],color:9076586},
 {id:'garage-toolbox',size:[1.6,0.7,1.4],p:[-32.5,0.35,-14.4],color:13987655},
 {id:'garage-tires-a-0',size:[1.5,0.5,1.5],p:[-11.3,0.25,-19],color:3884864},
 {id:'garage-tires-a-1',size:[1.5,0.5,1.5],p:[-11.3,0.75,-19],color:3884864},
 {id:'garage-tires-a-2',size:[1.5,0.5,1.5],p:[-11.3,1.25,-19],color:3884864},
 {id:'garage-tires-b-0',size:[1.3,0.45,1.3],p:[-11.3,0.22,-16.8],color:3884864},
 {id:'garage-tires-b-1',size:[1.3,0.45,1.3],p:[-11.3,0.67,-16.8],color:3884864},
 {id:'garage-pump',size:[0.9,2.6,0.9],p:[-32.5,1.3,-11],color:13987655},
 {id:'garage-pump-top',size:[2.2,0.3,2.2],p:[-32.5,2.7,-11],color:16774104},
 {id:'board-54-post-n',size:[0.55,5.4,0.55],p:[44.5,2.7,57.6],color:9076586},
 {id:'board-54-post-s',size:[0.55,5.4,0.55],p:[44.5,2.7,50.4],color:9076586},
 {id:'board-54-back',size:[0.35,5.2,8.6],p:[44.5,6.1,54],color:16774104},
 {id:'board-14-post-n',size:[0.55,5.4,0.55],p:[44.5,2.7,17.6],color:9076586},
 {id:'board-14-post-s',size:[0.55,5.4,0.55],p:[44.5,2.7,10.4],color:9076586},
 {id:'board-14-back',size:[0.35,5.2,8.6],p:[44.5,6.1,14],color:16774104},
 {id:'gate-beam',size:[13.4,0.3,0.5],p:[0,4.9,63],color:14136172},

 // ---- Slice 04 · FrizzleBob's pit stop in Kenney Racing Kit. Replaces the box garage (posts, fascia, old roof, old wall). ----
 // Bays at x −28.3…−20.3 and −20.3…−12.3, back wall z −19.5, open front z −10.78. Colliders match the bay walls, not the bounding box.
 ...pitBay('w',-25.5),...pitBay('e',-17.5),
 {id:'garage-wall',p:[-20.3,2.76,-19.22],size:[16,5.52,.56],hidden:true},       // back wall incl. shelf, both bays
 {id:'garage-roof',p:[-20.3,4.895,-15.14],size:[16,1.25,8.72],hidden:true},     // roof slab 4.27–5.52 m, both bays
 {id:'pit-wall-w',p:[-28.18,2.135,-15.14],size:[.24,4.27,8.72],hidden:true},
 {id:'pit-wall-m',p:[-20.3,2.135,-15.14],size:[.48,4.27,8.72],hidden:true},     // the two adjoining side walls
 {id:'pit-wall-e',p:[-12.18,2.135,-15.14],size:[.24,4.27,8.72],hidden:true},
 {id:'pit-rail-0',kind:'prop',asset:'racing/rail',p:[-29.5,0,-16],yaw:Math.PI/2},
 {id:'pit-rail-0-body',p:[-29.5,.6,-16],size:[.4,1.2,8],hidden:true},
 {id:'pit-rail-1',kind:'prop',asset:'racing/rail',p:[-29.5,0,-8],yaw:Math.PI/2},
 {id:'pit-rail-1-body',p:[-29.5,.6,-8],size:[.4,1.2,8],hidden:true},
 {id:'pit-flag',kind:'prop',asset:'racing/flag',p:[-31,0,-8]},
 {id:'pit-flag-pole',kind:'bumper',p:[-31,5,-8],radius:.14,height:9.9,restitution:.2,hidden:true},
 {id:'pit-pylon-0',kind:'prop',asset:'racing/pylon',p:[-10.3,0,-18]},           // pylons are decorative markers, no contact
 {id:'pit-pylon-1',kind:'prop',asset:'racing/pylon',p:[-10.3,0,-15]},
 {id:'pit-pylon-2',kind:'prop',asset:'racing/pylon',p:[-10.3,0,-12]},
 {id:'pit-pylon-3',kind:'prop',asset:'racing/pylon',p:[-10.3,0,-9]},
 // Gantry over the coastal straight, just before corner-se: legs stand on the verge either side of loop-east, the beam at 7.4–9.2 m is decorative.
 {id:'gantry',kind:'prop',asset:'racing/overhead',p:[34,0,-6]},
 {id:'gantry-leg-w',p:[26.09,3.7,-6],size:[1.82,7.4,2.66],hidden:true},
 {id:'gantry-leg-e',p:[41.91,3.7,-6],size:[1.82,7.4,2.66],hidden:true},

 // ---- Slice 04 · the voluntary line: fork west off the landing → hill up → two waves at 3 m → hill down → banked return → yard. ----
 {id:'fork-arc',shape:'curve',c:[-12,60],r:12,w:6.5,a0:90,a1:180,bank:0,leadOut:.7,color:0x626e69,road:true},
 {id:'stunt-hill-up',shape:'gltf',asset:'toy/hill',p:[-24,2.75,60],yaw:Math.PI,road:true},
 {id:'stunt-wave-a',shape:'gltf',asset:'toy/bump',p:[-24,5.75,36],yaw:0,road:true},
 {id:'stunt-wave-b',shape:'gltf',asset:'toy/bump',p:[-24,5.75,24],yaw:0,road:true},
 {id:'stunt-hill-down',shape:'gltf',asset:'toy/hill',p:[-24,2.75,12],yaw:0,road:true},
 ...hillTerraces('stunt-hill-up',[-24,2.75,60],-1),
 ...hillTerraces('stunt-hill-down',[-24,2.75,12],1),
 // Supports at the tile joints, where every toy tile sits at level height. Box contact for an open frame: a documented approximation.
 {id:'stunt-support-0',kind:'prop',asset:'toy/support',p:[-24,-.25,24]},{id:'stunt-support-0-body',p:[-24,1.25,24],size:[6,3,3],hidden:true},
 {id:'stunt-support-1',kind:'prop',asset:'toy/support',p:[-24,-.25,36]},{id:'stunt-support-1-body',p:[-24,1.25,36],size:[6,3,3],hidden:true},
 {id:'stunt-support-2',kind:'prop',asset:'toy/support',p:[-24,-.25,48]},{id:'stunt-support-2-body',p:[-24,1.25,48],size:[6,3,3],hidden:true},
 // Banked return: inner edge on the ground, outer edge rises to 2.6 m at 24°, bank eases in and out. 4 m lead covers the hill's lip.
 {id:'stunt-bank',shape:'curve',c:[-12,12],r:12,w:6.5,a0:180,a1:270,bank:24,leadIn:.7,leadOut:.5,color:0x626e69,road:true},
 {id:'stunt-join',p:[-9.7,.025,0],size:[5.6,.05,6.5],color:0x626e69,road:true},
 // Red barriers on the fork's outer rim: the turn is visible before it is needed and an overshoot meets something soft-looking but solid.
 ...[126,140,154,168].map((deg,i)=>{const a=deg*Math.PI/180,R=16.6;return [
  {id:`fork-barrier-${i}`,kind:'prop',asset:'racing/barrier',p:[-12+Math.cos(a)*R,0,60+Math.sin(a)*R],yaw:-a-Math.PI/2},
  {id:`fork-barrier-${i}-body`,p:[-12+Math.cos(a)*R,.5,60+Math.sin(a)*R],size:[2,1,1],yaw:-a-Math.PI/2,hidden:true}];}).flat(),
 {id:'fork-flag',kind:'prop',asset:'racing/flag',p:[-28.5,0,61]},
 {id:'fork-flag-pole',kind:'bumper',p:[-28.5,5,61],radius:.14,height:9.9,restitution:.2,hidden:true},
];

// World-space hull shared by rendering and collision. Preserve the old top plane,
// close the undercroft so a returning kart cannot wedge under the suspension rays.
export function rampVertices(s){
 const a=s.rotation||0,c=Math.cos(a),sn=Math.sin(a),out=[];
 for(const lower of [false,true])for(const [x,z] of [[-1,-1],[1,-1],[1,1],[-1,1]]){
  const y=s.size[1]/2,lz=z*s.size[2]/2;
  out.push(s.p[0]+x*s.size[0]/2,lower?-.1:s.p[1]+y*c-lz*sn,s.p[2]+y*sn+lz*c);
 }
 return new Float32Array(out);
}
export const RAMP_INDICES=[0,3,2,0,2,1,4,5,6,4,6,7,0,1,5,0,5,4,1,2,6,1,6,5,2,3,7,2,7,6,3,0,4,3,4,7];

// Arc road hull: one sampled point set for the visible surface and the static trimesh. Closed underneath and at both ends.
// Angles in degrees, counter-clockwise from +x toward +z; driving direction is increasing angle. Bank raises the outer edge around the inner edge.
// Ring layout: 0 inner top · 1 rim inner top · 2 outer top · 3 outer floor · 4 inner floor. kinds per triangle: 0 deck · 1/2 rim stripes · 3 wall/floor.
export function curveGeometry(s){
 const rad=Math.PI/180,a0=s.a0*rad,a1=s.a1*rad,n=s.segments||28,w=s.w,rim=.7,y0=s.y??.05,floor=-.15,bank=(s.bank||0)*rad;
 const rings=[];
 const ring=(a,off,beta)=>rings.push({cx:s.c[0]-Math.sin(a)*off,cz:s.c[1]+Math.cos(a)*off,dx:Math.cos(a),dz:Math.sin(a),beta});
 if(s.leadIn)ring(a0,-s.leadIn,0);
 for(let i=0;i<=n;i++){const t=i/n,k=Math.min(1,Math.min(t,1-t)/.35);ring(a0+(a1-a0)*t,0,bank*k*k*(3-2*k));}
 if(s.leadOut)ring(a1,s.leadOut,0);
 const V=[],I=[],K=[];
 for(const rg of rings){const put=(u,y)=>{const rr=s.r-w/2+(u+w/2)*Math.cos(rg.beta);V.push(rg.cx+rg.dx*rr,y,rg.cz+rg.dz*rr);};const top=u=>y0+(u+w/2)*Math.sin(rg.beta);
  put(-w/2,top(-w/2));put(w/2-rim,top(w/2-rim));put(w/2,top(w/2));put(w/2,floor);put(-w/2,floor);}
 const quad=(a,b,c,d,kind)=>{I.push(a,b,c,a,c,d);K.push(kind,kind);};
 for(let i=0;i<rings.length-1;i++){const A=i*5,B=A+5;quad(A,B,B+1,A+1,0);quad(A+1,B+1,B+2,A+2,i%2?2:1);quad(A+2,B+2,B+3,A+3,3);quad(A+3,B+3,B+4,A+4,3);quad(A+4,B+4,B,A,3);}
 for(const A of [0,(rings.length-1)*5]){I.push(A,A+1,A+2,A,A+2,A+3,A,A+3,A+4);K.push(3,3,3);}
 return {vertices:new Float32Array(V),indices:new Uint32Array(I),kinds:new Uint8Array(K)};
}

// Ground footprint of any entry (axis-aligned, conservative for yawed boxes and arcs). Used for scatter placement and margins.
export function footprint(s){
 if(s.shape==='curve'){const R=s.r+s.w/2+Math.max(s.leadIn||0,s.leadOut||0);return {x:s.c[0],z:s.c[1],hw:R,hd:R};}
 if(s.shape==='gltf'){const a=KENNEY[s.asset],c=Math.cos(s.yaw||0),sn=Math.sin(s.yaw||0),[tw,tl]=a.tile,cz=(tl/2-.2)*a.scale;
  return {x:s.p[0]+sn*cz,z:s.p[2]+c*cz,hw:(Math.abs(c)*tw+Math.abs(sn)*tl)*a.scale/2,hd:(Math.abs(sn)*tw+Math.abs(c)*tl)*a.scale/2};}
 if(s.kind==='bumper')return {x:s.p[0],z:s.p[2],hw:s.radius,hd:s.radius};
 if(s.size){const c=Math.abs(Math.cos(s.yaw||0)),sn=Math.abs(Math.sin(s.yaw||0));return {x:s.p[0],z:s.p[2],hw:(c*s.size[0]+sn*s.size[2])/2,hd:(sn*s.size[0]+c*s.size[2])/2};}
 return {x:s.p[0],z:s.p[2],hw:1.5,hd:1.5};
}
