// When the graphics card can't be had, or is lost: the words for it in the frame, and getting it back. Nothing heavy is
// imported here, so this works however far the demo got.

/** The browser has WebGPU but no adapter, or a device it gave stopped working. Usually its GPU process is in trouble. */
export class GpuTrouble extends Error {}

const box = () => document.getElementById('nogpu') as HTMLElement;

/** How long to wait before each try for an adapter (ms): a GPU process restarting takes a few seconds to come back. */
const TRIES = [0, 500, 1500, 3000];

/** An adapter, asked for a few times over a few seconds. */
export async function findAdapter(gpu: GPU): Promise<GPUAdapter> {
  for (const wait of TRIES) {
    if (wait) await new Promise((r) => setTimeout(r, wait));
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' }).catch(() => null);
    if (adapter) return adapter;
  }
  throw new GpuTrouble('The browser has WebGPU, but it offered no graphics adapter after several tries.');
}

/** The message in the frame, in place of the demo. With `reload`, trouble that a reload may well fix. */
export function showTrouble(why: string, reload: boolean): void {
  const b = box();
  if (reload) {
    (b.querySelector('h1') as HTMLElement).textContent = 'The graphics card stopped answering';
    (b.querySelector('.say') as HTMLElement).textContent = "Your browser's graphics process stopped responding. Reload this page, and if that doesn't help, restart the browser.";
    (b.querySelector('.more') as HTMLElement).hidden = true;
    const again = b.querySelector('button') as HTMLButtonElement;
    again.hidden = false;
    again.onclick = () => location.reload();
  }
  (b.querySelector('.why') as HTMLElement).textContent = why;
  b.classList.add('on');
  for (const id of ['label', 'tip', 'credit']) (document.getElementById(id) as HTMLElement).hidden = true;
  (document.getElementById('view') as HTMLElement).style.display = 'none';
  document.getElementById('cover')?.remove();
}

/**
 * The device was lost mid-session (the GPU process crashed or the driver reset): reload once to get a fresh one, and if
 * it's lost again within a minute, say so instead of reloading for ever.
 */
export function deviceLost(info: { reason?: string; message?: string }): void {
  // (The page going away destroys its device: that's no trouble)
  if (info.reason === 'destroyed') return;
  const why = `The graphics device was lost: ${info.message ?? 'no reason given'}`.slice(0, 300);
  console.warn(why);
  const KEY = 'particle-physics-device-lost';
  try {
    const last = Number(sessionStorage.getItem(KEY) ?? 0);
    if (Date.now() - last > 60_000) {
      sessionStorage.setItem(KEY, String(Date.now()));
      location.reload();
      return;
    }
  } catch {
    // (No storage in this frame: nothing to stop a reload loop with, so show the message)
  }
  showTrouble(why, true);
}
