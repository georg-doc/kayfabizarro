function add(mesh,group,name){
  mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;
}
function phong(system,opts,rim=.45,power=2.7){return system.phong(opts,rim,power);}

export function createLighthouseReference(THREE,system){
  const g=new THREE.Group();g.name='tinyskies-source-reference-lighthouse';
  const stone=phong(system,{color:'#8f8982'},.34,2.8);
  const tower=phong(system,{color:'#f1ece3'},.42,2.5);
  const red=phong(system,{color:'#c84a3e'},.42,2.5);
  const dark=phong(system,{color:'#303238'},.30,3);
  const wood=phong(system,{color:'#604536'},.26,2.9);
  const glass=phong(system,{color:'#fff0c4',emissive:'#ffcf58',emissiveIntensity:1.1,transparent:true,opacity:.92},.35,2.5);
  const baseH=1.6,towerH=20,bot=2.45,top=1.65;
  add(new THREE.Mesh(new THREE.CylinderGeometry(3.4,3.8,baseH,12),stone),g,'base').position.y=baseH/2;
  add(new THREE.Mesh(new THREE.CylinderGeometry(top,bot,towerH,16),tower),g,'tower').position.y=baseH+towerH/2;
  for(const y of [baseH+towerH*.31,baseH+towerH*.57]){
    const r=THREE.MathUtils.lerp(bot,top,(y-baseH)/towerH)+.08;
    const stripe=add(new THREE.Mesh(new THREE.CylinderGeometry(r,r+.06,2.8,16),red),g,'red-band');
    stripe.position.y=y;
  }
  const door=add(new THREE.Mesh(new THREE.BoxGeometry(1.25,2.4,.35),wood),g,'door');
  door.position.set(0,baseH+1.2,bot+.05);
  const winMat=phong(system,{color:'#25313c'},.18,3);
  for(let i=1;i<=3;i++){
    const y=baseH+(towerH/4)*i,r=THREE.MathUtils.lerp(bot,top,(y-baseH)/towerH);
    const w=add(new THREE.Mesh(new THREE.BoxGeometry(.68,1,.25),winMat),g,'window');
    w.position.set(0,y,r+.06);
  }
  const lanternY=baseH+towerH;
  add(new THREE.Mesh(new THREE.CylinderGeometry(2.55,2.42,.42,16),dark),g,'gallery').position.y=lanternY;
  add(new THREE.Mesh(new THREE.CylinderGeometry(2.1,2.1,2.5,12),glass),g,'lantern').position.y=lanternY+1.45;
  add(new THREE.Mesh(new THREE.ConeGeometry(2.4,2.2,12),dark),g,'lantern-roof').position.y=lanternY+3.75;
  const beamMat=new THREE.MeshBasicMaterial({color:'#ffd86e',transparent:true,opacity:.16,depthWrite:false,blending:THREE.AdditiveBlending});
  const beam=add(new THREE.Mesh(new THREE.ConeGeometry(6,22,24,1,true),beamMat),g,'light-beam');
  beam.rotation.z=-Math.PI/2;beam.position.set(11,lanternY+1.5,0);
  g.userData.sourceReference={
    repo:'dannylimanseta/tinyskies',
    commit:'2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6',
    source:'client/src/game/Globe.ts#createLighthouses',
    status:'SOURCE_DERIVED_KFB_RECREATION_NOT_COPIED_ASSET'
  };
  return g;
}

export function createObservatoryReference(THREE,system){
  const g=new THREE.Group();g.name='tinyskies-source-reference-observatory';
  const stone=phong(system,{color:'#cfc4b1'},.42,2.7);
  const stoneDk=phong(system,{color:'#a79a84'},.38,2.8);
  const dome=phong(system,{color:'#aeb8c5'},.5,2.45);
  const slit=phong(system,{color:'#343541'},.22,3.2);
  const glass=phong(system,{color:'#5d91b4',emissive:'#5d91b4',emissiveIntensity:.18},.46,2.5);
  const frame=phong(system,{color:'#585a5d'},.34,2.8);
  const door=phong(system,{color:'#604536'},.32,2.75);
  const found=add(new THREE.Mesh(new THREE.BoxGeometry(20,3.2,16),stone),g,'buried-foundation');found.position.y=-1.6;
  const base=add(new THREE.Mesh(new THREE.BoxGeometry(19,5.2,15),stone),g,'base');base.position.y=2.6;
  const corn=add(new THREE.Mesh(new THREE.BoxGeometry(20, .65,16),stoneDk),g,'cornice');corn.position.y=5.5;
  const drum=add(new THREE.Mesh(new THREE.CylinderGeometry(7.2,7.6,2.7,24),stone),g,'drum');drum.position.y=7.1;
  const domeGeo=new THREE.SphereGeometry(7.35,24,12,0,Math.PI*2,0,Math.PI/2);
  const d=add(new THREE.Mesh(domeGeo,dome),g,'dome');d.position.y=8.45;
  const slitMesh=add(new THREE.Mesh(new THREE.BoxGeometry(1.05,8.6,.6),slit),g,'dome-slit');slitMesh.position.set(0,12.2,6.25);slitMesh.rotation.x=-.38;
  const frontDoor=add(new THREE.Mesh(new THREE.BoxGeometry(2.6,3.6,.4),door),g,'door');frontDoor.position.set(0,2.2,7.65);
  for(const x of [-5.4,5.4]){
    const w=add(new THREE.Mesh(new THREE.BoxGeometry(2,2,.35),glass),g,'window');
    w.position.set(x,3.1,7.62);
    const fr=add(new THREE.Mesh(new THREE.BoxGeometry(2.4,2.4,.25),frame),g,'window-frame');
    fr.position.set(x,3.1,7.48);
  }
  const telescope=add(new THREE.Mesh(new THREE.CylinderGeometry(.75,.9,9,12),frame),g,'telescope');
  telescope.rotation.x=-1.05;telescope.position.set(0,13.5,4);
  g.userData.sourceReference={
    repo:'dannylimanseta/tinyskies',
    commit:'2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6',
    source:'client/src/game/Globe.ts#buildObservatory',
    status:'SOURCE_DERIVED_KFB_RECREATION_NOT_COPIED_ASSET'
  };
  return g;
}
