// KFB Surface Lab · Inspector Donor Proof 01: three-inspect (threlte/three-inspect, MIT) on the real worldbuilder scene,
// plus a per-material-class profiler (draw calls, triangles, GPU or CPU frame cost with the class on/off).
// Dev only: ?inspect=1. Nothing here changes the world.
import * as THREE from 'three';

export type MeshClass = 'terrain-top' | 'underside' | 'grass-band' | 'paths' | 'water' | 'nature' | 'buildings' | 'residents' | 'clouds' | 'originals' | 'other';

export function classify(m: THREE.Object3D): MeshClass {
  let o: THREE.Object3D | null = m;
  while (o) {
    if (o.userData?.residentId) return 'residents';
    if (o.userData?.buildingId) return 'buildings';
    if (o.name === 'nature') return 'nature';
    if (o.name === 'clouds') return 'clouds';
    if (o.name === 'originals') return 'originals';
    if (o.name === 'ground') return 'terrain-top';
    if (o.name === 'under') return 'underside';
    if (o.name === 'band') return 'grass-band';
    if (o.name === 'paths') return 'paths';
    if (o.name === 'water') return 'water';
    o = o.parent;
  }
  return 'other';
}

/** GPU frame time via EXT_disjoint_timer_query_webgl2, else CPU time with a forced sync (readPixels). */
function makeTimer(renderer: THREE.WebGLRenderer) {
  const gl = renderer.getContext() as WebGL2RenderingContext;
  const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
  const px = new Uint8Array(4);
  return {
    kind: ext ? 'gpu' : 'cpu+sync',
    async time(draw: () => void, n = 40): Promise<number> {
      for (let i = 0; i < (n < 10 ? 2 : 5); i++) draw(); // warm-up (shader compile, uploads)
      const out: number[] = [];
      for (let i = 0; i < n; i++) {
        if (ext) {
          const q = gl.createQuery()!;
          gl.beginQuery(ext.TIME_ELAPSED_EXT, q);
          draw();
          gl.endQuery(ext.TIME_ELAPSED_EXT);
          await new Promise((r) => requestAnimationFrame(r));
          let tries = 0;
          while (!gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE) && tries++ < 60) await new Promise((r) => setTimeout(r, 4));
          if (!gl.getParameter(ext.GPU_DISJOINT_EXT)) out.push(gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6);
          gl.deleteQuery(q);
        } else {
          const t0 = performance.now();
          draw();
          gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
          out.push(performance.now() - t0);
        }
      }
      out.sort((a, b) => a - b);
      // trimmed mean of the middle half: robust against GPU clock / compositor noise
      const lo = Math.floor(out.length * 0.25), hi = Math.max(lo + 1, Math.ceil(out.length * 0.75));
      const mid = out.slice(lo, hi);
      return mid.reduce((a, b) => a + b, 0) / (mid.length || 1);
    },
  };
}

/** Per class: own draw calls / triangles / materials, and frame cost of the whole scene with and without that class. */
export async function profileClasses(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
  const meshes: { m: THREE.Mesh; c: MeshClass; vis: boolean }[] = [];
  scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) meshes.push({ m, c: classify(m), vis: m.visible }); });
  const classes = [...new Set(meshes.map((x) => x.c))];
  const timer = makeTimer(renderer);
  const prevAuto = renderer.info.autoReset;
  renderer.info.autoReset = false;
  const render = () => { renderer.info.reset(); renderer.render(scene, camera); };
  const setOnly = (c: MeshClass | null, except = false) => {
    for (const x of meshes) x.m.visible = x.vis && (c === null || (except ? x.c !== c : x.c === c));
  };
  setOnly(null);
  const full = await timer.time(render);
  render();
  const fullInfo = { calls: renderer.info.render.calls, tris: renderer.info.render.triangles };
  setOnly('__none__' as MeshClass); // baseline: clear, lights, shadow setup, no meshes
  const empty = await timer.time(render);
  const rows: Record<string, unknown>[] = [];
  for (const c of classes) {
    setOnly(c);
    render();
    const calls = renderer.info.render.calls, tris = renderer.info.render.triangles;
    const mats = new Set<string>();
    for (const x of meshes) if (x.c === c) for (const mm of Array.isArray(x.m.material) ? x.m.material : [x.m.material]) mats.add(mm.uuid);
    const only = await timer.time(render);
    // marginal = full minus scene-without-class, measured interleaved (A/B per sample) so GPU clock drift cancels out
    const diffs: number[] = [];
    for (let i = 0; i < 12; i++) {
      setOnly(null);
      const a = await timer.time(render, 4);
      setOnly(c, true);
      const b = await timer.time(render, 4);
      diffs.push(a - b);
    }
    diffs.sort((x, y) => x - y);
    const marginal = (diffs[5] + diffs[6]) / 2;
    rows.push({ class: c, meshes: meshes.filter((x) => x.c === c).length, materials: mats.size, calls, tris, onlyMs: +only.toFixed(2), marginalMs: +marginal.toFixed(2) });
  }
  setOnly(null);
  renderer.info.autoReset = prevAuto;
  rows.sort((a, b) => (b.onlyMs as number) - (a.onlyMs as number));
  return { timer: timer.kind, fullMs: +full.toFixed(3), emptyMs: +empty.toFixed(3), full: fullInfo, classes: rows };
}

export async function mountInspector(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
  const host = document.createElement('div');
  host.id = 'inspector';
  host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:20';
  document.body.appendChild(host);
  const st = document.createElement('style');
  st.textContent = '#inspector > * { pointer-events: auto; }';
  document.head.appendChild(st);
  const mod = await import('three-inspect/vanilla');
  const insp = mod.createInspector(host, { scene, camera, renderer });
  // the panes are position:fixed and open top left over the worldbuilder panel: move them to the right edge once (still draggable)
  // (they mount asynchronously and not inside `host`, so poll the document)
  for (let i = 0; i < 50; i++) {
    await new Promise((r) => setTimeout(r, 100));
    const panes = [...document.querySelectorAll<HTMLElement>('.draggable-container')];
    if (panes.length >= 2) {
      // move them with the library's own drag (synthetic pointer events on the title bar), so its stored position
      // stays in sync; setting style.left directly made the pane jump back on the first real drag
      for (const p of panes) {
        const bar = p.querySelector<HTMLElement>('.tp-rotv_t');
        if (!bar) continue;
        const r = bar.getBoundingClientRect();
        const x = r.left + r.width / 2, y = r.top + r.height / 2;
        const dx = innerWidth - p.getBoundingClientRect().right - 6;
        const ev = (type: string, cx: number) => bar.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: cx, clientY: y, pointerId: 1, isPrimary: true, button: 0, buttons: type === 'pointerup' ? 0 : 1 }));
        ev('pointerdown', x);
        ev('pointermove', x + dx / 2);
        ev('pointermove', x + dx);
        ev('pointerup', x + dx);
      }
      break;
    }
  }
  return insp;
}
