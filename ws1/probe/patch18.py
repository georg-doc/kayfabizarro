import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:90]}')
    s=s.replace(a,b)
rep('<div class="row"><label for="fstage">Flächen-Stufe</label>',
    '<div class="row"><label for="kus">Polka-Dot-Welt</label><select id="kus"><option value="0">aus</option><option value="1">Kürbis: Gelb mit schwarzen Punkten</option><option value="2">Infinity: Rot mit weißen Punkten</option><option value="3">Biom-Töne als Punkte</option></select></div>\n        <div class="row"><label for="fstage">Flächen-Stufe</label>')
rep("S.fstage = +$('fstage').value;","S.fstage = +$('fstage').value; S.kus = +$('kus').value;")
rep("if (p.fstage != null) $('fstage').value = p.fstage;","if (p.fstage != null) $('fstage').value = p.fstage; if (p.kus != null) $('kus').value = p.kus;")
rep("U.uFS.value = S.fstage;","""U.uFS.value = S.fstage; U.uKus.value = S.kus; { const A = PALETTES[S.palA], K = [null, ['#f5c400', '#151313'], ['#d8262e', '#fbf3e8'], [A.mid, A.cliff]][S.kus]; if (K) { U.uKusA.value.set(K[0]); U.uKusB.value.set(K[1]) } if (window.__rockc) window.__rockc.kus = S.kus }""")
rep("U.uFS = { value: 3 };","U.uFS = { value: 3 }; U.uKus = { value: 0 }; U.uKusA = { value: new THREE.Color() }; U.uKusB = { value: new THREE.Color() };")
rep("uniform float uEdges, uFg, uOrg, uFS, uDbg;","uniform float uEdges, uFg, uOrg, uFS, uDbg, uKus; uniform vec3 uKusA, uKusB;")
rep("color: { organicFields: S.org,","color: { polkaDot: ['aus', 'kuerbis', 'infinity', 'biom'][S.kus], organicFields: S.org,")
# shader: polka dots as 3D spheres cut by the terrain, size from light (dots carry the shading)
rep("    vec3 col=c*clayTone*(0.42+0.20*N.y+0.62*l);",
"""    vec3 col=c*clayTone*(0.42+0.20*N.y+0.62*l);
    // Polka-Dot-Welt (Kusama-Hommage, Georg 20.10.): Punkte sind Kugeln im Raum, die das Gelände anschneidet → runde Punkte auf jeder Neigung,
    // Größe variiert natürlich mit dem Schnitt; das Licht steckt in der Punktgröße (Schatten = dichtere, größere Punkte), Fläche fast flach
    if(uKus>0.5){ float cs3=3.4; vec3 P3=vW/cs3; vec3 cl3=floor(P3); vec3 fp=fract(P3)-0.5;
      vec3 hj=vec3(h21(cl3.xz+cl3.y*7.1), h21(cl3.zy*1.3+3.3), h21(cl3.yx*0.7-1.7)); vec3 o3=(hj-0.5)*0.24;
      float big=0.5+0.5*snoise(vW.xz/140.0+uSeed*0.1);
      float lt=clamp(l*0.85+0.15*N.y,0.0,1.0); float rad=mix(0.13,0.40,1.0-lt)*mix(0.75,1.18,big)*(0.85+0.3*hj.x);
      float dd=length(fp-o3)-rad; float aa=fwidth(dd)+1e-4; float pdot=1.0-smoothstep(-aa,aa,dd);
      vec3 kb=uKusA*(0.9+0.12*lt), kd=uKusB*(0.92+0.1*lt); col=mix(kb, kd, pdot)*clayTone; }""")
# rocks follow: dot colour (Kürbis-Logik)
rep("const A = PALETTES[S.palA]; ROCKC.mat.color.set(A.cliff).lerp(new THREE.Color(A.mid), 0.15).multiplyScalar(0.9)",
    "const A = PALETTES[S.palA]; ROCKC.mat.color.set(A.cliff).lerp(new THREE.Color(A.mid), 0.15).multiplyScalar(0.9); if (S.kus) ROCKC.mat.color.copy(U.uKusB.value)")
open(p,'w').write(s); print('ok')
