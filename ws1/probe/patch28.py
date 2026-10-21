import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:90]}')
    s=s.replace(a,b)
rep('<div class="row"><label for="sharp">Terrassen-Kante</label><output id="o_sharp"></output><input type="range" id="sharp" min="0" max="1" step="0.01"></div>',
    '<div class="row"><label for="sharp">Terrassen-Kante</label><output id="o_sharp"></output><input type="range" id="sharp" min="0" max="1" step="0.01"></div>\n        <div class="row"><label for="maxslope">Max. Hangneigung</label><output id="o_maxslope"></output><input type="range" id="maxslope" min="30" max="80" step="1" value="52"></div>')
rep("'steps', 'sharp', 'water',","'steps', 'sharp', 'maxslope', 'water',")
rep("sharp: (v) =>","maxslope: (v) => (v >= 80 ? 'aus' : `${v}°`), sharp: (v) =>")
rep("terraceEdge: +S.sharp.toFixed(2),","terraceEdge: +S.sharp.toFixed(2), maxSlopeDeg: S.maxslope,")
rep("num('sharp', st.terraceEdge);","num('sharp', st.terraceEdge); p.maxslope = typeof st.maxSlopeDeg === 'number' ? st.maxSlopeDeg : 80;")
# uniform
rep("uSteps: { value: 0 }, uSharp: { value: 0.5 }, uEther: { value: 1 },","uSteps: { value: 0 }, uSharp: { value: 0.5 }, uEther: { value: 1 }, uTanMax: { value: 1.28 },")
rep("uniform float uScale, uAmp, uOct, uRidge, uWarp, uMacro, uValley, uPlateau, uSteps, uSharp, uEther;","uniform float uScale, uAmp, uOct, uRidge, uWarp, uMacro, uValley, uPlateau, uSteps, uSharp, uEther, uTanMax;")
rep("uSteps: U.uSteps, uSharp: U.uSharp, uEther: U.uEther,","uSteps: U.uSteps, uSharp: U.uSharp, uEther: U.uEther, uTanMax: U.uTanMax,")
rep("U.uOrg.value = S.org ? 1 : 0;","U.uOrg.value = S.org ? 1 : 0; U.uTanMax.value = S.maxslope >= 80 ? 1e6 : Math.tan(S.maxslope * Math.PI / 180);")
# GLSL terraces: slope limit (riser slope ≈ 0.75·amp·g / w)
rep("float w=max(max(mix(0.5,0.03,uSharp),0.16), clamp(2.6*gNE*uSteps*gG/0.7,0.0,0.5));",
    "float w=max(max(max(mix(0.5,0.03,uSharp),0.16), clamp(2.6*gNE*uSteps*gG/0.7,0.0,0.5)), clamp(0.75*uAmp*gG/(0.7*uTanMax),0.0,0.5));   /* max. Hangneigung: Wand nie steiler als uTanMax */")
rep("float w=max(mix(0.5,0.03,uSharp), clamp(2.6*gNE*uSteps*gG,0.0,0.5));",
    "float w=max(max(mix(0.5,0.03,uSharp), clamp(2.6*gNE*uSteps*gG,0.0,0.5)), clamp(0.75*uAmp*gG/uTanMax,0.0,0.5));")
# JS mirror
rep("const w = Math.max(Math.max(0.5 + (0.03 - 0.5) * S.sharp, 0.16), Math.min(0.5, 2.6 * NEJ * S.steps * gG / 0.7));",
    "const tanMax = S.maxslope >= 80 ? 1e6 : Math.tan(S.maxslope * Math.PI / 180), w = Math.max(Math.max(0.5 + (0.03 - 0.5) * S.sharp, 0.16), Math.min(0.5, 2.6 * NEJ * S.steps * gG / 0.7), Math.min(0.5, 0.75 * S.amp * gG / (0.7 * tanMax)));")
rep("const w = Math.max(0.5 + (0.03 - 0.5) * S.sharp, Math.min(0.5, 2.6 * NEJ * S.steps * gG));",
    "const tanMax2 = S.maxslope >= 80 ? 1e6 : Math.tan(S.maxslope * Math.PI / 180), w = Math.max(0.5 + (0.03 - 0.5) * S.sharp, Math.min(0.5, 2.6 * NEJ * S.steps * gG), Math.min(0.5, 0.75 * S.amp * gG / tanMax2));")
# 70s bands loosely follow contours
rep("float v=f*uBands+0.8*length(q)+tt*0.6;","float v=f*uBands+0.8*length(q)+tt*0.6+hn*uBands*0.9;   /* lose an die Höhenlinien gebunden: folgt der Landform, ohne reine Höhenstufe zu werden */")
s=s.replace('kfb-gelaende-probe-6','kfb-gelaende-probe-7')
open(p,'w').write(s); print('ok')
