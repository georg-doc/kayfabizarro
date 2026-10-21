import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:90]}')
    s=s.replace(a,b)
rep('<select id="fstage"><option value="4">Formlogik v4',
    '<select id="fstage"><option value="5">70er Fließfarben (wabernd)</option><option value="4">Formlogik v4')
rep('<div class="row"><label for="fstage">Flächen-Stufe</label>',
    '<div class="row"><label for="flow">Wabern</label><select id="flow"><option value="0">steht</option><option value="0.5">langsam</option><option value="1" selected>mittel</option><option value="2.5">lebhaft</option></select></div>\n        <div class="row"><label for="bands">Banddichte</label><select id="bands"><option value="2.5">breit</option><option value="4" selected>mittel</option><option value="6.5">fein</option></select></div>\n        <div class="row"><label for="fstage">Flächen-Stufe</label>')
rep("S.voxs = +$('voxs').value;","S.flow = +$('flow').value; S.bands = +$('bands').value; S.voxs = +$('voxs').value;")
rep("if (p.voxs != null) $('voxs').value = p.voxs;","if (p.voxs != null) $('voxs').value = p.voxs; if (p.flow != null) $('flow').value = p.flow; if (p.bands != null) $('bands').value = p.bands;")
rep("surfaceStage: ['B makro', 'C +übergänge', 'D +sprenkel', 'v3', 'v4 formlogik'][S.fstage],","surfaceStage: ['B makro', 'C +übergänge', 'D +sprenkel', 'v3', 'v4 formlogik', '70er fliessfarben'][S.fstage], flowSpeed: S.flow, bandDensity: S.bands,")
rep("idx('fstage', ['B makro', 'C +übergänge', 'D +sprenkel', 'v3', 'v4 formlogik'], c.surfaceStage);","idx('fstage', ['B makro', 'C +übergänge', 'D +sprenkel', 'v3', 'v4 formlogik', '70er fliessfarben'], c.surfaceStage); num('flow', c.flowSpeed); num('bands', c.bandDensity);")
rep("U.uFS = { value: 4 };","U.uFS = { value: 5 }; U.uTimeT = { value: 0 }; U.uFlow = { value: 1 }; U.uBands = { value: 4 };")
rep("uniform float uEdges, uFg, uOrg, uFS, uDbg, uKus;","uniform float uEdges, uFg, uOrg, uFS, uDbg, uKus, uTimeT, uFlow, uBands;")
rep("U.uOrg.value = S.org ? 1 : 0;","U.uOrg.value = S.org ? 1 : 0; U.uFlow.value = S.flow; U.uBands.value = S.bands;")
rep("SKY.uTime.value = t;","SKY.uTime.value = t; U.uTimeT.value = t;")
rep("    if(uOrg>0.5 && uFS>3.5){ float sd=uSeed.x*0.37+uSeed.y*0.11;",
r"""    // 70er Fließfarben (Georg 20.10.: „wie fließende Farben, harmonische Rundungen, ineinanderfließend, leicht wabernd – nicht als Höhenband“):
    // mehrfach in sich verbogenes Rauschfeld (Domain Warping nach Quilez), in Farbbänder der Biom-Palette geschnitten; die Verbiegung läuft langsam mit der Zeit
    if(uOrg>0.5 && uFS>4.5){ float sd=uSeed.x*0.37+uSeed.y*0.11; float tt=uTimeT*0.012*uFlow;
      vec2 p=vW.xz/210.0+vec2(sd*0.01, -sd*0.013);
      vec2 q=vec2(snoise(p+vec2(0.0,tt))*0.7+snoise(p*2.1+vec2(3.1,-tt))*0.3, snoise(p+vec2(5.2,1.3)-tt)*0.7+snoise(p*2.1+vec2(-1.7,4.4)+tt)*0.3);
      vec2 r=vec2(snoise(p+1.6*q+vec2(1.7,9.2)+0.5*tt), snoise(p+1.6*q+vec2(8.3,2.8)-0.4*tt));
      float f=snoise(p+1.4*r+vec2(-4.0,6.0))*0.75+0.25*snoise(p*1.9+r);
      float v=f*uBands+0.8*length(q)+tt*0.6; v+=0.22*sin(v*1.7+r.x*2.0);   /* ungleiche Bandbreiten */
      float idx=floor(v), k=fract(v); float aw=fwidth(v)*1.1+1e-4;
      vec3 P0=peak, P1=sand, P2=low, P3=mid, P4=high, P5=mix(water,mid,0.35);
      float i6=mod(idx,6.0), j6=mod(idx+1.0,6.0);
      vec3 ca=i6<0.5?P0:(i6<1.5?P1:(i6<2.5?P2:(i6<3.5?P3:(i6<4.5?P4:P5))));
      vec3 cb=j6<0.5?P0:(j6<1.5?P1:(j6<2.5?P2:(j6<3.5?P3:(j6<4.5?P4:P5))));
      vec3 o=mix(ca, cb, smoothstep(1.0-aw, 1.0, k));                       /* klare, kantenglatte Bandgrenze */
      o=mix(o, mix(ca,cb,0.5), smoothstep(0.25,0.6,aw));                    /* fern: Mischton statt Flimmern */
      c = uWater>0.005 ? mix(c, o, smoothstep(uWater+0.03-w, uWater+0.05+w, hn)) : o;
      idc=o; }
    else if(uOrg>0.5 && uFS>3.5){ float sd=uSeed.x*0.37+uSeed.y*0.11;""")
s=s.replace('kfb-gelaende-probe-5','kfb-gelaende-probe-6')
open(p,'w').write(s); print('ok')
