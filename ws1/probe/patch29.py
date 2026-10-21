import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:90]}')
    s=s.replace(a,b)
# UI: speed coupling
rep('<div class="row"><label for="bands">Banddichte</label>',
    '<label class="check"><input type="checkbox" id="flowspeed" checked> Wabern an Fahrtempo koppeln</label>\n        <div class="row"><label for="bands">Banddichte</label>')
rep("'vox', 'voxsmooth', 'voxtex'];","'vox', 'voxsmooth', 'voxtex', 'flowspeed'];")
rep("flowSpeed: S.flow, bandDensity: S.bands,","flowSpeed: S.flow, flowWithSpeed: S.flowspeed, bandDensity: S.bands,")
rep("num('flow', c.flowSpeed); num('bands', c.bandDensity);","num('flow', c.flowSpeed); num('bands', c.bandDensity); bool('flowspeed', c.flowWithSpeed, true);")
# time: accumulated flow clock (speed-coupled)
rep("SKY.uTime.value = t; U.uTimeT.value = t;",
    "SKY.uTime.value = t; FLOWT += dt * (1 + (S.flowspeed ? Math.min(6, Math.hypot(P.vf, P.vl, P.fly ? P.vy : 0) / 8) : 0)); U.uTimeT.value = FLOWT;   // Fließuhr: im Stand sanft, mit Tempo schneller")
rep("  function frame(now) {","  let FLOWT = 0;\n  function frame(now) {")
# shader: slower base, hold under props (AO footprint), per-band biome switch
rep("float tt=uTimeT*0.012*uFlow;",
    "float tt=uTimeT*0.006*uFlow;\n      { vec2 rl=vW.xz-uCarW; vec2 au=vec2(rl.x+40.0,-rl.y+40.0)/80.0; if(uAOOn>0.5 && au.x>0.0 && au.x<1.0 && au.y>0.0 && au.y<1.0){ float hold=smoothstep(0.03,0.35,texture2D(uAOMap,au).r); tt*=1.0-hold*0.97; } }   /* unter und um Props stehen die Farben still: kein Durchfließen unter Steinen */")
old_cols = """      vec3 P0=peak, P1=sand, P2=low, P3=mid, P4=high, P5=mix(water,mid,0.35);
      float i6=mod(idx,6.0), j6=mod(idx+1.0,6.0);
      vec3 ca=i6<0.5?P0:(i6<1.5?P1:(i6<2.5?P2:(i6<3.5?P3:(i6<4.5?P4:P5))));
      vec3 cb=j6<0.5?P0:(j6<1.5?P1:(j6<2.5?P2:(j6<3.5?P3:(j6<4.5?P4:P5))));"""
new_cols = r"""      /* Biom-Wechsel Band für Band: jedes Band wechselt an einer eigenen Stelle die Palette (keine trübe Mischfarbe, Übergang fließt mit) */
      float i6=mod(idx,6.0), j6=mod(idx+1.0,6.0);
      vec3 cAa=i6<0.5?uA_peak:(i6<1.5?uA_sand:(i6<2.5?uA_low:(i6<3.5?uA_mid:(i6<4.5?uA_high:mix(uA_water,uA_mid,0.35)))));
      vec3 cBa=i6<0.5?uB_peak:(i6<1.5?uB_sand:(i6<2.5?uB_low:(i6<3.5?uB_mid:(i6<4.5?uB_high:mix(uB_water,uB_mid,0.35)))));
      vec3 cAb=j6<0.5?uA_peak:(j6<1.5?uA_sand:(j6<2.5?uA_low:(j6<3.5?uA_mid:(j6<4.5?uA_high:mix(uA_water,uA_mid,0.35)))));
      vec3 cBb=j6<0.5?uB_peak:(j6<1.5?uB_sand:(j6<2.5?uB_low:(j6<3.5?uB_mid:(j6<4.5?uB_high:mix(uB_water,uB_mid,0.35)))));
      float hA=fract(sin(idx*12.9898+3.1)*43758.5453), hB=fract(sin((idx+1.0)*12.9898+3.1)*43758.5453);
      vec3 ca=mix(cAa, cBa, smoothstep(hA*0.8, hA*0.8+0.2, t)), cb=mix(cAb, cBb, smoothstep(hB*0.8, hB*0.8+0.2, t));"""
rep(old_cols, new_cols)
open(p,'w').write(s); print('ok')
