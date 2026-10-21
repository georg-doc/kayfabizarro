p='gelaende-probe.html'; s=open(p).read()
def rep(a,b):
    global s
    assert a in s, a[:90]; s=s.replace(a,b,1)
rep("""        <label class="check"><input type="checkbox" id="props" checked> Bäume und Büsche in Gruppen</label>""",
"""        <label class="check"><input type="checkbox" id="props" checked> Bäume und Büsche in Gruppen</label>
        <label class="check"><input type="checkbox" id="ground" checked> Erdung: dunkler Bodenkontakt + Kronen-Unterseiten</label>
        <label class="check"><input type="checkbox" id="shadows" checked> Echte 3D-Schatten (im Palettenton)</label>""")
rep("  uniform vec2 uOffset; uniform vec2 uCarW; uniform float uHole, uDrop, uNE; varying vec3 vW; varying vec3 vN; varying float vH;",
    "  uniform vec2 uOffset; uniform vec2 uCarW; uniform float uHole, uDrop, uNE; uniform mat4 uShadowM; varying vec3 vW; varying vec3 vN; varying float vH; varying vec4 vSC;")
rep("    gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position.x,y,position.z,1.0);\n  }`;\n  const frag",
    "    vec4 wp4=modelMatrix*vec4(position.x,y,position.z,1.0); vSC=uShadowM*wp4;\n    gl_Position=projectionMatrix*viewMatrix*wp4;\n  }`;\n  const frag")
rep("""  varying vec3 vW; varying vec3 vN; varying float vH;
  vec3 pick(vec3 a, vec3 b, float t){ return mix(a,b,t); }""","""  uniform sampler2D uShadowMap; uniform float uShadowOn; uniform vec3 uContact;
  varying vec3 vW; varying vec3 vN; varying float vH; varying vec4 vSC;
  #include <packing>
  vec3 pick(vec3 a, vec3 b, float t){ return mix(a,b,t); }
  float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float sminK(float a, float b, float k){ float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0); return mix(b,a,h)-k*h*(1.0-h); }
  // Ringkante ohne Naht: Rauschen über die Richtung (Einheitsvektor) statt über den Winkel
  float ringE(vec2 p){ vec2 d2=p-uDio.xy; float r=length(d2); vec2 dir=d2/max(r,1e-3); float tz=snoise(dir*2.2+vec2(21.0,4.0))*0.65+snoise(dir*5.1+vec2(-3.0,9.0))*0.35; return (r-uDio.z)-4.5*(1.0+0.7*tz); }""")
i=s.index("    // Bühnen-Farbring mit Zungen und Sprenkeln"); j=s.index("    float slope=1.0-vN.y; float cw=0.01+0.05*uSoft;")
s=s[:i]+"""    // Bühnen-Farbring: organische Kante + Tropfen in beide Richtungen, die weich mit der Kante verschmelzen (smooth-min, eine Distanzfunktion,
    // je Fleck die 3×3 Nachbarzellen → nie an Zellgrenzen abgeschnitten); Größen schief verteilt (viele kleine, wenige große), Form gedreht/gestreckt/gewellt,
    // Dichte nimmt mit dem Abstand zur Kante ab
    if(uRing>0.5 && uDioB.x>0.5){ vec2 d2=vW.xz-uDio.xy; if(length(d2)-uDio.z<16.0){
      float d=ringE(vW.xz);
      for(int L=0; L<2; L++){ float cs=L==0?2.4:1.15; vec2 b=floor(vW.xz/cs);
        for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){ vec2 cell=b+vec2(float(i),float(j)); float fl=float(L);
          float h1=h21(cell+fl*17.3), h2=h21(cell*1.37+5.1+fl), h3=h21(cell*2.11-3.7+fl*3.0), h4=h21(cell*0.73+11.0+fl);
          vec2 cc=(cell+0.5+(vec2(h1,h2)-0.5)*0.85)*cs; float ec=ringE(cc);
          if(h3>exp(-abs(ec)/(2.0+1.5*fl))*0.85) continue;
          float rad=cs*(0.14+0.32*h4*h4); vec2 q=vW.xz-cc; float ca=cos(h1*6.283), sa=sin(h1*6.283); q=vec2(ca*q.x-sa*q.y, sa*q.x+ca*q.y); q.x*=0.75+0.5*h2;
          float sd=length(q)*(1.0+0.12*sin(3.0*atan(q.y,q.x)+h3*6.283))-rad, kk=0.55*rad+0.25;
          d = ec>0.0 ? sminK(d, sd, kk) : -sminK(-d, -sd, kk); } }
      float dw=fwidth(d)+1e-4; c=mix(c, mix(sand, peak, 0.25), 1.0-smoothstep(-dw,dw,d)); } }
"""+s[j:]
rep("    gl_FragColor=vec4(mix(col, sky, f),1.0);\n  }`;","""    if(uShadowOn>0.5){ vec3 sc=vSC.xyz/vSC.w; if(sc.x>0.0 && sc.x<1.0 && sc.y>0.0 && sc.y<1.0 && sc.z<1.0){ float sv=0.0; vec2 tx=vec2(1.0/2048.0);
      for(int i=-1;i<=1;i++) for(int j=-1;j<=1;j++) sv+=step(sc.z-0.0015, unpackRGBAToDepth(texture2D(uShadowMap, sc.xy+vec2(float(i),float(j))*tx)));
      sv=smoothstep(0.2,0.8,sv/9.0); col=mix(mix(col*0.62, uContact, 0.38), col, sv); } }   // echter Schatten, eingefärbt (kein Schwarz)
    gl_FragColor=vec4(mix(col, sky, f),1.0);
  }`;""")
rep("U.uGFill = { value: 0 }; U.uGCol = { value: 0 }; U.uClay = { value: 0 }; U.uGTex = { value: 0 }; U.uRing = { value: 1 };",
    "U.uGFill = { value: 0 }; U.uGCol = { value: 0 }; U.uClay = { value: 0 }; U.uGTex = { value: 0 }; U.uRing = { value: 1 };\n  U.uShadowMap = { value: null }; U.uShadowM = { value: new THREE.Matrix4() }; U.uShadowOn = { value: 1 }; U.uContact = { value: new THREE.Color('#5a3b33') };")
rep("  const sun = new THREE.DirectionalLight('#fff4e6', 1.35); sun.position.set(-55, 75, 35); scene.add(sun);\n",
"""  const sun = new THREE.DirectionalLight('#fff4e6', 1.35); sun.position.set(-55, 75, 35); scene.add(sun);
  // Echte Schatten: Sonne als einziger Schattenwerfer, Ausschnitt 140 m um das Fahrzeug (Szene-Ursprung = Fahrzeug); der Boden liest die Karte selbst
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap; scene.add(sun.target);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -70, right: 70, top: 70, bottom: -70, near: 5, far: 400 }); sun.shadow.bias = -0.0005;
  sun.position.set(-55, 75, 35).normalize().multiplyScalar(160); sun.shadow.camera.updateProjectionMatrix();
""")
rep("  const loadG = (url) => loader.loadAsync(url).then((g) => g.scene);","""  // Erdung (Grounding): unten am Objekt und an nach unten gerichteten Flächen (Kronen-Unterseiten) dunkler im Kontaktton der Palette, nie schwarz;
  // die Bodenhöhe kommt aus derselben Höhenformel wie das Gelände (im Vertex-Shader)
  const GU = { uScale: U.uScale, uAmp: U.uAmp, uOct: U.uOct, uRidge: U.uRidge, uWarp: U.uWarp, uMacro: U.uMacro, uValley: U.uValley, uPlateau: U.uPlateau, uSteps: U.uSteps, uSharp: U.uSharp, uSeed: U.uSeed, uDio: U.uDio, uDioB: U.uDioB, uContact: U.uContact, uGOff: { value: new THREE.Vector2() }, uGBand: { value: 0.8 }, uGOn: { value: 1 } };
  window.__GU = GU;
  function addGrounding(mat) { const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
    mat.onBeforeCompile = (sh, r) => { if (prev) prev.call(mat, sh, r); Object.assign(sh.uniforms, GU)
      sh.vertexShader = GLSL_NOISE + '\\n' + GLSL_HEIGHT + '\\nuniform vec2 uGOff; varying float vGA; varying float vGD;\\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\\n  { vec3 wpG = (modelMatrix * vec4(transformed, 1.0)).xyz; vGA = wpG.y - hgt(wpG.xz + uGOff); vGD = normalize(mat3(modelMatrix) * objectNormal).y; }')
      sh.fragmentShader = 'uniform vec3 uContact; uniform float uGBand, uGOn; varying float vGA; varying float vGD;\\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
  if (uGOn > 0.5) { vec3 cc = mix(diffuseColor.rgb * 0.55, uContact, 0.45); diffuseColor.rgb = mix(cc, diffuseColor.rgb, smoothstep(0.0, uGBand, vGA)); diffuseColor.rgb = mix(diffuseColor.rgb, cc, smoothstep(0.1, -0.7, vGD) * 0.45); }`) }
    mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|kfb-ground'; mat.needsUpdate = true }
  const loadG = (url) => loader.loadAsync(url).then((g) => g.scene);""")
rep("o.material = o.material.clone(); o.material.userData.base = o.material.color.clone() } })",
    "o.material = o.material.clone(); o.material.userData.base = o.material.color.clone(); addGrounding(o.material) } })")
rep("    .then(() => { if (amph) {","    .then(() => { amph?.traverse((o) => { if (o.isMesh) [].concat(o.material).forEach(addGrounding) }); if (amph) {")
rep("scn.traverse((m) => { if (m.isMesh) m.frustumCulled = false }); cache.set(info.id, scn);","scn.traverse((m) => { if (m.isMesh) { m.frustumCulled = false; m.castShadow = true } }); cache.set(info.id, scn);")
rep("'dio', 'dpal', 'berm', 'ring', 'stones', 'props'];","'dio', 'dpal', 'berm', 'ring', 'stones', 'props', 'ground', 'shadows'];")
rep("U.uGTex.value = S.gtex; U.uRing.value = S.ring ? 1 : 0;","U.uGTex.value = S.gtex; U.uRing.value = S.ring ? 1 : 0; U.uShadowOn.value = S.shadows ? 1 : 0; renderer.shadowMap.enabled = !!S.shadows; sun.castShadow = !!S.shadows; U.uContact.value.set(PALETTES[S.palA].cliff).multiplyScalar(0.55); if (window.__GU) window.__GU.uGOn.value = S.ground ? 1 : 0;")
rep("diorama: { on: S.dio, palette: S.dpal, plinthAndBerm: S.berm, colourRingSpeckle: S.ring, stoneBand: S.stones, props: S.props },",
    "diorama: { on: S.dio, palette: S.dpal, plinthAndBerm: S.berm, colourRingSpeckle: S.ring, stoneBand: S.stones, props: S.props, grounding: S.ground, realShadows: S.shadows },")
rep("    U.uCam.value.copy(camera.position);\n    renderer.render(scene, camera);",
    "    U.uCam.value.copy(camera.position); GU.uGOff.value.set(P.x, P.z); GU.uGOn.value = S.ground ? 1 : 0;\n    if (S.shadows) { sun.updateMatrixWorld(); sun.target.updateMatrixWorld(); sun.shadow.updateMatrices(sun); U.uShadowM.value.copy(sun.shadow.matrix); U.uShadowMap.value = sun.shadow.map ? sun.shadow.map.texture : null }\n    renderer.render(scene, camera);")
open(p,'w').write(s); print('ok', len(s))
