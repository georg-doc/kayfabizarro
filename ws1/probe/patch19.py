import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:90]}')
    s=s.replace(a,b)

# ---- UI
rep('<label class="check"><input type="checkbox" id="painted" checked> Gemalte Wolken auf der Kuppel</label>',
'''<label class="check"><input type="checkbox" id="sky2" checked> Himmel v2 (R13): Verlauf, Bodendunst, Nebel = Himmelsfarbe</label>
        <label class="check"><input type="checkbox" id="kul" checked> Kulissen am Horizont (3 Silhouettenringe)</label>
        <div class="row"><label for="moon">Himmelskörper</label><select id="moon"><option value="1">Knet-Riesenmond</option><option value="2">Ringplanet (Knete)</option><option value="0">keiner</option></select></div>
        <label class="check"><input type="checkbox" id="painted" checked> Gemalte Wolken auf der Kuppel</label>''')
rep("'org', 'ether', 'rockc'];","'org', 'ether', 'rockc', 'sky2', 'kul'];")
rep("S.kus = +$('kus').value;","S.kus = +$('kus').value; S.moon = +$('moon').value;")
rep("if (p.kus != null) $('kus').value = p.kus;","if (p.kus != null) $('kus').value = p.kus; if (p.moon != null) $('moon').value = p.moon;")
rep("color: { polkaDot:","sky: { v2: S.sky2, backdrops: S.kul, body: ['keiner', 'knet-mond', 'ringplanet'][S.moon] }, color: { polkaDot:")

# ---- shared sky GLSL (string), placed before vert
rep("  const vert = `${GLSL_NOISE}\\n${GLSL_HEIGHT}",
r"""  // Himmel v2 (R13 H1–H6, H19): EINE Himmelsfunktion für Kuppel, Gelände, Wasser und Kulissen → Nebel = Himmel in Blickrichtung, kein Balken
  const GLSL_SKY = `
  uniform vec3 uZenith, uSkyMid, uSkyGround, uSunDir, uSunCol, uAntiTint, uAirTint; uniform float uHzGlow, uSunHalo, uSky2, uFogB, uFogHa, uFogHb, uEdgeR;
  vec3 skyColor(vec3 d){
    float y=d.y;
    vec3 up=mix(uHorizon, uSkyMid, smoothstep(0.0,0.208,y)); up=mix(up, uZenith, smoothstep(0.208,0.82,y));
    vec3 dn=mix(uHorizon, uSkyGround, smoothstep(0.0,0.174,-y));            /* Bodendunst 0° … −10° statt Fläche (H5) */
    vec3 c=y>=0.0 ? up : dn;
    c+=uHzGlow*exp(-abs(y)*20.0)*uHorizon;                                    /* Horizont = hellste Linie (H2) */
    float sd=dot(d,uSunDir);
    c=mix(c, uSunCol, uSunHalo*pow(max(sd,0.0),8.0)*(1.0-smoothstep(0.0,0.6,y)));   /* Sonnenhof (H1) */
    c*=mix(vec3(1.0), uAntiTint, 0.5*max(-sd,0.0));                          /* Gegenseite kühler */
    return c;
  }
  vec3 applyAir(vec3 col, vec3 wp, float ndl){
    vec3 v=wp-cameraPosition; float t=max(length(v),1e-3); vec3 rd=v/t;
    float fd=1.0-exp(-t*uFogB);                                               /* exponentiell (H7) */
    float ry=sign(rd.y)*max(abs(rd.y),1e-3);
    float fh=(uFogHa/uFogHb)*exp(-cameraPosition.y*uFogHb)*(1.0-exp(-t*ry*uFogHb))/ry;   /* Höhennebel (H8) */
    float f=1.0-(1.0-fd)*exp(-max(fh,0.0));
    f=clamp(f*mix(1.0,1.2,1.0-ndl),0.0,1.0);                                 /* Schattenseiten mehr Luft (H11) */
    f=max(f, smoothstep(uEdgeR*0.85, uEdgeR, length(v.xz)));                  /* Geländekante verschwindet im Himmel (H13) */
    vec3 sky=skyColor(rd); vec3 air=mix(mix(sky,uAirTint,0.35), sky, smoothstep(0.3,0.9,f));   /* farbige Staffel (H9) */
    return mix(col, air, f);
  }`;
  const vert = `${GLSL_NOISE}\n${GLSL_HEIGHT}""")

# ---- uniforms (before RINGS copies U)
rep("U.uFS = { value: 3 }; U.uKus = { value: 0 };",
"U.uFS = { value: 3 }; U.uKus = { value: 0 }; Object.assign(U, { uZenith: { value: new THREE.Color() }, uSkyMid: { value: new THREE.Color() }, uSkyGround: { value: new THREE.Color() }, uSunDir: { value: new THREE.Vector3(-0.55, 0.75, 0.35).normalize() }, uSunCol: { value: new THREE.Color() }, uAntiTint: { value: new THREE.Color(0.92, 0.95, 1.0) }, uAirTint: { value: new THREE.Color() }, uHzGlow: { value: 0.06 }, uSunHalo: { value: 0.35 }, uSky2: { value: 1 }, uFogB: { value: 0.003 }, uFogHa: { value: 0.004 }, uFogHb: { value: 0.06 }, uEdgeR: { value: 292 }, uMoon: { value: 1 }, uMoonDir: { value: new THREE.Vector3() } });")

# ---- terrain fragment: include sky + use applyAir at the end
fragstart=s.index("uniform float uScale, uAmp, uWater, uSoft, uCliff,")
# insert GLSL_SKY after the line that declares uHorizon in terrain frag
rep("uniform vec3 uDio; uniform vec4 uDioB;" if False else "uniform vec2 uOffset; uniform vec3 uTint, uHorizon;","uniform vec2 uOffset; uniform vec3 uTint, uHorizon; uniform vec2 uCarW;\n  ${GLSL_SKY}") if "uniform vec2 uOffset; uniform vec3 uTint, uHorizon;" in s else None
rep("""    if(uDbg>0.5 && uDbg<1.5) col=alb; if(uDbg>2.5) col=idc;   // Prüfansichten (gleiche Kamera): Grundfarbe · graue Form · Masken
    gl_FragColor=vec4(mix(col, sky, f),1.0);""",
"""    if(uDbg>0.5 && uDbg<1.5) col=alb; if(uDbg>2.5) col=idc;   // Prüfansichten (gleiche Kamera): Grundfarbe · graue Form · Masken
    if(uSky2>0.5 && uGridWorld<0.5) gl_FragColor=vec4(applyAir(col, vW-vec3(uCarW.x,0.0,uCarW.y), l),1.0); else gl_FragColor=vec4(mix(col, sky, f),1.0);""")
open(p,'w').write(s); print('ok1')
