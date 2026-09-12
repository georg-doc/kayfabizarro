/* brow-rig.v2.js — Pet Studio v12-S7 (10.09.2026). FORK von `brow-rig.v1.js` (dem Port von Astras
   Prototyp). v1 bleibt daneben und ist der Rückweg. Kurve, Feder, Shader, Presets, Anker (`eyeFrame()`),
   Lebenszyklus (`gen`) und Fehlervertrag sind unverändert übernommen — vier Änderungen, alle von Georg
   bestellt (10.09.), jede an genau einer Stelle:

   1) KOPFRUNDUNG (`follow` 0…1, `lift` in Augenradien). v1 legte die Braue auf eine GERADE zwischen den
      Augentiefen plus konstant 0,92 R. Jetzt wird die Kopffläche unter der Braue ABGETASTET — 13 Strahlen
      von vorn auf den Elternknoten, dieselbe Abtastung, mit der die Nase ihre Tiefe holt (Referenz statt
      Schätzung), dazwischen linear interpoliert. `follow` mischt Gerade → Fläche, `lift` hebt die ganze
      Kurve davor ab: cartoonig SCHWEBEND, aber mit der Rundung. Treffer werden gezählt (`frame.probes`);
      wo kein Kopf ist (breite Braue über die Silhouette hinaus), gilt der nächste Treffer, sonst die Gerade
      — sonst würde das Ende der Braue auf Augentiefe zurückschnappen.
   2) DREIFACHE DICKE (`thickness` 0…3 statt 0…1). Die Feder-Halbbreite hieß `.014 + .02·t`, also höchstens
      0,034. Neue Kennlinie `hbAt(t) = t ≤ 1 ? .014 + .02·t : .034·t` — bei t = 1 auf die Ziffer dasselbe wie
      v1 (0,034), bei t = 3 genau das Dreifache (0,102). Gespeicherte Pets sehen unverändert aus.
   3) EINZELNE BIEGUNG (`bendLeft`, `bendRight` −1…1): je Hälfte ein Bogen mit dem Fenster sin²(π u) — null
      an BEIDEN Enden der Hälfte, also kein Knick in der Mitte, auch als Monobraue (Maske 0). Negativ =
      konkav (Bogen nach unten), positiv = konvex. Wirkt VOR der Feder, also biegt sich auch die Tusche.
   4) ECHTER BALKEN bei `taper` 0. In v1 blieb bei 0 die Feder-Eigenschaft `taper: .45`, die Licht-Spreizung
      `edge: 2.10` und die Bauchung `1 + .18·sin` stehen — die Braue wurde nie ein Balken. Alle drei hängen
      jetzt an `p.taper` (edge nur bis 0,3 herunter, sonst verliert der Strich seine Handschrift). Bei
      `taper` 1 ist die Rechnung Ziffer für Ziffer die von v1.
   Feder: `../kfb-ink-canon.js` (Wurzel petstudio-v9), unverändert. */
import { inkHalfWidth, INK_PRESETS } from '../kfb-ink-canon.js';

export const PRESETS = Object.freeze({
  neutral: [0, .07, 0, .07, 0],
  skeptical: [.38, .62, .08, .04, 0],
  angry: [.2, -.12, -.42, -.12, .2],
  worried: [-.2, .2, .48, .2, -.2],
  surprised: [.48, .58, .5, .58, .48],
  tired: [-.35, -.06, .08, -.06, -.35],
  'critical-angry': [.32, .62, .08, -.26, .15],
});
export const PRESET_NAMES = Object.keys(PRESETS);
export const pointsFor = name => PRESETS[name]?.map((y, i) => [i / 2 - 1, y]);
export const DEFAULTS = Object.freeze({enabled:true, mask:.35, thickness:1, length:.6,
  taper:.85, height:.3, x:0, y:0, tiltLeft:0, tiltRight:0,
  bendLeft:0, bendRight:0, follow:.85, lift:.92, color:'#17130f'});

/* (2) Kennlinie der Federbreite. Stetig bei t = 1, dort auf die Ziffer der v1-Wert. */
export const hbAt = t => (t <= 1 ? .014 + .02 * t : .034 * t);

export function validate(patch) {
  const limits = {mask:[0,1],thickness:[0,3],length:[0,1],taper:[0,1],height:[0,1],x:[-1,1],y:[-1,1],
    tiltLeft:[-1,1],tiltRight:[-1,1],bendLeft:[-1,1],bendRight:[-1,1],follow:[0,1],lift:[0,3]};
  for (const [k,v] of Object.entries(patch)) {
    if (!(k in DEFAULTS) && k !== 'points') return {status:'UNSUPPORTED', field:k, reason:'Unknown eyebrow field'};
    if (limits[k] && (!Number.isFinite(v) || v<limits[k][0] || v>limits[k][1])) return {status:'UNSUPPORTED',field:k,reason:'Out of range'};
    if (k==='enabled' && typeof v!=='boolean') return {status:'UNSUPPORTED',field:k,reason:'Expected boolean'};
    if (k==='color' && v!==null && !/^#[0-9a-f]{6}$/i.test(v)) return {status:'UNSUPPORTED',field:k,reason:'Expected #RRGGBB or null'};
    if (k==='points' && (!Array.isArray(v) || v.length<3 || v.length>5 || v.some((p,i)=>!Array.isArray(p)||p.length!==2||p.some(n=>!Number.isFinite(n)||Math.abs(n)>2)||(i>0&&p[0]<=v[i-1][0])))) return {status:'UNSUPPORTED',field:k,reason:'3–5 finite, x-ordered control points required'};
  }
  return {status:'OK'};
}

/* (1) Abtastung der Kopffläche, EIN Eigentümer für alle Gesichts-Overlays (Braue, Schnurrbart, später
   Brille): 13 Strahlen von weit vorn (lokal +z) auf den Elternknoten, an den Stellen der Kurve selbst.
   Rückgabe: Feld mit 13 Tiefen (Lücken mit dem nächsten Treffer gefüllt, `hits`/`n` als Beleg) oder null,
   wenn NICHTS getroffen wurde — dann bleibt die Gerade. Overlays tragen `petOverlay` und werden übergangen. */
export function probeSkin(T, f, samples, geoAt, N = 13) {
  const host = f.parent;
  if (!host) return null;
  host.updateMatrixWorld(true);
  const ray = new T.Raycaster(); ray.layers.enableAll();
  const dW = new T.Vector3(0, 0, -1).transformDirection(host.matrixWorld).normalize();
  const z = new Array(N).fill(null); let hits = 0;
  for (let k = 0; k < N; k++) {
    const idx = Math.round(k / (N - 1) * (samples.length - 1));
    const [px, py] = geoAt(samples[idx]);
    ray.set(host.localToWorld(new T.Vector3(px, py, f.radius * 14)), dW);
    const hit = ray.intersectObject(host, true).filter(o => !(o.object.userData && o.object.userData.petOverlay))[0];
    if (hit) { z[k] = host.worldToLocal(hit.point.clone()).z; hits++; }
  }
  if (!hits) return null;
  for (let k = 1; k < N; k++) if (z[k] == null) z[k] = z[k - 1];
  for (let k = N - 2; k >= 0; k--) if (z[k] == null) z[k] = z[k + 1];
  z.hits = hits; z.n = N;
  return z;
}

export class BrowRig {
  /* `getEyeFrame` → `rig.eyeFrame()` oder null. `parent` ist optional: fehlt er, nimmt die Braue den
     Elternknoten aus dem Anker (dort hängen die Augen — die Braue wird ihr Geschwister). */
  constructor({THREE, parent=null, getEyeFrame, baseColor=0xf2c93c, seed=1001, params=null}) {
    this.T=THREE; this.getEyeFrame=getEyeFrame; this.seed=seed;
    this.autoColor=new THREE.Color(baseColor).multiplyScalar(.3);
    this.params={...DEFAULTS,points:pointsFor('neutral')};
    if (params) { const {points, ...rest}=params; Object.assign(this.params, rest); if (points) this.params.points=structuredClone(points); }
    this.material=new THREE.ShaderMaterial({transparent:true,side:THREE.DoubleSide,depthTest:true,depthWrite:false,
      uniforms:{ink:{value:this.autoColor.clone()},gap:{value:.35},cap:{value:.02}},
      vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:`uniform vec3 ink; uniform float gap; uniform float cap; varying vec2 vUv;
      void main(){
        if(gap>0.){
          float l=.5-gap*.5,r=.5+gap*.5;
          if(vUv.x>l && vUv.x<r)discard;
          float nx=0.;
          if(vUv.x<=l && vUv.x>l-cap)nx=(vUv.x-l+cap)/cap;
          if(vUv.x>=r && vUv.x<r+cap)nx=(r+cap-vUv.x)/cap;
          if(nx*nx+pow(vUv.y*2.-1.,2.)>1.)discard;
        }
        gl_FragColor=vec4(ink,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    });
    this.mesh=new THREE.Mesh(new THREE.BufferGeometry(),this.material);
    this.mesh.name='KFB single-curve eyebrow';
    this.mesh.userData.petOverlay=true; this.mesh.userData.noMeasure=true;
    this.mesh.renderOrder=4;this.mesh.frustumCulled=false;this.mesh.raycast=()=>{};
    this.gen=-1; this.last={status:'OK'};
    if (parent) parent.add(this.mesh);
    this.rebuild();
  }
  set(patch) {
    const check=validate(patch);if(check.status!=='OK')return check;
    this.params={...this.params,...structuredClone(patch)};this.rebuild();return check;
  }
  expression(name) {
    const points=pointsFor(name);
    return points?this.set({points}):{status:'UNSUPPORTED',field:'expression',reason:name};
  }
  sync() {
    const f=this.getEyeFrame();
    if(!f){ if(this.mesh.visible){this.mesh.visible=false;this.last={status:'UNSUPPORTED',field:'anchor',reason:'eye-frame anchor missing'};} return this.last; }
    if(f.gen!==this.gen||f.parent!==this.mesh.parent) this.rebuild();
    return this.last;
  }
  _probeSkin(f, samples, geoAt) { return probeSkin(this.T, f, samples, geoAt); }
  rebuild() {
    const T=this.T,p=this.params,f=this.getEyeFrame();
    if(!f||!f.left||!f.right||!(f.radius>0)){ this.mesh.visible=false; this.last={status:'UNSUPPORTED',field:'anchor',reason:'eye-frame anchor missing'}; return this.last; }
    if(f.parent&&f.parent!==this.mesh.parent){ this.mesh.removeFromParent(); f.parent.add(this.mesh); }
    this.gen=f.gen;
    const cx=(f.left.x+f.right.x)/2, cy=(f.left.y+f.right.y)/2;
    const span=Math.abs(f.right.x-f.left.x)+f.radius*2;
    const width=span*(.55+.75*p.length), amp=f.radius*.85;
    const controls=p.points.map(([x,y])=>new T.Vector3(x,y+(x<0?p.tiltLeft*(-x-.5):p.tiltRight*(x-.5)),0));
    const curve=new T.CatmullRomCurve3(controls,false,'centripetal');
    const samples=curve.getPoints(128);
    /* (3) einzelne Biegung, VOR der Feder: Fenster sin²(π u) je Hälfte, u = 0 an beiden Enden der Hälfte. */
    if(p.bendLeft||p.bendRight){
      for(const v of samples){
        const b=v.x<0?p.bendLeft:p.bendRight;
        if(!b) continue;
        const u=v.x<0?(v.x+1):v.x, s=Math.sin(Math.PI*Math.max(0,Math.min(1,u)));
        v.y+=b*.45*s*s;
      }
    }
    const nibPoints=samples.map(v=>[(v.x+1)*256,128-v.y*90]);
    /* (2) + (4): Federbreite aus der neuen Kennlinie, Dick-Dünn und Licht-Spreizung am Auslauf-Regler. */
    const hb=hbAt(p.thickness);
    const nib=inkHalfWidth(nibPoints,512,256,this.seed,{...INK_PRESETS.figure,hb,minHalf:0,edge:2.10*(.3+.7*p.taper),taper:.45*p.taper},1);
    const geoAt=q=>[cx+p.x*f.radius+q.x*width/2, cy+f.radius*(1.16+p.height*.85+p.y)+q.y*amp];
    const skin=p.follow>0?this._probeSkin(f,samples,geoAt):null;
    const positions=[],uv=[],indices=[];
    for(let i=0;i<samples.length;i++){
      const t=i/(samples.length-1), q=samples[i];
      const prev=samples[Math.max(0,i-1)],next=samples[Math.min(samples.length-1,i+1)];
      const tangent=new T.Vector2((next.x-prev.x)*width/2,(next.y-prev.y)*amp).normalize();
      const envelope=1-p.taper+p.taper*Math.pow(Math.sin(Math.PI*t),.65);
      const half=nib(i)*width/512*envelope*(1+.18*p.taper*Math.sin(Math.PI*t));
      const [x,y]=geoAt(q);
      let zBase=T.MathUtils.lerp(f.left.z,f.right.z,t);
      if(skin){
        const u=t*(skin.n-1), k=Math.min(skin.n-2,Math.floor(u));
        const zs=T.MathUtils.lerp(skin[k],skin[k+1],u-k);
        zBase=T.MathUtils.lerp(zBase,zs,p.follow);
      }
      const z=zBase+f.radius*p.lift;
      for(const s of [-1,1]){positions.push(x-tangent.y*half*s,y+tangent.x*half*s,z);uv.push(t,s*.5+.5);}
      if(i<samples.length-1){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}
    }
    const geo=this.mesh.geometry;
    if(geo.attributes.position?.count===positions.length/3){
      geo.attributes.position.array.set(positions);geo.attributes.position.needsUpdate=true;
    }else{
      geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));
      geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);
    }
    geo.computeBoundingSphere();
    this.mesh.visible=p.enabled;
    this.material.uniforms.gap.value=p.mask;
    this.material.uniforms.cap.value=hb*.5;
    this.material.uniforms.ink.value.copy(p.color?new T.Color(p.color):this.autoColor);
    this.frame={center:[cx,cy],radius:f.radius,span,width,gen:f.gen,hb,
      probes:skin?skin.hits:0,probeN:skin?skin.n:0,
      zRange:skin?[Math.min(...skin.slice(0,skin.n)),Math.max(...skin.slice(0,skin.n))]:null};
    this.last={status:'OK'};
    return this.last;
  }
  setBaseColor(hex){ this.autoColor.set(hex).multiplyScalar(.3); if(!this.params.color) this.material.uniforms.ink.value.copy(this.autoColor); }
  export(){return {schema:'kfb.brow-experiment/0.2',seed:this.seed,...structuredClone(this.params)};}
  dispose(){this.mesh.removeFromParent();this.mesh.geometry.dispose();this.material.dispose();}
}
