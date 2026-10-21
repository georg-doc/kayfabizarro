import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:90]}')
    s=s.replace(a,b)
# 1) contours only in pure line mode
rep("neon2*cont*0.45*(uGFill<0.5?1.0:0.3)","neon2*cont*0.45*(uGFill<0.5?1.0:0.0)")
# 2) gradient estimate with more octaves + stronger factor
s=s.replace("gOcMax=3.0; float a0=hraw(p);","gOcMax=5.0; float a0=hraw(p);")
s=s.replace("gOcMax = 3.0; float a0 = hraw(gp);","gOcMax = 5.0; float a0 = hraw(gp);")
s=s.replace("const om = OCMAX; OCMAX = 3; const a0 = hraw(px, py);","const om = OCMAX; OCMAX = 5; const a0 = hraw(px, py);")
for a,b in [("kP=max(0.02, 1.6*gNE*gG);","kP=max(0.02, 2.6*gNE*gG);"),
            ("clamp(1.6*gNE*uSteps*gG/0.7,0.0,0.5)","clamp(2.6*gNE*uSteps*gG/0.7,0.0,0.5)"),
            ("clamp(1.6*gNE*uSteps*gG,0.0,0.5)","clamp(2.6*gNE*uSteps*gG,0.0,0.5)"),
            ("kP = Math.max(0.02, 1.6 * NEJ * gG);","kP = Math.max(0.02, 2.6 * NEJ * gG);"),
            ("Math.min(0.5, 1.6 * NEJ * S.steps * gG / 0.7)","Math.min(0.5, 2.6 * NEJ * S.steps * gG / 0.7)"),
            ("Math.min(0.5, 1.6 * NEJ * S.steps * gG)); f = sstep","Math.min(0.5, 2.6 * NEJ * S.steps * gG)); f = sstep")]:
    rep(a,b)
# 3) ridge crest softness scales with grid (no crest thinner than ~2 grid cells)
rep("float r=uEther>0.5 ? max(0.0,(1.0-sqrt(sn*sn+0.06))/0.7551) : 1.0-abs(sn);",
    "float wlr=uScale/pow(2.0,float(i)); float ke=0.06+pow(3.0*gNE/wlr,2.0); float r=uEther>0.5 ? max(0.0,(1.0-sqrt(sn*sn+ke))/(1.0-sqrt(ke))) : 1.0-sqrt(sn*sn+pow(3.0*gNE/wlr,2.0));")
rep("const r = S.ether ? Math.max(0, (1 - Math.sqrt(sn * sn + 0.06)) / 0.7551) : 1 - Math.abs(sn), ow = octW(i);",
    "const wlr = S.scale / Math.pow(2, i), kg = Math.pow(3 * NEJ / wlr, 2), ke = 0.06 + kg, r = S.ether ? Math.max(0, (1 - Math.sqrt(sn * sn + ke)) / (1 - Math.sqrt(ke))) : 1 - Math.sqrt(sn * sn + kg), ow = octW(i);")
# 4) strata follow geometric layers
rep("uniform float uScale, uAmp, uWater, uSoft, uCliff, uStrata, uToon, uMix, uGrid, uFogNear, uFogFar, uMoodK, uGridWorld, uGS, uGShape, uGFill, uGCol, uClay, uGTex, uRing, uEther;",
    "uniform float uScale, uAmp, uWater, uSoft, uCliff, uStrata, uToon, uMix, uGrid, uFogNear, uFogFar, uMoodK, uGridWorld, uGS, uGShape, uGFill, uGCol, uClay, uGTex, uRing, uEther, uSteps;")
old=s[s.index("    if(uStrata>0.5){ float sy=vW.y/(uAmp*0.06+0.6);"):]
old=old[:old.index("\n")+1]
rep(old, r"""    if(uStrata>0.5){
      if(uSteps>=1.0 && uEther>0.5){ /* Gesteinslagen = geometrische Schichten (Etherington N4): jede Wand trägt den Ton ihrer Lage, Wechsel liegt auf der Terrasse, nicht mitten in der Wand */
        float tw=0.35*snoise(vW.xz/(uScale*2.5)+uSeed*0.11+23.0); float s0=hn*uSteps+tw; float k0=floor(s0*0.5)*2.0, t0=s0-k0; float uu=k0+(t0<1.3? t0/1.3 : 1.0+(t0-1.3)/0.7);
        float lay=floor(uu+0.5); float hsl=fract(sin(lay*12.9898+uSeed.x)*43758.5453); cl=cliff*mix(0.84,1.08,hsl); }
      else { float sy=vW.y/(uAmp*0.06+0.6)+0.6*snoise(vW.xz/90.0); float sw=fwidth(sy)*1.5+1e-4; float band=smoothstep(0.5-sw,0.5+sw,fract(sy))*(1.0-smoothstep(1.0-sw,1.0,fract(sy))); band=mix(band,0.5,smoothstep(0.15,0.4,sw)); cl=mix(cliff*0.86, cliff*1.06, band); } }
""")
open(p,'w').write(s); print('ok')
