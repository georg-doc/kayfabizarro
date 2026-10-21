import sys
p='gelaende-probe.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    if s.count(a)!=n: sys.exit(f'{s.count(a)} x {a[:90]}')
    s=s.replace(a,b)
# GLSL: band-limit by grid spacing gNE
rep("  float gLod=0.0; // Abstand zum Auto (m): in der Ferne (grobe Ringe) Terrassen weicher, sonst Sägezähne; abstandsbasiert, damit Nah- und Ferngitter dieselbe Höhe haben",
    "  float gNE=2.34375; // Gitterabstand (m) des Meshes, das gerade rechnet; Grundwert = Nahgitter (600 m / 256), wie im JS\n  // Band-Begrenzung gegen Zacken (Aliasing): jedes Gitter bekommt nur Detail, das es abbilden kann (Wellenlänge ≥ 3–4 Gitterabstände)\n  float octW(float i, float f0){ float wl=uScale/(f0*pow(2.0,i)); return smoothstep(2.0,4.0,wl/gNE); }")
rep("for(int i=0;i<7;i++){ if(float(i)>=oc) break; s+=a*snoise(q); n+=a;","for(int i=0;i<7;i++){ if(float(i)>=oc) break; s+=a*octW(float(i),1.0)*snoise(q); n+=a;")
rep("float r=uEther>0.5 ? max(0.0,(1.0-sqrt(sn*sn+0.06))/0.7551) : 1.0-abs(sn); s+=a*r*r; n+=a;",
    "float r=uEther>0.5 ? max(0.0,(1.0-sqrt(sn*sn+0.06))/0.7551) : 1.0-abs(sn); float ow=octW(float(i),1.0); s+=a*mix(0.5,r*r,ow); n+=a;")
rep("    if(uPlateau<0.999 && h>uPlateau) h=uPlateau+(h-uPlateau)*0.12;",
    "    if(uPlateau<0.999){ float dP=h-uPlateau, kP=0.02+gNE/uAmp*0.6; h=uPlateau+dP*mix(1.0,0.12,smoothstep(-kP,kP,dP)); }   // Tafelkante mit weichem Knie (Breite je Gitter)")
rep("float w=max(max(mix(0.5,0.03,uSharp),0.22), 0.5*smoothstep(200.0,500.0,gLod));",
    "float w=max(max(mix(0.5,0.03,uSharp),0.22), clamp(gNE*uSteps/uAmp*1.5,0.0,0.5));   // Stufenkante ≥ ca. 2 Gitterabstände breit")
rep("gLod=distance(p,uCarW); float h=hgt(p);",
    "{ float chb=max(abs(p.x-uCarW.x),abs(p.y-uCarW.y)); gNE=mix(uNE, uNE*4.0, smoothstep(uNE*100.0, uNE*126.0, chb)); } float h=hgt(p);   // zum Rand hin wie das nächste, gröbere Gitter → keine Stufe an der Naht")
rep("gLod = length(wpG.xz); vGA","vGA")
# JS mirror
rep("  const LODC = { x: 0, z: 0 }; // Auto-Position für die abstandsabhängige Terrassen-Rundung (identisch zu gLod im Shader)\n",
    "  const NE0 = 600 / 256, octW = (i) => sstep(2, 4, (S.scale / Math.pow(2, i)) / NE0); // wie octW/gNE im Shader (Nahgitter)\n")
rep("for (let i = 0; i < 7 && i < oc; i++) { s += a * snoise(x, y); n += a;","for (let i = 0; i < 7 && i < oc; i++) { s += a * octW(i) * snoise(x, y); n += a;")
rep("const r = S.ether ? Math.max(0, (1 - Math.sqrt(sn * sn + 0.06)) / 0.7551) : 1 - Math.abs(sn); s += a * r * r; n += a;",
    "const r = S.ether ? Math.max(0, (1 - Math.sqrt(sn * sn + 0.06)) / 0.7551) : 1 - Math.abs(sn), ow = octW(i); s += a * (0.5 + (r * r - 0.5) * ow); n += a;")
rep("    if (S.plateau < 0.999 && h > S.plateau) h = S.plateau + (h - S.plateau) * 0.12;",
    "    if (S.plateau < 0.999) { const dP = h - S.plateau, kP = 0.02 + NE0 / S.amp * 0.6; h = S.plateau + dP * (1 + (0.12 - 1) * sstep(-kP, kP, dP)) }")
rep("const w = Math.max(Math.max(0.5 + (0.03 - 0.5) * S.sharp, 0.22), 0.5 * sstep(200, 500, Math.hypot(px - LODC.x, py - LODC.z)));",
    "const w = Math.max(Math.max(0.5 + (0.03 - 0.5) * S.sharp, 0.22), Math.min(0.5, Math.max(0, NE0 * S.steps / S.amp * 1.5)));")
rep(" LODC.x = P.x; LODC.z = P.z;","")
open(p,'w').write(s); print('ok')
