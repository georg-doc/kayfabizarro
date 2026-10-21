import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:90]}')
    s=s.replace(a,b)
# --- 1 shadow: bilinear PCF
rep("  float cover(float d){","""  // Schatten weich: jede Probe bilinear zwischen 4 Texeln (keine Treppen), 3×3 Proben im 1,5-Texel-Abstand
  float shTex(vec2 uv, float z){ return step(z, unpackRGBAToDepth(texture2D(uShadowMap, uv))); }
  float shBil(vec2 uv, float z){ vec2 ts=vec2(1.0/2048.0); vec2 g=uv*2048.0-0.5; vec2 f=fract(g); vec2 c=(floor(g)+0.5)*ts;
    return mix(mix(shTex(c,z), shTex(c+vec2(ts.x,0.0),z), f.x), mix(shTex(c+vec2(0.0,ts.y),z), shTex(c+ts,z), f.x), f.y); }
  float cover(float d){""")
old=s[s.index("      for(int i=-2;i<=2;i++) for(int j=-2;j<=2;j++) sv+=step(sc.z-0.00015"):]
old=old[:old.index("\n")+1]
rep(old,"      for(int i=-1;i<=1;i++) for(int j=-1;j<=1;j++) sv+=shBil(sc.xy+vec2(float(i),float(j))*(1.5/2048.0), sc.z-0.00015);\n")
rep("sv=smoothstep(0.15,0.85,sv/25.0);","sv=smoothstep(0.0,1.0,sv/9.0);")
# --- 2 grounding: instancing + stronger
rep("'#include <project_vertex>\\n  { vec3 wpG = (modelMatrix * vec4(transformed, 1.0)).xyz; gLod = length(wpG.xz); vGA = wpG.y - hgt(wpG.xz + uGOff); vGD = normalize(mat3(modelMatrix) * objectNormal).y; }'",
    "'#include <project_vertex>\\n  { vec4 lpG = vec4(transformed, 1.0); vec3 lnG = objectNormal;\\n#ifdef USE_INSTANCING\\n  lpG = instanceMatrix * lpG; lnG = mat3(instanceMatrix) * lnG;\\n#endif\\n  vec3 wpG = (modelMatrix * lpG).xyz; gLod = length(wpG.xz); vGA = wpG.y - hgt(wpG.xz + uGOff); vGD = normalize(mat3(modelMatrix) * lnG).y; }'")
rep("vec3 cc = mix(diffuseColor.rgb * 0.55, uContact, 0.45); diffuseColor.rgb = mix(cc, diffuseColor.rgb, smoothstep(0.0, uGBand, vGA)); diffuseColor.rgb = mix(diffuseColor.rgb, cc, smoothstep(0.1, -0.7, vGD) * 0.45);",
    "vec3 cc = mix(diffuseColor.rgb * 0.5, uContact, 0.5); diffuseColor.rgb = mix(cc, diffuseColor.rgb, smoothstep(-0.1, uGBand, vGA)); diffuseColor.rgb = mix(diffuseColor.rgb, cc, smoothstep(0.1, -0.7, vGD) * 0.55); /* dunkle (nie schwarze) Kontaktzone unten + Unterseiten */")
rep("uGBand: { value: 0.8 }","uGBand: { value: 1.3 }")
rep("castFront(scn); cache.set(info.id, scn);","castFront(scn); scn.traverse((m) => { if (m.isMesh) for (const mm of [].concat(m.material)) addGrounding(mm) }); cache.set(info.id, scn);")
# --- 3 rocks smooth clay
rep("const g = new THREE.IcosahedronGeometry(1, 1), pa","const g = new THREE.IcosahedronGeometry(1, 2), pa")
rep("const mat = new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0, flatShading: true }); addGrounding(mat)","const mat = new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0 }); addGrounding(mat)")
# --- 4 rock placement: lowest footprint point + half tilt into slope
rep("let g = hgt(rx, rz); for (let a = 0; a < 4; a++) g += hgt(rx + Math.cos(a * 1.571) * sc * 0.8, rz + Math.sin(a * 1.571) * sc * 0.8); g /= 5 // mittlere Bodenhöhe: hangab sieht man mehr Stein, hangauf weniger",
    "let g = hgt(rx, rz), gmin = g; for (let a = 0; a < 8; a++) { const hv = hgt(rx + Math.cos(a * 0.785) * sc * 1.3, rz + Math.sin(a * 0.785) * sc * 1.3); g += hv; gmin = Math.min(gmin, hv) } g /= 9 // Fußkreis 1,3 × Größe, 8 Richtungen")
rep("ax.set(Math.sin(ld), 0, -Math.cos(ld)); q1.setFromAxisAngle(ax, lean); q2.setFromAxisAngle(up, hh2(i - k, j) * 6.283); q1.multiply(q2)\n        pos.set(rx, g + 0.8 * sc - sink * hgtR, rz); scl.set(sc, sc, sc)",
    "ax.set(Math.sin(ld), 0, -Math.cos(ld)); q1.setFromAxisAngle(ax, lean); q2.setFromAxisAngle(up, hh2(i - k, j) * 6.283); q1.multiply(q2)\n        nrm.set(-gx, 1, -gz).normalize().lerp(up, 0.5).normalize(); q3.setFromUnitVectors(up, nrm); q1.premultiply(q3) // halb in den Hang gekippt\n        pos.set(rx, Math.min(g + 0.8 * sc - sink * hgtR, gmin + 0.2 * sc), rz); scl.set(sc, sc, sc) // nie über dem tiefsten Bodenpunkt schweben")
rep("const up = new THREE.Vector3(0, 1, 0), ax = new THREE.Vector3(),","const up = new THREE.Vector3(0, 1, 0), nrm = new THREE.Vector3(), q3 = new THREE.Quaternion(), ax = new THREE.Vector3(),")
rep("tanMax = Math.tan(Math.min(S.cliff + 22, 75) * Math.PI / 180),","tanMax = Math.tan(Math.min(S.cliff + 12, 70) * Math.PI / 180),")
# --- 5 LOD start beyond rock radius, global min edge slightly softer
rep("0.5*smoothstep(80.0,450.0,gLod));","0.5*smoothstep(200.0,500.0,gLod));")
rep("max(max(mix(0.5,0.03,uSharp),0.16),","max(max(mix(0.5,0.03,uSharp),0.22),")
rep("const w = Math.max(Math.max(0.5 + (0.03 - 0.5) * S.sharp, 0.16), 0.5 * sstep(80, 450,","const w = Math.max(Math.max(0.5 + (0.03 - 0.5) * S.sharp, 0.22), 0.5 * sstep(200, 500,")
open(p,'w').write(s); print('ok')
