from pathlib import Path
import re
base=Path('tools/KFB-ToolBox/worldbuilder/procedural-test-world-01')
donor=Path('tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-track')
s=(donor/'track-look.v5.js').read_text()
a=(donor/'transition-atlas.v1.js').read_text()
out=base/'joyride-source';out.mkdir(exist_ok=True)
for name in ['road-markings.m1.js','road-markings.m2.js','road-markings.m1.json','road-markings.m2.json','transition-profiles.v1.json']:
 t=(donor/name).read_text()
 if name.endswith('.js'):t=t.replace('./road-markings.m1.js?r=4','./road-markings.m1.js')
 if name=='road-markings.m2.js':
  t=t.replace("rulebook = 'de'", "rulebook = 'de', connected = false")
  t=t.replace("const closedT = typeof window !== 'undefined' && window.__KFB_T4_PROPS && window.__KFB_T4_PROPS.closed;", 'const closedT = connected; // WB2 seam: graph connections, no global donor flags.')
 (out/name).write_text(t)
helpers=s[s.index('const clamp ='):s.index('export const WORLDS')]
profile=s[s.index('  // Krümmung'):s.index('  // Läufe mit Fahrfläche')]
w3=s[s.index('  const W3 ='):s.index('  const jIdx =')]
# Byte-preserved cross section and curvature. Both drawing and clearance call this factory.
(base/'joyride-profile.v1.mjs').write_text('''/* Extracted Joyride J14, pin 927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f.
 * track-look.v5.js helpers 38–43, W3 180, curvature/profile 183–217.
 * Seam: supplied immutable stream and presentation atlas; no new track owner. */
'''+helpers+'\nexport function createStrandProfile(stream, AT) {\n const S=stream.samples,N=S.length;\n'+w3+profile+'\n return {sideProfile,ringOf,W3,ks};\n}\n')
# Native transition grammar, relocated onto current stream stations. Absolute TD03 zones are not routes.
atlas=a[a.index('  const Lend ='):a.index('  const off = q')]
atlas=atlas.replace('S[i].p[1]', '(S[i].p[1]-groundY(S[i]))')
patch=a[a.index('// Knetflecken zwischen'):a.index('export function makeAtlas')]
(out/'transition-presentation.js').write_text("import * as THREE from 'three';\nimport {KFB_BLEND_GLSL} from './road-markings.m1.js';\n"+helpers+patch+'''\n// Extracted atlas lines 51–70; seam: terrain-relative height and recipe zones.
export function createPresentationAtlas(S, TP, groundY = () => -44) {
 const N=S.length,ds=S[1].s-S[0].s;
'''+atlas+'\n return {bio,w,barrierT,roadTrack,zones};\n}\n')
# Native ring, carriageway and correctly triangulated caps. Remove dead fallback fan; fail closed.
geom=s[s.index('  // Läufe mit Fahrfläche'):s.index('  // ---------- Boost-Pfeile')]
geom=geom.replace("  onNote('Strang wird gerollt …');",'')
start=geom.index('        for (let k = 0; k < nr; k++) for (let j = 0; j < 3; j++)')
end=geom.index('      sBase =',start)
geom=geom[:start]+"        throw Error('Joyride profile cap triangulation failed'); }\n"+geom[end:]
geom=geom.replace("addMesh(bake(lips), M.strang, { name: 'lippen' });", "if(lips.length) addMesh(bake(lips), M.strang, { name: 'lippen' });")
# Connected graph endcaps must stay below carriageway; original lip crosses travel surface.
geom=geom.replace('for (const i of [a, b]) {', 'for (const i of (connected ? [] : [a, b])) {')
roadshader=s[s.index('const ROAD_V ='):s.index('// M1.1 Überdeckung')]
mat=s[s.index('  {\n    const m = makeClayMaterial',s.index('const RU =')):s.index("  clay('strang'",s.index('const RU ='))]
header='''/* Actual Joyride J14/T4 drawing blocks, rehomed onto the WB2-owned stream.
 * See JOYRIDE_SOURCE_MAP.json. No renderer, input, route, support or frame loop. */
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {createStrandProfile} from './joyride-profile.v1.mjs';
import {createPresentationAtlas,patchify} from './joyride-source/transition-presentation.js';
import {buildRoadMarkingsM2} from './joyride-source/road-markings.m2.js';
import {KFB_BLEND_GLSL} from './joyride-source/road-markings.m1.js';
import {makeClayMaterial,seedGeometry,PROFILES} from '../../_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/lab-clay/clay-material.v10.js';
import {TOOLMIX} from '../../_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/lab-clay/clay-toolmix.v1.js';
'''
prof=s[s.index('const QUIET ='):s.index('// ---------- Fahrbahn:')]
setup='''
export function buildClayStrand(THREE, td, {U,palette,TP,MR,M2,groundY,connected=true,atlas=null}) {
 const S=td.samples,N=S.length,ds=td.ds||S[1].s-S[0].s,V=a=>new THREE.Vector3(...a);
 const AT=atlas||createPresentationAtlas(S,TP,groundY);
 const {ringOf,W3}=createStrandProfile(td,AT);
 const root=new THREE.Group(),info={tris:0},FIX={strangCap:true},LEAN=null,lips=[],K=3,M={};
 const addMesh=(g,mat,{name='' }={})=>{const m=new THREE.Mesh(g,mat);m.name=name;m.castShadow=m.receiveShadow=true;root.add(m);info.tris+=(g.index?g.index.count:g.attributes.position.count)/3;return m};
 const bake=parts=>mergeGeometries(parts.map(g=>{const n=g.index?g.toNonIndexed():g;n.deleteAttribute('uv');return n}),false);
 const clay=(key,color,profile,mix='strang')=>M[key]=makeClayMaterial(THREE,U,{src:new THREE.MeshStandardMaterial({color}),profile:{...profile,tools:TOOLMIX[mix],legacy:0}});
 const RU={uRoadA:{value:new THREE.Color(palette.rock)},uRoadB:{value:new THREE.Color(palette.rock).multiplyScalar(.72)},uRoadC:{value:new THREE.Color(palette.sand)}};
'''
setup+=mat+'''
 clay('strang',palette.rock,prof('house',.6,K,QUIET));
 clay('strangT',palette.rock,prof('house',.6,K,QUIET));
 const pu=patchify(M.strangT,'wb2-strand',1.7);pu.uPB.value.set(palette.sand);pu.uPC.value.set(palette.lip);
'''
geom=geom.replace('  const lips = [];','')
footer='''
 const markings=buildRoadMarkingsM2({THREE,S,N,ds,A:AT,M2,MR1:MR,seedGeometry,connected});
 clay('markH',palette.paved,prof('water',.9,K,{print:.2,dent:0}),null);
 clay('markS',palette.sand,prof('water',.9,K,{print:.2,dent:0}),null);
 if(markings.hell)addMesh(markings.hell,M.markH,{name:'M2 · native lane markings'});
 if(markings.signal)addMesh(markings.signal,M.markS,{name:'M2 · native signal markings'});
 root.userData.joyride={donor:'927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f',samples:N,centreErr:info.centreErr,markings:markings.pieces,triangles:info.tris,connected};
 root.userData.sourceRecord={assetId:'Joyride J14 / T4 strand',packId:'KFB Joyride J14',source:{commit:'927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f',path:'lab-track/track-look.v5.js',blobSha:'7c0d248391c3eaf1887a0afc97ee02b25f6dec85'}};
 return root;
}
'''
(base/'joyride-strand.v1.js').write_text(header+helpers+prof+roadshader+setup+geom+footer)
print('Extracted native profile, T4 atlas/shader, J14 strand/carriageway/caps and M2 markings; WB2 not wired yet.')
