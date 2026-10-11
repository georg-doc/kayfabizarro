// V-128 racer VFX (Vorlage-Zeile 11.10., Steuerung: freigegeben). Joyride J17 1:1:
//   · clay particles  vendor/clay-vfx.v1.js + clay-particle-profiles.v1.json (unchanged), root = the J17 track group (track metres,
//                     as J17's world), biome 'canyon' = J17's track biome (A.trackBiome; the M2 track zone has no city / nature mix)
//   · player car      joyride-drive.j10.js l.300–314: roll dust from the rear wheels, drift crumbs, boost puffs, barrier scrape +
//                     barrier wobble (WOB.hit), landing; numbers from joyride.j06.json "vfx" / drive.wall.wobble
//   · barrier wobble  lean-pass.l2.js makeWobble() (l.94–99, 1:1) on the track's strang materials
// Lab difference: j10 takes the rear wheel contact points from the car model's wheel nodes (car_*_wheel_rear_*); the Lab cars
// (Cicada FBX / KayKit) have no named wheel nodes, so the points are the car's rear corners from its box (±0.38 width, −0.36 length).
// FOV with speed / boost (j10 l.332) is already in drive.ts chase (FAHREN only).
import * as THREE from 'three';
import { makeClayVFX } from './vendor/clay-vfx.v1.js';
import PP from './vendor/clay-particle-profiles.v1.json';
import RC from './vendor/joyride.j06.json';

/** lean-pass.l2.js:94–99 1:1 */
export function makeWobble() { const U = { uWobP: { value: new THREE.Vector3(0, -9999, 0) }, uWobT0: { value: -99 }, uWobA: { value: 0 }, uWobTime: { value: 0 } };
  const code = 'float wobT = uWobTime - uWobT0; float wobD = distance(position, uWobP); transformed += normal * (uWobA * exp(-wobT * 4.2) * sin(wobT * 24.0) * (1.0 - smoothstep(1.5, 11.0, wobD)) * step(0.0, wobT));';
  const patch = (m: any) => { if (!m || m.userData.wob) return; m.userData.wob = true; const ob = m.onBeforeCompile, ck = m.customProgramCacheKey;
    m.onBeforeCompile = (sh: any, r: any) => { ob && ob.call(m, sh, r); Object.assign(sh.uniforms, U); sh.vertexShader = 'uniform vec3 uWobP;\nuniform float uWobT0, uWobA, uWobTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n' + code); };
    m.customProgramCacheKey = () => (ck ? ck.call(m) : '') + '-wob1'; m.needsUpdate = true; };
  return { U, patch, hit(p: THREE.Vector3, a: number, t: number) { U.uWobP.value.copy(p); U.uWobA.value = a; U.uWobT0.value = t; }, tick(t: number) { U.uWobTime.value = t; } }; }

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

export function createRaceFX(root: THREE.Object3D, camera: THREE.Camera, o: { accent?: () => string; wobble?: THREE.Material[]; biome?: string; trackScale: number }) {
  /* the VFX culls by camera distance in ITS units: give it the camera in the root's frame (track metres), not the lab camera */
  const camLocal = { position: new THREE.Vector3() }, VX: any = (makeClayVFX as any)(root, PP, { camera: camLocal, accent: o.accent }), VP: any = (RC as any).vfx, WALL = (RC as any).drive?.wall?.wobble ?? 0.55;
  const WOB = makeWobble(); for (const m of o.wobble ?? []) WOB.patch(m);
  const bio = o.biome ?? 'canyon', pk: any = {}, v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
  let t = 0; const ev = { roll: 0, drift: 0, boost: 0, scrape: 0, landing: 0 };
  return {
    /** per frame while the car exists. d = k2b driver, P = pose(d, q) (track metres), q = frame at d.s, car = the Lab car (lab units) */
    update(dt: number, d: any, P: any, q: any, car: THREE.Object3D, on: boolean) {
      t += dt; WOB.tick(t); camLocal.position.copy(camera.position); root.worldToLocal(camLocal.position); VX.update(dt); if (!on || !P || !q) return;
      const vF = v3(P.F), vU = v3(P.U), vX = v3(P.X), pos = v3(P.P), gy = q.p[1], v = Math.abs(d.speed), e = clamp(v / 30, 0, 1), carry = vF.clone().multiplyScalar(v * VP.carry);
      const sz = (car.userData.size ?? { length: 6, width: 2.6 }) as any, L = sz.length / o.trackScale, W = sz.width / o.trackScale;
      const rear = [-1, 1].map((sd) => pos.clone().addScaledVector(vF, -L * 0.36).addScaledVector(vX, sd * W * 0.38).addScaledVector(vU, 0.08));
      if (!d.fly && d.onGround && v > 3) {
        pk.rAcc = (pk.rAcc || 0) + dt * VP.rollRate * e; while (pk.rAcc >= 1) { pk.rAcc -= 1; pk.side = 1 - (pk.side || 0); const p = rear[pk.side % 2];
          VX.emit('roll', bio, { pos: p, dir: vF.clone().multiplyScalar(-1).addScaledVector(vU, 0.45), groundY: gy, count: 1, carry, sizeK: VP.rollSize, speedK: VP.rollSpeed }); ev.roll++; }
        if (d.drift > 0.2) { pk.dAcc = (pk.dAcc || 0) + dt * VP.driftRate * d.drift; while (pk.dAcc >= 1) { pk.dAcc -= 1; const out = -(d.driftDir || 1); for (const p of rear) {
          VX.emit('drift', bio, { pos: p, dir: vF.clone().multiplyScalar(-1).addScaledVector(vX, out * 0.25).addScaledVector(vU, 0.3), groundY: gy, count: 1, carry, sizeK: VP.driftSize, speedK: VP.driftSpeed }); ev.drift++; } } }
        if (d.boosting) { pk.bAcc = (pk.bAcc || 0) + dt * VP.boostRate; while (pk.bAcc >= 1) { pk.bAcc -= 1; const p = pos.clone().addScaledVector(vU, 0.45).addScaledVector(vF, -L / 2 - 0.2);
          VX.emit('boost', bio, { pos: p, dir: vF.clone().multiplyScalar(-1).addScaledVector(vU, 0.06), groundY: gy, count: 1, carry: vF.clone().multiplyScalar(v * 0.5), sizeK: VP.boostSize, jitter: 0.05 }); ev.boost++; } } }
      for (const e2 of d.events ?? []) {
        if (e2.type === 'hit') { const side = e2.side, cp = v3(q.p).addScaledVector(v3(q.R), q.c + side * (q.half + 0.5)).addScaledVector(v3(q.U), 0.8);
          WOB.hit(cp, WALL * e2.energy, t); VX.emit('scrape', bio, { pos: cp, dir: vF.clone().multiplyScalar(0.6).add(vU.clone().multiplyScalar(0.4)), groundY: gy, energy: e2.energy * 0.7, carry: vF.clone().multiplyScalar(v * 0.35), sizeK: VP.scrapeSize }); ev.scrape++; }
        if (e2.type === 'land') for (const p of rear) { VX.emit('landing', bio, { pos: p, dir: new THREE.Vector3(0, 1, 0), groundY: gy, energy: clamp(e2.energy, 0.4, 1) * 0.7, sizeK: VP.landSize }); ev.landing++; } }
    },
    state: () => ({ ...ev, ...VX.stats, tris: VX.tris }),
    vfx: VX,
  };
}
export type RaceFX = ReturnType<typeof createRaceFX>;
