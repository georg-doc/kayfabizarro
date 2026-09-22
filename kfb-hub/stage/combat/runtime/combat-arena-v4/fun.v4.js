// v4 presentation layer. Combat owns HP and motion; this layer owns transient paper and UI.
import {Rewards} from './rewards.v4a.js';
import {SlamAction} from './slam.v4a.js';
import {actionForCode,isTextEntry,canAct,createActionDispatcher} from './actions.v5a.js';
import {controlsMarkup} from './controls.v5a.js';
export async function installFun(c) {
  const T=c.THREE, host=c.host, gf=c.gf, ze=c.ze;
  const stats={slams:0,cleans:0,fragments:0,hits:0,pops:0,bounces:0};
  let chill=true, elapsed=0, lastCard=c.ring.current, paused=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const group=new T.Group();group.name='v4-paper-feedback';host.scene.add(group);
  const geometry=new T.PlaneGeometry(.11,.19);
  const materials=[0xe9c14a,0xf3ead3,0x45b4ad,0xb8361f].map(color=>new T.MeshBasicMaterial({color,side:T.DoubleSide,toneMapped:false}));
  const bits=[], labels=new Map();
  const ui=document.createElement('div');ui.className='v4-ui';
  ui.innerHTML=`<style>
  .v4-ui{position:absolute;inset:0;pointer-events:none;z-index:11;font-family:'Space Grotesk',system-ui,sans-serif;color:#f3ead3}
  .v4-tools{position:absolute;bottom:16px;left:16px;right:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .v4-ui button{pointer-events:auto;border:2px solid #1f1a14;box-shadow:3px 3px 0 #1f1a14;padding:9px 13px;font-family:inherit;font-size:14px;font-weight:700;background:#f3ead3;color:#1f1a14;cursor:pointer;border-radius:4px}
  .v4-ui button:focus-visible{outline:3px solid #45b4ad;outline-offset:3px}
  .v4-ui button[data-slam]{background:#e9c14a;min-width:125px}
  .v4-ui button:disabled{opacity:.7;cursor:default}
  .v4-help{margin-left:auto;background:#1f1a14de;padding:9px 12px;border-radius:4px;font-size:12px;line-height:1.5}
  .v4-pips{position:absolute;display:flex;gap:4px;transform:translate(-50%,-100%);padding:4px;background:#1f1a14db;border-radius:5px}
  .v4-pips i{width:9px;height:6px;display:block;border-radius:2px;background:#e9c14a}
  .v4-pips i.empty{background:#716954}
  .v4-pips.power-stun::before{content:"★";color:#f3ead3;font-size:15px;line-height:8px}
  .v4-pips.target{outline:2px solid #f3ead3;outline-offset:2px}
  .v4-toast{position:absolute;left:50%;top:19%;transform:translateX(-50%);font:28px 'Bangers',cursive;color:#e9c14a;text-shadow:2px 2px #1f1a14;opacity:0;transition:opacity .15s}
  .v4-health{position:absolute;left:16px;top:75px;height:7px;width:100px;background:#1f1a14;border:2px solid #1f1a14;border-radius:4px;overflow:hidden}
  .v4-coins{position:absolute;right:70px;top:18px;background:#1f1a14d9;border:1px solid #e9c14a;border-radius:5px;padding:6px 10px;font-weight:700}.v4-state{position:absolute;left:16px;top:91px;font-size:12px;color:#e9c14a}.v4-health span{height:100%;display:block;background:#e9c14a;transition:width .15s}
  @media(max-width:680px){.v4-help{width:100%;margin:0;font-size:12px}.v4-tools{gap:6px;bottom:10px;left:10px;right:10px}.v4-ui button{padding:8px 10px}}
  </style><div class="v4-health" role="meter" aria-label="FrizzleBobs Energie" aria-valuemin="0" aria-valuemax="100"><span></span></div>
  <div class="v4-coins" aria-label="Gesammelte Goldmünzen">◉ <span>0</span></div><div class="v4-state"></div><div class="v4-toast" aria-live="polite"></div><div class="v4-tools">
    ${controlsMarkup()}
  </div>`;
  (c._root || document.body).appendChild(ui);
  const slamButton=ui.querySelector('[data-slam]'), modeButton=ui.querySelector('[data-chill]'), soundButton=ui.querySelector('[data-sound]');
  const toastEl=ui.querySelector('.v4-toast');let toastTime=0, nextProbe=0;
  function toast(text){toastEl.textContent=text;toastEl.style.opacity=1;toastTime=1.15;}
  function burst(pos,n=14){
    if(reduced)n=Math.min(n,5);
    for(let i=0;i<n && bits.length<160;i++){
      const mesh=new T.Mesh(geometry,materials[i%materials.length]);mesh.position.copy(pos);mesh.position.y+=.12;
      const a=host.rng()*Math.PI*2,v=1.4+host.rng()*2.2;
      const bit={mesh,vx:Math.cos(a)*v,vz:Math.sin(a)*v,vy:2+host.rng()*3,t:0,life:.7+host.rng()*.5};
      group.add(mesh);bits.push(bit);stats.fragments++;
    }
  }
  function clean(pos,radius){const n=ze?.radieren?.(pos.x,pos.z,radius) || 0;stats.cleans+=n;return n;}
  function slam(){
    return slamAction.request();
  }
  function impact(){
    const pos=c.pc.pos.clone();pos.y=host.field.floorY();stats.slams++;
    burst(pos,34);clean(pos,3.2);
    for(const m of c.mb.lebende()){
      const dx=m.pos.x-pos.x,dz=m.pos.z-pos.z,d=Math.hypot(dx,dz);
      if(d<3.2+m.radius)gf.damageMob(m,{x:dx/(d||1),z:dz/(d||1)},m.pos.clone());
    }
    if(!gf.aggro){gf.aggro=true;c.mb.friedlich=false;}
    host.fx.cue('abzug',{sfx:'cartoon.slam',at:pos});
    host.fx.emit('burst',pos,{size:1.7,life:.28,color:0xe9c14a});toast('PAP!');
  }
  const slamAction=c.pc.slamAction=new SlamAction(c.pc,{allowed:()=>['play','cleared'].includes(c.rf?.phase) && !c.state.settingsOn && !document.hidden,impact});
  const dispatch=createActionDispatcher(c,{slam});
  ui.querySelectorAll('[data-action]').forEach(button=>button.onclick=()=>dispatch(button.dataset.action));
  const helpButton=ui.querySelector('[data-help]'),legend=ui.querySelector('.v5-legend');
  helpButton.onclick=()=>{legend.hidden=!legend.hidden;helpButton.setAttribute('aria-expanded',String(!legend.hidden));};
  // HUD clicks belong to the HUD; never create a scene shot or continue held fire.
  ui.addEventListener('pointerdown',e=>{e.stopPropagation();host.input.state.fire=false;host.input.state.firePressed=false;});
  ui.addEventListener('contextmenu',e=>e.preventDefault());
  modeButton.onclick=()=>{chill=!chill;modeButton.textContent=chill?'Chill ☀':'Action ⚡';modeButton.setAttribute('aria-pressed',String(chill));toast(chill?'Kein Stress. Einfach spielen.':'Action!');};
  soundButton.onclick=async()=>{c.setState({sound:!c.state.sound});await host.fx.tonAn();host.fx.stumm(!c.state.sound);};
  const onKey=e=>{
    if(e.repeat || isTextEntry(e.target))return;
    const action=actionForCode(e.code);
    if(action?.id==='slam' || action?.id==='pause'){e.preventDefault();dispatch(action.id);}
  };
  addEventListener('keydown',onKey);
  const originalBlack=ze.schwarz.bind(ze);ze.schwarz=()=>chill?false:originalBlack();
  gf.onHit=(m,pos)=>{stats.hits++;burst(pos,7);};
  gf.onPop=m=>{stats.pops++;toast('PLOPP!');};
  gf.onSkullBounce=(pos,index)=>burst(pos,[12,7,4][index]);
  gf.onReveal=(pos,r)=>{clean(pos,r*.82);for(let i=0;i<6;i++){const a=i*Math.PI/3;clean({x:pos.x+Math.cos(a)*r*.68,z:pos.z+Math.sin(a)*r*.68},r*(.29+.035*(i%2)));}};
  gf.onBounce=p=>{stats.bounces++;if(p.bounces===1 && p.von==='spieler'){clean(p.grp.position,.4);burst(p.grp.position,3);}};
  gf.onPickup=(p,result)=>{toast(result.text);burst(p.grp.position,p.kind==='waterbomb'?24:p.kind==='smokebomb'?12:5);};
  gf.onAimFailure=()=>toast('Waffe noch nicht bereit – erneut zielen');
  gf.isChill=()=>chill;
  gf.rewards=await Rewards.load(gf,{chill:()=>chill,reduced});
  const oldRoundUpdate=c.rf.update.bind(c.rf);
  c.rf.update=dt=>{
    if(c.state.settingsOn || document.hidden)return c.rf.phase;
    if(chill && ['play','cleared'].includes(c.rf.phase))gf.hp=Math.max(35,gf.hp);
    return oldRoundUpdate(dt);
  };
  const oldPhase=c.rf.onPhase;
  c.rf.onPhase=phase=>{
    if(phase!=='cleared'){host.input.reset();gf.cancelShot();}
    if(phase==='ruesten' || phase==='countdown'){
      gf.rewards.clear();
      for(const p of gf.schuesse)gf.gruppe.remove(p.grp);gf.schuesse.length=0;
      for(const p of gf.pickups)gf.gruppe.remove(p.grp);gf.pickups.length=0;
      slamAction.cancel(true);
    }
    oldPhase(phase);
  };
  const aimRing=new T.Mesh(new T.RingGeometry(.16,.19,32),new T.MeshBasicMaterial({color:0xe9c14a,transparent:true,opacity:.85,side:T.DoubleSide,depthWrite:false,toneMapped:false}));
  aimRing.rotation.x=-Math.PI/2;aimRing.visible=false;group.add(aimRing);
  const starShape=new T.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5,r=i%2?.045:.1;i?starShape.lineTo(Math.cos(a)*r,Math.sin(a)*r):starShape.moveTo(Math.cos(a)*r,Math.sin(a)*r);}starShape.closePath();
  const stars=Array.from({length:3},()=>{const m=new T.Mesh(new T.ShapeGeometry(starShape),new T.MeshBasicMaterial({color:0xe9c14a,side:T.DoubleSide,toneMapped:false}));m.visible=false;group.add(m);return m;});
  const halo=new T.Mesh(new T.RingGeometry(.30,.36,40),new T.MeshBasicMaterial({color:0x5fbf3a,transparent:true,opacity:0,side:T.DoubleSide,depthWrite:false,toneMapped:false}));halo.rotation.x=-Math.PI/2;group.add(halo);
  const oldStep=c.schritt.bind(c);
  c.schritt=now=>{
    if(c.state.settingsOn || document.hidden){
      c._lastF=now;c._lastB=now;paused=true;host.time.state.phase='paused';host.input.reset();gf.cancelShot();
      ui.dataset.probe=JSON.stringify({paused:true,phase:c.rf.phase,roundTime:c.rf.t,ink:ze.deckung,gun:gf.probe(),input:{x:0,z:0,fire:false},errors:c.fehler});
      return 0;
    }
    const dt=oldStep(now);elapsed+=dt;
    // Settings and tab changes suspend gameplay, with fresh inputs on resume.
    const wantPause=!!c.state.settingsOn || document.hidden;
    if(wantPause!==paused){paused=wantPause;host.input.reset();}
    if(paused){host.time.state.phase='paused';ui.dataset.probe=JSON.stringify({paused:true,phase:c.rf.phase,roundTime:c.rf.t,gun:gf.probe(),input:{x:host.input.state.x,z:host.input.state.z,fire:host.input.state.fire},errors:c.fehler});return dt;}
    if(host.time.state.phase==='paused')host.time.state.phase=['play','cleared'].includes(c.rf?.phase)?'play':'countdown';
    if(chill && ['play','cleared'].includes(c.rf?.phase))gf.hp=Math.max(35,gf.hp);
    const playing=['play','cleared'].includes(c.rf?.phase);
    const target=gf.aimTarget,tracking=!!target && (gf.aimLife>0 || gf._offen) && !target.tot && !target.weg;
    aimRing.visible=tracking && playing;
    if(tracking){aimRing.position.set(target.pos.x,host.field.floorY()+.05,target.pos.z);aimRing.scale.setScalar(1+Math.sin(elapsed*8)*.08);}
    const rig=c.fb?.rig;
    if(rig){
      if(tracking && rig.rig){const pt=target.pos.clone();if(!target.point)pt.y+=target.hoehe*.5;
        rig.rig.updateWorldMatrix(true,false);rig.rig.worldToLocal(pt);
        rig.setGazeFollow(true);rig.pointTo(Math.atan2(pt.x,Math.max(.2,pt.z))/.75,Math.atan2(pt.y,Math.max(.2,Math.hypot(pt.x,pt.z)))/.65);
      }else if(rig._follow)rig.setGazeFollow(false);
    }
    const stunned=(c.pc.stunRemaining||0)>0;
    stars.forEach((m,i)=>{m.visible=stunned;if(stunned){const a=elapsed*5+i*Math.PI*2/3;m.position.set(c.pc.pos.x+Math.cos(a)*.38,c.pc.pos.y+c.pc.hoehe+.1+Math.sin(a*2)*.06,c.pc.pos.z+Math.sin(a)*.38);m.quaternion.copy(host.camera.quaternion);}});
    const feedback=gf.rewards.feedback.at(-1);halo.visible=!!feedback;
    if(feedback){halo.position.set(c.pc.pos.x,host.field.floorY()+.055,c.pc.pos.z);halo.scale.setScalar(1+feedback.t*1.5);halo.material.opacity=(1-feedback.t/.75)*.7;halo.material.color.setHex(feedback.kind==='heal'?0x5fbf3a:feedback.kind==='waterbomb'?0x45b4ad:feedback.kind==='smokebomb'?0xac82dc:feedback.kind==='damage'?0xe84b3c:0xe9c14a);}
    ui.querySelector('.v4-coins span').textContent=gf.coins||0;
    ui.querySelector('.v4-state').textContent=stunned?`★ Benommen · ${c.pc.stunRemaining.toFixed(1)} s`:'';

    if(!playing)slamAction.cancel();
    if(lastCard!==c.ring.current){lastCard=c.ring.current;slamAction.cancel(true);host.input.reset();for(const b of bits)group.remove(b.mesh);bits.length=0;}
    const cooldown=slamAction.cooldown;
    slamButton.disabled=!playing || cooldown>0 || stunned;
    slamButton.querySelector('span').textContent=cooldown>0?`Slam · ${cooldown.toFixed(1)} s`:'Tinten-Slam';
    ui.querySelector('[data-action=jump]').disabled=!canAct(c);
    soundButton.textContent=c.state.sound?'Ton an ♪':'Ton aus';soundButton.setAttribute('aria-pressed',String(!!c.state.sound));
    ui.querySelector('.v4-health span').style.width=gf.hp+'%';ui.querySelector('.v4-health').setAttribute('aria-valuenow',Math.round(gf.hp));
    ui.querySelector('.v4-tools').style.display=c.state.settingsOn?'none':'flex';
    toastTime-=dt;if(toastTime<=0)toastEl.style.opacity=0;
    for(let i=bits.length-1;i>=0;i--){const b=bits[i];b.t+=dt;b.vy-=12*dt;b.mesh.position.x+=b.vx*dt;b.mesh.position.z+=b.vz*dt;b.mesh.position.y+=b.vy*dt;b.mesh.rotation.x+=dt*8;b.mesh.rotation.z+=dt*5;
      const floor=host.field.floorY()+.025;
      if(b.mesh.position.y<floor && host.field.inside(b.mesh.position.x,b.mesh.position.z)){b.mesh.position.y=floor;b.vy=Math.abs(b.vy)*.25;b.vx*=.9;b.vz*=.9;}
      b.mesh.scale.setScalar(Math.max(0,1-b.t/b.life));
      if(b.t>b.life){group.remove(b.mesh);bits.splice(i,1);}
    }
    const rect=c._canvas.getBoundingClientRect(),alive=new Set(c.mb.lebende());
    for(const [m,el] of labels)if(!alive.has(m)){el.remove();labels.delete(m);}
    for(const m of alive){
      gf._leben(m);let el=labels.get(m);
      if(!el){el=document.createElement('div');el.className='v4-pips';el.innerHTML='<i></i><i></i><i></i>';ui.appendChild(el);labels.set(m,el);}
      const p=new T.Vector3(m.pos.x,m.pos.y+m.hoehe+.23,m.pos.z).project(host.camera);
      el.hidden=p.z>1 || p.z< -1 || Math.abs(p.x)>1 || Math.abs(p.y)>1 || c.state.settingsOn;
      el.style.left=(p.x*.5+.5)*rect.width+'px';el.style.top=(-p.y*.5+.5)*rect.height+'px';
      el.classList.toggle('target',gf.zielMob===m);el.style.background=m.powerStun>0?'#78559f':m._windup>0?'#b8361f':'#1f1a14db';el.classList.toggle('power-stun',m.powerStun>0);[...el.children].forEach((pip,i)=>pip.classList.toggle('empty',i>=m.hp));
    }
    if(elapsed>=nextProbe){nextProbe=elapsed+.25;ui.dataset.probe=JSON.stringify({...stats,phase:c.rf.phase,input:{x:host.input.state.x,z:host.input.state.z,fire:host.input.state.fire},hp:gf.hp,ink:ze.deckung,fx:host.fx.stats(),gun:gf.probe(),rewards:gf.rewards.stats,shot:gf.lastShot,aim:gf._offen?.stage,player:{pos:c.pc.pos.toArray(),stun:c.pc.stunRemaining,clip:c.pc.clipName},errors:c.fehler,alive:c.mb.lebende().map(m=>({id:m.e.id,hp:m.hp,position:[m.pos.x,m.pos.y,m.pos.z]}))});}
    return dt;
  };
  c.fun={slam,dispatch,stats,probe:()=>({...stats,chill,cooldown:slamAction.cooldown,slam:slamAction.stage,particles:bits.length,health:gf.hp,alive:c.mb.lebende().map(m=>({id:m.e.id,hp:m.hp}))})};
  return c.fun;
}
