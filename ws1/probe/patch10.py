p='gelaende-probe.html'; s=open(p).read()
def rep(a,b):
    global s
    assert a in s, a[:90]; s=s.replace(a,b,1)
# UI
rep("""        <label class="check"><input type="checkbox" id="ground" checked> Erdung: dunkler Bodenkontakt + Kronen-Unterseiten</label>""",
"""        <label class="check"><input type="checkbox" id="ground" checked> Erdung: dunkler Bodenkontakt + Kronen-Unterseiten</label>
        <label class="check"><input type="checkbox" id="crumbs" checked> Kontakt-Brocken an jeder Fuge (V-565)</label>
        <label class="check"><input type="checkbox" id="fgmass" checked> Vordergrund-Tonmasse vor dem Diorama</label>
        <label class="check"><input type="checkbox" id="edges" checked> Farbige Kanten an Graten und Plateaukanten</label>""")
# Vertex: Krümmung
rep("uniform mat4 uShadowM; varying vec3 vW; varying vec3 vN; varying float vH; varying vec4 vSC;\n  void main(){",
    "uniform mat4 uShadowM; uniform float uEdges; varying vec3 vW; varying vec3 vN; varying float vH; varying vec4 vSC; varying float vCurv;\n  void main(){")
rep("    vN=normalize(vec3(h-hx, e, h-hz)); vH=h; vW=vec3(p.x,h,p.y);\n    float y=h;",
    "    vN=normalize(vec3(h-hx, e, h-hz)); vH=h; vW=vec3(p.x,h,p.y);\n    vCurv=0.0; if(uEdges>0.5){ float e2=max(2.5,uNE*1.5); vCurv=(hgt(p+vec2(e2,0.0))+hgt(p-vec2(e2,0.0))+hgt(p+vec2(0.0,e2))+hgt(p-vec2(0.0,e2)))*0.25-h; } // <0: Grat/Kante (konvex)\n    float y=h;")
# Fragment: Uniforms
rep("  uniform sampler2D uShadowMap; uniform float uShadowOn; uniform vec3 uContact;\n  varying vec3 vW; varying vec3 vN; varying float vH; varying vec4 vSC;",
    "  uniform sampler2D uShadowMap; uniform float uShadowOn; uniform vec3 uContact; uniform float uEdges, uFg;\n  varying vec3 vW; varying vec3 vN; varying float vH; varying vec4 vSC; varying float vCurv;")
# Fragment: Vordergrund-Tonmasse + farbige Kanten (vor Licht)
rep("    float slope=1.0-vN.y; float cw=0.01+0.05*uSoft;","""    // Vordergrund-Tonmasse (fest im Raum, vor der Öffnung des Dioramas): große ruhige dunklere Fläche mit organischem Rand, Ton aus der Palette
    if(uFg>0.5 && uDioB.x>0.5){ vec2 fc=uDio.xy+vec2(cos(uDioB.w),sin(uDioB.w))*(uDio.z+30.0); vec2 q=vW.xz-fc; float r=length(q); vec2 dir=q/max(r,1e-3);
      float edge=r-22.0*(1.0+0.22*snoise(dir*1.7+3.0)+0.1*snoise(vW.xz*0.06)); float fw=fwidth(edge)*1.5+1e-4;
      c=mix(c, mix(c*0.7, uContact*1.25, 0.35), 1.0-smoothstep(-fw,fw,edge)); }
    float slope=1.0-vN.y; float cw=0.01+0.05*uSoft;""")
rep("    if(uToon>0.5){ float s=l*3.0; l=(floor(s)+smoothstep(0.0,0.12,fract(s)))/3.0; }\n    vec3 col=c*clayTone*(0.42+0.20*N.y+0.62*l);",
    """    if(uToon>0.5){ float s=l*3.0; l=(floor(s)+smoothstep(0.0,0.12,fract(s)))/3.0; }
    vec3 col=c*clayTone*(0.42+0.20*N.y+0.62*l);
    // Farbige Kanten nur an echten Formbrüchen (konvexe Grate, Plateaukanten): dunklerer Palettenton der Fläche, nie Schwarz, keine Tusche überall
    if(uEdges>0.5){ float ce=-vCurv/(uAmp*0.02+0.15); float ew=fwidth(ce)*1.2+1e-4; float ek=smoothstep(0.55-ew, 0.55+ew, ce)*smoothstep(0.04,0.12,1.0-vN.y);
      col=mix(col, mix(col*0.55, uContact, 0.35), ek*0.85); }""")
rep("U.uShadowMap = { value: null };","U.uEdges = { value: 1 }; U.uFg = { value: 1 }; U.uShadowMap = { value: null };")
# Steine tiefer (umgekehrter Eisberg, Kappe 50 %)
rep("sc, sc * (0.2 + rr() * 0.15), rr() * 6.28, stoneGroup) } }","sc, sc * Math.min(0.5, 0.4 + rr() * 0.1), rr() * 6.28, stoneGroup) } } // 40–50 % eingesunken (Etherington: Findling als umgekehrter Eisberg, R2)")
# Kontakt-Brocken: Instanzen, je Fuge mehrere kleine Knet-Brocken
rep("  window.__syncDio = () => {","""  // Kontakt-Geometrie (V-565): jede Fuge Objekt/Boden durch kleine Knet-Brocken gebrochen (gequetschte Kugeln, Palettenton zwischen Boden und Kontakt)
  const CRUMB_N = 900, crumbs = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0, flatShading: true }), CRUMB_N);
  crumbs.castShadow = crumbs.receiveShadow = true; crumbs.count = 0; worldRoot.add(crumbs); addGrounding(crumbs.material);
  const cm4 = new THREE.Matrix4(), cq = new THREE.Quaternion(), ce = new THREE.Euler(), cv = new THREE.Vector3(), cs3 = new THREE.Vector3();
  function crumbRing(x, z, r0, r1, n, s0, s1) { for (let k = 0; k < n && crumbs.count < CRUMB_N; k++) { const a = rr() * 6.283, r = r0 + rr() * (r1 - r0), px = x + Math.cos(a) * r, pz = z + Math.sin(a) * r, sz = s0 + (s1 - s0) * rr() * rr()
      ce.set(rr() * 0.6, rr() * 6.28, rr() * 0.6); cq.setFromEuler(ce); cs3.set(sz * (0.9 + rr() * 0.5), sz * (0.45 + rr() * 0.25), sz * (0.8 + rr() * 0.4))
      crumbs.setMatrixAt(crumbs.count++, cm4.compose(cv.set(px, hgt(px, pz) - sz * 0.15, pz), cq, cs3)) } }
  window.__syncDio = () => {""")
rep("    stoneGroup.clear(); propGroup.clear(); if (!S.dio) return;","    stoneGroup.clear(); propGroup.clear(); crumbs.count = 0; if (!S.dio) { crumbs.instanceMatrix.needsUpdate = true; return }")
rep("    const leaf = new THREE.Color(A.mid), rock = new THREE.Color(A.cliff);",
"""    if (S.crumbs) { rs = 23
      for (const o of stoneGroup.children) crumbRing(o.position.x, o.position.z, o.scale.x * 0.55, o.scale.x * 1.0, 6, 0.06 * o.scale.x + 0.05, 0.22 * o.scale.x + 0.06)
      for (const o of propGroup.children) crumbRing(o.position.x, o.position.z, 0.35, 0.9, 4, 0.05, 0.18)
      if (amph) for (let k = 0; k < 120; k++) { const a = (k / 120) * Math.PI * 2; if (angGap(a, DIO.open) < 0.55) continue; crumbRing(DIO.x + Math.cos(a) * (DIO.R + 0.3), DIO.z + Math.sin(a) * (DIO.R + 0.3), 0, 0.7, 2, 0.08, 0.32) } }
    crumbs.instanceMatrix.needsUpdate = true; crumbs.material.color.set(A.sand).lerp(new THREE.Color(A.cliff), 0.45).multiplyScalar(0.85);
    const leaf = new THREE.Color(A.mid), rock = new THREE.Color(A.cliff);""")
# Steuerung
rep("'props', 'ground', 'shadows'];","'props', 'ground', 'shadows', 'crumbs', 'fgmass', 'edges'];")
rep("U.uShadowOn.value = S.shadows ? 1 : 0;","U.uShadowOn.value = S.shadows ? 1 : 0; U.uEdges.value = S.edges ? 1 : 0; U.uFg.value = S.fgmass ? 1 : 0;")
rep("props: S.props, grounding: S.ground, realShadows: S.shadows },","props: S.props, grounding: S.ground, realShadows: S.shadows, contactCrumbs: S.crumbs, foregroundMass: S.fgmass, colouredEdges: S.edges },")
open(p,'w').write(s); print('ok', len(s))
