import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:90]}')
    s=s.replace(a,b)
# water
rep("uniform vec3 uA_water, uB_water, uA_sky, uB_sky, uCam, uTint, uHorizon; uniform float uFogNear, uFogFar, uMix, uScale, uMoodK; uniform vec2 uSeed, uOffset, uCarW; varying vec3 vP;",
    "uniform vec3 uA_water, uB_water, uA_sky, uB_sky, uCam, uTint, uHorizon; uniform float uFogNear, uFogFar, uMix, uScale, uMoodK; uniform vec2 uSeed, uOffset, uCarW; varying vec3 vP;\n${GLSL_SKY}")
rep("float d=distance(uCam.xz, vP.xz); float f=smoothstep(uFogNear,uFogFar,d); gl_FragColor=vec4(mix(w*(1.0+rip), sky, f), mix(0.82,1.0,f)); }",
    "float d=distance(uCam.xz, vP.xz); float f=smoothstep(uFogNear,uFogFar,d); if(uSky2>0.5){ float fa=smoothstep(uEdgeR*0.85,uEdgeR,d); gl_FragColor=vec4(applyAir(w*(1.0+rip), vP, 1.0), mix(0.82,1.0,fa)); } else gl_FragColor=vec4(mix(w*(1.0+rip), sky, f), mix(0.82,1.0,f)); }")
# dome uniforms + shader
rep("const SKY = { uZenith: { value: new THREE.Color() },","const SKY = { uZenith: U.uZenith, uSkyMid: U.uSkyMid, uSkyGround: U.uSkyGround, uSunDir: U.uSunDir, uSunCol: U.uSunCol, uAntiTint: U.uAntiTint, uAirTint: U.uAirTint, uHzGlow: U.uHzGlow, uSunHalo: U.uSunHalo, uSky2: U.uSky2, uFogB: U.uFogB, uFogHa: U.uFogHa, uFogHb: U.uFogHb, uEdgeR: U.uEdgeR, uMoon: U.uMoon, uMoonDir: U.uMoonDir,")
rep("    uniform vec3 uZenith, uHorizon, uLit, uShade; uniform float uTime, uCover, uPainted, uStars; uniform vec2 uCamXZ; varying vec3 vDir;",
    "    uniform vec3 uHorizon, uLit, uShade; uniform float uTime, uCover, uPainted, uStars, uMoon; uniform vec3 uMoonDir; uniform vec2 uCamXZ; varying vec3 vDir;\n    ${GLSL_SKY}")
old=s[s.index("      vec3 col=d.y>0.0 ? mix(uHorizon, uZenith, pow(smoothstep(0.0,0.85,h),0.7)) : uHorizon;"):]
old=old[:old.index("\n")+1]
rep(old, old.rstrip('\n')+r"""
      if(uSky2>0.5){ col=skyColor(d); col=mix(col, uSunCol*1.15, smoothstep(0.9970,0.9978,dot(d,uSunDir))); }   /* Sonnenscheibe (H19) */
      // Surrealer Himmelskörper (R13 H21): Knet-Riesenmond (18°) bzw. Ringplanet, tief am Horizont gegenüber der Sonne, unten im Dunst
      if(uMoon>0.5){ vec3 tz=uMoonDir; vec3 tx=normalize(cross(vec3(0.0,1.0,0.0),tz)); vec3 ty=cross(tz,tx); float sr=0.156;
        vec2 q=vec2(dot(d,tx),dot(d,ty))/sr; float r2=dot(q,q); float fw=fwidth(r2)+1e-4; float front=step(0.0,dot(d,tz));
        vec3 mcol=mix(uSkyMid, uSunCol, 0.55)*vec3(1.0,0.94,0.96);
        if(uMoon>1.5){ vec2 e=vec2(q.x*0.96+q.y*0.28, (q.y*0.96-q.x*0.28)/0.26); float er=length(e); float ringM=smoothstep(1.32,1.36,er)*(1.0-smoothstep(1.86,1.9,er))*front;
          float behind=step(0.0,e.y)*(1.0-smoothstep(1.0-fw,1.0+fw,r2)); vec3 rc=mix(mcol*0.85, uSunCol, 0.35)*(0.9+0.1*sin(er*40.0));
          col=mix(col, mix(rc, skyColor(d), 0.25), ringM*(1.0-behind)); }
        float disc=(1.0-smoothstep(1.0-fw,1.0+fw,r2))*front;
        if(disc>0.0){ vec3 n=normalize(tx*q.x+ty*q.y-tz*sqrt(max(0.0,1.0-r2)));
          float bump=snoise(q*3.1+7.0)*0.5+snoise(q*7.3-2.0)*0.25; vec3 nb=normalize(n+vec3(bump*0.22,bump*0.12,bump*0.18));
          float lm=max(dot(nb,-uSunDir*vec3(-1.0,1.0,-1.0)),0.0); float ls=floor(lm*3.0)/3.0+smoothstep(0.0,0.15,fract(lm*3.0))/3.0;   /* drei Knet-Töne */
          vec3 mc=mcol*(0.55+0.55*ls); float haze=1.0-smoothstep(-0.55,0.35,q.y); mc=mix(mc, skyColor(d), 0.18+0.5*haze);
          col=mix(col, mc, disc); }
        if(uMoon>1.5){ vec2 e=vec2(q.x*0.96+q.y*0.28, (q.y*0.96-q.x*0.28)/0.26); float er=length(e); float ringF=smoothstep(1.32,1.36,er)*(1.0-smoothstep(1.86,1.9,er))*front*step(e.y,0.0);
          vec3 rc=mix(mcol*0.85, uSunCol, 0.35)*(0.9+0.1*sin(er*40.0)); col=mix(col, mix(rc, skyColor(d), 0.25), ringF); } }
""")
# backdrops (Kulissen) after dome is added
rep("  dome.renderOrder = -1; dome.frustumCulled = false; scene.add(dome);",
r"""  dome.renderOrder = -1; dome.frustumCulled = false; scene.add(dome);
  // Kulissen (R13 H14): drei weltferne Silhouettenringe, Oberkante bei +5° / +3° / +1,5°, je weiter, desto mehr Himmelsfarbe (k 0,45 / 0,65 / 0,82)
  const KUL = [[330, 5, 0.45, 1.3], [450, 3, 0.65, 7.1], [650, 1.5, 0.82, 13.7]].map(([R, deg, k, sd], ix) => {
    const g = new THREE.CylinderGeometry(R, R, 1, 384, 1, true), pa = g.attributes.position, top = R * Math.tan(deg * Math.PI / 180)
    for (let i = 0; i < pa.count; i++) { const a = Math.atan2(pa.getZ(i), pa.getX(i)); if (pa.getY(i) > 0) { const n1 = snoise(Math.cos(a) * 2.2 + sd, Math.sin(a) * 2.2 - sd), n2 = snoise(Math.cos(a) * 6.5 - sd, Math.sin(a) * 6.5 + sd)
        const mesa = Math.max(0, Math.min(1, (n1 * 0.5 + 0.5 - 0.42) * 6)); pa.setY(i, top * (0.35 + 0.45 * mesa + 0.2 * (n2 * 0.5 + 0.5))) } else pa.setY(i, -60) }
    const u = Object.assign({}, SKY, { uHorizon: U.uHorizon, uK: { value: k }, uSil: { value: new THREE.Color() }, uTop: { value: top } })
    const m = new THREE.Mesh(g, new THREE.ShaderMaterial({ uniforms: u, side: THREE.BackSide, depthWrite: true,
      vertexShader: `varying vec3 vWk; varying float vHk; void main(){ vec4 w=modelMatrix*vec4(position,1.0); vWk=w.xyz; vHk=position.y; gl_Position=projectionMatrix*viewMatrix*w; }`,
      fragmentShader: `uniform vec3 uHorizon; ${GLSL_SKY}
      uniform float uK, uTop; uniform vec3 uSil; varying vec3 vWk; varying float vHk;
      void main(){ vec3 rd=normalize(vWk-cameraPosition); float base=1.0-smoothstep(0.0,0.35,vHk/max(1.0,uTop));   /* Fuß im Bodendunst */
        gl_FragColor=vec4(mix(uSil, skyColor(rd), clamp(uK+(1.0-uK)*base,0.0,1.0)),1.0); }` }))
    m.frustumCulled = false; m.renderOrder = 1; scene.add(m); return { m, u, ix } });""")
# moods / pushUniforms
rep("    SKY.uZenith.value.set(M.zenith);",
"""    SKY.uZenith.value.set(M.zenith);
    { const hz = U.uHorizon.value, ze = U.uZenith.value; U.uSkyMid.value.copy(hz).lerp(ze, 0.45); U.uSkyGround.value.copy(hz).multiplyScalar(0.9).lerp(new THREE.Color(A.low), 0.15); U.uSunCol.value.set(M.sun[0]); U.uAirTint.value.copy(hz).lerp(ze, 0.5); U.uSky2.value = S.sky2 ? 1 : 0; U.uMoon.value = S.moon
      const md = new THREE.Vector3(-U.uSunDir.value.x, 0, -U.uSunDir.value.z).normalize(); md.y = Math.tan(6 * Math.PI / 180); U.uMoonDir.value.copy(md.normalize())
      if (typeof KUL !== 'undefined') KUL.forEach((K) => { K.u.uSil.value.set(A.cliff).lerp(new THREE.Color(A.mid), 0.3).lerp(hz, K.ix * 0.12); K.m.visible = !!S.kul }) }""")
# frame: fog density, edge radius, kulisse placement
rep("    { const rOn = mode === 'over' || S.rings; for (const R of RINGS) R.m.visible = rOn; water.scale.set(rOn ? 16 : 1, 1, rOn ? 16 : 1) }",
"""    { const rOn = mode === 'over' || S.rings; for (const R of RINGS) R.m.visible = rOn; water.scale.set(rOn ? 16 : 1, 1, rOn ? 16 : 1)
      const edge = rOn ? 4700 : 292; U.uEdgeR.value = edge; U.uFogB.value = Math.LN2 / (0.6 * edge); U.uFogHb.value = 1 / Math.max(4, 0.25 * S.amp); U.uFogHa.value = rOn ? 0.0006 : 0.004
      for (const K of KUL) { K.m.position.set(camera.position.x, 0, camera.position.z); K.m.scale.setScalar(rOn ? 17 : 1) } }""")
open(p,'w').write(s); print('ok2')
