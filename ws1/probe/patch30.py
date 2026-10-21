import sys,re
p='gelaende-probe.html'; s=open(p).read()
kit=open('/Users/georgvonwestphalen/kfb-ws1/research/v572/kfb-light-pool.v1.js').read().replace('export const VERSION','const LP_VERSION').replace('export function','function').replace("return { VERSION, MAX,","return { VERSION: LP_VERSION, MAX,")
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:90]}')
    s=s.replace(a,b)
# embed kit + create before U
rep("  const U = {","  /* KFB_LIGHT_POOL_V1_BEGIN – Kopie von research/v572/kfb-light-pool.v1.js (Quelle), nicht hier ändern */\n"+kit+"\n  /* KFB_LIGHT_POOL_V1_END */\n  const LP = createLightPoolKit(THREE, { max: 16 });\n  const U = {")
rep("  for (const k of PAL_KEYS) { U['uA_' + k] = { value: new THREE.Color() }; U['uB_' + k] = { value: new THREE.Color() } }",
    "  for (const k of PAL_KEYS) { U['uA_' + k] = { value: new THREE.Color() }; U['uB_' + k] = { value: new THREE.Color() } }\n  Object.assign(U, LP.uniforms); // Lichtpfützen (V-572) auch im Gelände")
# terrain frag: include glsl + add pools after shadow/debug, before air
rep("  ${GLSL_SKY}\n  ${GLSL_KUS}\n  ${palUniforms}","  ${GLSL_SKY}\n  ${GLSL_KUS}\n  ${LP.glsl}\n  ${palUniforms}")
rep("    if(uDbg>0.5 && uDbg<1.5) col=alb; if(uDbg>2.5) col=idc;",
    "    col+=kfbLightPools(vW-vec3(uCarW.x,0.0,uCarW.y), N, c);   /* projizierte Lichtpfützen (kfb-light-pool.v1): folgen jeder Geländeform */\n    if(uDbg>0.5 && uDbg<1.5) col=alb; if(uDbg>2.5) col=idc;")
# receivers: rocks, crumbs, kit props, amph
rep("ROCKC.mat = mat; for (const m of ROCKC.meshes) castFront(m);","ROCKC.mat = mat; LP.injectStandard(mat); for (const m of ROCKC.meshes) castFront(m);")
rep("    .then(() => { castFront(scene); for (const k in TPL) castFront(TPL[k]);",
    "    .then(() => { castFront(scene); for (const k in TPL) castFront(TPL[k]); const lpSeen = new Set(); const lpIn = (o) => { if (o.isMesh) for (const mm of [].concat(o.material)) if (mm && !lpSeen.has(mm)) { lpSeen.add(mm); LP.injectStandard(mm) } }; for (const k in TPL) TPL[k].traverse(lpIn); amph?.traverse(lpIn); crumbs && LP.injectStandard(crumbs.material);")
# UI
rep('<label class="check"><input type="checkbox" id="vox">',
    '<label class="check"><input type="checkbox" id="disco"> Disco-Probe (V-572): Kugel mit Strahlen auf welligem Gelände</label>\n        <div class="row"><label for="discoMode">Strahler-Darstellung</label><select id="discoMode"><option value="1">neu: projiziert (kfb-light-pool.v1)</option><option value="0">alt: Scheiben auf fester Höhe</option></select></div>\n        <label class="check"><input type="checkbox" id="vox">')
rep("'vox', 'voxsmooth', 'voxtex', 'flowspeed'];","'vox', 'voxsmooth', 'voxtex', 'flowspeed', 'disco'];")
rep("S.flow = +$('flow').value;","S.flow = +$('flow').value; S.discoMode = +$('discoMode').value;")
# disco system before frame
rep("  let FLOWT = 0;\n  function frame(now) {",r"""  // ---------- Disco-Probe (V-572 Nachweis): Kugel 14 m über welligem Gelände, 8 drehende Strahlen; alt = Scheiben auf fester Höhe wie disco-ball-core, neu = kfb-light-pool.v1 ----------
  const DISCO = { group: new THREE.Group(), beams: [], olds: [], x: 18, z: 42, pal: ['#ff4fa3', '#4fd8ff', '#ffe14f', '#8a5bff', '#5bff9a', '#ff8a3d', '#ff4fa3', '#4fd8ff'] };
  { const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3, 1), new THREE.MeshStandardMaterial({ color: '#d9dde8', metalness: 0.7, roughness: 0.25, flatShading: true })); DISCO.ball = ball; DISCO.group.add(ball)
    const discGeo = new THREE.CircleGeometry(1, 32).rotateX(-Math.PI / 2)
    for (let i = 0; i < 8; i++) { const b = LP.makeBeam({ color: DISCO.pal[i], opacity: 0.32, angle: 0.11 }); DISCO.beams.push(b); DISCO.group.add(b)
      const od = new THREE.Mesh(discGeo, new THREE.MeshBasicMaterial({ color: DISCO.pal[i], transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })); od.renderOrder = 2; DISCO.olds.push(od); DISCO.group.add(od) }
    DISCO.group.visible = false; worldRoot.add(DISCO.group) }
  const _dO = new THREE.Vector3(), _dD = new THREE.Vector3(), _dS = new THREE.Vector3();
  function updateDisco(t) {
    if (!S.disco) { DISCO.group.visible = false; if (LP.uniforms.uLPn.value) LP.setPools([]); return }
    DISCO.group.visible = true; const gx = DISCO.x, gz = DISCO.z, gy = surfH(gx, gz) + 14; DISCO.ball.position.set(gx, gy, gz); DISCO.ball.rotation.y = t * 0.6
    const pools = [], neu = S.discoMode === 1, floorY = surfH(gx, gz) + 0.006;
    for (let i = 0; i < 8; i++) { const a = t * 0.5 + i * Math.PI / 4, tilt = 0.55 + 0.35 * Math.sin(t * 0.7 + i * 1.3);
      _dD.set(Math.cos(a) * Math.sin(tilt), -Math.cos(tilt), Math.sin(a) * Math.sin(tilt)).normalize(); _dO.set(gx, gy, gz).addScaledVector(_dD, 1.2)
      const b = DISCO.beams[i], od = DISCO.olds[i];
      if (neu) { const len = LP.hitDistance(_dO, _dD, { ground: surfH, maxLen: 70 }) * 1.06; LP.aimBeam(b, _dO, _dD, len); b.material.uniforms.uFade.value = 0.7; od.visible = false
        pools.push({ origin: _dS.set(_dO.x - P.x, _dO.y, _dO.z - P.z).clone(), dir: _dD.clone(), angle: 0.11, soft: 0.45, color: DISCO.pal[i], intensity: 2.2, range: 90 }) }
      else { const len = (_dO.y - floorY) / Math.max(0.05, -_dD.y); LP.aimBeam(b, _dO, _dD, len); b.material.uniforms.uFade.value = 1.01; od.visible = true; const r = Math.tan(0.11) * len; od.position.set(_dO.x + _dD.x * len, floorY, _dO.z + _dD.z * len); od.scale.set(r, 1, r) } }
    LP.setPools(neu ? pools : []) }
  let FLOWT = 0;
  function frame(now) {""")
rep("    renderAO(); renderer.render(scene, camera);","    updateDisco(now / 1000); renderAO(); renderer.render(scene, camera);")
open(p,'w').write(s); print('ok')
