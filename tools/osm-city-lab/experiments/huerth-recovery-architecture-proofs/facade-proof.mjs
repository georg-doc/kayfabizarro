import * as THREE from 'three';
import {makePalette,randomSeed} from '../elastic-grotesque-clay-huerth01/vendor/racer-cologne/cologne-palette.v1.js';
import {STORY_PALETTES,MODES,hashStr,rgbToHex} from '../../../KFB-ToolBox/_inbox/KFB Voxel Zone S2/voxel-zone-s2-full_2026-09-22/terrain/world-context.js';

const PATTERNS=[
  {id:'ABA',label:'A-B-A rhythm',door:.08,windows:[['A',.28,.56],['B',.52,.56],['A',.78,.56]]},
  {id:'AAB',label:'A-A-B rhythm',door:.88,windows:[['A',.20,.58],['A',.42,.58],['B',.66,.58]]},
  {id:'ABC',label:'A→B→C progression',door:.10,windows:[['A',.30,.48],['B',.53,.56],['C',.77,.64]]},
  {id:'PAIR',label:'paired clusters',door:.84,windows:[['A',.18,.58],['A',.31,.58],['B',.56,.58],['B',.69,.58]]},
  {id:'BREAK',label:'entrance break',door:.50,windows:[['A',.18,.58],['A',.31,.58],['A',.69,.58],['A',.82,.58]]},
  {id:'BALANCE',label:'quiet / active balance',door:.18,windows:[['B',.62,.56],['A',.77,.56],['A',.88,.56]]}
];

const TYPE={A:{w:.95,h:1.65},B:{w:1.28,h:1.9},C:{w:1.05,h:2.2}};
const wallSequence=[0,0,1,0,2,1];
const roofSequence=[0,0,1,0,2,1];
const accentSequence=[0,0,1,0,2,1];

function storyRoles(index=1){
  const stops=STORY_PALETTES[index].c,hex=stops.map(s=>rgbToHex(...s));
  return {
    id:'STORY_'+MODES[index].name,
    source:'world-context STORY_PALETTES',
    seed:index,
    scheme:'story-mode',
    walls:[hex[1],hex[2],hex[1],hex[2]],
    roofs:[hex[0],hex[1]],
    windows:[hex[0]],
    doors:[hex[2],hex[1]],
    raw:hex
  };
}
function racerRoles(seed,scheme){
  const p=makePalette(seed,{id:'huerth-facade-proof',label:'Hürth Facade Proof',scheme});
  return {
    id:'RACER_COLOGNE',
    source:'Racer Cologne makePalette()',
    seed:p.seed,
    scheme:p.scheme,
    walls:p.buildings,
    roofs:p.roofs,
    windows:[p.roles.waterDeep,p.roles.deep,p.roles.water].filter(Boolean),
    doors:[p.roles.coral,p.roles.hot,p.roles.gold,p.roles.magenta].filter(Boolean),
    raw:p
  };
}

export function mountFacadeProof(canvas,ui={}){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.02;
  renderer.shadowMap.enabled=false;

  const scene=new THREE.Scene();scene.background=new THREE.Color('#d3d2c1');
  scene.add(new THREE.HemisphereLight(0xfff8e8,0x66685e,3.0));
  const key=new THREE.DirectionalLight(0xffead2,1.8);key.position.set(-25,35,45);scene.add(key);
  const camera=new THREE.OrthographicCamera(-23,23,16,-16,.1,100);
  camera.position.set(0,3,42);camera.lookAt(0,3,0);

  const root=new THREE.Group();scene.add(root);
  let randomPaletteSeed=20260924;
  let currentSource='card';

  function currentRoles(){
    if(currentSource==='story')return storyRoles(1); // COMIC story-mode proof
    if(currentSource==='random')return racerRoles(randomPaletteSeed);
    if(currentSource==='harmonic')return racerRoles(20260924,'triade');
    return racerRoles(hashStr('embrace_protopia#1/world/01'),'split');
  }

  function clear(){while(root.children.length){const n=root.children.pop();n.traverse?.(o=>{o.geometry?.dispose?.();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose?.());else o.material?.dispose?.();});}}

  function mat(color,rough=.94){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:0});}
  function box(w,h,d,color){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));return m;}

  function buildFacade(pattern,index,roles,x,y){
    const g=new THREE.Group();g.position.set(x,y,0);
    const wallW=12,wallH=7.6,wallD=1.15;
    const wall=box(wallW,wallH,wallD,roles.walls[wallSequence[index]%roles.walls.length]);
    wall.position.y=wallH/2;g.add(wall);

    const roof=box(wallW+1.0,.55,wallD+1.0,roles.roofs[roofSequence[index]%roles.roofs.length]);
    roof.position.y=wallH+.18;g.add(roof);

    const doorColor=roles.doors[accentSequence[index]%roles.doors.length];
    const door=box(1.38,2.65,.18,doorColor);
    door.position.set((pattern.door-.5)*wallW,1.33,.67);g.add(door);

    const winColor=roles.windows[index%roles.windows.length];
    for(const [type,u,v] of pattern.windows){
      const t=TYPE[type],w=box(t.w,t.h,.15,winColor);
      w.position.set((u-.5)*wallW,v*wallH,.68);g.add(w);
    }

    // A quiet low sill line creates common continuity across all six examples.
    const sill=box(wallW*.82,.10,.08,roles.roofs[roofSequence[index]%roles.roofs.length]);
    sill.position.set(0,2.28,.70);g.add(sill);
    root.add(g);
  }

  function rebuild(){
    clear();const roles=currentRoles();
    const pos=[[-14,6], [0,6], [14,6], [-14,-7], [0,-7], [14,-7]];
    PATTERNS.forEach((p,i)=>buildFacade(p,i,roles,pos[i][0],pos[i][1]));
    if(ui.metrics)ui.metrics.textContent=
      `${roles.source} · ${roles.scheme} · seed ${roles.seed} · block cadence A A B A C B · wall dominant / roof secondary / door accent / windows subordinate`;
    if(ui.labels)ui.labels.innerHTML=PATTERNS.map(p=>`<span><b>${p.id}</b> · ${p.label}</span>`).join('');
  }

  if(ui.sourceSelect){
    ui.sourceSelect.onchange=()=>{currentSource=ui.sourceSelect.value;rebuild();};
  }
  if(ui.rerollButton){
    ui.rerollButton.onclick=()=>{randomPaletteSeed=randomSeed();currentSource='random';if(ui.sourceSelect)ui.sourceSelect.value='random';rebuild();};
  }
  rebuild();

  function resize(){
    const r=canvas.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);
    const aspect=Math.max(.1,r.width/Math.max(1,r.height)),h=17;camera.left=-h*aspect;camera.right=h*aspect;camera.top=h;camera.bottom=-h;camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);resize();
  (function loop(){requestAnimationFrame(loop);renderer.render(scene,camera);})();

  return {
    report:()=>{
      const roles=currentRoles();
      return {
        schema:'kfb.huerth-proof.facade/0.1',
        patterns:PATTERNS.map(p=>p.id),
        facadeCount:PATTERNS.length,
        randomIndependentPlacement:false,
        blockCadence:'A A B A C B',
        hierarchy:'WALL_DOMINANT_ROOF_SECONDARY_DOOR_ACCENT_WINDOWS_SUBORDINATE',
        paletteSource:roles.source,
        paletteScheme:roles.scheme,
        paletteSeed:roles.seed,
        racerPaletteDonor:{
          repository:'georg-doc/KFB-Stunt-Car-Race',
          commit:'cc80f4a1c6c509db9668df79fd53b13cee093a9d',
          file:'KFB Cologne Race Option C-3/lab-v9/cologne-palette.v1.js',
          blob:'38246785ec2c9089737b2a195673a3ad4c07bdf8'
        },
        storyPaletteOwner:'tools/KFB-ToolBox/_inbox/KFB Voxel Zone S2/voxel-zone-s2-full_2026-09-22/terrain/world-context.js',
        webgl2:renderer.capabilities.isWebGL2
      };
    }
  };
}
