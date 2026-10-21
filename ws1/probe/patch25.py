import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:90]}')
    s=s.replace(a,b)
# ---------- UI
rep('<label class="check"><input type="checkbox" id="gridworld"> Gitter-Welt (Neon-Linien statt Farbflächen)</label>',
'''<label class="check"><input type="checkbox" id="vox"> Voxel-Welt (instanziert: ein Klotz je Bodensäule)</label>
        <div class="row"><label for="voxs">Voxel-Kante</label><select id="voxs"><option value="1">1 m</option><option value="2" selected>2 m</option><option value="3">3 m</option><option value="4">4 m</option></select></div>
        <div class="row"><label for="voxh">Höhenstufe</label><select id="voxh"><option value="0.5">0,5 m</option><option value="1" selected>1 m</option><option value="2">2 m</option><option value="-1">= Kante (Würfel)</option></select></div>
        <label class="check"><input type="checkbox" id="voxsmooth" checked> Fahrhöhe geglättet (Rampen statt Stufen)</label>
        <label class="check"><input type="checkbox" id="voxtex" checked> edge3-Kanten je Klotz (gedreht/gespiegelt)</label>
        <label class="check"><input type="checkbox" id="gridworld"> Gitter-Welt (Neon-Linien statt Farbflächen)</label>''')
rep("'sky2', 'kul'];","'sky2', 'kul', 'vox', 'voxsmooth', 'voxtex'];")
rep("S.moon = +$('moon').value;","S.moon = +$('moon').value; S.voxs = +$('voxs').value; S.voxh = +$('voxh').value < 0 ? S.voxs : +$('voxh').value; S.voxhSel = +$('voxh').value;")
rep("if (p.moon != null) $('moon').value = p.moon;","if (p.moon != null) $('moon').value = p.moon; if (p.voxs != null) $('voxs').value = p.voxs; if (p.voxhSel != null) $('voxh').value = p.voxhSel;")
rep("world: { viewRings: S.rings,","world: { voxel: { on: S.vox, size: S.voxs, step: S.voxhSel < 0 ? 'cube' : S.voxh, smoothDrive: S.voxsmooth, edge3: S.voxtex }, viewRings: S.rings,")
rep("    bool('rings', w.viewRings, false);","    { const v = w.voxel || {}; bool('vox', v.on, false); if (typeof v.size === 'number') p.voxs = v.size; p.voxhSel = v.step === 'cube' ? -1 : (typeof v.step === 'number' ? v.step : 1); bool('voxsmooth', v.smoothDrive, true); bool('voxtex', v.edge3, true) }\n    bool('rings', w.viewRings, false);")
# ---------- JS height: variable band-limit + zero-gradient switch + voxel surface
rep("const NE0 = 600 / 256, octW = (i) => sstep(2, 4, (S.scale / Math.pow(2, i)) / NE0);",
    "const NE0 = 600 / 256; let NEJ = NE0, GZERO = false; const octW = (i) => sstep(2, 4, (S.scale / Math.pow(2, i)) / NEJ);")
rep("const om = OCMAX; OCMAX = 3; const a0 = hraw(px, py), gG = Math.hypot(hraw(px + NE0, py) - a0, hraw(px, py + NE0) - a0) / NE0; OCMAX = om;",
    "let gG = 0; if (!GZERO) { const om = OCMAX; OCMAX = 3; const a0 = hraw(px, py); gG = Math.hypot(hraw(px + NE0, py) - a0, hraw(px, py + NE0) - a0) / NE0; OCMAX = om }")
rep("kP = Math.max(0.02, 1.6 * NE0 * gG);","kP = Math.max(0.02, 1.6 * NEJ * gG);")
rep("Math.min(0.5, 1.6 * NE0 * S.steps * gG / 0.7));","Math.min(0.5, 1.6 * NEJ * S.steps * gG / 0.7));")
rep("Math.min(0.5, 1.6 * NE0 * S.steps * gG)); f = sstep","Math.min(0.5, 1.6 * NEJ * S.steps * gG)); f = sstep")
rep("  // Diorama-Fuß (identisch zum GLSL dioMod)","""  // Voxel-Säule: Höhe der Säule, in der (x, z) liegt – identisch zur Höhenkarte auf der Grafikkarte (Zellmitte, Band-Begrenzung = Kantenlänge, quantisiert)
  function voxTop(x, z) { const vs = S.voxs, cx = (Math.floor(x / vs) + 0.5) * vs, cz = (Math.floor(z / vs) + 0.5) * vs; NEJ = vs; GZERO = true; const h = hgt(cx, cz); NEJ = NE0; GZERO = false; return Math.round(h / S.voxh) * S.voxh }
  function voxSmooth(x, z) { const vs = S.voxs, fx = x / vs - 0.5, fz = z / vs - 0.5, ix = Math.floor(fx), iz = Math.floor(fz), tx = fx - ix, tz = fz - iz, c = (a, b) => voxTop((a + 0.5) * vs, (b + 0.5) * vs);
    return (c(ix, iz) * (1 - tx) + c(ix + 1, iz) * tx) * (1 - tz) + (c(ix, iz + 1) * (1 - tx) + c(ix + 1, iz + 1) * tx) * tz }
  const surfH = (x, z) => (S.vox ? voxTop(x, z) : hgt(x, z)); // Oberfläche für Platzierung (Steine, Brösel, Props)
  // Diorama-Fuß (identisch zum GLSL dioMod)""")
# placements use surfH
rep("o.position.set(x, hgt(x, z) - sink, z)","o.position.set(x, surfH(x, z) - sink, z)")
rep("ccv.set(px, hgt(px, pz) - sz * 0.15, pz)","ccv.set(px, surfH(px, pz) - sz * 0.15, pz)")
rep("let g = hgt(rx, rz), gmin = g; for (let a = 0; a < 8; a++) { const hv = hgt(","let g = surfH(rx, rz), gmin = g; for (let a = 0; a < 8; a++) { const hv = surfH(")
rep("ccv.set(cx2, hgt(cx2, cz2)","ccv.set(cx2, surfH(cx2, cz2)")
rep("const groundAt = (x, z) => (S.water > 0.005 ? Math.max(hgt(x, z), S.water * S.amp + 0.1) : hgt(x, z));",
    "const groundAt = (x, z) => { const g = S.vox ? (S.voxsmooth ? voxSmooth(x, z) : voxTop(x, z)) : hgt(x, z); return S.water > 0.005 ? Math.max(g, S.water * S.amp + 0.1) : g };")
# ---------- terrain vertex: write voxel varyings (0)
rep("varying vec4 vSC; varying float vCurv; varying float vCL;\n  void main(){","varying vec4 vSC; varying float vCurv; varying float vCL; varying vec2 vVuv; varying float vVid;\n  void main(){ vVuv=vec2(0.0); vVid=0.0;")
rep("varying vec3 vW; varying vec3 vN; varying float vH; varying vec4 vSC; varying float vCurv; varying float vCL;\n","varying vec3 vW; varying vec3 vN; varying float vH; varying vec4 vSC; varying float vCurv; varying float vCL; varying vec2 vVuv; varying float vVid; uniform float uVox, uVoxTex;\n")
# fragment: edge3 bevel per voxel face, before lighting
rep("    vec3 alb=c; if(uDbg>1.5 && uDbg<2.5) c=vec3(0.72);",
r"""    if(uVox>0.5){ float hs=vVid; vec2 f=fract(vVuv); float rot=floor(hs*4.0);   /* edge3 je Klotzfläche, zufällig gedreht/gespiegelt (wie die Rollercoaster-Voxel) */
      if(rot>0.5) f=vec2(f.y,1.0-f.x); if(rot>1.5) f=vec2(f.y,1.0-f.x); if(rot>2.5) f=vec2(f.y,1.0-f.x); if(fract(hs*7.0)>0.5) f.x=1.0-f.x;
      float tv=uVoxTex>0.5 ? texture2D(uEdge, f).r/0.78 : 1.0; c*=mix(tv,1.0,0.2)*(0.95+0.1*fract(hs*17.0)); }
    vec3 alb=c; if(uDbg>1.5 && uDbg<2.5) c=vec3(0.72);""")
# ---------- voxel system after terrain mesh
rep("  terrain.frustumCulled = false; scene.add(terrain);",
r"""  terrain.frustumCulled = false; scene.add(terrain);
  // ---------- Voxel-Welt: Höhenkarte (eine Zelle = ein Pixel) auf der Grafikkarte, dann N×N instanzierte Säulen, die ihre Höhe selbst ablesen ----------
  const VOX = { N: 192, dirty: true, cx: 1e9, cz: 1e9, vs: 2 };
  VOX.rt = new THREE.WebGLRenderTarget(VOX.N, VOX.N, { type: THREE.FloatType, format: THREE.RGBAFormat, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: false });
  VOX.hu = { uOrigin: { value: new THREE.Vector2() }, uVS: { value: 2 }, uStepV: { value: 1 } };
  VOX.hmat = new THREE.ShaderMaterial({ uniforms: Object.assign({}, U, VOX.hu), depthTest: false, depthWrite: false,
    vertexShader: 'void main(){ gl_Position=vec4(position.xy,0.0,1.0); }',
    fragmentShader: `${GLSL_NOISE}\n${GLSL_HEIGHT}\n uniform vec2 uOrigin; uniform float uVS, uStepV;
      void main(){ vec2 ij=floor(gl_FragCoord.xy); vec2 cw=uOrigin+ij*uVS; gNE=uVS; gG=0.0; float h=hgt(cw); gl_FragColor=vec4(floor(h/uStepV+0.5)*uStepV,0.0,0.0,1.0); }` });
  VOX.hscene = new THREE.Scene(); { const q = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), VOX.hmat); q.frustumCulled = false; VOX.hscene.add(q) } VOX.hcam = new THREE.Camera();
  { const box = new THREE.BoxGeometry(1, 1, 1), g = new THREE.InstancedBufferGeometry(); g.index = box.index; for (const k of ['position', 'normal', 'uv']) g.setAttribute(k, box.attributes[k]); g.instanceCount = VOX.N * VOX.N; VOX.geo = g }
  const voxVert = `${GLSL_NOISE}\n${GLSL_HEIGHT}
  uniform sampler2D uHMap; uniform vec2 uOrigin, uCarW; uniform float uVS, uStepV, uNV; uniform mat4 uShadowM;
  varying vec3 vW; varying vec3 vN; varying float vH; varying vec4 vSC; varying float vCurv; varying float vCL; varying vec2 vVuv; varying float vVid;
  void main(){
    float id=float(gl_InstanceID); float ix=mod(id,uNV), iz=floor(id/uNV); vec2 tx=vec2(1.0/uNV);
    vec2 uvc=(vec2(ix,iz)+0.5)*tx; float ht=texture2D(uHMap,uvc).r;
    float hn=min(min(texture2D(uHMap,uvc+vec2(tx.x,0.0)).r, texture2D(uHMap,uvc-vec2(tx.x,0.0)).r), min(texture2D(uHMap,uvc+vec2(0.0,tx.y)).r, texture2D(uHMap,uvc-vec2(0.0,tx.y)).r));
    float bot=min(ht,hn)-uStepV;                              /* Säule nur bis unter den tiefsten Nachbarn: keine unsichtbaren Würfel */
    vec2 cw=uOrigin+vec2(ix,iz)*uVS; float wy=position.y>0.0 ? ht : bot;
    vec3 wp=vec3(cw.x+position.x*uVS, wy, cw.y+position.z*uVS);
    vW=wp; vN=normal; vH=ht; vCurv=0.0; vCL=0.0; vVid=fract(sin(dot(cw,vec2(41.3,289.1)))*43758.5453);
    vVuv=abs(normal.y)>0.5 ? uv : vec2(uv.x, (ht-wy)/uStepV);   /* Seiten: edge3 je Höhenstufe → sichtbare Schichten */
    vec4 sp=vec4(wp.x-uCarW.x, wp.y, wp.z-uCarW.y, 1.0); vSC=uShadowM*(sp+vec4(normal*0.08,0.0));
    gl_Position=projectionMatrix*viewMatrix*sp; }`;
  VOX.mesh = new THREE.Mesh(VOX.geo, new THREE.ShaderMaterial({ uniforms: Object.assign({}, U, VOX.hu, { uHMap: { value: VOX.rt.texture }, uNV: { value: VOX.N }, uVox: { value: 1 } }), vertexShader: voxVert, fragmentShader: frag }));
  VOX.mesh.frustumCulled = false; VOX.mesh.visible = false; scene.add(VOX.mesh);
  function updateVox() {
    if (!S.vox) { VOX.mesh.visible = false; terrain.visible = true; return }
    VOX.mesh.visible = true; terrain.visible = false;
    const vs = S.voxs, c0x = Math.floor(P.x / vs), c0z = Math.floor(P.z / vs);
    if (!VOX.dirty && c0x === VOX.cx && c0z === VOX.cz) return;
    VOX.dirty = false; VOX.cx = c0x; VOX.cz = c0z;
    VOX.hu.uVS.value = vs; VOX.hu.uStepV.value = S.voxh; VOX.hu.uOrigin.value.set((c0x - VOX.N / 2 + 0.5) * vs, (c0z - VOX.N / 2 + 0.5) * vs);
    const au = renderer.shadowMap.autoUpdate; renderer.shadowMap.autoUpdate = false; renderer.setRenderTarget(VOX.rt); renderer.render(VOX.hscene, VOX.hcam); renderer.setRenderTarget(null); renderer.shadowMap.autoUpdate = au }""")
rep("U.uEdges = { value: 1 };","U.uEdges = { value: 1 }; U.uVox = { value: 0 }; U.uVoxTex = { value: 1 };")
rep("U.uOrg.value = S.org ? 1 : 0;","U.uOrg.value = S.org ? 1 : 0; U.uVoxTex.value = S.voxtex ? 1 : 0; if (typeof VOX !== 'undefined') { VOX.dirty = true } ")
# frame: voxel update, rings off in voxel mode, fog edge to voxel area
rep("    { const rOn = mode === 'over' || S.rings; for (const R of RINGS) R.m.visible = rOn; water.scale.set(rOn ? 16 : 1, 1, rOn ? 16 : 1)\n      const edge = rOn ? 4700 : 292;",
    "    updateVox();\n    { const rOn = !S.vox && (mode === 'over' || S.rings); for (const R of RINGS) R.m.visible = rOn; water.scale.set(rOn ? 16 : 1, 1, rOn ? 16 : 1)\n      const edge = S.vox ? VOX.N * S.voxs * 0.46 : rOn ? 4700 : 292;")
open(p,'w').write(s); print('ok')
