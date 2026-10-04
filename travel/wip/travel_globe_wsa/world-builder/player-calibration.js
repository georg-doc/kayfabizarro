// WB0 player calibration seam.
// Keeps recurring character scale/facing corrections explicit and persistent instead of hard-coding
// another guessed constant into source assets. The Ground player remains owned by WB0; this module
// only applies non-destructive presentation calibration to the stable player root / visual wrapper.

// Kept for backward compatibility with recipes already saved by the first calibration slice.
const FAMILY_KEY = 'kaykit-rig-medium-player';
const DEFAULTS = Object.freeze({ scale: 1, yawDeg: 0 });

function waitForWb0(timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const t0 = performance.now();
    const tick = () => {
      const scene = window.__globe && window.__globe.scene;
      const root = scene && scene.getObjectByName('WB0 Ground Player');
      const visual = root && root.getObjectByName('WB0 Player Visual');
      if (window.__wb0 && scene && root && visual) return resolve({ wb0: window.__wb0, root, visual });
      if (performance.now() - t0 > timeoutMs) return reject(new Error('WB0 calibration timed out waiting for stable player visual root'));
      setTimeout(tick, 40);
    };
    tick();
  });
}

function finite(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function makeSection(panel) {
  const section = document.createElement('div');
  section.className = 'wb0-section wb0-player-calibration';
  section.innerHTML = `
    <h3>Player calibration</h3>
    <label class="wb0-field"><span>Player size</span><input data-player-scale type="range" min="0.25" max="1.5" step="0.05"></label>
    <label class="wb0-field"><span>Scale ×</span><input data-player-scale-number type="number" min="0.25" max="1.5" step="0.05"></label>
    <label class="wb0-field"><span>Facing °</span><input data-player-yaw type="number" min="-180" max="180" step="15"></label>
    <div class="wb0-row"><button class="wb0-btn" data-player-flip>Flip 180°</button><button class="wb0-btn" data-player-reset>Reset</button></div>
    <div class="wb0-status" data-player-readout>Waiting for Ground player…</div>`;
  panel.appendChild(section);
  return section;
}

async function main() {
  const ready = await waitForWb0();
  const wb0 = ready.wb0, root = ready.root, visual = ready.visual;

  wb0.recipe.calibrationFamilies ||= {};
  const saved = wb0.recipe.calibrationFamilies[FAMILY_KEY] || {};
  const calibration = {
    scale: clamp(finite(saved.scale, DEFAULTS.scale), 0.25, 1.5),
    yawDeg: clamp(finite(saved.yawDeg, DEFAULTS.yawDeg), -180, 180),
  };

  const panel = document.querySelector('#wb0-root .wb0-panel');
  if (!panel) throw new Error('WB0 panel not found');
  const section = makeSection(panel);
  const scaleRange = section.querySelector('[data-player-scale]');
  const scaleNumber = section.querySelector('[data-player-scale-number]');
  const yawInput = section.querySelector('[data-player-yaw]');
  const readout = section.querySelector('[data-player-readout]');

  function apply({ persist = false } = {}) {
    calibration.scale = clamp(finite(calibration.scale, 1), 0.25, 1.5);
    calibration.yawDeg = clamp(finite(calibration.yawDeg, 0), -180, 180);

    // Scale belongs to the locomotion root. Facing correction belongs to the stable visual wrapper,
    // so swapping ActionFigure/Monstrosity/Legacy never loses the accepted correction.
    root.scale.setScalar(calibration.scale);
    visual.rotation.y = calibration.yawDeg * Math.PI / 180;
    root.updateMatrixWorld(true);

    wb0.recipe.calibrationFamilies[FAMILY_KEY] = {
      scale: calibration.scale,
      yawDeg: calibration.yawDeg,
      target: 'WB0 Ground Player root + WB0 Player Visual wrapper',
      sourceAssetMutation: false,
    };
    scaleRange.value = String(calibration.scale);
    scaleNumber.value = calibration.scale.toFixed(2);
    yawInput.value = String(Math.round(calibration.yawDeg));
    const nominal = finite(wb0.report && wb0.report().bodyHeight, 0.022);
    readout.textContent = `visual height ≈ ${(nominal * calibration.scale).toFixed(4)}u · yaw ${Math.round(calibration.yawDeg)}° · recipe calibration only`;
    if (persist && wb0.save) wb0.save();
  }

  scaleRange.oninput = () => { calibration.scale = Number(scaleRange.value); apply(); };
  scaleRange.onchange = () => apply({ persist: true });
  scaleNumber.onchange = () => { calibration.scale = Number(scaleNumber.value); apply({ persist: true }); };
  yawInput.onchange = () => { calibration.yawDeg = Number(yawInput.value); apply({ persist: true }); };
  section.querySelector('[data-player-flip]').onclick = () => {
    calibration.yawDeg = calibration.yawDeg >= 0 ? calibration.yawDeg - 180 : calibration.yawDeg + 180;
    apply({ persist: true });
  };
  section.querySelector('[data-player-reset]').onclick = () => {
    calibration.scale = DEFAULTS.scale;
    calibration.yawDeg = DEFAULTS.yawDeg;
    apply({ persist: true });
  };

  apply();
  wb0.playerCalibration = {
    family: FAMILY_KEY,
    get value() { return { ...calibration }; },
    set(scale, yawDeg) { calibration.scale = scale; calibration.yawDeg = yawDeg; apply({ persist: true }); },
    reset() { calibration.scale = 1; calibration.yawDeg = 0; apply({ persist: true }); },
  };
  console.info('[wb0] player calibration mounted', wb0.playerCalibration.value);
}

main().catch((error) => console.warn('[wb0 calibration]', error));
