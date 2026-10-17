// Vertrag §6: Debug-Zugang nur über window.__kfb* UND einen URL-Schalter (#debug, #hosttest).
export const DEBUG = typeof location !== 'undefined' && /debug|hosttest/.test(location.hash)
// setzt window.__kfb<name> nur mit Schalter
export function expose(name, value) { if (DEBUG && typeof window !== 'undefined') window['__kfb' + name] = value }
