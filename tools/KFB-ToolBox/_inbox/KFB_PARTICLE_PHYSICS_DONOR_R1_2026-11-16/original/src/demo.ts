// The particle physics block's demo: liquid, jelly, cloth and smoke from one GPU library, Three.js Particle Fluids by
// Daniel Greenheck (MIT). Patch's block page steers it through Patch's block demo helper (lib/patch-block.js, from
// patch.gg/patch-block.js); the controls are in recipe.json.
//
// This file is the light part: it talks to the page at once, then loads the heavy code (boot.ts) behind import().
import { patchBlock } from 'patch-block';
import { block as recipeBlock } from '../recipe.json';
import { deviceLost, findAdapter, showTrouble } from './gpu-trouble.ts';
import type { App } from './app.ts';

/** With no word for this long (s), the warm-up is stuck: the GPU process has probably wedged. */
const STUCK_AFTER = 90;
const times: Record<string, number> = {};

async function main(): Promise<void> {
  let steer: { set(id: string, value: unknown): void; trigger(id: string): void; visible(on: boolean): void } | null = null;
  const block = patchBlock({
    ...recipeBlock,
    onSet: (id: string, value: unknown) => steer?.set(id, value),
    onTrigger: (id: string) => steer?.trigger(id),
    onVisible: (on: boolean) => steer?.visible(on),
  });
  block.progress(0.02, 'Loading the demo');
  let heard = performance.now();
  const stuck = setInterval(() => {
    if (performance.now() - heard < STUCK_AFTER * 1000) return;
    clearInterval(stuck);
    showTrouble(`The warm-up heard nothing from the graphics card for ${STUCK_AFTER} s.`, true);
    block.ready();
  }, 2000);
  let app: App | null = null;
  const gpu = (navigator as Navigator & { gpu?: GPU }).gpu;
  try {
    if (!gpu) showTrouble('No WebGPU in this browser (navigator.gpu is missing).', false);
    else {
      // Asked for a few times over a few seconds: a GPU process restarting takes that long to come back.
      await findAdapter(gpu);
      const { boot } = await import('./boot.ts');
      const booted = await boot(
        block,
        (share: number, words: string) => {
          heard = performance.now();
          block.progress(share, words);
        },
        deviceLost,
      );
      app = booted.app;
      steer = booted;
    }
  } catch (e) {
    console.warn(e);
    showTrouble(e instanceof Error ? e.message : String(e), true);
  }
  clearInterval(stuck);
  times.ready = performance.now();
  block.ready();
  (window as unknown as { __block: unknown }).__block = { app, block, steer, times, renderer: app?.renderer };
}

void main();
