(async()=>{ const tb=window.__kfbTB; await tb.pickRoster(tb._rosterEntry('frizzlebob-earrig-v5'));
 const wait=ms=>new Promise(r=>setTimeout(r,ms)); await wait(1500); for(let i=0;i<120;i++){ const F=tb.runtime&&tb.runtime.face; if(F&&F.rig&&F.rig.eyes&&F.rig.eyes.length>1&&tb._rid()==='frizzlebob-earrig-v5') break; await wait(500);}
 const T=tb.THREE, F=tb.runtime.face, tick=n=>{for(let i=0;i<n;i++) tb._frame();};
 const cp=tb._actorProf();
 const faceBtn=[...document.querySelectorAll('span,button,div')].find(x=>x.textContent.trim()==='Face'&&x.children.length===0); if(faceBtn) faceBtn.click(); await wait(800); tick(5);
 const cv=[...document.querySelectorAll('canvas')].sort((a,b)=>b.width*b.height-a.width*a.height)[0];
 const shots=[]; const shoot=(label)=>{ tick(3); const c=document.createElement('canvas'); c.width=640; c.height=Math.round(640*cv.height/cv.width); const g=c.getContext('2d'); g.drawImage(cv,0,0,c.width,c.height); g.fillStyle='rgba(0,0,0,.6)'; g.fillRect(0,0,c.width,22); g.fillStyle='#fff'; g.font='14px sans-serif'; g.fillText(label,6,16); shots.push(c.toDataURL('image/jpeg',0.88)); };
 const measure=()=>{ const rig=F.rig, S=rig.__kfbSocket; const f=new T.Vector3(); S.eyes.forEach(r=>f.add(new T.Vector3(...r.n))); const bodyM=rig.rig.parent.matrixWorld; f.transformDirection(bodyM); f.y=0; f.normalize(); const up=new T.Vector3(0,1,0), right=new T.Vector3().crossVectors(up,f).normalize();
   const P=rig.eyes.map(e=>{e.updateWorldMatrix(true,false); return new T.Vector3().setFromMatrixPosition(e.matrixWorld);}); const mid=P[0].clone().add(P[1]).multiplyScalar(0.5);
   const cam=tb.runtime.camera||tb.camera; let camRight=null; if(cam){cam.updateMatrixWorld(); camRight=new T.Vector3(1,0,0).transformDirection(cam.matrixWorld);}
   return rig.eyes.map((e,k)=>{ const K=e._kfbClay; const node=(K&&K.fitNode.visible)?K.tilt:e._lids; node.updateWorldMatrix(true,false); const x=new T.Vector3(1,0,0).transformDirection(node.matrixWorld);
     let a=Math.atan2(x.dot(up),x.dot(right))*180/Math.PI; if(a>90)a-=180; if(a<-90)a+=180;
     const o=P[k].clone().sub(mid); o.y=0; o.normalize(); const xo=x.dot(o)<0?x.clone().negate():x; const outerUp=Math.atan2(xo.dot(up),xo.dot(o))*180/Math.PI;
     return {sx:e._sx, eyeSideOfViewer: camRight? (P[k].clone().sub(mid).dot(camRight)>0?'viewerRight':'viewerLeft'):null, mine:+(-e._sx*a).toFixed(2), outerUpExplicit:+outerUp.toFixed(2)}; }); };
 F.set('parts.eyes','rig'); F.set('eye.socket','surface'); F.set('eye.splay',0); F.set('eye.turn',0); F.set('eye.turnFine.l',0); F.set('eye.turnFine.r',0);
 F.set('eye.anchor.dx',0.40); F.set('eye.anchor.dy',0.21); F.set('eye.anchor.ring',0.255); const OV={w:1.06,h:1.04,d:0.98,tilt:-25}; for(const k in OV) F.set('eye.oval.'+k,OV[k]); tick(4);
 const base={...tb.ClayMod.DEFAULTS,on:true,mech:'hinge',lip:'round'};
 const res=[];
 for (const [lab,c] of [['follow',{tilt:'follow',roll:0}],['level roll0',{tilt:'level',roll:0}],['level roll+15',{tilt:'level',roll:15}],['level roll-15',{tilt:'level',roll:-15}]]) { cp.clay={...base,...c}; tick(4); res.push([lab,measure()]); shoot('P08 clay hinge · '+lab); }
 return {res,shots,cv:[cv.width,cv.height]}; })()
