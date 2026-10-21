import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:90]}')
    s=s.replace(a,b)
# ---------- GLSL height: hraw/hlow, octave cap + early break, slope-adaptive terraces
rep("  float gNE=2.34375;","  float gG=0.0, gOcMax=7.0; /* gG = Steigung der Rohhöhe (normiert/m) am Vertex; gOcMax = Oktaven-Deckel für billige Hilfsrechnungen */\n  float gNE=2.34375;")
rep("float fbm(vec2 q){ float s=0.0, a=1.0, n=0.0, oc=uEther>0.5?min(uOct,5.0):uOct; for(int i=0;i<7;i++){ if(float(i)>=oc) break; s+=a*octW(float(i),1.0)*snoise(q); n+=a;",
    "float fbm(vec2 q){ float s=0.0, a=1.0, n=0.0, oc=min(uEther>0.5?min(uOct,5.0):uOct, gOcMax); for(int i=0;i<7;i++){ if(float(i)>=oc) break; float ow=octW(float(i),1.0); if(ow<0.001){ n+=a*(1.0-pow(0.5,oc-float(i)))/0.5; break; } s+=a*ow*snoise(q); n+=a;")
rep("float rfbm(vec2 q){ float s=0.0, a=1.0, n=0.0, oc=uEther>0.5?min(uOct,4.0):uOct; for(int i=0;i<7;i++){ if(float(i)>=oc) break; float sn=snoise(q);",
    "float rfbm(vec2 q){ float s=0.0, a=1.0, n=0.0, oc=min(uEther>0.5?min(uOct,4.0):uOct, gOcMax), gr=uEther>0.5?0.45:0.5; for(int i=0;i<7;i++){ if(float(i)>=oc) break; float ow0=octW(float(i),1.0); if(ow0<0.001){ float ar=a*(1.0-pow(gr,oc-float(i)))/(1.0-gr); s+=0.5*ar; n+=ar; break; } float sn=snoise(q);")
rep("""  float hgt(vec2 p){
    vec2 q=p/uScale+uSeed;""","""  float hraw(vec2 p){
    vec2 q=p/uScale+uSeed;""")
rep("""    if(uValley>0.0) h=pow(h,1.0+uValley*1.6);
    if(uPlateau<0.999){ float dP=h-uPlateau, kP=0.02+gNE/uAmp*0.6;""","""    if(uValley>0.0) h=pow(h,1.0+uValley*1.6);
    return h;
  }
  float hlow(vec2 p){ float o=gOcMax; gOcMax=2.0; float h=hraw(p); gOcMax=o; return h; }   /* nur große Formen (Tal/Rücken) */
  float hgt(vec2 p){
    float h=hraw(p);
    /* Anti-Zacken je Steigung: jede Kante (Tafel, Stufe) ist ≥ ca. 2 Gitterabstände breit, egal wie steil der Hang ist */
    if(uPlateau<0.999){ float dP=h-uPlateau, kP=max(0.02, 1.6*gNE*gG);""")
rep("float w=max(max(mix(0.5,0.03,uSharp),0.22), clamp(gNE*uSteps/uAmp*1.5,0.0,0.5));   /* Stufenkante ≥ ca. 2 Gitterabstände breit */",
    "float w=max(max(mix(0.5,0.03,uSharp),0.16), clamp(1.6*gNE*uSteps*gG/0.7,0.0,0.5));")
rep("else { float s=h*uSteps; float f=fract(s); float w=mix(0.5,0.03,uSharp); f=smoothstep(0.5-w,0.5+w,f); h=(floor(s)+f)/uSteps; } }\n    return dioMod(p, h*uAmp);",
    "else { float s=h*uSteps; float f=fract(s); float w=max(mix(0.5,0.03,uSharp), clamp(1.6*gNE*uSteps*gG,0.0,0.5)); f=smoothstep(0.5-w,0.5+w,f); h=(floor(s)+f)/uSteps; } }\n    return dioMod(p, h*uAmp);")
# ---------- vertex main: gradient, cheaper rings, large curvature
rep("varying vec4 vSC; varying float vCurv;\n  void main(){","varying vec4 vSC; varying float vCurv; varying float vCL;\n  void main(){")
rep("gNE=mix(uNE, uNE*4.0, smoothstep(uNE*100.0, uNE*126.0, chb)); } float h=hgt(p);",
    "gNE=mix(uNE, uNE*4.0, smoothstep(uNE*100.0, uNE*126.0, chb)); }\n    { float om=gOcMax; gOcMax=3.0; float a0=hraw(p); gG=length(vec2(hraw(p+vec2(2.34375,0.0))-a0, hraw(p+vec2(0.0,2.34375))-a0))/2.34375; gOcMax=om; }\n    float h=hgt(p);")
rep("    if(uEther>0.5){ float eF=max(6.0,uNE*2.5);","    if(uEther>0.5 && uNE<3.0){ float eF=max(6.0,uNE*2.5);")
rep("    vCurv=0.0; if(uEdges>0.5){","    { float L=28.0; vCL=(hlow(p+vec2(L,0.0))+hlow(p-vec2(L,0.0))+hlow(p+vec2(0.0,L))+hlow(p-vec2(0.0,L)))*0.25-hlow(p); }   /* >0 Mulde/Tal, <0 Rücken (große Form) */\n    vCurv=0.0; if(uEdges>0.5){")
# grounding: gradient too
rep("vKW = wpG + vec3(uGOff.x, 0.0, uGOff.y); vGA = wpG.y - hgt(wpG.xz + uGOff);",
    "vKW = wpG + vec3(uGOff.x, 0.0, uGOff.y); { vec2 gp = wpG.xz + uGOff; float om = gOcMax; gOcMax = 3.0; float a0 = hraw(gp); gG = length(vec2(hraw(gp + vec2(2.34375, 0.0)) - a0, hraw(gp + vec2(0.0, 2.34375)) - a0)) / 2.34375; gOcMax = om; } vGA = wpG.y - hgt(wpG.xz + uGOff);")
# ---------- JS mirror
rep("function fbm(x, y) { let s = 0, a = 1, n = 0; const oc = S.ether ? Math.min(S.oct, 5) : S.oct; for (let i = 0; i < 7 && i < oc; i++) { s += a * octW(i) * snoise(x, y); n += a;",
    "let OCMAX = 7;\n  function fbm(x, y) { let s = 0, a = 1, n = 0; const oc = Math.min(S.ether ? Math.min(S.oct, 5) : S.oct, OCMAX); for (let i = 0; i < 7 && i < oc; i++) { const ow = octW(i); if (ow < 0.001) { n += a * (1 - Math.pow(0.5, oc - i)) / 0.5; break } s += a * ow * snoise(x, y); n += a;")
rep("function rfbm(x, y) { let s = 0, a = 1, n = 0; const oc = S.ether ? Math.min(S.oct, 4) : S.oct; for (let i = 0; i < 7 && i < oc; i++) { const sn = snoise(x, y);",
    "function rfbm(x, y) { let s = 0, a = 1, n = 0; const oc = Math.min(S.ether ? Math.min(S.oct, 4) : S.oct, OCMAX), gr = S.ether ? 0.45 : 0.5; for (let i = 0; i < 7 && i < oc; i++) { if (octW(i) < 0.001) { const ar = a * (1 - Math.pow(gr, oc - i)) / (1 - gr); s += 0.5 * ar; n += ar; break } const sn = snoise(x, y);")
rep("""  function hgt(px, py) {
    let qx = px / S.scale + S.sx, qy = py / S.scale + S.sy;""","""  function hraw(px, py) {
    let qx = px / S.scale + S.sx, qy = py / S.scale + S.sy;""")
rep("""    if (S.valley > 0) h = Math.pow(h, 1 + S.valley * 1.6);
    if (S.plateau < 0.999) { const dP = h - S.plateau, kP = 0.02 + NE0 / S.amp * 0.6;""","""    if (S.valley > 0) h = Math.pow(h, 1 + S.valley * 1.6);
    return h;
  }
  function hgt(px, py) {
    let h = hraw(px, py);
    const om = OCMAX; OCMAX = 3; const a0 = hraw(px, py), gG = Math.hypot(hraw(px + NE0, py) - a0, hraw(px, py + NE0) - a0) / NE0; OCMAX = om; // wie gG im Shader
    if (S.plateau < 0.999) { const dP = h - S.plateau, kP = Math.max(0.02, 1.6 * NE0 * gG);""")
rep("const w = Math.max(Math.max(0.5 + (0.03 - 0.5) * S.sharp, 0.22), Math.min(0.5, Math.max(0, NE0 * S.steps / S.amp * 1.5)));",
    "const w = Math.max(Math.max(0.5 + (0.03 - 0.5) * S.sharp, 0.16), Math.min(0.5, 1.6 * NE0 * S.steps * gG / 0.7));")
rep("else { const s = h * S.steps; let f = fract(s); const w = 0.5 + (0.03 - 0.5) * S.sharp; f = sstep(0.5 - w, 0.5 + w, f); h = (Math.floor(s) + f) / S.steps } }",
    "else { const s = h * S.steps; let f = fract(s); const w = Math.max(0.5 + (0.03 - 0.5) * S.sharp, Math.min(0.5, 1.6 * NE0 * S.steps * gG)); f = sstep(0.5 - w, 0.5 + w, f); h = (Math.floor(s) + f) / S.steps } }")
# ---------- fragment: v4 zoning
rep("varying vec3 vW; varying vec3 vN; varying float vH; varying vec4 vSC; varying float vCurv;\n","varying vec3 vW; varying vec3 vN; varying float vH; varying vec4 vSC; varying float vCurv; varying float vCL;\n") if s.count("varying vec3 vW; varying vec3 vN; varying float vH; varying vec4 vSC; varying float vCurv;\n")==1 else None
rep("    if(uOrg>0.5 && uFS>2.5){ vec2 pw=vW.xz+5.0*vec2(",
r"""    // Formlogik v4 (Georg 20.10.: „Flächen mit innerer Logik, die fließen“): Farbe folgt der großen Landform statt Zufallsklecksen –
    // Talbänder fließen entlang der Mulden, Rücken und Kuppen heller, dazwischen der Grundton; Ränder organisch geschwungen, Kleckse nur als leise Variation
    if(uOrg>0.5 && uFS>3.5){ float sd=uSeed.x*0.37+uSeed.y*0.11;
      vec2 pw=vW.xz+8.0*vec2(snoise(vW.xz/120.0+3.7), snoise(vW.xz/120.0-8.3));
      float pert=0.35*snoise(pw/60.0+sd)+0.15*snoise(pw/19.0-sd);
      float cv=vCL/0.022+pert; float fwc=fwidth(cv)*1.2+1e-4;
      float flow=smoothstep(0.55-fwc,0.55+fwc,cv), ridge=smoothstep(0.7-fwc,0.7+fwc,-cv);
      float vrt=cover(blobL(pw+vec2(37.0,-11.0), 64.0, 0.45, 0.26, 0.46, sd+3.1, 0.10, 0.0));
      vec3 o=mid; o=mix(o, o*1.06+0.012, vrt*0.6);
      o=mix(o, mix(sand, low, 0.25), flow); o=mix(o, high, ridge);
      float band=1.0-smoothstep(0.0,0.3,abs(cv-0.55));
      float dts=0.8*cover(blobL(vW.xz, 6.5, 0.6, 0.12, 0.24, sd+1.3, 0.0, 1.0)+(1.0-band)*3.0);   /* Sprenkel nur an Talrändern */
      o=mix(o, mix(o*0.86, cliff, 0.15), dts);
      c = uWater>0.005 ? mix(c, o, smoothstep(uWater+0.03-w, uWater+0.05+w, hn)) : o;
      idc=mix(vec3(0.6), vec3(0.2,0.5,0.9), flow); idc=mix(idc, vec3(0.95,0.8,0.2), ridge); idc=mix(idc, vec3(1.0), dts); }
    else if(uOrg>0.5 && uFS>2.5){ vec2 pw=vW.xz+5.0*vec2(""")
rep('<select id="fstage"><option value="3">Farbflächen v3 (Stand vorher)</option>','<select id="fstage"><option value="4">Formlogik v4: Talbänder, Rücken, Kuppen</option><option value="3">Farbflächen v3 (Kleckse)</option>')
rep("U.uFS = { value: 3 };","U.uFS = { value: 4 };")
rep("surfaceStage: ['B makro', 'C +übergänge', 'D +sprenkel', 'v3'][S.fstage],","surfaceStage: ['B makro', 'C +übergänge', 'D +sprenkel', 'v3', 'v4 formlogik'][S.fstage],")
s=s.replace('kfb-gelaende-probe-4','kfb-gelaende-probe-5')
open(p,'w').write(s); print('ok')
