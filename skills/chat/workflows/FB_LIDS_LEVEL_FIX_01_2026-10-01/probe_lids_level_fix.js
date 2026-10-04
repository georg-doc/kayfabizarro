(async()=>{ const tb=window.__kfbTB; await tb.pickRoster(tb._rosterEntry('frizzlebob-earrig-v5'));
 const wait=ms=>new Promise(r=>setTimeout(r,ms)); for(let i=0;i<60;i++){ const F=tb.runtime.face; if(F&&F.rig&&F.rig.eyes&&F.rig.eyes.length>1&&tb._rid()==='frizzlebob-earrig-v5') break; await wait(500);}
 const T=tb.THREE, F=tb.runtime.face, tick=n=>{for(let i=0;i<n;i++) tb._frame();};
 const cp=tb._actorProf();
 // Face framing button
 const faceBtn=[...document.querySelectorAll('span,button,div')].find(x=>x.textContent.trim()==='Face'&&x.children.length===0); if(faceBtn) faceBtn.click(); await wait(800); tick(5);
 const cv=[...document.querySelectorAll('canvas')].sort((a,b)=>b.width*b.height-a.width*a.height)[0];
 const shots=[]; const shoot=(label)=>{ tick(3); const c=document.createElement('canvas'); c.width=480; c.height=Math.round(480*cv.height/cv.width); const g=c.getContext('2d'); g.drawImage(cv,0,0,c.width,c.height); g.fillStyle='rgba(0,0,0,.6)'; g.fillRect(0,0,c.width,22); g.fillStyle='#fff'; g.font='13px sans-serif'; g.fillText(label,6,15); shots.push(c.toDataURL('image/jpeg',0.85)); };
 const measure=()=>{ const rig=F.rig, S=rig.__kfbSocket; const f=new T.Vector3(); S.eyes.forEach(r=>f.add(new T.Vector3(...r.n))); const bodyM=rig.rig.parent.matrixWorld; f.transformDirection(bodyM); f.y=0; f.normalize(); const up=new T.Vector3(0,1,0), right=new T.Vector3().crossVectors(up,f).normalize();
   return rig.eyes.map((e,k)=>{ const K=e._kfbClay; const node=(K&&K.fitNode.visible)?K.tilt:e._lids; node.updateWorldMatrix(true,false); const x=new T.Vector3(1,0,0).transformDirection(node.matrixWorld); let a=Math.atan2(x.dot(up),x.dot(right))*180/Math.PI; if(a>90)a-=180; if(a<-90)a+=180; return {sx:e._sx,yaw:+S.eyes[k].yawOutDeg.toFixed(1),pitch:+S.eyes[k].pitchUpDeg.toFixed(1),outerUpDeg:+(-e._sx*a).toFixed(2)}; }); };
 F.set('parts.eyes','rig'); F.set('eye.socket','surface'); F.set('eye.splay',0); F.set('eye.turn',0); F.set('eye.turnFine.l',0); F.set('eye.turnFine.r',0);
 F.set('eye.anchor.dx',0.40); F.set('eye.anchor.dy',0.21); F.set('eye.anchor.ring',0.255); const OV={w:1.06,h:1.04,d:0.98,tilt:-25}; for(const k in OV) F.set('eye.oval.'+k,OV[k]); tick(4);
 const base={...tb.ClayMod.DEFAULTS,on:true,mech:'hinge',lip:'round'};
 const res=[];
 tb.clay._lvl=(e,p)=> (p.tilt!=='follow' ? -(+e._kfbTilt||0) : 0) + (e._sx||1)*-1*(+p.roll||0)*Math.PI/180;
 for (const r of [-5,0,5]) { cp.clay={...base,tilt:'level',roll:r}; tick(4); res.push(['FIX level roll '+r+' (oval -25, turn 0)',measure()]); }
 for (const t of [15,30]) { F.set('eye.turn',t); tick(4); cp.clay={...base,tilt:'level',roll:0}; tick(4); res.push(['FIX level, turn '+t,measure()]); }
 F.set('eye.turn',0); F.set('eye.oval.tilt',0); tick(4); cp.clay={...base,tilt:'level',roll:0}; tick(4); res.push(['FIX level, oval tilt 0',measure()]);
 F.set('eye.anchor.dx',0.52); F.set('eye.oval.tilt',-25); tick(4); cp.clay={...base,tilt:'level',roll:0}; tick(4); res.push(['FIX level, dx .52',measure()]);
 cp.clay={...base,tilt:'follow',roll:0}; tick(4); res.push(['FIX follow (dx .52, tilt -25)',measure()]);
 return {res,shots,faceBtn:!!faceBtn,cv:[cv.width,cv.height]}; })()
