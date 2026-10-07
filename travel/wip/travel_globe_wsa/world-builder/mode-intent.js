// TMB-2 Ground → Flight mode-intent adapter.
//
// Pure timing/intent logic only. It does not install keyboard listeners, move the player,
// write the camera, or call Flight physics. Ground remains the owner of the Space event and
// reports only fresh taps upward after queuing its existing jump.

export const DEFAULT_DOUBLE_SPACE_WINDOW_MS = 400;
export const MIN_DOUBLE_SPACE_WINDOW_MS = 120;
export const MAX_DOUBLE_SPACE_WINDOW_MS = 800;

function defaultNow() {
  if (globalThis.performance && typeof globalThis.performance.now === 'function') return globalThis.performance.now();
  return Date.now();
}

function clampWindowMs(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return DEFAULT_DOUBLE_SPACE_WINDOW_MS;
  return Math.max(MIN_DOUBLE_SPACE_WINDOW_MS, Math.min(MAX_DOUBLE_SPACE_WINDOW_MS, Math.round(n)));
}

export function createGroundFlightIntent({
  windowMs = DEFAULT_DOUBLE_SPACE_WINDOW_MS,
  now = defaultNow,
  onRequestFlight = null,
} = {}) {
  let candidateWindowMs = clampWindowMs(windowMs);
  let firstTapAt = null;
  let lastTapAt = null;
  let firstTapCount = 0;
  let requestCount = 0;
  let resetCount = 0;
  let lastResetReason = 'init';
  let lastResult = null;

  function timestampOf(input = {}) {
    const t = Number(input.timeStamp);
    return Number.isFinite(t) ? t : Number(now());
  }

  function reset(reason = 'reset') {
    firstTapAt = null;
    resetCount += 1;
    lastResetReason = String(reason || 'reset');
    return report();
  }

  function setWindowMs(next) {
    candidateWindowMs = clampWindowMs(next);
    // A timing change must not inherit half of a gesture authored under another window.
    firstTapAt = null;
    lastResetReason = 'window-change';
    return candidateWindowMs;
  }

  function noteGroundSpace(input = {}) {
    if (input.repeat) {
      lastResult = {
        kind: 'IGNORED_REPEAT',
        requestFlight: false,
        windowMs: candidateWindowMs,
      };
      return lastResult;
    }

    const timeStamp = timestampOf(input);
    const previous = firstTapAt;
    const deltaMs = Number.isFinite(previous) ? Math.max(0, timeStamp - previous) : null;
    lastTapAt = timeStamp;

    if (Number.isFinite(previous) && deltaMs <= candidateWindowMs) {
      // Consume the pair before invoking the handoff callback so re-entrant mode changes cannot
      // accidentally leave the intent armed.
      firstTapAt = null;
      requestCount += 1;
      const request = {
        type: 'REQUEST_FLIGHT',
        source: 'GROUND_DOUBLE_SPACE',
        timeStamp,
        deltaMs,
        windowMs: candidateWindowMs,
      };
      const accepted = typeof onRequestFlight === 'function' ? onRequestFlight(request) !== false : true;
      lastResult = {
        kind: 'REQUEST_FLIGHT',
        requestFlight: true,
        accepted,
        deltaMs,
        windowMs: candidateWindowMs,
      };
      return lastResult;
    }

    // No valid pair: this fresh tap is a new first tap. Ground has already queued the jump.
    firstTapAt = timeStamp;
    firstTapCount += 1;
    lastResult = {
      kind: 'FIRST_SPACE',
      requestFlight: false,
      timeStamp,
      previousDeltaMs: deltaMs,
      windowMs: candidateWindowMs,
    };
    return lastResult;
  }

  function report() {
    const t = Number(now());
    const ageMs = Number.isFinite(firstTapAt) && Number.isFinite(t) ? Math.max(0, t - firstTapAt) : null;
    return {
      schema: 'kfb.mobility-mode-intent/1',
      windowMs: candidateWindowMs,
      armed: Number.isFinite(firstTapAt) && ageMs <= candidateWindowMs,
      ageMs,
      firstTapAt,
      lastTapAt,
      firstTapCount,
      requestCount,
      resetCount,
      lastResetReason,
      lastResult,
    };
  }

  return {
    noteGroundSpace,
    setWindowMs,
    reset,
    report,
    get windowMs() { return candidateWindowMs; },
  };
}
