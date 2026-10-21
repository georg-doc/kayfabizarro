import sys,re
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:90]}')
    s=s.replace(a,b)
# UI options
rep('<option value="1">Kürbis: Gelb mit schwarzen Punkten</option><option value="2">Infinity: Rot mit weißen Punkten</option><option value="3">Biom-Töne als Punkte</option>',
    '<option value="1">Punkte in Biom-Farben</option><option value="2">Konfetti in Biom-Farben (heller Grund)</option><option value="3">Infinity-Netz (dicht, klein)</option>')
rep("polkaDot: ['aus', 'kuerbis', 'infinity', 'biom'][S.kus],","polkaDot: ['aus', 'biom', 'konfetti', 'netz'][S.kus],")
# shared dot GLSL
rep("  const vert = `${GLSL_NOISE}\\n${GLSL_HEIGHT}",
r"""  // Polka-Dot-Schicht (Kusama-Hommage, Georg 20.10.): zwei Punktgrößen auf gedrehten, leicht verbogenen 3D-Gittern (keine Reihen sichtbar),
  // Kugeln im Raum werden von jeder Fläche angeschnitten → runde Punkte auch auf Steinen, Bäumen, Hängen; Bedeckung ca. 35–45 %
  const GLSL_KUS = `
  float khash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec2 kusLayer(vec3 wp, float cs, mat3 R, float r0, float r1, float sd){
    vec3 P=R*(wp/cs); P+=0.32*vec3(snoise(wp.xz/(cs*7.0)+sd), snoise(wp.zy/(cs*7.0)-sd), snoise(wp.yx/(cs*7.0)+sd*1.7));
    vec3 cl=floor(P); vec3 fp=fract(P)-0.5; float h1=khash(cl.xz+cl.y*7.13+sd), h2=khash(cl.zy*1.31+3.3+sd), h3=khash(cl.yx*0.71-1.7+sd);
    vec3 o=(vec3(h1,h2,h3)-0.5)*0.07; float rad=mix(r0,r1,h1);
    return vec2((length(fp-o)-rad)*cs, h2); }
  // .x Bedeckung 0..1 (kantenglatt), .y Farbwahl 0..1, .z 1 = großer Punkt
  vec3 kusDots(vec3 wp, float mode){
    mat3 RA=mat3(0.80,0.36,-0.48, -0.20,0.91,0.36, 0.56,-0.20,0.80), RB=mat3(0.62,-0.55,0.56, 0.71,0.70,-0.05, -0.36,0.45,0.82);
    float csA=mode>2.5?1.05:3.1, csB=mode>2.5?0.0:1.3;
    vec2 A=kusLayer(wp, csA, RA, mode>2.5?0.40:0.30, mode>2.5?0.47:0.47, 11.0);
    float aw=fwidth(A.x)+1e-4; float cA=1.0-smoothstep(-aw,aw,A.x); float sel=A.y, big=1.0;
    if(csB>0.0){ vec2 B=kusLayer(wp, csB, RB, 0.22, 0.42, 37.0); float bw=fwidth(B.x)+1e-4; float cB=(1.0-smoothstep(-bw,bw,B.x))*smoothstep(0.08,0.2,A.x);
      if(cB>cA){ sel=B.y; big=0.0; } cA=max(cA,cB); }
    float far=smoothstep(0.12,0.45,aw/max(csA,0.5)); cA=mix(cA, mode>2.5?0.5:0.36, far);   /* fern: Mischton statt Flimmern */
    return vec3(cA, sel, big); }`;
  const vert = `${GLSL_NOISE}\n${GLSL_HEIGHT}""")
# terrain: include + apply into albedo before lighting; remove old block
rep("  ${GLSL_SKY}\n  ${palUniforms}","  ${GLSL_SKY}\n  ${GLSL_KUS}\n  ${palUniforms}")
a=s.index("    // Polka-Dot-Welt (Kusama-Hommage, Georg 20.10.): Punkte sind Kugeln im Raum")
b=s.index("col=mix(kb, kd, pdot)*clayTone*(0.7+0.4*lt); }")+len("col=mix(kb, kd, pdot)*clayTone*(0.7+0.4*lt); }")
s=s[:a]+s[b:]
rep("    vec3 alb=c; if(uDbg>1.5 && uDbg<2.5) c=vec3(0.72);",
r"""    if(uKus>0.5){ vec3 kd=kusDots(vW, uKus); float lum=dot(c,vec3(0.299,0.587,0.114));
      vec3 light=mix(peak, vec3(1.0), 0.55), dark=mix(cliff, low, 0.3)*0.62;
      if(uKus>1.5 && uKus<2.5){ vec3 pc=kd.y<0.2?low:(kd.y<0.4?mid:(kd.y<0.6?water*1.1:(kd.y<0.8?high:cliff))); c=mix(mix(sand, vec3(1.0), 0.6), pc*1.05, kd.x); }   /* Konfetti: Biom-Farben auf hellem Grund */
      else { vec3 dc=lum>0.5 ? dark : light; c=mix(c, dc, kd.x); } }
    vec3 alb=c; if(uDbg>1.5 && uDbg<2.5) c=vec3(0.72);""")
# rocks: drop solid override
rep("; if (S.kus) ROCKC.mat.color.copy(U.uKusB.value)","")
# props via grounding: world-pos varying + dots
rep("const GU = { uScale: U.uScale,","const GU = { uKus: U.uKus, uScale: U.uScale,")
rep("'\\nuniform vec2 uGOff; varying float vGA; varying float vGD;\\n'","'\\nuniform vec2 uGOff; varying float vGA; varying float vGD; varying vec3 vKW;\\n'")
rep("vGA = wpG.y - hgt(wpG.xz + uGOff);","vKW = wpG + vec3(uGOff.x, 0.0, uGOff.y); vGA = wpG.y - hgt(wpG.xz + uGOff);")
rep("sh.fragmentShader = 'uniform vec3 uContact; uniform float uGBand, uGOn; varying float vGA; varying float vGD;\\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>",
    "sh.fragmentShader = 'uniform vec3 uContact; uniform float uGBand, uGOn, uKus; varying float vGA; varying float vGD; varying vec3 vKW;\\n' + GLSL_NOISE + GLSL_KUS + '\\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\n  if (uKus > 0.5) { vec3 kd = kusDots(vKW, uKus > 2.5 ? 3.0 : 1.0); float lum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114)); vec3 dc = lum > 0.45 ? diffuseColor.rgb * 0.35 : mix(diffuseColor.rgb, vec3(1.0), 0.8); diffuseColor.rgb = mix(diffuseColor.rgb, dc, kd.x); }")
open(p,'w').write(s); print('ok')
