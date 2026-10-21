import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:80]}')
    s=s.replace(a,b)
rep('<label class="check"><input type="checkbox" id="puffs" checked> Knet-Wolken in Flughöhe</label>',
    '<label class="check"><input type="checkbox" id="puffs" checked> Wolkenschicht in Flughöhe (gemalt wie die Kuppelwolken)</label>')
rep("trailMat.uniforms.uCol.value.set(M.lit); puffs.visible = S.puffs;","trailMat.uniforms.uCol.value.set(M.lit); puffs.visible = false; for (const L of CLOUDL) L.visible = S.puffs;")
# cloud layers after puffs creation
rep("  { const ab = new Float32Array(PUFF.length); puffs.geometry.setAttribute('aBase', new THREE.InstancedBufferAttribute(ab, 1)) }",
r"""  { const ab = new Float32Array(PUFF.length); puffs.geometry.setAttribute('aBase', new THREE.InstancedBufferAttribute(ab, 1)) }
  // Wolkenschicht in Flughöhe (Georg 20.10.: „gleiche Formsprache wie die Kuppelwolken, nicht knubbelig“): zwei waagrechte Ebenen, gemalt mit derselben
  // Logik wie die Kuppel (Rauschen hart geschnitten, Licht-/Schattenton, dunklere Kante), weltfest, ziehen mit dem Wind; von unten Schattenton
  const CLOUDL = [0, 1].map((li) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(2600, 2600, 1, 1).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({
      uniforms: Object.assign({}, SKY, { uHorizon: U.uHorizon, uLitC: SKY.uLit, uShadeC: SKY.uShade, uCoverC: SKY.uCover, uWind: { value: new THREE.Vector2() }, uLay: { value: li } }),
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      vertexShader: `varying vec3 vWc; void main(){ vec4 w=modelMatrix*vec4(position,1.0); vWc=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,
      fragmentShader: `${GLSL_NOISE}\nuniform vec3 uHorizon; ${GLSL_SKY}
      uniform vec3 uLitC, uShadeC; uniform float uCoverC, uLay; uniform vec2 uWind; varying vec3 vWc;
      float fbm4(vec2 q){ float s=0.0, a=0.5; for(int i=0;i<4;i++){ s+=a*snoise(q); q=mat2(1.6,1.2,-1.2,1.6)*q+vec2(1.7,9.2); a*=0.5; } return s; }
      void main(){ vec2 wp=vWc.xz+uWind+vec2(uLay*517.0,-uLay*311.0);
        vec2 p=wp/260.0; float n=fbm4(p*1.4)+0.5; vec2 so=normalize(uSunDir.xz+1e-4)*0.07; float n2=fbm4(p*1.4+so)+0.5;
        float th=0.93-uCoverC*0.5-uLay*0.04; float fw=fwidth(n)*1.2+1e-4; float m=smoothstep(th-fw,th+fw,n);
        if(m<0.01) discard;
        float below=step(vWc.y, cameraPosition.y)<0.5 ? 1.0 : 0.0;                                   /* von unten: Unterseite im Schattenton */
        vec3 cc=mix(uShadeC,uLitC, below>0.5 ? 0.15 : step(n2+0.012,n));
        cc=mix(cc,uShadeC*0.82,(m-smoothstep(th+0.012,th+0.03,n))*0.85);                              /* dunklere Kante wie die Kuppelwolken */
        float d=length(vWc.xz-cameraPosition.xz); cc=mix(cc, skyColor(normalize(vWc-cameraPosition)), smoothstep(500.0,1250.0,d));
        gl_FragColor=vec4(cc, m*(1.0-smoothstep(1000.0,1280.0,d))); }` }))
    m.frustumCulled = false; m.renderOrder = 5; scene.add(m); return m });""")
# per-frame: position layers at car-relative origin, heights, wind
rep("    if (puffs.visible) { const base = S.amp + 45, wind = t * 3;",
    "    { const cb = S.amp + 70; CLOUDL.forEach((L, i) => { L.position.set(0, cb + i * 42, 0); L.material.uniforms.uWind.value.set(P.x + t * (3 + i), P.z + t * 1.2) }) }   // Ebenen folgen dem Auto, Formen weltfest\n    if (puffs.visible) { const base = S.amp + 45, wind = t * 3;")
open(p,'w').write(s); print('ok')
