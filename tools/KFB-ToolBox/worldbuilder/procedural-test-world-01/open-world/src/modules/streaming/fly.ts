// Flythrough test mode: moves the chunk focus through new terrain at a fixed speed along a gently curving path.
// Game mode (player present): the player is teleported along the path every frame (place()) so its ground and
// colliders stream with it; in all modes a high chase view (camera override) follows the path.
import * as THREE from 'three';
import type { CameraView, CoreContext } from '../../core/types';

type Placeable = { position: THREE.Vector3; place?(x: number, y: number, z: number, h?: number): void; spawn?(x: number, y: number, z: number, h?: number): void };
type Kfb = { setCamera(v: CameraView | string): void };

export class Flythrough {
  active = false;
  t = 0;
  x = 0;
  z = 0;
  private y = 0;
  private camY = 0;
  private h0 = 0;
  private mine: CameraView | null = null;
  /** Exact frame times while flying (ms). */
  frames: number[] = [];
  distance = 0;
  onDone: ((r: ReturnType<Flythrough['summary']>) => void) | null = null;

  constructor(private ctx: CoreContext, public speed = 12, public secs = 60) {}

  start(x: number, z: number, headingDeg: number): void {
    this.active = true;
    this.t = 0;
    this.x = x;
    this.z = z;
    this.y = this.ctx.world.heightAt(x, z);
    this.camY = this.y + 24;
    this.h0 = THREE.MathUtils.degToRad(headingDeg);
    this.frames = [];
    this.distance = 0;
  }

  stop(): void {
    this.active = false;
  }

  heading(t = this.t): number {
    return this.h0 + 0.45 * Math.sin(t * 0.045) + 0.2 * Math.sin(t * 0.13);
  }

  /** Per frame; `frameMs` = measured frame time of this tick. */
  update(dt: number, frameMs: number): void {
    if (!this.active) return;
    const ov = this.ctx.getCameraOverride();
    const player = this.ctx.services.get<Placeable>('player');
    const rig = this.ctx.services.get('cameraRig');
    const usePlayer = !!(player && rig);
    // someone else (a verification preset) took the camera → pause until restarted
    if (ov && ov !== this.mine) {
      this.active = false;
      return;
    }
    if (frameMs > 0 && this.t > 0.5) this.frames.push(frameMs);
    dt = Math.min(dt, 0.1);
    this.t += dt;
    const h = this.heading();
    const dx = Math.cos(h) * this.speed * dt, dz = Math.sin(h) * this.speed * dt;
    this.x += dx;
    this.z += dz;
    this.distance += Math.hypot(dx, dz);
    const ground = this.ctx.world.heightAt(this.x, this.z);
    this.y += (ground - this.y) * (1 - Math.exp(-dt / 0.35));
    if (usePlayer) {
      const p = player!;
      // player heading convention: atan2(dir.x, dir.z) (three.js Y rotation of a +Z-forward model)
      const ph = Math.atan2(Math.cos(h), Math.sin(h));
      if (p.place) p.place(this.x, ground + 0.02, this.z, ph);
      else p.spawn?.(this.x, ground + 0.02, this.z, ph);
    }
    {
      // the chase view also in game mode: a follow camera behind a player teleported through trees and rocks at
      // 12 m/s ends up inside crowns/rocks (test-mode artefact, not streaming); the high chase view never does
      // (shows the streamed ground ahead and the fog edge; never below the terrain under it)
      const fx = Math.cos(h), fz = Math.sin(h);
      const cx = this.x - fx * 36, cz = this.z - fz * 36;
      const camGround = this.ctx.world.heightAt(cx, cz);
      this.camY += (Math.max(this.y, camGround) + 24 - this.camY) * (1 - Math.exp(-dt / 0.6));
      const tgt: [number, number, number] = [this.x + fx * 30, this.y + 1, this.z + fz * 30];
      this.mine = { position: [cx, this.camY, cz], target: tgt, fov: 50 };
      const k = (window as unknown as { __kfb?: Kfb }).__kfb;
      k?.setCamera(this.mine);
    }
    if (this.secs > 0 && this.t >= this.secs) {
      this.active = false;
      // hand the camera back to the game (follow) where there is a player
      if (usePlayer) (window as unknown as { __kfb?: Kfb }).__kfb?.setCamera('follow');
      this.mine = null;
      const r = this.summary();
      console.log('[streaming] flythrough done', JSON.stringify(r));
      this.onDone?.(r);
    }
  }

  summary() {
    const a = [...this.frames].sort((x, y) => x - y);
    const N = a.length;
    const q = (p: number) => (N ? +a[Math.min(N - 1, Math.floor(p * N))].toFixed(1) : 0);
    const sum = a.reduce((s, x) => s + x, 0);
    return {
      speed: this.speed,
      seconds: +this.t.toFixed(1),
      distanceM: +this.distance.toFixed(0),
      frames: N,
      fpsAvg: N ? +((N / sum) * 1000).toFixed(1) : 0,
      p50: q(0.5),
      p95: q(0.95),
      p99: q(0.99),
      max: N ? +a[N - 1].toFixed(1) : 0,
      over33: a.filter((x) => x > 33.4).length,
      over50: a.filter((x) => x > 50).length,
    };
  }
}
