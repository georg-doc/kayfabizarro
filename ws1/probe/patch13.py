import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:80]}')
    s=s.replace(a,b)
# UI
rep('''<label class="check"><input type="checkbox" id="org" checked> Farbflächen organisch (ohne Höhenbänder)</label>''',
'''<label class="check"><input type="checkbox" id="org" checked> Farbflächen organisch (ohne Höhenbänder)</label>
        <div class="row"><label for="fstage">Flächen-Stufe</label><select id="fstage"><option value="2">C+D: große Flächen + Übergänge + Sprenkel</option><option value="1">C: große Flächen + Übergänge</option><option value="0">B: nur große Flächen</option></select></div>
        <div class="row"><label for="dbg">Prüfansicht</label><select id="dbg"><option value="0">Endbild</option><option value="1">nur Grundfarbe (ohne Licht/Schatten)</option><option value="2">graue Form (nur Licht)</option><option value="3">Material-Masken</option></select></div>''')
rep("S.gtex = +$('gtex').value;","S.gtex = +$('gtex').value; S.fstage = +$('fstage').value; S.dbg = +$('dbg').value;")
rep("if (p.gtex != null) $('gtex').value = p.gtex;","if (p.gtex != null) $('gtex').value = p.gtex; if (p.fstage != null) $('fstage').value = p.fstage; if (p.dbg != null) $('dbg').value = p.dbg;")
rep("U.uOrg.value = S.org ? 1 : 0;","U.uOrg.value = S.org ? 1 : 0; U.uFS.value = S.fstage; U.uDbg.value = S.dbg;")
rep("U.uOrg = { value: 1 };","U.uOrg = { value: 1 }; U.uFS = { value: 2 }; U.uDbg = { value: 0 };")
rep("uniform float uEdges, uFg, uOrg;","uniform float uEdges, uFg, uOrg, uFS, uDbg;")
rep("color: { organicFields: S.org,","color: { organicFields: S.org, surfaceStage: ['B makro', 'C +übergänge', 'D +sprenkel'][S.fstage],")
# new field grammar
a=s.index('    if(uOrg>0.5){ vec2 pw=vW.xz+5.0*vec2(')
b=s.index('    // Bühnen-Farbring')
s=s[:a]+'''    // Flächengrammatik (Georg 20.10. + Perplexity-Feedback): Makro entscheidet WO ein Material liegt, Meso formt Kontur/Übergang, Mikro ändert die
    // Lesbarkeit nicht. Übergang = eigenes Band um die Grenze (|d| < w): dort Gegeninseln des Nachbarmaterials und Sprenkel, sonst Ruhe.
    vec3 idc=vec3(0.5); float shoreK=0.0;
    if(uOrg>0.5){ vec2 pw=vW.xz+6.0*vec2(snoise(vW.xz/90.0+3.7), snoise(vW.xz/90.0-8.3))+1.5*vec2(snoise(vW.xz/23.0+1.1), snoise(vW.xz/23.0-4.4)); float sd=uSeed.x*0.37+uSeed.y*0.11;
      float dM=blobL(pw, 120.0, 0.6, 0.32, 0.5, sd, 0.10, 0.0);                          // Makro: zweites Material (low) auf dem Grundton (mid)
      float mat=cover(dM);
      float band=1.0-smoothstep(0.0, 10.0, abs(dM));                                       // Übergangszone um die Grenze
      float isl=0.0, dry=0.0, dots=0.0, var=0.0;
      if(uFS>0.5){
        isl=cover(blobL(pw+vec2(5.0,-3.0), 13.0, 0.6, 0.18, 0.36, sd+4.4, 0.10, 0.0)+(1.0-band)*7.0);   // Gegeninseln: schrumpfen weich aus dem Band heraus (keine Schnittkante)
        mat=mix(mat, 1.0-mat, isl);
        var=cover(blobL(pw+vec2(37.0,-11.0), 64.0, 0.45, 0.26, 0.46, sd+3.1, 0.10, 0.0));            // Meso: Tonvariation INNERHALB des Materials, schwach
        float top=smoothstep(0.42, 0.72, hn);                                                          // Ursache: trockene Kuppen oben
        dry=cover(blobL(pw+vec2(-9.0,23.0), 30.0, 0.55, 0.24, 0.44, sd+7.7, 0.08, 0.0)+(1.0-top)*12.0);
      }
      vec3 o=mix(mid, low, mat);
      o=mix(o, o*1.07+0.015, var*0.7);                                                                // gleicher Farbton, nur leicht heller
      o=mix(o, mix(o, sand, 0.7), dry);
      if(uFS>1.5){ float bd=1.0-smoothstep(0.0, 14.0, abs(dM));                                       // Sprenkel nur an Grenzen und Kuppenrändern, in Nestern
        float edgeDry=1.0-smoothstep(0.0, 1.0, abs(hn-0.5)*8.0);
        dots=0.85*cover(blobL(vW.xz, 6.5, 0.6, 0.12, 0.24, sd+1.3, 0.0, 1.0)+(1.0-max(bd, edgeDry*0.7))*3.0);
        o=mix(o, mix(o*0.84, cliff, 0.18), dots); }
      // Ufer: kein heller Saum – schmale dunklere Kontaktkante, feuchte Abschnitte nur stellenweise
      if(uWater>0.005){ float seg=smoothstep(-0.1, 0.4, snoise(vW.xz/45.0+sd)); shoreK=(1.0-smoothstep(uWater+0.004, uWater+0.022+0.02*seg, hn));
        o=mix(o, mix(o*0.7, water, 0.25), shoreK*(0.45+0.55*seg)); }
      c=o;
      idc=mix(vec3(0.95,0.85,0.2), vec3(0.15,0.45,0.85), mat); idc=mix(idc, vec3(0.9,0.3,0.2), dry); idc=mix(idc, vec3(1.0), dots*0.9); idc=mix(idc, vec3(0.1,0.8,0.8), shoreK); idc=mix(idc, idc*0.75, var*0.5);
      idc=mix(idc, vec3(0.6,0.2,0.75), band*0.25); }
'''+s[b:]
rep("    vec3 L=normalize(vec3(-0.55,0.75,0.35)); float l=max(dot(N,L),0.0);",
"""    vec3 alb=c; if(uDbg>1.5 && uDbg<2.5) c=vec3(0.72);
    vec3 L=normalize(vec3(-0.55,0.75,0.35)); float l=max(dot(N,L),0.0);""")
rep("    gl_FragColor=vec4(mix(col, sky, f),1.0);\n  }`;",
"""    if(uDbg>0.5 && uDbg<1.5) col=alb; if(uDbg>2.5) col=idc;   // Prüfansichten (gleiche Kamera): Grundfarbe · graue Form · Masken
    gl_FragColor=vec4(mix(col, sky, f),1.0);
  }`;""")
open(p,'w').write(s); print('ok')
