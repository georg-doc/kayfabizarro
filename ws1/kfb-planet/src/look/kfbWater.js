// kfbWater · Flüsse, Bergseen, Wasserfälle und Gischt im Spiel · ERZEUGT von probe/port/gen_water_game.py aus probe/gelaende-probe.html (sha b8b23616bb6d).
// Nicht von Hand ändern: Shader-Körper (Band/See, Fall, Gischt), Kit-Fluid, rivSample und die Gischt-Bällchen kommen 1:1 aus der Gelände-Probe.
// Spiel statt Probe: hgt() liest die Höhentextur des Gelände-Netzes (gleiche Dreiecke wie PlaneGeometry a-b-d / b-c-d), Weltkoordinaten ohne
// schwebenden Ursprung (uCarW = 0), Probe-Schatten und Luftperspektive vorerst neutral, kein Meer (uWater tief).
// Shader: die drei Fragment-Shader der Probe wörtlich, nur ihre Einschübe ${…} sind durch Spiel-Bausteine ersetzt (Höhentextur statt hgt-Formel, Stubs für Schatten/Luft).
// createWater({ hyd, ground: { data, seg, ox, oz, cell }, seed }) → { object3d, update(dt), dispose(), info }   hyd = Ergebnis von kfb-hydro.v1 hydro()
import * as THREE from 'three'
import FLUID from '../data/looks/kfb-fluid.r1.json' with { type: 'json' }

export const WATER_SOURCE_SHA = 'b8b23616bb6d'
const F_RIBBON = `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
    i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
    vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
    m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
    vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.0*dot(m,g);
  }
uniform float uAmp; uniform vec2 uSeed;
float gNE;
uniform sampler2D uGround; uniform vec4 uGroundO;
float hgt(vec2 p){ vec2 f=(p-uGroundO.xy)/uGroundO.z, i=clamp(floor(f), vec2(0.0), vec2(uGroundO.w-1.0)), uv=f-i; ivec2 c=ivec2(i);   /* = surfaceAt des Gelände-Moduls (Spiel) */
  float ha=texelFetch(uGround,c,0).r, hb=texelFetch(uGround,c+ivec2(0,1),0).r, hc=texelFetch(uGround,c+ivec2(1,1),0).r, hd=texelFetch(uGround,c+ivec2(1,0),0).r;
  return uv.x+uv.y<=1.0 ? ha+(hd-ha)*uv.x+(hb-ha)*uv.y : hc+(hb-hc)*(1.0-uv.x)+(hd-hc)*(1.0-uv.y); }
uniform sampler2D uRiv; uniform vec4 uRivO;
#define RIV_N 512.0
  vec2 rivSample(vec2 p){ if(uRivO.w<0.5) return vec2(0.0); vec2 t=(p-uRivO.xy)/uRivO.z*RIV_N-0.5, c=floor(t+0.5); if(c.x<1.0||c.y<1.0||c.x>RIV_N-2.0||c.y>RIV_N-2.0) return vec2(0.0);
    if(texture2D(uRiv,(c+0.5)/RIV_N).z<1e-4) return vec2(0.0);   /* B = Maximum der 3×3-Nachbarn: außerhalb der Flüsse ein Zugriff */
    vec2 f=t-c, w0=0.5*(0.5-f)*(0.5-f), w1=0.75-f*f, w2=0.5*(0.5+f)*(0.5+f); vec2 v=vec2(0.0);   /* quadratischer B-Spline: Neigung stetig über die Texelgrenzen (bilinear knickte → gezackte Lichtkante bei tiefer Sonne) */
    for(int j=0;j<3;j++){ float wy=j==0?w0.y:(j==1?w1.y:w2.y); for(int i=0;i<3;i++){ float wx=i==0?w0.x:(i==1?w1.x:w2.x); v+=wx*wy*texture2D(uRiv,(c+vec2(float(i)-1.0,float(j)-1.0)+0.5)/RIV_N).xy; } }
    return v; }

  uniform vec3 uContact, uHorizon, uFlShal, uFlDeep, uFlGlow; uniform float uWater, uFlKind, uFlClar, uTimeR, uMoodK, uWKit; uniform vec2 uCarW; varying vec2 vFlow; varying vec2 vSN; varying float vLvl; varying vec3 vP;
  #include <packing>
  uniform sampler2D uShadowMap; uniform mat4 uShadowM; uniform float uShadowOn;
  float wShadow(vec3 p){ return 1.0; }   /* Spiel: Probe-Schattenkarte gibt es nicht (Schatten im Wasser folgt) */
uniform float uSky2; uniform vec3 uSunDir, uSunCol;
vec3 applyAir(vec3 c, vec3 p, float n){ return c; }   /* Spiel: Luftperspektive vorerst neutral */
vec3 skyColor(vec3 d){ return mix(vec3(0.78,0.88,0.94), vec3(0.45,0.66,0.86), clamp(d.y,0.0,1.0)); }   /* nur im alten Probe-Wasserzweig (uWKit = 0) */
uniform float uKFMoat, uKFHasMap, uKFV, uKFBand, uKFShoreFoam; uniform vec2 uKFWind, uKFZ; uniform vec3 uKFCol, uKFShallow; uniform sampler2D uKFDudv, uKFMap;
float kfHh(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float kfH3(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float kfNz3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  float a = mix(mix(kfH3(i), kfH3(i+vec3(1,0,0)), f.x), mix(kfH3(i+vec3(0,1,0)), kfH3(i+vec3(1,1,0)), f.x), f.y);
  float b = mix(mix(kfH3(i+vec3(0,0,1)), kfH3(i+vec3(1,0,1)), f.x), mix(kfH3(i+vec3(0,1,1)), kfH3(i+vec3(1,1,1)), f.x), f.y);
  return mix(a, b, f.z); }
float kfNz(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(kfHh(i), kfHh(i+vec2(1,0)), f.x), mix(kfHh(i+vec2(0,1)), kfHh(i+vec2(1,1)), f.x), f.y); }
vec4 kfPat(vec2 Q, vec2 duv, float boil, vec2 dir, float sf){
  float w1 = kfNz3(vec3(Q * 0.09 + duv * 4.0, boil)), w2 = kfNz3(vec3(Q * 0.31 + duv * 8.0, boil * 1.6 + 7.0));
  vec2 td = vec2(-dir.y, dir.x); float st = kfNz3(vec3(dot(Q, td) * 0.5 + duv.x * 2.0, dot(Q, dir) * 0.08, boil * 0.6 + 3.0));
  w1 = mix(w1, st, 0.55 * sf);
  float ml = dot(texture2D(uKFMap, Q * 0.035 + duv * 0.5).rgb, vec3(0.299, 0.587, 0.114));
  return vec4(w1, w2, ml, 0.0); }
vec4 kitFluid(vec3 vW, vec2 vFlow, float vShore, vec2 vSN){
  float u = 0.5;
  float fl = length(vFlow);
  float f = min(fl, 1.0); vec2 dir = fl > 0.001 ? vFlow / fl : vec2(1.0, 0.0); vec2 tdir = vec2(-dir.y, dir.x); vec2 wd = normalize(uKFWind);
  vec2 P = vW.xz;
  vec2 dA = texture2D(uKFDudv, P * 0.02 + vec2(uTimeR * 0.011, uTimeR * 0.007)).rg, dB = texture2D(uKFDudv, P * 0.027 - vec2(uTimeR * 0.008, -uTimeR * 0.012) + 0.41).rg;
  vec2 duv = (dA + dB - 1.0) * 0.3;
  vec2 QS = P - wd * 0.25 * uTimeR, QR = vSN - vec2(uKFV * uTimeR, 0.0);
  vec4 pS = kfPat(QS, duv, uTimeR * 0.18, dir, 0.0), pR = kfPat(QR, duv, uTimeR * 0.08, vec2(1.0, 0.0), 1.0);
  vec4 pp = mix(pS, pR, f); float wave = pp.x, wave2 = pp.y, ml = pp.z;
  float tex = mix(1.0, 0.55 + ml * 0.9, uKFHasMap);
  float sd = vShore, deep = smoothstep(0.0, 2.6, sd);
  vec3 base = mix(uKFShallow, uKFCol, deep);
  vec3 col = base * (0.55 + wave * 0.75) * tex + vec3(0.06, 0.07, 0.08) * wave2;
  float near = 1.0 - smoothstep(0.0, 1.8, sd);
  float sf = smoothstep(0.62 - uKFShoreFoam * near, 0.92, wave2) * near;
  col = mix(col, vec3(0.80, 0.90, 0.88), sf * 0.3);
  float shore = min(smoothstep(0.0, 0.22, u), smoothstep(1.0, 0.78, u));
  float foam = smoothstep(0.55, 0.95, wave2) * (1.0 - shore);
  col += vec3(0.7, 0.72, 0.7) * foam * 0.5;
  float a = mix(0.4, 0.74, smoothstep(0.0, 2.2, sd)) + foam * 0.28 + sf * 0.2;
  return vec4(col, a);
}
  uniform float uRivDbg;
  void kfbMain(){ bool below=cameraPosition.y<vLvl-0.05;
    if(uRivDbg>2.5){ gl_FragColor=vec4(length(vFlow)>0.001 ? vec3(0.1,0.9,0.2) : vec3(0.95,0.1,0.1), 1.0); return; }   /* Prüfansicht: grün Fluss, rot See */
    vec2 wp=vP.xz+uCarW; gNE=0.6; float hT=hgt(wp), dep=vLvl-hT, dw=fwidth(dep)+1e-3; if(uRivDbg>0.5 && uRivDbg<2.5){ gl_FragColor=vec4(clamp(0.5+dep*0.25,0.0,1.0), clamp(-dep*0.25+0.5,0.0,1.0), uRivDbg>1.5 ? rivSample(wp).y : 0.0, 1.0); return; }
    vec2 tq=(wp-uRivO.xy)/uRivO.z*RIV_N-0.5, cq=floor(tq+0.5); vec4 tx=texture2D(uRiv,(cq+0.5)/RIV_N);
    if(dep<-dw || (hT<uWater*uAmp+0.15 && tx.y<0.3)) discard;   /* außerhalb der Rinne zeichnet dort das Meer */
    if(dep>(length(vFlow)>0.001 ? 3.0 : 4.5)) discard;   /* tiefer als jedes Bett: Wasser hinge über einer Geländekante in der Luft (Georg 21.10.) */
    if(uRivDbg<-0.5 && tx.y>0.35 && tx.w<vLvl-0.15) discard;   /* hier ist ein tieferer Fluss zuständig: kein Wasserblatt darüber (Zusammenfluss, enge Nachbarläufe) */
    { vec2 gxs=dFdx(vP.xz), gys=dFdy(vP.xz); float exs=dFdx(vP.y), eys=dFdy(vP.y), dts=gxs.x*gys.y-gxs.y*gys.x; vec2 gs=abs(dts)>1e-9 ? vec2(exs*gys.y-gxs.y*eys, gxs.x*eys-exs*gys.x)/dts : vec2(0.0); if(length(gs)>0.45) discard; }   /* Fallstufe zeichnet das Fall-Netz */   /* wo das Meer liegt, zeichnet das Meer (keine Doppelfläche an der Mündung) */
    vec2 gx=dFdx(wp), gy=dFdy(wp); float ex=dFdx(dep), ey=dFdy(dep), det=gx.x*gy.y-gx.y*gy.x; vec2 gw=abs(det)>1e-9 ? vec2(ex*gy.y-gx.y*ey, gx.x*ey-ex*gy.x)/det : vec2(0.0);
    float sdr=max(dep,0.0)/max(length(gw),0.06), wob=0.5+0.5*snoise(wp*0.21+uSeed*0.3), sw=fwidth(sdr)+1e-3, e1=0.6+0.3*wob, e2=1.8+0.5*wob;
    float sd=mix(0.25, 1.6, smoothstep(e1-sw, e1+sw, sdr)); sd=mix(sd, 3.2, smoothstep(e2-sw, e2+sw, sdr));   /* gestufte Uferzonen wie im See (Flach · Kante · Tiefe) */
    vec4 kf=kitFluid(vec3(wp.x, vLvl, wp.y), vFlow, sd, vSN);
    if(below){ vec3 rdU=normalize(vP-cameraPosition); float win=smoothstep(0.55, 0.85, rdU.y); vec3 uc=mix(kf.rgb*0.55, mix(kf.rgb, vec3(0.80,0.90,0.88), 0.5), win); gl_FragColor=vec4(uc, mix(0.92, 0.6, win)); return; }   /* Haut von unten: dunkler Wasserton, steil nach oben das helle Fenster (Snell) */
    vec3 kc=kf.rgb; float wsv=wShadow(vP); kc=mix(mix(kc*0.62, uContact, 0.18), kc, wsv); if(uSky2>0.5) kc=applyAir(kc, vP, 1.0);
    float ka=max(kf.a, mix(0.8, 0.94, smoothstep(e1-sw, e1+sw, sdr))); gl_FragColor=vec4(kc, ka*smoothstep(-dw,dw,dep)); }
void main(){ kfbMain(); gl_FragColor.rgb = sRGBTransferEOTF(gl_FragColor).rgb;
#include <colorspace_fragment>
}`
const F_FALL = `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
    i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
    vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
    m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
    vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.0*dot(m,g);
  }
  uniform float uTimeR; uniform vec2 uCarW; varying vec4 vF; varying vec3 vP; uniform vec3 uContact, uHorizon, uFlShal, uFlDeep, uFlGlow; uniform float uWater, uFlKind, uFlClar, uMoodK, uWKit;
uniform float uSky2; uniform vec3 uSunDir, uSunCol;
vec3 applyAir(vec3 c, vec3 p, float n){ return c; }   /* Spiel: Luftperspektive vorerst neutral */
vec3 skyColor(vec3 d){ return mix(vec3(0.78,0.88,0.94), vec3(0.45,0.66,0.86), clamp(d.y,0.0,1.0)); }   /* nur im alten Probe-Wasserzweig (uWKit = 0) */
uniform float uKFMoat, uKFHasMap, uKFV, uKFBand, uKFShoreFoam; uniform vec2 uKFWind, uKFZ; uniform vec3 uKFCol, uKFShallow; uniform sampler2D uKFDudv, uKFMap;
float kfHh(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float kfH3(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float kfNz3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  float a = mix(mix(kfH3(i), kfH3(i+vec3(1,0,0)), f.x), mix(kfH3(i+vec3(0,1,0)), kfH3(i+vec3(1,1,0)), f.x), f.y);
  float b = mix(mix(kfH3(i+vec3(0,0,1)), kfH3(i+vec3(1,0,1)), f.x), mix(kfH3(i+vec3(0,1,1)), kfH3(i+vec3(1,1,1)), f.x), f.y);
  return mix(a, b, f.z); }
float kfNz(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(kfHh(i), kfHh(i+vec2(1,0)), f.x), mix(kfHh(i+vec2(0,1)), kfHh(i+vec2(1,1)), f.x), f.y); }
vec4 kfPat(vec2 Q, vec2 duv, float boil, vec2 dir, float sf){
  float w1 = kfNz3(vec3(Q * 0.09 + duv * 4.0, boil)), w2 = kfNz3(vec3(Q * 0.31 + duv * 8.0, boil * 1.6 + 7.0));
  vec2 td = vec2(-dir.y, dir.x); float st = kfNz3(vec3(dot(Q, td) * 0.5 + duv.x * 2.0, dot(Q, dir) * 0.08, boil * 0.6 + 3.0));
  w1 = mix(w1, st, 0.55 * sf);
  float ml = dot(texture2D(uKFMap, Q * 0.035 + duv * 0.5).rgb, vec3(0.299, 0.587, 0.114));
  return vec4(w1, w2, ml, 0.0); }
vec4 kitFluid(vec3 vW, vec2 vFlow, float vShore, vec2 vSN){
  float u = 0.5;
  float fl = length(vFlow);
  float f = min(fl, 1.0); vec2 dir = fl > 0.001 ? vFlow / fl : vec2(1.0, 0.0); vec2 tdir = vec2(-dir.y, dir.x); vec2 wd = normalize(uKFWind);
  vec2 P = vW.xz;
  vec2 dA = texture2D(uKFDudv, P * 0.02 + vec2(uTimeR * 0.011, uTimeR * 0.007)).rg, dB = texture2D(uKFDudv, P * 0.027 - vec2(uTimeR * 0.008, -uTimeR * 0.012) + 0.41).rg;
  vec2 duv = (dA + dB - 1.0) * 0.3;
  vec2 QS = P - wd * 0.25 * uTimeR, QR = vSN - vec2(uKFV * uTimeR, 0.0);
  vec4 pS = kfPat(QS, duv, uTimeR * 0.18, dir, 0.0), pR = kfPat(QR, duv, uTimeR * 0.08, vec2(1.0, 0.0), 1.0);
  vec4 pp = mix(pS, pR, f); float wave = pp.x, wave2 = pp.y, ml = pp.z;
  float tex = mix(1.0, 0.55 + ml * 0.9, uKFHasMap);
  float sd = vShore, deep = smoothstep(0.0, 2.6, sd);
  vec3 base = mix(uKFShallow, uKFCol, deep);
  vec3 col = base * (0.55 + wave * 0.75) * tex + vec3(0.06, 0.07, 0.08) * wave2;
  float near = 1.0 - smoothstep(0.0, 1.8, sd);
  float sf = smoothstep(0.62 - uKFShoreFoam * near, 0.92, wave2) * near;
  col = mix(col, vec3(0.80, 0.90, 0.88), sf * 0.3);
  float shore = min(smoothstep(0.0, 0.22, u), smoothstep(1.0, 0.78, u));
  float foam = smoothstep(0.55, 0.95, wave2) * (1.0 - shore);
  col += vec3(0.7, 0.72, 0.7) * foam * 0.5;
  float a = mix(0.4, 0.74, smoothstep(0.0, 2.2, sd)) + foam * 0.28 + sf * 0.2;
  return vec4(col, a);
}
  void kfbMain(){ float t=vF.x, v=vF.y, H=vF.z, W=vF.w; vec2 q=vec2(v*W, t*(H+0.35));   /* abgerollte Fallfläche: Meter quer · Meter Fallweg */
    /* derselbe Kit-Shader wie Fluss und See (Georg: Wasserfall muss zum Wasser passen): Fließrichtung = Fallweg, Fließkoordinate schneller (×0,45 → ≈ 3 m/s), Tiefe oben → heller unten (Luft im Wasser) */
    vec2 sd0=vP.xz*0.37; vec4 kf=kitFluid(vec3(q.x+sd0.x, 0.0, q.y+sd0.y), vec2(1.0, 0.0), mix(3.2, 0.9, t), vec2(q.y*0.45+sd0.y, q.x));
    vec3 c=kf.rgb, fc=vec3(0.80, 0.90, 0.88);                                                       /* Kit-Schaumton */
    float s1=kfNz3(vec3(q.x*1.6, (q.y-uTimeR*3.2)*0.45, uTimeR*0.25)), s2=kfNz3(vec3(q.x*3.4+5.0, (q.y-uTimeR*5.6)*0.9, 9.0+uTimeR*0.4));
    c=mix(c, fc, step(0.7, s2)*0.35*smoothstep(0.1, 0.6, t));                                       /* wenig Gischtstreifen im unteren Teil, im Kit-Ton */
    c=mix(c, fc, (1.0-step(0.07+0.04*s2, t))*0.55);                                                 /* Lichtsaum an der Lippe, nicht reinweiß */
    float edge=abs(v)+0.3*(kfNz3(vec3(v*2.0, q.y*0.7-uTimeR*2.0, 4.0))-0.5)+0.12*t; if(edge>0.95) discard;
    float cut=smoothstep(0.55, 1.0, t); if(s1*0.65+s2*0.35 < cut*0.72) discard;                  /* unten zerreißt der Fall in Fetzen (Alpha-Schnitt) */
    if(uSky2>0.5) c=applyAir(c, vP, 1.0);
    gl_FragColor=vec4(c, max(kf.a, 0.86)); }
void main(){ kfbMain(); gl_FragColor.rgb = sRGBTransferEOTF(gl_FragColor).rgb;
#include <colorspace_fragment>
}`
const F_FOAM = `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
    i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
    vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
    m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
    vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.0*dot(m,g);
  }
uniform float uAmp; uniform vec2 uSeed;
float gNE;
uniform sampler2D uGround; uniform vec4 uGroundO;
float hgt(vec2 p){ vec2 f=(p-uGroundO.xy)/uGroundO.z, i=clamp(floor(f), vec2(0.0), vec2(uGroundO.w-1.0)), uv=f-i; ivec2 c=ivec2(i);   /* = surfaceAt des Gelände-Moduls (Spiel) */
  float ha=texelFetch(uGround,c,0).r, hb=texelFetch(uGround,c+ivec2(0,1),0).r, hc=texelFetch(uGround,c+ivec2(1,1),0).r, hd=texelFetch(uGround,c+ivec2(1,0),0).r;
  return uv.x+uv.y<=1.0 ? ha+(hd-ha)*uv.x+(hb-ha)*uv.y : hc+(hb-hc)*(1.0-uv.x)+(hd-hc)*(1.0-uv.y); }
uniform sampler2D uRiv; uniform vec4 uRivO;
#define RIV_N 512.0
  vec2 rivSample(vec2 p){ if(uRivO.w<0.5) return vec2(0.0); vec2 t=(p-uRivO.xy)/uRivO.z*RIV_N-0.5, c=floor(t+0.5); if(c.x<1.0||c.y<1.0||c.x>RIV_N-2.0||c.y>RIV_N-2.0) return vec2(0.0);
    if(texture2D(uRiv,(c+0.5)/RIV_N).z<1e-4) return vec2(0.0);   /* B = Maximum der 3×3-Nachbarn: außerhalb der Flüsse ein Zugriff */
    vec2 f=t-c, w0=0.5*(0.5-f)*(0.5-f), w1=0.75-f*f, w2=0.5*(0.5+f)*(0.5+f); vec2 v=vec2(0.0);   /* quadratischer B-Spline: Neigung stetig über die Texelgrenzen (bilinear knickte → gezackte Lichtkante bei tiefer Sonne) */
    for(int j=0;j<3;j++){ float wy=j==0?w0.y:(j==1?w1.y:w2.y); for(int i=0;i<3;i++){ float wx=i==0?w0.x:(i==1?w1.x:w2.x); v+=wx*wy*texture2D(uRiv,(c+vec2(float(i)-1.0,float(j)-1.0)+0.5)/RIV_N).xy; } }
    return v; }

  uniform float uTimeR; uniform vec2 uCarW; varying vec4 vC; varying vec3 vP; uniform vec3 uContact, uHorizon, uFlShal, uFlDeep, uFlGlow; uniform float uWater, uFlKind, uFlClar, uMoodK, uWKit;
uniform float uSky2; uniform vec3 uSunDir, uSunCol;
vec3 applyAir(vec3 c, vec3 p, float n){ return c; }   /* Spiel: Luftperspektive vorerst neutral */
vec3 skyColor(vec3 d){ return mix(vec3(0.78,0.88,0.94), vec3(0.45,0.66,0.86), clamp(d.y,0.0,1.0)); }   /* nur im alten Probe-Wasserzweig (uWKit = 0) */
uniform float uKFMoat, uKFHasMap, uKFV, uKFBand, uKFShoreFoam; uniform vec2 uKFWind, uKFZ; uniform vec3 uKFCol, uKFShallow; uniform sampler2D uKFDudv, uKFMap;
float kfHh(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float kfH3(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float kfNz3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  float a = mix(mix(kfH3(i), kfH3(i+vec3(1,0,0)), f.x), mix(kfH3(i+vec3(0,1,0)), kfH3(i+vec3(1,1,0)), f.x), f.y);
  float b = mix(mix(kfH3(i+vec3(0,0,1)), kfH3(i+vec3(1,0,1)), f.x), mix(kfH3(i+vec3(0,1,1)), kfH3(i+vec3(1,1,1)), f.x), f.y);
  return mix(a, b, f.z); }
float kfNz(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(kfHh(i), kfHh(i+vec2(1,0)), f.x), mix(kfHh(i+vec2(0,1)), kfHh(i+vec2(1,1)), f.x), f.y); }
vec4 kfPat(vec2 Q, vec2 duv, float boil, vec2 dir, float sf){
  float w1 = kfNz3(vec3(Q * 0.09 + duv * 4.0, boil)), w2 = kfNz3(vec3(Q * 0.31 + duv * 8.0, boil * 1.6 + 7.0));
  vec2 td = vec2(-dir.y, dir.x); float st = kfNz3(vec3(dot(Q, td) * 0.5 + duv.x * 2.0, dot(Q, dir) * 0.08, boil * 0.6 + 3.0));
  w1 = mix(w1, st, 0.55 * sf);
  float ml = dot(texture2D(uKFMap, Q * 0.035 + duv * 0.5).rgb, vec3(0.299, 0.587, 0.114));
  return vec4(w1, w2, ml, 0.0); }
vec4 kitFluid(vec3 vW, vec2 vFlow, float vShore, vec2 vSN){
  float u = 0.5;
  float fl = length(vFlow);
  float f = min(fl, 1.0); vec2 dir = fl > 0.001 ? vFlow / fl : vec2(1.0, 0.0); vec2 tdir = vec2(-dir.y, dir.x); vec2 wd = normalize(uKFWind);
  vec2 P = vW.xz;
  vec2 dA = texture2D(uKFDudv, P * 0.02 + vec2(uTimeR * 0.011, uTimeR * 0.007)).rg, dB = texture2D(uKFDudv, P * 0.027 - vec2(uTimeR * 0.008, -uTimeR * 0.012) + 0.41).rg;
  vec2 duv = (dA + dB - 1.0) * 0.3;
  vec2 QS = P - wd * 0.25 * uTimeR, QR = vSN - vec2(uKFV * uTimeR, 0.0);
  vec4 pS = kfPat(QS, duv, uTimeR * 0.18, dir, 0.0), pR = kfPat(QR, duv, uTimeR * 0.08, vec2(1.0, 0.0), 1.0);
  vec4 pp = mix(pS, pR, f); float wave = pp.x, wave2 = pp.y, ml = pp.z;
  float tex = mix(1.0, 0.55 + ml * 0.9, uKFHasMap);
  float sd = vShore, deep = smoothstep(0.0, 2.6, sd);
  vec3 base = mix(uKFShallow, uKFCol, deep);
  vec3 col = base * (0.55 + wave * 0.75) * tex + vec3(0.06, 0.07, 0.08) * wave2;
  float near = 1.0 - smoothstep(0.0, 1.8, sd);
  float sf = smoothstep(0.62 - uKFShoreFoam * near, 0.92, wave2) * near;
  col = mix(col, vec3(0.80, 0.90, 0.88), sf * 0.3);
  float shore = min(smoothstep(0.0, 0.22, u), smoothstep(1.0, 0.78, u));
  float foam = smoothstep(0.55, 0.95, wave2) * (1.0 - shore);
  col += vec3(0.7, 0.72, 0.7) * foam * 0.5;
  float a = mix(0.4, 0.74, smoothstep(0.0, 2.2, sd)) + foam * 0.28 + sf * 0.2;
  return vec4(col, a);
}
  void kfbMain(){ vec2 wp=vP.xz+uCarW, l=(wp-vC.xy)/vC.z; float r=length(l); if(r>1.0) discard; gNE=0.6; if(hgt(wp)>vC.w+0.02) discard;
    float blob=step(0.66-0.18*(1.0-r), kfNz3(vec3(l*4.2+vec2(0.0, -uTimeR*0.35), uTimeR*0.9)));   /* aufgewühlte Flecken, treiben vom Fall weg; keine Ringe */
    float a=blob*(1.0-smoothstep(0.3,1.0,r)); if(a<0.5) discard;
    vec3 c=vec3(0.80, 0.90, 0.88); if(uSky2>0.5) c=applyAir(c, vP, 1.0); gl_FragColor=vec4(c, 0.8); }   /* Kit-Schaumton wie am Ufer */
void main(){ kfbMain(); gl_FragColor.rgb = sRGBTransferEOTF(gl_FragColor).rgb;
#include <colorspace_fragment>
}`
const F_SEA = `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
    i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
    vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
    m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
    vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.0*dot(m,g);
  }
uniform float uAmp; uniform vec2 uSeed;
float gNE;
uniform sampler2D uGround; uniform vec4 uGroundO;
float hgt(vec2 p){ vec2 f=(p-uGroundO.xy)/uGroundO.z, i=clamp(floor(f), vec2(0.0), vec2(uGroundO.w-1.0)), uv=f-i; ivec2 c=ivec2(i);   /* = surfaceAt des Gelände-Moduls (Spiel) */
  float ha=texelFetch(uGround,c,0).r, hb=texelFetch(uGround,c+ivec2(0,1),0).r, hc=texelFetch(uGround,c+ivec2(1,1),0).r, hd=texelFetch(uGround,c+ivec2(1,0),0).r;
  return uv.x+uv.y<=1.0 ? ha+(hd-ha)*uv.x+(hb-ha)*uv.y : hc+(hb-hc)*(1.0-uv.x)+(hd-hc)*(1.0-uv.y); }
uniform sampler2D uRiv; uniform vec4 uRivO;
#define RIV_N 512.0
  vec2 rivSample(vec2 p){ if(uRivO.w<0.5) return vec2(0.0); vec2 t=(p-uRivO.xy)/uRivO.z*RIV_N-0.5, c=floor(t+0.5); if(c.x<1.0||c.y<1.0||c.x>RIV_N-2.0||c.y>RIV_N-2.0) return vec2(0.0);
    if(texture2D(uRiv,(c+0.5)/RIV_N).z<1e-4) return vec2(0.0);   /* B = Maximum der 3×3-Nachbarn: außerhalb der Flüsse ein Zugriff */
    vec2 f=t-c, w0=0.5*(0.5-f)*(0.5-f), w1=0.75-f*f, w2=0.5*(0.5+f)*(0.5+f); vec2 v=vec2(0.0);   /* quadratischer B-Spline: Neigung stetig über die Texelgrenzen (bilinear knickte → gezackte Lichtkante bei tiefer Sonne) */
    for(int j=0;j<3;j++){ float wy=j==0?w0.y:(j==1?w1.y:w2.y); for(int i=0;i<3;i++){ float wx=i==0?w0.x:(i==1?w1.x:w2.x); v+=wx*wy*texture2D(uRiv,(c+vec2(float(i)-1.0,float(j)-1.0)+0.5)/RIV_N).xy; } }
    return v; }

      uniform vec3 uHorizon, uFlShal, uFlDeep, uFlGlow; uniform float uWater, uFlKind, uFlClar, uTimeR, uMoodK, uWKit; uniform vec2 uCarW; varying vec3 vP; varying float vDep;
      #include <packing>
      uniform sampler2D uShadowMap; uniform mat4 uShadowM; uniform float uShadowOn; uniform vec3 uContact;
      float wShadow(vec3 p){ if(uShadowOn<0.5) return 1.0; vec4 c=uShadowM*vec4(p+vec3(0.0,0.08,0.0),1.0); vec3 sc=c.xyz/c.w; if(sc.x<=0.0||sc.x>=1.0||sc.y<=0.0||sc.y>=1.0||sc.z>=1.0) return 1.0;
        float v=0.0; for(int i=0;i<8;i++){ float fi=float(i), an=fi*2.3999632, r=sqrt((fi+0.5)/8.0)*1.4/2048.0; v+=step(sc.z-0.00015, unpackRGBAToDepth(texture2D(uShadowMap, sc.xy+vec2(cos(an),sin(an))*r))); } return v/8.0; }   /* Sonnenschatten auf der Wasserfläche (Georg 20.10.: „Wasser nimmt kaum Schatten“), schmale Kante wie am Boden */
uniform float uSky2; uniform vec3 uSunDir, uSunCol;
vec3 applyAir(vec3 c, vec3 p, float n){ return c; }   /* Spiel: Luftperspektive vorerst neutral */
vec3 skyColor(vec3 d){ return mix(vec3(0.78,0.88,0.94), vec3(0.45,0.66,0.86), clamp(d.y,0.0,1.0)); }   /* nur im alten Probe-Wasserzweig (uWKit = 0) */
uniform float uKFMoat, uKFHasMap, uKFV, uKFBand, uKFShoreFoam; uniform vec2 uKFWind, uKFZ; uniform vec3 uKFCol, uKFShallow; uniform sampler2D uKFDudv, uKFMap;
float kfHh(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float kfH3(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float kfNz3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  float a = mix(mix(kfH3(i), kfH3(i+vec3(1,0,0)), f.x), mix(kfH3(i+vec3(0,1,0)), kfH3(i+vec3(1,1,0)), f.x), f.y);
  float b = mix(mix(kfH3(i+vec3(0,0,1)), kfH3(i+vec3(1,0,1)), f.x), mix(kfH3(i+vec3(0,1,1)), kfH3(i+vec3(1,1,1)), f.x), f.y);
  return mix(a, b, f.z); }
float kfNz(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(kfHh(i), kfHh(i+vec2(1,0)), f.x), mix(kfHh(i+vec2(0,1)), kfHh(i+vec2(1,1)), f.x), f.y); }
vec4 kfPat(vec2 Q, vec2 duv, float boil, vec2 dir, float sf){
  float w1 = kfNz3(vec3(Q * 0.09 + duv * 4.0, boil)), w2 = kfNz3(vec3(Q * 0.31 + duv * 8.0, boil * 1.6 + 7.0));
  vec2 td = vec2(-dir.y, dir.x); float st = kfNz3(vec3(dot(Q, td) * 0.5 + duv.x * 2.0, dot(Q, dir) * 0.08, boil * 0.6 + 3.0));
  w1 = mix(w1, st, 0.55 * sf);
  float ml = dot(texture2D(uKFMap, Q * 0.035 + duv * 0.5).rgb, vec3(0.299, 0.587, 0.114));
  return vec4(w1, w2, ml, 0.0); }
vec4 kitFluid(vec3 vW, vec2 vFlow, float vShore, vec2 vSN){
  float u = 0.5;
  float fl = length(vFlow);
  float f = min(fl, 1.0); vec2 dir = fl > 0.001 ? vFlow / fl : vec2(1.0, 0.0); vec2 tdir = vec2(-dir.y, dir.x); vec2 wd = normalize(uKFWind);
  vec2 P = vW.xz;
  vec2 dA = texture2D(uKFDudv, P * 0.02 + vec2(uTimeR * 0.011, uTimeR * 0.007)).rg, dB = texture2D(uKFDudv, P * 0.027 - vec2(uTimeR * 0.008, -uTimeR * 0.012) + 0.41).rg;
  vec2 duv = (dA + dB - 1.0) * 0.3;
  vec2 QS = P - wd * 0.25 * uTimeR, QR = vSN - vec2(uKFV * uTimeR, 0.0);
  vec4 pS = kfPat(QS, duv, uTimeR * 0.18, dir, 0.0), pR = kfPat(QR, duv, uTimeR * 0.08, vec2(1.0, 0.0), 1.0);
  vec4 pp = mix(pS, pR, f); float wave = pp.x, wave2 = pp.y, ml = pp.z;
  float tex = mix(1.0, 0.55 + ml * 0.9, uKFHasMap);
  float sd = vShore, deep = smoothstep(0.0, 2.6, sd);
  vec3 base = mix(uKFShallow, uKFCol, deep);
  vec3 col = base * (0.55 + wave * 0.75) * tex + vec3(0.06, 0.07, 0.08) * wave2;
  float near = 1.0 - smoothstep(0.0, 1.8, sd);
  float sf = smoothstep(0.62 - uKFShoreFoam * near, 0.92, wave2) * near;
  col = mix(col, vec3(0.80, 0.90, 0.88), sf * 0.3);
  float shore = min(smoothstep(0.0, 0.22, u), smoothstep(1.0, 0.78, u));
  float foam = smoothstep(0.55, 0.95, wave2) * (1.0 - shore);
  col += vec3(0.7, 0.72, 0.7) * foam * 0.5;
  float a = mix(0.4, 0.74, smoothstep(0.0, 2.2, sd)) + foam * 0.28 + sf * 0.2;
  return vec4(col, a);
}
      float hh(vec2 c){ return fract(sin(dot(c, vec2(127.1, 311.7)))*43758.5453); }
      void kfbMain(){
        vec2 wp=vP.xz+uCarW; float wl=uWater*uAmp+0.15;
        float dep=vDep, dcam=distance(vP, cameraPosition); if(dep<1.6 || dcam<300.0){ gNE=dcam<140.0 ? 0.6 : 8.0; dep=wl-hgt(wp); }   /* nah immer je Pixel: die Übersichts-Wasserhaut hat 75 m Vertex-Abstand, ihre Vertex-Tiefe legte sonst Meer über tiefer gelegtes Land */   /* fern gröber statt gar nicht: nur Vertex-Tiefe schnitt in der Übersicht (Wasser-Gitter 75 m) ganze Polygone aus dem Meer (Fehler aus D4) */                                              /* am Ufer je Pixel: Schaumlinie sitzt genau */
        float dw=fwidth(dep)+1e-3;
        if(rivSample(wp).y>0.3){ vec2 tq=(wp-uRivO.xy)/uRivO.z*RIV_N-0.5; float rl=texture2D(uRiv,(floor(tq+0.5)+0.5)/RIV_N).w; gNE=0.6; float rh=hgt(wp); if(rl>wl+0.02 && rl-rh<=3.0 && rh<rl) discard; }   /* Rinne gehört dem Fluss – aber nur, wo sein Band auch zeichnet (sonst Loch an der Mündung) */
        /* Island Kit (Fluid F2, Georg 21.10.: „1:1 einbauen“): Kit-Shader unverändert, die Probe liefert seine vier Eingänge –
           Weltort, Fließrichtung (Stillwasser: 0), Meter zum Ufer (Tiefe ÷ Geländeneigung, Neigung aus den Bildschirm-Ableitungen), Fließkoordinaten */
        vec2 gx=dFdx(wp), gy=dFdy(wp); float ex=dFdx(dep), ey=dFdy(dep), det=gx.x*gy.y-gx.y*gy.x;
        vec2 gw=abs(det)>1e-9 ? vec2(ex*gy.y-gx.y*ey, gx.x*ey-ex*gy.x)/det : vec2(0.0);
        if(dep<-dw) discard;
        if(uWKit>0.5){ float sdr=max(dep,0.0)/max(length(gw),0.06), wob=0.5+0.5*snoise(wp*0.21+uSeed*0.3), sw=fwidth(sdr)+1e-3, e1=0.9+0.45*wob, e2=2.6+0.6*wob;
          /* Design-Kontext: der Kit rechnet Farbe, Schaum und Deckkraft stetig aus dem Uferabstand; gestuft eingespeist ergibt das drei klare Töne
             (Flachwasser · Kante · Tiefe) mit gemalter, welliger Grenze – dieselbe Kantenlogik wie die Fließfarben-Bänder, Kit-Shader unverändert */
          float sd=mix(0.25, 1.6, smoothstep(e1-sw, e1+sw, sdr)); sd=mix(sd, 3.2, smoothstep(e2-sw, e2+sw, sdr));
          vec4 kf=kitFluid(vec3(wp.x, wl, wp.y), vec2(0.0), sd, wp);
          vec3 kc=kf.rgb; float wsv=wShadow(vP); kc=mix(mix(kc*0.62, uContact, 0.18), kc, wsv);   /* Schatten im Wasserton, nie schwarz */
          if(uSky2>0.5) kc=applyAir(kc, vP, 1.0);
          float ka=max(kf.a, mix(0.8, 0.94, smoothstep(e1-sw, e1+sw, sdr)));   /* deckender als im Kit: über unserem bunten Gelände machte die Kit-Durchsicht (0,40–0,74) die Küste matschig */
          gl_FragColor=vec4(kc, ka*smoothstep(-dw,dw,dep)); return; }
        float gum=step(0.5,uFlKind)*step(uFlKind,1.5), acid=step(1.5,uFlKind);
        vec3 rd=normalize(vP-cameraPosition);
        float drift=mix(1.0, mix(0.3,0.6,acid), max(gum,acid)), str=mix(0.15, mix(0.04,0.08,acid), max(gum,acid))*smoothstep(0.0,0.8,dep)*(1.0-smoothstep(60.0,260.0,length(vP-cameraPosition)));   /* fern ruhig: kein Flimmern */
        vec2 r1=wp/18.0+vec2(uTimeR*0.035,uTimeR*0.02)*drift, r2=wp/7.0-vec2(uTimeR*0.05,-uTimeR*0.03)*drift;
        vec3 n=normalize(vec3(snoise(r1)*0.6+snoise(r2)*0.4, 1.0/max(str,1e-3)*0.15, snoise(r1+7.3)*0.6+snoise(r2-3.1)*0.4));
        float F0=mix(0.08, mix(0.04,0.05,acid), max(gum,acid)), F=F0+(1.0-F0)*pow(1.0-max(dot(-rd,n),0.0),4.0);
        vec3 rf=reflect(rd,n); vec3 sky=skyColor(vec3(rf.x,abs(rf.y),rf.z))*mix(0.7, mix(0.35,0.4,acid), max(gum,acid));
        float k=1.0-exp(-max(dep,0.0)/max(abs(rd.y),0.15)/uFlClar);
        vec3 body=mix(uFlShal, uFlDeep, k);
        float Fs=F*3.0, Fw=fwidth(Fs)+0.02, Fq=(floor(Fs)+smoothstep(0.5-Fw,0.5+Fw,fract(Fs)))/3.0;              /* Spiegelung in harten Stufen (Cartoon) */
        vec3 col=mix(body, sky, Fq*0.85);
        float sp=pow(max(dot(rf,uSunDir),0.0), mix(220.0, mix(450.0,120.0,acid), max(gum,acid))); col+=step(0.55,sp)*mix(vec3(1.0),uSunCol,0.3)*(1.0-acid*0.7);   /* gestochenes Glanzlicht */
        /* Ufer: Schaumlinie + 2–3 Ringe, die zum Land wandern (Wasser) · Wulst mit Glanzlinie (Kaugummi) · flackernde Zisch-Linie (Säure) */
        float msk=smoothstep(-0.2,0.35,snoise(wp*0.35+uTimeR*0.05));
        float line=1.0-smoothstep(0.05-dw,0.05+dw,dep);
        float ring=step(0.72, sin(6.2832*(dep/0.22-uTimeR/3.5)))*(1.0-smoothstep(0.0,0.6,dep))*msk;
        vec3 foamC=acid>0.5 ? vec3(0.9,1.0,0.48)*(0.8+0.3*sin(uTimeR*23.0+wp.x*3.0)) : gum>0.5 ? mix(uFlShal,vec3(1.0),0.6) : vec3(1.0);
        col=mix(col, foamC, max(line, ring*(1.0-gum))*0.92);
        if(gum>0.5){ float bulge=1.0-smoothstep(0.0,0.35,dep); col=mix(col, uFlShal*1.15, bulge*0.6); col=mix(col, vec3(1.0), (1.0-smoothstep(0.12-dw,0.12+dw,abs(dep-0.22)))*0.7); }
        /* Blasen (Kaugummi groß und langsam, Säure klein und schnell): je Zelle eine Blase mit Phase; wachsen als Kuppel, zittern, platzen als Ring */
        float bubA=0.0;
        if(uFlKind>0.5 && dep>0.25){ float cs=mix(4.0,1.5,acid), life=mix(4.0,1.2,acid); vec2 cell=floor(wp/cs); float hsh=hh(cell);
          vec2 ctr=(cell+0.25+0.5*vec2(hsh, hh(cell+3.1)))*cs; float ph=fract(uTimeR/life+hsh*7.0), rmax=mix(mix(0.6,1.4,hh(cell+9.2)), mix(0.15,0.35,hsh), acid);
          float rr=rmax*smoothstep(0.0,0.7,ph)*(1.0+0.05*sin(uTimeR*31.0+hsh*20.0)*step(0.6,ph)), dd=length(wp-ctr);
          bool act=hh(cell+17.7)<mix(0.35,0.55,acid);   /* nur ein Teil der Zellen blubbert (sonst Punktemuster) */
          if(act && ph<0.86){ float in_=1.0-smoothstep(rr-0.03,rr+0.03,dd); vec3 bc=mix(uFlShal*1.25, vec3(1.0), smoothstep(0.55,0.15,length((wp-ctr)/max(rr,1e-3)-vec2(-0.3,0.3)))*0.85);
            col=mix(col, bc, in_); col=mix(col, uFlDeep*0.9, in_*(1.0-smoothstep(0.0,0.08,rr-dd))*0.6); bubA=in_; }
          else if(act){ float pr=rmax*(1.0+(ph-0.86)*6.0); float rg=1.0-smoothstep(0.02,0.06,abs(dd-pr)); col=mix(col, mix(uFlShal,vec3(1.0),0.5), rg*(1.0-(ph-0.86)/0.14)); } }
        col+=uFlGlow*mix(0.0, 0.35+0.45*bubA, acid);                                                            /* Säure leuchtet, Blasen stärker */
        float alpha=clamp(mix(mix(0.35,0.92,gum+acid*0.7), 1.0, max(F,k*mix(0.5,0.9,max(gum,acid)))), 0.0, 1.0); alpha=max(alpha, max(line,bubA));
        alpha*=smoothstep(-dw,dw,dep);
        if(uSky2>0.5) col=applyAir(col, vP, 1.0);
        gl_FragColor=vec4(col, alpha); }
void main(){ kfbMain(); gl_FragColor.rgb = sRGBTransferEOTF(gl_FragColor).rgb;
#include <colorspace_fragment>
}`
const V_SEA = `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
    i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
    vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
    m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
    vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.0*dot(m,g);
  }
uniform float uAmp; uniform vec2 uSeed;
float gNE;
uniform sampler2D uGround; uniform vec4 uGroundO;
float hgt(vec2 p){ vec2 f=(p-uGroundO.xy)/uGroundO.z, i=clamp(floor(f), vec2(0.0), vec2(uGroundO.w-1.0)), uv=f-i; ivec2 c=ivec2(i);   /* = surfaceAt des Gelände-Moduls (Spiel) */
  float ha=texelFetch(uGround,c,0).r, hb=texelFetch(uGround,c+ivec2(0,1),0).r, hc=texelFetch(uGround,c+ivec2(1,1),0).r, hd=texelFetch(uGround,c+ivec2(1,0),0).r;
  return uv.x+uv.y<=1.0 ? ha+(hd-ha)*uv.x+(hb-ha)*uv.y : hc+(hb-hc)*(1.0-uv.x)+(hd-hc)*(1.0-uv.y); }
uniform sampler2D uRiv; uniform vec4 uRivO;
#define RIV_N 512.0
  vec2 rivSample(vec2 p){ if(uRivO.w<0.5) return vec2(0.0); vec2 t=(p-uRivO.xy)/uRivO.z*RIV_N-0.5, c=floor(t+0.5); if(c.x<1.0||c.y<1.0||c.x>RIV_N-2.0||c.y>RIV_N-2.0) return vec2(0.0);
    if(texture2D(uRiv,(c+0.5)/RIV_N).z<1e-4) return vec2(0.0);   /* B = Maximum der 3×3-Nachbarn: außerhalb der Flüsse ein Zugriff */
    vec2 f=t-c, w0=0.5*(0.5-f)*(0.5-f), w1=0.75-f*f, w2=0.5*(0.5+f)*(0.5+f); vec2 v=vec2(0.0);   /* quadratischer B-Spline: Neigung stetig über die Texelgrenzen (bilinear knickte → gezackte Lichtkante bei tiefer Sonne) */
    for(int j=0;j<3;j++){ float wy=j==0?w0.y:(j==1?w1.y:w2.y); for(int i=0;i<3;i++){ float wx=i==0?w0.x:(i==1?w1.x:w2.x); v+=wx*wy*texture2D(uRiv,(c+vec2(float(i)-1.0,float(j)-1.0)+0.5)/RIV_N).xy; } }
    return v; }

      uniform float uWater, uWNE; uniform vec2 uCarW; varying vec3 vP; varying float vDep;
      void main(){ float wl=uWater*uAmp+0.15; vec4 w=modelMatrix*vec4(position.x, wl, position.z, 1.0); gNE=uWNE; vec2 pa=w.xz+uCarW; vDep=wl-hgt(pa); vP=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`
const V_RIBBON = `attribute vec2 aFlow; attribute vec2 aSN; attribute float aLvl; varying vec2 vFlow; varying vec2 vSN; varying float vLvl; varying vec3 vP;
  void main(){ vFlow=aFlow; vSN=aSN; vLvl=aLvl; vec4 w=modelMatrix*vec4(position,1.0); vP=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`
const V_FALL = `attribute vec4 aF; varying vec4 vF; varying vec3 vP; void main(){ vF=aF; vec4 w=modelMatrix*vec4(position,1.0); vP=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`
const V_FOAM = `attribute vec4 aC; varying vec4 vC; varying vec3 vP; void main(){ vC=aC; vec4 w=modelMatrix*vec4(position,1.0); vP=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`

export function createWater({ hyd, ground, seed = [0, 0], seaY = null, size = 0 }) {
  const root = new THREE.Group(); root.name = 'kfb-water'; const group = root
  const L = new THREE.TextureLoader(), T = (url, srgb) => { const t = L.load(url); t.wrapS = t.wrapT = THREE.RepeatWrapping; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t }
  const D = FLUID.defaults, F = hyd.field
  const gT = new THREE.DataTexture(ground.data, ground.seg + 1, ground.seg + 1, THREE.RedFormat, THREE.FloatType); gT.minFilter = gT.magFilter = THREE.NearestFilter; gT.needsUpdate = true
  const fT = new THREE.DataTexture(F.data, F.N, F.N, THREE.RGBAFormat, THREE.FloatType); fT.minFilter = fT.magFilter = THREE.NearestFilter; fT.needsUpdate = true
  const U = { uTimeR: { value: 0 }, uRivDbg: { value: -1 }, uWater: { value: seaY == null ? -1000 : seaY - 0.15 }, uAmp: { value: 1 }, uWNE: { value: 0.6 }, uWKit: { value: 1 }, uFlKind: { value: 0 }, uFlClar: { value: 1 }, uMoodK: { value: 0 },
    uFlShal: { value: new THREE.Color('#5fc4c9') }, uFlDeep: { value: new THREE.Color('#1f6f86') }, uFlGlow: { value: new THREE.Color('#000000') }, uHorizon: { value: new THREE.Color('#cfe6ef') }, uSunDir: { value: new THREE.Vector3(0.4, 0.8, 0.3).normalize() }, uSunCol: { value: new THREE.Color('#fff4e0') }, uShadowOn: { value: 0 }, uShadowMap: { value: null }, uShadowM: { value: new THREE.Matrix4() },   /* Meer = Probe-Wasser (Kit-Zweig) */ uSky2: { value: 0 }, uCarW: { value: new THREE.Vector2() }, uSeed: { value: new THREE.Vector2(...seed) },
    uContact: { value: new THREE.Color('#3a3a34') }, uGround: { value: gT }, uGroundO: { value: new THREE.Vector4(ground.ox, ground.oz, ground.cell, ground.seg) },
    uRiv: { value: fT }, uRivO: { value: new THREE.Vector4(F.ox, F.oz, F.size, 1) },
    uKFCol: { value: new THREE.Color(...D.col) }, uKFShallow: { value: new THREE.Color(...D.shallow) }, uKFMoat: { value: D.moat }, uKFBand: { value: D.band }, uKFShoreFoam: { value: D.shoreFoam },
    uKFV: { value: D.v }, uKFWind: { value: new THREE.Vector2(...D.wind) }, uKFZ: { value: new THREE.Vector2(...D.z) }, uKFDudv: { value: T(FLUID.dudv, false) }, uKFMap: { value: T(FLUID.map, true) }, uKFHasMap: { value: 1 } }
  const mk = (v, f, extra = {}) => new THREE.ShaderMaterial({ uniforms: U, transparent: true, depthWrite: false, vertexShader: v, fragmentShader: f, ...extra })
  const seaMat = mk(V_SEA, F_SEA), mat = mk(V_RIBBON, F_RIBBON, { side: THREE.DoubleSide }), fallMat = mk(V_FALL, F_FALL, { side: THREE.DoubleSide }), foamMat = mk(V_FOAM, F_FOAM)
  const R = hyd.ribbon, geos = [], mats = [seaMat, mat, fallMat, foamMat]
  const add = (g, m, order) => { const o = new THREE.Mesh(g, m); o.frustumCulled = false; o.renderOrder = order; root.add(o); geos.push(g); return o }
  if (R.idx.length) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(R.pos, 3)); g.setAttribute('aFlow', new THREE.Float32BufferAttribute(R.fl, 2)); g.setAttribute('aSN', new THREE.Float32BufferAttribute(R.sn, 2)); g.setAttribute('aLvl', new THREE.Float32BufferAttribute(R.lvA, 1)); g.setIndex(R.idx); add(g, mat, 3) }
  if (seaY != null) add(new THREE.PlaneGeometry(size, size, 128, 128).rotateX(-Math.PI / 2), seaMat, 3)   /* Meer: Höhe setzt der Vertex-Shader (Pegel) */
  const FA = hyd.fallMesh
  if (FA.fi.length) { const g1 = new THREE.BufferGeometry(); g1.setAttribute('position', new THREE.Float32BufferAttribute(FA.fp, 3)); g1.setAttribute('aF', new THREE.Float32BufferAttribute(FA.fa, 4)); g1.setIndex(FA.fi); add(g1, fallMat, 4)
    const g2 = new THREE.BufferGeometry(); g2.setAttribute('position', new THREE.Float32BufferAttribute(FA.cp, 3)); g2.setAttribute('aC', new THREE.Float32BufferAttribute(FA.ca, 4)); g2.setIndex(FA.ci); add(g2, foamMat, 4) }
  /* Gischt-Bällchen (Knete): 5 je Fall am Fuß – Logik puffs() aus der Probe */
  const pGeo = new THREE.IcosahedronGeometry(1, 1), pMat = new THREE.MeshStandardMaterial({ color: '#cfe3df', roughness: 0.9, metalness: 0 })
  const PUFF = { falls: hyd.falls, mesh: new THREE.InstancedMesh(pGeo, pMat, Math.max(1, hyd.falls.length * 5)), m4: new THREE.Matrix4(), q: new THREE.Quaternion(), v: new THREE.Vector3(), sc: new THREE.Vector3() }
  PUFF.mesh.count = 0; PUFF.mesh.frustumCulled = false; root.add(PUFF.mesh)
    function puffs(t) { const F = PUFF.falls, M = PUFF.mesh; if (!F.length || !group.visible) { M.count = 0; return } let n = 0
      for (let f = 0; f < F.length; f++) { const A = F[f], dx = A.b.x - A.a.x, dz = A.b.z - A.a.z, Ld = Math.hypot(dx, dz) || 1, ux = dx / Ld, uz = dz / Ld, H = A.top - A.bot
        for (let k = 0; k < 5; k++) { const ph = (t * 0.45 + k * 0.23 + f * 0.37) % 1, side = (k - 2) * 0.22 * (A.wl + A.wr), sz = (0.16 + 0.04 * H) * (0.75 + 0.35 * Math.sin(ph * Math.PI))
          PUFF.v.set(A.b.x + ux * (0.4 + ph * 1.6) - uz * side, A.bot + 0.15 + ph * (0.6 + 0.12 * H), A.b.z + uz * (0.4 + ph * 1.6) + ux * side); PUFF.sc.setScalar(sz * (1 - 0.6 * ph * ph))
          M.setMatrixAt(n++, PUFF.m4.compose(PUFF.v, PUFF.q, PUFF.sc)) } }
      M.count = n; M.instanceMatrix.needsUpdate = true }
  let t = 0
  return {
    object3d: root,
    update(dt = 1 / 60) { t += dt; U.uTimeR.value = t; puffs(t) },
    dispose() { for (const g of geos) g.dispose(); for (const m of mats) m.dispose(); pGeo.dispose(); pMat.dispose(); gT.dispose(); fT.dispose(); U.uKFDudv.value.dispose(); U.uKFMap.value.dispose(); root.clear() },
    info: () => ({ lines: hyd.lines.length, lakes: hyd.lakes.length, falls: hyd.falls.length, ribbonVerts: R.pos.length / 3, sha: WATER_SOURCE_SHA }),
    uniforms: U,
  }
}
