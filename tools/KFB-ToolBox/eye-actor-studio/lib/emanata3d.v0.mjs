function dropGeometry(THREE,r=1){
  const pts=[[0,0],[.34*r,.05*r],[.50*r,.34*r],[.43*r,.72*r],[.19*r,1.10*r],[.05*r,1.38*r],[0,1.48*r]].map(([x,y])=>new THREE.Vector2(x,y));
  return new THREE.LatheGeometry(pts,18);
}
export function mountEmanata3D(THREE,rig,type='none'){
  const f=rig.eyeFrame?.();if(!f||type==='none')return null;
  const g=new THREE.Group();g.name='KFB Eye Emanata 3D';g.userData.kfbEmanata3D=type;
  const cx=(f.left.x+f.right.x)/2,cy=(f.left.y+f.right.y)/2,cz=Math.max(f.left.z,f.right.z);
  if(type==='sweat'){
    const mat=new THREE.MeshStandardMaterial({color:'#74c9e8',roughness:.38,metalness:0,transparent:true,opacity:.92});
    const m=new THREE.Mesh(dropGeometry(THREE,f.radius*.48),mat);m.position.set(f.right.x+f.radius*1.25,cy+f.radius*.55,cz+f.radius*.22);m.rotation.z=-.32;m.userData.kfbEmanataPart='sweat-drop';g.add(m);
  }
  if(type==='soot'){
    const mat=new THREE.MeshStandardMaterial({color:'#161310',roughness:.94,metalness:0});
    [[-.55,.12,.04],[-.20,.40,.08],[.18,.22,.02],[.48,.48,.06]].forEach((p,i)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(f.radius*(.10+i*.012),12,8),mat);m.position.set(cx+f.radius*p[0],cy+f.radius*(1.8+p[1]),cz+f.radius*p[2]);m.userData.kfbEmanataPart='soot-dot';g.add(m);});
  }
  f.parent.add(g);return g;
}
