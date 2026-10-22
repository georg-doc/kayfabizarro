// V-619 · Himmel der endlosen Biom-Fahrt (world=endless) als Modul nach Host-Vertrag R1.2 §2: create(options) -> { object3d, update(dt, ctx), horizonColor(), dispose() }.
// GENERIERT von probe/port/gen_sky_drive.py aus probe/gelaende-probe.html – nicht von Hand ändern. Kuppel-Shader der Probe 1:1: Himmelsfunktion (R13),
// Sonnenscheibe, Knet-Riesenmond, Sterne, Polarlicht-Vorhang, gemalte Kuppelwolken (Ideen aus TinySkies, in der Probe selbst gebaut, V-092).
// Eingriffe des Generators (nur Stellschrauben, keine neue Malweise): Sterne stufenlos (uStars 0..1 statt Schalter), danach ein Wetter-Schritt
// (bedeckt → Wolkendecke im Wetterton, Nebel → Kuppel in Nebelfarbe, Blitz). Werte setzt das Atmosphären-Modul (Einstellungen des einen Licht-Rigs, V-385);
// die Kuppel schreibt kein Licht, Nebel und Hintergrund besitzt der Host.
import * as THREE from 'three'
import { NOISE_GLSL } from '../look/terrain3.js'

const SKY_GLSL = `
  uniform vec3 uZenith, uSkyMid, uSkyGround, uSunDir, uSunCol, uAntiTint, uAirTint; uniform float uHzGlow, uSunHalo, uSky2, uFogB, uFogHa, uFogHb, uEdgeR, uSGrad, uKul; uniform vec3 uEdgeSun, uEdgeAnti; uniform vec2 uAirOff;
  vec3 skyColor(vec3 d){
    float y=d.y;
    vec3 up=mix(uHorizon, uSkyMid, smoothstep(0.0,0.208,y)); up=mix(up, uZenith, smoothstep(0.208,0.82,y));
    vec3 dn=mix(uHorizon, uSkyGround, smoothstep(0.0,0.174,-y));            /* Bodendunst 0° … −10° statt Fläche (H5) */
    vec3 c=y>=0.0 ? up : dn;
    c+=uHzGlow*exp(-abs(y)*20.0)*uHorizon;                                    /* Horizont = hellste Linie (H2) */
    float sd=dot(d,uSunDir);
    c=mix(c, uSunCol, uSunHalo*pow(max(sd,0.0),8.0)*(1.0-smoothstep(0.0,0.6,y)));   /* Sonnenhof (H1) */
    c*=mix(vec3(1.0), uAntiTint, 0.5*max(-sd,0.0));                          /* Gegenseite kühler */
    /* Cartoon-Verlauf quer über den Himmel (Georg 21.10., Idee wie tinyskies/Looney Tunes): zur Sonne hin warm und hell, gegenüber tiefer und kühler.
       Weil Nebel = Himmel ist, folgt der Dunst automatisch mit. */
    float az=dot(normalize(d.xz+1e-5), normalize(uSunDir.xz+1e-5))*0.5+0.5, yl=max(y,0.0);
    float lowS=1.0-smoothstep(0.0,0.55,yl), lowA=1.0-smoothstep(0.0,0.85,yl);
    c=mix(c, mix(uHorizon,uSunCol,0.6)*1.05, uSGrad*0.6*az*az*lowS*lowS);
    c=mix(c, c*vec3(0.84,0.89,1.04), uSGrad*0.45*(1.0-az)*lowA);
    return c;
  }
`
export const SKY_DRIVE_SRC = { source: "probe/gelaende-probe.html", sha256: "8b51df304c152c86", fragChars: 7147 }

export const skyDriveLog = { create: 0, update: 0, dispose: 0 }

export function createDriveSky(options = {}) {
  skyDriveLog.create++
  const { radius = 900 } = options
  const C = (h) => new THREE.Color(h)
  const U = { uPix: { value: 0.001 }, uInvPV: { value: new THREE.Matrix4() }, uRes: { value: new THREE.Vector2(1, 1) }, uKul: { value: 0 }, uEdgeSun: { value: C('#ffffff') }, uEdgeAnti: { value: C('#ffffff') }, uSGrad: { value: 0.6 },
    uAurora: { value: 0 }, uCForm: { value: 4 }, uAirOff: { value: new THREE.Vector2() }, uZenith: { value: C('#6fa8dc') }, uSkyMid: { value: C('#9fc8e6') }, uSkyGround: { value: C('#c4dce6') }, uSunDir: { value: new THREE.Vector3(-0.55, 0.75, 0.35).normalize() },
    uSunCol: { value: C('#fff4e6') }, uAntiTint: { value: new THREE.Color(0.92, 0.95, 1.0) }, uAirTint: { value: C('#9fc8e6') }, uHzGlow: { value: 0.06 }, uSunHalo: { value: 0.35 }, uSky2: { value: 1 }, uFogB: { value: 0.003 }, uFogHa: { value: 0.004 }, uFogHb: { value: 0.06 },
    uEdgeR: { value: 300 }, uMoon: { value: 1 }, uMoonDir: { value: new THREE.Vector3(0.5, 0.1, -0.3).normalize() }, uHorizon: { value: C('#cfe8f2') }, uLit: { value: C('#ffffff') }, uShade: { value: C('#c4d3e6') }, uTime: { value: 0 }, uCover: { value: 0.45 },
    uPainted: { value: 1 }, uStars: { value: 0 }, uCamXZ: { value: new THREE.Vector2() },
    uOvercast: { value: 0 }, uWeatherCol: { value: C('#8d96a6') }, uFogSky: { value: 0 }, uFogCol: { value: C('#cfd6dc') }, uFlash: { value: 0 } }
  const mat = new THREE.ShaderMaterial({ uniforms: U, side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: 'varying vec3 vDir; void main(){ vDir=position; vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.0); gl_Position=p.xyww; }',
    fragmentShader: `${NOISE_GLSL}
    uniform vec3 uHorizon, uLit, uShade; uniform float uTime, uCover, uPainted, uStars, uMoon, uAurora, uCForm; uniform vec3 uMoonDir; uniform vec2 uCamXZ; varying vec3 vDir; uniform mat4 uInvPV; uniform vec2 uRes; uniform float uPix; uniform float uOvercast, uFogSky, uFlash; uniform vec3 uWeatherCol, uFogCol;
    ${SKY_GLSL}
    float fbm4(vec2 q){ float s=0.0, a=0.5; for(int i=0;i<4;i++){ s+=a*snoise(q); q=mat2(1.6,1.2,-1.2,1.6)*q+vec2(1.7,9.2); a*=0.5; } return s; }
    /* eine Wolkenebene im Kuppelstil: Rauschen hart geschnitten, Licht-/Schattenton (Seite zur Sonne hell), dunklere Kante */
    vec4 cloudLayer(vec3 d, float ph, float sc, vec2 wind, float par, float th, float sd, float edge, float orig){
      vec2 p=d.xz/(d.y+ph)*sc+wind+uCamXZ*par+vec2(sd*17.0,-sd*9.0);
      th+=0.07*(1.0-smoothstep(0.02,0.12,d.y));   /* zum Horizont dünner statt dichter (AD-Audit Befund 3) */
      float n=fbm4(p*1.4)+0.5; float fwA=clamp(2.1*sc*uPix/max((d.y+ph)*(d.y+ph),1e-3), 0.002, 0.04), fw=min(fwA,0.012);   /* Kantenbreite aus der Pixelgröße am Himmel statt fwidth (fwidth sprang an den Kuppel-Dreieckskanten → Haarlinien, QA P2) */ if(n<th-max(0.01,fwA)) return vec4(0.0);   /* Kantenbreite in Pixeln (vor dem Ausstieg gemessen): scharf auch bei großen nahen Wolken */
      float n2=fbm4(p*1.4+(orig>0.5 ? vec2(0.07,0.05) : normalize(uSunDir.xz+1e-4)*0.086))+0.5;   /* orig: Lichtversatz exakt wie die Kuppel vorher (Georg 21.10.: sah besser aus) */
      float m=orig>0.5 ? smoothstep(th,th+max(0.012,fwA),n) : smoothstep(th,th+max(fw,0.0015),n);   /* Kante nie schmaler als ein Bildpunkt: keine 2-px-Treppen am Horizont */
      vec3 cc=mix(uShade,uLit,smoothstep(n2+0.012-fwA,n2+0.012+fwA,n));   /* Licht/Schatten-Grenze geglättet statt step() */
      cc=mix(cc,uShade*0.82,(m-smoothstep(th+0.012,th+0.03,n))*0.85*edge);   /* nahe Ebenen: schwächere Kante, sonst bleiben kleine Fetzen als Umriss-Geister */
      return vec4(cc,m); }
    void main(){
      vec3 d=normalize(vDir); { vec4 q=uInvPV*vec4(gl_FragCoord.xy/uRes*2.0-1.0, 1.0, 1.0); d=normalize(q.xyz/q.w-cameraPosition); }   /* Blickrichtung je Bildpunkt aus der Kamera, nicht aus den Kuppel-Dreiecken: sonst Haarlinien an jeder Dreieckskante (QA P2) */ float h=max(d.y,0.0);
      vec3 col=d.y>0.0 ? mix(uHorizon, uZenith, pow(smoothstep(0.0,0.85,h),0.7)) : uHorizon;   // unter dem Horizont exakt die Nebelfarbe (vorher ×0,94 = sichtbarer Balken)
      if(uSky2>0.5){ col=skyColor(d); col=mix(col, uSunCol*1.15, smoothstep(0.9970,0.9978,dot(d,uSunDir))); }   /* Sonnenscheibe (H19) */
      // Surrealer Himmelskörper (R13 H21): Knet-Riesenmond (18°) bzw. Ringplanet, tief am Horizont gegenüber der Sonne, unten im Dunst
      if(uMoon>0.5){ vec3 tz=uMoonDir; vec3 tx=normalize(cross(vec3(0.0,1.0,0.0),tz)); vec3 ty=cross(tz,tx); float sr=0.156;
        vec2 q=vec2(dot(d,tx),dot(d,ty))/sr; float r2=dot(q,q); float fw=fwidth(r2)+1e-4; float front=step(0.0,dot(d,tz));
        vec3 mcol=mix(vec3(0.95,0.68,0.62), uSunCol, 0.22);   /* Knete: warmes Rosa-Terracotta, nicht blass */
        if(uMoon>1.5){ vec2 e=vec2(q.x*0.96+q.y*0.28, (q.y*0.96-q.x*0.28)/0.26); float er=length(e); float ringM=smoothstep(1.32,1.36,er)*(1.0-smoothstep(1.86,1.9,er))*front;
          float behind=step(0.0,e.y)*(1.0-smoothstep(1.0-fw,1.0+fw,r2)); vec3 rc=mix(vec3(0.45,0.70,0.82), uSunCol, 0.2)*(0.88+0.12*sin(er*40.0));
          col=mix(col, mix(rc, skyColor(d), 0.12), ringM*(1.0-behind)); }
        float disc=(1.0-smoothstep(1.0-fw,1.0+fw,r2))*front;
        if(disc>0.0){ vec3 n=normalize(tx*q.x+ty*q.y-tz*sqrt(max(0.0,1.0-r2)));
          float bump=snoise(q*3.1+7.0)*0.5+snoise(q*7.3-2.0)*0.25; vec3 nb=normalize(n+vec3(bump*0.22,bump*0.12,bump*0.18));
          float lm=max(dot(nb,uSunDir)*0.8+0.25,0.0); float ls=floor(lm*3.0)/3.0+smoothstep(0.0,0.15,fract(lm*3.0))/3.0;   /* drei Knet-Töne */
          vec3 mc=mcol*(0.55+0.55*ls); float haze=1.0-smoothstep(-0.55,0.35,q.y); mc=mix(mc, skyColor(d), 0.06+0.38*haze);
          col=mix(col, mc, disc); }
        if(uMoon>1.5){ vec2 e=vec2(q.x*0.96+q.y*0.28, (q.y*0.96-q.x*0.28)/0.26); float er=length(e); float ringF=smoothstep(1.32,1.36,er)*(1.0-smoothstep(1.86,1.9,er))*front*step(e.y,0.0);
          vec3 rc=mix(vec3(0.45,0.70,0.82), uSunCol, 0.2)*(0.88+0.12*sin(er*40.0)); col=mix(col, mix(rc, skyColor(d), 0.12), ringF); } }
      if(uStars>0.01 && d.y>0.0){ vec2 sp=d.xz/(d.y+1.0)*190.0; vec2 cell=floor(sp); float r=fract(sin(dot(cell,vec2(12.9898,78.233)))*43758.5453);
        if(r>0.986){ float tw=0.6+0.4*sin(uTime*2.3+r*60.0); col+=vec3(smoothstep(0.16,0.0,length(fract(sp)-0.5))*tw*smoothstep(0.0,0.25,h)*uStars); } }
      if(uAurora>0.01 && d.y>0.0){   /* Polarlicht als Vorhang: Unterkante wellt sich über den Himmel, senkrechte Falten, unten grün, oben violett; im Sektor gegenüber der Sonne */
        vec2 ad=normalize(-uSunDir.xz+1e-5), dz=normalize(d.xz+1e-5); float ang=atan(dot(dz,vec2(-ad.y,ad.x)), dot(dz,ad)); float el=asin(clamp(d.y,0.0,1.0));
        float sector=1.0-smoothstep(0.8,1.35,abs(ang)); vec3 acc=vec3(0.0);
        for(int k=0;k<2;k++){ float fk=float(k);
          float bot=0.16+fk*0.09+0.07*snoise(vec2(ang*1.6+fk*5.0, uTime*0.03))+0.025*snoise(vec2(ang*5.0-fk*3.0, uTime*0.06));
          float e=el-bot; float sheet=smoothstep(-0.006,0.012,e)*exp(-max(e,0.0)*(5.5+fk*2.0));
          float fold=0.45+0.55*pow(0.5+0.5*snoise(vec2(ang*(22.0+fk*9.0)+snoise(vec2(ang*3.0,uTime*0.04))*1.5, uTime*0.08+fk*7.0)),2.0);
          acc+=mix(vec3(0.32,1.0,0.6), vec3(0.75,0.42,1.0), smoothstep(0.02,0.22,e))*sheet*fold*(1.0-0.35*fk); }
        col+=acc*sector*smoothstep(0.02,0.08,d.y)*uAurora*0.55; }
      if(uPainted>0.5 && d.y>0.0){
        // gemalte Cartoon-Wolken in mehreren Ebenen (Georg 21.10.: Optik der Kuppelwolken, verschiedene Formationen, Tiefe über Parallaxe und Zug):
        // je Ebene eigene Projektionshöhe, Größe, Windzug und Parallaxe; hinten zuerst, vorne deckt
        float mz=1.0; if(uMoon>0.5){ float ang=acos(clamp(dot(d,uMoonDir),-1.0,1.0)); mz=mix(0.25,1.0,smoothstep(0.16,0.42,ang)); }   /* vor dem Himmelskörper weniger Wolken */
        float orig=step(3.5,uCForm), hf=smoothstep(0.0,0.1,d.y)*mix(1.0,mz,orig), mt=(1.0-mz)*0.4*(1.0-orig);   /* Kuppel wie vorher: am Himmelskörper ausblenden wie früher */                                              /* am Himmelskörper schrumpfen die Wolken (keine halbdurchsichtigen Geister) */
        float fS=uCForm>3.5?1.0:uCForm>2.5?0.6:uCForm>1.5?2.1:uCForm>0.5?0.75:1.0, fC=uCForm>3.5?0.0:uCForm>2.5?0.1:uCForm>1.5?0.02:uCForm>0.5?0.07:0.0, fP=uCForm>3.5?0.12:uCForm>2.5?0.04:0.12;
        vec4 L;
        L=cloudLayer(d, fP, 0.9*fS, vec2(uTime*0.006,uTime*0.002), 0.00022, 0.9-uCover*0.55-fC+mt, 0.0, 1.0, 1.0);           col=mix(col,L.rgb,L.a*hf);
        if(uCForm<2.5){   /* Zusatzebenen (Versuch) nur bei gemischt/Haufen/Schäfchen */
        L=cloudLayer(d, 0.2, 0.5*fS, vec2(uTime*0.014,uTime*0.004), 0.0007, 0.95-uCover*0.5-fC+mt, 3.0, 0.5, 0.0);           col=mix(col,L.rgb,L.a*hf);
        L=cloudLayer(d, 0.32, 0.27*fS, vec2(uTime*0.03,uTime*0.009), 0.0016, 1.0-uCover*0.45-fC+mt, 7.0, 0.25, 0.0);          col=mix(col,L.rgb,L.a*hf); }
      }
      { float up=max(d.y,0.0); col=mix(col, uWeatherCol*(0.92+0.16*up), uOvercast*(0.6+0.4*(1.0-smoothstep(0.0,0.45,up))));   /* V-619 bedeckt: Wolkendecke im Wetterton */
        col=mix(col, uFogCol, uFogSky*(1.0-0.55*smoothstep(0.0,0.6,up))); col+=uFlash*vec3(0.85,0.9,1.0); }   /* Nebel → Kuppel in Nebelfarbe, Blitz */
      gl_FragColor=vec4(col,1.0);
      #include <colorspace_fragment>
    }` })
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 24), mat); mesh.renderOrder = -1; mesh.frustumCulled = false
  mesh.onBeforeRender = (r, sc, cam) => { U.uInvPV.value.multiplyMatrices(cam.matrixWorld, cam.projectionMatrixInverse); r.getDrawingBufferSize(U.uRes.value); U.uPix.value = 2 * Math.tan(cam.fov * Math.PI / 360) / Math.max(1, U.uRes.value.y) }
  const group = new THREE.Group(); group.name = 'sky-drive'; group.add(mesh)
  return {
    object3d: group,
    uniforms: U,
    update(dt, ctx) { skyDriveLog.update++; U.uTime.value += dt * (options.timeScale?.() ?? 1)
      if (ctx?.camera) { group.position.copy(ctx.camera.position); U.uCamXZ.value.set(ctx.camera.position.x, ctx.camera.position.z) } },
    horizonColor: () => U.uHorizon.value.clone(),
    info: () => ({ module: 'sky-drive', radius, stars: +U.uStars.value.toFixed(2), moon: U.uMoon.value, aurora: +U.uAurora.value.toFixed(2), cover: +U.uCover.value.toFixed(2), overcast: +U.uOvercast.value.toFixed(2) }),
    dispose() { skyDriveLog.dispose++; mesh.geometry.dispose(); mat.dispose() },
  }
}
