// G0 FrizzleBob v5 · Modell allein: FB_TEMPLATE_LOOK_v5.glb (Blob 131d7c38 @19088b14) ohne jedes Gesichts-Rig, mit der three-Fassung
// des Spiels (0.186.1), neutrales Licht, drei Winkel. Dazu die Inventur aus dem geladenen Szenengraphen.
// Aufruf: node scripts/fb/model-alone.mjs <glb> <ausgabe-ordner>
import { chromium } from 'playwright'
import http from 'http'; import fs from 'fs'; import path from 'path'
const GLB = process.argv[2], OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true })
const NM = path.resolve('node_modules')
const PAGE = `<!doctype html><html><body style="margin:0;background:#d8d2c8"><script type="importmap">{"imports":{"three":"/nm/three/build/three.module.js","three/addons/":"/nm/three/examples/jsm/"}}</script>
<script type="module">
import * as THREE from 'three'; import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
const W=900,H=900, r=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true}); r.setSize(W,H); r.outputColorSpace=THREE.SRGBColorSpace; document.body.appendChild(r.domElement)
const sc=new THREE.Scene(); sc.background=new THREE.Color('#d8d2c8'); sc.add(new THREE.HemisphereLight(0xffffff,0x8a8070,1.6)); const d=new THREE.DirectionalLight(0xffffff,1.8); d.position.set(2,4,5); sc.add(d)
const g=await new GLTFLoader().loadAsync('/model.glb'); const fig=g.scene; sc.add(fig); fig.updateMatrixWorld(true)
const box=new THREE.Box3().setFromObject(fig), size=box.getSize(new THREE.Vector3()), c=box.getCenter(new THREE.Vector3())
const inv={ size:size.toArray().map(v=>+v.toFixed(3)), min:box.min.toArray().map(v=>+v.toFixed(3)), meshes:[], bones:[] }
fig.traverse(o=>{ if(o.isMesh) inv.meshes.push({name:o.name, skinned:!!o.isSkinnedMesh, parent:o.parent&&o.parent.name, mat:[].concat(o.material).map(m=>m.name), tex:[].concat(o.material).some(m=>!!m.map)}); if(o.isBone) inv.bones.push(o.name) })
const head=fig.getObjectByName('head'); const hp=head.getWorldPosition(new THREE.Vector3()); inv.headBone=hp.toArray().map(v=>+v.toFixed(3))
const cam=new THREE.PerspectiveCamera(28,W/H,0.05,100)
window.shot=(view,face)=>{ const t=face? new THREE.Vector3(0,hp.y+0.25,0): c.clone(); const dist=face? 2.2: size.y*2.4; const a={front:0,q:Math.PI/4,side:Math.PI/2}[view]
  cam.position.set(Math.sin(a)*dist, t.y+(face?0:0.2), Math.cos(a)*dist); cam.lookAt(t); r.render(sc,cam); return r.domElement.toDataURL('image/png') }
window.inv=inv; window.ready=true
</script></body></html>`
const srv = http.createServer((q, s) => { const u = decodeURIComponent(q.url.split('?')[0])
  if (u === '/') { s.writeHead(200, { 'Content-Type': 'text/html' }); return s.end(PAGE) }
  if (u === '/model.glb') { s.writeHead(200, { 'Content-Type': 'model/gltf-binary' }); return fs.createReadStream(GLB).pipe(s) }
  if (u.startsWith('/nm/')) { const f = path.join(NM, u.slice(4)); if (f.startsWith(NM) && fs.existsSync(f)) { s.writeHead(200, { 'Content-Type': 'text/javascript' }); return fs.createReadStream(f).pipe(s) } }
  s.writeHead(404); s.end() }).listen(8746)
const b = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu'] }), p = await b.newPage({ viewport: { width: 900, height: 900 } })
p.on('pageerror', (e) => console.log('pageerror', e.message))
await p.goto('http://localhost:8746/'); await p.waitForFunction(() => window.ready, null, { timeout: 60000 })
for (const [v, face] of [['front', 0], ['q', 0], ['side', 0], ['front', 1], ['q', 1]]) { const u = await p.evaluate(([v, f]) => window.shot(v, !!f), [v, face]); fs.writeFileSync(path.join(OUT, `model_${face ? 'face' : 'full'}_${v}.png`), Buffer.from(u.split(',')[1], 'base64')) }
const inv = await p.evaluate(() => window.inv); fs.writeFileSync(path.join(OUT, 'inventory.json'), JSON.stringify(inv, null, 1))
console.log(JSON.stringify({ size: inv.size, min: inv.min, head: inv.headBone, meshes: inv.meshes.length, bones: inv.bones.length }))
await b.close(); srv.close()
