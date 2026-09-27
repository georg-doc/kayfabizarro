import {
  createTravelModeRouter,
  TRAVEL_MODE_DEFINITIONS,
  TRAVEL_MODE_READY,
} from './travel-mode-router.js';

const calls = [];
const router = createTravelModeRouter({
  modes: TRAVEL_MODE_DEFINITIONS,
  initialMode: 'GROUND',
  applyMode(mode, transaction) {
    // Diagnostic adapter only: record the atomic call. It deliberately owns no movement/camera state.
    calls.push({ mode, transaction });
    return { diagnosticOnly: true, adapterCalls: calls.length };
  },
});

const unavailableAudit = [];
for (const mode of ['DRIVE', 'WATER']) {
  const before = calls.length;
  try { router.set(mode); unavailableAudit.push({ mode, pass: false, code: 'NO_ERROR' }); }
  catch (error) {
    unavailableAudit.push({
      mode,
      pass: error.code === 'TRAVEL_MODE_UNAVAILABLE' && calls.length === before,
      code: error.code || 'ERROR',
    });
  }
}

const tbody = document.getElementById('modes');
for (const mode of TRAVEL_MODE_DEFINITIONS) {
  const tr = document.createElement('tr');
  const presentation = [mode.presentation.actor, mode.presentation.vehicle].filter(Boolean).join(' + ') || 'source required';
  tr.innerHTML = [
    mode.id,
    mode.status,
    mode.movementAdapter.writer || '—',
    (mode.cameraAdapter.writer || '—') + (mode.cameraAdapter.preset ? ' / ' + mode.cameraAdapter.preset : ''),
    mode.supportType,
    presentation,
    mode.allowedFx.length ? mode.allowedFx.join(', ') : 'none',
  ].map((value) => '<td>' + String(value) + '</td>').join('');
  tbody.appendChild(tr);
}

const proof = document.getElementById('proof');
function render(note = 'ready') {
  const report = router.report();
  document.querySelectorAll('[data-mode]').forEach((button) => {
    const mode = router.getMode(button.dataset.mode);
    button.disabled = mode.status !== TRAVEL_MODE_READY;
    button.setAttribute('aria-pressed', String(mode.id === report.mode));
  });
  proof.textContent = [
    'REVISION TRAVEL-MODES-01',
    'mode                 ' + report.mode,
    'activeMovementOwner  ' + report.activeMovementOwner,
    'activeCameraOwner    ' + report.activeCameraOwner,
    'supportType          ' + report.supportType,
    'allowedFx            ' + (report.allowedFx.join(', ') || 'none'),
    'adapterCalls         ' + calls.length,
    'unavailableAudit     ' + unavailableAudit.map((x) => x.mode + ':' + (x.pass ? 'PASS' : 'FAIL') + '/' + x.code).join(' · '),
    'note                 ' + note,
  ].join('\n');
}

document.querySelectorAll('[data-mode]').forEach((button) => {
  button.addEventListener('click', () => {
    const mode = router.getMode(button.dataset.mode);
    if (mode.status !== TRAVEL_MODE_READY) return;
    try {
      router.set(mode.id, { source: 'CONTRACT_REVIEW_CLICK' });
      render('atomic selector call committed; no movement simulated');
    } catch (error) {
      render('ERROR ' + error.message);
    }
  });
});

window.__travelModes01 = {
  schema: 'kfb.travel-modes-01-review/1',
  diagnosticOnly: true,
  acceptedDoubleSpaceMs: 400,
  definitions: TRAVEL_MODE_DEFINITIONS,
  router,
  unavailableAudit,
  report: () => router.report(),
};
render();
