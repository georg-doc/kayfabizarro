export const SCHEMA = 'kfb.legacy-facehost/0.1-candidate';

const EXCLUDE = /hair|hat|helmet|visor|hood|mask|beard|horn|accessory/i;

function meshesUnder(root) {
  const out=[];
  root?.traverse?.((o)=>{ if(o.isMesh && !EXCLUDE.test(o.name||'')) out.push(o); });
  if(root?.isMesh && !out.includes(root) && !EXCLUDE.test(root.name||'')) out.unshift(root);
  return out;
}

function materialBaseColor(THREE, root) {
  const preferred=/pink|beige|brown|skin|flesh|mud|stone/i;
  const banned=/black|white|metal|hair|wood/i;
  let fallback=null;
  for(const mesh of meshesUnder(root)) {
    for(const m of [].concat(mesh.material||[])) {
      if(!m?.color) continue;
      fallback ||= m.color.clone();
      const n=(m.name||'').toLowerCase();
      if(preferred.test(n) && !banned.test(n)) return '#'+m.color.getHexString();
    }
  }
  return fallback ? '#'+fallback.getHexString() : '#d7a17d';
}

export function buildLegacyFaceHost({THREE, figure, headBone, headPart, log=()=>{}}={}) {
  if(!THREE || !figure || !headBone || !headPart) return {status:'UNSUPPORTED',reason:'missing figure/headBone/headPart'};
  figure.updateMatrixWorld(true); headBone.updateMatrixWorld(true);
  const inv=headBone.matrixWorld.clone().invert();
  const box=new THREE.Box3(); box.makeEmpty();
  const p=new THREE.Vector3(); let verts=0, meshes=0;
  const candidates=meshesUnder(headPart).filter((m)=>/head|skull/i.test(m.name||''));
  const selected=candidates.length ? candidates : meshesUnder(headPart).slice(0,1);
  for(const m of selected) {
    const pos=m.geometry?.attributes?.position; if(!pos) continue;
    m.updateMatrixWorld(true); meshes++;
    for(let i=0;i<pos.count;i++) {
      p.fromBufferAttribute(pos,i).applyMatrix4(m.matrixWorld).applyMatrix4(inv);
      box.expandByPoint(p); verts++;
    }
  }
  if(!verts || box.isEmpty()) return {status:'UNSUPPORTED',reason:'no measurable head vertices'};
  const size=box.getSize(new THREE.Vector3());
  const center=box.getCenter(new THREE.Vector3());
  const inner=new THREE.Group(); inner.name='legacyFaceHost'; inner.position.copy(center); headBone.add(inner);
  const geo=new THREE.SphereGeometry(1,36,24); geo.scale(size.x/2,size.y/2,size.z/2); geo.computeBoundingBox();
  const body=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
  body.name='body'; body.userData.noMeasure=true; body.userData.petOverlay=false; inner.add(body);
  const report={status:'OK',schema:SCHEMA,headBone:headBone.name,headPart:headPart.name,headMeshes:selected.map(m=>m.name),headSize:[size.x,size.y,size.z].map(v=>+v.toFixed(4)),headCenter:[center.x,center.y,center.z].map(v=>+v.toFixed(4)),headVerts:verts,baseColor:materialBaseColor(THREE,headPart),facing:'+z authored legacy face'};
  log(`LegacyFaceHost · ${headPart.name} · ${report.headSize.join('×')} · ${verts} vertices`);
  return {
    status:'OK',schema:SCHEMA,inner,box:body,head:headBone,size,report,
    faceCtx(){ return {THREE,inner,o:{},_squash:null,getFaceShells:()=>[]}; },
    dispose(){ inner.removeFromParent(); geo.dispose(); body.material.dispose(); }
  };
}

function triangleIndices(geo, group) {
  const out=[]; const idx=geo.index;
  const start=group?.start||0; const count=group?.count ?? (idx?idx.count:geo.attributes.position.count);
  for(let i=start;i<start+count;i+=3) out.push([idx?idx.getX(i):i,idx?idx.getX(i+1):i+1,idx?idx.getX(i+2):i+2]);
  return out;
}

function componentGroups(tris) {
  const byVertex=new Map();
  tris.forEach((t,ti)=>t.forEach(v=>{ if(!byVertex.has(v)) byVertex.set(v,[]); byVertex.get(v).push(ti); }));
  const seen=new Set(), groups=[];
  for(let i=0;i<tris.length;i++){
    if(seen.has(i)) continue; const q=[i], g=[]; seen.add(i);
    while(q.length){ const ti=q.pop(); g.push(ti); for(const v of tris[ti]) for(const n of byVertex.get(v)||[]) if(!seen.has(n)){seen.add(n);q.push(n);} }
    groups.push(g);
  }
  return groups;
}

export function measureLegacyEyeCandidates({THREE, headPart, faceHost}={}) {
  if(!THREE || !headPart || faceHost?.status!=='OK') return {status:'UNSUPPORTED',reason:'missing head/faceHost'};
  const body=faceHost.box; body.updateMatrixWorld(true);
  const bb=body.geometry.boundingBox || (body.geometry.computeBoundingBox(),body.geometry.boundingBox);
  const unit=bb.getSize(new THREE.Vector3()).y/2; const ctr=bb.getCenter(new THREE.Vector3());
  const candidates=[]; const tmp=new THREE.Vector3();
  for(const mesh of meshesUnder(headPart)) {
    const mats=[].concat(mesh.material||[]); const groups=mesh.geometry.groups?.length?mesh.geometry.groups:[{start:0,count:mesh.geometry?mesh.geometry.index.count:mesh.geometry.attributes.position.count,materialIndex:0}];
    for(const group of groups) {
      const mat=mats[group.materialIndex||0] || mats[0];
      if(!mat || !/black/i.test(mat.name||'')) continue;
      const tris=triangleIndices(mesh.geometry,group); const comps=componentGroups(tris); const pos=mesh.geometry.attributes.position;
      mesh.updateMatrixWorld(true);
      for(const comp of comps) {
        const box=new THREE.Box3(); box.makeEmpty(); const uniq=new Set();
        for(const ti of comp) for(const vi of tris[ti]) uniq.add(vi);
        for(const vi of uniq){ tmp.fromBufferAttribute(pos,vi); mesh.localToWorld(tmp); body.worldToLocal(tmp); box.expandByPoint(tmp); }
        const c=box.getCenter(new THREE.Vector3()), s=box.getSize(new THREE.Vector3());
        candidates.push({mesh:mesh.name,material:mat.name,triangles:comp.length,center:[c.x,c.y,c.z],size:[s.x,s.y,s.z],radiusXY:Math.max(s.x,s.y)/2});
      }
    }
  }
  let best=null,score=Infinity;
  for(let i=0;i<candidates.length;i++) for(let j=i+1;j<candidates.length;j++) {
    const a=candidates[i],b=candidates[j];
    const ax=a.center[0]-ctr.x,bx=b.center[0]-ctr.x;
    if(ax*bx>=0) continue;
    const sym=Math.abs(Math.abs(ax)-Math.abs(bx));
    const y=Math.abs(a.center[1]-b.center[1]);
    const z=Math.abs(a.center[2]-b.center[2]);
    const sz=Math.abs(a.radiusXY-b.radiusXY);
    const frontPenalty=(a.center[2]<ctr.z||b.center[2]<ctr.z)?1:0;
    const sc=sym+y+z+sz+frontPenalty;
    if(sc<score){score=sc;best=[a,b];}
  }
  if(!best) return {status:'HUMAN_REQUIRED',candidates:candidates.map(c=>({...c,center:c.center.map(v=>+v.toFixed(4)),size:c.size.map(v=>+v.toFixed(4)),radiusXY:+c.radiusXY.toFixed(4)}))};
  best.sort((a,b)=>a.center[0]-b.center[0]);
  const dx=(Math.abs(best[0].center[0]-ctr.x)+Math.abs(best[1].center[0]-ctr.x))/2/unit;
  const dy=((best[0].center[1]+best[1].center[1])/2-ctr.y)/unit;
  const ring=(best[0].radiusXY+best[1].radiusXY)/2/unit;
  return {status:'MEASURED_CANDIDATE',method:'black-material connected-component symmetry',pair:best.map(c=>({mesh:c.mesh,triangles:c.triangles,center:c.center.map(v=>+v.toFixed(4)),size:c.size.map(v=>+v.toFixed(4))})),anchor:{dx:+dx.toFixed(4),dy:+dy.toFixed(4),ring:+ring.toFixed(4)},confidence:+Math.max(0,1-score).toFixed(3),candidateCount:candidates.length};
}

export function setLegacySourceEyeVisibility(headPart, visible=true) {
  if(!headPart) return 0; let touched=0;
  headPart.traverse?.((mesh)=>{
    if(!mesh.isMesh || EXCLUDE.test(mesh.name||'')) return;
    const mats=[].concat(mesh.material||[]);
    let changed=false;
    const next=mats.map((m)=>{
      if(!m || !/black/i.test(m.name||'')) return m;
      const n=m.userData?.kfbLegacyClone ? m : m.clone(); n.userData={...(n.userData||{}),kfbLegacyClone:true}; n.visible=!!visible; touched++; changed=true; return n;
    });
    if(changed) mesh.material=Array.isArray(mesh.material)?next:next[0];
  });
  return touched;
}
