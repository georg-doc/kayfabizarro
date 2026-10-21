import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:80]}')
    s=s.replace(a,b)
rep("""  const puffMat = new THREE.MeshToonMaterial({ color: '#ffffff', gradientMap: gm, emissive: '#000000' });
  const PUFF = []; let prng = 9; const rnd = () => { prng = (prng * 16807) % 2147483647; return prng / 2147483647 };
  for (let c = 0; c < 26; c++) { const cx = rnd() * 1200, cz = rnd() * 1200, cy = rnd(), size = 14 + rnd() * 22, n = 5 + Math.floor(rnd() * 5)
    for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2 + rnd(), rr = size * (0.25 + rnd() * 0.55); PUFF.push({ cx, cz, cy, ox: Math.cos(a) * rr, oz: Math.sin(a) * rr * 0.6, oy: rnd() * size * 0.25, r: size * (0.35 + rnd() * 0.3) * (k === 0 ? 1.3 : 1) }) } }
  const puffs = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), puffMat, PUFF.length); puffs.frustumCulled = false; scene.add(puffs);""",
r"""  // Knet-Wolken v2 (Georg 20.10.: „wie die gemalten Kuppelwolken“; R13 H18): flacher Boden, Kuppe, Mitte am größten; gemalt in Licht-/Schattenton der Stimmung,
  // dunklere Unterseite + leichte Randlinie, Puffs atmen langsam (Fließ-Logik), Ferne geht in die Himmelsfarbe über
  const puffMat = new THREE.ShaderMaterial({ uniforms: Object.assign({}, SKY, { uHorizon: U.uHorizon, uTimeP: { value: 0 }, uLitC: SKY.uLit, uShadeC: SKY.uShade, uFar: { value: 2400 } }),
    vertexShader: `${GLSL_NOISE}
    attribute float aBase; uniform float uTimeP; varying vec3 vWp; varying vec3 vNw; varying float vBase;
    void main(){ vec3 p=position; vec3 n=normal;
      float w=snoise(n.xz*1.7+vec2(uTimeP*0.05, aBase*0.01))*0.08+snoise(n.xy*3.1-uTimeP*0.04)*0.04; p+=n*w;   /* langsames Quellen */
      p.y=max(p.y,-0.3);                                                                                        /* flacher Boden je Puff */
      vec4 wp=modelMatrix*instanceMatrix*vec4(p,1.0); vWp=wp.xyz; vNw=normalize(mat3(modelMatrix)*mat3(instanceMatrix)*(p.y<=-0.299?vec3(0.0,-1.0,0.0):n)); vBase=aBase;
      gl_Position=projectionMatrix*viewMatrix*wp; }`,
    fragmentShader: `uniform vec3 uHorizon; ${GLSL_SKY}
    uniform vec3 uLitC, uShadeC; uniform float uFar; varying vec3 vWp; varying vec3 vNw; varying float vBase;
    void main(){ vec3 n=normalize(vNw); vec3 vd=normalize(cameraPosition-vWp);
      float l=dot(n,uSunDir)*0.5+0.5; float ls=l*3.0; l=(floor(ls)+smoothstep(0.0,0.2,fract(ls)))/3.0;      /* drei gemalte Töne */
      vec3 shade=mix(uShadeC, uSkyMid, 0.35), col=mix(shade, uLitC, l);
      col=mix(col, shade*0.88, smoothstep(6.0,0.0,vWp.y-vBase)*0.75);                                          /* dunklere Unterseite */
      float rim=1.0-abs(dot(n,vd)); col=mix(col, shade*0.82, smoothstep(0.72,0.9,rim)*0.55);                  /* Randlinie wie die Kuppelwolken */
      float d=length(vWp-cameraPosition); col=mix(col, skyColor(normalize(vWp-cameraPosition)), smoothstep(uFar*0.3,uFar,d));
      gl_FragColor=vec4(col,1.0); }` });
  const PUFF = []; let prng = 9; const rnd = () => { prng = (prng * 16807) % 2147483647; return prng / 2147483647 };
  for (let c = 0; c < 26; c++) { const cx = rnd() * 1200, cz = rnd() * 1200, cy = rnd(), size = 16 + rnd() * 24, n = 7 + Math.floor(rnd() * 6), stretch = 1.3 + rnd() * 0.8
    for (let k = 0; k < n; k++) { const a = rnd() * Math.PI * 2, dist = k === 0 ? 0 : size * (0.25 + rnd() * 0.6), r = size * (0.62 - 0.38 * (dist / size)) * (0.85 + rnd() * 0.3)   /* Mitte groß, außen klein */
      PUFF.push({ cx, cz, cy, ox: Math.cos(a) * dist * stretch, oz: Math.sin(a) * dist * 0.7, oy: r * 0.3, r }) } }   /* oy = r·0,3: alle Puffs auf gemeinsamer Unterkante */
  const puffs = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 3), puffMat, PUFF.length); puffs.frustumCulled = false; scene.add(puffs);
  { const ab = new Float32Array(PUFF.length); puffs.geometry.setAttribute('aBase', new THREE.InstancedBufferAttribute(ab, 1)) }""")
rep("""      PUFF.forEach((f, i) => { const wx = ((((f.cx + wind - P.x) % 1200) + 1200) % 1200) - 600, wz = ((((f.cz - P.z) % 1200) + 1200) % 1200) - 600;
        puffs.setMatrixAt(i, m4.compose(v3.set(wx + f.ox, base + f.cy * 80 + f.oy, wz + f.oz), q0, s3.set(f.r, f.r * 0.72, f.r))) }); puffs.instanceMatrix.needsUpdate = true }""",
"""      const ab = puffs.geometry.attributes.aBase; puffMat.uniforms.uTimeP.value = t;
      PUFF.forEach((f, i) => { const wx = ((((f.cx + wind - P.x) % 1200) + 1200) % 1200) - 600, wz = ((((f.cz - P.z) % 1200) + 1200) % 1200) - 600, by = base + f.cy * 80;
        puffs.setMatrixAt(i, m4.compose(v3.set(wx + f.ox, by + f.oy, wz + f.oz), q0, s3.set(f.r, f.r * 0.8, f.r))); ab.array[i] = by }); puffs.instanceMatrix.needsUpdate = true; ab.needsUpdate = true }""")
# puffMat.color / emissive set in pushUniforms → remove
rep("    puffMat.color.set(M.lit); puffMat.emissive.set(M.shade).multiplyScalar(0.35);","   ")
open(p,'w').write(s); print('ok')
