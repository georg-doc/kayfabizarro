// Card-Hex Ascent · VFX consequence owner. Reuses the Combat sprite/trail/atlas foundation.
// One authoritative consequence event → exactly one impact VFX emit (+ its resolved secondaries).
import * as THREE from 'three';
import { SpriteFx } from '../../modules/kfb-fx-sprites.js';
import { TrailFx } from '../../modules/kfb-fx-trails.js';
import { buildAtlas } from '../../modules/kfb-combat-atlas.js';
import { resolveImpact } from '../../modules/kfb-combat-def.js';
import { MUZZLE } from '../../modules/kfb-vfx-recipes.js';

const WEAPON_MUZZLE = { blaster: MUZZLE.schnell, rifle: MUZZLE.schrot ?? MUZZLE.schnell, minigun: MUZZLE.schnell };

export class ConsequenceFx {
  constructor(scene) {
    this.scene = scene; this.counts = { muzzle: 0, impact: 0, land: 0, defeat: 0, reward: 0 }; this.state = 'BOOTING';
  }
  async boot() {
    let ink = null; try { ink = await import('../../cardbuilder/kfb-ink-canon.js'); } catch (e) { ink = null; }
    this.atlas = buildAtlas(THREE, ink, 256);
    this.sprites = new SpriteFx(THREE, this.scene, { atlas: { tex: this.atlas.texture, cols: this.atlas.cols, rows: this.atlas.rows, cells: this.atlas.cells }, cap: 220 });
    this.trails = new TrailFx(THREE, this.scene, { cap: 12, maxPts: 24 });
    this.state = 'READY · atlas ' + this.atlas.cols + '×' + this.atlas.rows + (this.atlas.inked ? ' · inked' : '');
  }
  // Muzzle flash at socket_muzzle on the clip fire frame, oriented along the barrel (+Z of the socket).
  muzzle(pos, dir, weapon = 'blaster') {
    if (!this.sprites) return; this.counts.muzzle++;
    const r = WEAPON_MUZZLE[weapon] ?? MUZZLE.schnell, p = r.primaer;
    const at = pos.clone().addScaledVector(dir, 0.08);
    this.sprites.emit(p.zelle === 'star' ? 'muzzle' : p.zelle, at, { size: p.groesse * (weapon === 'minigun' ? 0.8 : 1), life: p.dauer / 1000 * 2.2, op: p.op, pop: true, color: 0xfff3cf, seed: this.counts.muzzle });
    for (const t of r.tertiaer ?? []) this.sprites.emit(t.zelle, at, { size: t.groesse, life: t.dauer / 1000 * 2, op: t.op, vel: dir.clone().multiplyScalar(2.5), seed: this.counts.muzzle + 7 });
  }
  // Exactly one impact consequence per confirmed hit, at the actual hit point.
  impact(point, { energy = 'kinetic', surface = 'flesh', heavy = false } = {}) {
    if (!this.sprites) return null; this.counts.impact++;
    const z = resolveImpact(energy, surface, heavy);
    this.sprites.emit(z.cell, point, { size: z.size, color: z.tint, life: 0.32, pop: true, seed: this.counts.impact });
    if (z.sec) for (const [name, n] of z.sec) this.sprites.scatter?.(name, point, n, { seed: this.counts.impact * 3 });
    return z;
  }
  land(point, strength = 1) { if (!this.sprites) return; this.counts.land++; this.sprites.emit('puff', point, { size: 0.45 * strength, life: 0.35, color: 0xd9c9a3, grow: 0.6, op: 0.75, seed: this.counts.land }); }
  defeat(point) { if (!this.sprites) return; this.counts.defeat++; this.sprites.emit('smoke', point, { size: 1.1, life: 0.9, color: 0xcfc3a8, grow: 0.8, op: 0.8, seed: 99 + this.counts.defeat }); }
  reward(point) { if (!this.sprites) return; this.counts.reward++; this.sprites.emit('star', point, { size: 0.7, life: 0.6, color: 0xf2c94c, pop: true, seed: 300 + this.counts.reward }); }
  trail(opts) { return this.trails?.start({ color: 0xfff3cf, width: 0.07, life: 0.18, op: 0.8, ...opts }); }
  step(dt, cam) { try { this.sprites?.step(dt, cam); } catch (e) { this.err = String(e.message || e); } try { this.trails?.step(dt, cam); } catch (e) { this.err = String(e.message || e); } }
  stats() { return { state: this.state, counts: { ...this.counts }, sprites: this.sprites?.stats?.() ?? null, err: this.err ?? null }; }
  clear() { this.sprites?.clear?.(); }
}
