// window.__kfb — the verification API used by tools/shoot.mjs and every critic. See ARCHITECTURE.md §7.
import * as THREE from 'three';
import type { Engine } from './engine';
import type { CameraView } from './types';

export interface OrbitView { target: [number, number, number]; yaw: number; pitch: number; dist: number; fov?: number }

const errors: string[] = [];
const warnings: string[] = [];

/** Capture console errors as early as possible (call before anything else). */
export function captureConsole(): void {
  const origErr = console.error.bind(console);
  const origWarn = console.warn.bind(console);
  console.error = (...a: unknown[]) => {
    errors.push(a.map(fmt).join(' '));
    origErr(...a);
  };
  console.warn = (...a: unknown[]) => {
    warnings.push(a.map(fmt).join(' '));
    origWarn(...a);
  };
  window.addEventListener('error', (e) => errors.push(`uncaught: ${e.message} @ ${e.filename}:${e.lineno}`));
  window.addEventListener('unhandledrejection', (e) => errors.push(`unhandled rejection: ${fmt(e.reason)}`));
}

function fmt(x: unknown): string {
  if (x instanceof Error) return `${x.name}: ${x.message}`;
  if (typeof x === 'object') {
    try {
      return JSON.stringify(x).slice(0, 300);
    } catch {
      return String(x);
    }
  }
  return String(x);
}

export function orbitToView(o: OrbitView): CameraView {
  const yaw = THREE.MathUtils.degToRad(o.yaw);
  const pitch = THREE.MathUtils.degToRad(o.pitch);
  const [tx, ty, tz] = o.target;
  return {
    position: [
      tx + o.dist * Math.cos(pitch) * Math.sin(yaw),
      ty + o.dist * Math.sin(pitch),
      tz + o.dist * Math.cos(pitch) * Math.cos(yaw),
    ],
    target: [tx, ty, tz],
    fov: o.fov,
  };
}

export function installDebug(engine: Engine): void {
  const presetFns = (): Record<string, () => CameraView> => {
    const out: Record<string, () => CameraView> = {};
    const focus = () => {
      const p = (engine.ctx.services.get('player') as { position?: THREE.Vector3 } | undefined)?.position ?? engine.chunks.focus;
      return [p.x, engine.world.heightAt(p.x, p.z), p.z] as [number, number, number];
    };
    out['overview'] = () => orbitToView({ target: focus(), yaw: 30, pitch: 38, dist: 95 });
    out['aerial'] = () => orbitToView({ target: focus(), yaw: 30, pitch: 58, dist: 230 });
    out['low'] = () => orbitToView({ target: focus(), yaw: 210, pitch: 12, dist: 40 });
    for (const m of engine.modules) {
      for (const [name, fn] of Object.entries(m.cameraPresets ?? {})) out[`${m.id}.${name}`] = () => fn(engine.ctx);
    }
    return out;
  };

  const api = {
    ready: false,
    errors,
    warnings,
    engine,
    stats: () => engine.stats(),
    presets: () => ['follow', ...Object.keys(presetFns())],
    /** 'follow' releases the override; a preset name; an OrbitView; or a CameraView. */
    setCamera(p: string | OrbitView | CameraView): void {
      if (p === 'follow') {
        engine.cameraOverride = null;
        return;
      }
      if (typeof p === 'string') {
        const fn = presetFns()[p];
        if (!fn) throw new Error(`unknown camera preset ${p}; have ${api.presets().join(', ')}`);
        engine.cameraOverride = fn();
      } else if ('position' in p) engine.cameraOverride = p;
      else engine.cameraOverride = orbitToView(p);
    },
    setTime(hours: number): boolean {
      const env = engine.ctx.services.get('environment') as { setTime?: (h: number) => void } | undefined;
      if (!env?.setTime) return false;
      env.setTime(hours);
      return true;
    },
    player(): unknown {
      const p = engine.ctx.services.get('player') as { debugState?: () => unknown } | undefined;
      return p?.debugState?.() ?? null;
    },
    /** Resolves once no chunk is pending around the current focus and two frames have rendered. */
    async waitIdle(timeoutMs = 20000): Promise<boolean> {
      const t0 = performance.now();
      while (performance.now() - t0 < timeoutMs) {
        // focus follows the override target inside tick(); force a build of everything due
        engine.chunks.buildAllNow();
        const f = engine.frame;
        await new Promise((r) => setTimeout(r, 50));
        if (engine.chunks.pending === 0 && engine.frame >= f + 2) return true;
      }
      return false;
    },
    cell(q: number, r: number) {
      return engine.world.cell(q, r);
    },
  };
  (window as any).__kfb = api;
}

export function markReady(): void {
  (window as any).__kfb.ready = true;
  // Remove the overlay at once: fading + delayed remove() over the canvas forced a compositor re-layer and a
  // 65–81 ms hitch ~0.5 s after ready (streaming r4 measurement). The world is complete at ready, so no fade needed.
  document.getElementById('loading')?.remove();
}
