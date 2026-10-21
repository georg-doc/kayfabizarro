import re,sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a)
    if n!=cnt: sys.exit(f'count {n} != {cnt} for: {a[:80]}')
    s=s.replace(a,b)

# --- UI toggles
rep('''<div class="row"><label for="water">Wasserstand</label><output id="o_water"></output><input type="range" id="water" min="0" max="0.5" step="0.01"></div>''',
'''<div class="row"><label for="water">Wasserstand</label><output id="o_water"></output><input type="range" id="water" min="0" max="0.5" step="0.01"></div>
        <label class="check"><input type="checkbox" id="ether" checked> Berge rund (Etherington: weiche Grate, Schichten ungleich dick)</label>
        <label class="check"><input type="checkbox" id="rockc" checked> Felsgruppen an Steilhängen (3er-Gruppen, eingesunken)</label>''')
rep("'fgmass', 'edges', 'org'];","'fgmass', 'edges', 'org', 'ether', 'rockc'];")
rep("uSteps: { value: 0 }, uSharp: { value: 0.5 },","uSteps: { value: 0 }, uSharp: { value: 0.5 }, uEther: { value: 1 },")
rep("U.uOrg.value = S.org ? 1 : 0;","U.uOrg.value = S.org ? 1 : 0; U.uEther.value = S.ether ? 1 : 0; ROCKC.dirty = true;")
rep("uSteps: U.uSteps, uSharp: U.uSharp, uSeed","uSteps: U.uSteps, uSharp: U.uSharp, uEther: U.uEther, uSeed")
rep("terraces: S.steps, terraceEdge: +S.sharp.toFixed(2),","terraces: S.steps, terraceEdge: +S.sharp.toFixed(2), etheringtonRound: S.ether, rockClusters: S.rockc,")

# --- GLSL height (Etherington)
rep("uniform float uScale, uAmp, uOct, uRidge, uWarp, uMacro, uValley, uPlateau, uSteps, uSharp;\n  uniform vec2 uSeed;",
"uniform float uScale, uAmp, uOct, uRidge, uWarp, uMacro, uValley, uPlateau, uSteps, uSharp, uEther;\n  uniform vec2 uSeed;")
rep('''  float fbm(vec2 q){ float s=0.0, a=1.0, n=0.0; for(int i=0;i<7;i++){ if(float(i)>=uOct) break; s+=a*snoise(q); n+=a; q=mat2(1.6,1.2,-1.2,1.6)*q+vec2(3.1,1.7); a*=0.5; } return s/n; }
  float rfbm(vec2 q){ float s=0.0, a=1.0, n=0.0; for(int i=0;i<7;i++){ if(float(i)>=uOct) break; float r=1.0-abs(snoise(q)); s+=a*r*r; n+=a; q=mat2(1.6,1.2,-1.2,1.6)*q+vec2(3.1,1.7); a*=0.5; } return s/n; }''',
'''  // Etherington (R2): runde Grate statt Messerkanten (weiches |n|), feinste Grat-Oktaven weg, Detail leiser → keine Zacken-Silhouette
  float fbm(vec2 q){ float s=0.0, a=1.0, n=0.0, oc=uEther>0.5?min(uOct,5.0):uOct; for(int i=0;i<7;i++){ if(float(i)>=oc) break; s+=a*snoise(q); n+=a; q=mat2(1.6,1.2,-1.2,1.6)*q+vec2(3.1,1.7); a*=0.5; } return s/n; }
  float rfbm(vec2 q){ float s=0.0, a=1.0, n=0.0, oc=uEther>0.5?min(uOct,4.0):uOct; for(int i=0;i<7;i++){ if(float(i)>=oc) break; float sn=snoise(q);
    float r=uEther>0.5 ? max(0.0,(1.0-sqrt(sn*sn+0.06))/0.7551) : 1.0-abs(sn); s+=a*r*r; n+=a; q=mat2(1.6,1.2,-1.2,1.6)*q+vec2(3.1,1.7); a*=(uEther>0.5?0.45:0.5); } return s/n; }
  // Schichten (N4): je Paar eine dicke (1,3) und eine dünne (0,7) Lage, Lagen leicht wellig geneigt, Kanten gerundet
  float strU(float s){ float k=floor(s*0.5)*2.0, t=s-k; return k+(t<1.3? t/1.3 : 1.0+(t-1.3)/0.7); }
  float strS(float u){ float k=floor(u*0.5)*2.0, t=u-k; return k+(t<1.0? t*1.3 : 1.3+(t-1.0)*0.7); }''')
rep('''    if(uSteps>=1.0){ float s=h*uSteps; float f=fract(s); float w=mix(0.5,0.03,uSharp); f=smoothstep(0.5-w,0.5+w,f); h=(floor(s)+f)/uSteps; }
    return dioMod(p, h*uAmp);''',
'''    if(uSteps>=1.0){ if(uEther>0.5){ float tw=0.35*snoise(p/(uScale*2.5)+uSeed*0.11+23.0); float u=strU(h*uSteps+tw); float f=fract(u); float w=max(mix(0.5,0.03,uSharp),0.16); f=smoothstep(0.5-w,0.5+w,f); h=(strS(floor(u)+f)-tw)/uSteps; }
      else { float s=h*uSteps; float f=fract(s); float w=mix(0.5,0.03,uSharp); f=smoothstep(0.5-w,0.5+w,f); h=(floor(s)+f)/uSteps; } }
    return dioMod(p, h*uAmp);''')
# --- JS mirror
rep('''  function fbm(x, y) { let s = 0, a = 1, n = 0; for (let i = 0; i < 7 && i < S.oct; i++) { s += a * snoise(x, y); n += a; [x, y] = rot(x, y); a *= 0.5 } return s / n }
  function rfbm(x, y) { let s = 0, a = 1, n = 0; for (let i = 0; i < 7 && i < S.oct; i++) { const r = 1 - Math.abs(snoise(x, y)); s += a * r * r; n += a; [x, y] = rot(x, y); a *= 0.5 } return s / n }''',
'''  function fbm(x, y) { let s = 0, a = 1, n = 0; const oc = S.ether ? Math.min(S.oct, 5) : S.oct; for (let i = 0; i < 7 && i < oc; i++) { s += a * snoise(x, y); n += a; [x, y] = rot(x, y); a *= 0.5 } return s / n }
  function rfbm(x, y) { let s = 0, a = 1, n = 0; const oc = S.ether ? Math.min(S.oct, 4) : S.oct; for (let i = 0; i < 7 && i < oc; i++) { const sn = snoise(x, y); const r = S.ether ? Math.max(0, (1 - Math.sqrt(sn * sn + 0.06)) / 0.7551) : 1 - Math.abs(sn); s += a * r * r; n += a; [x, y] = rot(x, y); a *= S.ether ? 0.45 : 0.5 } return s / n }
  const strU = (s) => { const k = Math.floor(s * 0.5) * 2, t = s - k; return k + (t < 1.3 ? t / 1.3 : 1 + (t - 1.3) / 0.7) }, strS = (u) => { const k = Math.floor(u * 0.5) * 2, t = u - k; return k + (t < 1 ? t * 1.3 : 1.3 + (t - 1) * 0.7) };''')
rep('''    if (S.steps >= 1) { const s = h * S.steps; let f = fract(s); const w = 0.5 + (0.03 - 0.5) * S.sharp; f = sstep(0.5 - w, 0.5 + w, f); h = (Math.floor(s) + f) / S.steps }''',
'''    if (S.steps >= 1) { if (S.ether) { const tw = 0.35 * snoise(px / (S.scale * 2.5) + S.sx * 0.11 + 23, py / (S.scale * 2.5) + S.sy * 0.11 + 23), u = strU(h * S.steps + tw); let f = fract(u); const w = Math.max(0.5 + (0.03 - 0.5) * S.sharp, 0.16); f = sstep(0.5 - w, 0.5 + w, f); h = (strS(Math.floor(u) + f) - tw) / S.steps }
      else { const s = h * S.steps; let f = fract(s); const w = 0.5 + (0.03 - 0.5) * S.sharp; f = sstep(0.5 - w, 0.5 + w, f); h = (Math.floor(s) + f) / S.steps } }''')

# --- colour fields v3: cartoon blobs
rep('''  void main(){
    float t=uMix>0.5''','''  // Cartoon-Flächen (Georg 20.10.): geschlossene, runde Formen wie vom Zeichner – je Zelle höchstens ein Blob (Ellipse ≤ 1:1,25, sanfte Beulen über
  // Richtungsrauschen, keine Naht), Nachbarn per smooth-min zu satten Klecksen verschmolzen; keine Mäander, keine Zungen, keine dünnen Hälse
  float blobL(vec2 p, float cs, float pr, float r0, float r1, float sd0, float lobA, float clus){
    vec2 b=floor(p/cs); float d=1e5;
    for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){ vec2 cell=b+vec2(float(i),float(j));
      float h1=h21(cell+sd0), h2=h21(cell*1.37+sd0*1.9+5.1), h3=h21(cell*2.11-3.7+sd0*0.7), h4=h21(cell*0.73+11.0+sd0*2.3);
      vec2 cc=(cell+0.5+(vec2(h1,h2)-0.5)*0.6)*cs;
      float pp=clus>0.5 ? pr*smoothstep(-0.15,0.65,snoise(cc/90.0+sd0)) : pr; if(h3>pp) continue;
      float rad=cs*mix(r0,r1,h4); vec2 q=p-cc; float an=h1*6.283; q=vec2(cos(an)*q.x-sin(an)*q.y, sin(an)*q.x+cos(an)*q.y); q.x*=0.8+0.4*h2;
      float lq=length(q); float lob=lobA>0.0 ? lobA*snoise(q/max(lq,1e-3)*1.3+vec2(h3*40.0,h4*40.0)) : 0.0;
      d=sminK(d, lq-rad*(1.0+lob), rad*0.45); }
    return d;
  }
  float cover(float d){ float fw=fwidth(d)+1e-4; return 1.0-smoothstep(-fw,fw,d); }
  void main(){
    float t=uMix>0.5''')
old_org=s[s.index('    if(uOrg>0.5){ vec2 wq=vec2(snoise(vW.xz/260.0+3.7)'):]
old_org=old_org[:old_org.index('    // Bühnen-Farbring')]
s=s.replace(old_org,'''    if(uOrg>0.5){ vec2 pw=vW.xz+5.0*vec2(snoise(vW.xz/70.0+3.7), snoise(vW.xz/70.0-8.3)); float sd=uSeed.x*0.37+uSeed.y*0.11;
      vec3 o=mid;
      o=mix(o, low,  cover(blobL(pw, 120.0, 0.6, 0.32, 0.5, sd, 0.10, 0.0)));                      // große Flächen
      o=mix(o, high, cover(blobL(pw+vec2(37.0,-11.0), 64.0, 0.45, 0.26, 0.46, sd+3.1, 0.10, 0.0))); // mittlere, hellere Kleckse darin/darüber
      o=mix(o, mix(o, sand, 0.65), cover(blobL(pw+vec2(-9.0,23.0), 28.0, 0.3, 0.22, 0.42, sd+7.7, 0.08, 0.0)));  // kleine trockene Flecken
      o=mix(o, mix(o*0.84, cliff, 0.18), 0.8*cover(blobL(vW.xz, 6.5, 0.5, 0.12, 0.24, sd+1.3, 0.0, 1.0))); // Tupfen, gehäuft in Nestern (natürliche Verteilung)
      c = uWater>0.005 ? mix(c, o, smoothstep(uWater+0.03-w, uWater+0.05+w, hn)) : o; }
''')
rep('''    vec3 cl=cliff;
    if(uOrg>0.5){ vec2 wc=abs(vN.x)>abs(vN.z) ? vec2(vW.z,vW.y) : vec2(vW.x,vW.y); float wb=snoise(wc/38.0+vec2(31.0,7.0)); float wbw=fwidth(wb)*1.2+1e-4;
      cl=mix(cliff, mix(cliff, high, 0.45), smoothstep(-wbw, wbw, wb)); }   // Wände: eigenes Feld entlang der Wand (Wand-Projektion), nicht nach Höhe
    if(uStrata>0.5){ float band=step(0.5,fract(vW.y/(uAmp*0.06+0.6))); cl=mix(cliff*0.82, cliff*1.08, band); }
    c=mix(c, cl, smoothstep(uCliff-cw, uCliff+cw, slope));''',
'''    vec3 cl=cliff;
    if(uStrata>0.5){ float band=step(0.5,fract(vW.y/(uAmp*0.06+0.6))); cl=mix(cliff*0.82, cliff*1.08, band); }
    // organisch: keine Schnittkante am Hang – die Fläche läuft über die Wand weiter und wird mit der Steigung nur weich felsiger/dunkler
    if(uOrg>0.5) c=mix(c, mix(c, cl, 0.55)*0.92, smoothstep(uCliff-0.10, uCliff+0.22, slope));
    else c=mix(c, cl, smoothstep(uCliff-cw, uCliff+cw, slope));''')

# --- rock clusters (Etherington)
rep('''  window.__probe = { TPL, stoneGroup''','''  // Felsgruppen an Steilhängen (Etherington R2): Dreiergruppen 1 : 0,6 : 0,35 (N5 ≤ 3 Hauptformen), 40–50 % eingesunken (S1), Ei auf dem breiten Ende +
  // nach oben schmaler (N2/N3), gemeinsame Neigung ≤ 15° mit Abständen ≥ 5° und genau einer Ausnahme 25–45° je Gruppe (N1), Brösel hangabwärts ≤ 12 % (E3)
  function etherRockGeo(seed) { let z = seed; const r = () => { z = (z * 16807) % 2147483647; return z / 2147483647 }; for (let k = 0; k < 4; k++) r()
    const g = new THREE.IcosahedronGeometry(1, 2), pa = g.attributes.position, v = new THREE.Vector3()
    const cuts = [...Array(6)].map(() => ({ n: new THREE.Vector3(r() - 0.5, r() * 0.7 - 0.1, r() - 0.5).normalize(), d: 0.6 + r() * 0.25 }))
    for (let i = 0; i < pa.count; i++) { v.fromBufferAttribute(pa, i); const w = 1 + 0.2 * -v.y; v.x *= w; v.z *= w; v.y *= 0.8
      for (const c of cuts) { const k = v.dot(c.n); if (k > c.d) v.addScaledVector(c.n, c.d - k) } pa.setXYZ(i, v.x, v.y, v.z) }
    g.computeVertexNormals(); return g }
  const ROCKC = { dirty: true, cx: 1e9, cz: 1e9, meshes: [], crumbs: null };
  { const mat = new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0, flatShading: true }); addGrounding(mat)
    ROCKC.meshes = [11, 29, 47].map((sd) => { const m = new THREE.InstancedMesh(etherRockGeo(sd), mat, 420); m.castShadow = m.receiveShadow = true; m.frustumCulled = false; m.count = 0; worldRoot.add(m); return m })
    ROCKC.crumbs = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), crumbs.material, 2200); ROCKC.crumbs.castShadow = ROCKC.crumbs.receiveShadow = true; ROCKC.crumbs.frustumCulled = false; ROCKC.crumbs.count = 0; worldRoot.add(ROCKC.crumbs)
    ROCKC.mat = mat }
  const hh2 = (x, y) => { const t = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return t - Math.floor(t) };
  function buildRocks(px, pz) {
    ROCKC.cx = px; ROCKC.cz = pz; ROCKC.dirty = false; for (const m of ROCKC.meshes) m.count = 0; ROCKC.crumbs.count = 0
    if (!S.rockc || S.gridworld) { for (const m of ROCKC.meshes) m.instanceMatrix.needsUpdate = true; ROCKC.crumbs.instanceMatrix.needsUpdate = true; return }
    const A = PALETTES[S.palA]; ROCKC.mat.color.set(A.cliff).lerp(new THREE.Color(A.high), 0.22)
    const CS = 26, RAD = 175, tanMin = Math.tan((S.cliff - 8) * Math.PI / 180), e = 2, wl = S.water > 0.005 ? S.water * S.amp + 0.3 : -1e9
    const up = new THREE.Vector3(0, 1, 0), ax = new THREE.Vector3(), q1 = new THREE.Quaternion(), q2 = new THREE.Quaternion(), m4 = new THREE.Matrix4(), pos = new THREE.Vector3(), scl = new THREE.Vector3()
    const i0 = Math.floor((px - RAD) / CS), i1 = Math.floor((px + RAD) / CS), j0 = Math.floor((pz - RAD) / CS), j1 = Math.floor((pz + RAD) / CS), sd = S.seed * 0.731
    for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
      const hA = hh2(i + sd, j), hB = hh2(i * 1.7 - 3.1, j * 0.9 + sd), hC = hh2(i * 0.37 + 9.2 + sd, j * 2.3), hD = hh2(i * 2.9 + sd * 1.3, j * 1.1 - 7.7)
      const x = (i + 0.2 + 0.6 * hA) * CS, z = (j + 0.2 + 0.6 * hB) * CS; if ((x - px) ** 2 + (z - pz) ** 2 > RAD * RAD) continue
      if (DIO.on && Math.hypot(x - DIO.x, z - DIO.z) < DIO.R + 16) continue
      const h0 = hgt(x, z); if (h0 < wl) continue
      const gx = (hgt(x + e, z) - hgt(x - e, z)) / (2 * e), gz = (hgt(x, z + e) - hgt(x, z - e)) / (2 * e), gm = Math.hypot(gx, gz)
      if (gm < tanMin || hC > 0.8) continue
      const down = Math.atan2(-gz, -gx), contour = down + Math.PI / 2, big = (2.0 + 3.2 * hD) * Math.min(1.6, 0.8 + gm * 0.6)
      // gemeinsame Neigungsrichtung aus einem weiten Feld → Nachbargruppen lehnen sich in dieselbe Richtung
      const leanDir = 1.3 + 2.2 * snoise(x / 400 + 5.0, z / 400 - 2.0), base = [4, 10, 15], ord = hA < 0.33 ? [0, 1, 2] : hA < 0.66 ? [1, 2, 0] : [2, 0, 1], exc = hB < 0.5 ? 1 : 2
      const off = [[0, 0], [0.95, 0.15], [-0.75, 0.35]], sizes = [1, 0.6, 0.35]
      for (let k = 0; k < 3; k++) {
        const sc = big * sizes[k] * (0.9 + 0.2 * hh2(i + k, j - k)), ox = off[k][0] * big, oy = off[k][1] * big
        const rx = x + Math.cos(contour) * ox + Math.cos(down) * oy, rz = z + Math.sin(contour) * ox + Math.sin(down) * oy
        let g = hgt(rx, rz); for (let a = 0; a < 4; a++) g = Math.min(g, hgt(rx + Math.cos(a * 1.571) * sc * 0.8, rz + Math.sin(a * 1.571) * sc * 0.8))
        const sink = 0.4 + 0.1 * hh2(i * 3 + k, j * 5), hgtR = 1.6 * sc
        const isExc = k === exc, lean = (isExc ? 25 + 20 * hC : base[ord[k]]) * Math.PI / 180, ld = isExc ? leanDir + Math.PI * 0.8 : leanDir + (hh2(i, j + k) - 0.5) * 0.4
        ax.set(Math.sin(ld), 0, -Math.cos(ld)); q1.setFromAxisAngle(ax, lean); q2.setFromAxisAngle(up, hh2(i - k, j) * 6.283); q1.multiply(q2)
        pos.set(rx, g + 0.8 * sc - sink * hgtR, rz); scl.set(sc, sc, sc)
        const mesh = ROCKC.meshes[(i * 7 + j * 3 + k) % 3 < 0 ? 0 : (i * 7 + j * 3 + k) % 3] || ROCKC.meshes[0]; if (mesh.count >= 420) continue
        mesh.setMatrixAt(mesh.count++, m4.compose(pos, q1, scl))
        // Brösel: wenige, klein (≤ 12 % des Steins), meist hangabwärts liegen geblieben
        if (S.crumbs) for (let c = 0; c < 4 && ROCKC.crumbs.count < 2200; c++) { const a = down + (hh2(i + c, j * 2 + k) - 0.5) * 2.2, rr2 = sc * (0.75 + 0.6 * hh2(i * 2 + c, j + k)), cx2 = rx + Math.cos(a) * rr2, cz2 = rz + Math.sin(a) * rr2, cs2 = sc * (0.04 + 0.08 * hh2(c + i, k + j))
          ce.set(hh2(c, i) * 0.6, hh2(j, c) * 6.28, 0); cq.setFromEuler(ce); cs3.set(cs2 * 1.2, cs2 * 0.6, cs2); ROCKC.crumbs.setMatrixAt(ROCKC.crumbs.count++, cm4.compose(ccv.set(cx2, hgt(cx2, cz2) - cs2 * 0.15, cz2), cq, cs3)) }
      }
    }
    for (const m of ROCKC.meshes) m.instanceMatrix.needsUpdate = true; ROCKC.crumbs.instanceMatrix.needsUpdate = true
  }
  window.__rockc = ROCKC;
  window.__probe = { TPL, stoneGroup''')
rep('''    worldRoot.position.set(-P.x, 0, -P.z);''','''    worldRoot.position.set(-P.x, 0, -P.z);
    if (ROCKC.dirty || Math.hypot(P.x - ROCKC.cx, P.z - ROCKC.cz) > 40) buildRocks(P.x, P.z);''')
open(p,'w').write(s); print('ok')
