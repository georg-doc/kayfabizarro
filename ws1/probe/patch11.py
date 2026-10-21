p='gelaende-probe.html'; s=open(p).read()
def rep(a,b):
    global s
    assert a in s, a[:90]; s=s.replace(a,b,1)
rep("""        <div class="row"><label for="soft">Farbbänder</label>""","""        <label class="check"><input type="checkbox" id="org" checked> Farbflächen organisch (ohne Höhenbänder)</label>
        <div class="row"><label for="soft">Farbbänder</label>""")
rep("uniform float uEdges, uFg;","uniform float uEdges, uFg, uOrg;")
rep("    c=mix(c, peak, smoothstep(0.84-w, 0.84+w, hn));\n","""    c=mix(c, peak, smoothstep(0.84-w, 0.84+w, hn));
    // Organische Farbflächen (Georg 19.10., WS0-Design R1): Farbe unabhängig von der Höhe – breite Flächen aus einem eigenen Feld, Grenzen per
    // Domain Warp geschwungen, 4 Rollen; nur das Ufer folgt dem Wasserstand (physisch)
    if(uOrg>0.5){ vec2 wq=vec2(snoise(vW.xz/260.0+3.7), snoise(vW.xz/260.0-8.3))*0.65; vec2 q=vW.xz/95.0+wq+uSeed*0.013;
      float a=snoise(q)*0.65+snoise(q*2.03+5.1)*0.35, b=snoise(q*0.8+vec2(13.0,-7.0))*0.65+snoise(q*1.7+vec2(-4.0,2.0))*0.35;
      float aw=fwidth(a)*1.2+1e-4, bw=fwidth(b)*1.2+1e-4;
      vec3 o=mix(mid, low, smoothstep(-aw,aw,a)); o=mix(o, high, smoothstep(0.22-bw,0.22+bw,b)); o=mix(o, sand, 1.0-smoothstep(-0.5-bw,-0.5+bw,b));
      c = uWater>0.005 ? mix(c, o, smoothstep(uWater+0.03-w, uWater+0.05+w, hn)) : o; }
""")
rep("    vec3 cl=cliff;\n","""    vec3 cl=cliff;
    if(uOrg>0.5){ vec2 wc=abs(vN.x)>abs(vN.z) ? vec2(vW.z,vW.y) : vec2(vW.x,vW.y); float wb=snoise(wc/38.0+vec2(31.0,7.0)); float wbw=fwidth(wb)*1.2+1e-4;
      cl=mix(cliff, mix(cliff, high, 0.45), smoothstep(-wbw, wbw, wb)); }   // Wände: eigenes Feld entlang der Wand (Wand-Projektion), nicht nach Höhe
""")
rep("U.uEdges = { value: 1 }; U.uFg = { value: 1 };","U.uEdges = { value: 1 }; U.uFg = { value: 1 }; U.uOrg = { value: 1 };")
rep("'crumbs', 'fgmass', 'edges'];","'crumbs', 'fgmass', 'edges', 'org'];")
rep("U.uEdges.value = S.edges ? 1 : 0; U.uFg.value = S.fgmass ? 1 : 0;","U.uEdges.value = S.edges ? 1 : 0; U.uFg.value = S.fgmass ? 1 : 0; U.uOrg.value = S.org ? 1 : 0;")
rep("color: { biome: S.palA,","color: { organicFields: S.org, biome: S.palA,")
open(p,'w').write(s); print('ok')
