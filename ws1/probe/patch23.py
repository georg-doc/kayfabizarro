import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:90]}')
    s=s.replace(a,b)
# uniforms
rep("U.uEdges = { value: 1 };","U.uEdges = { value: 1 }; U.uAOMap = { value: null }; U.uAOOn = { value: 1 };")
rep("uniform sampler2D uShadowMap; uniform float uShadowOn;","uniform sampler2D uShadowMap, uAOMap; uniform float uShadowOn, uAOOn;")
# terrain: ground-side contact AO, before shadow
rep("    if(uShadowOn>0.5){ vec3 sc=vSC.xyz/vSC.w;",
r"""    // Kontakt-AO auf dem Boden (Georg: dunkle, nie schwarze Zone rund um den Fuß jedes Props, wie KayKit): weichgezeichnete Draufsicht der Props, 80 m um das Auto
    if(uAOOn>0.5 && uGridWorld<0.5){ vec2 rel=vW.xz-uCarW; vec2 auv=vec2(rel.x+40.0, -rel.y+40.0)/80.0;
      if(auv.x>0.0 && auv.x<1.0 && auv.y>0.0 && auv.y<1.0){ float ao=texture2D(uAOMap, auv).r*(1.0-smoothstep(0.42,0.5,max(abs(auv.x-0.5),abs(auv.y-0.5))));
        col=mix(col, mix(col*0.55, uContact, 0.4), clamp(ao*1.1,0.0,0.8)); } }
    if(uShadowOn>0.5){ vec3 sc=vSC.xyz/vSC.w;""")
# AO pass setup after carRoot creation
rep("  const carRoot = new THREE.Group(),","""  // Kontakt-AO-Pass: Props (Ebene 2) von oben weiß in eine kleine Karte, dann zweimal weichgezeichnet (ca. 1,2 m Hof)
  const AO = { rtA: new THREE.WebGLRenderTarget(512, 512), rtB: new THREE.WebGLRenderTarget(512, 512), cam: new THREE.OrthographicCamera(-40, 40, 40, -40, 1, 600), white: new THREE.MeshBasicMaterial({ color: 0xffffff }) };
  AO.cam.position.set(0, 300, 0); AO.cam.up.set(0, 0, -1); AO.cam.lookAt(0, 0, 0); AO.cam.layers.set(2);
  AO.blur = new THREE.ShaderMaterial({ uniforms: { tMap: { value: null }, uDir: { value: new THREE.Vector2() } }, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }',
    fragmentShader: 'uniform sampler2D tMap; uniform vec2 uDir; varying vec2 vUv; void main(){ float s=0.0; float w[5]; w[0]=0.227; w[1]=0.194; w[2]=0.122; w[3]=0.054; w[4]=0.016; s+=texture2D(tMap,vUv).r*w[0]; for(int i=1;i<5;i++){ s+=texture2D(tMap,vUv+uDir*float(i)*2.0).r*w[i]; s+=texture2D(tMap,vUv-uDir*float(i)*2.0).r*w[i]; } gl_FragColor=vec4(vec3(s),1.0); }' });
  AO.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), AO.blur); AO.qScene = new THREE.Scene(); AO.qScene.add(AO.quad); AO.qCam = new THREE.Camera(); AO.quad.frustumCulled = false;
  function renderAO() {
    if (!U.uAOOn.value) return;
    worldRoot.traverse((o) => { if (o.isMesh) o.layers.enable(2) }); carRoot.traverse((o) => { if (o.isMesh) o.layers.enable(2) });
    const au = renderer.shadowMap.autoUpdate, cc = renderer.getClearColor(new THREE.Color()), ca = renderer.getClearAlpha(), om = scene.overrideMaterial, fg = scene.fog;
    renderer.shadowMap.autoUpdate = false; scene.overrideMaterial = AO.white; scene.fog = null; renderer.setClearColor(0x000000, 1);
    renderer.setRenderTarget(AO.rtA); renderer.clear(); renderer.render(scene, AO.cam); scene.overrideMaterial = om; scene.fog = fg;
    AO.blur.uniforms.tMap.value = AO.rtA.texture; AO.blur.uniforms.uDir.value.set(1 / 512, 0); renderer.setRenderTarget(AO.rtB); renderer.render(AO.qScene, AO.qCam);
    AO.blur.uniforms.tMap.value = AO.rtB.texture; AO.blur.uniforms.uDir.value.set(0, 1 / 512); renderer.setRenderTarget(AO.rtA); renderer.render(AO.qScene, AO.qCam);
    renderer.setRenderTarget(null); renderer.setClearColor(cc, ca); renderer.shadowMap.autoUpdate = au; U.uAOMap.value = AO.rtA.texture }
  const carRoot = new THREE.Group(),""")
rep("    renderer.render(scene, camera);","    renderAO(); renderer.render(scene, camera);")
# toggle reuse: 'ground' checkbox also controls ground AO
rep("U.uOrg.value = S.org ? 1 : 0;","U.uOrg.value = S.org ? 1 : 0; U.uAOOn.value = S.ground ? 1 : 0;")
open(p,'w').write(s); print('ok')
