/* pet-moustache.v1.js — Pet Studio v12-S8 (10.09.2026). Georgs Bestellung vom 10.09.: »bärte geplant
   (schnurrbärte erstmal) moustache-varianten (dali, nietzsche, biker etc) mit ähnlicher ink&strich-logik
   wie augenbrauen.«

   DERSELBE BAUWEG WIE DIE BRAUE, absichtlich: eine Kurve, eine Maske, die Kanon-Feder, der öffentliche
   Anker `rig.eyeFrame()`, ein `gen`-Zähler, Fehler als Zustand. Was hier NICHT steht, ist ein zweiter
   Zeichner — die Dick-Dünn-Kennlinie wird aus `brow-rig.v2.js` IMPORTIERT (`hbAt`), damit »Dicke 1« an
   Braue und Schnurrbart dieselbe Zahl bedeutet: eine Feder, ein Eigentümer.

   Drei Unterschiede zur Braue, alle sachlich begründet:
   1) ANKER: die Braue hängt über den Augen, der Schnurrbart UNTER DER NASE. Er liest darum optional
      `getNose()` → `nose.frame` (Mitte und Höhe der Knolle, gleiche lokale Koordinaten, weil beide am
      selben Elternknoten hängen). Ohne Nase fällt er auf die Augenmitte + 1,55 R zurück — er sitzt dann
      tiefer im Gesicht, aber er sitzt.
   2) HÄNGEN (`sag`) und SPITZEN (`curlLeft` / `curlRight`): der Bogen nach unten über die ganze Spanne
      (Walross) und die Locke am äußeren Ende (Dalí nach oben, Biker nach unten). Die Locke wirkt nur im
      äußeren Drittel (Fenster ((|x|−0,55)/0,45)²), damit die Mitte gerade bleibt.
   3) PRESETS SIND GANZE FORMEN, nicht nur Punktfolgen — ein Schnurrbart unterscheidet sich von einem
      anderen vor allem in Dicke, Spanne und Locke. **Frei wählbar, nicht an die Brauen-Ausdrücke
      gekoppelt** (Georgs Entscheidung 10.09.).

   Georgs Wortliste: »Schnurrbart« ist das Bauteil, »Locke« die gedrehte Spitze, »Hängen« der Bogen
   nach unten. Auch mit Maske > 0 sind es nie zwei Schnurrbärte — es ist eine Kurve mit einer Lücke. */
import { inkHalfWidth, INK_PRESETS } from '../kfb-ink-canon.js';
import { hbAt } from './brow-rig.v2.js';

export const DEFAULTS = Object.freeze({ enabled:false, style:'walrus', mask:0, thickness:1.8, length:.7,
  taper:.55, height:.35, x:0, y:0, sag:.5, curlLeft:0, curlRight:0, bendLeft:0, bendRight:0,
  follow:.8, lift:.75, color:'#17130f' });

/* Formen. Punktfolge = Mittellinie (x −1…1), der Rest sind die Regler, die die Form ausmachen.
   Jede Zeile ist EIN Schnurrbart, kein Baukasten aus Halbteilen. */
export const STYLES = Object.freeze({
  walrus:     { points:[[-1,-.10],[-.5,.04],[0,.10],[.5,.04],[1,-.10]], mask:0,   thickness:2.6, length:.86, taper:.35, sag:.75, curlLeft:-.25, curlRight:-.25, height:.30 },
  nietzsche:  { points:[[-1,-.22],[-.5,.02],[0,.14],[.5,.02],[1,-.22]], mask:0,   thickness:3,   length:.95, taper:.22, sag:1,   curlLeft:-.5,  curlRight:-.5,  height:.22 },
  dali:       { points:[[-1,.26],[-.5,-.02],[0,.02],[.5,-.02],[1,.26]], mask:.46, thickness:.45, length:1,   taper:1,   sag:0,   curlLeft:1,    curlRight:1,    height:.40 },
  biker:      { points:[[-1,-.06],[-.5,.06],[0,.10],[.5,.06],[1,-.06]], mask:.26, thickness:2,   length:.92, taper:.6,  sag:.45, curlLeft:.55,  curlRight:.55,  height:.34 },
  chaplin:    { points:[[-1,0],[-.5,.02],[0,.04],[.5,.02],[1,0]],       mask:0,   thickness:2.2, length:.26, taper:0,   sag:0,   curlLeft:0,    curlRight:0,    height:.34 },
  pencil:     { points:[[-1,-.04],[-.5,.02],[0,.05],[.5,.02],[1,-.04]], mask:0,   thickness:.7,  length:.62, taper:.85, sag:.2,  curlLeft:0,    curlRight:0,    height:.36 },
  horseshoe:  { points:[[-1,-.34],[-.5,.04],[0,.10],[.5,.04],[1,-.34]], mask:0,   thickness:2.2, length:.72, taper:.3,  sag:.9,  curlLeft:-1,   curlRight:-1,   height:.28 },
  handlebar:  { points:[[-1,.14],[-.5,.02],[0,.08],[.5,.02],[1,.14]],   mask:.18, thickness:1.6, length:.9,  taper:.75, sag:.3,  curlLeft:.85,  curlRight:.85,  height:.36 },
});
export const STYLE_NAMES = Object.keys(STYLES);
export const paramsForStyle = name => (STYLES[name] ? { ...DEFAULTS, ...structuredClone(STYLES[name]), style:name, enabled:true } : null);

export function validate(patch) {
  const limits = {mask:[0,1],thickness:[0,3],length:[0,1.4],taper:[0,1],height:[-1,3],x:[-1,1],y:[-1,1],
    sag:[0,1.5],curlLeft:[-1,1],curlRight:[-1,1],bendLeft:[-1,1],bendRight:[-1,1],follow:[0,1],lift:[0,3]};
  for (const [k,v] of Object.entries(patch)) {
    if (!(k in DEFAULTS) && k !== 'points') return {status:'UNSUPPORTED', field:k, reason:'Unknown moustache field'};
    if (limits[k] && (!Number.isFinite(v) || v<limits[k][0] || v>limits[k][1])) return {status:'UNSUPPORTED',field:k,reason:'Out of range'};
    if (k==='enabled' && typeof v!=='boolean') return {status:'UNSUPPORTED',field:k,reason:'Expected boolean'};
    if (k==='style' && !(v in STYLES)) return {status:'UNSUPPORTED',field:k,reason:'Unknown style'};
    if (k==='color' && v!==null && !/^#[0-9a-f]{6}$/i.test(v)) return {status:'UNSUPPORTED',field:k,reason:'Expected #RRGGBB or null'};
    if (k==='points' && (!Array.isArray(v) || v.length<3 || v.length>5 || v.some((p,i)=>!Array.isArray(p)||p.length!==2||p.some(n=>!Number.isFinite(n)||Math.abs(n)>2)||(i>0&&p[0]<=v[i-1][0])))) return {status:'UNSUPPORTED',field:k,reason:'3–5 finite, x-ordered control points required'};
  }
  return {status:'OK'};
}

export class MoustacheRig {
  /* `getNose` ist optional (siehe Kopf, Punkt 1). `seed` 2002, damit der Riss der Feder ein anderer ist
     als der der Braue (1001) — zwei Striche derselben Hand, nicht zwei Kopien eines Strichs. */
  constructor({THREE, getEyeFrame, getNose=null, baseColor=0xf2c93c, seed=2002, params=null}) {
    this.T=THREE; this.getEyeFrame=getEyeFrame; this.getNose=getNose; this.seed=seed;
    this.autoColor=new THREE.Color(baseColor).multiplyScalar(.28);
    this.params={...DEFAULTS, points:structuredClone(STYLES.walrus.points)};
    if (params) { const {points, ...rest}=params; Object.assign(this.params, rest); if (points) this.params.points=structuredClone(points); }
    this.material=new THREE.ShaderMaterial({transparent:true,side:THREE.DoubleSide,depthTest:true,depthWrite:false,
      uniforms:{ink:{value:this.autoColor.clone()},gap:{value:0},cap:{value:.02}},
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
    this.mesh.name='KFB moustache';
    this.mesh.userData.petOverlay=true; this.mesh.userData.noMeasure=true;
    this.mesh.renderOrder=5; this.mesh.frustumCulled=false; this.mesh.raycast=()=>{};
    this.gen=-1; this.last={status:'OK'};
    this.rebuild();
  }
  set(patch){ const c=validate(patch); if(c.status!=='OK') return c; this.params={...this.params,...structuredClone(patch)}; this.rebuild(); return c; }
  /* Eine Form setzt ALLE ihre Regler — sonst trägt ein Dalí die Dicke eines Walrosses und heißt trotzdem
     Dalí. Lage (`x`,`y`), Kopfrundung (`follow`,`lift`) und Farbe bleiben, weil sie zum Kopf gehören,
     nicht zur Form. */
  style(name){
    const s=STYLES[name];
    if(!s) return {status:'UNSUPPORTED',field:'style',reason:name};
    const keep={x:this.params.x,y:this.params.y,follow:this.params.follow,lift:this.params.lift,color:this.params.color,enabled:this.params.enabled};
    this.params={...DEFAULTS,...structuredClone(s),...keep,style:name};
    this.rebuild(); return {status:'OK'};
  }
  sync(){
    const f=this.getEyeFrame();
    if(!f){ if(this.mesh.visible){this.mesh.visible=false;this.last={status:'UNSUPPORTED',field:'anchor',reason:'eye-frame anchor missing'};} return this.last; }
    const nz=this.getNose&&this.getNose(); const nk=nz?nz.gen+':'+nz.center[1].toFixed(3):'-';
    if(f.gen!==this.gen||f.parent!==this.mesh.parent||nk!==this._noseKey) this.rebuild();
    return this.last;
  }
  /* Kopffläche abtasten — wortgleich zum Verfahren der Braue (13 Strahlen von vorn, Lücken mit dem
     nächsten Treffer gefüllt). Overlays (Augen, Mund, Nase, Braue) tragen `petOverlay` und werden
     übergangen; ohne diesen Filter würde der Schnurrbart auf der NASE landen, nicht am Kopf. */
  _probeSkin(f, samples, geoAt){
    const T=this.T, host=f.parent, N=13;
    if(!host) return null;
    host.updateMatrixWorld(true);
    const ray=new T.Raycaster(); ray.layers.enableAll();
    const dW=new T.Vector3(0,0,-1).transformDirection(host.matrixWorld).normalize();
    const z=new Array(N).fill(null); let hits=0;
    for(let k=0;k<N;k++){
      const idx=Math.round(k/(N-1)*(samples.length-1));
      const [px,py]=geoAt(samples[idx]);
      ray.set(host.localToWorld(new T.Vector3(px,py,f.radius*14)), dW);
      const hit=ray.intersectObject(host,true).filter(o=>!(o.object.userData&&o.object.userData.petOverlay))[0];
      if(hit){ z[k]=host.worldToLocal(hit.point.clone()).z; hits++; }
    }
    if(!hits) return null;
    for(let k=1;k<N;k++) if(z[k]==null) z[k]=z[k-1];
    for(let k=N-2;k>=0;k--) if(z[k]==null) z[k]=z[k+1];
    z.hits=hits; z.n=N;
    return z;
  }
  rebuild(){
    const T=this.T,p=this.params,f=this.getEyeFrame();
    if(!f||!f.left||!f.right||!(f.radius>0)){ this.mesh.visible=false; this.last={status:'UNSUPPORTED',field:'anchor',reason:'eye-frame anchor missing'}; return this.last; }
    if(f.parent&&f.parent!==this.mesh.parent){ this.mesh.removeFromParent(); f.parent.add(this.mesh); }
    this.gen=f.gen;
    const R=f.radius;
    const nz=this.getNose&&this.getNose();
    this._noseKey=nz?nz.gen+':'+nz.center[1].toFixed(3):'-';
    /* Lage: unter der Knolle, wenn es eine gibt (Mitte minus halbe Höhe), sonst 1,55 R unter der
       Augenlinie. `anchoredAt` sagt in der Oberfläche, welcher Fall gilt. */
    const eyeCx=(f.left.x+f.right.x)/2, eyeCy=(f.left.y+f.right.y)/2;
    const cx=(nz?nz.center[0]:eyeCx)+p.x*R;
    const cy=(nz? nz.center[1]-nz.size[1]/2 : eyeCy-1.55*R)-p.height*R+p.y*R;
    const span=Math.abs(f.right.x-f.left.x)+R*2;
    const width=span*(.5+.85*p.length), amp=R*.9;
    const controls=p.points.map(([x,y])=>new T.Vector3(x,y,0));
    const samples=new T.CatmullRomCurve3(controls,false,'centripetal').getPoints(128);
    for(const v of samples){
      const ax=Math.abs(v.x);
      if(p.sag) v.y-=p.sag*.42*ax*ax;                                   // Hängen: Mitte bleibt, Enden fallen
      const c=v.x<0?p.curlLeft:p.curlRight;
      if(c){ const u=Math.max(0,(ax-.55)/.45); v.y+=c*.55*u*u; }         // Locke: nur im äußeren Drittel
      const b=v.x<0?p.bendLeft:p.bendRight;
      if(b){ const u=v.x<0?(v.x+1):v.x, s=Math.sin(Math.PI*Math.max(0,Math.min(1,u))); v.y+=b*.4*s*s; }
    }
    const nibPoints=samples.map(v=>[(v.x+1)*256,128-v.y*90]);
    const hb=hbAt(p.thickness);
    const nib=inkHalfWidth(nibPoints,512,256,this.seed,{...INK_PRESETS.figure,hb,minHalf:0,edge:2.10*(.3+.7*p.taper),taper:.45*p.taper},1);
    const geoAt=q=>[cx+q.x*width/2, cy+q.y*amp];
    const skin=p.follow>0?this._probeSkin(f,samples,geoAt):null;
    const positions=[],uv=[],indices=[];
    for(let i=0;i<samples.length;i++){
      const t=i/(samples.length-1), q=samples[i];
      const prev=samples[Math.max(0,i-1)],next=samples[Math.min(samples.length-1,i+1)];
      const tangent=new T.Vector2((next.x-prev.x)*width/2,(next.y-prev.y)*amp).normalize();
      const envelope=1-p.taper+p.taper*Math.pow(Math.sin(Math.PI*t),.5);
      const half=nib(i)*width/512*envelope*(1+.18*p.taper*Math.sin(Math.PI*t));
      const [x,y]=geoAt(q);
      let zBase=T.MathUtils.lerp(f.left.z,f.right.z,t);
      if(skin){ const u=t*(skin.n-1),k=Math.min(skin.n-2,Math.floor(u)); zBase=T.MathUtils.lerp(zBase,T.MathUtils.lerp(skin[k],skin[k+1],u-k),p.follow); }
      const z=zBase+R*p.lift;
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
    this.frame={center:[cx,cy],radius:R,width,hb,gen:f.gen,anchoredAt:nz?'nose':'eye-line',
      probes:skin?skin.hits:0,probeN:skin?skin.n:0,
      zRange:skin?[Math.min(...skin.slice(0,skin.n)),Math.max(...skin.slice(0,skin.n))]:null};
    this.last={status:'OK'};
    return this.last;
  }
  setBaseColor(hex){ this.autoColor.set(hex).multiplyScalar(.28); if(!this.params.color) this.material.uniforms.ink.value.copy(this.autoColor); }
  export(){ return {schema:'kfb.moustache/0.1',seed:this.seed,...structuredClone(this.params)}; }
  dispose(){ this.mesh.removeFromParent(); this.mesh.geometry.dispose(); this.material.dispose(); }
}
