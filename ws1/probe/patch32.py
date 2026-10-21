import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:90]}')
    s=s.replace(a,b)
a=s.index("    if(uOrg>0.5 && uFS>4.5){ float sd=uSeed.x")
b=s.index("    else if(uOrg>0.5 && uFS>3.5){ float sd=uSeed.x")
s=s[:a]+"""    if(uOrg>0.5 && uFS>4.5){ vec3 o=flowBands(vW.xz, hn);
      c = uWater>0.005 ? mix(c, o, smoothstep(uWater+0.03-w, uWater+0.05+w, hn)) : o;
      idc=o; }
"""+s[b:]
# shared function (needs snoise + palette uniforms + uSeed,uScale,uMix,uTimeT,uFlow,uBands declared by the host)
rep("  const vert = `${GLSL_NOISE}\\n${GLSL_HEIGHT}",
r"""  // 70er Fließfarben als eine Funktion für Gelände UND Steine (Georg 20.10.: Farben fließen über die Steine weiter, keine Ruhezone):
  // mehrfach verbogenes Rauschfeld (Quilez), Bänder der Biom-Palette, lose an die Höhe gebunden, Biom-Wechsel Band für Band
  const GLSL_FLOW = `
  vec3 flowBands(vec2 xz, float hn){
    float sd=uSeed.x*0.37+uSeed.y*0.11; float tt=uTimeT*0.006*uFlow;
    float tb=uMix>0.5 ? smoothstep(-0.25,0.25,snoise(xz/(uScale*9.0)+uSeed*0.21+40.0)) : 0.0;
    vec2 p=xz/210.0+vec2(sd*0.01, -sd*0.013);
    vec2 q=vec2(snoise(p+vec2(0.0,tt))*0.7+snoise(p*2.1+vec2(3.1,-tt))*0.3, snoise(p+vec2(5.2,1.3)-tt)*0.7+snoise(p*2.1+vec2(-1.7,4.4)+tt)*0.3);
    vec2 r=vec2(snoise(p+1.6*q+vec2(1.7,9.2)+0.5*tt), snoise(p+1.6*q+vec2(8.3,2.8)-0.4*tt));
    float f=snoise(p+1.4*r+vec2(-4.0,6.0))*0.75+0.25*snoise(p*1.9+r);
    float v=f*uBands+0.8*length(q)+tt*0.6+hn*uBands*0.9; v+=0.22*sin(v*1.7+r.x*2.0);
    float idx=floor(v), k=fract(v); float aw=fwidth(v)*1.1+1e-4;
    float i6=mod(idx,6.0), j6=mod(idx+1.0,6.0);
    vec3 cAa=i6<0.5?uA_peak:(i6<1.5?uA_sand:(i6<2.5?uA_low:(i6<3.5?uA_mid:(i6<4.5?uA_high:mix(uA_water,uA_mid,0.35)))));
    vec3 cBa=i6<0.5?uB_peak:(i6<1.5?uB_sand:(i6<2.5?uB_low:(i6<3.5?uB_mid:(i6<4.5?uB_high:mix(uB_water,uB_mid,0.35)))));
    vec3 cAb=j6<0.5?uA_peak:(j6<1.5?uA_sand:(j6<2.5?uA_low:(j6<3.5?uA_mid:(j6<4.5?uA_high:mix(uA_water,uA_mid,0.35)))));
    vec3 cBb=j6<0.5?uB_peak:(j6<1.5?uB_sand:(j6<2.5?uB_low:(j6<3.5?uB_mid:(j6<4.5?uB_high:mix(uB_water,uB_mid,0.35)))));
    float hA=fract(sin(idx*12.9898+3.1)*43758.5453), hB=fract(sin((idx+1.0)*12.9898+3.1)*43758.5453);
    vec3 ca=mix(cAa, cBa, smoothstep(hA*0.8, hA*0.8+0.2, tb)), cb=mix(cAb, cBb, smoothstep(hB*0.8, hB*0.8+0.2, tb));
    vec3 o=mix(ca, cb, smoothstep(1.0-aw, 1.0, k));
    return mix(o, mix(ca,cb,0.5), smoothstep(0.25,0.6,aw));
  }`;
  const vert = `${GLSL_NOISE}\n${GLSL_HEIGHT}""")
rep("  ${GLSL_SKY}\n  ${GLSL_KUS}\n  ${LP.glsl}\n  ${palUniforms}","  ${GLSL_SKY}\n  ${GLSL_KUS}\n  ${LP.glsl}\n  ${palUniforms}\n  ${GLSL_FLOW}")
# rocks: same flow pattern, applied after the colour stage (before grounding darkening), world pos from grounding varying vKW
rep("ROCKC.mat = mat; LP.injectStandard(mat);",
r"""ROCKC.mat = mat;
    { const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey   // Fließfarben laufen über die Steine weiter (gleiche Weltfunktion wie der Boden)
      mat.onBeforeCompile = (sh, r) => { if (prev) prev.call(mat, sh, r); for (const k of ['uTimeT', 'uFlow', 'uBands', 'uMix', 'uSeed', 'uScale', 'uAmp', 'uOrg', 'uFS']) sh.uniforms[k] = U[k]; for (const k of PAL_KEYS) { sh.uniforms['uA_' + k] = U['uA_' + k]; sh.uniforms['uB_' + k] = U['uB_' + k] }
        const pre = 'uniform float uTimeT, uFlow, uBands, uMix, uScale, uOrg, uFS;\\n' + (sh.fragmentShader.includes('uniform vec2 uSeed') ? '' : 'uniform vec2 uSeed;\\n') + (sh.fragmentShader.includes('uniform float uAmp') ? '' : 'uniform float uAmp;\\n') + palUniforms + '\\n' + (sh.fragmentShader.includes('vec3 snoise') || sh.fragmentShader.includes('float snoise(') ? '' : GLSL_NOISE) + GLSL_FLOW + '\\n'
        sh.fragmentShader = pre + sh.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\\n  if (uOrg > 0.5 && uFS > 4.5) { diffuseColor.rgb = mix(diffuseColor.rgb, flowBands(vKW.xz, vKW.y / max(uAmp, 1.0)) * 0.92, 0.85); }') }
      mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|kfb-flow' }
    LP.injectStandard(mat);""")
open(p,'w').write(s); print('ok')
