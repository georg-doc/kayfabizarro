// #439 · look=terrain3 (Georg 21.10.: „das neue Terrain-Konzept als Basis statt der grünen Wiese“): Malweise der Gelände-Probe im Spiel.
// Fließfarben (70er, Domain Warping, lose an der Höhe, Biom-Paletten) als Farbe des Knet-Geländes; Licht bleibt das eine Rig (LIGHT_MODEL_R2),
// Schatten im Palettenton des Empfängers wie terrain2 (V-564, castShadowTint, kein schwarzer Multiply). Shader-Bausteine 1:1 aus der Probe
// (GLSL_NOISE, GLSL_FLOW, erzeugt von probe/port/gen_terrain3.py); Geländeform bleibt die von M1. Werte in kfb-terrain3.r1.json.
import * as THREE from 'three'
import CFG from '../data/looks/kfb-terrain3.r1.json' with { type: 'json' }

export const TERRAIN3_CFG = CFG
export const isTerrain3 = (hash = typeof location !== 'undefined' ? location.hash : '') => /(^|[#,])look=terrain3(,|$)/.test(hash)
const ROLES = ['water', 'sand', 'low', 'mid', 'high', 'peak', 'cliff']
// Ruhefläche (Kritiker MVP R1 C3, WS0 V-654 = Kanon Gebiet 2 / V-566 70/20/10): Boden darf Textur haben, aber nicht um Aufmerksamkeit konkurrieren –
// Fließfarben im Kontrast (−40 %) und in der Sättigung (−35 %) zum Palettenmittel gedämpft, in der Ferne (60–160 m) Bänder zum Mischton (gegen Moiré).
// Hash calm=0 = ungedämpft wie die Probe (Vergleich für Georg), calm=0.5 halb.
export const T3_CALM = (() => { const m = /(^|[#,])calm=([\d.]+)/.exec(typeof location !== 'undefined' ? location.hash : ''); return m ? Math.min(1, Math.max(0, +m[2])) : 1 })()
export const NOISE_GLSL = `
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
  }`
const FLOW_GLSL = `
uniform vec3 uA_water, uA_sand, uA_low, uA_mid, uA_high, uA_peak, uA_cliff;
uniform vec3 uB_water, uB_sand, uB_low, uB_mid, uB_high, uB_peak, uB_cliff;
uniform vec2 uSeed; uniform float uScale, uMix, uTimeT, uFlow, uBands, uFlowDown;
uniform vec2 uT3H; uniform float uT3S; uniform vec3 uT3Shadow; uniform vec2 uT3Toon; uniform float uT3Mix, uT3Keep;

  vec3 flowBands(vec2 xz, float hn){
    float sd=uSeed.x*0.37+uSeed.y*0.11; float tt=uTimeT*0.006*uFlow*mix(1.0,0.4,uFlowDown);   /* hangabwärts: freies Wabern gedämpft */
    float tb=uMix>0.5 ? smoothstep(-0.25,0.25,snoise(xz/(uScale*9.0)+uSeed*0.21+40.0)) : 0.0;
    vec2 p=xz/210.0+vec2(sd*0.01, -sd*0.013);
    vec2 q=vec2(snoise(p+vec2(0.0,tt))*0.7+snoise(p*2.1+vec2(3.1,-tt))*0.3, snoise(p+vec2(5.2,1.3)-tt)*0.7+snoise(p*2.1+vec2(-1.7,4.4)+tt)*0.3);
    vec2 r=vec2(snoise(p+1.6*q+vec2(1.7,9.2)+0.5*tt), snoise(p+1.6*q+vec2(8.3,2.8)-0.4*tt));
    float f=snoise(p+1.4*r+vec2(-4.0,6.0))*0.75+0.25*snoise(p*1.9+r);
    /* Hangabwärts fließen (Georg 21.10.): Bänder enger an die Höhenlinien gebunden, Bandphase läuft mit der Zeit → jede Stufe wandert zur tieferen Höhenlinie */
    float v=f*uBands*mix(1.0,0.55,uFlowDown)+0.8*length(q)+tt*0.6+hn*uBands*mix(0.9,2.4,uFlowDown)+uFlowDown*uTimeT*0.035*uFlow; v+=0.22*sin(v*1.7+r.x*2.0);
    float idx=floor(v), k=fract(v); float aw=fwidth(v)*1.1+1e-4;
    float i6=mod(idx,6.0), j6=mod(idx+1.0,6.0);
    /* 6. Band: Geländeton statt Wasser-Mischton (Georg 21.10.: türkise Flächen über dem Wasser lesen sich als Wasser, wo keins ist) */
    vec3 cAa=i6<0.5?uA_peak:(i6<1.5?uA_sand:(i6<2.5?uA_low:(i6<3.5?uA_mid:(i6<4.5?uA_high:mix(uA_mid,uA_high,0.5)))));
    vec3 cBa=i6<0.5?uB_peak:(i6<1.5?uB_sand:(i6<2.5?uB_low:(i6<3.5?uB_mid:(i6<4.5?uB_high:mix(uB_mid,uB_high,0.5)))));
    vec3 cAb=j6<0.5?uA_peak:(j6<1.5?uA_sand:(j6<2.5?uA_low:(j6<3.5?uA_mid:(j6<4.5?uA_high:mix(uA_mid,uA_high,0.5)))));
    vec3 cBb=j6<0.5?uB_peak:(j6<1.5?uB_sand:(j6<2.5?uB_low:(j6<3.5?uB_mid:(j6<4.5?uB_high:mix(uB_mid,uB_high,0.5)))));
    float hA=fract(sin(idx*12.9898+3.1)*43758.5453), hB=fract(sin((idx+1.0)*12.9898+3.1)*43758.5453);
    vec3 ca=mix(cAa, cBa, smoothstep(hA*0.8, hA*0.8+0.2, tb)), cb=mix(cAb, cBb, smoothstep(hB*0.8, hB*0.8+0.2, tb));
    vec3 o=mix(ca, cb, smoothstep(1.0-aw, 1.0, k));
    return mix(o, mix(ca,cb,0.5), smoothstep(0.25,0.6,aw));
  }`

// WS1c (V-631) · Grund und nasser Saum unter/an der Wasserfläche (world=probe): Probe-Block „Ufer im Design-Kontext“ 1:1 (erzeugt), Höhe glatt aus dem
// Gelände-Netz wie hgt() im Wasser (kfbWater) → Wasserrand und Grund-Grenze liegen auf derselben Höhenlinie. Die Probe rechnet in Bildwerten (sRGB):
// der Block bekommt die Farbe in sRGB und gibt sie linear zurück. Probe-Regler, die das Spiel nicht hat, als feste Werte (Kit an, Meer = uT3Sea).
const SHORE_PARS = `
uniform sampler2D uGround, uRiv; uniform vec4 uGroundO, uRivO; uniform float uT3Sea, uT3WOn, uT3WTime, uT3UK;
float t3Hgt(vec2 p){ vec2 f=(p-uGroundO.xy)/uGroundO.z, c=clamp(floor(f+0.5), vec2(1.0), vec2(uGroundO.w-1.0)), t=f-c;
  vec2 w0=0.5*(0.5-t)*(0.5-t), w1=0.75-t*t, w2=0.5*(0.5+t)*(0.5+t); ivec2 ci=ivec2(c); float v=0.0;
  for(int j=0;j<3;j++){ float wy=j==0?w0.y:(j==1?w1.y:w2.y); for(int i=0;i<3;i++){ float wx=i==0?w0.x:(i==1?w1.x:w2.x); v+=wx*wy*texelFetch(uGround,ci+ivec2(i-1,j-1),0).r; } }
  return v; }
  float rivW(vec2 p){ if(uRivO.w<0.5) return 0.0; vec2 t=(p-uRivO.xy)/uRivO.z*512.0-0.5, c=floor(t+0.5); if(c.x<1.0||c.y<1.0||c.x>510.0||c.y>510.0) return 0.0; if(texture2D(uRiv,(c+0.5)/512.0).z<1e-4) return 0.0;   /* Rinnen-Gewicht wie rivMod (B-Spline) */
    vec2 f=t-c, w0=0.5*(0.5-f)*(0.5-f), w1=0.75-f*f, w2=0.5*(0.5+f)*(0.5+f); float v=0.0;
    for(int j=0;j<3;j++){ float wy=j==0?w0.y:(j==1?w1.y:w2.y); for(int i=0;i<3;i++){ float wx=i==0?w0.x:(i==1?w1.x:w2.x); v+=wx*wy*texture2D(uRiv,(c+vec2(float(i)-1.0,float(j)-1.0)+0.5)/512.0).y; } } return v; }`
const SHORE_MAIN = `
  if (uT3WOn > 0.5 && vT3W.y - uT3Sea < 1.5) { vec3 col = sRGBTransferOETF(vec4(diffuseColor.rgb, 1.0)).rgb; vec3 uA_water = sRGBTransferOETF(vec4(uA_water, 1.0)).rgb;
    float vH = t3Hgt(vT3W.xz); vec3 vW = vec3(vT3W.x, vH, vT3W.z); float uWater = 1.0, uAmp = uT3Sea - 0.15, uGridWorld = 0.0, uWKit = 1.0, uFlClar = 1.0, uFlKind = 0.0, uTimeR = uTimeT;
    vec2 uCarW = vec2(0.0); vec3 uFlShal = vec3(0.37, 0.77, 0.79), uFlDeep = vec3(0.12, 0.44, 0.53);
    vec3 col0 = col;
    float wlR=-999.0;   /* Volumen nur fürs Meer: für Flüsse/Seen kann der Gelände-Shader nicht wissen, ob darüber wirklich Wasser gezeichnet wird (Georg 21.10.: türkise Fläche ohne Wasser) */
    if((uWater>0.005 || wlR>-900.0) && uGridWorld<0.5){ if(wlR>-900.0){ float rwv=rivW(vW.xz); if(wlR-vH>(rwv>0.35 ? 2.5 : 4.0)) wlR=-999.0; }   /* nur plausible Wassertiefe (Fluss ≤ 2,5 m, See ≤ 4 m): sonst färbte sich Gelände neben Quellen ohne Wasser dunkel */ float wl=max(uWater>0.005 ? uWater*uAmp+0.15 : -999.0, wlR); float dz=vH-wl;   /* Volumen (WASSER_R1): Meer UND Flüsse/Seen färben ihr Bett nach Tiefe und Blickweg */ float fw=fwidth(vH)*1.2+1e-3;
      /* Fluid (WASSER_R1 Stufe 1): unter dem Spiegel gestufte Tiefenfarbe (Grund wird zur Tiefe), darüber ein nasses, dunkleres Uferband, das atmet –
         es nimmt Licht und Schatten an wie Boden (kein heller Streifen auf eigener Ebene mehr) */
      vec3 rdT=normalize(vW-vec3(uCarW.x,0.0,uCarW.y)-cameraPosition); float dep=max(-dz,0.0), Lp=dep/max(abs(rdT.y),0.15);
      float kd=1.0-exp(-Lp/uFlClar); float ks=kd*3.0; float kw=fwidth(ks)+1e-3; kd=(floor(ks)+smoothstep(0.5-kw,0.5+kw,fract(ks)))/3.0;
      float under=1.0-smoothstep(-fw,fw,dz);
      if(uWKit>0.5){   /* Ufer im Design-Kontext (Georg 21.10.: „verschmierte Übergänge“ → sauber mit Farbfluss und Wasser-Shader): harte, gemalte Stufen statt Verläufe */
        vec2 P=vW.xz; float wob=0.5+0.5*snoise(P*0.21+uSeed*0.3), aw=fwidth(dz)*1.2+1e-3;
        float wetH=0.32+0.3*wob; vec2 gxW=dFdx(P), gyW=dFdy(P); float wGx=dFdx(dz), wGy=dFdy(dz), dtW=gxW.x*gyW.y-gxW.y*gyW.x;   /* WS1c: Saum in Metern (Uferabstand = Höhe ÷ Neigung), höchstens 0,55–1,0 m breit */
        float dzm=max(dz,0.0)/max(length(abs(dtW)>1e-9 ? vec2(wGx*gyW.y-gxW.y*wGy, gxW.x*wGy-wGx*gyW.x)/dtW : vec2(0.0)),0.06), wetW=0.35+0.3*wob, mw=fwidth(dzm)+1e-3;
        float wetB=(1.0-smoothstep(wetH-aw, wetH+aw, dz))*(1.0-smoothstep(wetW-mw, wetW+mw, dzm))*(1.0-smoothstep(0.02, 0.15, rivW(P)));   /* nicht in Flussrinnen: die Sohle liegt knapp über dem Meer, die Saumgrenze lief dort zackig über die Dreiecke */                 /* nasser Saum: hartes Band, Höhe wellig (gemalt) */
        vec3 wetC=mix(col*0.8, uA_water*0.7, 0.25);                                         /* die Fließfarben laufen durch den Saum weiter, dunkler und kühler */
        float dpT=max(-dz,0.0); vec2 gxT=dFdx(P), gyT=dFdy(P); float exT=dFdx(dpT), eyT=dFdy(dpT), dtT=gxT.x*gyT.y-gxT.y*gyT.x;
        float sdT=dpT/max(length(abs(dtT)>1e-9 ? vec2(exT*gyT.y-gxT.y*eyT, gxT.x*eyT-exT*gyT.x)/dtT : vec2(0.0)),0.06), sw=fwidth(sdT)+1e-3, e1=0.9+0.45*wob;
        vec3 kDeep=vec3(0.227,0.227,0.204);                                                   /* Island Kit deep #3a3a34 */
        vec3 bed=mix(mix(uA_water*0.85, wetC, 0.25), mix(kDeep, uA_water*0.4, 0.3), smoothstep(e1-sw, e1+sw, sdT)); /* Schelf | Tiefe als flache Palettentöne – keine Fließfarben-Bänder unter Wasser (Georg 21.10.: verschmierte Küsten) */
        float uw=1.0-smoothstep(-aw, aw, dz);
        col=mix(col, wetC, wetB*(1.0-uw)); col=mix(col, bed, uw); under=0.0; }
      else col=mix(col, mix(col*uFlShal*1.6, uFlDeep, kd), under);
      float breath=0.08*sin(uTimeR*6.2832/4.5), wetH=(uFlKind>1.5 ? 0.6 : 0.38)+breath;
      float wet=(1.0-smoothstep(wetH-fw, wetH+fw, dz))*(1.0-under)*(1.0-uWKit);
      vec3 wetC=uFlKind>1.5 ? mix(col, vec3(dot(col,vec3(0.33))), 0.6)*0.7 : uFlKind>0.5 ? mix(col*0.8, uFlShal, 0.25) : col*0.76;   /* Wasser: dunkler/nass · Kaugummi: rosa Schlieren · Säure: verätzt */
      col=mix(col, wetC, wet); }
    { float cz = uT3Sea - vH; if (cz > 0.02) { vec2 cp = vT3W.xz; float tt = uT3WTime;   /* WS1c: Lichtflecken am Grund (Kaustik) – nur Grundfarbe, das Licht des einen Rigs macht sie hell oder dunkel */
      float r = snoise(cp * 0.42 + vec2(0.23, 0.13) * tt) * 0.6 + snoise(cp * 0.8 - vec2(0.17, 0.21) * tt + 4.1) * 0.4, cw = fwidth(r) + 1e-3;   /* gemalte Lichtflecken (harte Kante), kein Netz */
      float fade = smoothstep(0.02, 0.35, cz) * (1.0 - smoothstep(1.5, 4.0, cz)) * (1.0 - smoothstep(25.0, 60.0, distance(cameraPosition, vT3W)));
      col = mix(col, mix(col0, uA_water, 0.6) * 1.15, 0.7 * uT3UK * smoothstep(0.02, 0.3, cz));   /* Kamera unter Wasser: Grund heller (Licht von oben), Fließfarben gedämpft */
      col += vec3(0.85, 0.95, 0.9) * smoothstep(0.42 - cw, 0.42 + cw, r) * fade * (0.16 + 0.22 * uT3UK); } }
    diffuseColor.rgb = sRGBTransferEOTF(vec4(col, 1.0)).rgb; }`

// Maßstab: die Spielwelt ist viel kleiner als die Probe (Bänder dort ≈ 210 m) → flow.scale vergrößert die Koordinaten (mehr Bänder je Meter)
// opts: { palette, paletteB, mix, hMin, hMax } · Rückgabe: { uniforms, palette, update(dt, speed) }
// water (WS1c, world=probe): { uniforms (kfbWater: uGround/uGroundO/uRiv/uRivO), seaY } → Grund und Saum am Meer; ohne water byte-gleich wie vorher
export function applyTerrain3(mat, { palette = CFG.palette, paletteB = CFG.paletteB, mix = CFG.mix, hMin = 0, hMax = 10, water = null } = {}) {
  const A = CFG.palettes[palette] || CFG.palettes.mesa, B = CFG.palettes[paletteB] || CFG.palettes.moos
  const U = { uSeed: { value: new THREE.Vector2(0, 0) }, uScale: { value: 180 }, uMix: { value: mix ? 1 : 0 }, uTimeT: { value: 0 }, uFlow: { value: CFG.flow.speed }, uBands: { value: CFG.flow.bands }, uFlowDown: { value: CFG.flow.downhill ? 1 : 0 },
    uT3H: { value: new THREE.Vector2(hMin, hMax) }, uT3S: { value: CFG.flow.scale ?? 2.5 }, uT3Shadow: { value: new THREE.Color(A.cliff).lerp(new THREE.Color('#5a6f9a'), 0.45).multiplyScalar(0.7) },   /* kühler Palettenschatten, nur leicht beigemischt (kein Rotsaum am Rand) */
    uT3Toon: { value: new THREE.Vector2(0.3, 0.7) }, uT3Mix: { value: 0.18 }, uT3Keep: { value: 0.78 }, uT3Calm: { value: T3_CALM } }
  for (const r of ROLES) { U['uA_' + r] = { value: new THREE.Color(A[r]) }; U['uB_' + r] = { value: new THREE.Color(B[r]) } }
  if (water) Object.assign(U, { uGround: water.uniforms.uGround, uGroundO: water.uniforms.uGroundO, uRiv: water.uniforms.uRiv, uRivO: water.uniforms.uRivO, uT3Sea: { value: water.seaY ?? -1e6 }, uT3WTime: water.uniforms.uTimeR, uT3UK: water.uniforms.uUnderK, uT3WOn: { value: water.seaY == null ? 0 : 1 } })
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => {
    prev?.call(mat, sh, r)
    Object.assign(sh.uniforms, U)
    sh.vertexShader = 'varying vec3 vT3W;\n' + sh.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>
  vT3W = (modelMatrix * vec4(transformed, 1.0)).xyz;`)
    sh.fragmentShader = 'varying vec3 vT3W;\nuniform float uT3Calm;\n' + NOISE_GLSL + '\n' + FLOW_GLSL + '\n' + (water ? SHORE_PARS + '\n' : '') + sh.fragmentShader
      .replace('#include <color_fragment>', `#include <color_fragment>
  diffuseColor.rgb = flowBands(vT3W.xz * uT3S, clamp((vT3W.y - uT3H.x) / max(1e-3, uT3H.y - uT3H.x), 0.0, 1.0));
  if (uT3Calm > 0.0) { vec3 t3m = mix(mix(uA_low, uA_mid, 0.5), uA_sand, 0.3); float t3L = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    diffuseColor.rgb = mix(vec3(t3L), diffuseColor.rgb, 1.0 - 0.35 * uT3Calm); diffuseColor.rgb = mix(t3m, diffuseColor.rgb, 1.0 - 0.4 * uT3Calm);
    diffuseColor.rgb = mix(diffuseColor.rgb, mix(t3m, diffuseColor.rgb, 0.45), uT3Calm * smoothstep(60.0, 160.0, length(vT3W - cameraPosition))); }${water ? SHORE_MAIN : ''}`)
      .replace('#include <lights_fragment_begin>', `#include <lights_fragment_begin>
  float t3V = 1.0;
  #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
  { DirectionalLightShadow t3s = directionalLightShadows[ 0 ];
    t3V = receiveShadow ? getShadow( directionalShadowMap[ 0 ], t3s.shadowMapSize, t3s.shadowIntensity, t3s.shadowBias, t3s.shadowRadius, vDirectionalShadowCoord[ 0 ] ) : 1.0; }
  #endif`)
      .replace('#include <opaque_fragment>', `{ /* Schatten im Palettenton des Empfängers (V-564): Helligkeit aus der echten Beleuchtung, Farbton aus Rolle + Palette */
    vec3 lw = vec3(0.2126, 0.7152, 0.0722);
    vec3 shc = mix(diffuseColor.rgb * uT3Keep, uT3Shadow, uT3Mix);
    vec3 remap = shc * (dot(outgoingLight, lw) / max(dot(shc, lw), 1e-3));
    outgoingLight = mix(remap, outgoingLight, smoothstep(uT3Toon.x, uT3Toon.y, t3V)); }
  #include <opaque_fragment>`)
  }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|terrain3' + (water ? '|shore' : '')
  mat.needsUpdate = true
  // Fließuhr wie in der Probe: im Stand sanft, mit Tempo schneller (CFG.flow.tempoCoupling)
  return { uniforms: U, palette: A, update(dt, speed = 0) { U.uTimeT.value += dt * (1 + (CFG.flow.tempoCoupling ? Math.min(6, speed / 8) : 0)) } }
}

// Palettenschatten allein (ohne Fließfarben) für weitere Böden des Looks, z. B. den Weg (V-564: Schatten im Ton des Empfängers)
export function applyShadowTone3(mat, { palette = CFG.palette } = {}) {
  const A = CFG.palettes[palette] || CFG.palettes.mesa
  const U = { uT3Shadow: { value: new THREE.Color(A.cliff).lerp(new THREE.Color('#5a6f9a'), 0.45).multiplyScalar(0.7) }, uT3Toon: { value: new THREE.Vector2(0.3, 0.7) }, uT3Mix: { value: 0.18 }, uT3Keep: { value: 0.78 } }
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => { prev?.call(mat, sh, r); Object.assign(sh.uniforms, U)
    sh.fragmentShader = 'uniform vec3 uT3Shadow; uniform vec2 uT3Toon; uniform float uT3Mix, uT3Keep;\n' + sh.fragmentShader
      .replace('#include <lights_fragment_begin>', `#include <lights_fragment_begin>
  float t3V = 1.0;
  #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
  { DirectionalLightShadow t3s = directionalLightShadows[ 0 ];
    t3V = receiveShadow ? getShadow( directionalShadowMap[ 0 ], t3s.shadowMapSize, t3s.shadowIntensity, t3s.shadowBias, t3s.shadowRadius, vDirectionalShadowCoord[ 0 ] ) : 1.0; }
  #endif`)
      .replace('#include <opaque_fragment>', `{ vec3 lw = vec3(0.2126, 0.7152, 0.0722); vec3 shc = mix(diffuseColor.rgb * uT3Keep, uT3Shadow, uT3Mix);
    vec3 remap = shc * (dot(outgoingLight, lw) / max(dot(shc, lw), 1e-3)); outgoingLight = mix(remap, outgoingLight, smoothstep(uT3Toon.x, uT3Toon.y, t3V)); }
  #include <opaque_fragment>`) }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|t3shadow'; mat.needsUpdate = true
  return { uniforms: U, palette: A }
}

// Dunkler Fuß wie KayKit (Schattenkonzept R1, Georg 21.10.: „wie Kay Lousberg“), aber zur Laufzeit aus dem echten Bodenabstand statt in die Farbe
// gebacken: weicher Verlauf, zum Boden hin dunkler (nie schwarz, keine Kante). uniforms.uFootY setzt der Host je Bild (Bodenhöhe unter der Figur).
export function applyFootShade(mat, uniforms) {
  if (!mat || mat.userData?.footShade) return; mat.userData.footShade = true
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => { prev?.call(mat, sh, r); Object.assign(sh.uniforms, uniforms)
    sh.vertexShader = 'varying float vFootW;\n' + sh.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>
  { vec4 fw = vec4(transformed, 1.0);
  #ifdef USE_SKINNING
  #endif
  #ifdef USE_INSTANCING
    fw = instanceMatrix * fw;
  #endif
    vFootW = (modelMatrix * fw).y; }`)
    sh.fragmentShader = 'uniform float uFootY, uFootH, uFootK; varying float vFootW;\n' + sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
  { float hf = max(vFootW - uFootY, 0.0);
    diffuseColor.rgb *= mix(1.0 - uFootK, 1.0, smoothstep(0.0, uFootH, hf)); }`) }                          /* nur weicher Verlauf zum Boden (keine harte Stufe – las sich als Schuhsohle, Georg 21.10.) */
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|foot'; mat.needsUpdate = true
}

// Selbstschatten an Figuren gedämpft (Georg 21.10.: harte Schattenkante am Arm; KayKit: Figuren bleiben hell und lesbar): der echte Schatten der
// einen Sonne wirkt auf Figuren nur mit uFigShadowK (0 = keiner, 1 = voll). Ersetzt im Licht-Chunk nur den Faktor der Richtungslicht-Schatten.
export function applyFigureShadow(mat, uniforms) {
  if (!mat || mat.userData?.figShadow) return; mat.userData.figShadow = true
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => { prev?.call(mat, sh, r); Object.assign(sh.uniforms, uniforms)
    const chunk = THREE.ShaderChunk.lights_fragment_begin.replace(/directLight\.color \*= \( directLight\.visible && receiveShadow \) \? (getShadow\( directionalShadowMap\[ i \][^;]*?) : 1\.0;/,
      'directLight.color *= ( directLight.visible && receiveShadow ) ? mix( 1.0, $1, uFigShadowK ) : 1.0;')
    sh.fragmentShader = 'uniform float uFigShadowK;\n' + sh.fragmentShader.replace('#include <lights_fragment_begin>', chunk) }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|figshadow'; mat.needsUpdate = true
}
