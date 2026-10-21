import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:90]}')
    s=s.replace(a,b)
# 1) beams reach the pool: fade only last ~2 m
rep("LP.aimBeam(b, _dO, _dD, len); b.material.uniforms.uFade.value = 0.7; od.visible = false",
    "LP.aimBeam(b, _dO, _dD, len); b.material.uniforms.uFade.value = Math.max(0.6, 1 - 2.2 / len); b.material.uniforms.uOp.value = 0.42; od.visible = false   /* Strahl reicht sichtbar bis an die Pfütze, blendet nur auf den letzten ~2 m aus */")
rep("const len = LP.hitDistance(_dO, _dD, { ground: surfH, maxLen: 70 }) * 1.06;","const len = LP.hitDistance(_dO, _dD, { ground: surfH, maxLen: 70 }) + 0.6;")
# 2) backdrops with form: lit/shade side (toon steps), strata, rim
rep("""      fragmentShader: `uniform vec3 uHorizon; ${GLSL_SKY}
      uniform float uK, uTop; uniform vec3 uSil; varying vec3 vWk; varying float vHk;
      void main(){ vec3 rd=normalize(vWk-cameraPosition); float base=1.0-smoothstep(0.0,0.35,vHk/max(1.0,uTop));   /* Fuß im Bodendunst */
        gl_FragColor=vec4(mix(uSil, skyColor(rd), clamp(uK+(1.0-uK)*base,0.0,1.0)),1.0); }` }))""",
"""      fragmentShader: `${GLSL_NOISE}\\nuniform vec3 uHorizon; ${GLSL_SKY}
      uniform float uK, uTop; uniform vec3 uSil; varying vec3 vWk; varying float vHk;
      void main(){ vec3 rd=normalize(vWk-cameraPosition); float hN=clamp(vHk/max(1.0,uTop),0.0,1.0); float base=1.0-smoothstep(0.0,0.35,hN);   /* Fuß im Bodendunst */
        /* Form statt Fläche: gemalte Licht- und Schattenseite zur Sonne (3 Stufen), Gesteinsbänder, hellere Kammlinie */
        vec2 d2=normalize(vWk.xz-cameraPosition.xz); vec3 nr=vec3(-d2.x,0.0,-d2.y); vec3 tg=vec3(-d2.y,0.0,d2.x);
        float nA=snoise(d2*5.0+vec2(hN*1.3,uK*7.0))*0.8+0.2*snoise(d2*13.0-vec2(uK*3.0,hN));
        vec3 fn=normalize(nr+vec3(0.0,0.35+0.5*hN,0.0)+tg*nA*0.9);
        float lit=clamp(dot(fn,uSunDir)*0.6+0.5,0.0,1.0); float ls=lit*3.0; lit=(floor(ls)+smoothstep(0.0,0.25,fract(ls)))/3.0;
        vec3 col=uSil*mix(0.74,1.2,lit);
        float sb=fract(hN*3.2+0.35*snoise(d2*3.0+vec2(4.0,uK))); col*=mix(1.0,0.9,smoothstep(0.42,0.5,sb)*(1.0-smoothstep(0.92,1.0,sb)));
        col=mix(col, col*1.12+0.02, smoothstep(0.86,1.0,hN));
        gl_FragColor=vec4(mix(col, skyColor(rd), clamp(uK*0.92+(1.0-uK)*base,0.0,1.0)),1.0); }` }))""")
# 3) air with depth layers + patchy banks (world-anchored)
rep("uniform float uHzGlow, uSunHalo, uSky2, uFogB, uFogHa, uFogHb, uEdgeR;","uniform float uHzGlow, uSunHalo, uSky2, uFogB, uFogHa, uFogHb, uEdgeR; uniform vec2 uAirOff;")
rep("    float f=1.0-(1.0-fd)*exp(-max(fh,0.0));\n    f=clamp(f*mix(1.0,1.2,1.0-ndl),0.0,1.0);",
"""    vec2 wq=(wp.xz+uAirOff)/650.0; float bank=0.5+0.5*(snoise(wq)*0.7+snoise(wq*2.3+3.1)*0.3);   /* Nebelbänke statt gleichmäßiger Wand (weltfest) */
    fd=1.0-pow(1.0-fd, mix(0.7,1.45,bank)); fh*=mix(0.5,1.8,bank);
    float f=1.0-(1.0-fd)*exp(-max(fh,0.0));
    f=clamp(f*mix(1.0,1.2,1.0-ndl),0.0,1.0);
    float fs=f*4.0; float lay=floor(fs); f=mix(f, (lay+smoothstep(0.0,0.35,fract(fs)))/4.0, 0.45);   /* gemalte Luft-Staffeln: 4 leicht abgestufte Schichten */""")
rep("    vec3 sky=skyColor(rd); vec3 air=mix(mix(sky,uAirTint,0.35), sky, smoothstep(0.3,0.9,f));   /* farbige Staffel (H9) */",
    "    vec3 sky=skyColor(rd); vec3 air=mix(mix(sky,uAirTint,0.35), sky, smoothstep(0.3,0.9,f));   /* farbige Staffel (H9) */\n    air*=mix(vec3(1.0), vec3(0.95,0.97,1.03), clamp(lay/3.0,0.0,1.0)*(1.0-smoothstep(0.85,1.0,f)));   /* jede Schicht etwas kühler, am Horizont wieder Himmel */")
rep("U.uEdges = { value: 1 };","U.uEdges = { value: 1 }; U.uAirOff = { value: new THREE.Vector2() };")
rep("  const SKY = { uZenith: U.uZenith,","  const SKY = { uAirOff: U.uAirOff, uZenith: U.uZenith,")
rep("    updateVox();","    updateVox(); U.uAirOff.value.set(P.x, P.z);")
open(p,'w').write(s); print('ok')
